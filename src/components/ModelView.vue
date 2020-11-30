<template>
  <div class="container">
    <h4>仓库信息</h4>
    <hr>
    <el-row>
      <el-col :sm="12" :md="8" :lg="6"  v-for="field in mate.fields" :key="field.id>
        {{ field.label }} : {{ mate.values[getName(field.name)] }}
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  props: {
    mate: Object
  },
  created () {
    this.typeName = this.getType(this.mate.values['type'])
  },
  watch: {
    mate: function () {
      this.typeName = this.getType(this.mate.values['type'])
    }
  },
  methods: {
    getType (type) {
      var vm = this
      // 获取到仓库类型
      this.$root.ajaxData('/dic/cg/warehouse_type', {}, function (data) {
        data.map((i) => {
          if (i.value === type.toString()) {
            Vue.set(vm.mate.values, 'typeName', i.label)
          }
        })
      }, 'GET')
      // 指定储位控制
      if (this.mate.values.locationControl.toString() === '1') {
        Vue.set(vm.mate.values, 'locationControlName', '预指定')
      } else {
        Vue.set(vm.mate.values, 'locationControlName', '无指定')
      }
    },
    getName (name) {
      if (name === 'orgId') {
        return 'orgName'
      } else if (name === 'type') {
        return 'typeName'
      } else if (name === 'locationControl') {
        return 'locationControlName'
      } else {
        return name
      }
    }
  }
}
</script>

<style scoped>
  .container {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
  .el-col {
    margin: 10px 0;
  }
</style>
