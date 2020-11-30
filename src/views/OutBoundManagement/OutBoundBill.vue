<template>
  <div>
    <div class="tbutton">
      <el-button :disabled="buttonDisabled" plain class="el-icon-document"  @click="handleSubmit">提 交</el-button>
      <el-button plain class="el-icon-close" @click="backward" v-if="!mate.inline">取 消</el-button>
      <el-button plain class="el-icon-date"  @click="resetForm('OutBillForm')">重 置</el-button>
    </div>
    <OutBill :mate="mate.mateFormerHeader" ref="OutBillForm"></OutBill>
    <!--新增-->
    <OutBoundKTable ref="lineTable" :KTableItemCode="KTableItemCode" @actionSelected="handleSelected" v-if="isKtable" :mate="mate.mateList" :mateFormerHeaderId="id" class="KTable-margin-top" @action="handleKtable"></OutBoundKTable>
    <!--修改-->
    <el-table size="mini" v-else :data="mate.mateList.rows" border  highlight-current-row style="width: 100%" class="el-table-margin" row-style="height: 5px">
      <!--<el-table-column :label="object['lineNum'].label" :prop="object['lineNum'].name" :width="object['lineNum'].width"></el-table-column>-->
      <el-table-column :label="object['itemCode'].label" :prop="object['itemCode'].name" :width="object['itemCode'].width">
        <template slot-scope="scope">
          <span>{{scope.row['itemCode']}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="object['itemName'].label" :prop="object['itemName'].name" :width="object['itemName'].width"></el-table-column>
      <el-table-column :label="object['model'].label" :prop="object['model'].name" :width="object['model'].width"></el-table-column>
      <el-table-column :label="object['unit'].label" :prop="object['unit'].name" :width="object['unit'].width"></el-table-column>
      <el-table-column :label="object['requestQty'].label" :prop="object['requestQty'].name" :width="object['requestQty'].width">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row[object['requestQty'].name]" @blur="blurQty(scope.row[object['requestQty'].name], scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column :label="object['requestQtyBox'].label" :prop="object['requestQtyBox'].name" :width="object['requestQtyBox'].width"></el-table-column>
      <el-table-column :label="object['batchNo'].label" :prop="object['batchNo'].name" :width="object['batchNo'].width">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row[object['batchNo'].name]"></el-input>
        </template>
      </el-table-column>
      <el-table-column :label="object['lotNo'].label" :prop="object['lotNo'].name" :width="object['lotNo'].width">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row[object['lotNo'].name]"></el-input>
        </template>
      </el-table-column>
      <el-table-column :label="object['productDate'].label" :prop="object['productDate'].name" :width="object['productDate'].width">
        <template slot-scope="scope">
          <el-date-picker size="mini" type="date" v-model="scope.row['productDate']"></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column :label="object['expireDate'].label" :prop="object['expireDate'].name" :width="object['expireDate'].width">
        <template slot-scope="scope">
          <el-date-picker size="mini" type="date" v-model="scope.row['expireDate']"></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column :label="object['itemStatus'].label" :prop="object['itemStatus'].name" :formatter="object['itemStatus'].formatter" :width="object['itemStatus'].width">
        <template slot-scope="scope">
          <dict-selected size="mini" v-model="scope.row[object['itemStatus'].name]" dictType="itemStatus" :initValue="scope.row[object['itemStatus'].name]"></dict-selected>
        </template>
      </el-table-column>
      <el-table-column :label="object['expectedShippingDate'].label" :prop="object['expectedShippingDate'].name" :width="object['expectedShippingDate'].width">
        <template slot-scope="scope">
          <el-date-picker size="mini" type="date" v-model="scope.row['expectedShippingDate']"></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column :label="object['shippingType'].label" :prop="object['shippingType'].name" :width="object['shippingType'].width">
        <template slot-scope="scope">
          <dict-selected size="mini" v-model="scope.row[object['shippingType'].name]" dictType="shippingType" :initValue="scope.row[object['shippingType'].name]"></dict-selected>
        </template>
      </el-table-column>
      <el-table-column :label="object['warehouseName'].label" :width="object['warehouseName'].width">
        <template slot-scope="scope">
          <el-select size="mini" v-model="scope.row['warehouseId']" @change="scope.row['locationId'] = ''"  @visible-change="visibleChangeWare">
            <el-option :label="item.label" :value="item.value" v-for="item of object['warehouseName'].options" :key="item.id"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column :label="object['locationName'].label" :width="object['locationName'].width">
        <template slot-scope="scope">
          <el-select size="mini" v-model="scope.row['locationId']" @visible-change="visibleChangeLocation(scope.row['warehouseId'])" clearable>
            <el-option  :label="item.label" :value="item.value" v-for="item of object['locationName'].options" :key="item.id"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column :formatter="object['isAllowPartialShipment'].formatter" :label="object['isAllowPartialShipment'].label" :prop="object['isAllowPartialShipment'].name" :width="object['isAllowPartialShipment'].width"></el-table-column>
      <el-table-column :label="object['docDetailRemark'].label" :prop="object['docDetailRemark'].name" :width="object['docDetailRemark'].width"></el-table-column>
    </el-table>
    

    <!--size="large"-->
    <el-dialog title="新增明细单" width="80%" :visible.sync="dialogFormVisible">
      <el-row>
      <el-form size="mini" :model="mate.mateFormer.values" :inline="mate.mateFormer.inline" :label-position="labelPosition" ref="ruleForm"  :rules="rules" :label-width="labelWidth">
        <!-- 货品编码 -->
        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="dialogObject['itemCode'].label" :prop="dialogObject['itemCode'].name">
            <el-input v-model="mate.mateFormer.values[dialogObject['itemCode'].name]" @change="changeMate">
              <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        
        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="dialogObject['itemName'].label" :prop="dialogObject['itemName'].name">
            <el-input readonly v-model="mate.mateFormer.values[dialogObject['itemName'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="dialogObject['model'].label" :prop="dialogObject['model'].name">
            <el-input readonly v-model="mate.mateFormer.values[dialogObject['model'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="dialogObject['unit'].label" :prop="dialogObject['unit'].name">
            <el-input :readonly="true" v-model="mate.mateFormer.values[dialogObject['unit'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="dialogObject['requestQty'].label" :prop="dialogObject['requestQty'].name">
            <el-input type="number" v-model="mate.mateFormer.values[dialogObject['requestQty'].name]"></el-input>
          </el-form-item>
        </el-col>
        

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="dialogObject['requestQtyBox'].label" :prop="dialogObject['requestQtyBox'].name">
            <el-input disabled v-model="mate.mateFormer.values[dialogObject['requestQtyBox'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="dialogObject['batchNo'].label" :prop="dialogObject['batchNo'].name">
            <el-input v-model="mate.mateFormer.values[dialogObject['batchNo'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="dialogObject['lotNo'].label" :prop="dialogObject['lotNo'].name">
            <el-input v-model="mate.mateFormer.values[dialogObject['lotNo'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item  :label="dialogObject['productDate'].label" :prop="dialogObject['productDate'].name">
            <el-date-picker clearable type="date" v-model="mate.mateFormer.values[dialogObject['productDate'].name]"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item  :label="dialogObject['expireDate'].label" :prop="dialogObject['expireDate'].name">
            <el-date-picker clearable type="date" v-model="mate.mateFormer.values[dialogObject['expireDate'].name]"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="dialogObject['itemStatus'].label" :prop="dialogObject['itemStatus'].name">
            <el-select clearable v-model="mate.mateFormer.values[dialogObject['itemStatus'].name]">
              <el-option :label="item.label" :value="item.value" v-for="item of dialogObject['itemStatus'].options" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item  :label="dialogObject['expectedShippingDate'].label" :prop="dialogObject['expectedShippingDate'].name">
            <el-date-picker clearable type="date" v-model="mate.mateFormer.values[dialogObject['expectedShippingDate'].name]"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="dialogObject['shippingType'].label" :prop="dialogObject['shippingType'].name">
            <el-select clearable v-model="mate.mateFormer.values[dialogObject['shippingType'].name]">
              <el-option :label="item.label" :value="item.value" v-for="item of dialogObject['shippingType'].options" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="dialogObject['rejectReason'].label" :prop="dialogObject['rejectReason'].name">
            <el-input v-model="mate.mateFormer.values[dialogObject['rejectReason'].name]"></el-input>
          </el-form-item>
        </el-col>

        <!-- 仓库 -->
        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="dialogObject['warehouseId'].label" :prop="dialogObject['warehouseId'].name">
            <el-select clearable @visible-change="visibleChange17" v-model="mate.mateFormer.values[dialogObject['warehouseId'].name]" >
              <el-option :label="item.label" :value="item.value" v-for="item of dialogObject['warehouseId'].options" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 储位 -->
        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="dialogObject['locationId'].label" :prop="dialogObject['locationId'].name" :rules="ruleOutShow">
            <el-select clearable :disabled="locationId" @visible-change="visibleChange18" v-model="mate.mateFormer.values[dialogObject['locationId'].name]">
              <el-option :label="item.label" :value="item.value" v-for="item of dialogObject['locationId'].options" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="dialogObject['isAllowPartialShipment'].label" :prop="dialogObject['isAllowPartialShipment'].name">
            <el-select clearable v-model="mate.mateFormer.values[dialogObject['isAllowPartialShipment'].name]">
              <el-option :label="item.label" :value="item.value" v-for="item of dialogObject['isAllowPartialShipment'].options" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="dialogObject['docDetailRemark'].label" :prop="dialogObject['docDetailRemark'].name">
            <el-input v-model="mate.mateFormer.values[dialogObject['docDetailRemark'].name]"></el-input>
          </el-form-item>
        </el-col>
        
        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="dialogObject['sourceCode'].label" :prop="dialogObject['sourceCode'].name">
            <el-input v-model="mate.mateFormer.values[dialogObject['sourceCode'].name]"></el-input>
          </el-form-item>
        </el-col>

        </el-form>
      </el-row>
      <div class="fbutton">
        <el-button @click="dialogSubmit">提 交</el-button>
        <el-button @click="dialogBackward" v-if="!mate.inline">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 物料搜索框-->
    <MaterialSearch v-if="searchDialogVisible" :orgId="mate.mateFormerHeader.values['orgId']" :visible.sync="searchDialogVisible" @getMateInfo="getMateInfo"></MaterialSearch>
  </div>
</template>

<script>
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
import DictStore from '../../store/dict-store'
import { DateFormat, trimSpace, isPositiveinteger } from '../../utils/util.js'
import SERVICES from '@/services';

export default {
  mixins: [ColumnFormatterMixin],
  components: {
    // InBill,
    OutBill: function index (resolve) {
      require(['./OutBill.vue'], resolve)
    },
    OutBoundKTable: function index (resolve) {
      require(['./OutBoundKTable.vue'], resolve)
    },
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
    },
    MaterialSearch: function index (resolve) {
      require(['@/components/MaterialSearch.vue'], resolve)
    },
  },
  data () {
    var validateRequired = (rule, value, callback) => {
      if (value === undefined || trimSpace(value) === '') {
        callback(new Error('该输入项为必输项'))
      } else {
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
    return {
      ruleForm: {
        itemCode: '',
        quantity: ''
      },
      rules: {
        itemCode: [
          { required: true, message: '该输入项为必输项' },
          { validator: validateRequired, trigger: 'change' }
        ],
        requestQty: [
          { required: true, message: '该输入项为必输项' },
          { validator: validatePositivenumber, trigger: 'blur' }
        ],
        warehouseId: [{ required: true, message: '该输入项为必输项' }]
      },
      dialogFormVisible: false,
      btn: {},
      row: [],
      selectedLines: [],
      selectedIds: [],
      id: this.mate.mateFormerHeader.values.id,
      storageId: 0,     // 仓库的id
      locationId: true,
      mateFormerRows: [],
      labelPosition: 'right',
      object: {},
      dialogObject: {},
      modificationsLessOriginal: '',
      ruleOutShow: { required: true, message: '该输入项为必输项' },
      ruleInShow: { required: true, message: '该输入项为必输项' },
      isKtable: true,
      warehouseOptions: [],            // 存放仓库options的值
      locationOptions: [],              // 存放储位options的值
      subCodeOptions: [],
      delivery: '',                     // 送货
      picking: '',                       // 提货
      KTableItemCode: '',               // 货品编码给用户看到的信息，将该信息传给KTable
      rowLine: '',                       // 明细行新增点击修改时，获取到行的信息
      newOrUpdata: false,
      buttonDisabled: false,
      rowsDataQty: [],                         // 明细行中的数量的集合
      searchDialogVisible: false
    }
  },
  props: {
    mate: Object
  },
  computed: {
    labelWidth: function () {
      let width = ''
      if (this.mate.inline) {
        // width = undefined
        width = '130px'
      } else if (typeof (this.mate.labelWidth) === 'undefined') {
        width = '130px'
      } else if (this.mate.labelWidth === null) {
        width = '130px'
      } else {
        width = this.mate.labelWidth
      }
      return width
    }
  },
  created () {
    const vm = this
    const mateListRows = this.mate.mateList.rows
    this.formatterBefore(this.mate.mateList.columns)
    this.mate.mateList.columns.map((i) => { this.object[i.name] = i })
    this.mate.mateFormer.fields.map((i) => { this.dialogObject[i.name] = i })
    if (this.mate.mateFormerHeader.values.id) {
      this.isKtable = false
    }
    // this.picking = this.$t('picking')
    // this.delivery = this.$t('delivery')
    if (this.mate.mateFormerHeader.values.id && this.mate.mateFormerHeader.values.orgId) {
      this.$root.ajaxData('/dc/getWarehouseByOrg/' + this.mate.mateFormerHeader.values.orgId, {}, function (data) {
        for (var i = 0; i < data.length; i++) {
          vm.object['warehouseName'].options.push({ value: data[i].id, label: data[i].name })
        }
      }, 'GET')
    }
    // 在页面出现时，储位需要的数据
    for (let i = 0; i < mateListRows.length; i++) {
      if (mateListRows[i].warehouseId !== null) {
        this.$root.ajaxData('/dc/' + mateListRows[i].warehouseId + '/locals?cols=id,name&dataOnly=true', {}, function (data) {
          for (var i = 0; i < data.length; i++) {
            vm.object['locationName'].options.push({ value: data[i].id, label: data[i].name })
          }
        }, 'GET')
      }
    }
    // 获取到明细行中数量
    this.mate.mateList.rows.forEach((item) => {
      this.rowsDataQty.push(item)
    })
  },
  mounted () {
    const fileds = ['documentType', 'currencyType', 'unit', 'shippingRoute', 'shippingType']
    this.valueLevel(DictStore.state.data, fileds)
  },
  methods: {
    handleSelected (val) {
      this.selectedLines = [];
      this.selectedIds = [];
      // val.map(i => this.selectedLines.push(i.lineNum))
      // var arr1 = []
      // var json1 = {}
      // for (let i = 0; i < this.selectedLines.length; i++) {
      //   if (!json1[this.selectedLines[i]]) {
      //     json1[this.selectedLines[i]] = 1
      //     arr1.push(this.selectedLines[i])
      //   }
      // }
      this.selectedLines = val
      val.map((i) => this.selectedIds.push(i.lineNum))
    },
    // 修改数量不能大于原始数量
    blurQty (val, rowVal) {
      for (let i = 0; i < this.mate.mateList.rows.length; i++) {
        if (this.mate.mateList.rows[i].id === rowVal.id) {
          if (val > this.rowsDataQty[i].tmpQty) {
            this.$message({
              type: 'warning',
              message: this.$t('modificationsLessOriginal')
            })
            return
            // this.mate.mateList.rows[i].requestQty = this.rowsDataQty[i]
          }
          return
        }
      }
    },
    // 修改储位时需要的函数
    visibleChangeLocation (flag) {
      if (flag === '' || flag === null) {
        return
      }
      var vm = this
      vm.object['locationName'].options = []
      this.$root.ajaxData('/dc/' + flag + '/locals?cols=id,name&dataOnly=true', {}, function (data) {
        for (var i = 0; i < data.length; i++) {
          vm.object['locationName'].options.push({ value: data[i].id, label: data[i].name })
        }
      }, 'GET')
    },
    visibleChangeWare () {
      var vm = this
      vm.object['warehouseName'].options = []
      this.$root.ajaxData('/dc/getWarehouseByOrg/' + this.mate.mateFormerHeader.values.orgId, {}, function (data) {
        for (var i = 0; i < data.length; i++) {
          vm.object['warehouseName'].options.push({ value: data[i].id, label: data[i].name })
        }
      }, 'GET')
    },
    object2options (object) {
      const options = []
      Object.keys(object).map(function (objectKey, index) {
        options.push({ 'value': objectKey, 'label': object[objectKey] })
      })
      return options
    },
    resetForm (formName) {
      this.$refs.OutBillForm.$refs['ruleForm'].resetFields()
    },
    handleSubmit () {
      const vm = this
      var mate = {}
      const mateMateFormerHeader = this.mate.mateFormerHeader
      const mateMateListRows = this.mate.mateList.rows
      for (var i = 0; i < this.mate.mateList.rows.length; i++) {
        if (this.mate.mateList.rows[i].warehouseId === null || this.mate.mateList.rows[i].warehouseId === '') {
          this.$message({
            type: 'warning',
            message: '请选择仓库'
          })
          return
        }
      }
      for (let i = 0; i < this.mate.mateList.rows.length; i++) {
        if (this.mate.mateList.rows[i].requestQty > this.mate.mateList.rows[i].tmpQty) {
          this.$message({
            type: 'warning',
            message: this.$t('modificationsLessOriginal')
          })
          return
        }
      }
      this.$refs.OutBillForm.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (!mateMateListRows.length) {
            // 保存的时候明细行不能为空
            this.$message({
              type: "warning",
              message: "明细行不能为空"
            });
            return;
          }
          for (let i = 0; i < mateMateListRows.length; i++) {
            mateMateListRows[i].productDate = DateFormat(mateMateListRows[i].productDate, 'yyyy-MM-dd')
            mateMateListRows[i].expireDate = DateFormat(mateMateListRows[i].expireDate, 'yyyy-MM-dd')
            mateMateListRows[i].expectedShippingDate = DateFormat(mateMateListRows[i].expectedShippingDate, 'yyyy-MM-dd')
          }

          mateMateFormerHeader.values.documentDate = DateFormat(mateMateFormerHeader.values.documentDate, 'yyyy-MM-dd')
          mateMateFormerHeader.values.expectedShippingDate = DateFormat(mateMateFormerHeader.values.expectedShippingDate, 'yyyy-MM-dd')
          mate.mateFormerHeader = mateMateFormerHeader.values
          mate.mateList = this.mate.mateList.rows
          if (mateMateFormerHeader.method === 'PUT' && mateMateFormerHeader.values.id) {
            this.$root.ajaxData('/outbound/bill/headers/batchUpdate/' + mateMateFormerHeader.values.id, mate, function (data) {
              if (data.code === 500) {
                vm.buttonDisabled = false
                return
              }
          // 如果vm.mate.mateFormerHeader.values.id为1，跳转到预发货通知去，id是后台设置的
              if (vm.mate.mateFormerHeader.values.id === '1') {
                vm.$root.monitor({ url: '/purchase/purchase/returns/all/list' })
                return
          // 如果vm.mate.mateFormerHeader.values.id为2，跳转到销售退货去，id是后台设置的
              } else if (vm.mate.mateFormerHeader.values.id === '2') {
                vm.$root.monitor({ url: '/purchase/so/lines/getShipData/list' })
                return
              }
              vm.$root.monitor({ url: '/outbound/bill/headers/all/list' })
            }, 'PUT')
          } else if (mateMateFormerHeader.method === 'POST') {
            this.$root.ajaxData('/outbound/bill/headers/batchSave', mate, function (data) {
              if (data.code === 500) {
                vm.buttonDisabled = false
                return
              }
              if (data.code === 40022) {
                vm.$message({
                  message: '库存不足',
                  type: 'warning'
                })
                return
              }
          // 如果vm.mate.mateFormerHeader.values.id为1，跳转到预发货通知去，id是后台设置的
              if (vm.mate.mateFormerHeader.values.id === '1') {
                vm.$root.monitor({ url: '/purchase/purchase/returns/all/list' })
                return
          // 如果vm.mate.mateFormerHeader.values.id为2，跳转到销售退货去，id是后台设置的
              } else if (vm.mate.mateFormerHeader.values.id === '2') {
                vm.$root.monitor({ url: '/purchase/so/lines/getShipData/list' })
                return
              }
              vm.$root.monitor({ url: '/outbound/bill/headers/all/list' })
            }, 'POST')
          }
        } else {
          this.$notify.error({
            title: '消息',
            message: '数据验证未通过'
          })
          vm.buttonDisabled = false
          return false
        }
      })
    },
    backward () {
      // 如果vm.mate.mateFormerHeader.values.id为1，跳转到预发货通知去，id是后台设置的
      if (this.mate.mateFormerHeader.values.id === '1') {
        this.$root.monitor({ url: '/purchase/purchase/returns/all/list' })
        return
      } else if (this.mate.mateFormerHeader.values.id === '2') {
        this.$root.monitor({ url: '/purchase/so/lines/getShipData/list' })
      }
      this.$root.monitor({ url: '/outbound/bill/headers/all/list' })
    },

    // 值极分类，需要调用的方法
    valueLevel (data, fileds = []) {
      const fieldsHeader = this.mate.mateFormerHeader.fields
      const fields = this.mate.mateFormer.fields
      const optionsMap = new Map()
      // 获取需要的数据字典缓存项，并转化为select的options
      fileds.map(key => {
        const options = data[key] && this.object2options(data[key])
        if (options) {
          optionsMap.set(key, options)
        }
      })

      // 设置单据头指定select字段的options
      fieldsHeader.forEach(function (element) {
        const options = optionsMap.get(element.name)
        if (options) {
          element.options = options
        }
      })

      // 设置明细行指定select字段的options
      fields.forEach(function (element) {
        const options = optionsMap.get(element.name)
        if (options) {
          element.options = options
        }
      })
    },
    dialogSubmit (ev) {
      this.dialogFormVisible = false
      // 在页面上添加细单行号
      this.mate.mateFormer.values.lineNum = (this.mate.mateList.rows.length + 1)
      if (this.newOrUpdata) {
        for (var i = 0; i < this.mate.matelist.rows.length; i++) {
          if (this.mate.mateList.rows[i].lineNum === this.rowLine[0].lineNum) {
            this.mate.mateList.rows.splice(i, 1)
            this.mate.mateFormer.values.lineNum = i - 2
          }
        }
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 拷贝
          const mateFormerValues = Object.assign({}, this.mate.mateFormer.values)
          this.mate.mateList.rows.push(mateFormerValues)
          mateFormerValues.productDate = DateFormat(this.mate.mateFormer.values.productDate, 'yyyy-MM-dd')
          mateFormerValues.expireDate = DateFormat(this.mate.mateFormer.values.expireDate, 'yyyy-MM-dd')
          mateFormerValues.documentDate = DateFormat(this.mate.mateFormer.values.documentDate, 'yyyy-MM-dd')
          mateFormerValues.expectedShippingDate = DateFormat(this.mate.mateFormer.values.expectedShippingDate, 'yyyy-MM-dd')
          mateFormerValues.closedDate = DateFormat(this.mate.mateFormer.values.closedDate, 'yyyy-MM-dd')
          // 将表单中的数据重置
          this.$refs['ruleForm'].resetFields()
        } else {
          this.$notify.error({
            title: '消息',
            message: '数据验证未通过'
          })
          this.dialogFormVisible = true
          return false
        }
      })
    },
    dialogBackward () {
      // 在取消的时候需要将dialog里面的values清空
      this.mate.mateFormer.values = {}
      this.dialogFormVisible = false
    },
    handleKtable (btn, row, selectedRows) {
      const vm = this
      this.row = row
      this.btn = btn
      // 新增
      if (this.btn.action === 'addDetailBill') {
        this.$refs.OutBillForm.$refs['ruleForm'].validate((valid) => {
          if(valid){
            vm.dialogFormVisible = true
            vm.newOrUpdata = false
            if (vm.mate.mateFormerHeader.values.orgId) {
              vm.$root.ajaxData('/materials/getMaterialByOrg/' + vm.mate.mateFormerHeader.values.orgId, {}, function (data) {
                vm.mateFormerRows = data
                var arr = []
                for (var i = 0; i < data.length; i++) {
                  var value = data[i].id
                  var options = { label: data[i].subcode, 'value': value, name: data[i].name }
                  arr.push(options)
                  vm.subCodeOptions.push(options)
                }
                // 放进货品编码里面去
                vm.dialogObject['itemCode'].options = arr
                vm.mate.mateFormer.values.itemStatus = '1'
              }, 'GET')
              if (this.mate.mateFormer.values.outStock === true) {
                this.ruleOutShow = { required: true, message: '该输入项为必输项' }
              } else {
                this.ruleOutShow = {}
              }
            }
          }else {
              this.$message({
                message: "请先维护头表单信息",
                type: "info"
              });
            }
          })
        // 修改
      } else if (this.btn.action === 'updataDetailBill') {
        this.dialogFormVisible = true
        // 获取到选择的哪一行数据，并将数据放置在former表单里面
        this.newOrUpdata = true
        for (var i = 0; i < this.mate.mateList.rows.length; i++) {
          if (this.mate.mateList.rows[i].lineNum === this.rowLine[0].lineNum) {
            this.mate.mateFormer.values = this.mate.mateList.rows[i]
          }
        }
        // for (var i = 0; i < this.mate.mateList.rows.length; i++) {
        //   if (this.mate.mateList.rows[i].id === this.row.id[0]) {
        //     this.mate.mateFormer.values = this.mate.mateList.rows[i]
        //   }
        // }
        // 获取仓库的options
        this.$root.ajaxData('/dc/getWarehouseByOrg/' + this.mate.mateFormerHeader.values.orgId, {}, function (data) {
          for (var i = 0; i < data.length; i++) {
            var name = data[i].name
            var id = data[i].id
            var locationControl = data[i].locationControl
            var options = { value: id, label: name, locationControl: locationControl }
            vm.dialogObject['warehouseId'].options.push(options)
          }
        }, 'GET')
        if (this.mate.mateFormer.values.outStock === true) {
          this.ruleOutShow = { required: true, message: '该输入项为必输项' }
        } else {
          this.ruleOutShow = {}
        }
        // 获取储位的options
        if (this.mate.mateFormer.values.warehouseId) {
          this.$root.ajaxData('/dc/' + this.mate.mateFormer.values.warehouseId + '/locals?cols=id,name&dataOnly=true', {}, function (data) {
            for (var i = 0; i < data.length; i++) {
              var name = data[i].name
              var id = data[i].id
              var options = { value: id, label: name }
              vm.dialogObject['locationId'].options.push(options)
            }
          }, 'GET')
        }
      } else if (this.btn.action === 'delete'){
        this.dialogFormVisible = false;
        let delRows = selectedRows;
        delRows.forEach((item,index) => {
          this.mate.mateList.rows = this.mate.mateList.rows.filter(line => line.lineNum != item.lineNum);
        })
      } else if (btn.action === 'deleteDetailBill') {
        var rows = this.selectedIds;
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
        return
      }else if(btn.action === 'importLine'){
        let orgId = this.mate.mateFormerHeader.values.orgId;
        if(!orgId){
          this.$message({
            type: "info",
            message: "请先选择库存组织!"
          });
          return;
        }
        let data = {'orgId': orgId};
        this.$refs['lineTable'].uploadBtnClick(data);
        return
      }else if(btn.action === 'downloadLine'){
        this.$http({
          url: `${this.BASEAPI}${this.btn.url}`,
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
            'Accept': 'application/json',
            'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
            'Content-Type': 'application/json;charset=utf8'
          },
          responseType: 'arraybuffer'
        }).then(function (response) {
          // blob(size,type) Blob构造函数，接受两个参数。第一个参数是一个包含实际数据的数组，第二个参数是数据的类型
          let blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          let objectUrl = URL.createObjectURL(blob);
          let a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display:none');
          a.setAttribute('href', objectUrl);
          a.setAttribute('download', this.btn.modular);
          a.click()
          URL.revokeObjectURL(objectUrl);
        })
        return
      }
    },
    // 获取仓库
    visibleChange17 (flag) {
      var vm = this
      vm.dialogObject['warehouseId'].options = []
      if (flag) {
        this.$root.ajaxData('/dc/getWarehouseByOrg/' + this.mate.mateFormerHeader.values.orgId, {}, function (data) {
          for (var i = 0; i < data.length; i++) {
            var name = data[i].name
            var id = data[i].id
            var locationControl = data[i].locationControl
            var options = { value: id, label: name, locationControl: locationControl }
            vm.dialogObject['warehouseId'].options.push(options)
            vm.warehouseOptions.push(options)
          }
        }, 'GET')
      } else if (!flag) {
        if (this.mate.mateFormer.values.warehouseId) {
          this.locationId = false
          this.mate.mateFormer.values.locationId = ''
        }
        // 新增时，仓库之后id，但是在将数据放入入库单明细行时，需要warehouseName
        if (this.mate.mateFormer.values.warehouseId) {
          for (var i = 0; i < vm.warehouseOptions.length; i++) {
            if (vm.warehouseOptions[i].value === vm.mate.mateFormer.values.warehouseId) {
              vm.mate.mateFormer.values.warehouseName = vm.warehouseOptions[i].label
              if (this.warehouseOptions[i].locationControl === 1) {
                this.mate.mateFormer.values.outStock = true
              } else {
                this.mate.mateFormer.values.outStock = false
              }
            }
          }
          if (this.mate.mateFormer.values.inStock === true) {
            this.ruleInShow = { required: true, message: '该输入项为必输项' }
          } else {
            this.ruleInShow = {}
          }
        }
      }
    },
    // 为了获取储位，需要先获取到仓库的id
    // change16 (value) {
    //   this.locationVisible = false
    //   for (let i = 0; i < this.warehouseOptions.length; i++) {
    //     if (this.warehouseOptions[i].value === val) {
    //       this.mate.mateFormer.values.warehouseName = this.warehouseOptions[i].label
    //       if (this.warehouseOptions[i].locationControl === 1) {
    //         this.mate.values.outStock = true
    //       } else {
    //         this.mate.values.outStock = false
    //       }
    //     }
    //   }
    // },
    // 获取储位
    visibleChange18 (flag) {
      var vm = this
      vm.dialogObject['locationId'].options = []
      if (flag) {
        if (this.mate.mateFormer.values.warehouseId) {
          this.$root.ajaxData('/dc/' + this.mate.mateFormer.values.warehouseId + '/locals?cols=id,name&dataOnly=true', {}, function (data) {
            for (var i = 0; i < data.length; i++) {
              var name = data[i].name
              var id = data[i].id
              var options = { value: id, label: name }
              vm.dialogObject['locationId'].options.push(options)
              vm.locationOptions.push(options)
            }
          }, 'GET')
        }
      } else if (!flag) {
        // 和仓库一致，新增储位时，储位选择的是id，但是在入库单明细行显示的是locationName，所以在明细行中需要的是locationName
        if (this.mate.mateFormer.values.locationId) {
          for (var i = 0; i < vm.locationOptions.length; i++) {
            if (vm.locationOptions[i].value === vm.mate.mateFormer.values.locationId) {
              vm.mate.mateFormer.values.locationName = vm.locationOptions[i].label
            }
          }
        }
      }
    },
    // table表格中勾选的选项，val是勾选的对象
    // handleSelectionChange (val) {
    //   this.$emit('actionSelected', val)
    //   this.multipleSelection = val
    //   this.rowLine = val
    // },

    // 物料编码更新
    changeMate () {
      SERVICES.BASE.searchMaterials({
        subcode: this.mate.mateFormer.values.itemCode
      }).then(
        res => {
          this.getMateInfo(res.data.mate.rows[0])
        }
      )
    },
    handleSearch(){
      this.searchDialogVisible = true
    },
     // 接收物料信息
    getMateInfo({subcode,id,name,basicSpec,basicUnit,madeIn, ...data}){
      this.mate.mateFormer.values = {
        ...this.mate.mateFormer.values,
        itemCode: subcode,
        itemId: id,
        itemName: name,
        model: basicSpec,
        unit: basicUnit,
        originCountry: madeIn,
      }
      // for (var j = 0; j < this.subCodeOptions.length; j++) {
      //     if (this.subCodeOptions[j].value === this.mate.mateFormer.values.itemCode) {
      //       this.KTableItemCode = this.subCodeOptions[j].label
      //       this.mate.mateFormer.values.itemCode = this.subCodeOptions[j].label
      //     }
      //   }
      // this.KTableItemCode = this.mate.mateFormer.values.itemCode = his.subCodeOptions[j].label
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
  margin-top:20px;
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
.el-dialog__header {
  padding: 10px 10px 0;
}
.el-dialog__body {
  padding: 10px 10px;
}
.el-button--mini {
  padding: 7px 9px;
}
.el-form-item__label{
  line-height:inherit
}
.el-date-editor.el-input, .el-date-editor.el-input__inner{
  width: 100%;
}
.el-select {
  width: 100%;
}
</style>

