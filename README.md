## Medium-poster
This module was born for posting article to Medium. And It can help you easily move articles from you local.

Because this project's idea is come from hexo's need, so the default config is also fit the hexo.

Hope you using this module and writing articles well.

## Environment
- node version: 16.2.0

## Road Map
- inner data saving: saving config, token...
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
| uploadDirPath             | V        | ??????????????????????????????                                                                        |
| excludeMds                |          | ???????????????????????????????????????????????????; ??????????????????                                            |
| mediumOpts.canonicalUrl   |          | (medium api params) ???????????????                                                              |
| mediumOpts.publishStatus  |          | (medium api params) ????????????: draft, publish, unlisted                                      |
| mediumOpts.contentFormat  |          | (medium api params) ??????????????????????????????                                                    |
| mediumOpts.license        |          | (medium api params) license of article;  ????????????medium api ??????                            |
| mediumOpts.tags           |          | (medium api params) ????????????????????????????????????                                                |
| mediumOpts.publicationUrl |          | ??????publication???????????????token?????????????????????publication?????????????????????????????????????????????????????? |
| articleOpts.isAddTitle    |          | (for hexo) ????????????true????????????hexo?????????title??????????????????                                  |

## Usage Example: post article by article path
use this line to post single article.

**note: medium config is also depend on config.json**

```shell
MEDIUM_TOKEN=xxx node -e "require('medium-poster').postArticleByPath('./source/_posts/xxx.md')"
```