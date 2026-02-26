# outputs.tf
# output "ecr_repository_url" {
#   description = "URL of the ECR repository"
#   value       = aws_ecr_repository.rps_game.repository_url
# }

# output "ecr_repository_arn" {
#   description = "ARN of the ECR repository"
#   value       = aws_ecr_repository.rps_game.arn
# }

# output "ecr_registry_id" {
#   description = "Registry ID where the repository is located"
#   value       = aws_ecr_repository.rps_game.registry_id
# }


output "backend_ecr_repo_url" {
  description = "URL for the backend ECR repository"
  value       = aws_ecr_repository.backend.repository_url
}

output "frontend_ecr_repo_url" {
  description = "URL for the frontend ECR repository"
  value       = aws_ecr_repository.frontend.repository_url
}
