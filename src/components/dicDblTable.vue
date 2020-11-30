<template>
  <div>
      <div slot="main">
        <el-row>
          <el-col :span="9">
              <el-row>
                <el-col :span="16">
                  <div class="fbutton">
                    <el-button  class="el-icon-plus"  @click="addHeader">新 增</el-button>
                    <el-button  class="el-icon-edit"  @click="editHeader">修 改</el-button>
                    <el-button class="el-icon-delete" @click="delHeader" v-if="!mate.inline">删 除</el-button>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="searchMargin">
                    <template>
                      <el-input
                        filterable
                        placeholder="请输入"
                        v-model="value"
                        @change="changeFilter">
                      </el-input>
                    </template>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-table size="mini" highlight-current-row @row-click="rowClick" ref="table" :data="rowsContent" border @selection-change="handleSelectionChange" @sort-change="sortChange" style="width: 100%;">
                    <el-table-column type="selection" width="50"></el-table-column>
                    <el-table-column v-for="(col,index) of mate.mateList.columns" v-bind:key="col.name+index" :formatter="col.formatter" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip></el-table-column>
                </el-table>
              </el-row>
              <el-row type="flex" justify="left" class="page">
                <el-col :span="24">
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
        </el-col>
        <el-col :span="15">
            <el-row>
              <div class="sbutton">
                <el-button  class="el-icon-plus"  @click="addDetail">新 增</el-button>
                <el-button  class="el-icon-edit"  @click="editDetail">修 改</el-button>
                <el-button class="el-icon-delete"   @click="delDetail" v-if="!mate.inline">删 除</el-button>
              </div>
            </el-row>
            <el-row>
              <el-table size="mini" v-if="showFlag" :data="mate.mateLineList.rows" border @selection-change="handleSelectionChange" style="margin-left: 10px;">
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column v-if="col.isShow" :formatter="col.formatter" v-for="col of mate.mateLineList.columns" :key="col.code" :label="col.label" :prop="col.name" :min-width="col.width"></el-table-column>
              </el-table>
            </el-row>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="填写数据字典分类" :visible.sync="dicSortDialog" width="50%">
      <el-form :model="mate.mateFormerHeader.values" :inline="mate.inline" label-position="right" ref="ruleForm"  :rules="rules" :label-width="labelWidth">
        <el-row>
        <el-col :span="10">
            <el-form-item  label="分类名称">
              <el-input v-model="mate.mateFormerHeader.values['name']"></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="10">
            <el-form-item  label="分类编码"  prop="code">
              <el-input v-model="mate.mateFormerHeader.values['code']"></el-input>
            </el-form-item>
        </el-col>
        </el-row>
      </el-form>
      <div class="mbutton">
        <el-button @click="submit">确 定</el-button>
        <el-button @click="back" >取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="填写数据字典表" :visible.sync="dicDetailDialog" width="50%">
      <el-form :model="mate.mateFormer.values" :inline="mate.inline" label-position="right" ref="ruleForm"  :rules="rules" :label-width="labelWidth">
        <el-row>
          <el-col :span="10">
              <el-form-item  label="名称">
                <el-input v-model="mate.mateFormer.values['label']"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="10">
              <el-form-item  label="值">
                <el-input v-model="mate.mateFormer.values['value']"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="10">
              <el-form-item  label="分类编码">
                <el-input readonly v-model="mate.mateFormer.values['dicCatgCode']"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="10">
              <el-form-item  label="排序">
                <el-input v-model="mate.mateFormer.values['sorting']"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="10">
              <el-form-item  label="字典说明">
                <el-input type="textarea" v-model="mate.mateFormer.values['remark']"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="10">
              <el-form-item  label="可编辑">
                <el-select clearable v-model="mate.mateFormer.values['editable']">
                  <el-option :label='item.label' :value="item.value" v-for="item of editableOptions" :key="item.id"></el-option>
                </el-select>
              </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="mbutton">
        <el-button @click="dlgConfirm">确 定</el-button>
        <el-button @click="dlgCancel" >取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ColumnFormatterMixin from '../mixins/ColumnFormatterMixin'
