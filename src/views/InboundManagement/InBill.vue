<template><!-- 入库单据新增头部表单 -->
  <div>
    <el-row>
      <el-form size="mini" :model="mate.values" :label-position="labelPosition" ref="ruleForm" :rules="rules" :label-width="labelWidth">
        <template>
          <el-col :sm="24" :md="12" :lg="8">
            <el-form-item :label="object['orgId'].label" :prop="object['orgId'].name">
              <el-select clearable v-model="mate.values[object['orgId'].name]" :disabled="showEdit">
                <el-option :label="item.label" :value="item.value" v-for="item of orgOption" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="24" :md="12" :lg="8">
            <el-form-item :label="object['billType'].label" :prop="object['billType'].name">
              <dict-selected :rowId="rowId" v-model="mate.values[object['billType'].name]" :initValue="mate.values[object['billType'].name]" dictType="billType"></dict-selected>
            </el-form-item>
          </el-col>

          <!-- 收货单位类型 -->
          <el-col :sm="24" :md="12" :lg="8">
            <el-form-item :label="object['prividerType'].label" :prop="object['prividerType'].name">
              <el-select clearable @visible-change="visibleChange8" @change="change8" v-model="mate.values[object['prividerType'].name]" :disabled="showEdit">
                <el-option :label="item.label" :value="item.value" v-for="item of object['prividerType'].options" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!--单位-->
          <el-col :sm="24" :md="12" :lg="8">
            <el-form-item :label="object['privider'].label" :prop="object['privider'].name">
              <el-select clearable :disabled="company" @visible-change="visibleChange9" @change="change12" filterable v-model="mate.values[object['privider'].name]" >
                <el-option :label="item.label" :value="item.value" v-for="item of object['privider'].options" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="24" :md="12" :lg="8">
            <el-form-item :label="object['prividerSite'].label" :prop="object['prividerSite'].name">
              <el-select clearable :disabled="address" @visible-change="visibleChange10" @change="changeAddress" v-model="mate.values[object['prividerSite'].name]">
                <el-option :label="item.label" :value="item.value" v-for="item of object['prividerSite'].options" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
 
          <el-col :sm="24" :md="12" :lg="8">
            <el-form-item :label="object['address'].label" :prop="object['address'].name">
              <el-select clearable  :disabled="detailAddress" v-model="mate.values[object['address'].name]">
                <el-option :label="item.label" :value="item.value" v-for="item of object['address'].options" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="24" :md="12" :lg="8">
            <el-form-item :label="object['contact'].label" :prop="object['contact'].name">
              <el-select clearable :disabled="contact" v-model="mate.values[object['contact'].name]">
                <el-option :label="item.label" :value="item.value" v-for="item of object['contact'].options" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="24" :md="12" :lg="8">
            <el-form-item :label="object['handler'].label" :prop="object['handler'].name">
              <el-select  disabled clearable @visible-change="visibleChange13" v-model="mate.values[object['handler'].name]">
                <el-option :label="item.label" :value="item.value" v-for="item of object['handler'].options" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="24" :md="12" :lg="8">
            <el-form-item :label="object['billDate'].label" :prop="object['billDate'].name">
              <el-date-picker  disabled clearable type="date" v-model="mate.values[object['billDate'].name]" :placeholder="object['billDate'].placeholder" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :sm="24" :md="12" :lg="8">
            <el-form-item :label="object['advancedShipDate'].label" :prop="object['advancedShipDate'].name">
              <el-date-picker :disabled="showEdit" clearable type="date" v-model="mate.values[object['advancedShipDate'].name]" :placeholder="object['advancedShipDate'].placeholder" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :sm="24" :md="12" :lg="8">
            <el-form-item :label="object['remark'].label" :prop="object['remark'].name">
              <el-input v-model="mate.values[object['remark'].name]" :disabled="showEdit"></el-input>
            </el-form-item>
          </el-col>   
        </template>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import treeSelect from '../../components/tree-select/tree.vue'
import Vue from 'vue'
function trimSpace (str) {
  try {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
  } catch (e) {
    return str
  }
}

