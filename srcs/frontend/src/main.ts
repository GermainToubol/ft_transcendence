import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'
import useJwtStore from "./stores/store";

const pinia = createPinia();
const app = createApp(App)
app.use(pinia)
app.use(router)

const jwtstore = useJwtStore();
app.mount('#app')
