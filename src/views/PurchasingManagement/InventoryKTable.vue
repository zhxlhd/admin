<template>
<div>
  
  <Boxer :mate="mate" :hasSelected="hasSelected" @action="handleButton" ref="Boxer" :msgBoxButton="msgBoxButton">
    <div slot="main">
      <el-row>
        <el-col :span="24">
          <el-table highlight-current-row ref="table" :data="mate.rows" border @selection-change="handleSelectionChange" @sort-change="sortChange" style="width: 100%;">
              <el-table-column type="selection" width="50" id="tableSel"></el-table-column>
              <el-table-column v-if="col.isShow" :formatter="col.formatter" v-for="col of mate.columns" v-bind:key="col.name" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip>
              </el-table-column>
              <el-table-column label="操作" fixed="right" :min-width="actionWidth" v-if="mate.actions">
                <template slot-scope="scope">
                  <k-btn v-for="act of mate.actions" v-bind:key="act.action" size="mini" :act="act" :icon="act.icon" :row="scope.row" @action="handleAction"></k-btn>
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
            :current-page.sync="mate.page"
            layout="total,prev, pager, next, sizes"
            :total="mate.total"
            :page-sizes ="[5, 10, 15, 20, 50]"
            :page-size="pageSize">
        </el-pagination>
      </el-col>
      </el-row>
    </div>
  </Boxer>
  
  <el-dialog title="填写标签" :visible.sync="invyTagDlgVisible" size="tiny">
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
    <el-button @click="invyTagDlgSubmit" class="invyTagbtn" type="primary">提 交</el-button>
    <el-button @click="invyTagDlgCancel" class="invyTagbtn">取 消</el-button>
  </el-dialog>
<el-dialog  title="导入用户数据" :visible.sync="dialogFile" size="tiny">
  <el-upload
  class="upload-demo"
  ref="upload"
  :action="fileimportUrl"         
  :headers="headers"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :file-list="fileList"
  :before-upload="beforeUpload"
  :auto-upload="false">
  <span></span>
  <el-button slot="trigger" size="big" type="primary">选取文件</el-button>
  <el-button style="margin-left: 10px;" size="big" type="success" @click="submitUpload"  :before-upload="beforeUpload">导入</el-button>
  <el-button @click="backwardUser, dialogFile = false">取 消</el-button>
</el-upload>
</el-dialog>
</div>
</template>

<script scoped>
import SearchForm from '../../components/SearchForm'
import KBtn from '../../components/KBtn.vue'
import Boxer from '../../components/Boxer.vue'
import { API_GATEWAY } from '@/config/index.js'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
export default {
  mixins: [ColumnFormatterMixin],
  components: {
    SearchForm,
    KBtn,
    Boxer,
    Formor: function index (resolve) {
      require(['../../components/Formor.vue'], resolve)
    }
  },
  props: {
    mate: Object,
    mateFormerHeaderId: String,
    KTableItemCode: String
  },
  data () {
    return {
      pageSize: 15,
      multipleSelection: [],
      hasSelected: false,
      searchValues: {},
      page: 0,
      sortValues: {},
      action: null,
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
      fileimportUrl: API_GATEWAY + '/zuul/api/users/import',
      filedownloadUrl: API_GATEWAY + '/zuul/api/users/downloadFile',
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
      dialogDetailLine: false
    }
  },
  watch: {
    multipleSelection: function (newSelection) {
      this.hasSelected = (newSelection.length !== 0)
    },
    mate: function (newMate) {
      this.formatterBefore(this.mate.columns)
      this.$nextTick(function () {
        this.rowSelect()
      })
    }
  },
  created () {
    // this.getData()
    this.formatterBefore(this.mate.columns)
    if (this.mate != undefined && this.mate.dataApi != undefined) {
      if (this.mate.dataApi.indexOf('/inventory/physical/snapshots/invyWatch/list') > -1 ||
        this.mate.dataApi.indexOf('/inventory/physical/snapshots/invyApprove/list') > -1 ||
        this.mate.dataApi.indexOf('/inventory/physical/snapshots/invyAdjust/list') > -1) {
        if (this.mate.rows != undefined && this.mate.rows.length > 0) {
          this.physicalInventoryId = this.mate.rows[0].physicalInventoryId
        }
      }
    }
    // this.actionWidth = this.mate.actions.length * 60 + 30
  },
  computed: {
    actionWidth: function () {
      return this.mate.actions.length * 60 + 30
    }
  },
  mounted () {
    this.rowSelect()
  },
  // 需要添加刷新消息
  methods: {
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

      if (numCount == 0) {
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
      var vm = this
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
      this.$root.handleAction(btn, row, function () {
        vm.getData()
      })
    },
    rowSelect () {
      if (this.mate.rows) {
        this.mate.rows.forEach(row => {
          /* eslint-disable */
          let select = (row.id && this.mate.selected && this.mate.selected.findIndex(id => id == row.id) !== -1)
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
      } else {
        this.$root.handleAction(act, row, function () {
          vm.getData()
        })
      }
    },
    getData (flag) {
      let url = this.mate.dataApi
      // 入库管理中，添加明细表单，删除刷新，需要带表头的id
      if (this.mate.dataApi === '/inbound/bill/lines/list') {
        url = this.mate.dataApi + '/' + this.mateFormerHeaderId
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
      if (flag && url.indexOf('?') === -1) {
        if (url === '/sys/seqno/list') {
          url += '?search=' + encodeURIComponent(JSON.stringify(this.searchValues)) + '&' + (this.toUriParams(this.sortValues)) + '&pageNum=' + this.page + '&pageSize=' + this.pageSize
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
      if (data.mate.rows) {
        this.mate.rows = data.mate.rows
      }
      if (data.mate.total) {
        this.mate.total = data.mate.total
      } else {
        this.mate.total = 0
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
    toUriParams (data) {
      return Object.keys(data).filter(i => !!data[i]).map(i => i + '=' + data[i]).join('&')
    },
    backwardUser () {
      this.$root.monitor({ url: '/users/list' })
    },
    importfile () {
      this.$root.monitor({ url: '/users/import' })
    },
    submitUpload () {
      this.$refs.upload.submit()
      const vm = this
      setTimeout(function () {
        vm.$root.monitor({ url: '/users/list' })
      }, 1000)
    },
    handleRemove (file, fileList) {
    },
    handlePreview (file) {
    },
    beforeUpload (file) {
      var vm = this
      var filename = file.name
      var suffixName = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase()
      if (!(suffixName == 'xlsx' || suffixName == 'xls')) {
        vm.$notify.error({
          title: '消息',
          message: '只能上传xls或xlsx文件'
        })
        return false
      } else {
        this.dialogFile = false
      }
    }

  }
}
</script>

<style scoped>
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
</style>
