<template>
<div class="myInvoice">
  <div class="searchForm">
  <el-row>
    <el-form  size="mini" :model="searchForm">
        <el-col :sm="4" :md="4" :lg="3">
            <el-form-item>
             <el-input size="mini" clearable v-model="searchForm.invoiceNo" placeholder="发票号码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="4" :md="4" :lg="3">
        <el-form-item>
          <el-select clearable filterable size="mini" v-show="isBuyerInvoice==1"   @change="changeName" v-model="searchForm.buyer" placeholder="购方公司">
            <el-option
              v-for="item in customerNameOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>

          <el-select clearable filterable size="mini" v-show="isBuyerInvoice==0"   v-model="searchForm.seller" placeholder="销方公司">
            <el-option
              v-for="item in supplierOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :sm="4" :md="4" :lg="3">
        <el-form-item>
          <el-select  size="mini" v-show="isBuyerInvoice==1"  filterable clearable v-model="searchForm.buyerOu" placeholder="购方公司业务实体">
            <el-option v-for="item in ouNameOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>

          <el-select  size="mini" v-show="isBuyerInvoice==0"  filterable clearable v-model="searchForm.buyerOu" placeholder="购方公司业务实体">
            <el-option v-for="item in officeIdOption" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :sm="4" :md="4" :lg="3">
            <el-form-item>
             <el-date-picker size="mini" v-model="searchForm.startTime" type="date" placeholder="发票日期从"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="4" :md="4" :lg="3">
            <el-form-item>
             <el-date-picker @change="changeDate" size="mini" v-model="searchForm.endTime" type="date" placeholder="发票日期至"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="4" :md="4" :lg="3">
            <el-form-item>
                <dict-selected  v-model="searchForm.status" placeholder="查验状态" dictType="myInvoiceStatus" :initValue="searchForm.status"></dict-selected>
            </el-form-item>
        </el-col>
        <el-col :sm="8" :md="8" :lg="6">
        <el-form-item>
          <el-button size="mini" @click="findMyInvoice" type="primary" icon="el-icon-search">查询</el-button>
          <el-button size="mini" type="info" @click="reset">重置</el-button>
          <span class="searchText" @click="changeCondition">{{searchText}}<i :class="{changeDirection: searchCondition}"></i></span>
        </el-form-item>
      </el-col>
        <el-col :sm="4" :md="4" :lg="3" v-show="searchCondition">
            <el-form-item :prop="object['compareStatus'].name">
                <dict-selected placeholder="对比状态" v-model="searchForm.compareStatus" dictType="compareStatus" :initValue="searchForm.status"></dict-selected>
            </el-form-item>
        </el-col>
    </el-form>
  </el-row>
  </div>
  <Boxer :mate="mate.mateList" :mateSearch="mate.mateSearch" :hasSelected="hasSelected" @action="handleButton" ref="Boxer" :msgBoxButton="msgBoxButton">
    <div slot="main">
      <el-row>
        <el-col :span="24">
          <el-table size="mini" highlight-current-row ref="table" :data="mate.mateList.rows" stripe @selection-change="handleSelectionChange" @sort-change="sortChange" style="width: 100%;">
              <el-table-column fixed="left" type="selection" width="50" id="tableSel" align="center"></el-table-column>
               <el-table-column align="center" v-if="col.isBtn" :formatter="col.formatter" v-for="col of mate.mateList.columns" v-bind:key="col.name" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip>
                 <template slot-scope="scope">
                   <el-button type="text" size="mini" v-show="scope.row.blockHash" @click="clickBlockHash(scope.row, scope.row.blockHash)"><img src="../../assets/imgs/ztree/ic_chain.png" style="width:13px; height:13px;margin:-2px 2px">{{ scope.row.invoiceNo }}</el-button>
                   <span v-show="!scope.row.blockHash" >{{ scope.row.invoiceNo }} </span>
              </template>
              </el-table-column>
              <el-table-column align="center" show-overflow-tooltip v-if="col.isShow" :formatter="col.formatter" v-for="col of mate.mateList.columns" v-bind:key="col.name" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" >
              </el-table-column>
              <el-table-column align="center" show-overflow-tooltip v-if="object['status'].name === 'status'" :label="object['status'].label" :prop="object['status'].name" :min-width="object['status'].width">
                <template slot-scope="scope">
                  <span v-if="scope.row.status=='0'" class="tableWraning">未验真</span>
                  <span v-if="scope.row.status=='1'" class="tableSuccess">已验真</span>
                </template>
              </el-table-column>
              <!--<el-table-column align="center" show-overflow-tooltip v-if="object['compareStatus'].name === 'compareStatus'"  v-bind:key="object['compareStatus'].name" :label="object['compareStatus'].label" :min-width="object['compareStatus'].width">-->
                <!--<template slot-scope="scope">-->
                  <!--<span v-if="scope.row.compareStatus=='0'" class="tableWraning">比对异常</span>-->
                  <!--<span v-if="scope.row.compareStatus=='1'" class="tableSuccess">比对成功</span>-->
                <!--</template>-->
              <!--</el-table-column>-->
              <el-table-column align="center" show-overflow-tooltip label="操作" fixed="right" min-width="50px" v-if="mate.mateList.actions">
                 <template slot-scope="scope">
                <el-popover class="elPopover"
                    size="mini" min-width="90px" v-bind:key="act.action" v-for="act of mate.mateList.actions" placement="top-start" :title="act.label" width="20" trigger="hover">
                   <k-btn v-if="act.isShow===false" slot="reference"  size="mini" :act="act"  :row="scope.row" @action="handleAction"></k-btn>
                   <k-btn v-if="scope.row.transportId &&act.isShow" slot="reference"  size="mini" :act="act"  :row="scope.row" @action="handleAction"></k-btn>
                </el-popover>
                </template>
              </el-table-column>
          </el-table>
        </el-col>
      </el-row>
       <el-row type="flex" justify="center" class="page" >
      <el-col :span="12">
        <el-pagination
            @size-change="handleListSizeChange"
            @current-change="handleListCurrentChange"
            :current-page.sync="mate.mateList.page"
            layout="total,prev, pager, next, sizes"
            :total="mate.mateList.total"
            :page-sizes ="[5, 10, 15, 20, 50]"
            :page-size="pageSizeList">
        </el-pagination>
      </el-col>
      </el-row>
    </div>
  </Boxer>
    <input type="file" ref="invoiceFile"  style="display:none" @change="invoiceUpload"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
    <el-dialog title="提示"  :visible.sync="dialogVisibleMessage" style="font-size:20px" center width="30%" :close-on-click-modal="showVisible">
      <span style="font-size:15px;color:black">确认将发票：</span>{{invoiceNo}}<span style="font-size:15px;color:black"> 红冲</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitInfor">确 定</el-button>
        <el-button size="mini"  @click="cancelInfor">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogVisibleCancelMessage" style="font-size:20px" center width="30%" :close-on-click-modal="showVisible">
      <span style="font-size:15px;color:black">确认将发票：</span>{{invoiceNo}}<span style="font-size:15px;color:black"> 作废</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitCancel">确 定</el-button>
        <el-button size="mini" @click="cancelCancel">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="物流信息编辑" :visible.sync="dialogSendMessage" width="50%">
      <el-row>
      <el-form size="mini" ref="sendForm" :model="sendForm" label-width="100px" :rules="rules">
         <el-col :sm="6" :md="4" :lg="12">
        <el-form-item label="快递公司" prop="transportCompany">
          <el-input v-model="sendForm.transportCompany"></el-input>
        </el-form-item>
        </el-col>
          <el-col :sm="6" :md="4" :lg="12">
        <el-form-item label="快递单号" prop="transportNum">
          <el-input v-model="sendForm.transportNum"></el-input>
        </el-form-item>
        </el-col>
          <el-col :sm="6" :md="4" :lg="24">
        <el-form-item label="寄送备注" prop="transportRemark">
          <el-input v-model="sendForm.transportRemark"></el-input>
        </el-form-item>
        </el-col>
         <el-col :span="15">
            <el-form-item>
              <el-button size="mini" type="primary" @click="confrimSendVisible">确定</el-button>
              <el-button size="mini" @click="cancelSendVisible">取消</el-button>
            </el-form-item>
            </el-col>
      </el-form>
      </el-row>
    </el-dialog>
    <el-dialog title="物流信息" :visible.sync="detialSendMessage" width="50%">
      <el-row>
      <el-form size="mini" ref="detialSend" :model="detialSend" label-width="100px" >
         <el-col :sm="6" :md="4" :lg="12">
        <el-form-item label="快递公司" prop="transportCompany">
          <el-input readonly v-model="detialSend.transportCompany"></el-input>
        </el-form-item>
        </el-col>
          <el-col :sm="6" :md="4" :lg="12">
        <el-form-item label="快递单号" prop="transportNum">
          <el-input readonly v-model="detialSend.transportNum"></el-input>
        </el-form-item>
        </el-col>
          <el-col :sm="6" :md="4" :lg="24">
        <el-form-item label="寄送备注" prop="transportRemark">
          <el-input readonly v-model="detialSend.transportRemark"></el-input>
        </el-form-item>
        </el-col>
         <el-col :span="15">
            <el-form-item>
              <el-button size="mini" type="primary" @click="confrimDetialVisible">确定</el-button>
            </el-form-item>
            </el-col>
      </el-form>
      </el-row>
    </el-dialog>
    <el-dialog :visible.sync="detialVideo" width="50%" :rowId="rowId">
      <div>
        <el-button class="upload" @click="uploadFile" size="mini">上传</el-button>
        <span style="font-size:12px">（只能上传mp4/mpeg/ogg/mpg视频、jpeg/jpg/png/gif图片）</span>
        <input type="file" ref="excelFile"  style="display:none" @change="fileUpload"  accept="image/jpg, image/jpeg,image/gif,image/png,video/mp4,video/mpeg,video/ogg,video/mpg">
      </div >
        <el-table max-height="300" size="mini" :data="detailFile" border style="width: 100%" class="fileBottom">
          <el-table-column show-overflow-tooltip :label="objectFileColumns['fileName'].label" :prop="objectFileColumns['fileName'].name"></el-table-column>
          <el-table-column show-overflow-tooltip :label="objectFileColumns['uploadBy'].label" :prop="objectFileColumns['uploadBy'].name"></el-table-column>
          <el-table-column show-overflow-tooltip :label="objectFileColumns['createAt'].label" :prop="objectFileColumns['createAt'].name" ></el-table-column>
           <el-table-column show-overflow-tooltip align="center" label="操作">
              <template slot-scope="scope" min-width="100">
                <el-button  icon="el-icon-delete" @click="deleteFile(scope.row.picPath, scope.row.id)"  size="mini"></el-button>
                <el-button icon="el-icon-search" @click="showDetail(scope.row.picPath)"  size="mini"></el-button>
             </template>
           </el-table-column>
        </el-table>
         <el-row type="flex" justify="center" class="page" >
      <el-col :span="12">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="page"
            layout="total,prev, pager, next, sizes"
            :total="total"
            :page-sizes ="[5, 10, 15, 20, 50]"
            :page-size="pageSize">
        </el-pagination>
      </el-col>
      </el-row>
    </el-dialog>
    <el-dialog :visible.sync="detialPlayVideo" @close="closePlay">
      <player :video-url="videoUrl" :state="state"></player>
    </el-dialog>
    <el-dialog :visible.sync="dialogImageVisible" width="30%">
          <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
      <el-dialog :visible.sync="visibleInvoiceDetial" width="65%">
      <InvoiceView :myInvoice="myInvoice" :rowStatus="rowStatus" :invoiceDetial="invoiceDetial" ref="InvoiceView"></InvoiceView>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible"  width="30%" center @open="invoiceDialogOpen" close-on-click-modal="false">
        <el-radio-group v-model="invoiceInputType"  @change="changeType">
            <el-radio-button label="1">扫描录入</el-radio-button>
            <el-radio-button label="2">扫描仪录入</el-radio-button>
        </el-radio-group>
        <el-form ref="form" :model="mate.mateHead.values" label-width="100px"  :rules="rules">
            <el-row>
               <el-col >
                    <el-form-item :label="object['invoiceNo'].label" :prop="object['invoiceNo'].name" :rules="ruleInvoiceNo">
                        <el-input  v-model="mate.mateHead.values[object['invoiceNo'].name]" placeholder="请输入8位的发票号" @keyup.enter.native="formatData" ref="autoFocus"></el-input>
                    </el-form-item>
                </el-col>
               <el-col >
                   <el-form-item :label="object['invoiceCode'].label" :prop="object['invoiceCode'].name" :rules="ruleInvoiceCode">
                       <el-input v-model="mate.mateHead.values[object['invoiceCode'].name]" placeholder="请输入10位或12位的发票代码" @keyup.enter.native="formatData"></el-input>
                   </el-form-item>
                   <el-form-item :label="object['makeInvoiceTime'].label" :prop="object['makeInvoiceTime'].name">
                       <el-date-picker  type="date" v-model="mate.mateHead.values[object['makeInvoiceTime'].name]"></el-date-picker>
                   </el-form-item>
               </el-col>
               <el-col >
                    <el-form-item :label="object['totalPrice'].label" :prop="object['totalPrice'].name">
                        <el-input v-model="mate.mateHead.values[object['totalPrice'].name]" @keyup.enter.native="formatData"></el-input>
                    </el-form-item>
                </el-col>
               <el-col >
                   <el-form-item>
                       <el-button  type="primary" @click="confrimDialogVisible">确定</el-button>
                       <el-button @click="cancelDialogVisible">取消</el-button>
                   </el-form-item>
               </el-col>
           </el-row>
        </el-form>
    </el-dialog>
    <el-dialog title="查看区块信息" :visible.sync="blockHashVisible" width="50%">
      <BlockHash :hashForm="hashForm" :setId="setId" :hashTitle="hashTitle">
      </BlockHash>
    </el-dialog>
