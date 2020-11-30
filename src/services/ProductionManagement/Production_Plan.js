
/**
 * 生产管理-产成品入库服务 .PRODUCTION_PLAN
 * created by zhongxiaolong on 2019/11/20
 */
import axios from '@/utils/http';                    // 导入http中创建的axios实例
import { PRODUCTION_MANAGEMENT_API } from '../apis'; // 导入当前模板和公用 API

export default{
  // 返回列表页面
  goBack: () => axios.get(`${PRODUCTION_MANAGEMENT_API.PRODUCTION_PLAN_MAIN_LIST}`),
  // 查询详情
  getDetail: id => axios.get(`${PRODUCTION_MANAGEMENT_API.PRODUCTION_PLAN_DETAIL}/${id}`),
  // 列表新建 编辑
  handleUpdate: (id) => axios.get(`${PRODUCTION_MANAGEMENT_API.PRODUCTION_PLAN_UPDATE}/${id}`),
  // 列表保存
  handleSave: (data) => axios.post(`${PRODUCTION_MANAGEMENT_API.PRODUCTION_PLAN_SAVE}`, data),
  // 列表列表删除
  handleDelete: (id) => axios.get(`${PRODUCTION_MANAGEMENT_API.PRODUCTION_PLAN_DELETE}?ids=${id}`),
  // 列表任务行删除
  handleDeleteLine: (id) => axios.get(`${PRODUCTION_MANAGEMENT_API.PRODUCTION_PLAN_DELETE_LINE}?ids=${id}`),
  // 状态改变
  handleStatus: (status, id, reason='') => axios.get(`${PRODUCTION_MANAGEMENT_API.PRODUCTION_PLAN_STATE}/${status}?ids=${id}&rejectReason=${reason}`),
  // 编号检索：编号是否已存在
  checkCode: (id) => axios.get(`${PRODUCTION_MANAGEMENT_API.PRODUCTION_PLAN_CHECK_CODE}/${id}`),
}
