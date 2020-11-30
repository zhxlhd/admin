/**
 * created by zhongxiaolong on 2019/08/19
 * 只能跟单-跟单列表
 */
import TYPES from '../mutations-types'
import SERVICES from '../../services'
import BaseConstant from '../../constant/BaseConstant'
import { SMART_ORDER_API } from '../../services/apis'

const state = {
  dict:{},
  name: 'smart_order_list',
  title: '跟单列表',
  view: 'DocumentaryList',
  addView: 'DocumentdaryListAdd',
  page: 1,
  size: 1,
  url: SMART_ORDER_API.DOCUMENTDARYLIST_QUERY,
  mate: {
    mateSearch: { // 本地配置查询配置
      multipleConditions: true, // 是否多条件查询
      fields: [
        {holder: "text", name: "soNum", label: "订单编号", lg: 4, md: 6, placeholder: "订单编号", sm: 8},
        {holder: "text", name: "customerName", label: "客户名称", lg: 4, md: 6, placeholder: "客户名称", sm: 8},
        {holder: "select", name: "statusStr", label: "状态", lg: 4, md: 6, placeholder: "请选择状态",sm: 8,options:[]},
        {holder: "datePicker", name: "fromDateStr", label: "生效日期从", lg: 4, md: 6, placeholder: "生效日期从", sm: 8},
        {holder: "datePicker", name: "toDateStr", label: "生效日期至", lg: 4, md: 6, placeholder: "生效日期至", sm: 8}
      ],
      values:{
        soNum: "",         // 订单编号
        customerName: "",  // 物料编码
        statusStr: "",     // 状态
        fromDateStr: "",   // 开始日期
        toDateStr: ""      // 结束日期
      },
      stateOptions:[ // 查询条件状态下拉
        {id: '0', label: '未启动', value: 'NOT_STARTED'},
        {id: '1', label: '进行中', value: 'STARTING'},
        {id: '2', label: '暂停', value: 'PAUSE'},
        {id: '3', label: '完成', value: 'FINISHED'},
        {id: '4', label: '转单', value: 'TRANSFER_ORDER'},
        {id: '5', label: '取消', value: 'CANCEL'}
        // {id: '6', label: '恢复', value: 'RESUME'}
      ],
    },
    mateList: {
      dataApi: '/smartOrder/all/list',
      size: 10,
      page: 1,
      total: 0,
      actions:[
        {
          action: "pause",
          urls: ["/smartOrder/pause","/smartOrder/pause","/smartOrder/pause"],
          type: ["primary","warning","success"],
          label: ["启动","暂停","恢复"],
          isApi: true,
          useId: 0,
          method: "GET",
          canDisable: true,        // 是否可以禁用
          disableKey: "closeFlag", // 禁用 key
          switchKey: "pauseFlag",  // 切换 key
          switch: true
        },
        {
          action: "transferOrder",
          url: "/smartOrder/transferOrder",
          label: "转单",
          isApi: true,
          useId: 1,
          method: "GET",
          type: "",
          canDisable: true,
          disableKey:"closeFlag"
        },
        {action: "print",
          url: "/smartOrder/toPrint",
          label: "打印",
          isApi: true,
          useId: 1,
          method: "GET",
          type: ""
        },
        {action: "details",
          url: "/smartOrder/detail",
          label: "查看",
          isApi: true,
          useId: 0,
          method: "GET",
          type: ""
        }
      ],
      btns: [
        {action: "add",label: "新增",isApi: false,useId: -1,url: SMART_ORDER_API.DOCUMENTDARYLIST_ADD,icon: "el-icon-plus"},
        {action: "update",label: "修改",isApi: false,useId: 1,isSelector: true,url: SMART_ORDER_API.DOCUMENTDARYLIST_EDIT,method: "GET",icon: "el-icon-edit"},
        {action: "delete",label: "删除",isApi: true,useId: 0,confirm: {"msg": "确定删除选中数据？"},isSelector: true,url: SMART_ORDER_API.DOCUMENTDARYLIST_DELETE,method: "GET",icon: "el-icon-delete"},
        {action: "cancel",label: "取消",isApi: true,useId: 0,confirm: {"msg": "确定取消选中数据？"},isSelector: true,url: SMART_ORDER_API.DOCUMENTDARYLIST_STATE,method: "GET",icon: "el-icon-document-delete"}
      ],
      columns: [
        {name: "soNum", label: "订单编号", width: 100, isShow: true, sortable: true},
        {name: "customerName", label: "客户名称", width: 100, isShow: true, sortable: false},
        {name: "workOrderCode", label: "工单编号", width: 100, isShow: true, sortable: true},
        {name: "materialsCode", label: "物料编码", width: 100, isShow: true, sortable: true},
        {name: "materialsName", label: "产品名称", width: 100, isShow: true, sortable: false},
        {name: "specs", label: "产品规格", width: 100, isShow: true, sortable: false},
        {name: "status", label: "状态", width: 100, isShow: false, sortable: false},
        {name: "statusStr", label: "状态", width: 100, isShow: true, sortable: false},
        {name: "applyDate", label: "申请日期", width: 100, isShow: false, sortable: true},
        {name: "applyDateStr", label: "申请日期", width: 100, isShow: true, sortable: true},
        {name: "requestDate", label: "需求日期", width: 100, isShow: false, sortable: true},
        {name: "requestDateStr", label: "需求日期", width: 100, isShow: true, sortable: true},
        {name: "quantity", label: "数量", width: 80, isShow: true, sortable: false},
        {name: "unit", label: "单位", width: 80, isShow: true, sortable: false},
        {name: "price", label: "价格", width: 100, isShow: true, sortable: false}
      ],
      rows: [
        {soNum: '阿海',customerName: '大傻子',pauseFlag: 0},
        {soNum: '跟单列表',pauseFlag: 0,closeFlag:"232"}
      ]
    },
    mateFormerHeader: {
      fields: [
        {holder: "textc", name: "soNum", label: "订单编号"},
        {holder: "textc", name: "customerName", label: "客户名称"},
        {holder: "textc", name: "workOrderCode", label: "工单编号"},
        {holder: "textc", name: "materialsCode", label: "物料编码"},
        {holder: "textc", name: "materialsName", label: "产品名称"},
        {holder: "textc", name: "specs", label: "产品规格"},
        {holder: "text", name: "applyDateStr", label: "申请日期"},
        {holder: "text", name: "requestDateStr", label: "需求日期"},
        {holder: "textc", name: "quantity", label: "数量"},
        {holder: "textc", name: "unit", label: "单位"},
        {holder: "textc", name: "price", label: "价格"}
      ],
      values: {
        soNum: '',
        customerName: '',
        workOrderCode: '',
        materialsCode: '',
        materialsName: '',
        specs: '',
        applyDateStr: '',
        requestDateStr: '',
        quantity: '',
        unit: '',
        price: ''
      }
    },
    mateListLine: {
      actions: [],
      btns: [],
      columns: [
        {name: "serialNumber", label: "序号", width: 100, isShow: true},
        {name: "taskName", label: "任务名称", width: 100, isShow: true},
        {name: "chargeName", label: "责任人", width: 100, isShow: true},
        {name: "compeleteTime ", label: "预计完成日期", width: 100, isShow: false},
        {name: "completeTimeStr ", label: "预计完成日期", width: 150, isShow: true},
        {name: "remark", label: "备注", width: 100, isShow: true}
      ],
      rows: []
    },
    mateFormerLine: {
      fields: [
        {holder: "textc", name: "serialNumber", label: "序号"},
        {holder: "textc", name: "taskName", label: "任务名称"},
        {holder: "textc", name: "chargeName", label: "责任人"},
        {holder: "textc", name: "compeleteTime", label: "预计完成日期"},
        {holder: "textc", name: "completeTimeStr", label: "预计完成日期"},
        {holder: "textc", name: "remark", label: "备注"}
      ],
      values: {}
    }
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
