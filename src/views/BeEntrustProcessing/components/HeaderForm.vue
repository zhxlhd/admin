
<!-- created by zhongxiaolong on 2019/08/27 -->
<!-- 新增模块头部表单 -->
<template>
  <div>
    <el-row>
      <el-form
        size="mini"
        ref="form"
        :model="mate.mateFormerHeader.values"
        :inline="mate.inline"
        label-position="labelPosition"
        :rules="rules"
        :label-width="labelWidth"
      >
        <!-- 订单编号 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm.soNum.label" :prop="headForm.soNum.name">
            <el-input
              :disabled="rules['soNum'] && rules['soNum'][0].disabled"
              v-model="mate.mateFormerHeader.values['soNum']"
              maxlength="30"
              show-word-limit
              @blur="soNumDirty&&retrieveOrder(mate.mateFormerHeader.values['soNum'])"
            ></el-input>
          </el-form-item>
        </el-col>
        <!-- 客户名称 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm.customerName.label" :prop="headForm.customerName.name">
            <el-input
              :disabled="rules['customerName'] && rules['customerName'][0].disabled"
              v-model="mate.mateFormerHeader.values['customerName']"
            ></el-input>
          </el-form-item>
        </el-col>
        <!-- 工单编号 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm.workOrderCode.label" :prop="headForm.workOrderCode.name">
            <el-input
              :disabled="rules['workOrderCode'] && rules['workOrderCode'][0].disabled"
              v-model="mate.mateFormerHeader.values['workOrderCode']"
            ></el-input>
          </el-form-item>
        </el-col>
        <!-- 物料 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm.materialsCode.label" :prop="headForm.materialsCode.name">
            <el-input
              :disabled="rules['materialsCode'] && rules['materialsCode'][0].disabled"
              v-model="mate.mateFormerHeader.values['materialsCode']"
              @blur="materialsCodeDirty&&getMaterialsInfo(mate.mateFormerHeader.values['materialsCode'])"
            ></el-input>
          </el-form-item>
        </el-col>
        <!-- 品名 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm.materialsName.label" :prop="headForm.materialsName.name">
            <el-input
              :disabled="rules['materialsName'] && rules['materialsName'][0].disabled"
              v-model="mate.mateFormerHeader.values['materialsName']"
            ></el-input>
          </el-form-item>
        </el-col>
        <!-- 产品规格 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm.specs.label" :prop="headForm.specs.name">
            <el-input
              :disabled="rules['specs'] && rules['specs'][0].disabled"
              v-model="mate.mateFormerHeader.values['specs']"
            ></el-input>
          </el-form-item>
        </el-col>
        <!-- 申请日期 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm.applyDateStr.label" :prop="headForm.applyDateStr.name">
            <el-date-picker
              :disabled="rules['applyDateStr'] && rules['applyDateStr'][0].disabled"
              v-model="mate.mateFormerHeader.values['applyDateStr']"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <!-- 需求日期 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm.requestDateStr.label" :prop="headForm.requestDateStr.name">
            <el-date-picker
              :disabled="rules['requestDateStr'] && rules['requestDateStr'][0].disabled"
              v-model="mate.mateFormerHeader.values['requestDateStr']"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <!-- 数量 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm.quantity.label" :prop="headForm.quantity.name">
            <el-input-number
              :disabled="rules['quantity'] && rules['quantity'][0].disabled"
              v-model.number="mate.mateFormerHeader.values['quantity']"
              :controls="controls"
              :precision="0"
              :min="1"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <!-- 单位 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm.unit.label" :prop="headForm.unit.name">
            <el-input
              :disabled="rules['unit'] && rules['unit'][0].disabled"
              v-model="mate.mateFormerHeader.values['unit']"
            ></el-input>
          </el-form-item>
        </el-col>
        <!-- 价格 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item
            v-if="headForm.price"
            :label="headForm.price.label"
            :prop="headForm.price.name"
          >
            <el-input-number
              :disabled="rules['price'] && [0].disabled"
              v-model.number="mate.mateFormerHeader.values['price']"
              :controls="controls"
              :precision="2"
              :min="0"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <!-- 需求部门 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item
            v-if="headForm.demandDepartment"
            :label="headForm.demandDepartment.label"
            :prop="headForm.demandDepartment.name"
          >
            <el-input
              :disabled="rules['demandDepartment'] && rules['demandDepartment'][0].disabled"
              v-model="mate.mateFormerHeader.values['demandDepartment']"
              :maxlength="maxlengthDemand"
            ></el-input>
          </el-form-item>
        </el-col>
        <!-- 需求人 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item
            v-if="headForm.demander"
            :label="headForm.demander.label"
            :prop="headForm.demander.name"
          >
            <el-input
              :disabled="rules['demander'] && rules['demander'][0].disabled"
              v-model="mate.mateFormerHeader.values['demander']"
              :maxlength="maxlengthDemand"
            ></el-input>
          </el-form-item>
        </el-col>
        <!-- 联系方式 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item
            v-if="headForm.phone"
            :label="headForm.phone.label"
            :prop="headForm.phone.name"
          >
            <el-input
              :disabled="rules['phone'] && rules['phone'][0].disabled"
              v-model="mate.mateFormerHeader.values['phone']"
              :maxlength="maxlengthContact"
            ></el-input>
          </el-form-item>
        </el-col>
        <!-- 完成日期 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item
            v-if="headForm.orderCompleteTimeStr"
            :label="headForm.orderCompleteTimeStr.label"
            :prop="headForm.orderCompleteTimeStr.name"
          >
            <el-input
              readonly
              v-model="mate.mateFormerHeader.values['orderCompleteTimeStr']"
            ></el-input>
          </el-form-item>
        </el-col>
        <!-- 紧急程度 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm['urgent'] && headForm['urgent'].label" :prop="headForm['urgent'] && headForm['urgent'].name">
            <dict-selected
            v-model="mate.mateFormerHeader.values['urgent']"
            dictType="urgent_level"
            :initValue="mate.mateFormerHeader.values['urgent']"
            :rowId="showDict"
            ></dict-selected>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import { SMART_ORDER_API, BASE_API } from "@/services/apis";
