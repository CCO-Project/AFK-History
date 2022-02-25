import fetch from "node-fetch";
import utils from "./collect-utils.js";

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
 * @returns {Promise<Result>}
 */
 async function getData(ts, offset, authorizationToken) {
    let min_id = utils.getSnowflake(ts);
    let max_id = utils.getSnowflake(ts, true);
    let content = "has used Global Time Skip, all online players currently performing AFK task";

    let data = await fetch(`https://discord.com/api/v9/guilds/742992894167744552/messages/search?min_id=${min_id}&max_id=${max_id}&content=${encodeURI(content)}&sort_by=timestamp&sort_order=asc&offset=${offset}`, {
        "headers": {
            "authorization": authorizationToken,
            "x-discord-locale": "zh-TW"
        }
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


export default getData;