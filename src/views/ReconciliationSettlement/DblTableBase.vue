<template>
  <div>
    <Boxer :mate="mate.mateList" :mateSearch="mate.mateSearch" :hasSelected="hasSelected" @action="handleButton" ref="Boxer" :msgBoxButton="msgBoxButton">
      <div slot="main">
        <el-row>
          <el-col :span="24">
            <el-table size="mini" highlight-current-row @row-click="rowClick" ref="table" :data="mate.mateList.rows" border @selection-change="handleSelectionChange" @sort-change="sortChange" style="width: 100%; margin-top:15px">
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column v-if="col.isShow" v-for="(col,index) of mate.mateList.columns" v-bind:key="col.name+index" :formatter="col.formatter" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip>
              </el-table-column>
              <el-table-column  fixed="right" label="操作" :width="actionWidth" v-if="mate.mateList.actions">
                <template slot-scope="scope">
                  <k-btn v-for="act of mate.mateList.actions" v-bind:key="act.action" size="mini" :act="act" :icon="act.icon" :row="scope.row" @action="confirm"></k-btn>
                </template>
              </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" class="page">
      <el-col :span="12">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="mate.mateList.page"
            layout="total, prev, pager, next, sizes"
            :total="mate.mateList.total"
            :page-sizes ="[5,10,15,20,30]"
            :page-size="pageSize">
        </el-pagination>
      </el-col>
      </el-row>
    </div>
  </Boxer>
  <!--下面的明细表格-->
  <template>
    <div class="detailLine">
      <el-table size="mini" v-if="showFlag" :data="mate.mateList.lineRows" border  class="tableTop">
        <el-table-column v-if="col.isShow" :formatter="col.formatter" v-for="col of mate.mateList.lineColumns" :key="col.id" :label="col.label" :prop="col.name" :min-width="col.width">
        </el-table-column>
      </el-table>
    </div>
  </template>

    <el-dialog  :visible.sync="dialogFormVisible" width="30%">
      <el-form>
      <el-form-item label="驳回原因">
          <el-input   v-model="cause"></el-input>
      </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false; DialogClickOK()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="审批" :visible.sync="dialogAuditVisible" width="30%">
      <el-select v-model="auditStatus">
        <el-option label="通过" value="1"></el-option>
        <el-option label="不通过" value="0"></el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAuditVisible = false">取 消</el-button>
        <el-button @click="dialogAuditVisible = false; AuditClickOK()">确 定</el-button>
      </div>
    </el-dialog>

     <el-dialog title="查看详情" :visible.sync="dialogVisible"   width="80%" >
       <el-row>
      <el-row>
         <DialogForm :mate="mate.mateFormerHeader" formModel="dialog" ></DialogForm>
         </el-row>
         <el-row>
         <template>
          <el-table size="mini" :data="mate.mateList.lineRows" border style="width: 100%;" class="detailTable">
            <el-table-column :formatter="col.formatter" v-for="col of mate.mateList.lineColumns" :key="col.id" :label="col.label" :prop="col.name" :width="col.width">
          </el-table-column>
          </el-table>
         </template>
         </el-row>
       </el-row>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import { API_GATEWAY } from '@/config/index.js'
