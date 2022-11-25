import * as crypto from 'crypto';
import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAdminUser implements MigrationInterface {
    name = 'INI9000000000000'

    service = "${SUBST_SERVICE_NAME}";
    email = "${SUBST_INIT_ADMINUSER_MAIL}";
    password = "${SUBST_INIT_ADMINUSER_PASS}";
    public async up(queryRunner: QueryRunner): Promise<void> {
        const byteSize = 16;
        const defaultIterations = 10000;
        const defaultKeyLength = 64;
        const salt = crypto.randomBytes(byteSize).toString('base64').substring(0,byteSize);
        const saltbuf = new Buffer(salt, 'base64');
        const encrypt_password = crypto.pbkdf2Sync(
            this.password,
            saltbuf,
            defaultIterations,
            defaultKeyLength,
            'SHA1',
        ).toString('base64');
        const now = new Date().toLocaleString();
        await queryRunner.query("INSERT INTO `AuthUsers` (`email`,`userid`,`name`,`role`,`salt`,`password`,`passwordUpdated`,`targetId`) VALUES ('"+this.email+"','admin','Admin','admin','"+salt+"','"+encrypt_password+"','"+now+"',1)");
        await queryRunner.query("INSERT INTO `AuthTargets` (`_id`,`name`,`description`) VALUES (1,'"+service+"','Initial Administration Service')");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DLETE FROM `AuthUsers` WHERE name='admin'");
        await queryRunner.query("DLETE FROM `AuthTargets` WHERE name='GRMSBase'");
    }

}
