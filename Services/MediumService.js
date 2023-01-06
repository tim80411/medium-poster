const axios = require('axios');
const _ = require('lodash');

class MediumService {
  constructor(token) {
    this.token = token;
    if (!token) throw new Error('Token Required');

    this.userId = null;
    this.publications = null;
  }

  static get apiDomain() {
    return 'https://api.medium.com';
  }

  get httpConfig() {
    return {
      headers: {
        Host: 'api.medium.com',
        'Content-type': 'application/json',
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/json',
        'Accept-Charset': 'utf-8',
      },
    };
  }

  get apiUrl() {
    return {
      getMe: `${MediumService.apiDomain}/v1/me`,
      getPublications: `${MediumService.apiDomain}/v1/users/${this.userId}/publications`,
      postArticle: `${MediumService.apiDomain}/v1/users/${this.userId}/posts`,
      postArticleToPublication: `${MediumService.apiDomain}/v1/publications/:publicationId/posts`,
    };
  }

  async getMe() {
    const res = await axios.get(this.apiUrl.getMe, this.httpConfig);
    const user = res?.data?.data;

    if (!user) throw new Error('User not found');
    this.userId = user.id;

    return user;
  }

  async getPublications() {
    const res = await axios.get(this.apiUrl.getPublications, this.httpConfig);
    const publications = res?.data?.data;
    this.publications = publications;
    return publications;
  }

  /**
   * general use
   *
   * 參考: https://github.com/Medium/medium-api-docs#creating-a-post
   * @param {String} title 標題
   * @param {String} content 文章內容
   * @param {'html'|'markdown'} [contentFormat] 文章的解析方式; default: `markdown`
   * @param {Object} [mediumOpts] mediumOpts
   * @param {String} [mediumOpts.canonicalUrl] 文章原始路由
   * @param {String[]} [mediumOpts.tags] medium tags
   * @param {'public'|'draft'|'list'} [mediumOpts.publishStatus] 發布狀態; default: `draft
   * @param {Boolean} [mediumOpts.notifyFollowers] 是否通知追蹤者文章已發佈
   * @param {String} [mediumOpts.license] 文章授權機制
   * @param {String} [mediumOpts.publicationUrl] 出版(publication)的網址; ex: https://medium.com/on-my-way-coding; 若此欄位有值則會嘗試將文章發於此出版之下
   * @returns
   */
  async postArticle(title, content, contentFormat, mediumOpts) {
    if (!title || !content || !contentFormat) {
      throw new Error('title/content required');
    }

    const {
      canonicalUrl,
      tags,
      publishStatus,
      notifyFollowers,
      license,
      publicationUrl,
    } = mediumOpts;

    const apiUrl = await this.#getPostArticleUrl({ publicationUrl });

    const res = await axios.post(
      apiUrl,
      {
        title,
        contentFormat: contentFormat || 'markdown',
        content,
        canonicalUrl,
        tags,
        publishStatus: publishStatus || 'draft',
        license,
        notifyFollowers,
      },
      this.httpConfig,
    );

    console.log('Post article success', _.get(res, 'data.data.url', ''));

    return res?.data;
  }

  async #getPostArticleUrl({ publicationUrl }) {
    // this.userId required
    if (!this.userId) await this.getMe();

    let apiUrl = this.apiUrl.postArticle;
    if (publicationUrl) {
      await this.getPublications();

      if (_.isEmpty(this.publications)) {
        throw new Error('Publication is empty, please check your medium first then test getPublications API');
      }

      const publicationId = this.publications.find((item) => item.url === publicationUrl)?.id;

      if (!publicationId) {
        throw new Error(`Can not find url: ${publicationUrl} at your publication list, make sure your publication url is right`);
      }

      apiUrl = this.apiUrl.postArticleToPublication.replace(':publicationId', publicationId);
    }

    return apiUrl;
  }
}

module.exports = MediumService;
