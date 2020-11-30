<template>
<el-row :gutter="20">
  <el-col :span="6">
    <!--<tree ref ="tree" :treeData="mate.values.treeData" :options="options" @handlecheckedChange="hanldeNodeClick" @node-click="hanldeNodeClick" />-->
    <el-tree
    :data="mate.values.treeData"
    default-expand-all
    node-key="id"
    ref="tree2"
    highlight-current
    :expand-on-click-node="false"
    :props="defaultProps"
    @node-click="hanldeNodeClick">
  </el-tree>
  </el-col>
  <el-col :span="18">
    <el-transfer :data="this.mate.values.data" v-model="rightValue" :titles="titles" @change="handlerChange">
      <el-button class="transfer-footer" slot="left-footer" size="mini" @click.native="restore">清除</el-button>
      <el-button class="transfer-footer" slot="right-footer" size="mini" @click.native="assign">保存</el-button>
    </el-transfer>
  </el-col>
</el-row>
</template>

<script>
import Tree from '../../components/tree/tree.vue'
import _ from 'underscore'
export default {
  name: 'roleAssignUser',
  components: {
    Tree
  },
  props: {
    mate: Object
  },
  created () {
    // key
    this.orginValue = this.rightValue = this.mate.values.value
    // item data
    this.leftValue = this.mate.values.data
  },
  data () {
    return {
      orginValue: [],
      leftValue: [],
      rightValue: [],
      titles: ['可选用户', '已选用户'],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      options: {
        showCheckbox: false,
        showSearch: false,
        search: {
          useInitial: true,
          useEnglish: false,
          customFilter: null
        }
      }
    }
  },
  methods: {
    hanldeNodeClick (node) {
      // 查询组织机构下所有用户,分配用户筛选officeId=node.id
      this.mate.values.roleId = node.id
      this.getUsersData()
    },
    assign () {
      const op = { url: '/roles/assign/users', method: 'POST' }
      const newValue = _.difference(this.rightValue, this.orginValue)
      const delValue = this.orginValue.filter(i => this.rightValue.indexOf(i) === -1)

      const params = { 'userIds': newValue, 'removeUserIds': delValue, 'roleId': this.mate.values.roleId }
      this.$root.ajaxData(op.url, params, function (result) {
      }, op.method)
    },
    restore () {
      this.getUsersData()
    },
    getUsersData () {
      const getListApi = '/roles/queryUsers/' + this.mate.values.roleId
      const vm = this
      this.$root.ajaxData(getListApi, {}, function (result) {
        vm.rightValue = vm.orginValue = result.value
        vm.mate.values.data = result.data
      })
    },
    handlerChange (curValue, dict, key) {
      this.rightValue = curValue
    }
  }
}
</script>

<style scoped>
.el-transfer-panel {
  width: 45%;
}
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
</style>
