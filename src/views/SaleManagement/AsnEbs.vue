<template>
    <div>
        <div class="tbutton">
            <el-button plain class="el-icon-document" :disabled="submitDisabled" @click="handleSubmit">提 交</el-button>
            <el-button plain class="el-icon-close" @click="backward" v-if="!mate.inline">取 消</el-button>
            <el-button plain class="el-icon-date" @click="resetForm('ruleForm')">重 置</el-button>
        </div>
        <el-row>
            <el-form size="mini" :model="mate.mateFormerHeader.values" :inline="mate.inline"
                     :label-position="labelPosition" ref="ruleForm" :rules="rules" :label-width="labelWidth">
                <template>

                    <el-col :sm="12" :md="8" :lg="8">
                        <el-form-item :label="object['asnCode'].label" :prop="object['asnCode'].name">
                            <el-input disabled
                                      v-model="mate.mateFormerHeader.values[object['asnCode'].name]"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :sm="12" :md="8" :lg="8">
                        <el-form-item :label="object['totalWeightGross'].label" :prop="object['totalWeightGross'].name">
                            <el-input
                                    v-model="mate.mateFormerHeader.values[object['totalWeightGross'].name]"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :sm="12" :md="8" :lg="8">
                        <el-form-item :label="object['totalWeightNet'].label" :prop="object['totalWeightNet'].name">
                            <el-input type="number"
                                      v-model="mate.mateFormerHeader.values[object['totalWeightNet'].name]"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :sm="12" :md="8" :lg="8">
                        <el-form-item :label="object['totalCbm'].label" :prop="object['totalCbm'].name">
                            <el-input type="number"
                                      v-model="mate.mateFormerHeader.values[object['totalCbm'].name]"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :sm="12" :md="8" :lg="8">
                        <el-form-item :label="object['packCount'].label" :prop="object['packCount'].name">
                            <el-input type="number"
                                      v-model="mate.mateFormerHeader.values[object['packCount'].name]"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :sm="12" :md="8" :lg="8">
                        <el-form-item :label="object['officeId'].label" :prop="object['officeId'].name">
                            <el-select clearable v-model="mate.mateFormerHeader.values[object['officeId'].name]"
                                       :placeholder="object['officeId'].placeholder" @change="changeOfficeId">
                                <el-option :label="item.label" :value="item.value" v-for="item of officeIdOptions"
                                           :key="item.name"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :sm="12" :md="8" :lg="8">
                        <el-form-item :label="object['customerId'].label" :prop="object['customerId'].name">
                            <el-select clearable @visible-change="visibleChange" @change="changeCustomerName"
                                       v-model="mate.mateFormerHeader.values[object['customerId'].name]"
                                       :placeholder="object['customerId'].placeholder">
                                <el-option :label="item.label" :value="item.value" v-for="item of customerOptions"
                                           :key="item.name"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :sm="12" :md="8" :lg="8">
                        <el-form-item :label="object['deliveryOrderNo'].label" :prop="object['deliveryOrderNo'].name">
                            <el-input v-model="mate.mateFormerHeader.values[object['deliveryOrderNo'].name]"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :sm="12" :md="8" :lg="8">
                        <el-form-item :label="object['deliveryTime'].label" :prop="object['deliveryTime'].name">
                            <el-date-picker clearable type="date"
                                            v-model="mate.mateFormerHeader.values[object['deliveryTime'].name]"
                                            :editable="false"></el-date-picker>
                        </el-form-item>
                    </el-col>

                    <el-col :sm="12" :md="8" :lg="8">
                        <el-form-item :label="object['arrivalTime'].label" :prop="object['arrivalTime'].name">
                            <el-date-picker clearable type="date"
                                            v-model="mate.mateFormerHeader.values[object['arrivalTime'].name]"
                                            :editable="false"></el-date-picker>
                        </el-form-item>
                    </el-col>

                    <!--承运人-->
                    <el-col :sm="12" :md="8" :lg="8">
                        <el-form-item :label="object['carrier'].label" :prop="object['carrier'].name">
                            <el-input v-model="mate.mateFormerHeader.values[object['carrier'].name]"></el-input>
                        </el-form-item>
                    </el-col>

                    <!--运费条款-->
                    <el-col :sm="12" :md="8" :lg="8">
                        <el-form-item :label="object['freightClause'].label" :prop="object['freightClause'].name">
                            <dict-selected v-model="mate.mateFormerHeader.values[object['freightClause'].name]"
                                           dictType="freightClauseStatus"
                                           :initValue="mate.mateFormerHeader.values[object['freightClause'].name]"></dict-selected>
                        </el-form-item>
                    </el-col>

                    <!--陆运单/空运单编号-->
                    <el-col :sm="12" :md="8" :lg="8">
                        <el-form-item :label="object['deliveryCode'].label" :prop="object['deliveryCode'].name">
                            <el-input v-model="mate.mateFormerHeader.values[object['deliveryCode'].name]"></el-input>
                        </el-form-item>
                    </el-col>

                    <!--装箱单-->
                    <el-col :sm="12" :md="8" :lg="8">
                        <el-form-item :label="object['packList'].label" :prop="object['packList'].name">
                            <el-input v-model="mate.mateFormerHeader.values[object['packList'].name]"></el-input>
                        </el-form-item>
                    </el-col>

                    <!--是否来源ebs-->
                    <el-col :sm="12" :md="8" :lg="8" v-show="false">
                        <el-form-item label="是否来自EBS" prop="isEbs">
                            <el-radio-group v-model="isEbs">
                                <el-radio label="1">是</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>

                </template>
            </el-form>
        </el-row>

        <div class="fbutton">
            <el-button class="el-icon-plus" plain @click="add">新 增</el-button>
            <el-button class="el-icon-delete" plain @click="del" v-if="!mate.inline">删 除</el-button>
        </div>

        <el-dialog :title="titleInfo" :visible.sync="dialogListVisible" width="80%">
            <PurchaseOrderKtable :mate="dataKTable" @actionSelected="handleSelected"
                                 :mateFormCustomerId='mateFormCustomerId' :mateFormOfficeId='mateFormOfficeId'
                                 :mateFormCustomerName='mateFormCustomerName'
                                 :poDespatchIds='poDespatchIds'></PurchaseOrderKtable>
            <div class="fbutton">
                <el-button @click="dlgConfirm">确 定</el-button>
                <el-button @click="dlgCancel">取 消</el-button>
            </div>
        </el-dialog>

        <el-table size="mini" :data="list.rows" v-if="soTableFlag" @selection-change="lineSelected" border fit
                  highlight-current-row :rules="rules">

            <el-table-column type="selection" width="55">
            </el-table-column>

            <el-table-column :label="objectColumns['lineNum'].label" width="60">
                <template slot-scope="scope">
                    <span>{{scope.row[objectColumns['lineNum'].name]}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="objectColumns['soNum'].label" width="100">
                <template slot-scope="scope">
                    <span>{{scope.row[objectColumns['soNum'].name]}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="objectColumns['soLineNum'].label" width="100">
                <template slot-scope="scope">
                    <span>{{scope.row[objectColumns['soLineNum'].name]}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="objectColumns['poNo'].label" width="100">
                <template slot-scope="scope">
                    <span>{{scope.row[objectColumns['poNo'].name]}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="objectColumns['polineNo'].label" width="100">
                <template slot-scope="scope">
                    <span>{{scope.row[objectColumns['polineNo'].name]}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="objectColumns['pllShipmentNum'].label" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row[objectColumns['pllShipmentNum'].name]}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="objectColumns['itemCode'].label" width="150">
                <template slot-scope="scope">
                    <span>{{scope.row[objectColumns['itemCode'].name]}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="objectColumns['item'].label" width="150">
                <template slot-scope="scope">
                    <span>{{scope.row[objectColumns['item'].name]}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="objectColumns['supplierItem'].label" width="150">
                <template slot-scope="scope">
                    <span>{{scope.row[objectColumns['supplierItem'].name]}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="objectColumns['supplierItemName'].label" width="150">
                <template slot-scope="scope">
                    <span>{{scope.row[objectColumns['supplierItemName'].name]}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="objectColumns['orgName'].label" width="150">
                <template slot-scope="scope">
                    <span>{{scope.row[objectColumns['orgName'].name]}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="objectColumns['customerAddr1Name'].label" width="150">
                <template slot-scope="scope">
                    <span>{{scope.row[objectColumns['customerAddr1Name'].name]}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="objectColumns['qty'].label" width="120">
                <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row[objectColumns['qty'].name]"></el-input>
                </template>
            </el-table-column>

            <el-table-column :label="objectColumns['orderQty'].label" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row[objectColumns['orderQty'].name]}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="objectColumns['unit'].label" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row[objectColumns['unit'].name]}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="objectColumns['shippedQty'].label" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row[objectColumns['shippedQty'].name]}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="objectColumns['requestDate'].label" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row[objectColumns['requestDate'].name]}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="objectColumns['shipDate'].label" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row[objectColumns['shipDate'].name]}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="objectColumns['promiseDate'].label" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row[objectColumns['promiseDate'].name]}}</span>
                </template>
            </el-table-column>

        </el-table>

        <el-table size="mini" :data="list.rows" v-if="poTableFlag" @selection-change="lineSelected" border fit
                  highlight-current-row :rules="rules">

            <el-table-column type="selection" width="55">
            </el-table-column>

            <el-table-column :label="objectColumns['lineNum'].label" width="60">
                <template slot-scope="scope">
                    <span>{{scope.row[objectColumns['lineNum'].name]}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="objectColumns['poNo'].label" width="100">
                <template slot-scope="scope">
                    <span>{{scope.row[objectColumns['poNo'].name]}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="objectColumns['polineNo'].label" width="100">
                <template slot-scope="scope">
                    <span>{{scope.row[objectColumns['polineNo'].name]}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="objectColumns['pllShipmentNum'].label" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row[objectColumns['pllShipmentNum'].name]}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="objectColumns['supplierItem'].label" width="150">
                <template slot-scope="scope">
                    <span>{{scope.row[objectColumns['supplierItem'].name]}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="objectColumns['supplierItemName'].label" width="150">
                <template slot-scope="scope">
                    <span>{{scope.row[objectColumns['supplierItemName'].name]}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="objectColumns['endDate'].label" width="150">
                <template slot-scope="scope">
                    <span>{{scope.row[objectColumns['endDate'].name]}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="objectColumns['receiveOrgName'].label" width="150">
                <template slot-scope="scope">
                    <span>{{scope.row[objectColumns['receiveOrgName'].name]}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="objectColumns['ebsInvSub'].label" width="150">
                <template slot-scope="scope">
                    <span>{{scope.row[objectColumns['ebsInvSub'].name]}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="objectColumns['customerAddr1Name'].label" width="150">
                <template slot-scope="scope">
                    <span>{{scope.row[objectColumns['customerAddr1Name'].name]}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="objectColumns['qty'].label" width="120">
                <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row[objectColumns['qty'].name]"></el-input>
                </template>
            </el-table-column>

            <el-table-column :label="objectColumns['orderQty'].label" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row[objectColumns['orderQty'].name]}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="objectColumns['unit'].label" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row[objectColumns['unit'].name]}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="objectColumns['shippedQty'].label" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row[objectColumns['shippedQty'].name]}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="objectColumns['receiveQty'].label" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row[objectColumns['receiveQty'].name]}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="objectColumns['orderCancelledQty'].label" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row[objectColumns['orderCancelledQty'].name]}}</span>
                </template>
            </el-table-column>

        </el-table>

    </div>
</template>

<script>
    import {DateFormat, isPositiveinteger, isPositivenumber, trimSpace} from '../../utils/util.js'
    import {API_GATEWAY} from '@/config/index.js'
import { setInterval } from 'timers';

    export default {
        data() {
            var validateRequired = (rule, value, callback) => {
                if (value === undefined || value === null || trimSpace(value) === '') {
                    callback(new Error('该输入项为必输项'))
                } else {
                    callback()
                }
            }

            var validatePositiveinteger = (rule, value, callback) => {
                if (value === undefined || trimSpace(value) === '') {
                    callback(new Error('该输入项为必输项'))
                } else {
                    if (!isPositiveinteger(trimSpace(value))) {
                        callback(new Error('请输入正整数'))
                    } else {
                        callback()
                    }
                }
            }

            var validatePositivenumber = (rule, value, callback) => {
                if (value === undefined || trimSpace(value) === '') {
                    callback(new Error('该输入项为必输项'))
                } else {
                    if (!isPositivenumber(trimSpace(value))) {
                        callback(new Error('请输入正数'))
                    } else {
                        callback()
                    }
                }
            }
            return {
                submitDisabled: false,
                form: {},
                object: {},
                objectColumns: {},
                list: {},
                dataKTable: {},
                tmpRows: [],
                confrimRows: [],
                selectedLines: [],
                selectedRows: [],
                codeOptions: [],
                supplierOptions: [],
                officeIdOptions: [],
                mateFormCustomerId: this.mate.mateFormerHeader.customerId,
                mateFormCustomerName: '',
                mateFormOfficeId: '',
                poDespatchIds: [],
                customerOptions: [],
                destinationOptions: [],
                contactNameOptions: [],
                dialogListVisible: false,
                address: true,
                contactName: true,
                isEbs: '1',
                soTableFlag: true,
                poTableFlag: false,
                titleInfo: '选择销售订单|客户PO',
                returnQTy: '',
                rows: [],
                labelPosition: 'right',
                rules: {
                    officeId: [
                        {required: true, message: '该输入项为必输项'}
                    ],
                    supplierId: [
                        {required: true, message: '该输入项为必输项'},
                        {validator: validatePositiveinteger, trigger: 'change'},
                        {validator: validatePositiveinteger, trigger: 'blur'}
                    ],
                    // totalWeightGross: [
                    //   { required: true, message: '该输入项为必输项' },
                    //   { validator: validatePositivenumber, trigger: 'change' },
                    //   { validator: validatePositivenumber, trigger: 'blur' }
                    // ],
                    // totalWeightNet: [
                    //   { required: true, message: '该输入项为必输项' },
                    //   { validator: validatePositivenumber, trigger: 'change' },
                    //   { validator: validatePositivenumber, trigger: 'blur' }
                    // ],
                    // totalCbm: [
                    //   { required: true, message: '该输入项为必输项' },
                    //   { validator: validatePositivenumber, trigger: 'change' },
                    //   { validator: validatePositivenumber, trigger: 'blur' }
                    // ],
                    customerId: [
                        {required: true, message: '该输入项为必输项'},
                        {validator: validatePositiveinteger, trigger: 'change'},
                        {validator: validatePositiveinteger, trigger: 'blur'}
                    ]
                    // ,
                    // deliveryOrderNo: [
                    //   { required: true, message: '该输入项为必输项' },
                    //   { validator: validateRequired, trigger: 'change' }
                    // ]
                }
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
                    width = '120px'
                } else if (this.mate.labelWidth === null) {
                    width = '100px'
                } else {
                    width = this.mate.labelWidth
                }
                return width
            }
        },
        components: {
            PurchaseOrderKtable: function index(resolve) {
                require(['../../views/PurchasingManagement/PurchaseOrderKtable.vue'], resolve)
            },
            'dict-selected': function index(resolve) {
                require(['../../components/DictSelected.vue'], resolve)
            }
        },
        watch: {
            rows: {
                handler: function (val, old) {
                    var amount = 0
                    var packageAmount = 0
                    for (let j = 0; j < val.length; j++) {
                        var price = val[j].priceTax
                        var qty = val[j].qty
                        var pack = 0
                        if (!val[j].packQty) {
                            pack = 0
                        } else {
                            pack = parseInt(val[j].packQty)
                        }
                        amount = amount + price * qty
                        packageAmount = packageAmount + pack
                    }
                    // this.mate.mateFormerHeader.values.totalAmount = amount
                    // this.mate.mateFormerHeader.values.packCount = packageAmount
                },
                deep: true
            }
        },
        props: {
            mate: Object
        },
        created() {
            this.mate.mateFormerHeader.fields.map((i) => {
                this.object[i.name] = i
            })
            this.form = this.mate.mateFormerHeader
            this.list = this.mate.mateList
            this.list.columns.map((i) => {
                this.objectColumns[i.name] = i
            })
            this.getCustomer()// 获取客户
            this.getOfficeId()
        },
        methods: {
            // 获取到机构
            getOfficeId() {
                const vm = this
                this.$root.ajaxData('/users/office', {}, function (data) {
                    data.forEach(i => {
                        vm.officeIdOptions.push({'label': i.orgName, 'value': i.officeId})
                        if (!vm.mate.mateFormerHeader.values.id) {
                            vm.mate.mateFormerHeader.values.officeId = vm.officeIdOptions[0].value
                        }
                    })
                }, 'GET')
            },
            changeOfficeId(val) {
                this.mateFormOfficeId = val
            },
            // 客户更改时，后台需要customerName
            changeCustomerName(val) {
                this.mateFormCustomerId = val
                const option = this.customerOptions.find(function (item) {
                    if (item.value === val) {
                        return item
                    }
                })
                if (option !== undefined) {
                    this.mate.mateFormerHeader.values.customerName = option.label
                    this.mateFormCustomerName = this.mate.mateFormerHeader.values.customerName
                }
            },
            resetForm(formName) {
                this.$refs[formName].resetFields()
            },
            getCustomer() {
                var vm = this
                this.$root.ajaxData('/companys/companyInfo/4?status=1&auditStatus=1&nopaging=1&dataOnly=true', {}, function (data) {
                    for (let i = 0; i < data.length; i++) {
                        vm.customerOptions.push({label: data[i].name, value: data[i].id, key: data[i].id})
                    }
                }, 'GET')
            },
            // 获取客户然后获取客户的相关地址
            visibleChange(flag) {
                var vm = this
                this.address = false
                // 清空选项，不然每次点击都会push进去，会出现多条记录
                vm.destinationOptions = []
                this.mate.mateFormerHeader.values.destination = ''
                this.mate.mateFormerHeader.values.contactName = ''
                this.mate.mateFormerHeader.values.contactTelphone = ''
                this.mate.mateFormerHeader.values.contactAddress = ''
                if (this.mate.mateFormerHeader.values.customerId !== null) {
                    if (!flag) {
                        this.$root.ajaxData('/addresses/validAll/' + this.mate.mateFormerHeader.values.customerId, {}, function (data) {
                            // vm.options9 = data
                            for (let i = 0; i < data.length; i++) {
                                vm.destinationOptions.push({label: data[i].address, value: data[i].id, key: data[i].id})
                            }
                        }, 'GET')
                    }
                }
            },
            // 得到客户地址后获取客户下面的联系人
            visibleChangeAdress(flag) {
                var vm = this
                this.contactName = false
                vm.contactNameOptions = []
                this.mate.mateFormerHeader.values.contactName = ''
                this.mate.mateFormerHeader.values.contactTelphone = ''
                this.mate.mateFormerHeader.values.contactAddress = ''
                if (this.destinationOptions.length !== 0) {
                    if (!flag) {
                        this.$root.ajaxData('/contacts/all/' + this.mate.mateFormerHeader.values.destination, {}, function (data) {
                            // vm.options9 = data
                            for (let i = 0; i < data.length; i++) {
                                vm.contactNameOptions.push({
                                    label: data[i].name,
                                    value: data[i].id,
                                    phone: data[i].mobile,
                                    address: data[i].address
                                })
                            }
                        }, 'GET')
                    }
                }
            },
            // 获取联系人后 将联系人地址和电话带出来
            changeName(value) {
                try {
                    var obj = this.contactNameOptions.find((item) => {
                        return item.value === value
                    })
                    this.mate.mateFormerHeader.values.contactTelphone = obj.phone
                    this.mate.mateFormerHeader.values.contactAddress = obj.address
                } catch (e) {
                }
            },
            add() {
                let vm = this;
                if (this.mate.mateFormerHeader.values.customerId === null || this.mate.mateFormerHeader.values.customerId === '') {
                    vm.$message({
                        message: '请选择客户',
                        type: 'warning'
                    })
                    this.dialogListVisible = false
                    return
                }
                if (this.isEbs === '2') {
                    //不包含欣旺达 勾选销售订单
                    vm.poTableFlag = false
                    vm.soTableFlag = true
                    vm.titleInfo = '选择销售订单'
                } else {
                    vm.soTableFlag = false
                    vm.poTableFlag = true
                    vm.titleInfo = '请选择客户PO'
                }
                if (this.soTableFlag) {
                    if (this.mate.mateFormerHeader.values.officeId === null || this.mate.mateFormerHeader.values.officeId === '') {
                        vm.$message({
                            message: '请选择机构',
                            type: 'warning'
                        })
                        this.dialogListVisible = false
                        return
                    }
                    this.dialogListVisible = true
                    this.$root.ajaxData('/purchase/goodsPricing/line/getSoLines?customerId=' + this.mate.mateFormerHeader.values.customerId + '&officeId=' + this.mate.mateFormerHeader.values.officeId, {}, function (data) {
                        delete data.mate.btns
                        vm.dataKTable = data.mate
                    }, 'GET')
                }
                if (this.poTableFlag) {
                    this.dialogListVisible = true
                    let selectedPoDespatchIds = []
                    this.list.rows.length && this.list.rows.map(i => {
                        selectedPoDespatchIds.push(i.ebsPoDespatchId)
                    })
                    this.poDespatchIds = selectedPoDespatchIds
                    this.$root.ajaxData('/purchase/goodsPricing/line/getPoLines?customerName=' + this.mate.mateFormerHeader.values.customerName, selectedPoDespatchIds, function (data) {
                        //delete data.mate.btns
                        vm.dataKTable = data.mate
                    }, 'POST')
                }
                this.confrimRows = []
                if (this.list.rows.length === 0) {
                    this.tmpRows = []
                } else {
                    this.tmpRows = this.list.rows
                }
            },
            del() {
                var vm = this
                var rows = this.selectedLines
                if (rows.length === 0) {
                    vm.$message({
                        message: this.$t('selmdata'),
                        type: 'warning'
                    })
                    return
                } else {
                    for (let i = 0; i < this.list.rows.length; i++) {
                        for (let j = 0; j < this.selectedLines.length; j++) {
                            if (this.list.rows[i].lineNum === this.selectedLines[j].lineNum) {
                                this.list.rows.splice(i, 1)
                                //this.tmpRows.splice(i, 1)
                            }
                        }
                    }
                    for (var m = 0; m < this.list.rows.length; m++) {
                        this.list.rows[m].lineNum = m + 1
                    }
                    this.tmpRows = this.list.rows
                }
            },
            dlgConfirm(val) {
                var vm = this
                var rows = this.selectedRows
                if (rows.length === 0) {
                    vm.$message({
                        message: this.$t('selmdata'),
                        type: 'warning'
                    })
                    return
                } else {
                    if (rows.length !== 1) {
                        for (let i = 0; i <= rows.length - 2; i++) {
                            if (rows[i].orgName !== rows[i].orgName) {
                                vm.$message({
                                    message: '请选择同一发货库存组织',
                                    type: 'warning'
                                })
                                return
                            }
                            if (rows[i].customerAddr1 !== rows[i + 1].customerAddr1) {
                                vm.$message({
                                    message: '请选择同一收货地点',
                                    type: 'warning'
                                })
                                return
                            }
                            if (rows[i].receiveOrgId !== rows[i + 1].receiveOrgId) {
                                vm.$message({
                                    message: '请选择同一客户收货组织',
                                    type: 'warning'
                                })
                                return
                            }
                        }
                    }
                    for (let i = 0; i < rows.length; i++) {
                        // 将rows[i].poDespatchList中的id设置为空
                        rows[i].id = ''
                        this.confrimRows.push(rows[i])
                    }
                    var index = 0
                    while (this.confrimRows.length !== 0) {
                        if (index >= this.confrimRows.length) {
                            break
                        }
                        var j
                        for (j = 0; j < this.mate.mateList.rows.length; j++) {
                            if (this.poTableFlag) {
                                if (this.mate.mateList.rows[j].cusPo === this.confrimRows[index].cusPo && this.mate.mateList.rows[j].cusPoLineNum === this.confrimRows[index].cusPoLineNum) {
                                    this.confrimRows.splice(index, 1)
                                    break
                                }
                            }
                            if (this.soTableFlag) {
                                if (this.mate.mateList.rows[j].soNum === this.confrimRows[index].soNum && this.mate.mateList.rows[j].soLineNum === this.confrimRows[index].soLineNum) {
                                    this.confrimRows.splice(index, 1)
                                    break
                                }
                            }
                        }
                        if (j >= this.mate.mateList.rows.length) {
                            index++
                        }
                    }
                    this.tmpRows.push(...this.confrimRows)
                    this.list.rows = this.tmpRows
                    for (let j = 0; j < this.tmpRows.length; j++) {
                        var lineno = j + 1
                        if (this.tmpRows[j].shippedQty === null) {
                            this.tmpRows[j].shippedQty = 0
                        }
                        if (this.poTableFlag) {
                            var needShipQty = this.tmpRows[j].canShipQty
                        } else {
                            var needShipQty = this.tmpRows[j].outboundQty - this.tmpRows[j].soSendQty
                        }
                        this.list.rows[j].lineNum = lineno
                        this.list.rows[j].poNo = this.tmpRows[j].cusPo
                        this.list.rows[j].polineNo = this.tmpRows[j].cusPoLineNum
                        this.list.rows[j].item = this.tmpRows[j].itemName
                        this.list.rows[j].goodsId = this.tmpRows[j].itemId
                        this.list.rows[j].qty = needShipQty
                        this.list.rows[j].supplierItem = this.tmpRows[j].cusMaterialCode
                        this.list.rows[j].supplierItemName = this.tmpRows[j].cusMaterial
                        this.list.rows[j].needShipQty = needShipQty
                        this.list.rows[j].priceTax = this.tmpRows[j].price
                        // this.list.rows[j].goodsPricingHeaderId = this.tmpRows[j].ownerSheetId
                        // this.list.rows[j].goodsPricingLineId = this.tmpRows[j].ownerSheetLineId
                        // this.list.rows[j].returnQty = this.tmpRows[j].needShipQty
                    }
                    this.dialogListVisible = false
                    this.tmpRows = []
                }
                this.rows = this.list.rows
                var amount = 0
                for (let z = 0; z < this.list.rows.length; z++) {
                    var price = this.list.rows[z].priceTax
                    var qty = this.list.rows[z].qty
                    amount = amount + price * qty
                }
                this.mate.mateFormerHeader.values.totalAmount = amount
            },
            dlgCancel() {
                this.dialogListVisible = false
            },
            handleSelected(val) {
                this.selectedRows = val
            },
            async handleSubmit() {
                var mate = {}
                var vm = this

                this.submitDisabled = true


                var ruleRes = ''
                this.$refs['ruleForm'].validate((valid) => {
                    if (!valid) {
                        ruleRes = 'no'
                    }
                })

                if (ruleRes === 'no') {
                    vm.$message({
                        message: this.$t('Data Check No Pass'),
                        type: 'warning'
                    })
                    this.submitDisabled = false
                    return
                }

                if (this.list.rows.length === 0) {
                    vm.$message({
                        message: this.$t('Detailed data can not be empty'),
                        type: 'warning'
                    })
                    this.submitDisabled = false
                    return
                }
                if (this.list.rows.length !== 1) {
                    for (let z = 0; z <= this.list.rows.length - 2; z++) {
                        if (this.list.rows[z].orgId !== this.list.rows[z + 1].orgId) {
                            vm.$message({
                                message: this.$t('selectSame'),
                                type: 'warning'
                            })
                            this.submitDisabled = false
                            return
                        }
                    }
                }
                var chkmsg = ''
                var checkStatusFlag = 0
                for (var k = 0; k < this.list.rows.length; k++) {
                    // if (this.list.rows[k].shippingOrderNo === undefined || this.list.rows[k].shippingOrderNo === null || trimSpace(this.list.rows[k].shippingOrderNo) === '') {
                    //   chkmsg = '明细数据第' + this.list.rows[k].lineNum + '行的装箱单号不能为空'
                    //   break
                    // }
                    // if (this.list.rows[k].packQty === undefined || this.list.rows[k].packQty === null || trimSpace(this.list.rows[k].packQty) === '') {
                    //   chkmsg = '明细数据第' + this.list.rows[k].lineNum + '行的箱数不能为空'
                    //   break
                    // }
                    // if (!isPositiveinteger(trimSpace(this.list.rows[k].packQty))) {
                    //   chkmsg = '明细数据第' + this.list.rows[k].lineNum + '行的箱数必须为正整数'
                    //   break
                    // }
                    if (this.list.rows[k].qty <= 0) {
                        chkmsg = '明细数据第' + this.list.rows[k].lineNum + '行的数量小于等于0'
                        break
                    }
                    if (this.list.rows[k].qty > this.list.rows[k].needShipQty) {
                        chkmsg = '明细数据第' + this.list.rows[k].lineNum + '行的待发运数量不足'
                        break
                    }
                    if (this.list.rows[0].receiveOrgName !== this.list.rows[k].receiveOrgName) {
                        chkmsg = '请选择相同的收货组织'
                        break
                    }
                    if (this.list.rows[0].ebsInvSub !== this.list.rows[k].ebsInvSub) {
                        chkmsg = '请选择相同的收货仓库'
                        break
                    }

                    if (this.poTableFlag) {
                        checkStatusFlag = await this.$http({
                            url: API_GATEWAY + '/api/purchase/asn/getStateByNo?poNo=' + this.list.rows[k].poNo + '&polineNo=' + this.list.rows[k].polineNo + '&pllShipmentNum=' + this.list.rows[k].pllShipmentNum + '&lineNum=' + this.list.rows[k].lineNum,
                            method: 'GET',
                            headers: {
                                'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
                                'Accept': 'application/json',
                                'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
                                'Content-Type': 'application/json;charset=utf8'
                            },
                            responseType: 'application/json'
                        }).then(function (response) {
                            if (response.body.statusCode === 1) {
                                this.submitDisabled = false
                                return 1
                            } else {
                                this.submitDisabled = false
                                return 0
                            }
                        })
                        if (checkStatusFlag == 1) {
                            chkmsg = '明细数据第' + vm.list.rows[k].lineNum + '行是待处理的ASN发运行，不能创建'
                            break
                        }
                    }
                }

                if (chkmsg !== '') {
                    vm.$message({
                        message: chkmsg,
                        type: 'warning'
                    })
                    this.submitDisabled = false
                    return
                }

                this.form.values.deliveryTime = DateFormat(this.form.values.deliveryTime, 'yyyy-MM-dd')
                this.form.values.arrivalTime = DateFormat(this.form.values.arrivalTime, 'yyyy-MM-dd')
                this.form.values.billType = '0'
                mate.mateFormerHeader = this.form.values
                mate.mateList = this.list.rows
                if (this.mate.mateFormerHeader.method === 'POST') {
                    this.$root.ajaxData('/purchase/asn/batchSave', mate, function (data) {
                        if (data.statusCode == 200) {
                            vm.$message({
                                message: data.message,
                                type: 'success'
                            })
                        } else {
                            vm.$message({
                                message: data.message,
                                type: 'warning'
                            })
                        }
                        vm.$root.monitor({url: '/purchase/asn/all/list'})
                        vm.submitDisabled = false
                    }, 'POST')
                } else {
                    this.$root.ajaxData('/purchase/asn/batchUpdate' + '/' + mate.mateFormerHeader.id, mate, function () {
                        vm.$root.monitor({url: '/purchase/asn/all/list'})
                        vm.submitDisabled = false
                    }, 'PUT')
                }
            },
            backward() {
                this.$root.monitor({url: '/purchase/asn/all/list'})
            },
            lineSelected(val) {
                this.selectedLines = val
            },
            changeCode(value, lineNum) {
                try {
                    var obj = this.codeOptions.find((item) => {
                        this.submitDisabled = false
                        return item.value === value
                    })
                    this.list.rows[lineNum - 1].goodsId = obj.key
                    this.list.rows[lineNum - 1].item = obj.label
                } catch (e) {
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .el-form--inline > * {
        margin-right: 10px
    }

    .el-form-item__label {
        line-height: inherit
    }

    .el-form-item {
        margin: 15px 20px 2px 0px;
    }

    .leftFloat .el-row {
        float: left;
        width: 250px;
    }

    .leftFloat .el-row input {
        width: 250px;
    }

    .leftFloat .el-form-item {
        margin: 0;
    }

    .leftFloat .button {
        float: left;
    }

    .el-form--inline .el-form-item {
        width: 200px;
        display: inline-block;
        margin-right: 10px;
        vertical-align: top;
    }

    .el-form-item.is-required .el-form-item__label:before {
        content: ''
    }

    .el-form-item.is-required .el-form-item__label:after {
        content: '*';
        color: #ff4949;
        margin-right: 4px;
    }

    .el-cascader {
        width: 100%;
    }

    .el-select {
        width: 100%;
    }

    .hidden {
        display: none;
    }

    .el-input__suffix {
        right: 80px
    }

    .el-form-item--mini.el-form-item {
        margin: 6px;
    }

    .el-input--mini .el-input__inner {
        width: 80%
    }

    h4 {
        margin-top: 40px;
        margin-bottom: 10px;
    }

    .el-select {
        width: 100%;
    }

    .el-date-editor.el-input {
        width: 100%;
    }

    .el-form--inline.el-form--label-top .el-form-item__content {
        width: 90%
    }

    .leftFloat .el-form--inline .el-form-item {
        margin-right: 10px;
    }

    .sbutton {
        margin-top: 50px;
    }

    .tbutton {
        margin: 3px 0;

        button {
            padding: 7px 15px;
            background-color: #fff;
            cursor: pointer;
        }
    }

    .fbutton {
        margin: 5px 0;

        button {
            padding: 7px 15px;
            background-color: #fff;
            cursor: pointer;
        }
    }
</style>
