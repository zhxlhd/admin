<template>
  <div>
    <el-row>
      <el-form size="mini" :model="mateValues"  :label-position="labelPosition" ref="ruleForm" :rules="rules" :label-width="labelWidth">
        <template>
          <!-- PO编号 -->
          <el-row>
            <el-col :sm="12" :md="8" :lg="8">
              <el-form-item :label="object['goodsName'].label" :prop="object['goodsName'].name">
                <el-input :disabled="editDisabled" v-model="mateValues['goodsName']" placeholder="PO编号可自动生成或手动输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 机构 -->
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['officeId'].label" :prop="object['officeId'].name">
              <el-select :disabled="state" filterable @change="changeOffice" v-model="mateValues['officeId']">
                <el-option :label="item.label" :value="item.value" v-for="(item, index) of officeIdOptions" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!--供应商-->
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['companyId'].label" :prop="object['companyId'].name">
              <el-select :disabled="state" @change="changeCompany" filterable v-model="mateValues['companyId']">
                <el-option :label="item.label" :value="item.value" v-for="(item, index) of companyIdOptions" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!--地点-->
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['address'].label" :prop="object['address'].name">
              <el-select :disabled="state" @change="changeAddress" filterable v-model="mateValues['address']">
                <el-option :label="item.label" :value="item.value" v-for="(item, index) of addressOptions" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 币种 -->
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['currency'].label" :prop="object['currency'].name" >
              <dict-selected :clearable="false" :rowId="rowId" v-model="mateValues['currency']" dictType="currencyType" :initValue="mateValues['currency']"></dict-selected>
            </el-form-item>
          </el-col>
          <!-- 付款条件 -->
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item  :label="object['paymentCondition'].label" :prop="object['paymentCondition'].name">
              <dict-selected :rowId="rowId" v-model="mateValues['paymentCondition']" :initValue="mateValues['paymentCondition']" dictType="paymentMethod"></dict-selected>
            </el-form-item>
          </el-col>
          <!--库存组织-->
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['orgId'].label" :prop="object['orgId'].name">
              <el-select :disabled="state" @change="changeOrgId" filterable v-model="mateValues['orgId']">
                <el-option :label="item.label" :value="item.value" v-for="(item, index) of orgIdOptions" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 采购员 -->
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['buyerName'].label" :prop="object['buyerName'].name">
              <el-select :disabled="state" filterable v-model="mateValues['buyerName']" @change="handleBuyer">
                <el-option :label="item.label" :value="item.value" v-for="(item, index) of buyerNameOptions" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!--税率-->
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['tax'].label" :prop="object['tax'].name" >
              <dict-selected :rowId="rowId" v-model="mateValues['tax']" dictType="tax" :initValue="mateValues['tax']"></dict-selected>
            </el-form-item>
          </el-col>
          <!-- 联系人 -->
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['contact'].label" :prop="object['contact'].name">
              <!-- <el-select :disabled="state" clearable filterable  v-model="mateValues['contact']">
                <el-option :label="item.label" :value="item.value" v-for="(item, index) of contactOptions" :key="item.value"></el-option>
              </el-select> -->
              <el-input :disabled="state" clearable v-model="mateValues['contact']"></el-input>
            </el-form-item>
          </el-col>
          <!-- 说明 -->
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['explain'].label" :prop="object['explain'].name">
              <el-input :disabled="state" clearable v-model="mateValues['explain']"></el-input>
            </el-form-item>
          </el-col>
          <!-- 合计 -->
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['total'].label" :prop="object['total'].name">
              <el-input disabled v-model="mateValues['total']"></el-input>
            </el-form-item>
          </el-col>
          <!-- 创建日期 -->
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['createAt'].label" :prop="object['createAt'].name">
              <el-date-picker
                v-model="mateValues['createAt']" 
                type="datetime" 
                value-format="yyyy-MM-dd HH:mm:ss" 
                placeholder="请选择" ></el-date-picker>
            </el-form-item>
          </el-col>
          <!-- 销售订单编号 -->
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['soNum'].label" :prop="object['soNum'].name">
              <el-input clearable v-model="mateValues['soNum']"></el-input>
            </el-form-item>
          </el-col>
          <!-- 备件比例 -->
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['sparePartsRatio'].label" :prop="object['sparePartsRatio'].name">
              <el-input clearable v-model="mateValues['sparePartsRatio']">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
        </template>
      </el-form>
    </el-row>
  </div>
</template>

