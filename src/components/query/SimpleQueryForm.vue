<!--最上面的单条件查询-->
<template>
  <div>
    <div class="query">
      <el-row :gutter="20">
        <el-form :model="mate.mateSearch.values" :inline="mate.inline">
          <el-col :sm="6" :md="4" :lg="4">
            <el-select size="mini" clearable v-model="mate.mateSearch.values['name']" placeholder="请选择标题">
              <el-option :label="item.label" :value="item.value" v-for="item of titleOptions" :key="item.value"></el-option>
            </el-select>
          </el-col>
          <el-col :sm="6" :md="4" :lg="4">
            <el-select size="mini" clearable v-model="mate.mateSearch.values['operator']" placeholder="请选择条件">
              <el-option :label="item.label" :value="item.value" v-for="item of operatorOptions" :key="item.value"></el-option>
            </el-select>
          </el-col>
          <el-col :sm="6" :md="4" :lg="4">
            <el-input size="mini" clearable v-model="mate.mateSearch.values['value']"  placeholder="请输入值"></el-input>
          </el-col>
          <el-col :sm="6" :md="4" :lg="4">
            <div class="search">
              <el-button @click="query" size="mini">查询</el-button>
            </div>
          </el-col>
        </el-form>
      </el-row>
    </div>
  </div>
</template>

<script>
import { LANGS } from '@/i18n/lang';
import SERVICES from '@/services';

export default {
  components: {
    'dict-selected': function index (resolve) {
      require(['../DictSelected.vue'], resolve)
    }
  },
  props: {
    mate: Object
  },
  data () {
    return {
      nameFields: ['buyerName','contactName','applicantName'], // 配置需要请求 user 列表的字段
      nameOptions: [], // 采购人列表
      langs: LANGS,
      object: {}, // 查询表单对象
      changePage: false,
      allowSearch: false,
      titleOptions: [],
      operatorOptions: []
    }
  },
  computed: {},
  created () {
    this.mate.mateSearch.fields.map(item => { this.object[item.name] = item });
    if (this.mate.mateSearch) {
      this.titleOptions = this.mate.mateSearch.fields[0].options;
      this.operatorOptions = this.mate.mateSearch.fields[1].options;
    }
  },
  mounted () {
    // let exist = this.nameFields.some(field => this.object[field]);
    // if(exist && this.nameOptions.lenght<0) this.getAuditor();
  },
  methods: {
    /**
     * 头部查询 点击查询按钮触发
     * @param void
     * @return void
     */
    query () {
      this.mate.mateList.lineRows = null;
      const mate = [this.mate.mateSearch.values];
      const url = this.mate.mateSearch.url;
      this.$emit('queryData', mate);
      SERVICES.BASE.query(url, mate).then(res =>{
        this.mate.mateList.rows = res.data.mate.rows;
        this.mate.mateList.total = res.data.mate.total;
      })
    }
  },
  watch: {
    mate: function (newMate) {
      if (this.mate.mateSearch) {
        this.titleOptions = this.mate.mateSearch.fields[0].options;
        this.operatorOptions = this.mate.mateSearch.fields[1].options;
      }
    }
  }
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
    margin: 15px 20px 2px 0px;
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
  .query{
    margin-bottom: 15px;
  }
  .el-select,
  .date-picker {
    width: 100%;
  }
</style>
