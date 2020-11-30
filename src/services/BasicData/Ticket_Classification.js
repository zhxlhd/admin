
/**
 * 受托加工-交货单服务 .TICKET_CLASSIFICATION
 * created by zhongxiaolong on 2019/10/14
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import { BASIC_DATA_API } from '../apis'; // 导入当前模板和公用 API

export default{
  // 返回列表页面
  goBack: () => axios.get(`${BASIC_DATA_API.TICKET_CLASSIFICATION_MAIN_LIST}`),
  // 查询详情
  getDetail: id => axios.get(`${BASIC_DATA_API.TICKET_CLASSIFICATION_DETAIL}/${id}`),
  // 列表新建 编辑
  handleUpdate: (id) => axios.get(`${BASIC_DATA_API.TICKET_CLASSIFICATION_UPDATE}/${id}`),
  // 列表保存
  handleSave: (data) => axios.post(`${BASIC_DATA_API.TICKET_CLASSIFICATION_SAVE}`, data),
  // 列表列表删除
  handleDelete: (id) => axios.get(`${BASIC_DATA_API.TICKET_CLASSIFICATION_DELETE}?ids=${id}`),
  // 状态改变 失效/启用
  handleStatus: (state, id) => axios.get(`${BASIC_DATA_API.TICKET_CLASSIFICATION_STATE}/${state}?ids=${id}`),
  
 }
