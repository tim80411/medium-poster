#!/usr/bin/env node
const _ = require('lodash');
const { program } = require('commander');
const inquirer = require('inquirer');
const fsPromise = require('fs/promises');
const fs = require('fs');
const path = require('path');

const MainService = require('../MainService');
const pjson = require('../package.json');

const modulePath = __dirname;

program
  .version(pjson.version);

program.command('secret')
  .description('saving secrets in package')
  .action(async () => {
    try {
      const answers = await inquirer.prompt([
        { type: 'input', name: 'MEDIUM_TOKEN', message: 'Please enter medium token' },
      ]);

      // TODO: 如果檔案換位置這裡就GG，之後在想個方式確保一定能在固定位置，像是固定位置~/.mp之類的
      const secretPath = path.resolve(modulePath, '../secrets.json');
      await fsPromise.writeFile(secretPath, JSON.stringify(answers));
    } catch (error) {
      if (error.isTtyError) {
        console.log(`tty error: ${error.name}`, error.message);
      } else {
        console.log(`general error: ${error.name}`, error.message);
      }
    }
  });
// .

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
