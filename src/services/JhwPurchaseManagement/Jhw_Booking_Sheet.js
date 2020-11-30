/**
 * 吉海湾采购管理-预订单服务 
 * created by fengjing on 2020/05/20
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import {JHW_PRUCHASE_MANAGEMENT_API} from '../apis'; // 导入当前模板和公用 API

export default {
  // 获取列表数据（搜索查询/分页）
  getList: (data) => axios.post(`${JHW_PRUCHASE_MANAGEMENT_API.GET_BOOKING_SHEET_LIST}`,data),
  // 获取明细行列表数据
  getDetailList: (id) => axios.get(`${JHW_PRUCHASE_MANAGEMENT_API.GET_BOOKING_SHEET_LINE}?headId=${id}`),
  // 删除
  deleteDetail: (id) => axios.delete(`${JHW_PRUCHASE_MANAGEMENT_API.DELETE_BOOKING_SHEET}?headId=${id}`),
  // 提交供应商确认
  submitToSupplier: (id) => axios.post(`${JHW_PRUCHASE_MANAGEMENT_API.SUBMIT_TO_SUPPLIER}?ids=${id}`),
  // 确认预订单
  sureBookingSheet: (id) => axios.post(`${JHW_PRUCHASE_MANAGEMENT_API.SURE_BOOKING_SHEET}?ids=${id}`),
  // 提交OA送审
  toOaAduit: (id) => axios.post(`${JHW_PRUCHASE_MANAGEMENT_API.TO_OA_ADUIT}?ids=${id}`),
  // 生成采购订单
  toPurchaseOrder: (id) => axios.post(`${JHW_PRUCHASE_MANAGEMENT_API.TO_PURCHASE_ORDER}?ids=${id}`),
  // 保存预订单
  saveBookingSheet: (data) => axios.post(`${JHW_PRUCHASE_MANAGEMENT_API.SAVE_BOOKING_SHEET}`,data),
  // 更新预订单
  update: (data) => axios.put(`${JHW_PRUCHASE_MANAGEMENT_API.UPDATE_BOOKING_SHEET}`,data),
  // 查询预订单 
  getBookingSheet: (id) => axios.get(`${JHW_PRUCHASE_MANAGEMENT_API.GET_BOOKING_SHEET}?headId=${id}`),
  // 上传附件
  uploadFile: (id) => axios.post(`${JHW_PRUCHASE_MANAGEMENT_API.GET_BOOKING_SHEET}`,data),
  // 根据交货日期获取价格
  getPrice: (data) => axios.post(`${JHW_PRUCHASE_MANAGEMENT_API.GET_PRICE_BY_DELIVERY_DATE}`,data),
}
