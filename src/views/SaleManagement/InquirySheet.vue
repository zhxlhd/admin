<template>
  <div>
    <div class="tbutton">
      <el-button type="primary"  plain class="el-icon-document" :disabled="buttonDisabled" @click="handleSubmit">提 交</el-button>
      <el-button type="warning" plain class="el-icon-close" @click="backward" v-if="!mate.inline">取 消</el-button>
       <el-button  type="danger"  plain class="el-icon-date"   @click="resetForm('InquirySheetForm')">重 置</el-button>
    </div>
    <inquirySheetForm :mate="form" ref="InquirySheetForm" :labelPosition="labelPosition" :labelWidth="labelWidth"></InquirySheetForm>
    
    <div class="fbutton">
      <el-button class="el-icon-plus" type="primary"  plain @click="add">新 增</el-button>
      <el-button class="el-icon-edit" type="warning" plain @click="edit">修 改</el-button>
      <el-button  class="el-icon-delete" type="danger"  plain @click="del" v-if="!mate.inline">删 除</el-button>
    </div>

    <el-dialog title="填写询价明细" :visible.sync="dialogVisible" width="80%" :before-close="dlgClose">
      <template>
        <div>
          <el-row>
            <el-form :model="lineform.values" :inline="lineform.inline"  ref="ruleForm" :rules="rules"  :labelPosition ="labelPosition" :labelWidth="labelWidth">
              <template>

              <el-input v-model="lineform.values[object['lineNum'].name]" style="display:none;"></el-input>

               <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="object['productId'].label" :prop="object['productId'].name">
                   <el-select clearable  @change="changeCode(lineform.values[object['productId'].name])" v-model="lineform.values[object['productId'].name]"  filterable placeholder="请选择">
                    <el-option v-for="item in codeOptions" :key="item.id" :label="item.label" :value="item.value">
                      <span style="float: left;margin-right:30px">{{ item.label }}</span>
                    <span style="float: right; color:#212121; font-size: 13px">{{ item.name }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="object['productName'].label" :prop="object['productName'].name">
                 
                  <el-input readonly v-model="lineform.values[object['productName'].name]"></el-input>
                </el-form-item>
              </el-col>
              
              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="object['explain'].label" :prop="object['explain'].name">
                  <el-input readonly  v-model="lineform.values[object['explain'].name]"></el-input>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="object['unit'].label" :prop="object['unit'].name">
                  <el-input readonly v-model="lineform.values[object['unit'].name]"></el-input>
                </el-form-item>
              </el-col>
            
             <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="object['category'].label" :prop="object['category'].name">
                 <el-input readonly v-model="lineform.values[object['category'].name]"></el-input>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="object['brand'].label" :prop="object['brand'].name">
                  <el-input v-model="lineform.values[object['brand'].name]"></el-input>
                </el-form-item>
              </el-col>
              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="object['qty'].label" :prop="object['qty'].name">
                  <el-input v-model="lineform.values[object['qty'].name]"></el-input>
                </el-form-item>
              </el-col>

            <!--  <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="object['price'].label" :prop="object['price'].name">
                  <el-input v-model="lineform.values[object['price'].name]"></el-input>
                </el-form-item>
              </el-col> -->

              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="object['minOrderQty'].label" :prop="object['minOrderQty'].name">
                  <el-input type="number" v-model="lineform.values[object['minOrderQty'].name]"></el-input>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="object['maxOrderQty'].label" :prop="object['maxOrderQty'].name">
                  <el-input type="number" v-model="lineform.values[object['maxOrderQty'].name]"></el-input>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="object['itemNumber'].label" :prop="object['itemNumber'].name">
                  <el-input v-model="lineform.values[object['itemNumber'].name]"></el-input>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="object['remark'].label" :prop="object['remark'].name">
                  <el-input v-model="lineform.values[object['remark'].name]"></el-input>
                </el-form-item>
              </el-col>

              </template>
            </el-form>
          </el-row>
        </div>
      </template>

      <div class="sbutton">
          <el-button @click="dlgConfirm" type="primary">确 定</el-button>
          <el-button @click="dlgCancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-table :data="list.rows" border fit highlight-current-row @selection-change="lineSelected" style="width: 100%">

        <el-table-column type="selection" width="55">
        </el-table-column>

        <el-table-column :label="objectColumns['lineNum'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['lineNum'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['productName'].label" width="180">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['productName'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['productCode'].label" width="180">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['productCode'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :formatter="objectColumns['category'].formatter" :label="objectColumns['category'].label" :prop="objectColumns['category'].name"></el-table-column>
        
        <el-table-column :label="objectColumns['brand'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['brand'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['explain'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['explain'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['unit'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['unit'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['qty'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['qty'].name]}}</span>
          </template>
        </el-table-column>

      <!--  <el-table-column :label="objectColumns['price'].label" width="160">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['price'].name]}}</span>
            <el-button type="primary" @click="makeSectionPrice(scope.row[objectColumns['lineNum'].name],scope.row[objectColumns['priceList'].name])" size="mini">分段价格</el-button>
            <span style="display:none;">{{scope.row[objectColumns['priceList'].name]}}</span>
          </template>
        </el-table-column>-->

        <el-table-column :label="objectColumns['minOrderQty'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['minOrderQty'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['maxOrderQty'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['maxOrderQty'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['itemNumber'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['itemNumber'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['remark'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['remark'].name]}}</span>
          </template>
        </el-table-column>

    </el-table>
  </div>
