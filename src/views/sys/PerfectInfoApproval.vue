<template>
  <div>
    <el-row>
      <el-form size="mini" :model="mate.mateFormerHeader.values" :inline="mate.inline" ref="ruleForm1"  :rules="rules" :label-width="labelWidth">
        <template>
          <el-row>
            <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['tenantCompanyName'].label"  :prop="object['tenantCompanyName'].name">
                  <el-input disabled v-model="mate.mateFormerHeader.values[object['tenantCompanyName'].name]"></el-input>
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
                   :limit="size"
                   :on-success="handleSuccessLogo"
                   :on-preview="handlePictureCardPreviewLogo"
                   :on-remove="handleRemoveLogo"
                   >
                 <el-button slot="trigger" class ='el-icon-plus' size="mini" style="display:none;">选择图片</el-button>
                 <el-button type="primary" size="mini" @click="submitUpload(uplFileListLogo)">查看</el-button>
                </el-upload>
                </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['tenantCompanyName'].label"  :prop="object['tenantCompanyName'].name">
                  <el-input disabled v-model="mate.mateFormerHeader.values[object['tenantCompanyName'].name]"></el-input>
                </el-form-item>
            </el-col>
            <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['shortName'].label"  :prop="object['shortName'].name">
                  <el-input disabled v-model="mate.mateFormerHeader.values[object['shortName'].name]"></el-input>
                </el-form-item>
            </el-col>
             <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['industry'].label"  :prop="object['industry'].name">
                  <dict-selected rowId='0' v-model="mate.mateFormerHeader.values[object['industry'].name]" dictType="industry" :initValue="mate.mateFormerHeader.values[object['industry'].name]"></dict-selected>
                </el-form-item>
            </el-col>
             </el-row>
          <el-row>
            <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['enterpriseNature'].label"  :prop="object['enterpriseNature'].name">
                   <dict-selected rowId='0' v-model="mate.mateFormerHeader.values[object['enterpriseNature'].name]" dictType="natureCompany" :initValue="mate.mateFormerHeader.values[object['enterpriseNature'].name]"></dict-selected>
                </el-form-item>
            </el-col>
         
             <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['incorporationDate'].label"  :prop="object['incorporationDate'].name">
                  <el-date-picker disabled v-model="mate.mateFormerHeader.values[object['incorporationDate'].name]" type="date" placeholder="选择日期"></el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['size'].label"  :prop="object['size'].name">
                  <dict-selected rowId='0' v-model="mate.mateFormerHeader.values[object['size'].name]" dictType="enterpriseScale" :initValue="mate.mateFormerHeader.values[object['size'].name]"></dict-selected>
                </el-form-item>
            </el-col>
            </el-row>
          <el-row>
             <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['registeredCapital'].label"  :prop="object['registeredCapital'].name">
                  <el-input  disabled v-model="mate.mateFormerHeader.values[object['registeredCapital'].name]"></el-input>
                </el-form-item>
            </el-col>
          
             <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['corporation'].label"  :prop="object['corporation'].name">
                  <el-input  disabled v-model="mate.mateFormerHeader.values[object['corporation'].name]"></el-input>
                </el-form-item>
            </el-col>
            
             <!-- <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['organizingCode'].label"  :prop="object['organizingCode'].name">
                  <el-input disabled v-model="mate.mateFormerHeader.values[object['organizingCode'].name]"></el-input>
                </el-form-item>
            </el-col> -->
              <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['contacts'].label"  :prop="object['contacts'].name">
                  <el-input  disabled v-model="mate.mateFormerHeader.values[object['contacts'].name]"></el-input>
                </el-form-item>
            </el-col>
               </el-row>
          <el-row>
            <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['telephone'].label"  :prop="object['telephone'].name">
                  <el-input  disabled v-model="mate.mateFormerHeader.values[object['telephone'].name]"></el-input>
                </el-form-item>
            </el-col>
         
            <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['email'].label"  :prop="object['email'].name">
                  <el-input  disabled v-model="mate.mateFormerHeader.values[object['email'].name]"></el-input>
                </el-form-item>
            </el-col>
            <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['qq'].label"  :prop="object['qq'].name">
                  <el-input  disabled v-model="mate.mateFormerHeader.values[object['qq'].name]"></el-input>
                </el-form-item>
            </el-col>

            <el-col :sm="12" :md="8" :lg="8">
              <el-form-item :label="object['website'].label"  :prop="object['website'].name">
                <el-input  disabled v-model="mate.mateFormerHeader.values[object['website'].name]"></el-input>
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
                  style="width:20%">
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
                  style="width:20%">
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
                  style="width:20%">
                </addrselect>
                <el-input  disabled v-model="mate.mateFormerHeader.values[object['address'].name]" style="width:38%"></el-input>
              </el-form-item> 
            </el-col>
            <el-col :sm="12" :md="8" :lg="8">
              <el-form-item :label="object['zipcode'].label"  :prop="object['zipcode'].name">
                <el-input  disabled v-model="mate.mateFormerHeader.values[object['zipcode'].name]"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="8" :lg="8">
              <el-form-item :label="object['introduction'].label"  :prop="object['introduction'].name">
                <el-input type="textarea" v-model="mate.mateFormerHeader.values[object['introduction'].name]"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 新增电镀行业相关字段 2020-04-22 Start-->
          <el-row>
            <!-- 是否是电镀行业用户 -->
            <el-col :sm="12" :md="8" :lg="8">
              <el-form-item :label="object['electroplateFlag'].label" prop="electroplateFlag">
                <dict-selected :rowId="0" :clearable="false" v-model="mate.mateFormerHeader.values['electroplateFlag']" dictType="yes_no" :initValue="mate.mateFormerHeader.values['electroplateFlag']"></dict-selected>
              </el-form-item>
            </el-col>
            <!-- 电镀用户类型 -->
            <el-col :sm="12" :md="8" :lg="8">
              <el-form-item :label="object['infoType'].label" prop="infoType">
                <!-- <dict-selected :rowId="1" v-model="mate.mateFormerHeader.values['infoType']" dictType="INFO_TYPE" :initValue="mate.mateFormerHeader.values['infoType']"></dict-selected> -->
                <el-select v-model="mate.mateFormerHeader.values['infoType']" :placeholder="$t('TIPS_WARNING.SELECTED')" :disabled="disabledInfoType">
                  <el-option v-for="(item, index) of infoTypeOptions" :label="item.label" :value="item.value" :key="index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- 电镀片区/园区 -->
            <el-col :sm="12" :md="8" :lg="8">
              <el-form-item :label="object['parkId'].label" prop="parkId">
                <dict-selected :rowId="disabledParkId" v-model="mate.mateFormerHeader.values['parkId']" dictType="electroplate_park" :initValue="mate.mateFormerHeader.values['parkId']"></dict-selected>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 新增电镀行业相关字段 2020-04-22 End-->
          <el-button type="text">资质材料</el-button>
          <el-row>
            <el-col :sm="12" :md="8" :lg="8">
              <el-form-item :label="object['businessType'].label" :prop="object['businessType'].name">
                <dict-selected rowId='0' v-model="mate.mateFormerHeader.values[object['businessType'].name]" dictType="businessType" :initValue="mate.mateFormerHeader.values[object['businessType'].name]" @input="changeBussiness(mate.mateFormerHeader.values[object['businessType'].name])"></dict-selected>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['codeCredit'].label" :prop="object['codeCredit'].name" >
                  <el-input disabled v-model="mate.mateFormerHeader.values[object['codeCredit'].name]"></el-input>
                </el-form-item>
            </el-col>

             <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['businessTerm'].label"  :prop="object['businessTerm'].name" v-show="show">
                  <el-input  disabled v-model="mate.mateFormerHeader.values[object['businessTerm'].name]"></el-input>
                </el-form-item>
            </el-col>

            <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['regAuthority'].label"  :prop="object['regAuthority'].name" v-show="show">
                  <el-input disabled v-model="mate.mateFormerHeader.values[object['regAuthority'].name]"></el-input>
                </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['introduction'].label"  :prop="object['introduction'].name" v-show="show">
                  <el-input  disabled v-model="mate.mateFormerHeader.values[object['introduction'].name]"></el-input>
                </el-form-item>
            </el-col>

            <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['businessScope'].label"  :prop="object['businessScope'].name" v-show="show">
                  <el-input disabled v-model="mate.mateFormerHeader.values[object['businessScope'].name]"></el-input>
                </el-form-item>
            </el-col>

             <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['mainProducts'].label"  :prop="object['mainProducts'].name" v-show="show">
                  <el-input disabled v-model="mate.mateFormerHeader.values[object['mainProducts'].name]"></el-input>
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
                   :limit="size"
                   :on-success="handleSuccessBusiness"
                   :on-preview="handlePictureCardPreviewBusiness"
                   :on-remove="handleRemoveBusiness">
                 <el-button slot="trigger" class ='el-icon-plus' size="mini" style="display:none;">选择图片</el-button>
                 <el-button type="primary" size="mini" @click="submitUpload(uplFileListBusiness)">查看</el-button>
                </el-upload>
                </el-form-item>
            </el-col>

             <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="object['corporationPhoto'].label"  :prop="object['corporationPhoto'].name" v-show="show"> 
                  <el-upload
                   :action="fileuploadUrlLogo"
                   :headers="headers"
                   list-type="picture"
                   :file-list="uplFileListCorporation"
                   :on-change="handleChangeCorporation"
                   :before-upload="beforeUploadCorporation"
                   :limit="size"
                   :on-success="handleSuccessCorporation"
                   :on-preview="handlePictureCardPreviewCorporation"
                   :on-remove="handleRemoveCorporation">
                 <el-button slot="trigger" class ='el-icon-plus' size="mini" style="display:none;">选择图片</el-button>
                 <el-button type="primary" size="mini" @click="submitUpload(uplFileListCorporation)">查看</el-button>
                </el-upload>
                </el-form-item>
            </el-col>

             <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="object['authPersonPhoto'].label"  :prop="object['authPersonPhoto'].name" v-show="show">
                   <el-upload
                   :action="fileuploadUrlLogo"
                   :headers="headers"
                   list-type="picture"
                   :file-list="uplFileListAuth"
                   :on-change="handleChangeAuth"
                   :limit="size"
                   :on-success="handleSuccessAuth"
                   :before-upload="beforeUploadAuth"
                   :on-preview="handlePictureCardPreviewAuth"
                   :on-remove="handleRemoveAuth">
                 <el-button slot="trigger" class ='el-icon-plus' size="mini" style="display:none;">选择图片</el-button>
                 <el-button type="primary" size="mini" @click="submitUpload(uplFileListAuth)">查看</el-button>
                </el-upload>
                </el-form-item>
            </el-col>

            <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="object['busLicensePhoto'].label"  :prop="object['busLicensePhoto'].name" v-show="show">
                   <el-upload
                   :action="fileuploadUrlLogo"
                   :headers="headers"
                   list-type="picture"
                   :file-list="uplFileListLicense"
                   :on-change="handleChangeLicense"
                   :before-upload="beforeUploadLicense"
                   :limit="size"
                   :on-success="handleSuccessLicense"
                   :on-preview="handlePictureCardPreviewLicense"
                   :on-remove="handleRemoveLicense">
                 <el-button slot="trigger" class ='el-icon-plus' size="mini" style="display:none;">选择图片</el-button>
                 <el-button type="primary" size="mini" @click="submitUpload(uplFileListLicense)">查看</el-button>
                </el-upload>
                </el-form-item>
            </el-col>
          </el-row>
          <el-row>
              <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['status'].label"  :prop="object['status'].name">
                   <dict-selected @input="visibleChangeOrigin(mate.mateFormerHeader.values[object['status'].name])" v-model="mate.mateFormerHeader.values[object['status'].name]" dictType="approveState" :initValue="mate.mateFormerHeader.values[object['status'].name]"></dict-selected>
                </el-form-item>
            </el-col>
            <el-col :sm="12" :md="8" :lg="8">
                <el-form-item :label="object['rejectReason'].label"  :prop="object['rejectReason'].name" v-show="showRescon" :rules="ruleRescon">
                  <el-input v-model="mate.mateFormerHeader.values[object['rejectReason'].name]"  ></el-input>
                </el-form-item>
            </el-col>
            <!-- 新增验证功能以及ebs公司名称  Start-->
            <el-col :span="1">
              <el-button style="margin: 7px;" size="mini" type="primary" @click="verify">验证</el-button>
            </el-col>
            <el-col :sm="12" :md="8" :lg="8">
              <el-form-item :label="object['vendorName'].label"  :prop="object['vendorName'].name" v-show="showField">
                <el-input v-model="mate.mateFormerHeader.values[object['vendorName'].name]"></el-input>
              </el-form-item>
            </el-col>
            <!-- End-->
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
                  <el-button size="mini" @click="dialogVisibleInformation = false">确 定</el-button>
                </span>
            </el-dialog>
        </template>
      </el-form>
    </el-row>
     <div class="fbutton">
      <el-button size="mini" @click="handleSubmit">提 交</el-button>
      <el-button size="mini" @click="backward">取 消</el-button>
    </div>
  </div>
