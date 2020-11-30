// base api 通用api
export const BASE_API = {
  GET_DICT: '/dic/cg',
  ORG_UNIT: '/org/inventory/getOrgByOfficeId?ids=',              // 请求库存组织 orgUnit
  MATERIALS_CODE: '/materials/getMaterialByOrg',  // 获取物料编码
  ECN_LIST: '/ecn/new/list?params=disableFlag:1', // Ecn 列表
  USERS_PURCHASING_LIST: '/users/getUserDropdownList', // 采购人列表 purchasing
  QUERY: '',   // 查询接口 传 ulr进来 拼接
  DETAIL: '',  // 查看详情 传 ulr进来 拼接
  LINES: '',   // 查看详情列表行 传 ulr进来 拼接
  SELECTONE: '',   // 获取详情 头+行 传 ulr进来 拼接
  PAGING: '',  // 分页查询接口 传 ulr进来 拼接
  SAVE: '',    // 新增保存
  USERS_LIST: '/purchase/reqPurchase/getUsers', // 采购模块的用户列表
  CUSTOMER_LIST: '/companys/companyInfo/4?cols=name,id&dataOnly=true&nopaing=true', // 客户列表
  SUPPLIER_LIST: '/companys/companyInfo/3?cols=name,id&dataOnly=true&nopaing=true', // 供应商列表
  CUSTOMER_LIST_USABLE: '/companys/companyInfo/4?auditStatus=1&nopaging=1&status=1&dataOnly=true', // 获取已审批、有效的供应商 并且不分页的客户列表
  SUPPLIER_LIST_USABLE: '/companys/companyInfo/3?auditStatus=1&nopaging=1&status=1&dataOnly=true', // 获取已审批、有效的供应商 并且不分页的供应商列表
  MATERIALS_INFO_RETRIEVE: '/materials/findMaterialsInfo',         // 物料编码检索
  UPLOAD: '/zuul/api/companys/uploadDetail',                      // 上传 传 ulr进来 拼接
  UPLOAD_SUBMIT: '',                                              // 提交上传
  WAREHOUSE_LIST: '/dc/getWarehouseByOrg',                        // 仓库列表
  LOCATION_LIST: '/dc',                                           // 货位列表
  TICKET_CLASSIFICATION_LIST: '/workordercategory/queryByOrgId',  // 根据库存组织和工单类型获取工单分类 /库存组织 id/工单类型 id
  SUB_MATERIALS_LINES: '/workorder/get/lines',                    // 获取物料编码下的子行 /物料编码?productCount=
  MATERIALS_SEARCH: '/materials/subCode/search',                  // 物料搜索
  MATERIALS_CATEGORY: '/material/category/tree/list',             // 物料分类
  TECHNICAL_CODE: '/purchase/technical/solution/search/list',     // 技术方案编码
  PROVINCE_API: '/purchase/province',                             // 获取省份接口
  CITY_API: '/purchase/city/search',                              // 获取市接口
  REGION_API: '/purchase/area/search',                            // 获取区接口
  DISTRICT_API: '/purchase/street/search',                        // 获取街道接口
  GET_ORG_BY_OFFICE: '/org/inventory/getOrgByOfficeId?ids=',       // 根据机构获取库存组织
}
// 系统管理
export const SYS_API = {
  BASE_CONFIG_MAIN_LIST: '/systemparameter/all/list', // 参数设置(设置页面)
  BASE_CONFIG_SAVE: '/systemparameter/save/data',     // 参数设置 保存
}
// 生产管理
export const PRODUCTION_MANAGEMENT_API = {
  PRODUCTION_WORK_ORDER_MAIN_LIST: '/workorder/new/list',        // 生产工单(列表页面)
  PRODUCTION_WORK_ORDER_DELETE_LINE: '/workorder/delete/line',   // 生产工单 新增/编辑页删除行
  PRODUCTION_WORK_ORDER_SAVE: '/workorder/save/data',            // 生产工单 保存
  PRODUCTION_WORK_ORDER_DETAIL: '/workorder/lines',              // 生产工单 详情 （只有行没有头）
  PRODUCTION_WORK_ORDER_UPDATE: '/workorder/toEdit',             // 生产工单 修改
  PRODUCTION_WORK_ORDER_DELETE: '/workorder/delete',             // 生产工单 删除
  PRODUCTION_WORK_ORDER_STATE: '/workorder/change',              // 生产工单 状态改变
  PRODUCTION_WORK_ORDER_CHECK_CODE: '/workorder/check/exsist',   // 生产工单 加工单编号检索

  WORK_ORDER_ISSUE_MAIN_LIST: '/issuereturnorder/new/list',      // 工单发料(列表页面)
  WORK_ORDER_ISSUE_DELETE_LINE: '/issuereturnorder/delete/line', // 工单发料 新增/编辑页删除行
  WORK_ORDER_ISSUE_SAVE: '/issuereturnorder/save/data',          // 工单发料 保存
  WORK_ORDER_ISSUE_DETAIL: '/issuereturnorder/lines',            // 工单发料 详情 （只有行没有头）
  WORK_ORDER_ISSUE_UPDATE: '/issuereturnorder/toEdit',           // 工单发料 修改
  WORK_ORDER_ISSUE_DELETE: '/issuereturnorder/delete',           // 工单发料 删除
  WORK_ORDER_ISSUE_STATE: '/issuereturnorder/change',            // 工单发料 状态改变
  WORK_ORDER_ISSUE_CHECK_CODE: '/issuereturnorder/check/exsist', // 工单发料 编号检索
  WORK_ORDER_ISSUE_WORK_ORDER_INFO: '/workorder/queryWorkOrder', // 工单发料 获取工单信息

  PRODUCTS_WAREHOUSING_MAIN_LIST: '/product/inboundreturnorder/new/list',      // 产成品入库(列表页面)
  PRODUCTS_WAREHOUSING_DELETE_LINE: '/product/inboundreturnorder/delete/line', // 产成品入库 新增/编辑页删除行
  PRODUCTS_WAREHOUSING_SAVE: '/product/inboundreturnorder/save/data',          // 产成品入库 保存
  PRODUCTS_WAREHOUSING_DETAIL: '/product/inboundreturnorder/lines',            // 产成品入库 详情 （只有行没有头）
  PRODUCTS_WAREHOUSING_UPDATE: '/product/inboundreturnorder/toEdit',           // 产成品入库 修改
  PRODUCTS_WAREHOUSING_DELETE: '/product/inboundreturnorder/delete',           // 产成品入库 删除
  PRODUCTS_WAREHOUSING_STATE: '/product/inboundreturnorder/change',            // 产成品入库 状态改变
  PRODUCTS_WAREHOUSING_CHECK_CODE: '/product/inboundreturnorder/check/exsist', // 产成品入库 编号检索

  PRODUCTION_DAILY_SETTLEMENT_MAIN_LIST: '/nissannissan/new/list',                     // 日产日清(列表页面)
  PRODUCTION_DAILY_SETTLEMENT_DETAIL: '/nissannissan/lines',                           // 日产日清 详情 （只有行没有头）
  PRODUCTION_DAILY_SETTLEMENT_RECORD: '/nissannissan/material/transactions/list',      // 日产日清 领料记录
  
  PRODUCTION_PLAN_MAIN_LIST: '/productionPlan/new/list',           // 生产计划(列表页面)
  PRODUCTION_PLAN_DELETE_LINE: '/productionPlan/delete/line',      // 生产计划 新增/编辑页删除行
  PRODUCTION_PLAN_SAVE: '/productionPlan/save/data',               // 生产计划 保存
  PRODUCTION_PLAN_DETAIL: '/productionPlan/lines',                 // 生产计划 详情 请求行
  PRODUCTION_PLAN_UPDATE: '/productionPlan/toEdit',                // 生产计划 修改
  PRODUCTION_PLAN_DELETE: '/productionPlan/delete',                // 生产计划 删除
  PRODUCTION_PLAN_STATE: '/productionPlan/change',                 // 生产计划 状态改变
  PRODUCTION_PLAN_CHECK_CODE: '/productionPlan/check/exist',       // 生产计划 编号检索
}
// 生产管理 bom
export const BOM_API = {
  BOM_ADD: '/boms/toAdd',                                       // Bom新建 
  BOM_LIST: '/boms/new/list?params=latestFlag:1,disableFlag:1', // Bom 主页面列表
  BOM_SAVE: '/boms/save/bom',                                   // 提交保存
  BOM_EDIT: '/boms/toEdit',                                     // Bom修改
  BOM_DELETE: '/boms/delete?bomIds=',                           // Bom 删除
  BOM_DELETE_LINE: '/boms/delete/line?bomIds=',                 // Bom行 删除
  BOM_DETAIL:'/boms/detail',                                    // Bom详情
  BOM_VIEW:'/consumption/so/bom',                               // Bom查看
  BOM_CONSUMPTION:'/consumption/code',                          // Bom搜索
  BOM_CONSUMPTION_CALCULATE:'/consumption/boms',                // Bom计算
  BOM_CONSUMPTION_EXPORT:'/consumption/export',                 // Bom导出
  BOM_STATE:'/boms/change',                                     // Bom状态 提交审批 审批 驳回 传状态和id,驳回加传驳回原因
  ORG_UNIT: '/org/inventory/getOrgByOfficeId?ids=',              // 请求库存组织 orgUnit
  MATERIALS_CODE: '/materials/getMaterialByOrg',                // 根据库存组织取物料编码的
  CHECK_MATERIALS:'/boms/check',                                // 检测物料编码是否已被占用 后跟物料编码code
  REPLACE_MATERIALS: '/boms/reploace/detail',                   // 替换料接口 后跟当前行id
  SAVE_REPLACE_MATERIALS: '/boms/save/replaceBom',              // 替换料接口 后跟当前行id
  GET_BOM_DETAIL: '/consumption/copy',                          // 复制自  根据物料编码查BOM 进行复制
}
// 生产管理 ecn
export const ECN_API = {
  GET_BOM_LIST: '/boms/query/list',                        // 根据库存组织获取Bom列表
  GET_BOM_LINE_LIST: '/boms/query/lines',                  // 获取Bom 下行列表
  ECN_ADD: '/ecn/toAdd',                                   // Ecn新建
  ECN_LIST: '/ecn/new/list?params=disableFlag:1',          // Ecn 主页面列表
  ECN_DETAIL: '/ecn/detail',                               // Ecn 查看详情
  ECN_QUERY: '/ecn/all/list',                              // Ecn 查询和分页
  ECN_SAVE: '/ecn/save/ecn',                               // 提交保存
  ECN_EDIT: '/ecn/toEdit',                                 // Ecn 修改
  ECN_DELETE: '/ecn/delete',                               // Ecn 删除
  ECN_DELETE_LINE: '/ecn/delete/line',                     // Ecn行 删除
  ECN_STATE: '/ecn/change',                                // Ecn状态 提交审批 审批 驳回 传状态和id,驳回加传驳回原因
  ORG_UNIT: '/org/inventory/getOrgByOfficeId?ids=',         // 请求库存组织 orgUnit
  CHECK_MATERIALS: '/ecn/check',                           // 检测物料编码是否已被占用 后跟物料编码code
  REPLACE_MATERIALS: '/ecn/reploace/detail',               // 替换料接口 后跟当前行id
  SAVE_REPLACE_MATERIALS: '/ecn/save/replaceBom',          // 替换料接口 后跟当前行id
  CHECK_ECN_VERSION: '/ecn/check/version',                 // 替换料接口 后跟当前行id
}
// 智能跟单
export const SMART_ORDER_API = {
  DOCUMENTDARYLIST_MAIN_LIST: '/purchase/smartOrder/new/list',                // 跟单列表(列表页面)
  DOCUMENTDARYLIST_QUERY: '/purchase/smartOrder/all/list',                    // 查询跟单列表(搜索、分页)
  DOCUMENTDARYLIST_ADD: '/purchase/smartOrder/toAdd',                         // 跟单列表 新增 
  DOCUMENTDARYLIST_EDIT: '/purchase/smartOrder/toEdit',                       // 跟单列表 修改
  DOCUMENTDARYLIST_STATE: '/purchase/smartOrder/change',                      // 跟单列表 状态改变
  DOCUMENTDARYLIST_DETAIL: '/purchase/smartOrder/detail',                     // 跟单列表 查看详情
  DOCUMENTDARYLIST_DELETE: '/purchase/smartOrder/delete',                     // 跟单列表 删除
  DOCUMENTDARYLIST_DELETE_LINE: '/purchase/smartOrder/delete/line',           // 跟单列表 删除任务行
  DOCUMENTDARYLIST_SAVE: '/purchase/smartOrder/save/smartOrder',              // 跟单列表 提交保存
  DOCUMENTDARYLIST_LINE_LIST: '/purchase/smartOrder/lines/',                  // 跟单列表 任务行列表
  DOCUMENTDARYLIST_IMPORT_LINE: '/purchase/smartOrder/import/line',           // 跟单列表 任务行列表导入模板
  DOCUMENTDARYLIST_EXPORT_LINE: '/purchase/smartOrder/download/tpl',          // 跟单列表 任务行列表导出为模板
  SONUM_RETRIEVE: '/purchase/so/headers/findSoBySoNum',                        // 跟单列表 订单编号检索

  RECEIVE_TASK_MAIN_LIST: '/purchase/smart/order/task/list-wait',             // 待接收任务列表(列表)
  RECEIVE_TASK_QUERY: '/purchase/smart/order/task/list-wait/search',          // 待接收任务列表(搜索、分页)
  RECEIVE_TASK_EDTAIL: '/purchase/smartOrder/detail',                         // 待接收任务列表 查看详情
  RECEIVE_TASK_CANCEL: '/purchase/smart/order/task/cancel',                   // 待接收任务列表 取消任务
  RECEIVE_TASK_ACCEPT: '/purchase/smart/order/task/accept',                   // 待接收任务列表 接收任务
  RECEIVE_TASK_DISTRIBUTTION: '/purchase/smart/order/task/distribution',      // 待接收任务列表 分配任务
  
  MYTASK_MAIN_LIST: '/purchase/smart/order/task/list-my',                     // 我的任务列表
  MYTASK_QUERY: '/purchase/smart/order/task/list-my/search',                  // 我的任务列表( 搜索、分页)
  MYTASK_DETAIL: '/purchase/smart/order/task/list-all',                       // 我的任务 查看详情
  MYTASK_FINISH: '/purchase/smart/order/task/finish',                          // 我的任务 完成任务接口
  MYTASK_CANCEL: '/purchase/smart/order/task/cancel',                         // 我的任务 取消任务接口
  MYTASK_RETURNED: '/purchase/smart/order/task/returned',                     // 我的任务 退回任务节点接口
  MYTASK_TASK_NODE_LIST: '/purchase/smart/order/task/list-finish',             // 我的任务 任务节点接口
  MYTASK_FINISH_AN_JUMP: '/purchase/smart/order/task/skipTask',               // 我的任务 完成并跳过

  ORDERPROGRESS_MAIN_LIST: '/purchase/smart/order/task/progress/all/list',    // 订单进度列表
  ORDERPROGRESS_QUERY: '/purchase/smart/order/task/progress/all/list/search', // 订单进度列表(搜索、分页)
  ORDERPROGRESS_DETAIL: '/purchase/smart/order/task/progress/all/list',       // 查看详情
  
  FOLLOWUP_STATISTICS_MAIN_LIST: '/purchase/smart/order/task/list-time',      // 跟单数据统计列表
  FOLLOWUP_STATISTICS_QUERY: '/purchase/smart/order/task/list-time/search',   // 跟单数据统计列表(搜索、分页)
  FOLLOWUP_STATISTICS_EXPORT: '/purchase/smart/order/task/list-time/export',  // 导出

  CHECK_PROGRESS: '/purchase/smart/order/task/progress/list',                 // 查看进度
  DELETE_PROGRESS: '/purchase/smart/order/task/progress/delete',              // 删除进度
  ADD_PROGRESS: '/purchase/smart/order/task/progress/save',                   // 新增进度
  GET_ATTACHMNENT_LIST: '/purchase/smart/order/attachment/list',              // 获取附件列表
  UPLOADATTACHMENT: '/purchase/smart/order/attachment/upload',                // 上传附件
  DELETEATTACHMENT: '/purchase/smart/order/attachment/delete',                // 上传附件

  SMART_INVOICE_MAIN_LIST: '/purchase/smartOrderDelivery/new/list',           // 发货单(列表页面)
  SMART_INVOICE_DELETE_LINE: '/purchase/smartOrderDelivery/delete/line',      // 发货单 新增/编辑页删除行
  SMART_INVOICE_SAVE: '/purchase/smartOrderDelivery/save/data',               // 发货单 保存
  SMART_INVOICE_DETAIL: '/purchase/smartOrderDelivery/lines',                 // 发货单 详情 （只有行没有头）
  SMART_INVOICE_UPDATE: '/purchase/smartOrderDelivery/toEdit',                // 发货单 修改
  SMART_INVOICE_DELETE: '/purchase/smartOrderDelivery/delete',                // 发货单 删除
  SMART_INVOICE_STATE: '/purchase/smartOrderDelivery/change',                 // 发货单 状态改变
  SMART_INVOICE_CHECK_CODE: '/purchase/smartOrderDelivery/check/exist',       // 发货单 加工单编号检索
  SMART_INVOICE_QUERY_DOCUMENTDARYLIST: '/purchase/smartOrder/queryList',     // 发货单 查询跟单列表
}
// 报表管理
export const REPORT_FORMS_MANAGE_API = {
  SUPPLIER_CODE: '/companys/companyInfo/3?auditStatus=1&nopaging=1&status=1&dataOnly=true', // 供应商代码
}
// 受托加工
export const BE_ENTRUST_PROCESSING_API = {
  PROCESSING_ORDER_ENTRY_MAIN_LIST: '/purchase/processingorder/new/list',       // 加工单录入(列表页面)
  PROCESSING_ORDER_ENTRY_DELETE_LINE: '/purchase/processingorder/delete/line',  // 加工单录入 新增/编辑页删除行
  PROCESSING_ORDER_ENTRY_SAVE: '/purchase/processingorder/save/data',           // 加工单录入 保存
  PROCESSING_ORDER_ENTRY_DETAIL: '/purchase/processingorder/lines',             // 加工单录入 详情 （只有行没有头）
  PROCESSING_ORDER_ENTRY_UPDATE: '/purchase/processingorder/toEdit',            // 加工单录入 修改
  PROCESSING_ORDER_ENTRY_DELETE: '/purchase/processingorder/delete',            // 加工单录入 删除
  PROCESSING_ORDER_ENTRY_STATE: '/purchase/processingorder/change',             // 加工单录入 状态改变
  PROCESSING_ORDER_ENTRY_UPLOAD: '/purchase/processingorder/update/line/image', // 加工单录入 修改 上传图片
  PROCESSING_ORDER_ENTRY_CHECK_CODE: '/purchase/processingorder/check/exsist',  // 加工单录入 加工单编号检索

  PROCESSING_PLAN_ADD: '/purchase/processing/plan/save',                        // 加工计划单 新增保存
  PROCESSING_PLAN_LIST: '/purchase/processing/plan/to-list',                    // 加工计划单 列表
  PROCESSING_PLAN_DETAILS: '/purchase/processing/plan/to-save',                 // 加工计划单 查看详情
  PROCESSING_PLAN_DELETE: '/purchase/processing/plan/delete',                   // 加工计划单 删除加工计划单
  PROCESSING_PLAN_APPROVE: '/purchase/processing/plan/approval',                // 加工计划单 提交审批、审批
  PROCESSING_PLAN_PRINT: '/purchase/processing/plan/line/print',                // 加工计划单 打印
  PROCESSING_PLAN_PROCESSING_ORDER_CODE: '/purchase/processingorder/line/list', // 加工计划单 选择加工单编号
  PROCESSING_PLAN_CHECK_PLAN_CODE: '/purchase/processing/plan/checkCode',       // 加工计划单 校验计划编号是否唯一

  DELIVERY_DATA_PROCESSING_LIST: '/purchase/trustee/delivery/data/processing/to-list',             // 交货数据统计 加工计划查询
  DELIVERY_DATA_CONDITION_LIST: '/purchase/trustee/delivery/data/condition/to-list',               // 交货数据统计 交货状况分析
  DELIVERY_DATA_PROCESSING_COUNT_LIST: '/purchase/trustee/delivery/data/processing/count/to-list', // 交货数据统计 加工数量对账
  DELIVERY_DATA_LOSS_LIST: '/purchase/trustee/delivery/data/loss/to-list',                         // 交货数据统计 损耗统计
  DELIVERY_DATA_MONTH_LOSS_LIST: '/purchase/trustee/delivery/data/month/loss/to-list',             // 交货数据统计 月损耗统计
  DELIVERY_DATA_MONTH_TECHNICAL_SOLUTION_LIST: '/purchase/trustee/delivery/data/technical/solution/to-list',   // 交货数据统计 技术方案优选
  
  RECEIPT_INSPECTION_MAIN_LIST: '/purchase/receiptinspection/new/list',       // 收货检验(列表页面)
  RECEIPT_INSPECTION_QUERY: '/purchase/receiptinspection/all/list',           // 收货检验 查询
  RECEIPT_INSPECTION_SAVE: '/purchase/receiptinspection/save/data',           // 收货检验 保存
  RECEIPT_INSPECTION_DETAIL: '/purchase/receiptinspection/detail',            // 收货检验 详情 （只有头没有行）
  RECEIPT_INSPECTION_UPDATE: '/purchase/receiptinspection/toEdit',            // 收货检验 修改
  RECEIPT_INSPECTION_DELETE: '/purchase/receiptinspection/delete',            // 收货检验 删除
  RECEIPT_INSPECTION_CHECK_CODE: '/purchase/receiptinspection/check/exsist',  // 收货检验 检验单编号检索
  
  PROCESSING_RECEIPT_MAIN_LIST: '/purchase/productioninbound/new/list',       // 加工入库单(列表页面)
  PROCESSING_RECEIPT_QUERY: '/purchase/productioninbound/all/list',           // 加工入库单 查询
  PROCESSING_RECEIPT_SAVE: '/purchase/productioninbound/save/data',           // 加工入库单 保存
  PROCESSING_RECEIPT_DETAIL: '/purchase/productioninbound/detail',            // 加工入库单 详情 （只有头没有行）
  PROCESSING_RECEIPT_UPDATE: '/purchase/productioninbound/toEdit',            // 加工入库单 修改
  PROCESSING_RECEIPT_DELETE: '/purchase/productioninbound/delete',            // 加工入库单 删除
  PROCESSING_RECEIPT_CHECK_CODE: '/purchase/productioninbound/check/exsist',  // 加工入库单 入库单编号检索
  
  DELIVERY_ORDER_MAIN_LIST: '/purchase/deliveryorder/new/list',               // 交货单(列表页面)
  DELIVERY_ORDER_DELETE_LINE: '/purchase/deliveryorder/delete/line',          // 交货单 新增页面删除行
  DELIVERY_ORDER_QUERY: '/purchase/deliveryorder/all/list',                   // 交货单 查询
  DELIVERY_ORDER_SAVE: '/purchase/deliveryorder/save/data',                   // 交货单 保存
  DELIVERY_ORDER_DETAIL: '/purchase/deliveryorder/detail',                    // 交货单 详情 （只有头没有行）
  DELIVERY_ORDER_UPDATE: '/purchase/deliveryorder/toEdit',                    // 交货单 修改
  DELIVERY_ORDER_DELETE: '/purchase/deliveryorder/delete',                    // 交货单 删除
  DELIVERY_ORDER_PRINT: '/purchase/deliveryorder/print',                      // 交货单 打印标签
  DELIVERY_ORDER_CHECK_CODE: '/purchase/deliveryorder/check/exsist',          // 交货单 交货单编号检索

  RETURN_ORDER_MAIN_LIST: '/purchase/returnorder/new/list',                   // 退货单(列表页面)
  RETURN_ORDER_QUERY: '/purchase/returnorder/all/list',                       // 退货单 查询
  RETURN_ORDER_SAVE: '/purchase/returnorder/save/data',                       // 退货单 保存
  RETURN_ORDER_UPDATE: '/purchase/returnorder/toEdit',                        // 退货单 修改
  RETURN_ORDER_DELETE: '/purchase/returnorder/delete',                        // 退货单 删除
  RETURN_ORDER_CHECK_CODE: '/purchase/returnorder/check/exsist',              // 退货单 退货单编号检索

  TECHNOLOGY_PLAN_MANAGE_LIST: '/purchase/technical/solution/to-list',         //技术方案管理(列表页面)
  TECHNOLOGY_PLAN_MANAGE_CODE_CHECK: '/purchase/technical/solution/check',     //技术方案管理新增页  校验技术方案编码唯一
  TECHNOLOGY_PLAN_MANAGE_DELETE: '/purchase/technical/solution/delete',        //技术方案管理  删除
}
// 委托加工
export const ENTRUST_PROCESSING_API = {
  DELIVERY_DATA_PROCESSING_LIST: '/purchase/entrust/delivery/data/processing/to-list',             // 交货数据统计 生产计划查询
  DELIVERY_DATA_CONDITION_LIST: '/purchase/entrust/delivery/data/condition/to-list',               // 交货数据统计 交货状况分析
  DELIVERY_DATA_PROCESSING_COUNT_LIST: '/purchase/entrust/delivery/data/processing/count/to-list', // 交货数据统计 加工数量对账
  DELIVERY_DATA_LOSS_LIST: '/purchase/entrust/delivery/data/loss/to-list',                         // 交货数据统计 损耗统计
  DELIVERY_DATA_MONTH_LOSS_LIST: '/purchase/entrust/delivery/data/month/loss/to-list',             // 交货数据统计 月损耗统计

  OUTSOURCING_PROCESSING_ORDER_MAIN_LIST: '/purchase/principal/processingorder/new/list',          // 外协加工单(列表页面)
  OUTSOURCING_PROCESSING_ORDER_QUERY: '/purchase/principal/processingorder/all/list',              // 外协加工单 查询
  OUTSOURCING_PROCESSING_ORDER_SAVE: '/purchase/principal/processingorder/save/data',              // 外协加工单 保存
  OUTSOURCING_PROCESSING_ORDER_DETAIL: '/purchase/principal/processingorder/detail',               // 外协加工单 详情 （只有头没有行）
  OUTSOURCING_PROCESSING_ORDER_UPDATE: '/purchase/principal/processingorder/toEdit',               // 外协加工单 修改
  OUTSOURCING_PROCESSING_ORDER_DELETE: '/purchase/principal/processingorder/delete',               // 外协加工单 删除
}