import { LANGS } from '../i18n/lang'
import { API_GATEWAY } from '@/config/index.js'
const BASEAPI = `${API_GATEWAY}/api`
export default {
  mixins: [ColumnFormatterMixin],
  props: {
    mate: Object
  },
  data () {
    return {
      value: '',
      pageSize: 15,
      multipleSelection: [],     // 点击table前面的框框，获取到的内容
      langs: LANGS,
      hasSelected: false,
      searchValues: {},
      page: 0,
      sortValues: {},
      rowCode: '',
      action: null,
      dialogTableVisible: false,          // dialog开关
      tableData: [],
      word: this.$t('query'),
      showFlag: true,                    // 下面表格的开关
      object: {},                          // 放columns
      fit: false,
      dicSortDialog: false,
      dicDetailDialog: false,
      dialogFormVisible: false,
      valueStatus: '',
      dialogAuditVisible: false,
      dialogUpdateVisible: false,
      cause: '',
      auditStatus: '',
      rowId: {},             // 点击table前面的框框
      rowsContent: [],              // 获取到列表的数据
      urlName: '',
      fileName: '',
      checkAll: false,
      checkedLabel: [],
      isIndeterminate: true,
      lineSelected: [],               // 存放全部的label
      lineSelectedDetail: [],         // 存放全部的明细行label
      defaultValues: {},
      selectedLines: [],
      rules: {
        code: [
            { required: true, message: '该输入项为必输项' },
            { validator: validateRequired, trigger: 'change' }
        ]
      },
      leftTableData: [],
      editableOptions: []
    }
  },
  watch: {
    multipleSelection: function (newSelection) {
      this.hasSelected = (newSelection.length !== 0)
    },
    mate: function (newMate) {
      this.formatterBefore(this.mate.mateList.columns)
      this.formatterBefore(this.mate.mateLineList.columns)
      this.rowsContent = this.mate.mateList.rows
      this.$nextTick(function () {
        this.rowSelect()
      })
    }
  },
  created () {
    this.formatterBefore(this.mate.mateList.columns)
    this.formatterBefore(this.mate.mateLineList.columns)
    if (this.mate.inline) {
      this.defaultValues = this.mate.values
    }
    this.rowsContent = this.mate.mateList.rows
    this.mate.mateList.localName = this.mate.localName
    this.editableOptions = [{ value: '0', label: '否' }, { value: '1', label: '是' }]
  },
  computed: {
    actionWidth: function () {
      return this.mate.mateList.actions.length * 60 + 30
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
  mounted () {
    this.rowSelect()
  },
  methods: {
    changeFilter (val) {
      this.rowsContent = this.mate.mateList.rows.filter(item => (~item.name.indexOf(val) || ~item.code.indexOf(val)))
    },
    addHeader () {
      this.dicSortDialog = true
    },
    editHeader () {
      var vm = this
      var rows = this.multipleSelection
      if (rows.length !== 1) {
        vm.$message({
          message: this.$t('seladata'),
          type: 'warning'
        })
        return
      } else {
        this.dicSortDialog = true
        this.$root.ajaxData('/dic/catg/toedit' + '/' + this.multipleSelection[0].id, {}, function (data) {
          vm.mate.mateFormerHeader = data.mate
        }, 'GET')
      }
    },
    delHeader () {
      var vm = this
      var rows = this.multipleSelection
      this.$http.delete(BASEAPI + '/dic/catg/' + this.multipleSelection[0].id)
      .then(response => {
        vm.$root.ajaxData(vm.mate.mateList.dataApi, {}, function (data) {
          vm.mate.mateList.rows = data.mate.mateList.rows
        }, 'GET')
      })
    },
    submit () {
      var mate = {}
      var vm = this
      this.dicSortDialog = false
      mate = this.mate.mateFormerHeader.values
      if (this.mate.mateFormerHeader.method === 'POST') {
        this.$root.ajaxData('/dic/catg', mate, function () {
          vm.$root.monitor({ url: '/dic/catg/all/list' })
        }, 'POST')
      } else {
        this.$root.ajaxData('/dic/catg' + '/' + this.mate.mateFormerHeader.values.id, mate, function () {
          vm.$root.monitor({ url: '/dic/catg/all/list' })
        }, 'PUT')
      }
    },
    back () {
      this.dicSortDialog = false
      this.$root.monitor({ url: '/dic/catg/all/list' })
    },
    addDetail () {
      this.dicDetailDialog = true
      this.mate.mateFormer.values.dicCatgCode = this.rowCode
    },
    editDetail () {
      var vm = this
      var rows = this.multipleSelection
      if (rows.length !== 1) {
        vm.$message({
          message: this.$t('seladata'),
          type: 'warning'
        })
        return
      } else {
        this.dicDetailDialog = true
        this.$root.ajaxData('/dic/toedit' + '/' + this.multipleSelection[0].id, {}, function (data) {
          vm.mate.mateFormer = data.mate
        }, 'GET')
      }
    },
    delDetail (rows) {
      var vm = this
      var rows = this.multipleSelection
      this.$http.delete(BASEAPI + '/dic/' + this.multipleSelection[0].id)
      .then(response => {
        vm.$root.ajaxData('/dic/cg/' + this.rowCode, {}, function (data) {
          vm.mate.mateLineList.rows = data
        }, 'GET')
      })
    },
    dlgConfirm () {
      var mate = {}
      var vm = this
      mate = this.mate.mateFormer.values
      this.dicDetailDialog = false
      if (this.mate.mateFormer.method === 'POST') {
        this.$root.ajaxData('/dic', mate, function () {
          vm.$root.monitor({ url: '/dic/catg/all/list' })
        }, 'POST')
      } else {
        this.$root.ajaxData('/dic' + '/' + this.mate.mateFormer.values.id, mate, function () {
          vm.$root.monitor({ url: '/dic/catg/all/list' })
        }, 'PUT')
      }
    },
    dlgCancel () {
      this.dicDetailDialog = false
      this.$root.monitor({ url: '/dic/catg/all/list' })
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
      if (flag && url.indexOf('?') === -1) {
        url += '-q?' + 'search=' + encodeURIComponent(JSON.stringify(this.searchValues)) + '&' + (this.toUriParams(this.sortValues)) + '&pageNum=' + this.page + '&pageSize=' + this.pageSize
        param = null
      } else if (flag && url.indexOf('?') !== -1) {
        url += '&search=' + encodeURIComponent(JSON.stringify(this.searchValues)) + '&' + (this.toUriParams(this.sortValues)) + '&pageNum=' + this.page + '&pageSize=' + this.pageSize
        param = null
      }
      this.$root.ajaxData(url, param, function (data) {
        vm.updateData(data)
      })
    },
    updateData (data) {
      if (data.mate.rows) {
        this.mate.mateList.rows = data.mate.rows
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
    updated () {
      this.showFlag = true
    },
    rowClick (row) {
      this.showFlag = true
      var vm = this
      this.rowCode = row.code
      this.$root.ajaxData(this.mate.mateList.url + '/' + row.code, {}, function (data) {
        vm.mate.mateLineList.rows = data
      }, 'GET')
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.$emit('actionSelected', val)
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
    },
    todoEssearch (data) {
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
      return Object.keys(data).filter(i => !!data[i]).map(i => i + '=' + data[i]).join('&')
    }
  }
}
</script>

<style lang="scss" scoped>
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
  .select-button{
    margin-top: 20px;
  }
  .el-table td, .el-table th {
    height: 30px;
  }
  .fbutton{
  margin-top:20px;
  margin-bottom:10px;
}
.sbutton{
  margin-left: 20px;
  margin-top:20px;
  margin-bottom:10px;
}
.mbutton{
  margin: 3px 0;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}
.searchMargin{
    margin-top: 20px;
  }
</style>
