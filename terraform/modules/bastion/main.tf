resource "aws_instance" "bastion" {
  ami           = var.bastion_ami_id
  instance_type = var.bastion_instance_type
  key_name      = var.key_name
  
  subnet_id                   = var.public_subnet_ids[0]
  vpc_security_group_ids     = [var.bastion_security_group_id]
  associate_public_ip_address = true
  
  root_block_device {
    volume_size = var.volume_size
    volume_type = var.volume_type
    encrypted   = true
  }
  
  tags = {  

     
    Name = "${var.project_name}-bastion-${var.environment}"
    Tier = "bastion"
  }
  
  lifecycle {
    create_before_destroy = true
  }
}

# Elastic IP for bastion
resource "aws_eip" "bastion" {
  domain = "vpc"
  
  tags = {
    Name = "${var.project_name}-bastion-eip-${var.environment}"
  }
}

resource "aws_eip_association" "bastion" {
  instance_id   = aws_instance.bastion.id
  allocation_id = aws_eip.bastion.id
}