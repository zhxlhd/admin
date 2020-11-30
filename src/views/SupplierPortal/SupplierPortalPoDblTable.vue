<template>
<div>
  <div class="query" style="margin-bottom:20px">
    <el-row :gutter="20">
      <el-col :sm="6" :md="4" :lg="4">
        <el-select clearable v-model="companyNameId" placeholder="请选择客户名称" @visible-change="visibleChangeCompany" @change="changeCompany" size="mini">
          <el-option :label="item.label" :value="item.label" v-for="(item,index) of companySelect" :key="index"></el-option>
        </el-select>
      </el-col>
      <el-col :sm="6" :md="4" :lg="4">
        <el-input clearable v-model="opNum" placeholder="请填写客户po"  size="mini"></el-input>
        
      </el-col>
      <el-col :sm="6" :md="4" :lg="4">
        <el-select clearable v-model="poSelect" placeholder="请选择查询参数"  size="mini">
          <el-option :label="item.label" :value="item.value" v-for="(item,index) of poSelectOptions" :key="index"></el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
  <Boxer :mate="mate.mateList" :mateSearch="mate.mateSearch" :hasSelected="hasSelected" @action="handleButton" ref="Boxer" :msgBoxButton="msgBoxButton">
    <span slot="search" class="leftMargin">
      <search-form v-if="mate.mateList.essearch" :essearch="mate.mateList.essearch" @essearch="todoEssearch">  </search-form>
      <Formor v-else-if="mate.mateList.search" :mate="mate.mateList.search" :search="search" class="leftFloat" :word="word"></Formor>
    </span>
    
    <div slot="main">
      <el-row>
        <el-col :span="24">
          <el-table size="mini" highlight-current-row @row-click="rowClick" ref="table" :data="mate.mateList.rows" border  @selection-change="handleSelectionChange" @sort-change="sortChange" max-height="500" style="width: 100%;">
              <el-table-column fixed="left" type="selection" width="50"></el-table-column>
              <el-table-column  v-for="(col,index) of mate.mateList.columns" :key="index" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip :formatter="col.formatter">
              </el-table-column>
              <el-table-column label="操作" fixed="right" :width="actionWidth" v-if="mate.mateList.actions">
                <template slot-scope="scope">
                  <k-btn v-for="(act,index) of mate.mateList.actions" :key="index" size="mini" :act="act" :icon="act.icon" :row="scope.row" @action="confirm"></k-btn>
                </template>
              </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" class="page" v-if="mate.mateList.size > 0">
      <el-col :span="12">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="mate.mateList.page"
            layout="total, prev, pager, next, sizes"
            :total="mate.mateList.total"
            :page-sizes ="[5, 10, 15, 20, 50]"
            :page-size="pageSize">
        </el-pagination>
      </el-col>
      </el-row>
    </div>
  </Boxer>
  <!--下面的明细表格-->
  <template>
    <div class="priceDetailLine">
      <el-table fit highlight-current-row size="mini" v-if="showFlag" :data="mate.mateList.lineRows" border style="width: 100%;" class="DblTableOrder" >
        <el-table-column show-overflow-tooltip v-if="lineColumns['lineNum'].isShow" :label="lineColumns['lineNum'].label" :prop="lineColumns['lineNum'].name" :min-width="lineColumns['lineNum'].width"></el-table-column>
        <el-table-column show-overflow-tooltip v-if="lineColumns['subCode'].isShow" :label="lineColumns['subCode'].label" :prop="lineColumns['subCode'].name" :min-width="lineColumns['subCode'].width"></el-table-column>
        <el-table-column show-overflow-tooltip v-if="lineColumns['materialName'].isShow" :label="lineColumns['materialName'].label" :prop="lineColumns['materialName'].name" :min-width="lineColumns['materialName'].width"></el-table-column>
        <el-table-column show-overflow-tooltip v-if="lineColumns['category'].isShow" :label="lineColumns['category'].label" :prop="lineColumns['category'].name" :min-width="lineColumns['category'].width"></el-table-column>
        <el-table-column show-overflow-tooltip v-if="lineColumns['priceTax'].isShow" :formatter="lineColumns['priceTax'].formatter" :label="lineColumns['priceTax'].label" :prop="lineColumns['priceTax'].name" :min-width="lineColumns['priceTax'].width"></el-table-column>
        <el-table-column show-overflow-tooltip v-if="lineColumns['price'].isShow" :formatter="lineColumns['price'].formatter" :label="lineColumns['price'].label" :prop="lineColumns['price'].name" :min-width="lineColumns['price'].width"></el-table-column>
        <el-table-column show-overflow-tooltip v-if="lineColumns['qty'].isShow" :label="lineColumns['qty'].label" :prop="lineColumns['qty'].name" :min-width="lineColumns['qty'].width"></el-table-column>
        <el-table-column show-overflow-tooltip v-if="lineColumns['unit'].isShow" :label="lineColumns['unit'].label" :prop="lineColumns['unit'].name" :min-width="lineColumns['unit'].width"></el-table-column>
        <el-table-column show-overflow-tooltip v-if="lineColumns['money'].isShow" :label="lineColumns['money'].label" :prop="lineColumns['money'].name" :min-width="lineColumns['money'].width"></el-table-column>
        <!-- <el-table-column show-overflow-tooltip v-if="lineColumns['effective'].isShow" :label="lineColumns['effective'].label" :prop="lineColumns['effective'].name" :min-width="lineColumns['effective'].width" :formatter="lineColumns['effective'].formatter"></el-table-column> -->
        <el-table-column show-overflow-tooltip v-if="lineColumns['lineStatus'].isShow" :label="lineColumns['lineStatus'].label" :prop="lineColumns['lineStatus'].name" :min-width="lineColumns['lineStatus'].width" :formatter="lineColumns['lineStatus'].formatter"></el-table-column>
        <el-table-column show-overflow-tooltip v-if="lineColumns['remark'].isShow" :label="lineColumns['remark'].label" :prop="lineColumns['remark'].name" :min-width="lineColumns['remark'].width"></el-table-column>
        <el-table-column show-overflow-tooltip v-if="lineColumns['changeInstructions'].isShow" :label="lineColumns['changeInstructions'].label" :prop="lineColumns['changeInstructions'].name" :min-width="lineColumns['changeInstructions'].width">
          <template slot-scope="scope">
            <el-input :disabled="changeable" size="mini" @focus="focus" v-model="scope.row[lineColumns['changeInstructions'].name]"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" :width="actionWidth" >
            <template slot-scope="scope">
            <el-button size="mini"   @click="dispatch(scope.row.lineId)">发运信息</el-button>
            </template>
          </el-table-column>
      </el-table>
    </div>
  </template>
    <el-dialog title="查看详情" :visible.sync="dialogVisible"   width="80%">
      <el-row>
        <DialogForm :mate="mate.mateFormerHeader"  formModel="dialog" ></DialogForm>
      </el-row>
      <el-row>
        <template>
          <el-table size="mini" v-if="showFlag" :data="mate.mateList.lineRows" border style="width: 100%;" class="tableLine">
            <el-table-column show-overflow-tooltip v-if="lineColumns['lineNum'].isShow" :label="lineColumns['lineNum'].label" :prop="lineColumns['lineNum'].name" :min-width="lineColumns['lineNum'].width"></el-table-column>
            <el-table-column show-overflow-tooltip v-if="lineColumns['subCode'].isShow" :label="lineColumns['subCode'].label" :prop="lineColumns['subCode'].name" :min-width="lineColumns['subCode'].width"></el-table-column>
            <el-table-column show-overflow-tooltip v-if="lineColumns['materialName'].isShow" :label="lineColumns['materialName'].label" :prop="lineColumns['materialName'].name" :min-width="lineColumns['materialName'].width"></el-table-column>
            <el-table-column show-overflow-tooltip v-if="lineColumns['category'].isShow" :label="lineColumns['category'].label" :prop="lineColumns['category'].name" :min-width="lineColumns['category'].width"></el-table-column>
            <el-table-column show-overflow-tooltip v-if="lineColumns['priceTax'].isShow" :formatter="lineColumns['priceTax'].formatter" :label="lineColumns['priceTax'].label" :prop="lineColumns['priceTax'].name" :min-width="lineColumns['priceTax'].width"></el-table-column>
            <el-table-column show-overflow-tooltip v-if="lineColumns['qty'].isShow" :label="lineColumns['qty'].label" :prop="lineColumns['qty'].name" :min-width="lineColumns['qty'].width"></el-table-column>
            <el-table-column show-overflow-tooltip v-if="lineColumns['unit'].isShow" :label="lineColumns['unit'].label" :prop="lineColumns['unit'].name" :min-width="lineColumns['unit'].width"></el-table-column>
            <el-table-column show-overflow-tooltip v-if="lineColumns['money'].isShow" :label="lineColumns['money'].label" :prop="lineColumns['money'].name" :min-width="lineColumns['money'].width"></el-table-column>
            <el-table-column show-overflow-tooltip v-if="lineColumns['lineStatus'].isShow" :label="lineColumns['lineStatus'].label" :prop="lineColumns['lineStatus'].name" :min-width="lineColumns['lineStatus'].width" :formatter="lineColumns['lineStatus'].formatter"></el-table-column>
            <el-table-column show-overflow-tooltip v-if="lineColumns['remark'].isShow" :label="lineColumns['remark'].label" :prop="lineColumns['remark'].name" :min-width="lineColumns['remark'].width"></el-table-column>
            <el-table-column show-overflow-tooltip v-if="lineColumns['changeInstructions'].isShow" :label="lineColumns['changeInstructions'].label" :prop="lineColumns['changeInstructions'].name" :min-width="lineColumns['changeInstructions'].width"></el-table-column>
        </el-table>
        </template>
      </el-row>
    </el-dialog>

    <el-dialog title="打印模板选择" :visible.sync="dialogPrintVisible" width="40%">
      <div>
        <el-select v-model="printValue" placeholder="请选择" size="mini">
          <el-option
            v-for="(item,index) in printOptions"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <br/>
      <div style="text-align:center;margin-top:15px " >
        <el-button type="primary" size="mini" @click="closePrintDialog()">确认打印</el-button>
      </div>
    </el-dialog>

    <el-dialog title="查看发运信息" :visible.sync="dialogDespatchVisible"   width="80%">
        <template>
          <el-table size="mini" :data="despatchList" border style="width: 100%;">
            <el-table-column show-overflow-tooltip  v-for="(col,index) of mate.mateList.despatchList" :formatter="col.formatter" :key="index" :label="col.label" :prop="col.name" :min-width="col.width">
          </el-table-column>
          </el-table>
        </template>
    </el-dialog>
