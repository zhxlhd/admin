<template>
    <div>
        <div style="margin-bottom:20px">
            <el-row :gutter="24">
                <el-form :label-position="labelPosition" :label-width="labelWidth" :model="simpleSearchForm"
                         size="mini">
                    <el-col :sm="5" :md="5" :lg="5">
                        <el-form-item label="客户PO号">
                            <el-input v-model="simpleSearchForm.custPo" placeholder="请填写客户PO号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :sm="5" :md="5" :lg="5">
                        <el-form-item label="客户料号">
                            <el-input v-model="simpleSearchForm.custMaterialCode" placeholder="请填写客户料号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :sm="5" :md="5" :lg="5">
                        <el-form-item label="业务实体">
                            <el-input v-model="simpleSearchForm.custOrg" placeholder="请填写业务实体"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :sm="5" :md="5" :lg="5">
                        <el-form-item label="供应商地址">
                            <el-input v-model="simpleSearchForm.supplierAddress" placeholder="请填写供应商地址"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :sm="5" :md="5" :lg="5">
                        <el-form-item label="收货方地址">
                            <el-input v-model="simpleSearchForm.custOrg" placeholder="请填写收货方地址"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :sm="5" :md="5" :lg="5">
                        <el-form-item label="收货方仓库">
                            <el-input v-model="simpleSearchForm.ebsInvSub" placeholder="请填写收货方仓库"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :sm="5" :md="5" :lg="5">
                        <el-form-item label="发运到期时间">
                            <el-select clearable v-model="simpleSearchForm.endTime">
                                <el-option :label="item.label" :value="item.value" v-for="item of endTimeOptions"
                                           :key="item.name"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :sm="6" :md="4" :lg="4">
                        <el-form-item>
                            <el-button @click="onSubmit" class="queryButton">查询</el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
        </div>
        <Boxer :mate="mate" :hasSelected="hasSelected" @action="handleButton" ref="Boxer">
    <span slot="search" class="leftMargin">
      <search-form v-if="mate.essearch" :essearch="mate.essearch" @essearch="todoEssearch"></search-form>
      <Formor v-else-if="mate.search" :mate="mate.search" v-on:search="search" class="leftFloat" :word="word"></Formor>
    </span>
            <div slot="main">
                <el-row>
                    <el-col :span="24">
                        <el-table size="mini" highlight-current-row ref="table" :data="mate.rows" border
                                  @selection-change="handleSelectionChange" @sort-change="sortChange"
                                  style="width: 100%;">
                            <el-table-column type="selection" width="50" id="tableSel"></el-table-column>
                            <el-table-column :formatter="col.formatter" v-for="col of mate.columns"
                                             v-bind:key="col.name" :label="col.label" :prop="col.name"
                                             :width="col.width" :sortable="col.sortable" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column label="操作" :min-width="actionWidth" v-if="mate.actions">
                                <template slot-scope="scope">
                                    <k-btn v-for="act of mate.actions" v-bind:key="act.action" size="mini" :act="act"
                                           :icon="act.icon" :row="scope.row" @action="handleAction"></k-btn>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="center" class="page">
                     <el-col :span="12" v-if="mate.page">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page.sync="mate.page"
                            layout="total,prev, pager, next, sizes"
                            :total="mate.total"
                            :page-sizes ="[5, 10, 15, 20, 50, 100]"
                            :page-size="pageSize">
                        </el-pagination>
                    </el-col>
                </el-row>
            </div>
        </Boxer>


    </div>
</template>

