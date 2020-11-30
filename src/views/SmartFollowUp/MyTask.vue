<!-- created by zhongxiaolong on 2019/08/20 -->
<!-- 我的任务 -->
<template>
  <div>
    <k-table-list
      ref="listTable"
      :mate="mate"
      :mateSearch="mate.mateSearch"
      :actionWidth="actionWidth"
      :checkType="'radio'"
      @btnClick="handleButtons"
      @action="handleActions"
      @rowClick="getRowData"></k-table-list>
    <!-- 完成并跳转/退回节点 -->
    <el-dialog
      :visible.sync="taskNodeDialogVisible"
      width="30%"
      :showClose="showClose">
      <el-form
        v-if="reRenderReturned"
        :rules="taskNodeRules"
        ref="returnedForm"
        :model="taskNodeData">
        <el-form-item :label="dialogLabel" prop="taskNodeId">
          <el-select
            filterable
            v-model="taskNodeData.taskNodeId"
            placeholder="选择任务节点">
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="(item, index) of taskNodeList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="DialogClickOK()">{{$t("BUTTON_TEXT.CONFIRM")}}</el-button>
        <el-button type="primary" @click="taskNodeDialogHide()">{{$t("BUTTON_TEXT.CANCEL")}}</el-button>
      </div>
    </el-dialog>
    <!-- 更新进度   -->
    <el-dialog
      title="更新进度"
      :visible.sync="updateProgressParams.updateProgressDialog"
      custom-class="my-dialog"
      :before-close="closeUpdateProgress">
      <div>
        <div class="btns-box">
          <el-button size="mini" @click="addProgress">增加进度</el-button>
          <el-button
            size="mini"
            :disabled="updateProgressParams.updateProgressMultipleSelection.length == 0"
            @click="deleteProgress">删除进度</el-button>
        </div>
        <el-table
          :data="mate.mateList.progressRows"
          border
          height="300"
          width="100%"
          @selection-change="handleProgressSelectionChange">
          <el-table-column
            type="selection"
            width="55"
            :selectable="isChecked"
          ></el-table-column>
          <el-table-column
            type="index"
            label="序号"
            min-width="50"
          ></el-table-column>
          <el-table-column
            prop="type"
            label="类型"
            :formatter="typeFormatter"
            min-width="80"
          ></el-table-column>
          <el-table-column
            prop="progressDesc"
            label="进度描述"
            min-width="180"
          ></el-table-column>
          <el-table-column
            prop="createAt"
            label="时间"
            min-width="150"
          ></el-table-column>
          <el-table-column
            prop="progress"
            label="进度"
            min-width="80"
            :formatter="progressFormatter"
          ></el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 更新进度里面的新增进度    -->
    <el-dialog
      title="新增进度"
      :visible.sync="updateProgressParams.addProgressDialog"
      append-to-body>
      <el-form
        :model="updateProgressParams.addProgressData"
        :rules="addProgressRules"
        ref="addProgress"
        style="width: 50%">
        <el-form-item label="进度(%)" label-width="120px" prop="progress">
          <el-input
            v-model.number="updateProgressParams.addProgressData.progress"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="进度描述" label-width="120px">
          <el-input
            type="textarea"
            v-model="updateProgressParams.addProgressData.progressDesc"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateProgressParams.addProgressDialog = false">取 消</el-button>
        <el-button type="primary" @click="addProgressOk('addProgress')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 上传附件   -->
    <upload-dialog
      :uploadDialog="uploadDialog"
      :uploadParams="uploadAttachmentParams"
      @closeDialog="closeDialog"
    ></upload-dialog>

    <!-- 设计备注 -->
    <el-dialog
      title="请选择设计备注"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleCloseOutward"
      center>
      <div class="outward_button_box" v-for="(item, index) in outwardFlagButtons" :key="index">
        <el-button type="default" @click="outwardConfirm(item.value)">{{ item.label }}</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="handleCloseOutward">取 消</el-button>
        <!-- <el-button type="primary" @click="handleCloseOutward">确 定</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>
<script>
import KTableList from "@/components/table/KTableList";
import SERVICES from "@/services";
import { LANGS } from "@/i18n/lang";
import { SMART_ORDER_API } from "@/services/apis";
import { pickIdsFromList } from "@/utils/util";
import uploadDialog from "@/components/upload/uploadDialog";
import { BaseConstant } from '@/constant/BaseConstant';

