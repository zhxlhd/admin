/**
 * 物流订单--货物追踪查询服务
 * created by hezhiqiang on 2019/12/10
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import {LOGISTICS_ORDER_API} from '../apis'; // 导入当前模板和公用 API

export default {
  // 获取明细行列表数据
  getDetailList: (id) => axios.get(`${LOGISTICS_ORDER_API.CARGO_TRACKING_DETAIL_LIST}/${id}`),
  // 改变状态
  changeStatus: (state, id, remark='') => axios.get(`${LOGISTICS_ORDER_API.CARGO_TRACKING_CHANGE_STATUS}/${state}/${id}?remark=${remark}`),
  // 明细行查看附件列表
  attachMentList: (id) => axios.get(`${LOGISTICS_ORDER_API.CARGO_TRACKING_ATTACHMENT_LIST}/${id}`),
  // 附件删除
  deleteAttachMent: (id) => axios.get(`${LOGISTICS_ORDER_API.ATTACHMENT_DELETE}/${id}`),
  // 附件上传
  attachMentUpload: (data) => axios.post(`${LOGISTICS_ORDER_API.ATTACHMENT_UPLOAD}`,data),
}