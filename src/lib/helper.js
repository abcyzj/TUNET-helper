import Axios from 'axios';
import CryptoJS from 'crypto-js';

const NET_HOME = 'https://net.tsinghua.edu.cn';
const NET_LOGIN_ACTION = `${NET_HOME}/do_login.php`;
const NET_USER_INFO = `${NET_HOME}/rad_user_info.php`;

export default class TUNETHelper {
    constructor() {
        this.http = Axios.create({
            withCredentials: true,
        });

        this.state = {};
    }

    async isOnline() {
        await this.http.get(NET_HOME);
        const form = new FormData();
        form.set('action', 'check_online');
        const ans = await this.http.post(NET_LOGIN_ACTION, form);
        if (ans.data === 'online') {
            this.state.isOnline = true;
        } else {
            this.state.isOnline = false;
        }
        return this.state.isOnline;
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
}
