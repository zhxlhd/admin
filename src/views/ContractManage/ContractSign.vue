<!-- created by yxj on 2020/02/11 -->
<!-- 合同签订 -->
<template>
  <div>
    <k-table-list ref="listTable"
                  :mate="mate"
                  :mateSearch="mate.mateSearch"
                  @btnClick="handleButtons"></k-table-list>
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
        multipleSelection: [],             // 勾选项数组
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
    },
    methods: {
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
          // 归档 归档传值1，取消归档传值0
          archived: () => this.approval('1'),
          // 取消归档
          cancelArchived: () => this.approval('0'),
          default: () => { return }
        }
        return (btnEvents[action] || btnEvents.default)(btn, row);
      },
      /**
       * 归档\取消归档
       * @param {Object} type 按钮的审批类型，分为归档按钮、取消归档按钮
       * @return void
       */
      approval (type) {
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
          if(item.isArchived !== type) {
            ids.push(item.id)
          }else {
            this.$message({
              message: "当前归档状态不符合操作",
              type: "warning"
            });
          }
        });
        if(ids.length == 1) {
          SERVICES.CONTRACT_MANAGE.archivedContract(ids.toString(), type).then(res => {
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
    },
    watch: {
      mate: function (newMate) {
        this.getContractTypeList();
      }
    }
  }
</script>
