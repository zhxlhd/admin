/**
 * created by fengjing on 2020-05-18
 * 在线选购
 */
import TYPES from '../mutations-types'

const state = {
  goodId: '',        // 商品id
  carId: '', // 购物车勾选id
  isEdit: '' // 是否编辑
}
const mutations = {
  setGoodId({commit},id) {
    state.goodId = id;
  },
  setCarId({commit},id){
    state.carId = id;
  },
  setIsEdit({commit},isEdit){
    state.isEdit = isEdit
  }
}


export default {
  namespaced: true,
  state,
  mutations
}
