<!-- created by zhongxiaolong on 2019/08/15 -->
<!-- 跟单列表模块下新增模块 -->
<template>
  <div>
    <!-- 头部button Start-->
    <h-btn :btns="btns" @click="handleBtns"></h-btn>
    <!-- 头部button End-->
    <!-- 头部Form Start-->
    <dynamic-form ref="headForm" 
      :mate="mate.mateFormerHeader" 
      :rules="headerFormRules" 
      :eventCfg="eventConfig" 
      :labelWidth="labelWidth" 
      @events="handleEvents"></dynamic-form>
    <!-- 头部Form End-->
    <!-- 底部 lineList Start-->
    <k-table-line
      ref="lineTable"
      :mate="mate.mateListLine"
      @actionSelected="handleSelected"
      @btnClick="handleButtons"
      @action="handleActions"
      :toSort="toSort"
      @uploadSuccess="uploadSuccess"
      :btnDisable="btnDisable"
      :actDisable="actDisable"
      :actionWidth="actionWidth"></k-table-line>
    <!-- 底部 lineList End-->
    <!-- 新增行弹窗 Start -->
    <el-dialog
      title="填写明细行"
      width="80%"
      v-if="dialogRender"
      :visible.sync="dialogFormVisible"
      :before-close="lineDialogClose">
      <dynamic-form ref="lineForm" 
        :mate="mate.mateFormerLine" 
        :rules="lineFormRules" 
        :eventCfg="lineFormEventConfig" 
        @events="handleEvents"></dynamic-form>
      <el-row type="flex" justify="start">
        <el-button size="mini" @click="submitForm" type="primary">{{$t("BUTTON_TEXT.CONFIRM")}}</el-button>
        <el-button size="mini" @click="lineDialogClose">{{$t("BUTTON_TEXT.CANCEL")}}</el-button>
      </el-row>
    </el-dialog>
    <!-- 新增行弹窗 End -->
    <!-- 备注修改弹窗 Start-->
    <el-dialog
      title="编辑备注"
      width="35%"
      v-if="dialogRender"
      :visible.sync="remarkVisible"
      :before-close="remarkDialogClose">
      <el-form ref="remarkForm" :model="remarkValue">
        <el-form-item label="" prop="remark">
          <el-input type="textarea" v-model="remarkValue.remark"></el-input>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="start" style="margin-top: 15px;">
        <el-button type="primary" @click="submitRemark(remarkValue.remark)">{{$t("BUTTON_TEXT.CONFIRM")}}</el-button>
        <el-button type="primary" @click="remarkDialogClose">{{$t("BUTTON_TEXT.CANCEL")}}</el-button>
      </el-row>
    </el-dialog>
    <!-- 备注修改弹窗 End-->
  </div>
</template>

<script>
import { SMART_ORDER_API, BASE_API } from "@/services/apis";
import SERVICES from "@/services";
import DictStore from "@/store/dict-store.js";

