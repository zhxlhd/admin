<template>
  <div id="lineSaleChart" :style="{height:height,width:width}"></div>
</template>
<script>
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 按需引入 https://github.com/apache/incubator-echarts/blob/master/index.js
require('echarts/lib/chart/line')
require('echarts/lib/chart/bar')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
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
      height: '280%'
    }
  },
  props: {
    yName: String,
    fatherXData: Array,
    fatherYData: Array,
    maxNum: Number,
    maxMoney: Number
  },
  mounted () {
    this.initChart()
  },
  created () {
  },
  watch: {
    fatherXData: function () {
      this.setOptions(this.chartData)
    },
    fatherYData: function () {
    }
  },
  methods: {
    initChart () {
      this.chart = echarts.init(document.getElementById('lineSaleChart'))
      this.setOptions(this.chartData)
    },
    setOptions ({ expectedData, actualData } = {}) {
      this.chart.setOption({
        xAxis: {
          type: 'category',
          data: this.fatherXData,
          axisPointer: {
            type: 'shadow'
          }
        },
        color: ['#84c34a', '#003366'],
        title: { text: '销售订单' },
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
            name: '交易数量',
            min: 0,
            max: this.maxNum,
            interval: this.maxNum / 5,
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        legend: {
          data: ['交易数量']
        },
        series: [
          {
            name: '交易数量',
            type: 'bar',
            data: this.fatherYData
          }
        ]
      })
    }
  }
}
</script>
