/**
 * 生产管理管理下BOM模块
 */
<template>
  <div>
    <k-table-list ref="listTable" 
      :mate="mate" 
      :mateSearch="mate.mateSearch" 
      :isIndex="isIndex" 
      @btnClick="handleButtons" 
      @rowClick="handleRowClick" 
      @action="handleActions">
    </k-table-list>
  </div>
</template>

<script>
import { DateFormat } from '@/utils/util.js'
import { BOM_API } from "@/services/apis"
import { LANGS } from '@/i18n/lang'
import { API_GATEWAY } from '@/config/index.js'
import ProductionMixins from "./mixins/productionMixins"
import KTableList from '@/components/table/KTableList'
import QueryMixins from '@/mixins/QueryMixins'

export default {
  mixins: [ProductionMixins, QueryMixins],
  components: {
    KTableList
  },
  props: {
    mate: Object
  },
  data() {
    return {
      isIndex: false,                    // Table 是否渲染序号列
      page: 1, // 默认显示第1页
      pageSize: 10,
      multipleSelection: [],     // 点击table前面的框框，获取到的内容
      hasSelected: false,
      showOverflow: true,
      sortValues: {},
      action: null,
      object: {},                         // 放columns
      dialogVisible: false,
      rejectReasonDialogVIsible: false, // 驳回原因是否显示
      rowsContent: [],              // 获取到明细行中的数据
      formorHeaderId: '',
      selectedLines: [],
      msgBoxButton: true,
      queryObject:{ // 本地配置查询配置
        multipleConditions: true, // 是否多条件查询
        fields: [
          {holder: "text", name: "bomCode", label: "BOM编号", lg: 4, md: 6, placeholder: "BOM编号", sm: 8},
          {holder: "text", name: "materialsCode", label: "物料编码", lg: 4, md: 6, placeholder: "物料编码", sm: 8},
          {holder: "text", name: "version", label: "版本", lg: 4, md: 6, placeholder: "版本号", sm: 8},
          {holder: "datePicker", name: "fromDateStr", label: "生效日期从", lg: 4, md: 6, placeholder: "生效日期从", sm: 8},
          {holder: "datePicker", name: "toDateStr", label: "生效日期至", lg: 4, md: 6, placeholder: "生效日期至", sm: 8}
        ],
        values:{
          bomCode: "", // BOM编号
          materialsCode: "", // 物料编码
          version: "", // 版本
          fromDateStr: "", // 开始日期
          toDateStr: "" // 结束日期
        }
      }
    };
  },
  computed: {
    multipleSelectionLength: function () {
			return this.multipleSelection.length;
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    /**
     * 数据初始化
     * @param void
     * @return void
     */
    init () {
      // this.initOperations();
    },
    /**
     * 关闭详情弹窗
     */
    closeDialog (bool) {
      this.dialogVisible = false;
    },
    /**
     * 点击行请求行数据
     * @param {Object} row 行信息
     * @param {Object} act 按钮信息
     * @return void
     */
    getLines (row, act) { // 请求行数据
      let _this = this;
      this.formorHeaderId = row.id;
      this.$root.ajaxData(`${act.url}/${row.id}`, {}, (data) => {
        let bomLineList = data.bomLineList;
        if (!bomLineList.length) return;
        row.orgName = data.bomHeader.orgName;
        _this.$set(_this.mate.mateList, 'lineRows', bomLineList);
        _this.mate.mateList.lineRows = bomLineList;
      }, 'GET');
    },
    /**
     * 新增Bom 新增Bom
     * @param {Object} btn 按钮信息
     * @param {Object} row 行信息
     * @return void
     */
    addBom (btn, row){
      this.$root.handleAction(btn, row, () =>{
        this.getData();
      });
    },
    /**
     * 提交审批
     * @param {Object} btn 按钮信息
     * @param {Object} row 行信息
     * @return void
     */
    submitApproval (btn, row) {
      let status = 'SUBMIT';
      let multipleSelection = this.multipleSelection;
      const rowt = row.id? row : { id: multipleSelection.map((r) => r.id) };
      
      // 检查勾选项是否都是新增和驳回状态
      let isAllow = multipleSelection.every(item =>{
        return item.status ==='SAVE' || item.status ==='REJECT';
      });
      if(isAllow) {
        this.$root.ajaxData(`${btn.url}/${status}?bomIds=${rowt.id}`, {},  data => {
          this.$root.monitor({ url: BOM_API.BOM_LIST });
        }, 'GET')
      }else{
        this.$message({
          message: this.$t('TIPS_WARNING.FAILURE_TO_SUBMIT_FRO_APPROVAL'),
          type: 'warning'
        })
      }
    },
    /**
     * Bom审批 审批已提交审批的Bom
     * @param {Object} btn 按钮信息
     * @param {Object} row 行信息
     * @return void
     */
    approval (btn, row) {
      let _this = this;
      let status = 'PASS';
      let multipleSelection = this.multipleSelection;
      const rowt = row.id? row : { id: multipleSelection.map((r) => r.id) };
      btn.status = status;
      
      // 检查勾选项是否都是待审批状态
      let isAllow = multipleSelection.every(item =>{
        return item.status ==='SUBMIT';
      });
      if (isAllow) {
        this.$root.ajaxData(`${btn.url}/${status}?bomIds=${rowt.id}`, {}, data => {
          this.$root.monitor({ url: BOM_API.BOM_LIST });
        }, 'GET')
      }else{
        this.$message({
          message: this.$t('TIPS_WARNING.FAILURE_TO_APPROVAL'),
          type: 'warning'
        })
      }
    },
    /**
     * 驳回审批 
     * @param {Object} btn 按钮信息
     * @param {Object} row 行信息
     * @return void
     */
    rejectApproval (btn, row) {
      const _this = this;
      let status = 'REJECT'; // TODO status公共化
      let multipleSelection = this.multipleSelection;
      const rowt = row.id? row : { id: multipleSelection.map((r) => r.id) };
      // 检查勾选项是否都是待审批状态
      let isAllow = multipleSelection.every(item => item.status ==='SUBMIT'); // TODO status公共化
      if (isAllow) {
        this.$prompt(this.$t('LABEL_TEXT.REASONS_FOR_REJECTION'), this.$t('TITLE_TEXT.PLEASE_ENTER'), {
          confirmButtonText: this.$t('BUTTON_TEXT.OK'),
          cancelButtonText: this.$t('BUTTON_TEXT.CANCEL'),
          inputValidator(val){ // 输入项验证规则
            const value = val;
            if(value === null || !value.trim()){
              return _this.$t('FORM_VALIDATION_INFO.IS_REQUIRED')
            }else if(value.trim().length > 50){
              return _this.$t('FORM_VALIDATION_INFO.INPUT_LIMIT_50')
            }
          }
        }).then(({ value }) => {
          this.$root.ajaxData(`${btn.url}/${status}?bomIds=${rowt.id}&reason=${value}`, {}, data => { // TODO 请求公共化
            _this.$root.monitor({ url: BOM_API.BOM_LIST });
          }, 'GET')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('TIPS_WARNING.CANCEL_OPERATION')
          });
        });
      }else{
        this.$message({
          message: this.$t('TIPS_WARNING.CANNOT_BE_REJECTED'),
          type: 'warning'
        })
      }
    },
    /**
     * 编辑Bom 
     * 新建Bom和驳回状态Bom可以修改  （状态：提交，驳回）
     * 已提交审批和已审批Bom不能修改 （状态：提交审批，审批）
     * @param {Object} btn 按钮信息
     * @param {Object} row 行信息
     * @return void
     */
    editBom (btn, row) {
      let multipleSelection = this.multipleSelection;
      let rowt = row.id? row : { id: multipleSelection.map((r) => r.id) };
      if (multipleSelection.length !== 1) { // 只能选择一行,不允许选择多行
        this.$message({
          message: this.$t('seladata'), // 请选择一行数据
          type: 'warning'
        })
        return;
      }
      for (var i = 0; i < multipleSelection.length; i++) {
        if (multipleSelection[i].status === 'SUBMIT') {
          this.$message({
            message: this.$t('cannotChange'), // 不能修改
            type: 'warning'
          })
          return;
        }
      }
      this.$root.handleAction(btn, rowt, function () {});
    },
    /**
     * 删除Bom
     * @param {Object} btn 按钮信息
     * @param {Object} row 行信息
     * @return void
     */
    delBom (btn, row) {
      let _this = this;
      let url = btn.url || BOM_API.BOM_DELETE;
      let multipleSelection = this.multipleSelection;
      const rowt = { id: this.multipleSelection.map((r) => r.id) };
      
      // 检查勾选项是否都是新增和驳回状态 才能删除
      let isAllow = multipleSelection.every(item =>{
        return item.status ==='SAVE' || item.status ==='REJECT';
      });
      if (isAllow) {
        this.$confirm(this.$t('TIPS_WARNING.IRREVERSIBLE_DELETION'), this.$t('TITLE_TEXT.TIPS'), {
          confirmButtonText: this.$t('BUTTON_TEXT.CONFIRM'), // 确认
          cancelButtonText: this.$t('BUTTON_TEXT.CANCEL'), // 取消
          type: 'warning'
        }).then(() => {
          this.$root.ajaxData(url + rowt.id, {}, () =>{
            this.$root.monitor({ url: BOM_API.BOM_LIST });
          },'GET');
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('TIPS_WARNING.CANCEL_DELETION') // 已取消删除
          });          
        })
      }else{
        this.$message({
          type: 'warning',
          message: this.$t('TIPS_WARNING.CANNOT_BE_DELETED') // 不能删除
        })
      }
    },
    /**
     * 导出Bom
     * @param {Object} btn 按钮信息
     * @param {Object} row 行信息
     * @return void
     */
    exportBom (btn, row) {
      let multipleSelection = this.multipleSelection;
      if (multipleSelection.length !== 1) { // 只能选择一行,不允许选择多行
        this.$message({
          message: this.$t('seladata'), // 请选择一行数据
          type: 'warning'
        })
        return;
      }

      this.$http({
        url: `${API_GATEWAY}/api${btn.url}/${row.id}`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${window.sessionStorage.getItem('token')}`,
          'Accept': 'application/json',
          'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf8'
        },
        responseType: 'arraybuffer'
      }).then(function (response) {
        var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        // blob(size,type) Blob构造函数，接受两个参数。第一个参数是一个包含实际数据的数组，第二个参数是数据的类型
        var objectUrl = URL.createObjectURL(blob)
        var a = document.createElement('a')
        document.body.appendChild(a)
        a.setAttribute('style', 'display:none')
        a.setAttribute('href', objectUrl)
        var filename = 'Bom.xlsx'
        a.setAttribute('download', filename)
        a.click()
        URL.revokeObjectURL(objectUrl)
      })
    },
    handleAction (act, row) {
      var vm = this;
      this.$root.handleAction(act, row, function () {
        vm.getData();
      });
    },
    /**
     * 头部按钮控制
     * 点击按钮触发对应方法
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} rowId 勾选行 id数据  rowId.id
     * @param {Array} selection 勾选行数据
     * @return {Function} 执行操作的方法
     */
    handleButtons (btn, rowId, selection) {
      this.multipleSelection = selection;
      let action = btn.action;
      const rowIds = rowId.id ? rowId : { id: selection.map(r => r.id) };
      const btnEvents = {
        editBom: (btn, rowIds) => this.handleUpdate(btn, rowIds),            // 编辑/修改
        delete: (btn, rowIds) => this.handleDelete(btn, rowIds),             // 删除
        submitApproval: (btn, rowIds) => this.submitApproval(btn, rowIds),   // 提交审批
        approval: (btn, rowIds) => this.approval(btn, rowIds),               // 审批
        rejectApproval: (btn, rowIds) => this.rejectApproval(btn, rowIds),   // 驳回
        exportBom: (btn, rowIds) => this.exportBom(btn, rowIds),             // 导出
        deleteBom: (btn, rowIds) => this.delBom(btn, rowIds),                // 删除
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(btn, rowIds);
    },
    /**
     * actions 操作
     * 点击 action 根据按钮配置的 action 做对应操作
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return {Function} 执行操作的方法
     */
    handleActions (act, row) {
      let action = act && act.action;
      const actions = {
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
    },
    /** 修改按钮
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} ids 勾选行 id数据  ids.id
     * @return void
     */
    handleUpdate(btn, ids) {
      let status = this.multipleSelection[0].status;
      if (this.multipleSelectionLength != 1) {
        // 只能选择一行,不允许选择多行
        this.$message({
          message: this.$t("seladata"), // 请选择一行数据
          type: "warning"
        });
        return;
      }
      // 各模块不能修改的判断条件不一样 暂时不做公共方法
      // 允许修改逻辑
      if(status !== "SAVE" && status !== "REJECT" && status !== "PASS"){
        this.$message({
          message: this.$t('cannotChange'), // 不能修改
          type: "warning"
        });
        return;
      }
      this.$root.handleAction(btn, ids, function() {});
    },
    /** 删除按钮
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} ids 勾选行 id数据  ids.id
     * @return void
     */
    handleDelete(btn, ids) {
      // 检查勾选项是否都是未启动状态 才能删除
      let isAllow = this.multipleSelection.every(item => {
        return (item.status === "SAVE") || (item.status === "REJECT");
      });
      if (isAllow) {
        this.$root.handleAction(btn, ids, () => {
          this.reRenderList();
        });
      } else {
        this.$message({
          type: "warning",
          message: this.$t("TIPS_WARNING.CANNOT_BE_OPERATED") // 不能删除
        });
      }
    },
    /**
     * 请求当前操作行的查看详情中的列表行数据
     * 获取数据后渲染详情列表行
     * @param {Object} row 当前操作行的行数据
     * @param {Object} act 按钮配置信息
     * @return void
     */
    handleRowClick (row, act) {
      this.rowStatus = row.status;
      let id = row.id;
      // 获取行数据
      this.getLines(row, act);
    },
    /** 初始化行操作列按钮的状态
     * 只有加工单在生效状态操作行才渲染并且有上传图片按钮
     * enableEdit 是否允许编辑
     * ......可以对相关按钮进行初始化
     * @param void
     * @return void
     */
    initOperations() {
      let rows = this.mate.mateList.rows;
      if (!rows.length) return;
      else rows.forEach(item => {
        item.enableEdit = true;
      });
      rows.forEach(item =>{
        // 当状态不等于新建和驳回,不允许编辑修改
        if (item.status != "SAVE" && item.status != "REJECT" && item.status != "PASS"){
          item.enableEdit = false;
        }
      })
    },
  },
  watch: {
    mate: function (newMate) {
      this.init();
    }
  }
};
</script>

<style scoped>
.el-form-item {
  margin: 0px 20px 2px 0px;
}
.el-select,.date-picker{
  width: 100%;
}
</style>
