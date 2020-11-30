<!-- 企业审核 -->
<template>
  <div>
    <Boxer :mate="mate.mateList" :mateSearch="mate.mateSearch" :hasSelected="hasSelected" @action="handleButton" ref="Boxer" :msgBoxButton="msgBoxButton">
      <div slot="searchForm" class="leftMargin">
        <el-button  size="mini" type="primary" class="el-icon-search" v-if="mate.mateSearch" @click="showSearchPopover">搜索</el-button>
      </div>
      <div slot="main">
        <div class="query" v-if="mate.mateSearch">
              <el-row :gutter="20" v-show="showAdvancedSearchPopover">
                <el-form :model="mate.mateSearch.values" size="mini">
                  <el-col :sm="6" :md="4" :lg="4">
                    <el-form-item>
                      <el-select clearable v-model="selectDefault">
                        <el-option :label="item.label" :value="item.value" v-for="item of titleOptions" :key="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col v-if="selectDefault==='status'" :sm="6" :md="4" :lg="4">
                    <el-select clearable v-model="mate.mateSearch.values['operator']">
                      <el-option :label="item.label" :value="item.value" v-for="item of operatorOptions" :key="item.value"></el-option>
                    </el-select>
                  </el-col> -->
                  <el-col  v-if="selectDefault==='status'" :sm="6" :md="4" :lg="4">
                    <el-form-item>
                      <el-select clearable v-model="approveStatus">
                        <el-option :label="item.label" :value="item.value" v-for="item of operatorOptions" :key="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col v-if="selectDefault==='name'" :sm="6" :md="4" :lg="4">
                    <el-form-item>
                    <el-input clearable v-model="mate.mateSearch.values['value']"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :md="4" :lg="4">
                    <el-button type="primary" @click="query" size="mini" style="margin-left: 10px">查询</el-button>
                  </el-col>
                </el-form>
              </el-row>
        </div>
        <el-row>
          <el-col :span="24">
            <el-table size="mini" highlight-current-row ref="table" :max-height="height" :data="mate.mateList.rows" border @selection-change="handleSelectionChange" @sort-change="sortChange" style="width: 100%;">
                <el-table-column fixed="left" type="selection" width="50" id="tableSel"></el-table-column>
                <template v-for="(col, index) of mate.mateList.columns" >
                  <el-table-column v-if="col.blockHash" :formatter="col.formatter" :key="index" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <!-- <el-popover trigger="hover" placement="top" v-show="scope.row.blockHash">
                        <p>区块哈希: {{ scope.row.blockHash }}</p>
                        <p>上链时间: {{ scope.row.updateAt }}</p>
                        <div slot="reference" class="name-wrapper">
                          <el-tag @click="clickBlockHash(scope.row.blockHash)"><img src="../../assets/imgs/ztree/ic_chain.png" style="width:13px; height:13px;margin:-2px 2px">{{ scope.row.name }}</el-tag>
                        </div>
                      </el-popover> -->
                      <el-button type="text" size="mini" v-show="scope.row.blockHash" @click="clickBlockHash(scope.row.blockHash)"><img src="../../assets/imgs/ztree/ic_chain.png" style="width:13px; height:13px;margin:-2px 2px">{{ scope.row.name }}</el-button>
                      <span v-show="!scope.row.blockHash" >{{ scope.row.name }}</span>
                    </template>
                  </el-table-column>
                </template>
                <template v-for="(col, index) of mate.mateList.columns" >
                  <el-table-column v-if="col.isShow" :formatter="col.formatter" :key="index" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip></el-table-column>
                </template>
                <el-table-column label="操作" fixed="right" :min-width="actionWidth" v-if="mate.mateList.actions">
                  <template slot-scope="scope">
                    <k-btn v-for="(act, index) of mate.mateList.actions" :key="index" size="mini" :act="act" :row="scope.row" @action="handleAction"></k-btn>
                    <el-button size="mini" v-if="scope.row.auditStatus==='0' || scope.row.auditStatus==='1'" @click="audit(scope.row)">审核</el-button>
                    <el-button size="mini" v-if="scope.row.auditStatus==='2'" @click="audit(scope.row)">查看</el-button>
                  </template>
                </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center" class="page" >
          <el-col :span="12" v-if="mate.mateList.page">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="mate.mateList.page"
              layout="total,prev, pager, next, sizes"
              :total="mate.mateList.total"
              :page-sizes ="[5, 10, 15, 20, 50, 100]"
              :page-size="pageSize">
            </el-pagination>
          </el-col>
        </el-row>
      </div>
    </Boxer>
    
    <el-dialog title="查看区块信息"  :visible.sync="blockHashVisible" width="40%">
      <BlockHash :hashForm="hashForm" :retrospectShow="false">
      </BlockHash>
    </el-dialog>
  </div>
