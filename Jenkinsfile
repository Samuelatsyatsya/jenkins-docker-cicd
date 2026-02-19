pipeline {
    agent any
    
    triggers {
        githubPush()
    }
    
    environment {
        AWS_REGION = credentials('AWS_REGION')
        DB_SECRET_NAME = credentials('DB_SECRET_NAME')
        AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
        ECR_BACKEND_REPO = credentials('ECR_BACKEND_REPO')
        ECR_FRONTEND_REPO = credentials('ECR_FRONTEND_REPO')
        VITE_API_URL = credentials('VITE_API_URL')
        BASTION_HOST = credentials('BASTION_HOST')
     
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Lint') {
            steps {
                script {
                    sh '''
                        python3 -m venv venv
                        . venv/bin/activate
                        pip install ansible-lint ansible-core
                        ansible-galaxy collection install community.docker community.aws
                    '''
                    
                    sh '''
                        . venv/bin/activate
                        export ANSIBLE_ROLES_PATH=ansible/roles
                        # ansible-lint ansible/playbooks/
                    '''
                    
                    sh '''
                        docker run --rm -i hadolint/hadolint < backend/Dockerfile
                    '''
                    
                    sh '''
                        docker run --rm -i hadolint/hadolint < frontend/Dockerfile
                    '''
                    
                    sh '''
                        # docker run --rm -v "${PWD}:/repo" -w /repo rhysd/actionlint:latest -color
                    '''
                }
            }
        }
        
        stage('Build and Deploy') {
            steps {
                script {
                    sh '''
                        aws configure set aws_access_key_id ${AWS_ACCESS_KEY_ID}
                        aws configure set aws_secret_access_key ${AWS_SECRET_ACCESS_KEY}
                        aws configure set region ${AWS_REGION}
                    '''
                    
                    sh '''
                        aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_BACKEND_REPO%/*}
                    '''
                    
                    sh '''
                        IMAGE_TAG=$(echo ${GIT_COMMIT} | cut -c1-8)
                        
                        docker build \
                            -t "${ECR_BACKEND_REPO}:${IMAGE_TAG}" \
                            -t "${ECR_BACKEND_REPO}:latest" \
                            ./backend
                        
                        docker push "${ECR_BACKEND_REPO}:${IMAGE_TAG}"
                        docker push "${ECR_BACKEND_REPO}:latest"
                    '''
                    
                    sh '''
                        IMAGE_TAG=$(echo ${GIT_COMMIT} | cut -c1-8)
                        
                        docker build \
                            --build-arg VITE_API_URL="${VITE_API_URL}" \
                            -t "${ECR_FRONTEND_REPO}:${IMAGE_TAG}" \
                            -t "${ECR_FRONTEND_REPO}:latest" \
                            ./frontend
                        
                        docker push "${ECR_FRONTEND_REPO}:${IMAGE_TAG}"
                        docker push "${ECR_FRONTEND_REPO}:latest"
                    '''
                    
                    sh '''
                        . venv/bin/activate
                        pip install ansible boto3 botocore
                        ansible-galaxy collection install community.aws community.docker
                    '''

                    withCredentials([file(credentialsId: 'SSH_KEY_FILE', variable: 'SSH_KEY_PATH')]) {
                        sh '''
                            mkdir -p ~/.ssh
                            cp "$SSH_KEY_PATH" ~/.ssh/rps-game-keypair.pem
                            chmod 600 ~/.ssh/rps-game-keypair.pem
                            
                            echo "Key lines: $(wc -l < ~/.ssh/rps-game-keypair.pem)"
                        '''
                        
                        sh '''
                            cat > ssh_wrapper.sh << 'EOF'
                    #!/bin/bash
                    ssh -i ~/.ssh/rps-game-keypair.pem -o StrictHostKeyChecking=no -o ProxyCommand="ssh -i ~/.ssh/rps-game-keypair.pem -W %h:%p ubuntu@${BASTION_HOST}" "$@"
                    EOF
                            chmod +x ssh_wrapper.sh
                        '''
                        
                        sh '''
                            echo "Testing bastion connection..."
                            ssh -i ~/.ssh/rps-game-keypair.pem -o StrictHostKeyChecking=no "ubuntu@${BASTION_HOST}" "echo 'Bastion connection successful'"
                        '''
                    }

                    
                    sh '''
                        . venv/bin/activate
                        cd ansible
                        export ANSIBLE_SSH_EXECUTABLE=../ssh_wrapper.sh
                        ansible-playbook playbooks/site.yml -i inventory/aws_ec2.yml
                    '''
                }
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
