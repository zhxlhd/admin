<!-- 模块新增页面底部列表组件 -->
<template>
  <div>
    <!-- 头部按钮组件 Start -->
    <boxer ref="Boxer"
          :mate="mate" 
          :hasSelected="hasSelected" 
          @action="handleButtons" 
          :btnDisable="btnDisable">
      <!-- 搜索按钮插槽 Start -->
      <div slot="searchForm" style="float: left;">
        <slot name="moreBtn"></slot>
      </div>
      <!-- 搜索按钮插槽 End -->
      <!-- 提示 Start -->
      <div slot="main" style="position: relative;">
        <slot name="tips"></slot>
      </div>
      <!-- 提示 End -->
    </boxer>
    <!-- 头部按钮组件 End -->
    <!-- 列表 table 组件 Start -->
    <main-table ref="table" 
                v-bind="$attrs" 
                v-on="$listeners"
                :mate="mate" 
                :mateList="mate" 
                :toSort="toSort" 
                :btnDisable="actionDisable" 
                :maxHeight="height" 
                @action="handleActions" 
                @isSelected="handleSelected"></main-table>
              <!-- 列表 table 组件 End -->
  </div>
</template>

<script scope>
import { API_GATEWAY } from '@/config/index.js'
import Boxer from '../Boxer.vue'
import MainTable from './MainTable'

export default {
  // inheritAttrs: false,
  components: {
    Boxer,
    MainTable,
    'dict-selected': function index (resolve) {
      require(['../DictSelected.vue'], resolve)
    }
  },
  props: {
    mate: Object,
    toSort: Boolean,
    maxHeight: Number,
    btnDisable: Boolean,
    actDisable: Boolean
  },
  data () {
    return {
      loading: true,
      operatorOptions: [],
      multipleSelection: [],
      hasSelected: false,
      searchValues: {},
      page: 0,
      sortValues: {},
      userType: '',
      physicalInventoryId: 0
    }
  },
  computed: {
    height: function () {
      return this.maxHeight || 380;
    },
    actionDisable: function () {
      return this.actDisable;
    }
  },
  methods: {
    /**
     * 头部按钮控制
     * 点击按钮触发对应方法
     * @param {Object} btn 当前点击的按钮配置信息
     * @return void
     */
    handleButtons (btn) {
      let row = (btn.isApi || btn.ajax) ? { id: this.multipleSelection.map((r) => r.id) } : {};
      this.$emit('btnClick', btn, row);
    },
    /**
     * actions 操作
     * 点击 action 根据按钮配置的 action 做对应操作
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
     */
    handleActions (act, row) {
      let action = act.action;
      const btnEvents = {
        // 默认
        default: () => this.$emit('action', act, row)
      }
      return (btnEvents[action] || btnEvents.default)();
    },
    /**
     * 多选控制
     */
    handleSelected (bool, selectedArr) {
      this.multipleSelection = selectedArr;
      this.hasSelected = bool;
      this.$emit('actionSelected', this.hasSelected, this.multipleSelection);
    },
    uploadFile(url, method, data) {
      this.$refs['table'].uploadBtnClick(url, method, data);
    },
    /** 清空 table 勾选 
     * @param void
     * @return void
    */
    clearSelection(){
      this.$refs['table'].clearSelection();
    },
  }
}
</script>
