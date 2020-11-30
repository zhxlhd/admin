<template>
  <div>
    <el-row>
    <el-form :model="mate" :label-position="labelPosition" :label-width="labelWidth" class="dialogForm">
        <template>
          <el-row>
          <el-col :xs="12" :sm="8" :md="8" :lg="8">
            <el-card  style="background-color:#6db6e2;margin-left:5%" class="title-cardhead"    >
              <div  class="clearfixNum" >
                <span >#{{mate.latestBlk}}</span>
              </div>
              <div  class="clearfixTitle" >
                <span >最新区块</span>
              </div>
              <span><img src="../../assets/images/qukuai.png" class="clearfixImg"></span>
            </el-card>
          </el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="8">
           <el-card  style="background-color:#329dea;margin-left:5%" class="title-cardhead"   >
              <div  class="clearfixNum" >
                <span >{{mate.totalTxs}}</span>
              </div>
              <div  class="clearfixTitle" >
                <span >总交易数</span>
              </div>
              <span><img src="../../assets/images/jiaoyi.png" class="clearfixImg"></span>
            </el-card>
          </el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="7">
           <el-card  style="background-color:#6db6e2;margin-left:5%" class="title-cardhead"   >
              <div  class="clearfixNum" >
                <span >{{mate.throughput}}</span>
              </div>
              <div  class="clearfixTitle" >
                <span >吞吐量</span>
              </div>
              <span><img src="../../assets/images/tuntu.png" class="clearfixImg"></span>
            </el-card>
          </el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="1">
             <el-button  icon="el-icon-close" circle @click="close"></el-button>
          </el-col>
          </el-row>
          <!-- <el-row>
             <el-col :xs="12" :sm="8" :md="6" :lg="8">
           <el-card  style="margin-left:5%" class="title-card"   >
             <el-progress type="circle" :percentage="this.successRate" color="#9999FF"></el-progress>
              <div  class="clearfixTitleProgress" >
                <span >交易成功率</span>
              </div>
              
            </el-card>
          </el-col>
           <el-col :xs="12" :sm="8" :md="6" :lg="8">
           <el-card  style="margin-left:5%" class="title-card"   >
             <el-row>
             <el-progress type="circle" :percentage="this.changeRate"></el-progress>
              <div  class="clearfixTitleProgress" >
                <span >交易变化率</span>
              </div>
             </el-row>
            </el-card>
          </el-col>
           <el-col :xs="12" :sm="8" :md="6" :lg="8">
           <el-card  style="margin-left:5%" class="title-card"   >
             <el-progress type="circle" :percentage="this.responseRate" color="#FF88C2"></el-progress>
               <div  class="clearfixTitleProgress" >
                <span >交易响应率</span>
              </div>
            </el-card>
          </el-col>
          </el-row> -->
        </template>
    </el-form>
    </el-row>
    <div class="lineChart"> 
    <el-row>
      <el-card>
        <div>
        <el-row>
          <el-col :xs="8" :sm="8" :md="4" :lg="8" >
             <lineDoubleChart class="lineLeft" :fatherXData="fatherXData" :fatherYData="fatherYData" :fatherDetial="fatherDetial" :yName="yCompanyName" :xName="xCompanyName" :maxNum="maxNum" :maxMoney="maxMoney"></lineDoubleChart>
          </el-col>
           <el-col :xs="8" :sm="8" :md="4" :lg="8" >
            <linePreInvoiceChart class="lineRight" :fatherXData="fatherPreInvoiceXData" :fatherYData="fatherPreInvoiceYData" :fatherDetial="fatherPreInvoiceDetial" :yName="yName" :xName="xName" :maxNum="maxPreInvoiceNum" :maxMoney="maxPreInvoiceMoney"></linePreInvoiceChart>
          </el-col>
           <el-col :xs="8" :sm="8" :md="4" :lg="8" >
            <lineChart class="lineLeft" :fatherXData="fatherCompanyXData" :fatherYData="fatherCompanyYData" :fatherDetial="fatherDetial" :yName="yName" :xName="xName" :maxNum="maxCompanyNum" :maxMoney="maxCompanyMoney"></lineChart>
          </el-col>
          </el-row>
           <el-row>
           <el-col :xs="8" :sm="8" :md="4" :lg="8" >
            <lineSaleChart class="lineRight" :fatherXData="fatherSaleXData" :fatherYData="fatherSaleYData" :fatherDetial="fatherPreInvoiceDetial" :yName="yName" :xName="xName" :maxNum="maxSaleNum" :maxMoney="maxSaleMoney"></lineSaleChart>
          </el-col>
           <el-col :xs="8" :sm="8" :md="4" :lg="8" >
             <lineInboundChart class="lineLeft" :fatherXData="fatherInboundXData" :fatherYData="fatherInboundYData" :fatherDetial="fatherInboundDetial" :yName="yCompanyName" :xName="xCompanyName" :maxNum="maxInboundNum" :maxMoney="maxInboundMoney"></lineInboundChart>
          </el-col>
           <el-col :xs="8" :sm="8" :md="4" :lg="8" >
            <lineOutboundChart class="lineOutboundRight" :fatherXData="fatherOutboundXData" :fatherYData="fatherOutboundYData" :fatherDetial="fatherPreInvoiceDetial" :yName="yName" :xName="xName" :maxNum="maxOutboundNum" :maxMoney="maxOutboundMoney"></lineOutboundChart>
          </el-col>
          </el-row>
        </div>
      </el-card>
   </el-row>
    </div>
     <!-- <div class="lineChart">
    <el-row>
      <el-card>
        <div>
        <el-row>
           <el-col :xs="8" :sm="8" :md="4" :lg="8" >
            <lineSaleChart class="lineRight" :fatherXData="fatherSaleXData" :fatherYData="fatherSaleYData" :fatherDetial="fatherPreInvoiceDetial" :yName="yName" :xName="xName"></lineSaleChart>
          </el-col>
           <el-col :xs="8" :sm="8" :md="4" :lg="8" >
             <lineInboundChart class="lineLeft" :fatherXData="fatherInboundXData" :fatherYData="fatherInboundYData" :fatherDetial="fatherInboundDetial" :yName="yCompanyName" :xName="xCompanyName"></lineInboundChart>
          </el-col>
           <el-col :xs="8" :sm="8" :md="4" :lg="8" >
            <lineOutboundChart class="lineOutboundRight" :fatherXData="fatherOutboundXData" :fatherYData="fatherOutboundYData" :fatherDetial="fatherPreInvoiceDetial" :yName="yName" :xName="xName"></lineOutboundChart>
          </el-col>
          </el-row>
        </div>
      </el-card>
   </el-row>
    </div> -->
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
      maxPreInvoiceNum: 0,
      maxCompanyMoney: 0,
      maxCompanyNum: 0,
      maxSaleNum: 0,
      maxInboundNum: 0,
      maxOutboundNum: 0,
      maxMoney: 0,
      maxPreInvoiceMoney: 0,
      maxSaleMoney: 0,
      maxInboundMoney: 0,
      maxOutboundMoney: 0,
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
      width = '100px'
      return width
    }
  },
  created () {
    this.yName = '交易数量'
    this.dataInit()
    this.dataInterval()
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
    close () {
      this.$router.push('/')
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
        vm.maxNum = data.mate.maxNum
        vm.maxMoney = data.mate.maxMoney
      }, 'GET')
      this.$root.ajaxData('/purchase/tms/invoice/query/block/report', {}, function (data) {
        vm.fatherPreInvoiceXData = data.mate.mateXList
        vm.fatherPreInvoiceYData = data.mate.mateYList
        vm.fatherPreInvoiceDetial = data.mate.moneyList
        vm.maxPreInvoiceMoney = data.mate.maxMoney
        vm.maxPreInvoiceNum = data.mate.maxNum
      }, 'GET')
      this.$root.ajaxData('/companys/query/block/report', {}, function (data) {
        vm.fatherCompanyXData = data.mate.mateXList
        vm.fatherCompanyYData = data.mate.mateYList
        vm.maxCompanyNum = data.mate.maxNum
      }, 'GET')
      this.$root.ajaxData('/inbound/putaway/lines/query/block/report', {}, function (data) {
        vm.fatherInboundXData = data.mate.mateXList
        vm.fatherInboundYData = data.mate.mateYList
        vm.maxInboundNum = data.mate.maxNum
        vm.maxInboundMoney = data.mate.maxMoney
      }, 'GET')
      this.$root.ajaxData('/outbound/pick/lines/query/block/report', {}, function (data) {
        vm.fatherOutboundXData = data.mate.mateXList
        vm.fatherOutboundYData = data.mate.mateYList
        vm.maxOutboundNum = data.mate.maxNum
        vm.maxOutboundMoney = data.mate.maxMoney
      }, 'GET')
      this.$root.ajaxData('/purchase/goods/pricing/query/block/report', {}, function (data) {
        vm.fatherPurseXData = data.mate.mateXList
        vm.fatherPurseYData = data.mate.mateYList
      }, 'GET')
      this.$root.ajaxData('/purchase/so/headers/query/block/report', {}, function (data) {
        vm.fatherSaleXData = data.mate.mateXList
        vm.fatherSaleYData = data.mate.mateYList
      }, 'GET')
    }
  }
}
</script>

<style scoped lang="scss">
.lineChart{
  margin-top: 10px;
  margin-left: 20px;
  width: 98%;
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
   width: 85%;
   height:20%;
   float: left;
   margin:10px 10px 20px 60px;
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
  // .closeButton{
  //   position: absolute;
  //   right: 10px;
  //   button{
  //     padding: 7px 15px;
  //     background-color: #fff;
  //     cursor: pointer;
  //   }
  // }
  .clearfixImg{
    margin-top: -80px;
    float:right;
    height: auto;
    max-height: 20%;
    overflow: hidden;
    max-width: 20%;
  }
</style>
