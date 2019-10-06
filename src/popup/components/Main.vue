<template>
    <v-card height="320px" :loading="loading">
        <v-card-title>联网详情</v-card-title>
        <v-list class="transparent">
            <v-list-item>
                <v-list-item-title>状态</v-list-item-title>
                <v-list-item-subtitle>{{
                    errMsg ? errMsg : online ? '在线' : '离线'
                }}</v-list-item-subtitle>
            </v-list-item>
            <template v-if="!errMsg && online">
                <v-list-item>
                    <v-list-item-title>用户名</v-list-item-title>
                    <v-list-item-subtitle>{{ username }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title>在线时长</v-list-item-title>
                    <v-list-item-subtitle>{{ onlineTime | sec2str }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title>已用流量</v-list-item-title>
                    <v-list-item-subtitle>{{ usedBytes | byte2str }}</v-list-item-subtitle>
                </v-list-item>
            </template>
        </v-list>

        <v-card-actions>
            <v-btn @click="login" text color="blue darken-1" v-if="errMsg || !online">上线</v-btn>
            <v-btn @click="logout" text color="blue darken-1" v-else>断线</v-btn>
            <v-btn @click="refreshStatus" text color="green" icon
                ><v-icon>mdi-refresh</v-icon></v-btn
            >
        </v-card-actions>

        <v-dialog v-model="showDialog">
            <v-card>
                <v-card-title>{{ dialogMsg }}</v-card-title>
                <v-card-actions>
                    <div class="flex-grow-1"></div>
                    <v-btn text color="green" @click="showDialog = false">确认</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
import { sprintf } from 'sprintf-js';
import throttle from 'lodash.throttle';

export default {
    data() {
        return {
            loading: false,
            online: false,
            errMsg: null,
            username: '',
            usedBytes: 0,
            onlineTime: 0,
            timer: null,
            showDialog: false,
            dialogMsg: '',
        };
    },

    mounted() {
        this.refreshStatus();
    },

    destroyed() {
        if (this.timer !== null) {
            clearInterval(this.timer);
            this.timer = null;
        }
    },

    methods: {
        refreshStatus: throttle(async function() {
            this.errMsg = null;
            this.loading = true;
            try {
                this.online = await this.$helper.isOnline();
                const userInfo = await this.$helper.getUserInfo();
                this.username = userInfo.username;
                this.usedBytes = userInfo.usedBytes;
                this.onlineTime = userInfo.onlineTime;
                if (this.timer !== null) {
                    clearInterval(this.timer);
                }
                this.timer = setInterval(() => this.onlineTime++, 1000);
            } catch (_) {
                this.errMsg = '刷新失败';
            } finally {
                this.loading = false;
            }
        }, 200),
        async logout() {
            this.loading = true;
            try {
                await this.$helper.logout();
            } catch (_) {
                this.isError = true;
            }
            this.refreshStatus();
        },
        async login() {
            console.log('hahah');
            const [username, password] = await this.$storage.getCredentials();
            if (!username || !password) {
                this.dialogMsg = '未保存用户名和密码';
                this.showDialog = true;
                return;
            }
            this.loading = true;
            try {
                this.errMsg = await this.$helper.login(username, password);
            } catch (_) {
                this.errMsg = '登录失败';
            } finally {
                this.loading = false;
            }
            if (this.errMsg === null) {
                this.refreshStatus();
            }
        },
    },

    filters: {
        sec2str(sec) {
            const h = Math.floor(sec / 3600);
            const m = Math.floor((sec % 3600) / 60);
            const s = sec % 60;
            return sprintf('%02d:%02d:%02d', h, m, s);
        },
        byte2str(bytes) {
            const format = (num, unit) => sprintf('%.2f%s', bytes / num, unit);
            const nums = [1e9, 1e6, 1e3, 1];
            const units = ['G', 'M', 'K', 'B'];
            for (let i = 0; i < 4; i++) {
                if (bytes > nums[i]) {
                    return format(nums[i], units[i]);
                }
            }
        },
    },
};
</script>
