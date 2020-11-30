
<!-- created by hezhiqiang on 2019/11/28 -->
<!-- 提货单新增模块 -->
<template>
  <div>
    <!-- 头部button Start-->
    <div class="tbutton">
      <el-button size="mini" plain class="el-icon-document" :disabled="submitBtnDisabled" @click="handleSubmit" >提 交</el-button>
      <el-button size="mini" plain class="el-icon-close" @click="backward">取 消</el-button>
    </div>
    <!-- 头部button End-->
    <!-- 头部Form Start-->
    <DeliveryOrderHeaderForm
      ref="headForm"
      :mate="mate"
      :labelWidth="labelWidth"
      @events="handleEvents"
      @isDirty="dirtyChange"
    />
    <!-- 头部Form End-->
    <!-- 中间 routeList Start-->
    <div class="route">
      <span class="titleStyle">线路信息</span>
      <el-row>
        <KTableLine
          :mate="mate.mateList2"
          @actionSelected="handleSelected"
          @btnClick="handleButtons"
          @action="handleActions"
          :toSort="toSort"
          ref="lineTable"
          :btnDisable="btnDisable"
          :actDisable="actDisable"
          :actionWidth="actionWidth"
        />
      </el-row>
    </div>
    <!-- 中间 routeList End-->
    <!-- 底部 detailList Start-->
    <div class="detail">
      <span class="titleStyle">明细行信息</span>
      <el-row>
        <KTableLine
          :mate="mate.mateList3"
          @actionSelected="handleSelected"
          @btnClick="handleButtons"
          @action="handleActions"
          :toSort="toSort"
          ref="lineTable"
          :btnDisable="btnDisable"
          :actDisable="actDisable"
          :actionWidth="actionWidth"
        />
      </el-row>
    </div>
    <!-- 底部 detailList End-->
    <!-- 新增路线弹窗 Start -->
    <el-dialog title="填写线路信息" width="80%" v-if="dialogRender" :visible.sync="dialogRouteFormVisible"  :before-close="routeDialogClose" >
      <DeliveryOrderRouteForm
        ref="routeForm"
        :mateRouteHeader="mate.mateRouteHeader"
        :mateListData="mate.mateList2.rows"
        :LogisticsProviderId="this.logisticsProviderId"
        :routeValues="routeValues"
        :labelWidth="labelWidth"
      />
      <el-row type="flex" justify="start">
        <el-button size="mini" @click="submitRouteForm" type="primary">{{$t('BUTTON_TEXT.CONFIRM')}}</el-button>
        <el-button size="mini" @click="routeDialogClose">{{$t('BUTTON_TEXT.CANCEL')}}</el-button>
      </el-row>
    </el-dialog>
    <!-- 新增路线弹窗 End -->
    <!-- 新增销售订单出货行弹窗 Start -->
    <el-dialog title="填写销售订单出货行" width="80%" v-if="dialogRender"  :visible.sync="deliveryNoticeDialog"  :before-close="deliveryNoticeDialogClose" >
      <DeliveryNoticeForm
        ref="deliveryNoticeForm"
        :mate="mate"
        :rules="formRules"
        @events="handleEvents"
      />
      <el-row type="flex" justify="start">
        <el-button size="mini" @click="submitDeliveryNoticeForm" type="primary">{{$t('BUTTON_TEXT.CONFIRM')}}</el-button>
        <el-button size="mini" @click="deliveryNoticeDialogClose">{{$t('BUTTON_TEXT.CANCEL')}}</el-button>
      </el-row>
    </el-dialog>
    <!-- 新增销售订单出货行弹窗 End -->
    <!-- 新增系统外出货行弹窗 Start -->
    <el-dialog title="填写系统外出货行" width="80%" v-if="dialogRender" :visible.sync="dialogDetailFormVisible"  :before-close="detailDialogClose" >
      <DeliveryOrderDetailForm
        ref="detailForm"
        :mateDetailHeader="mate.mateDetailHeader"
        :detailValues="detailValues"
        :labelWidth="labelWidth"
      />
      <el-row type="flex" justify="start">
        <el-button size="mini" @click="submitDetailForm" type="primary">{{$t('BUTTON_TEXT.CONFIRM')}}</el-button>
        <el-button size="mini" @click="detailDialogClose">{{$t('BUTTON_TEXT.CANCEL')}}</el-button>
      </el-row>
    </el-dialog>
    <!-- 新增系统外出货行弹窗 End -->
  </div>
</template>

