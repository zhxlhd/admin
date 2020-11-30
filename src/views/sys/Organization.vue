<template>
<el-row :gutter="20">
  <el-col :span="6">
    <tree ref="tree" :treeData="mate.treeData" :options="options" @handlecheckedChange="hanldeNodeClick" @node-click='hanldeNodeClick' />
  </el-col>
  <el-col :span="18">
    <Boxer :mate="mate" :btnDisable="btnDisable" @action="handleButton">
    <div slot="main">
      <el-row>
        <el-col :span="22">
          <div class="rltv">
            <div class="title tree-head-first">{{mate.captions}}</div>
            <el-row class="last">
              <el-col v-for="col of mate.columns" :span="col.span" class="title div-center" :key="col.id">{{col.label}}</el-col>
              <el-col :span="actionSpan" class="title div-center">操作</el-col>
            </el-row>
          </div>
          <div>
            <el-tree :data="mate.rows"
              :props="defaultProps" 
              :default-expand-all="true"
              :expand-on-click-node="false"
              :render-content='renderContent'>
            </el-tree>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" class="page"  v-if="mate.size > 0">
      <el-col :span="12">
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
  </el-col>
</el-row>
</template>

<script>
/**
 * 组织机构页面
 **/
import Tree from '../../components/tree/tree.vue'
import KBtn from '../../components/KBtn.vue'
import Boxer from '../../components/Boxer.vue'
export default {
  name: 'organization',
  components: {
    Tree,
    KBtn,
    Boxer
  },
  props: {
    mate: Object
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
  // watch: {
  //   filterText (val) {
  //     this.$refs.tree2.filter(val)
  //   }
  // },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    hanldeNodeClick (data) {
      const getListApi = '/offices/tree/list?dataOnly=true&pid=' + data.id
      const vm = this
      this.$root.ajaxData(getListApi, {}, function (data) {
        vm.mate.rows = data
      })
    },
    renderContent: function (h, node) {
      var vm = this
      var domBtns = []
      for (var btn of this.mate.actions) {
        domBtns.push(h(KBtn, {
          props: {
            act: btn,
            row: node.data,
            size: 'small'
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
        if (node.data[col.name] && node.data[col.name] !== '') {
          value = node.data[col.name]
        }
        colSpan = Number(col.span)
        if (colSpan <= 0) colSpan = 3
        sum = sum + colSpan
        return h('el-col', { props: { span: colSpan }, class: { 'col-tree': true }}, value)
      })
      sum = 24 - sum

      cols.push(h('el-col', { props: { span: sum }, class: { 'col-tree': true }}, domBtns))
      vm.actionSpan = sum

      return h('span', [h('span', node.data.name), h('div', { class: { 'line-row': true }}, cols)])
    },
    getData (action, row) {
      const vm = this
      this.$root.ajaxData(this.mate.dataApi, { 'dataOnly': true }, function (data) {
        vm.mate.rows = data
        if (action === 'delete') {
          // vm.$root.ajaxData('/offices/tree/refresh', {}, function (treeData) {
          //   vm.mate.treeData = treeData
          //   // vm.$refs.tree.refresh(treeData)
          // })
        }
      })
    },
    handleButton (btn, row) {
      var vm = this
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
    height: 40px;
    position: relative;
    border-bottom: 1px solid #e0e6ed;
    
  }
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
  .last {
    margin-left:30%;
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
  .el-table td, .el-table th {
    height: 30px;
  }
</style>
