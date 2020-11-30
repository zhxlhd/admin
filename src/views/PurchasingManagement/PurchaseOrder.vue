<!-- 采购订单新增页面 -->
<template>
  <div>
      <div class="tbutton">
        <el-button size="mini" :disabled="buttonDisabled" @click="handleSubmit" plain class="el-icon-document">提 交</el-button>
        <el-button size="mini" plain class="el-icon-close" @click="backward">取 消</el-button>
        <el-button size="mini"  plain class="el-icon-date"  @click="resetForm('QuotationSheetForm')">重 置</el-button>
      </div>
    <PurchaseOrderForm :mate="mate.mateFormerHeader" ref="QuotationSheetForm" @setOrgOptions="setOrgOptions"  @getOffice="getOrgId"></PurchaseOrderForm>
    <!--下面的KTable用于新增，下面的el-table用于修改 -->
    <KTable :mate="mate.mateList" @actionSelected="handleSelected" class="KTable-margin-top" @action="handleKtable"></KTable>

    <el-dialog title="填写采购订单明细单" width="80%" :visible.sync="dialogFormVisible">
      <el-row>
        <el-form size="mini" 
          :model="mateFormerLineValues" 
          :label-position="labelPosition" 
          ref="ruleForm" 
          :rules="rules" 
          :label-width="labelWidth">
          <!-- 物料编码 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['subcode'].label" :prop="dialogObject['subcode'].name" >
              <el-input v-model="mateFormerLineValues['subcode']" @change="changeMate">
                <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 物料名称 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['materialName'].label" :prop="dialogObject['materialName'].name">
              <el-input  readonly v-model="mateFormerLineValues['materialName']"></el-input>
            </el-form-item>
          </el-col>
          <!-- 类别 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['category'].label" :prop="dialogObject['category'].name">
              <el-input  disabled v-model="mateFormerLineValues['category']"></el-input>
            </el-form-item>
          </el-col>
          <!-- 单位 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['unit'].label" :prop="dialogObject['unit'].name">
              <el-input  disabled v-model="mateFormerLineValues['unit']"></el-input>
            </el-form-item>
          </el-col>
          <!-- 数量 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['qty'].label" :prop="dialogObject['qty'].name">
              <el-input type="number" @blur="blurQty(mateFormerLineValues['qty'])" v-model="mateFormerLineValues['qty']" placeholder="请输入数量"></el-input>
            </el-form-item>
          </el-col>
          <!-- 含税价格 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['priceTax'].label" :prop="dialogObject['priceTax'].name">
              <el-input :disabled="priceTaxDisabled" @change="changePriceTax(mateFormerLineValues['priceTax'])" v-model="mateFormerLineValues['priceTax']" placeholder="请输入含税价格"></el-input>
            </el-form-item>
          </el-col>
          <!-- 不含税价格 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['price'].label" :prop="dialogObject['price'].name">
              <el-input disabled v-model="mateFormerLineValues['price']"></el-input>
            </el-form-item>
          </el-col>
          <!-- 金额 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['money'].label" :prop="dialogObject['money'].name">
              <el-input disabled v-model="mateFormerLineValues['money']"></el-input>
            </el-form-item>
          </el-col>
          <!-- 库存组织 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['orgId'].label" :prop="dialogObject['orgId'].name">
              <el-select clearable filterable @change="changeOrg" v-model="mateFormerLineValues['orgId']">
                <el-option v-for="item in dialogObject['orgId'].options" :key="item.value" :label="item.label" :value="item.value" placeholder="请选择库存组织"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 需要日期 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['needDate'].label" :prop="dialogObject['needDate'].name">
              <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="mateFormerLineValues['needDate']" placeholder="请选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <!-- 承诺日期 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['promiseDate'].label" :prop="dialogObject['promiseDate'].name">
              <el-date-picker clearable type="date" value-format="yyyy-MM-dd" v-model="mateFormerLineValues['promiseDate']" placeholder="请选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <!-- 合同编号 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['contactCode'].label" :prop="dialogObject['contactCode'].name" >
              <el-input v-model="mateFormerLineValues['contactCode']"></el-input>
            </el-form-item>
          </el-col>
          <!-- 行备注 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['remark'].label" :prop="dialogObject['remark'].name" >
              <el-input v-model="mateFormerLineValues['remark']"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="sbutton">
        <el-button @click="dialogSubmit">确 定</el-button>
        <el-button @click="dialogBackward">取 消</el-button>
      </div>
    </el-dialog>
     <!-- 物料搜索框-->
    <MaterialSearch v-if="searchDialogVisible" :orgId="mate.mateFormerHeader.values['orgId']" :visible.sync="searchDialogVisible" @getMateInfo="getMateInfo"></MaterialSearch>
  </div>
