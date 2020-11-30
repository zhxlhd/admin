<template>
  <div class="PreInvoice">
    <!--最上面的搜索-->
    <div class="ct">
      <el-row :gutter="10">
        <el-form v-model="searchForm">
          <el-col :sm="4" :md="4" :lg="3">
            <el-form-item>
              <dict-selected filterable v-model="searchForm.status" dictType="statusInvoice" :initValue="searchForm.status" placeholder="状态"></dict-selected>
            </el-form-item>
          </el-col>
          <el-col :sm="4" :md="4" :lg="3">
            <el-form-item>
              <el-select clearable  filterable size="mini" @change="changeName" v-model="searchForm.custName" placeholder="购方公司">
                <el-option
                  v-for="item in customerNameOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="4" :md="4" :lg="3">
            <el-form-item>
              <el-select clearable filterable size="mini" v-model="searchForm.buyerOu" placeholder="购方业务实体">
                <el-option
                  v-for="item in ouNameOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="4" :md="4" :lg="3">
            <el-form-item>
              <el-date-picker clearable size="mini" v-model="searchForm.beginDate" type="date" placeholder="创建日期从" ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="4" :md="4" :lg="3">
            <el-form-item>
              <el-date-picker clearable size="mini" v-model="searchForm.toDate" type="date" placeholder="创建日期至" ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="6" :md="6" :lg="4">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="clickQuery">查询</el-button>
              <el-button size="mini" type="info" @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <Boxer :mate="mate.mateList" :mateSearch="mate.mateSearch" :hasSelected="hasSelected" @action="handleButton" ref="Boxer" :msgBoxButton="msgBoxButton">
      <span slot="searchForm" class="leftMargin">
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link userinfo-inner">
            <el-button size="mini"
              :disabled="exportSelected"
               type="primary" plain>
            <i class="el-icon-arrow-down el-icon--right">导出</i>
            </el-button>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :disabled="exportSelected" @click.native="exportInvoice(1)">导出预制发票头信息</el-dropdown-item>
              <el-dropdown-item :disabled="exportSelected" @click.native="exportInvoice(0)" divided>导出预制发票头行信息</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
      </span>
      <div slot="main">
        <el-row>
          <el-col :span="24">
            <el-table v-loading="loadingDownInvoice" element-loading-text="正在下载中，请稍后" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)" stripe size="mini" highlight-current-row @row-click="rowClick" ref="multipleTable" :data="mate.mateList.rows" @selection-change="handleSelectionChange" @sort-change="sortChange" max-height="300">
              <el-table-column align="center" :show-overflow-tooltip="showOverflow" type="selection" width="35"></el-table-column>
              <el-table-column align="center" :show-overflow-tooltip="showOverflow" :label="obj['billCode'].label" :prop="obj['billCode'].name" :min-width="obj['billCode'].width">
                <template slot-scope="scope">
                <el-button type="text" size="mini" v-show="scope.row.blockHash" @click="clickBlockHash(scope.row.blockHash)"><img src="../../assets/imgs/ztree/ic_chain.png" style="width:13px; height:13px;margin:-2px 2px">{{ scope.row.billCode }}</el-button>
                <span v-show="!scope.row.blockHash" >{{ scope.row.billCode }} </span>
              </template>
              </el-table-column>
              <el-table-column align="center" :show-overflow-tooltip="showOverflow" :label="obj['statementNo'].label" :prop="obj['statementNo'].name" :min-width="obj['statementNo'].width"></el-table-column>
              <el-table-column align="center" :show-overflow-tooltip="showOverflow" :label="obj['status'].label" :prop="obj['status'].name" :min-width="obj['status'].width" :formatter="obj['status'].formatter"></el-table-column>
              <el-table-column align="center" :show-overflow-tooltip="showOverflow" :label="obj['custName'].label" :prop="obj['custName'].name" :min-width="obj['custName'].width"></el-table-column>
              <el-table-column align="center" :show-overflow-tooltip="showOverflow" :label="obj['buyerOu'].label" :prop="obj['buyerOu'].name" :min-width="obj['buyerOu'].width"></el-table-column>
              <el-table-column align="center" :show-overflow-tooltip="showOverflow" :label="obj['totalPriceTax'].label" :prop="obj['totalPriceTax'].name" :min-width="obj['totalPriceTax'].width"></el-table-column>
              <el-table-column align="center" :show-overflow-tooltip="showOverflow" :label="obj['totalTax'].label" :prop="obj['totalTax'].name" :min-width="obj['totalTax'].width"></el-table-column>
              <el-table-column align="center" :show-overflow-tooltip="showOverflow" :label="obj['taxRate'].label" :prop="obj['taxRate'].name" :min-width="obj['taxRate'].width"></el-table-column>
              <el-table-column align="center" :show-overflow-tooltip="showOverflow" :label="obj['invoiceNo'].label" :prop="obj['invoiceNo'].name" :min-width="obj['invoiceNo'].width"></el-table-column>
              <el-table-column align="center" :show-overflow-tooltip="showOverflow" :label="obj['invoiceCode'].label" :prop="obj['invoiceCode'].name" :min-width="obj['invoiceCode'].width"></el-table-column>
              <el-table-column align="center" :show-overflow-tooltip="showOverflow" :label="obj['makeInvoiceTime'].label" :prop="obj['makeInvoiceTime'].name" :min-width="obj['makeInvoiceTime'].width"></el-table-column>
              <el-table-column align="center" :show-overflow-tooltip="showOverflow" :label="obj['remark'].label" :prop="obj['remark'].name" :min-width="obj['remark'].width">
                 <template slot-scope="scope">
                    <el-input v-if="scope.row.status==='1' || scope.row.status==='2'" :disabled="true" type="text" size="mini"    v-model="scope.row[obj['remark'].name]"></el-input>
                    <el-input v-else type="text" size="mini"   @focus="editRemark('remark', scope.row[obj['remark'].name], scope.row.id)"   v-model="scope.row[obj['remark'].name]"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" :show-overflow-tooltip="showOverflow" :label="obj['createAt'].label" :prop="obj['createAt'].name" :min-width="obj['createAt'].width"></el-table-column>
               <el-table-column align="center" label="操作" fixed="right" :width="200">
                <template slot-scope="scope">
                  <el-button size="mini" @click="rowDblclick(scope.row)">预览</el-button>
                  <el-tooltip content="发票回填" placement="top">
                    <el-button size="mini" v-if="scope.row.status!=='1'&&scope.row.status!=='2'" @click="editInvoice(scope.row)">回填</el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <div class="total">
          <span>共  {{mate.mateList.rows.length}}条</span>&nbsp;&nbsp;
          <span>勾选条数:{{ selectAmount }}</span>&nbsp;&nbsp;
          <span>含税金额合计:{{ totalMoneyAmount }}</span>&nbsp;&nbsp;
          <span>不含税金额合计:{{ totalUnTaxMoneyAmount }}</span>&nbsp;&nbsp;
          <span>税额合计:{{ totalTaxMoneyAmount }}</span>
        </div>
      </div>
      <a href="InvoiceSoftware://" ></a>
    </Boxer>
     <el-row v-show="this.tenantId == 1" type="flex" justify="center" class="page">
      <el-col :span="12">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="mate.mateList.page"
            layout="total, prev, pager, next, sizes"
            :total="mate.mateList.total"
            :page-sizes ="[5,10,15,20,30]"
            :page-size="pageSize">
        </el-pagination>
      </el-col>
      </el-row>
    <!--下面的明细表格-->
    <el-table stripe size="mini" max-height="300" show-overflow-tooltip highlight-current-row v-if="showFlag" :data="mate.mateLineList.lineColumns"  class="detailLine">
      <el-table-column align="center" :show-overflow-tooltip="showOverflow" :label="object['lineNo'].label" :prop="object['lineNo'].name" :min-width="object['lineNo'].width"></el-table-column>
      <el-table-column align="center" :show-overflow-tooltip="showOverflow" :label="object['itemName'].label" :prop="object['itemName'].name" :min-width="object['itemName'].width">
        <template slot-scope="scope">
          <el-input :disabled="editFlag" size="mini" @focus="focusLine('itemName', scope.row[object['itemName'].name])" @blur="modifyLine('itemName', scope.row[object['itemName'].name], scope.row.id, scope.row.goodsCode)" v-model="scope.row[object['itemName'].name]"></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" :show-overflow-tooltip="showOverflow" :label="object['modelName'].label" :prop="object['modelName'].name" :min-width="object['modelName'].width">
        <template slot-scope="scope">
            <el-input :disabled="editFlag" type="text" size="mini" @focus="focusLine('modelName', scope.row[object['modelName'].name])"  @blur="modifyLine('modelName', scope.row[object['modelName'].name], scope.row.id, scope.row.goodsCode)" v-model="scope.row[object['modelName'].name]"></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" :show-overflow-tooltip="showOverflow" :label="object['quantity'].label" :prop="object['quantity'].name" :min-width="object['quantity'].width"></el-table-column>
      <el-table-column align="center" :show-overflow-tooltip="showOverflow" :label="object['price'].label" :prop="object['price'].name" :min-width="object['price'].width"></el-table-column>
      <el-table-column align="center" :show-overflow-tooltip="showOverflow" :label="object['totalPrice'].label" :prop="object['totalPrice'].name" :min-width="object['totalPrice'].width"></el-table-column>
      <el-table-column align="center" :show-overflow-tooltip="showOverflow" :label="object['classCode'].label" :prop="object['classCode'].name" :min-width="object['classCode'].width">
        <template slot-scope="scope">
          <el-input :disabled="editFlag" type="text" size="mini" @focus="focusLine('classCode', scope.row[object['classCode'].name])"  @blur="modifyLine('classCode', scope.row[object['classCode'].name], scope.row.id, scope.row.goodsCode)" v-model="scope.row[object['classCode'].name]"></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" :show-overflow-tooltip="showOverflow" :label="object['unit'].label" :prop="object['unit'].name" :min-width="object['unit'].width">
        <template slot-scope="scope">
          <el-input :disabled="editFlag" type="text" size="mini" @focus="focusLine('unit', scope.row[object['unit'].name])"  @blur="modifyLine('unit', scope.row[object['unit'].name], scope.row.id, scope.row.goodsCode)" v-model="scope.row[object['unit'].name]"></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" :show-overflow-tooltip="showOverflow" :label="object['taxRate'].label" :prop="object['taxRate'].name" :min-width="object['taxRate'].width"></el-table-column>
      <el-table-column align="center" :show-overflow-tooltip="showOverflow" :label="object['totalTax'].label" :prop="object['totalTax'].name" :min-width="object['totalTax'].width"></el-table-column>

      <el-table-column align="center" :show-overflow-tooltip="showOverflow" :label="object['goodsCode'].label" :prop="object['goodsCode'].name" :min-width="object['goodsCode'].width"></el-table-column>
      <el-table-column align="center" :show-overflow-tooltip="showOverflow" :label="object['remark'].label" :prop="object['remark'].name" :min-width="object['remark'].width"></el-table-column>
    </el-table>
      <input type="file" ref="excelFile"  style="display:none" @change="fileUpload"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
    <el-dialog title="发票信息" :visible.sync="dialogVisible"  width="40%" center class="invoiceDetail" >
      <el-row>
        <el-form size="mini" ref="form" :model="mate.mateHead.values" label-width="100px" :rules="rules">
           <el-col :span="15"> 
            <el-form-item :label="object['itemType'].label" :prop="object['itemType'].name">
              <dict-selected  rowId="0" v-model="mate.mateHead.values[object['itemType'].name]" dictType="myInvoiceType" :initValue="mate.mateHead.values[object['itemType'].name]"></dict-selected>
            </el-form-item>
           </el-col>
             <el-col :span="15">
            <el-form-item :label="object['invoiceNo'].label" :prop="object['invoiceNo'].name" >
             <el-input v-model="mate.mateHead.values[object['invoiceNo'].name]" placeholder="请输入8位的发票号"></el-input>
            </el-form-item>
            </el-col>
             <el-col :span="15">
            <el-form-item :label="object['invoiceCode'].label" :prop="object['invoiceCode'].name" >
             <el-input v-model="mate.mateHead.values[object['invoiceCode'].name]" placeholder="请输入10位或12位的发票代码"></el-input>
            </el-form-item>
            <el-form-item :label="object['makeInvoiceTime'].label" :prop="object['makeInvoiceTime'].name">
             <el-date-picker  type="date" v-model="mate.mateHead.values[object['makeInvoiceTime'].name]"></el-date-picker>
            </el-form-item>
            </el-col>
             <el-col :span="15">
            <el-form-item :label="object['totalPrice'].label" :prop="object['totalPrice'].name">
             <el-input v-model="mate.mateHead.values[object['totalPrice'].name]"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="15">
            <el-form-item>
              <el-button size="mini" type="primary" :disabled="backfillDisabled" @click="confrimDialogVisible">确定</el-button>
              <el-button size="mini" @click="cancelDialogVisible">取消</el-button>
            </el-form-item>
            </el-col>
        </el-form>
      </el-row>
    </el-dialog>
    <el-dialog :visible.sync="visible" width="65%">
      <InvoiceView :myInvoice="myInvoice" :rowStatus="rowStatus" :invoiceDetial="invoiceDetial" ref="InvoiceView"></InvoiceView>
    </el-dialog>

    <el-dialog title="查看区块信息" :visible.sync="blockHashVisible" width="40%">
      <BlockHash :hashForm="hashForm">
      </BlockHash>
    </el-dialog>
    <el-dialog title="开票任务列表" :visible.sync="invoiceList" width="60%">
       <el-form>
            <el-table max-height="300" size="mini" :data="this.multipleSelection" border style="width: 100%;" class="detailTable">
              <el-table-column type="index" width="50" label="序号"></el-table-column>
              <el-table-column show-overflow-tooltip property="billCode" label="预制发票号" width="100"></el-table-column>
              <el-table-column show-overflow-tooltip property="buyer" label="购方名称" width="200"></el-table-column>
              <el-table-column show-overflow-tooltip property="totalPriceTax" label="含税金额(元)" width="100"></el-table-column>
              <el-table-column show-overflow-tooltip property="totalTax" label="税额(元)" width="100"></el-table-column>
              <el-table-column show-overflow-tooltip property="makeInvoiceTime" label="开票日期" width="100"></el-table-column>
              <el-table-column show-overflow-tooltip property="status" label="开票状态" :formatter="statusInvoice" width="100"></el-table-column>
            </el-table>
         </el-form>
         <div style="padding-top:10px;">
         当前开票任务：{{ this.multipleSelection.length }} 已开票任务: {{ this.count }}
         </div>
    </el-dialog>
      <el-dialog width="25%" title="确认框" :before-close="handleClose" :visible.sync="innerInvoiceList">
      <el-form size="mini" class="InvoiceConfirm" :label-position="labelPosition" label-width="150px">
        <el-form-item label="当前开具的发票代码:">
          <el-input v-model="invoiceCode" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="当前开具的发票号码:">
          <el-input v-model="invoiceNo" :readonly="true"></el-input>
        </el-form-item>
        <div style="text-align:center;padding-top:10px;" >
        请确认上述信息跟当前空白发票的信息是否一致
        </div>
        <div class="dialog-footer">
            <el-button size="mini" type="primary" :loading="loading" @click="upLoadInvoiceList()">确认开票</el-button>&nbsp;&nbsp;&nbsp;
            <el-button size="mini" type="primary" :loading="loading" @click="closeInvoiceList()">取消开票</el-button>
        </div>
      </el-form>          
      </el-dialog>
      <el-dialog width="25%" title="填写备注" :visible.sync="remarkDialog">
        <el-form size="mini">
          <el-form-item >
             <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入备注"
              v-model="remarkDetail">
            </el-input>
          </el-form-item>
          <div class="dialog-footer">
            <el-button size="mini" type="primary" @click="modifyHeader('remark',remarkDetail,remarkHeaderId)">确认</el-button>&nbsp;&nbsp;&nbsp;
            <el-button size="mini" type="primary"  @click="closeDetail()">取消</el-button>
        </div>
        </el-form>     
      </el-dialog>
    <div id ="end"></div>
    </div>

