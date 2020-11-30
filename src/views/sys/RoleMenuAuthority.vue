<template>
<el-row :gutter="20">
  <el-col :span="8" :offset="6">
    <el-row>
      <h3>角色授权</h3>
    </el-row>
    <el-row>
    <el-tree :data="mate.values.treeData" show-checkbox check-strictly :default-checked-keys="mate.values.checked" default-expand-all="" node-key="id" ref="tree" highlight-current :props="defaultProps">
    </el-tree>
    </el-row>
    <el-row>
      <el-button type="" style="width:20%; margin-top: 20px" @click.native.prevent="getCheckedNodes" :loading="saving">保存</el-button>
      <el-button type="" style="width:20%; margin-top: 20px" @click="backward">返回</el-button>
    </el-row>
  </el-col>
</el-row>
</template>

<script>
import _ from 'underscore'
export default {
  name: 'roleMenuAuthority',
  props: {
    mate: Object
  },
  data () {
    return {
      saving: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
    getCheckedNodes () {
      const arr = []
      this.$refs.tree.getCheckedNodes().forEach(i => {
        if (_.indexOf(arr, i.id) === -1) {
          arr.push(i.id)
        }
      })
      this.$root.ajaxData(this.mate.url, arr, function () {
      }, 'POST')
    },
    hanldeNodeClick (data) {
      this.$root.ajaxData(this.mate.url)
    },
    save (btn, row) {
      var vm = this
      this.$root.handleAction(btn, row, function () {
        vm.getData(btn.action, row)
      })
    },
    backward () {
      this.$root.monitor({ url: this.mate.next })
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
</style>
