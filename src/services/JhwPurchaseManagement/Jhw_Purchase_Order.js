/**
 * 吉海湾采购管理-采购订单服务 
 * created by fengjing on 2020/05/20
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import {JHW_PRUCHASE_MANAGEMENT_API} from '../apis'; // 导入当前模板和公用 API

export default {
  // 获取列表数据（搜索查询/分页）
  getList: (data) => axios.post(`${JHW_PRUCHASE_MANAGEMENT_API.GET_PURCHASE_ORDER_LIST}`,data),
  // 获取明细行列表数据
  getDetailList: (id) => axios.get(`${JHW_PRUCHASE_MANAGEMENT_API.GET_PURCHASE_ORDER_LINE}?headId=${id}`),
  // 删除
  deleteDetail: (id) => axios.delete(`${JHW_PRUCHASE_MANAGEMENT_API.DELETE_PURCHASE_ORDER}?headId=${id}`),
  // 发送OA审批
  toOaAduitOrder: (id) => axios.get(`${JHW_PRUCHASE_MANAGEMENT_API.TO_OA_ADUIT_ORDER}?ids=${id}`), 
  // 查询采购订单
  getPurchaseOrder: (id) => axios.get(`${JHW_PRUCHASE_MANAGEMENT_API.GET_PURCHASE_ORDER}?headId=${id}`), 
  // 表单 新增/修改保存
  save: (data) => axios.post(`${JHW_PRUCHASE_MANAGEMENT_API.SAVE_PURCHASE_ORDER}`, data),
  // 更新
  update: (data) => axios.put(`${JHW_PRUCHASE_MANAGEMENT_API.UPDATE_PURCHASE_ORDER}`, data),
  // 获取收获地址
  getAddress: (data) => axios.post(`${JHW_PRUCHASE_MANAGEMENT_API.GET_ADDRESS}`,data),
  // 获取商品信息
  getPurchaseGoods: (name) => axios.get(`${JHW_PRUCHASE_MANAGEMENT_API.GET_SUPPLIER_GOODS}?supplierName=${name}`), 
  // 提交按钮
  getSubmit: (data) => axios.post(`${JHW_PRUCHASE_MANAGEMENT_API.SUBMIT_PURCHASE_ORDER}`,data),
  // 校验是否允许提交
  checkIsAllow: (data) => axios.post(`${JHW_PRUCHASE_MANAGEMENT_API.CHECK_IS_ALLOW_SUBMIT}`,data),
}
