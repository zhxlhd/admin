/**
 * 吉海湾采购管理-采购退货&已收货单据服务 
 * created by hezhiqiang on 2020/06/15
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import {JHW_PRUCHASE_MANAGEMENT_API} from '../apis'; // 导入当前模板和公用 API

export default {
  // 获取采购退货列表数据（搜索查询/分页）
  getPurchaseReturnList: (data) => axios.post(`${JHW_PRUCHASE_MANAGEMENT_API.GET_PURCHASE_RETURN_LIST}`,data),
  // 获取明细行列表数据
  getDetailList: (data) => axios.post(`${JHW_PRUCHASE_MANAGEMENT_API.GET_PURCHASE_RETURN_LINE_LIST}`,data),
  // 获取已收货单据列表数据（搜索查询/分页）
  getReceivedOrderList: (data) => axios.post(`${JHW_PRUCHASE_MANAGEMENT_API.GET_RECEIVED_ORDER_LIST}`,data),
  // 生成退货单
  generateReturnForm: (data) => axios.post(`${JHW_PRUCHASE_MANAGEMENT_API.GENERATE_RETURN_FORM}`,data),
}