import SERVICES from "@/services";
import { dateFormatZero } from "@/utils/util.js";

export default {
  data() {
    return {
      formName: "form",        // form 表单 ref 名称
      labelPosition: "right",  // label位置
      controls: false,         // input-number 是否禁用按钮
      maxlengthDemand: 20,     // 控制输入长度
      maxlengthContact: 20,    // 控制输入长度
      headForm: {},            // 头部表单字段
      showDict: 0,             // 数字词典是否禁用 1/0
      valuesClone: {},         // 头部数据克隆
      rules: {
        // 订单编号
        soNum: [
          {
            required: true,
            message: "该输入项为必输项",
            trigger: "blur",
            disabled: false
          }
        ],
        // 客户名称
        customerName: [
          {
            required: true,
            message: "该输入项为必输项",
            trigger: "blur",
            disabled: false
          }
        ],
        // 组件
        materialsCode: [
          {
            required: true,
            message: "该输入项为必输项",
            trigger: "blur",
            disabled: false
          }
        ],
        // 申请日期
        applyDateStr: [
          {
            required: true,
            message: "该输入项为必输项",
            trigger: "blur",
            disabled: false
          }
        ],
        // 需求日期
        requestDateStr: [
          {
            required: true,
            message: "该输入项为必输项",
            trigger: "blur",
            disabled: false
          }
        ],
        // 物料名称
        materialsName: [{ disabled: true }],
        // 工单编号
        workOrderCode: [{ disabled: false }],
        // 产品规格
        specs: [{ disabled: true }],
        // 数量
        quantity: [
          {
            required: true,
            message: "该输入项为必输项",
            disabled: false,
            type: "number"
          }
        ],
        // 单位
        unit: [{ disabled: true }],
        // 价格
        price: [{ type: "number", disabled: false }],
        // 需求部门
        demandDepartment: [{disabled: false}],
        // 需求人
        demander: [{disabled: false}],
        // 联系方式
        phone: [{disabled: false}]
      },
      pickerOptions: {
        // 日期禁用今天之前的
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      isDirty: false,
      soNumDirty: false,
      materialsCodeDirty: false
    };
  },
  components: {
    "dict-selected": function index(resolve) {
      require(["@/components/DictSelected.vue"], resolve);
    }
  },
  props: {
    mate: Object,
    labelWidth: String
  },
  created() {
    this.init();
  },
  watch: {
    "mate.mateFormerHeader.values.soNum": {
      handler(curVal, oldVal) {
        this.isDirty = true;
        this.soNumDirty = true;
      }
    },
    "mate.mateFormerHeader.values.materialsCode": {
      handler(curVal, oldVal) {
        this.isDirty = true;
        this.materialsCodeDirty = true;
      }
    }
  },
  computed: {
    /**
     * 日期初始化 默认当前日期
     * @param void
     * @return {String} defaultDate 当前日期/申请日期
     */
    dateInit() {
      // 表单数据
      let values = this.mate.mateFormerHeader.values || {};
      // 申请日期
      let date = values.applyDateStr || "";
      // 当前日期
      let curDate = new Date();
      // 当前日期格式化
      let defaultDate = `${curDate.getFullYear()}-${dateFormatZero(curDate.getMonth() + 1)}-${dateFormatZero(curDate.getDate())}`;
      // 如果有申请日期默认日期为申请日期,否则为当前日期
      defaultDate = date || defaultDate;
      // 返回日期
      return defaultDate;
    }
    // dirty (){
    //   let isDirty;
    //   let oriData = JSON.stringify(this.valuesClone);
    //   let curData = JSON.stringify(this.mate.mateFormerHeader.values);
    //   isDirty = oriData != curData;
    //   this.$emit('isDirty', isDirty);
    // }
  },
  mounted() {
    // 设置申请日期默认值
    this.mate.mateFormerHeader.values.applyDateStr = this.dateInit;
  },
  methods: {
    /**
     * 数据初始化
     * @param void
     * @return void
     */
    init() {
      this.valuesClone = { ...this.mate.mateFormerHeader.values };
      // *el-input-number 默认值为0,若要置空需要将值设置为 undefined
      this.mate.mateFormerHeader.values.quantity = this.mate.mateFormerHeader.values.quantity || undefined;
      this.mate.mateFormerHeader.values.clone = true; // TODO
      this.mate.mateFormerHeader.fields.map(item => {
        this.headForm[item.name] = item;
      });
      // 修改订单不允许修改订单编号和客户名称
      // if(this.mate.mateFormerHeader.values.id){
      //   this.rules['soNum'][0].disabled = true;
      //   this.rules['soNum'][0].required = false;
      //   this.rules['customerName'][0].disabled = true;
      //   this.rules['customerName'][0].required = false;
      // }
    },
    /**
     * 检索订单编号
     * 判断此订单编号是否存在，
     * 如果存在，可自动带出客户名称，
     * 如果不存在需提示“此订单不存在，请先到订单管理，建立销售订单！”。
     * @param {Sting} val 订单编号 (销售管理-销售订单-订单编号)
     * @return void
     */
    retrieveOrder(val) {
      if (val == "") return;
      SERVICES.DOCUMENTARY_LIST.retrieveSoNum(val).then(res => {
        if (res.data.data) {
          this.mate.mateFormerHeader.values["customerName"] =
            res.data.data.customerName || "";
          this.soNumDirty = false;
        } else {
          this.$message({
            type: "warning",
            message: "此订单不存在，请先到订单管理，建立销售订单！"
          });
          this.mate.mateFormerHeader.values["customerName"] = "";
        }
      });
    },
    /**
     * 检索物料编码
     * 检索物料是否存在，
     * 存在的话，自动带出产品名称（物料名称），产品规格（物料规格）。
     * 不存在提示“此物料编码不存在”
     * @param {Sting} val 物料编码 (基础数据-物料管理-物料编码)
     * @return void
     */
    getMaterialsInfo(val) {
      if (val == "") return;
      SERVICES.DOCUMENTARY_LIST.getMaterialsInfo(val).then(res => {
        let values = this.mate.mateFormerHeader.values;
        let data = res.data && res.data.data;
        if (data) {
          values["materialsName"] = data.name || "";
          values["specs"] = data.basicSpec || "";
          values["unit"] = data.basicUnit || "";
          this.materialsCodeDirty = false;
        } else {
          this.$message({
            type: "warning",
            message: "此物料编码不存在"
          });
          values["materialsName"] = "";
          values["specs"] = "";
          values["unit"] = "";
        }
      });
    },
    /**
     * 重置弹窗表单
     * 数据清空，验证信息重置
     * @param {String} formName 需要重置的表单 ref 名称
     * @return void
     */
    resetForm(formName) {
      let name = formName || this.formName;
      this.$refs[name].resetFields();
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
</style>
<style>
.el-form-item__content .el-input-number {
  width: 100%;
}
.el-form-item__content .el-input-number .el-input__inner {
  text-align: left;
}
</style>
