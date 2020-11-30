<!-- 收货管理新增页面 -->
<template>
  <div>
     <div class="tbutton">
      <el-button plain class="el-icon-document" :disabled="buttonDisabled" @click="handleSubmit">提 交</el-button>
      <el-button plain class="el-icon-close" @click="backward" v-if="!mate.inline">取 消</el-button>
    </div>
    <!-- 需要查询，所以将mate里面的变成了变量 -->
    <ReceiveBillFormer :mate="form" @action="searchInput" :treeDatas="treeDatas" ref="receiveBill"></ReceiveBillFormer>

    <!--定制table-->
    <el-table size="mini" :data="list.rows" border style="width: 100%; margin-top:5px;">
        <el-table-column type="selection" width="50" id="tableSel"></el-table-column>
        <el-table-column :label="columnsObject['lineNum'].label" :prop="columnsObject['lineNum'].name" :width="columnsObject['lineNum'].width"></el-table-column>
        <el-table-column :label="columnsObject['itemCode'].label" :prop="columnsObject['itemCode'].name" :width="columnsObject['itemCode'].width">
          <template slot-scope="scope">
            <span>{{scope.row['itemCode']}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="columnsObject['itemName'].label" :prop="columnsObject['itemName'].name" :width="columnsObject['itemName'].width"></el-table-column>
        <el-table-column :label="columnsObject['model'].label" :prop="columnsObject['model'].name" :width="columnsObject['model'].width"></el-table-column>
        <el-table-column :label="columnsObject['unit'].label" :prop="columnsObject['unit'].name" :width="columnsObject['unit'].width"></el-table-column>
        <el-table-column :label="columnsObject['needReceiveQty'].label" :prop="columnsObject['needReceiveQty'].name" :width="columnsObject['needReceiveQty'].width"></el-table-column>
        <el-table-column :label="columnsObject['receiveQty'].label" :prop="columnsObject['receiveQty'].name" :width="columnsObject['receiveQty'].width">
          <template slot-scope="scope">
            <el-input size="mini" v-show="true"  v-model="scope.row[columnsObject['receiveQty'].name]"></el-input>
          </template>
        </el-table-column>
        <el-table-column :label="columnsObject['receiveType'].label" :prop="columnsObject['receiveType'].name" :width="columnsObject['receiveType'].width">
          <template slot-scope="scope">
             <dict-selected v-model="scope.row[columnsObject['receiveType'].name]" dictType="receiveType" :initValue="receiveTypeDefault" ></dict-selected>
          </template>
        </el-table-column>
        <el-table-column :formatter="columnsObject['sourceType'].formatter" :label="columnsObject['sourceType'].label" :prop="columnsObject['sourceType'].name" :width="columnsObject['sourceType'].width"></el-table-column>
        
        <el-table-column :label="columnsObject['warehouseName'].label" :prop="columnsObject['warehouseName'].name" :width="columnsObject['warehouseName'].width">
          <template slot-scope="scope">
            <el-select size="mini" @change="visibleChange8(scope.row['warehouseId'])" v-model="scope.row['warehouseId']" @visible-change="scope.row['locationId'] = ''">
              <el-option :label="item.label" :value="item.value" v-for="item of columnsObject['warehouseName'].options" :key="item.id"></el-option>
            </el-select>
          </template>
        </el-table-column>
        
        <el-table-column :label="columnsObject['locationName'].label" :prop="columnsObject['locationName'].name" :width="columnsObject['locationName'].width">
          <template slot-scope="scope">
            <el-select size="mini" @visible-change="visibleChangeLocation(scope.row['warehouseId'])" v-model="scope.row['locationId']">
              <el-option :label="item.label" :value="item.value" v-for="item of columnsObject['locationName'].options" :key="item.id"></el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column :label="columnsObject['trayNo'].label" :prop="columnsObject['trayNo'].name" :width="columnsObject['trayNo'].width">
          <template slot-scope="scope">
            <el-input v-show="true" size="mini" v-model="scope.row[columnsObject['trayNo'].name]"></el-input>
          </template>
        </el-table-column>
        <!--在这里不要，只有等新增完成之后，才会生成批次-->
        <el-table-column :label="columnsObject['lotNo'].label" :prop="columnsObject['lotNo'].name" :width="columnsObject['lotNo'].width">
          <template slot-scope="scope">
            <el-input v-show="true" size="mini" v-model="scope.row[columnsObject['lotNo'].name]"></el-input>
          </template>
        </el-table-column>
        <el-table-column :label="columnsObject['originCountry'].label" :prop="columnsObject['originCountry'].name" :width="columnsObject['originCountry'].width"></el-table-column>
        <el-table-column :label="columnsObject['taxCode'].label" :prop="columnsObject['taxCode'].name" :width="columnsObject['taxCode'].width"></el-table-column>
        <el-table-column :label="columnsObject['madeDate'].label" :prop="columnsObject['madeDate'].name" :width="columnsObject['madeDate'].width"></el-table-column>
        <el-table-column :label="columnsObject['expireDate'].label" :prop="columnsObject['expireDate'].name" :width="columnsObject['expireDate'].width"></el-table-column>
        <el-table-column :label="columnsObject['packingListNumber'].label" :prop="columnsObject['packingListNumber'].name" :width="columnsObject['packingListNumber'].width">
          <template slot-scope="scope">
            <el-input v-show="true" size="mini" v-model="scope.row[columnsObject['packingListNumber'].name]"></el-input>
          </template>
        </el-table-column>
        <el-table-column :label="columnsObject['packageNo'].label" :prop="columnsObject['packageNo'].name" :width="columnsObject['packageNo'].width">
          <template slot-scope="scope">
            <el-input v-show="true" size="mini" v-model="scope.row[columnsObject['packageNo'].name]"></el-input>
          </template>
        </el-table-column>
        <el-table-column :label="columnsObject['vehicleNo'].label" :prop="columnsObject['vehicleNo'].name" :width="columnsObject['vehicleNo'].width">
          <template slot-scope="scope">
            <el-input v-show="true" size="mini" v-model="scope.row[columnsObject['vehicleNo'].name]"></el-input>
          </template>
        </el-table-column>
        <!--来源单号-->
        <el-table-column :label="columnsObject['sourceHeaderCode'].label" :prop="columnsObject['sourceHeaderCode'].name" :width="columnsObject['sourceHeaderCode'].width">
          <template slot-scope="scope">
            <span>{{scope.row['sourceHeaderCode']}}</span>
          </template>
        </el-table-column>
        <!--来源单行号-->
        <el-table-column :label="columnsObject['sourceLineCode'].label" :prop="columnsObject['sourceLineCode'].name" :width="columnsObject['sourceLineCode'].width">
          <template slot-scope="scope">
            <span>{{scope.row['sourceLineCode']}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="columnsObject['sourceShippingLineId'].label" :prop="columnsObject['sourceShippingLineId'].name" :width="columnsObject['sourceShippingLineId'].width">
          <template slot-scope="scope">
            <el-input v-show="true" size="mini" v-model="scope.row[columnsObject['sourceShippingLineId'].name]"></el-input>
          </template>
        </el-table-column>
        <el-table-column :label="columnsObject['docDetailRemark'].label" :prop="columnsObject['docDetailRemark'].name" :width="columnsObject['docDetailRemark'].width">
          <template slot-scope="scope">
            <el-input v-show="true" size="mini" v-model="scope.row[columnsObject['docDetailRemark'].name]"></el-input>
          </template>
        </el-table-column>
    </el-table>
    <!--size="large"-->
    <el-dialog title="搜索" :visible.sync="dialogListVisible" width="80%">
      <KTable :mate="dataKTable" @actionSearch="actionSearch" @actionSelected="handleSelected" />
      <div class="fbutton">
        <el-button @click="handleComfirm">确 认</el-button>
        <el-button @click="handleBack">返 回</el-button>
      </div>
    </el-dialog>

   
  </div>
</template>

<script>
import { DateFormat } from '../../utils/util.js'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
export default {
  mixins: [ColumnFormatterMixin],
  data () {
    return {
      buttonDisabled: false,
      object: {},
      objectDialog: {},                   // dialog里面获取到的数据
      dialogFormVisible: false,
      dialogListVisible: false,
      dataKTable: {},
      searchData: 0,
      selectedIds: [],                    // table中勾选的入库单据的id
      selectedId: 0,                      // table中勾选的需要修改的id
      joinIds: '',                        // 将上面table中勾选的入库单据的id拼接在一起，发送请求用
      form: {},
      list: {},
      columns: [],                        // 用来存放list里面的数据
      btnsSave: [],                       // 用来存放list里面的btns数据
      rowId: 0,                           // 需要修改的row中的id
      updateReceiveLine: {},              // 修改接收单据明细行
      warehouseName: '',
      formValues: {},
      locationName: '',
      treeDatas: {},
      columnsObject: {},
      copyQuantity: 0,                     // 存放弹出框的数量
      receiveTypeDefault: '1'              // 接收类型默认值
    }
  },
  computed: {
    rules () {
      var rs = {}
      var vm = this
      var rls = this.mate.mateFormer.rules
      for (var index in rls) {
        var r = []
        var rule = rls[index]
        for (var i in rule) {
          var nv = rule[i]
          if (nv.validator) {
            nv.validator = vm[nv.validator]
          }
          r[i] = nv
        }
        rs[index] = r
      }
      return rs
    }
  },
  components: {
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
    },
    ReceiveBillFormer: function index (resolve) {
      require(['./ReceiveBillFormer.vue'], resolve)
    },
    KTable: function index (resolve) {
      require(['../../components/KTable.vue'], resolve)
    }
  },
  props: {
    mate: Object
  },
  methods: {
    // 如果仓库改变
    visibleChange8 (val) {
      var vm = this
      vm.columnsObject['locationName'].options = []
      this.$root.ajaxData('/dc/' + val + '/locals?cols=id,name&dataOnly=true', {}, function (data) {
        for (var i = 0; i < data.length; i++) {
          vm.columnsObject['locationName'].options.push({ value: data[i].id, label: data[i].name })
        }
      }, 'GET')
    },
    visibleChangeLocation (val) {
      // this.$alert(val)

    },
    handleKtable (btn, row) {
      var vm = this
      this.dialogFormerVisible = true
      this.rowId = this.selectId
      for (var i = 0; i < this.list.rows.length; i++) {
        if (this.list.rows[i].id === this.rowId) {
          this.numRowId = i
        }
      }
      // 获取到储位的option
      if (this.warehouseName) {
        vm.objectDialog['locationName'].options = []
        this.$root.ajaxData('/dc/' + this.warehouseName + '/locals?cols=id,name&dataOnly=true', {}, function (data) {
          for (var i = 0; i < data.length; i++) {
            var name = data[i].name
            var id = data[i].id
            var options = { value: id, label: name }
            vm.objectDialog['locationName'].options.push(options)
          }
        }, 'GET')
      }
    },
    // 点击搜索框 执行的函数
    searchInput () {
      var vm = this
      this.dialogListVisible = true
      this.$root.ajaxData('/inbound/bill/headers/queryBill', {}, function (data) {
        delete data.mate.btns
        delete data.mate.search               // 将搜索框删除
        vm.dataKTable = data.mate
        // 已接收数量 = 数量 - 待接收数量      数量和待接收数量是在收货管理中
        for (var i = 0; i < data.mate.rows.length; i++) {
          data.mate.rows[i].needReceiveQty = data.mate.rows[i].receiveQty
        }
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
        if (this.joinIds) {
          this.$root.ajaxData('/inbound/bill/headers/batchQuery?ids=' + this.joinIds, {}, function (data) {
            // 将获取到的数据放进原来的form里面，不能更改原来的数据
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
            vm.form.values.prividerSite = data.mateFormerHeader.values.prividerSite
            vm.form.values.prividerName = data.mateFormerHeader.values.prividerName
            vm.form.values.currency = data.mateFormerHeader.values.currency
            vm.form.values.advancedShipDate = data.mateFormerHeader.values.advancedShipDate
            vm.form.values.orgId = data.mateFormerHeader.values.orgId
            vm.form.values.orgName = data.mateFormerHeader.values.orgName
            vm.copyQuantity = data.mateFormerHeader.values.quantity               // 存放数量
            // 应收数量 = 搜索出来的待接收数量
            for (var item of data.mateList.rows) {
              item.needReceiveQty = item.receiveQty
            }
            vm.list = data.mateList
            // 获取储位
            for (var i = 0; i < vm.list.rows.length; i++) {
              vm.columnsObject['locationName'].options.push({ value: vm.list.rows[i].locationId, label: vm.list.rows[i].locationName })
            }
            vm.list.columns = vm.columns
            vm.list.btns = vm.btnsSave
          }, 'GET')
        }
      }
      this.selectedIds = []
      this.dialogListVisible = false
    },
    handleBack () {
      this.dialogListVisible = false
    },
    handleSubmit (ev) {
      this.buttonDisabled = true
      var vm = this
      var mate = {}
      this.form.values.receiveDate = DateFormat(this.form.values.receiveDate, 'yyyy-MM-dd')
      this.form.values.advancedShipDate = DateFormat(this.form.values.advancedShipDate, 'yyyy-MM-dd')
      mate.mateFormerHeader = this.form.values
      mate.mateList = this.list.rows
      if (this.mate.mateFormerHeader.method === 'PUT' && this.mate.mateFormerHeader.values.id) {
        this.$root.ajaxData('/inbound/receive/headers/batchUpdate/' + this.form.values.id, mate, function (data) {
          if (data.code === 1008) {
            vm.$message({
              message: data.message,
              type: 'warning'
            })
            vm.buttonDisabled = false
            return
          }
          vm.$root.monitor({ url: '/inbound/receive/headers/all/list' })
        }, 'PUT')
      } else if (this.mate.mateFormerHeader.method === 'POST') {
        this.$root.ajaxData('/inbound/receive/headers/batchSave', mate, function (data) {
          if (data.code === 1008) {
            vm.$message({
              message: data.message,
              type: 'warning' })
            vm.buttonDisabled = false
            return
          }
          vm.$root.monitor({ url: '/inbound/receive/headers/all/list' })
        }, 'POST')
      }
    },
    backward () {
      this.$root.monitor({ url: '/inbound/receive/headers/all/list' })
    }
  },
  watch: {
    mate: function (newMate) {
      this.formatterBefore(this.mate.mateList.columns)
    }
  },
  created () {
    var vm = this
    this.formatterBefore(this.mate.mateList.columns)
    this.mate.mateFormer.fields.map((i) => { this.object[i.name] = i })
    this.mate.mateList.columns.map((i) => { this.columnsObject[i.name] = i })
    this.form = this.mate.mateFormerHeader
    // 将重复的去掉，不然会将以前保存的值覆盖
    // 将获取到的values值放入到formvalues里面，在用户选择入库单号时，将其放入获取的form的values里面
    this.list = this.mate.mateList
    this.btnsSave = this.mate.mateList.btns
    this.columns = this.mate.mateList.columns
    // 仓库
    this.$root.ajaxData('/dc/list?nopaging=1&dataOnly=true', {}, function (data) {
      for (var i = 0; i < data.length; i++) {
        vm.columnsObject['warehouseName'].options.push({ value: data[i].id, label: data[i].name })
      }
    }, 'GET')
    // 获取储位
    for (var i = 0; i < this.mate.mateList.rows.length; i++) {
      vm.columnsObject['locationName'].options.push({ value: this.mate.mateList.rows[i].locationName, label: this.mate.mateList.rows[i].locationName })
    }
    if (this.mate.treeDataLoad) {
      const vm = this
      this.mate.treeDataLoad.map(i => {
        this.$root.ajaxData(i.url, {}, function (data) {
          vm.treeDatas[i.prop] = data
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.button{
  margin-top:30px;
}
.el-form-item__label{
  line-height:inherit
}
.receiveBillList .multiselect{
  margin-top:36px;
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

