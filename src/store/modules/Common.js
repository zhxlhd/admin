/**
 * created by zhongxiaolong on 2022/05/18
 * 通用模板属性存放
 */
import TYPES from '../mutations-types'
import SERVICES from '../../services'
import { SYS_API } from '../../services/apis'
import i18n from '@/i18n'

const state = {
  rowId: '',
}

const getters = {
  pid (state){
    return state.rowId;
  }
}

const actions = {
  setRowId ({commit, state}, data){
    commit(TYPES.SET_EDIT_ROW_ID, data)
  }
}

const mutations = {
  [TYPES.SET_EDIT_ROW_ID] (state, data){
    state.rowId = data;
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
