/**
 * 销售管理-销售订单服务
 * created by hezhiqiang 2020/03/06
 */
import axios from '@/utils/http';                    // 导入http中创建的axios实例
import { SALE_MANAGE_API } from '../apis';           // 导入当前模板和公用 API

export default {
  // 附件上传
  attachMentUpload: (data) => axios.post(`${SALE_MANAGE_API.ATTACHMENT_UPLOAD}`,data),
  // 附件删除
  deleteAttachMent: (id) => axios.get(`${SALE_MANAGE_API.ATTACHMENT_DELETE}/${id}`),
  // 查看附件列表
  getAttachMentList: (id) => axios.get(`${SALE_MANAGE_API.SALE_ORDER_ATTACHMENT_LIST}/${id}`),
}