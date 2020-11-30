// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import Vue from 'vue/dist/vue.common.js'
import ELEMENT from 'element-ui'
import VueResource from 'vue-resource'
import store from './store'
// import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import './assets/font/iconfont.css'
import './assets/icon/iconfont.css'
import 'babel-polyfill'
import Multiselect from 'vue-multiselect'
import Nprogress from 'nprogress'
import './assets/nprogress/nprogress.css'
import VueBus from 'vue-bus'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import '../node_modules/ag-grid/dist/styles/ag-grid.css'
import '../node_modules/ag-grid/dist/styles/ag-theme-balham.css'
import VideoPlayer from 'vue-video-player'
import echarts from 'echarts'
import Print from './utils/print.js';
import { API_GATEWAY } from '@/config/index.js'
import Ajaxer from './mixins/ajax.js'
import i18n from './i18n'
import { getLang } from './utils/util'
import router from './router'
// import Directives from '@/directives/directives'; // 自定义全局指令
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);
// Vue.use(Directives); // 使用该全局指令
Vue.use(Print);
Vue.use(VideoPlayer)
// Vue.use(echarts)
window.Nprogress = Nprogress
Vue.use(VueQuillEditor)
Vue.use(VueBus)
Vue.use(ELEMENT)
Vue.use(VueResource)
Vue.component(Multiselect)
if (process.env.NODE_ENV === 'development') {
  require('element-ui/lib/theme-chalk/index.css')
}
import App from './App'


const sessionStorage = window.sessionStorage
const localStorage = window.localStorage
var token = localStorage.getItem('token')
var localuser = JSON.parse(localStorage.getItem('user'))
if (token && localuser) {
  sessionStorage.setItem('user', JSON.stringify(localuser))
  sessionStorage.setItem('token', token)
}
router.beforeEach((to, from, next) => {
  Nprogress.start()
  // 生产环境，检查版本号
if (process.env.NODE_ENV === 'production') {
  axios.get('../static/version.json?_=' + Math.random()).then(response => {
    if (200 == response.status) {
        if (process.env.VERSION !== response.data.version) {

            var message = "系统版本有更新，点击确认加载最新，或按【CTRL + F5】！"
            Vue.prototype.$alert(message, '系统提示', {
              confirmButtonText: '确定',
              callback: function(){
                window.location.reload(true);
              }
            });

            return;
        }
        next();
    }
    }).catch(err => {
        console.error(err);
        next();
    });
} 
  
  if (to.path === '/login') {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
  const token = localStorage.getItem('token')
  if (!token) {
    if (to.path === '/register') {
      next()
    } else if (to.path === '/forgetPwd') {
      next()
    } else if (to.path === '/login') {
      next()
    } else if (to.path === '/agreement') {
      next()
    } else if (to.path === '/questionnaire') {
      next()
    } else if (to.path === '/questionnaireCommunity') {
      next()
    } else if (to.path === '/epidemicSituation') {
      next()
    } else if (to.path === '/lightAreaQuestionnaire') {
      next()
    } else if (to.path === '/lightAreaSchoolQuestionnaire') {
      next()
    } else if (to.path === '/lightAreaCompanyQuestionnaire') {
      next ()
    }else if (to.path === '/absManagement') {
      next ()
    }
    else {
      next({ path: '/login' })
    }
  } else {
    next()
  }
})

router.afterEach(transition => {
  Nprogress.done()
})

Vue.prototype.BASEAPI = `${API_GATEWAY}/api`
Vue.prototype.$eventBus = new Vue()
// Vue.http.options.emulateJSON = true
// Vue.http.options.root = '/api'
Vue.http.interceptors.push((request, next) => {
  Nprogress.start()
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user')) || {}
  var sessionUser = JSON.parse(sessionStorage.getItem('user'));
  if (sessionUser && user) {
    if (sessionUser.id !== user.id) {
      window.location.reload()
    }
  }
  if (token) {
    request.headers.set('Authorization', 'Bearer ' + token)
    request.headers.set('X-TenantId', user.tenantId)
    request.headers.set('X-Logined-Sign', user.username)
    request.headers.set('Prefer-Lang', getLang())
  }
  next((response) => {
    Nprogress.done()
    if (response.status === 404) {
      // router.go('/login')
    } else if (response.status === 401) {
      if (!response.data.exception) {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('settlement')
        router.go('/login')
      }
    }
  })
})

/* eslint-disable no-new */
window.app = new Vue({
  el: '#app',
  mixins: [Ajaxer],
  i18n,
  store,
  router,
  template: '<App/>',
  components: { App }
})
