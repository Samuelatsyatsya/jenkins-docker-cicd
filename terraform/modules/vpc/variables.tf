variable "aws_region" {
  type        = string
  description = "AWS region to deploy resources"
  default     = "eu-central-1"
}

variable "project_name" {
  type        = string
  description = "Name of the project for resource naming"
  default     = "three-tier-app"
}

variable "environment" {
  type        = string
  description = "Environment name (dev, staging, prod)"
  default     = "dev"
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for the VPC"
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  type        = list(string)
  description = "List of availability zones for multi-AZ deployment"
  default     = ["eu-central-1a", "eu-central-1b", "eu-central-1c"]
}

variable "public_subnet_cidrs" {
  type        = list(string)
  description = "CIDR blocks for public subnets"
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "private_subnet_cidrs" {
  type        = list(string)
  description = "CIDR blocks for private subnets"
  default     = ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"]
}

variable "database_subnet_cidrs" {
  type        = list(string)
  description = "CIDR blocks for database subnets"
  default     = ["10.0.7.0/24", "10.0.8.0/24", "10.0.9.0/24"]
}

variable "app_port" {
  type        = number
  description = "Port that application listens on"
  default     = 80
}

variable "alb_allowed_cidrs" {
  type        = list(string)
  description = "CIDR blocks allowed to access ALB"
  default     = ["0.0.0.0/0"]
}

variable "bastion_allowed_cidrs" {
  type        = list(string)
  description = "CIDR blocks allowed SSH access to bastion"
  default     = []
}

# Bastion Configuration
variable "bastion_instance_type" {
  type        = string
  description = "EC2 instance type for bastion host"
  default     = "t3.micro"
}

variable "bastion_ami_id" {
  type        = string
  description = "AMI ID for bastion host"
  default     = ""
}

variable "db_instance_class" {
  type        = string
  description = "RDS instance class"
  default     = "db.t3.micro"
}

variable "db_engine_version" {
  type        = string
  description = "MySQL engine version"
  default     = "8.0.35"
}

variable "db_name" {
  type        = string
  description = "Name of the database"
  default     = "appdb"
}

variable "db_username" {
  type        = string
  description = "Master username for database"
  default     = "admin"
}

variable "db_multi_az" {
  type        = bool
  description = "Enable Multi-AZ deployment for RDS"
  default     = true
}

variable "db_create_read_replica" {
  type        = bool
  description = "Create read replica for database"
  default     = true
}

variable "db_read_replica_count" {
  type        = number
  description = "Number of read replicas to create"
  default     = 1
}

variable "db_allocated_storage" {
  type        = number
  description = "Initial storage allocated to database in GB"
  default     = 20
}

variable "db_max_allocated_storage" {
  type        = number
  description = "Maximum storage database can auto-scale to in GB"
  default     = 100
}

variable "db_storage_encrypted" {
  type        = bool
  description = "Enable encryption for database storage"
  default     = true
}

variable "db_backup_retention_period" {
  type        = number
  description = "Number of days to keep automated backups"
  default     = 7
}

variable "db_backup_window" {
  type        = string
  description = "Time window for automated backups"
  default     = "03:00-04:00"
}

variable "db_maintenance_window" {
  type        = string
  description = "Time window for database maintenance"
  default     = "sun:04:00-sun:05:00"
}

variable "health_check_path" {
  type        = string
  description = "Path for ALB health checks"
  default     = "/"
}

variable "certificate_arn" {
  type        = string
  description = "ARN of SSL certificate for HTTPS"
  default     = null
}

variable "enable_https" {
  type        = bool
  description = "Enable HTTPS listener on ALB"
  default     = false
}

variable "instance_type" {
  type        = string
  description = "EC2 instance type for app servers"
  default     = "t3.micro"
}

variable "ami_id" {
  type        = string
  description = "AMI ID for app instances"
  default     = ""
}

variable "key_name" {
  type        = string
  description = "SSH key pair name for instances"
  default     = null
}

variable "asg_min_size" {
  type        = number
  description = "Minimum number of instances in ASG"
  default     = 2
}

variable "asg_max_size" {
  type        = number
  description = "Maximum number of instances in ASG"
  default     = 4
}

variable "asg_desired_capacity" {
  type        = number
  description = "Desired number of instances in ASG"
  default     = 2
}