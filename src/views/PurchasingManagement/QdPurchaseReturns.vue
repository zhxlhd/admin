<template>
  <div>
    <div class="sbutton">
      <el-button plain class="el-icon-document" @click="handleSubmit">提 交</el-button>
      <el-button plain class="el-icon-close" @click="backward">取 消</el-button>
      <el-button plain class="el-icon-date"  @click="resetForm('PurchaseForm')">重 置</el-button>
    </div>
    <QdPurchaseReturnsForm :mate="mate.mateFormerHeader" ref="PurchaseForm"></QdPurchaseReturnsForm>
    <div class="sbutton">
      <el-button icon="plus" @click="plusButton">新增</el-button>
      <el-button icon="delete" @click="deleteButton">删除</el-button>
    </div>
    <el-table size="mini" highlight-current-row ref="table" :data="detailRows" border @selection-change="handleSelectionChange" style="width: 100%;">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column :label="object['lineNum'].label" :prop="object['lineNum'].name" :min-width="object['lineNum'].width" show-overflow-tooltip></el-table-column>
      <el-table-column :label="object['sourceNumName'].label" :prop="object['sourceNumName'].name" :min-width="object['sourceNumName'].width" show-overflow-tooltip></el-table-column>
      <el-table-column :label="object['sourceLineNum'].label" :prop="object['sourceLineNum'].name" :min-width="object['sourceLineNum'].width" show-overflow-tooltip></el-table-column>
      <el-table-column :label="object['subcode'].label" :prop="object['subcode'].name" :min-width="object['subcode'].width" show-overflow-tooltip></el-table-column>
      <el-table-column :label="object['itemName'].label" :prop="object['itemName'].name" :min-width="object['itemName'].width" show-overflow-tooltip></el-table-column>
      <el-table-column :label="object['unit'].label" :prop="object['unit'].name" :min-width="object['unit'].width" show-overflow-tooltip></el-table-column>
      <el-table-column :label="object['qty'].label" :prop="object['qty'].name" :min-width="object['qty'].width" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input type="number" min="0" size="mini" v-model="scope.row['qty']"></el-input>
        </template>
      </el-table-column>
      <el-table-column :label="object['reason'].label" :prop="object['reason'].name" :min-width="object['reason'].width" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row['reason']"></el-input>
        </template>
      </el-table-column>
      <el-table-column :label="object['state'].label" :prop="object['state'].name" :min-width="object['state'].width"  :formatter="object['state'].formatter" show-overflow-tooltip></el-table-column>
      <el-table-column :label="object['remark'].label" :prop="object['remark'].name" :min-width="object['remark'].width" show-overflow-tooltip></el-table-column>
    </el-table>


    <el-dialog title="请选择采购单" width="80%" :visible.sync="dialogFormVisible">
      <!-- <el-table highlight-current-row ref="table" :data="dialogRows" border @selection-change="dialogSelectionChange" style="width: 100%;">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column v-if="col.isShow" v-for="(col,index) of mate.mateReturnList.columns" v-bind:key="col.name+index" :formatter="col.formatter" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip>
        </el-table-column>
      </el-table> -->
      <PriceKTable :mate="dialogRows" @actionSelected="dialogSelectionChange" :ReturnSupplierId="ReturnSupplierId"  :ReturnOfficeId="ReturnOfficeId"></PriceKTable>
      <!-- <el-button @click="handleComfirm" type="primary">确 认</el-button>
      <el-button @click="handleBack">返 回</el-button> -->
      <div class="sbutton">
        <el-button @click="dialogComfirm">确定</el-button>
        <el-button @click="dialogCancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
