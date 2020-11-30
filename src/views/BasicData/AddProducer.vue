<template>
  <div>
    <el-row>
      <el-form size="mini" :model="mate.mateFormerHeader.values" label-position="right" ref="ruleForm" :rules="rules" :label-width="labelWidth">
        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item label="生产商名称" :prop="headerObject['name'].name" >
            <el-input v-model="mate.mateFormerHeader.values['name']"></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item label="生产商简称" :prop="headerObject['shortName'].name" >
            <el-input v-model="mate.mateFormerHeader.values['shortName']"></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item label="社会信用代码" :prop="headerObject['codeCredit'].name" >
            <el-input v-model="mate.mateFormerHeader.values['codeCredit']"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <!--新增-->
    <KTable :KTableItemCode="KTableItemCode" @actionSelected="handleSelectionChange" v-if="isKtable" :mate="mate.mateList" :mateFormerHeaderId="id" class="KTable-margin-top" @action="handleKtable"></Ktable>
    <!--修改-->
    <el-table size="mini" v-else :data="mate.mateList.rows" border  highlight-current-row style="width: 100%" class="el-table-margin">
      <!--<el-table-column :label="object['lineNum'].label" :prop="object['lineNum'].name" :width="object['lineNum'].width"></el-table-column>-->
      <el-table-column :label="object['name'].label" :prop="object['name'].name" :width="object['name'].width" >
        <template slot-scope="scope">
          <el-input v-show="true" size="mini" v-model="scope.row[object['name'].name]"></el-input>
        </template>
      </el-table-column>
      <el-table-column :label="object['type'].label" :prop="object['type'].name" :width="object['type'].width">
        <template slot-scope="scope">
          <el-input v-show="true" size="mini" v-model="scope.row[object['type'].name]"></el-input>
        </template>
      </el-table-column>
      <el-table-column :label="object['approvalNumber'].label" :prop="object['approvalNumber'].name" :width="object['approvalNumber'].width">
        <template slot-scope="scope">
          <el-input v-show="true" size="mini" v-model="scope.row[object['approvalNumber'].name]"></el-input>
        </template>
      </el-table-column>
      <el-table-column :label="object['approvalDate'].label" :prop="object['approvalDate'].name" :width="object['approvalDate'].width">
        <template slot-scope="scope">
          <el-date-picker v-model="scope.row[object['approvalDate'].name]" type="date" placeholder="选择日期"></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column :label="object['validityDate'].label" :prop="object['validityDate'].name" :width="object['validityDate'].width">
        <template slot-scope="scope">
          <el-date-picker v-model="scope.row[object['validityDate'].name]" type="date" placeholder="选择日期"></el-date-picker>
        </template> 
      </el-table-column>
    </el-table>
    <div class="tbutton">
      <el-button @click="handleSubmit">保 存</el-button>
      <el-button @click="backward" v-if="!mate.inline">取 消</el-button>
    </div>

    <!--size="large"-->
    <el-dialog title="新增明细单" width="75%" :visible.sync="dialogFormVisible" :rules="rules" >
      <el-row>
      <el-form size="mini" :model="mate.mateFormer.values" :inline="mate.mateFormer.inline" label-position="right" ref="ruleForm"  :rules="rules" :label-width="labelWidth">

      <el-col :sm="12" :md="8" :lg="6">
          <el-form-item label="生产证号" :prop="dialogObject['name'].name">
            <el-input v-model="mate.mateFormer.values[dialogObject['name'].name]"></el-input>
          </el-form-item>
        </el-col>
        
        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item label="证件类型" :prop="dialogObject['type'].name">
            <el-input v-model="mate.mateFormer.values[dialogObject['type'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item label="批准文号" :prop="dialogObject['approvalNumber'].name">
            <el-input v-model="mate.mateFormer.values[dialogObject['approvalNumber'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item  label="批准日期" :prop="dialogObject['approvalDate'].name">
            <el-date-picker clearable type="date" v-model="mate.mateFormer.values[dialogObject['approvalDate'].name]"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item  label="截止日期" :prop="dialogObject['validityDate'].name">
            <el-date-picker clearable type="date" v-model="mate.mateFormer.values[dialogObject['validityDate'].name]"></el-date-picker>
          </el-form-item>
        </el-col>

        </el-form>
      </el-row>
      <div class="tbutton">
        <el-button @click="dialogSubmit">提 交</el-button>
        <el-button @click="dialogBackward" v-if="!mate.inline">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { DateFormat } from '../../utils/util.js'
