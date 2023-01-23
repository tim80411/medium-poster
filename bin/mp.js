#!/usr/bin/env node
const _ = require('lodash');
const { program } = require('commander');

const MainService = require('../MainService');
const SecretService = require('../Services/SecretService');
const pjson = require('../package.json');

program
  .version(pjson.version);

program.command('secret')
  .description('saving secrets in package')
  .action(() => SecretService.guideInit());

program.command('init')
  .description('init medium-poster config.json')
  .option('-p, --path <string>', 'where config file create, ex: ./config.json')
  .option('-f, --force', 'force init config')
  .action((options) => {
    const force = _.get(options, 'force', false);
    MainService.initConfig(options.path, { isForceInit: force });
  });

program.command('post')
  .description('post path article to medium by config.json')
  .argument('<path>', 'article path to post')
  .option('-t, --token <token string>', 'medium token to verify user identity')
  .option('-c, --config-path <path>', 'custom config path')
  .action((path, options) => {
    const postOption = { token: options.token };
    MainService.postArticleByPath(path, options['config-path'], postOption);
  });

program.command('batch')
  .description('post multi articles to medium by config.json')
  .option('-t, --token <token string>', 'medium token to verify user identity')
  .option('-c, --config-path <path>', 'custom config path')
  .action((options) => {
    MainService.postArticlesByConfig(options.token, options.configPath);
  });

program.parse();
