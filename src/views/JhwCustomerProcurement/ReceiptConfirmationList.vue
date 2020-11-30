<!-- created by hezhiqiang on 2020/05/16 -->
<!-- 收货确认 -->
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
    />
    <el-dialog title="维护信息" :visible.sync="formDialog" width="30%" :show-close="true" :close-on-click-modal="false">
      <el-form size="mini" :model="form" :inline="formInline" label-position="right" ref="form" :rules="rules" :label-width="labelWidth">
        <el-form-item label="签收人" prop="signedBy">
          <el-input :disabled="true" v-model.trim="form['signedBy']" placeholder="请输入签收人"></el-input>
        </el-form-item>
        <el-form-item label="签收数量" prop="signedInQuantity">
          <el-input type="number" v-model.trim="form['signedInQuantity']" placeholder="请输入签收数量" @blur="handleInput(form['signedInQuantity'])"></el-input>
        </el-form-item>
        <!-- <el-form-item label="收货仓库" prop="receivingWarehouse">
          <el-select
            clearable
            v-model.trim="form['receivingWarehouse']"
            placeholder="请选择收货仓库"
          >
            <el-option
              :label="item.name"
              :value="item.name"
              v-for="item of warehouseOptions"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="客户仓库" prop="warehouse">
          <dict-selected
            clearable
            :rowId="1"
            dictType="jhw_warehouse_type"
            v-model="form['warehouse']"
            :initValue="form['warehouse']"
            placeholder="请选择收货仓库"
          ></dict-selected>
        </el-form-item>
        <el-form-item label="收货仓库" prop="receivingWarehouse">
          <dict-selected
            clearable
            dictType="jhw_warehouse_type"
            v-model="form['receivingWarehouse']"
            :initValue="form['receivingWarehouse']"
            placeholder="请选择收货仓库"
          ></dict-selected>
        </el-form-item>
        <el-form-item label="签收日期" prop="signeDate">
           <el-date-picker :disabled="true" value-format="yyyy-MM-dd" size="mini" type="date" v-model="form['signeDate']" placeholder="请选择日期"></el-date-picker>
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
    KTableList,
    'dict-selected': function index (resolve) {
      require(['@/components/DictSelected.vue'], resolve)
    }
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
      params: '?listName=receipt_confirmation_list', // 元数据表名
      listUrl: '/common/toList',  // 元数据接口
      form: {
        signedBy: '',
        signedInQuantity: '',
        receivingWarehouse: '',
        signeDate: ''
      },
      warehouseOptions: [],   // 收货仓库数据
      formInline: false,             // 表单是否行内显示
      labelWidth: '120px',               // 表单字段宽度
      formDialog: false,     // 是否显示维护弹框
      rules: {
        signedInQuantity: [{required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: 'blur'}],
        receivingWarehouse: [{required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: 'blur'}],
      },
      listLineData: {},     // 暂存选择维护数据
    }
  },
  props: {
    mate: Object
  },
  created (){
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
    }
  },
  methods: {
    init(){
      // 获取列表数据
      this.getListData();
      // 获取供应商名称
      this.getSupplierList();
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
      SERVICES.STOCK_LIST.getPreservationList(param).then(res => {
        const data = res.data.data
        let total = data.total
        let rows = data.list;
        let page = data.pageNum;
        let size = data.size;
        this.mate.mateList = { ...this.mate.mateList, size, page, total, rows };
        rows.map(item => {
          this.$set(item,'signedInQuantity',item.deliveryQuantity)
        })
      })
    },
    /** 获取供应商列表
     * @param void
     * @return void
     ** Author: fengjing
     */
    getSupplierList () {
      let _this = this;
      SERVICES.BASE.getSupplierListUsable().then(res =>{
        let data = res.data;
        if (data.length=='0') return;
        let supplierList = [];
        data.forEach(item =>{
          if ((item.name == "") || (item.name == undefined) || (item.code == "")) return;
          supplierList.push({ 
            'label': item.name,
            'value': item.name,
            'name': item.name,
            'id': item.id,
          })
        })
        let chargeObj = _this.mate.mateSearch.fields.find(item => item.name==="supplierName") || {};
        chargeObj.options = supplierList;
      });
    },
    /**
     * 获取客户仓库
     * @param void
     * @return void
     */
    getWarehouse () {
      const param = {};
      SERVICES.STOCK_LIST.getWarehouse(param).then(res => {
        if (res.status === 200) {
          const data = res.data.data
          if (data.length) {
            this.warehouseOptions = data
          }
        }
      })
    },
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
      rows.map(item => {
        this.$set(item,'signedInQuantity',item.deliveryQuantity)
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
    handleButtons (btn, rowId, selection) {
      this.multipleSelection = selection;
      let action = btn.action;
      const rowIds = (rowId && rowId.id) ? rowId : { id: selection && selection.map(r => r.id) };
      const btnEvents = {
        preservation: (btn, rowIds) => this.handlePreservation(btn, rowIds),  // 收货确认
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
      console.log(this.listLineData)
      // 获取客户仓库
      // this.getWarehouse();
      // 默认签收人为当前登录用户
      let localStorage = window.localStorage;
      var localuser = JSON.parse(localStorage.getItem('user'));
      this.form.signedBy = (localuser.firstname + localuser.lastname);
      // 默认签收日期为当前时间
      let date = this.form.signeDate;
      this.form.signeDate = date || dateFormatter("YYYY-MM-DD");
      // 默认签收数量为列表出库数量
      this.form.signedInQuantity = this.listLineData.deliveryQuantity;
      // 客户仓库
      this.form.warehouse = this.listLineData.warehouse;
      // 默认收货仓库为列表收货仓库
      this.form.receivingWarehouse = this.listLineData.receivingWarehouse;
      // this.resetDialogForm(this.form);
    },
    /**
     * 校验签收数量 
     * 
     * */
    handleInput (val) {
      if (val > Number(this.listLineData.deliveryQuantity)) {
        this.$message({
          type: 'warning',
          message: `签收数量应小于等于出库数量${this.listLineData.deliveryQuantity}`
        })
        this.form.signedInQuantity = ''
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
            this.listLineData.signedBy = this.form.signedBy;
            this.listLineData.signedInQuantity = this.form.signedInQuantity;
            this.listLineData.receivingWarehouse = this.form.receivingWarehouse;
            this.listLineData.signeDate = this.form.signeDate;
            this.mate.mateList.rows.forEach((item,index)=>{
              if(item.id === this.listLineData.id){
                this.mate.mateList.rows.splice(index, 1, this.listLineData);
                this.resetDialogForm(this.form);
                this.formDialog = false;
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
      values['signedInQuantity'] = ""; // 签收数量
      values['receivingWarehouse'] = ""; // 收货仓库
    },
    /**
     * 提取 需要传给后台的数据
     * @params void
     * @return {Object} mate 头部数据和行数据
     ** 
     */
    saveData () {
      let data = {};
      let values = {};         // 头部数据
      // 默认当前时间
      // let date1 = values.issueDate || '';
      // let date2 = values.deliveryDate || '';
      // values.issueDate = date1 || dateFormatter("YYYY-MM-DD");
      // values.deliveryDate = date2 || dateFormatter("YYYY-MM-DD");
      // 默认当前登录用户
      let localStorage = window.localStorage;
      var localuser = JSON.parse(localStorage.getItem('user'));
      values.creator = (localuser.firstname + localuser.lastname);
      values.issueType = '1';
      values.customerNumber = this.multipleSelection[0].customerNumber;
      // values.quantity = this.multipleSelection[0].signedInQuantity;
      data.head = values;
      data.lineList = this.multipleSelection;
      this.multipleSelection.forEach(item => {
        if (item.signedInQuantity == '' || item.signedInQuantity == null) {
          this.$set(item,'signedInQuantity',item.deliveryQuantity)
          this.$set(item,'signedBy',localuser.firstname + localuser.lastname)
          // 默认当前时间
          let date = item.signeDate || '';
          this.$set(item,'signeDate',date || dateFormatter("YYYY-MM-DD"))
        };
      })
      //bug 3748 去掉校验
      // 相同单号的数据才能收货
      // for(var i=0;i<this.multipleSelection.length;i++) {
      //   for(var y=0;y<this.multipleSelection.length-1;y++) {
      //     if (this.multipleSelection[i].agricultureOutboundHeadid !== this.multipleSelection[y].agricultureOutboundHeadid) {
      //       this.$message({
      //         message:'请选择相同单号的数据收货',
      //         type: 'warning'
      //       })
      //       return false;
      //     }
      //   }
      // };
      return data;
    },
    /**
     * 保存按钮
     * @param void
     * @return void
     */
    handlePreservation(btn, rowIds) {
      let param = this.saveData();
      if (!param) return;
      SERVICES.STOCK_LIST.preservation(param).then(res => {
        if (res.data.code === 200) {
          this.$message({
            message: res.data.message,
            type: 'success'
          });
          this.reRenderList();
        }else{
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
<style scoped lang="scss">
.el-form-item__label {
  line-height: inherit;
}
.el-form--inline > * {
  margin-right: 10px;
}
.el-form-item {
  margin: 15px 20px 2px 0px;
}
.leftFloat .el-row {
  float: left;
  width: 250px;
}
.leftFloat .el-row input {
  width: 250px;
}
.leftFloat .el-form-item {
  margin: 0;
}
.leftFloat .button {
  float: left;
}
.el-form--inline .el-form-item {
  width: 200px;
  display: inline-block;
  margin-right: 10px;
  vertical-align: top;
}
.el-form-item.is-required .el-form-item__label:before {
  content: "";
}
.el-form-item.is-required .el-form-item__label:after {
  content: "*";
  color: #ff4949;
  margin-right: 4px;
}
.el-select {
  width: 100%;
}
.el-date-editor.el-input {
  width: 100%;
}
.el-form--inline.el-form--label-top .el-form-item__content {
  width: 90%;
}
.leftFloat .el-form--inline .el-form-item {
  margin-right: 10px;
}
.el-input__suffix {
  right: 80px;
}
.el-form-item--mini.el-form-item {
  margin: 15px;
}
.el-input--mini .el-input__inner {
  width: 80%;
}
.el-dialog__header {
  padding: 10px 10px 0;
}
.el-dialog__body {
  padding: 10px 10px;
}

</style>
