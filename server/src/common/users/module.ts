import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import configuration from '@grms/config.base';
import { AuthService } from '@grms/common/auth/auth.service';
import { AuthEntities } from '@grms/common/auth/entities';
import { UsersController } from '@grms/common/users/users.controller';
import { UsersService } from '@grms/common/users/users.service';
import { LocalStrategy } from '@grms/common/users/authGuards/local.strategy';
import { JwtStrategy } from '@grms/common/users/authGuards/jwt.strategy';

import { UsersEntities, UsersSubscribers } from './entities';

export const jwtConstants : string = 'GRMSDAOSimulationJWT'

@Module({
    imports: [
        TypeOrmModule.forFeature([  ...AuthEntities, ...UsersEntities ], 'sqldb'),
        ConfigModule.forRoot({
            load: [configuration]
        }),
        JwtModule.register({
            secret: jwtConstants,
            signOptions: { expiresIn: '86400s' }, // 24h
        }),
        PassportModule,
    ],
    controllers: [ UsersController ],
    providers: [  UsersService, LocalStrategy, JwtStrategy, AuthService, ...UsersSubscribers ]
})
export class UsersModule {}

