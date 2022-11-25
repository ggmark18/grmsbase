#!/bin/bash
echo "Welcome GRMSBase setup for v2.0."

if [ -d .git ]; then
    BRANCH=`git branch | grep '*'`
    if [ "${BRANCH:2}" == "master" ]; then
        echo "Caution: You work on master stream of git!!!"
    fi
fi

echo "At first you have to decide your service name!"
SUBST_SERVICE_NAME=GRMSBase
read -p " - Service Name: [${SUBST_SERVICE_NAME}]: " stdinput
if [ $stdinput ]; then
    SUBST_SERVICE_NAME=$stdinput
fi
SUBST_DEFAULT_LANG=ja
read -p " - Default Laguage: [${SUBST_DEFAULT_LANG}]: " stdinput
if [ $stdinput ]; then
    SUBST_DEFAULT_LANG=$stdinput
fi
SUBST_FRONTEND_HOST=localhost
read -p " - Entry Host Name: [${SUBST_FRONTEND_HOST}]: " stdinput
if [ $stdinput ]; then
    SUBST_FRONTEND_HOST=$stdinput
fi
export SUBST_SERVICE_NAME SUBST_FRONTEND_HOST

local_data_dir=/home/imbase/data
read -p " - Local Data Directory: [${local_data_dir}]: " stdinput
if [ $stdinput ]; then
    local_data_dir=$stdinput
fi

domain=mydomain.com
read -p " - App Initial AdminUser mail for login : " stdinput
if [ $stdinput ]; then
    export SUBST_INIT_ADMINUSER_MAIL=$stdinput
    mkdir -p server/migration/development
    mkdir -p server/migration/production

    domain=`echo $SUBST_INIT_ADMINUSER_MAIL | cut -d"@" -f2`

    read -p " - App Initial AdminUser initial password : " stdinput
    if [ $stdinput ]; then
        export SUBST_INIT_ADMINUSER_PASS=$stdinput
        envsubst < deploy/templates/add_adminuser.subst.ts > server/migration/development/add_adminuser.ts
        cp server/migration/development/add_adminuser.ts server/migration/production
    else
        echo ""
        echo "You must set it. Setup again!!"
        exit 1
    fi
else
    echo ""
    echo "You must set it. Setup again!!"
    exit 1
fi

echo "** Admin mail configuration **"
SUBST_MAIL_FROM="no-reply@${domain}"
read -p " - Admin mail address for from part [${SUBST_MAIL_FROM}]: " stdinput
if [ $stdinput ]; then
    SUBST_MAIL_FROM=$stdinput
fi
export SUBST_MAIL_FROM
SUBST_SMTP_HOST=127.0.0.1
read -p " - SMTP host IP Adress [${SUBST_SMTP_HOST}]: " stdinput
if [ $stdinput ]; then
    SUBST_SMTP_HOST=$stdinput
fi
SUBST_SMTP_PORT=25
read -p " - SMTP port [${SUBST_SMTP_PORT}]: " stdinput
if [ $stdinput ]; then
    SUBST_SMTP_PORT=$stdinput
fi
export SUBST_MAIL_FROM SUBST_SMTP_HOST SUBST_SMTP_PORT SUBST_DEFAULT_LANG
SUBST_MYSQLDB_PATH=${local_data_dir}/mysqldb
SUBST_MYSQLDB_ROOT_PASS=dearimbase
SUBST_MYSQLDB_DISCLOSE_HOST=localhost
SUBST_MYSQLDB_DISCLOSE_PORT=3321
SUBST_PHPMYADMIN_PATH=${local_data_dir}/phpmyadmin
SUBST_PHPMYADMIN_DISCLOSE_PORT=8070
SUBST_MONGODB_PATH=${local_data_dir}/mongodb
SUBST_MONGODB_ROOT_USER=admin
SUBST_MONGODB_ROOT_PASS=dearimbase
SUBST_MONGODB_DISCLOSE_PORT=27032
SUBST_MONGOEXPRESS_DISCLOSE_PORT=8081
SUBST_SQLDB_HOST=mysqldb
SUBST_SQLDB_PORT=3306
SUBST_SQLDB_NAME=${SUBST_SERVICE_NAME}
SUBST_SQLDB_USER=imbase
SUBST_SQLDB_PASS=helloimbase
SUBST_MONGODB_HOST=mongodb
SUBST_MONGODB_PORT=27017
SUBST_MONGODB_NAME=${SUBST_SERVICE_NAME}
SUBST_MONGODB_USER=imbase
SUBST_MONGODB_PASS=helloimbase
SUBST_DEV_FRONTEND_HOST=localhost
SUBST_DEV_BACKEND_HOST=localhost
SUBST_DEV_DB_HOST=localhost
SUBST_DEV_BACKEND_PORT=3030
SUBST_BACKUPDIR=${local_data_dir}/backup

