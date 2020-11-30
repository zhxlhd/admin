<template>
    <div>
        <el-row>
            <el-form ref="form" :model="form" :rules="rules" label-width="150px">

                <el-row>
                    <!--标签模板-->
                    <el-col :sm="12" :md="8" :lg="8">
                        <el-form-item label="标签模板">
                            <el-select v-model="form.type" placeholder="标签模板">
                                <el-option label="标签" value="1"></el-option>
                                <el-option label="外箱标签" value="2"></el-option>
                                <el-option label="委外标签标签" value="3"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <!-- 供应商名称-->
                    <el-col :sm="12" :md="8" :lg="8">
                        <el-form-item label="供应商名称" prop="supplierName">
                            <el-input v-model="form.supplierName"></el-input>
                        </el-form-item>
                    </el-col>

                    <!-- 供应商代码-->
                    <el-col :sm="12" :md="8" :lg="8">
                        <el-form-item label="供应商代码" prop="supplierCode">
                            <el-input v-model="form.supplierCode"></el-input>
                        </el-form-item>
                    </el-col>

                    <!-- 费用代码-->
                    <el-col :sm="12" :md="8" :lg="8">
                        <el-form-item label="费用代码">
                            <el-input v-model="form.costCode"></el-input>
                        </el-form-item>
                    </el-col>

                    <!-- 物料编码-->
                    <el-col :sm="12" :md="8" :lg="8">
                        <el-form-item label="物料编码">
                            <el-input v-model="form.materielCode"></el-input>
                        </el-form-item>
                    </el-col>

                    <!--生产日期-->
                    <el-col :sm="12" :md="8" :lg="8">
                        <el-form-item label="生产日期">
                            <el-col>
                                <el-date-picker type="date" placeholder="选择日期" v-model="form.makeDate"
                                                style="width: 100%;"></el-date-picker>
                            </el-col>
                        </el-form-item>
                    </el-col>

                    <!--来料日期-->
                    <el-col :sm="12" :md="8" :lg="8">
                        <el-form-item label="来料日期">
                            <el-col>
                                <el-date-picker type="date" placeholder="选择日期" v-model="form.incomingDate"
                                                style="width: 100%;"></el-date-picker>
                            </el-col>
                        </el-form-item>
                    </el-col>

                    <!-- 批次流水-->
                    <el-col :sm="12" :md="8" :lg="8">
                        <el-form-item label="批次流水">
                            <el-input v-model="form.batchNum"></el-input>
                        </el-form-item>
                    </el-col>

                    <!-- 来料批次-->
                    <el-col :sm="12" :md="8" :lg="8">
                        <el-form-item label="来料批次">
                            <el-input readonly v-model="incomingBatchNum"></el-input>
                        </el-form-item>
                    </el-col>

                    <!--SN日期-->
                    <el-col :sm="12" :md="8" :lg="8">
                        <el-form-item label="SN日期">
                            <el-col>
                                <el-date-picker type="date" placeholder="选择日期" v-model="form.snDate"
                                                style="width: 100%;"></el-date-picker>
                            </el-col>
                        </el-form-item>
                    </el-col>

                    <!-- SN流水-->
                    <el-col :sm="12" :md="8" :lg="8">
                        <el-form-item label="SN流水">
                            <el-input v-model="form.sn"></el-input>
                        </el-form-item>
                    </el-col>

                    <!-- SN批次-->
                    <el-col :sm="12" :md="8" :lg="8">
                        <el-form-item label="SN批次">
                            <el-input readonly v-model="snBatchNum"></el-input>
                        </el-form-item>
                    </el-col>

                    <!-- 包装数量-->
                    <el-col :sm="12" :md="8" :lg="8">
                        <el-form-item label="包装数量">
                            <el-input v-model="form.qtv"></el-input>
                        </el-form-item>
                    </el-col>

                    <!-- 打印张数-->
                    <el-col :sm="12" :md="8" :lg="8">
                        <el-form-item label="打印张数">
                            <el-input v-model="form.printNum"></el-input>
                        </el-form-item>
                    </el-col>

                    <!-- 供应商Lot-->
                    <el-col :sm="12" :md="8" :lg="8">
                        <el-form-item label="供应商Lot">
                            <el-input v-model="form.lot"></el-input>
                        </el-form-item>
                    </el-col>

                    <!--spec-->
                    <el-col :sm="24" :md="24" :lg="24">
                        <el-form-item label="spec">
                            <el-input type="textarea" v-model="form.spec"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <!--按钮-->
                <el-row>
                    <el-col :sm="24" :md="24" :lg="24">
                        <el-form-item>
                            <el-button type="primary" @click="handleSubmit">打印</el-button>
                            <el-button type="info" @click="backward" v-if="!mate.inline">取消</el-button>
                            <el-button type="danger" @click="resetForm('ruleForm')">重 置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
        </el-row>
    </div>
