<!-- created by zhongxiaolong on 2019/08/21 -->
<!-- 待接收任务 -->
<template>
  <div>
    <!-- 列表 Start -->
    <k-table-list ref="listTable" 
                  :mate="mate" 
                  :mateSearch="mate.mateSearch" 
                  @btnClick="handleButtons" 
                  @action="handleActions" 
                  @rowClick="getRowData"></k-table-list>
    <!-- 列表 eND -->
    <!-- 分配弹窗 Start -->
    <el-dialog title="请选择分配用户" 
               :visible.sync="responsibleDialogVisible" 
               width="30%" 
               :before-close="closeResponsibleDialog">
      <el-form ref="responsibleForm" 
               v-if="reRenderResponsible" 
               :rules="responsibleRules" 
               :model="responsibleData">
        <el-form-item label="分配给" prop="chargeId">
          <el-select v-model="responsibleData['chargeId']"
                     filterable
                     @change="handleChange(responsibleData['chargeId'])"
            ><el-option v-for="item of usersList" 
                        :label="item.label" 
                        :value="item.value" 
                        :key="item.name"></el-option>
            </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="DialogClickOK()">{{$t('BUTTON_TEXT.CONFIRM')}}</el-button>
        <el-button type="primary" @click="closeResponsibleDialog()">{{$t('BUTTON_TEXT.CANCEL')}}</el-button>
      </div>
    </el-dialog>
    <!-- 分配弹窗 End -->
  </div>
</template>
<script>
import KTableList from '@/components/table/KTableList'
import SERVICES from '@/services'
import { LANGS } from "@/i18n/lang"
import { SMART_ORDER_API } from "@/services/apis"

