
/**
 * 智能跟单-交货单 服务
 * created by zhongxiaolong on 2020/04/14
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import { SMART_ORDER_API, BASE_API } from '../apis'; // 导入当前模板和公用 API

export default{
  // 返回列表页面
  goBack: () => axios.get(`${SMART_ORDER_API.SMART_INVOICE_MAIN_LIST}`),
  // 查询详情
  getDetail: id => axios.get(`${SMART_ORDER_API.SMART_INVOICE_DETAIL}/${id}`),
  // 列表新建 编辑
  handleUpdate: (id) => axios.get(`${SMART_ORDER_API.SMART_INVOICE_UPDATE}/${id}`),
  // 列表保存
  handleSave: (data) => axios.post(`${SMART_ORDER_API.SMART_INVOICE_SAVE}`, data),
  // 列表列表删除
  handleDelete: (id) => axios.get(`${SMART_ORDER_API.SMART_INVOICE_DELETE}?ids=${id}`),
  // 列表任务行删除
  handleDeleteLine: (id) => axios.get(`${SMART_ORDER_API.SMART_INVOICE_DELETE_LINE}?ids=${id}`),
  // 状态改变 暂停状态有原因
  handleStatus: (status, id, reason='') => axios.get(`${SMART_ORDER_API.SMART_INVOICE_STATE}/${status}?ids=${id}&rejectReason=${reason}`),
  // 编号检索：编号是否已存在
  checkCode: (id) => axios.get(`${SMART_ORDER_API.SMART_INVOICE_CHECK_CODE}/${id}`),
  // 打印
  handlePrint: (id) => axios.get(`${SMART_ORDER_API.SMART_INVOICE_PRINT}/${id}`),
}
