<!-- 生成ebs发票 -->
<template>
  <div>
    <el-row>
      <el-button size="mini" @click="submitEBS">提 交</el-button>
      <el-button size="mini" @click="cancelBack">取 消</el-button>
      <div class="head">
        <h1>应付发票</h1>
      </div>
      <div class="detail">
        <ul class="ul">
          <li><span><strong>*</strong>发票号：</span><el-input size="mini" v-model="list.realInvoiceCode" class="codeInput" @blur="checkInvoiceExist()"></el-input></li>
          <!-- <li class="type"><span><strong>*</strong>类型： </span>
            <el-select v-model="list.invoiceType" size="mini" placeholder="请选择" class="typeInput">
              <el-option
                v-for="item in invoiceTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </li> -->
          <li>供应商名称：{{list.companyName}}</li>
          <li>币种：{{list.currency}}</li>
          <li>发票金额：{{list.moneyAmount}}</li>
          <li>税率：{{list.taxRate}}</li>
        </ul>
        <ul>
          <li><span><strong>*</strong>发票摘要：</span><el-input size="mini" v-model="list.summary" class="summaryInput"></el-input></li>
          <li class="type1"><span><strong>*</strong>发票日期：</span>
            <el-date-picker
              size="mini"
              v-model="list.invoiceDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </li>
           <li class="type1"><span><strong>*</strong>条件日期：</span>
            <el-date-picker
              size="mini"
              v-model="list.termsDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </li>
          <li class="type1"><span><strong>*</strong>GL日期：</span>
            <el-date-picker
              size="mini"
              v-model="list.glDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </li>
          <li>地点：{{list.address}}</li>
        </ul>
      </div>
      <div class="invoiceDetail">
        <el-table size="mini" :data="mate.lineMate.rows" border style="width: 100%" class="bottom">
          <el-table-column show-overflow-tooltip :label="objectColumns['lineNum'].label" :prop="objectColumns['lineNum'].name"></el-table-column>
          <el-table-column show-overflow-tooltip :label="objectColumns['type'].label" :prop="objectColumns['type'].name" :formatter="objectColumns['type'].formatter"></el-table-column>
          <el-table-column show-overflow-tooltip :label="objectColumns['noTaxAmount'].label" :prop="objectColumns['noTaxAmount'].name"></el-table-column>
          <el-table-column show-overflow-tooltip :label="objectColumns['orderCode'].label" :prop="objectColumns['orderCode'].name"></el-table-column>
          <el-table-column show-overflow-tooltip :label="objectColumns['qty'].label" :prop="objectColumns['qty'].name"></el-table-column>
          <el-table-column show-overflow-tooltip :label="objectColumns['itemCode'].label" :formatter="objectColumns['itemCode'].formatter" :prop="objectColumns['itemCode'].name" ></el-table-column>
          <el-table-column show-overflow-tooltip :label="objectColumns['itemDesc'].label" :prop="objectColumns['itemDesc'].name" ></el-table-column>
          <el-table-column show-overflow-tooltip :label="objectColumns['itemUnit'].label" :prop="objectColumns['itemUnit'].name"></el-table-column>
          <!-- <el-table-column show-overflow-tooltip :label="objectColumns['currency'].label" :prop="objectColumns['currency'].name"></el-table-column> -->
          <el-table-column show-overflow-tooltip :label="objectColumns['unTaxPrice'].label" :prop="objectColumns['unTaxPrice'].name"></el-table-column>
          <!-- <el-table-column show-overflow-tooltip :label="objectColumns['taxRate'].label" :prop="objectColumns['taxRate'].name"></el-table-column> -->
          <el-table-column show-overflow-tooltip :label="objectColumns['price'].label" :prop="objectColumns['price'].name"></el-table-column>
          <el-table-column show-overflow-tooltip :label="objectColumns['summary'].label" :prop="objectColumns['summary'].name"></el-table-column>
        </el-table>
      </div>  
    </el-row>
  </div>
</template>

