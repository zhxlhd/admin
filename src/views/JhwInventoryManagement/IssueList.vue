<!-- created by hezhiqiang on 2020/05/14 -->
<!-- 出库 -->
<template>
  <div>
    <!-- headTable Start -->
    <KTableList
      :mate="mate"
      :mateSearch="mate.mateSearch"
      @btnClick="handleButtons"
      ref="listTable"
      :isIndex="isIndex"
      :isShowSearchBtn="isShowSearchBtn"
      :querySize="querySize"
      :formModel="formModel"
      @action="handleActions"
      @rowClick="rowClick"
      @initQueryData="convertData"
      @resetLineTable="showDetailTable=false"
    />
    <!-- headTable END -->
    <!-- detailTable Start -->
    <main-table
      v-if="false"
      :mateList="mate.mateListLine"
      ref="lineTable"
    />
    <!-- detail End -->
  </div>
</template>
<script>
import { LANGS } from '../../i18n/lang';
import KTableList from '@/components/table/KTableList'
import MainTable from '@/components/table/MainTable'
import DynamicForm from '@/components/form/DynamicForm'
import SERVICES from '@/services'

export default {
  components: {
    KTableList,
    MainTable,
    DynamicForm,
    HBtn: function index(resolve){
      require(["@/components/Button/HBtn.vue"], resolve);
    },
  },
  data(){
    return {
      isIndex: true,               // table是否渲染序号
      showDetailTable: false,      // 是否渲染明细行表格
      headRowId: '',               // 头行id
      showSubmitButton: true,      // 提交按钮是否显示
      selectedLines: [],           // 勾选明细行
      isShowSearchBtn: false,      // 是否显示搜索展开按钮
      multipleSelection: [],       // 勾选头部列表获取数据
      lineTableFlag: false,        // 行Table 是否渲染
      querySize: 5,                // 查询每页 size
      formModel: 'page',           // page dialog
      isHiddenResetBtn: false,     // 是否隐藏搜索重置按钮
      costState: '',               // 判断实报实销是否已存在
      lineId: '',                  // 行id
      params: '?listName=issue_list&lineList=issue_line_list&listFormName=issue_form&lineForm=issue_line_form', // 元数据表名
      listUrl: '/common/toList',  // 元数据接口
      dataUrl: '',                // 列表数据接口
      queryUrl: '',               // 查询分页接口
      deleteUrl: '',              // 删除接口
      saveUrl: '',
      isEdit: false,              // 当前是否在编辑
      isMaintain: false,          // 是否是维护操作
    }
  },
  props: {
    mate: Object
  },
  created (){
    this.init();
  },
  mounted () {

  },
  watch: {
    mate: {
      handler(newMate, oldMate) {
      　 this.init();
  　　},
  　　immediate: true
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
      this.mate.mateList.rowClick = true;   // 允许单击列表行请求行数据
      // 获取列表数据
      this.getListData();
    },
    /**
     * 获取列表数据
     */
    getListData () {
      const param = {
        ifNeedPage: true
      };
      SERVICES.ISSUE_LIST.getList(param).then(res => {
        if (res.data.data.list.length) {
          const data = res.data.data; // TODO 注意返回层级关系
          let { total, ...resData } = data;
          let rows = data.list;
          let page = data.pageNum;
          let size = data.size;
          this.mate.mateList = { ...this.mate.mateList, size, page, total, rows };
          // rows.forEach(item => {
          //   this.$set(item, 'edit', true);
          // })
        }
      })
    },
    /**
     * 数据转换
     * 后台返回数据结构不统一做数据转换处理
     * @param {Object} data 数据
     * @return void
     */
    convertData(data) {
      let { pageSize, total, pageNum, list, ...resData } = data.data
      let rows = list;
      let page = pageNum;
      let size = pageSize;
      this.mate.mateList = { ...this.mate.mateList, size, page, total, rows };
      // rows.forEach(item => {
      //   this.$set(item, 'edit', true);
      // })
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
        save: () => this.handleSave(btn,row),                     // 保存
        sendApproval: () => this.sendApproval(btn,row),                     // 送审
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
        // 查看
        check: () => this.detailsCost(act,row),
        // 打印
        download: () => this.handleDownload(act,row.id),
        maintain: () => this.handleMaintain(act,row),  // 维护
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
    },
    /**
     * 保存按钮
     * @param void
     * @return void
     */
    handleSave(btn,row) {
      let multipleSelection = this.multipleSelection;
      if(multipleSelection.length !== 1) {
        // 只能选择一行,不允许选择多行
        this.$message({
          message: this.$t("seladata"), // 请选择一行数据
          type: "warning"
        });
        return;
      };
      let param = {};
      param.id = multipleSelection[0].id;
      param.logisticsNo = multipleSelection[0].logisticsNo;  
      SERVICES.ISSUE_LIST.updateListLine(param).then(res => {
        if (res.status === 200) {
          this.$set(row,'edit',false);
          this.reRenderList();   
        }
      })
    },
    /**
     * 送审按钮
     * @param void
     * @return void
     */
    sendApproval(btn,row) {
      let multipleSelection = this.multipleSelection;
      if(multipleSelection.length !== 1) {
        // 只能选择一行,不允许选择多行
        this.$message({
          message: this.$t("seladata"), // 请选择一行数据
          type: "warning"
        });
        return;
      };
      if (multipleSelection[0].state === '0') {
        SERVICES.ISSUE_LIST.sendApproval(multipleSelection[0].id).then(res => {
          if (res.status === 200) {
            this.$message({
              type: 'success',
              message: '操作成功'
            });
            this.reRenderList();
          }
        });
      } else {
        this.$message({
          type: 'warning',
          message: '只有新建状态才可以送审'
        })
      }
    },
    /**
     * 维护列表字段
     */
    handleMaintain(act,row) {
      // let isAllowEdit = this.mate.mateList.rows.find(item => item.state === '0'); 
      // if(!isAllowEdit){
      //   this.$message.warning(this.$t('TIPS_WARNING.NO_PERMISSION'))
      //   return
      // }else{
      //   this.$set(row,'edit',true)  
      // }
      this.$set(row,'edit',true)  
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
      this.getDetailList();
    },
    /**
     * 获取明细行数据
     * @param {object} 点击行的 id数据
     * @return void
     */
    getDetailList () {
      SERVICES.ISSUE_LIST.getDetailList(this.headRowId).then((res) => {
        let data = res.data.data.list
        if (data.length) { 
          this.mate.mateListLine.rows = data
          this.$set(this.mate.mateList, "lineRows", data);
        }
      })
    },
    /**
     * 查看
     * @param {Object} act 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    detailsCost (act, row) {
       this.$root.monitor({ url: act.url + row.id })
    },
     /**
     * 重新渲染列表页
     * @param void
     * @return void
     */
    reRenderList() {
      this.$root.monitor({ url: `${this.listUrl}${this.params}` });
      this.getListData();
    },
    /**
     * 打印送货单
     */
    handleDownload(act, rowId){
      // 打印接口请求地址和传参
      let url = `${act.url}${rowId}`;
      SERVICES.BASE.handlePrinter(url).then(ren =>{}).catch(err =>{});
    },
  }
}
</script>
