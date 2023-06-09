import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import axios from 'axios'
Vue.prototype.$axios = axios
axios.defaults.baseURL = '/base'  //关键代码

// import FileUpload from './components/FileUpload'
import VueResouce from "vue-resource"
Vue.use(VueResouce)
// Vue.component("app-head", FileUpload)



Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
