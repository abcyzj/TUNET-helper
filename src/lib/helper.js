import Axios from 'axios';

const NET_HOME = 'https://net.tsinghua.edu.cn';
const NET_CHECK_ONLINE = `${NET_HOME}/do_login.php`;
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
        const ans = await this.http.post(NET_CHECK_ONLINE, form);
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
}
