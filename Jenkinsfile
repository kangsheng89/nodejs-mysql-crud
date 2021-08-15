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
                    docker build . -t webapp
                    docker tag webapp:${GIT_COMMIT[0..7]} public.ecr.aws/e8j9l0l6/webapp:${GIT_COMMIT[0..7]} 
                    docker push public.ecr.aws/e8j9l0l6/webapp:${GIT_COMMIT[0..7]} 
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
    }
}