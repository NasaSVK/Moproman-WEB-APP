//import './assets/main.css'

import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.js"

//import * as bootstrap from 'bootstrap'
//import "bootstrap/js/dist/popover.js"
//import "bootstrap"

import { Popover } from 'bootstrap';

import { createApp } from 'vue'
import App from './App.vue'

import Emitter from 'tiny-emitter';

var emitter = new Emitter();
export default emitter;

const app = createApp(App)

app.mount('#app')

// Create an example popover
document.querySelectorAll('[data-bs-toggle="popover"]')
    .forEach(popover => {
        new Popover(popover)
    })

//import { Vue } from 'vue';
//window.Vue = Vue;
//zobrazovanie hlasok v konzole
//Vue.config.productionTip = true;
