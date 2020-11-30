<template>
  <div>
    <el-row>
      <el-form size="mini" :model="mate.mateFormer.values" :inline="mate.mateFormer.inline" :label-position="labelPosition" ref="ruleForm" :label-width="labelWidth">
        <template>

           <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['officeId'].label" :prop="object['officeId'].name">
              <el-select clearable  v-model="mate.mateFormer.values['officeId']">
                <el-option :label="item.label" :value="item.value" v-for="item of officeIdOptions" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item  :label="object['beginTime'].label" :prop="object['beginTime'].name">
              <el-date-picker clearable type="date" v-model="mate.mateFormer.values['beginTime']"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item  :label="object['endTime'].label" :prop="object['endTime'].name">
              <el-date-picker clearable type="date" v-model="mate.mateFormer.values['endTime']"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['orgId'].label" :prop="object['orgId'].name">
               <el-select clearable  v-model="mate.mateFormer.values['orgId']">
                <el-option :label="item.label" :value="item.value" v-for="item of object['orgId'].options" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['customerId'].label" :prop="object['customerId'].name">
              <el-select clearable @change="changecustomerId" v-model="mate.mateFormer.values['customerId']">
                <el-option :label="item.label" :value="item.value" v-for="item of object['customerId'].options" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['customerName'].label" :prop="object['customerName'].name" >
              <el-input v-model="mate.mateFormer.values['customerName']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['state'].label" :prop="object['state'].name">
              <dict-selected clearable v-model="mate.mateFormer.values['state']" dictType="saleLineState" :initValue="mate.mateFormer.values['state']"></dict-selected>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['soNum'].label" :prop="object['soNum'].name">
              <el-select clearable v-model="mate.mateFormer.values['soNum']">
                <el-option :label="item.label" :value="item.value" v-for="item of object['soNum'].options" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['soType'].label" :prop="object['soType'].name">
              <dict-selected v-model="mate.mateFormer.values['soType']" dictType="soType" :initValue="mate.mateFormer.values['soType']"></dict-selected>
            </el-form-item>
          </el-col>

        </template>
      </el-form>
    </el-row>

    <div class="tbutton">
      <el-button @click="querySubmit" size="mini">查 询</el-button>
      <el-button @click="backword" size="mini">取 消</el-button>
    </div>

    <KTable :pageSize="mate.mateList.size" :mate="mate.mateList" @actionSelected="handleSelected" class="KTable-margin-top" @action="handleKtable"></KTable>

  </div>
</template>

