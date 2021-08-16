import os
import jinja2
import boto3
import base64
import json

import sys

commit = sys.argv[1]

template_id = 'lt-0d2245566a36cbb20'
auto_scalling_grp = 'myasg-2021081405143361730000000a'

region = 'us-east-1'
client = boto3.client('ec2', region_name=region)
asg = boto3.client('autoscaling', region_name=region)

def gen_code_from_template(version):
    template_path = '.'
    filename = 'user_data'
    template_file = filename + '.tpl'

    templateLoader = jinja2.FileSystemLoader(searchpath=template_path)
    templateEnv = jinja2.Environment(loader=templateLoader)
    template = templateEnv.get_template(template_file)
    outputText = template.render(version=version)
    
    encoded = base64.b64encode(str.encode(outputText))
    return encoded
    
def get_launch_template():
    response = client.describe_launch_templates( \
        LaunchTemplateIds=[template_id])
    return response
    
def latest_version(response):
    return response['LaunchTemplates'][0]['LatestVersionNumber']
    
def describe_launch_tmp(version):
    response = client.describe_launch_template_versions(
        LaunchTemplateId=template_id,
        Versions=[str(version)])
    return response
    
def get_data(response):
    return response['LaunchTemplateVersions'][0]['LaunchTemplateData']
    

def create_launch_tmp(source_version, data):
    response = client.create_launch_template_version(
        LaunchTemplateId=template_id,
        SourceVersion= str(source_version),
        LaunchTemplateData = data)
        
    return response

def update_launch_tmp(source_version):   
    response = client.modify_launch_template(
        LaunchTemplateId=template_id,
        DefaultVersion=str(source_version)
    )
    return response

def update_asg(source_version): 
    
    response = asg.update_auto_scaling_group(
        AutoScalingGroupName=auto_scalling_grp,
        LaunchTemplate={
            'LaunchTemplateId': template_id,
            'Version': str(source_version)
        }
    )
    return response

def refresh_asg_instance(): 
    response = asg.start_instance_refresh(
        AutoScalingGroupName=auto_scalling_grp)
    return response
    

#print (gen_code_from_template(commit))
response = get_launch_template()
version = latest_version(response)
curr_tmp = describe_launch_tmp(version)
data = get_data(curr_tmp)
data['UserData'] = gen_code_from_template(commit).decode("utf-8") 

print(create_launch_tmp(version, data))
print(update_launch_tmp(version+1))
print(update_asg(version+1))
print(refresh_asg_instance())



