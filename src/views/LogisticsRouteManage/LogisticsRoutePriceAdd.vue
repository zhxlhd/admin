<!-- created by yxj on 2019/12/11 -->
<!-- 物流线路定价 -->
<template>
  <div>
    <!-- 头部button Start-->
    <h-btn @click="handleBtns"></h-btn>
    <!-- 头部button End-->
    <!-- 头部Form Start-->
     <dynamic-form ref="headForm" 
                   :mate="mate.mateFormerHeader" 
                   :rules="headerFormRules" 
                   :eventCfg="headerFormEventConfig"
                   @events="handleEvents" 
                   @isDirty="dirtyChange"></dynamic-form>
    <!-- 头部Form End-->
    <!-- 底部 lineList Start-->
    <k-table-line
      :mate="mate.mateListLine"
      @actionSelected="handleSelected"
      @btnClick="handleButton"
      @action="handleActions"
      :toSort="toSort"
      ref="lineTable"
      @uploadSuccess="uploadSuccess"
      :btnDisable="btnDisable"
      :actDisable="actDisable"
      :actionWidth="actionWidth"
    ></k-table-line>
    <!-- 底部 lineList End-->
    <!-- 新增行弹窗 Start -->
    <el-dialog title="填写明细行" width="80%" v-if="dialogRender" :visible.sync="dialogFormVisible"  :before-close="lineDialogClose" >
      <dynamic-form ref="lineForm" 
                    :mate="mate.mateFormerLine" 
                    :rules="lineFormRules"
                    @events="handleEvents" 
                    @isDirty="dirtyChange"></dynamic-form>
      <el-row type="flex" justify="start">
        <el-button size="mini" @click="submitForm" type="primary">{{$t('BUTTON_TEXT.CONFIRM')}}</el-button>
        <el-button size="mini" @click="lineDialogClose">{{$t('BUTTON_TEXT.CANCEL')}}</el-button>
      </el-row>
    </el-dialog>
    <!-- 新增行弹窗 End -->
  </div>
</template>

<script>
import { LOGISTIC_BASIC_DATA_API } from "@/services/apis"
import SERVICES from "@/services";
import { dateFormatter } from "@/utils/DateUtils";

