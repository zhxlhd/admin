/**
 * 销售管理--套料物料需求服务
 * created by hezhiqiang on 2020/03/16
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import {SALE_MANAGE_API} from '../apis'; // 导入当前模板和公用 API 

export default {
    // 获取明细行列表数据
    getDetailList: (id) => axios.get(`${SALE_MANAGE_API.NESTING_MATERIAL_DEMAND_DETAIL_LIST}/${id}`),
    // 点击新增，根据订单id获取订单行信息
    getOrderLineData: (id) => axios.get(`${SALE_MANAGE_API.NESTING_MATERIAL_DEMAND_ADD}/${id}`),
    // 列表 生成物料需求
    generateMaterialDemand: (id) => axios.get(`${SALE_MANAGE_API.GENERATE_MATERIAL_DEMAND}/${id}`),
    // 判断物料需求是否已存在
    checkMaterialDemand: (id) => axios.get(`${SALE_MANAGE_API.VERIFY_GENERATE_MATERIAL_DEMAND}/${id}`),
    // 检查物料库存
    checkMaterialStock:(id) => axios.get(`${SALE_MANAGE_API.CHECK_MATERIAL_STOCK}/${id}`),
    // 列表 删除物料需求
    deleteMaterialDemand: (id) => axios.get(`${SALE_MANAGE_API.NESTING_MATERIAL_DEMAND_DELETE}/${id}`),
    // 提交按钮
    formSave: (data) => axios.post(`${SALE_MANAGE_API.NESTING_MATERIAL_DEMAND_FORM_SAVE}`,data),
    // 明细行列表 修改
    orderLineEdit: (id) => axios.get(`${SALE_MANAGE_API.NESTING_MATERIAL_DEMAND_LINE_EDIT}/${id}`),
    // 明细行列表 删除
    orderLineDelete: (ids) => axios.get(`${SALE_MANAGE_API.NESTING_MATERIAL_DEMAND_LINE_DELETE}?ids=${ids}`),
}