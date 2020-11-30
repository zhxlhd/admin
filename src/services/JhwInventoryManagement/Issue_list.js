/**
 * 吉海湾库存管理-入库服务 
 * created by hezhiqang on 2020/05/15
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import {JHW_INVENTORY_MANAGEMENT_API} from '../apis'; // 导入当前模板和公用 API

export default {
  // 获取列表数据（搜索查询/分页）
  getList: (data) => axios.post(`${JHW_INVENTORY_MANAGEMENT_API.GET_ISSUE_LIST_DATA}`,data),
  // 获取明细行列表数据
  getDetailList: (id) => axios.post(`${JHW_INVENTORY_MANAGEMENT_API.GET_ISSUE_LINE_LIST_DATA}?id=${id}`),
  // 表单 新增/修改保存
  save: (data) => axios.post(`${JHW_INVENTORY_MANAGEMENT_API.ISSUE_FORM_SAVE}`, data),
  // 列表 送审按钮
  sendApproval: (id) => axios.get(`${JHW_INVENTORY_MANAGEMENT_API.SEND_APPROVAL}?id=${id}`),
  // 通过商品编码提供加权平均单价
  getArerageCost: (code) => axios.get(`${JHW_INVENTORY_MANAGEMENT_API.GET_AVERAGE_COST}?code=${code}`),
  // 维护收货确认列表数据
  updateListLine: (data) => axios.post(`${JHW_INVENTORY_MANAGEMENT_API.UPDATE_LIST_LINE}`, data),
  // 批量出库
  batchOutbound: (data) => axios.post(`${JHW_INVENTORY_MANAGEMENT_API.BATCH_OUTBOUND}`, data),
}
