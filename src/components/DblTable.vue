<template>
  <div>
    <Boxer :mate="mate.mateList" :mateSearch="mate.mateSearch" :hasSelected="hasSelected" @action="handleButton" ref="Boxer" :msgBoxButton="msgBoxButton">
      <div slot="searchForm" class="leftMargin">
        <el-button size="mini" type="primary" class="el-icon-search" v-if="mate.mateSearch" @click="showSearchPopover">搜索</el-button>
      </div>
      <div slot="main">
        <simple-query :mate="mate" :inline="mate.inline" v-if="mate.mateSearch && !mate.mateSearch.multipleConditions" v-show="showAdvancedSearchPopover" @queryData="queryData"></simple-query>
        <multiple-query :pageSize="querySize" :mate="mate" :inline="mate.inline" v-if="mate.mateSearch && mate.mateSearch.multipleConditions" v-show="showAdvancedSearchPopover" @queryData="queryData"></multiple-query>
        <div>
          <Table :mate="mate.mateList" ref="table" @rowClick="rowClick" @isSelected="isSelected" @handleAction="confirm" />
          <input type="file" ref="excelFile" style="display:none" @change="fileUpload" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
          <el-row type="flex" justify="center" class="page">
            <el-col :span="12">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="mate.mateList.page"
                layout="total, prev, pager, next, sizes"
                :total="mate.mateList.total"
                :page-sizes="[5,10,15,20,30]"
                :page-size="pageSize">
              </el-pagination>
            </el-col>
          </el-row>
        </div>
      </div>
    </Boxer>
    <!--下面的明细表格-->
    <template>
      <div class="detailLine">
        <el-table :cell-style="rowClass" max-height="300" size="mini" v-if="showFlag" :data="mate.mateList.lineRows" border class="tableTop">
          <el-table-column v-if="col.blockHash" :formatter="col.formatter" v-for="col of mate.mateList.lineColumns" v-bind:key="col.name" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top" v-show="scope.row.blockHash">
                <p>区块哈希: {{ scope.row.blockHash }}</p>
                <p>上链时间: {{ scope.row.updateAt }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag>
                    <img src="../assets/imgs/ztree/ic_chain.png" style="width:13px; height:13px;margin:-2px 2px">{{ scope.row.lineNum }}
                  </el-tag>
                </div>
              </el-popover>
              <span v-show="!scope.row.blockHash">{{ scope.row.lineNum }} </span>
            </template>
          </el-table-column>
          <template v-for="col of mate.mateList.lineColumns">
            <el-table-column show-overflow-tooltip v-if="col.isShow" :formatter="col.formatter" :key="col.id" :label="col.label" :prop="col.name" :min-width="col.width"></el-table-column>
          </template>
          <el-table-column label="操作" fixed="right" :min-width="actionWidth" v-if="mate.mateList.lineActions">
            <template slot-scope="scope">
              <KBtn v-for="act of mate.mateList.lineActions" v-bind:key="act.action" size="mini" :act="act" :row="scope.row" @action="viewBom(scope.row)"></KBtn>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
    <el-dialog :visible.sync="dialogFormVisible" width="30%">
        <el-form>
            <el-form-item label="驳回原因">
                <el-input size="mini" v-model="cause"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click="dialogFormVisible = false; DialogClickOK()">确 定
            </el-button>
        </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogDisagree" width="30%">
        <el-form>
            <el-form-item label="驳回原因">
                <el-input size="mini" v-model="cause"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click="dialogDisagree = false; AgreeClickOK()">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog title="查看区块信息" :visible.sync="blockHashVisible" width="40%">
        <blockHash :hashForm="hashForm">
        </blockHash>
    </el-dialog>
    <el-dialog title="查看详情" :visible.sync="dialogVisible" v-if="mate.mateFormerHeader" width="80%">
        <el-row>
            <el-row>
                <DialogForm :mate="mate.mateFormerHeader" formModel="dialog"></DialogForm>
            </el-row>
            <el-row>
                <template>
                    <el-table max-height="300" size="mini" :data="mate.mateList.lineRows" border
                              style="width: 100%;" class="detailTable">
                        <el-table-column show-overflow-tooltip :formatter="col.formatter"
                                          v-for="col of mate.mateList.lineColumns" :key="col.id" :label="col.label"
                                          :prop="col.name">
                        </el-table-column>
                    </el-table>
                </template>
            </el-row>
        </el-row>
    </el-dialog>
    <!--标签打印-->
    <el-dialog title="标签打印" :visible.sync="asnLabelVisible" v-if="mate.mateFormerHeader" width="80%">
        <el-row>
            <el-row>
                <LabelPrint :mate="mate.mateFormerHeader" formModel="dialog" @dialogCancel="dialogCancel"></LabelPrint>
            </el-row>
        </el-row>
    </el-dialog>
    <!--物料编码打印-->
    <el-dialog title="物料编码打印" :visible.sync="materielLabelVisible" v-if="mate.mateFormerHeader" width="80%">
        <el-row>
            <el-row>
                <MaterielLabelPrint :mate="mate.mateFormerHeader" formModel="dialog" @materielLabelCancel="materielLabelCancel"></MaterielLabelPrint>
            </el-row>
        </el-row>
    </el-dialog>
    <!--BOM详情-->
    <el-dialog :visible.sync="bomDetailVisible" title="BOM详情" width="60%">
      <el-form  v-model="bomDetailForm" size="mini" label-position="right" :label-width="'100px'">
        <el-row>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="装配件编号"> 
              <el-input v-model="bomDetailForm.materialsCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="装配件名称">
              <el-input v-model="bomDetailForm.materialsName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="物料类型">
              <el-input v-model="bomDetailForm.materialsType"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row class="bomDetail">
        <el-table :data="bomDetal.rows" border size="mini">
          <el-table-column type="index"  label="序号" min-width="50"></el-table-column>
          <template v-for="col of bomDetal.columns" >
            <el-table-column v-bind:key="col.name" :label="col.label" :prop="col.name" :min-width="col.width"></el-table-column>
          </template>
        </el-table>
      </el-row>
    </el-dialog>
    <upload-dialog
      :uploadDialog="uploadDialog"
      :uploadParams="uploadAttachmentParams" 
      @closeDialog="closeDialog"/>
  </div>
</template>

<script>
import Vue from 'vue'
import {API_GATEWAY} from '@/config/index.js'
import {LANGS} from '../i18n/lang'
import KBtn from './KBtn.vue'
import Boxer from './Boxer.vue'
import ColumnFormatterMixin from '../mixins/ColumnFormatterMixin'
import QueryMixins from '../mixins/QueryMixins'
import MultipleQuery from './query/MultipleQueryForm'
import SimpleQuery from './query/SimpleQueryForm'
import Table from './Table'
import { BOM_API } from "@/services/apis";
import uploadDialog from "@/components/upload/uploadDialog";
import SERVICES from '@/services'

const BASEAPI = `${API_GATEWAY}/api`
export default {
	mixins: [ColumnFormatterMixin, QueryMixins],
	components: {
		uploadDialog,
		MultipleQuery,
		SimpleQuery,
		Table,
		KBtn,
		Boxer,
		LabelPrint: function index(resolve) {
			require(['./LabelPrint.vue'], resolve)
		},
		MaterielLabelPrint: function index(resolve) {
			require(['./MaterielLabelPrint.vue'], resolve)
		},
		Formor: function index(resolve) {
			require(['./Formor.vue'], resolve)
		},
		DialogForm: function index(resolve) {
			require(['./DialogForm.vue'], resolve)
    },
    MainTable: function index(resolve) {
      require(["@/components/table/MainTable.vue"], resolve);
    },
	},
	props: {
		mate: Object,
		mateFormerHeaderId: String
	},
	data() {
		return {
			querySize: 5, // 多条件查询默认5条
			titleOptions: [],
			operatorOptions: [],
			showAdvancedSearchPopover: false,
			pageSize: 5,
			blockHashVisible: false,
			multipleSelection: [],     // 点击table前面的框框，获取到的内容
			langs: LANGS,
			hasSelected: false,
			searchValues: {},
			hashForm: {},
			page: 0,
			sortValues: {},
			action: null,
			dialogTableVisible: false,          // dialog开关
			tableData: [],
			word: this.$t('query'),
			showFlag: false,                    // 下面表格的开关
			object: {},                          // 放columns
			fit: false,
			dialogFile: false,
			// fileuploadUrl: '${API_GATEWAY}/api/users/import',
			// fileuploadUrl: 'http://172.16.201.232:7878/api/users/import'
			filedownloadUrl: API_GATEWAY + '/api/users/downloadFile',
			headers: {
					'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
					'Accept': 'application/json',
					'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId
			},
			dialogVisible: false,
			asnLabelVisible: false,
			materielLabelVisible: false,
			dialogFormVisible: false,
			valueStatus: '',
			dialogAuditVisible: false,
			dialogUpdateVisible: false,
			dialogDisagree: false,
			cause: '',
			auditStatus: '',
			rowsContent: [],              // 获取到明细行中的数据
			urlName: '',
			fileName: '',
			checkAll: false,
			checkedLabel: [],
			isIndeterminate: true,
			lineSelected: [],               // 存放全部的label
			lineSelectedDetail: [],         // 存放全部的明细行label
			msgBoxButton: true,
      dialogDetailLine: false,
      bomDetailVisible: false,
			bomDetal: {
				columns:[
					{
						label:'层级',
						name:'level',
						width:'30px'
					},
					{
						label:'物料编码',
						name:'componentCode'
					},
					{
						label:'类型',
						name:'materialsType'
					},
					{
						label:'物料名称',
						name:'componentName'
					},
					{
						label:'规格',
						name:'specs'
					},
					{
						label:'用量',
						name:'total'
					}
				]
			},
			bomDetailForm: {},
			uploadDialog: false,        // 上传附件弹窗与否
			uploadAttachmentParams: {   // 上传附件属性配置
				rowId:'',
				serviceModel:'SALE_ORDER',
				getMethod:'getAttachMentList',
				uploadMethod:'attachMentUpload',
				deleteMethod:'deleteAttachMent',
				busType:'so_header'
			}
		}
	},
	watch: {
		// multipleSelection: function (newSelection) {
		//     this.hasSelected = (newSelection.length !== 0)
		// },
		mate: function (newMate) {
			this.formatterBefore(this.mate.mateList.columns)
			this.formatterBefore(this.mate.mateList.lineColumns)
			this.rowsContent = this.mate.mateList.rows
			this.mate.mateList.localName = this.mate.localName
			if (this.mate.mateSearch) {
				this.titleOptions = this.mate.mateSearch.fields[0].options
				this.operatorOptions = this.mate.mateSearch.fields[1].options
			}
			this.$nextTick(function () {
				this.rowSelect()
			})
		}
	},
	created() {
			if (this.mate.mateSearch) {
				if (this.mate.mateSearch !== undefined && this.mate.mateSearch.fields !== undefined && this.mate.mateSearch !== null && this.mate.mateSearch.fields !== null) {
				this.mate.mateSearch.fields.map((i) => {
						this.object[i.name] = i
				})
				this.titleOptions = this.mate.mateSearch.fields[0].options
				this.operatorOptions = this.mate.mateSearch.fields[1].options
				}
			}
			this.formatterBefore(this.mate.mateList.columns)
			this.formatterBefore(this.mate.mateList.lineColumns)
			this.rowsContent = this.mate.mateList.rows
			this.mate.mateList.localName = this.mate.localName;
			this.pageSize = this.mate.mateList.size || this.pageSize;
		},
	computed: {
		actionWidth: function () {
			return this.mate.mateList.actions.length * 60 + 60
		},
		// a computed getter
		labelWidth: function () {
			let width = ''
			if (this.mate.inline) {
				// width = undefined
				width = '100px'
			} else if (typeof (this.mate.labelWidth) === 'undefined') {
				width = '100px'
			} else {
				width = this.mate.labelWidth
			}
			return width
		}
	},
	mounted() {
		this.rowSelect()
	},
	// 需要添加刷新消息
	methods: {
    // queryData (data) {
    //   this.searchValues = data;
    // },
		/**
		 * Table勾选状态和勾选数组
		 * @params {Boolean} isSelected 勾选状态
		 * @params {Array} selectedArr 勾选数组
		 */
		isSelected (isSelected,selectedArr) {
			this.hasSelected = isSelected;
			this.multipleSelection = selectedArr;
		},
			rowClass({row, column, rowIndex, columnIndex}) {
					if (row.parentSourceId && columnIndex == 9) {
							return 'background: rgba(245,108,108,0.3);'
					}
			},
			query() {
					this.mate.mateList.lineRows = null
					const mate = [this.mate.mateSearch.values]
					const vm = this
					const url = this.mate.mateSearch.url
					this.$root.ajaxData(url, mate, function (data) {
							vm.mate.mateList.rows = data.mate.mateList.rows
							vm.mate.mateList.total = data.mate.total
					}, 'POST')
			},
			clickBlockHash(blockHash) {
					var vm = this
					this.blockHashVisible = true
					// this.$root.ajaxData(API_GATEWAY + '/hyper/block/hash/query/' + blockHash, {}, function (data) {
					//   vm.hashForm = data
					// }, 'GET')
					this.$http({
							url: API_GATEWAY + '/hyper/block/hash/query/' + blockHash,
							method: 'GET',
							headers: {
									'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
									'Accept': 'application/json',
									'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
									'Content-Type': 'application/json;charset=utf8'
							},
							responseType: 'application/json'
					}).then(function (response) {
							if (response.data.length > 0) {
									vm.blockHashVisible = true
									vm.hashForm = response.data
							} else {
									vm.hashForm = {}
									this.$message({
											message: '没有查询到区块信息',
											type: 'warning'
									})
									return
							}
					})
			},
			handleChange() {
			},
			showSearchPopover() {
					this.showAdvancedSearchPopover = !this.showAdvancedSearchPopover
			},
			fileUpload(file) {
					var vm = this
					var formdata = new FormData()
					formdata.append('file', file.target.files[0])
					this.$http({
							url: API_GATEWAY + '/zuul/api/users/import',
							method: 'POST',
							body: formdata,
							responseType: 'arraybuffer'
					}).then(function (response) {
							vm.$refs.excelFile.value = '';
							setTimeout(function () {
								// vm.$root.monitor({url: '/users/list'})
								vm.$root.monitor({url: '/users/multiTenant/list'}) // 导入成功后不刷新页面bug修复 2019-11-07
							}, 1000)
					})
			},
			confirm(act, row) {
					var vm = this
					if (act.action === 'uploadAttachment') {
						this.uploadAttachmentParams.rowId = row.id
						  this.uploadDialog = true;	
						  return false
					}
					if (act.action === 'addChild') {
							this.mate.mateFormerHeader.values = row
							this.dialogVisible = true
							return false
					}
					if (act.action === 'showAsn') {
							this.mate.mateFormerHeader.values = row
							//查看asn只展示机构、asn号、客户、预约送货时间、预约到达时间
							this.mate.mateFormerHeader.fields.splice(6, 19)
							this.dialogVisible = true
							return false
					}
					if (act.action === 'asnLabelPrint') {
							this.mate.mateFormerHeader.values = row
							//查看asn只展示机构、asn号、客户、预约送货时间、预约到达时间
							this.mate.mateFormerHeader.fields.splice(6, 19)
							this.asnLabelVisible = true
							return false
					}
					if (act.action === 'asnMaterielLabelPrint') {
							this.mate.mateFormerHeader.values = row
							//查看asn只展示机构、asn号、客户、预约送货时间、预约到达时间
							this.mate.mateFormerHeader.fields.splice(6, 19)
							this.materielLabelVisible = true
							return false
					}

					//用户删除
					if (act.action === 'deleteUser') {
							var user = JSON.parse(window.sessionStorage.getItem('user'))
							if (row.userType === '1' && user.tenantId !== '1') {
									this.$message({
											message: '不能删除管理员账号',
											type: 'warning'
									})
									return
							}
							this.$confirm('此操作将删除用户, 是否继续?', '提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning'
							}).then(() => {
									this.$root.ajaxData(act.url + '/' + row.id, {}, function (data) {
											vm.$root.monitor({url: vm.mate.mateList.dataApi})
									}, 'DELETE')
							}).catch(() => {
									this.$message({
											type: 'info',
											message: '已取消删除'
									})
							})
							return
					}
					if (act.action === 'updateUser') {
							if (row.enabled === '0') {
									this.$root.ajaxData('/users/disableUser/' + row.id + '?type=1', {}, function (data) {
											vm.$root.monitor({url: vm.mate.mateList.dataApi})
											vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
													vm.mate.mateList.rows = data.mate.mateList.rows
											}, 'GET')
									}, 'PUT')
									return
							} else {
									this.$root.ajaxData('/users/disableUser/' + row.id + '?type=0', {}, function (data) {
											vm.$root.monitor({url: vm.mate.mateList.dataApi})
											vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
													vm.mate.mateList.rows = data.mate.mateList.rows
											}, 'GET')
									}, 'PUT')
									return
							}
					}
					if (act.action === 'editUser') {
							var user = JSON.parse(window.sessionStorage.getItem('user'))
							if (row.userType === '1' && user.tenantId !== '1') {
									this.$message({
											message: '不能修改管理员账号',
											type: 'warning'
									})
									return
							}
							this.$root.handleAction(act, row, function (data) {
									vm.getData()
							})
							return
					}
					if (act.action === 'printerAsn') {
							vm.$http({
								 url: `${API_GATEWAY}/api${act.url}?format=pdf&ID=${row.shipmentHeaderId}`,
								method: 'GET',
								headers: {
									'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
									'Accept': 'application/json',
									'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
									'Content-Type': 'application/x-www-form-urlencoded;charset=utf8'
								},
								responseType: 'arraybuffer'
							}).then(function (response) {
								var blob = new Blob([response.data], {type: 'application/pdf'})
								var objectUrl = URL.createObjectURL(blob)
								var a = document.createElement('a')
								document.body.appendChild(a)
								a.setAttribute('style', 'display:none')
								a.setAttribute('href', objectUrl)
								var windowOpen = window.open(objectUrl)
								if (windowOpen == null || typeof (windowOpen) === 'undefined') {
									this.$message({
										message: '送货通知预览界面被拦截,请检查浏览器设置',
										type: 'warning'
									})
								}
							})
							return
					}
					// 行打印
					if (act.action === 'printerReport') {
						let modular = this.mate.title;
						let url ="";
						if (modular==="入库单据"){
							url = "/purchase/report/";
							let type = row.billType;
							switch(type){
								case "10": // "采购入库" 采购入库单
									url += "purchase_inbound";
									act.modular = "采购入库单";
									break;
								case "11": // "生产入库" 成品入库单
									url += "product_inbound";
									act.modular = "成品入库单";
									break;
								case "24": // "工单退料" 退料单
									url += "return_material";
									act.modular = "退料单";
									break;
								case "25": // "超领退料" 退料单
									url += "return_material";
									act.modular = "退料单";
									break;
								default:  // 他入库单 
									url += "sundry_inbound";
									act.modular = "杂项入库单";
							}
						}else if(modular==="出库单据"){
							url = "/purchase/report/";
							let type =  row.documentType;
							switch(type){
								case "64": // "工单发料" 领料单
									url += "material_receive";
									act.modular = "领料单";
									break;
								case "65": // "工单超领" 超领单
									url += "over_take";
									act.modular = "超领单";
									break;
								case "51": // "发货出库" 成品出货单
									url += "product_outbound";
									act.modular = "成品出货单";
									break;
								case "57": // "配送销售出库" 成品出货单
									url += "product_outbound";
									act.modular = "成品出货单";
									break;
								case "59": // "采购退货" 采购退货单
									url += "purchase_rejected_outbound";
									act.modular = "采购退货单";
									break;
								case "66": // "报废出库" 报废出货单
									url += "scrap_out";
									act.modular = "报废出货单";
									break;
								default:  // 他出库单 
									url += "other_out_bound";
									act.modular = "杂货出库单";
							}
						}
						act.url = url || act.url;
						vm.$http({
							url: `${API_GATEWAY}/api${act.url}?format=pdf&ID=${row.id}`,
							method: 'GET',
							headers: {
								'Authorization': `Bearer ${window.sessionStorage.getItem('token')}`,
								'Accept': 'application/json',
								'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
								'Content-Type': 'application/x-www-form-urlencoded;charset=utf8'
							},
							responseType: 'arraybuffer'
						}).then(function (response) {
							var blob = new Blob([response.data], {type: 'application/pdf'})
							var objectUrl = URL.createObjectURL(blob)
							var a = document.createElement('a')
							document.body.appendChild(a)
							a.setAttribute('style', 'display:none')
							a.setAttribute('href', objectUrl)
							var windowOpen = window.open(objectUrl)
							if (windowOpen == null || typeof (windowOpen) === 'undefined') {
								this.$message({
									message: `${act.modular}预览界面被拦截,请检查浏览器设置`,
									type: 'warning'
								})
							}
						})
						return
					}
					this.$root.handleAction(act, row, function (data) {
							vm.getData()
					})
			},
			/**
			 * 关闭上传附件弹窗
			 * @param void
			 * @return void
			 */
			closeDialog (bool) {
			  this.uploadDialog = false;
			},
			updated() {
					this.showFlag = false
			},
			rowClick(row) {
					this.showFlag = true
					var vm = this
					var id=row.shipmentHeaderId;
					if(row.shipmentHeaderId==null||row.shipmentHeaderId==""	){//常规页面
						id=row.id;
					}
					else{
						id=row.shipmentHeaderId;//发运通知页面
					}
					// 用户管理获取明细行
					if (this.mate.mateList.userListClick) {
						this.$root.ajaxData('/users/multiTenant/line/list/' + id, {}, function (data) {
							Vue.set(vm.mate.mateList, 'lineRows', data)
							vm.mate.mateList.lineRows = data
						}, 'GET')
						return;
					}
					this.$root.ajaxData(this.mate.mateList.url + '/' + id, {}, function (data) {
							Vue.set(vm.mate.mateList, 'lineRows', data)
							vm.mate.mateList.lineRows = data
					}, 'GET')
			},
			back() {
					this.dialogTableVisible = false
			},
			DialogClickOK() {
					var vm = this
					const rowt = {id: this.multipleSelection.map((r) => r.id)}
					this.$root.ajaxData(this.btn.url + 2 + '?ids=' + rowt.id + '&approvalComments=' + this.cause, {}, function (data) {
							vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
									vm.mate.mateList.rows = data.mate.mateList.rows
							}, 'GET')
					}, 'PUT')
					this.cause = ''
			},
			AgreeClickOK() {
					var vm = this
					const rowt = {id: this.multipleSelection.map((r) => r.id)}
					this.$root.ajaxData(this.btn.url + 2 + '?ids=' + rowt.id + '&approvalComments=' + this.cause, {}, function (data) {
							vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
									vm.mate.mateList.rows = data.mate.mateList.rows
							}, 'GET')
					}, 'PUT')
					this.cause = ''
			},
			AuditClickOK() {
					var vm = this
					const rowt = {id: this.multipleSelection.map((r) => r.id)}
					this.$root.ajaxData(this.btn.url + this.auditStatus + '?ids=' + rowt.id, {}, function () {
							vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
									vm.mate.mateList.rows = data.mate.rows
							}, 'GET')
					}, 'PUT')
			},
			UpdateClickOK() {
					var vm = this
					const rowt = {id: this.multipleSelection.map((r) => r.id)}
					this.$root.ajaxData(this.btn.url + this.updateStatus + '?ids=' + rowt.id, {}, function () {
							vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
									vm.mate.mateList.rows = data.mate.mateList.rows
							}, 'GET')
					}, 'PUT')
			},
			handleButton(btn) {
					var vm = this
					let row = (btn.isApi || btn.ajax) ? {id: this.multipleSelection.map((r) => r.id)} : {}
					let rowLine = this.multipleSelection
					// 入库单据中需要的审批按钮
					if (btn.action === 'disableSelectedAudit') {
							for (var i = 0; i < this.multipleSelection.length; i++) {
									if (this.multipleSelection[i].status === '3') {
											vm.$message({
													type: 'warning',
													message: vm.$t('Already approve')
											})
											return
									} else if (this.multipleSelection[i].status !== '1') {
											vm.$message({
													type: 'warning',
													message: vm.$t('selectApprove')
											})
											return
									}
							}
							this.btn = btn
							row = true ? {id: this.multipleSelection.map((r) => r.id)} : {}
							this.$root.ajaxData(btn.url + 3 + '?ids=' + row.id, {}, function (data) {
									vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
											vm.mate.mateList.rows = data.mate.mateList.rows
									}, 'GET')
							}, 'PUT')
							return
					}
					// 入库单提交审批
					if (btn.action === 'submitAudit') {
							for (i = 0; i < this.multipleSelection.length; i++) {
									if (this.multipleSelection[i].status === '1') {
											vm.$message({
													type: 'warning',
													message: vm.$t('Already approve')
											})
											return
									} else if (this.multipleSelection[i].status === '0' || this.multipleSelection[i].status === '2') {
											this.btn = btn
											row = true ? {id: this.multipleSelection.map((r) => r.id)} : {}
											this.$root.ajaxData(btn.url + 1 + '?ids=' + row.id, {}, function (data) {
													vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
															vm.mate.mateList.rows = data.mate.mateList.rows
													}, 'GET')
											}, 'PUT')
									} else {
											vm.$message({
													type: 'warning',
													message: vm.$t('selectEntered')
											})
											return
									}
							}
							return
					}
					// 用户管理导入
					if (btn.action === 'importUser') {
							this.$refs.excelFile.click()
							this.title = '导入用户数据'
							return
					}
					// 用户管理导出
					if (btn.action === 'exportUser') {
							this.$http({
									url: API_GATEWAY + '/api/users/export',
									method: 'POST',
									headers: {
											'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
											'Accept': 'application/json',
											'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
											'Content-Type': 'application/x-www-form-urlencoded;charset=utf8'
									},
									responseType: 'arraybuffer'
							}).then(function (response) {
									var blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
									// blob(size,type) Blob构造函数，接受两个参数。第一个参数是一个包含实际数据的数组，第二个参数是数据的类型
									var objectUrl = URL.createObjectURL(blob)
									var a = document.createElement('a')
									document.body.appendChild(a)
									a.setAttribute('style', 'display:none')
									a.setAttribute('href', objectUrl)
									var filename = '用户信息.xlsx'
									a.setAttribute('download', filename)
									a.click()
									URL.revokeObjectURL(objectUrl)
							})
							return
					}
					// 用户管理下载模板
					if (btn.action === 'downloadFile') {
							this.$http({
									url: API_GATEWAY + '/api/users/downloadFile',
									method: 'POST',
									headers: {
											'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
											'Accept': 'application/json',
											'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
											'Content-Type': 'application/x-www-form-urlencoded;charset=utf8'
									},
									responseType: 'arraybuffer'
							}).then(function (response) {
									var blob = new Blob([response.data], {type: 'application/vnd.ms -excel'})
									var objectUrl = URL.createObjectURL(blob)
									var a = document.createElement('a')
									document.body.appendChild(a)
									a.setAttribute('style', 'display:none')
									a.setAttribute('href', objectUrl)
									var filename = '用户导入数据模板.xlsx'
									a.setAttribute('download', filename)
									a.click()
									URL.revokeObjectURL(objectUrl)
							})
							return
					}
					// 入库单驳回
					if (btn.action === 'bohuiAudit') {
							for (i = 0; i < this.multipleSelection.length; i++) {
									if (this.multipleSelection[i].status === '2') {
											vm.$message({
													type: 'warning',
													message: vm.$t('rejected')
											})
											return
									}
									if (this.multipleSelection[i].status !== '1') {
											vm.$message({
													type: 'warning',
													message: '不能驳回'
											})
											return
									}
							}
							this.dialogFormVisible = true
							this.btn = btn
							return
					}
					// 出库提交审批
					if (btn.action === 'submitOutbound') {
							for (i = 0; i < this.multipleSelection.length; i++) {
									if (this.multipleSelection[i].status === '1') {
											vm.$message({
													type: 'warning',
													message: vm.$t('Already approve')
											})
											return
									} else if (this.multipleSelection[i].status === '0' || this.multipleSelection[i].status === '2') {
											this.btn = btn
											row = true ? {id: this.multipleSelection.map((r) => r.id)} : {}
											this.$root.ajaxData(btn.url + 1 + '?ids=' + row.id, {}, function (data) {
													vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
															vm.mate.mateList.rows = data.mate.mateList.rows
													}, 'GET')
											}, 'PUT')
									} else {
											vm.$message({
													type: 'warning',
													message: vm.$t('selectEntered')
											})
											return
									}
							}
							return
					}
					// 出库单审批
					if (btn.action === 'auditOutbound') {
							for (i = 0; i < this.multipleSelection.length; i++) {
									if (this.multipleSelection[i].status === '3') {
											vm.$message({
													type: 'warning',
													message: vm.$t('Already approve')
											})
											return
									} else if (this.multipleSelection[i].status !== '1') {
											vm.$message({
													type: 'warning',
													message: vm.$t('selectApprove')
											})
											return
									}
							}
							this.btn = btn
							row = true ? {id: this.multipleSelection.map((r) => r.id)} : {}
							this.$root.ajaxData(btn.url + 3 + '?ids=' + row.id, {}, function (data) {
									vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
											vm.mate.mateList.rows = data.mate.mateList.rows
									}, 'GET')
							}, 'PUT')
							return
					}
					// 出库驳回功能
					if (btn.action === 'bohuiOutbound') {
							for (i = 0; i < this.multipleSelection.length; i++) {
									if (this.multipleSelection[i].status === '2') {
											vm.$message({
													type: 'warning',
													message: vm.$t('rejected')
											})
											return
									}
									if (this.multipleSelection[i].status !== '1') {
											vm.$message({
													type: 'warning',
													message: '不能驳回'
											})
											return
									}
							}
							this.dialogFormVisible = true
							this.btn = btn
							return
					}
					// 请购单状态审核
					if (btn.action === 'updateStatus') {
							for (i = 0; i < this.multipleSelection.length; i++) {
									if (this.multipleSelection[i].state === '3') {
											vm.$message({
													type: 'warning',
													message: vm.$t('examined')
											})
											return
									} else if (this.multipleSelection[i].state === '1') {
											const rowt = {id: this.multipleSelection.map((r) => r.id)}
											this.$root.ajaxData(btn.url + '/' + 3 + '?ids=' + rowt.id, {}, function (data) {
													vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
															vm.mate.mateList.rows = data.mate.mateList.rows
													}, 'GET')
											}, 'PUT')
											this.btn = btn
											return
									} else {
											vm.$message({
													message: '不能审批',
													type: 'warning'
											})
											return
									}
							}
					}
					// 请购单提交审批
					if (btn.action === 'submitStatus') {
							const rowt = {id: this.multipleSelection.map((r) => r.id)}
							for (let i = 0; i < this.multipleSelection.length; i++) {
									if (this.multipleSelection[i].state === '0') {
											this.$root.ajaxData(btn.url + '/' + 1 + '?ids=' + rowt.id, {}, function (data) {
													vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
															vm.mate.mateList.rows = data.mate.mateList.rows
													}, 'GET')
											}, 'PUT')
											return
									} else {
											vm.$message({
													message: '不能提交审批',
													type: 'warning'
											})
											return
									}
							}
					}
					// 请购单删除
					if (btn.action === 'deletePurchase') {
							const rowt = {id: this.multipleSelection.map((r) => r.id)}
							this.$http.delete(BASEAPI + '/purchase/reqPurchase/batchDelete' + '?ids=' + rowt.id)
									.then(response => {
											if (response.data.statusCode === 40015) {
													vm.$message({
															type: 'warning',
															message: '已审批不能删除'
													})
													return false
											} else {
													vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
															vm.mate.mateList.rows = data.mate.mateList.rows
													}, 'GET')
											}
									})
							return
					}
					// 请购单驳回
					if (btn.action === 'difStatus') {
							const rowt = {id: this.multipleSelection.map((r) => r.id)}
							for (i = 0; i < this.multipleSelection.length; i++) {
									if (this.multipleSelection[i].state === '2') {
											vm.$message({
													type: 'warning',
													message: '已驳回'
											})
											return false
									}
							}
							for (var j = 0; j < this.multipleSelection.length; j++) {
									if (this.multipleSelection[j].state !== '1') {
											vm.$message({
													type: 'warning',
													message: '不能驳回'
											})
											return false
									}
							}
							this.dialogFormVisible = true
							this.btn = btn
							return
					}
					// 请购单修改
					if (btn.action === 'editPurchase') {
							if (this.multipleSelection.length !== 1) {
									vm.$message({
											message: this.$t('seladata'),
											type: 'warning'
									})
									return
							}
							for (let i = 0; i < this.multipleSelection.length; i++) {
									if (this.multipleSelection[i].state === '3') {
											vm.$message({
													message: this.$t('alreadyAgree'),
													type: 'warning'
											})
											return
									}
									if (this.multipleSelection[i].state === '1') {
											vm.$message({
													message: '不能修改',
													type: 'warning'
											})
											return
									}
							}
							const row = true ? {id: this.multipleSelection.map((r) => r.id)} : {}
							this.$root.handleAction(btn, row, function () {
							})
							return
					}
					// 调拨单删除
					if (btn.action === 'deleteDbBill') {
							if (this.multipleSelection.length !== 1) {
									vm.$message({
											message: this.$t('seladata'),
											type: 'warning'
									})
									return
							}
							rowLine = true ? {billNo: this.multipleSelection.map((r) => r.billNo)} : {}
							row = true ? {id: this.multipleSelection.map((r) => r.id)} : {}
							this.$root.ajaxData('/inventory/dallot/checkDallot/0?billNo=' + rowLine.billNo, {}, function (data) {
									if (data.code === 40023) {
											vm.$message({
													message: '已生成出库单',
													type: 'warning'
											})
											return
									} else if (data.code === 40021) {
											vm.$message({
													message: '已生成入库单',
													type: 'warning'
											})
											return
									} else {
											vm.$root.ajaxData(btn.url + row.id, {}, function (data) {
													vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
															vm.mate.mateList.rows = data.mate.mateList.rows
															vm.mate.mateList.total = data.mate.mateList.total
													}, 'GET')
											}, 'DELETE')
											return
									}
							}, 'GET')
							return
					}
					// 调拨单生成出库单
					if (btn.action === 'toAddOutBound') {
							if (this.multipleSelection.length !== 1) {
									vm.$message({
											message: this.$t('seladata'),
											type: 'warning'
									})
									return
							}
							row = true ? {id: this.multipleSelection.map((r) => r.id)} : {}
							rowLine = true ? {billNo: this.multipleSelection.map((r) => r.billNo)} : {}
							this.$root.ajaxData('/inventory/dallot/checkDallot/2?billNo=' + rowLine.billNo, {}, function (data) {
									if (data.code === 40023) {
											vm.$message({
													message: '已生成出库单',
													type: 'warning'
											})
											return
									} else {
											vm.$root.monitor({url: '/inventory/dallot/genOutboundBill/' + row.id})
									}
							}, 'GET')
							return
					}
					// 调拨单生成入库单
					if (btn.action === 'toAddInBound') {
							if (this.multipleSelection.length !== 1) {
									vm.$message({
											message: this.$t('seladata'),
											type: 'warning'
									})
									return
							}
							row = true ? {id: this.multipleSelection.map((r) => r.id)} : {}
							rowLine = true ? {billNo: this.multipleSelection.map((r) => r.billNo)} : {}
							this.$root.ajaxData('/inventory/dallot/checkDallot/1?billNo=' + rowLine.billNo, {}, function (data) {
									if (data.code === 40021) {
											vm.$message({
													message: '已生成入库单',
													type: 'warning'
											})
											return
									} else {
											vm.$root.monitor({url: '/inventory/dallot/genInbounBill/' + row.id})
									}
							}, 'GET')
							return
					}
					if (btn.action === 'auditIsPass') {
							for (i = 0; i < this.multipleSelection.length; i++) {
									if (this.multipleSelection[i].state === '1') {
											vm.$message({
													type: 'warning',
													message: vm.$t('Already approve')
											})
											return
									}
									this.btn = btn
									row = true ? {id: this.multipleSelection.map((r) => r.id)} : {}
									this.$root.ajaxData(btn.url + 1 + '?ids=' + row.id, {}, function (data) {
											vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
													vm.mate.mateList.rows = data.mate.mateList.rows
											}, 'GET')
									}, 'PUT')
							}
							return
					}
					if (btn.action === 'buhuiIsPass') {
							for (i = 0; i < this.multipleSelection.length; i++) {
									if (this.multipleSelection[i].state === '2') {
											vm.$message({
													type: 'warning',
													message: vm.$t('rejected')
											})
											return
									}
							}
							this.dialogFormVisible = true
							this.btn = btn
							return
					}
					// 合格供应商审批
					if (btn.action === 'auditPrice') {
							const rowt = {id: this.multipleSelection.map((r) => r.id)}
							this.$root.ajaxData(btn.url + 1 + '?ids=' + rowt.id, {}, function (data) {
									if (data.statusCode === 40015) {
											vm.$message({
													type: 'warning',
													message: vm.$t('Already approve')
											})
									}
									vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
											vm.mate.mateList.rows = data.mate.mateList.rows
									}, 'GET')
							}, 'PUT')
							return
					}
					if (btn.action === 'shixiaoPrice') {
							const rowt = {id: this.multipleSelection.map((r) => r.id)}
							this.$root.ajaxData(btn.url + 2 + '?ids=' + rowt.id, {}, function (data) {
									vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
											vm.mate.mateList.rows = data.mate.mateList.rows
									}, 'GET')
							}, 'PUT')
							return
					}
					// 入库单删除
					if (btn.action === 'delete') {
							const rowt = {id: this.multipleSelection.map((r) => r.id)}
							for (i = 0; i < this.multipleSelection.length; i++) {
									if (this.multipleSelection[i].status === '3' || this.multipleSelection[i].status === '1') {
											vm.$message({
													type: 'warning',
													message: '不能删除'
											})
											return
									}
							}
							this.$confirm('是否删除此条内容?', '提示', {
								confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning'
							}).then(response => {
									vm.$http.delete(BASEAPI + '/inbound/bill/headers/batchDel' + '?ids=' + rowt.id).then(res=>{
										vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
											vm.mate.mateList.rows = data.mate.mateList.rows;
											vm.mate.mateList.total = data.mate.mateList.total;
											vm.mate.mateList.lineRows = null;
										}, 'GET')
									});
									this.$message({
											type: 'success',
											message: '删除成功!'
									})
							}).catch(() => {
									this.$message({
											type: 'info',
											message: '已取消删除'
									})
							})
							return
					}
					// 入库单据生成二维码
					if (btn.action === 'createQRcode') {
							const rowt = {id: this.multipleSelection.map((r) => r.id)}
							var element = this.rowsContent.find((i) => {
									if (i.id === rowt.id[0]) {
											return i
									}
							})
							if (element.billCode) {
									this.urlName = BASEAPI + btn.url + element.billCode + '&imgName=' + element.billCode + '.jpg'
									this.fileName = element.billCode + '.jpg'
							} else if (element.pickNo) {
									this.urlName = BASEAPI + btn.url + element.id + '&imgName=' + element.pickNo + '.jpg'
									this.fileName = element.pickNo + '.jpg'
							} else if (element.packageNo) {
									this.urlName = BASEAPI + btn.url + element.id + '&imgName=' + element.packageNo + '.jpg'
									this.fileName = element.packageNo + '.jpg'
							}
							this.$http({
									url: this.urlName,
									method: 'GET',
									headers: {
											'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
											'Accept': 'application/json',
											'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
											'Content-Type': 'application/x-www-form-urlencoded;charset=utf8'
									},
									responseType: 'arraybuffer'
							}).then(function (response) {
									var blob = new Blob([response.data])
									var objectUrl = URL.createObjectURL(blob)
									var a = document.createElement('a')
									document.body.appendChild(a)
									a.setAttribute('style', 'display:none')
									a.setAttribute('href', objectUrl)
									var filename = this.fileName
									a.setAttribute('download', filename)
									a.click()
									URL.revokeObjectURL(objectUrl)
							})
							return
					}
					// 入库单修改
					if (btn.action === 'updataBill') {
							if (this.multipleSelection.length !== 1) {
									vm.$message({
											message: this.$t('seladata'),
											type: 'warning'
									})
									return
							}
							row = true ? {id: this.multipleSelection.map((r) => r.id)} : {}
							const findResult = this.rowsContent.find((item) => {
									if (item.id === row.id[0]) {
											return item
									}
							})
							if (findResult !== undefined && findResult.status !== undefined) {
									if (findResult.status === '3' || findResult.status === '1') {
											this.$message({
													message: this.$t('alreadyAgree'),
													type: 'warning'
											})
											return
									}
							}
							this.$root.handleAction(btn, row, function () {
							})
							return
					}
					// 新增的时候不需要带上row，也不需要带上select前面的id
					if (btn.action === 'addDetailBill') {
							this.$emit('action', btn)
							return
					}
					// 修改的时候要带上select前面的id
					if (btn.action === 'updataDetailBill') {
							row = true ? {id: this.multipleSelection.map((r) => r.id)} : {}
							this.$emit('action', btn, row)
							return
          }
          // 打印
					if (btn.action === 'report') {
							// this.mate.mateList.url = REPORT_SERVER_URL + btn.url + '&id=' + row.id
							// this.$emit('route', 'FReport', this.mate.mateList)
							// return
					}
					if (btn.action === 'toInspect') {
							row = true ? {id: this.multipleSelection.map((r) => r.id)} : {}
							this.$root.handleAction(btn, row, function () {
							})
							return
					}
					if (btn.action === 'updateInspect') {
							if (this.multipleSelection.length !== 1) {
									vm.$message({
											message: this.$t('seladata'),
											type: 'warning'
									})
									return
							}
							row = true ? {id: this.multipleSelection.map((r) => r.id)} : {}
							this.$root.handleAction(btn, row, function () {
							})
							return
					}
					// 预发货通知生成入库单
					if (btn.action === 'createAsn') {
							const vm = this
							if (this.multipleSelection.length !== 1) {
									vm.$message({
											message: this.$t('seladata'),
											type: 'warning'
									})
									return
							}
							row = true ? {id: this.multipleSelection.map((r) => r.id)} : {}
							this.$root.ajaxData('/purchase/asn/checkExistInboundBill/' + row.id, {}, function (data) {
									if (data.statusCode === 10001) {
											vm.$message({
													message: data.message,
													type: 'warning'
											})
											return
									} else {
											vm.$root.handleAction(btn, row, function () {
											})
									}
							}, 'GET')
							return
					}
					// 采购退货生成出库单
					if (btn.action === 'createOutBoundBill') {
							const vm = this
							if (this.multipleSelection.length !== 1) {
									vm.$message({
											message: this.$t('seladata'),
											type: 'warning'
									})
									return
							}
							row = true ? {id: this.multipleSelection.map((r) => r.id)} : {}
							this.$root.ajaxData('/purchase/purchase/returns/checkExistOutboundBill/' + row.id, {}, function (data) {
									if (data.statusCode === 10002) {
											vm.$message({
													message: data.message,
													type: 'warning'
											})
											return
									} else {
											vm.$root.handleAction(btn, row, function () {
											})
									}
							}, 'GET')
							return
					}
					if (btn.action === 'toPutaway' || btn.action === 'updatePutaway') {
							if (this.multipleSelection.length !== 1) {
									vm.$message({
											message: this.$t('seladata'),
											type: 'warning'
									})
									return
							}
							row = true ? {id: this.multipleSelection.map((r) => r.id)} : {}
							this.$root.handleAction(btn, row, function () {
							})
							return
					}
					if (btn.action === 'createdWave') {
							this.$root.ajaxData('/outbound/pick/header/makePick', {}, function (data) {
									var message = data.bodyText
									if (message === 'exist') {
											message = vm.$t('No data can produce waves')
									} else if (message === 'noenough') {
											message = vm.$t('Inventory shortage')
									} else {
											message = vm.$t('Successful operation')
									}

									if (message === vm.$t('Successful operation')) {
											vm.$message({
													message: message,
													type: 'success'
											})

											vm.$root.monitor({url: '/outbound/pick/header/all/list'})
									} else {
											vm.$message({
													message: message,
													type: 'warning'
											})
									}
							}, 'GET')
							return
					}
					if (btn.action === 'select') {
							row = true ? {id: this.multipleSelection.map((r) => r.id)} : {}
							for (let i = 0; i < this.rowsContent.length; i++) {
									if (this.rowsContent[i].id === row.id[0]) {
											if (this.rowsContent[i].docStatus > 2) {
													vm.$message({
															message: this.$t('BatchPickingByWave'),
															type: 'warning'
													})
													return
											}
									}
							}
							this.$root.handleAction(btn, row, function () {
							})
							return
					}
					if (btn.action === 'outbound') {
							row = true ? {id: this.multipleSelection.map((r) => r.id)} : {}
							for (let i = 0; i < this.rowsContent.length; i++) {
									if (this.rowsContent[i].id === row.id[0]) {
											if (this.rowsContent[i].docStatus !== '3') {
													vm.$message({
															message: this.$t('outBoundByWave'),
															type: 'warning'
													})
													return
											}
									}
							}
							this.$root.handleAction(btn, row, function () {
							})
							return
					}
					// 出库单删除
					if (btn.action === 'deleteClient') {
							for (i = 0; i < this.multipleSelection.length; i++) {
									if (this.multipleSelection[i].status !== '0' && this.multipleSelection[i].status !== '2') {
											this.$message({
													type: 'warning',
													message: '不能删除'
											})
											return
									} else {
											row = true ? {id: this.multipleSelection.map((r) => r.id)} : {}
											this.$confirm('此操作将订单删除, 是否继续?', '提示', {
													confirmButtonText: '确定',
													cancelButtonText: '取消',
													type: 'warning'
											}).then(() => {
													this.$root.ajaxData('/outbound/bill/headers/batchDel?ids=' + row.id, {}, function (data) {
															vm.$root.monitor({url: '/outbound/bill/headers/all/list', method: 'GET'})
													}, 'DELETE')
											}).catch(() => {
													this.$message({
															type: 'info',
															message: '未删除'
													})
											})
									}
							}
							return
					}
					// 波次拣选管理 取消按钮
					if (btn.action === 'cancel') {
						  var isCancel = false
						  this.multipleSelection.forEach(item => {
								if(item.docStatus === "4"){
									isCancel = true
								}
							})
							if(!isCancel)	{
								this.$confirm(this.$t('confirmText'), this.$t('toast.prompt'), {
										confirmButtonText: this.$t('confirm'),
										cancelButtonText: this.$t('cancel'),
										type: 'warning'
									}).then(() => {
											row = true ? {id: this.multipleSelection.map((r) => r.id)} : {}
											row.id = row.id.join(',')
											this.$root.ajaxData('/outbound/pick/lines/cancel?ids=' + row.id, {}, function () {
													vm.$root.monitor({url: '/outbound/pick/header/all/list', method: 'GET'})
											}, 'GET')
											this.$message({
													type: 'success',
													message: this.$t('cancelSucc')
											})
									}).catch(() => {
											this.$message({
													type: 'info',
													message: this.$t('cancelConfirm')
											})
									})
								} else {
									this.$message({
										type: 'warning',
										message: "已取消的信息不能再次取消"
									})
								}
							
							// this.$root.handleAction(btn, row, function () {})
							return
					}
					// 预发货通知取消
					if (btn.action === 'cancelAsn') {
							if (this.multipleSelection.length !== 1) {
									vm.$message({
											message: this.$t('seladata'),
											type: 'warning'
									})
									return
							}
							if (this.multipleSelection[0].state === 2) {
									vm.$message({
											message: '待定状态的ASN不能取消',
											type: 'warning'
									})
									return
							}
							if (this.multipleSelection[0].state === 4) {
									vm.$message({
											message: '待定取消状态的ASN不能取消',
											type: 'warning'
									})
									return
							}
							for (var j = 0; j < this.multipleSelection.length; j++) {
									if (this.multipleSelection[j].state === 0) {
											vm.$message({
													message: this.$t('cancelAsn'),
													type: 'warning'
											})
											return
									}
							}
							this.$confirm(this.$t('confirmAsn'), this.$t('toast.prompt'), {
									confirmButtonText: this.$t('confirm'),
									cancelButtonText: this.$t('cancel'),
									type: 'warning'
							}).then(() => {
									row = true ? {asnCode: this.multipleSelection.map((r) => r.asnCode)} : {}
									alert(row);
									alert(row.asnCode);
									this.$root.ajaxData('/purchase/asn/cancelAsnEbs/' + row.asnCode, {}, function (data) {
											if (data.statusCode === 200) {
													vm.$message({
															message: data.message,
															type: 'success'
													})
											} else {
													if (data.statusCode === 40021) {
															vm.$message({
																	message: vm.$t('alreadyInbound'),
																	type: 'warning'
															})
															return
													} else {
															vm.$message({
																	message: data.message,
																	type: 'warning'
															})
													}
											}
											vm.$root.monitor({url: '/purchase/asn/all/list', method: 'GET'})
									}, 'PUT')
							}).catch(() => {
									this.$message({
											type: 'info',
											message: this.$t('cancelConfirm')
									})
							})
							return
					}
					if (btn.action === 'updatePackage') {
							if (this.multipleSelection.length !== 1) {
									vm.$message({
											message: this.$t('Please select a row of data'),
											type: 'warning'
									})
									return
							}
							row = true ? {id: this.multipleSelection.map((r) => r.id)} : {}
							this.$root.handleAction(btn, row, function () {
							})
							return
					}
					// 采购询价审批
					if (btn.action === 'shenpiInquiry') {
							for (i = 0; i < this.multipleSelection.length; i++) {
									if (this.multipleSelection[i].auditStatus === '1') {
											vm.$message({
													type: 'warning',
													message: vm.$t('Already approve')
											})
											return
									}
							}
							this.btn = btn
							const rowt = {id: this.multipleSelection.map((r) => r.id)}
							this.$root.ajaxData(this.btn.url + 3 + '?ids=' + rowt.id, {}, function (data) {
									if (data.data !== null && data.data !== '') {
											vm.$message({
													type: 'warning',
													message: data.data + '没找到供应商'
											})
											return
									}
									vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
											vm.mate.mateList.rows = data.mate.mateList.rows
									}, 'GET')
							}, 'PUT')
							return
					}
					// 采购询价驳回
					if (btn.action === 'bohuiInquiry') {
							if (this.multipleSelection[0].status !== 'undefined') {
									this.auditStatus = this.multipleSelection[0].auditStatus             // 将需要改变的那一行的状态显示在弹出框上
							}
							this.btn = btn
							if (this.auditStatus !== '1') {
									vm.$message({
											type: 'warning',
											message: '不能驳回'
									})
									return false
							}
							this.dialogFormVisible = true
							this.btn = btn
							return
					}
					if (btn.action === 'updateInquiry' || btn.action === 'updateQuotation' || btn.action === 'updateAsn') {
							if (this.multipleSelection.length !== 1) {
									vm.$message({
											message: this.$t('seladata'),
											type: 'warning'
									})
									return
							}
							row = true ? {id: this.multipleSelection.map((r) => r.id)} : {}
							this.$root.handleAction(btn, row, function () {
							})
							return
					}
					// 对账单修改
					if (btn.action === 'updataRecon') {
							if (this.multipleSelection.length !== 1) {
									vm.$message({
											message: this.$t('seladata'),
											type: 'warning'
									})
									return
							}
							if (this.multipleSelection[0].state === '0') {
									row = true ? {id: this.multipleSelection.map((r) => r.id)} : {}
									this.$root.handleAction(btn, row, function () {
									})
									return
							} else {
									vm.$message({
											message: this.$t('cannotChange'),
											type: 'warning'
									})
									return
							}
					}
					// 对账单删除
					if (btn.action === 'deleteRecon') {
							for (i = 0; i < this.multipleSelection.length; i++) {
									if (this.multipleSelection[i].state === '0') {
											this.$http.delete(BASEAPI + '/purchase/recon/del?ids=' + this.multipleSelection[i].id)
													.then(response => {
															vm.$root.ajaxData('/purchase/recon/all/list', {}, function (data) {
																	vm.mate.mateList = data.mate.mateList
															}, 'GET')
													})
											return
									} else {
											vm.$message({
													message: this.$t('undelete'),
													type: 'warning'
											})
											return
									}
							}
					}
					// 对账单发送对账
					if (btn.action === 'sendRecon') {
							const rowt = {id: this.multipleSelection.map((r) => r.id)}
							for (i = 0; i < this.multipleSelection.length; i++) {
									if (this.multipleSelection[i].supplierOfficeId === '' || this.multipleSelection[i].supplierOfficeId === null) {
											vm.$message({
													message: '无需发送对账，请线下对账',
													type: 'warning'
											})
											return
									}
									if (this.multipleSelection[i].state === '0') {
											vm.$root.ajaxData('/purchase/recon/sendRecon?ids=' + rowt.id, {}, function (data) {
													vm.$root.monitor({url: '/purchase/recon/all/list', method: 'GET'})
											}, 'POST')
											return
									} else {
											vm.$message({
													message: this.$t('sended'),
													type: 'warning'
											})
											return
									}
							}
					}
					// 结算单取消(new)
					if (btn.action === 'cancelSettlement') {
							for (let i = 0; i < this.multipleSelection.length; i++) {
									if (this.multipleSelection[i].state !== 0 && this.multipleSelection[i].state !== 1 && this.multipleSelection[i].state !== 4) {
											this.$message({
													message: '只有新建、已确定、对账中才能取消',
													type: 'warning'
											})
											return
									}
							}
							const rowt = {id: this.multipleSelection.map((r) => r.id)}
							this.$root.ajaxData(btn.url + rowt.id, {}, function (data) {
									vm.$root.monitor({url: '/purchase/settlement/all/list', method: 'GET'})
							}, btn.method)
							return
					}
					// 删除，发送结算单
					if (btn.action === 'deleteSettlement' || btn.action === 'sendSettlement') {
							for (let i = 0; i < this.multipleSelection.length; i++) {
									if (this.multipleSelection[i].state != 0) {
											this.$message({
													message: '请选择状态为新建的数据',
													type: 'warning'
											})
											return
									}
							}
							const rowt = {id: this.multipleSelection.map((r) => r.id)}
							this.$root.ajaxData(btn.url + rowt.id, {}, function (data) {
									vm.$root.monitor({url: '/purchase/settlement/all/list', method: 'GET'})
							}, btn.method)
							return
					}
					// 结算单生成预制发票
					if (btn.action === 'sendReceivable') {
							for (let i = 0; i < this.multipleSelection.length; i++) {
									if (this.multipleSelection[i].state != 1) { // 1是已确定状态
											this.$message({
													message: '请选择状态为已确定的数据',
													type: 'warning'
											})
											return
									}
							}
							const rowt = {id: this.multipleSelection.map((r) => r.id)}

							return
					}
					// 结算单确认、驳回
					if (btn.action === 'confirmSettlement' || btn.action === 'rejectSettlement') {
							const rowt = {id: this.multipleSelection.map((r) => r.id)}
							for (let i = 0; i < this.multipleSelection.length; i++) {
									if (this.multipleSelection[i].state != 4) {
											this.$message({
													message: '请选择状态为待采购方确认的数据',
													type: 'warning'
											})
											return
									}
							}
							vm.$root.ajaxData(btn.url, rowt.id, function (data) {
									vm.$root.monitor({url: '/purchase/settlement/all/list?businessType=true', method: 'GET'})
									this.$message({
											type: 'info',
											message: data.message
									})
							}, btn.method)
							return
					}
					// 结算单确认 财务审批
					if (btn.action === 'auditPass' || btn.action === 'auditReject') {
							const rowt = {id: this.multipleSelection.map((r) => r.id)}
							for (let i = 0; i < this.multipleSelection.length; i++) {
									if (this.multipleSelection[i].auditStatus != 1) {
											this.$message({
													message: '请选择审批状态为待审批状态的数据',
													type: 'warning'
											})
											return
									}
							}
							vm.$root.ajaxData(btn.url, rowt.id, function (data) {
									vm.$root.monitor({url: '/purchase/settlement/all/list?businessType=true', method: 'GET'})
							}, btn.method)
							return
					}
					// 结算单确认生成ebs发票
					if (btn.action == 'genEbsInvoice') {
							if (this.multipleSelection.length !== 1) {
									this.$message({
											message: '只能选择一条结算单',
											type: 'warning'
									})
									return
							}
							if (this.multipleSelection[0].state != '2') {
									this.$message({
											message: '结算单的状态只能为已开票',
											type: 'warning'
									})
									return
							}
							const rowt = {id: this.multipleSelection.map((r) => r.id)}
							vm.$root.ajaxData(btn.url + '/' + rowt.id, {}, function (data) {
									vm.$root.monitor({url: '/purchase/settlement/all/list?businessType=true', method: 'GET'})
									if (data.statusCode === 200) {
											vm.$message({
													message: data.message,
													type: 'success'
											})
									}
									if (data.statusCode === 500) {
											vm.$message({
													message: data.message,
													type: 'error'
											})
									}
							}, btn.method)
							return
					}
					// 结算单确认导出
					if (btn.action === 'exportSettlement') {
							if (this.multipleSelection.length > 1) {
									this.$message({
											message: '请选择一条数据',
											type: 'warning'
									})
									return
							}
							const rowt = {id: this.multipleSelection.map((r) => r.id)}
							this.$http({
									url: API_GATEWAY + '/api' + btn.url + '?format=xlsx&&ID=' + rowt.id,
									method: 'GET',
									headers: {
											'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
											'Accept': 'application/json',
											'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId
											// 'Content-Type': 'application/x-www-form-urlencoded;charset=utf8'
									},
									responseType: 'arraybuffer'
							}).then(function (response) {
									var blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
									// blob(size,type) Blob构造函数，接受两个参数。第一个参数是一个包含实际数据的数组，第二个参数是数据的类型
									var objectUrl = URL.createObjectURL(blob)
									var a = document.createElement('a')
									document.body.appendChild(a)
									a.setAttribute('style', 'display:none')
									a.setAttribute('href', objectUrl)
									a.setAttribute('download', '结算单')
									a.click()
									URL.revokeObjectURL(objectUrl)
							})
							return
					}
					// 需求单提交审批
					if (btn.action === 'submitGoodsStatus') {
							row = true ? {id: this.multipleSelection.map((r) => r.id)} : {}
							for (i = 0; i < this.multipleSelection.length; i++) {
									if (this.multipleSelection[i].state === '1') {
											vm.$message({
													message: '已提交审批',
													type: 'warning'
											})
											return
									}
									if (this.multipleSelection[i].state === '3') {
											vm.$message({
													message: '已审批',
													type: 'warning'
											})
											return
									}
							}
							this.$root.ajaxData(btn.url + '?ids=' + row.id + '&status=1', {}, function (data) {
									if (data.statusCode === 40035) {
											vm.$message({
													message: '请审批供应商',
													type: 'warning'
											})
											return
									}
									vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
											vm.mate.mateList.rows = data.mate.mateList.rows
									}, 'GET')
							}, 'PUT')
							return
					}
					// 需求单审批通过
					if (btn.action === 'auditGoodsIsPass') {
							for (i = 0; i < this.multipleSelection.length; i++) {
									if (this.multipleSelection[i].state === '3') {
											vm.$message({
													message: '已审批',
													type: 'warning'
											})
											return
									}
									if (this.multipleSelection[i].state !== '1') {
											vm.$message({
													message: '请提交审批',
													type: 'warning'
											})
											return
									}
							}
							row = true ? {id: this.multipleSelection.map((r) => r.id)} : {}
							this.$root.ajaxData(btn.url + '?ids=' + row.id + '&status=3', {}, function (data) {
									vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
											vm.mate.mateList.rows = data.mate.mateList.rows
									}, 'GET')
							}, 'PUT')
							return
					}
					// 需求单驳回
					if (btn.action === 'bohuiGoodsIsPass') {
							for (i = 0; i < this.multipleSelection.length; i++) {
									if (this.multipleSelection[i].state === '3') {
											vm.$message({
													message: '已审批',
													type: 'warning'
											})
											return
									}
									if (this.multipleSelection[i].state !== '1') {
											vm.$message({
													message: '不能驳回',
													type: 'warning'
											})
											return
									}
							}
							row = true ? {id: this.multipleSelection.map((r) => r.id)} : {}
							this.$root.ajaxData(btn.url + '?ids=' + row.id + '&status=2', {}, function (data) {
									vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
											vm.mate.mateList.rows = data.mate.mateList.rows
									}, 'GET')
							}, 'PUT')
							return
					}
					// 需求单取消
					if (btn.action === 'cancelGoodsOrder') {
							for (i = 0; i < this.multipleSelection.length; i++) {
									if (this.multipleSelection[i].state === '3') {
											vm.$message({
													message: '已审批',
													type: 'warning'
											})
											return
									}
									row = true ? {id: this.multipleSelection.map((r) => r.id)} : {}
									this.$root.ajaxData(btn.url + '?ids=' + row.id + '&status=5', {}, function (data) {
											if (data.statusCode === 40038) {
													vm.$message({
															message: '已生成采购订单不能取消',
															type: 'warning'
													})
													return
											}
											vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
													vm.mate.mateList.rows = data.mate.mateList.rows
											}, 'GET')
									}, 'PUT')
									return
							}
					}
					// 需求单转采购订单
					if (btn.action === 'toPurchaseOrder') {
							if (this.multipleSelection.length !== 1) {
									vm.$message({
											message: this.$t('seladata'),
											type: 'warning'
									})
									return
							}

							//只有已审批的需求单才能转成采购订单
							if (this.multipleSelection[0].state !== '3') {
									vm.$message({
											message: '需求单未审批,不能生成采购订单',
											type: 'warning'
									})
									return
							}
							this.$root.ajaxData(btn.url + this.multipleSelection[0].id, {}, function (data) {
									if (data.statusCode === 40036) {
											vm.$message({
													message: '需要在商品交叉信息管理中去维护物料交叉信息',
													type: 'warning'
											})
											return
									}
									if (data.statusCode === 40037) {
											vm.$message({
													message: '已生成采购订单',
													type: 'warning'
											})
											return
									}
									vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
											vm.mate.mateList.rows = data.mate.mateList.rows
									}, 'GET')
							}, 'POST')
							return
					}
					// 销售订单修改
					if (btn.action === 'updateSaleOrder') {
							if (this.multipleSelection.length !== 1) {
									vm.$message({
											message: this.$t('seladata'),
											type: 'warning'
									})
									return
							}
							if (this.multipleSelection[0].state === '0' || this.multipleSelection[0].state === '2' || this.multipleSelection[0].state === '3') {
                if(this.multipleSelection[0].state === '3' && this.multipleSelection[0].isInSystem === '1'){
                  vm.$message({
											message: '此采购订单已审批通过，如果要修改，请提交采购订单变更',
											type: 'warning'
									})
                  return
                }
                row = true ? {id: this.multipleSelection.map((r) => r.id)} : {}
                this.$root.handleAction(btn, row, function () {
                })
                return
              } else {
                vm.$message({
                    message: this.$t('cannotChange'),
                    type: 'warning'
                })
                return
							}
					}
					// 销售订单提交审批
					if (btn.action === 'auditTijiaoIsPass') {
							for (i = 0; i < this.multipleSelection.length; i++) {
									if (this.multipleSelection[i].state === '0') {
											this.btn = btn
											row = true ? {id: this.multipleSelection.map((r) => r.id)} : {}
											this.$root.ajaxData(btn.url + 1 + '?ids=' + row.id, {}, function (data) {
													vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
															vm.mate.mateList.rows = data.mate.mateList.rows
													}, 'GET')
											}, 'PUT')
									} else {
											vm.$message({
													type: 'warning',
													message: vm.$t('selectEntered')
											})
											return
									}
							}
							return
					}
					// 销售订单审批
					if (btn.action === 'auditSellIsPass') {
							for (i = 0; i < this.multipleSelection.length; i++) {
									if (this.multipleSelection[i].state === '1') {
											this.btn = btn
											row = true ? {id: this.multipleSelection.map((r) => r.id)} : {}
											this.$root.ajaxData(btn.url + 3 + '?ids=' + row.id, {}, function (data) {
													vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
															vm.mate.mateList.rows = data.mate.mateList.rows
													}, 'GET')
											}, 'PUT')
									} else {
											vm.$message({
													type: 'warning',
													message: vm.$t('selectApprove')
											})
											return
									}
							}
							return
					}
					// 销售订单驳回
					if (btn.action === 'buhuiSellIsPass') {
							for (i = 0; i < this.multipleSelection.length; i++) {
									if (this.multipleSelection[i].state === '2') {
											vm.$message({
													type: 'warning',
													message: vm.$t('rejected')
											})
											return
									}
									if (this.multipleSelection[i].state !== '1') {
											vm.$message({
													type: 'warning',
													message: '不能驳回'
											})
											return
									}
							}
							this.dialogDisagree = true
							this.btn = btn
							return
					}
					// 销售订单取消
					if (btn.action === 'canleSmPrice') {
							row = true ? {id: this.multipleSelection.map((r) => r.id)} : {}
							this.$confirm('此操作将改明细行取消, 是否继续?', '提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning'
							}).then(() => {
									this.$root.ajaxData('/purchase/so/headers/updateAudit/4?ids=' + row.id, {}, function (data) {
											if (data.statusCode === 40033) {
													vm.$message({
															type: 'warning',
															message: vm.$t('not been cancelled')
													})
													return
											} else {
													vm.$root.monitor({url: '/purchase/so/headers/all/list', method: 'GET'})
											}
									}, 'PUT')
							}).catch(() => {
									this.$message({
											type: 'info',
											message: '未取消'
									})
							})
							return
					}
					// 销售订单删除
					if (btn.action === 'deleteSmPrice') {
							for (i = 0; i < this.multipleSelection.length; i++) {
									if (this.multipleSelection[i].state !== '0' && this.multipleSelection[i].state !== '2') {
											this.$message({
													type: 'warning',
													message: '不能删除'
											})
											return
									} else {
											row = true ? {id: this.multipleSelection.map((r) => r.id)} : {}
											this.$confirm('此操作将订单删除, 是否继续?', '提示', {
													confirmButtonText: '确定',
													cancelButtonText: '取消',
													type: 'warning'
											}).then(() => {
													this.$root.ajaxData('/purchase/so/headers/batchDel?ids=' + row.id, {}, function (data) {
															vm.$root.monitor({url: '/purchase/so/headers/all/list', method: 'GET'})
													}, 'DELETE')
											}).catch(() => {
													this.$message({
															type: 'info',
															message: '取消删除'
													})
											})
									}
							}
							return
					}
					// 销售定价删除
					if (btn.action === 'deleteSmHeaderPrice') {
						for (i = 0; i < this.multipleSelection.length; i++) {
							if (this.multipleSelection[i].state !== '2') {
								this.$message({
									type: 'warning',
									message: '不能删除'
								})
								return
							} else {
								row = true ? {id: this.multipleSelection.map((r) => r.id)} : {}
								this.$confirm('此操作将订单删除, 是否继续?', '提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning'
								}).then(() => {
									this.$root.ajaxData('/purchase/smPrice/batchDelete?ids=' + row.id, {}, function (data) {
										vm.$root.monitor({url: '/purchase/smPrice/all/list', method: 'GET'})
									}, 'DELETE')
								}).catch(() => {
									this.$message({
										type: 'info',
										message: '未删除'
									})
								})
							}
						}
						return
					}
					if (btn.action === 'shuaxin') {
							this.$root.handleAction(btn, row, function (data) {
									vm.mate.mateList.rows = data.mate.mateList.rows
									vm.mate.mateList.total = data.mate.mateList.total
							})
							return
					}
					// 刷新送货通知
					if (btn.action === 'shuaxinAsn') {
							vm.$root.ajaxData(btn.url, {}, function (data) {
									vm.mate.mateList.rows = data.mate.mateList.rows
									vm.mate.mateList.total = data.mate.mateList.total
							}, 'GET')
							return
					}
					// 送货通知导出
					if (btn.action === 'exportAsn') {
							const rowt = {id: this.multipleSelection.map((r) => r.id)}
							let ids = rowt.id
							// 发运行
							this.$http({
									url: API_GATEWAY + '/api/purchase/asn/exportAsn',
									method: 'POST',
									headers: {
											'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
											'Accept': 'application/json',
											'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
											'Content-Type': 'application/json;charset=utf8'
									},
									responseType: 'arraybuffer',
									body: ids
							}).then(function (response) {
									var blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
									// blob(size,type) Blob构造函数，接受两个参数。第一个参数是一个包含实际数据的数组，第二个参数是数据的类型
									var objectUrl = URL.createObjectURL(blob)
									var a = document.createElement('a')
									document.body.appendChild(a)
									a.setAttribute('style', 'display:none')
									a.setAttribute('href', objectUrl)
									var filename = '送货通知信息.xlsx'
									a.setAttribute('download', filename)
									a.click()
									URL.revokeObjectURL(objectUrl)
							})
							return
					}
					if (btn.action === 'sendInvoice') {
							const rowt = {id: this.multipleSelection.map((r) => r.id)}
							for (i = 0; i < this.multipleSelection.length; i++) {
									if (this.multipleSelection[i].state === '1') {
											if (this.multipleSelection.length !== 0) {
													for (j = 0; j <= this.multipleSelection.length - 2; j++) {
															if (this.multipleSelection[j].customerCode !== this.multipleSelection[j + 1].customerCode) {
																	vm.$message({
																			message: this.$t('selectSupp'),
																			type: 'warning'
																	})
																	return
															}
															if (this.multipleSelection[j].currency !== this.multipleSelection[j + 1].currency) {
																	vm.$message({
																			message: this.$t('selectSupp'),
																			type: 'warning'
																	})
																	return
															}
													}
											}
											this.$root.monitor({
													url: '/purchase/settlement/genInvoicePayment?ids=' + rowt.id,
													method: 'GET'
											})
											return
									} else if (this.multipleSelection[i].state === '0') {
											vm.$message({
													message: this.$t('unConfirmed'),
													type: 'warning'
											})
											return
									} else {
											vm.$message({
													message: this.$t('exitInvoice'),
													type: 'warning'
											})
											return
									}
							}
					}
					// 来料检验 打印日报表
					if (btn.action === 'printerDailyReport'){
						row = true ? { id: this.multipleSelection.map((r) => r.id) } : {};
						vm.$http({
							url: `${API_GATEWAY}/api${btn.url}?format=xlsx&ids=${row.id}`,
							method: 'GET',
							headers: {
								'Authorization': `Bearer ${window.sessionStorage.getItem('token')}`,
								'Accept': 'application/json',
								'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
								'Content-Type': 'application/x-www-form-urlencoded;charset=utf8'
							},
							responseType: 'arraybuffer'
						}).then(function (response) {
							var blob = new Blob([response.data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"})
							var objectUrl = URL.createObjectURL(blob)
							var a = document.createElement('a')
							document.body.appendChild(a)
							var filename = '来料送检单日报表.xlsx'
							a.setAttribute('download', filename)
							a.setAttribute('style', 'display:none')
							a.setAttribute('href', objectUrl)
							a.click()
							URL.revokeObjectURL(objectUrl)
						})
						return
					}
					
					this.$root.handleAction(btn, row, function () {
						vm.getData();
					});
			},
			rowSelect() {
					this.mate.mateList.rows.forEach(row => {
							/* eslint-disable */
							let select = (row.id && this.mate.mateList.selected && this.mate.mateList.selected.findIndex(id => id == row.id) !== -1)
							/* eslint-enable */
							// this.$refs.table.toggleRowSelection(row, (select === true))
					})
					// this.mate.selected = [];
			},
			// table表格中勾选的选项，val是勾选的对象
			handleSelectionChange(val) {
					this.$emit('actionSelected', val)
					this.multipleSelection = val
			},
			handleSizeChange(val) {
					this.pageSize = val
					this.getData('paging')
			},
			handleCurrentChange(val) {
					this.page = val
					this.getData('paging')
			},
			handleAction(act, row) {
					var vm = this
					this.$root.handleAction(act, row, function () {
							vm.getData()
					})
			},
			getData(flag) {
					let url = this.mate.mateList.dataApi
					let param = {
							search: this.searchValues,
							page: this.page,
							sort: this.sortValues
					}
					var vm = this
					if (url === '/purchase/th/order/headers/all/list') {
							url += `-q?pageNum=${this.page}&pageSize=${this.pageSize}`;
					} else if (flag && url.indexOf('?') === -1) {
							// url += '-q?' + (this.toUriParams(this.searchValues)) + '&' + (this.toUriParams(this.sortValues)) + '&pageNum=' + this.page
							url += `-q?search=${encodeURIComponent(JSON.stringify(this.searchValues))}&${(this.toUriParams(this.sortValues))}&pageNum=${this.page}&pageSize=${this.pageSize}`;
							param = null
					} else if (flag && url.indexOf('?') !== -1) {
							url += `&search=${encodeURIComponent(JSON.stringify(this.searchValues))}&${(this.toUriParams(this.sortValues))}&pageNum=${this.page}&pageSize=${this.pageSize}`;
							param = null
					}
					this.$root.ajaxData(url, param, function (data) {
							vm.updateData(data)
					})
			},
			updateData(data) {
					if (data.mate.rows) {
							this.mate.mateList.rows = data.mate.rows
							// rowsContent用于判断波次批次管理中拣料出库动作是否可以进行
							this.rowsContent = data.mate.rows
					}
					// 获取到包括元数据的所有数据，因为数据量太大，上面只获取到明细行的元数据和数据
					// if (data.mate.mateList.rows) {
					//   this.mate.rows = data.mate.mateList.rows
					// }
					if (data.mate.total) {
							this.mate.mateList.total = data.mate.total
					} else {
							this.mate.mateList.total = 0
					}
					if (data.mate.selected) {
							this.mate.mateList.selected = data.mate.selected
					}
					this.$nextTick(function () {
							this.rowSelect()
					})
			},
			sortChange: function (sort) {
					if (!sort || !sort.column || !sort.column.sortable) {
							return
					}
					this.sortValues = {
							order: sort.order,
							column: sort.prop
					}
					this.getData('sort')
			},
			search(data) {
					this.$emit('actionSearch', data)
					this.searchValues = data
					this.page = 0
			},
			todoEssearch(data) {
					this.searchValues = data
					const vm = this
					this.$root.ajaxData(this.mate.mateList.essearch.url, JSON.stringify(data), function (data) {
							vm.updateData(data)
					}, 'POST')
			},
			formatter(field) {
					return function (row, col) {
							if (field.switch) {
									return field.switch[row[col.property]]
							}
							return row[col.property]
					}
			},
			getEtagStyle(v) {
					if (v) {
							return 'success'
					}
					return 'gray'
			},
			toUriParams(data) {
					return Object.keys(data).filter(i => !!data[i]).map(i => i + '=' + data[i]).join('&')
			},
			dialogCancel (){
					this.asnLabelVisible=false;
			},
			materielLabelCancel (){
					this.materielLabelVisible=false;
			},
			// 销售订单 查看BOM
      viewBom(row){
				let _this = this
        this.$root.ajaxData(`${BOM_API.BOM_VIEW}/${row.itemId}`, {}, function (data) {
					let status = data.statusCode
					if(status === 40026){
						_this.$message({
							message: '该物料没有BOM信息',
							type: 'warning'
						})
						return
					}else if(status === 200){
						let mate = data.data.mate
						_this.bomDetailVisible = true
						_this.bomDetailForm = mate.extObj
						_this.bomDetal.rows = mate.rows
					}
        }, 'GET')
      }
		}
	}