<script>
  import treeSelect from '../../components/tree-select/tree.vue'
  import { dateFormatZero } from "../../utils/util.js";
  import { dateFormatter } from "../../utils/DateUtils.js";

  export default {
    components: {
      'dict-selected': function index (resolve) {
        require(['../../components/DictSelected.vue'], resolve)
      },
      treeSelect
    },
    data () {
      return {
        editDisabled: false,  // 修改状态是否禁用组件
        object: {},                 // 用来代替从父组件总获取到的数据 mate.filed
        companyData: [],
        addressData: [],
        officeIdOptions: [],
        companyIdOptions: [],
        addressOptions: [],
        orgIdOptions: [],
        buyerNameOptions: [],
        contactOptions: [],
        priceData: [],
        labelPosition: 'right',
        mateValues: {},
        state: false,           // 如果状态是变更中,则头不能修改
        rowId: '',
        rules: {
          officeId: [
            { required: true, message: '该输入项为必输项', trigger: 'change' }
          ],
          companyId: [
            { required: true, message: '该输入项为必输项', trigger: 'change' }
          ],
          address: [
            { required: true, message: '该输入项为必输项', trigger: 'change' }
          ],
          // paymentCondition: [
          //   { required: true, message: '该输入项为必输项', trigger: 'change' }
          // ],
          buyerName: [
            { required: true, message: '该输入项为必输项', trigger: 'change' }
          ],
          orgId: [
            { required: true, message: '该输入项为必输项', trigger: 'change' }
          ],
          currency: [
            { required: true, message: '该输入项为必输项', trigger: 'change' }
          ],
          tax: [
            { required: true, message: '该输入项为必输项', trigger: 'change' }
          ]
        }
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
      },
      /**
       * 日期初始化 默认当前日期
       * @param void
       * @return {String} defaultDate 创建日期
       */
      dateInit() {
        // 表单数据
        let values = this.mate.values || {};
        // 申请日期
        let date = values.createAt || "";
        // 当前日期
        let curDate = new Date();
        // 当前日期格式化
        // let defaultDate = `${curDate.getFullYear()}-${dateFormatZero(curDate.getMonth() + 1)}-${dateFormatZero(curDate.getDate())}`;
        let defaultDate = dateFormatter("YYYY-MM-DD HH:mm:ss")
        // 如果有创建日期默认日期为创建日期,否则为当前日期
        defaultDate = date || defaultDate;
        // 返回日期
        return defaultDate;
      }
    },
    created () {
      this.mate.fields.map((i) => { this.object[i.name] = i })
      if (this.mate.values.state === '5') {
        this.state = true
        this.rowId = '5'
      }
      this.mateValues = this.mate.values;
      // 修改状态下禁用PO编号控件 禁止修改
      if (this.mate.values.id){
        this.editDisabled = (this.mateValues.goodsName && true);
      }
      // this.getContact() 
      // 获取机构列表
      this.getOfficeId();
      // 获取供应商列表
      this.getCompanyId();
      // 获取库存组织
      this.mateValues.officeId && this.getOrgId(this.mateValues.officeId);
      // 获取采购员
      this.getAuditor();
      // if (this.mateValues['officeId']) {
      //   this.changeOffice(this.mateValues['officeId'])
      // }
    },
    mounted() {
      // 设置创建日期默认值
      this.mate.values.createAt = this.dateInit;
    },
    methods: {
      // 审核人、采购人都是一样的
      getAuditor () {
        const vm = this;
        this.object['auditorName'].options = [];
        this.buyerNameOptions = [];
        this.contactOptions = [];
        this.$root.ajaxData('/users/getUserDropdownList', {}, function (data) {
          data.forEach(i => {
            if ((
              (i.firstname == "" || i.firstname == null || i.firstname == undefined) && 
              (i.lastname == "" || i.lastname == null || i.lastname == undefined) && 
              (i.username == "" || i.username == null || i.username == undefined) ) || 
            (i.id == "")) { return; }
            vm.object['auditorName'].options.push({ 'label': (`${i.firstname}${i.lastname}` || i.username), 'value': i.id, 'id': i.id })
            vm.buyerNameOptions.push({ 
              'label': (`${i.firstname}${i.lastname}` || i.username), 
              'value': i.id,
              'id': i.id
            })
          })
          vm.contactOptions = [...vm.buyerNameOptions];
        }, 'GET')
      },
      /**
       * 获取库存组织
       * @param {String} id 机构 id
       * @return void
       */
      getOrgId(id) {
        let _this = this;
        this.$root.ajaxData(`/org/inventory/all?officeId=${id}&dataOnly=true`, {}, (data) => {
          _this.orgIdOptions = [];
          if (data.length) {
            // 在改变了之后要清空
            data.forEach(i => {
              _this.orgIdOptions.push({ 'label': i.name, 'value': i.id, 'id': i.id });
            })
            _this.$emit('setOrgOptions', _this.orgIdOptions);
          }
        })
      },
      // 头的库存组织改变时，明细行中的库存组织也要显示
      changeOrgId (val) {
        this.$emit('getOrgId', val)
      },
      // 机构改变时 获取对应的库存组织
      changeOffice (val) {
        this.mateValues['orgId'] = '';
        this.getOrgId(val);
        // 将数据传给父组件、父组件中的明细行中有库存组织
        // this.$emit('getOffice', val)
      },
      // 获取到机构
      getOfficeId () {
        const vm = this
        vm.officeIdOptions = []
        this.$root.ajaxData('/users/office', {}, function (data) {
          data.forEach(i => {
            vm.officeIdOptions.push({ 'label': i.orgName, 'value': i.officeId, 'id': i.officeId })
          })
          // 默认选择第一个机构
          if(!vm.mateValues.id && vm.officeIdOptions.length > 0) {
            vm.mateValues.officeId = vm.officeIdOptions[0].value;
            vm.getOrgId(vm.mateValues.officeId);
            // vm.changeOffice(vm.officeIdOptions[0].value)
          }
        }, 'GET')
      },
      // 原为获取联系人 此方法已废除
      getContact () {
        var vm = this
        this.contactOptions = []
        this.$root.ajaxData('/users/getUserDropdownList', {}, function (data) {
          data.forEach((i) => {
            vm.contactOptions.push({ 'label': (i.firstname+i.lastname), 'value': i.id })
          })
        }, 'GET')
      },
      // 获取供应商列表
      getCompanyId () {
        var vm = this
        this.$root.ajaxData('/companys/companyInfo/3?auditStatus=1&nopaging=1&status=1&dataOnly=true', {}, function (data) {
          vm.companyIdOptions = [];
          data.forEach((i) => {
            vm.companyData = data
            vm.companyIdOptions.push({ 'label': i.name, 'value': i.id, 'id': i.id })
          })
          if(data.length){ //此处原为设置默认值，影响到订单修改修改
            // vm.mateValues.companyId = data[0].id
            // vm.changeCompany(data[0].id)
          }
        }, 'GET')
      },
      // 切换供应商 地址和税率相关信息也跟着切换
      changeCompany (val) {
        this.mateValues.address = '';
        this.mateValues.currency = '';
        this.mateValues.paymentCondition = '';
        this.mateValues.tax = '';
        let _this = this;
        let companyData = this.companyData;
        if(!companyData.length) return;
        let curCompany = companyData.find(item => item.id === val);
        if(curCompany && !curCompany.addressList.length){
          this.$message({
            message: '请维护供应商信息',
            type: 'warning'
          })
        }else{
          this.addressOptions = [];
          curCompany && curCompany.addressList.forEach(item =>{
            _this.addressOptions.push({ 
              'label': item.name, 
              'value': item.name, 
              'id': item.id,
              'currency': item.currency,
              'payment': item.payment
            })
          })
          this.addressData = [...this.addressOptions];
          this.priceData = curCompany ? curCompany.financeList : [];
        }
        // for (let i = 0; i < this.companyData.length; i++) {
        //   if (val === this.companyData[i].id) {
        //     if (this.companyData[i].addressList.length === 0) {
        //       _this.$message({
        //         message: '请维护供应商信息',
        //         type: 'warning'
        //       })
        //     } else {
        //       this.addressData = this.companyData[i].addressList
        //       this.priceData = this.companyData[i].financeList
        //       for (let j = 0; j < this.companyData[i].addressList.length; j++) {
        //         _this.addressOptions.push({ 
        //           'label': this.companyData[i].addressList[j].name, 
        //           'value': this.companyData[i].addressList[j].name, 
        //           'id': this.companyData[i].addressList[j].id
        //         })
        //       }
        //       if(this.companyData[i].addressList.length>0){
        //         _this.mateValues.address=this.companyData[i].addressList[0].name
        //         _this.changeAddress(this.companyData[i].addressList[0].name)
        //       }
        //     }
        //   } else {
        //     this.mateValues.address = ''
        //   }
        // }
      },
      // 
      /**
       * 切换地址
       * 自动填充/清空 币种、付款条件、税率
       * @param {String} val 地址的 value
       * @return void
       */
      changeAddress (val) {
        let addressObj = this.addressData.find(item => item.value === val);
        let addressId = addressObj && addressObj.id;
        let taxObj = this.priceData.find(item => item.id === addressId);

        this.mateValues['currency'] = addressObj && addressObj.currency;
        this.mateValues['paymentCondition'] = addressObj && addressObj.payment;
        this.mateValues['tax'] = taxObj && taxObj.taxRate;

        // for (let i = 0; i < this.addressData.length; i++) {
        //   if (val === this.addressData[i].value) {
        //     this.addressId = this.addressData[i].id
        //     // 选择了地点之后，需要将地点中的币种和付款条件放进去
        //     this.$set(this.mateValues, 'currency', this.addressData[i].currency)
        //     this.$set(this.mateValues, 'paymentCondition', this.addressData[i].payment)
        //   }
        // }
        // for (let i = 0; i < this.priceData.length; i++) {
        //   if (this.addressId === this.priceData[i].id) {
        //     this.$set(this.mateValues, 'tax', this.priceData[i].taxRate)
        //   }
        // }
      },
      /** 切换采购人
       * @param {String} val 当前值
       * @return void
       */
      handleBuyer(val){
        let buyerName = this.buyerNameOptions.find(item => item.value === val).label;
        this.mateValues['buyer'] = val;
        this.mateValues['buyerName'] = buyerName;
      },

    }
  }
</script>

<style scoped>
  .el-form-item {
    margin: 15px 20px 2px 0px;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
  }
  .el-select {
    width: 100%;
  }
</style>
