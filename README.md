Node.js, Express & MySQL: Simple Add, Edit, Delete, View (CRUD)
========

A simple and basic CRUD application (Create, Read, Update, Delete) using Node.js, Express, MySQL & EJS Templating Engine.

**Blog:** [Node.js, Express & MySQL: Simple Add, Edit, Delete, View (CRUD)](http://blog.chapagain.com.np/node-js-express-mysql-simple-add-edit-delete-view-crud/)

**Creating database and table**

```
create database test;

use test;

CREATE TABLE users (
id int(11) NOT NULL auto_increment,
name varchar(100) NOT NULL,
age int(3) NOT NULL,
email varchar(100) NOT NULL,
PRIMARY KEY (id)
);
```

### Create Image
To Create the Image for the apps
```bash
docker build . -t webapp
```

### Testing
For testing in local, use the command below

```bash
docker run -p 80:4000 --env-file ./.env-sample -d webapp
```
```bash
curl localhost
```

## CI/CD Pipeline

The Pipeline is organize into the section as below

### Build the docker
```bash
docker build . -t webapp${GIT_COMMIT:0:6}
```

### Tag and Storing the Docker image to ECR

it will triggered the Jenkins to build, push docker image, 
```bash
docker tag webapp:${GIT_COMMIT:0:6} public.ecr.aws/e8j9l0l6/webapp:${GIT_COMMIT:0:6}
docker push public.ecr.aws/e8j9l0l6/webapp:${GIT_COMMIT:0:6} 
```

### Deployment

The deployement is using Jenkinsfile throught the branch strategy

When the changes push to release branch, 
update the launch Template userdata and trigger the ASG to refresh instance

```bash
python3 deploy.py ${GIT_COMMIT:0:6}
```

#### Explaination for Deploy
This is the exampe of deployment through Python Boto3 API

#### Logic Flow
1. call get_launch_template() to get the current version of launch template
2. call describe_launch_tmp(version) to get the details of the launch template
3. use get_data() to get the userdata from launch template
4. use gen_code_from_template(commit) to generate new base64 encoded userdata from template file (user_data.tpl)
5. override the data from get_data function
6. Create new launch template from current version using create_launch_tmp(version, data)
7. update launch template and update AutoScallingGroup
8. Lastly refresh the ASG instances via  refresh_asg_instance()

### Reference
https://boto3.amazonaws.com/v1/documentation/api/latest/index.html
https://docs.docker.com/engine/reference/commandline/docker/
https://www.jenkins.io/doc/book/pipeline/syntax/
