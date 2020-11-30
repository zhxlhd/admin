<!-- created by zhongxiaolong on 2019/08/21 -->
<!-- 跟单数据统计 -->
<template>
  <div>
    <k-table-list
      :mate="mate"
      ref="listTable"
      :mateSearch="mate.mateSearch"
      :isIndex="isIndex"
      @btnClick="handleButtons"></k-table-list>
  </div>
</template>
<script>
import KTableList from "@/components/table/KTableList";

export default {
  components: {
    KTableList
  },
  props: {
    mate: Object
  },
  data() {
    return {
      isIndex: true // table是否渲染序号
    };
  },
  created() {},
  mounted() {},
  methods: {
    init() {},
    /**
     * 头部按钮控制
     * 点击按钮触发对应方法
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @param {Array} selection 勾选行数据
     * @return void
     */
    handleButtons(btn, row, selection) {
      this.multipleSelection = selection;
      let action = btn.action;
      const btnEvents = {
        // export: (btn, row) => this.export(btn, row),
        default: () => {
          return;
        }
      };
      return (btnEvents[action] || btnEvents.default)(btn, row);
    }
  }
};
</script>
