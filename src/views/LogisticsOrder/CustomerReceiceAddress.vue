<!-- created by hezhiqiang on 2019/12/23 -->
<!-- 客户收货地址 -->
<template>
  <div>
    <KTableList
      :mate="mate"
      :mateSearch="mate.mateSearch"
      ref="listTable"
      :isIndex="isIndex"
      @btnClick="handleButtons"
      @action="handleActions"
    />
  </div>
</template>
<script>
import KTableList from '@/components/table/KTableList'
import SERVICES from '@/services'
import { LOGISTICS_ORDER_API } from "@/services/apis"

export default {
  components: {
    KTableList
  },
  data(){
    return {
      isIndex: true,              // table是否渲染序号
      multipleSelection: [],      // 多选
      searchForm: {},             // 搜索表单
    }
  },
  props: {
    mate: Object
  },
  created (){
    this.mate.mateSearch.fields.map((item) => { this.searchForm[item.name] = item; });
  },
  mounted (){
    // 获取客户名称
    this.getCustomerName()
  },
  watch: {
    mate: function (newMate) {
      this.getCustomerName();
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
        // 修改
        modify: () => this.modify(btn, row),
        // 删除
        delete: () => this.delete(btn, row),
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
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    modify (btn, row) {
      let multipleSelection = this.multipleSelection;
      let rowt = row.id ? row : { id: multipleSelection.map(r => r.id) };
      if (multipleSelection.length !== 1) {
        // 只能选择一行,不允许选择多行
        this.$message({
          message: this.$t("seladata"), // 请选择一行数据
          type: "warning"
        });
        return;
      }
      this.$root.handleAction(btn, rowt, function() {});
    },
    /**
     * 删除
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    delete (btn, row) {
      let multipleSelection = this.multipleSelection
      // ids 存放勾选多行的id
      let ids = []
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
        SERVICES.RECEICE_ADDRESS.delete(ids).then(res => {
          if (res.data.statusCode === 200) {
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
      }else {
        this.$message({
          type: "warning",
          message: this.$t("TIPS_WARNING.CANNOT_BE_DELETED") // 不能删除
        });
      }
    },
    /**
     * 请求当前操作行的查看详情中的列表行数据
     * 获取数据后渲染详情列表行
     * @param {Object} row 当前操作行的行数据
     * @param {Object} act 当前操作按钮的配置信息
     * @return void
     */
    getRowData (row, act) {
      
    },
    /**
     * 重新渲染列表页
     * @param void
     * @return void
     */
    reRenderList() {
      this.$root.monitor({ url: LOGISTICS_ORDER_API.CUSTOMER_RECEICE_ADDRESS_LIST});
    },
   /**
     * 获取客户名称
     * @param void
     * @return void
     */
    getCustomerName () {
      let customerOptions = []
      SERVICES.RECEICE_ADDRESS.getCustomerName().then(res => {
        let data = res.data
        if (data.length) {
          data.forEach(item => {
            customerOptions.push({
              'label': item.name,
              'value': item.name,
              'key': item.id,
            })
            // 客户名称保存到搜索表单配置中
            this.mate.mateSearch.fields.forEach(item => {
              if (item.name === 'companyName') {
                item.options = customerOptions
              }
            })
          })
        }
      })
    },
  }
}
</script>
