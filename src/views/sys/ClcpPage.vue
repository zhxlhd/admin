<template>
    <div class="clcp_info">
        <el-collapse v-model="activeNames">
            <el-collapse-item name="1">
                <template slot="title" class="collapse_title">
                    <span style="color: red">* </span><span style="font-size: 14px">金票系统登录用户指定</span>
                </template>
                <div class="ope_btns">
                    <el-button type="info" size="small" @click="closeCollapseItem(1)">取 消</el-button>
                    <el-button type="primary" size="small" @click="updateClcpLoginUser">保存</el-button>
                </div>
                <span class="clcp_login_select">
                    <el-transfer
                            filterable
                            :titles="['用户列表', '经办人列表']"
                            :filter-method="filterMethod"
                            filter-placeholder="请输入用户名"
                            v-model="agentSelect"
                            :data="userList"
                            style="font-size: 8px;height: 280px">
                </el-transfer>
                </span>
                <span class="clcp_login_select">
                    <el-transfer
                            filterable
                            :titles="['用户列表', '审核人列表']"
                            :filter-method="filterMethod"
                            filter-placeholder="请输入用户名"
                            v-model="auditSelect"
                            :data="userList"
                            style="font-size: 8px;height: 280px">
                </el-transfer>
                </span>
            </el-collapse-item>
            <el-collapse-item name="2">
                <template slot="title" class="collapse_title">
                    <span style="color: red">* </span><span style="font-size: 14px">金票系统银行卡信息</span>
                </template>
                <el-form ref="clcpBankInfo" :model="clcpBankInfo" :rules="clcpBankInfoRules"  label-width="150px" size="mini" class="clcpBankInfoClass">
                    <el-form-item label="银行账户"  prop="accountName"><el-input v-model="clcpBankInfo.accountName" ></el-input></el-form-item>
                    <el-form-item label="开户行"  prop="openbank"><el-input v-model="clcpBankInfo.openbank"  ></el-input></el-form-item>
                    <el-form-item label="银行账号"  prop="account"><el-input v-model="clcpBankInfo.account"  ></el-input></el-form-item>
                    <el-form-item label="联行号"  prop="unitedbankCode"><el-input v-model="clcpBankInfo.unitedbankCode"  ></el-input></el-form-item>
                    <el-form-item>
                        <el-button type="info" @click="closeCollapseItem(2)">取 消</el-button>
                        <el-button type="primary" @click="saveClcpBankInfo()">保存</el-button>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
            <el-collapse-item name="3">
                <template slot="title" class="collapse_title">
                    <span style="color: red">* </span><span style="font-size: 14px">保理系统签章所需信息</span>
                </template>
                <el-form ref="clcpInfoForm" :model="clcpInfoForm" :rules="clcpInfoRules" size="mini" label-width="120px" class="clcpInfoFormClass">
                    <el-col :span="12" >
                        <el-form-item label="法人"  prop="legalPerson">
                            <el-input v-model="clcpInfoForm.legalPerson"  :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="注册资金"  prop="registeredCapital">
                            <el-input v-model="clcpInfoForm.registeredCapital"  :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="组织机构代码"  prop="codeCredit">
                            <el-input v-model="clcpInfoForm.codeCredit"  :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="联系人"  prop="contact">
                            <el-input v-model="clcpInfoForm.contact"  :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系人地址" prop="contactAddress">
                            <el-input v-model="clcpInfoForm.contactAddress" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="联系人邮箱" prop="contactEmail">
                            <el-input v-model="clcpInfoForm.contactEmail" :disabled="false"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系人电话" prop="contactPhone">
                            <el-input v-model="clcpInfoForm.contactPhone"></el-input>
                        </el-form-item>
                        <el-form-item label="联系人身份证" prop="contactCardId">
                            <el-input v-model="clcpInfoForm.contactCardId" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="经办人" prop="agent">
                            <el-input v-model="clcpInfoForm.agent"  :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="经办人身份证" prop="agentCardId">
                            <el-input v-model="clcpInfoForm.agentCardId"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="经办人邮箱" prop="agentEmail">
                            <el-input v-model="clcpInfoForm.agentEmail"></el-input>
                        </el-form-item>
                        <el-form-item label="经办人电话" prop="agentPhone">
                            <el-input v-model="clcpInfoForm.agentPhone"></el-input>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12">
                        <el-form-item label="审核人" prop="auditor">
                            <el-input v-model="clcpInfoForm.auditor"></el-input>
                        </el-form-item>
                        <el-form-item label="审核人身份证" prop="auditorCardId">
                            <el-input v-model="clcpInfoForm.auditorCardId"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="审核人邮箱" prop="auditorEmail">
                            <el-input v-model="clcpInfoForm.auditorEmail"></el-input>
                        </el-form-item>
                        <el-form-item label="审核人电话" prop="auditorPhone">
                            <el-input v-model="clcpInfoForm.auditorPhone"></el-input>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="12">
                        <el-form-item label="保理业务经理" prop="masterCMName">
                            <el-select v-model="clcpInfoForm.masterCMName" placeholder="请选择" @change="ywjlChange">
                                <el-option
                                        v-for="item in ywjlList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item>
                            <el-button type="info" @click="closeCollapseItem(3)">取 消</el-button>
                            <el-button type="primary" @click="saveClcpInfo()">保存</el-button>
                        </el-form-item>
                    </el-col>
                </el-form>

            </el-collapse-item>
        </el-collapse>
        <div class="clcp_footer">
            <div class="footer_tips">如果您是第一访问，请务必完善好上述信息再链接到金票平台，否则相关业务将无法执行，如果您修改了上述信息，请保存您的修改！</div>
            <div><el-button type="text" @click="go_clcp()" style="font-size: 14px">点击跳转到金票平台</el-button></div>
        </div>
    </div>
