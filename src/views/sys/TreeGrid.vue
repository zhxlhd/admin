<template>
  <Boxer :mate="mate" :btnDisable="btnDisable" @action="handleButton">
    <div class="mainRow">
      <el-row  >
        <el-col :span="24">
          <div class="rltv">
            <div class="title tree-head-first">{{mate.captions}}</div>
            <el-row class="last">
              <el-col v-for="col of mate.columns" :key="col.name" :span="col.span" class="title div-center">{{col.label}}</el-col>
              <el-col :span="actionSpan" class="title div-center" >操作</el-col>
            </el-row>
          </div>
          <div>
            <el-tree :data="mate.rows"
              :props="defaultProps" 
              :default-expand-all="true"
              :expand-on-click-node="false"
              :render-content='renderContent'
              @node-click="hanldeNodeClick">
            </el-tree>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" class="page"  v-if="mate.size > 0">
      <el-col :span="5">
        <el-pagination
            @current-change="handleCurrentChange"
            :current-page="mate.page"
            layout="total,prev, pager, next"
            :total="mate.total"
            :page-size ="mate.size">
        </el-pagination>
      </el-col>
      </el-row>
    </div>
  </Boxer>
</template>

<script>
/**
 * 组织机构页面
 **/
import KBtn from '../../components/KBtn.vue'
import DictStore from '../../store/dict-store.js'
export default {
  name: 'organization',
  components: {
    KBtn,
    Boxer: function index (resolve) {
      require(['../../components/Boxer.vue'], resolve)
    }
  },
  props: {
    mate: Object
  },
  created () {
  },
  data () {
    return {
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
      btnDisable: false,
      actionSpan: 8
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    hanldeNodeClick (data) {
      // const getListApi = '/offices/tree/list?dataOnly=true&pid=' + data.id
      // const getListApi = this.mate.dataApi + '?dataOnly=true&pid=' + data.id
      // const vm = this
      // this.$root.ajaxData(getListApi, {}, function (data) {
      //   vm.mate.rows = data
      // })
    },
    renderContent: function (h, node) {
      var vm = this
      var domBtns = []
      var lineBtns = []
      var lineStatus = []
      var statusLine = []
      for (var btn of this.mate.actions) {
        domBtns.push(h(KBtn, {
          props: {
            act: btn,
            row: node.data,
            size: 'mini'
          },
          on: {
            action: vm.handleButton
          }
        }))
      }
      var sum = 0
      var colSpan
      var cols = this.mate.columns.map((col) => {
        var value = '--'
        var value1
        if (node.data[col.name] && node.data[col.name] !== '') {
          value = node.data[col.name]
        }
        if (col.dict) {
          value = DictStore.formatDict(col.dict, node.data[col.name]) || value
        }
        if (col.name === 'status') {
          for (btn of col.actions) {
            lineBtns.push(h(KBtn, {
              props: {
                act: btn,
                row: node.data,
                size: 'mini'
              },
              on: {
                action: vm.handleButton
              }
            }))
          }
          if (node.data['pid'] !== '0') {
            if (node.data['status'] === '1') {
              value1 = '--'
              lineBtns = []
            }
            value1 = '--'
            lineBtns = []
          } else {
            if (col.dict) {
              value1 = DictStore.formatDict(col.dict, node.data['pid'])
            }
          }
          lineStatus.push(h('el-col', { props: { span: 10 }, class: { 'col-tree': true, 'col-line': true }}, value1))
          statusLine.push(lineBtns, lineStatus)
          return h('el-col', { props: { span: 6 }, class: { 'col-tree': true, 'col-line': true }}, statusLine)
        }

        colSpan = Number(col.span)
        if (colSpan <= 0) colSpan = 6
        sum = sum + colSpan
        if (col.name === 'type') {
          if (node.data['type'] >= '1') {
            domBtns = []
          }
        }
        return h('el-col', { props: { span: colSpan }, class: { 'col-tree': true, 'col-line': true }}, value)
      })
      sum = 10 - sum
      cols.push(h('el-col', { props: { span: sum }, class: { 'col-tree': true }}, domBtns))
      vm.actionSpan = sum

      return h('span', [h('span', node.data.name), h('div', { class: { 'line-row': true }}, cols)])
    },
    getData (action, row) {
      const vm = this
      this.$root.ajaxData(this.mate.dataApi, { 'dataOnly': true }, function (data) {
        vm.mate.rows = data
        if (action === 'delete') {
          vm.$root.ajaxData(vm.mate.dataApi.replace('list', 'refresh'), {}, function (treeData) {
            vm.mate.treeData = treeData
          })
        }
      })
    },
    handleButton (btn, row) {
      var vm = this
      if (btn.action === 'Certification') {
        this.$root.monitor({ url: '/companys/perfectInfo?name=' + row.name })
        return false
      }
      this.$root.handleAction(btn, row, function () {
        vm.getData(btn.action, row)
      })
    },
    handleCurrentChange () {
    }
  }
}
</script>

<style scoped>
 .el-tree-node__content {
    line-height: 40px;
    height: 35px;
    position: relative;
    border-bottom: 1px solid #e0e6ed;
    
  }
  .line-btn {
    margin-left: 0;
    position   : absolute;
    top        : 10px
  }
  .mainRow {
    margin-top: -10px
  }
  .title {
    border-bottom: 1px solid #e0e6ed;
    border-right : 1px solid #e0e6ed; 
    white-space: nowrap;
    overflow: hidden;
    background-color: #EFF2F7;
    text-align: center;
    height: 30px;
    line-height: 30px;
    min-width: 0;
    text-overflow: ellipsis;
    box-sizing: border-box;
    font-size: 14px;
    color: #1f2d3d;
  }
  .tree-head-first {
    width:20%;
    position:absolute;
    left:0;
    top:0;
  }
  .line-row{
    position:absolute;
    left:25%;
    top:0;
    width: 70%;
  }
  .last {
    margin-left:20%;
  }

  .rltv{
    position:relative;
    border: 1px solid #dfe6ec;
    border-bottom: 0;
  }
  .col-line {
    overflow: hidden; 
    white-space: nowrap; 
    text-overflow: clip;
  }
  .el-table td, .el-table th {
    height: 30px;
  }
</style>
