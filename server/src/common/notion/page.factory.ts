import { Injectable } from '@nestjs/common';
import { format, utcToZonedTime } from 'date-fns-tz'
import axios from 'axios';

import { asString } from 'date-format';
import { NotionPostStatus, statusToNotion } from './dto';
import { payload as postpage } from './page-payloads/post-database';

@Injectable()
export class NotionPageFactory {
    constructor() {}

    async createPostPage(secret, pageid, title) {
        let payload = postpage(pageid,title);
        const options = {
            method: 'POST',
            url: 'https://api.notion.com/v1/databases',
            headers: {
                accept: 'application/json',
                'Notion-Version': '2022-06-28',
                'content-type': 'application/json',
                'Authorization': `Bearer ${secret}`,
            },
            data: payload
        };
        let response = await axios.request(options);
        console.log(response.data);
        return response.data;
    }
    async updatePostStatus(post) {
        let localeDate = format(new Date(post.postDate), 'yyyy-MM-dd HH:mm:ss.000xxx', { timeZone: 'Asia/Tokyo' });
        localeDate = localeDate.replace(' ', 'T');
        let payload = {
            "parent": { "database_id": post.page.pageid },
            "properties": {
                "ステータス": {
                    "select": {
                        "name": statusToNotion(post.status)
                    }
                },
                "公開日" : {
                    "date": {
                        "start": localeDate
                    }
                }
            }
        };
        const options = {
            method: 'PATCH',
            url: `https://api.notion.com/v1/pages/${post.blockid}`,
            headers: {
                accept: 'application/json',
                'Notion-Version': '2022-06-28',
                'content-type': 'application/json',
                'Authorization': `Bearer ${post.page.dashboard.secret}`,
            },
            data: payload
        };
        let response = await axios.request(options);
        return response.data;
    }
}
