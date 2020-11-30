<template>
<div>
<el-row :gutter="24">
  <el-col :span="24">
    <Boxer :mate="mate.mateList1"  :mateSearch="mate.mateSearch" :hasSelected="hasSelected" @action="handleButton" ref="Boxer" :msgBoxButton="msgBoxButton">
    <div slot="searchForm" class="leftMargin">
      <el-button  size="mini" type="primary" class="el-icon-search" @click="showSearchPopover">搜索</el-button>
    </div>
    <div slot="main">
      <div class="query">
        <el-row :gutter="20" v-show="showAdvancedSearchPopover">
          <el-form :model="mate.mateSearch.values" :inline="mate.inline">
            <el-col :sm="6" :md="4" :lg="4">
              <el-select clearable v-model="mate.mateSearch.values['name']" size="mini">
                <el-option :label="item.label" :value="item.value" v-for="item of titleOptions" :key="item.value"></el-option>
              </el-select>
            </el-col>
            <el-col :sm="6" :md="4" :lg="4">
              <el-select clearable v-model="mate.mateSearch.values['operator']" size="mini">
                <el-option :label="item.label" :value="item.value" v-for="item of operatorOptions" :key="item.value"></el-option>
              </el-select>
            </el-col>
            <el-col :sm="6" :md="4" :lg="4">
              <el-input clearable v-model="mate.mateSearch.values['value']" size="mini"></el-input>
            </el-col>
            <el-col :sm="6" :md="4" :lg="4">
              <div class="search">
                <el-button @click="query" size="mini">查询</el-button>
              </div>
            </el-col>
          </el-form>
        </el-row>
      </div>
        <el-table size="mini" max-height="500" type="index" ref="table" :data="mate.mateList1.rows" border  @selection-change="handleSelectionChange" @sort-change="sortChange" @row-dblclick="rowDblclick" style="width: 100%" >
              <el-table-column type="selection" width="50"></el-table-column>
              <!-- <el-table-column v-for="col of mate.mateList1.columns" :label="col.label" :prop="col.name" :width="col.width"></el-table-column> 
                不使用循环是为了使用下面的formatter方法
              -->
                <el-table-column  v-if="col.isShow" v-for="(col,index) of mate.mateList1.columns" v-bind:key="col.name+index" :formatter="col.formatter" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip>
              </el-table-column>
              <el-table-column  fixed="right" label="操作" :width="actionWidth" v-if="mate.mateList1.actions">
                <template slot-scope="scope">
                  <k-btn v-for="act of mate.mateList1.actions" v-bind:key="act.action" size="mini" :act="act" :icon="act.icon" :row="scope.row" @action="confirm"></k-btn>
                </template>
              </el-table-column>
          </el-table>
      <el-row type="flex" justify="center" class="page" >
      <el-col :span="12">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="mate.mateList1.page"
            layout="total,prev, pager, next,sizes"
            :total="mate.mateList1.total"
            :page-sizes ="[5, 10, 15, 20, 50]"
            :page-size="pageSize">
        </el-pagination>
      </el-col>
      </el-row>
    </div>
  </Boxer>
  </el-col>
</el-row>

