<template>
  <div class="container">
    <transition name="fade">
      <div v-show="show" class="blockHash">
        <div class="head" >
          <div class="hbutton">
            <el-button size="mini" @click="retrospect">追溯</el-button>
            <el-button size="mini" class="button" @click="query">校验</el-button>
          </div>
          <h4>区块信息</h4>
        </div>
        <div class="detail">
          <ul class="ul">
            <div v-for="item in blockHash" :key="item">
              <hr style="height:1px;border:none;border-top:1px solid 	#C8C8C8;" />
              <li>{{item.key}}: {{item.value}}</li>
            </div>
            <hr style="height:1px;border:none;border-top:1px solid 	#C8C8C8;" />
          </ul>
        </div>
        <div class="head">
          <h4>交易信息</h4>
        </div>
        <div class="detail">
          <ul class="ul">
            <div v-for="item in trading" :key="item">
              <hr style="height:1px;border:none;border-top:1px solid 	#C8C8C8;" />
              <li>{{item.key}}: {{item.value}}</li>
            </div>
            <hr style="height:1px;border:none;border-top:1px solid 	#C8C8C8;" />
          </ul>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div v-show="!show" class="ascend">
        <div class="backButton">
          <el-button size="mini" @click="back">返回</el-button>
        </div>
        <div class="ascendContent">
          <div class="left" @click="tabClick('left')">结算单</div>
          <div class="middle" @click="tabClick('middle')">进项发票</div>
          <div class="right" @click="tabClick('right')">应付发票</div>
        </div>
        <div class="noticeContent">
          <div class="leftContent" v-show="showLeft">
            <span class="leftTriangle"></span>
            <ul class="leftUl">
              <li :key="item" v-for="item in upstream">{{item.key}}: {{item.value}}</li>
            </ul>
          </div>
          <div class="rightContent" v-show="showRight">
            <span class="rightTriangle"></span>
            <ul class="rightUl">
              <li :key="item" v-for="item in blockHash">{{item.key}}: {{item.value}}</li>
              <li :key="item" v-for="item in trading">{{item.key}}: {{item.value}}</li>
            </ul>
          </div>
          <div class="middleContent" v-show="showMiddle">
            <span class="middleTriangle"></span>
            <span class="close" @click="close" v-show="showIncomeDetail"></span>
            <ul class="middleUl" v-show="!showIncomeDetail">
              <li title="请点击" :key="item" v-for="item in middleHash" @click="getDetail(item)">区块哈希值: {{item.blockHash}} <br>发票号：{{item.invoiceNo}}</li>
            </ul>
            <ul class="middleUl1" v-show="showIncomeDetail">
              <li :key="item" v-for="item in incomeHash">{{item.key}}: {{item.value}}</li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  props: {
    hashForm: Map,
    setId: Number,
    rowHash: {}
  },
  data () {
    return {
      showLeft: false,
      showMiddle: false,
      showRight: true,
      middleHash: [],
      labelPosition: 'right',
      blockHash: [],
      trading: [],
      upstream: [],
      show: true,
      incomeHash: [],
      showIncomeDetail: false,
      settlementId: ''
    }
  },
  watch: {
    hashForm: function (newHashForm) {
      this.blockHash = []
      this.trading = []
      if (newHashForm.length > 0) {
        for (var i = 0; i < 4; i++) {
          this.blockHash.push(newHashForm[i])
        }
        for (i = 4; i < newHashForm.length; i++) {
          this.trading.push(newHashForm[i])
        }
        this.showLeft = false
        this.showMiddle = false
        this.showRight = true
        this.showIncomeDetail = false
      }
    }
  },
  components: {
  },
  created () {
    if (this.hashForm.length > 0) {
      for (var i = 0; i < 4; i++) {
        this.blockHash.push(this.hashForm[i])
      }
      for (i = 4; i < this.hashForm.length; i++) {
        this.trading.push(this.hashForm[i])
      }
    }
    
  },
  methods: {
    close () {
      this.showIncomeDetail = false
    },
    getDetail (item) {
      let vm = this
      this.$root.ajaxData(`/purchase/tms/invoice/getChainMsg?invoiceNo=${item.invoiceNo}`, {}, function (data) {
        vm.showIncomeDetail = true
        vm.incomeHash = data.data
        vm.settlementId = item.id
      }, 'GET')
    },
    tabClick (tab) {
      let vm = this
      if (tab === 'left') {
        if (!this.settlementId) {
          this.$message({
            message: '请先点击进项发票，获取进项发票详情',
            type: 'warning'
          })
          return
        } else {
          this.showLeft = true
          this.showMiddle = false
          this.showRight = false
          this.$root.ajaxData(`/purchase/tms/invoice/traceBack?invoiceId=${this.settlementId}`, {}, function (data) {
            vm.upstream = data.data
          }, 'GET')
        }
      } else if (tab === 'middle') {
        this.showLeft = false
        this.showMiddle = true
        this.showRight = false
        // if (!this.middleHash.length) {
          this.$root.ajaxData(`/purchase//invoice/payment/get/inputInvoice?seller=${this.rowHash.companyName}&settleCode=${this.rowHash.settleCode}&money=${this.rowHash.moneyAmount}`, {}, function (data) {
            vm.middleHash = data.mate.rows
          }, 'GET')
        // }
      } else if (tab === 'right') {
        this.showLeft = false
          this.showMiddle = false
          this.showRight = true
      }
    },
    query () {
      var vm = this
      const id = this.setId
      var str = this.hashForm[5].key
      var poy = this.hashForm[5].value
      if (str.indexOf("结算单明细行") != -1 || str.indexOf("发票明细行") != -1 || str.indexOf("应付发票明细行") != -1) {
        this.$root.ajaxData('/purchase/settlement/line/hash/'+ id +'?chainHash='+ poy, {}, function (data) {
          if(data){
            vm.$message({
            message: '检验成功',
            type: 'success'
           })
          }else{
            vm.$message({
            message: '检验失败',
            type: 'success'
           })
           return
          }
        }, 'GET')
      }
    },
    retrospect () {
      this.show = false
    },
    back () {
      this.show = true
    }
  },
  computed: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style type="text/css" scoped lang="scss">
  .container {
    position: relative;
    min-height: 300px;
  }
  .ul {
    display: inline-block;
    vertical-align: top;
    width: 90%;
    overflow: hidden;
  }
  .ul li {
    list-style: none;
    margin: 10px 0;
  }
  .ul li span {
    display: inline-block;
    width: 90%;
    text-align: right;
  }
  .head {
    margin-top: -30px;
    color: #20a0ff;
  }
  .hbutton{
    position: absolute;
    right: 20px;
    top: -15px;
  }
  .backButton{
    position: absolute;
    right: 0px;
    top: -65px;
  }
  .fade-enter-active, .fade-leave-active {
    transition: all .4s;
  }
  .fade-enter, .fade-leave-active {
    opacity: 0;
  }
  .ascend {
    position: relative;
  }
  .left, .right , .middle{
    position: absolute;
    width: 80px;
    height: 30px;
    border-radius: 5px;
    background-color: #20a0ff;
    line-height: 30px;
    text-align: center;
    color: #fff;
    cursor: pointer;
  }
  .right {
    right: 50px;
  }
  .left {
    left: 50px;
  }
  .middle {
    left: 50%;
    transform: translateX(-50%);
  }
  .hr {
    position: absolute;
    width: 50%;
    height: 5px;
    background-color: #20a0ff;
    top: 12px;
    left: 25%;
  }
  .ascendContent {
    position: relative;
  }
  .rightContent {
    padding-top: 50px;
    .rightUl {
      list-style: none;
      border: 1px solid #20a0ff;
      margin: 0;
      padding: 10px;
      box-shadow: 1px 1px 1px 1px #20a0ff;
      border-radius: 5px;
      li {
        padding-top: 8px;
        padding-bottom: 8px;
        border-bottom: 1px solid #ccc;
      }
    }
    .rightTriangle {
      display: block;
      position: absolute;
      width: 15px;
      height: 15px;
      background-color: #fff;
      border-top: 1px solid #20a0ff;
      border-left: 1px solid #20a0ff;
      top: 42px;
      right: 80px;
      transform: rotate(45deg);
    }
  }
  .leftContent {
    padding-top: 50px;
    .leftUl {
      list-style: none;
      border: 1px solid #20a0ff;
      margin: 0;
      padding: 10px;
      box-shadow: -1px 1px 1px 1px #20a0ff;
      border-radius: 5px;
      li {
        padding-top: 8px;
        padding-bottom: 8px;
        border-bottom: 1px solid #ccc;
        overflow: hidden;
      }
    }
    .leftTriangle {
      display: block;
      position: absolute;
      width: 15px;
      height: 15px;
      background-color: #fff;
      border-top: 1px solid #20a0ff;
      border-left: 1px solid #20a0ff;
      top: 42px;
      left: 80px;
      transform: rotate(45deg);
    }
  }
  .middleContent {
    padding-top: 50px;
    .close {
      position: absolute;
      display: block;
      width: 20px;
      height: 1px;
      right: 10px;
      top: 60px;
      cursor: pointer;
    }
    .close:before {
      position: absolute;
      display: block;
      content: ' ';
      width: 20px;
      height: 1px;
      background-color: #333;
      transform: rotate(45deg);
    }
    .close:after {
      position: absolute;
      display: block;
      content: ' ';
      width: 20px;
      height: 1px;
      background-color: #333;
      transform: rotate(135deg);
    }
    .middleUl {
      list-style: none;
      border: 1px solid #20a0ff;
      margin: 0;
      padding: 10px;
      box-shadow: 0px 1px 1px 1px #20a0ff;
      border-radius: 5px;
      li {
        padding-top: 8px;
        padding-bottom: 8px;
        border-bottom: 1px solid #ccc;
        cursor: pointer;
      }
      li:hover {
        color: #20a0ff;
      }
    }
    .middleUl1 {
      list-style: none;
      border: 1px solid #20a0ff;
      margin: 0;
      padding: 10px;
      box-shadow: 0px 1px 1px 1px #20a0ff;
      border-radius: 5px;
      li {
        padding-top: 8px;
        padding-bottom: 8px;
        border-bottom: 1px solid #ccc;
      }
    }
    .middleTriangle {
      display: block;
      position: absolute;
      width: 15px;
      height: 15px;
      background-color: #fff;
      border-top: 1px solid #20a0ff;
      border-left: 1px solid #20a0ff;
      top: 42px;
      left: 49%;
      transform: rotate(45deg);
    }
  }
</style>