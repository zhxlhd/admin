/**
 * 吉海湾商品定价 .JHW_Goods_Price
 * created by fengjing 20200516
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import {JHW_GOODS_MANAGEMENT_API} from '../apis'; // 导入当前模板和公用 API
export default {
    // 返回列表页面
    getList: (data) => axios.post(`${JHW_GOODS_MANAGEMENT_API.OUTSOURCING_PROCESSING_ORDER_MAIN_LIST}`,data),
    // 获取当前用户公司新
    getOwnCompanyIfno: (id) => axios.get(`${JHW_GOODS_MANAGEMENT_API.GET_OWN_COMPANYINFO}`),
    // 列表保存 商品定价
    handleSave: (data) => axios.post(`${JHW_GOODS_MANAGEMENT_API.SAVE_GOODS_PRICE}`, data),
    // 商品报价
    handleOfferSave:  (data) => axios.post(`${JHW_GOODS_MANAGEMENT_API.SAVE_GOODS_OFFER}`, data),
    // 根据商品分类id 获取已定价的商品名
    getIsPriceGood: (id) => axios.get(`${JHW_GOODS_MANAGEMENT_API.GET_ISPRICE_GOOD}?ids=${id}`),
    // 根据商品id 获取历史定价
    getPriceGood: (id) => axios.get(`${JHW_GOODS_MANAGEMENT_API.GET_PRICE_GOOD}?productId=${id}`),
    // 列表列表删除
    handleDelete: (id) => axios.get(`${BE_ENTRUST_PROCESSING_API.OUTSOURCING_PROCESSING_ORDER_DELETE}?ids=${id}`),
    // 在线选购获取商品列表
    getOnline: (data) => axios.post(`${JHW_GOODS_MANAGEMENT_API.GET_ONLINE}`,data),
    // 获取商品信息
    getGoodDetail: (id) => axios.get(`${JHW_GOODS_MANAGEMENT_API.GET_GOODS_DETAIL}?productId=${id}`),
    // 搜索
    searchGood: (data) => axios.get(`${JHW_GOODS_MANAGEMENT_API.SEARCH_GOODS}?id=${id}`),
    // 加入购物车
    addShoppingCar: (data) => axios.post(`${JHW_GOODS_MANAGEMENT_API.ADD_SHOPPING_CAR}`, data),
    // 我的购物车
    toMyCar: (data) => axios.post(`${JHW_GOODS_MANAGEMENT_API.MY_CAR}`,data),
    //更新购物车商品数量
    updateMyCar: (data) => axios.post(`${JHW_GOODS_MANAGEMENT_API.UPDATE_SHOPING_CAR}`, data),
    // 获取购物车总数量
    getAllCount:() => axios.get(`${JHW_GOODS_MANAGEMENT_API.GET_ALL_COUNT}`),
    // 删除购物车信息
    deleteGood: (id) => axios.delete(`${JHW_GOODS_MANAGEMENT_API.DELETE_GOOD}?shoppingCarId=${id}`),
    // 生成预订单
    toBookingSheet : (id) => axios.get(`${JHW_GOODS_MANAGEMENT_API.TO_BOOKING_SHEET}?shoppingCarIds=${id}`),
    //报价详情
    getOfferDetail: (no) => axios.get(`${JHW_GOODS_MANAGEMENT_API.GET_OFFER_PRICE}?quotationNumber=${no}`),
    //客户获取详情
    getCustomerOfferDetail: (no) =>axios.get(`${JHW_GOODS_MANAGEMENT_API.GET_CUSTOMER_OFFER_DETAIL}?quotationNumber=${no}`),
  }