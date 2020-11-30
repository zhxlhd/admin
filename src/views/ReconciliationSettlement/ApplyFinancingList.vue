/**
 * 对账开票-融资申请列表
 */
<template>
  <div>
    <div class="query" >
      <el-row :gutter="20">
        <el-form :model="formSearch" :inline="mate.inline" size="mini">
          <el-col :sm="5" :md="3" :lg="3">
            <el-form-item>
              <dict-selected 
                v-model="formSearch.financeMethod" 
                dictType="financingWay"
                :initValue="formSearch.financeMethod"
                placeholder="请选择融资方式"
                @input="_getCompanyName">
              </dict-selected>
            </el-form-item>
          </el-col>
          <el-col :sm="5" :md="3" :lg="3">
            <el-form-item>
              <el-select v-model="formSearch.financeCompanyName" placeholder="请选择融资方" clearable :disabled="showDisabled">
                <el-option
                  v-for="item in financeCompanyNames"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>   
          <el-col :sm="5" :md="3" :lg="3">
            <el-form-item>
              <dict-selected v-model="formSearch.state" dictType="financingState" :initValue="formSearch.state" placeholder="请选择状态"></dict-selected>
            </el-form-item>
          </el-col>      
          <el-col :sm="5" :md="4" :lg="4">
            <el-form-item>
              <el-button @click="query()" size="mini">查找</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <Boxer :mate="mate.mateList" :hasSelected="hasSelected" @action="handleButton" ref="Boxer" :msgBoxButton="msgBoxButton">
      <div slot="main">
        <el-row>
          <el-col :span="24">
            <el-table size="mini" max-height="500" highlight-current-row  ref="table" :data="mate.mateList.rows" border @selection-change="handleSelectionChange" @sort-change="sortChange" style="width: 100%;">
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column v-if="col.isShow" v-for="(col,index) of mate.mateList.columns" v-bind:key="col.name+index" :formatter="col.formatter" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip>
              </el-table-column>
              <el-table-column  fixed="right" label="操作" :width="actionWidth" v-if="mate.mateList.actions">
                <template slot-scope="scope">
                  <k-btn v-for="act of mate.mateList.actions" v-bind:key="act.action" size="mini" :act="act" :icon="act.icon" :row="scope.row" @action="confirm"></k-btn>
                </template>
              </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" class="page">
      <el-col :span="12">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="mate.mateList.page"
            layout="total, prev, pager, next, sizes"
            :total="mate.mateList.total"
            :page-sizes ="[5,10,15,20,30]"
            :page-size="size">
        </el-pagination>
      </el-col>
      </el-row>
    </div>
  </Boxer>
  </div>
</template>

