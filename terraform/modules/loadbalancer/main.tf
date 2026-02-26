resource "aws_lb" "app" {
  name               = "${var.project_name}-alb-${var.suffix}"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.alb_security_group_id]
  subnets            = var.public_subnet_ids

  enable_deletion_protection = false

  tags = {
    Name = "${var.project_name}-alb-${var.environment}"
  }
}

resource "aws_lb_target_group" "app" {
  name_prefix = substr(var.project_name, 0, 5)  # 5 chars + auto-generated suffix
  port        = var.app_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id

  health_check {
    enabled             = true
    interval            = 30
    path                = var.health_check_path
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200"
  }

  tags = {
    Name = "${var.project_name}-tg-${var.environment}"
  }

  lifecycle {
    create_before_destroy = true
  }
}



resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.app.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }

  tags = {
    Name = "${var.project_name}-http-listener-${var.environment}"
  }
}

# resource "aws_lb_listener" "http" {
#   count = var.enable_https ? 1 : 0
  
#   load_balancer_arn = aws_lb.app.arn
#   port              = "443"
#   protocol          = "HTTP"
#   certificate_arn   = var.certificate_arn

#   default_action {
#     type             = "forward"
#     target_group_arn = aws_lb_target_group.app.arn
#   }

#   tags = {
#     Name = "${var.project_name}-https-listener-${var.environment}"
#   }
# }


