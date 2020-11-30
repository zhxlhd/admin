/**
 * 吉海湾-对账结算： 对账单 RECONCILIATION_SLIPS_LIST 
 * created by zhongxiaolong on 2020/05/19
 */
import { getAction, postAction } from '../manage'; // 导入http服务
import { JHW_RECONCILIATION_SETTLEMENT_API } from '../apis'; // 导入当前模板和公用 API

// 使用方法1：
// 模块导入 import * as services from '@/services/JhwReconciliationSettlement/Reconciliation_Slips_List' 
// services.方法名 调用
// 获取列表数据（搜索查询/分页）
// const getList = (params)=>postAction(`${JHW_RECONCILIATION_SETTLEMENT_API.GET_RECONCILIATION_SLIPS_LIST_DATA}`,params)


// export {
//   getList
// }

// 使用方法2
// 模块导入 import SERVICES from '@/services';
// SERVICES.RECONCILIATION_SLIPS_LIST.方法名调用
// export default {
//   getList: (params)=>postAction(`${JHW_RECONCILIATION_SETTLEMENT_API.GET_RECONCILIATION_SLIPS_LIST_DATA}`,params)
// }
