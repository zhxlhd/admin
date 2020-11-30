<!-- created by hezhiqiang on 2020/02/26 -->
<!-- 汇率管理 -->
<template>
  <div>
    <!--table Start -->
    <k-table-list
      :mate="mate"
      :mateSearch="mate.mateSearch"
      ref="list-table"
      :isIndex="isIndex"
      @btnClick="handleButtons"
      @action="handleActions"
    />
    <!--table End -->
  </div>
</template>

<script>
import KTableList from '@/components/table/KTableList';
import SERVICES from '@/services';
import { BASIC_DATA_API } from "@/services/apis"
export default {
  components: {
    KTableList
  },
  data () {
    return {
      isIndex: true,              // 渲染table序号
      multipleSelection: [],      // 多选
    }
  },
  props: {
    mate: Object
  },
  created () {
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
        delete: (btn, row) => this.delete(btn, row),       // 删除
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(btn, row);
    },
    /**
     * 删除
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据 row.id
     * @return void
     */
    delete (btn, row) {
      let multipleSelection = this.multipleSelection
      let ids = [];
      multipleSelection.forEach(item => { ids.push(item.id) });
      if (ids.length > 0) {
        this.$confirm(
          this.$t("TIPS_WARNING.IRREVERSIBLE_DELETION"),
          this.$t("TITLE_TEXT.TIPS"),
          {
            confirmButtonText: this.$t("BUTTON_TEXT.CONFIRM"), // 确认
            cancelButtonText: this.$t("BUTTON_TEXT.CANCEL"), // 取消
            type: "warning"
          }
        ).then(() => {
            SERVICES.RELATED_BASIC.handleDelete(ids).then((res) => {
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
     * 重新渲染列表页
     * @param void
     * @return void
     */
    reRenderList() {
      this.$root.monitor({ url: BASIC_DATA_API.EXCHANGE_RATE_LIST });
    },
  }
}
</script>