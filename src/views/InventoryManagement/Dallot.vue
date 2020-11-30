<template>
  <div>
      <div class="tbutton">
        <el-button  @click="handleSubmit"  plain class="el-icon-document">提 交</el-button>
        <el-button   plain class="el-icon-close" @click="backward">取 消</el-button>
      </div>

      <DallotForm :mate="mate.mateFormerHeader" ref="DallotForm"></DallotForm>

      <KTable :mate="mate.mateList" @actionSelected="handleSelected"  @action="handleKtable"   class="KTable-margin-top"></KTable>
      
      <el-dialog title="填写调拨单明细单" width="80%" :visible.sync="dialogFormVisible">
        <el-row>
          <el-form size="mini" :model="lineform.values" label-position="right" ref="ruleForm"  :rules="rules" :label-width="labelWidth">
            <el-input v-model="lineform.values[dialogObject['lineNum'].name]" style="display:none;"></el-input>

              <el-col :sm="12" :md="8" :lg="6">
                  <el-form-item :label="dialogObject['materialId'].label" :prop="dialogObject['materialId'].name" >
                        <el-select  clearable filterable @change="changeCode(lineform.values[dialogObject['materialId'].name])" v-model="lineform.values[dialogObject['materialId'].name]">
                              <el-option :label="item.label" :value="item.value" v-for="item of materialOptions" :key="item.id">
                                <span style="float: left;margin-right:30px">{{ item.label }}</span>
                                <span style="float: right; color:#212121; font-size: 13px">{{ item.name }}</span>
                              </el-option>
                          </el-select>
                  </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="6">
                  <el-form-item :label="dialogObject['materialName'].label" :prop="dialogObject['materialName'].name" >
                      <el-input :readonly="true" v-model="lineform.values[dialogObject['materialName'].name]"></el-input>
                  </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="6">
                  <el-form-item :label="dialogObject['unit'].label" :prop="dialogObject['unit'].name" >
                      <el-input  :readonly="true" v-model="lineform.values[dialogObject['unit'].name]"></el-input>
                  </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="6">
                  <el-form-item :label="dialogObject['stockCurrentQty'].label" :prop="dialogObject['stockCurrentQty'].name" >
                      <el-input  :readonly="true" v-model="lineform.values[dialogObject['stockCurrentQty'].name]"></el-input>
                  </el-form-item>
              </el-col>
    
            <el-col :sm="12" :md="8" :lg="6">
                  <el-form-item :label="dialogObject['stockUsableQty'].label" :prop="dialogObject['stockUsableQty'].name" >
                      <el-input :readonly="true" v-model="lineform.values[dialogObject['stockUsableQty'].name]"></el-input>
                  </el-form-item>
              </el-col>
              <!--数量-->
              <el-col :sm="12" :md="8" :lg="6">
                  <el-form-item :label="dialogObject['transQty'].label" :prop="dialogObject['transQty'].name" >
                      <el-input type="number" v-model="lineform.values[dialogObject['transQty'].name]" @blur="blurQty(lineform.values[dialogObject['transQty'].name])"></el-input>
                  </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="6">
                  <el-form-item :label="dialogObject['transoutLocation'].label" :prop="dialogObject['transoutLocation'].name"  :rules="ruleOutShow">
                        <el-select  clearable  filterable  v-model="lineform.values[dialogObject['transoutLocation'].name]"  @change="changeOutLocation(lineform.values[dialogObject['transoutLocation'].name])" @visible-change="visibleChangeOutLocation">
                              <el-option :label="item.label" :value="item.value" v-for="item of locationOutOptions" :key="item.name"></el-option>
                          </el-select>
                  </el-form-item>
              </el-col>
                <el-col :sm="12" :md="8" :lg="6">
                  <el-form-item :label="dialogObject['transoutNum'].label" :prop="dialogObject['transoutNum'].name" >
                      <el-input   v-model="lineform.values[dialogObject['transoutNum'].name]"></el-input>
                  </el-form-item>
              </el-col>
                <el-col :sm="12" :md="8" :lg="6">
                  <el-form-item :label="dialogObject['transinLocation'].label" :prop="dialogObject['transinLocation'].name" :rules="ruleInShow">
                        <el-select  clearable   filterable  v-model="lineform.values[dialogObject['transinLocation'].name]"   @change="changeInLocation(lineform.values[dialogObject['transinLocation'].name])" @visible-change="visibleChangeInLocation">
                              <el-option :label="item.label" :value="item.value" v-for="item of locationInOptions" :key="item.name"></el-option>
                          </el-select>
                  </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="6">
                  <el-form-item :label="dialogObject['remark'].label" :prop="dialogObject['remark'].name" >
                      <el-input  v-model="lineform.values[dialogObject['remark'].name]"></el-input>
                  </el-form-item>
              </el-col>
          </el-form>
        </el-row>
        <el-button size="mini" @click="dlgConfirm" type="primary">确 定</el-button>
        <el-button size="mini" @click="dlgCancel">取 消</el-button>
      </el-dialog>
  </div>
