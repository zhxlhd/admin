<!-- created by fengjing on 2020/05/19 -->
<!-- 在线购买 -->
<template>
  <div>
    <el-row class="search">
      <el-col :sm="24" :md="12" :lg="12">
        <el-input v-model="searchValues" size="mini" placeholder="输入要搜索的内容" ><el-button slot="append" icon="el-icon-search" type="primary" @click="searchGood"></el-button></el-input>
      </el-col>
      <el-col :sm="24" :md="12" :lg="12">
        <el-badge :value="count" class="item">
          <el-button size="mini" icon="el-icon-shopping-cart-full" @click="toMyCar"> 我的购物车</el-button>
        </el-badge> 
      </el-col>
    </el-row>
    <el-row >
      <div class="head-category">
        <ul>
          <li v-for="(item,index) of categoryHead" :key="index" @click="goDetailCategory(item)">{{item.name}}</li>
        </ul>
      </div>
      <div class="detail-category" v-if="showDetail">
        <span>{{headCategory}}：</span>
        <ul>
          <li v-for="(item,index) of categoryChild" :key="index" @click="goSearch(item)">{{item.name}}</li>
        </ul>
      </div>
    </el-row>
    <el-row class="card">
      <el-col :span="5"  v-for="(items, index) of formLayout" :key="index">
        <el-card class="box-card" :body-style="{ padding: '0px' }">
          <el-image  :src="items.imgList[0] || require('@/assets/images/defaultImg.png')" lazy @click="goDetail(items)" class="image"></el-image>
          <!-- <img :src="items.imgList[0]" class="image" @click="goDetail(items)"> -->
          <div class="productDetail">
            <span class="productName">¥{{items.priceWithTax}}/{{items.unitName}}</span>
            <div class="productMiddle">
              <el-tooltip class="item" effect="dark" :content="items.name" placement="top-start">
                <span>{{items.name | ellipsis}}</span>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="items.specification" placement="top-start">
                <span v-if="items.specification">{{items.specification | ellipsis}}</span>
              </el-tooltip>
            </div>
            <div class="companyName">
              <el-tooltip class="item" effect="dark" :content="items.supplierName" placement="top-start">
                <span>{{items.supplierName | ellipsis}}</span>
              </el-tooltip>
            </div>
            <div style="margin-top: 15px; display: flex; color: #009ed6; float:right">
               <el-input-number  class="inputButton" size="mini" v-model="items.count"  :min="1" ></el-input-number>
               <i class="el-icon-shopping-cart-full"  @click="addShoppingCar($event,items)"></i>
            </div>
          </div>
          </el-card>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" class="page">
      <el-pagination
        background
        :current-page.sync="currentPage"
        :total="total"
        :page-sizes.sync="pageSizes"
        :page-size.sync="pageSize"
        layout="prev, pager, next,sizes,total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        >
      </el-pagination>
    </el-row>
    <!-- <div class="carBall">
      <transition 
        @before-enter="beforeEnter"
        @enter="enter"
        @after-enter="afterEnter"
      >
       <div class="ball" v-show="ball.show">
         <div class="inner">
           <div class="el-icon-shopping-cart-full"></div>
         </div>
       </div>
      </transition>
    </div> -->
  </div>
