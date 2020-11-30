/**
 * 采购管理-采购订单服务
 * created by hezhiqiang 2020/03/10
 */
import axios from '@/utils/http';                    // 导入http中创建的axios实例
import { PURCHASING_MANAGEMENT_API } from '../apis';           // 导入当前模板和公用 API

export default {
  // 附件上传
  attachMentUpload: (data) => axios.post(`${PURCHASING_MANAGEMENT_API.ATTACHMENT_UPLOAD}`,data),
  // 附件删除
  deleteAttachMent: (id) => axios.get(`${PURCHASING_MANAGEMENT_API.ATTACHMENT_DELETE}/${id}`),
  // 查看附件列表
  getAttachMentList: (id) => axios.get(`${PURCHASING_MANAGEMENT_API.PURCHASE_ORDER_ATTACHMENT_LIST}/${id}`),
}