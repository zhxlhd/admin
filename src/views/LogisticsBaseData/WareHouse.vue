<!-- created by yxj on 2019/11/20 -->
<!-- 仓库信息 -->
<template>
  <div>
    <k-table-list :mate="mate" ref="listTable" :mateSearch="mate.mateSearch" :isIndex="isIndex" @rowClick="getRowData" @btnClick="handleButtons"></k-table-list>

  </div>
</template>
<script>
import KTableList from '@/components/table/KTableList'
import { BE_ENTRUST_PROCESSING_API,BASE_API } from "@/services/apis"
import SERVICES from "@/services"

export default {
  components: {
    KTableList
  },
  data(){
    return {
      isIndex: true,          // table是否渲染序号
    }
  },
  props: {
    mate: Object
  },
  created (){
    this.getOrgList();
  },
  mounted (){
  },
  methods: {
    /**
     * 请求当前操作行的查看详情中的列表行数据
     * 获取数据后渲染详情列表行
     * @param {Object} row 当前操作行的行数据
     * @param {Object} act 当前操作按钮的配置信息
     * @return void
     */
    getRowData(row, act) {
      this.$set(this.mate.mateList, "lineRows", []);
    },
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
        delete: (btn, row) => this.delete(btn, row),
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(btn, row);
    },
    /**
     * 删除
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    delete (btn, row) {
      let multipleSelection = this.multipleSelection;
      // ids 存放删除多行的id
      let ids = [];
      multipleSelection.forEach(item => { ids.push(item.id) });
      if (ids.length >0 ) {
          this.$confirm(
              this.$t("TIPS_WARNING.IRREVERSIBLE_DELETION"),
              this.$t("TITLE_TEXT.TIPS"),
              {
                confirmButtonText: this.$t("BUTTON_TEXT.CONFIRM"), // 确认
                cancelButtonText: this.$t("BUTTON_TEXT.CANCEL"), // 取消
                type: "warning"
              }
          ).then(() => {
            SERVICES.LOGISTICS_BASE_DATA.deleteWareHouse(ids).then((res) => {
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
    },
    /**
     * 获取所属机构
     * @param void
     * @return void
     * ***/
    getOrgList() {
      SERVICES.LOGISTICS_BASE_DATA.getOrgList().then((res) =>{
        if(res.data.length>0){
          let orgOptions = [];
          let data = res.data;
          if(data.length){
            data.forEach(item => {
              orgOptions.push({
                label: item.name,
                value: item.officeId,
                id: item.id
              })
            });
            // 所属机构保存到表单配置中
            this.mate.mateSearch.fields[5].options = orgOptions;
          }
        }
      });
    },
  }
}
</script>
