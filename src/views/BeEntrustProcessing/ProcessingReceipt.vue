
<!-- created by zhongxiaolong on 2019/10/12 -->
<!-- 加工入库单 ProcessingReceipt -->
<template>
  <div>
    <k-table-list ref="listTable" 
                  :mate="mate" 
                  :mateSearch="mate.mateSearch" 
                  :isIndex="isIndex" 
                  @btnClick="handleButtons" 
                  @rowClick="handleRowClick" 
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
      isIndex: false,                    // Table 是否渲染序号列
      multipleSelection: [],             // 勾选项数组
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
     * @param {Object} rowId 勾选行 id数据  rowId.id
     * @param {Array} selection 勾选行数据
     * @return {Function} 执行操作的方法
     */
    handleButtons (btn, rowId, selection) {
      this.multipleSelection = selection;
      let action = btn.action;
      const rowIds = rowId.id ? rowId : { id: selection.map(r => r.id) };
      const btnEvents = {
        // update: (btn, rowIds) => this.handleUpdate(btn, rowIds), // 编辑/修改
        delete: (btn, rowIds) => this.handleDelete(btn, rowIds), // 删除
        default: () => { return }
      }
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
     * 请求当前操作行的查看详情中的列表行数据
     * 获取数据后渲染详情列表行
     * @param {Object} row 当前操作行的行数据
     * @param {Object} act 当前操作按钮的配置信息
     * @return void
     */
    handleRowClick (row, act) {
      let url = this.mate.mateList.url;
      SERVICES.BASE.getLines(url, row.id).then(res =>{
        let data = res.data.lineList;
        if (data.length){
          this.$set(this.mate.mateList, "lineRows", data);
        }
      })
    },
    /**
     * 重新渲染列表页
     * @param void
     * @return void
     */
    reRenderList() {
      this.$root.monitor({ url: BE_ENTRUST_PROCESSING_API.PROCESSING_RECEIPT_MAIN_LIST });
    },
  }
}
</script>