export default {

  components: {
    KTable: function index (resolve) {
      require(['../../components/KTable.vue'], resolve)
    },
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
    }
  },
  data () {
    return {
      dialogFormVisible: false,
      btn: {},
      row: [],
      id: this.mate.mateFormerHeader.values.id,
      storageId: 0,     // 仓库的id
      locationId: true,
      mateFormerRows: [],
      object: {},
      dialogObject: {},
      isKtable: true,
      subCodeOptions: [],
      delivery: '',                     // 送货
      picking: '',                       // 提货
      KTableItemCode: '',               // 货品编码给用户看到的信息，将该信息传给KTable
      rowLine: '',                       // 明细行新增点击修改时，获取到行的信息
      newOrUpdata: false,
      headerObject: {},
      ruleForm: {
        name: ''
      },
      rules: {
        name: [
           { required: true, message: '该输入项为必输项' },
          { trigger: 'blur' }
        ]
      }
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
    this.mate.mateFormerHeader.fields.map((i) => { this.headerObject[i.name] = i })
    this.mate.mateList.columns.map((i) => { this.object[i.name] = i })
    this.mate.mateFormer.fields.map((i) => { this.dialogObject[i.name] = i })
    if (this.mate.mateFormerHeader.values.id) {
      this.isKtable = false
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
      } else {
        width = this.mate.labelWidth
      }
      return width
    }
  },
  mounted () {
  },
  methods: {
    handleSubmit () {
      var vm = this
      var mate = {}
      this.mate.mateFormerHeader.values.documentDate = DateFormat(this.mate.mateFormerHeader.values.documentDate, 'yyyy-MM-dd')
      this.mate.mateFormerHeader.values.expectedShippingDate = DateFormat(this.mate.mateFormerHeader.values.expectedShippingDate, 'yyyy-MM-dd')
      mate.mateFormerHeader = this.mate.mateFormerHeader.values
      mate.mateList = this.mate.mateList.rows
      for (var i = 0; i < this.mate.mateList.rows.length; i++) {
        this.mate.mateList.rows[i].approvalDate = DateFormat(this.mate.mateList.rows[i].approvalDate, 'yyy-MM-dd')
        this.mate.mateList.rows[i].validityDate = DateFormat(this.mate.mateList.rows[i].validityDate, 'yyy-MM-dd')
      }
      if (this.mate.mateFormerHeader.values['name'] === '') {
        vm.$notify.error({
          title: '消息',
          message: '数据验证未通过'
        })
        return false
      }
      if (this.mate.mateFormerHeader.method === 'PUT' && this.mate.mateFormerHeader.values.id) {
        this.$root.ajaxData('/companys/producer/' + this.mate.mateFormerHeader.values.id, mate, function () {
          vm.$root.monitor({ url: '/companys/companyInfo/0' })
        }, 'PUT')
      } else if (this.mate.mateFormerHeader.method === 'POST') {
        this.$root.ajaxData('/companys/producer', mate, function () {
          vm.$root.monitor({ url: '/companys/companyInfo/0' })
        }, 'POST')
      }
    },
    backward () {
      this.$root.monitor({ url: '/companys/companyInfo/0' })
    },
    dialogSubmit (ev) {
      var vm = this
      this.dialogFormVisible = false
      // 在页面上添加细单行号
      this.mate.mateFormer.values.lineNum = (this.mate.mateList.rows.length + 1)
      if (this.mate.mateFormer.values[this.dialogObject['name'].name] === '') {
        vm.$notify.error({
          title: '消息',
          message: '数据验证未通过'
        })
        return false
      }
      if (this.newOrUpdata) {
        for (var i = 0; i < this.mate.matelist.rows.length; i++) {
          if (this.mate.mateList.rows[i].lineNum === this.rowLine[0].lineNum) {
            this.mate.mateList.rows.splice(i, 1)
            this.mate.mateFormer.values.lineNum = i - 2
          }
        }
      }
      // 拷贝
      const mateFormerValues = Object.assign({}, this.mate.mateFormer.values)
      mateFormerValues.validityDate = DateFormat(this.mate.mateFormer.values.validityDate, 'yyyy-MM-dd')
      mateFormerValues.approvalDate = DateFormat(this.mate.mateFormer.values.approvalDate, 'yyyy-MM-dd')
      this.mate.mateList.rows.push(mateFormerValues)
    },
    dialogBackward () {
      // 在取消的时候需要将dialog里面的values清空
      this.mate.mateFormer.values = {}
      this.dialogFormVisible = false
    },
    handleKtable (btn, row) {
      const vm = this
      this.dialogFormVisible = true
      this.row = row
      this.btn = btn
      // 新增
      if (this.btn.action === 'addDetailBill') {
        this.newOrUpdata = false
        if (this.mate.mateFormerHeader.values.orgId) {
          this.$root.ajaxData('/materials?orgId=' + this.mate.mateFormerHeader.values.orgId + '&status=1&statusAudit=1&dataOnly=true', {}, function (data) {
            vm.mateFormerRows = data
            var arr = []
            for (var i = 0; i < data.length; i++) {
              var label = data[i].subcode
              var value = data[i].id
              var options = { 'label': label, 'value': value }
              arr.push(options)
              vm.subCodeOptions.push(options)
            }
            // 放进货品编码里面去
            vm.dialogObject['itemCode'].options = arr
          }, 'GET')
        }
        // 修改
      } else if (this.btn.action === 'updataDetailBill') {
        // 获取到选择的哪一行数据，并将数据放置在former表单里面
        this.newOrUpdata = true
        for (var i = 0; i < this.mate.mateList.rows.length; i++) {
          if (this.mate.mateList.rows[i].lineNum === this.rowLine[0].lineNum) {
            this.mate.mateFormer.values = this.mate.mateList.rows[i]
          }
        }
        this.$root.ajaxData('/dc/list?nopaging=1&dataOnly=true', {}, function (data) {
          for (var i = 0; i < data.length; i++) {
            var name = data[i].name
            var id = data[i].id
            var options = { value: id, label: name }
            vm.dialogObject['warehouseId'].options.push(options)
          }
        }, 'GET')
      }
    },
    // table表格中勾选的选项，val是勾选的对象
    handleSelectionChange (val) {
      this.$emit('actionSelected', val)
      this.multipleSelection = val
      this.rowLine = val
    }
  }
}
</script>

<style scoped lang="scss">
.KTable-margin-top{
  margin-top:20px;
}
.el-form-item {
    margin: 15px 20px 2px 0px;
}
.el-table-margin{
  margin-top:40px;
}
.el-form-item--mini.el-form-item {
  margin: 6px;
}
.el-select>.el-input {
  position: relative;
  width: 80%;
}
.el-dialog__header {
  padding: 10px 10px 0;
}
.el-dialog__body {
  padding: 10px 10px;
}
.tbutton {
  margin: 3px 0;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}
.el-button--mini {
  padding: 7px 9px;
}
</style>

