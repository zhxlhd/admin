/**
 * 电镀行业-商品发布-园区服务模块
 */
<template>
  <div>
    <div class="query" >
      <el-row :gutter="20">
        <el-form :model="formSearch" :inline="mate.inline" size="mini">
          <el-col :sm="5" :md="3" :lg="3">
            <el-form-item>
              <el-input clearable v-model="formSearch.title" placeholder="输入标题"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="5" :md="3" :lg="3">
            <el-form-item>
              <dict-selected v-model="formSearch.state" dictType="eleState" :initValue="formSearch.state" placeholder="请选择状态"></dict-selected>
            </el-form-item>
          </el-col>          
          <el-col :sm="5" :md="4" :lg="4">
            <el-form-item>
              <el-button @click="query()" size="mini">查询</el-button>
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
import { quillEditor } from 'vue-quill-editor' // 调用编辑器
import KBtn from '../../components/KBtn.vue'
import Boxer from '../../components/Boxer.vue'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
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
        title: '',
        state: ''
      }
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

    // 界面按钮功能
   handleButton (btn) {
      let vm = this
      let url = this.mate.mateList.dataApi
      let row = (btn.isApi || btn.ajax) ? { id: this.multipleSelection.map((r) => r.id) } : {}
      const rowt = this.multipleSelection.map((r) => r.id)
      const parkStatus = this.multipleSelection.map((q) => q.state)
      const parkState = ''
      // 园区服务列表删除
      if (btn.action === 'delParkS') {
        // 新建、废弃状态可以删除
        var isDelParkS= false
        for(let i=0;i<parkStatus.length;i++) {
          this.parkState = parkStatus[i]
          if (this.parkState === '4') {
            isDelParkS = true
          }
        }
        if (isDelParkS === true) {
          vm.$message({
            message: '已发布状态不能删除',
            type: 'warning'
          })
          return
        } else {
          this.$confirm('此操作将此数据删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$root.ajaxData('/electro/el/park-notice/delete',rowt, function (data) {
              vm.$root.monitor({ url, method: 'GET' })
            }, 'PUT')
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
          return
        }
      }

      // 园区服务列表发布
      if (btn.action === 'parkSIssue') {
        var isParkSIssue = false
        for(let i=0;i<parkStatus.length;i++) {
          this.parkState = parkStatus[i]
          if (this.parkState !== '0') {
            isParkSIssue = true
          }
        }
        if (isParkSIssue === true) {
          vm.$message('该状态不能发布')
          return
        }
        this.$root.ajaxData('/electro/el/park-notice/handle/4', rowt, function (data) {
        vm.$root.monitor({ url, method: 'GET' })
        }, 'PUT')
        return
      }

      // 园区服务列表废弃
      if (btn.action === 'parkSDiscard') {
        var isParkSDiscard = false
        for(let i=0;i<parkStatus.length;i++) {
          this.parkState = parkStatus[i]
          if (this.parkState !== '4') {
            isParkSDiscard = true
          }
        }
        if (isParkSDiscard === true) {
          vm.$message({
            message: '只有已发布状态才能废弃',
            type: 'warning'
          })
          return
        }
        this.$root.ajaxData('/electro/el/park-notice/handle/5', rowt, function (data) {
          vm.$root.monitor({ url, method: 'GET' })
        }, 'PUT')
        return
      }
      this.$root.handleAction(btn, row, function () {
        vm.getData()
      })
    },

    // 列表操作按钮
    confirm (act, row) {
      var vm = this
      if (act.action === 'editParkS') {
        if(row.state === '0'){
          this.$root.monitor({ url: act.url + row.id + '/1'})
          return
        }else {
          vm.$message({
            message: '该状态不可编辑',
            type: 'warning'
          })
          return
        }
      }
      if (act.action === 'checkParkS') {
        this.$root.monitor({ url: act.url + row.id + '/0'})
        return
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
      let url = '/electro/el/park-notice/search-list'; // 分页、搜索查询接口
      let vm = this;
      // 查询
      if (this.allowSearch && !this.changePage) {
        // 查询参数
         const params = {
          'title' : this.formSearch.title || '',
          'state' : this.formSearch.state || '',
        }
        this.$root.ajaxData(url, params, function (data) {
          vm.mate.mateList.rows = data.data.mate.rows;
          vm.mate.mateList.total = data.data.mate.total;
        }, 'POST')
        return;
      }
      // 查询获取、分页
      if (this.allowSearch && this.changePage) {
        // 查询参数
        const params = {
          'title' : this.formSearch.title || '',
          'state' : this.formSearch.state || '',
          'pageNum': this.page,
          'pageSize': this.size,
        }
        this.$root.ajaxData(url, params, function (data) {
          vm.mate.mateList.rows = data.data.mate.rows;
          vm.mate.mateList.total = data.data.mate.total;
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
      if (data.data.mate.rows) {
        this.mate.mateList.rows = data.data.mate.rows
        // rowsContent用于判断波次批次管理中拣料出库动作是否可以进行
        this.rowsContent = data.data.mate.rows
      }
      // 获取到包括元数据的所有数据，因为数据量太大，上面只获取到明细行的元数据和数据
      // if (data.mate.mateList.rows) {
      //   this.mate.rows = data.mate.mateList.rows
      // }
      if (data.data.mate.total) {
        this.total = data.data.mate.total
      } else {
        this.total = 0
      }
      if (data.data.mate.selected) {
        this.mate.mateList.selected = data.data.mate.selected
      }
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
