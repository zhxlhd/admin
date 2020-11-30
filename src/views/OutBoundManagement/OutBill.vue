<template>
  <div>
    <el-row>
      <el-form size="mini" :model="mate.values" :inline="mate.inline" :label-position="labelPosition" ref="ruleForm" :rules="rules" :label-width="labelWidth">
        <template>
          <el-col :sm="12" :md="8" :lg="8">   
            <el-form-item :label="object['orgId'].label" :prop="object['orgId'].name">
              <el-select clearable v-model="mate.values[object['orgId'].name]" :disabled="showOut">
                <el-option :label="item.label" :value="item.value" v-for="item of orgOption" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['documentType'].label" :prop="object['documentType'].name">
              <el-select clearable v-model="mate.values[object['documentType'].name]" :disabled="showOut">
                <el-option :label="item.label" :key="item.name" :value="item.value" v-for="item of object['documentType'].options"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['currencyType'].label" :prop="object['currencyType'].name">
              <el-select clearable v-model="mate.values[object['currencyType'].name]">
                <el-option :label="item.label" :key="item.name" :value="item.value" v-for="item of object['currencyType'].options"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->

          <!-- 作业类别 -->
          <!-- <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['jobType'].label" :prop="object['jobType'].name">
              <el-select clearable v-model="mate.values[object['jobType'].name]">
                <el-option :label="item.label" :key="item.name" :value="item.value" v-for="item of object['jobType'].options"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->

          <!-- 收货单位类型 -->
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['partyType'].label" :prop="object['partyType'].name">
              <el-select clearable @visible-change="visibleChange8" @change="change8" v-model="mate.values[object['partyType'].name]" :disabled="showOut">
                <el-option :label="item.label" :key="item.name" :value="item.value" v-for="item of object['partyType'].options"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 收货单位-->
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['partyId'].label" :prop="object['partyId'].name">
              <el-select clearable :disabled="company" @change="change12" @visible-change="visibleChange9" filterable v-model="mate.values[object['partyId'].name]">
                <el-option :label="item.label" :key="item.name" :value="item.value" v-for="item of object['partyId'].options"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['partySiteId'].label" :prop="object['partySiteId'].name">
              <el-select clearable :disabled="address" @change="changeAddress" @visible-change="visibleChange10" v-model="mate.values[object['partySiteId'].name]">
                <el-option :label="item.label" :key="item.name" :value="item.value" v-for="item of object['partySiteId'].options"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['adressDetail'].label" :prop="object['adressDetail'].name">
              <el-select clearable :disabled="detailAddress" v-model="mate.values[object['adressDetail'].name]">
                <el-option :label="item.label"  :key="item.name" :value="item.value" v-for="item of object['adressDetail'].options"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 收货人 --> 
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['concatUser'].label" :prop="object['concatUser'].name">
              <el-select clearable :disabled="contact" v-model="mate.values[object['concatUser'].name]">
                <el-option :label="item.label" :key="item.name" :value="item.value" v-for="item of object['concatUser'].options"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 单据负责人 --> 
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['docManager'].label" :prop="object['docManager'].name">
              <el-select clearable disabled @visible-change="visibleChange13" v-model="mate.values[object['docManager'].name]">
                <el-option :label="item.label" :key="item.name" :value="item.value" v-for="item of object['docManager'].options"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['deptId'].label" :prop="object['deptId'].name">
              <el-select clearable @visible-change="visibleChangeDeptId" v-model="mate.values[object['deptId'].name]" :disabled="showOut">
                <el-option :label="item.label" :key="item.name" :value="item.value" v-for="item of object['deptId'].options"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['haveInvoice'].label" :prop="object['haveInvoice'].name">
              <el-select clearable v-model="mate.values[object['haveInvoice'].name]">
                <el-option :label="item.label" :key="item.name" :value="item.value" v-for="item of object['haveInvoice'].options"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->

          <!-- <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['invoiceType'].label" :prop="object['invoiceType'].name">
              <dict-selected v-model="mate.values['invoiceType']" dictType="invoiceType" :initValue="mate.values[object['invoiceType'].name]"></dict-selected>
            </el-form-item>
          </el-col> -->

          <!-- <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['salesChannel'].label" :prop="object['salesChannel'].name">
              <el-select clearable v-model="mate.values['salesChannel']">
                <el-option :label="item.label" :key="item.name" :value="item.value" v-for="item of object['salesChannel'].options"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['isUrgent'].label" :prop="object['isUrgent'].name">
              <el-select clearable v-model="mate.values[object['isUrgent'].name]">
                <el-option :label="item.label" :key="item.name" :value="item.value" v-for="item of object['isUrgent'].options"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['shippingType'].label" :prop="object['shippingType'].name" >
              <el-select clearable v-model="mate.values[object['shippingType'].name]">
                <el-option :label="item.label" :key="item.name" :value="item.value" v-for="item of object['shippingType'].options"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['shippingRoute'].label" :prop="object['shippingRoute'].name" >
              <el-select clearable v-model="mate.values[object['shippingRoute'].name]">
                <el-option :label="item.label" :key="item.name" :value="item.value" v-for="item of object['shippingRoute'].options"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item  :label="object['documentDate'].label" :prop="object['documentDate'].name">
              <el-date-picker  disabled clearable type="date" v-model="mate.values[object['documentDate'].name]" ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item  :label="object['expectedShippingDate'].label" :prop="object['expectedShippingDate'].name">
              <el-date-picker clearable type="date" v-model="mate.values[object['expectedShippingDate'].name]" :disabled="showOut"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['docRemark'].label" :prop="object['docRemark'].name" >
              <el-input v-model="mate.values[object['docRemark'].name]" :disabled="showOut"></el-input>
            </el-form-item>
          </el-col>


        </template>
      </el-form>
    </el-row>
    <!--<div class="button">
      <el-button type="primary" @click="handleSubmit">保 存</el-button>
      <el-button @click="backward" v-if="!mate.inline">取 消</el-button>
    </div>-->
  </div>
