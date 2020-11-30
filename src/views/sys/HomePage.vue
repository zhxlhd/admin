<template>
  <div style="height: 500px">
    <el-form :model="mate.values" >
      <el-row :gutter="20" v-if="show">
        <div class = "box">
          <el-col :xs="12" :sm="6" :md="6" :lg="6">
            <el-card style="background-color:#fe8485;margin-left:5%" class="title-card" :label="objectColumns['newOrder'].label" :prop="objectColumns['newOrder'].name" :width="objectColumns['newOrder'].width"  >
              <div class="clearfixNum" >
                <span >{{noteMessage1['newOrder']}}</span>
              </div>
              <div  class="clearfixTitle" >
                <span >{{objectColumns['newOrder'].label}}</span>
              </div>
              <span><img src="../../assets/images/ic_car.png" class="clearfixImg"></span>
            </el-card>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :lg="6">
            <el-card style="background-color:#6db6e2;margin-left:5%" class="title-card"  :label="objectColumns['newMessage'].label" :prop="objectColumns['newMessage'].name" :width="objectColumns['newMessage'].width"  >
              <div  class="clearfixNum" >
                <span >{{noteMessage1['newMessage']}}</span>
              </div>
              <div  class="clearfixTitle" >
                <span >{{objectColumns['newMessage'].label}}</span>
              </div>
              <span ><img src="../../assets/images/ic_news.png" class="clearfixImg"></span>
            </el-card>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :lg="6">
            <el-card style="background-color:#5cd39a;margin-left:5%" class="title-card"  :label="objectColumns['newSupplier'].label" :prop="objectColumns['newSupplier'].name" :width="objectColumns['newSupplier'].width"  >
              <div  class="clearfixNum" >
                <span >{{noteMessage1['newSupplier']}}</span>
              </div>
              <div  class="clearfixTitle" >
                <span >{{objectColumns['newSupplier'].label}}</span>
              </div>
              <span><img src="../../assets/images/ic_supplier.png" class="clearfixImg"></span>
            </el-card>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :lg="6">
            <el-card style="background-color:#8dd2c4;margin-left:5%" class="title-card"  :label="objectColumns['newCustomer'].label" :prop="objectColumns['newCustomer'].name" :width="objectColumns['newCustomer'].width"  >
              <div  class="clearfixNum" >
                <span >{{noteMessage1['newCustomer']}}</span>
              </div>
              <div  class="clearfixTitle" >
                <span >{{objectColumns['newCustomer'].label}}</span>
              </div>
              <span><img src="../../assets/images/ic_customer.png" class="clearfixImg"></span>
            </el-card>
          </el-col>
        </div>
      </el-row>
      <el-row :gutter="10" v-if="show">
        <div class="box">
          <el-col :xs="12" :sm="6" :md="6" :lg="6" v-for="(title,index) in mate.fields"      v-bind:key="title.name+index"  :label="title.label" :prop="title.name" :width="title.width"  v-bind:index="index">
            <el-card :class="title.class">
              <div slot="header" class="clearfix" >
              <span >{{title.label}}</span>
              </div>
              <div class="text item" >
                <el-row width="100%">
                  <el-col :xs="24" :sm="24" :md="12" :lg="12">
                    <div class="childrenTitleLeft">{{title.children[0].label}}</div>
                    <span  @click="clickRecived(title.children[0].url)" style="font-size:30px; color:white; cursor:pointer;text-align:center" >{{noteMessage1[title.children[0].name]}}</span>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12">
                    <div class="childrenTitleRight">{{title.children[1].label}}</div>
                    <span  @click="clickRecived(title.children[1].url)" style="font-size:30px; color:white; cursor:pointer;text-align:center" >{{noteMessage1[title.children[1].name]}}</span>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </el-col>
        </div>
      </el-row>
      <!-- <el-row :gutter="10">
        <el-col :xs="8" :sm="6" :md="4" :lg="12" >
        <round-chart class='myChart'></round-chart>
        </el-col>
        <el-col :xs="8" :sm="6" :md="4" :lg="12" >
            <line-chart></line-chart>
        </el-col>
      </el-row> -->
    </el-form>
  </div>
</template>
<script>
import { SSE_SERVER } from '@/config/index.js'
import lineChart from './lineChart'
import roundChart from './roundChart'
export default {
  data () {
    return {
      object: {},
      objectColumns: {},
      monthdata: [],
      sseStatus: 0,
      collapsed: true,
      className: 'chart',
      width: '50%',
      height: '350px',
      noteMessage: [],
      noteMessage1: [],
      show: false
    }
  },
  components: {
    lineChart,
    roundChart
  },
  props: {
    mate: Object
  },
  mounted () {
  },
  created () {
    this.mate.treeDataLoad.map((i) => { this.objectColumns[i.name] = i })
    this.mate.fields.map((i) => { this.object[i.name] = i })
    // this.setupStream()
  },
  methods: {
    clickRecived (val) {
      this.$root.monitor({ url: val })
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
        const eventSource = new window.EventSource(url, { withCredentials: true })
        eventSource.onopen = function (e) {
          console.log('sse success')
          // 判断是否触发成功, 若成功则不再触发
          if (!vm.sseStatus) {
            vm.$root.ajaxData('/inventory/homePage', {}, function (data) {
              // vm.sseStatus = data.status
            }, 'GET')
          }
        }
        eventSource.onmessage = function (event) {
          vm.noteMessage = JSON.parse(event.data)
          if (vm.noteMessage.dataCategory === 'homePage') {
            vm.noteMessage1 = vm.noteMessage.data
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
    }
  }
}
</script>
<style scoped>
.box {
  position: relative;
  right: 10px;
}
  .text {
    font-size: 28px;
    text-align: center;
  }
  .item {
    margin-bottom: -10px;
    font-size:15px;
    text-align: center
  }
  .clearfix {
   font-size: 20px;
   margin-bottom:-10px
  }
  .childrenTitleLeft{
    margin-bottom: 15px;
  }
  .childrenTitleRight{
    margin-bottom: 15px;
  }
  .clearfixNum {
    font-size:35px; 
    color:white; 
  }
  .clearfixTitle{
    margin-top: 40px;
    color:white;
  }
  .clearfixImg{
    margin-top:-75px;
    float:right;
    max-width: 100%;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
    font-size: 25px;
  }
  .clearfix:after {
    clear: both
  }
  .title-card{
    width: 95%;
    height:100px;
    float: left;
    margin:30px 10px 20px 60px;
    z-index:10;
  }
  .box-card {
    width: 95%;
    height:180px;
    float: left;
    color: white;
    margin:30px 10px 20px 5%;
    background-color:#329dea;
    z-index:10;
  }
   .box-cardShow {
    width: 95%;
    height:180px;
    float: left;
    color: white;
    margin:30px 10px 20px 5%;
    background-color:#7bc5ef;
    z-index:10;
  }
  .el-card__header{
    border-bottom:0px
  }
  .el-card__body {
    padding: 20px 40px 0 40px; 
  }
  .weather{
    margin-top:25px;
    width: 45%;
    height: 300px;
    float: right;
    margin-right:6px;
  }
  .weatherItemTitle{
    margin-left: 100%;
    margin-bottom: 40%
  }
  .weatherTitle{
    height: 145px;
    background-color:#39A4EB;
    font-size: 20px;
    color:white;
  }
  .weatherItemNum{
    font-size:20px; 
    color:#20A0FF; 
    cursor:pointer;
    margin-left:100%;
  }
  .weatherItem{
    height: 145px;
    margin-top:30px;
  }
  .myChart{
    margin-left: 55px
  }
</style>
