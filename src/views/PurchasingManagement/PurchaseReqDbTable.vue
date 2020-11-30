<!-- 请购单 -->
<template>
  <div>
    <Boxer :mate="mate.mateList" :mateSearch="mate.mateSearch" :hasSelected="hasSelected" @action="handleButton" ref="Boxer" :msgBoxButton="msgBoxButton">
      <div slot="searchForm" class="leftMargin">
				<el-button size="mini" type="primary" class="el-icon-search" v-if="mate.mateSearch" @click="showSearchPopover">搜索</el-button>
			</div>
			<div slot="main">
        <multiple-query :mate="mate" :inline="mate.inline" :pageSize="pageSize" v-if="mate.mateSearch" v-show="showAdvancedSearchPopover" @queryData="queryData"></multiple-query>
				<el-row>
          <el-col :span="24">
            <el-table size="mini" highlight-current-row @row-click="rowClick" ref="table" :data="mate.mateList.rows" border @selection-change="handleSelectionChange" @sort-change="sortChange" max-height="300" style="width: 100%;">
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column v-if="col.isShow" v-for="(col,index) of mate.mateList.columns" v-bind:key="col.name+index" :formatter="col.formatter" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" :show-overflow-tooltip="showOverflow">
              </el-table-column>
              <el-table-column  fixed="right" label="操作" :width="actionWidth" v-if="mate.mateList.actions">
                <template slot-scope="scope">
                  <k-btn v-for="act of mate.mateList.actions" v-bind:key="act.action" :label="act.label" size="mini" :act="act" :icon="act.icon" :row="scope.row" @action="confirm"></k-btn>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      <Pagination :mate="mate.mateList || mate.mateListLine" :pageSizes="pageSizes" :total="mate.mateList && mate.mateList.total" :page="mate.mateList.page" :size="pageSize" @pagination="handlePagination" />
      <!-- <el-row type="flex" justify="center" class="page">
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
      </el-row> -->
    </div>
    </Boxer>
  <!--下面的明细表格-->
  <template>
    <div class="detailLine">
      <el-button v-if="showFlag" class="el-icon-delete" :disabled="showButton" @click="cancelLine">取消</el-button>
      <el-table size="mini" v-if="showFlag" :data="mate.mateList.lineRows" border  class="tableTop" @selection-change="lineRowSelected" :hasSelected="hasSelectedLine">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column v-if="col.isShow" :formatter="col.formatter" :show-overflow-tooltip="showOverflow" v-for="col of mate.mateList.lineColumns" :key="col.id" :label="col.label" :prop="col.name" :min-width="col.width"></el-table-column>
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

    <el-dialog :visible.sync="dialogDisagree" width="30%">
      <el-form>
      <el-form-item label="驳回原因">
          <el-input v-model="cause"></el-input>
      </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogDisagree = false; AgreeClickOK()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="查看详情" :visible.sync="dialogVisible"   width="80%">
      <el-row>
        <el-row>
          <DialogForm :mate="mate.mateFormerHeader" formModel="dialog" ></DialogForm>
        </el-row>
        <el-row>
          <template>
            <el-table size="mini" :data="mate.mateList.lineRows" border style="width: 100%;" class="detailTable">
              <el-table-column show-overflow-tooltip :formatter="col.formatter" v-for="col of mate.mateList.lineColumns" :key="col.id" :label="col.label" :prop="col.name" :width="col.width"></el-table-column>
            </el-table>
          </template>
        </el-row>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { DateFormat } from '../../utils/util.js'
import MultipleQuery from '@/components/query/MultipleQueryForm'
import { LANGS } from '../../i18n/lang'
import KBtn from '../../components/KBtn.vue'
import Vue from 'vue'
import { API_GATEWAY } from '@/config/index.js'
import Boxer from '../../components/Boxer.vue'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
import QueryMixins from '../../mixins/QueryMixins'
import SERVICES from '../../services'
import Pagination from '../../components/Pagination/Pagination'

