import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'
import useJwtStore from "./stores/store";

const app = createApp(App)
const pinia = createPinia();
app.use(pinia)
app.use(router)

const jwtstore = useJwtStore();
app.use(jwtstore);
app.mount('#app')
