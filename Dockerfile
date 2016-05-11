FROM quay.io/ukhomeofficedigital/openjdk8:v0.1.2

RUN curl --silent --location https://rpm.nodesource.com/setup_5.x | bash -
RUN yum install -y nodejs
# git is needed by angular
RUN yum install -y git-all
RUN yum install -y wget
RUN yum install -y unzip

RUN ls /tmp || mkdir /tmp
RUN mkdir /tmp/app
ADD package.json /tmp/app/package.json
ADD bower.json /tmp/app/bower.json
RUN cd /tmp/app && npm install && node_modules/bower/bin/bower install --allow-root

ADD scripts/installGradle.sh .
RUN chmod +x installGradle.sh && ./installGradle.sh

ADD . .

CMD cp -a /tmp/app/* . && chmod +x scripts/buildInContainer.sh && scripts/buildInContainer.sh