# VERSION 0.2
# DOCKER-VERSION 0.3.4
# To build:
# 1. Install docker (http://docker.io)
# 2. Checkout source: git@github.com:whw720/learngit.git
# 3. Build container: docker build .

FROM   FROM daocloud.io/node:0.10-onbuild
# centos:centos6

# Enable EPEL for Node.js
#RUN     rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
# Install Node.js and npm
#RUN     yum install -y -q npm

# App
ADD . /src
# Install app dependencies
RUN cd /src; 

EXPOSE 5000 
CMD ["node", "/src/lancet-icu.js"]
