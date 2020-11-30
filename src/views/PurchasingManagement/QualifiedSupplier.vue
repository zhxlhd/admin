<template>
  <div>
     <div class="tbutton">
      <el-button plain class="el-icon-document" @click="handleSubmit">提 交</el-button>     <!--默认为提交，如果有需要可以将其设置为查询-->
      <el-button plain class="el-icon-close" @click="backward" v-if="!mate.inline">取 消</el-button>
       <el-button  plain class="el-icon-date"  @click="resetForm('ruleForm')">重 置</el-button>
    </div>
    <el-row>
      <el-form size="mini" :model="mate.values" ref="ruleForm" :rules="rules"  :inline="mate.inline" label-position="right" :label-width="labelWidth">
        <template>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['officeId'].label" :prop="object['officeId'].name" >
              <el-select clearable disabled filterable  readonly v-model="mate.values[object['officeId'].name]" placeholder="请选择">
                <el-option v-for="item in officeIdOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['materialCode'].label" :prop="object['materialCode'].name" >
              <el-select clearable disabled filterable @change="changeMaterialCode" readonly v-model="mate.values[object['materialCode'].name]" placeholder="请选择">
                <el-option v-for="item in object['materialCode'].options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['materialName'].label" :prop="object['materialName'].name">
              <el-input disabled v-model="mate.values[object['materialName'].name]"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['supplierId'].label" :prop="object['supplierId'].name" >
              <el-select clearable disabled filterable v-model="mate.values[object['supplierId'].name]" placeholder="请选择">
                <el-option v-for="item in object['supplierId'].options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['address'].label" :prop="object['address'].name">
              <el-input disabled v-model="mate.values[object['address'].name]"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['resBillNumber'].label" :prop="object['resBillNumber'].name">
              <el-input disabled v-model="mate.values[object['resBillNumber'].name]"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['manufacturer'].label" :prop="object['manufacturer'].name" >
              <el-input v-model="mate.values[object['manufacturer'].name]"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['validPeriod'].label" :prop="object['validPeriod'].name">
              <el-date-picker clearable type="date" v-model="mate.values[object['validPeriod'].name]" :editable="false"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['expirationDate'].label" :prop="object['expirationDate'].name">
              <el-date-picker clearable type="date" v-model="mate.values[object['expirationDate'].name]" :editable="false"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['state'].label" :prop="object['state'].name">
              <dict-selected v-model="mate.values[object['state'].name]" dictType="QualifiedSupplierState" :initValue="mate.values[object['state'].name]"></dict-selected>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['explain'].label" :prop="object['explain'].name">
              <el-input v-model="mate.values[object['explain'].name]"></el-input>
            </el-form-item>
          </el-col>

        </template>
      </el-form>
    </el-row>
   
  </div>
</template>

<script>
import { DateFormat } from '../../utils/util.js'
export default{
  components: {
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
    }
  },
  data () {
    return {
      object: {},                 // 用来代替从父组件总获取到的数据 mate.filed
      materialCodeData: [],
      officeIdOptions: [],
      rules: {
        materialCode: [
            { required: true, message: '该输入项为必输项', trigger: 'change' }
        ],
        supplierId: [
            { required: true, message: '该输入项为必输项', trigger: 'change' }
        ]
      },
      labelPosition: 'right'
    }
  },
  computed: {
    // a computed getter
    labelWidth: function () {
      let width = ''
      if (this.mate.inline) {
        // width = undefined
        width = '100px'
      } else if (typeof (this.mate.labelWidth) === 'undefined') {
        width = '100px'
      } else if (this.mate.labelWidth === null) {
        width = '100px'
      } else {
        width = this.mate.labelWidth
      }
      return width
    }
  },
  props: {
    mate: Object
  },
  created () {
    this.mate.fields.map((i) => { this.object[i.name] = i })
    this.getmaterailCode()
    this.getSupplierId()
     // 获取库存组织
    var vm = this
    this.$root.ajaxData('/users/office', {}, function (data) {
      data.forEach(i => {
        vm.officeIdOptions.push({ 'label': i.orgName, 'value': i.officeId })
            // 只有一个机构，就将机构放进去
      })
    }, 'GET')
  },
  methods: {
    getmaterailCode () {
      var vm = this
      this.object['materialCode'].options = []
      this.object['manufacturer'].options = []
      this.object['purchaser'].options = []
      this.$root.ajaxData('/materials/getMaterialDropdownList', {}, function (data) {
        vm.materialCodeData = data
        data.forEach((i) => {
          vm.object['materialCode'].options.push({ 'label': i.subcode, 'value': i.id })
        })
      }, 'GET')
    },
    getSupplierId () {
      const vm = this
      this.object['supplierId'].options = []
      this.$root.ajaxData('/purchase/qualified/supplier/getQualifySupplier', {}, function (data) {
        vm.supplierIdData = data
        data.map((item) => {
          vm.object['supplierId'].options.push({ 'label': item.name, 'value': item.id })
        })
      }, 'GET')
    },
    changeMaterialCode (val) {
        // let materialName = this.mate.values[this.object['materialName'].name]
      for (let i = 0; i < this.materialCodeData.length; i++) {
        if (this.materialCodeData[i].id === val) {
          this.mate.values[this.object['materialName'].name] = this.materialCodeData[i].name
        }
      }
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    handleSubmit (ev) {
      var vm = this
      this.mate.values.validPeriod = DateFormat(this.mate.values.validPeriod, 'yyyy-MM-dd')
      this.mate.values.expirationDate = DateFormat(this.mate.values.expirationDate, 'yyyy-MM-dd')
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let url = vm.mate.url
          vm.mate.values.industryCategory = this.industryCategoryValue
          const values = vm.mate.values
          if (vm.mate.inline) {
            vm.mate.values = vm.defaultValues
          } else {
              // PUT 请求URL带上ID
            if ((vm.mate.method) === 'PUT' && values.id) {
              url = '/purchase/qualified/supplier/batchUpdate' + '/' + values.id
            }
            const act = { url: url, ajax: true, method: vm.mate.method }
            act.next = this.mate.next || false
            this.$root.action(act, values, function (data) {
              if (data && data.next) {
                act.next = data.next
              }
            })
          }
        } else {
          this.$notify.error({
            title: '消息',
            message: '数据验证未通过'
          })
          return false
        }
      })
    },
    backward () {
      this.$root.monitor({ url: this.mate.next })
    }
  }
}
</script>

<style scoped lang="scss">
 .el-form-item__label{
  line-height:inherit
}
.el-form-item {
    margin: 15px 20px 2px 0px;
}
.tbutton{
  margin: 3px 0;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}
.el-input__suffix {
  right:80px
}
.el-form-item--mini.el-form-item {
  margin: 6px;
}
.el-input--mini .el-input__inner{
  width:80%
}
</style>
