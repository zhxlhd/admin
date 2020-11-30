<!-- created by hezhiqiang on 2019/12/12 -->
<!-- 实报实销新增模块 -->
<template>
  <div>
    <!-- 头部button Start-->
    <div class="tbutton">
      <el-button size="mini" plain class="el-icon-document" :disabled="submitBtnDisabled" @click="handleSubmit">提 交</el-button>
      <el-button size="mini" plain class="el-icon-close" @click="backward">取 消</el-button>
    </div>
    <!-- 头部button End-->
    <!-- 头部form Start-->
    <div class="form">
      <span class="titleStyle">实报实销费用信息</span>
      <el-row>
        <DynamicForm 
          ref="firstForm"
          :mate="mate.mateFormerHeader"
          :rules="firstFormRules"
          @events="handleEvents">
        </DynamicForm>
      </el-row>
    </div>
    <!-- 头部form End-->
    <!-- 底部form Start-->
    <div class="form">
      <span class="titleStyle">物流商费用</span>
      <el-row>
        <DynamicForm 
          ref="secondForm" 
          :mate="mate.mateFormerHeader2"
          :rules="secondFormRules" 
          @events="handleEvents" >
        </DynamicForm>
      </el-row>
    </div>
    <!-- 底部form Start-->
  </div>
</template>

<script>
import { LOGISTICS_ORDER_API } from "@/services/apis"
import SERVICES from "@/services"

export default {
  components: {
    DynamicForm: function index(resolve){
      require(["@/components/form/DynamicForm.vue"], resolve);
    },
  },
  props: {
    mate: Object
  },
  data() {
    return {
      firstForm: {},               // 头部表单
      secondForm: {},              // 底部表单
      toSort: true,                // 是否本地排序 一般用于没有分页的列表
      submitBtnDisabled: false,    // 提交按钮是否禁用
    };
  },
  created() {
    this.mate.mateFormerHeader.fields.map((item) => { this.firstForm[item.name] = item; });
    this.mate.mateFormerHeader2.fields.map((item) => { this.secondForm[item.name] = item; });
    if (!this.mate.mateFormerHeader.values.isEdit && this.mate.mateFormerHeader.values.id) {
      this.submitBtnDisabled = true
    };
    // 船务已审批
    if (this.mate.mateFormerHeader.values.id && this.mate.mateFormerHeader.values.shippingExpensesStatus === '1') {
      this.firstForm['currency'].disabled = true
      this.firstForm['weighingFee'].disabled = true
      this.firstForm['portParkingFee'].disabled = true
      this.firstForm['tallyFee'].disabled = true
      this.firstForm['unloadingFee'].disabled = true
      this.firstForm['bindingFee'].disabled = true
      this.firstForm['serviceFee'].disabled = true
      this.firstForm['stationFee'].disabled = true
      this.firstForm['handoverFee'].disabled = true
      this.firstForm['overnightFee'].disabled = true
      this.firstForm['warehousingFee'].disabled = true
      this.firstForm['packingFee'].disabled = true
      this.firstForm['entranceFee'].disabled = true
      this.firstForm['emptyBackFee'].disabled = true
      this.firstForm['waitingFee'].disabled = true
      this.firstForm['additionalFee'].disabled = true
      this.firstForm['tollFee'].disabled = true
      this.firstForm['secondPickFee'].disabled = true
      this.firstForm['secondSendFee'].disabled = true
      this.firstForm['otherFee'].disabled = true
    };
    // 物流商已审批
    if (this.mate.mateFormerHeader.values.id && this.mate.mateFormerHeader.values.logisticsExpensesStatus === '1') {
      this.secondForm['claimFee'].disabled = true
      this.secondForm['fineFee'].disabled = true
      this.secondForm['vehicleLateFee'].disabled = true
      this.secondForm['remark'].disabled = true
    }
  },
  mounted() {
  },
  watch: {
  },
  computed: {
  },
  methods: {
    /**
     * 提交表单数据
     * @param void
     * @return void
     */
    handleSubmit() {
      this.submitBtnDisabled = true;
      let id = this.mate.mateFormerHeader.values.id
      let mate = {
        'shippingExpenses' : this.mate.mateFormerHeader.values,
        'logisticsExpenses' : this.mate.mateFormerHeader2.values,
        'id' : id
      };
      let _this = this;
      /** 校验表单 */
      this.$refs['firstForm'].$refs["form"].validate(valid => {
        if (valid) {
          this.firstFormValid = true
        } else {
           this.submitBtnDisabled = false;
        }
      });
      this.$refs['secondForm'].$refs["form"].validate(valid => {
        if (valid) {
          this.secondFormValid = true
        } else {
           this.submitBtnDisabled = false;
        }
      });
      if (this.firstFormValid && this.firstFormValid) {
        if (!mate) return;
        // 新增提交
        if (!id) {
          SERVICES.COMPLETE_REIMBURSEMENT.save(mate).then((res) =>{
            let status = res.status; 
            if(status === 200){
              _this.$root.monitor({url: LOGISTICS_ORDER_API.COMPLETE_REIMBURSEMENT_LIST});
            }else if(status === 500){
              _this.submitBtnDisabled = false;
            }
          });
        }
        // 修改提交 
        else {
          SERVICES.COMPLETE_REIMBURSEMENT.save(mate).then((res) =>{
            let status = res.status; 
            if(status === 200){
              _this.$root.monitor({url: LOGISTICS_ORDER_API.COMPLETE_REIMBURSEMENT_LIST});
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
     * 取消返回列表页面
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
     * 刷新tab页签
     * @param void
     * @return void
     */
    backToList () {
      this.$root.monitor({ url: LOGISTICS_ORDER_API.COMPLETE_REIMBURSEMENT_LIST });
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
.form {
  margin-top: 20px;
  .titleStyle {
    width: 100%;
    font-size: 18px;
    font-weight: 550;
    color: rgb(0, 183, 255);
  }
  .el-row {
    margin-top: 10px;
    border-top: 1px solid #DDDDDD;
  }
}
</style>
