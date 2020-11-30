<template>
  <div>
    <el-row>
      <el-form size="mini" :model="mate.values" :inline="mate.inline" :label-position="labelPosition" :rules="rules" ref="ruleForm" :label-width="labelWidth">
        <template v-for="field of mate.fields">
          <el-col :sm="12" :md="8" :lg="6" v-if="field.holder == 'textc'" :key="field.name">
            <el-form-item :label="field.label" :prop="field.name">
              <el-input 
              :disabled="rules[field.name][0].disabled" 
              :readonly="field.readonly" 
              v-model="mate.values[field.name]" 
              :placeholder="field.placeholder"
              @focus.native="handleFocus"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6" v-if="field.holder == 'select'" :key="field.name">
            <el-form-item :label="field.label" :prop="field.name">
              <el-select 
              :disabled="rules[field.name][0].disabled"
              v-model="mate.values[field.name]" 
              :placeholder="field.placeholder" 
              :multiple="field.multiple"
              @focus.native="handleFocus"
              ><el-option :label="item.label" :value="item.value" v-for="item of field.options" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6" v-if="field.holder == 'date'" :key="field.name">
            <el-form-item :label="field.label" :prop="field.name">
              <el-date-picker 
              :disabled="rules[field.name][0].disabled" 
              clearable 
              :readonly="field.readonly" 
              :picker-options="field.pickerOptions"
              type="date"
              value-format="field.format" 
              v-model="mate.values[field.name]" 
              :placeholder="field.placeholder"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6" v-if="field.holder == 'dict'" :key="field.name">
            <el-form-item :label="field.label">
              <dict-selected 
              :rowId=field.rowId 
              :initValue="mate.values[field.name]" 
              v-model="mate.values[field.name]" 
              :placeholder="field.placeholder" 
              :multiple="field.multiple" 
              :dictType="field.dict"
              ></dict-selected>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6" v-if="field.holder == 'country'" :key="field.name">
            <el-form-item class="country" :label="field.label">
              <el-input 
              :disabled="rules[field.name][0].disabled" 
              :readonly="field.readonly" 
              v-model="mate.values[field.name]" 
              :placeholder="field.placeholder"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6" v-if="field.holder == 'prov'" :key="field.name">
            <el-form-item :label="field.label">
              <el-input 
              :disabled="rules[field.name][0].disabled" 
              :readonly="field.readonly" 
              v-model="mate.values[field.name]" 
              :placeholder="field.placeholder"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6" v-if="field.holder == 'city'" :key="field.name">
            <el-form-item :label="field.label">
              <el-input 
              :disabled="rules[field.name][0].disabled" 
              :readonly="field.readonly" 
              v-model="mate.values[field.name]" 
              :placeholder="field.placeholder"
              ></el-input>
            </el-form-item>
          </el-col>
        </template>
      </el-form>
    </el-row>
  </div>
</template>
<script>

