/**
 * created by zhongxiaolong on 2020/02/02
 * 社区调查问卷
 */
import TYPES from '../mutations-types'
import { API_GATEWAY } from '@/config/index.js'
import i18n from '@/i18n'

const state = {
  dict:{},
  name: '',
  title: i18n.t('MENU.C_QUESTIONNAIRE'),
  view: 'QuestionCommunity',
  page: 1,
  size: 10,
  url: "",
  mate: {
    mateSearch: { // 本地配置查询配置
      multipleConditions: true, // 是否多条件查询
      fields: [
        {holder: "text", name: "street", label: "街道", lg: 4, md: 6, placeholder: "请填写街道", sm: 8},
        {holder: "text", name: "community", label: "社区", lg: 4, md: 6, placeholder: "请填写社区", sm: 8},
        {holder: "text", name: "username", label: "姓名", lg: 4, md: 6, placeholder: "请填写姓名",sm: 8},
      ],
      values:{
        street: "",     // 街道
        username: "",       // 姓名
        community: "",  // 社区
      },
      url: `${API_GATEWAY}/question/personel/community/list`
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
        {action: "exportReport",label: "导出",isApi: false,useId: -1,url: '',icon: "el-icon-download"},
      ],
      columns: [
        // {name: "number", label: "序号", width: 50, isShow: true, sortable: false},
        {name: "street", label: "街道", width: 100, isShow: true, sortable: false},
        {name: "community", label: "社区", width: 100, isShow: true, sortable: false},
        {name: "username", label: "姓名", width: 100, isShow: true, sortable: false},
        {name: "idCard", label: "身份证", width: 100, isShow: true, sortable: false},
        {name: "domicile", label: "户籍地", width: 100, isShow: true, sortable: false},
        {name: "gender", label: "性别", width: 100, isShow: true, sortable: false},
        {name: "age", label: "年龄", width: 100, isShow: true, sortable: false},
        {name: "telephone", label: "联系电话", width: 100, isShow: true, sortable: false},
        {name: "liaison", label: "联络员", width: 100, isShow: true, sortable: false},
        {name: "liaisonPhone", label: "联络员联系电话", width: 120, isShow: true, sortable: false},
        {name: "isCoop", label: "是否配合", width: 100, isShow: true, sortable: false},
        {name: "temperatureInfo", label: "体温检测", width: 100, isShow: true, sortable: false},
        {name: "healthyInfo", label: "健康情况", width: 100, isShow: true, sortable: false},
        {name: "isolatedLocation", label: "隔离(留观)地点", width: 150, isShow: true, sortable: false},
        {name: "remark", label: "备注", width: 100, isShow: true, sortable: false}
       ],
      rows: [
        {
          number:'1', 
          street: "湘江街道",
          community: "不待家里不舒服社区",
          username: "二舅",
          idCard: "44839199503165221",
          domicile: "武汉",
          gender: "不明",
          age: "26",
          telephone: "13798276524",
          liaison: "二舅妈",
          liaisonPhone: "13628379261",
          isCoop: "是",
          temperatureInfo: "36.6",
          healthyInfo: "健康",
          isolatedLocation: "家里",
          remark: "家里是哪里",
        },
      ]
    },
    mateFormerHeader: {
      fields: [
        {holder: "textc", name: "street", label: "街道"},
        {holder: "textc", name: "community", label: "社区"},
        {holder: "textc", name: "username", label: "姓名"},
        {holder: "textc", name: "idCard", label: "身份证"},
        {holder: "textc", name: "domicile", label: "户籍地"},
        {holder: "textc", name: "gender", label: "性别"},
        {holder: "textc", name: "age", label: "年龄"},
        {holder: "textc", name: "telephone", label: "联系电话"},
        {holder: "textc", name: "liaison", label: "联络员"},
        {holder: "textc", name: "liaisonPhone", label: "联络员联系电话"},
        {holder: "textc", name: "isCoop", label: "是否配合"},
        {holder: "textc", name: "temperatureInfo", label: "体温检测"},
        {holder: "textc", name: "healthyInfo", label: "健康情况"},
        {holder: "textc", name: "isolatedLocation", label: "隔离(留观)地点"},
        {holder: "textarea", name: "remark", label: "备注"}
      ],
      values: {
        "street": "",
        "community": "",
        "username": "",
        "idCard": "",
        "domicile": "",
        "gender": "",
        "age": "",
        "telephone": "",
        "liaison": "",
        "liaisonPhone": "",
        "isCoop": "",
        "temperatureInfo": "",
        "healthyInfo": "",
        "isolatedLocation": "",
        "isolatedLocation": "",
        "remark": "",
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
