<template>
  <div class="home">
    <el-row class="container">
      <el-col :span="24" class="header">
        <el-col :span="10" class="logo" :class="collapsed ? 'logo-collapse-width' : 'logo-width'">
          <i class="iconfont icon-dianweilogo" v-if="!collapsed"></i>
          <!-- <span class="sccp">{{ collapsed ? $t('title') : title }}</span> -->
          <!-- <img v-if="collapsed" src="../assets/images/logoDianlian.png"/> -->
          <span v-if="collapsed"><img src="../assets/images/logoDianlian1.png"/></span>
          <span class="sccp" v-else>{{ title }}</span>
        </el-col>
        <el-col :span="4">
          <div class="tools" @click.prevent="collapse">
            <i class="fa fa-align-justify"></i>
            <!--{{ $n(100, 'currency') }}-->
          </div>
        </el-col>
        <el-col :span="12" class="userinfo">
          <!--消息推送-->
          <!-- <el-dropdown @command="handleCommandMsg" trigger="hover" class="noteMsg">
            <span class="el-dropdown-link lang iconfont icon-tixing"><span v-if="msgCount !== 0" class="count">{{msgCount}}</span></span>
            <el-dropdown-menu slot="dropdown" v-if="noteMessage !== []">
              <el-dropdown-item v-for="(item, key, index) in noteMessage" :key="index" :command="item" class="msgItem">{{item.name}}<span class="msgCount">{{item.count}}</span></el-dropdown-item>
            </el-dropdown-menu>
            <el-dropdown-menu slot="dropdown" v-else>
              <el-dropdown-item ><span>{{ $t('setting') }}</span></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
          <!--语言切换-->
          <!-- <a href="../static/operation/index.html">操作手册</a> -->
          <div class="wrapper">
            <marquee>{{scrollData}}</marquee>
          </div>
          <div class="userChange" v-show="userMsg.userCompanyName">
            <el-dropdown @command="handleCommandCom" trigger="hover">
              <span class="el-dropdown-link lang">
                <span v-show="companyName" class="companyName">{{companyName}}</span>
                <span v-show="companyArrLength > 1 && !companyName">切换公司</span>
              </span>
              <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item v-for="(item, key) in companyArr" :key="key">{{item}}</el-dropdown-item> -->
                <el-dropdown-item v-for="(item, key, index) in companyArr" :key="index" :command="item">{{ item }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
            <!--<span v-show="showClcpLink"  @click="openClcpPage()" class="operation">金票系统</span>   -->
          <span  @click="openOperation()" class="operation">文档中心</span>
          <el-dropdown @command="handleCommand" trigger="hover">
            <span class="el-dropdown-link lang">{{ $t('locales.' + locale) }}</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item, key, index) in langs" :key="index" :command="key">{{ $t('locales.' + key) }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!--用户个人-->
          <el-dropdown trigger="hover">
            <span class="el-dropdown-link userinfo-inner">{{sysUserName}} <img :src="this.sysUserAvatar"></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>{{ $t('myMessages') }}</el-dropdown-item>
              <el-dropdown-item @click.native="editPassword" >{{ $t('CHANGE_PASSWORD') }}</el-dropdown-item>
              <el-dropdown-item @click.native="setMessage" v-if="userAdmin">{{ $t('setting') }}</el-dropdown-item>
              <el-dropdown-item @click.native="setPersonMessage" v-if="noAdmin">{{ $t('PERSONAL_INFO') }}</el-dropdown-item>
              <el-dropdown-item @click.native="goRecordCashier" >{{ $t('RECORD_CASHIER') }}</el-dropdown-item>
              <el-dropdown-item divided @click.native="logout">{{ $t('logout') }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-col>
      <el-col :span="24" class="main">
        <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
          <!--导航菜单-->
          <el-menu :default-active="menusIndex" class="el-menu-vertical-demo" background-color="#35384d" text-color="#fff" active-text-color="#ffd04b" unique-opened v-show="!collapsed" ref="menuExpanded">
            <template v-for="(item,index) in menus">
              <el-menu-item  :index="item.name" v-if="!item.children" :key="index" @click="sendChild(item)">
                <i :class="item.iconCls"></i>
                <span slot="title">{{item.name}}</span>
              </el-menu-item>
              <el-submenu class="sub_size" :index="item.name" v-if="!item.leaf && item.children" :key="index">
                <template slot="title"><i :class="item.iconCls" class="white"></i>{{item.name}}</template>
                <template v-for="child in item.children">
                  <el-menu-item :index="child.name" v-if="!child.hidden" @click="sendChild(child)" :key="child.index">{{child.name}}</el-menu-item>
                </template>
              </el-submenu>
              <el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].index" :key="index"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
            </template>
          </el-menu>
          <!--导航菜单-折叠后-->
          <ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed"  background-color="#35384d" text-color="#fff" active-text-color="#ffd04b" ref="menuCollapsed">
            <li v-for="(item,index) in menus" class="el-submenu item" :key="index">
              <template v-if="!item.leaf">
                <div class="el-submenu__title" v-if="!item.children" style="padding-left: 20px;" @click="sendChild(item)"><i :class="item.iconCls"></i></div>
                <div class="el-submenu__title" v-if="item.children" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i :class="item.iconCls"  class="white"></i></div>
                <ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
                  <template v-for="child in item.children">
                    <li :key="child.index" v-if="!child.hidden" class="el-menu-item" style="padding-left: 30px;" :class="currentMenu.index==child.index?'is-active':''" @click="sendChild(child)">{{child.name}}</li>
                  </template>
                </ul>
              </template>
              <template v-else>
                <div class="el-submenu">
                  <div class="el-submenu__title el-menu-item" style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;" :class="currentMenu.index==item.children[0].index?'is-active':''" @click="sendChild(item)"><i :class="item.iconCls"></i></div>
                </div>
              </template>
            </li>
          </ul>
        </aside>
        <section class="content-container">
          <!-- <div >
            <el-button size="mini" icon="el-icon-close" @click="closeAll" class="closeAll" ></el-button>
            </div> -->
          <div style="height: 100%;">
          <el-tabs v-model="activeName" type="border-card"  :addable="false" @edit="handleTabsEdit" @tab-click="clickTab(activeName)">
            <el-tab-pane
              :key="item.name + index"
              v-for="(item,index) in tabMenu"
              :label="item.title"
              :name="item.name"
              :closable="item.closable"
            >
            <!-- <div>{{tabMenu}}</div> -->
            </el-tab-pane>
          </el-tabs>
            <div class="component-wrapper">
              <el-col :span="24" class="content-wrapper">
                <transition name="fade" mode="out-in">
                    <component :mate="mate" :isTabCome="isTabCome"
                      @route="onRoute"
                      @saleCheckedMethod="saleCheckedMethod" :saleCheckedHome="saleCheckedHome"
                      @closeTab="closeTab"
                      @getEbsResult="getEbsInvoiceStatus"
                      @isActive="isActive"
                      v-bind:is="view">
                    </component>
                </transition>
              </el-col>
            </div>
          </div>
        </section>
      </el-col>
    </el-row>
    <el-button type="text"  class="wmarginButton" @click="showQq">在线帮助</el-button>
    <el-dialog :visible.sync="showDetial" class="homeDialog" width="380px" :show-close="false" :modal="false" >
      <div class="wmargin" ref="wmargin" >
        <div class="wmarginHeader">
          <el-popover placement="left" title="在线QQ客服" width="180" trigger="hover" popper-class="popoverQQ">
            <img src="../assets/images/qq.png" class="imgWmargin" slot="reference"/>
            <div>
              <span>在线客服1：<a   href="tencent://message/?v=3&uin=845174804&site=qq&menu=yes"><img border="0"  class="imgOnline" src="http://wpa.qq.com/pa?p=2:845174804:51" alt="点击这里给我发消息" title="点击这里给我发消息"/></a></span>
            </div>
            <div>
              <span>在线客服2：<a   href="tencent://message/?v=3&uin=673119048&site=qq&menu=yes"><img border="0" src="http://wpa.qq.com/pa?p=2:673119048:51" alt="点击这里给我发消息" title="点击这里给我发消息"/></a></span>
            </div>
          </el-popover>
        </div>
        <div class="wmarginHeader" @click="openOnline">
          <img src="../assets/images/problem.png" class="imgWmargin" />
        </div>
        <div class="wmarginHeader">
          <el-popover placement="left" title="电话热线" width="70" trigger="hover" popper-class="popoverOnline" content="0755-23697581">
            <img src="../assets/images/phone.png" class="imgWmargin" slot="reference"/>
          </el-popover>
        </div>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogOnlineMessage"  class="homeDialog" width="380px" :show-close="false" :modal="false" >
      <el-card   class="homeOnlineCard"  >
        <div slot="header" class="clearfix">
          <span style="font-size:16px;color:white">常见问题</span>
          <el-button style="float: right; padding: 3px 0;color: white" type="text" @click="closeProblem">关闭</el-button>
        </div>
        <div>
          <el-row>
            <el-collapse  accordion>
              <el-collapse-item title="开票规则中的是否红字怎么选择？？" >
                <div>回答：出现退货商品，如果采购要求开具红字发票，则选择是，如果需稀释在其他商品中，则选择否</div>
                <!-- <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div> -->
              </el-collapse-item>
              <el-collapse-item title="预制发票中商品信息显示错误，如何修改？？" >
                <div>回答：将新生成的预制发票勾选删除，然后在税收分类代码管理维护好物料信息，再次生成预制发票即可</div>
                <!-- <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div> -->
              </el-collapse-item>
            </el-collapse>
          </el-row>
        </div>
      </el-card>
    </el-dialog>
    <!-- 修改密码 -->
    <el-dialog :visible.sync="dialogSendMessage"  class="homePassDialog" width="380px" :show-close="false" :modal="false" >
      <el-card class="homeCard" ref="homeCard"  shadow="always">
        <div slot="header" class="clearfix">
          <span style="font-size:16px;color:white">修改密码</span>
        </div>
        <div>
          <el-row>
            <el-form size="mini" ref="sendForm" :model="passwordForm" label-width="100px" :rules="rules">
              <el-col :span="20">
                <el-form-item label="原密码" prop="oldPassword">
                  <el-input  :type="oldPassType" v-model="passwordForm.oldPassword">
                    <i  slot="suffix" @click="changeType" :class="imgClass"></i>
                  </el-input>
                </el-form-item>
                <!-- <el-form-item label="原密码" prop="oldPassword">
                  <el-input  :type="oldPassType" v-model="passwordForm.oldPassword">
                    <i slot="suffix" class="el-input__icon el-icon-view"></i>
                  </el-input>
                </el-form-item> -->
                  <!-- <input class="passwordInput" type="password" v-model="passwordForm.oldPassword"/>
                </el-form-item> -->
              </el-col>
              <el-col :span="20">
                <el-form-item label="新密码" prop="passWord">
                  <el-input  :type="passType" v-model="passwordForm.passWord">
                    <i  slot="suffix" @click="changePassType" :class="passClass"></i>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item>
                  <el-button size="mini" type="primary" @click="confrimSendVisible">确定</el-button>
                  <el-button size="mini" @click="cancelSendVisible">取消</el-button>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </div>
      </el-card>
    </el-dialog>
    <el-dialog :visible.sync="dialogPersonMessage"  class="homePassDialog" width="380px" :show-close="false" :modal="false" >
      <el-card class="homePersonCard" ref="homeCard" shadow="always">
        <div slot="header" class="clearfix">
          <span style="font-size:16px;color:white">个人信息</span>
        </div>
        <div>
          <el-row>
            <el-form size="mini" ref="personForm" :model="personForm" label-width="100px" :rules="rulesPersonForm">
              <el-col :span="20">
                <el-form-item label="当前头像" prop="avatar">
                  <el-upload  :action="personUrl"  :show-file-list="false" list-type="picture-card" :on-success="handleAvatarSuccess">
                    <img v-if="imageUrl" :src="imageUrl" class="avatarImg">
                    <i v-show="isShow" class="el-icon-plus"></i>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="用户名" prop="username">
                  <input class="personInput" v-model="personForm.username"/>
                </el-form-item>
                <el-form-item label="手机号" prop="telephone">
                  <input class="personInput" type="telephone" v-model="personForm.telephone"/>
                </el-form-item>
                <el-form-item label="姓" prop="firstname">
                  <input class="personInput" type="firstname" v-model="personForm.firstname"/>
                </el-form-item>
                <el-form-item label="名" prop="lastname">
                  <input  class="personInput" type="lastname" v-model="personForm.lastname"/>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item>
                  <el-button size="mini" type="primary" @click="confrimPersonVisible">确定</el-button>
                  <el-button size="mini" @click="cancelPersonVisible">取消</el-button>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </div>
      </el-card>
    </el-dialog>
    <component :recordDialogVisible="recordDialogVisible" :show-close="false"  v-bind:is="RecordCashier" :agreementUrl="agreementUrl" :btnStatus="btnStatus" :iframeUrl="iframeUrl" @handleConfirm="handleConfirm" @handleCancle="handleCancle"></component>
    <el-button type="text"  class="absButton" @click="showAbsDialog">ABS融资</el-button>
    <!--abs dialog Start -->
    <el-dialog :visible.sync="absDialog" :show-close="true" width="480px">
      <a href="javascript:void (0);" @click="goABS">
        <img src="../assets/images/abs.png" style="padding-left: 30px;">
        <P style="text-align:center;font-size:20px;margin:0;color:red">点我立即查看</P>
      </a>
    </el-dialog>
    <!--abs dialog End -->
  </div>
