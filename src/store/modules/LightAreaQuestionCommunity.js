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
  title: i18n.t('MENU.GM_QUESTIONNAIRE'),
  view: 'LightAreaQuestionCommunity',
  page: 1,
  size: 10,
  url: `${API_GATEWAY}/question/epidemicRegisterPerson/selectByCondition`,
  mate: {
    mateSearch: { // 本地配置查询配置
      multipleConditions: true, // 是否多条件查询
      fields: [
        {holder: "text", name: "userName", label: "姓名", lg: 4, md: 6, placeholder: "请填写姓名",sm: 8},
        {holder: "text", name: "vehicle", label: "交通工具", lg: 4, md: 6, placeholder: "请填写交通工具",sm: 8},
        {holder: "select", name: "state", label: "状态", lg: 4, md: 6, placeholder: "请选择状态",sm: 8,options:[
          {value: 0, label: "未提报"}, {value: 1, label: '已提报'}
        ]}
      ],
      values:{
        userName: "",       // 姓名
        vehicle: "",  // 交通工具
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
        {action: "QRCode",label: "生成二维码",isApi: false,useId: -1,url: '',icon: "el-icon-full-screen"},
        {action: "refresh",label: "刷新列表",isApi: false,useId: -1,url: '',icon: "el-icon-refresh-right"},
        {action: "downloadTemplate",label: "下载导入模板",isApi: false,useId: -1,url: '',icon: "el-icon-document"},
        {action: "importFile",label: "导入",isApi: false,useId: -1,icon: "el-icon-upload2",url:'/question/epidemicRegisterPerson/export '},
        {action: "download",label: "导出",isApi: false,useId: -1,url: '',icon: "el-icon-download"},
        {action: "submit",label: "提报",isApi: false,useId: -1, isSelector: true, url: '',icon: "el-icon-finished"},
        {action: "submitAll",label: "提报全部",isApi: false,useId: -1, url: '',icon: "el-icon-finished"},
      ],
      columns: [
        {name: "areaType", label: "所属类型", width: 100, isShow: true, sortable: false},
        {name: "stateLabel", label: "状态", width: 100, isShow: true, sortable: false},
        {name: "userName", label: "姓名", width: 100, isShow: true, sortable: false},
        {name: "personIdentity", label: "身份类型", width: 100, isShow: true, sortable: false},
        {name: "idCard", label: "身份证号", width: 100, isShow: true, sortable: false},
        {name: "returnShenZhenTime", label: "返深时间", width: 100, isShow: true, sortable: false},
        {name: "addressBefore", label: "返深前住址", width: 100, isShow: true, sortable: false},
        {name: "vehicle", label: "交通工具", width: 100, isShow: true, sortable: false},
        {name: "entryMode", label: "入境方式", width: 100, isShow: true, sortable: false},
        {name: "wharfOrAirport", label: "车次/班次/车牌号", width: 100, isShow: true, sortable: false},
        {name: "location", label: "现居住址", width: 100, isShow: true, sortable: false},
        {name: "shenZhenCounty", label: "区、县", width: 100, isShow: true, sortable: false},
        {name: "shenZhenStreet", label: "街道", width: 100, isShow: true, sortable: false},
        {name: "shenZhenCommunity", label: "社区", width: 100, isShow: true, sortable: false},
        {name: "shenZhenDetailAddress", label: "详细住址", width: 100, isShow: true, sortable: false}
       ],
      rows: [
        {
          number:'1', 
          id: '000',
          userName: "二舅",
          idCard: "44839199503165221",
          addressBefore: "武汉",
          vehicle: "飞机",
          addressInSZ: "光明区"
        },
      ]
    },
    mateFormerHeader: {
      fields: [
        {name: "areaType", label: "所属类型", holder: 'textc'},
        {name: "userName", label: "姓名", holder: 'textc'},
        {name: "idCard", label: "身份证号", holder: 'textc'},
        {name: "returnShenZhenTime", label: "返深时间", holder: 'textc'},
        {name: "addressBefore", label: "返深前住址", holder: 'textc'},
        {name: "vehicle", label: "交通工具", holder: 'textc'},
        {name: "vehicle", label: "车次/班次/车牌号", holder: 'textc'},
        {name: "entryMode", label: "入境方式", holder: 'textc'},
        {name: "wharfOrAirport", label: "码头/机场", holder: 'textc'},
        {name: "location", label: "现居住址", holder: 'textc'},
        {name: "shenZhenCounty", label: "区、县", holder: 'textc'},
        {name: "shenZhenStreet", label: "街道", holder: 'textc'},
        {name: "shenZhenCommunity", label: "社区", holder: 'textc'},
        {name: "shenZhenDetailAddress", label: "详细住址", holder: 'textc'}
     
      ],
      values: {
        "userName": "",
        "idCard": "",
        "addressBefore": "",
        "trafficTools": "",
        "addressInSZ": ""
      }
    },
    mateListLine: null,
    mateFormerLine: null
  },
}

const actions = {
  setAddressBefore ({commit, state}, row){
    commit(TYPES.ADDRESS_BRFORE, row);
  }
}

const mutations = {
  [TYPES.SET_QUERY_URL] (state, data){
    state.mate.mateSearch.url += data;
  },
  [TYPES.ADDRESS_BRFORE] (state, row){
    row.addressBefore = row.beforeReturnProvince + row.beforeReturnCity + row.beforeReturnCounty
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
