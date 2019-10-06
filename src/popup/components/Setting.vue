<template>
    <v-card height="320px">
        <v-card-title>设置</v-card-title>

        <v-row align="center" justify="center">
            <v-form ref="form">
                <v-text-field
                    v-model="username"
                    :counter="10"
                    label="用户名"
                    :rules="validateRule"
                ></v-text-field>
                <v-text-field
                    v-model="password"
                    :counter="20"
                    label="密码"
                    type="password"
                    :rules="validateRule"
                ></v-text-field>
                <v-btn text @click="submit">确认</v-btn>
                <v-btn text @click="clear">清除</v-btn>
            </v-form>
            <v-dialog v-model="showDialog">
                <v-card>
                    <v-card-title>{{ dialogMsg }}</v-card-title>
                    <v-card-actions>
                        <div class="flex-grow-1"></div>
                        <v-btn text color="green" @click="showDialog = false">确认</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
    </v-card>
</template>

<script>
export default {
    data() {
        return {
            username: '',
            password: '',
            validateRule: [v => !!v || '必填项'],
            dialogMsg: '',
            showDialog: false,
        };
    },

    async mounted() {
        const credentials = await this.$storage.getCredentials();
        this.username = credentials[0];
        this.password = credentials[1];
    },

    methods: {
        async submit() {
            if (!this.$refs.form.validate()) {
                return;
            }

            await this.$storage.storeCredentials(this.username, this.password);
            this.showDialog = true;
            this.dialogMsg = '设置已更新';
        },
        async clear() {
            await this.$storage.clearSettings();
            this.username = '';
            this.password = '';
            this.showDialog = true;
            this.dialogMsg = '设置已清空';
        },
    },
};
</script>
