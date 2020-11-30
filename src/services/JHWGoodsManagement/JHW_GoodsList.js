/**
 * 吉海湾商品列表 .JHW_GoodsList
 * created by fengjing 20200515
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import {JHW_GOODS_MANAGEMENT_API} from '../apis'; // 导入当前模板和公用 API
export default {
    // 获取列表数据
    getListData: (data) => axios.post(`${JHW_GOODS_MANAGEMENT_API.GET_GOODS_LIST_DATA}`,data),
    // 返回列表页面
    getList: (data) => axios.post(`${JHW_GOODS_MANAGEMENT_API.OUTSOURCING_PROCESSING_ORDER_MAIN_LIST}`,data),
    // 获取商品信息
    getDetail: id => axios.get(`${JHW_GOODS_MANAGEMENT_API.GET_GOODS_DATA}?id=${id}`),
    // 列表新建 编辑
    handleUpdate: (id) => axios.get(`${JHW_GOODS_MANAGEMENT_API.OUTSOURCING_PROCESSING_ORDER_UPDATE}/${id}`),
    // 列表保存
    handleSave: (data) => axios.post(`${BE_ENTRUST_PROCESSING_API.OUTSOURCING_PROCESSING_ORDER_SAVE}`, data),
    // 列表列表删除
    handleDelete: (id) => axios.get(`${BE_ENTRUST_PROCESSING_API.OUTSOURCING_PROCESSING_ORDER_DELETE}?ids=${id}`),
  }