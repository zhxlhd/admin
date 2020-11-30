<!-- 要货计划 -->
<template>
<div>
  <div class="ct">
    <el-row :gutter="24">
      <el-form :label-position="labelPosition" :label-width="labelWidth">
        <el-col :sm="6" :md="6" :lg="6">
          <el-form-item label="业务实体" >
            <el-select size="mini" @change="handleVersion" clearable v-model="businessEntity" filterable placeholder="请选择或手输业务实体">
              <el-option
                v-for="(item,index) in entityOptions"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="6" :md="6" :lg="6">
          <el-form-item label="要货计划版本号" >
            <!-- <el-input size="mini" v-model="version" placeholder="请输入要货计划版本号"></el-input> -->
            <el-select size="mini" clearable  v-model="version" filterable placeholder="请输入要货计划版本号">
              <el-option
                v-for="item in versionOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="6" :md="4" :lg="4">
          <el-button size="mini" @click="searchCondition">搜索</el-button>
          <el-button size="mini" @click="clearCondition">清空</el-button>
        </el-col>
      </el-form>
    </el-row>
  </div>
  <Boxer :mate="mate.mateList" :mateSearch="mate.mateSearch" :hasSelected="hasSelected" @action="handleButton" ref="Boxer">
    <span slot="search" class="leftMargin">
      <search-form v-if="mate.mateList.essearch" :essearch="mate.mateList.essearch" @essearch="todoEssearch"></search-form>
      <Formor v-else-if="mate.mateList.search" :mate="mate.mateList.search" :search="search" class="leftFloat" :word="word"></Formor>
    </span>
    <div slot="main">
      <el-row>
        <el-col :span="24">
          <input type="file" ref="excelFile" style="display: none" @change="fileUpload"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
          <el-table size="mini" highlight-current-row @row-click="rowClick" ref="table" :data="mate.mateList.rows" border @selection-change="handleSelectionChange" @sort-change="sortChange" style="width: 100%;" max-height="300">
              <el-table-column fixed="left" type="selection" width="50"></el-table-column>
              <template  v-for="(col,index) of mate.mateList.columns">
                <el-table-column :formatter="col.formatter" v-if="col.isShow" :key="index" :label="col.label" :prop="col.name" :width="col.width" :sortable="col.sortable" show-overflow-tooltip>
                </el-table-column>
              </template>
              <el-table-column label="操作" :min-width="actionWidth" v-if="mate.mateList.actions">
                <template slot-scope="scope">
                  <k-btn v-for="(act,index) of mate.mateList.actions" :key="index" size="mini" :act="act" :icon="act.icon" :row="scope.row" @action="handleAction"></k-btn>
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
              :current-page.sync="currentPage"
              layout="total, prev, pager, next, sizes"
              :total="mate.mateList.total"
              :page-sizes ="[5, 10, 15, 20, 50]"
              :page-size="pageSize">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
  </Boxer>
  <!--下面的明细表格-->
  <template>
    <div class="priceDetailLine">
      <el-table fit highlight-current-row size="mini" v-if="showFlag" :data="mate.mateList.lineRows" border style="width: 100%;" class="DblTableOrder" max-height="300">
        <el-table-column show-overflow-tooltip v-if="lineColumns['lineNum'].isShow" :label="lineColumns['lineNum'].label" :prop="lineColumns['lineNum'].name" :min-width="lineColumns['lineNum'].width"></el-table-column> 
        <el-table-column show-overflow-tooltip v-if="lineColumns['reqDate'].isShow" :label="lineColumns['reqDate'].label" :prop="lineColumns['reqDate'].name" :min-width="lineColumns['reqDate'].width"></el-table-column>
        <el-table-column show-overflow-tooltip v-if="lineColumns['weeks'].isShow" :label="lineColumns['weeks'].label" :prop="lineColumns['weeks'].name" :min-width="lineColumns['weeks'].width"></el-table-column>
        <el-table-column show-overflow-tooltip v-if="lineColumns['week'].isShow" :label="lineColumns['week'].label" :prop="lineColumns['week'].name" :min-width="lineColumns['week'].width"></el-table-column>
        <el-table-column show-overflow-tooltip v-if="lineColumns['responseNum'].isShow" :formatter="lineColumns['responseNum'].formatter" :label="lineColumns['responseNum'].label" :prop="lineColumns['responseNum'].name" :min-width="lineColumns['responseNum'].width"></el-table-column>
        <el-table-column show-overflow-tooltip v-if="lineColumns['actualNum'].isShow" :formatter="lineColumns['actualNum'].formatter" :label="lineColumns['actualNum'].label" :prop="lineColumns['actualNum'].name" :min-width="lineColumns['actualNum'].width"></el-table-column>
        <el-table-column show-overflow-tooltip v-if="lineColumns['planNum'].isShow" :label="lineColumns['planNum'].label" :prop="lineColumns['planNum'].name" :min-width="lineColumns['planNum'].width"></el-table-column>
      </el-table>
    </div>
  </template>