</template>
<script>
import { API_GATEWAY, DJ_URL, SSE_SERVER } from '@/config/index.js'
//import { ssoLogout } from '../../api/sso'
import DictStore from '../store/dict-store.js'
import { LANGS } from '../i18n/lang'
import { getLang,getUrlKey } from '../utils/util.js'
import { trimSpace, isPositivePassword, isPositiveEmail } from '../utils/util.js'
import sha1 from 'node-sha1'
import components from '../components'
import { debuglog } from 'util'
import { BaseConstant } from '../constant/BaseConstant'

const sessionStorage = window.sessionStorage
export default {
  components: components,
  data () {
    var validatePassword = (rule, value, callback) => {
      var vm = this
      var user = window.sessionStorage.getItem('user')
      user = JSON.parse(user)
      var username = user.username
      var password = sha1(value)
      var params = { username: username, password: password }
      this.$http.post(API_GATEWAY + '/auth', params, {})
      .then(response => {
        const status = response.data.statusCode
        if (status === 1001 ) {
          callback(new Error('原密码错误'))
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
    var validateExitUsername = (rule, value, callback) => {
      var vm = this
      this.$root.ajaxData('/register/checkUserName?userName=' + this.personForm.username, {}, function (data) {
        if (data.statusCode !== 200 && vm.personForm.username !== data.data.username) {
          callback(new Error(vm.$t('checkUsername')))
        } else {
          callback()
        }
      })
    }
    return {
      scrollData: null, // 滚动条数据
      showClcpLink: false,
      // i18n attr start
      // 切换的公司的名称
      companyName: '',
      saleCheckedHome: false,
      isTabCome: false,
      locale: getLang(),
      oldPassType: 'password',
      passType: 'password',
      langs: LANGS,
      skins: [{ name: 'default', label: this.$t('default') }, { name: 'purple', label: this.$t('purple') }],
      // i18n attr end
      collapsed: false,
      showDetial: false,
      personForm: {},
      sysUserName: '',
      menusIndex: '0',
      sysUserAvatar: require('../assets/images/user.png'),
      title: '',
      caption: '管理页面',
      menus: [],
      personUrl: API_GATEWAY + '/api/app/file',
      dialogSendMessage: false,
      dialogPersonMessage: false,
      currentMenu: {},
      rulesPersonForm: {
        username: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' },
          { validator: validateUser, trigger: 'blur' },
          { validator: validateExitUsername, trigger: 'blur' }
        ]
      },
      rules: {
        oldPassword: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        passWord: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' },
          { validator: validateBlurPassword, trigger: 'blur' }
        ]
      },
      titleName: '',
      view: '',
      imgClass: 'icon iconfont icon-xianshi',
      passClass: 'icon iconfont icon-xianshi',
      userAdmin: true,
      imageUrl: '',
      noAdmin: false,
      isShow: true,
      passwordForm: {},
      tabMenu: [],
      activeName: '0',
      closable: true,
      mate: {},
      es: {},
      sysUser: {},
      sysToken: '',
      tabIndex: -1,
      noteMessage: [],
      msgCount: 0,
      sseStatus: 0,
      tabMap: new Map(),
      userMsg: {},
      companyArr: [],
      companyArrLength: 0,
      clickMenus: [],
      headers: {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
        'Accept': 'application/json',
        'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
        'Content-Type': 'application/json;charset=utf8'
      },
      dialogOnlineMessage: false,
      RecordCashier: "DialogIframe",
      recordDialogVisible: false,
      btnStatus:'2',
      iframeUrl: '',
      agreementUrl: '',
      absDialog: true,
    }
  },
  created: function () {
    //查询当前用户是否有进入金票系统的 权限
      var userId = JSON.parse(window.sessionStorage.getItem('user')).id
      var tenantId = JSON.parse(window.sessionStorage.getItem('user')).tenantId
      var vm = this
      // this.$http({
      //     url: API_GATEWAY + '/clcp/auth/query/'+userId+'/'+tenantId,
      //     method: 'GET',
      //     headers: this.headers,
      //     responseType: 'application/json'
      // }).then(function (data) {
      //     if (data.code == 10011) {
      //         vm.showClcpLink=false
      //     }else{
      //         this.$root.ajaxData('/users/validClcpRole?id='+userId, {} ,function (data) {
      //             if (data.statusCode == 200) {
      //                 vm.showClcpLink=true
      //             }
      //         },'GET')
      //     }
      // })
    
    // this.setupStream(
    var user = window.sessionStorage.getItem('user')
    this.companyName = JSON.parse(window.localStorage.getItem('user')).companyName
    var pwdStatus= JSON.parse(window.localStorage.getItem('user')).pwdStatus
    if (pwdStatus === '0') {
      vm.$message({
        message: '请及时修改初始密码',
        type: 'warning'
      })
    }
    window.localStorage.removeItem('lineSelected')
    window.localStorage.removeItem('detailLineSelect')
    this.sysUser = window.localStorage.getItem('user')
    this.$root.monitor = this.refresh
    this.$root.refreshSysMenu = this.refreshSysMenu
    //var vm = this
    //document.body.style = ''
    this.$nextTick(function () {
      //var vm = this
      // 获取管理页面框架信息[标题、菜单列表、管理员信息]
      if (user) {
        user = JSON.parse(user)
        this.userMsg = user
      }
      if (this.userMsg.userCompanyName) {
        this.companyArr = this.userMsg.userCompanyName.split(',')
        this.companyArr = [...new Set(this.companyArr)]
        this.companyArrLength = this.companyArr.length
        if (this.companyArrLength > 1) {
          this.$root.ajaxData('/tenants/get/tenant?tenantId=' + user.tenantId, {}, function (data) {
            vm.companyName = data.name
          })
        }
      }
      if (user.userType === 3) {
        this.userAdmin = false
        this.noAdmin = true
      } else {
        this.userAdmin = true
        this.noAdmin = false
      }
      /**
       * 调用缴费协议接口
       * 根据后台返回结果 statusCode 200 弹出收费协议
       */
      let url = "/purchase/pay/notice/query"
      this.$root.ajaxData(url, {}, function (res) {
        if(res.statusCode === 200) {
          vm.recordDialogVisible = true
          vm.iframeUrl = res.data
          vm.agreementUrl = res.resultParam
        } else {
          vm.recordDialogVisible = false
          vm.iframeUrl = ''
          vm.agreementUrl = ''
        }
      })

       let btnUrl = "/purchase/pay/notice/get/btn/status"
       this.$root.ajaxData(btnUrl, {}, function (res) {
        if(res.statusCode === 200) {
          vm.btnStatus = res.data
        }
      })
      // menus 菜单接口
      this.$root.ajaxData(window.bench, {}, function (data1) {
          // console.log(data1)
        vm.title = data1.title
        if (data1.menus.length === 0) {
          vm.$message({
            message: '请管理员分配角色和权限',
            type: 'warning',
            duration: 5000
          })
          return
        }
        vm.$root.ajaxData('/companys/perfectInfo', {}, function (data) {
          if (data.mate.mateFormerHeader.values.status === '1') {
            vm.menus = data1.menus
            vm.currentMenu = (data1.menus[0].children ? data1.menus[0].children[0] : data1.menus[0])
            if(getUrlKey('type')){
              vm.orgChange(vm.menus, getUrlKey('type'))
              vm.sendChild(vm.clickMenus)
              vm.menusIndex = vm.clickMenus.name
            } else {
              vm.sendChild(vm.currentMenu)
            }
            // let currentMenu = (data1.menus[0].children ? data1.menus[0].children[0] : data1.menus[0])
            // vm.sendChild(currentMenu)
            return
          } else {
            if (user.userType !== 1) {
              vm.menus = data1.menus
              vm.currentMenu = (data1.menus[0].children ? data1.menus[0].children : data1.menus[0])
              // let currentMenu = (data1.menus[0].children ? data1.menus[0].children : data1.menus[0])
              // vm.sendChild(currentMenu)
              if(getUrlKey('type')){
                vm.orgChange(vm.menus, getUrlKey('type'))
                vm.sendChild(vm.clickMenus)
                vm.menusIndex = vm.clickMenus.name
              } else {
                vm.sendChild(vm.currentMenu)
              }
              return
            } else {
              vm.$message({
                message: '请完善信息',
                type: 'warning'
              })
              data.url = '/companys/perfectInfo'
              vm.sendChild(data)
            }
          }
        })
      })
    })

    // 加载数据字典data
    DictStore.fetch()
    this.scrollReport() // 2019-10-25 报500 注释掉
    document.addEventListener('click', function (e) {
      // var sp = document.getElementsByClassName('wmargin')
      // console.log(sp)
      // console.log(vm.$refs)
      // if (!vm.$refs.wmargin.contains(e.target)) {
      //   vm.dialogOnlineMessage = false
      // }
      // if (e.target.className !== 'usermessage') {
      //   this.userClik = false
      // }
    })
  },
  watch: {
    noteMessage: function () {
      // this.setupStream()
    },
    sysUser: function (val, old) {
    }
  },
  methods: {
    // 展示abs弹框
    showAbsDialog () {
      this.absDialog = true;
    },
    // 跳转ABS介绍
    goABS(){
      this.$router.push('/absManagement')
    },
    // 使用递归函数调用
    orgChange (data,val) {
      for (const i of data) {
        if(i.name === val) {
          this.clickMenus = i
          break
        } else {
          if(i.children){
            this.orgChange(i.children,val)
          }
        }
      }
    },
    //轮训查询生成ebs应付发票是否成功
    getEbsInvoiceStatus(row){
      var vm = this
      var count = 0
      var timer = setInterval(() => {
        if(count == 4){
          // 销毁定时器
          vm.$root.monitor({ url: '/purchase/invoice/payment/get/list' })
          clearInterval(timer);
        } else{
          this.$root.ajaxData('/purchase/invoice/payment/' + row.id, {},function (data) {
          if(data.state == '2'){
            vm.$root.monitor({ url: '/purchase/invoice/payment/get/list' })
            clearInterval(timer);
          }
          //第二次循环查询应付发票生成ebs发票是否成功，提示信息值显示一次
          if(count >=0 && count <4){
            var msg = data.ebsMsg
            if(msg != '' && msg != null){
              var reg = /[\u4e00-\u9fa5\-\d\\(\\)\,]/g
              var ebsMsg = msg.match(reg);
              msg = ebsMsg.join("")
              msg = msg.substring(0,msg.lastIndexOf("-"));
                vm.$message({
                  type: 'warning',
                  message: msg,
                  duration: 15000,
                  showClose: true
                })
              }
            }
          }, 'GET')
        }
        count ++
      },20000);
    },
    isActive(val){
      this.menusIndex = val
    },
    setupStream () {
      var vm = this
      // 检查浏览器是否支持 SSE
      if (typeof EventSource !== 'undefined') {
        let user = window.sessionStorage.getItem('user')
        if (user) {
          user = JSON.parse(user)
        }
        var timestamp = new Date().getTime()
        const url = `${SSE_SERVER}/sse/stream?channel=topic1&tenantId=${user.tenantId}&userId=${user.id}&timestamp=${timestamp}`
        const eventSource = new EventSource(url, { withCredentials: true })
        eventSource.onopen = function (e) {
          console.log('sse connected')
          // 判断是否触发成功, 若成功则不再触发
          if (!vm.sseStatus) {
            vm.$root.ajaxData('/purchase/inquiry/sheet/countMsg', {}, function (data) {
            }, 'GET')
          }
        }
        eventSource.onmessage = function (event) {
          // 先清空，然后将数据放进去
          vm.noteMessage = []
          vm.msgCount = 0
          const parseData = JSON.parse(event.data)
          if (parseData.dataCategory === 'purchase' || parseData.dataCategory === 'purchaseOrder') {
            // vm.noteMessage.push(parseData.data)
            vm.noteMessage = parseData.data
          }
          if (vm.noteMessage.length) {
            vm.noteMessage.forEach(i => {
              vm.msgCount += i.count
            })
          }
        }
        eventSource.onerror = function (err) {
          if (err.target.readyState === 0) {
            // 消息服务异常,无法创建连接
            console.log('消息服务异常,无法创建连接')
          } else if (err.target.readyState === 2) {
            // 消息服务断开,无法及时收到消息
            console.log('消息服务断开,无法及时收到消息')
          }
        }

        this.es = eventSource
      } else {
        console.log('浏览器不支持EventSource')
      }
    },
    openOperation () {
      this.$http({
        url: API_GATEWAY + '/api/supplier-portal/file/operationGuidelines',
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
          'Accept': 'application/json',
          'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
          'Content-Type': 'application/json;charset=utf8'
        }, 
        responseType: 'arraybuffer'
      }).then(function (response) {
        var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        // blob(size,type) Blob构造函数，接受两个参数。第一个参数是一个包含实际数据的数组，第二个参数是数据的类型
        var objectUrl = URL.createObjectURL(blob)
        var a = document.createElement('a')
        document.body.appendChild(a)
        a.setAttribute('style', 'display:none')
        a.setAttribute('href', objectUrl)
        var fileName = ''
        fileName ='操作手册.zip'
        a.setAttribute('download', fileName)
        a.click()
      })
    },
    openClcpPage(){
      // window.open('http://172.30.7.18:8077?on=single')
      // window.open('http://localhost:9528?on=single')
    },
    // 取消修改密码
    cancelSendVisible () {
      this.dialogSendMessage = false
      this.passwordForm = {}
    },
    changeType(){
      if(this.oldPassType === 'password') {
        this.oldPassType = ''
        this.imgClass = 'icon iconfont icon-icon-test1'
      } else {
        this.oldPassType = 'password'
        this.imgClass = 'icon iconfont icon-xianshi'
      }
    },
    changePassType(){
      if(this.passType === 'password') {
        this.passType = ''
        this.passClass = 'icon iconfont icon-icon-test1'
      } else {
        this.passType = 'password'
        this.passClass = 'icon iconfont icon-xianshi'
      }
    },
    // 修改密码保存
    confrimSendVisible () {
      var vm = this
      this.$refs['sendForm'].validate((valid) => {
        if (valid) {
          const telephone = this.passwordForm.telephone
          var user = window.sessionStorage.getItem('user')
          user = JSON.parse(user)
          var username = user.username
          const password = this.passwordForm.passWord
          var paramsInfor = { username: username, password: password, telephone: telephone }
          vm.$root.ajaxData('/users/app/update?sha=true', paramsInfor, function (data) {
            vm.$router.push('/login')
          }, 'PUT')
        }
      })
    },
    // 修改密码
    editPassword () {
      this.dialogSendMessage = true
      this.passwordForm = {}
    },
    // 获取tab页面
    getTabView (item) {
      var vm = this
      this.$root.ajaxData(item.url, {}, function (data) {
        vm.mate = data.mate
        vm.mate.localName = data.name
        vm.titleName = data.title
        vm.view = data.view || data.currentView
        vm.caption = data.name
      })
    },
    // 删除tabs
    handleTabsEdit (targetName, action) {
      if (this.tabMenu[targetName].title === '税收分类代码管理') {
        sessionStorage.removeItem('comfirmValue')
      }
      if (this.tabMenu[targetName].title === '对账单') {
        this.isTabCome = false
        this.saleCheckedHome = false
        localStorage.removeItem('settlement')
      }
      const tabs = this.tabMenu
      let activeName = this.activeName
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            activeName = targetName
          }
        })
      }
      this.tabMap.clear()
      this.tabMenu = tabs.filter(tab => tab.name !== targetName)
      for (var i = 0; i < this.tabMenu.length; i++) {
        var j = i.toString()
        this.tabMenu[i].name = j
        this.tabMap.set(this.tabMenu[i].title, this.tabMenu[i])
      }
      var intName = parseInt(targetName)
      if (intName === this.tabMenu.length) {
        this.activeName = this.tabMenu[this.tabMenu.length - 1].name
        if (this.tabMenu[this.tabMenu.length - 1] !== undefined) {
          this.mate = this.tabMenu[this.tabMenu.length - 1].mate
          this.view = this.tabMenu[this.tabMenu.length - 1].view
        } else {
          this.mate = this.tabMenu[this.tabMenu.length - 1].mate
          this.view = this.tabMenu[this.tabMenu.length - 1].view
        }
      } else {
        this.activeName = targetName
        if (this.tabMenu[intName].localName !== undefined) {
          this.mate = this.tabMenu[intName].mate
          this.view = this.tabMenu[intName].view
        } else {
          this.mate = this.tabMenu[intName].mate
          this.view = this.tabMenu[intName].view
        }
      }
    },
    confrimPersonVisible () {
      var user = window.sessionStorage.getItem('user')
      user = JSON.parse(user)
      var vm = this
      this.$root.ajaxData('/users/' + user.id, this.personForm, function (data) {
        vm.dialogPersonMessage = false
        vm.userMsg.username = vm.personForm.username
        vm.userMsg.avatar = vm.personForm.avatar
        vm.userMsg.firstname = vm.personForm.firstname
        vm.userMsg.lastname = vm.personForm.lastname
        vm.userMsg.telephone = vm.personForm.telephone
        window.localStorage.setItem('user', JSON.stringify(vm.userMsg))
        window.location.href = window.location.href
      }, 'PUT')
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = file.response.data
      this.isShow = false
      this.personForm.avatar = file.response.data
    },
    // 全部关闭
    closeAll () {
      var vm = this
      this.isTabCome = false
      this.saleCheckedHome = false
      localStorage.removeItem('settlement')
      var length = this.tabMenu.length
      this.tabMenu.splice(1, length - 1)
      this.tabMap.forEach(function (value, key, map) {
        if (value.name !== 0) {
          vm.tabMap.delete(key)
        }
      })
      this.mate = this.tabMenu[0].mate
      this.view = this.tabMenu[0].view
      this.activeName = this.tabMenu[0].name
    },
    // 点击tabs 跳转页面
    clickTab (tab, event) {
      const tabs = this.tabMenu
      const activeName = this.activeName
      // var vm = this
      if (tab === activeName) {
        tabs.forEach((item, index) => {
          if (item.name === tab) {
            this.mate = item.mate
            this.view = item.view
            this.isTabCome = true
          }
        })
      }
    },
    handleCommand (command) {
      if (command !== window.sessionStorage.getItem('prefer-lang')) {
        this.locale = command
        sessionStorage.setItem('prefer-lang', command)
        document.title = this.$t('system-title')
        window.location.href = window.location.href
      }
    },
    handleCommandCom (command) {
      if (command !== this.companyName) {
        let userSession = ''
        let vm = this
        this.$root.ajaxData(`/tenants/getFilterTenant?name=${command}`, {}, function (data) {
          vm.userMsg.tenantId = data.id
          vm.userMsg.companyName = command
          window.localStorage.setItem('user', JSON.stringify(vm.userMsg))
          vm.companyName = command
          window.location.href = window.location.href
        }, 'GET')
      }
    },
    handleCommandMsg (command) {
      const vm = this
      this.sendChild(command)
      this.noteMessage.forEach((item, i) => {
        if (item.name === command.name) {
          vm.noteMessage.splice(i, 1)
        }
      })
      this.msgCount = 0
      vm.noteMessage.forEach(i => {
        vm.msgCount += i.count
      })
    },
    onRoute (view, mate) {
      this.view = view
      this.mate = mate
    },
      // tab点击事件
    sendChild (submenu) {
      this.currentMenu = submenu
      this.titleName = submenu.name
      if (submenu.name === '保理') {
        //window.open(DJ_URL)
          //window.open("http://172.30.7.20:8380/factor")
          var user = JSON.parse(window.sessionStorage.getItem('user'))
          var url = DJ_URL+ '/a/sys/register/checkSupplierExists?companyName='
              +user.userCompanyName+'&username='+user.username+'&mobile=' + user.mobile
          this.$http({
              url: url,
              method: 'GET',
              responseType: 'application/json'
          }).then(function (data) {
              if(data.body.statusCode!=200){
                  var url = "../../static/dj.html?userName="+user.username+"&phone=" + user.phone
                  window.open(url,"_blank")
              }else{
                  this.$message({
                      message: "请先完善保理系统所需信息！",
                      type: 'error'
                  })
              }
          })
      }else if(submenu.name === '关务物流'){
          window.open("../../static/logistics.html","_blank")
      } else if(submenu.name === '生产监控'){
          window.open("../../static/mes.html","_blank")
          // window.open("http://172.16.98.51:8081/swd-web/xwd/demo/homePage5.html","_blank")
      } else if(submenu.name === 'SWA监控'){
          window.open("../../static/mes1.html","_blank")
      }else if(submenu.name === '工业设备'){
          window.open("http://192.168.9.150:8075/WebReport/ReportServer?formlet=FM_T.frm","_blank")
          // window.open("http://172.16.98.51:8081/swd-web/xwd/demo/homePage5.html","_blank")
      } else {
        this.refresh(submenu)
      }
    },
    cancelPersonVisible () {
      this.dialogPersonMessage = false
    },
    setPersonMessage () {
      var vm = this
      var user = window.sessionStorage.getItem('user')
      if (user) {
        user = JSON.parse(user)
      }
      this.$root.ajaxData('/users/detail/' + user.id, {}, function (data) {
        vm.personForm = data.data
        vm.imageUrl = data.data.avatar
        vm.dialogPersonMessage = true
        if (vm.imageUrl) {
          vm.isShow = false
        }
      })
    },
    setMessage () {
      var vm = this
      var user = window.sessionStorage.getItem('user')
      if (user) {
        user = JSON.parse(user)
      }
      if (user.userType === 1) {
        var data = {}
        data.url = '/companys/perfectInfo'
        vm.sendChild(data)
      } else {
        this.$message({
          type: 'warning',
          message: '没有权限'
        })
        return
      }
    },
    saleCheckedMethod (val) {
      this.saleCheckedHome = val
    },
    closeTab (val) {
      for (var i = 0; i < this.tabMenu.length; i++) {
        if (this.tabMenu[i].title === val) {
          this.handleTabsEdit(i.toString())
        }
      }
    },
    /**
     * 平台对参数设置初始化
     */
    configInit({disable}){
      
    },
    refresh: function (menu) {
      var vm = this;
      let view = BaseConstant.MENU.find(item => item.title === menu.name);
      view = menu.action ? menu.view:view ? view['view']:null;
      if(view){
        this.customMenu(menu,view);
      }else{
        if(!menu.url){
          this.$alert(`${menu.name}模块在开发中...请稍后再尝试`,{
            showClose: false,
          });
          return;
        }
        this.$root.ajaxData(menu.url, { 'path': menu.path }, function (data) {
          if(data.disable){
             vm.$message({
              showClose: true,
              message: `已经启用库存简化流程,不能使用${data.title}`
            });
            return
          }
          vm.mate = data.mate
          vm.mate.title = data.title;
          vm.mate.modules = data.view;
          vm.mate.mutations = data.view.toUpperCase();
            // 用于分辨localStorage
          vm.mate.localName = data.name
          vm.titleName = data.title
          vm.view = data.view || data.currentView
  
          vm.caption = data.name
          vm.tabIndex = vm.tabMenu.length - 1
          vm.closable = true
          vm.handleTabsIdx(data, menu);
        }, menu.method)
      }
    },
    /**
     * 
     */
    customMenu (menu,view) {
      let vm = this;
      let curView = menu.pView ? menu.pView:view;
      const mate = this.$store.state[curView];
      let data = {};
      data.mate = {};
      this.mate = {};
      this.mate.mate = {};
      if (!menu.pView){
        data.mate = {...mate.mate};
        data['title'] = mate.title;
        data['view'] = mate.view;
        data['name'] = mate.name;
        data.mate['view'] = mate.view;
        data.mate['url'] = menu.url || mate.url;
        data.mate['modules'] = mate.view;
        data.mate['mutations'] = mate.view.toUpperCase();
        data.mate['title'] = mate.title;
        data.mate['localName'] = mate.name || BaseConstant.MENU.find(item => item.title === menu.name)['name'];
        this.mate = {...data.mate};
        this.titleName = mate.title;
        this.view = mate.view || mate.currentView;
        this.tabIndex = this.tabMenu.length - 1;
        this.handleTabsIdx(data, menu);
        // 请求页面数据
        // this.$store.dispatch(`${mate.view}/initList`);
      }else{
        data['title'] = menu.title;
        data['view'] = menu.view;
        data.mate['view'] = menu.view;
        data.mate['title'] = mate.title;
        data.mate['localName'] = mate.name || BaseConstant.MENU.find(item => item.title === menu.name)['name'];
        data.mate['mateFormerHeader'] = mate.mate.mateFormerHeader;
        data.mate['mateFormerLine'] = mate.mate.mateFormerLine;
        data.mate['mateListLine'] = mate.mate.mateListLine;
        data.mate['mateSearch'] = mate.mate.mateSearch;
        this.mate = {...data.mate};
        this.handleTabsIdx(data, menu);
      }
    },
    /**
     * 
     */
    handleTabsIdx (data, menu){
      if (this.tabMap.has(data.title)) {
        var newParam = this.tabMap.get(data.title)
        this.activeName = newParam.name
        var params = {
          title: data.title,
          name: newParam.name,
          localName: data.name,
          content: 'New Tab content',
          closable: this.closable,
          mate: data.mate,
          view: data.view || data.currentView,
          url: menu.url
        }
        this.tabMap.set(data.title, params)
        for (var i = 0; i < this.tabMenu.length; i++) {
          if (this.tabMenu[i].title === data.title) {
            this.tabMenu[i] = params
          }
        }
        this.tabMenu[0].closable = false
      } else {
        const newTabName = ++this.tabIndex + ''
        let params = {
          title: data.title,
          name: newTabName,
          localName: data.name,
          content: 'New Tab content',
          closable: this.closable,
          mate: data.mate,
          view: data.view || data.currentView,
          url: menu.url
        }
        this.tabMap.set(data.title, params)
        this.tabMenu.push({
          title: data.title,
          name: newTabName,
          localName: data.name,
          content: 'New Tab content',
          closable: this.closable,
          mate: data.mate,
          view: data.view || data.currentView,
          url: menu.url
        })
        // this.tabMenu.push(params)
        this.tabMenu[0].closable = false
        this.activeName = newTabName
      }
    },
    showQq () {
      this.showDetial = true
    },
    // 折叠导航栏
    collapse: function () {
      this.collapsed = !this.collapsed
    },
    showMenu (i, status) {
      this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none'
    },
    eport () {
      // this.$root.ajaxData('/users/import/tpl')
    },
    /**
     * 交款记录
     * @param 
     * @author fengjing
     */
    goRecordCashier(){
      let url = '/common/toList?listName=record_cashier_list'
      this.$root.monitor({ url: `${url}` });
    },
    // 获取云平台系统公告信息
    scrollReport () {
      var vm = this
      vm.$root.ajaxData(`/purchase/th/goods/notice`, {}, function (data) {
        vm.scrollData = data.content
      }, 'GET')
    },
    // 退出登录
    logout: function () {
      var _this = this
      this.$confirm(this.$t('toast.logout-confirm'), this.$t('toast.prompt'), {
        // type: 'warning'
      }).then(() => {
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('user')
        window.localStorage.setItem('unlogin', 'unlogin')
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('user')
        localStorage.removeItem('settlement') // 缓存中的结算单都要清空
        // 单点退出
        window.location.href = `${API_GATEWAY}/uaa/oauth/exit`
      }).catch(() => {
      })
    },
    refreshSysMenu () {
      const vm = this
      this.$root.ajaxData(window.bench, {}, function (data) {
        vm.menus = data.menus
        if (data.menus.length === 0) {
          vm.$message({
            message: '请管理员分配角色和权限',
            type: 'warning',
            duration: 5000
          })
          return
        }
      })
    },
    openOnline () {
      if (this.dialogOnlineMessage) {
        this.dialogOnlineMessage = false
      } else {
        this.dialogOnlineMessage = true
      }
    },
    closeProblem () {
      this.dialogOnlineMessage = false
    },
    /**
     * 交易记录弹出框关闭
     */
    handleConfirm(){
      let url = '/purchase/pay/notice/confirm/1'
      let _this = this
      this.$root.ajaxData(url, {}, function (res) {
        if(res.statusCode === 200) {
          _this.recordDialogVisible = false
          _this.iframeUrl = ''
          _this.$message({
            message: '已确认收款协议',
            type: 'success',
            duration: 5000
          })
        }
      })
    },
    /**
     * 不同意收款协议
     */
    handleCancle(datial){
      let url = '/purchase/pay/notice/cancel/2'
      let _this = this
      this.$root.ajaxData(url,datial, function (res) {
        if(res.statusCode === 200) {
          _this.recordDialogVisible = false
          _this.iframeUrl = ''
        }
      },'POST')
    }
  },
  mounted () {
    document.title = this.$t('system-title')
    var user = sessionStorage.getItem('user')
    if (user) {
      user = JSON.parse(user)
      // this.sysUserName = user.username
      if (user.firstname == null || user.lastname == null) {
        // 租户刚注册时没有firstname和lastname 用userName代替
        this.sysUserName = user.username
      } else {
        this.sysUserName = user.firstname + user.lastname
      }
      this.sysUserAvatar = user.avatar || require('../assets/images/user.png')
    }
    const vm = this
    this.$bus.on('refreshview', function (data) {
      vm.titleName = data.title
      vm.mate = data.mate
      vm.view = data.view
    })
  },
  beforeDestroy () {
    this.$bus.off('refreshview', {})
  }
}
</script>

