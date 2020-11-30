<template>
  <div id="roundChart" :style="{height:height,width:width}"></div>
</template>
<script>
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 按需引入 https://github.com/apache/incubator-echarts/blob/master/index.js
require('echarts/lib/chart/pie')
export default {
  data () {
    return {
      object: {},
      objectColumns: {},
      monthdata: [],
      sseStatus: 0,
      collapsed: true,
      float: 'right',
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
      this.chart = echarts.init(document.getElementById('roundChart'))
      this.setOptions(this.chartData)
    },
    setOptions ({ expectedData, actualData } = {}) {
      this.chart.setOption({
        toolbox: {
          show: false,
          feature: {
            mark: { show: true },
            dataView: { show: false, readOnly: false },
            magicType: {
              show: true,
              type: ['pie', 'funnel'],
              option: {
                funnel: {
                  x: '25%',
                  width: '50%',
                  funnelAlign: 'left',
                  max: 1548
                }
              }
            },
            restore: { show: false },
            saveAsImage: { show: false }
          }
        },
        calculable: true,
        series: [
          {
            name: '数据来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
                { value: 335, name: '新订单' },
                { value: 310, name: '新消息' },
                { value: 135, name: '新增供应商' },
                { value: 1548, name: '新增客户' }
            ]
          }
        ],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data: ['新订单', '新消息', '新增供应商', '新增客户']
        }
      })
    }
  }
}
</script>
