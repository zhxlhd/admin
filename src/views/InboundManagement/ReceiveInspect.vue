<template>
  <div>
    <div class="tbutton">
      <el-button plain class="el-icon-document" :disabled="buttonDisabled" @click="handleSubmit">提 交</el-button>
      <el-button plain class="el-icon-close" @click="backward" v-if="!mate.inline">取 消</el-button>
    </div>
    <ReceiveInspectFormer @action="searchInput" :mate="form" ref="ReceiveInspectFormer"></ReceiveInspectFormer>
    <el-table size="mini" :data="list.rows" border fit highlight-current-row style="width: 100%; margin-top:5px;">
      <el-table-column  :label="object['lineNum'].label" width="100">
        <template slot-scope="scope">
          <span>{{scope.row[object['lineNum'].name]}}</span>
        </template>
      </el-table-column>
      <el-table-column  :label="object['itemCode'].label" width="100">
        <template slot-scope="scope">
          <span>{{scope.row['itemCode']}}</span>
        </template>
      </el-table-column>
      <el-table-column  :label="object['itemName'].label" width="100">
        <template slot-scope="scope">
          <span>{{scope.row[object['itemName'].name]}}</span>
        </template>
      </el-table-column>
      <el-table-column  :label="object['model'].label" width="100">
        <template slot-scope="scope">
          <span>{{scope.row[object['model'].name]}}</span>
        </template>
      </el-table-column>
      <el-table-column  :label="object['unit'].label" width="100">
        <template slot-scope="scope">
          <span>{{scope.row[object['unit'].name]}}</span>
        </template>
      </el-table-column>
      <el-table-column  :label="object['receiveHeaderCode'].label" width="150">
        <template slot-scope="scope">
          <span>{{scope.row['receiveHeaderCode']}}</span>
        </template>
      </el-table-column>
      <el-table-column  :label="object['receiveLineCode'].label" width="150">
        <template slot-scope="scope">
          <span>{{scope.row['receiveLineCode']}}</span>
        </template>
      </el-table-column>
      <el-table-column  :label="object['receiveQty'].label" width="100">
        <template slot-scope="scope">
          <span>{{scope.row[object['receiveQty'].name]}}</span>
        </template>
      </el-table-column>
      <el-table-column  :label="object['needInspectQty'].label" width="100">
        <template slot-scope="scope">
          <span>{{scope.row[object['needInspectQty'].name]}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" :label="object['acceptQty'].label" width="100">
        <template slot-scope="scope">
          <el-input v-show="true" size="mini" v-model="scope.row[object['acceptQty'].name]"></el-input>
        </template>
      </el-table-column>
      <el-table-column  :label="object['rejectQty'].label" width="100">
        <template slot-scope="scope">
          <el-input v-show="true" size="mini" v-model="scope.row[object['rejectQty'].name]"></el-input>
        </template>
      </el-table-column>
      <el-table-column  :label="object['qualityCode'].label" width="120">
        <template slot-scope="scope">
          <el-input v-show="true" size="mini" v-model="scope.row[object['qualityCode'].name]"></el-input>
        </template>
      </el-table-column>
      <el-table-column  :label="object['inspectRemark'].label" width="200">
        <template slot-scope="scope">
          <el-input v-show="true" size="mini" v-model="scope.row[object['inspectRemark'].name]"></el-input>
        </template>
      </el-table-column>
      <el-table-column  :label="object['warehouseName'].label" width="120">
        <template slot-scope="scope">
          <span>{{scope.row[object['warehouseName'].name]}}</span>
        </template>
      </el-table-column>
      <el-table-column  :label="object['locationName'].label" width="120">
        <template slot-scope="scope">
          <span>{{scope.row[object['locationName'].name]}}</span>
        </template>
      </el-table-column>
      <el-table-column  :label="object['batchNo'].label" width="150">
        <template slot-scope="scope">
          <span>{{scope.row[object['batchNo'].name]}}</span>
        </template>
      </el-table-column>
      <el-table-column  :label="object['lotNo'].label" width="150">
        <template slot-scope="scope">
          <el-input v-show="true" size="mini" v-model="scope.row[object['lotNo'].name]"></el-input>
        </template>
      </el-table-column>
      <el-table-column  :label="object['madeDate'].label" width="130">
        <template slot-scope="scope">
          <span>{{scope.row[object['madeDate'].name]}}</span>
        </template>
      </el-table-column>
      <el-table-column  :label="object['expireDate'].label" width="130">
        <template slot-scope="scope">
          <span>{{scope.row[object['expireDate'].name]}}</span>
        </template>
      </el-table-column>
      <el-table-column  :label="object['packageNo'].label" width="120">
        <template slot-scope="scope">
          <span>{{scope.row[object['packageNo'].name]}}</span>
        </template>
      </el-table-column>
      <!--来源类型-->
      <el-table-column :label="object['sourceType'].label" width="100">
        <template slot-scope="scope">
          <span>{{
            scope.row[object['sourceType'].name] === "10" ? $t('finishingWarehousing') : 
            (scope.row[object['sourceType'].name] === "11" ? $t('purchasingStorage') : (scope.row[object['sourceType'].name] === "12" ? $t('borrow') : (scope.row[object['sourceType'].name] === "13") ? $t('giveBack') : scope.row[object['sourceType'].name]))}}
          </span>
        </template>
      </el-table-column>
      <el-table-column  :label="object['sourceHeaderCode'].label" width="130">
        <template slot-scope="scope">
          <span>{{scope.row['sourceHeaderCode']}}</span>
        </template>
      </el-table-column>
      <el-table-column  :label="object['sourceLineCode'].label" width="130">
        <template slot-scope="scope">
          <span>{{scope.row['sourceLineCode']}}</span>
        </template>
      </el-table-column>
      <el-table-column  :label="object['sourceShippingLineId'].label" width="130">
        <template slot-scope="scope">
          <span>{{scope.row[object['sourceShippingLineId'].name]}}</span>
        </template>
      </el-table-column>
      <el-table-column  :label="object['receiveType'].label" width="100">
        <template slot-scope="scope">
          <span>{{scope.row[object['receiveType'].name] === '3' ? $t('need-inspect') : (scope.row[object['receiveType'].name] === '2' ? $t('standard-receive') : (scope.row[object['receiveType'].name] === '1' ? $t('direct-receive') : ''))}}</span>
        </template>
      </el-table-column>
      <el-table-column  :label="object['originCountry'].label" width="100">
        <template slot-scope="scope">
          <span>{{scope.row[object['originCountry'].name]}}</span>
        </template>
      </el-table-column>
      <el-table-column  :label="object['docDetailRemark'].label" width="200">
        <template slot-scope="scope">
          <span>{{scope.row[object['docDetailRemark'].name]}}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--size="large"-->
    <el-dialog title="搜索" :visible.sync="dialogListVisible" width="80%">
      <KTable :mate="dataKTable" @actionSearch="actionSearch" @actionSelected="handleSelected"></Ktable>
      <div class="fbutton">
        <el-button @click="handleComfirm">确 认</el-button>
        <el-button @click="handleBack">返 回</el-button>
      </div>
    </el-dialog>

    
  </div>
</template>

<script>
import { DateFormat, trimSpace, isPositiveinteger } from '../../utils/util.js'
export default {
  data () {
    return {
      buttonDisabled: false,
      object: {},
      selectedId: 0,                    // table中勾选的需要修改的id
      form: {},
      list: {},
      dialogListVisible: false,          // 弹出框
      dataKTable: {},
      selectedIds: []
    }
  },
  components: {
    ReceiveInspectFormer: function index (resolve) {
      require(['./ReceiveInspectFormer.vue'], resolve)
    },
    KTable: function index (resolve) {
      require(['../../components/KTable.vue'], resolve)
    }
  },
  props: {
    mate: Object
  },
  methods: {
    handleSubmit (ev) {
      this.buttonDisabled = true
      var vm = this
      var mate = {}
      this.form.values.inspectDate = DateFormat(this.form.values.inspectDate, 'yyyy-MM-dd HH:mm:ss')
      mate.mateFormerHeader = this.form.values
      this.list.rows.forEach(item => {
        item.acceptQty = Number(item.acceptQty)
        item.rejectQty = Number(item.rejectQty)
      })
      mate.mateList = this.list.rows
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
        if ((this.list.rows[k].acceptQty === undefined) || (trimSpace(this.list.rows[k].acceptQty) === '')) {
          chkmsg = '明细数据第' + (k + 1) + '行的接受数量不能为空'
          this.buttonDisabled = false
          break
        }

        if (!isPositiveinteger(trimSpace(this.list.rows[k].acceptQty))) {
          chkmsg = '明细数据第' + (k + 1) + '行的接受数量必须为整数且必须大于或等于0'
          this.buttonDisabled = false
          break
        }

        if ((this.list.rows[k].rejectQty === undefined) || (trimSpace(this.list.rows[k].rejectQty) === '')) {
          chkmsg = '明细数据第' + (k + 1) + '行的拒绝数量不能为空'
          this.buttonDisabled = false
          break
        }

        if (!isPositiveinteger(trimSpace(this.list.rows[k].rejectQty))) {
          chkmsg = '明细数据第' + (k + 1) + '行的拒绝数量必须为整数且必须大于或等于0'
          this.buttonDisabled = false
          break
        }

        if ((parseFloat(this.list.rows[k].acceptQty) + parseFloat(this.list.rows[k].rejectQty)) > parseFloat(this.list.rows[k].needInspectQty)) {
          chkmsg = '明细数据第' + (k + 1) + '行的接受数量与拒绝数量之和不能大于待质检数量'
          this.buttonDisabled = false
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

      if (this.mate.mateFormerHeader.method === 'POST') {
        this.$root.ajaxData('/inbound/receive/inspect/headers/batchSave', mate, function (data) {
          if (data.code === 500) {
            vm.buttonDisabled = false
            return
          }
          vm.$root.monitor({ url: '/inbound/receive/inspect/headers/all/list' })
        }, 'POST')
      } else {
        this.$root.ajaxData('/inbound/receive/inspect/headers/batchUpdate' + '/' + this.form.values.id, mate, function (data) {
          if (data.code === 500) {
            vm.buttonDisabled = false
            return
          }
          vm.$root.monitor({ url: '/inbound/receive/inspect/headers/all/list' })
        }, 'PUT')
      }
    },
    backward () {
      this.$root.monitor({ url: '/inbound/receive/inspect/headers/all/list' })
    },
    searchInput () {
      var vm = this
      this.dialogListVisible = true
      this.$root.ajaxData('/inbound/receive/transactions/queryInspect', {}, function (data) {
        delete data.mate.btns
        vm.dataKTable = data.mate
      }, 'GET')
    },
    actionSearch (searchValue) {
      var vm = this
      if (searchValue.name === '供应商') {
        this.searchData = 3
      } else if (searchValue.name === '客户') {
        this.searchData = 4
      } else if (searchValue.name === '组织') {
        this.searchData = 0
      }
      this.$root.ajaxData('/inbound/bill/headers/all/list?prividerType=' + this.searchData + '&unclose=true', {}, function (data) {
        delete data.mate.btns
        vm.dataKTable = data.mate
      }, 'GET')
    },
    handleSelected (val) {
      // map方法也可以
      val.map((i) => this.selectedIds.push(i.id))
      // 每次点击都会执行这个函数，要点击两下的时候，this.selectedIds里面包括了前面一次的数据，所以会有重复，要去重
      var json = {}
      var arr = []
      for (var i = 0; i < this.selectedIds.length; i++) {
        if (!json[this.selectedIds[i]]) {
          json[this.selectedIds[i]] = 1
          arr.push(this.selectedIds[i])
        }
      }
      this.selectedIds = arr
    },
    handleComfirm () {
      var vm = this
      if (this.selectedIds !== []) {
        this.joinIds = this.selectedIds.join(',')
        if(this.joinIds){
          this.$root.ajaxData('/inbound/receive/transactions/batchQuery?ids=' + this.joinIds, {}, function (data) {
          // 将获取到的单据编号的值传给接收单号，另外还有传过来的docNoName
          // 将获取到的西单行号的值传给接收行号，另外还有传过来的docLineName，这个值是显示用的
          for (var i = 0; i < data.mateList.rows.length; i++) {
            data.mateList.rows[i].receiveHeaderId = data.mateList.rows[i].docNo
            data.mateList.rows[i].receiveLineId = data.mateList.rows[i].docLine
            data.mateList.rows[i].receiveHeaderCode = data.mateList.rows[i].docNoName
            data.mateList.rows[i].receiveLineCode = data.mateList.rows[i].docLineName
            data.mateList.rows[i].lineNum = (i + 1)
            data.mateList.rows[i].purcharseOrderNum = data.mateList.rows[i].purcharseOrderNum
            data.mateList.rows[i].originalLineNum = data.mateList.rows[i].originalLineNum
          }

          vm.list = data.mateList
          if (data.mateFormerHeader.values.prividerType === '3') {
            data.mateFormerHeader.values.prividerTypeName = vm.$t('supplier')
          } else if (data.mateFormerHeader.values.prividerType === '4') {
            data.mateFormerHeader.values.prividerTypeName = vm.$t('customer')
          } else if (data.mateFormerHeader.values.prividerType === '0') {
            data.mateFormerHeader.values.prividerTypeName = vm.$t('organization')
          }
          vm.form.values.prividerTypeName = data.mateFormerHeader.values.prividerTypeName
          vm.form.values.prividerType = data.mateFormerHeader.values.prividerType
          vm.form.values.privider = data.mateFormerHeader.values.privider
          vm.form.values.orgId = data.mateFormerHeader.values.orgId
          vm.form.values.prividerSite = data.mateFormerHeader.values.prividerSite
          vm.form.values.prividerName = data.mateFormerHeader.values.prividerName
          vm.form.values.currency = data.mateFormerHeader.values.currency
          vm.form.values.prividerCode = data.mateFormerHeader.values.prividerCode
        }, 'GET')
        }
      }
      this.selectedIds = []
      this.dialogListVisible = false
    },
    handleBack () {
      this.dialogListVisible = false
    },
    formatterSourceType (row, col) {
      if (col.property === 'sourceType') {
        if (row.sourceType === '10') {
          return 111
        }
      }
    }
  },
  created () {
    this.mate.mateList.columns.map((i) => { this.object[i.name] = i })
    this.form = this.mate.mateFormerHeader
    this.list = this.mate.mateList
  }
}
</script>

<style scoped lang="scss">
.el-form-item__label{
  line-height:inherit
}
.button{
  margin-top:30px;
}
.tbutton {
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
