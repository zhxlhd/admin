/**
 * 电镀行业-商品发布-供应发布模块新增
 */
<template>
    <div>
      <div class="hbutton">
          <el-button type="primary" class="el-icon-document" @click="handleSubmit()" v-show="isShow" size="mini">提 交</el-button>
          <el-button plain class="el-icon-close" @click="backward()" size="mini">取 消</el-button>
      </div>
      <el-form size="mini" :model="mateForm" :inline="mate.inline" label-position="right" ref="ruleForm" :rules="rules" :label-width="labelWidth">
        <div class="basicInfo"> 
          <el-row><span style="font-size: 15px;">基本信息</span></el-row>
          <el-row><el-col :span="20"><hr></el-col></el-row>
          <el-row>
            <el-form-item label="当前供应类型:">{{infoTypeFilter(mateForm.infoType)}}</el-form-item>
          </el-row>
          <!-- 发布类型 -->
          <el-row>
            <el-col :span="12">
              <el-form-item :label="GObject.publishType.label" :prop="GObject.publishType.name">
                <el-radio-group v-model="mateForm.publishType" size="mini" @change="changePublishType" :disabled="showDisabled">
                  <el-radio v-for="(pType,idx) in  GObject.publishType.options" :key="idx" :value="pType.value" :label="pType.value">{{pType.label}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="mateForm.publishType == '2'">
              <el-form-item :label="GObject.parkId.label" :prop="GObject.parkId.name" :rules="isParkId">
                <dict-selected v-model="mateForm.parkId"
                   :rowId="showDisabled"
                   :initValue="mateForm.parkId"
                   :filterable="GObject.parkId.filterable"
                   :dictType="GObject.parkId.dict"
                   :placeholder="`请选择园区/片区`"
                ></dict-selected>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item :label="GObject.title.label" :prop="GObject.title.name">
                <el-input v-model="mateForm.title" placeholder="请输入标题长度不超过30个字"  maxlength="30" :disabled="showDisabled"></el-input>
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
              <el-form-item :label="GObject.industryId.label" :prop="GObject.industryId.name">
                <el-select v-model="mateForm.industryId" @change="changeIndustryId(mateForm.industryId)" placeholder="请选择" clearable :disabled="showDisabled">
                  <el-option
                    v-for="(item,idx) in industries"
                    :key="idx"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="GObject.payType.label" :prop="GObject.payType.name">
                <el-radio-group v-model="mateForm.payType" size="mini" :disabled="showDisabled">
                  <el-radio v-for="(pType,idx) in GObject.payType.options" :key="idx" :value="pType.value" :label="pType.value">{{pType.label}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="materialInfo">
          <el-row>
            <span style="font-size: 15px;">物料信息</span>
          </el-row>
          <el-row>
            <el-col :span="20"><hr></el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item :label="GObject.goodsCategoryId.label" :prop="GObject.goodsCategoryId.name" >
                <el-select v-model="mateForm.goodsCategoryId" placeholder="请选择" clearable :disabled="showDisabled" @visible-change="changeCategoryId">
                  <el-option
                    v-for="item in goodsCategorys"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="mateForm.infoType == '1'?'工件名称':GObject.goodsName.label" :prop="GObject.goodsName.name">
                <el-input v-model="mateForm.goodsName" placeholder="请输入产品名称长度不超过30个字"  maxlength="30" :disabled="showDisabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="GObject.imgPath.label" :prop="GObject.imgPath.name" >
                <el-upload
                  ref="upload"
                  :limit="5"
                  :action="fileuploadUrl"
                  :on-preview="handlePreview"
                  :headers="headers"
                  :on-remove="handleRemove"
                  :on-success="handleSuccess"
                  :file-list="fileList"
                  :before-upload="beforeAvatarUpload"
                  :on-exceed="handleExceed">
                  <el-button size="mini" :disabled="showDisabled">上传文件</el-button>
                  <span style="font-size: 12px;color: red">当前上传图片不能超过5张!</span>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item :label="mateForm.infoType == '1'?'主要服务行业':GObject.brand.label" :prop="GObject.brand.name">
                <el-input  type= "text"  v-model="mateForm.brand" placeholder="请输入标题长度不超过30个字" :disabled="showDisabled" maxlength="30"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="mateForm.infoType == '1'?'电镀种类':GObject.specification.label" :prop="GObject.specification.name">
                <el-input  type= "text"  v-model="mateForm.specification" placeholder="请输入标题长度不超过30个字" :disabled="showDisabled" maxlength="30"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item :label="mateForm.infoType == '1'?'技术标准':GObject.description.label" :prop="GObject.description.name">
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
        <div class="dealInfo">
          <el-row>
            <span style="font-size: 15px;">交易信息</span>
          </el-row>
          <el-row>
            <el-col :span="20"><hr></el-col>
          </el-row>
          <el-row>
            <!--  五金厂-质量标准  -->
            <el-col :span="6" v-show="mateForm.publishType == '1' && ['0','2','3'].includes(mateForm.infoType)">
              <el-form-item :label="GObject.qualityCriterion.label" :prop="GObject.qualityCriterion.name" :rules="isQualityCriterion">
                <el-input v-model="mateForm.qualityCriterion" placeholder="输入内容" :disabled="showDisabled"></el-input>
              </el-form-item>
            </el-col>
            <!--  电镀厂-电镀要求  -->
            <el-col :span="6" v-show="mateForm.infoType == '1'">
              <el-form-item :label="GObject.askRequire.label" :prop="GObject.askRequire.name" :rules="isAskRequire">
                <el-input v-model="mateForm.askRequire" placeholder="输入内容" :disabled="showDisabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="mateForm.infoType == '1'?'日加工量':GObject.amount.label" :prop="GObject.amount.name">
                <el-input v-model="mateForm.amount" placeholder="输入内容" :disabled="showDisabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item :label="mateForm.infoType == '1'?'加工单价':GObject.price.label" :prop="GObject.price.name">
                <el-input v-model="mateForm.price" placeholder="输入内容" :disabled="mateForm.priceChecked || showDisabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-checkbox v-model="mateForm.priceChecked" @change="changeDiscussPrice" :disabled="showDisabled" style="position: relative;top: 11px;">面议</el-checkbox>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="GObject.isTax.label" :prop="GObject.isTax.name">
                <el-radio-group v-model="mateForm.isTax" size="mini" :disabled="showDisabled">
                  <el-radio v-for="(tax,idx) in  GObject.isTax.options" :key="idx" :value="tax.value" :label="tax.value">{{tax.label}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item :label="GObject.unit.label" :prop="GObject.unit.name">
                <el-input v-model="mateForm.unit" placeholder="输入内容" :disabled="showDisabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="GObject.supplyDate.label" :prop="GObject.supplyDate.name">
                <el-date-picker type="date" v-model="mateForm.supplyDate" :picker-options="pickerOptions2" placeholder="请选择日期" :disabled="showDisabled"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
              <el-form-item :label="GObject.detailAddress.label" :prop="GObject.detailAddress.name">
                <el-col :span="4">
                  <addrselect
                    :disabledFlag="showDisabled"
                    :initselectedvalue="initprovselectedvalueAddr"
                    :addrs="provAddrs"
                    v-model="mateForm.province"
                    @change="provChange"
                    class="select-31"
                    id="prov_select"
                    name="prov" 
                    placeholder="省" lazy ref="Addrselect">
                  </addrselect>
                </el-col>
                <el-col :span="4">
                  <addrselect
                    :disabledFlag="showDisabled"
                    :initselectedvalue="initcityselectedvalueAddr"
                    :addrs="cityAddrs"
                    v-model="mateForm.city"
                    @change="cityChange"
                    class="select-31"
                    id="city_select"
                    name="city" 
                    placeholder="市" lazy>
                  </addrselect>
                </el-col>
                <el-col :span="4">
                  <addrselect
                    :disabledFlag="showDisabled"
                    :initselectedvalue="initregionselectedvalueAddr"
                    :addrs="regionAddrs"
                    v-model="mateForm.county"
                    @change="regionChange"
                    class="select-31"
                    id="region_select"
                    name="region" 
                    placeholder="县" lazy>
                  </addrselect>
                </el-col>
                <el-col :span="6">
                  <el-input v-model="mateForm.detailAddress" placeholder="请输入详细地址长度不超过30个字"  maxlength="30" :disabled="showDisabled"></el-input>
                </el-col>
              </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item :label="GObject.contact.label" :prop="GObject.contact.name">
                <el-input v-model="mateForm.contact" placeholder="输入内容" :disabled="showDisabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="GObject.contactTel.label" :prop="GObject.contactTel.name">
                <el-input v-model="mateForm.contactTel" placeholder="输入内容" :disabled="showDisabled"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
</template>

<script>
import { DateFormat } from '../../utils/util.js'
import { API_GATEWAY } from '@/config/index.js'
import Addrselect from '../../components/address/Addrselect'
import addrArr from '../../components/address/addr-arr.js'
import {validateInteger,validateFloatTwo,validateMobile} from '../../utils/validates/validates.js'
import SERVICES from "@/services"

var validateInter = (rule, value, callback) => {
  if (!value) {
    callback(new Error('该输入项为必输项'))
  } else {
    if (!validateInteger(value)) {
      callback(new Error('请输入正整数'))
    } else {
      callback()
    }
  }
}
var validateFloat = (rule, value, callback) => {
  if (!value) {
    callback(new Error('该输入项为必输项'))
  } else {
    if (value === '面议') {
      callback()
    }
    if (!validateFloatTwo(value)) {
      callback(new Error('请输入数字，最多2位小数'))
    } else {
      callback()
    }
  }
}
var validatePhone = (rule, value, callback) => {
  if (!validateMobile(value)) {
    callback(new Error('请输入正确的11位手机号'))
  } else {
    callback()
  }
}
function getAddrsArrayById (id = 0) {
  return addrArr[id].map(item => {
    return {
      'text': item[1],
      'value': item[0]
    }
  })
}
function getAddressName(id,val) {
    var name = ''
    addrArr[id].map(item=>{
    if(item[0] === val){
      name = item[1]
    }
  })
  return name
}
function getAddressId(id,val) {
    var name = '';
    if(addrArr[id] && addrArr[id].length>0) {
      addrArr[id].map(item=>{
        if(item[1] === val){
          name = item[0]
        }
      })
    }
  return name
}
export default {
  components: {
    Addrselect,
    // 数字词典组件
    DictSelected: function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
    },
  },
  data() {
    return {
      mateForm: {
        priceChecked: false // 增加价钱面议选项
      },
      isEdit: '',    // 用于判断是编辑还是查看
      GObject: {}, //表单信息
      editorOption: {},
      uploadData: {},
      fileList: [],
      qnLocation: API_GATEWAY + '/api/electro/file',
      fileuploadUrl: `${API_GATEWAY}/api/electro/file`,
      headers: {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
        'Accept': 'application/json',
        'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId
      },
      isMaterialInfo: {},
      showDisabled: false,
      initprovselectedvalueAddr: '0',
      initcityselectedvalueAddr: '0',
      initregionselectedvalueAddr: '0',
      provAddrs: getAddrsArrayById(0),
      cityAddrs: [],
      regionAddrs: [],
      industries: [],
      goodsCategorys: [],
      rules: {
        publishType: [{ required: true, message: '请选择发布类型', trigger: 'change' }], // 发布类型
        isTax: [{ required: true, message: '请选择供应类型', trigger: 'change' }], // 税
        title: [{ required: true, message: '该输入项为必输项', trigger: 'blur' }],
        amount: [{ required: true, message: '该输入项为必输项', trigger: 'blur' },
          { validator: validateInter, trigger: 'blur' },
         ],
        goodsCategoryId: [{ required: true, message: '该输入项为必输项', trigger: 'blur' }],
        industryId: [{ required: true, message: '该输入项为必输项', trigger: 'blur' }],
        payType: [{ required: true, message: '请选择付款方式', trigger: 'change' }], // 付款方式
        price:  [
          { required: true, message: '该输入项为必输项', trigger: 'blur' },
          { validator: validateFloat, trigger: 'blur' }
         ],
        fromDate: [{ required: true, message: '该输入项为必输项', trigger: 'change' }],
        toDate: [{ required: true, message: '该输入项为必输项', trigger: 'change' }],
        supplyDate: [{ required: true, message: '该输入项为必输项', trigger: 'change' }],
        contact: [{ required: true, message: '该输入项为必输项', trigger: 'blur' }],
        contactTel: [{ required: true, message: '该输入项为必输项', trigger: 'blur' },
         { validator: validatePhone, trigger: 'blur' }],
        detailAddress: [{ required: true, message: '该输入项为必输项', trigger: 'blur' }],
        unit: [{ required: true, message: '该输入项为必输项', trigger: 'blur' }],
        imgPath: [{ required: true, message: '该输入项为必输项', trigger: 'blur' }],
        unitWeight: [{ validator: validateFloat, trigger: 'blur' }]
      },
      pickerOptions0: this.beginDate(),
      pickerOptions1: this.endDate(),
      pickerOptions2: this.supplyDate(),
      isShow: true,
      isParkId: {}, // 供应商发起园区/片区拼购信息-园区/片区校验是否必填（动态校验）
      isQualityCriterion: {}, // 供应信息-五金厂是否必填（动态校验）
      isAskRequire: {}, // 供应信息-电镀厂是否必填（动态校验）
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
    this.mateForm = this.mate.values;
    this.mate.fields.map((i) => { this.GObject[i.name] = i });
    this.getCurrentUserTenantInfo();
    this.getIndustries()
    this.isEdit = this.mate.values.isEdit
    if(this.isEdit === '0'){ // 查看
      this.showDisabled = true
      this.isShow = false
      this.mateForm.province = getAddressId(0, this.mateForm.province)
      this.mateForm.city = getAddressId(this.mateForm.province, this.mateForm.city)
      this.mateForm.county = getAddressId(this.mateForm.city, this.mateForm.county)
      this.initprovselectedvalueAddr = this.mateForm.province
      this.initcityselectedvalueAddr = this.mateForm.city
      this.initregionselectedvalueAddr = this.mateForm.county
      this.cityAddrs = getAddrsArrayById(this.initprovselectedvalueAddr)
      this.regionAddrs = getAddrsArrayById(this.initcityselectedvalueAddr)
      this.getGoodsCategorys()
    }else if(this.isEdit === '1') {  // 编辑
      this.showDisabled = false
      this.mateForm.province = getAddressId(0, this.mateForm.province)
      // 自动触发地址选择器，避免丢失值
      this.provChange (this.mateForm.province);
      this.mateForm.city = getAddressId(this.mateForm.province, this.mateForm.city)
      // 自动触发地址选择器，避免丢失值
      this.cityChange (this.mateForm.city);
      this.mateForm.county = getAddressId(this.mateForm.city, this.mateForm.county)
      // 自动触发地址选择器，避免丢失值
      this.regionChange (this.mateForm.county);
      this.initprovselectedvalueAddr = this.mateForm.province
      this.initcityselectedvalueAddr = this.mateForm.city
      this.initregionselectedvalueAddr = this.mateForm.county
      this.cityAddrs = getAddrsArrayById(this.initprovselectedvalueAddr)
      this.regionAddrs = getAddrsArrayById(this.initcityselectedvalueAddr)
      this.getGoodsCategorys()
    }
    // 价钱是-1时需要前端转换成“面议”
    if (this.mateForm.price === -1) {
      this.mateForm.priceChecked = true;
      this.mateForm.price = '面议';
    }
    // 根据不同的publishType（供应类型）展示不同字段的必填*符号
    if(this.mateForm.publishType == '1'){
      switch (this.mateForm.infoType) {
        case '1': this.isAskRequire = { required: true, message: '该输入项为必输项' }; break;
        case '2': this.isQualityCriterion = { required: true, message: '该输入项为必输项' }; break;
        default:break;
      }
    }else if(this.mateForm.publishType == '2'){
      this.isParkId = { required: true, message: '该输入项为必输项' };
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
            if(['2'].includes(vm.mateForm.publishType)){
              // 供应类型为五金厂、电镀厂时，有效日期最多七天
              return time.getTime() > (new Date(vm.mateForm.fromDate).getTime() + 3600*1000*24*7) || time.getTime() <= new Date(vm.mateForm.fromDate).getTime();
            }else{
              return time.getTime() <= new Date(vm.mateForm.fromDate).getTime();
            }
          }
        }
      }
    },
    supplyDate () {
      return {
        disabledDate (time) {
          return time.getTime() < Date.now()- 8.64e7;
        }
      }
    },
    // 获取行业列表
    getIndustries() {
      var vm = this
      this.$root.ajaxData('/electro/th/demand/industries', {}, function (data) {
        for(let i = 0; i < data.length; i++){
           vm.industries.push({ label: data[i].name, value: data[i].id, key: data[i].id })
        }
      }, 'GET')
    },
    changeCategoryId(flag){
      if(flag){
        if(!this.mateForm.industryId){
          this.$message({
            message: '请选择所属行业',
            type: 'warning'
          })
          return
        }
      }
    },
    // 根据行业id查询父类目列表
    getGoodsCategorys() {
      var vm = this
      const val = this.mateForm.industryId
      this.$root.ajaxData(`/electro/th/demand/getPcatg/${val}`, {}, function (data) {
        for(let i = 0; i < data.length; i++){
          vm.goodsCategorys.push({ label: data[i].name, value: data[i].id, key: data[i].id })
        }
      }, 'GET')
    },
    // 修改行业列表数据
    changeIndustryId(val) {
      if(!val){
        this.mateForm.goodsCategoryId = '' 
      }else {
        this.mateForm.goodsCategoryId = '' 
        this.getGoodsCategorys()
      }
    },
     // 省
    provChange (val) {
      const oldVal = this.mateForm.province
      if (val !== '') {
        if (val !== oldVal) {
          if (val !== '0' && val !== 0) {
            this.cityAddrs = getAddrsArrayById(val)
          } else {
            this.cityAddrs = []
          }
          this.citySelected = '0'
        }
      } else {
        this.cityAddrs = []
      }
      this.mateForm.province1 = getAddressName(0,val)
    },
    // 市
    cityChange (val) {
      const oldVal = this.mateForm.city
      if (val !== '') {
        if (val !== oldVal) {
          if (val !== '0' && val !== 0) {
            this.regionAddrs = getAddrsArrayById(val)
          } else {
            this.regionAddrs = []
          }
          this.regionSelected = '0'
        }
      } else {
        this.regionAddrs
      }
      this.mateForm.city1 = getAddressName(this.mateForm.province,val)
    },
    // 县
    regionChange (val) {
      this.mateForm.county1 = getAddressName(this.mateForm.city,val)
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
      if(this.mateForm.publishType == '2' && (new Date(this.mateForm.toDate).getTime() > (new Date(this.mateForm.fromDate).getTime() + 3600*1000*24*7))) {
        vm.$message({
          message: '有效日期限制不超过7天',
          type: 'warning'
        })
        return
      }
      this.$refs.ruleForm.validate((valid) => {
        if(valid){
          this.mateForm.province = this.mateForm.province1
          this.mateForm.city = this.mateForm.city1
          this.mateForm.county = this.mateForm.county1
          let url = '/electro/th/supply/all-list'
          this.mateForm.fromDate = DateFormat(this.mateForm.fromDate, 'yyyy-MM-dd')
          this.mateForm.toDate = DateFormat(this.mateForm.toDate, 'yyyy-MM-dd')
          this.mateForm.supplyDate = DateFormat(this.mateForm.supplyDate, 'yyyy-MM-dd')
          // 价钱面议的时候需要转化成-1，传给后端，后端价钱只接收Number数据类型
          this.mateForm.price = this.mateForm.price === '面议' ? this.mateForm.price = -1:parseFloat(this.mateForm.price)
          let params = this.mateForm
          if(this.$store && this.$store.state.GoodsRelease['supplyToSaveFlag'] && this.$store.state.GoodsRelease['supplyToSaveFlag'] =='copy') {
            // 复制提交时id置零（复制功能 ≈ 新增功能）
            params.id = null;
          } 
          if (!params.id) {
            this.$root.ajaxData('/electro/th/supply/add', params, function (data) {
              if(data.code == 200){
                vm.$root.monitor({ url, method: 'GET' })
              }
            }, 'POST')
          }else {
            this.$root.ajaxData('/electro/th/supply/update/' + params.id, params, function (data) {
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
    onEditorReady() {},
    // 取消
    backward () {
      this.$root.monitor({ url: '/electro/th/supply/all-list' })
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
    imgHandler (state) {
      this.addRange = this.$refs.myQuillEditor.quill.getSelection()
      if (state) {
        const fileInput = document.getElementById('imgInput')
        fileInput.click() // 加一个触发事件
      }
      this.uploadType = 'image'
    },
    handlePreview (file) {
    },
    handleRemove (file, fileList) {
      this.imgRemoveRoot = ''
      for (var i = 0; i < fileList.length; i++) {
        this.imgRemoveRoot += fileList[i].response + ','
        var root = ''
        root = this.imgRemoveRoot.substring(0, this.imgRemoveRoot.length - 1)
      }
      this.mateForm.imgPath = root
    },
    handleSuccess (response, file, fileList) {
      this.imgRoot = ''
      for (var i = 0; i < fileList.length; i++) {
        this.imgRoot += fileList[i].response + ','
        var root = ''
        root = this.imgRoot.substring(0, this.imgRoot.length - 1)
        this.mateForm.imgPath = root
      }
    },
    beforeAvatarUpload (file) {
      let fileName = file.name;
      let index = fileName.lastIndexOf('.');
      let name = fileName.substring(index, fileName.length);
      if (!/\.(jpg|jpeg|png|bmp|gif|JPG|PNG|JPEG|BMP|GIF)$/.test(name)) {
        this.$message({
          message: '请选择图片格式',
          type: 'warning'
        })
        // 清空文件
        // this.fileList = [];
        return false;
      }
    },
    /**
     * @description: 发布类型change事件
     * @params: val 选中的 Radio label 值
     * Created by yxj on 2020-04-15
     * Updated by yxj on 2020-04-21 需求变更
     **/
    changePublishType(val) {
      this.isParkId = {};
      this.isQualityCriterion = {};
      if(val === '2') { // 拼购-供应商
        if(this.mateForm.infoType !== '3') {
          this.mateForm.publishType = '';
          this.$message({
            message: '只有供应商身份才能选择拼购信息发布',
            type: 'warning'
          });
          return;
        }else{
          this.isParkId = { required: true, message: '该输入项为必输项', trigger: 'change' };
        }
      }else if(val === '1') {
        if(['0','2','3'].includes(this.mateForm.infoType)) { // 供应信息-五金厂、供应商、其他
          this.isQualityCriterion = { required: true, message: '该输入项为必输项', trigger: 'blur' };
        }else{ // 供应信息-电镀厂
          this.isAskRequire = { required: true, message: '该输入项为必输项', trigger: 'blur' };
        }
      }
    },
    /**
     * @description: 文件超出个数限制时的钩子
     * @params:
     * Created by yxj on 2020-04-15
     **/
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    /**
     * @description: 供应类型数字转换成汉字
     * @params: cellValue 供应类型数字形势
     * Created by yxj on 2020-04-21
     **/
    infoTypeFilter(cellValue) {
      const status = {
        '0': () => "其他",
        '1': () => "电镀厂",
        '2': () => "五金厂",
        '3': () => "供应商",
        default: () => (cellValue || "")
      };
      return (status[cellValue] || status.default)();
    },
    /**
     * @description: 获取当前登录人租户信息
     * @params:
     * Created by yxj on 2020-04-23
     **/
    getCurrentUserTenantInfo () {
      SERVICES.ELECTROPLATING_PORTAL.getTenantInfo().then(res => {
        if(res.data) {
          this.mateForm.infoType = res.data.infoType;
        }
      });
    },
    /*
     *@Description: 面议选择时价钱传值-1给后端（与后端约定price只能是Number类型，-1代表价钱面议）
     *@ClassAuthor: Yxj
     *@Date: 2020-07-03 10:02:55
    */
    changeDiscussPrice() {
      this.mateForm.priceChecked ? this.mateForm.price = '面议' : this.mateForm.price = '';
    }
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
  .basicInfo{
    margin-bottom: 30px;
  }
  .materialInfo{
    margin-bottom: 30px;
  }
</style>
