<template>
<div>
  <Boxer :mate="mate.mateList" :mateSearch="mate.mateSearch" :hasSelected="hasSelected" @action="handleButton" ref="Boxer" :msgBoxButton="msgBoxButton">
    <span slot="searchForm" class="leftMargin">
      <el-button  size="mini" type="primary" class="el-icon-search" @click="showSearchPopover" v-if="mate.mateSearch">搜索</el-button>
    </span>
    <div slot="main">
      <!-- <div class="query" v-if="mate.mateSearch">
        <el-row :gutter="20" v-show="showAdvancedSearchPopover">
          <el-form :model="mate.mateSearch.values" :inline="mate.inline">
            <el-col :sm="6" :md="4" :lg="4">
              <el-select clearable v-model="mate.mateSearch.values['name']" size="mini">
                <el-option :label="item.label" :value="item.value" v-for="item of titleOptions" :key="item.value"></el-option>
              </el-select>
            </el-col>
            <el-col :sm="6" :md="4" :lg="4">
              <el-select clearable v-model="mate.mateSearch.values['operator']" size="mini">
                <el-option :label="item.label" :value="item.value" v-for="item of operatorOptions" :key="item.value"></el-option>
              </el-select>
            </el-col>
            <el-col :sm="6" :md="4" :lg="4">
              <el-input clearable v-model="mate.mateSearch.values['value']" size="mini"></el-input>
            </el-col>
            <el-col :sm="6" :md="4" :lg="4">
              <div class="search">
                <el-button @click="query" size="mini">查询</el-button>
              </div>
            </el-col>
          </el-form>
        </el-row>
      </div> -->
      <simple-query :mate="mate" :inline="mate.inline" v-if="mate.mateSearch && !mate.mateSearch.multipleConditions" v-show="showAdvancedSearchPopover" @queryData="queryData"></simple-query>
      <multiple-query :mate="mate" :inline="mate.inline" v-if="mate.mateSearch && mate.mateSearch.multipleConditions" v-show="showAdvancedSearchPopover" @queryData="queryData"></multiple-query>	
      <el-row>
        <el-col :span="24">
          <el-table size="mini" max-height="500" highlight-current-row ref="table" :data="mate.mateList.rows" border @selection-change="handleSelectionChange" @sort-change="sortChange" style="width: 100%">
              <el-table-column type="selection" width="50" id="tableSel"></el-table-column>
              <el-table-column v-if="col.isShow" :formatter="col.formatter" v-for="col of mate.mateList.columns" v-bind:key="col.name" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip>
              </el-table-column>
              <el-table-column label="操作" fixed="right" :min-width="actionWidth" v-if="mate.mateList.actions">
                <template slot-scope="scope">
                  <k-btn v-for="act of mate.mateList.actions" v-bind:key="act.action" size="mini" :act="act" :icon="act.icon" :row="scope.row" @action="handleAction"></k-btn>
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
            :current-page.sync="mate.mateList.page"
            layout="total,prev, pager, next, sizes"
            :total="mate.mateList.total"
            :page-sizes ="[5, 10, 15, 20, 50]"
            :page-size="pageSize">
        </el-pagination>
      </el-col>
      </el-row>
    </div>
  </Boxer>

  <el-dialog title="填写标签" :visible.sync="invyTagDlgVisible" width="30%">
    <el-row>
      <el-form :model="invyTagmate" :inline="false" label-width="120px">
          <el-form-item :label="invyTagmate.stolabel">
            <el-input v-model="invyTagmate.startTagNo" style="width:180px;"></el-input>
          </el-form-item>

          <el-form-item :label="invyTagmate.inlabel">
            <el-input v-model="invyTagmate.incrementNumber" style="width:180px;"></el-input>
          </el-form-item>

          <el-form-item :label="invyTagmate.numlabel">
            <span>{{invyTagmate.numberOfTags}}</span>
          </el-form-item>
      </el-form>
    </el-row>
    <el-button @click="invyTagDlgSubmit" class="invyTagbtn">提 交</el-button>
    <el-button @click="invyTagDlgCancel" class="invyTagbtn">取 消</el-button>
  </el-dialog>
</div>
</template>

<script>
import Vue from 'vue'
import KBtn from './KBtn.vue'
import Boxer from './Boxer.vue'
import { API_GATEWAY} from '@/config/index.js'
import ColumnFormatterMixin from '../mixins/ColumnFormatterMixin'
import MultipleQuery from './query/MultipleQueryForm'
import SimpleQuery from './query/SimpleQueryForm'
import QueryMixins from '../mixins/QueryMixins'

