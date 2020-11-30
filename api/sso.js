import Vue from 'vue'
import { REPORT_SERVER_URL } from './env'
export const ajax = function (type, url, method, params) {
  params = Object.assign(params, {
    method: method,
    timeout: 5000,
    timestamp: +new Date()
  })

  return Vue.http[type](url, params).then(response => {
    return response.body
  }, response => {
  })
}

/**
 * 报表系统跨域登录
 */
export const ssoReportLogin = function (username, password) {
  // JSONP SSO to Report Server
  const options = {
    params: {
      'op': 'fs_load',
      'cmd': 'sso',
      'fr_username': username,
      'fr_password': password,
      'fr_remember': true,
      timeout: 5000
      // jsonp: 'callback'
    }
  }
  Vue.http.jsonp(`${REPORT_SERVER_URL}/report/ReportServer`, options).then(response => {
    const status = response.body.status
    if (status === 'success') {
      // console.log('sso Report Server login successful!', response)
    } else {
      // console.log('sso Report Server login username or password invaild...', response)
    }
  }, error => {
    // console.log('sso Report Server error.', error)
  })
}

/**
 * 报表系统跨域退出
 */
export const ssoReportLogout = function () {
      // JSONP SSO to Report Server
  const options = {
    params: {
      'op': 'fs_load',
      'cmd': 'ssout',
      timeout: 5000
    }
  }
  Vue.http.jsonp(`${REPORT_SERVER_URL}/report/ReportServer`, options).then(response => {
    const status = response.body.status
    if (status === 'logout') {
     // console.log('sso Report Server logout!', response)
    } else {
      // console.log('sso Report Server not logout!', response)
    }
  }, error => {
    // console.log('sso Report Server logout error!', error)
  })
}
