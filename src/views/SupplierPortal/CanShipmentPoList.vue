<!-- created by hezhiqiang on 2020/04/27 -->
<!-- 可发运po列表 -->
<template>
  <div>
    <k-table-list ref="listTable" 
      :mate="mate" 
      :mateSearch="mate.mateSearch" 
      :isIndex="isIndex"
      :isIndexDialog="isIndexDialog"
      :isShowSearchBtn="isShowSearchBtn"
      :querySize="querySize"
      :isResetBtn="isHiddenResetBtn"
      @initOperations="initOperations"
      @initQueryData="convertData"
      @selectAll="selectAll"
      @btnClick="handleButton"
    ></k-table-list>
  </div>
</template>
<script>
import { DateFormat } from '../../utils/util.js'
import KTableList from '@/components/table/KTableList'
import { API_GATEWAY } from '@/config/index.js'
import SERVICES from '@/services'
import { SUPPLIER_PORTAL_API } from "@/services/apis"
import { dateFormatter } from "@/utils/DateUtils";

export default {
  components: {
    KTableList
  },
  data(){
    return {
      isIndex: false,               // Table 是否渲染序号列
      isIndexDialog: true,          // 详情 Dialog Table 是否渲染序号列
      rowStatus: null,              // 列表订单行状态
      isShowSearchBtn: false,       // 是否显示搜索展开按钮
      multipleSelection: [],        // 勾选项数组
      querySize: 5,                 // 查询每页 size
      isHiddenResetBtn: false,       // 是否隐藏搜索重置按钮
      isSelectAll: false,             // 是否全选
      customerOptions: [],      // 客户下拉值
      hasSelected: false,
    }
  },
  props: {
    mate: Object
  },
  created (){
  },
  mounted (){
    // 获取客户名称
    this.getCustomerName()
  },
  watch: {
    multipleSelection: function (newSelection) {
      this.hasSelected = (newSelection.length !== 0)
    },
    mate: {
      handler(newMate, oldMate) {
      　 this.init();
    　},
    　immediate: true
    }
  },
  methods: {
    init(){
      // 到期日至默认当前日期
      let date = new Date();
      let mateSearchValues = this.mate.mateSearch.values;
      let endDate = mateSearchValues.dueDateEnd || '';
      let startDate = dateFormatter("YYYY-MM-DD", date.getTime() - 7 * 24 * 3600 * 1000);
      mateSearchValues.dueDateEnd = endDate || dateFormatter("YYYY-MM-DD");
      mateSearchValues.dueDateStart = startDate;
      this.initOperations();
      this.getCustomerName();
    },
    /**
     * 数据转换
     * 后台返回数据结构不统一做数据转换处理
     * @param {Object} data 数据
     * @return void
     */
    convertData({ pageSize, total, pageNum, list, ...resData }) {
      let rows = list;
      let page = pageNum;
      let size = pageSize;
      this.mate.mateList = { ...this.mate.mateList, size, page, total, rows };
    },
    initOperations() {
      let rows = this.mate.mateList.rows;
      // 如果没有行返回
      if (!rows.length) {
        return
      }else {
        // 默认启用编辑/修改
        rows.forEach(item => {
          item.enableEdit = true;
        });
      }
    },
    /**
     * 全选导出
     */
    selectAll (selection) {
      let multipleSelection = this.multipleSelection
      if(selection.length) {
        this.isSelectAll = true;
      }else{
        this.isSelectAll = false
      }
    },
    /**
     * 获取客户名称
     * @param void
     * @return void
     */
    getCustomerName () {
      SERVICES.SUPPLIER_PORTAL.getCustomerName().then(res => {
        console.log(res)
        let data = res.data.data
        if (data.length) {
          data.forEach((item, idx) => {
            this.customerOptions.push({
              'label': item.name,
              'value': item.name,
              'key': idx,
            })
          });
          let customerName = this.mate.mateSearch.fields.find(item => item.name === 'customerName');
          if(this.customerOptions.length) {
            customerName.options = this.customerOptions;
            return
          };
        }
      })
    },
    /**
     * 头部按钮控制
     * 点击按钮触发对应方法
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @param {Array} selection 勾选行数据
     * @return void
     */
    handleButton (btn, rowId, selection) {
      this.multipleSelection = selection;
      let poNums = [];
      for (var i=0; i < selection.length; i++) {
        if(selection[i].poNum != null){
          poNums.push(selection[i].poNum);
        }
      }
      if (btn.action === 'exportInfo') {
        let data = {};
        if(this.isSelectAll){
          let multipleSelection = this.multipleSelection
          let poNums = [];
          for (var i=0; i < multipleSelection.length; i++) {
            if(this.multipleSelection[i].poNum != null){
              poNums.push(multipleSelection[i].poNum);
            }
          }
          let customerId = this.mate.mateSearch.values['customerId'];
          let customerObj;
          if (customerId){
            customerObj = this.customerOptions.find(item => item.value === customerId);
            if(customerObj) {
              this.mate.mateSearch.values.customerName = customerObj.label;
            }else{
              this.mate.mateSearch.values.customerName = ""
            };
          }
          // data.formSearch = this.formSearch;
          data = this.mate.mateSearch.values;
          delete(data.pageNum1)
          delete(data.pageSize1)
          data = JSON.stringify(data)
        }else{
          data.poNums = poNums;
          data = JSON.stringify(data)
        }
        this.$http({
          url: API_GATEWAY + '/api/supplier-portal/shippablePo/export',
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
            'Accept': 'application/json',
            'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
            'Content-Type': 'application/json;charset=utf8'
          }, 
          body: data,
          responseType: 'arraybuffer'
        }).then(function (response) {
          var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          // blob(size,type) Blob构造函数，接受两个参数。第一个参数是一个包含实际数据的数组，第二个参数是数据的类型
          var objectUrl = URL.createObjectURL(blob)
          var a = document.createElement('a')
          document.body.appendChild(a)
          a.setAttribute('style', 'display:none')
          a.setAttribute('href', objectUrl)
          var fileName = ''
          fileName ='可发运PO.xlsx'
          a.setAttribute('download', fileName)
          a.click()
        })
      }
    },
  }
}
</script>
