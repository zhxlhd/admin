/**
 * created by hezhiqiang on 2019/12/24
 * 提货单-物流商信息
 */
import TYPES from '../mutations-types'

const state = {
  logisticsProviderId: '',        // 提货单-物流商
  logisticsProviderPhone: '',     // 提货单-物流商电话
  logisticsProviderEmail: '',     // 提货单-物流商邮箱
}

const actions = {
  setLogisticsProviderId({commit},id) {
    commit(TYPES.SET_LOGISTICS_PROVIDER_ID,id);
  },
}

const mutations = {
  [TYPES.SET_LOGISTICS_PROVIDER_ID](state, id){
    state.logisticsProviderId = id;
  },
  setLogisticsProviderPhone(state,value) {
    state.logisticsProviderPhone = value;
  },
  setLogisticsProviderEmail(state,value) {
    state.logisticsProviderEmail = value;
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}