export default{
  data () {
    var validateRequired = (rule, value, callback) => {
      if (value === undefined || trimSpace(value) === '') {
        callback(new Error('该输入项为必输项'))
      } else {
        callback()
      }
    }
    return {
      addressId: '',
      ruleForm: {
        billType: ''
      },
      rules: {
        billType: [
          { required: true, message: '该输入项为必输项' },
          { validator: validateRequired, trigger: 'change' }
        ],
        orgId: { required: true, message: '该输入项为必输项' }
      },
      options9: [],
      options10: [],
      company: true,                      // 收货单位，判断是否可以选择
      address: true,                      // 收货地址，判断是否可以选择
      detailAddress: true,                // 收货的详细地址，判断是否可以选择
      contact: true,                      // 收货的联系人，判断是否可以选择
      treeSelectArr: [],
      rowId: '',
      treeSelected: '',
      treeSelectModel: '',
      orgOption: [],
      labelPosition: 'right',
      object: {},
      disabledFlag: false,
      showEdit: false
    }
  },
  props: {
    mate: Object
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
  created () {
    if (this.mate.values.id) {
      this.disabledFlag = true
    }
    if (this.mate.values.asnCode) {
      this.showEdit = true
      this.rowId = '5'
    }
    this.mate.fields.map((i) => { this.object[i.name] = i })
    const vm = this
    if (this.mate.values.id) {
      if (this.mate.values.prividerType === '3') {
        this.getSupplier()
      } else if (this.mate.values.prividerType === '4') {
        this.getCustomer()
      } else if (this.mate.values.prividerType === '0') {
        this.$root.ajaxData('/offices/tree/list?dataOnly=true', {}, function (data) {
        }, 'GET')
      }
      // 单据负责人获取数据
      this.$root.ajaxData('/users/list?cols=id,username&dataOnly=true&all=1', {}, function (data) {
        for (var i = 0; i < data.length; i++) {
          var username = { value: data[i].id, label: data[i].username }
          vm.object['handler'].options.push(username)
        }
      }, 'GET')
    }
    this.$emit('convertOrgId', this.mate.values[this.object['orgId'].name])
    // 新增时，默认带出单据负责人id，需将其转化为名字
    if (!this.mate.values.id) {
      this.object['handler'].options.push({ 'label': this.mate.values.handlerName, 'value': this.mate.values.handler })
    }
    this.getOffice()
  },
  methods: {
    // 获取供应商
    getSupplier () {
      var vm = this
      this.$root.ajaxData('/companys/companyInfo/3?cols=name,id&dataOnly=true&nopaing=true', {}, function (data) {
        for (var i = 0; i < data.length; i++) {
          var id = data[i].id
          var name = data[i].name
          var options = { value: id, label: name }
          vm.object['privider'].options.push(options)
        }
      }, 'GET')
    },
    // 获取客户
    getCustomer () {
      var vm = this
      this.$root.ajaxData('/companys/companyInfo/4?cols=name,id&dataOnly=true&nopaing=true', {}, function (data) {
        for (var i = 0; i < data.length; i++) {
          var id = data[i].id
          var name = data[i].name
          var options = { value: id, label: name }
          vm.object['privider'].options.push(options)
        }
      }, 'GET')
    },
    // 获取库存组织
    getOffice () {
      var vm = this
      this.$root.ajaxData('/org/inventory/getOrgByOfficeId?ids=', {}, function (data) {
        data.map((i) => {
          vm.orgOption.push({ 'label': i.name, 'value': i.id })
        })
      })
    },
    visibleChange8 (flag) {
      var vm = this
      if (!flag) {
        if (this.mate.values[this.object['prividerType'].name]) {
          this.company = false
        }
        if (this.mate.values[this.object['prividerType'].name] === '3') {
          this.object['privider'].options = []
          this.getSupplier()
        } else if (this.mate.values[this.object['prividerType'].name] === '4') {
          this.object['privider'].options = []
          this.getCustomer()
        } else if (this.mate.values[this.object['prividerType'].name] === '0') {
          vm.mate.values['privider'] = ''
          vm.mate.values['prividerSite'] = ''
          vm.mate.values['address'] = ''
          vm.mate.values['contact'] = ''
          vm.company = true
          vm.address = true
          vm.detailAddress = true
          vm.contact = true
        }
      }
    },
    change8 () {
      // 来货单位类型改变之后，来货单位、单位地点、详细地址都需要清空
      this.mate.values[this.object['privider'].name] = ''
      this.mate.values[this.object['prividerSite'].name] = ''
      this.mate.values[this.object['address'].name] = ''
      this.mate.values[this.object['contact'].name] = ''
      this.address = true
      this.detailAddress = true
      this.contact = true
    },
    // 获取到的是单位地点信息
    visibleChange9 (flag) {
      var vm = this
      // 清空选项，不然每次点击都会push进去，会出现多条记录
      vm.object['prividerSite'].options = []
      this.mate.values.prividerSite = ''
      if (!flag) {
        // 选择了来货单位的时候，this.mate.values.privider保存的是来货单位的id值
        if (this.mate.values.privider) {
          this.address = false
          // 原来是/addresses/all/ 获取到的是全部地址，现在的只要有效的地址
          this.$root.ajaxData('/addresses/validAll/' + this.mate.values.privider, {}, function (data) {
            vm.options9 = data
            for (var i = 0; i < data.length; i++) {
              var name = data[i].name
              var options = { value: name, label: name }
              vm.object['prividerSite'].options.push(options)
            }
          }, 'GET')
        }
      }
    },
    visibleChange10 (flag) {
      var vm = this
      this.object['contact'].options = []
      if (!flag) {
        if (this.mate.values.prividerSite) {
          this.detailAddress = false
          this.contact = false
        }
        if (this.addressId === '') {
          return
        } else {
          this.$root.ajaxData('/contacts/all/' + this.addressId, {}, function (data) {
            for (var i = 0; i < data.length; i++) {
              var name = { value: data[i].name, label: data[i].name }
              vm.object['contact'].options.push(name)
            }
          }, 'GET')
        }
      }
    },
    changeAddress (option) {
      // 清空选项，不然每次点击都会push进去，会出现多条记录
      this.object['address'].options = []
      this.mate.values.address = ''
      // this.options9 是来货单位下的一些地址
      for (var i = 0; i < this.options9.length; i++) {
        if (this.options9[i].name === option) {
          this.addressId = this.options9[i].id
          var address = { value: this.options9[i].address, label: this.options9[i].address }
          this.object['address'].options.push(address)
        }
      }
    },
    change12 () {
      // 来货单位改变时，将联系人清空
      this.mate.values[this.object['contact'].name] = ''
      this.detailAddress = true
      this.contact = true
    },
    visibleChange13 (flag) {
      var vm = this
      // 清空选项，不然每次点击都会push进去，会出现多条记录
      vm.object['handler'].options = []
      if (flag) {
        this.$root.ajaxData('/users/list?cols=id,username&dataOnly=true&all=1', {}, function (data) {
          for (var i = 0; i < data.length; i++) {
            var username = { value: data[i].id, label: data[i].username }
            vm.object['handler'].options.push(username)
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
.el-form-item__label{
  line-height:inherit
}
.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 100%;
}
.el-select {
  width: 100%;
}
</style>
