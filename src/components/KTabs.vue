<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane :label="mate.tabLabel" name="first">
      <k-table v-if="mate.view === 'table'" :mate="mate"></k-table>
      <k-treer v-if="mate.view === 'tree'" :mate="mate"></k-treer>
    </el-tab-pane>
    <el-tab-pane :label="mate.form.tabLabel" name="second">
      <formor :mate="mate.form"></formor>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import KTable from './KTable'
import Formor from './Formor'
import KTreer from './KTreer'
export default {
  components: {
    KTable,
    Formor,
    KTreer
  },
  props: {
    mate: Object
  },
  created () {
    this.activeName = this.mate.activeTab || 'first'
  },
  data () {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleClick (tab, event) {
    }
  }
}
</script>
