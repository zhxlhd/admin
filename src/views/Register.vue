<template >
  <div>
    <el-row class="container" >
      <el-col :span="24" class="header"></el-col>
      <el-col v-bind:class="{ mainForm: isActive}">
      <!-- 注册表单-->
      <el-form class="demo-ruleForm login-registration"  :rules="rules" :model="registerForm" ref="ruleForm" :label-width="labelWidth">
        <h3 class="title">{{ $t('register-title')}}</h3>
        <!-- 用户名 -->
        <el-row>
          <el-form-item :label="$t('username')" prop="userName">
            <el-input v-model="registerForm['userName']" :placeholder="$t('pusername')"></el-input>
          </el-form-item>
        </el-row>
        <!-- 设置密码 -->
        <el-row>
          <el-form-item :label="$t('pwd')" prop="sha1Password" :inline-message="true">
            <el-input v-model="registerForm['sha1Password']" type="password" :placeholder="$t('ppwd')" @change="pwStrength(registerForm.sha1Password)"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <ul class="pass_set">
            <li ref="strength_L">弱</li>
            <li ref="strength_M">中</li>
            <li ref="strength_H">强</li>
          </ul>
        </el-row>
        <!-- 确认密码 -->
        <el-row>
          <el-form-item :label="$t('surepwd')" prop="surePassword">
            <el-input v-model="registerForm['surePassword']" type="password" :placeholder="$t('psurepwd')"></el-input>
          </el-form-item>
        </el-row>
        <!-- 企业名称 -->
        <el-row>
          <el-form-item :label="$t('companyname')" prop="companyName">
            <el-input v-model="registerForm['companyName']" :placeholder="$t('pcompanyname')"></el-input>
          </el-form-item>
        </el-row>
        <!-- 联系手机 -->
        <el-row>
          <el-form-item :label="$t('phonenum')" prop="phoneNum">
            <el-input type="number" v-model="registerForm['phoneNum']" :placeholder="$t('pphonenum')" ></el-input>
          </el-form-item> 
        </el-row>
        <!-- 验证码 -->
        <el-row>
          <el-form-item :label="$t('phoneCode')" prop="captcha">
            <el-input v-model="registerForm['captcha']" :placeholder="$t('pcaptcha')" :style="{'width': vCodeWidth}"></el-input><el-button :disabled="see" style="width: 95px; padding: 12px 10px;" type="primary" @click="getType">{{text}}</el-button>
          </el-form-item>
        </el-row>
        <!-- 企业邮箱 -->
        <el-row>
          <el-form-item :label="$t('registeremail')" prop="emailNum">
            <el-input v-model="registerForm['emailNum']" :placeholder="$t('pemailNum')"></el-input>
          </el-form-item>
        </el-row>
        <!-- 企业类型 -->
        <el-row>
          <el-form-item :label="$t('industry')" prop="industry">
            <el-select clearable v-model="registerForm['industry']" :placeholder="$t('TIPS_WARNING.SELECTED')">
              <el-option v-for="(item, index) of industryOptions" :label="item.label" :value="item.value" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <!-- 是否电镀行业用户 -->
        <el-row>
          <el-form-item :label="$t('electroplatingIndustry')" prop="electroplateFlag">
            <el-select v-model="registerForm['electroplateFlag']" :placeholder="$t('TIPS_WARNING.SELECTED')">
              <el-option v-for="(item, index) of electroplateFlagyOptions" :label="item.label" :value="item.value" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <!-- 电镀用户类型 -->
        <el-row>
          <el-form-item :label="$t('electroplatingUserType')" prop="infoType">
            <el-select v-model="registerForm['infoType']" :placeholder="$t('TIPS_WARNING.SELECTED')" :disabled="disabledInfoType">
              <template v-for="(item, index) of infoTypeOptions">
                <el-tooltip class="item" effect="dark" :content="item.dec" placement="right" :key="index">
                  <el-option :label="item.label" :value="item.value"></el-option>
                </el-tooltip>
              </template>
            </el-select>
          </el-form-item>
        </el-row>
        <!-- 电镀片区/园区 -->
        <el-row>
          <el-form-item :label="$t('electroplatingArea')" prop="parkId">
            <el-select v-model="registerForm['parkId']" :placeholder="$t('TIPS_WARNING.SELECTED')" :disabled="disabledParkId">
              <el-option v-for="(item, index) of parkIdOptions" :label="item.label" :value="item.value" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <!-- 企业年限 -->
        <el-row>
          <el-form-item :label="$t('operatingYears')" prop="operatingYears">
            <el-select clearable v-model="registerForm['operatingYears']" :placeholder="$t('TIPS_WARNING.SELECTED')">
              <el-option v-for="(item, index) of operatingYearsOptions" :label="item.label" :value="item.value" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <!-- 企业规模 -->
        <el-row>
          <el-form-item :label="$t('enterpriseScale')" prop="size">
            <el-select clearable v-model="registerForm['size']" :placeholder="$t('TIPS_WARNING.SELECTED')">
              <el-option v-for="(item, index) of enterpriseScaleOptions" :label="item.label" :value="item.value" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <!-- 联系人 -->
        <el-row>
          <el-form-item :label="$t('contactMan')" prop="contacts">
            <el-input v-model="registerForm['contacts']" :placeholder="$t('pcontact')"></el-input>
          </el-form-item>
        </el-row>
        <!-- 同意协议 -->
        <el-row>
          <el-form-item>
            <el-checkbox v-model="checkSure" ></el-checkbox>
            <a href="javascript:void (0);" @click="goAgreement">{{ $t('checksure')}}</a>
          </el-form-item>
        </el-row>
        <!-- 注册按钮 -->
        <el-row style="text-align:center">
          <el-button type="primary" @click="registerUser" style="width:290px;">{{ $t('registernow')}}</el-button> 
        </el-row>
        <!-- 返回登录 -->
        <el-row style="text-align:center">
          <el-button type='text' @click="backLogin" style="color:black;margin-top:10px">{{ $t('returnlogin')}}</el-button>
        </el-row>
      </el-form>
      </el-col>
      <!-- 页脚 -->
      <el-col class="footer">
        <el-row>
          <span style="margin:10px">{{$t('about')}}</span> <span>| </span>
          <span style="margin:10px">{{$t('contact')}}</span><span>| </span>
          <span style="margin:10px">{{$t('customerHotline')}}</span>
        </el-row>
        <el-row style="color:#6c6c6c;margin-top:20px">{{$t('intelligent')}}</el-row>
      </el-col>
    </el-row>
    <!-- 注册成功提示 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span >{{$t('information')}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmLogin">{{ $t('confirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import sha1 from 'node-sha1'
import { API_GATEWAY } from '@/config/index.js'
import { isPositiveEmail, trimSpace } from '../utils/util.js'
import { debuglog } from 'util';
import * as Utils from '@/utils/validates/index';
import axios from 'axios';
import { BaseConstant } from '../constant/BaseConstant';
import { getLang } from '@/utils/util';

const sessionStorage = window.sessionStorage
const localStorage = window.localStorage
var countdown = 60

export default {
  data () {
    // 校验两次输入的密码一致
    var validateBlur = (rule, value, callback) => {
      if (this.registerForm.surePassword !== this.registerForm.sha1Password) {
        callback(new Error(this.$t('surepwdMsg')))
      } else {
        callback()
      }
    }
    // 校验公司名是否存在
    var validateCompanyname = (rule, value, callback) => {
      var vm = this
      // this.$root.ajaxData('/reg/checkComName?companyName=' + this.registerForm.companyName, {}, function (data) {
      //   if (data.statusCode !== 200) {
      //     callback(new Error(vm.$t('checkCompanyname')))
      //   } else {
      //     callback()
      //   }
      // })
      this.$http({
        url: API_GATEWAY + '/reg/checkComName?companyName=' + this.registerForm.companyName,
        method: 'GET',
        responseType: 'json'
      }).then(function (response) {
        if (response.data.statusCode !== 200) {
          callback(new Error(vm.$t('checkCompanyname')))
        } else {
          callback()
        }
      })
    }
      // 校验用户名是否存在
    var validateUsername = (rule, value, callback) => {
      var vm = this
      this.$http({
        url: API_GATEWAY + '/reg/checkUserName?userName=' + this.registerForm.userName,
        method: 'GET',
        responseType: 'json'
      }).then(function (response) {
        if (response.data.statusCode !== 200) {
          callback(new Error(vm.$t('checkUsername')))
        } else {
          callback()
        }
      })
    }
    return {
      flag: false,
      logining: false,
      showDetialPhone: true,
      dialogVisible: false,
      status: '',
      registerForm: {         // 注册表单
        userName: '',         // 用户名 邮箱格式
        sha1Password: '',     // 设置密码
        surePassword: '',     // 确认密码
        companyname: '',      // 企业名称
        phoneNum: '',         // 联系手机
        emailNum: '',         // 企业邮箱
        captcha: '',          // 验证码
        industry: '',         // 行业类型
        operatingYears: '',   // 经营年限
        size: '',             // 企业规模
        contacts: '',         // 联系人
        electroplateFlag: '0',// 是否是电镀行业用户
        infoType: '',         // 电镀用户类型
        parkId: '',           // 电镀片区/园区
      },
      industryOptions: BaseConstant.SELECT_OPTIONS.INDUSTRY_OPTIONS, // 行业类型下拉
      operatingYearsOptions: [ // 经营年限下拉
        {
          value: '0',
          label: '1-5年'
        }, {
          value: '1',
          label: '5-10年'
        }, {
          value: '2',
          label: '10-15年'
        }, {
          value: '3',
          label: '15-20年'
        },
        {
          value: '4',
          label: '20年以上'
        }
      ],
      enterpriseScaleOptions: [ // 企业规模下拉
        {
          value: '0',
          label: '20人以下'
        }, {
          value: '1',
          label: '20-99人'
        }, {
          value: '2',
          label: '100-499人'
        }, {
          value: '3',
          label: '500-999人'
        },
        {
          value: '4',
          label: '1000-9999人'
        },
        {
          value: '5',
          label: '10000人以上'
        }
      ],
      electroplateFlagyOptions: [ // 是否是电镀行业类型下拉
        { value: '0', label: this.$t('no')},
        { value: '1', label: this.$t('yes')}
      ],
      infoTypeOptions: BaseConstant.SELECT_OPTIONS.INFO_TYPE, // 电镀用户类型下拉
      parkIdOptions: [], // 电镀片区/园区 下拉
      show: true,
      showr: false,
      il: '',
      userStatus: false,
      checkSure: false,
      isActive: false,
      showPwd: false,
      see: false,
      text: this.$t('requireCap'),
      rules: {
        account: [
          { required: true, message: this.$t('valid-account'), trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: this.$t('valid-password'), trigger: 'blur' }
        ],
        companyName: [
          { required: true, message: this.$t('valid-rule'), trigger: 'blur' },
          { validator: validateCompanyname, trigger: 'blur' }
        ],
        userName: [
           { required: true, message: this.$t('emailnum'), trigger: 'blur' },
           { validator: Utils.formValidateGene('validatePositiveEmail', this.$t('FORM_VALIDATION_INFO.ILLEGAL_EMAIL')), trigger: 'blur' },
           { validator: validateUsername, trigger: 'blur' }
        ],
        sha1Password: [
          { required: true, message: this.$t('valid-rule'), trigger: 'blur' },
          { validator: Utils.formValidateGene('validatePassword', this.$t('FORM_VALIDATION_INFO.VALID_PWD')), trigger: 'blur' }
        ],
        surePassword: [
          { required: true, message: this.$t('valid-rule'), trigger: 'blur' },
          { validator: validateBlur, trigger: 'blur' }
        ],
        phoneNum: [
          { required: true, message: this.$t('valid-rule'), trigger: 'blur' },
          { validator: Utils.formValidateGene('validateMobile', this.$t('FORM_VALIDATION_INFO.ILLEGAL_PHONE')), trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: this.$t('valid-rule'), trigger: 'blur' },
          { max: 6, min: 6, message: this.$t('valid-Capule'), trigger: 'blur' }
        ],
        infoType: [
          { required: false, message: this.$t('valid-rule'), trigger: 'change'}
        ],
        parkId: [
          { required: false, message: this.$t('valid-rule'), trigger: 'change'}
        ]
      }
    }
  },
  watch: {
    flag: function () {
      if (this.flag) {
        this.showPwd = false
        this.ruleShow = {}
        this.ruleShowCaptcha = {}
        this.ruleShowName = {}
        this.ruleShowPhone = {}
        this.isActive = false
        this.show = false
        this.showr = true
      }
    },
    'registerForm.electroplateFlag': function(newVal,oldVal){
      this.registerForm.infoType = '';
      if(newVal == '1'){
        this.rules['infoType'][0].required = true;
      }else{
        this.rules['infoType'][0].required = false;
        this.parkIdOptions = [];
      }
    },
    'registerForm.infoType': function(newVal,oldVal){
      this.registerForm.parkId = '';
      if(newVal == '1'){
        this.rules['parkId'][0].required = true;
        // 获取电镀片区/园区
        this.getPartId();
      }else{
        this.rules['parkId'][0].required = false;
      }
    }
  },
  computed: {
    labelWidth: function () {
      return getLang() === "en-US" ? "150px" : "120px";
    },
    vCodeWidth: function (){
      return getLang() === "en-US" ? "155px" : "185px";
    },
    disabledInfoType: function() {
      return this.registerForm['electroplateFlag'] == '0' ? true : false;
    },
    disabledParkId: function() {
      return this.registerForm['infoType'] == '1' ? false : true;
    },
  },
  mounted () {
    document.title = this.$t('system-title');
    this.flag = this.$route.query.threg;
  },
  methods: {
    getUser () {
      const token = sessionStorage.getItem('token')
      this.$http.get(API_GATEWAY + '/user',
        {
          headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json',
            'Prefer-Lang': sessionStorage.getItem('prefer-lang')
          }
        }).then((response) => {
          if (response.data) {
            this.sysUserName = response.data.firstname
            sessionStorage.setItem('user', JSON.stringify(response.data))
            localStorage.setItem('user', JSON.stringify(response.data))
          }
        })
    },
    // 校验验证码
    blurCaptcha (val) {
      var vm = this
      var params = { 'telephone': this.registerForm.phoneNum }
      if (val) {
        this.$root.ajaxData('/users/valid/' + val, params, function (data) {
          if (data.statusCode === 10009) {
            vm.$message({
              message: '验证码不正确',
              type: 'error'
            })
            return
          } else if (data.statusCode === 10012) {
            vm.$message({
              message: '5分钟已过，请重新发送验证码',
              type: 'error'
            })
            return
          }
        }, 'PUT')
      }
    },
    // 注册成功跳转
    confirmLogin () {
      this.logining = true
      const username = this.registerForm.userName
      const password = this.registerForm.password
      var params = { username: username, password: password }
      const vm = this
      this.$http.post(API_GATEWAY + '/auth', params, {})
          .then(response => {
            vm.logining = false
            const data = response.body
            sessionStorage.setItem('token', JSON.stringify(data.token))
            localStorage.setItem('token', JSON.stringify(data.token))
            vm.getUser()
            // 报表系统跨域单点登录
            vm.$router.push({ path: '/' })
          }, response => {
            vm.logining = false
            const status = response.status
            if (status === 401) {
              vm.$message({
                message: this.$t('name-pwd-error'),
                type: 'error'
              })
            }
          })
      clearInterval(this.il)
    },
    backLogin () {
      this.$router.push('/login')
      clearInterval(this.il)
    },
    // 获取验证码
    getType () {
      var vm = this
      if (vm.registerForm.phoneNum.length === 11) {
        this.$http({
          url: API_GATEWAY + '/reg/sendVerifyCode?phoneNum=' + this.registerForm.phoneNum,
          method: 'GET',
          responseType: 'json'
        }).then(function (response) {
          if (response.data.statusCode === 200) {
            vm.il = setInterval(function () {
              vm.see = false
              vm.text = vm.$t('requireCap')
              if (countdown === 0) {
                clearInterval(vm.il)
                countdown = 60
              } else {
                vm.see = true
                countdown--
                vm.text = vm.$t('obtain') + '(' + countdown + ')'
              }
            }, 1000)
          } else if (response.data.statusCode === 10003) {
            vm.$notify.error({
              title: vm.$t('message'),
              message: vm.$t('phoneexit')
            })
          } else {
            vm.$notify.error({
              title: vm.$t('message'),
              message: vm.$t('msgFail')
            })
          }
        })
      } else {
        vm.$notify.error({
          title: this.$t('message'),
          message: this.$t('phonenull')
        })
      }
    },
    /**
     * 注册供应商
     * 提交驻注册
     **/ 
    registerUser () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.checkSure) {
            this.registerForm.password = sha1(this.registerForm.sha1Password)
            var form = this.registerForm
            form.sha1Password = ''
            form.surePassword = ''
            this.$http.post(API_GATEWAY + '/reg/saveRegInfo', form).then(function (response) {
              if (response.data.statusCode === 200) {
                this.dialogVisible = true
              } else if (response.data.statusCode === 10009) {
                this.$notify.error({
                  title: this.$t('message'),
                  message: this.$t('registerFail')
                })
              } else if (response.data.statusCode === 10012) {
                this.$notify.error({
                  title: this.$t('message'),
                  message: this.$t('registerfail')
                })
              }
            })
          } else {
            this.$notify.error({
              title: this.$t('message'),
              message: this.$t('selectMsg')
            })
          }
        }
      })
    },
    /**
     * 密码强度样式控制
     */
    pwStrength (pwd) {
      var ocolor = ''
      var lcolor = ''
      var mcolor = ''
      var hcolor = ''
      var Lcolor = ''
      var Mcolor = ''
      var Hcolor = ''
      var Slevel = ''
      ocolor = '#eeeeee'
      lcolor = '#ffd8b4'
      mcolor = '#ffaf56'
      hcolor = '#e85959'
      if (pwd === null || pwd === '') {
        Lcolor = Mcolor = Hcolor = ocolor
      } else {
        Slevel = this.checkStrong(pwd)
        switch (Slevel) {
          case 0:
            Lcolor = Mcolor = Hcolor = ocolor
            break
          case 1:
            Lcolor = lcolor
            Mcolor = Hcolor = ocolor
            break
          case 2:
            Lcolor = lcolor
            Mcolor = mcolor
            Hcolor = ocolor
            break
          default:
            Lcolor = lcolor
            Mcolor = mcolor
            Hcolor = hcolor
        }
      }
      this.$refs.strength_L.style.backgroundColor = Lcolor
      this.$refs.strength_M.style.backgroundColor = Mcolor
      this.$refs.strength_H.style.backgroundColor = Hcolor
      return
    },
    // 返回强度级别
    checkStrong (sPW) {
      if (sPW.length <= 4) return 0
      var Modes = 0
      for (var i = 0; i < sPW.length; i++) {
		// 密码模式
        Modes |= this.CharMode(sPW.charCodeAt(i))
      }
      return this.bitTotal(Modes)
    },
    // 判断输入密码的类型
    CharMode (iN) {
      if (iN >= 48 && iN <= 57) {
        return 1
      }
      if (iN >= 65 && iN <= 90) {
        return 2
      }
      if (iN >= 97 && iN <= 122) {
        return 4
      }
      return 8
    },
    bitTotal (num) {
      var modes = 0
      for (var i = 0; i < 4; i++) {
        if (num & 1) modes++
        num >>>= 1
      }
      return modes
    },
    // 注册协议
    goAgreement(){
      this.$router.push('/agreement')
    },
    /**
     * 获取电镀片区/园区 下拉
     */
    getPartId(){
      if(this.parkIdOptions.length) return;
      axios.get(`${API_GATEWAY}/api/dic/query/electroplate/park`).then(res => {
        if (res.data.length) {
          this.parkIdOptions = res.data
        } else{
          this.$message.warning('获取电镀片区/园区列表失败,请联系管理员')
        }
      }).catch(() =>{
        this.$message.warning('获取电镀片区/园区列表失败,请联系管理员')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .login-registration{
    -webkit-border-radius: 5px;
    box-shadow:0px 0px 2px #858282;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-color: white;
    background-clip: padding-box;
    margin: 80px auto;
    width:400px;
    padding: 35px 35px 15px 35px;
    // background: #a8c2e3;
    border: 1px solid #eaeaea;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
    .el-form-item {
      width: 100%;
    }
    .el-form-item__content .el-select{
      width: 100%;
    }
    .el-form-item {
    margin: 15px 20px 2px 0px;
    }
   }
  .container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
    overflow: auto;
    .header {
      height: 100px;
      line-height: 60px;
      color:#fff;
      background-image: url('../assets/images/bg_title.png');
      background-repeat:no-repeat;
      background-position: 300px;
    }
    .mainForm {
      color:#fff;
      background-size:cover;
      background-repeat:no-repeat;
      background-size: 100% auto;
        .login-container {
          -webkit-border-radius: 5px;
          border-radius: 5px;
          -moz-border-radius: 5px;
          background-color: white;
          background-clip: padding-box;
          margin: 180px;
          float: right;
          width: 270px;
          height:280px;
          padding: 35px 35px 15px 35px;
          // background: #a8c2e3;
          border: 1px solid #eaeaea;
          .title {
               margin: 0px auto 40px auto;
              text-align: center;
              color: #505458;
              }
          .remember {
              margin: 0px 0px 35px 0px;
              }
          .el-form-item {
              max-width: 350px;
              }
          .el-form-item {
              margin: 15px 20px 2px 0px;
            }
      }
    }
    .footer{
      height: 100px;
      text-align:center;
      margin:30px auto;
    }
  }
  ul.pass_set{ 
    clear:both; 
    margin-top:15px; 
    margin-left: 70px;
    margin-bottom: 0px;
    height:18px; 
    line-height:18px; 
    overflow:hidden; 
    width:156px; 
    overflow:hidden;}
  ul.pass_set li{ 
    float: left; 
    text-align: center; 
    width: 50px; 
    border-right: 2px solid #fff; 
    background: #ffd8b4; 
    color: #fff; 
    list-style-type: none; }
  dl.code_note{ 
    clear:both; 
    width:75%; 
    margin:0 auto; 
    padding:30px 0 0 0;}
  dl.code_note dt{ 
    clear:both; 
    font-size:14px; 
    font-weight:bold; 
    line-height:1.7em;}
  dl.code_note dt p{ 
    clear:both; 
    font-weight:normal; 
    padding-top:5px;}
  dl.code_note dd{ 
    clear:both; 
    padding-top:15px;}
  .tfie{
	  width:80px;
	  height:25px;
	  display:inline-block;
  }
</style>
