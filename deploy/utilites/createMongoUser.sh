#!/bin/bash
export $(cat .env | grep -v ^# | xargs);
export MONGO_INITDB_DATABASE=$GRMS_MONGODB_NAME
export MONGO_DB_USER=$GRMS_MONGODB_USER
export MONGO_DB_PASS=$GRMS_MONGODB_PASS
if [ $1 == '-dryrun' ]; then
echo "use admin;"
echo "db.auth('$MONGO_INITDB_ROOT_USERNAME', '$MONGO_INITDB_ROOT_PASSWORD');"
echo "db = db.getSiblingDB('$MONGO_INITDB_DATABASE');"
echo "db.createUser({ user: '$MONGO_DB_USER', pwd: '$MONGO_DB_PASS', roles: [{ role: 'readWrite', db: '$MONGO_INITDB_DATABASE' }] });"
else 
../deploy/init/mongodb/createUser.sh;
fi
