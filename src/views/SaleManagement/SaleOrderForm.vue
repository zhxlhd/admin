<!-- 销售订单头表单 -->
<template>
  <div>
    <el-row>
      <el-form size="mini" :model="mate.values" :label-position="labelPosition" ref="ruleForm" :rules="rules" :label-width="labelWidth">
        <template>

           <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['soNum'].label" :prop="object['soNum'].name">
              <el-input disabled v-model="mate.values['soNum']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['officeId'].label" :prop="object['officeId'].name">
              <el-select filterable v-model="mate.values[object['officeId'].name]" @change="changeOffice">
                <el-option :label="item.label" :value="item.value" v-for="item of officeIdOption" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['customerId'].label" :prop="object['customerId'].name">
              <el-select :disabled="flagState" @change="customerChange" filterable v-model="mate.values[object['customerId'].name]">
                <el-option :label="item.label" :value="item.value" v-for="item of object['customerId'].options" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

           <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['customerNum'].label" :prop="object['customerNum'].name">
              <el-input :disabled="flagState" readonly v-model="mate.values['customerNum']"></el-input>
            </el-form-item>
          </el-col>
          <!-- 去掉价目表禁用[:disabled="flagState"] 2019-12-24 从客户PO生成销售订单的时候 -->
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['smPriceHeaderId'].label" :prop="object['smPriceHeaderId'].name" :rules="isSelectRequired">
              <el-select clearable v-model="mate.values['smPriceHeaderId']" @change="changeSmPriceHeaderId">
                <el-option :label="item.label" :value="item.value" v-for="item of object['smPriceHeaderId'].options" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['soType'].label" :prop="object['soType'].name">
              <dict-selected :clearable="false" :rowId="rowId" v-model="mate.values[object['soType'].name]" dictType="soType" :initValue="mate.values['soType']"></dict-selected>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['salesmanId'].label" :prop="object['salesmanId'].name">
              <el-select filterable v-model="mate.values[object['salesmanId'].name]">
                <el-option :label="item.label" :value="item.value" v-for="item of salesmanIdOptions" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['customerPo'].label" :prop="object['customerPo'].name">
              <el-input :disabled="showEdit" v-model="mate.values['customerPo']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['orderDate'].label" :prop="object['orderDate'].name">
              <el-date-picker type="date" v-model="mate.values[object['orderDate'].name]"></el-date-picker>
            </el-form-item>
          </el-col>
          <!-- 收货地点 -->
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['customerAddr1'].label" :prop="object['customerAddr1'].name">
              <el-select @change="changeAddr2" v-model="mate.values[object['customerAddr1'].name]">
                <el-option :label="item.label" :value="item.value" v-for="item of customerAddr2Options" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 收单地点 -->
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['customerBillAddr'].label" :prop="object['customerBillAddr'].name">
               <el-select v-model="mate.values[object['customerBillAddr'].name]">
                <el-option :label="item.label" :value="item.value" v-for="item of customerBillAddrOptions" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['customerContact'].label" :prop="object['customerContact'].name">
              <el-select :disabled="showEdit" clearable v-model="mate.values[object['customerContact'].name]">
                <el-option :label="item.label" :value="item.value" v-for="item of customerContactOptions" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

           <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['tax'].label" :prop="object['tax'].name">
              <dict-selected :rowId="rowId" v-model="mate.values['tax']" dictType="tax" :initValue="mate.values['tax']"></dict-selected>
            </el-form-item>
          </el-col>

           <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['currency'].label" :prop="object['currency'].name">
              <dict-selected :rowId="rowId" v-model="mate.values['currency']" dictType="currency" :initValue="mate.values['currency']"></dict-selected>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['paymentCondition'].label" :prop="object['paymentCondition'].name">
              <dict-selected :rowId="rowId" v-model="mate.values['paymentCondition']" dictType="paymentMethod" :initValue="mate.values['paymentCondition']"></dict-selected>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['orgId'].label" :prop="object['orgId'].name">
               <el-select v-model="mate.values[object['orgId'].name]">
                <el-option :label="item.label" :value="item.value" v-for="item of orgOption" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col> 
            <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['taxSub'].label" :prop="object['taxSub'].name">
              <el-input disabled v-model="mate.values['taxSub']"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['subtotal'].label" :prop="object['subtotal'].name">
              <el-input disabled v-model="mate.values['subtotal']"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['total'].label" :prop="object['total'].name">
              <el-input disabled v-model="mate.values['total']"></el-input>
            </el-form-item>
          </el-col>
          <!--销售订单分类-->
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['soCategoryId'].label" :prop="object['soCategoryId'].name">
               <el-select clearable v-model="mate.values[object['soCategoryId'].name]">
                <el-option :label="item.label" :value="item.value" v-for="item of soCategoryOption" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col> 
          <!--汇率-->
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['exchangeRate'].label" :prop="object['exchangeRate'].name">
              <el-input  v-model="mate.values['exchangeRate']"></el-input>
            </el-form-item>
          </el-col>
          <!--备件比例（%）-->
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['sparePartsRatio'].label" :prop="object['sparePartsRatio'].name">
              <el-input  v-model="mate.values['sparePartsRatio']">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['completedDate'].label" :prop="object['completedDate'].name">
              <el-date-picker type="date" v-model="mate.values[object['completedDate'].name]"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['shippingDate'].label" :prop="object['shippingDate'].name">
              <el-date-picker type="date" v-model="mate.values[object['shippingDate'].name]"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['remark'].label" :prop="object['remark'].name">
              <el-input  v-model="mate.values['remark']"></el-input>
            </el-form-item>
          </el-col>
            
        </template>
      </el-form>
    </el-row>
  </div>
