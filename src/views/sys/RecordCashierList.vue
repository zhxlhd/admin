<!-- 交款记录 fengjing 2020/06/04-->
<template>
	<div>
		<KTableList
      :mate="mate"
      :mateSearch="mate.mateSearch"
      @action="handleActions"
      ref="listTable"
      :isIndex="isIndex"
			:checkType="'noCheck'"
      :isShowSearchBtn="isShowSearchBtn"
      :querySize="querySize"
      @initOperations="initOperations"
      @initQueryData="convertData"
      @resetLineTable="showDetailTable=false"
    />
		<el-dialog :visible.sync="recordDialogVisible" width="80%" :show-close="false">
			<iframe :src="iframeUrl" class="my-iframe"  width="100%"
      height="100%"  name="showHere" scrolling=auto></iframe>
      <el-button type="text" @click="openDetail">收费标准协议书</el-button>
      <span slot="footer" class="dialog-footer">
        <el-button @click="recordDialogVisible = false" size="mini">取 消</el-button>
      </span>
		</el-dialog>
	</div>
</template>
<script>
import axios from '@/utils/http';
import { API_GATEWAY } from '@/config/index.js';
export default {
  components: {
		KTableList: function index(resolve){
      require(["@/components/table/KTableList.vue"], resolve);
    },
    DialogIframe: function index(resolve){
      require(["@/components/Dialog/DialogIframe.vue"], resolve);
    },
	},
	data(){
		return{
			isIndex: true,               // table是否渲染序号
      showDetailTable: false,      // 是否渲染明细行表格
      headRowId: '',               // 头行id
      showSubmitButton: true,      // 提交按钮是否显示
      selectedLines: [],           // 勾选明细行
      isShowSearchBtn: false,      // 是否显示搜索展开按钮
      multipleSelection: [],       // 勾选头部列表获取数据               
      querySize: 10,                // 查询每页 size
      pageSize: 10,
			page: 1,
      recordDialogVisible: false,
      queryParam: {
        pageNum: 1,
        ouName: "",
        settleDate: "",
        pageSize: 10
      },
      iframeUrl: '',
      agreementUrl: ''
		}
	},
	props: {
		mate : Object
	},
	created(){},
	mounted(){
    this.init()
  },
	methods: {
    init(){
      let url = '/api/purchase/pay/notice/get/list'
      axios.post(`${API_GATEWAY}${url}`,this.queryParam).then( res =>{
        let rows = res.data.data;
        let page = res.data.pageNum;
        let size = res.data.pageSize;
        let total = res.data.total;
        this.mate.mateList = { ...this.mate.mateList, size, page, total, rows };
        this.agreementUrl = res.data.resultParam
      })
    },
		initOperations() {
      let rows = this.mate.mateList.rows;
		},
		/**
     * 数据转换 
     * 后台返回数据结构不统一做数据转换处理
     * @param {Object} data 数据
     * @return void
     */
    convertData(data){
      let rows = data.data;
      let page = data.pageNum;
      let size = data.pageSize;
      let total = data.total;
      this.mate.mateList = { ...this.mate.mateList, size, page, total, rows };
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
        // 修改
        detail: () => this.showDetail(act,row),
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
		},
		/**
		 * 查看交款记录 pdf
		 * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
		 */
		showDetail(act,row){
      this.recordDialogVisible = true
      this.iframeUrl = row.fileUrl
    },
    /**
		 * 收费协议
		 */
		openDetail(){
			window.open(this.agreementUrl)
		}
  },
  watch:{
    mate: {
			handler(newMate, oldMate) {
			　 this.init();
	　　},
	　　immediate: true
		}
  }
}
</script>
<style scoped>
 .my-iframe {
  width: 100%;
  height:600px;
 }
</style>