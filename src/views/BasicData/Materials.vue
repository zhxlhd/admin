<template>
<div>
<el-row :gutter="24">
  <el-col :span="24">
    <Boxer :mate="mate.mateList" :mateSearch="mate.mateSearch" :hasSelected="hasSelected" :btnDisable="btnDisable" @action="handleButton" ref="Boxer" :msgBoxButton="msgBoxButton">
      <div slot="searchForm" class="leftMargin">
      <el-button  size="mini" type="primary" class="el-icon-search" @click="showSearchPopover">搜索</el-button>
    </div>
    <div slot="main">
      <div class="query">
        <el-row :gutter="20" v-show="showAdvancedSearchPopover">
          <el-form :model="mate.mateSearch.values" :inline="mate.inline">
            <el-col :sm="6" :md="4" :lg="4">
              <el-select  clearable v-model="mate.mateSearch.values['name']" size="mini">
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
      </div>
      <el-row>
        <!-- <el-table highlight-current-row ref="table" :data="mate.mateList.rows" @row-dblclick="rowDblclick" border @selection-change="handleSelectionChange" @sort-change="sortChange"  style="width: 100%;" max-height="500" size="mini">
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column  v-if="col.isShow" v-for="(col,index) of mate.mateList.columns" v-bind:key="col.name+index" :formatter="col.formatter" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip>
              </el-table-column>
              <el-table-column  fixed="right" label="操作" :width="actionWidth" v-if="mate.mateList.actions">
                <template slot-scope="scope">
                  <k-btn v-for="act of mate.mateList.actions" v-bind:key="act.action" size="mini" :act="act" :icon="act.icon" :row="scope.row" @action="confirm"></k-btn>
                </template>
              </el-table-column>
          </el-table> --> 
          <!-- 2019-12-06 使用列表组件 -->
          <main-table ref="table" :height="500" :mateList="mate.mateList" @rowDblclick="rowDblclick" @isSelected="handleSelected"/>
      </el-row>
      <input type="file" ref="excelFile"  style="display:none" @change="fileUpload"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
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
  </el-col>
</el-row>
<!--size="large"-->
<el-dialog title="物料管理修改" width="80%" :visible.sync="MaterialsDialogFormVisible">
  <MaterialForm class="material" :mate="mate.mateFormer"  :showSubcode="showSubcode"    :showDisabled="showDisabled" :showDict="showDict" :rowId="rowId" @rowIdChange="rowIdChange($event)" :mateMethod="mateMethod" @listenToChildEvent="listenToChildEvent" @action="showHiddenDialog"></MaterialForm>
</el-dialog>

</div>
</template>

<script>

import MaterialForm from './MaterialForm.vue'
import { API_GATEWAY } from '@/config/index.js'
import KBtn from '../../components/KBtn.vue'
import Boxer from '../../components/Boxer.vue'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
import SearchForm from '../../components/SearchForm'
import MainTable from '@/components/table/MainTable.vue'

