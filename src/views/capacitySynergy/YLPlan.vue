<template>
    <div>
        <el-row>
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="接收方" :abel-width="labelWidth">
                    <el-select v-model="jieshoufang" size="mini">
                        <el-option
                                v-for="item in jieshoufangOptions"
                                :key="item.receiveId"
                                :label="item.receiveName"
                                :value="item.receiveId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="业务实体" :label-width="labelWidth">
                    <el-select v-model="yewushiti" placeholder="选择事业部" size="mini" @change="changeYwst">
                        <el-option
                                v-for="item in yewushitiOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="要料计划版本号" :label-width="labelWidth" >
                    <el-select v-model="yljhbanbenhao" size="mini">
                        <el-option
                                v-for="item in yljhbanbenhaoOptions"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label-width="labelWidth">
                    <el-button size="mini" type="primary" @click="onSubmit">查询</el-button>
                    <el-button size="mini" type="danger" @click="onClear">清除</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-button size="mini" icon="el-icon-download" @click="daochu">导出</el-button>
            <el-button size="mini" icon="el-icon-upload2" @click="daoru">导入</el-button>
            <input type="file" ref="excelFile" style="display: none" @change="fileUpload"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
        </el-row>
        <el-table size="mini" highlight-current-row @row-click="rowClick" ref="table" :data="mate.mateList.rows" border @selection-change="handleSelectionChange" @sort-change="sortChange" style="width: 100%;">
            <!-- <el-table-column type="selection" width="50" id="tableSel"></el-table-column> -->
            <el-table-column :formatter="col.formatter" v-for="col of mate.mateList.columns" v-bind:key="col.name" :label="col.label" :prop="col.name" :width="col.width" :sortable="col.sortable" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作" :min-width="actionWidth" v-if="mate.mateList.actions">
                <template slot-scope="scope">
                    <k-btn v-for="act of mate.mateList.actions" v-bind:key="act.action" size="mini" :act="act" :icon="act.icon" :row="scope.row" @action="handleAction"></k-btn>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="收货地址" :visible.sync="dialogTableVisible">
            <el-table :data="detail"
                      size="mini"
                      border
                      height="400">
                <el-table-column property="lineNum" label="行号"></el-table-column>
                <el-table-column property="reqDate" label="要料日期"></el-table-column>
                <el-table-column property="weeks" label="周"></el-table-column>
                <el-table-column property="week" label="星期"></el-table-column>
                <el-table-column property="responseNum" label="回复数量"></el-table-column>
                <el-table-column property="actualNum" label="实际数量"></el-table-column>
                <el-table-column property="planNum" label="计划数量"></el-table-column>
            </el-table>
        </el-dialog>
        <el-row type="flex" justify="center" class="page">
            <el-col :span="12">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="page"
                        layout="sizes,prev, pager, next"
                        :total="mate.mateList.total"
                        :page-sizes ="[5, 10, 15, 20, 50]"
                        :page-size="pageSize">
                </el-pagination>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import { API_GATEWAY } from '@/config/index.js'

    export default {
        name: "YLPlan",
        props: ['mate'],
        data() {
            return {
                jieshoufang: '',
                jieshoufangOptions:[],
                yewushiti: '',
                yewushitiOptions:[],
                yljhbanbenhao: '',
                yljhbanbenhaoOptions:[],
                labelWidth: 'auto',
                pageSize:5,
                page:1,
                dialogTableVisible:false,
                detail:[],
                importUrl:''
            }
        },
        methods: {
            changeYwst(e){
                this.getYljhbbh(e)
            },
            onSubmit() {
                this.page = 1
                this.getData('paging')
            },
            onClear() {
                this.jieshoufang = ''
                this.yewushiti = ''
                this.yljhbanbenhao = ''
            },
            handleSizeChange (val) {
                this.pageSize = val
                this.getData('paging')
            },
            handleCurrentChange (val) {
                this.page = val
                this.getData('paging')
            },
            getData (flag) {
                var that=this
                this.$root.ajaxData('/purchase/plan/header/all/list-q',{
                    businessEntity:this.yewushiti,
                    version:this.yljhbanbenhao,
                    search:'',
                    pageNum:this.page,
                    pageSize:this.pageSize
                },function (res) {
                    that.mate.mateList.rows=res.mate.rows
                    that.mate.mateList.total=res.mate.total
                })
            },
            rowClick (row) {
                var that = this
                this.$root.ajaxData('/purchase/plan/line/all/'+row.id,{},function (res) {
                    that.detail=res
                    that.dialogTableVisible=true
                })
            },
            init(){
                this.getJsf()
                this.getYwst()
            },
            getJsf(){
                var that=this
                this.$root.ajaxData('/purchase/production/query/receive',{},function (res) {
                    that.jieshoufangOptions=res.data
                    that.jieshoufang=res.data[0]
                })
            },
            getYwst(){
                var that=this
                this.$root.ajaxData('/purchase/production/query/ou/names',{},function (res) {
                    that.yewushitiOptions=res
                })
            },
            getYljhbbh(businessEntity){
                var that=this
                this.$root.ajaxData('/purchase/production/query/versions',{businessEntity:businessEntity},function (res) {
                    that.yljhbanbenhaoOptions=res
                    that.yljhbanbenhao=res[0]
                })
            },
            daochu(){
                this.$http({
                    // url: API_GATEWAY + url + '&ids=' + rowt.id,
                    url: API_GATEWAY + '/api' + '/purchase/plan/header/export' + `?businessEntity=${this.yewushiti}&&version=${this.yljhbanbenhao}`,
                    method:'GET',
                    headers: {
                        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
                        'Accept': 'application/json',
                        'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf8'
                    },
                    // params: vm.searchForm,
                    responseType: 'arraybuffer'
                }).then(function (response) {
                    var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
                    // blob(size,type) Blob构造函数，接受两个参数。第一个参数是一个包含实际数据的数组，第二个参数是数据的类型
                    var objectUrl = URL.createObjectURL(blob)
                    var a = document.createElement('a')
                    document.body.appendChild(a)
                    a.setAttribute('style', 'display:none')
                    a.setAttribute('href', objectUrl)
                    var officeId = `${this.yewushiti}`
                    var officeName = ''
                    for(var i=0;i<this.yewushitiOptions.length;i++){
                        if(this.yewushitiOptions[i].value == officeId){
                            officeName = this.yewushitiOptions[i].label
                            break
                        }
                    }
                    var fileName = ''
                    if('' != officeName && '' != `${this.version.trim()}`){
                        fileName = officeName + '_' + `${this.version.trim()}` + '.xlsx'
                    }else{
                        fileName ='要料计划.xlsx'
                    }
                    a.setAttribute('download', fileName)
                    a.click()
                    URL.revokeObjectURL(objectUrl)
                })
                return
            },
            daoru(){
                this.$refs.excelFile.click()
                this.importUrl = '/purchase/plan/header/import'
            },
            fileUpload(file){
                var vm = this
                var formdata = new FormData()
                formdata.append('file', file.target.files[0])
                this.$http({
                    url: API_GATEWAY + '/api' + this.importUrl,
                    method: 'POST',
                    body: formdata
                    // responseType: 'arraybuffer'
                }).then(function (response) {
                    vm.$refs.excelFile.value = ''
                    if(response.body.statusCode == 200){
                        vm.$message({
                            type: 'success',
                            message: '导入成功'
                        })
                    }
                    if(response.body.statusCode == 500){
                        vm.$message({
                            type: 'success',
                            message: '导入失败'
                        })
                    }
                    setTimeout(function () {
                        vm.$root.monitor({ url: '/purchase/plan/header/all/list' })
                    }, 1000)
                })
            }
        },
        mounted() {
        },
        created() {
            this.init()
        }
    }
</script>

<style scoped>
    .el-row {
        margin-bottom: 20px;
    }
</style>
