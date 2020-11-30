/**
 * created by zhongxiaolong on 2020/02/29
 * 疫情数据导入 
 */
import { API_GATEWAY } from '@/config/index.js'
import i18n from '@/i18n'

const state = {
  dict:{},
  name: '',
  title: i18n.t('MENU.DATA_IMPORT'),
  view: 'EpidemicData',
  url: "",
  mate: {
    mateSearch:  { // 本地配置查询配置
      multipleConditions: true, // 是否多条件查询
      fields: [
        {holder: "text", name: "province", label: "省份", lg: 4, md: 6, placeholder: "请填写省份", sm: 8},
        {holder: "text", name: "city", label: "市级", lg: 4, md: 6, placeholder: "请填写市", sm: 8},
        {holder: "text", name: "county", label: "县级", lg: 4, md: 6, placeholder: "请填写县", sm: 8},
        {holder: "text", name: "noAddedDays", label: "中风险为新增确诊病例天数", lg: 4, md: 6, placeholder: "请填写中风险为新增确诊病例天数", sm: 8},
        {holder: "text", name: "riskLevel", label: "风险等级", lg: 4, md: 6, placeholder: "请填写风险等级", sm: 8},
      ],
      values:{
        province: "",    // 省份
        city: "",        // 市级
        county: "",      // 县级
        noAddedDays: "", // 中风险为新增确诊病例天数
        riskLevel: "",   // 风险等级
      },
      url: `${API_GATEWAY}/question/map/epidemicData/list` // 查询/分页接口
    },
    mateList: {
      dataApi: '',
      size: 10,
      page: 1, 
      total: 0,
      
      actions:[ 
        {
          action: "details",
          url: "",
          label: "查看",
          isApi: true,
          useId: 0,
          method: "GET",
          type: ""
        }
      ],
      btns: [
        {action: "exportReport",label: "下载导入模板",isApi: false,useId: -1,url: `${API_GATEWAY}/question/map/download/tpl` ,icon: "el-icon-download"},
        {action: "importReport",label: "导入",isApi: false,useId: -1,url: `${API_GATEWAY}/question/map/epidemicData/import` ,icon: "el-icon-upload2"},
      ],
      columns: [
        // 基础信息
        {name: "province", label: "省份", width: 100, isShow: true },
        {name: "city", label: "市级", width: 80, isShow: true },
        {name: "county", label: "县级", width: 80, isShow: true },
        {name: "noAddedDays", label: "中风险为新增确诊病例天数", width: 220, isShow: true },
        {name: "riskLevel", label: "风险等级", width: 180, isShow: true }
       ],
      rows: []
    },
    mateFormerHeader: {
      labelWidth: "130px",
      fields: [
        { holder: "textc", name: "province", label: "省份" },
        { holder: "textc", name: "city", label: "市级" },
        { holder: "textc", name: "county", label: "县级" },
        { holder: "textc", name: "noAddedDays", label: "中风险为新增确诊病例天数" },
        { holder: "textc", name: "riskLevel", label: "风险等级" }
      ],
      values: {}
    },
    mateListLine: null,
    mateFormerLine: null
  },
}

const actions = {}

const mutations = {}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}
