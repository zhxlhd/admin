<!-- created by fengjing on 2020/05/20 -->
<!-- 采购订单 -->
<template>
  <div>
    <!-- headTable Start -->
    <KTableList
      :mate="mate"
      :mateSearch="mate.mateSearch"
      @btnClick="handleButtons"
      ref="listTable"
      :isIndex="isIndex"
      :isShowSearchBtn="isShowSearchBtn"
      :querySize="querySize"
      :formModel="formModel"
      @rowClick="rowClick"
      @action="handleActions"
      @initOperations="initOperations"
      @initQueryData="convertData"
      @resetLineTable="showDetailTable=false"
      @isSelected="handleSelected"
      @uploadSuccess="uploadSuccess"
    />
    <!-- headTable END -->
    <!-- detailTable Start -->
    <main-table
      v-if="showDetailTable"
      :mateList="mate.mateListLine"
      ref="lineTable"
    />
    <!-- detail End -->
  </div>
</template>
<script>
import { LANGS } from '../../i18n/lang';
import KTableList from '@/components/table/KTableList'
import MainTable from '@/components/table/MainTable'
import DynamicForm from '@/components/form/DynamicForm'
import SERVICES from '@/services'

export default {
  components: {
    KTableList,
    MainTable,
    DynamicForm,
    HBtn: function index(resolve){
      require(["@/components/Button/HBtn.vue"], resolve);
    },
  },
  data(){
    return {
      isIndex: true,               // table是否渲染序号
      showDetailTable: false,      // 是否渲染明细行表格
      headRowId: '',               // 头行id
      showSubmitButton: true,      // 提交按钮是否显示
      selectedLines: [],           // 勾选明细行
      isShowSearchBtn: false,      // 是否显示搜索展开按钮
      multipleSelection: [],       // 勾选头部列表获取数据               
      querySize: 15,                // 查询每页 size
      page: 1,
      formModel: 'page',           // page dialog
      isHiddenResetBtn: false,     // 是否隐藏搜索重置按钮
      costState: '',               // 判断实报实销是否已存在
      lineId: '',                  // 行id
      params: '?listName=jhw_purchase_order_list&lineList=jhw_purchase_order_list_line&listFormName=jhw_purchase_order_form', // 元数据表名
      listUrl: '/common/toList',  // 元数据接口
      deleteUrl: '',              // 删除接口
      isEdit: false,              // 当前是否在编辑
      isMaintain: false,          // 是否是维护操作
      isSumbit: true,            // 判断行单价是否允许提交
    }
  },
  props: {
    mate: Object
  },
  created (){
    this.init();
  },
  mounted () {

  },
  watch: {
    mate: {
      handler(newMate, oldMate) {
      　this.init();
  　　},
  　　immediate: true
    }
  },
  methods: {
    /**
     * 数据初始化
     * @param void
     * @return void
     */
    init () {
      this.showDetailTable = false;
      this.mate.mateList.rowClick = true;   // 允许单击列表行请求行数据
      // 获取列表数据
      this.getListData();
    },
    /**
     * 获取列表数据
     */
    getListData () {
      const param = {
        ifNeedPage: true
      };
      SERVICES.JHW_PURCHASE_ORDER.getList(param).then(res => {
        const data = res.data.data; // TODO 注意返回层级关系
        let { total, ...resData } = data;
        let rows = data.list;
        let page = data.pageNum;
        let size = data.pageSize;
        rows.forEach(item => {
          item.enableEdit = true;
        });
        rows.forEach(item => {
          let state = item.state;
          // 新建 确认中 供应商已确认 已驳回 可以编辑
          if(state !== '1' && state !== '3'){
            item.enableEdit = false;
          }
        });
        this.mate.mateList = { ...this.mate.mateList, size, page, total, rows };
      })
    },
    /**
     * 数据转换
     * 后台返回数据结构不统一做数据转换处理
     * @param {Object} data 数据
     * @return void
     * 
     */
    convertData({ pageSize, total, pageNum, list, ...resData}) {
      let rows = resData.data.list;
      let page = resData.data.pageNum;
      let size = resData.data.pageSize;
      total = resData.data.total;
      rows.forEach(item => {
        item.enableEdit = true;
      });
      rows.forEach(item => {
        let state = item.state;
        // 新建 已驳回 可以编辑
        if(state !== '1'  && state !== '3'){
          item.enableEdit = false;
        }
      });
      this.mate.mateList = { ...this.mate.mateList, size, page, total, rows };
    },
    /** 初始化行操作列按钮的状态配置启用按钮 disabled 的状态
     * ......可以对相关按钮进行初始化
     * enableEdit 是否启用编辑
     * 默认启用编辑 通做行状态再修改启用状态
     * @param void
     * @return void
     ** Author: fengjing
     */
    initOperations() {
      let rows = this.mate.mateList.rows;
      rows.forEach(item => {
        item.enableEdit = true;
      });
      rows.forEach(item => {
        let state = item.state;
        // 新建  已驳回 可以编辑
        if(state !== '1'  && state !== '3' ){
          item.enableEdit = false;
        }
      });
    },
    /**
     * 头部按钮控制
     * 点击按钮触发对应方法
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @param {Array} selection 勾选行数据
     * @return void
     */
    handleButtons (btn, rowId, selection) {
      this.multipleSelection = selection;
      let action = btn.action;
      const rowIds = (rowId && rowId.id) ? rowId : { id: selection && selection.map(r => r.id) };
      const btnEvents = {
        addPurchase: (btn) => this.addPurchase(btn),
        updateDetail: () => this.updateDetail(btn,rowIds),// 修改
        print: (act, row) => this.handlePrint(btn,rowIds), // 打印
        toAudit: () => this.handleToAudit(btn,rowIds), //送审
        delete: (btn) => this.handleDelete(btn),
        toSellOrder: (btn) => this.handleToSellOrder(btn,rowIds), // 提交生成销售订单
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(btn, rowIds);
    },
    /**
     * actions 操作
     * 点击 action 根据按钮配置的 action 做对应操作
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
     */
    handleActions (act, row) {
      let action = act && act.action;
      const actions = {
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
    },
    /**
     * 修改
     * @param {Object} act 当前点击的按钮配置信息
     * @param {Object} rowIds
     * @return void
     */
    updateDetail(btn,rowIds){
      if (this.multipleSelection.length > 1) {
        this.$message.warning("请选择一条数据修改");
        return
      };
      // 检查勾选项是否都是 新建 已驳回 才能删除
      let isAllow = this.multipleSelection.every(item => {
        return (item.state === '1') || (item.state === '3');
      });
      if(isAllow){
        this.$store.dispatch('Common/setRowId', rowIds.id[0]);
        this.$root.monitor({ url: btn.url})
      } else {
        this.$message.warning("请选择状态为新建或已驳回的采购订单进行修改");
        return
      }
    },
    /**
     * 删除
     *  @param {Object} btn 当前点击按钮配置
     *  @param {Object} ids 当前勾选id对象
     */
    handleDelete(btn,ids){
      let _this = this
      // 检查勾选项是否都是 新建或已驳回状态 才能删除
      let isAllow = this.multipleSelection.every(item => {
        // 新建状态才能删除
        return (item.state === '1' || item.state === '3');
      });
      if(this.multipleSelection.length > 1) {
        this.$message.warning("请选择一条数据进行删除");
        return
      }
      if(isAllow){
        SERVICES.JHW_PURCHASE_ORDER.deleteDetail(this.multipleSelection[0].id).then((res) => {
          this.reRenderList();
        })
      } else {
        this.$message.warning("请选择状态为新建或已驳回的采购订单进行删除");
        return
      }
    },
    /**
     * 提交
     *  @param {Object} btn 当前点击按钮配置
     *  @param {Object} ids 当前勾选id对象
     */
    handleToSellOrder(btn,ids){
      let _this = this
      // 检查勾选项是否都是 新建状态 才能提交
      let isAllow = this.multipleSelection.every(item => {
        return (item.state === '1')
      });
      let allowArr = [];
      let allowObj = {};
      this.multipleSelection.forEach(item => {
        allowObj.status = '4',
        allowObj.headNo = item.purchaseOrderNumber;
        allowArr.push(allowObj)
      });
      if(isAllow){
        // 校验是否允许提交
        SERVICES.JHW_PURCHASE_ORDER.checkIsAllow(allowArr).then(res => {
          if (res.data.code == 200) {
            SERVICES.JHW_PURCHASE_ORDER.getSubmit(allowArr).then(data => {
              if (data.data.code == 200) {
                this.$message({
                  type: 'success',
                  message: res.data.message
                })
              }else {
                this.$message({
                  type: 'warning',
                  message: res.data.message
                })
              }
            })
          } else {
            this.$message({
              type: 'warning',
              message: res.data.message
            })
          }
        })
      } else {
        this.$message.warning("请选择状态为新建的采购订单进行提交");
        return
      }
    },
     /**
     * 送审
     *  @param {Object} btn 当前点击按钮配置
     *  @param {Object} ids 当前勾选id对象
     */
    handleToAudit(btn,ids){
      let _this = this
      // 检查勾选项是否都是 新建状态 才能推送oa送审
      let isAllow = this.multipleSelection.every(item => {
        return (item.state === '1')
        // (item.state === '4');
      });
      if(this.multipleSelection.length > 1){
        this.$message.warning("请勾选一条数据进行推送OA送审");
        return
      }
      let param = {
        id: this.multipleSelection[0].id
      }
      let url =  btn.url + '?id=' + this.multipleSelection[0].id
      if(isAllow){
        this.$root.ajaxData(url, {}, function (data) {
          _this.reRenderList();
        }, 'GET')
      } else {
        this.$message.warning("请选择状态为已确认的预订单进行推送OA送审");
        return
      }
    },
    /**
     * 新增采购订单
     */
    addPurchase(btn){
      this.$store.dispatch('Common/setRowId','');
      this.$root.monitor({ url: btn.url });
    },
    /**
     * 多选控制
     * @param {Boolean} bool 是否有勾选
     * @param {Array} selectedArr 勾选行数据数组
     * @return void
     */
    handleSelected (bool, selectedArr) {
      this.hasSelected = bool;
      this.multipleSelection = selectedArr;
      // if (this.hasSelected) {
      //   SERVICES.JHW_PURCHASE_ORDER.getDetailList(this.multipleSelection[0].id).then((res) => {
      //     let data = res.data.data
      //     if (data.length > 0) { 
      //       data.forEach(item => {
      //         if (item.unitPriceIncludingTax === '0') {
      //           this.isSumbit = false;
      //         } else {
      //           this.isSumbit = true;
      //         }
      //       })
      //     }
      //   })
      // }
    },
    /**
     * 展开明细行列表，并获取对应明细行数据
     * @param {Object} 当前点击行 id
     * @return void
     */
    rowClick (row) {
      this.headRowId = row.id
      // 渲染明细行表格
      this.showDetailTable = true
      // 获取明细行数据
      this.getDetailList();
    },
    /**
     * 获取明细行数据
     * @param {object} 点击行的 id数据
     * @return void
     */
    getDetailList () {
      this.mate.mateListLine.actions = []
      SERVICES.JHW_PURCHASE_ORDER.getDetailList(this.headRowId).then((res) => {
        console.log(res)
        if (res.data.code == 200) {
          let data = res.data.data
          if (data.length > 0) { 
            this.$set(this.mate.mateList, "lineRows", data);
            this.mate.mateListLine.rows = data
          }else {
            this.$set(this.mate.mateList, "lineRows", []);
            this.mate.mateListLine.rows = [];
          }
        } else {
          this.$message({
            type: 'warning',
            message: res.data.message
          });
          this.$set(this.mate.mateList, "lineRows", []);
          this.mate.mateListLine.rows = [];
        }
      });
    },
    /**
     * 打印订单
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
     ** Author: zhongxiaolong
     */
    handlePrint(act, row) {
      // 打印接口请求地址和传参
      let url = `${act.url}${row.id}`;
      SERVICES.BASE.handlePrinter(url).then(ren =>{}).catch(err =>{});
    },
    /**
     * 查看
     * @param {Object} act 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    detailsCost (act, row) {
       this.$root.monitor({ url: act.url + row.id })
    },
     /**
     * 重新渲染列表页
     * @param void
     * @return void
     */
    reRenderList() {
      this.$root.monitor({ url: `${this.listUrl}${this.params}` });
      this.getListData()
    },
    /**
    * 导入成功
    */
    uploadSuccess(res){
      this.getListData()
			this.$message({
				type: "success",
				message: "导入成功"
			});
    },
  }
}
</script>