<style scoped lang="scss">
// @import '~scss_vars';
.home{
  .el-tabs--border-card>.el-tabs__content {
    padding: 0;
  }
.container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
    .header {
      height: 60px;
      line-height: 60px;
      // background: $color-primary;
      background: #6e86e3;
      color:#fff;
      .userinfo {
        text-align: right;
        padding-right: 35px;
        float: right;
        .userinfo-inner {
          cursor: pointer;
          color:#fff;
          margin-right: 20px;
          img {
            width: 40px;
            height: 40px;
            border-radius: 20px;
            margin: 10px 10px 10px -10px;
            float: right;
          }
        }
      }
      .lang {
        margin-right: 30px;
      }
      .logo {
        height:60px;
        font-size: 16px;
        padding-left:20px;
        padding-right:20px;
        border-color: rgba(238,241,146,0.3);
        border-right-width: 1px;
        border-right-style: solid;
        img {
          width: 40px;
          float: left;
          margin: 10px 10px 10px -10px;
        }
        .txt {
          color:#fff;
        }
      }
      .logo-width{
        width:180px;
      }
      .logo-collapse-width{
        width:60px
      }
      .tools{
        padding: 0px 23px;
        width:14px;
        height: 60px;
        line-height: 60px;
        cursor: pointer;
      }
    }
    .main {
      display: flex;
      position: absolute;
      top: 60px;
      bottom: 0px;
      // overflow: hidden;
      aside {
        flex:0 0 230px;
        width: 230px;
        .collapsed{
          width:60px;
          .item{
            position: relative;
          }
          .submenu{
            position:absolute;
            top:0px;
            left:60px;
            z-index:99999;
            height:auto;
            display:none;
          }

        }
      }
      .menu-collapsed{
        flex:0 0 60px;
        width: 60px;
        color: #fff;
        background: #35384d;
        .el-menu{
          background-color: #35384d;
        }
      }
      .menu-expanded{
        overflow-y:scroll;
        overflow-x:scroll;
        // overflow: y;
        // overflow: x;
        flex:0 0 180px;
        width: 180px;
        background:#35384d;
        .el-menu{
          width: 180px !important;
          background-color: #35384d;
        }
      }
      .menu-expanded::-webkit-scrollbar{
        width: 0px;
      }
      .content-container {
        background-color: #f1f3f8;
        flex:1;
        overflow-y:scroll;
        overflow-x:scroll;
        padding: 20px 20px 0 20px;
        position: relative;
        .component-wrapper{
          height: calc(100% - 41px);
          overflow-y: auto;
        }
        .content-wrapper {
          box-sizing: border-box;
          background: #fff;
          padding: 20px;
          box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
        }
      }
    }
  }
  .closeAll {
    float:right;
    position:relative;
    margin-bottom:10px;
    z-index:1000;
    margin-top:12px;
  }
  .el-submenu .el-menu-item{
    min-width: 150px;
    font-size: 12px;
    margin-left: 20px;
    color: #fff;
  }
  .el-menu-item.is-active{
    background-color: #2A2D3E;
    color:rgb(255,208,75);
  }
  .avatarImg{
    width: 100%;
    height: 100%;
  }
  .iconfont{
    margin-right:10px;
  }
  .model-title{
    font-size: 18px;
    margin-bottom: 20px;
  }
  #nprogress .bar {
    // background: $bar-color-primary;
    background: #18c79c;
  }
  .icon-dianweilogo{
    font-size:40px;
  }
  .lang {
    cursor: pointer;
    color: #fff;
  }
  .eldropdown {
    margin-right: 5px;
  }
  //  ::-webkit-scrollbar {
  //   width: 0px;
  // }
  .iconfont[data-v-5e265133] {
    margin-right: 0px;
  }
  .el-menu-item:focus,.el-menu-item:hover{
    background-color: #2A2D3E;
  }
  .el-submenu__title:focus, .el-submenu__title:hover{
    background-color: #2A2D3E;
  }
  .noteMsg {
    margin-right: 50px;
    span {
      position: relative;
      span {
        position: absolute;
        bottom: 8px;
        left: 8px;
        min-width: 18px;
        min-height: 15px;
        background: #f15f71;
        line-height: 15px;
        text-align: center;
        font-size: 10px;
        box-sizing: border-box;
        padding: 2px;
        border-radius: 8px;
        color: #fff;
      }
    }
  }
  .msgItem {
    position: relative;
    padding-right: 80px;
    padding-left: 20px;
    box-sizing: border-box;
    .msgCount {
      position: absolute;
      top: 8px;
      right: 15px;
      min-width: 20px;
      height: 20px;
      line-height: 16px;
      box-sizing: border-box;
      padding: 2px;
      text-align: center;
      border-radius: 8px;
      color: #fff;
      background: #f15f71;
    }
  }
  .fa{
    font-size: 19px;
    margin-left: 3px;
    // margin-right:13px
  }
  el-dropdown-item{
    padding-right: 30px;
  }
  .sccp{
    font-size: 35px;
    margin-left: -8px;
  }
  .operation{
    margin-right: 30px;
    font-size: 14px;
    cursor:pointer;
  }
  .userChange{
    display: inline-block;
    font-size: 14px;
  }
  .companyName {
    display: inline-block;
    margin-right: 30px;
  }
  .bg-purple-light {
    background: #fff;
    padding: 15px;
  }
  .white {
    color: #ffffff;
    padding-right: 10px;
    width: 28px;
    height: 28px;
  }
  .sub_size {
    font-size: 10px;
  }
  .wrapper {
    position: fixed;
    left: 20%;
    height: 40px;
    width: 40%;
    font-size: 14px;
  }
  .el-notification {
    background-color:#ff9800;
  }
  .personInput{
    background-color:#f5f7fa;
    border-radius:5px;
    height: 20px;
    width: 250px;
  }
  .passwordInput{
    background-color:#f5f7fa;
    border-radius:5px;
    height: 20px;
  }
  .clearfix{
    width: 100%
  }
  .wmargin{
    width:90px;
    z-index: 100;
    position: fixed;
    right: 1%;
    bottom:25px;
    .wmarginHeader{
      width:60%;
      border-radius:5px;
      background-color:#6e86e3;
      margin-top:5px;
        .imgWmargin{
          margin: 10px auto;
          margin-left: 10px;
          width: 60%;
          height: 60%;
        }
      }
    }
    .wmarginButton{
      width:90px;
      z-index: 1000;
      position: fixed;
      right: 1%;
      bottom:25px;
    }
    .absButton {
      width:90px;
      z-index: 1000;
      position: fixed;
      right: 1%;
      bottom:60px;
    }
}
</style>
<style lang="scss">
.home{
  /deep/ .el-tabs--border-card>.el-tabs__content {
    padding: 0;
  }
  .homeCard{
    position:relative;
    margin:0 auto 50px;
    background:#fff;
    border-radius:2px;
    box-sizing:border-box;
    width:400px;
    margin-top: 100px;
    z-index: 100000;
     .el-card__header{
      background-color: #6e86e3!important;
    }
  }
  .homePersonCard{
    position:relative;
    margin:0 auto 50px;
    background:#fff;
    border-radius:2px;
    box-sizing:border-box;
    width:450px;
    margin-top: 100px;
    z-index: 100000;
     .el-card__header{
      background-color: #6e86e3!important;
    }
    .buttonPerson{
      margin-left:50px;
    }
  }
  .homePassDialog{
    .el-dialog__header{
      padding:inherit
    }
    .el-dialog__body{
      padding:inherit;
    }
  }
  .homeDialog{
    .el-dialog__header{
      padding:inherit
    }
    .el-dialog__body{
      padding:inherit;
    }
    .el-dialog{
      z-index: 100;
      position: fixed;
      right: 120px;
      bottom:10px;
    }
  }
    .homeOnlineCard{
      width:100%;
      height: 100%;
      .el-card__header{
        background-color: #6e86e3!important;
      }
    }
    .popoverOnline{
      font-weight:700;
      font-size:24px;
      .el-popover__title{
        font-weight:800;
        font-size:16px;
      }
    }
    .popoverQQ{
      font-weight:800;
      font-size:14px;
      text-align: inherit;
      .el-popover__title{
        font-weight:800;
        font-size:16px;
      }
      .imgOnline{
          top:5px;
          position:relative;
      }
    }
}
</style>
