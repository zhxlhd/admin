<template>
  <div>
      <el-button size="mini" @click="handleSubmit">提 交</el-button>
      <el-button size="mini" @click="backward" v-if="!mate.inline">取 消</el-button>
    <el-row>
      <el-form size="mini" :model="mate.values" :inline="mate.inline" label-position="right" ref="ruleForm" :rules="rules" :label-width="labelWidth">
        <template>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['name'].label" :prop="object['name'].name">
            <el-input v-model="mate.values[object['name'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['code'].label" :prop="object['code'].name">
            <el-input v-model="mate.values[object['code'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['description'].label" :prop="object['description'].name">
            <el-input v-model="mate.values[object['description'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['pid'].label" :prop="object['pid'].name">
            <tree-select
            :removeUrl="object['pid'].removeUrl"
            :treeProps="object['pid'].treeProps"
            v-model="mate.values['pid']"
            :multiple="false"
            :placeholder="object['pid'].placeholder"
          ></tree-select>
          </el-form-item>
        </el-col>

        </template>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import treeSelect from '../../components/tree-select/tree.vue'
import { trimSpace } from '../../utils/util.js'
// function trimSpace(str) {
//    try {
//        return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
//    } catch(e) {
//        return str
//    }
// }

export default{
  data () {
    var validateRequired = (rule, value, callback) => {
      if (value === undefined || value === null || trimSpace(value) === '') {
        callback(new Error('该输入项为必输项'))
      } else {
        callback()
      }
    }

    return {
      form: {},
      object: {},
      rules: {
        name: [
            { required: true, message: '该输入项为必输项' },
            { validator: validateRequired, trigger: 'change' }
        ],
        code: [
            { required: true, message: '该输入项为必输项' },
            { validator: validateRequired, trigger: 'change' }
        ],
        pid: [
            { required: true, message: '该输入项为必输项' },
            { validator: validateRequired, trigger: 'change' }
        ]
      }
    }
  },
  computed: {
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
  components: {
    'tree-selected': function index (resolve) {
      require(['../../components/TreeSelected.vue'], resolve)
    },
    treeSelect
  },
  props: {
    mate: Object
  },
  created () {
    this.mate.fields.map((i) => { this.object[i.name] = i })
    this.form = this.mate
  },
  methods: {
    handleSubmit () {
      var mate = {}
      var vm = this

      var ruleRes = ''
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          ruleRes = 'no'
        }
      })

      if (ruleRes === 'no') {
        vm.$message({
          message: this.$t('Data Check No Pass'),
          type: 'warning'
        })
        return
      }

      mate = this.form.values

      if (this.mate.method === 'POST') {
        this.$root.ajaxData('/purchase/goods/category/batchSave', mate, function () {
          vm.$root.monitor({ url: '/purchase/goods/category/tree/list?nopaging=true' })
        }, 'POST')
      } else {
        this.$root.ajaxData('/purchase/goods/category/batchUpdate' + '/' + mate.id, mate, function () {
          vm.$root.monitor({ url: '/purchase/goods/category/tree/list?nopaging=true' })
        }, 'PUT')
      }
    },
    backward () {
      this.$root.monitor({ url: '/purchase/goods/category/tree/list?nopaging=true' })
    }
  }
}

</script>

<style scoped>
.el-form--inline>* {
  margin-right:10px
}
.el-form-item{
  margin: 15px 20px 2px 0px;
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
.el-input__suffix {
  right:80px
}
.el-form-item--mini.el-form-item {
  margin: 6px;
}
.ats-tree .ats-input{
  width: 80%
}
.el-input--mini .el-input__inner{
  width:80%
}
.sbutton{
  margin-top:50px;
}
</style>
