<!--多条件查询-->
<template>
  <div>
    <div class="advanced_query">
      <el-row :gutter="10">
        <el-form 
          ref="queryForm"
          :model="mate.mateSearch.values" 
          :rules="rules" >
          <el-col :sm="item.sm || 8" :md="item.md || 6" :lg="item.lg || 3" v-for="(item,index) in mate.mateSearch.fields" :key="index">
            <el-form-item v-if="item.holder==='select'" :prop="item.name">
              <el-select clearable filterable v-model="mate.mateSearch.values[item.name]" :placeholder="item.placeholder" size="mini">
                <el-option :label="oItem.label" :value="oItem.value" v-for="oItem of item.options" :key="oItem.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="item.holder==='dict'" :prop="item.name">
              <dict-selected v-model="mate.mateSearch.values[item.name]" :dictType="item.dict" :initValue="mate.mateSearch.values[item.name]" :placeholder="item.placeholder"></dict-selected>
            </el-form-item>
            <el-form-item v-if="item.holder==='datePicker'" :prop="item.name">
              <el-date-picker value-format="yyyy-MM-dd" format="yyyy-MM-dd" clearable class="date-picker" size="mini" v-model="mate.mateSearch.values[item.name]" type="date" :placeholder="item.placeholder"></el-date-picker>
            </el-form-item>
            <el-form-item v-if="item.holder==='dateTimer'" :prop="item.name">
              <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" clearable class="date-picker" size="mini" v-model="mate.mateSearch.values[item.name]" type="datetime" :placeholder="item.placeholder"></el-date-picker>
            </el-form-item>
            <el-form-item v-if="item.holder==='dateMonth'" :prop="item.name">
              <el-date-picker value-format="yyyy-MM" clearable class="date-picker" size="mini" v-model="mate.mateSearch.values[item.name]" type="month" :placeholder="item.placeholder"></el-date-picker>
            </el-form-item>
            <el-form-item v-if="item.holder==='text'" :prop="item.name">
              <el-input clearable v-model.trim="mate.mateSearch.values[item.name]" :placeholder="item.placeholder" size="mini"></el-input>
            </el-form-item>
            <el-form-item v-if="item.holder==='cascader'" :prop="item.name">
               <el-cascader size="mini" v-model="mate.mateSearch.values[item.name]"
                filterable
                clearable
                :options="item.options"
                :props="item.configure"
                :placeholder="item.placeholder" 
                ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :sm="10" :md="6" :lg="mate.mateSearch && mate.mateSearch.searchBtnLg || 4">
            <el-form-item>
              <div class="search">
                <!-- 查询 -->
                <el-button size="mini" @click="query" type="primary" plain :class="{'el-icon-search':!queryBtnText}">{{!queryBtnText?$t('BUTTON_TEXT.QUERY'):$t('BUTTON_TEXT.STATISTICS')}}</el-button>
                <!-- 扩展按钮插槽-->
                <slot name="extensionButton"></slot>
                <!-- 重置 -->
                <el-button size="mini" @click="reset" type="info" plain v-if="!queryBtnText && !isResetBtn">{{$t('BUTTON_TEXT.RESET')}}</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
  </div>
</template>

<script>
import SERVICES from '@/services';
import { debounce, throttle } from '@/utils/util.js'; // 防抖和节流