</div>
</template>

<script>
import { API_GATEWAY } from '@/config/index.js'
import KBtn from '../../components/KBtn.vue'
import Player from '../../components/Player.vue'
import Boxer from '../../components/Boxer.vue'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
import { DateFormat } from '../../utils/util.js'
import BlockHash from '../../components/BlockHash.vue'
// 将小数保留2位
function toDecimal (x) {
  var f = parseFloat(x)
  if (isNaN(f)) {
    return
  }
  f = Math.round(x * 100) / 100
  return f
}
export default {
  mixins: [ColumnFormatterMixin],
  components: {
    KBtn,
    Boxer,
    Player,
    BlockHash,
    InvoiceView: function index (resolve) {
      require(['../../components/InvoiceView.vue'], resolve)
    },
    Formor: function index (resolve) {
      require(['../../components/Formor.vue'], resolve)
    },
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
    }
  },
  props: {
    mate: Object
  },
  data () {
    var validateInvoiceNo = (rule, value, callback) => {
      if (value.length !== 8) {
        callback(new Error('请输入8位的发票代码'))
      }
      this.$root.ajaxData('/purchase/tms/invoice/checkInvoice?itemType='+this.mate.mateFormerHeader.values.itemType+'&invoiceNo=' + this.mate.mateHead.values.invoiceNo, {}, function (data) {
        if (data.statusCode === 40042) {
          callback(new Error('发票号已存在'))
        } else {
          callback()
        }
      })
    }
    var validateInvoiceCodeLength = (rule, value, callback) => {
      if (value.length !== 10 && value.length !== 12) {
        callback(new Error('请输入10或12位的发票代码'))
      } else {
        callback()
      }
    }
    return {
      isBuyerInvoice: 0, //区分是否是进项发票(0)或者是销项发票(1)
      searchText: '展开',
      customerNameOptions: [],
      ouNameOptions: [],
      hashTitle: '',
      setId: '',
      blockHashVisible: false,
      dialogVisible: false,
      form: {},
      object: {},
      labelPosition: 'right',
      searchForm: {
        invoiceNo: '',
        buyer: '',
        buyerOu: '',
        startTime: '',
        endTime: '',
        status: '',
        compareStatus: ''
      },
      invoiceDetial: {},
      myInvoice: true,
      visibleInvoiceDetial: false,
      rowId: '',
      rowStatus: {},
      officeIdOption: [],
      detailFile: [],
      videoUrl: '',
      sendForm: {},
      objectFileColumns: {},
      detialPlayVideo: false,
      detialSend: {},
      detialVideo: false,
      detialSendMessage: false,
      dialogSendMessage: false,
      showAdvancedSearchPopover: false,
      dialogVisibleMessage: false,
      dialogVisibleCancelMessage: false,
      invoiceNo: '',
      pageSize: 5,
      pageSizeList: 5,
      pageList: 0,
      dialogImageVisible: false,
      page: 0,
      billType: '',
      dialogDetailLine: false,
      hasSelected: false,
      showVisible: false,
      supplierOptions: [],
      msgBoxButton: true,
      multipleSelection: [],
      ruleInvoiceNo: [
        { required: true, message: '该输入项为必输项', trigger: 'blur' },
        { validator: validateInvoiceNo, trigger: 'blur' }
      ],
      ruleInvoiceCode: [
        { required: true, message: '该输入项为必输项', trigger: 'blur' },
        { validator: validateInvoiceCodeLength, trigger: 'blur' }
      ],
      rules: {
        itemType:
         { required: true, message: '该输入项为必输项', trigger: 'blur' },
        busiEntity:
         { required: true, message: '该输入项为必输项', trigger: 'blur' },
        type:
         { required: true, message: '该输入项为必输项', trigger: 'blur' },
        transportNum: { required: true, message: '该输入项为必输项', trigger: 'blur' },
        transportCompany: { required: true, message: '该输入项为必输项', trigger: 'blur' },
        makeInvoiceTime:
         { required: true, message: '该输入项为必输项', trigger: 'blur' },
        totalPrice:
         { required: true, message: '该输入项为必输项', trigger: 'blur' }
      },
      headers: {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
        'Accept': 'application/json',
        'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
        'Content-Type': 'application/json;charset=utf8'
      },
      invoiceInputType: '1'
    }
  },
  watch: {
    multipleSelection: function (newSelection) {
      this.hasSelected = (newSelection.length !== 0)
      var total = 0
      for (var i = 0; i < newSelection.length; i++) {
        total += newSelection[i].totalPriceTax
      }
      this.$set(this.searchForm, 'price', total)
      this.searchForm.price = toDecimal(total)
    },
    mate: function (newMate) {
      this.searchValues = {}
      if (this.mate.mateList.columns !== 'undefined' && this.mate.mateList !== 'undefined') {
        this.formatterBefore(this.mate.mateList.columns)
      }
      this.billType = this.mate.mateFormerHeader.values.itemType
      this.$nextTick(function () {
        this.rowSelect()
      })
    }
  },
  created () {
    var vm = this
    if (this.mate.localName === 'tms_invoice_headrev_list') {
      this.isBuyerInvoice = 1
      this.hashTitle = '销项发票'
       this._getCustomerName()
    } else {
      this.hashTitle = '进项发票'
       this.getSupplier()
       this.$root.ajaxData('/users/office', {}, function (data) {
        data.forEach((i) => {
          vm.officeIdOption.push({ 'label': i.name, 'value': i.name })
        })
      })  // this.actionWidth = this.mate.actions.length * 60 + 30
    }
    
    let mateList = this.mate.mateList
    this.mate.mateFormerHeader.fields.map((i) => { this.object[i.name] = i })
    this.mate.fileList.columns.map((i) => { this.objectFileColumns[i.name] = i })
    this.formatterBefore(mateList.lineColumns)
    this.formatterBefore(mateList.columns)
    mateList.localName = this.mate.localName
    this.rowsContent = mateList.rows
    this.billType = this.mate.mateFormerHeader.values.itemType
    mateList.localName = this.mate.localName
   
  },
  computed: {
    actionWidth: function () {
      return this.mate.mateList.actions.length * 60 + 30
    }
  },
  mounted () {
    this.rowSelect()
  },
  // 需要添加刷新消息
  methods: {
    reset() {
      this.searchForm.invoiceNo = ''
      this.searchForm.buyer = ''
      this.searchForm.buyerOu = ''
      this.searchForm.startTime = ''
      this.searchForm.endTime = ''
      this.searchForm.status = ''
      this.searchForm.compareStatus = ''
    },
    changeCondition() {
        this.searchCondition = !this.searchCondition
        this.searchText = this.searchCondition ? '收起' : '展开'
      },
    // 获取购方公司
      _getCustomerName () {
        var vm = this
        this.$root.ajaxData('/companys/companyInfo/4?status=1&auditStatus=1&nopaging=1&dataOnly=true&&onlyCompanyFlag=1', {}, function (data) {
          for (var i = 0; i < data.length; i++) {
            data[i].value = data[i].name
          }
          vm.customerNameOptions = data
        })
      },

      // 购方公司换掉之后
      changeName(val) {
        this.searchForm.buyerOu = ''
        var vm = this
        let option = {}
        this.ouNameOptions = []
        this.$root.ajaxData(`/offices//pass/company/name?companyName=${val}`, {}, function (data) {
          for (var i = 0; i < data.length; i++) {
            option = {}
            option.value = data[i].name
            vm.ouNameOptions.push(option)
          }
        })
      },
      invoiceDialogOpen(){
          this.$nextTick(function () {
              this.$refs.autoFocus.$el.querySelector('input').focus();
          });
      },
      // 发票录入选项卡
      changeType (val) {
         //扫描枪录入待做。
      },
    clickBlockHash (row, blockHash) {
      let vm = this
      this.setId = row.id
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
    // 预览发票
    editInvoice (val) {
      var vm = this
      this.rowStatus = val
      this.$root.ajaxData('/purchase/tms/invoice/showInvoice/' + val.id, {}, function (data) {
        vm.visibleInvoiceDetial = true
        vm.invoiceDetial = data
      })
      return
    },
    // 查询
    findMyInvoice () {
      var vm = this
      this.searchForm.startTime = DateFormat(this.searchForm.startTime, 'yyyy-MM-dd HH:mm:ss')
      this.searchForm.endTime = DateFormat(this.searchForm.endTime, 'yyyy-MM-dd HH:mm:ss')
      if (this.mate.mateFormerHeader.values.itemType === 0) {
        this.itemType('/purchase/tms/invoice/all/list?itemType=0')
      } else {
        this.itemType('/purchase/tms/invoice/all/list?itemType=1')
      }
    },
    itemType (url) {
      var vm = this
      this.$root.ajaxData(url, this.searchForm, function (data) {
        vm.mate.mateList.rows = data.mate.mateList.rows
        vm.mate.mateList.total = data.mate.mateList.total
      }, 'GET')
    },
    closePlay () {
      this.state = true
      this.videoUrl = ''
    },
    // 文件上传
    uploadFile () {
      this.$refs.excelFile.click()
    },
    // 文件上传
    fileUpload (file) {
      var vm = this
      var formdata = new FormData()
      formdata.append('file', file.target.files[0])
      this.$http({
        url: API_GATEWAY + '/zuul/api/purchase/tms/invoice/upload?sourceId=' + this.rowId,
        method: 'POST',
        body: formdata,
        responseType: 'arraybuffer'
      }).then(function (response) {
        if (response.statusCode === 40041) {
          this.messageModel ('上传错误', 'warning')
        }
        vm.$refs.excelFile.value = ''
        setTimeout(function () {
          vm.$root.ajaxData('/purchase/files/all/list?sourceId=' + vm.rowId, {}, function (data) {
            vm.detailFile = data.data
            vm.total = data.total
          })
        }, 1000)
      })
    },
    // 删除文件
    deleteFile (picPath, id) {
      var vm = this
      vm.$root.ajaxData('/purchase/files/del?url=' + picPath, {}, function (data) {
        vm.$root.ajaxData('/purchase/files/all/list?sourceId=' + vm.rowId, {}, function (data) {
          vm.detailFile = data.data
          vm.total = data.total
        })
      }, 'DELETE')
    },
    // 查看文件
    showDetail (id) {
      var fileType = id.substr(id.lastIndexOf('.')).toLowerCase()
      if (fileType === '.jpg' || fileType === '.jpeg' || fileType === '.png' || fileType === '.gif') {
        this.dialogImageVisible = true
        this.dialogImageUrl = id
      } else {
        this.detialPlayVideo = true
        this.videoUrl = id
        this.state = false
      }
    },
    changeDate (val) {
      if (val < this.searchForm.startTime) {
        this.messageModel ('请选择比创建日期大的日期', 'warning')
        this.searchForm.endTime = ''
      }
    },
    getSupplier () {
      var vm = this
      this.$root.ajaxData('/companys/companyInfo/3?auditStatus=1&nopaging=1&status=1&dataOnly=true&&onlyCompanyFlag=1', {}, function (data) {
        vm.supplierData = data
        for (let i = 0; i < data.length; i++) {
          vm.supplierOptions.push({ label: data[i].name, value: data[i].name, key: data[i].id })
        }
      }, 'GET')
    },
    query () {
      const mate = [this.mate.mateSearch.values]
      this.searchValues = mate
      const vm = this
      const url = this.mate.mateSearch.url
      this.$root.ajaxData(url, mate, function (data) {
        vm.mate.mateList.rows = data.mate.rows
        vm.mate.mateList.total = data.mate.total
      }, 'POST')
    },
      //处理扫描发票获取的数据
      formatData(){
          var origin_data = this.mate.mateHead.values;
          var data = '';
          for(var item in origin_data){
              if(origin_data[item]!=null&&origin_data[item]!=''){
                  data = origin_data[item].split(',');
                  break;
              }
          }
          for(var i = 0;i<data.length;i++){
              if(i===2){
                  this.mate.mateHead.values["invoiceCode"]=data[i]
              }
              if(i===3){
                  this.mate.mateHead.values["invoiceNo"]=data[i]
              }
              if(i===4){
                  this.mate.mateHead.values["totalPrice"]=data[i]
              }
              if(i===5){
                  this.mate.mateHead.values["makeInvoiceTime"]=data[i].substring(0,4)+"-"+data[i].substring(4,6)+"-"+data[i].substring(6,data.length)
              }
          }
          this.confrimDialogVisible()

      },
    // 新增保存
    confrimDialogVisible () {
      var mate = {}
      var vm = this
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.mate.mateHead.values.makeInvoiceTime = DateFormat(this.mate.mateHead.values.makeInvoiceTime, 'yyyy-MM-dd')
            this.mate.mateHead.values.itemType = this.mate.mateFormerHeader.values.itemType
            mate = this.mate.mateHead.values
          this.$root.ajaxData('/purchase/tms/invoice/add', mate, function (data) {
            if (data.statusCode === 200) {
              vm.messageModel ('录入成功！', 'success')
                vm.mate.mateHead.values = {}
                // if(vm.mate.mateFormerHeader.values.itemType === '1'){
                //     vm.$root.monitor({ url: '/purchase/tms/invoice/all/list?itemType=1&nopage=true' })
                // }else{
                //     vm.$root.monitor({ url: '/purchase/tms/invoice/all/list?itemType=0&nopage=true' })
                // }
            } else if (data.statusCode === 40042) {
              this.messageModel('发票号已存在', 'warning')
              // return
            }
          }, 'POST')
        } else {
          this.messageModel('数据未填写', 'warning')
          return
        }
      })
    },
    // 寄送确认
    confrimSendVisible () {
      var vm = this
      const rowt = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
      this.$refs['sendForm'].validate((valid) => {
        if (valid) {
          this.$root.ajaxData('/purchase/tms/invoice/sendTransportInfo?ids=' + rowt.id, this.sendForm, function (data) {
            vm.$root.monitor({ url: '/purchase/tms/invoice/all/list?itemType=1&nopage=true' })
          }, 'POST')
          this.dialogSendMessage = false
        } else {
          this.messageModel('数据未填写', 'warning')
          return
        }
      })
    },
    // 寄送取消
    cancelSendVisible () {
      this.dialogSendMessage = false
    },
    // 查看物流信息确定
    confrimDetialVisible () {
      this.detialSendMessage = false
    },
    // 新增取消
    cancelDialogVisible () {
      this.dialogVisible = false
      this.mate.mateHead.values = {}
        if(this.mate.mateFormerHeader.values.itemType === '1'){
            this.$root.monitor({ url: '/purchase/tms/invoice/all/list?itemType=1&nopage=true' })
        }else{
            this.$root.monitor({ url: '/purchase/tms/invoice/all/list?itemType=0&nopage=true' })
        }
    },
    // 红字确认
    submitInfor () {
      var vm = this
      this.dialogVisibleMessage = false
      this.$root.ajaxData('/purchase/tms/invoice/updateStatus?ids=' + this.multipleSelection[0].id + '&status=3', {}, function (data) {
        vm.$root.monitor({ url: '/purchase/tms/invoice/all/list?itemType=1&nopage=true' })
      }, 'PUT')
    },
    // 红字提示取消操作
    cancelInfor () {
      this.dialogVisibleMessage = false
    },
    // 作废发票信息提示确定
    submitCancel () {
      var vm = this
      this.dialogVisibleCancelMessage = false
      this.$root.ajaxData('/purchase/tms/invoice/updateStatus?ids=' + this.multipleSelection[0].id + '&status=4', {}, function (data) {
        vm.$root.monitor({ url: '/purchase/tms/invoice/all/list?itemType=1&nopage=true' })
      }, 'PUT')
    },
    // 作废发票取消
    cancelCancel () {
      this.dialogVisibleCancelMessage = false
    },
    showSearchPopover () {
      this.showAdvancedSearchPopover = !this.showAdvancedSearchPopover
    },
    messageModel (message, type) {
      this.$message({
        message: message,
        type: type
      })
    },
    httpModel (url, filename) {
      this.$http({
          url: url,
          method: 'POST',
          headers: this.headers,
          responseType: 'arraybuffer'
        }).then(function (response) {
          var blob = new Blob([response.data], { type: 'application/vnd.ms -excel' })
          var objectUrl = URL.createObjectURL(blob)
          var a = document.createElement('a')
          document.body.appendChild(a)
          a.setAttribute('style', 'display:none')
          a.setAttribute('href', objectUrl)
          a.setAttribute('download', filename)
          a.click()
          URL.revokeObjectURL(objectUrl)
        })
    },
    handleButton (btn) {
      var vm = this
      // 在采购模块中加了一个btn.edit
      let row = (btn.isApi || btn.ajax || btn.edit) ? { id: this.multipleSelection.map((r) => r.id) } : {}
      // 新增
      if (btn.action === 'addInvoice') {
        this.dialogVisible = true
        if (this.billType === 0) {
          this.mate.mateFormerHeader.values.itemType = '0'
        } else {
          this.mate.mateFormerHeader.values.itemType = '1'
        }
        return
      }
      // 连接开票
      if (btn.action === 'lianjie') {
        window.open(btn.url)
        return
      }
      // 刷新
      if (btn.action === 'shuaxin') {
        this.searchForm = {}
        vm.$root.monitor({ url: btn.url })
        return
      }
      // 下载模板
      if (btn.action === 'downLoadMuban') {
        this.httpModel (API_GATEWAY + '/api/purchase/tms/invoice/importTemplate', '发票模板.xlsx')
        return
      }
      // 导入
      if (btn.action === 'uploadFile') {
        this.$refs.excelFile.click()
        this.title = '导入发票数据'
        return
      }
      // 导出
      if (btn.action === 'downloadFile') {
        const rowt = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.searchForm.startTime = DateFormat(this.searchForm.startTime, 'yyyy-MM-dd HH:mm:ss')
        this.searchForm.endTime = DateFormat(this.searchForm.endTime, 'yyyy-MM-dd HH:mm:ss')
        var url = ''
        var fileName = ''
        url = btn.url
        if (this.billType === 0) {
          fileName = '进项发票.xlsx'
        } else {
          fileName = '销项发票.xlsx'
        }
        this.httpModel(API_GATEWAY + url + '&ids=' + rowt.id, fileName)
        return
      }
      // 删除
      if (btn.action === 'deleteInvoice') {
        if (this.multipleSelection.length === 0) {
          this.messageModel('请选择一条数据', 'warning')
          return
        }
        for (var i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].status === '1') {
            this.messageModel('验真发票不能删除', 'warning')
            return
          }
          if (this.multipleSelection[i].billSource !== '1') {
            this.messageModel('直连发票不能删除', 'warning')
            return
          }
          if (this.multipleSelection[i].transferNum !== '' && this.multipleSelection[i].transferNum !== null) {
            this.messageModel('已生成交接单不能删除', 'warning')
            return
          }
        }
        const rowt = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$root.ajaxData(btn.url + rowt.id, {}, function (data) {
          vm.$root.monitor({ url: vm.mate.mateList.dataApi })
        }, btn.method)
        return
      }
      // 重新上传
      if (btn.action === 'newUpload') {
        for (i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].status !== '4') {
            this.messageModel('不能重新上传', 'warning')
            return
          }
          if (this.multipleSelection[i].isReUpload === 1) {
            this.messageModel('不能重复上传', 'warning')
            return
          }
        }
        this.$root.ajaxData('/purchase/tms/invoice/checkUploadPermissions', {}, function (data) {
          if (data.statusCode === 40046) {
            vm.messageModel('没有上传开票数据权限', 'warning')
            return
          } else {
            const rowt = true ? { id: vm.multipleSelection.map((r) => r.id) } : {}
            vm.$root.ajaxData('/purchase/tms/invoice/rev/upload', rowt.id, function (data) {
              if (data.statusCode === 40040) {
                vm.messageModel('上传失败', 'warning')
                return
              }
              if (data.statusCode === 200) {
                vm.messageModel('操作成功', 'warning')
                window.open(btn.url)
              }
            }, 'POST')
          }
        }, 'GET')
        return
      }
      // 红字
      if (btn.action === 'scarletInvoice') {
        if (this.multipleSelection.length > 1 || this.multipleSelection.length === 0) {
          this.messageModel('请选择一条数据', 'warning')
          return
        }
        if (this.multipleSelection[0].itemType === 0) {
          this.messageModel('请选择AR发票', 'warning')
          return
        }
        if (this.multipleSelection[0].status === '3') {
          this.messageModel('已红字', 'warning')
          return
        }
        this.invoiceNo = this.multipleSelection[0].invoiceNo
        this.dialogVisibleMessage = true
        return
      }
      // 作废发票
      if (btn.action === 'invalidInvoice') {
        if (this.multipleSelection.length > 1 || this.multipleSelection.length === 0) {
          this.messageModel('请选择一条数据', 'warning')
          return
        }
        if (this.multipleSelection[0].itemType === 0) {
          this.messageModel('请选择AR发票', 'warning')
          return
        }
        if (this.multipleSelection[0].status === '4') {
          this.messageModel('已作废', 'warning')
          return
        }
        this.invoiceNo = this.multipleSelection[0].invoiceNo
        this.dialogVisibleCancelMessage = true
        return
      }
      // 生成交接单
      if (btn.action === 'toInvoiceReceipt') {
        if (this.multipleSelection.length === 0) {
          this.messageModel('请选择一条数据', 'warning')
          return
        }
        for (i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].transferNum !== '' && this.multipleSelection[i].transferNum !== null && this.multipleSelection[i].transferStatus !== 7) {
            this.messageModel('存在已生成交接单的发票', 'warning')
            return
          }
          if (this.multipleSelection[i].status === '4') {
            this.messageModel('已作废不能生成交接单', 'warning')
            return
          }
        }
        for (i = 0; i <= this.multipleSelection.length - 2; i++) {
          if (this.multipleSelection[i].itemType !== this.multipleSelection[ i + 1].itemType) {
            this.messageModel('请选择相同单据类型的发票', 'warning')
            return
          }
          if (this.multipleSelection[i].buyerOu !== this.multipleSelection[ i + 1].buyerOu) {
            this.messageModel('请选择相同业务实体的发票', 'warning')
            return
          }
        }
        const rowt = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        vm.$root.monitor({ url: btn.url + rowt.id })
        return
      }
        // 非直连开票导入模板
      if (btn.action === 'importTemplate') {
        const rowt = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        var url = '/api/purchase/tms/invoice/importTemplate?type=2'
        var fileName = '非直连开票导入模板.xlsx'
        this.$http({
          url: API_GATEWAY + url,
          method: 'POST',
          headers: this.headers,
          params: vm.searchForm,
          body: rowt.id,
          responseType: 'arraybuffer'
        }).then(function (response) {
          var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
          var objectUrl = URL.createObjectURL(blob)
          var a = document.createElement('a')
          document.body.appendChild(a)
          a.setAttribute('style', 'display:none')
          a.setAttribute('href', objectUrl)
          a.setAttribute('download', fileName)
          a.click()
          URL.revokeObjectURL(objectUrl)
          this.messageModel('下载中. . . 请稍候！', 'warning')
        })
        return
      }
      // 非直连开票导入功能
      if (btn.action === 'import') {
        this.$refs.invoiceFile.click()
        this.title = '导入非直连开票数据'
        return
      }
      // 寄送
      if (btn.action === 'send') {
        for (var j = 0; j < this.multipleSelection.length; j++) {
          if (this.multipleSelection[j].sendStatus !== '0') {
            this.messageModel('存在已寄送的发票', 'warning')
            return
          }
        }
        for (i = 0; i <= this.multipleSelection.length - 2; i++) {
          if (this.multipleSelection[i].buyer !== this.multipleSelection[ i + 1].buyer) {
            this.messageModel('请选择相同购方公司的发票', 'warning')
            return
          }
          if (this.multipleSelection[i].busiEntity !== this.multipleSelection[ i + 1].busiEntity) {
            this.messageModel('请选择相同业务实体的发票', 'warning')
            return
          }
        }
        this.dialogSendMessage = true
        return
      }
      this.$root.handleAction(btn, row, function () {
        vm.getData()
      })
    },
    invoiceUpload (file) {
      var vm = this
      var formdata = new FormData()
      formdata.append('file', file.target.files[0])
      this.$http({
        url: API_GATEWAY + '/api/purchase/tms/invoice/import',
        method: 'POST',
        body: formdata,
        responseType: 'application/json'
      }).then(function (response) {
        vm.$refs.invoiceFile.value = ''
        if (response.data !== null) {
          if (response.data.data.failed !== 0) {
            vm.$message('成功' + response.data.data.success + '条,失败' + response.data.data.failed + '条，请检查发票号和不含税金额！', 'warning')
          } else {
            vm.$message('成功' + response.data.data.success + '条', 'success')
          }
        }
        setTimeout(function () {
          vm.$root.monitor({ url: '/purchase/tms/invoice/all/list?itemType=1&nopage=true' })
        }, 1000)
      })
    },
    rowSelect () {
      this.mate.mateList.rows.forEach(row => {
        let select = (row.id && this.mate.mateList.selected && this.mate.mateList.selected.findIndex(id => id == row.id) !== -1)
        this.$refs.table.toggleRowSelection(row, (select === true))
      })
    },
    handleSelectionChange (val) {
      this.$emit('actionSelected', val)
      this.multipleSelection = val
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getData('paging')
    },
    handleListSizeChange (val) {
      this.pageSizeList = val
      this.getListData('paging')
    },
    handleCurrentChange (val) {
      this.page = val
      this.getData('paging')
    },
    handleListCurrentChange (val) {
      this.pageList = val
      this.getListData('paging')
    },
    handleAction (act, row) {
      var vm = this
      if (act.actionEmit === 'actionEmit') {
        this.$emit('handleAction', act, row)
        return true
      } else if (act.action === 'shuaxinDetail') {
        this.$root.ajaxData(act.url + row.id, {}, function (data) {
          vm.$root.monitor({ url: vm.mate.mateList.dataApi })
        }, act.method)
        return
      } else if (act.action === 'showDetail') {
        this.detialVideo = true
        this.$root.ajaxData(act.url + row.id, {}, function (data) {
          vm.detailFile = data.data
          vm.total = data.total
          vm.rowId = row.id
        })
      } else if (act.action === 'showSend') {
        if (row.transportId) {
          this.$root.ajaxData(act.url + row.transportId, {}, function (data) {
            vm.detialSendMessage = true
            vm.detialSend = data.data
          }, act.method)
        } else {
          this.message('未寄送无物流信息', 'warning')
          return
        }
      } else if (act.action === 'showInvoice'){
        if(row.status !== '1') {
            this.$message({
              message: '发票未验真,不能预览',
              type: 'warning'
            })
            return
        }else {
           vm.editInvoice(row)
        }
      }else {
        this.$root.handleAction(act, row, function () {
          vm.getData()
        })
      }
    },
    getData (flag) {
      let url = this.mate.mateList.dataApi
      let param = {
        search: this.searchValues,
        page: this.page,
        sort: this.sortValues
      }
      var vm = this
      url = '/purchase/files/all/list?sourceId=' + this.rowId + '&pageSize=' + this.pageSize + '&pageNum=' + this.page
      this.$root.ajaxData(url, {}, function (data) {
        vm.updateData(data)
      })
    },
    getListData (flag) {
      let url = this.mate.mateList.dataApi
      let param = {
        search: this.searchValues,
        page: this.page,
        sort: this.sortValues
      }
      var vm = this
      url += '&' + 'pageNum=' + this.pageList + '&pageSize=' + this.pageSizeList
      this.$root.ajaxData(url, this.searchForm, function (data) {
        vm.updateDataList(data)
      })
    },
    updateData (data) {
      this.detailFile = data.data
      if (data.total) {
        this.total = data.total
      } else {
        this.total = 0
      }
      this.$nextTick(function () {
        this.rowSelect()
      })
    },
    updateDataList (data) {
      this.mate.mateList.rows = data.data
      if (data.total) {
        this.mate.mateList.total = data.total
      } else {
        this.total = 0
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
    formatter (field) {
      return function (row, col) {
        if (field.switch) {
          return field.switch[row[col.property]]
        }
        return row[col.property]
      }
    }
  }
}
</script>

