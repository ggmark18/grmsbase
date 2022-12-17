import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AppGateway } from './app.gateway';
import { AuthService } from './common/auth/auth.service';
import { PSAuthInfo } from './common/auth/entities/authInfo.entity';
import { PSAuthTarget } from './common/auth/entities/authTargets.entity';
import { AppModules, mongoEntities, SQLDBEntities } from './app-modules/app.modules';
import config_base from './config.base';
import app_config from './app-modules/app.config';
import { jwtConstants } from './app-modules/app.config';

import { join } from 'path';

@Module({
    imports: [
		ConfigModule.forRoot({
            load: [config_base, app_config]
        }),
        JwtModule.register({
            secret: jwtConstants,
            signOptions: { expiresIn: '86400s' }, // 24h
       }),
        PassportModule,
        
        TypeOrmModule.forRootAsync({
            name: "sqldb",
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                type: 'mysql', 
                host: configService.get('sqldb.host'),
                port: Number(configService.get('sqldb.port')),
                database: configService.get('sqldb.name'),
                username: configService.get('sqldb.user'),
                password: configService.get('sqldb.pass'),
                logging: true, 
                synchronize: false,
                entities: [ ...SQLDBEntities ],
            }),
            inject: [ConfigService],
        }),
        ...(mongoEntities.length > 0)?[
            TypeOrmModule.forRootAsync({
                name: 'mongodb',
                imports: [ConfigModule],
                useFactory: async (configService: ConfigService) => ({
                    type: 'mongodb', 
                    host: configService.get('mongodb.host'),
                    port: Number(configService.get('mongodb.port')),
                    database: configService.get('mongodb.name'),
                    username: configService.get('mongodb.user'),
                    password: configService.get('mongodb.pass'),
                    entities: mongoEntities,
                    useUnifiedTopology: true,
                    logging: "all",
                    logger: "advanced-console"
                }),
                inject: [ConfigService],
            })] : [],
        AppModules
    ],
    providers: [ ConfigService, AppGateway],
})
export class AppBase {}