<script>
import { API_GATEWAY } from '@/config/index.js'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
import { DateFormat } from '../../utils/util.js'
export default {
  mixins: [ColumnFormatterMixin],
  props: {
    mate: Object,
    isTabCome: Object,
    view: Object
  },
  data () {
    return {
      list: {},
      fileList: [],
      objectColumns: {},
      page: 0,
      pageSize: 5,
      radio3: '1',
      total: 10,
      isInvoiceExist: false,
      invoiceTypeOptions: [
        {
          label: '标准',
          value: 'STANDARD'
        },
        {
          label: '贷项通知单',
          value: 'CREDIT'
        },
        {
          label: '混合',
          value: 'MIXED'
        }
      ]
    }
  },
  created () {
    this.formatterBefore(this.mate.lineMate.columns)
    this.mate.lineMate.columns.map((i) => { this.objectColumns[i.name] = i })
    this.list = this.mate.headValue[0];
    this.init();
  },
  methods: {
    init(){
      // 校验发票号是否存在 isInvoiceExist
      this.checkInvoiceExist();
    },
    //生成ebs发票时校验用户输入的发票号是否已存在
    checkInvoiceExist(){
      var vm = this
      var officeName = this.list.officeName
      var invoiceCode = this.list.realInvoiceCode
      var seller = this.list.companyName
      if(null != invoiceCode && '' != invoiceCode){
        if(invoiceCode.length > 50){
          vm.$message({
            type: 'warning',
            message: '该发票号长度已超过50,请重新输入',
            duration: 0,
            showClose: true
          })
          return true
        }
        this.$root.ajaxData('/purchase/tms/invoice/check/invoice?officeName=' + officeName + '&&invoiceCode=' + invoiceCode + '&&seller=' + seller, {}, function (data) {
          if (data.data === false) {
            //说明此发票号已存在
            vm.$message({
              type: 'warning',
              message: '该发票号已存在，请重新输入发票号',
              duration: 0,
              showClose: true
            })
            vm.isInvoiceExist = true;
            return true
          }else{
            vm.isInvoiceExist = false;
          }
        }, 'GET')
      }
      
    },
    submitEBS () {
      if (this.list.realInvoiceCode === '' || this.list.summary === '' || this.list.invoiceDate === '' || this.list.termsDate === null || this.list.glDate === null){
        this.$message({
          type: 'warning',
          message: '发票号、发票摘要、发票日期、选择日期、GL日期必填',
          duration: 0,
          showClose: true
        })
        return
      }
      // 提交按钮校验发票号问题 2020-07-22
      this.checkInvoiceExist();
      let flag = this.isInvoiceExist;
      if(flag){
        return
      }
      const map = {}
      const vm = this
      this.list.invoiceDate = DateFormat(this.list.invoiceDate, 'yyyy-MM-dd')
      this.list.termsDate = DateFormat(this.list.termsDate, 'yyyy-MM-dd')
      map.headPayment = this.list
      map.billPaymentList = this.mate.lineMate.rows
      const loading = this.$loading({
        lock: true,
        text: '正在生成ebs发票，请稍等......',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.$root.ajaxData('/purchase/invoice/payment/gen/ebs/invoice', map, function (data) {
        loading.close()
        if (data.statusCode === 200) {
          vm.$root.monitor({ url: '/purchase/invoice/payment/get/list' })
          vm.cancelBack()
          vm.getEbsResult(map.headPayment)
        }
      }, 'POST')
    },
    cancelBack () {
      this.$emit('closeTab', '生成ebs发票')
    },
    //定时查询ebs应付发票是否完成
    getEbsResult (val) {
      this.$emit('getEbsResult', val)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet" scoped>
 ul {
    display: inline-block;
    vertical-align: top;
    width: 350px;
    overflow: hidden;
  }
  ul li {
    display: flex;
    align-items:center;
    list-style: none;
    margin: 15px 0;
  }
  ul li span {
    display: inline-block;
    width: 100px;
  }
  ul li span strong {
    display: inline-block;
    color: red;
  }
// .invoiceDetail{
//   margin-top:20px
// }
.fileDetail{
  margin-top:20px
}
.fileBottom{
   margin-top:5px
}
.main{
  margin-left:20px
}
.codeInput {
  margin-left:-35px;
}
.summaryInput {
  margin-left: -20px
}
.typeInput {
  flex: 1;
}
.type span {
  display: inline-block;
  width: 50px;
}
.type1 span {
  display: inline-block;
  width: 80px;
}
</style>
