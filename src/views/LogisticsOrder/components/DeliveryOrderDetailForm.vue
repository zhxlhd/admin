<!-- created by hezhiqiang on 2019/11/28 -->
<!-- 新增模块明细行新增系统外出货表单 -->
<template>
  <div>
    <el-row>
      <el-form size="mini" :model="mateDetailHeader.values" label-position="right" :ref="formName" :rules="rules" :label-width="labelWidth">
        <!-- 行号 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="detailForm.lineNum.label" :prop="detailForm.lineNum.name">
            <el-input
              readonly
              :disabled="showDisabled" 
              v-model="mateDetailHeader.values['lineNum']">
            </el-input>
          </el-form-item>
        </el-col>
        <!-- 业务实体 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="detailForm.officeId.label" :prop="detailForm.officeId.name">
            <el-select
              :disabled="showDisabled"
              v-model="mateDetailHeader.values['officeId']"
              placeholder="请选择业务实体">
              <el-option
                v-for="item in businessEntities"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 出货计划单号 -->
        <!-- <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="detailForm.deliveryPlanNo.label" :prop="detailForm.deliveryPlanNo.name">
            <el-select
              :disabled="showDisabled"
              v-model="mateDetailHeader.values['deliveryPlanNo']"
              placeholder="请选择出货计划单号">
              <el-option
                v-for="item in deliveryPlanNos"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
        <!-- 物料编码 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="detailForm.materialCode.label" :prop="detailForm.materialCode.name">
            <el-input 
              :disabled="showDisabled" 
              v-model="mateDetailHeader.values['materialCode']">
            </el-input>
          </el-form-item>
        </el-col>
        <!-- 物料描述 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="detailForm.materialDescription.label" :prop="detailForm.materialDescription.name">
            <el-input 
              :disabled="showDisabled" 
              v-model="mateDetailHeader.values['materialDescription']">
            </el-input>
          </el-form-item>
        </el-col>
        <!-- 栈板数量 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="detailForm.palletsQuantity.label" :prop="detailForm.palletsQuantity.name">
            <el-input-number
              :disabled="showDisabled" 
              v-model.number="mateDetailHeader.values['palletsQuantity']"
              :controls="controls"
              :precision="0"
              :min="1">
            </el-input-number>
          </el-form-item>
        </el-col>
        <!-- 栈板重量 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="detailForm.palletsWeight.label" :prop="detailForm.palletsWeight.name">
            <el-input
              :disabled="showDisabled" 
              v-model.number="mateDetailHeader.values['palletsWeight']">
            </el-input>
          </el-form-item>
        </el-col>
        <!-- 箱数 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="detailForm.boxesQuantity.label" :prop="detailForm.boxesQuantity.name">
            <el-input-number
              :disabled="showDisabled" 
              v-model.number="mateDetailHeader.values['boxesQuantity']"
              :controls="controls"
              :precision="0"
              :min="1">
            </el-input-number>
          </el-form-item>
        </el-col>
        <!-- 出货数量 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="detailForm.shippingQty.label" :prop="detailForm.shippingQty.name">
            <el-input-number
              :disabled="showDisabled" 
              v-model.number="mateDetailHeader.values['shippingQty']"
              :controls="controls"
              :precision="0"
              :min="1">
            </el-input-number>
          </el-form-item>
        </el-col>        
        <!-- 栈板尺寸 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="detailForm.palletSize.label" :prop="detailForm.palletSize.name">
            <el-input
              :disabled="showDisabled"
              v-model="mateDetailHeader.values['palletSize']">
            </el-input>
          </el-form-item>
        </el-col>
        <!-- 纸箱尺寸 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="detailForm.boxSize.label" :prop="detailForm.boxSize.name">
            <el-input
              :disabled="showDisabled"
              v-model="mateDetailHeader.values['boxSize']">
            </el-input>
          </el-form-item>
        </el-col>
        <!-- 总毛重 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="detailForm.roughWeight.label" :prop="detailForm.roughWeight.name">
            <el-input
              :disabled="showDisabled"
              v-model="mateDetailHeader.values['roughWeight']">
            </el-input>
          </el-form-item>
        </el-col>
        <!-- 总体积 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="detailForm.totalVolume.label" :prop="detailForm.totalVolume.name">
            <el-input
              :disabled="showDisabled"
              v-model="mateDetailHeader.values['totalVolume']">
            </el-input>
          </el-form-item>
        </el-col>
        <!-- 备注 -->
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item :label="detailForm.remark.label" :prop="detailForm.remark.name">
            <el-input
              :disabled="showDisabled"
              type="textarea"
              :rows="2"
              v-model="mateDetailHeader.values['remark']"
              placeholder="请输入出货备注">
            </el-input>
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
      formName: 'form',       // 表单 ref 名称
      controls: false,        // input-number 隐藏按钮
      detailForm: {},           // 新增行表单
      defaultValues: {},      // 新增行表单默认数据
      labelPosition: "right", // label位置
      businessEntities: [],   // 业务实体
      deliveryPlanNos: [],     // 计划单号
      rules: {
        // 业务实体
        officeId: [{required: true,message: "该输入项为必输项",trigger: "blur"}],
        // 物料编码
        materialCode: [{required: true,message: "该输入项为必输项",trigger: "blur"}],
        // 出货数量
        deliveryQuantity: [{required: true,message: "该输入项为必输项",trigger: "blur"}],
        // 总毛重
        roughWeight: [{required: true,message: "该输入项为必输项",trigger: "blur"}],
        // 总体积
        totalVolume: [{required: true,message: "该输入项为必输项",trigger: "blur"}],
      },
    }
  },
  props: {
    mateDetailHeader: Object,
    labelWidth: String,
    detailValues: Object,
  },
  created() {
    // 用于设置默认值
    this.defaultValues = this.detailValues;
    this.mateDetailHeader.fields.map(item => { this.detailForm[item.name] = item; });
    this._getOffice()
  },
  mounted () {
  },
  methods: {
    /**
     * 获取业务实体
     * @param void
     * @return void
     */
    _getOffice () {
      SERVICES.LOGISTICS_DELIVERY_ORDER.getOffice().then(res => {
        let data = res.data;
        if (!data.length) return;
        data.forEach(item => {
          if ((item.name == "") || (item.name == undefined) || (item.id == "")) return;
          this.businessEntities.push({
            'label': item.name,
            'value': item.id,
            'key': item.id,
          })
        })
      })
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
