// 執行於 node.js

const data1 = require("../rawdata/AFK-collection-20210625-20210719.json");
const data2 = require("../rawdata/AFK-collection-20210720-20210916.json");
const data3 = require("../rawdata/AFK-collection-20210917-20220205.json");
const data4 = require("../rawdata/AFK-collection-20220206-20220217.json");

const fs = require("fs");

/**
 * @typedef MessageAuthor
 * @property {Boolean} bot
 * @property {String} id
 * @property {String} username
 * @property {*} avatar
 * @property {String} discriminator
 */

/**
 * @typedef Message
 * @property {Array} attachments
 * @property {MessageAuthor} author
 * @property {String} channel_id
 * @property {Array} components
 * @property {String} content
 * @property {*} edited_timestamp
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
 * @typedef {Object.<string, Array<Message>>} MessageCollection
 */

/**
 * @typedef SortedData
 * @property {String} p [p]layerName
 * @property {Number} c affect players [c]ount
 * @property {Number} m skip [m]inutes
 * @property {String} t [t]imestamp
 */

/**
 * Parse data
 * @param {MessageCollection} collection
 * @returns {Array<SortedData>}
 */
function parser(collection) {
    /** @type {Array<SortedData>} */
    let temp = [];

    Object.values(collection).forEach(messages => {
        messages.forEach(msg => {
            if(msg.author.bot === true) {
                if(msg.content.startsWith("[")) {
                    return;
                }

                let matches = msg.content.match(/^([^\ ]+).+?\(([0-9]+)\ players\).+?skip\ by\ ([0-9]+)\ minutes/);

                if(matches !== null) {
                    temp.push({
                        p: matches[1],
                        c: matches[2] - 0,
                        m: matches[3] - 0,
                        t: msg.timestamp
                    });
                }
            }
        });
    });

    return temp;
}

let allData = [];

allData = allData.concat(parser(data1));
allData = allData.concat(parser(data2));
allData = allData.concat(parser(data3));
allData = allData.concat(parser(data4));


fs.writeFileSync("./all-data.json", JSON.stringify(allData, null, '\t'));