import SearchForm from '../../components/SearchForm'
import { LANGS } from '../../i18n/lang'
import KBtn from '../../components/KBtn.vue'
import Boxer from '../../components/Boxer.vue'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
const BASEAPI = `${API_GATEWAY}/api`
export default {
  mixins: [ColumnFormatterMixin],
  components: {
    SearchForm,
    KBtn,
    Boxer,
    Formor: function index (resolve) {
      require(['../../components/Formor.vue'], resolve)
    },
    DialogForm: function index (resolve) {
      require(['../../components/DialogForm.vue'], resolve)
    }
  },
  props: {
    mate: Object,
    mateFormerHeaderId: String
  },
  data () {
    return {
      pageSize: 5,
      multipleSelection: [],     // 点击table前面的框框，获取到的内容
      langs: LANGS,
      hasSelected: false,
      searchValues: {},
      page: 0,
      sortValues: {},
      action: null,
      dialogTableVisible: false,          // dialog开关
      tableData: [],
      word: this.$t('query'),
      showFlag: false,                    // 下面表格的开关
      object: {},                          // 放columns
      fit: false,
      dialogVisible: false,
      dialogFormVisible: false,
      valueStatus: '',
      dialogAuditVisible: false,
      dialogUpdateVisible: false,
      cause: '',
      auditStatus: '',
      rowId: {},             // 点击table前面的框框
      rowsContent: [],              // 获取到明细行中的数据
      urlName: '',
      fileName: '',
      checkAll: false,
      checkedLabel: [],
      isIndeterminate: true,
      lineSelected: [],               // 存放全部的label
      lineSelectedDetail: [],         // 存放全部的明细行label
      msgBoxButton: true,
      dialogDetailLine: false
    }
  },
  watch: {
    multipleSelection: function (newSelection) {
      this.hasSelected = (newSelection.length !== 0)
    },
    mate: function (newMate) {
      this.formatterBefore(this.mate.mateList.columns)
      this.formatterBefore(this.mate.mateList.lineColumns)
      this.rowsContent = this.mate.mateList.rows
      // Vue.set(this.mate.mateList, 'localName', this.mate.localName)
      this.mate.mateList.localName = this.mate.localName
      this.$nextTick(function () {
        this.rowSelect()
      })
    }
  },
  created () {
    this.formatterBefore(this.mate.mateList.columns)
    this.formatterBefore(this.mate.mateList.lineColumns)
    this.rowsContent = this.mate.mateList.rows
    this.mate.mateList.localName = this.mate.localName
    this.userDefined()
    this.userDefinedDetail()
   // this.mate.mateFormerHeader.fields.map((i) => { this.object[i.name] = i })
  },
  computed: {
    actionWidth: function () {
      return this.mate.mateList.actions.length * 60 + 30
    },
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
  mounted () {
    this.rowSelect()
  },
  // 需要添加刷新消息
  methods: {
    confirm (act, row) {
      this.mate.mateFormerHeader.values = row
      this.dialogVisible = true
      return false
    },
    updated () {
      this.showFlag = false
    },
    rowClick (row) {
      this.showFlag = true
      var vm = this
      this.$root.ajaxData(this.mate.mateList.url + '/' + row.id, {}, function (data) {
        vm.mate.mateList.lineRows = data
      }, 'GET')
    },
    back () {
      this.dialogTableVisible = false
    },
    DialogClickOK () {
      var vm = this
      const rowt = { id: this.multipleSelection.map((r) => r.id) }
      this.$root.ajaxData(this.btn.url + 2 + '?ids=' + rowt.id + '&approvalConments=' + this.cause, {}, function (data) {
        vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
          vm.mate.mateList.rows = data.mate.mateList.rows
        }, 'GET')
      }, 'PUT')
      this.cause = ''
    },
    AuditClickOK () {
      var vm = this
      const rowt = { id: this.multipleSelection.map((r) => r.id) }
      this.$root.ajaxData(this.btn.url + this.auditStatus + '?ids=' + rowt.id, {}, function () {
        vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
          vm.mate.mateList.rows = data.mate.rows
        }, 'GET')
      }, 'PUT')
    },
    UpdateClickOK () {
      var vm = this
      const rowt = { id: this.multipleSelection.map((r) => r.id) }
      this.$root.ajaxData(this.btn.url + this.updateStatus + '?ids=' + rowt.id, {}, function () {
        vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
          vm.mate.mateList.rows = data.mate.mateList.rows
        }, 'GET')
      }, 'PUT')
    },
    handleButton (btn) {
      var vm = this
      let row = (btn.isApi || btn.ajax) ? { id: this.multipleSelection.map((r) => r.id) } : {}
      this.rowId = row
      // 应收发票确认按钮，可以勾选多个
      if (btn.action === 'confirm') {
        let ids = ''
        var arrayIds = []
        this.multipleSelection.forEach(i => {
          arrayIds.push(i.id)
        })
        ids = arrayIds.join(',')
        this.$root.ajaxData(`/purchase/invoice/receive/updateState/1?ids=${ids}`, {}, function () {
          vm.$root.monitor({ url: '/purchase/invoice/receive/all/list' })
        }, 'PUT')
        return
      }
      // 应收发票修改
      if (btn.action === 'updateQuotation' && btn.flag === 'receive') {
        if (this.multipleSelection[0].state === '1') {
          this.$message({
            teyp: 'warning',
            message: '该发票已经确定，不能再修改'
          })
          return
        }
      }
      // 应付发票确定
      if (btn.action === 'surePaymentInvoice') {
        let ids = ''
        var arrayIds = []
        this.multipleSelection.forEach(i => {
          arrayIds.push(i.id)
        })
        ids = arrayIds.join(',')
        if (this.multipleSelection[0].state === '0') {
          row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
          this.$root.ajaxData(`/purchase/invoice/payment/updateState/1?ids=${ids}`, {}, function () {
            vm.$root.monitor({ url: '/purchase/invoice/payment/all/list' })
          }, 'PUT')
          return
        } else {
          vm.$message({
            message: this.$t('Committed'),
            type: 'warning'
          })
          return
        }
      }
      // 应付发票修改
      if (btn.action === 'updateAmend') {
        if (this.multipleSelection.length !== 1) {
          vm.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        }
        if (this.multipleSelection[0].state === '0') {
          row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
          this.$root.handleAction(btn, row, function () {})
          return
        } else {
          vm.$message({
            message: this.$t('cannotChange'),
            type: 'warning'
          })
          return
        }
      }
      // 应付发票删除
      if (btn.action === 'DelPayInvoice') {
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        this.$http.delete(BASEAPI + '/purchase/invoice/payment/batchDel' + '?ids=' + rowt.id)
          .then(response => {
            if (response.data.statusCode !== 200) {
              vm.$message({
                type: 'warning',
                message: '发票明细行不为空，不能删除发票头'
              })
              return
            } else {
              vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
                vm.mate.mateList.rows = data.mate.mateList.rows
              }, 'GET')
            }
          })
        return
      }

      // 入库单据中需要的审批按钮
      if (btn.action === 'disableSelectedAudit') {
        if (this.multipleSelection[0].status === '3') {
          vm.$message({
            type: 'warning',
            message: vm.$t('Already approve') })
          return
        } else if (this.multipleSelection[0].status !== '1') {
          vm.$message({
            type: 'warning',
            message: vm.$t('selectApprove') })
          return
        }
        this.btn = btn
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$root.ajaxData(btn.url + 3 + '?ids=' + row.id, {}, function (data) {
          vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
            vm.mate.mateList.rows = data.mate.mateList.rows
          }, 'GET')
        }, 'PUT')
        return
      }
      // 入库单提交审批
      if (btn.action === 'submitAudit') {
        if (this.multipleSelection[0].status === '1') {
          vm.$message({
            type: 'warning',
            message: vm.$t('Already approve') })
          return
        } else if (this.multipleSelection[0].status === '0' || this.multipleSelection[0].status === '2') {
          this.btn = btn
          row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
          this.$root.ajaxData(btn.url + 1 + '?ids=' + row.id, {}, function (data) {
            vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
              vm.mate.mateList.rows = data.mate.mateList.rows
            }, 'GET')
          }, 'PUT')
        } else {
          vm.$message({
            type: 'warning',
            message: vm.$t('selectEntered') })
          return
        }
        return
      }
      // 应收发票删除按钮
      if (btn.action === 'InvoiceReceivableDel') {
        if (this.multipleSelection[0].state === '1') {
          this.$message({
            type: 'warning',
            message: '该发票已确认不能删除'
          })
          return
        }
        this.$confirm(btn.confirm.msg, this.$t('toast.prompt'), {
          confirmButtonText: btn.confirm.confirmButtonText,
          cancelButtonText: btn.confirm.cancelButtonText,
          type: 'warning'
        }).then(() => {
          vm.$root.ajaxData(btn.url + this.multipleSelection[0].id, {}, function () {
            vm.$root.monitor({ url: '/purchase/invoice/receive/all/list' })
            this.$message({
              type: 'info',
              message: '删除成功'
            })
          }, 'DELETE')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('toast.canceled')
          })
        })
        return
      }
      // 入库单驳回
      if (btn.action === 'bohuiAudit') {
        if (this.multipleSelection[0].status === '3') {
          vm.$message({
            type: 'warning',
            message: vm.$t('noclose') })
          return
        }
        if (this.multipleSelection[0].status === '2') {
          vm.$message({
            type: 'warning',
            message: vm.$t('rejected') })
          return
        }
        this.dialogFormVisible = true
        this.btn = btn
        return
      }
      if (btn.action === 'auditIsPass') {
        this.dialogAuditVisible = true
        if (this.multipleSelection[0].status !== 'undefined') {
          this.auditStatus = this.multipleSelection[0].auditStatus             // 将需要改变的那一行的状态显示在弹出框上
        }
        this.btn = btn
        return
      }
      // 合格供应商审批
      if (btn.action === 'auditPrice') {
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        this.$root.ajaxData(btn.url + 1 + '?ids=' + rowt.id, {}, function (data) {
          if (data.statusCode === 40015) {
            vm.$message({
              type: 'warning',
              message: vm.$t('Already approve') })
          }
          vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
            vm.mate.mateList.rows = data.mate.mateList.rows
          }, 'GET')
        }, 'PUT')
        return
      }
      // 请购单状态审核
      if (btn.action === 'updateStatus') {
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        this.$root.ajaxData(btn.url + '/' + 102 + '?ids=' + rowt.id, {}, function (data) {
          if (data.statusCode === 40016) {
            vm.$message({
              type: 'warning',
              message: vm.$t('noapp') })
          } else if (data.statusCode === 40015) {
            vm.$message({
              type: 'warning',
              message: vm.$t('examined') })
          }
          vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
            vm.mate.mateList.rows = data.mate.mateList.rows
          }, 'GET')
        }, 'PUT')
        if (this.multipleSelection[0].status !== 'undefined') {
          this.status = this.multipleSelection[0].status
        }
        this.btn = btn
        return
      }
      // 请购单状态关闭
      if (btn.action === 'close') {
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        this.$root.ajaxData(btn.url + '/' + 100 + '?ids=' + rowt.id, {}, function (data) {
          if (data.statusCode === 403) {
            vm.$message({
              type: 'warning',
              message: vm.$t('noclose') })
          }
          vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
            vm.mate.mateList.rows = data.mate.mateList.rows
          }, 'GET')
        }, 'PUT')
        if (this.multipleSelection[0].status !== 'undefined') {
          this.status = this.multipleSelection[0].status
        }
        this.btn = btn
        return
      }
      // 请购单修改
      if (btn.action === 'editPurchase') {
        if (this.multipleSelection.length !== 1) {
          vm.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        }
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].state === 102) {
            vm.$message({
              message: this.$t('alreadyAgree'),
              type: 'warning'
            })
            return
          }
        }
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$root.handleAction(btn, row, function () {})
        return
      }
      // 入库单据生成二维码
      if (btn.action === 'createQRcode') {
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        var element = this.rowsContent.find((i) => {
          if (i.id === rowt.id[0]) {
            return i
          }
        })
        if (element.billCode) {
          this.urlName = BASEAPI + btn.url + element.billCode + '&imgName=' + element.billCode + '.jpg'
          this.fileName = element.billCode + '.jpg'
        } else if (element.pickNo) {
          this.urlName = BASEAPI + btn.url + element.id + '&imgName=' + element.pickNo + '.jpg'
          this.fileName = element.pickNo + '.jpg'
        } else if (element.packageNo) {
          this.urlName = BASEAPI + btn.url + element.id + '&imgName=' + element.packageNo + '.jpg'
          this.fileName = element.packageNo + '.jpg'
        }
        this.$http({
          url: this.urlName,
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
            'Accept': 'application/json',
            'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf8'
          },
          responseType: 'arraybuffer'
        }).then(function (response) {
          var blob = new Blob([response.data])
          var objectUrl = URL.createObjectURL(blob)
          var a = document.createElement('a')
          document.body.appendChild(a)
          a.setAttribute('style', 'display:none')
          a.setAttribute('href', objectUrl)
          var filename = this.fileName
          a.setAttribute('download', filename)
          a.click()
          URL.revokeObjectURL(objectUrl)
        })
        return
      }
      // 请购单生成采购订单
      if (btn.action === 'addPur') {
        if (this.multipleSelection.length !== 1) {
          vm.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        }
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
       // this.$root.handleAction(btn, row, function () {})
        this.$http.get(BASEAPI + '/purchase/reqPurchase/genPurchaseOrder' + '/' + row.id)
          .then(response => {
            if (response.data.statusCode === 40013) {
              vm.$message({
                type: 'warning',
                message: vm.$t('No approval')
              })
              return false
            } else if (response.data.statusCode === 40014) {
              vm.$message({
                type: 'warning',
                message: vm.$t('inquiry')
              })
              return false
            } else if (response.data.statusCode === 40017) {
              vm.$message({
                type: 'warning',
                message: vm.$t('generated')
              })
              return false
            } else {
              vm.$message({
                type: 'success',
                message: vm.$t('Ocompleted')
              })
            }
          })
        return
      }
      // 请购单删除
      if (btn.action === 'deletePurchase') {
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        this.$http.delete(BASEAPI + '/purchase/reqPurchase/batchDelete' + '?ids=' + rowt.id)
          .then(response => {
            if (response.data.statusCode === 40015) {
              vm.$message({
                type: 'warning',
                message: '已审批不能删除'
              })
              return false
            } else {
              vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
                vm.mate.mateList.rows = data.mate.mateList.rows
              }, 'GET')
            }
          })
        return
      }
      if (btn.action === 'updataBill') {
        if (this.multipleSelection.length !== 1) {
          vm.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        }
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        const findResult = this.rowsContent.find((item) => {
          if (item.id === row.id[0]) {
            return item
          }
        })
        if (findResult.status > 1) {
          this.$message({
            message: this.$t('alreadyAgree'),
            type: 'warning'
          })
          return
        }
        this.$root.handleAction(btn, row, function () {})
        return
      }
      if (btn.action === 'difStatus') {
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        for (var i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].state === 103) {
            vm.$message({
              type: 'warning',
              message: '已驳回'
            })
            return false
          }
        }
        for (var j = 0; j < this.multipleSelection.length; j++) {
          if (this.multipleSelection[j].state === 102) {
            vm.$message({
              type: 'warning',
              message: '已审批，不能驳回'
            })
            return false
          }
        }
        this.$root.ajaxData(btn.url + '/' + 103 + '?ids=' + rowt.id, {}, function (data) {
          vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
            vm.mate.mateList.rows = data.mate.mateList.rows
          }, 'GET')
        }, 'PUT')
        return
      }
      // 新增的时候不需要带上row，也不需要带上select前面的id
      if (btn.action === 'addDetailBill') {
        this.$emit('action', btn)
        return
      }
      // 修改的时候要带上select前面的id
      if (btn.action === 'updataDetailBill') {
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$emit('action', btn, row)
        return
      }
      if (btn.action === 'report') {
        // this.mate.mateList.url = REPORT_SERVER_URL + btn.url + '&id=' + row.id
        // this.$emit('route', 'FReport', this.mate.mateList)
        // return
      }
      if (btn.action === 'toInspect') {
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$root.handleAction(btn, row, function () {})
        return
      }
      if (btn.action === 'updateInspect') {
        if (this.multipleSelection.length !== 1) {
          vm.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        }
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$root.handleAction(btn, row, function () {})
        return
      }
      // 预发货通知生成入库单
      if (btn.action === 'createAsn') {
        const vm = this
        if (this.multipleSelection.length !== 1) {
          vm.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        }
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$root.ajaxData('/purchase/asn/checkExistInboundBill/' + row.id, {}, function (data) {
          if (data.statusCode === 10001) {
            vm.$message({
              message: data.message,
              type: 'warning'
            })
            return
          } else {
            vm.$root.handleAction(btn, row, function () {})
          }
        }, 'GET')
        return
      }
      // 采购退货生成出库单
      if (btn.action === 'createOutBoundBill') {
        const vm = this
        if (this.multipleSelection.length !== 1) {
          vm.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        }
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$root.ajaxData('/purchase/purchase/returns/checkExistOutboundBill/' + row.id, {}, function (data) {
          if (data.statusCode === 10002) {
            vm.$message({
              message: data.message,
              type: 'warning'
            })
            return
          } else {
            vm.$root.handleAction(btn, row, function () {})
          }
        }, 'GET')
        return
      }
      if (btn.action === 'toPutaway' || btn.action === 'updatePutaway') {
        if (this.multipleSelection.length !== 1) {
          vm.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        }
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$root.handleAction(btn, row, function () {})
        return
      }
      if (btn.action === 'createdWave') {
        this.$root.ajaxData('/outbound/pick/header/makePick', {}, function (data) {
          var message = data.bodyText
          if (message === 'exist') {
            message = vm.$t('No data can produce waves')
          } else if (message === 'noenough') {
            message = vm.$t('Inventory shortage')
          } else {
            message = vm.$t('Successful operation')
          }

          if (message === vm.$t('Successful operation')) {
            vm.$message({
              message: message,
              type: 'success'
            })

            vm.$root.monitor({ url: '/outbound/pick/header/all/list' })
          } else {
            vm.$message({
              message: message,
              type: 'warning'
            })
          }
        }, 'GET')
        return
      }
      if (btn.action === 'select') {
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        for (let i = 0; i < this.rowsContent.length; i++) {
          if (this.rowsContent[i].id === row.id[0]) {
            if (this.rowsContent[i].docStatus > 2) {
              vm.$message({
                message: this.$t('BatchPickingByWave'),
                type: 'warning'
              })
              return
            }
          }
        }
        this.$root.handleAction(btn, row, function () {})
        return
      }
      if (btn.action === 'outbound') {
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        for (let i = 0; i < this.rowsContent.length; i++) {
          if (this.rowsContent[i].id === row.id[0]) {
            if (this.rowsContent[i].docStatus < 3 || this.rowsContent[i].docStatus > 5) {
              vm.$message({
                message: this.$t('outBoundByWave'),
                type: 'warning'
              })
              return
            }
          }
        }
        this.$root.handleAction(btn, row, function () {})
        return
      }
      // 波次拣选管理 取消按钮
      if (btn.action === 'cancel') {
        this.$confirm(this.$t('confirmText'), this.$t('toast.prompt'), {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }).then(() => {
          row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
          row.id = row.id.join(',')
          this.$root.ajaxData('/outbound/pick/lines/cancel?ids=' + row.id, {}, function () {
            vm.$root.monitor({ url: '/outbound/pick/header/all/list', method: 'GET' })
          }, 'GET')
          this.$message({
            type: 'success',
            message: this.$t('cancelSucc')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('cancelConfirm')
          })
        })
        return
      }
      // 预发货通知取消
      if (btn.action === 'cancelAsn') {
        if (this.multipleSelection.length !== 1) {
          vm.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        }
        for (j = 0; j < this.multipleSelection.length; j++) {
          if (this.multipleSelection[j].state === 0) {
            vm.$message({
              message: this.$t('cancelAsn'),
              type: 'warning'
            })
            return
          }
        }
        this.$confirm(this.$t('confirmAsn'), this.$t('toast.prompt'), {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }).then(() => {
          row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
          this.$root.ajaxData('/purchase/asn/cancelAsn/' + row.id, {}, function (data) {
            if (data.statusCode === 40021) {
              vm.$message({
                message: vm.$t('alreadyInbound'),
                type: 'warning'
              })
              return
            }
            vm.$root.monitor({ url: '/purchase/asn/all/list', method: 'GET' })
          }, 'PUT')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('cancelConfirm')
          })
        })
        return
      }
      if (btn.action === 'updatePackage') {
        if (this.multipleSelection.length !== 1) {
          vm.$message({
            message: this.$t('Please select a row of data'),
            type: 'warning'
          })
          return
        }
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$root.handleAction(btn, row, function () {})
        return
      }
       // 采购询价审批
      if (btn.action === 'shenpiInquiry') {
        if (this.multipleSelection[0].status !== 'undefined') {
          this.auditStatus = this.multipleSelection[0].auditStatus             // 将需要改变的那一行的状态显示在弹出框上
        }
        this.btn = btn
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        this.$root.ajaxData(this.btn.url + 1 + '?ids=' + rowt.id, {}, function (data) {
          if (data.statusCode === 40015) {
            vm.$message({
              type: 'warning',
              message: vm.$t('Already approve')
            })
            return
          } else if (data.data !== null && data.data !== '') {
            vm.$message({
              type: 'warning',
              message: data.data + '没找到供应商'
            })
            return
          }
          vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
            vm.mate.mateList.rows = data.mate.mateList.rows
          }, 'GET')
        }, 'PUT')
        return
      }
      // 采购询价驳回
      if (btn.action === 'bohuiInquiry') {
        if (this.multipleSelection[0].status !== 'undefined') {
          this.auditStatus = this.multipleSelection[0].auditStatus             // 将需要改变的那一行的状态显示在弹出框上
        }
        this.btn = btn
        if (this.auditStatus === '1') {
          vm.$message({
            type: 'warning',
            message: vm.$t('noclose')
          })
          return false
        }
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        this.$root.ajaxData(this.btn.url + '/' + 0 + '?ids=' + rowt.id, {}, function () {
          vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
            vm.mate.mateList.rows = data.mate.mateList.rows
          }, 'GET')
        }, 'PUT')
        return
      }
      if (btn.action === 'updateInquiry' || btn.action === 'updateQuotation' || btn.action === 'updateAsn') {
        if (this.multipleSelection.length !== 1) {
          vm.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        }
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$root.handleAction(btn, row, function () {})
        return
      }
      this.$root.handleAction(btn, row, function () {
        vm.getData()
      })
    },
    rowSelect () {
      this.mate.mateList.rows.forEach(row => {
        /* eslint-disable */
        let select = (row.id && this.mate.mateList.selected && this.mate.mateList.selected.findIndex(id => id == row.id) !== -1)
        /* eslint-enable */
        this.$refs.table.toggleRowSelection(row, (select === true))
      })
      // this.mate.selected = [];
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
      this.$root.handleAction(act, row, function () {
        vm.getData()
      })
    },
    getData (flag) {
      let url = this.mate.mateList.dataApi
      // 入库管理中，添加明细表单，删除刷新，需要带表头的id
      // if (this.mate.dataApi === '/inbound/bill/lines/list') {
      //   url = this.mate.dataApi + '/' + this.mateFormerHeaderId
      // }
      let param = {
        search: this.searchValues,
        page: this.page,
        sort: this.sortValues
      }
      var vm = this
      if (flag && url.indexOf('?') === -1) {
        // url += '-q?' + (this.toUriParams(this.searchValues)) + '&' + (this.toUriParams(this.sortValues)) + '&pageNum=' + this.page
        url += '-q?' + 'search=' + encodeURIComponent(JSON.stringify(this.searchValues)) + '&' + (this.toUriParams(this.sortValues)) + '&pageNum=' + this.page + '&pageSize=' + this.pageSize
        param = null
      } else if (flag && url.indexOf('?') !== -1) {
        url += '&search=' + encodeURIComponent(JSON.stringify(this.searchValues)) + '&' + (this.toUriParams(this.sortValues)) + '&pageNum=' + this.page + '&pageSize=' + this.pageSize
        param = null
      }
      this.$root.ajaxData(url, param, function (data) {
        vm.updateData(data)
      })
    },
    updateData (data) {
      if (data.mate.rows) {
        this.mate.mateList.rows = data.mate.rows
        // rowsContent用于判断波次批次管理中拣料出库动作是否可以进行
        this.rowsContent = data.mate.rows
      }
      // 获取到包括元数据的所有数据，因为数据量太大，上面只获取到明细行的元数据和数据
      // if (data.mate.mateList.rows) {
      //   this.mate.rows = data.mate.mateList.rows
      // }
      if (data.mate.total) {
        this.mate.mateList.total = data.mate.total
      } else {
        this.mate.mateList.total = 0
      }
      if (data.mate.selected) {
        this.mate.mateList.selected = data.mate.selected
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
    search (data) {
      this.$emit('actionSearch', data)
      this.searchValues = data
      this.page = 0
      // this.getData('search')
    },
    todoEssearch (data) {
      // this.$emit('essearch', data)
      this.searchValues = data
      const vm = this
      this.$root.ajaxData(this.mate.mateList.essearch.url, JSON.stringify(data), function (data) {
        vm.updateData(data)
      }, 'POST')
    },
    formatter (field) {
      return function (row, col) {
        if (field.switch) {
          return field.switch[row[col.property]]
        }
        return row[col.property]
      }
    },
    getEtagStyle (v) {
      if (v) {
        return 'success'
      }
      return 'gray'
    },
    toUriParams (data) {
      return Object.keys(data).filter(i => !!data[i]).map(i => i + '=' + data[i]).join('&')
    }
  }
}
</script>

