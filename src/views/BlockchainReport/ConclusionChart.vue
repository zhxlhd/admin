<template>
  <div>
  
  </div>
</template>
<script>
import lineDoubleChart from './lineDoubleChart'
import lineChart from './lineChart'
import lineSaleChart from './lineSaleChart'
import linePreInvoiceChart from './linePreInvoiceChart'
import linePurseChart from './linePurseChart'
import lineInboundChart from './lineInboundChart'
import lineOutboundChart from './lineOutboundChart'
import { DateFormat } from '../../utils/util'
export default {
  components: {
    lineDoubleChart,
    linePreInvoiceChart,
    linePurseChart,
    lineChart,
    lineSaleChart,
    lineOutboundChart,
    lineInboundChart
  },
  props: {
    mate: Object
  },
  watch: {
    mate: function (newMate) {
      var vm = this
      if (!newMate.latestBlk) {
        this.$root.ajaxData('/purchase/hyper/chain/report', {}, function (data) {
          vm.mate = data
          vm.successRate = (data.successRate * 100).toFixed(2)
          vm.changeRate = (data.changeRate * 100).toFixed(2)
          vm.responseRate = (data.responseRate * 100).toFixed(2)
        }, 'GET')
      }
    }
  },
  data () {
    return {
      yName: '',
      xName: '',
      maxNum: 0,
      interval: 0,
      fatherXData: [],
      fatherYData: [],
      formdata: {},
      fatherCompanyXData: [],
      fatherCompanyYData: [],
      fatherCompanyDetial: [],
      fatherPurseXData: [],
      fatherPurseYData: [],
      fatherSaleXData: [],
      fatherSaleYData: [],
      fatherPreInvoiceXData: [],
      fatherPreInvoiceYData: [],
      fatherPreInvoiceDetial: [],
      fatherInboundXData: [],
      fatherInboundYData: [],
      fatherOutboundXData: [],
      fatherOutboundYData: [],
      yPreInvoiceName: '',
      labelPosition: 'right',
      xPreInvoiceName: '',
      changeRate: '',
      successRate: '',
      responseRate: '',
      fatherDetial: [],
      weeks: [],
      hours: [],
      lastMonth: [],
      querySupplier: {
        dateFrom: '',
        dateTo: ''
      },
      queryCompany: {
        dateFrom: '',
        dateTo: ''
      },
      queryInbound: {
        dateFrom: '',
        dateTo: ''
      },
      queryPurse: {
        dateFrom: '',
        dateTo: ''
      },
      radioDay: '1'
    }
  },
  computed: {
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
  created () {
    this.yName = '交易数量'
    this.dataInit()
    this.dataInterval()
    this.$router.push('/conclusionChart')
  },
  methods: {
    // 对账结算查询
    supplierQuery () {
      var vm = this
      this.querySupplier.beginDate = DateFormat(this.querySupplier.dateFrom, 'yyyy-MM')
      this.querySupplier.toDate = DateFormat(this.querySupplier.dateTo, 'yyyy-MM')
      if (this.querySupplier.toDate === null && this.querySupplier.beginDate !== null) {
        this.$root.ajaxData('/purchase/settlement/query/block/report?dateFrom=' + this.querySupplier.beginDate, {}, function (data) {
          vm.fatherXData = data.mate.mateXList
          vm.fatherYData = data.mate.mateYList
          vm.fatherDetial = data.mate.moneyList
        }, 'GET')
        this.$root.ajaxData('/purchase/tms/invoice/query/block/report?dateFrom=' + this.querySupplier.beginDate, {}, function (data) {
          vm.fatherPreInvoiceXData = data.mate.mateXList
          vm.fatherPreInvoiceYData = data.mate.mateYList
          vm.fatherPreInvoiceDetial = data.mate.moneyList
        }, 'GET')
      }
      if (this.querySupplier.beginDate === null && this.querySupplier.toDate !== null) {
        this.$root.ajaxData('/purchase/settlement/query/block/report?dateTo=' + this.querySupplier.toDate, {}, function (data) {
          vm.fatherXData = data.mate.mateXList
          vm.fatherYData = data.mate.mateYList
          vm.fatherDetial = data.mate.moneyList
        }, 'GET')
        this.$root.ajaxData('/purchase/tms/invoice/query/block/report?dateTo=' + this.querySupplier.toDate, {}, function (data) {
          vm.fatherPreInvoiceXData = data.mate.mateXList
          vm.fatherPreInvoiceYData = data.mate.mateYList
          vm.fatherPreInvoiceDetial = data.mate.moneyList
        }, 'GET')
      }
      if (this.querySupplier.beginDate === null && this.querySupplier.toDate === null) {
        this.$root.ajaxData('/purchase/settlement/query/block/report', {}, function (data) {
          vm.fatherXData = data.mate.mateXList
          vm.fatherYData = data.mate.mateYList
          vm.fatherDetial = data.mate.moneyList
        }, 'GET')
        this.$root.ajaxData('/purchase/tms/invoice/query/block/report', {}, function (data) {
          vm.fatherPreInvoiceXData = data.mate.mateXList
          vm.fatherPreInvoiceYData = data.mate.mateYList
          vm.fatherPreInvoiceDetial = data.mate.moneyList
        }, 'GET')
      }
      if (this.querySupplier.beginDate !== null && this.querySupplier.toDate !== null) {
        this.$root.ajaxData('/purchase/settlement/query/block/report?dateFrom=' + this.querySupplier.beginDate + '&dateTo=' + this.querySupplier.toDate, {}, function (data) {
          vm.fatherXData = data.mate.mateXList
          vm.fatherYData = data.mate.mateYList
          vm.fatherDetial = data.mate.moneyList
        }, 'GET')
        this.$root.ajaxData('/purchase/tms/invoice/query/block/report?dateFrom=' + this.querySupplier.beginDate + '&dateTo=' + this.querySupplier.toDate, {}, function (data) {
          vm.fatherPreInvoiceXData = data.mate.mateXList
          vm.fatherPreInvoiceYData = data.mate.mateYList
          vm.fatherPreInvoiceDetial = data.mate.moneyList
        }, 'GET')
      }
    },
    // 企业查询
    supplierCompanyQuery () {
      var vm = this
      this.queryCompany.beginDate = DateFormat(this.queryCompany.beginDate, 'yyyy-MM')
      this.queryCompany.toDate = DateFormat(this.queryCompany.toDate, 'yyyy-MM')
      if (this.queryCompany.toDate === null && this.queryCompany.beginDate !== null) {
        this.$root.ajaxData('/inbound/putaway/lines/query/block/report?beginDate=' + this.queryCompany.beginDate, {}, function (data) {
          vm.fatherCompanyXData = data.mate.mateXList
          vm.fatherCompanyYData = data.mate.mateYList
        }, 'GET')
      }
      if (this.queryCompany.beginDate === null && this.queryCompany.toDate !== null) {
        this.$root.ajaxData('/inbound/putaway/lines/query/block/report?toDate=' + this.queryCompany.toDate, {}, function (data) {
          vm.fatherCompanyXData = data.mate.mateXList
          vm.fatherCompanyYData = data.mate.mateYList
        }, 'GET')
      }
      if (this.queryCompany.beginDate === null && this.queryCompany.toDate === null) {
        this.$root.ajaxData('/inbound/putaway/lines/query/block/report', {}, function (data) {
          vm.fatherCompanyXData = data.mate.mateXList
          vm.fatherCompanyYData = data.mate.mateYList
        }, 'GET')
      }
      if (this.queryCompany.beginDate !== null && this.queryCompany.toDate !== null) {
        this.$root.ajaxData('/inbound/putaway/lines/query/block/report?beginDate=' + this.queryCompany.beginDate + '&toDate=' + this.queryCompany.toDate, {}, function (data) {
          vm.fatherCompanyXData = data.mate.mateXList
          vm.fatherCompanyYData = data.mate.mateYList
        }, 'GET')
      }
    },
    // 入库查询
    inboundQuery () {
      var vm = this
      this.queryInbound.beginDate = DateFormat(this.queryInbound.dateFrom, 'yyyy-MM')
      this.queryInbound.toDate = DateFormat(this.queryInbound.dateTo, 'yyyy-MM')
      if (this.queryInbound.toDate === null && this.queryInbound.beginDate !== null) {
        this.$root.ajaxData('/inbound/putaway/lines/query/block/report?dateFrom=' + this.queryInbound.beginDate, {}, function (data) {
          vm.fatherInboundXData = data.mate.mateXList
          vm.fatherInboundYData = data.mate.mateYList
        }, 'GET')
        this.$root.ajaxData('/outbound/pick/lines/query/block/report?dateFrom=' + this.queryInbound.beginDate, {}, function (data) {
          vm.fatherOutboundXData = data.mate.mateXList
          vm.fatherOutboundYData = data.mate.mateYList
        }, 'GET')
      }
      if (this.queryInbound.beginDate === null && this.queryInbound.toDate !== null) {
        this.$root.ajaxData('/inbound/putaway/lines/query/block/report?dateTo=' + this.queryInbound.toDate, {}, function (data) {
          vm.fatherInboundXData = data.mate.mateXList
          vm.fatherInboundYData = data.mate.mateYList
        }, 'GET')
        this.$root.ajaxData('/outbound/pick/lines/query/block/report?dateTo=' + this.queryInbound.toDate, {}, function (data) {
          vm.fatherOutboundXData = data.mate.mateXList
          vm.fatherOutboundYData = data.mate.mateYList
        }, 'GET')
      }
      if (this.queryInbound.beginDate === null && this.queryInbound.toDate === null) {
        this.$root.ajaxData('/inbound/putaway/lines/query/block/report', {}, function (data) {
          vm.fatherInboundXData = data.mate.mateXList
          vm.fatherInboundYData = data.mate.mateYList
        }, 'GET')
        this.$root.ajaxData('/outbound/pick/lines/query/block/report', {}, function (data) {
          vm.fatherOutboundXData = data.mate.mateXList
          vm.fatherOutboundYData = data.mate.mateYList
        }, 'GET')
      }
      if (this.queryInbound.beginDate !== null && this.queryInbound.toDate !== null) {
        this.$root.ajaxData('/inbound/putaway/lines/query/block/report?dateFrom=' + this.queryInbound.beginDate + '&dateTo=' + this.queryInbound.toDate, {}, function (data) {
          vm.fatherInboundXData = data.mate.mateXList
          vm.fatherinboundYData = data.mate.mateYList
        }, 'GET')
        this.$root.ajaxData('/outbound/pick/lines/query/block/report?dateFrom=' + this.queryInbound.beginDate + '&dateTo=' + this.queryInbound.toDate, {}, function (data) {
          vm.fatherOutboundXData = data.mate.mateXList
          vm.fatherOutboundYData = data.mate.mateYList
        }, 'GET')
      }
    },
    // 采购销售查询
    purseQuery () {
      var vm = this
      this.queryPurse.beginDate = DateFormat(this.queryPurse.dateFrom, 'yyyy-MM')
      this.queryPurse.toDate = DateFormat(this.queryPurse.dateTo, 'yyyy-MM')
      if (this.queryPurse.toDate === null && this.queryPurse.beginDate !== null) {
        this.$root.ajaxData('/purchase/goods/pricing/query/block/report?dateFrom=' + this.queryPurse.beginDate, {}, function (data) {
          vm.fatherPurseXData = data.mate.mateXList
          vm.fatherPurseYData = data.mate.mateYList
        }, 'GET')
        this.$root.ajaxData('/purchase/tms/invoice/query/block/report?dateFrom=' + this.queryPurse.beginDate, {}, function (data) {
          vm.fatherSaleXData = data.mate.mateXList
          vm.fatherSaleYData = data.mate.mateYList
        }, 'GET')
      }
      if (this.queryPurse.beginDate === null && this.queryPurse.toDate !== null) {
        this.$root.ajaxData('/purchase/goods/pricing/query/block/report?dateTo=' + this.queryPurse.toDate, {}, function (data) {
          vm.fatherPurseXData = data.mate.mateXList
          vm.fatherPurseYData = data.mate.mateYList
        }, 'GET')
        this.$root.ajaxData('/purchase/tms/invoice/query/block/report?dateTo=' + this.queryPurse.toDate, {}, function (data) {
          vm.fatherSaleXData = data.mate.mateXList
          vm.fatherSaleYData = data.mate.mateYList
        }, 'GET')
      }
      if (this.queryPurse.beginDate === null && this.queryPurse.toDate === null) {
        this.$root.ajaxData('/purchase/goods/pricing/query/block/report', {}, function (data) {
          vm.fatherPurseXData = data.mate.mateXList
          vm.fatherPurseYData = data.mate.mateYList
        }, 'GET')
        this.$root.ajaxData('/purchase/tms/invoice/query/block/report', {}, function (data) {
          vm.fatherSaleXData = data.mate.mateXList
          vm.fatherSaleYData = data.mate.mateYList
        }, 'GET')
      }
      if (this.queryPurse.beginDate !== null && this.queryPurse.toDate !== null) {
        this.$root.ajaxData('/purchase/goods/pricing/query/block/report?dateFrom=' + this.queryPurse.beginDate + '&dateTo=' + this.queryPurse.toDate, {}, function (data) {
          vm.fatherPurseXData = data.mate.mateXList
          vm.fatherPurseYData = data.mate.mateYList
        }, 'GET')
        this.$root.ajaxData('/purchase/tms/invoice/query/block/report?dateFrom=' + this.queryPurse.beginDate + '&dateTo=' + this.queryPurse.toDate, {}, function (data) {
          vm.fatherSaleXData = data.mate.mateXList
          vm.fatherSaleYData = data.mate.mateYList
        }, 'GET')
      }
    },
    dataInterval () {
      setInterval(() => {
        this.dataInit()
      }, 180000)
    },
    dataInit () {
      var vm = this
      this.$root.ajaxData('/purchase/hyper/chain/report', {}, function (data) {
        vm.mate = data
        vm.successRate = (data.successRate * 100).toFixed(2)
        vm.changeRate = (data.changeRate * 100).toFixed(2)
        vm.responseRate = (data.responseRate * 100).toFixed(2)
      }, 'GET')
      this.$root.ajaxData('/purchase/settlement/query/block/report', {}, function (data) {
        vm.fatherXData = data.mate.mateXList
        vm.fatherYData = data.mate.mateYList
        vm.fatherDetial = data.mate.moneyList
      }, 'GET')
      this.$root.ajaxData('/purchase/tms/invoice/query/block/report', {}, function (data) {
        vm.fatherPreInvoiceXData = data.mate.mateXList
        vm.fatherPreInvoiceYData = data.mate.mateYList
        vm.fatherPreInvoiceDetial = data.mate.moneyList
      }, 'GET')
      this.$root.ajaxData('/companys/query/block/report', {}, function (data) {
        vm.fatherCompanyXData = data.mate.mateXList
        vm.fatherCompanyYData = data.mate.mateYList
      }, 'GET')
      this.$root.ajaxData('/inbound/putaway/lines/query/block/report', {}, function (data) {
        vm.fatherInboundXData = data.mate.mateXList
        vm.fatherInboundYData = data.mate.mateYList
      }, 'GET')
      this.$root.ajaxData('/outbound/pick/lines/query/block/report', {}, function (data) {
        vm.fatherOutboundXData = data.mate.mateXList
        vm.fatherOutboundYData = data.mate.mateYList
      }, 'GET')
      this.$root.ajaxData('/purchase/goods/pricing/query/block/report', {}, function (data) {
        vm.fatherPurseXData = data.mate.mateXList
        vm.fatherPurseYData = data.mate.mateYList
      }, 'GET')
    }
  }
}
</script>

<style scoped>
.lineChart{
  margin-top: 10px;
  margin-left: 20px;
  width: 98%;
  box-shadow: 
    -0.5px 0 20px #cfd8dc, 
    0.5px 0 20px #cfd8dc, 
    0 -0.5px 20px #cfd8dc,  
    0 0.5px 20px #cfd8dc;
}
.lineOutboundRight{
  margin-left: 2%
}
.selectMonth{
  float:right;
}
/* .lineLeft{
  margin-right: 100%
} */
.clearfix{
  font-size: 20px;
}
.radioDay{
   position: absolute;
   right: 10px;
}
.title-cardhead{
   width: 90%;
   height:20%;
   float: left;
   margin:5px 10px 20px 60px;
   z-index:10;
}
.title-card{
    width: 90%;
    height:30%;
    float: left;
    box-shadow: 
    -1px 0 20px #888888, /*左边阴影*/  
    1px 0 20px #888888, /*右边阴影*/  
    0 -1px 20px #888888, /*顶部阴影*/  
    0 1px 20px #888888; /*底边阴影*/  
    margin:5px 10px 20px 60px;
    z-index:10;
  }
  .clearfixNumProgress{
    margin-left: 50%;
    font-size:30px; 
  }
  .clearfixNum {
    font-size:35px; 
    color:white; 
  }
  .clearfixTitleProgress{
    margin-top:-20%; 
    margin-left: 50%;
    font-size: 20px;
  }
  .clearfixTitle{
    margin-top: 15px;
    color:white;
    font-size: 20px;
  }
  .clearfixImg{
    margin-top: -80px;
    float:right;
    height: auto;
    max-height: 20%;
    overflow: hidden;
    max-width: 20%;
  }
</style>
