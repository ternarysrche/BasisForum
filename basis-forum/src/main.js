// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'



Vue.config.productionTip = false
Vue.filter('snippet', val => {
  if(!val || typeof(val) != 'string') return ''
  if(val.length > 300) return val.slice(0,300)+'...'
  if(val.length <= 300) return val
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
}).$mount('#app')

