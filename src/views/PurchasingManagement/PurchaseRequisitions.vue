<!-- 请购单 -->
<template>
  <div>
    <div class="tbutton">
      <el-button size="mini" plain class="el-icon-document" :disabled="buttonDisabled" @click="handleSubmit">提 交</el-button>
      <el-button size="mini" plain class="el-icon-close" @click="backward">取 消</el-button>
      <el-button size="mini" plain class="el-icon-date"  @click="resetForm('ruleForm1')">重 置</el-button>
    </div>
      <el-row>
        <!--请购单主表单-->
        <el-form size="mini" :model="mate.mateFormerHeader.values" :inline="mate.inline" label-position="right" ref="ruleForm1"  :rules="rules" :labelWidth="labelWidth">
          <template>
              
              <el-col :sm="24" :md="12" :lg="8" >
                <el-form-item :label="object['orderNumber'].label"  :prop="object['orderNumber'].name">
                  <el-input disabled v-model="mate.mateFormerHeader.values[object['orderNumber'].name]"></el-input>
                </el-form-item>
              </el-col>
                
              <el-col :sm="24" :md="12" :lg="8">
                <el-form-item :label="object['orderType'].label" :prop="object['orderType'].name">
                  <el-input disabled v-model="mate.mateFormerHeader.values[object['orderType'].name]"></el-input>
                </el-form-item>
              </el-col>

              <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="object['officeId'].label" :prop="object['officeId'].name">
                      <el-select clearable   filterable @change="changeOffice"  v-model="mate.mateFormerHeader.values[object['officeId'].name]"  :placeholder="object['officeId'].placeholder" >
                        <el-option :label="item.label" :value="item.value" v-for="item of officeIdOptions" :key="item.name"></el-option>
                      </el-select>
                    </el-form-item>
                </el-col>

              <!--获取组织-->
                <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="object['orgId'].label" :prop="object['orgId'].name">
                      <el-select clearable    filterable v-model="mate.mateFormerHeader.values[object['orgId'].name]"  :placeholder="object['orgId'].placeholder" >
                            <el-option :label="item.label" :value="item.value" v-for="item of orgIdOptions" :key="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

              <!-- <el-col :sm="12" :md="8" :lg="7">
                    <el-form-item :label="object['origin'].label"  :prop="object['origin'].name">
                        <dict-selected @input="visibleChangeOrigin(mate.mateFormerHeader.values[object['origin'].name])" v-model="mate.mateFormerHeader.values[object['origin'].name]" dictType="origin" :initValue="mate.mateFormerHeader.values[object['origin'].name]"></dict-selected>
                    </el-form-item>
              </el-col>
                -->
                <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="object['supplierId'].label"  :prop="object['supplierId'].name">
                        <el-select clearable @visible-change="visibleAdress" @change="changeSupplier(mate.mateFormerHeader.values[object['supplierId'].name])"  filterable v-model="mate.mateFormerHeader.values[object['supplierId'].name]"  :placeholder="object['supplierId'].placeholder" >
                          <el-option :label="item.label" :value="item.value" v-for="item of supplierOptions" :key="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                    
              <el-col :sm="24" :md="12" :lg="8">
                  <el-form-item :label="object['address'].label"  :prop="object['address'].name">
                      <el-select clearable filterable   v-model="mate.mateFormerHeader.values[object['address'].name]" :placeholder="object['address'].placeholder" :disabled="showAddress">
                          <el-option :label="item.label" :value="item.value" v-for="item of addressOptions" :key="item.name"></el-option>
                        </el-select>
                    </el-form-item>
              </el-col>
            
              <el-col :sm="24" :md="12" :lg="8">
                  <el-form-item :label="object['currency'].label"  :prop="object['currency'].name">
                      <dict-selected v-model="mate.mateFormerHeader.values[object['currency'].name]" dictType="currencyType" :initValue="mate.mateFormerHeader.values[object['currency'].name]"></dict-selected>
                    </el-form-item>
              </el-col>

                <el-col :sm="24" :md="12" :lg="8">
                  <el-form-item  :label="object['paymentCondition'].label" :prop="object['paymentCondition'].name">
                    <dict-selected  v-model="mate.mateFormerHeader.values[object['paymentCondition'].name]" :initValue="mate.mateFormerHeader.values[object['paymentCondition'].name]" dictType="paymentMethod"></dict-selected>
                  </el-form-item>
                </el-col>

                  <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="object['applicant'].label"  :prop="object['applicant'].name">
                        <el-select clearable filterable v-model="mate.mateFormerHeader.values[object['applicant'].name]" :placeholder="object['applicant'].placeholder">
                            <el-option :label="item.label" :value="item.value" v-for="item of applicantOptions" :key="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="object['contact'].label"  :prop="object['contact'].name">
                        <el-select clearable filterable v-model="mate.mateFormerHeader.values[object['contact'].name]" :placeholder="object['applicant'].placeholder">
                            <el-option :label="item.label" :value="item.value" v-for="item of applicantOptions" :key="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="object['auditor'].label"  :prop="object['auditor'].name">
                        <el-input disabled v-model="mate.mateFormerHeader.values[object['auditor'].name]"></el-input>
                    </el-form-item>
                </el-col>
                
                <el-col :sm="24" :md="12" :lg="8">
                  <el-form-item :label="object['createAt'].label" :prop="object['createAt'].name">
                    <el-date-picker disabled  type="date" v-model="mate.mateFormerHeader.values[object['createAt'].name]"></el-date-picker>
                  </el-form-item>
                </el-col>

                <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="object['instruction'].label"  :prop="object['instruction'].name">
                        <el-input v-model="mate.mateFormerHeader.values[object['instruction'].name]"></el-input>
                    </el-form-item>
                </el-col>
          </template>
        </el-form>
      </el-row>  
  <div class="fbutton">
    <el-button size="mini" class="el-icon-plus"  plain  @click="add">新 增</el-button>
    <el-button size="mini" class="el-icon-edit" plain @click="edit">修 改</el-button>
    <el-button size="mini" class="el-icon-delete" plain @click="del">删 除</el-button>
    <el-button size="mini" class="el-icon-download" plain @click="downloadLine">下载模板</el-button>
    <el-button size="mini" class="el-icon-upload2" plain @click="importLine">导入</el-button>
  </div> 
  <div> 
    <!-- 明细行显示 -->
    <el-table size="mini" :data="list.rows"  border fit highlight-current-row @selection-change="lineSelected" show-overflow-tooltip>
        <el-table-column type="selection"></el-table-column>
        <el-table-column show-overflow-tooltip :label="objectColumns['lineNum'].label" :prop="objectColumns['lineNum'].name"></el-table-column>
        <el-table-column show-overflow-tooltip :label="objectColumns['materialCode'].label" :prop="objectColumns['materialCode'].name"></el-table-column>
        <el-table-column show-overflow-tooltip :label="objectColumns['materialName'].label" :prop="objectColumns['materialName'].name"></el-table-column>
        <el-table-column show-overflow-tooltip :label="objectColumns['instruction'].label" :prop="objectColumns['instruction'].name"></el-table-column>
        <el-table-column show-overflow-tooltip :formatter="objectColumns['category'].formatter" :label="objectColumns['category'].label" :prop="objectColumns['category'].name"></el-table-column>
        <el-table-column show-overflow-tooltip :label="objectColumns['qty'].label" :prop="objectColumns['qty'].name"></el-table-column>
        <el-table-column show-overflow-tooltip :label="objectColumns['unit'].label" :prop="objectColumns['unit'].name"></el-table-column>
        <el-table-column show-overflow-tooltip :label="objectColumns['price'].label" :prop="objectColumns['price'].name"></el-table-column>
        <el-table-column show-overflow-tooltip :label="objectColumns['amount'].label" :prop="objectColumns['amount'].name"></el-table-column>
        <el-table-column show-overflow-tooltip :label="objectColumns['requiredDate'].label" :prop="objectColumns['requiredDate'].name"></el-table-column>
        <el-table-column show-overflow-tooltip :label="objectColumns['workOrderCode'].label" :prop="objectColumns['workOrderCode'].name"></el-table-column>
        <el-table-column show-overflow-tooltip :label="objectColumns['demandName'].label" :prop="objectColumns['demandName'].name"></el-table-column>
    </el-table>
    <!-- 填写请购单明细弹出框-->
    <el-dialog title="请购单明细" :visible.sync="dialogVisible" width="80%" >
      <el-row>
        <el-form size="mini" :model="lineform.values" label-position="right" ref="ruleForm"  :rules="rules" :label-width="labelWidth">

          <el-input v-model="lineform.values[dialogObject['lineNum'].name]" style="display:none;"></el-input>

            <el-col :sm="12" :md="8" :lg="6">
              <el-form-item :label="dialogObject['materialId'].label" :prop="dialogObject['materialId'].name" >
                <el-input v-model="lineform.values['materialCode']" @change="changeMate">
                  <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="8" :lg="6">
              <el-form-item :label="dialogObject['materialName'].label" :prop="dialogObject['materialName'].name" >
                <el-input :readonly="true" v-model="lineform.values[dialogObject['materialName'].name]"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="8" :lg="6">
              <el-form-item :label="dialogObject['instruction'].label" :prop="dialogObject['instruction'].name" >
                <el-input  :readonly="true" v-model="lineform.values[dialogObject['instruction'].name]"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="8" :lg="6">
              <el-form-item :label="dialogObject['category'].label" :prop="dialogObject['category'].name" >
                <el-input readonly v-model="lineform.values[dialogObject['category'].name]"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="8" :lg="6">
              <el-form-item :label="dialogObject['unit'].label" :prop="dialogObject['unit'].name" >
                <el-input :readonly="true" v-model="lineform.values[dialogObject['unit'].name]"></el-input>
              </el-form-item>
            </el-col>
            <!--数量-->
            <el-col :sm="12" :md="8" :lg="6">
              <el-form-item :label="dialogObject['qty'].label" :prop="dialogObject['qty'].name" >
                <el-input type="number" v-model="lineform.values[dialogObject['qty'].name]" @change="changeQty"></el-input>
              </el-form-item>
            </el-col>
            <!--单价-->
            <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="dialogObject['price'].label">
                  <el-input-number v-model.number="lineform.values[dialogObject['price'].name]" @change="changePrice" :min="0" label="请输入价格" :precision="2" :controls='inputNumberControls'></el-input-number>
                </el-form-item>
            </el-col>
            <!--金额-->
            <el-col :sm="12" :md="8" :lg="6">
              <el-form-item :label="dialogObject['amount'].label" :prop="dialogObject['amount'].name" >
                <el-input :readonly="true" type="number" v-model="lineform.values[dialogObject['amount'].name]"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="8" :lg="6">
              <el-form-item :label="dialogObject['requiredDate'].label" :prop="dialogObject['requiredDate'].name" >
                <el-date-picker value-format="yyyy-MM-dd" clearable v-model="lineform.values[dialogObject['requiredDate'].name]" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </el-col>
            
            <el-col :sm="12" :md="8" :lg="6">
              <el-form-item :label="dialogObject['remark'].label" :prop="dialogObject['remark'].name" >
                <el-input  v-model="lineform.values[dialogObject['remark'].name]"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="8" :lg="6">
              <el-form-item :label="dialogObject['workOrderCode'].label" :prop="dialogObject['workOrderCode'].name" >
                <el-input  v-model="lineform.values[dialogObject['workOrderCode'].name]"></el-input>
              </el-form-item>
            </el-col>

            <!--需求人-->
            <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="dialogObject['demandName'].label" :prop="dialogObject['demandName'].name" >
                    <el-select  clearable  filterable  v-model="lineform.values[dialogObject['demandName'].name]" >
                        <el-option :label="item.label" :value="item.value" v-for="item of demandNameOptions" :key="item.name"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>

          </el-form>
        </el-row>
        <div class="pbutton">
          <el-button @click="submit">提 交</el-button>
          <el-button @click="back">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 物料搜索框-->
      <MaterialSearch v-if="searchDialogVisible" :orgId="mate.mateFormerHeader.values['orgId']" :visible.sync="searchDialogVisible" @getMateInfo="getMateInfo"></MaterialSearch>

    </div>
    <!-- 导入/上传文件 -->
    <input type="file" ref="excelFile" style="display:none" @change="fileUpload" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
  </div>  
