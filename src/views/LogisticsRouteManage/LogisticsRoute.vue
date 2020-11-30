<!-- created by yxj on 2019/12/06 -->
<!-- 物流线路管理 物流线路维护 -->
<template>
  <div>
    <k-table-list :mate="mate" ref="listTable" :mateSearch="mate.mateSearch" :isIndex="isIndex" @btnClick="handleButtons"></k-table-list>
  </div>
</template>
<script>
import KTableList from '@/components/table/KTableList'
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
  },
  mounted (){
    // 初始化时必须设置
    this.$store.dispatch('RegistrationInfo/setLogisticsRouteToSaveFlag','');
    this.getStationList();
  },
  methods: {
    /**
     * 复制
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    copy(btn, row) {
      let multipleSelection = this.multipleSelection;
      if (multipleSelection.length !== 1) {
        // 只能选择一行,不允许选择多行
        this.$message({
            message: this.$t("seladata"), // 请选择一行数据
            type: "warning"
        });
        return;
      }
      // 本地缓存flag='copy'区分是复制还是修改功能
      this.$store.dispatch('RegistrationInfo/setLogisticsRouteToSaveFlag','copy');
      let rowt = row.id ? row : { id: multipleSelection.map(r => r.id) };
      this.$root.handleAction(btn, rowt, function() {});
    },
    /**
     * 重新渲染列表页
     * @param void
     * @return void
     */
    reRenderList() {
      this.$refs.listTable.$refs.multipleQueryForm.query();
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
        copy: (btn, row) => this.copy(btn, row), // 复制
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
            SERVICES.LOGISTICS_BASE_DATA.deleteLogisticsRoute(ids).then((res) => {
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
     * 获取起点、终点 站点下拉列表
     * @param void
     * @return void
     * ***/
    getStationList() {
      SERVICES.LOGISTICS_BASE_DATA.stationList().then(res =>{
        if(res.data.length>0){
          let stationOptions = [];
          let data = res.data;
          if(data.length){
            data.forEach(item => {
              stationOptions.push({
                  label: item.stationName,
                  value: item.id,
                  id: item.id
              })
            });
            // 起点、终点 站点保存到表单配置中
            let mate = this.mate;
            mate.mateFormerHeader.fields.map((item) => {
              if(item.name == 'startStationId' || item.name == 'endStationId') {
                item.options = stationOptions;
              }
            });
          }
        }
      });
    },
  }
}
</script>
