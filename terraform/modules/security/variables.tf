variable "project_name" {}
variable "environment" {}
variable "vpc_id" {}

variable "app_port" {
  default = 80
}

variable "alb_allowed_cidrs" {
  type    = list(string)
  default = ["0.0.0.0/0"]
}

variable "bastion_allowed_cidrs" {
  type    = list(string)
  default = []
}