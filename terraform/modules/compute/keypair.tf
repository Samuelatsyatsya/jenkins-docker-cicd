# Generate a new SSH key pair locally
resource "tls_private_key" "this" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

# Register the public key with AWS
resource "aws_key_pair" "this" {
  key_name   = var.key_name
  public_key = tls_private_key.this.public_key_openssh
}

# Save the private key locally for Ansible
resource "local_file" "private_key" {
  content          = tls_private_key.this.private_key_pem
  filename         = "${path.module}/keys/${var.key_name}.pem"
  file_permission  = "0600"
}
