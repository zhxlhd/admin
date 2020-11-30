<template>
  <div>
    <!--弹窗 Start -->
    <el-dialog :title="tableTitle" width="80%" :visible.sync="dialogVisible" :showClose="showClose" :before-close="closeDialog">
      <div style="font-size: 16px; overflow-y: auto; max-height: 600px; overflow-x: hidden;">
        <span>{{tipsText}}</span>
        <k-table-list 
          ref="listTable"
          v-bind="$attrs" 
          v-if="tableData" 
          :mate="tableData" 
          :maxHeight="maxHeight" 
          :checkType="checkType"
          :mateSearch="tableData.mateSearch" 
          :isShowSearchBtn="isShowSearchBtn"
          @btnClick="handleButtons" 
          @initQueryData="convertData"
          @selectAll="selectAll"
          @handleSelected="handleSelected" ></k-table-list>
        <el-row type="flex" justify="center" v-if="footerBtn">
          <el-button size="mini" @click="closeDialog">{{$t('BUTTON_TEXT.CANCEL')}}</el-button>
          <el-button size="mini" type="primary" @click="handleConfirm" :disabled="selectedLine == 0">{{ confirmText }}</el-button>
        </el-row>
      </div>
    </el-dialog>
    <!--弹窗 End -->
  </div>
</template>
<script>
import SERVICES from "@/services";

export default {
  components: {
    KTableList: function index(resolve) {
      require(["@/components/table/KTableList.vue"], resolve);
    }
  },
  props: {
    mate: Object,
    tableTitle: String,
    tipsText: String,
    dialogVisible: Boolean,
    showClose: {
      type: Boolean,
      default: false
    },
    formModel: {
      type: String,
      default: "page" // page or dialog
    },
    customerName: String,
    checkType: {
      type: String,
      default: ""
    },
    maxHeight: {
      type: Number,
      default: 500
    },
    isShowSearchBtn: {
      type: Boolean,
      default: true
    },
    target: {
      type: Array,
      default: () =>{ return [] }
    },
    judgeBy: {
      type: String,
      default: 'id'
    },
    confirmBtnText:{
      type: String,
      default: ''
    },
    footerBtn: {
      type: Boolean,
      default: true
    }
  },
  data(){
    return{
      tableData: null,  // 列表数据
      selectedLine: [], // 勾选项
      multipleSelection: []
    }
  },
  computed: {
    isShow: function(){
      return this.dialogVisible;
    },
    confirmText(){
      return this.confirmBtnText ? this.confirmBtnText : this.$t('BUTTON_TEXT.CONFIRM')
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.setTableData();
    },
    /**
     * 头部按钮控制
     * 点击按钮触发对应方法
     * @param {Object} btn 当前点击的按钮配置信息
     * @return void
     */
    handleButtons (btn, rowId, selection) {
      if(btn.url == ''){
        this.$alert('接口调试中，请稍后再尝试...');
        return
      }
      let _this = this;
      this.multipleSelection = selection;
      // 勾选行的 id 对象 isApi: 是否拼接id（true自动拼接）
      let rowIds = (btn.isApi || btn.ajax) ? { id: this.multipleSelection.map((r) => r.id) } : {};
      // 当前按钮操作
      let action = btn.action;
      const btnEvents = {
        default: (btn, rowIds) => this.$emit('btnClick', btn , rowIds, selection)
      }
      return (btnEvents[action] || btnEvents.default)(btn, rowIds);
    },
    handleConfirm() {
      let idArr = [],ids;
      let rows = this.selectedLine.filter(item =>{
        let isExist = this.target.find(row => row[this.judgeBy] === item.id);
        if(!isExist){
          idArr.push(item.id);
          return true
        }else{
          return false
        }
      })
      ids = idArr.join(",")
      this.$emit("handleConfirm", ids, rows);
    },
    /** 
     * 关闭弹窗并发射事件和数据给父组件
     * @return void
     */
    closeDialog() {
      this.$emit("handleConfirm");
    },
    /**
     * 行勾选选择
     * checkbox 勾选计算 拿到勾选的序号数组
     * param {Boolean} hasSelected 是否有勾选
     * param {Array} multipleSelection 勾选数组
     * @return void
     */
    handleSelected(hasSelected, multipleSelection) {
      this.selectedLine = multipleSelection;
    },
    /** 加工单编号弹窗事件
     * @param void
     * @return void
     */
    setTableData() {
      this.tableData = this.mate;
    },
    /**
     * 数据转换
     * 后台返回数据结构不统一做数据转换处理
     * @param {Object} data 数据
     * @return void
     ** Author: zhongxiaolong
     */
    convertData(data) {
      // 兼容吉海湾项目返回数据结构不统一处理 2020-06-29
      let result = data.data || data;
      let { pageSize, total, pageNum, list, ...resData } = result;
      let rows = list;
      let page = pageNum;
      let size = pageSize;
      this.mate.mateList = { ...this.mate.mateList, size, page, total, rows };
    },
    /**
     * 全选
     */
    selectAll (selection) {
      this.$emit('select-All',selection)
    },
  }
}
</script>