</template>

<script scope>
import SearchForm from '../../components/SearchForm'
import KBtn from '../../components/KBtn.vue'
import Boxer from '../../components/Boxer.vue'
import { API_GATEWAY } from '@/config/index.js'
import BlockHash from '../../components/BlockHash'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
export default {
  mixins: [ColumnFormatterMixin],
  components: {
    SearchForm,
    KBtn,
    BlockHash,
    Boxer,
    Formor: function index (resolve) {
      require(['../../components/Formor.vue'], resolve)
    }
  },
  props: {
    mate: Object,
    mateFormerHeaderId: String,
    KTableItemCode: String,
    ReturnSupplierId: String,
    ReturnOfficeId: String,
    height: null,
    pageSize: {
      type: Number,
      default: 15
    }
  },
  data () {
    return {
      titleOptions: [],
      operatorOptions: [],
      multipleSelection: [],
      hasSelected: false,
      blockHashVisible: false,
      searchValues: {},
      hashForm: {},
      page: 0,
      showAdvancedSearchPopover: false,
      sortValues: {},
      userType: 'tenant',
      action: null,
      editFlag: false,
      dialogTableVisible: false,         // dialog开关
      tableData: [],
      word: '查 询',
      object: {},                          // 放columns
      mingxiRows: [],                      // 明细行获取的数据
      physicalInventoryId: 0,
      colModels: [],
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
      selectDefault:'',
      approveStatus:''
    }
  },
  watch: {
    multipleSelection: function (newSelection) {
      this.hasSelected = (newSelection.length !== 0)
    },
    mate: function (newMate) {
      this.formatterBefore(this.mate.mateList.columns)
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
    this.formatterBefore(this.mate.mateList.columns)

    if (this.mate !== undefined && this.mate.mateList.dataApi !== undefined) {
      if (this.mate.mateList.dataApi.indexOf('/inventory/physical/snapshots/invyWatch/list') > -1 ||
        this.mate.mateList.dataApi.indexOf('/inventory/physical/snapshots/invyApprove/list') > -1 ||
        this.mate.mateList.dataApi.indexOf('/inventory/physical/snapshots/invyAdjust/list') > -1) {
        if (this.mate.mateList.rows !== undefined && this.mate.mateList.rows.length > 0) {
          this.physicalInventoryId = this.mate.mateList.rows[0].physicalInventoryId
        }
      }
    }
    if (this.mate.mateSearch) {
      this.titleOptions = this.mate.mateSearch.fields[0].options
      this.operatorOptions = this.mate.mateSearch.fields[1].options
    }
  },
  computed: {
    actionWidth: function () {
      return this.mate.mateList.actions.length * 60 + 80
    }
  },
  mounted () {
    this.rowSelect()
  },
  // 需要添加刷新消息
  methods: {
    audit (row) {
      var vm = this
      // this.$root.ajaxData('/companys/perfectInfo?audit=true' + '&tenantId=' + row.tenantId + '&name=' + row.name, {}, function (data) {
      // }, 'GET')
      this.$root.monitor({ url: '/companys/perfectInfo?audit=true' + '&tenantId=' + row.tenantId + '&name=' + row.name })
    },
    clickBlockHash (blockHash) {
      var vm = this
      // this.$root.ajaxData(API_GATEWAY + '/hyper/block/hash/query/' + blockHash, {}, function (data) {
      //   vm.hashForm = data
      // }, 'GET')
      this.$http({
        url: API_GATEWAY + '/hyper/block/hash/query/' + blockHash,
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
          'Accept': 'application/json',
          'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
          'Content-Type': 'application/json;charset=utf8'
        },
        responseType: 'text'
      }).then(function (response) {
        if (response.data.length > 0) {
          vm.blockHashVisible = true
          vm.hashForm = response.data
        } else {
          vm.hashForm = {}
          this.$message({
            message: '没有查询到区块信息',
            type: 'warning'
          })
          return
        }
      })
    },
    query () {
      this.mate.mateList.page=1;
      const mate={};
      if(null!=this.selectDefault){
        if(this.selectDefault==='name'){
          if(null!=this.mate.mateSearch.values['value']&&''!=this.mate.mateSearch.values['value']){
           mate.name=this.mate.mateSearch.values['value']
          }
        }else if(this.selectDefault==='status'){
           mate.auditStatus=this.approveStatus
        }
        const vm = this
        const url = this.mate.mateSearch.url
        this.$root.ajaxData(url, mate, function (data) {
          vm.updateData(data)
        }, 'GET')
        return
      }else{
       this.getData('paging')
       return 
      }
    },
    showSearchPopover () {
      this.showAdvancedSearchPopover = !this.showAdvancedSearchPopover
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    handleButton (btn) {
      var vm = this
      // 在采购模块中加了一个btn.edit
      let row = (btn.isApi || btn.ajax || btn.edit) ? { id: this.multipleSelection.map((r) => r.id) } : {}
      if (btn.action === 'tenant') {
        this.userType = 'tenant'
        this.$root.ajaxData(btn.url, {}, function (data) {
          vm.mate.mateList.rows = data.mate.mateList.rows
          vm.mate.mateList.total = data.mate.mateList.total
        }, 'GET')
        return
      }
      if (btn.action === 'office') {
        this.userType = 'office'
        this.$root.ajaxData(btn.url, {}, function (data) {
          vm.mate.mateList.rows = data.mate.mateList.rows
          vm.mate.mateList.total = data.mate.mateList.total
        }, 'GET')
        return
      }
        // 租户删除
      if (btn.action === 'deleteTenant') {
        if (this.multipleSelection.length > 1) {
          vm.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        }
        this.$confirm('此操作将删除租户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
          row = this.multipleSelection[0].tenantId
          this.$root.ajaxData(btn.url + row, {}, function () {
            vm.$root.monitor({ url: '/companys/getApprovalList?type=tenant' })
          }, 'DELETE')
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            })
        })
        return
       
      }
      this.$root.handleAction(btn, row, function () {
        vm.getData()
      })
    },
    rowSelect () {
      if (this.mate.mateList.rows) {
        this.mate.mateList.rows.forEach(row => {
          /* eslint-disable */
          let select = (row.id && this.mate.mateList.selected && this.mate.mateList.selected.findIndex(id => id == row.id) !== -1)
          /* eslint-enable */
          this.$refs.table.toggleRowSelection(row, (select === true))
        })
      }
      // this.mate.selected = [];
    },
    // table表格中勾选的选项，val是勾选的对象
    handleSelectionChange (val) {
      this.$emit('actionSelected', val)
      this.multipleSelection = val
    },
    handleSizeChange (val) {
      this.pageSize = val
      if(null===this.selectDefault||''===this.selectDefault){
        this.getData('paging')
        return 
      }else if(null!=this.approveStatus||null!=this.mate.mateSearch.values['value']&&''!=this.mate.mateSearch.values['value']){
        this.getData('searchDataInfo')
        return 
      }
    },
    handleCurrentChange (val) {
      this.page = val
      if(null===this.selectDefault||''===this.selectDefault){
        this.getData('paging')
        return 
      }else if(null!=this.approveStatus||null!=this.mate.mateSearch.values['value']&&''!=this.mate.mateSearch.values['value']){
        this.getData('searchDataInfo')
        return 
      }
    },
    handleAction (act, row) {
      var vm = this
      // 在采购模块中的分段价格
      if (act.actionEmit === 'actionEmit') {
        this.$emit('handleAction', act, row)
        return true
      } else if (act.action === 'edit') {
        this.$root.monitor({ url: act.url + '&tenantId=' + row.tenantId + '&name=' + row.name })
        // this.$root.monitor({ url: act.url + row.id })
        return
      } else if (act.action === 'editBill') {
        this.$root.monitor({ url: act.url + row.id })
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
      if (flag === 'search') {
        url += '-q?param=' + this.mate.search.values.name
        this.$root.ajaxData(url, param, function (data) {
          vm.updateData(data)
        })
        // 不用return，会有两次调用这个函数
        return true
      }

      if (flag === 'searchDataInfo') {
        let mateInfo = {}
        if(this.selectDefault==='name'){
          if(null!=this.mate.mateSearch.values['value']&&''!=this.mate.mateSearch.values['value']){
            mateInfo.name=this.mate.mateSearch.values['value'];
            mateInfo.pageNum=this.page;
            mateInfo.pageSize=this.pageSize;
          }
        }
        if(this.selectDefault==='status'){
          mateInfo.auditStatus=this.approveStatus;
          mateInfo.pageNum=this.page;
          mateInfo.pageSize=this.pageSize;
        }
        url += '/search'
        this.$root.ajaxData(url, mateInfo, function (data) {
          vm.updateData(data)
        })
        // 不用return，会有两次调用这个函数
        return true
      }

      if (flag && url.indexOf('?') === -1) {
        if (url === '/sys/seqno/list') {
          url += '?search=' + encodeURIComponent(JSON.stringify(this.searchValues)) + '&' + (this.toUriParams(this.sortValues)) + '&pageNum=' + this.page + '&pageSize=' + this.pageSize
        } else if (url === '/purchase/goodsPricing/line/all') {
          url += '-q?supplierId=' + this.ReturnSupplierId + '&officeId=' + this.ReturnOfficeId + '&pageNum=' + this.page + '&pageSize=' + this.pageSize
        } else {
        // url += '-q?' + (this.toUriParams(this.searchValues)) + '&' + (this.toUriParams(this.sortValues)) + '&pageNum=' + this.page
          url += '-q?' + 'search=' + encodeURIComponent(JSON.stringify(this.searchValues)) + '&' + (this.toUriParams(this.sortValues)) + '&pageNum=' + this.page + '&pageSize=' + this.pageSize
          if (this.physicalInventoryId !== 0) {
            url += '&physicalInventoryId=' + this.physicalInventoryId
          }
          if (this.userType === 'tenant') {
            url += '&type=tenant'
          }
          if (this.userType === 'office') {
            url += '&type=office'
          }
        }
        param = null
      }
      this.$root.ajaxData(url, param, function (data) {
        vm.updateData(data)
        vm.$emit('changeData')
      })
    },
    updateData (data) {
      if (data.mate.rows) {
        this.mate.mateList.rows = data.mate.rows
      }
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
      this.getData('search')
    },
    todoEssearch (data) {
      // this.$emit('essearch', data)
      this.searchValues = data
      const vm = this
      var url = vm.mate.mateList.essearch.url
      this.$root.ajaxData(url, JSON.stringify(data), function (data) {
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
    /* padding-left: 25px; */
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
    margin: 0; 
  }
  .el-form-item__content .el-select{
    width: 100%;
  }
  .invyTagbtn{
    margin-top:20px;
  }
  .chain {
      display: inline-block;
      width: 15px;
      height: 15px;
      background:url('../../assets/imgs/ztree/ic_chain.png') no-repeat;
      transform: translateY(3px);
      }
  .el-tag{
    background-color:rgba(64,158,255,.1);
    padding:0 10px;
    height:32px;
    line-height:30px;
    font-size:12px;
    margin-left:-23px;
    color:#409EFF;
    border-radius:4px;
    box-sizing:border-box;
    border:1px solid rgba(64,158,255,.2)
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
  ul {
    display: inline-block;
    vertical-align: top;
    overflow: hidden;
    li {
      list-style: none;
      margin: 5px 0;
      span {
        display: inline-block;
        width: 100px;
        text-align: right;
      }
    }
  }
</style>
