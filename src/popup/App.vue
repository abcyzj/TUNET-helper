<template>
    <div>
        <v-btn>{{message}}</v-btn>
    </div>
</template>

<script>
export default {
    data() {
        return {
            message: '哈哈哈',
        };
    },
    mounted() {
        setTimeout(() => {
            this.message = '开心';
        }, 1000);
    },
};
</script>
