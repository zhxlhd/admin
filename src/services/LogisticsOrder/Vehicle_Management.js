/**
 * 提货人管理服务
 * created by hezhiqiang on 2020/1/6
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import {LOGISTICS_ORDER_API} from '../apis'; // 导入当前模板和公用 API

export default {
  // 提货人列表 删除
  deleteVehicleInfo: (ids) => axios.get(`${LOGISTICS_ORDER_API.VEHICLE_MANAGEMENT_LIST_DELETE}?ids=${ids}`),
  // 附件上传
  attachMentUpload: (data) => axios.post(`${LOGISTICS_ORDER_API.ATTACHMENT_UPLOAD}`,data),
  // 附件删除
  deleteAttachMent: (id) => axios.get(`${LOGISTICS_ORDER_API.ATTACHMENT_DELETE}/${id}`),
  // 查看附件列表
  getAttachMentList: (id) => axios.get(`${LOGISTICS_ORDER_API.VEHICLE_ATTACHMENT_LIST}/${id}`),
  // 校验大陆车牌唯一
  checkVehicleCarPlates: (caCarNum) => axios.get(`${LOGISTICS_ORDER_API.CHECK_VEHICLE_CARPLATES}?caCarNum=${caCarNum}`),
  // 生成车辆备案
  createVehicleRecords: (data) => axios.post(`${LOGISTICS_ORDER_API.CREATE_VEHICLE_RECORDS}`,data),
}