import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import router from './router' // Убедитесь, что роутер импортирован
import './assets/main.css' // Убедитесь, что CSS импортирован

const app = createApp(App)
const pinia = createPinia()
app.use(pinia) // Подключаем Pinia к приложению
app.use(router) 
app.use(ElementPlus)

app.mount('#app') // Убедитесь, что монтирование происходит в '#app'