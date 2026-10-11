
pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-south-1'
        ECR_REPOSITORY = '789130777577.dkr.ecr.ap-south-1.amazonaws.com/task-manager'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build -t $ECR_REPOSITORY:$IMAGE_TAG ./backend
                '''
            }
        }

        stage('Login to ECR') {
            steps {
                sh '''
                    aws ecr get-login-password --region $AWS_REGION |
                    docker login --username AWS --password-stdin \
                    789130777577.dkr.ecr.ap-south-1.amazonaws.com
                '''
            }
        }

        stage('Push Image to ECR') {
            steps {
                sh '''
                    docker push $ECR_REPOSITORY:$IMAGE_TAG
                '''
            }
        }

        stage('Helm Validation') {
            steps {
                sh '''
                    helm lint ./helm/task-manager
                    helm template task-manager ./helm/task-manager
                '''
            }
        }
    }
}
