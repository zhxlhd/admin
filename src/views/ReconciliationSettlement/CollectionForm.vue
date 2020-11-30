<template>
  <div>
      <template>
        <el-row>
          <el-form size="mini" :model="mate.values" ref="CollectionForm" :rules="rules" :inline="mate.inline" :label-width="labelWidth" :label-position="labelPosition">
            <template>

              <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['code'].label" :prop="object['code'].name">
                  <el-input  :disabled="showEdit" v-model="mate.values['code']"></el-input>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['tradeDate'].label" :prop="object['tradeDate'].name">
                  <el-date-picker :disabled="showEdit" clearable type="date" v-model="mate.values['tradeDate']"></el-date-picker>
                </el-form-item>
              </el-col>

               <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['officeId'].label" :prop="object['officeId'].name">
                  <el-select  clearable v-model="mate.values['officeId']" >
                    <el-option :label="item.label" :value="item.value" v-for="item of officeIdOptions" :key="item.name"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['type'].label" :prop="object['type'].name">
                  <el-input :disabled="showEdit" v-model="mate.values['type']"></el-input>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['companyCode'].label" :prop="object['companyCode'].name">
                  <el-select :disabled="showEdit" clearable v-model="mate.values['companyCode']" @change="changeCompany">
                    <el-option :label="item.label" :value="item.value" v-for="item of object['companyCode'].options" :key="item.name"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['companyName'].label" :prop="object['companyName'].name">
                  <el-input :disabled="showEdit" readonly v-model="mate.values['companyName']"></el-input>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['currency'].label" :prop="object['currency'].name">
                  <dict-selected  :rowId="showDict" @input="handlerChangeCurrency" v-model="mate.values['currency']" dictType="currency" :initValue="mate.values['currency']"></dict-selected>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['invoiceAmount'].label" :prop="object['invoiceAmount'].name">
                  <el-input :disabled="showEdit" type="number" v-model="mate.values['invoiceAmount']" @change="changeAmount"></el-input>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['cancAmount'].label" :prop="object['cancAmount'].name">
                  <el-input  readonly v-model="mate.values['cancAmount']"></el-input>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['uncancAmount'].label" :prop="object['uncancAmount'].name">
                  <el-input  readonly v-model="mate.values['uncancAmount']"></el-input>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['remark'].label" :prop="object['remark'].name">
                  <el-input :disabled="showEdit" v-model="mate.values['remark']"></el-input>
                </el-form-item>
              </el-col>
            </template>
          </el-form>
        </el-row>
      </template>
       <el-dialog :visible.sync="dialogGathering" width="40%" :close-on-click-modal="showVisible">
         <span>该供应商存在尚未核销的预收款，是否继续新建收款记录</span>
       <div class="buttonMargin">
         <el-button type="primary" @click="dialogGathering = false">是</el-button>
         <el-button @click="dialogGatheringBack">否</el-button>
       </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  components: {
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
    }
  },
  data () {
    return {
      object: {},
      buttonDisabled: false,
      labelPosition: 'right',
      showEdit: false,
      dialogGathering: false,
      showVisible: false,
      officeIdOptions: [],
      showDict: '',
      rules: {
        companyCode: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        currency: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        invoiceAmount: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ]
      },
      companyData: []
    }
  },
  props: {
    mate: Object
  },
  computed: {
    labelWidth: function () {
      let width = ''
      if (this.mate.inline) {
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
  created () {
    let mateValues = this.mate.values
    if (mateValues.invoiceAmount) {
      mateValues.invoiceAmount = String(mateValues.invoiceAmount)
    }
    const vm = this
    this.mate.fields.map(i => { this.object[i.name] = i })
    this.$root.ajaxData('/companys/companyInfo/4?status=1&auditStatus=1&nopaging=1&dataOnly=true', {}, function (data) {
      vm.object['companyCode'].options = []
      vm.companyData = data
      data.forEach(item => {
        vm.object['companyCode'].options.push({ label: `${item.code} (${item.name})`, value: item.code })
      })
    })
    if (mateValues.id !== '') {
      this.showEdit = true
      this.showDict = '0'
    }
    this.getOfficeId()
  },
  methods: {
    getOfficeId () {
      const vm = this
      this.$root.ajaxData('/users/office', {}, function (data) {
        data.forEach(i => {
          vm.officeIdOptions.push({ 'label': i.orgName, 'value': i.officeId })
          if (!vm.mate.values.id) {
            if (vm.officeIdOptions.length === 1) {
              vm.mate.values.officeId = vm.officeIdOptions[0].value
            }
          }
        })
      }, 'GET')
    },
    changeAmount (val) {
      Vue.set(this.mate.values, 'uncancAmount', val)
      Vue.set(this.mate.values, 'cancAmount', 0)
    },
    changeCompany (val) {
      const vm = this
      this.companyData.find(item => {
        if (item.code === val) {
          Vue.set(vm.mate.values, 'companyName', item.name)
        }
      })
    },
    handlerChangeCurrency (val) {
      var vm = this
      this.$root.ajaxData('/purchase/invoice/checkLine?flag=1&companyCode=' + this.mate.values.companyCode + '&currency=' + this.mate.values.currency, {}, function (data) {
        if (data.statusCode === 10009) {
          vm.dialogGathering = true
        }
      })
    },
    dialogGatheringBack () {
      this.dialogGathering = false
      this.$root.monitor({ url: '/purchase/invoice/received/all/list' })
    }
  }
}
</script>

<style scoped>
.KTable-margin-top{
  margin-top:20px;
}
.button1{
  margin-top:20px;
}
.el-form-item {
    margin: 15px 20px 2px 0px;
}
.button{
  margin-top:20px;
}
.table-margin{
  margin-top:20px;
}
</style>