<el-dialog title="供应商详情" :visible.sync="customerDetail" width="80%">
  <el-button size='mini' @click="prevClick" :disabled="this.prev" type="primary" class="prev_next">上一条</el-button>
  <el-button size='mini' @click="nextClick" :disabled="this.next" type="primary" class="prev_next">下一条</el-button>
  <el-row>
  <div>
    <el-form size='mini' :model="mate.mateFormer.values" :rules="rules" ref="ruleForm" :label-width="labelWidth" class="elForm" :label-position="labelPosition">
      <div class="clientAddMsg">
        <div v-for="(field,index) of mate.mateFormer.fields" class="clientAddMsgDiv" :key="index">
        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item class="el-form-item" :label="field.label" :prop="field.name" v-if="field.holder == 'text'">
            <el-input disabled v-model="mate.mateFormer.values[field.name]"></el-input>
          </el-form-item>
          </el-col>

           <el-col :sm="12" :md="8" :lg="8">
            <el-form-item class="el-form-item" :label="field.label" :prop="field.name" v-if="field.holder == 'textSupplier'">
              <el-input disabled v-model="mate.mateFormer.values[field.name]"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
          <el-form-item class="el-form-item" :label="field.label" :prop="field.name" v-if="field.holder == 'select'">
            <el-select clearable disabled v-model="mate.mateFormer.values[field.name]" :placeholder="field.placeholder">
              <el-option style="color:#000" :label="item.label" :value="item.value" v-for="(item,index) of field.options" :key="index"></el-option>
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item  :label="field.label" :prop="field.name" v-if="field.holder === 'country'">
              <el-input disabled v-model="mate.mateFormer.values[field.name]"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="field.label" v-if="field.holder === 'province'">
              <addrselect :disabledFlag="disabledFlag"
                  :initselectedvalue="initprovselectedvalue"
                  :addrs="provAddrs"
                  v-model="mate.mateFormer.values[field.name]"
                  @change="provChange"
                  class="select-31"
                  id="prov_select"
                  name="prov" lazy>
              </addrselect>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="field.label" v-if="field.holder === 'city'">
            <addrselect :disabledFlag="disabledFlag"
                :initselectedvalue="initcityselectedvalue"
                :addrs="cityAddrs"
                v-model="mate.mateFormer.values[field.name]"
                @change="cityChange"
                class="select-31"
                id="city_select"
                name="city" lazy>
            </addrselect>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="field.label" v-if="field.holder === 'county'">
              <addrselect :disabledFlag="disabledFlag"
                  :initselectedvalue="initregionselectedvalue"
                  :addrs="regionAddrs"
                  v-model="mate.mateFormer.values[field.name]"
                  @change="regionChange"
                  class="select-31"
                  id="region_select"
                  name="region" lazy>
                </addrselect>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item  :label="field.label" :prop="field.name" v-if="field.holder === 'cascaderC'">
              <el-input :options="optionsValue" disabled change-on-select v-model="mate.mateFormer.values[field.name]"></el-input>
            </el-form-item>
          </el-col>
        </div>
      </div>
    </el-form>
  </div>
  </el-row>

  <el-collapse v-model="activeName" accordion @change="handleCollapse" class="collapse">
    <el-collapse-item title="供应商地点信息" name="1">
      <el-tabs type="card" v-model="activeName1" @tab-click="handleClick">
        <el-tab-pane label="主要信息" name="1">
          <CTable :mate= "customerData.AddMainMsg" @rowClick="rowClickTable" :tableData="tableData1" :show="show"></CTable>
        </el-tab-pane>
        <el-tab-pane label="采购信息" :show="show" name="2">
          <CTable :mate= "customerData.AddPoMsg" @rowClick="rowClickTable" :tableData="tableData2"></CTable>
        </el-tab-pane>
        <el-tab-pane label="财务信息" name="3">
          <CTable :mate= "customerData.AddFaniMsg" @rowClick="rowClickTable" :tableData="tableData3" :show="show"></CTable>
        </el-tab-pane>
    </el-tabs>
    <h3 class="customerBank">供应商银行信息</h3>
    <CTable :mate= "customerData.BankMsg" :tableData="tableData4" :show="show"></CTable>
    <h3 class="customerContect">供应商联系人信息</h3>
    <CTable :mate= "customerData.customerMsg" :tableData="tableData5" :show="show"></CTable>
    </el-collapse-item>
    <el-collapse-item title="供应商附件信息" name="4">
      <CTable :mate= "customerData.fileMsg" :tableData="tableData6" :show="show"></CTable>
    </el-collapse-item>
  </el-collapse>
  <div slot="footer" class="dialog-footer">
    <el-button size='mini' @click="customerDetail = false">返 回</el-button>
  </div>
</el-dialog>

<!-- 审批-->
<el-dialog title="审批状态" :visible.sync="dialogFormVisible" width="30%">
  <el-select clearable v-model="valueStatus">
    <el-option label="未审批" value="-1"></el-option>
    <!--<el-option label="审批中" value="0"></el-option>-->
    <el-option label="已审批" value="1"></el-option>
  </el-select>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogFormVisible = false;DialogClickOK()">确 定</el-button>
  </div>
</el-dialog>


</div>
</template>

<script>

import KBtn from '../../components/KBtn.vue'
import Boxer from '../../components/Boxer.vue'
import CountrySelect from '../../components/CountrySelect.vue'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
import addrArr from '../../components/address/addr-arr.js'
import Addrselect from '../../components/address/Addrselect'
import customerData from '../../constant/customerData.json'
import SERVICES from '@/services';