echo "Up to here, You can use GRMSBase on normal setting."
echo "If you use original database etc., do bellow detail variables."
read -p "Could you set detail variables [N/y] " stdinput
if [ "$stdinput" = "y" ]; then
     echo ""
     echo "***** Set up MySQL Container environment *****"
     read -p " - Local data directory [${SUBST_MYSQLDB_PATH}]: " stdinput
     if [ $stdinput ]; then
         SUBST_MYSQLDB_PATH=$stdinput
     fi
     read -p " - Root user password [${SUBST_MYSQLDB_ROOT_PASS}]: " stdinput
     if [ $stdinput ]; then
        SUBST_MYSQLDB_ROOT_PASS=$stdinput
     fi
     read -p " - MySQL DB Container Port from outside [${SUBST_MYSQLDB_DISCLOSE_PORT}]: " stdinput
     if [ $stdinput ]; then
        SUBST_MYSQLDB_DISCLOSE_PORT=$stdinput
     fi

     echo ""
     echo "***** Set up PHPMyAdmin Container environment *****"
     read -p " - Local data directory for session info [${SUBST_PHPMYADMIN_PATH}]: " stdinput
     if [ $stdinput ]; then
        SUBST_PHPMYADMIN_PATH=$stdinput
     fi

     read -p " - PHPMyAdmin Container Port from outside [${SUBST_PHPMYADMIN_DISCLOSE_PORT}]: " stdinput
     if [ $stdinput ]; then
        SUBST_PHPMYADMIN_DISCLOSE_PORT=$stdinput
     fi

     echo ""
     echo "***** Set up MongoDB & Mongo-Express Container environment *****"
     read -p " - Local data directory [${SUBST_MONGODB_PATH}]: " stdinput
     if [ $stdinput ]; then
        SUBST_MONGODB_PATH=$stdinput
     fi
     read -p " - Admin user name [${SUBST_MONGODB_ROOT_USER}]: " stdinput
     if [ $stdinput ]; then
        SUBST_MONGODB_ROOT_USER=$stdinput
     fi
     read -p " - Admin user password [${SUBST_MONGODB_ROOT_PASS}]: " stdinput
     if [ $stdinput ]; then
        SUBST_MONGODB_ROOT_PASS=$stdinput
     fi
     read -p " - Mongo DB Container Port from outside [${SUBST_MONGODB_DISCLOSE_PORT}]: " stdinput
     if [ $stdinput ]; then
        SUBST_MONGODB_DISCLOSE_PORT=$stdinput
     fi
     read -p " - Mongo-Express Container Port from outside [${SUBST_MONGOEXPRESS_DISCLOSE_PORT}]: " stdinput
     if [ $stdinput ]; then
        SUBST_MONGOEXPRESS_DISCLOSE_PORT=$stdinput
     fi

     echo ""
     echo "***** Backend Server Container environment *****"
     echo "** MySQLDB connection **"
     echo "If you ganna use own MySQL server, change host name and port instead of the docker component."
     read -p " - MySQL DB host [${SUBST_SQLDB_HOST}]: " stdinput
     if [ $stdinput ]; then
        SUBST_SQLDB_HOST=$stdinput
     fi
     read -p " - MySQL DB port [${SUBST_SQLDB_PORT}]: " stdinput
     if [ $stdinput ]; then
         SUBST_SQLDB_PORT=$stdinput
     fi
     read -p " - Database name on SQL Server [${SUBST_SQLDB_NAME}]: " stdinput
     if [ $stdinput ]; then
        SUBST_SQLDB_NAME=$stdinput
     fi
     read -p "- username on this database [${SUBST_SQLDB_USER}]: " stdinput
     if [ $stdinput ]; then
        SUBST_SQLDB_USER=$stdinput
     fi
     read -p "- password for the user [${SUBST_SQLDB_PASS}]: " stdinput
     if [ $stdinput ]; then
        SUBST_SQLDB_PASS=$stdinput
     fi

     echo "** MongoDB connection **"
     echo "If you ganna use own mongoDB, change host name and port instead of the docker component."
     read -p "- mongoDB host [${SUBST_MONGODB_HOST}]: " stdinput
     if [ $stdinput ]; then
        SUBST_MONGODB_HOST=$stdinput
     fi
     read -p "- mongoDB host port [${SUBST_MONGODB_PORT}]: " stdinput
     if [ $stdinput ]; then
        SUBST_MONGODB_PORT=$stdinput
     fi

     read -p " - Database name on Mongo Server [${SUBST_MONGODB_NAME}]: " stdinput
     if [ $stdinput ]; then
        SUBST_MONGODB_NAME=$stdinput
     fi

     read -p "- username on this database [${SUBST_MONGODB_USER}]: " stdinput
     if [ $stdinput ]; then
        SUBST_MONGODB_USER=$stdinput
     fi
     read -p "- password for the user [${SUBST_MONGODB_PASS}]: " stdinput
     if [ $stdinput ]; then
        SUBST_MONGODB_PASS=$stdinput
     fi
     
     echo ""
     echo "***** Maintenance environment *****"

     read -p " - Local Backup Directory: [${SUBST_BACKUPDIR}]: " stdinput
     if [ $stdinput ]; then
         SUBST_BACKUPDIR=$stdinput
     fi

     echo ""
     echo "***** Development environment *****"
     read -p " - Frontend host for Development : [${SUBST_DEV_FRONTEND_HOST}]: " stdinput
     if [ $stdinput ]; then
        SUBST_DEV_FRONTEND_HOST=$stdinput
     fi
     read -p " - Backend host for Development : [${SUBST_DEV_BACKEND_HOST}]: " stdinput
     if [ $stdinput ]; then
        SUBST_DEV_BACKEND_HOST=$stdinput
     fi
     read -p " - database host for Development : [${SUBST_DEV_DB_HOST}]: " stdinput
     if [ $stdinput ]; then
        SUBST_DEV_DB_HOST=$stdinput
     fi
     read -p " - backend port for Development : [${SUBST_DEV_BACKEND_PORT}]: " stdinput
     if [ $stdinput ]; then
        SUBST_DEV_BACKEND_PORT=$stdinput
     fi