export default {
  components: {
    HBtn: function index(resolve){
      require(["@/components/Button/HBtn.vue"], resolve);
    },
    DynamicForm: function index(resolve){
      require(["@/components/form/DynamicForm.vue"], resolve);
    },
    KTableLine: function index(resolve) {
      require(["@/components/table/KTableLine.vue"], resolve);
    },
    KTableList: function index(resolve) {
      require(["@/components/table/KTableList.vue"], resolve);
    }
  },
  props: {
    mate: Object
  },
  data() {
    var checkDate = (rule, value, callback) => {
      if(value == '' || value == null) {
        callback();
      }
      if(new Date(this.mate['mateFormerHeader'].values['failureTime']) < new Date(this.mate['mateFormerHeader'].values['effectiveTime'])){
        callback(new Error('失效日期不能小于生效日期'));
      }else{
        callback();
      }
    };
    var checkEmail = (rule, value, callback) => {
      if(value.trim() == '' || value.trim() == null){
        return callback();
      }
      if(!/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(value.trim())){
        callback(new Error('请输入有效的邮箱'));
      }else{
        callback();
      }
    }
    return {
      actionWidth: "",           // action 操作列宽度
      selectedIds: [],           // 所勾选行的序号
      selectedLines: [],         // 勾选行
      headForm: {},              // 头部表单
      toSort: true,              // 是否本地排序 一般用于没有分页的列表
      dialogRender: true,        // 用作强制重新渲染弹窗
      dialogFormVisible: false,  // 新增行弹窗是否显示
      objectColumns: {},         // 列表行字段
      isEdit: false,             // 当前行是否在编辑
      isAddLine: false,          // 是否新增行
      isEditLine: false,         // 是否修改行
      isDirty: false,            // 是否修改了数据
      btnDisable: false,
      actDisable: false,
      timerOut: null,
      headerFormRules: {
        // 定价物流商
        logisticsProvideId: [{ required: true, message: "该输入项为必输项", trigger: "change", disabled: false }],
        // 定价日期
        priceDate: [{ required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }],
        // 定价线路
        logisticsRouteId: [{ required: true, message: "该输入项为必输项", trigger: "change", disabled: false }],
        // 价格生效日期
        effectiveTime: [{  trigger: 'change',validator: checkDate }],
        // 价格失效日期
        failureTime: [{  trigger: 'change',validator: checkDate }],
        // 物流商Email
        providerEmail: [{ trigger: "blur",validator:checkEmail, disabled: false }],
        // 定价人
        pricingPerson: [{ disabled: true }],
        // 是否报关
        isClearance: [{ disabled: true }],
        // 报关口岸
        passPort: [{ disabled: true, rowId:1 }],
        // 出货模式
        deliveryMode: [{ disabled: true }],
        // 运输方式
        transportMode: [{ disabled: true }],
        // 起点站点
        startStationId: [{ disabled: true }],
        // 终点站点
        endStationId: [{ disabled: true }],
      },
      lineFormRules: {
        // 费用名
        priceName: [{ required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }],
        // 单价
        price: [{ required: true, type:"number", message: "该输入项为必输项", trigger: "blur", disabled: false }],
      },
      headerFormEventConfig: {
        logisticsProvideId: { change: true },             // 定价物流商
        logisticsRouteId: { change: true }  // 定价线路
      },
      priceRouteList: [],      //定价线路列表
      isEdit: false,           //判断是否时修改
    };
  },
  created() {
    let mate = this.mate;
    // 列表行
    this.mate.mateListLine.columns.map(item => {
      this.objectColumns[item.name] = item;
    });
    mate.mateFormerHeader.fields.map((item) => { this.headForm[item.name] = item; });
    // 编辑
    let mateData = mate.mateData;
    if(mateData.routePrice && mateData.routePrice.id && mateData.routePrice.id !== '') {
      mate.mateFormerHeader.values = mateData.routePrice;
      mate.mateListLine.rows = this.initLineData(mateData.routePriceLineList);
      // 为保证物流线路定价的唯一，置灰
      this.isEdit = true;
      this.headerFormRules['logisticsProvideId'][0].disabled = true;
      this.headerFormRules['logisticsRouteId'][0].disabled = true;
    }
  },
  mounted() {
    // 获取定价物流商下拉列表
    this.getLogisticsProvidersList();
    // 获取起点、终点下拉列表
    this.getStationList();
    // 获取定价线路下拉列表
    this.getPriceRouteList();
    // 创建日期默认值，默认为当天
    let date = this.mate.mateFormerHeader.values.priceDate || '';
    this.mate.mateFormerHeader.values.priceDate = date || dateFormatter("YYYY-MM-DD HH:mm:ss");
    // 创建人默认获取当前用户
    const localStorage = window.localStorage;
    var localuser = JSON.parse(localStorage.getItem('user'));
    this.mate.mateFormerHeader.values.createBy = localuser.id ||'';
    this.mate.mateFormerHeader.values.pricingPerson = (localuser.firstname + localuser.lastname) ||'';
  },
  methods: {
    /** 头部按钮事件
     * @param {String} name 按钮名称
     * @return {Function} 按钮事件
     */
    handleBtns(name) {
      const btnEvents = {
        // 提交按钮
        submit: () => this.handleSubmit(),
        // 提交按钮
        save: () => this.handleSave(),
        // 取消按钮
        cancel: () => this.backward(),
        // 重置按钮
        reset: () => this.handleReset(),
        // 默认
        default: () => { return }
      }
      return (btnEvents[name] || btnEvents.default)();
    },
    /**
     * 公共模块 KTableLine 按钮事件
     * @param {Object} btn 当前按钮信息
     * @param {Object} row 当前行信息
     * @return void
     */
    handleButton(btn, row) {
      this.row = row;
      this.btn = btn;
      let action = btn.action;
      const btnEvents = {
        // 新增
        addLine: () => this.addLine(),
        // 编辑行
        editLine: () => this.editLine(),
        // 删除行
        deleteLine: () => this.deleteLine(),
        // 默认
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)();
    },
    handleActions(act, row) {
      let action = act.action;
      const btnEvents = {
        // 编辑行
        editLine: () => this.editRemark(act, row),
        // 默认
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)();
    },
    /**
     * 提交表单数据
     * @param void
     * @return void
     */
    handleSubmit() {
      let mate = {};
      let _this = this;
      let [url,next] = [this.mate.mateFormerHeader.url,this.mate.mateFormerHeader.next];
      this.$refs['headForm'].$refs["form"].validate(valid => {
        if (valid) {
          mate = _this.saveData();
          if (!mate) return;
          SERVICES.BASE.handleSave(url, mate).then((res) =>{
            let status = res.status; 
            if(status === 200){
              _this.$root.monitor({url: next});
            }else{
              _this.$message({
                  type: "warning",
                  message: this.$t("TIPS_WARNING.ADD_FAIL")
              });
            }
          }).catch(function (err) {
            
          });
        }
      });
    },
    /** 动态表单事件管理
     * @param {String} event 事件名称
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     */
    handleEvents(event, val, name) {
      const eventControl = {
        change: (val, name) => this.handleLogisticsRouteIdChange(val, name),
        default: () => { return }
      }
      return (eventControl[event] || eventControl.default)(val, name);
    },
    /** change 事件 定价线路选择相关的 是否报关、报关口岸、出货模式、运输方式、起点站点、终点站点自动关联
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     */
    handleLogisticsRouteIdChange(val, name) {
      switch (name) {
        case 'logisticsRouteId':  // 定价线路
          // 前端展示 是否报关、报关口岸、出货模式、运输方式、起点站点、终点站点自动关联
          this.$set(this.mate.mateFormerHeader.values, 'isClearance', this.pickDataByRouteCode(val, 'isClearance'));
          this.$set(this.mate.mateFormerHeader.values, 'passPort', this.pickDataByRouteCode(val, 'passPort'));
          this.$set(this.mate.mateFormerHeader.values, 'deliveryMode', this.pickDataByRouteCode(val, 'deliveryMode'));
          this.$set(this.mate.mateFormerHeader.values, 'transportMode', this.pickDataByRouteCode(val, 'transportMode'));
          this.$set(this.mate.mateFormerHeader.values, 'startStationId', this.pickDataByRouteCode(val, 'startStationId'));
          this.$set(this.mate.mateFormerHeader.values, 'endStationId', this.pickDataByRouteCode(val, 'endStationId'));
          // 起点、终点的省市区
          this.$set(this.mate.mateFormerHeader.values, 'startProvinceCode', this.pickDataByRouteCode(val, 'startProvinceCode'));
          this.$set(this.mate.mateFormerHeader.values, 'startCityCode', this.pickDataByRouteCode(val, 'startCityCode'));
          this.$set(this.mate.mateFormerHeader.values, 'startAreaCode', this.pickDataByRouteCode(val, 'startAreaCode'));
          this.$set(this.mate.mateFormerHeader.values, 'startStreetCode', this.pickDataByRouteCode(val, 'startStreetCode'));
          this.$set(this.mate.mateFormerHeader.values, 'endProvinceCode', this.pickDataByRouteCode(val, 'endProvinceCode'));
          this.$set(this.mate.mateFormerHeader.values, 'endCityCode', this.pickDataByRouteCode(val, 'endCityCode'));
          this.$set(this.mate.mateFormerHeader.values, 'endAreaCode', this.pickDataByRouteCode(val, 'endAreaCode'));
          this.$set(this.mate.mateFormerHeader.values, 'endStreetCode', this.pickDataByRouteCode(val, 'endStreetCode'));
          break;
        case 'logisticsProvideId':  // 定价物流商
          break;
        default:break;
      }
      if(!this.isEdit){
        this.checkRouteIdAndProvideId(name);
      }
    },
    /**
     * 提取提交和保存
     * 需要传给后台的数据
     * @params void
     * @return {Object} mate 头部数据和行数据
     */
    saveData () {
      let mate = {};
      mate.routePrice = this.mate.mateFormerHeader.values;
      mate.routePriceLineList = this.mate.mateListLine.rows;
      if (mate.routePriceLineList.length < 1) {
        // 保存的时候明细行不能为空
        this.$message({
          type: "warning",
          message: "明细行不能为空"
        });
        this.submitBtnDisabled = false;
        return false;
      }
      return mate;
    },
    /**
     * 取消返回Ecn List页面
     * @param void
     * @return void
     */
    backward() {
      if(this.isEdit){
        this.$confirm("数据未提交,是否离开当前页面?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.backToList();
        }).catch(() => {
          this.$message({
            type: "info",
            message: "取消离开"
          });
        });
      }else{
        this.backToList();
      }
    },
    /**
     * checkbox 勾选计算 拿到勾选的序号数组
     * param {Boolean} hasSelected 是否有勾选
     * param {Array} multipleSelection 勾选数组 
     * @return void
     */
    handleSelected(hasSelected, multipleSelection) {
      this.selectedLines = multipleSelection;
      // 第一步就是要清空selectedIds里面的所勾选行的序号
      this.selectedIds = [];
      // map方法也可以
      multipleSelection.forEach(item => this.selectedIds.push(item.serialNumber));
      // 每次点击都会执行这个函数，要点击两下的时候，this.selectedIds里面包括了前面一次的数据，所以会有重复，要去重
      let arr = [];
      arr = [...new Set(this.selectedIds)];
      this.selectedIds = arr;
    },
    /**
     * 新增行
     * @param void
     * @return void
     */
    addLine () {
      // 该操作是新增行 改变新增行状态
      this.isAddLine = true;
      // 显示弹窗
      this.lineDialogShow();
      this.clearDialogFrom(this.mate.mateFormerLine.values);
    },
    /**
     * 编辑行
     */
    editLine () {
      // 编辑行
      if (this.selectedLines.length !== 1) {
        this.$message({
          message: this.$t("seladata"),
          type: "warning"
        });
        return;
      }
      // 该操作是编辑行 改变编辑行状态
      this.isEditLine = true;
      this.lineDialogShow();
      this.mate.mateFormerLine.values = {...this.selectedLines[0]};
    },
    /**
     * 删除行
     * @param void
     * @return void
     */
    deleteLine () {
      let _this = this;
      this.$confirm("此操作将删除该行, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let selectedLines = _this.selectedLines;
        let selectedIds = _this.selectedIds;
        selectedLines.forEach((item, index) => {
          this.mate.mateListLine.rows.forEach((lineItem,index2) => {
            if(item.index == lineItem.index) {
              this.mate.mateListLine.rows.splice(index2,1);
            }
          });
        });
      }).catch(() => {
        _this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    },
    /**
     * 上传成功
     * 暂时留用 todo
     */
    uploadSuccess(data) {
      this.isEdit = true;
      data = this.initLineData(data);
      this.mate.mateListLine.rows = data;
      this.$message({
        type:'success', 
        message:`成功导入“ ${data.length} ”条任务`
      })
    },
    /**
     * 行新增/修改确认
     * @param {Object} val 行表单数据
     * @return void
     */
    submitForm(val) {
      let _this = this;
      let mate = this.mate;
      let lineId = mate.mateFormerLine.values.id;
      // 验证表单 通过后保存信息到列表行中
      this.$refs['lineForm'].$refs['form'].validate((valid,obj) => {
        if (valid) {
          let curIdx = mate.mateFormerLine.values.index;
          let values = mate.mateFormerLine.values;
          // 是否是编辑
          if (_this.isEditLine){
            mate.mateListLine.rows.map((item, index) => {
              if (curIdx === item.index) {
                let mateFormerValues = Object.assign({},values);
                // splice将i行数据删除，并将mateFormerValues1填充进
                mate.mateListLine.rows.splice(index, 1, mateFormerValues);
              }
            });
          }
          // 是否是新增
          if (_this.isAddLine) {
            values.index = mate.mateListLine.rows.length + 1;
            // 新增行时加 id=0
            values.id = 0;
            let mateFormerValues = Object.assign({},values);
            mate.mateListLine.rows.push(mateFormerValues);
          }
          _this.lineDialogClose();
        }else{
          console.log('un vailid');
        }
      });
    },
    /**
     * 重置新增行、编辑行状态
     * @params void
     * @return void
     */
    resetLineState () {
      this.isAddLine = false;
      this.isEditLine = false;
    },
    /**
     * 初始化行数据
     * 添加索引 从 1 开始
     * 已实施状态赋值
     * @params {Object} data 行数据
     * @return {Object} data 行数据
     */
    initLineData (data) {
      data.forEach((item,index) => {
        // 设置索引 从 1 开始
        item.index = index + 1;
      });
      return data;
    },
    /**
     * 清空行数据
     * @param void
     * @return void
     */
    clearLineList (){
      this.mate.mateListLine.rows = [];
    },
    /**
     * 新建行弹窗取消
     * 隐藏弹窗并弹窗初始化
     * @param void
     * @return void
     */
    lineDialogClose () {
      // 隐藏行弹窗
      this.lineDialogHide();
      // 重新渲染行弹窗
      this.reRenderLineDialog();
      // 重置行状态
      this.resetLineState();
    },
    /**
     * 显示弹窗
     * @param void
     * @return void
     */
    lineDialogOpen () {
      this.lineDialogShow();
    },
    /**
     * 隐藏弹窗
     * 重置弹窗表单
     * @param void
     * @return void
     */
    lineDialogHide() {
      this.dialogFormVisible = false;
      this.resetForm('lineForm');
    },
    lineDialogShow () {
      this.dialogFormVisible = true;
    },
    /**
     * 重新渲染行表单弹窗
     * @param void
     * @return void
     */
    reRenderLineDialog () {
      this.dialogRender = false;
      this.$nextTick(()=>{
        this.dialogRender = true;
      })
    },
    /**
     * 重置弹窗表单
     * 数据清空，验证信息重置
     * @param {String} formName 需要重置的表单 ref 名称
     * @return void
     */
    resetForm (formName) {
      this.$refs[formName].resetForm();
    },
    /**
     * 行表单数据初始化
     * 自动生成序号
     * @param {Object} values 表单数据
     * @return void
     */
    clearDialogFrom (values){
      for(let item in values) {
        values[item] = '';
      }
    },
    dirtyChange(bool) {
      this.isDirty = bool;
    },
    /**
     * 刷新tab页签
     * @param void
     * @return void
     */
    backToList () {
      this.$root.monitor({ url: LOGISTIC_BASIC_DATA_API.LOGISTICS_ROUTE_PRICE_LIST });
    },
    /**
     * 获取定价物流商名称列表
     * @param void
     * @return void
     */
    getLogisticsProvidersList() {
      SERVICES.LOGISTICS_BASE_DATA.getLogisticsProvidersListByType().then(res => {
        if(res.data.length>0){
          let logisticsProviderIdOptions = [];
          let data = res.data;
          if(data.length){
            data.forEach(item => {
              logisticsProviderIdOptions.push({
                label: item.providerName,
                value: item.id,
                id: item.id
              });
            });
            // 物流商名称保存到表单配置中
            this.headForm['logisticsProvideId'].options = logisticsProviderIdOptions;
          }
        }
      });
    },
    /**
     * 获取定价线路 下拉列表
     * @param void
     * @return void
     * ***/
    getPriceRouteList() {
      SERVICES.LOGISTICS_BASE_DATA.routePriceList().then(res =>{
        if(res.data.length>0){
          let routeOptions = [];
          let data = res.data;
          this.priceRouteList = data;
          if(data.length){
            data.forEach(item => {
              routeOptions.push({
                label: item.routeName,
                value: item.id,
                id: item.id
              })
            });
            //定价路线保存到表单配置中
            this.headForm['logisticsRouteId'].options = routeOptions;
          }
          // 当是修改时 代码自动调用 定价线路的change事件显示关联组建的值
          if(this.isEdit && this.priceRouteList.length>0){
            // logisticsRouteId不需要校验为空，logisticsRouteId是必填项
            this.handleLogisticsRouteIdChange(this.mate.mateFormerHeader.values['logisticsRouteId'], null);
          }
        }
      });
    },
    /**
     * 获取起点、终点 站点下拉列表
     * @param void
     * @return void
     * ***/
    getStationList() {
      SERVICES.LOGISTICS_BASE_DATA.stationList().then(res =>{
        if(res.data.length>0){
          let stationOptions = [];
          let data = res.data;
          if(data.length){
            data.forEach(item => {
              stationOptions.push({
                  label: item.stationName,
                  value: item.id,
                  id: item.id
              })
            });
            // 起点、终点 站点保存到表单配置中
            this.headForm['startStationId'].options = stationOptions;
            this.headForm['endStationId'].options = stationOptions;
          }
        }
      });
    },
    /**
     * 提取提交和保存
     * 需要传给后台的数据
     * @params {String} id 定价线路id、backDataName需要查找返回的字段
     * @return {Object} mate 头部数据和行数据
     */
    pickDataByRouteCode(id, backDataName) {
      if(this.priceRouteList.length>0) {
        let backName = '';
        this.priceRouteList.forEach(item => {
          if(item.id == id) {
            backName = item[backDataName];
          }
        });
        return backName;
      }
    },
    /**
     * 同一线路+物流商应校验唯一
     * @params {String} name 传递定价物流商字段name或者定价线路字段name，以区分当前清空哪个字段
     * @return {Object} mate 头部数据和行数据
     */
    checkRouteIdAndProvideId(name) {
      if(this.mate.mateFormerHeader.values['logisticsProvideId'] ==''|| this.mate.mateFormerHeader.values['logisticsRouteId'] =='') {
        return;
      }
      SERVICES.LOGISTICS_BASE_DATA.checkRouteIdAndProvideId(this.mate.mateFormerHeader.values['logisticsProvideId'], this.mate.mateFormerHeader.values['logisticsRouteId'])
        .then(res => {
          if(!res.data.status){
            this.$message({
              message: '同一线路的物流商要唯一，物流线路定价列表已存在',
              type: "warning"
            });
            this.mate.mateFormerHeader.values[name] = '';
            this.handleLogisticsRouteIdChange('', name);
          }
      });
    },
  }
};
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
.el-cascader {
  width: 100%;
}
.hidden {
  display: none;
}
h4 {
  margin-top: 40px;
  margin-bottom: 10px;
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
.tbutton {
  margin: 3px 0;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}
.fbutton {
  margin: 5px 0;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}
.el-input__suffix {
  right: 80px;
}
.el-form-item--mini.el-form-item {
  margin: 6px;
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
.el-button--mini {
  padding: 7px 9px;
}
.pbutton {
  margin: 3px 0;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}
</style>
