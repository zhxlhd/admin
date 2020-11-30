<template>
  <div class="container">
    <transition name="fade">
      <div v-show="show" class="blockHash">
        <div class="head" >
          <div class="hbutton">
            <el-button size="mini" @click="retrospect" v-show="retrospectShow">追溯</el-button>
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
          <div class="left" @mouseover="mouseOver1" @mouseout="mouseOut1">结算单</div>
          <!-- <div class="hr"></div> -->
          <div class="right">{{hashTitle}}</div>
        </div>
        <div class="noticeContent">
          <div class="leftContent" v-show="!showContent">
            <span class="leftTriangle"></span>
            <ul class="leftUl">
              <li :key="item" v-for="item in upstream">{{item.key}}: {{item.value}}</li>
            </ul>
          </div>
          <div class="rightContent" v-show="showContent">
            <span class="rightTriangle"></span>
            <ul class="rightUl">
              <li :key="item" v-for="item in blockHash">{{item.key}}: {{item.value}}</li>
              <li :key="item" v-for="item in trading">{{item.key}}: {{item.value}}</li>
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
    hashTitle: String,
    retrospectShow: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      showContent: true,
      labelPosition: 'right',
      blockHash: [],
      trading: [],
      upstream: [],
      show: true
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
    mouseOver1 () {
      let vm = this
      this.showContent = false
      // 如果没有值就获取，有值就不用获取
      if (!this.upstream.length) {
        this.$root.ajaxData(`/purchase/tms/invoice/traceBack?invoiceId=${this.setId}`, {}, function (data) {
          vm.upstream = data.data
        }, 'GET')
      }
    },
    mouseOut1 () {
      this.showContent = true
    },
    retrospect () {
      this.show = false
    },
    back () {
      this.show = true
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
            message: '数据未被篡改',
            type: 'success'
           })
          }else{
            vm.$message({
            message: '数据被篡改',
            type: 'success'
           })
           return
          }
        }, 'GET')
      }else if ((this.hashForm[8].key).indexOf("AP发票明细行") != -1) {
        this.$root.ajaxData('/purchase/invoice/payment/line/hash/'+ id +'?chainHash='+ this.hashForm[8].value, {}, function (data) {
          if(data){
            vm.$message({
            message: '数据未被篡改',
            type: 'success'
           })
          }else{
            vm.$message({
            message: '数据被篡改',
            type: 'success'
           })
           return
          }
        }, 'GET')
      }else {
        if ((this.hashForm[13].key).indexOf("发票明细") != -1) {
        this.$root.ajaxData('/purchase/tms/invoice/checkInvoiceDetailHash?invoiceId='+ id +'&oldHash=' + this.hashForm[13].value, {}, function (data) {
          if(data.statusCode === 200){
            vm.$message({
            message: '数据未被篡改',
            type: 'success'
           })
          }else{
            vm.$message({
            message: '数据被篡改',
            type: 'success'
           })
           return
          }
        }, 'GET')
      }
    }
  }}
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
  .left, .right {
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
</style>