</template>

<script>
import { API_GATEWAY,INVOICE_URL,HX_INVOICE_URL } from '@/config/index.js'
import KBtn from '../../components/KBtn.vue'
import Boxer from '../../components/Boxer.vue'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
import { DateFormat,trimSpace } from '../../utils/util.js'
import BlockHash from '../../components/BlockHash.vue'
import { exists } from 'fs';
export default {
  mixins: [ColumnFormatterMixin],
  components: {
    KBtn,
    Boxer,
    BlockHash,
    InvoiceView: function index (resolve) {
      require(['../../components/InvoiceView.vue'], resolve)
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
      this.$root.ajaxData('/purchase/tms/invoice/checkInvoice?invoiceNo=' + this.mate.mateHead.values.invoiceNo, {}, function (data) {
        if (data.statusCode === 40042) {
          callback(new Error('发票号已存在'))
        } else {
        if(!value){
          callback(new Error('该项为必填项'))

      }else if (value.length !== 8) {

        callback(new Error('请输入8位的发票号'))
      }else{ 

          callback()
          }
        }
      })
    }
    var validateInvoiceNoLength = (rule, value, callback) => {
      this.dialogVisible = true;
      if(value==""||value==null||value==undefined){
        callback(new Error('该项为必填项'))
      }else if (value.length !== 8) {
        if(!value){
          callback(new Error('该项为必填项'))
        } else {
          if (value.length !== 8) {
            callback(new Error('请输入8位的发票号'))
          } 
        }
      }else{
        const reg = /^[0-9]*$/;
        let pattern = new RegExp(reg);
        if(!pattern.test(value)){
          callback(new Error('请输入数字'))
        }else{
          callback()
        }
      }
    }
    var totalPriceCheckTotal= (rule, value, callback) => {
      var vm = this
      var totalPirceParam = Number(this.mate.mateHead.values.totalPrice);
      var id = this.invoiceId;
      if(!totalPirceParam){
        callback(new Error('请填写正确金额'))
      } else {
        this.$root.ajaxData('/purchase/tms/invoice/checkInvoiceTotalPrice?id=' + id+"&totalPriceTax=" + totalPirceParam, {}, function (data) {
        if (data.statusCode === 200){
          callback()
        } else {
          callback(new Error('请填写正确金额'))
        }
      })
      }
    }
    var validateInvoiceCodeLength = (rule, value, callback) => {
      if(value){
        // 声明数字正则
        const reg = /^[0-9]*$/;
        let pattern = new RegExp(reg);
        if (value.length !== 10 && value.length !== 12) {
          callback(new Error('请输入10或12位的发票代码'))
        } else {
          // 校验数字
          if(pattern.test(value)){
            callback();
          }else{
            callback(new Error('请输入数字'))
          }
        }
      } else {
        callback(new Error('该项为必填项'))
      }
    
    }
    return {
      repeatStatus:'',
      invoiceId:'',
      backfillDisabled: false,
      searchForm: {
        status: '',
        custName: '',
        buyerOu: '',
        beginDate: '',
        toDate: ''
      },
      remarkDetail:'',
      remarkDialog: false,
      customerNameOptions: [],
      ouNameOptions: [],
      tenantId: JSON.parse(window.sessionStorage.getItem('user')).tenantId,
      count: 0,
      importInvoiceFlag: false,// 是否可以进行开票的标识 false:可以 true：不可以
      invoiceCode: '',// 调用webservice号码功能返回的发票代码
      invoiceNo: '',// 调用webservice号码功能返回的发票号
      innerInvoiceList: false, //开票列表确认开票页面
      loading: false,
      subModelName: false, // 是否截取规格型号的标识
      invoiceList: false,
      labelWidth: '90px',
      blockHashVisible: false,
      loadingDownInvoice: false,
      hashForm: {},
      pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      simpleSearchForm :{
        custName: '',
        status: '',
        createDate: ''
      },
      pageSize: 5,
      page: 0,
      exportSelected: true,
      totalUnTaxMoneyAmount: 0,
      totalTaxMoneyAmount: 0,
      remarkHeaderId:'',
      selectAmount: 0,
      totalMoneyAmount: 0,
      visible: false,
      showAdvancedSearchPopover: false,
      titleOptions: [],
      showOverflow: true,
      operatorOptions: [],
      invoiceDetial: {},
      myInvoice: false,
      multipleSelection: [],     // 点击table前面的框框，获取到的内容
      hasSelected: false,
      rowStatus: '',
      sortValues: {},
      action: null,
      showFlag: false,                    // 下面表格的开关
      object: {},                          // 放columns
      obj: {},
      andOrSymbolOptions: [],
      headers: {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
        'Accept': 'application/json',
        'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
        'Content-Type': 'application/json;charset=utf8'
      },
      dialogVisible: false,
      auditStatus: '',
      rowsContent: [],              // 获取到明细行中的数据
      fileName: '',
      lineSelected: [],               // 存放全部的label
      msgBoxButton: true,
      dialogDetailLine: false,
      classCodeLine: '',
      itemNameLine: '',
      rowId: '',
      remarkLine: '',
      remarkHeader: '',
      modelNameLine: '',
      unitLine: '',
      editFlag: false, // 显示行中可编辑字段的开关
      uniqueMap: {},
      statusInvoiceOptions: [],
      // ruleInvoiceNo: [
      //    { required: true, message: '该输入项为必输项', trigger: 'blur' },
      //    { validator: validateInvoiceNo, trigger: 'blur' },
      //    { validator: validateInvoiceNoLength, trigger: 'blur' }
      // ],
      // ruleInvoiceCode: [
      //    { required: true, message: '该输入项为必输项', trigger: 'blur' },
      //    { validator: validateInvoiceCodeLength, trigger: 'blur' }
      // ],
      rules: {
        itemType: { required: true, message: '该输入项为必输项', trigger: 'blur' },
        makeInvoiceTime: { required: true, message: '该输入项为必输项', trigger: 'blur' },
        // totalPrice: { required: true, message: '该输入项为必输项', trigger: 'blur' },
        totalPrice: {  validator: totalPriceCheckTotal, trigger: 'blur' },
        // 发票号
        invoiceNo: {required: true, validator: validateInvoiceNoLength, trigger: 'blur' },
        // invoiceNo:  { validator: validateInvoiceNoLength, trigger: 'blur' },
        // 发票代码
        invoiceCode: {required: true, validator: validateInvoiceCodeLength, trigger: 'blur' },
      }
    }
  },
  watch: {
    multipleSelection: function (newSelection) {
      this.hasSelected = (newSelection.length !== 0)
    },
    mate: function (newMate) {
      this.formatterBefore(this.mate.mateList.columns)
      this.formatterBefore(this.mate.mateList.lineColumns)
      this.rowsContent = this.mate.mateList.rows
      this.mate.mateList.localName = this.mate.localName
      this.$nextTick(function () {
        this.rowSelect()
      })
      this.titleOptions = this.mate.mateSearch.fields[0].options
      this.operatorOptions = this.mate.mateSearch.fields[1].options
      this.andOrSymbolOptions = this.mate.mateSearch.fields[3].options
    }
  },
  created () {
    let mateList = this.mate.mateList
    let mateSearch = this.mate.mateSearch.fields
    this.mate.mateHead.fields.map((i) => { this.object[i.name] = i })
    this.formatterBefore(mateList.columns)
    this.formatterBefore(mateList.lineColumns)
    this.rowsContent = mateList.rows
    this.mate.mateLineList.columns.map((i) => { this.object[i.name] = i })
    mateList.columns.map((i) => { this.obj[i.name] = i })
    mateList.localName = this.mate.localName
    this.titleOptions = mateSearch[0].options
    this.operatorOptions = mateSearch[1].options
    this.andOrSymbolOptions = mateSearch[3].options
    // this.getCustomer()//获取客户信息
    // this.getStatusInvoice()//获取发票的状态
    this._getCustomerName()
    if (this.mate.toDayDate && this.mate.twoMonthDate) {
       this.searchForm.toDate = this.mate.toDayDate
       this.searchForm.beginDate = this.mate.twoMonthDate
    }
  },
  mounted () {
    this.rowSelect()
  },
  methods: {
    editRemark(key,value,id){
      if (key === 'remark'){
        this.remarkHeader = value
        this.remarkDetail = value
        this.remarkHeaderId = id
        this.remarkDialog = true
      }
    },
    handleClose (done) {
       this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
    // 获取客户名称
    _getCustomerName () {
      var vm = this
      this.$root.ajaxData('/companys/companyInfo/4?status=1&auditStatus=1&nopaging=1&dataOnly=true', {}, function (data) {
        for (var i = 0; i < data.length; i++) {
          data[i].value = data[i].name
        }
        vm.customerNameOptions = data
      })
    },
    // 购方公司改变的时候用
    changeName (val) {
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
    // 查询条件重置
    reset() {
      this.searchForm.status = ''
      this.searchForm.custName = ''
      this.searchForm.buyerOu = ''
      this.searchForm.beginDate = ''
      this.searchForm.toDate = ''
    },
    // 查询接口
    clickQuery() {
      let vm = this
      this.searchForm.beginDate = DateFormat(this.searchForm.beginDate, 'yyyy-MM-dd')
      this.searchForm.toDate = DateFormat(this.searchForm.toDate, 'yyyy-MM-dd')
      let url = ''
      if (this.tenantId == 1) {
         url = '/purchase/tms/invoice/precast/simple/search?isPre=1'
      }else {
         url = '/purchase/tms/invoice/precast/simple/search?isPre=1&nopage=true'
      }
      this.$root.ajaxData(url, this.searchForm, function (data) {
        vm.mate.mateList.rows = data.mate.rows
        vm.mate.mateList.page = data.mate.page
        vm.mate.mateList.total = data.mate.total
      }, 'POST')
    },
    //导入开票
    upLoadInvoiceList () {
      var vm = this
      vm.loading = true
      vm.dru(this.multipleSelection[this.count])
    },
    closeInvoiceList () {
      this.innerInvoiceList = false
    },
    clickBlockHash (blockHash) {
      var vm = this
      this.$http({
        url: API_GATEWAY + '/hyper/block/hash/query/' + blockHash,
        method: 'GET',
        headers: this.headers,
        responseType: 'application/json'
      }).then(function (response) {
        if (response.data.length > 0) {
          vm.blockHashVisible = true
          vm.hashForm = response.data
        } else {
          vm.hashForm = {}
          this.message('没有查询到区块信息', 'warning')
          return
        }
      })
    },
    // getStatusInvoice () {
    //   var vm = this
    //   this.$root.ajaxData('/dic/cg/statusInvoice', {}, function (data) {
    //     for (let i = 0; i < data.length; i++) {
    //       vm.statusInvoiceOptions.push({ label: data[i].label, value: data[i].label, key: data[i].id })
    //     }
    //   }, 'GET')
    // },
    // getCustomer () {
    //   var vm = this
    //   this.$root.ajaxData('/companys/companyInfo/4?status=1&auditStatus=1&nopaging=1&dataOnly=true', {}, function (data) {
    //     for (let i = 0; i < data.length; i++) {
    //       vm.customerOptions.push({ label: data[i].name, value: data[i].name, key: data[i].id })
    //     }
    //   }, 'GET')
    // },
    statusInvoice (row, column){
      if (row.status == 0) {
        return '待开票'
      }else if (row.status == 2) {
        return '已开票'
      }
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getData('paging')
    },
    handleCurrentChange (val) {
      this.page = val
      this.getData('paging')
    },
    getData (flag) {
      let url = this.mate.mateList.dataApi
      let param = {
        search: this.searchValues,
        page: this.page,
        sort: this.sortValues
      }
      let judge = false
      if (this.mate.mateSearch.values[0]['name'] && this.mate.mateSearch.values[0]['operator'] && this.mate.mateSearch.values[0]['value']) {
        judge = true
      }
      var vm = this
      if (flag && !judge) {
        var simpleSearchValue = []
      if (trimSpace(this.simpleSearchForm.custName) !== '' && this.simpleSearchForm.custName != null){
          simpleSearchValue.push({
                  name : 'tm.cust_name',
                  operator : '=',
                  value : this.simpleSearchForm.custName,
                  andOrSymbol: 'and'
          })
        }
        if (trimSpace(this.simpleSearchForm.status) !== '' && this.simpleSearchForm.status != null){
          simpleSearchValue.push({
                  name : 'tm.status',
                  operator : '=',
                  value : this.simpleSearchForm.status,
                  andOrSymbol: 'and'
          })
        }
        if (trimSpace(this.simpleSearchForm.createDate) !== '' && this.simpleSearchForm.createDate != null){
          simpleSearchValue.push({
                  name : 'tm.create_at_range',
                  operator : '=',
                  value : DateFormat(this.simpleSearchForm.createDate[0],'yyyy-MM-dd') + ',' + DateFormat(this.simpleSearchForm.createDate[1],'yyyy-MM-dd'),
                  andOrSymbol: 'and'
          })
        }
        const mate = simpleSearchValue
        if (mate.length > 0){
          let len = mate.length
          mate[len - 1].andOrSymbol = 'null'
        }
        url = `/purchase/tms/invoice/precast/list-q?pageSize=${this.pageSize}&pageNum=${this.page}`
        this.$root.ajaxData(url, this.searchForm, function (data) {
          vm.updateData(data)
        }, 'POST')
        return
      }
      if (flag && judge) {
        let data = this.mate.mateSearch.values
        let len = this.mate.mateSearch.values.length
        for (let i = 0; i < len; i++) {
          if (data[i]['name'] === 'sl.create_at') {
            data[i]['value'] = DateFormat(data[i]['value'], 'yyyy-MM-dd')
          }
        }
        url = `/purchase/tms/invoice/precast/list-q?pageSize=${this.pageSize}&pageNum=${this.page}`
        this.$root.ajaxData(url, this.mate.mateSearch.values, function (data) {
          vm.updateData(data)
        }, 'POST')
      }
    },
    updateData (data) {
      if (data.mate.rows) {
        this.mate.mateList.rows = data.mate.rows
        // rowsContent用于判断波次批次管理中拣料出库动作是否可以进行
        this.rowsContent = data.mate.rows
      }
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
    //预制发票导出
    exportInvoice (val) {
      var vm = this
      const row = { id: this.multipleSelection.map((r) => r.id) }
      let ids = row.id
      ids = ids.join()
      // 导出发票行
        this.$http({
          url: API_GATEWAY + '/api/purchase/tms/invoice/precast/export?flag='+val,
          method: 'POST',
          headers: this.headers,
          responseType: 'arraybuffer',
          body: row.id
        }).then(function (response) {
          var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          // blob(size,type) Blob构造函数，接受两个参数。第一个参数是一个包含实际数据的数组，第二个参数是数据的类型
          var objectUrl = URL.createObjectURL(blob)
          var a = document.createElement('a')
          document.body.appendChild(a)
          a.setAttribute('style', 'display:none')
          a.setAttribute('href', objectUrl)
          var filename = '预制发票信息.xlsx'
          a.setAttribute('download', filename)
          a.click()
          URL.revokeObjectURL(objectUrl)
        })
        return
    },
    // 清空查询条件
    clearCondition () {
      this.mate.mateSearch.values = [{
        name : '',
        operator : '',
        value : '',
        andOrSymbol: 'null'
      }]
    },
    // 点击添加查询条件
    addCondition () {
      let len = this.mate.mateSearch.values.length
      if (this.mate.mateSearch.values.length >= 1) {
        this.mate.mateSearch.values[len - 1]['andOrSymbol'] = ''
      }
      this.mate.mateSearch.values.push({
        name : '',
        operator : '',
        value : '',
        andOrSymbol: 'null'
      })
    },
    // 查询条件
    query () {
      this.mate.mateList.lineRows = null
      let len = this.mate.mateSearch.values.length
      let data = this.mate.mateSearch.values
      for (let i = 0; i < len; i++) {
        if (data[i]['name'] === 'tm.create_at') {
          data[i]['value'] = DateFormat(data[i]['value'], 'yyyy-MM-dd')
        }
        if (data[i]['andOrSymbol'] === '') {
          this.message('请选择并列条件', 'warning')
          return
          
        }
      }
      const mate = this.mate.mateSearch.values
      const vm = this
      let url = ''
      if (this.tenantId == 1) {
        url = '/purchase/tms/invoice/precast/simple/search'
      }else {
        url = this.mate.mateSearch.url
      }
      this.$root.ajaxData(url, mate, function (data) {
        vm.mate.mateList.rows = data.mate.rows
        vm.mate.mateList.total = data.mate.total
      }, 'POST')
    },
    onSubmit () {
      var simpleSearchValue = []
      if (trimSpace(this.simpleSearchForm.custName) !== '' && this.simpleSearchForm.custName != null){
        simpleSearchValue.push({
                name : 'tm.cust_name',
                operator : '=',
                value : this.simpleSearchForm.custName,
                andOrSymbol: 'and'
         })
      }
      if (trimSpace(this.simpleSearchForm.status) !== '' && this.simpleSearchForm.status != null){
        simpleSearchValue.push({
                name : 'tm.status',
                operator : '=',
                value : this.simpleSearchForm.status,
                andOrSymbol: 'and'
         })
      }
      if (trimSpace(this.simpleSearchForm.createDate) !== '' && this.simpleSearchForm.createDate != null){
        simpleSearchValue.push({
                name : 'tm.create_at_range',
                operator : '=',
                value : DateFormat(this.simpleSearchForm.createDate[0],'yyyy-MM-dd') + ',' + DateFormat(this.simpleSearchForm.createDate[1],'yyyy-MM-dd'),
                andOrSymbol: 'and'
         })
      }
      const mate = simpleSearchValue
      if (mate.length > 0){
        let len = mate.length
        mate[len - 1].andOrSymbol = 'null'
      }
      const vm = this
      let url = ''
      if (this.tenantId == 1) {
        url = '/purchase/tms/invoice/precast/simple/search'
      }else {
        url = this.mate.mateSearch.url
      }
      this.$root.ajaxData(url, mate, function (data) {
        vm.mate.mateList.rows = data.mate.rows
        vm.mate.mateList.total = data.mate.total
      }, 'POST')
    },
    rowDblclick (row) {
      var vm = this
      this.rowStatus = row
      this.$root.ajaxData('/purchase/tms/invoice/showInvoice/' + row.id, {}, function (data) {
        vm.visible = true
        vm.invoiceDetial = data
      })
    },

  
    showSearchPopover () {
      this.showAdvancedSearchPopover = !this.showAdvancedSearchPopover
    },
    // table表格中勾选的选项，val是勾选的对象
    handleSelectionChange (val) {
      this.$emit('actionSelected', val)
      this.multipleSelection = val
      this.totalMoneyAmount = 0
      this.totalUnTaxMoneyAmount = 0
      this.totalTaxMoneyAmount = 0
      this.selectAmount = val.length
      if(this.selectAmount > 0){
        this.exportSelected = false
      }else{
        this.exportSelected = true
      }
      for (let i = 0; i < val.length; i++) {
        this.totalMoneyAmount += val[i].totalPriceTax
        this.totalUnTaxMoneyAmount += val[i].totalPrice
        this.totalTaxMoneyAmount += val[i].totalTax
      }
      this.totalMoneyAmount = Math.round(this.totalMoneyAmount * 100) / 100
      this.totalUnTaxMoneyAmount = Math.round(this.totalUnTaxMoneyAmount * 100) / 100
      this.totalTaxMoneyAmount = Math.round(this.totalTaxMoneyAmount * 100) / 100
    },
    cancelDialogVisible () {
      this.dialogVisible = false
    },
    confrimDialogVisible () {
      var mate = {}
      var vm = this
      vm.backfillDisabled = true;
      let isOk = false;
      let url = `/purchase/tms/invoice/checkInvoiceRepeat?id=${this.rowId}&invoiceNo=${this.mate.mateHead.values.invoiceNo}&invoiceCode=${this.mate.mateHead.values.invoiceCode}`
      this.$root.ajaxData(url, {}, function (data) {
        if(data.statusCode == 99999) {
          vm.message('发票号+发票代码已存在，请检查重新回填', 'warning')
          vm.dialogVisible = true;
          vm.backfillDisabled = false;
          return;
        }else{
          vm.$refs['form'].validate((valid) => {
         if (valid) {
          vm.mate.mateHead.values.makeInvoiceTime = DateFormat(vm.mate.mateHead.values.makeInvoiceTime, 'yyyy-MM-dd')
          mate = vm.mate.mateHead.values
          if (vm.mate.mateHead.values.sourceId) {
            vm.httpMethods('/purchase/tms/invoice/updateInvoice', '', mate, 'PUT')
          } else {
            vm.httpMethods('/purchase/tms/invoice/add?id=' ,vm.rowId, mate, 'POST')
          }
          vm.dialogVisible = false
          }else {
                vm.backfillDisabled = false;
          vm.message('数据未填写', 'warning')
          return
        }
                vm.$root.ajaxData('/purchase/tms/invoice/checkPreInvoiceInfo', {}, function (data) {
        }, 'GET')
          
      })
        }
      },'GET')
      // this.$refs['form'].validate((valid) => {
      //    if (valid) {
      //      console.log(isOk)
      //      if (isOk == false) {
      //       vm.message('发票号+发票代码已存在，请检查重新回填', 'warning')
      //       vm.dialogVisible = true;
      //       vm.backfillDisabled = false;
      //       return;
      //     }
      //     this.mate.mateHead.values.makeInvoiceTime = DateFormat(this.mate.mateHead.values.makeInvoiceTime, 'yyyy-MM-dd')
      //     mate = this.mate.mateHead.values
      //     if (this.mate.mateHead.values.sourceId) {
      //       this.httpMethods('/purchase/tms/invoice/updateInvoice', '', mate, 'PUT')
      //     } else {
      //       this.httpMethods('/purchase/tms/invoice/add?id=' ,this.rowId, mate, 'POST')
      //     }
      //     this.dialogVisible = false
      //     }else {
      //           vm.backfillDisabled = false;
      //     this.message('数据未填写', 'warning')
      //     return
      //   }
      //           this.$root.ajaxData('/purchase/tms/invoice/checkPreInvoiceInfo', {}, function (data) {
      //   }, 'GET')
          
      // })
    },
    httpMethods(url, id, mate, type) {
      var vm = this
      this.$root.ajaxData(url + id, mate, function (data) {
        if (data.statusCode === 200) {
          vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
              vm.mate.mateList.rows = data.mate.mateList.rows
          }, 'GET')
          vm.message('操作成功', 'success')

        } 
        // else if (data.statusCode === 40042) {
        //   vm.message('发票号已存在', 'warning')
        // }
        else if (data.statusCode === 40050) {
            vm.message('税前金额不一致，请仔细核查！', 'warning')
        }
                                            vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
          vm.mate.mateList.rows = data.mate.mateList.rows
        }, 'GET')
        vm.$root.ajaxData('/purchase/tms/invoice/checkPreInvoiceInfo', {}, function (data) {
        }, 'GET')
        return 
      }, type)
    },
    dialogDetailLineFalse () {
      this.dialogDetailLine = false
    },
    dialogDetailLineTrue () {
      this.dialogDetailLine = true
    },
    handleDetialLine () {
      this.dialogDetailLine = true
    },
    closeDetail(){
      this.remarkDialog = false
      this.remarkDetail = ''
    },
    modifyHeader (key, value, id) {
      var vm = this
      const data = {}
      if(value != null){
        //  if (key === 'remark' && this.remarkHeader === value.trim()) {
        //  return false
        // }
        if (key === 'remark') {
          data.remark = value.trim()
        }
        data.isPre = 1
        this.$root.ajaxData(`/purchase/tms/invoice/${id}`, data, function (data) {
          vm.remarkDialog = false
          vm.remarkDetail = ''
          vm.$root.monitor({ url: '/purchase/tms/invoice/precast/list' })
        }, 'PUT')
      }
    },
    modifyLine (key, value, id, goodsCode) {
      const data = {}
      let lineColumns = this.mate.mateLineList.lineColumns
      if (value != null){
          if (key === 'itemName' && this.itemNameLine === value.trim()) {
            return false
          } else if (key === 'classCode' && this.itemNameLine === value.trim()) {
            return false
          } else if (key === 'remark' && this.remarkLine === value.trim()) {
            return false
          } else if (key === 'modelName' && this.modelNameLine === value.trim()){
            return false
          } else if (key === 'unit' && this.unitLine === value.trim()) {
            return false
          }
          if (key === 'itemName') {
            data.itemName = value.trim()
          } else if (key === 'classCode') {
            if (value.length !== 19) {
              this.message('请填写19位的税收分类代码', 'warning')
              for (let i = 0; i < lineColumns.length; i++) {
                if (lineColumns[i].id === id) {
                  lineColumns[i].classCode = ''
                }
              }
              return
            }
            data.classCode = value
          } else if (key === 'remark') {
            data.remark = value.trim()
          } else if (key === 'modelName') {
            data.modelName = value.trim()
          } else if (key === 'unit') {
            data.unit = value.trim()
          }
          this.$root.ajaxData(`/purchase/invoice/line/update/${id}/${goodsCode}`, data, function (data) {
          }, 'PUT')
      }
    },
    focusHeader (key, value) {
      if (key === 'remark'){
        this.remarkHeader = value
      }
    },
    focusLine (key, value) {
      switch(key) {
        case 'classCode': 
          this.classCodeLine = value
          break
        case 'itemName':
          this.itemNameLine = value
          break
        case 'remark':
          this.remarkLine = value
          break
        case 'modelName':
          this.modelNameLine = value
          break
        case 'unit':
          this.unitLine = value
          break
      }
    },
    rowClick (row) {
      var status = row.status
      if (status == 1 || status == 2) {
        this.editFlag = true
      } else {
        this.editFlag = false
      }
      this.showFlag = true
      var vm = this
      this.$root.ajaxData(this.mate.mateList.url + '/' + row.id, {}, function (data) {
        vm.mate.mateLineList.lineColumns = data
      }, 'GET')
    },
    message (message,type) {
      // this.$message({
      //   message: message,
      //   type: type
      // })
      this.$alert(message, {
        confirmButtonText: '确定',
        type:type
      });
    },
    // 判断预制发票是不是待开票
    judgeInvoice (data) {
      const len = data.length
      for (let i = 0; i < len; i++) {
        if (data[i].status === '1' || data[i].status === '2' || data[i].status === '3') {
          this.message('预制发票号: '+data[i].billCode+' 状态不是待开票，请选择待开票的数据', 'warning')
        return false
        }
        if ((data[i].autoRemark === '1' && data[i].remark == null) || (data[i].autoRemark === '1' && trimSpace(data[i].remark) === '')) {
            this.message('请填写备注', 'warning')
            return false
        }
      }
      return true
    },
    judgeInvoiceType (data) {
      const len = data.length
      for (let i = 0; i < len; i++) {
        if (data[i].status != '0' && data[i].status != '-1' && data[i].status !='3' ) {
            this.message('请选择待开票、上传失败和红字发票', 'warning')
            return false
        }
      }
      return true
    },
    editInvoice (val) {
      var vm = this;
      this.invoiceId=val.id;
      vm.backfillDisabled = false;
      this.$root.ajaxData('/purchase/tms/invoice/checkExists?id=' + val.id, {}, function (data) {
        if (data.statusCode === 40042) {
          // vm.ruleInvoiceNo = { required: true, message: '该输入项为必输项', trigger: 'blur' }
          // vm.ruleInvoiceCode = { required: true, message: '该输入项为必输项', trigger: 'blur' }
          vm.mate.mateHead.values = data.data
          return
        } else {
          vm.mate.mateHead.values = {}
          vm.$refs['form'].resetFields()
          vm.$set(vm.mate.mateHead.values, 'itemType', '1')
        }
      }, 'GET')
      this.dialogVisible = true
      this.rowId = val.id
    },

    //航信开票软件开票 发送开票指令
    hxOPenInvoice(invoiceStr) {
      console.log('data:' + invoiceStr)
      var URL = HX_INVOICE_URL;    //WebServer地址                   
      //创建异步对象
      //var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        
      var xmlhttp; 
      if(window.ActiveXObject)
      {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
      }else
      {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
      }  						 
        
      xmlhttp.open("POST", URL, false);
      xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=GB2312");
      xmlhttp.send(invoiceStr);
      //Tx1.value = Tx1.value + '\n' + xmlhttp.responseText;
      var content = xmlhttp.responseText;
      let jsonContent = JSON.parse(content).ENCMSG
      return jsonContent;
    },



    handleButton (btn) {
      var vm = this
      const row = { id: this.multipleSelection.map((r) => r.id) }
      let ids = row.id
      ids = ids.join()
      const len = this.multipleSelection.length;
      //开立航信专票
      if (btn.action === 'openHxZInvoice') {
        if(len>1){
          this.message('请勾选一条数据！','warning')
          return
        }
        this.$confirm('此操作是用于航信开票系统开票, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let idArr = []
          for (var i = 0; i < vm.multipleSelection.length; i++) {
            idArr.push(vm.multipleSelection[i].id)
          }
          vm.$root.ajaxData('/purchase/tms/invoice/checkPreInvoiceLine?autoInvoice=true',idArr, function (data) {
            if (data.statusCode === 40053) {
              vm.message(data.message + '商品名为空', 'warning')
              return
            }
            if (data.statusCode === 404) {
              vm.message(data.message + '税收分类代码为空', 'warning')
              return
            }
            if (data.statusCode === 40047) {
              vm.message(data.message + '税收分类代码不合法', 'warning')
              return
            }
            if (data.statusCode === 40049) {
              vm.message(data.message + '单位为空', 'warning')
              return
            }
            if (data.statusCode === 200) {
              const loading = vm.$loading({
                lock: true,
                text: '专用发票正在生成中，请稍等......',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              })
              vm.$root.ajaxData('/purchase/tms/invoice/hx/param/'+ids+'?invoiceType='+0, {}, function (data) {
                if(data.statusCode === 200){
                   //调用开票软件开票
                    var resultStr =  vm.hxOPenInvoice(data.data)
                    if('' == resultStr){
                      loading.close()
                      return
                    }else{
                      //调用接口生成进销项发票
                      let invoiceUrl = btn.url + ids + '/0'
                        vm.$root.ajaxData(invoiceUrl, resultStr, function (data) {
                        if(data.statusCode == 200){
                          loading.close()
                          vm.message('开票成功', 'success')
                          vm.$root.monitor({ url: '/purchase/tms/invoice/precast/list', method: 'GET' })
                        }else{
                          loading.close()
                          vm.message(data.message, 'warning')
                        }
                        return
                      }, 'POST')
                    }
                    loading.close()
                }else{
                  loading.close()
                  // 获取开票参数失败
                  vm.message(data.message, 'warning')
                return
                }
              }, 'GET')
              loading.close()
            }
          }, 'POST')

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消开票'
          });          
        });
      }
      //开立航信普票
      if (btn.action === 'openHxPInvoice') {
        if(len>1){
          this.message('请勾选一条数据！','warning')
          return false
        }
        this.$confirm('此操作是用于航信开票系统开普票, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let idArr = []
          for (var i = 0; i < vm.multipleSelection.length; i++) {
            idArr.push(vm.multipleSelection[i].id)
          }
          vm.$root.ajaxData('/purchase/tms/invoice/checkPreInvoiceLine?autoInvoice=true',idArr, function (data) {
            if (data.statusCode === 40053) {
              vm.message(data.message + '商品名为空', 'warning')
              return
            }
            if (data.statusCode === 404) {
              vm.message(data.message + '税收分类代码为空', 'warning')
              return
            }
            if (data.statusCode === 40047) {
              vm.message(data.message + '税收分类代码不合法', 'warning')
              return
            }
            if (data.statusCode === 40049) {
              vm.message(data.message + '单位为空', 'warning')
              return
            }
            if (data.statusCode === 200) {
              const loading = vm.$loading({
                lock: true,
                text: '普通发票正在生成中，请稍等......',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              })
              vm.$root.ajaxData('/purchase/tms/invoice/hx/param/'+ids+'?invoiceType='+2, {}, function (data) {
                if(data.statusCode === 200){
                   //调用开票软件开票
                    var resultStr =  vm.hxOPenInvoice(data.data)
                    if('' == resultStr){
                      loading.close()
                      return
                    }else{
                      //调用接口生成进销项发票
                      let invoiceUrl = btn.url + ids + '/2'
                        vm.$root.ajaxData(invoiceUrl, resultStr, function (data) {
                        if(data.statusCode == 200){
                          loading.close()
                          vm.message('开票成功', 'success')
                          vm.$root.monitor({ url: '/purchase/tms/invoice/precast/list', method: 'GET' })
                        }else{
                          loading.close()
                          vm.message(data.message, 'warning')
                        }
                        return
                      }, 'POST')
                    }
                    loading.close()
                }else{
                  loading.close()
                  // 获取开票参数失败
                  vm.message(data.message, 'warning')
                return
                }
              }, 'GET')
              loading.close()
            }
          }, 'POST')

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消开票'
          });          
        });
      }
      //作废航信发票
      if (btn.action === 'cancelHxInvoice') {
        if(len>1){
          this.message('请勾选一条数据！','warning')
          return false
        }
        this.$confirm('此操作是用于航信开票系统作废发票, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let idArr = []
          for (var i = 0; i < vm.multipleSelection.length; i++) {
            idArr.push(vm.multipleSelection[i].id)
          }
          const loading = vm.$loading({
            lock: true,
            text: '正在作废发票，请稍等......',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          vm.$root.ajaxData('/purchase/tms/invoice/hx/cancel/param/'+ids, {}, function (data) {
            if(data.statusCode === 200){
                //调用开票软件开票
                var resultStr =  vm.hxOPenInvoice(data.data)
                if('' == resultStr){
                  loading.close()
                  return
                }else{
                  //调用接口作废发票
                  let invoiceUrl = btn.url + ids
                    vm.$root.ajaxData(invoiceUrl, resultStr, function (data) {
                    if(data.statusCode == 200){
                      loading.close()
                      vm.message('发票作废成功', 'success')
                      vm.$root.monitor({ url: '/purchase/tms/invoice/precast/list', method: 'GET' })
                    }else{
                      loading.close()
                      vm.message(data.message, 'warning')
                    }
                    return
                  }, 'POST')
                }
                loading.close()
            }else{
              loading.close()
              // 获取开票参数失败
              vm.message(data.message, 'warning')
            return
            }
          }, 'GET')

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消作废发票'
          });          
        });
      }
      //打印航信发票
      if (btn.action === 'printHxInvoice') {
        if(len>1){
          this.message('请勾选一条数据！','warning')
          return false
        }
        var Base64 = require('js-base64').Base64
        const loading = vm.$loading({
          lock: true,
          text: '发票正在打印中，请稍等......',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        vm.$root.ajaxData('/purchase/tms/invoice/hx/print/'+ids + '/0', {}, function (data) {
          if(data.statusCode === 200){
              //调用开票软件打印发票
              var resultStr =  vm.hxOPenInvoice(data.data)
              if('' == resultStr){
                vm.message('打印发票失败', 'success')
                loading.close()
                return
              }else{
                var atobStr = Base64.decode(resultStr)
                let retcode = JSON.parse(atobStr).retcode
                let retmsg = JSON.parse(atobStr).retmsg
                loading.close()
                if('5011' !== retcode){
                  vm.message('打印发票失败', 'warning')
                }else{
                  vm.message('打印发票成功', 'success')
                }
              }
              loading.close()
          }else{
            loading.close()
            // 获取打印发票参数失败
            vm.message(data.message, 'warning')
          return
          }
        }, 'GET')
      }
      //打印航信发票清单
      if (btn.action === 'printHxDetailInvoice') {
        if(len>1){
          this.message('请勾选一条数据！','warning')
          return false
        }
        var Base64 = require('js-base64').Base64
        const loading = vm.$loading({
          lock: true,
          text: '发票清单正在打印中，请稍等......',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        vm.$root.ajaxData('/purchase/tms/invoice/hx/print/'+ids + '/1', {}, function (data) {
          if(data.statusCode === 200){
              //调用开票软件打印清单
              var resultStr =  vm.hxOPenInvoice(data.data)
              if('' == resultStr){
                vm.message('打印发票清单失败', 'success')
                loading.close()
                return
              }else{
               var atobStr = Base64.decode(resultStr)
                let retcode = JSON.parse(atobStr).retcode
                let retmsg = JSON.parse(atobStr).retmsg
                loading.close()
                if('5011' !== retcode){
                  vm.message('打印发票清单失败', 'warning')
                }else{
                  vm.message('打印发票清单成功', 'success')
                }
              }
              loading.close()
          }else{
            loading.close()
            // 获取打印清单参数失败
            vm.message(data.message, 'warning')
          return
          }
        }, 'GET')
      }
       /**
     * 开区块链电子发票
     */
      if (btn.action === 'openTxInvoice') {
        if(len>1){
          this.message('请勾选一条数据！','warning')
          return false
        }
        var vm = this
        let url = '/purchase/tms/invoice/tx/check/' + ids
        this.$root.ajaxData(url, {}, function (data) {
            if(data.statusCode == 200){
              const loading = vm.$loading({
                lock: true,
                text: '正在生成电子发票，请稍等......',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              })
              let invoiceUrl = btn.url + ids
              vm.$root.ajaxData(invoiceUrl, {}, function (data) {
                if(data.statusCode == 200){
                  vm.$root.monitor({ url: '/purchase/tms/invoice/precast/list', method: 'GET' })
                  loading.close()
                  vm.message('开票成功', 'success')
                }else{
                  loading.close()
                  vm.message(data.message, 'warning')
                }
                return
            }, 'GET')
            }else{
              vm.message(data.message, 'warning')
              return
            }
        }, 'GET')
      }
      /**
       * 验证区块链电子发票
       */
      if (btn.action === 'verifyTxInvoice'){
        if(len>1){
          this.message('请勾选一条数据！','warning')
          return false
        }
        var vm = this
        let url =  btn.url + ids
        let checkUrl = '/purchase/tms/invoice/tx/check/verify/' + ids
        this.$root.ajaxData(checkUrl, {}, function (data) {
          if(data.statusCode == 200){
              vm.$root.ajaxData(url, {}, function (data) {
                if(data.statusCode == 200){
                  vm.message('验票成功', 'success')
                }else{
                  vm.message(data.message, 'warning')
                }
                return
            }, 'GET')
            return
          }else{
              vm.message(data.message, 'warning')
            return
          }
        }, 'GET')

        
      }
      /**
       * 下载区块链电子发票
       */
      if (btn.action === 'prinTxInvoice'){
        if(len>1){
          this.message('请勾选一条数据！','warning')
          return false
        }
        var vm = this
        let checkUrl = '/purchase/tms/invoice/tx/check/download/' + ids + "?downLoadStatus="
        this.$root.ajaxData(checkUrl + "0", {}, function (data) {
          if(data.statusCode == 200){
              const loading = vm.$loading({
              lock: true,
              text: '正在下载电子发票，请稍等......',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            })
          
            var filename= '电子普通发票.pdf'
            vm.$http({
                url: API_GATEWAY + '/api' +  btn.url + ids,
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
                a.setAttribute('download',filename)
                a.click()
                URL.revokeObjectURL(objectUrl)
                //检测只能下载一次，更新下载次数
              
                this.$root.ajaxData(checkUrl + "1", {}, function (data) {
                  vm.$root.monitor({ url: '/purchase/tms/invoice/precast/list', method: 'GET' })
                }, 'GET')
              loading.close()
            },function(response){
                //错误处理
                loading.close()
                this.message('下载电子发票异常，请联系平台人员', 'warning')
            })
            return
          }else {
            vm.message(data.message, 'warning')
            return
          }
          
        }, 'GET')
      }
      // 删除发票
      if (btn.action === 'deletePreInvoice') {
        // 判断是不是待开票判断是不是待开票
       if (this.judgeInvoiceType(this.multipleSelection)) {
          let totalTime = 3;
          let label = btn.label;
          btn.label = `${label}(${totalTime}s)`;
          let clock = window.setInterval(() => {
            totalTime--
            btn.label = `${label}(${totalTime}s)`;
            if (totalTime < 0) {     //当倒计时小于0时清除定时器
              window.clearInterval(clock)
              btn.label = label;
              totalTime = 3
              this.$root.ajaxData('/purchase/tms/invoice/precast/batch/del', row.id, function (data) {
                if (data.statusCode ===40048) {
                  vm.message('存在已上传或已开票的数据,不能删除','error')
                  return
                }
                vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (result) {
                  vm.mate.mateList.rows = result.mate.mateList.rows
                }, 'GET')
              }, 'POST')
              }
          },1000)
        }
        return
      }
      // 上传开票数据
      if (btn.action === 'sendPreInvoice') {
        // 判断此租户的开票软件使用期是否过期
        var user = window.sessionStorage.getItem('user')
        vm.$root.ajaxData('/tenants/check/valid/key/' + JSON.parse(user).tenantId, {}, function (data) {
          // 
          var res = true
          if(data.data === undefined){
            res = true
          } else {
            res = false
          }
          if (res) {
            // 判断是不是待开票
            const statusFlag = vm.judgeInvoice(vm.multipleSelection)
            var id = []
            for (var i = 0; i < vm.multipleSelection.length; i++) {
              id.push(vm.multipleSelection[i].id)
            }
            if (statusFlag) {
              const flag = true
              if (flag) {
                    vm.$root.ajaxData('/purchase/tms/invoice/checkPreInvoiceLine?autoInvoice=true', id, function (data) {
                      if (data.statusCode === 40053) {
                        vm.message(data.message + '商品名为空', 'warning')
                        return
                      }
                      if (data.statusCode === 404) {
                        vm.message(data.message + '税收分类代码为空', 'warning')
                        return
                      }
                      if (data.statusCode === 40047) {
                        vm.message(data.message + '税收分类代码不合法', 'warning')
                        return
                      }
                      if (data.statusCode === 40049) {
                        vm.message(data.message + '单位为空', 'warning')
                        return
                      }
                      if (data.statusCode === 40055) {
                        vm.$confirm('请维护规格型号，'+ data.message +'超过了36个英文字符或者18个汉字，点击确定系统自动截取，点击取消用户手动截取', '提示', {
                          confirmButtonText: '确定',
                          cancelButtonText: '取消',
                          type: 'warning'
                        }).then(() => {
                          vm.invoiceList = true
                          vm.innerInvoiceList = true
                          let msg = vm.fphm();
                          if ( msg === 'error') {
                            vm.message('调用开票接口失败', 'warning')
                            vm.invoiceList = false
                            vm.innerInvoiceList = false
                            return
                          }else if (msg.indexOf('-1') !== -1 ) {
                            vm.message('请打开开票软件', 'warning')
                            vm.invoiceList = false
                            vm.innerInvoiceList = false
                            return
                          } else {
                            vm.invoiceCode = msg.split(";")[2]
                            vm.invoiceNo = msg.split(";")[3]
                          } 
                          vm.subModelName = true
                          return
                        }).catch(() => {
                          vm.invoiceList = false
                          vm.subModelName = false
                          return      
                        });
                      }
                      if (data.statusCode === 200) {
                            vm.invoiceList = true
                            vm.innerInvoiceList = true
                            let msg = vm.fphm();
                            if ( msg === 'error' ) {
                              vm.message('调用开票接口失败', 'warning')
                              vm.innerInvoiceList = false
                              vm.invoiceList = false
                              return
                            }else if (msg.indexOf('-1') !== -1 ) {
                              vm.message('请打开开票软件', 'warning')
                              vm.innerInvoiceList = false
                              vm.invoiceList = false
                              return
                            } else {
                              vm.invoiceCode = msg.split(";")[2]
                              vm.invoiceNo = msg.split(";")[3]
                              return
                            }
                      }
                    }, 'POST')
              }
            }
          } else {
            vm.message('您的开票软件使用时间已过期,请重新申请', 'warning')
          }
          
        })
       
        return
      }
      // 连接开票
      if (btn.action === 'connectPlatform') {
        // window.open(btn.url)
        // return
        var vm = this
        vm.$http({
            url: API_GATEWAY + '/open/purchase/tms/invoice/getky',
            method: 'GET',
            headers: {
                      'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
                      'X-Ca-Key': 'ZvoFcCEmI1RSDsNpBfS55CTlfDUC4jjbdR1g+offgVc=',
                      'X-Ca-Signature-Headers': 'X-Ca-Timestam',
                      'X-Ca-Timestamp': '1539947990',
                      'X-Ca-Signature': 'x30R5BbXD/FAMbow0AKl2/tsbTPlYJinhMTGpBdW4jc=',
                      'Content-Type': 'application/json'
                    },
            responseType: 'arraybuffer'
        }).then(function (response) {
            var blob = new Blob([response.data], { type: 'application/octet-stream' })
            var objectUrl = URL.createObjectURL(blob)
            var a = document.createElement('a')
            document.body.appendChild(a)
            a.setAttribute('style', 'display:none')
            a.setAttribute('href', objectUrl)
            a.setAttribute('download', "")
            a.click()
            URL.revokeObjectURL(objectUrl)
        })
      }
      // 刷新
      if (btn.action === 'shuaxin') {
        vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
          vm.mate.mateList.rows = data.mate.mateList.rows
        }, 'GET')
        vm.$root.ajaxData('/purchase/tms/invoice/checkPreInvoiceInfo', {}, function (data) {
        }, 'GET')
        return
      }
      // 查询开票结果
      if (btn.action === 'searchInvoice') {
        vm.$root.ajaxData(btn.url, {}, function (data) {
          if (data.statusCode === 200) {
            vm.message('操作成功', 'success')
          }
        }, 'GET')
        return
      }
      // 下载点金保理开票模板
      if (btn.action === 'downloadDjTemplate') {
        this.$http({
          url: API_GATEWAY + '/api' + btn.url,
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
            'Accept': 'application/json',
            'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf8'
          },
          responseType: 'arraybuffer'
        }).then(function (response) {
          var blob = new Blob([response.data], { type: 'application/vnd.ms -excel' })
          var objectUrl = URL.createObjectURL(blob)
          var a = document.createElement('a')
          document.body.appendChild(a)
          a.setAttribute('style', 'display:none')
          a.setAttribute('href', objectUrl)
          var filename = '点金保理开票数据模板.xlsx'
          a.setAttribute('download', filename)
          a.click()
          URL.revokeObjectURL(objectUrl)
        })
        return
      }
      //导入点金保理开票数据
      if (btn.action === 'importDjInvoiceData') {
          this.$refs.excelFile.click()
          this.title = '点金保理开票数据'
          return
      }
      // 非直连开票导入模板
      if (btn.action === 'importTemplate') {
          const rowt = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
          const invoiceStatus = this.judgeInvoiceType(this.multipleSelection)
          if(invoiceStatus) {
              var url = '/api/purchase/tms/invoice/importTemplate?type=1'
              var fileName = '非直连开票导入模板.xlsx'
              this.$http({
                  url: API_GATEWAY + url,
                  method: 'POST',
                  headers: this.headers,
                  params: vm.searchForm,
                  body: rowt.id,
                  responseType: 'arraybuffer'
              }).then(function (response) {
                  var blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
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
      }
      // 下载开票软件功能
      if (btn.action === 'downloadsoftware') {
        vm.$root.ajaxData('/purchase/tms/invoice/hx/check/download', {}, function (data) {
          if(data.statusCode === 200){
            const rowt = true ? { id: vm.multipleSelection.map((r) => r.id) } : {}
            const invoiceStatus = vm.judgeInvoiceType(vm.multipleSelection)
            if(invoiceStatus) {
              const loading = vm.$loading({
                lock: true,
                text: '正在下载航信开票软件，请稍等......',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              })
              var filename= '航信开票软件.zip'
              vm.$http({
                  url: API_GATEWAY + '/api' + btn.url,
                  method: 'GET',
                  headers: {
                    'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
                    'Accept': 'application/json',
                    'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
                    'Content-Type':'application/json'
                  },
                  responseType: 'arraybuffer'
              }).then(function (response) {
                  var blob = new Blob([response.data], {type: 'application/octet-stream'})
                  var objectUrl = URL.createObjectURL(blob)
                  var a = document.createElement('a')
                  document.body.appendChild(a)
                  a.setAttribute('style', 'display:none')
                  a.setAttribute('href', objectUrl)
                  a.setAttribute('download',filename)
                  a.click()
                  URL.revokeObjectURL(objectUrl)
                  loading.close()
                  vm.message('下载成功,请在开票前安装下载文件里的航信开票管理软件','success')
              },function(response){
                  loading.close()
                  vm.message('下载航信开票软件失败，请联系平台人员处理','warning')
              })
              return
            }
          }else{
            vm.message(data.message,'warning')
            return
          }
        }, 'GET')
      }
      //非直连开票导入功能
      if (btn.action === 'import') {
        this.$refs.excelFile.click()
        this.title = '导入非直连开票数据'
        return
      }
      //预制发票作废功能
      if (btn.action === 'cancel') {
        const data = this.multipleSelection;
        const len = this.multipleSelection.length;
        if(len>1){
          this.message('请勾选一条数据！','warning')
          return false
        }
        for (let i = 0; i < len; i++) {
          if (data[i].status != '1' && data[i].status != '2') {
            this.message('请选择已上传、已开票的发票','error')
            return false
          }
          if(data[i].transferStatus == '1' ||
            data[i].transferStatus == '2' ||
            data[i].transferStatus == '3'||
            data[i].transferStatus == '5' ||
            data[i].transferStatus == '6'){
            this.message('发票号为:' + data[i].billCode + '的预制发票已生成了交接单，不可作废','error')
            return false
          }
          // 已生成应付发票，不允许作废 2020-07-23
          if(data[i].settleState === '8'){
            this.message('已生成应付发票，不允许作废','error');
            return
          }
        }
        this.$confirm('请确认已经在开票软件中作废了对应发票，再点该作废按钮, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //作废功能
          vm.$root.ajaxData(btn.url+ids, {}, function (data) {
            if (data.statusCode === 200) {
              vm.message('操作成功', 'success')
              vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
                vm.mate.mateList.rows = data.mate.mateList.rows
              }, 'GET')
              vm.$root.ajaxData('/purchase/tms/invoice/checkPreInvoiceInfo', {}, function (data) {}, 'GET')
              return
            }else if(data.statusCode === 500){
              vm.message(data.message, 'error')
            }
          }, 'GET')
          vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
            vm.mate.mateList.rows = data.mate.mateList.rows
          }, 'GET')
        }).catch(() => {
          this.message('已取消作废', 'info')
        });


      }
      //手动开票功能
      if (btn.action === 'makeInvoiceByHand') {//导出开票
        const rowt = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        const data = this.multipleSelection;
        for (let i = 0; i < data.length; i++) {
          var status = data[i].status
          if (data[i].status != '-1'&&data[i].status != '0' && data[i].status != '3' && data[i].status != '4') {
            this.message('请选择上传失败、待开票、红字、待重新开票的发票','error')
            return false
          }
        }
        //检查预制发票明细行
        var vm = this

        if (status == 1 || status == 2) {
          vm.editFlag = true
        } else {
          vm.editFlag = false
        }
        vm.showFlag = true
        
        vm.$root.ajaxData(vm.mate.mateList.url + '/' + row.id, {}, function (data) {
          vm.mate.mateLineList.lineColumns = data
        }, 'GET')
        this.$root.ajaxData('/purchase/tms/invoice/checkPreInvoiceLine', rowt.id, function (data) {
            if (data.statusCode === 40054) {//页面滑动至底部最下面
              vm.$alert('税收分类代码版本号不能为空,请在开票规则中添加','', {
              confirmButtonText: '确定',
              callback: action => {
                  document.getElementById('end').scrollIntoView(true)
                }
              });
              return
            }
            if (data.statusCode === 40053) {
                vm.$msgbox({
                  title: '提示',
                  message: data.message + '商品名为空',
                  showCancelButton: false,
                  confirmButtonText: '确定',
                }).then(action => {
                  document.getElementById('end').scrollIntoView(true)
                });
              return
            }
            if (data.statusCode === 404) {
                vm.$msgbox({
                  title: '提示',
                  message: data.message + '税收分类代码为空',
                  showCancelButton: false,
                  confirmButtonText: '确定',
                }).then(action => {
                  document.getElementById('end').scrollIntoView(true)
                });
              return
            }
            if (data.statusCode === 40047) {
              vm.$msgbox({
                  title: '提示',
                  message: data.message + '税收分类代码不合法',
                  showCancelButton: false,
                  confirmButtonText: '确定',
                }).then(action => {
                  document.getElementById('end').scrollIntoView(true)
                });
              return
            }
            if (data.statusCode === 40049) {
              vm.$msgbox({
                  title: '提示',
                  message: data.message + '单位为空',
                  showCancelButton: false,
                  confirmButtonText: '确定',
                }).then(action => {
                  document.getElementById('end').scrollIntoView(true)
                });
              return
            }
            if (data.statusCode === 40055) {
              document.getElementById('end').scrollIntoView(true)
                vm.$confirm('请维护规格型号，不能超过36个英文字符或者18个汉字，是否继续？', '提示', {
                  confirmButtonText: '确定',
                  type: 'warning'
                }).then(() => {
                  vm.$http({
                    url: API_GATEWAY + '/api/purchase/tms/invoice/makeInvoiceByHand',
                    method: 'POST',
                    headers: vm.headers,
                    responseType: 'arraybuffer',
                    body: rowt.id,
                }).then(function (response) {
                    var blob = new Blob([response.data], { type: 'application/xml' })
                    var objectUrl = URL.createObjectURL(blob)
                    var a = document.createElement('a')
                    document.body.appendChild(a)
                    a.setAttribute('style', 'display:none')
                    a.setAttribute('href', objectUrl)
                    var filename = 'fps.xml'
                    a.setAttribute('download', filename)
                    a.click()
                    URL.revokeObjectURL(objectUrl)
                })
                });    
            }
            if (data.statusCode === 200) {
                vm.$http({
                    url: API_GATEWAY + '/api/purchase/tms/invoice/makeInvoiceByHand',
                    method: 'POST',
                    headers: vm.headers,
                    responseType: 'arraybuffer',
                    body: rowt.id,
                }).then(function (response) {
                    var blob = new Blob([response.data], { type: 'application/xml' })
                    var objectUrl = URL.createObjectURL(blob)
                    var a = document.createElement('a')
                    document.body.appendChild(a)
                    a.setAttribute('style', 'display:none')
                    a.setAttribute('href', objectUrl)
                    var filename = 'fps.xml'
                    a.setAttribute('download', filename)
                    a.click()
                    URL.revokeObjectURL(objectUrl)
                })
                return
            }
            return
        }, 'POST')
        }
        //启动开票exe 启动开票插件
        if (btn.action === 'start'){
          window.location.href = 'InvoiceSoftware://'
        }
        //关闭开票exe 关闭开票插件
        if (btn.action === 'shutdown'){
          window.location.href = 'InvoiceSoftwareShutdown://'
        }
    },

    //发送开票WEBSEVICE请求
    kpjk1(Lx,xDs) {
      var URL = INVOICE_URL;    //WebServer地址
            var data;
      data = '<?xml version="1.0"?>';
      data = data + '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" '; 
      data = data + 'xmlns:xsd="http://www.w3.org/2001/XMLSchema" ';
      data = data + 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ';
      data = data + 'xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/">';
      data = data + '<SOAP-ENV:Body SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">';
      data = data + '<NS1:kpjk1 xmlns:NS1="urn:fwkpjk_WIntf-Ifwkpjk_W">';
      data = data + '<Lx xsi:type="xsd:int">' + Lx + '</Lx>';
      data = data + '<xDs xsi:type="xsd:string">' + xDs + '</xDs>';
      data = data + '</NS1:kpjk1>';
      data = data + '</SOAP-ENV:Body></SOAP-ENV:Envelope>';                        
            //创建异步对象
            //var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
						 
						 var xmlhttp; 
				     if(window.ActiveXObject)
				     {// code for IE6, IE5
				        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
				     }else
				     {// code for IE7+, Firefox, Chrome, Opera, Safari
				        xmlhttp = new XMLHttpRequest();
				     }  						 
						 
            xmlhttp.open("POST", URL, false);
            xmlhttp.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
            xmlhttp.send(data);

            //Tx1.value = Tx1.value + '\n' + xmlhttp.responseText;
						
						data = xmlhttp.responseText;
						
						var s1 = '<return xsi:type="xsd:string">';
						
						var i = data.lastIndexOf(s1);
						var i1 = data.lastIndexOf('</return>');
						var rstr = '';
						if (i>0 && i1>0 && i1>i)
						{
							rstr = data.substring(i + s1.length,i1);
						}
						return rstr;
    },
    //上传开票数据
    dru(invoiceHeader) {     //////////////////////////////导入明细
        var vm = this
        var s2 = '||';   /////////字段分隔符
        var s1; 
        //成功返回 0
        /////////////////////////////导入发票主表
        //0 明细条数,单据编号,购方编号
        //3 购方名称,税号
        //5 地址电话，银行账号
        //7 金额,税额,税率
        //10 收款人,复核人
        //12 销方账号,主要商品名称
        //14 清单模式(0~8 设定明细条数超过转清单，0 始终是清单模式)    
        //15 对应蓝字发票号码,对应蓝字发票代码
        //17
        //18 0税类型  (0 0%   1 免税      2 不征税)                
        //注意： 明细条数、总金额、总税额

        //查改预制发票头所有的行
        vm.$http({
        url: API_GATEWAY + '/api/purchase/invoice/line/all/'+invoiceHeader.id,
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
          'Accept': 'application/json',
          'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
          'Content-Type': 'application/json;charset=utf8'
        },
        responseType: 'application/json'
        }).then(function (response) {
          var lineData = response.body
          s1 = lineData.length + s2 + invoiceHeader.billCode + s2 + '123' + s2
                + invoiceHeader.buyer + s2 + invoiceHeader.buyerTaxNumber + s2
                + invoiceHeader.buyerAddress +'  '+ invoiceHeader.buyerPhone + s2 + invoiceHeader.buyerBankAccount + s2
                + invoiceHeader.totalPriceTax + s2 + '' + s2 + '' + s2
                + invoiceHeader.invoiceRulePayee + s2 + invoiceHeader.invoiceRuleChecker + s2
                + '' + s2 + lineData[0].itemName + s2 + '8';
        // s1 = '2' + s2 + 'X150208001' + s2 + '123' + s2
        //         + '开票测试1' + s2 + '310106666888866' + s2
        //         + '购方地址电话123456' + s2 + '购方银行账号12345678' + s2
        //         + '234' + s2 + '' + s2 + '' + s2
        //         + '收款人' + s2 + '复核人' + s2
        //         + '' + s2 + '商品1' + s2 + '8';
        let msg = this.kpjk1(1, s1)
        if ( msg === 'error') {
          this.message('调用开票接口失败', 'warning')
          this.loading = false
          return
        }
        if (msg.indexOf('-1')!== -1) {
          this.message('请打开开票软件', 'warning')
          this.loading = false
          return
        }
        if(msg.split(";")[1] != ""){
          this.message(msg.split(";")[1], 'warning')
          this.loading = false
          return
        }
        if(invoiceHeader.remark) {
          s1 = invoiceHeader.remark;
        }else {
          s1 = ''
        }
        msg = this.kpjk1(2, s1)
        if ( msg === 'error') {
          this.message('调用开票接口失败', 'warning')
          this.loading = false
          return
        }
        if (msg.indexOf('-1') !== -1) {
          this.message('请打开开票软件', 'warning')
          this.loading = false
          return
        }
        if(msg.split(";")[1] != ""){
          this.message(msg.split(";")[1], 'warning')
          this.loading = false
          return
        }
        /////////////////////////////////////////导入发票明细
        //0 商品编号,商品名称，规格型号，计量单位
        //4 数量,单价,含税标志(0-不含税单价 1-含税单价  2-不含税单价＋含税金额 3-含税单价＋含税金额)
        //7 金额,税率,税额
        //10 发票行性质,序号,商品税目  (发票行性质：0－正常发票行；3－被折扣行；4－折扣行)
        //13 税务编码(19位)
        //注意： 发票行性质,序号
        for (var i = 0; i < lineData.length; i++) {
          if (this.subModelName) {
            s1 = '' + s2 + lineData[i].itemName + s2 + this.getByteVal(lineData[i].modelName,36) + s2 + lineData[i].unit + s2
                + lineData[i].quantity + s2 + lineData[i].price + s2 + '0' + s2
                + lineData[i].totalPrice + s2 + lineData[i].taxRate + s2 + lineData[i].totalTax + s2
                + '0' + s2 + lineData[i].lineNo + s2 + '4001' + s2 + lineData[i].classCode;
          }else {
            s1 = '' + s2 + lineData[i].itemName + s2 + lineData[i].modelName.trim() + s2 + lineData[i].unit + s2
                + lineData[i].quantity + s2 + lineData[i].price + s2 + '0' + s2
                + lineData[i].totalPrice + s2 + lineData[i].taxRate + s2 + lineData[i].totalTax + s2
                + '0' + s2 + lineData[i].lineNo + s2 + '4001' + s2 + lineData[i].classCode;
          }
          msg = this.kpjk1(3, s1)
          if ( msg === 'error') {
            this.loading = false
            return
          }
          if (msg.indexOf('-1') !== -1) {
            this.message('请打开开票软件', 'warning')
            this.loading = false
            return
          }
          if(msg.split(";")[1] != ""){
            this.message(msg.split(";")[1], 'warning')
            this.loading = false
            return
        }
        }
        msg = this.kpjk1(4, '')
        if ( msg === 'error') {
          this.message('调用开票接口失败', 'warning')
          this.loading = false
          return
        }
        if (msg.indexOf('-1') !== -1 ) {
          this.message('请打开开票软件', 'warning')
          this.loading = false
          return
        }
        if(msg.split(";")[1] != ""){
          this.message(msg.split(";")[1], 'warning')
          this.loading = false
          return
        }
        this.kp(invoiceHeader,msg);
        })
    },
    //开票接口
    kp(invoiceHeader,thisInovoiceMsg) {
       var vm = this
      let msg = this.kpjk1(5,'')
       if ( msg === 'error') {
          this.message('调用开票接口失败', 'warning')
          this.loading = false
          return
        }else if (msg.indexOf('-1') !== -1 ) {
          this.message('请打开开票软件', 'warning')
          this.loading = false
          return
        } else if (msg.indexOf('增值税专用发票') !== -1){
          if(thisInovoiceMsg.split(";")[2]!==this.invoiceCode || thisInovoiceMsg.split(";")[3]!==this.invoiceNo) {
            this.message('开出的纸质发票号、发票代码和系统的发票号、发票代码不一致，请重新勾选,导入', 'warning')
            this.innerInvoiceList = false
            this.invoiceList = false
            this.loading = false
            this.count = 0
            return
          }else {
          //调用接口更新状态 发票代码、发票号码、开票时间、新增销项发票
          this.$root.ajaxData('/purchase/invoice/update/uploadMsg?uploadMsg='+thisInovoiceMsg, invoiceHeader, function (data) {
                if(data.statusCode === 200){
                    vm.loading = false
                    //开票列表中状态为已开票
                    vm.multipleSelection[vm.count].status = 2
                    //计数 如果小于勾选的数量，继续打开页面 调用查询发票号码接口
                    vm.count++
                    if(vm.count<vm.multipleSelection.length){
                      let msg = vm.fphm()
                      vm.invoiceCode = msg.split(";")[2]
                      vm.invoiceNo = msg.split(";")[3]
                      vm.message('开票成功', 'success')
                    }else {
                      vm.innerInvoiceList = false
                      vm.invoiceList = false
                      vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
                      vm.mate.mateList.rows = data.mate.mateList.rows
                      }, 'GET')
                      vm.message('开票成功', 'success')
                      vm.count = 0
                      return
                    }
                }else{
                    vm.innerInvoiceList = false
                    vm.invoiceList = false
                    vm.loading = false
                    vm.message('更新发票信息失败', 'error')
                    return
                }
            }, 'POST')
            }
       }
    },
    // 开票之前查询即将开出的发票的发票号和发票代码的接口
    fphm() {
      var vm = this
      let msg =  this.kpjk1(14,'10,0')
      return msg
    },
    fileUpload (file){
      var vm = this
      var formdata = new FormData()
      formdata.append('file', file.target.files[0])
      var url = ''
      if (file.target.files[0].name.indexOf('点金保理') !== -1) {
        url = API_GATEWAY + '/api/purchase/tms/invoice/importDjInvoiceData'
      }else {
        url = API_GATEWAY + '/api/purchase/tms/invoice/import'
      }
      this.$http({
          url: url,
          method: 'POST',
          body: formdata,
          responseType: 'application/json'
      }).then(function (response) {
          vm.$refs.excelFile.value = ''
          if(response.data!=null){
              if(response.data.data.failed!=0){
                  vm.message('成功' + response.data.data.success + '条,失败' + response.data.data.failed + '条，请检查发票号和不含税金额！', 'warning')
              }else{
                  vm.message('成功' + response.data.data.success + '条', 'success')
              }
          }
          setTimeout(function () {
              vm.$root.monitor({ url: '/purchase/tms/invoice/precast/list' })
          }, 1000)
      })
    },
    //截取中英混合的字符串 一个汉字算两个字节 中文状态下的符号也算两个字节
    getByteVal(val, max) {
      var returnValue = '';
      var byteValLen = 0;
      for (var i = 0; i < val.length; i++) {
          if (val[i].match(/[^\x00-\xff]/ig) != null)
          byteValLen += 2;
          else
          byteValLen += 1;
          if (byteValLen > max)
          break;
          returnValue += val[i];
      }
      return returnValue.trim()
    },
    rowSelect () {
      this.mate.mateList.rows.forEach(row => {
        let select = (row.id && this.mate.mateList.selected && this.mate.mateList.selected.findIndex(id => id == row.id) !== -1)
        this.$refs.multipleTable.toggleRowSelection(row, (select === true))
      })
    },
    sortChange: function (sort) {
    },
    formatter (field) {
      return function (row, col) {
        if (field.switch) {
          return field.switch[row[col.property]]
        }
        return row[col.property]
      }
    },
    toUriParams (data) {
      return Object.keys(data).filter(i => !!data[i]).map(i => i + '=' + data[i]).join('&')
    }
  }
}
</script>

