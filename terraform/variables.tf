variable "aws_region" {
  type        = string
  description = "AWS region to deploy resources"
}

variable "project_name" {
  type        = string
  description = "Name of the project for resource naming"
}

variable "environment" {
  type        = string
  description = "Environment name (dev, staging, prod)"
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for the VPC"
}

variable "availability_zones" {
  type        = list(string)
  description = "List of availability zones for multi-AZ deployment"
}

variable "public_subnet_cidrs" {
  type        = list(string)
  description = "CIDR blocks for public subnets"
}

variable "private_subnet_cidrs" {
  type        = list(string)
  description = "CIDR blocks for private subnets"
}

variable "database_subnet_cidrs" {
  type        = list(string)
  description = "CIDR blocks for database subnets"
}

variable "app_port" {
  type        = number
  description = "Port that application listens on"
}

variable "alb_allowed_cidrs" {
  type        = list(string)
  description = "CIDR blocks allowed to access ALB"
}

variable "ip_url1" {
  type = string
  description = "First Site to get admin IP"
}

variable "ip_url2" {
  type = string
  description = "Second Site to get admin IP"
}

variable "ip_url3" {
  type = string
  description = "Third Site to get admin IP"
}
variable "bastion_allowed_cidrs" {
  type        = list(string)
  description = "CIDR blocks allowed SSH access to bastion"
}

# Bastion Configuration
variable "bastion_instance_type" {
  type        = string
  description = "EC2 instance type for bastion host"
}

variable "bastion_ami_id" {
  type        = string
  description = "AMI ID for bastion host"
}

variable "volume_size" {
  description = "volume size in GB"
  type = number
}

variable "volume_type" {
  description = "volume type"
  type = string
}

variable "db_instance_class" {
  type        = string
  description = "RDS instance class"
}

variable "db_engine_version" {
  type        = string
  description = "MySQL engine version"
}

variable "db_name" {
  type        = string
  description = "Name of the database"
}

variable "db_username" {
  type        = string
  description = "Master username for database"
}

variable "db_multi_az" {
  type        = bool
  description = "Enable Multi-AZ deployment for RDS"
}

variable "db_create_read_replica" {
  type        = bool
  description = "Create read replica for database"
}

variable "db_read_replica_count" {
  type        = number
  description = "Number of read replicas to create"
}

variable "db_allocated_storage" {
  type        = number
  description = "Initial storage allocated to database in GB"
}

variable "db_max_allocated_storage" {
  type        = number
  description = "Maximum storage database can auto-scale to in GB"
}

variable "db_storage_encrypted" {
  type        = bool
  description = "Enable encryption for database storage"
}

variable "db_backup_retention_period" {
  type        = number
  description = "Number of days to keep automated backups"
}

variable "db_backup_window" {
  type        = string
  description = "Time window for automated backups"
}

variable "db_maintenance_window" {
  type        = string
  description = "Time window for database maintenance"
}

variable "health_check_path" {
  type        = string
  description = "Path for ALB health checks"
}

variable "certificate_arn" {
  type        = string
  description = "ARN of SSL certificate for HTTPS"
}

variable "enable_https" {
  type        = bool
  description = "Enable HTTPS listener on ALB"
}

variable "instance_type" {
  type        = string
  description = "EC2 instance type for app servers"
}

variable "ami_id" {
  type        = string
  description = "AMI ID for app instances"
}

variable "key_name" {
  type        = string
  description = "SSH key pair name for instances"
}

variable "asg_min_size" {
  type        = number
  description = "Minimum number of instances in ASG"
}

variable "asg_max_size" {
  type        = number
  description = "Maximum number of instances in ASG"
}

variable "asg_desired_capacity" {
  type        = number
  description = "Desired number of instances in ASG"
}

variable "cpu_target_value" {
  type        = number
  description = "CPU percentage to maintain with target tracking"
}

variable "estimated_savings" {
  description = "Cost savings estimate from spot instances"
  type = string
}

# WAF Configuration (Cost-Optimized)
variable "enable_waf" {
  type        = bool
  description = "Enable Web Application Firewall protection (no CloudWatch)"
}

variable "waf_rate_limit" {
  type        = number
  description = "Max requests per 5 minutes per IP (2000 = ~6.7 RPS)"
}

variable "waf_blocked_ips" {
  type        = list(string)
  description = "Manually blocked IP addresses (e.g., ['1.2.3.4/32'])"
}

variable "waf_enable_sqli" {
  type        = bool
  description = "Enable SQL injection protection ($1/month extra)"
}

variable "waf_enable_common_rules" {
  type        = bool
  description = "Enable common attacks protection ($1/month extra)"
}