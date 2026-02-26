output "alb_dns_name" {
  description = "DNS name of Application Load Balancer"
  value       = module.loadbalancer.alb_dns_name
}

output "application_url" {
  description = "URL to access the application"
  value       = var.enable_https
}

output "database_primary_endpoint" {
  description = "Primary RDS endpoint"
  value       = module.database.primary_endpoint
  sensitive   = true
}

output "database_reader_endpoint" {
  description = "RDS reader endpoint"
  value       = module.database.reader_endpoint
  sensitive   = true
}

output "database_name" {
  description = "Database name"
  value       = module.database.database_name
  sensitive   = true
}

output "database_secret_arn" {
  description = "ARN of database credentials secret"
  value       = module.database.database_secret_arn
  sensitive   = true
}

output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "app_security_group_id" {
  description = "App security group ID"
  value       = module.security.app_security_group_id
}

output "asg_name" {
  description = "Auto Scaling Group name"
  value       = module.compute.asg_name
}

# Bastion outputs
output "bastion_public_ip" {
  description = "Public IP address of bastion host"
  value       = module.bastion.bastion_public_ip
}

output "bastion_allowed_ip" {
  description = "IP address allowed to access bastion"
  value       = local.my_public_ip
  sensitive   = false
}

output "bastion_ssh_command" {
  description = "SSH command to connect to bastion host"
  value       = var.key_name != null ? "ssh -i ${var.key_name}.pem ec2-user@${module.bastion.bastion_public_ip}" : "SSH key not configured"
}

output "bastion_security_group_id" {
  description = "Bastion security group ID"
  value       = module.security.bastion_security_group_id
}

output "backend_ecr_repo_url" {
  description = "URL for the backend ECR repository"
  value       = module.ecr.backend_ecr_repo_url 
}

output "frontend_ecr_repo_url" {
  description = "URL for the frontend ECR repository"
  value       = module.ecr.frontend_ecr_repo_url
}