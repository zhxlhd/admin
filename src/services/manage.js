// create by zhongxiaolong on 2020/05/
import axios from '@/utils/http'; // 导入http中创建的axios实例

// 添加微服务 api
const api = {
  meta: '/common/toList',  // 获取元数据
  purchase: '/purchase',
}

export default api

// post
export function postAction (url, parameter) {
  return axios({
      url: url,
      method: 'post',
      data: parameter
  })
}

// post method= {post | put}
export function httpAction (url, parameter, method) {
  return axios({
      url: url,
      method: method,
      data: parameter
  })
}

// put
export function putAction (url, parameter) {
  return axios({
      url: url,
      method: 'put',
      data: parameter
  })
}

// get
export function getAction (url, parameter) {
  return axios({
      url: url,
      method: 'get',
      params: parameter
  })
}

// deleteAction
export function deleteAction (url, parameter) {
  return axios({
      url: url,
      method: 'delete',
      params: parameter
  })
}

// 没有 id add     post
// 有 id  update  put
export function saveService (url, parameter) {
  return axios({
      url: url,
      method: parameter.id ? 'post' : 'put',
      data: parameter
  })
}
/** get meta 
 * 传参实例
 * {
 *  listName: '',
 *  listFormName: '',
 *  lineList: '',
 *  lineForm: ''
 * }
 */
export function metaAction (parameter){
  return axios({
    url: api.meta,
    method: 'get',
    params: parameter
  })
}
// id == 0 add     post
// id != 0 update  put
// export function saveService (url, parameter) {
//   return axios({
//       url: url,
//       method: parameter.id === 0 ? 'post' : 'put',
//       data: parameter
//   })
// }

/**
* 下载文件 用于excel导出
* @param url
* @param parameter
* @returns {*}
*/
export function downFile (url, parameter, method) {
  return axios({
      url: url,
      params: parameter,
      method: method || 'get',
      data: parameter,
      responseType: 'blob' // 二进制流文件，一定要设置成blob，默认是json
  })
}

/**
* 获取文件访问路径
* @param avatar
* @param imgerver
* @param str
* @returns {*}
*/
export function getFileAccessHttpUrl (avatar, imgerver, subStr) {
  if (avatar && avatar.indexOf(subStr) !== -1) {
      return avatar
  } else {
      return imgerver + '/' + avatar
  }
}
