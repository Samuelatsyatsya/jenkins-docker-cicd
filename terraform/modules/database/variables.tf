variable "project_name" {}
variable "environment" {}
variable "suffix" {}

variable "vpc_id" {}
variable "db_subnet_ids" {
  type = list(string)
}
variable "db_security_group_id" {}

variable "db_instance_class" {
  default = "db.t3.micro"
}

variable "db_engine_version" {
  default = "8.0.35"
}

variable "db_name" {}
variable "db_username" {}

variable "multi_az" {
  default = true
}

variable "create_read_replica" {
  default = false
}

variable "read_replica_count" {
  default = 1
}

variable "allocated_storage" {
  default = 20
}

variable "max_allocated_storage" {
  default = 100
}

variable "storage_encrypted" {
  default = true
}

variable "backup_retention_period" {
  default = 7
}

variable "backup_window" {
  default = "03:00-04:00"
}

variable "maintenance_window" {
  default = "sun:04:00-sun:05:00"
}