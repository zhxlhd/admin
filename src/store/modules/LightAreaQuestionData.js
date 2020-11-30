/**
 * created by fengjing on 2020/03/14
 *光明社区调查问卷
 */
import TYPES from '../mutations-types'
import SERVICES from '../../services'
import BaseConstant from '../../constant/BaseConstant'
import { SMART_ORDER_API } from '../../services/apis'
import { API_GATEWAY } from '@/config/index.js'
import i18n from '@/i18n'

const state = {
  dict:{},
  name: '',
  title: i18n.t('MENU.GM_DATA_QUERY'),
  view: 'LightAreaQuestionData',
  page: 1,
  size: 10,
  url: `${API_GATEWAY}/question/epidemicRegisterPerson/selectByCondition`,
  mate: {
    mateSearch: { // 本地配置查询配置
      multipleConditions: true, // 是否多条件查询
      fields: [
        {holder: "text", name: "shenZhenStreet", label: "街道", lg: 4, md: 6, placeholder: "请填写街道", sm: 8},
        {holder: "text", name: "shenZhenCommunity", label: "社区", lg: 4, md: 6, placeholder: "请填写社区", sm: 8},
        {holder: "text", name: "companyName", label: "所属企业", lg: 4, md: 6, placeholder: "请填写所属企业",sm: 8},
      ],
      values:{
        shenZhenStreet: "",     // 街道
        companyName: "",       // 所属企业
        shenZhenCommunity: "",  // 社区
      },
      url: `${API_GATEWAY}/question/epidemicRegisterPerson/selectByCondition`
    },
    mateList: {
      dataApi: '',
      size: 10,
      page: 1,
      total: 0,
      actions:[ 
        {action: "details",
          url: "",
          label: "查看",
          isApi: true,
          useId: 0,
          method: "GET",
          type: ""
        }
      ],
      btns: [
        {action: "refresh",label: "刷新列表",isApi: false,useId: -1,url: '',icon: "el-icon-refresh-right"},
        {action: "download",label: "导出",isApi: false,useId: -1,url: '',icon: "el-icon-download"}
      ],
      columns: [
        {name: "shenZhenCounty", label: "区", width: 100, isShow: true, sortable: false},
        {name: "shenZhenStreet", label: "街道", width: 100, isShow: true, sortable: false},
        {name: "shenZhenCommunity", label: "社区", width: 100, isShow: true, sortable: false},
        {name: "companyName", label: "所属企业", width: 100, isShow: true, sortable: false},
        {name: "userName", label: "姓名", width: 100, isShow: true, sortable: false},
        {name: "idCard", label: "身份证", width: 100, isShow: true, sortable: false},
        {name: "addressBefore", label: "返深前住址", width: 100, isShow: true, sortable: false},
        {name: "vehicle", label: "交通工具", width: 100, isShow: true, sortable: false},
        {name: "areaType", label: "所属类型", width: 100, isShow: true, sortable: false},
        {name: "returnShenZhenTime", label: "返深时间", width: 100, isShow: true, sortable: false},
        {name: "vehicle", label: "交通工具", width: 100, isShow: true, sortable: false},
        {name: "entryMode", label: "入境方式", width: 100, isShow: true, sortable: false},
        {name: "wharfOrAirport", label: "车次/班次/车牌号", width: 100, isShow: true, sortable: false},
        {name: "location", label: "现居住址", width: 100, isShow: true, sortable: false},
        {name: "shenZhenDetailAddress", label: "详细住址", width: 100, isShow: true, sortable: false}
        
       ],
      rows: [
        {
          number:'1', 
          street:'凤凰街道',
          community: '光明区',
          userName: "二舅",
          company: '欣旺达',
          idCard: "44839199503165221",
          addressBefore: "武汉",
          vehicle: "飞机",
          addressInSZ: "光明区"
        },
      ]
    },
    mateFormerHeader: {
      fields: [
        {holder: "textc", name: "userName", label: "姓名"},
        {holder: "textc", name: "idCard", label: "身份证"},
        {holder: "textc", name: "shenZhenStreet", label: "街道"},
        {holder: "textc", name: "shenZhenCounty", label: "区"},
        {holder: "textc", name: "shenZhenCommunity", label: "社区"},
        {holder: "textc", name: "companyName", label: "所属公司"},
        {holder: "textc", name: "addressBefore", label: "返深前住址"},
        {holder: "textc", name: "vehicle", label: "交通工具"},
        {holder: "textc", name: "addressInSZ", label: "在深住址"},
        {name: "areaType", label: "所属类型", holder: 'textc'},
        {name: "returnShenZhenTime", label: "返深时间", holder: 'textc'},
        {name: "vehicle", label: "交通工具", holder: 'textc'},
        {name: "wharfOrAirport", label: "车次/班次/车牌号", holder: 'textc'},
        {name: "entryMode", label: "入境方式", holder: 'textc'},
        {name: "wharfOrAirport", label: "码头/机场", holder: 'textc'},
        {name: "location", label: "现居住址", holder: 'textc'},
        {name: "shenZhenDetailAddress", label: "详细住址", holder: 'textc'}
      ],
      values: {
        "userName": "",
        "idCard": "",
        "addressBefore": "",
        "shenZhenStreet": "",
        "shenZhenCounty": "",
        "shenZhenCommunity": "",
        "vehicle": "",
        "addressInSZ": "",
        "street": "",
        "community": "",
        "company": ""
      }
    },
    mateListLine: null,
    mateFormerLine: null
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
  },
  setQueryUrl ({commit, state}, data){
    commit(TYPES.SET_QUERY_URL, data);
  }
}

const mutations = {
  [TYPES.SET_QUERY_URL] (state, data){
    state.mate.mateSearch.url += data;
  },
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