// 基础数据
export const BASIC_DATA_API = {
  GET_ORG_MENU_NODE: '/platformorganization/subOrg/list',                        // 组织架构 架构节点 左侧导航菜单 treeNode
  FILTER_ORG_MEMBER: '/platformorganization/subOrg/search',                      // 组织架构 搜索架构人员
  GET_ORG_MENU: '/platformorganization/subOrg/list/all',                         // 组织架构 左侧导航菜单 tree
  GET_DEPT_SELECT: '/platformorganization/subOrg/list/select',                   // 组织架构 部门联级菜单
  GET_MEMBER_LIST: '/platformorganization/orgEmp/list',                          // 组织架构 获取部门下人员列表
  SET_MEMBER_INFO: '/platformemployee/save/data',                                // 组织架构 保存人员信息
  GET_MEMBER_INFO: '/platformemployee/detail',                                   // 组织架构 获取人员信息
  DEL_MEMBER_INFO: '/platformemployee/delete',                                   // 组织架构 删除人员
  REMOVE_MEMBERS: '/platformorganization/remove/from/org',                       // 组织架构 部门移除人员
  GET_DEPT_INFO: '/platformorganization/detail',                                 // 组织架构 获取部门详情
  UPDATE_DEPT_INFO: '/platformorganization/save/data',                           // 组织架构 新增/修改部门信息
  DEL_DEPT_INFO: '/platformorganization/delete',                                 // 组织架构 删除部门信息
  GET_ROLE_LIST: '/platformrole/tree/list/select',                               // 组织架构 获取角色列表
  SET_MEMBER_COUNT: 'platformorganization/query/chains',                         // 组织架构 刷新 tree 人数
  GET_ROLE_MENU: '/platformrole/tree/list',                                      // 架构角色 左侧导航菜单 tree
  SET_ROLE_GROUP: '/platformrolegroup/save/data',                                // 架构角色 保存角色组
  GET_ROLE_GROUP_INFO: '/platformrolegroup/detail',                              // 架构角色 获取角色组信息
  DEL_ROLE_GROUP: '/platformrolegroup/delete',                                   // 架构角色 删除角色组
  GET_ROLE_GROUP_LIST: '/platformrolegroup/query/list',                          // 架构角色 获取角色组列表
  SET_ROLE: '/platformrole/save/data',                                           // 架构角色 保存角色
  GET_ROLE_INFO: '/platformrole/detail',                                         // 架构角色 获取角色信息
  DEL_ROLE_INFO: '/platformrole/delete',                                         // 架构角色 删除角色
  GET_ROLE_MEMBER_LIST: '/platformrole/roleEmp/list',                            // 架构角色 获取角色下成员列表
  REMOVE_ROLE_MEMBER: '/platformrole/empRole/delete',                            // 架构角色 删除角色下成员列表
  GET_ROLE_MEMBER: '/platformemployee/empList',                                  // 架构角色 获取添加成员列表 查询/分页（添加成员按钮）
  SET_ROLE_MEMBER: '/platformrole/add/member',                                   // 架构角色 保存角色下成员
  TREE_SORT: '/platformrole/drag/order',                                         // 架构角色 左侧树拖拽排序

  TICKET_CLASSIFICATION_MAIN_LIST: '/workordercategory/new/list',                // 工单分类(列表页面)
  TICKET_CLASSIFICATION_QUERY: '/workordercategory/all/list',                    // 工单分类 查询
  TICKET_CLASSIFICATION_SAVE: '/workordercategory/save/data',                    // 工单分类 保存
  TICKET_CLASSIFICATION_UPDATE: '/workordercategory/toEdit',                     // 工单分类 修改
  TICKET_CLASSIFICATION_DELETE: '/workordercategory/delete',                     // 工单分类 删除
  TICKET_CLASSIFICATION_STATE: '/workordercategory/change',                      // 工单分类 状态改变

  /**销售订单分类 */
  SALE_ORDER_CATEGORY_LIST: '/purchase/sale/order/category/to-list',             // 销售订单分类（列表页面）
  SALE_ORDER_CATEGORY_SAVE: '/purchase/sale/order/category/save',                // 销售订单分类 保存
  SALE_ORDER_CATEGORY_DELETE: '/purchase/sale/order/category/delete',            // 销售订单分类 删除

  /**币种管理 */
  CURRENCY_MANAGEMENT_LIST: '/currency/new/to-list',                             // 币种管理（列表界面）
  CURRENCY_MANAGEMENT_SAVE: '/currency/new/save',                                // 币种管理 保存

  /**汇率管理 */
  EXCHANGE_RATE_LIST: '/exchange/rate/to-list',                                  // 汇率管理（列表界面）
  EXCHANGE_RATE_SAVE: '/exchange/rate/save',                                     // 汇率管理 保存
  EXCHANGE_RATE_DELETE: '/exchange/rate/delete',                                 // 汇率管理 删除
  GET_CURRENCY_DATA: '/currency/new/down',                                       // 获取币种
  GET_FOREIGN_CURRENCY_DATA: '/currency/new/down',                               // 获取外币
}

