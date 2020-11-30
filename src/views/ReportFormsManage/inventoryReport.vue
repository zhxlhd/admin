<template>
  <div>
    <p>库存报表</p>
    <el-select v-model="purchaseReportValue" placeholder="请选择报表类型" clearable size="mini">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
  </div>
</template>

<script>

export default {
  data () {
    return {
      options: [{value: '选项1', label: '供应商名单报表'}, {value: '选项2', label: '采购对账报表'}, {value: '选项3', label: '蚵仔煎'}],
      purchaseReportValue:''
    }
  },
  created () {
    console.log('1122')
  },
  components: {

  },
  methods: {

  }
}
</script>
