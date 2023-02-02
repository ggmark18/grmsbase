import "reflect-metadata"
import { DataSource } from "typeorm"
import { AuthEntities } from './common/auth/entities';
import { UsersEntities } from './common/users/entities';
import { APP_SQLDBEntities } from './app-modules/app.entities';

import config from './config.base';

export const AppMySQLDataSource = new DataSource({
    type: "mysql",
    host: config().sqldb.host,
    port: config().sqldb.port,
    username: config().sqldb.user,
    password: config().sqldb.pass,
    database: config().sqldb.name,
    synchronize: true,
    logging: false,
    entities: [ ...AuthEntities, ...UsersEntities, ...APP_SQLDBEntities],
    migrations: [config().migrations],
});