// 物流基础数据
export const LOGISTIC_BASIC_DATA_API = {
  WAREHOUSE_LIST: '/purchase/warehouse/to-list',                                   // 仓库信息(列表页面)
  ORG_LIST: '/users/office',                                                       // 所属机构
  WAREHOUSE_CHECK_CODE: '/purchase/warehouse/checkCode',                           // 仓库代码是否唯一
  WAREHOUSE_DETAIL: '/purchase/warehouse/to-save',                                 // 仓库信息详情页
  WAREHOUSE_DELETE: '/purchase/warehouse/delete',                                  // 删除仓库信息

  STATION_LIST: '/purchase/station/to-list',                                       // 物流站点(列表页面)
  STATION_CHECK_CODE: '/purchase/station/checkName',                               // 物流站点 站点名称是否唯一
  STATION_DETAIL: '/purchase/station/to-save',                                     // 物流站点详情页
  STATION_DELETE: '/purchase/station/delete',                                      // 删除物流站点

  LOGISTICS_PROVIDERS_INFO_LIST: '/purchase/logistics/provider/to-list',           // 物流商信息(列表页面)
  LOGISTICS_PROVIDERS_INFO_DELETE: '/purchase/logistics/provider/delete',          // 删除物流商信息
  LOGISTICS_PROVIDERS_INFO_ATTACHMENT_LIST: '/purchase/attachment/list/logistics_provider',          // 物流商信息(列表页面) 获取附件列表
  LOGISTICS_PROVIDERS_INFO_ATTACHMENT_DELETE: '/purchase/attachment/delete',          // 物流商信息(列表页面)-附件弹窗 删除附件
  LOGISTICS_PROVIDERS_INFO_ATTACHMENT_UPLOAD: '/purchase/attachment/upload',          // 物流商信息(列表页面)-附件弹窗 添加附件

  LOGISTICS_PROVIDERS_INFO_GET_LIST: '/purchase/logistics/provider/get-list',         // 物流供应商备案信息-新增页 获取物流商
  REGISTRATION_INFO_LIST: '/purchase/registration/to-list',                           // 物流供应商备案信息(列表页面)
  REGISTRATION_INFO_DELETE: '/purchase/registration/delete',                          // 删除物流供应商备案信息
  REGISTRATION_INFO_ATTACHMENT_LIST: '/purchase/attachment/list/registration',        // 物流供应商备案信息(列表页面) 获取附件列表
  REGISTRATION_CONSIGNEE_LIST: '/purchase/registration/consignee/to-list',            // 物流供应商备案信息-提货人备案
  REGISTRATION_CONSIGNEE_ATTACHMENT_LIST: '/purchase/attachment/list/registration_consignee',  // 物流供应商备案信息-提货人备案 获取附件列表
  REGISTRATION_CONSIGNEE_DELETE: '/purchase/registration/consignee/delete',                    // 删除物流供应商备案信息-提货人备案
  REGISTRATION_CONSIGNEE_LOSE_EFFECT: '/purchase/registration/consignee/enableOrInvalid',      // 物流供应商备案信息-提货人备案 失效
  REGISTRATION_CONSIGNEE_APPROVE: '/purchase/registration/consignee/approval',                 // 物流供应商备案信息-提货人备案 提交审批、审批、驳回
  REGISTRATION_VEHICLE_LIST: '/purchase/registration/vehicle/to-list',                // 物流供应商备案信息-车辆备案
  REGISTRATION_VEHICLE_ATTACHMENT_LIST: '/purchase/attachment/list/registration_vehicle',  // 物流供应商备案信息-车辆备案 获取附件列表
  REGISTRATION_VEHICLE_LOSE_EFFECT: '/purchase/registration/vehicle/enableOrInvalid',      // 物流供应商备案信息-车辆备案 失效
  REGISTRATION_VEHICLE_APPROVE: '/purchase/registration/vehicle/approval',                 // 物流供应商备案信息-车辆备案 提交审批、审批、驳回
  REGISTRATION_VEHICLE_DELETE: '/purchase/registration/vehicle/delete',                    // 删除物流供应商备案信息-车辆
  REGISTRATION_VEHICLE_CHECK: '/purchase/registration/vehicle/checkCode',                  // 物流供应商备案信息-车辆备案 校验大陆车牌在同一物流供应商备案信息id是否唯一
  REGISTRATION_CONSIGNEE_CHECK_IDCARD: '/purchase/registration/consignee/checkCode',       // 物流供应商备案信息-提货人备案 校验身份证在同一物流供应商备案信息id是否唯一

  LOGISTICS_ROUTE_LIST: '/purchase/logistics/route/to-list',                               // 物流线路管理-物流线路维护
  LOGISTICS_ROUTE_CHECK_CODE: '/purchase/logistics/route/checkCode',                       // 物流线路管理-物流线路维护 线路编号是否唯一
  LOGISTICS_ROUTE_SEARCH_STATION_LIST: '/purchase/station/search/list',                    // 物流线路管理-物流线路维护 起点、终点站点下拉列表
  LOGISTICS_ROUTE_DETAILS: '/purchase/logistics/route/to-save',                            // 物流线路管理-物流线路维护 查看详情
  LOGISTICS_ROUTE_DELETE: '/purchase/logistics/route/delete',                              // 物流线路管理-物流线路维护 删除物流线路

  LOGISTICS_ROUTE_PRICE_LIST: '/purchase/logistics/route/price/to-list',                          // 物流线路管理-物流线路定价 列表页
  LOGISTICS_ROUTE_PRICE_SEARCH_ROUTE_LIST: '/purchase/logistics/route/tenant',                    // 物流线路管理-物流线路定价 定价下拉列表
  LOGISTICS_ROUTE_PRICE_DELETE: '/purchase/logistics/route/price/delete',                         // 删除物流线路管理-物流线路定价
  LOGISTICS_ROUTE_PRICE_APPROVE: '/purchase/logistics/route/price/approval',                      // 物流线路管理-物流线路定价 提交审批、审批、驳回
  LOGISTICS_ROUTE_PRICE_DETAILS: '/purchase/logistics/route/price/to-save',                       // 物流线路管理-物流线路定价 查看详情
  LOGISTICS_ROUTE_PRICE_ATTACHMENT_LIST: '/purchase/attachment/list/logistics_route_price',       // 物流线路管理-物流线路定价(列表页面) 获取附件列表
  LOGISTICS_ROUTE_PRICE_CHECK_CODE: '/purchase/logistics/route/price/check',                      // 物流线路管理-物流线路定价(新增页) 同一线路+物流商应校验唯一
  LOGISTICS_PROVIDERS_INFO_GET_LIST_TYPE: '/purchase/logistics/provider/get-list?searchType=1',   // 物流线路管理-物流线路定价(新增页) 获取物流商(不做筛选)
}

