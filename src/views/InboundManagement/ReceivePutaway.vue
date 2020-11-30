<template>
  <div>
    <div class="tbutton">
      <el-button plain class="el-icon-document" :disabled="buttonDisabled" @click="handleSubmit">提 交</el-button>
      <el-button plain class="el-icon-close" @click="backward" v-if="!mate.inline">取 消</el-button>
    </div>
    <ReceivePutawayFormer @action="searchInput" :mate="form"></ReceivePutawayFormer>
    <el-table size="mini" :data="list.rows" border fit highlight-current-row style="width: 100%" class="el-table-margin">
      <el-table-column :label="objectColumns['lineNum'].label" width="100">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['lineNum'].name]}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="objectColumns['itemCode'].label" width="100">
        <template slot-scope="scope">
          <span>{{scope.row['itemCode']}}</span>
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
      <el-table-column :label="objectColumns['itemStatus'].label" width="100">
        <template slot-scope="scope">
          <span>{{scope.row['itemStatus'] === '1' ? $t('qualified') : (scope.row['itemStatus'] === '0' ? $t('disqualification') : scope.row['itemStatus'])}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="objectColumns['receiveQty'].label" width="100">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['receiveQty'].name]}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="objectColumns['putawayedQty'].label" width="100">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['putawayedQty'].name]}}</span>
        </template>
      </el-table-column>
     <el-table-column :label="objectColumns['txnProcessQty'].label" width="120">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['txnProcessQty'].name]}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="objectColumns['putawayQty'].label" width="100">
        <template slot-scope="scope">
          <el-input v-show="true" size="mini" v-model="scope.row[objectColumns['putawayQty'].name]"></el-input>
        </template>
      </el-table-column>
      <el-table-column :label="objectColumns['warehouseName'].label" width="150">
        <template slot-scope="scope">
          <el-select clearable v-model="scope.row['warehouseId']" @change="scope.row['locationId'] = ''">
            <el-option :label="item.label" :value="item.value" v-for="(item,index) of objectColumns['warehouseName'].options" :key="index"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column :label="objectColumns['locationName'].label" width="150">
        <template slot-scope="scope">
          <el-select clearable v-model="scope.row['locationId']" @visible-change="visibleChangeLocation(scope.row['warehouseId'])">
            <el-option :label="item.label" :value="item.value" v-for="(item,index) of objectColumns['locationName'].options" :key="index"></el-option>
          </el-select>
        </template> 
      </el-table-column>
     <el-table-column :label="objectColumns['batchNo'].label" width="100">
        <template slot-scope="scope">
          <span>{{scope.row['batchNo']}}</span>
        </template>
      </el-table-column>
     <el-table-column :label="objectColumns['lotNo'].label" width="100">
        <template slot-scope="scope">
          <el-input v-show="true" size="mini" v-model="scope.row[objectColumns['lotNo'].name]"></el-input>
        </template>
     </el-table-column>
      <el-table-column :label="objectColumns['receiveHeaderCode'].label" width="100">
        <template slot-scope="scope">
          <span>{{scope.row['receiveHeaderCode']}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="objectColumns['receiveLineCode'].label" width="100">
        <template slot-scope="scope">
          <span>{{scope.row['receiveLineCode']}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="objectColumns['txnProcessStatus'].label" width="150">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['receiveType'].name] === '3' ? $t('need-inspect') : (scope.row[objectColumns['receiveType'].name] === '2' ? $t('standard-receive') : (scope.row[objectColumns['receiveType'].name] === '1' ? $t('direct-receive') : scope.row[objectColumns['receiveType'].name]))}}-{{scope.row.inspectStatus === 'ACCEPTED' ? $t('ACCEPTED') : (scope.row.inspectStatus === 'NOT INSPECTED' ? $t('notInspeced') : $t('REJECTED'))}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="objectColumns['madeDate'].label" width="100">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['madeDate'].name]}}</span>
        </template>
      </el-table-column>
     <el-table-column :label="objectColumns['expireDate'].label" width="100">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['expireDate'].name]}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="objectColumns['packageNo'].label" width="100">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['packageNo'].name]}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="objectColumns['sourceType'].label" width="100">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['sourceType'].name] === '10' ? $t('purchasingStorage') : 
            (scope.row[objectColumns['sourceType'].name] === '11' ? $t('finishingWarehousing') : 
            (scope.row[objectColumns['sourceType'].name] === '12' ? $t('borrow') : scope.row[objectColumns['sourceType'].name]))}}</span>
        </template>
      </el-table-column>
     <el-table-column :label="objectColumns['sourceHeaderCode'].label" width="100">
        <template slot-scope="scope">
          <span>{{scope.row['sourceHeaderCode']}}</span>
        </template>
      </el-table-column>
     <el-table-column :label="objectColumns['sourceLineCode'].label" width="100">
        <template slot-scope="scope">
          <span>{{scope.row['sourceLineCode']}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="objectColumns['sourceShippingLineId'].label" width="100">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['sourceShippingLineId'].name]}}</span>
        </template>
      </el-table-column>
     <el-table-column :label="objectColumns['receiveType'].label" width="100">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['receiveType'].name] === '3' ? $t('need-inspect') : (scope.row[objectColumns['receiveType'].name] === '2' ? $t('standard-receive') : (scope.row[objectColumns['receiveType'].name] === '1' ? $t('direct-receive') : scope.row[objectColumns['receiveType'].name]))}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="objectColumns['originCountry'].label" width="100">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['originCountry'].name]}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="objectColumns['putawayRemark'].label" width="100">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['putawayRemark'].name]}}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--ize="large"-->
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
      objectColumns: {},
      dialogListVisible: false,
      dataKTable: {},
      selectedIds: [],                     // table中勾选的入库单据的id
      txnProcessStatusJoin: ''
    }
  },
  components: {
    ReceivePutawayFormer: function index (resolve) {
      require(['./ReceivePutawayFormer.vue'], resolve)
    },
    KTable: function index (resolve) {
      require(['../../components/KTable.vue'], resolve)
    }
  },
  props: {
    mate: Object
  },
  methods: {
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
        this.$root.ajaxData('/inbound/receive/transactions/batchQuery?ids=' + this.joinIds, {}, function (data) {
          // vm.form = Object.assign({}, vm.form, data.mateFormerHeader.values) // data.mateFormerHeader
          for (var i = 0; i < data.mateList.rows.length; i++) {
            data.mateList.rows[i].receiveHeaderId = data.mateList.rows[i].docNo
            data.mateList.rows[i].receiveLineId = data.mateList.rows[i].docLine
            data.mateList.rows[i].receiveHeaderCode = data.mateList.rows[i].docNoName
            data.mateList.rows[i].receiveLineCode = data.mateList.rows[i].docLineName
            data.mateList.rows[i].lineNum = (i + 1)
            data.mateList.rows[i].txnProcessStatus = data.mateList.rows[i].receiveType + '-' + data.mateList.rows[i].inspectStatus
            data.mateList.rows[i].putawayedQty = data.mateList.rows[i].txnQty - data.mateList.rows[i].txnProcessQty
            data.mateList.rows[i].purcharseOrderNum = data.mateList.rows[i].purcharseOrderNum
            data.mateList.rows[i].originalLineNum = data.mateList.rows[i].originalLineNum
          }
          vm.form.values.prividerType = data.mateFormerHeader.values.prividerType
          vm.form.values.privider = data.mateFormerHeader.values.privider
          vm.form.values.prividerSite = data.mateFormerHeader.values.prividerSite
          vm.form.values.prividerName = data.mateFormerHeader.values.prividerName
          vm.form.values.prividerTypeName = data.mateFormerHeader.values.prividerTypeName
          vm.form.values.orgId = data.mateFormerHeader.values.orgId
          vm.form.values.currency = data.mateFormerHeader.values.currency
          vm.form.values.prividerCode = data.mateFormerHeader.values.prividerCode
          vm.list = data.mateList
          // 点击确定时，要将储位转化为
          for (var k = 0; k < data.mateList.rows.length; k++) {
            if (data.mateList.rows[k].warehouseId !== null) {
              vm.$root.ajaxData('/dc/' + data.mateList.rows[k].warehouseId + '/locals?cols=id,name&dataOnly=true', {}, function (data) {
                for (var j = 0; j < data.length; j++) {
                  vm.objectColumns['locationName'].options.push({ value: data[j].id, label: data[j].name })
                }
              })
            }
          }
        }, 'GET')
      }
      this.selectedIds = []
      this.dialogListVisible = false
    },
    handleBack () {
      this.dialogListVisible = false
    },
    handleSubmit (ev) {
      this.buttonDisabled = true
      var mate = {}
      var vm = this
      this.form.values.putawayDate = DateFormat(this.form.values.putawayDate, 'yyyy-MM-dd HH:mm:ss')
      mate.mateFormerHeader = this.form.values
      mate.mateList = this.list.rows
      if (this.list.rows.length === 0) {
        vm.$message({
          message: this.$t('Detailed data can not be empty'),
          type: 'warning'
        })
        this.buttonDisabled = false
        return
      }

      var chkmsg = ''
      for (var k = 0; k < this.list.rows.length; k++) {
        if ((this.list.rows[k].putawayQty === undefined) || (trimSpace(this.list.rows[k].putawayQty) === '')) {
          chkmsg = '明细数据第' + (k + 1) + '行的上架数量不能为空'
          this.buttonDisabled = false
          break
        }

        if (!isPositiveinteger(trimSpace(this.list.rows[k].putawayQty))) {
          chkmsg = '明细数据第' + (k + 1) + '行的上架数量必须为正整数'
          this.buttonDisabled = false
          break
        }

        if (this.list.rows[k].putawayQty > this.list.rows[k].txnProcessQty) {
          chkmsg = '明细数据第' + (k + 1) + '行的上架数量不能大于待上架数量'
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
        this.$root.ajaxData('/inbound/putaway/headers/batchSave', mate, function () {
          vm.$root.monitor({ url: '/inbound/putaway/headers/all/list' })
        }, 'POST')
      } else {
        this.$root.ajaxData('/inbound/putaway/headers/batchUpdate' + '/' + mate.mateFormerHeader.id, mate, function () {
          vm.$root.monitor({ url: '/inbound/putaway/headers/all/list' })
        }, 'PUT')
      }
    },
    backward () {
      this.$root.monitor({ url: '/inbound/putaway/headers/all/list' })
    },
    visibleChangeLocation (flag) {
      if (flag === '') {
        return
      }
      var vm = this
      vm.objectColumns['locationName'].name = ''
      vm.objectColumns['locationName'].options = []
      this.$root.ajaxData('/dc/' + flag + '/locals?cols=id,name&dataOnly=true', {}, function (data) {
        for (var i = 0; i < data.length; i++) {
          vm.objectColumns['locationName'].options.push({ value: data[i].id, label: data[i].name })
        }
      }, 'GET')
    },
    // 点击搜索框 执行的函数
    searchInput () {
      var vm = this
      this.dialogListVisible = true
      this.$root.ajaxData('/inbound/receive/transactions/queryPutaway', {}, function (data) {
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
    }
  },
  created () {
    var vm = this
    this.form = this.mate.mateFormerHeader
    this.list = this.mate.mateList
    this.list.columns.map((i) => { this.objectColumns[i.name] = i })
    this.$root.ajaxData('/dc/list?nopaging=1&dataOnly=true', {}, function (data) {
      for (var i = 0; i < data.length; i++) {
        vm.objectColumns['warehouseName'].options.push({ value: data[i].id, label: data[i].name })
      }
    }, 'GET')
    for (let i = 0; i < this.list.rows.length; i++) {
      if (this.list.rows[i].warehouseId !== null) {
        this.$root.ajaxData('/dc/' + this.list.rows[i].warehouseId + '/locals?cols=id,name&dataOnly=true', {}, function (data) {
          for (var i = 0; i < data.length; i++) {
            vm.objectColumns['locationName'].options.push({ value: data[i].id, label: data[i].name })
          }
        }, 'GET')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.el-form-item__label{
  line-height:inherit
}
.el-table-margin{
  margin-top:5px;
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