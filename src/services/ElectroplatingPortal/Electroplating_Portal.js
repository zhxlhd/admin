/**
 * 电镀门户 服务
 * created by yxj on 2020/04/15
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import {ELECTROPLATING_PORTAL_API} from '../apis'; // 导入当前模板和公用 API

export default {
  // 获取当前登录人租户信息
  getTenantInfo: () => axios.get(`${ELECTROPLATING_PORTAL_API.TENANT_INFO}`),

  // 获取园区/片区下拉
  getParkList: () => axios.get(`${ELECTROPLATING_PORTAL_API.PARK_LIST}`),

  // 修改征信评级
  updateRate: (id,creaditRating) => axios.get(`${ELECTROPLATING_PORTAL_API.UPDATE_CREDIT_RATE}/${id}?creditRating=${creaditRating}`),

  // 获取当前登录用户公司信息
  getCurUserInfo: () => axios.get(`${ELECTROPLATING_PORTAL_API.PERFECT_INFO}`),
}