</template>
<script>

    import treeSelect from './tree-select/tree.vue'
    import CountrySelect from './CountrySelect.vue'
    import Addrselect from './address/Addrselect'
    import {API_GATEWAY} from '@/config/index.js';
    import {DateFormat} from "../utils/util";

    export default {
        data() {
            return {
                form: {
                    supplierName: '',
                    supplierCode: '',
                    costCode: '',
                    materielCode: '',
                    makeDate: this.getDate(),
                    incomingDate: this.getDate(),
                    batchNum: '',
                    snDate: this.getDate(),
                    sn: '',
                    qtv: '',
                    printNum: '',
                    lot: '',
                    spec: '',
                    type: ''
                },
                rules: {
                    supplierName: [{required: true, message: '该输入项为必输项', trigger: 'blur'}], // 供应商编码
                    supplierCode: [{required: true, message: '该输入项为必输项', trigger: 'blur'}],  // 供应商编码
                    makeDate: [{required: true, message: '该输入项为必输项', trigger: 'blur'}]  // 生产日期
                }
            }
        },
        props: {
            word: {
                default: '提 交'
            },
            mate: Object,
            warehouseId: String,
            formModel: {
                type: String,
                default: 'page' // page or dialog
            },
            rowId: String,
            option: {
                type: Object,
                default: () => {
                }
            },
            treeDatas: {
                type: Object,
                default: () => {
                }
            }
        },
        watch: {},
        created() {

        },
        components: {
            CountrySelect,
            Addrselect,
            treeSelect,
            'w-editor': function index(resolve) {
                require(['./WEditor.vue'], resolve)
            },
            KCascader: function index(resolve) {
                require(['./KCascader.vue'], resolve)
            },
            'dict-selected': function index(resolve) {
                require(['./DictSelected.vue'], resolve)
            }
        },
        computed: {
            // a computed getter
            labelWidth: function () {
                let width = ''
                if (this.mate.inline) {
                    // width = undefined
                    width = '100px'
                } else if (typeof (this.mate.labelWidth) === 'undefined') {
                    width = '100px'
                } else if (this.mate.labelWidth === null) {
                    width = '120px'
                } else {
                    width = this.mate.labelWidth
                }
                return width
            },
            incomingBatchNum: function () {
                let supplierCode = this.form.supplierCode || '';
                let incomingDate = this.form.incomingDate || '';
                let batchNum = this.form.batchNum || '';
                let incomingDateFormat = DateFormat(incomingDate, 'yyMMdd');
                return '2' + supplierCode + incomingDateFormat + this.zeroFormat(batchNum);
            },
            snBatchNum: function () {
                let snDate = this.form.snDate || '';
                let sn = this.form.sn || 0;
                let snDateFormat = DateFormat(snDate, 'yyMMdd');
                if (sn < 10) {
                    sn = "000" + sn;
                } else if (sn < 100) {
                    sn = "00" + sn;
                } else if (sn < 1000) {
                    sn = "0" + sn;
                }
                return '2' + snDateFormat + sn;
            }
        },
        methods: {
            getDate() {
                // let day = new Date();
                // let newDate = day.getFullYear() + "-" + this.zeroFormat((day.getMonth() + 1)) + "-" + this.zeroFormat(day.getDay());
                return new Date();
            },
            zeroFormat(s) {
                return s = s < 10 ? '0' + s : s;
            },
            resetForm(formName) {
                this.$refs[formName].resetFields()
            },
            backward() {
                this.$emit('dialogCancel')
                if (this.formModel === 'page') {
                    this.$root.monitor({url: this.mate.next})
                }
            },
            handleSubmit() {
                this.$http({
                    url: API_GATEWAY + '/api/purchase/asn/labelPrint',
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
                        'Accept': 'application/json',
                        'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf8'
                    },
                    responseType: 'arraybuffer',
                    params: this.form
                }).then(function (response) {
                    var blob = new Blob([response.data], {type: 'application/pdf'})
                    var objectUrl = URL.createObjectURL(blob)
                    var a = document.createElement('a')
                    document.body.appendChild(a)
                    a.setAttribute('style', 'display:none')
                    a.setAttribute('href', objectUrl)
                    var windowOpen = window.open(objectUrl)
                    if (windowOpen == null || typeof (windowOpen) === 'undefined') {
                        this.$message({
                            message: '标签打印预览界面被拦截,请检查浏览器设置',
                            type: 'warning'
                        })
                    }
                })
                return

            }
        }
    }
</script>

<style scoped lang="scss">
    .el-form-item {
        margin: 15px 20px 2px 0px;
    }

    .el-form-item__error {
        top: inherit;
        left: inherit;
    }

    .el-form-item__label {
        line-height: inherit
    }

    .tbutton {
        margin: 3px 0;

        button {
            padding: 7px 15px;
            background-color: #fff;
            cursor: pointer;
        }
    }

    .el-form-item--mini.el-form-item {
        margin: 6px;
    }

    .el-input--mini .el-input__inner {
        width: 80%
    }

    .el-textarea {
        width: 100%
    }

    .el-input__suffix {
        right: 80px
    }

    .ats-tree .ats-input {
        width: 80%
    }

    .el-dialog__header {
        padding: 10px 10px 0;
    }

    .el-dialog__body {
        padding: 10px 10px;
    }

    .el-button--mini {
        padding: 7px 9px;
    }

    .el-date-editor.el-input, .el-date-editor.el-input__inner {
        width: 100%;
    }

    .el-cascader--mini {
        width: 100%
    }

    .el-select {
        width: 100%;
    }
</style>
