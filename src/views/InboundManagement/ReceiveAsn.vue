<!-- 收货任务新增页面 -->
<template>
  <div>
    <div class="tbutton">
      <el-button plain class="el-icon-document" @click="handleSubmit">提 交</el-button>
      <el-button plain class="el-icon-close" @click="backward" v-if="!mate.inline">取 消</el-button>
      <el-button plain class="el-icon-date"  @click="resetForm('ruleForm')">重 置</el-button>
    </div>
    <el-row>
      <el-form size="mini" :model="mate.mateFormerHeader.values" :inline="mate.inline" :label-position="labelPosition" ref="ruleForm" :rules="rules" :label-width="labelWidth">
        <template>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['asnCode'].label" :prop="object['asnCode'].name">
            <el-input  disabled v-model="mate.mateFormerHeader.values[object['asnCode'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['orgId'].label" :prop="object['orgId'].name">
          <el-select clearable @change="changeOrg" v-model="mate.mateFormerHeader.values[object['orgId'].name]" :placeholder="object['orgId'].placeholder">
              <el-option :label="item.label" :value="item.value" v-for="item of orgIdOptions" :key="item.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

         <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['supplierId'].label" :prop="object['supplierId'].name">
          <el-select clearable @change="changeSupplier" v-model="mate.mateFormerHeader.values[object['supplierId'].name]" :placeholder="object['supplierId'].placeholder">
              <el-option :label="item.label" :value="item.value" v-for="item of supplierOptions" :key="item.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

           <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['deliveryTime'].label" :prop="object['deliveryTime'].name">
            <el-date-picker clearable type="date" v-model="mate.mateFormerHeader.values[object['deliveryTime'].name]" :editable="false"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['arrivalTime'].label" :prop="object['arrivalTime'].name">
            <el-date-picker clearable type="date" v-model="mate.mateFormerHeader.values[object['arrivalTime'].name]" :editable="false"></el-date-picker>
          </el-form-item>
        </el-col>

          <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['packCount'].label" :prop="object['packCount'].name">
            <el-input   v-model="mate.mateFormerHeader.values[object['packCount'].name]"></el-input>
          </el-form-item>
        </el-col>
        
        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['totalWeightGross'].label" :prop="object['totalWeightGross'].name">
            <el-input v-model="mate.mateFormerHeader.values[object['totalWeightGross'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['totalWeightNet'].label" :prop="object['totalWeightNet'].name">
            <el-input v-model="mate.mateFormerHeader.values[object['totalWeightNet'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['totalCbm'].label" :prop="object['totalCbm'].name">
            <el-input v-model="mate.mateFormerHeader.values[object['totalCbm'].name]"></el-input>
          </el-form-item>
        </el-col>
        </template>
      </el-form>
    </el-row>

    <div class="tbutton">
      <el-button class="el-icon-plus" plain  @click="add">新 增</el-button>
      <el-button class="el-icon-delete" plain @click="del" v-if="!mate.inline">删 除</el-button>
    </div>

    <el-dialog title="选择采购单" :visible.sync="dialogListVisible" width="80%">
      <SoReturnKtable :mate="dataKTable" @actionSelected="handleSelected" :mateFormSupplierId = 'mateFormSupplierId' :mateFormOrgId="mateFormOrgId"></SoReturnKtable>
      <div class="fbutton">
        <el-button @click="dlgConfirm">确 定</el-button>
        <el-button @click="dlgCancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-table size="mini" :data="list.rows" @selection-change="lineSelected" border fit highlight-current-row :rules="rules">

        <el-table-column type="selection" width="55">
        </el-table-column>

        <el-table-column :label="objectColumns['lineNum'].label" width="60">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['lineNum'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['poNo'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['poNo'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['polineNo'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['polineNo'].name]}}</span>
          </template>
        </el-table-column>

        

        <el-table-column :label="objectColumns['supplierItem'].label" width="160">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['supplierItem'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['supplierItemName'].label" width="240">
          <template slot-scope="scope">
           <span>{{scope.row[objectColumns['supplierItemName'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['receiveOrgName'].label" width="150">
          <template slot-scope="scope">
             <span>{{scope.row[objectColumns['receiveOrgName'].name]}}</span>
          </template>
        </el-table-column> 

        <el-table-column :label="objectColumns['qty'].label" width="120">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row[objectColumns['qty'].name]"></el-input>
          </template>
        </el-table-column>

         <el-table-column :label="objectColumns['orderQty'].label" width="120">
         <template slot-scope="scope">
            <span>{{scope.row[objectColumns['orderQty'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['unit'].label" width="120">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['unit'].name]}}</span>
          </template>
        </el-table-column>

         <el-table-column :label="objectColumns['returnQty'].label" width="120">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['returnQty'].name]}}</span>
          </template>
        </el-table-column>

         <el-table-column :label="objectColumns['requestDate'].label" width="120">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['requestDate'].name]}}</span>
          </template>
        </el-table-column>
         <el-table-column :label="objectColumns['shipDate'].label" width="120">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['shipDate'].name]}}</span>
          </template>
        </el-table-column>
           <el-table-column :label="objectColumns['promiseDate'].label" width="120">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['promiseDate'].name]}}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column :label="objectColumns['packQty'].label">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row[objectColumns['packQty'].name]"></el-input>
          </template>
        </el-table-column> -->

    </el-table>

    
  </div>
