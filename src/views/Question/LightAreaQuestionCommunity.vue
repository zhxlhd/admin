<!-- created by fengjing on 2020/03/14 -->
<!-- 光明区调查问卷  -->
<template>
  <div>
    <!-- 列表 Start -->
    <k-table-list ref="listTable" 
                  :mate="mate" 
                  :mateSearch="mate.mateSearch" 
                  :isIndex="isIndex" 
                  @initQueryData="convertData"
                  @btnClick="handleButtons" 
                  @action="handleActions"
                 ></k-table-list>
    <!-- 列表 End -->
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="240px"
      
      :before-close="dialogBeforeClose">
      <div>
        <img :src=QRCodeImg alt="">
      </div>
    </el-dialog>
    <input ref="excelFile"
             type="file" 
             style="display:none" 
             @change="fileUpload" 
             :accept="uploadType">
  </div>
</template>
<script>
import SERVICES from '@/services';
import { API_GATEWAY } from '@/config/index.js';
import axios from '@/utils/http';
import {mapActions} from 'vuex'
export default {
  components: {
    KTableList: function index(resolve) {
      require(["@/components/table/KTableList.vue"], resolve);
    }
  },
  props: {
    mate: Object
  },
  data(){
    return {
      isIndex: true,                     // Table 是否渲染序号列
      rowStatus: null,                   // 列表订单行状态
      multipleSelection: [],             // 勾选项数组
      dialogVisible: false,
      QRCodeImg: '',
      QRCodeUrl: '/question/getQRCodeForCompany',
      listUrl: '/question/epidemicRegisterPerson/selectByCondition',
    }
  },
  computed: {
		multipleSelectionLength: function () {
			return this.multipleSelection.length;
    }
  },
  created (){
    this.init();
  },
  mounted (){},
  methods: {
     ...mapActions({
      setAddressBefore:'LightAreaQuestionCommunity/setAddressBefore'
    }),
    /**
     * 数据初始化
     * @param void
     * @return void
     */
    init () {
      this.getList();
    },
    /**
     * 头部按钮控制
     * 点击按钮触发对应方法
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} rowId 勾选行 id数据  rowId.id
     * @param {Array} selection 勾选行数据
     * @return {Function} 执行操作的方法
     */
    handleButtons (btn, rowId, selection) {
      // 勾选行数据
      this.multipleSelection = selection;
      // 当前操作
      let action = btn.action;
      // 行 id 对象
      const rowIds = rowId.id ? rowId : { id: selection.map(r => r.id) };
      const btnEvents = {
        QRCode: (btn, rowIds) => this.handleQrCode(btn, rowIds),   // 生成二维码
        refresh: (btn, rowIds) => this.handleRefresh(btn, rowIds), // 刷新页面
        download: (btn, rowIds) => this.handleExport(btn, rowIds),   // 导出
        downloadTemplate: (btn, rowIds) => this.handleTemplate(btn, rowIds),   // 下载模板
        importFile: (btn, rowIds) => this.handleImport(btn, rowIds),   // 导入
        submit: (btn, selection) => this.handleSubmit(btn, rowIds),   // 提报
        submitAll: (btn, selection) => this.handleSubmitAll(btn, rowIds),   // 提报
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
     */
    handleActions (act, row) {
      let action = act && act.action;
      const actions = {
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
    },
    /** 二维码生成按钮
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} ids 勾选行 id数据  ids.id
     * @return void
     */
    handleQrCode(btn, ids) {
      this.dialogVisible = true;
      if (this.QRCodeImg != ""){
        return
      }
      axios.get(`${API_GATEWAY}${this.QRCodeUrl}`, { responseType: "arraybuffer" }).then( res =>{
        return 'data:image/png;base64,' + btoa(
          new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
      }).then(res =>{
        this.QRCodeImg = res;
      })
    },
    /** 刷新列表按钮
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} ids 勾选行 id数据  ids.id
     * @return void
     */
    handleRefresh(btn, ids) {
      this.QRCodeImg = "";
      this.getList();
      this.$refs['listTable'].listLoading = true;
      this.$refs['listTable'].handleLoading(true);
    },
    dialogBeforeClose(){
      this.dialogVisible = false;
    },
    /**
     * 导出列表
     */
    handleExport(){
      let url = `${API_GATEWAY}/question/epidemicRegisterPerson/export?query=all`;
      let methods = 'GET';
      SERVICES.BASE.downTemplateExcel(url, methods, '人员流动情况报表');
    },
    /**
     * 导入
     */
    handleImport(btn){
      this.uploadUrl = btn.url;
      this.uploadMethod =  "POST"
      this.$refs['excelFile'].click();
    },
     /**
     * 上传文件/导入模板excel 新增/编辑页面 导入行列表数据
     * 获取文件名称和后台所需参数 保存在 formData 中
     * 询问用户是否确认导入文件
     * 确认：调上传方法 uploadFile()
     * 取消：取消上传
     * @param {Object} file 上传文件参数
     * @return void
     */
    fileUpload(file) {
      let _this = this;
      let formData = new FormData();
      let fileData = file.target.files[0];
      let fileName = fileData.name || "所选文件";
      let tips = "";
      formData.append('file', fileData);
      this.$confirm(`${tips}是否确定导入<<${fileName}>>?`, this.$t("TITLE_TEXT.TIPS"), {
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
        _this.$refs.excelFile.value = '';
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
        url: `${API_GATEWAY}${this.uploadUrl}`,
        method: this.uploadMethod,
        data: data,
        responseType: 'arraybuffer'
      }).then((res) => {
        _this.$refs.excelFile.value = '';
        // 处理二进制数据
        let byteArray = new Uint8Array(res.data);
        let blob = new Blob([byteArray]);
        let reader = new FileReader();
        reader.readAsText(blob);
        reader.onload = function(e){
          // 把数据转化为对象
          let res = JSON.parse(reader.result);
          // 保存列表数据
          let data = res.data;
          // 如果数据异常 提示错误
          if(!data && res.statusCode === 500){
            _this.$message({
              type:'error', 
              message: res.message || '数据异常,请检查数据'
            })
            return;
          }
          // 导入成功 刷新当前列表的数据 跨级 祖级事件
          _this.$emit('uploadSuccess', data);
        }
      },(res) => {
        _this.$refs.excelFile.value = '';
        if(res.status === 500) {
          _this.$message({
            type:'error', 
            message: '导入失败，请联系管理员'
          })
        }
      })
    },
    /**
     * 下载模板
     */
    handleTemplate(){
      let url = `${API_GATEWAY}/question/epidemicRegisterPerson/export`;
      let methods = 'GET';
      SERVICES.BASE.downTemplateExcel(url, methods, '疫情填报模板');
    },
    /** 提报
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} ids 勾选行 id数据  ids.id
     * @return void
     */
    handleSubmit(btn, ids){
      let url = `${API_GATEWAY}/question/epidemicRegisterPerson/saveBatch`;
      let _this = this;
      this.multipleSelection.forEach(item=>{
        item.state = 1
      })
      axios.put(url,this.multipleSelection).then(res =>{
        _this.getList();
      })
    },
    handleSubmitAll(btn, ids){
      let url = `${API_GATEWAY}/question/epidemicRegisterPerson/handInAll`;
      axios.get(url).then(res =>{
        _this.getList();
      })
    },
    getList(){
      let _this = this;
      let url = `${API_GATEWAY}${this.listUrl}`;
      axios.post(url,{}).then(res =>{
        if(res.status === 200 && !!res.data){
          let size = res.data.pageSize;
          let total = res.data.totalCount;
          let rows = res.data.list;
          let page = res.data.pageNum;
          let dataApi = url;
          rows.forEach(row=>{
            row.addressBefore = row.beforeReturnProvince + row.beforeReturnCity + row.beforeReturnCounty
            row.addressInSZ = row.beforeReturnProvince + row.beforeReturnCity + row.beforeReturnCounty
            if(row.state === 0) {
              row.stateLabel = '未提报'
            } else if(row.state === 1){
              row.stateLabel = '已提报'
            }
          })
          _this.mate.mateList = { ..._this.mate.mateList, size, page, total, rows, dataApi };
        }
      })
    },
    /**
     * 数据转换 
     * 后台返回数据结构不统一做数据转换处理
     * @param {Object} data 数据
     * @return void
     */
    convertData({ pageSize, totalCount, pageNum, list, ...resData}) {
      let size = pageSize;
      let total = totalCount;
      let rows = list;
      rows.forEach(row=>{
        row.addressBefore = row.beforeReturnProvince + row.beforeReturnCity + row.beforeReturnCounty
        row.addressInSZ = row.beforeReturnProvince + row.beforeReturnCity + row.beforeReturnCounty
        if(row.state === 0) {
          row.stateLabel = '未提报'
        } else if(row.state === 1){
          row.stateLabel = '已提报'
        }
      })
      let page = pageNum;
      this.mate.mateList = { ...this.mate.mateList, size, page, total, rows };
    }
  },
  watch: {
    mate: function (newMate) {
      this.init();
    }
  }
}
</script>
<style scoped>
</style>
