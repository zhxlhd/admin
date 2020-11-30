<template >
<div>
  <el-row class="container" >
  <el-col :span="24" class="header"> </el-col>
  <el-col v-bind:class="{ mainForm: isActive}">
      <!--忘记密码表单-->
      <el-form class="demo-ruleForm login-forgetPwd"   :model="pwdForm" ref="ruleFormPassword" :label-width="labelWidth">
        <el-radio-group v-model="pwdForm.type" style="margin-left:100px" @change="changeType">
            <el-radio-button label="1">手机找回</el-radio-button>
            <el-radio-button label="2">邮箱找回</el-radio-button>
        </el-radio-group>
           <el-row>
                 <el-form-item :label="$t('username')" prop="username" :rules="ruleShowName">
                     <el-input v-model="pwdForm.username" :placeholder="$t('pusername')"></el-input>
                 </el-form-item>
           </el-row>
           <el-row >
                 <el-form-item :label="$t('phonenum')" prop="telephone" :rules="ruleShowPhone" v-show="showDetialPhone">
                  <el-input  type="number" v-model="pwdForm.telephone" :placeholder="$t('pphonenum')" ></el-input>
                 </el-form-item> 
          </el-row>  
          <el-row>
                 <el-form-item :label="$t('phoneCode')" prop="Captcha" :rules="ruleShowCaptcha">
                     <el-input v-model="pwdForm.Captcha"  :placeholder="$t('pcaptcha')"  style="width:150px;" @blur="blurCaptcha(pwdForm.Captcha)"></el-input><el-button :disabled="see" style="width:90px;padding: 12px 0px;"  type="primary"  @click="getPhoneType" >{{text}}</el-button>
                 </el-form-item>
         </el-row>
           <el-row>
                 <el-form-item :label="$t('pwd')" prop="passWord" :rules="ruleShow">
                     <el-input v-model="pwdForm.passWord" type="password" :placeholder="$t('ppwd')"></el-input>
                 </el-form-item>
         </el-row>
         <el-button type='text' @click="backLogin" style="color:black;margin-top:10px;float:right">{{ $t('ReturnLogin')}}</el-button>
         <el-button type="primary" style="width:85%; margin:10px 0 10px 30px" @click="submitForget('ruleFormPassword')">提交</el-button>
          <el-button type="text" @click="registerSupplier" style="float:right">{{$t('ImmediateRegistration')}}</el-button>
      </el-form>
      </el-col>
      <el-col class="footer">
        <el-row>
          <span style="margin:10px">{{$t('about')}}</span> <span>| </span>
          <span style="margin:10px">{{$t('contact')}}</span><span>| </span>
          <span style="margin:10px">{{$t('customerHotline')}}</span>
        </el-row>
        <el-row style="color:#6c6c6c;margin-top:20px">{{$t('intelligent')}}</el-row>
      </el-col>
    </el-row>
      </div>       
