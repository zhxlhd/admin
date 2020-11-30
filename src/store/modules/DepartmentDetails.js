/**
 * created by zhongxiaolong on 2020/02/06
 * 社区调查问卷-各部门人员填写明细
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
  title: i18n.t('MENU.FILL_IN_DETAILS'),
  view: 'DepartmentDetails',
  page: 1,
  size: 10,
  url: "",
  mate: {
    mateSearch: { // 本地配置查询配置
      multipleConditions: true, // 是否多条件查询
      fields: [
        {holder: "text", name: "dept2", label: "部门", lg: 4, md: 6, placeholder: "请填写部门", sm: 8},
        {holder: "text", name: "userno", label: "工号", lg: 4, md: 6, placeholder: "请填写工号", sm: 8},
        {holder: "text", name: "leadname", label: "直属主管", lg: 4, md: 6, placeholder: "请填写直属主管", sm: 8},
        {holder: "text", name: "username ", label: "姓名", lg: 4, md: 6, placeholder: "请填写姓名", sm: 8},
        // {holder: "select", name: "categoryremark", label: "资料填写", lg: 4, md: 6, placeholder: "请选择资料填写",sm: 8, options: [{label:'资料完善',value: '资料完善'},{label:'资料缺失', value: '资料缺失'}]},
      ],
      values:{
        dept2: "",  // 部门
        userno: "",  // 工号
        leadname: "", // 直属主管
        username : "",  // 姓名
      },
      url: `${API_GATEWAY}/question/app/report/list` // 查询/分页接口
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
        {action: "exportReport",label: "导出",isApi: false,useId: -1,url: '',icon: "el-icon-download"},
        {action: "exportEach",label: "导出一人一档",isApi: false,useId: -1,url: '',icon: "el-icon-download"},
      ],
      columns: [
        {name: "dept1", label: "公司", width: 100, isShow: true, sortable: false},
        {name: "dept2", label: "部门", width: 100, isShow: true, sortable: false},
        {name: "gzdd", label: "工作区域", width: 100, isShow: true, sortable: false},
        {name: "userno", label: "工号", width: 100, isShow: true, sortable: false},
        {name: "username", label: "姓名", width: 100, isShow: true, sortable: false},
        {name: "leadname", label: "直属主管", width: 100, isShow: true, sortable: false},
        {name: "vtype", label: "是否填写", width: 100, isShow: true, sortable: false},
        {name: "personalcategory", label: "人员类型", width: 100, isShow: true, sortable: false, filter: 'personalCategoryFilter'},
        {name: "categoryremark", label: "资料完整度", width: 120, isShow: true, sortable: false},
        {name: "lostinfo", label: "缺失日期", width: 100, isShow: true, sortable: false}
       ],
      rows: [
        {
          dept1: "公司",
          dept2: "部门",
          gzdd: "光明",
          userno: "160223191",
          username: "王五",
          leadname: "李四",
          vtype: "已填写",
          personalcategory: "IV类",
          categoryremark: "资料缺失",
          lostinfo: "2020/01/30 2020/01/31"
        },
      ]
    },
    mateFormerHeader: {
      fields: [
        {holder: "textc", name: "dept1", label: "公司"},
        {holder: "textc", name: "dept2", label: "部门"},
        {holder: "textc", name: "gzdd", label: "工作区域"},
        {holder: "textc", name: "userno", label: "工号"},
        {holder: "textc", name: "username", label: "姓名"},
        {holder: "textc", name: "leadname", label: "直属主管"},
        {holder: "textc", name: "vtype", label: "是否填写"},
        {holder: "textc", name: "personalcategory", label: "人员类型"},
        {holder: "textc", name: "categoryremark", label: "资料完整度"},
        {holder: "textarea", name: "lostinfo", label: "缺失日期"}
      ],
      values: {
        "dept1": "",
        "dept2": "",
        "gzdd": "",
        "userno": "",
        "username": "",
        "leadname": "",
        "vtype": "",
        "personalcategory": "",
        "categoryremark": "",
        "lostinfo": ""
      }
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
