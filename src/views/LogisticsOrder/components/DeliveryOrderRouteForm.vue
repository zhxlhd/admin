<!-- created by hezhiqiang on 2019/11/29 -->
<!-- 新增模块列表线路表单 -->
<template>
  <div>
    <el-row>
      <el-form size="mini" :model="mateRouteHeader.values" label-position="right" :ref="formName" :rules="rules" :label-width="labelWidth">
        <!-- 行号 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="routeForm.lineNum.label" :prop="routeForm.lineNum.name">
            <el-input
              readonly
              v-model="mateRouteHeader.values['lineNum']">
            </el-input>
          </el-form-item>
        </el-col>
        <!-- 物流线路 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="routeForm.logisticsRouteId.label" :prop="routeForm.logisticsRouteId.name">
            <el-select
              v-model="mateRouteHeader.values['logisticsRouteId']"
              @change="changeLogisticsRoute(mateRouteHeader.values['logisticsRouteId'])"
              placeholder="请选择物流路线">
              <el-option
                v-for="item in logisticsRouteNames"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 线路段号 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="routeForm.routeRangeNo.label" :prop="routeForm.routeRangeNo.name">
            <dict-selected
              v-model="mateRouteHeader.values['routeRangeNo']"
              dictType="routeSegmentNun"
              :initValue="mateRouteHeader.values['routeRangeNo']"
              :rowId="showDict"
              @input="changeValue">
            </dict-selected>
          </el-form-item>
        </el-col>
        <!-- 线路编号 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="routeForm.routeCode.label" :prop="routeForm.routeCode.name">
            <el-input
              :disabled="showDisabled"
              v-model="mateRouteHeader.values['routeCode']">
            </el-input>
          </el-form-item>
        </el-col>
        <!-- 物流商 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="routeForm.logisticsProviderId.label" :prop="routeForm.logisticsProviderId.name">
            <el-select
              :disabled="showDisabled"
              v-model="mateRouteHeader.values['logisticsProviderId']"
              @change="changeLogisticeProvider(mateRouteHeader.values['logisticsProviderId'])"
              placeholder="请选择物流商">
              <el-option
                v-for="item in provider"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 物流商电话 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="routeForm.logisticsProviderPhone.label" :prop="routeForm.logisticsProviderPhone.name">
            <el-input
              :disabled="showDisabled" 
              v-model="mateRouteHeader.values['logisticsProviderPhone']">
            </el-input>
          </el-form-item>
        </el-col>
        <!-- 物流商Email -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="routeForm.logisticsProviderEmail.label" :prop="routeForm.logisticsProviderEmail.name">
            <el-input
              :disabled="showDisabled" 
              v-model="mateRouteHeader.values['logisticsProviderEmail']">
            </el-input>
          </el-form-item>
        </el-col>
        <!-- 车型 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="routeForm.carType.label" :prop="routeForm.carType.name">
            <dict-selected
              v-model="mateRouteHeader.values['carType']"
              dictType="carTypes"
              :initValue="mateRouteHeader.values['carType']"
              :rowId="showDict">
            </dict-selected>
          </el-form-item>
        </el-col>
        <!-- 时效 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="routeForm.effectiveTime.label" :prop="routeForm.effectiveTime.name">
            <dict-selected
              v-model="mateRouteHeader.values['effectiveTime']"
              dictType="aging"
              :initValue="mateRouteHeader.values['effectiveTime']"
              :rowId="showDict">
            </dict-selected>
          </el-form-item>
        </el-col>
        <!-- 出货模式 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="routeForm.deliveryType.label" :prop="routeForm.deliveryType.name">
            <el-select
              :disabled="showDisabled"
              v-model="mateRouteHeader.values['deliveryType']">
              <el-option
                v-for="item in deliveryModeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>
import SERVICES from "@/services"

