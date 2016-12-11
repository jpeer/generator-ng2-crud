#!/bin/bash
#
# this helper script
# - runs client and server generators in one go and starts the web server
# - also, it speeds up the whole process of by skipping "npm install" and caching node_module instead in /tmp
#

if [ -z "$1" ]; then
   echo "please provide destination path"
   exit -1
fi

configFile="project-config.json"
if [ ! -f $configFile ]; then
  echo "please provide config file $configFile in the current directory."
  exit -1
fi

DEPLOYMENT_DIR=$1
rm -rf ${DEPLOYMENT_DIR}
mkdir ${DEPLOYMENT_DIR}
cp project-config.json ${DEPLOYMENT_DIR}

cd ${DEPLOYMENT_DIR}
export NO_NPM_INSTALL=true
yo ng2-crud

# the directories where we want to keep node_modules for speed up are /tmp/n1 and /tmp/n2:
NODE_CACHE_1="/tmp/n1"
NODE_CACHE_2="/tmp/n2"

if [ ! -d "$NODE_CACHE_1" ]; then
  cd ${DEPLOYMENT_DIR}
  npm install
  cd frontend
  npm install
  cp -r ${DEPLOYMENT_DIR}/node_modules ${NODE_CACHE_1}
  cp -r ${DEPLOYMENT_DIR}/frontend/node_modules ${NODE_CACHE_2}
else
  cp -r ${NODE_CACHE_1} ${DEPLOYMENT_DIR}/node_modules
  cp -r ${NODE_CACHE_2} ${DEPLOYMENT_DIR}/frontend/node_modules
fi

cd ${DEPLOYMENT_DIR}/frontend
npm run build

cd ${DEPLOYMENT_DIR}
npm start