export default {
  mixins: [ColumnFormatterMixin, QueryMixins],
  components: {
    KBtn,
    Boxer,
    MultipleQuery,
    SimpleQuery,
    Formor: function index (resolve) {
      require(['./Formor.vue'], resolve)
    }
  },
  props: {
    mate: Object,
    mateFormerHeaderId: String,
    KTableItemCode: String
  },
  data () {
    return {
      titleOptions: [],
      operatorOptions: [],
      pageSize: 5,
      multipleSelection: [],
      hasSelected: false,
      searchValues: {},
      page: 1,
      sortValues: {},
      action: null,
      showAdvancedSearchPopover: false,
      dialogTableVisible: false,         // dialog开关
      tableData: [],
      word: '查 询',
      object: {},                          // 放columns
      mingxiRows: [],                      // 明细行获取的数据
      invyTagDlgVisible: false,
      invyTagmate: { startTagNo: '', stolabel: '起始标签号', incrementNumber: '', inlabel: '数字增量', numberOfTags: '', numlabel: '标签数量' },
      physicalInventoryId: 0,
      colModels: [],
      dialogFile: false,
      fileList: [],
        // fileuploadUrl: '${API_GATEWAY}/api/users/import',
       // fileuploadUrl: 'http://172.16.201.232:7878/api/users/import',
      fileimportUrl: API_GATEWAY + '/api/users/import',
      filedownloadUrl: API_GATEWAY + '/api/users/downloadFile',
      headers: {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
        'Accept': 'application/json',
        'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId
      },
      checkAll: false,
      checkedLabel: [],
      isIndeterminate: true,
      lineSelected: [],               // 存放全部的label
      lineSelectedDetail: [],         // 存放全部的明细行label
      msgBoxButton: true,
      dialogDetailLine: false,
      queryObject: {
        multipleConditions: false,    // 是否读取本地的多条件查询配置
      }
    }
  },
  watch: {
    multipleSelection: function (newSelection) {
      this.hasSelected = (newSelection.length !== 0)
    },
    mate: function (newMate) {
      this.searchValues = {}
      if (this.mate.mateList.columns !== 'undefined' && this.mate.mateList !== 'undefined') {
        this.formatterBefore(this.mate.mateList.columns)
      }
      if (this.mate.mateSearch) {
        this.titleOptions = this.mate.mateSearch.fields[0].options
        this.operatorOptions = this.mate.mateSearch.fields[1].options
      }
      this.$nextTick(function () {
        this.rowSelect()
      })
    }
  },
  created () {
    if (this.mate.mateSearch) {
      this.mate.mateSearch.fields.map((i) => { this.object[i.name] = i })
      this.titleOptions = this.mate.mateSearch.fields[0].options
      this.operatorOptions = this.mate.mateSearch.fields[1].options
    }
    // this.getData()
    if (this.mate.mateList.lineColumns) {
      this.formatterBefore(this.mate.mateList.lineColumns)
    }
    this.formatterBefore(this.mate.mateList.columns)
    this.mate.mateList.localName = this.mate.localName
    this.rowsContent = this.mate.mateList.rows
    this.mate.mateList.localName = this.mate.localName
    if (this.mate.mateList !== undefined && this.mate.mateList.dataApi !== undefined) {
      if (this.mate.mateList.dataApi.indexOf('/inventory/physical/snapshots/invyWatch/list') > -1 ||
        this.mate.mateList.dataApi.indexOf('/inventory/physical/snapshots/invyApprove/list') > -1 ||
        this.mate.mateList.dataApi.indexOf('/inventory/physical/snapshots/invyAdjust/list') > -1) {
        if (this.mate.mateList.rows !== undefined && this.mate.mateList.rows.length > 0) {
          this.physicalInventoryId = this.mate.mateList.rows[0].physicalInventoryId
        }
      }
    }
    this.pageSize = this.mate.mateList.size || this.pageSize;
    // this.actionWidth = this.mate.actions.length * 60 + 30
  },
  computed: {
    actionWidth: function () {
      return this.mate.mateList.actions.length * 60 + 30
    }
  },
  mounted () {
    this.rowSelect()
  },
  // 需要添加刷新消息
  methods: {
    query () {
      const mate = [this.mate.mateSearch.values]
      this.searchValues = mate
      const vm = this
      const url = this.mate.mateSearch.url
      this.$root.ajaxData(url, mate, function (data) {
        vm.mate.mateList.rows = data.mate.rows
        vm.mate.mateList.total = data.mate.total
      }, 'POST')
    },
    handleChange () {
    },
    showSearchPopover () {
      this.showAdvancedSearchPopover = !this.showAdvancedSearchPopover
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    back () {
      this.dialogTableVisible = false
    },
    handleClose () {
      this.$confirm('确认关闭？')
          .then(_ => {
            // done();
          })
          .catch(_ => {})
    }, srr () {
    },
    invyTagDlgSubmit () {
      var vm = this

      if (vm.invyTagmate.startTagNo === '') {
        vm.$message({
          message: '起始标签号不能为空',
          type: 'warning'
        })
        return
      }
      if (vm.invyTagmate.incrementNumber === '') {
        vm.$message({
          message: '数字增量不能为空',
          type: 'warning'
        })
        return
      }

      var numCount = 0
      var str = vm.invyTagmate.startTagNo
      for (var i = str.length - 1; i >= 0; i--) {
        if (!isNaN(str.charAt(i))) {
          numCount++
        } else {
          break
        }
      }

      if (numCount === 0) {
        vm.$message({
          message: '起始标签号中的后缀连续数字位数不能为0',
          type: 'warning'
        })
        return
      }

      var basestr = str.substring(str.length - numCount)
      var prefstr = str.substring(0, str.length - numCount)
      var endnum = parseInt(basestr, 10) + (parseInt(vm.invyTagmate.numberOfTags, 10) - 1) * parseInt(vm.invyTagmate.incrementNumber, 10)

      var zeros = ''
      for (var k = 1; k <= numCount; k++) {
        zeros += '0'
      }
      var maxstr = '1' + zeros
      var maxnum = parseInt('1' + zeros, 10) - 1

      if (endnum > maxnum) {
        vm.$message({
          message: '起始标签号中的后缀连续数字位数不够',
          type: 'warning'
        })
        return
      }

      var invObj = { id: this.multipleSelection[0].id, startTagNo: vm.invyTagmate.startTagNo, incrementNumber: vm.invyTagmate.incrementNumber, prefstr: prefstr, basestr: basestr, maxstr: maxstr }
      var mate = {}
      mate.mateFormerHeader = invObj
      this.$root.ajaxData('/inventory/physical/inventorytags/batchSave', mate, function () {
        vm.$root.monitor({ url: '/inventory/physical/inventories/all/list' })
      }, 'POST')

      this.invyTagDlgVisible = false
    },
    invyTagDlgCancel () {
      this.invyTagDlgVisible = false
    },
    handleButton (btn) {
      var vm = this;
      // 在采购模块中加了一个btn.edit
      let row = (btn.isApi || btn.ajax || btn.edit) ? { id: this.multipleSelection.map((r) => r.id) } : {}
      if (btn.action === 'updataBill') {
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
      // 库存组织修改
      if (btn.action === 'editBill') {
        if (this.multipleSelection.length !== 1) {
          vm.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        }
        const row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$root.handleAction(btn, row, function () {})
        return
      }

      // 应收发票删除
      if (btn.action === 'InvoiceReceivableDel') {
        this.$emit('action', btn)
        return
      }
      if (btn.action === 'deleteDetailBill') {
        this.$emit('action', btn)
        return
      }
      // 新增的时候不需要带上row，也不需要带上select前面的id
      if (btn.action === 'addDetailBill') {
        this.$emit('action', btn)
        return
      }
      if (btn.action === 'decompose') {
        this.$emit('action', btn)
        return
      }
      if (btn.action === 'manualOperation') {
        this.$emit('action', btn)
        return
      }
      if (btn.action === 'cancel') {
        this.$emit('action', btn)
        return
      }
      // 核销
      if (btn.action === 'verificationCancel') {
        this.$emit('action', btn)
        return
      }
      if (btn.action === 'verificationCancelDbl') {
        this.$emit('action', btn)
        return
      }
      if (btn.action === 'deleteQuotation') {
        this.$emit('action', btn)
        return
      }
      if (btn.action === 'confirm') {
        this.$emit('action', btn)
        return
      }
      if (btn.action === 'addLine') {
        this.$emit('action', btn)
        return
      }
      if (btn.action === 'deleteLine') {
        this.$emit('action', btn)
        return
      }
      if (btn.action === 'deleteSequence') {
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$root.handleAction(btn, row, function () {
          vm.$root.monitor({ url: '/sys/seqno/list' })
        })
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
      // 打印盘点单 库存管理-盘点管理
      if (btn.action === 'printInventory') {
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {};
        vm.$http({
          url: `${API_GATEWAY}/api${btn.url}?format=pdf&ID=${row.id}`,
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${window.sessionStorage.getItem('token')}`,
            'Accept': 'application/json',
            'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf8'
          },
          responseType: 'arraybuffer'
        }).then(function (response) {
          var blob = new Blob([response.data], {type: "application/pdf"})
          var objectUrl = URL.createObjectURL(blob)
          var a = document.createElement('a')
          document.body.appendChild(a)
          a.setAttribute('style', 'display:none')
          a.setAttribute('href', objectUrl)
          var windowOpen = window.open(objectUrl)
          if (windowOpen == null || typeof (windowOpen) === 'undefined') {
            this.$message({
              message: `${btn.modular}预览界面被拦截,请检查浏览器设置`,
              type: 'warning'
            })
          }
        })
        return
      }
      if (btn.action === 'toInspect') {
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$root.handleAction(btn, row, function () {})
        return
      }
      if (btn.action === 'updateInspect') {
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$root.handleAction(btn, row, function () {})
        return
      }

      if (btn.action === 'GenerateStatements') {
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].state !== '0') {
            vm.$message({
              message: this.$t('DifferentialMode'),
              type: 'warning'
            })
            return
          }
          if (this.multipleSelection.length !== 1) {
            for (let z = 0; z <= this.multipleSelection.length - 2; z++) {
              if (this.multipleSelection[z].supplierOfficeId !== this.multipleSelection[z + 1].supplierOfficeId) {
                vm.$message({
                  message: '请选择同一供应商机构',
                  type: 'warning'
                })
                return
              }
              if (this.multipleSelection[z].officeId !== this.multipleSelection[z + 1].officeId) {
                vm.$message({
                  message: '请选择同一机构',
                  type: 'warning'
                })
                return
              }
              if (this.multipleSelection[z].supplierName !== this.multipleSelection[z + 1].supplierName) {
                vm.$message({
                  message: this.$t('selectSupp'),
                  type: 'warning'
                })
                return
              }
              if (this.multipleSelection[z].currency !== this.multipleSelection[z + 1].currency) {
                vm.$message({
                  message: this.$t('selectSupp'),
                  type: 'warning'
                })
                return
              }
            }
          }
        }
        vm.$root.monitor({ url: '/purchase/recon/pre/create/recon?ids=' + row.id + '&supplierOfficeId=' + this.multipleSelection[0].supplierOfficeId })
        // this.$root.handleAction(btn, row, function () {})
        return
      }

      if (btn.action === 'toPutaway' || btn.action === 'updatePutaway') {
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$root.handleAction(btn, row, function () {})
        return
      }
      if (btn.action === 'updateInventoryBill') {
        if (this.multipleSelection.length !== 1) {
          vm.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        }
        if (this.multipleSelection[0].opStatus !== 1) {
          vm.$message({
            message: '只能修改操作状态为计划的盘点单据',
            type: 'warning'
          })
          return
        }
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$root.handleAction(btn, row, function () {})
        return
      }

      if (btn.action === 'makeSnapshot') {
        if (this.multipleSelection.length !== 1) {
          vm.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        }

        if (this.multipleSelection[0].opStatus !== 1) {
          vm.$message({
            message: this.$t('OnlyRevise'),
            type: 'warning'
          })
          return
        }

        var invObj = { id: this.multipleSelection[0].id, inventoryType: this.multipleSelection[0].inventoryType, touchStartDate: this.multipleSelection[0].touchStartDate, touchEndDate: this.multipleSelection[0].touchEndDate }
        var mate = {}
        mate.mateFormerHeader = invObj
        this.$root.ajaxData('/inventory/physical/snapshots/batchSave', mate, function (data) {
          var res = data.bodyText
          if (res === 'empty') {
            vm.$message({
              message: '没有可生成快照的数据',
              type: 'warning'
            })
          } else {
            vm.$message({
              message: vm.$t('Successful operation'),
              type: 'success'
            })

            vm.$root.monitor({ url: '/inventory/physical/inventories/all/list' })
          }
        }, 'POST')

        return
      }
      // 生成二维码
      if (btn.action === 'createQRcode') {
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        var element = this.mate.mateList.rows.find((i) => {
          if (i.id === rowt.id[0]) {
            return i
          }
        })
        var urlName = ''
        var fileName = ''
        if (element.inventoryDate) {
          urlName = API_GATEWAY + '/api' + btn.url + element.id + '&imgName=' + element.inventoryDate + '.jpg'
          fileName = element.inventoryDate + '.jpg'
        }
        this.$http({
          url: urlName,
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
          var filename = fileName
          a.setAttribute('download', filename)
          a.click()
          URL.revokeObjectURL(objectUrl)
        })
        return
      }
      if (btn.action === 'makeTag') {
        if (this.multipleSelection.length !== 1) {
          vm.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        }

        if (this.multipleSelection[0].opStatus !== 2) {
          vm.$message({
            message: '只能对操作状态为快照的盘点单据生成标签',
            type: 'warning'
          })
          return
        }

        this.invyTagDlgVisible = true

        vm.invyTagmate.startTagNo = ''
        vm.invyTagmate.incrementNumber = ''
        vm.invyTagmate.numberOfTags = ''

        var reqData = { physicalInventoryId: this.multipleSelection[0].id }
        this.$root.ajaxData('/inventory/physical/snapshots/getNumberOfTags', reqData, function (data) {
          vm.invyTagmate.numberOfTags = data
        }, 'GET')

        return
      }
      if (btn.action === 'makeInventory') {
        if (this.multipleSelection.length !== 1) {
          vm.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        }
        if (!(this.multipleSelection[0].opStatus == 3 || this.multipleSelection[0].opStatus == 4)) {
          vm.$message({
            message: '只能对操作状态为标签或盘点的盘点单据进行盘点',
            type: 'warning'
          })
          return
        }
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$root.handleAction(btn, row, function () {})
        return
      }
      if (btn.action === 'invyApprove') {
        if (this.multipleSelection.length !== 1) {
          vm.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        }
        if (this.multipleSelection[0].opStatus !== 4) {
          vm.$message({
            message: '只能审批操作状态为盘点的盘点单据',
            type: 'warning'
          })
          return
        }
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$root.handleAction(btn, row, function () {})
        return
      }
      if (btn.action === 'invyAdjust') {
        if (this.multipleSelection.length !== 1) {
          vm.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        }
        if (this.multipleSelection[0].opStatus !== 5) {
          vm.$message({
            message: '只能调整操作状态为审批的盘点单据',
            type: 'warning'
          })
          return
        }
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$root.handleAction(btn, row, function () {})
        return
      }
      if (btn.action === 'updateDespatch') {
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
      if (btn.action === 'updateGoodsCategory') {
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
      if (btn.action === 'updateGoodsRelease') {
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
      if (btn.action === 'updateDeployState') {
        if (this.multipleSelection.length !== 1) {
          vm.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        }
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$root.handleAction(btn, row, function () {
          vm.$root.monitor({ url: '/purchase/goods/release/all/list/0' })
        })
        return
      }
      if (btn.action === 'invyWatch') {
        if (this.multipleSelection.length !== 1) {
          vm.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        }
        if (this.multipleSelection[0].opStatus < 4) {
          vm.$message({
            message: '只能查看已经盘点过的单据',
            type: 'warning'
          })
          return
        }
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$root.handleAction(btn, row, function () {})
        return
      }
      // 库存现有量下载
      if (btn.action === 'addExport') {
        this.$http({
          url: API_GATEWAY + '/api/inventory/onhand/quantity/export',
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
            'Accept': 'application/json',
            'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf8'
          },
          responseType: 'arraybuffer'
        }).then(function (response) {
          var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          var objectUrl = URL.createObjectURL(blob)
          var a = document.createElement('a')
          document.body.appendChild(a)
          a.setAttribute('style', 'display:none')
          a.setAttribute('href', objectUrl)
          var filename = '库存现有量.xlsx'
          a.setAttribute('download', filename)
          a.click()
          URL.revokeObjectURL(objectUrl)
        })
        return
      }
      // 物料事务处理下载
      if (btn.action === 'materialTransactionsExport') {
        this.$http({
          url: API_GATEWAY + '/api/inventory/material/transactions/export',
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
            'Accept': 'application/json',
            'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf8'
          },
          responseType: 'arraybuffer'
        }).then(function (response) {
          var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          var objectUrl = URL.createObjectURL(blob)
          var a = document.createElement('a')
          document.body.appendChild(a)
          a.setAttribute('style', 'display:none')
          a.setAttribute('href', objectUrl)
          var filename = '物料事务处理.xlsx'
          a.setAttribute('download', filename)
          a.click()
          URL.revokeObjectURL(objectUrl)
        })
        return
      }
      if (btn.action === 'returnToInbound') {
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$root.ajaxData('/purchase/so/return/checkExistInboundBill?ids=' + row.id, {}, function (data) {
          if (data.statusCode === 10008) {
            vm.$message({
              message: data.message,
              type: 'warning'
            })
            return
          } else if (data.statusCode === 10001) {
            vm.$message({
              message: data.message,
              type: 'warning'
            })
          } else {
            vm.$root.handleAction(btn, row, function () {})
          }
        }, 'GET')
        return
      }
      this.$root.handleAction(btn, row, function () {
        vm.getData()
      })
    },
    rowSelect () {
      if(this.mate.mateList.rows){
        this.mate.mateList.rows.forEach(row => {
          /* eslint-disable */
          let select = (row.id && this.mate.mateList.selected && this.mate.mateList.selected.findIndex(id => id == row.id) !== -1)
          /* eslint-enable */
        this.$refs.table.toggleRowSelection(row, (select === true))
      })
      }
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
      // 在采购模块中的分段价格
      if (act.actionEmit === 'actionEmit') {
        this.$emit('handleAction', act, row)
        return true
      } else if (act.action === 'edit') {
        this.$root.monitor({ url: act.url + '&&tenantId=' + row.tenantId })
        return
      } else {
        this.$root.handleAction(act, row, function () {
          vm.getData()
        })
      }
    },
    getData (flag) {
      let url = this.mate.mateList.dataApi
      // 入库管理中，添加明细表单，删除刷新，需要带表头的id
      if (this.mate.mateList.dataApi === '/inbound/bill/lines/list') {
        url = this.mate.mateList.dataApi + '/' + this.mateFormerHeaderId
      }
      let param = {
        search: this.searchValues,
        page: this.page,
        sort: this.sortValues
      }

      var vm = this
      if (flag && url.indexOf('?') === -1) {
        if (url === '/sys/seqno/list') {
          url += '?search=' + encodeURIComponent(JSON.stringify(this.searchValues)) + '&' + (this.toUriParams(this.sortValues)) + '&pageNum=' + this.page + '&pageSize=' + this.pageSize
        } else if (url === '/purchase/goodsPricing/line/all') {
          url += '-q?' + '&pageNum=' + this.page + '&pageSize=' + this.pageSize
        } else {
        // url += '-q?' + (this.toUriParams(this.searchValues)) + '&' + (this.toUriParams(this.sortValues)) + '&pageNum=' + this.page
          url += '-q?' + 'search=' + encodeURIComponent(JSON.stringify(this.searchValues)) + '&' + (this.toUriParams(this.sortValues)) + '&pageNum=' + this.page + '&pageSize=' + this.pageSize
          if (this.physicalInventoryId !== 0) {
            url += '&physicalInventoryId=' + this.physicalInventoryId
          }
        }
        param = null
      }
      this.$root.ajaxData(url, param, function (data) {
        vm.updateData(data)
      })
    },
    updateData (data) {
      let mate = data.mate.mateList || data.mate;
      if (mate.rows) {
        this.mate.mateList.rows = mate.rows;
        this.rowsContent = mate.rows;
      }
      if (mate.total) {
        this.mate.mateList.total = mate.total;
      } else {
        this.mate.mateList.total = 0;
      }
      if (mate.selected) {
        this.mate.mateList.selected = mate.selected
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
    },
    getEtagStyle (v) {
      if (v) {
        return 'success'
      }
      return 'gray'
    },
    toUriParams (data) {
      return Object.keys(data).filter(i => !!data[i]).map(i => i + '=' + data[i]).join('&')
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },

    importfile () {
      this.$root.monitor({ url: '/users/import' })
    }

  }
}
</script>

<style scoped lang="scss">
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
    display:inline-block;
  }
  .leftFloat div{
    display:inline-block;
    width:250px;
    height:38px;
    margin:0px 15px 0 0;
  }
  .button{
    margin-top:10px;
  }
  .el-form-item {
    margin: 22px 20px 2px 0; 
  }
  .invyTagbtn{
    margin-top:20px;
  }
  .el-table td, .el-table th {
    height: 30px;
  }
  .query {
    // margin: 1px 0;
		margin-bottom: 15px;
    .search {
      margin-left: 5px;
      button {
        padding: 7px 15px;
        background-color: #fff;
        cursor: pointer;
      }
    }
  }
  .el-select {
    width: 100%;
  }
</style>