// 物流订单
export const LOGISTICS_ORDER_API = {
  /** 提货单 */
  LOGISTICS_DELIVERY_ORDER_LIST: '/purchase/lading/bill/to-list',            // 提货单（列表页面）
  LOGISTICS_DELIVERY_ORDER_FORM_SAVE: '/purchase/lading/bill/batch-save',    // 提货单 保存
  LOGISTICS_DELIVERY_ORDER_UPDATE: '/purchase/lading/bill/batch-update',     // 提货单 修改
  BUSINESS_ENTITY: '/offices/current/offices',                                 // 业务实体  
  DELETE_LOGISTICS_DELIVERY_ORDER: '/purchase/lading/bill/batch/del',        // 提货单列表删除
  LOGISTICS_DELIVERY_ORDER_DETAIL: '/purchase/lading/bill/to-save',          // 提货单 详情
  LODISTICS_LINES: '/purchase/logistics/route/price/down',                   // 物流线路
  LOGISTICS_PROVIDER: '/purchase/logistics/provider/by',                     // 物流商
  DELIVERY_WAREHOUSE: '/purchase/warehouse/by',                              // 出货仓库
  RECEIVE_COMPANY: '/purchase/receiving/address/search',                     // 收货公司
  SO_DELIVERY_LINE_LIST: '/purchase/lading/bill/getShipData/list',           // 获取销售订单出货行
  GET_CUSTOMER_CODE: '/companys/companyInfo/4?dataOnly=true&nopaing=true',   // 获取客户编码
  GET_ORDER_NUM: '/purchase/so/headers/all/list?dataOnly=true',              // 获取订单编号
  GET_ORG_NAME: '/org/inventory/all?dataOnly=true',                          // 获取库存组织
  LOGISTICS_DELIVERY_ORDER_APPROVAL: '/purchase/lading/bill/handle',         // 提货单（列表页面）提交审批、审批通过、废弃

  /** 司机信息 */
  DRIVER_INFO_LIST: '/purchase/driver/info/to-list',                         // 司机资料维护（列表页面)
  DRIVER_INFO_DETAIL_LIST: '/purchase/driver/info/line/all',                 // 司机资料维护（列表页面）明细行列表
  CHECK_DRIVER_INFO: '/purchase/driver/info/exist',                          // 判断司机资料是否已存在
  DRIVER_INFO_FORM_SAVE: '/purchase/driver/info/save',                       // 司机资料 保存
  DRIVER_INFO_DETAIL: '/purchase/driver/info/info',                          // 司机资料 详情
  DELETE_DRIVER_INFO: '/purchase/driver/info/delete',                        // 司机资料 删除
  DRIVER_INFO_ATTACHMENT_LIST: '/purchase/attachment/list/driver_info',      // 司机资料附加列表
  ATTACHMENT_UPLOAD: '/purchase/attachment/upload',                          // 添加附件
  ATTACHMENT_DELETE: '/purchase/attachment/delete',                          // 删除附件
  DRIVER_INFO_APPROVAL: '/purchase/driver/info/handle',                      // 司机资料 提交审批、审批通过、审批驳回
  PLATE_NUMBER: '/purchase/registration/vehicle/down',                       // 获取大陆车牌
  DRIVER_NAME: '/purchase/registration/consignee/down',                      // 获取司机姓名

  /** 货物追踪查询 */
  CARGO_TRACKING_QUERY_LIST: '/purchase/cargo/tracking/to-list/0',           // 货物追踪查询（列表页面）
  CARGO_TRACKING_SIGNIN_LIST: '/purchase/cargo/tracking/to-list/1',          // 货物追踪签到（列表页面）
  CARGO_TRACKING_DETAIL_LIST: '/purchase/cargo/tracking/line/all',           // 货物追踪查询（列表页面）明细行列表
  CARGO_TRACKING_CHANGE_STATUS: '/purchase/tracking/site/sign',              // 货物跟踪站点状态更新（未到厂、未出发、途中、到达目的地、已经签收）
  CARGO_TRACKING_ATTACHMENT_LIST: '/purchase/attachment/list/cargo_tracking_site',       // 货物追踪查询明细行查看附件
  CARGO_TRACKING_ATTACHMENT_UPLOAD: '/purchase/attachment/upload',           // 货物追踪查询明细行上传

  /** 实报实销管理 */
  COMPLETE_REIMBURSEMENT_LIST: '/purchase/reimbursement/to-list',             // 实报实销管理（列表界面）
  COMPLETE_REIMBURSEMENT_DETAIL_LIST: '/purchase/reimbursement/line/all',     // 实报实销管理（列表界面）明细行列表
  COMPLETE_REIMBURSEMENT_LIST_DELETE: '/purchase/reimbursement/batch/del',    // 实报实销管理（列表界面）删除
  COMPLETE_REIMBURSEMENT_FORM_SUBMIT: '/purchase/reimbursement/save',         // 实报实销表单提交
  COMPLETE_REIMBURSEMENT_ATTACHMENT_LIST: '/purchase/attachment/list/logistics_reimbursement',      // 实报实销费用附加列表
  REIMBURSEMENT_SHIPPING_APPROVAL: '/purchase/reimbursement/shipping/status',  // 审批船务费用
  REIMBURSEMENT_LOGISTICS_APPROVAL: '/purchase/reimbursement/logistics/status',// 审批物流费用
  CHECK_REIMBURSEMENT_LOGISTICS: '/purchase/reimbursement/exist',              // 判断实报实销是否已存在

  /** 物流费用报表 */
  LOGISTICS_FEES_LIST: '/purchase/lading/bill/cost-list',                      // 物流费用（列表界面）
  LOGISTICS_FEES_DETAIL: '/purchase/lading/bill/cost/detail',                  // 查看物流费用详情

  /** 客户收货地址 */
  CUSTOMER_RECEICE_ADDRESS_LIST: '/purchase/receiving/address/to-list',        // 客户收货地址（列表界面）
  CUSTOMER_RECEICE_ADDRESS_LIST_DELETE: '/purchase/receiving/address/delete',  // 客户收货地址（列表界面）删除
  CUSTOMER_RECEICE_ADDRESS_SAVE: '/purchase/receiving/address/save',           // 客户收货地址新增/修改 保存
  CUSTOMER_RECEICE_DETAIL: '/purchase/receiving/address/to-save',              // 客户收货地址（列表界面 查看
  OFFICE_NAME: '/offices/current/offices',                                       // 获取机构
  CUSTOMER_NAME: '/companys/down/4',                                           // 获取客户名称

  /** 提货人管理 */
  CONSIGNEE_MANAGEMENT_LIST: '/purchase/logistics/consignee/to-list',          // 提货人管理（列表界面）
  CONSIGNEE_MANAGEMENT_LIST_DELETE: '/purchase/logistics/consignee/delete',    // 提货人管理（列表界面）删除
  CONSIGNEE_ATTACHMENT_LIST: '/purchase/attachment/list/logistics_consignee',  // 提货人管理附加列表
  CHECK_CONSIGNEE_IDCARD: '/purchase/logistics/consignee/check',               // 校验身份证号码唯一
  GET_LOGISTICS_RECORDS_LIST: '/purchase/logistics/consignee/import/list',     // 获取物流商备案列表
  CREATE_CONSIGNEE_RECORDS: '/purchase/logistics/consignee/generate',          // 生成提货人备案

  /** 车辆管理 */
  VEHICLE_MANAGEMENT_LIST: '/purchase/logistics/vehicle/to-list',              // 车辆管理（列表界面）
  VEHICLE_MANAGEMENT_LIST_DELETE: '/purchase/logistics/vehicle/delete',        // 车辆管理（列表界面）删除
  VEHICLE_ATTACHMENT_LIST: '/purchase/attachment/list/logistics_vehicle',      // 车辆管理附加列表
  CHECK_VEHICLE_CARPLATES: '/purchase/logistics/vehicle/check',                // 校验大陆车牌唯一
  CREATE_VEHICLE_RECORDS: '/purchase/logistics/vehicle/generate',              // 生成车辆备案
}

