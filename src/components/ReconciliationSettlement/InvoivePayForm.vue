<template>
  <div>
    <el-row>
      <el-form size="mini" :model="mate.values" :inline="mate.inline" ref="ruleForm" :rules="rules" :label-position="labelPosition" :label-width="labelWidth">
        <template>

          <el-col :sm="12" :md="8" :lg="8">
              <el-form-item :label="object['invoiceNum'].label" :prop="object['invoiceNum'].name">
                  <el-input v-model="mate.values['invoiceNum']"></el-input>
              </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['invoiceDate'].label" :prop="object['invoiceDate'].name">
              <el-date-picker clearable type="date" v-model="mate.values['invoiceDate']"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['invoiceType'].label" :prop="object['invoiceType'].name">
              <dict-selected v-model="mate.values['invoiceType']" dictType="answerMode" :initValue="mate.values['answerMode']"></dict-selected>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['state'].label" :prop="object['state'].name">
              <el-input v-model="mate.values['state']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['corporateBody'].label" :prop="object['corporateBody'].name">
              <el-input v-model="mate.values['corporateBody']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['companyCode'].label" :prop="object['companyCode'].name">
              <el-select clearable v-model="mate.values['companyCode']">
                <el-option :label="item.label" :value="item.value" v-for="item of object['companyCode'].options" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['companyName'].label" :prop="object['companyName'].name">
              <el-input v-model="mate.values['companyName']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['createAt'].label" :prop="object['createAt'].name">
              <el-date-picker clearable type="date" v-model="mate.values['createAt']"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['currency'].label" :prop="object['currency'].name">
              <dict-selected v-model="mate.values['currency']" dictType="currency" :initValue="mate.values['currency']"></dict-selected>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['invoiceAmount'].label" :prop="object['invoiceAmount'].name">
              <el-input v-model="mate.values['invoiceAmount']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['tradeAmount'].label" :prop="object['tradeAmount'].name">
              <el-input v-model="mate.values['tradeAmount']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['invoiceBalance'].label" :prop="object['invoiceBalance'].name">
              <el-input v-model="mate.values['invoiceBalance']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['remark'].label" :prop="object['remark'].name">
              <el-input v-model="mate.values['remark']"></el-input>
            </el-form-item>
          </el-col>
        </template>
      </el-form>
    </el-row>
  </div>
</template>

<script>
function trimSpace (str) {
  try {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
  } catch (e) {
    return str
  }
}

function isPositiveinteger (val) {
  if (val === 0) {
    return true
  } else {
    var reg = new RegExp('^[1-9]*[1-9][0-9]*$')
    return reg.test(val)
  }
}

export default{
  components: {
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
    }
  },
  data () {
    return {
      rules: {},
      object: {}
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
    mate: Object,
    labelPosition: {
      type: String
    }
  },
  created () {
    this.mate.fields.map((i) => { this.object[i.name] = i })
  },
  methods: {

  }
}
</script>

<style scoped>
 .el-form-item__label{
  line-height:inherit
}
.el-form--inline>* {
  margin-right:10px
}
.el-form-item{
  margin: 15px 20px 2px 0px;
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
</style>