<template>
    <v-card height="320px" :loading="loading">
        <v-card-title>联网设备</v-card-title>

        <v-card-text v-if="deviceList.lenght === 0">暂无设备</v-card-text>
        <v-simple-table v-else dense>
            <template v-slot:default>
                <thead>
                    <th class="text-left">IP地址</th>
                    <th class="text-left">上线时间</th>
                    <th class="text-left">设备类型</th>
                </thead>
                <tbody>
                    <tr v-for="device of deviceList" :key="device.addr">
                        <td>{{ device.addr }}</td>
                        <td>{{ device.startTime }}</td>
                        <td>{{ device.deviceType }}</td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>

        <v-card-actions>
            <v-btn text icon color="green" @click="refreshDeviceList"><v-icon>mdi-refresh</v-icon></v-btn>
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
export default {
    data() {
        return {
            loading: false,
            showDialog: false,
            dialogMsg: '',
            deviceList: [],
        };
    },

    async mounted() {
        await this.useregLogin();
        await this.refreshDeviceList();
    },

    methods: {
        async useregLogin() {
            const [username, password] = await this.$storage.getCredentials();
            if (!username || !password) {
                this.showDialog = true;
                this.dialogMsg = '未设置用户名和密码';
                return false;
            }
            this.loading = true;
            if (!await this.$helper.useregLogin(username, password)) {
                this.showDialog = true;
                this.dialogMsg = '登录失败';
                this.loading = false;
                return false;
            }

            this.loading = false;
            return true;
        },

        async refreshDeviceList() {
            this.loading = true;
            try {
                this.deviceList = await this.$helper.getOnlineDevices();
            } catch (_) {
                this.showDialog = true;
                this.dialogMsg = '获取在线设备失败';
            } finally {
                this.loading = false;
            }
        }
    },
}
</script>
