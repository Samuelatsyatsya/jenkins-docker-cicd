output "alb_security_group_id" {
  value = aws_security_group.alb_sg.id
}

output "bastion_security_group_id" {
  value = aws_security_group.bastion_sg.id
}

output "app_security_group_id" {
  value = aws_security_group.app_sg.id
}

output "db_security_group_id" {
  value = aws_security_group.db_sg.id
}