export default {
  components: {
    KTableList
  },
  props: {
    mate: Object
  },
  data(){
    return {
      page: 1,               // 默认显示第1页
      pageSize: 10,          // 默认10条/页
      multipleSelection: [], // 列表勾选项
      usersList: [],         // 责任人列表
      responsibleDialogVisible: false, // 责任人弹窗显示与否
      reRenderResponsible: true,       // 用于重新渲染责任人弹窗
      responsibleData:{      // 责任人 id 和名称
        chargeId: '',
        chargeName: ''
      },
      responsibleRules:{     // 责任人验证规则
        chargeId:[{ required: true, message: '该输入项为必输项', trigger: 'blur'}]
      },
      status: '',  // 当前行状态
      rowId: ''    // 当前行 id
    }
  },
  created (){
    // this.init();
  },
  mounted (){

  },
  methods: {
    init () {
      // 获取责任人列表
      // this.getUsersList();
    },
    /**
     * 头部按钮控制
     * 点击按钮触发对应方法
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} rowId 勾选行 id数据  rowId.id
     * @param {Array} selection 勾选行数据
     * @return void
     */
    handleButtons (btn, rowId, selection) {
      this.multipleSelection = selection;
      let action = btn.action;
      const btnEvents = {
        cancel: (btn, rowId) => this.cancelTask(btn, rowId),
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(btn, rowId);
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
        receive: (act, row) => this.receiveTask(act, row),           // 接收任务
        distribution: (act, row) => this.distributionTaskDialog(act, row), // 分配任务
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
    },
    /**
     * 请求当前操作行的查看详情中的列表行数据
     * 获取数据后渲染详情列表行
     * @param {Object} row 当前操作行的行数据
     * @param {Object} act 当前操作按钮的配置信息
     * @return void
     */
    getRowData (row, act){
      SERVICES.BASE.getDetail(act.url, row.orderId).then(res =>{
        let data = res.data;
        this.headFormData = data.smartOrder ? data.smartOrder : {};
        this.listLineData = data.taskList ? data.taskList : [];
        if (this.listLineData.length > 0){
          this.$set(this.mate.mateList, "lineRows", this.listLineData);
        }
      })
    },
    /**
     * 取消当前任务
     * 点“取消”按钮，取消此任务，
     * 需要弹出提示框“是否确定要取消此任务？”，
     * 确认后，将当前任务设置为“取消”状态，流转到下一任务节点。
     * @param {Object} btn 当前按钮配置信息
     * @param {Object} rowId 勾选项id数组  rowId.id 取 id 数组
     * @return void
     */
    cancelTask (btn, rowId) {
      this.$confirm(
        this.$t("TIPS_WARNING.CANCEL_TASK"),
        this.$t("TITLE_TEXT.TIPS"),
        {
          confirmButtonText: this.$t("BUTTON_TEXT.CONFIRM"), // 确认
          cancelButtonText: this.$t("BUTTON_TEXT.CANCEL"), // 取消
          type: "warning"
        }
      ).then(() => {
        SERVICES.RECEIVE_TASK.cancelTask(rowId.id).then(res => this.reRenderList())
      }).catch(() => {
        this.$message({
          type: "info",
          message: this.$t("TIPS_WARNING.CANCEL_OPERATION") // 已取消取消
        });
      });
    },
    /**
     * 接收任务
     * @param {Object} act 当前按钮配置信息
     * @param {row} row 当前任务行内容
     * @return void
    */
    receiveTask (act, row) {
      SERVICES.RECEIVE_TASK.acceptlTask(row.id).then(res => this.reRenderList())
    },
    /**
     * 分配任务
     * 把任务分配给指定用户责任人
     * @param {String} id 当前任务id
     * @param {String} chargeId 指定责任人 id
     * @param {String} chargeName 指定责任人名称
     * @return void
    */
    distributionTask (id, chargeId, chargeName) {
      SERVICES.RECEIVE_TASK.distributeTask(id, chargeId, chargeName).then(res => this.reRenderList())
    },
    /**
     * 任务分配用户弹窗
     * 点击分配按钮同事请求责任人列表
     * 显示责任人弹窗
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
     */
    distributionTaskDialog (act, row) {
      this.rowId = row.id;
      // 获取责任人列表
      if (this.usersList.length =='0') this.getUsersList();
      this.reasonDialogShow();
    },
    /*
     * 关闭责任人弹窗
     * 提示用户关闭确认 
     * 清空责任人、重置表单验证
     * @param void
     * @return void
     */
    closeResponsibleDialog () {
      // 责任人
      let rejectReason = this.responsibleData.chargeId;
      if(rejectReason){
        this.$confirm(this.$t('TIPS_WARNING.UN_SAVE_TIPS'))
        .then(() => {
          this.reasonDialogHide();
          this.reRenderResponsibleDialog();
        }).catch(() => {});
      }else{
        this.reasonDialogHide();
        this.$refs.responsibleForm.resetFields();
      }
    },
    /**
     * 责任人弹窗显示
     * @param void
     * @return void
    */
    reasonDialogShow () {
      this.responsibleDialogVisible = true;
    },
    /**
     * 责任人弹窗关闭
     * @param void
     * @return void
    */
    reasonDialogHide () {
      this.responsibleDialogVisible = false;
    },
    /**
     * 责任人确认 
     * 验证责任人必填 提交责任人 重置责任人弹窗
     * @param void
     * @return void
     */
    DialogClickOK () {
      let _this = this; 
      let status = "PAUSE";
      this.$refs.responsibleForm.validate((valid) => {
        if (valid) {
          // 责任人
          let chargeId = this.responsibleData.chargeId;
          let chargeName = this.responsibleData.chargeName;
          // 请求分配服务接口
          this.distributionTask(this.rowId, chargeId, chargeName);
          // 隐藏责任人弹窗
          this.reasonDialogHide();
          // 重新渲染
          this.reRenderResponsibleDialog();
        }
      });
    },
    /**
     * 重新渲染责任人弹窗
     * 清空责任人、重置表单验证
     * @param void
     * @return void
     */
    reRenderResponsibleDialog() {
      this.responsibleData.chargeId = "";
      this.reRenderResponsible = false;
      this.$refs.responsibleForm.resetFields();
      this.$nextTick(() => {
        this.reRenderResponsible = true;
      });
    },
    /**
     * 重新渲染列表页
     * @param void
     * @return void
     */
    reRenderList() {
      this.$root.monitor({ url: SMART_ORDER_API.RECEIVE_TASK_MAIN_LIST });
    },
    uploadAttachment(rowId) { // 查看附件
      SERVICES.MY_TASK.getAttachMentList(rowId).then(res =>{
        if(res.data.statusCode == 200){
            this.$set(this.mate.mateList, "attatchmentRows", res.data.data);
        }else{
            this.$notify({
                title: '温馨提示',
                message: this.$createElement('i', { style: 'color: teal'}, '获取附件列表失败')
            });
        }
      });
    },
    getProgressData(id) { // 查看详情里面的“查看进度” 获取查看进度数据
      SERVICES.MY_TASK.checkProgress(id).then(res =>{
        if(res.data.statusCode == 200){
            this.$set(this.mate.mateList, "progressRows", res.data.data);
        }else{
            this.$notify({
                title: '温馨提示',
                message: this.$createElement('i', { style: 'color: teal'}, '查看进度数据失败')
            });
        }
      });
    },
    /**
     * 获取责任人列表
     * 拿到列表保存 用户名称和 id
     * @param void
     * @return void
     */
    getUsersList () {
      SERVICES.BASE.getUsersList().then(res =>{
        let data = res.data;
        if (data.length=='0') return;
        data.forEach(item =>{
          if ((item.username == "") || (item.id == "")) return;
          this.usersList.push({ 
            'label': item.username,
            'value': item.id,
            'id': item.id,
          })
        })
      });
    },
    /**
     * 责任人下拉改变操作
     * 当改变责任人的时候修改当前责任人数据的责任人名称
     * @param {String} id 当前责任人 id
     * @return void
     */
    handleChange (id){
      let user = this.usersList.find(item => item.id === id);
      if (user.id) this.responsibleData.chargeName = user.label;
    },
  }
}
</script>
