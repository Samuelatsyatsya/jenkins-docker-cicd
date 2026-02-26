output "asg_name" {
  value = aws_autoscaling_group.app.name
}

output "launch_template_id" {
  value = aws_launch_template.app.id
}

output "scaling_policy_arn" {
  value = aws_autoscaling_policy.cpu_target_tracking.arn
}

output "current_instance_count" {
  description = "Current number of instances (will change with scaling)"
  value       = aws_autoscaling_group.app.desired_capacity
}