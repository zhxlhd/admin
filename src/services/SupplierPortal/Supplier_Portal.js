/**
 * 电镀门户 服务
 * created by hezhiqiang on 2020/04/27
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import {SUPPLIER_PORTAL_API} from '../apis'; // 导入当前模板和公用 API

export default {
  // 获取客户名称
  getCustomerName: () => axios.get(`${SUPPLIER_PORTAL_API.GET_CUSTOMER_NAME}`),
}