</template>
<script>
import SERVICES from '@/services';
export default {
  props: { // 父组件传参
    mate: Object,       // 基础数据
  },
  filters: {
    ellipsis (value) {
      if (!value) return ''
      if (value.length > 20) {
        return value.slice(0,30) + '...'
      }
      return value
    }
  },
  data(){
    return {
      formLayout: [],
      searchValues: "",
      carCount: this.$store.state.JHWShopping['goodCount'],
      listUrl: '/common/toList', // 元数据接口
      params: '?listName=jhw_buy_online_detail',  // 详情参数
      carParams: '?listName=jhw_buy_car',  // 购物车参数
      categoryHead: [
        {name: "水果"},
        {name: "蔬菜"},
        {name: "禽类"}
      ],
      purchaseNum: 1,
      queryValues: {
        ifPutOn: '1',
        ifNeedPage: true,
        ifNeedTenantFilter: false,
        ifNeedSetPrice: true
      },
      count: 0,
      headCategory: "水果",
      currentPage: 1,
      total: 0,
      pageSizes:[10,20,30, 40, 50, 100],
      pageSize: 20,
      categoryLevel: 0, // 分类级数
      ball: {
        show: false,
        el: ''
      },
      categoryChild: [],
      showDetail: false
    }
  },
  created () {
    
  },
  mounted () {
    this.getOnline()
    this.getCategoryId()
    this.getAllCount()
  },
  computed: {
  },
  methods: {
    /**
     * 获取子分类
     * 并搜索
     */
    goDetailCategory(item){
      this.categoryChild = this.getDetailChange(this.categoryHead,item)
      this.queryValues.categoryId = item.id
      this.searchGood(this.queryValues)
      if(this.categoryChild.length > 0){
        this.showDetail = true
      } else {
        this.showDetail = false
      }
      this.headCategory = item.name
    },
    /**
     * 子分类点击搜索
     */
    goSearch(item){
      this.queryValues.categoryId = item.id
      this.searchGood(this.queryValues)
    },
    /**
     * size切换 分页
     */
    handleSizeChange(val){
      this.pageSize = val
      this.getOnline()
    },
    handleCurrentChange(val){
      this.currentPage = val
      this.getOnline()
    },
    /**
     * 获取在线购买商品列表
     * @param 
     */
    getOnline(){
      this.queryValues.pageSize = this.pageSize
      this.queryValues.pageNum = this.currentPage
      SERVICES.JHW_GOOD_PRICE.getOnline(this.queryValues).then(res=>{
        if(res.data.code === 200){
          res.data.data.list.forEach(item=>{
            item.count = 1
            if(item.pictureUlrs){
              item.imgList = item.pictureUlrs.split(',')
            } else {
              item.imgList = []
            }
          })
          this.formLayout = res.data.data.list
          this.currentPage = res.data.data.pageNum
          this.total = res.data.data.total
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
    /**
     * 搜索
     * @param {String} data
     * 搜索输入框填写信息
     */
    searchGood(data){
      this.queryValues.name = this.searchValues
      SERVICES.JHW_GOOD_PRICE.getOnline(this.queryValues).then(res=>{
        if(res.data.code === 200){
          res.data.data.list.forEach(item=>{
            item.count = 1;
            if(item.pictureUlrs){
              item.imgList = item.pictureUlrs.split(',')
            } else {
              item.imgList = []
            }
          })
          this.formLayout = res.data.data.list
          this.currentPage = res.data.data.pageNum
          this.total = res.data.data.total
        } else {

        }
      })
    },
    /**
     * 加入购物车
     * @param {Object} data
     * 商品信息
     */
    addShoppingCar($event,data){
      let _this = this
      let param = {}
      param.productId = data.id
      param.count = data.count
      SERVICES.JHW_GOOD_PRICE.addShoppingCar(param).then(res=>{
        if(res.data.code === 200){
          _this.$message.success("添加成功");
          _this.getAllCount();
        } else {
          this.$message({
            type: 'warning',
            message: res.data.message
          })
        }
      })
      this.ball.el = $event.target;
      this.ball.show = true
    },
    /**
     * 跳转详情 
     * @param {Object} data
     */
    goDetail(data){
      this.$store.commit("JHWShopping/setGoodId", data.id)
      this.$root.monitor({ url: `${this.listUrl}${this.params}` });
    },
    /**
     * 我的购物车 
     */
    toMyCar(){
      this.$root.monitor({ url: `${this.listUrl}${this.carParams}` });
    },
    /**
     * 获取商品分类下拉
     * @param void
     * @return {objdet}
     */
    getCategoryId(){
      let _this = this
       this.$root.ajaxData('/agriculture/customerPurchase/getIndustryCategory?industryName=农业', {}, function (data) {
        _this.materialChange(data.data)
        _this.categoryHead = data.data
        _this.categoryLevel = _this.getMaxFloor(data.data)
      }, 'GET')
    },
    materialChange (data) {
      for (const i of data) {
        i.label = i.name
        i.value = i.id
        if (i.children) {
          this.materialChange(i.children)
        }
      }
    },
    getDetailChange (data,item) {
      for (const i of data) {
        if(i.id === item.id) {
          return i.children || []
        } else {
          if(i.children){
            this.getDetailChange(i.children,item)
          }
        }
      }
    },
    getMaxFloor (treeData) {
      let floor = 0
      let v = this
      let max = 0
      function each (data, floor) {
          data.forEach(e => {
              e.floor = floor
              if (floor > max) {
                  max = floor
              }
              if (e.children) {
                  each(e.children, floor + 1)
              }
          })
      }
      each(treeData,1)
      return max
    },
    // /** 
    // *动画开始前
    // */
    // beforeEnter(el){
    //   let dom = this.ball.el
    //   let rect = dom.getBoundingClientRect()
    //   let x = window.innerWidth - rect.left - 60
    //   let y = rect.top - 25
    //   el.style.display = ""
    //   el.style.transform = `translate3D(0,${y}px,0)`

    //   let inner = el.querySelector(".inner")
    //   inner.style.transform = `translate3D(-${x}px,0,0)`
    // },
    // enter(el,done){
    //   let dom = this.ball.el
    //   this._offset = document.body.offsetHeight
    //   el.style.transform = `translate3D(0,0,0)`
    //   let inner = el.querySelector(".inner")
    //   inner.style.transform = `translate3D(0,0,0)`
    //   el.addEventListener('transitionend',done)
    // },
    // afterEnter(el){
    //   this.ball.show= false
    //   el.style.display = "none"
    // }
  },
  watch: {
    mate: function (val, oldVal) {
      this.getOnline()
      this.getCategoryId()
      this.getAllCount()
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
.el-col-5 {
  width: 20%;
}
.box-card{
  width: 90%;
  height: 320px;
  margin-top: 20px;
}
.image{
  width: 100%;
  height: 180px;
}
.productName{
  color: red;
  font-size: 20px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.productMiddle {
  width: 100%;
  display: flex;
  justify-content: space-between;
  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  span:nth-child(2) {
    width: 50%;
  }
}
.companyName {
  margin-top: 15px;
  color: #009ed6;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.el-icon-shopping-cart-full{
  margin-left: 10px;
  padding-top: 8px;
  font-size: 20px;
  cursor:pointer;
}
.productDetail{
  padding: 14px 20px 0 20px;
  font-size: 12px;
}
.search{
  text-align: center;
}
.card{
  margin-bottom: 20px;
}
.head-category{
  border-bottom: 1px solid black;
  font-family: PingFangSC-Regular;
  margin-bottom: 10px;
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
.detail-category{
  border-bottom: 1px solid black;
  ul{
    display: inline;
  }
  ul > li {
    display: inline-block;
    font-size: 10px;
    padding: 0px 20px;
    cursor: pointer;
    &:hover {
      color:#009ed6
    }
  }
}
.carBall{
  .ball{
    position: fixed;
    top: 40px;
    right: 40px;
    color: red;
    transition: all 1s cubic-bezier(0.49, -0.29, 0.75, 1);
  }
  .inner{
    width: 16px;
    height: 16px;
    transition: all 1s linear;
  }
}
.clearfix{
  height: 20px;
}
</style>
