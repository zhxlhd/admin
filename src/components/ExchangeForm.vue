<template>
  <div>
    <div class="tbutton">
      <el-button plain class="el-icon-document"  @click="handleSubmit">{{word}}</el-button>     <!--默认为提交，如果有需要可以将其设置为查询-->
      <el-button plain class="el-icon-close" @click="backward" v-if="!mate.inline">取 消</el-button>
      <el-button  plain class="el-icon-date"  @click="resetForm('ruleForm')">重 置</el-button>
    </div>
  <el-row>
  <el-form size="mini" :model="mate.values" :inline="mate.inline" :label-position="labelPosition" :rules="rules" ref="ruleForm" :label-width="labelWidth">


      <el-col :sm="12" :md="8" :lg="8">
        <el-form-item :label="mate.fields[0].label" :prop="mate.fields[0].name">
          <el-select clearable v-model="mate.values[mate.fields[0].name]" :placeholder="mate.fields[0].placeholder" :multiple="mate.fields[0].multiple">
            <el-option :label="item.label" :value="item.value" v-for="item of mate.fields[0].options" :key= "item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :sm="12" :md="8" :lg="8">
        <el-form-item :label="mate.fields[1].label" :prop="mate.fields[1].name">
          <el-select clearable v-model="mate.values[mate.fields[1].name]" :placeholder="mate.fields[1].placeholder" :multiple="mate.fields[1].multiple">
            <el-option :label="item.label" :value="item.value" v-for="item of mate.fields[1].options" :key= "item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :sm="12" :md="8" :lg="8">
        <el-form-item  :label="mate.fields[2].label" :prop="mate.fields[2].name">
          <el-date-picker clearable type="date" v-model="mate.values[mate.fields[2].name]" :placeholder="mate.fields[2].placeholder"></el-date-picker>
        </el-form-item>
      </el-col>

      <el-col :sm="12" :md="8" :lg="8">
        <el-form-item :label="mate.fields[3].label" :prop="mate.fields[3].name" >
          <el-input @change="changeFrom" v-model.number="mate.values[mate.fields[3].name]" :placeholder="mate.fields[3].placeholder"></el-input>
        </el-form-item>
      </el-col>

      <el-col :sm="12" :md="8" :lg="8">
        <el-form-item :label="mate.fields[4].label" :prop="mate.fields[4].name">
          <el-input @change="changeTo" v-model.number="mate.values[mate.fields[4].name]" :placeholder="mate.fields[4].placeholder"></el-input>
        </el-form-item>
      </el-col>

  </el-form>
  </el-row>
 
  </div>
</template>
<script>

import sha1 from 'node-sha1'
import treeSelect from './tree-select/tree.vue'
import CountrySelect from './CountrySelect.vue'
import addrArr from './address/addr-arr.js'
import Addrselect from './address/Addrselect'
// 根据id获取市/区数据函数，动态，经常改变
function getAddrsArrayById (id = 0) {
  return addrArr[id].map(item => {
    return {
      'text': item[1],
      'value': item[0]
    }
  })
}

