/**
 * created by zhongxiaolong on 2020/02/02
 * 企业调查问卷
 */
import TYPES from '../mutations-types'
import SERVICES from '../../services'
import BaseConstant from '../../constant/BaseConstant'
import { SMART_ORDER_API } from '../../services/apis'
import i18n from '@/i18n'

const state = {
  dict:{},
  name: '',
  title: i18n.t('MENU.E_QUESTIONNAIRE'),
  view: 'Question',
  page: 1,
  size: 10,
  url: "",
  mate: {
    mateSearch: { // 本地配置查询配置
      multipleConditions: true, // 是否多条件查询
      fields: [
        {holder: "text", name: "userno", label: "工号", lg: 4, md: 6, placeholder: "请填写员工工号", sm: 8},
        {holder: "text", name: "leadName", label: "直属领导", lg: 4, md: 6, placeholder: "请填写直属领导", sm: 8},
        // {holder: "text", name: "uname", label: "姓名", lg: 4, md: 6, placeholder: "请填写姓名", sm: 8},
        // {holder: "text", name: "dept1", label: "一级部门", lg: 4, md: 6, placeholder: "请填写一级部门",sm: 8},
      ],
      values:{
        userno: "",    // 工号
        leadName: "",       // 姓名
      }
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
        // {action: "QRCode",label: "生成二维码",isApi: false,useId: -1,url: '',icon: "el-icon-full-screen"},
        {action: "refresh",label: "刷新列表",isApi: false,useId: -1,url: '',icon: "el-icon-refresh-right"},
      ],
      columns: [
        {name: "userno", label: "工号", width: 100, isShow: true, sortable: false},
        {name: "uname", label: "姓名", width: 100, isShow: true, sortable: false},
        {name: "dept1", label: "一级部门", width: 100, isShow: true, sortable: false},
        {name: "tel", label: "联系电话", width: 100, isShow: true, sortable: false},
        {name: "workplace", label: "工作地", width: 150, isShow: true, sortable: false},
        {name: "jiguan", label: "出生籍贯", width: 100, isShow: true, sortable: false},
        {name: "idAddress", label: "身份证地址", width: 200, isShow: true, sortable: false},
        {name: "housingSituation", label: "工作地长居住房情况", width: 100, isShow: true, sortable: false}
       ],
      rows: [
        {
          number:'1', 
          uname: '实例',
          curCity: '深圳',
          userno: 190113162, 
          dept1: '信息中心', 
          tel: '13727493402', 
          workplace: '深圳', 
          jiguan: '广州', 
          dAddress: 'XXXXX...', 
          housingSituation: '宿舍'
        },
      ]
    },
    mateFormerHeader: {
      fields: [
        {holder: "textc", name: "userno", label: "工号"},
        {holder: "textc", name: "uname", label: "姓名"},
        {holder: "textc", name: "dept1", label: "一级部门"},
        {holder: "textc", name: "tel", label: "联系电话"},
        {holder: "textc", name: "workplace", label: "工作地"},
        {holder: "textc", name: "jiguan", label: "出生籍贯"},
        {holder: "textc", name: "idAddress", label: "身份证地址"},
        {holder: "textc", name: "housingSituation", label: "工作地长居住房情况"}
      ],
      values: {
        userno: '',
        uname: '',
        dept1: '',
        tel: '',
        workplace: '',
        jiguan: '',
        idAddress: '',
        housingSituation: ''
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
