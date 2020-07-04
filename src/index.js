import Vue from 'vue'
import App from './App'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

Vue.use(ElementUi)
Vue.prototype.$axios= axios

/* eslint-disable no-new */
new Vue({
    el: '#app',
    render: h => h(App)
})
  