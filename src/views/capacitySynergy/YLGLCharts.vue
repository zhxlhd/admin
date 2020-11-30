<template>
    <div class="ylglcharts">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="要料/供料图表" name="first">
                <div class="connet" v-show="show">
                    <div class="selinput">
                        <span>选择类型</span>
                        <el-select v-model="value" placeholder="请选择" @change="change(value)">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div id="main"></div>
                </div>
                <div class="tableList" v-show="show === false">
                    <i class="el-icon-arrow-left icon" @click="back()">返回</i>
                    <el-table
                            :data="tableData"
                            style="width: 100%;border-top: 1px solid #EAEDF4;"
                            :row-class-name="tableRowClassName"
                            v-infinite-scroll="load">
                        <el-table-column
                                type="index"
                                label="序号"
                                width="50"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                prop="supplierName"
                                label="供应商"
                                align="center"
                                width="200">
                        </el-table-column>
                        <el-table-column
                                prop="goodsCode"
                                label="物料编码"
                                align="center"
                                width="150">
                        </el-table-column>
                        <el-table-column
                                prop="goodsName"
                                align="center"
                                width="110"
                                label="物料名称">
                        </el-table-column>
                        <el-table-column
                                prop="planNum"
                                align="center"
                                label="要料数量"
                                width="110">
                        </el-table-column>
                        <el-table-column
                                prop="responseNum"
                                align="center"
                                width="110"
                                label="供料数量">
                        </el-table-column>
                        <el-table-column
                                prop="reqDate"
                                label="要料日期"
                                align="center"
                                width="110">
                        </el-table-column>
                        <el-table-column
                                prop="updateAt"
                                align="center"
                                width="110"
                                label="供料日期">
                        </el-table-column>
                        <el-table-column
                                prop="responseNum"
                                label="供应商产能"
                                align="center"
                                width="110">
                        </el-table-column>
                        <el-table-column
                                prop="percentage"
                                align="center"
                                width="110"
                                label="所占百分比">
                        </el-table-column>
                        <el-table-column
                                prop="specification"
                                align="center"
                                label="备注"
                                width="350">
                        </el-table-column>
                        <el-table-column
                                prop="status"
                                align="center"
                                label="状态">
                            <template slot-scope="scope">
                                <span :class="parseInt(scope.row.status) == 1 ? 'isActive' : 'active'">{{ parseInt(scope.row.status) == 1 ? '正常' : '风险' }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pag">
                        <el-pagination
                                background
                                layout="prev, pager, next"
                                :total="totalNum"
                                page-size="5"
                                @current-change="handleCurrentChange"
                                :current-page.sync="currentPage">
                        </el-pagination>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    export default {
        name: "YLGLCharts",
        data () {
            return {
                activeName: 'first',
                options: [{
                    label: '主营材料',
                    value: '主营材料'
                }], //select的数组
                value: '主营材料', //默认选中产品1
                show: true,  //true -- 显示图表   false -- 显示表单
                tableData: [],   //表格的数组
                totalNum: '',   //表格总条数
                pageNum: '1',   //表格当前所在的页码 -- 分页器上的数据
                goodName: '',  //选择的品名
                title: '主营材料',
                currentPage: 1,   //当前表格所在的页码  --  表格,
                type: 1
            }
        },
        methods: {
            handleClick (tab,event) {},
            change(val){
                this.title = val
                if (val === '主营材料') {
                    this.type = 1
                } else {
                    this.type = 2
                }
                this.initecharts()
            },
            //初始化图表
            initecharts () {
                var that = this
                this.$root.ajaxData('/purchase/production/businessReport', {
                    type: that.type
                }, function (res) {
                    console.log(res)
                    if (res.statusCode === 200){
                        var datas = []
                        var arr = []
                        var color = []
                        for(var i = 0;i<res.data.length;i++){
                            if (parseInt(res.data[i].alarm) == 1) {
                                arr.push('正常')
                                color.push('#F6F9FB')
                            } else {
                                arr.push('风险')
                                color.push('#FFDCE0')
                            }
                        }
                        for(var i = 0;i < res.data.length; i++) {
                            datas.push({
                                value: 125,
                                name: arr[i],
                                planNum: res.data[i].planNum,
                                large: res.data[i].large,
                                small: res.data[i].small,
                                goodsName: res.data[i].goodsName,
                                itemStyle: {
                                    color: color[i]
                                }
                            })
                        }
                        //初始化一个echarts实例
                        var myChart = echarts.init(document.getElementById('main'));
                        //制定图表的配置项和数据
                        var option = {
                            title: {
                                text: that.title,
                                textStyle: {
                                    fontSize: 20,
                                    color: '#1C99EE'
                                },
                                left: '43%',
                                top: 'middle'
                            },
                            //当鼠标在每一个选项上的时候显示的数据
                            tooltip: {
                                trigger: 'item',
                                formatter: function(params) {
                                    var str = `${params.data.goodsName}<br/>总要料：${params.data.planNum}<br/>供应商：${params.data.large.supplierName}（${params.data.large.percentage}%）<br/>产能：${params.data.small.supplierName}（${params.data.small.unreceiveQty}）`
                                    return str
                                },  //内容格式器
                            },
                            // color: ['red'],    //图例组件的颜色
                            //图例组件（展示不同系列的标记）
                            legend: {
                                //图例列表的布局朝向
                                // orient: 'horizontal', //horizontal -- 水平   vertical -- 垂直
                                // x: 'left',
                                data: ['正常', '风险'],
                                orient: 'horizontal',
                                x: 'left',
                                // data:['直接访问','邮件营销','联盟广告'],
                            },
                            series: [
                                {
                                    name: '状态',
                                    type:'pie',
                                    radius: ['30%', '96%'], //饼图的半径，数组的第一个是内半径的大小，第二个是外半径的大小
                                    avoidLabelOverlap: false, //是否防止标签重叠
                                    data:datas,
                                    label: {    //饼图图形上的文本标签
                                        show: parseInt(that.type) === 1 ? true : false,   //是否显示
                                        position: 'inside',   //显示的位置  inside--饼图扇区内部
                                        formatter: function(params) {
                                            let goodsName = ''
                                            let planNum = ''
                                            let lsupp = ''
                                            let ssupp = ''
                                            if (10<params.data.goodsName.length<20) {
                                                goodsName = '            '+ params.data.goodsName.slice(0,10) + '\n' +  '            ' +  params.data.goodsName.slice(10)
                                            } else if (params.data.goodsName.length > 20){
                                                goodsName = '                '+ params.data.goodsName.slice(0,10) + '\n' +  '            ' +  params.data.goodsName.slice(10,20) + '\n' +  '            ' +  params.data.goodsName.slice(20)
                                            } else {
                                                goodsName = '            ' + params.data.goodsName
                                            }
                                            if (params.data.planNum.length > 10) {
                                                planNum = params.data.planNum.slice(0,10) + '\n' + params.data.planNum.slice(10)
                                            } else {
                                                planNum = params.data.planNum
                                            }
                                            if (params.data.large.supplierName.length > 8) {
                                                lsupp = params.data.large.supplierName.slice(0,8) + '\n' + '              ' + params.data.large.supplierName.slice(8)
                                            } else {
                                                lsupp = params.data.large.supplierName
                                            }
                                            if (params.data.small.supplierName.length > 10) {
                                                ssupp = params.data.small.supplierName.slice(0,10) + '\n' + '              ' + params.data.small.supplierName.slice(10)
                                            } else {
                                                ssupp = params.data.small.supplierName
                                            }
                                            var str = '{goodsName|' + goodsName + '}\n{planNum|              总要料：' + planNum + '}\n{large|              供应商：' + lsupp + '(' + params.data.large.percentage + '%)}\n{small|              产能：' + ssupp + '(' + params.data.small.unreceiveQty + ')}'
                                            // var str = '{a|' + "test" + '}\n{b|总要料：' + "test" + '}\n{c|供应商：' + "test" + '(' + "test" + '%)}\n{d|产能：' + "test" + '(' + "test" + ')}'
                                            return str
                                        },
                                        color: '#101010',
                                        rich: {
                                            goodsName: {
                                                color: '#2a2a2a',
                                                fontWeight: '700',
                                                fontSize: 12,
                                                align: 'left',
                                                lineHeight: 13,
                                                padding: [0,0,-10,0]
                                            },
                                            planNum: {
                                                color: '#101010',
                                                fontSize: 10,
                                                align: 'left',
                                                lineHeight: 14
                                            },
                                            large: {
                                                color: '#101010',
                                                fontSize: 10,
                                                align: 'left',
                                                lineHeight: 14
                                            },
                                            small: {
                                                color: '#101010',
                                                fontSize: 10,
                                                align: 'left',
                                                lineHeight: 14
                                            }
                                        }
                                    },
                                    //标签视觉引导线
                                    labelLine: {
                                        normal: {
                                            show: false
                                        }
                                    },
                                    itemStyle: {
                                        borderColor: '#F2EAEA'
                                    }
                                }
                            ]
                        }
                        // 使用刚指定的配置项和数据显示图表。
                        myChart.setOption(option);
                        //点击每一块扇形发生的事件
                        myChart.on('click',function a(params){
                            that.show = false
                            that.goodName = params.data.goodsName
                            that.$root.ajaxData(`/purchase/production/businessReportList?goodsName=${params.data.goodsName}&pageNum=${that.pageNum}&pageSize=5`,{},function(res) {
                                if (res.statusCode === 200) {
                                    that.totalNum = res.total
                                    that.tableData = res.data
                                } else {
                                    this.$message.error('加载失败，请重试！');
                                }
                            })
                        })
                    } else {
                        this.$message.error('加载失败，请重试！');
                    }
                })
            },
            //点击返回
            back () {
                this.show = true
                this.currentPage = 1
                this.pageNum = 1
            },
            //表单行颜色显示   当该条数据为风险时为红色
            tableRowClassName ({row,rowIndex}) {
                console.log(row)
                if (parseInt(row.status) === 2) {
                    return 'ylglW'
                }
                return ''
            },
            //点击页数跳转到相应页数
            handleCurrentChange (val) {
                this.pageNum = val
                var that = this
                this.$root.ajaxData(`/purchase/production/businessReportList?goodsName=${this.goodName}&pageNum=${this.pageNum}&pageSize=5`,{},function(res) {
                    that.totalNum = res.total
                    that.tableData = res.data
                })
            }
        },
        mounted () {
            this.initecharts()
        }
    }
</script>

<style scoped lang="scss">
.ylglcharts {
    .selinput {
        padding: 22px 0 10px 40px;
        span {
            font-size: 14px;
            color: #101010;
            font-family: SourceHanSansSC-regular;
            padding-right: 22px;
        }
    }
    #main {
        width: 642px;
        height: 640px;
        margin: 0 auto;
    }
    .tableList {
        .icon {
            font-size: 14px;
            color: #606060;
            cursor: pointer;
            display: inline-block;
            padding-bottom: 46px;
            padding-top: 34px;
        }
        .isActive {
            color: #0094E9;
        }
        .active {
            color: #E51C23;
        }
        .pag {
            padding: 20px 0;
        }
    }
}
</style>

<style>
    .el-table .ylglW {
        background: #FFEFF0;
    }
</style>