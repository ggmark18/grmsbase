import * as dotenv from "dotenv";
export default () => {
    let migration_mode;
    if ( process.env.IMDBTARGET == 'Migration' ) {
        dotenv.config({ path:'../deploy/.env'});
        process.env.GRMS_SQLDB_HOST = process.env.MYSQLDB_DISCLOSE_HOST;
        process.env.GRMS_SQLDB_PORT = process.env.MYSQLDB_DISCLOSE_PORT;
        migration_mode = 'production';
    } else {
        dotenv.config();
        migration_mode = 'development';
    }

    return {
        backendPort: parseInt(process.env.GRMS_BACKEND_PORT) || 3000,
        hostUrl: process.env.GRMS_HOST_URL || 'http://localhost:4200',
        proxy: process.env.HTTP_PROXY ,
        dataDir: process.env.GRMS_DATA_DIR ,
        passwordDurationDays : parseInt(process.env.GRMS_PASSWORD_DURATION_DAYS) || 90,
        mailLoginTermSec : process.env.GRMS_AUTOLOGIN_SEC || 300,
        puppetteerSandbox : process.env.GRMS_PUPPETTER_SANDBOX || false,
        puppetteerExecutablePath : process.env.GRMS_PUPPETTER_EXECUTABLEPATH,
        migrations: `migration/${migration_mode}/*.ts`,
        sqldb: {
            host: process.env.GRMS_SQLDB_HOST || 'localhost',
            port: parseInt(process.env.GRMS_SQLDB_PORT, 10) || 3306,
            name: process.env.GRMS_SQLDB_NAME || 'imbase',
            user: process.env.GRMS_SQLDB_USER,
            pass: process.env.GRMS_SQLDB_PASS, 
        },
        mongodb: {
            host: process.env.GRMS_MONGODB_HOST || 'localhost',
            port: parseInt(process.env.GRMS_MONGODB_PORT, 10) || 27017,
            name: process.env.GRMS_MONGODB_NAME || 'IMBase',
            user: process.env.GRMS_MONGODB_USER,
            pass: process.env.GRMS_MONGODB_PASS, 
        },
        mail: {
            method: process.env.GRMS_MAIL_METHOD || 'nodemailer',
            adminAddress: process.env.GRMS_MAIL_FROM || 'admin@localhost',
            subjectPrefix: process.env.GRMS_SUBJECT_PREFIX || 'IMBase',
            smtp: {
                host: process.env.GRMS_SMTP_HOST || 'localhost',
                port: parseInt(process.env.GRMS_SMTP_PORT, 10) || 25,
                user: process.env.GRMS_SMTP_USER,
                pass: process.env.GRMS_SMTP_PASS,
            }
        },
        devmode: process.env.GRMS_DEVMODE || false,
    };
}

