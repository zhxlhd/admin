<!-- created by hezhiqiang on 2019/12/16 -->
<!-- 销售订单出货行 -->
<template>
  <div>
    <el-row class="buttonStyle">
      <span>请选择订单行</span>
      <!-- 选择销售订单行按钮 -->
      <span class="selectButton" @click="selectDeliveryNoticeLine()">选择销售订单行</span>
    </el-row>
    <DynamicForm
      ref="dynamicForm"
      :mate="mate.mateSoLineHeader"
      :rules="formRules">
    </DynamicForm>
    <el-dialog title="选择销售订单出货行" width="60%" :visible.sync="SoDeliveryLineVisible" append-to-body :before-close="SoDeliveryLineDialogClose">
      <KTableList 
        :mate="mate"
        :mateSearch="mate.mateSearch"
        @btnClick="handleButtons"
      />
    </el-dialog>
  </div>
</template>
<script>
import KTableList from '@/components/table/KTableList'
import SERVICES from '@/services'
import { LOGISTICS_ORDER_API } from "@/services/apis"

export default {
  components: {
    KTableList,
    DynamicForm: function index(resolve){
      require(["@/components/form/DynamicForm.vue"], resolve);
    }
  },
  data(){
    return {
      multipleSelection: [],          // 多选
      deliveryNoticeForm: {},         // 送货通知表单数据
      SoDeliveryLineVisible: false,   // 选择销售订单出货行弹窗
      searchForm: {},                 // 搜索表单
      formRules: {
        // 业务实体
        officeName: [{required: true,message: "该选择销售订单行数据"}],
        // 出货数量
        deliveryQuantity: [{required: true,message: "该输入项为必输项",trigger: "blur"}],
        // 总毛重
        roughWeight: [{required: true,message: "该输入项为必输项",trigger: "blur"}],
        // 总体积
        totalVolume: [{required: true,message: "该输入项为必输项",trigger: "blur"}],
      }
    }
  },
  props: {
    mate: Object
  },
  created (){
    // 送货通知表单数据
    this.mate.mateSoLineHeader.fields.map((item) => { this.deliveryNoticeForm[item.name] = item; });
  },
  mounted (){
  },
  watch: {
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
        // 确认
        confirmSelect: () => this.confirmSelect(btn,row),
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(btn, row);
    },
    /**
     * 获取销售订单出货行列表
     * @param void
     * @return void
     */
    getList () {
      SERVICES.LOGISTICS_DELIVERY_ORDER.getSoDeliveryLineList().then(res => {
        this.mate.mateList.rows = res.data.mate.mateList.rows
        this.mate.mateList.total = res.data.mate.mateList.total
      })
    },
    /**
     * 选择销售订单出货行
     */
    selectDeliveryNoticeLine () {
      this.SoDeliveryLineVisible = true
      this.getList();           // 获取销售订单出货行列表
      this.getOfficeName();     // 获取机构
      this.getOrgName();        // 获取库存组织
      this.getCustomerCode();   // 获取客户编码
      this.getOrderNum();       // 获取订单编号
    },
    /**
     * 选择销售订单出货行，点确认
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    confirmSelect (btn, row) {
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
      this.SoDeliveryLineVisible = false
      this.$set(this.mate.mateSoLineHeader.values,'soHeaderLineId',multipleSelection[0].id)
      this.$set(this.mate.mateSoLineHeader.values,'officeName',multipleSelection[0].officeName)
      this.$set(this.mate.mateSoLineHeader.values,'officeId',multipleSelection[0].officeId)
      this.$set(this.mate.mateSoLineHeader.values,'orgName',multipleSelection[0].orgName)
      this.$set(this.mate.mateSoLineHeader.values,'orgId',multipleSelection[0].orgId)
      this.$set(this.mate.mateSoLineHeader.values,'customerCode',multipleSelection[0].customerNum)
      this.$set(this.mate.mateSoLineHeader.values,'customerName',multipleSelection[0].customerName)
      this.$set(this.mate.mateSoLineHeader.values,'soNum',multipleSelection[0].soNum)
      this.$set(this.mate.mateSoLineHeader.values,'deliveryAddress',multipleSelection[0].customerAddr2Name)
      this.$set(this.mate.mateSoLineHeader.values,'materialCode',multipleSelection[0].itemCode)
      this.$set(this.mate.mateSoLineHeader.values,'materialName',multipleSelection[0].itemName)
      this.$set(this.mate.mateSoLineHeader.values,'materialSpec',multipleSelection[0].model)
      this.$set(this.mate.mateSoLineHeader.values,'materialUnit',multipleSelection[0].unit)
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
            businessDivisions.push({
              label: item.name,
              value: item.id,
              id: item.id,
            })
          });
          // 业务实体保存到搜索表单配置中
          this.mate.mateSearch.fields.forEach(item => {
            if (item.name === 'officeId') {
              item.options = businessDivisions
            }
          })
        }
      });
    },
    /**
     * 获取库存组织
     * @param void
     * @return void
     */
    getOrgName () {
      SERVICES.LOGISTICS_DELIVERY_ORDER.getOrgName().then(res => {
        let data = res.data;
        let orgName = []
        if (data.length) {
          data.forEach(item => {
            orgName.push({
              label: item.name,
              value: item.id,
              id: item.id,
            })
          });
          // 业务实体保存到搜索表单配置中
          this.mate.mateSearch.fields.forEach(item => {
            if (item.name === 'orgId') {
              item.options = orgName
            }
          })
        }
      });
    },
    /**
     * 获取客户编码
     * @param void
     * @return void
     */
    getCustomerCode () {
      SERVICES.LOGISTICS_DELIVERY_ORDER.getCustomerCode().then(res => {
        let data = res.data;
        let customerCode = []
        if (data.length) {
          data.forEach(item => {
            customerCode.push({
              label: item.code,
              value: item.id,
              id: item.id,
            })
          });
          // 客户编码保存到搜索表单配置中
          this.mate.mateSearch.fields.forEach(item => {
            if (item.name === 'customerId') {
              item.options = customerCode
            }
          })
        }
      });
    },
    /**
     * 获取订单编号
     * @param void
     * @return void
     */
    getOrderNum () {
      SERVICES.LOGISTICS_DELIVERY_ORDER.getOrderNum().then(res => {
        let data = res.data;
        let soNumber = []
        if (data.length) {
          data.forEach(item => {
            soNumber.push({
              label: item.soNum,
              value: item.soNum,
              id: item.id,
            })
          });
          // 订单编号保存到搜索表单配置中
          this.mate.mateSearch.fields.forEach(item => {
            if (item.name === 'soNum') {
              item.options = soNumber
            }
          })
        }
      });
    },
  }
}
</script>
<style lang="scss" scoped>
.el-form-item__label {
  line-height: inherit;
}
.el-form--inline > * {
  margin-right: 10px;
}
.el-form-item {
  margin: 15px 20px 2px 0px;
}
.leftFloat .el-row {
  float: left;
  width: 250px;
}
.leftFloat .el-row input {
  width: 250px;
}
.leftFloat .el-form-item {
  margin: 0;
}
.leftFloat .button {
  float: left;
}
.el-form--inline .el-form-item {
  width: 200px;
  display: inline-block;
  margin-right: 10px;
  vertical-align: top;
}
.el-form-item.is-required .el-form-item__label:before {
  content: "";
}
.el-form-item.is-required .el-form-item__label:after {
  content: "*";
  color: #ff4949;
  margin-right: 4px;
}
.el-cascader {
  width: 100%;
}
.hidden {
  display: none;
}
h4 {
  margin-top: 40px;
  margin-bottom: 10px;
}
.el-select {
  width: 100%;
}
.el-date-editor.el-input {
  width: 100%;
}
.el-form--inline.el-form--label-top .el-form-item__content {
  width: 90%;
}
.leftFloat .el-form--inline .el-form-item {
  margin-right: 10px;
}
.tbutton {
  margin: 3px 0;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}
.fbutton {
  margin: 5px 0;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}
.el-input__suffix {
  right: 80px;
}
.el-form-item--mini.el-form-item {
  margin: 6px;
}
.el-input--mini .el-input__inner {
  width: 80%;
}
.el-dialog__header {
  padding: 10px 10px 0;
}
.el-dialog__body {
  padding: 10px 10px;
}
.el-button--mini {
  padding: 7px 9px;
}
.pbutton {
  margin: 3px 0;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}
.buttonStyle {
  margin: 10px 0;
  span:nth-child(1) {
    margin-left: 30px;
  }
  .selectButton {
    cursor: pointer;
    margin-left: 10px;
    padding: 8px 15px;
    color: #ffffff;
    border-radius: 4px;
    background-color: #49afcd;
  }
}
</style>
