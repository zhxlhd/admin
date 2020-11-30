/**
 * 吉海湾库存管理-入库服务 
 * created by hezhiqang on 2020/05/15
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import {JHW_INVENTORY_MANAGEMENT_API} from '../apis'; // 导入当前模板和公用 API

export default {
  // 获取列表数据
  getList: (data) => axios.post(`${JHW_INVENTORY_MANAGEMENT_API.GET_STOCK_LIST_DATA}`,data),
  // 获取明细行列表数据
  getDetailList: (id) => axios.post(`${JHW_INVENTORY_MANAGEMENT_API.GET_STOCK_LINE_LIST_DATA}?id=${id}`),
  // 表单 新增/修改保存
  save: (data) => axios.post(`${JHW_INVENTORY_MANAGEMENT_API.STOCK_FORM_SAVE}`, data),
  // 收货确认列表数据
  getPreservationList:(data) => axios.post(`${JHW_INVENTORY_MANAGEMENT_API.RECEIPT_CONFIRMATION_LIST}`, data),
  // 收货确认
  preservation:(data) => axios.post(`${JHW_INVENTORY_MANAGEMENT_API.PRESERVATION}`, data),
  // 获取客户对应仓库
  getWarehouse:(data) => axios.post(`${JHW_INVENTORY_MANAGEMENT_API.GET_WAREHOUSE_DATA}`, data),
  // 收货确认自采列表数据
  getListData:(data) => axios.post(`${JHW_INVENTORY_MANAGEMENT_API.SINCE_RECEIPT_CONFIRMATION_LIST}`, data),
  // 收货确认（自采）
  sincePreservation:(data) => axios.post(`${JHW_INVENTORY_MANAGEMENT_API.SINCE_PRESERVATION}`, data),
}
