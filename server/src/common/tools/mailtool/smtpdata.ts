import { Buffer } from 'buffer';

import { simpleParser } from 'mailparser';
import * as jconv from 'jconv';

import { sendmail } from '.';

function gmrsMimeEncoding( name, address ) {
    let jisString = jconv.convert(name,'UTF-8','ISO-2022-JP');
    let base64 = Buffer.from(jisString).toString('base64') ;
    name = "=?ISO-2022-JP?B?"+base64+"?=";
    return name + "<"+address+">";
}

export async function sendBySMTPServer( config, source, title )  {
    const {from,to,bcc,cc,subject,replyTo,text} = await simpleParser(source);
    let name = from.value[0].name;
    if( title)  {
        name = title;
    }
    let mimeFrom = gmrsMimeEncoding( name, from.value[0].address );
    var mail = {
        from: mimeFrom,
        to: to.text,
        cc: (cc || {text: ''}).text,
        bcc: (bcc || {text: ''}).text,
        replyTo: (replyTo || {text: ''}).text,
        subject: subject,
        text: text
    };
    let res;
    try {
        res = await sendmail(config.get('mail'), mail);
    } catch ( err ) {
        throw new Error(err);
    }
    return { mail:mail, res:res };
}
