const path = require('path');

const repoRootPath = process.cwd();

const config = {
  defaultConfigPath: path.join(repoRootPath, 'config.json'),
};


module.exports = config;