export default {
  data(){
    return{
      formName: 'form',           // 表单 ref 名称
      controls: false,            // input-number 隐藏按钮
      routeForm: {},              // 新增线路表单
      showDisabled: true,        // 表单字段显示隐藏
      showDict: 0,                // 数字词典是否禁用 1/0
      defaultValues: {},          // 新增行表单默认数据
      labelPosition: "right",     // label位置
      logisticsRouteData: [],     // 物流线路数据
      logisticsRouteNames: [],    // 物流线路下拉值
      providerData: [],           // 物流商数据
      provider: [],               // 物流商下拉值
      deliveryModeOptions:[],
      rules: {
        // 物流线路
        logisticsRouteId: [{required: true,message: "该输入项为必输项",trigger: "blur"}],
        // 线路段号
        routeRangeNo: [{required: true,message: "该输入项为必输项",trigger: "blur"}],
      },
    }
  },
  components: {
    "dict-selected": function index(resolve) {
      require(["@/components/DictSelected.vue"], resolve);
    }
  },
  props: {
    mateRouteHeader: Object,
    labelWidth: String,
    routeValues: Object,
    mateListData: Object,
    LogisticsProviderId: String
  },
  created() {
    // 用于设置默认值
    this.defaultValues = this.routeValues;
    this.mateRouteHeader.fields.map(item => { this.routeForm[item.name] = item; });
    this.deliveryModeOptions = this.routeForm.deliveryType.options
    this._getProvider()
  },
  watch: {
    'LogisticsProviderId': {
      immediate:true,
      handler:function(){
        this._getRoute()
      },
    }
  },
  mounted () {
  },
  methods: {
    /**
     * 获取物流线路
     * @param void
     * @return void
     */
    _getRoute () {
      this.logisticsRouteNames = []
      SERVICES.LOGISTICS_DELIVERY_ORDER.getLogisticsLine(this.LogisticsProviderId).then(res => {
        this.logisticsRouteData = res.data;
        if (this.logisticsRouteData.length) {
          this.logisticsRouteData.forEach(item => {
            if ((item.routeName == "") || (item.routeName == undefined) || (item.id == "")) return;
            this.logisticsRouteNames.push({
              'label': item.routeName,
              'value': item.id,
              'key': item.id,
            })
          })
        }
      })
    },
    /**
     * 修改物流线路
     */
    changeLogisticsRoute (val) {
      this.logisticsRouteData.forEach(i => {
        if (i.id === val) {
          this.$set(this.mateRouteHeader.values,'logisticsRouteName',i.routeName)
          this.$set(this.mateRouteHeader.values,'routeCode',i.routeCode)
          this.$set(this.mateRouteHeader.values,'deliveryType',i.transportMode)
        }
      })
    },
    /**
     * 获取物流商
     * @param void
     * @return void
     */
    _getProvider () {
      let _this = this
      SERVICES.LOGISTICS_DELIVERY_ORDER.getLogisticsProvider().then(res => {
        this.providerData = res.data;
        if (this.providerData.length) {
          this.providerData.forEach(item => {
            if ((item.providerName == "") || (item.providerName == undefined) || (item.id == "")) return;
            this.provider.push({
              'label': item.providerName,
              'value': item.id,
              'key': item.id,
            })
            if (_this.mateRouteHeader.values['logisticsProviderId'] === item.id) {
              _this.mateRouteHeader.values['logisticsProviderName'] = item.providerName
            }
          })
        }
      })
    },
    /**
     * 修改物流商
     */
    changeLogisticeProvider (val) {
      this.providerData.forEach(i => {
        if (i.id === val) {
          this.mateRouteHeader.values['logisticsProviderName'] = i.providerName
        }
      })
    },
    /**
     * 修改线路段号
     */
    changeValue (val) {
      if (this.mateListData) {
        this.mateListData.forEach(item => {
          if (item.routeRangeNo === val) {
            this.$message({
              type: 'warning',
              message: '该线路段号已存在,请重新选择'
            })
            this.mateRouteHeader.values['routeRangeNo'] = []
          }
        })
      }
    },
    /**
     * 重置弹窗表单
     * 数据清空，验证信息重置
     * @param {String} formName 需要重置的表单 ref 名称
     * @return void
     */
    resetForm (formName) {
      let name = formName || this.formName;
      this.$refs[name].resetFields();
    },
  }
}
</script>

<style scoped lang="scss">
.el-form-item {
    margin: 15px 20px 2px 0px;
}
.el-form-item__error{
  top: inherit;
  left: inherit;
}
.el-form-item__label{
  line-height:inherit
}
.tbutton {
  margin: 3px 0;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}
.el-form-item--mini.el-form-item {
  margin: 6px;
}
.el-input--mini .el-input__inner{
  width:80%
}
.el-textarea{
  width: 100%
}
.el-input__suffix {
  right:80px
}
.ats-tree .ats-input{
  width:80%
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
.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 100%;
}
.el-cascader--mini{
  width: 100%
}
.el-select {
  width: 100%;
}
</style>
