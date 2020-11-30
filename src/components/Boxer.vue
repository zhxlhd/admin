<template>
  <div class="box">
    <el-row>
      <el-col :span="24">
        <div class="btnContent" :class="{ btnblock: isActive }" >
          <div class="left" v-if="btnShow">
            <k-btn v-for="btn of mate.btns" 
              :word="word" 
              :act="btn" 
              :hasSelected="hasSelected" 
              :disabled="btnDisable" 
              :plain="true" 
              :loading="btn.loading" 
              @action="handleButton" 
              @actionDropdown="handleButtonDropdown"
              :key="btn.id"
              ></k-btn>
          </div>
          <div class="left">
            <slot name="searchForm" ></slot>
          </div>
          <div class="right">
            <slot name="configure"></slot>
          </div>
        </div>
      </el-col>
    </el-row>
    <slot name="main"></slot>
  </div>
</template>

<script>
export default {
  components: {
    KBtn: function index (resolve) {
      require(['./KBtn.vue'], resolve)
    }
  },
  data () {
    return {
      word: true
    }
  },
  props: {
    mate: Object,
    mateSearch: Object,
    hasSelected: Boolean,
    msgBoxButton: Boolean,
    btnDisable: Boolean,
    isShow:Boolean
  },
  computed: {
    isActive () {
      return (true);
    },
    btnShow () {
      return (this.mate && this.mate.btns && this.mate.btns.length>0);
    },
    searchBtnShow () {
      return (this.mateSearch && this.mateSearch.multipleConditions || this.mateSearch);
    }
  },
  created () {
  },
  methods: {
    handleButton (btn) {
      this.$emit('action', btn)
    },
    handleButtonDropdown (btn) {
      this.$emit('actionDropdown', btn)
    },
    userDefined () {
      this.$emit('userDefined')
    }
  }
}
</script>

<style scoped>
  .main-block .box {
      clear: both;
      overflow: hidden;
      transition: height .2s;
  }

  .btnblock {
    margin: 14px 0;
    /* padding: 10px 24px 15px 0px !important; */
    overflow: hidden;
    /* border-bottom: 1px solid #eff2f6; */
  }

  .leftprepare{
    float: left;
    margin-bottom: 10px;
  }
  .left{
    float: left;
    margin-right: 10px;
  }
  .btnContent {
    position: relative;
    /* margin-top: -20px; */
  }
  .right{
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%)
  }
  .el-button{
    margin-bottom: 5px;
  }
</style>
