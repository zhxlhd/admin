
import axios from '@/utils/http'; // 导入http中创建的axios实例
import { ECN_API, BASE_API } from '../apis';

export default{
  // 返回Ecn列表页面
  goBack: () => axios.get(`${ECN_API.ECN_LIST}`),
  // 查询Ecn详情
  getEcnDetail: id => axios.get(`${ECN_API.ECN_DETAIL}/${id}`),
  // 获取bom列表
  getBomList: id => axios.get(`${ECN_API.GET_BOM_LIST}/${id}`),
  // 获取 bom 的行列表 传 id
  getBomSubLineList: id => axios.get(`${ECN_API.GET_BOM_LINE_LIST}/${id}`),
  // 获取 获取行物料编码 传type
  getMaterialsCode: (id, type) => axios.get(`${BASE_API.MATERIALS_CODE}/${id}?${type}`),
  // Ecn 新建 编辑
  upDateEcn: (id) => axios.get(`${ECN_API.ECN_EDIT}/${id}`),
  // Ecn 保存
  saveEcn: (data) => axios.post(`${ECN_API.ECN_SAVE}`, data),
  // Ecn 列表删除
  deleteEcn: (id) => axios.get(`${ECN_API.ECN_DELETE}?ids=${id}`),
  // Ecn 行删除
  deleteEcnLine: (id) => axios.get(`${ECN_API.ECN_DELETE_LINE}?ids=${id}`),
  // ecn审批状态  提交审批 审批 驳回 实施 拼 status：SUBMIT/PASS/REJECT, 传参{ecnIds：[],rejectReason:''} 驳回有 rejectReason
  stateChange: (state, id, reason='') => axios.get(`${ECN_API.ECN_STATE}/${state}?ids=${id}&rejectReason=${reason}`),
  // ecn 查询、分页
  searchEcn: (data) => axios.post(`${ECN_API.ECN_QUERY}`, data),
  // ecn新增 版本查询
  checkEcnVersion: (id, ver) => axios.get(`${ECN_API.CHECK_ECN_VERSION}?materialsCode=${id}&version=${ver}`),
}
