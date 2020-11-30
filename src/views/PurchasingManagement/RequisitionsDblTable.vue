<!-- 请购单转采购订单 -->
<template>
  <div>
    <Boxer :mate="mate.mateList" :mateSearch="mate.mateSearch" :hasSelected="hasSelected" @action="handleButton" ref="Boxer" :msgBoxButton="msgBoxButton">
      <span slot="searchForm" class="leftMargin">
        <el-button  size="mini" type="primary" class="el-icon-search" @click="showSearchPopover">搜索</el-button>
      </span>
      <div slot="main">
        <div class="query" >
          <multiple-query :mate="mate" :inline="mate.inline" v-if="mate.mateSearch" v-show="showAdvancedSearchPopover" @queryData="queryData"></multiple-query>
        </div>
        <el-row>
          <el-table size="mini" max-height="500" highlight-current-row  ref="table" :data="mate.mateList.rows" border @selection-change="handleSelectionChange" @sort-change="sortChange" style="width: 100%;">
            <el-table-column type="selection" width="50"></el-table-column>
            <template v-for="(col,index) of mate.mateList.columns" >
              <el-table-column v-if="col.isShow" :key="col.name+index" :formatter="col.formatter" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip></el-table-column>
            </template>
            <el-table-column  fixed="right" label="操作" :width="actionWidth" v-if="mate.mateList.actions">
              <template slot-scope="scope">
                <k-btn v-for="act of mate.mateList.actions" :key="act.action" size="mini" :act="act" :icon="act.icon" :row="scope.row" @action="confirm"></k-btn>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row type="flex" justify="center" class="page">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="mate.mateList.page"
              layout="total, prev, pager, next, sizes"
              :total="mate.mateList.total"
              :page-sizes ="[5,10,15,20,30]"
              :page-size="pageSize">
          </el-pagination>
        </el-row>
      </div>
    </Boxer>
  <!--下面的明细表格-->
  <template>
    <div class="detailLine">
    </div>
    </template>

      <el-dialog title="分配供应商" :visible.sync="dialogPus" :close-on-click-modal="false" :show-close="false" width="60%">
        <el-form :model="mate.mateFormerHeader.values" :inline="mate.inline" :label-position="labelPosition" :label-width="labelWidth" :rules="pusRules" ref="pusForm">
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['officeId'].label" prop="officeId">
              <el-select v-model="mate.mateFormerHeader.values['officeId']" disabled>
                  <el-option :label="item.label" :value="item.value" v-for="(item, index) of officeIdOptions" :key="index"></el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['supplierId'].label" prop="supplierId">
              <el-select v-model="mate.mateFormerHeader.values['supplierId']" @change="changeSupplier">
                  <el-option :label="item.label" :value="item.value" v-for="(item, index) of supplierOptions" :key="index"></el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['address'].label" prop="address">
              <el-select v-model="mate.mateFormerHeader.values['address']" @change="changeAddress">
                  <el-option :label="item.label" :value="item.value" v-for="(item, index) of addressOptions" :key="index"></el-option>
                </el-select>
            </el-form-item>
          </el-col>
        </el-form>
        <div slot="footer" class="dialog-footer" style="margin-top:30px">
           <el-button size="small" type="primary" @click="DialogPusClickOK('pusForm')">确 定</el-button>
           <el-button size="small" @click="cancelPus" >取 消</el-button>
        </div>
      </el-dialog>

      <el-dialog title="填写以下信息后将您的需求信息发送至交易大厅" :visible.sync="dialogReqiredForm" width="50%">
        <el-form size="mini" :model="mate.mateFormer.values" :inline="mate.inline" label-position="right" ref="ruleForm" :rules="rules" :label-width="labelWidth">
          <el-row>
            <el-col :span="10">
                <el-form-item label="物料名称" >
                <el-input readonly v-model="mate.mateFormer.values['name']"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item  :label="object['validDate'].label" :prop="object['validDate'].name">
                <el-col :span="8">
                  <el-date-picker type="date" v-model="mate.mateFormer.values['upDate']" placeholder="开始时间"></el-date-picker>
                </el-col>
                <el-col :span="4">
                  <span style="margin-left: 40px;"> 至 </span>
                </el-col>
                <el-col :span="8">
                  <el-date-picker type="date" v-model="mate.mateFormer.values['downDate']" placeholder="结束时间"></el-date-picker>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item :label="object['receiveAddress'].label" :prop="object['receiveAddress'].name">
                <el-input v-model="mate.mateFormer.values['receiveAddress']"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="10">
              <el-form-item :label="object['catgIds'].label" :prop="object['catgIds'].name">
                <el-cascader
                  clearable
                  filterable
                  change-on-select
                  :options="catgOption"
                  v-model="mate.mateFormer.values['catgIds']"
                  separator="-"
                  @change="handleChange(mate.mateFormer.values['catgIds'])">
                </el-cascader>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="20">
              <el-form-item :label="object['invoiceRequest'].label" :prop="object['invoiceRequest'].name">
                <el-radio-group v-model="mate.mateFormer.values['invoiceRequest']" size="mini">
                    <el-radio label="1" >增值税专用发票</el-radio>
                    <el-radio label="2" >增值税普通发票</el-radio>
                    <el-radio label="3" >不要发票</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="20">
              <el-form-item :label="object['detail'].label" :prop="object['detail'].name">
                <div class="edit_container">
                      <quill-editor v-model="mate.mateFormer.values['detail']"
                          ref="myQuillEditor"
                          class="editer"
                          :headers="headers"
                            :options="editorOption" @ready="onEditorReady($event)">
                  </quill-editor>
                    <el-upload class="upload-demo" :action="qnLocation" :before-upload='beforeUploadDetial' :data="uploadData" :on-success='upScuccess'
                      :headers="headers" ref="uploadDetial" >
                      <el-button size="mini" id="imgInput" style="display:none">点击上传</el-button>
                    </el-upload>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="20">
              <el-form-item :label="object['imgPath'].label" :prop="object['imgPath'].name">
                <el-upload
                  ref="upload"
                  :action="fileuploadUrl"
                  :on-preview="handlePreview"
                  :headers="headers"
                  :on-remove="handleRemove"
                  :on-success="handleSuccess"
                  :file-list="fileList"
                  :before-upload="beforeAvatarUpload">
                  <el-button size="mini" >上传附件</el-button>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="20">
              <el-form-item :label="object['askQuote'].label" :prop="object['askQuote'].name">
                <el-radio-group v-model="mate.mateFormer.values['askQuote']" size="mini">
                    <el-radio label="1" >是</el-radio>
                    <el-radio label="2" >否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="20">
              <el-form-item :label="object['contactWay'].label" :prop="object['contactWay'].name">
                <el-radio-group v-model="mate.mateFormer.values['contactWay']" size="mini">
                    <el-radio label="1" >报价后可见</el-radio>
                    <el-radio label="2" >授权后可见</el-radio>
                    <el-radio label="3" >公开</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row>
            <el-col :span="10">
              <el-form-item :label="object['contactor'].label" :prop="object['contactor'].name">
                <el-input v-model="mate.mateFormer.values['contactor']"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="10">
              <el-form-item :label="object['contactPhone'].label" :prop="object['contactPhone'].name">
                <el-input v-model="mate.mateFormer.values['contactPhone']"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="qbutton">
          <el-button @click="dialogBack" >取 消</el-button>
          <el-button @click="submit">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="提示" :visible.sync="visiblePrompt" width="30%">
        <span>需求已成功发布至交易大厅！</span>
        <div class="qbutton">
          <el-button @click="toLook" >去交易大厅看看</el-button>
          <el-button @click="submitPrompt">确 定</el-button>
        </div>
      </el-dialog>

  </div>
