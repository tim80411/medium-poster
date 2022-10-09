const _ = require('lodash');
const fs = require('fs');
const fsPromise = require('fs/promises');
const path = require('path');

const MediumService = require('./MediumService');

const repoRootPath = process.cwd();

class MainService {
  static get #validFileExts() {
    return ['.md', '.html'];
  }

  /**
   * init config setting
   * @param {String} [dstPath] 目標檔案地址; ex: './config.json'
   * @param {Object} [opt] 選項
   * @param {Boolean} [opt.isForceInit] 是否強迫目標檔案地址重新建立config.json
   */
  static async initConfig(dstPath = '', opt) {
    const isForceInit = _.get(opt, 'isForceInit', false);

    const _srcPath = path.join(repoRootPath, 'template', 'config.json');

    const _dstPath = dstPath || path.join(repoRootPath, 'config.json');
    const _dstJsonPath = path.join(path.dirname(_dstPath), path.parse(_dstPath).name) + '.json';

    const mode = isForceInit ? fs.constants.COPYFILE_FICLONE : fs.constants.COPYFILE_EXCL

    await fsPromise.copyFile(_srcPath, _dstJsonPath, mode);
  }

  /**
   * 根據config的設定上傳文章
   *
   * mediumOpts參考: https://github.com/Medium/medium-api-docs#21-self-issued-access-tokens
   * @param {String} token medium token; 請參考官方文件取得token
   * @param {String} configPath config檔案的路徑
   * @returns 
   */
  static async postArticlesByConfig(token, configPath) {
    const config = await this.#getConfig(configPath);

    const { uploadDirPath, excludeMds, mediumOpts, articleOpts } = config;

    const fileNames = await fsPromise.readdir(uploadDirPath);

    if (_.isEmpty(fileNames)) {
      console.log('No article need to post to medium');
      return;
    }

    const opt = { isAddTitle: _.get(articleOpts, 'isAddTitle', false) };
    const hasExcludeMds = _.isArray(excludeMds) && !_.isEmpty(excludeMds);
    const mediumAPI = new MediumService(token);
    for (const name of fileNames) {
      if (hasExcludeMds && _.includes(excludeMds, name)) {
        console.log('Exclude post article: ', name);
        return;
      }

      if (!_.includes(this.#validFileExts, path.parse(name).ext)) {
        console.log(`This file: ${name} is not ${_.join(this.#validFileExts, '/')} file`);
        return;
      }

      const articlePath = path.join(uploadDirPath, name);
      const { title, content } = await this.#getArticleByName(articlePath, opt);
      await mediumAPI.postArticle(title, content, mediumOpts.contentFormat, mediumOpts);
    }
  }

  /**
   * 根據給予的路徑及medium設定去發布一則medium文章
   * @param {String} articlePath 文章路徑; ex: `./source/_pos`
   * @param {Object} [mediumOpts] mediumOpts
   * @param {String} [mediumOpts.canonicalUrl] 文章原始路由
   * @param {String[]} [mediumOpts.tags] medium tags
   * @param {'public'|'draft'|'list'} [mediumOpts.publishStatus] 發布狀態; default: `draft
   * @param {Boolean} [mediumOpts.notifyFollowers] 是否通知追蹤者文章已發佈
   * @param {String} [mediumOpts.license] 文章授權機制
   * @param {String} [mediumOpts.publicationUrl] 出版(publication)的網址; ex: https://medium.com/on-my-way-coding; 若此欄位有值則會嘗試將文章發於此出版之下
   * @param {Object} [opt] 選項
   * @param {Boolean} [opt.isAddTitle] 是否將文章名稱加入到文章內容中; for hexo use
   */
  static async postArticleByPath(articlePath, mediumOpts, opt) {
    const mediumAPI = new MediumService(token);

    const isAddTitle = _.get(opt, 'isAddTitle', false);
    const _opt = { isAddTitle };

    const content = await this.#getArticleByName(articlePath, _opt);
    await mediumAPI.postArticle(title, content, mediumOpts.contentFormat, mediumOpts);
  }

  /**
   * 取得文章資料
   * @param {String} articlePath 文章路徑; ex: `./source/_pos`
   * @param {Object} [opt] 選項
   * @param {Boolean} [opt.isAddTitle] 是否將文章名稱加入到文章內容中; for hexo use
   * @returns 
   */
  static async #getArticleByName(articlePath, opt) {
    const isAddTitle = _.get(opt, 'isAddTitle', false);

    const content = await fsPromise.readFile(articlePath, { encoding: 'utf-8' })
    const lines = content.split('\n')

    const titleMD = lines.find((line) => line.includes('title'));
    const title = titleMD ? titleMD.split(':')[1].trim() : _.first(lines);

    const realContentIndex = lines.indexOf('---', 1)
    const realLines = lines.slice(realContentIndex + 1);
    if (isAddTitle) {
      realLines.unshift('---');
      realLines.unshift(`# ${title}`);
    }

    const realContent = realLines.join('\n');

    return { title, content: realContent };
  }

  static async #getConfig(configPath) {
    const _configPath = configPath || path.join(repoRootPath, 'config.json');

    if (!_.eq(path.parse(_configPath).ext, '.json')) throw new Error(`config: ${_configPath} need to be json`);
    if (!fs.existsSync(_configPath)) throw new Error('Config file required, use initConfig() to generate configFile');

    const configFile = await fsPromise.readFile(_configPath, 'utf-8');
    const config = JSON.parse(configFile);

    const { uploadDirPath, excludeMds } = config;

    if (!uploadDirPath || !excludeMds) throw new Error('Config uploadDirPath/excludeMds required');

    return config;
  }
}

module.exports = MainService;