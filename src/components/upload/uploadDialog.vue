<!-- created by yxj on 2019/11/26 -->
<!-- 上传附件 -->
<template>
 <div class="upload-dialog-box">
   <!-- 上传附件dialog   -->
   <el-dialog :title="uploadTitle" :visible.sync="uploadDialog" :before-close="closeDialog">
     <el-button size="mini" @click="addAttachment" class="add-btn" v-if="!uploadParams.justRead">添加附件</el-button>
     <el-table :data="attatchmentList" border height="300" width="100%">
       <el-table-column type="index"  label="序号" min-width="50"></el-table-column>
       <el-table-column prop="fileName" label="附件名称" min-width="150">
         <template slot-scope="scope">
           <a target="_blank" :href="scope.row.attachmentUrl" :download="scope.row.fileName" class="a-href">{{scope.row.fileName}}</a>
         </template>
       </el-table-column>
       <el-table-column prop="createAt" label="上传时间" min-width="100"></el-table-column>
       <el-table-column label="操作" min-width="50" v-if="!uploadParams.justRead">
         <template slot-scope="scope">
           <el-button size="mini" type="danger" @click="deleteAttach(scope.$index, scope.row)">删除附件</el-button>
         </template>
       </el-table-column>
     </el-table>
   </el-dialog>
   <!-- 上传附件里面的添加附件    -->
   <el-dialog title="添加附件" :visible.sync="uploadAttachmentParams.addAttachMentDialog" append-to-body>
     <el-form :model="uploadAttachmentParams.addProgressData" ref="addProgress" style="width: 50%">
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
           list-type="picture"
           :file-list="uploadAttachmentParams.fileList">
         <el-button size="small" type="primary">点击上传</el-button>
       </el-upload>
     </el-form>
     <div slot="footer" class="dialog-footer">
       <el-button @click="uploadAttachmentParams.addAttachMentDialog = false">取 消</el-button>
       <el-button type="primary" @click="uploadAttachmentOk()" :disabled="uploadAttachmentParams.fileList.length <= 0">确 定</el-button>
     </div>
   </el-dialog>
 </div>
</template>

<script scope>
import SERVICES from "@/services";
import { API_GATEWAY } from '@/config/index.js'
export default {
  components: {
  },
  data () {
    return {
      uploadAttachmentParams: {
        addAttachMentDialog: false,
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
      attatchmentList: [],

    }
  },
  props: {
    uploadDialog: { // 父级按钮控制是否显示上传附件dialog
      type: Boolean,
      default: false
    },
    uploadParams: { // 父级传参
      type: Object,
      default: {}
    },
    uploadTitle: {
      type: String,
      default: '上传附件'
    }
  },
  watch: {
    'uploadDialog'(newVal, oldVal) { // 监听弹窗与否，一旦触发(父级uploadDialog=true)就重新请求附件列表数据
       if(newVal){
         this.uploadAttachment(this.uploadParams.rowId,this.uploadParams.serviceModel, this.uploadParams.getMethod);
       }
    }
  },
  methods: {
    /** 获取附件列表
     * @param string rowId 行id,serviceModel 服务模块, getMethod 服务里面调用获取列表的方法
     * @return void
     */
    uploadAttachment(rowId, serviceModel, getMethod) {
      if(rowId && rowId !=='') {
        SERVICES[serviceModel][getMethod](rowId).then(res =>{
          if(res.data.statusCode == 200){
            this.attatchmentList = res.data.data;
          }else{
            this.$notify({
                title: '温馨提示',
                message: this.$createElement('i', { style: 'color: teal'}, '获取附件列表失败')
            });
          }
        });
      }else{
        this.$notify({
            title: '温馨提示',
            message: this.$createElement('i', { style: 'color: teal'}, '无法获取附件列表')
        });
      }
    },
    /**
     * 点击添加附件按钮
     * @param void
     * @return void
     */
    addAttachment() {
      this.uploadAttachmentParams.fileList = [];
      this.uploadAttachmentParams.addAttachMentDialog = true;
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
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    uploadAttachmentOk() {  // 上传附件确定
      let params = { busId:this.uploadParams.rowId, fileName:this.uploadAttachmentParams.addAttachMentData.fileName, type:this.uploadAttachmentParams.addAttachMentData.fileType, attachmentUrl:this.uploadAttachmentParams.addAttachMentData.fileUrl, busType:this.uploadParams.busType }
      SERVICES[this.uploadParams.serviceModel][this.uploadParams.uploadMethod](params).then(res =>{
        if(res.data.statusCode == 200){
          this.$notify({
              title: '温馨提示',
              message: this.$createElement('i', { style: 'color: teal'}, '添加附件成功')
          });
          this.uploadAttachment(this.uploadParams.rowId,this.uploadParams.serviceModel, this.uploadParams.getMethod);
          this.uploadAttachmentParams.addAttachMentDialog = false;
        }else{
          this.$notify({
              title: '温馨提示',
              message: this.$createElement('i', { style: 'color: teal'}, '添加附件失败')
          });
        }
      });
    },
    /**
     * 删除附件
     * @param idx 删除的当前的行id， row 行
     * @return void
     */
    deleteAttach(idx,row) {
      this.$confirm(
        this.$t("TIPS_WARNING.DELETE_ATTACHMENT"),
        this.$t("TITLE_TEXT.TIPS"),
        {
            confirmButtonText: this.$t("BUTTON_TEXT.CONFIRM"), // 确认
            cancelButtonText: this.$t("BUTTON_TEXT.CANCEL"), // 取消
            type: "warning"
        }
      ).then(() => {
        SERVICES[this.uploadParams.serviceModel][this.uploadParams.deleteMethod](row.id).then(res =>{
          if(res.data.statusCode == 200){
            this.$notify({
                title: '温馨提示',
                message: this.$createElement('i', { style: 'color: teal'}, '删除附件成功')
            });
            this.uploadAttachment(this.uploadParams.rowId,this.uploadParams.serviceModel, this.uploadParams.getMethod);
          }else{
            this.$notify({
                title: '温馨提示',
                message: this.$createElement('i', { style: 'color: teal'}, '删除附件失败')
            });
          }
        });
      }).catch(err =>{
        this.$message({
            type: "info",
            message: this.$t('删除附件异常')
        });
      });
    },
    /**
     * 关闭弹窗
     * @param void
     * @return void
     */
    closeDialog() {
      this.$emit("closeDialog", false);
    },
  }
}
</script>
<style scoped>
  .upload-dialog-box .add-btn { margin-bottom: 20px }
  .upload-dialog-box .a-href { color: #03a9f4;cursor: pointer }
</style>
