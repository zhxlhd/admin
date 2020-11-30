<!-- created by zhongxiaolong on 2019/10/10 -->
<!-- 工单分类 TicketClassification -->
<template>
  <div>
    <k-table-list ref="listTable" 
                  :mate="mate" 
                  :word="word" 
                  :mateSearch="mate.mateSearch" 
                  :isIndex="isIndex" 
                  @btnClick="handleButtons" 
                  @rowClick="handleRowClick" 
                  @action="handleActions"></k-table-list>
  </div>
</template>
<script>
import SERVICES from '@/services';
import { BASIC_DATA_API } from "@/services/apis";

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
      isIndex: false,             // Table 是否渲染序号列（选配）
      word: true,                 // Table 操作列按钮是否渲染文字+icon（选配）
      multipleSelection: [],      // 勾选项数组（必配）
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
        update: (act, row) => this.handleUpdate(act, row),    // 编辑/修改
        status: (act, row) => this.handleStatus(act, row),    // 失效、启用
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
    },
    /** 修改按钮(操作列)
     * 列表行的操作列修改按钮
     * @param {Object} act 当前点击的按钮配置信息
     * @param {Object} row 行数据
     * @return void
     */
    handleUpdate(act, row) {
      this.$root.handleAction(act, row, function() {});
    },
    /**
     *  启动订单,暂停订单,恢复订单
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
    */
    handleStatus (act, row) {
      let statusFlag = row.statusFlag;
      if(statusFlag=="0"){
        // 启用
        this.enableOrder(act, row);
      }else if(statusFlag=="1"){
        // 失效
        this.disableOrder(act, row);
      }
    },
    /**
     * 失效
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
    */
    disableOrder (act, row) {
      let status = "DISABLE";
      this.statusChange(status, row.id, act);
    },
    /**
     * 启用
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
    */
    enableOrder (act, row) {
      let status = "ENABLE";
      this.statusChange(status, row.id, act);
    },
    /**
     * 状态改变 
     * 失效:DISABLE; 
     * 启用:ENABLE;
     * @param {String} state 状态
     * @param {String} id 选中行 id
     * @param {Object} act 按钮配置信息
     * @return void
     */
    statusChange (state, id, act) {
      SERVICES.TICKET_CLASSIFICATION.handleStatus(state, id,).then(() => {
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
        let data = res.data.lineList || [];
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
      this.$root.monitor({ url: BASIC_DATA_API.TICKET_CLASSIFICATION_MAIN_LIST });
    },
  }
}
</script>
<style scoped lang="scss">
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  .my-dialog .my-table {
    width: 100%;
    margin: 20px 0;
  }
  .my-dialog .my-table td{
    text-align: center;
    vertical-align: middle;
    padding: 10px;
  }
  .my-dialog .my-table td div{
    text-align: left;
    display: inline-block
  }
  .main-article {
    padding: 20px;
    margin: 0 auto;
    display: block;
    width: 740px;
    background: #fff;
  }
</style>

