resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-db-subnet-group-${var.environment}"
  subnet_ids = var.db_subnet_ids

  tags = {
    Name = "${var.project_name}-db-subnet-group-${var.environment}"
  }
}

resource "random_password" "db_password" {
  length  = 16
  special = false
}

resource "aws_secretsmanager_secret" "db_credentials" {
  name = "${var.project_name}-db-credentials-${var.environment}-${var.suffix}"
  
  tags = {
    Name = "${var.project_name}-db-credentials-${var.environment}"
  }
}

resource "aws_secretsmanager_secret_version" "db_credentials" {
  secret_id = aws_secretsmanager_secret.db_credentials.id
  secret_string = jsonencode({
    username = var.db_username
    password = random_password.db_password.result
    engine   = "mysql"
    host     = aws_db_instance.primary.address
    port     = 3306
    dbname   = var.db_name
  })
}

resource "aws_db_instance" "primary" {
  identifier = "${var.project_name}-db-primary-${var.environment}-${var.suffix}"
  
  engine         = "mysql"
  engine_version = var.db_engine_version
  instance_class = var.db_instance_class
  
  allocated_storage     = var.allocated_storage
  max_allocated_storage = var.max_allocated_storage
  storage_type         = "gp3"
  storage_encrypted    = var.storage_encrypted
  
  db_name  = var.db_name
  username = var.db_username
  password = random_password.db_password.result
  port     = 3306
  
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [var.db_security_group_id]
  
  multi_az               = var.multi_az
  publicly_accessible    = false
  skip_final_snapshot    = true
  deletion_protection    = false
  
  backup_retention_period = var.backup_retention_period
  backup_window          = var.backup_window
  maintenance_window     = var.maintenance_window
  
  tags = {
    Name = "${var.project_name}-db-primary-${var.environment}"
  }
}

resource "aws_db_instance" "read_replica" {
  count = var.create_read_replica ? var.read_replica_count : 0
  
  identifier = "${var.project_name}-db-replica-${var.environment}-${count.index + 1}-${var.suffix}"
  
  replicate_source_db = aws_db_instance.primary.identifier
  instance_class     = var.db_instance_class
  
  publicly_accessible = false
  skip_final_snapshot = true
  
  vpc_security_group_ids = [var.db_security_group_id]
  
  tags = {
    Name = "${var.project_name}-db-replica-${var.environment}-${count.index + 1}"
  }
  
  depends_on = [aws_db_instance.primary]
}