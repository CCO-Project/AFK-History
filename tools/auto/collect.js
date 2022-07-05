#!/usr/bin/env node

import path from "path";
import fs from "fs";
import argsParser from "args-parser";
import getData from "./lib/collect-get-data.js";
import utils from "./lib/collect-utils.js";

const args = argsParser(process.argv);

/** @type {string} */
const authorizationToken = args["auth"];
const cwd = process.cwd();

let targetDirectory = `${args["target-directory"]}`;

if (authorizationToken === undefined) {
    throw new Error(`缺少必要參數 AuthorizationToken
        (--auth=<TOKEN>)
    `);
}

if (targetDirectory === undefined) {
    throw new Error(`缺少必要參數 TargetDirectory. 
        (--target-directory=<PATH>)
    `);
}

if (!targetDirectory.startsWith("/")) {
    targetDirectory = `${cwd}/${targetDirectory}`;
}

if (!fs.existsSync(targetDirectory)) {
    throw new Error(`'${targetDirectory}' 不存在.`);
}

if (!fs.lstatSync(targetDirectory).isDirectory()) {
    throw new Error(`'${targetDirectory}' 不是一個目錄.`);
}


let lastUpdate = fs.readFileSync("last-update.txt").toString();
let yesterday = utils.dateOffset(new Date(), -1);

console.log(`\n\t開始更新資料... ${lastUpdate} ~ ${yesterday.str}\n`);

let allData = {};

(async () => {
    const startDate = lastUpdate.split("-");
    const endDate = yesterday.str.split("-");

    let start = utils.getTimeStampWithOffset(...startDate, 0);
    let end = utils.getTimeStampWithOffset(...endDate);
    let offsetDay = 0;

    while (true) {
        if (start.ts > end.ts) {
            break;
        }

        let total = 99999;
        let temp = [];

        for (let i = 0; i < total; i += 25) {
            let data = await getData(start.ts, i, authorizationToken);

            if (data.ok) {
                if (i === 0) {
                    console.log(`正在取得 ${start.date} 的資料, 本日共有: ${data.data.total_results} 筆資料`);
                }
    
                total = data.data.total_results;
                temp = temp.concat(data.data.messages.map(e => e[0]));
            } else {
                // TODO: 補救機制待處理 (暫時消極處理)
                console.warn(startDate, offsetDay, `offset(data)=${i}`, data.data);
                console.warn(`請求發生錯誤: ${JSON.stringify(data.data)}`);
            }

            await utils.waitSeconds();
        }

        allData[start.date] = temp;

        offsetDay += 1;
        start = utils.getTimeStampWithOffset(...startDate, offsetDay);
    }

    let thisLastUpdate = utils.saveData(allData, targetDirectory);
    utils.saveLastUpdate(thisLastUpdate, cwd);

    console.log("已完成");
})();