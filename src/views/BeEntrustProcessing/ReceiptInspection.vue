<!-- created by zhongxiaolong on 2019/10/12 -->
<!-- 收货检验 ReceiptInspection -->
<template>
  <div>
    <k-table-list ref="listTable" 
                  :mate="mate" 
                  :mateSearch="mate.mateSearch" 
                  :isIndex="isIndex" 
                  @btnClick="handleButtons" 
                  @action="handleActions"></k-table-list>
  </div>
</template>
<script>
import SERVICES from '@/services'
import { BE_ENTRUST_PROCESSING_API } from "@/services/apis"

export default {
  components: {
    KTableList: function index(resolve) {
      require(["@/components/table/KTableList.vue"], resolve);
    }
  },
  props: {
    mate: Object
  },
  data(){
    return {
      isIndex: false,         // Table 是否渲染序号列
      multipleSelection: [],  // 勾选项数组
    }
  },
  computed: {
		multipleSelectionLength: function () {
			return this.multipleSelection.length;
    },
  },
  created (){
    // this.init();
  },
  mounted (){},
  methods: {
    /**
     * 数据初始化
     * @param void
     * @return void
     */
    init () {},
    /**
     * 头部按钮控制
     * 点击按钮执行对应的操作(btn,action配置在MongoDB中)
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} rowId 勾选行 id数据  rowId.id
     * @param {Array} selection 勾选行数据
     * @return {Function} 执行操作的方法
     */
    handleButtons (btn, rowId, selection) {
      // 保存勾选项
      this.multipleSelection = selection;
      // 当前按钮操作
      let action = btn.action;
      // 勾选行 id
      const rowIds = rowId.id ? rowId : { id: selection.map(r => r.id) };
      // 操作实践映射
      const btnEvents = {
        // update: (btn, rowIds) => this.handleUpdate(btn, rowIds), // 编辑/修改
        delete: (btn, rowIds) => this.handleDelete(btn, rowIds), // 删除
        default: () => { return }
      }
      // 执行操作
      return (btnEvents[action] || btnEvents.default)(btn, rowIds);
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
    /** 修改按钮
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} ids 勾选行 id数据  ids.id
     * @return void
     */
    handleUpdate(btn, ids) {
      let status = this.multipleSelection[0].status;
      if (this.multipleSelectionLength != 1) {
        // 只能选择一行,不允许选择多行
        this.$message({
          message: this.$t("seladata"), // 请选择一行数据
          type: "warning"
        });
        return;
      }
      this.$root.handleAction(btn, ids, function() {});
    },
    /** 删除按钮
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} ids 勾选行 id数据  ids.id
     * @return void
     */
    handleDelete(btn, ids) {
      // 检查勾选项是否都是未启动状态 才能删除
      this.$root.handleAction(btn, ids, () => {
        this.reRenderList();
      });
    },
    /**
     * 重新渲染列表页
     * @param void
     * @return void
     */
    reRenderList() {
      this.$root.monitor({ url: BE_ENTRUST_PROCESSING_API.RECEIPT_INSPECTION_MAIN_LIST });
    },
  }
}
</script>
