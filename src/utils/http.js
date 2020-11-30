/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
import axios from 'axios';
import router from '@/router';
// import store from '../store/index';
import { Message } from 'element-ui';
import { getLang } from '@/utils/util'
import { API_GATEWAY } from '@/config/index.js'

const BASE_API = `${API_GATEWAY}/api`;

/** 
 * 提示函数 
 * 禁止点击蒙层、显示一秒后关闭
 * @param {String} msg 提示信息
 * @return void
 */
const tip = (msg, type) => {
  Message({
    message: msg || '操作失败',
    duration: 1000,
    type: type
  });
}

/** 
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 * @param void
 * @return void
 */
const toLogin = () => {
  router.replace({
    path: '/login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  });
}

// 创建axios实例
const service = axios.create({ 
  baseURL: BASE_API, // TODO
  timeout: 1000 * 50 
});

/** 刷新token2
 * 
 */
const refreshToken2 = (error) => {
  var curTime = new Date();
  var refreshTime = new Date(Date.parse(window.localStorage.refreshTime));
  // 在用户操作的活跃期内
  if(window.localStorage.refreshTime && (curTime <= refreshTime)){
    // 直接将整个请求 return 出去，不然的话，请求会晚于当前请求，无法达到刷新操作 
    return refreshToken2({token: window.localStorage.Token}).then((res) => {
      if (res.success) {
          tip('refreshToken2 success! loading data...', 'success');

          store.commit("saveToken", res.token); // TODO

          var curTime = new Date();
          var expireDate = new Date(curTime.setSeconds(curTime.getSeconds() + res.expires_in));
          store.commit("saveTokenExpire", expireDate); // TODO

          error.config.__isRetryRequest = true;
          error.config.headers.Authorization = `Bearer ${res.token}`;
          // error.config 包含了当前请求的所有信息
          return service(error.config);
      } else {
          // 刷新token失败 清除token信息并跳转到登录页面
          toLogin()
      }
    });
  }
}
/** 刷新token
 * 
 */
// 从localStorage中获取token，token存的是object信息，有tokenExpireTime和token两个字段
function getToken () {
  let tokenObj = {}
  try {
    tokenObj = storage.get('token')
    tokenObj = tokenObj ? JSON.parse(tokenObj) : {}
  } catch(e) {
    console.error('get token from localStorage error')
  }
  return tokenObj
}

function refreshToken () {
  // instance是当前request.js中已创建的axios实例
  return service.post('/refreshtoken').then(res => res.data)
}

// 给实例添加一个setToken方法，用于登录后方便将最新token动态添加到header，同时将token保存在localStorage中
service.setToken = (obj) => {
  service.defaults.headers['X-Token'] = obj.token
  window.localStorage.setItem('token', JSON.stringify(obj)) // 注意这里需要变成字符串后才能放到localStorage中
}
/** 
 * 请求失败后的错误统一处理 
 * @param {Number} status 请求失败的状态码
 * @param {String} msg 提示信息
 * @return void
 */
const errorHandle = (status, msg) => {
  // 状态码判断
  switch (status) {
    // 401: 未登录状态，跳转登录页
    case 401:
      toLogin();
      break;
    // 403 token过期
    // 清除token并跳转登录页
    case 403:
      tip('会话已过期，请重新登录');
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      // store.commit('loginSuccess', null); // TODO
      setTimeout(() => {
        toLogin();
      }, 1000);
      break;
      // 404请求不存在
    case 404:
      tip('请求的资源不存在');
      break;
    case 500:
      tip(msg);
      break;
    case -999:
      tip(msg);
      break;
    default:
      console.log(msg);
  }
}

// 设置post请求头
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
/** 
 * 请求拦截器 
 * 每次请求前，如果存在token则在请求头中携带token 
 */
service.interceptors.request.use(
  config => {
    // 登录流程控制中，根据本地是否存在token判断用户的登录情况        
    // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token        
    // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码        
    // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。        
    // const tokenObj = getToken()
    // // 添加请求头
    // config.headers['X-Token'] = tokenObj.token
    // // 登录接口和刷新token接口绕过
    // if (config.url.indexOf('/rereshToken') >= 0 || config.url.indexOf('/login') >= 0) {
    //   return config
    // }
    // if (tokenObj.token && tokenObj.tokenExpireTime) {
    //   const now = Date.now()
    //   if (now >= tokenObj.tokenExpireTime) {
    //     // 立即刷新token
    //     if (!isRefreshing) {
    //       console.log('刷新token ing')
    //       isRefreshing = true
    //       refreshToken().then(res => {
    //         const { token, tokenExprieIn } = res.data
    //         const tokenExpireTime = now + tokenExprieIn * 1000
    //         instance.setToken({ token, tokenExpireTime })
    //         isRefreshing = false
    //         return token
    //       }).then((token) => {
    //         console.log('刷新token成功，执行队列')
    //         requests.forEach(cb => cb(token))
    //         // 执行完成后，清空队列
    //         requests = []
    //       }).catch(res => {
    //         console.error('refresh token error: ', res)
    //       })
    //     }
    //     const retryOriginalRequest = new Promise((resolve) => {
    //       requests.push((token) => {
    //         // 因为config中的token是旧的，所以刷新token后要将新token传进来
    //         config.headers['X-Token'] = token
    //         resolve(config)
    //       })
    //     })
    //     return retryOriginalRequest
    //   }
    // }
    // const token = store.state.token; // TODO
    const token = `Bearer ${localStorage.getItem('token')}`;
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const sessionUser = JSON.parse(sessionStorage.getItem('user'));
    if (sessionUser && user) {
      if (sessionUser.id !== user.id) {
        window.location.reload()
      }
    }
    token && (config.headers['Authorization'] = token);
    token && (config.headers['X-TenantId'] = user.tenantId);
    token && (config.headers['X-Logined-Sign'] = user.username);
    token && (config.headers['Prefer-Lang'] = getLang());
    return config;
  },
  error => Promise.error(error)
)

// 响应拦截器
service.interceptors.response.use(
  // 请求成功
  res => res.status === 200 ? Promise.resolve(res) : Promise.reject(res),
  // 请求失败
  error => {
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围 
      errorHandle(response.status, response.data.message);
      return Promise.reject(response);
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      if (!window.navigator.onLine) {
        // store.commit('changeNetwork', false); // TODO
      } else {
        return Promise.reject(error);
      }
    }
  }
);

export default service;
