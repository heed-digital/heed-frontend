import 'core-js/stable'
import Vue from 'vue'
import App from './App'
import router from './router'
import CoreuiVue from '@coreui/vue'
import { iconsSet as icons } from './assets/icons/icons.js'
import store from './store'
import axios from 'axios'
import { freeSet } from '@coreui/icons'

// amplify
import Auth from '@aws-amplify/auth';
import '@aws-amplify/ui-vue';
import awsconfig from './aws-exports.heed.js';
const currentConfig = Auth.configure(awsconfig);
window._auth = Auth; // debug

// vue config
Vue.config.performance = true
Vue.use(CoreuiVue)
Vue.prototype.$log = console.log.bind(console)
Vue.prototype.$http = axios.create ({
  baseURL : 'https://api.heed.to',
});

// global error listener
window.addEventListener("error", function (e) {
   console.error("Error occurred: " + e.error.message);
   return false; // allows propagation
});

// helper fn
window.getAccountId = function () {
    if (!Auth.user) return '';
    return Auth.user.attributes['custom:account_id'];
}
   
// helper fn to determine secured route
const secured_route = function (to) {
  return !to.matched.some(function (record) {
      return record.meta.guest;
  });
};

// route guard
router.beforeEach(function (to, from, next) {

    // check if secured route
    var secured = secured_route(to);

    // if not secure route, go ahead
    if (!secured) return next();

    // get auth status
    Auth.currentAuthenticatedUser()

    // authenticated
    .then(function (result) {
        next();
    })

    // not authenticated 
    .catch(function (err) {
        next({ path : '/login' }) // redirect to login
    });

});

new Vue({
  el: '#app',
  router,
  store,
  icons,
  template: '<App/>',
  components: {
    App
  }
})


