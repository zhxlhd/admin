<!-- created by fengjing on 2020/05/19 -->
<!-- 在线购买详情 -->
<template>
    <div class="mainDiv">
    <el-row class="search">
      <el-col :sm="24" :md="12" :lg="18">
        <el-badge :value="count" class="badgeItem">
          <el-button size="mini" icon="el-icon-shopping-cart-full" @click="toMyCar"> 我的购物车</el-button>
        </el-badge> 
      </el-col>
    </el-row>
      <div class="goodDetail">
        <el-row>
        <div class="detail">
          <div class="img">
            <div class="img-big">
              <img :src="bigImg || require('@/assets/images/defaultImg.png')" width="320" height="320" :bigsrc="bigImg" :configs="configs"></img>
            </div>
            <div class="img-small">
              <div class="button">
                <el-button  type="text" icon="el-icon-arrow-left" @click="reducePageNum" v-if="imgPageNum > 1 "></el-button>
              </div>
              <div class="img" v-for="(item,index) of currentImgList" :key="index" v-show="detail.imgList ? item : null" @click="changeImg(detail.imgList ? item : null)">
                <img :src="detail.imgList ? item : null"/>
              </div>
              <div class="button">
                <el-button class="button" type="text" icon="el-icon-arrow-right" v-if="imgTotal > 0 && imgPageNum < imgTotal" @click="changePageNum"></el-button>
              </div>
            </div>
          </div>
          <div class="detail-msg">
            <p class="name">{{detail.name}}</p>
            <p><span>价格</span><span class="price">{{detail.currency === 'USD' ? '$' : '￥'}}{{detail.priceWithTax}}</span></p>
            <p><span>规格</span>{{detail.specification}}</p>
            <p><span>单位</span>{{detail.unitName}}</p>
            <!--<p><span>产品编码</span>{{detail.code}}<span></span></p>-->
            <p><span>商品编码</span>{{detail.code}}<span></span></p>
            <!--<p><span>税率</span><span>{{detail.tax}}</span></p>-->
            <p><span>数量</span><span class="reduce" @click="reduce" v-show="purchaseNum !== 1">-</span><input v-model="purchaseNum" type="text" @blur="blurNum"><span class="add" @click="add">+</span>{{detail.unit}}</p>
            <div class="button">
              <button @click="addShoppingCar">加入购物车</button>
            </div>
          </div>
          <!-- <div class="aside">
            <div :data="similar">
              <div slot="name" class="aside-name">相似商品</div>
            </div>
          </div> -->
        </div>
        </el-row>
        <div class="content-bottom">
           <div class="content-left">
            <div class="company-msg">
              <el-button type="text" >{{detail.supplierName}}</el-button>
            </div>
            <div class="other">
             <el-button size="mini" type="primary" icon="el-icon-s-home" @click="goHome">进店逛逛</el-button>
            </div>
          </div>
          <div class="content-right">
            <h1>
              <ul>
                <li >商品信息</li>
                <!-- <li>商品附件</li> -->
              </ul> 
            </h1>
            <div class="particular-msg">
              <h3>详细信息</h3>
              <p class="particular-detail" v-html="detail.description">{{detail.description}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
import SERVICES from '@/services';
import { mapGetters, mapActions } from "vuex";
export default {
  props: { // 父组件传参
    mate: Object,       // 基础数据
  },
  data(){
    return{
      id: this.$store.state.JHWShopping['goodId'],
      bigImg: "",
      detail: {},
      companyMsg: {
        "name": "吉海湾"
      },
      searchValues: "",
      listUrl: '/common/toList', // 元数据接口
      params: '?listName=jhw_buy_online',  // 详情参数
      carParams: '?listName=jhw_buy_car',  // 购物车参数
      purchaseNum: 1,
      configs: {
        width: 320,
        height: 320,
        maskWidth: 100,
        maskHeight: 100,
        maskColor: 'blue',
        maskOpacity: 0.2
      },
      count: 0,
      imgTotal: 0,
      imgPageNum: 1,
      imgPageSize: 3,
      imgList: [], //返回所以图片
      currentImgList: [] //分页当前取值图片
    }
  },
  computed: {
  },
  created(){
    
  },
  mounted(){
    this.getGoodDetail(this.id)
    this.getAllCount()
  },
  methods: {
    /**
     * 图片分页减少页数
     */
    reducePageNum(){
      this.imgPageNum -= 1
      this.setCurrentPageData()
    },
    /**
     * 图片分页切换页数
     */
    changePageNum(){
      this.imgPageNum += 1
      this.setCurrentPageData()
    },
    /**
     * 切换图片 将小图片切换为大图片
     */
    changeImg(val){
      this.bigImg = val
    },
    /**
     * 获取商品信息
     * @param {String} id
     * 商品id
     */
    getGoodDetail(id){
      let _this = this
      SERVICES.JHW_GOOD_PRICE.getGoodDetail(id).then(res=>{
        if(res.data.code === 200){
          if(res.data.data.pictureUlrs){
              res.data.data.imgList = res.data.data.pictureUlrs.split(',')
            } else {
              res.data.data.imgList = []
            }
          _this.detail = res.data.data
          _this.bigImg = _this.detail.imgList[0]
          _this.imgList = _this.detail.imgList
          _this.imgTotal = Math.ceil(_this.imgList.length / _this.imgPageSize);
          _this.setCurrentPageData()
          // 计算得0时设置为1
          _this.imgTotal = _this.imgTotal == 0 ? 1 : _this.imgTotal;
        }
      })
    },
    /**
     * 图片分页
     */
    setCurrentPageData() {
      let begin = (this.imgPageNum - 1) * this.imgPageSize;
      let end = this.imgPageNum * this.imgPageSize;
      this.currentImgList = this.imgList.slice(
          begin,
          end
      );
    },
    // 用户填写数量的判断
    blurNum () {
      if (!String(this.purchaseNum).match(/^\d+$/)) {
        this.purchaseNum = 1
      }
    },
    // 减数量
    reduce () {
      if (this.purchaseNum === 1) {
        return
      }
      this.purchaseNum -= 1
    },
    // 加数量
    add () {
      this.purchaseNum += 1
    },
    /**
     * 加入购物车
     * @param {Object} data
     * 商品信息
     */
    addShoppingCar(){
      let _this = this
      let param = {}
      param.productId = this.id
      param.count = this.purchaseNum
      SERVICES.JHW_GOOD_PRICE.addShoppingCar(param).then(res=>{
        if(res.data.code === 200){
          _this.$store.dispatch("JHWShopping/addCount",this.purchaseNum)
          _this.$message.success("添加成功");
          _this.getAllCount();
        }
      })
    },
    /**
     * 进店逛逛
     */
    goHome(){
      this.$root.monitor({ url: `${this.listUrl}${this.params}` });
    },
    /**
     * 我的购物车 
     */
    toMyCar(){
      this.$root.monitor({ url: `${this.listUrl}${this.carParams}` });
    },
    /**
     * 搜索
     * @param {String} data
     * 搜索输入框填写信息
     */
    searchGood(data){
      SERVICES.JHW_GOOD_PRICE.searchGood().then(res=>{
        if(res.data.code === 200){

        } else {

        }
      })
    },
    /**
     * 获取购物车总数量
     * @param {Void}
     */
    getAllCount(){
      let _this = this
      SERVICES.JHW_GOOD_PRICE.getAllCount().then(res=>{
        if(res.data.code === 200){
          _this.count = res.data.data
        }   
      })
    },
  },
  watch: {
    mate: function (val, oldVal) {
      this.getGoodDetail(this.id)
      this.getAllCount()
    }
  }
}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
.companyDetail{
  margin-top: 10px;
}
.mainDiv{
  width: 100%;
}
.search{
  text-align: center;
  margin-bottom: 10px;
}
.goodDetail{
  //display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  .detail {
    display: flex;
    width: 100%;
    .img {
      width: 320px;
      height: 100%;
      .img-big {
        width: 320px;
        height: 320px;
        background-color: #eee;
        margin-bottom: 20px;
        overflow: hidden;
        font-size: 0;
        img {
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
      }
      .img-small {
        width: 300px;
        height: 100px;
        overflow: hidden;
        margin: 0 auto;
        .img {
          display: inline-block;
          border: 2px solid #fff;
          width: 80px;
          height: 80px;
          img {
            width: 100%;
            height: 100%;
            cursor: pointer;
          }
        }
        .img:hover {
          border: 2px solid red;
        }
        .button{
          margin-top: -20px;
          display: inline-block;
          height: 80px;
          line-height: 40px;
        }
      }
    }
    .detail-msg{
      margin-top: -20px;
      padding-left: 200px;
      position: relative;
      p {
        height: 30px;
        & > span:first-child {
          display: inline-block;
          width: 150px;
        }
      }
      .name {
        font-size: 25px;
        color: #000;
        margin-bottom: 80px;
      }
      .price {
        font-size: 25px;
        font-weight: bold;
        color:red;
      }
      input {
        width: 100px;
        height: 20px;
        border: 1px solid #ccc;
        text-indent: 5px;
      }
      .reduce, .add {
        display: inline-block;
        width: 18px;
        height: 18px;
        background-color: #bbbbbb;
        text-align: center;
        line-height: 18px;
        color: #fff;
        margin-left: 5px;
        cursor: pointer;
        // @include borderRadius(3px);
      }
      .reduce,.add {
        margin-right: 5px;
      }
      .button {
        position: absolute;
        bottom: 15px;
        width: 100%;
        button {
          width: 140px;
          padding: 10px 30px;
          background-color: #fff;
          // @include borderRadius(3px);
          cursor: pointer;
          border: 1px solid #00a8e3;
        }
        button:first-child {
          background-color: #00a8e3;
          color: #fff;
        }
      }
    }
  }
}
.content-bottom {
  display: flex;
  .company-msg {
    width: 200px;
    margin-bottom: 20px;
    h1 {
      text-align: center;
      padding: 10px 10px;
      font-size: 18px;
      font-weight: bold;
      color: #000;
      border-bottom: 1px solid #ccc;
    }
    div {
      padding: 5px 20px 10px;
      p {
        height: 30px;
      }
      p:last-child {
        text-align: center;
        button {
          padding: 5px 15px;
          background-color: #fff;
          border: 1px solid #ccc;
          // @include borderRadius(4px);
          cursor: pointer;
        }
      }
    }
  }
  .other {
    .aside-name {
      text-align: center;
      padding: 10px 0;
      color: #009ed6;
      border-bottom: 1px solid #ccc;
    }
  }
  .content-right {
    width: 100%;
    margin-left: 50px;
    h1 {
      color:#009ed6;
      border-bottom: 1px solid #ccc;
      padding-bottom: 10px;
      ul > li {
        display: inline-block;
        font-size: 14px;
        padding: 3px 20px;
        cursor: pointer;
        &:hover {
          color:#009ed6
        }
      }
    }
    .params {
      h2 {
        padding: 10px 0 10px 10px;
        color: #000;
        font-weight: bold;
      }
      .params-content {
        background-color: #f9f9f9;
        padding: 10px 20px;
        li {
          display: inline-block;
          width: 33.3333%;
          line-height: 30px;
        }
      }
    }
    .particular-msg {
      width: 960px;
      overflow: hiddne;
      img {
        width: 960px;
      }
      .particular-detail {
        width: 960px;
        overflow: hidden;
      }
      h3 {
        padding: 10px;
        margin-top: 20px;
        color: #000;
        font-weight: 300;
      }
    }
  }
}
.badgeItem{
  float: right;
}
</style>

