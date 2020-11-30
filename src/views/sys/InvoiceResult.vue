<template>
  <div class="InvoicePayment">
    <!--最上面的搜索-->
    <div class="searchForm">
      <el-row :gutter="10">
        <el-form v-model="searchSupplierForm">
          <el-col :sm="4" :md="4" :lg="3">
            <el-form-item>
              <el-input size="mini" v-model="searchSupplierForm.supplierName" placeholder="供应商名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="4" :md="4" :lg="3">
            <el-form-item>
              <el-date-picker size="mini" v-model="searchSupplierForm.beginDate" type="date" placeholder="起始日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="4" :md="4" :lg="3">
            <el-form-item>
              <el-date-picker size="mini" v-model="searchSupplierForm.endDate" type="date" placeholder="截止日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="8" :md="8" :lg="6">
            <el-form-item>
              <!-- <el-button size="mini" @click="searchCondition">搜索</el-button>
              <el-button size="mini" @click="clearCondition1">清空</el-button> -->
              <el-button size="mini" type="primary" icon="el-icon-search" @click="searchCondition">查询</el-button>
              <el-button size="mini" type="info" @click="clearCondition1">重置</el-button>
               <el-button size="mini"  icon="el-icon-download" @click="download">导出</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <Boxer :mate="mate.mateList" :mateSearch="mate.mateSearch" :hasSelected="hasSelected" @action="handleButton" ref="Boxer" :msgBoxButton="msgBoxButton">
      <div slot="main">
      <div>
        <el-row>
          <el-col :span="24">
            <el-table stripe size="mini" highlight-current-row ref="table" :data="mate.mateList.rows" @selection-change="handleSelectionChange" max-height="300" style="width: 100%;">
              <el-table-column align="center" type="selection" width="50"></el-table-column>
              <el-table-column align="center" v-if="col.isShow" v-for="(col,index) of mate.mateList.columns" v-bind:key="col.name+index" :formatter="col.formatter" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip>
              </el-table-column>
              <el-table-column align="center" fixed="right" label="操作" :width="actionWidth" v-if="mate.mateList.actions">
                <template slot-scope="scope">
                  <k-btn v-for="act of mate.mateList.actions" v-bind:key="act.action" size="mini" :act="act" :icon="act.icon" :row="scope.row" @action="handleAction"></k-btn>
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
            :current-page.sync="page"
            layout="total, prev, pager, next, sizes"
            :total="mate.mateList.total"
            :page-sizes ="[5,10,15,20,30]"
            :page-size="pageSize">
        </el-pagination>
      </el-col>
      </el-row>
      </div>
    </div>
  </Boxer>

  </div>
</template>

