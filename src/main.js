import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/apis/axiosConfig";

//bootstrap 추가
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap-icons/font/bootstrap-icons.css"; // 🔔 아이콘용
store.dispatch("loadAuthFromStorage");
createApp(App).use(store).use(router).mount("#app");