<script>
import { LOGISTICS_ORDER_API } from "@/services/apis"
import SERVICES from "@/services"

export default {
  components: {
    DeliveryOrderHeaderForm: function index(resolve){
      require(["./components/DeliveryOrderHeaderForm.vue"], resolve);
    },
    DeliveryOrderDetailForm: function index(resolve){
      require(["./components/DeliveryOrderDetailForm.vue"], resolve);
    },
    DeliveryOrderRouteForm: function index(resolve){
      require(["./components/DeliveryOrderRouteForm.vue"], resolve);
    },
    KTableLine: function index(resolve) {
      require(["@/components/table/KTableLine.vue"], resolve);
    },
    DeliveryNoticeForm: function index(resolve) {
      require(["./components/DeliveryNoticeForm.vue"], resolve);
    },
    DynamicForm: function index(resolve){
      require(["@/components/form/DynamicForm.vue"], resolve);
    }
  },
  props: {
    mate: Object
  },
  data() {
    return {
      actionWidth: "60",               // action 操作列宽度
      selectedIds: [],                 // 所勾选行的序号
      selectedLines: [],               // 勾选行
      headForm: {},                    // 头部表单
      detailValues: {},                // 新增系统外出货行表单默认数据
      routeValues: {},                 // 新增线路表单默认数据
      toSort: true,                    // 是否本地排序 一般用于没有分页的列表
      showDict: '',                    // 数字词典是否禁用 '1'/'0'
      submitBtnDisabled: false,        // 提交按钮是否禁用
      dialogRender: true,              // 用作强制重新渲染弹窗
      dialogRouteFormVisible: false,   // 新增路线弹窗是否显示
      dialogDetailFormVisible: false,  // 新增系统外出货行弹窗是否显示
      detailColumns: {},               // 明细行列表字段
      routeColumns: {},                // 路线列表字段
      btnDisable: false,
      actDisable: false,
      isAddLine: false,                // 是否新增系统外出货行
      isEditOutSystemLine: false,      // 是否修改系统外出货行
      isEidtDeliveryNoticeLine: false, // 是否修改销售订单出货行
      isAddRoute: false,               // 是否新增路线
      isEditRoute: false,              // 是否修改路线
      deliveryNoticeDialog: false,     // 新增销售订单出货行弹窗
      logisticsProviderId: '',
      logisticsProviderPhone: '',
      logisticsProviderEmail: ''
    };
  },
  created() {
    let mate = this.mate
    mate.mateList3.columns.map(item => {          // 明细行列表
      this.detailColumns[item.name] = item;
    });
    mate.mateList2.columns.map(item => {          // 线路列表
      this.routeColumns[item.name] = item;
    });
    mate.mateFormerHeader.fields.map((item) => { this.headForm[item.name] = item; });      // 头部表单字段
    this.routeValues = {...this.mate.mateRouteHeader.values};       // 保存线路列表默认数据
    this.detailValues = {...this.mate.mateDetailHeader.values};     // 保存明细行默认数据
    if (mate.mateFormerHeader.values.isEdit === 0) {           // 查看置灰提交按钮
      this.submitBtnDisabled = true
    }
  },
  mounted() {
    let _this = this
    this.$bus.on('lodisticsProviderInfoId', function (params) {
      _this.logisticsProviderId = params.logisticsProviderId
    })
    this.$bus.on('lodisticsProviderInfoPhone', function (params) {
      _this.logisticsProviderPhone = params.logisticsProviderPhone
    })
    this.$bus.on('lodisticsProviderInfoEmail', function (params) {
      _this.logisticsProviderEmail = params.logisticsProviderEmail
    })
  },
  beforeDestroy  () {
    this.$bus.off('lodisticsProviderInfoId', {})
    this.$bus.off('lodisticsProviderInfoPhone', {})
    this.$bus.off('lodisticsProviderInfoEmail', {})
  },
  watch: {
  },
  computed: {
    labelWidth: function() {
      let width = "";
      if (this.mate.inline) {
        width = "120px";
      } else if (typeof this.mate.labelWidth === "undefined") {
        width = "120px";
      } else {
        width = this.mate.labelWidth;
      }
      return width;
    }
  },
  methods: {
    /**
     * 公共模块 KTableLine 按钮事件
     * @param {Object} btn 当前按钮信息
     * @param {Object} row 当前行信息
     * @return void
     */
    handleButtons(btn, row) {
      this.row = row;
      this.btn = btn;
      let action = btn.action;
      const btnEvents = {
        // 新增线路
        addRoute: () => this.addRoute(),
        // 编辑线路
        editRoute: () => this.editRoute(),
        // 删除线路
        deleteRoute: () => this.deleteRoute(),
        // 新增销售订单出货行
        addDeliveryNoticeLine: () => this.addDeliveryNoticeLine(),
        // 新增系统外出货行
        addSystemOuterLine: () => this.addSystemOuterLine(),
        // 编辑明细行
        editLine: () => this.editLine(),
        // 删除明细行
        deleteLine: () => this.deleteLine(),
        // 默认
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)();
    },
    handleActions(act, row) {
      let action = act.action;
      const btnEvents = {
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
      this.submitBtnDisabled = true;
      let id = this.mate.mateFormerHeader.values.id
      let mate = {};
      let _this = this;
      /** 校验表单 */
      this.$refs['headForm'].$refs["deliveryDemandForm"].validate(valid => {
        if (valid) {
          this.deliveryDemandValid = true
        } else {
           this.submitBtnDisabled = false;
        }
      });
      this.$refs['headForm'].$refs["baseInfoForm"].validate(valid => {
        if (valid) {
          this.baseInfoValid = true
        } else {
           this.submitBtnDisabled = false;
        }
      });
      if (this.deliveryDemandValid && this.baseInfoValid) {
        mate = _this.saveData();
        if (!mate) return;
        // 修改提交
        if (id) {
          SERVICES.LOGISTICS_DELIVERY_ORDER.update(id,mate).then((res) =>{
            let status = res.status; 
            if(status === 200){
              _this.$root.monitor({url: LOGISTICS_ORDER_API.LOGISTICS_DELIVERY_ORDER_LIST});
            }else if(status === 500){
              _this.submitBtnDisabled = false;
            }
          });
        }
        // 新增提交 
        else {
          SERVICES.LOGISTICS_DELIVERY_ORDER.save(mate).then((res) =>{
            let status = res.status; 
            if(status === 200){
              _this.$root.monitor({url: LOGISTICS_ORDER_API.LOGISTICS_DELIVERY_ORDER_LIST});
            }else if(status === 500){
              _this.submitBtnDisabled = false;
            }
          });
        }
      };
    },
    /** 动态表单事件管理
     * @param {String} event 事件名称
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     */
    handleEvents(event, val, name) {
      const eventControl = {
        default: () => { return }
      }
      return (eventControl[event] || eventControl.default)(val, name);
    },
    /**
     * 提取提交和保存
     * 需要传给后台的数据
     * @params void
     * @return {Object} mate 头部数据和行数据
     */
    saveData () {
      let mate = {};
      mate.ladingBill = this.mate.mateFormerHeader.values;
      mate.routeList = this.mate.mateList2.rows;
      mate.lineList = this.mate.mateList3.rows;
      if (mate.routeList.length < 1) {
        // 保存的时候路线列表不能为空
        this.$message({
          type: "warning",
          message: "路线列表不能为空"
        });
        this.submitBtnDisabled = false;
        return false;
      }
      if (mate.lineList.length < 1) {
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
     * 取消返回提货单列表页面
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
      this.selectedLines = multipleSelection
      // 第一步就是要清空selectedIds里面的所勾选行的序号
      this.selectedIds = [];
      multipleSelection.map((i) => this.selectedIds.push(i.lineNum))
      // 每次点击都会执行这个函数，要点击两下的时候，this.selectedIds里面包括了前面一次的数据，所以会有重复，要去重
      let arr = [];
      arr = [...new Set(this.selectedIds)];
      this.selectedIds = arr;
    },
    /**
     * 新增线路
     * @param void
     * @return void
     */
    addRoute () {
      if (!this.mate.mateFormerHeader.values.id) {
        let provicerValue = this.mate.mateFormerHeader.values.logisticsProviderId;
        let provicerPhoneValue = this.mate.mateFormerHeader.values.logisticsProviderPhone;
        let provicerEmailValue = this.mate.mateFormerHeader.values.logisticsProviderEmail;
        if (!provicerValue || !provicerPhoneValue || !provicerEmailValue) {
          this.$message({
            type: 'warning',
            message: '请选择并完善物流商信息'
          })
          return
        }
      } else {
        this.logisticsProviderId = this.mate.mateFormerHeader.values.logisticsProviderId
        this.logisticsProviderPhone = this.mate.mateFormerHeader.values.logisticsProviderPhone
        this.logisticsProviderEmail = this.mate.mateFormerHeader.values.logisticsProviderEmail
      }
      // 该操作是新增线路
      this.isAddRoute = true;
      this.isEditRoute = false;
      // 显示弹窗
      this.dialogRouteFormVisible = true;
      this.clearDialogRouteFrom(this.mate.mateRouteHeader.values)
    },
    /**
     * 编辑线路
     */
    editRoute () {
      // 编辑线路
      if (this.selectedLines.length !== 1) {
        this.$message({
          message: this.$t("seladata"),
          type: "warning"
        });
        return;
      }
      // 该操作是编辑线路
      this.isEditRoute = true;
      this.isAddRoute = false;
      this.dialogRouteFormVisible = true;
      this.mate.mateRouteHeader.values = {...this.selectedLines[0]};
    },
    /**
     * 删除线路
     * @param void
     * @return void
     */
    deleteRoute () {
      let _this = this;
      this.$confirm("此操作将永久删除该行，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        for (var j = 0; j < this.mate.mateList2.rows.length; j++) {
          for (var k = 0; k < this.selectedIds.length; k++) {
            if (this.mate.mateList2.rows[j].lineNum === this.selectedIds[k]) {
              // splice(i, 1),从i开始的那一条，删除一条
              this.mate.mateList2.rows.splice(j, 1)
            }
          }
        }
        for (var l = 0; l < this.mate.mateList2.rows.length; l++) {
          this.mate.mateList2.rows[l].lineNum = l + 1
        }
        this.$message({
          type: 'success',
          message: '删除成功'
        })  
      }).catch(() => {
        _this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    },
    /**
     * 新增销售订单出货行
     * @param void
     * @return void
     */
    addDeliveryNoticeLine () {
      this.deliveryNoticeDialog = true
      this.clearDeliveryNoticeForm(this.mate.mateSoLineHeader.values);
    },
    /**
     * 新增系统外出货行
     * @param void
     * @return void
     */
    addSystemOuterLine () {
      // 该操作是新增
      this.isAddLine = true;
      // 显示弹窗
      this.dialogDetailFormVisible = true;
      this.clearDialogDetailFrom(this.mate.mateDetailHeader.values);
    },
    /**
     * 编辑明细行
     */
    editLine () {
      // 编辑明细行
      if (this.selectedLines.length !== 1) {
        this.$message({
          message: this.$t("seladata"),
          type: "warning"
        });
        return;
      }
      this.isAddLine = false;
      if (this.selectedLines[0].source === '2') {
        // 该操作是修改系统外出货行
        this.isEditOutSystemLine = true;
        this.dialogDetailFormVisible = true;
        this.mate.mateDetailHeader.values = {...this.selectedLines[0]};
      } else {
        // 该操作是修改销售订单出货行
        this.isEidtDeliveryNoticeLine = true;
        this.deliveryNoticeDialog = true
        this.mate.mateSoLineHeader.values = {...this.selectedLines[0]};
      }
      
    },
    /**
     * 删除明细行
     * @param void
     * @return void
     */
    deleteLine () {
      let _this = this;
      this.$confirm("此操作将永久删除该行，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        for (var j = 0; j < this.mate.mateList3.rows.length; j++) {
          for (var k = 0; k < this.selectedIds.length; k++) {
            if (this.mate.mateList3.rows[j].lineNum === this.selectedIds[k]) {
              // splice(i, 1),从i开始的那一条，删除一条
              this.mate.mateList3.rows.splice(j, 1)
            }
          }
        }
        for (var l = 0; l < this.mate.mateList3.rows.length; l++) {
          this.mate.mateList3.rows[l].lineNum = l + 1
        }
        this.$message({
          type: 'success',
          message: '删除成功'
        })  
      }).catch(() => {
        _this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    },
    /**
     * 路线新增/修改确认
     * @param {Object} val 行表单数据
     * @return void
     */
    submitRouteForm (val) {
      let _this = this;
      let mate = this.mate;
      this.$refs['routeForm'].$refs['form'].validate((valid,obj) => {
        if (valid) {
          let curIdx = mate.mateRouteHeader.values.lineNum;
          let values = mate.mateRouteHeader.values;
          // 是否是编辑
          if (_this.isEditRoute){
            mate.mateList2.rows.map((item, lineNum) => {
              if (curIdx === item.lineNum) {
                let mateFormerValues = Object.assign({},values);
                // splice将i行数据删除，并将mateFormerValues1填充进
                mate.mateList2.rows.splice(lineNum, 1, mateFormerValues);
              }
            });
          }
          // 是否是新增
          if (_this.isAddRoute) {
            values.lineNum = mate.mateList2.rows.length + 1;
            let mateFormerValues = Object.assign({},values);
            mate.mateList2.rows.push(mateFormerValues);
          }
          _this.dialogRouteFormVisible = false
        } else {
          _this.$notify.error({
            title: "消息",
            message: "数据验证未通过"
          });
        }
      })
    },
    /**
     * 销售订单出货行新增/修改确认
     * @param {Object} val 表单数据
     * @return void
     */
    submitDeliveryNoticeForm (val) {  
      let _this = this;
      let mate = this.mate;
      this.$refs['deliveryNoticeForm'].$refs['dynamicForm'].$refs['form'].validate((valid,obj) => {
        if (valid) {
          _this.mate.mateSoLineHeader.values.source = '1'
          let curIdx = mate.mateSoLineHeader.values.lineNum;
          let values = mate.mateSoLineHeader.values;
          if (_this.isEidtDeliveryNoticeLine){
            mate.mateList3.rows.map((item, lineNum) => {
              if (curIdx === item.lineNum) {
                let mateFormerValues = Object.assign({},values);
                // splice将i行数据删除，并将mateFormerValues1填充进
                mate.mateList3.rows.splice(lineNum, 1, mateFormerValues);
              }
            });
          } 
          else {
            values.lineNum = mate.mateList3.rows.length + 1;
            let mateFormerValues = Object.assign({},values);
            mate.mateList3.rows.push(mateFormerValues);
          }
          _this.deliveryNoticeDialog = false
        }
      })
    },
    /**
     * 系统外出货行新增/修改确认
     * @param {Object} val 表单数据
     * @return void
     */
    submitDetailForm(val) {
      let _this = this;
      let mate = this.mate;
      this.$refs['detailForm'].$refs['form'].validate((valid,obj) => {
        if (valid) {
          _this.mate.mateDetailHeader.values.source = '2'
          let curIdx = mate.mateDetailHeader.values.lineNum;
          let values = mate.mateDetailHeader.values;
          // 是否是编辑
          if (_this.isEditOutSystemLine){
            mate.mateList3.rows.map((item, lineNum) => {
              if (curIdx === item.lineNum) {
                let mateFormerValues = Object.assign({},values);
                // splice将i行数据删除，并将mateFormerValues1填充进
                mate.mateList3.rows.splice(lineNum, 1, mateFormerValues);
              }
            });
          }
          // 是否是新增
          if (_this.isAddLine) {
            values.lineNum = mate.mateList3.rows.length + 1;
            let mateFormerValues = Object.assign({},values);
            mate.mateList3.rows.push(mateFormerValues);
          }
          _this.dialogDetailFormVisible = false
        } else {
          _this.$notify.error({
            title: "消息",
            message: "数据验证未通过"
          });
        }
      })
    },
    dirtyChange(bool) {
      this.isDirty = bool;
    },
    /**
     * 线路表单数据初始化
     * 自动生成序号
     * @param {Object} values 表单数据
     * @return void
     */
    clearDialogRouteFrom (values){
      values.lineNum = this.creatRouteNum();     // 序号
      values.logisticsRouteId = '';         //物流线路
      values.routeRangeNo = '';         //线路段号
      values.routeCode = '';    // 线路编号
      values.logisticsProviderId =  this.logisticsProviderId;          //物流商
      values.logisticsProviderPhone = this.logisticsProviderPhone;    // 物流商电话
      values.logisticsProviderEmail = this.logisticsProviderEmail;    //物流商Email
      values.carType = '';       //车型
      values.effectiveTime = '';       //时效
      values.deliveryType = '';       //出货模式
      values.index = null; // 索引
    },
    /**
     * 新增销售订单出货行表单数据初始化
     * 自动生成序号
     * @param {Object} values 表单数据
     * @return void
     */
    clearDeliveryNoticeForm (values){
      values.lineNum = this.creatDetailNum();     // 序号
      values.officeName = '';         //业务实体
      values.orgName = '';         //库存组织
      values.customerCode = '';         //客户编号
      values.customerName = '';         //客户名称
      values.soNum = '';         //销售订单编号
      values.lineNo = '';         //销售订单行
      values.deliveryAddress = '';         //送货地址
      values.materialCode = '';    // 物料编码
      values.materialName = '';    // 物料名称
      values.materialSpec = '';    // 规格
      values.materialUnit = '';    // 单位
      values.palletsQuatity = '';    // 栈板数量
      values.palletsWeight = ''; //栈板重量
      values.cartonNum = '';       //箱数
      values.deliveryQuantity = '';       //出货数量
      values.palletSize = '';       //栈板尺寸
      values.boxSize = '';       //纸箱尺寸
      values.roughWeight = '';       //总毛重
      values.totalVolume = '';       //总体积
      values.remark = '';       //备注
      values.index = null; // 索引
    },
    /**
     * 新增系统外出货行表单数据初始化
     * 自动生成序号
     * @param {Object} values 表单数据
     * @return void
     */
    clearDialogDetailFrom (values){
      values.lineNum = this.creatDetailNum();     // 序号
      values.officeId = '';         //业务实体
      // values.deliveryPlanNo = '';         //出货计划单号
      values.materialCode = '';    // 物料编码
      values.materialDescription = '';  //物料描述
      values.palletsQuatity = '';    // 栈板数量
      values.palletsWeight = ''; //栈板重量
      values.cartonNum = '';       //箱数
      values.deliveryQuantity = '';       //出货数量
      values.palletSize = '';       //栈板尺寸
      values.boxSize = '';       //纸箱尺寸
      values.roughWeight = '';       //总毛重
      values.totalVolume = '';       //总体积
    },
    /**
     * 递归自动生成线路序号 1/2/3....
     * 默认为 1 如果当前行序号有1了 则递增1
     * @param {Number} num 序号
     * @return {Number} lineNum 序号
     */
    creatRouteNum (num) {
      let lineNum = num || 1;
      if (this.checkRouteNum(lineNum)){
        lineNum += 1;
        lineNum = this.creatRouteNum(lineNum);
      }
      return lineNum;
    },
    /**
     * 递归自动生成明细行序号 1/2/3....
     * 默认为 1 如果当前行序号有1了 则递增1
     * @param {Number} num 序号
     * @return {Number} lineNum 序号
     */
    creatDetailNum (num) {
      let lineNum = num || 1;
      if (this.checkDetailNum(lineNum)){
        lineNum += 1;
        lineNum = this.creatDetailNum(lineNum);
      }
      return lineNum;
    },
    /**
     * 线路序号检验 
     * 校验是否已经存在当前序号
     * @param {Number} num 序号
     * @return {Boolean}  num是否已存在
     */
    checkRouteNum (num, index) {
      let lineNumArr = [];
      let listLineRows = [...this.mate.mateList2.rows];
      if (index) {
        listLineRows = listLineRows.filter(item => item.index != index);
      }
      listLineRows.forEach(item => lineNumArr.push(item.lineNum));
      return lineNumArr.indexOf(num) != -1;
    },
    /**
     * 明细行序号检验 
     * 校验是否已经存在当前序号
     * @param {Number} num 序号
     * @return {Boolean}  num是否已存在
     */
    checkDetailNum (num, index) {
      let lineNumArr = [];
      let listLineRows = [...this.mate.mateList3.rows];
      if (index) {
        listLineRows = listLineRows.filter(item => item.index != index);
      }
      listLineRows.forEach(item => lineNumArr.push(item.lineNum));
      return lineNumArr.indexOf(num) != -1;
    },
    /**
     * 新建线路弹窗取消
     * 隐藏弹窗并弹窗初始化
     * @param void
     * @return void
     */
    routeDialogClose () {
      // 隐藏行弹窗
      this.dialogRouteFormVisible = false
    },
    /**
     * 新建系统外出货行弹窗取消
     * 隐藏弹窗并弹窗初始化
     * @param void
     * @return void
     */
    detailDialogClose () {
      // 隐藏行弹窗
      this.dialogDetailFormVisible = false
    },
    /**
     * 新建销售订单出货行弹窗取消
     * 隐藏弹窗并弹窗初始化
     * @param void
     * @return void
     */
    deliveryNoticeDialogClose () {
      this.deliveryNoticeDialog = false
    },
    /**
     * 刷新tab页签
     * @param void
     * @return void
     */
    backToList () {
      this.$root.monitor({ url: LOGISTICS_ORDER_API.LOGISTICS_DELIVERY_ORDER_LIST });
    }
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
.route, .detail {
  margin-top: 20px;
  .titleStyle {
    width: 100%;
    font-size: 18px;
    font-weight: 550;
    color: #0088cc;
  }
  .el-row {
    margin-top: 10px;
    border-top: 1px solid #DDDDDD;
  }
}
</style>
