/**
 * 基础数据-汇率管理 
 * created by hezhiqiang on 2020/02/26
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import { BASIC_DATA_API } from '../apis'; // 导入当前模板和公用 API

export default{
  // 返回列表页面
  goBack: () => axios.get(`${BASIC_DATA_API.EXCHANGE_RATE_LIST}`),
  // 列表保存
  handleSave: (data) => axios.post(`${BASIC_DATA_API.EXCHANGE_RATE_SAVE}`, data),
  // 汇率列表删除
  handleDelete: (id) => axios.get(`${BASIC_DATA_API.EXCHANGE_RATE_DELETE}?ids=${id}`),
  // 获取币种
  getCurrencyData: () => axios.get(`${BASIC_DATA_API.GET_CURRENCY_DATA}`),
  // 获取外币
  getForeignCurrency: (symbol) => axios.get(`${BASIC_DATA_API.GET_FOREIGN_CURRENCY_DATA}?symbol=${symbol}`),
  // 销售订单分类 删除
  orderDelete:(id) => axios.get(`${BASIC_DATA_API.SALE_ORDER_CATEGORY_DELETE}/${id}`),
 }