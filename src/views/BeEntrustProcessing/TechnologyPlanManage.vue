<!-- created by yxj on 2019/11/13 -->
<!-- 技术方案管理 -->
<template>
  <div>
    <k-table-list :mate="mate" ref="listTable" :mateSearch="mate.mateSearch" @btnClick="handleButtons"></k-table-list>
  </div>
</template>
<script>
import KTableList from '@/components/table/KTableList'
import { BE_ENTRUST_PROCESSING_API } from "@/services/apis"
import SERVICES from "@/services"

export default {
  components: {
    KTableList
  },
  props: {
    mate: Object
  },
  data(){
    return {
    }
  },
  mounted (){
  },
  methods: {
    /**
     * 重新渲染列表页
     * @param void
     * @return void
     */
    reRenderList() {
      this.$refs.listTable.$refs.multipleQueryForm.query();
      // this.$root.monitor({ url: BE_ENTRUST_PROCESSING_API.PROCESSING_PLAN_LIST });
    },
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
        // modify: (btn, row) => this.modify(btn, row),
        delete: (btn, row) => this.delete(btn, row),
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(btn, row);
    },
    /**
     * 修改
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    modify(btn, row) {
      let multipleSelection = this.multipleSelection;
      if (multipleSelection.length !== 1) {
          // 只能选择一行,不允许选择多行
          this.$message({
            message: this.$t("seladata"), // 请选择一行数据
            type: "warning"
          });
          return;
      }
      let rowt = row.id ? row : { id: multipleSelection.map(r => r.id) };
      this.$root.handleAction(btn, rowt, function() {});
    },
    /**
     * 删除
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    delete (btn, row) {
      let multipleSelection = this.multipleSelection;
      let ids = [];
      multipleSelection.forEach(item => { ids.push(item.id) });
      if (ids.length>0) {
          this.$confirm(
              this.$t("TIPS_WARNING.IRREVERSIBLE_DELETION"),
              this.$t("TITLE_TEXT.TIPS"),
              {
                confirmButtonText: this.$t("BUTTON_TEXT.CONFIRM"), // 确认
                cancelButtonText: this.$t("BUTTON_TEXT.CANCEL"), // 取消
                type: "warning"
              }
          ).then(() => {
            SERVICES.TECHNOLOGY_PLAN_MANAGE.delete(ids).then(res => {
              if(res.status == 200) {
                this.$message({
                    type: "success",
                    message: this.$t("TIPS_WARNING.DELETE_SUCCESS")
                });
                this.reRenderList();
              }else{
                this.$message({
                    type: "warning",
                    message: this.$t("TIPS_WARNING.DELETE_FAIL")
                });
              }
            });
          }).catch(() => {
              this.$message({
                  type: "info",
                  message: this.$t("TIPS_WARNING.CANCEL_DELETION") // 已取消删除
              });
          });
      } else {
          this.$message({
              type: "warning",
              message: this.$t("TIPS_WARNING.CANNOT_BE_DELETED") // 不能删除
          });
      }
    }
  }
}
</script>