export default {
  name: 'materials',
  mixins: [ColumnFormatterMixin],
  components: {
    MaterialForm,
    KBtn,
    Boxer,
    SearchForm,
    MainTable
  },
  props: {
    mate: Object
  },
  data () {
    return {
      titleOptions: [],
      operatorOptions: [],
      pageSize: 15,
      publishStatus: '',                 // 发布需要的数据
      dialogFormVisiblePublish: false,   // 发布对话框显示和隐藏
      options: {
        showCheckbox: false,
        showSearch: false,
        search: {
          useInitial: true,
          useEnglish: false,
          customFilter: null
        }
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      showAdvancedSearchPopover: false,
      btnDisable: false,
      actionSpan: 8,
      showDict: '',
      rowId: '',           // 传给MaterialForm的参数
      mateMethod: 'PUT', // 传给MaterialForm的参数
      multipleSelection: [],
      showDisabled: false,
      hasSelected: false,
      searchValues: {},
      page: 0,
      sortValues: {},
      action: null,
      // Data: [],
      dialogFormVisible: false,
      valueStatus: '',                 // 弹出框中的值
      btn: Object,              // 审批按钮需要用到的
      row: Object,              // 审批按钮需要用到的
      btnPublish: Object,          // 发布按钮需要用到的
      MaterialsDialogFormVisible: false,               // 双击table时，出现弹出框的开关
      msgBoxButton: true,
      checkAll: false,
      checkedLabel: [],
      isIndeterminate: true,
      lineSelected: [],               // 存放全部的label
      lineSelectedDetail: [],         // 存放全部的明细行label
      dialogDetailLine: false,
      showSubcode: false,
    }
  },
  created () {
    this.rowId = ''
    this.formatterBefore(this.mate.mateList.columns)
    this.mate.mateList.localName = this.mate.localName
    this.titleOptions = this.mate.mateSearch.fields[0].options
    this.operatorOptions = this.mate.mateSearch.fields[1].options
  },
  watch: {
    multipleSelection: function (newSelection) {
      this.hasSelected = (newSelection.length !== 0)
      // this.$emit('btnDisable',this.btnDisable);
    },
    mate: function (newMate) {
      this.formatterBefore(this.mate.mateList.columns)
      this.$nextTick(function () {
        this.rowSelect()
      })
    }
  },
  mounted () {
  },
  methods: {
    /**
     * 多选控制
     * @param {Boolean} bool 是否有勾选
     * @param {Array} selectedArr 勾选行数据数组
     * @return void
     */
    handleSelected (bool, selectedArr) {
      this.hasSelected = bool;
      this.multipleSelection = selectedArr;
    },
    rowDblclick (row) {
      this.MaterialsDialogFormVisible = true
      this.rowId = row.id.toString()
      this.showDisabled = true
      this.showSubcode = true
      this.showDict = '0'
    },
    query () {
      const mate = [this.mate.mateSearch.values]
      const vm = this
      const url = this.mate.mateSearch.url
      this.$root.ajaxData(url, mate, function (data) {
        vm.mate.mateList.rows = data.mate.rows
        vm.mate.mateList.total = data.mate.total
      }, 'POST')
      this.showAdvancedSearchPopover = false
    },
    showSearchPopover () {
      this.showAdvancedSearchPopover = !this.showAdvancedSearchPopover
    },
    fileUpload (file) {
      var vm = this
      var formdata = new FormData()
      formdata.append('file', file.target.files[0])
      this.$http({
        url: API_GATEWAY + '/zuul/api/materials/import',
        method: 'POST',
        body: formdata,
      }).then(response => {
        vm.$refs.excelFile.value = '';
        vm.$message({
            message: response.body.msg,
            type: "success",
            duration: 2000
        });
        setTimeout(function () {
          vm.$root.monitor({ url: '/materials' })
        }, 1000)
      })
    },
    handleChange () {
    },
    showHiddenDialog (showHiddenDialog) {
      this.MaterialsDialogFormVisible = showHiddenDialog
    },
    listenToChildEvent: function (data) {
      this.MaterialsDialogFormVisible = data
    },
    rowSelect () {
      this.mate.mateList.rows.forEach(row => {
          /* eslint-disable */
        let select = (row.id && this.mate.mateList.selected && this.mate.mateList.selected.findIndex(id => id == row.id) !== -1)
          /* eslint-enable */
        this.$refs.table.$refs['table'].toggleRowSelection(row, (select === true))
      })
      // this.mate.selected = [];
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    getData (action, row) {
      const vm = this
      this.$root.ajaxData(this.mate.dataApi, { 'dataOnly': true }, function (data) {
        vm.mate.mateList.rows = data
        if (action === 'delete') {
          vm.$root.ajaxData(vm.mate.dataApi.replace('list', 'refresh'), {}, function (treeData) {
            vm.mate.treeData = treeData
          })
        }
      })
    },
    handleButton (btn, row) {
      var vm = this
      row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
      if (btn.action === 'editBill') {
        if (this.multipleSelection.length !== 1) {
          // 只能选择一行,不允许选择多行
          this.$message({
            message: this.$t("seladata"), // 请选择一行数据
            type: "warning"
          });
          return;
        }
        this.showSubcode = true
        this.showDisabled = false
        this.MaterialsDialogFormVisible = true
        this.btn = btn
        this.rowId = row.id.toString()
        return false
      } else {
        this.rowId = ''
      }
      if (btn.action === 'deleteBill') {
        this.$root.ajaxData(btn.url, row.id, function (data) {
          if(data.statusCode === 400){
            vm.$message({
              message: '此物料已经被使用，无法删除',
              type: 'warning'
            })
          }
          vm.$root.ajaxData('/materials', {}, function (data) {
            vm.mate.mateList.rows = data.mate.mateList.rows
          })
        }, btn.method)
        return
      }
      if (btn.action === 'sendMaterial') {
        if (this.multipleSelection.length !== 1) {
          vm.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        }
        vm.$root.monitor({ url: '/purchase/th/goods/toadd?code=' + vm.multipleSelection[0].subcode + '&name=' + vm.multipleSelection[0].name + '&unit=' + vm.multipleSelection[0].basicUnit })
        return
      }
      // 物料现有量下载
      if (btn.action === 'exportMaterial') {
        this.$http({
          url: API_GATEWAY + '/api/materials/export',
          method: 'GET',
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
          var filename = '物料管理.xlsx'
          a.setAttribute('download', filename)
          a.click()
          URL.revokeObjectURL(objectUrl)
        })
        return
      }
      // 物料管理下载模板
      if (btn.action === 'exportTpl') {
        this.$http({
          url: API_GATEWAY + '/api/materials/download/tpl',
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
            'Accept': 'application/json',
            'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf8'
          },
          responseType: 'arraybuffer'
        }).then(function (response) {
          var blob = new Blob([response.data], { type: 'application/vnd.ms -excel' })
          var objectUrl = URL.createObjectURL(blob)
          var a = document.createElement('a')
          document.body.appendChild(a)
          a.setAttribute('style', 'display:none')
          a.setAttribute('href', objectUrl)
          var filename = '物料导入数据模板.xlsx'
          a.setAttribute('download', filename)
          a.click()
          URL.revokeObjectURL(objectUrl)
        })
        return
      }
      // 物料导入
      if (btn.action === 'inportMaterial') {
        this.$refs.excelFile.click()
        return
      }
      // 单独做了一份
      const rowt = (btn.isApi || btn.ajax) ? { id: this.multipleSelection.map((r) => r.id) } : {}
      rowt.valueStatus = this.valueStatus
      this.$root.handleAction(btn, rowt, function () {
        vm.$root.ajaxData('/materials', {}, function (data) {
          vm.mate.mateList.rows = data.mate.mateList.rows
        })
      })
    },
    // 下面几个函数是用来翻页的
    handleSizeChange (val) {
      this.pageSize = val
      this.getDataPage('paging')
    },
    handleCurrentChange (val) {
      this.page = val
      this.getDataPage('paging')
    },
    getDataPage (flag) {
      let url = '/materials/list'
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
      }
      this.$root.ajaxData(url, param, function (data) {
        vm.updateData(data)
      })
    },
    toUriParams (data) {
      return Object.keys(data).filter(i => !!data[i]).map(i => i + '=' + data[i]).join('&')
    },
    search (data) {
      this.$emit('actionSearch', data)
      this.searchValues = data
      this.page = 0
      // this.getData('search')
    },
    todoEssearch (data) {
      this.searchValues = data
      const vm = this
      var url = vm.mate.mateList.essearch.url
      this.$root.ajaxData(url, JSON.stringify(data), function (data) {
        vm.updateData(data)
      }, 'POST')
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
        this.mate.selected = data.mate.selected
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
      this.getData()
    },
    rowIdChange (val) {
      this.rowId = val
    }
  }
}
</script>

