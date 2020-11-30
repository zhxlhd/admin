<!-- 销售订单 -->
<template>
  <div>
     <div class="tbutton">
      <el-button plain size="mini" class="el-icon-document" :disabled="buttonDisabled" @click="handleSubmit">提 交</el-button>
      <el-button plain size="mini" class="el-icon-close" @click="backward">取 消</el-button>
      <el-button plain size="mini" class="el-icon-date"  @click="resetForm('SaleOrderForm')">重 置</el-button>
    </div>
    <SaleOrderForm :flagState="flagState" :mate="mate.mateFormerHeader" ref="SaleOrderForm"></SaleOrderForm>
    <KTable :mate="mate.mateList" @actionSelected="handleSelected" class="KTable-margin-top" @handleAction="handleAction" @action="handleKtable"></KTable>

    <el-dialog title="填写销售订单明细单" width="80%" :visible.sync="dialogFormVisible">
      <el-row>
        <el-form size="mini" :model="mate.mateFormer.values" :label-position="labelPosition" ref="ruleForm" :rules="rules" :label-width="labelWidth">

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['itemId'].label" :prop="dialogObject['itemId'].name" >
              <el-input v-model="mate.mateFormer.values['itemCode']" @change="changeMate">
                <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
              </el-input>
              <!-- <el-select clearable filterable  @change="changeItemId" @visible-change="visibleChangeItemId" v-model="mate.mateFormer.values['itemId']">
                <el-option v-for="item in dialogObject['itemId'].options" :key="item.value" :label="item.label" :value="item.value">
                  <span style="float: left;margin-right:30px">{{ item.label }}</span>
                    <span style="float: right; color:#212121; font-size: 13px">{{ item.name }}</span>
                </el-option>
              </el-select> -->
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['itemName'].label" :prop="dialogObject['itemName'].name" >
              <el-input disabled v-model="mate.mateFormer.values['itemName']"></el-input>
            </el-form-item>
          </el-col>

           <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['cusMaterialCode'].label" :prop="dialogObject['cusMaterialCode'].name" >
              <el-select clearable filterable  :disabled="showLine" v-model="mate.mateFormer.values['cusMaterialCode']" @change="changeCusCode">
                <el-option v-for="item in dialogObject['cusMaterialCode'].options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['cusMaterial'].label" :prop="dialogObject['cusMaterial'].name" >
              <el-input disabled v-model="mate.mateFormer.values['cusMaterial']"></el-input>
            </el-form-item>
          </el-col>

            <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['orgId'].label" :prop="dialogObject['orgId'].name" >
              <el-select clearable filterable v-model="mate.mateFormer.values['orgId']" @change="changLineOrgId">
                <el-option  v-for="item in orgOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['qty'].label" :prop="dialogObject['qty'].name" >
              <el-input :disabled="showDetial" @change="changeQty" type="number" @blur="qtyBlur(mate.mateFormer.values['qty'])" v-model="mate.mateFormer.values['qty']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['unit'].label" :prop="dialogObject['unit'].name" >
              <el-input disabled v-model="mate.mateFormer.values['unit']"></el-input>
            </el-form-item>
          </el-col>

            <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['tax'].label" :prop="dialogObject['tax'].name" >
              <dict-selected  rowId="0" v-model="mate.mateFormer.values['tax']" dictType="tax" :initValue="mate.mateFormer.values['tax']"></dict-selected>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['price'].label" :prop="dialogObject['price'].name" >
              <el-input :disabled="isInput" type="number" v-model="mate.mateFormer.values['price']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['requestDate'].label" :prop="dialogObject['requestDate'].name">
              <el-date-picker clearable type="date" v-model="mate.mateFormer.values['requestDate']"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['shipDate'].label" :prop="dialogObject['shipDate'].name">
              <el-date-picker :picker-options="pickerOptions" clearable type="date" v-model="mate.mateFormer.values['shipDate']"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['promiseDate'].label" :prop="dialogObject['promiseDate'].name">
              <el-date-picker clearable type="date" v-model="mate.mateFormer.values['promiseDate']"></el-date-picker>
            </el-form-item>
          </el-col>

           <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['onhandQty'].label" :prop="dialogObject['onhandQty'].name" >
              <el-input  disabled type="number" v-model="mate.mateFormer.values['onhandQty']"></el-input>
            </el-form-item>
          </el-col>

           <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['retainQty'].label" :prop="dialogObject['retainQty'].name" >
              <el-input  disabled type="number" v-model="mate.mateFormer.values['retainQty']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['returnReason'].label" :prop="dialogObject['returnReason'].name" >
              <el-input :disabled="returnReasonDisabled" v-model="mate.mateFormer.values['returnReason']"></el-input>
            </el-form-item>
          </el-col>
            
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['total'].label" :prop="dialogObject['total'].name" >
              <el-input disabled v-model="mate.mateFormer.values['total']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['remark'].label" :prop="dialogObject['remark'].name" >
              <el-input  v-model="mate.mateFormer.values['remark']"></el-input>
            </el-form-item>
          </el-col>
          <!-- 是否套料-->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['isJacking'].label" :prop="dialogObject['isJacking'].label">
              <el-radio-group v-model="mate.mateFormer.values['isJacking']">
                <el-radio label="0">否</el-radio>
                <el-radio label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!-- 是否需要备件-->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['isSpareParts'].label" :prop="dialogObject['isSpareParts'].label">
              <el-radio-group v-model="mate.mateFormer.values['isSpareParts']">
                <el-radio label="0">否</el-radio>
                <el-radio label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="tbutton">
        <el-button size="mini" @click="dialogSubmit">确 定</el-button>
        <el-button size="mini" @click="dialogBackward">取 消</el-button>
      </div>
    </el-dialog>
     <!-- 物料搜索框-->
    <MaterialSearch v-if="searchDialogVisible" :orgId="mate.mateFormerHeader.values['orgId']" :visible.sync="searchDialogVisible" @getMateInfo="getMateInfo"></MaterialSearch>

    <!-- <el-dialog title="分解" size="large" :visible.sync="dialogListDecompose">
      <el-table :data="decomposeData" border highlight-current-row>
        <el-table-column :label="object['num'].label" :prop="object['num'].name" :width="object['num'].width"></el-table-column>
        <el-table-column :label="object['itemCode'].label" :prop="object['itemCode'].name" :width="object['itemCode'].width"></el-table-column>
        <el-table-column :label="object['itemName'].label" :prop="object['itemName'].name" :width="object['itemName'].width"></el-table-column>
        <el-table-column :label="object['qty'].label" :prop="object['qty'].name" :width="object['qty'].width">
          <template scope="scope">
            <el-input @change="changeQtyTable" v-show="true" size="mini" v-model="scope.row[object['qty'].name]"></el-input>
        </template>
        </el-table-column>
        <el-table-column :label="object['unit'].label" :prop="object['unit'].name" :width="object['unit'].width"></el-table-column>
        <el-table-column :label="object['price'].label" :prop="object['price'].name" :width="object['price'].width"></el-table-column>
        <el-table-column :label="object['requestDate'].label" :prop="object['requestDate'].name" :width="object['requestDate'].width"></el-table-column>
        <el-table-column :label="object['shipDate'].label" :prop="object['shipDate'].name" :width="object['shipDate'].width"></el-table-column>
        <el-table-column :label="object['promiseDate'].label" :prop="object['promiseDate'].name" :width="object['promiseDate'].width"></el-table-column>
        <el-table-column :formatter="object['state'].formatter" :label="object['state'].label" :prop="object['state'].name" :width="object['state'].width"></el-table-column>
        <el-table-column :label="object['cancelQty'].label" :prop="object['cancelQty'].name" :width="object['cancelQty'].width"></el-table-column>
        <el-table-column :label="object['shippedQty'].label" :prop="object['shippedQty'].name" :width="object['shippedQty'].width"></el-table-column>
        <el-table-column :label="object['tax'].label" :prop="object['tax'].name" :width="object['tax'].width"></el-table-column>
        <el-table-column :label="object['returnReason'].label" :prop="object['returnReason'].name" :width="object['returnReason'].width"></el-table-column>
        <el-table-column :label="object['customerItemNum'].label" :prop="object['customerItemNum'].name" :width="object['customerItemNum'].width"></el-table-column>
        <el-table-column :label="object['total'].label" :prop="object['total'].name" :width="object['total'].width"></el-table-column>
      </el-table>
      <div class="button">
        <el-button type="primary" @click="dialogSubmitDecompose">确 定</el-button>
        <el-button @click="dialogBackwardDecompose">取 消</el-button>
      </div>
    </el-dialog> -->
    
  </div>
