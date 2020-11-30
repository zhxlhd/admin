<!-- created by yxj on 2020/01/14 -->
<!-- 合同审批 -->
<template>
  <div>
    <k-table-list ref="listTable"
                  :mate="mate"
                  :mateSearch="mate.mateSearch"
                  @rowClick="handleRowClick"
                  @btnClick="handleButtons"
                  @resetLineTable="lineTableFlag=false"></k-table-list>
    <!-- 底部 lineList Start -->
    <!-- 配置 checkType 不渲染勾选列 -->
    <main-table ref="lineTable"
                v-if="lineTableFlag"
                :mateList="mate.mateListLine"
                :checkType="'noCheck'"></main-table>
    <!-- 底部 lineList End -->
    <!-- 审批意见 Start -->
    <el-dialog :visible.sync="reasonDialogVisible" width="30%">
      <el-form :rules="reasonRules" ref="reasonForm" :model="reasonData">
        <el-form-item label="审批意见" prop="reason" class="my-form-item">
          <el-input v-model="reasonData.reason"
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 6}"
                    :maxlength="maxLength"
                    placeholder="审批意见"
          ></el-input>
          <span class="span-length" v-if="maxLength">{{reasonData.reason.length || '0'}} / {{maxLength}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleConfirm()">{{$t('BUTTON_TEXT.CONFIRM')}}</el-button>
      </div>
    </el-dialog>
    <!-- 审批意见 End -->
  </div>
</template>
<script>
  import KTableList from '@/components/table/KTableList'
  import SERVICES from "@/services"

  export default {
    components: {
      KTableList,
      MainTable: function index(resolve) {
        require(["@/components/table/MainTable.vue"], resolve);
      }
    },
    data(){
      return {
        lineTableFlag: false,              // 行Table 是否渲染
        multipleSelection: [],             // 勾选项数组
        reasonDialogVisible: false,    // 审批意见是否显示
        maxLength: 100,                // 审批意见长度限制
        reasonData: {
          reasonBtnType:'',            // 同意/驳回按钮标识
          reason: ""
        },
        reasonRules: {
          reason: [
            { required: true, message: "该输入项为必输项", trigger: "blur" }
          ]
        },
      }
    },
    props: {
      mate: Object
    },
    created() {
      this.getContractTypeList();
      this.init();
    },
    methods: {
      /**
       * 数据初始化
       * @param void
       * @return void
       */
      init () {
        this.lineTableFlag = false;
        this.mate.mateList.rowClick = true; // 允许单击列表行请求行数据
      },
      /**
       * 请求当前操作行的列表行数据
       * @param {Object} row 当前操作行的行数据
       * @param {Object} act 当前操作按钮的配置信息
       * @return void
       */
      handleRowClick (row, act) {
        let id = row.id;
        // 获取行数据
        this.getLines(id, 'contract');
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
          // 待审批状态(approvalStatus=2)的可以同意(type=3)
          agree: () => this.approval('3',['2'],'TIPS_WARNING.FAILURE_TO_APPROVAL'),
          // 已审批状态(approvalStatus=2)的可以驳回(type=4)
          reject: () => this.approval('4',['2'],'TIPS_WARNING.CANNOT_BE_REJECTED'),
          default: () => { return }
        }
        return (btnEvents[action] || btnEvents.default)(btn, row);
      },
      /**
       * 同意\驳回
       * @param {Object} type 按钮的审批类型，分为同意按钮、驳回按钮
       * @param {Array} status
       * @param {Object} tips 不符合操作的提示语
       * @return void
       */
      approval (type,status,tips) {
        let multipleSelection = this.multipleSelection;
        if (multipleSelection.length !== 1) {
          // 只能选择一行,不允许选择多行
          this.$message({
            message: this.$t("seladata"), // 请选择一行数据
            type: "warning"
          });
          return;
        }
        let ids = [];
        multipleSelection.forEach(item => {
          if(status.includes(item.approvalStatus.toString())){
            ids.push(item.id);
          }
        });
        if(ids.length>0) {
          this.reasonDialogVisible = true;
          this.reasonData.reasonBtnType = type;
          this.$nextTick(() => {
            this.$refs['reasonForm'].resetFields();
          });
        } else {
          this.$message({
            type: "warning",
            message: this.$t(tips) // 不能同意/驳回
          });
        }
      },
      /**
       * 获取合同类型
       * @param void
       * @return void
       */
      getContractTypeList() {
        SERVICES.CONTRACT_MANAGE.getContractTypeList().then(res => {
          if(res.data.length>0){
            let contractTypeOptions = [];
            let data = res.data;
            if(data.length){
              data.forEach(item => {
                contractTypeOptions.push({
                  label: item.contractTypeName,
                  value: item.id,
                  id: item.id
                });
              });
              // 合同类型保存到表单配置中
              // 物流商名称保存到表单配置中
              let mate = this.mate;
              mate.mateSearch.fields.map((item) => {
                if(item.name == 'contractTypeId') {
                  item.options = contractTypeOptions;
                }
              });
            }
          }
        });
      },
      /**
       * 审批意见提交
       * @param void
       * @return void
       */
      handleConfirm() {
        // 审批意见必填
        this.$refs.reasonForm.validate(valid => {
          if (valid) {
            // 审批意见
            let reason = this.reasonData.reason;
            // 审批意见行 id
            const ids = { id: this.multipleSelection.map(r => r.id) };
            // 审批意见提交
            SERVICES.CONTRACT_MANAGE.approveWithContract({ businessId:ids.id[0], operationType:this.reasonData.reasonBtnType, businessType:'contract',approvalComment:reason }).then(res => {
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
            // this.handleStatus(this.btn.status, ids.id, rejectReason);
            // 关闭驳回原因弹窗
            this.reasonDialogVisible = false;
          }
        });
      },
      /** 获取行数据
       * @param {String} id 列表行 id, type = busType
       * @return void
       */
      getLines (id, type) {
        SERVICES.CONTRACT_MANAGE.getLines(id,type).then(res =>{
          let data = res.data.data;
          if (data && data.length){
            this.$set(this.mate.mateList, "lineRows", data);
            if (this.mate.mateList.rowClick) {
              // 显示 行Table
              this.lineTableFlag = true;
              // 刷新数据
              this.mate.mateListLine.rows = data;
            }
          }
        })
      },
    },
    watch: {
      mate: function (newMate) {
        this.init();
        this.getContractTypeList();
      }
    }
  }
</script>
<style scoped>
  .my-form-item {
    position: relative
  }
  .my-form-item span.span-length {
    position: absolute;
    right: 10px;
    bottom: -5px;
    color: #BEBEBE;
    font-size: 12px;
  }
</style>
