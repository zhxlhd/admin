<!-- 采购订单 -->
<template>
  <div>
    <Boxer :mate="mate.mateList" :mateSearch="mate.mateSearch" :hasSelected="hasSelected" @action="handleButton" ref="Boxer" :msgBoxButton="msgBoxButton">
      <div slot="searchForm" class="leftMargin">
				<el-button size="mini" type="primary" class="el-icon-search" v-if="mate.mateSearch" @click="showSearchPopover">搜索</el-button>
			</div>
			<div slot="main">
        <multiple-query :pageSize="querySize" :mate="mate" :inline="mate.inline" v-if="mate.mateSearch" v-show="showAdvancedSearchPopover" @queryData="queryData"></multiple-query>
        <el-row>
          <el-table size="mini" highlight-current-row @row-click="rowClick" ref="table" :data="mate.mateList.rows" border  @selection-change="handleSelectionChange" @sort-change="sortChange" max-height="300" style="width: 100%;">
              <el-table-column type="selection" width="50"></el-table-column>
              <template v-for="col of mate.mateList.columns">
                <el-table-column v-if="col.blockHash" :formatter="col.formatter" :key="col.name" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top" v-show="scope.row.blockHash !== null">
                        <p>上链时间: {{ scope.row.updateAt }}</p>
                        <p>区块哈希: {{ scope.row.blockHash }}</p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag ><img src="../../assets/imgs/ztree/ic_chain.png" style="width:13px; height:13px;margin:-2px 2px">{{ scope.row.goodsName }}</el-tag>
                        </div>
                        </el-popover>
                        <span v-show="scope.row.blockHash === null">{{ scope.row.goodsName }} </span>
                    </template>
                </el-table-column>   
              </template>
              <template v-for="col of mate.mateList.columns">
                <el-table-column v-if="col.isShow" :key="col.name" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip :formatter="col.formatter"></el-table-column>
              </template>
              <el-table-column label="操作" fixed="right" :width="actionWidth" v-if="mate.mateList.actions">
                <template slot-scope="scope">
                  <k-btn v-for="act of mate.mateList.actions" :key="act.action" size="mini" :act="act" :icon="act.icon" :row="scope.row" @action="confirm"></k-btn>
                </template>
              </el-table-column>
          </el-table>
        </el-row>
        <el-row type="flex" justify="center" class="page">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="mate.mateList.page"
              layout="total,prev, pager, next,sizes"
              :total="mate.mateList.total"
              :page-sizes ="[5, 10, 15, 20, 50]"
              :page-size="pageSize">
          </el-pagination>
        </el-row>
      </div>
    </Boxer>
    <!--下面的明细表格-->
    <template>
      <div class="priceDetailLine">
        <el-button v-if="showFlag" class="el-icon-delete" :disabled="showButton" @click="cancelLine">取消</el-button>
        <el-table size="mini" v-if="showFlag" :data="mate.mateList.lineRows" border style="width: 100%;"   class="tableTop" @selection-change="lineRowSelected">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column :min-width="lineColumns['lineNum'].width" v-if="lineColumns['lineNum'].isShow" :label="lineColumns['lineNum'].label" show-overflow-tooltip><template slot-scope="scope"><span>{{scope.row[lineColumns['lineNum'].name]}}</span></template></el-table-column>
          <el-table-column :min-width="lineColumns['subcode'].width" v-if="lineColumns['subcode'].isShow" :label="lineColumns['subcode'].label" show-overflow-tooltip><template slot-scope="scope"><span>{{scope.row[lineColumns['subcode'].name]}}</span></template></el-table-column>
          <el-table-column :min-width="lineColumns['materialName'].width" v-if="lineColumns['materialName'].isShow" :label="lineColumns['materialName'].label" show-overflow-tooltip><template slot-scope="scope"><span>{{scope.row[lineColumns['materialName'].name]}}</span></template></el-table-column>
          <el-table-column :min-width="lineColumns['category'].width" v-if="lineColumns['category'].isShow" :label="lineColumns['category'].label" show-overflow-tooltip><template slot-scope="scope"><span>{{scope.row[lineColumns['category'].name]}}</span></template></el-table-column>
          <el-table-column :min-width="lineColumns['qty'].width" v-if="lineColumns['qty'].isShow" :label="lineColumns['qty'].label" show-overflow-tooltip><template slot-scope="scope"><span>{{scope.row[lineColumns['qty'].name]}}</span></template></el-table-column>
          <el-table-column :min-width="lineColumns['unit'].width" v-if="lineColumns['unit'].isShow" :label="lineColumns['unit'].label" show-overflow-tooltip><template slot-scope="scope"><span>{{scope.row[lineColumns['unit'].name]}}</span></template></el-table-column>
          <el-table-column :min-width="lineColumns['priceTax'].width" v-if="lineColumns['priceTax'].isShow" :label="lineColumns['priceTax'].label" show-overflow-tooltip><template slot-scope="scope"><span>{{scope.row[lineColumns['priceTax'].name]}}</span></template></el-table-column>
          <el-table-column :min-width="lineColumns['price'].width" v-if="lineColumns['price'].isShow" :label="lineColumns['price'].label" show-overflow-tooltip><template slot-scope="scope"><span>{{scope.row[lineColumns['price'].name]}}</span></template></el-table-column>
          <el-table-column :min-width="lineColumns['money'].width" v-if="lineColumns['money'].isShow" :label="lineColumns['money'].label" show-overflow-tooltip><template slot-scope="scope"><span>{{scope.row[lineColumns['money'].name]}}</span></template></el-table-column>
          <el-table-column show-overflow-tooltip v-if="lineColumns['effective'].isShow" :label="lineColumns['effective'].label" :prop="lineColumns['effective'].name" :min-width="lineColumns['effective'].width" :formatter="lineColumns['effective'].formatter"></el-table-column>
          <el-table-column :min-width="lineColumns['pdRequisition'].width" v-if="lineColumns['pdRequisition'].isShow" :label="lineColumns['pdRequisition'].label" show-overflow-tooltip><template slot-scope="scope"><span>{{scope.row[lineColumns['pdRequisition'].name]}}</span></template></el-table-column>
          <el-table-column :min-width="lineColumns['orgName'].width" v-if="lineColumns['orgName'].isShow" :label="lineColumns['orgName'].label" show-overflow-tooltip><template slot-scope="scope"><span>{{scope.row[lineColumns['orgName'].name]}}</span></template></el-table-column>
          <el-table-column :min-width="lineColumns['needDate'].width" v-if="lineColumns['needDate'].isShow" :label="lineColumns['needDate'].label" show-overflow-tooltip><template slot-scope="scope"><span>{{scope.row[lineColumns['needDate'].name]}}</span></template></el-table-column>
          <el-table-column :min-width="240" v-if="lineColumns['promiseDate'].isShow" :label="lineColumns['promiseDate'].label" show-overflow-tooltip>
            <template slot-scope="scope">
              <!-- <span>{{scope.row[lineColumns['promiseDate'].name]}}</span> -->
              <el-date-picker size="mini" @focus="dateFocus(scope.row)" @change="dateChange(scope.row)" clearable v-model="scope.row[lineColumns['promiseDate'].name]" type="date" placeholder="选择日期"></el-date-picker>
            </template>
          </el-table-column>
          <el-table-column :min-width="lineColumns['supplierMaterialCode'].width" v-if="lineColumns['supplierMaterialCode'].isShow" :label="lineColumns['supplierMaterialCode'].label" show-overflow-tooltip><template slot-scope="scope"><span>{{scope.row[lineColumns['supplierMaterialCode'].name]}}</span></template></el-table-column>
          <el-table-column :min-width="lineColumns['supplierMaterialName'].width" v-if="lineColumns['supplierMaterialName'].isShow" :label="lineColumns['supplierMaterialName'].label" show-overflow-tooltip><template slot-scope="scope"><span>{{scope.row[lineColumns['supplierMaterialName'].name]}}</span></template></el-table-column>
          <el-table-column :min-width="lineColumns['contactCode'].width" v-if="lineColumns['contactCode'].isShow" :label="lineColumns['contactCode'].label" show-overflow-tooltip><template slot-scope="scope"><span>{{scope.row[lineColumns['contactCode'].name]}}</span></template></el-table-column>
          <el-table-column :min-width="lineColumns['receivedQty'].width" v-if="lineColumns['receivedQty'].isShow" :label="lineColumns['receivedQty'].label" show-overflow-tooltip><template slot-scope="scope"><span>{{scope.row[lineColumns['receivedQty'].name]}}</span></template></el-table-column>
          <el-table-column :min-width="lineColumns['returnQty'].width" v-if="lineColumns['returnQty'].isShow" :label="lineColumns['returnQty'].label" show-overflow-tooltip><template slot-scope="scope"><span>{{scope.row[lineColumns['returnQty'].name]}}</span></template></el-table-column>
          <el-table-column :min-width="lineColumns['canceledQty'].width" v-if="lineColumns['canceledQty'].isShow" :label="lineColumns['canceledQty'].label" show-overflow-tooltip><template slot-scope="scope"><span>{{scope.row[lineColumns['canceledQty'].name]}}</span></template></el-table-column>
          <el-table-column :min-width="lineColumns['invoiceQty'].width" v-if="lineColumns['invoiceQty'].isShow" :label="lineColumns['invoiceQty'].label" show-overflow-tooltip><template slot-scope="scope"><span>{{scope.row[lineColumns['invoiceQty'].name]}}</span></template></el-table-column>
          <el-table-column :min-width="lineColumns['changeInstructions'].width" v-if="lineColumns['changeInstructions'].isShow" :label="lineColumns['changeInstructions'].label" show-overflow-tooltip><template slot-scope="scope"><span>{{scope.row[lineColumns['changeInstructions'].name]}}</span></template></el-table-column>
          <el-table-column :min-width="lineColumns['remark'].width" v-if="lineColumns['remark'].isShow" :label="lineColumns['remark'].label" ><template slot-scope="scope" show-overflow-tooltip><span>{{scope.row[lineColumns['remark'].name]}}</span></template></el-table-column>
          <el-table-column label="操作" fixed="right" :width="actionWidth" >
              <template slot-scope="scope">
              <el-button size="mini"   @click="despatch(scope.row.id)">发运信息</el-button>
              </template>
            </el-table-column>
        </el-table>
      </div>
    </template>
    <el-dialog  :visible.sync="dialogFormVisible" width="30%">
      <el-form>
      <el-form-item label="驳回原因">
          <el-input   v-model="cause"></el-input>
      </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false; DialogClickOK()">确 定</el-button>
      </div>
    </el-dialog>
      <input type="file" ref="excelFile"  style="display:none" @change="fileUpload"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
      <el-dialog title="查看详情" :visible.sync="dialogVisible"   width="80%">
        <el-row>
          <el-row>
            <DialogForm :mate="mate.mateFormerHeader" formModel="dialog" ></DialogForm>
          </el-row>
          <el-row>
            <template>
              <el-table size="mini" :data="mate.mateList.lineRows" border style="width: 100%;" class="detailTable">
                <el-table-column show-overflow-tooltip :formatter="col.formatter" v-for="col of mate.mateList.lineColumns" :key="col.id" :label="col.label" :prop="col.name" :min-width="col.width">
                </el-table-column>
              </el-table>
            </template>
          </el-row>
        </el-row>
      </el-dialog>
      <el-dialog title="查看发运信息" :visible.sync="dialogDespatchVisible"   width="80%">
        <el-row>
          <template>
            <el-table size="mini" :data="despatchList" border style="width: 100%;">
              <el-table-column show-overflow-tooltip :formatter="col.formatter" v-for="col of mate.mateList.despatchList" :key="col.id" :label="col.label" :prop="col.name" :min-width="col.width">
              </el-table-column>
            </el-table>
          </template>
        </el-row>
      </el-dialog>
      <!--附件组件 -->
      <upload-dialog
        :uploadDialog="uploadDialog"
        :uploadParams="uploadAttachmentParams" 
        @closeDialog="closeDialog"
      />
  </div>
