<template>
    <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
    <div>
        <el-tabs v-model="activeName">
            <el-tab-pane label="要料/供料数量图" name="first">
                <div>
                    <el-select v-model="dateType" placeholder="请选择日期类型" size="mini">
                        <el-option label="按月查询" value="1"></el-option>
                        <el-option label="按季度查询" value="2"></el-option>
                    </el-select>

                    <el-date-picker
                            size="mini"
                            v-model="dateYear"
                            type="year"
                            value-format="yyyy"
                            placeholder="选择年">
                    </el-date-picker>

                    <el-button size="mini" type="primary" @click="onSubmit">查询</el-button>
                </div>

                <el-row>
                    <div id="barChart" style="width:100%;height:70vh;margin-top: 20px"></div>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="供料规格占比图" name="second">
                <el-row type="flex" class="row-bg" justify="center">
                        <div id="pieChart" style="width:100vh;height:70vh;"></div>
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import echarts from 'echarts'

    export default {
        name: "YLGLForm",
        watch: {
            dateYear: function () {
                console.log(this.dateYear)
            },
        },
        methods: {
            //获取饼状图数据
            getPieChart() {
                var that = this
                this.$root.ajaxData('/purchase/production/getMaterialProportion', {}, function (res) {
                    var datas = []
                    for (let i = 0; i < res.data.goodsNames.length; i++) {
                        datas.push({name: res.data.goodsNames[i], value: res.data.replaces[i]})
                    }

                    var option = {
                        // title : {
                        //     text: '供料规格占比',
                        //     subtext: '纯属虚构',
                        //     x:'center'
                        // },
                        tooltip: {
                            trigger: 'item',
                            formatter: "{b}({d}%)"
                        },
                        legend: {
                            orient: 'vertical',
                            left: 'left',
                            data: res.data.goodsNames,
                        },
                        series: [
                            {
                                name: '供料规格',
                                type: 'pie',
                                radius: '70%',
                                center: ['70%', '50%'],
                                data: datas,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    };
                    that.pieChart.setOption(option)
                })
            },
            //获取柱状图
            onSubmit() {
                var that = this
                this.$root.ajaxData('/purchase/production/getReportByDate', {
                    getType: this.dateType,
                    year: this.dateYear
                }, function (res) {
                    var option = {
                        color: ['#5CC9F5', '#4DB693'],
                        legend: {},
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            }
                        },
                        xAxis: [
                            {
                                type: 'category',
                                axisTick: {show: true},
                                data: res.data.mateXList,
                                name: '日期',
                                nameTextStyle: {
                                    fontWeight: 'bold',
                                    fontSize: 18,
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                name: '规格数量/个',
                                nameTextStyle: {
                                    fontWeight: 'bold',
                                    fontSize: 18,
                                }
                            }
                        ],
                        series: [
                            {
                                name: '要料数量',
                                type: 'bar',
                                barGap: 0,
                                data: res.data.planNumList
                            },
                            {
                                name: '供料数量',
                                type: 'bar',
                                data: res.data.responseNum
                            },
                        ]
                    }
                    that.barChart.setOption(option)
                })
            },
            initchart() {
                this.barChart = echarts.init(document.getElementById('barChart'));
                this.pieChart = echarts.init(document.getElementById('pieChart'));
                this.onSubmit()
                this.getPieChart()
            }
        },
        data() {
            return {
                dateYear: '2019',
                activeName: 'first',
                dateType: '1',
                barChart: '',
                pieChart: '',
            }
        },
        mounted() {
            this.initchart()
        }
    }
</script>

<style scoped>

</style>