// 根据id获取市/区数据函数，动态，经常改变
function getAddrsArrayById (id = 0) {
  return addrArr[id].map(item => {
    return {
      titleOptions: [],
      operatorOptions: [],
      'text': item[1],
      'value': item[0]
    }
  })
}
export default {
  name: 'organization',
  mixins: [ColumnFormatterMixin],
  components: {
    KBtn,
    Boxer,
    CountrySelect,
    Addrselect,
    Formor: function index (resolve) {
      require(['../../components/Formor.vue'], resolve)
    },
    CTable: function index (resolve) {
      require(['../../components/CTable.vue'], resolve)
    }
  },
  props: {
    mate: Object
  },
  created () {
    this.formatterBefore(this.mate.mateList1.columns)
    this.initprovselectedvalue = this.mate.mateFormer.values.province
    this.initcityselectedvalue = this.mate.mateFormer.values.city
    this.initregionselectedvalue = this.mate.mateFormer.values.county
    this.mate.mateList1.localName = this.mate.localName
    this.titleOptions = this.mate.mateSearch.fields[0].options
    this.operatorOptions = this.mate.mateSearch.fields[1].options
    // this.mate.mateSearch.fields.map((i) => { this.object[i.name] = i })
  },
  data () {
    return {
      pageSize: 15,
      disabledFlag: true,
      optionsValue: [],             // 行业细分类
      customerData: customerData,
      labelPosition: 'right',
      prev: true,                          // 判断上一条的按钮是不是可用
      next: true,                           // 判断下一条的按钮是不是可用
      index: 0,                              // 用于双击时，知道双击哪一行
      tableData1: [],                       // 以下都是赋值给列表的数据，保存的数据
      tableData2: [],
      tableData3: [],
      tableData4: [],
      tableData5: [],
      tableData6: [],
      me: [],
      showAdvancedSearchPopover: false,
      show: false,                          // 判断table中要不要操作这个选项
      options: {
        showCheckbox: false,
        showSearch: false,
        search: {
          useInitial: true,
          useEnglish: false,
          customFilter: null
        }
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      actionSpan: 8,
      id: '',           // 传给MaterialForm的参数
      mateMethod: 'PUT', // 传给MaterialForm的参数
      multipleSelection: [],
      hasSelected: false,
      searchValues: {},
      page: 0,
      sortValues: {},
      action: null,
      Data: [],
      dialogFormVisible: false,
      valueStatus: '',                 // 弹出框中的值
      btn: Object,              // 审批按钮需要用到的
      row: Object,               // 审批按钮需要用到的
      addClientFalse: false,
      addClient: 'addClient',
      updateClient: 'updateClient',
      demo: {},
      newForm: {},
      updateId: '',
      customerDetail: false,                    // 弹出框详情
      activeName: '',                           // 手风琴展开的第一项
      activeName1: '1',                          // tabs触发
      idCustomer: '',                            // 这个id是传给详情弹出框的供应商的id
      upClient: 'upClient',
      initprovselectedvalue: '0',
      initcityselectedvalue: '0',
      initregionselectedvalue: '0',
      provAddrs: getAddrsArrayById(0),
      cityAddrs: [],
      regionAddrs: [],
      checkAll: false,
      checkedLabel: [],
      isIndeterminate: true,
      lineSelected: [],               // 存放全部的label
      lineSelectedDetail: [],         // 存放全部的明细行label
      msgBoxButton: true,
      dialogDetailLine: false
    }
  },
  computed: {
    // a computed getter
    labelWidth: function () {
      let width = ''
      if (this.mate.inline) {
        // width = undefined
        width = '130px'
      } else if (typeof (this.mate.labelWidth) === 'undefined') {
        width = '130px'
      } else {
        width = this.mate.labelWidth
      }
      return width
    },
    rules () {
      var rs = {}
      var vm = this
      var rls = this.mate.rules
      for (var index in rls) {
        var r = []
        var rule = rls[index]
        for (var i in rule) {
          var nv = rule[i]
          if (nv.validator) {
            nv.validator = vm[nv.validator]
          }
          r[i] = nv
        }
        rs[index] = r
      }
      return rs
    }
  },
  watch: {
    multipleSelection: function (newSelection) {
      this.hasSelected = (newSelection.length !== 0)
    },
    mate: function (newMate) {
      this.formatterBefore(this.mate.mateList1.columns)
      this.$nextTick(function () {
        this.rowSelect()
      })
    }
  },
  mounted () {
  },
  methods: {
    query () {
      const mate = [this.mate.mateSearch.values]
      const vm = this
      const url = this.mate.mateSearch.url
      this.$root.ajaxData(url, mate, function (data) {
        vm.mate.mateList1 = data.mate
        vm.mate.mateList.total = data.mate.total
      }, 'POST')
    },
    showSearchPopover () {
      this.showAdvancedSearchPopover = !this.showAdvancedSearchPopover
    },
    provChange (val) {
      const oldVal = this.provSelected
      if (val !== '' || val !== null) {
        if (val !== oldVal) {
          if (val !== '0' && val !== 0) {
            this.cityAddrs = getAddrsArrayById(val)
          } else {
            this.cityAddrs = []
          }
          this.citySelected = '0'
        }
      }
      this.mate.mateFormer.values.province = val
    },
    cityChange (val) {
      const oldVal = this.provSelected
      if (val !== '' || val !== null) {
        if (val !== oldVal) {
          if (val !== '0' && val !== 0) {
            this.regionAddrs = getAddrsArrayById(val)
          } else {
            this.regionAddrs = []
          }
          this.regionSelected = '0'
        }
      }
      this.mate.mateFormer.values.city = val
    },
    regionChange (val) {
      this.mate.mateFormer.values.county = val
    },
    rowClickTable (row) {
      this.getDataAccounts(row.id)
      this.getDataContacts(row.id)
    },
    getDataAccounts (id) {
      var vm = this
      this.$root.ajaxData('/accounts/all/' + id, {}, function (data) {
        vm.tableData4 = data
      }, 'GET')
    },
    getDataContacts (id) {
      var vm = this
      this.$root.ajaxData('/contacts/all/' + id, {}, function (data) {
        vm.tableData5 = data
      }, 'GET')
    },
    handleCollapse (activeName) {
      var vm = this
      if (activeName === '1') {
        if (vm.tableData1) {
          this.$root.ajaxData('/addresses/all/' + this.idCustomer, {}, function (data) {
            vm.tableData1 = data
          }, 'GET')
        }
      } else if (activeName === '4') {
        this.$root.ajaxData('/certificates/all/' + this.idCustomer, {}, function (data) {
          vm.tableData6 = data
        }, 'GET')
      }
    },
    handleClick (tab, event) {
      var vm = this
      if (tab.name === '2') {
        this.$root.ajaxData('/po/all/' + this.idCustomer, {}, function (data) {
          vm.tableData2 = data
        }, 'GET')
      } else if (tab.name === '3') {
        this.$root.ajaxData('/finances/all/' + this.idCustomer, {}, function (data) {
          vm.tableData3 = data
        }, 'GET')
      }
    },
    rowDblclick (row) {
      var vm = this
      // 从数据字典里面获取到下列值
      this.$root.ajaxData('/trees/type/all', {}, function (data) {
        vm.optionsValue = data
      }, 'GET')
      this.$root.ajaxData('/dicts/type?types=merchantsCategory', {}, function (data) {
        vm.valueLevel(data, 'merchantsCategory')
      }, 'GET')
      this.initprovselectedvalue = row.province
      this.initcityselectedvalue = row.city
      this.initregionselectedvalue = row.county
      if (this.initprovselectedvalue !== '') {
        this.cityAddrs = getAddrsArrayById(this.initprovselectedvalue)
      }
      if (this.initcityselectedvalue !== '') {
        this.regionAddrs = getAddrsArrayById(this.initcityselectedvalue)
      }
      this.customerDetail = true
      this.idCustomer = row.id
      this.mate.mateFormer.values = row
      // 将所属行业分类改成带斜杠的字符串
      if (row.industryCategory !== '') {
        row.industryCategory = row.industryCategory.split(',').join('/')
      }
      var rows = this.mate.mateList1.rows
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].id === row.id) {
          this.index = i
          if (this.index === 0) {
            this.prev = true
            this.next = false
          } else if (this.index === rows.length - 1) {
            this.prev = false
            this.next = true
          } else {
            this.prev = false
            this.next = false
          }
        }
      }
      this.activeName = ''
    },
    // 值级分类，需要调用的方法
    valueLevel (data, ele) {
      var vm = this
      var ratingArr = []
      var ratingLabel
      var ratingValue
      var rating
      for (var i = 0; i < data[ele].length; i++) {
        ratingLabel = data[ele][i].label
        ratingValue = data[ele][i].value
        rating = { 'label': ratingLabel, 'value': ratingValue }
        ratingArr.push(rating)
      }
      for (var j = 0; j < vm.mate.mateFormer.fields.length; j++) {
        if (vm.mate.mateFormer.fields[j].name === ele) {
          vm.mate.mateFormer.fields[j].options = ratingArr
        }
      }
    },
    // 弹出框出现之后，点击上一条
    prevClick () {
      this.index -= 1
      this.next = false
      if (this.index === 0) {
        this.prev = true
        this.next = false
      }
      this.mate.mateFormer.values = this.mate.mateList1.rows[this.index]
      this.idCustomer = this.mate.mateList1.rows[this.index].id
      this.activeName = ''
    },
    // 弹出框出现之后，点击下一条
    nextClick () {
      this.index += 1
      this.prev = false
      this.mate.mateFormer.values = this.mate.mateList1.rows[this.index]
      this.idCustomer = this.mate.mateList1.rows[this.index].id
      if (this.index === this.mate.mateList1.rows.length - 1) {
        this.next = true
        this.prev = false
      }
      this.activeName = ''
    },
    DialogClickOK () {
      // this.handleButton(this.btn, this.row)
      var vm = this
      const rowt = { id: this.multipleSelection.map((r) => r.id) }
      this.$root.ajaxData('/companys/auditStatus/' + this.valueStatus + '?ids=' + rowt.id, {}, function (data) {
        vm.$root.ajaxData('/companys/companyInfo/3', {}, function (data) {           // 刷新
          vm.mate.mateList1.rows = data.mate.mateList1.rows;
          vm.mate.mateList1.total = data.mate.mateList1.total;
        }, 'GET')
      }, 'PUT')
    },
    rowSelect () {
      this.mate.mateList1.rows.forEach(row => {
          /* eslint-disable */
          let select = (row.id && this.mate.mateList1.selected && this.mate.mateList1.selected.findIndex(id => id == row.id) !== -1)
          /* eslint-enable */
        this.$refs.table.toggleRowSelection(row, (select === true))
      })
      // this.mate.selected = [];
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    hanldeNodeClick (data) {
      const getListApi = this.mate.dataApi + '?dataOnly=true&pid=' + data.id
      const vm = this
      this.$root.ajaxData(getListApi, {}, function (data) {
        vm.mate.rows = data
      })
    },
    handleButton (btn, row) {
      var vm = this
      if (btn.action === 'disableSelectedAudit') {
        rowt = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$root.ajaxData('/companys/auditStatus/1' + '?ids=' + rowt.id, {}, function (data) {
          vm.$root.ajaxData('/companys/companyInfo/3', {}, function (data) {           // 刷新
            vm.mate.mateList1.rows = data.mate.mateList1.rows;
            vm.mate.mateList1.total = data.mate.mateList1.total;
          }, 'GET')
        }, 'PUT')
        return false
      }
      if (btn.action === 'bohuiSelectedAudit') {
        rowt = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$root.ajaxData('/companys/auditStatus/-1' + '?ids=' + rowt.id, {}, function (data) {
          vm.$root.ajaxData('/companys/companyInfo/3', {}, function (data) {           // 刷新
            vm.mate.mateList1.rows = data.mate.mateList1.rows;
            vm.mate.mateList1.total = data.mate.mateList1.total;
          }, 'GET')
        }, 'PUT')
        return false
      }
      let rowt = (btn.isApi || btn.ajax) ? { id: this.multipleSelection.map((r) => r.id) } : {}
      if (btn.action === this.updateClient) {
        if (this.multipleSelection.length !== 1) { // 只能选择一行,不允许选择多行
          this.$message({
            message: this.$t('seladata'), // 请选择一行数据
            type: 'warning'
          })
          return;
        }
        rowt = true ? { id: this.multipleSelection.map((r) => r.id) } : {}
        this.$root.handleAction(btn, rowt, function () {})
        return
      }
      if (btn.action === 'exportClient'){ // 导出 2020/05/26
        let [url, methods, fileName, type, data] = [ btn.url, 'GET', '供应商管理', 'xlsx', {}];
        SERVICES.BASE.downTemplateExcel(url, methods, fileName, type, data);
        return
      }
      rowt.valueStatus = this.valueStatus
      this.$root.handleAction(btn, rowt, function () {
        vm.$root.ajaxData('/companys/companyInfo/3', {}, function (data) {           // 刷新
          vm.mate.mateList1.rows = data.mate.mateList1.rows;
          vm.mate.mateList1.total = data.mate.mateList1.total;
        }, 'GET')
      })
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
      let url = '/companys/supplier/list'
      let param = {
        search: this.searchValues,
        page: this.page,
        sort: this.sortValues
      }
      var vm = this
      if (flag && url.indexOf('?') === -1) {
        url += '-q?' + (this.toUriParams(this.searchValues)) + '&' + (this.toUriParams(this.sortValues)) + '&pageNum=' + this.page + '&pageSize=' + this.pageSize
        param = null
      }
      this.$root.ajaxData(url, param, function (data) {
        vm.updateData(data)
      })
    },
    toUriParams (data) {
      return Object.keys(data).filter(i => !!data[i]).map(i => i + '=' + data[i]).join('&')
    },
    updateData (data) {
      if (data.mate.rows) {
        this.mate.mateList1.rows = data.mate.rows
      }
      if (data.mate.total) {
        this.mate.total = data.mate.total
      }
      if (data.mate.selected) {
        this.mate.selected = data.mate.selected
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
      this.getData()
    },
    rowClick (row) {
      var vm = this
      this.id = row.id
      this.$root.ajaxData('/companys/' + row.id, {}, function (data) {
        vm.mate.mateFormer.values = data
        vm.updateId = data.id
        vm.newForm = data
      })
    },
    // 提交表单的方法
    handleSubmit (ev) {
      var vm = this
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let url = '/companys'
          const values = vm.mate.values
          if (vm.mate.inline) {
            vm.$emit('search', values)
            vm.mate.values = vm.defaultValues
          } else {
            // PUT 请求URL带上ID
            if ((vm.mate.method) === 'PUT' && values.id) {
              url = url + '/' + values.id
            }
            let act = {}
            act = { url: url, ajax: true, method: 'POST' }
            if (this.newForm.id === this.updateId) {
              act = { url: url + '/' + this.updateId, ajax: true, method: 'PUT' }
            }
            act.next = this.mate.next || false
            this.$root.action(act, this.newForm)
          }
        } else {
          this.$notify.error({
            title: '消息',
            message: '数据验证未通过'
          })
          return false
        }
      })
    },
    // 取消表单的方法
    backward () {
      this.addClientFalse = false
    }
  }
}
</script>

