
/**
 * 智能跟单-跟单列表 服务
 * created by zhongxiaolong on 2019/08/19
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import { SMART_ORDER_API, BASE_API } from '../apis'; // 导入当前模板和公用 API

export default{
  // 返回列表页面
  goBack: () => axios.get(`${SMART_ORDER_API.DOCUMENTDARYLIST_QUERY}`),
  // 查询详情
  getDetail: id => axios.get(`${SMART_ORDER_API.DOCUMENTDARYLIST_DETAIL}/${id}`),
  // 跟单列表新建 编辑
  upDate: (id) => axios.get(`${SMART_ORDER_API.DOCUMENTDARYLIST_EDIT}/${id}`),
  // 跟单列表保存
  save: (data) => axios.post(`${SMART_ORDER_API.DOCUMENTDARYLIST_SAVE}`, data),
  // 跟单列表列表删除
  deleteOrder: (id) => axios.get(`${SMART_ORDER_API.DOCUMENTDARYLIST_DELETE}?ids=${id}`),
  // 跟单列表任务行删除
  deleteLine: (id) => axios.get(`${SMART_ORDER_API.DOCUMENTDARYLIST_DELETE_LINE}?ids=${id}`),
  // 状态改变 暂停状态有原因
  stateChange: (state, id, reason='') => axios.get(`${SMART_ORDER_API.DOCUMENTDARYLIST_STATE}/${state}?ids=${id}&rejectReason=${reason}`),
  // 查询、分页
  queryData: (data) => axios.post(`${SMART_ORDER_API.DOCUMENTDARYLIST_QUERY}`, data),
  // 订单编号检索
  retrieveSoNum: (val) => axios.get(`${SMART_ORDER_API.SONUM_RETRIEVE}/${val}`),
  // 物料编码检索
  getMaterialsInfo: (val) => axios.get(`${BASE_API.MATERIALS_INFO_RETRIEVE}/${val}`),
  // 导入模板
  importLine: (data) => axios.post(`${SMART_ORDER_API.DOCUMENTDARYLIST_IMPORT_LINE}`, data),
  // 导出为模板
  exportLine: (data) => axios.post(`${SMART_ORDER_API.DOCUMENTDARYLIST_EXPORT_LINE}`, data),
}
