import * as AWS from 'aws-sdk';
import * as nodemailer from 'nodemailer'

export function send(mail, config) {
    return new Promise(function (resolve, reject) {

        AWS.config.update({region: config.host});
        let credentials_vars = {
            accessKeyId: config.user,
            secretAccessKey: config.pass
        };

        AWS.config.update({
            credentials: new AWS.Credentials(credentials_vars)
        });

        const transporter = nodemailer.createTransport({
            SES: new AWS.SES()
        });
        //メールの送信
        transporter.sendMail(mail, function(err, sres) {
            if(err) {
                reject(err);
            } else {
                resolve(sres);
            }
        });
    });
}

