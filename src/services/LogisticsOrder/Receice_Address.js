/**
 * 客户收货地址服务
 * created by hezhiqiang on 2019/12/23
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import {LOGISTICS_ORDER_API} from '../apis'; // 导入当前模板和公用 API

export default {
  // 获取业务实体
  getOfficeName: () => axios.get(`${LOGISTICS_ORDER_API.OFFICE_NAME}`),
  // 获取客户名称
  getCustomerName: () => axios.get(`${LOGISTICS_ORDER_API.CUSTOMER_NAME}`),
  // 客户收货地址提交/修改 保存
  save: (data) => axios.post(`${LOGISTICS_ORDER_API.CUSTOMER_RECEICE_ADDRESS_SAVE}`, data),
  // 客户收货地址（列表界面） 删除
  delete: (ids) => axios.get(`${LOGISTICS_ORDER_API.CUSTOMER_RECEICE_ADDRESS_LIST_DELETE}?ids=${ids}`),
  // 客户收货地址（列表界面） 查看
  detail: (id, isEdit) => axios.get(`${LOGISTICS_ORDER_API.CUSTOMER_RECEICE_DETAIL}?id=${id}&isEdit=${isEdit}`)
}