</template>
<script>
import Vue from 'vue'
import { trimSpace, isPositiveinteger } from '../../utils/util.js'
export default {
  components: {
    DallotForm: function index (resolve) {
      require(['./DallotForm.vue'], resolve)
    },
    KTable: function index (resolve) {
      require(['../../components/KTable.vue'], resolve)
    },
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
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
        width = '100px'
      } else {
        width = this.mate.labelWidth
      }
      return width
    }
  },
  created () {
    this.lineform = this.mate.mateFormerLine
    this.lineform.fields.map((i) => { this.dialogObject[i.name] = i })
  },
  watch: {

  },
  data () {
    var validatePositivenumber = (rule, value, callback) => {
      if (value === undefined || trimSpace(value) === '') {
        callback(new Error('该输入项为必输项'))
      } else {
        if (!isPositiveinteger(trimSpace(value))) {
          callback(new Error('请输入正整数'))
        } else {
          callback()
        }
      }
    }
    return {
      object: {},
      dialogFormVisible: false,
      dataKTable: {},
      dialogObject: [],
      btn: {},
      row: {},
      tmpRows: [],
      locationOutOptions: [],
      locationInOptions: [],
      locationOutData: [],
      ruleOutShow: { required: true, message: '该输入项为必输项' },
      ruleInShow: { required: true, message: '该输入项为必输项' },
      locationInData: [],
      materialOptions: [],
      materialData: [],
      transoutStock: this.mate.mateFormerHeader.values.transoutStock,
      transinStock: this.mate.mateFormerHeader.values.transinStock,
      confrimRows: [],
      selectedRows: [],
      status: true,
      selectedIds: [],
      rules: {
        materialId: [
         { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        transQty: [
         { required: true, message: '该输入项为必输项', trigger: 'blur' },
        { validator: validatePositivenumber, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSelected (val) {
      // 第一步就是要清空selectedIDS里面的数据
      this.selectedIds = []
      // map方法也可以
      val.map((i) => this.selectedIds.push(i.lineNum))
      // 每次点击都会执行这个函数，要点击两下的时候，this.selectedIds里面包括了前面一次的数据，所以会有重复，要去重
      var arr = []
      var json = {}
      for (var i = 0; i < this.selectedIds.length; i++) {
        if (!json[this.selectedIds[i]]) {
          json[this.selectedIds[i]] = 1
          arr.push(this.selectedIds[i])
        }
      }
      this.selectedIds = arr
    },
    // 数量控制
    blurQty (val) {
      if (val > this.mate.mateFormerLine.values.stockUsableQty) {
        this.status = false
        this.$message({
          type: 'warning',
          message: '可用量不足'
        })
        return
      } else {
        this.status = true
      }
    },
    // 根据仓库取出库储位
    visibleChangeOutLocation () {
      var vm = this
      this.locationOutOptions = []
      if (this.mate.mateFormerHeader.values.transoutStock) {
        this.$root.ajaxData('/dc/' + this.mate.mateFormerHeader.values.transoutStock + '/locals?cols=id,name&dataOnly=true', {}, function (data) {
          vm.locationOutData = data
          for (var i = 0; i < data.length; i++) {
            vm.locationOutOptions.push({ value: data[i].id, label: data[i].name })
          }
        }, 'GET')
      }
    },
    // 根据仓库获取入库储位
    visibleChangeInLocation () {
      var vm = this
      this.locationInOptions = []
      if (this.mate.mateFormerHeader.values.transinStock) {
        this.$root.ajaxData('/dc/' + this.mate.mateFormerHeader.values.transinStock + '/locals?cols=id,name&dataOnly=true', {}, function (data) {
          vm.locationInData = data
          for (var i = 0; i < data.length; i++) {
            vm.locationInOptions.push({ value: data[i].id, label: data[i].name })
          }
        }, 'GET')
      }
    },
    // 获取出库储位名
    changeOutLocation (val) {
      for (var i = 0; i < this.locationOutData.length; i++) {
        if (val === this.locationOutData[i].id) {
          Vue.set(this.mate.mateFormerLine.values, 'transoutLocationName', this.locationOutData[i].name)
        }
      }
    },
    // 获取入库储位名
    changeInLocation (val) {
      for (var i = 0; i < this.locationInData.length; i++) {
        if (val === this.locationInData[i].id) {
          Vue.set(this.mate.mateFormerLine.values, 'transinLocationName', this.locationInData[i].name)
        }
      }
    },
    handleKtable (btn, row) {
      this.row = row
      this.btn = btn
      // 新增
      var vm = this
      if (this.btn.action === 'addLine') {
        if (this.mate.mateFormerHeader.values.transoutOrg === null || this.mate.mateFormerHeader.values.transinOrg === null) {
          this.$message({
            type: 'warning',
            message: '请选择调出组织和调入组织'
          })
          return
        }
        if (this.mate.mateFormerHeader.values.outStock === true) {
          this.ruleOutShow = { required: true, message: '该输入项为必输项' }
        } else {
          this.ruleOutShow = {}
        }
        if (this.mate.mateFormerHeader.values.inStock === true) {
          this.ruleInShow = { required: true, message: '该输入项为必输项' }
        } else {
          this.ruleInShow = {}
        }
        this.materialOptions = []
        this.materialData = []
        this.dialogFormVisible = true
        this.mate.mateFormerLine.values = {}
        var orgs = [this.mate.mateFormerHeader.values.transoutOrg, this.mate.mateFormerHeader.values.transinOrg]
        this.$root.ajaxData('/materials/getMaterialByOrgs?ids=' + orgs, {}, function (data) {
          if (data.length === 0) {
            vm.$message({
              type: 'warning',
              message: '物料不在调入、调出库存组织中'
            })
            return
          }
          for (var i = 0; i < data.length; i++) {
            vm.materialData = data
            vm.materialOptions.push({ value: data[i].id, label: data[i].subcode, name: data[i].name })
          }
        }, 'GET')
        return
      } else if (this.btn.action === 'deleteLine') {
        // 判断list中有的值和用户选择的值是否一致，若一致则将其删除
        for (var j = 0; j < this.mate.mateList.rows.length; j++) {
          for (var k = 0; k < this.selectedIds.length; k++) {
            if (this.mate.mateList.rows[j].lineNum === this.selectedIds[k]) {
              // splice(i, 1),从i开始的那一条，删除一条
              this.mate.mateList.rows.splice(j, 1)
              // 删除了一条之后，就将剩余从新排序
            }
          }
          for (var l = 0; l < this.mate.mateList.rows.length; l++) {
            this.mate.mateList.rows[l].lineNum = l + 1
          }
        }
      }
    },
    dlgConfirm (val) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.status === false) {
            this.$message({
              type: 'warning',
              message: '可用量不足'
            })
            return
          } else {
            this.mate.mateFormerLine.values.lineNum = (this.mate.mateList.rows.length + 1)
            const mateFormerValues = Object.assign({}, this.mate.mateFormerLine.values)
            this.mate.mateList.rows.push(mateFormerValues)
            this.dialogFormVisible = false
            // 清空数据
            this.mate.mateFormerLine.values = {}
            // this.$refs['ruleForm'].resetFields()
          }
        } else {
          this.$notify.error({
            title: '消息',
            message: '数据验证未通过'
          })
        }
      })
    },
    dlgCancel () {
      this.dialogFormVisible = false
    },
    handleSubmit () {
      var mate = {}
      var vm = this
      this.$refs.DallotForm.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          mate.mateFormerHeader = this.mate.mateFormerHeader.values
          mate.mateList = this.mate.mateList.rows
          this.$root.ajaxData('/inventory/dallot/batchSave', mate, function (data) {
            vm.$root.monitor({ url: '/inventory/dallot/all/list' })
          }, 'POST')
        }
      })
    },
    backward () {
      this.$root.monitor({ url: '/inventory/dallot/all/list' })
    },
    // 物料获取单位数量
    changeCode (val) {
      var vm = this
      for (var i = 0; i < this.materialData.length; i++) {
        if (val === this.materialData[i].id) {
          Vue.set(this.mate.mateFormerLine.values, 'materialName', this.materialData[i].name)
          Vue.set(this.mate.mateFormerLine.values, 'unit', this.materialData[i].basicUnit)
          Vue.set(this.mate.mateFormerLine.values, 'materialCode', this.materialData[i].subcode)
        }
      }
      if (val) {
        this.$root.ajaxData('/inventory/onhand/quantity/getOnhandQty?itemIds=' + val, {}, function (data) {
          if (data.length === 0) {
            vm.$set(vm.mate.mateFormerLine.values, 'stockCurrentQty', 0)
            vm.$set(vm.mate.mateFormerLine.values, 'stockUsableQty', 0)
          } else if (data.length !== 0) {
            if (data[0].onhandQty === null) {
              vm.$set(vm.mate.mateFormerLine.values, 'stockCurrentQty', 0)
            } else {
              vm.$set(vm.mate.mateFormerLine.values, 'stockCurrentQty', data[0].onhandQty)
            }
            if (data[0].assignQty === null) {
              vm.$set(vm.mate.mateFormerLine.values, 'stockUsableQty', 0)
            } else {
              vm.$set(vm.mate.mateFormerLine.values, 'stockUsableQty', data[0].assignQty)
            }
          }
        })
      }
    }
  }
}
</script>
<style  scoped lang="scss">
// .KTable-margin-top{
//   margin-top:20px;
// }
.tbutton{
  margin: 3px 0;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}
// .el-input__suffix {
//   right:68px
// }
.el-form-item--mini.el-form-item {
  margin: 6px;
}
.el-form-item__label{
  line-height:inherit
}
.el-select{
  width: 100%;
}
</style>

