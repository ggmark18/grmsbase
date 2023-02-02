import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { payload as postpage } from './page-payloads/post-database';

@Injectable()
export class NotionPageFactory {
    constructor() {}

    async createPostPage(secret, pageid) {
        let payload = postpage(pageid);
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
}
