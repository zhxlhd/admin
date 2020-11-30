<!-- created by fengjing on 2020/05/13 -->
<!-- 商品发布 goodsRelease -->
<template>
  <div id="good_list">
    <k-table-list ref="listTable" 
      :mate="mate" 
      :mateSearch="mate.mateSearch" 
      :isIndex="isIndex"
      :isIndexDialog="isIndexDialog"
      :formModel="formModel"
      :word="word"
      :querySize="querySize"
      :isShowSearchBtn="false"
      @initQueryData="convertData"
      @uploadSuccess="uploadSuccess"
      @btnClick="handleButtons" 
      @action="handleActions"
      @rowClick="rowClick"
    ></k-table-list>
    <input type="file" multiple="multiple" ref="selectFiles"  style="display:none" @change="selectFiles"  accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">
    <el-dialog :visible.sync="goodsDialog" width="80%" :title="goodsTitle" :before-close="beforeClose">
       <div>
        <h-btn @click="handleBtns" :btns="['保存','取消']"></h-btn>
       </div>
        <!-- 头部button End-->
        <!-- 头部Form Start-->
        <el-button type="text" style="margin-left:5%">商品基本信息</el-button>
        <DynamicForm ref="headForm" :mate="mate.mateFormerHeader" :rules="headerFormRules" :eventCfg="headerFormEventConfig" @events="handleEvents"></DynamicForm>
        <el-form :model="mate.mateFormerHeader.values"  :label-width="labelWidth" ref="detailForm">
            <el-row >
                <div v-for="(field,index) of mate.mateFormerHeader.fields" :key="index">
                     <el-col  :lg="field.lg || 24" v-if="field && field.isRender && field.holder === 'img'" :key="field.name">
                        <el-form-item  :prop="field.name" :label="field.label">
                            <el-upload
                                :action="imgAction"
                                list-type="picture-card"
                                :headers="headers"
                                :file-list="imgFileList"
                                :on-change="handleImgChang"
                                :on-remove="handleImgRemove"
                                 :limit="10"
                                :on-exceed="handleImgExceed"
                                :accept="uploadType"
                                >
                                <i class="el-icon-plus"></i>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </div>
                </el-row> 
            <el-button type="text" style="margin-left:5%" >商品说明</el-button>
            <el-row >
                <div v-for="(field,index) of mate.mateFormerHeader.fields" :key="index">
                    <el-col  v-if="field && field.isRender && field.holder === 'deprection'" :key="field.name">
                        <el-form-item >
                            <quill-editor v-model="mate.mateFormerHeader.values.description"
                                ref="myQuillEditor"
                                class="editer"
                                :headers="headers"
                               >
                            </quill-editor>
                        </el-form-item>
                    </el-col>
                </div>
            </el-row>
            <el-button type="text" style="margin-left:5%" >商品附件</el-button>
             <el-row >
                <div v-for="(field,index) of mate.mateFormerHeader.fields" :key="index">
                    <el-col  v-if="field && field.isRender && field.holder === 'attachment'" :key="field.name">
                        <el-form-item >
                            <el-upload
                                class="upload-demo"
                                :action="attachmentAction"
                                multiple
                                :headers="headers"
                                :show-file-list="false"
                                :on-change="handleAttachmentChang"
                                :file-list="fileList">
                                <el-button size="mini" type="primary">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">单个附件最大支持5M,支持格式PDF，Word，Txt，JPG，PNG，BMP，GIF，RAR，ZIP</div>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </div>
            </el-row>
            <el-row>
              <el-table v-if="fileList.length>0" :data="fileList"  max-height="300" border align="center" size="mini" ref="multipleTable"  show-overflow-tooltip  style="width: 100%" >
                <el-table-column show-overflow-tooltip label="序号"  prop="lineNum"></el-table-column>
                <el-table-column show-overflow-tooltip label="名字"  prop="name"></el-table-column>
                <el-table-column show-overflow-tooltip label="操作">
                  <template slot-scope="scope">
                    <el-button size="mini"  type="primary" @click="viewFile(scope.row.response)">查看</el-button>
                    <el-button size="mini" type="danger" @click="deleteFile(scope.row.lineNum)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
        </el-form>
    </el-dialog>
  </div>
