/* eslint @typescript-eslint/no-var-requires: "off" */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store, key } from './store'
import { Quasar } from 'quasar'
import axios from 'axios'

const quasarUserOptions = require('./quasar-user-options')

createApp(App).use(Quasar, quasarUserOptions).use(store, key).use(router).mount('#app')
