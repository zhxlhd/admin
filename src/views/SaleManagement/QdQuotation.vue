<template>
  <div>
     <div class="tbutton">
      <el-button type="primary" plain class="el-icon-document" @click="handleSubmit">提 交</el-button>
      <el-button type="warning" plain class="el-icon-close" @click="backward">取 消</el-button>
      <el-button type="danger"  plain class="el-icon-date"  @click="resetForm('QuotationSheetForm')">重 置</el-button>
    </div>

    <QdQuotationForm :mate="form" ref="QuotationSheetForm"></QdQuotationForm>
    <!--下面的KTable用于新增，下面的el-table用于修改 -->
    <KTable :mate="mate.mateList" @actionSelected="handleSelected" class="KTable-margin-top" @handleAction="handleAction" @action="handleKtable"></KTable>
    
   
    <el-dialog title="填写报价明细单" width="80%" :visible.sync="dialogFormVisible">
      <el-row>
        <el-form :model="mate.mateFormer.values" :label-position="labelPosition" ref="ruleForm" :rules="rules" :label-width="labelWidth">
          
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['productCode'].label" :prop="dialogObject['productCode'].name" >
              <el-select clearable @visible-change="visibleChangeCode" @change="changeCode" v-model="mate.mateFormer.values[dialogObject['productCode'].name]" filterable placeholder="请选择">
                <el-option v-for="item in dialogObject['productCode'].options" :key="item.value" :label="item.label" :value="item.value">
                   <span style="float: left;margin-right:30px">{{ item.label }}</span>
                    <span style="float: right; color:#212121; font-size: 13px">{{ item.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['productName'].label" :prop="dialogObject['productName'].name" >
              <el-input readonly v-model="mate.mateFormer.values[dialogObject['productName'].name]"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['category'].label" :prop="dialogObject['category'].name" >
              <el-input readonly v-model="mate.mateFormer.values[dialogObject['category'].name]"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['explain'].label" :prop="dialogObject['explain'].name">
              <el-input :readonly="true" v-model="mate.mateFormer.values[dialogObject['explain'].name]"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['brand'].label" :prop="dialogObject['brand'].name">
              <el-input v-model="mate.mateFormer.values[dialogObject['brand'].name]"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['unit'].label" :prop="dialogObject['unit'].name">
              <el-input readonly v-model="mate.mateFormer.values[dialogObject['unit'].name]"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['priceTax'].label" :prop="dialogObject['priceTax'].name">
              <el-input type="number"  @change="blurPricetax" v-model="mate.mateFormer.values[dialogObject['priceTax'].name]"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['price'].label" :prop="dialogObject['price'].name">
              <el-input type="number" readonly v-model="mate.mateFormer.values[dialogObject['price'].name]"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['minOrderQty'].label" :prop="dialogObject['minOrderQty'].name">
              <el-input type="number" v-model="mate.mateFormer.values[dialogObject['minOrderQty'].name]"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['maxOrderQty'].label" :prop="dialogObject['maxOrderQty'].name">
              <el-input type="number" v-model="mate.mateFormer.values[dialogObject['maxOrderQty'].name]"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['itemNumber'].label" :prop="dialogObject['itemNumber'].name">
              <el-input v-model="mate.mateFormer.values[dialogObject['itemNumber'].name]"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['remark'].label" :prop="dialogObject['remark'].name">
              <el-input v-model="mate.mateFormer.values[dialogObject['remark'].name]"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="button">
        <el-button type="primary" @click="dialogSubmit">确 定</el-button>
        <el-button @click="dialogBackward">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="填写分段价格" :visible.sync="dialogPriceVisible" width="80%">
      <el-button type="primary" @click="addPrice" >新 增</el-button>
      <el-button @click="delPrice" :disabled="priceCancelDisabled">删 除</el-button>
      <el-table :data="priceList" @selection-change="handleSelected" border fit highlight-current-row style="width: 100%;margin-top:10px;">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column :label="priceColumns['lineNum'].label" width="60">
            <template slot-scope="scope">
              <span>{{scope.row[priceColumns['lineNum'].name]}}</span>
            </template>
          </el-table-column>

          <el-table-column :label="priceColumns['qtyFrom'].label" >
            <template slot-scope="scope">
              <el-input type="number" size="mini" v-model="scope.row[priceColumns['qtyFrom'].name]"></el-input>
            </template>
          </el-table-column>

           <el-table-column :label="priceColumns['qtyTo'].label" >
            <template slot-scope="scope">
              <el-input type="number" size="mini" v-model="scope.row[priceColumns['qtyTo'].name]"></el-input>
            </template>
          </el-table-column>

          <el-table-column :label="priceColumns['priceTax'].label">
            <template slot-scope="scope">
              <el-input type="number" size="mini" v-model="scope.row[priceColumns['priceTax'].name]"></el-input>
            </template>
          </el-table-column>
          
          <el-table-column :label="priceColumns['price'].label" >
            <template slot-scope="scope">
              <el-input readonly size="mini" v-model="scope.row[priceColumns['price'].name]"></el-input>
            </template>
          </el-table-column>

          <el-table-column :label="priceColumns['orgId'].label">
            <template slot-scope="scope">
              <tree-select
              :removeUrl="priceColumns['orgId'].removeUrl"
              :treeProps="priceColumns['orgId'].treeProps"
              v-model="scope.row[priceColumns['orgId'].name]"
              :multiple="false"
              :placeholder="priceColumns['orgId'].placeholder"
              ></tree-select>
            </template>
          </el-table-column>

           <el-table-column :label="priceColumns['discount'].label" >
             <template slot-scope="scope">
               <el-input readonly size="mini" v-model="scope.row[priceColumns['discount'].name]"></el-input>
             </template>
           </el-table-column>

          <el-table-column :label="priceColumns['dateFrom'].label" >
            <template slot-scope="scope">
              <el-date-picker type="date" v-model="scope.row[priceColumns['dateFrom'].name]" :editable="false"></el-date-picker>
            </template>
          </el-table-column>

          <el-table-column :label="priceColumns['dateTo'].label" >
            <template slot-scope="scope">
              <el-date-picker type="date" v-model="scope.row[priceColumns['dateTo'].name]" :editable="false"></el-date-picker>
            </template>
          </el-table-column>

      </el-table>
      <div class="sbutton">
        <el-button @click="dlgPriceConfirm" type="primary">提 交</el-button>
        <el-button @click="dlgPriceCancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import treeSelect from '../../components/tree-select/tree.vue'
import { DateFormat } from '../../utils/util.js'
// 将小数保留2位
function toDecimal (x) {
  var f = parseFloat(x)
  if (isNaN(f)) {
    return
  }
  f = Math.round(x * 100) / 100
  return f
}
// 将小数转为百分数
function toPercent (point) {
  var str = Number(point * 100).toFixed(1)
  return str
}
export default{
  components: {
    QdQuotationForm: function index (resolve) {
      require(['./QdQuotationForm.vue'], resolve)
    },
    KTable: function index (resolve) {
      require(['../../components/KTable.vue'], resolve)
    },
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
    },
    'tree-selected': function index (resolve) {
      require(['../../components/TreeSelected.vue'], resolve)
    },
    treeSelect
  },
  props: {
    mate: Object
  },
  data () {
    return {
      object: {},              // // 用来代替从父组件总获取到的数据 mate.mateList.columns
      isKtable: true,
      form: {},
      dialogFormVisible: false,
      dialogObject: {},
      btn: {},
      row: {},
      labelPosition: 'right',
      productCodeData: {},                // 产品编号的数据
      multipleSelection: [],
      selectedIds: [],
      priceColumns: {},
      dialogPriceVisible: false,             // 分段价格弹出框按钮,
      priceCancelDisabled: true,             // 分段删除按钮，时候可用状态
      selectedVal: [],                // 分段价格选取的整行数据
      priceList: [],                         // 在明细表中，用来存放分段价格的数据
      rowLineNum: '',                        // 获取到分段中，是第几行
      productCodeName: '',                   // 放产品编码的中文值
      orgData: [],                           // 组织的数据
      orgName: [],                           // 组织的名称
      rules: {
        productCode: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ]
      },
      itemId: ''
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
        width = '120px'
      } else if (this.mate.labelWidth === null) {
        width = '100px'
      } else {
        width = this.mate.labelWidth
      }
      return width
    }
  },
  watch: {
    priceList: {
      handler: function (val, old) {
        var tax = this.mate.mateFormerHeader.values.tax
        var price = this.mate.mateList.rows[this.rowLineNum - 1].priceTax
        for (var i = 0; i < val.length; i++) {
          val[i].price = toDecimal(val[i].priceTax / (1 + tax / 100))
          var discount1 = toDecimal((price - val[i].priceTax) / price)
          var discount2 = toPercent(discount1)
          val[i].discount = discount2
        }
      },
      deep: true
    },
    form: {
      handler: function (val) {
        var tax = this.form.values.tax
        var priceTax
        var price
        for (var i = 0; i < this.mate.mateList.rows.length; i++) {
          priceTax = this.mate.mateList.rows[i].priceTax
          price = priceTax / (1 + tax / 100)
          this.mate.mateList.rows[i].price = toDecimal(price)
        }
      },
      deep: true
    }
  },
  created () {
    // let vm = this
    this.form = this.mate.mateFormerHeader
    this.mate.mateList.columns.map((i) => { this.object[i.name] = i })
    this.mate.mateFormer.fields.map((i) => { this.dialogObject[i.name] = i })
    this.mate.priceList.columns.map((i) => { this.priceColumns[i.name] = i })
    if (this.mate.mateFormerHeader.values.id) {
      this.isKtable = false
    }
    // this.$root.ajaxData('/offices/tree/list?cols=id,name,pid&dataOnly=true', {}, function (data) {
    //   vm.orgData = data
    // }, 'GET')
  },
  methods: {
    handleKtable (btn, row) {
      this.row = row
      this.btn = btn
      if (this.btn.action === 'addDetailBill') {
        // 新增
        this.dialogFormVisible = true
      } else if (this.btn.action === 'updataDetailBill') {
        // 修改
        this.dialogFormVisible = true
        // 对于每一行进行判断,获取其中最后的一个数字
        for (var m = 0; m < this.mate.mateList.rows.length; m++) {
          if (this.mate.mateList.rows[m].lineNum === this.selectedIds[this.selectedIds.length - 1]) {
            this.mate.mateFormer.values = Object.assign({}, this.mate.mateList.rows[m])
            return true
          }
        }
      } else if (this.btn.action === 'deleteQuotation') {
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
    resetForm (formName) {
      this.$refs.QuotationSheetForm.$refs['ruleForm'].resetFields()
    },
    // 提交
    handleSubmit (ev) {
      var vm = this
      var mate = {}
      // 对其进行校验
      this.$refs.QuotationSheetForm.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.mate.mateFormerHeader.values.replyDate = DateFormat(this.mate.mateFormerHeader.values.replyDate, 'yyyy-MM-dd')
          this.mate.mateFormerHeader.values.auditDate = DateFormat(this.mate.mateFormerHeader.values.auditDate, 'yyyy-MM-dd')
          this.mate.mateFormerHeader.values.dateFrom = DateFormat(this.mate.mateFormerHeader.values.dateFrom, 'yyyy-MM-dd')
          this.mate.mateFormerHeader.values.dateTo = DateFormat(this.mate.mateFormerHeader.values.dateTo, 'yyyy-MM-dd')
          mate.mateFormerHeader = this.mate.mateFormerHeader.values
          mate.mateList = this.mate.mateList.rows
          // 修改
          if (this.mate.mateFormerHeader.method === 'PUT' && this.mate.mateFormerHeader.values.id) {
            this.$root.ajaxData('/purchase/quotation/sheet/batchUpdate/' + this.mate.mateFormerHeader.values.id, mate, function () {
              vm.$root.monitor({ url: '/purchase/quotation/sheet/all/list' })
            }, 'PUT')
            // 新增
          } else if (this.mate.mateFormerHeader.method === 'POST') {
            this.$root.ajaxData('/purchase/quotation/sheet/batchSave', mate, function () {
              vm.$root.monitor({ url: '/purchase/quotation/sheet/all/list' })
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
      this.$root.monitor({ url: '/purchase/quotation/sheet/all/list' })
    },
    // 弹出框提交
    dialogSubmit () {
      // 判断获取到的数据中是否有lineNum属性，该属性在对应的数据库表中没有
      // 将中文加进去
      this.mate.mateFormer.values.productCodeName = this.productCodeName
      this.mate.mateFormer.values.itemId = this.itemId
      if (typeof this.mate.mateFormer.values.lineNum === 'undefined') {
        this.mate.mateFormer.values.lineNum = (this.mate.mateList.rows.length + 1)
        // 拷贝
        const mateFormerValues = Object.assign({}, this.mate.mateFormer.values)
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.mate.mateList.rows.push(mateFormerValues)
            this.dialogFormVisible = false
            // 清空数据
            this.mate.mateFormer.values = {}
            // this.$refs['ruleForm'].resetFields()
          } else {
            this.$notify.error({
              title: '消息',
              message: '数据验证未通过'
            })
            this.dialogFormVisible = true
          }
        })
      } else {
        for (var i = 0; i < this.mate.mateList.rows.length; i++) {
          if (this.mate.mateFormer.values.lineNum === this.mate.mateList.rows[i].lineNum) {
            const mateFormerValues1 = Object.assign({}, this.mate.mateFormer.values)
            this.$refs.ruleForm.validate((valid) => {
              if (valid) {
                // splice将i行数据删除，并将mateFormerValues1填充进去
                this.mate.mateList.rows.splice(i, 1, mateFormerValues1)
                this.dialogFormVisible = false
                this.mate.mateFormer.values = {}
                // this.$refs['ruleForm'].resetFields
              } else {
                this.$notify.error({
                  title: '消息',
                  message: '数据验证未通过'
                })
                this.dialogFormVisible = true
              }
            })
          }
        }
      }
    },
    blurPricetax () {
      var priceTax = this.mate.mateFormer.values.priceTax
      var tax = this.mate.mateFormerHeader.values.tax
      this.mate.mateFormer.values.price = toDecimal(priceTax / (1 + tax / 100))
    },
    dialogBackward () {
      // 清空数据
      this.dialogFormVisible = false
      this.mate.mateFormer.values = {}
    },
    // 产品编码
    visibleChangeCode (flag) {
      var vm = this
      vm.dialogObject['productCode'].options = []
      if (flag) {
        this.$root.ajaxData('/materials/getMaterialDropdownList', {}, function (data) {
          vm.productCodeData = data
          for (let i = 0; i < data.length; i++) {
            vm.dialogObject['productCode'].options.push({ 'label': data[i].subcode, 'value': data[i].subcode, 'name': data[i].name })
          }
        }, 'GET')
      }
    },
    // 产品编码改变时
    changeCode (val) {
      var vm = this
      for (let i = 0; i < this.productCodeData.length; i++) {
        if (this.productCodeData[i].subcode === val) {
          this.$root.ajaxData('/materials/getCatgs/' + this.productCodeData[i].id, {}, function (data) {
            vm.mate.mateFormer.values[vm.dialogObject['category'].name] = data.materialCatgsName
          })
        }
        this.mate.mateFormer.values[this.dialogObject['productName'].name] = this.productCodeData[i].name
        this.mate.mateFormer.values[this.dialogObject['unit'].name] = this.productCodeData[i].unit
        this.mate.mateFormer.values[this.dialogObject['explain'].name] = this.productCodeData[i].specification
        this.productCodeName = this.productCodeData[i].subcode
        this.itemId = this.productCodeData[i].id
      }
    },
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
    handleAction (act, row) {
      // 获取到是明细行的第几行s
      this.rowLineNum = row.lineNum
      // 本来获取到的priceList为null，现将其转为数组
      if (row.priceList === null || row.priceList === undefined || row.priceList === [] || row.priceList === '') {
        this.priceList = []
      } else {
        this.priceList = row.priceList
      }
      // 分段删除按钮，当priceList有值时，可用
      if (this.priceList.length > 0) {
        this.priceCancelDisabled = false
      }
      if (this.priceList.length === 0) {
        this.priceList.push({
          lineNum: this.priceList.length + 1,
          priceTax: this.mate.mateList.rows[this.rowLineNum - 1].priceTax,
          price: this.mate.mateList.rows[this.rowLineNum - 1].price,
          effective: '1',
          qtyFrom: '1'
        })
      }
      this.dialogPriceVisible = true
    },
    // 分段价格新增
    addPrice () {
      if (this.priceList.length === 0) {
        this.priceList.push({
          lineNum: this.priceList.length + 1,
          effective: '1'
        })
      }
      if (this.priceList.length > 0) {
        this.priceList.push({
          id: null,
          lineNum: this.priceList.length + 1,
          priceTax: this.priceList[this.priceList.length - 1].priceTax,
          orgId: this.priceList[this.priceList.length - 1].orgId,
          acceptGoodsSide: this.priceList[this.priceList.length - 1].acceptGoodsSide,
          dateFrom: this.priceList[this.priceList.length - 1].dateFrom,
          dateTo: this.priceList[this.priceList.length - 1].dateTo,
          effective: '1'
        })
      }
      if (this.priceList.length > 0) {
        this.priceCancelDisabled = false
      }
    },
    // 分段价格删除
    delPrice () {
      for (var i = 0; i < this.priceList.length; i++) {
        for (var j = 0; j < this.priceList.length; j++) {
          if (this.priceList[i].lineNum === this.selectedIds[j]) {
            this.priceList.splice(i, 1)
          }
        }
        for (var m = 0; m < this.priceList.length; m++) {
          this.priceList[m].lineNum = m + 1
        }
      }
    },
    // 分段提交
    dlgPriceConfirm () {
      // var vm = this
      if (this.priceList.length === 0) {
        this.$message({
          message: this.$t('分段价格列表不能为空'),
          type: 'warning'
        })
        return
      }
      // 格式化每一行的日期 /offices/tree/list?cols=id,name,pid&dataOnly=true
      for (var i = 0; i < this.priceList.length; i++) {
        this.priceList[i].dateFrom = DateFormat(this.priceList[i].dateFrom, 'yyyy-MM-dd')
        this.priceList[i].dateTo = DateFormat(this.priceList[i].dateTo, 'yyyy-MM-dd')
        // 将priceList里面的orgId获取，并且得到orgName
        // this.priceList[i].orgName = this.getOrgName(this.priceList[i].orgId)
      }
      this.mate.mateList.rows[this.rowLineNum - 1].priceList = this.priceList
      this.dialogPriceVisible = false
    },
    // 分段取消
    dlgPriceCancel () {
      this.dialogPriceVisible = false
      // for (var i = 0; i < this.mate.mateList.rows.length; i++) {
      //   if (this.mate.mateList.rows[i].priceList === []) {
      //     this.mate.mateList.rows[i].priceList = ''
      //   }
      // }
    }
  }
}
</script>

<style scoped>
.el-form-item__label{
  line-height:inherit
}
.KTable-margin-top{
  margin-top:20px;
}
.button1{
  margin-top:20px;
}
.el-form-item {
    margin: 15px 20px 2px 0px;
}
.button{
  margin-top:20px;
}
.table-margin{
  margin-top:20px;
}
.sbutton{
  margin-top: 15px;
}
 .tbutton{
     margin: 20px 0
  }
</style>
