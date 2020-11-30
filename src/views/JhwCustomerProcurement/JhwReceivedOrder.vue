<!-- created by hezhiqiang on 2020/06/15 -->
<!-- 已收货单据 -->
<template>
  <div>
    <k-table-list ref="listTable" 
      :mate="mate" 
      :mateSearch="mate.mateSearch" 
      @btnClick="handleButtons"
      :isIndex="isIndex"
      @action="handleActions"
      :isIndexDialog="isIndexDialog"
      :isShowSearchBtn="isShowSearchBtn"
      :querySize="querySize"
      :isResetBtn="isHiddenResetBtn"
      @initQueryData="convertData"
      :stripe="false"
    />
    <el-dialog title="维护信息" :visible.sync="formDialog" width="30%" :show-close="true" :close-on-click-modal="false">
      <el-form size="mini" :model="form" :inline="formInline" label-position="right" ref="form" :rules="rules" :label-width="labelWidth">
        <el-form-item label="退货数量" prop="returnQuantity">
          <el-input type="number" v-model.trim="form['returnQuantity']" placeholder="请输入退货数量" @blur="handleInput(form['returnQuantity'])"></el-input>
        </el-form-item>
        <el-form-item label="退货原因" prop="returnReason">
          <el-input type="textarea" v-model.trim="form['returnReason']" placeholder="请输入退货原因"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-divider></el-divider>
        <el-button size='mini' @click="back">{{ $t('BUTTON_TEXT.CANCEL') }}</el-button>
        <el-button size='mini' type="primary" @click="submit">{{ $t('BUTTON_TEXT.OK') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { DateFormat } from '../../utils/util.js'
import KTableList from '@/components/table/KTableList'
import SERVICES from '@/services'
import {JHW_SALES_MANAGEMENT_API} from '@/services/apis'
import { dateFormatter } from "@/utils/DateUtils";
import axios from '@/utils/http';
import { resolve } from 'url';

export default {
  components: {
    KTableList
  },
  data(){
    return {
      isIndex: true,               // Table 是否渲染序号列
      isIndexDialog: true,          // 详情 Dialog Table 是否渲染序号列
      rowStatus: null,              // 列表订单行状态
      isShowSearchBtn: false,       // 是否显示搜索展开按钮
      multipleSelection: [],        // 勾选项数组
      querySize: 10,                 // 查询每页 size
      isHiddenResetBtn: false,       // 是否隐藏搜索重置按钮
      hasSelected: false,
      params: '?listName=jhw_received_order_list', // 元数据表名
      listUrl: '/common/toList',  // 元数据接口
      form: {
        returnQuantity: '',
        returnReason: ''
      },
      formInline: false,             // 表单是否行内显示
      labelWidth: '120px',               // 表单字段宽度
      formDialog: false,     // 是否显示维护弹框
      rules: {
        returnQuantity: [{required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: 'blur'}],
      },
      listLineData: {},     // 暂存选择维护数据
      tableData: [],   // 列表数据
    }
  },
  props: {
    mate: Object
  },
  created (){
    this.init();
  },
  mounted (){
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
    },
    // 监听列表默认选中
    tableData: function(newVal,oldVal) {
      this.$nextTick(()=>{
        this.tableData.forEach(row => {
          if (row.isRowChange) {
            this.$refs['listTable'].$refs['table'].$refs['table'].toggleRowSelection(row,true);
            // row.isRowChange = true
          }
        })
      })
    }
  },
  methods: {
    init(){
      // 获取列表数据
      this.getListData();
      // 获取供应商名称
      // this.getSupplierList();
    },
    /**
     * 获取列表数据
     * @param void
     * @return void
     */
    getListData () {
      const param = {
        ifNeedPage: true
      };
      SERVICES.JHW_PURCHASE_RETURN.getReceivedOrderList(param).then(res => {
        const data = res.data.data
        let total = data.total
        let rows = data.list;
        let page = data.pageNum;
        let size = data.size;
        this.mate.mateList = { ...this.mate.mateList, size, page, total, rows };
      })
    },
    /** 获取供应商列表
     * @param void
     * @return void
     ** Author: fengjing
     */
    // getSupplierList () {
    //   let _this = this;
    //   SERVICES.BASE.getSupplierListUsable().then(res =>{
    //     let data = res.data;
    //     if (data.length=='0') return;
    //     let supplierList = [];
    //     data.forEach(item =>{
    //       if ((item.name == "") || (item.name == undefined) || (item.code == "")) return;
    //       supplierList.push({ 
    //         'label': item.name,
    //         'value': item.name,
    //         'name': item.name,
    //         'id': item.id,
    //       })
    //     })
    //     let chargeObj = _this.mate.mateSearch.fields.find(item => item.name==="supplierName") || {};
    //     chargeObj.options = supplierList;
    //   });
    // },
    /**
     * 数据转换
     * 后台返回数据结构不统一做数据转换处理
     * @param {Object} data 数据
     * @return void
     */
    convertData({ pageSize, total, pageNum, list, ...resData}) {
      let rows = resData.data.list;
      let page = resData.data.pageNum;
      let size = resData.data.pageSize;
      total = resData.data.total;
      this.mate.mateList = { ...this.mate.mateList, size, page, total, rows };
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
        generateReturnForm: (btn, rowIds) => this.handleGenerateReturnForm(btn, rowIds),  // 生成退货单
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
        maintain: () => this.handleMaintain(act,row),  // 维护
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
    },
    /**
     * 维护列表字段
     */
    handleMaintain(act,row) {
      this.formDialog = true;
      this.listLineData = {...row}
      if (!this.listLineData.returnQuantity) {
        this.form.returnQuantity = (Number(this.listLineData.signedInQuantity) - Number(this.listLineData.returnedQuantity)).toFixed(2);
      } else {
        this.form.returnQuantity = this.listLineData.returnQuantity
      }     
      if (this.listLineData.returnReason) {
        this.form.returnReason = this.listLineData.returnReason;
      }
    },
    /**
     * 校验退货数量 
     * 
     * */
    handleInput (val) {
      let quantity = '';
      //退货数量 -- returnQuantity
      //签收数量 -- signedInQuantity
      //已退数量 -- returnedQuantity
      quantity = (Number(this.listLineData.signedInQuantity) -Number(this.listLineData.returnedQuantity)).toFixed(2);
      if (Number(val) > quantity) {
        this.$message({
          type: 'warning',
          message: `退货数量应小于等于剩余退货数量${quantity}`
        })
        this.form.returnQuantity = ''
      }
    },
    /**
     * 维护弹框确定
     * @param void
     * @return void
     */
    submit () {
      this.$refs['form'].validate((valid,obj) => {
          if (valid) {
            this.listLineData.returnQuantity = this.form.returnQuantity;
            this.listLineData.returnReason = this.form.returnReason;
            this.mate.mateList.rows.forEach((item,index)=>{
              if(item.id === this.listLineData.id){
                if(this.listLineData.returnQuantity){
                  this.listLineData.isRowChange = true;
                }
                this.mate.mateList.rows.splice(index, 1, this.listLineData);
                this.formDialog = false;
                this.resetDialogForm(this.form);
                this.tableData = this.mate.mateList.rows;
              }    
            })
          }
        })
    },
    /**
     * 维护弹框取消
     * @param void
     * @return void
     */
    back () {
      this.formDialog = false;
      this.resetDialogForm(this.form);
    },
    /**
     * 行表单数据初始化
     * @param {Object} values 表单数据
     * @return void
    */
    resetDialogForm (values){
      values['returnQuantity'] = ""; // 退货数量
      values['returnReason'] = ""; // 退货原因
    },
    /**
     * 提取 需要传给后台的数据
     * @params void
     * @return {Object} mate 头部数据和行数据
     ** 
     */
    saveData () {
      let data = [];
      data = this.multipleSelection;
      this.multipleSelection.forEach(item => {
        if (item.returnQuantity == '' || item.returnQuantity == null) {
          let quantity = Number(item.signedInQuantity) - Number(item.returnedQuantity)
          this.$set(item,'returnQuantity',quantity)
        };
      })
      // 相同单号的数据才能收货
      for(var i=0;i<this.multipleSelection.length;i++) {
        for(var y=0;y<this.multipleSelection.length-1;y++) {
          if (this.multipleSelection[i].agricultureOutboundHeadid !== this.multipleSelection[y].agricultureOutboundHeadid) {
            this.$message({
              message:'请选择相同出库单单号的数据退货',
              type: 'warning'
            })
            return false;
          }
        }
      };
      return data;
    },
    /**
     * 生成退货单按钮
     * @param void
     * @return void
     */
    handleGenerateReturnForm(btn, rowIds) {
      let param = this.saveData();
      if (!param) return;
      SERVICES.JHW_PURCHASE_RETURN.generateReturnForm(param).then(res => {
        if (res.data.code === 200) {
          this.$message({
            message: res.data.message,
            type: 'success'
          });
          this.reRenderList();
        }else {
          this.$message({
            message: res.data.message,
            type: 'warning'
          });
        }
      })
    },
    /**
     * 重新渲染列表页
     * @param void
     * @return void
     */
    reRenderList() {
      this.$root.monitor({ url: `${this.listUrl}${this.params}` });
      this.getListData();
    }
  }
}
</script>
