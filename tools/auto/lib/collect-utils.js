import fs from "fs";

class Utils {
    /**
     * 取得指定日期的雪花值 (用於 Discord 搜尋參數)
     * 
     * @param {number} ts timestamp
     * @param {boolean} addOneDay
     * @returns {number}
     */
    getSnowflake(ts, addOneDay = false) {
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
    getTimeStampWithOffset(startY, startM, startD, offsetDays = 0) {
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
    waitSeconds(second = 6) {
        return new Promise(resolve => setTimeout(resolve, second * 1000));
    }

    /**
     * 取得指定日期時間
     * @param {Date} date
     * @param {Boolean} [hasTime]
     * @returns {string}
     */
    dateFormatter(date, hasTime = true) {
        let Y = date.getFullYear();
        let M = `0${date.getMonth()+1}`.substr(-2);
        let D = `0${date.getDate()}`.substr(-2);
        let h = `0${date.getHours()}`.substr(-2);
        let m = `0${date.getMinutes()}`.substr(-2);
        let s = `0${date.getSeconds()}`.substr(-2);

        if (hasTime) {
            return `${Y}-${M}-${D} ${h}:${m}:${s}`;
        } else {
            return `${Y}-${M}-${D}`;
        }
    }

    /**
     * @typedef DateWithString
     * @property {Date} date
     * @property {string} str
     */

    /**
     * 取得日期偏移
     * @param {Date} date
     * @param {number} offsetDays 偏移日數
     * @returns {DateWithString}
     */
    dateOffset(date, offsetDays) {
        date.setDate(date.getDate() + offsetDays);

        return {
            date: date,
            str: this.dateFormatter(date, false)
        };
    }

    /**
     * 儲存檔案
     * 
     * @param {Object.<string, Array<Message>>} allData
     * @param {string} path
     * @returns {string}
     */
    saveData(allData, path) {
        let keys = Object.keys(allData).sort((a, b) => a.localeCompare(b));

        if (keys.length === 0) {
            throw new Error("傳入的物件沒有任何資料.");
        }

        let startDay = keys[0].replace(/\-/g, "");
        let endDay = keys[keys.length - 1].replace(/\-/g, "");

        let filename = `AFK-collection-${startDay}-${endDay}.json`;

        path = path.replace(/\/$/, "");

        fs.writeFileSync(`${path}/${filename}`, JSON.stringify(allData, null, '\t'));

        let temp = endDay.replace(/(....)(..)(..)/, "$1-$2-$3").split("-");
        let saveEndDay = this.getTimeStampWithOffset(...temp, 1);

        return saveEndDay.date;
    }

    /**
     * 更新 last-update.txt
     * 
     * @param {string} data
     * @param {string} cwdPath
     */
    saveLastUpdate(data, cwdPath) {
        if (!data.match(/....\-..\-../)) {
            throw new Error("傳入的參數 data 不符合 last-update.txt 的格式.");
        }

        cwdPath = cwdPath.replace(/\/$/, "");

        fs.writeFileSync(`${cwdPath}/last-update.txt`, data);
    }
}

export default new Utils();