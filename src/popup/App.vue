<template>
    <v-app>
        <v-navigation-drawer
            app
            v-model="drawer"
            width="180px"
        >
            <v-list dense>
                <v-list-item to="/">
                    <v-list-item-action>
                        <v-list-item-icon>
                            <v-icon>mdi-access-point-network</v-icon>
                        </v-list-item-icon>
                    </v-list-item-action>
                    <v-list-item-title>联网情况</v-list-item-title>
                </v-list-item>
                <v-list-item to="/setting">
                    <v-list-item-action>
                        <v-list-item-icon>
                            <v-icon>mdi-account</v-icon>
                        </v-list-item-icon>
                    </v-list-item-action>
                    <v-list-item-title>账户设置</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar
            app
            color="indigo"
            dark
        >
            <v-app-bar-nav-icon @click.stop="drawer = !drawer">
                <v-icon>mdi-menu</v-icon>
            </v-app-bar-nav-icon>
            <v-toolbar-title>联网助手</v-toolbar-title>
        </v-app-bar>

        <v-content>
            <v-container
                fluid
                class="fill-height"
            >
                <v-layout
                    align-center
                    justify-center
                >
                    <v-flex xs-12>
                        <router-view></router-view>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
export default {
    data() {
        return {
            drawer: false,
        };
    },
};
</script>

<style>
body {
    padding: 0;
    margin: 0;
    width: 300px;
    height: 400px;
    scrollbar-width: none;
}
</style>
