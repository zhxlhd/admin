<template>
  <div>
    <div class="tbutton">
      <el-button plain class="el-icon-document" @click="handleSubmit">提 交</el-button>
      <el-button plain class="el-icon-close" @click="backward" v-if="!mate.inline">取 消</el-button>
      <el-button plain class="el-icon-date"  @click="resetForm('ruleForm')">重 置</el-button>
    </div>
    <el-row>
       <el-form size="mini" :model="mate.values" :inline="mate.inline" :label-position="labelPosition" ref="ruleForm" :rules="rules" :label-width="labelWidth">
        <template>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['name'].label" :prop="object['name'].name">
              <el-input @blur="blurName" :disabled="disabledFlag" v-model="mate.values[object['name'].name]"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['orgCode'].label" :prop="object['orgCode'].name">
              <el-input @blur="blurCode" :disabled="disabledFlag" v-model="mate.values[object['orgCode'].name]"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['receiveDetailAddress'].label" :prop="object['receiveDetailAddress'].name">
              <el-input v-model="mate.values[object['receiveDetailAddress'].name]"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['officeId'].label" :prop="object['officeId'].name">
              <tree-select
              :disabledFlag="disabledFlag"
              :removeUrl="object['officeId'].removeUrl"
              :treeProps="object['officeId'].treeProps"
              v-model="mate.values[object['officeId'].name]"
              :multiple="false"
              :placeholder="object['officeId'].placeholder"
            ></tree-select>
            </el-form-item>
          </el-col>

           <!-- <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['validDateFrom'].label" :prop="object['validDateFrom'].name">
              <el-date-picker clearable v-model="mate.values[object['validDateFrom'].name]" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>

           <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['validDateTo'].label" :prop="object['validDateTo'].name">
              <el-date-picker clearable v-model="mate.values[object['validDateTo'].name]" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col> -->
        </template>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import treeSelect from '../../components/tree-select/tree.vue'
export default {
  data () {
    // 校验组织名称
    var validateName = (rule, value, callback) => {
      var vm = this
      if (!this.mate.values.id) {
        this.$root.ajaxData('/org/inventory/checkExist?name=' + this.mate.values.name, {}, function (data) {
          if (data.statusCode === 10011) {
            callback(new Error('您输入的组织名称已存在'))
          } else {
            callback()
          }
        }, 'GET')
      } else if (this.mate.values.id) {
        this.$root.ajaxData('/org/inventory/checkExist?name=' + this.mate.values.name, {}, function (data) {
          if (data.statusCode === 10011) {
            if (vm.initName === value) {
              callback()
            } else {
              callback(new Error('您输入的组织名称已存在'))
            }
          } else {
            callback()
          }
        }, 'GET')
      }
    }

    // 校验组织代码
    var validateCode = (rule, value, callback) => {
      var vm = this
      if (!this.mate.values.id) {
        this.$root.ajaxData('/org/inventory/checkExist?code=' + this.mate.values.orgCode, {}, function (data) {
          if (data.statusCode === 10013) {
            callback(new Error('您输入的组织代码已存在'))
          } else {
            callback()
          }
        }, 'GET')
      } else if (this.mate.values.id) {
        this.$root.ajaxData('/org/inventory/checkExist?code=' + this.mate.values.orgCode, {}, function (data) {
          if (data.statusCode === 10013) {
            if (vm.initCode === value) {
              callback()
            } else {
              callback(new Error('您输入的组织代码已存在'))
            }
          } else {
            callback()
          }
        }, 'GET')
      }
    }
    return {
      object: {},
      initName: '',
      initCode: '',
      disabledFlag: false,
      treeSelected: '',
      rules: {
        name: [
          { required: true, message: '该输入项为必输项' },
          { validator: validateName, trigger: 'blur' }
        ],
        orgCode: [
          { required: true, message: '该输入项为必输项' },
          { validator: validateCode, trigger: 'blur' }
        ],
        officeId: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        receiveDetailAddress: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ]
      },
      labelPosition: 'right'
    }
  },
  props: {
    mate: Object
  },
  components: {
    'tree-selected': function index (resolve) {
      require(['../../components/TreeSelected.vue'], resolve)
    },
    treeSelect
  },
  computed: {
    labelWidth: function () {
      let width = ''
      if (this.mate.inline) {
        width = '100px'
      } else if (typeof (this.mate.labelWidth) === 'undefined') {
        width = '100px'
      } else if (this.mate.labelWidth === null) {
        width = '130px'
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
    this.initName = this.mate.values.name
    this.initCode = this.mate.values.orgCode
    this.mate.fields.map((i) => { this.object[i.name] = i })
  },
  methods: {
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    blurName () {
    },
    blurCode () {
    },
    handleSubmit () {
      var mate = {}
      var vm = this
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.mate.values.status = 1
          mate = this.mate.values
          if (this.mate.method === 'PUT' && mate.id) {
            this.$root.ajaxData('/org/inventory/' + mate.id, mate, function () {
              vm.$root.monitor({ url: '/org/inventory/all' })
            }, 'PUT')
          } else if (this.mate.method === 'POST') {
            this.$root.ajaxData('/org/inventory', mate, function () {
              vm.$root.monitor({ url: '/org/inventory/all' })
            }, 'POST')
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
    backward () {
      this.$root.monitor({ url: '/org/inventory/all' })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-form-item__label{
  line-height:inherit
}
.tbutton{
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
// .el-select>.el-input {
//   position: relative;
//   width: 80%;
// }
</style>
