variable "project_name" {}
variable "environment" {}
variable "suffix" {}

variable "vpc_id" {}
variable "private_subnet_ids" {
  type = list(string)
}
variable "app_security_group_id" {}
variable "app_target_group_arn" {}

variable "instance_type" {
}

variable "ami_id" {}

variable "key_name" {
  default = null
}

variable "min_size" {
  description = "Minimum number of instances in ASG"
  default     = 2
}

variable "max_size" {
  description = "Maximum number of instances in ASG"
  default     = 10
}

variable "desired_capacity" {
  description = "Initial desired capacity (scaling policies will adjust)"
  default     = 2
}

variable "app_port" {
  default = 80
}

variable "db_endpoint" {}
variable "db_reader_endpoint" {}
variable "db_name" {}

variable "bastion_security_group_id" {}

# Target tracking configuration
variable "cpu_target_value" {
  description = "CPU utilization percentage to maintain (e.g., 50.0 for 50%)"
  type        = number
  default     = 50.0
}

# Optional scheduled scaling
variable "enable_scheduled_scaling" {
  description = "Enable scheduled scaling for predictable traffic patterns"
  type        = bool
  default     = false
}

variable "business_hours_min_size" {
  description = "Minimum instances during business hours"
  default     = 3
}

variable "business_hours_max_size" {
  description = "Maximum instances during business hours"
  default     = 12
}

variable "business_hours_desired_capacity" {
  description = "Desired instances during business hours"
  default     = 4
}

variable "off_hours_min_size" {
  description = "Minimum instances during off hours"
  default     = 1
}

variable "off_hours_max_size" {
  description = "Maximum instances during off hours"
  default     = 4
}

variable "off_hours_desired_capacity" {
  description = "Desired instances during off hours"
  default     = 2
}