/**
 * 吉海湾销售管理-销售订单服务 
 * created by hezhiqang on 2020/05/18
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import {JHW_SALES_MANAGEMENT_API} from '../apis'; // 导入当前模板和公用 API

export default {
  // 获取列表数据（搜索查询/分页）
  getList: (data) => axios.post(`${JHW_SALES_MANAGEMENT_API.GET_LIST_DATA}`,data),
  // 获取明细行列表数据
  getDetailList: (data) => axios.post(`${JHW_SALES_MANAGEMENT_API.GET_LINE_LIST_DATA}`,data),
  // 发货按钮
  deliverGoods: (data) => axios.post(`${JHW_SALES_MANAGEMENT_API.DELIVER_GOODS}`,data), 
  // 表单 新增/修改保存
  save: (data) => axios.post(`${JHW_SALES_MANAGEMENT_API.SALES_FORM_SAVE}`, data),
  // 列表删除
  deleteDetail: (id) => axios.post(`${JHW_SALES_MANAGEMENT_API.SALES_LIST_DELETE}?id=${id}`),
  // 列表编辑
  getSalesData: (id) => axios.post(`${JHW_SALES_MANAGEMENT_API.GET_HEAD_AND_LINE_DATA}?id=${id}`),
  // 获取发货列表数据（搜索查询/分页）
  getDeliverGoodList: (data) => axios.post(`${JHW_SALES_MANAGEMENT_API.GET_DELIVER_GOOD_LIST}`,data),
  // 维护发货列表数据
  updateListLine: (data) => axios.post(`${JHW_SALES_MANAGEMENT_API.UPDATE_LIST_LINE}`, data),
  // 生成供应商采购订单
  generateOrder: (id) => axios.get(`${JHW_SALES_MANAGEMENT_API.GENERATE_SUPPLIER_PURCHASE_ORDER}?id=${id}`),
  // 供应商采购订单 保存
  saveOrder: (data) => axios.post(`${JHW_SALES_MANAGEMENT_API.SAVE_SUPPLIER_PURCHASE_ORDER}`, data),
}