</div>
</template>

<script>
import SearchForm from '../../components/SearchForm'
import KBtn from '../../components/KBtn.vue'
import Boxer from '../../components/Boxer.vue'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
import { API_GATEWAY } from '@/config/index.js'
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
    mateFormerHeaderId: String,
    KTableItemCode: String,
    mateFormSupplierId: String
  },
  data () {
    return {
      userCompanyName: JSON.parse(window.sessionStorage.getItem('user')).userCompanyName,
      showFlag: false,
      lineColumns: {},
      labelWidth: '110px',
      labelPosition: 'right',
      businessEntity: '', // 业务实体搜索条件
      version: '', // 要货计划版本号搜索条件
      importUrl: '',
      pageSize: 5,
      currentPage: 1,
      multipleSelection: [],
      hasSelected: false,
      searchValues: {},
      page: 1,
      sortValues: {},
      action: null,
      dialogTableVisible: false,
      dialogPriceVisible: false,         // dialog开关
      tableData: [],
      word: '查 询',
      entityOptions: [], // 搜索中的业务实体选项
      versionOptions: [], // 搜索中的版本号
      priceColumns: {},
      object: {},                          // 放columns
      mingxiRows: [],
      priceList: {},                      // 明细行获取的数据
      invyTagDlgVisible: false,
      invyTagmate: { startTagNo: '', stolabel: '起始标签号', incrementNumber: '', inlabel: '数字增量', numberOfTags: '', numlabel: '标签数量' },
      physicalInventoryId: 0,
      colModels: [],
      dialogFile: false,
      fileList: [],
      supplierId: '',
      fileimportUrl: API_GATEWAY + '/api/users/import',
      filedownloadUrl: API_GATEWAY + '/api/users/downloadFile',
      headers: {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
        'Accept': 'application/json',
        'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId
      }
    }
  },
  watch: {
    multipleSelection: function (newSelection) {
      this.hasSelected = (newSelection.length !== 0)
    },
    mate: function (newMate) {
      this.showFlag = false;
      this.formatterBefore(this.mate.mateList.lineColumns)
      this.$nextTick(function () {
        this.rowSelect()
      })
    }
  },
  created () {
    this.formatterBefore(this.mate.mateList.lineColumns)
    this.mate.mateList.lineColumns.map((i) => { this.lineColumns[i.name] = i })
  },
  computed: {
    actionWidth: function () {
      return this.mate.actions.length * 60 + 30
    }
  },
  mounted () {
    this.rowSelect()
    this.init()
  },
  // 需要添加刷新消息
  methods: {
    // 搜索条件
    searchCondition () {
      this.showFlag = false;
      this.page = 1; // 查询从第一页开始
      this.currentPage = 1; // 重置分页器为第一页
      this.getData('paging');
    },
    // 清空搜索条件
    clearCondition () {
      this.businessEntity = ''
      this.version = ''
    },
    // 获取业务实体选项
    init () {
      var vm = this
      this.$root.ajaxData('/supplier-portal/goodsDemandPlan/businessEntityList', {}, res => {
        res.forEach(item => {
          let option = {
            value: item.id,
            label: item.name
          }
          vm.entityOptions.push(option)
        })
      }, 'GET')
    },
    /** 业务实体改变
     * 根据业务实体获取响应的要货计划版本好
     * @param {String} val 业务实体的 value
     * @return void
     */
    handleVersion(val) {
      // 改变业务实体 置空要货计划版本号
      this.versionOptions = [];
      this.version = '';
      // 获取要货计划版本号
      this.initVersion(val);
    },
    // 获取版本号选项
    initVersion (val) {
      if (val == '') return;
      const _this = this;
      this.$root.ajaxData(`/supplier-portal/goodsDemandPlan/query/versions?supplierName=${this.userCompanyName}&businessEntity=${val}`, {}, res => {
        if(res.length){
          res.forEach(item => {
            let option = {}
            option.value = item
            option.label = item
            _this.versionOptions.push(option)
          })
        }else{
          // 如果该业务实体没有要货计划版本号 给出提示
          let businessName = this.entityOptions.find(item => item.value === val).label || '该业务实体';
          this.$notify({
            title: '提示',
            message: `${businessName}没有要货计划版本号`,
            duration: 3000
          })
        }
      }, 'GET')
    },

    rowClick (row) {
      // 清空选择 20019-02-26
      this.$refs['table'].clearSelection()
      // 选中当前点击行 20019-02-26
      this.$refs['table'].toggleRowSelection(row)
      this.showFlag = true
      var vm = this
      this.$root.ajaxData('/supplier-portal/goodsDemandPlan/line/list?headId=' + row.id, {}, function (data) {
        vm.mate.mateList.lineRows = data
      }, 'GET')
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    fileUpload (file) {
      var vm = this
      var formdata = new FormData()
      formdata.append('file', file.target.files[0])
      this.$http({
        url: API_GATEWAY + '/api' + this.importUrl,
        method: 'POST',
        body: formdata
        // responseType: 'arraybuffer'
      }).then(function (response) {
        vm.$refs.excelFile.value = ''
        if(response.body.statusCode == 200){
          vm.$message({
            type: 'success',
            message: '导入成功'
          })
        }
        if(response.body.statusCode == 500){
          vm.$message({
            type: 'success',
            message: '导入失败'
          })
        }
        
        setTimeout(function () {
          vm.$root.monitor({ url: '/supplier-portal/goodsDemandPlan/head/list' })
        }, 1000)
      })
    },
    handleButton (btn) {
      let multipleSelection = this.multipleSelection;
      // 导出
      let supplierName = this.userCompanyName || '';
      if (btn.action === 'scheduleExport') {
        if(multipleSelection.length != 1){
          this.$message({
            type: 'warning',
            message: this.$t('seladata')
          })
        }
        let businessEntity = multipleSelection[0].businessEntity;
        let version = multipleSelection[0].version && multipleSelection[0].version.trim();
        this.$http({
          // url: API_GATEWAY + url + '&ids=' + rowt.id,
          url: `${API_GATEWAY}/api${btn.url}?businessEntity=${businessEntity}&version=${version}&supplierName=${supplierName}`,
          method: btn.method,
          headers: {
            'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
            'Accept': 'application/json',
            'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf8'
          },
          // params: vm.searchForm,
          responseType: 'arraybuffer'
        }).then(function (response) {
          var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          // blob(size,type) Blob构造函数，接受两个参数。第一个参数是一个包含实际数据的数组，第二个参数是数据的类型
          var objectUrl = URL.createObjectURL(blob)
          var a = document.createElement('a')
          document.body.appendChild(a)
          a.setAttribute('style', 'display:none')
          a.setAttribute('href', objectUrl)
          var officeId = `${this.businessEntity}`
          var officeName = ''
          for(var i=0;i<this.entityOptions.length;i++){
            if(this.entityOptions[i].value == officeId){
              officeName = this.entityOptions[i].label
              break
            }
          }
          var fileName = ''
          if('' != officeName && '' != `${this.version.trim()}`){
            fileName = officeName + '_' + `${this.version.trim()}` + '.xlsx'
          }else{
            fileName ='要货计划.xlsx'
          }
          a.setAttribute('download', fileName)
          a.click()
          URL.revokeObjectURL(objectUrl)
        })
        return
      }
      // 导入
      if (btn.action === 'scheduleInput') {
        this.$refs.excelFile.click()
        this.importUrl = btn.url
        return
        // var url = btn.url
        // var fileName = '要货计划.xlsx'
        // this.$http({
        //     url: API_GATEWAY + url,
        //     method: 'POST',
        //     headers: {
        //         'Authorization': 'Bearer ' + JSON.parse(window.sessionStorage.getItem('token')),
        //         'Accept': 'application/json',
        //         'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
        //         'Content-Type': 'application/json;charset=utf8'
        //     },
        //     params: vm.searchForm,
        //     body: rowt.id,
        //     responseType: 'arraybuffer'
        // }).then(function (response) {
        //     var blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
        //     // blob(size,type) Blob构造函数，接受两个参数。第一个参数是一个包含实际数据的数组，第二个参数是数据的类型
        //     var objectUrl = URL.createObjectURL(blob)
        //     var a = document.createElement('a')
        //     document.body.appendChild(a)
        //     a.setAttribute('style', 'display:none')
        //     a.setAttribute('href', objectUrl)
        //     a.setAttribute('download', fileName)
        //     a.click()
        //     URL.revokeObjectURL(objectUrl)
        // })
        return
      }
    },
    rowSelect () {
      if (this.mate.rows !== undefined) {
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
      this.showFlag = false
      this.pageSize = val
      this.getData('paging')
    },
    handleCurrentChange (val) {
      this.showFlag = false
      this.page = val
      this.getData('paging')
    },
    handleAction (act, row) {
      if (act.action === 'addPrice') {
        this.dialogPriceVisible = true
        this.mate.rows.priceList = row.priceList
        return false
      }
    },
    getData (flag) {
      let url = this.mate.mateList.url
      // if (this.mate.dataApi === '/inbound/bill/lines/list') {
      //   url = this.mate.dataApi + '/' + this.mateFormerHeaderId
      // }
      let param = {
        search: this.searchValues,
        page: this.page,
        sort: this.sortValues
      }

      var vm = this
      if (flag === 'search') {
        url += '?param=' + this.mateList.mate.search.values.name
        this.$root.ajaxData(url, param, function (data) {
          vm.updateData(data)
        })
        // 不用return，会有两次调用这个函数
        return true
      }
      if (flag === 'paging') {
        url += `?businessEntity=${this.businessEntity}&&version=${this.version.trim()}&supplierId=` + this.mateFormSupplierId + '&search=' + encodeURIComponent(JSON.stringify(this.searchValues)) + '&' + (this.toUriParams(this.sortValues)) + '&pageNum=' + this.page + '&pageSize=' + this.pageSize
        param = null
      }
      this.$root.ajaxData(url, param, function (data) {
        vm.updateData(data)
      })
    },
    updateData (data) {
      if (data.mate.rows) {
        this.mate.mateList.rows = data.mate.rows
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
    formatterBefore () {
      this.mate.mateList.columns.filter(col => col.dict !== undefined).forEach(function (col, i) {
        let dictType = col.dict
        if (dictType.indexOf('.') > -1) {
          dictType = dictType.split('.')[1]
        }
        col.formatter = function (row, column) {
          return DictStore.formatDict(dictType, row[column.property])
        }
      })
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
    backwardUser () {
      this.$root.monitor({ url: '/users/list' })
    }
  }
}
</script>

<style scoped>
  .el-select{
    width: 100%;
  }
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
  .priceDetailLine{
    margin-top: 50px;
    position: relative;
  }
  .el-form-item {
    margin: -5px 20px 2px 0; 
  }
  .invyTagbtn{
    margin-top:20px;
  }
  .el-table td, .el-table th {
    height: 30px;
  }
  .ct {
    margin-bottom: 20px;
  }
</style>
