<!-- created by zhongxiaolong on 2019/08/27 -->
<!-- 新增模块列表行表单 -->
<template>
  <div>
    <el-row>
      <el-form
        size="mini"
        :model="mateFormerLine.values"
        label-position="right"
        :ref="formName"
        :rules="rules"
        :label-width="labelWidth"
      >
        <!-- 序号 -->
        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="lineForm['serialNumber'].label" :prop="lineForm['serialNumber'].name">
            <el-input-number 
            :disabled="rules['serialNumber'] && rules['serialNumber'][0].disabled"
            v-model.number="mateFormerLine.values['serialNumber']"
            :controls="controls" 
            :precision="0" 
            :min="1"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <!-- 任务名称 -->
        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="lineForm['taskName'].label" :prop="lineForm['taskName'].name">
            <dict-selected
            v-model="mateFormerLine.values['taskName']"
            dictType="taskName"
            :initValue="mateFormerLine.values['taskName']"
            :rowId="showDict"
            :filterable="dictFilterable"
            :allowCreate="dicAllowCreate"
            ></dict-selected>
          </el-form-item>
        </el-col>
        <!-- 责任人 -->
        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="lineForm['chargeId'].label" :prop="lineForm['chargeId'].name">
            <el-select 
            filterable
            :disabled="rules['chargeId'] && rules['chargeId'][0].disabled"
            v-model="mateFormerLine.values['chargeId']"
            @change="changeHandle(mateFormerLine.values['chargeId'])"
            ><el-option :label="item.label" :value="item.value" v-for="item of curUsersList" :key="item.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 是否上传附件 -->
        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="lineForm['isRequired'].label" :prop="lineForm['isRequired'].name">
            <dict-selected
            v-model="mateFormerLine.values['isRequired']"
            dictType="yes_no"
            :initValue="mateFormerLine.values['isRequired']"
            :rowId="showDict"
            ></dict-selected>
          </el-form-item>
        </el-col>
        <!-- 预计完成日期 -->
        <el-col :sm="12" :md="12" :lg="12">
          <el-form-item :label="lineForm['completeTimeStr'].label" :prop="lineForm['completeTimeStr'].name">
            <el-date-picker
            :picker-options="pickerOptions"
            clearable
            v-model="mateFormerLine.values['completeTimeStr']"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm"
            placeholder="选择日期"
            :disabled="rules['completeTimeStr'] && rules['completeTimeStr'][0].disabled"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <!-- 备注 -->
        <el-col :sm="12" :md="12" :lg="12">
          <el-form-item :label="lineForm['remark'].label" :prop="lineForm['remark'].name">
            <el-input 
            type="textarea"
            :disabled="rules['remark'] && rules['remark'][0].disabled" 
            v-model="mateFormerLine.values['remark']"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>
import { SMART_ORDER_API,BASE_API } from "@/services/apis"
import SERVICES from "@/services"

export default {
  components: {
    'dict-selected': function index (resolve) {
      require(['@/components/DictSelected.vue'], resolve)
    }
  },
  data(){
    return{
      formName: 'form',       // 表单 ref 名称
      controls: false,        // input-number 隐藏按钮
      lineForm: {},           // 新增行表单
      defaultValues: {},      // 新增行表单默认数据
      labelPosition: "right", // label位置
      dicAllowCreate: true,   // 数字词典是否允许新建
      dictFilterable: true,   // 数字词典是否支持过滤
      curUsersList: this.usersList,          // 责任人列表
      isRequiredDefault: '1',
      showDict: 0,
      rules: {
        serialNumber: [
          {required: true, message: "该输入项为必输项", trigger: "blur", disabled: false, type: "number" },
        ], // 序号
        taskName: [{required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }], // 任务名称
        chargeId:[{required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }], // 预计完成日期
        completeTimeStr:[{required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }],// 是否上传附件
        isRequired:[{required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }],// 是否上传附件
        remark:[{disabled: false}], // 备注
      },
      pickerOptions: {
        // 日期禁用今天之前的
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
    }
  },
  props: {
    mateFormerLine: Object,
    labelWidth: String,
    lineValues: Object,
    usersList: Array
  },
  created() {
    // 用于设置默认值
    this.defaultValues = this.lineValues;
    this.mateFormerLine.fields.map(item => { this.lineForm[item.name] = item; });
    // 获取责任人列表
    // if (this.curUsersList.length != '0') this.getUsersList();
  },
  mounted () {
  },
  methods: {
    /**
     * 获取责任人列表
     * @param void
     * @return void
     */
    getUsersList () {
      SERVICES.BASE.getUsersList().then(res =>{
        let data = res.data;
        if (!data.length) return;
        data.forEach(item =>{
          if ((item.username == "") || (item.username == undefined) || (item.id == "")) return;
          this.curUsersList.push({ 
            'label': item.username,
            'value': item.id,
            'id': item.id,
            })
        })
      });
    },
    /**
     * 下拉框 change 事件
     * @param {String} id 当前选中项 id
     * @return void
     */
    changeHandle (id){
      let user = this.usersList.find(item => item.id === id);
      if (user.id) this.mateFormerLine.values.chargeName = user.label;
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
