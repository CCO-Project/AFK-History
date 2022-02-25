#!/usr/bin/env node

import path from "path";
import fs from "fs";
import argsParser from "args-parser";
import parseUtils from "./lib/parse-utils.js";

const args = argsParser(process.argv);

/** @type {string} */
const authorizationToken = args["auth"];
const cwd = process.cwd();

let from = `${args["from"]}`;
let to = `${args["to"]}`;

if (authorizationToken === undefined) {
    throw new Error(`缺少必要參數 AuthorizationToken
        (--auth=<TOKEN>)
    `);
}

if (from === undefined) {
    throw new Error(`缺少必要參數 From
        (--from=<PATH>)
    `);
}

if (to === undefined) {
    throw new Error(`缺少必要參數 To
        (--to=<PATH>)
    `);
}

if (!from.startsWith("/")) {
    from = `${cwd}/${from}`;
}

if (!to.startsWith("/")) {
    to = `${cwd}/${to}`;
}

if (!fs.existsSync(from)) {
    throw new Error(`'${from}' 不存在.`);
}

if (!fs.existsSync(to)) {
    throw new Error(`'${to}' 不存在.`);
}

from = from.replace(/\/$/, "");
to = to.replace(/\/$/, "");

let allJsonFiles = fs.readdirSync(from).map(
    file => `${from}/${file}`
).filter(
    file => fs.statSync(file).isFile() && file.endsWith(".json")
);

let allData = [];

allJsonFiles.forEach(file => {
    let data = JSON.parse(fs.readFileSync(file, 'utf8'));
    allData = allData.concat(parseUtils.parser(data));
});

fs.writeFileSync(`${to}/all-data.json`, JSON.stringify(allData, null, '\t'));