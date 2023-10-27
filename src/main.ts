import '@/styles/main.scss'
import "light-icons/dist/light-icon.css";

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/layouts/App.vue'
import router from '@/router'
import LvButton from 'lightvue/button'
import LvDialog from 'lightvue/dialog'
import LvInput from 'lightvue/input'
import VueTableLite from "vue3-table-lite"
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

//- Global component registration
app.component('LvButton', LvButton)
app.component('LvDialog', LvDialog)
app.component('LvInput', LvInput)
app.component('TableLite', VueTableLite)
app.component('VueDatePicker', VueDatePicker)

app.mount('#app')