</template>
<script>
import CountrySelect from '../../components/CountrySelect.vue'
import addrArr from '../../components/address/addr-arr.js'
import { DateFormat } from '../../utils/util.js'
import Addrselect from '../../components/address/Addrselect'
import { API_GATEWAY } from '@/config/index.js'
import { BaseConstant } from '@/constant/BaseConstant'
import axios from '@/utils/http';

function getAddrsArrayById (id = 0) {
  return addrArr[id].map(item => {
    return {
      'text': item[1],
      'value': item[0]
    }
  })
}
function getAddressName(id,val) {
  if(!id) return;
  var name = ''
  addrArr[id].map(item=>{
    if(item[0] === val){
      name = item[1]
    }
  })
  return name
}
function getAddressId(id,val) {
  if(!id) return;
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
export default {
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
  data () {
    return {
      object: {},
      rules: {
        status:
         { required: true, message: '该输入项为必输项' },
        infoType: [
          { required: false, message: this.$t('valid-rule'), trigger: 'change'}
        ],
        parkId: [
          { required: false, message: this.$t('valid-rule'), trigger: 'change'}
        ]
      },
      ruleRescon: {},
      disabledFlagBank: true,
      initprovselectedvalue: '0',
      initcityselectedvalue: '0',
      initregionselectedvalue: '0',
      dialogVisible: false,
      showRescon: false,
      dialogVisibleInformation: false,
      show: true,
      dialogImageUrl: '',
      provAddrs: getAddrsArrayById(0),
      cityAddrs: [],
      regionAddrs: [],
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
      infoTypeOptions: BaseConstant.SELECT_OPTIONS.INFO_TYPE,// 电镀用户类型 下拉
      showField: false,   // 是否展示ebs公司名称
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
    },
    disabledInfoType: function() {
      return this.mate.mateFormerHeader.values['electroplateFlag'] == '0' ? true : false;
    },
    disabledParkId: function() {
      return this.mate.mateFormerHeader.values['infoType'] == '1' ? 0 : 1;
    }
  },
  watch: {
    'mate.mateFormerHeader.values.electroplateFlag': function(newVal,oldVal){
      this.mate.mateFormerHeader.values.infoType = '';
      if(newVal == '1'){
        this.rules['infoType'][0].required = true;
      }else{
        this.rules['infoType'][0].required = false;
        this.parkIdOptions = [];
      }
    },
    'mate.mateFormerHeader.values.infoType': function(newVal,oldVal){
      this.mate.mateFormerHeader.values.parkId = '';
      if(newVal == '1'){
        this.rules['parkId'][0].required = true;
      }else{
        this.rules['parkId'][0].required = false;
      }
    }
  },
  created () {
    this.mate.mateFormerHeader.fields.map((i) => { this.object[i.name] = i })
    this.mate.mateFormerHeader.values.companyName = this.mate.mateFormerHeader.values.name
    if (this.mate.mateFormerHeader.values.businessType === '0') {
      this.show = false
    } else {
      this.show = true
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
    if (this.mate.mateFormerHeader.values.status === '0') {
      this.mate.mateFormerHeader.values.status = ''
    }
    if (this.mate.mateFormerHeader.values.status === '-1') {
      this.showRescon = true
      this.ruleRescon = { required: true, message: '该输入项为必输项' }
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
    // changeStatus () {
    //   if (this.mate.mateFormerHeader.values.status === '2') {
    //     this.show = true
    //   }
    // },
    /**
     * 通过社会信用编码验证格式名称
     * @param {codeCredit} String
     * @return void
     */
    verify () {
      let _this = this;
      let mate = {};
      let num = trimSpace(_this.mate.mateFormerHeader.values.codeCredit);
      axios.post(`/companys/findVendorByNum?num=${num}`).then(res => {
        if (res.data.data.code === 200) {
          _this.$message({
            type: 'success',
            message: res.data.data.message
          })
          _this.showField = true;
          _this.mate.mateFormerHeader.values.vendorName = res.data.data.vendorName;
        } else if (res.data.data.code == 10018){
          _this.$message({
            type: 'warning',
            message: res.data.data.message
          })
          _this.showField = false;
        }else {
          _this.$message({
            type: 'warning',
            message: res.data.data.message
          })
          _this.showField = true;
          _this.mate.mateFormerHeader.values.vendorName = res.data.data.vendorName;
        }
      })
    },
    inputChangeAddr (val) {
      if (val === this.$t('China')) {
        var vm = this
        this.disabledFlagBank = false
        vm.$set(vm.mate.mateFormerHeader.values, 'province', '')
        vm.$set(vm.mate.mateFormerHeader.values, 'city', '')
        vm.$set(vm.mate.mateFormerHeader.values, 'county', '')
      } else {
        this.disabledFlagBank = true
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
    visibleChangeOrigin (val) {
      if (val === '-1') {
        this.showRescon = true
        this.ruleRescon = { required: true, message: '该输入项为必输项' }
      } else {
        this.showRescon = false
        this.ruleRescon = {}
        this.mate.mateFormerHeader.values.rejectReason = ''
      }
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
          mate = this.mate.mateFormerHeader.values
          this.$root.ajaxData('/companys/saveDetail?audit=true', mate, function (data) {
            vm.$root.monitor({ url: '/companys/getApprovalList?type=tenant' })
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
      } else {
        this.show = false
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
      this.$root.monitor({ url: '/companys/getApprovalList?type=tenant' })
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
    }
  }
}
</script>
<style scoped lang="scss">
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
.el-select{
  width:100%;
}
.el-date-editor.el-input{
  width:100%;
}
.el-cascader{
  width:100%;
}
.hidden{
  display:none;
}
h4{
  margin-top:40px;
  margin-bottom:10px;
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
  margin: 5px 0;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}
.dialog-footer {
  position: relative;
  right: 10px;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}
.el-form-item--mini.el-form-item {
  margin: 6px;
}
.el-select>.el-input {
  position: relative;
  width: 80%;
}
.el-dialog__header {
  padding: 10px 10px 0;
}
.el-dialog__body {
  padding: 10px 10px;
}
.el-form-item--mini.el-form-item {
  margin: 6px;
}
</style>
