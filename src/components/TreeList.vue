<template>
<el-row :gutter="10">
  <el-col :span="6">
    <el-tree
      class="filter-tree"
      :data="data2"
      :props="defaultProps"
      default-expand-all
      :expand-on-click-node="false"
      @node-click="handerClick"
      ref="tree2">
    </el-tree>
  </el-col>
  <el-col :span="18">
    <k-treer :mate="mate"></k-treer>
  </el-col>
</el-row>
</template>

<script>
import KTreer from '../views/sys/KTreer'
export default {
  components: {
    KTreer
  },
  data () {
    return {
      mate: {},
      data2: [{
        id: 1,
        label: '广东省总公司',
        children: [{
          id: 10,
          label: '深圳分公司 1-1',
          children: [{
            id: 101,
            label: '事业部 1-1-1'
          }, {
            id: 102,
            label: '技术部 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '福建省总公司 2',
        children: [{
          id: 20,
          label: '福州子公司 2-1'
        }, {
          id: 21,
          label: '厦门分公司 2-2',
          children: [{
            id: 210,
            label: '综合市场部 3-2-1',
            children: [{
              id: 2101,
              label: 'A市场部 4-2-1'
            }, {
              id: 2102,
              label: '财务二部 4-2-2'
            }]
          }, {
            id: 211,
            label: '财务部 3-2-2'
          }]
        }]
      }, {
        id: 3,
        label: '上海分部 3',
        children: [{
          id: 30,
          label: '沪松分部 3-1'
        }, {
          id: 31,
          label: '浦东新 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree2.filter(val)
    }
  },
  created () {
    const self = this
    this.$root.ajaxData('/data/org.txt', {}, function (data) {
      self.mate = data.mate
    })
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handerClick (data, node, vm) {
      const self = this
      const id = parseInt((data.id + '').substr(0, 1))
      const urls = ['gd', 'fj', 'sh']
      this.$root.ajaxData('/data/org-' + urls[id - 1] + '.txt?id=' + data.id, {}, function (data) {
        self.$set(self.mate, 'rows', data.mate.rows)
      })
    }
  }
}
</script>
<style scoped>

</style>