<script>

    import SearchForm from '../../components/SearchForm'
    import KBtn from '../../components/KBtn.vue'
    import Vue from 'vue'
    import {API_GATEWAY} from '@/config/index.js'
    import Boxer from '../../components/Boxer.vue'
    import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
    import {DateFormat, trimSpace} from '../../utils/util.js'

    const BASEAPI = `${API_GATEWAY}/api`
    export default {
        mixins: [ColumnFormatterMixin],
        components: {
            SearchForm,
            KBtn,
            Boxer,
            Formor: function index(resolve) {
                require(['../../components/Formor.vue'], resolve)
            }
        },
        props: {
            mate: Object,
            mateFormerHeaderId: String,
            KTableItemCode: String,
            mateFormCustomerId: String,
            mateFormCustomerName: String,
            mateFormOfficeId: String,
            poDespatchIds: Object
        },
        data() {
            return {
                labelWidth: '96px',
                simpleSearchValue: [],           //搜索封装的参数
                dtoList: {},                     //分页查询搜索封装参数
                pageSize: 5,
                currentPage: 1,
                multipleSelection: [],
                hasSelected: false,
                searchValues: {},
                page: 0,
                sortValues: {},
                action: null,
                dialogTableVisible: false,
                dialogPriceVisible: false,         // dialog开关
                tableData: [],
                word: '查 询',
                priceColumns: {},
                simpleSearchForm: {
                    custPo: '',
                    custMaterialCode: '',
                    custOrg: '',
                    endTime: '',
                    ebsInvSub: '',
                    supplierAddress: ""
                },
                endTimeOptions: [{
                    value: 'thisWeek',
                    label: '本周到期的发运'
                }, {
                    value: 'anyTime',
                    label: '任何时间到期的发运'
                }],
                object: {},                          // 放columns
                mingxiRows: [],
                priceList: {},                      // 明细行获取的数据
                invyTagDlgVisible: false,
                invyTagmate: {
                    startTagNo: '',
                    stolabel: '起始标签号',
                    incrementNumber: '',
                    inlabel: '数字增量',
                    numberOfTags: '',
                    numlabel: '标签数量'
                },
                physicalInventoryId: 0,
                colModels: [],
                dialogFile: false,
                fileList: [],
                customerId: '',
                fileimportUrl: API_GATEWAY + '/api/users/import',
                filedownloadUrl: API_GATEWAY + '/api/users/downloadFile',
                headers: {
                    'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
                    'Accept': 'application/json',
                    'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId
                }
            }
        },
        watch: {
            multipleSelection: function (newSelection) {
                this.hasSelected = (newSelection.length !== 0)
            },
            mate: function (newMate) {
                this.$nextTick(function () {
                    this.rowSelect()
                })
            }
        },
        created() {
            // this.getData()
            if (this.mate !== undefined && this.mate.dataApi !== undefined) {
                if (this.mate.dataApi.indexOf('/inventory/physical/snapshots/invyWatch/list') > -1 ||
                    this.mate.dataApi.indexOf('/inventory/physical/snapshots/invyApprove/list') > -1 ||
                    this.mate.dataApi.indexOf('/inventory/physical/snapshots/invyAdjust/list') > -1) {
                    if (this.mate.rows !== undefined && this.mate.rows.length > 0) {
                        this.physicalInventoryId = this.mate.rows[0].physicalInventoryId
                    }
                }
            }
        },
        computed: {
            actionWidth: function () {
                return this.mate.actions.length * 60 + 30
            }
        },
        mounted() {
            this.rowSelect()
        },
        // 需要添加刷新消息
        methods: {
            onSubmit() {
                //每次点击查询先把之前的查询条件清空
                this.simpleSearchValue = []
                if (trimSpace(this.simpleSearchForm.custPo) !== '' && this.simpleSearchForm.custPo != null) {
                    this.simpleSearchValue.push({
                        name: 'g.goods_name',
                        operator: '=',
                        value: this.simpleSearchForm.custPo,
                        andOrSymbol: 'and'
                    })
                }
                if (trimSpace(this.simpleSearchForm.custMaterialCode) !== '' && this.simpleSearchForm.custMaterialCode != null) {
                    this.simpleSearchValue.push({
                        name: 'l.supplier_material_code',
                        operator: '=',
                        value: this.simpleSearchForm.custMaterialCode,
                        andOrSymbol: 'and'
                    })
                }
                if (trimSpace(this.simpleSearchForm.custOrg) !== '' && this.simpleSearchForm.custOrg != null) {
                    this.simpleSearchValue.push({
                        name: 'g.ebs_org_name',
                        operator: '=',
                        value: this.simpleSearchForm.custOrg,
                        andOrSymbol: 'and'
                    })
                }
                if (trimSpace(this.simpleSearchForm.endTime) !== '' && this.simpleSearchForm.endTime != null) {
                    this.simpleSearchValue.push({
                        name: 'ifnull(t.promise_date,t.required_date)',
                        operator: '=',
                        value: this.simpleSearchForm.endTime,
                        andOrSymbol: 'and'
                    })
                }
                if (trimSpace(this.simpleSearchForm.ebsInvSub) !== '' && this.simpleSearchForm.ebsInvSub != null) {
                    this.simpleSearchValue.push({
                        name: 't.ebs_inv_sub',
                        operator: '=',
                        value: this.simpleSearchForm.ebsInvSub,
                        andOrSymbol: 'and'
                    })
                }
                if (trimSpace(this.simpleSearchForm.supplierAddress) !== '' && this.simpleSearchForm.supplierAddress != null) {
                    this.simpleSearchValue.push({
                        name: 'g.address',
                        operator: '=',
                        value: this.simpleSearchForm.supplierAddress,
                        andOrSymbol: 'and'
                    })
                }
                const mate = this.simpleSearchValue
                if (mate.length > 0) {
                    let len = mate.length
                    mate[len - 1].andOrSymbol = ''
                }
                this.dtoList.searchDtos = mate
                this.dtoList.selectedEbsPoDespatchIds = this.poDespatchIds
                const vm = this
                const url = '/purchase/goodsPricing/line/getPoLines-q?customerName=' + this.mateFormCustomerName + '&pageNum=' + this.page + '&pageSize=' + this.pageSize
                this.$root.ajaxData(url, this.dtoList, function (data) {
                    vm.mate.rows = data.mate.rows
                    vm.mate.total = data.mate.total
                }, 'POST')
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            },
            handleButton(btn) {
                var vm = this
                const row = {id: this.multipleSelection.map((r) => r.id)}
                let ids = row.id
                ids = ids.join()
                if (btn.action === 'import') {
                    // 发运行
                    this.$http({
                        url: API_GATEWAY + '/api/purchase/goodsPricing/line/poDespatch/export',
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
                            'Accept': 'application/json',
                            'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
                            'Content-Type': 'application/json;charset=utf8'
                        },
                        responseType: 'arraybuffer',
                        body: row.id
                    }).then(function (response) {
                        var blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
                        // blob(size,type) Blob构造函数，接受两个参数。第一个参数是一个包含实际数据的数组，第二个参数是数据的类型
                        var objectUrl = URL.createObjectURL(blob)
                        var a = document.createElement('a')
                        document.body.appendChild(a)
                        a.setAttribute('style', 'display:none')
                        a.setAttribute('href', objectUrl)
                        var filename = '发运行信息.xlsx'
                        a.setAttribute('download', filename)
                        a.click()
                        URL.revokeObjectURL(objectUrl)
                    })
                    return
                }
            },
            rowSelect() {
                if (this.mate.rows !== undefined) {
                    this.mate.rows.forEach(row => {
                        /* eslint-disable */
                        let select = (row.id && this.mate.selected && this.mate.selected.findIndex(id => id == row.id) !== -1)
                        /* eslint-enable */
                        this.$refs.table.toggleRowSelection(row, (select === true))
                    })
                }
                // this.mate.selected = [];
            },
            // table表格中勾选的选项，val是勾选的对象
            handleSelectionChange(val) {
                this.$emit('actionSelected', val)
                this.multipleSelection = val
            },
            handleSizeChange(val) {
                this.pageSize = val
                this.getData('daging')
            },
            handleCurrentChange(val) {
                this.page = val
                this.getData('paging')
            },
            handleAction(act, row) {
                var vm = this
                if (act.action === 'addPrice') {
                    this.dialogPriceVisible = true
                    this.mate.rows.priceList = row.priceList
                    return false
                }
            },
            getData(flag) {
                let url = ''
                if (this.mate.rows[0].soNum == null) {
                    url = '/purchase/goodsPricing/line/getPoLines'
                } else {
                    url = '/purchase/goodsPricing/line/getSoLines'
                }
                // 入库管理中，添加明细表单，删除刷新，需要带表头的id
                if (this.mate.dataApi === '/inbound/bill/lines/list') {
                    url = this.mate.dataApi + '/' + this.mateFormerHeaderId
                }
                let param = {
                    search: this.searchValues,
                    page: this.page,
                    sort: this.sortValues
                }

                var vm = this
                if (flag === 'search') {
                    if (this.mate.rows[0].soNum == null) {
                        url += '?param=' + this.mate.search.values.name
                    } else {
                        url += '-q?param=' + this.mate.search.values.name
                    }
                    this.$root.ajaxData(url, param, function (data) {
                        vm.updateData(data)
                    })
                    // 不用return，会有两次调用这个函数
                    return true
                }
                if (flag === 'paging') {
                    // url += '-q?' + (this.toUriParams(this.searchValues)) + '&' + (this.toUriParams(this.sortValues)) + '&pageNum=' + this.page
                    if (this.mate.rows[0].soNum == null) {
                        this.dtoList.selectedEbsPoDespatchIds = this.poDespatchIds
                        url += '-q?customerName=' + this.mateFormCustomerName + '&pageNum=' + this.page + '&pageSize=' + this.pageSize
                        this.$root.ajaxData(url, this.dtoList, function (data) {
                            vm.updateData(data)
                        }, 'POST')
                        param = null
                        return
                    } else {
                        url += '-q?customerId=' + this.mateFormCustomerId + '&officeId=' + this.mateFormOfficeId + '&pageNum=' + this.page + '&pageSize=' + this.pageSize
                    }
                    param = null
                }
                if (flag === 'daging') {
                    if (this.mate.rows[0].soNum == null) {
                        this.dtoList.selectedEbsPoDespatchIds = this.poDespatchIds
                        url += '-q?customerName=' + this.mateFormCustomerName + '&pageNum=' + this.page + '&pageSize=' + this.pageSize
                        this.$root.ajaxData(url, this.dtoList, function (data) {
                            vm.updateData(data)
                        }, 'POST')
                        param = null
                        return
                    } else {
                        url += '-q?customerId=' + this.mateFormCustomerId + '&officeId=' + this.mateFormOfficeId + '&pageNum=' + this.page + '&pageSize=' + this.pageSize
                    }
                    param = null
                }
                this.$root.ajaxData(url, param, function (data) {
                    vm.updateData(data)
                })
            },
            updateData(data) {
                if (data.mate.rows) {
                    this.mate.rows = data.mate.rows
                }
                // 获取到包括元数据的所有数据，因为数据量太大，上面只获取到明细行的元数据和数据
                // if (data.mate.mateList.rows) {
                //   this.mate.rows = data.mate.mateList.rows
                // }
                if (data.mate.total) {
                    this.mate.total = data.mate.total
                } else {
                    this.mate.total = 0
                }
                if (data.mate.selected) {
                    this.mate.selected = data.mate.selected
                }
                this.$nextTick(function () {
                    this.rowSelect()
                })
            },
            sortChange: function (sort) {
                if (!sort || !sort.column || !sort.column.sortable) {
                    return
                }
                this.sortValues = {
                    order: sort.order,
                    column: sort.prop
                }
                this.getData('sort')
            },
            search(data) {
                this.$emit('actionSearch', data)
                this.searchValues = data
                this.page = 0
                this.getData('search')
            },
            todoEssearch(data) {
                // this.$emit('essearch', data)
                this.searchValues = data
                const vm = this
                var url = vm.mate.essearch.url
                this.$root.ajaxData(url, JSON.stringify(data), function (data) {
                    vm.updateData(data)
                }, 'POST')
            },
            formatterBefore() {
                this.mate.columns.filter(col => col.dict !== undefined).forEach(function (col, i) {
                    let dictType = col.dict
                    if (dictType.indexOf('.') > -1) {
                        dictType = dictType.split('.')[1]
                    }
                    col.formatter = function (row, column) {
                        return DictStore.formatDict(dictType, row[column.property])
                    }
                })
            },
            getEtagStyle(v) {
                if (v) {
                    return 'success'
                }
                return 'gray'
            },
            toUriParams(data) {
                return Object.keys(data).filter(i => !!data[i]).map(i => i + '=' + data[i]).join('&')
            },
            backwardUser() {
                this.$root.monitor({url: '/users/list'})
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            }
        }
    }
</script>

<style scoped>
    .page {
        margin-top: 20px;
    }

    .main-block .search {
        display: inline-block;
        margin-left: 30px;
        margin-top: -13px;
    }

    .el-form--inline .el-form-item {
        margin-bottom: 0
    }

    .el-table .cell, .el-table th > div {
        padding-right: 0;
    }

    .leftMargin {
        float: left;
        margin-left: 10px;
    }

    .leftFloat form {
        display: inline-block;
    }

    .leftFloat div {
        display: inline-block;
        width: 250px;
        height: 38px;
        margin: 0px 15px 0 0;
    }

    .button {
        margin-top: 10px;
    }

    .el-form-item {
        margin: 22px 20px 2px 0;
    }

    .invyTagbtn {
        margin-top: 20px;
    }

    .el-table td, .el-table th {
        height: 30px;
    }

    .queryButton {
        transform: translateX(-100px);
    }
</style>
