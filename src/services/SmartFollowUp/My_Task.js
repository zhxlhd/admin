
/**
 * 智能跟单-我的任务 服务
 * created by zhongxiaolong on 2019/08/19
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import { SMART_ORDER_API, BASE_API } from '../apis'; // 导入当前模板和公用 API

export default{
  // 返回列表页面
  goBack: () => axios.get(`${SMART_ORDER_API.MYTASK_QUERY}`),
  // 查询详情
  getDetail: id => axios.get(`${SMART_ORDER_API.MYTASK_DETAIL}/${id}`),
  // 获取 获取行物料编码 传type
  getMaterialsCode: (id, type) => axios.get(`${BASE_API.MATERIALS_CODE}/${id}?${type}`),
  // ecn 查询、分页
  queryData: (data) => axios.post(`${SMART_ORDER_API.MYTASK_QUERY}`, data),
  // 完成任务节点 flag: 是否是外发订单
  finishTask: (id, flag) => axios.get(`${SMART_ORDER_API.MYTASK_FINISH}/${id}?outwardFlag=${flag}`),
  // 取消任务节点
  cancelTask: (id) => axios.get(`${SMART_ORDER_API.MYTASK_CANCEL}/${id}`),
  // 退回任务节点
  returnedTask: (taskId, backTaskId) => axios.get(`${SMART_ORDER_API.MYTASK_RETURNED}?taskId=${taskId}&backTaskId=${backTaskId}`),
  // 完成并跳转任务节点 flag: 是否是外发订单
  jumpToTask: (taskId, skipTaskId, flag) => axios.get(`${SMART_ORDER_API.MYTASK_FINISH_AN_JUMP}?taskId=${taskId}&skipTaskId=${skipTaskId}&outwardFlag=${flag}`),
  // 退回任务列表
  getTaskList: (id) => axios.get(`${SMART_ORDER_API.MYTASK_TASK_NODE_LIST}/${id}`),
  // 查看进度
  checkProgress: (id) => axios.get(`${SMART_ORDER_API.CHECK_PROGRESS}/${id}`),
  // 删除进度
  deleteProgress: (id) => axios.get(`${SMART_ORDER_API.DELETE_PROGRESS}?ids=${id}`),
  // 新增进度
  addProgress: (data) => axios.post(`${SMART_ORDER_API.ADD_PROGRESS}`,data),
  // 获取附件列表
  getAttachMentList: (id) => axios.get(`${SMART_ORDER_API.GET_ATTACHMNENT_LIST}/${id}`),
  // 上传附件
  uploadAttachMent: (data) => axios.post(`${SMART_ORDER_API.UPLOADATTACHMENT}`,data),
  // 删除附件
  deleteAttachMent: (id) => axios.get(`${SMART_ORDER_API.DELETEATTACHMENT}/${id}`),
}
