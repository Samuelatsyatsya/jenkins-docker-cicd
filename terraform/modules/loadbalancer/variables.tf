variable "project_name" {}
variable "environment" {}
variable "suffix" {}

variable "vpc_id" {}
variable "public_subnet_ids" {
  type = list(string)
}
variable "alb_security_group_id" {}

variable "app_port" {
  default = 80
}

variable "health_check_path" {
  default = "/"
}

variable "certificate_arn" {
  default = null
}

variable "enable_https" {
  default = false
}

# WAF Configuration
variable "enable_waf" {
  description = "Enable WAF protection for ALB"
  type        = bool
  default     = true
}

variable "waf_rate_limit" {
  description = "Requests per 5 minutes from single IP before blocking"
  type        = number
  default     = 2000  # ~6.7 requests/second
}

variable "blocked_ips" {
  description = "List of IPs to manually block (e.g., ['1.2.3.4/32'])"
  type        = list(string)
  default     = []
}

variable "enable_sqli_protection" {
  description = "Enable SQL injection protection"
  type        = bool
  default     = true
}

variable "enable_common_attacks_protection" {
  description = "Enable common web attacks protection"
  type        = bool
  default     = true
}