<style scope lang="scss">
  .line-btn {
    margin-left: 0;
    position   : absolute;
    top        : 10px
  }
  .title {
    border-bottom: 1px solid #e0e6ed;
    border-right : 1px solid #e0e6ed; 
    white-space: nowrap;
    overflow: hidden;
    background-color: #EFF2F7;
    text-align: center;
    height: 40px;
    line-height: 40px;
    min-width: 0;
    text-overflow: ellipsis;
    box-sizing: border-box;
    
    font-size: 14px;
    color: #1f2d3d;
  }
  .tree-head-first {
    width:30%;
    position:absolute;
    left:0;
    top:0;
  }
  .line-row{
    position:absolute;
    left:30%;
    top:0;
    width: 70%;
  }

  .rltv{
    position:relative;
    border: 1px solid #dfe6ec;
    border-bottom: 0;
  }
  .col-tree{
    text-align: center;
  }

  .div-center{
    text-align: center;
  }

  .halo-tree{
    padding-left: 20px;
  }
  
  .btnblock{
      padding-top:0;
  }

  .mateList{
    margin-top:40px;
  }
  .mask{
    position:relative;
  }
  .mask:after{
    content:"";
    position:absolute;
    width:100%;
    height:100%;
    top:0;
    left:0;
  }
  .hidden{
    display:none;
  }
  .optionHidden{
    visibility:hidden;
  }
  .prev_next{
    margin-bottom:10px;
  }
  .collapse{
    margin-top:30px;
  }
  .el-form-item {
    margin: 15px 20px 2px 0px;
}
.pageMarginTop{
  margin-top:15px;
}
.customerContect, .customerBank{
  margin-top: 20px;
  margin-bottom: 10px;
}
.el-table td, .el-table th {
    height: 30px;
  }
.leftMargin{
  margin-left:10px;
  float:left;
}
// .el-table .cell{
//   line-height:20px!important
// }
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
</style> 
