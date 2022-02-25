import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router.js';
import global from "@/global";

require("typeface-open-sans");

const app = createApp(App);
app.provide('global', global);
app.use(router);
app.mount("#app");