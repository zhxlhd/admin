
/**
 * 受托加工-退货单服务 .RETURN_ORDER
 * created by zhongxiaolong on 2019/10/14
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import { BE_ENTRUST_PROCESSING_API } from '../apis'; // 导入当前模板和公用 API

export default{
  // 返回列表页面
  goBack: () => axios.get(`${BE_ENTRUST_PROCESSING_API.RETURN_ORDER_MAIN_LIST}`),
  // 查询详情
  getDetail: id => axios.get(`${BE_ENTRUST_PROCESSING_API.RETURN_ORDER_DETAIL}/${id}`),
  // 列表新建 编辑
  handleUpdate: (id) => axios.get(`${BE_ENTRUST_PROCESSING_API.RETURN_ORDER_UPDATE}/${id}`),
  // 列表保存
  handleSave: (data) => axios.post(`${BE_ENTRUST_PROCESSING_API.RETURN_ORDER_SAVE}`, data),
  // 列表列表删除
  handleDelete: (id) => axios.get(`${BE_ENTRUST_PROCESSING_API.RETURN_ORDER_DELETE}?ids=${id}`),
  // 编号检索：编号是否已存在
  checkCode: (id) => axios.get(`${BE_ENTRUST_PROCESSING_API.RETURN_ORDER_CHECK_CODE}/${id}`),
 }
