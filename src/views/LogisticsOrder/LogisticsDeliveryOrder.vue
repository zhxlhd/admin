<!-- created by hezhiqiang on 2019/11/27 -->
<!-- 提货单 -->
<template>
  <div>
    <KTableList :mate="mate" :mateSearch="mate.mateSearch" ref="listTable" :isIndex="isIndex" @btnClick="handleButtons" @rowClick="getRowData" @action="handleActions" />
  </div>
</template>
<script>
import KTableList from '@/components/table/KTableList'
import SERVICES from '@/services'
import { LOGISTICS_ORDER_API } from "@/services/apis"

export default {
  components: {
    KTableList
  },
  data(){
    return {
      isIndex: true,              // table是否渲染序号
      multipleSelection: [],      // 多选
    }
  },
  props: {
    mate: Object
  },
  created (){
    // let provicerValue = this.$store.state.LogisticsProviderInfo.logisticsProviderId;
    // let provicerPhoneValue = this.$store.state.LogisticsProviderInfo.logisticsProviderPhone;
    // let provicerEmailValue = this.$store.state.LogisticsProviderInfo.logisticsProviderEmail;
    // if (provicerValue && provicerPhoneValue && provicerEmailValue) {
    //   this.$store.dispatch("LogisticsProviderInfo/setLogisticsProviderId", '')
    //   this.$store.commit("LogisticsProviderInfo/setLogisticsProviderPhone", '')
    //   this.$store.commit("LogisticsProviderInfo/setLogisticsProviderEmail", '')
    // }
  },
  mounted (){
    // 获取出货机构
    this.getOfficeName();
  },
  watch: {
    mate: function (newMate) {
      this.getOfficeName();
    }
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
    handleButtons (btn, row, selection) {
      this.multipleSelection = selection;
      let action = btn.action;
      const btnEvents = {
        // 修改
        modify: () => this.modify(btn, row),
        // 删除
        delete: () => this.delete(btn, row),
        // 提交审批
        submitApproval: () => this.submitApproval(btn, row),
        // 审批通过
        approval: () => this.approval(btn, row),
        // 驳回
        rejectOrder: () => this.rejectOrder(btn, row),
        // 废弃
        discard: () => this.discard(btn, row),
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
        checkDetail: () => this.detail(act, row),
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
    },
    /**
     * 修改
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    modify (btn, row) {
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
      // 判断提货单是否可以修改
      if (multipleSelection[0].state === '0' || multipleSelection[0].state === '7') {
        this.$root.handleAction(btn, rowt, function() {});
      } else {
        this.$message({
          type: 'warning',
          message: '该状态下提货单不允许修改'
        })
        return;
      }
      
    },
    /**
     * 删除
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    delete (btn, row) {
      let multipleSelection = this.multipleSelection
      // ids 存放勾选多行的id
      let ids = []
      multipleSelection.forEach(item => { ids.push(item.id) });
      if (ids.length > 0) {
        // 判断提货单是否可以删除
        if (multipleSelection[0].state === '0' || multipleSelection[0].state === '7') {
          this.$confirm(
          this.$t("TIPS_WARNING.IRREVERSIBLE_DELETION"),
          this.$t("TITLE_TEXT.TIPS"),
          {
            confirmButtonText: this.$t("BUTTON_TEXT.CONFIRM"), // 确认
            cancelButtonText: this.$t("BUTTON_TEXT.CANCEL"), // 取消
            type: "warning"
          }
        ).then(() => {
          SERVICES.LOGISTICS_DELIVERY_ORDER.deleteDeliveryOrder(ids).then(res => {
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
        } else {
        this.$message({
            type: "warning",
            message: this.$t("TIPS_WARNING.CANNOT_BE_DELETED") // 不能删除
          });
        }
      }
    },
    /**
     * 提交审批
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    submitApproval (btn, row) {
      let multipleSelection = this.multipleSelection;
      if (multipleSelection.length !== 1) {
        // 只能选择一行,不允许选择多行
        this.$message({
          message: this.$t("seladata"), // 请选择一行数据
          type: "warning"
        });
        return;
      }
      // 判断提货单是否可以提交审批
      if (multipleSelection[0].state === '0' || multipleSelection[0].state === '7') {
        SERVICES.LOGISTICS_DELIVERY_ORDER.approvalDreliveryOrder(multipleSelection[0].id,1).then(res => {
          let status = res.data.statusCode
          if (status === 200) {
            this.$message({
              type: 'success',
              message: '该提货单数据已提交审批'
            })
            this.reRenderList()
          }
        })
      } else {
        this.$message({
          message: "该状态不允许提交审批", 
          type: "warning"
        });
        return;
      }
    },
    /**
     * 审批通过
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    approval (btn, row) {
      let multipleSelection = this.multipleSelection;
      if (multipleSelection.length !== 1) {
        // 只能选择一行,不允许选择多行
        this.$message({
          message: this.$t("seladata"), // 请选择一行数据
          type: "warning"
        });
        return;
      }
      if (multipleSelection[0].state !== '1') {
        this.$message({
          message: "该状态不允许审批通过", 
          type: "warning"
        });
        return;
      }
      SERVICES.LOGISTICS_DELIVERY_ORDER.approvalDreliveryOrder(multipleSelection[0].id,2).then(res => {
        let status = res.data.statusCode
        if (status === 200) {
          this.$message({
            type: 'success',
            message: '该提货单数据已审批通过'
          })
          this.reRenderList()
        }
      })
    },
    /**
     * 驳回
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    rejectOrder (btn, row) {
      let multipleSelection = this.multipleSelection;
      if (multipleSelection.length !== 1) {
        // 只能选择一行,不允许选择多行
        this.$message({
          message: this.$t("seladata"), // 请选择一行数据
          type: "warning"
        });
        return;
      }
      if (multipleSelection[0].state !== '1') {
        this.$message({
          message: "该状态不允许驳回", 
          type: "warning"
        });
        return;
      }
      SERVICES.LOGISTICS_DELIVERY_ORDER.approvalDreliveryOrder(multipleSelection[0].id,7).then(res => {
        let status = res.data.statusCode
        if (status === 200) {
          this.$message({
            type: 'success',
            message: '该提货单数据已驳回'
          })
          this.reRenderList()
        }
      })
    },
    /**
     * 废弃
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    discard (btn, row) {
      let multipleSelection = this.multipleSelection;
      let status = multipleSelection[0].state
      if (multipleSelection.length !== 1) {
        // 只能选择一行,不允许选择多行
        this.$message({
          message: this.$t("seladata"), // 请选择一行数据
          type: "warning"
        });
        return;
      }
      if (status === '1' || status === '2' || status === '3' || status ==='7') {
        SERVICES.LOGISTICS_DELIVERY_ORDER.approvalDreliveryOrder(multipleSelection[0].id,6).then(res => {
          let status = res.data.statusCode
          if (status === 200) {
            this.$message({
              type: 'success',
              message: '该提货单数据已废弃'
            })
            this.reRenderList()
          }
        })
      } else {
        this.$message({
          message: "该状态不允许废弃", 
          type: "warning"
        });
        return;
      }
    },
    /**
     * 查看
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
    */
   detail (act, row) {
     this.$root.monitor({ url: act.url + row.id + '&isEdit=0'})
     return
   },
    /**
     * 请求当前操作行的查看详情中的列表行数据
     * 获取数据后渲染详情列表行
     * @param {Object} row 当前操作行的行数据
     * @param {Object} act 当前操作按钮的配置信息
     * @return void
     */
    getRowData (row, act) {
      
    },
    /**
     * 重新渲染列表页
     * @param void
     * @return void
     */
    reRenderList() {
      this.$root.monitor({ url: LOGISTICS_ORDER_API.LOGISTICS_DELIVERY_ORDER_LIST});
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
          this.mate.mateSearch.fields.forEach(item =>{
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