</template>

<script>
import Vue from 'vue'
import treeSelect from '../../components/tree-select/tree.vue'
export default{
  data () {
    return {
      addressId: '',
      options9: [],
      options10: [],
      orgOption: [],
      company: true,                      // 收货单位，判断是否可以选择
      address: true,                      // 收货地址，判断是否可以选择
      detailAddress: true,                 // 收货的详细地址，判断是否可以选择
      treeSelectArr: [],
      treeSelected: '',
      treeSelectModel: '',
      showOut: false,
      labelPosition: 'right',
      contact: true,
      object: {},
      rules: {
        documentType: [
          { required: true, message: '该输入项为必输项' }
        ],
        orgId: { required: true, message: '该输入项为必输项' }
      }
    }
  },
  props: {
    mate: Object
  },
  computed: {
    // rules () {
    //   var rs = {}
    //   var vm = this
    //   var rls = this.mate.rules
    //   for (var index in rls) {
    //     var r = []
    //     var rule = rls[index]
    //     for (var i in rule) {
    //       var nv = rule[i]
    //       if (nv.validator) {
    //         nv.validator = vm[nv.validator]
    //       }
    //       r[i] = nv
    //     }
    //     rs[index] = r
    //   }
    //   return rs
    // },
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
  created () {
    this.mate.fields.map((i) => { this.object[i.name] = i })
    const vm = this
    // 数据显示作用
    this.object['docManager'].options.push({ 'label': this.mate.values.managerName, 'value': this.mate.values.docManager })
    // 根据id值判断页面是新增页面还是修改页面
    if (this.mate.values.id) {
      // 显示的是收货单位的label的值，而不是values上的值
      if (this.mate.values.partyType === '3') {
        // this.object['partyId'] 代表的是收货单位
        vm.object['partyId'].options = []
        vm.$root.ajaxData('/companys/companyInfo/3?dataOnly=true&nopaging=true', {}, function (data) {
          for (var i = 0; i < data.length; i++) {
            var id = data[i].id
            var name = data[i].name
            var options = { value: id, label: name }
            vm.object['partyId'].options.push(options)
          }
        }, 'GET')
      } else if (this.mate.values.partyType === '4') {
        this.object['partyId'].options = []
        this.$root.ajaxData('/companys/companyInfo/4?dataOnly=true&nopaging=true', {}, function (data) {
          for (var i = 0; i < data.length; i++) {
            var id = data[i].id
            var name = data[i].name
            var options = { value: id, label: name }
            vm.object['partyId'].options.push(options)
          }
        }, 'GET')
      } else if (this.mate.values.partyType === '0') {
        this.$root.ajaxData('/offices/tree/list?dataOnly=true', {}, function (data) {
        }, 'GET')
      }

      // 单据负责人 this.fields[13]
      this.$root.ajaxData('/users/list?cols=id,username&dataOnly=true&all=1', {}, function (data) {
        for (var i = 0; i < data.length; i++) {
          var username = { value: data[i].id, label: data[i].username }
          vm.object['docManager'].options.push(username)
        }
      }, 'GET')

      // 收货单位 this.object['partyId']
      this.$root.ajaxData('/companys/companyInfo/3?cols=name,id&dataOnly=true', {}, function (data) {
        for (var i = 0; i < data.length; i++) {
          var id = data[i].id
          var name = data[i].name
          var options = { value: id, label: name }
          vm.object['partyId'].options.push(options)
        }
      }, 'GET')
    }
    // 出货任务生成出库单 出库单头不可修改
    if (this.mate.values.id === '2' || this.mate.values.id === '1') {
      this.showOut = true
    }
    this.$root.ajaxData('/org/inventory/getOrgByOfficeId?ids=', {}, function (data) {
      data.map((i) => {
        vm.orgOption.push({ 'label': i.name, 'value': i.id })
        // if (!vm.mate.values.id) {
        //   if (vm.orgOption.length !== 0) {
        //     Vue.set(vm.mate.values, 'orgId', vm.orgOption[0].value)
        //   }
        // }
      })
    })
  },
  components: {
    'tree-selected': function index (resolve) {
      require(['../../components/TreeSelected.vue'], resolve)
    },
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
    },
    treeSelect
  },
  methods: {
    // 当组织发生变化之时做的操作
    valChange (val, oldVal) {
      this.mate.values[this.object['deptId'].name] = ''
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
    },
    visibleChange8 (flag) {
      var vm = this
      if (!flag) {
        if (this.mate.values[this.object['partyType'].name]) {
          this.company = true
        }
        if (this.mate.values.partyType === '3') {
          // this.object['partyId'] 代表的是收货单位
          this.object['partyId'].options = []
          this.company = false
          this.$root.ajaxData('/companys/companyInfo/3?status=1&auditStatus=1&nopaging=1&dataOnly=true', {}, function (data) {
            for (var i = 0; i < data.length; i++) {
              var id = data[i].id
              var name = data[i].name
              var options = { value: id, label: name }
              vm.object['partyId'].options.push(options)
            }
          }, 'GET')
        } else if (this.mate.values.partyType === '4') {
          this.object['partyId'].options = []
          this.company = false
          this.$root.ajaxData('/companys/companyInfo/4?status=1&auditStatus=1&nopaging=1&dataOnly=true', {}, function (data) {
            for (var i = 0; i < data.length; i++) {
              var id = data[i].id
              var name = data[i].name
              var options = { value: id, label: name }
              vm.object['partyId'].options.push(options)
            }
          }, 'GET')
        } else if (this.mate.values.partyType === '0') {
          vm.object['partyId'].options = []
          vm.mate.values['partyId'] = ''
          vm.mate.values['partySiteId'] = ''
          vm.mate.values['adressDetail'] = ''
          vm.mate.values['concatUser'] = ''
          vm.company = true
          vm.address = true
          vm.detailAddress = true
          vm.contact = true
        }
      }
    },
    change8 () {
      // 如果是先选客户，然后选组织，就要关闭来货单位
      // if (this.mate.values[this.object['partyType'].name] === '0') {
      //   this.object['partyId'].options = []
      //   this.company = true
      // }
      this.mate.values[this.object['partyId'].name] = ''
      this.mate.values[this.object['partySiteId'].name] = ''
      this.mate.values[this.object['adressDetail'].name] = ''
      this.mate.values[this.object['concatUser'].name] = ''
      this.address = true
      this.detailAddress = true
      this.contact = true
    },
    change12 () {
      this.mate.values[this.object['concatUser'].name] = ''
      this.detailAddress = true
      this.contact = true
    },
    // 获取到的是单位地点信息
    visibleChange9 (flag) {
      var vm = this
      // 清空选项，不然每次点击都会push进去，会出现多条记录
      vm.object['partySiteId'].options = []
      this.mate.values.partySiteId = ''
      if (!flag) {
        // 选择了来货单位的时候，this.mate.values.privider保存的是来货单位的id值
        if (this.mate.values.partyId) {
          this.address = false
          this.$root.ajaxData('/addresses/all/' + this.mate.values.partyId, {}, function (data) {
            vm.options9 = data
            for (var i = 0; i < data.length; i++) {
              var name = data[i].name
              var options = { value: name, label: name }
              vm.object['partySiteId'].options.push(options)
            }
          }, 'GET')
        }
      }
    },
    visibleChange10 (flag) {
      var vm = this
      this.object['concatUser'].options = []
      if (!flag) {
        if (this.mate.values.partySiteId) {
          this.detailAddress = false
          this.contact = false
        }
        if (this.addressId) {
          this.$root.ajaxData('/contacts/all/' + this.addressId, {}, function (data) {
            for (var i = 0; i < data.length; i++) {
              var name = { value: data[i].name, label: data[i].name }
              vm.object['concatUser'].options.push(name)
            }
          }, 'GET')
        }
      }
    },
    visibleChangeDeptId (flag) {
      var vm = this
      this.object['deptId'].options = []
      if (flag) {
        this.$root.ajaxData('/offices/code/' + this.mate.values['orgId'], {}, function (data) {
          for (var i = 0; i < data.length; i++) {
            vm.object['deptId'].options.push({ value: data[i], label: data[i] })
          }
        }, 'GET')
      }
    },
    changeAddress (option) {
      // 清空选项，不然每次点击都会push进去，会出现多条记录
      this.object['adressDetail'].options = []
      this.mate.values.adressDetail = ''
      this.mate.values.concatUser = ''
      this.contact = false
      // this.options9 是来货单位下的一些地址
      for (var i = 0; i < this.options9.length; i++) {
        if (this.options9[i].name === option) {
          this.addressId = this.options9[i].id
          var adressDetail = { value: this.options9[i].address, label: this.options9[i].address }
          this.object['adressDetail'].options.push(adressDetail)
        }
      }
    },
    visibleChange13 (flag) {
      var vm = this
      // 清空选项，不然每次点击都会push进去，会出现多条记录
      vm.object['docManager'].options = []
      if (flag) {
        this.$root.ajaxData('/users/list?cols=id,username&dataOnly=true&all=1', {}, function (data) {
          for (var i = 0; i < data.length; i++) {
            var username = { value: data[i].id, label: data[i].username }
            vm.object['docManager'].options.push(username)
          }
        }, 'GET')
      }
    }
  }
}
</script>

<style scoped>
.el-form-item {
  margin: 15px 20px 2px 0px;
}
.el-input__suffix {
  right:68px
}
.el-form-item--mini.el-form-item {
  margin: 6px;
}
.el-input--mini .el-input__inner{
  width:80%
}
.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 100%;
}
.el-select {
  width: 100%;
}
</style>

