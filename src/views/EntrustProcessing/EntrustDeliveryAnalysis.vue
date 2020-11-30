<!-- created by zhongxiaolong on 2019/10/12 -->
<!-- 交货情况分析(委托方) -->
<template>
  <div>
    <div class="tab-box">
      <div class="tab-item" v-for="(tab,idx) in tabList" :key="idx" :class="{'active':idx == selectIndx}" @click="tabItem(idx)">{{tab.tabName}}</div>
    </div>
    <k-table-list :mate="tabData" ref="listTable" :mateSearch="mate.mateSearch"></k-table-list>
  </div>
</template>
<script>
import KTableList from '@/components/table/KTableList';
import SERVICES from '@/services';
import { LANGS } from "@/i18n/lang";
import { ENTRUST_PROCESSING_API } from "@/services/apis";

export default {
  components: {
    KTableList
  },
  props: {
    mate: Object
  },
  data(){
    return {
      page: 1,                   // 默认显示第1页
      pageSize: 10,              // 默认10条/页
      multipleSelection: [],     // 列表勾选项
      status: '',                // 当前行状态
      rowId: '',                 // 当前行 id
      tabList: [                 // tab切换的数据统计分类
          {tabName:'加工计划查询',tabUrl:ENTRUST_PROCESSING_API.DELIVERY_DATA_PROCESSING_LIST},
          {tabName:'交货状况分析',tabUrl:ENTRUST_PROCESSING_API.DELIVERY_DATA_CONDITION_LIST},
          {tabName:'加工数量对账',tabUrl:ENTRUST_PROCESSING_API.DELIVERY_DATA_PROCESSING_COUNT_LIST},
          {tabName:'损耗统计',tabUrl:ENTRUST_PROCESSING_API.DELIVERY_DATA_LOSS_LIST},
          {tabName:'月损耗统计',tabUrl:ENTRUST_PROCESSING_API.DELIVERY_DATA_MONTH_LOSS_LIST}],
      selectIndx: 0,              // 当前选中的tab标识
      tabData: this.mate
    }
  },
  created (){},
  mounted (){},
  methods: {
    /**
     * tab切换操作
     * @param {String} idx 当前选中的tab标签
     * @return void
     */
    tabItem(idx) {
      this.selectIndx = idx;
      SERVICES.ENTRUST_DELIVERY_ANALYSIS.getList(this.tabList[idx].tabUrl).then(res => {
        let tabMate = res.data.mate;
        this.tabData = tabMate;
      });
    }
  },
  watch: {
    mate(){
      this.tabList.forEach((tab, index) => {
        if(this.mate.mateList.url == tab.tabUrl){
          this.selectIndx = index;
        }
      });
    }
  }
}
</script>
<style scoped>
  .tab-box { width: 100%;height: 38px;margin-bottom: 10px; }
  .tab-box .tab-item { height: 100%;width: 120px;display: inline-block;text-align: center;font-size: 14px;line-height: 38px;cursor: pointer;border: 1px solid gainsboro;border-right: none }
  .tab-box .tab-item:last-child { border-right: 1px solid gainsboro }
  .tab-box .tab-item.active { color: #03a9f4;border-bottom: none }
</style>
