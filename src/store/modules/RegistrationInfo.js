/**
 * created by yxj on 2019/11/25
 * 物流商管理-物流商信息
 */
import TYPES from '../mutations-types'

const state = {
  registrationId:'',                                                        // 物流供应商备案跳转提货人备案、车辆备案 id
  logisticsRouteToSaveFlag:'',                                               // 物流线路维护跳转复制、修改的flag
}

const actions = {
  setRegistrationId({commit},id) {
    commit(TYPES.SET_REGISTRATION_ID,id);
  },
  setLogisticsRouteToSaveFlag({commit},id) {
    commit(TYPES.SET_LOGISTICS_ROUTE_TO_SAVE_FLAG,id);
  }
}

const mutations = {
  [TYPES.SET_REGISTRATION_ID](state, id){
    state.registrationId = id;
  },
  [TYPES.SET_LOGISTICS_ROUTE_TO_SAVE_FLAG](state, flag){
    state.logisticsRouteToSaveFlag = flag;
  },
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}
