/**
 * 吉海湾商品编码对照 .JHW_Goods_Contrast
 * created by fengjing 20200516
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import {JHW_GOODS_MANAGEMENT_API} from '../apis'; // 导入当前模板和公用 API
export default {
    // 返回列表页面
    getList: (data) => axios.post(`${JHW_GOODS_MANAGEMENT_API.OUTSOURCING_PROCESSING_ORDER_MAIN_LIST}`,data),
    // 列表保存 商品编码对照
    handleSave: (data) => axios.post(`${JHW_GOODS_MANAGEMENT_API.SAVE_GOODS_CONTRAST}`, data),
    // 更新 
    handleUpdate: (data) => axios.put(`${JHW_GOODS_MANAGEMENT_API.UPDATE_GOODS_CONTRAST}`, data),
    // 校验
    handleCheckout: (data) => axios.post(`${JHW_GOODS_MANAGEMENT_API.CHECKOUT_GOODS_CONTRAST}`, data),
 }