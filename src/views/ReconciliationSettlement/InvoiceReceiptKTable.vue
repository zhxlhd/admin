<template>
<div>
   <div class="searchForm">
  <el-row>
    <el-form  size="mini" label-width="130px" :model="searchForm" :label-position="labelPosition">
        <el-col :sm="12" :md="12" :lg="8">
            <el-form-item :label="object['busiEntity'].label" :prop="object['busiEntity'].name">
              <el-select size="mini" filterable clearable v-model="searchForm.busiEntity">
                <el-option v-for="item in officeIdOption" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="8">
            <el-form-item :label="object['transferNum'].label" :prop="object['transferNum'].name">
               <el-input size="mini" clearable v-model="searchForm.transferNum" ></el-input>
            </el-form-item>
          </el-col>
           <el-col :sm="12" :md="12" :lg="8">
            <el-form-item :label="object['transferStatus'].label" :prop="object['transferStatus'].name">
               <dict-selected  v-model="searchForm.transferStatus" dictType="receiptStatus" :initValue="searchForm.transferStatus"></dict-selected>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="8">
            <el-form-item :label="object['seller'].label" :prop="object['seller'].name">
              <!-- <el-input size="mini" clearable v-model="searchForm.seller" ></el-input> -->
              <el-select clearable filterable size="mini" v-model="searchForm.seller" placeholder="销方公司">
                <el-option
                  v-for="item in supplierOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="8">
            <el-form-item :label="object['invoiceNo'].label" :prop="object['invoiceNo'].name">
             <el-input size="mini" clearable v-model="searchForm.invoiceNo" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="8">
            <el-form-item :label="object['startTime'].label" :prop="object['startTime'].name">
             <el-date-picker size="mini" v-model="searchForm.startTime"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="8">
            <el-form-item :label="object['endTime'].label" :prop="object['endTime'].name">
             <el-date-picker @change="changeDate" size="mini" v-model="searchForm.endTime"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="8">
            <el-form-item :label="object['price'].label" :prop="object['price'].name">
             <el-input size="mini" disabled v-model="searchForm.price" ></el-input>
            </el-form-item>
          </el-col>
           <el-col :sm="12" :md="12" :lg="8">
            <el-form-item>
           <el-button size="mini" @click="findMyInvoice">查询</el-button>
            </el-form-item>
          </el-col>
    </el-form>
  </el-row>
  </div>
  <Boxer :mate="mate.headerListDto" :hasSelected="hasSelected" @action="handleButton" ref="Boxer" :msgBoxButton="msgBoxButton">
    <div slot="main">
      <el-row>
        <el-col :span="24">
          <el-table show-overflow-tooltip max-height="250" size="mini" highlight-current-row ref="table" :data="mate.headerListDto.rows" border @selection-change="handleSelectionChange" @sort-change="sortChange" style="width: 100%;">
            <el-table-column fixed="left"  type="selection" width="50" id="tableSel"></el-table-column>
            <el-table-column show-overflow-tooltip :label="list['busiEntityName'].label" :width="list['busiEntityName'].width" :prop="list['busiEntityName'].name"></el-table-column>
            <!-- <el-table-column show-overflow-tooltip :label="list['transferHeadStatus'].label" :formatter="list['transferHeadStatus'].formatter" :width="list['transferHeadStatus'].width" :prop="list['transferHeadStatus'].name"></el-table-column> -->
            <el-table-column show-overflow-tooltip :label="list['status'].label" :formatter="list['status'].formatter" :width="list['status'].width" :prop="list['status'].name"></el-table-column>
            <el-table-column show-overflow-tooltip :label="list['invoiceNo'].label" :width="list['invoiceNo'].width" :prop="list['invoiceNo'].name"></el-table-column>
            <el-table-column show-overflow-tooltip :label="list['seller'].label"  :width="list['seller'].width" :prop="list['seller'].name"></el-table-column>
            <el-table-column show-overflow-tooltip :label="list['transferNum'].label" :width="list['transferNum'].width"  :prop="list['transferNum'].name" style="color:#212121">
              <!-- <template slot-scope="scope">
                <el-button type="text" class="detailButton"  @click="editReceipt(scope.row)">{{ scope.row['transferNum'] }} </el-button>
              </template> -->
           </el-table-column>
        <el-table-column show-overflow-tooltip :label="list['transferCreator'].label"  :width="list['transferCreator'].width" :prop="list['transferCreator'].name"></el-table-column>
        <el-table-column show-overflow-tooltip :label="list['createAt'].label" :width="list['createAt'].width" :prop="list['createAt'].name">
        </el-table-column>
        <el-table-column show-overflow-tooltip :label="list['makeInvoiceTime'].label"  :width="list['makeInvoiceTime'].width" :prop="list['makeInvoiceTime'].name">
        </el-table-column>
        <el-table-column show-overflow-tooltip :label="list['taxRate'].label"   :formatter="list['taxRate'].formatter" :width="list['taxRate'].width" :prop="list['taxRate'].name">
        </el-table-column>
        <el-table-column show-overflow-tooltip :label="list['totalPrice'].label"  :width="list['totalPrice'].width" :prop="list['totalPrice'].name">
        </el-table-column>
        <el-table-column show-overflow-tooltip :label="list['totalTax'].label"  :width="list['totalTax'].width" :prop="list['totalTax'].name">
        </el-table-column>
        <el-table-column show-overflow-tooltip :label="list['totalPriceTax'].label"  :width="list['totalPriceTax'].width" :prop="list['totalPriceTax'].name">
        </el-table-column>
              <el-table-column label="操作" fixed="right" :min-width="actionWidth" v-if="mate.headerListDto.actions">
                <template slot-scope="scope">
                  <k-btn v-for="act of mate.headerListDto.actions" v-bind:key="act.action" size="mini" :act="act" :icon="act.icon" :row="scope.row" @action="handleAction"></k-btn>
                </template>
              </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" class="page" >
      <el-col :span="12">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="page"
            layout="total,prev, pager, next, sizes"
            :total="total"
            :page-sizes ="[5, 10, 15, 20, 50]"
            :page-size="pageSize">
        </el-pagination>
      </el-col>
      </el-row>
    </div>
  </Boxer>
    <el-dialog title="查看流程" :visible.sync="dialogVisible"  center>
      <el-table size="mini" :data="processlist" border fit highlight-current-row style="width: 100%">
        <el-table-column align="center" :label="objectColumns['createAt'].label" :prop="objectColumns['createAt'].name"></el-table-column>
          <el-table-column align="center" :label="objectColumns['processNode'].label" :prop="objectColumns['processNode'].name" ></el-table-column>
          <el-table-column align="center" :label="objectColumns['creator'].label" :prop="objectColumns['creator'].name"></el-table-column>
          <el-table-column align="center" :label="objectColumns['processName'].label" :prop="objectColumns['processName'].name"></el-table-column>
      </el-table>
    </el-dialog>