const BASEAPI = `${API_GATEWAY}/api`
export default {
  mixins: [ColumnFormatterMixin, QueryMixins],
  components: {
    MultipleQuery,
    KBtn,
    Boxer,
    Pagination,
    KCascader: function index (resolve) {
      require(['../../components/KCascader.vue'], resolve)
    },
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
      pageSizes: [5,10,15,20,30],
      page: 0,
      pageSize: 5,
      multipleSelection: [],     // 点击table前面的框框，获取到的内容
      langs: LANGS,
      hasSelected: false,
      hasSelectedLine: false,
      searchValues: {},
      showOverflow: true,
      sortValues: {},
      action: null,
      showAdvancedSearchPopover: false,
      dialogTableVisible: false,          // dialog开关
      tableData: [],
      word: this.$t('query'),
      showFlag: false,                    // 下面表格的开关
      object: {},                          // 放columns
      fit: false,
      dialogVisible: false,
      dialogFormVisible: false,
      showButton: true,
      valueStatus: '',
      dialogDisagree: false,
      cause: '',
      auditStatus: '',
      rowsContent: [],              // 获取到明细行中的数据
      urlName: '',
      fileName: '',
      formorHeaderId: '',
      checkAll: false,
      checkedLabel: [],
      selectedLines: [],
      isIndeterminate: true,
      lineSelected: [],               // 存放全部的label
      lineSelectedDetail: [],         // 存放全部的明细行label
      msgBoxButton: true,
      dialogDetailLine: false,
      changePage: false, //
      allowSearch: false, //
    }
  },
  watch: {
    multipleSelection: function (newSelection) {
      this.hasSelected = (newSelection.length !== 0)
    },
    selectedLines: function (newSelection) {
      this.hasSelected = (newSelection.length !== 0)
    },
    mate: function (newMate) {
      this.init();
      this.$nextTick(function () {
        this.rowSelect()
      })
    }
  },
  created () {
    this.init();
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
    init(){
      this.mate.mateSearch.fields.map((i) => { this.object[i.name] = i })
      this.titleOptions = this.mate.mateSearch.fields[0].options
      this.operatorOptions = this.mate.mateSearch.fields[1].options
      // this.formatterBefore(this.mate.mateList.priceList)
      this.formatterBefore(this.mate.mateList.columns)
      this.formatterBefore(this.mate.mateList.lineColumns)
      this.rowsContent = this.mate.mateList.rows
      this.mate.mateList.localName = this.mate.localName
      this.getDemandName();   // 获取搜索需求人
    },
    /**
     * 分页器控制 每页行数、第几页
     * @param {Object} pager 分页信息 size:每页行数、page: 第几页
     * @param {Boolean} changePage 是否点击第几页
     * @return void
     */
    handlePagination (pager, change) {
      this.pageSize = pager.size;
      this.page = pager.page;
      this.changePage = change;
      this.getData('paging');
    },
    /**
     * 分页 每页多少条
     * @param Number val 多少条
     * @return void
     */
    handleSizeChange(val) {
      this.pageSize = val;
      this.getData("paging");
    },
    /**
     * 分页 第几页
     * @param Number val 第几页
     * @return void
     */
    handleCurrentChange(val) {
      this.page = val;
      this.changePage = true;
      this.getData("paging");
    },
    /**
     * 获取搜索需求人
     * @param void
     * @return void
     * author: hezhiqang
     */
    getDemandName () {
      var vm = this
      this.$root.ajaxData('/purchase/reqPurchase/getUsers', {}, function(data) {
        let demandOptions = []
        data.forEach(item => {
          demandOptions.push({
            'label': item.username,
            'value': item.username,
            'id': item.id,
          })
        });
        let nameObj = vm.mate.mateSearch.fields.find(item => item.name==="demandName") || {};
        nameObj.options = demandOptions
      }, 'GET')
    },
    /**
     * 查询字段数据
     */
    // queryData (data) {
    //   this.searchValues = data;
    // },
    /**
     * 单条件查询
     *  mate为数组
     */
    query () {
      const mate = [this.mate.mateSearch.values]
      const vm = this
      const url = this.mate.mateSearch.url
      this.$root.ajaxData(url, mate, function (data) {
        vm.mate.mateList.rows = data.mate.rows
        vm.mate.mateList.total = data.mate.total
      }, 'POST')
    },
    showSearchPopover () {
      this.showAdvancedSearchPopover = !this.showAdvancedSearchPopover
    },
    lineRowSelected (val) {
      this.selectedLines = val
      if (val) {
        this.showButton = false
      } else {
        this.showButton = true
      }
    },
    cancelLine () {
      var vm = this
      if (this.selectedLines.length !== 1) {
        vm.$message({
          message: this.$t('seladata'),
          type: 'warning'
        })
        return
      }
      if (this.selectedLines.status === '1') {
        vm.$message({
          message: '已取消',
          type: 'warning'
        })
        return
      }
      this.$root.ajaxData('/purchase/reqPurchase/line/cancel/' + vm.selectedLines[0].id, {}, function (data) {
        if (data.statusCode === 40033) {
          vm.$message({
            message: '已经生成采购订单不能取消',
            type: 'warning'
          })
          return
        } else {
          vm.$root.ajaxData(vm.mate.mateList.url + '/' + vm.formorHeaderId, {}, function (data) {
            Vue.set(vm.mate.mateList, 'lineRows', data)
            vm.mate.mateList.lineRows = data
          }, 'GET')
        }
      }, 'PUT')
    },
    confirm (act, row) {
      var vm = this
      if (act.action === 'addChild') {
        this.mate.mateFormerHeader.values = row
        this.dialogVisible = true
        return false
      }
      if (act.action === 'orderReport') { // 打印
        vm.$http({
            url: `${API_GATEWAY}/api${act.url}${row.id}`,
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
              'Accept': 'application/json',
              'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf8'
            },
            responseType: 'arraybuffer'
          }).then(function (response) {
            var blob = new Blob([response.data], { type: 'application/pdf' })
            var objectUrl = URL.createObjectURL(blob)
            var a = document.createElement('a')
            document.body.appendChild(a)
            a.setAttribute('style', 'display:none')
            a.setAttribute('href', objectUrl)
            var windowOpen = window.open(objectUrl)
            if (windowOpen == null || typeof (windowOpen) === 'undefined') {
              this.$message({
                message: '请购单单被拦截,请检查浏览器设置',
                type: 'warning'
              })
            }
          })
        return
      }
      this.$root.handleAction(act, row, function (data) {
        vm.getData()
      })
    },
    updated () {
      this.showFlag = false
    },
    rowClick (row) {
      this.showFlag = true
      var vm = this
      this.formorHeaderId = row.id
      this.$root.ajaxData(this.mate.mateList.url + '/' + row.id, {}, function (data) {
        Vue.set(vm.mate.mateList, 'lineRows', data)
        vm.mate.mateList.lineRows = data
      }, 'GET')
    },
    back () {
      this.dialogTableVisible = false
    },
    DialogClickOK () {
      var vm = this
      const rowt = { id: this.multipleSelection.map((r) => r.id) }
      this.$root.ajaxData(this.btn.url + 2 + '?ids=' + rowt.id + '&approvalComments=' + this.cause, {}, function (data) {
        vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
          vm.mate.mateList.rows = data.mate.mateList.rows
        }, 'GET')
      }, 'PUT')
      this.cause = ''
    },
    AgreeClickOK () {
      var vm = this
      const rowt = { id: this.multipleSelection.map((r) => r.id) }
      this.$root.ajaxData(this.btn.url + 3 + '?ids=' + rowt.id + '&approvalComments=' + this.cause, {}, function (data) {
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
      const row = (btn.isApi || btn.ajax) ? { id: this.multipleSelection.map((r) => r.id) } : {}
      const rowLine = this.multipleSelection
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
          if (this.multipleSelection[i].state === '3') {
            vm.$message({
              message: this.$t('alreadyAgree'),
              type: 'warning'
            })
            return
          }
          if (this.multipleSelection[i].state === '1' || this.multipleSelection[i].state === '5') {
            vm.$message({
              message: '不能修改',
              type: 'warning'
            })
            return
          }
        }
        const row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$root.handleAction(btn, row, function () {})
        return
      }
      // 请购单提交审批
      if (btn.action === 'submitStatus') {
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].state === '0') {
            this.$root.ajaxData(btn.url + '/' + 1 + '?ids=' + rowt.id, {}, function (data) {
              vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
                vm.mate.mateList.rows = data.mate.mateList.rows
              }, 'GET')
            }, 'PUT')
            return
          } else {
            vm.$message({
              message: '不能提交审批',
              type: 'warning'
            })
            return
          }
        }
      }
      // 请购单状态审核
      if (btn.action === 'updateStatus') {
        for (var i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].state === '3') {
            vm.$message({
              type: 'warning',
              message: vm.$t('examined') })
            return
          } else if (this.multipleSelection[i].state === '1') {
            const rowt = { id: this.multipleSelection.map((r) => r.id) }
            this.$root.ajaxData(btn.url + '/' + 3 + '?ids=' + rowt.id, {}, function (data) {
              vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
                vm.mate.mateList.rows = data.mate.mateList.rows
              }, 'GET')
            }, 'PUT')
            this.btn = btn
            return
          } else {
            vm.$message({
              message: '不能审批',
              type: 'warning'
            })
            return
          }
        }
      }
      // 请购单复核
      if (btn.action === 'reviewStatus') {
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].state === '3') {
            this.$root.ajaxData(btn.url + '/' + 6 + '?ids=' + rowt.id, {}, function (data) {
              vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
                vm.mate.mateList.rows = data.mate.mateList.rows
              }, 'GET')
            }, 'PUT')
            return
          } else {
            vm.$message({
              message: '不能复核',
              type: 'warning'
            })
            return
          }
        }
      }
      // 请购单驳回
      if (btn.action === 'difStatus') {
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        for (i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].state === '2') {
            vm.$message({
              type: 'warning',
              message: '已驳回'
            })
            return false
          }
        }
        for (var j = 0; j < this.multipleSelection.length; j++) {
          if (this.multipleSelection[j].state === '3') {
            vm.$message({
              type: 'warning',
              message: '已审批，不能驳回'
            })
            return false
          }
        }
        for (i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].state !== '1') {
            vm.$message({
              type: 'warning',
              message: '不能驳回'
            })
            return false
          }
        }
        this.dialogFormVisible = true
        this.btn = btn
        return
      }
      // 请购单取消
      if (btn.action === 'cancelPurchase') {
        if (this.multipleSelection.length !== 1) {
          vm.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        }
        if (this.multipleSelection[0].state === '5') {
          vm.$message({
            message: '已取消',
            type: 'warning'
          })
          return
        }
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        this.$root.ajaxData(btn.url + rowt.id, {}, function (data) {
          if (data.statusCode === 40017) {
            vm.$message({
              message: '明细行已生成采购订单',
              type: 'warning'
            })
            return
          }
          vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
            vm.mate.mateList.rows = data.mate.mateList.rows
          }, 'GET')
        }, 'PUT')
        return
      }
      // 请购单删除
      if (btn.action === 'deletePurchase') {
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        for (var j = 0; j < this.multipleSelection.length; j++) {
          if (this.multipleSelection[j].state !== '0' && this.multipleSelection[j].state !== '2') {
            vm.$message({
              type: 'warning',
              message: '不能删除'
            })
            return false
          }
        }
        this.$confirm('此操作请购单删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
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
        }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消删除'
            })
          })
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
      let url = this.mate.mateList.dataApi;
      // 入库管理中，添加明细表单，删除刷新，需要带表头的id
      // if (this.mate.dataApi === '/inbound/bill/lines/list') {
      //   url = this.mate.dataApi + '/' + this.mateFormerHeaderId
      // }
      let param = {
        page: this.page,
        sort: this.sortValues
      }
      // 查询后分页
      if (this.allowSearch && this.changePage) {
        delete this.searchValues.pageNum1;
        delete this.searchValues.pageSize1;
        this.searchValues.pageNum = this.page;
        this.searchValues.pageSize = this.pageSize;
      }
      var vm = this;
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
      // if(flag==='paging'){
      //   this.searchValues.pageNum = this.page;
      //   this.searchValues.pageSize = this.pageSize;
      // }
      // const mate = {...this.searchValues,...this.sortValues,};
      // this._queryData(url, mate);
    },
    _queryData (url, mate) {
      SERVICES.BASE.query(url, mate).then(res =>{
        // this.mate.mateList.rows = res.data.mate.rows;
        // this.mate.mateList.total = res.data.mate.total;
        if (res.data) vm.this.updateData(res.data);
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
    todoEssearch (data) {
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

<style  scoped lang="scss">
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
    button {
      padding: 7px 15px;
      background-color: #fff;
      cursor: pointer;
    }
  }
  .definedLine{
    position: absolute;
    right: 0px;
  }
  .tableTop{
    margin-top: 10px;
  }
  .el-table td, .el-table th {
    height: 30px;
  }
  .detailTable{
    margin-top: 40px;
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
  .el-dialog__header {
    padding: 10px 10px 0;
  }
  .el-dialog__body {
    padding: 10px 10px;
  }
</style>
