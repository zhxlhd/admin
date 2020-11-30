
/**
 * 受托加工-加工单录入服务 .PROCESSING_ORDER_ENTRY
 * created by zhongxiaolong on 2019/10/14
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import { BE_ENTRUST_PROCESSING_API } from '../apis'; // 导入当前模板和公用 API

export default{
  // 返回列表页面
  goBack: () => axios.get(`${BE_ENTRUST_PROCESSING_API.PROCESSING_ORDER_ENTRY_MAIN_LIST}`),
  // 查询详情
  getDetail: id => axios.get(`${BE_ENTRUST_PROCESSING_API.PROCESSING_ORDER_ENTRY_DETAIL}/${id}`),
  // 列表新建 编辑
  handleUpdate: (id) => axios.get(`${BE_ENTRUST_PROCESSING_API.PROCESSING_ORDER_ENTRY_UPDATE}/${id}`),
  // 列表保存
  handleSave: (data) => axios.post(`${BE_ENTRUST_PROCESSING_API.PROCESSING_ORDER_ENTRY_SAVE}`, data),
  // 列表列表删除
  handleDelete: (id) => axios.get(`${BE_ENTRUST_PROCESSING_API.PROCESSING_ORDER_ENTRY_DELETE}?ids=${id}`),
  // 列表任务行删除
  handleDeleteLine: (id) => axios.get(`${BE_ENTRUST_PROCESSING_API.PROCESSING_ORDER_ENTRY_DELETE_LINE}?ids=${id}`),
  // 状态改变 暂停状态有原因
  handleStatus: (status, id, reason='') => axios.get(`${BE_ENTRUST_PROCESSING_API.PROCESSING_ORDER_ENTRY_STATE}/${status}?ids=${id}&rejectReason=${reason}`),
  // 上传图片
  handleUpload: (data) => axios.post(`${BE_ENTRUST_PROCESSING_API.PROCESSING_ORDER_ENTRY_UPLOAD}`, data),
  // 编号检索：编号是否已存在
  checkCode: (id) => axios.get(`${BE_ENTRUST_PROCESSING_API.PROCESSING_ORDER_ENTRY_CHECK_CODE}/${id}`),
}