</div>
</template>

<script>
import KBtn from '../../components/KBtn.vue'
import Boxer from '../../components/Boxer.vue'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
import { DateFormat } from '../../utils/util.js'
// 将小数保留2位
function toDecimal (x) {
  var f = parseFloat(x)
  if (isNaN(f)) {
    return
  }
  f = Math.round(x * 100) / 100
  return f
}
export default {
  props: {
    mate: Object
  },
  mixins: [ColumnFormatterMixin],
  components: {
    KBtn,
    Boxer,
    Formor: function index (resolve) {
      require(['../../components/Formor.vue'], resolve)
    },
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
    }
  },
  data () {
    return {
      dialogVisible: false,
      form: {},
      object: {},
      page: 1,
      labelPosition: 'right',
      objectColumns: {},
      billType: '',
      searchForm: {},
      officeIdOption: [],
      supplierOptions: [],
      dialogDetailLine: false,
      pageSize: 5,
      list: {},
      showAdvancedSearchPopover: false,
      processlist: [],
      msgBoxButton: true,
      multipleSelection: [],
      hasSelected: false
    }
  },
  watch: {
    multipleSelection: function (newSelection) {
      this.hasSelected = (newSelection.length !== 0)
      var total = 0
      for (var i = 0; i < newSelection.length; i++) {
        total += newSelection[i].totalPriceTax
      }
      this.$set(this.searchForm, 'price', total)
      this.searchForm.price = toDecimal(total)
    },
    mate: function (newMate) {
      this.searchValues = {}
      this.formatterBefore(this.mate.headerListDto.columns)
      this.billType = this.mate.headerFormDto.values.itemType
      this.$nextTick(function () {
        this.rowSelect()
      })
    }
  },
  created () {
    let headerFormDto = this.mate.headerFormDto
    let headerListDto = this.mate.headerListDto
    this.formatterBefore(this.mate.headerListDto.columns)
    headerFormDto.fields.map((i) => { this.object[i.name] = i })
    headerListDto.columns.map((i) => { this.list[i.name] = i })
    this.mate.processListDto.columns.map((i) => { this.objectColumns[i.name] = i })
    this.billType = headerFormDto.values.itemType
    this.total = headerListDto.total
    var vm = this
    this.$root.ajaxData('/users/office', {}, function (data) {
      data.forEach((i) => {
        vm.officeIdOption.push({ 'label': i.name, 'value': i.id })
      })
    })
    this.getSupplier()
  },
  computed: {
    actionWidth: function () {
      return this.mate.headerListDto.actions.length * 60 + 30
    }
  },
  mounted () {
    this.rowSelect()
  },
  methods: {
    message(message, type) {
      this.$message({
        message: message,
        type: type
      })
    },
    findMyInvoice () {
      var vm = this
      this.searchForm.startTime = DateFormat(this.searchForm.startTime, 'yyyy-MM-dd HH:mm:ss')
      this.searchForm.endTime = DateFormat(this.searchForm.endTime, 'yyyy-MM-dd HH:mm:ss')
      if (this.billType === '0') {
        this.$root.ajaxData('/purchase/invoiceReceipt/all/list?transferType=0', this.searchForm, function (data) {
          vm.mate.headerListDto.rows = data.mate.headerListDto.rows
          vm.total = data.mate.headerListDto.total
        }, 'GET')
      } else {
        this.$root.ajaxData('/purchase/invoiceReceipt/all/list?transferType=1', this.searchForm, function (data) {
          vm.mate.headerListDto.rows = data.mate.headerListDto.rows
          vm.total = data.mate.headerListDto.total
        }, 'GET')
      }
    },
    changeDate (val) {
      if (val < this.searchForm.startTime) {
        this.message('请选择比创建日期大的日期', 'warning')
        this.searchForm.endTime = ''
      }
    },
    getSupplier () {
      var vm = this
      this.$root.ajaxData('/companys/companyInfo/3?auditStatus=1&nopaging=1&status=1&dataOnly=true&&onlyCompanyFlag=true', {}, function (data) {
        vm.supplierData = data
        for (let i = 0; i < data.length; i++) {
          vm.supplierOptions.push({ label: data[i].name, value: data[i].name, key: data[i].id })
        }
      }, 'GET')
    },
    query () {
      const mate = [this.mate.mateSearch.values]
      this.searchValues = mate
      const vm = this
      const url = this.mate.mateSearch.url
      this.$root.ajaxData(url, mate, function (data) {
        vm.mate.headerListDto.rows = data.mate.rows
        vm.mate.headerListDto.total = data.mate.total
      }, 'POST')
    },
    showSearchPopover () {
      this.showAdvancedSearchPopover = !this.showAdvancedSearchPopover
    },
    editReceipt (row) {
      if (row.transferHeadStatus !== '0') {
        this.message('已交接的交接单不能修改', 'warning')
        return
      }
      var arr = []
      this.$root.monitor({ url: '/purchase/invoiceReceipt/genTransferOrder?ids=' + arr + '&transferId=' + row.transferId })
    },
    diffStatus (status,val) {
      var vm = this
      this.$root.ajaxData('/purchase/invoiceReceipt/updateStatus?invoiceIds=' + val.id + `&status=${status}`, {}, function (data) {
        if (vm.billType === '0') {
          vm.$root.monitor({ url: '/purchase/invoiceReceipt/all/list?transferType=0' })
        } else {
          vm.$root.monitor({ url: '/purchase/invoiceReceipt/all/list?transferType=1' })
        }
      }, 'PUT')
    },
    handleButton (btn) {
      var vm = this
      let row = (btn.isApi || btn.ajax || btn.edit) ? { id: this.multipleSelection.map((r) => r.id) } : {}
      if (btn.action === 'editReceipt') {
        if (this.multipleSelection.length !== 1) {
          this.message(this.$t('seladata'), 'warning')
          return
        }
        vm.$root.monitor({ url: '/purchase/invoiceReceipt/genTransferOrder?transferId=' + this.multipleSelection[0].transferId + '&ids=' })
        return
      }
      // 申请融资
      if (btn.action === 'applyFinancing') {
        var vm = this
        const rowt = this.multipleSelection[0].transferId
        var financeStatus = false
        for (var i=0;i<this.multipleSelection.length - 1; i++) {
          if (this.multipleSelection[i].transferNum !== vm.multipleSelection[i+1].transferNum) {
            vm.message('只有同一交接单的可以一起融资', 'warning')
            return
          }
        }
        this.multipleSelection.forEach(item=> {
          if(item.status !== '3') {
            financeStatus = true
          }
        })
        if(financeStatus) {
          vm.message('请选择已审批的交接单', 'warning')
          return
        } else {
          this.$root.ajaxData(`/purchase/finance/dictApply/${rowt}`, {}, function (data) {
            if (data.statusCode === 5000) {
              vm.message('采购方未接收审批发票，暂时无法进行融资申请', 'warning')
              return
            } 
            else if (data.statusCode === 5001) {
              vm.message('该交接单已申请融资，请勿重复提交', 'warning')
              return
            } else if (data.statusCode === 5002){
              vm.message('该交接单总金额为负数，不能进行融资', 'warning')
              return
            }
            else {
              vm.$root.monitor({ url: `/purchase/finance/apply/${rowt}`})
              return
            }
          }, 'GET')
          return
        }
      }
      // 删除
      if (btn.action === 'deleteReceipt') {
        var vm = this
        var deleteStatus = false
        this.multipleSelection.forEach(item=>{
          if(item.status !== '0'){
            deleteStatus = true
          }
        })
        if(deleteStatus){
          this.message('只有新建状态的交接单可以删除', 'warning')
          return
        }
        const rowt = true ? { id: this.multipleSelection.map((r) => r.transferId) } : {}
        // this.diffStatus('0',rowt)
        var ids = []
        this.multipleSelection.forEach(item=>{
          ids.push(item.id)
        })
        this.$root.ajaxData('/purchase/invoiceReceipt/batch/del', rowt.id, function (data) {
          if(data.statusCode === 40058){
            vm.message('只有新建状态的交接单可以删除', 'warning')
            return
          }
          if (vm.billType === '0') {
            vm.$root.monitor({ url: '/purchase/invoiceReceipt/all/list?transferType=0' })
          } else {
            vm.$root.monitor({ url: '/purchase/invoiceReceipt/all/list?transferType=1' })
          }
      }, 'PUT')
        return
      }
      // // 取消
      // if (btn.action === 'cancelReceipt') {
      //   if (this.multipleSelection.length === 0) {
      //     this.message('请选择一条数据', 'warning')
      //     return
      //   }
      //   for (i = 0; i < this.multipleSelection.length; i++) {
      //     if (this.multipleSelection[i].transferStatus !== '0') {
      //       this.message('请选待接收状态的交接单', 'warning')
      //       return
      //     }
      //   }
      //   const rowt = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
      //   this.diffStatus('7')
      //   return
      // }// 发票提交审批
      // if (btn.action === 'tijiaoReceipt') {
      //   if (this.multipleSelection.length === 0) {
      //     this.message('请选择一条数据', 'warning')
      //     return
      //   }
      //   for (i = 0; i < this.multipleSelection.length; i++) {
      //     if (this.multipleSelection[i].transferStatus !== '4') {
      //       this.message('请选择已驳回的交接单', 'warning')
      //       return
      //     }
      //   }
      //   const rowt = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
      //   this.diffStatus('2')
      //   return
      // }
      // // 发票接收
      // if (btn.action === 'receivedReceipt') {
      //   if (this.multipleSelection.length === 0) {
      //     this.message('请选择一条数据', 'warning')
      //     return
      //   }
      //   for (i = 0; i < this.multipleSelection.length; i++) {
      //     if (this.multipleSelection[i].transferStatus !== '0') {
      //       this.message('请选择待接收状态的交接单', 'warning')
      //       return
      //     }
      //   }
      //   const rowt = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
      //   this.diffStatus('1')
      //   return
      // }
      // 审批通过
      if (btn.action === 'approveReceipt') {
        var auditStatus = false
        this.multipleSelection.forEach(item=>{
          if(item.status !== '2'){
            auditStatus = true
          }
        })
        if(auditStatus){
          this.message('请选择待审批的交接单', 'warning')
          return
        }
        const rowt = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.diffStatus('3',rowt)
        return
      }
      // 审批驳回
      if (btn.action === 'invalidReceipt') {
        var auditStatus = false
        this.multipleSelection.forEach(item=>{
          if(item.status !== '2'){
            auditStatus = true
          }
        })
        if(auditStatus){
          this.message('请选择待审批的交接单', 'warning')
          return
        }
        const rowt = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.diffStatus('4',rowt)
        return
      }
      // // 退票接收
      // if (btn.action === 'receivedToReceipt') {
      //   if (this.multipleSelection.length === 0) {
      //     this.message('请选择一条数据', 'warning')
      //     return
      //   }
      //   for (i = 0; i < this.multipleSelection.length; i++) {
      //     if (this.multipleSelection[i].transferStatus !== '4') {
      //       this.message('请选择状态是已驳回的交接单', 'warning')
      //       return
      //     }
      //   }
      //   const rowt = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
      //   this.diffStatus('6')
      //   return
      // }
      if (btn.action === 'shuaxin') {
        this.searchForm = {}
        this.$root.ajaxData(btn.url, {}, function (data) {
          vm.updateData(data)
        }, 'GET')
        return
      }
      this.$root.handleAction(btn, row, function () {
        vm.getData()
      })
    },
    rowSelect () {
      let headerListDto = this.mate.headerListDto
      headerListDto.rows.forEach(row => {
        let select = (row.id && headerListDto.selected && headerListDto.selected.findIndex(id => id == row.id) !== -1)
        this.$refs.table.toggleRowSelection(row, (select === true))
      })
    },
    // table表格中勾选的选项，val是勾选的对象
    handleSelectionChange (val) {
      this.$emit('actionSelected', val)
      this.multipleSelection = val
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getData('paging')
    },
    handleCurrentChange (val) {
      this.page = val
      this.getData('paging')
    },
    handleAction (act, row) {
      var vm = this
      if (act.actionEmit === 'actionEmit') {
        this.$emit('handleAction', act, row)
        return true
      } else if (act.action === 'process') {
        this.$root.ajaxData(act.url + row.id + '&transferId=' + row.transferId, {}, function (data) {
          vm.processlist = data.data
          vm.dialogVisible = true
        })
        return
      } else if (act.action === 'showDetail') {
        vm.$root.monitor({ url: '/purchase/invoiceReceipt/all/list?invoiceId=' + row.id + '&transferId=' + row.transferId +'&transferType=' + this.billType })
        return
      } else {
        this.$root.handleAction(act, row, function () {
          vm.getData()
        })
      }
    },
    getData (flag) {
      let url = this.mate.headerListDto.dataApi
      var vm = this
      this.searchForm.startTime = DateFormat(this.searchForm.startTime, 'yyyy-MM-dd HH:mm:ss')
      this.searchForm.endTime = DateFormat(this.searchForm.endTime, 'yyyy-MM-dd HH:mm:ss')
      url = '/purchase/invoiceReceipt/all/list?pageSize=' + this.pageSize + '&pageNum=' + this.page
      this.$root.ajaxData(url, this.searchForm, function (data) {
        vm.updateData(data)
      })
    },
    updateData (data) {
      let headerListDto = this.mate.headerListDto
      if (data.mate.headerListDto.rows) {
        headerListDto.rows = data.mate.headerListDto.rows
        this.rowsContent = data.mate.rows
      }
      if (data.mate.headerListDto.total) {
        headerListDto.total = data.mate.headerListDto.total
      } else {
        headerListDto.total = 0
      }
      if (data.mate.headerListDto.selected) {
        headerListDto.selected = data.mate.headerListDto.selected
      }
      this.$nextTick(function () {
        this.rowSelect()
      })
    },
    sortChange: function (sort) {
      if (!sort || !sort.column || !sort.column.sortable) {
        return
      }
      this.sortValues = {
        order: sort.order,
        column: sort.prop
      }
      this.getData('sort')
    },
    formatter (field) {
      return function (row, col) {
        if (field.switch) {
          return field.switch[row[col.property]]
        }
        return row[col.property]
      }
    }
  }
}
</script>

<style scoped>
  .page {
    margin-top: 20px;
  }
  .button{
    margin-top:10px;
  }
  .detailButton{
    padding-left: 0px;
    margin-top: -10px
  }
  .el-form-item--mini.el-form-item {
  margin: 6px;
  }
  .searchForm{
    margin-bottom: 20px;
  }
  .el-input__suffix {
  right:68px
}
.el-input--mini .el-input__inner{
  width:80%
}
.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 100%;
}
.el-select {
  width: 100%;
}
</style>