</template>

<script>
    import { CLCP_URL,API_GATEWAY,DJ_URL} from '@/config/index.js'
    export default {
        props: {
            mate: Object
        },
        data() {
            return {
                activeNames:[],
                userList: [],
                agentSelect: [],
                auditSelect: [],
                clcpBankInfo:{
                    accountName:'',
                    openbank:'',
                    account:'',
                    unitedbankCode:"",
                },
                clcpBankInfoRules: {
                    openbank:
                        {required: true, message: '该输入项为必输项'},
                    account:
                        {required: true, message: '该输入项为必输项'},
                    accountName:
                        {required: true, message: '该输入项为必输项'},
                    unitedbankCode:
                        {required: true, message: '该输入项为必输项'},
                },
                clcpInfoForm:{
                    legalPerson:'',
                    registeredCapital:'',
                    codeCredit:'',
                    contact:'',
                    contactPhone:'',
                    contactCardId:'',
                    contactEmail:'',
                    contactAddress:'',
                    agent:'',
                    agentLoginName:'',
                    agentCardId:'',
                    agentPhone:'',
                    agentEmail:'',
                    auditor:'',
                    auditorCardId:'',
                    auditorPhone:'',
                    auditorEmail:'',
                    masterCM:'',
                    masterCMName:'',
                },
                clcpInfoRules:{
                    contact:
                        { required: true, message: '该输入项为必输项' },
                    compName:
                        { required: true, message: '该输入项为必输项' },
                    codeCredit:
                        { required: true, message: '该输入项为必输项' },
                    registeredCapital:
                        { required: true, message: '该输入项为必输项' },
                    legalPerson:
                        { required: true, message: '该输入项为必输项' },
                    contactCardId:
                        { required: true, message: '该输入项为必输项' },
                    contactPhone:
                        { required: true, message: '该输入项为必输项' },
                    contactAddress:
                        { required: true, message: '该输入项为必输项' },
                    contactEmail:
                        { required: true, message: '该输入项为必输项' },
                    agent:
                        { required: true, message: '该输入项为必输项' },
                    agentCardId:
                        { required: true, message: '该输入项为必输项' },
                    agentPhone:
                        { required: true, message: '该输入项为必输项' },
                    agentEmail:
                        { required: true, message: '该输入项为必输项' },
                    // auditor:
                    //     { required: true, message: '该输入项为必输项' },
                    // auditorCardId:
                    //     { required: true, message: '该输入项为必输项' },
                    // auditorPhone:
                    //     { required: true, message: '该输入项为必输项' },
                    // auditorEmail:
                    //     { required: true, message: '该输入项为必输项' },
                    masterCMName:
                        { required: true, message: '该输入项为必输项' }
                },
                ywjlList:[],
                headers: {
                    'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
                    'Accept': 'application/json',
                    'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId
                },
            };
        },
        methods:{
            //跳转事件
            go_clcp(){
                window.open(CLCP_URL)
            },
            //刷新穿梭框数据
            initSelectList(){
                var vm = this
                var data = this.mate.userList;
                    for (let i = 0; i < data.length; i++) {
                        var name = data[i].firstname+data[i].lastname
                        vm.userList.push({
                            key: data[i].id,
                            label: name,
                        });
                    }
                var agents = this.mate.agentList;
                for (let i = 0; i < agents.length; i++) {
                    vm.agentSelect.push(
                      agents[i].id
                    );
                }
                var audits = this.mate.auditList;
                for (let i = 0; i < audits.length; i++) {
                    vm.auditSelect.push(
                        audits[i].id
                    );
                }
                //第一个经办人信息 作为点金保理 的注册用户名
                if(agents.length>0){
                    vm.clcpInfoForm.agent=agents[0].firstname+agents[0].lastname
                    vm.clcpInfoForm.agentLoginName = agents[0].username
                    vm.clcpInfoForm.agentEmail=agents[0].email
                    vm.clcpInfoForm.agentPhone=agents[0].telephone
                }
            },
            //获取clcpvbank 已存在的数据
            getClcpVbankInfo(){
                var compName=this.mate.tenantCompanyInfo.name;
                var compId=this.mate.tenantCompanyInfo.companyId;
                this.$http({
                    url: API_GATEWAY + '/clcp/clcpvbank/get?compId='+compId+'&compName='+compName,
                    method: 'GET',
                    headers: this.headers,
                    responseType: 'application/json'
                }).then(function (data) {
                    if(data.status==200&&data.data.data.length>0){
                        this.clcpBankInfo=data.data.data[0]
                    }
                })
            },
            filterMethod(query, item) {
                return item.label.indexOf(query) > -1;
            },
            //金票登录用户更新
            updateClcpLoginUser(){
                var vm = this
                var data= {}
                data['agentList'] = this.agentSelect
                data['auditList']=this.auditSelect
                this.$root.ajaxData('/tenants/updateClcpLoginUser', data ,function (data) {
                    vm.closeCollapseItem(1)
                  if (data.statusCode !== 200) {
                        vm.$notify.error({
                            title: '消息',
                            message: data.message
                        })
                        return false
                  }
              },'POST')
            },
            saveClcpBankInfo(){
                var vm = this
                this.$refs['clcpBankInfo'].validate((valid) => {
                   if(valid){
                       this.clcpBankInfo.compName=this.mate.tenantCompanyInfo.name;
                       this.clcpBankInfo.compId=this.mate.tenantCompanyInfo.companyId;
                       this.clcpBankInfo.tenantId=this.mate.tenantCompanyInfo.tenantId;
                       this.$http({
                           url: API_GATEWAY + '/clcp/clcpvbank/insert',
                           method: 'POST',
                           headers: this.headers,
                           body: this.clcpBankInfo,
                           responseType: 'application/json'
                       }).then(function (data) {
                           if(data.status==200){
                               this.closeCollapseItem(2)
                               this.$message({
                                   message: '操作成功！',
                                   type: 'success'
                               })
                           }else{
                               this.$message({
                                   message: '操作失败！',
                                   type: 'error'
                               })
                           }
                       })
                   }
                })
            },
            // 保存 供应商、银行账号、经办人、审核人信息 到保理公司。
            saveClcpInfo(){
            // 先校验 是否已经注册到 点金保理
                if(this.clcpInfoForm.agent==''){
                    this.$message({
                        message: '请先分配经办人信息！',
                        type: 'error'
                    })
                }else{
                    var url = DJ_URL+'/a/sys/register/checkSupplierExists?companyName='
                        +this.mate.tenantCompanyInfo.name+'&username='+this.clcpInfoForm.agentLoginName+'&mobile='+this.clcpInfoForm.agentPhone
                    this.$http({
                        url: url,
                        method: 'GET',
                        responseType: 'application/json'
                    }).then(function (data) {
                        if(data.body.statusCode != 200){
                            this.$message({
                                message: data.body.message,
                                type: 'error'
                            })
                        }else{
                            this.$message({
                                message: '操作成功！',
                                type: 'success'
                            })
                            this.clcpInfoForm.account = this.clcpBankInfo.account
                            this.clcpInfoForm.openbank=this.clcpBankInfo.openbank
                            this.clcpInfoForm.accountName = this.clcpBankInfo.accountName
                            this.$refs['clcpInfoForm'].validate((valid) => {
                                if(valid){
                                    this.$root.ajaxData('/companys/saveClcpInfoToDj', this.clcpInfoForm ,function (data) {
                                        this.closeCollapseItem(3)
                                    },'POST')
                                }
                            })
                        }
                    })
                }

            // 测试环境使用
            // this.clcpInfoForm.account = this.clcpBankInfo.account
            // this.clcpInfoForm.openbank=this.clcpBankInfo.openbank
            // this.clcpInfoForm.accountName = this.clcpBankInfo.accountName
            // this.$refs['clcpInfoForm'].validate((valid) => {
            //     if(valid){
            //         this.$root.ajaxData('/companys/saveClcpInfoToDj', this.clcpInfoForm ,function (data) {
            //             this.closeCollapseItem(3)
            //         },'POST')
            //     }
            // })
            },
            ywjlChange(item){
                this.clcpInfoForm.masterCM=item.id;
                this.clcpInfoForm.masterCMName=item.name;
            },
            closeCollapseItem(val){
                var array = this.activeNames;
                var index = array.indexOf(val)
                array.splice(index,1)
            }
        },
        created(){
            this.initSelectList()
            this.clcpInfoForm.accountName=JSON.parse(window.sessionStorage.getItem('user')).firstname+JSON.parse(window.sessionStorage.getItem('user')).lastname
            this.clcpInfoForm.codeCredit = this.mate.tenantCompanyInfo.codeCredit
            this.clcpInfoForm.compName=this.mate.tenantCompanyInfo.name
            this.clcpInfoForm.compId=this.mate.tenantCompanyInfo.companyId
            this.clcpInfoForm.tenantId=this.mate.tenantCompanyInfo.tenantId
            this.clcpInfoForm.contact=this.mate.tenantCompanyInfo.contacts
            this.clcpInfoForm.contactEmail=this.mate.tenantCompanyInfo.email
            this.clcpInfoForm.contactPhone=this.mate.tenantCompanyInfo.telephone
            this.clcpInfoForm.contactAddress=this.mate.tenantCompanyInfo.address
            this.clcpInfoForm.registeredCapital=this.mate.tenantCompanyInfo.registeredCapital
            this.clcpInfoForm.legalPerson=this.mate.tenantCompanyInfo.corporation

            this.clcpInfoForm.contactEmail=this.mate.signInfo.contactEmail
            this.clcpInfoForm.contactCardId=this.mate.signInfo.contactCardId
            this.clcpInfoForm.agentCardId=this.mate.signInfo.agentCardId
            this.clcpInfoForm.agentEmail=this.mate.signInfo.agentEmail
            this.clcpInfoForm.agentPhone=this.mate.signInfo.agentPhone
            this.clcpInfoForm.masterCM=this.mate.signInfo.masterCM
            this.clcpInfoForm.masterCMName=this.mate.signInfo.masterCMName

            this.ywjlList=this.mate.ywjlList
            //获取clcpvbank 信息
            this.getClcpVbankInfo()
        },
    };
</script>

<style>
    .clcp_info{
        font-family: PingFangSC-Regular;
    }
    .ope_btns{
        height: 40px;
        line-height: 40px;
        margin: 0 0 10px 10px;
    }
    .clcp_login_select{
        float: left;
        margin-right: 100px;
        height: 310px;
    }
    .clcp_footer{
        height: 125px;
        text-align: center;
        font-size: 16px;
    }
    .footer_tips{
        color: red;
        height: 70px;
        line-height: 70px;
    }
    .clcpBankInfoClass{
        max-width: 400px;
        height: 240px;
    }
    .clcpInfoFormClass{
        height: 400px;
        max-width: 1000px;
    }
    .clcp_info .clcpInfoFormClass .el-form-item {
        max-width: 400px;
        margin: 9px 0px ;
    }
</style>
