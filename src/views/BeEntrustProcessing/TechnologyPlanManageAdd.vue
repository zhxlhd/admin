<!-- created by yxj on 2019/11/13 -->
<!-- 技术方案管理模块下新增模块 -->
<template>
  <div>
    <!-- 头部button Start-->
    <h-btn @click="handleBtns" :btns="['提交','取消','重置']"></h-btn>
    <!-- 头部button End-->
    <!-- 头部Form Start-->
    <dynamic-form ref="headForm" 
                  :mate="mate.mateFormerHeader" 
                  :rules="headerFormRules" 
                  :eventCfg="headerFormEventConfig" 
                  @events="handleEvents" 
                  @isDirty="dirtyChange"></dynamic-form>
    <!-- 头部Form End-->
  </div>
</template>

<script>
import { BE_ENTRUST_PROCESSING_API } from "@/services/apis"
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
    var numberCount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('此项不能为空'));
      }
      let strNumber = 0;
      rule.field == 'technicalCode' ? strNumber = 10 : strNumber = 30
      this.timerOut = setTimeout(() => {
        if(value.length > strNumber){
          return callback(new Error('当前输入框字符数不能超过'+strNumber+'个字'));
        }else{
          callback();
        }
      }, 500);
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
        // 技术方案编码
        technicalCode: [{ required: true, trigger: "blur", disabled: false, validator: numberCount }],
        // 技术方案名称
        technicalName: [{ required: true, trigger: "blur", disabled: false, validator: numberCount }],
      },
      headerFormEventConfig: {
        technicalCode: { blur: true }
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
      // 技术方案编码 修改的时候不允许修改，以保证技术方案编码唯一
      this.headerFormRules.technicalCode[0].disabled = true;
    }
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
        blur: (val, name) => this.handleCodeBlur(val, name),
        default: () => { return }
      }
      return (eventControl[event] || eventControl.default)(val, name);
    },
    /** blur 事件 Code 技术方案编码 校验是否唯一
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     */
    handleCodeBlur(val, name) {
      if (val !== '') {
        SERVICES.TECHNOLOGY_PLAN_MANAGE.checkCode(val.trim()).then(res => {
          if(res.data.statusCode !== 200){
            this.mate.mateFormerHeader.values[name] = '';
            this.$message({
                type: "warning",
                message: "此技术方案编码已存在，请重新录入！"
            });
          }
        });
      }
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
      this.$root.monitor({ url: BE_ENTRUST_PROCESSING_API.TECHNOLOGY_PLAN_MANAGE_LIST });
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
