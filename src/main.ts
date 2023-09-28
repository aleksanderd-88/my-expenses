import '@/styles/main.scss'
import "light-icons/dist/light-icon.css";

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/layouts/App.vue'
import router from '@/router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
