<template>
 <div>
  <model-view :mate="mate.extObj.warehouse"></model-view>
  <h4 style="margin-top:130px">储位信息</h4>
  <hr>
  <grid-form :mate="mate"></grid-form>
 </div>
</template>

<script>

export default {
  name: 'GridView',
  components: {
    ModelView: function index (resolve) {
      require(['./ModelView.vue'], resolve)
    },
    GridForm: function index (resolve) {
      require(['./GridForm.vue'], resolve)
    }
  },
  props: {
    mate: Object
  },
  data () {
    return {
    }
  }
}
</script>

<style scoped>
  .page {
    margin-top: 20px;
  }
  hr {
    margin-bottom: 20px;
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
  .el-form-item {
    margin: 15px 20px 2px 0px;
}
</style>
