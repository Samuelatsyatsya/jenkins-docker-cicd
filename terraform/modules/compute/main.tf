# IAM role for EC2 instances
resource "aws_iam_role" "ec2_role" {
  name = "${var.project_name}-${var.environment}-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "${var.project_name}-${var.environment}-ec2-role"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# IAM policy for Secrets Manager and ECR access
resource "aws_iam_role_policy" "ec2_permissions" {
  name = "${var.project_name}-${var.environment}-ec2-permissions"
  role = aws_iam_role.ec2_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage"
        ]
        Resource = "*"
      }
    ]
  })
}

# Instance profile
resource "aws_iam_instance_profile" "ec2_profile" {
  name = "${var.project_name}-${var.environment}-ec2-profile"
  role = aws_iam_role.ec2_role.name

  tags = {
    Name        = "${var.project_name}-${var.environment}-ec2-profile"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# Launch template
resource "aws_launch_template" "app" {
  name_prefix   = "${var.project_name}-app-lt-${var.environment}-"
  image_id      = var.ami_id
  instance_type = var.instance_type
  key_name      = var.key_name
  
  vpc_security_group_ids = [var.app_security_group_id]
  
  # Add IAM instance profile
  iam_instance_profile {
    name = aws_iam_instance_profile.ec2_profile.name
  }
  
  # Minimal user_data for Ansible preparation
  # user_data = base64encode(templatefile("${path.module}/user_data.sh", {
  #   app_port = var.app_port
  # }))

  block_device_mappings {
    device_name = "/dev/xvda"
    ebs {
      volume_size = 20
      volume_type = "gp3"
      encrypted   = true
    }
  }

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name     = "${var.project_name}-app-instance-${var.environment}"
      Tier     = "app"
      Ansible  = "true"
      Role     = "webapp"
    }
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_autoscaling_group" "app" {
  name_prefix         = "${var.project_name}-app-asg-${var.environment}-"
  vpc_zone_identifier = var.private_subnet_ids
  
  desired_capacity = var.desired_capacity
  min_size         = var.min_size
  max_size         = var.max_size

  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }

  health_check_type         = "ELB"
  health_check_grace_period = 300
  
  target_group_arns = [var.app_target_group_arn]

  # Instance protection for new instances
  initial_lifecycle_hook {
    name                 = "${var.project_name}-scale-in-protection"
    lifecycle_transition = "autoscaling:EC2_INSTANCE_LAUNCHING"
    default_result       = "CONTINUE"
    heartbeat_timeout    = 300
  }

  tag {
    key                 = "Name"
    value               = "${var.project_name}-app-instance-${var.environment}"
    propagate_at_launch = true
  }

  tag {
    key                 = "Tier"
    value               = "app"
    propagate_at_launch = true
  }

  tag {
    key                 = "ManagedBy"
    value               = "Terraform"
    propagate_at_launch = true
  }

  lifecycle {
    create_before_destroy = true
    ignore_changes = [
      desired_capacity  # Let scaling policies manage this
    ]
  }
}

# Target Tracking Scaling Policy
resource "aws_autoscaling_policy" "cpu_target_tracking" {
  name                   = "${var.project_name}-cpu-tracking-${var.environment}"
  policy_type            = "TargetTrackingScaling"
  autoscaling_group_name = aws_autoscaling_group.app.name
  
  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }
    
    target_value = var.cpu_target_value  # From variable, e.g., 50.0
    
    # Optional: Disable scale-in during certain hours
    # disable_scale_in = false
    
    # Optional: Add cooldown
    # scale_in_cooldown  = 300
    # scale_out_cooldown = 60
  }
}

# Optional: Scheduled scaling for predictable patterns
resource "aws_autoscaling_schedule" "scale_up_business_hours" {
  count = var.enable_scheduled_scaling ? 1 : 0
  
  scheduled_action_name  = "${var.project_name}-scale-up-business-hours"
  min_size               = var.business_hours_min_size
  max_size               = var.business_hours_max_size
  desired_capacity       = var.business_hours_desired_capacity
  recurrence             = "0 9 * * MON-FRI"  # 9 AM weekdays
  time_zone              = "UTC"
  autoscaling_group_name = aws_autoscaling_group.app.name
}

resource "aws_autoscaling_schedule" "scale_down_off_hours" {
  count = var.enable_scheduled_scaling ? 1 : 0
  
  scheduled_action_name  = "${var.project_name}-scale-down-off-hours"
  min_size               = var.off_hours_min_size
  max_size               = var.off_hours_max_size
  desired_capacity       = var.off_hours_desired_capacity
  recurrence             = "0 18 * * MON-FRI"  # 6 PM weekdays
  time_zone              = "UTC"
  autoscaling_group_name = aws_autoscaling_group.app.name
}
