/**
 * 物流基础信息 服务
 * created by yxj on 2019/11/20
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import {LOGISTIC_BASIC_DATA_API} from '../apis'; // 导入当前模板和公用 API

export default {
  // 获取所属机构
  getOrgList: () => axios.get(`${LOGISTIC_BASIC_DATA_API.ORG_LIST}`),
  // 校验仓库代码是否唯一
  checkWarehouseCode: code => axios.get(`${LOGISTIC_BASIC_DATA_API.WAREHOUSE_CHECK_CODE}/${code}`),
  // 获取仓库信息的详情
  getWareHouseDetails: (id) => axios.get(`${LOGISTIC_BASIC_DATA_API.WAREHOUSE_DETAIL}?id=${id}`),
  // 删除仓库信息
  deleteWareHouse: (ids) => axios.get(`${LOGISTIC_BASIC_DATA_API.WAREHOUSE_DELETE}?ids=${ids}`),


  // 校验站点名称是否唯一
  checkStationNameCode: code => axios.get(`${LOGISTIC_BASIC_DATA_API.STATION_CHECK_CODE}?name=${code}`),
  // 删除物流站点
  deleteStation: (ids) => axios.get(`${LOGISTIC_BASIC_DATA_API.STATION_DELETE}?ids=${ids}`),

  // 删除物流商信息
  deleteLogisticsProvidersInfo: (ids) => axios.get(`${LOGISTIC_BASIC_DATA_API.LOGISTICS_PROVIDERS_INFO_DELETE}?ids=${ids}`),
  // 物流商信息列表页-附件弹窗 获取附件列表list
  getAttachMentListWithLogisticsProviders: (id) => axios.get(`${LOGISTIC_BASIC_DATA_API.LOGISTICS_PROVIDERS_INFO_ATTACHMENT_LIST}/${id}`),
  // 物流商信息列表页-附件弹窗 上传附件
  uploadAttachMent: (data) => axios.post(`${LOGISTIC_BASIC_DATA_API.LOGISTICS_PROVIDERS_INFO_ATTACHMENT_UPLOAD}`,data),
  // 物流商信息列表页-附件弹窗 删除附件
  deleteAttachMent: (id) => axios.get(`${LOGISTIC_BASIC_DATA_API.LOGISTICS_PROVIDERS_INFO_ATTACHMENT_DELETE}/${id}`),
  // 物流商信息列表页-新增页 获取
  getLogisticsProvidersList: () => axios.get(`${LOGISTIC_BASIC_DATA_API.LOGISTICS_PROVIDERS_INFO_GET_LIST}`),

  // 删除物流供应商备案信息
  deleteRegistrationInfo: (ids) => axios.get(`${LOGISTIC_BASIC_DATA_API.REGISTRATION_INFO_DELETE}?ids=${ids}`),
  // 物流供应商备案信息列表页-附件弹窗 获取附件列表list
  getAttachMentListWithRegistration: (id) => axios.get(`${LOGISTIC_BASIC_DATA_API.REGISTRATION_INFO_ATTACHMENT_LIST}/${id}`),
  // 物流供应商备案信息-提货人-附件弹窗 获取附件列表list
  getAttachMentListWithRegistrationConsignee: (id) => axios.get(`${LOGISTIC_BASIC_DATA_API.REGISTRATION_CONSIGNEE_ATTACHMENT_LIST}/${id}`),
  // 删除物流供应商备案信息-提货人
  deleteRegistrationConsignee: (ids) => axios.get(`${LOGISTIC_BASIC_DATA_API.REGISTRATION_CONSIGNEE_DELETE}?ids=${ids}`),
  //物流供应商备案信息-提货人 失效
  loseEffectWithConsignee: (id, status) => axios.get(`${LOGISTIC_BASIC_DATA_API.REGISTRATION_CONSIGNEE_LOSE_EFFECT}?id=${id}&status=0`),
  //物流供应商备案信息-提货人 提交审批、审批、驳回
  approveWithConsignee: (id, type) => axios.get(`${LOGISTIC_BASIC_DATA_API.REGISTRATION_CONSIGNEE_APPROVE}?id=${id}&type=${type}`),
  // 物流供应商备案信息-车辆备案-附件弹窗 获取附件列表list
  getAttachMentListWithRegistrationVehicle: (id) => axios.get(`${LOGISTIC_BASIC_DATA_API.REGISTRATION_VEHICLE_ATTACHMENT_LIST}/${id}`),
  //物流供应商备案信息-提货人 失效
  loseEffectWithVehicle: (id, status) => axios.get(`${LOGISTIC_BASIC_DATA_API.REGISTRATION_VEHICLE_LOSE_EFFECT}?id=${id}&status=0`),
  //物流供应商备案信息-提货人 提交审批、审批、驳回
  approveWithVehicle: (id, type) => axios.get(`${LOGISTIC_BASIC_DATA_API.REGISTRATION_VEHICLE_APPROVE}?id=${id}&type=${type}`),
  // 删除物流供应商备案信息-车辆
  deleteRegistrationVehicle: (ids) => axios.get(`${LOGISTIC_BASIC_DATA_API.REGISTRATION_VEHICLE_DELETE}?ids=${ids}`),
  // 物流供应商备案信息-车辆备案-校验车牌是否唯一
  checkRegistrationVehicle: (registrationId, caCarNum) => axios.get(`${LOGISTIC_BASIC_DATA_API.REGISTRATION_VEHICLE_CHECK}/${registrationId}/${caCarNum}`),
  // 物流供应商备案信息-提货人备案-校验身份证唯一
  checkRegistrationConsigneeIdCard: (registrationId, idCard) => axios.get(`${LOGISTIC_BASIC_DATA_API.REGISTRATION_CONSIGNEE_CHECK_IDCARD}/${registrationId}/${idCard}`),

  // 物流线路管理  物流线路维护 新增页 校验站点名称是否唯一
  checkRouteCode: code => axios.get(`${LOGISTIC_BASIC_DATA_API.LOGISTICS_ROUTE_CHECK_CODE}/${code}`),
  // 物流线路管理  物流线路维护 新增页 起点、终点站点下拉列表
  stationList: () => axios.get(`${LOGISTIC_BASIC_DATA_API.LOGISTICS_ROUTE_SEARCH_STATION_LIST}`),
  // 物流线路管理 物流线路维护 获取详情
  getLogisticsRouteDetails: (id) => axios.get(`${LOGISTIC_BASIC_DATA_API.LOGISTICS_ROUTE_DETAILS}?id=${id}`),
  // 物流线路管理 删除物流线路
  deleteLogisticsRoute: (ids) => axios.get(`${LOGISTIC_BASIC_DATA_API.LOGISTICS_ROUTE_DELETE}?ids=${ids}`),
  // 物流线路管理  物流线路定价 定价线路下拉列表
  routePriceList: () => axios.get(`${LOGISTIC_BASIC_DATA_API.LOGISTICS_ROUTE_PRICE_SEARCH_ROUTE_LIST}`),
  // 删除物流线路定价
  deleteLogisticsRoutePrice: (ids) => axios.get(`${LOGISTIC_BASIC_DATA_API.LOGISTICS_ROUTE_PRICE_DELETE}?ids=${ids}`),
  //物流线路定价 提交审批、审批、驳回
  approveWithRoutePrice: (id, type) => axios.get(`${LOGISTIC_BASIC_DATA_API.LOGISTICS_ROUTE_PRICE_APPROVE}?id=${id}&type=${type}`),
  // 物流线路定价 获取详情
  getLogisticsRoutePriceDetails: (id) => axios.get(`${LOGISTIC_BASIC_DATA_API.LOGISTICS_ROUTE_PRICE_DETAILS}?id=${id}`),
  // 物流线路定价-附件弹窗 获取附件列表list
  getAttachMentListWithLogisticsRoutePrice: (id) => axios.get(`${LOGISTIC_BASIC_DATA_API.LOGISTICS_ROUTE_PRICE_ATTACHMENT_LIST}/${id}`),
  // 物流线路定价-新增页-判断同一线路+物流商应校验唯一
  checkRouteIdAndProvideId: (provideId, routeId) => axios.get(`${LOGISTIC_BASIC_DATA_API.LOGISTICS_ROUTE_PRICE_CHECK_CODE}/${provideId}/${routeId}`),
  // 物流线路定价-新增页 获取物流商列表
  getLogisticsProvidersListByType: () => axios.get(`${LOGISTIC_BASIC_DATA_API.LOGISTICS_PROVIDERS_INFO_GET_LIST_TYPE}`),
}