<style scoped lang="scss">
  .line-btn {
    margin-left: 0;
    position   : absolute;
    top        : 10px
  }
  .title {
    border-bottom: 1px solid #e0e6ed;
    border-right : 1px solid #e0e6ed; 
    white-space: nowrap;
    overflow: hidden;
    background-color: #EFF2F7;
    text-align: center;
    height: 40px;
    line-height: 40px;
    min-width: 0;
    text-overflow: ellipsis;
    box-sizing: border-box;
    
    font-size: 14px;
    color: #1f2d3d;
  }
  .tree-head-first {
    width:30%;
    position:absolute;
    left:0;
    top:0;
  }
  .line-row{
    position:absolute;
    left:30%;
    top:0;
    width: 70%;
  }
  .last {
    margin-left:30%;
  }

  .rltv{
    position:relative;
    border: 1px solid #dfe6ec;
    border-bottom: 0;
  }
  .col-tree{
    text-align: center;
  }

  .div-center{
    text-align: center;
  }

  .halo-tree{
    padding-left: 20px;
  }

  .material{
      margin-top:10px;
  }
  
  .btnblock{
      padding-top:0;
  }
    .el-form-item {
    margin-right:20px;
  }
  .hidden{
    display:none;
  }
  h4{
    margin-top:40px;
    margin-bottom:10px;
  }
  .el-select{
    width:100%;
  }
  .el-date-editor.el-input{
    width:100%;
  }
  .el-form-item {
    margin: 15px 20px 2px 0px;
}
.pageMarginTop{
  margin-top:15px;
}
.leftMargin{
  margin-left:10px;
  float:left;
}
.el-table td, .el-table th {
    height: 22px;
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
// .el-table .cell{
//   line-height:20px!important
// }
</style>