</template>

<script>
import treeSelect from '../../components/tree-select/tree.vue'
import { DateFormat, trimSpace, isPositiveinteger, isPositivenumber } from '../../utils/util.js'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
export default {
  mixins: [ColumnFormatterMixin],
  data () {
    var validateRequired = (rule, value, callback) => {
      if (value === undefined || trimSpace(value) === '') {
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
      buttonDisabled: false,
      form: {},
      lineform: {},
      list: {},
      object: {},
      objectColumns: {},
      dialogVisible: false,
      priceColumns: {},
      dialogPriceVisible: false,
      priceList: [],
      codeOptions: [],
      effectiveOptions: [],
      labelPosition: 'right',
      rules: {
        productId: [
          { required: true, message: '该输入项为必输项' },
          { validator: validateRequired, trigger: 'change' }
        ],
        qty: [
          { required: true, message: '该输入项为必输项' },
          { validator: validatePositiveinteger, trigger: 'change' },
          { validator: validatePositiveinteger, trigger: 'blur' }
        ],
        price: [
          { required: true, message: '该输入项为必输项' },
          { validator: validatePositivenumber, trigger: 'change' },
          { validator: validatePositivenumber, trigger: 'blur' }
        ]
      },
      selectedLines: [],
      selectedPrices: [],
      lineNum: null,
      itemId: null,
      productName: ''
    }
  },
  components: {
    InquirySheetForm: function index (resolve) {
      require(['./InquirySheetForm.vue'], resolve)
    },
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
    },
    'tree-selected': function index (resolve) {
      require(['../../components/TreeSelected.vue'], resolve)
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
  props: {
    mate: Object
  },
  created () {
    var vm = this
    this.formatterBefore(this.mate.mateList.columns)
    this.form = this.mate.mateFormerHeader
    this.form.values.companyId = this.mate.companyName
    this.lineform = this.mate.mateFormerLine
    this.lineform.fields.map((i) => { this.object[i.name] = i })
    this.list = this.mate.mateList
    this.list.columns.map((i) => { this.objectColumns[i.name] = i })
    this.mate.priceList.columns.map((i) => { this.priceColumns[i.name] = i })
    this.effectiveOptions = [{ value: '1', label: '有效' }, { value: '2', label: '无效' }]
    this.getMaterial()// 获取产品名称
  },
  methods: {
    add () {
      this.dialogVisible = true
    },
    edit () {
      var vm = this
      var rows = this.selectedLines
      if (rows.length !== 1) {
        vm.$message({
          message: this.$t('seladata'),
          type: 'warning'
        })
        return
      } else {
        this.dialogVisible = true
        for (var m = 0; m < this.mate.mateList.rows.length; m++) {
          if (this.mate.mateList.rows[m].lineNum === this.selectedLines[this.selectedLines.length - 1].lineNum) {
            this.mate.mateFormerLine.values = Object.assign({}, this.mate.mateList.rows[m])
            return true
          }
        }
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
        var tmpRows = []
        for (var i = 0; i < this.list.rows.length; i++) {
          var isSame = 'no'
          for (var j = 0; j < rows.length; j++) {
            if (this.list.rows[i].lineNum === rows[j].lineNum) {
              isSame = 'yes'
              break
            }
          }

          if (isSame === 'no') {
            tmpRows.push({
              id: this.list.rows[i].id, itemId: this.list.rows[i].itemId, productId: this.list.rows[i].productId, productName: this.list.rows[i].productName, productCode: this.list.rows[i].productCode, category: this.list.rows[i].category, brand: this.list.rows[i].brand, explain: this.list.rows[i].explain,
              brand: this.list.rows[i].brand, explain: this.list.rows[i].explain, unit: this.list.rows[i].unit, qty: this.list.rows[i].qty, price: this.list.rows[i].price, priceList: this.list.rows[i].priceList,
              minOrderQty: this.list.rows[i].minOrderQty, maxOrderQty: this.list.rows[i].maxOrderQty, itemNumber: this.list.rows[i].itemNumber, remark: this.list.rows[i].remark
            })
          }
        }

        this.list.rows = []

        for (var z = 0; z < tmpRows.length; z++) {
          this.list.rows.push({
            id: tmpRows[z].id, lineNum: z + 1, itemId: tmpRows[z].itemId, productId: tmpRows[z].productId, productName: tmpRows[z].productName, productCode: tmpRows[z].productCode, category: tmpRows[z].category, brand: tmpRows[z].brand, explain: tmpRows[z].explain,
            brand: tmpRows[z].brand, explain: tmpRows[z].explain, unit: tmpRows[z].unit, qty: tmpRows[z].qty, price: tmpRows[z].price, priceList: tmpRows[z].priceList,
            minOrderQty: tmpRows[z].minOrderQty, maxOrderQty: tmpRows[z].maxOrderQty, itemNumber: tmpRows[z].itemNumber, remark: tmpRows[z].remark
          })
        }
      }
    },
    resetForm (formName) {
      this.$refs.InquirySheetForm.$refs['ruleForm'].resetFields()
    },
    dlgConfirm () {
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

      if (this.lineform.values[this.object['lineNum'].name] === undefined || trimSpace(this.lineform.values[this.object['lineNum'].name]) === '') {
        this.list.rows.push({
          id: null, lineNum: this.list.rows.length + 1, itemId: this.itemId, productId: this.lineform.values[this.object['productId'].name], productCode: this.productCode, productName: this.lineform.values[this.object['productName'].name], category: this.lineform.values[this.object['category'].name],
          brand: this.lineform.values[this.object['brand'].name], explain: this.lineform.values[this.object['explain'].name], unit: this.lineform.values[this.object['unit'].name],
          qty: this.lineform.values[this.object['qty'].name], price: this.lineform.values[this.object['price'].name], priceList: null, minOrderQty: this.lineform.values[this.object['minOrderQty'].name],
          maxOrderQty: this.lineform.values[this.object['maxOrderQty'].name], itemNumber: this.lineform.values[this.object['itemNumber'].name], remark: this.lineform.values[this.object['remark'].name]
        })
      } else {
        for (var i = 0; i < this.mate.mateList.rows.length; i++) {
          if (this.mate.mateFormerLine.values.lineNum === this.mate.mateList.rows[i].lineNum) {
            const mateFormerValues1 = Object.assign({}, this.mate.mateFormerLine.values)
                // splice将i行数据删除，并将mateFormerValues1填充进
            if (this.mate.mateFormerLine.values.productId === this.mate.mateList.rows[i].productId) {
              this.mate.mateList.rows.splice(i, 1, mateFormerValues1)
            } else {
              this.mate.mateList.rows.splice(i, 1, mateFormerValues1)
              this.$set(this.mate.mateList.rows[i], 'productName', this.productName)
            }
            this.dialogFormVisible = false
            this.mate.mateFormerLine.values = {}
          }
        }
      }
      this.$refs['ruleForm'].resetFields()
      for (var idx in this.lineform.values) {
        this.lineform.values[idx] = null
      }
      this.lineform.values[this.object['lineNum'].name] = ''
      this.dialogVisible = false
    },
    dlgCancel () {
      this.$refs['ruleForm'].resetFields()
      for (var idx in this.lineform.values) {
        this.lineform.values[idx] = null
      }
      this.lineform.values[this.object['lineNum'].name] = ''
      this.dialogVisible = false
    },
    dlgClose () {
      this.$refs['ruleForm'].resetFields()
      for (var idx in this.lineform.values) {
        this.lineform.values[idx] = null
      }
      this.lineform.values[this.object['lineNum'].name] = ''
      this.dialogVisible = false
    },
    lineSelected (val) {
      this.selectedLines = val
    },
    handleSubmit () {
      this.buttonDisabled = true
      var mate = {}
      var vm = this

      var ruleRes = ''
      this.$refs.InquirySheetForm.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          ruleRes = 'no'
        }
      })

      if (ruleRes === 'no') {
        vm.$message({
          message: this.$t('Data Check No Pass'),
          type: 'warning'
        })
        this.buttonDisabled = false
        return
      }

      if (this.list.rows.length === 0) {
        vm.$message({
          message: this.$t('Detailed data can not be empty'),
          type: 'warning'
        })
        this.buttonDisabled = false
        return
      }

      this.form.values.expire = DateFormat(this.form.values.expire, 'yyyy-MM-dd')
      this.form.values.createAt = DateFormat(this.form.values.createAt, 'yyyy-MM-dd HH:mm:ss')
      this.form.values.auditDate = DateFormat(this.form.values.auditDate, 'yyyy-MM-dd')
      this.form.values.dateFrom = DateFormat(this.form.values.dateFrom, 'yyyy-MM-dd')
      this.form.values.dateTo = DateFormat(this.form.values.dateTo, 'yyyy-MM-dd')
      this.form.values.companyId = null
      mate.mateFormerHeader = this.form.values
      mate.mateList = this.list.rows

      if (this.mate.mateFormerHeader.method === 'POST') {
        this.$root.ajaxData('/purchase/inquiry/sheet/batchSave', mate, function () {
          vm.$root.monitor({ url: '/purchase/inquiry/sheet/all/list' })
        }, 'POST')
      } else {
        this.$root.ajaxData('/purchase/inquiry/sheet/batchUpdate' + '/' + mate.mateFormerHeader.id, mate, function () {
          vm.$root.monitor({ url: '/purchase/inquiry/sheet/all/list' })
        }, 'PUT')
      }
    },
    backward () {
      this.$root.monitor({ url: '/purchase/inquiry/sheet/all/list' })
    },
    changeCode (value) {
      var vm = this
      try {
        var obj = this.codeOptions.find((item) => {
          return item.value === value
        })
        this.itemId = obj.value
        this.lineform.values.unit = obj.unit
        this.lineform.values.productName = obj.name
        this.lineform.values.explain = obj.specification
        this.lineform.values.category = obj.category
        // this.lineform.values.qty = obj.qty
        this.productCode = obj.label
      } catch (e) {
      }
    },
    getMaterial () {
      var vm = this
      vm.codeOptions = []
       // /purchase/reqPurchase/getInquery
      this.$root.ajaxData('/materials?dataOnly=true&&status=1&&nopaging=true', {}, function (data) {
        for (let i = 0; i < data.length; i++) {
          vm.codeOptions.push({ label: data[i].subcode, value: data[i].id, unit: data[i].basicUnit, name: data[i].name, specification: data[i].basicSpec, category: data[i].materialCatgsName, qty: data[i].qty })
        }
      }, 'GET')
    },
    makeSectionPrice (lineNum, priceList) {
      this.lineNum = lineNum

      if (priceList === undefined || priceList === null || trimSpace(priceList) === '') {
        this.priceList = []
      } else {
        var obj = JSON.parse(priceList)
        this.priceList = obj.priceList
      }

      this.dialogPriceVisible = true
    },
    dlgPriceCancel () {
      this.dialogPriceVisible = false
    },
    addPrice () {
      this.priceList.push({
        id: null, lineNum: this.priceList.length + 1, qty: null, price: null, orgId: null, acceptGoodsSide: null, discount: null,
        dateFrom: null, dateTo: null, effective: null, breakNumber: null
      })
    },
    delPrice () {
      var vm = this
      var rows = this.selectedPrices
      if (rows.length === 0) {
        vm.$message({
          message: this.$t('selmdata'),
          type: 'warning'
        })
        return
      } else {
        var tmpRows = []
        for (var i = 0; i < this.priceList.length; i++) {
          var isSame = 'no'
          for (var j = 0; j < rows.length; j++) {
            if (this.priceList[i].lineNum === rows[j].lineNum) {
              isSame = 'yes'
              break
            }
          }

          if (isSame === 'no') {
            tmpRows.push({
              id: this.priceList[i].id, qty: this.priceList[i].qty, price: this.priceList[i].price, orgId: this.priceList[i].orgId, acceptGoodsSide: this.priceList[i].acceptGoodsSide,
              discount: this.priceList[i].discount, dateFrom: this.priceList[i].dateFrom, dateTo: this.priceList[i].dateTo, effective: this.priceList[i].effective, breakNumber: this.priceList[i].breakNumber
            })
          }
        }

        this.priceList = []

        for (var z = 0; z < tmpRows.length; z++) {
          this.priceList.push({
            id: tmpRows[z].id, lineNum: z + 1, qty: tmpRows[z].qty, price: tmpRows[z].price, orgId: tmpRows[z].orgId, acceptGoodsSide: tmpRows[z].acceptGoodsSide,
            discount: tmpRows[z].discount, dateFrom: tmpRows[z].dateFrom, dateTo: tmpRows[z].dateTo, effective: tmpRows[z].effective, breakNumber: tmpRows[z].breakNumber
          })
        }
      }
    },
    priceSelected (val) {
      this.selectedPrices = val
    },
    dlgPriceConfirm () {
      var vm = this
      if (this.priceList.length === 0) {
        vm.$message({
          message: this.$t('分段价格列表不能为空'),
          type: 'warning'
        })
        return
      }

      var chkmsg = ''
      for (var i = 0; i < this.priceList.length; i++) {
        if (this.priceList[i].qty === undefined || this.priceList[i].qty === null || trimSpace(this.priceList[i].qty) === '') {
          chkmsg = '第' + this.priceList[i].lineNum + '行的数量不能为空'
          break
        }
        if (!isPositiveinteger(this.priceList[i].qty)) {
          chkmsg = '第' + this.priceList[i].lineNum + '行的数量必须为正整数'
          break
        }
        if (this.priceList[i].price === undefined || this.priceList[i].price === null || trimSpace(this.priceList[i].price) === '') {
          chkmsg = '第' + this.priceList[i].lineNum + '行的价格不能为空'
          break
        }
        if (!isPositivenumber(this.priceList[i].price)) {
          chkmsg = '第' + this.priceList[i].lineNum + '行的价格必须为正数'
          break
        }
        if (this.priceList[i].orgId === undefined || this.priceList[i].orgId === null || trimSpace(this.priceList[i].orgId) === '') {
          chkmsg = '第' + this.priceList[i].lineNum + '行的库存组织不能为空'
          break
        }
        if (this.priceList[i].acceptGoodsSide === undefined || this.priceList[i].acceptGoodsSide === null || trimSpace(this.priceList[i].acceptGoodsSide) === '') {
          chkmsg = '第' + this.priceList[i].lineNum + '行的收货方不能为空'
          break
        }
        if (this.priceList[i].dateFrom === undefined || this.priceList[i].dateFrom === null || trimSpace(this.priceList[i].dateFrom) === '') {
          chkmsg = '第' + this.priceList[i].lineNum + '行的有效日期from不能为空'
          break
        }
        if (this.priceList[i].dateTo === undefined || this.priceList[i].dateTo === null || trimSpace(this.priceList[i].dateTo) === '') {
          chkmsg = '第' + this.priceList[i].lineNum + '行的有效日期to不能为空'
          break
        }
        if (this.priceList[i].dateFrom > this.priceList[i].dateTo) {
          chkmsg = '第' + this.priceList[i].lineNum + '行的有效日期from不能大于有效日期to'
          break
        }
        if (this.priceList[i].effective === undefined || this.priceList[i].effective === null || trimSpace(this.priceList[i].effective) === '') {
          chkmsg = '第' + this.priceList[i].lineNum + '行的状态不能为空'
          break
        }
        this.priceList[i].dateFrom = DateFormat(this.priceList[i].dateFrom, 'yyyy-MM-dd')
        this.priceList[i].dateTo = DateFormat(this.priceList[i].dateTo, 'yyyy-MM-dd')
      }

      if (chkmsg !== '') {
        vm.$message({
          message: chkmsg,
          type: 'warning'
        })
        return
      }

      var obj = {}
      obj.priceList = this.priceList

      var idx = parseInt(this.lineNum) - 1
      this.list.rows[idx].priceList = JSON.stringify(obj)
      this.dialogPriceVisible = false
    }
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
.fbutton{
  margin-top:30px;
  margin-bottom:10px;
}
.sbutton{
  margin-top:50px;
}
.tbutton{
  margin: 20px 0
}
</style>
