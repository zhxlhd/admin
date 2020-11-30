<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-table size="mini" highlight-current-row ref="table" @row-click="rowClick" :max-height="height" :data="mate.rows" border @selection-change="handleSelectionChange" @sort-change="sortChange" style="width: 100%;">
          <el-table-column fixed="left" type="selection" width="50" id="tableSel"></el-table-column>
          <template v-for="col of mate.columns" >
            <el-table-column v-if="col.blockHash" :formatter="col.formatter" v-bind:key="col.name" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="top" v-show="scope.row.blockHash">
                  <p>区块哈希: {{ scope.row.blockHash }}</p>
                  <p>上链时间: {{ scope.row.updateAt }}</p>
                  <div slot="reference" class="name-wrapper">
                    <el-tag ><img src="../assets/imgs/ztree/ic_chain.png" style="width:13px; height:13px;margin:-2px 2px">{{ scope.row[col.name] }}</el-tag>
                  </div>
                </el-popover>
                <span v-show="!scope.row.blockHash">{{ scope.row[col.name] }} </span>
              </template>
            </el-table-column>
          </template>
          <template v-for="col of mate.columns" >
            <el-table-column v-if="col.isShow && col.status!='checkbox'" :formatter="col.formatter" v-bind:key="col.name" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="col.isShow && col.status==='checkbox'" :formatter="col.formatter" v-bind:key="col.name" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip>
              <template slot-scope="scope">
                <!-- 行内容已实施渲染勾选框  -->
                <span>
                  <el-checkbox v-model="scope.row.checkState" disabled></el-checkbox>
                </span>
              </template>
            </el-table-column>
          </template>
          <el-table-column label="操作" fixed="right" :min-width="actionWidth" v-if="mate.actions">
            <template slot-scope="scope">
              <KBtn v-for="act of mate.actions" v-bind:key="act.action" size="mini" :act="act" :row="scope.row" @action="handleAction"></KBtn>
              <el-button size="mini" v-if="scope.row.auditStatus==='0' || scope.row.auditStatus==='1'" @click="audit(scope.row)">审核</el-button>
              <el-button size="mini" v-if="scope.row.auditStatus==='2'" @click="audit(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script scope>
import { API_GATEWAY } from '@/config/index.js'
import ColumnFormatterMixin from '../mixins/ColumnFormatterMixin'
import KBtn from './KBtn.vue'

