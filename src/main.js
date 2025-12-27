import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import '@fortawesome/fontawesome-free/css/all.css'
import 'aos/dist/aos.css'
import './assets/css/main.css'

const app = createApp(App)
app.use(router)
app.mount('#app')