// 合同管理
export const CONTRACT_MANAGE_API = {
  CONTRACT_MANAGE_ATTACHMENT_UPDATE: '/purchase/attachment/upload',                       // (列表页面)-附件弹窗 添加附件
  CONTRACT_MANAGE_ATTACHMENT_DELETE: '/purchase/attachment/delete',                       // (列表页面)-附件弹窗 删除附件
  CONTRACT_MANAGE_ATTACHMENT_UPLOAD: '/purchase/attachment/upload',                       // (列表页面)-附件弹窗 添加附件
  /** 基础数据-合同类型 */
  CONTRACT_TYPE_LIST: '/purchase/contract/type/to-list',                                  // 列表页
  CONTRACT_TYPE_CHECK_CODE: '/purchase/contract/type/checkCode',                          // 新增页 校验合同类型编码唯一
  CONTRACT_TYPE_DELETE: '/purchase/contract/type/delete',                                 // 删除
  CONTRACT_TYPE_LOSE_EFFICACY:'/purchase/contract/type/enable',                           // 失效
  
  /** 基础数据-项目管理 */
  PROJECT_MANAGE_LIST: '/purchase/project/to-list',                                       // 列表页
  PROJECT_MANAGE_CHECK_CODE: '/purchase/project/checkCode',                               // 新增页 校验项目编码唯一
  PROJECT_MANAGE_DELETE: '/purchase/project/delete',                                      // 删除

  /** 合同管理-合同模板起草 */
  CONTRACT_TEMPLATE_DRAFT_LIST: '/purchase/contract/template/draft/to-list',             // 列表页
  CONTRACT_TEMPLATE_DRAFT_TYPE_LIST: '/purchase/contract/type/search-list',              // 新增页、列表页 合同类型下拉列表
  CONTRACT_TEMPLATE_DRAFT_CHECK_CODE: '/purchase/contract/template/checkCode',           // 新增页 校验合同模板编码唯一
  CONTRACT_TEMPLATE_DRAFT_ATTACHMENT_LIST: '/purchase/attachment/list/contract_template_draft',       // 列表页面 获取附件列表
  CONTRACT_TEMPLATE_DRAFT_DELETE: '/purchase/contract/template/delete',                               // 删除
  CONTRACT_TEMPLATE_DRAFT_APPROVE: '/purchase/contract/template/approval',                              // 提交审批

  /** 合同管理-合同模板起草 */
  CONTRACT_TEMPLATE_RECORD_LIST: '/purchase/approval/record/list',                                 // 获取审批记录

  /** 合同管理-合同起草 */
  CONTRACT_DRAFT_LIST: '/purchase/contract/draft/to-list',                               // 列表页
  CONTRACT_DRAFT_CHECK_CODE: '/purchase/contract/checkCode',                             // 新增页 校验合同编码唯一
  CONTRACT_DRAFT_PROJECT_LIST: '/purchase/project/search-list',                          // 新增页、列表页 项目名称下拉列表
  CONTRACT_DRAFT_DELETE: '/purchase/contract/delete',                                    // 删除
  CONTRACT_DRAFT_APPROVE: '/purchase/contract/approval',                                 // 提交审批
  CONTRACT_DRAFT_ATTACHMENT_LIST: '/purchase/attachment/list/contract_draft',            // 列表页面 获取附件列表

  /** 合同管理-合同变更申请*/
  CONTRACT_CHANGE_APPLY_LIST: '/purchase/contract/change/to-list',           // 合同变更申请（列表页面）
  CONTRACT_CHANGE_APPLY_DELETE: '/purchase/contract/change/delete',          // 合同变更申请 删除
  CONTRACT_CHANGE_APPLY_ATTACHMENT_LIST: '/purchase/attachment/list/contract_change', // 列表页面 获取附件列表
  FETCH_CONTRACT_DATA: '/purchase/contract/by-code',                         // 根据合同编号获取合同数据
  CONTRACT_CHANGE_SUBMIT_APPROVAL: '/purchase/contract/change/handle/1',     // 合同变更申请 提交审批

  /** 合同管理-合同变更审批  */
  CONTRACT_CHANGE_APPROVAL_LIST: '/purchase/contract/change/approval-list',  // 合同变更审批（列表页面）
  CONTRACT_CHANGE_APPROVAL: '/purchase/contract/change/approval',            // 合同变更审批

  /** 合同管理-合同归档  */
  CONTRACT_ARCHIVED_ARCHIVED: '/purchase/contract/archived',                // 归档/取消归档
}

