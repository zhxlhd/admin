<!-- created by yxj on 2019/11/28 -->
<!-- 物流基础信息 物流供应商备案信息下新增模块 -->
<template>
  <div>
    <!-- 头部button Start-->
    <HBtn @click="handleBtns" :btns="['提交','取消','重置']"/>
    <!-- 头部button End-->
    <!-- 头部Form Start-->
    <HeaderForm ref="headForm" :mate="mate.mateFormerHeader" :rules="headerFormRules" @events="handleEvents" @isDirty="dirtyChange"></HeaderForm>
    <!-- 头部Form End-->
  </div>
</template>

<script>
import { LOGISTIC_BASIC_DATA_API } from "@/services/apis"
import SERVICES from "@/services"
import { dateFormatter } from "@/utils/DateUtils";
import { DateInit } from "@/utils/util";

export default {
  components: {
    HBtn: function index(resolve){
      require(["@/components/Button/HBtn.vue"], resolve);
    },
    HeaderForm: function index(resolve){
      require(["@/components/form/DynamicForm.vue"], resolve);
    }
  },
  props: {
    mate: Object
  },
  data() {
    var checkDate = (rule, value, callback) => {
      if(this.mate['mateFormerHeader'].values['validityEnd'] == '' || this.mate['mateFormerHeader'].values['validityEnd'] == null) {
        callback(new Error('此项不能为空'));
      }
      clearTimeout(this.timerOut);
      this.timerOut = setTimeout(() => {
        if(new Date(this.mate.mateFormerHeader.values['validityStart']) > new Date(this.mate.mateFormerHeader.values['validityEnd'])){
          callback(new Error('有效期结束日期不能小于起始日期'));
        }else{
          callback();
        }
      }, 300);
    };
    var changeSelect = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('此项不能为空'));
      }else{
        callback();
      }
    };
    var checkEmail = (rule, value, callback) => {
      if (value.trim() == '' || value == null) {
        callback(new Error('此项不能为空'));
      }else if(!/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(value.trim())){
        callback(new Error('请输入有效的邮箱'));
      }else{
        callback();
      }
    }
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
        // 物流供应商名称
        logisticsProviderId: [{ required: true, trigger: "change", disabled: false, validator:changeSelect}],
        // 备案人名称
        registrationName: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        // 备案有效期开始
        validityStart: [{ required: true, trigger: "change", disabled: false, message:"此项不能为空"}],
        // 备案有效期结束
        validityEnd: [{ required: true, trigger: "change", disabled: false, validator:checkDate}],
        // 提醒邮箱地址
        registrationEmail: [{ required: true, trigger: "blur", disabled: false, validator:checkEmail}]
      }
    };
  },
  created() {
    let mate = this.mate;
    mate.mateFormerHeader.fields.map((item) => { this.headForm[item.name] = item; });
    // 修改
    let mateData = mate.mateData;
    if(mateData && mateData.id && mateData.id !== '') {
      mate.mateFormerHeader.values = mateData;
    }
  },
  mounted() {
    this.getLogisticsProvidersList();
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
        default: () => { return }
      }
      return (eventControl[event] || eventControl.default)(val, name);
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
      this.$root.monitor({ url: LOGISTIC_BASIC_DATA_API.REGISTRATION_INFO_LIST });
    },
    /**
     * 获取物流商名称列表
     * @param void
     * @return void
     */
    getLogisticsProvidersList() {
      SERVICES.LOGISTICS_BASE_DATA.getLogisticsProvidersList().then(res => {
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
            this.headForm['logisticsProviderId'].options = logisticsProviderIdOptions;
          }
        }
      });
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
