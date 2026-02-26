output "primary_endpoint" {
  value = aws_db_instance.primary.address
}

output "reader_endpoint" {
  value = var.create_read_replica && length(aws_db_instance.read_replica) > 0 ? aws_db_instance.read_replica[0].address : aws_db_instance.primary.address
}

output "database_name" {
  value = aws_db_instance.primary.db_name
}

output "database_secret_arn" {
  value = aws_secretsmanager_secret.db_credentials.arn
}