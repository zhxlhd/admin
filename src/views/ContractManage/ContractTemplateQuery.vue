<!-- created by yxj on 2020/01/13 -->
<!-- 合同模板查询 -->
<template>
  <div>
    <k-table-list ref="listTable"
                  :mate="mate"
                  :mateSearch="mate.mateSearch"
                  @action="handleActions"
                 ></k-table-list>
    <upload-dialog :uploadTitle="uploadTitle" :uploadDialog="uploadDialog" :uploadParams="uploadAttachmentParams"  @closeDialog="closeDialog"></upload-dialog>
  </div>
</template>
<script>
  import KTableList from '@/components/table/KTableList'
  import SERVICES from "@/services"
  import uploadDialog from "@/components/upload/uploadDialog";

  export default {
    components: {
      KTableList,uploadDialog

    },
    data(){
      return {
        multipleSelection: [],             // 勾选项数组
        uploadDialog: false,               // 下载附件弹窗与否
        uploadAttachmentParams: {
          rowId:'',
          serviceModel:'CONTRACT_MANAGE',
          getMethod:'getAttachMentListWithContractTemplateDraft',
          uploadMethod:'uploadAttachMent',
          deleteMethod:'deleteAttachMent',
          busType:'contract_template_draft',
          justRead: true
        }, // 上传附件属性配置
        uploadTitle: '下载附件'
      }
    },
    props: {
      mate: Object
    },
    created() {
      this.getContractTypeList();
    },
    methods: {
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
          downAttachment: () => this.showDownAttachment(act, row), // 上传附件
          default: () => { return }
        }
        return (actions[action] || actions.default)(act, row);
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
       * 关闭上传附件弹窗
       * @param void
       * @return void
       * ***/
      closeDialog (bool) {
        this.uploadDialog = false;
      },
      /**
       * showdownAttachment 点击“下载附件”按钮 弹窗提交附件
       * @param {Object} act 当前操作按钮配置信息
       * @param {Object} row 当前操作行数据
       * @return void
       */
      showDownAttachment(act, row) {
        this.uploadAttachmentParams.rowId = row.id;
        this.uploadDialog = true;
      },
    },
    watch: {
      mate: function (newMate) {
        this.getContractTypeList();
      }
    }
  }
</script>
