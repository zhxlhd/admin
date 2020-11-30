/**
 * 电镀行业-商品发布-园区服务模块新增
 */
<template>
    <div>
      <div class="hbutton">
          <el-button type="primary" class="el-icon-document" @click="handleSubmit()" v-show="isShow" size="mini">提 交</el-button>
          <el-button plain class="el-icon-close" @click="backward()" size="mini">取 消</el-button>
      </div>
      <el-form size="mini" :model="mateForm" :inline="mate.inline" label-position="right" ref="ruleForm" :rules="rules" :label-width="labelWidth">
        <div class="basicInfo">
          <el-row>
            <el-col :span="6">
              <el-form-item :label="GObject.title.label" :prop="GObject.title.name">
                <el-input  placeholder="请输入要求长度不超过30个字"  maxlength="30" v-model="mateForm.title"  :disabled="showDisabled"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item :label="GObject.fromDate.label" :prop="GObject.fromDate.name">
                  <el-date-picker type="date" v-model="mateForm.fromDate" :picker-options="pickerOptions0" placeholder="请选择日期" :disabled="showDisabled"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="GObject.toDate.label" :prop="GObject.toDate.name">
                  <el-date-picker type="date" v-model="mateForm.toDate" :picker-options="pickerOptions1" placeholder="请选择日期" :disabled="showDisabled"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item :label="GObject.contact.label" :prop="GObject.contact.name">
                <el-input v-model="mateForm.contact" placeholder="输入内容" :disabled="showDisabled"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item :label="GObject.contactTel.label" :prop="GObject.contactTel.name">
                <el-input v-model="mateForm.contactTel" placeholder="输入内容" :disabled="showDisabled"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item :label="GObject.description.label" :prop="GObject.description.name">
                <div class="edit_container">
                  <quill-editor 
                    :disabled="showDisabled"
                    v-model="mateForm.description"
                    ref="myQuillEditor"
                    class="editer"
                    :headers="headers"
                    :options="editorOption" @ready="onEditorReady($event)">
                  </quill-editor>
                  <el-upload 
                    :disabled="showDisabled"
                    class="upload-demo" 
                    :action="qnLocation" 
                    :before-upload='beforeUploadDetial' 
                    :data="uploadData" 
                    :on-success='upScuccess'
                    :headers="headers" ref="uploadDetial" >
                  <el-button size="mini" id="imgInput" style="display:none" :disabled="showDisabled">点击上传</el-button>
                  </el-upload>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
</template>

<script>
import { API_GATEWAY } from '@/config/index.js'
import {validateMobile} from '../../utils/validates/validates.js'
var validatePhone = (rule, value, callback) => {
  if (!validateMobile(value)) {
    callback(new Error('请输入正确的11位手机号'))
  } else {
    callback()
  }
}
export default {
  
  components: {

  },
  data() {
    return {
      mateForm: {},
      isEdit: '',    // 用于判断是编辑还是查看
      GObject: {}, //表单信息
      editorOption: {},
      uploadData: {},
      fileList: [],
      qnLocation: API_GATEWAY + '/api/electro/file',
      headers: {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
        'Accept': 'application/json',
        'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId
      },
      showDisabled: false,
      rules: {
        title: [{ required: true, message: '该输入项为必输项', trigger: 'change' }],
        contact: [{ required: true, message: '该输入项为必输项', trigger: 'blur' }],
        fromDate: [{ required: true, message: '该输入项为必输项', trigger: 'change' }],
        toDate: [{ required: true, message: '该输入项为必输项', trigger: 'change' }],
         contactTel: [{ required: true, message: '该输入项为必输项', trigger: 'blur' },
         { validator: validatePhone, trigger: 'blur' }],
      },
      pickerOptions0: this.beginDate(),
      pickerOptions1: this.endDate(),
      isShow: true
    }
  },
  props: {
    mate: Object
  },
  computed: {
    labelWidth: function () {
      let width = ''
      if (this.mate.inline) {
        width = '100px'
      } else if (typeof (this.mate.labelWidth) === 'undefined') {
        width = '100px'
      } else if (this.mate.labelWidth === null) {
        width = '100px'
      } else {
        width = this.mate.labelWidth
      }
      return width
    }
  },
  created () {
    this.mateForm = this.mate.values
    this.mate.fields.map((i) => { this.GObject[i.name] = i });
    this.isEdit = this.mate.values.isEdit
    if(this.isEdit === '0'){
      this.showDisabled = true
      this.showDict = '0'
      this.isShow = false
    }else if(this.isEdit === '1') {
      this.showDisabled = false
    }
  },
  methods: {
    beginDate () {
      const vm = this
      return {
        disabledDate (time) {
          if (vm.mateForm.toDate) {  // 如果结束时间不为空，则小于结束时间
            return time.getTime() >= new Date(vm.mateForm.toDate).getTime();
          } else {  // 如果结束时间为空，则大于等于当前时间
            return time.getTime() < Date.now()- 8.64e7;
          }
        }
      }
    },
    endDate () {
      const vm = this
      return {
        disabledDate (time) {
          if (vm.mateForm.fromDate) {
            return time.getTime() <= new Date(vm.mateForm.fromDate).getTime();
          }
        }
      }
    },
    // 提交
    handleSubmit() {
      let vm = this
      if (this.mateForm.fromDate > this.mateForm.toDate){
        vm.$message({
          message: '开始日期不能大于结束日期',
          type: 'warning'
        })
        return
      }
      this.$refs.ruleForm.validate((valid) => {
        if(valid){
          let url = '/electro/el/park-notice/all-list'
          let params = this.mateForm
          if (!params.id) {
            this.$root.ajaxData('/electro/el/park-notice/add', params, function (data) {
              vm.$root.monitor({ url, method: 'GET' })
            }, 'POST')
          }else {
            this.$root.ajaxData('/electro/el/park-notice/update/' + params.id, params, function (data) {
              vm.$root.monitor({ url, method: 'GET' })
            }, 'PUT')
          }
        }
        else {
          this.$notify.error({
            title: '消息',
            message: '数据验证未通过'
          })
          return
        }
      })
    },

    // 取消
    backward () {
      this.$root.monitor({ url: '/electro/el/park-notice/all-list' })
    },
    onEditorReady () {
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
  }
}
</script>

<style scoped lang="scss">
  .basicInfo{

  }
  .el-form--inline>* {
    margin-right:10px
  }
  .el-form-item{
    margin: 15px 20px 2px 0px;
  }
  .leftFloat .el-row{
    float:left;
    width:250px;
  }
  .leftFloat .el-row input{
    width:250px;
  }
  .leftFloat .el-form-item{
    margin: 5px 10px 5px 5px;
  }
  .leftFloat .button{
    float:left;
  }
  .el-form--inline .el-form-item {
    width:200px;
    display: inline-block;
    margin-right: 10px;
    vertical-align: top;
  }
  .el-form-item.is-required .el-form-item__label:before{
    content:''
  }
  .el-form-item.is-required .el-form-item__label:after{
    content: '*';
    color: #ff4949;
    margin-right: 4px;
  }
  .el-cascader{
    width:100%;
  }
  .el-select{
    width:100%;
  }
  .hidden{
    display:none;
  }
  h4{
    margin-top:40px;
    margin-bottom:10px;
  }
  .el-select{
    width:100%;
  }
  .el-date-editor.el-input{
    width:100%;
  }
  .el-form--inline.el-form--label-top .el-form-item__content{
    width:90%
  }
  .leftFloat .el-form--inline .el-form-item{
    margin-right:10px;
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
  .hbutton {
    margin-bottom: 20px;
  }
</style>
