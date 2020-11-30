<!-- created by zhongxiaolong on 2019/12/07 -->
<!-- 参数设置 BaseConfig -->
<template>
  <div class="config_wrapper">
    <!-- 头部button Start-->
    <el-row class="header_btns">
      <h-btn @click="handleBtns" :btns="['提交']"/>
    </el-row>
    <!-- 头部button End-->
    <!-- 头部Form Start-->
    <el-row class="config_form">
      <el-form ref="form" 
               size="mini" 
               :model="values">
        <template v-for="(field,index) in checkbox">
          <el-col :xs="24" :sm="12" :key="index">
            <el-form-item :prop="field.name">
              <el-checkbox v-model="checkDates[field.name]" @change="handleChange(checkDates[field.name], field.name)">{{field.label}}</el-checkbox>
            </el-form-item>
          </el-col>
        </template>
      </el-form>
    </el-row>
    <!-- 头部Form End-->
  </div>
</template>

<script>
import SERVICES from "@/services";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    HBtn: function index(resolve){
      require(["@/components/Button/HBtn.vue"], resolve);
    }
  },
  props: {
    mate: Object
  },
  data() {
    return {
      modules: 'BaseConfig',
      checkDates: {},
      headerId: null,
    };
  },
  computed: {
    ...mapGetters({
      checkbox: 'BaseConfig/checkbox',
      values: 'BaseConfig/values',
    })
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    ...mapActions({
      initList:'BaseConfig/initList',
      handleSave:'BaseConfig/handleSave',
      handleCheckbox:'BaseConfig/handleCheckbox',
    }),
    /** 数据初始化
     * 初始化新增修改页面的数据
     * @param void
     * @return void
     */
    init() {
      // this.initList();
      const _this = this;
      SERVICES.BASE_CONFIG.initList().then(res =>{
        if(res.data && res.data.statusCode === 200){
          // commit(TYPES.INIT_MAIN_LIST, res.data)
          this.$store.dispatch('BaseConfig/initList', res.data);
          // 参数设置 勾选 '销售订单是否允许手工输入价格'
          let Data = res.data.data
          if (Data.length) {
            Data.forEach(item => {
              if (item.parameter === 'saleOrderInputPriceFlag' && item.parameterVal === 1) {
                localStorage.setItem('allowInputPrice', true)
              }
            })
          }
        }
      }).then(() =>{
        _this.checkDates = {..._this.values}
      })
    },
    /** 头部按钮事件
     * @param {String} name 按钮名称
     * @return {Function} 按钮事件
     */
    handleBtns(name) {
      const btnEvents = {
        // 提交按钮
        submit: () => this.handleSubmit(),
        // 默认
        default: () => { return }
      }
      return (btnEvents[name] || btnEvents.default)();
    },
    /**
     * 提交表单数据
     * @param void
     * @return void
     */
    handleSubmit() {
      this.handleSave(this.init);
      localStorage.removeItem('allowInputPrice')
    },
    /**
     * 提取提交和保存
     * 需要传给后台的数据
     * @params void
     * @return {Object} mate 头部数据和行数据
     */
    saveData () {
      let values = this.values;
      return values;
    },
    /** change 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return {Function} change操作函数
     */
    handleChange(val, name) {
      this.handleCheckbox({value: val,name: name});
      localStorage.removeItem('allowInputPrice')
    }
  },
  watch: {
    mate: function (newMate) {
      this.init();
    }
  }
};
</script>
<style scoped lang="scss">
  .config_wrapper{
    width: 500px;
    margin: 10px auto;
  }
  .config_form {
    position: relative;
    /deep/ .el-form{
      // position: absolute;
      // left: 50%;
      // transform: translateX(-50%);
      margin: 10px auto;
      .el-form-item{
        margin: 0px 0px 10px 0px;
      }
    }
  }
</style>

