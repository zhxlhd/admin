<!-- created by yxj on 2019/12/09 -->
<!-- 物流线路管理 物流线路维护下新增模块 -->
<template>
  <div>
    <!-- 头部button Start-->
    <h-btn @click="handleBtns" :btns="['提交','取消','重置']"></h-btn>
    <!-- 头部button End-->
    <!-- 头部Form Start-->
     <dynamic-form ref="headForm" :mate="mate.mateFormerHeader" :rules="headerFormRules" :eventCfg="headerFormEventConfig" @events="handleEvents" @isDirty="dirtyChange"></dynamic-form>
    <!-- 头部Form End-->
  </div>
</template>

<script>
import { LOGISTIC_BASIC_DATA_API } from "@/services/apis"
import SERVICES from "@/services"

export default {
  components: {
    HBtn: function index(resolve){
      require(["@/components/Button/HBtn.vue"], resolve);
    },
    DynamicForm: function index(resolve){
      require(["@/components/form/DynamicForm.vue"], resolve);
    }
  },
  props: {
    mate: Object
  },
  data() {
    var checkEmpity = (rule, value, callback) => {
      if (value === '' || value == null) {
        callback(new Error('此项不能为空'));
      }else{
        callback();
      }
    };
    return {
      headForm: {},              // 头部表单
      isEdit: false,             // 当前行是否在编辑
      isAddLine: false,          // 是否新增行
      isEditLine: false,         // 是否修改行
      isDirty: false,            // 是否修改了数据
      btnDisable: false,
      actDisable: false,
      timerOut: null,           // 延时器
      headerFormRules: {
        // 线路编号
        routeCode: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        // 线路名称
        routeName: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        // 是否有效
        status: [{ required: true, trigger: "change", disabled: false, message:"此项不能为空"}],
        // 线路类型
        routeType: [{ required: true, trigger: "change", disabled: false, validator:checkEmpity}],
        // 出货模式
        deliveryMode: [{ required: true, trigger: "change", disabled: false, message:"此项不能为空"}],
        // 运输方式
        transportMode: [{ required: true, trigger: "change", disabled: false, message:"此项不能为空"}],
        // 是否报关
        isClearance: [{ required: true, trigger: "change", disabled: false, validator:checkEmpity}],
        // 通关口岸
        passProt: [{ required: true, trigger: "change", disabled: false, message:"此项不能为空"}],
        // 起点站点
        startStationId: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        // 终点站点
        endStationId: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        // 创建人
        createName: [{ disabled: true }]
      },
      headerFormEventConfig: {
        // 线路编号
        routeCode: { blur: true },
        // 起点站点
        startStationId: { change: true },
        // 终点站点
        endStationId: { change: true }
      },
      stationOptions: [] // 存放起点、终点下拉列表
    };
  },
  created() {
    let mate = this.mate;
    mate.mateFormerHeader.fields.map(item => {
      // 为配合使用mongdb专门做区分，不要问为什么，我也想知道为什么这样
      if(item.holder !== 'selectc'){
        this.headForm[item.name] = item;
      }
    });
    // 修改、复制（约定于新增的功能）功能数据
    let mateData = mate.mateData;
    if(mateData && mateData.id && mateData.id !== '') {
      mate.mateFormerHeader.values = mateData;
      if(this.$store && this.$store.state.RegistrationInfo['logisticsRouteToSaveFlag'] && this.$store.state.RegistrationInfo['logisticsRouteToSaveFlag'] =='copy') {
        // 路线编号、线路名称 复制的时候要清空
        mate.mateFormerHeader.values['routeCode'] = '';
        mate.mateFormerHeader.values['routeName'] = '';
      }else{
        // 路线编号 修改的时候不允许修改，以保证路线编号唯一
        this.headerFormRules.routeCode[0].disabled = true;
      }
    }
  },
  mounted() {
    this.getStationList();
    // 创建人默认获取当前用户
    const localStorage = window.localStorage;
    var localuser = JSON.parse(localStorage.getItem('user'));
    this.mate.mateFormerHeader.values.createBy = localuser.id ||'';
    this.mate.mateFormerHeader.values.createName = (localuser.firstname + localuser.lastname) ||'';
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
          mate = this.mate.mateFormerHeader.values;
          if (!mate) return;
          if(this.$store && this.$store.state.RegistrationInfo['logisticsRouteToSaveFlag'] && this.$store.state.RegistrationInfo['logisticsRouteToSaveFlag'] =='copy') {
            // 复制提交时id置零（复制功能 ≈ 新增功能）
            mate.id = '0';
          }
          SERVICES.BASE.handleSave(url, mate).then((res) => {
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
        blur: (val, name) => this.handleRouteCodeBlur(val, name),
        change: (val, name) => this.handleStationIdChange(val, name),
        default: () => { return }
      }
      return (eventControl[event] || eventControl.default)(val, name);
    },
    /** blur 事件 线路编号 校验是否唯一
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     */
    handleRouteCodeBlur(val, name) {
      if (val !== '') {
        SERVICES.LOGISTICS_BASE_DATA.checkRouteCode(val.trim()).then(res => {
          if(!res.data.status){
            this.mate.mateFormerHeader.values[name] = '';
            this.$message({
              type: "warning",
              message: "此线路编号已存在，请重新录入！"
            });
          }
        });
      }
    },
    /** change 事件 起点、终点下拉框change时 省市区街道显示数据
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     */
    handleStationIdChange(val, name) {
      if (val !== '') {
        if(this.mate.mateFormerHeader.values['startStationId'] == this.mate.mateFormerHeader.values['endStationId']){
          this.mate.mateFormerHeader.values[name] = '';
          this.$set(this.mate.mateFormerHeader.values, name.split('StationId')[0]+'ProvinceCode', '');
          this.$set(this.mate.mateFormerHeader.values, name.split('StationId')[0]+'Address', '');
          this.$set(this.mate.mateFormerHeader.values, name.split('StationId')[0]+'CityCode', '');
          this.$set(this.mate.mateFormerHeader.values, name.split('StationId')[0]+'AreaCode', '');
          this.$set(this.mate.mateFormerHeader.values, name.split('StationId')[0]+'StreetCode', '');
          this.$message({
            type: "warning",
            message: '当前起始站点和终点站点重复，不可选择！'
          });
          return;
        }
        if(this.pickStationDetailAddress(val).provinceCode && this.pickStationDetailAddress(val).provinceCode !== ''){
          // 前端展示
          this.$set(this.mate.mateFormerHeader.values, name.split('StationId')[0]+'ProvinceCode', this.pickStationDetailAddress(val).provinceCode);
          this.$set(this.mate.mateFormerHeader.values, name.split('StationId')[0]+'CityCode', this.pickStationDetailAddress(val).cityCode);
          this.$set(this.mate.mateFormerHeader.values, name.split('StationId')[0]+'AreaCode', this.pickStationDetailAddress(val).areaCode);
          this.$set(this.mate.mateFormerHeader.values, name.split('StationId')[0]+'StreetCode', this.pickStationDetailAddress(val).streetCode);
          this.$set(this.mate.mateFormerHeader.values, name.split('StationId')[0]+'Address', this.pickStationDetailAddress(val).stationAddress);
        }
      }
    },
    /**
     * 通过stationId筛选下拉列表中的详细省市区街道数据
     * @param {String} stationId 下拉列表的id
     * @return void
     * ***/
    pickStationDetailAddress(stationId) {
      let stationObj = {};
      this.stationOptions.forEach(station => {
        if(station.id == stationId){
          stationObj = station;
        }
      });
      return stationObj;
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
          this.stationOptions = data;
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
    handleReset() {
      this.$refs['headForm'].$refs["form"].resetFields();
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
     * 重置弹窗表单
     * 数据清空，验证信息重置
     * @param {String} formName 需要重置的表单 ref 名称
     * @return void
     */
    resetForm (formName) {
      this.$refs[formName].resetForm();
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
      this.$root.monitor({ url: LOGISTIC_BASIC_DATA_API.LOGISTICS_ROUTE_LIST });
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
</style>