<script>
import Vue from 'vue'
import treeSelect from '../../components/tree-select/tree.vue'
import { DateFormat } from '../../utils/util.js'
export default{
  data () {
    return {
      object: {},
      customerIdData: {},
      selectedIds: [],
      selected: [],
      officeIdOptions: [],
      btn: {},
      row: [],
      labelPosition: 'right'
    }
  },
  props: {
    mate: Object
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
  created () {
    const vm = this
    this.mate.mateFormer.fields.map((i) => { this.object[i.name] = i })
    // 获取全部的客户编码
    this.$root.ajaxData('/companys/companyInfo/4?dataOnly=true&nopaing=true', {}, function (data) {
      vm.customerIdData = data
      // 设置客户编码为空
      vm.object['customerId'].options = []
      data.map((i) => {
        vm.object['customerId'].options.push({ 'label': i.code, 'value': i.id })
      })
    }, 'GET')
    // 获取全部的订单编号
    this.$root.ajaxData('/purchase/so/headers/all/list?dataOnly=true', {}, function (data) {
      vm.object['soNum'].options = []
      data.map((i) => {
        vm.object['soNum'].options.push({ 'label': i.soNum, 'value': i.soNum })
      })
    }, 'GET')
    this.$root.ajaxData('/org/inventory/all?dataOnly=true', {}, function (data) {
      vm.object['orgId'].options = []
      data.map((i) => {
        vm.object['orgId'].options.push({ 'label': i.name, 'value': i.id })
      })
    }, 'GET')
    this.mate.mateList.localName = this.mate.localName
    this.getOfficeId()
  },
  components: {
    KTable: function index (resolve) {
      require(['../../components/KTable.vue'], resolve)
    },
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
    },
    'tree-selected': function index (resolve) {
      require(['../../components/TreeSelected.vue'], resolve)
    },
    treeSelect
  },
  methods: {
    // 点击查询按钮
    querySubmit () {
      const vm = this
      this.mate.mateFormer.values.beginTime = DateFormat(this.mate.mateFormer.values.beginTime, 'yyyy-MM-dd')
      this.mate.mateFormer.values.endTime = DateFormat(this.mate.mateFormer.values.endTime, 'yyyy-MM-dd')
      this.$root.ajaxData('/purchase/so/lines/getShipData', this.mate.mateFormer.values, function (data) {
        vm.mate.mateList = data.mate
      }, 'POST')
    },
    getOfficeId () {
      const vm = this
      this.$root.ajaxData('/users/office', {}, function (data) {
        data.forEach(i => {
          vm.officeIdOptions.push({ 'label': i.orgName, 'value': i.officeId })
            // 只有一个机构，就将机构放进去
          // if (!vm.mate.mateFormer.values.id) {
          //   if (vm.officeIdOptions.length === 1) {
          //     vm.mate.mateFormer.values.officeId = vm.officeIdOptions[0].value
          //   }
          // }
        })
      }, 'GET')
    },
    backword () {
      this.mate.mateFormer.values = {}
      this.$root.monitor({ url: '/purchase/so/lines/getShipData/list' })
    },
    handleKtable (btn, row) {
      const vm = this
      this.btn = btn
      // row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
      // 生成出库单
      if (this.btn.action === 'updataDetailBill') {
        if (this.selected.length !== 1) {
          for (var i = 0; i <= this.selected.length - 2; i++) {
            if (this.selected[i].orgId !== this.selected[i + 1].orgId) {
              vm.$message({
                message: '请选择同一发货组织',
                type: 'warning'
              })
              return
            }
          }
        }
        this.$root.ajaxData('/purchase/so/lines/checkExistOutboundBill?ids=' + this.selectedIds.join(','), {}, function (data) {
          if (data.statusCode === 10002) {
            vm.$message({
              message: data.message,
              type: 'warning'
            })
          } else if (data.statusCode === 10003) {
            vm.$message({
              message: data.message,
              type: 'warning'
            })
          } else if (data.statusCode === 10004) {
            vm.$message({
              message: data.message,
              type: 'warning'
            })
          } else if (data.statusCode === 200) {
            vm.$root.monitor({ url: '/purchase/so/lines/create/outboundBill?ids=' + vm.selectedIds.join(',') })
          }
        }, 'GET')
        // 下面是生成退货单
      } else if (this.btn.action === 'deleteQuotation') {
        this.$root.ajaxData('/purchase/so/headers/checkExistSoBill?ids=' + this.selectedIds.join(','), {}, function (data) {
          if (data.statusCode === 10004) {
            vm.$message({
              message: data.message,
              type: 'warning'
            })
          } else if (data.statusCode === 10005) {
            vm.$message({
              message: data.message,
              type: 'warning'
            })
          } else if (data.statusCode === 10006) {
            vm.$message({
              message: data.message,
              type: 'warning'
            })
          } else if (data.statusCode === 200) {
            vm.$root.monitor({ url: '/purchase/so/headers/create/soReturnBill?ids=' + vm.selectedIds.join(',') })
          }
        }, 'GET')
      }
    },
    changecustomerId (val) {
      if (val === '') {
        Vue.set(this.mate.mateFormer.values, 'customerName', '')
        return
      }
      this.customerIdData.map((i) => {
        if (i.id === val) {
          Vue.set(this.mate.mateFormer.values, 'customerName', i.name)
        }
      })
    },
    handleSelected (val) {
      // 第一步就是要清空selectedIDS里面的数据
      this.selectedIds = []
      // map方法也可以
      this.selected = []
      val.map((i) => this.selectedIds.push(i.id))
      val.map((i) => this.selected.push(i))
      // 每次点击都会执行这个函数，要点击两下的时候，this.selectedIds里面包括了前面一次的数据，所以会有重复，要去重
      var arr = []
      var json = {}
      var arrLine = []
      var jsonLine = {}
      for (var i = 0; i < this.selectedIds.length; i++) {
        if (!json[this.selectedIds[i]]) {
          json[this.selectedIds[i]] = 1
          arr.push(this.selectedIds[i])
        }
      }
      for (var i = 0; i < this.selected.length; i++) {
        if (!jsonLine[this.selected[i]]) {
          jsonLine[this.selected[i]] = 1
          arrLine.push(this.selected[i])
        }
      }
      this.selectedIds = arr
    },
    handleSubmit (ev) {
      var vm = this
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let url = vm.mate.url
          const values = vm.mate.values
          if ((vm.mate.method) === 'PUT' && values.id) {
            url = url + '/' + values.id
          }
          const act = { url: url, ajax: true, method: vm.mate.method }
          act.next = this.mate.next || false
          this.$root.action(act, values, function (data) {
            if (data && data.next) {
              act.next = data.next
            }
          })
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
      if (this.formModel === 'page') {
        this.$root.monitor({ url: this.mate.next })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.el-form-item__label{
  line-height:inherit
}
.el-input__suffix {
  right:68px
}
.el-form-item--mini.el-form-item {
  margin: 6px;
}
.el-input,.el-select{
  width: 100%;
}
.el-form-item {
    margin: 15px 20px 2px 0px;
}
.tbutton{
  margin: 3px 0 10px;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}
</style>