</script>

<style scoped lang="scss">
	.page {
			margin-top: 20px;
	}
  .bomDetail{
		margin-top: 20px;
	}
	.chain {
			display: inline-block;
			width: 15px;
			height: 15px;
			background: url('../assets/imgs/ztree/ic_chain.png') no-repeat;
			transform: translateY(3px);
	}

	.main-block .search {
			display: inline-block;
			margin-left: 30px;
			margin-top: -13px;
	}

	.el-form--inline .el-form-item {
			margin-bottom: 0
	}

	.el-tag {
			background-color: rgba(64, 158, 255, .1);
			padding: 0 10px;
			height: 32px;
			line-height: 30px;
			font-size: 12px;
			margin-left: -23px;
			color: #409EFF;
			border-radius: 4px;
			box-sizing: border-box;
			border: 1px solid rgba(64, 158, 255, .2)
	}

	.el-table .cell, .el-table th > div {
			padding-right: 0;
			/* padding-left:25px; */
	}

	.blank {
			float: left;
			margin-left: 10px;
			margin-bottom: 30px;
	}

	.leftMargin {
			float: left;
			margin-left: 10px;
	}

	.leftFloat form {
			// float: left;
			display: inline-block;
	}

	.leftFloat div {
			// float: left;
			display: inline-block;
			width: 250px;
			height: 38px;
			margin: 0px 15px 0 0;
	}

	.button {
			margin-top: 10px;
	}

	.el-form-item {
			margin: 15px 20px 2px 0px;
	}

	.checkboxClass {
			width: 30%;
			padding-bottom: 10px;
			box-sizing: border-box;
			margin-left: 15px;
	}

	.select-button {
			margin-top: 20px;
	}

	.detailLine {
			// margin-top: 10px;
			margin-bottom: 20px;
			position: relative;
	}

	.definedLine {
			position: absolute;
			right: 10px;

			button {
					padding: 7px 15px;
					background-color: #fff;
					cursor: pointer;
			}
	}

	.tableTop {
			// position: absolute;
			margin-top: 20px;
	}

	.el-table td, .el-table th {
			height: 25px;
	}

	.detailTable {
			margin-top: 20px;
	}

	.query {
			// margin: 1px 0;
		margin-bottom: 15px;
		.search {
			margin-left: 5px;
			button {
				padding: 7px 15px;
				background-color: #fff;
				cursor: pointer;
			}
		}
	}

	.el-dialog__header {
			padding: 10px 10px 0;
	}

	.el-dialog__body {
			padding: 10px 10px;
	}
</style>
