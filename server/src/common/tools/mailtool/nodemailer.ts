import * as mailer from 'nodemailer';

export function send(mail, config) {
    return new Promise(function (resolve, reject) {
        var setting = {
            //SMTP�����С���Ȥ����
            host: config.host,
            port: config.port,
            auth: {
                user: config.user,
                pass: config.pass,
            }
        };

        //SMTP����³
        var smtp = mailer.createTransport(setting);

        //�᡼�������
        smtp.sendMail(mail, function(err, sres) {
            if(err) {
                console.log(err);
                reject(err);
            } else {
                resolve(sres);
            }
            smtp.close();
        });

    });
}
