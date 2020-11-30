/**
 * 新增Bom 头部表单
 */
<template>
  <div>
    <!-- form组 Start-->
    <el-row>
      <el-form
        size="mini"
        ref="headerForm"
        :model="mate.values"
        :inline="mate.inline"
        label-position="labelPosition"
        :rules="rules"
        :label-width="labelWidth"
      >
        <!-- ECN单号 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm['ecnCode'].label" :prop="headForm['ecnCode'].name">
            <el-input disabled v-model="mate.values['ecnCode']"></el-input>
          </el-form-item>
        </el-col>
        <!-- 库存组织 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm['orgUnit'].label" :prop="headForm['orgUnit'].name">
            <el-select
              clearable
              filterable
              :disabled="rules['orgUnit'][0].disabled"
              v-model="mate.values['orgUnit']"
              placeholder="选择库存组织"
              @change="changeOrgUnit(mate.values['orgUnit'])"
            >
              <el-option
                :label="mItem.label"
                :value="mItem.value"
                v-for="(mItem,index) of orgUnitOptions"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 类型 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm['ecnType'].label" :prop="headForm['ecnType'].name">
            <dict-selected
              v-model="mate.values.ecnType"
              dictType="ecnType"
              :initValue="mate.values['ecnType']"
            ></dict-selected>
          </el-form-item>
        </el-col>
        <!-- 产品料号 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item
            :label="headForm['materialsCode'].label"
            :prop="headForm['materialsCode'].name"
          >
            <el-select
              clearable
              filterable
              :disabled="rules['materialsCode'][0].disabled"
              v-model="mate.values.materialsCode"
              placeholder="选择物料"
              @change="changeMaterialsCode(mate.values['materialsCode'])"
            >
              <el-option
                :label="mItem.label"
                :value="mItem.value"
                v-for="(mItem,index) of materialsCodeOfBomOptions"
                :key="index"
              >
                <span style="float: left;margin-right:30px">{{ mItem.label }}</span>
                <span style="float: right; color:#212121; font-size: 13px">{{ mItem.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 品名 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item
            :label="headForm['materialsName'].label"
            :prop="headForm['materialsName'].name"
          >
            <el-input disabled v-model="mate.values['materialsName']"></el-input>
          </el-form-item>
        </el-col>
        <!-- 物料类型 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item
            :label="headForm['materialsType'].label"
            :prop="headForm['materialsType'].name"
          >
            <el-input disabled v-model="mate.values['materialsType']"></el-input>
          </el-form-item>
        </el-col>
        <!-- 旧版本 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm['oldVersion'].label" :prop="headForm['oldVersion'].name">
            <el-input disabled v-model="mate.values['oldVersion']"></el-input>
          </el-form-item>
        </el-col>
        <!-- 新版本 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm['version'].label" :prop="headForm['version'].name">
            <!-- <el-input v-model="mate.values['version']" oninput="value=value.replace(/[^\d.]/g,'')" @blur="checkVersion(mate.values['version'])"></el-input> -->
            <el-input-number class="input_number" v-model="mate.values['version']" controls-position="right" :precision='0' :min="1" @blur="checkVersion(mate.values['version'])"></el-input-number>
          </el-form-item>
        </el-col>
        <!-- 日期 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm['fromDateStr'].label" :prop="headForm['fromDateStr'].name">
            <el-date-picker
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
              :disabled="rules['fromDateStr'][0].disabled"
              type="date"
              v-model="mate.values['fromDateStr']"
              @change="getFromDate"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <!-- 原因 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm['reason'].label" :prop="headForm['reason'].name">
            <dict-selected
              v-model="mate.values['reason']"
              dictType="reason"
              :initValue="mate.values['reason']"
            ></dict-selected>
          </el-form-item>
        </el-col>
        <!-- 备注 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="headForm['remarks'].label" :prop="headForm['remarks'].name">
            <el-input v-model="mate.values['remarks']" type="textarea"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <!-- form组 End-->
  </div>
</template>

<script>
import ColumnFormatterMixin from "@/mixins/ColumnFormatterMixin"
import SERVICES from "@/services"
import { BOM_API } from "@/services/apis"
import { dateFormatZero } from "@/utils/util.js"

export default {
  mixins: [ColumnFormatterMixin],
  components:{
    'dict-selected': function index (resolve) {
      require(['@/components/DictSelected.vue'], resolve)
    }
  },
  props: {
    mate: Object
  },
  data() {
    return {
      headForm: {}, // 新建Bom 头部表单信息
      labelPosition: "right", // label位置
      orgUnitOptions: [], // 库存组织选项列表
      materialsCodeOfBomOptions: [], // 库存组织对应 bom 的物料编码选项列表
      materialsCodeOptions: [], // 库存组织对应的 物料编码
      materialsCodeOfBomLineOptions: [], // 库存组织对应的 bom 下的行数据列表
      rules: { // Form rules
        ecnType: [ {required: true, message: "该输入项为必输项", disabled: false, trigger: "change"}], // 类型
        orgUnit: [ {required: true, message: "该输入项为必输项", disabled: false, trigger: "change"}], // 库存组织
        materialsCode: [{required: true, message: "该输入项为必输项", disabled: false, trigger: "blur"}], // 物料
        fromDateStr: [{required: true, message: "该输入项为必输项", disabled: false, trigger: "blur" }], // 日期 有效日期-开始
        version: [{required: true, message: "该输入项为必输项", disabled: false, trigger: "blur", type: 'number' }], // 新版本
        reason: [{required: true, message: "该输入项为必输项", disabled: false, trigger: "change" }]  // 原因
      },
      pickerOptions: {
        // 日期禁用今天之前的
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      sysUser: {},
      verExist: false, //ecn 新版本号是否已存在
      oldMaterialsCode: "" // 物料编码切换前值
    };
  },
  computed: {
    labelWidth() {
      let width = "";
      if (this.mate.inline) {
        width = "100px";
      } else if (typeof this.mate.labelWidth === "undefined") {
        width = "100px";
      } else if (this.mate.labelWidth === null) {
        width = "100px";
      } else {
        width = this.mate.labelWidth;
      }
      return width;
    },
    dateInit() {
      // 日期初始化 默认当前日期
      var date = new Date();
      var defaultDate =
        date.getFullYear() + "-" + dateFormatZero(date.getMonth() + 1) + "-" + dateFormatZero(date.getDate());
      return defaultDate;
    }
  },
  created() {
    
    this.sysUser = JSON.parse(window.localStorage.getItem('user'));
    let orgUnitId = this.mate.values.orgUnit;
    let bomId = this.mate.values.bomId;
    let materialsCode = this.mate.values.materialsCode;
    this.mate.fields.map(item => { this.headForm[item.name] = item;});

    this.getOrgUnit();
    if (orgUnitId) {
      this.rules.orgUnit[0].disabled = true;
      this.rules.orgUnit[0].required = false;
      this.rules.materialsCode[0].disabled = true;
      this.rules.materialsCode[0].required = false;
      // 获取库存组织下的物料编码
      this.getMaterialsCode(orgUnitId);
      // 获取库存组织下的 bom
      this.getBomList(orgUnitId);
      // 获取 bom 下的 bom行
      this.getBomSubLine(bomId);
      this.materialsCode = materialsCode;
    }
  },
  mounted() {
    // 初始化日期，默认为当天
    let date = this.mate.values.fromDateStr || "";
    this.mate.values.fromDateStr = date || this.dateInit;
  },
  methods: {
    /**
     * 检查该物料此版本是否已经在流程中
     */
    checkVersion (val) {
      let materialsCode = this.mate.values.materialsCode;
      let _this = this;
      if (!materialsCode) return;
      SERVICES.ECN.checkEcnVersion(materialsCode, val).then(res =>{
        // res.data.data  true说明已存在 反则不存在
        let exist = res.data.data;
        if (exist){
          _this.$message({
            type: "warning",
            message: "此物料版本已在修改中"
          });
          // 已存在 清空新版本号 重新填写
          _this.mate.values.version = '';
          // this.verExist = true;
          // this.$emit('verExist', this.verExist);
        }
      })
    },
    /**
     * 获取 bom 下的 bom 行 新建 ecn /修改 ecn
     * 新增 ecn 时 头部表单选择 bom 请求 bom 行 并传给父组件
     * 修改 ecn 时 自动根据头部信息 请求 bom 行 并传给父组件
     * 在活动选择“失效”时 组件下拉加载 bom 行
     * @params {String} id bomId
     * @return void
     */
    getBomSubLine (id) {
      let _this = this;
      SERVICES.ECN.getBomSubLineList(id).then(res => {
        let data = res.data || [];
        if (data.length > 0){
          data.forEach((item, index)=>{
            _this.materialsCodeOfBomLineOptions.push({
              label: item.componentCode,
              value: item.componentCode,
              name: item.componentName,
              category: item.materialsType,
              unit: item.unit,
              version: String(item.version),
              fileds: item.fileds,
              fromDateStr: item.fromDateStr,
              procedures: item.procedures,
              remarks: item.remarks,
              serialNumber: String(item.serialNumber),
              toDateStr: item.toDateStr,
              used: item.used,
              usageReciprocal: item.usageReciprocal,
              yieldRate: item.yieldRate,
              bomLineId: item.id
            })
          })
        }
        _this.$emit('bomLineList', _this.materialsCodeOfBomLineOptions);
      })
    },
    /**
     * 获取库存组织下的 bom 列表  新建 ecn /修改 ecn
     * 新增 ecn 时 头部表单选择 库存组织时 请求 bom 
     * 修改 ecn 时 自动根据头部信息 请求 bom 
     * 把数据挂到产品料号中去(物料编码下拉)
     * @params {String} id 库存组织id
     * @return void
     */
    getBomList (id) {
      let _this = this;
      SERVICES.ECN.getBomList(id).then(res =>{
        let data = res.data;
        if (data.length > 0) {
          data.forEach((item, index) => {
            _this.materialsCodeOfBomOptions.push({
              label: item.materialsCode,
              value: item.materialsCode,
              name: item.materialsName,
              category: item.materialsType,
              unit: item.unit,
              version: item.version,
              bomId: item.id
            });
          });
        }
      });
    },
    getFromDate(value) {
      this.mate.values["fromDateStr"] = value;
    },
    /**
     * 获取库存组织  新建 ecn /修改 ecn
     * 新增 ecn 时 自动请求库存组织
     * 修改 ecn 时 自动请求库存组织
     * 并保存到 orgUnitOptions
     * @param void
     * @return void
     */
    getOrgUnit() {
      let _this = this;
      SERVICES.BASE.getOrgUnit().then(res =>{
        let data = res.data;
        if (data.length > 0){
          data.forEach(item => {
            _this.orgUnitOptions.push({
              label: item.name,
              value: item.id,
              id: item.id
            })
          });
        }
      })
    },
    /**
     * 获取物料编码 品名 物料类型 单位 并保存到 materialsCodeOptions
     * @param {String} id 库存组织id
     * @return void
     */
    getMaterialsCode(id) {
      let _this = this;
      let type = "2";
      SERVICES.BASE.getMaterialsCode(id, type).then(res =>{
        let data = res.data;
        if (data.length> 0){
          data.forEach(item => {
            _this.materialsCodeOptions.push({
              label: item.subcode,
              value: item.id,
              name: item.name,
              category: item.materialCategory,
              unit: item.basicUnit
            });
          });
          _this.$emit('materialsCode', _this.materialsCodeOptions)
        }
      });
    },
    /**
     * 改变库存组织选项 根据库存组织获取对应的物料
     * 清除或者切换选项
     * @param {String} id 库存组织id
     * @return void
     */
    changeOrgUnit(id) {
      let _this = this;
      // 改变库存组织清空物料信息
      let values = this.mate.values;
      values.materialsId = "";
      values.materialsCode = "";
      values.materialsName = "";
      values.materialsType = "";
      values.unit = "";
      values.version = "";
      values.bomId ="";
      this.$emit('clearEcnLineList');
      if (id) {
        this.materialsCodeOfBomOptions = [];
        this.getBomList(id);
        this.getMaterialsCode(id);
      } else {
        _this.$message({
          message: "请选择库存组织",
          type: "warning"
        });
        return;
      }
    },
    /**
     * 选择(产品料号)物料编码
     * @param {String} id 物料id
     * @return void
     */
    changeMaterialsCode(value) {
      // 头部From值
      let values = this.mate.values;
      this.$emit('clearEcnLineList');
      if (value) {
        let obj = this.materialsCodeOfBomOptions.find(item => item.value === value);
        // let code = obj.label;
        let bomId = obj.bomId;
        // values.materialsId = obj.value;
        values.materialsId = obj.label;
        values.materialsCode = obj.label;
        values.materialsName = obj.name;
        values.materialsType = obj.category;
        values.unit = obj.unit;
        values.oldVersion = obj.version;
        values.version = "";
        values.bomId = obj.bomId;
        this.getBomSubLine(bomId);
      } else {
        values.materialsId = "";
        values.materialsCode = "";
        values.materialsName = "";
        values.materialsType = "";
        values.unit = "";
        values.oldVersion = "";
        values.version = "";
        values.bomId ="";
      }
    }
  },
  watch: {
    "mate.values.materialsCode": {
      handler(curVal, oldVal) {
        this.oldMaterialsCode = oldVal;
      }
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
.el-select,.el-input-number {
  width: 100%;
}
.el-date-editor.el-input {
  width: 100%;
}
.input_number /deep/ input{
  text-align: left;
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
