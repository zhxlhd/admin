<!-- created by hezhiqiang on 2019/12/12 -->
<!-- 实报实销管理 -->
<template>
  <div>
    <!-- headTable Start -->
    <KTableList
      :mate="mate"
      :mateSearch="mate.mateSearch"
      @btnClick="handleButtons"
      ref="listTable"
      :isIndex="isIndex"
      @isSelected="handleSelected"
      @rowClick="rowClick"
      @resetLineTable="showDetailTable=false"
    />
    <!-- headTable END -->
    <!-- detailTable Start -->
    <KTableLine
      v-if="showDetailTable"
      :mate="mate.mateListLine"
      @actionSelected="lineRowSelected"
      @btnClick="handleButtons"
      @action="handleActions"
      :toSort="toSort"
      ref="lineTable"
      :btnDisable="btnDisable"
      :actDisable="actDisable"
      :actionWidth="actionWidth"
    />
    <!-- detail End -->
    <upload-dialog :uploadDialog="uploadDialog" :uploadParams="uploadAttachmentParams"  @closeDialog="closeDialog"></upload-dialog>
  </div>
</template>
<script>
import KTableList from '@/components/table/KTableList'
import KTableLine from '@/components/table/KTableLine'
import SERVICES from '@/services'
import { LOGISTICS_ORDER_API } from "@/services/apis"
import uploadDialog from "@/components/upload/uploadDialog";

