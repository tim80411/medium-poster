const path = require('path');
const inquirer = require('inquirer');
const fsPromise = require('fs/promises');

class SecretService {
  static get #modulePath() {
    return path.resolve(__dirname, '../');
  }

  static async guideInit() {
    try {
      const answers = await inquirer.prompt([
        { type: 'input', name: 'MEDIUM_TOKEN', message: 'Please enter medium token' },
      ]);

      // TODO: 如果檔案換位置這裡就GG，之後在想個方式確保一定能在固定位置，像是固定位置~/.mp之類的
      const secretPath = path.resolve(this.#modulePath, './secrets.json');
      await fsPromise.writeFile(secretPath, JSON.stringify(answers));
    } catch (error) {
      if (error.isTtyError) {
        console.log(`tty error: ${error.name}`, error.message);
      } else {
        console.log(`general error: ${error.name}`, error.message);
      }
    }
  }
}

module.exports = SecretService;
