<!-- created by hezhiqiang on 2020/02/24 -->
<!-- 销售订单分类 -->
<template>
  <div>
    <!--table Start -->
    <k-table-list
      :mate="mate"
      :mateSearch="mate.mateSearch"
      ref="list-table"
      :isIndex="isIndex"
      @btnClick="handleButtons"
      @isSelected="handleSelected"
      @action="handleActions"
    />
    <!--table End -->
  </div>
</template>

<script>
import KTableList from '@/components/table/KTableList';
import {BASIC_DATA_API} from '@/services/apis';
import SERVICES from '@/services';
export default {
  components: {
    KTableList
  },
  data () {
    return {
      isIndex: true,              // table是否渲染序号
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
     * 多选控制
     * @param {Boolean} bool 是否有勾选
     * @param {Array} selectedArr 勾选行数据数组
     * @return void
     */
    handleSelected (bool, selectedArr) {
      this.hasSelected = bool;
      this.multipleSelection = selectedArr;
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
        modify: (btn, row) => this.modify(btn, row),       // 修改
        delete: (btn, row) => this.delete(btn, row),       // 删除
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(btn, row);
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
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
    },
    /**
     * 修改
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据 row.id
     * @return void
     */
    modify (btn, row) {
      let multipleSelection = this.multipleSelection;
      let rowt =row.id ? row : { id : multipleSelection.map(r => r.id) };
      if (multipleSelection.length !== 1) {
        // 只能选择一行,不允许选择多行
        this.$message({
          message: this.$t("seladata"), // 请选择一行数据
          type: "warning"
        });
        return;
      };
      this.$root.handleAction(btn, rowt, function() {});
    },
    /**
     * 删除
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 
     * @return void
     */
    delete(btn, row) {
      let multipleSelection = this.multipleSelection;
      let rowt =row.id ? row : { id : multipleSelection.map(r => r.id) };
      if (multipleSelection.length !== 1) {
        // 只能选择一行,不允许选择多行
        this.$message({
          message: this.$t("seladata"), // 请选择一行数据
          type: "warning"
        });
        return;
      };
      this.$confirm(
        this.$t("TIPS_WARNING.IRREVERSIBLE_DELETION"),
        this.$t("TITLE_TEXT.TIPS"),
        {
          confirmButtonText: this.$t("BUTTON_TEXT.CONFIRM"), // 确认
          cancelButtonText: this.$t("BUTTON_TEXT.CANCEL"), // 取消
          type: "warning"
        }
      ).then(() => {
        SERVICES.RELATED_BASIC.orderDelete(multipleSelection[0].id).then(res => {
          let status = res.data.statusCode
          if (status === 40064) {
            this.$message({
              type: 'warning',
              message: '已被销售订单使用，无法删除'
            })
          } else if (status === 200) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.reRenderList()
          }
        })
      }).catch(() => {
        this.$message({
          type: "info",
          message: this.$t("TIPS_WARNING.CANCEL_DELETION") // 已取消删除
        });
      });
    },
    /**
     * 重新渲染列表页
     * @param void
     * @return void
     */
    reRenderList() {
      this.$root.monitor({ url: BASIC_DATA_API.SALE_ORDER_CATEGORY_LIST });
    },
  }
}
</script>