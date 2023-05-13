import { Response } from 'express'
import * as fs from 'fs'

export function fileResponse(filename:string, res:Response)  {
    fs.readFile(filename, function(err, data) {
        if(err) return res.status(404).end("can't read file")
        let type = filename.split('.').pop();
        let contentType = undefined;
        if ( type == 'png' ) {
            contentType = 'image/png';
        } else if (type == 'jpg' || type == 'jpeg') {
            contentType = 'image/jpeg';
        }
        if( contentType ) {
            res.contentType(contentType);
        }
        res.status(200).send(data);
    });
}
