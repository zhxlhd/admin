<template>
  <div class="w900">
    <div class="overflow-hidden" style="position: relative;width: 100%;">
      <div class="left">
        <div class="qrCode">
          <img class="qrCode" id="invoiceQrCode" src="../assets/imgs/qrCode.jpg"/>
        </div>
        <div>
          <span class="color-red">机器编号：</span>
          <a href="javascript:;" class="machineNumber" id="machineNumber"></a>
          <span style="margin-left:45px;" id="output-tag"></span>
        </div>
      </div>
      <div class="title">
        <div id="region-area" class="region">{{ list.invoiceType }}<p class="hr"></p></div>
        <img class="executiveStamp" id="areaIcon" src="../assets/imgs/proxy.jpg" />
      </div>
      <div class="right invoicenumber">
        <div>
          <span class="color-red" >发票代码：
          <span >{{list.invoiceCode}}</span></span>
          <a  href="javascript:;" class="invoiceNumber" id="invoiceCode"></a>
        </div>
        <div v-if="myInvoice">
          <span class="color-red">发票号码：</span>
          <span>{{list.invoiceNo}}</span>
          <a  href="javascript:;" class="invoiceNumber" id="invoiceNo"></a>
        </div>
        <div v-else @click="clickEdit" style="cursor:pointer;">
          <span class="color-red">发票号码：</span>
          <span  v-show="showNoEdit">{{list.invoiceNo}}</span>
          <input size="mini" v-model="list.invoiceNo" v-show="showEdit" @blur="blurEdit(list.invoiceNo)"/>
          <a  href="javascript:;" class="invoiceNumber" id="invoiceNo"></a>
        </div>
        <div>
          <span class="color-red">开票日期：</span>
          <span >{{list.makeInvoiceTime}}</span>
          <!-- <span class="date_year" id="year"></span>
          <span class="color-red">年</span>
          <span class="date_month" id="month"></span>
          <span class="color-red">月</span>
          <span class="date_day" id="day"></span>
          <span class="color-red">日</span> -->
        </div>
        <div>
          <span class="color-red jym">校验码</span><span class="color-red mh">:</span>
          <a href="javascript:;" class="checksum" id="invoiceCheckCode"></a>
        </div>
      </div>
    </div>
    <table border="1" cellspacing="0" cellpadding="0">
      <tr>
        <td class="color-red buyer">购买方</td>
        <td colspan="3">
          <table class="information">
            <tr><td class="color-red"><span style="letter-spacing: 48px;">名</span>称:</td>
              <td class="w420 wrap-all buyerName" id="buyerName"><span>{{list.buyerName}}</span></td>
            </tr>
            <tr><td class="color-red">纳税人识别号:</td>
              <td class="w420 wrap-all buyerTaxNumber" id="buyerTaxNo"><span>{{list.buyerTaxNumber}}</span></td>
            </tr>
            <tr><td class="color-red"><span style="padding-right: 6px;">地</span>址、<span style="padding-right: 6px;">电</span>话:</td>
              <td class="w420 wrap-all buyerAddress" id="buyerAddressPhone"> <span>{{list.buyerAddress}}</span></td>
            </tr>
            <tr><td class="color-red">开户行及账号:</td>
              <td class="w420 wrap-all buyerAccount" id="buyerBankAccount"><span>{{list.buyerAccount}}</span></td>
            </tr>
          </table>
        </td>
        <td class="color-red pw">密码区</td>
        <td class="pwq cipher" colspan="3" id="taxControlCode">
          <p id="row1"></p>
          <p id="row2"></p>
          <p id="row3"></p>
          <p id="row4"></p>
        </td>
      </tr>
    </table>
    <div style="position: relative;">
      <table class="detail" border="1" cellspacing="0" cellpadding="0">
        <tr style="line-height: 20px;">
          <td class="w270 color-red text-center">货物或应税劳务、服务名称</td>
          <td class="w90 color-red text-center">规格型号</td>
          <td class="w60 color-red text-center">单位</td>
          <td class="w120 color-red text-center">数量</td>
          <td class="w120 color-red text-center">单价</td>
          <td class="w120 color-red text-center">金额</td>
          <td class="w60 color-red text-center">税率</td>
          <td class="w150 color-red text-center">税额</td>
        </tr>
      </table>
    <div class="detailbox">
      <table class="detail1"  cellspacing="0" cellpadding="0" :data="invoiceLine">
        <tr class="product" v-for="(item, index) in invoiceLine" :key="index">
          <td class="w270 name">{{item.name}}</td>
          <td class="w90 model">{{item.model}}</td>
          <td class="w60 text-center unit">{{item.unit}}</td>
          <td class="w120 text-right quantity">{{item.quantity}}</td>
          <td class="w120 text-right unitPrice">{{item.unitPrice}}</td>
          <td class="w120 text-right priceAmount">{{item.totalPriceAmount}}</td>
          <td class="w60 text-center taxRate">{{item.taxRate}}</td>
          <td class="w150 text-right taxAmount">{{item.taxAmount}}</td>
        </tr>
        <tr id="productList"></tr>
      </table>
    </div>
    <table class="detail"  style="position: absolute;bottom: 0;">
      <tr style="height: 30px;line-height: 30px;">
        <td class="w270 hj color-red text-center">合&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;计</td>
        <td class="w90"></td>
        <td class="w60"></td>
        <td class="w120"></td>
        <td class="w120"></td>
        <td class="w120 text-right totalPriceAmount" id="invoiceTotalPrice"><span>{{list.totalPriceAmount}}</span></td>
        <td class="w60"></td>
        <td class="w150 text-right totalTaxAmount" id="invoiceTotalTax"><span>{{list.totalTaxAmount}}</span></td>
      </tr>

    </table>
    </div>
    <table class="hj" border="1" cellspacing="0" cellpadding="0">
      <tr style="line-height: 30px;">
        <td class="w240 color-red text-center">价税合计（大写）</td>
        <td class="w400 color-red" style="border-right: none;border-right-color: #FFFFFF;">
          <span class="totalPriceAndTaxInCapital"></span><img class="dx" src="../assets/images/dx.png"/><span class="color-666" id="invoiceCapitalTotalPriceTax"></span>
          <span>{{list.totalPriceAndTax_up}}</span>
        </td>
        <td class="w258 color-red" style="border-left: none;border-left-color: #FFFFFF;">（小写）
          <span class="totalPriceAndTax color-666" id="invoiceTotalPriceTax"></span>
          <span>{{list.totalPriceAndTax_lower}}</span>
        </td>
      </tr>
    </table>
    <table class="seller" border="1" cellspacing="0" cellpadding="0">
      <tr>
        <td class="color-red buyer">销售方</td>
        <td colspan="3">
          <table class="information">
            <tr><td class="color-red"><span style="letter-spacing: 48px;">名</span>称:</td>
              <td class="w420 supplierName" id="sellerName">
                <span>{{list.supplierName}}</span>
              </td>
            </tr>
            <tr><td class="color-red">纳税人识别号:</td>
              <td class="w420 supplierTaxNumber" id="sellerTaxNo"><a href="javascript:;"></a>
              <span>{{list.supplierTaxNumber}}</span>
              </td>
            </tr>
            <tr><td class="color-red"><span style="padding-right: 6px;">地</span>址、<span style="padding-right: 6px;">电</span>话:</td>
              <td class="w420 supplierAddress" id="sellerAddressPhone">
                <span>{{list.supplierAddress}}</span>
              </td>
            </tr>
            <tr><td class="color-red">开户行及账号:</td>
              <td class="w420 supplierAccount" id="sellerBankAccount">
                <span>{{list.supplierAccount}}</span>
              </td>
            </tr>
          </table>
        </td>
        <td class="color-red pw">备注</td>
        <td class="pwq note" colspan="3" id="remarks">
          <span>{{list.note}}</span>
        </td>
      </tr>
    </table>
    <ul class="skxx">
      <li>
        <span class="color-red">收款人：</span>
        <span class="payee" id="payee">{{list.payee}}</span>
      </li>
      <li>
        <span class="color-red">复核：</span>
        <span class="reviewer" id="checker">{{list.checker}}</span>
      </li>
      <li>
        <span class="color-red">开票人：</span>
        <span class="drawer" id="drawer">{{list.drawer}}</span>
      </li>
      <li style="position: relative;">
        <span class="color-red">销售方：（章）</span>
        <img class="signature" id="companyIcon" src="" />
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    invoiceDetial: Object,
    rowStatus: Object,
    myInvoice: Boolean
  },
  watch: {
    invoiceDetial: function () {
      this.list = this.invoiceDetial
      this.invoiceLine = this.invoiceDetial.lineDataList
      this.showNoEdit = true
      this.showEdit = false
    }
  },
  methods: {
    clickEdit (val) {
      if (this.rowStatus.status !== '1') {
        this.showNoEdit = false
        this.showEdit = true
      } else {
        this.$message({
          message: '已开票不能修改',
          type: 'warning'
        })
        return
      }
    },
    blurEdit (val) {
      this.showNoEdit = true
      this.showEdit = false
      const data = {}
      if (val) {
        data.invoiceNo = this.list.invoiceNo
        data.isPre = 1
        this.$root.ajaxData('/purchase/tms/invoice/' + this.rowStatus.id, data, function (data) {
        }, 'PUT')
      }
    }
  },
  data () {
    return {
      list: {},
      invoiceLine: {},
      showNoEdit: true,
      showEdit: false
    }
  },
  created () {
    this.list = this.invoiceDetial
    this.invoiceLine = this.invoiceDetial.lineDataList
  }
}
</script>
<style  scoped src="../assets/styles/invoice.css">
</style>

