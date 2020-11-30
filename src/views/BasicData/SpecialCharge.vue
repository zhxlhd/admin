<!--收费特殊管理  fengjing  20200723  主要是系统管理员操作-->
<template>
	<div>
		<KTableList
				:mate="mate"
				:mateSearch="mate.mateSearch"
				@action="handleActions"
				ref="listTable"
				:isIndex="isIndex"
				:checkType="'noCheck'"
				:formModel="formModel"
				:isShowSearchBtn="isShowSearchBtn"
				:querySize="querySize"
				@initOperations="initOperations"
				@initQueryData="convertData"
				@uploadSuccess="uploadSuccess"
				@resetLineTable="showDetailTable=false"
				@btnClick="handleButtons" 
			/>
			<el-dialog :title="tableTitle" width="60%" :visible.sync="dialogVisible" :showClose="showClose" >
				<div>
					<h-btn @click="handleBtns" :btns="['保存','取消']"></h-btn>
				</div>
				<dynamic-form :mate="mate.mateFormerHeader" :rules="formRules" ref="headForm"></dynamic-form>
			</el-dialog>
	</div>
</template>
<script>
import { getAction, postAction, putAction, deleteAction } from '@/services/manage.js';
import SERVICES from '@/services'
import { isPositiveEmail,trimSpace } from '@/utils/util.js';
export default {
  components: {
		KTableList: function index(resolve){
      require(["@/components/table/KTableList.vue"], resolve);
		},
		DynamicForm: function index(resolve) {
      require(["@/components/form/DynamicForm.vue"], resolve);
		},
		HBtn: function index(resolve){
      require(["@/components/Button/HBtn.vue"], resolve);
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
        companyName: "",
        pageSize: 10
			},
			tableTitle: '新增',
			dialogVisible: false,
			showClose: true,
			formModel: 'dialog',
			formRules: {
				// 公司名
				companyName: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
				// 平台服务费
				payAmount: [{ required: true, trigger: "blur", disabled: false, message:"此项不能为空"}],
				// 类型
				type: [{required: true,trigger: "blur",disabled: false, message:"此项不能为空"}]
			},
			url: {
				saveUrl: this.mate.mateFormerHeader.url,
				updateUrl: this.mate.mateFormerHeader.next
			},
			isEdit: false // 是否编辑
		}
	},
	props: {
		mate : Object
	},
	methods: {
		init(){
			let url = this.mate.mateList.dataApi
			postAction(url,this.queryParam).then(res=>{
				let rows = res.data.data;
        let page = res.data.pageNum;
        let size = res.data.pageSize;
        let total = res.data.total;
        this.mate.mateList = { ...this.mate.mateList, size, page, total, rows };
			})
		},
		/**
     * 头部按钮控制
     * 点击按钮触发对应方法
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} rowId 勾选行 id数据  rowId.id
     * @param {Array} selection 勾选行数据
     * @return {Function} 执行操作的方法
     ** Author: zhongxiaolong
     */
    handleButtons (btn, rowId, selection) {
      this.multipleSelection = selection;
      let action = btn.action;
      const rowIds = (rowId && rowId.id) ? rowId : { id: selection && selection.map(r => r.id) };
      const btnEvents = {
        add: (btn) => this.handleCreate(btn),                     // 弹窗新增
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(btn, rowIds);
		},
		 /** 按钮事件
     * @param {String} name 按钮名称
     * @return {Function} 按钮事件
     */
    handleBtns(name) {
      const btnEvents = {
        // 提交按钮
        save: () => this.handleSave(),
        // 取消按钮
        cancel: () => this.backward(),
        // 默认
        default: () => { return }
      }
      return (btnEvents[name] || btnEvents.default)();
		},
		/**
     * actions 操作
     * 点击 action 根据按钮配置的 action 做对应操作
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return {Function} 执行操作的方法
     ** Author: fengjing
     */
    handleActions (act, row) {
      let action = act && act.action;
      let rowId = row.id;
      const actions = {
        updateDetail: (act, row) => this.handleUpdate(act, row), // 编辑
        delete: (act, row) => this.handleDelete(act, rowId),   // 删除
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
    },
		/**
		 * 新增
		 * @param {Object} btn 按钮配置
		 */
		handleCreate(){
			this.dialogVisible = true
			this.$nextTick(function () {
        this.resetForm()
      })
			this.tableTitle = '新增'
			this.isEdit = false
		},
		/**
		 * 弹出框取消按钮
		 */
		backward(){
			this.dialogVisible = false
		},
		/**
		 * 编辑
		 * @param {Object} btn 按钮配置
		 * @param {Objetc} row 点击行 
		 */
		handleUpdate(act,row){
			this.dialogVisible = true
			this.tableTitle = "修改"
			this.isEdit = true
			this.mate.mateFormerHeader.values = {...row}
		},
		/**
		 * 删除
		 * @param {Object} btn 按钮配置
		 * @param {Objetc} rowId 行id
		 */
		handleDelete(act,rowId){
			let _this = this
			deleteAction(`${act.url}${rowId}`,{}).then(res=>{
				_this.init()
			})
		},
		/**
		 * 弹出框保存
		 */
		handleSave(){
			let _this = this
			this.$refs['headForm'].$refs["form"].validate((valid) => {
				if (valid) {
					let params = this.mate.mateFormerHeader.values
					if(this.isEdit){
						putAction(`${this.url.updateUrl}${params.id}`, params).then(res=>{
							if(res.data.statusCode == 500){
								_this.$message({
									type: "warning",
									message: res.data.message
								});
								_this.dialogVisible = false
							} else {
								_this.$root.monitor({ url: '/common/toList?listName=special_charge_list&listFormName=special_charge_form' })
								_this.dialogVisible = false
							}
						})
					} else {
						postAction(this.url.saveUrl, params).then(res=>{
							if(res.data.statusCode == 500){
								_this.$message({
									type: "warning",
									message: res.data.message
								});
								_this.dialogVisible = false
							} else {
								_this.$root.monitor({ url: '/common/toList?listName=special_charge_list&listFormName=special_charge_form' })
								_this.dialogVisible = false
							}
						})
					}
				} else {
					this.$message({
						type: "warning",
						message: "表单验证不通过"
					});
				}
			})
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
		resetForm(){
			this.$refs['headForm'].$refs["form"].resetFields();
		}
	},
	created(){

	},
	mounted(){
		this.init()
	},
	watch: {
		mate: {
			handler(newMate, oldMate) {
			　 this.init();
	　　},
	　　immediate: true
		}
	}
}
</script>
<style lang="scss" scoped>

</style>