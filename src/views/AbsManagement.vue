<template>
 <div class="mainClass">
   <el-row>
    <el-col :span="12" class="header"> </el-col>
    <el-col :span="5" class="headerOther">
      <el-button type="text" icon="el-icon-back" @click="goBack">返回</el-button>
    </el-col>
   </el-row>
  <div class="title">
    <h1>Q&A</h1>
  </div>
  <div class="content">
    <h4>Q：什么是ABS？</h4>
    <p>A：是资产证券化的简称，以特定基础资产或资产组合所产生的现金流为偿付支持，通过结构化方式进行信用增级，在此基础上发行资产支持证券的业务活动。</p>
    <h4>Q：ABS太复杂了听不懂，ABS对我（供应商）有什么作用？</h4>
    <P>A：这是一种通过多个金融机构参与并发行的产品，欣旺达作为牵头人会搭建好该平台，贵司只用简单参与进来即可，可获得超低成本（年化4%~8%)的应收账款融资，如遇政府贴息可能更低。这种方式具有成本低，能出表，不上征信，方便快捷，是拓展融资渠道的好帮手。</P>
    <h4>Q：ABS如何参与呢？</h4>
    <p>A：联系方式如下图，期待与您面谈。</p>
    <div class="contactInfo">
      <p>联系人：</p>
      <p>深圳前海点金保理有限公司</p>
      <p>高烟生 电话/微信：136 3280 0111</p>
      <p>申晓华 电话/微信：135 4402 1941</p>
    </div>
  </div>
  </div>
</template>
<script>
export default {
   methods:{
     toSccp(){
       window.open('https://sccp.dianliantech.com')
     },
     goBack(){
       this.$router.go(-1)
     }
   }
}
</script>
<style scoped lang="scss">
.mainClass{
  width: 100%;
  height: 100%;
  overflow: auto;
  }
.title{
  text-align: center
}
.content{
  margin:0 auto;
  font-size: 18px;
  width: 60%;
  overflow: hidden;
  .contactInfo {
    width: 40%;
    font-size: 16px;
    border:1.5px dashed #F00;
    margin-bottom: 10px;
    padding-left: 5px;
  }
}
.header {
  height: 100px;
  line-height: 60px;
  color:#fff;
  // background-image: url('../assets/images/bg_title.png');
  // background-repeat:no-repeat;
  background-position: 50%;
}
.headerOther{
  height: 100px;
  line-height: 160px;
  margin-left: 25%;
}
.back{
  // line-height: 60px;
  color:#fff;
  background-image: url('../assets/images/fanhui.png');
  background-repeat:no-repeat;
  background-size: 10% 100%;
}
::-webkit-scrollbar{
    display:none;
}
</style>