export default {
  components: {
    KTableList,
    KTableLine,
    uploadDialog
  },
  data(){
    return {
      isIndex: true,               // table是否渲染序号
      showDetailTable: false,      // 是否渲染明细行表格
      headRowId: '',               // 头行id
      showSubmitButton: true,      // 提交按钮是否显示
      multipleSelection: [],       // 多选
      searchForm: {},              // 头部搜索表单
      selectedLines: [],           // 勾选明细行
      btnDisable: false,
      actDisable: false,
      uploadDialog: false,           // 上传附件弹窗与否
      uploadAttachmentParams: {      // 上传附件属性配置
        rowId:'', 
        serviceModel:'COMPLETE_REIMBURSEMENT', 
        getMethod:'getCompleteReimbursementAttachMentList', 
        uploadMethod:'uploadAttachMent', 
        deleteMethod:'deleteAttachMent', 
        busType:'logistics_reimbursement' 
      },
      costState: '',             // 判断实报实销是否已存在
      lineId: '',                // 行id
      lineShippingExpensesStatus: '',  // 行船务费用审批状态
      lineLogisticsExpensesStatus: '',  // 行物流商费用审批状态
    }
  },
  props: {
    mate: Object
  },
  created (){
    this.mate.mateSearch.fields.map((item) => { this.searchForm[item.name] = item; });
    this.init();
  },
  mounted () {
    // 获取物流商名称
    this.getProvider();
    // 获取业务实体
    this.getOfficeName();
  },
  watch: {
    mate: function (newMate) {
      this.init();
      this.getProvider();
      this.getOfficeName();
    }
  },
  methods: {
    /**
     * 数据初始化
     * @param void
     * @return void
     */
    init () {
      this.showDetailTable = false;
      this.mate.mateList.rowClick = true;   // 允许单击列表行请求行数据
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
        addCost: () => this.addCost(btn,row),      // 新增实报实销费用
        deleteCost: () => this.deleteCost(btn,row),  // 删除实报实销费用
        approvalShipping: () => this.approvalShipping(btn,row),  // 船务费用审批
        approvalLogistics: () => this.approvalLogistics(btn,row),  // 物流商费用审批
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
        // 修改
        modifyCost: () => this.modifyCost(act,row),
        // 查看
        detailsCost: () => this.detailsCost(act,row),
        // 上传附件
        uploadAttchmennt: () => this.uploadAttchmennt(act,row),
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
    },
    /**
     * 展开明细行列表，并获取对应明细行数据
     * @param {Object} 当前点击行 id
     * @return void
     */
    rowClick (row) {
      this.headRowId = row.id
      // 渲染明细行表格
      this.showDetailTable = true
      // 获取明细行数据
      this.getDetailList();
    },
    /**
     * checkbox 勾选计算 拿到勾选的序号数组
     * param {Boolean} hasSelected 是否有勾选
     * param {Array} multipleSelection 勾选数组 
     * @return void
     */
    lineRowSelected(hasSelected, multipleSelection) {
      this.selectedLines = multipleSelection
    },
    /**
     * 多选控制
     * @param {Boolean} bool 是否有勾选
     * @param {Array} selectedArr 勾选行数据数组
     * @return void
     */
    handleSelected (bool, selectedArr) {
      this.hasSelected = bool;
      this.multipleSelection = selectedArr;
      if (this.hasSelected) {
        this.checkCost();        // 判断实报实销是否已存在
        this.headRowId = this.multipleSelection[0].id
        this.getDetailList();
      }
    },
    /**
     * 判断实报实销是否已存在
     */
    checkCost () {
      SERVICES.COMPLETE_REIMBURSEMENT.checkCompleteReimbursement(this.multipleSelection[0].id).then(res => {
        this.costState = res.data.statusCode
      })
    },
    /**
     * 获取明细行数据
     * @param {object} 点击行的 id数据
     * @return void
     */
    getDetailList () {
      SERVICES.COMPLETE_REIMBURSEMENT.getDetailList(this.headRowId).then((res) => {
        let data = res.data
        if (data.length) {
          this.mate.mateListLine.rows = data
          this.lineId = data[0].id
          this.lineShippingExpensesStatus = data[0].shippingExpensesStatus
          this.lineLogisticsExpensesStatus = data[0].logisticsExpensesStatus
        } else {
          this.mate.mateListLine.rows = []
        }
      })
    },
    /**
     * 新增
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    addCost (btn, row) {
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
      if (this.costState === 40060) {
        this.$message({
          type: 'warning',
          message: '实报实销费用已存在'
        })
        return
      }
      this.$root.handleAction(btn, rowt, function() {});
    },
    /**
     * 船务费用审批
     * @param {Object} btn 当前点击的按钮配置信息
     * @return void
     */
    approvalShipping (btn, row) {
      let multipleSelection = this.multipleSelection;
      if (multipleSelection.length !== 1) {
        // 只能选择一行,不允许选择多行
        this.$message({
          message: this.$t("seladata"), // 请选择一行数据
          type: "warning"
        });
        return;
      }
      if (this.costState === 200) {
        this.$message({
          type: 'warning',
          message: '实报实销费用不存在，请先新增'
        })
        return;
      }
      if (this.lineShippingExpensesStatus === '1') {
        this.$message({
          type: 'warning',
          message: '该船务费用已审批'
        })
        return;
      }
      SERVICES.COMPLETE_REIMBURSEMENT.approvalReimbursementShipping(this.lineId).then(res => {
        if (res.data.statusCode === 200) {
          this.$message({
            type: 'success',
            message: '审批成功'
          });
          this.reRenderList()
        }
      })
    },
    /**
     * 物流费用审批
     * @param {Object} btn 当前点击的按钮配置信息
     * @return void
     */
    approvalLogistics (btn, row) {
      let multipleSelection = this.multipleSelection;
      if (multipleSelection.length !== 1) {
        // 只能选择一行,不允许选择多行
        this.$message({
          message: this.$t("seladata"), // 请选择一行数据
          type: "warning"
        });
        return;
      }
      if (this.costState === 200) {
        this.$message({
          type: 'warning',
          message: '实报实销费用不存在，请先新增'
        })
        return;
      }
      if (this.lineLogisticsExpensesStatus === '1') {
        this.$message({
          type: 'warning',
          message: '该物流商费用已审批'
        })
        return;
      }
      SERVICES.COMPLETE_REIMBURSEMENT.approvalReimbursementLogistics(this.lineId).then(res => {
        if (res.data.statusCode === 200) {
          this.$message({
            type: 'success',
            message: '审批成功'
          });
          this.reRenderList()
        }
      })
    },
    /**
     * 删除
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    deleteCost (btn, row) {
      let selectedLines = this.selectedLines
      // ids 存放勾选多行的id
      let ids = []
      selectedLines.forEach(item => { 
        // 检查勾选项是否可以删除
        if (item.shippingExpensesStatus === '0' && item.logisticsExpensesStatus === '0'){
          ids.push(item.id)
        }
        return;
      });
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
        SERVICES.COMPLETE_REIMBURSEMENT.delete(ids).then(res => {
          if (res.status === 200) {
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
     * 修改
     * @param {Object} act 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    modifyCost (act, row) {
      if (row.shippingExpensesStatus === '1' && row.logisticsExpensesStatus === '1') {
        this.$message({
          type: 'warning',
          message: '船务费用、物流费用已审批，不可修改'
        })
        return
      }
      this.$root.monitor({ url: act.url + row.id })
    },
    /**
     * 查看
     * @param {Object} act 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    detailsCost (act, row) {
       this.$root.monitor({ url: act.url + row.id })
    },
    /**
     * uploadAttchmennt 点击“上传附件”按钮 弹窗提交附件
     * 上传附件
     * @param {Object} act 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    uploadAttchmennt (act, row) {
      this.uploadAttachmentParams.rowId = row.id
      this.uploadDialog = true;
    },
    /**
     * 关闭上传附件弹窗
     * @param void
     * @return void
     */
    closeDialog (bool) {
      this.uploadDialog = false;
      this.getDetailList()
    },
    /**
     * 重新渲染列表页
     * @param void
     * @return void
     */
    reRenderList() {
      this.$root.monitor({ url: LOGISTICS_ORDER_API.COMPLETE_REIMBURSEMENT_LIST});
    },
    /**
     * 获取物流商名称
     * @param void
     * @return void
     */
    getProvider () {
      SERVICES.LOGISTICS_DELIVERY_ORDER.getLogisticsProvider().then(res => {
        if(res.data.length>0){
          let providerOptions = [];
          let data = res.data;
          if(data.length){
            data.forEach(item => {
              providerOptions.push({
                  label: item.providerName,
                  value: item.providerName,
                  id: item.id
              });
            });
            // 物流商名称保存到搜索表单配置中
            this.mate.mateSearch.fields.forEach(item => {
              if (item.name === 'logisticsProviderName') {
                item.options = providerOptions
              }
            })
          }
        }
      });
    },
    /**
     * 获取业务实体
     * @param void
     * @return void
     */
    getOfficeName () {
      SERVICES.LOGISTICS_DELIVERY_ORDER.getOffice().then(res => {
        let data = res.data;
        let businessDivisions = []
        if (data.length) {
          data.forEach(item => {
            if ((item.name == "") || (item.name == undefined) || (item.id == "")) return;
            businessDivisions.push({
              label: item.name,
              value: item.name,
              id: item.id,
            })
          });
          // 业务实体保存到搜索表单配置中
          this.mate.mateSearch.fields.forEach(item => {
            if (item.name === 'officeName') {
              item.options = businessDivisions
            }
          })
        }
      });
    }
  }
}
</script>
<style>
.el-switch__label {
  position: absolute;
  display: none;
  color: #ffffff;
}
/*打开时文字位置设置 */
.el-switch__label--right {
  z-index: 1;
  right: -4px;
}
/*关闭时文字位置设置 */
.el-switch__label--left {
  z-index: 1;
  left: 30px;
}
/*显示文字 */
.el-switch__label.is-active {
  display: block;
  color: #ffffff;
}
.el-switch .el-switch__core,
.el-switch .el-switch__label {
  width: 50px !important;
}
</style>
