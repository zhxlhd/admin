<!-- 采购定价新增页面 -->
<template>
  <div>
    <div class="tbutton">
      <el-button plain class="el-icon-document" :disabled="buttonDisabled" @click="handleSubmit">提 交</el-button>
      <el-button plain class="el-icon-close" @click="backward" v-if="!mate.inline">取 消</el-button>
      <el-button plain class="el-icon-date"  @click="resetForm('GoodsPriceForm')">重 置</el-button>
    </div>

    <GoodsPriceForm :mate="form" ref="GoodsPriceForm"></GoodsPriceForm>

    <div class="fbutton">
      <el-button  class="el-icon-plus" plain @click="add">新 增</el-button>
      <el-button  class="el-icon-edit" plain @click="edit">修 改</el-button>
      <el-button class="el-icon-delete" plain  @click="del" v-if="!mate.inline">删 除</el-button>
      <el-button size="mini" class="el-icon-download" plain @click="downloadLine">下载模板</el-button>
      <el-button size="mini" class="el-icon-upload2" plain @click="importLine">导入</el-button>
    </div>

    <el-dialog title="填写商品定价明细" :visible.sync="dialogVisible" width="80%" :before-close="dlgClose">
      <template>
        <div>
          <el-row>
            <el-form :model="lineform.values" :inline="lineform.inline" :label-position="labelPosition" ref="ruleForm" :rules="rules" :label-width="'120px'" size="mini">
              <template>

                <el-input v-model="lineform.values[object['itemNumber'].name]" style="display:none;"></el-input>

                <el-col :sm="12" :md="8" :lg="6">
                  <el-form-item :label="object['materialId'].label" :prop="object['materialId'].name">
                    <el-select clearable filterable  @change="changeCode(lineform.values[object['materialId'].name])" v-model="lineform.values[object['materialId'].name]" class="full-width">
                      <el-option :label="item.label" :value="item.value" v-for="item of materialOptions" :key="item.name">
                        <span style="float: left;margin-right:30px">{{ item.label }}</span>
                        <span style="float: right; color:#212121; font-size: 13px">{{ item.materialName }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :sm="12" :md="8" :lg="6">
                  <el-form-item :label="object['materialName'].label" :prop="object['materialName'].name">
                    <el-input readonly v-model="lineform.values[object['materialName'].name]"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :sm="12" :md="8" :lg="6">
                  <el-form-item :label="object['specification'].label" :prop="object['specification'].name">
                    <el-input readonly v-model="lineform.values[object['specification'].name]"></el-input>
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
                  <el-form-item :label="object['priceTax'].label" :prop="object['priceTax'].name">
                    <el-input  @change="blurPricetax" type="number" v-model="lineform.values[object['priceTax'].name]"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :sm="12" :md="8" :lg="6">
                  <el-form-item :label="object['price'].label" :prop="object['price'].name">
                    <el-input type="number" readonly v-model="lineform.values[object['price'].name]"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :sm="12" :md="8" :lg="6">
                  <el-form-item :label="object['supplierMaterialCode'].label" :prop="object['supplierMaterialCode'].name">
                    <el-input v-model="lineform.values[object['supplierMaterialCode'].name]"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :sm="12" :md="8" :lg="6">
                  <el-form-item :label="object['supplierMaterialName'].label" :prop="object['supplierMaterialName'].name">
                    <el-input v-model="lineform.values[object['supplierMaterialName'].name]"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :sm="12" :md="8" :lg="6">
                  <el-form-item :label="object['dateFrom'].label" :prop="object['dateFrom'].name">
                      <el-date-picker clearable type="date" v-model="lineform.values[object['dateFrom'].name]" class="full-width" :picker-options="pickerOptions"></el-date-picker>
                  </el-form-item>
                  </el-col>

                <el-col :sm="12" :md="8" :lg="6">
                  <el-form-item :label="object['dateTo'].label" :prop="object['dateTo'].name">
                    <el-date-picker clearable type="date" v-model="lineform.values[object['dateTo'].name]" class="full-width"></el-date-picker>
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
        <el-button @click="dlgConfirm">确定</el-button>
        <el-button @click="dlgCancel">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="填写分段价格" :visible.sync="dialogPriceVisible" width="80%">
      <div class="sbutton">
        <el-button @click="addPrice">新 增</el-button>
        <el-button @click="delPrice">删 除</el-button>
      </div>

      <el-table :data="priceList" size="mini" border fit highlight-current-row @selection-change="priceSelected" style="width: 100%;" >

          <el-table-column type="selection" width="55">
          </el-table-column>

          <el-table-column :label="priceColumns['lineNum'].label" width="60">
            <template slot-scope="scope">
              <span>{{scope.row[priceColumns['lineNum'].name]}}</span>
            </template>
          </el-table-column>

          <el-table-column :label="priceColumns['qtyFrom'].label">
             <template slot-scope="scope">
               <el-input type="number" size="mini" v-model="scope.row[priceColumns['qtyFrom'].name]"></el-input>
             </template>
           </el-table-column>

          <el-table-column :label="priceColumns['qtyTo'].label" >
             <template slot-scope="scope">
               <el-input type="number" size="mini" v-model="scope.row[priceColumns['qtyTo'].name]"></el-input>
             </template>
           </el-table-column>

          <el-table-column :label="priceColumns['priceTax'].label" >
            <template slot-scope="scope">
              <el-input type="number"  size="mini" v-model="scope.row[priceColumns['priceTax'].name]" ></el-input>
            </template>
          </el-table-column>

           <el-table-column :label="priceColumns['discount'].label" >
             <template slot-scope="scope">
               <el-input readonly size="mini" v-model="scope.row[priceColumns['discount'].name]"></el-input>
             </template>
           </el-table-column>

           <el-table-column :label="priceColumns['price'].label" >
            <template slot-scope="scope">
              <el-input type="number" readonly size="mini" v-model="scope.row[priceColumns['price'].name]"></el-input>
            </template>
          </el-table-column>

          <el-table-column :label="priceColumns['dateFrom'].label" >
            <template slot-scope="scope">
              <el-date-picker type="date" v-model="scope.row[priceColumns['dateFrom'].name]" :editable="false" ></el-date-picker>
            </template>
          </el-table-column>

          <el-table-column :label="priceColumns['dateTo'].label" >
            <template slot-scope="scope">
              <el-date-picker type="date" v-model="scope.row[priceColumns['dateTo'].name]" :editable="false"></el-date-picker>
            </template>
          </el-table-column>

      </el-table>

      <div class="sbutton">
          <el-button @click="dlgPriceConfirm">确 定</el-button>
          <el-button @click="dlgPriceCancel">取 消</el-button>
      </div>
    </el-dialog>

<!--显示的明细行-->
    <el-table size="mini" :data="list.rows" border fit highlight-current-row @selection-change="lineSelected" style="width: 100%">
      <el-table-column type="selection" width="55">
        </el-table-column>
      <el-table-column :label="objectColumns['itemNumber'].label" :prop="objectColumns['itemNumber'].name" width="100"></el-table-column>
      
      <el-table-column :label="objectColumns['subcode'].label" width="80">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['subcode'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column :label="objectColumns['materialName'].label" width="180">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['materialName'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column :label="objectColumns['specification'].label" width="150">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['specification'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column :label="objectColumns['unit'].label" width="80">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['unit'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column :label="objectColumns['category'].label" width="250">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['category'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column class="tablePriceTax" :label="objectColumns['priceTax'].label" width="150">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['priceTax'].name]}}</span>
          <el-button class="buttonPriceTax" @click="makeSectionPrice(scope.row[objectColumns['itemNumber'].name],scope.row[objectColumns['priceList'].name])" size="mini">分段价格</el-button>
            <span style="display:none;">{{scope.row[objectColumns['priceList'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column :label="objectColumns['price'].label" width="100">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['price'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column :label="objectColumns['supplierMaterialCode'].label" width="100">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['supplierMaterialCode'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column :label="objectColumns['supplierMaterialName'].label" width="150">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['supplierMaterialName'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column :label="objectColumns['dateFrom'].label" width="120">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['dateFrom'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column :label="objectColumns['dateTo'].label" width="120">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['dateTo'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column :label="objectColumns['remark'].label" width="120">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['remark'].name]}}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 导入/上传文件 -->
    <input type="file" ref="excelFile" style="display:none" @change="fileUpload" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
  </div>
</template>


<script>
import treeSelect from '../../components/tree-select/tree.vue'
import { DateFormat, trimSpace, isPositivenumber } from '../../utils/util.js'
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
// 将小数转为百分数
function toPercent (point) {
  var str = Number(point * 100).toFixed(1)
  return str
}
export default {
  mixins: [ColumnFormatterMixin],
  data () {
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
      orgName: '',
      acceptGoodsSide: '',
      object: {},
      objectColumns: {},
      dialogVisible: false,
      priceColumns: {},
      dialogPriceVisible: false,
      priceList: [],
      labelPosition: 'right',
      effectiveOptions: [],
      materialData: [],
      materialOptions: [],
      subcode: '',
      rules: {
        priceTax: [
          { required: true, message: '该输入项为必输项' },
          { validator: validatePositivenumber, trigger: 'change' },
          { validator: validatePositivenumber, trigger: 'blur' }
        ]
      },
      pickerOptions:{
        disabledDate(time) {
          return time.getTime() < Date.now()- 8.64e7;
        },
      },
      selectedLines: [],
      selectedPrices: [],
      lineNum: null
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
    priceList: {
      handler: function (val, old) {
        var tax = this.mate.mateFormerHeader.values.tax

        var price = this.list.rows[this.lineNum - 1].priceTax
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
  components: {
    GoodsPriceForm: function index (resolve) {
      require(['./GoodsPriceForm.vue'], resolve)
    },
    KTable: function index (resolve) {
      require(['../../components/KTable.vue'], resolve)
    },
    'tree-selected': function index (resolve) {
      require(['../../components/TreeSelected.vue'], resolve)
    },
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
    },
    treeSelect
  },
  props: {
    mate: Object
  },
  created () {
    var vm = this
    this.formatterBefore(this.mate.mateList.columns)
    this.form = this.mate.mateFormerHeader
    this.lineform = this.mate.mateFormerLine
    this.lineform.fields.map((i) => { this.object[i.name] = i })
    this.list = this.mate.mateList
    this.list.columns.map((i) => { this.objectColumns[i.name] = i })
    this.mate.priceList.columns.map((i) => { this.priceColumns[i.name] = i })
  },
  methods: {
    getOrgName (val) {
      this.orgName = val
    },
    getAcceptGoodsSide (val) {
      this.acceptGoodsSideName = val
    },
    // 新增
    add () {
      this.dialogVisible = true
      var vm = this;
      vm.materialData = [];
      vm.materialOptions = [];
      if (this.form.values.companyId === null || this.form.values.address === null) {
        vm.$message({
          message: '请选择供应商和地点',
          type: 'warning'
        });
        this.dialogVisible = false;
        return;
      }
      if(this.form.values.tax === null || this.form.values.tax === '') {
        vm.$message({
          message: '新增行前，税率要必须输入',
          type: 'warning'
        });
        this.dialogVisible = false;
        return;
      }
      this.dialogVisible = true;
      // /purchase/goods/pricing/getMaterials/
      this.$root.ajaxData('/materials?dataOnly=true&&status=1&&nopaging=true', {}, function (data) {
        vm.materialData = data;
        for (let i = 0; i < data.length; i++) {
          vm.materialOptions.push({ label: data[i].subcode, value: data[i].id, materialName: data[i].name, specification: data[i].basicSpec, unit: data[i].basicUnit, category: data[i].materialCategory })
        }
      }, 'GET');
    },
    resetForm (formName) {
      this.$refs.GoodsPriceForm.$refs['ruleForm'].resetFields()
    },
    changeCode (value) {
      try {
        var obj = this.materialData.find((item) => {
          return item.id === value
        })
        this.subcode = obj.subcode
       // this.$set(this.lineform.values, 'materialName', obj.materialName)
        this.mate.mateFormerLine.values = Object.assign({}, this.mate.mateFormerLine.values, { 'materialName': obj.name, 'specification': obj.basicSpec, 'unit': obj.basicUnit, 'category': obj.materialCategory })
        // this.mate.mateFormerLine.values.materialName = obj.materialName
      } catch (e) {
      }
    },
    blurPricetax () {
      var priceTax = this.mate.mateFormerLine.values.priceTax
      var tax = this.mate.mateFormerHeader.values.tax
      this.mate.mateFormerLine.values.price = toDecimal(priceTax / (1 + tax / 100))
    },
    // 修改
    edit () {
      var vm = this
      var rows = this.selectedLines
      vm.materialData = []
      vm.materialOptions = []
      if (rows.length !== 1) {
        vm.$message({
          message: this.$t('seladata'),
          type: 'warning'
        })
        return
      } else {
       // /purchase/goods/pricing/getMaterials/
        this.dialogVisible = true
        this.$root.ajaxData('/materials?dataOnly=true&&status=1&&nopaging=true', {}, function (data) {
          vm.materialData = data
          for (let i = 0; i < data.length; i++) {
            vm.materialOptions.push({ label: data[i].subcode, value: data[i].id, materialName: data[i].name, specification: data[i].basicSpec, unit: data[i].basicUnit, category: data[i].materialCategory })
          }
        }, 'GET')
        for (var m = 0; m < this.mate.mateList.rows.length; m++) {
          if (this.mate.mateList.rows[m].itemNumber === this.selectedLines[this.selectedLines.length - 1].itemNumber) {
            this.mate.mateFormerLine.values = Object.assign({}, this.mate.mateList.rows[m])
            return true
          }
        }
      }
    },

    // 删除
    del () {
      var vm = this
      var rows = this.selectedLines
      if (rows.length === 0) {
        vm.$message({
          message: this.$t('Please select a row of data at least'),
          type: 'warning'
        })
        return
      } else {
        var tmpRows = []
        for (var i = 0; i < this.list.rows.length; i++) {
          var isSame = 'no'
          for (var j = 0; j < rows.length; j++) {
            if (this.list.rows[i].itemNumber === rows[j].itemNumber) {
              isSame = 'yes'
              break
            }
          }

          if (isSame === 'no') {
            tmpRows.push({
              id: this.list.rows[i].id, materialId: this.list.rows[i].materialId, materialName: this.list.rows[i].materialName, specification: this.list.rows[i].specification, unit: this.list.rows[i].unit, type: this.list.rows[i].type, category: this.list.rows[i].category, subcode: this.list.rows[i].subcode, priceTax: this.list.rows[i].priceTax,
              price: this.list.rows[i].price, priceList: this.list.rows[i].priceList, dateFrom: this.list.rows[i].dateFrom, dateTo: this.list.rows[i].dateTo

            })
          }
        }

        this.list.rows = []

        for (var z = 0; z < tmpRows.length; z++) {
          this.list.rows.push({
            id: tmpRows[z].id, itemNumber: z + 1, materialId: tmpRows[z].materialId, materialName: tmpRows[z].materialName, specification: tmpRows[z].specification, unit: tmpRows[z].specification, type: tmpRows[z].type, category: tmpRows[z].category, subcode: tmpRows[z].subcode, priceTax: tmpRows[z].priceTax,
            price: tmpRows[z].price, priceList: tmpRows[z].priceList, dateFrom: tmpRows[z].dateFrom, dateTo: tmpRows[z].dateTo
          })
        }
      }
    },

    // 确定新增的商品明细
    dlgConfirm () {
      var ruleRes = ''
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          ruleRes = 'no'
        }
      })
      if (ruleRes === 'no') {
        return
      }
      if(this.lineform.values[this.object['dateFrom'].name]>this.lineform.values[this.object['dateTo'].name]){
        this.$message({
          message: "有效日期to不能小于有效日期from",
          type: 'warning'
        })
        return
      }
      if (this.lineform.values[this.object['itemNumber'].name] === undefined || trimSpace(this.lineform.values[this.object['itemNumber'].name]) === '') {
        this.list.rows.push({
          id: null,
          itemNumber: this.list.rows.length + 1,
          materialId: this.lineform.values[this.object['materialId'].name],
          subcode: this.subcode,
          materialName: this.lineform.values[this.object['materialName'].name],
          specification: this.lineform.values[this.object['specification'].name],
          unit: this.lineform.values[this.object['unit'].name],
          supplierMaterialCode: this.lineform.values[this.object['supplierMaterialCode'].name],
          supplierMaterialName: this.lineform.values[this.object['supplierMaterialName'].name],
          type: this.lineform.values[this.object['type'].name],
          category: this.lineform.values[this.object['category'].name],
          priceTax: this.lineform.values[this.object['priceTax'].name],
          price: this.lineform.values[this.object['price'].name],
          priceList: null,
          dateFrom: DateFormat(this.lineform.values[this.object['dateFrom'].name], 'yyyy-MM-dd'),
          dateTo: DateFormat(this.lineform.values[this.object['dateTo'].name], 'yyyy-MM-dd'),
          remark:this.lineform.values[this.object['remark'].name]
        })
      } else {
        for (var i = 0; i < this.mate.mateList.rows.length; i++) {
          if (this.mate.mateFormerLine.values.itemNumber === this.mate.mateList.rows[i].itemNumber) {
            const mateFormerValues1 = Object.assign({}, this.mate.mateFormerLine.values)
                // splice将i行数据删除，并将mateFormerValues1填充进

            if (this.mate.mateFormerLine.values.materialId === this.mate.mateList.rows[i].materialId) {
              this.mate.mateList.rows.splice(i, 1, mateFormerValues1)
            } else {
              this.mate.mateList.rows.splice(i, 1, mateFormerValues1)
              this.$set(this.mate.mateList.rows[i], 'subcode', this.subcode)
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

      this.lineform.values[this.object['itemNumber'].name] = ''
      this.dialogVisible = false
    },

    // 取消新增的商品明细
    dlgCancel () {
      this.$refs['ruleForm'].resetFields()
      for (var idx in this.lineform.values) {
        this.lineform.values[idx] = null
      }
      this.lineform.values[this.object['itemNumber'].name] = ''
      this.dialogVisible = false
    },

    // 关闭
    dlgClose () {
      this.$refs['ruleForm'].resetFields()
      for (var idx in this.lineform.values) {
        this.lineform.values[idx] = null
      }
      this.lineform.values[this.object['itemNumber'].name] = ''
      this.dialogVisible = false
    },
    lineSelected (val) {
      this.selectedLines = val
    },

    // 提交填写的商品定价数据
    handleSubmit () {
      this.buttonDisabled = true
      var mate = {}
      var vm = this

      var ruleRes = ''
      this.$refs.GoodsPriceForm.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          ruleRes = 'no'
          this.buttonDisabled = false
        }
      })

      if (ruleRes === 'no') {
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

      mate.mateFormerHeader = this.form.values
      mate.mateList = this.list.rows

      if (this.mate.mateFormerHeader.method === 'POST') {
        this.$root.ajaxData('/purchase/goods/pricing/batchSave', mate, function () {
          vm.$root.monitor({ url: '/purchase/goods/pricing/all/list' })
        }, 'POST')
      } else {
        this.$root.ajaxData('/purchase/goods/pricing/batchUpdate' + '/' + mate.mateFormerHeader.id, mate, function () {
          vm.$root.monitor({ url: '/purchase/goods/pricing/all/list' })
        }, 'PUT')
      }
    },

    // 取消
    backward () {
      this.$root.monitor({ url: '/purchase/goods/pricing/all/list' })
    },

   // 分段价格弹出框分段价格弹出框
    makeSectionPrice (lineNum, priceList) {
      this.lineNum = lineNum

      if (priceList === undefined || priceList === null || trimSpace(priceList) === '') {
        this.priceList = []
      } else {
        var obj = JSON.parse(priceList)
        this.priceList = obj.priceList
      }

      if (this.priceList.length > 0) {
        this.priceCancelDisabled = false
      }
      if (this.priceList.length === 0) {
        this.priceList.push({
          lineNum: this.priceList.length + 1,
          priceTax: this.list.rows[this.lineNum - 1].priceTax,
          price: this.list.rows[this.lineNum - 1].price,
          effective: '1',
          qtyFrom: '1'
        })
      }

      this.dialogPriceVisible = true
    },
    dlgPriceCancel () {
      this.dialogPriceVisible = false
    },
    addPrice () {
      this.priceList.push({
        id: null,
        lineNum: this.priceList.length + 1,
        dateFrom: this.priceList[this.priceList.length - 1].dateFrom,
        dateTo: this.priceList[this.priceList.length - 1].dateTo,
        effective: '1'
      })
    },
    delPrice () {
      var vm = this
      var rows = this.selectedPrices
      if (rows.length === 0) {
        vm.$message({
          message: this.$t('Please select a row of data at least'),
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
              id: this.priceList[i].id, qtyFrom: this.priceList[i].qtyFrom, qtyTo: this.priceList[i].qtyTo, priceTax: this.priceList[i].priceTax, price: this.priceList[i].freePrice,
              discount: this.priceList[i].discount, dateFrom: this.priceList[i].dateFrom, dateTo: this.priceList[i].dateTo, effective: this.priceList[i].effective, breakNumber: this.priceList[i].breakNumber
            })
          }
        }

        this.priceList = []

        for (var z = 0; z < tmpRows.length; z++) {
          this.priceList.push({
            id: tmpRows[z].id, lineNum: z + 1, qtyFrom: tmpRows[z].qtyFrom, qtyTo: tmpRows[z].qtyTo, priceTax: tmpRows[z].priceTax, price: tmpRows[z].price,
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
        if (this.priceList[i].qtyFrom === undefined || this.priceList[i].qtyFrom === null || trimSpace(this.priceList[i].qtyFrom) === '') {
          chkmsg = '第' + this.priceList[i].lineNum + '行的数量from不能为空'
          break
        }
        if (this.priceList[i].qtyTo === undefined || this.priceList[i].qtyTo === null || trimSpace(this.priceList[i].qtyTo) === '') {
          chkmsg = '第' + this.priceList[i].lineNum + '行的数量to不能为空'
          break
        }
        if (this.priceList[i].priceTax === undefined || this.priceList[i].priceTax === null || trimSpace(this.priceList[i].priceTax) === '') {
          chkmsg = '第' + this.priceList[i].lineNum + '行的含税价格不能为空'
          break
        }
        if (this.priceList[i].price === undefined || this.priceList[i].price === null || trimSpace(this.priceList[i].price) === '') {
          chkmsg = '第' + this.priceList[i].lineNum + '行的不含税价格不能为空'
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
    },
    /** 下载 excl 模板 
     * @param void
     * @return void
     */
    downloadLine() {
      // 下载模板接口
      let url = PURCHASING_MANAGEMENT_API.GOODS_PRICE_EXPORT;
      // 下载模板命名
      let fileName = '采购定价行模板';
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
      let tax = this.mate.mateFormerHeader.values.tax || "";
      if (!tax){
        this.$message({
          type: 'warning',
          message: '请先选择税率'
        })
        return;
      }
      this.$refs.excelFile.click();
    },
    fileUpload(file) {
      let headerId = this.mate.mateFormerHeader.values.id || "";
      let tax = this.mate.mateFormerHeader.values.tax || "";
      // 导入模板接口
      let url = PURCHASING_MANAGEMENT_API.GOODS_PRICE_IMPORT;
      url += `?headerId=${headerId}&tax=${tax}`;
      // 下载模板接口方法
      let methods = 'POST';
      // 导入数据
      let formdata = new FormData();
      formdata.append('file', file.target.files[0]);
      SERVICES.BASE.uploadTemplateExcel(url, methods, formdata, this.uploadSuccess);
    },
    uploadSuccess(res){
      this.$refs.excelFile.value = '';
      this.mate.mateList.rows = res.data;
    },
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
.hidden{
  display:none;
}
.el-form--inline.el-form--label-top .el-form-item__content{
  width:90%
}
.leftFloat .el-form--inline .el-form-item{
  margin-right:10px;
}
.tablePriceTax{
  position: relative;
}
.buttonPriceTax{
  position: absolute;
  right: 10px;
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
.sbutton {
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
.full-width { width: 100% }
</style>
