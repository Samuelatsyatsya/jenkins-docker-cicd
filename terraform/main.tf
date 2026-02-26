# Get current public IP from multiple sources
data "http" "my_ip_1" {
  url = var.ip_url1
}

data "http" "my_ip_2" {
  url = var.ip_url2
}

data "http" "my_ip_3" {
  url = var.ip_url3
}

# Use the first successful response
locals {
  # Try multiple sources, use first valid response
  my_public_ip = try(
    chomp(data.http.my_ip_1.response_body),
    chomp(data.http.my_ip_2.response_body),
    chomp(data.http.my_ip_3.response_body),
    "0.0.0.0"  # Fallback if all fail
  )
  
  # Use provided CIDRs or auto-detected IP
  bastion_cidrs = length(var.bastion_allowed_cidrs) > 0 ? var.bastion_allowed_cidrs : ["${local.my_public_ip}/32"]
}


resource "random_id" "suffix" {
  byte_length = 4
}

module "vpc" {
  source = "./modules/vpc"
  
  project_name = var.project_name
  environment = var.environment
  
  vpc_cidr = var.vpc_cidr
  availability_zones = var.availability_zones
  
  public_subnet_cidrs = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  database_subnet_cidrs = var.database_subnet_cidrs
}

module "security" {
  source = "./modules/security"
  
  project_name = var.project_name
  environment = var.environment
  vpc_id = module.vpc.vpc_id
  
  app_port = var.app_port
  alb_allowed_cidrs = var.alb_allowed_cidrs
  bastion_allowed_cidrs = local.bastion_cidrs
}

# Add bastion module here
module "bastion" {
  source = "./modules/bastion"
  
  project_name = var.project_name
  environment = var.environment
  suffix = random_id.suffix.hex
  
  vpc_id = module.vpc.vpc_id
  public_subnet_ids = module.vpc.public_subnet_ids
  bastion_security_group_id = module.security.bastion_security_group_id
  
  bastion_instance_type = var.bastion_instance_type
  bastion_ami_id = var.bastion_ami_id
  key_name = var.key_name
  volume_size = var.volume_size
  volume_type = var.volume_type
}

module "database" {
  source = "./modules/database"
  
  project_name = var.project_name
  environment = var.environment
  suffix = random_id.suffix.hex
  
  vpc_id = module.vpc.vpc_id
  db_subnet_ids = module.vpc.database_subnet_ids
  db_security_group_id = module.security.db_security_group_id
  
  db_instance_class = var.db_instance_class
  db_engine_version = var.db_engine_version
  db_name = var.db_name
  db_username = var.db_username
  
  multi_az = var.db_multi_az
  create_read_replica = var.db_create_read_replica
  read_replica_count = var.db_read_replica_count
  
  allocated_storage = var.db_allocated_storage
  max_allocated_storage = var.db_max_allocated_storage
  storage_encrypted = var.db_storage_encrypted
  
  backup_retention_period = var.db_backup_retention_period
  backup_window = var.db_backup_window
  maintenance_window = var.db_maintenance_window
}

module "loadbalancer" {
  source = "./modules/loadbalancer"
  
  project_name = var.project_name
  environment = var.environment
  suffix = random_id.suffix.hex
  
  vpc_id = module.vpc.vpc_id
  public_subnet_ids = module.vpc.public_subnet_ids
  alb_security_group_id = module.security.alb_security_group_id
  
  app_port = var.app_port
  health_check_path = var.health_check_path
  certificate_arn = var.certificate_arn
  enable_https = var.enable_https
}


module "compute" {
  source = "./modules/compute"

  project_name             = var.project_name
  environment              = var.environment
  suffix                   = random_id.suffix.hex

  vpc_id                   = module.vpc.vpc_id
  private_subnet_ids        = module.vpc.private_subnet_ids
  app_security_group_id     = module.security.app_security_group_id
  app_target_group_arn      = module.loadbalancer.app_target_group_arn

  instance_type             = var.instance_type
  ami_id                    = var.ami_id
  key_name                  = var.key_name

  min_size                  = var.asg_min_size
  max_size                  = var.asg_max_size
  desired_capacity          = var.asg_desired_capacity

  app_port                  = var.app_port

  db_endpoint               = module.database.primary_endpoint
  db_reader_endpoint        = module.database.reader_endpoint
  db_name                   = module.database.database_name

  # Bastion security group for SSH access
  bastion_security_group_id = module.security.bastion_security_group_id

  cpu_target_value          = var.cpu_target_value
}


module "ecr" {
  source = "./modules/ecr"

  environment = var.environment
  aws_region = var.aws_region

}