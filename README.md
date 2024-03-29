## Medium-poster
This module was born for posting article to Medium. And It can help you easily move articles from you local.

Because this project's idea is come from hexo's need, so the default config is also fit the hexo.

Hope you using this module and writing articles well.

## Environment
- node version: 16.2.0

## Road Map
- source base commander, ex: mp <source> <action> <option>
- build test framework
- handle exception

## Restriction
Medium-poster is base on medium api, so it has limitation set by medium.

1. 16 article posting per day.
2. You should avoid table if you use markdown.

## Get Started
- Get token from medium, ref [medium doc](https://github.com/Medium/medium-api-docs#21-self-issued-access-tokens)

- Download module
```
npm install --save medium-poster
```

- Init config
```
node -e "require('medium-poster').initConfig()"
```

- Simple use

add example.js file first
```js
// example.js
const MLoader = require('medium-poster');
const token = process.env.MEDIUM_TOKEN;

(async () => {
  await MLoader.postArticlesByConfig(token);
})()

// It will post md or html file to Medium base on your config
```

exec js file
```bash
node example.js
```

## commander
- install
```bash
npm i --save medium-poster
```

- instruction
```bash
npx mp --help
```

- init config
```bash
npx mp init --help
```

- post article
It will post single article by path and all other option will follow config.
```bash
npx mp post --help
npx mp post -t <token> <path>
```

- batch post articles
It will post multi articles by config directory.
```bash
npx mp batch --help
npx mp batch -t
```

## Config
### Sample
```javascript
{
  "uploadDirPath": "./source/_posts",
  "excludeMds": [],
  "mediumOpts": {
    "canonicalUrl": "https://tim80411.github.io/code-blog/",
    "publishStatus": "public",
    "contentFormat": "markdown",
    "license": "cc-40-by-nc-sa",
    "tags": [],
    "publicationUrl": "https://medium.com/on-my-way-coding"
  },
  "articleOpts": {
    "isAddTitle": false
  }
}
```
### Meaning
Config field like canonicalUrl is from medium api.
You can find more detail from [doc](https://github.com/Medium/medium-api-docs#creating-a-post).

| Config Field              | Required | Description                                                                                 |
| :------------------------ | -------- | :------------------------------------------------------------------------------------------ |
| uploadDirPath             | V        | 需要上傳文章的資料夾                                                                        |
| excludeMds                |          | 上傳文章時排除此欄位包含的檔案名稱; 需包含副檔名                                            |
| mediumOpts.canonicalUrl   |          | (medium api params) 原文章出處                                                              |
| mediumOpts.publishStatus  |          | (medium api params) 文章狀態: draft, publish, unlisted                                      |
| mediumOpts.contentFormat  |          | (medium api params) 文章用什麼格式被解析                                                    |
| mediumOpts.license        |          | (medium api params) license of article;  詳情參照medium api 文件                            |
| mediumOpts.tags           |          | (medium api params) 文章標籤，僅前三能被用上                                                |
| mediumOpts.publicationUrl |          | 輸入publication的網址，若token的身份具有在該publication發布文章的權限，則會將文章發佈在之上 |
| articleOpts.isAddTitle    |          | (for hexo) 此欄位為true時會偵測hexo文章的title並加入內容中                                  |

## Usage Example: post article by article path
use this line to post single article.

**note: medium config is also depend on config.json**

```shell
MEDIUM_TOKEN=xxx node -e "require('medium-poster').postArticleByPath('./source/_posts/xxx.md')"
```