<style lang="scss" scoped>
.PreInvoice {
  .el-dropdown-link {
      cursor: pointer;
      color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .right-box {
      display: flex;
  }
  .nav-aside{
    position: relative;
    .myOrder {
      cursor: pointer;
    }
  }
  .nav-aside > li {
    display: inline-block;
    position: relative;
    padding: 5px 10px;
    margin: 0 10px;
    color: #333;
    .nav-div {
      display: none;
    }
    a {
      color :#333;
    }
  }
  .nav-aside > li:first-child > i{
    display: inline-block;
    position: relative;
    width: 6px;
    height: 6px;
    margin-left: 5px;
    border-right: 1px solid #333;
    border-bottom: 1px solid #333;
    transform: rotate(45deg);
    top: -3px;
  }
  .nav-aside > li:first-child ul{
    background-color: #fff;
    position: absolute;
    z-index: 1000;
    top: 29px;
    left: 0px;
    width: 260px;
    box-shadow: 0 0 2px 3px rgba(0, 0, 0, .1);
    font-size: 0;
    li {
      display: inline-block;
      width: 50%;
      height: 40px;
      line-height: 30px;
      padding: 5px 15px;
      cursor: pointer;
      font-size: 14px;
    }
  }
  .nav-aside > li:first-child:hover > i {
    transform: rotate(-135deg);
    top: 0px;
  }
  .nav-aside > li:first-child:hover ul {
    display: block;
    li:hover{
      background-color: #f7f7f7;
    }
  }
  .nav-aside > li:hover {
    background: #fff;
    box-shadow: 0 0 2px 3px rgba(0, 0, 0, .1);
  }
  .boxer {
    display: block;
    margin-bottom: 40px;
  }
  .mp {
    display: block;
    margin-top: 40px;
  }
  .page {
    margin-top: 20px;
  }
  .el-form--inline .el-form-item {
    margin-bottom: 0
  }
  .el-form-item {
    margin: 0;
  }
  .el-form-item__content {
    line-height: 1rem;
  }
  .el-table .cell, .el-table th>div {
    padding-right: 0;
  }
  .blank{
    float:left;
    margin-left:10px;
    margin-bottom: 30px;
  }
  .leftMargin{
    float:left;
    margin-left:10px;
  }
  .button{
    margin-top:10px;
  }
  .checkboxClass{
    width: 30%;
    padding-bottom: 10px;
    box-sizing: border-box;
    margin-left: 15px;
  }
  .detailLine{
    margin-top: 40px;
    margin-bottom: 30px;
    position: relative;
  }
  .definedLine{
    position: absolute;
    right: 0px;
  }
  .tableTop{
    position: absolute;
    margin-bottom: 50px;
  }
  .query {
    margin-bottom: 10px
  }
  .smallquery {
    margin-bottom: 0px;
  }
  .el-table td, .el-table th {
    height: 30px;
  }
  .detailTable{
    margin-top: 40px;
  }
  .leftMargin{
    float:left;
    margin-left:10px;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 100%;
}
  .el-select {
  width: 100%;
}
  .main-block .search {
      display: inline-block;
      margin-left: 30px;
      margin-top: -13px;
  }
  .total {
    float:right;
    margin-top: 10px;
    margin-right: 40px;
    margin-bottom: 30px;
    font-size: 14px;
  }
  .el-dialog__header {
    padding: 10px 10px 0;
  }
  .el-dialog__body {
    padding: 10px 10px;
  }
  .detailTable{
    margin-top: 20px;
  }
  .dialog-footer {
  position: relative;
  left: 120px;
  top: 10px;
  margin-bottom: 10px;
  button {
    cursor: pointer;
  }
}
  th {
    background-color: #e6e7eb;
    color: #303030;
    font-weight: 700;
  }
  .ct {
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
  }
}
</style>
<style lang="scss">
.InvoiceConfirm {
  .el-input--mini .el-input__inner {
    height: 28px;
    line-height: 28px;
    width: 120px;
  }
}
.el-form--inline .el-form-item {
  margin-bottom: 0
}
.el-form-item {
  margin: 0;
}
.el-form-item__content {
  line-height: 1rem;
}
.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 100%;
}
.el-select {
  width: 100%;
}
.invoiceDetail{
  .el-form-item {
   margin-bottom:18px !important;
  }
}
.PreInvoice{
  th {
    background-color: #e6e7eb;
    color: #303030;
    font-weight: 700;
  }
}
// #generalTicketInvoice{
//       display:none;
    
//   }
</style>
