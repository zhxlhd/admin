/**
 * 物流订单--提货单服务
 * created by hezhiqiang on 2019/11/28
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import {LOGISTICS_ORDER_API} from '../apis'; // 导入当前模板和公用 API

export default {
  // 提货单 保存
  save: (data) => axios.post(`${LOGISTICS_ORDER_API.LOGISTICS_DELIVERY_ORDER_FORM_SAVE}`, data),
  // 线路修改
  update: (id,data) => axios.post(`${LOGISTICS_ORDER_API.LOGISTICS_DELIVERY_ORDER_UPDATE}/${id}`, data),
  // 获取业务实体
  getOffice: () => axios.get(`${LOGISTICS_ORDER_API.BUSINESS_ENTITY}`),
  // 提货单 删除
  deleteDeliveryOrder: (ids) => axios.delete(`${LOGISTICS_ORDER_API.DELETE_LOGISTICS_DELIVERY_ORDER}?ids=${ids}`),
  // 提货单 详情
  getdetail: (id) => axios.get(`${LOGISTICS_ORDER_API.LOGISTICS_DELIVERY_ORDER_DETAIL}?id=${id}/0`),
  // 获取物流线路
  getLogisticsLine: (id) => axios.get(`${LOGISTICS_ORDER_API.LODISTICS_LINES}/${id}`),
  // 获取物流商
  getLogisticsProvider: () => axios.get(`${LOGISTICS_ORDER_API.LOGISTICS_PROVIDER}`),
  // 获取出货仓库
  getWarehouse: (officeId) => axios.get(`${LOGISTICS_ORDER_API.DELIVERY_WAREHOUSE}/${officeId}`),
  // 获取收货公司信息
  getReceiceCompany: (data) => axios.post(`${LOGISTICS_ORDER_API.RECEIVE_COMPANY}`, data),
  // 获取销售订单出货行
  getSoDeliveryLineList: () => axios.get(`${LOGISTICS_ORDER_API.SO_DELIVERY_LINE_LIST}`),
  // 提货单列表 提交审批、审批通过、废弃
  approvalDreliveryOrder: (id,state) => axios.post(`${LOGISTICS_ORDER_API.LOGISTICS_DELIVERY_ORDER_APPROVAL}/${id}/${state}`),
  // 获取客户编码
  getCustomerCode: () => axios.get(`${LOGISTICS_ORDER_API.GET_CUSTOMER_CODE}`),
  // 获取订单编号
  getOrderNum: () => axios.get(`${LOGISTICS_ORDER_API.GET_ORDER_NUM}`),
  // 获取库存组织
  getOrgName: () => axios.get(`${LOGISTICS_ORDER_API.GET_ORG_NAME}`),
}