// import sha1 from 'node-sha1'
import treeSelect from './tree-select/tree.vue'
import CountrySelect from './CountrySelect.vue'
import addrArr from './address/addr-arr.js'
import Addrselect from './address/Addrselect'

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
      cityAddrs: [],
      provAddrs: getAddrsArrayById(0),
      initcityselectedvalue: '0',
      initprovselectedvalueAddr: '0',
      initcityselectedvalueAddr: '0',
      readonlyFlagAddr: false,
      readonlyFlagBank: false,
      initName: '',              // 客户，供应商修改之时的名字
      industryCategoryValue: '',        // 行业细分类的问题
      readonlyFlag: false,
      fileList: [],
      defaultValues: {},
      dialogVisible: false,
      treeSelectModel: '',
      labelPosition: 'right',
      treeSelectArr: [],
      treeSelected: '',
      initprovselectedvalue: '0',
      initcityselectedvalue: '0',
      initregionselectedvalue: '0',
      optionsValue: [],
      pickerOptions: {
        // 日期禁用今天之前的
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      // focusHandle(){}
    }
  },
  props: {
    mate: Object,
    formModel: {
      type: String,
      default: 'page' // page or dialog
    },
    rules: Object,
  },
  created () {
    this.initprovselectedvalue = this.mate.values['buyerState']|| '0';
    this.initcityselectedvalue = this.mate.values['buyerCity'] || '0';
    this.initName = this.mate.values.name || '';
    if (this.mate.inline) {
      this.defaultValues = this.mate.values;
    }
    this.mate.fields.forEach(item => {
      if (item.pickerOptions && typeof item.pickerOptions !='object') item.pickerOptions = this[item.pickerOptions];
      // if (item.blurEvent && typeof item.blurEvent !='function') item.blurEvent = this[item.blurEvent];       // 失去焦点事件 
      // if (item.focusEvent && typeof item.focusEvent !='function') item.focusEvent = this[item.focusEvent];    // 获得焦点事件
      // if (item.changeEvent && typeof item.changeEvent !='function') item.changeEvent = this[item.changeEvent]; // change事件
      // if (item.clearEvent && typeof item.clearEvent !='function') item.clearEvent = this[item.clearEvent];    // 清空事件
      // if (item.visibleChangeEvent && typeof item.visibleChangeEvent !='function') item.visibleChangeEvent = this[item.visibleChangeEvent]; // 下拉框出现/隐藏时触发 出现则为 true，隐藏则为 false
      // if (item.removeTagEvent && typeof item.removeTagEvent !='function') item.removeTagEvent = this[item.removeTagEvent]; // 多选模式下移除tag时触发
    });
  },
  mounted () {
    this.initprovselectedvalue = this.mate.values['buyerState'] || '0';
    this.initcityselectedvalue = this.mate.values['buyerCity'] || '0';
    this.provAddrs = getAddrsArrayById(0);
    if (this.initprovselectedvalue !== '') {
      this.cityAddrs = getAddrsArrayById(this.initprovselectedvalue);
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
    labelWidth: function () {
      let width = ''
      if (this.mate.inline) {
        width = '120px'
      } else if (typeof (this.mate.labelWidth) === 'undefined') {
        width = '120px'
      } else if (this.mate.labelWidth === null) {
        width = '120px'
      } else {
        width = this.mate.labelWidth
      }
      return width;
    },
    // rules () {
    //   let rs = {}
    //   let vm = this
    //   let rules = this.mate.rules || this.rules;
    //   for (var key in rules) {
    //     let rule = rules[key]
    //     let r = []
    //     for (var index in rule) {
    //       var nv = rule[index]
    //       if (nv.validator) {
    //         nv.validator = vm[nv.validator]
    //       }
    //       r[index] = nv
    //     }
    //     rs[key] = r
    //   }
    //   return rs;
    // }
  },
  methods: {
    handleFocus (e) {
      this.getUsersList();
    },
    handleBlur (e) {

    },
    handleChange (e) {

    },
    handleClear (e) {
      
    },
    handleVisibleChange (e) {

    },
    handleRemoveTag (e) {

    },
    getUsersList () {
      console.log(111)
    },
    inputChangeBank (val) {
      this.bankAdd = { 'nameZH': val }
      if (val === this.$t('China')) {
        this.readonlyFlagBank = false
      } else {
        this.readonlyFlagBank = true
        this.initprovselectedvalue = ''
        this.initcityselectedvalue = ''
      }
    },
    provChange (val) {
      const oldVal = this.mate.values.buyerState
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
      this.mate.values.buyerState = val
    },
    cityChange (val) {
      const oldVal = this.mate.values.buyerCity
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
        this.regionAddrs
      }
      this.mate.values.buyerCity = val
    },
    inputChangeAddr (val) {
      this.customerAdd = { 'nameZH': val }
      if (val === this.$t('China')) {
        this.readonlyFlagAddr = false
      } else {
        this.readonlyFlagAddr = true
        this.initprovselectedvalueAddr = ''
        this.initcityselectedvalueAddr = ''
      }
    },
    handleReset () {
      this.$refs.ruleForm.resetFields()
    },
    backward () {
      this.$emit('dialog-cancel')
      if (this.formModel === 'page') {
        this.$root.monitor({ url: this.mate.next })
      }
    },
    treeSelectedHandler (fieldName, value) {
      this.mate.values[fieldName] = value
    }
  }
}
</script>

<style scoped lang="scss">
.el-form--inline>* {
  margin-right:10px
}
.el-form-item{
  margin: 22px 20px 2px 0;
}
.el-form-item{
  margin-bottom:2px;
}
.leftFloat .el-row{
  float:left;
  width:250px;
}
.leftFloat .el-row input{
  width:250px;
}
.leftFloat .el-form-item{
  margin:0;
}
.leftFloat .button{
  float:left;
}
.el-form--inline .el-form-item {
  width:200px;
  display: inline-block;
  margin-right: 10px;
  vertical-align: top;
}
.el-form-item.is-required .el-form-item__label:before{
  content:''
}
.el-form-item.is-required .el-form-item__label:after{
  content: '*';
  color: #ff4949;
  margin-right: 4px;
}
.el-cascader{
  width:100%;
}
.el-select{
  width:100%;
}
.hidden{
  display:none;
}
h4{
  margin-top:40px;
  margin-bottom:10px;
}
.el-select{
  width:100%;
}
.el-date-editor.el-input{
  width:100%;
}
.el-form--inline.el-form--label-top .el-form-item__content{
  width:90%
}
.leftFloat .el-form--inline .el-form-item{
  margin-right:10px;
}
.el-form-item {
    margin: 15px 20px 2px 0px;
}
.el-form-item--mini.el-form-item {
  margin: 6px;
}
</style>
