#! /bin/bash

export PATH=/usr/local/bin:$PATH;

# Instance Identity Metadata Reference - https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-identity-documents.html
sudo yum update -y
sudo amazon-linux-extras install docker
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user

# download from s3 for the .env file
sudo yum install -y curl 
curl https://test-nodejs-env.s3.amazonaws.com/dev/.env-prod --output .env-prod

# docker run --env-file ./.env
docker pull public.ecr.aws/e8j9l0l6/webapp:{{version}}
docker run -p 80:4000 --env-file .env-prod -d public.ecr.aws/e8j9l0l6/webapp:{{version}}