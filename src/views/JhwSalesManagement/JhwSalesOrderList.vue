<!-- created by hezhiqiang on 2020/05/16 -->
<!-- 销售订单 -->
<template>
  <div>
    <!-- headTable Start -->
    <KTableList
      :mate="mate"
      :mateSearch="mate.mateSearch"
      @btnClick="handleButtons"
      @action="handleActions"
      ref="listTable"
      :isIndex="isIndex"
      :isShowSearchBtn="isShowSearchBtn"
      :querySize="querySize"
      :formModel="formModel"
      @rowClick="rowClick"
      @initQueryData="convertData"
      @resetLineTable="showDetailTable=false"
      :stripe="false"
    />
    <!-- headTable END -->
    <!-- detailTable Start -->
    <main-table
      v-if="false"
      :mateList="mate.mateListLine"
      ref="lineTable"
    />
    <!-- detail End -->
    <!-- dialog Start -->
    <el-dialog title="生成供应商采购订单" :visible.sync="tableDialog" width="80%" :show-close="false" :close-on-click-modal="false">
      <h-btn :btns="['保存','取消']" @click="handleBtns" style="margin-bottom: 20px;"></h-btn>
      <main-table
        :mateList="mate.mateListLine"
        :checkType="'noCheck'"
        ref="dialogLineTable"
      />
      <k-table-line
        :isIndex="isIndex"
        :mate="mate.mateListOther"
        @actionSelected="handleSelected"
        @action="handleActions" 
        ref="orderLineTable"
      ></k-table-line>
    </el-dialog>
    <!-- dialog End -->
    <el-dialog title="修改" :visible.sync="formDialog" width="30%" :show-close="true" :close-on-click-modal="false">
      <el-form size="mini" :model="form" :inline="formInline" label-position="right" ref="form" :rules="rules" :label-width="labelWidth">
        <el-form-item label="客户收货仓库" prop="warehouse">
          <dict-selected
            :rowId ="1"
            v-model.trim="form['warehouse']"
            dictType="jhw_warehouse_type"
            :initValue="form['warehouse']"
          ></dict-selected>
        </el-form-item>
        <el-form-item label="采购类型" prop="purchaseType">
          <dict-selected
            :rowId ="0"
            v-model.trim="form['purchaseType']"
            dictType="jhw_purchase_types"
            :initValue="form['purchaseType']"
            placeholder="请选择采购类型"
          ></dict-selected>
        </el-form-item>
        <el-form-item label="供应商名称" prop="supplierName">
          <el-select
            clearable
            v-model.trim="form['supplierName']"
            placeholder="请选择供应商名称"
            @change="changeName(form['supplierName'])"
          >
            <el-option
              :label="item.name"
              :value="item.name"
              v-for="item of supplierList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量" prop="confirmQuantity">
          <el-input type="number" v-model.trim="form['confirmQuantity']" placeholder="请输入数量"></el-input>
        </el-form-item>
        <el-form-item label="要货日期" prop="confirmedDeliveryDate">
           <el-date-picker value-format="yyyy-MM-dd" size="mini" type="date" v-model="form['confirmedDeliveryDate']" placeholder="请选择日期"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-divider></el-divider>
        <el-button size='mini' @click="closeDialog">{{ $t('BUTTON_TEXT.CANCEL') }}</el-button>
        <el-button size='mini' type="primary" @click="submit">{{ $t('BUTTON_TEXT.OK') }}</el-button>
      </span>
    </el-dialog>
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
    KTableLine: function index(resolve) {
      require(["@/components/table/KTableLine.vue"], resolve);
    },
    "dict-selected": function index(resolve) {
      require(["../../components/DictSelected.vue"], resolve);
    }
  },
  data(){
    return {
      isIndex: true,               // table是否渲染序号
      showDetailTable: false,      // 是否渲染明细行表格
      headRowId: '',               // 头行id
      headRow: '',
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
      params: '?listName=jhw_sales_order_list&lineList=jhw_sales_order_line_list&otherLineList=jhw_supplier_purchase_order_list&listFormName=jhw_sales_order_form&lineForm=jhw_sales_order_line_form', // 元数据表名
      listUrl: '/common/toList',  // 元数据接口
      deleteUrl: '',              // 删除接口
      isEdit: false,              // 当前是否在编辑
      isMaintain: false,          // 是否是维护操作
      tableDialog: false,         // 生成供应商采购订单弹框显示/隐藏
      selectedIds: [],           // 所勾选行的序号
      selectedLines: [],         // 勾选行
      formDialog: false,
      supplierList: [],          // 供应商下拉值
      formInline: false,             // 表单是否行内显示
      labelWidth: '120px',               // 表单字段宽度
      form: {
        warehouse: '',
        supplierName: '',
        confirmQuantity: '',
        receivingAddress: '',
        contacts: '',
        confirmedDeliveryDate: '',
        purchaseType: ''
      },
      rules: {
        supplierName: [{required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: 'blur'}],
        confirmQuantity: [{required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: 'blur'}],
        confirmedDeliveryDate: [{required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: 'blur'}],
        purchaseType: [{required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: 'blur'}],
      },
      listLineData: {},     // 暂存选择修改的数据
      addressId: '',        // 地点id
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
      SERVICES.JHW_SALES_ORDER.getList(param).then(res => {
        const data = res.data.data; // TODO 注意返回层级关系
        let { total, ...resData } = data;
        let rows = data.list;
        let page = data.pageNum;
        let size = data.size;
        this.mate.mateList = { ...this.mate.mateList, size, page, total, rows };
        rows.forEach(item => {
          if (item.status == '未采购') {
            item.defaultBacColor = true;
          }
        })
      })
    },
    /**
     * 数据转换
     * 后台返回数据结构不统一做数据转换处理
     * @param {Object} data 数据
     * @return void
     * 
     */
    convertData(data) {
      let { pageSize, total, pageNum, list, ...resData } = data.data
      let rows = list;
      let page = pageNum;
      let size = pageSize;
      this.mate.mateList = { ...this.mate.mateList, size, page, total, rows };
      rows.forEach(item => {
        if (item.status == '未采购') {
          item.defaultBacColor = true;
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
    handleButtons (btn, row, selection) {
      this.multipleSelection = selection;
      let action = btn.action;
      const btnEvents = {
        delete: (btn) => this.handleDelete(btn),   // 删除
        editDetail: () => this.updateDetail(btn,row),    // 修改
        generateOrder: () => this.handleGenerateOrder(btn,row),     // 生成供应商采购订单
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(btn, row);
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
        details: () => this.detailsCost(act,row),     // 查看
        copyLine: () => this.copyLine(act,row),     // 复制
        editLine: () => this.editLine(act,row),     // 修改
        deleteLine: () => this.deleteLine(act,row),     // 删除
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
    },
    /**
     * 展开明细行列表，并获取对应明细行数据
     * @param {Object} 当前点击行 id
     * @return void
     */
    rowClick (row) {
      this.headRowId = row.id
      this.headRow = row
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
      const param = {
        agricultureOrderHeadid : this.headRowId
      }
      SERVICES.JHW_SALES_ORDER.getDetailList(param).then((res) => {
        let data = res.data.data.list
        this.$set(this.mate.mateList, "lineRows", data);
        this.mate.mateListLine.rows = data
      })
    },
    /** 新增弹窗按钮事件
     * @param {String} name 按钮名称
     * @return {Function} 按钮事件
     */
    handleBtns(name) {
      const btnEvents = {
        // 提交按钮
        save: () => this.handleSave(),
        // 取消按钮
        cancel: () => this.back(),
        // 默认
        default: () => { return }
      }
      return (btnEvents[name] || btnEvents.default)();
    },
    /**
     * checkbox 勾选计算 拿到勾选的序号数组
     * param {Boolean} hasSelected 是否有勾选
     * param {Array} multipleSelection 勾选数组 
     * @return void
     ** 
     */
    handleSelected(hasSelected, multipleSelection) {
      this.selectedLines = multipleSelection;
      // 第一步就是要清空selectedIds里面的所勾选行的序号
      this.selectedIds = [];
      // map方法也可以
      multipleSelection.forEach(item => this.selectedIds.push(item.index));
      // 每次点击都会执行这个函数，要点击两下的时候，this.selectedIds里面包括了前面一次的数据，所以会有重复，要去重
      let arr = [];
      arr = [...new Set(this.selectedIds)];
      this.selectedIds = arr;
    },
    /**
     * 修改
     * @param {Object} act 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    updateDetail(act, id){
      // 只能勾选一条数据
      if (this.multipleSelection.length > 1) {
        this.$message.warning("请选择一条数据修改");
        return
      }
      this.$store.dispatch('Common/setRowId', this.multipleSelection[0].id);
      this.$root.monitor({ url: act.url})
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
        return (item.state === '0');
      });
      if(this.multipleSelection.length > 1) {
        this.$message.warning("请选择一条数据进行删除");
        return
      }
      if(isAllow){
        SERVICES.JHW_SALES_ORDER.deleteDetail(this.multipleSelection[0].id).then((res) => {
          if (res.data.code === 200) {
            this.$message({
              message: res.data.message,
              type: 'success'
            });
            this.reRenderList();
          } else {
            this.$message({
              message: res.data.message,
              type: 'warning'
            });
          }
        })
      } else {
        this.$message.warning("请选择状态为新建或已驳回的预订单进行删除");
        return
      }
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
     * 生成供应商采购订单
     * @param {Object} act 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    handleGenerateOrder (btn,row) {
      if (this.multipleSelection.length > 1) {
        this.$message.warning("请选择一条数据");
        return
      };
      this.tableDialog = true;  // 弹框显示
      this.mate.mateListLine.actions = []; // 清空操作栏按钮
      // 获取第一个列表数据
      this.headRowId = this.multipleSelection[0].id;
      this.getDetailList();
      //获取第二个列表数据
      SERVICES.JHW_SALES_ORDER.generateOrder(this.headRowId).then(res => {
        if (res.data.code === 200) {
          let data = res.data.data;
          if (data.length > 0) {
            this.$set(this.mate.mateListOther,'rows',data)
            this.mate.mateListOther.rows.forEach(item => {
              // 默认线下采购
              this.$set(item,'purchaseType','2')
            })
          }
        } else {
          this.$message({
            message: res.data.message,
            type: 'warning'
          });
          this.$set(this.mate.mateListOther,'rows',[])
        }
      });
    },
    /**
     * 复制
     * @param {Object} act 当前点击的按钮配置信息
     * @param {Object} row 勾选行数据
     * @return void
     */
    copyLine (act, row) {
      let mateFormerValues = {...row};
      mateFormerValues.lineNo = String(this.mate.mateListOther.rows.length + 1);
      this.mate.mateListOther.rows.splice(row.lineNo-1, 0, mateFormerValues);
      this.initLineData(this.mate.mateListOther.rows)
    },
    /**
     * 修改
     * @param {Object} act 当前点击的按钮配置信息
     * @param {Object} row 勾选行数据
     * @return void
     */
    editLine (act, row) {
      this.formDialog = true;
      // 获取供应商列表
      this.getSupplierList();
      this.listLineData = {...row};
      this.form.warehouse = this.multipleSelection[0].warehouse
      this.form.purchaseType = this.listLineData.purchaseType;
      this.form.supplierName = this.listLineData.supplierName;
      this.form.confirmQuantity = this.listLineData.confirmQuantity;
      this.form.confirmedDeliveryDate = this.listLineData.confirmedDeliveryDate;
    },
    /**
     * 删除行
     * @param {Object} row 删除行信息
     */
    deleteLine(act, row){
      this.mate.mateListOther.rows.forEach((item,index)=>{
        if(item.lineNo === row.lineNo) {
          this.mate.mateListOther.rows.splice(index,1)
          this.mate.mateListOther.rows = this.initLineData(this.mate.mateListOther.rows);
        }
      })
    },
    /**
     * 修改弹框确定
     * @param void
     * @return void
     */
    submit () {
      this.$refs['form'].validate((valid,obj) => {
        if (valid) {
          this.listLineData.supplierName = this.form.supplierName;
          this.listLineData.receivingAddress = this.form.receivingAddress;
          this.listLineData.contacts = this.form.contacts;
          this.listLineData.confirmQuantity = this.form.confirmQuantity;
           this.listLineData.purchaseType = this.form.purchaseType;
          this.listLineData.confirmedDeliveryDate = this.form.confirmedDeliveryDate;
          let lineIndex = '';
          this.mate.mateListOther.rows.forEach((item,index)=>{
            if(item.lineNo === this.listLineData.lineNo){
              lineIndex = index;
            }    
          })
          if (lineIndex !== '') {
              this.$set(this.mate.mateListOther.rows,lineIndex,this.listLineData);
              this.formDialog = false;
              this.resetDialogForm(this.form);
          }
        }
      })
    },
    /**
     * 维护弹框取消
     * @param void
     * @return void
     */
     closeDialog () {
      this.formDialog = false;
      this.resetDialogForm(this.form);
    },
    /**
     * 行表单数据初始化
     * @param {Object} values 表单数据
     * @return void
    */
    resetDialogForm (values){
      values['supplierName'] = ""; // 供应商名称
      values['purchaseType'] = ""; // 采购类型
      values['confirmQuantity'] = ""; // 数量
      values['receivingAddress'] = ""; // 收货地址
      values['contacts'] = ""; // 联系人
      values['confirmedDeliveryDate'] = ""; // 要货日期
    },
    /** 获取供应商列表
     * @param void
     * @return void
     */
    getSupplierList () {
      SERVICES.BASE.getSupplierListUsable().then(res =>{
        let data = res.data;
        this.supplierList = data;
        if (data.length=='0') return;
        data.forEach(item =>{
          if ((item.name == "") || (item.name == undefined) || (item.code == "")) return;
          let addressList = [];
          if (item.addressList.length > 0){
            this.form.receivingAddress = item.addressList[0].name
            this.addressId = item.addressList[0].id
            if (this.addressId !== '') {
              this.$root.ajaxData('/contacts/all/' + this.addressId, {}, function (data) {
                if (data.length > 0) {
                 this.form.contacts = data[0].name
                }
              })
            }
          }
        })
      });
    },
    /**
     * 修改供应商名称
     */
    changeName (val) {
      this.supplierList.forEach(item => {
        if (item.name == val) {
          if (item.addressList.length > 0){
            this.form.receivingAddress = item.addressList[0].name
            this.addressId = item.addressList[0].id
          } else {
            this.form.receivingAddress = ''
            this.addressId = ''
          }
          if (this.addressId !== '') {
            this.$root.ajaxData('/contacts/all/' + this.addressId, {}, function (data) {
              if (data.length > 0) {
                this.form.contacts = data[0].name
              }
            })
          }
        }
      })
    },
    /**
     * 生成供应商采购订单弹框保存
     */
    handleSave () {
      if (this.selectedLines.length == 0) {
        this.$message({
          type: 'warning',
          message: '请选择表格数据保存'
        })
        return;
      };
      let name = [];  // 获取勾选行商品
      let arr = [];   // 获取勾选行商品去重后数据
      var total = 0;
      var isQuantity = false; // 判断数量是否允许保存
      var isName = false // 判断供应商名称是否允许保存
      this.selectedLines.forEach(item => {
        name.push(item.commodityName);
        arr = new Set(name);
      });
      let param = []; // 勾选行添加total存数组
      arr.forEach(i => {
        let data = {};
        data.key = i;
        data.total = 0
        data.purchasedQuantity = 0
        this.selectedLines.forEach(item => {
          item.agricultureOrderHeadid = this.headRowId
          item.amountIncludingTax = this.headRow.amountIncludingTax
          item.amountExcludingTax = this.headRow.amountExcludingTax
          item.orderTax = this.headRow.orderTax
          item.taxAmount = this.headRow.taxAmount
          if (i == item.commodityName) {
            data.total += Number(item.confirmQuantity);
            data.purchasedQuantity  += Number(item.purchasedQuantity)
            param.push(data);
          }
        })
      })
      // 遍历勾选行total与头上列表数量比较
      param.forEach(j => {
        this.mate.mateListLine.rows.forEach(item => {
          if (j.key == item.commodityName) {
            // 当前数量 + 已采购数量 > 头上确认数量
            if((j.total + j.purchasedQuantity) > item.confirmQuantity) {
              isQuantity = true;
            }
          }
        })
      });
      let obj = {};
      // 判断相同商品是否存在相同供应商名称
      let peon = this.selectedLines.reduce((cur,next) => {
        if(obj[next.supplierName+ '-' + next.commodityName]) {
          isName= true;
          return;
        } else {
          obj[next.supplierName+ '-' + next.commodityName] = next;
          cur.push(next)
        };
        return cur;
      },[]);//设置cur默认类型为数组，并且初始值为空的数组
      if (isName == true) {
        this.$message({
          type: 'warning',
          message: '供应商和商品编号如果重复,请合并数量保留一条数据'
        })
        return;
      };
      if (isQuantity == true) {
        this.$message({
          type: 'warning',
          message: '该商品已达到需求数量，不允许采购！'
          // message: '选择数据数量大于确认的数量，请修改后重新选择'
        })
        return;
      };  
      SERVICES.JHW_SALES_ORDER.saveOrder(this.selectedLines).then(res => {
        if (res.data.code === 200) {
          this.$message({
            message: res.data.message,
            type: 'success'
          });
          this.tableDialog = false;
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
     * 生成供应商采购订单弹框取消
     */
    back () {
      this.tableDialog = false;
    },
    /**
     * 初始化行数据
     * 添加索引 从 1 开始
     * 已实施状态赋值
     * @params {Object} data 行数据
     * @return {Object} data 行数据
     ** 
     */
    initLineData (data) {
      data.forEach((item,index) =>{
        // 设置索引 从 1 开始
        item.lineNo = index + 1;
      })
      return data;
    },
    /**
     * 递归自动生成序号 10/20/30....
     * 默认为 10 如果当前行序号有10了 则递增10
     * @param {Number} num 序号
     * @return {Number} number 序号
     ** 
     */
    createNum (num, step) {;
      let number = num || 1;
      let lineLen = this.mate.mateListLine.rows.length;
      if (this.checkNum(number)){
        number += step || 1;
        number = this.createNum(number, step);
      }
      return number;
    },
     /**
     * 重新渲染列表页
     * @param void
     * @return void
     */
    reRenderList() {
      this.$root.monitor({ url: `${this.listUrl}${this.params}` });
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

