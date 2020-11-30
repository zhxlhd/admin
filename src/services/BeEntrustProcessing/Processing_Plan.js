/**
 * 受托加工-生产计划单 服务
 * created by yxj on 2019/10/15
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import { BE_ENTRUST_PROCESSING_API, BASE_API } from '../apis'; // 导入当前模板和公用 API

export default {
  // 新增提交
  save: (data) => axios.post(`${BE_ENTRUST_PROCESSING_API.PROCESSING_PLAN_ADD}`, data),
  // 获取详情
  getDetails: (id) => axios.get(`${BE_ENTRUST_PROCESSING_API.PROCESSING_PLAN_DETAILS}?id=${id}`),
  // 删除加工计划单
  delete: (ids) => axios.get(`${BE_ENTRUST_PROCESSING_API.PROCESSING_PLAN_DELETE}?ids=${ids}`),
  // 审批、提交审批加工计划单
  approve: (ids, type) => axios.get(`${BE_ENTRUST_PROCESSING_API.PROCESSING_PLAN_APPROVE}?ids=${ids}&type=${type}`),
  // 打印加工计划单
  print: (id) => axios.get(`${BE_ENTRUST_PROCESSING_API.PROCESSING_PLAN_PRINT}/${id}`),
  // 加工单编号选择部分本地数据
  processingOrderCodeData: (data) => {
    let mate = {
      "mateList": {
        "columns": [{
          "name": "processingOrderCode",
          "label": "加工单编号",
          "width": 150.0,
          "isShow": true,
          "sortable": true
        }, {
          "name": "processingOrderLineNum",
          "label": "加工单行号",
          "width": 150.0,
          "isShow": true,
          "sortable": true
        }, {
          "name": "customerCode",
          "label": "客户编号",
          "width": 100.0,
          "isShow": true,
          "sortable": true
        }, {
          "name": "customerName",
          "label": "客户名称",
          "width": 100.0,
          "isShow": true,
          "sortable": false
        }, {
          "name": "deliveryDate",
          "label": "交货日期",
          "width": 100.0,
          "isShow": true,
          "sortable": false
        }, {
          "name": "materialsCode",
          "label": "物料编号",
          "width": 100.0,
          "isShow": true,
          "sortable": false
        }, {
          "name": "materialsName",
          "label": "物料名称",
          "width": 100.0,
          "isShow": true,
          "sortable": false
        }, {
          "name": "specs",
          "label": "规格",
          "width": 80.0,
          "isShow": true,
          "sortable": false
        }, {
          "name": "orderCount",
          "label": "订单数量",
          "width": 100.0,
          "isShow": true,
          "sortable": false
        }, {
          "name": "processingRequire",
          "label": "加工要求",
          "width": 100.0,
          "isShow": true,
          "sortable": false
        }, {
          "name": "unit",
          "label": "单位",
          "width": 80.0,
          "isShow": true,
          "sortable": false
        }],
          "lineColumns": null,
          "priceList": null,
          "despatchList": null,
          "url": "/purchase/processingorder/line/list",
          "lineRows": [],
          "btns": [],
          "preparebtns": null,
          "operatebtns": null,
          "actions": [],
          "search": {
          "values": null,
          "fields": null,
          "rules": null,
          "labelWidth": null,
          "tabs": null,
          "next": null,
          "url": null,
          "inline": null,
          "method": null,
          "subview": null,
          "treeDataLoad": null,
          "multipleConditions": null
        },
        "essearch": {
          "fields": null,
          "op": null,
          "bool": null,
          "range": null,
          "url": null
        },
        "rows": data.rows,
        "selectedRows": null,
        "treeData": null,
        "dataApi": "/purchase/processingorder/line/list",
        "params": null,
        "page": 1,
        "size": data.size,
        "total": data.total,
        "selected": null,
        "captions": null,
        "name": null,
        "subview": null,
        "extObj": null,
        "height": null
      },
      "mateFormerHeader": {
        "values": {
          "planCode": "",
          "designer": "",
          "endDate": "",
          "planName": "",
          "remark": "",
          "startDate": ""
        },
        "fields": [{
          "holder": "textc",
          "name": "planCode",
          "label": "计划编号",
          "isRender": true
        }, {
          "holder": "textc",
          "name": "planName",
          "label": "计划名称",
          "isRender": true
        }, {
          "holder": "textc",
          "name": "designer",
          "label": "计划员",
          "isRender": true
        }, {
          "holder": "datetime",
          "name": "startDate",
          "label": "开始日期",
          "isRender": true
        }, {
          "holder": "datetime",
          "name": "endDate",
          "label": "结束日期",
          "isRender": true
        }, {
          "holder": "textarea",
          "name": "remark",
          "label": "备注",
          "isRender": true,
          "lg": 8.0
        }],
            "rules": null,
            "labelWidth": null,
            "tabs": null,
            "next": "/",
            "url": "/",
            "inline": null,
            "method": "POST",
            "subview": null,
            "treeDataLoad": null,
            "multipleConditions": null
      },
      "mateListLine": {
        "columns": [],
        "lineColumns": null,
        "priceList": null,
        "despatchList": null,
        "url": "/purchase/smartOrder/lines/all",
        "lineRows": [],
        "btns": [],
        "preparebtns": null,
        "operatebtns": null,
        "actions": [],
        "search": {
        "values": null,
        "fields": null,
        "rules": null,
        "labelWidth": null,
        "tabs": null,
        "next": null,
        "url": null,
        "inline": null,
        "method": null,
        "subview": null,
        "treeDataLoad": null,
        "multipleConditions": null
        },
        "essearch": {
          "fields": null,
          "op": null,
          "bool": null,
          "range": null,
          "url": null
        },
        "rows": [],
        "selectedRows": null,
        "treeData": null,
        "dataApi": "/purchase/smartOrder/all/list",
        "params": null,
        "page": 1,
        "size": null,
        "total": 0,
        "selected": null,
        "captions": null,
        "name": null,
        "subview": null,
        "extObj": null,
        "height": null
      },
      "mateSearch": {
        "values": {
          "customerName": "",
          "fromDateStr": "",
          "processingOrderCode": "",
          "toDateStr": ""
        },
        "fields": [{
          "holder": "text",
          "name": "processingOrderCode",
          "label": "订单编号",
          "lg": 4.0,
          "md": 6.0,
          "placeholder": "订单编号",
          "sm": 8.0
        },{
          "holder": "text",
          "name": "customerName",
          "label": "客户名称",
          "lg": 4.0,
          "md": 6.0,
          "placeholder": "客户名称",
          "sm": 8.0
        }, {
          "holder": "datePicker",
          "name": "fromDateStr",
          "label": "交货开始日期",
          "lg": 4.0,
          "md": 6.0,
          "placeholder": "交货开始日期",
          "sm": 8.0
        }, {
          "holder": "datePicker",
          "name": "toDateStr",
          "label": "交货结束日期",
          "lg": 4.0,
          "md": 6.0,
          "placeholder": "交货结束日期",
          "sm": 8.0
        }],
          "rules": null,
          "labelWidth": null,
          "tabs": null,
          "next": "",
          "url": "/purchase/processingorder/line/list",
          "inline": null,
          "method": "POST",
          "subview": null,
          "treeDataLoad": null,
          "multipleConditions": true
      }
    };
    return mate;
  },
  // 获取选择加工单编号
  getProcessingOrderCodeData: data => axios.post(`${BE_ENTRUST_PROCESSING_API.PROCESSING_PLAN_PROCESSING_ORDER_CODE}`, data),
  // 校验计划编号是否唯一
  checkPlanCode: planCode => axios.get(`${BE_ENTRUST_PROCESSING_API.PROCESSING_PLAN_CHECK_PLAN_CODE}/${planCode}`),
  // 获取技术方案编码列表
  getTechnicalSchemeCode: () => axios.get(`${BE_ENTRUST_PROCESSING_API.DELIVERY_DATA_MONTH_TECHNICAL_SOLUTION_LIST}`),
}