import { DateFormat } from '../../utils/util.js'
export default{
  mixins: [ColumnFormatterMixin],
  components: {
    QdPurchaseReturnsForm: function index (resolve) {
      require(['./QdPurchaseReturnsForm.vue'], resolve)
    },
    PriceKTable: function index (resolve) {
      require(['./PriceKtable'], resolve)
    },
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
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
      } else if (this.mate.labelWidth === null) {
        width = '100px'
      } else {
        width = this.mate.labelWidth
      }
      return width
    }
  },
  data () {
    var validateQty = (rule, value, callback) => {
      if (value > this.mate.mateFormer.values[this.dialogObject['deliveredQty'].name] - this.returnQty) {
        callback(new Error('库存不足'))
      } else {
        callback()
      }
    }
    return {
      object: {},              // // 用来代替从父组件总获取到的数据 mate.mateList.columns
      dialogFormVisible: false,
      dialogObject: {},
      btn: {},
      row: {},
      ReturnSupplierId: '',
      ReturnOfficeId: '',
      multipleSelection: [],
      dialogSelection: [],
      selectedIds: [],
      sourceNumData: [],           // 获取的源单号数据
      itemNumData: [],            // 获取的物料编码数据
      warehouseIdData: [],         // 获取的仓库数据
      warehouseName: '',          // 仓库的中文名称
      sourceNumName: '',          // 源单号
      itemName: '',
      returnPriceDisabled: true,    // 退价本来是关闭的
      returnQty: '',
      labelPosition: 'right',
      detailRows: [],             // 明细行中的数据
      dialogRows: {},              // 弹出框中的数据
      selectedLines: [],              // 选择明细行，用来装明细行的行号
      rules: {
        sourceNum: [
          { required: true, message: '该输入项为必输项', trigger: 'change' }
        ],
        itemNum: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        qty: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' },
          { validator: validateQty, trigger: 'blur' }
        ],
        reason: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.mate.mateList.columns.map((i) => { this.object[i.name] = i })
    this.formatterBefore(this.mate.mateList.columns)
    this.detailRows = this.mate.mateList.rows
  },
  methods: {
    // 明细行中将选择的每一条数据放入到multipleSelection中
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.selectedLines = []
      val.map(i => this.selectedLines.push(i.lineNum))
    },
    dialogSelectionChange (val) {
      this.dialogSelection = val
    },
    // 获取源单号
    getSourceNum () {
      var vm = this
      this.dialogObject['sourceNum'].options = []
      this.$root.ajaxData('/purchase/purchaseOrder/all/list?dataOnly=true&companyId=' + this.mate.mateFormerHeader.values.supplierId, {}, function (data) {
        vm.sourceNumData = data
        data.forEach((i) => {
          vm.dialogObject['sourceNum'].options.push({ 'label': i.goodsName, 'value': i.id })
        })
      }, 'GET')
    },
    resetForm (formName) {
      this.$refs.PurchaseForm.$refs['ruleForm'].resetFields()
    },
    // 新增按钮
    plusButton () {
      const vm = this
      if (this.mate.mateFormerHeader.values.supplierId === null || this.mate.mateFormerHeader.values.officeId === null || this.mate.mateFormerHeader.values.supplierId === '' || this.mate.mateFormerHeader.values.officeId === '') {
        this.$message({
          type: 'warning',
          message: '请选择供应商和机构'
        })
        return
      } else {
        this.ReturnSupplierId = this.mate.mateFormerHeader.values.supplierId
        this.ReturnOfficeId = this.mate.mateFormerHeader.values.officeId
      }
      this.dialogFormVisible = true
      this.$root.ajaxData('/purchase/goodsPricing/line/all-q?supplierId=' + this.mate.mateFormerHeader.values.supplierId + '&officeId=' + this.mate.mateFormerHeader.values.officeId, {}, function (data) {
        vm.dialogRows = data.mate
      }, 'GET')
    },
    // 删除按钮
    deleteButton () {
      if (this.selectedLines.length) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const temp = []
          for (let i = 0; i < this.selectedLines.length; i++) {
            temp[this.selectedLines[i]] = 1
          }
          const rows = this.detailRows
          this.detailRows = []
          for (let i = 0; i < rows.length; i++) {
            if (!temp[rows[i].lineNum]) {
              this.detailRows.push(rows[i])
            }
          }
          // 重新排序
          for (let i = 0; i < this.detailRows.length; i++) {
            this.detailRows[i].lineNum = i + 1
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$message({
          type: 'warning',
          message: '请选择明细行'
        })
      }
    },
    // 弹出框确定按钮
    dialogComfirm () {
      for (var j = 0; j < this.dialogSelection.length; j++) {
        if (this.dialogSelection[j].putwayQty - this.dialogSelection[j].returnBillLineQty <= 0) {
          this.$message({
            type: 'warning',
            message: '第' + (j + 1) + '行可退货数量不足'
          })
          return
        }
      }
      this.dialogSelection.forEach(i => {
        const line = this.detailRows.length
        this.detailRows.push({
          lineNum: line + 1,
          sourceNumName: i.name,
          sourceLineNum: i.lineNum,
          subcode: i.subcode,
          itemName: i.materialName,
          unit: i.unit,
          qty: i.putwayQty - i.returnBillLineQty,
          canReturnQty: i.putwayQty - i.returnBillLineQty,
          itemNum: i.materialId,
          sourceNum: i.pdGoodsPricingId,
          state: '已输入',
          returnQty: i.returnQty
        })
        this.dialogFormVisible = false
      })
    },
    // 弹出框取消按钮
    dialogCancel () {
      this.dialogFormVisible = false
    },
    // 提交
    handleSubmit (ev) {
      var vm = this
      var mate = {}
      // 对其进行校验
      this.$refs.PurchaseForm.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (!this.detailRows.length) {
            // 保存的时候明细行不能为空
            this.$message({
              type: "warning",
              message: "明细行不能为空"
            });
            return;
          }
          this.mate.mateFormerHeader.values.returnDate = DateFormat(this.mate.mateFormerHeader.values.returnDate, 'yyyy-MM-dd')
          mate.mateFormerHeader = this.mate.mateFormerHeader.values
          mate.mateList = this.detailRows
          // 退货原因必填
          for (var i = 0; i < this.detailRows.length; i++) {
            if (parseInt(this.detailRows[i].qty) < 0) {
              this.$message({
                type: 'warning',
                message: '数量应大于0'
              })
              return
            }
            if (parseInt(this.detailRows[i].qty) > parseInt(this.detailRows[i].canReturnQty)) {
              this.$message({
                type: 'warning',
                message: '可退货数量不足'
              })
              return
            }
            if (!this.detailRows[i].reason) {
              this.$message({
                type: 'warning',
                message: '请填写退货原因'
              })
              // this.detailRows[i].reason.focus()
              return
            }
          }
          // 修改
          if (this.mate.mateFormerHeader.method === 'PUT' && this.mate.mateFormerHeader.values.id) {
            this.$root.ajaxData('/purchase/purchase/returns/batchUpdate/' + this.mate.mateFormerHeader.values.id, mate, function () {
              vm.$root.monitor({ url: '/purchase/purchase/returns/all/list' })
            }, 'PUT')
            // 新增
          } else if (this.mate.mateFormerHeader.method === 'POST') {
            // 这是后台要根据id做判断的效果， id为null则新增，有id则为修改
            for (let i = 0; i < mate.mateList.length; i++) {
              mate.mateList[i].id = null
            }
            this.$root.ajaxData('/purchase/purchase/returns/batchSave', mate, function () {
              vm.$root.monitor({ url: '/purchase/purchase/returns/all/list' })
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
      this.$root.monitor({ url: '/purchase/purchase/returns/all/list' })
    }
  }
}
</script>
<style  scoped lang="scss">
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
  margin: 3px 0;
  button{
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
.el-dialog__header {
  padding: 10px 10px 0;
}
.el-dialog__body {
  padding: 10px 10px;
}
</style>
