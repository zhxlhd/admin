<!-- created by yxj on 2019/10/12 -->
<!-- 排产计划 -->
<template>
  <div>
    <k-table-list ref="listTable"
                  :mate="mate"
                  :mateSearch="mate.mateSearch"
                  @rowClick="getRowData"
                  @action="handleActions"
                  @initOperations="initOperations"
                  @btnClick="handleButtons"></k-table-list>
    <!--  打印弹出全屏框 start-->
    <el-dialog title="打印生产计划单" :visible.sync="printDialogVisible" fullscreen class="my-dialog">
      <table border="1" cellspacing="0" cellpadding="0" ref="print" style="width:920px;margin: 0 auto;">
        <tr><th colspan="5" style="font-size: 15px">{{printTable.tableName}}</th></tr>
        <div v-for="(print, idx) in printTable.table" :key='idx'>
          <tr>
            <td style="width: 200px; overflow-x: hidden; vertical-align: middle;" rowspan="8">
              <img :src="print.attachmentUrl" v-if="print.attachmentUrl && print.attachmentUrl !== ''" style="width: 100%;display: block">
            </td>
            <td width= "20%">订单编号</td>
            <td width= "20%">{{print.planCode}}</td>
            <td width= "20%">行号</td>
            <td width= "20%">{{print.processingOrderLineNum}}</td>
          </tr>
          <tr>
            <td width= "20%">开工日期</td>
            <td width= "20%">{{print.startDate}}</td>
            <td width= "20%">完工日期</td>
            <td width= "20%">{{print.endDate}}</td>
          </tr>
          <tr>
            <td width= "20%">物料编码</td>
            <td width= "20%">{{print.materialsCode}}</td>
            <td width= "20%">品名</td>
            <td width= "20%">{{print.materialsName}}</td>
          </tr>
          <tr>
            <td width= "20%">规格</td>
            <td width= "20%">{{print.specs}}</td>
            <td width= "20%">单位</td>
            <td width= "20%">{{print.unit}}</td>
          </tr>
          <tr>
            <td width= "20%">加工要求</td>
            <td width= "20%">{{print.processingRequire}}</td>
            <td width= "20%">生产数量</td>
            <td width= "20%">{{print.processingCount}}</td>
          </tr>
          <tr>
            <td width= "20%">备注</td>
            <td width= "20%">{{print.remark}}</td>
            <td width= "20%">生产线</td>
            <td width= "20%">{{print.assemblyLine}}</td>
          </tr>
          <tr>
            <td width= "20%">客户名称</td>
            <td width= "20%">{{print.customerName}}</td>
            <td width= "20%">技术方案编码</td>
            <td width= "20%">{{print.technicalProposalCode}}</td>
          </tr>
          <tr>
            <td width= "20%">技术方案</td>
            <td width= "20%" colspan="3">{{print.technicalProposalDesc}}</td>
          </tr>
        </div>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="printDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="printOk">打 印</el-button>
      </span>
    </el-dialog>
    <!--  打印弹出全屏框 end-->
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
      printDialogVisible: false,  // 打印全屏弹框
      printTable: { table:[], tableName:'' }              // 打印表格
    }
  },
  props: {
    mate: Object
  },
  created (){
  },
  mounted() {
    this.initOperations();
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
      SERVICES.PROCESSING_PLAN.getDetails(row.id).then(res =>{
        let data = res.data;
        let listLineData = data.mate.mateData.lineList ? data.mate.mateData.lineList : [];
        if (listLineData.length > 0){
          this.$set(this.mate.mateList, "lineRows", listLineData);
        }
      });
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
        // 录入状态(status=1)、驳回的（status=4）的可以提交审批(type=2)
        submitApprove: () => this.approval('2',['1','4'],'TIPS_WARNING.FAILURE_TO_SUBMIT_FRO_APPROVAL'),
        // 待审批状态(status=2)的可以审批(type=3)
        approve: () => this.approval('3',['2'],'TIPS_WARNING.FAILURE_TO_APPROVAL'),
        // 待审批状态(status=2)的可以驳回(type=4)
        reject: () => this.approval('4',['2'],'TIPS_WARNING.CANNOT_BE_REJECTED'),
        delete: (btn, row) => this.delete(btn, row),
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(btn, row);
    },
    /**
     * 删除加工单
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    delete (btn, row) {
      let multipleSelection = this.multipleSelection;
      // ids 存放删除多行的id
      let ids = [];
      // 检查勾选项是否都是录入和驳回状态 才能取消 1录入、2待审批、3已审批、4已驳回
      multipleSelection.forEach(item => {
        if(item.status == "1" || item.status == "4" ) {
          ids.push(item.id);
        }
      });
      if (ids.length == multipleSelection.length) {
        this.$confirm(
            this.$t("TIPS_WARNING.IRREVERSIBLE_DELETION"),
            this.$t("TITLE_TEXT.TIPS"),
            {
                confirmButtonText: this.$t("BUTTON_TEXT.CONFIRM"), // 确认
                cancelButtonText: this.$t("BUTTON_TEXT.CANCEL"), // 取消
                type: "warning"
            }
        ).then(() => {
          SERVICES.PROCESSING_PLAN.delete(ids).then((res) => {
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
     * 审批\提交审批加工单
     * @param {Object} type 按钮的审批类型，分为审批按钮、提交审批按钮
     * @param {Array} status 允许审批的状态，录入状态(status=1)、已驳回状态（status=4）的可以提交审批(type=2)；待审批状态(status=2)的可以审批(type=3)
     * @param {Object} tips 不符合操作的提示语
     * @return void
     */
    approval (type,status,tips) {
      let multipleSelection = this.multipleSelection;
      // lineIds 存放提交审批、审批多行的id
      let ids = [];
      // 检查勾选项是否都是录入和驳回状态 才能取消 1录入、2待审批、3已审批、4已驳回
      multipleSelection.forEach(item => {
        if(status.includes(item.status.toString())){
          ids.push(item.id);
        }
      });
      if(ids.length == multipleSelection.length) {
        SERVICES.PROCESSING_PLAN.approve(ids,type).then(res => {
          if(res.status == 200) {
            this.$message({
                type: "success",
                message: '提交操作成功'
            });
            this.reRenderList();
          }else{
            this.$message({
                type: "warning",
                message: '提交操作失败'
            });
          }
        });
      } else {
        this.$message({
            type: "warning",
            message: this.$t(tips) // 不能审批/提交审批
        });
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
        print: (act, row) => this.print(act, row),            // 打印
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
    },
    /**
     * 打印订单
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
     */
    print (act, row) {
      this.printDialogVisible = true;
      this.printTable.tableName = row.planName;
      SERVICES.PROCESSING_PLAN.print(row.id).then(res =>{
        this.printTable.table = res.data;
      });
    },
    printOk() {
      this.$print(this.$refs.print);
    },
    /** 初始化行操作列按钮的状态
     * 只允许修改录入状态和驳回状态的加工单
     * enableEdit 是否允许编辑
     * ......可以对相关按钮进行初始化
     * @param void
     * @return void
     */
    initOperations() {
      let rows = this.mate.mateList.rows;
      // 如果没有行返回
      if (!rows.length) {
        return
      }else {
        rows.forEach(item => {
          item.enableEdit = true;
        });
      }
      rows.forEach(item => {
        let status = item.status;
        if(status !== 1 && status !== 4){
          item.enableEdit = false;
        }
      });
    },
  },
  watch: {
    mate: function (newMate) {
      this.initOperations();
    }
  }
}
</script>
