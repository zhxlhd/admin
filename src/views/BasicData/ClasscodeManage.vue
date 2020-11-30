<template>
<div>
  <Boxer :mate="mate.mateList" :mateSearch="mate.mateSearch" :hasSelected="hasSelected" @action="handleButton" ref="Boxer" :msgBoxButton="msgBoxButton">
    <span slot="searchForm" class="leftMargin">
      <el-button  size="mini" type="primary" v-if="mate.mateSearch" class="el-icon-search" @click="showSearchPopover">搜索</el-button>
      <el-select v-model="comfirmValue" @change="comfirmClassCode(comfirmValue)" placeholder="请选择" size="mini">
          <el-option
            v-for="item in comfirmOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
      </el-select>
    </span>
    <div slot="main">
      <div class="query"   v-if="mate.mateSearch">
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
                    <el-input clearable :disabled="valueFlag" v-model="mate.mateSearch.values['value']" size="mini"></el-input>
                  </el-col>
                  <el-col :sm="6" :md="4" :lg="4">
                    <el-button type="primary" @click="query" style="margin-left: 10px" size="mini">查询</el-button>
                  </el-col>
                </el-form>
              </el-row>
        </div>
      <el-row>
        <el-col :span="24">
          <el-table size="mini" highlight-current-row ref="table" :data="mate.mateList.rows" border @selection-change="handleSelectionChange" @sort-change="sortChange" style="width: 100%;">
              <el-table-column type="selection" width="50" id="tableSel"></el-table-column>
              <el-table-column v-if="col.isShow" :formatter="col.formatter" v-for="col of mate.mateList.columns" v-bind:key="col.name" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip>
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
    <el-dialog title="税务分类代码管理" :visible.sync="dialogVisible"  width="50%" center>
      <el-row>
        <el-form size="mini" ref="form" :model="mate.mateFormerHeader.values" label-width="120px" :rules="rules">
          <el-col :span="15">
            <el-form-item :label="object['itemCode'].label" :prop="object['itemCode'].name">
              <el-input :disabled="itemCodeFlag" v-model="mate.mateFormerHeader.values[object['itemCode'].name]" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item :label="object['itemName'].label" :prop="object['itemName'].name">
                <el-input v-model="mate.mateFormerHeader.values[object['itemName'].name]" ></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="15">
            <el-form-item :label="object['model'].label" :prop="object['model'].name">
                <el-input v-model="mate.mateFormerHeader.values[object['model'].name]" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item :label="object['classCode'].label" :prop="object['classCode'].name">
             <el-input placeholder="请在开票软件中查看，税收分类代码为19位，不足19位在后面补0" v-model="mate.mateFormerHeader.values[object['classCode'].name]" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item :label="object['unit'].label" :prop="object['unit'].name">
             <el-input v-model="mate.mateFormerHeader.values[object['unit'].name]" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item>
              <el-button type="primary" @click="confrimDialogVisible">确定</el-button>
              <el-button @click="cancelDialogVisible">取消</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </el-dialog>
    <input type="file" ref="excelFile"  style="display:none" @change="fileUpload"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
    </div>
</template>

