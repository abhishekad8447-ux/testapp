pipeline {
    agent any

    stages {
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t task-manager:${BUILD_NUMBER} ./backend'
            }
        }

        stage('Helm Lint') {
            steps {
                sh 'helm lint ./helm/task-manager'
            }
        }

        stage('Helm Render') {
            steps {
                sh 'helm template task-manager ./helm/task-manager'
            }
        }
    }
}
