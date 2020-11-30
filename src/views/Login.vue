<template >
<div>
  <el-row class="container" >
  <el-col :span="24" class="header"> </el-col>
  <el-col v-bind:class="{ mainForm: isActive}">
  <el-form :model="form" :rules="rules" ref="form" label-position="right"  class="demo-ruleForm login-container"  v-show="show" >
    <h3 class="title">{{ $t('login-title') }}</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="form.account" :autofocus="true" auto-complete="off" :placeholder="$t('account')"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="form.checkPass" auto-complete="off" :placeholder="$t('password')" @keyup.enter.native="login"></el-input>
    </el-form-item>
    <el-checkbox style="margin-top:15px; margin-bottom:5px" v-model="checked" checked class="remember">{{ $t('remember-password')}}</el-checkbox>
    <el-button type="primary" style="width:100%; margin-bottom:5px"  @click.native.prevent="login" :loading="logining" >{{ $t('login')}}</el-button>
    <el-button type="text" @click="registerSupplier" style="color:black">{{$t('register')}}</el-button>
     <el-button type="text" style="color:black;float:right " @click="forgetPsd">{{$t('forgetPsd')}}</el-button>
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
      <el-dialog title="激活用户" :visible.sync="dialogShowVisible" width="30%" :close-on-click-modal="false">
        <span style="margin:10px">{{$t('activationEmail')}}<el-button @click="sendEmail" size="mini" type="primary">重新发送激活邮件</el-button></span> <span></span>
      </el-dialog>
      </div>       
</template>
<script>
import sha1 from 'node-sha1'
import { API_GATEWAY } from '@/config/index.js'
const sessionStorage = window.sessionStorage
const localStorage = window.localStorage
export default {
  data () {
    return {
      flag: false,
      loginOut: false,
      logining: false,
      dialogVisible: false,
      status: '',
      form: {
        account: '',
        checkPass: ''
      },
      radio: this.$t('registerphone'),
      show: true,
      showr: false,
      dialogShowVisible: false,
      phone: true,
      showLine: true,
      email: false,
      il: '',
      il1: '',
      checked: true,
      captcha: '',
      userStatus: false,
      checkSure: false,
      isActive: true,
      showPwd: false,
      see: false,
      text: this.$t('requireCap'),
      rules: {
        account: [
          { required: true, message: this.$t('valid-account'), trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: this.$t('valid-password'), trigger: 'blur' }
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
    }
  },
  computed: {
    labelWidth: function () {
      let width = ''
      if (this.form.inline) {
        width = '110px'
      } else if (typeof (this.form.labelWidth) === 'undefined') {
        width = '110px'
      } else {
        width = this.form.labelWidth
      }
      return width
    }
  },
  mounted () {
    document.title = this.$t('system-title')
    this.loginOut = this.$route.query.redrect
  },
  methods: {
    login () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.logining = true
          const username = this.form.account.trim()
          const password = sha1(this.form.checkPass.trim())
          var params = { username: username, password: password }
          const vm = this
          this.$http.post(API_GATEWAY + '/auth', params, {})
          .then(response => {
            vm.logining = false
            const data = response.body
            sessionStorage.setItem('token', JSON.stringify(data.token))
            sessionStorage.setItem('refreshToken', JSON.stringify(data.refreshToken))
            localStorage.setItem('token', JSON.stringify(data.token))
            localStorage.setItem('unlogin', 'login')
            const token = sessionStorage.getItem('token')
            this.$http.get(API_GATEWAY + '/user',
              {
                headers: {
                  'Authorization': 'Bearer ' + token,
                  'Accept': 'application/json',
                  'Prefer-Lang': sessionStorage.getItem('prefer-lang')
                }
              }).then((response) => {
                if (response.data.pwdStatus === '0') {
                  vm.$message({
                    message: '请及时修改初始密码',
                    type: 'warning'
                  })
                }
                if (response.data.status === '0') {
                  this.userStatus = true
                } else {
                  this.userStatus = false
                }
                if (response.data) {
                  vm.$root.ajaxData(`/tenants/getFilterTenant?id=${response.data.tenantId}`, {}, function (data) {
                    response.data.companyName = data.name
                    sessionStorage.setItem('user', JSON.stringify(response.data))
                    localStorage.setItem('user', JSON.stringify(response.data))
                  }, 'GET')
                  this.sysUserName = response.data.firstname
                }
            // 报表系统跨域单点登录
                if (this.userStatus === true) {
                  vm.$message({
                    message: '该用户未激活',
                    type: 'error'
                  })
                  this.dialogShowVisible = true
                  return
                } else {
                  if (this.loginOut) {
                    window.location.href = 'http://' + this.loginOut
                  } else {
                    vm.$router.push({ path: '/' })
                  }
                }
              })
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
        } else {
          return false
        }
      })
    },
    sendEmail () {
      var vm = this
      this.$root.ajaxData('/users/email/sendActiveMail?email=' + this.form.account, {}, function (data) {
        if (data.statusCode === 200) {
          vm.$message({
            message: '发送成功',
            type: 'success'
          })
          vm.dialogShowVisible = false
          return
        }
      }, 'GET')
    },
    getUser () {
      var vm = this
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
    // 忘记密码
    forgetPsd () {
      this.$router.push('/forgetPwd')
    },
    // 注册供应商
    registerSupplier () {
      this.$router.push('/register')
    }
  }
}
</script>
<style lang="scss" scoped>
  .login-registration
  {
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
      width: 360px;
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
      // background-size: 100% auto;
        .login-container {
          -webkit-border-radius: 5px;
          border-radius: 5px;
          -moz-border-radius: 5px;
          background-color: white;
          background-clip: padding-box;
          margin: 180px;
          float: right;
          width: 15%;
          height:60%;
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
      margin:10px auto;
    }
  }
</style>