</template>

<script>
import { DateFormat, trimSpace, isPositiveinteger, isPositivenumber } from '../../utils/util.js'
import Vue from 'vue'
export default {
  data () {
    var validateRequired = (rule, value, callback) => {
      if (value === undefined || value === null || trimSpace(value) === '') {
        callback(new Error('该输入项为必输项'))
      } else {
        callback()
      }
    }

    var validatePositiveinteger = (rule, value, callback) => {
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

    var validatePositivenumber = (rule, value, callback) => {
      if (value === undefined || trimSpace(value) === '') {
        callback(new Error('该输入项为必输项'))
      } else {
        if (!isPositivenumber(trimSpace(value))) {
          callback(new Error('请输入正数'))
        } else {
          callback()
        }
      }
    }
    return {
      form: {},
      object: {},
      objectColumns: {},
      list: {},
      dataKTable: {},
      tmpRows: [],
      orgIdOptions: [],
      confrimRows: [],
      selectedLines: [],
      selectedRows: [],
      codeOptions: [],
      supplierOptions: [],
      customerOptions: [],
      destinationOptions: [],
      contactNameOptions: [],
      dialogListVisible: false,
      address: true,
      contactName: true,
      returnQTy: '',
      mateFormSupplierId: this.mate.mateFormerHeader.values.supplierId,
      mateFormOrgId: this.mate.mateFormerHeader.values.orgId,
      labelPosition: 'right',
      rows: [],
      rules: {
        supplierId: [
          { required: true, message: '该输入项为必输项' },
          { validator: validatePositiveinteger, trigger: 'change' },
          { validator: validatePositiveinteger, trigger: 'blur' }
        ],
        totalWeightGross: [
          { required: true, message: '该输入项为必输项' },
          { validator: validatePositivenumber, trigger: 'change' },
          { validator: validatePositivenumber, trigger: 'blur' }
        ],
        totalWeightNet: [
          { required: true, message: '该输入项为必输项' },
          { validator: validatePositivenumber, trigger: 'change' },
          { validator: validatePositivenumber, trigger: 'blur' }
        ],
        totalCbm: [
          { required: true, message: '该输入项为必输项' },
          { validator: validatePositivenumber, trigger: 'change' },
          { validator: validatePositivenumber, trigger: 'blur' }
        ],
        deliveryMode: [
          { required: true, message: '该输入项为必输项' },
          { validator: validateRequired, trigger: 'change' }
        ],
        deliveryOrderNo: [
          { required: true, message: '该输入项为必输项' },
          { validator: validateRequired, trigger: 'change' }
        ]
      }
    }
  },
  components: {
    SoReturnKtable: function index (resolve) {
      require(['../SaleManagement/SoReturnKtable.vue'], resolve)
    },
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
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
  watch: {
    rows: {
      handler: function (val, old) {
        var amount = 0
        var packageAmount = 0
        for (let j = 0; j < val.length; j++) {
          var price = val[j].priceTax
          var qty = val[j].qty
          var pack = 0
          if (!val[j].packQty) {
            pack = 0
          } else {
            pack = parseInt(val[j].packQty)
          }
          amount = amount + price * qty
          packageAmount = packageAmount + pack
        }
        this.mate.mateFormerHeader.values.totalAmount = amount
        this.mate.mateFormerHeader.values.packCount = packageAmount
      },
      deep: true
    }
  },
  props: {
    mate: Object
  },
  created () {
    this.mate.mateFormerHeader.fields.map((i) => { this.object[i.name] = i })
    this.form = this.mate.mateFormerHeader
    this.list = this.mate.mateList
    this.list.columns.map((i) => { this.objectColumns[i.name] = i })
    this.getSupplier()// 获取供应商
    var vm = this
    this.$root.ajaxData('/org/inventory/getOrgByOfficeId?ids=', {}, function (data) {
      data.map((i) => {
        vm.orgIdOptions.push({ 'label': i.name, 'value': i.id })
        if (!vm.mate.mateFormerHeader.values.id) {
          if (vm.orgIdOptions.length !== 0) {
            Vue.set(vm.mate.mateFormerHeader.values, 'orgId', vm.orgIdOptions[0].value)
            vm.mateFormOrgId = vm.orgIdOptions[0].value; // 设置默认值的同事保存orgId 到mateFormOrgId中 2019-02-13
          }
        }
      })
    })
  },
  methods: {
    // 获取供应商
    getSupplier () {
      var vm = this
      this.$root.ajaxData('/companys/companyInfo/3?status=1&auditStatus=1&nopaging=1&dataOnly=true', {}, function (data) {
        for (let i = 0; i < data.length; i++) {
          vm.supplierOptions.push({ label: data[i].name, value: data[i].id, key: data[i].id })
        }
      }, 'GET')
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    changeSupplier (val) {
      this.mateFormSupplierId = val
    },
    changeOrg (val) {
      this.mateFormOrgId = val;
    },
    add () {
      var vm = this
      if (this.mate.mateFormerHeader.values.supplierId === null) {
        vm.$message({
          message: '请选择供应商',
          type: 'warning'
        })
        this.dialogListVisible = false
        return
      }
      this.dialogListVisible = true
      this.$root.ajaxData('/purchase/goodsPricing/line/getPurchaseOrder?supplierId=' + this.mate.mateFormerHeader.values.supplierId + '&orgId=' + this.mate.mateFormerHeader.values.orgId+'&auditStatus=3', {}, function (data) {
        delete data.mate.btns
        vm.dataKTable = data.mate
      }, 'GET')
      if (this.list.rows.length === 0) {
        this.tmpRows = []
      } else {
        this.tmpRows = this.list.rows
      }
    },
    del () {
      var vm = this
      var rows = this.selectedLines
      if (rows.length === 0) {
        vm.$message({
          message: this.$t('selmdata'),
          type: 'warning'
        })
        return
      } else {
        for (let i = 0; i < this.list.rows.length; i++) {
          for (let j = 0; j < this.selectedLines.length; j++) {
            if (this.list.rows[i].lineNum === this.selectedLines[j].lineNum) {
              this.list.rows.splice(i, 1)
              this.tmpRows.splice(i, 1)
            }
          }
        }
        for (var m = 0; m < this.list.rows.length; m++) {
          this.list.rows[m].lineNum = m + 1
        }
      }
      var amount = 0
      var packageAmount = 0
      for (let z = 0; z < this.list.rows.length; z++) {
        var price = this.list.rows[z].priceTax
        var qty = this.list.rows[z].qty
        var pack = this.list.rows[z].packQty
        amount = amount + price * qty
        packageAmount = packageAmount + pack
      }
    },
    dlgConfirm (val) {
      var vm = this
      var rows = this.selectedRows
      if (rows.length === 0) {
        vm.$message({
          message: this.$t('selmdata'),
          type: 'warning'
        })
        return
      } else {
        this.confrimRows = []
        for (let i = 0; i < rows.length; i++) {
          // 将rows[i].poDespatchList中的id设置为空
          rows[i].id = ''
          this.confrimRows.push(rows[i])
        }
        var index = 0
        while (this.confrimRows.length !== 0) {
          if (index >= this.confrimRows.length) {
            break
          }
          var j
          for (j = 0; j < this.mate.mateList.rows.length; j++) {
            if (this.mate.mateList.rows[j].poNo === this.confrimRows[index].name && this.mate.mateList.rows[j].polineNo === this.confrimRows[index].poLineNum) {
              this.confrimRows.splice(index, 1)
              break
            }
          }
          if (j >= this.mate.mateList.rows.length) {
            index++
          }
        }
        this.tmpRows.push(...this.confrimRows)
        this.list.rows = this.tmpRows
        for (let j = 0; j < this.tmpRows.length; j++) {
          var lineno = j + 1
          this.list.rows[j].lineNum = lineno
          this.list.rows[j].poNo = this.tmpRows[j].name
          this.list.rows[j].polineNo = this.tmpRows[j].poLineNum
          this.list.rows[j].supplierItem = this.tmpRows[j].subcode
          this.list.rows[j].supplierItemName = this.tmpRows[j].materialName
          this.list.rows[j].goodsId = this.tmpRows[j].materialId
          // 本次收货数量 = 待收货数量 + 已退货数量
          this.list.rows[j].qty = parseInt(this.tmpRows[j].needReceiveQty) + parseInt(this.tmpRows[j].returnQty)
          // 订单数量 = 待发运数量
          this.list.rows[j].orderQty = this.tmpRows[j].needShipQty
          //   = 待收货数量 + 已退货数量
          this.list.rows[j].canQty = parseInt(this.tmpRows[j].needReceiveQty) + parseInt(this.tmpRows[j].returnQty)
          this.list.rows[j].receiveOrgName = this.tmpRows[j].orgName
          this.list.rows[j].receiveOrgId = this.tmpRows[j].orgId
          this.list.rows[j].requestDate = this.tmpRows[j].needDate
        }
        this.dialogListVisible = false
        this.tmpRows = []
      }
      this.rows = this.list.rows
      var amount = 0
      for (let z = 0; z < this.list.rows.length; z++) {
        var price = this.list.rows[z].priceTax
        var qty = this.list.rows[z].qty
        amount = amount + price * qty
      }
      this.mate.mateFormerHeader.values.totalAmount = amount
    },
    dlgCancel () {
      this.dialogListVisible = false
    },
    handleSelected (val) {
      this.selectedRows = val
    },
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

      if (this.list.rows.length === 0) {
        vm.$message({
          message: this.$t('Detailed data can not be empty'),
          type: 'warning'
        })
        return
      }
      if (this.list.rows.length !== 1) {
        for (let z = 0; z <= this.list.rows.length - 2; z++) {
          if (this.list.rows[z].orgId !== this.list.rows[z + 1].orgId) {
            vm.$message({
              message: this.$t('selectSame'),
              type: 'warning'
            })
            return
          }
        }
      }
      var chkmsg = ''
      for (var k = 0; k < this.list.rows.length; k++) {
        // if (this.list.rows[k].shippingOrderNo === undefined || this.list.rows[k].shippingOrderNo === null || trimSpace(this.list.rows[k].shippingOrderNo) === '') {
        //   chkmsg = '明细数据第' + this.list.rows[k].lineNum + '行的装箱单号不能为空'
        //   break
        // }
        // if (this.list.rows[k].packQty === undefined || this.list.rows[k].packQty === null || trimSpace(this.list.rows[k].packQty) === '') {
        //   chkmsg = '明细数据第' + this.list.rows[k].lineNum + '行的箱数不能为空'
        //   break
        // }
        // if (!isPositiveinteger(trimSpace(this.list.rows[k].packQty))) {
        //   chkmsg = '明细数据第' + this.list.rows[k].lineNum + '行的箱数必须为正整数'
        //   break
        // }
        if (this.list.rows[k].qty <= 0) {
          chkmsg = '明细数据第' + this.list.rows[k].lineNum + '行的数量小于等于0'
          break
        }
        // 如果采购数量大于订单数量不允许提交 2020-06-30
        if (this.list.rows[k].qty > this.list.rows[k].orderQty) {
          chkmsg = '明细数据第' + this.list.rows[k].lineNum + '行的收货数量不足'
          break
        }
      }

      if (chkmsg !== '') {
        vm.$message({
          message: chkmsg,
          type: 'warning'
        })
        return
      }

      this.form.values.deliveryTime = DateFormat(this.form.values.deliveryTime, 'yyyy-MM-dd')
      this.form.values.arrivalTime = DateFormat(this.form.values.arrivalTime, 'yyyy-MM-dd')
      this.form.values.billType = '1'

      for (var i = 0; i < this.list.rows.length; i++) {
        this.list.rows[i].isPur = true
      }
      mate.mateFormerHeader = this.form.values
      mate.mateList = this.list.rows
      if (this.mate.mateFormerHeader.method === 'POST') {
        this.$root.ajaxData('/purchase/asn/batchSave?receive=true', mate, function () {
          vm.$root.monitor({ url: '/purchase/asn/all/list?businessType=true' })
        }, 'POST')
      } else {
        this.$root.ajaxData('/purchase/asn/batchUpdate' + '/' + mate.mateFormerHeader.id, mate, function () {
          vm.$root.monitor({ url: '/purchase/asn/all/list?businessType=true' })
        }, 'PUT')
      }
    },
    backward () {
      this.$root.monitor({ url: '/purchase/asn/all/list?businessType=true' })
    },
    lineSelected (val) {
      this.selectedLines = val
    },
    changeCode (value, lineNum) {
      try {
        var obj = this.codeOptions.find((item) => {
          return item.value === value
        })
        this.list.rows[lineNum - 1].goodsId = obj.key
        this.list.rows[lineNum - 1].item = obj.label
      } catch (e) {
      }
    }
  }
}
</script>

<style scoped lang="scss">
.el-form-item__label{
  line-height:inherit
}
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
.tbutton{
  margin: 3px 0;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}
.fbutton{
  margin: 5px 0;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}
.el-input__suffix {
  right:80px
}
.el-form-item--mini.el-form-item {
  margin: 6px;
}
.el-input--mini .el-input__inner{
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
</style>
