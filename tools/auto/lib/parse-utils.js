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


class ParseUtils {
    /**
     * Parse data
     * @param {MessageCollection} collection
     * @returns {Array<SortedData>}
     */
    parser(collection) {
        /** @type {Array<SortedData>} */
        let temp = [];

        Object.values(collection).forEach(messages => {
            messages.forEach(msg => {
                if (msg.author.bot === true) {
                    if (msg.content.startsWith("[")) {
                        return;
                    }

                    let matches = msg.content.match(/^([^\ ]+).+?\(([0-9]+)\ players\).+?skip\ by\ ([0-9]+)\ minutes/);

                    if (matches !== null) {
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
}

export default new ParseUtils();