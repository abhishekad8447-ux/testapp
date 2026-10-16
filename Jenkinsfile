
pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-south-1'
        ECR_REPOSITORY = '789130777577.dkr.ecr.ap-south-1.amazonaws.com/task-manager'
        IMAGE_TAG = "${BUILD_NUMBER}"
        HELM_CHART = '/opt/task-manager-gitops/task-manager'
    }

    stages {
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $ECR_REPOSITORY:$IMAGE_TAG ./backend'
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
                sh 'docker push $ECR_REPOSITORY:$IMAGE_TAG'
            }
        }

        stage('Helm Validation') {
            steps {
                sh '''
                    helm lint $HELM_CHART
                    helm template task-manager $HELM_CHART \
                      --namespace task-manager \
                      --set image.repository=$ECR_REPOSITORY \
                      --set image.tag=$IMAGE_TAG
                '''
            }
        }

        stage('Deploy to EKS') {
            steps {
                sh '''
                    helm upgrade --install task-manager $HELM_CHART \
                      --namespace task-manager \
                      --set image.repository=$ECR_REPOSITORY \
                      --set image.tag=$IMAGE_TAG \
                      --wait \
                      --timeout 5m
                '''
            }
        }
    }
}