</template>

<script>
import SERVICES from '@/services';
import { LANGS } from '../../i18n/lang';
import { API_GATEWAY } from '@/config/index.js';
import axios from '@/utils/http';
import KTableList from '@/components/table/KTableList';
import DictStore from '@/store/dict-store.js'
import DynamicForm from '@/components/form/DynamicForm'
const BASEAPI = `${API_GATEWAY}/api`;

export default {
  components:{
    KTableList,
    DynamicForm,
    HBtn: function index(resolve){
      require(["@/components/Button/HBtn.vue"], resolve);
    },
  },
  props: {
    mate: Object
  },
  data () {
    return {
      isIndex: true,                     // Table 是否渲染序号列
      isIndexDialog: true,               // 详情 Dialog Table 是否渲染序号列
      lineTableFlag: false,              // 行Table 是否渲染
      rowStatus: null,                   // 列表订单行状态
      multipleSelection: [],             // 勾选项数组
      word: true,                        // 按钮是否显示文字
      dictFormInline: false,             // 表单是否行内显示
      dictTitle: '',                     // 表单标题
      labelWidth: '120px',               // 表单字段宽度
      querySize: 15,  // 查询默认每页条数
      params: '?listName=jhw_goods_list&listFormName=jhw_goodsrelease_form', // 元数据表名
      listUrl: '/common/toList', // 元数据接口
      dataUrl: '/agriculture/product/list',  // 列表数据接口
      queryUrl: '/agriculture/product/list',  // 查询分页接口
      deleteUrl: '', // 删除接口
      saveUrl: '',
      isEdit: false,             // 当前是否在编辑
      isMaintain: false, // 是否是维护操作
      pageSize: 15,
      multipleSelection: [],     // 点击table前面的框框，获取到的内容
      langs: LANGS,
      hasSelected: false,
      formModel: "dialog",
      page: 1,
      goodsDialog: false,
      goodsTitle: "新增",
      fileData: [],
      headerFormRules: {
        //商品编码
        code: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        // 商品名称
        name: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        // //商品分类
        categoryId: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        //规格
        // specification: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        //单位
        unitId: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
        //税率
        taxRate: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
      },
      headers: {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
        'Accept': 'application/json',
        'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId
      },
      imgAction: API_GATEWAY + '/zuul/api/purchase/goods/release/upload',
      attachmentAction:  API_GATEWAY + '/zuul/api/purchase/goods/release/upload',
      uploadUrl: '/agriculture/product/batchUpload',
      imgFileList: [], //图片上传路径
      fileList: [], // 附件上传路径
      imgRoot: '',
      attachmentRoot: '',
      headerFormEventConfig: {
        // 上架
        ifPutOn: { change: true },
      },
      uploadType: '.jpeg, .jpg, .png'
    }
  },
  computed: {},
  created () {},
  mounted () {},
  methods: {
    /**
     * 数据初始化
     * @param void
     * @return void
     ** Author: fengjing
     */
    init () {
      this.getListData();
      this.getCategoryId();
      this.mate.mateList.rowClick = true;
    },
    /**
     * 点击行弹出图片
     * @param {Object} 当前点击行 id
     * @return void
     */
    rowClick (row) {
      if (row.pictureUlrs !== "") {
        let newUrl = [];
        newUrl = row.pictureUlrs.split(',');
        for(var i = 0; i < newUrl.length;i++) {
          var iHeight = 300,iWidth = 300;
          //获得窗口的垂直位置 
          var iTop = (window.screen.availHeight - 30 - iHeight) / 2; 
          //获得窗口的水平位置 
          var iLeft = (window.screen.availWidth - 10 - iWidth) / 2; 
          window.open(newUrl[0], '', 'height=' + iHeight + ',width=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',status=no,toolbar=no,menubar=no,location=no,resizable=no,scrollbars=0,titlebar=no'); 
        }
      }
    },
    /** 动态表单事件管理
     * @param {String} event 事件名称
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     */
    handleEvents(event, val, name) {
      const eventControl = {
        change: (val, name) => this.handleChange(val, name),
        default: () => { return }
      }
      return (eventControl[event] || eventControl.default)(val, name);
    },
    /** change 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return {Function} change事件执行函数
     */
    handleChange(val, name) {
      const changeControl = {
        ifPutOn: (val, name) => this.handleIfPutOnChange(val)
      }
      return (changeControl[name] || changeControl.default)(val);
    },
    /**
     * 头部按钮控制
     * 点击按钮触发对应方法
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} rowId 勾选行 id数据  rowId.id
     * @param {Array} selection 勾选行数据
     * @return {Function} 执行操作的方法
     ** Author: fengjing
     */
    handleButtons (btn, rowId, selection) {
      this.multipleSelection = selection;
      let action = btn.action;
      const rowIds = (rowId && rowId.id) ? rowId : { id: selection && selection.map(r => r.id) };
      let rowPutaway = []
      let rowShelves = []
      if(selection){
          selection.forEach(item=>{
          var param = {}
          param.id = item.id
          param.ifPutOn = "1"
          rowPutaway.push(param)
        })
        selection.forEach(item=>{
          var param = {}
          param.id = item.id
          param.ifPutOn = "0"
          rowShelves.push(param)
        })
      }
      const btnEvents = {
        add: (btn) => this.handleCreate(btn),                     // 弹窗新增
        editBill: (btn) => this.handleUpdate(btn, rowIds), // 编辑
        putaway: (btn, rowIds) => this.handlePutaway(btn, rowPutaway),  // 批量上架
        shelves: (btn) => this.handleShelves(btn, rowShelves),                // 批量下架
        downloadTemplate: (btn, rowIds) => this.handleTemplate(btn, rowIds),   // 下载模板
        importGood: (btn) => this.handleImport(btn),                      // 导入
        exportGood: (btn) => this.handleExport(btn),                      // 导出
        upload: (btn) => this.handleUpload(btn),                          // 批量上传图片
        syncCommodity: (btn) => this.handleSyncCommodity(btn),           // 同步商品数据
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(btn, rowIds);
    },
    /**
     * actions 操作
     * 点击 action 根据按钮配置的 action 做对应操作
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return {Function} 执行操作的方法
     ** Author: fengjing
     */
    handleActions (act, row) {
      let action = act && act.action;
      let rowId = { id: [row.id] };
      const actions = {
        delete: (act, row) => this.handleDelete(act, rowId),  // 删除
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
    },
    /**
     * 批量上传图片
     */
    handleUpload(){
      this.$refs['selectFiles'].click();
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
      let fileData = file.target.files;
      for(var i = 0;i< fileData.length ;i++){
        formData.append('file', fileData[i]);
      }
      this.$confirm(`此操作会覆盖已有数据，是否确定导入?`, this.$t("TITLE_TEXT.TIPS"), {
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
     /**
     * 请求上传/导入接口
     * 成功后把二进制流数据转成前端数据格式
     * @param {Object} data FormData数据
     * @return void
     */
    uploadFile(data) {
      let _this = this;
      axios.request({
        url: `${this.BASEAPI}${this.uploadUrl}`,
        method: "POST",
        data: data,
        responseType: 'JSON'
      }).then((res) => {
        if(res.status === 200) {
            _this.$message({
            type:'success', 
            message: '操作成功'
          })
        }
        _this.$refs.selectFiles.value = '';
      },(res) => {
        _this.$refs.selectFiles.value = '';
        if(res.status === 400) {
          _this.$message({
            type:'error', 
            message: '导入失败，请联系管理员'
          })
        }
      })
    },
    /**
     * 上架控制  没有定价不让上架
     */
    handleIfPutOnChange(val){
      if(val == 1) {
        // if(!this.mate.mateFormerHeader.values.cost) {
        //   this.$message.warning("该商品未定价，无法上架");
        //   this.mate.mateFormerHeader.values.ifPutOn = '0'
        // }
      }
    },
    beforeClose(done){
      this.mate.mateFormerHeader.values = {}
      this.$refs['headForm'].$refs["form"].resetFields();
      this.$refs['detailForm'].resetFields();
      this.imgFileList = []
      this.fileList = []
      done()
    },
    /**
     * 新增
     * @param {Object} btn 按钮配置信息
     * @return void
     ** Author: fengjing
    */
    handleCreate(btn) {
      this.goodsTitle = "新增"
      this.goodsDialog = true
      this.mate.mateFormerHeader.values.ifPutOn = '0'
    },
    /**
     * 刷新缓存
     * @param {Object} btn 按钮配置信息
     * @return void
     ** Author: fengjing
     */
    handleRefresh(btn){
      DictStore.fetch();
    },
    /**
     * 批量上架
     * @param {Object} btn 按钮配置信息
     * @param {Array} rowIds 选择行id数值
     * @return void
     */
    handlePutaway(btn,row){
      let _this = this
      this.$root.ajaxData(btn.url, row, function (data) {
        _this.getListData()
      },"PUT")
    },
    /**
     * 批量下架
     * @param {Object} btn 按钮配置信息
     * @param {Array} rowIds 选择行id数值
     */
    handleShelves(btn,row){
      let _this = this
      this.$root.ajaxData(btn.url, row, function (data) {
        _this.getListData()
      },"PUT")
    },
    /**
     * 下载模板
     * @param {Object} btn 按钮配置信息
     */
    handleTemplate(btn){
      let params = {ifDownLoadTemplate: true}
      let [url, methods, fileName, type, data] = [ btn.url, 'POST', '商品信息模板', 'xlsx', params];
      SERVICES.BASE.downTemplateExcel(url, methods, fileName, type, data);
    },
    /**
     * 导出
     * @param {Object} btn 按钮配置信息
     */
    handleExport(btn){
      this.mate.mateSearch.values.ifDownLoadTemplate = false
      let [url, methods, fileName, type, data] = [ btn.url, 'POST', '商品信息清单', 'xlsx', this.mate.mateSearch.values];
      SERVICES.BASE.downTemplateExcel(url, methods, fileName, type, data);
    },
    /**
     * 同步数据
     *  @param {Object} btn 按钮配置信息
     */
    handleSyncCommodity(btn){
      this.$root.ajaxData(btn.url, {}, function (data) {
        _this.getListData()
      },"POST")
    },
    /**
     * 编辑
     * @param {Object} btn 按钮配置
     * @param {Array} row 当按钮为行数据
     * @return void
     **Author: fengjing
     * 需要权限控制移至头部按钮 -- hzq
     */
    handleUpdate(btn, rowIds){
      const _this = this
      // 只能勾选一条数据
      if (this.multipleSelection.length > 1) {
        this.$message.warning("请选择一条数据修改");
        return
      };
      let url = btn.url + rowIds.id[0]
      this.imgFileList = []
      this.fileList = []
      axios.get(url,{}).then(res=>{
        _this.mate.mateFormerHeader.values = res.data.data
         // 初始化产品图片
            if(_this.mate.mateFormerHeader.values.pictureUlrs){
                var imgArray = new Array()
                imgArray = _this.mate.mateFormerHeader.values.pictureUlrs.split(",")
                imgArray.forEach(item=>{
                    var param = {}
                    param.url = item
                    param.response = item
                    _this.imgFileList.push(param)
                })
            }
            // 初始化附件列表
            if(_this.mate.mateFormerHeader.values.files){
                var fileArray = new Array()
                // JSON.parse(_this.mate.mateFormerHeader.values.files)
                fileArray = JSON.parse(_this.mate.mateFormerHeader.values.files)
                this.fileList = this.initLineData(fileArray)
            }
            _this.goodsDialog = true
            _this.goodsTitle = "编辑"
      })
    },
    /**
     * 删除
     * @param {Object} btn 按钮配置
     * @param {Array} rowIds 当按钮为行数据/头部按钮为勾选行 id 数组
     * @return void
     ** Author: fengjing
    */
    handleDelete(btn, rowIds) {
      // obj.id 为行删除 || rowIds.id 为批量删除
      const _this = this;
      const ids = rowIds;
      this.$root.handleAction(btn, ids, () => _this.getListData(), btn.method);
    },
    /** 获取列表
     * @param void
     * @return void
     ** Author: fengjing
     */
    getListData() {
      const _this = this;
      let url = `${this.queryUrl}`;
      var param = {
        ifNeedPage: true
      }
      axios.post(url, param).then(res => {
        if (res.status === 200 && !!res.data) {
          const data = res.data.data
          let total = data.total
          let rows = data.list;
          let page = data.pageNum;
          let size = data.size;
          let dataApi = url;
          _this.mate.mateList = { ..._this.mate.mateList, size, page, total, rows, dataApi };
        }
      });
    },
    /**
     * 新增/编辑商品取消
     * @param void
     * @return void
     */
    cancelDialog () {
      this.goodsDialog = false;
      this.$refs['headForm'].$refs["form"].resetFields();
      this.$refs['detailForm'].resetFields();
      this.imgFileList = []
      this.fileList = []
      this.getListData()
    },
    /**
     * 重新渲染列表页
     * @param void
     * @return void
     ** Author: fengjing
     */
    reRenderList() {
      this.$root.monitor({ url: `${this.listUrl}${this.params}` });
    },
    /**
     * 获取商品分类下拉
     * @param void
     * @return {objdet}
     */
    getCategoryId(){
      let _this = this
       this.$root.ajaxData('/agriculture/customerPurchase/getIndustryCategory?industryName=农业', {}, function (data) {
        _this.materialChange(data.data)
        _this.mate.mateFormerHeader.fields.forEach(item=>{
           if(item.name == "categoryId"){
             item.options = data.data
           }
         })
         _this.mate.mateSearch.fields.forEach(item=>{
           if(item.name == "categoryId"){
             item.options = data.data
           }
         })
      }, 'GET')
    },
    materialChange (data) {
      for (const i of data) {
        i.label = i.name
        i.value = i.id
        if (i.children) {
          this.materialChange(i.children)
        }
      }
    },
     /** 按钮事件
     * @param {String} name 按钮名称
     * @return {Function} 按钮事件
     */
    handleBtns(name) {
      const btnEvents = {
        // 提交按钮
        save: () => this.handleSave(),
        // 取消按钮
        cancel: () => this.backward(),
        // 重置按钮
        reset: () => this.handleReset(),
        // 默认
        default: () => { return }
      }
      return (btnEvents[name] || btnEvents.default)();
    },
    /**
     * 保存操作 
     * 通知父组件关闭弹框
     */
    handleSave(){
        let _this = this
        let url = "/agriculture/product/insertOne"
        let updateUrl = "/agriculture/product/updateOne"
        if(typeof(this.mate.mateFormerHeader.values.categoryId) == 'object') {
          this.mate.mateFormerHeader.values.categoryId = this.mate.mateFormerHeader.values.categoryId[this.mate.mateFormerHeader.values.categoryId.length - 1]
        }
        // if(!this.mate.mateFormerHeader.values.pictureUlrs){
        //    _this.$message.warning("请上传产品图片");
        //    return
        // }
        this.$refs['headForm'].$refs["form"].validate((valid) => {
            if (valid) {
                // 编辑保存
                if(this.mate.mateFormerHeader.values.id){
                    this.$root.ajaxData(updateUrl, this.mate.mateFormerHeader.values, function (data) {
                        if(data.code === 200) {
                            _this.$message.success("操作成功");
                            _this.cancelDialog()
                            return
                        }
                    },"PUT")
                } else {
                // 新增保存
                    this.$root.ajaxData(url, this.mate.mateFormerHeader.values, function (data) {
                        if(data.code === 200) {
                            _this.$message.success("操作成功");
                            _this.cancelDialog()
                            return
                        }
                    },"POST")
                }
            } else {
                this.$message.warning("表单校验失败");
            }
        })
    },
    /**
     * 取消操作
     * 通知父组件关闭弹框
     * @returns {void}
     */
    backward(){
        this.cancelDialog()
    },
    /**
     *重置操作
     *   @returns {void}
     */
    handleReset(){
        this.$refs['headForm'].$refs["form"].resetFields();
        this.$refs.detailForm.resetFields();
    },
    /**
     * 图片变化操作
     * @param {Object} file 上传文件
     * @param {Array}  fileList 文件列表 
     */
    handleImgChang (file, fileList) {
      this.imgRoot = ''
      let imgList = new Array();
      fileList.forEach(item=>{
          imgList.push(item.response)
      })
      this.imgPath = imgList.join(",")
      this.mate.mateFormerHeader.values.pictureUlrs = this.imgPath
    },
    /**
     * 图片删除操作
     * @param {Object} file 上传文件
     * @param {Array}  fileList 文件列表 
     */
    handleImgRemove(file, fileList){
      let imgList = new Array();
      fileList.forEach(item=>{
          imgList.push(item.url)
      })
      this.imgPath = imgList.join(",")
      this.mate.mateFormerHeader.values.pictureUlrs = this.imgPath
    },
    /**
     * 附件上传文件
     * @param {Object} file 上传文件
     * @param {Array}  fileList 文件列表
     */
    handleAttachmentChang (file, fileList){
      this.attachmentRoot = ''
      let imgList = new Array();
      let param = {}
      // fileList.forEach(item=>{
      //   param.name = item.name
      //   param.url = item.response
      // })
      this.fileList = this.initLineData(fileList)
      this.mate.mateFormerHeader.values.files = JSON.stringify(fileList)
    }, 
    /**
     * 超出限制个数
     * @param {Object} file 上传文件
     * @param {Array}  fileList 文件列表
     */
    handleImgExceed(file, fileList){
        this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    /**
     * 数据转换 
     * 后台返回数据结构不统一做数据转换处理
     * @param {Object} data 数据
     * @return void
     */
    convertData({ pageSize, total, pageNum, list, ...resData}) {
      let rows = resData.data.list;
      let page = resData.data.pageNum;
      let size = resData.data.pageSize;
      total = resData.data.total;
      this.mate.mateList = { ...this.mate.mateList, size, page, total, rows };
    },
     /**
     * 递归自动生成明细行序号 1/2/3....
     * 默认为 1 如果当前行序号有1了 则递增1
     * @param {Number} num 序号
     * @return {Number} lineNum 序号
     */
    creatDetailNum (num) {
      let lineNum = num || 1;
      if (this.checkDetailNum(lineNum)){
        lineNum += 1;
        lineNum = this.creatDetailNum(lineNum);
      }
      return lineNum;
    },
     /**
     * 明细行序号检验 
     * 校验是否已经存在当前序号
     * @param {Number} num 序号
     * @return {Boolean}  num是否已存在
     */
    checkDetailNum (num, index) {
      let lineNumArr = [];
      let listLineRows = [...this.mate.mateListLine.rows];
      if (index) {
        listLineRows = listLineRows.filter(item => item.index != index);
      }
      listLineRows.forEach(item => lineNumArr.push(item.lineNum));
      return lineNumArr.indexOf(num) != -1;
    },
    /**
     * 初始化行数据
     * 添加索引 从 1 开始
     * 已实施状态赋值
     * @params {Object} data 行数据
     * @return {Object} data 行数据
     ** 
     */
    initLineData (data) {
      data.forEach((item,index) =>{
        // 设置索引 从 1 开始
        item.lineNum = index + 1;
      })
      return data;
    },
    /**
     * 查看
     * @param {String} val 
     * 附件路径
     */
    viewFile(val){
      window.open(val)
    },
    /**
     * 附件删除
     * @param {String} lineNum 附件行号
     */
    deleteFile(lineNum){
      this.fileList.forEach((item,index)=>{
        if(item.lineNum === lineNum) {
          this.fileList.splice(index,1)
          this.fileList= this.initLineData(this.fileList);
        }
      })
      this.mate.mateFormerHeader.values.files = JSON.stringify(this.fileList)
    },
    /**
     * 上传成功
     * 
     */
    uploadSuccess(data) {
			this.getListData()
			this.$message({
				type: "success",
				message: "导入成功"
			});
    },
  },
  watch: {
    mate: {
      handler(newMate, oldMate) {
      　 this.init();
  　　},
  　　immediate: true
    }
  },
}
</script>

<style lang="scss" scoped>
  #dict_list{
    /deep/ .el-dialog__body{
      padding-bottom: 0;
    }
    /deep/ .el-divider--horizontal{
      margin-top: 0;
    }
  }
</style>
