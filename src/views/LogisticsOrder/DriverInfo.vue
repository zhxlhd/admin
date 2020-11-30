<!-- created by hezhiqiang on 2019/12/04 -->
<!-- 司机资料维护 -->
<template>
  <div>
    <!-- headTable Start -->
    <KTableList
      :mate="mate"
      :mateSearch="mate.mateSearch"
      ref="listTable"
      :isIndex="isIndex"
      @btnClick="handleButtons"
      @rowClick="rowClick"
      @action="handleActions"
      @isSelected="handleSelected"
      @resetLineTable="showDetailTable=false"
    />
    <!-- headTable END -->
    <!-- detailTable Start -->
    <KTableLine
      v-if="showDetailTable"
      :mate="mate.mateListLine"
      @action="handleActions"
      :toSort="toSort"
      ref="lineTable"
      :btnDisable="btnDisable"
      :actDisable="actDisable"
      :actionWidth="actionWidth"
      :checkType="'noCheck'"
    />
    <!-- detail End -->
    <!-- driverInfoDialog Start -->
    <el-dialog title="维护司机资料" width="80%" :visible.sync="dialogVisible"  :before-close="DialogClose" >
      <dynamic-form ref="dialogForm" :mate="mate.mateFormerHeader" :rules="formRules" :eventCfg="headerFormEventConfig" @events="handleEvents"></dynamic-form>
      <el-row type="flex" justify="start">
        <el-button size="mini" v-show="showSubmitButton" @click="submitForm">{{$t('BUTTON_TEXT.CONFIRM')}}</el-button>
        <el-button size="mini" @click="DialogClose">{{$t('BUTTON_TEXT.CANCEL')}}</el-button>
      </el-row>
    </el-dialog>
    <!-- driverInfoDialog End -->
    <upload-dialog :uploadDialog="uploadDialog" :uploadParams="uploadAttachmentParams"  @closeDialog="closeDialog"></upload-dialog>
    <!--approvalDialog Start -->
    <el-dialog title="审批司机资料" width="30%" :visible.sync="approvalDialogVisible" :before-close="approvalDialogClose">
      <el-button size="mini" @click="submitApproval">提交审批</el-button>
      <el-button size="mini" @click="Approval">审批通过</el-button>
      <el-button size="mini" @click="rejectApproval">审批驳回</el-button>
    </el-dialog>
    <!--approvalDialog End -->
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
    uploadDialog,
    DynamicForm: function index(resolve){
      require(["@/components/form/DynamicForm.vue"], resolve);
    }
  },
  data(){
    return {
      isIndex: true,              // table是否渲染序号
      showDetailTable: false,     // 是否渲染明细行表格
      headRowId: '',              // 头行id
      showSubmitButton: true,     // 提交按钮是否显示
      multipleSelection: [],       // 多选
      hasSelected: false,
      dialogForm: {},              // 弹框表单          
      dialogVisible: false,        // 司机资料表单弹出框显示隐藏
      btnDisable: false,
      actDisable: false,
      driverInfoState: '',          // 判断司机资料是否存在
      formData: {},                 // 司机信息数据
      approvalDialogVisible: false,     // 审批司机资料弹框
      formRules: {
        ladingBillCode: [{required: true, message: "该输入项为必输项", trigger: "blur", disabled: true}],
        logisticsProviderName: [{required: true, message: "该输入项为必输项", trigger: "blur", disabled: true}],
        caCarNum: [{required: true, message: "该输入项为必输项", trigger: "blur"}],
        // driverName: [{required: true, message: "该输入项为必输项", trigger: "blur"}],
        // driverID: [{required: true, message: "该输入项为必输项", trigger: "blur"}],
      },
      uploadDialog: false,           // 上传附件弹窗与否
      uploadAttachmentParams: {      // 上传附件属性配置
        rowId:'', 
        serviceModel:'DRIVER_INFO', 
        getMethod:'getDriverInfoAttachMentList', 
        uploadMethod:'driverInfoAttachMentUpload', 
        deleteMethod:'deleteAttachMent', 
        busType:'driver_info' 
      },
      headerFormEventConfig: {
        // 大陆车牌
        caCarNum: { change: true },
        // 司机姓名
        driverName: { change: true }
      },
      carNumData: [],         // 大陆车牌下拉值
      driverNameData: [],     // 司机姓名下拉值
    }
  },
  props: {
    mate: Object
  },
  created (){
    this.mate.mateFormerHeader.fields.map((item) => { this.dialogForm[item.name] = item; });
    this.init();
  },
  mounted () {
    this.getProvider();      // 获取物流商名称
    this.getOfficeName();    // 获取业务实体
  },
  watch: {
    mate: function (newMate) {
      this.init();
      this.getProvider();         // 获取物流商名称
      this.getOfficeName();       // 获取业务实体
      if (this.hasSelected ==  true) {
        this.getPlateNumber();      // 获取大陆车牌
        this.getDriverName();       // 获取司机姓名
      }
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
      this.mate.mateList.rowClick = true; // 允许单击列表行请求行数据
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
        // 新增司机资料
        addDriverInfo: () => this.addDriverInfo(btn, row),
        // 修改司机资料
        modifyDriverInfo: () => this.modifyDriverInfo(btn, row),
        // 查看司机资料
        detailsDriverInfo: () => this.detailsDriverInfo(btn, row),
        // 删除司机资料
        deleteDriverInfo: () => this.deleteDriverInfo(btn, row),
        // 审批司机资料
        approvalDriverInfo: () => this.approvalDriverInfo(btn, row),
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
        // 上传/查看附档
        uploadAttachment: () => this.uploadAttachment(act, row),
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
    },
    /**
     * /** 动态表单事件管理
     * @param {String} event 事件名称
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     */
    handleEvents(event, val, name) {
      const eventControl = {
        change: (val, name) => this.handleChange(val, name),
        default: () => { return }
      }
      return (eventControl[event] || eventControl.default)(val, name);
    },
     /** change 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return {Function} change事件执行函数
     */
    handleChange(val, name) {
      this.isDirty = true;
      const changeControl = {
        caCarNum: (val, name) => this.handleCaCarNumChange(val),
        driverName: (val, name) => this.handleDriverNameChange(val),
        default: () => { return }
      }
      return (changeControl[name] || changeControl.default)(val);
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
      this.getDetailList()
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
        this.checkDriverInfo();     // 判断司机信息详情是否已存在
        this.driverInfoDetail();    // 获取司机资料信息
        this.getPlateNumber();      // 获取大陆车牌
        this.getDriverName();       // 获取司机姓名
      }
    },
    /**
     * 获取明细行数据
     * @param {object} 点击行的 id数据
     * @return void
     */
    getDetailList () {
      SERVICES.DRIVER_INFO.getDetailList(this.headRowId).then((res) => {
        let data = res.data
        this.mate.mateListLine.rows = data
      })
    },
    /**
     * 提交司机资料表单数据
     * @param void
     * @return void
     */
    submitForm () {
      let _this = this;
      let mate = {};
      this.$refs['dialogForm'].$refs["form"].validate((valid) => {
        if (valid) {
          mate = this.mate.mateFormerHeader.values;
          mate.ladingBillId = this.multipleSelection[0].id
          mate.logisticsProviderId = this.multipleSelection[0].logisticsProviderId
          if (!this.formData.id) {
            SERVICES.DRIVER_INFO.save(mate).then(res =>{
              let status = res.data.statusCode
              if (status === 200) {
                this.$message({
                  type: 'success',
                  message: '司机资料添加成功'
                })
                this.reRenderList()
                this.dialogVisible = false
              }
            })
          } else {
            mate.id = this.formData.id
            SERVICES.DRIVER_INFO.save(mate).then(res =>{
              let status = res.data.statusCode
              if (status === 200) {
                this.$message({
                  type: 'success',
                  message: '司机资料修改成功'
                })
                this.reRenderList()
                this.dialogVisible = false
              }
            })
          }
        }
      })
    },
    /**
     * 关闭司机资料弹窗
     * @param void
     * @return void
     */
    DialogClose (){
      this.dialogVisible = false
      this.reRenderList()
    },
    /**
     * 新增司机资料
     * @param {Object} btn 当前点击的按钮配置信息
     * @param void
     * @return void
     */
    addDriverInfo (btn, row) {
      let multipleSelection = this.multipleSelection;
      // 只能勾选一条数据
      if (multipleSelection.length !== 1) {
        this.$message({
          message: this.$t("seladata"),
          type: "warning"
        });
        return;
      }
      if (this.driverInfoState !== 200 ) {
        this.$message({
          type: 'warning',
          message: '司机信息已存在，请勿重复添加'
        })
        return
      } 
      this.showSubmitButton = true
      // 显示弹窗
      this.dialogVisible = true;
      this.clearDialogFrom(this.mate.mateFormerHeader.values)
    },
    /**
     * 修改司机资料
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {object} row 勾选行 id数据
     * @return void
     */
    modifyDriverInfo (btn, row) {
      // 只能勾选一条数据
      if (this.multipleSelection.length !== 1) {
        this.$message({
          message: this.$t("seladata"),
          type: "warning"
        });
        return;
      };
      // 判断司机信息是否维护
      if (this.driverInfoState !== 40059 ) {
        this.$message({
          type: 'warning',
          message: '司机信息未维护，请添加司机资料'
        })
        return
      };
      // 判断司机资料是否可以修改
      if (this.formData.state === '1' || this.formData.state === '2') {
        this.$message({
          type: 'warning',
          message: '该状态下司机资料不允许修改'
        })
        return
      };
      this.showSubmitButton = true
      // 显示弹窗
      this.dialogVisible = true;
      this.mate.mateFormerHeader.values = this.formData
    },
    /**
     * 查看司机资料
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {object} row 勾选行 id数据
     * @return void
     */
    detailsDriverInfo (btn, row) {
      // 只能勾选一条数据
      if (this.multipleSelection.length !== 1) {
        this.$message({
          message: this.$t("seladata"),
          type: "warning"
        });
        return;
      };
      // 判断司机信息是否维护
      if (this.driverInfoState !== 40059 ) {
        this.$message({
          type: 'warning',
          message: '司机信息未维护，请添加司机资料'
        })
        return
      } 
      this.showSubmitButton = false
      // 显示弹窗
      this.dialogVisible = true;
      this.mate.mateFormerHeader.values = this.formData
    },
    /**
     * 删除司机资料
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {object} row 勾选行 id数据
     * @return void
     */
    deleteDriverInfo (btn, row) {
      // 只能勾选一条数据
      if (this.multipleSelection.length !== 1) {
        this.$message({
          message: this.$t("seladata"),
          type: "warning"
        });
        return;
      };
      // 判断司机信息是否维护
      if (this.driverInfoState !== 40059 ) {
        this.$message({
          type: 'warning',
          message: '司机信息未维护，请添加司机资料'
        })
        return
      };
      // 判断司机信息是否可以删除
      if (this.formData.state === '1' || this.formData.state === '2') {
        this.$message({
          type: 'warning',
          message: '该状态下司机资料不允许删除'
        })
        return
      };
      this.$confirm(
        this.$t("TIPS_WARNING.IRREVERSIBLE_DELETION"),
        this.$t("TITLE_TEXT.TIPS"),
        {
          confirmButtonText: this.$t("BUTTON_TEXT.CONFIRM"), // 确认
          cancelButtonText: this.$t("BUTTON_TEXT.CANCEL"), // 取消
          type: "warning"
        }
      ).then(() => {
        SERVICES.DRIVER_INFO.driverInfoDriverInfoDelete(this.formData.id).then(res => {
          let status = res.data.statusCode
          if (status === 200) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.reRenderList()
          }
        })
      }).catch(() => {
        this.$message({
          type: "info",
          message: this.$t("TIPS_WARNING.CANCEL_DELETION") // 已取消删除
        });
      });
    },
    /**
     * 审批司机资料
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {object} row 勾选行 id数据
     * @return void
     */
    approvalDriverInfo (btn, row) {
      // 只能勾选一条数据
      if (this.multipleSelection.length !== 1) {
        this.$message({
          message: this.$t("seladata"),
          type: "warning"
        });
        return;
      };
      // 判断司机信息是否维护
      if (this.driverInfoState !== 40059 ) {
        this.$message({
          type: 'warning',
          message: '司机信息未维护，请添加司机资料'
        })
        return
      } 
      this.approvalDialogVisible = true
    },
    /**
     * 上传附件
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
     */
    uploadAttachment(act, row) {
      this.uploadAttachmentParams.rowId = row.id
      this.uploadDialog = true;
    },
    /**
     * 提交审批按钮
     * @param {Object} row 当前操作行线路 id数据
     * @return void
     */
    submitApproval () {
      this.approvalDialogVisible = false
      if (this.formData.state === '0' || this.formData.state === '3') {
        SERVICES.DRIVER_INFO.approvalDriverInfo(this.multipleSelection[0].id,1).then(res => {
          let status = res.data.statusCode
          if (status === 200) {
            this.$message({
              type: 'success',
              message: '该司机资料已提交审批'
            })
            this.reRenderList()
          }
        })
      } else {
        this.$message({
          type: 'warning',
          message: '该状态下司机资料不允许提交审批'
        })
        return
      }
    },
    /**
     * 审批通过按钮
     * @param {Object} row 当前操作行线路 id数据
     * @return void
     */
    Approval () {
      this.approvalDialogVisible = false
      if (this.formData.state!== '1') {
        this.$message({
          type: 'warning',
          message: '该状态下司机资料不允许审批通过'
        })
        return
      }
      SERVICES.DRIVER_INFO.approvalDriverInfo(this.multipleSelection[0].id,2).then(res => {
        let status = res.data.statusCode
        if (status === 200) {
          this.$message({
            type: 'success',
            message: '该司机资料已审批'
          })
          this.reRenderList()
        }
      })
    },
    /**
     * 审批驳回按钮
     * @param {Object} row 当前操作行线路 id数据
     * @return void
     */
    rejectApproval () {
      this.approvalDialogVisible = false
      if (this.formData.state !== '1') {
        this.$message({
          type: 'warning',
          message: '该状态下司机资料不允许审批驳回'
        })
        return
      }
      SERVICES.DRIVER_INFO.approvalDriverInfo(this.multipleSelection[0].id,3).then(res => {
        let status = res.data.statusCode
        if (status === 200) {
          this.$message({
            type: 'success',
            message: '该司机资料已驳回'
          })
          this.reRenderList()
        }
      })
    },
    /**
     * 关闭审批弹窗
     * @param void
     * @return void
     */
    approvalDialogClose () {
      this.approvalDialogVisible = false;
      this.reRenderList();
    },
     /**
     * 关闭上传附件弹窗
     * @param void
     * @return void
     */
    closeDialog (bool) {
      this.uploadDialog = false;
      this.reRenderList();
    },
    /**
     * 判断司机信息详情是否已存在
     * @param {object} 勾选行 id
     * @return void
     */
    checkDriverInfo () {
      SERVICES.DRIVER_INFO.checkDriverInfo(this.multipleSelection[0].id).then(res => {
        this.driverInfoState = res.data.statusCode
      })
    },
    /**
     * 获取司机资料信息
     * @param {object} 勾选行 id
     * @return void
     */
    driverInfoDetail () {
      SERVICES.DRIVER_INFO.getDriverInfoDetail(this.multipleSelection[0].id).then(res => {
        this.formData = res.data
      })
    },
    /**
     * 表单数据初始化
     * 自动带出提货单、物流商名称
     * @param {Object} values 表单数据
     * @return void
     */
    clearDialogFrom (values){
      values.ladingBillCode = this.multipleSelection[0].ladingBillCode;         // 提货单号
      values.logisticsProviderName = this.multipleSelection[0].logisticsProviderName; // 物流商名称
      values.declareCustomsPort = '';            // 报关口岸
      values.caCarNum = '';                      // 大陆车牌
      values.hkCarNum = '';                      // 香港车牌
      values.driverName = '';                   // 司机姓名
      values.driverID = '';                      // 司机身份证号
      values.driverPhone = '';                   // 司机电话
      values.bracketNum = '';                    // 托架号
      values.sixUnionBill = '';                  // 六联单号
      values.cabinetType = '';                   // 柜号/柜型
      values.sealNumber = '';                    // 封号
      values.vehicleCustomsRecord = '';          // 车辆海关备案编号
      values.isSendCustoms = '';                 // 是否发送报关行 
      values.remark = '';                        // 备注
    },
    /**
     * 重新渲染列表页
     * @param void
     * @return void
     */
    reRenderList() {
      this.$root.monitor({ url: LOGISTICS_ORDER_API.DRIVER_INFO_LIST});
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
    },
    /**
     * 获取大陆车牌
     * @param void
     * @return void
     */
    getPlateNumber () {
      let id = this.multipleSelection[0].logisticsProviderId
      let carNum = []
      SERVICES.DRIVER_INFO.getPlateNumber(id).then(res => {
        this.carNumData = res.data;
        if (this.carNumData.length) {
          this.carNumData.forEach(item => {
            carNum.push({
              label: item.caCarNum,
              value: item.id,
              id: item.id,
            })
            if (this.mate.mateFormerHeader.values['caCarNum'] === item.id) {
              this.mate.mateFormerHeader.values['hkCarNum'] = item.hkCarNum
            }
          })
          this.mate.mateFormerHeader.fields.forEach(item => {
            if (item.name === 'caCarNum') {
              item.options = carNum
            }
          })
        }
      })
    },
    /** 选择大陆车牌显示香港车牌数据
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     */
    handleCaCarNumChange (val) {
      if (val) {
        this.carNumData.forEach(i => {
          if (i.id === val) {
            this.mate.mateFormerHeader.values['hkCarNum'] = i.hkCarNum
          }
        })
      }
    },
    /**
     * 获取大陆车牌
     * @param void
     * @return void
     */
    getDriverName () {
      let id = this.multipleSelection[0].logisticsProviderId
      let driverNameOptions = []
      SERVICES.DRIVER_INFO.getDriverName(id).then(res => {
        this.driverNameData = res.data;
        if (this.driverNameData.length) {
          this.driverNameData.forEach(item => {
            driverNameOptions.push({
              label: item.consigneeName,
              value: item.id,
              id: item.id,
            })
            if (this.mate.mateFormerHeader.values['driverName'] === item.id) {
              this.mate.mateFormerHeader.values['driverID'] = item.idCard
            }
          })
          this.mate.mateFormerHeader.fields.forEach(item => {
            if (item.name === 'driverName') {
              item.options = driverNameOptions
            }
          })
        }
      })
    },
    /** 选择司机姓名显示身份证数据
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     */
    handleDriverNameChange (val) {
      if (val) {
        this.driverNameData.forEach(i => {
          if (i.id === val) {
            this.mate.mateFormerHeader.values['driverID'] = i.idCard
          }
        })
      }
    },
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
