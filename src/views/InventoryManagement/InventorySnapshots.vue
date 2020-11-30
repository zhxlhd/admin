<template>
  <div>
      <KTable :mate="dataKTable" @actionSelected="handleSelected"></Ktable>
      <div class="sbutton">
        <el-button type="primary" @click="handleSubmit">提 交</el-button>
        <el-button @click="backward" v-if="!mate.inline">取 消</el-button>
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dataKTable: {},
      selectedRows: []
    }
  },
  components: {
    KTable: function index (resolve) {
      require(['../../components/KTable.vue'], resolve)
    }
  },
  props: {
    mate: Object
  },
  methods: {
    handleSelected(val) {
      this.selectedRows = val
    },
    handleSubmit (ev) {
      var vm = this
      if (this.selectedRows.length !== 1) {
          vm.$message({
            message: this.$t('Please select a row of data'),
            type: 'warning'
          })
          return
      }

      var invObj = { id:this.selectedRows[0].id, inventoryType:this.selectedRows[0].inventoryType, touchStartDate:this.selectedRows[0].touchStartDate, touchEndDate:this.selectedRows[0].touchEndDate }
      var mate = {}
      mate.mateFormerHeader = invObj
      this.$root.ajaxData('/inventory/physical/snapshots/batchSave', mate, function () {
        vm.$root.monitor({ url: '/inventory/physical/snapshots/all/list' })
      }, 'POST')
    },
    backward () {
      this.$root.monitor({ url: '/inventory/physical/snapshots/all/list' })
    }
  },
  created () {
    var vm = this
    this.$root.ajaxData('/inventory/physical/inventories/noComplete', {}, function (data) {
      delete data.mate.btns
      vm.dataKTable = data.mate
    }, 'GET')
  }
}

</script>

<style scoped>
.sbutton{
  margin-top:50px;
}
</style>