</template>

<script>
import treeSelect from '../../components/tree-select/tree.vue'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
import { DateFormat, isPositiveinteger, trimSpace } from '../../utils/util.js'
import Vue from 'vue'
import SERVICES from '@/services';

function toDecimal (x) {
  var f = parseFloat(x)
  if (isNaN(f)) {
    return
  }
  f = Math.round(x * 100) / 100
  return f
}
export default {
  mixins: [ColumnFormatterMixin],
  components: {
    KTable: function index (resolve) {
      require(['../../components/KTable.vue'], resolve)
    },
    SaleOrderForm: function index (resolve) {
      require(['./SaleOrderForm.vue'], resolve)
    },
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
    },
    'tree-selected': function index (resolve) {
      require(['../../components/TreeSelected.vue'], resolve)
    },
    MaterialSearch: function index (resolve) {
      require(['@/components/MaterialSearch.vue'], resolve)
    },
    treeSelect
  },
  props: {
    mate: Object
  },
  data () {
    var validateDate = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('该输入项为必输项'))
      } else if (value !== '') {
        callback()
      }
    }
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
    var validateReason = (rule, value, callback) => {
      if (this.mate.mateFormer.values['qty'] > 0) {
        callback()
      } else if (this.mate.mateFormer.values['qty'] < 0) {
        if (value === '') {
          callback(new Error('该输入项为必输项'))
        } else {
          callback()
        }
      } if (typeof this.mate.mateFormer.values['qty'] === 'undefined') {
        callback()
      }
    }
    return {
      buttonDisabled: false,
      object: {},              // // 用来代替从父组件总获取到的数据 mate.mateList.columns
      isKtable: true,
      dialogFormVisible: false,
      dialogObject: {},
      orgOption: [],
      btn: {},
      row: {},
      requestDateCopy: '',
      productCodeData: {},                // 产品编号的数据
      multipleSelection: [],
      selectedIds: [],
      priceColumns: {},
      selectedVal: [],                // 分段价格选取的整行数据
      priceList: [],                         // 在明细表中，用来存放分段价格的数据
      rowLineNum: '',                        // 获取到分段中，是第几行
      productCodeName: '',                   // 放产品编码的中文值
      materialsData: [],
      decomposeData: [],
      cusMaterialData: [],
      returnReasonDisabled: true,
      showDetial: false,
      showLine: false,
      dialogListDecompose: false,             // 分解弹出框
      decomposeNum: 0,
      rowsContent: [],
      labelPosition: 'right',
      rules: {
        itemId: [
          { type: 'string', required: true, message: '该输入项为必输项', trigger: 'change' }
        ],
        qty: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        // requestDate: [
        //   { validator: validateDate, trigger: 'blur' }
        // ],
        orgId: [{ required: true, message: '该输入项为必输项', trigger: 'blur' }],
        returnReason: [
          { validator: validateReason, trigger: 'blur' }
        ],
        shipDate: [
          { required: true, message: '该输入项为必输项', trigger: 'change' }
        ]
      },
      itemId: '',
      flagState: false,                      // 储存审批状态，判断是否可以修改
      pickerOptions: {
          disabledDate(time) {
            return DateFormat(time,'yyyy-MM-dd') < DateFormat(new Date(),'yyyy-MM-dd');
          }
      },
      searchDialogVisible: false,
      isInput: true,              // 销售单价输入框 是否置灰
    }
  },
  created () {
    // let vm = this
    var vm = this
    this.mate.mateList.columns.map((i) => { this.object[i.name] = i })
    this.mate.mateFormer.fields.map((i) => { this.dialogObject[i.name] = i })
    // this.mate.mateFormerHeader.values.orderDate = DateFormat(this.mate.mateFormerHeader.values.orderDate, 'yyyy-MM-dd')
    this.requestDateCopy = this.mate.mateFormer.values.requestDate
    // 将名字的数据复制到rowsContent中
    this.rowsContent = this.mate.mateList.rows
    if (this.mate.mateFormerHeader.values.state === '1') {
      this.flagState = true
    }
    for (var i = 0; i < this.mate.mateList.rows.length; i++) {
      this.mate.mateList.rows[i].returnQty = this.mate.mateList.rows[i].qty
    }
    // 参数设置 勾选 '销售订单是否允许手工输入价格'
    if (localStorage.getItem('allowInputPrice')) {
      this.isInput = false
    }
    // 去掉查看bom按钮
    this.mate.mateList.actions = [];
  },
  watch: {
    mate: function (newMate) {
      this.formatterBefore(this.mate.mateList.columns)
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
  methods: {
    // 获取销售单价
    getItemPrice () {
      const vm = this
      vm.dialogObject['cusMaterialCode'].options = []
   
      vm.cusMaterialData = []
      if (this.mate.mateFormer.values['itemId']) {
        const vm = this
        if (!this.mate.mateFormerHeader.values.showEdit) {
          this.$root.ajaxData('/purchase/smPrice/line/selectOneLine/' + this.mate.mateFormerHeader.values['smPriceHeaderId'] + '/' + this.mate.mateFormer.values['itemId'], {}, function (data) {
            if (data.price) {
            // 这是必填字段，要校验，需要用string类型，直接赋值会没有响应，需要用到set方法
              Vue.set(vm.mate.mateFormer.values, 'price', data.price)
            // 这个是客户料号，可选
            } else {
              vm.$message({
                message: vm.$t('priceList'),
                type: 'warning'
              })
            // vm.dialogFormVisible = false
              vm.mate.mateFormer.values['price'] = ''
              vm.mate.mateFormer.values['itemCode'] = ''
              vm.mate.mateFormer.values['cusMaterial'] = ''
              vm.mate.mateFormer.values['cusMaterialCode'] = ''
              vm.mate.mateFormer.values['itemName'] = ''
              vm.mate.mateFormer.values['unit'] = ''

              return
            }
          }, 'GET')
        }
        this.$root.ajaxData('/purchase/smItemCross/getCrossByCode/' + this.mate.mateFormerHeader.values['customerId'] + '/' + this.mate.mateFormer.values['itemId'], {}, function (data) {
          vm.cusMaterialData = data
          vm.cusMaterialData.forEach((i) => {
            vm.dialogObject['cusMaterialCode'].options.push({ label: i.cusItemCode + '  (' + i.cusItemName + ')', 'value': i.cusItemCode })
          })
        })
        this.$root.ajaxData('/inventory/onhand/quantity/getOnhandQty?itemIds=' + this.mate.mateFormer.values['itemId'], {}, function (data) {
          if (data.length === 0) {
            vm.$set(vm.mate.mateFormer.values, 'onhandQty', 0)
            vm.$set(vm.mate.mateFormer.values, 'retainQty', 0)
          } else if (data.length !== 0) {
            if (data[0].onhandQty === null) {
              vm.$set(vm.mate.mateFormer.values, 'onhandQty', 0)
            } else {
              vm.$set(vm.mate.mateFormer.values, 'onhandQty', data[0].onhandQty)
            }
            if (data[0].reservationQty === null) {
              vm.$set(vm.mate.mateFormer.values, 'retainQty', 0)
            } else {
              vm.$set(vm.mate.mateFormer.values, 'retainQty', data[0].reservationQty)
            }
          }
        })
      }
    },
    // 客户料号改变获取客户品名
    changeCusCode (val) {
      var vm = this
      if (val) {
        for (var i = 0; i < this.cusMaterialData.length; i++) {
          if (this.cusMaterialData[i].cusItemCode === val) {
            vm.$set(this.mate.mateFormer.values, 'cusMaterial', this.cusMaterialData[i].cusItemName)
          }
        }
      } else {
        vm.$set(this.mate.mateFormer.values, 'cusMaterial', '')
      }
    },
    changLineOrgId (val) {
      for (var i = 0; i < this.orgOption.length; i++) {
        if (val === this.orgOption[i].value) {
          this.mate.mateFormer.values.orgName = this.orgOption[i].label
        }
      }
    },
    // 产品编码改变时
    changeMate () {

      SERVICES.BASE.searchMaterials({
        subcode: this.mate.mateFormer.values['itemCode']
      }).then(
        res => {
          this.getMateInfo(res.data.mate.rows[0])
        }
      )
    },
    resetForm (formName) {
      this.$refs.SaleOrderForm.$refs['ruleForm'].resetFields()
    },
    changeQty (val) {
      this.mate.mateFormer.values['total'] = val * this.mate.mateFormer.values['price']
    },
    // 数量框失焦时,如果数量为负数，退货原因必填，否者不填
    qtyBlur (qty) {
      this.mate.mateFormer.values.qty = String(qty)
      if (this.mate.mateFormerHeader.values.soType === '2') {
        if (qty > 0) {
          this.$message({
            type: 'warning',
            message: this.$t('negative Numbers')
          })
          this.mate.mateFormerHeader.values.returnType = true
          return
        } else {
          this.returnReasonDisabled = false
          Vue.set(this.mate.mateFormer.values, 'returnReason', '')
          if (qty < this.mate.mateFormer.values.returnQty) {
            this.$message({
              type: 'warning',
              message: '可退货数量不足'
            })
            this.mate.mateFormerHeader.values.returnName = true
          } else {
            this.mate.mateFormerHeader.values.returnName = false
          }
          return
        }
      }
      if (qty < 0) {
        this.returnReasonDisabled = false
        Vue.set(this.mate.mateFormer.values, 'returnReason', '')
      } else {
        this.returnReasonDisabled = true
        // Vue.set(this.mate.mateFormer.values, 'returnReason', '--')
      }
    },
    // 获取产品编码
    getMaterials () {
      const vm = this
      this.$root.ajaxData('/materials/getMaterialDropdownList', {}, function (data) {
        vm.materialsData = data
        data.map((i) => {
          vm.dialogObject['itemId'].options.push({ label: i.subcode, 'value': i.id, name: i.name })
        })
      }, 'GET')
    },
    /** 重置行表单的值
     * 2020-05-27
     */
    resetLineForm(){
      let mateFormerValue = this.mate.mateFormer.values;
      mateFormerValue['itemCode'] = '';        // 产品编码
      mateFormerValue['itemName'] = '';        // 产品名称
      mateFormerValue['cusMaterialCode'] = ''; // 客户料号
      mateFormerValue['cusMaterial'] = '';     // 客户品名
      mateFormerValue['orgId'] = '';           // 发货库存组织
      mateFormerValue['qty'] = '';             // 数量
      mateFormerValue['unit'] = '';            //单位
      mateFormerValue['tax'] = '';             // 税分类代码
      mateFormerValue['price'] = '';           // 销售单价
      mateFormerValue['requestDate'] = '';     // 请求日期
      mateFormerValue['shipDate'] = '';        // 计划发运日期
      mateFormerValue['promiseDate'] = '';     // 承诺日期
      mateFormerValue['onhandQty'] = '';       // 现有量
      mateFormerValue['retainQty'] = '';       // 保留量
      mateFormerValue['returnReason'] = '';    // 退货原因
      mateFormerValue['total'] = undefined;    // 行合计
      mateFormerValue['remark'] = '';          // 航备注
      mateFormerValue['isJacking'] = '0';      // 是否套料
      mateFormerValue['isSpareParts'] = '0';   // 是否需要备件
      mateFormerValue['num'] = '';             // 行号
    },
    handleKtable (btn, row) {
      this.row = row
      this.btn = btn
      var vm = this
      if (this.btn.action === 'addDetailBill') {
        this.$refs.SaleOrderForm.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            // 先要清空
            // vm.mate.mateFormer.values = {}
            /**
             * !请不要不要直接等于 {} 相当于删除values里的所有属性,  2020-05-27 
             * !这样想要实现双数据绑定必须用 $set来赋值 2020-05-27
             * !应该将字段赋值为 '' undefined 等初始值 2020-05-27 
             * !还有了解表单的 resetFields() 方法并正确使用
             */
            this.resetLineForm();
            if (vm.mate.mateFormerHeader.values.showEdit) {
              vm.$message({
                message: '不能新增明细行',
                type: 'warning'
              })
              return false
            }
            if (!localStorage.getItem('allowInputPrice')) {
              if (!(vm.mate.mateFormerHeader.values.smPriceHeaderId && vm.mate.mateFormerHeader.values.customerId)) {
                vm.$message({
                  message: vm.$t('priceListAndcustomer'),
                  type: 'warning'
                })
                return false
              }
            }
            vm.cusMaterialData = []
            vm.orgOption = []
            vm.dialogFormVisible = true
            this.$set(this.mate.mateFormer.values,'isJacking' , '0')
            this.$set(this.mate.mateFormer.values,'isSpareParts' , '0')
            Vue.set(vm.mate.mateFormer.values, 'requestDate', vm.requestDateCopy)
            Vue.set(vm.mate.mateFormer.values, 'tax', vm.mate.mateFormerHeader.values.tax)
            Vue.set(vm.mate.mateFormer.values, 'orgId', vm.mate.mateFormerHeader.values.orgId)
            vm.$root.ajaxData('/org/inventory/all?dataOnly=true', {}, function (data) {
              data.map((i) => {
                vm.orgOption.push({ 'label': i.name, 'value': i.id })
              })
            })
            vm.dialogObject['itemId'].options = []
            vm.getMaterials()
            this.$nextTick(() =>{
              this.$refs.ruleForm.clearValidate();
            })
          }else{
            this.$message({
              message: "请先维护头表单信息",
              type: "info"
            });
          }
        })
        // 新增
      } else if (this.btn.action === 'updataDetailBill') {
        if(this.selectedIds.length > 1){
          this.$message({
            message: "请选择一条信息",
            type: 'warning'
          })
          return
        }
        // 如果状态是取消，则不能点击修改
        for (let temp = 0; temp < this.mate.mateList.rows.length; temp++) {
          if (this.mate.mateList.rows[temp].num === this.selectedIds[0]) {
            if (this.mate.mateList.rows[temp].state === '3') {
              this.$message({
                message: this.$t('detailLineCancel'),
                type: 'warning'
              })
              return false
            } else if (this.mate.mateList.rows[temp].state === '6' || this.mate.mateList.rows[temp].state === '7' || this.mate.mateList.rows[temp].state === '1') {
              // vm.mate.mateFormer.values = {}
              /**
               * !请不要不要直接等于 {} 相当于删除values里的所有属性,  2020-05-27 
               * !这样想要实现双数据绑定必须用 $set来赋值 2020-05-27
               * !应该将字段赋值为 '' undefined 等初始值 2020-05-27 
               * !还有了解表单的 resetFields() 方法并正确使用
               */
              vm.resetLineForm();
              // 先要清空
              this.dialogObject['itemId'].options = []
              // 修改
              vm.orgOption = []
                 // 对于每一行进行判断,获取其中最后的一个数字
              if (this.mate.mateFormerHeader.values.showEdit) {
                this.showLine = true
                this.showDetial = true
              }
              if (this.mate.mateFormerHeader.values.showDetial) {
                this.showLine = true
                this.showDetial = false
                this.returnReasonDisabled = false
              }
              this.dialogFormVisible = true
              for (var m = 0; m < this.mate.mateList.rows.length; m++) {
                if (this.mate.mateList.rows[m].num === this.selectedIds[0]) {
                  this.mate.mateFormer.values = Object.assign({}, this.mate.mateList.rows[m])
                  Vue.set(this.mate.mateFormer.values, 'qty', String(this.mate.mateFormer.values.qty))
                  if (this.mate.mateFormerHeader.values.showEdit === true) {
                    this.mate.mateFormer.values.orgId = this.mate.mateFormerHeader.values.orgId
                  }
                }
              }
              this.getMaterials()
              this.$root.ajaxData('/org/inventory/all?dataOnly=true', {}, function (data) {
                data.map((i) => {
                  vm.orgOption.push({ 'label': i.name, 'value': i.id })
                })
              })
            } else {
              this.$message({
                type: 'warning',
                message: this.$t('cannotChange')
              })
            }
          }
        }
      } else if (this.btn.action === 'deleteQuotation') {
        // 判断list中有的值和用户选择的值是否一致，若一致则将其删除
        if (this.mate.mateFormerHeader.values.showEdit) {
          this.$message({
            message: '不能删除明细行',
            type: 'warning'
          })
          return false
        }
        for (var j = 0; j < this.mate.mateList.rows.length; j++) {
          for (var k = 0; k < this.selectedIds.length; k++) {
            if (this.mate.mateList.rows[j].num === this.selectedIds[k]) {
              if (this.mate.mateList.rows[j].state === '6') {
              // splice(i, 1),从i开始的那一条，删除一条
                this.mate.mateList.rows.splice(j, 1)
              // 删除了一条之后，就将剩余从新排序
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })
              } else {
                this.$message({
                  type: 'warning',
                  message: this.$t('undelete')
                })
              }
            }
          }
          for (var l = 0; l < this.mate.mateList.rows.length; l++) {
            this.mate.mateList.rows[l].num = l + 1
          }
        }
        // 分解
      } else if (this.btn.action === 'decompose') {
        // 用作判断这条记录能否被分解
        for (var jj = 0; jj < this.mate.mateList.rows.length; jj++) {
          if (this.mate.mateList.rows[jj].num === this.selectedIds[0]) {
            if (this.mate.mateList.rows[jj].state !== '1') {
              this.$message({
                message: this.$t('cannotDecomposed'),
                type: 'warning'
              })
              return false
            }
          }
        }
        this.dialogListDecompose = true
        this.decomposeData = []
        for (var i = 0; i < this.mate.mateList.rows.length; i++) {
          if (this.mate.mateList.rows[i].num === this.selectedIds[0]) {
            this.decomposeData.push(Object.assign({}, this.mate.mateList.rows[i]))
            this.decomposeData.push(Object.assign({}, this.mate.mateList.rows[i]))
            this.decomposeNum = this.decomposeData[0].qty
            this.decomposeData[1].qty = ''
            this.decomposeData[1].id = ''
            this.decomposeData[1].shipNum += 1
            this.decomposeData[1].num = String(this.decomposeData[0].lineno) + '.' + String(this.decomposeData[1].shipNum)
            return true
          }
        }
      } else if (this.btn.action === 'cancel') {
        if (this.mate.mateFormerHeader.values.showEdit) {
          this.$message({
            message: '不能取消明细行',
            type: 'warning'
          })
          return false
        }
        for (var c = 0; c < this.mate.mateList.rows.length; c++) {
          if (this.mate.mateList.rows[c].num === this.selectedIds[0]) {
            if (this.mate.mateList.rows[c].shippedQty !== null) {
              if (this.mate.mateList.rows[c].shippedQty === this.mate.mateList.rows[c].invoiceQty) {
                this.$message({
                  type: 'warning',
                  message: this.$t('nocancel')
                })
                return
              }
            }
          }
        }
        this.$confirm('此操作将改明细行取消, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          for (var c = 0; c < this.mate.mateList.rows.length; c++) {
            if (this.mate.mateList.rows[c].num === this.selectedIds[0]) {
              // 状态3表示取消, 数量变为0
              Vue.set(this.mate.mateList.rows[c], 'cancelQty', this.mate.mateList.rows[c].qty - this.mate.mateList.rows[c].invoiceQty)
              Vue.set(this.mate.mateList.rows[c], 'state', '3')
              Vue.set(this.mate.mateList.rows[c], 'qty', this.mate.mateList.rows[c].invoiceQty)
              Vue.set(this.mate.mateList.rows[c], 'total', this.mate.mateList.rows[c].qty)
              this.getTotal()
              // this.mate.mateList.rows[c].state = 3
              return true
            }
          }
          this.$message({
            type: 'success',
            message: '已取消!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '未取消'
          })
        })
      }
    },
    // 数量改变时，小计也要改变
    changeQtyTable (val) {
      this.decomposeData[1].qty = this.decomposeNum - this.decomposeData[0].qty
      this.decomposeData[0].total = this.decomposeData[0].qty * parseInt(this.decomposeData[0].price)
      this.decomposeData[1].total = this.decomposeData[1].qty * parseInt(this.decomposeData[1].price)
    },
    // 提交
    handleSubmit (ev) {
      this.buttonDisabled = true
      var vm = this
      var mate = {}
      const mateFormerheader = this.mate.mateFormerHeader

      // 对其进行校验
      this.$refs.SaleOrderForm.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.mate.mateList.rows.length === 0) {
            vm.$message({
              message: this.$t('明细数据不能为空'),
              type: 'warning'
            })
            this.buttonDisabled = false
            return
          }
          if (this.mate.mateFormerHeader.values.cusPoId) {
            for (var i = 0; i < this.mate.mateList.rows.length; i++) {
              if (this.mate.mateList.rows[i].orgId === null || this.mate.mateList.rows[i].orgId === '') {
                this.mate.mateList.rows[i].orgId = this.mate.mateFormerHeader.values.orgId
              }
            }
          }
          this.mate.mateFormerHeader.values.orderDate = DateFormat(this.mate.mateFormerHeader.values.orderDate, 'yyyy-MM-dd')
          mate.mateFormerHeader = this.mate.mateFormerHeader.values
          mate.mateList = this.mate.mateList.rows
          // 修改
          if (mateFormerheader.method === 'PUT' && mateFormerheader.values.id) {
            this.$root.ajaxData('/purchase/so/headers/batchUpdate/' + mateFormerheader.values.id, mate, function () {
              if (vm.mate.mateFormerHeader.values.id === '2') {
                vm.$root.monitor({ url: '/purchase/so/lines/getShipData/list' })
                return
              }
              vm.$root.monitor({ url: '/purchase/so/headers/all/list' })
            }, 'PUT')
            // 新增
          } else if (mateFormerheader.method === 'POST') {
            this.$root.ajaxData('/purchase/so/headers/batchSave', mate, function () {
              if (vm.mate.mateFormerHeader.values.id === '2') {
                vm.$root.monitor({ url: '/purchase/so/lines/getShipData/list' })
                return
              }
              vm.$root.monitor({ url: '/purchase/so/headers/all/list' })
            }, 'POST')
          }
        } else {
          this.$notify.error({
            title: '消息',
            message: '数据验证未通过'
          })
          this.buttonDisabled = false
          return false
        }
      })
    },
    backward () {
      if (this.mate.mateFormerHeader.values.id === '2') {
        this.$root.monitor({ url: '/purchase/so/lines/getShipData/list' })
        return
      }
      this.$root.monitor({ url: '/purchase/so/headers/all/list' })
    },
    // 弹出框提交
    dialogSubmit () {
      // 判断获取到的数据中是否有lineNum属性，该属性在对应的数据库表中没有
      // 将中文加进去
      const mateFormerValues = this.mate.mateFormer.values
      // if (this.mate.mateFormer.values.qty > this.mate.mateFormer.values.onhandQty) {
      //   this.$message({
      //     message: '数量不能大于保留量',
      //     type: 'warning'
      //   })
      //   return
      // }
      mateFormerValues.requestDate = DateFormat(mateFormerValues.requestDate, 'yyyy-MM-dd')
      mateFormerValues.shipDate = DateFormat(mateFormerValues.shipDate, 'yyyy-MM-dd')
      mateFormerValues.promiseDate = DateFormat(mateFormerValues.promiseDate, 'yyyy-MM-dd');
      if (this.mate.mateFormer.values.num === 'undefined' || this.mate.mateFormer.values.num === '' || this.mate.mateFormer.values.num === null) {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            // 如果是第一次新增，则不会有num这个属性，直接给1.1就行
            if (this.mate.mateList.rows.length === 0) {
              this.mate.mateFormer.values.shipNum = 1
              this.mate.mateFormer.values.lineno = 1
              Vue.set(this.mate.mateFormer.values, 'num', '1')
            } else {
              let lineNo = 0
              // const shipnum = 1
              lineNo = parseInt(this.mate.mateList.rows[this.mate.mateList.rows.length - 1].num) + 1
              this.mate.mateFormer.values.lineno = lineNo
              this.mate.mateFormer.values.shipNum = 1
              Vue.set(this.mate.mateFormer.values, 'num', lineNo)
              // Vue.set(this.mate.mateFormer.values, 'num', lineNo + '.' + shipnum)
            }
            for (var i = 0; i < this.orgOption.length; i++) {
              if (this.orgOption[i].value === this.mate.mateFormer.values.orgId) {
                this.mate.mateFormer.values.orgName = this.orgOption[i].label
              }
            }
            Vue.set(this.mate.mateFormer.values, 'state', '6')
            // 拷贝
            const mateFormerValues = Object.assign({}, this.mate.mateFormer.values)
            this.mate.mateList.rows.push(mateFormerValues)
            this.dialogFormVisible = false
            // 清空数据
            // this.mate.mateFormer.values = {}
            this.resetLineForm();
          } else {
            this.$notify.error({
              title: '消息',
              message: '数据验证未通过'
            })
            this.dialogFormVisible = true
          }
        })
      } else {
        if (this.mate.mateFormerHeader.values.returnType === true) {
          this.$message({
            type: 'warning',
            message: this.$t('negative Numbers')
          })
          return
        }
        if (this.mate.mateFormerHeader.values.returnName === true) {
          this.$message({
            type: 'warning',
            message: '可退货数量不足'
          })
          return
        }
        for (var i = 0; i < this.mate.mateList.rows.length; i++) {
          if (this.mate.mateFormer.values.num === this.mate.mateList.rows[i].num) {
            // String(this.mate.mateFormer.values.price)
            // 在校验的时候，需要用到price是一个字符串类型
            // 检验的时候，price的类型是type="number"
            for (var j = 0; j < this.orgOption.length; j++) {
              if (this.orgOption[j].value === this.mate.mateFormer.values.orgId) {
                this.mate.mateFormer.values.orgName = this.orgOption[j].label
              }
            }
            Vue.set(this.mate.mateFormer.values, 'price', this.mate.mateFormer.values.price)
            Vue.set(this.mate.mateFormer.values, 'qty', String(this.mate.mateFormer.values.qty))
            const mateFormerValues1 = Object.assign({}, this.mate.mateFormer.values)
            this.$refs.ruleForm.validate((valid) => {
              if (valid) {
                // splice将i行数据删除，并将mateFormerValues1填充进去
                this.mate.mateList.rows.splice(i, 1, mateFormerValues1)
                this.dialogFormVisible = false
                // this.mate.mateFormer.values = {}
                this.resetLineForm();
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
      this.rowsContent = this.mate.mateList.rows
      this.getTotal()
    },
    // 获取到税，小计，合计的数量
    getTotal () {
      this.mate.mateFormerHeader.values.total = 0
      this.mate.mateFormerHeader.values.taxSub = 0
      this.mate.mateFormerHeader.values.subtotal = 0
      this.mate.mateList.rows.map((i) => {
        this.mate.mateFormerHeader.values.total += i.total
        if (i.tax) {
          this.mate.mateFormerHeader.values.taxSub += toDecimal(((i.price - (i.price / (1 + i.tax / 100))) * i.qty))
        } else {
          i.tax = 0
          this.mate.mateFormerHeader.values.taxSub += toDecimal(((i.price - (i.price / (1 + i.tax / 100))) * i.qty))
        }
        this.mate.mateFormerHeader.values.subtotal += toDecimal((i.price / (1 + i.tax / 100) * i.qty))
        this.mate.mateFormerHeader.values.subtotal = toDecimal(this.mate.mateFormerHeader.values.subtotal)
      })
    },
    dialogBackward () {
      // 清空数据
      this.dialogFormVisible = false
      // this.mate.mateFormer.values = {}
      this.resetLineForm();
    },
    handleSelected (val) {
      // 第一步就是要清空selectedIDS里面的数据
      this.selectedIds = []
      // map方法也可以
      val.map((i) => this.selectedIds.push(i.num))
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
    },
    handleSearch(){
      this.searchDialogVisible = true
    },
    getMateInfo({ id, subcode, name, basicUnit, ...data }){
      this.mate.mateFormer.values = {
        ...this.mate.mateFormer.values,
        'itemId': id,
        'itemCode': subcode,
        'itemName': name,
        'unit': basicUnit,
      }
      this.getItemPrice()
    },
   
  }
}
</script>

<style scoped lang="scss">
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
  margin: 3px 0;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}
.el-input__suffix {
  right:68px
}
.el-form-item--mini.el-form-item {
  margin: 6px;
}
.el-input--mini .el-input__inner{
  width:80%
}
.el-button--mini {
  padding: 7px 9px;
}
.el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
  }
  .el-select {
    width: 100%;
  }
</style>
