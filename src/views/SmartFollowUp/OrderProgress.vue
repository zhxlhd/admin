<!-- created by zhongxiaolong on 2019/08/21 -->
<!-- 订单进度 -->
<template>
  <div>
    <k-table-list ref="listTable" 
                  :mate="mate" 
                  :mateSearch="mate.mateSearch" 
                  :isIndex="isIndex" 
                  @btnClick="handleButtons" 
                  @rowClick="getRowData" 
                  @action="handleActions"></k-table-list>
  </div>
</template>
<script>
import KTableList from '@/components/table/KTableList'
import SERVICES from '@/services'
import { SMART_ORDER_API } from "@/services/apis"

export default {
  components: {
    KTableList
  },
  props: {
    mate: Object
  },
  data(){
    return {
      isIndex: true,          // table是否渲染序号
    }
  },
  created (){
    this.init();
  },
  mounted (){
    
  },
  methods: {
    init () {},
    /**
     * 头部按钮控制
     * 点击按钮触发对应方法
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} rowId 勾选行 id数据  rowId.id
     * @param {Array} selection 勾选行数据
     * @return void
     */
    handleButtons (btn, rowId, selection) {
      var _this = this;
      let row = (btn.isApi || btn.ajax) ? { id: this.multipleSelection.map((r) => r.id) } : {};
      let act = btn.action;
      switch(act){
        case '': // 新建 
          break;
      }
    },
    /**
     * actions 操作
     * 点击 action 根据按钮配置的 action 做对应操作
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
     */
    handleActions (act, row) {
      let action = act && act.action;
      const actions = {
        // start: () => this.startOrder(act, row),        // 启动订单
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
    getRowData (row, act) {
      let url = this.mate.mateList.url;
      SERVICES.BASE.getLines(url, row.orderId).then(res =>{
        let data = res.data.data;
        if (data.length > 0){
          this.$set(this.mate.mateList, "lineRows", data);
        }
      })
    },
    /**
     *  启动订单 
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
    */
    startOrder (act, row) {
      console.log(row)
    },
    uploadAttachment(rowId) { // 查看附件列表
      SERVICES.MY_TASK.getAttachMentList(rowId).then(res =>{
        if(res.data.statusCode == 200){
          this.$set(this.mate.mateList, "attatchmentRows", res.data.data);
        }else{
          this.$notify({
            title: '温馨提示',
            message: this.$createElement('i', { style: 'color: teal'}, '获取附件列表失败')
          });
        }
      });
    },
    getProgressData(id) { // 查看详情里面的“查看进度” 获取查看进度数据
      SERVICES.MY_TASK.checkProgress(id).then(res =>{
        if(res.data.statusCode == 200){
          this.$set(this.mate.mateList, "progressRows", res.data.data);
        }else{
          this.$notify({
            title: '温馨提示',
            message: this.$createElement('i', { style: 'color: teal'}, '查看进度数据失败')
          });
        }
      });
    }
  }
}
</script>