</template>
<script>
import sha1 from 'node-sha1'
import { API_GATEWAY } from '@/config/index.js'
import { isPositiveEmail, trimSpace, isPositivePassword } from '../utils/util.js'
var countdown = 60
export default {
  data () {
    var validateExitUsername = (rule, value, callback) => {
      var vm = this
      this.$root.ajaxData('/register/checkUserName?userName=' + this.pwdForm.username, {}, function (data) {
        if (data.statusCode !== 10011) {
          callback(new Error(vm.$t('checkExitUsername')))
        } else {
          callback()
        }
      })
    }
     // 校验密码长度 字符
    var validateBlurPassword = (rule, value, callback) => {
      if (value.length < 8) {
        callback(new Error('请输入含有数字,字母的8-16位密码'))
      }
      if (value.length > 16) {
        callback(new Error('请输入含有数字,字母的8-16位密码'))
      }
      if (!isPositivePassword(trimSpace(value))) {
        callback(new Error('请输入含有数字,字母的8-16位密码'))
      } else {
        callback()
      }
    }
    var validateExitPhone = (rule, value, callback) => {
      var vm = this
      this.$root.ajaxData('/users/validPhone?username=' + this.pwdForm.username + '&telephone=' + this.pwdForm.telephone, {}, function (data) {
        if (data.statusCode !== 200) {
          callback(new Error(vm.$t('checkUserPhone')))
          vm.status = false
        } else {
          vm.status = true
          callback()
        }
      })
    }
    var validateUser = (rule, value, callback) => {
      if (value === undefined || trimSpace(value) === '') {
        callback(new Error('该输入项为必输项'))
      } else {
        if (!isPositiveEmail(trimSpace(value))) {
          callback(new Error('请输入正确的邮箱'))
        } else {
          callback()
        }
      }
    }
    return {
      flag: false,
      logining: false,
      showDetialPhone: true,
      dialogVisible: false,
      status: '',
      radio: this.$t('registerphone'),
      pwdForm: {
        type: '1'
      },
      show: true,
      phone: true,
      showLine: true,
      email: false,
      il: '',
      il1: '',
      captcha: '',
      userStatus: false,
      checkSure: false,
      isActive: false,
      see: false,
      text: this.$t('requireCap'),
      ruleShow: [{ required: true, message: '该输入项为必输项', trigger: 'blur' },
              { validator: validateBlurPassword, trigger: 'blur' }],
      ruleShowCaptcha: [{ required: true, message: this.$t('valid-rule'), trigger: 'blur' },
           { max: 6, min: 6, message: this.$t('valid-Capule'), trigger: 'blur' }],
      ruleShowName: [{ required: true, message: this.$t('valid-rule'), trigger: 'blur' },
           { validator: validateUser, trigger: 'blur' },
           { validator: validateExitUsername, trigger: 'blur' }],
      ruleShowPhone: [{ required: true, message: this.$t('valid-rule'), trigger: 'blur' },
           { validator: validateExitPhone, trigger: 'blur' }],
      checked: true,
      showPhone: [{ required: true, message: this.$t('valid-rule'), trigger: 'blur' },
           { validator: validateExitPhone, trigger: 'blur' }],
      showName: [{ required: true, message: this.$t('valid-rule'), trigger: 'blur' },
           { validator: validateUser, trigger: 'blur' },
           { validator: validateExitUsername, trigger: 'blur' }]
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
    }
  },
  computed: {
    labelWidth: function () {
      let width = ''
      width = '110px'
      return width
    }
  },
  mounted () {
    document.title = this.$t('system-title')
    this.flag = this.$route.query.threg
  },
  methods: {
    // 忘记密码提交
    submitForget (ruleFormPassword) {
      var vm = this
      this.$refs[ruleFormPassword].validate((valid) => {
        if (valid) {
          const telephone = this.pwdForm.telephone
          const username = vm.pwdForm.username
          const password = vm.pwdForm.passWord
          var paramsInfor = { username: username, password: password, telephone: telephone }
          vm.$root.ajaxData('/users/app/update?sha=true', paramsInfor, function (data) {
            vm.$router.push('/login')
            clearInterval(vm.il1)
          }, 'PUT')
        }
      })
    },
    // 校验验证码
    blurCaptcha (val) {
      var vm = this
      const username = this.pwdForm.username
      const telephone = this.pwdForm.telephone
      var params = { telephone: telephone, username: username }
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
    // 注册供应商
    registerSupplier () {
      this.$router.push('/register')
    },
    backLogin () {
      this.$router.push('/login')
      clearInterval(this.il)
    },
    // 忘记密码获取验证码
    getPhoneType () {
      var vm = this
      const telephone = this.pwdForm.telephone
      var params = { mobilePhone: telephone }
      if (this.pwdForm.type === '1') {
        if (this.status === true) {
          if (vm.pwdForm.telephone.length === 11) {
            this.$root.ajaxData('/users/getValidCode', params, function (data) {
              if (data.statusCode === 200) {
                vm.il1 = setInterval(function () {
                  vm.see = false
                  vm.text = vm.$t('requireCap')
                  if (countdown === 0) {
                    clearInterval(vm.il1)
                    countdown = 60
                  } else {
                    vm.see = true
                    countdown--
                    vm.text = vm.$t('obtain') + '(' + countdown + ')'
                  }
                }, 1000)
              } else if (data.statusCode === 10003) {
                vm.$notify.error({
                  title: vm.$t('message'),
                  message: vm.$t('phoneexit')
                })
              } else {
                vm.$notify.error({
                  title: this.$t('message'),
                  message: this.$t('msgFail')
                })
              }
            }, 'POST')
          }
        } else {
          vm.$notify.error({
            title: this.$t('message'),
            message: this.$t('phonenull')
          })
        }
      } else {
        this.$root.ajaxData('/users/email/sendCodeMail?email=' + this.pwdForm.username, {}, function (data) {
          if (data === null) {
            vm.$notify.error({
              title: this.$t('message'),
              message: '发送验证码失败'
            })
            return
          } else {
            vm.il1 = setInterval(function () {
              vm.see = false
              vm.text = vm.$t('requireCap')
              if (countdown === 0) {
                clearInterval(vm.il1)
                countdown = 60
              } else {
                vm.see = true
                countdown--
                vm.text = vm.$t('obtain') + '(' + countdown + ')'
              }
            }, 1000)
          }
        }, 'GET')
      }
    },
    // 手机邮箱忘记密码
    changeType (val) {
      if (val === '2') {
        this.showDetialPhone = false
        this.ruleShowPhone = {}
      } else {
        this.showDetialPhone = true
        this.ruleShowPhone = this.showPhone
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
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
      background-image: url('../assets/images/loginBg.png');
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
  .login-forgetPwd{
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        box-shadow:0px 0px 2px #858282;
        background-color: white;
        background-clip: padding-box;
        width: 400px;
        margin: 80px auto;
        height:400px;
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
    .footer{
      height: 100px;
      text-align:center;
      margin:30px auto;
    }
  }
</style>
