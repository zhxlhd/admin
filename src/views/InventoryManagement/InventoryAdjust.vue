<template>
  <div>

    <KTable :mate="dataKTable"></Ktable>

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
      form: {},
      list: {},
      objectColumns: {},
      dataKTable: {}
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
    handleSubmit (ev) {
      var vm = this

      var mate = {}
      mate.mateList = this.mate.rows

      //mate.mateList = this.list.rows

      this.$root.ajaxData('/inventory/physical/snapshots/batchUpdateAdjust', mate, function () {
        vm.$root.monitor({ url: '/inventory/physical/inventories/all/list' })
      }, 'POST')
    },
    backward () {
      this.$root.monitor({ url: '/inventory/physical/inventories/all/list' })
    }
  },
  created () {
    var vm = this
    this.list = this.mate.mateList
    //this.list.columns.map((i) => { this.objectColumns[i.name] = i })
    vm.dataKTable = this.mate
  }
}
</script>

<style scoped>
.sbutton{
  margin-top:50px;
}
</style>