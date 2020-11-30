<!-- created by hezhiqiang on 2020/05/18 -->
<!-- 发货 -->
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
      @selectAll="selectAll"
    />
    <el-dialog title="维护信息" :visible.sync="formDialog" width="30%" :show-close="true" :close-on-click-modal="false">
      <el-form size="mini" :model="form" :inline="formInline" label-position="right" ref="form" :rules="rules" :label-width="labelWidth">
        <el-form-item label="本次发货数量" prop="quantityShipment">
          <el-input type="number" v-model.trim="form['quantityShipment']" placeholder="请输入本次发货数量" @blur="handleInput(form['quantityShipment'])"></el-input>
        </el-form-item>
        <el-form-item label="仓库" prop="warehouse">
          <dict-selected
            :rowId ="0"
            v-model.trim="form['warehouse']"
            dictType="jhw_warehouse_type"
            :initValue="form['warehouse']"
            placeholder="请选择仓库"
          ></dict-selected>
        </el-form-item>
        <el-form-item label="发货日期" prop="deliveryDate">
           <el-date-picker :disabled="true" value-format="yyyy-MM-dd" size="mini" type="date" v-model="form['deliveryDate']" placeholder="请选择日期"></el-date-picker>
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

export default {
  components: {
    KTableList,
    "dict-selected": function index(resolve) {
      require(["../../components/DictSelected.vue"], resolve);
    }
  },
  data(){
    return {
      isIndex: true,               // Table 是否渲染序号列
      isIndexDialog: true,          // 详情 Dialog Table 是否渲染序号列
      rowStatus: null,              // 列表订单行状态
      isShowSearchBtn: false,       // 是否显示搜索展开按钮
      multipleSelection: [],        // 勾选项数组
      querySize: 5 ,                 // 查询每页 size
      isHiddenResetBtn: false,       // 是否隐藏搜索重置按钮
      hasSelected: false,
      params: '?listName=deliver_goods_list', // 元数据表名
      listUrl: '/common/toList',  // 元数据接口
      form: {
        quantityShipment: '',
        warehouse: '',
        deliveryDate: ''
      },
      formInline: false,             // 表单是否行内显示
      labelWidth: '120px',               // 表单字段宽度
      formDialog: false,     // 是否显示维护弹框
      rules: {
        quantityShipment: [{required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: 'blur'}],
      },
      listLineData: {},     // 暂存选择维护数据
      isSelectAll: false,             // 是否全选
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
      this.getListData()
    },
    /**
     * 获取列表数据
     */
    getListData () {
      const param = {
        ifNeedPage: true
      };
      SERVICES.JHW_SALES_ORDER.getDeliverGoodList(param).then(res => {
        const data = res.data.data; // TODO 注意返回层级关系
        let { total, ...resData } = data;
        let rows = data.list;
        let page = data.pageNum;
        let size = data.size;
        this.mate.mateList = { ...this.mate.mateList, size, page, total, rows };
        rows.map(item => {
          // this.$set(item,'edit',true);
        })
      })
    },
    /**
     * 数据转换
     * 后台返回数据结构不统一做数据转换处理
     * @param {Object} data 数据
     * @return void
     */
    convertData(data) {
      let { pageSize, total, pageNum, list, ...resData } = data.data
      let rows = list;
      let page = pageNum;
      let size = pageSize;
      this.mate.mateList = { ...this.mate.mateList, size, page, total, rows };
      rows.map(item => {
        // this.$set(item,'edit',true);
      })
    },
    /**
     * 全是否选
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
        shipments: (btn, rowIds) => this.handleShipments(btn, rowIds),  // 发货
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
      this.listLineData = {...row};
      // 默认发货日期为当前时间
      let date = this.form.deliveryDate;
      this.form.deliveryDate = date || dateFormatter("YYYY-MM-DD");
      this.form.quantityShipment = this.listLineData.undeliveredQuantity
    },
    /**
     * 校验本次发货数量 
     * 
     * */
    handleInput (val) {
      if (val > Number(this.listLineData.undeliveredQuantity)) {
        this.$message({
          type: 'warning',
          message: `本次发货收数量应小于等于未发货数量${this.listLineData.undeliveredQuantity}`
        })
        this.form.quantityShipment = ''
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
          this.listLineData.quantityShipment = this.form.quantityShipment;
          this.listLineData.warehouse = this.form.warehouse;
          this.listLineData.deliveryDate = this.form.deliveryDate;
          this.mate.mateList.rows.forEach((item,index)=>{
            if(item.id === this.listLineData.id){
              this.mate.mateList.rows.splice(index, 1, this.listLineData);
              this.formDialog = false;
              this.resetDialogForm(this.form);
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
      values['quantityShipment'] = ""; // 本次发货数量
      values['warehouse'] = ""; // 仓库
    },
    /**
     * 提取 需要传给后台的数据
     * @params void
     * @return {Object} mate 头部数据和行数据
     ** 
     */
    saveData () {
      let data = {};
      let values = {}
      // 默认当前时间
      let date1 = values.issueDate || '';
      let date2 = values.deliveryDate || '';
      values.issueDate = date1 || dateFormatter("YYYY-MM-DD");
      values.deliveryDate = date2 || dateFormatter("YYYY-MM-DD");
      // 默认当前登录用户
      let localStorage = window.localStorage;
      var localuser = JSON.parse(localStorage.getItem('user'));
      values.creator = (localuser.firstname + localuser.lastname);
      values.state = '1';
      values.issueType = '1';
      values.customer = this.multipleSelection[0].customer;
      data.head = values;       // 头部字段
      let list = this.multipleSelection;
      data.lineList = list      // 列表数据
      this.multipleSelection.forEach(item => {
        if (item.quantityShipment == '' || item.quantityShipment == null) {
          this.$set(item,'quantityShipment',item.undeliveredQuantity)
          // 默认当前时间
          let date = item.deliveryDate || '';
          this.$set(item,'deliveryDate',date || dateFormatter("YYYY-MM-DD"))
        };
      })
      // 相同单号的数据才能发货
      // 2020-07-13 去掉判断条件
      // for(var i=0;i<this.multipleSelection.length;i++) {
      //   for(var y=0;y<this.multipleSelection.length-1;y++) {
      //     if (this.multipleSelection[i].agricultureOrderHeadid !== this.multipleSelection[y].agricultureOrderHeadid) {
      //       this.$message({
      //         message:'请选择相同单号的数据发货',
      //         type: 'warning'
      //       })
      //       return false;
      //     }
      //   }
      // };
      // 相同客户的数据才能发货
      for(var i=0;i<this.multipleSelection.length;i++) {
        for(var y=0;y<this.multipleSelection.length-1;y++) {
          if (this.multipleSelection[i].customer !== this.multipleSelection[y].customer) {
            this.$message({
              message:'请选择相同客户的数据发货',
              type: 'warning'
            })
            return false;
          }
        }
      };
      return data;
    },
    /**
     * 发货按钮
     * @param void
     * @return void
     */
    handleShipments(btn, rowIds) {
      let param = this.mate.mateSearch.values;
      if (this.isSelectAll) {
        param.ifSelectAll = true;
        param.lineIdList = [];
      } else {
        param.ifSelectAll = false;
        param.lineIdList = rowIds.id;
      };
      SERVICES.JHW_SALES_ORDER.deliverGoods(param).then(res => {
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
     * 打印送货单
     */
    handleDownload(act, rowId){
      // 打印接口请求地址和传参
      let url = `${act.url}${rowId}`;
      SERVICES.BASE.handlePrinter(url).then(ren =>{}).catch(err =>{});
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

