<template>
  <div id="lineChart" :style="{height:height,width:width}"></div>
</template>
<script>
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 按需引入 https://github.com/apache/incubator-echarts/blob/master/index.js
require('echarts/lib/chart/line')
export default {
  data () {
    return {
      object: {},
      objectColumns: {},
      monthdata: [],
      sseStatus: 0,
      collapsed: true,
      className: 'chart',
      width: '100%',
      height: '350px',
      noteMessage: [],
      noteMessage1: []
    }
  },
  mounted () {
    this.initChart()
  },
  created () {
  },
  methods: {
    initChart () {
      this.chart = echarts.init(document.getElementById('lineChart'))
      this.setOptions(this.chartData)
    },
    setOptions ({ expectedData, actualData } = {}) {
      this.chart.setOption({
        xAxis: {
          type: 'category',
          data: ['入库管理', '出库管理', '销售管理', '采购管理'],
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: [
          {
            type: 'value',
            name: '数量',
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
              formatter: '{value} 个'
            }
          },
          {
            type: 'value',
            name: '金额',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: '{value} $'
            }
          }
        ],
        legend: {
          data: ['expected', 'actual']
        },
        series: [
          {
            name: '',
            type: 'bar',
            data: [150, 120, 230, 100]
          },
          {
            name: '',
            type: 'bar',
            data: [100, 150, 120, 220]
          },
          {
            name: '',
            type: 'line',
            data: [150.0, 100.0, 175.5, 150.6]
          }]
      })
    }
  }
}
</script>
