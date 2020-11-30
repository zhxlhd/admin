<template>
  <div>
    <el-row>
      <el-form size="mini" :model="mate.mateFormerHeader.values" :inline="mate.inline" ref="ruleForm1"  :rules="rules" :label-width="labelWidth">
        <template>
          <el-row>
            <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['name'].label"  :prop="object['name'].name">
                  <el-input disabled v-model="mate.mateFormerHeader.values[object['name'].name]"></el-input>
                </el-form-item>
            </el-col>
          </el-row>
          <el-button type="text">基本资料</el-button>
          <el-row>
            <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="object['logo'].label"  :prop="object['logo'].name">
               <el-upload
                   :action="fileuploadUrlLogo"
                   :headers="headers"
                   list-type="picture"
                   :file-list="uplFileListLogo"
                   :on-change="handleChangeLogo"
                   :before-upload="beforeUploadLogo"
                   :on-success="handleSuccessLogo"
                   :on-preview="handlePictureCardPreviewLogo"
                   :on-remove="handleRemoveLogo"
                   >
                 <el-button slot="trigger" class ='el-icon-plus' size="mini" >选择图片</el-button>
                 <el-button type="primary" size="mini" @click="submitUpload(uplFileListLogo)">查看</el-button>
                </el-upload>
                </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['companyName'].label"  :prop="object['companyName'].name">
                  <el-input disabled v-model="mate.mateFormerHeader.values[object['companyName'].name]"></el-input>
                </el-form-item>
            </el-col>
             <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['shortName'].label"  :prop="object['shortName'].name">
                  <el-input  v-model="mate.mateFormerHeader.values[object['shortName'].name]"></el-input>
                </el-form-item>
            </el-col>
             <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['industry'].label"  :prop="object['industry'].name">
                  <dict-selected v-model="mate.mateFormerHeader.values[object['industry'].name]" dictType="industry" :initValue="mate.mateFormerHeader.values[object['industry'].name]"></dict-selected>
                </el-form-item>
            </el-col>
           </el-row>
          <el-row>
            <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['enterpriseNature'].label"  :prop="object['enterpriseNature'].name">
                   <dict-selected v-model="mate.mateFormerHeader.values[object['enterpriseNature'].name]" dictType="natureCompany" :initValue="mate.mateFormerHeader.values[object['enterpriseNature'].name]"></dict-selected>
                </el-form-item>
            </el-col>

             <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['incorporationDate'].label"  :prop="object['incorporationDate'].name">
                  <el-date-picker v-model="mate.mateFormerHeader.values[object['incorporationDate'].name]" type="date" placeholder="选择日期"></el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['size'].label"  :prop="object['size'].name">
                  <dict-selected v-model="mate.mateFormerHeader.values[object['size'].name]" dictType="enterpriseScale" :initValue="mate.mateFormerHeader.values[object['size'].name]"></dict-selected>
                </el-form-item>
            </el-col>
            </el-row>
          <el-row>
             <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['registeredCapital'].label"  :prop="object['registeredCapital'].name">
                  <el-input  v-model="mate.mateFormerHeader.values[object['registeredCapital'].name]"></el-input>
                </el-form-item>
            </el-col>
          
             <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['corporation'].label"  :prop="object['corporation'].name">
                  <el-input  v-model="mate.mateFormerHeader.values[object['corporation'].name]"></el-input>
                </el-form-item>
            </el-col>

            <!-- <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['organizingCode'].label"  :prop="object['organizingCode'].name">
                  <el-input  v-model="mate.mateFormerHeader.values[object['organizingCode'].name]"></el-input>
                </el-form-item>
            </el-col> -->
             <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['contacts'].label"  :prop="object['contacts'].name">
                  <el-input  v-model="mate.mateFormerHeader.values[object['contacts'].name]"></el-input>
                </el-form-item>
            </el-col>
              </el-row>
             <el-row>
           
          
            <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['telephone'].label"  :prop="object['telephone'].name">
                  <el-input  v-model="mate.mateFormerHeader.values[object['telephone'].name]"></el-input>
                </el-form-item>
            </el-col>
            <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['email'].label"  :prop="object['email'].name">
                  <el-input  v-model="mate.mateFormerHeader.values[object['email'].name]"></el-input>
                </el-form-item>
            </el-col>
            <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['qq'].label"  :prop="object['qq'].name">
                  <el-input  v-model="mate.mateFormerHeader.values[object['qq'].name]"></el-input>
                </el-form-item>
            </el-col>

             <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['website'].label"  :prop="object['website'].name">
                  <el-input  v-model="mate.mateFormerHeader.values[object['website'].name]"></el-input>
                </el-form-item>
            </el-col>
            
            <el-col :sm="12" :md="8" :lg="16">
            <el-form-item :label="object['registerAddress'].label">
              <addrselect
                  :disabledFlag="disabledFlagBank"
                  :initselectedvalue="initprovselectedvalue"
                  :addrs="provAddrs"
                  v-model="mate.mateFormerHeader.values[object['province'].name]"
                  @change="provChange"
                  class="select-31"
                  id="prov_select"
                  name="prov" lazy
                  style="width:20%"
                  >
              </addrselect>
           
            <addrselect
                :disabledFlag="disabledFlagBank"
                :initselectedvalue="initcityselectedvalue"
                :addrs="cityAddrs"
                v-model="mate.mateFormerHeader.values[object['city'].name]"
                @change="cityChange"
                class="select-31"
                id="city_select"
                name="city" lazy
                style="width:20%"
                >
            </addrselect>
            <addrselect
                      :disabledFlag="disabledFlagBank"
                      :initselectedvalue="initregionselectedvalue"
                      :addrs="regionAddrs"
                      v-model="mate.mateFormerHeader.values[object['county'].name]"
                      @change="regionChange"
                      class="select-31"
                      id="region_select"
                      name="region" lazy
                      style="width:20%"
                      >
            </addrselect>
            <el-input  v-model="mate.mateFormerHeader.values[object['address'].name]" style="width:38%"></el-input>
           
            </el-form-item>               
            </el-col>
             <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['zipcode'].label"  :prop="object['zipcode'].name">
                  <el-input  v-model="mate.mateFormerHeader.values[object['zipcode'].name]"></el-input>
                </el-form-item>
            </el-col>
            <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['introduction'].label"  :prop="object['introduction'].name">
                  <el-input type="textarea"  v-model="mate.mateFormerHeader.values[object['introduction'].name]"></el-input>
                </el-form-item>
            </el-col>
          </el-row>
           <el-button type="text">资质材料</el-button>
          <el-row>
            <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['businessType'].label"  :prop="object['businessType'].name">
                   <dict-selected v-model="mate.mateFormerHeader.values[object['businessType'].name]" dictType="businessType" :initValue="mate.mateFormerHeader.values[object['businessType'].name]" @input="changeBussiness(mate.mateFormerHeader.values[object['businessType'].name])"></dict-selected>
                </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['codeCredit'].label"  :prop="object['codeCredit'].name" >
                  <el-input  v-model="mate.mateFormerHeader.values[object['codeCredit'].name]"></el-input>
                </el-form-item>
            </el-col>

             <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['businessTerm'].label"  :prop="object['businessTerm'].name" v-show="show" :rules="ruleShow">
                  <el-input  v-model="mate.mateFormerHeader.values[object['businessTerm'].name]"></el-input>
                </el-form-item>
            </el-col>

            <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['regAuthority'].label"  :prop="object['regAuthority'].name" v-show="show" :rules="ruleShow">
                  <el-input  v-model="mate.mateFormerHeader.values[object['regAuthority'].name]"></el-input>
                </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['introduction'].label"  :prop="object['introduction'].name" v-show="show" :rules="ruleShow">
                  <el-input  v-model="mate.mateFormerHeader.values[object['introduction'].name]"></el-input>
                </el-form-item>
            </el-col>

            <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['businessScope'].label"  :prop="object['businessScope'].name" v-show="show" :rules="ruleShow">
                  <el-input  v-model="mate.mateFormerHeader.values[object['businessScope'].name]"></el-input>
                </el-form-item>
            </el-col>

             <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['mainProducts'].label"  :prop="object['mainProducts'].name" v-show="show" :rules="ruleShow">
                  <el-input  v-model="mate.mateFormerHeader.values[object['mainProducts'].name]"></el-input>
                </el-form-item>
            </el-col>
          </el-row>
          <div>
          <span style="text-align:center; color:red;display:block;">{{$t('Warm tips')}}  <el-button type="text" @click="showInfor">{{$t('Membership')}}</el-button></span>
          </div>
          <el-row>
            <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="object['businessPhoto'].label"  :prop="object['businessPhoto'].name">
                  <span style="display:none;">{{mate.mateFormerHeader.values[object['businessPhoto'].name]}}</span>
                  <el-upload
                   :action="fileuploadUrlLogo"
                   :headers="headers"
                   list-type="picture"
                   :file-list="uplFileListBusiness"
                   :on-change="handleChangeBusiness"
                   :before-upload="beforeUploadBusiness"
                   :on-success="handleSuccessBusiness"
                   :on-preview="handlePictureCardPreviewBusiness"
                   :on-remove="handleRemoveBusiness">
                 <el-button slot="trigger" class ='el-icon-plus' size="mini" >选择图片</el-button>
                 <el-button type="primary" size="mini" @click="submitUpload(uplFileListBusiness)">查看</el-button>
                </el-upload>
                </el-form-item>
            </el-col>

             <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="object['corporationPhoto'].label"  :prop="object['corporationPhoto'].name" v-show="show" :rules="ruleShow"> 
                  <el-upload
                   :action="fileuploadUrlLogo"
                   :headers="headers"
                   list-type="picture"
                   :file-list="uplFileListCorporation"
                   :on-change="handleChangeCorporation"
                   :before-upload="beforeUploadCorporation"
                   :on-success="handleSuccessCorporation"
                   :on-preview="handlePictureCardPreviewCorporation"
                   :on-remove="handleRemoveCorporation">
                 <el-button slot="trigger" class ='el-icon-plus' size="mini" >选择图片</el-button>
                 <el-button type="primary" size="mini" @click="submitUpload(uplFileListCorporation)">查看</el-button>
                </el-upload>
                </el-form-item>
            </el-col>

             <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="object['authPersonPhoto'].label"  :prop="object['authPersonPhoto'].name" v-show="show" :rules="ruleShow">
                   <el-upload
                   :action="fileuploadUrlLogo"
                   :headers="headers"
                   list-type="picture"
                   :file-list="uplFileListAuth"
                   :on-change="handleChangeAuth"
                   :on-success="handleSuccessAuth"
                   :before-upload="beforeUploadAuth"
                   :on-preview="handlePictureCardPreviewAuth"
                   :on-remove="handleRemoveAuth">
                 <el-button slot="trigger" class ='el-icon-plus' size="mini" >选择图片</el-button>
                 <el-button type="primary" size="mini" @click="submitUpload(uplFileListAuth)">查看</el-button>
                </el-upload>
                </el-form-item>
            </el-col>

            <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="object['busLicensePhoto'].label"  :prop="object['busLicensePhoto'].name" v-show="show" :rules="ruleShow">
                   <el-upload
                   :action="fileuploadUrlLogo"
                   :headers="headers"
                   list-type="picture"
                   :file-list="uplFileListLicense"
                   :on-change="handleChangeLicense"
                   :before-upload="beforeUploadLicense"
                   :on-success="handleSuccessLicense"
                   :on-preview="handlePictureCardPreviewLicense"
                   :on-remove="handleRemoveLicense">
                 <el-button slot="trigger" class ='el-icon-plus' size="mini" >选择图片</el-button>
                 <el-button type="primary" size="mini" @click="submitUpload(uplFileListLicense)">查看</el-button>
                </el-upload>
                </el-form-item>
            </el-col>
          </el-row>
            <el-dialog :visible.sync="dialogVisible" width="30%">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
            <el-dialog
                title="查看会员资料格式要求"
                :visible.sync="dialogVisibleInformation"
                 width="30%">
                <span style="display:block;">{{$t('Scanned copy')}}</span>
                <span style="display:block;">{{$t('Please upload')}}</span>
                <span style="display:block;">{{$t('Photo format')}}</span>
                <span style="display:block;">{{$t('Pixel requirement')}}</span>
                <span slot="footer" class="dialog-footer">
                  <el-button type="primary" size="mini" @click="dialogVisibleInformation = false">确 定</el-button>
                </span>
            </el-dialog>
              <el-dialog
                title="提示"
                :visible.sync="dialogVisibleSubmit"
                 width="30%">
                <span style="display:block;">
                     {{$t('Submit success')}} 您可以：
                     去 <a style="text-decoration:none;color:#409EFF" href="javascript:void (0);" @click="goTradeHall">交易大厅</a> 看看 或者 <a style="text-decoration:none;color:#409EFF" href="javascript:void (0);" @click="submitInfor">留在本页</a>
                </span>
                <!-- <span slot="footer" class="dialog-footer">
                  <el-button type="primary" size="mini" @click="submitInfor">确 定</el-button>
                </span> -->
            </el-dialog>

            <!--<el-form-item :label="object['fromEbs'].label"  :prop="object['fromEbs'].name"  >-->
                <!--<el-switch-->
                        <!--v-model="formEbs"-->
                        <!--active-color="#13ce66"-->
                        <!--inactive-color="#909399"-->
                        <!--@change="fromEbsChange($event)">-->
                <!--</el-switch>-->
            <!--</el-form-item>-->
            <!--<el-dialog-->
                    <!--title="供应商信息校验"-->
                    <!--:visible.sync="supplierInfoCheckDialog"-->
                    <!--width="50%"-->
                    <!--center>-->
                <!--<el-form ref="supplierForm" :model="supplierCheckForm" :rules="supplierRules"  label-width="100px">-->
                    <!--<el-form-item label="公司名"  prop="companyName"><el-input v-model="supplierCheckForm.companyName" ></el-input></el-form-item>-->
                    <!--<el-form-item label="法人代表"   prop="legalPerson"><el-input v-model="supplierCheckForm.legalPerson" ></el-input></el-form-item>-->
                    <!--<el-form-item label="注册资金"    prop="regFound"><el-input v-model="supplierCheckForm.regFound" ></el-input></el-form-item>-->
                    <!--<el-form-item label="营业执照号"  prop="busLicense"><el-input v-model="supplierCheckForm.busLicense"  ></el-input></el-form-item>-->
                    <!--<el-form-item label="公司地点"   prop="companyAddress"><el-input v-model="supplierCheckForm.companyAddress"  ></el-input></el-form-item>-->
                    <!--<el-form-item label="银行账号"  prop="bankInfo"><el-input v-model="supplierCheckForm.bankInfo"  ></el-input></el-form-item>-->
                    <!--<el-form-item label="联系人"  prop="contact"><el-input v-model="supplierCheckForm.contact"></el-input></el-form-item>-->
                    <!--<el-form-item label="联系人电话"   prop="contactPhone"><el-input v-model="supplierCheckForm.contactPhone"></el-input></el-form-item>-->
                    <!--<el-form-item>-->
                        <!--<el-button @click="supplierInfoCheckDialog = false,formEbs=false">取 消</el-button>-->
                        <!--<el-button type="primary" @click="supplierInfoCheck()">确 定</el-button>-->
                    <!--</el-form-item>-->
                <!--</el-form>-->

            <!--</el-dialog>-->

            <el-checkbox v-model="openClcpInfoState" @change="openClcpInfoPage()">是否开启供应链金融服务</el-checkbox>


            <el-dialog title="驳回原因" :visible.sync="dialogVisibleReason" width="30%">
              <span class="reason">{{ list.rejectReason }}</span>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="mini" @click="dialogVisibleReason = false">确 定</el-button>
              </span>
            </el-dialog>
        </template>
      </el-form>
    </el-row>
     <div style="margin-top:30px;margin-bottom:20px">
      <el-button type="primary" size="mini"  @click="handleSubmit">提 交</el-button>
      <el-button  size="mini" @click="backward">取 消</el-button>
    </div>
  </div>
