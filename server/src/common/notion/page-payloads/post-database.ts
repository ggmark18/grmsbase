export function payload(parentPageid, title) {
    return {
        parent: {
            type: "page_id",
            page_id: parentPageid
        },
        icon: {
    	    type: "emoji",
		    emoji: "🎬"
  	    },
        title: [{
            type: "text",
            text: {
                content: title,
                link: null
            }
        }],
        properties: {
            '名前': { title: {} },
            'ステータス': { select: {
                options: [
                    {
                        name: "作成",
                        color: "gray"
                    },
                    {
                        name: "拒絶",
                        color: "orange"
                    },
                    {
                        name: "公開",
                        color: "green"
                    },
                    {
                        name: "LIVE",
                        color: "purple"
                    }

                ]
            }
                          },
            '作成者': { people: {} },
            '公開日': {  date: {} },
            '最終更新日時': {
                last_edited_time: {}
            },
            '作成日付': {
                created_time: {}
            },
        },
    };
}
