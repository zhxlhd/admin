<template>
 <div>
   <el-row>
     <el-form size="mini" :model="mate.mateFormerHeader.values" :label-position="labelPosition" ref="ruleForm" :rules="rules" :label-width="labelWidth">
       <template>
          <el-button type="text">产品基本信息</el-button>
         <el-row> 
          <el-col :sm="12" :md="8" :lg="7">
            <el-form-item :label="object['catgIds'].label" :prop="object['catgIds'].name">
             <el-cascader 
                 clearable
                 filterable
                 expand-trigger="hover"
                 :options="cascateOption"
                 v-model="mate.mateFormerHeader.values[object['catgIds'].name]"
                 separator="-"
                 @change="changeCatg"
             > </el-cascader>
            </el-form-item>
          </el-col>
         </el-row>
         <el-row>
             <el-col :sm="12" :md="8" :lg="7">
                    <el-form-item :label="object['companyName'].label" :prop="object['companyName'].name">
                      <el-select   v-model="mate.mateFormerHeader.values[object['companyName'].name]"  :placeholder="object['companyName'].placeholder" >
                            <el-option :label="item.label" :value="item.value" v-for="item of companyNameOptions" :key="item.name"></el-option>
                         </el-select>
                    </el-form-item>
                </el-col>
         </el-row>
         <el-row>
          <el-col :sm="12" :md="8" :lg="7">
            <el-form-item :label="object['name'].label" :prop="object['name'].name">
              <el-input  v-model="mate.mateFormerHeader.values[object['name'].name]" ></el-input>
            </el-form-item>
          </el-col>
         </el-row>
          <!--产品参数-->
          <el-row>
          <el-col :sm="12" :md="8" :lg="7">
            <el-form-item :label="object['productParameters'].label" :prop="object['productParameters'].name">
              <!-- <el-button type="text" class="el-icon-plus" @click="showAttributeForm" >添加产品参数</el-button> -->
            </el-form-item>
          </el-col>
          </el-row>
          <!--新增参数显示表单-->
          <!-- <el-row>
            <el-col :sm="12" :md="8" :lg="14">
          <el-col :sm="12" :md="8" :lg="6">
                <span style="margin-left:75%">属性名</span>
                </el-col>
                <el-col :sm="12" :md="8" :lg="1">
                 <span style="margin-left:80%">:</span>
                </el-col>
                <el-col :sm="12" :md="8" :lg="7">
                <span style="margin-left:40%">属性值</span>
                </el-col>
            </el-col>
          </el-row> -->
          <el-row>
            <el-col :sm="12" :md="8" :lg="14">
            <el-form-item  v-for="(propList, index) in dynamicValidateForm.propLists" :key="index"   :rules="custormRules">
                <el-col :sm="12" :md="8" :lg="2">
                <el-button  v-model="propList.name"  type="text" style='color:black'>{{propList.name}}</el-button >
                </el-col>
                <el-col :sm="12" :md="8" :lg="1">
                 <span style="margin-left:45%">:</span>
                </el-col>
                <el-col :sm="12" :md="8" :lg="7">
                <el-input  v-model="propList.propValue" ></el-input >
                </el-col>
                 <el-col :sm="12" :md="8" :lg="7">
                <el-button @click.prevent="removeDomain(propList)" >删除</el-button>
                </el-col>
            </el-form-item>
            </el-col>
          </el-row>
          <el-row><el-button type="text">产品销售信息</el-button></el-row>
          <el-row> 
           <el-col :sm="12" :md="8" :lg="7">
             <el-button type="text" class="showButton">交易信息</el-button>
          </el-col>
          </el-row>
          <el-row>
          <el-col :sm="12" :md="8" :lg="7">
            <el-form-item :label="object['orderOnline'].label" :prop="object['orderOnline'].name">
              <el-radio-group v-model="mate.mateFormerHeader.values[object['orderOnline'].name]">
                <el-radio label="1" >支持</el-radio>
                <el-radio label="2" >不支持</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="7">
             <el-form-item :label="object['whetherIn'].label" :prop="object['whetherIn'].name">
                <el-radio-group v-model="mate.mateFormerHeader.values[object['whetherIn'].name]" @change="changeWhetherIn">
                  <el-radio  label="1" >是</el-radio>
                  <el-radio  label="2" >否</el-radio>
                </el-radio-group>
             </el-form-item>
           </el-col>

          <el-col :sm="12" :md="8" :lg="7">
            <el-form-item :label="object['unit'].label" :prop="object['unit'].name">
                 <dict-selected v-model="mate.mateFormerHeader.values[object['unit'].name]" dictType="goodsUnit" :initValue="mate.mateFormerHeader.values[object['unit'].name]" :rowId='showDict'></dict-selected>
            </el-form-item>
          </el-col>
            <el-col :sm="12" :md="8" :lg="7">
             <el-form-item :label="object['availableNum'].label" :prop="object['availableNum'].name">
               <el-input  v-model="mate.mateFormerHeader.values[object['availableNum'].name]" ></el-input>
             </el-form-item>
           </el-col>

           <el-col :sm="12" :md="8" :lg="7">
             <el-form-item :label="object['price'].label" :prop="object['price'].name">
               <el-input  v-model="mate.mateFormerHeader.values[object['price'].name]"  @blur="bluePrice(mate.mateFormerHeader.values[object['price'].name])"></el-input>
             </el-form-item>
           </el-col>

            <el-col :sm="12" :md="8" :lg="7">
             <el-form-item  v-show="mate.mateFormerHeader.values[object['whetherIn'].name] == 1" :label="object['clustersNum'].label" :prop="object['clustersNum'].name" :rules="ruleWhe">
               <el-input v-model="mate.mateFormerHeader.values[object['clustersNum'].name]" :disabled="showGroup" ></el-input>
             </el-form-item>
           </el-col>


           <el-col :sm="12" :md="8" :lg="7">
                <el-form-item  v-show="mate.mateFormerHeader.values[object['whetherIn'].name] == 1" :label="object['groupFrom'].label" :prop="object['groupFrom'].name" :rules="ruleWheDateFrom">
                   <el-date-picker v-model="mate.mateFormerHeader.values[object['groupFrom'].name]" :disabled="showGroup" >
                 </el-date-picker>
                </el-form-item>
           </el-col>
           <el-col :sm="12" :md="8" :lg="7">
                <el-form-item  v-show="mate.mateFormerHeader.values[object['whetherIn'].name] == 1" :label="object['groupTo'].label" :prop="object['groupTo'].name" :rules="ruleWheDateTo">
                  <el-date-picker v-model="mate.mateFormerHeader.values[object['groupTo'].name]" :disabled="showGroup" >
                 </el-date-picker>
                </el-form-item>
           </el-col>
          </el-row>

           <el-row> 
           <el-col :sm="12" :md="8" :lg="7">
             <el-button type="text" class="showButton">产品图片</el-button>
          </el-col>
          </el-row>
          <el-row>
           <el-col :sm="12" :md="8" :lg="24">
                <el-form-item  :prop="object['imgPath'].name">
                      <el-upload
                        :action="fileuploadUrlLogo"
                        list-type="picture-card"
                        :headers="headers"
                        :file-list="uplFileList"
                        :on-change="handleChangeLogo"
                        :before-upload="beforeUpload"
                        :on-success="handleSuccess"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove"
                        >
                        <i class="el-icon-plus"></i>
                     </el-upload>
                </el-form-item>
           </el-col>
          </el-row>
          <div>
          <span style="color:red; text-align:center;display:block;">第一张为默认主图,建议图片尺寸在750*750像素以上、图片避免全文字</span>
          </div> 
           <el-row> 
           <el-col :sm="12" :md="8" :lg="8">
             <el-button type="text" style="color:black;margin-left:5%">详细说明</el-button>
          <!-- </el-col>
           <el-col :sm="12" :md="8" :lg="7"> -->
           </el-col>
              <el-col :span="15" class="warp-main" >
             <el-form-item >
                <div class="edit_container">
                    <quill-editor v-model="mate.mateFormerHeader.values[object['description'].name]"
                         ref="myQuillEditor"
                         class="editer"
                         :headers="headers"
                          :options="editorOption" @ready="onEditorReady($event)">
                </quill-editor>
                   <el-upload class="upload-demo" :action="qnLocation" :before-upload='beforeUploadDetial' :data="uploadData" :on-success='upScuccess'
                     :headers="headers" ref="upload" >
                    <el-button size="mini" type="primary" id="imgInput" style="display:none">点击上传</el-button>
                   </el-upload>
               </div>
          </el-form-item>
            </el-col>
           </el-row>
           <el-row>
           <el-col :sm="12" :md="8" :lg="10">
             <el-form-item :label="object['validDate'].label" :rules="ruleValidDate" :prop="object['validDate'].name"   v-show="mate.mateFormerHeader.values[object['whetherIn'].name] == 2">
               <el-radio-group v-model="mate.mateFormerHeader.values[object['validDate'].name]" @change="changeTime">
                   <el-radio label="1"  >10天</el-radio>
                   <el-radio label="2"  >20天</el-radio>
                   <el-radio label="3"  >1个月</el-radio>
                   <el-radio label="4"  >3个月</el-radio>
                   <el-radio label="5"  >6个月</el-radio>
               </el-radio-group>
             </el-form-item>
           </el-col>
           </el-row>
          <el-row> 
           <el-col :sm="12" :md="8" :lg="7">
             <el-button type="text" class="showButton">物流运费</el-button>
           </el-col>
          </el-row>

            <el-col :sm="12" :md="8" :lg="7">
             <el-form-item :label="object['deliveryAddress'].label" :prop="object['deliveryAddress'].name">
               <el-input   v-model="mate.mateFormerHeader.values[object['deliveryAddress'].name]"  ></el-input>
             </el-form-item>
           </el-col>

            <el-col :sm="12" :md="8" :lg="7">
             <el-form-item :label="object['freight'].label" :prop="object['freight'].name">
               <el-input   v-model="mate.mateFormerHeader.values['freight']"  ></el-input>
             </el-form-item>
           </el-col>

           <el-col :sm="12" :md="8" :lg="7">
             <el-form-item :label="object['unitWeight'].label" :prop="object['unitWeight'].name">
               <el-input   v-model="mate.mateFormerHeader.values['unitWeight']"  ></el-input>
             </el-form-item>
           </el-col>
       </template>
     </el-form>
    <el-dialog :visible.sync="dialogVisibleImg" width="30%">
        <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
   </el-row>
     <div class="tbutton">
              <el-button size="mini"  plain class="el-icon-document"  @click="handleSubmit" v-show="showButton">提交</el-button>
              <el-button size="mini" plain class="el-icon-close" @click="backward" v-show="showButton">取 消</el-button>
      </div>
 </div>  