</template>

<script>
import MultipleQuery from '@/components/query/MultipleQueryForm'
import { LANGS } from '../../i18n/lang'
import KBtn from '../../components/KBtn.vue'
import Boxer from '../../components/Boxer.vue'
import Vue from 'vue'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
import { DateFormat } from '../../utils/util.js'
import SERVICES from '../../services'
import { API_GATEWAY } from '@/config/index.js'
import uploadDialog from "@/components/upload/uploadDialog";
export default {
  mixins: [ColumnFormatterMixin],
  components: {
    uploadDialog,
    MultipleQuery,
    KBtn,
    Boxer,
    DialogForm: function index (resolve) {
      require(['../../components/DialogForm.vue'], resolve)
    },
    Formor: function index (resolve) {
      require(['../../components/Formor.vue'], resolve)
    },
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
    }
  },
  props: {
    mate: Object,
    mateFormerHeaderId: String
  },
  data () {
    return {
      querySize: 5, // 多条件查询默认5条
      pageSize: 5,
      multipleSelection: [],     // 点击table前面的框框，获取到的内容
      langs: LANGS,
      hasSelected: false,
      dialogDespatchVisible: false,
      searchValues: {},
      showAdvancedSearchPopover: false,
      page: 0,
      despatchList: [],
      sortValues: {},
      showButton: true,
      formorHeaderId: '',
      action: null,
      dialogFormVisible: false,
      dialogTableVisible: false,          // dialog开关
      word: this.$t('query'),
      showFlag: false,                    // 下面表格的开关
      object: {},                          // 放columns
      cause: '',
      dialogVisible: false,
      auditStatus: '',
      lineColumns: {},
      lineSelected: [],               // 存放全部的label
      msgBoxButton: true,
      dialogDetailLine: false,
      promiseDateChange: false,        // 承诺日期是否可以修改状态
      oldPromiseDate: '',
      changePage: false, //
      allowSearch: false,
      uploadDialog: false,        // 上传附件弹窗与否
			uploadAttachmentParams: {   // 上传附件属性配置
				rowId:'',
				serviceModel:'PURCHASE_ORDER',
				getMethod:'getAttachMentList',
				uploadMethod:'attachMentUpload',
				deleteMethod:'deleteAttachMent',
				busType:'purchase_order'
      },
      requiredFields: ['currency', 'buyerName', 'tax'], // 提交审批要验证的必填字段
    }
  },
  watch: {
    multipleSelection: function (newSelection) {
      this.hasSelected = (newSelection.length !== 0)
    },
    mate: function (newMate) {
      this.formatterBefore(this.mate.mateList.columns)
      this.formatterBefore(this.mate.mateList.lineColumns)
      this.formatterBefore(this.mate.mateList.despatchList)
      this.$nextTick(function () {
        // this.rowSelect()
      })
    }
  },
  computed: {
    actionWidth: function () {
      return this.mate.mateList.actions.length * 60 + 60
    }
  },
  created () {
    this.formatterBefore(this.mate.mateList.columns)
    this.formatterBefore(this.mate.mateList.lineColumns)
    this.formatterBefore(this.mate.mateList.despatchList)
    this.mate.mateList.lineColumns.map((i) => { this.lineColumns[i.name] = i })
    this.mate.mateFormerHeader.fields.map((i) => { this.object[i.name] = i })
    this.mate.mateList.localName = this.mate.localName
  },
  mounted () {
    // this.rowSelect()
    // this.showFlag = false
  },
  // 需要添加刷新消息
  methods: {
    queryData (data) {
      this.searchValues = data;
    },
    dateFocus (row) {
      this.oldPromiseDate = row.promiseDate
    },
    // 修改承诺日期
    dateChange (row) {
      var vm = this
      if (this.promiseDateChange) {
        row.promiseDate = DateFormat(row.promiseDate, 'yyyy-MM-dd')
        this.$root.ajaxData(`/purchase/goodsPricing/line/${row.id}`, {promiseDate: row.promiseDate}, function () {
          vm.$message({
            message: '已更改承诺日期',
            type: 'warning'
          })
        }, 'PUT')
      } else {
        this.$message({
          message: '状态不是变更处理中，不能修改承诺日期!',
          type: 'warning'
        })
        for (let i = 0; i < this.mate.mateList.lineRows.length; i++) {
          if (this.mate.mateList.lineRows[i].id === row.id) {
            this.mate.mateList.lineRows[i].promiseDate = this.oldPromiseDate
          }
        }
      }
    },
    handleChange () {
    },
    dialogDetailLineFalse () {
      this.dialogDetailLine = false
    },
    dialogDetailLineTrue () {
      this.dialogDetailLine = true
    },
    showSearchPopover () {
      if (this.showAdvancedSearchPopover === true) {
        this.showAdvancedSearchPopover = false
      } else {
        this.showAdvancedSearchPopover = true
      }
    },
    despatch (pdGoodsPricingId) {
      var vm = this
      this.dialogDespatchVisible = true
      this.$root.ajaxData('/purchase/po/despatch/getPoDespatch/' + pdGoodsPricingId, {}, function (data) {
        if(null!=data&&data.length>0){
          for(var i=0;i<data.length;i++){
            if(null!=data[i].qty&&null!=data[i].price){
              data[i].moneyAmount=(data[i].qty*data[i].price).toFixed(2)
            }
          }
        }
        vm.despatchList = data
      })
    },
    lineRowSelected (val) {
      this.selectedLines = val
      if (val.length > 0) {
        this.showButton = false
      } else {
        this.showButton = true
      }
    },
    cancelLine () {
      var vm = this
      if (this.selectedLines.length !== 1) {
        vm.$message({
          message: this.$t('seladata'),
          type: 'warning'
        })
        return
      }
      if (this.selectedLines.effective === 1) {
        vm.$message({
          message: '已取消',
          type: 'warning'
        })
        return
      }
      this.$root.ajaxData('/purchase/purchaseOrder/cancelLine?id=' + vm.selectedLines[0].id, {}, function (data) {
        if (data.statusCode === 40033) {
          vm.$message({
            message: '不能取消',
            type: 'warning'
          })
          return
        } else {
          vm.$root.ajaxData(vm.mate.mateList.url + '/' + vm.formorHeaderId, {}, function (data) {
            Vue.set(vm.mate.mateList, 'lineRows', data)
            vm.mate.mateList.lineRows = data
          }, 'GET')
        }
      }, 'PUT')
    },
    DateFormat (date, fmt) {
      var o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'H+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
      }
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        return fmt
      }
    },
    updated () {
      this.showFlag = false
    },
    rowClick (row) {
      this.showFlag = true
      var vm = this
      this.formorHeaderId = row.id
      this.$root.ajaxData('/purchase/purchaseOrder/all/' + row.id, {}, function (data) {
        vm.mate.mateList.lineRows = data
        if (row.state === '5') {
          vm.promiseDateChange = true
        }
      }, 'GET')
    },
    back () {
      this.dialogTableVisible = false
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.showFlag = false
      this.getData('paging')
    },
    DialogClickOK () {
      var vm = this
      const rowt = { id: this.multipleSelection.map((r) => r.id) }
      this.$root.ajaxData(this.btn.url + 2 + '?ids=' + rowt.id + '&approvalComments=' + this.cause, {}, function (data) {
        vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
          vm.mate.mateList.rows = data.mate.mateList.rows
        }, 'GET')
      }, 'PUT')
      this.cause = ''
    },
    message (msg) {
      this.$message({
        message: msg,
        type: 'warning'
      })
    },
    /** 
     * ?state:状态
     * 0 新建
     * 1 已取消
     * 2 关闭
     * 3 交易确认
     * 4 供应商拒绝
     * 5 变更处理中
     * 6 已变更
     * 
     * ?auditStatus: 审核状态
     * 0 已输入
     * 1 待审批
     * 2 已驳回
     * 3 已审批
    */
    handleButton (btn) {
      var vm = this
      let row = (btn.isApi || btn.ajax) ? { id: this.multipleSelection.map((r) => r.id) } : {}
      // 让用户选择一行数据
      if (btn.action !== 'add' && btn.action !=='downTemplate' && btn.action !== 'uploadOrder') {
        if (this.multipleSelection.length !== 1) {
          vm.message(this.$t('seladata'))
          return
        }
      }
      // 采购订单修改
      if (btn.action === 'updateQuotation') {
        let multipleSelection = this.multipleSelection;
        // 采购订单只有头状态是新建并且已输入   或者头状态是变更处理中并且审批状态是已审批状态 才能修改
        // 增加 已驳回 新建 的订单允许修改 2020-03-25
        if ((multipleSelection[0].auditStatus === '0' && multipleSelection[0].state === '0') || (multipleSelection[0].auditStatus === '3' && multipleSelection[0].state === '5') || (multipleSelection[0].auditStatus === '2' && multipleSelection[0].state === '0')) {
          row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
          this.$root.handleAction(btn, row, function () {})
          return
        } else if ((this.multipleSelection[0].auditStatus === '3' && this.multipleSelection[0].state === '0')) {
          // 如果是新建并且已审批，则先判断是否启用供应链平台，
          if(this.multipleSelection[0].isInSystem === '1') {
            this.message('此采购订单已审批通过，如果要修改，请提交采购订单变更')
            return
          } else {
            row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
            this.$root.handleAction(btn, row, function () {})
            return
          }
        } else {
          this.message('不能修改')
          return
        }
        // // 如果是新建就可以审批，待审批、已审批、已驳回不能修改
        // if (this.multipleSelection[0].auditStatus > 0) {
        //   vm.message('不能修改')
        //   return
        // }
        // if (this.multipleSelection[0].state === '0' || this.this.multipleSelection[0].state === '5') {
        //   row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        //   this.$root.handleAction(btn, row, function () {})
        //   return
        // } else {
        //   this.message('不能修改')
        // }
      }
      // 删除
      if (btn.action === 'deleteQuotation') {
        // 如果是新建就可以审批，待审批、已审批、已驳回不能删除
        if (this.multipleSelection[0].auditStatus !== '0' && this.multipleSelection[0].auditStatus !== '2') {
          vm.message('不能删除')
          return
        } else {
          row = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
          this.$confirm('此操作将订单删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$root.ajaxData('/purchase/purchaseOrder/' + row.id, {}, function (data) {
              vm.$root.monitor({ url: '/purchase/purchaseOrder/all/list', method: 'GET' })
            }, 'DELETE')
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消删除'
            })
          })
          return
        }
      }
      // 采购订单提交审批
      if (btn.action === 'submitStatus') {
        // 验证必填信息是否为空 提示维护必填信息 2020-03-26
        let data = this.multipleSelection[0];
        if(this.requiredFields.some(item => (data[item] == '' || data[item] == null))){
          this.$message({
            message:'请维护必填信息',
            type: 'warning'
          })
          return
        };
        // 增加”已驳回“允许提交审批 2020-03-26
        if ((this.multipleSelection[0].auditStatus != 0 && this.multipleSelection[0].auditStatus != 2) || this.multipleSelection[0].state === '1') {
          vm.message('不能点击提交审批')
          return
        }
        this.btn = btn
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        this.$root.ajaxData(this.btn.url + 1 + '?ids=' + rowt.id, {}, function () {
          vm.$root.monitor({ url: '/purchase/purchaseOrder/all/list', method: 'GET' })
        }, 'PUT')
        return
      }
      // 采购订单的审批按钮
      if (btn.action === 'auditIsPass') {
        if (this.multipleSelection[0].auditStatus !== '1') {
          this.message('不是待审批状态，不能审批')
          return
        }
        // 有了上面的，这下面的判断都可以不用
        // if (this.multipleSelection[0].auditStatus === '2') {
        //   this.message(this.$t('approval'))
        //   return
        // }
        if (this.multipleSelection[0].status !== 'undefined') {
          this.auditStatus = this.multipleSelection[0].auditStatus             // 将需要改变的那一行的状态显示在弹出框上
        }
        this.btn = btn
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        this.$root.ajaxData(this.btn.url + 3 + '?ids=' + rowt.id, {}, function (data) {
          if (data.statusCode === 10009) {
            vm.message('生成客户PO时明细行为空,请检查采购订单明细行状态是否有效')
            return
          }
          vm.$root.monitor({ url: '/purchase/purchaseOrder/all/list', method: 'GET' })
        }, 'PUT')
        return
      }
      // 采购订单的复核按钮
      if (btn.action === 'reviewStatus') {
        if (this.multipleSelection[0].status != 3) {
          vm.$message({
              message: '不能复核',
              type: 'warning'
            })
            return
        }
        this.btn = btn
        const rowt = { id: this.multipleSelection.map((r) => r.id) }
        this.$root.ajaxData(this.btn.url + 6 + '?ids=' + rowt.id, {}, function (data) {
          vm.$root.monitor({ url: '/purchase/purchaseOrder/all/list', method: 'GET' })
        }, 'PUT')
        return
      }
      // 采购订单驳回
      if (btn.action === 'bohuiIsPass') {
        // 驳回只有审批状态是待审批，头状态是变更处理中和新建才能驳回
        if (this.multipleSelection[0].auditStatus === '1' && (this.multipleSelection[0].state === '0' || this.multipleSelection[0].state === '5')) {
          if (this.multipleSelection[0].status !== 'undefined') {
            this.auditStatus = this.multipleSelection[0].auditStatus             // 将需要改变的那一行的状态显示在弹出框上
          }
          this.dialogFormVisible = true
          this.btn = btn
          return
        } else {
          this.message('不能驳回')
          return
        }
        // if (this.multipleSelection[0].auditStatus === '1') {
        //   vm.$message({
        //     message: this.$t('approval'),
        //     type: 'warning'
        //   })
        //   return
        // }
      }
      // 采购订单取消
      if (btn.action === 'cancelOrder') {
        if (this.multipleSelection[0].state === '1') {
          this.message('请不要重复取消')
          return
        }
        const id = this.multipleSelection[0].id
        this.$root.ajaxData(`${btn.url}${id}`, {}, function (data) {
          if (data.statusCode === '40033') {
            vm.message('已生成销售定单,不能取消')
            return
          }
          vm.$root.monitor({ url: '/purchase/purchaseOrder/all/list', method: 'GET' })
        }, 'PUT')
        return
      }
    // 采购订单导入模板下载
    if (btn.action === 'downTemplate') {
        // var url = '/api/purchase/purchaseOrder/downTemplate';
        var url = '/api/purchase/purchaseOrder/downTemplate';
        var fileName = '采购订单导入模板.xlsx';
        // SERVICES.BASE.downTemplateExcel(url).then(response => {
        //     console.log(JSON.stringify(response));
        //     var blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
        //         // blob(size,type) Blob构造函数，接受两个参数。第一个参数是一个包含实际数据的数组，第二个参数是数据的类型
        //         var objectUrl = URL.createObjectURL(blob)
        //         var a = document.createElement('a')
        //         document.body.appendChild(a)
        //         a.setAttribute('style', 'display:none')
        //         a.setAttribute('href', objectUrl)
        //         a.setAttribute('download', fileName)
        //         a.click()
        //         URL.revokeObjectURL(objectUrl)
        // });
        this.$http({
            url: API_GATEWAY + url,
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
                'Accept': 'application/json',
                'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
                'Content-Type': 'application/json;charset=utf8'
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
            a.setAttribute('download', fileName)
            a.click()
            URL.revokeObjectURL(objectUrl)
        })
        return
    }
    if (btn.action === 'uploadOrder') {
        this.$refs.excelFile.click()
        this.title = '导入非直连开票数据'
        return
    }

      this.$root.handleAction(btn, row, function () {})
    },
    fileUpload (file){
      var vm = this
      var formdata = new FormData()
      formdata.append('file', file.target.files[0])
      this.$http({
          url: API_GATEWAY + '/api/purchase/purchaseOrder/upload/order',
          method: 'POST',
          body: formdata,
          responseType: 'application/json'
      }).then(function (response) {
          vm.$refs.excelFile.value = ''
          if(response.data!=null){
              if(response.data.data.failed!=0){
                  vm.message('成功' + response.data.data.success + '条,失败' + response.data.data.failed + '条', 'warning')
              }else{
                  vm.message('成功' + response.data.data.success + '条', 'success')
              }
              vm.$root.monitor({ url: '/purchase/purchaseOrder/all/list', method: 'GET' })
          }
      })
  },
    rowSelect () {
      this.mate.mateList.rows.forEach(row => {
        /* eslint-disable */
        let select = (row.id && this.mate.mateList.selected && this.mate.mateList.selected.findIndex(id => id == row.id) !== -1)
        /* eslint-enable */
        this.$refs.table.toggleRowSelection(row, (select === true))
      })
      // this.mate.selected = [];
    },
    // table表格中勾选的选项，val是勾选的对象
    handleSelectionChange (val) {
      this.$emit('actionSelected', val)
      this.multipleSelection = val
    },
    handleCurrentChange (val) {
      this.page = val
      this.showFlag = false
      this.getData('paging')
    },
    handleAction (act, row) {
      var vm = this
      this.$root.handleAction(act, row, function () {
        vm.getData()
      })
    },
    confirm (act, row) {
      var vm = this
      /**上传附件 */
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
      if (act.action === 'orderReport') {
        vm.$http({
            url: API_GATEWAY + '/api' + act.url + row.id,
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
              'Accept': 'application/json',
              'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf8'
            },
            responseType: 'arraybuffer'
          }).then(function (response) {
            var blob = new Blob([response.data], { type: 'application/pdf' })
            var objectUrl = URL.createObjectURL(blob)
            var a = document.createElement('a')
            document.body.appendChild(a)
            a.setAttribute('style', 'display:none')
            a.setAttribute('href', objectUrl)
            var windowOpen = window.open(objectUrl)
            if (windowOpen == null || typeof (windowOpen) === 'undefined') {
              this.$message({
                message: '采购订单被拦截,请检查浏览器设置',
                type: 'warning'
              })
            }
          })
        return false
      }
    },
    /**
			 * 关闭上传附件弹窗
			 * @param void
			 * @return void
			 */
    closeDialog (bool) {
      this.uploadDialog = false;
    },
    getData (flag) {
      let url = this.mate.mateList.dataApi
      let param = {
        search: this.searchValues,
        page: this.page,
        sort: this.sortValues
      }
      var vm = this
      if (flag && url.indexOf('?') === -1) {
       // url += '-q?' + (this.toUriParams(this.searchValues)) + '&' + (this.toUriParams(this.sortValues)) + '&pageNum=' + this.page
        url += '-q?' + 'search=' + encodeURIComponent(JSON.stringify(this.searchValues)) + '&' + (this.toUriParams(this.sortValues)) + '&pageNum=' + this.page + '&pageSize=' + this.pageSize
        param = null
      }
      this.$root.ajaxData(url, param, function (data) {
        vm.updateData(data)
      })
    },
    updateData (data) {
      if (data.mate.rows) {
        this.mate.mateList.rows = data.mate.rows
      }
      if (data.mate.total) {
        this.mate.mateList.total = data.mate.total
      } else {
        this.mate.mateList.total = 0
      }
      if (data.mate.selected) {
        this.mate.mateList.selected = data.mate.selected
      }
      // this.$nextTick(function () {
      //   this.rowSelect()
      // })
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
    search (data) {
      this.$emit('actionSearch', data)
      this.searchValues = data
      this.page = 0
      // this.getData('search')
    },
    todoEssearch (data) {
      // this.$emit('essearch', data)
      this.searchValues = data
      const vm = this
      this.$root.ajaxData(this.mate.mateList.essearch.url, JSON.stringify(data), function (data) {
        vm.updateData(data)
      }, 'POST')
    },
    formatter (field) {
      return function (row, col) {
        if (field.switch) {
          return field.switch[row[col.property]]
        }
        return row[col.property]
      }
    },
    getEtagStyle (v) {
      if (v) {
        return 'success'
      }
      return 'gray'
    },
    toUriParams (data) {
      // return Object.keys(data).filter(i => !!data[i]).map(i => i + '=' + data[i]).join('&')
    }
  }
}
</script>
<style scoped lang="scss">
  .page {
    margin-top: 20px;
  }

  .main-block .search {
      display: inline-block;
      margin-left: 30px;
      margin-top: -13px;
  }
  .el-form--inline .el-form-item {
    margin-bottom: 0
  }
  .el-table .cell, .el-table th>div {
    padding-right: 0;
  }
  .leftMargin{
    float:left;
    margin-left:10px;
  }
  .leftFloat form{
    float:left;
    display:inline-block;
  }
  .leftFloat div{
    float:left;
    display:inline-block;
    width:250px;
    height:38px;
    margin:0px 15px 0 0;
  }
  .button{
    margin-top:10px;
  }
  .el-form-item {
    margin: 15px 20px 2px 0px;
  }
  .checkboxClass{
    width: 30%;
    padding-bottom: 10px;
    box-sizing: border-box;
    margin-left: 15px;
  }
  .el-dialog{
    /*background: #eee;*/
  }
  .select-button{
    margin-top: 20px;
  }
  .detailLine{
    position: relative;
  }
  .definedLine{
    position: absolute;
    right: 0px;
  }
  .el-table td, .el-table th {
    height: 30px;
  }
  .detailTable{
    margin-top: 40px;
  }
  .priceDetailLine {
    position: relative;
    .tableTop{
      margin-top: 10px;
    }
    button {
      padding: 7px 15px;
      background-color: #fff;
      cursor: pointer;
    }
  }
  .priceLine1 {
    position: absolute;
    right: 0;
    top: -50px;
    z-index: 1;
  }
  .el-tag{
    background-color:rgba(64,158,255,.1);
    padding:0 10px;
    height:32px;
    line-height:30px;
    font-size:12px;
    margin-left:-23px;
    color:#409EFF;
    border-radius:4px;
    box-sizing:border-box;
    border:1px solid rgba(64,158,255,.2)
  }
  .el-dialog__header {
    padding: 10px 10px 0;
  }
  .el-dialog__body {
    padding: 10px 10px;
  }
  .el-select,
  .date-picker {
    width: 100%;
  }
</style>
