/**
 * 物流订单--司机信息维护服务
 * created by hezhiqiang on 2019/11/28
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import {LOGISTICS_ORDER_API} from '../apis'; // 导入当前模板和公用 API

export default {
  // 获取明细行列表数据
  getDetailList: (id) => axios.get(`${LOGISTICS_ORDER_API.DRIVER_INFO_DETAIL_LIST}/${id}`),
  // 判断司机信息是否已存在
  checkDriverInfo: (id) => axios.get(`${LOGISTICS_ORDER_API.CHECK_DRIVER_INFO}/${id}`),
  // 司机资料 新增/修改保存
  save: (data) => axios.post(`${LOGISTICS_ORDER_API.DRIVER_INFO_FORM_SAVE}`, data),
  // 查看司机资料信息
  getDriverInfoDetail: (id) => axios.get(`${LOGISTICS_ORDER_API.DRIVER_INFO_DETAIL}/${id}`),
  // 删除司机资料信息
  driverInfoDriverInfoDelete: (id) => axios.get(`${LOGISTICS_ORDER_API.DELETE_DRIVER_INFO}/${id}`),
  // 附件上传
  driverInfoAttachMentUpload: (data) => axios.post(`${LOGISTICS_ORDER_API.ATTACHMENT_UPLOAD}`,data),
  // 附件删除
  deleteAttachMent: (id) => axios.get(`${LOGISTICS_ORDER_API.ATTACHMENT_DELETE}/${id}`),
  // 司机资料附件列表
  getDriverInfoAttachMentList: (id) => axios.get(`${LOGISTICS_ORDER_API.DRIVER_INFO_ATTACHMENT_LIST}/${id}`),
  // 司机资料 审批
  approvalDriverInfo: (id,state) => axios.get(`${LOGISTICS_ORDER_API.DRIVER_INFO_APPROVAL}/${id}/${state}`),
  // 获取大陆车牌
  getPlateNumber: (id) => axios.get(`${LOGISTICS_ORDER_API.PLATE_NUMBER}/${id}`),
  // 获取司机姓名
  getDriverName: (id) => axios.get(`${LOGISTICS_ORDER_API.DRIVER_NAME}/${id}`),
}