fi
SUBST_MYSQLDB_DEV_PORT=${SUBST_SQLDB_PORT}
SUBST_MONGODB_DEV_PORT=${SUBST_MONGODB_PORT}

export SUBST_MYSQLDB_PATH SUBST_MYSQLDB_ROOT_PASS SUBST_MYSQLDB_DISCLOSE_PORT SUBST_BACKUPDIR
export SUBST_PHPMYADMIN_DISCLOSE_PORT SUBST_PHPMYADMIN_PATH
export SUBST_MONGODB_PATH SUBST_MONGODB_ROOT_USER SUBST_MONGODB_ROOT_PASS SUBST_MONGOEXPRESS_DISCLOSE_PORT SUBST_MONGODB_DISCLOSE_PORT
export SUBST_SQLDB_HOST SUBST_SQLDB_PORT SUBST_SQLDB_NAME SUBST_SQLDB_USER SUBST_SQLDB_PASS
export SUBST_MONGODB_HOST SUBST_MONGODB_PORT SUBST_MONGODB_NAME SUBST_MONGODB_USER SUBST_MONGODB_PASS  
export SUBST_DEV_FRONTEND_HOST SUBST_DEV_DB_HOST SUBST_DEV_BACKEND_HOST SUBST_DEV_BACKEND_PORT

read -p "Could you use the mysql on Docker for local development? [N/y] " stdinput
if [ "$stdinput" = "y" ]; then
    SUBST_MYSQLDB_DEV_PORT=${SUBST_MYSQLDB_DISCLOSE_PORT}
fi
read -p "Could you use the mongoDB on Docker for local development? [N/y] " stdinput
if [ "$stdinput" = "y" ]; then
    SUBST_MONGODB_DEV_PORT=${SUBST_MONGODB_DISCLOSE_PORT}
fi
export SUBST_MYSQLDB_DEV_PORT SUBST_MONGODB_DEV_PORT

/bin/echo -n "setup config files..."
if [ -d server/src/app-modules -a ! -f server/src/app-modules/app.modules.ts ]; then
    cp deploy/templates/app-modules.ts.server server/src/app-modules/app.modules.ts
fi
if [ -d server/src/app-modules -a ! -f server/src/app-modules/app.config.ts ]; then
    cp deploy/templates/app-config.ts.server server/src/app-modules/app.config.ts
fi
if [ -d client/src/app/app-modules -a ! -f client/src/app/app-modules/app.modules.ts ]; then
    cp deploy/templates/app-modules.ts.client client/src/app/app-modules/app.modules.ts
    cp deploy/templates/app-home.component.ts client/src/app/app-modules
fi
if [ -d client/src/app/app-modules -a ! -d client/src/app/app-modules/assets ]; then
    mkdir -p client/src/app/app-modules/assets
    cp client/src/assets/favicon.ico client/src/app/app-modules/assets
fi
cp deploy/templates/default.conf.template.master deploy/nginx/default.conf.template
cp deploy/templates/Dockerfile.server.master deploy/dockerfile/Dockerfile.server
cp deploy/templates/Dockerfile.client.master deploy/dockerfile/Dockerfile.client
envsubst < deploy/templates/nginx-index.html.subst > deploy/nginx/index.html
envsubst < deploy/templates/env.deploy.subst > deploy/.env
envsubst < deploy/templates/env.server.subst > server/.env
envsubst < deploy/templates/npmrc.client.subst > client/.npmrc
envsubst < deploy/templates/proxy.conf.subst.json > client/proxy.conf.json
envsubst < deploy/templates/environment.dev.subst.ts > client/src/environments/environment.dev.ts
envsubst < deploy/templates/environment.prod.subst.ts > client/src/environments/environment.prod.ts
sed -e "s/GRMSBase/${SUBST_SERVICE_NAME}/g" deploy/templates/client-index.html > client/src/index.html 
echo "done."
echo ""
echo "Congratulations!! "
echo ""
echo " It's ready to develop your great service. "
echo " Enjoy!!"

