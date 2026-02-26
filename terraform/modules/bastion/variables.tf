variable "project_name" {}
variable "environment" {}
variable "suffix" {}

variable "vpc_id" {}
variable "public_subnet_ids" {
  type = list(string)
}
variable "bastion_security_group_id" {}

variable "bastion_instance_type" {
}

variable "bastion_ami_id" {}

variable "key_name" {
}

variable "volume_size" {
  description = "volume size in GB"
  type = number
}

variable "volume_type" {
  description = "volume type"
  type = string
}