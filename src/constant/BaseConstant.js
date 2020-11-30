import i18n from '../i18n';

export const BaseConstant = {
  // 本地配置模块
  MENU: [
    {title: i18n.t('MENU.DEMO'), view: 'Demo'}, // 演示模块 
    {title: i18n.t('MENU.BASE_CONFIG'), view: 'BaseConfig'}, // 系统管理-参数设置 
    {title: i18n.t('MENU.E_QUESTIONNAIRE'), view: 'Question'}, // 调查问卷-企业调查问卷 
    {title: i18n.t('MENU.C_QUESTIONNAIRE'), view: 'QuestionCommunity'}, // 调查问卷-社区调查问卷 
    {title: i18n.t('MENU.FILL_IN_DETAILS'), view: 'DepartmentDetails'}, // 调查问卷-各部门人员填写明细 
    {title: i18n.t('MENU.FILL_IN_STATISTICS'), view: 'PersonnelStatistics'}, // 调查问卷-参与填写人员统计
    {title: i18n.t('MENU.TRAVEL_INFO'), view: 'TravelInformation'}, // 调查问卷-行程信息
    {title: i18n.t('MENU.ORG_STR'), view: 'OrganizationalStructure'}, // 基础数据-组织架构 
    {title: i18n.t('MENU.ORG_ROLE'), view: 'MemberRole'}, // 基础数据-架构角色 
    {title: i18n.t('MENU.DATA_IMPORT'), view: 'EpidemicData'}, // 调查问卷-疫情数据导入 
    {title: i18n.t('MENU.GM_QUESTIONNAIRE'), view: 'LightAreaQuestionCommunity'}, // 调查问卷-光明区疫情问卷 
    {title: i18n.t('MENU.GM_DATA_QUERY'), view: 'LightAreaQuestionData'} // 调查问卷-光明区疫情数据查询 
  ],
  // 下拉菜单
  SELECT_OPTIONS: {
    INFO_TYPE: [ // 电镀用户类型
      { value: '1', label: i18n.t('LABEL_TEXT.ELECTROPLATING_FACTORY'), dec: i18n.t('TIPS_WARNING.ELECTROPLATING_FACTORY')},
      { value: '2', label: i18n.t('LABEL_TEXT.HARDWARE_FACTORY'), dec: i18n.t('TIPS_WARNING.HARDWARE_FACTORY')},
      { value: '3', label: i18n.t('LABEL_TEXT.SUPPLIER'), dec: i18n.t('TIPS_WARNING.SUPPLIER')},
      { value: '0', label: i18n.t('LABEL_TEXT.OTHER_FACTORY'), dec: i18n.t('TIPS_WARNING.OTHER_FACTORY')}
    ],
    INDUSTRY_OPTIONS: [ // 行业类型下拉
      { value: '0', label: '农、林、牧、渔业' }, 
      { value: '1', label: '采矿业' }, 
      { value: '2', label: '制造业' }, 
      { value: '3', label: '电力、热力、燃气及水生产和供应业' },
      { value: '4', label: '建筑业' }, 
      { value: '5', label: '批发和零售业' }, 
      { value: '6', label: '交通运输、仓储和邮政业' }, 
      { value: '7', label: '住宿和餐饮业' },
      { value: '8', label: '信息传输、软件和信息技术服务业' }, 
      { value: '9', label: '金融业' }, 
      { value: '10', label: '房地产业' }, 
      { value: '11', label: '租赁和商务服务业' }, 
      { value: '12', label: '科学研究和技术服务业' },
      { value: '13', label: '水利、环境和公共设施管理业' }, 
      { value: '14', label: '居民服务、修理和其他服务业' }, 
      { value: '15', label: '教育' }, 
      { value: '16', label: '卫生和社会工作' },
      { value: '17', label: '文化、体育和娱乐业' }, 
      { value: '18', label: '公共管理、社会保障和社会组织' }, 
      { value: '19', label: '国际组织' }, 
      { value: '20', label: '其他' }
    ],
    OUTWARD_FLAG: [ // 智能跟单-设计备注字段
      { value: '1', disabled:false, label: '自制'},
      { value: '2', disabled:false, label: '外发成品'},
      { value: '3', disabled:false, label: '库存物料（成品）'},
      { value: '4', disabled:false, label: '自制+外发件'},
      { value: '5', disabled:false, label: '自制+表面处理'},
      { value: '6', disabled:false, label: '自制+外发件+表面处理'},
      { value: '7', disabled:false, label: '其它'}
    ]
  },
  // 常用 office 文件对应Content-type  [Multipurpose Internet Mail Extensions]
  MIME_TYPE: {
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    zip: 'application/zip',
  },
  // TODO 列表字段 
  BASE_LIST_FIELDS: {
    ecnCode: {name: "ecnCode", label: "订单编号", width: 100, isShow: true, sortable: true},
    dept1: {name: "dept1", label: "公司", width: 100, isShow: true, sortable: false},
    dept2: {name: "dept2", label: "部门", width: 100, isShow: true, sortable: false}
  },
  // TODO 表单字段
  BASE_FORM_FIELDS:{
    
  }
}
