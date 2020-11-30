<template>
  <div>
    <el-row>
      <el-form :model="mate.selectFormDto.values" :inline="mate.selectFormDto.inline" label-position="right" ref="ruleForm">
          <template>
              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="object['customerId'].label" :prop="object['customerId'].name" >
                  <el-select clearable @change="changecustomerId" v-model="mate.selectFormDto.values['customerId']">
                    <el-option :label="item.label" :value="item.value" v-for="item of customerNameOps" :key="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              
              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="object['customerPo'].label" :prop="object['customerPo'].name" >
                  <el-input  v-model="mate.selectFormDto.values['customerPo']"></el-input>
                </el-form-item>
              </el-col>

               <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="object['materialId'].label" :prop="object['materialId'].name" >
                  <el-input  v-model="mate.selectFormDto.values['materialId']"></el-input>
                </el-form-item>
              </el-col>
              
              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item  :label="object['requiredateFrom'].label" :prop="object['requiredateFrom'].name">
                  <el-date-picker clearable type="date" v-model="mate.selectFormDto.values['requiredateFrom']" placeholder="选择日期"></el-date-picker>
                </el-form-item>
              </el-col>
              
              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item  :label="object['requiredateTo'].label" :prop="object['requiredateTo'].name">
                  <el-date-picker clearable type="date" v-model="mate.selectFormDto.values['requiredateTo']" placeholder="选择日期"></el-date-picker>
                </el-form-item>
              </el-col>

               <el-col :sm="12" :md="8" :lg="6">
                <el-form-item  :label="object['createFrom'].label" :prop="object['createFrom'].name">
                  <el-date-picker clearable type="date" v-model="mate.selectFormDto.values['createFrom']" placeholder="选择日期"></el-date-picker>
                </el-form-item>
              </el-col>

               <el-col :sm="12" :md="8" :lg="6">
                <el-form-item  :label="object['createTo'].label" :prop="object['createTo'].name">
                  <el-date-picker clearable type="date" v-model="mate.selectFormDto.values['createTo']" placeholder="选择日期"></el-date-picker>
                </el-form-item>
              </el-col>
          </template>
      </el-form>
    </el-row>

    <div class="button">
      <el-button type="primary" @click="querySubmit">查 询</el-button>
      <el-button @click="backword">取 消</el-button>
    </div>
    <KTable :mate="mate.listDto" @actionSelected="handleSelected" class="KTable-margin-top" @action="handleKtable"></KTable>
    
    <el-dialog title="PO明细" :visible.sync="dialogVisible" width="80%">
      <KTable :mate="mate.listDto"  class="KTable-margin-top"></KTable>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import { DateFormat } from '../../utils/util.js'
export default {
  data () {
    return {
      object: {},
      selectedIds: [],
      btn: {},
      row: [],
      customerNameOps: [],
      dialogVisible: false
    }
  },
  props: {
    mate: Object
  },
  created () {
    this.mate.selectFormDto.fields.map((i) => { this.object[i.name] = i })
    this.getCustomer() // 获取客户
  },
  components: {
    KTable: function index (resolve) {
      require(['../../components/KTable.vue'], resolve)
    }
  },
  methods: {
    // 获取客户
    getCustomer () {
      var vm = this
      this.$root.ajaxData('/companys/companyInfo/4?dataOnly=true&nopaing=true', {}, function (data) {
      // 设置客户编码为空
        vm.customerNameOps = []
        data.map((i) => {
          vm.customerNameOps.push({ 'label': i.name, 'value': i.id })
        })
      }, 'GET')
    },
    changecustomerId (val) {
    },
    querySubmit () {
      const vm = this
      this.mate.selectFormDto.values.requiredateFrom = DateFormat(this.mate.selectFormDto.values.requiredateFrom, 'yyyy-MM-dd')
      this.mate.selectFormDto.values.requiredateTo = DateFormat(this.mate.selectFormDto.values.requiredateTo, 'yyyy-MM-dd')
      this.mate.selectFormDto.values.createFrom = DateFormat(this.mate.selectFormDto.values.createFrom, 'yyyy-MM-dd')
      this.mate.selectFormDto.values.createTo = DateFormat(this.mate.selectFormDto.values.createTo, 'yyyy-MM-dd')
      this.$root.ajaxData('/purchase/so/lines/getShipData', this.mate.selectFormDto.values, function (data) {
        vm.mate.listDto.rows = data
      }, 'POST')
    },
    backword () {
      this.mate.selectFormDto.values = {}
      this.$root.monitor({ url: '/purchase/cusPoToSo/getSelectMeta' })
    },
    handleSelected (val) {
    },
    handleKtable (btn, row) {
      const vm = this
      this.btn = btn
      if (this.btn.action === 'deleteQuotation') {
        this.dialogVisible = true
      }
    }
  }
}
</script>
