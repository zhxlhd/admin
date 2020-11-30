<!-- created by zhongxiaolong on 2019/10/12 -->
<!-- 外协加工单 OutsourcingProcessingOrder -->
<template>
  <div>
    <k-table-list :mate="mate" :mateSearch="mate.mateSearch" ref="listTable" @btnClick="handleButtons" @rowClick="handleRowClick" @action="handleActions"></k-table-list>
  </div>
</template>
<script>
import KTableList from '@/components/table/KTableList';
import SERVICES from '@/services';
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
      multipleSelection: [],  // 多选
    }
  },
  created (){
    this.init();
  },
  methods: {
    /**
     * 数据初始化
     * @param void
     * @return void
     */
    init () {},
    /**
     * 头部按钮控制
     * 点击按钮触发对应方法
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @param {Array} selection 勾选行数据
     * @return {Function} 执行操作的方法
     */
    handleButtons (btn, row, selection) {
      this.multipleSelection = selection;
      let action = btn.action;
      const btnEvents = {
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(btn, row);
    },
    /**
     * actions 操作
     * 点击 action 根据按钮配置的 action 做对应操作
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return {Function} 执行操作的方法
     */
    handleActions (act, row) {
      let action = act && act.action;
      const actions = {
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
    },
    /**
     * 请求当前操作行的查看详情中的列表行数据
     * 获取数据后渲染详情列表行
     * @param {Object} row 当前操作行的行数据
     * @param {Object} act 当前操作按钮的配置信息
     * @return void
     */
    handleRowClick (row, act) {
      let url = this.mate.mateList.url;
      SERVICES.BASE.getLines(url, row.id).then(res =>{
        let data = res.data.lineList || [];
        if (data.length){
          this.$set(this.mate.mateList, "lineRows", data);
        }
      })
    }
  }
}
</script>
