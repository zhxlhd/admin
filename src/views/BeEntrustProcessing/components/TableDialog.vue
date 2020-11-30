<template>
  <div>
    <!--加工单号弹窗 Start -->
    <el-dialog :title="tableTitle" width="80%" :visible.sync="isShow" :showClose="showClose" :before-close="closeDialog">
      <div style="font-size: 16px; overflow-y: auto; max-height: 600px">
        <span>{{tipsText}}</span>
        <k-table-list v-if="tableData" :mate="tableData" :checkType="'radio'" :mateSearch="tableData.mateSearch" @handleSelected="handleSelected"/>
        <el-row type="flex" justify="center">
          <el-button @click="closeDialog">{{$t('BUTTON_TEXT.CANCEL')}}</el-button>
          <el-button type="primary" @click="handleConfirm" :disabled="selectedLine == 0">{{$t('BUTTON_TEXT.CONFIRM')}}</el-button>
        </el-row>
      </div>
    </el-dialog>
    <!--加工单号弹窗 End -->
  </div>
</template>
<script>
import SERVICES from "@/services";

export default {
  components: {
    KTableList: function index(resolve) {
      require(["@/components/table/KTableList.vue"], resolve);
    }
  },
  props: {
    mate: Object,
    tableTitle: String,
    tipsText: String,
    dialogVisible: Boolean,
    showClose: {
      type: Boolean,
      default: false
    },
    formModel: {
      type: String,
      default: "page" // page or dialog
    },
    customerName: String
  },
  data(){
    return{
      tableData: null,  // 列表数据
      selectedLine: [], // 勾选项
    }
  },
  computed: {
    isShow: function(){
      return this.dialogVisible;
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getProcessingOrderCode();
    },
    handleConfirm() {
      let values = {...this.mate.mateFormerHeader.values,...this.selectedLine[0]};
      if (this.formModel === "page") {
        this.mate.mateFormerHeader.values = values;
      }else {
        this.mate.mateFormerLine.values = values;
      }
      this.$emit("handleConfirm");
    },
    closeDialog() {
      this.$emit("handleConfirm");
    },
    /**
     * 行勾选选择
     * checkbox 勾选计算 拿到勾选的序号数组
     * param {Boolean} hasSelected 是否有勾选
     * param {Array} multipleSelection 勾选数组
     * @return void
     */
    handleSelected(hasSelected, multipleSelection) {
      this.selectedLine = multipleSelection;
    },
    /** 加工单编号弹窗事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     */
    getProcessingOrderCode(val) {
      let params = {
        processingOrderCode:'',
        customerName: this.customerName || '',
        fromDateStr:'',
        toDateStr:''
      }
      SERVICES.PROCESSING_PLAN.getProcessingOrderCodeData(params).then(res => {
        let codeData = res.data.mate;
        let params = { total:codeData.total, size:codeData.size, rows:codeData.rows };
        codeData.rows.forEach(row =>{
          row.id = null;
          row.remarks = "";
        })
        this.tableData = SERVICES.PROCESSING_PLAN.processingOrderCodeData(params);
      }).catch(err => {
        this.$message({ type: "warning", message: "获取选择加工单列表失败" });
      });
    },
  }
}
</script>