// 采购管理
export const PURCHASING_MANAGEMENT_API = {
  PURCHASE_REQUISITIONS_EXPORT: '/purchase/reqPurchase/download/tpl', // 请购单 导出行模板
  PURCHASE_REQUISITIONS_IMPORT: '/purchase/reqPurchase/import/line', // 请购单 导入行数据
  GOODS_PRICE_EXPORT: '/purchase/goods/pricing/download/tpl', // 采购定价 导出行模板
  GOODS_PRICE_IMPORT: '/purchase/goods/pricing/import/line',           // 采购定价 导入行数据

  /**采购订单 */
  ATTACHMENT_UPLOAD: '/purchase/attachment/upload',                          // 添加附件
  ATTACHMENT_DELETE: '/purchase/attachment/delete',                          // 删除附件
  PURCHASE_ORDER_ATTACHMENT_LIST: '/purchase/attachment/list/purchase_order',// 采购订单 获取附件列表
}


// 销售管理
export const SALE_MANAGE_API = {
  /**销售订单 */
  ATTACHMENT_UPLOAD: '/purchase/attachment/upload',                          // 添加附件
  ATTACHMENT_DELETE: '/purchase/attachment/delete',                          // 删除附件
  SALE_ORDER_ATTACHMENT_LIST: '/purchase/attachment/list/so_header',         // 销售订单 获取附件列表

  /**套料物料需求 */
  NESTING_MATERIAL_DEMAND_LIST: '/purchase/casing/materials/demand/to-list',          // 套料物料需求（列表界面）
  NESTING_MATERIAL_DEMAND_DETAIL_LIST: '/purchase/casing/materials/demand/casing',    // 套料物料需求（列表界面）明细行列表
  NESTING_MATERIAL_DEMAND_ADD: '/purchase/casing/materials/demand/line',              // 套料物料需求 新增
  GENERATE_MATERIAL_DEMAND: '/purchase/casing/materials/demand/gen',                  // 生成物料需求
  NESTING_MATERIAL_DEMAND_DELETE: '/purchase/casing/materials/demand/delete',         // 删除物料需求
  CHECK_MATERIAL_STOCK: '/purchase/casing/materials/demand/inventory',                // 检查物料库存
  VERIFY_GENERATE_MATERIAL_DEMAND: '/purchase/casing/materials/demand/isExist',       // 校验是否已经生成套料需求行
  NESTING_MATERIAL_DEMAND_FORM_SAVE: '/purchase/casing/materials/demand/save',        // 套料物料需求 新增保存
  NESTING_MATERIAL_DEMAND_LINE_EDIT: '/purchase/casing/materials/demand/info',        // 套料物料需求明细行 修改
  NESTING_MATERIAL_DEMAND_LINE_DELETE: '/purchase/casing/materials/demand/batchdel',  // 套料物料需求明细行 删除
  
}

