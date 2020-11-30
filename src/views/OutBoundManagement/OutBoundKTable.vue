<template>
<div>
  <Boxer :mate="mate" :hasSelected="hasSelected" @action="handleButton" ref="Boxer" :msgBoxButton="msgBoxButton">
    <div slot="main">
      <el-row>
        <el-col :span="24">
          <el-table size="mini" highlight-current-row ref="table" :data="mate.rows" border @selection-change="handleSelectionChange" @sort-change="sortChange" style="width: 100%;margin-top:12px">
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
      <input type="file" ref="selectFiles"  style="display:none" @change="selectFiles"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
    </div>
  </Boxer>
</div>
</template>

<script>
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
      tableData: [],
      word: '查 询',
      object: {},                          // 放columns
      invyTagDlgVisible: false,
      physicalInventoryId: 0,
      colModels: [],
      dialogFile: false,
      fileList: [],
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
      uploadUrl: '',
      uploadMethod: '',
      uploadData: {},
    }
  },
  watch: {
    multipleSelection: function (newSelection) {
      this.hasSelected = (newSelection.length !== 0)
    },
    mate: function (newMate) {
    }
  },
  created () {
    // this.getData()
    this.formatterBefore(this.mate.columns)
  },
  computed: {
    actionWidth: function () {
      return this.mate.actions.length * 60 + 30
    }
  },
  // 需要添加刷新消息
  methods: {
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    handleButton (btn) {
      var vm = this
      let row = (btn.isApi || btn.ajax || btn.edit) ? { id: this.multipleSelection.map((r) => r.id) } : {};
      let hasId = row.id && row.id.every(item => item === null);
      // 新增的时候不需要带上row，也不需要带上select前面的id
      if (btn.action === 'addDetailBill') {
        this.$emit('action', btn)
        return
      }
      // 修改的时候要带上select前面的id
      if (btn.action === 'updataDetailBill') {
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {};
        if (this.multipleSelection.length !== 1) { // 只能选择一行,不允许选择多行
          this.$message({
            message: this.$t('seladata'), // 请选择一行数据
            type: 'warning'
          })
          return;
        }
        this.$emit('action', btn, row)
        return
      }
      if(btn.action === 'delete' && hasId){
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {};
        this.$emit('action', btn, row, this.multipleSelection)
        return
      }
      if(btn.action === 'deleteDetailBill'){
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {};
        this.$emit('action', btn, row, this.multipleSelection)
        return
      }
      // 出库单据新增导入行
      if (btn.action === 'importLine') {
        this.uploadUrl = btn.url;
        this.uploadMethod = btn.method;
        this.$emit('action', btn);
        return
      }
      // 出库单据新增导出行
      if (btn.action === 'downloadLine') {
        this.$emit('action', btn)
        return
      }
      this.$root.handleAction(btn, row, function () {
        vm.getData()
      })
    },
    /**
     * 触发上传按钮点击事件 fileUpload()
     * 把数据保存到本地
     * @param {String} url 上传服务的 api 接口地址
     * @param {String} method 上传的方法
     * @param {Object} data 传给后台的数据
     * @return void
     */
    uploadBtnClick(data) {
      this.uploadData = data;
      this.$refs['selectFiles'].click();
    },
    /**
     * 请求上传/导入接口
     * 成功后把二进制流数据转成前端数据格式
     * @param {Object} data FormData数据
     * @return void
     */
    uploadFile(data) {
      let _this = this;
      this.$http({
        url: `${this.BASEAPI}${this.uploadUrl}`,
        method: this.uploadMethod  || 'POST',
        body: data,
        responseType: 'arraybuffer'
      }).then((res)=> {
        _this.$refs.selectFiles.value = '';
        // 处理二进制数据
        let byteArray = new Uint8Array(res.body);
        let blob = new Blob([byteArray]);
        let reader = new FileReader();
        reader.readAsText(blob);
        reader.onload = function(e){
          // 把数据转化为对象
          let res = JSON.parse(reader.result);
          // 保存任务行数据
          let data = res.data;
          // 如果数据异常 提示错误
          if(!data && res.code === 500){
            _this.$message({
              type:'error', 
              message: res.message || '数据异常,请检查数据'
            })
            return;
          }
          // 导入成功 刷新当前任务行的数据
          // _this.$emit('uploadSuccess', data)
          _this.mate.rows = data || [];
          _this.$message({
            type:'success', 
            message:`成功导入“ ${data.length} ”条任务`
          });
        }
      },(res)=> {
        _this.$refs.selectFiles.value = '';
        // 处理二进制数据
        let byteArray = new Uint8Array(res.body);
        let blob = new Blob([byteArray]);
        let reader = new FileReader();
        reader.readAsText(blob);
        reader.onload = function(e){
          // 把数据转化为对象
          let res = JSON.parse(reader.result);
          // 如果数据异常 提示错误
          if(res.code === 500){
            _this.$message({
              type:'error', 
              message: res.message || '数据异常,请检查数据'
            })
            return;
          }
        }
      })
    },
    /**
     * 上传文件/导入模板
     * 获取文件名称和后台所需参数 保存在 formData 中
     * 询问用户是否确认导入文件
     * 确认：调上传方法 uploadFile()
     * 取消：取消上传
     * @param {Object} file 上传文件参数
     * @return void
     */
    selectFiles(file) {
      let _this = this;
      let formData = new FormData();
      let fileData = file.target.files[0];
      let fileName = fileData.name || "所选文件";
      formData.append('file', fileData);
      if(this.uploadData && Object.keys(this.uploadData).length){
        Object.keys(this.uploadData).forEach((item)=>{
          formData.append(item,this.uploadData[item]);
        })
      } 
      this.$confirm(`此操作会覆盖已有数据，是否确定导入<<${fileName}>>?`, this.$t("TITLE_TEXT.TIPS"), {
        confirmButtonText: this.$t("BUTTON_TEXT.CONFIRM"),
        cancelButtonText: this.$t("BUTTON_TEXT.CANCEL"),
        type: "warning"
      }).then(() => {
        // 确认调上传方法
        this.uploadFile(formData);
      }).catch(() => {
        _this.$message({
          type: "info",
          message: this.$t("TIPS_WARNING.CANCEL_OPERATION")
        });
        _this.$refs.selectFiles.value = '';
      });
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
    },
    sortChange (sort) {
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