export default {
  components: {
    HBtn: function index(resolve){
      require(["@/components/Button/HBtn.vue"], resolve);
    },
    KTableLine: function index(resolve) {
      require(["@/components/table/KTableLine.vue"], resolve);
    },
    DynamicForm: function index(resolve) {
      require(["@/components/form/DynamicForm.vue"], resolve)
    }
  },
  props: {
    mate: Object
  },
  data() {
    return {
      status: "NOT_STARTED", // 新建状态默认“未启动”
      actionWidth: "", // action 操作列宽度
      btns: ['提交','取消'],     // 责任人列表
      usersList: [], // 责任人列表
      selectedIds: [], // 所勾选行的序号
      selectedLines: [], // 勾选行
      headForm: {}, // 头部表单
      lineValues: {}, // 新增行表单默认数据
      toSort: true, // 是否本地排序 一般用于没有分页的列表
      showDict: "", // 数字词典是否禁用 '1'/'0'
      submitBtnDisabled: false, // 提交按钮是否禁用
      dialogRender: true, // 用作强制重新渲染弹窗
      dialogFormVisible: false, // 新增行弹窗是否显示
      remarkVisible: false, // 启动后修改任务行备注弹窗是否显示
      remarkValue: { remark: "" }, // 启动后修改任务行备注弹窗是否显示
      objectColumns: {}, // 列表行字段
      orderId: null, // 任务 id
      isEdit: false, // 当前行是否在编辑
      isAddLine: false, // 是否新增行
      isEditLine: false, // 是否修改行
      isDirty: false, // 是否修改了数据
      soNumDirty: false, // 是否修改了订单编号
      materialsCodeDirty: false, // 是否修改了物料编码
      uploadUrl: "", // 上传/导入 api
      uploadMethod: "POST", // 请求上传/导入服务的方法
      btnDisable: false,
      actDisable: false,
      headerFormRules: {
        // 订单编号
        soNum: [
          { required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }
        ],
        // 客户名称
        customerName: [
          { required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }
        ],
        // 组件
        materialsCode: [
          { required: true, message: "该输入项为必输项", trigger: "blur", disabled: false}
        ],
        // 申请日期
        applyDateStr: [
          { required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }
        ],
        // 需求日期
        requestDateStr: [
          { required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }
        ],
        // 物料名称
        materialsName: [{ disabled: true }],
        // 工单编号
        workOrderCode: [{ disabled: false }],
        // 产品规格
        specs: [{ disabled: true }],
        // 数量
        quantity: [
          { required: true, message: "该输入项为必输项", disabled: false, type: "number" }
        ],
        // 单位
        unit: [{ disabled: true }],
        // 价格
        price: [{ type: "number", disabled: false }],
        // 需求部门
        demandDepartment: [{ disabled: false }],
        // 需求人
        demander: [{ disabled: false }],
        // 联系方式
        phone: [{ disabled: false }]
      },
      eventConfig: {
        // 订单编号
        soNum: { blur: true },
        // 物料编码
        materialsCode: { blur: true }
      },
      lineFormRules: {
        serialNumber: [{required: true, message: "该输入项为必输项", trigger: "blur", disabled: false, type: "number" },], // 序号
        taskName: [{required: true, message: "该输入项为必输项", trigger: "change", disabled: false }], // 任务名称
        chargeId:[{required: true, message: "该输入项为必输项", trigger: "change", disabled: false }], // 责任人
        completeTimeStr:[{required: true, message: "该输入项为必输项", trigger: "blur", disabled: false }],// 预计完成日期
        isRequired:[{required: true, message: "该输入项为必输项", trigger: "change", disabled: false }],// 是否上传附件
        remark:[{disabled: false}], // 备注
      },
      lineFormEventConfig: {
        // 责任人
        chargeId: { change: true }
      }
    };
  },
  computed: {
    labelWidth: function() {
      let width = "";
      if (this.mate.inline) {
        width = "120px";
      } else if (typeof this.mate.labelWidth === "undefined") {
        width = "120px";
      } else {
        width = this.mate.labelWidth;
      }
      return width;
    }
  },
  created() {
    let mate = this.mate;
    // 列表行
    this.mate.mateListLine.columns.map(item => {
      this.objectColumns[item.name] = item;
    });

    // *el-input-number 默认值为0,若要置空需要将值设置为 undefined
    mate.mateFormerHeader.values.quantity = undefined;
    mate.mateFormerHeader.fields.map(item => {
      this.headForm[item.name] = item;
    });
    // 保存行默认数据
    this.lineValues = { ...mate.mateFormerLine.values };
    // 编辑
    let orderDetail = mate.orderDetail;
    let listLineRows = orderDetail ? orderDetail.taskList : [];
    let mateFormerHeaderValues = orderDetail ? orderDetail.smartOrder : {};
    if (orderDetail) {
      this.isEdit = true;
      this.orderId = orderDetail.smartOrder.id;
      this.status = mateFormerHeaderValues.status || "NOT_STARTED";
      if (this.status != "NOT_STARTED") {
        // 行列表头部按钮禁用
        this.btnDisable = true;
        mate.mateListLine.actions = [
          {
            action: "editLine",
            icon: "el-icon-edit",
            isApi: true,
            label: "修改备注",
            useId: 0,
            disabled: false
          }
        ];
        this.actionWidth = 60;
      }
      listLineRows = this.initLineData(listLineRows);
      mate.mateListLine.rows = listLineRows;
      mate.mateFormerHeader.values = mateFormerHeaderValues;
      // 修改的时候如果紧急程度没有值，则设置默认值为3
      mate.mateFormerHeader.values["urgent"] = mate.mateFormerHeader.values["urgent"] || "3";
    }
  },
  mounted() {},
  methods: {
    /** 头部按钮事件
     * @param {String} name 按钮名称
     * @return {Function} 按钮事件
     */
    handleBtns(name) {
      const btnEvents = {
        // 提交按钮
        submit: () => this.handleSubmit(),
        // 提交按钮
        save: () => this.saveBom(),
        // 取消按钮
        cancel: () => this.backward(),
        // 重置按钮
        reset: () => this.handleReset(),
        // 默认
        default: () => { return }
      }
      return (btnEvents[name] || btnEvents.default)();
    },
    /**
     * 公共模块 KTableLine 按钮事件
     * @param {Object} btn 当前按钮信息
     * @param {Object} row 当前行信息
     * @return void
     */
    handleButtons(btn, row) {
      this.row = row;
      this.btn = btn;
      let action = btn.action;
      const btnEvents = {
        // 新增
        addLine: () => this.addLine(),
        // 编辑行
        editLine: () => this.editLine(),
        // 删除行
        deleteLine: () => this.deleteLine(),
        // 导入模板
        upload: () => this.uploadLine(),
        // 导出为模板
        download: () => this.downloadLine(),
        // 默认
        default: () => {
          return;
        }
      };
      return (btnEvents[action] || btnEvents.default)();
    },
    handleActions(act, row) {
      let action = act.action;
      const btnEvents = {
        // 编辑行
        editLine: () => this.editRemark(act, row),
        // 默认
        default: () => {
          return;
        }
      };
      return (btnEvents[action] || btnEvents.default)();
    },
    /**
     * 提交表单数据
     * @param void
     * @return void
     */
    handleSubmit() {
      this.submitBtnDisabled = true;
      let mate = {};
      let _this = this;
      this.$refs["headForm"].$refs["form"].validate(valid => {
        if (valid) {
          mate = _this.saveData();
          if (!mate) return;
          SERVICES.DOCUMENTARY_LIST.save(mate).then(res => {
            let status = res.status;
            if (status === 200) {
              _this.$root.monitor({
                url: SMART_ORDER_API.DOCUMENTDARYLIST_MAIN_LIST
              });
            } else if (status === 500) {
              _this.submitBtnDisabled = false;
            }
          });
        } else {
          this.submitBtnDisabled = false;
        }
      });
    },
    /** 动态表单事件管理
     * @param {String} event 事件名称
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     */
    handleEvents(event, val, name) {
      const eventControl = {
        input: (val, name) => this.handleInput(val, name),
        change: (val, name) => this.handleChange(val, name),
        blur: (val, name) => this.handleBlur(val, name),
        focus: (val, name) => this.handleFocus(val, name),
        clear: (val, name) => this.handleClear(val, name),
        visibleChange: (val, name) => this.handleVisibleChange(val, name),
        removeTag: (val, name) => this.handleRemoveTag(val, name),
        default: () => {
          return;
        }
      };
      return (eventControl[event] || eventControl.default)(val, name);
    },
    /** input事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     */
    handleInput(val, name) {
      const inputControl = {
        default: () => {
          return;
        }
      };
      return (inputControl[name] || inputControl.default)(val);
    },
    /** change 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     */
    handleChange(val, name) {
      this.isDirty = true;
      const changeControl = {
        soNum: val => this.soNumControl(val),
        materialsCode: val => this.materialsCodeControl(val),
        chargeId: val => this.handleChargeId(val),
        default: () => {
          return;
        }
      };
      return (changeControl[name] || changeControl.default)(val);
    },
    /** blur 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     */
    handleBlur(val, name) {
      const blurControl = {
        soNum: val => this.retrieveOrder(val),
        materialsCode: val => this.getMaterialsInfo(val),
        default: () => {
          return;
        }
      };
      return (blurControl[name] || blurControl.default)(val);
    },
    /** focus 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     */
    handleFocus(val, name) {
      const focusControl = {
        default: () => {
          return;
        }
      };
      return (focusControl[name] || focusControl.default)(val);
    },
    /** clear 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     */
    handleClear(val, name) {
      const clearControl = {
        default: () => {
          return;
        }
      };
      return (clearControl[name] || clearControl.default)(val);
    },
    /** visibleChange 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     */
    handleVisibleChange(val, name) {
      const visibleChangeControl = {
        default: () => {
          return;
        }
      };
      return (visibleChangeControl[name] || visibleChangeControl.default)(val);
    },
    /** removeTag 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     */
    handleRemoveTag(val, name) {
      const removeTagControl = {
        default: () => {
          return;
        }
      };
      return (removeTagControl[name] || removeTagControl.default)(val);
    },
    /**
     * 检索订单编号
     * 判断此订单编号是否存在，
     * 如果存在，可自动带出客户名称，
     * 如果不存在需提示“此订单不存在，请先到订单管理，建立销售订单！”。
     * @param {Sting} val 订单编号 (销售管理-销售订单-订单编号)
     * @return void
     */
    retrieveOrder(val) {
      if (val == "" || this.soNumDirty) return;
      SERVICES.DOCUMENTARY_LIST.retrieveSoNum(val).then(res => {
        if (res.data.data) {
          this.mate.mateFormerHeader.values["customerName"] =
            res.data.data.customerName || "";
          this.soNumDirty = false;
        } else {
          // this.$message({
          //   type: "warning",
          //   message: "此订单不存在，请先到订单管理，建立销售订单！"
          // });
          // this.mate.mateFormerHeader.values["customerName"] = "";
        }
      });
    },
    /**
     * 检索物料编码
     * 检索物料是否存在，
     * 存在的话，自动带出产品名称（物料名称），产品规格（物料规格）。
     * 不存在提示“此物料编码不存在”
     * @param {Sting} val 物料编码 (基础数据-物料管理-物料编码)
     * @return void
     */
    getMaterialsInfo(val) {
      if (val == "" || this.materialsCodeDirty) return;
      SERVICES.DOCUMENTARY_LIST.getMaterialsInfo(val).then(res => {
        let values = this.mate.mateFormerHeader.values;
        let data = res.data && res.data.data;
        if (data) {
          values["materialsName"] = data.name || "";
          values["specs"] = data.basicSpec || "";
          values["unit"] = data.basicUnit || "";
          this.materialsCodeDirty = false;
        } else {
          this.$message({
            type: "warning",
            message: "此物料编码不存在"
          });
          values["materialsName"] = "";
          values["specs"] = "";
          values["unit"] = "";
        }
      });
    },
    soNumControl(val) {
      this.soNumDirty = true;
    },
    materialsCodeControl(val) {
      this.materialsCodeDirty = true;
    },
    /** 责任人改变事件
     * 保存责任人名称
     * @param {String} val 责任人 id
     * @return void
     */
    handleChargeId(val) {
      let user = this.usersList.find(item => item.id === val);
      if (user.id) this.mate.mateFormerLine.values['chargeName'] = user.label;
    },
    /**
     * 提取提交和保存
     * 需要传给后台的数据
     * @params void
     * @return {Object} mate 头部数据和行数据
     */
    saveData() {
      let mate = {};
      let values = this.mate.mateFormerHeader.values;
      values.id = this.orderId || null;
      // 新建状态默认“未启动”
      values.status = this.status;
      // 后台需要标识 有效状态 1:有效   默认为 1
      values.disableFlag = "1";
      mate.smartOrder = values;
      mate.taskList = this.mate.mateListLine.rows;
      if (mate.taskList.length < 1) {
        // 保存的时候明细行不能为空
        this.$message({
          type: "warning",
          message: "明细行不能为空"
        });
        this.submitBtnDisabled = false;
        return false;
      }
      return mate;
    },
    /**
     * 取消返回Ecn List页面
     * @param void
     * @return void
     */
    backward() {
      if (this.isEdit) {
        this.$confirm("数据未提交,是否离开当前页面?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.backToList();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消离开"
            });
          });
      } else {
        this.backToList();
      }
    },
    /**
     * checkbox 勾选计算 拿到勾选的序号数组
     * param {Boolean} hasSelected 是否有勾选
     * param {Array} multipleSelection 勾选数组
     * @return void
     */
    handleSelected(hasSelected, multipleSelection) {
      this.selectedLines = multipleSelection;
      // 第一步就是要清空selectedIds里面的所勾选行的序号
      this.selectedIds = [];
      // map方法也可以
      multipleSelection.forEach(item =>
        this.selectedIds.push(item.serialNumber)
      );
      // 每次点击都会执行这个函数，要点击两下的时候，this.selectedIds里面包括了前面一次的数据，所以会有重复，要去重
      let arr = [];
      arr = [...new Set(this.selectedIds)];
      this.selectedIds = arr;
    },
    /**
     * 新增行
     * @param void
     * @return void
     */
    addLine() {
      // 该操作是新增行 改变新增行状态
      this.isAddLine = true;
      let values = this.mate.mateFormerHeader.values;
      this.materialData = [];
      // 获取责任人列表
      if (!this.usersList.length) this.getUsersList();
      // 显示弹窗
      this.lineDialogShow();
      this.clearDialogFrom(this.mate.mateFormerLine.values);
    },
    /**
     * 编辑行
     */
    editLine() {
      // 编辑行
      if (this.selectedLines.length !== 1) {
        this.$message({
          message: this.$t("seladata"),
          type: "warning"
        });
        return;
      }
      // 获取责任人列表
      if (this.usersList.length == "0") this.getUsersList();
      // 该操作是编辑行 改变编辑行状态
      this.isEditLine = true;
      this.lineDialogShow();
      this.mate.mateFormerLine.values = { ...this.selectedLines[0] };
    },
    /** 编辑任务备注
     *  订单状态进行中，不允许修改任务行，但是可以修改备注
     * @param {Object} act 按钮配置信息
     * @param {Object} row 当前点击按钮所在行数据
     * @return void
     */
    editRemark(act, row) {
      this.row = row;
      this.remarkValue.remark = row.remark;
      this.remarkDialogShow();
    },
    /**
     * 删除行
     * @param void
     * @return void
     */
    deleteLine() {
      let _this = this;
      this.$confirm("此操作将永久删除该行, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let selectedLines = _this.selectedLines;
          let selectedIds = _this.selectedIds;
          // 行数据
          let listLineRows = _this.mate.mateListLine.rows;
          // 先过滤删除没有行id的数据
          selectedLines = selectedLines.filter(item=> !!item.id );
          // 过滤删除的行 剩下没有删除的
          selectedIds.forEach(item => {
            listLineRows = listLineRows.filter(
              line => line.serialNumber != item
            );
          });
          // 需要删除的行的 id数组 保存在 rowId 里
          let rowId = { id: selectedLines.map(item => item.id) };
          // 删除之后，就将剩余从新排序
          // for (let l = 0; l < listLineRows.length; l++) {
          //   listLineRows[l].index = l + 1;
          // }
          _this.initLineData(listLineRows);
          // 如果删除行有行id就向后台请求删除
          if (rowId.id.length > 0) {
            SERVICES.DOCUMENTARY_LIST.deleteLine(rowId.id).then(() => {
              //重新渲染删除后的行列表
              _this.mate.mateListLine.rows = listLineRows;
              // 保存数据 重新排序后的
              // _this.save();
            });
          } else {
            _this.mate.mateListLine.rows = listLineRows;
            // _this.save();
          }
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    /**
     * 导入模板
     * @param void
     * @return void
     */
    uploadLine() {
      let requestDateStr = this.mate.mateFormerHeader.values.requestDateStr;
      let orderId = this.mate.mateFormerHeader.values.id || "";
      let data = { requestDateStr: requestDateStr, orderId: orderId };
      if (!requestDateStr) {
        this.$message({
          type: "info",
          message: "请先选择需求日期!"
        });
        return;
      }
      let url = this.uploadUrl || this.btn.url;
      let method = this.uploadMethod;
      this.$refs["lineTable"].uploadFile(url, method, data);
    },
    /**
     * 上传成功
     *
     */
    uploadSuccess(data) {
      this.isEdit = true;
      data = this.initLineData(data);
      this.mate.mateListLine.rows = data;
      this.$message({
        type: "success",
        message: `成功导入“ ${data.length} ”条任务`
      });
    },
    /**
     * 导出为模板
     * @param void
     * @return void
     */
    downloadLine() {
      let mate = {};
      mate.smartOrder = this.mate.mateFormerHeader.values;
      mate.taskList = this.mate.mateListLine.rows;
      mate = JSON.stringify(mate);
      this.$http({
        url: `${this.BASEAPI}${this.btn.url}`,
        method: "POST",
        headers: {
          Authorization: "Bearer " + window.sessionStorage.getItem("token"),
          Accept: "application/json",
          "X-TenantId": JSON.parse(window.sessionStorage.getItem("user"))
            .tenantId,
          "Content-Type": "application/json;charset=utf8"
        },
        responseType: "arraybuffer",
        body: mate
      }).then(function(response) {
        // blob(size,type) Blob构造函数，接受两个参数。第一个参数是一个包含实际数据的数组，第二个参数是数据的类型
        let blob = new Blob([response.data], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        let objectUrl = URL.createObjectURL(blob);
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.setAttribute("style", "display:none");
        a.setAttribute("href", objectUrl);
        a.setAttribute("download", this.btn.modular);
        a.click();
        URL.revokeObjectURL(objectUrl);
      });
    },
    /**
     * 刷新数据
     * 保存后刷新本页面数据
     * 并把头部表单数据 Number 转 String
     * 并设定索引和已实施勾选状态
     * @params {Object} data ecn数据
     */
    updateDate(data) {
      let detail = data.orderDetail;
      detail.taskList = this.initLineData(detail.taskList);
      this.mate.mateFormerHeader.values = detail.smartOrder;
      this.mate.mateListLine.rows = detail.taskList;
    },
    /**
     * 行新增/修改确认
     * @param {Object} val 行表单数据
     * @return void
     */
    submitForm(val) {
      let _this = this;
      let mate = this.mate;
      let lineId = mate.mateFormerLine.values.id;
      // 验证表单 通过后保存信息到列表行中
      this.$refs["lineForm"].$refs["form"].validate((valid, obj) => {
        if (valid) {
          let curIdx = mate.mateFormerLine.values.index;
          let values = mate.mateFormerLine.values;
          // 检验手动填写序号是否已存在 给出提示并自动填写序号
          let isExist = _this.checkSerialNumber(
            mate.mateFormerLine.values.serialNumber,
            curIdx,
            lineId
          );
          if (isExist) {
            mate.mateFormerLine.values.serialNumber = _this.createNum();
            _this.$message({
              message: "该序号已存在，请重新填写",
              type: "warning"
            });
            return;
          }
          // 是否是编辑
          if (_this.isEditLine) {
            mate.mateListLine.rows.map((item, index) => {
              if (curIdx === item.index) {
                let mateFormerValues = Object.assign({}, values);
                // 添加disableFlag 新增line后台需要前端传标识
                mateFormerValues.disableFlag = "1";
                // splice将i行数据删除，并将mateFormerValues1填充进
                mate.mateListLine.rows.splice(index, 1, mateFormerValues);
                _this.$refs['lineTable'].clearSelection();
              }
            });
          }
          // 是否是新增
          if (_this.isAddLine) {
            values.index = mate.mateListLine.rows.length + 1;
            let mateFormerValues = Object.assign({}, values);
            // 添加disableFlag 新增line后台需要前端传标识
            mateFormerValues.disableFlag = "1";
            mate.mateListLine.rows.push(mateFormerValues);
          }
          _this.lineDialogClose();
        } else {
          _this.$notify.error({
            title: "消息",
            message: "数据验证未通过"
          });
        }
      });
    },
    /**
     * 备注修改确认
     * @param {Object} val 备注的值
     * @return void
     */
    submitRemark(val) {
      this.row.remark = val;
      this.remarkDialogHide();
    },
    /**
     * 重置新增行、编辑行状态
     * @params void
     * @return void
     */
    resetLineState() {
      this.isAddLine = false;
      this.isEditLine = false;
    },
    /**
     * 初始化行数据
     * 添加索引 从 1 开始
     * 已实施状态赋值
     * @params {Object} data 行数据
     * @return {Object} data 行数据
     */
    initLineData(data) {
      data.forEach((item, index) => {
        // 设置索引 从 1 开始
        item.index = index + 1;
      });
      return data;
    },
    /**
     * 清空行数据
     * @param void
     * @return void
     */
    clearLineList() {
      this.mate.mateListLine.rows = [];
    },
    /**
     * 新建行弹窗取消
     * 隐藏弹窗并弹窗初始化
     * @param void
     * @return void
     */
    lineDialogClose() {
      // 隐藏行弹窗
      this.lineDialogHide();
      // 重新渲染行弹窗
      this.reRenderLineDialog();
      // 重置行状态
      this.resetLineState();
    },
    /**
     * 显示弹窗
     * @param void
     * @return void
     */
    lineDialogOpen() {
      this.lineDialogShow();
    },
    /**
     * 隐藏弹窗
     * 重置弹窗表单
     * @param void
     * @return void
     */
    lineDialogHide() {
      this.dialogFormVisible = false;
      this.resetForm("lineForm");
      // this.clearDialogFrom(this.mate.mateFormerLine.values);
    },
    lineDialogShow() {
      this.dialogFormVisible = true;
    },

    /**
     * 新建行弹窗取消
     * 隐藏弹窗并弹窗初始化
     * @param void
     * @return void
     */
    remarkDialogClose() {
      // 隐藏行弹窗
      this.remarkDialogHide();
      // 重新渲染行弹窗
      this.reRenderLineDialog();
    },
    /**
     * 备注隐藏弹窗
     * 重置弹窗表单
     * @param void
     * @return void
     */
    remarkDialogHide() {
      this.remarkVisible = false;
      this.$refs["remarkForm"].resetFields();
    },
    remarkDialogShow() {
      this.remarkVisible = true;
    },
    /**
     * 重新渲染行表单弹窗
     * @param void
     * @return void
     */
    reRenderLineDialog() {
      this.dialogRender = false;
      this.$nextTick(() => {
        this.dialogRender = true;
      });
    },
    /**
     * 重置弹窗表单
     * 数据清空，验证信息重置
     * @param {String} formName 需要重置的表单 ref 名称
     * @return void
     */
    resetForm(formName) {
      this.$refs[formName].resetForm();
    },
    /**
     * 行表单数据初始化
     * 自动生成序号
     * @param {Object} values 表单数据
     * @return void
     */
    clearDialogFrom(values) {
      values.serialNumber = this.createNum(); // 序号
      values.chargeId = ""; //工序
      values.chargeName = ""; //工序
      values.taskName = ""; // 组件
      values.completeTimeStr = "";
      values.isRequired = ""; // 物料说明
      values.remark = ""; //备注
      values.index = null; // 索引
      values.lineId = "";
    },
    /**
     * 递归自动生成序号 10/20/30....
     * 默认为 10 如果当前行序号有10了 则递增10
     * @param {Number} num 序号
     * @return {Number} serialNumber 序号
     */
    createNum(num) {
      let serialNumber = num || 10;
      let lineLen = this.mate.mateListLine.rows.length;
      if (this.checkSerialNumber(serialNumber)) {
        serialNumber += 10;
        serialNumber = this.createNum(serialNumber);
      }
      return serialNumber;
    },
    /**
     * 序号检验
     * 校验是否已经存在当前序号
     * @param {Number} num 序号
     * @param {Number} id 行 id
     * @return {Boolean}  num是否已存在
     */
    checkSerialNumber(num, index, id) {
      let serialNumberArr = [];
      let listLineRows = [...this.mate.mateListLine.rows];
      if (index) {
        listLineRows = listLineRows.filter(item => item.index != index);
      }
      if (id) {
        listLineRows = listLineRows.filter(item => item.id != id);
      }
      listLineRows.forEach(item => serialNumberArr.push(item.serialNumber));
      return serialNumberArr.indexOf(num) != -1;
    },
    /**
     * 获取责任人列表
     * @param void
     * @return void
     */
    getUsersList() {
      let _this = this;
      SERVICES.BASE.getUsersList().then(res => {
        let data = res.data;
        if (data.length == "0") return;
        data.forEach(item => {
          if (
            item.username == "" ||
            item.username == undefined ||
            item.id == ""
          )
            return;
          this.usersList.push({
            label: item.username,
            value: item.id,
            id: item.id
          });
        });
        let chargeObj = _this.mate.mateFormerLine.fields.find(
          item => item.name === "chargeId"
        );
        chargeObj.options = _this.usersList;
      });
    },
    dirtyChange(bool) {
      this.isDirty = bool;
    },
    /**
     * 刷新tab页签
     * @param void
     * @return void
     */
    backToList() {
      this.$root.monitor({
        url: `${SMART_ORDER_API.DOCUMENTDARYLIST_MAIN_LIST}`
      });
    }
  },
  watch: {}
};
</script>

<style scoped lang="scss">
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
</style>
