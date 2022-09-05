import ApiCaller from '../utils/apicaller';
import {Credential} from '../utils/interfaces';

class AuthManager {
  private static instance: AuthManager;

  private constructor() {}

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }

    return AuthManager.instance;
  }

  async login(username: string, password: string) {
    const fs = require('fs');
    const path = './config.json';

    if (fs.existsSync(path)) {
      const expireDate = 14 * 24 * 60 * 60;

      const isExpired =
        (new Date().getTime() - fs.statSync(path).mtime) / 1000 >= expireDate;

      if (!isExpired) {
        const credential: Credential = JSON.parse(
          fs.readFileSync(path, {encoding: 'utf8', flag: 'r'})
        );
        fs.writeFileSync('config.json', JSON.stringify(credential));

        ApiCaller.getInstance().setCredential(credential);
        return;
      }
    }
    const {chromium} = require('playwright');

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://leetcode.com/accounts/login/');
    await page.locator('id=id_login').fill(username);
    await page.locator('id=id_password').fill(password);
    await page.click('id=signin_btn');
    await page.waitForURL('https://leetcode.com');

    const credential: Credential = {
      session: '',
      csrftoken: '',
    };

    const cookies = await page.context().cookies();

    for (let i = 0; i < cookies.length; i++) {
      if (cookies[i]['name'] === 'csrftoken') {
        credential.csrftoken = cookies[i]['value'];
      } else if (cookies[i]['name'] === 'LEETCODE_SESSION') {
        credential.session = cookies[i]['value'];
      }
    }

    await page.close();
    await context.close();
    await browser.close();

    fs.writeFileSync('config.json', JSON.stringify(credential));
    ApiCaller.getInstance().setCredential(credential);
  }
}

export default AuthManager;
