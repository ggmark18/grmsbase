import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { UsersService } from './common/users/users.service';
import { UsersSubscriber } from './common/users/users.subscribers';
import { AuthService } from './common/auth/auth.service';
import { LocalStrategy } from './common/auth/local.strategy';
import { JwtStrategy } from './common/auth/jwt.strategy';
import { jwtConstants } from './common/auth/constants';
import { UsersController } from './common/users/users.controller';
import { PSAuthUser } from './common/users/entities/authUsers.entity';
import { PSAuthTarget } from './common/users/entities/authTargets.entity';
import { AppModules, mongoEntities, SQLDBEntities } from './app-modules/app.modules';
import config_base from './config.base';
import app_config from './app-modules/app.config';

import { join } from 'path';

@Module({
    imports: [
		ConfigModule.forRoot({
            load: [config_base, app_config]
        }),
        JwtModule.register({
            secret: jwtConstants.secret,
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
                entities: [ PSAuthTarget, PSAuthUser, ...SQLDBEntities ],
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([ PSAuthTarget, PSAuthUser ],'sqldb'),        
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
    controllers: [AppController,UsersController],
    providers: [UsersService, UsersSubscriber, AuthService, ConfigService, LocalStrategy, JwtStrategy, AppGateway],
})
export class AppBase {}