</template>
<script>
import { API_GATEWAY } from '@/config/index.js'
import { quillEditor } from 'vue-quill-editor' // 调用编辑器
import { DateFormat, trimSpace, isPositivenumber } from '../../utils/util.js'
// 取小数位后2位
function toDecimal (x) {
  var f = parseFloat(x)
  if (isNaN(f)) {
    return
  }
  f = Math.round(x * 100) / 100
  return f
}
export default {
  components: {
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
    },
    'tree-selected': function index (resolve) {
      require(['../../components/TreeSelected.vue'], resolve)
    },
    quillEditor
  },
  watch: {
    attributeForm: function (val, old) {
      if (val.length !== 0) {
        this.showForm = true
      }
    }
  },
  created () {
    this.mate.mateFormerHeader.fields.map((i) => { this.object[i.name] = i })
    var vm = this
    this.$root.ajaxData('/purchase/th/goods/getCategoryTree', {}, function (data) {
      vm.orgChange(data)
      vm.cascateOption = data
    }, 'GET')
    this.getCompanyName()
    if (this.mate.mateFormerHeader.values.id) {
      this.mate.mateFormerHeader.values.catgId = this.mate.mateFormerHeader.values.catgIds
      this.dynamicValidateForm.propLists = this.mate.mateFormerHeader.values.propList
    } else {
      this.dynamicValidateForm.propLists = []
    }
  },
  data () {
    var validateName = (rule, value, callback) => {
      if (!this.mate.mateFormerHeader.values.id) {
        this.$root.ajaxData('/purchase/th/goods/checkName?name=' + value, {}, function (data) {
          if (data.statusCode === 10010) {
            callback(new Error('您输入的商品名已存在'))
          } else {
            callback()
          }
        }, 'GET')
      } else if (this.mate.mateFormerHeader.values.id) {
        callback()
      }
    }
    var validatePositivenumber = (rule, value, callback) => {
      if (value === undefined || trimSpace(value) === '') {
        callback(new Error('该输入项为必输项'))
      } else {
        if (!isPositivenumber(trimSpace(value))) {
          callback(new Error('请输入正数'))
        } else {
          callback()
        }
      }
    }
    return {
      object: {},
      attributeForm: {},
      cascateOption: [],
      attributeDetialForm: {},
      selectedOptions: [],
      addRange: [],
      imgRoot: '',
      imgRemoveRoot: '',
      uploadData: {},
      showGroup: false,
      editorOption: {},
      qnLocation: API_GATEWAY + '/api/purchase/goods/release/upload',
      companyNameOptions: [],
      fullscreenLoading: false,
      showButton: true,
      showDict: '',
      headers: {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
        'Accept': 'application/json',
        'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId
      },
      uplFileList: [],
      size: 1,
      validDate: '',
      custormRules: [],
      dialogFormVisible: false,
      dialogVisibleImg: false,
      dynamicValidateForm: {
        propLists: [{
          name: '',
          propValue: ''
        }] },
      dialogImageUrl: '',
      labelPosition: 'right',
      showForm: true,
      rules: {
        price: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' },
          { validator: validatePositivenumber, trigger: 'blur' }
        ],
        availableNum:
          { required: true, message: '该输入项为必输项', trigger: 'blur' },
        catgIds:
          { required: true, message: '该输入项为必输项', trigger: 'blur', type: 'array' },
        name: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ],
        orderOnline:
          { required: true, message: '该输入项为必输项', trigger: 'blur' },

        whetherIn:
          { required: true, message: '该输入项为必输项', trigger: 'blur' },

        unit:
          { required: true, message: '该输入项为必输项', trigger: 'blur' },

        // clustersNum: [
        //   { required: true, message: '该输入项为必输项', trigger: 'blur' }
        // ],
        // groupFrom: [
        //   { required: true, message: '该输入项为必输项', trigger: 'blur' }
        // ],
        // groupTo: [
        //   { required: true, message: '该输入项为必输项', trigger: 'blur' }
        // ],
        // imgPath: [
        //   { required: true, message: '该输入项为必输项', trigger: 'blur' }
        // ],
        validDate:
          { required: true, message: '该输入项为必输项', trigger: 'blur' },

        deliveryAddress:
          { required: true, message: '该输入项为必输项', trigger: 'blur' },

        freight:
          { required: true, message: '该输入项为必输项', trigger: 'blur' }

      },
      ruleWhe: { required: true, message: '该输入项为必输项', trigger: 'blur' },
      ruleWheDateFrom: { required: true, message: '该输入项为必输项', trigger: 'blur' },
      ruleWheDateTo: { required: true, message: '该输入项为必输项', trigger: 'blur' },
      ruleValidDate: { required: true, message: '该输入项为必输项', trigger: 'blur' },
      fileuploadUrlLogo: API_GATEWAY + '/zuul/api/purchase/goods/release/upload?trade=trade'
    }
  },
  mounted () {
    // 为图片ICON绑定事件  getModule 为编辑器的内部属性
    this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('image', this.imgHandler)
  },
  props: {
    mate: Object
  },
  computed: {
    // a computed getter
    labelWidth: function () {
      let width = ''
      if (this.mate.inline) {
        // width = undefined
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
  methods: {
    orgChange (data) {
      for (const i of data) {
        i.label = i.name
        i.value = i.id
        if (i.children) {
          this.orgChange(i.children)
        }
      }
    },
    changeTime (n) {
      var myDate = new Date()
      if (n === '1') {
        myDate.setDate(myDate.getDate() + 10)
        var y = myDate.getFullYear()
        var m = myDate.getMonth() + 1 // 获取当前月份的日期
        var d = myDate.getDate()
        this.validDate = y + '-' + m + '-' + d
      } else if (n === '2') {
        myDate.setDate(myDate.getDate() + 20)
        y = myDate.getFullYear()
        m = myDate.getMonth() + 1 // 获取当前月份的日期
        d = myDate.getDate()
        this.validDate = y + '-' + m + '-' + d
      } else if (n === '3') {
        myDate.setDate(myDate.getDate() + 30)
        y = myDate.getFullYear()
        m = myDate.getMonth() + 1 // 获取当前月份的日期
        d = myDate.getDate()
        this.validDate = y + '-' + m + '-' + d
      } else if (n === '4') {
        myDate.setDate(myDate.getDate() + 90)
        y = myDate.getFullYear()
        m = myDate.getMonth() + 1 // 获取当前月份的日期
        d = myDate.getDate()
        this.validDate = y + '-' + m + '-' + d
      } else if (n === '5') {
        myDate.setDate(myDate.getDate() + 180)
        y = myDate.getFullYear()
        m = myDate.getMonth() + 1 // 获取当前月份的日期
        d = myDate.getDate()
        this.validDate = y + '-' + m + '-' + d
      }
    },
    onEditorReady () {
    },
    bluePrice (val) {
      this.mate.mateFormerHeader.values.price = toDecimal(val)
      var m = this.mate.mateFormerHeader.values.price
      this.mate.mateFormerHeader.values.price = m.toString()
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
      this.$refs['upload'].clearFiles()    // 插入成功后清除input的内容
    },
    getCompanyName () {
      var vm = this
      this.$root.ajaxData('/offices/current/topOffices', {}, function (data) {
        data.forEach(i => {
          vm.companyNameOptions.push({ 'label': i.name, 'value': i.name })
        })
        if (vm.companyNameOptions.length === 1) {
          vm.$set(vm.mate.mateFormerHeader.values, 'companyName', vm.companyNameOptions[0].value)
        }
      }, 'GET')
    },
    changeWhetherIn (val) {
      if (val === '2') {
        this.showGroup = true
        this.ruleWhe = {}
        this.ruleWheDateFrom = {}
        this.ruleWheDateTo = {}
        this.ruleValidDate = { required: true, message: '该输入项为必输项' }
      } else {
        this.showGroup = false
        this.ruleWhe = { required: true, message: '该输入项为必输项' }
        this.ruleWheDateFrom = { required: true, message: '该输入项为必输项' }
        this.ruleWheDateTo = { required: true, message: '该输入项为必输项' }
        this.ruleValidDate = {}
      }
    },
    changeCatg (val) {
      var vm = this
      var catgId = val
      catgId = val[val.length - 1]
      this.$root.ajaxData('/purchase/th/goods/getProps/' + catgId, {}, function (data) {
        vm.dynamicValidateForm.propLists = data
      }, 'GET')
    },
    showAttributeForm () {
      this.dynamicValidateForm.propLists.push({
        name: '',
        propValue: ''
      })
    },
    dlgConfirm () {
      this.dialogFormVisible = false
      this.attributeForm.push(this.attributeDetialForm)
    },
    removeDomain (val) {
      var index = this.dynamicValidateForm.propLists.indexOf(val)
      if (index !== -1) {
        this.dynamicValidateForm.propLists.splice(index, 1)
      }
    },
    handleChangeLogo (file, fileList) {
    },
    handleSuccess (response, file, fileList) {
      this.imgRoot = ''
      for (var i = 0; i < fileList.length; i++) {
        this.imgRoot += fileList[i].response + ','
        var root = ''
        root = this.imgRoot.substring(0, this.imgRoot.length - 1)
        this.mate.mateFormerHeader.values.imgPath = root
      }
    },
    beforeUpload (file) {
      var index1 = file.name.lastIndexOf('.')
      var name = file.name.substring(index1, file.name.length)
      if (!/\.(jpg|jpeg|png|JPG|PNG|JPEG)$/.test(name)) {
        this.$message({
          message: '请选择图片格式',
          type: 'warning'
        })
        return false
      }
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisibleImg = true
    },
    handleRemove (file, fileList) {
      this.imgRemoveRoot = ''
      for (var i = 0; i < fileList.length; i++) {
        this.imgRemoveRoot += fileList[i].response + ','
        var root = ''
        root = this.imgRemoveRoot.substring(0, this.imgRemoveRoot.length - 1)
        this.mate.mateFormerHeader.values.imgPath = root
      }
    },
    handleSubmit () {
      var vm = this
      this.mate.mateFormerHeader.values.validDate = this.validDate
      this.mate.mateFormerHeader.values.groupFrom = DateFormat(this.mate.mateFormerHeader.values.groupFrom, 'yyyy-MM-dd')
      this.mate.mateFormerHeader.values.groupTo = DateFormat(this.mate.mateFormerHeader.values.groupTo, 'yyyy-MM-dd')
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          var catgId = this.mate.mateFormerHeader.values.catgIds
          catgId = catgId[catgId.length - 1]
          this.mate.mateFormerHeader.values.catgId = catgId
          this.mate.mateFormerHeader.values.propList = this.dynamicValidateForm.propLists
          this.mate.mateFormerHeader.values.brandId = null
          var mate = {}
          mate = this.mate.mateFormerHeader.values
          if (this.mate.mateFormerHeader.values.id) {
            this.$root.ajaxData('/purchase/th/goods/update', mate, function (data) {
              vm.$root.monitor({ url: '/materials' })
            }, 'PUT')
          } else {
            this.$root.ajaxData('/purchase/th/goods/release', mate, function (data) {
              vm.$root.monitor({ url: '/materials' })
            }, 'POST')
          }
        }
      })
    },
    backward () {
      this.$root.monitor({ url: '/materials' })
    }
  }
}
</script>
<style scoped>
.ql-snow .ql-editor img{
  max-width:50%
}
.el-col-15{
  float: inherit;
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
  margin:0;
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
.el-form-item--mini.el-form-item {
  margin: 6px;
}
.el-input--mini .el-input__inner{
  width:80%
}
.el-input__suffix {
  right:80px
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
.showButton{
  color:black;
  margin-left:5%
}
</style>