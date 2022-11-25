import "reflect-metadata"
import { DataSource } from "typeorm"
import { PSAuthUser } from './common/users/entities/authUsers.entity';
import { PSAuthTarget } from './common/users/entities/authTargets.entity';
import { mongoEntities, SQLDBEntities } from './app-modules/app.modules';
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
    entities: [ PSAuthTarget, PSAuthUser, ...SQLDBEntities],
    migrations: [config().migrations],
});

