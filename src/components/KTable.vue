<template>
<div>
  <Boxer :mate="mate" :hasSelected="hasSelected" @action="handleButton" ref="Boxer" :msgBoxButton="msgBoxButton">
    <div slot="searchForm" class="leftMargin">
      <el-button  size="mini" type="primary" class="el-icon-search" v-if="mate.mateSearch" @click="showSearchPopover">搜索</el-button>
    </div>
    <div slot="main">
      <div class="query" v-if="mate.mateSearch">
        <el-row :gutter="20" v-show="showAdvancedSearchPopover">
          <el-form :model="mate.mateSearch.values" :inline="mate.inline">
            <el-col :sm="6" :md="4" :lg="4">
              <el-select clearable v-model="mate.mateSearch.values['name']">
                <el-option :label="item.label" :value="item.value" v-for="item of titleOptions" :key="item.value"></el-option>
              </el-select>
            </el-col>
            <el-col :sm="6" :md="4" :lg="4">
              <el-select clearable v-model="mate.mateSearch.values['operator']">
                <el-option :label="item.label" :value="item.value" v-for="item of operatorOptions" :key="item.value"></el-option>
              </el-select>
            </el-col>
            <el-col :sm="6" :md="4" :lg="4">
              <el-input clearable v-model="mate.mateSearch.values['value']"></el-input>
            </el-col>
            <el-col :sm="6" :md="4" :lg="4">
              <el-button type="primary" @click="query" style="margin-left: 10px">查询</el-button>
            </el-col>
          </el-form>
        </el-row>
      </div>
      <el-row>
        <el-col :span="24">
          <el-table size="mini" highlight-current-row ref="table" :max-height="height" :data="mate.rows" border @selection-change="handleSelectionChange" @sort-change="sortChange" style="width: 100%;">
            <el-table-column fixed="left" type="selection" width="50" id="tableSel"></el-table-column>
            <template v-for="col of mate.columns" >
              <el-table-column v-if="col.blockHash" :formatter="col.formatter" v-bind:key="col.name" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top" v-show="scope.row.blockHash">
                    <p>区块哈希: {{ scope.row.blockHash }}</p>
                    <p>上链时间: {{ scope.row.updateAt }}</p>
                    <div slot="reference" class="name-wrapper">
                      <el-tag ><img src="../assets/imgs/ztree/ic_chain.png" style="width:13px; height:13px;margin:-2px 2px">{{ scope.row.name }}</el-tag>
                    </div>
                  </el-popover>
                  <span v-show="!scope.row.blockHash" >{{ scope.row.name }} </span>
                </template>
              </el-table-column>
            </template>
            <template v-for="col of mate.columns" >
              <el-table-column v-if="col.isShow" :formatter="col.formatter" v-bind:key="col.name" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip></el-table-column>
            </template>
            <el-table-column label="操作" fixed="right" :min-width="actionWidth" v-if="mate.actions && mate.rows">
              <template slot-scope="scope">
                <k-btn v-for="act of mate.actions" v-bind:key="act.action" size="mini" :act="act" :row="scope.row" @action="handleAction"></k-btn>
                <el-button size="mini" v-if="scope.row.auditStatus==='0' || scope.row.auditStatus==='1'" @click="audit(scope.row)">审核</el-button>
                <el-button size="mini" v-if="scope.row.auditStatus==='2'" @click="audit(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <input type="file" ref="excelFileBom"  style="display:none" @change="fileUploadBom"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
      <input type="file" ref="excelFile"  style="display:none" @change="fileUpload"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
      <input type="file" ref="selectFiles"  style="display:none" @change="selectFiles"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
      <el-row type="flex" justify="center" class="page" >
      <el-col :span="12" v-if="mate.page">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="mate.page"
            layout="total,prev, pager, next, sizes"
            :total="mate.total"
            :page-sizes ="[5, 10, 15, 20, 50, 100]"
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
  <el-dialog title="分配子公司" :visible.sync="dialogTableDim"    width="300px">
    <el-select
    v-model="childCompany"
    multiple
    filterable
    remote
    reserve-keyword
    placeholder="请输入关键词"
    :remote-method="remoteMethod"
    :loading="loading">
    <el-option
      v-for="item in companyOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
    <!-- <el-transfer   ref="dialogTransfer" :titles="['未选中子公司', '选中的子公司']"  filterable :filter-method="filterMethod" v-model="value1" :data="supplierOptions1"  class="dialogTransfer"> </el-transfer> -->
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="confirmDialog">确定</el-button>
      <el-button size="mini" @click="cancelDialog">取消</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script scope>
