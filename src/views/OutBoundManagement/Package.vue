<template>
  <div>
     <div class="tbutton">
      <el-button plain class="el-icon-document"  :disabled="buttonDisabled" @click="handleSubmit">提 交</el-button>
      <el-button plain class="el-icon-close" @click="backward" v-if="!mate.inline">取 消</el-button>
      <el-button plain class="el-icon-date"  @click="resetForm('PackageForm')">重 置</el-button>
    </div>
    <PackageForm :mate="form" ref="PackageForm"></PackageForm>

    <div class="tbutton">
      <el-button class="el-icon-plus" plain  @click="add">新 增</el-button>
      <el-button class="el-icon-delete" plain @click="del" v-if="!mate.inline">删 除</el-button>
    </div>
    <!--size="large"-->
    <el-dialog title="选择拣选单" :visible.sync="dialogListVisible" width="80%">
      <KTable :mate="dataKTable" @actionSelected="handleSelected"></Ktable>
      <div class="fbutton">
        <el-button @click="dlgConfirm">确 定</el-button>
        <el-button @click="dlgCancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-table size="mini" :data="list.rows" @selection-change="lineSelected" border fit highlight-current-row style="width: 100%">

        <el-table-column type="selection" width="55">
        </el-table-column>

        <el-table-column :label="objectColumns['lineNum'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['lineNum'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['itemCode'].label" width="180">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['itemCode'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['subcode'].label" width="180">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['subcode'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['itemName'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['itemName'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['model'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['model'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['unit'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['unit'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['pickQty'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['pickQty'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['packageQty'].label" width="100">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row[objectColumns['packageQty'].name]"
              @change="scope.row[objectColumns['canPackQty'].name] = scope.row[objectColumns['threshold'].name]-scope.row[objectColumns['packageQty'].name]"></el-input>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['canPackQty'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['canPackQty'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['threshold'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['threshold'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['warehouseName'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['warehouseName'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['locationName'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['locationName'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['batchNo'].label" width="150">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['batchNo'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['lotNo'].label" width="150">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['lotNo'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['productDate'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['productDate'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['expireDate'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['expireDate'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :formatter="objectColumns['qualityStatus'].formatter" :label="objectColumns['qualityStatus'].label" :prop="objectColumns['qualityStatus'].name" :width="objectColumns['qualityStatus'].width"></el-table-column>

        <el-table-column :label="objectColumns['estimateDeliveryDate'].label" width="120">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['estimateDeliveryDate'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['trayNo'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['trayNo'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['sourceType'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['sourceType'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['sourceHeaderCode'].label" width="180">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['sourceHeaderCode'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['sourceLineNum'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['sourceLineNum'].name]}}</span>
          </template>
        </el-table-column>

    </el-table>

   
  </div>
</template>

<script>
import { API_GATEWAY } from '@/config/index.js'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
import { DateFormat, trimSpace, isPositiveinteger } from '../../utils/util.js'

export default {
  mixins: [ColumnFormatterMixin],
  data () {
    return {
      buttonDisabled: false,
      form: {},
      list: {},
      objectColumns: {},
      dialogListVisible: false,
      dataKTable: {},
      selectedRows: [],
      selectedLines: []
    }
  },
  components: {
    PackageForm: function index (resolve) {
      require(['./PackageForm.vue'], resolve)
    },
    KTable: function index (resolve) {
      require(['../../components/KTable.vue'], resolve)
    }
  },
  props: {
    mate: Object
  },
  methods: {
    add () {
      var vm = this
      this.dialogListVisible = true
      this.$root.ajaxData('/outbound/pick/lines/getPickFinish', {}, function (data) {
        delete data.mate.btns
        vm.dataKTable = data.mate
      }, 'GET')
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
              id: this.list.rows[i].id, packageHeaderId: this.list.rows[i].packageHeaderId, itemId: this.list.rows[i].itemId, itemCode: this.list.rows[i].itemCode, subcode: this.list.rows[i].subcode, itemName: this.list.rows[i].itemName, model: this.list.rows[i].model, unit: this.list.rows[i].unit,
              requireQty: this.list.rows[i].requireQty, itemPkgQty: this.list.rows[i].itemPkgQty, packageQty: this.list.rows[i].packageQty, pickQty: this.list.rows[i].pickQty, canPackQty: this.list.rows[i].canPackQty, threshold: this.list.rows[i].threshold, warehouseId: this.list.rows[i].warehouseId, warehouseName: this.list.rows[i].warehouseName,
              locationId: this.list.rows[i].locationId, locationName: this.list.rows[i].locationName, unitPrice: this.list.rows[i].unitPrice, batchNo: this.list.rows[i].batchNo, lotNo: this.list.rows[i].lotNo, productDate: this.list.rows[i].productDate,
              expireDate: this.list.rows[i].expireDate, qualityStatus: this.list.rows[i].qualityStatus, estimateDeliveryDate: this.list.rows[i].estimateDeliveryDate, trayNo: this.list.rows[i].trayNo, sourceTypeCode: this.list.rows[i].sourceTypeCode,
              sourceType: this.list.rows[i].sourceType, sourceHeaderId: this.list.rows[i].sourceHeaderId, sourceHeaderCode: this.list.rows[i].sourceHeaderCode,
              sourceLineId: this.list.rows[i].sourceLineId, sourceLineNum: this.list.rows[i].sourceLineNum, docDetailRemark: this.list.rows[i].docDetailRemark
            })
          }
        }

        this.list.rows = []

        var rowno = 1
        for (var z = 0; z < tmpRows.length; z++) {
          this.list.rows.push({
            id: tmpRows[z].id, packageHeaderId: tmpRows[z].packageHeaderId, lineNum: rowno++, itemId: tmpRows[z].itemId, itemCode: tmpRows[z].itemCode, subcode: tmpRows[z].subcode, itemName: tmpRows[z].itemName, model: tmpRows[z].model, unit: tmpRows[z].unit,
            requireQty: tmpRows[z].requireQty, itemPkgQty: tmpRows[z].itemPkgQty, packageQty: tmpRows[z].packageQty, pickQty: tmpRows[z].pickQty, canPackQty: tmpRows[z].canPackQty, threshold: tmpRows[z].threshold, warehouseId: tmpRows[z].warehouseId, warehouseName: tmpRows[z].warehouseName,
            locationId: tmpRows[z].locationId, locationName: tmpRows[z].locationName, unitPrice: tmpRows[z].unitPrice, batchNo: tmpRows[z].batchNo, lotNo: tmpRows[z].lotNo, productDate: tmpRows[z].productDate, expireDate: tmpRows[z].expireDate,
            qualityStatus: tmpRows[z].qualityStatus, estimateDeliveryDate: tmpRows[z].estimateDeliveryDate, trayNo: tmpRows[z].trayNo, sourceTypeCode: tmpRows[z].sourceTypeCode, sourceType: tmpRows[z].sourceType,
            sourceHeaderId: tmpRows[z].sourceHeaderId, sourceHeaderCode: tmpRows[z].sourceHeaderCode,
            sourceLineId: tmpRows[z].sourceLineId, sourceLineNum: tmpRows[z].sourceLineNum, docDetailRemark: tmpRows[z].docDetailRemark
          })
        }
      }
    },
    resetForm (formName) {
      this.$refs.PackageForm.$refs['ruleForm'].resetFields()
    },
    dlgConfirm (val) {
      var vm = this
      var rows = this.selectedRows
      if (rows.length == 0) {
        vm.$message({
          message: this.$t('selmdata'),
          type: 'warning'
        })
        return
      } else {
        var tmpRows = []
        tmpRows = this.list.rows

        for (var i = 0; i < rows.length; i++) {
          var pickHeaderId = rows[i].pickHeaderId
          var pickLineId = rows[i].id

          var isSame = 'no'
          for (var j = 0; j < this.list.rows.length; j++) {
            var srcRow = this.list.rows[j]
            var sourceHeaderId = srcRow.sourceHeaderId
            var sourceLineId = srcRow.sourceLineId
            if (pickHeaderId == sourceHeaderId && pickLineId == sourceLineId) {
              isSame = 'yes'
              break
            }
          }

          if (isSame == 'no') {
            var sourceType = ''
            var sourceTypeTmp = rows[i].sourceType
            if (sourceTypeTmp == '10') sourceType = '完工入库'; else if (sourceTypeTmp == '11') sourceType = '采购入库'; else if (sourceTypeTmp == '12') sourceType = '借入'; else if (sourceTypeTmp == '13') sourceType = '还回'; else if (sourceTypeTmp == '14') sourceType = '货权转入'
            else if (sourceTypeTmp == '15') sourceType = '代管入库'; else if (sourceTypeTmp == '16') sourceType = '无物流入库'; else if (sourceTypeTmp == '17') sourceType = '销退'; else if (sourceTypeTmp == '18') sourceType = '配送销售退货'; else if (sourceTypeTmp == '19') sourceType = '配送移库入库'
            else if (sourceTypeTmp == '20') sourceType = '配送调拨入库'; else if (sourceTypeTmp == '21') sourceType = '移库入'; else if (sourceTypeTmp == '22') sourceType = '移位入库'; else if (sourceTypeTmp == '23') sourceType = '报溢入'; else if (sourceTypeTmp == '24') sourceType = '工单退料'
            else if (sourceTypeTmp == '25') sourceType = '工单退料'; else if (sourceTypeTmp == '26') sourceType = '委外入库'; else if (sourceTypeTmp == '50') sourceType = '销售出库'; else if (sourceTypeTmp == '51') sourceType = '采购退货'; else if (sourceTypeTmp == '52') sourceType = '借出'
            else if (sourceTypeTmp == '53') sourceType = '还出'; else if (sourceTypeTmp == '54') sourceType = '货权转出'; else if (sourceTypeTmp == '55') sourceType = '代管出'; else if (sourceTypeTmp == '56') sourceType = '无物流出'; else if (sourceTypeTmp == '57') sourceType = '配送销售出库'
            else if (sourceTypeTmp == '58') sourceType = '配送移库出库'; else if (sourceTypeTmp == '60') sourceType = '配送调拨出库'; else if (sourceTypeTmp == '61') sourceType = '移库出'; else if (sourceTypeTmp == '62') sourceType = '移位出库'
            else if (sourceTypeTmp == '63') sourceType = '报损出'; else if (sourceTypeTmp == '64') sourceType = '工单发料'; else if (sourceTypeTmp == '65') sourceType = '工单超领'; else sourceType = sourceTypeTmp

            tmpRows.push({
              id: null, packageHeaderId: null, itemId: rows[i].itemId, itemCode: rows[i].itemCode, subcode: rows[i].subcode, itemName: rows[i].itemName, model: rows[i].model, unit: rows[i].unit,
              requireQty: rows[i].requireQty, itemPkgQty: rows[i].itemPkgQty, packageQty: rows[i].canPackQty, pickQty: rows[i].pickQty, canPackQty: 0, threshold: rows[i].canPackQty, warehouseId: rows[i].warehouseId, warehouseName: rows[i].warehouseName,
              locationId: rows[i].locationId, locationName: rows[i].locationName, unitPrice: rows[i].unitPrice, batchNo: rows[i].batchNo, lotNo: rows[i].lotNo, productDate: rows[i].productDate, expireDate: rows[i].expireDate,
              qualityStatus: rows[i].qualityStatus, estimateDeliveryDate: rows[i].estimateDeliveryDate, trayNo: rows[i].trayNo, sourceTypeCode: rows[i].sourceTypeCode, sourceType: sourceType,
              sourceHeaderId: rows[i].pickHeaderId, sourceHeaderCode: rows[i].pickNo,
              sourceLineId: rows[i].id, sourceLineNum: rows[i].lineNum, docDetailRemark: rows[i].docDetailRemark
            })
          }
        }

        this.list.rows = []
        var rowno = 1
        for (var z = 0; z < tmpRows.length; z++) {
          this.list.rows.push({
            id: tmpRows[z].id, packageHeaderId: tmpRows[z].packageHeaderId, lineNum: rowno++, itemId: tmpRows[z].itemId, itemCode: tmpRows[z].itemCode, subcode: tmpRows[z].subcode, itemName: tmpRows[z].itemName, model: tmpRows[z].model, unit: tmpRows[z].unit,
            requireQty: tmpRows[z].requireQty, itemPkgQty: tmpRows[z].itemPkgQty, packageQty: tmpRows[z].packageQty, pickQty: tmpRows[z].pickQty, canPackQty: tmpRows[z].canPackQty, threshold: tmpRows[z].threshold, warehouseId: tmpRows[z].warehouseId, warehouseName: tmpRows[z].warehouseName,
            locationId: tmpRows[z].locationId, locationName: tmpRows[z].locationName, unitPrice: tmpRows[z].unitPrice, batchNo: tmpRows[z].batchNo, lotNo: tmpRows[z].lotNo, productDate: tmpRows[z].productDate, expireDate: tmpRows[z].expireDate,
            qualityStatus: tmpRows[z].qualityStatus, estimateDeliveryDate: tmpRows[z].estimateDeliveryDate, trayNo: tmpRows[z].trayNo, sourceTypeCode: tmpRows[z].sourceTypeCode, sourceType: tmpRows[z].sourceType,
            sourceHeaderId: tmpRows[z].sourceHeaderId, sourceHeaderCode: tmpRows[z].sourceHeaderCode,
            sourceLineId: tmpRows[z].sourceLineId, sourceLineNum: tmpRows[z].sourceLineNum, docDetailRemark: tmpRows[z].docDetailRemark
          })
        }
      }

      this.dialogListVisible = false
    },
    dlgCancel () {
      this.dialogListVisible = false
    },
    handleSelected (val) {
      this.selectedRows = val
    },
    lineSelected (val) {
      this.selectedLines = val
    },
    handleSubmit (ev) {
      this.buttonDisabled = true
      var mate = {}
      var vm = this

      var ruleRes = ''
      this.$refs.PackageForm.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          ruleRes = 'no'
        }
      })

      if (ruleRes == 'no') {
        this.buttonDisabled = false;
        return
      }

      this.form.values.packageDate = trimSpace(this.form.values.packageDate)
      this.form.values.grossWeightKg = trimSpace(this.form.values.grossWeightKg)
      this.form.values.netWeightKg = trimSpace(this.form.values.netWeightKg)

      if (this.list.rows.length == 0) {
        vm.$message({
          message: this.$t('Detailed data can not be empty'),
          type: 'warning'
        })
        this.buttonDisabled = false
        return
      }

      var chkmsg = ''
      for (var k = 0; k < this.list.rows.length; k++) {
        if ((this.list.rows[k].packageQty === undefined) || (trimSpace(this.list.rows[k].packageQty) === '')) {
          chkmsg = '明细数据第' + this.list.rows[k].lineNum + '行的装箱数量不能为空'
          vm.buttonDisabled = false
          break
        }

        if (!isPositiveinteger(trimSpace(this.list.rows[k].packageQty))) {
          chkmsg = '明细数据第' + this.list.rows[k].lineNum + '行的装箱数量必须为正整数'
          vm.buttonDisabled = false
          break
        }

        if (this.list.rows[k].packageQty > this.list.rows[k].threshold) {
          chkmsg = '明细数据第' + this.list.rows[k].lineNum + '行的装箱数量不能大于装箱阈值'
          vm.buttonDisabled = false
          break
        }
      }

      if (chkmsg != '') {
        vm.$message({
          message: chkmsg,
          type: 'warning'
        })
        return
      }

      this.form.values.packageDate = DateFormat(this.form.values.packageDate, 'yyyy-MM-dd')

      mate.mateFormerHeader = this.form.values
      mate.mateList = this.list.rows

      var chkcode = ''
      var xmlhttp
      if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest()
      } else {
        xmlhttp = new ActiveXObject('Microsoft.XMLHTTP')
      }

      xmlhttp.open('POST', API_GATEWAY + '/api/outbound/package/header/checkCode', false)
      xmlhttp.setRequestHeader('Authorization', 'Bearer ' + window.sessionStorage.getItem('token'))
      xmlhttp.setRequestHeader('Accept', 'application/json')
      xmlhttp.setRequestHeader('X-TenantId', JSON.parse(window.sessionStorage.getItem('user')).tenantId)
      xmlhttp.setRequestHeader('X-Logined-Sign', JSON.parse(window.sessionStorage.getItem('user')).username)
      xmlhttp.setRequestHeader('Content-type', 'application/json;charset=utf-8')
      xmlhttp.send(JSON.stringify(mate))
      chkcode = xmlhttp.responseText

      if (chkcode === 'nosame') {
        vm.$message({
          message: '所有货品编码必须在同一个物料主码之下',
          type: 'warning'
        })
        return
      }

      if (this.mate.mateFormerHeader.method === 'POST') {
        this.$root.ajaxData('/outbound/package/header/batchSave', mate, function () {
          vm.$root.monitor({ url: '/outbound/package/header/all/list' })
        }, 'POST')
      } else {
        this.$root.ajaxData('/outbound/package/header/batchUpdate' + '/' + mate.mateFormerHeader.id, mate, function () {
          vm.$root.monitor({ url: '/outbound/package/header/all/list' })
        }, 'PUT')
      }
    },
    backward () {
      this.$root.monitor({ url: '/outbound/package/header/all/list' })
    }
  },
  created () {
    var vm = this
    this.form = this.mate.mateFormerHeader
    this.list = this.mate.mateList
    this.list.columns.map((i) => { this.objectColumns[i.name] = i })
    this.formatterBefore(this.list.columns)
  }
}
</script>

<style scoped lang="scss">
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
.el-button--mini {
  padding: 7px 9px;
}
</style>
