# AFK-History

這裡收集了自 2021-06-25 以來所有課長們開車 (AFK Skip) 的記錄。  
所有資料均解析於 Discord 的訊息。

目前設定每天 8 點 (UTC+8) 將自動更新資料。  
（由於 GitHub Actions 的侷限，更新作業可能略有延遲）


* 計劃發起：`[NGG] temmie_950807`
* 專案設計：`[TEA] LianSheng`
* 資料收集：
  * `[TEA] LianSheng`
  * `[NGG] temmie_950807`


***

## Usage

### Initialize
```bash
npm install
```


### Collect
Collect all afk-skip logs from the day after `last update` (\*) to yesterday from Discord.  
(\* Make sure the `/path/to/project/last-update.txt` exists, and the content should be legal date string like `2022-02-18`)

If the last update is `2022-02-18`, and yesterday is `2022-02-25`, it will collect all logs from `2022-02-18 00:00:00` to `2022-02-25 23:59:59`. (It's base your timezone)

It must be executed in the root directory of this project, or error.

```bash
node ./tools/auto/collect.js \
    --auth=<DISCORD_AUTHORIZATION_TOKEN> \
    --target-directory=./rawdata/ \
```
**Arguments**  
* `auth`: The `<DISCORD_AUTHORIZATION_TOKEN>` is a required parameter to request Discord data, you can get this value by monitoring to network request. (It's `authorization` in the Request Headers)
* `target-directory`: The path of the output file

### Parse
Parse files from specific path, and generate the result files to another specific path.

It must be executed in the root directory of this project, or error.

```bash
node ./tools/auto/parse.js \
    --auth=<DISCORD_AUTHORIZATION_TOKEN> \
    --from=./rawdata/ \
    --to=./data/
```

**Arguments**  
* `auth`: The `<DISCORD_AUTHORIZATION_TOKEN>` is a required parameter to request Discord data, you can get this value by monitoring to network request. (It's `authorization` in the Request Headers)
* `from`: The path of raw data, all json file under this path will be parsed (no recursive).
* `to`: The path of result.