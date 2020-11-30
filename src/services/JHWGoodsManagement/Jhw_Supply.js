/**
 * 吉海湾商品管理：供货列表服务
 * created by hezhiqiang on 2020/06/20
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import {JHW_GOODS_MANAGEMENT_API} from '../apis'; // 导入当前模板和公用 API
export default {
    // 获取列表数据
    getList: (data) => axios.post(`${JHW_GOODS_MANAGEMENT_API.GET_SUPPLY_LIST}`,data),
    // 通过供应商查询商品数据
    getGoods: (data) => axios.post(`${JHW_GOODS_MANAGEMENT_API.GET_GOODS_BY_SUPPLISRNAME}`,data),
    // 获取商品信息
    batchAdd: (data) => axios.post(`${JHW_GOODS_MANAGEMENT_API.BATCH_ADD_GOODS}`,data),
    // 列表新增-保存
    addSave: (data) => axios.post(`${JHW_GOODS_MANAGEMENT_API.SAVE_ADD_SUPPLY}`,data),
    // 列表修改-保存
    updateSave: (data) => axios.post(`${JHW_GOODS_MANAGEMENT_API.SAVE_UPDATE_SUPPLY}`,data),
    // 列表删除
    deleteDetail: (id) => axios.get(`${JHW_GOODS_MANAGEMENT_API.SUPPLY_LIST_DELETE}?ids=${id}`),
    // 获取商品分类
    getGoodsCategory: (data) => axios.post(`${JHW_GOODS_MANAGEMENT_API.GET_GOODS_CATEGORY}`,data),
    // 获取客户仓库
    getWarehouse: () => axios.get(`${JHW_GOODS_MANAGEMENT_API.GET_CUSTOMER_WAREHOUSE}`),
  }