<script>
import { API_GATEWAY } from '@/config/index.js'
import { LANGS } from '../../i18n/lang'
import KBtn from '../../components/KBtn.vue'
import Boxer from '../../components/Boxer.vue'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
const BASEAPI = `${API_GATEWAY}/api`
import { DateFormat } from '../../utils/util.js'
export default {
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
  props: {
    mate: Object
  },
  data () {
    var vm = this
    var checkClassCode = (rule, value, callback) => {
        if (value === '' || value == null) {
          callback(new Error('请填写税收分类代码!'));
        } else if (value.length !== 19) {
          callback(new Error('请填写19位的税收分类代码!'));
        } else {
          this.$root.ajaxData('/purchase/classcode/manage/check?combcode=' + value, {}, function (data) {
             if (data.message == 1) {
                 callback();
             }else{
                 callback(new Error('请填写正确的税收分类代码!'));
             }
          }, 'GET')
        }
    };
    return {
      itemCodeFlag: false,
      valueFlag: false,
      dialogVisible: false,
      form: {},
      object: {},
      showAdvancedSearchPopover: false,
      dialogVisibleMessage: false,
      dialogVisibleCancelMessage: false,
      invoiceNo: '',
      pageSize: 15,
      page: 0,
      dialogDetailLine: false,
      hasSelected: false,
      showVisible: false,
      titleOptions: [],
      operatorOptions: [],
      msgBoxButton: true,
      multipleSelection: [],
      rules: {
        itemCode:
         { required: true, message: '该输入项为必输项', trigger: 'blur' },
        itemName:
         { required: true, message: '该输入项为必输项', trigger: 'blur' },
        classCode:
         { required: true, validator: checkClassCode, trigger: 'blur' }
      },
      comfirmValue: '',
      comfirmOptions: [{
        value: '-1',
        label: '全部'
      }, {
        value: '0',
        label: '待维护'
      }]
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
      this.titleOptions = this.mate.mateSearch.fields[0].options
      this.operatorOptions = this.mate.mateSearch.fields[1].options
      this.$nextTick(function () {
        this.rowSelect()
      })
      if(this.mate.comfirmValue){
         this.comfirmValue = this.mate.comfirmValue
      }
    }
  },
  created () {
    this.rowId = ''
    var vm = this
    this.mate.mateFormerHeader.fields.map((i) => { this.object[i.name] = i })
    this.titleOptions = this.mate.mateSearch.fields[0].options
    this.operatorOptions = this.mate.mateSearch.fields[1].options
    // this.getData()
    this.formatterBefore(this.mate.mateList.lineColumns)
    this.formatterBefore(this.mate.mateList.columns)
    this.mate.mateList.localName = this.mate.localName
    this.rowsContent = this.mate.mateList.rows
    this.mate.mateList.localName = this.mate.localName
     var value = sessionStorage.getItem('comfirmValue')
    if(sessionStorage.getItem('comfirmValue') == null){
      this.comfirmValue = '-1'
    }else{
        this.comfirmValue = sessionStorage.getItem('comfirmValue')
    }
    // window.onbeforeunload=function(){
    //   sessionStorage.removeItem('comfirmValue')
    // }
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
    comfirmClassCode (value) {
      const vm = this
      if(value === '0'){
        sessionStorage.setItem('comfirmValue', '0')
        vm.$root.ajaxData('/purchase/classcode/manage/all/list?confirmClassCode='+ value +'&pageNum=' + this.page + '&pageSize=' + this.pageSize, {}, function (data) {
              vm.mate.mateList.rows = data.mate.mateList.rows
              vm.mate.mateList.total = data.mate.mateList.total
        })
      } else {
        sessionStorage.setItem('comfirmValue', '-1')
        vm.$root.ajaxData('/purchase/classcode/manage/all/list?pageNum=' + this.page + '&pageSize=' + this.pageSize, {}, function (data) {
              vm.mate.mateList.rows = data.mate.mateList.rows
              vm.mate.mateList.total = data.mate.mateList.total
        })
      }
    },
    query () {
      const mate = [this.mate.mateSearch.values]
      this.searchValues = mate
      const vm = this
      const url = this.mate.mateSearch.url

       if(this.comfirmValue === '0'){
        this.$root.ajaxData(url+'?pageNum=' + this.page + '&pageSize=' + this.pageSize + '&confirmClassCode=' + this.comfirmValue, mate, function (data) {
          vm.mate.mateList.rows = data.mate.rows
          vm.mate.mateList.total = data.mate.total
          }, 'POST')
      }else{
          this.$root.ajaxData(url+'?pageNum=' + this.page + '&pageSize=' + this.pageSize, mate, function (data) {
          vm.mate.mateList.rows = data.mate.rows
          vm.mate.mateList.total = data.mate.total
          }, 'POST')
      } 
    },
    // 新增保存
    confrimDialogVisible () {
      var mate = {}
      var vm = this
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.rowId == '') {
            mate = this.mate.mateFormerHeader.values
            this.$root.ajaxData('/purchase/classcode/manage/save', mate, function (data) {
              if(data.statusCode == 500){
                 vm.$message({
                    message: data.message,
                    type: 'warning'
                  })
                 vm.dialogVisible = true
              }else{
                vm.$root.monitor({ url: '/purchase/classcode/manage/all/list' })
                vm.dialogVisible = false
              }
            }, 'POST')
          }else {
            mate = this.mate.mateFormerHeader.values
            this.$root.ajaxData('/purchase/classcode/manage/update/' + this.multipleSelection[0].id, mate, function (data) {
              vm.$root.monitor({ url: '/purchase/classcode/manage/all/list' })
            }, 'PUT')
             this.rowId = '' //把rowId置为''
             vm.dialogVisible = false
          }
          //新增，修改后展示的下拉框变为全部
          this.comfirmValue = '-1'
        } else {
          this.$message({
            message: '数据未填写',
            type: 'warning'
          })
          return
        }
      })
    },
    // 新增取消
    cancelDialogVisible () {
      this.dialogVisible = false
      this.mate.mateFormerHeader.values = {}
    },
    showSearchPopover () {
      this.showAdvancedSearchPopover = !this.showAdvancedSearchPopover
    },
    handleButton (btn) {
      var vm = this
     const row = { id: this.multipleSelection.map((r) => r.id) }
      let ids = row.id
      ids = ids.join()
      // 新增
      if (btn.action === 'addClasscode') {
        this.dialogVisible = true
        this.itemCodeFlag = false
        return
      }
      if (btn.action === 'downLoadMuban') {
        this.$http({
          url: API_GATEWAY + '/api' + btn.url,
          method: 'POST',
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
          var filename = '税收分类代码.xlsx'
          a.setAttribute('download', filename)
          a.click()
          URL.revokeObjectURL(objectUrl)
        })
        return
      }
      if (btn.action === 'uploadFile') {
        this.$refs.excelFile.click()
        this.title = '税收分类代码'
        return
      }
      // 导出
      if (btn.action === 'downloadFile') {
        var exporturl = ''
        if(ids === ''){
           exporturl = API_GATEWAY + '/api' + btn.url + '?confirmClassCode=' + this.comfirmValue
           ids = ' '
        }else{
          exporturl = API_GATEWAY + '/api' + btn.url
        }
        this.$http({
          url: exporturl,
          method: 'POST',
          body: ids,
          headers: {
            'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
            'Accept': 'application/json',
            'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
            'Content-Type': 'application/json;charset=utf8'
          },
          responseType: 'arraybuffer'
        }).then(function (response) {
          var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          // blob(size,type) Blob构造函数，接受两个参数。第一个参数是一个包含实际数据的数组，第二个参数是数据的类型
          var objectUrl = URL.createObjectURL(blob)
          var a = document.createElement('a')
          document.body.appendChild(a)
          a.setAttribute('style', 'display:none')
          a.setAttribute('href', objectUrl)
          var filename = '税收分类代码.xlsx'
          a.setAttribute('download', filename)
          a.click()
          URL.revokeObjectURL(objectUrl)
        })
        return
      }
      // 删除
      if (btn.action === 'deleteClasscode') {
        this.$confirm(btn.confirm.msg, this.$t('toast.prompt'), {
          confirmButtonText: btn.confirm.confirmButtonText,
          cancelButtonText: btn.confirm.cancelButtonText,
          type: 'warning'
        }).then(() => {
          vm.$root.ajaxData('/purchase/classcode/manage/delete?confirmClassCode=' + this.comfirmValue, ids , function (data) {
            var returnUrl = '/purchase/classcode/manage/all/list'
            if(data.data==='0'){
              //查待开票
              returnUrl += '?confirmClassCode='+ data.data
            }
            vm.$root.monitor({ url: returnUrl })
            vm.$message({
              type: 'success',
              message: '删除成功'
            })
          }, 'POST')
        }).catch(() => {
          vm.$message({
            type: 'info',
            message: this.$t('toast.canceled')
          })
        })
        return
      }
      
      // 修改
      if (btn.action === 'editClasscode') {
        const vm = this
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'info',
            message: '请选择一条数据'
          })
          return
        }
        this.dialogVisible = true
        this.itemCodeFlag = true //需要保证一个物料编码只对应一个税收分类代码 所以修改的时候不能改物料编码
        this.rowId = this.multipleSelection[0].id
        this.$root.ajaxData('/purchase/classcode/manage/toupdate/' + this.multipleSelection[0].id, {}, function (data) {
          vm.mate.mateFormerHeader.values = data.mate.values
        })
        return
      } else {
        this.rowId = ''
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
    },
    fileUpload (file) {
      var vm = this
      var formdata = new FormData()
      formdata.append('file', file.target.files[0])
      this.$http({
        url: API_GATEWAY + '/zuul/api/purchase/classcode/manage/import?confirmValue=' + this.comfirmValue,
        method: 'POST',
        body: formdata,
        responseType: 'application/json'
      }).then(function (response) {
      
        vm.$refs.excelFile.value = ''
        setTimeout(function () {
          var returnUrl = '/purchase/classcode/manage/all/list'
          if (response.data.data === '0') {
              // 查待开票
            returnUrl += '?confirmClassCode=' + response.data.data
          }
          vm.$root.monitor({ url: returnUrl })
        }, 1000)
        if (response.data.statusCode === 200) {
          vm.$message({
            message: response.data.message,
            type: 'success'
          })
        }
        if (response.data.statusCode === 500) {
          vm.$message({
            message: response.data.message,
            type: 'error'
          })
        }
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
      // 在采购模块中的分段价格
      if (act.actionEmit === 'actionEmit') {
        this.$emit('handleAction', act, row)
        return true
      } else if (act.action === 'shuaxinDetail') {
        this.$root.ajaxData(act.url + row.id, {}, function (data) {
          vm.$root.monitor({ url: '/purchase/tms/invoice/all/list?path=' })
        })
        return
      } else if (act.action === 'showDetail') {
        vm.$root.monitor({ url: act.url + row.id })
      } else {
        this.$root.handleAction(act, row, function () {
          vm.getData()
        })
      }
    },
    getData (flag) {
      let url = this.mate.mateList.dataApi
      // 入库管理中，添加明细表单，删除刷新，需要带表头的id
      let param = {
        search: this.searchValues,
        page: this.page,
        sort: this.sortValues,
        confirmValue: this.comfirmValue
      }
      var vm = this
      if (flag && url.indexOf('?') === -1) {
        // url += '-q?' + (this.toUriParams(this.searchValues)) + '&' + (this.toUriParams(this.sortValues)) + '&pageNum=' + this.page
        if(this.comfirmValue === '0'){
          url += '-q?' + 'search=' + encodeURIComponent(JSON.stringify(this.searchValues)) + '&pageNum=' + this.page + '&pageSize=' + this.pageSize + '&confirmClassCode=' + this.comfirmValue
        }else {
          url += '-q?' + 'search=' + encodeURIComponent(JSON.stringify(this.searchValues)) + '&pageNum=' + this.page + '&pageSize=' + this.pageSize
        }
        param = null
      } else if (flag && url.indexOf('?') !== -1) {
        if(this.comfirmValue === '0'){
          url += '&search=' + encodeURIComponent(JSON.stringify(this.searchValues)) + '&pageNum=' + this.page + '&pageSize=' + this.pageSize + '&confirmClassCode=' + this.comfirmValue
        }else {
          url += '&search=' + encodeURIComponent(JSON.stringify(this.searchValues)) + '&pageNum=' + this.page + '&pageSize=' + this.pageSize
        }
        param = null
      }
      this.$root.ajaxData(url, param, function (data) {
        vm.updateData(data)
      })
    },
    updateData (data) {
      if (data.mate.rows) {
        this.mate.mateList.rows = data.mate.rows
        this.rowsContent = data.mate.rows
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
    formatter (field) {
      return function (row, col) {
        if (field.switch) {
          return field.switch[row[col.property]]
        }
        return row[col.property]
      }
    },
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
     height: 22px;
    line-height:30px;
  }
  .el-input__suffix {
  right:68px
  }
  .el-form-item--mini.el-form-item {
  margin: 6px;
  }
  .el-input--mini .el-input__inner{
  width:80%
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
  .pagination {
    margin: 40px 0;
    text-align: center;
  }
.top-button{
  margin: 20px 0 10px 0;
}
.el-dialog__body{
  text-align: center;
  font-size: 20px;
  color: red
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
</style>
