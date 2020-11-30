/**
 * created by zhongxiaolong on 2019/08/19
 * 工单分类
 */
import TYPES from '../mutations-types'
import SERVICES from '../../services'
import BaseConstant from '../../constant/BaseConstant'
import { SMART_ORDER_API } from '../../services/apis'
import i18n from '@/i18n'

const state = {
  dict:{},
  name: 'ticket_classification_list',
  title: '工单分类',
  view: 'TicketClassification',
  addView: 'TicketClassification',
  page: 1,
  size: 1,
  url: "",
  mate: {
    mateSearch: { // 本地配置查询配置
      multipleConditions: true, // 是否多条件查询
      fields: [
        {holder: "text", name: "classification", label: "分类", lg: 4, md: 6, placeholder: "请填写分类", sm: 8},
        {holder: "text", name: "explain", label: "说明", lg: 4, md: 6, placeholder: "请填写说明", sm: 8},
        {holder: "select", name: "ticketType", label: "类型", lg: 4, md: 6, placeholder: "请选择工单类型",sm: 8,options:[]},
      ],
      values:{
        classification: "",         // 分类
        explain: "",     // 说明
        ticketType: "",  // 类型
      },
      ticketTypeOptions:[ // 查询条件状态下拉
        {id: '1', label: '标准工单', value: 'STARTING'},
        {id: '2', label: '非标准工单', value: 'PAUSE'},
      ],
    },
    mateList: {
      dataApi: '',
      size: 10,
      page: 1,
      total: 0,
      actions:[
        {
          action: "update",label: "修改",
          isApi: false,
          useId: 1, // 是否带id 跳转  不等于 -1 
          url: "/workordercategory/toEdit",
          method: "GET",
          icon: "el-icon-edit"
        },
        {
          action: "pause",
          urls: ["/workordercategory/change/DISABLE","/workordercategory/change/ENABLE"],
          type: ["primary","success"],
          label: ["失效","启用"],
          isApi: false,
          useId: 1, // 是否带id 跳转  不等于 -1 
          method: "GET",
          switchKey: "pauseFlag",  // 切换 key
          switch: true
        }
      ],
      btns: [
        {action: "add",label: "新增",isApi: false,useId: -1,url: SMART_ORDER_API.DOCUMENTDARYLIST_ADD,icon: "el-icon-plus"},
      ],
      columns: [
        {name: "orgId", label: "库存组织", width: 100, isShow: true, sortable: true},
        {name: "classification", label: "分类", width: 100, isShow: true, sortable: true},
        {name: "explain", label: "分类说明", width: 100, isShow: true, sortable: false},
        {name: "ticketType", label: "工单类型", width: 100, isShow: true, sortable: true}
       ],
      rows: [
        {soNum: '阿海',customerName: '大傻子',pauseFlag: 0},
        {soNum: '跟单列表',pauseFlag: 0,closeFlag:"232"}
      ]
    },
    mateFormerHeader: {
      fields: [
        {holder: "textc", name: "orgId", label: "库存组织"},
        {holder: "textc", name: "classification", label: "分类"},
        {holder: "textc", name: "explain", label: "分类说明"},
        {holder: "textc", name: "ticketType", label: "工单类型"}
      ],
      values: {
        orgId: '',
        classification: '',
        explain: '',
        ticketType: ''
      }
    },
    mateListLine: {},
    mateFormerLine: {}
  },
}

const actions = {
  initList ({commit, state, rootState},data){
    // commit(TYPES.INIT_MAIN_LIST, data)
  },
  orderStatus ({commit, state}, row){
    commit(TYPES.ORDER_STATUS_CHANGE, row);
  },
  setDetailValues ({commit, state}, row){
    commit(TYPES.SET_DETAIL_VALUES, row);
  },
  add ({commit, state}) {
    commit(TYPES.DOCUMENTDARYLIST_ADD);
    this.$root.monitor({url:SMART_ORDER_API.DOCUMENTDARYLIST_QUERY});
  }
}

const mutations = {
  [TYPES.INIT_MAIN_LIST] (state, data){
    console.log(data);
    console.log(state);
  },
  [TYPES.ORDER_STATUS_CHANGE] (state, row){
    let pauseFlag = row.pauseFlag;
    if(pauseFlag=="0"){
      row.pauseFlag = "1";
    }else if(pauseFlag=="1"){
      row.pauseFlag = "2"
    }else if(pauseFlag=="2"){
      row.pauseFlag = "1"
    }
  },
  [TYPES.GET_LIST_DOCUMENTDARYLIST] (state, data){
    state.mate.mateList.page = state.page;
    state.mate.mateList.size = state.size;
    if(data.data){
      state.mate.mateList.rows = data.data;
      state.mate.mateList.total = data.total;
      state.mate.mateList.page = data.page;
      state.mate.mateList.size = data.size;
    }
  },
  [TYPES.SET_DETAIL_VALUES] (state, data){
    state.mate.mateFormerHeader.values
  },
  [TYPES.DOCUMENTDARYLIST_ADD](state, data){

  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}