</div>
</template>

<script scoped>
import SearchForm from '../../components/SearchForm'
import { LANGS } from '../../i18n/lang'
import KBtn from '../../components/KBtn.vue'
import Boxer from '../../components/Boxer.vue'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
import FilterMixins from '@/mixins/FilterMixins'
import { API_GATEWAY } from '@/config/index.js'
export default {
  mixins: [ColumnFormatterMixin, FilterMixins],
  components: {
    SearchForm,
    KBtn,
    Boxer,
    Formor: function index (resolve) {
      require(['../../components/Formor.vue'], resolve)
    },
    DialogForm: function index (resolve) {
      require(['../../components/DialogForm.vue'], resolve)
    }
  },
  props: {
    mate: Object,
    mateFormerHeaderId: String
  },
  data () {
    return {
      requestChangeStatus: ['要求确认','已接受'], // 只有数组中的状态允许请求更改按钮操作
      pageSize: 5,
      currentPage: 1,
      multipleSelection: [],     // 点击table前面的框框，获取到的内容
      langs: LANGS,
      hasSelected: false,
      searchValues: {},
      page: 0,
      dialogDespatchVisible: false,
      despatchList: [],
      width: '',
      sortValues: {},
      action: null,
      tableData: [],
      word: this.$t('query'),
      showFlag: false,                    // 下面表格的开关
      object: {},                          // 放columns
      fit: false,
      valueStatus: '',
      dialogVisible: false,
      auditStatus: '',
      rowId: {},             // 点击table前面的框框
      lineColumns: {},
      despatchFlag: false,
      despatchListRows: [],
      lineRowsNum: 0,
      checkAll: false,
      checkedLabel: [],
      isIndeterminate: true,
      lineSelected: [],               // 存放全部的label
      lineSelectedDetail: [],         // 存放全部的明细行label
      msgBoxButton: true,
      dialogDetailLine: false,
      companyNameId: '',
      companySelect: [],
      opNum: '',                  // 这里是一个空字符串
      poSelect: '7',
      companyName: '',
      changeable: false,
      headers: {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
        'Accept': 'application/json',
        'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
        'Content-Type': 'application/json;charset=utf8'
      },      
      poSelectOptions: [
        {
          'label': '要确认的客户po',
          'value': '7'
        },
        {
          'label': '所有客户po',
          'value': ''
        },
        {
          'label': '变更正等待客户确认的客户po',
          'value': '5'
        },
        {
          'label': '批准',
          'value': '6'
        }
      ],
      activeOptions: [
        {
          'label': '1.接受',
          'value': '1'
        },
        {
          'label': '2.拒绝',
          'value': '2'
        },
        {
          'label': '3.请求更改',
          'value': '3'
        }
      ],
      dialogPrintVisible:false, //采购订单打印中英文选择对话框
      printValue:'ebs_pd_good_pricing_zh',
      printOptions: [{
        value: 'ebs_pd_good_pricing_zh',
        label: 'CUX_PO_采购订单打印模板(供应商)'
      }, {
        value: 'ebs_pd_good_pricing_en',
        label: ' CUX_PO_采购订单打印模板(英文)'
      }],
      rowData: {}
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
      this.filterValues(this.mate.mateList.despatchList)
      this.$nextTick(function () {
        this.rowSelect()
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
    this.filterValues(this.mate.mateList.despatchList)
    this.mate.mateList.lineColumns.map((i) => { this.lineColumns[i.name] = i })
    this.mate.mateFormerHeader.fields.map((i) => { this.object[i.name] = i })
  },
  mounted () {
    this.rowSelect()
    // this.showFlag = false
  },
  // 需要添加刷新消息
  methods: {
    focus () {
      if (!this.multipleSelection.length) {
        this.message('warning', '请在头信息中选择一行数据')
      }
    },
    changeCompany (val) {
      const vm = this
      vm.companyName = val
    },
    // 打开时获取客户的数据
    visibleChangeCompany (flag) {
      const vm = this
      if (flag) {
        if (this.companySelect.length === 0) {
          this.$root.ajaxData('/supplier-portal/po/customer/list', {}, function (data) {
            data.forEach(i => {
              vm.companySelect.push({ 'label': i.name, 'value': i.id })
            })
          }, 'GET')
        }
      }
    },
    updated () {
      this.showFlag = false
    },
    rowClick (row) {
      // 清空选择 20019-02-21
      this.$refs['table'].clearSelection()
      // 选中当前点击行 20019-02-21
      this.$refs['table'].toggleRowSelection(row)
      this.showFlag = true
      var vm = this
      if (row.state === '0' || row.state === '6') {
        this.changeable = false
      } else {
        this.changeable = true
      }
      var poNum =  row.poNum;
      this.$root.ajaxData('/supplier-portal/po/line/list?poNum=' + poNum, {}, function (data) {
        vm.mate.mateList.lineRows = data
      }, 'GET')
    },
    back () {
      this.dialogTableVisible = false
    },
    dispatch (lineId) {
      var vm = this
      this.dialogDespatchVisible = true
      this.$root.ajaxData('/supplier-portal/po/line/dispatch?lineId=' + lineId, {}, function (data) {
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
    confirm (act, row) {
      var vm = this
      this.rowData.id = row.id;
      this.rowData.customerName = row.customerName;
      this.rowData.ebsPoHeaderId = row.ebsPoHeaderId;
      if (act.action === 'addChild') {
        this.mate.mateFormerHeader.values = row
        this.dialogVisible = true
        return false
      }
      if (act.action === 'printOrder') {
        // this.dialogPrintVisible = true
        let url = API_GATEWAY + '/api/supplier-portal/print?reportName=po_report&poNum='+ row.poNum 
        vm.$http({
          url: url,
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
          // blob(size,type) Blob构造函数，接受两个参数。第一个参数是一个包含实际数据的数组，第二个参数是数据的类型
          var objectUrl = URL.createObjectURL(blob)
          var a = document.createElement('a')
          document.body.appendChild(a)
          a.setAttribute('style', 'display:none')
          a.setAttribute('href', objectUrl)
          //var windowOpen = window.open('/static/pdf/web/viewer.html?file=' + objectUrl)
          var windowOpen = window.open(objectUrl)
          if(windowOpen == null || typeof(windowOpen) === 'undefined'){
            this.$message({
              message: '采购订单预览界面被拦截,请检查浏览器设置',
              type: 'warning'
            })
          }
        })
        return
      }
      // 请求更改
      if(act.action === 'requestChange'){
        if(this.requestChangeStatus.includes(row.stateDescription)) {
          vm.$root.monitor({ url: act.url + row.poNum })
          return
        }else{
          let status = this.requestChangeStatus.join('、');
          this.$message({
            message: `只有${status}状态才允许更改`,
            type: 'warning'
          })
          return
        }
      }
    },
    closePrintDialog () {
      let url = '';
      let rowId = this.rowData.id;
      let value = this.printValue;
      // let ebsPoHeaderId = this.rowData.ebsPoHeaderId;
      url = API_GATEWAY + '/api/supplier-portal/po/print?reportName=po&poNum='+ poNum 
      var vm = this
      vm.$http({
        url: url,
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
        // blob(size,type) Blob构造函数，接受两个参数。第一个参数是一个包含实际数据的数组，第二个参数是数据的类型
        var objectUrl = URL.createObjectURL(blob)
        var a = document.createElement('a')
        document.body.appendChild(a)
        a.setAttribute('style', 'display:none')
        a.setAttribute('href', objectUrl)
        //var windowOpen = window.open('/static/pdf/web/viewer.html?file=' + objectUrl)
        var windowOpen = window.open(objectUrl)
        if(windowOpen == null || typeof(windowOpen) === 'undefined'){
          this.$message({
            message: '采购订单预览界面被拦截,请检查浏览器设置',
            type: 'warning'
          })
        }
      })
    },
    message (type, message) {
      this.$message({
        type: type,
        message: message
      })
    },
    handleButton (btn) {
      var poNums = "", poNumsArr = [];
      let multipleSelection = this.multipleSelection;
      for(var i=0; i < multipleSelection.length; i++){
        if(this.multipleSelection[i].poNum != null){
          poNumsArr.push(multipleSelection[i].poNum);
        }
      }
      // 数组转字符串拼接
      poNums = poNumsArr.join(",");
      var vm = this  
      //导出
      if (btn.action === 'exportPoHeaders') {
        this.$http({
            url: API_GATEWAY + '/api/supplier-portal/po/head/export?poNums='+ poNums,
            method: 'GET',
            responseType: 'arraybuffer',
            headers: this.headers,
        }).then(function (response) {
            var blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
            var objectUrl = URL.createObjectURL(blob)
            var a = document.createElement('a')
            document.body.appendChild(a)
            a.setAttribute('style', 'display:none')
            a.setAttribute('href', objectUrl)
            var filename = 'export.xlsx'
            a.setAttribute('download', filename)
            a.click()
            URL.revokeObjectURL(objectUrl)
        })
        return
      }
      const row = (btn.isApi || btn.ajax) ? { id: multipleSelection.map((r) => r.id) } : {}
      this.rowId = row
      // 查询
      if (btn.action === 'query') {
        if (!this.companyNameId) {
          this.message('warning', '请先选择客户名称')
          return
        }
        this.$root.ajaxData(`/supplier-portal/po/head/list/query?customerName=${this.companyName}&poNum=${this.opNum}&state=${this.poSelect}`, {}, function (data) {
          vm.mate.mateList.rows = data.mate.rows
          vm.mate.mateList.lineRows = []
          vm.mate.mateList.total = data.mate.total
        }, 'GET')
        return
      }
      // 除了查询不要选，其他的按钮都要选一条数据
      if (!this.multipleSelection.length === 1) {
        this.message('warning', '请选择一条数据!')
        return
      }
      let stateDescription = multipleSelection[0].stateDescription;
      let poNum = multipleSelection[0].poNum;
      let orgId = multipleSelection[0].orgId;
      const state = multipleSelection[0].state;
      const mate = {};
      mate.mateFormerHeader = multipleSelection[0];
      mate.mateList = this.mate.mateList.lineRows;
      // 整单接收
      if (btn.action === 'allReceive') {
        if (stateDescription === '要求确认'|| stateDescription === '已变更') {
          this.$root.ajaxData(`/supplier-portal/po/head/update?poNums=${poNums}&state=3&orgId=${orgId}`, {}, function () {
            vm.$root.monitor({ url: '/supplier-portal/po/head/list' })
          }, 'PUT')
          return
        } else {
          this.message('warning', '只允许对状态为要求确认或已变更的PO进行操作')
        }
        return
      }
      // 整单拒绝
      if (btn.action === 'allReject') {
        if (stateDescription === '要求确认'|| stateDescription === '已变更') {
          this.$root.ajaxData(`/supplier-portal/po/head/update?poNums=${poNums}&state=4&orgId=${orgId}`, {}, function () {
            vm.$root.monitor({ url: '/supplier-portal/po/head/list' })
          }, 'PUT')
          return
        } else {
          this.message('warning', '只允许对状态为要求确认或已变更的PO进行操作')
        }
        return
      }
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
    handleSizeChange (val) {
      this.pageSize = val
      this.getData('paging')
    },
    handleCurrentChange (val) {
      this.page = val
      this.getData('paging')
    },
    handleAction (act, row) {
      var vm = this
      this.$root.handleAction(act, row, function () {
        vm.getData()
      })
    },
    getData (flag) {
      let url = this.mate.mateList.dataApi
      let param = {
        search: this.searchValues,
        page: this.page,
        sort: this.sortValues
      }
      var vm = this
      url += '?customerName='+this.companyName+'&poNum='+this.opNum+'&state='+this.poSelect+'&' + 'search=' + encodeURIComponent(JSON.stringify(this.searchValues)) + '&' + (this.toUriParams(this.sortValues)) + '&pageNum=' + this.page + '&pageSize=' + this.pageSize
      param = null
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
    toUriParams (data) {
      return Object.keys(data).filter(i => !!data[i]).map(i => i + '=' + data[i]).join('&')
    }
  }
}
</script>

<style scoped>
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
    /* float:left; */
    display:inline-block;
  }
  .leftFloat div{
    /* float:left; */
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
  .select-button{
    margin-top: 20px;
  }
  .el-table td, .el-table th {
    height: 30px;
  }
  .priceDetailLine{
    margin-top: 50px;
    position: relative;
  }
  .priceLine{
    position: absolute;
    right: 0;
  }
  .tableLine{
    margin-top: 30px;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
  }
  .el-select {
    width: 100%;
  }
</style>
