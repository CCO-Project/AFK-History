// 執行於瀏覽器

/**
 * @typedef Message
 * @property {Array} attachments
 * @property {Object} author
 * @property {String} channel_id
 * @property {Array} components
 * @property {String} content
 * @property {any} edited_timestamp
 * @property {Array} embeds
 * @property {Number} flags
 * @property {Boolean} hit
 * @property {String} id
 * @property {Boolean} mention_everyone
 * @property {Array} mention_roles
 * @property {Array} mentions
 * @property {Boolean} pinned
 * @property {String} timestamp
 * @property {Boolean} tts
 * @property {Number} type
 * @property {String} webhook_id
 */

/**
 * @typedef OriginalResult
 * @property {String} analytics_id
 * @property {number} total_results
 * @property {Array<Array<Message>>} messages
 */

/**
 * @typedef Result
 * @property {boolean} ok
 * @property {OriginalResult} data
 */

/**
 * 取得搜尋資料
 * 
 * @param {number} ts
 * @param {number} offset 資料查詢偏移值
 * @param {String} authorizationToken 授權驗證參數（用來判斷你的 Discord 帳號）
 * @param {String} xSuperProperties 授權驗證參數（用來判斷你的 Discord 帳號，不過我不確定這個是不是每個帳號有唯一值，反正我是拆開）
 * @returns {Promise<Result>}
 */
async function getData(ts, offset, authorizationToken, xSuperProperties) {
    let min_id = getSnowflake(ts);
    let max_id = getSnowflake(ts, true);
    let content = "has used Global Time Skip, all online players currently performing AFK task";

    let data = await fetch(`https://discord.com/api/v9/guilds/742992894167744552/messages/search?min_id=${min_id}&max_id=${max_id}&content=${encodeURI(content)}&sort_by=timestamp&sort_order=asc&offset=${offset}`, {
        "headers": {
            "accept": "*/*",
            "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
            "authorization": authorizationToken,
            "x-debug-options": "bugReporterEnabled",
            "x-discord-locale": "zh-TW",
            "x-super-properties": xSuperProperties
        },
        "referrer": "https://discord.com/channels/742992894167744552/742992894167744555",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    }).then(
        r => r.json()
    ).then(
        r => ({
            ok: true,
            data: r
        })
    ).catch(
        e => ({
            ok: false,
            data: e
        })
    );

    return data;
}

/**
 * 取得指定日期的雪花值 (用於 Discord 搜尋參數)
 * 
 * @param {number} ts timestamp
 * @param {boolean} addOneDay
 * @returns {number}
 */
function getSnowflake(ts, addOneDay = false) {
    if (addOneDay) {
        ts += 24 * 60 * 60 * 1000;
    }

    ts -= 1420070400000;
    return Number(BigInt(ts) << BigInt(22))
}

/**
 * @typedef DateObject
 * @property {String} date
 * @property {Number} ts timestamp
 */

/**
 * 從開始日期往後偏移 offsetDays 天，回傳 timestamp
 * 
 * @param {number} startY
 * @param {number} startM
 * @param {number} startD
 * @param {number} [offsetDays]
 * @returns {DateObject}
 */
function getTimeStampWithOffset(startY, startM, startD, offsetDays = 0) {
    let ts = new Date(`${startY}-${startM}-${startD}`).getTime();
    ts += offsetDays * 24 * 60 * 60 * 1000;

    let d = new Date(ts);
    let yyyy = d.getFullYear();
    let mm = `0${d.getMonth()+1}`.slice(-2);
    let dd = `0${d.getDate()}`.slice(-2);

    return {
        date: `${yyyy}-${mm}-${dd}`,
        ts: ts
    };
}

/**
 * 等待指定秒數
 * 
 * @param {number} second
 */
function waitSeconds(second = 6) {
    return new Promise(resolve => setTimeout(resolve, second * 1000));
}

// ================ [ MAIN ] ================ //

var allData = {};
(async () => {
    // 請先設定這兩個參數值，否則請求必定失敗。
    const authorizationToken = "";
    const xSuperProperties = "";
    // 記得修改日期區間
    const startDate = [2021, 9, 17];
    const endDate = [2022, 2, 5];
    // -------------------------------------

    let start = getTimeStampWithOffset(...startDate, 0);
    let end = getTimeStampWithOffset(...endDate);
    let offsetDay = 0;
    while (true) {
        console.log(start.date, startDate, offsetDay);

        if (start.ts > end.ts) {
            break;
        }

        let total = 99999;
        let temp = [];

        for (let i = 0; i < total; i += 25) {
            await waitSeconds();
            let data = await getData(start.ts, i, authorizationToken, xSuperProperties);

            if (data.ok) {
                console.log(` - ${(i/25)+1}`);
                total = data.data.total_results;
                temp = temp.concat(data.data.messages.map(e => e[0]));
            } else {
                console.log(startDate, offsetDay, `offset(data)=${i}`, data.data);
                throw new Error("請求錯誤");
            }
        }

        allData[start.date] = temp;

        offsetDay += 1;
        start = getTimeStampWithOffset(...startDate, offsetDay);
    }

    console.log(allData);
})();