/**
 * created by yxj on 2020/06/22
 * 商品发布-需求发布、供应发布
 */
import TYPES from '../mutations-types'

const state = {
  demandToSaveFlag:'',            // 商品发布-需求发布跳转复制、编辑的flag
  supplyToSaveFlag:'',            // 商品发布-供应发布跳转复制、编辑的flag
}

const actions = {
  setDemandToSaveFlag({commit}, flag) {
    commit(TYPES.SET_DEMAND_TO_SAVE_FLAG, flag);
  },
  setSupplyToSaveFlag({commit}, flag) {
    commit(TYPES.SET_SUPPLY_TO_SAVE_FLAG, flag);
  }
}

const mutations = {
  [TYPES.SET_DEMAND_TO_SAVE_FLAG](state, flag){
    state.demandToSaveFlag = flag;
  },
  [TYPES.SET_SUPPLY_TO_SAVE_FLAG](state, flag){
    state.supplyToSaveFlag = flag;
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}