// 电镀门户
export const ELECTROPLATING_PORTAL_API = {
  /**租户信息 */
  TENANT_INFO: '/tenants/tenantInfo',                      // 当前用户信息
  /**征信评级 */
  PARK_LIST: '/dic/query/electroplate/park',               // 园区/片区下拉列表/**征信评级 */
  UPDATE_CREDIT_RATE: '/electro/tenants/credit/update',    // 修改征信评级
  PERFECT_INFO: '/companys/perfectInfo',                    //当前登录用户公司信息 
}

// 供应商门户
export const SUPPLIER_PORTAL_API = {
  /**可发运po列表 */
  GET_CUSTOMER_NAME: '/supplier-portal/asn/getCustomerList',        // 获取客户名称
}

// 吉海湾库存管理
export const JHW_INVENTORY_MANAGEMENT_API = {
  /** 入库&&收货确认 */
  GET_STOCK_LIST_DATA: '/agriculture/receipt/queryHeadAndLineAll',                 // 获取入库列表数据
  GET_STOCK_LINE_LIST_DATA: '/agriculture/receipt/queryByReceiptLine',  // 获取入库列表明细行数据
  STOCK_FORM_SAVE: '/agriculture/receipt/insertReceiptHeadAndLine',     // 入库表单 保存
  RECEIPT_CONFIRMATION_LIST: '/agriculture/outboundController/queryOutboundByQueryLine',  // 收货确认列表数据
  GET_WAREHOUSE_DATA: '/agriculture/product/warehouse/getwarehouse',    // 获取客户对应仓库
  PRESERVATION: '/agriculture/receipt/receiptConfirmation',   // 收货确认
  SINCE_RECEIPT_CONFIRMATION_LIST: '/agriculture/purchaseOrder/queryZcReceipt',  // 收货确认自采列表数据
  SINCE_PRESERVATION: '/agriculture/receipt/ZCreceiptConfirmation',   // 收货确认（自采）

   /** 出库 */
   GET_ISSUE_LIST_DATA: '/agriculture/outboundController/list',                 // 获取出库列表数据
   GET_ISSUE_LINE_LIST_DATA: '/agriculture/outboundController/queryOutboundByLine',  // 获取出库列表明细行数据
   ISSUE_FORM_SAVE: '/agriculture/outboundController/insertOne',                // 出库表单 保存
   SEND_APPROVAL: '/agriculture/outboundController/submitCensorship',          // 出货单 送审
   GET_AVERAGE_COST: '/agriculture/outboundController/getCommodityAverage',    // 获取加权平均单价
   UPDATE_LIST_LINE: '/agriculture/outboundController/updateOutBoundLogisticsNo',         // 维护收货确认列表字段数据
   BATCH_OUTBOUND: '/agriculture/outboundController/queryOutboundByWarehouse',     // 批量出库

   /** 库存台账 */
   GET_INVEMTORY_ACCOUNT_DATA: '/agriculture/inventoryAccountController/list',  // 获取列表数据（搜索/分页）
}

