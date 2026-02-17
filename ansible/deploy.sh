#!/bin/bash

set -e  # Exit on error

echo "Rock Paper Scissors Game Deployment"


# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_message "Checking prerequisites..."
    
    # Check Ansible
    if ! command -v ansible &> /dev/null; then
        print_error "Ansible is not installed. Please install it first."
        print_message "Install with: pip install ansible"
        exit 1
    fi
    
    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        print_warning "AWS CLI is not installed. Some features may not work."
    fi
    
    # Check jq
    if ! command -v jq &> /dev/null; then
        print_error "jq is not installed. Please install it first."
        print_message "Install with: sudo apt-get install jq (Ubuntu) or brew install jq (macOS)"
        exit 1
    fi
    
    # Check SSH key
    if [ ! -f ~/.ssh/id_rsa ]; then
        print_warning "SSH key ~/.ssh/id_rsa not found. Deployment may fail."
    fi
    
    print_message "Prerequisites check passed ✓"
}

# Get Terraform outputs
get_terraform_outputs() {
    print_message "Getting Terraform outputs..."
    
    if [ ! -d "terraform" ]; then
        print_error "terraform/ directory not found. Make sure you're in the project root."
        exit 1
    fi
    
    cd terraform
    
    # Get Terraform outputs as JSON
    terraform output -json > ../ansible/terraform_outputs.json
    
    # Extract specific values
    DB_ENDPOINT=$(terraform output -raw database_primary_endpoint 2>/dev/null || echo "")
    DB_NAME=$(terraform output -raw database_name 2>/dev/null || echo "rpsdb")
    ALB_DNS=$(terraform output -raw alb_dns_name 2>/dev/null || echo "")
    
    # Get database password from Secrets Manager
    if [ -n "$DB_ENDPOINT" ]; then
        print_message "Getting database password from AWS Secrets Manager..."
        DB_PASSWORD=$(aws secretsmanager get-secret-value \
            --secret-id three-tier-game-db-credentials \
            --query SecretString \
            --output text 2>/dev/null | jq -r '.password' || echo "")
        
        if [ -z "$DB_PASSWORD" ]; then
            print_warning "Could not retrieve database password. You may need to set it manually."
        fi
    fi
    
    # Get instance IPs
    print_message "Getting instance IPs from Terraform state..."
    INSTANCE_IPS=$(terraform state list | grep aws_instance | xargs -I {} terraform state show {} | grep private_ip | awk '{print $3}' | tr '\n' ' ')
    
    cd ..
    
    # Export variables
    export DB_ENDPOINT
    export DB_NAME
    export DB_PASSWORD
    export ALB_DNS
    export INSTANCE_IPS
    
    print_message "Terraform outputs retrieved ✓"
}

# Update Ansible inventory
update_inventory() {
    print_message "Updating Ansible inventory..."
    
    cd ansible
    
    # Create inventory directory if it doesn't exist
    mkdir -p inventory
    
    # Create inventory file
    cat > inventory/production.ini << EOF
[web_servers]
EOF
    
    # Add instances to inventory
    for ip in $INSTANCE_IPS; do
        if [ -n "$ip" ]; then
            echo "$ip" >> inventory/production.ini
            print_message "  Added instance: $ip"
        fi
    done
    
    # Add inventory variables
    cat >> inventory/production.ini << EOF

[web_servers:vars]
ansible_user=ec2-user
ansible_ssh_private_key_file=~/.ssh/id_rsa
ansible_python_interpreter=/usr/bin/python3
ansible_ssh_common_args='-o StrictHostKeyChecking=no'

[database]
EOF
    
    # Add database if available
    if [ -n "$DB_ENDPOINT" ]; then
        echo "$DB_ENDP