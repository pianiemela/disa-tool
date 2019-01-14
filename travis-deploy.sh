#!/bin/sh

if [ $TRAVIS_BRANCH =~ (^master) ]
then
docker build -t toska/disa-tool:staging .
docker login -u $DOCKER_USER -p $DOCKER_PASS
docker push toska/disa-tool:staging
fi
if [ $TRAVIS_TAG =~ ([0-1].+) ]
then
docker build -t toska/disa-tool:latest .
docker login -u $DOCKER_USER -p $DOCKER_PASS
docker push toska/disa-tool:latest
fi
