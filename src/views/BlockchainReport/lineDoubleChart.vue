<template>
  <div id="lineDoubleChart" :style="{height:height,width:width}"></div>
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
      height: '280%',
      noteMessage: [],
      noteMessage1: []
    }
  },
  props: {
    yName: String,
    fatherXData: Array,
    fatherYData: Array,
    fatherDetial: Array,
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
      this.chart = echarts.init(document.getElementById('lineDoubleChart'))
      this.setOptions(this.chartData)
    },
    setOptions ({ expectedData, actualData } = {}) {
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        title: { text: '结算单' },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ['交易数量', '金额']
        },
        xAxis: [
          {
            type: 'category',
            data: this.fatherXData,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        color: ['#4d73ff', '#00bfa5'],
        yAxis: [
          {
            type: 'value',
            name: '交易数量(个)',
            min: 0,
            max: this.maxNum,
            interval: this.maxNum / 5,
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: '金额(元)',
            min: 0,
            max: this.maxMoney,
            interval: this.maxMoney / 5,
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: '交易数量',
            type: 'bar',
            data: this.fatherYData
          },
          {
            name: '金额',
            type: 'line',
            yAxisIndex: 1,
            data: this.fatherDetial
          }
        ]
      })
    }
  }
}
</script>
