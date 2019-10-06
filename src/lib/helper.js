import Axios from 'axios';
import CryptoJS from 'crypto-js';
import Cheerio from 'cheerio';

const NET_HOME = 'https://net.tsinghua.edu.cn';
const NET_LOGIN_ACTION = `${NET_HOME}/do_login.php`;
const NET_USER_INFO = `${NET_HOME}/rad_user_info.php`;

const USEREG_HOME = 'https://usereg.tsinghua.edu.cn';
const USEREG_LOGIN_ACTION = `${USEREG_HOME}/do.php`;
const USEREG_ONLINE_DEVICE = `${USEREG_HOME}/online_user_ipv4.php`;

export default class TUNETHelper {
    constructor() {
        this.http = Axios.create({
            withCredentials: true,
        });
    }

    async isOnline() {
        await this.http.get(NET_HOME);
        const form = new FormData();
        form.set('action', 'check_online');
        const ans = await this.http.post(NET_LOGIN_ACTION, form);
        return ans.data === 'online';
    }

    async getUserInfo() {
        const ans = await this.http.post(NET_USER_INFO);
        const info = ans.data.split(',');

        return {
            username: info[0],
            usedBytes: parseInt(info[6]),
            onlineTime: parseInt(info[2] - info[1]),
        };
    }

    async logout() {
        const form = new FormData();
        form.set('action', 'logout');
        await this.http.post(NET_LOGIN_ACTION, form);
    }

    async login(username, password) {
        const md5 = CryptoJS.MD5(password).toString(CryptoJS.enc.Hex);
        const form = new FormData();
        form.set('username', username);
        form.set('password', `{MD5_HEX}${md5}`);
        form.set('action', 'login');
        form.set('ac_id', 1);
        const res = await this.http.post(NET_LOGIN_ACTION, form);
        if (res.data === 'Login is successful.') {
            return null;
        } else {
            return res.data;
        }
    }

    async useregLogin(username, password) {
        const md5 = CryptoJS.MD5(password).toString(CryptoJS.enc.Hex);
        const form = new FormData();
        form.set('action', 'login');
        form.set('user_login_name', username);
        form.set('user_password', md5);
        const res = await this.http.post(USEREG_LOGIN_ACTION, form);
        return res.data === 'ok';
    }

    async getOnlineDevices() {
        const res = await this.http.get(USEREG_ONLINE_DEVICE);
        const $ = Cheerio.load(res.data);
        const deviceLines = $('tr[align=center]').toArray();
        deviceLines.splice(0, 1);
        const deviceInfo = deviceLines.map(line => {
            const curSelector = Cheerio.load(line);
            const tds = curSelector('td').toArray();
            return {
                addr: tds[1].firstChild.data,
                startTime: tds[2].firstChild.data,
                deviceType: tds[11].firstChild.data,
            };
        });
        return deviceInfo;
    }
}
