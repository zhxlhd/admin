/**
 * 物流订单--实报实销服务
 * created by hezhiqiang on 2019/12/12
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import {LOGISTICS_ORDER_API} from '../apis'; // 导入当前模板和公用 API

export default {
  // 获取明细行列表数据
  getDetailList: (id) => axios.get(`${LOGISTICS_ORDER_API.COMPLETE_REIMBURSEMENT_DETAIL_LIST}/${id}`),
  // 列表 删除
  delete: (ids) => axios.delete(`${LOGISTICS_ORDER_API.COMPLETE_REIMBURSEMENT_LIST_DELETE}?ids=${ids}`),
  // 实报实销表单 新增/修改保存
  save: (data) => axios.post(`${LOGISTICS_ORDER_API.COMPLETE_REIMBURSEMENT_FORM_SUBMIT}`, data),
  // 附件上传
  uploadAttachMent: (data) => axios.post(`${LOGISTICS_ORDER_API.ATTACHMENT_UPLOAD}`,data),
  // 附件删除
  deleteAttachMent: (id) => axios.get(`${LOGISTICS_ORDER_API.ATTACHMENT_DELETE}/${id}`),
  // 实报实销费用附加列表
  getCompleteReimbursementAttachMentList: (id) => axios.get(`${LOGISTICS_ORDER_API.COMPLETE_REIMBURSEMENT_ATTACHMENT_LIST}/${id}`),
  // 审批船务费用
  approvalReimbursementShipping: (id) => axios.get(`${LOGISTICS_ORDER_API.REIMBURSEMENT_SHIPPING_APPROVAL}/${id}`),
  // 审批物流费用
  approvalReimbursementLogistics: (id) => axios.get(`${LOGISTICS_ORDER_API.REIMBURSEMENT_LOGISTICS_APPROVAL}/${id}`),
  // 查看物流费用详请
  checkLogisticsFeesDetail: (id) => axios.get(`${LOGISTICS_ORDER_API.LOGISTICS_FEES_DETAIL}/${id}`),
  // 判断实报实销是否已存在
  checkCompleteReimbursement: (id) => axios.get(`${LOGISTICS_ORDER_API.CHECK_REIMBURSEMENT_LOGISTICS}/${id}`),
}