//zobrazovanie hlasok v konzole
Vue.config.productionTip = true;

//import './assets/main.css'
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.js"
//import * as bootstrap from 'bootstrap'
//import "bootstrap/js/dist/popover.js"
//import "bootstrap"
import { Popover } from 'bootstrap';

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')

// Create an example popover
document.querySelectorAll('[data-bs-toggle="popover"]')
    .forEach(popover => {
        new Popover(popover)
    })
