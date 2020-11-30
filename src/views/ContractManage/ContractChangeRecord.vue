<!-- created by yxj on 2020/2/14-->
<!-- 合同变更记录 -->
<template>
  <div>
    <!--table Start -->
    <KTableList
      :mate="mate"
      :mateSearch="mate.mateSearch"
      ref="listTable"
      @btnClick="handleButtons"/>
    <!--table End -->
  </div>
</template>
<script>
import KTableList from '@/components/table/KTableList'
import SERVICES from '@/services'
import { CONTRACT_MANAGE_API } from "@/services/apis"

export default {
  components: {
    KTableList,
  },
  data(){
    return {
      multipleSelection: [],      // 多选
    }
  },
  props: {
    mate: Object
  },
  created (){
  },
  mounted (){
    // 获取合同类型
    this.getContractTypeList();
    this.getProjectList();
  },
  watch: {
    mate: function(newMate) {
      // 获取合同类型
    this.getContractTypeList();
    }
  },
  methods: {
    /**
     * 头部按钮控制
     * 点击按钮触发对应方法
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @param {Array} selection 勾选行数据
     * @return void
     */
    handleButtons (btn, row, selection) {
      this.multipleSelection = selection;
      let action = btn.action;
      const btnEvents = {
        modify: (btn, row) => this.modify(btn, row),       // 修改
        delete: (btn, row) => this.delete(btn, row),       // 删除
        submitApprove: (btn, row) => this.submitApprove(btn, row),       // 提交审批
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(btn, row);
    },
    /**
   * 获取合同类型下拉列表
   * @param void
   * @return void
   */
  getContractTypeList() {
    SERVICES.CONTRACT_MANAGE.getContractTypeList().then(res => {
      if(res.data.length>0){
        let contractTypeOptions = [];
        let data = res.data;
        if(data.length){
          data.forEach(item => {
            contractTypeOptions.push({
              label: item.contractTypeName,
              value: item.id,
              id: item.id
            });
          });
          // 合同类型保存到表单配置中
          this.mate.mateSearch.fields.map((item) => {
            if(item.name == 'contractTypeId') {
              item.options = contractTypeOptions;
            }
          });
        }
      }
    });
  },
  /**
   * 获取项目名称下拉列表
   * @param void
   * @return void
   */
  getProjectList() {
    SERVICES.CONTRACT_MANAGE.getProjectList().then(res => {
      if(res.data.length>0){
        let projectOptions = [];
        let data = res.data;
        if(data.length){
          data.forEach(item => {
            projectOptions.push({
              label: item.projectName,
              value: item.id,
              id: item.id
            });
          });
          // 项目名称保存到表单配置中
          this.mate.mateSearch.fields.map((item) => {
            if(item.name == 'projectId') {
              item.options = projectOptions;
            }
          });
        }
      }
    });
  },
    /**
     * 重新渲染列表页
     * @param void
     * @return void
     */
    reRenderList() {
      this.$root.monitor({ url: CONTRACT_MANAGE_API.CONTRACT_CHANGE_APPLY_LIST });
    },
  }
}
</script>
