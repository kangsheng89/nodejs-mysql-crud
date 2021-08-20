pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                // Run docker on a Unix agent.
                sh ''' 
                    env
                    pwd
                    ls -la
                    docker build . -t webapp:${GIT_COMMIT:0:6}
                '''
            }
            

            post {
                // If Maven was able to run the tests, even if some of the test
                // failed, record the test results and archive the jar file.
                success {
                    echo "Done"
                }
            }
        }
        stage('Tag Upload') {
            steps {
                script {
                        sh ''' 
                            echo 'Upload...'
                            docker tag webapp:${GIT_COMMIT:0:6} public.ecr.aws/e8j9l0l6/webapp:${GIT_COMMIT:0:6}
                            docker push public.ecr.aws/e8j9l0l6/webapp:${GIT_COMMIT:0:6} 
                        '''
                }
            }
        }
        
        stage ('Deploy'){
            steps{
                script {
                    if (env.BRANCH_NAME ==~ /^release.+/) {
                        echo "deploy..."
                        sh '''
                            python3 deploy.py ${GIT_COMMIT:0:6} 
                        '''
                    }
                }
            }
        }
        
    }
}
