terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }


  # backend "s3" {
  #   bucket         = "three-tier-rps-game-tf-state"
  #   key            = "dev/terraform.tfstate"
  #   region         = "eu-central-1"
  #   # use_lockfile = true
  #   # encrypt        = true
  # }
}
