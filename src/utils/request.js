/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import axios from 'axios';
import QS from 'qs';
import { Message } from 'element-ui';
import { getLang } from '../utils/util'
// import store from '../store/index'

// 环境的切换
if (process.env.NODE_ENV == 'development') {
  axios.defaults.baseURL = 'https://wmsapi.sunwoda.com';
} else if (process.env.NODE_ENV == 'debug') {
  axios.defaults.baseURL = 'https://wmsapi.sunwoda.com';
} else if (process.env.NODE_ENV == 'production') {
  axios.defaults.baseURL = 'https://sccp-api.dianliantech.com';
}

// 请求超时时间
axios.defaults.timeout = 30000;

// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// 请求拦截器
axios.interceptors.request.use(
  config => {
    // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    // const token = store.state.token;
    const token = `Bearer ${localStorage.getItem('token')}`;
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const sessionUser = JSON.parse(sessionStorage.getItem('user'))
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
  error => {
    return Promise.error(error);
  }
)

// 响应拦截器
axios.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是200的情况
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
          router.replace({
            path: '/login',
            query: { redirect: router.currentRoute.fullPath } 
          });
          break;
        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面
        case 403:
          Message({
            message: '登录过期，请重新登录',
            duration: 1000
          });
          // 清除token
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          // store.commit('loginSuccess', null);
          // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
          setTimeout(() => {
            router.replace({
              path: '/login',
              query: { 
                redirect: router.currentRoute.fullPath 
              }
            });
          }, 1000);
          break; 
        // 404请求不存在
        case 404:
          Message({
            message: '网络请求不存在',
            duration: 1500,
          });
          break;
        // 其他错误，直接抛出错误提示
        default:
          Message({
            message: error.response.data.message,
            duration: 1500
          });
      }
      return Promise.reject(error.response);
    }
  }
);
/** 
 * get方法，对应get请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function get(url, params){
  return new Promise((resolve, reject) =>{
    axios.get(url, {
      params: params
    })
    .then(res => {
      resolve(res.data);
    })
    .catch(err => {
      reject(err.data)
    })
  });
}
/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, QS.stringify(params))
    .then(res => {
      resolve(res.data);
    })
    .catch(err => {
      reject(err.data)
    })
  });
}