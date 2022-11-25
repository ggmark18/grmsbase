import * as nodemailer from './nodemailer';
import * as amazon_SES from './amazon_SES';

export async function sendmail(config, content) {
    let method = config.method;
    if( method === 'nodemailer' ) {
        return nodemailer.send(content, config.smtp);
    } else if ( method === 'amazon_SES' ) {
        return amazon_SES.send(content, config.smtp);
    } else {
        return new Promise( function ( resolve, reject ) {
            reject(`No Method: ${method}`);
        });
    }
}
