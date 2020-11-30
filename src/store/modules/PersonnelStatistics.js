/**
 * created by zhongxiaolong on 2020/02/06
 * 社区调查问卷-参与填写人员统计
 */
import TYPES from '../mutations-types'
import { API_GATEWAY } from '@/config/index.js'
import i18n from '@/i18n'

const state = {
  dict:{},
  name: '',
  title: i18n.t('MENU.FILL_IN_STATISTICS'),
  view: 'PersonnelStatistics',
  page: 1,
  size: 10,
  url: "",
  mate: {
    mateSearch: { // 本地配置查询配置
      multipleConditions: true, // 是否多条件查询
      fields: [
        {holder: "text", name: "dept2", label: "部门", lg: 4, md: 6, placeholder: "请填写部门", sm: 8},
      ],
      values:{
        dept2: "",  // 部门
      },
      url: `${API_GATEWAY}/question/app/report/count` // 查询/分页接口
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
      ],
      columns: [
        {name: "dept2", label: "部门", width: 180, isShow: true, sortable: false},
        {name: "num21", label: "I类", width: 100, isShow: true, sortable: false},
        {name: "num22", label: "II类", width: 100, isShow: true, sortable: false},
        {name: "num23", label: "III类", width: 100, isShow: true, sortable: false},
        {name: "num24", label: "IV类", width: 100, isShow: true, sortable: false},
        {name: "num31", label: "填写完善人数合计(A1)", width: 150, isShow: true, sortable: false},
        {name: "num32", label: "填写不完善人数合计(A2)", width: 170, isShow: true, sortable: false},
        {name: "num11", label: "填写人数合计(A0=A1+A2)", width: 170, isShow: true, sortable: false},
        {name: "num12", label: "未参与填写(B0)", width: 120, isShow: true, sortable: false},
        {name: "total", label: "总人数合计(A0+B0)", width: 150, isShow: true, sortable: false}
       ],
      rows: [
        {
          dept2: "部门",
          num21: "35",
          num22: "67",
          num23: "43",
          num24: "378",
          num31: "523",
          num32: "2",
          num11: "525",
          num12: "3",
          total: "528"
        },
      ]
    },
    mateFormerHeader: {
      fields: [
        {holder: "textc", name: "dept2", label: "部门"},
        {holder: "textc", name: "num21", label: "I类"},
        {holder: "textc", name: "num22", label: "II类"},
        {holder: "textc", name: "num23", label: "III类"},
        {holder: "textc", name: "num24", label: "IV类"},
        {holder: "textc", name: "num31", label: "填写完善合计"},
        {holder: "textc", name: "num32", label: "填写不完善合计"},
        {holder: "textc", name: "num11", label: "填写人数合计"},
        {holder: "textc", name: "num12", label: "未参与填写"},
        {holder: "textc", name: "total", label: "总人数合计"}
      ],
      values: {
        "num21": "",
        "num22": "",
        "num23": "",
        "num24": "",
        "num31": "",
        "num32": "",
        "num11": "",
        "num12": "",
        "total": ""
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