</template>

<script>
  import treeSelect from '../../components/tree-select/tree.vue'
  // import Vue from 'vue'
  import axios from '@/utils/http'; // 导入http中创建的axios实例  
  import SERVICES from "@/services";
  export default {
    components: {
      'dict-selected': function index (resolve) {
        require(['../../components/DictSelected.vue'], resolve)
      },
      'tree-selected': function index (resolve) {
        require(['../../components/TreeSelected.vue'], resolve)
      },
      treeSelect
    },
    data () {
      var validSparePartsRatio= (rule, value, callback) => {
        if (value){
          if (!this.isInput1True(value)) {
            callback(new Error("请输入正确的比例"));
          } else {
            callback();
          }
        }else {
            callback();
          }
      };
      var validExchangeRate = (rule, value, callback) => {
        if (value) {
          if (!this.isInput2True(value)) {
          callback(new Error("请输入正确的汇率"));
          }else {
            callback();
          }
        } else {
            callback();
          }
      };
      return {
        object: {},
        customerData: [],
        customerContactOptions: [],
        customerAddr2Options: [],
        salesmanIdOptions: [],
        soCategoryOption: [],     // 销售订单分类
        addressId: '',
        addressName: '',
        addressData: [],
        officeIdOption: [],
        orgOption: [],
        priceData: [],
        customerBillAddrOptions: [],
        smPriceHeaderId: [],
        rowId: 'true',
        labelPosition: 'right',
        showEdit: false,
        flagState: false,
        tax: '',
        rules: {
          officeId: [
            { required: true, message: '该输入项为必输项', trigger: 'change' }
          ],
          customerId: [
            { required: true, message: '该输入项为必输项', trigger: 'change' }
          ],
          // smPriceHeaderId: [
          //   { required: true, message: '该输入项为必输项', trigger: 'change' }
          // ],
          soType: [
            { required: true, message: '该输入项为必输项', trigger: 'change' }
          ],
          salesmanId: [
            { required: true, message: '该输入项为必输项', trigger: 'change' }
          ],
          customerPo: [
            { required: true, message: '该输入项为必输项', trigger: 'change' }
          ],
          customerAddr1: [
            { required: true, message: '该输入项为必输项', trigger: 'change' }
          ],
          orgId: [
            { required: true, message: '该输入项为必输项', trigger: 'change' }
          ],
          customerBillAddr: [
             { required: true, message: '该输入项为必输项', trigger: 'change' }
          ],
          // 汇率
          exchangeRate: [
            { trigger: 'blur',validator: validExchangeRate }
          ],
          // 备件比例
          sparePartsRatio: [
            { trigger: 'blur',validator: validSparePartsRatio }
          ],
          // 订单日期
          orderDate: [
            { required: true, message: '该输入项为必输项', trigger: 'change' }
          ]
        },
        isSelectRequired: {},
      }
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
    props: {
      mate: Object
    },
    created () {
      // 判断是否可以修改
      // if (!this.flagState) {
      //   this.rowId = ''
      // } else {
      //   this.rowId = 'true'
      // }
      const vm = this
      var user = window.sessionStorage.getItem('user')
      if (user) {
        user = JSON.parse(user)
      }
      let officeId = this.mate.values['officeId'];
      if (this.mate.values.cusPoId) {
        this.showEdit = true
        this.flagState = true
        this.mate.values.showEdit = true
      }
      if (this.mate.values.id === '2') {
        this.showEdit = true
        this.flagState = true
        this.mate.values.showDetial = true
      }
      // 获取当前用户所在机构
      this.$root.ajaxData('/users/office', {}, function (data) {
        data.forEach((i) => {
          vm.officeIdOption.push({ 'label': i.name, 'value': i.id })
          // if (vm.officeIdOption.length !== 0) {
          //   Vue.set(vm.mate.values, 'officeId', vm.officeIdOption[0].value)
          // }
        })
      }, 'GET')
      this.mate.fields.map((i) => { this.object[i.name] = i })
      // 获取客户
      this.getCustomerList();
      // 获取价目表
      if (this.mate.values['customerId']) {
        this.smPriceHeaderId = []
        this.$root.ajaxData('/purchase/smPrice/all/list?dataOnly=true&customerId=' + this.mate.values['customerId'], {}, function (data) {
          data.forEach((i) => {
            vm.object['smPriceHeaderId'].options.push({ 'label': i.priceName, 'value': i.id })
          })
        }, 'GET')
      }
      // 获取仓库
      this.$root.ajaxData('/dc/list?nopaging=1&dataOnly=true', {}, function (data) {
        data.forEach((i) => {
          vm.object['warehouseId'].options.push({ 'label': i.name, 'value': i.id })
        })
      }, 'GET')
      // 获取销售人员
      this.$root.ajaxData('/users/getUserDropdownList', {}, function (data) {
        data.forEach((i) => {
          vm.salesmanIdOptions.push({ 'label': (i.firstname+i.lastname), 'value': i.id })
        })
      }, 'GET')
      // 获取客户联系人
      if (this.mate.values['customerAddr1']) {
        this.$root.ajaxData('/contacts/all/' + this.mate.values['customerAddr1'], {}, function (data) {
          data.forEach((i) => {
            vm.customerContactOptions.push({ 'label': i.name, 'value': i.id })
          })
        }, 'GET')
      }
      // 获取发货库存组织
      if (officeId) {
        this.getOrgList(officeId);
      }
      this.getAddr();
      this.getSaleCategory();    // 获取销售分类下拉值
      if (this.mate.values.currency === 'CNY') {
        this.mate.values.exchangeRate = 1
      }
      // 参数设置 勾选 '销售订单是否允许手工输入价格'
      if (localStorage.getItem('allowInputPrice')) {
        this.isSelectRequired =  {}
      }else {
        this.isSelectRequired =  { required: true, message: '该输入项为必输项',trigger: 'change' }
      }
    },
    methods: {
      /**
       * 校验两位小数点
       */
      isInput1True(val) {
        let reg = /^\d+(\.\d{1,2})?$/; // 声明变量保存正则 2020-03-30
        if(!reg.test(val)) {
          return false;
        } else {
          return true;
        }
      },
      /**
       * 校验六位小数点
       */
      isInput2True(val) {
        let reg = /^\d+(\.\d{1,6})?$/; // 声明变量保存正则 2020-03-30
        if(!reg.test(val)) {
          return false;
        } else {
          return true;
        }
      },
      // 获取销售分类下拉值
      getSaleCategory () {
        axios.get('/purchase/sale/order/category/down').then(res => {
          if (res.data.length) {
            res.data.forEach(item => {
              this.soCategoryOption.push({
                'label': item.categoryName,
                'value': item.id,
                'key': item.id,
              })
            })
          }
        })
      },
      // 地址2改变时,联系人也改变
      changeAddr2 (val) {
        const vm = this
        vm.customerContactOptions = []
        this.mate.values.customerContact = ''
        if (val !== null && val !== '') {
          this.$root.ajaxData('/contacts/all/' + val, {}, function (data) {
            data.forEach((i) => {
              vm.customerContactOptions.push({ 'label': i.name, 'value': i.name })
            })
          }, 'GET')
        }
      },
      // 价目表获取币种，税率
      changeSmPriceHeaderId (val){
        this.smPriceHeaderId.forEach((i) => {
          if (i.id === val) {
            this.$set(this.mate.values, 'tax', i.taxRate)
            this.$set(this.mate.values, 'currency', i.currency)
            this.$set(this.mate.values, 'paymentCondition', i.paymentCondition)
          }
        })
        // 币种为CNY 汇率为1
        if(this.mate.values.currency === 'CNY'){

        }
        if (this.mate.values.currency === 'CNY') {
          this.mate.values.exchangeRate = 1;
        } else if(this.mate.values.currency === 'USD') {// 否则根据汇率管理带出当天汇率
          axios.get('/exchange/rate/current').then(res => {
            this.mate.values.exchangeRate = res.data.exchangeRate
          })
        }
      },
      // 客户改变时
      customerChange (val) {
        // 收货地点
        this.customerAddr2Options = [];
        // if (this.mate.values['customerAddr2']) { // 2020-03-30 customerAddr2是什么？？？
        //   this.mate.values['customerAddr2'] = ''
        // }
        // 收单地点
        this.customerBillAddrOptions = [];
        const vm = this;
        this.customerData.forEach((i) => {
          if (i.id === val) {
            this.$set(this.mate.values, 'customerNum', i.code)
            this.addressData = i.addressList
            this.priceData = i.financeList
            i.addressList.forEach((j) => {
              if (j.billReceiver === '1' && j.address != '' && j.address != null) {
                vm.customerAddr2Options.push({ 'label': j.address, 'value': j.id })
                vm.customerBillAddrOptions.push({ 'label': j.address, 'value': j.address })
              }
            })
          }
        })
        if (val !== null && val !== '') {
        // 在客户改变时，将客户下面的价目表提取出来
          vm.object['smPriceHeaderId'].options = []
          this.$root.ajaxData('/purchase/smPrice/all/list?dataOnly=true&customerId=' + val, {}, function (data) {
            data.forEach((i) => {
              vm.object['smPriceHeaderId'].options.push({ 'label': i.priceName, 'value': i.id })
              vm.smPriceHeaderId = data
            })
          }, 'GET')
        };
        // 客户改变，清空对应字段
        this.mate.values.customerNum = ''
        this.mate.values.customerAddr1 = ''
        this.mate.values.customerBillAddr = ''
        this.mate.values.smPriceHeaderId = ''
        // 客户改变时相应收货地点为空，清空客户联系人
        if (this.mate.values.customerAddr1 == '' || this.mate.values.customerAddr1 == null) {
          this.mate.values.customerContact = ''
        };
        // 客户改变时相应价目表为空，清空客户联系人
        if (this.mate.values.smPriceHeaderId == '' || this.mate.values.smPriceHeaderId == null) {
          this.$set(this.mate.values, 'tax', '')
          this.$set(this.mate.values, 'currency', '')
          this.$set(this.mate.values, 'paymentCondition', '')
        };
      },
      getAddr () {
        var vm = this
        if (this.mate.values.customerId !== null) {
          this.$root.ajaxData('/companys/companyInfo/4?status=1&auditStatus=1&nopaging=1&dataOnly=true', {}, function (data) {
            vm.customerData = data
            vm.customerData.forEach((i) => {
              if (i.id === vm.mate.values.customerId) {
                // Vue.set(vm.mate.values, 'customerAddr1', i.address)
                i.addressList.forEach((j) => {
                  if (j.goodsReceiver === '1' && j.address != '' && j.address != null) { 
                    vm.customerAddr2Options.push({ 'label': j.address, 'value': j.id }) 
                    vm.customerBillAddrOptions.push({ 'label': j.address, 'value': j.address })
                  }
                  // Vue.set(vm.mate.values, 'customerBillAddr', j.address) // 注释手动设置默认收单地点 区分新建和修改 2020-03-30
                })
                return
              }
            })
          }, 'GET')
        }
      },
      // // 收单方修改获取税率
      // changeCustomerBill (val) {
      //   for (let i = 0; i < this.addressData.length; i++) {
      //     if (val === this.addressData[i].address) {
      //       this.addressId = this.addressData[i].id
      //     }
      //   }
      //   for (let j = 0; j < this.priceData.length; j++) {
      //     if (this.addressId === this.priceData[j].id) {
      //       this.$set(this.mate.values, 'tax', this.priceData[j].taxRate)
      //       this.$set(this.mate.values, 'currency', this.priceData[j].currency)
      //     }
      //   }
      // },
      /**
       * 选择机构
       * @param void
       * @return void
       * author: hezhiqinag
       */
      changeOffice (val) {
        var vm = this
        if (this.mate.values.fromPo == null) {
          // 客户为空相应收货地点为空，清空客户联系人
          if (this.mate.values.customerAddr1 == '' || this.mate.values.customerAddr1 == null) {
            vm.mate.values.customerContact = ''
            vm.customerContactOptions = []
          };
          // 客户为空相应价目表为空，清空客户联系人
          if (this.mate.values.smPriceHeaderId == '' || this.mate.values.smPriceHeaderId == null) {
            vm.$set(this.mate.values, 'tax', '')
            vm.$set(this.mate.values, 'currency', '')
            vm.$set(this.mate.values, 'paymentCondition', '')
          };
        }
        // 获取发货组织
        this.mate.values['orgId'] = '';
        this.getOrgList(val)
      },
      /** 获取客户列表
       * @param void
       * @return void
       */
      getCustomerList(){
        this.object['customerId'].options = [];
        this.$root.ajaxData('/companys/companyInfo/4?status=1&auditStatus=1&nopaging=1&dataOnly=true', {}, data => {
          this.customerData = data
          data.forEach( item=> {
            this.object['customerId'].options.push({ 'label': item.name, 'value': item.id })
          })
        }, 'GET')
      },
      /** 获取发货组织列表
       * @param {String} officeId
       * @return void
       */
      getOrgList(officeId){
        this.orgOption = [];
        this.$root.ajaxData(`/org/inventory/all?officeId=${officeId}&dataOnly=true`, {}, data=> {
          data.forEach(item => {
            this.orgOption.push({ 'label': item.name, 'value': item.id })
            // if (vm.orgOption.length !== 0) {
              // Vue.set(vm.mate.values, 'orgId', vm.orgOption[0].value) // 取消设置默认值 区分新增和修改状态 2020-03-31
            // }
          })
        })
      }
    }
  }
</script>

<style scoped>
.el-form-item {
  margin: 15px 20px 2px 0px;
}
.el-select,.el-date-editor.el-input__inner {
  width: 100%;
}
</style>