</template>
<script>
import treeSelect from '../../components/tree-select/tree.vue'
function trimSpace (str) {
  try {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
  } catch (e) {
    return str
  }
}
import { DateFormat, isPositiveinteger, isPositivenumber } from '../../utils/util.js'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
import SERVICES from '@/services';
import { PURCHASING_MANAGEMENT_API } from '@/services/apis';

// 取小数位后2位
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
  data () {
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
    var validatePrice = (rule, value, callback) => {
          // obj = obj.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
          // obj = obj.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
          // obj = obj.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
          // obj = obj.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
          // if(obj.indexOf(".")< 0 && obj !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
          //     obj = parseFloat(obj);
          // }
      // if(){
      //
      // }
          console.log('validatePrice:'+value);
      if(/\\.{2,}/g.test(value)){
          console.log('只保留第一个:'+value);
        callback(new Error('输入的单价有多余的小数点'));
      }else if(/^(\\-)*(\\d+)\\.(\\d\\d).*$/.test(value)){
          console.log('只能输入两个小数:'+value);
        callback(new Error('输入的单价只能输入两个小数'))
      }else{
        callback();
      }

    }
    return {
      inputNumberControls: false,
      buttonDisabled: false,
      lineform: {},
      list: {},
      object: {},
      objectColumns: {},
      dialogObject: {},
      dialogVisible: false,
      applicantOptions: [],
      demandNameOptions: [],
      handledByOptions: [],
      supplierOptions: [],
      orgIdOptions: [],
      officeIdOptions: [],
      addressOptions: [],
      supplierData: [],
      materialOptions: [],
      showSupplier: true,
      showAddress: true,
      materialCode: '',
      orgTogName: '',
      productCodeData: {},
      amount: '',
      mateFormerRows: [],
     // orgTopName:'',
      rules: {
        applicant:{ required: true, message: '该输入项为必输项' },
        handledBy:{ required: true, message: '该输入项为必输项' },
        materialId:{ required: true, message: '该输入项为必输项' },
        type:{ required: true, message: '该输入项为必输项' },
        qty: [
          { required: true, message: '该输入项为必输项' },
          { validator: validatePositiveinteger, trigger: 'change' },
          { validator: validatePositiveinteger, trigger: ' blur' }
        ],
        price: [
          { validator: validatePrice, trigger: 'blur' }
        ],
        requiredDate:{ required: true, message: '该输入项为必输项' },
        orgId:{ required: true, message: '该输入项为必输项' },
        origin:{ required: true, message: '该输入项为必输项' }
      },
      selectedLines: [],
      lineNum: null,
      itemId: null,
      searchDialogVisible: false,
      category: []
    }
  },
  components: {
    'tree-selected': function index (resolve) {
      require(['../../components/TreeSelected.vue'], resolve)
    },
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
    },
    MaterialSearch: function index (resolve) {
      require(['@/components/MaterialSearch.vue'], resolve)
    },
    treeSelect
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
    this.formatterBefore(this.mate.mateListLine.columns)
    this.mate.mateFormerHeader.fields.map((i) => { this.object[i.name] = i })
    this.lineform = this.mate.mateFormerLine
    this.lineform.fields.map((i) => { this.dialogObject[i.name] = i })
    this.list = this.mate.mateListLine
    this.list.columns.map((i) => { this.objectColumns[i.name] = i });
    this.getSupplier()// 获取供应商
    this.getUser()// 获取申请人、编制人
    this.getShow()// 修改显示问题
    this.getOfficeId()
    this.getCategory()
  },
  methods: {
    materialChange (data) {
      for (const i of data) {
        i.label = i.name
        i.value = i.id
        if (i.children) {
          this.materialChange(i.children)
        }
      }
      return data
      },
    getCategory(){
      SERVICES.BASE.getMaterialsCategory().then(
        res => {
          this.category =  this.materialChange(res.data)
        }
      )
    },
    /** 下载 excl 模板 
     * @param void
     * @return void
     */
    downloadLine() {
      // 下载模板接口
      let url = PURCHASING_MANAGEMENT_API.PURCHASE_REQUISITIONS_EXPORT;
      // 下载模板命名
      let fileName = '请购单行模板';
      // 下载模板接口方法
      let methods = 'POST';
      // 下载模板
      SERVICES.BASE.downTemplateExcel(url, methods, fileName);
    },
    /** 导入行数据
     * @param void
     * @return void
     */
    importLine() {
      this.$refs.excelFile.click();
    },
    fileUpload(file) {
      let headerId = this.mate.mateFormerHeader.values.id || "";
      // 导入模板接口
      let url = PURCHASING_MANAGEMENT_API.PURCHASE_REQUISITIONS_IMPORT;
      url += `?headerId=${headerId}`;
      // 下载模板接口方法
      let methods = 'POST';
      // 导入数据
      let formdata = new FormData();
      formdata.append('file', file.target.files[0]);
      SERVICES.BASE.uploadTemplateExcel(url, methods, formdata, this.uploadSuccess);
    },
    uploadSuccess(res){
      this.$refs.excelFile.value = '';
      this.mate.mateListLine.rows = res.data;
    },
    // 显示物料名称
    getShow () {
      if (this.mate.mateFormerHeader.values.origin === '0') {
        this.showSupplier = false
      }
    },
    changeMate () {
      SERVICES.BASE.searchMaterials({
        subcode: this.lineform.values.materialCode
      }).then(
        res => {
          this.getMateInfo(res.data.mate.rows[0])
        }
      )
    },
     // 获取到机构
    getOfficeId () {
      const vm = this
      this.$root.ajaxData('/users/office', {}, function (data) {
        data.forEach(i => {
          vm.officeIdOptions.push({ 'label': i.orgName, 'value': i.officeId })
        })
        if (!vm.mate.mateFormerHeader.values.id) {
          vm.mate.mateFormerHeader.values.officeId = vm.officeIdOptions[0].value
          vm.changeOffice(vm.mate.mateFormerHeader.values.officeId)
        }
      }, 'GET')
    },
    changeOffice (val) {
      const vm = this
        // 将数据传给父组件、父组件中的明细行中有库存组织
        // 在改变了之后要清空
      vm.orgIdOptions = []
      this.$root.ajaxData(`/org/inventory/all?dataOnly=true`, {}, function (data) {
        data.forEach(i => {
          vm.orgIdOptions.push({ 'label': i.name, 'value': i.id })
        })
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    changeQty () {
      var qty = this.lineform.values.qty
      var price = this.lineform.values.price
      var amount = qty * price
      this.lineform.values.amount = toDecimal(amount)
    },
    changePrice () {
      var qty = this.lineform.values.qty;
      var price = this.lineform.values.price;
      var amount = qty * price;
      this.lineform.values.amount = toDecimal(amount);
    },
     // 获取供应商下拉选
    getSupplier () {
      var vm = this
      // /purchase/qualified/supplier/getQualifySupplier
      this.$root.ajaxData('/companys/companyInfo/3?auditStatus=1&nopaging=1&status=1&dataOnly=true', {}, function (data) {
        vm.supplierData = data
        for (let i = 0; i < data.length; i++) {
          vm.supplierOptions.push({ label: data[i].name, value: data[i].id, key: data[i].id })
        }
      }, 'GET')
    },
      // 获取申请人、编制人下拉选
    getUser () {
      var vm = this
      this.$root.ajaxData('/purchase/reqPurchase/getUsers', {}, function (data) {
        for (let i = 0; i < data.length; i++) {
          vm.applicantOptions.push({ label: data[i].username, value: data[i].id, key: data[i].id })
          vm.handledByOptions.push({ label: data[i].username, value: data[i].id, key: data[i].id })
          vm.demandNameOptions.push({ label: data[i].username, value: data[i].id, key: data[i].id })
        }
      }, 'GET')
    },
     // 来源为供应商时  供应商下拉选才可以选
    visibleChangeOrigin (val) {
      if (this.mate.mateFormerHeader.values.origin === '1') {
        this.mate.mateFormerHeader.values.supplierId = ''
        this.showSupplier = true
        this.showAddress = true
      } else {
        this.showSupplier = false
      }
    },
    visibleAdress (flag) {
      if (!flag) {
        this.showAddress = false
        this.$set(this.mate.mateFormerHeader.values, 'address', '')
      }
    },
    changeSupplier (val) {
      var vm = this
      vm.materialOptions = []
      vm.addressOptions = []
      this.supplierData.forEach((i) => {
        if (i.id === val) {
          for (let j = 0; j < i.addressList.length; j++) {
            vm.addressOptions.push({ label: i.addressList[j].name, value: i.addressList[j].name })
          }
        }
      })
      if (val === '') {
        this.addressOptions = []
        vm.$set(vm.mate.mateFormerHeader.values, 'address', '')
        if (vm.mate.mateFormerHeader.values.orgId === '' || vm.mate.mateFormerHeader.values.orgId === null) {
          vm.$message({
            message: '请选择收货库存组织',
            type: 'warning'
          })
          return
        } else {
          this.$root.ajaxData('/materials/getMaterialByOrg/' + vm.mate.mateFormerHeader.values.orgId, {}, function (data) {
            for (let i = 0; i < data.length; i++) {
              vm.productCodeData = data
              vm.materialOptions.push({ label: data[i].subcode, value: data[i].id, unit: data[i].basicUnit, materialName: data[i].name })
            }
          }, 'GET')
        }
      } else {
        if (vm.mate.mateFormerHeader.values.address === null) {
          return
        }
        if (vm.mate.mateFormerHeader.values.orgId === '' || vm.mate.mateFormerHeader.values.orgId === null) {
          vm.$message({
            message: '请选择收货库存组织',
            type: 'warning'
          })
          return
        } else {
          this.$root.ajaxData('/materials/getMaterialByOrg/' + vm.mate.mateFormerHeader.values.orgId, {}, function (data) {
          for (let i = 0; i < data.length; i++) {
            vm.productCodeData = data
            vm.materialOptions.push({ label: data[i].subcode, value: data[i].id, unit: data[i].unit, materialName: data[i].name })
          }
        }, 'GET')
        }
      }
    },
    getOrgName (val) {
      this.orgTogName = val
    },
    add () {
      this.getMaterial
      this.lineform.values[this.dialogObject['lineNum'].name] = ''
      var vm = this
      vm.materialOptions = []

      if (this.mate.mateFormerHeader.values.orgId === '' || this.mate.mateFormerHeader.values.orgId === null) {
        vm.$message({
          message: '请选择收货库存组织',
          type: 'warning'
        })
        return
      }
      this.dialogVisible = true
      this.$root.ajaxData('/materials/getMaterialByOrg/' + vm.mate.mateFormerHeader.values.orgId, {}, function (data) {
        for (let i = 0; i < data.length; i++) {
          vm.productCodeData = data
          vm.materialOptions.push({ label: data[i].subcode, value: data[i].id, materialName: data[i].name })
        }
      }, 'GET')
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
        vm.materialOptions = []
        this.$root.ajaxData('/materials/getMaterialByOrg/' + vm.mate.mateFormerHeader.values.orgId, {}, function (data) {
          for (let i = 0; i < data.length; i++) {
            vm.productCodeData = data
            vm.materialOptions.push({ label: data[i].subcode, value: data[i].id, unit: data[i].unit, materialName: data[i].name, specification: data[i].specification })
          }
        }, 'GET')
        this.dialogVisible = true
        for (var m = 0; m < this.mate.mateListLine.rows.length; m++) {
          if (this.mate.mateListLine.rows[m].lineNum === this.selectedLines[this.selectedLines.length - 1].lineNum) {
            this.mate.mateFormerLine.values = Object.assign({}, this.mate.mateListLine.rows[m])
            return true
          }
        }
      }
    },
    backward () {
      this.$root.monitor({ url: '/purchase/reqPurchase/all/list' })
    },
    // 请购单提交
    handleSubmit () {
      this.buttonDisabled = true
      var mate = {}
      var vm = this
      this.$refs['ruleForm1'].validate((valid) => {
        if (valid) {
          if (this.list.rows.length === 0) {
            vm.$message({
              message: this.$t('Detailed data can not be empty'),
              type: 'warning'
            })
            this.buttonDisabled = false
            return
          }
          mate.mateFormerHeader = this.mate.mateFormerHeader.values
          mate.mateList = this.list.rows
          if (this.mate.mateFormerHeader.method === 'PUT') {
            this.$root.ajaxData('/purchase/reqPurchase/batchUpdate/' + this.mate.mateFormerHeader.values.id, mate, function (data) {
              vm.$root.monitor({ url: '/purchase/reqPurchase/all/list' })
            }, 'PUT')
          } else {
            this.$root.ajaxData('/purchase/reqPurchase/batchSave', mate, function (data) {
              vm.$root.monitor({ url: '/purchase/reqPurchase/all/list' })
            }, 'POST')
          }
        } else {
          this.buttonDisabled = false
          return false
        }
      })
    },
      // 弹出框消失  清除数据
    back () {
      this.dialogVisible = false
      this.$refs['ruleForm'].resetFields()
      for (var idx in this.lineform.values) {
        this.lineform.values[idx] = null
      }
    },
      // 弹出框提交  之后清除数据
    submit () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.lineform.values[this.dialogObject['lineNum'].name] === undefined || trimSpace(this.lineform.values[this.dialogObject['lineNum'].name]) === '') {
            let lineValues = {...this.lineform.values};
            lineValues.id = null;
            lineValues.itemId = this.itemId;
            lineValues.lineNum = this.list.rows.length + 1;
            lineValues.materialCode = this.materialCode;
            lineValues.orgTopName = this.orgTogName;
            this.list.rows.push(lineValues);
            // this.list.rows.push({
            //   id: null, itemId: this.itemId,
            //   lineNum: this.list.rows.length + 1,
            //   materialCode: this.materialCode,
            //   orgTopName: this.orgTogName,
            //   materialId: this.lineform.values[this.dialogObject['materialId'].name],
            //   materialName: this.lineform.values[this.dialogObject['materialName'].name],
            //   category: this.lineform.values[this.dialogObject['category'].name],
            //   type: this.lineform.values[this.dialogObject['type'].name],
            //   qty: this.lineform.values[this.dialogObject['qty'].name],
            //   unit: this.lineform.values[this.dialogObject['unit'].name],
            //   price: this.lineform.values[this.dialogObject['price'].name],
            //   amount: this.lineform.values[this.dialogObject['amount'].name],
            //   requiredDate: this.lineform.values[this.dialogObject['requiredDate'].name],
            //   deliverNum: this.lineform.values[this.dialogObject['deliverNum'].name],
            //   shipAddress: this.lineform.values[this.dialogObject['shipAddress'].name],
            //   orderNumber: this.lineform.values[this.dialogObject['orderNumber'].name],
            //   orgIdTop: this.lineform.values[this.dialogObject['orgIdTop'].name],
            //   instruction: this.lineform.values[this.dialogObject['instruction'].name],
            //   workOrderCode: this.lineform.values[this.dialogObject['workOrderCode'].name]
            // })
          } else {
            for (var i = 0; i < this.mate.mateListLine.rows.length; i++) {
              if (this.mate.mateFormerLine.values.lineNum === this.mate.mateListLine.rows[i].lineNum) {
                const mateFormerValues1 = Object.assign({}, this.mate.mateFormerLine.values)
                this.$refs.ruleForm.validate((valid) => {
                  if (valid) {
                // splice将i行数据删除，并将mateFormerValues1填充进
                    if (this.mate.mateFormerLine.values.materialId === this.mate.mateListLine.rows[i].materialId) {
                      this.mate.mateListLine.rows.splice(i, 1, mateFormerValues1)
                    } else {
                      this.mate.mateListLine.rows.splice(i, 1, mateFormerValues1)
                      this.$set(this.mate.mateListLine.rows[i], 'materialCode', this.materialCode)
                    }
                    this.dialogFormVisible = false
                    this.mate.mateFormerLine.values = {}
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
          this.$refs['ruleForm'].resetFields()
          for (var idx in this.lineform.values) {
            this.lineform.values[idx] = null
          }
          this.lineform.values[this.dialogObject['lineNum'].name] = ''
          this.dialogVisible = false
        } else {
          this.$notify.error({
            title: '消息',
            message: '数据验证未通过'
          })
          return false
        }
      })
    },
    lineSelected (val) {
      this.selectedLines = val
    },
    // 删除明细行
    del () {
      var vm = this
      var rows = this.selectedLines
      if (rows.length === 0) {
        vm.$message({
          message: vm.$t('seladata'),
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
              id: this.list.rows[i].id, itemId: this.list.rows[i].itemId, materialId: this.list.rows[i].materialId, materialName: this.list.rows[i].materialName, materialCode: this.list.rows[i].materialCode, category: this.list.rows[i].category, type: this.list.rows[i].type, qty: this.list.rows[i].qty,
              unit: this.list.rows[i].unit, price: this.list.rows[i].price, amount: this.list.rows[i].amount, applicant: this.list.rows[i].applicant, requiredDate: this.list.rows[i].requiredDate, deliverNum: this.list.rows[i].deliverNum,
              shipAddress: this.list.rows[i].shipAddress, orderNumber: this.list.rows[i].orderNumber, orgIdTop: this.list.rows[i].orgIdTop, orgTopName: this.list.rows[i].orgTopName, instruction: this.list.rows[i].instruction
            })
          }
        }
        this.list.rows = []
        for (var z = 0; z < tmpRows.length; z++) {
          this.list.rows.push({
            id: tmpRows[z].id, lineNum: z + 1, itemId: tmpRows[z].itemId, materialId: tmpRows[z].materialId, materialName: tmpRows[z].materialName, materialCode: tmpRows[z].materialCode, category: tmpRows[z].category, type: tmpRows[z].type, qty: tmpRows[z].qty,
            unit: tmpRows[z].unit, price: tmpRows[z].price, amount: tmpRows[z].amount, applicant: tmpRows[z].applicant, requiredDate: tmpRows[z].requiredDate, deliverNum: tmpRows[z].deliverNum,
            shipAddress: tmpRows[z].shipAddress, orderNumber: tmpRows[z].orderNumber, orgIdTop: tmpRows[z].orgIdTop, orgTopName: tmpRows[z].orgTopName, instruction: tmpRows[z].instruction
          })
        }
      }
    },
    handleSearch(){
      this.searchDialogVisible = true
    },
    getMateInfo({id,subcode,name,materialCatgsName,basicSpec, basicUnit, ...data}){
      this.lineform.values = {
        ...this.lineform.values,
        'materialId': id,
        'materialCode': subcode,
        'materialName': name,
        'instruction': basicSpec,
        'unit': basicUnit,
        'category': materialCatgsName,
      }
      this.materialCode = subcode
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
.pbutton {
  margin: 3px 0;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}

</style>
<style>
  .el-form-item__content .el-input-number{
    width: 100%;
  }
  .el-form-item__content .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