</template>

<script>
import { DateFormat, debounce } from '../../utils/util.js'
import { quillEditor } from 'vue-quill-editor' // 调用编辑器
import KBtn from '../../components/KBtn.vue'
import { API_GATEWAY, tradeHallUrl } from '@/config/index.js'
import Boxer from '../../components/Boxer.vue'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
import MultipleQuery from '@/components/query/MultipleQueryForm'
import QueryMixins from '../../mixins/QueryMixins'

export default {
  mixins: [ColumnFormatterMixin, QueryMixins],
  components: {
    KBtn,
    Boxer,
    quillEditor,
    MultipleQuery,
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
  computed: {
    actionWidth: function () {
      return this.mate.mateList.actions.length * 60 + 30
    },
     // a computed getter
    labelWidth: function () {
      let width = ''
      if (this.mate.inline) {
        // width = undefined
        width = '100px'
      } else if (typeof (this.mate.labelWidth) === 'undefined') {
        width = '100px'
      } else {
        width = this.mate.labelWidth
      }
      return width
    }
  },
  data () {
    return {
      fileName: '',
      copyPath: '',
      fileList: [],
      catgOption: [],
      showAdvancedSearchPopover: false,
      pageSize: 5,
      editorOption: {},
      uploadData: {},
      dialogReqiredForm: false,
      visiblePrompt: false,
      multipleSelection: [],     // 点击table前面的框框，获取到的内容
      hasSelected: false,
      showBtn: true,
      showForm: false,
      searchValues: {},
      contactOptions: [],
      labelPosition: 'right',
      page: 0,
      sortValues: {},
      status: '',
      action: null,
      dialogTableVisible: false,          // dialog开关
      object: {},                          // 放columns
      dialogVisible: false,
      dialogFormVisible: false,
      dialogUpdateVisible: false,
      materialStatus: true,
      dialogPus: false,
      supplierData: [],
      supplierOptions: [],
      officeIdOptions: [],
      addressOptions: [],
      addressName: '',
      supplierName: '',
      cause: '',
      rowId: {},             // 点击table前面的框框
      rowsContent: [],              // 获取到明细行中的数据
      lineSelected: [],               // 存放全部的label
      lineSelectedDetail: [],         // 存放全部的明细行label
      msgBoxButton: true,
      dialogDetailLine: false,
      qnLocation: `${API_GATEWAY}/zuul/api/purchase/goods/release/upload`,
      fileuploadUrl: `${API_GATEWAY}/zuul/api/purchase//goods/release/upload?trade=trade`,
      headers: {
        'Authorization': `Bearer ${window.sessionStorage.getItem('token')}`,
        'Accept': 'application/json',
        'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId
      },
      rules: {
        // validDate: [
        //   { required: true, message: '该输入项为必输项', trigger: 'blur' },
        // ],
        receiveAddress: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        catgIds: [
          { required: true, message: '该输入项为必输项', trigger: 'blur', type: 'array' }
        ],
        invoiceRequest: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        askQuote: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        contactWay: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        contactor: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        contactPhone: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ]
      },
      pusRules: {
        officeId: [
          { required: true, message: '该输入项为必输项', trigger: 'change', disabled: true }
        ],
        supplierId: [
          { required: true, message: '该输入项为必输项', trigger: 'change'}
        ],
        address: [
          { required: true, message: '该输入项为必输项', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    multipleSelection: function (newSelection) {
      this.hasSelected = (newSelection.length !== 0)
    },
    mate: function (newMate) {
      this.formatterBefore(this.mate.mateList.columns)
      this.rowsContent = this.mate.mateList.rows
      this.mate.mateList.localName = this.mate.localName
      this.mate.mateFormerHeader.fields.map((i) => { this.object[i.name] = i })
      this.mate.mateFormer.fields.map((i) => { this.object[i.name] = i })
      this.$nextTick(function () {
        this.rowSelect()
      })
    }
  },
  created () {
    this.mate.mateSearch.fields.map((i) => { this.object[i.name] = i })
    this.titleOptions = this.mate.mateSearch.fields[0].options
    this.operatorOptions = this.mate.mateSearch.fields[1].options
    const vm = this
    this.$root.ajaxData('/purchase/th/goods/getCategoryTree', {}, function (data) {
      vm.catgChange(data)
      vm.catgOption = data
    }, 'GET')
    this.formatterBefore(this.mate.mateList.columns)
    this.rowsContent = this.mate.mateList.rows
    this.mate.mateList.localName = this.mate.localName
    this.mate.mateFormerHeader.fields.map((i) => { this.object[i.name] = i })
    this.mate.mateFormer.fields.map((i) => { this.object[i.name] = i })
    // 获取合格供应商
    this.$root.ajaxData('/purchase/qualified/supplier/getQualifySupplier', {}, function (data) {
      for (let i = 0; i < data.length; i++) {
        vm.supplierData = data
        vm.supplierOptions.push({ 'label': data[i].name, 'value': data[i].id })
      }
    }, 'GET')
    // 获取库存组织
    this.$root.ajaxData('/users/office', {}, function (data) {
      data.forEach(i => {
        vm.officeIdOptions.push({ 'label': i.orgName, 'value': i.officeId })
            // 只有一个机构，就将机构放进去
      })
    }, 'GET')
  },
  updated () {
    if (this.$refs.myQuillEditor) {
      this.$nextTick(function () {
        this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('image', this.imgHandler)
      })
    }
  },
  mounted () {
    // 为图片ICON绑定事件  getModule 为编辑器的内部属性
    // this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('image', this.imgHandler)
    this.rowSelect()
  },
  // 需要添加刷新消息
  methods: {
    query () {
      const mate = [this.mate.mateSearch.values]
      const vm = this
      const url = this.mate.mateSearch.url
      this.$root.ajaxData(url, mate, function (data) {
        vm.mate.mateList.rows = data.mate.rows
        vm.mate.mateList.total = data.mate.total
      }, 'POST')
    },
    handleChange () {
    },
    beforeAvatarUpload (file) {
      this.fileName = file.name
    },
    handleSuccess (response, file, fileList) {
      this.imgRoot = ''
      for (var i = 0; i < fileList.length; i++) {
        this.imgRoot += fileList[i].response + ','
        var root = ''
        root = this.imgRoot.substring(0, this.imgRoot.length - 1)
        this.mate.mateFormer.values.imgPath = root
      }
    },
    handlePreview (file) {
    },
    // handleRemove (file) {
    //   // 上传删除
    //   this.$root.ajaxData('/file?path=' + this.copyPath, {}, function () {}, 'DELETE')
    //   this.copyPath = ''
    // },
    handleRemove (file, fileList) {
      this.imgRemoveRoot = ''
      for (var i = 0; i < fileList.length; i++) {
        this.imgRemoveRoot += fileList[i].response + ','
        var root = ''
        root = this.imgRemoveRoot.substring(0, this.imgRemoveRoot.length - 1)
      }
      this.mate.mateFormer.values.imgPath = root
    },
    catgChange (data) {
      for (const i of data) {
        i.label = i.name
        i.value = i.id
        if (i.children) {
          this.catgChange(i.children)
        }
      }
    },
    imgHandler (state) {
      this.addRange = this.$refs.myQuillEditor.quill.getSelection()
      if (state) {
        const fileInput = document.getElementById('imgInput')
        fileInput.click() // 加一个触发事件
      }
      this.uploadType = 'image'
    },
    beforeUploadDetial (file) {
      // 图片上传之前调取的函数
      return this.qnUpload(file)
    },
    qnUpload (file) {
      this.fullscreenLoading = true
      const suffix = file.name.split('.')
      const ext = suffix.splice(suffix.length - 1, 1)[0]
      if (this.uploadType === 'image') {  // 如果是点击插入图片
        this.uploadData = {
          key: `image/${suffix.join('.')}_${new Date().getTime()}.${ext}`
        }
      }
    },
    upScuccess (e, file, fileList) {
      this.fullscreenLoading = false
      const vm = this
      let url = ''
      if (this.uploadType === 'image') {    // 获得文件上传后的URL地址
        url = e
      }
      if (url != null && url.length > 0) {  // 将文件上传后的URL地址插入到编辑器文本中
        let value = url
        vm.addRange = vm.$refs.myQuillEditor.quill.getSelection()
        value = value.indexOf('http') !== -1 ? value : 'http:' + value
        vm.$refs.myQuillEditor.quill.insertEmbed(vm.addRange !== null ? vm.addRange.index : 0, vm.uploadType, value, 'image')   // 调用编辑器的 insertEmbed 方法，插入URL
      }
      this.$refs['uploadDetial'].clearFiles()    // 插入成功后清除input的内容
    },
    onEditorReady () {
    },
    submit () {
      var vm = this
      var mate = {}
      if(this.mate.mateFormer.values.downDate == null){
        vm.$notify.error({
          title: '消息',
          message: '请填写信息有效期的结束时间'
        })
        return false;
      }
      if(this.mate.mateFormer.values.downDate <new Date() || this.mate.mateFormer.values.upDate <new Date() 
      || this.mate.mateFormer.values.downDate <this.mate.mateFormer.values.upDate){
        vm.$notify.error({
          title: '消息',
          message: '请正确填写信息有效期'
        })
        return false;
      }
      this.mate.mateFormer.values.upDate = DateFormat(this.mate.mateFormer.values.upDate, 'yyyy-MM-dd')
      this.mate.mateFormer.values.downDate = DateFormat(this.mate.mateFormer.values.downDate, 'yyyy-MM-dd')
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          mate = this.mate.mateFormer.values
          var catgEnd = vm.mate.mateFormer.values['catgIds'][vm.mate.mateFormer.values['catgIds'].length - 1]
          mate.catgId = catgEnd
          // var rows = this.multipleSelection
          this.$root.ajaxData('/purchase/reqPurchase/published/goods/' + this.multipleSelection[0].id, mate, function (data) {
            if (data.statusCode === 200) {
              vm.dialogReqiredForm = false
              vm.visiblePrompt = true
              vm.mate.mateFormer.values = {}
            } else {
              vm.$notify.error({
                title: '消息',
                message: '数据验证未通过'
              })
            }
          }, 'POST')
        } else {
          this.$notify.error({
            title: '消息',
            message: '数据验证未通过'
          })
          return false
        }
      })
    },
    cancelPus () {
      this.dialogPus = false
      this.materialStatus = true
    },
    /** 分配供应商确认
     * @param {String} formname 表单 ref
     * @return void
     */
    DialogPusClickOK (formname) {
      const vm = this;
      let paramArr = [];
      let rowId = this.multipleSelection.map((r) => r.id);
      let mateFormerHeaderValues = this.mate.mateFormerHeader.values;
      this.$refs['pusForm'].validate((valid) => {
        if (valid) {
          for (var i = 0; i < this.multipleSelection.length; i++) {
            if (this.status === '2') {
              var param = this.multipleSelection[i]
              param.supplierId = mateFormerHeaderValues.supplierId
              param.supplierName = this.supplierName
              param.address = this.addressName
            } else if (this.status === '1') {
              vm.$message({
                message: '不属于同一定价单',
                type: 'warning'
              })
              return
            } else if (this.status === '3') {
              vm.$message({
                message: '一行或多行的物料不是供应商的批准物料',
                type: 'warning'
              })
              return
            }
          }
          this.savePus(rowId, mateFormerHeaderValues.supplierId, this.addressName);
        }
      })
    },
    /** 更新请购单供应商
     * 
     */
    savePus(rowId, supplierId, address){
      this.$root.ajaxData(`/purchase/reqPurchase/pre/gen?ids=${rowId}&supplierId=${supplierId}&address=${address}`, {}, data => {
        if(data.statusCode === 200){
          this.cancelPus();
          this.refreshList();
        }
      }, 'GET')
    },
    dialogBack () {
      this.dialogReqiredForm = false
    },
    submitPrompt () {
      this.visiblePrompt = false
      this.mate.mateFormer.values = {}
    },
    toLook () {
      this.dialogReqiredForm = false
      this.visiblePrompt = true
      window.open(tradeHallUrl)
    },
    confirm (act, row) {
      var vm = this
      if (act.action === 'addChild') {
        this.mate.mateFormerHeader.values = row
        this.dialogVisible = true
        return false
      }
    },
    back () {
      this.dialogTableVisible = false
    },
    // 根据地点获取联系人
    changeAddress (val) {
      var vm = this
      vm.contactOptions = []
      if (val) {
        for (var i = 0; i < this.addressOptions.length; i++) {
          if (val === this.addressOptions[i].value) {
            this.addressName = this.addressOptions[i].label
          }
        }
        var row = this.multipleSelection.map((r) => r.materialId)
        this.$root.ajaxData('/purchase/qualified/supplier/checkMaterials?ids=' + row + '&supplierId=' + this.mate.mateFormerHeader.values.supplierId + '&address=' + this.addressName + '&officeId=' + this.mate.mateFormerHeader.values.officeId, {}, function (data) {
          if (data.statusCode === 40020) {
            vm.$message({
              message: '一行或多行的物料没有维护合格供应商',
              type: 'warning'
            })
            vm.status = '3'
            return
          } else if (data.statusCode === 40034) {
            vm.$message({
              message: '不属于同一定价单',
              type: 'warning'
            })
            vm.status = '1'
            return
          } else {
            vm.status = '2'
          }
        }, 'GET')
      }
    },
    showSearchPopover () {
      this.showAdvancedSearchPopover = !this.showAdvancedSearchPopover
    },
    // 根据供应商找地点
    changeSupplier (val) {
      var vm = this
      vm.addressOptions = []
      this.mate.mateFormerHeader.values['address'] = '';
      for (let i = 0; i < this.supplierData.length; i++) {
        if (val === this.supplierData[i].id) {
          this.supplierName = this.supplierData[i].name;
          if (this.supplierData[i].addressList.length === 0) {
            vm.$message({
              message: '请维护供应商信息',
              type: 'warning'
            })
          } else {
            for (let j = 0; j < this.supplierData[i].addressList.length; j++) {
              vm.addressOptions.push({ 'label': this.supplierData[i].addressList[j].name, 'value': this.supplierData[i].addressList[j].id })
            }
          }
        }
      }
    },
    handleButton (btn) {
      const vm = this
      const row = (btn.isApi || btn.ajax) ? { id: this.multipleSelection.map((r) => r.id) } : {}
      this.rowId = row
      let multipleSelection = this.multipleSelection;
      let { orgId,officeId,supplierId,address } = multipleSelection[0];
      let isSameOrg,isSameOffice,isSameSupplier,isSameAddress;
      isSameOrg = multipleSelection.every(item => item.orgId === orgId);
      isSameOffice = multipleSelection.every(item => item.officeId === officeId);
      isSameSupplier = multipleSelection.every(item => item.supplierId === supplierId);
      isSameAddress = multipleSelection.every(item => item.address === address);
      if (btn.action === 'addPur') { // 生成采购订单
        let rowId = multipleSelection.map((r) => r.materialId);
        if(!isSameOrg){
          this.$message({
            message: '请选择同一收货组织的请购单',
            type: 'warning'
          })
          return
        }else if(!isSameOffice){
          this.$message({
            message: '请选择同一机构的请购单',
            type: 'warning'
          })
          return
        }else if(!isSameSupplier || (supplierId == '' || supplierId == null)){
          if(supplierId == '' || supplierId == null){
            this.$message({
              message: '请分配供应商',
              type: 'warning'
            })
          }else{
            this.$message({
              message: '请选择同一供应商的请购单',
              type: 'warning'
            })
          }
          return
        }else if(!isSameAddress || (address == '' || address == null)){
          vm.$message({
            message: '请选择同一地点的请购单',
            type: 'warning'
          })
          return
        }
        debounce(() => {
          this.$root.ajaxData(`/purchase/qualified/supplier/checkMaterials?ids=${rowId}&supplierId=${supplierId}&address=${address}&officeId=${officeId}`, {}, function (data) {
            if (data.statusCode === 40020) {
              vm.$message({
                message: '一行或多行的物料没有维护合格供应商',
                type: 'warning'
              })
              vm.status = '3'
              return
            } else if (data.statusCode === 40034) {
              vm.$message({
                message: '不属于同一定价单',
                type: 'warning'
              })
              vm.status = '1'
              return
            } else {
              vm.status = '2'
              vm.genPurchaseOrder();
              return
            }
          }, 'GET')
        },1500)
        return
      }else if(btn.action === 'assignSuppliers'){ // 分配供应商
        let multipleSelection = this.multipleSelection;
        // 只允许修改勾选项的供应商全为空的订单
        if(isSameOffice){
          this.dialogPus = true;
          this.mate.mateFormerHeader.values = {
            officeId: this.multipleSelection[0]['officeId'],
            supplierId: '',
            address: ''
          }
          this.$nextTick(() =>{
            this.$refs['pusForm'].clearValidate();
          })
          return
        }else{
          this.$message({
            message: `请选择同一机构的请购单`,
            type: 'warning'
          })
          return
        }
      }else if (btn.action === 'postDemand') { // 发布
        if (this.multipleSelection.length !== 1) {
          vm.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        }
        //判断发布商品时如果选择的数据的供应商信息不为空，则提示不能发布
        if(this.multipleSelection[0].supplierName !== null){
           vm.$message({
            message: '该请购单已有供应商信息，无需发布到交易大厅',
            type: 'warning'
          })
          return
        }
        this.$root.ajaxData('/org/inventory/all?dataOnly=true&name=' + this.multipleSelection[0].orgName, {}, function (data) {
          vm.$set(vm.mate.mateFormer.values, 'receiveAddress', data[0].receiveDetailAddress)
          vm.$refs.upload.clearFiles()
        }, 'GET')
        this.mate.mateFormer.values = {}
        var myDate = new Date()
        this.$set(this.mate.mateFormer.values, 'name', this.multipleSelection[0].materialName)
        this.$set(this.mate.mateFormer.values, 'upDate', DateFormat(myDate, 'yyyy-MM-dd'))
        this.$set(this.mate.mateFormer.values, 'invoiceRequest', '1')
        this.$set(this.mate.mateFormer.values, 'askQuote', '1')
        this.$set(this.mate.mateFormer.values, 'contactWay', '1')
        this.dialogReqiredForm = true
        return
      }
      this.$root.handleAction(btn, row, function () {
        vm.getData()
      })
    },
    genPurchaseOrder(data, callback){
      data = data || this.multipleSelection;
      this.$root.ajaxData('/purchase/reqPurchase/genPurchaseOrder', (data || {}), data => {
        if (data.statusCode === 40017) {
          this.$message({
            message: '已生成采购订单',
            type: 'warning'
          })
          return
        } else {
          if(callback) callback();
          this.refreshList();
        }
      }, 'POST')
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
      let url = this.mate.mateList.dataApi
      let param = {
        search: this.searchValues,
        page: this.page,
        sort: this.sortValues
      }
      var vm = this
      // + 'businessType=true&'
      if (flag && url.indexOf('?') === -1) {
        url += '-q?' + 'search=' + encodeURIComponent(JSON.stringify(this.searchValues)) + '&' + (this.toUriParams(this.sortValues)) + '&pageNum=' + this.page + '&pageSize=' + this.pageSize
        param = null
      } else if (flag && url.indexOf('?') !== -1) {
        url += '&search=' + encodeURIComponent(JSON.stringify(this.searchValues)) + '&' + (this.toUriParams(this.sortValues)) + '&pageNum=' + this.page + '&pageSize=' + this.pageSize
        param = null
      }
      this.$root.ajaxData(url, param, function (data) {
        vm.updateData(data)
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
    search (data) {
      this.$emit('actionSearch', data)
      this.searchValues = data
      this.page = 0
      // this.getData('search')
    },
    todoEssearch (data) {
      // this.$emit('essearch', data)
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
    },
    refreshList(){
      this.$root.monitor({ url: '/purchase/reqPurchase/genPurchase' });
    }
  }
}
</script>

<style lang="scss" scoped>
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
    float: left;
    margin-left: 10px;
  }
  // .leftFloat form{
  //   float: left;
  //   display:inline-block;
  // }
  // .leftFloat div{
  //   float: left;
  //   display:inline-block;
  //   width:250px;
  //   height:38px;
  //   margin:0px 15px 0 0;
  // }
  .button{
    margin-top:10px;
  }
  .el-form-item {
    margin: 10px 10px 2px 0px;
  }
  .checkboxClass{
    width: 30%;
    padding-bottom: 10px;
    box-sizing: border-box;
    margin-left: 15px;
  }
  .select-button{
    margin-top: 20px;
  }
  .detailLine{
    position: relative;
  }
  .definedLine{
    position: absolute;
    right: 0px;
  }
  .tableTop{
    position: absolute;
    margin-bottom: 50px;
  }
  .el-table td, .el-table th {
    height: 30px;
  }
  .detailTable{
    margin-top: 40px;
  }
  .qbutton{
    margin: 10px 0 5px;
    button {
      padding: 7px 15px;
      background-color: #fff;
      cursor: pointer;
    }
  }
  .el-dialog__header {
    padding: 10px 10px 0;
  }
  .el-dialog__body {
    padding: 10px 10px;
  }
</style>