export default {
  components: { KTableList, uploadDialog },
  props: {
    mate: Object
  },
  data() {
    var checkProgress = (rule, value, callback) => {
      if (value == "" && value !== 0) {
        return callback(new Error("进度不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (parseInt(value) > 100 || parseInt(value) < 0) {
            callback(new Error("进度为0-100之间的数字"));
          } else {
            callback();
          }
        }
      }, 300);
    };
    return {
      headFormData: {}, // 查看详情表单头数据
      listLineData: [], // 查看详情列表行数据
      dialogLabel: "", // 节点弹窗 label
      operationName: "", // 操作名称 如 returned(退回)、finishAndJump(完成并跳转)
      multipleSelection: [], // 勾选行
      taskNodeDialogVisible: false, // 退回节点弹窗是否展示
      uploadAttachmentDialog: false, // 上传附件弹窗是否展示
      outwardFlag: '0',  // 设计备注  ‘0’ 默认是否
      outwardId: '',     // 设计备注任务 id
      outwardData: null, // 设计备注任务操作信息
      dialogVisible: false, // 是否外发弹窗
      outwardFlagButtons: BaseConstant.SELECT_OPTIONS.OUTWARD_FLAG,
      taskNodeRules: {
        taskNodeId: [
          {
            required: true,
            message: "该输入项为必输项",
            trigger: "blur",
            disabled: false
          }
        ]
      },
      taskNodeData: {
        taskNodeId: "",
        taskNodeName: ""
      },
      reRenderReturned: true, // 用于重新渲染弹窗
      taskNodeList: [],
      rowId: "", // 回退当前节点 id
      showClose: false, // dialog右上角xx隐藏
      radioHasSelected: "",
      updateProgressParams: {
        //
        updateProgressDialog: false,
        updateProgressMultipleSelection: [],
        rowId: "",
        orderId: "",
        addProgressDialog: false,
        addProgressData: {
          progress: "",
          progressDesc: ""
        }
      },
      addProgressRules: {
        progress: [{ validator: checkProgress, trigger: "blur" }]
      },
      uploadDialog: false, // 上传附件弹窗
      uploadAttachmentParams: {
        rowId: "",
        serviceModel: "MY_TASK",
        getMethod: "getAttachMentList",
        uploadMethod: "uploadAttachMent",
        deleteMethod: "deleteAttachMent",
        busType: ""
      } // 上传附件属性配置 前期做的没有busType
    };
  },
  computed: {
    actionWidth: function() {
      return this.mate.mateList.actions.length * 60 + 80;
    }
  },
  mounted() {
    
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
    handleButtons(btn, ids, selection) {
      var _this = this;
      let act = btn.action;
      let taskInfo;
      let isOutward = selection[0].taskName === '设计' ? true : false;
      this.multipleSelection = selection;
      switch (act) {
        case "cancel": // 取消
          taskInfo = {
            tips: "TIPS_WARNING.CANCEL_TASK",
            operate: "cancelTask",
            operateMessage: "取消当前任务"
          };
          this.operateTask(ids.id, taskInfo);
          break;
        case "finish": // 完成
          taskInfo = {
            tips: "TIPS_WARNING.FINISH_TASK",
            operate: "finishTask",
            operateMessage: "完成当前任务"
          };
          isOutward ? this.handleOutwardFlag(ids.id, taskInfo, this.operateTask) : this.operateTask(ids.id, taskInfo);
          break;
        case "finishAndJump": // 完成
          this.dialogLabel = "请选择跳转的节点";
          isOutward ? this.handleOutwardFlag(ids.id, act, this.taskNodeDialogShow) : this.taskNodeDialogShow(ids.id, act);
          break;
        case "returned": // 退回
          this.dialogLabel = "请选择退回的节点";
          this.taskNodeDialogShow(ids.id, act);
          break;
      }
    },
    /**
     * actions 操作
     * 点击 action 根据按钮配置的 action 做对应操作
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
     */
    handleActions(act, row) {
      let action = act && act.action;
      const actions = {
        updateProgress: () => this.showUpdateProgress(act, row), // 跟新进度
        uploadAttachment: () => this.showUploadAttachment(act, row), // 上传附件
        default: () => {
          return;
        }
      };
      return (actions[action] || actions.default)(act, row);
    },
    /**
     * 节点操作
     * 退回或者完成并跳转
     * @param {String} cid 当前任务 id
     * @param {String} tid 目标节点 id
     * @return void
     */
    handleTaskNode(cid, tid) {
      if (this.operationName === "returned") {
        SERVICES.MY_TASK.returnedTask(cid, tid).then(res => {
          this.reRenderList();
        });
      } else {
        SERVICES.MY_TASK.jumpToTask(cid, tid, this.outwardFlag).then(res => {
          this.reRenderList();
        });
      }
    },
    /** 显示节点选择弹窗
     * 获取退回和完成并跳转选择节点列表
     * @param {String} id 当前行 id
     * @param {String} name 退回还是完成并跳转
     * @return void
     */
    taskNodeDialogShow(id, name) {
      console.log(this.outwardFlag);
      this.getTaskNodeList(id);
      this.taskNodeDialogVisible = true;
      this.rowId = id;
      this.operationName = name;
      this.$nextTick(() => {
        this.$refs.returnedForm.resetFields();
      });
    },
    taskNodeDialogHide() {
      this.taskNodeDialogVisible = false;
    },
    /**
     * 操作节点选择确认
     * 验证节点必填 提交操作节点
     * @param void
     * @return void
     */
    DialogClickOK() {
      // 验证驳回必填
      this.$refs.returnedForm.validate(valid => {
        if (valid) {
          // 操作节点
          let taskNodeId = this.taskNodeData.taskNodeId;
          // 操作任务 id
          let currentTaskId = this.rowId;
          // 节点操作
          this.handleTaskNode(currentTaskId, taskNodeId);
          // 关闭回退节点弹窗
          this.taskNodeDialogHide();
        }
      });
    },
    /**
     * 请求当前操作行的查看详情中的列表行数据
     * 获取数据后渲染详情列表行
     * @param {Object} row 当前操作行的行数据
     * @param {Object} act 当前操作按钮的配置信息
     * @return void
     */
    getRowData(row, act) {
      SERVICES.MY_TASK.getDetail(row.orderId).then(res => {
        let data = res.data.data;
        if (data.length > 0) {
          this.$set(this.mate.mateList, "lineRows", data);
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
     * 获取任务节点列表
     * @param {String} id 订单 id
     * @return void
     */
    getTaskNodeList(id) {
      SERVICES.MY_TASK.getTaskList(id).then(res => {
        this.taskNodeList = [];
        let data = res.data.data;
        if (data.length < 1) return;
        data.forEach(item => {
          this.taskNodeList.push({
            label: item.taskName,
            value: item.id,
            index: item.serialNumber
          });
        });
        let curTaskNum = this.taskNodeList.find(
          item => item.label == this.multipleSelection[0].taskName
        ).index;
        if (this.operationName === "returned") {
          // 退回
          this.taskNodeList = this.taskNodeList.filter(
            item => item.index < curTaskNum
          );
        } else {
          // 完成并跳转
          this.taskNodeList = this.taskNodeList.filter(
            item => item.index > curTaskNum
          );
          // TODO
          // 最后节点处理 this.taskNodeList.length === 0;
        }
      });
    },
    /** 展示更新进度弹窗
     * @param {Object} act 当前操作按钮的配置信息
     * @param {Object} row 当前操作行的行数据
     * @return void
     */
    showUpdateProgress(act, row) {
      let updateProgressParams = this.updateProgressParams;
      updateProgressParams.rowId = row.id;
      updateProgressParams.orderId = row.orderId;
      this.getProgressData(row.id);
      updateProgressParams.updateProgressDialog = true;
    },
    /** 查看详情里面的“查看进度” 获取查看进度数据
     * @param {String} id 行 id
     * @return void
     */
    getProgressData(id) {
      SERVICES.MY_TASK.checkProgress(id).then(res => {
        if (res.data.statusCode == 200) {
          this.$set(this.mate.mateList, "progressRows", res.data.data);
        } else {
          this.$notify({
            title: "温馨提示",
            message: this.$createElement(
              "i",
              { style: "color: teal" },
              "查看进度数据失败"
            )
          });
        }
      });
    },
    /** 操作任务按钮 finishTask
     * @param {String} id 行 id
     * @param {} taskInfo
     * @param {} refresh
     * @param {} needCloseDialog
     * @return void
     */
    operateTask(id, taskInfo, refresh, needCloseDialog) {
      console.log(this.outwardFlag);
      this.$confirm(this.$t(taskInfo.tips), this.$t("TITLE_TEXT.TIPS"), {
        confirmButtonText: this.$t("BUTTON_TEXT.CONFIRM"), // 确认
        cancelButtonText: this.$t("BUTTON_TEXT.CANCEL"), // 取消
        type: "warning"
      })
        .then(() => {
          SERVICES.MY_TASK[taskInfo.operate](id, this.outwardFlag).then(res => {
            if (res.data.statusCode == 200) {
              this.$notify({
                title: "温馨提示",
                message: this.$createElement(
                  "i",
                  { style: "color: teal" },
                  taskInfo.operateMessage + "成功"
                )
              });
              if (refresh && refresh !== "") {
                this.getProgressData(refresh);
                if (needCloseDialog) this.closeAddProgressDialog();
              } else {
                this.reRenderList();
              }
            } else {
              this.$notify({
                title: "温馨提示",
                message: this.$createElement(
                  "i",
                  { style: "color: teal" },
                  taskInfo.operateMessage + "失败：" + res.data.message
                )
              });
            }
          });
        })
        .catch(err => {});
    },
    operateTaskNoConfirm(id, taskInfo, refresh, needCloseDialog) {
      SERVICES.MY_TASK[taskInfo.operate](id).then(res => {
        if (res.data.statusCode == 200) {
          this.$notify({
            title: "温馨提示",
            message: this.$createElement(
              "i",
              { style: "color: teal" },
              taskInfo.operateMessage + "成功"
            )
          });
          if (refresh && refresh !== "") {
            this.getProgressData(refresh);
            if (needCloseDialog) this.closeAddProgressDialog();
          } else {
            this.reRenderList();
          }
        } else {
          this.$notify({
            title: "温馨提示",
            message: this.$createElement(
              "i",
              { style: "color: teal" },
              taskInfo.operateMessage + "失败"
            )
          });
        }
      });
    },
    typeFormatter(row, column) {
      // 类型转换
      let typeName = "";
      switch (row.type) {
        case "0":
          typeName = "系统";
          break;
        case "1":
          typeName = "手动";
          break;
        default:
          break;
      }
      return typeName;
    },
    progressFormatter(row, column) {
      // 进度加单位
      return row.progress + "%";
    },
    handleProgressSelectionChange(val) {
      // 多选进度列表
      this.updateProgressParams.updateProgressMultipleSelection = val;
    },
    deleteProgress() {
      // 删除进度
      let taskInfo = {
        tips: "TIPS_WARNING.DELETE_PROGRESS",
        operate: "deleteProgress",
        operateMessage: "删除当前进度"
      };
      let ids = pickIdsFromList(
        this.updateProgressParams.updateProgressMultipleSelection
      );
      this.operateTask(ids, taskInfo, this.updateProgressParams.rowId);
    },
    isChecked(row, rowIndex) {
      if (row.type == 0) {
        return false;
      } else {
        return true;
      }
    },
    addProgress() {
      // 新增进度
      this.updateProgressParams.addProgressData.progress = "";
      this.updateProgressParams.addProgressData.progressDesc = "";
      this.updateProgressParams.addProgressDialog = true;
    },
    addProgressOk(formName) {
      // 新增进度确认提交
      this.$refs[formName].validate(valid => {
        if (valid) {
          let addParams = {
            orderId: this.updateProgressParams.orderId,
            taskId: this.updateProgressParams.rowId,
            type: "1",
            progress: this.updateProgressParams.addProgressData.progress,
            progressDesc: this.updateProgressParams.addProgressData.progressDesc
          };
          this.operateTaskNoConfirm(
            addParams,
            { operate: "addProgress", operateMessage: "新增进度" },
            this.updateProgressParams.rowId,
            true
          );
        } else {
          return false;
        }
      });
    },
    closeAddProgressDialog() {
      // 关闭新增进度弹窗
      this.updateProgressParams.addProgressDialog = false;
    },
    showUploadAttachment(act, row) {
      // 上传附件弹窗
      this.uploadAttachmentParams.rowId = row.id;
      this.uploadDialog = true;
    },
    /** 查看附件
     * @param {String} id 行 id
     * @return void
     */
    uploadAttachment(rowId) {
      SERVICES.MY_TASK.getAttachMentList(rowId).then(res => {
        if (res.data.statusCode == 200) {
          this.$set(this.mate.mateList, "attatchmentRows", res.data.data);
        } else {
          this.$notify({
            title: "温馨提示",
            message: this.$createElement(
              "i",
              { style: "color: teal" },
              "获取附件列表失败"
            )
          });
        }
      });
    },
    /**
     * 关闭上传附件弹窗
     * @param void
     * @return void
     * ***/
    closeDialog(bool) {
      this.uploadDialog = false;
    },
    /** 关闭跟新进度弹窗
     * 由于列表页增加了 进度和进度描述字段 关闭弹窗时需要刷新列表页面
     */
    closeUpdateProgress() {
      this.updateProgressParams.updateProgressDialog = false;
      this.reRenderList();
    },
    /**
     * 完成、完成并跳转
     * 如果当前节点是设计询问 设计备注
     * 并把参数传给后台 outwardFlag
     */
    handleOutwardFlag(id, data, callback){
      this.dialogVisible = true;
      this.outwardId = id;
      this.outwardData = data;
      this.callback = callback;
      // this.$alert(this.$t('TIPS_WARNING.IS_OUTBOUND_ORDER'), {
      //   showCancelButton: true,
      //   showClose: false,
      //   confirmButtonText: this.$t('yes'),
      //   cancelButtonText: this.$t('no'),
      //   callback: action => {
      //     this.outwardFlag = (action === 'confirm') ? '1' : '0';
      //     callback(id, data);
      //   }
      // });

    },
    outwardConfirm(val){
      this.outwardFlag = val;
      this.callback(this.outwardId, this.outwardData);
      this.handleCloseOutward();
    },
    /** 关闭/取消设计备注弹窗
     * @param void
     * @return void
     */
    handleCloseOutward(){
      this.dialogVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
  .outward_button_box{
    margin-bottom: 10px;
    .el-button {
      width: 100%;
    }
  }
</style>
