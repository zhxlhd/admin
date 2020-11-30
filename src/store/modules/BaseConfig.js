/**
 * created by zhongxiaolong on 2019/12/07
 * 生产管理-日产日清 双列表模板 
 */
import TYPES from '../mutations-types'
import SERVICES from '../../services'
import { SYS_API } from '../../services/apis'
import i18n from '@/i18n'

const state = {
  dict:{},
  title: i18n.t('MENU.BASE_CONFIG'),  // tab标签名字
  view: 'BaseConfig',                  // 页面模块名字
  url: SYS_API.BASE_CONFIG_SAVE,       // 保存接口
  next: SYS_API.BASE_CONFIG_MAIN_LIST, // 页面接口
  mate: {
    fields: [
      // {name: 'inventoryImplifyFlag', label: '是否启用库存简化流程'},
      // {name: 'inventoryFlag', label: '是否启用库存'},
      // {name: 'inventoryMinusFlag', label: '是否允许负库存'},
      // {name: 'saleOrderInputPriceFlag', label: '销售订单是否允许手工输入价格'},
      // {name: 'purchaseOrderInputPriceFlag', label: '采购订单是否允许输入价格'},
      // {name: 'saleOrderOneselfQueryFlag', label: '只可查看自己的销售订单'},
      // {name: 'batchManagementFlag', label: '是否启用批次管'},
      // {name: 'purchaseOrderOneselfQueryFlag', label: '只可查看自己的采购订单'},
    ],
    values: {}
  },
}

const getters = {
  values (state){
    return state.mate.values;
  },
  checkbox (state){
    return state.mate.fields;
  },
  data (state){
    let data = state.mate.fields.map(item =>{
      return item.parameterVal = state.mate.values[item.parameter]
    })
    return data;
  }
}
const actions = {
  initList ({commit, state, rootState}, data){
    // SERVICES.BASE_CONFIG.initList().then(res =>{
    //   if(res.data && res.data.statusCode === 200){
        commit(TYPES.INIT_MAIN_LIST, data)
      // }
    // })
    
  },
  handleSave({commit, state}, cb){
    commit(TYPES.HANDLE_SAVE, cb);
  },
  handleCheckbox({commit, state}, data){
    commit(TYPES.HANDLE_CHECKBOX, data)
  }
}

const mutations = {
  [TYPES.INIT_MAIN_LIST] (state, data){
    let checkboxList = data.data
    checkboxList.forEach(item =>{
      item.name = item.parameter;
      item.label = item.parameterName;
      state.mate.values[item.parameter] = item.parameterVal===0 ? false : true;
    })
    // 渲染 checkbox
    state.mate.fields = checkboxList;
  },
  [TYPES.HANDLE_SAVE] (state, cb){
    let {url, next} = state;
    let param = {};
    state.mate.fields.forEach(item =>{
      item.parameterVal = (state.mate.values[item.parameter] === true) ? 1 : 0;
      delete item.name;
      delete item.label;
    })
    param.lineList = state.mate.fields;
    SERVICES.BASE_CONFIG.handleSave(param).then(res => cb());
  },
  [TYPES.HANDLE_CHECKBOX] (state, data){
   state.mate.values[data.name] = data.value;
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