export default {
  mixins: [ColumnFormatterMixin],
  components: {
    KBtn,
    Formor: function index (resolve) {
      require(['./Formor.vue'], resolve)
    },
    'dict-selected': function index (resolve) {
      require(['./DictSelected.vue'], resolve)
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
      default: 5
    },
    toSort: Boolean
  },
  data () {
    return {
      loading: true,
      titleOptions: [],
      companyOptions:[],
      value1:'',
      operatorOptions: [],
      multipleSelection: [],
      childCompany:[],
      supplierOptions1: [],
      hasSelected: false,
      searchValues: {},
      page: 0,
      dialogTableDim: false,
      showAdvancedSearchPopover: false,
      sortValues: {},
      rowId:'',
      userType: '',
      action: null,
      editFlag: false,
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
      dialogDetailLine: false
      // filterMethod(query, item) {
      //   this.$root.ajaxData('/tenants/query?name=' + query, {}, function (data) {
      //     vm.supplierOptions1.push(data.data)
      //     return vm.supplierOptions1;
      //     }, 'GET')
      //   }
    }
  },
  watch: {
    multipleSelection: function (newSelection) {
      this.hasSelected = (newSelection && newSelection.length !== 0);
      this.$emit('isSelected', this.hasSelected,this.multipleSelection);
    },
    mate: function (newMate) {
      this.formatterBefore(this.mate.columns)
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
    this.formatterBefore(this.mate.columns)
    if (this.mate !== undefined && this.mate.dataApi !== undefined) {
      if (this.mate.dataApi.indexOf('/inventory/physical/snapshots/invyWatch/list') > -1 ||
        this.mate.dataApi.indexOf('/inventory/physical/snapshots/invyApprove/list') > -1 ||
        this.mate.dataApi.indexOf('/inventory/physical/snapshots/invyAdjust/list') > -1) {
        if (this.mate.rows !== undefined && this.mate.rows.length > 0) {
          this.physicalInventoryId = this.mate.rows[0].physicalInventoryId
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
      return this.mate.actions.length * 60 + 80
    }
  },
  mounted () {
    this.rowSelect()
  },
  // 需要添加刷新消息
  methods: {
    rowClick(row) {
      this.$emit('rowClick',row)
    },
    audit (row) {
      var vm = this
      // this.$root.ajaxData('/companys/perfectInfo?audit=true' + '&tenantId=' + row.tenantId + '&name=' + row.name, {}, function (data) {
      // }, 'GET')
      this.$root.monitor({ url: '/companys/perfectInfo?audit=true' + '&tenantId=' + row.tenantId + '&name=' + row.name })
    },
    focusLine (name, row) {
      this.emit('focusLine', name, row)
    },
    blurLine (name, row) {
      this.emit('blurLine', name, row)
    },
    query () {
      const mate = [this.mate.mateSearch.values]
      const vm = this
      const url = this.mate.mateSearch.url
      this.$root.ajaxData(url, mate, function (data) {
        vm.mate.mateList = data.mate
      }, 'POST')
    },
    showSearchPopover () {
      this.showAdvancedSearchPopover = !this.showAdvancedSearchPopover
    },

    fileUpload (file) {
      var vm = this
      var formdata = new FormData()
      formdata.append('file', file.target.files[0])
      this.$http({
        url: `${API_GATEWAY}/zuul/api/register/import`,
        method: 'POST',
        body: formdata,
        responseType: 'arraybuffer'
      }).then(function (response) {
        vm.$refs.excelFile.value = ''
        setTimeout(function () {
          vm.$root.monitor({ url: '/tenants/list' })
        }, 1000)
      })
    },
    fileUploadBom (file) {
      var vm = this
      var formdata = new FormData()
      formdata.append('file', file.target.files[0])
      this.$http({
        url: `${API_GATEWAY}/zuul/api/bom/import/bom`,
        method: 'POST',
        body: formdata
      }).then(function (response) {
        vm.$refs.excelFileBom.value = ''
        if(response.body.statusCode === 40021){
          vm.$message({
            message:response.body.message,
            type: 'warning'
        })
        return
        }
        if(response.body.statusCode === 40022){
          vm.$message({
            message:response.body.message,
            type: 'warning'
        })
        return
        }
        if(response.body.statusCode === 40023){
          vm.$message({
            message:response.body.message,
            type: 'warning'
        })
        return
        }
        setTimeout(function () {
          vm.$root.monitor({ url: '/bom/bomList' })
        }, 1000)
      })
    },
    handleChange () {
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
      this.$emit('handleAction', act, row);
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
      if(!this.toSort){
        if (!sort || !sort.column || !sort.column.sortable) {
          return
        }
        this.sortValues = {
          order: sort.order,
          column: sort.prop
        }
        this.getData('sort')
      }
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
      var url = vm.mate.essearch.url
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
    },
      // 穿梭框确定
    confirmDialog () {
      // 将选择的信息 存在行列表里
      this.dialogTableDim = false
      this.$root.ajaxData('/tenants/assign/subcom/' + this.rowId, this.childCompany, function (data) {

      },'PUT')
    },
    // 穿梭框关闭
    cancelDialog () {
      this.dialogTableDim = false
    },
    // 搜索子公司
    remoteMethod(query) {
      var vm = this
      if (query !== '') {
        this.loading = true;
        this.$root.ajaxData('/tenants/query?name=' + query, {}, function (data) {
          vm.companyOptions = []
          if(data.data.length){
            vm.loading = false
            data.data.forEach(item=>{
              var detail = {}
              detail.label = item
              detail.value = item
              vm.companyOptions.push(detail)
            })
          } else {
            this.loading = false
          }
        }, 'GET')
      } else {
        this.companyOptions = [];
      }
    },
    handleReplacementMaterial () {
      this.emit('replacementMaterialAction', name, row)
    }
  }
}
</script>

<style scope lang="scss">
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
    margin: 22px 20px 2px 0;
  }
  .invyTagbtn{
    margin-top:20px;
  }
  .chain {
      display: inline-block;
      width: 15px;
      height: 15px;
      background:url('../assets/imgs/ztree/ic_chain.png') no-repeat;
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
</style>