<script>
import { DateFormat } from '../../utils/util.js'
import { quillEditor } from 'vue-quill-editor' // 调用编辑器
import KBtn from '../../components/KBtn.vue'
import { API_GATEWAY, tradeHallUrl } from '@/config/index.js'
import Boxer from '../../components/Boxer.vue'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
import { type } from 'os';
export default {
  mixins: [ColumnFormatterMixin],
  components: {
    KBtn,
    Boxer,
    quillEditor,
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
    }
  },
  props: {
    mate: Object,
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
  data () {
    return {
      multipleSelection: [],     // 点击table前面的框框，获取到的内容
      hasSelected: false,
      labelPosition: 'right',
      page: 1,
      size: 5,
      sortValues: {},
      action: null,
      word: this.$t('query'),
      object: {},                          // 放columns
      rowId: {},             // 点击table前面的框框
      msgBoxButton: true,
      headers: {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
        'Accept': 'application/json',
        'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId
      },
      formSearch: {
        financeCompanyName: '',
        financeMethod: '',
        status: ''
      },
      financeCompanyNames: [],
    }
  },
  watch: {
    multipleSelection: function (newSelection) {
      this.hasSelected = (newSelection.length !== 0)
    },
    mate: function (newMate) {
      this.formatterBefore(this.mate.mateList.columns)
      this.mate.mateList.localName = this.mate.localName
      // this.$nextTick(function () {
      //   this.rowSelect()
      // })
    }
  },
  created () {
    this.formatterBefore(this.mate.mateList.columns)
    // console.log(this.mate.mateList.columns)
    // console.log(this.mate.mateList.rows)
  },
  updated () {
    if (this.$refs.myQuillEditor) {
      this.$nextTick(function () {
        this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('image', this.imgHandler)
      })
    }
  },
  mounted () {

  },
  methods: {
    // 查询
    query() {
      this.allowSearch = true;
      this.getData('paging');
    },

    // 获取融资方Name
    _getCompanyName (val) {
      var vm = this
      if (val) {
        vm.formSearch.financeCompanyName = ''
        vm.financeCompanyNames = []
        this.$root.ajaxData(`/purchase/finance/tenantName/${val}`, {}, function (data) {
          for(let i = 0; i < data.length; i++) {
            vm.financeCompanyNames.push({ label: data[i].name, value: data[i].name, key: data[i].id })
          }
        }, 'GET')
      } else {
        vm.formSearch.financeCompanyName = ''
      }
    },

    // 界面按钮功能
    handleButton (btn) {
      let vm = this
      let url = this.mate.mateList.dataApi
      let row = (btn.isApi || btn.ajax) ? { id: this.multipleSelection.map((r) => r.id) } : {}
      const rowt = this.multipleSelection.map((r) => r.id)
      const rowState = this.multipleSelection[0].status
      // 融资申请列表提交申请
      if (btn.action === 'submitAudit') {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '只能勾选一条数据'
          })
          return
        }
        if (rowState !== '0') {
          this.$message({
            type: 'warning',
            message: '只有新建状态允许提交申请'
          })
        } else {
          this.$root.ajaxData(`/purchase/finance/editStatus/${rowt}?status=1`, {},function (data) {
            console.log(data)
            if (date.statusCode === 1003|| date.statusCode ===1002 || date.statusCode === 1001){
              return
            }
            vm.$root.monitor({ url: '/purchase/finance/applyList?isSupply=0', method: 'GET' })
          }, 'PUT')
        }
        return
      }

      // 融资申请列表通过
      if (btn.action === 'passFinance') {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '只能勾选一条数据'
          })
          return
        }
        if (rowState !== '1') {
          this.$message({
            type: 'warning',
            message: '只有待审批状态允许通过'
          })
        } else {
          this.$root.ajaxData(`/purchase/finance/editStatus/${rowt}?status=2`, {},function (data) {
            vm.$root.monitor({ url: '/purchase/finance/applyList?isSupply=0', method: 'GET' })
          }, 'PUT')
        }
        return
      }

      // 融资申请列表驳回
      if (btn.action === 'discardFinance') {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '只能勾选一条数据'
          })
          return
        }
        if (rowState !== '1') {
          this.$message({
            type: 'warning',
            message: '只有待审批状态允许驳回'
          })
        } else {
          this.$confirm('确定将此融资申请数据驳回, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$root.ajaxData(`/purchase/finance/editStatus/${rowt}?status=3`, {},function (data) {
              if (data.statusCode === 200) {
                vm.$root.monitor({ url: '/purchase/finance/applyList?isSupply=0', method: 'GET' })
              }
            }, 'PUT')
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消驳回'
            })
          })
        }
        return
      }

      // 融资申请列表拒绝
      if (btn.action === 'rejectFinance') {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '只能勾选一条数据'
          })
          return
        }
        if (rowState !== '1') {
          this.$message({
            type: 'warning',
            message: '只有待审批状态允许拒绝'
          })
        } else {
          this.$confirm('确定将此融资申请数据拒绝, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$root.ajaxData(`/purchase/finance/editStatus/${rowt}?status=4`, {},function (data) {
              if (data.statusCode === 200) {
                vm.$root.monitor({ url: '/purchase/finance/applyList?isSupply=0', method: 'GET' })
              }
            }, 'PUT')
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消拒绝'
            })
          })
        }
        return
      }
      this.$root.handleAction(btn, row, function () {
        vm.getData()
      })
    },

    // 列表操作按钮
    confirm (act, row) {
      var vm = this
      // 修改
      if (act.action === 'editFinance') {
        if(row.status === '0' || row.status === '3') {
          this.$root.monitor({url: act.url + row.id + '?isEdit=1' + '&isSupply=0'})
          return
        } else {
          vm.$message({
            message: '该状态不可编辑',
            type: 'warning'
          })
          return
        }
      }
      // 查看
      if (act.action === 'checkFinance') {
        this.$root.monitor({url: act.url + row.id + '?isEdit=0' + '&isSupply=0'})
        return
      }
      // 删除
      if (act.action === 'deleteFinance') {
        if(row.status === '0' || row.status === '3' || row.status === '4') {
          this.$confirm('确定将此融资申请数据删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$root.ajaxData(act.url + row.id,{}, function (data) {
              if (data.statusCode === 200) {
                vm.$message({
                  message: '删除成功',
                  type: 'success'
                })
                vm.$root.monitor({ url: '/purchase/finance/applyList?isSupply=0', method: 'GET' })
              }
            }, 'DELETE')
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
          return
        }else {
          vm.$message({
            message: '该状态不可删除',
            type: 'warning'
          })
          return
        }
        
      }
    },
    // table表格中勾选的选项，val是勾选的对象
    handleSelectionChange (val) {
      this.$emit('actionSelected', val)
      this.multipleSelection = val
    },
    handleSizeChange (val) {
      this.size = val
      this.getData('paging')
    },
    handleCurrentChange (val) {
      this.page = val
      this.changePage = true
      this.getData('paging')
    },
    handleAction (act, row) {
      var vm = this
      this.$root.handleAction(act, row, function () {
        vm.getData()
      })
    },
    getData (flag) {
      let url = `/purchase/finance/simpleSearch?pageNum=${this.page}&pageSize=${this.size}`; // 分页、搜索查询接口
      let vm = this;
      // 查询
      if (this.allowSearch && !this.changePage) {
        // 查询参数
         const params = {
          'financeMethod' : this.formSearch.financeMethod || '',
          'financeCompanyName' : this.formSearch.financeCompanyName || '',
          'status' : this.formSearch.state || '',
        }
        this.$root.ajaxData(url, params, function (data) {
          vm.mate.mateList.rows = data.mate.mateList.rows;
          vm.mate.mateList.total = data.mate.mateList.total;
        }, 'POST')
        return;
      }
      // 查询获取、分页
      if (this.allowSearch && this.changePage) {
        // 查询参数
        const params = {
          'financeMethod' : this.formSearch.financeMethod || '',
          'financeCompanyName' : this.formSearch.financeCompanyName || '',
          'status' : this.formSearch.state || '',
          'pageNum': this.page,
          'pageSize': this.size,
        }
        this.$root.ajaxData(url, params, function (data) {
          vm.mate.mateList.rows = data.mate.mateList.rows;
          vm.mate.mateList.total = data.mate.mateList.total;
        }, 'POST')
        return;
      }
      // 直接分页请求
      const params = {
        'pageNum': this.page,
        'pageSize': this.size,
      }
      this.$root.ajaxData(url, params, function (data) {
        vm.updateData(data)
      }, 'POST')
    },
    updateData (data) {
      if (data.mate.mateList.rows) {
        this.mate.mateList.rows = data.mate.mateList.rows
        // rowsContent用于判断波次批次管理中拣料出库动作是否可以进行
        this.rowsContent = data.mate.mateList.rows
      }
      // 获取到包括元数据的所有数据，因为数据量太大，上面只获取到明细行的元数据和数据
      // if (data.mate.mateList.rows) {
      //   this.mate.rows = data.mate.mateList.rows
      // }
      if (data.mate.mateList.total) {
        this.total = data.mate.mateList.total
      } else {
        this.total = 0
      }
      // if (data.data.mate.selected) {
      //   this.mate.mateList.selected = data.data.mate.selected
      // }
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
    margin: 10px 10px 2px 0px;
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
  .tableTop{
    position: absolute;
    margin-bottom: 50px;
  }
  .el-table td, .el-table th {
    height: 30px;
  }
  .detailTable{
    margin-top: 40px;
  }
  .qbutton{
    margin: 10px 0 5px;
    button {
      padding: 7px 15px;
      background-color: #fff;
      cursor: pointer;
    }
  }
  .query {
    // margin: 1px 0;
    margin-bottom: 15px;
    // .search {
    //   margin-left: 5px;
    //   button {
    //     // padding: 7px 15px;
    //     background-color: #fff;
    //     cursor: pointer;
    //   }
    // }
  }
  .el-dialog__header {
    padding: 10px 10px 0;
  }
  .el-dialog__body {
    padding: 10px 10px;
  }
</style>
