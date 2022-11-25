import * as mailer from 'nodemailer';

export function send(mail, config) {
    return new Promise(function (resolve, reject) {
        var setting = {
            //SMTPサーバーを使う場合
            host: config.host,
            port: config.port,
            auth: {
                user: config.user,
                pass: config.pass,
            }
        };

        //SMTPの接続
        var smtp = mailer.createTransport(setting);

        //メールの送信
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
