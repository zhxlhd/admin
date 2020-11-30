<!-- created by hezhiqiang on 2019/12/09 -->
<!-- 货物追踪签到 -->
<template>
  <div>
    <!-- headTable Start -->
    <KTableList
      :mate="mate"
      :mateSearch="mate.mateSearch"
      ref="listTable"
      :isIndex="isIndex"
      @btnClick="handleButtons"
      @rowClick="rowClick"
      @action="handleActions"
      @resetLineTable="showDetailTable=false"
    />
    <!-- headTable END -->
    <!-- detailTable Start -->
    <el-table size="mini" v-if="showDetailTable" :data="mate.mateListLine.rows" border id="main_table">
			<template v-for="(col,idx) of mate.mateListLine.columns">
				<el-table-column 
          show-overflow-tooltip 
          v-if="col.isShow && !col.isJoint"
            :formatter="col.formatter"
            :key="idx"
            :label="col.label"
            :prop="col.name"
            :min-width="col.width"
            :sortable="col.sortable">
        </el-table-column>
        <!-- 单元格有多个字段拼接 -->
        <el-table-column v-if="col.isShow && col.isJoint"
            :formatter="col.formatter"
            :key="idx"
            :label="col.label"
            :prop="col.name"
            :min-width="col.width"
            :sortable="col.sortable"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="jointContent">
                <span v-if="scope.row.isSign === 'Y'" style="background-color: #468847;">已签到</span>
                <span v-if="scope.row.delayTag === 'Y'" style="background-color: #999999;">有延迟</span>
                <span v-if="scope.row.fistTag === 'Y'">起始站点</span>
                <span v-if="scope.row.endTag === 'Y'">终点站</span>
              </div>
            </template>
        </el-table-column>
			</template>
      <el-table-column label="操作" fixed="right" width="300px" v-if="mate.mateListLine.actions">
        <template slot-scope="scope">
          <act-btn 
            v-for="act of mate.mateListLine.actions" 
            v-bind:key="act.action" 
            size="mini" 
            :act="act" 
            :word="word"
            :row="scope.row" 
            @action="handleActions"
          />
          <el-button size="mini" v-if="scope.row.trackingState === '0' && scope.row.fistTag === 'Y'" @click="firstSignIn(scope.row)">签到</el-button>
          <el-button size="mini" v-if="scope.row.trackingState === '1' && scope.row.fistTag === 'Y'" @click="separationPlant(scope.row)">确认离厂</el-button>
          <el-button size="mini" v-if="scope.row.trackingState === '2' && scope.row.endTag === 'Y'" @click="secondSignIn(scope.row)">签到</el-button>
          <el-button size="mini" v-if="scope.row.trackingState === '3' && scope.row.endTag === 'Y'" @click="acknowledgement(scope.row)">回单确认</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- detailTable End -->
    <!--signInDialog Start -->
    <el-dialog title="签到" width="30%" :visible.sync="dialogVisible" :before-close="DialogClose">
      <el-form :rules="rules" ref="form" :model="formData" label-width="70px">
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea" 
            :autosize="{ minRows: 4, maxRows: 6}"
            v-model="formData.remark"
            placeholder="请输入签到备注"
            ></el-input>
        </el-form-item>
        <el-form-item label="签到文件" prop="filePath">
          <el-upload
            class="upload-demo"
            :action="uploadAttachmentParams.fileuploadUrlImgPath"
            :headers="uploadAttachmentParams.headers"
            :before-upload="beforeUploadFilePath"
            :on-success="handleSuccessFilePath"
            :on-remove="handleRemoveFilePath"
            multiple
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="uploadAttachmentParams.fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <span style="margin-left: 10px;" v-if="!uploadAttachmentParams.fileList.length">未选择任何文件</span>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="handleSignIn()">签到</el-button>
        <el-button size="mini" @click="DialogClose">{{$t('BUTTON_TEXT.CANCEL')}}</el-button>
      </div>
    </el-dialog>
    <!--signInDialog End -->
    <el-dialog  title="附件列表" :visible.sync="showAttachmentList" width="60%">
      <template>
        <el-table :data="attachmentListData" border style="width: 100%" size="mini" center>
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="fileName" label="文件名" width="120">
            <template slot-scope="scope">
              <a target="_blank" :href="scope.row.attachmentUrl">{{scope.row.fileName}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="fileType" label="附件类型" width="150"></el-table-column>
          <el-table-column prop="uploadUser" label="上传人" width="120"></el-table-column>
          <el-table-column prop="createAt" label="上传时间" width="150"></el-table-column>
          <el-table-column  label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="preview(scope.row.attachmentUrl)">预览</el-button>
              <el-button size="mini" @click="deleteAttach(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import KTableList from '@/components/table/KTableList'
import ActBtn from '@/components/Button/ActionBtn';
import SERVICES from '@/services'
import { LOGISTICS_ORDER_API } from "@/services/apis"
import { API_GATEWAY } from '@/config/index.js'

export default {
  components: {
    KTableList,
    ActBtn
  },
  data(){
    return {
      isIndex: true,                // table是否渲染序号
      showDetailTable: false,       // 是否渲染明细行表格
      headRowId: '',                // 头行id
      rowTrackSId: '',              // 追踪行id
      dialogVisible: false,         // 签到弹框
      isFirstSignIn: false,         // 是否第一次签到
      isSeparationPlant: false,     // 是否确认离厂
      isSecondSignIn: false,        // 是否第二次签到
      isAcknowledgement: false,     // 是否货单确认
      formData: {                   // 弹框签到数据
        remark: '',
        filePath: ''
      },
      headers: {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
        'Accept': 'application/json',
        'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId
      },
      rules: {
        remark: [{ required: true, message: '该输入项为必输项', trigger: 'blur' }]
      },
      showAttachmentList: false,   // 查看附件弹框显示
      attachmentListData: [],       // 附件列表数据
      uploadAttachmentParams: {
        addAttachMentData: {
          fileName:'',
          fileUrl:''
        },
        fileList:[],
        fileuploadUrlImgPath: `${API_GATEWAY}/api/companys/uploadDetail`,
        headers: {
          'Authorization': `Bearer ${window.sessionStorage.getItem('token')}`,
          'Accept': 'application/json',
          'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId
        }
      },
    }
  },
  props: {
    mate: Object
  },
  created (){
    this.init();
  },
  mounted () {
  },
  watch: {
    mate: function (newMate) {
      this.init();
    },
    // 'showAttachmentList'(newVal,oldVal) {
    //   if(newVal) {
    //     this.getAttchmentList(rowId)
    //   }
    // }
  },
  methods: {
    /**
     * 数据初始化
     * @param void
     * @return void
     */
    init () {
      this.showDetailTable = false;
      this.mate.mateList.rowClick = true; // 允许单击列表行请求行数据
    },
    /**
     * 头部按钮控制
     * 点击按钮触发对应方法
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @param {Array} selection 勾选行数据
     * @return void
     */
    handleButtons (btn, row, selection) {
      this.multipleSelection = selection;
      let action = btn.action;
      const btnEvents = {
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(btn, row);
    },
    /**
     * actions 操作
     * 点击 action 根据按钮配置的 action 做对应操作
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
     */
    handleActions (act, row) {
      let action = act && act.action;
      const actions = {
        // 查看附档
        detailsAttchmennt: () => this.detailsAttchmennt(act, row),
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
    },
    /**
     * 展开明细行列表，并获取对应明细行数据
     * @param {Object} 当前点击行 id
     * @return void
     */
    rowClick (row) {
      this.headRowId = row.id
      // 渲染明细行表格
      this.showDetailTable = true
      // 获取明细行数据
      this.getDetailList()
    },
    /**
     * 获取明细行数据
     * @param {object} 点击行的 id数据
     * @return void
     */
    getDetailList () {
      SERVICES.CARGO_TRACKING.getDetailList(this.headRowId).then((res) => {
        let data = res.data
        this.mate.mateListLine.rows = data
      })
    },
    /** 状态改变
     * 未到厂 -> 0
     * 未出发 -> 1
     * 途中 -> 2
     * 到达目的地 -> 3
     * 已经签收 -> 4
     * @param {String} state 状态
     * @param {String} id 点击行 id 
     * @param {String} text 备注
     * @return void
     * 
     */
    handleStatus(state, id, text) {
      SERVICES.CARGO_TRACKING.changeStatus(state, id, text).then((res) => {
        let status = res.data.statusCode
        if (status === 200) {
          this.uploadAttachment();
          this.dialogVisible = false
        }
      });
    },
    /**
     * 第一次签到
     * @param {String} 点击行 id数据
     * @return void
     */
    firstSignIn (row) {
      this.dialogVisible = true
      this.isFirstSignIn = true
      this.isSeparationPlant = false
      this.isSecondSignIn = false
      this.isAcknowledgement = false
      this.rowTrackId = row.id
      this.formData.remark = ''
      this.uploadAttachmentParams.fileList = []
    },
    /**
     * 确认离厂
     * @param {String} 点击行 id数据
     * @return void
     */
    separationPlant (row) {
      this.dialogVisible = true
      this.isSeparationPlant = true
      this.isFirstSignIn = false
      this.isSecondSignIn = false
      this.isAcknowledgement = false
      this.rowTrackId = row.id
      this.formData.remark = ''
      this.uploadAttachmentParams.fileList = []
    },
    /**
     * 第二次签到
     * @param {String} 点击行 id数据
     * @return void
     */
    secondSignIn (row) {
      this.dialogVisible = true
      this.isSecondSignIn = true
      this.isFirstSignIn = false
      this.isSeparationPlant = false
      this.isAcknowledgement = false
      this.rowTrackId = row.id
      this.formData.remark = ''
      this.uploadAttachmentParams.fileList = []
    },
    /**
     * 回单确认
     * @param {String} 点击行 id数据
     * @return void
     */
    acknowledgement (row) {
      this.dialogVisible = true
      this.isAcknowledgement = true
      this.isFirstSignIn = false
      this.isSeparationPlant = false
      this.isSecondSignIn = false
      this.rowTrackId = row.id
      this.formData.remark = ''
      this.uploadAttachmentParams.fileList = []
    },
    /**
     * 上传附件之前的操作
     * @param void
     * @return void
     */
    beforeUploadFilePath(file) {
      this.uploadAttachmentParams.addAttachMentData.fileName = file.name;
    },
    /**
     * 上传附件成功的操作
     * @param void
     * @return void
     */
    handleSuccessFilePath (response, file, fileList) {
      if(response.statusCode == 200){
        this.uploadAttachmentParams.addAttachMentData.fileUrl = response.data;
        this.uploadAttachmentParams.addAttachMentData.fileType = this.uploadAttachmentParams.addAttachMentData.fileName.split('.')[1];
        this.uploadAttachmentParams.fileList.push({ name:this.uploadAttachmentParams.addAttachMentData.fileName, url:this.uploadAttachmentParams.addAttachMentData.fileUrl });
      }
    },
    handleRemoveFilePath (file, fileList) {
      this.uploadAttachmentParams.fileList = [];
    },
    handleExceed(files, fileList) {  //  文件超出个数限制时的钩子
      this.$message.warning(`当前限制选择 1 个文件`);
    },
    uploadAttachment() {  // 上传附件
      if (!this.uploadAttachmentParams.fileList.length) {
        this.reRenderList();
        return;
      }
      let params = { 
        busId:this.rowTrackId, 
        fileName:this.uploadAttachmentParams.addAttachMentData.fileName, 
        fileType:this.uploadAttachmentParams.addAttachMentData.fileType, 
        attachmentUrl:this.uploadAttachmentParams.addAttachMentData.fileUrl, 
        busType:'cargo_tracking_site' 
      }
      SERVICES.CARGO_TRACKING.attachMentUpload(params).then(res =>{
        if(res.data.statusCode == 200){
          this.$notify({
              title: '温馨提示',
              message: this.$createElement('i', { style: 'color: teal'}, '添加附件成功')
          });
          this.reRenderList();
        }else{
          this.$notify({
              title: '温馨提示',
              message: this.$createElement('i', { style: 'color: teal'}, '添加附件失败')
          });
        }
      });
    },
    /**
     * 签到确认
     * @param void
     * @return void
     */
    handleSignIn () {
      let signInRemark = this.formData.remark;
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // 第一次签到
          if (this.isFirstSignIn) {
            this.handleStatus(1, this.rowTrackId, signInRemark);
            return;
          };
          // 确认离厂
          if (this.isSeparationPlant) {
            this.handleStatus(2, this.rowTrackId, signInRemark);
            return;
          };
          // 第二次签到
          if (this.isSecondSignIn) {
            this.handleStatus(3, this.rowTrackId, signInRemark);
            return;
          };
          // 回单确认
          if (this.isAcknowledgement) {
            this.handleStatus(4, this.rowTrackId, signInRemark);
            return;
          }
        }
      })
    },
    /**
     * 关闭弹窗
     */
    DialogClose () {
      this.dialogVisible = false
      this.getDetailList();
    },
    /**
     * 查看附件列表
     * @param void
     * @return void
     */
    detailsAttchmennt(act, row) {
      let rowId = row.id
      this.showAttachmentList = true
      this.getAttchmentList(rowId)
      
    },
    /**
     * 获取附件列表信息
     * @param void
     * @return void
     */
    getAttchmentList (rowId) {
      // 获取当前用户
      const localStorage = window.localStorage;
      var localuser = JSON.parse(localStorage.getItem('user'));
      SERVICES.CARGO_TRACKING.attachMentList(rowId).then(res => {
        // res.data.data.map((item,index) => {
        //   this.attachmentListData.push(Object.assign({},item,{uploadUser: localuser.firstname + localuser.lastname}))
        // })
        let dataList = res.data.data
        if (dataList.length === 0) {
          this.attachmentListData = []
        } else {
          dataList.forEach(item => {
            this.attachmentListData = dataList;
            this.attachmentListData.forEach((value,index) => {
              value['uploadUser'] = localuser.firstname + localuser.lastname
            })
          })
        }
      })
    },
    /**
     * 附件预览
     * @param void
     * @return void
     */
    preview (val) {
      window.open(val)
    },
    /**
     * 附件删除
     * @param 删除的当前行id
     * @return void
     */
    deleteAttach (index,row) {
      let rowId = row.busId
      this.$confirm("此操作将永久删除该行，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        SERVICES.CARGO_TRACKING.deleteAttachMent(row.id).then(res => {
          if (res.data.statusCode == 200) {
            this.$message({
              type: "success",
              message: "删除成功"
            })
            this.getAttchmentList(rowId)
            // this.reRenderList();
          } else {
            this.$message({
              type: "danger",
              message: "删除失败"
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    },
    /**
     * 重新渲染列表页
     * @param void
     * @return void
     */
    reRenderList() {
      this.$root.monitor({ url: LOGISTICS_ORDER_API.CARGO_TRACKING_LIST });
    },
  }
}
</script>
<style scoped lang="scss">
#main_table{
  table{
    td{
      position: relative;
    }
    .jointContent {
      span {
        color: #ffffff;
        padding: 3px;
        border-radius: 3px;
        background-color: #3a87ad;
      }
    }
  }
}
</style>