<style lang="scss" scoped>
  .page {
    margin-top: 20px;
  }

  .main-block .search {
      display: inline-block;
      margin-left: 30px;
      margin-top: -13px;
  }
  .el-form--inline .el-form-item {
    margin-bottom: 0
  }

  .el-table .cell, .el-table th>div {
    padding-right: 0;
  }
  .leftMargin{
    float:left;
    margin-left:10px;
  }
  .leftFloat form{
    float:left;
    display:inline-block;
  }
  .leftFloat div{
    float:left;
    display:inline-block;
    width:250px;
    height:38px;
    margin:0px 15px 0 0;
  }
  .button{
    margin-top:10px;
  }
  .el-form-item {
    margin: 15px 20px 2px 0px;
  }
  .checkboxClass{
    width: 30%;
    padding-bottom: 10px;
    box-sizing: border-box;
    margin-left: 15px;
  }
  .el-dialog{
    /*background: #eee;*/
  }
  .select-button{
    margin-top: 20px;
  }
  .detailLine{
    position: relative;
  }
  .definedLine{
    position: absolute;
    right: 0px;
  }
  .tableTop{
    position: absolute;
    margin-bottom: 50px;
  }
  .el-table td, .el-table th {
    height: 30px;
  }
  .detailTable{
    margin-top: 40px;
  }
  .el-message-box__btns {
    padding: 5px 15px 0;
    button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
  }
</style>
