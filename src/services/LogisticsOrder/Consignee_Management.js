/**
 * 提货人管理服务
 * created by hezhiqiang on 2020/1/6
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import {LOGISTICS_ORDER_API} from '../apis'; // 导入当前模板和公用 API

export default {
  // 提货人列表 删除
  deleteConsigneeInfo: (ids) => axios.get(`${LOGISTICS_ORDER_API.CONSIGNEE_MANAGEMENT_LIST_DELETE}?ids=${ids}`),
  // 附件上传
  attachMentUpload: (data) => axios.post(`${LOGISTICS_ORDER_API.ATTACHMENT_UPLOAD}`,data),
  // 附件删除
  deleteAttachMent: (id) => axios.get(`${LOGISTICS_ORDER_API.ATTACHMENT_DELETE}/${id}`),
  // 查看附件列表
  getAttachMentList: (id) => axios.get(`${LOGISTICS_ORDER_API.CONSIGNEE_ATTACHMENT_LIST}/${id}`),            
  // 校验身份证号码唯一
  checkConsigneeIdCard: (idCard) => axios.get(`${LOGISTICS_ORDER_API.CHECK_CONSIGNEE_IDCARD}?idCard=${idCard}`),
  // 获取物流商备案列表
  getLogisticsRecordList: () => axios.get(`${LOGISTICS_ORDER_API.GET_LOGISTICS_RECORDS_LIST}`),
  // 生成提货人备案
  createConsigneeRecords: (data) => axios.post(`${LOGISTICS_ORDER_API.CREATE_CONSIGNEE_RECORDS}`,data),
}