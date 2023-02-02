export function payload(parentPageid) {
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
                content: "メインポスト",
                link: null
            }
        }],
        properties: {
            '名前': { title: {} },
            'ステータス': { select: {
                options: [
                    {
                        name: "作成",
                        color: "brown"
                    },
                    {
                        name: "承認",
                        color: "green"
                    },
                    {
                        name: "公開",
                        color: "blue"
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