</template>
<script>
import CountrySelect from '../../components/CountrySelect.vue'
import addrArr from '../../components/address/addr-arr.js'
import Addrselect from '../../components/address/Addrselect'
import { DateFormat } from '../../utils/util.js'
import { isZh } from '../../utils/util.js'
import { API_GATEWAY, tradeHallUrl } from '@/config/index.js'
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
    var name = ''
    addrArr[id].map(item=>{
    if(item[1] === val){
      name = item[0]
    }
  })
  return name
}
export function trimSpace (str) {
  try {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
  } catch (e) {
    return str
  }
}
var validateShortName = (rule, value, callback) => {
  if (!isZh(trimSpace(value))) {
    callback(new Error('请输入中文简称'))
  } else {
    callback()
  }
}
export default {
  data () {
    return {
      object: {},
      rules: {
        name:
          { required: true, message: '该输入项为必输项' },
        enterpriseNature:
          { required: true, message: '该输入项为必输项' }, 
        incorporationDate:{
          required: true, message: '该输入项为必输项'
        },
        registeredCapital:
          { required: true, message: '该输入项为必输项' },
        corporation:
          { required: true, message: '该输入项为必输项' },
        // organizingCode:
        //   { required: true, message: '该输入项为必输项' },
        registerAddress:
          { required: true, message: '该输入项为必输项' },
        shortName: [
          { required: true, message: '该输入项为必输项' },
          { validator: validateShortName, trigger: 'blur' }
        ],
        contacts:
          { required: true, message: '该输入项为必输项' },
        email:
          { required: true, message: '该输入项为必输项' },
        businessType:
          { required: true, message: '该输入项为必输项' },
        codeCredit:
          { required: true, message: '该输入项为必输项' },
        businessPhoto:
          { required: true, message: '该输入项为必输项' },
        zipcode:
          { required: true, min: 6, max: 6, message: '请输入6位数组的邮政编码', trigger: 'blur' }
      },
        supplierRules:{
            legalPerson:
                { required: true, message: '该输入项为必输项' },
            regFound:
                { required: true, message: '该输入项为必输项' },
            busLicense:
                { required: true, message: '该输入项为必输项' },
            companyAddress:
                { required: true, message: '该输入项为必输项' },
            bankInfo:
                { required: true, message: '该输入项为必输项' },
            contact:
                { required: true, message: '该输入项为必输项' },
            contactPhone:
                { required: true, message: '该输入项为必输项' }
        },
      ruleShow: { required: true, message: '该输入项为必输项' },
      disabledFlagBank: false,
      initprovselectedvalue: '0',
      initcityselectedvalue: '0',
      initregionselectedvalue: '0',
      dialogVisible: false,
      selName: '',
      userType: '',
      dialogVisibleInformation: false,
      supplierInfoCheckDialog: false,
      provAddrs: getAddrsArrayById(0),
      cityAddrs: [],
      regionAddrs: [],
      show: true,
      dialogImageUrl: '',
      dialogVisibleSubmit: false,
      size: 1,
      fileuploadUrlLogo: API_GATEWAY + '/zuul/api/companys/uploadDetail',
      headers: {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
        'Accept': 'application/json',
        'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId
      },
      uplFileListLogo: [],
      uplFileListBusiness: [],
      uplFileListCorporation: [],
      uplFileListAuth: [],
      uplFileListLicense: [],
      dialogVisibleReason: false,
      list: {},
      formEbs:false,
     clcpInfoDialog:false,
      supplierCheckForm: {
            companyName:'',
            legalPerson:'',
            regFound:'',
            busLicense:'',
            companyAddress:'',
            bankInfo:'',
            contact:'',
            contactPhone:''
      },
    openClcpInfoState:false,
    }
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
        width = '120px'
      } else if (typeof (this.mate.labelWidth) === 'undefined') {
        width = '120px'
      } else {
        width = this.mate.labelWidth
      }
      return width
    }
  },
  components: {
    'tree-selected': function index (resolve) {
      require(['../../components/TreeSelected.vue'], resolve)
    },
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
    },
    CountrySelect,
    Addrselect
  },
  created () {
    this.mate.mateFormerHeader.fields.map((i) => { this.object[i.name] = i })
    if (this.mate.mateFormerHeader.values.companyId !== null) {
      this.selName = this.mate.mateFormerHeader.values.name
      this.mate.mateFormerHeader.values.companyName = this.mate.mateFormerHeader.values.tenantCompanyName
      this.mate.mateFormerHeader.values.name = this.mate.mateFormerHeader.values.tenantCompanyName
    } else {
      this.selName = this.mate.mateFormerHeader.values.name
      this.mate.mateFormerHeader.values.companyName = this.mate.mateFormerHeader.values.name
    }
    this.userType = this.mate.mateFormerHeader.values.status
    if (this.mate.mateFormerHeader.values.businessType === '0') {
      this.show = false
      this.ruleShow = {}
    } else {
      this.show = true
      this.ruleShow = { required: true, message: '该输入项为必输项' }
    }
    if (this.mate.mateFormerHeader.values.logo) {
      if (this.mate.mateFormerHeader.values.logo !== undefined && this.mate.mateFormerHeader.values.logo !== null && trimSpace(this.mate.mateFormerHeader.values.logo) !== '') {
        var file = {}
        file.percentage = 100
        file.response = this.mate.mateFormerHeader.values.logo
        file.status = 'success'
        file.url = this.mate.mateFormerHeader.values.logo
        this.uplFileListLogo.push(file)
      }
    }
    if (this.mate.mateFormerHeader.values.businessPhoto) {
      if (this.mate.mateFormerHeader.values.businessPhoto !== undefined && this.mate.mateFormerHeader.values.businessPhoto !== null && trimSpace(this.mate.mateFormerHeader.values.businessPhoto) !== '') {
        file = {}
        file.percentage = 100
        file.response = this.mate.mateFormerHeader.values.businessPhoto
        file.status = 'success'
        file.url = this.mate.mateFormerHeader.values.businessPhoto
        this.uplFileListBusiness.push(file)
      }
    }
    if (this.mate.mateFormerHeader.values.corporationPhoto) {
      if (this.mate.mateFormerHeader.values.corporationPhoto !== undefined && this.mate.mateFormerHeader.values.corporationPhoto !== null && trimSpace(this.mate.mateFormerHeader.values.corporationPhoto) !== '') {
        file = {}
        file.percentage = 100
        file.response = this.mate.mateFormerHeader.values.corporationPhoto
        file.status = 'success'
        file.url = this.mate.mateFormerHeader.values.corporationPhoto
        this.uplFileListCorporation.push(file)
      }
    }
    if (this.mate.mateFormerHeader.values.authPersonPhoto) {
      if (this.mate.mateFormerHeader.values.authPersonPhoto !== undefined && this.mate.mateFormerHeader.values.authPersonPhoto !== null && trimSpace(this.mate.mateFormerHeader.values.authPersonPhoto) !== '') {
        file = {}
        file.percentage = 100
        file.response = this.mate.mateFormerHeader.values.authPersonPhoto
        file.status = 'success'
        file.url = this.mate.mateFormerHeader.values.authPersonPhoto
        this.uplFileListAuth.push(file)
      }
    }
    if (this.mate.mateFormerHeader.values.busLicensePhoto) {
      if (this.mate.mateFormerHeader.values.busLicensePhoto !== undefined && this.mate.mateFormerHeader.values.busLicensePhoto !== null && trimSpace(this.mate.mateFormerHeader.values.busLicensePhoto) !== '') {
        file = {}
        file.percentage = 100
        file.response = this.mate.mateFormerHeader.values.busLicensePhoto
        file.status = 'success'
        file.url = this.mate.mateFormerHeader.values.busLicensePhoto
        this.uplFileListLicense.push(file)
      }
    }
    if (this.mate.mateFormerHeader.values.rejectReason) {
      this.dialogVisibleReason = true
      this.list = this.mate.mateFormerHeader.values
    }
    this.mate.mateFormerHeader.values.province = getAddressId(0, this.mate.mateFormerHeader.values.province)
    this.mate.mateFormerHeader.values.city = getAddressId(this.mate.mateFormerHeader.values.province, this.mate.mateFormerHeader.values.city)
    this.mate.mateFormerHeader.values.county = getAddressId(this.mate.mateFormerHeader.values.city, this.mate.mateFormerHeader.values.county)
    this.initprovselectedvalue = this.mate.mateFormerHeader.values.province
    this.initcityselectedvalue = this.mate.mateFormerHeader.values.city
    this.initregionselectedvalue = this.mate.mateFormerHeader.values.county
    this.cityAddrs = getAddrsArrayById(this.initprovselectedvalue)
    this.regionAddrs = getAddrsArrayById(this.initcityselectedvalue)
  },
  methods: {
      openClcpInfoPage(){
          if(this.openClcpInfoState==true){
              this.$message({
                  message: '将为您开通金票系统所需的角色和权限！',
                  type: 'success'
              })
          }
      },
    provChange (val) {
      const oldVal = this.mate.mateFormerHeader.values.province
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
      this.mate.mateFormerHeader.values.province1 = getAddressName(0,val)
    },
    cityChange (val) {
      const oldVal = this.mate.mateFormerHeader.values.city
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
      this.mate.mateFormerHeader.values.city1 = getAddressName(this.mate.mateFormerHeader.values.province,val)
    },
    regionChange (val) {
      this.mate.mateFormerHeader.values.county1 = getAddressName(this.mate.mateFormerHeader.values.city,val)
    },
    submitInfor () {
      this.dialogVisibleSubmit = false
      if (this.userType === '1') {
        this.$root.monitor({ url: '/offices/tree/list?nopaging=1' })
      }
      window.location.reload()
      // } else {
      //   this.$router.push({ path: '/login' })
      // }
    },
    goTradeHall () {
      this.dialogVisibleSubmit = false
      window.open(tradeHallUrl)
    },
    handleSubmit () {
      var mate = {}
      var vm = this
      this.$refs['ruleForm1'].validate((valid) => {
        if (valid) {
          this.mate.mateFormerHeader.values.province = this.mate.mateFormerHeader.values.province1
          this.mate.mateFormerHeader.values.city = this.mate.mateFormerHeader.values.city1
          this.mate.mateFormerHeader.values.county = this.mate.mateFormerHeader.values.county1
          this.mate.mateFormerHeader.values.incorporationDate = DateFormat(this.mate.mateFormerHeader.values.incorporationDate, 'yyyy-MM-dd')
          // this.mate.mateFormerHeader.values.companyName = this.selName
          // this.mate.mateFormerHeader.values.name = this.selName
          this.mate.mateFormerHeader.values.name = this.mate.mateFormerHeader.values.companyName
          // this.mate.mateFormerHeader.values.tenantCompanyName =''
          this.mate.mateFormerHeader.values.status = '0'
          mate = this.mate.mateFormerHeader.values
          this.$root.ajaxData('/companys/saveDetail', mate, function (data) {
            if (data.statusCode === 200) {
              vm.dialogVisibleSubmit = true
                if(vm.openClcpInfoState==true){
                  console.log("租户"+JSON.parse(window.sessionStorage.getItem('user')).tenantId+"勾选开通金票服务，调用初始化接口！")
                    vm.$root.ajaxData('/tenants/openClcpServer/'+JSON.parse(window.sessionStorage.getItem('user')).tenantId,{},function (data) {
                    },'GET')
                }
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
    changeBussiness (val) {
      if (val === '1') {
        this.show = true
        this.ruleShow = { required: true, message: '该输入项为必输项' }
      } else {
        this.show = false
        this.ruleShow = {}
        this.mate.mateFormerHeader.values.businessTerm = ''
        this.mate.mateFormerHeader.values.regAuthority = ''
        this.mate.mateFormerHeader.values.introduction = ''
        this.mate.mateFormerHeader.values.businessScope = ''
        this.mate.mateFormerHeader.values.mainProducts = ''
        this.mate.mateFormerHeader.values.corporationPhoto = ''
        this.mate.mateFormerHeader.values.authPersonPhoto = ''
        this.mate.mateFormerHeader.values.busLicensePhoto = ''
      }
    },
    backward () {
      if (this.userType === '1') {
        this.$root.monitor({ url: '/offices/tree/list?nopaging=1' })
      } else {
        this.$router.push({ path: '/login' })
      }
    },
    showInfor () {
      this.dialogVisibleInformation = true
    },
    beforeUploadLogo (file) {
      var index1 = file.name.lastIndexOf('.')
      var name = file.name.substring(index1, file.name.length)
      if (!/\.(jpg|jpeg|png|JPG|PNG|JPEG)$/.test(name)) {
        this.$message({
          message: '请选择图片格式',
          type: 'warning'
        })
        this.uplFileListLogo = []
        return false
      }
    },
    handleSuccessLogo (response, file, fileList) {
      this.mate.mateFormerHeader.values.logo = response.data
    },
    handlePictureCardPreviewLogo (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemoveLogo (file, fileList) {
      this.mate.mateFormerHeader.values.logo = ''
    },
    handleChangeLogo (file, fileList) {
      this.uplFileListLogo = fileList.slice(-1)
    },
    handleSuccessBusiness (response, file, fileList) {
      this.mate.mateFormerHeader.values.businessPhoto = response.data
    },
    handlePictureCardPreviewBusiness (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemoveBusiness (file, fileList) {
      this.mate.mateFormerHeader.values.businessPhoto = ''
    },
    handleChangeBusiness (file, fileList) {
      this.uplFileListBusiness = fileList.slice(-1)
    },
    beforeUploadBusiness (file) {
      var index1 = file.name.lastIndexOf('.')
      var name = file.name.substring(index1, file.name.length)
      if (!/\.(jpg|jpeg|png|JPG|PNG|JPEG)$/.test(name)) {
        this.$message({
          message: '请选择图片格式',
          type: 'warning'
        })
        this.uplFileListBusiness = []
        return false
      }
    },
    handleSuccessCorporation (response, file, fileList) {
      this.mate.mateFormerHeader.values.corporationPhoto = response.data
    },
    handlePictureCardPreviewCorporation (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemoveCorporation (file, fileList) {
      this.mate.mateFormerHeader.values.corporationPhoto = ''
    },
    handleChangeCorporation (file, fileList) {
      this.uplFileListCorporation = fileList.slice(-1)
    },
    beforeUploadCorporation (file) {
      var index1 = file.name.lastIndexOf('.')
      var name = file.name.substring(index1, file.name.length)
      if (!/\.(jpg|jpeg|png|JPG|PNG|JPEG)$/.test(name)) {
        this.$message({
          message: '请选择图片格式',
          type: 'warning'
        })
        this.uplFileListCorporation = []
        return false
      }
    },
    handleSuccessAuth (response, file, fileList) {
      this.mate.mateFormerHeader.values.authPersonPhoto = response.data
    },
    handlePictureCardPreviewAuth (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemoveAuth (file, fileList) {
      this.mate.mateFormerHeader.values.authPersonPhoto = ''
    },
    handleChangeAuth (file, fileList) {
      this.uplFileListAuth = fileList.slice(-1)
    },
    beforeUploadAuth (file) {
      var index1 = file.name.lastIndexOf('.')
      var name = file.name.substring(index1, file.name.length)
      if (!/\.(jpg|jpeg|png|JPG|PNG|JPEG)$/.test(name)) {
        this.$message({
          message: '请选择图片格式',
          type: 'warning'
        })
        this.uplFileListAuth = []
        return false
      }
    },
    handleSuccessLicense (response, file, fileList) {
      this.mate.mateFormerHeader.values.busLicensePhoto = response.data
    },
    handlePictureCardPreviewLicense (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemoveLicense (file, fileList) {
      this.mate.mateFormerHeader.values.busLicensePhoto = ''
    },
    handleChangeLicense (file, fileList) {
      this.uplFileListLicense = fileList.slice(-1)
    },
    beforeUploadLicense (file) {
      var index1 = file.name.lastIndexOf('.')
      var name = file.name.substring(index1, file.name.length)
      if (!/\.(jpg|jpeg|png|JPG|PNG|JPEG)$/.test(name)) {
        this.$message({
          message: '请选择图片格式',
          type: 'warning'
        })
        this.uplFileListLicense = []
        return false
      }
    },
    submitUpload (val) {
      if (val.length !== 0) {
        this.dialogImageUrl = val[0].url
        this.dialogVisible = true
      }
    },
  fromEbsChange(flag){
    if(flag){
        this.supplierInfoCheckDialog=true;
        this.supplierCheckForm.companyName=this.mate.mateFormerHeader.values.name;
        this.supplierCheckForm.legalPerson=this.mate.mateFormerHeader.values.corporation;
        this.supplierCheckForm.regFound=this.mate.mateFormerHeader.values.registeredCapital;
    }
  },
  supplierInfoCheck(){
    var vm = this;
      vm.$refs['supplierForm'].validate((valid) => {
          if (valid) {
              this.$root.ajaxData('/companys/checkInfofromEbs', vm.supplierCheckForm, function (data) {
                  if (data.statusCode === 200) {
                      vm.supplierInfoCheckDialog=false;
                  }else{
                      vm.$message({
                          message: '信息校验失败！请核实后重新校验',
                          type: 'warning'
                      })
                      return
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
  }
  }
}
</script>
<style scoped>
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
.el-date-editor.el-input{
  width:100%;
}
.el-form--inline.el-form--label-top .el-form-item__content{
  width:90%
}
.leftFloat .el-form--inline .el-form-item{
  margin-right:10px;
}
.fbutton{
  margin-top:30px;
  margin-bottom:10px;
}
.sbutton{
  margin-top:50px;
}
.tbutton{
  margin: 20px 0
}
.el-form-item--mini.el-form-item {
  margin: 6px;
}
.reason {
  margin-left: 40px;
  font-size: 16px;
}
.el-dialog__header {
    padding: 10px 10px 0;
  }
  .el-dialog__body {
    padding: 10px 10px;
  }
</style>
