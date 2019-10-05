<template>
    <v-card height="300px" :loading="loading">
        <v-card-title>联网详情</v-card-title>
        <v-list class="transparent">
            <v-list-item>
                <v-list-item-title>状态</v-list-item-title>
                <v-list-item-subtitle>{{
                    isError ? '错误' : online ? '在线' : '离线'
                }}</v-list-item-subtitle>
            </v-list-item>
            <template v-if="!isError && online">
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
    </v-card>
</template>

<script>
import { sprintf } from 'sprintf-js';

export default {
    data() {
        return {
            loading: false,
            online: false,
            isError: false,
            username: '',
            usedBytes: 0,
            onlineTime: 0,
            timer: null,
        };
    },

    async mounted() {
        this.loading = true;
        try {
            this.online = await this.$helper.isOnline();
            const userInfo = await this.$helper.getUserInfo();
            this.username = userInfo.username;
            this.usedBytes = userInfo.usedBytes;
            this.onlineTime = userInfo.onlineTime;
            this.timer = setInterval(() => this.onlineTime++, 1000);
        } catch (_) {
            this.isError = true;
        } finally {
            this.loading = false;
        }
    },

    destroyed() {
        if (this.timer !== null) {
            clearInterval(this.timer);
            this.timer = null;
        }
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