<style lang="scss">
 .myInvoice {
  .page {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .searchForm{
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
  }
  .el-form-item--mini.el-form-item {
    margin: 6px;
  }
  .el-form-item {
    margin: 0;
  }
  .button{
    margin-top:10px;
  }
  .el-table .cell, .el-table th>div {
    padding-right: 0;
    padding-left: 0;
  }
  .top-button{
    margin: 20px 0 10px 0;
  }
  .el-dialog--center .el-dialog__body{
    text-align: center !important;
    font-size: 20px !important;
  }
  .upload {
    margin-bottom:5px
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
  }
  th {
    background-color: #e6e7eb;
    color: #303030;
    font-weight: 700;
  }
  .tableWraning {
    color: #e6a23c;
  }
  .tableSuccess {
    color: #67c23a;
  }
  .searchText {
    margin-left: 10px;
    font-size: 12px;
    color: #409eff;
    cursor: pointer;
    i {
      position: absolute;
      top: 10px;
      margin-left: 5px;
      height:0px;
      width:0px;
      border-top:solid 10px #409eff;
      border-left:solid 5px rgba(0,0,0,0); 
      border-right:solid 5px rgba(0,0,0,0);
    }
  }
  .searchText:hover {
    color: #e6a23c;
    i {
      border-top: solid 10px #e6a23c;
    }
  }
  .changeDirection {
    transform: rotate(180deg);
  }

}
</style>
