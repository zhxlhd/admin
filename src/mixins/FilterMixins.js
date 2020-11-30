/**
 * 过滤器
 * 在 methods 配置字段需要过滤的方法
 * 在Mongodb 对应的字段配置 "filter": "方法名"
 */
import { getNameById } from '@/utils/util';
import { BaseConstant } from '@/constant/BaseConstant';
const FilterMixin = {
  methods: {
    /** filter过滤
     * 在这里配置过滤方法 如上
     * 在Mongodb 配置 "filter": "方法名"
     * @param {Array} columns 列表的头部字段
     * @return void
     */
    filterValues(columns = []) {
      if (columns.length != 0) {
        columns
          .filter(col => col.filter !== undefined)
          .forEach((col, index) => {
            col.formatter = this[col.filter];
          });
      }
    },
    /**  通用过滤
     * @param {Object} row 列表行
     * @param {Object} column 列表列
     * @param {Any} cellValue 值
     * @param {String} index 索引
     * @return void
     */
    baseFilter(row, column, cellValue, index) {
      const status = {
        0: () => "否",
        1: () => "是",
        false: () => "否",
        true: () => "是",
        default: () => (cellValue || "")
      };
      return (status[cellValue] || status.default)();
    },
    /**  是/否 whetherFilter通用过滤
     * 是 "1"
     * 否 "0"
     * @param {Object} row 列表行
     * @param {Object} column 列表列
     * @param {Any} cellValue 值
     * @param {String} index 索引
     * @return void
     */
    whetherFilter(row, column, cellValue, index) {
      const status = {
        0: () => "否",
        1: () => "是",
        false: () => "否",
        true: () => "是",
        default: () => (cellValue || "")
      };
      return (status[cellValue] || status.default)();
    },
    /** 状态字符串 整合过滤器
     * @param {Object} row 列表行
     * @param {Object} column 列表列
     * @param {Any} cellValue 值
     * @param {String} index 索引
     * @return void
     */
    statusStringFilter(row, column, cellValue, index) {
      const status = {
        CREATE: () => "录入",
        ISSUED: () => "已发放",
        UNISSUED: () => "未发放",
        CLOSE: () => "关闭",
        SUBMIT: () => "待审批",
        PENDING: () => "待审批",
        SAVE: () => "新建",
        PASS: () => "已审批",
        REJECT: () => "驳回",
        NOT_STARTED: () => "未启动",
        STARTING: () => "进行中",
        PAUSE: () => "暂停",
        FINISHED: () => "完成",
        TRANSFER_ORDER: () => "转单",
        CANCEL: () => "取消",
        PENDING_RECEPTION: () => "待接收",
        FINISH: () => "完成",
        WAITING: () => "未开始",
        default: () => (cellValue || "")
      };
      return (status[cellValue] || status.default)();
    },
    /** 智能跟单-任务状态过滤
     * @param {Object} row 列表行
     * @param {Object} column 列表列
     * @param {Any} cellValue 值
     * @param {String} index 索引
     * @return void
     */
    taskStatusFilter(row, column, cellValue, index) {
      const status = {
        NOT_STARTED: () => "未启动",
        STARTING: () => "进行中",
        PAUSE: () => "暂停",
        FINISHED: () => "完成",
        TRANSFER_ORDER: () => "转单",
        CANCEL: () => "跳过",
        PENDING_RECEPTION: () => "待接收",
        FINISH: () => "完成",
        WAITING: () => "未开始",
        default: () => (cellValue || "")
      };
      return (status[cellValue] || status.default)();
    },
    /** 受托加工-加工计划单状态过滤
     * @param {Object} row 列表行
     * @param {Object} column 列表列
     * @param {Any} cellValue 值
     * @param {String} index 索引
     * @return void
     */
    processingStatusFilter(row, column, cellValue, index) {
      const status = {
        1: () => "录入",
        2: () => "待审批",
        3: () => "已审批",
        4: () => "已驳回",
        default: () => (cellValue || "")
      };
      return (status[cellValue] || status.default)();
    },
    /** 受托加工-加工单录入状态过滤
     * 外协单： 录入-> 待审批 -> 待供应商确认 -> 生效 -> 关闭
     * 自跟单：录入-> 待审批 -> 生效 -> 关闭
     * @param {Object} row 列表行
     * @param {Object} column 列表列
     * @param {Any} cellValue 值
     * @param {String} index 索引
     * @return void
     */
    POEStatusFilter(row, column, cellValue, index) {
      const status = {
        CREATE: () => "录入",
        PENDING: () => "待审批",
        REJECT: () => "已驳回",
        PASS: () => "生效",         // 即已审批
        CLOSE: () => "关闭",
        default: () => (cellValue || "")
      };
      return (status[cellValue] || status.default)();
    },
    /** 受托加工-加工单录入 跟单类型
     * 自跟单： 1
     * 外协单： 2
     * @param {Object} row 列表行
     * @param {Object} column 列表列
     * @param {Any} cellValue 值
     * @param {String} index 索引
     * @return void
     */
    orderTypeFilter(row, column, cellValue, index) {
      const status = {
        1: () => "自跟单",
        2: () => "外协单",
        default: () => (cellValue || "")
      };
      return (status[cellValue] || status.default)();
    },
    /** 基础数据-工单分类 工单类型
     * 标准工单： 1
     * 非标准工单： 2
     * @param {Object} row 列表行
     * @param {Object} column 列表列
     * @param {Any} cellValue 值
     * @param {String} index 索引
     * @return void
     */
    categoryTypeFilter(row, column, cellValue, index) {
      const status = {
        1: () => "标准工单",
        2: () => "非标准工单",
        default: () => (cellValue || "")
      };
      return (status[cellValue] || status.default)();
    },
    /** 物流商管理-物流商信息
     * @param {Object} row 列表行
     * @param {Object} column 列表列
     * @param {Any} cellValue 值
     * @param {String} index 索引
     * @return void
     */
    logisticsProvidersTypeStatusFilter(row, column, cellValue, index) {
      const status = {
        1: () => "运输",
        2: () => "货代",
        3: () => "自提",
        4: () => "报关行",
        default: () => (cellValue || "")
      };
      return (status[cellValue] || status.default)();
    },
    /** 物流商管理-物流供应商备案信息-提货人  审核状态
     * @param {Object} row 列表行
     * @param {Object} column 列表列
     * @param {Any} cellValue 值
     * @param {String} index 索引
     * @return void
     */
    approveStatusFilter(row, column, cellValue, index) {
      const status = {
        0: () => "新建",
        1: () => "待审批",
        2: () => "已审批",
        3: () => "驳回",
        default: () => (cellValue || "")
      };
      return (status[cellValue] || status.default)();
    },
    /** 物流线路管理-物流线路维护 出货模式
     * @param {Object} row 列表行
     * @param {Object} column 列表列
     * @param {Any} cellValue 值
     * @param {String} index 索引
     * @return void
     */
    deliveryModeFilter(row, column, cellValue, index) {
      const status = {
        '0': () => "国内交货",
        '1': () => "直接出境",
        '2': () => "直接入境",
        '3': () => "厂区周转",
        default: () => (cellValue || "")
      };
      return (status[cellValue] || status.default)();
    },
    /** 物流线路管理-物流线路维护 物流线路类型
     * @param {Object} row 列表行
     * @param {Object} column 列表列
     * @param {Any} cellValue 值
     * @param {String} index 索引
     * @return void
     */
    routeTypeFilter(row, column, cellValue, index) {
      const status = {
        '0': () => "跨境线路",
        '1': () => "跨省线路",
        '2': () => "跨市线路",
        '3': () => "跨区线路",
        '4': () => "国际线路",
        default: () => (cellValue || "")
      };
      return (status[cellValue] || status.default)();
    },
    /** 物流线路管理-物流线路维护 运输方式
     * @param {Object} row 列表行
     * @param {Object} column 列表列
     * @param {Any} cellValue 值
     * @param {String} index 索引
     * @return void
     */
    transportModeFilter(row, column, cellValue, index) {
      const status = {
        '0': () => "空运",
        '1': () => "陆运",
        '2': () => "海运",
        '3': () => "快递",
        default: () => (cellValue || "")
      };
      return (status[cellValue] || status.default)();
    },
    /**  是/否 whetherEffectFilter 是否有效
     * 是 "1"
     * 否 "0"
     * @param {Object} row 列表行
     * @param {Object} column 列表列
     * @param {Any} cellValue 值
     * @param {String} index 索引
     * @return void
     */
    whetherEffectFilter(row, column, cellValue, index) {
      const status = {
        0: () => "无效",
        1: () => "有效",
        default: () => (cellValue || "")
      };
      return (status[cellValue] || status.default)();
    },
    /**  实报实销管理-货币单位
     * @param {Object} row 列表行
     * @param {Object} column 列表列
     * @param {Any} cellValue 值
     * @param {String} index 索引
     * @return void
     */
    currencyTypeFilter(row, column, cellValue, index) {
      const status = {
        0: () => "CNY",
        1: () => "USD",
        default: () => (cellValue || "")
      };
      return (status[cellValue] || status.default)();
    },
    /**  是/否 whetherEffectFilter 是否有效（字符串类型的有效无效）
     * 是 "1"
     * 否 "0"
     * @param {Object} row 列表行
     * @param {Object} column 列表列
     * @param {Any} cellValue 值
     * @param {String} index 索引
     * @return void
     */
    whetherEffectFilterWithStr(row, column, cellValue, index) {
      const status = {
        '0': () => "无效",
        '1': () => "有效",
        default: () => (cellValue || "")
      };
      return (status[cellValue] || status.default)();
    },
    /** 项目状态
     * @param {Object} row 列表行
     * @param {Object} column 列表列
     * @param {Any} cellValue 值
     * @param {String} index 索引
     * @return void
     */
    whetherProjectStatusFilter(row, column, cellValue, index) {
      const status = {
        1: () => "未启动",
        2: () => "启动",
        3: () => "规划",
        4: () => "执行",
        5: () => "收尾",
        6: () => "关闭",
        default: () => (cellValue || "")
      };
      return (status[cellValue] || status.default)();
    },
    /** 合同状态
     * @param {Object} row 列表行
     * @param {Object} column 列表列
     * @param {Any} cellValue 值
     * @param {String} index 索引
     * @return void
     */
    contractStatusFilter(row, column, cellValue, index) {
      const status = {
        1: () => "起草",
        2: () => "待审批",
        3: () => "已审批",
        4: () => "已驳回",
        5: () => "已发布",
        default: () => (cellValue || "")
      };
      return (status[cellValue] || status.default)();
    },
    /** 合同审批结果状态
     * @param {Object} row 列表行
     * @param {Object} column 列表列
     * @param {Any} cellValue 值
     * @param {String} index 索引
     * @return void
     */
    contractOperateFilter(row, column, cellValue, index) {
      const status = {
        2: () => "提交审批",
        3: () => "同意",
        4: () => "驳回",
        5: () => "发布",
        default: () => (cellValue || "")
      };
      return (status[cellValue] || status.default)();
    },
    /** 合同变更状态
     * @param {Object} row 列表行
     * @param {Object} column 列表列
     * @param {Any} cellValue 值
     * @param {String} index 索引
     * @return void
     */
    contractChangeFilter(row, column, cellValue, index) {
      const status = {
        0: () => "新建",
        1: () => "待审批",
        2: () => "批准",
        3: () => "驳回",
        4: () => "作废",
        default: () => (cellValue || "")
      };
      return (status[cellValue] || status.default)();
    }, 
    /** 调查问卷 人员类型
    * @param {Object} row 列表行
    * @param {Object} column 列表列
    * @param {Any} cellValue 值
    * @param {String} index 索引
    * @return void
    */
   personalCategoryFilter(row, column, cellValue, index) {
     const status = {
       1: () => "I类",
       2: () => "II类",
       3: () => "III类",
       4: () => "IV类",
       5: () => "未定义",
       default: () => (cellValue || "")
     };
     return (status[cellValue] || status.default)();
   },
    /** 合同归档状态
     * @param {Object} row 列表行
     * @param {Object} column 列表列
     * @param {Any} cellValue 值
     * @param {String} index 索引
     * @return void
     */
    contractArchivedStatusFilter(row, column, cellValue, index) {
      const status = {
        0: () => "未归档",
        1: () => "已归档",
        default: () => (cellValue || "")
      };
      return (status[cellValue] || status.default)();
    },
    /** 供应商门户-客户PO 行-发货信息-状态
     * @param {Object} row 列表行
     * @param {Object} column 列表列
     * @param {Any} cellValue 值
     * @param {String} index 索引
     * @return void
     */
    poFilter(row, column, cellValue, index) {
      const status = {
        'IN PROCESS': () => "处理中",
        'RESERVED': () => "已保留",
        'REJECTED': () => "已拒绝",
        'RETURNED': () => "已退回",
        'APPROVED': () => "批准",
        'INCOMPLETE': () => "未完成",
        'REQUIRES REAPPROVAL': () => "要求重新审批",
        'PRE-APPROVED': () => "预审批",
        default: () => (cellValue || "")
      };
      return (status[cellValue] || status.default)();
    },
    /**
     * 销售管理-套料物料需求-状态
     * @param {Object} row 列表行
     * @param {Object} column 列表列
     * @param {Any} cellValue 值
     * @param {String} index 索引
     * @return void
     */
    nestingMaterialStatus(row, column, cellValue, index) {
      const status = {
        1: () => "等待发运",
        2: () => "已发运",
        3: () => "取消",
        4: () => "部分发运",
        5: () => "备货完成",
        6: () => "已输入",
        7: () => "等待退货",
        8: () => "已提货",
        default: () => (cellValue || "")
      };
      return (status[cellValue] || status.default)();
    },
    /**
     * 销售管理-套料物料需求-状态
     * @param {Object} row 列表行
     * @param {Object} column 列表列
     * @param {Any} cellValue 值
     * @param {String} index 索引
     * @return void
     */
    nestingMaterialOrderType(row, column, cellValue, index) {
      const status = {
        1: () => "销售单",
        2: () => "提货单",
        default: () => (cellValue || "")
      };
      return (status[cellValue] || status.default)();
    },
    /**
     * 基础数据-征信评级-状态
     * @param {Object} row 列表行
     * @param {Object} column 列表列
     * @param {Any} cellValue 值
     * @param {String} index 索引
     * @return void
     */
    evaluateFilter(row, column, cellValue, index) {
      const status = {
        '0': () => "已维护",
        '1': () => "待维护",
        default: () => (cellValue || "")
      };
      return (status[cellValue] || status.default)();
    },
    /**
     * 基础数据-征信评级-行业
     * @param {Object} row 列表行
     * @param {Object} column 列表列
     * @param {Any} cellValue 值
     * @param {String} index 索引
     * @return void
     */
    industryFilter(row, column, cellValue, index) {
      return getNameById(cellValue,BaseConstant.SELECT_OPTIONS.INDUSTRY_OPTIONS);
    },
    /**
     * 基础数据-征信评级-征信评级
     * @param {Object} row 列表行
     * @param {Object} column 列表列
     * @param {Any} cellValue 值
     * @param {String} index 索引
     * @return void
     */
    rateStartFilter(row, column, cellValue, index) {
      const status = {
        1: () => "★☆☆☆☆",
        2: () => "★★☆☆☆",
        3: () => "★★★☆☆",
        4: () => "★★★★☆",
        5: () => "★★★★★",
        default: () => (cellValue || "")
      };
      return (status[cellValue] || status.default)();
    },
    /**
     * 吉海湾-对账结算-对账单状态 state
     * @param {Object} row 列表行
     * @param {Object} column 列表列
     * @param {Any} cellValue 值
     * @param {String} index 索引
     * @return void
     */
    jhwStateFilter(row, column, cellValue, index) {
      const status = {
        1: () => "新建",
        2: () => "对账中",
        3: () => "已对账",
        4: () => "已预开票",
        5: () => "已开票",
        default: () => (cellValue || "")
      };
      return (status[cellValue] || status.default)();
    },
    /**
     * 吉海湾-对账结算-对账单行明细状态 开票行明细状态
     * @param {Object} row 列表行
     * @param {Object} column 列表列
     * @param {Any} cellValue 值
     * @param {String} index 索引
     * @return void
     */
    jhwRSStateFilter(row, column, cellValue, index) {
      const status = {
        1: () => "新建",
        2: () => "未对账",
        3: () => "已对账",
        default: () => (cellValue || "")
      };
      return (status[cellValue] || status.default)();
    },
    /**
     * 吉海湾-对账结算-开票 state
     * @param {Object} row 列表行
     * @param {Object} column 列表列
     * @param {Any} cellValue 值
     * @param {String} index 索引
     * @return void
     */
    jhwBillingStateFilter(row, column, cellValue, index) {
      const status = {
        0: () => "已预开票",
        1: () => "已开票",
        2: () => "已签收",
        default: () => (cellValue || "")
      };
      return (status[cellValue] || status.default)();
    },
    /**
     * 吉海湾-对账结算-付款单 state
     * @param {Object} row 列表行
     * @param {Object} column 列表列
     * @param {Any} cellValue 值
     * @param {String} index 索引
     * @return void
     */
    jhwPaymentStateFilter(row, column, cellValue, index) {
      const status = {
        1: () => "新建",
        2: () => "审核中",
        3: () => "已驳回",
        4: () => "已通过",
        5: () => "收款确认",
        default: () => (cellValue || "")
      };
      return (status[cellValue] || status.default)();
    },
    /**
     * 供应商门户-报表导出记录- 状态
     * @param {Object} row 列表行
     * @param {Object} column 列表列
     * @param {Any} cellValue 值
     * @param {String} index 索引
     * @return void
     */
    reportStatusFilter(row, column, cellValue, index) {
      const status = {
        1: () => "等待中",
        2: () => "处理中",
        3: () => "已完成",
        4: () => "失败",
        default: () => (cellValue || "")
      };
      return (status[cellValue] || status.default)();
    },
    /**
     * 供应商门户-报表导出记录- 报表类型 
     * @param {Object} row 列表行
     * @param {Object} column 列表列
     * @param {Any} cellValue 值
     * @param {String} index 索引
     * @return void
     */
    reportTypeFilter(row, column, cellValue, index) {
      const status = {
        1: () => "供应商退货未拉走明细",
        2: () => "委外盘点异常扣款",
        3: () => "到货列表",
        4: () => "在途执行列表报表",
        5: () => "提交到asn未到货列表",
        default: () => (cellValue || "")
      };
      return (status[cellValue] || status.default)();
    },
    /**
     * 智能跟单-设计备注 outwardFlag （原是否外发）
     * @param {Object} row 列表行
     * @param {Object} column 列表列
     * @param {Any} cellValue 值
     * @param {String} index 索引
     * @return void
     */
    smartOutwardFlagFilter(row, column, cellValue, index) {
      const option = BaseConstant.SELECT_OPTIONS.OUTWARD_FLAG.find(item => item.value === cellValue);
      let label = option ? option.label : '';
      return label;
    },
    
  }
};
export default FilterMixin;
