<template>
    <div>
        <v-btn>{{ message }}</v-btn>
    </div>
</template>

<script>
export default {
    data() {
        return {
            message: '哈哈哈',
        };
    },
    async mounted() {
        let isOnline;
        try {
            isOnline = await this.$helper.isOnline();
        } catch (e) {
            return this.message = '错误';
        }
        this.message = isOnline ? '在线' : '离线';
    },
};
</script>