// 吉海湾商品管理
export const JHW_GOODS_MANAGEMENT_API = {
  /** 商品列表 */
  GET_GOODS_LIST_DATA: '/agriculture/product/list',                 // 获取商品列表数据
  SAVE_GOODS: '/agriculture/product/insertOne',  // 保存商品
  UOPATE_GOODS: '/agriculture/product/updateOne',//更新商品
  GET_GOODS_DATA: '/agriculture/product/selectOne', // 获取商品

  /**商品编码对照表 */
  SAVE_GOODS_CONTRAST:'/purchase/smItemCross/batchSave', //保存
  UPDATE_GOODS_CONTRAST: '/purchase/smItemCross/batchUpdate/', // 更新
  CHECKOUT_GOODS_CONTRAST: '/agriculture/product/checkSmItemCross', //校验
  /**商品定价 */
  GET_GOODS_PRICE: '',
  SAVE_GOODS_PRICE: '/agriculture/product/setPrice', // 保存商品定价
  SAVE_GOODS_OFFER: '/agriculture/product/quotePrice', //保存商品报价
  GET_OWN_COMPANYINFO: '/companys/getCompanyDetail', // 获取当前用户信息
  GET_ISPRICE_GOOD: '', //获取已经定价的商品
  GET_PRICE_GOOD: '/agriculture/product/getHistoryPrice', //根据商品id获取历史定价
  GET_OFFER_PRICE: '/agriculture/product/quotePrice/selectOne', // 根据报价单号 获取报价详情
  GET_CUSTOMER_OFFER_DETAIL: '/agriculture/product/customer/getQuotePriceDetails', //客户查看报价

  /**在线购买 */
  GET_ONLINE: '/agriculture/customerPurchase/productList',//获取在线购买商品列表
  GET_GOODS_DETAIL: '/agriculture/customerPurchase/productDetails',// 获取商品信息
  SEARCH_GOODS: '', //搜索商品信息
  ADD_SHOPPING_CAR: '/agriculture/customerPurchase/shoppingCar/add', //加入购物车
  MY_CAR:'/agriculture/customerPurchase/shoppingCar/list', // 我的购物车
  UPDATE_SHOPING_CAR: '/agriculture/customerPurchase/shoppingCar/update', //更新购物车商品数量
  GET_ALL_COUNT: '/agriculture/customerPurchase/shoppingCar/totalCount', // 获取购物车总数量
  DELETE_GOOD: '/agriculture/customerPurchase/shoppingCar/delete', // 购物车删除
  TO_BOOKING_SHEET: '/agriculture/advanceOrder/preInsert', //生成预订单

  /**供货列表 */
  GET_SUPPLY_LIST: '/agriculture/agricultureSupplyList/queryAll',    // 获取供货列表数据
  GET_GOODS_BY_SUPPLISRNAME: '/agriculture/agricultureSupplyList/queryProduct',  // 通过供应商查询商品数据
  BATCH_ADD_GOODS: '/agriculture/agricultureSupplyList/allInsert',       // 批量新增商品
  SAVE_ADD_SUPPLY: '/agriculture/agricultureSupplyList/insert',        // 新增表单保存
  SAVE_UPDATE_SUPPLY: '/agriculture/agricultureSupplyList/allUpdate',        //编辑表单保存
  SUPPLY_LIST_DELETE: '/agriculture/agricultureSupplyList/deleteById',     // 列表删除按钮
  GET_GOODS_CATEGORY: '/agriculture/agricultureSupplyList/queryCategory',   // 获取商品分类
  GET_CUSTOMER_WAREHOUSE: '/agriculture/saleOrderController/selectCustomerWarehouse',  // 获取客户仓库
}

// 吉海湾销售管理
export const JHW_SALES_MANAGEMENT_API = {
  /** 销售订单&&发货 */
  GET_LIST_DATA: '/agriculture/saleOrderController/list',                 // 获取销售订单列表数据
  GET_LINE_LIST_DATA: '/agriculture/saleOrderController/listLine',        // 获取销售订单 行数据
  DELIVER_GOODS: '/agriculture/saleOrderController/deliverGoods',         // 发货按钮
  SALES_FORM_SAVE: '/agriculture/saleOrderController/insertOne',          // 销售订单表单 保存
  SALES_LIST_DELETE: '/agriculture/saleOrderController/deleteHead',       // 销售订单删除
  GET_HEAD_AND_LINE_DATA: '/agriculture/saleOrderController/listHeadLine', // 通过ID查询头行信息
  GET_DELIVER_GOOD_LIST: '/agriculture/saleOrderController/listLineNoUnQty', // 发货界面列表数据
  UPDATE_LIST_LINE: '/agriculture/saleOrderController/updateLine',         // 维护发货列表数据
  GENERATE_SUPPLIER_PURCHASE_ORDER: '/agriculture/saleOrderController/orderToPo',      // 生成供应商采购订单
  SAVE_SUPPLIER_PURCHASE_ORDER: '/agriculture/saleOrderController/PoToSecondarySupplier' // 供应商采购订单 保存
}

// 吉海湾-对账结算
export const JHW_RECONCILIATION_SETTLEMENT_API = {
  GET_RECONCILIATION_SLIPS_LIST_DATA: '/agriculture/reconciliationController/list',  // 对账单列表数据/查询/分页
}

// 吉海湾-采购管理
export const JHW_PRUCHASE_MANAGEMENT_API = {
  /** 预订单 */
  GET_BOOKING_SHEET_LIST: '/agriculture/advanceOrder/head/list',  // 预订单列表数据
  GET_BOOKING_SHEET_LINE: '/agriculture/advanceOrder/line/list', //获取明细行
  DELETE_BOOKING_SHEET: '/agriculture/advanceOrder/head/delete', // 预订单删除
  // SUBMIT_TO_SUPPLIER:'', //提交供应商确认
  // SURE_BOOKING_SHEET: '', //确认预订单
  // TO_OA_ADUIT: '', //提交oa送审
  TO_PURCHASE_ORDER: '',//生成采购订单
  SAVE_BOOKING_SHEET: '/agriculture/advanceOrder/insert', //保存预订单
  GET_BOOKING_SHEET: '/agriculture/advanceOrder/head/selectOne', //查询预订单
  UPDATE_BOOKING_SHEET: '/agriculture/advanceOrder/head/update', //更新预订单
  UPLOAD_FILE: '', // 上传附件
  GET_PRICE_BY_DELIVERY_DATE: '/agriculture/advanceOrder/getPriceByDeliveryDate', // 根据交货日期获取价格

  /**采购单 */
  GET_PURCHASE_ORDER_LIST: '/agriculture/purchaseOrder/head/list', //采购订单列表
  GET_PURCHASE_ORDER_LINE: '/agriculture/purchaseOrder/line/list', //采购订单明细行
  DELETE_PURCHASE_ORDER: '/agriculture/purchaseOrder/head/delete', //采购订单删除
  TO_OA_ADUIT_ORDER: '', //提交OA审批采购订单
  GET_PURCHASE_ORDER: '/agriculture/purchaseOrder/head/selectOne', // 查询采购订单
  SAVE_PURCHASE_ORDER: '/agriculture/purchaseOrder/head/insert', //保存采购订单
  UPDATE_PURCHASE_ORDER: '/agriculture/purchaseOrder/head/update', // 采购订单更新
  GET_ADDRESS: '/agriculture/advanceOrder/addressdetails',
  GET_SUPPLIER_GOODS: '/agriculture/customerProduct/getOfflineProductList',  // 获取商品信息
  SUBMIT_PURCHASE_ORDER: '/agriculture/acceptOA/customerPurchase',   // 提交按钮
  CHECK_IS_ALLOW_SUBMIT: '/agriculture/acceptOA/checkPurchase',   // 校验是否允许提交
  /**采购退货&已收货 */
  GET_PURCHASE_RETURN_LIST: '/agriculture/agricultureReturnOrderHeadController/queryAllHead', // 获取采购退货列表头数据
  GET_PURCHASE_RETURN_LINE_LIST: '/agriculture/agricultureReturnOrderHeadController/queryAllLine', // 获取采购退货列表行数据
  GET_RECEIVED_ORDER_LIST: '/agriculture/outboundController/queryOutboundByQueryLineNotNullSingBy', // 获取已收货单据列表数据
  GENERATE_RETURN_FORM: '/agriculture/agricultureReturnOrderHeadController/returnGoods', // 生成退货单
}
