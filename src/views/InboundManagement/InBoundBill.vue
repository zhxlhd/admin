<!-- 入库单据新增页面 -->
<template>
  <div>
      <div class="tbutton">
        <el-button plain class="el-icon-document" :disabled="buttonDisabled" @click="handleSubmit">提 交</el-button>
        <el-button plain class="el-icon-close" @click="backward">取 消</el-button>
        <el-button plain class="el-icon-date"  @click="resetForm('InBillForm')">重 置</el-button>
      </div>
    <InBill :mate="mate.mateFormerHeader" ref="InBillForm"></InBill>
    <!--上面的KTable用于新增，下面的el-table用于修改 -->
    <KTable ref="lineTable" :KTableItemCode="KTableItemCode" v-if="isKtable" :mate="mate.mateList" :mateFormerHeaderId="id" class="KTable-margin-top" @action="handleKtable" @actionSelected="handleSelected"></Ktable>
    <el-table size="mini" v-else :data="mate.mateList.rows" border  highlight-current-row style="width: 100%" class="table-margin" row-style="height: 5px">
      <el-table-column :label="object['lineNum'].label" :prop="object['lineNum'].name" :width="object['lineNum'].width"></el-table-column>
      <el-table-column :label="object['itemCode'].label" :prop="object['itemCode'].name" :width="object['itemCode'].width">
        <template slot-scope="scope">
          <span>{{scope.row['itemCode']}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="object['itemName'].label" :prop="object['itemName'].name" :width="object['itemName'].width"></el-table-column>
      <el-table-column show-overflow-tooltip :label="object['model'].label" :prop="object['model'].name" :width="object['model'].width"></el-table-column>
      <!-- <el-table-column :label="object['unit'].label" :prop="object['unit'].name" :width="object['unit'].width"></el-table-column> -->
      <el-table-column show-overflow-tooltip :label="object['purcharseOrderNum'].label" :prop="object['purcharseOrderNum'].name" :width="object['purcharseOrderNum'].width"></el-table-column>
      <el-table-column :label="object['quantity'].label" :prop="object['quantity'].name" :width="object['quantity'].width">
        <template slot-scope="scope">
            <el-input :disabled="showEdit" v-show="true" size="mini" v-model="scope.row[object['quantity'].name]" @blur="blurQty(scope.row[object['quantity'].name], scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column :label="object['lotNo'].label" :prop="object['lotNo'].name" :width="object['lotNo'].width">
        <template slot-scope="scope">
            <el-input v-show="true" size="mini" v-model="scope.row[object['lotNo'].name]"></el-input>
        </template>
      </el-table-column>
      <el-table-column :label="object['warehouseName'].label" :width="object['warehouseName'].width">
        <template slot-scope="scope">
          <el-select size="mini" v-model="scope.row['warehouseId']" @change="scope.row['locationId'] = ''" @visible-change="visibleChangeWare">
            <el-option :label="item.label" :value="item.value" v-for="item of object['warehouseName'].options" :key="item.id"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column :label="object['locationName'].label" :prop="object['locationName'].name" :width="object['locationName'].width">
        <template slot-scope="scope">
          <el-select size="mini" v-model="scope.row['locationId']" @visible-change="visibleChangeLocation(scope.row['warehouseId'])">
            <el-option :label="item.label" :value="item.value" v-for="item of object['locationName'].options" :key="item.id"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column :label="object['madeDate'].label" :prop="object['madeDate'].name" :width="object['madeDate'].width">
        <template slot-scope="scope">
          <el-date-picker size="mini" type="date" v-model="scope.row[object['madeDate'].name]" value-format="yyyy-MM-dd"></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column :label="object['expireDate'].label" :prop="object['expireDate'].name" :width="object['expireDate'].width">
        <template slot-scope="scope">
          <el-date-picker size="mini" type="date" v-model="scope.row[object['expireDate'].name]" value-format="yyyy-MM-dd"></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column :label="object['itemStatus'].label" :prop="object['itemStatus'].name" :width="object['itemStatus'].width">
        <template slot-scope="scope">
          <span>{{scope.row['itemStatus'] === '1' ? $t('qualified') : (scope.row['itemStatus'] === '0' ? $t('disqualification') : scope.row['itemStatus'])}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="object['rejectReason'].label" :prop="object['rejectReason'].name" :width="object['rejectReason'].width">
        <template slot-scope="scope">
          <el-input v-show="true" size="mini" v-model="scope.row[object['rejectReason'].name]"></el-input>
        </template>
      </el-table-column>
      <el-table-column :label="object['remark'].label" :prop="object['remark'].name" :width="object['remark'].width">
        <template slot-scope="scope">
          <el-input v-show="true" size="mini" v-model="scope.row[object['remark'].name]"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <!--size="large"-->
    <el-dialog title="新增明细单" width="80%" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-row style="margin-bottom: 15px;">
      <el-form size="mini" :model="mate.mateFormer.values" ref="ruleForm" :rules="rules" :label-position="labelPosition" :label-width="labelWidth">
          <el-row>
            <el-col :sm="12" :md="8" :lg="6">
              <el-form-item :label="dialogObject['sourceCode'].label" :prop="dialogObject['sourceCode'].name" >
                <el-input v-model="mate.mateFormer.values[dialogObject['sourceCode'].name]"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-input v-model="mate.mateFormer.values[dialogObject['lineNum'].name]" style="display:none;"></el-input>

          <!-- 货品编码 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['itemCode'].label" :prop="dialogObject['itemCode'].name">
              <el-input v-model="mate.mateFormer.values[dialogObject['itemCode'].name]" @change="changeMate">
                <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
              </el-input>
            </el-form-item>
          </el-col> 

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['itemName'].label" :prop="dialogObject['itemName'].name" >
              <el-input :readonly="true" v-model="mate.mateFormer.values[dialogObject['itemName'].name]"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['model'].label" :prop="dialogObject['model'].name" >
              <el-input :readonly="true" v-model="mate.mateFormer.values[dialogObject['model'].name]"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['quantity'].label" :prop="dialogObject['quantity'].name" >
              <el-input type="number" v-model="mate.mateFormer.values[dialogObject['quantity'].name]"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['lotNo'].label" :prop="dialogObject['lotNo'].name" >
              <el-input :disabled="lotnumberCtrl" v-model="mate.mateFormer.values[dialogObject['lotNo'].name]"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['itemStatus'].label" :prop="dialogObject['itemStatus'].name">
              <el-select clearable v-model="mate.mateFormer.values[dialogObject['itemStatus'].name]">
                <el-option :label="item.label" :value="item.value" v-for="item of dialogObject['itemStatus'].options" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['rejectReason'].label" :prop="dialogObject['rejectReason'].name" >
              <el-input v-model="mate.mateFormer.values[dialogObject['rejectReason'].name]"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['warehouseId'].label" :prop="dialogObject['warehouseId'].name">
              <el-select clearable @visible-change="visibleChange16" @change="change16" v-model="mate.mateFormer.values['warehouseId']">
                <el-option :label="item.label" :value="item.value" v-for="item of dialogObject['warehouseId'].options" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['locationId'].label" :prop="dialogObject['locationId'].name" :rules="ruleInShow">
              <el-select clearable @visible-change="visibleChange17" @change="change17" :disabled="locationVisible" v-model="mate.mateFormer.values[dialogObject['locationId'].name]">
                <el-option :label="item.label" :value="item.value" v-for="item of dialogObject['locationId'].options" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item  :label="dialogObject['madeDate'].label" :prop="dialogObject['madeDate'].name">
              <el-date-picker type="date" v-model="mate.mateFormer.values[dialogObject['madeDate'].name]" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item  :label="dialogObject['expireDate'].label" :prop="dialogObject['expireDate'].name">
              <el-date-picker type="date" v-model="mate.mateFormer.values[dialogObject['expireDate'].name]" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['remark'].label" :prop="dialogObject['remark'].name" >
              <el-input v-model="mate.mateFormer.values[dialogObject['remark'].name]"></el-input>
            </el-form-item>
          </el-col>

        </el-form>
      </el-row>
        <el-button size="mini" type="primary" @click="dialogSubmit">提 交</el-button>
        <el-button size="mini" @click="dialogBackward">取 消</el-button>
    </el-dialog>
    <!-- 物料搜索框-->
    <MaterialSearch v-if="searchDialogVisible" :orgId="mate.mateFormerHeader.values['orgId']" :visible.sync="searchDialogVisible" @getMateInfo="getMateInfo"></MaterialSearch>
  </div>
</template>

<script>
import { DateFormat, trimSpace, isPositiveinteger } from '../../utils/util.js'
import SERVICES from '@/services';

export default {
  components: {
    // InBill,
    InBill: function index (resolve) {
      require(['./InBill.vue'], resolve)
    },
    KTable: function index (resolve) {
      require(['../../components/KTable.vue'], resolve)
    },
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
    },
    MaterialSearch: function index (resolve) {
      require(['@/components/MaterialSearch.vue'], resolve)
    }
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
      buttonDisabled: false,
      ruleForm: {
        itemCode: '',
        quantity: ''
      },
      rules: {
        itemCode: [
          { required: true, message: '该输入项为必输项' },
          { validator: validateRequired, trigger: 'blur' }
        ],
        quantity: [
          { required: true, message: '该输入项为必输项' },
          { validator: validatePositivenumber, trigger: 'blur' }
        ],
        warehouseId: [{ required: true, message: '该输入项为必输项',trigger: 'change' }]
      },
      dialogFormVisible: false,
      searchDialogVisible: false,
      selectedLines: [],
      selectedIds: [],
      btn: {},
      row: [],
      id: this.mate.mateFormerHeader.values.id,
      storageId: 0,     // 仓库的id
      isKtable: true,
      mateFormerRows: [],
      ruleInShow: { required: true, message: '该输入项为必输项',trigger: 'change', disable: true },
      object: {},
      dialogObject: {},
      showEdit: false,
      locationVisible: true,
      warehouseOptions: [],                    // 存放仓库options的值
      locationOptions: [],                     // 存放储位options的值
      subCodeOptions: [],
      KTableItemCode: '',               // 货品编码给用户看到的信息，将该信息传给KTable
      rowsDataQty: [],                         // 明细行中的数量的集合
      flagId: '',                        // 判断是用户自己新增，还是从收货通知
      labelPosition: 'right',
      lotnumberCtrl:false,
      inboundTitle: '',
      mateFormerValues: {}
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
  created () {
    const vm = this
    const mateListRows = this.mate.mateList.rows
    this.mate.mateList.columns.map((i) => { this.object[i.name] = i })           // 点击修改按钮时，获取到的mateList
    this.mate.mateFormer.fields.map((i) => { this.dialogObject[i.name] = i })
    this.inboundTitle = this.mate.title
    if (this.mate.mateFormerHeader.values.id) {
      this.isKtable = false
    }
    if (this.mate.mateFormerHeader.values.asnCode) {
      this.showEdit = true
    }
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
      this.rowsDataQty.push(item.quantity)
    })
    if (this.mate.mateFormerHeader.values.id) {
      this.flagId = this.mate.mateFormerHeader.values.id
    }
    // 保存行表单初始值
    this.mateFormerValues = Object.assign({}, this.mate.mateFormer.values);
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
      // this.$alert(rowVal)
      if (this.flagId === '1') {
        for (let i = 0; i < this.mate.mateList.rows.length; i++) {
          if (this.mate.mateList.rows[i].id === rowVal.id) {
            if (val > this.rowsDataQty[i]) {
              this.$message({
                type: 'warning',
                message: this.$t('modificationsLessOriginal')
              })
              this.mate.mateList.rows[i].quantity = this.rowsDataQty[i]
            }
            return
          }
        }
      }
    },
    resetForm (formName) {
      if (this.mate.mateFormerHeader.values.id !== null) {
        this.$message({
          type: 'warning',
          message: this.$t('reset')
        })
      } else {
        this.$refs.InBillForm.$refs['ruleForm'].resetFields()
        this.mate.mateList.rows = null
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
      if (this.mate.mateFormerHeader.values.orgId) {
        this.$root.ajaxData('/dc/getWarehouseByOrg/' + this.mate.mateFormerHeader.values.orgId, {}, function (data) {
          for (var i = 0; i < data.length; i++) {
            vm.object['warehouseName'].options.push({ value: data[i].id, label: data[i].name })
          }
        }, 'GET')
      }
    },

    dialogSubmit () {
      // 判断获取到的数据中是否有lineNum属性，该属性在对应的数据库表中没有
      if (this.mate.mateFormer.values.lineNum === 0 || this.mate.mateFormer.values.lineNum === '') { // 新增
        // 拷贝
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.mate.mateFormer.values.lineNum = (this.mate.mateList.rows.length + 1)
            const mateFormerValues = Object.assign({}, this.mate.mateFormer.values)
            this.mate.mateList.rows.push(mateFormerValues)
            // mateFormerValues.madeDate = DateFormat(this.mate.mateFormer.values.madeDate, 'yyyy-MM-dd')
            // mateFormerValues.expireDate = DateFormat(this.mate.mateFormer.values.expireDate, 'yyyy-MM-dd')
            // mateFormerValues.advancedShipDate = DateFormat(this.mate.mateFormer.values.advancedShipDate, 'yyyy-MM-dd')
            this.dialogFormVisible = false;
          } else {
            this.$notify.error({
              title: '消息',
              message: '数据验证未通过'
            })
          }
        })
      } else { // 修改
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            for (var i = 0; i < this.mate.mateList.rows.length; i++) {
              if (this.mate.mateFormer.values.lineNum === this.mate.mateList.rows[i].lineNum) {
                const mateFormerValues = Object.assign({}, this.mate.mateFormer.values);
                this.mate.mateList.rows.splice(i, 1, mateFormerValues);
                this.dialogFormVisible = false;
              }
            }
          } else {
            this.$notify.error({
              title: '消息',
              message: '数据验证未通过'
            })
          }
        })
      }
    },
    dialogBackward () {
      // 在取消的时候需要将dialog里面的values清空
      // 这是在做报价的时候改过来的，可以用 = {}这个动作
      // this.mate.mateFormer.values = {};
      // this.$refs['ruleForm'].clearValidate();
      this.dialogFormVisible = false
    },
    handleSubmit (ev) {
      var vm = this
      var mate = {}
      const mateMateFormerHeader = this.mate.mateFormerHeader
      const mateMateListRows = this.mate.mateList.rows
      const inboundTitle = this.inboundTitle
      for (var i = 0; i < this.mate.mateList.rows.length; i++) {
        if (this.mate.mateList.rows[i].warehouseId === null || this.mate.mateList.rows[i].warehouseId === '') {
          this.$message({
            type: 'warning',
            message: '请选择仓库'
          })
          return
        }
      }
       // 将日期格式化
      for (let i = 0; i < mateMateListRows.length; i++) {
        mateMateListRows[i].madeDate = DateFormat(mateMateListRows[i].madeDate, 'yyyy-MM-dd')
        mateMateListRows[i].expireDate = DateFormat(mateMateListRows[i].expireDate, 'yyyy-MM-dd')
      }
      mateMateFormerHeader.values.billDate = DateFormat(mateMateFormerHeader.values.billDate, 'yyyy-MM-dd')
      mateMateFormerHeader.values.advancedShipDate = DateFormat(mateMateFormerHeader.values.advancedShipDate, 'yyyy-MM-dd')
      mate.mateFormerHeader = mateMateFormerHeader.values
      mate.mateList = mateMateListRows
      this.$refs.InBillForm.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.mate.mateList.rows.length === 0) {
            vm.$message({
              message: this.$t('Detailed data can not be empty'),
              type: 'warning'
            })
            this.buttonDisabled = false
            return
          }
           //手工录入采购入库单时，表单提交失效
          if(inboundTitle ==='入库单据'){
            if(mateMateFormerHeader.values.billType === '10'){
              vm.$message({
                message: this.$t('禁止手工录入采购入库单，请先做收货任务，通过收货任务生成入库单'),
                type: 'warning'
              })
                this.buttonDisabled = false
              return 
            }
          }
          if (mateMateFormerHeader.method === 'PUT' && mateMateFormerHeader.values.id) {
            this.$root.ajaxData('/inbound/bill/headers/batchUpdate/' + mateMateFormerHeader.values.id, mate, function () {
          // 如果vm.mate.mateFormerHeader.values.id为1，跳转到预发货通知去，id是后台设置的
              if (vm.mate.mateFormerHeader.values.id === '1') {
                vm.$root.monitor({ url: '/purchase/asn/all/list?businessType=true' })
                return
              } else if (vm.mate.mateFormerHeader.values.id === '2') {
                vm.$root.monitor({ url: '/purchase/so/return/all/list' })
                return
              }
              vm.$root.monitor({ url: '/inbound/bill/headers/all/list' })
            }, 'PUT')
          } else if (mateMateFormerHeader.method === 'POST') {
            this.$root.ajaxData('/inbound/bill/headers/batchSave', mate, function (data) {
              if (data.code === 40022) {
                vm.$message({
                  message: '收货数量异常',
                  type: 'warning'
                })
                return
              }
          // 如果vm.mate.mateFormerHeader.values.id为1，跳转到预发货通知去，id是后台设置的
              if (vm.mate.mateFormerHeader.values.id === '1') {
                vm.$root.monitor({ url: '/purchase/asn/all/list?businessType=true' })
                return
              } else if (vm.mate.mateFormerHeader.values.id === '2') {
                vm.$root.monitor({ url: '/purchase/so/return/all/list' })
                return
              }
              vm.$root.monitor({ url: '/inbound/bill/headers/all/list' })
            }, 'POST')
          }
        } else {
          this.buttonDisabled = false
          return false
        }
      })
    },
    backward () {
      // 如果vm.mate.mateFormerHeader.values.id为1，跳转到预发货通知去，id是后台设置的
      if (this.mate.mateFormerHeader.values.id === '1') {
        this.$root.monitor({ url: '/purchase/asn/all/list?businessType=true' })
        return
      } else if (this.mate.mateFormerHeader.values.id === '2') {
        this.$root.monitor({ url: '/purchase/so/return/all/list' })
        return
      }
      this.$root.monitor({ url: '/inbound/bill/headers/all/list' })
    },
    /** 重置新增行表单
     * 
     */
    resSetLineForm(values){
      values = values || this.mate.mateFormer.values;
      values['sourceCode'] = ''; // 来源单号
      values['lineNum'] = ''; // 行号
      values['itemCode'] = ''; // 货物编码
      values['itemName'] = ''; // 货物名称
      values['model'] = ''; // 货物型号
      values['quantity'] = undefined; // 数量
      values['lotNo'] = ''; // 批号
      values['itemStatus'] = '1'; // 货品状态
      values['rejectReason'] = ''; // 退货原因
      values['warehouseId'] = ''; // 仓库 id
      values['warehouseName'] = ''; // 仓库名称
      values['locationId'] = ''; // 储位
      values['madeDate'] = ''; // 生产日期
      values['expireDate'] = ''; // 效期
      values['remark'] = ''; // 细单备注
      values['id'] = ''; // id
    },
    handleKtable (btn, row) {
      var vm = this;
      this.row = row;
      this.btn = btn;
      // 新增
      if (this.btn.action === 'addDetailBill') {
        this.$refs.InBillForm.$refs['ruleForm'].validate((valid) => {
          if(valid){
            vm.dialogFormVisible = true;
            this.ruleInShow.disable = true;
            // this.mate.mateFormer.values = {}
            // 新增的显示弹窗时候重置表单 2019-03-23
            this.resSetLineForm();
            vm.$nextTick(() =>{
              vm.$refs['ruleForm'].clearValidate();
            })
          }else {
            this.$message({
              message: "请先维护头表单信息",
              type: "info"
            });
          }
        })
      // 修改
      } else if (this.btn.action === 'updataDetailBill') {
        var vm = this
        var rows = this.selectedLines;
        if (rows.length !== 1) {
          vm.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        } else {
          this.dialogFormVisible = true;
          if (this.mate.mateFormer.values.inStock === true) {
            this.ruleInShow.required = true;
            this.ruleInShow.disable = false;
          } else {
            this.ruleInShow.required = false;
            this.ruleInShow.disable = true;
          }
          // for (var i = 0; i < this.mate.mateList.rows.length; i++) {
          //   if (this.mate.mateList.rows[i].id === this.row.id[0]) {
          //     this.mate.mateFormer.values = this.mate.mateList.rows[i]
          //     // this.mate.mateFormer.values = Object.assign({}, this.mate.mateList.rows[i])
          //   }
          // }
              this.mate.mateFormer.values = {...rows[0]};
        }
        // 获取仓库的options
        this.$root.ajaxData('/dc/getWarehouseByOrg/' + this.mate.mateFormerHeader.values.orgId, {}, function (data) {
          for (var i = 0; i < data.length; i++) {
            var name = data[i].name
            var id = data[i].id
            var options = { value: id, label: name }
            vm.dialogObject['warehouseId'].options.push(options)
          }
        }, 'GET')
        // 获取储位的options
        if (vm.mate.mateFormer.values.warehouseId) {
          this.$root.ajaxData('/dc/' + vm.mate.mateFormer.values.warehouseId + '/locals?cols=id,name&dataOnly=true', {}, function (data) {
            for (var i = 0; i < data.length; i++) {
              var name = data[i].name
              var id = data[i].id
              var options = { value: id, label: name }
              vm.dialogObject['locationId'].options.push(options)
            }
          }, 'GET')
        }
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
    visibleChange16 (flag) {
      var vm = this
      vm.dialogObject['warehouseId'].options = []
      if (flag) {
        if (this.mate.mateFormerHeader.values.orgId !== null) {
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
        }
      } else if (!flag) {
        // 新增时，仓库之后id，但是在将数据放入入库单明细行时，需要 warehouseName
        if (this.mate.mateFormer.values.warehouseId) {
          for (var i = 0; i < vm.warehouseOptions.length; i++) {
            if (vm.warehouseOptions[i].value === vm.mate.mateFormer.values.warehouseId) {
              vm.mate.mateFormer.values.warehouseName = vm.warehouseOptions[i].label
              if (this.warehouseOptions[i].locationControl === 1) {
                this.mate.mateFormer.values.inStock = true
              } else {
                this.mate.mateFormer.values.inStock = false
              }
            }
          }
          this.mate.mateFormer.values.locationId = ''
          if (this.mate.mateFormer.values.inStock === true) {
            this.ruleInShow.required = true;
            this.ruleInShow.disabled = false;
          } else {
            this.ruleInShow.required = false;
            this.ruleInShow.disabled = true;
          }
        }
      }
    },
    // 当仓库改变时，储位可选，否则不能选
    change16 (val) {
      this.locationVisible = false
      for (let i = 0; i < this.warehouseOptions.length; i++) {
        if (this.warehouseOptions[i].value === val) {
          this.mate.mateFormer.values.warehouseName = this.warehouseOptions[i].label
          if (this.warehouseOptions[i].locationControl === 1) {
            this.mate.mateFormer.values.inStock = true
          } else {
            this.mate.mateFormer.values.inStock = false
          }
        }
      }
      if (this.mate.mateFormer.values.inStock === true) {
        this.ruleInShow.required = true;
      } else {
        this.ruleInShow.required = false;
      }
    },
    // // 获取储位
    visibleChange17 (flag) {
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
    change17 (val) {
      for (let i = 0; i < this.locationOptions.length; i++) {
        if (this.locationOptions[i].value === val) {
          this.mate.mateFormer.values.locationName = this.locationOptions[i].label
        }
      }
    },

    // 弹出物料搜索框
    handleSearch () {
      this.searchDialogVisible = true
    },

    // 接收物料信息
    getMateInfo ({ subcode, id, name, basicSpec, basicUnit, madeIn, lotnumberCtrl, ...data }) {
      this.mate.mateFormer.values = {
        ... this.mate.mateFormer.values,
        'itemCode': subcode,
        'itemId': id,
        'itemName': name,
        'model': basicSpec,
        'unit': basicUnit,
        'originCountry': madeIn
      }
      this.lotnumberCtrl=!lotnumberCtrl

    },
    // 手输物料编码查询 全匹配 
    changeMate (val) {// TODO 
    
      // SERVICES.BASE.searchMaterials({
      //   subcode: this.mate.mateFormer.values[this.dialogObject['itemCode'].name]
      // }).then(
      //   res => {
      //     if(res.data.mate.rows.length) this.getMateInfo(res.data.mate.rows[0])
          
      //   }
      // )
      // if (val == "") return;
      let _this = this;
      let orgId = this.mate.mateFormerHeader.values['orgId'];
      SERVICES.BASE.getMaterialsInfo(val, orgId).then(res => {
        let values = _this.mate.mateFormer.values;
        let data = res.data && res.data.data;
        if (data) {
          values["itemName"] = data.name || "";
          values["model"] = data.basicSpec || "";
          values["unit"] = data.basicUnit || "";
          values["itemId"] = data.id || "";
          values["originCountry"] = data.madeIn || "";
        } else {
          this.$message({
            type: "warning",
            message: "此物料编码不存在"
          });
          values["itemName"] = "";
          values["model"] = "";
          values["unit"] = "";
          values["itemId"] = "";
          values["originCountry"] = "";
        }
      });
    },
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
.table-margin{
  margin-top:20px;
}
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
.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 100%;
}
.el-select {
  width: 100%;
}
</style>