import SearchForm from './SearchForm'
import KBtn from './KBtn.vue'
import Boxer from './Boxer.vue'
import { API_GATEWAY } from '@/config/index.js'
import ColumnFormatterMixin from '../mixins/ColumnFormatterMixin'
import FilterMixins from '@/mixins/FilterMixins'
import SERVICES from '@/services';

export default {
  mixins: [ColumnFormatterMixin, FilterMixins],
  components: {
    SearchForm,
    KBtn,
    Boxer,
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
      default: 15
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
      fileuploadUrl: '',
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
      uploadUrl: '',
      uploadMethod: '',
      uploadData: {},
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
      this.hasSelected = (newSelection && newSelection.length !== 0)
    },
    mate: function (newMate) {
      this.formatterBefore(this.mate.columns)
      this.filterValues(this.mate.columns);
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
    this.filterValues(this.mate.columns)
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
    fileUpload (file) {
      var vm = this
      var formdata = new FormData()
      formdata.append('file', file.target.files[0])
      this.$http({
        url: API_GATEWAY + this.fileuploadUrl,
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
        url: API_GATEWAY + '/zuul/api/bom/import/bom',
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
    handleButton (btn) {
      var vm = this
      // 租户信息导入
      if (btn.action === 'importTenant') {
        this.fileuploadUrl = btn.url
        this.$refs.excelFile.click()
        this.title = '批量导入租户信息数据'
        return
      }
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

      if (btn.action === 'tenantList') {
        this.userType = 'tenant'
        this.$root.ajaxData(btn.url, {}, function (data) {
          vm.mate.rows = data.mate.rows
          vm.mate.total = data.mate.total
        }, 'GET')
        return
      }
      if (btn.action === 'officeList') {
        this.userType = 'office'
        this.$root.ajaxData(btn.url, {}, function (data) {
          vm.mate.rows = data.mate.rows
          vm.mate.total = data.mate.total
        }, 'GET')
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
      // BOM删除
      if (btn.action === 'deleteBom') {
        if (this.multipleSelection.length !== 1) {
          vm.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        }
        const row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$root.ajaxData(btn.url + '/' + row.id, {}, function (data) {
          vm.$root.ajaxData(vm.mate.dataApi, {}, function (data) {
            vm.mate.rows = data.mate.rows
          }, 'GET')
        }, 'DELETE')
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
      // 入库单据新增导入行
      if (btn.action === 'importLine') {
        this.uploadUrl = btn.url;
        this.uploadMethod = btn.method;
        this.$emit('action', btn);
        return
      }
      // 入库单据新增导出行
      if (btn.action === 'downloadLine') {
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
      if (btn.action === 'editLine') {
        this.$emit('action', btn)
        return
      }
      if (btn.action === 'deleteLine') {
        this.$emit('action', btn)
        return
      }
      // BOM 新增 行中的“复制自”按钮
      if (btn.action === 'copyTo') {
        this.$emit('action', btn)
        return
      }
      if (btn.action === 'deleteSequence') {
        if(this.multipleSelection.length>1) {
          vm.$message({
            message: '至多选择一条，才可以删除！',
            type: 'warning'
          });
          return;
        }
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$root.handleAction(btn, row, function () {
          vm.$root.monitor({ url: '/sys/seqno/list' })
        })
        return;
      }
      // 修改的时候要带上select前面的id
      if (btn.action === 'updataDetailBill') {
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$emit('action', btn, row)
        return
      }
      if (btn.action === 'report') {
        // this.mate.url = REPORT_SERVER_URL + btn.url + '&id=' + row.id
        //     this.$emit('route', 'FReport', this.mate)
        // return
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
      // 应收（供应商）生成结算单
      if (btn.action === 'GenerateStatementsRe') {
        row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        for (let i = 0; i < this.multipleSelection.length - 1; i++) {
          if (this.multipleSelection[i].ouName !== this.multipleSelection[i + 1].ouName ||
              this.multipleSelection[i].customerName !== this.multipleSelection[i + 1].customerName ||
              this.multipleSelection[i].salesPerson !== this.multipleSelection[i + 1].salesPerson ||
              this.multipleSelection[i].currencyCode !== this.multipleSelection[i + 1].currencyCode ||
              this.multipleSelection[i].custTrxType !== this.multipleSelection[i + 1].custTrxType ||
              this.multipleSelection[i].currencyCode !== this.multipleSelection[i + 1].currencyCode) {
            vm.$message({
              message: '请选择同一个业务实体、客户、销售员、币种、发票类型、付款条件',
              type: 'warning'
            })
            return
          }
        }
        // 需要跳转到一个编辑页面去
        vm.$root.monitor({ url: '/purchase/precast/receive/create/ar/settle?ids=' + row.id.join() })
        // this.$root.handleAction(btn, row, function () {})
        return
      }
      // 应付生成对账单???
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
        var element = this.mate.rows.find((i) => {
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
        if (!(this.multipleSelection[0].opStatus === 3 || this.multipleSelection[0].opStatus === 4)) {
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
      // bom下载模板
      if (btn.action === 'downLoadBom') {
        this.$http({
          url: API_GATEWAY + '/api/bom/download/tpl',
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
          var filename = 'BOM导入模板.xlsx'
          a.setAttribute('download', filename)
          a.click()
          URL.revokeObjectURL(objectUrl)
        })
        return
      }
      // Bom管理导入
      if (btn.action === 'importBom') {
        this.$refs.excelFileBom.click()
        this.title = '导入Bom'
        return
      }
      // 租户管理 下载收费租户模板
      if (btn.action === 'downloadTemplate'){
        let [url, methods, fileName, type, data] = [ btn.url, 'POST', '收费租户模板', 'xlsx', {}];
        SERVICES.BASE.downTemplateExcel(url, methods, fileName, type, data);
        return
      }
      // 租户管理 导入收费租户信息
      if (btn.action === 'import'){
        this.fileuploadUrl = btn.url
        this.$refs.excelFile.click()
        this.title = '批量导入收费租户数据'
        return
      }
      this.$root.handleAction(btn, row, function () {
        vm.getData()
      });
    },
    rowSelect () {
      if (this.mate.rows) {
        this.mate.rows.forEach(row => {
          /* eslint-disable */
          let select = (row.id && this.mate.selected && this.mate.selected.findIndex(id => id == row.id) !== -1)
          /* eslint-enable */
          this.$refs.table.toggleRowSelection(row, (select === true))
        });
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
      // 汇率删除
      if (act.action == 'deleteExchange') {
        this.$root.ajaxData(act.url + '/' + row.id, {}, function (data) {
          vm.$root.ajaxData(vm.mate.dataApi, {}, function (data) {
            vm.mate.rows = data.mate.rows
          }, 'GET')
        }, 'DELETE')
        return
      } else if (act.action === 'deleteCurrency') { // 币种删除
        this.$root.ajaxData(act.url + '/' + row.id, {}, function (data) {
          vm.$root.ajaxData(vm.mate.dataApi, {}, function (data) {
            vm.mate.rows = data.mate.rows
          }, 'GET')
        }, 'DELETE')
        return
      } else if (act.actionEmit === 'actionEmit') { // 在采购模块中的分段价格
        this.$emit('handleAction', act, row)
        return true
      } else if (act.action === 'edit') {
        this.$root.monitor({ url: act.url + '&tenantId=' + row.tenantId + '&name=' + row.name })

        // this.$root.monitor({ url: act.url + row.id })
        return
      } else if (act.action === 'editBill') {
        this.$root.monitor({ url: act.url + row.id })
        return
        // 库存组织生效
      } else if (act.action === 'shengxiao') {
        vm = this
        if (row.status === '0') {
          this.$root.ajaxData('/org/inventory/updateStatus?id=' + row.id + '&status=1', {}, function (data) {
            vm.$root.ajaxData(vm.mate.dataApi, {}, function (data) {
              vm.mate.rows = data.mate.rows
            }, 'GET')
          }, 'PUT')
          return
        } else {
          this.$root.ajaxData('/org/inventory/updateStatus?id=' + row.id + '&status=0', {}, function (data) {
            vm.$root.ajaxData(vm.mate.dataApi, {}, function (data) {
              vm.mate.rows = data.mate.rows
            }, 'GET')
          }, 'PUT')
          return
        }
         // 库存组织失效
      } else if (act.action === 'distributionCom'){
        // 租户管理 分配子公司
        this.$root.ajaxData(act.url + row.id,{},function (data) {
          if(data.data.length){
              vm.childCompany = data.data
            } else {
              vm.childCompany = []
            }
        }, 'GET')
        this.dialogTableDim = true
        this.rowId = row.id
        return
      } else if (act.action === 'replacementMaterial') {
        this.$emit('replacementMaterialAction', act, row);
        return;
      } else if (act.action === 'updateDetailBill') { // 采购订单行修改
        this.$emit('action', act, row);
        return;
      }else {
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
