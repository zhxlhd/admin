/**
 * created by zhongxiaolong on 2020/02/11
 * 基础数据-架构角色
 */
import TYPES from '../mutations-types'
import i18n from '@/i18n'

const state = {
  dict:{},
  name: '',
  title: i18n.t('MENU.ORG_ROLE'),
  view: 'MemberRole',
  page: 1,
  size: 10,
  url: "",
  mate: {
    mateSearch: null,
    mateList: {
      dataApi: '',
      size: 10,
      page: 1,
      total: 0,
      actions:[],
      btns: [],
      columns: [],
      rows: []
    },
    mateFormerHeader: {
      fields: [],
      values: {}
    },
    mateListLine: null,
    mateFormerLine: null
  },
}

const actions = {
  initList ({commit, state, rootState},data){
    // commit(TYPES.INIT_MAIN_LIST, data)
  }
}

const mutations = {
  [TYPES.INIT_MAIN_LIST] (state, data){
    console.log(data);
    console.log(state);
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}
