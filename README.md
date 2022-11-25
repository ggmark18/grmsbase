## Welcome to the GRMSBase
The GRMSBase is intended to use to develop a internal innovative system, which is a set of latest Open Source components.

* Angular 14
* Bootstrap 5
* NestJS 9
* TypeORM 0.3
* NodeJS 18
* MySQL 5.7
* mongoDB 4.7
* Docker 20

### Pre-requisites
* git - [Installation guide](https://www.linode.com/docs/development/version-control/how-to-install-git-on-linux-mac-and-windows/) .  
* node.js - [Download page](https://nodejs.org/en/download/) .  
* npm - comes with node or download yarn - [Download page](https://yarnpkg.com/lang/en/docs/install) .
* docker - [Get Started](https://www.docker.com/get-started) .

### make local data directory.
At first you have to make a local data directory,
which is for MySQL and MongoDB etc anywhere you like
for example you home directory.
And then input it at next setup.sh.
```
    cd ~
    mkdir grmsbase_data
```

### initial base kit clone
#### checking out the GRMSBase from git.
```
    git clone git@bitbucket.org:imawaka/grmsbase.git #ProjectName#
```
#### build submodule repository for each web application
- Make 2 repositories for each server and client on git service. ( following case for memo )
- Be on top the directory.
- At first you should make branch of git and checkout it.
```
    git branch memo
    git checkout memo
    git submodule add git@bitbucket.org:imawaka/memo-server.git server/src/app-modules
    git submodule add git@bitbucket.org:imawaka/memo-client.git client/src/app/app-modules
```
if you want to delete submodule
```
    git rm -r --cached  server/src/app-modules
    git rm -r --cached  client/src/app/app-modules
    
    git submodule deinit -f server
    git rm -f server/src/app-modules
    rm -rf .git/modules/server
```
#### setting environment 
```
    cd #ProjectName#
    ./setup.sh
```
### each web application branch clone
You don't need to make submodule repository ( follwing case for sample memo application)
```
    git clone --recurse-submodules -b sample git@bitbucket.org:imawaka/imbase.git #ProjectName#
    cd #ProjectName#
    ./setup.sh
```

### make all docker components for production sample and deply
```
     cd deploy
     docker-compose up -d 
```
The imbase-backend is somtime fail to be up because of initializing for mysql.
After waiting for little bit minuites, "docker-compose up -d " again.
By using puppetteer you have to setup chronium with apk command, so you might spacified proxy
```
    docker-compose build --build-arg http_proxy=http://proxy.xxx:XXXX --build-arg https_proxy=http://proxy.xxx:XXXX
```

If you don't find api-dto ( interface files from server ), you have to make before then.
```
    cd server
    npm install
    npm run build:cpx
```
1022/07/16
conflited angular 14 vs  ngx-bootstrap 8.0.0 so need to do bellow
```
npm install ngx-bootstrap@latest --legacy-peer-deps
```
#### Database only setup
MySQL and MongoDB should be set up on your development environment.

 npm migration:run* mysql - [Download page](https://www.mysql.com/downloads/)
* mongodb - [Download page](https://www.mongodb.com/download-center/community) .

You can also use a part of Docker component as each DB servers.
```
    cd deploy
    docker-compose up -d mysqldb
    docker-compose up -d mongodb
    docker-compose up -d phpmyadmin
    docker-compose up -d mongo-express
```
### Setup imbase database table and initial admin account.
```
    cd server
    npm install
    npm run migration:generate
    npm run migration:run
```
You can login as a user 'admin', the password is one you set before in setup.sh.
### Development
For backend as NodeJS and Nest
``` 
    cd server
    npm start 
```
For frontend as Angular.
``` 
    cd client
    npm install
    npm start
```

You can access following development port
http://localhost:4200

#### Detabase for Development
As a initial setting, the production version on docker and the development verison
on local PS are using the same database. If you use different databses each,
make a database for developement as following steps.

- mysql : make Database for development to use phpmyadmin
- mongodb : make Database for development to use mongo-express
  Don't forget to grant a permission for the login db user.
- Change database name in server/.env
  * GRMS_MONGODB_NAME and GRMS_SQLDB_NAME
- initialize database.
```
    cd server
    npm run dev:migration:generate
    npm run dev:migration:run
```
You can login as a user 'admin', the password is one you set before in setup.sh.

### i18n 
At first you have to add a following package for xliffmerge command.
```
    # npm install -g ngx-i18nsupport
```

### API Documentation
You can read your own Server API by Swagger that is written in server/main.ts:bootstrap
```
    http://localhost:3000/api
```

### Credits 
- The GRMSBase name was coined by Mark Imawaka.
- Initial concept and development was done by Amos Haviv and sponsered by Linnovate.
- Inspired by the great work of Madhusudhan Srinivasa.