</template>

<script>
import treeSelect from '../../components/tree-select/tree.vue'
import { DateFormat, isPositiveinteger, trimSpace, isPositivenumber } from '../../utils/util.js'
import SERVICES from '@/services';


export default{
  components: {
    PurchaseOrderForm: function index (resolve) {
      require(['./PurchaseOrderForm.vue'], resolve)
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
    MaterialSearch: function index (resolve) {
      require(['@/components/MaterialSearch.vue'], resolve)
    },
    treeSelect
  },
  props: {
    mate: Object
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
    var validatePositivenumberPrice = (rule, value, callback) => {
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
      object: {},              // // 用来代替从父组件总获取到的数据 mate.mateList.columns
      dialogFormVisible: false,
      dialogObject: {},
      btn: {},
      row: {},
      hasPriceTex: true, // 是否有含税价格
      multipleSelection: [],
      selectedIds: [],
      priceColumns: {},
      dialogPriceVisible: false,             // 分段价格弹出框按钮,
      priceCancelDisabled: true,             // 分段删除按钮，时候可用状态
      selectedVal: [],                       // 分段价格选取的整行数据
      rowLineNum: '',                        // 获取到分段中，是第几行
      despatchColumns: {},
      orgData: [],                         // 存放获取的库存组织数据
      materialOptions: [],
      itemNumData: [],
      labelPosition: 'right',
      status: true,
      priceTaxOptions: '',
      priceOptions: '',
      qtyOptions: '',
      materialId: '',                // 物料编码的id
      subcodeName: '',
      mateFormerHeaderValues: {},       // 头的值
      mateFormerLineValues: {
        lineNum: '',
        subcode: '',
        materialId: '',
        materialName: '',
        category: '',
        unit: '',
        qty: '',
        priceTax: '',
        price: '',
        money: '',
        orgId: '',
        needDate: '',
        promiseDate: '',
        contactCode: '',
        remark: ''
      },         // 明细行的值
      orgName: '',
      searchDialogVisible: false,
      rules: {
        qty: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' },
          { validator: validatePositivenumber, trigger: 'blur' }
        ],
        subcode: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        priceTax: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' },
          { validator: validatePositivenumberPrice, trigger: 'blur' }
        ],
        orgId: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        needDate: [
          { required: true, message: '该输入项为必输项', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    labelWidth: function () {
      let width = ''
      if (this.mate.inline) {
        width = '100px'
      } else if (typeof (this.mate.labelWidth) === 'undefined') {
        width = '100px'
      } else if (this.mate.labelWidth === null) {
        width = '100px'
      } else {
        width = this.mate.labelWidth
      }
      return width
    },
    // 是否禁用含税价格控件
    priceTaxDisabled(){
      let hasQty = this.mateFormerLineValues.qty ? false : true;
      return (true && this.hasPriceTex && hasQty) || (true && this.hasPriceTex);
    }
  },
  created () {
    this.mate.mateList.columns.map((i) => { this.object[i.name] = i })
    this.mate.mateFormerLine.fields.map((i) => { this.dialogObject[i.name] = i })
    this.mateFormerHeaderValues = this.mate.mateFormerHeader.values
    this.mateFormerLineValues = this.mate.mateFormerLine.values
  },
  methods: {
    setOrgOptions(data) {
      this.dialogObject['orgId'].options = data;
    },
    // 为了校验，将date转变为string类型
    changeDate () {
      this.mateFormerLineValues.needDate = DateFormat(this.mateFormerLineValues.needDate, 'yyyy-MM-dd')
    },
    changeOrg (val) {
      const vm = this
      this.dialogObject['orgId'].options.forEach(i => {
        if (i.value === val) {
          vm.orgName = i.label
        }
      })
    },
    // 在头里面选了库存组织，需要将相同的值传给明细行中的库存组织
    getOrgId (val) {
      const vm = this;
      this.mateFormerLineValues['orgId'] = val
      this.dialogObject['orgId'].options.forEach(i => {
        if (i.value === val) {
          vm.orgName = i.label
        }
      })
    },
    // 在头里面选机构，将机构的值传过来
    getOffice (val) {
      const vm = this
      this.$root.ajaxData(`/org/inventory/all?officeId=${val}`, {}, function (data) {
        vm.dialogObject['orgId'].options = []
        if (data.mate.rows !== []) {
          data.mate.rows.forEach(i => {
            vm.dialogObject['orgId'].options.push({ 'label': i.name, 'value': i.id })
          })
        }
      })
    },

    // 物料编码改变时
    async changeMate () {
      var vm = this; 
      await SERVICES.BASE.searchMaterials({
        subcode: this.mateFormerLineValues.subcode
      }).then(
        res => {
          this.getMateInfo(res.data.mate.rows[0])
        }
      )

      var val = this.mateFormerLineValues.materialId
      if (val) {
        this.$root.ajaxData('/purchase/qualified/supplier/check/' + this.mate.mateFormerHeader.values.companyId + '?itemId=' + val + '&officeId=' + this.mate.mateFormerHeader.values.officeId, {}, function (data) {
          if (data.data === false) {
            vm.message('info', '该供应商此物料没有成采购定价单,可以先生成采购定价单或者手动输入含税价格')
            // vm.message('warning', '该供应商此物料没有定价,需要先生成采购定价单')
            // vm.status = false
            return
          } else {
            vm.status = true
          }
        }, 'GET')
      }
    },
    message (type, message) {
      this.$message({
        type: type,
        message: message
      })
    },
    resetForm (formName) {
      this.$refs.QuotationSheetForm.$refs['ruleForm'].resetFields()
    },
    handleKtable (btn, row) {
      this.row = row
      this.btn = btn
      const vm = this
      const _this = this
      if (this.btn.action === 'addDetailBill' || this.btn.action === 'updateDetailBill') {
        this.$refs.QuotationSheetForm.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            _this.resetDialogForm();
            if (_this.btn.action === 'addDetailBill') { // 新增
              _this.dialogFormVisible = true
              _this.$nextTick(()=>{
                _this.$refs['ruleForm'].clearValidate()
              })
              _this.mateFormerLineValues.orgId = _this.mateFormerHeaderValues.orgId
            }
            if (_this.btn.action === 'updateDetailBill') { // 修改
              
              // 只有打开和变更可以改，其他的都不能改
              if (row.effective === 0 || row.effective === 4) {
                _this.dialogFormVisible = true
                _this.mateFormerLineValues = {...row};
                _this.$nextTick(()=>{ 
                  _this.$refs['ruleForm'].clearValidate()
                })
              } else {
                _this.dialogFormVisible = false
                _this.message('warning', '不能修改')
                return
              }
            }
          }else{
            _this.$message({
              message: "请先维护头表单信息",
              type: "info"
            });
          }
        })
      } else if (this.btn.action === 'deleteQuotation') {
        // 只有在审批状态是新增的时候才能删除明细行、否则不能删除
        if (this.mate.mateFormerHeader.values.id) {
          if (this.mate.mateFormerHeader.values.auditStatus != 0) {
            this.message('warning', '不能删除')
            return
          }
        }
        // 判断list中有的值和用户选择的值是否一致，若一致则将其删除
        if (this.selectedIds.length) {
          // this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          //   confirmButtonText: '确定',
          //   cancelButtonText: '取消',
          //   type: 'warning'
          // }).then(() => {
            const temp = []
            this.selectedIds.forEach(i => {
              temp[i] = true
            })
            const rows = this.mate.mateList.rows
            this.mate.mateList.rows = []
            rows.forEach(i => {
              if (!temp[i.lineNum]) {
                vm.mate.mateList.rows.push(i)
              }
            })
            for (let i = 0; i < this.mate.mateList.rows.length; i++) {
              this.mate.mateList.rows[i].lineNum = i + 1
            }
            this.message('success', '删除成功')
          // }).catch(() => {
          //   this.message('info', '已取消删除')
          // })
        } else {
          this.message('warning', '请选择明细行')
        }
      }
    },
    /** 价格是去焦点事件
     * 
     */
    blurQty (val) {
      this.mateFormerLineValues.priceTax = ''
      this.mateFormerLineValues.price = ''
      if (val === '') {
        return
      } else {
        var vm = this
        if (this.status === false) {
          vm.message('warning', '该供应商此物料没有定价')
          return
        } else {
          if(this.mateFormerLineValues.materialId){
            this.$root.ajaxData('/purchase/purchaseOrder/getTaxPrice/' + this.mateFormerHeaderValues.companyId + '/' + this.mateFormerHeaderValues.address + '/' + this.mateFormerLineValues.materialId + '/' + this.mateFormerLineValues.qty + '/' + this.mateFormerHeaderValues.officeId, {}, function (data) {
              if (data.priceTax === null) {
                vm.message('info', '该供应商此物料没有定价,请手动输入')
                // vm.message('warning', '该供应商此物料没有定价')
                // return
                vm.hasPriceTex = false;
              }else{
                vm.hasPriceTex = true;
                vm.mateFormerLineValues = Object.assign({}, vm.mateFormerLineValues, { 'priceTax': data.priceTax.toString(), 'price': data.price, 'money': data.priceTax * vm.mateFormerLineValues.qty })
              }
            }, 'GET')
          } else {
             vm.message('warning', '请选择物料')
             this.mateFormerLineValues.qty = ''
          }
        }
      }
    },
    changePriceTax (val) {
      let tax = this.mateFormerHeaderValues.tax;
      let price = this.mateFormerLineValues.price || (val / (1 + tax/100)).toFixed(4);
      this.mateFormerLineValues = Object.assign({}, this.mateFormerLineValues, { 'money': val * this.mateFormerLineValues.qty, 'price': price })
    },
    // 提交
    handleSubmit (ev) {
      this.buttonDisabled = true
      var vm = this
      var mate = {}
      // 对其进行校验
      this.$refs.QuotationSheetForm.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          mate.mateFormerHeader = this.mateFormerHeaderValues
          mate.mateList = this.mate.mateList.rows;
          if (!mate.mateList.length){
            // 保存的时候明细行不能为空
            this.$message({
              type: "warning",
              message: "明细行不能为空"
            });
            this.buttonDisabled = false;
            return false;
          }
          // 修改
          if (this.mate.mateFormerHeader.method === 'PUT' && this.mateFormerHeaderValues.id) {
            this.$root.ajaxData('/purchase/purchaseOrder/batchUpdate/' + this.mateFormerHeaderValues.id, mate, function (data) {
              if (data.code === 500) {
                vm.buttonDisabled = false
              }
              vm.$root.monitor({ url: '/purchase/purchaseOrder/all/list' })
            }, 'PUT')
            // 新增
          } else if (this.mate.mateFormerHeader.method === 'POST') {
            this.$root.ajaxData('/purchase/purchaseOrder/batchSave', mate, function (data) {
              if (data.code === 500) {
                vm.buttonDisabled = false
              }
              vm.$root.monitor({ url: '/purchase/purchaseOrder/all/list' })
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
      this.$root.monitor({ url: '/purchase/purchaseOrder/all/list' })
    },
    // 弹出框提交
    dialogSubmit () {
      let _this = this;
      if (this.status === false) {
        this.message('warning', '该供应商此物料没有定价')
        return
      }
      // this.mateFormerLineValues.promiseDate = DateFormat(this.mateFormerLineValues.promiseDate, 'yyyy-MM-dd')
      // this.mateFormerLineValues.needDate = DateFormat(this.mateFormerLineValues.needDate, 'yyyy-MM-dd')
      // 判断获取到的数据中是否有lineNum属性，该属性在对应的数据库表中没有
      if (!this.mateFormerLineValues.lineNum) {
        // 拷贝
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            _this.mateFormerLineValues.subcode = _this.subcode
            _this.mateFormerLineValues.orgName = _this.orgName
            _this.mateFormerLineValues.effective = 0
            _this.mateFormerLineValues.lineNum = (_this.mate.mateList.rows.length + 1)
            const mateFormerValues = Object.assign({}, _this.mateFormerLineValues)

            _this.mate.mateList.rows.push(mateFormerValues)
            _this.dialogFormVisible = false
          } else {
            _this.$notify.error({
              title: '消息',
              message: '数据验证未通过'
            })
          }
        })
      } else {
        for (var i = 0; i < this.mate.mateList.rows.length; i++) {
          if (_this.mateFormerLineValues.lineNum === _this.mate.mateList.rows[i].lineNum) {
            if (_this.subcode) {
              _this.mateFormerLineValues.subcode = _this.subcode
            }
            _this.mateFormerLineValues.orgName = _this.orgName
            const mateFormerValues1 = Object.assign({}, _this.mateFormerLineValues)
            _this.$refs.ruleForm.validate((valid) => {
              if (valid) {
                // splice将i行数据删除，并将mateFormerValues1填充进去
                if (_this.mateFormerLineValues.materialId === _this.mate.mateList.rows[i].materialId) {
                  _this.mate.mateList.rows.splice(i, 1, mateFormerValues1)
                } else {
                  _this.mate.mateList.rows.splice(i, 1, mateFormerValues1)
                  _this.$set(_this.mate.mateList.rows[i], 'subcode', this.subcode)
                }
                _this.dialogFormVisible = false
                // _this.mateFormerLineValues = {}
                // _this.$refs['ruleForm'].resetFields()
              } else {
                _this.$notify.error({
                  title: '消息',
                  message: '数据验证未通过'
                })
              }
            })
          }
        }
      }
      var sum = 0
      for (let i = 0; i < this.mate.mateList.rows.length; i++) {
        sum += this.mate.mateList.rows[i].money
      }
      this.mateFormerHeaderValues.total = sum
    },
    dialogBackward () {
      this.dialogFormVisible = false
    },
    handleSelected (val) {
      // 先清空，然后赋值，这样就不用去重了
      this.selectedIds = []
      this.multipleSelection = val;
      if (val) {
        val.forEach(i => {
          this.selectedIds.push(i.lineNum)
        })
      }
    },
    handleSearch(){
      this.searchDialogVisible = true
    },
    getMateInfo({id, subcode,name,materialCategory,basicUnit,...data}){
      this.mateFormerLineValues = {
        ...this.mateFormerLineValues,
        'subcode': subcode,
        'materialId': id,
        'materialName': name,
        'category': materialCategory,
        'unit': basicUnit,
      }
      this.materialId = id;
      this.subcode = this.subcodeName = subcode
    },
    resetDialogForm(){
      let values = this.mateFormerLineValues;
      values['id'] = '';
      values['subcode'] = '';
      values['materialId'] = '';
      values['materialName'] = '';
      values['category'] = '';
      values['unit'] = '';
      values['qty'] = '';
      values['priceTax'] = '';
      values['price'] = '';
      values['money'] = '';
      values['orgId'] = this.mateFormerHeaderValues.orgId;
      values['needDate'] = '';
      values['upromiseDatenit'] = '';
      values['contactCode'] = '';
      values['remark'] = '';
      values['lineNum'] = '';
    }
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
.table-margin{
  margin-top:20px;
}
.sbutton{
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
.el-dialog__header {
  padding: 10px 10px 0;
}
.el-dialog__body {
  padding: 10px 10px;
}
.tbutton{
  margin: 3px 0;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}
.el-select,.el-date-editor{
  width: 100%;
}
</style>
