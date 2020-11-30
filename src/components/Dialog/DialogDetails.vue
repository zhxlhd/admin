<!-- 查看详情 -->
<template>
  <div>
    <el-dialog
      :title="$t('TITLE_TEXT.SEE_DETAILS')"
      :visible.sync="dialogVisible"
      width="90%"
      :before-close="closeDialog"
      class="dialog_details"
    >
      <div class="header clearfloat">
        <slot :print="print"></slot>
      </div>
      <div ref="print">
        <dialog-form :mate="mate.mateFormerHeader" v-if="mate.mateFormerHeader" formModel="dialog" />
        <dialog-table :mate="mate" :isIndex="isIndexDialog" :indexNum="indexNum" v-if="mate.mateListLine" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  components: {
    DialogForm: function index(resolve) {
      require(["../DialogForm.vue"], resolve);
    },
    DialogTable: function index(resolve) {
      require(["../DialogTable.vue"], resolve);
    }
  },
  props: {
    mate: Object,
    dialogVisible: Boolean,
    isIndexDialog: { // Dialog Table 是否渲染序号列
      type: Boolean,
      default: false
    },
    indexNum: { // Dialog Table 序号列序号基数
      type: Number,
      default: 1
    }
  },
  data() {
    return {};
  },
  created() {
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog", false);
    },
    getProgressData(id) {
      this.$parent.$parent.$parent.getProgressData(id);
    },
    /** 打印
     * @param void
     * @return void
     */
    print() {
      this.$print(this.$refs.print);
    },
  }
};
</script>

<style scoped lang="scss">
.dialog_details /deep/ .el-dialog{
  // max-height: 80%;
  overflow: hidden;
}
.dialog_details /deep/ .el-dialog__body{
  max-height: 550px;
  // height: 90%;
  overflow: auto;
}
.dialog_details /deep/ .header{
  zoom: 1;
  &.clearfloat:after {
    content: " ";
    display: block;
    clear: both;
    height: 0;
    line-height: 0;
    visibility: hidden;
  };
}
</style>
