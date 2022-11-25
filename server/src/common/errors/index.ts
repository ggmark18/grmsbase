import { HttpException, HttpStatus } from '@nestjs/common';
import { sendmail } from '../tools/mailtool';
import  config  from '../../config.base';
import { dev_template, prd_template, ope_template, STYLESHEET } from './error_page';

export class IMBaseError extends HttpException {
    type: string;
    notice : boolean;
    userinfo : string;
    serial : string;
    html : string;
    constructor( message: string, notice: boolean, userinfo ) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);
        this.type = 'IMBaseError';
        this.notice = notice;
        this.userinfo = userinfo;
        this.serial = makeDateSerial();
    }
}

export class InternalError extends IMBaseError {
    constructor(message, userinfo=null) {
        super( message, true, userinfo);
        this.type = 'InternalError';
        if( this.userinfo ) {
            this.html = `エラーの発生は管理者に通知されています。<P>再実行しても改善しない場合は、管理者からの連絡をお待ちください。`;
        } else {
            this.html = `再実行しても改善しない場合は、管理者に連絡お願いします。
            <a href='mailto:${config().mail.adminAddress}?subject=エラー報告[SN:${this.serial}]&body=このまま発信可能です。以下にコメントを書くこともできます。'>MAIL</a>`;
        }
    }
}

export class OperationError extends IMBaseError {
    title : String;
    constructor(title, message, userinfo=null) {
        super( message, true, userinfo);
        this.type = 'OperationError';
        this.title = title;
        this.html = message;
    }
}

export class ClientError extends IMBaseError {
    constructor(url, userid=null) {
        super( "", false, userid);
        this.userinfo = userid;
        this.html = url;
    }
}

var accepts = require('accepts')
var escapeHtml = require('escape-html')
var fs = require('fs')
var path = require('path')
var util = require('util')

var DOUBLE_SPACE_REGEXP = /\x20{2}/g
var NEW_LINE_REGEXP = /\n/g
var inspect = util.inspect
var toString = Object.prototype.toString

/* istanbul ignore next */
var defer = typeof setImmediate === 'function'
  ? setImmediate
  : function (fn) { process.nextTick(fn.bind.apply(fn, arguments)) }

export function pageNotFound(req, res) {
    var viewFilePath = '404';
    var statusCode = 404;
    var result = {
        status: statusCode
    };

    res.status(result.status);
    res.render(viewFilePath, {}, function(err, html) {
        if(err) {
            return res.status(result.status).json(result);
        }
        res.send(html);
    });
};

export function errorNotice(e) {
    if( e.notice ) {
        var message = e.stack;
        if ( e.userinfo ) {
            message += "\n";
            message += e.userinfo;
        }
        let mail = {
            from: config().mail.adminAddress,
            to: config().mail.adminAddress,
            subject: `${config().mail.subjectPrefix} エラー報告[SN:${e.serial}]`,
            text: message
        };
        sendmail(config().mail.smtp, mail);
    }
}

export function errorHandler (opts = {}) {

    // get environment
    var env = process.env.NODE_ENV || 'development'

    var debug = (env === "development" || env === "test");

    var TEMPLATE = (debug) ? dev_template : prd_template;

    return function errorHandler (err, req, res, next) {
        if( err instanceof IMBaseError ) {
            if(debug) {
                console.log(err);
            } else {
                errorNotice(err);
            }
        
            if( err instanceof ClientError) {
                return res.redirect(err.html);
            } else if ( err instanceof OperationError ) {
                TEMPLATE = ope_template;
            }
        }

        // respect err.statusCode
        if (err.statusCode) {
            res.statusCode = err.statusCode
        }

        // respect err.status
        if (err.status) {
            res.statusCode = err.status
        }
        
        // default status code to 500
        if (res.statusCode < 400) {
            res.statusCode = 500
        }
        var str = stringify(err)
        // cannot actually respond
        if (res._header) {
            return req.socket.destroy()
        }
        // negotiate
        var accept = accepts(req)
        var type = accept.type('html', 'json', 'text')

        // Security header for content sniffing
        res.setHeader('X-Content-Type-Options', 'nosniff')

        var title = (err.title) ? err.title : "Error";
        // html
        if (type === 'html') {
            var isInspect = !err.stack && String(err) === toString.call(err)
            var errorHtml = !isInspect
                ? escapeHtmlBlock(str.split('\n', 1)[0] || 'Error')
                : 'Error'
            var stack = !isInspect
                ? String(str).split('\n').slice(1)
                : [str]
            var stackHtml = stack
                .map(function (v) { return '<li>' + escapeHtmlBlock(v) + '</li>' })
                .join('')
            var messageHtml =  (err.html) ? err.html : "";
            var body = TEMPLATE
                .replace('{style}', STYLESHEET)
                .replace('{stack}', stackHtml)
                .replace('{title}', escapeHtml(title))
                .replace('{statusCode}', res.statusCode)
                .replace(/\{error\}/g, errorHtml)
                .replace('{html}', messageHtml )
            res.setHeader('Content-Type', 'text/html; charset=utf-8')
            res.end(body)
            // json
        } else if (type === 'json') {
            var error = { message: err.message, stack: err.stack }
            for (var prop in err) error[prop] = err[prop]
            var json = JSON.stringify({ error: error }, null, 2)
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.end(json)
            // plain text
        } else {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8')
            res.end(str)
        }
    }

}
/**
 * Escape a block of HTML, preserving whitespace.
 */

function escapeHtmlBlock (str) {
  return escapeHtml(str)
  .replace(DOUBLE_SPACE_REGEXP, ' &nbsp;')
  .replace(NEW_LINE_REGEXP, '<br>')
}

/**
 * Stringify a value.
 */

function stringify (val) {
  var stack = val.stack

  if (stack) {
    return String(stack)
  }

  var str = String(val)

  return str === toString.call(val)
    ? inspect(val)
    : str
}

function makeDateSerial() {
    let date = new Date();
    return date.getFullYear()
        + ('0' + (date.getMonth() + 1)).slice(-2)
        + ('0' + date.getDate()).slice(-2)
        + ('0' + date.getHours()).slice(-2)
        + ('0' + date.getMinutes()).slice(-2)
        + ('0' + date.getSeconds()).slice(-2);
}