<script>
import { API_GATEWAY } from '@/config/index.js'
import { LANGS } from '../../i18n/lang'
import KBtn from '../../components/KBtn.vue'
import Boxer from '../../components/Boxer.vue'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
import {DateFormat} from '../../utils/util'
const BASEAPI = `${API_GATEWAY}/api`
import BlockHash from '../../components/BlockHash1.vue'
export default {
  mixins: [ColumnFormatterMixin],
  components: {
    BlockHash,
    KBtn,
    Boxer,
    Formor: function index (resolve) {
      require(['../../components/Formor.vue'], resolve)
    }
  },
   props: {
    mate: Object,
  },
  data () {
    return {
      labelWidth: '100px',
      seller: '',
      searchSupplierForm: {
        beginDate: '',
        endDate: ''
      },
      state: '',
      stateOptions: [
        {
          value: 0,
          label: '新建'
        },
        {
          value: 1,
          label: '已确认'
        },
        {
          value: 2,
          label: '已生成ebs发票'
        }
      ],
      blockHashVisible: false,
      beginDate: null,
      toDate: null,
      fullscreenLoading: true,
      page: 1,
      pageSize: 30,
      hasSelected: false,
      sortValues: {},
      searchValues: {},
      showFlag: false,                    // 下面表格的开关
      showAdvancedSearchPopover: false,
      dialogDetailLine: false,
      multipleSelection: [],     // 点击table前面的框框，获取到的内容
      andOrSymbolOptions: [],
      mateListRows: [],                  // 应付发票明细行
      showPurDetial: true,
      mateMateList: {}
    }
  },

  watch: {
    multipleSelection: function (newSelection) {
      this.hasSelected = (newSelection.length !== 0)
    },
    mate: function (newMate) {
      this.formatterBefore(this.mateMateList.columns)
      this.rowsContent = this.mateMateList.rows
      this.mateMateList.localName = this.mate.localName
      this.$nextTick(function () {
        this.rowSelect()
      })
    }
  },

  created () {
    this.mateMateList = this.mate.mateList
    this.formatterBefore(this.mateMateList.columns)
    this.rowsContent = this.mateMateList.rows
    this.mateMateList.localName = this.mate.localName
    var user = window.sessionStorage.getItem('user')
    if (user) {
      user = JSON.parse(user)
    }
    this.user = user
  },
    computed: {
    actionWidth: function () {
      return '230px'
    },
    labelWidth: function () {
      let width = ''
      if (this.mate.inline) {
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
  methods: {
    download(){
        this.$http({
          url: API_GATEWAY + '/api/purchase/tms/invoice/all/result/export',
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
            'Accept': 'application/json',
            'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId
            // 'Content-Type': 'application/x-www-form-urlencoded;charset=utf8'
          },
          body: this.searchSupplierForm,
          responseType: 'arraybuffer'
        }).then(function (response) {
          var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          var objectUrl = URL.createObjectURL(blob)
          var a = document.createElement('a')
          document.body.appendChild(a)
          a.setAttribute('style', 'display:none')
          a.setAttribute('href', objectUrl)
          a.setAttribute('download', '开票数据')
          a.click()
          URL.revokeObjectURL(objectUrl)
        })
        return
    },
    searchCondition () {
      this.getData('paging')
    },
    clearCondition1 () {
      this.seller = ''
      this.state = ''
      this.beginDate = ''
      this.toDate = ''
      this.officeName = ''
    },
    updated () {
      this.showFlag = false
    },
    handleButton (btn) {
    },
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

    getData (flag) {
      this.searchSupplierForm.beginDate = DateFormat(this.searchSupplierForm.beginDate, 'yyyy-MM-dd')
      this.searchSupplierForm.endDate = DateFormat(this.searchSupplierForm.endDate, 'yyyy-MM-dd')
      let url
      let param = {
        search: this.searchSupplierForm,
        page: this.page,
        sort: this.sortValues
      }
      var vm = this
      url = `/purchase/tms/invoice/all/result/list-q?pageNum=${this.page}&&pageSize=${this.pageSize}`
      if(!this.searchSupplierForm.supplierName){
        this.searchSupplierForm.supplierName = ''
      }
       if (this.searchSupplierForm.beginDate && this.searchSupplierForm.endDate) {
        url = url + `&&supplierName=${this.searchSupplierForm.supplierName}&&beginDate=${this.searchSupplierForm.beginDate}&&endDate=${this.searchSupplierForm.endDate}`
      } else if (!this.searchSupplierForm.beginDate && !this.searchSupplierForm.endDate) {
        url = url + `&&supplierName=${this.searchSupplierForm.supplierName}`
      } else if (!this.searchSupplierForm.beginDate && this.searchSupplierForm.endDate) {
        url = url + `&&supplierName=${this.searchSupplierForm.supplierName}&&endDate=${this.searchSupplierForm.endDate}`
      } else if (this.searchSupplierForm.beginDate && !this.searchSupplierForm.endDate) {
        url = url + `&&supplierName=${this.searchSupplierForm.supplierName}&&beginDate=${this.searchSupplierForm.beginDate}`
      }
        this.$root.ajaxData(url, {}, function (data) {
          vm.updateData(data)
        }, 'GET')
    },

    updateData (data) {
      if (data.mate.mateList.rows) {
        this.mateMateList.rows = data.mate.mateList.rows
        // rowsContent用于判断波次批次管理中拣料出库动作是否可以进行
        this.rowsContent = data.mate.rows
      }
      if (data.mate.mateList.total) {
        this.mateMateList.total = data.mate.mateList.total
      } else {
        this.mateMateList.total = 0
      }
      if (data.mate.mateList.selected) {
        this.mateMateList.selected = data.mate.mateList.selected
      }
      this.$nextTick(function () {
        this.rowSelect()
      })
    },
    toUriParams (data) {
      return Object.keys(data).filter(i => !!data[i]).map(i => i + '=' + data[i]).join('&')
    },

    rowSelect () {
      this.mate.mateList.rows.forEach(row => {
        let select = (row.id && this.mate.mateList.selected && this.mate.mateList.selected.findIndex(id => id == row.id) !== -1)
        this.$refs.table.toggleRowSelection(row, (select === true))
      })
    },

    handleAction(act, row){
      var vm = this
    }
  }
}
</script>

<style lang="scss">
.InvoicePayment {
  .page {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .el-form--inline .el-form-item {
    margin-bottom: 0;
  }

  .el-table .cell, .el-table th>div {
    padding-right: 0;
  }
  .leftMargin{
    float:left;
    margin-left:10px;
  }

  .searchForm{
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
  }
  .el-form-item {
    margin: 0px;
  }
  .checkboxClass{
    width: 30%;
    padding-bottom: 10px;
    box-sizing: border-box;
    margin-left: 15px;
  }
  .radioClass{
    margin-bottom: 5px
  }
  .detailLine{
    position: relative;
  }
  .definedLine{
    position: absolute;
    right: 0px;
  }
  .tableTop{
    // position: absolute;
    margin-bottom: 50px;
  }
  .el-table td, .el-table th {
    height: 30px;
  }
  .detailTable{
    margin-top: 40px;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
  }
  th {
    background-color: #e6e7eb;
    color: #303030;
    font-weight: 700;
  }
}
</style>
