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

        /*

        var ses = new AWS.SES();

        let dest = {};
        dest['ToAddresses'] = mail.to.split(',');
        if( mail.cc ) dest['CcAddresses'] = mail.cc.split(',');
        if( mail.bcc ) dest['BccAddresses'] = mail.bcc.split(',');

        var params = {
            Destination: dest,
            Message: {
                Body: {
                },
                Subject: {
                    Data: mail.subject,
                    Charset: 'utf-8'
                }
            },
            Source: mail.from
        };
        if( mail.text )  {
            params.Message.Body['Text'] = { Data: mail.text, Charset: 'utf-8' };
        }
        if( mail.html )  {
            params.Message.Body['Html'] = { Data: mail.html, Charset: 'utf-8' };
        }

        if( mail.replyTo ) {
            params['ReplyToAddresses'] = [mail.replyTo];
        }

        ses.sendEmail(params, function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
        */
    });
}

