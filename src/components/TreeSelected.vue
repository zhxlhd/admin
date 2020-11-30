<template>
<div>
  <el-input v-model="selectedValue" :placeholder="placeholder" @focus="dialogVisible = true" readonly></el-input>
  <el-dialog :title="placeholder" :visible.sync="dialogVisible" :modal="false" custom-class="'dialog'" size="tiny">
    <el-input
      placeholder="输入关键字进行过滤"
      v-model="filterText"></el-input>
    <el-tree :data="treeData" 
             default-expand-all="" 
             node-key="id" ref="tree" 
             highlight-current 
             :props="defaultProps" 
             :filter-node-method="filterNode"
             @node-click="nodeSelected"></el-tree>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="ok">确 定</el-button>
    </div>
  </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    options: String,
    defaultProps: Object,
    placeholder: String,
    fieldName: String,
    fieldValue: [String, Number]
  },
  data () {
    return {
      treeData: [],
      filterText: '',
      selectedValue: '',
      dialogVisible: false
    }
  },
  created () {
    this.getData(this.options)
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data[this.defaultProps.label].indexOf(value) !== -1
    },
    ok () {
      this.dialogVisible = false
    },
    nodeSelected (data) {
      this.selectedValue = data[this.defaultProps.label]
      this.$emit('tree-selected', this.fieldName, data[this.defaultProps.value])
    },
    getData (dataApi) {
      const vm = this
      this.$root.ajaxData(dataApi, {}, function (data) {
        vm.treeData = data
        vm.findByIdWithTree(data, vm.fieldValue)
      })
    },
    findByIdWithTree (jsonData, destId) {
      for (var i = 0; i < jsonData.length; i++) {
        if (jsonData[i].id === destId) {
          this.selectedValue = jsonData[i][this.defaultProps.label]
          break
        } else {
          if (jsonData[i].hasOwnProperty('children')) {
            this.findByIdWithTree(jsonData[i].children, destId)
          }
        }
      }
    }
  }
}
</script>

<style scoped>
 .dialog {
   max-height: 400px;
 }
</style>
