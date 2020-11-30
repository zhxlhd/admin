<template>
  <div>
    <el-row>
      <el-form :model="mate.values" :label-position="labelPosition" ref="ruleForm" :rules="rules" :label-width="labelWidth">
        <template>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['companyId'].label" :prop="object['companyId'].name">
              <el-select clearable filterable v-model="mate.values[object['companyId'].name]">
                <el-option :label="item.label" :value="item.value" v-for="item of object['companyId'].options" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['type'].label" :prop="object['type'].name">
              <el-select clearable v-model="mate.values[object['type'].name]">
                <el-option :label="item.label" :value="item.value" v-for="item of object['type'].options" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['replyDate'].label" :prop="object['replyDate'].name">
              <el-date-picker clearable type="date" v-model="mate.values[object['replyDate'].name]"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['paymentMethod'].label" :prop="object['paymentMethod'].name" >
              <dict-selected v-model="mate.values[object['paymentMethod'].name]" dictType="paymentMethod" :initValue="mate.values[object['paymentMethod'].name]"></dict-selected>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['currency'].label" :prop="object['currency'].name" >
              <dict-selected v-model="mate.values[object['currency'].name]" dictType="currencyType" :initValue="mate.values[object['currency'].name]"></dict-selected>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['tax'].label" :prop="object['tax'].name" >
              <dict-selected v-model="mate.values[object['tax'].name]" dictType="tax" :initValue="mate.values[object['tax'].name]"></dict-selected>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['explain'].label" :prop="object['explain'].name">
              <el-input v-model="mate.values[object['explain'].name]"></el-input>
            </el-form-item>
          </el-col>

          <!--是否要求审批-->
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['requiredApproval'].label" :prop="object['requiredApproval'].name">
              <dict-selected v-model="mate.values[object['requiredApproval'].name]" dictType="requiredApproval" :initValue="mate.values[object['requiredApproval'].name]"></dict-selected>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['dateFrom'].label" :prop="object['dateFrom'].name">
              <el-date-picker clearable  type="date" v-model="mate.values[object['dateFrom'].name]"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['dateTo'].label" :prop="object['dateTo'].name">
              <el-date-picker clearable type="date" v-model="mate.values[object['dateTo'].name]"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['auditor'].label" :prop="object['auditor'].name">
              <el-select clearable v-model="mate.values['auditor']">
                <el-option :label="item.label" :value="item.value" v-for="item of object['auditor'].options" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

        </template>
      </el-form>
    </el-row>
  </div>
</template>

<script>
  export default{
    components: {
      'dict-selected': function index (resolve) {
        require(['../../components/DictSelected.vue'], resolve)
      }
    },
    data () {
      return {
        object: {},                 // 用来代替从父组件总获取到的数据 mate.filed
        rules: {
          companyId: [
            { required: true, message: '该输入项为必输项', trigger: 'change' }
          ],
          type: [
            { required: true, message: '该输入项为必输项', trigger: 'change' }
          ]
        },
        labelPosition: 'right'
      }
    },
    props: {
      mate: Object
    },
    created () {
      this.mate.fields.map((i) => { this.object[i.name] = i })
      this.getSupplier()
      this.getUser()
    },
    computed: {
    // a computed getter
      labelWidth: function () {
        let width = ''
        if (this.mate.inline) {
        // width = undefined
          width = '100px'
        } else if (typeof (this.mate.labelWidth) === 'undefined') {
          width = '120px'
        } else if (this.mate.labelWidth === null) {
          width = '100px'
        } else {
          width = this.mate.labelWidth
        }
        return width
      }
    },
    methods: {
      // 获取到供应商
      getSupplier () {
        var vm = this
        this.object['companyId'].options
        this.$root.ajaxData('/companys/companyInfo/4?status=1&auditStatus=1&nopaging=1&dataOnly=true', {}, function (data) {
          data.map((item) => {
            vm.object['companyId'].options.push({ 'label': item.name, 'value': item.id })
          })
        }, 'GET')
      },
      // 获取到审批人
      getUser () {
        var vm = this
        this.object['auditor'].options
        this.$root.ajaxData('/users/getUserDropdownList', {}, function (data) {
          data.map((item) => {
            vm.object['auditor'].options.push({ 'label': item.username, 'value': item.id })
          })
        }, 'GET')
      }
    }
  }
</script>

<style scoped>
.el-form-item {
    margin: 15px 20px 2px 0px;
}
</style>