export default {
  components: {
    'dict-selected': function index (resolve) {
      require(['../DictSelected.vue'], resolve)
    }
  },
  props: {
    mate: Object,
    // 列表勾选类型设置
    tableCheckType: {
      type: String,
      default: ""
    },
    queryBtnText: {
      type: Boolean,
      default: false
    },
    // 查询字段是否允许为空
    isSearchValuesEmpty: {
      type: Boolean,
      default: true
    },
    // 表单验证规则
    rules: {
      type: Object,
      default: null
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    isResetBtn: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      nameFields: ['buyer','contactName','applicantName'], // 配置需要请求 user 列表的字段
      nameOptions: [], // 采购人列表
      object: {}, // 查询表单对象
      changePage: false,
      allowSearch: false
    }
  },
  created () {
    this.init();
  },
  mounted () {
  },
  methods: {
    /** 数据初始化
     * @param void 
     * @return void
     */
    init() {
      this.mate.mateSearch.fields.map(item => { this.object[item.name] = item });
      // 是否含有 user 列表字段 请求 user 列表
      let exist = this.nameFields.some(field => this.object[field]);
      if (exist) this.getAuditor();
    },
    /**
     * 头部查询 点击查询按钮触发
     * @param void
     * @return void
     */
    query () {
      debounce(() => {
        this.mate.mateList.lineRows = null;
        // 级联搜索情况 传选择的最小值集id
        let cascaderValues = this.mate.mateSearch.fields.find(item => item.holder==="cascader");
        if(cascaderValues && this.mate.mateSearch.values[cascaderValues.name]){
          this.mate.mateSearch.values[cascaderValues.name] = this.mate.mateSearch.values[cascaderValues.name][this.mate.mateSearch.values[cascaderValues.name].length-1]
        }
        const mate = this.mate.mateSearch.values;
        const url = this.mate.mateSearch.url;
        // 如果查询条件不能全为空 需要配置 isSearchValuesEmpty ,默认允许为空
        if (!this.isSearchValuesEmpty){
          // 如果查询字段全为空提示用户并返回不请求查询接口
          if (!(Object.keys(mate).some(key => mate[key] != ""))){
            this.$message.error(`${!this.queryBtnText?this.$t('BUTTON_TEXT.QUERY'):this.$t('BUTTON_TEXT.STATISTICS')}字段不能全为空`);
            return;
          }
        }
        // 每次查询默认第1页,每页10条数据  为兼容后台查询分页接口，多用一个pageNum1，pageSize1
        mate.pageNum1 = this.pageNum;
        mate.pageSize1 = this.pageSize;
        mate.pageNum = this.pageNum;
        mate.pageSize = this.pageSize;
        // 某些模块后台需要传分页参数 ifNeedPage
        if(this.mate.mateSearch.ifNeedPage) mate.ifNeedPage = true;
        // 是否 loading 动画
        let loading = true;
        // 保存实例
        let _this = this;
        // 保存当前操作(this.allowSearch)和当前操作的值(true/false)
        let operation = new Map().set('this.allowSearch', true);
        // 发送事件执行查询函数
        this.$emit('queryData', mate, operation, loading);
        // TODO 后期公共化优化 [this.mate.modules]
        if(this.$store && this.$store.state.RegistrationInfo['registrationId'] && this.$store.state.RegistrationInfo['registrationId'] !==''){
          mate.registrationId = this.$store.state.RegistrationInfo['registrationId'];
        }
        SERVICES.BASE.query(url, mate).then(res =>{
          // 查询重置分页器
          if (!res.data.mate){ // 兼容调查问卷模块后台返回数据格式
            _this.$emit('initQueryData', res.data);
          }else{ // 一般模块后台返回数据处理方法
            _this.mate.mateList.rows = res.data.mate.rows;
            _this.mate.mateList.total = res.data.mate.total;
            _this.mate.mateList.size = res.data.mate.size;
            _this.mate.mateList.page = res.data.mate.page;
            _this.$emit('initOperations', _this.mate.mateList.rows);
          }
          // 对某些单选的列表做处理
          if (_this.tableCheckType === "radio") _this.$bus.$emit("refreshRadio");
          _this._resetPager();
        }).catch(res =>{
          _this._resetPager();
        })
      },500)
    },
    /** 
     * 重置 loading
     * @param void
     * @return void
     */
    _resetPager() {
      let resetPager = true;
      this.$emit('loading', resetPager, this.pageNum, this.pageSize);
    },
    /**
     * 重置查询条件
     * 清空输入项
     * @return void
     */
    reset() {
      let searchValues = this.mate.mateSearch.values;
      // Object.keys(searchValues).forEach(item =>{ searchValues[item] = "" });
      this.$refs['queryForm'].resetFields();
      let operation = new Map().set('this.allowSearch', false).set('this.changePage', false);
      this.$emit('queryData', searchValues, operation);
    },
    // 审核人、采购人都是一样的
    getAuditor () {
      let object = this.object;
      this.nameOptions = [];
      SERVICES.BASE.getUserList().then(res =>{
        res.data.forEach(item =>{
          this.nameOptions.push({ 
            'label': item.firstname && item.lastname &&`${item.firstname}${item.lastname}` || item.username, 
            'value': item.id 
            })
        })
        this.nameFields.forEach(item =>{
          if (object[item]) object[item].options = this.nameOptions;
        })
      })
    }
  },
  watch: {
    // 监听 mate 数据 发生变化的时候做初始化
    mate: function (newMate) {
      this.init();
      this.reset();
    },
  },
}
</script>
<style scoped lang="scss">
  .main-block .search {
    display: inline-block;
    margin-left: 30px;
    margin-top: -13px;
  }
  .el-form--inline .el-form-item {
    margin-bottom: 0
  }
  .el-table .cell, .el-table th>div {
    padding-right: 0;
  }
  .button{
    margin-top:10px;
  }
  .el-form-item {
    margin: 0px;
  }
  .select-button{
    margin-top: 20px;
  }
  .el-dialog__header {
    padding: 10px 10px 0;
  }
  .el-dialog__body {
    padding: 10px 10px;
  }
  .el-select,
  .date-picker,
  .el-cascader {
    width: 100%;
  }
  .advanced_query{
    margin-bottom: 15px;
    .el-input--suffix .el-input__inner {
      padding-right: 15px;
    }
  }
  .el-button+.el-button {
    margin-left: 0px;
  }
</style>
