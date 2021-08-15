pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                // Get some code from a GitHub repository
                // git 'https://github.com/kangsheng89/nodejs-mysql-crud.git/'

                // Run Maven on a Unix agent.
                sh ''' 
                    pwd
                    ls -la
                    docker build . -t webapp
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