export default {
  data () {
    return {
      initName: '',              // 客户，供应商修改之时的名字
      industryCategoryValue: '',        // 行业细分类的问题
      disabledFlag: false,
      fileList: [],
      defaultValues: {},
      showArea: false,
      dialogVisible: false,
      showLocation: false,
      showOrgIdNameSelect: false,
      showUser: false,
      showOffice: false,
      showChuwei: false,
      orgIdOptions: [],
      orgOptions: [],
      showType: false,
      treeSelectModel: '',
      customerAdd: {},
      labelPosition: 'right',
      treeSelectArr: [],
      treeSelected: '',
      initprovselectedvalue: '0',
      initcityselectedvalue: '0',
      initregionselectedvalue: '0',
      provSelected: '',
      citySelected: '',
      regionSelected: '',
      provAddrs: getAddrsArrayById(0),
      cityAddrs: [],
      regionAddrs: [],
      optionsValue: []
    }
  },
  props: {
    word: {
      default: '提 交'
    },
    mate: Object,
    warehouseId: String,
    formModel: {
      type: String,
      default: 'page' // page or dialog
    },
    rowId: String,
    option: {
      type: Object,
      default: () => {}
    },
    treeDatas: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    'rowId': function (val, oldVal) {
      var vm = this
      if (val !== '') {
        vm.orgIdOptions = []
        this.showLocation = true
        this.showChuwei = true
        this.$root.ajaxData('/org/inventory/getOrgByOfficeId?ids=', {}, function (data) {
          data.map((i) => {
            vm.orgIdOptions.push({ 'label': i.name, 'value': i.id })
          })
        })
      } else {
        vm.orgIdOptions = []
        this.showLocation = false
        this.showChuwei = false
        this.$root.ajaxData('/org/inventory/getOrgByOfficeId?ids=', {}, function (data) {
          data.map((i) => {
            vm.orgIdOptions.push({ 'label': i.name, 'value': i.id })
          })
        })
      }
    }
  },
  updated () {
    this.$nextTick(function () {
    })
  },
  created () {
    var vm = this
    this.$root.ajaxData('/currency/new/clist?dataOnly=true', {}, function (data) {
      let list = []
      data.forEach(item => {
        let d = {}
        d.value = item.id
        d.label = item.name
        list.push(d)
      })
      vm.mate.fields[0].options = JSON.parse(JSON.stringify(list))
      vm.mate.fields[1].options = JSON.parse(JSON.stringify(list))
    }, 'GET')
    this.initName = this.mate.values.name
    var vm = this
    if (this.mate.inline) {
      this.defaultValues = this.mate.values
    }
    if (this.mate.values.country) {
      this.customerAdd = { 'nameZH': this.mate.values.country }
    }
    if ('industryCategory' in this.mate.values) {
      this.$root.ajaxData('/trees/type/all', {}, function (data) {
        vm.optionsValue = data
      }, 'GET')
      if (this.mate.values.industryCategory === '' && 'industryCategory' in this.mate.values) {
        this.mate.values.industryCategory = []
      } else if (this.mate.values.industryCategory !== '' && 'industryCategory' in this.mate.values) {
        if (this.mate.values.industryCategory) {
          if (this.mate.values.industryCategory.length) {
            this.mate.values.industryCategory = this.mate.values.industryCategory.split(',')
          }
        }
      }
    }
    this.$root.ajaxData('/org/inventory/getOrgByOfficeId?ids=', {}, function (data) {
      data.map((i) => {
        vm.orgOptions.push({ 'label': i.name, 'value': i.id })
      })
    })
    // 机构管理类型
    if ('deputyPerson' in this.mate.values) {
      if (this.mate.values.pid === '' || this.mate.values.pid === '0') {
        this.$set(this.mate.values, 'type', '0')
        this.showType = true
      } else {
        for (var i = 0; i < this.mate.fields.length; i++) {
          if (this.mate.fields[i].holder === 'typeDict') {
            this.mate.fields[i].options.splice(0, 1)
          }
        }
      }
    }
    // 区域类型
    if ('areaCode' in this.mate.values) {
      if (this.mate.values.pid === '' || this.mate.values.pid === '0') {
        this.$set(this.mate.values, 'type', '1')
        this.showArea = true
      } else {
        this.$root.ajaxData('/areas/getById/' + this.mate.values.pid, {}, function (data) {
          if (data.data.type === '2') {
            vm.$set(vm.mate.values, 'type', '3')
            vm.showArea = true
          } else if (data.data.type === '3') {
            vm.$set(vm.mate.values, 'type', '3')
            vm.showArea = true
          } else if (data.data.type === '1') {
            vm.$set(vm.mate.values, 'type', '2')
            vm.showArea = true
          }
        })
      }
    }
    if ('locationControl' in this.mate.values) {
      this.$root.ajaxData('/org/inventory/getOrgByOfficeId?ids=', {}, function (data) {
        data.map((i) => {
          vm.orgIdOptions.push({ 'label': i.name, 'value': i.id })
        })
      })
    }
    // 显示省市县的数据，在data里，调用的函数是为了找到text，这里是将value值
    if (this.mate.values.province !== '') {
      this.initprovselectedvalue = this.mate.values.province
    }
    if (this.mate.values.city !== '') {
      this.initcityselectedvalue = this.mate.values.city
      this.cityAddrs = getAddrsArrayById(this.mate.values.province)
    }
    if (this.mate.values.county !== '') {
      this.initregionselectedvalue = this.mate.values.county
      this.regionAddrs = getAddrsArrayById(this.mate.values.city)
    }
    if (this.mate.values.id) {
      this.showUser = true
      this.showOffice = true
      this.showOrgIdNameSelect = true
    } else {
      this.showUser = false
      this.showOffice = false
      this.showOrgIdNameSelect = false
    }
    if (this.rowId === undefined) {
      return
    }
    if (this.rowId !== '') {
      vm.orgIdOptions = []
      this.showLocation = true
      this.showChuwei = true
      this.$root.ajaxData('/org/inventory/getOrgByOfficeId?ids=', {}, function (data) {
        data.map((i) => {
          vm.orgIdOptions.push({ 'label': i.name, 'value': i.id })
        })
      })
    } else {
      vm.orgIdOptions = []
      this.showLocation = false
      this.showChuwei = false
      this.$root.ajaxData('/org/inventory/getOrgByOfficeId?ids=', {}, function (data) {
        data.map((i) => {
          vm.orgIdOptions.push({ 'label': i.name, 'value': i.id })
        })
      })
    }
  },
  components: {
    CountrySelect,
    Addrselect,
    treeSelect,
    'w-editor': function index (resolve) {
      require(['./WEditor.vue'], resolve)
    },
    KCascader: function index (resolve) {
      require(['./KCascader.vue'], resolve)
    },
    'dict-selected': function index (resolve) {
      require(['./DictSelected.vue'], resolve)
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
        width = '120px'
      } else {
        width = this.mate.labelWidth
      }
      return width
    },
    rules () {
      var rs = {}
      var vm = this
      var rls = this.mate.rules
      for (var index in rls) {
        var r = []
        var rule = rls[index]
        for (var i in rule) {
          var nv = rule[i]
          if (nv.validator) {
            nv.validator = vm[nv.validator]
          }
          r[i] = nv
        }
        rs[index] = r
      }
      return rs
    }
  },
  methods: {
    // 正向汇率改变时
    changeFrom(val) {
      this.mate.values.showInverseConRate = (1 / val).toFixed(10)
    },
    changeTo(val) {
      this.mate.values.showConversionRate = (1 / val).toFixed(10)
    },
    // 校验客户名称不能相同
    validateNameCustomer (rule, value, callback) {
      var vm = this
      // if (this.mate.values.id)
      if (!this.mate.values.id) {
        this.$root.ajaxData('/companys/validName/4?name=' + value, {}, function (data) {
          if (data !== '') {
            if (data === false || data.body === false) {
              callback(new Error('您输入的客户已存在'))
            } else if (data === true || data.body === true) {
              callback()
            }
          }
        }, 'GET')
      } else if (this.mate.values.id) {
        this.$root.ajaxData('/companys/validName/4?name=' + value, {}, function (data) {
          if (data !== '') {
            if (data === false || data.body === false) {
              if (vm.initName === value) {
                callback()
              } else {
                callback(new Error('您输入的客户已存在'))
              }
            } else if (data === true || data.body === true) {
              callback()
            }
          }
        }, 'GET')
      }
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 校验供应商名称不能相同
    validateNameSupplier (rule, value, callback) {
      if (!this.mate.values.id) {
        this.$root.ajaxData('/companys/validName/3?name=' + value, {}, function (data) {
          if (data !== '') {
            if (data === false || data.body === false) {
              callback(new Error('您输入的供应商已存在'))
            } else if (data === true || data.body === true) {
              callback()
            }
          }
        }, 'GET')
      } else if (this.mate.values.id) {
        this.$root.ajaxData('/companys/validName/3?name=' + value, {}, function (data) {
          if (data !== '') {
            if (data === false || data.body === false) {
              callback()
            } else if (data === true || data.body === true) {
              callback()
            }
          }
        }, 'GET')
      }
    },
    validateUserName (rule, value, callback) {
      if (!this.mate.values.id) {
        this.$root.ajaxData('/roles/checkRoleName?roleName=' + value, {}, function (data) {
          if (data.statusCode === 40014) {
            callback(new Error('您输入的角色已存在'))
          } else {
            callback()
          }
        }, 'GET')
      } else if (this.mate.values.id) {
        callback()
      }
    },
    validaeUnique (rule, value, callback) {
      if (!this.mate.values.id) {
        this.$root.ajaxData('/dc/local/check/code?code=' + value + '&warehouseId=' + this.warehouseId, {}, function (data) {
          if (data === 1) {
            callback(new Error('您输入的储位编码已存在'))
          } else {
            callback()
          }
        }, 'GET')
      } else if (this.mate.values.id) {
        callback()
      }
    },
    validaeLocationUnique (rule, value, callback) {
      if (!this.mate.values.id) {
        this.$root.ajaxData('/dc/checkCode?code=' + value, {}, function (data) {
          if (data.statusCode === 40017) {
            callback(new Error('您输入的仓库编码已存在'))
          } else {
            callback()
          }
        }, 'GET')
      } else if (this.mate.values.id) {
        callback()
      }
    },
    validateOfficeName (rule, value, callback) {
      if (!this.mate.values.id) {
        this.$root.ajaxData('/offices/checkName?officeName=' + value, {}, function (data) {
          if (data.statusCode === 40015) {
            callback(new Error('您输入的机构已存在'))
          } else {
            callback()
          }
        }, 'GET')
      } else if (this.mate.values.id) {
        callback()
      }
    },
    validateOfficeCode (rule, value, callback) {
      if (!this.mate.values.id) {
        this.$root.ajaxData('/offices/checkCode?officeCode=' + value, {}, function (data) {
          if (data.statusCode === 40016) {
            callback(new Error('您输入的机构编码已存在'))
          } else {
            callback()
          }
        }, 'GET')
      } else if (this.mate.values.id) {
        callback()
      }
    },
    // 原产国，改变的数据在这里可以显示，在这里判断，如果选择的是中国，省市县就可以使用，或者就不能显示
    inputChange (val) {
      this.customerAdd = { 'nameZH': val }
      if (val === this.$t('China')) {
        this.disabledFlag = false
      } else {
        this.disabledFlag = true
        this.initprovselectedvalue = ''
        this.initcityselectedvalue = ''
        this.initregionselectedvalue = ''
      }
    },
    provChange (val) {
      const oldVal = this.mate.values.province
      if (val !== '') {
        if (val !== oldVal) {
          if (val !== '0' && val !== 0) {
            this.cityAddrs = getAddrsArrayById(val)
          } else {
            this.cityAddrs = []
          }
          this.citySelected = '0'
        }
      } else {
        this.cityAddrs = []
      }
      this.mate.values.province = val
    },
    cityChange (val) {
      const oldVal = this.mate.values.city
      if (val !== '') {
        if (val !== oldVal) {
          if (val !== '0' && val !== 0) {
            this.regionAddrs = getAddrsArrayById(val)
          } else {
            this.regionAddrs = []
          }
          this.regionSelected = '0'
        }
      } else {
        this.regionAddrs = []
      }
      this.mate.values.city = val
    },
    regionChange (val) {
      this.mate.values.county = val
    },
    // upload start
    handleRemove (file, fileList) {
    },
    handlePreview (file) {
    },
    // upload end
    handleReset () {
      this.$refs.ruleForm.resetFields()
    },
    backward () {
      this.$emit('dialog-cancel')
      if (this.formModel === 'page') {
        this.$root.monitor({ url: this.mate.next })
      }
    },
    handleSubmit (ev) {
      var vm = this
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 新增,密码加密;修改不提供密码更改，请使用找回密码功能修改密码
          if (this.mate.values.password) {
            this.mate.values['password'] = sha1(this.mate.values.password)
          }
          let url = vm.mate.url
          vm.mate.values.industryCategory = this.industryCategoryValue
          vm.mate.values.warehouseId = this.warehouseId
          vm.mate.values.status = 1
          const values = vm.mate.values
          if (vm.mate.inline) {
            vm.$emit('search', values)
            vm.mate.values = vm.defaultValues
          } else {
            // PUT 请求URL带上ID
            if ((vm.mate.method) === 'PUT' && values.id) {
              url = url + '/' + values.id
            }
            if ( (vm.mate.method) === 'PUT' && vm.mate.updateUrl) {
              url = vm.mate.updateUrl + '/' + values.id
            }
            const act = { url: url, ajax: true, method: vm.mate.method }
            act.next = this.mate.next || false
            this.$root.action(act, values, function (data) {
              if (data && data.next) {
                act.next = data.next
              }
            })
            vm.$emit('submit', act, values)
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
    validatePassword (rule, value, callback) {
      if (value !== this.mate.values[rule.name]) {
        callback(new Error(rule.message || '两次输入密码不一致!'))
      } else {
        callback()
      }
    },
    validateAsync (rule, value, callback) {
      this.$http.get(
        rule.url,
        value
      ).then(function (data) {
        if (data.status) {
          callback(null)
        } else {
          callback(new Error(data.error || rule.message || '请修改'))
        }
      }, function (error) {
        callback(new Error(error))
      })
    },
    validateCascader (rule, value, callback) {
      if (value.length < 1) {
        callback(new Error(rule.message || '请选择'))
      } else {
        callback()
      }
    },
    treeSelectedHandler (fieldName, value) {
      this.mate.values[fieldName] = value
    }
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
