<!-- 发运通知新增 -->
<template>
  <div>
    <div class="tbutton">
      <el-button size="mini" type="primary" class="el-icon-document" :disabled="submitDisabled" @click="handleSubmit">提 交</el-button>
      <el-button size="mini" type="danger" class="el-icon-close" @click="backward" v-if="!mate.inline">取 消</el-button>
      <el-button size="mini" type="primary" class="el-icon-refresh" @click="resetForm('ruleForm')">重 置</el-button>
    </div>
    <el-row>
      <el-form
        size="mini"
        :model="mate.mateFormerHeader.values"
        :inline="mate.inline"
        :label-position="labelPosition"
        ref="ruleForm"
        :rules="rules"
        :label-width="labelWidth"
        >
        <template>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['asnCode'].label" :prop="object['asnCode'].name">
              <el-input disabled v-model="mate.mateFormerHeader.values[object['asnCode'].name]"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item
            	:label="object['totalWeightGross'].label"
              :prop="object['totalWeightGross'].name"
            >
              <el-input v-model="mate.mateFormerHeader.values[object['totalWeightGross'].name]"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item
              :label="object['totalWeightNet'].label"
              :prop="object['totalWeightNet'].name"
            >
              <el-input
                type="number"
                v-model="mate.mateFormerHeader.values[object['totalWeightNet'].name]"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['totalCbm'].label" :prop="object['totalCbm'].name">
              <el-input
                type="number"
                v-model="mate.mateFormerHeader.values[object['totalCbm'].name]"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['packCount'].label" :prop="object['packCount'].name">
              <el-input
                type="number"
                v-model="mate.mateFormerHeader.values[object['packCount'].name]"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['officeId'].label" :prop="object['officeId'].name">
              <el-select
                clearable
                v-model="mate.mateFormerHeader.values[object['officeId'].name]"
                :placeholder="object['officeId'].placeholder"
                @change="changeOfficeId"
              >
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="item of officeIdOptions"
                  :key="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['customerId'].label" :prop="object['customerId'].name">
              <el-select
                clearable
                @visible-change="visibleChange"
                @change="changeCustomerName"
                v-model="mate.mateFormerHeader.values[object['customerId'].name]"
                :placeholder="object['customerId'].placeholder"
              >
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="item of customerOptions"
                  :key="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- <el-col :sm="12" :md="8" :lg="8">
            <el-form-item
              :label="object['deliveryOrderNo'].label"
              :prop="object['deliveryOrderNo'].name"
            >
              <el-input v-model="mate.mateFormerHeader.values[object['deliveryOrderNo'].name]"></el-input>
            </el-form-item>
          </el-col> -->
          <!-- 发运日期 -->
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['deliveryTime'].label" :prop="object['deliveryTime'].name">
              <el-date-picker
                clearable
                type="date"
                v-model="mate.mateFormerHeader.values[object['deliveryTime'].name]"
                :editable="false"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <!-- 预约到达时间 -->
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['arrivalTime'].label" :prop="object['arrivalTime'].name">
              <el-date-picker
                clearable
                type="date"
                v-model="mate.mateFormerHeader.values[object['arrivalTime'].name]"
                :editable="false"
                :picker-options="pickerOptionsEnd"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <!--承运人-->
          <!-- <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['carrier'].label" :prop="object['carrier'].name">
              <el-input v-model="mate.mateFormerHeader.values[object['carrier'].name]"></el-input>
            </el-form-item>
          </el-col> -->

          <!--运费条款-->
          <!-- <el-col :sm="12" :md="8" :lg="8">
            <el-form-item
              :label="object['freightClause'].label"
              :prop="object['freightClause'].name"
            >
              <dict-selected
                v-model="mate.mateFormerHeader.values[object['freightClause'].name]"
                dictType="freightClauseStatus"
                :initValue="mate.mateFormerHeader.values[object['freightClause'].name]"
              ></dict-selected>
            </el-form-item>
          </el-col> -->

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
          <!--org_id-->
          <!-- <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['shipToOrgId'].label" :prop="object['shipToOrgId'].name">
              <el-input v-model="mate.mateFormerHeader.values[object['shipToOrgId'].name]"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :sm="12" :md="8" :lg="8" v-show="false">
            <el-form-item label="是否来自EBS" prop="isEbs">
              <el-radio-group v-model="isEbs" @change="changeRadio">
                <el-radio label="2">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </template>
      </el-form>
    </el-row>

    <div class="fbutton">
      <el-button size="mini" type="primary" class="el-icon-plus" @click="add">新 增</el-button>
      <el-button size="mini" type="danger" class="el-icon-delete" @click="del" v-if="!mate.inline">删 除</el-button>
      <el-button size="mini" type="primary" class="el-icon-download" @click="downloadTemplate">下载模板</el-button>
      <el-button size="mini" type="primary" class="el-icon-upload2" @click="leadIn">导入</el-button>
    </div>
    <input type="file" ref="excelFile" style="display: none" @change="fileUpload" accept=".xlsx, .xls">
    <el-dialog :title="titleInfo" v-if="dialogListVisible" :visible.sync="dialogListVisible" width="80%">
      <SupplierPortalPoKtable
        :mate="dataKTable"
        @actionSelected="handleSelected"
        :mateFormCustomerId="mateFormCustomerId"
        :mateFormOfficeId="mateFormOfficeId"
        :mateFormCustomerName="mateFormCustomerName"
        :poDespatchIds="poDespatchIds"
      ></SupplierPortalPoKtable>
      <div class="fbutton">
        <el-button @click="dlgConfirm">确 定</el-button>
        <el-button @click="dlgCancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-table
      size="mini"
      :data="list.rows"
      v-if="soTableFlag"
      @selection-change="lineSelected"
      border
      stripe>
      <el-table-column show-overflow-tooltip type="selection" width="55"></el-table-column>
      <el-table-column show-overflow-tooltip :label="objectColumns['customerName'].label" :prop="objectColumns['customerName'].name" width="140">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['customerName'].name]}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip :label="objectColumns['poNum'].label" :prop="objectColumns['poNum'].name" width="140">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['poNum'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip :label="objectColumns['lineNum'].label" width="60">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['lineNum'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip :label="objectColumns['lineLocationId'].label" width="100">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['lineLocationId'].name]}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip :label="objectColumns['itemNum'].label" width="100">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['itemNum'].name]}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip :label="objectColumns['itemDescription'].label" width="300">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['itemDescription'].name]}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip :label="objectColumns['dueDate'].label" width="120">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['dueDate'].name]}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip :label="objectColumns['orderedQuantity'].label" width="150">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['orderedQuantity'].name]}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip :label="objectColumns['shippedQuantity'].label" width="170">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['shippedQuantity'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip :label="objectColumns['acceptQuantity'].label" width="150">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['acceptQuantity'].name]}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip :label="objectColumns['shippableQuantity'].label" width="120">
        <template slot-scope="scope">
          <el-input type="number" :min="1" size="mini" v-model="scope.row[objectColumns['shippableQuantity'].name]" @change="changeShippableQuantity"></el-input>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip :label="objectColumns['unit'].label" width="150">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['unit'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip :label="objectColumns['acceptGoodsLocation'].label" width="150">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['acceptGoodsLocation'].name]}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip :label="objectColumns['acceptWarehouse'].label" width="220">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['acceptWarehouse'].name]}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip :label="objectColumns['orgName'].label" width="180">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['orgName'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip :label="objectColumns['acceptGoodsOrgName'].label" width="180">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['acceptGoodsOrgName'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip :label="objectColumns['currencyCode'].label" width="120">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['currencyCode'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip :label="objectColumns['supplierLocation'].label" width="120">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['supplierLocation'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip :label="objectColumns['ifAllocate'].label" width="120">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['ifAllocate'].name]}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip :label="objectColumns['lineRemark'].label" width="250">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['lineRemark'].name]}}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-table
      size="mini"
      :data="list.rows"
      v-if="poTableFlag"
      @selection-change="lineSelected"
      border
      stripe
      show-overflow-tooltip>
      <el-table-column show-overflow-tooltip type="selection" width="55"></el-table-column>

      <el-table-column show-overflow-tooltip :label="objectColumns['lineNum'].label" width="60">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['lineNum'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip :label="objectColumns['poNo'].label" width="100">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['poNo'].name]}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip :label="objectColumns['polineNo'].label" width="100">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['polineNo'].name]}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip :label="objectColumns['pllShipmentNum'].label" width="120">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['pllShipmentNum'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip :label="objectColumns['supplierItem'].label" width="150">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['supplierItem'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip :label="objectColumns['supplierItemName'].label" width="150">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['supplierItemName'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip :label="objectColumns['endDate'].label" width="150">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['endDate'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip :label="objectColumns['receiveOrgName'].label" width="150">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['receiveOrgName'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip :label="objectColumns['ebsInvSub'].label" width="150">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['ebsInvSub'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip :label="objectColumns['customerAddr1Name'].label" width="150">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['customerAddr1Name'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip :label="objectColumns['qty'].label" width="120">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row[objectColumns['qty'].name]"></el-input>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip :label="objectColumns['orderQty'].label" width="120">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['orderQty'].name]}}</span>
        </template>
      </el-table-column>
      
      <el-table-column show-overflow-tooltip :label="objectColumns['unit'].label" width="120">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['unit'].name]}}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip :label="objectColumns['shippableQuantity'].label" width="120">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['shippableQuantity'].name]}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip :label="objectColumns['receiveQty'].label" width="120">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['receiveQty'].name]}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip :label="objectColumns['orderCancelledQty'].label" width="120">
        <template slot-scope="scope">
          <span>{{scope.row[objectColumns['orderCancelledQty'].name]}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { DateFormat, trimSpace, isPositiveinteger, isPositivenumber } from "../../utils/util.js";
import { API_GATEWAY } from '@/config/index.js';
import axios from '@/utils/http'; // 导入http中创建的axios实例
import XLSX from 'xlsx'

export default {
  data() {
    var validateRequired = (rule, value, callback) => {
      if (value === undefined || value === null || trimSpace(value) === "") {
        callback(new Error("该输入项为必输项"));
      } else {
        callback();
      }
    };

    var validatePositiveInteger = (rule, value, callback) => {
      if (value === undefined || trimSpace(value) === "") {
        callback(new Error("该输入项为必输项"));
      } else {
        if (!isPositiveinteger(trimSpace(value))) {
          callback(new Error("请输入正整数"));
        } else {
          callback();
        }
      }
    };

    var validatePositivenumber = (rule, value, callback) => {
      if (value === undefined || trimSpace(value) === "") {
        callback(new Error("该输入项为必输项"));
      } else {
        if (!isPositivenumber(trimSpace(value))) {
          callback(new Error("请输入正数"));
        } else {
          callback();
        }
      }
    };
    return {
      tableHeader: [], // 导入 excel 头部
      tableData: [], // 导入 excel 数据
      submitDisabled: false,
      form: {},
      object: {},
      objectColumns: {},
      list: {},
      dataKTable: {},
      tmpRows: [],
      confirmRows: [],
      selectedLines: [],
      selectedRows: [],
      codeOptions: [],
      supplierOptions: [],
      officeIdOptions: [],
      mateFormCustomerId: this.mate.mateFormerHeader.customerId,
      mateFormCustomerName: "",
      mateFormOfficeId: "",
      poDespatchIds: [],
      customerOptions: [],
      destinationOptions: [],
      contactNameOptions: [],
      dialogListVisible: false,
      address: true,
      contactName: true,
      isEbs: "2",
      soTableFlag: true,
      poTableFlag: false,
      titleInfo: "选择销售订单",
      returnQTy: "",
      rows: [],
      labelPosition: "right",
      rules: {
        // packCount: [{ required: true, message: "该输入项为必输项", trigger: 'blur'  }],
        // officeId: [{ required: true, message: "该输入项为必输项", trigger: 'blur'  }],
        deliveryTime: [{ required: true, message: "该输入项为必输项", trigger: 'blur'  }],
        arrivalTime: [{ required: true, message: "该输入项为必输项", trigger: 'blur'  }],
        // supplierId: [
        //   { required: true, message: "该输入项为必输项" },
        //   { validator: validatePositiveInteger, trigger: "change" },
        //   { validator: validatePositiveInteger, trigger: "blur" }
        // ],
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
          { required: true, message: "该输入项为必输项" },
          { validator: validatePositiveInteger, trigger: "change" },
          { validator: validatePositiveInteger, trigger: "blur" }
        ],
        // deliveryCode: [
        //   { required: true, message: '该输入项为必输项', trigger: 'blur'  }
        // ],
        // packList: [
        //   { required: true, message: '该输入项为必输项', trigger: 'blur'  }
        // ]

      },
      importUrl: '/supplier-portal/shippablePo/export',           // 导入url
      /** 
       * 预约送货时间不能大于预约到达时间,可以为今天
       */
      pickerOptionsStart: {
        disabledDate: (time) => {
          // 拿预约到达时间
          let arrivalTime = this.mate.mateFormerHeader.values['arrivalTime'];
          if (arrivalTime) {
            return time.getTime() > arrivalTime || time.getTime() < Date.now() - 8.64e7;
          } else {
            return time.getTime() < Date.now() - 8.64e7;
          }
        }
      },
      // 发运日期 不能大于当天
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() > Date.now();
        }
      },
      // 预计送达 不能小于当天
      pickerOptionsEnd: {
        disabledDate: (time) => {
          // 拿预约送货时间
          // let deliveryTime = this.mate.mateFormerHeader.values['deliveryTime'];
          // if(deliveryTime){
          //   return time.getTime() < deliveryTime;
          // }else{
            return time.getTime() < Date.now() - 8.64e7;
          // }
        }
      },
      isAdd: false,   // 是否新增
      isLeadIn: false,// 是否导入
    };
  },
  computed: {
    // a computed getter
    labelWidth: function() {
      let width = "";
      if (this.mate.inline) {
        // width = undefined
        width = "100px";
      } else if (typeof this.mate.labelWidth === "undefined") {
        width = "120px";
      } else if (this.mate.labelWidth === null) {
        width = "100px";
      } else {
        width = this.mate.labelWidth;
      }
      return width;
    }
  },
  components: {
    SupplierPortalPoKtable: function index(resolve) {
      require([
        "../../views/SupplierPortal/SupplierPortalPoKtable.vue"
      ], resolve);
    },
    "dict-selected": function index(resolve) {
      require(["../../components/DictSelected.vue"], resolve);
    }
  },
  watch: {
    rows: {
      handler: function(val, old) {
        var amount = 0;
        var packageAmount = 0;
        for (let j = 0; j < val.length; j++) {
          var price = val[j].priceTax;
          var qty = val[j].qty;
          var pack = 0;
          if (!val[j].packQty) {
            pack = 0;
          } else {
            pack = parseInt(val[j].packQty);
          }
          amount = amount + price * qty;
          packageAmount = packageAmount + pack;
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
    this.mate.mateFormerHeader.fields.map(i => {
      this.object[i.name] = i;
    });
    this.form = this.mate.mateFormerHeader;
    this.list = this.mate.mateList;
    this.list.columns.map(i => {
      this.objectColumns[i.name] = i;
    });
    this.getCustomer(); // 获取客户
    this.getOfficeId();
  },
  methods: {
    /**
     * 修改出货数量
     * @param void
     * @return void
     */
    changeShippableQuantity (val) {
      if (this.list.rows.length > 0) {
        let canShippableQuantity = ''
        this.list.rows.forEach(item => {
          // 可出货数量
          canShippableQuantity =  item.orderedQuantity - item.shippedQuantity - item.acceptQuantity
        })
        if (val > canShippableQuantity) {
          this.$message({
            type: 'warning',
            message: '出货数据超出，请重新输入'
          })
        }
      }
    },
    /**
     * 下载模板
     */
    downloadTemplate () {
      axios({
        url: API_GATEWAY + '/api' + this.importUrl,
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
          'Accept': 'application/json',
          'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
          'Content-Type': 'application/json;charset=utf8'
        },
        data: {
          'downloadTemplate': true,
        },
        responseType: 'arraybuffer'
      }).then(function (response) {
        var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          // blob(size,type) Blob构造函数，接受两个参数。第一个参数是一个包含实际数据的数组，第二个参数是数据的类型
          var objectUrl = URL.createObjectURL(blob)
          var a = document.createElement('a')
          document.body.appendChild(a)
          a.setAttribute('style', 'display:none')
          a.setAttribute('href', objectUrl)
          var fileName = ''
          fileName ='出货信息.xlsx'
          a.setAttribute('download', fileName)
          a.click()
          URL.revokeObjectURL(objectUrl)
      })
    },
    // 获取到机构
    getOfficeId() {
      const vm = this;
      this.$root.ajaxData(
        "/users/office",
        {},
        function(data) {
          data.forEach(i => {
            vm.officeIdOptions.push({ label: i.orgName, value: i.officeId });
            if (!vm.mate.mateFormerHeader.values.id) {
              vm.mate.mateFormerHeader.values.officeId =
                vm.officeIdOptions[0].value;
            }
          });
        },
        "GET"
      );
    },
    changeOfficeId(val) {
      
      this.mateFormOfficeId = val;
    },
    // 客户更改时，后台需要customerName
    changeCustomerName(val) {
      
      this.mateFormCustomerId = val;
      const option = this.customerOptions.find(function(item) {
        if (item.value === val) {
          return item;
        }
      });
      if (option !== undefined) {
        this.mate.mateFormerHeader.values.customerName = option.label;
        this.mateFormCustomerName = this.mate.mateFormerHeader.values.customerName;
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getCustomer() {
      var vm = this;
      this.$root.ajaxData(
        "/supplier-portal/asn/getCustomerList",{},function(res) {
          if (res.state == 200) {
            if (res.data.length > 0) {
              res.data.forEach(item => {
                vm.customerOptions.push({
                  label: item.name,
                  value: item.id,
                  key: item.id
                });
              })
            }
          }
        },
        "GET"
      );
    },
    // 获取客户然后获取客户的相关地址
    visibleChange(flag) {
      
      var vm = this;
      this.address = false;
      // 清空选项，不然每次点击都会push进去，会出现多条记录
      vm.destinationOptions = [];
      this.mate.mateFormerHeader.values.destination = "";
      this.mate.mateFormerHeader.values.contactName = "";
      this.mate.mateFormerHeader.values.contactTelphone = "";
      this.mate.mateFormerHeader.values.contactAddress = "";
      if (this.mate.mateFormerHeader.values.customerId !== null) {
        if (!flag) {
          this.$root.ajaxData(
            "/addresses/validAll/" +
              this.mate.mateFormerHeader.values.customerId,
            {},
            function(data) {
              // vm.options9 = data
              
              
              for (let i = 0; i < data.length; i++) {
                
                vm.destinationOptions.push({
                  label: data[i].address,
                  value: data[i].id,
                  key: data[i].id
                });
              }
            },
            "GET"
          );
        }
      }
    },
    // 得到客户地址后获取客户下面的联系人
    visibleChangeAddress(flag) {
      var vm = this;
      this.contactName = false;
      vm.contactNameOptions = [];
      this.mate.mateFormerHeader.values.contactName = "";
      this.mate.mateFormerHeader.values.contactTelphone = "";
      this.mate.mateFormerHeader.values.contactAddress = "";
      if (this.destinationOptions.length !== 0) {
        if (!flag) {
          this.$root.ajaxData(
            "/contacts/all/" + this.mate.mateFormerHeader.values.destination,
            {},
            function(data) {
              // vm.options9 = data
              for (let i = 0; i < data.length; i++) {
                vm.contactNameOptions.push({
                  label: data[i].name,
                  value: data[i].id,
                  phone: data[i].mobile,
                  address: data[i].address
                });
              }
            },
            "GET"
          );
        }
      }
    },
    // 获取联系人后 将联系人地址和电话带出来
    changeName(value) {
      try {
        var obj = this.contactNameOptions.find(item => {
          return item.value === value;
        });
        this.mate.mateFormerHeader.values.contactTelphone = obj.phone;
        this.mate.mateFormerHeader.values.contactAddress = obj.address;
      } catch (e) {}
    },
    add() {
      const _this = this;
      if (_this.isLeadIn) {
        _this.$message({
          type: 'warning',
          message: '已导入数据，不允许新增'
        });
        return
      }
      this.$refs['ruleForm'].validate((valid) =>{
        if(valid){
          let mateFormerHeaderValues = _this.mate.mateFormerHeader.values;
          // if (_this.isEbs === "2") {
          //   //不包含欣旺达 勾选销售订单
          //   _this.poTableFlag = false;
          //   _this.soTableFlag = true;
          //   _this.titleInfo = "选择销售订单";
          // } else {
          //   _this.soTableFlag = false;
          //   _this.poTableFlag = true;
          //   _this.titleInfo = "请选择客户PO";
          // }
          if (_this.soTableFlag) {
            if (
              mateFormerHeaderValues.officeId === null ||
              mateFormerHeaderValues.officeId === ""
            ) {
              _this.$message({
                message: "请选择机构",
                type: "warning"
              });
              _this.dialogListVisible = false;
              return;
            }
            _this.dialogListVisible = true;
            
            let customerName
            let supplierName
            if( mateFormerHeaderValues.customerName != null){
              customerName = mateFormerHeaderValues.customerName
            }
            if(mateFormerHeaderValues.orgName){
              supplierName = mateFormerHeaderValues.orgName
            }

            _this.$root.ajaxData(
              "/supplier-portal/asn/getChoosePoLineView?customerName=" + customerName,
              {},
              function(data) {
                delete data.mate.btns;
                _this.dataKTable = data.mate;
              },
              "GET"
            );
          }
          if (_this.poTableFlag) {
            _this.dialogListVisible = true;
            let selectedPoDespatchIds = [];
            _this.list.rows && _this.list.rows.length &&
              _this.list.rows.map(i => {
                selectedPoDespatchIds.push(i.ebsPoDespatchId);
              });
            _this.poDespatchIds = selectedPoDespatchIds;
            _this.$root.ajaxData(
              "/purchase/goodsPricing/line/getPoLines?customerName=" +
                mateFormerHeaderValues.customerName,
              selectedPoDespatchIds,
              function(data) {
                //delete data.mate.btns
                _this.dataKTable = data.mate;
              },
              "POST"
            );
          }
          _this.confirmRows = [];
          if (_this.list.rows && _this.list.rows.length === 0) {
            _this.tmpRows = [];
          } else {
            _this.tmpRows = this.list.rows || [];
          }
        }else{
          this.$message({
            type: 'warning',
            message: '请先维护表单必填数据'
          })
        }
      })
      // if (
      //   this.mate.mateFormerHeader.values.customerId === null ||
      //   this.mate.mateFormerHeader.values.customerId === ""
      // ) {
      //   vm.$message({
      //     message: "请选择客户",
      //     type: "warning"
      //   });
      //   this.dialogListVisible = false;
      //   return;
      // }
    },
    del() {
      var vm = this;
      var rows = this.selectedLines;
      if (rows.length === 0) {
        vm.$message({
          message: this.$t("selmdata"),
          type: "warning"
        });
        return;
      } else {
        for (let i = 0; i < this.list.rows.length; i++) {
          for (let j = 0; j < this.selectedLines.length; j++) {
            if (this.list.rows[i].lineNum === this.selectedLines[j].lineNum) {
              this.list.rows.splice(i, 1);
              //this.tmpRows.splice(i, 1)
              if (this.list.rows.length == 0){
                vm.isAdd = false;
                vm.isLeadIn = false;
              }
            }
          }
        }
        for (var m = 0; m < this.list.rows.length; m++) {
          this.list.rows[m].lineNum = m + 1;
        }
        this.tmpRows = this.list.rows || [];
      }
    },
    dlgConfirm(val) {
      var vm = this;
      var rows = this.selectedRows;
      if (rows.length === 0) {
        vm.$message({
          message: this.$t("selmdata"),
          type: "warning"
        });
        return;
      }else if (rows.length > 50) {
        vm.$message({
          message: "选择数据最多五十条",
          type: "warning"
        });
        return;
      } else {
        if (rows.length !== 1) {
          for (let i = 0; i <= rows.length - 2; i++) {
            if (rows[i].orgName !== rows[i].orgName) {
              vm.$message({
                message: "请选择同一发货库存组织",
                type: "warning"
              });
              return;
            }
            if (rows[i].customerAddr1 !== rows[i + 1].customerAddr1) {
              vm.$message({
                message: "请选择同一收货地点",
                type: "warning"
              });
              return;
            }
            if (rows[i].receiveOrgId !== rows[i + 1].receiveOrgId) {
              vm.$message({
                message: "请选择同一客户收货组织",
                type: "warning"
              });
              return;
            }
          }
        }
        for (let i = 0; i < rows.length; i++) {
          // 将rows[i].poDespatchList中的id设置为空
          rows[i].id = "";
          this.confirmRows.push(rows[i]);
        }
        // var index = 0;
        // while (this.confirmRows.length !== 0) {
        //   if (index >= this.confirmRows.length) {
        //     break;
        //   }
          // var j;
          // for (j = 0; j < this.mate.mateList.rows.length; j++) {
          //   if (this.poTableFlag) {
          //     if (
          //       this.mate.mateList.rows[j].cusPo ===
          //         this.confirmRows[index].cusPo &&
          //       this.mate.mateList.rows[j].cusPoLineNum ===
          //         this.confirmRows[index].cusPoLineNum
          //     ) {
          //       this.confirmRows.splice(index, 1);
          //       break;
          //     }
          //   }
          //   if (this.soTableFlag) {
          //     if (
          //       this.mate.mateList.rows[j].soNum ===
          //         this.confirmRows[index].soNum &&
          //       this.mate.mateList.rows[j].soLineNum ===
          //         this.confirmRows[index].soLineNum
          //     ) {
          //       this.confirmRows.splice(index, 1);
          //       break;
          //     }
          //   }
          // }
          // if (j >= this.mate.mateList.rows.length) {
          //   index++;
          // }
        // }
        this.tmpRows.push(...this.confirmRows);
        this.list.rows = this.tmpRows;
        for (let j = 0; j < this.tmpRows.length; j++) {
          var lineno = j + 1;
          if (this.tmpRows[j].shippedQty === null) {
            this.tmpRows[j].shippedQty = 0;
          }
          if (this.poTableFlag) {
            var needShipQty = this.tmpRows[j].canShipQty;
          } else {
            var needShipQty =
              this.tmpRows[j].outboundQty - this.tmpRows[j].soSendQty;
          }
          this.list.rows[j].customerName = this.tmpRows[j].organizationName;
          this.list.rows[j].lineNum = lineno;
          this.list.rows[j].poNo = this.tmpRows[j].cusPo;
          this.list.rows[j].polineNo = this.tmpRows[j].cusPoLineNum;
          this.list.rows[j].item = this.tmpRows[j].itemName;
          this.list.rows[j].goodsId = this.tmpRows[j].itemId;
          this.list.rows[j].qty = needShipQty;
          this.list.rows[j].supplierItem = this.tmpRows[j].cusMaterialCode;
          this.list.rows[j].supplierItemName = this.tmpRows[j].cusMaterial;
          this.list.rows[j].needShipQty = needShipQty;
          this.list.rows[j].priceTax = this.tmpRows[j].price;
          // this.list.rows[j].goodsPricingHeaderId = this.tmpRows[j].ownerSheetId
          // this.list.rows[j].goodsPricingLineId = this.tmpRows[j].ownerSheetLineId
          // this.list.rows[j].returnQty = this.tmpRows[j].needShipQty
        }
        this.dialogListVisible = false;
        this.tmpRows = [];
        if (this.list.rows.length !== 0) {
          this.isAdd = true
        }
      }
      this.rows = this.list.rows;
      var amount = 0;
      for (let z = 0; z < this.list.rows.length; z++) {
        var price = this.list.rows[z].priceTax;
        var qty = this.list.rows[z].qty;
        amount = amount + price * qty;
      }
      this.mate.mateFormerHeader.values.totalAmount = amount;
    },
    dlgCancel() {
      this.dialogListVisible = false;
    },
    handleSelected(val) {
      this.selectedRows = val;
    },
    async handleSubmit() {
      var mate = {};
      var vm = this;
      vm.submitDisabled = true;
      var ruleRes = "";
      this.$refs["ruleForm"].validate(valid => {
        if (!valid) {
          ruleRes = "no";
        }
      });

      if (ruleRes === "no") {
        vm.$message({
          message: this.$t("Data Check No Pass"),
          type: "warning"
        });
        vm.submitDisabled = false;
        return;
      }
      if (this.list.rows && this.list.rows.length === 0) {
        vm.$message({
          message: this.$t("Detailed data can not be empty"),
          type: "warning"
        });
        vm.submitDisabled = false;
        return;
      }
      if (this.list.rows && this.list.rows.length !== 1) {
        for (let z = 0; z <= this.list.rows.length - 2; z++) {
          if (this.list.rows[z].orgId !== this.list.rows[z + 1].orgId) {
            vm.$message({
              message: this.$t("selectSame"),
              type: "warning"
            });
            vm.submitDisabled = false;
            return;
          }
        }
      }
      var chkmsg = "";
      var checkStatusFlag = 0;
      for (var k = 0; k < this.list.rows.length; k++) {
        if (this.list.rows[k].qty <= 0) {
          chkmsg =
            "明细数据第" + this.list.rows[k].lineNum + "行的数量小于等于0";
          break;
        }
        //袁哲测试注释掉了3个IF语句
        // if (this.list.rows[k].qty > this.list.rows[k].needShipQty) {
        //   chkmsg =
        //     "明细数据第" + this.list.rows[k].lineNum + "行的待发运数量不足";
        //   break;
        // }
        // if (
        //   this.list.rows[0].receiveOrgName !== this.list.rows[k].receiveOrgName
        // ) {
        //   chkmsg = "请选择相同的收货组织";
        //   break;
        // }
        // if (this.list.rows[0].ebsInvSub !== this.list.rows[k].ebsInvSub) {
        //   chkmsg = "请选择相同的收货仓库";
        //   break;
        // }

        if (this.poTableFlag) {
          checkStatusFlag = await this.$http({
            url: `${API_GATEWAY }/api/purchase/asn/getStateByNo?poNo=${this.list.rows[k].poNo}&polineNo=${this.list.rows[k].polineNo}&pllShipmentNum=${this.list.rows[k].pllShipmentNum}&lineNum=${this.list.rows[k].lineNum}`,
            method: "GET",
            headers: {
              Authorization: "Bearer " + window.sessionStorage.getItem("token"),
              Accept: "application/json",
              "X-TenantId": JSON.parse(window.sessionStorage.getItem("user"))
                .tenantId,
              "Content-Type": "application/json;charset=utf8"
            },
            responseType: "application/json"
          }).then(function(response) {
            if (response.body.statusCode === 1) {
              return 1;
            } else {
              return 0;
            }
          });
          if (checkStatusFlag == 1) {
            chkmsg =
              "明细数据第" +
              vm.list.rows[k].lineNum +
              "行是待处理的ASN发运行，不能创建";
            break;
          }
        }
      }

      if (chkmsg !== "") {
        vm.$message({
          message: chkmsg,
          type: "warning"
        });
        return;
      }
      // 发运日期
      this.form.values.deliveryTime = DateFormat(this.form.values.deliveryTime, "yyyy-MM-dd");
      // 预约到达时间
      this.form.values.arrivalTime = DateFormat(this.form.values.arrivalTime, "yyyy-MM-dd");
      this.form.values.shipped_date = DateFormat(this.form.values.shipped_date, "yyyy-MM-dd hh:MM:ss");
      this.form.values.expected_receipt_date = DateFormat(this.form.values.expected_receipt_date, "yyyy-MM-dd hh:MM:ss");
      // var lineLocationIdList = new Array()
      // for(var i=0 ; i< this.list.rows.length; i++){
      //     lineLocationIdList.push(this.list.rows[i].lineLocationId)
      // }
      let asnLineList = this.list.rows || []; // 改为整行数据
      var requestBody = {
        asn: this.form.values,
        asnLineList: asnLineList
      }
      if (this.mate.mateFormerHeader.method === "POST") {
        axios.post('/supplier-portal/asn/add', requestBody).then(res =>{
          if (res.data.state === 200){
            vm.$notify({
              title: '提示',
              message: res.data.message,
            });
            vm.backward()
          }else{
            vm.$message({
              type: 'warning',
              message: res.data.message,
            });
            vm.submitDisabled = false;
          }
        })
        // vm.submitDisabled = false;
      } else {
        this.$root.ajaxData(
          "/purchase/asn/batchUpdate" + "/" + mate.mateFormerHeader.id,
          mate,
          function() {
            vm.$root.monitor({ url: "/purchase/asn/all/list" });
            vm.submitDisabled = false;
          },
          "PUT"
        );
      }
    },
    backward() {
      this.$root.monitor({ url: "/supplier-portal/asn/head/list" });
      this.$emit('closeTab', this.mate.title);
    },
    lineSelected(val) {
      this.selectedLines = val;
    },
    changeCode(value, lineNum) {
      try {
        var obj = this.codeOptions.find(item => {
          return item.value === value;
        });
        this.list.rows[lineNum - 1].goodsId = obj.key;
        this.list.rows[lineNum - 1].item = obj.label;
      } catch (e) {}
    },
    changeRadio() {

    },
    /**
     * 纯前端导入excel // TODO 待封装
     * fileUpload() 
     * upload() 上传文件
     * readerData() 读数据
     * getHeaderRow() 获取 table 头
     */
    /**
     * 导入按钮
     */
    leadIn () {
      if (!this.mate.mateFormerHeader.values.customerId) {
        this.$message({
          message: '请选择客户',
          type: 'warning'
        })
        return;
      }
      if (this.isAdd) {
        this.$message({
          message: '已新增数据，不允许导入',
          type: 'warning'
        })
        return;
      }
      this.$refs['excelFile'].click();
    },
    fileUpload (file) {
      // var _this = this
      // var formData = new FormData()
      // formData.append('file', file.target.files[0])
      // console.log(file)
      const files = file.target.files;
      const rawFile = files[0];
      if (!rawFile) return;
      this.upload(rawFile);
    },
    upload(rawFile) {
      this.$refs['excelFile'].value = null;

      if (!this.beforeUpload) {
        this.readerData(rawFile)
        return
      }
      const before = this.beforeUpload(rawFile)
      if (before) {
        this.readerData(rawFile)
      }
    },
    readerData(rawFile) {
      this.loading = true
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const header = this.getHeaderRow(worksheet)
          const results = XLSX.utils.sheet_to_json(worksheet)
          this.generateData({ header, results })
          this.loading = false
          resolve()
        }
        reader.readAsArrayBuffer(rawFile)
      })
    },
    getHeaderRow(sheet) {
      const headers = [];
      const range = XLSX.utils.decode_range(sheet['!ref']);
      let C;
      const R = range.s.r;
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })];
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C; // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
        headers.push(hdr);
      }
      return headers;
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (isLt1M) {
        return true;
      }
      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false;
    },
    generateData({ header, results }) {
      let objectKeys = {};
      let rows = [];
      let formCustomerName = this.mate.mateFormerHeader.values.customerName;
      let rowCustomerName = "";
      this.tableHeader = header;
      this.tableData = results;
      if (this.tableData.length) {
        this.tableData.forEach(item => {
          rowCustomerName = item.客户名称
        })
        if (formCustomerName && rowCustomerName !== formCustomerName) {
          this.$message({
            message:'导入数据客户名称与选择不一致,请重新导入',
            type: 'warning'
          })
          return;
        };
        for(var i=0;i<this.tableData.length;i++) {
          for(var y=0;y<this.tableData.length-1;y++) {
            if (this.tableData[i].收货地址 !== this.tableData[y].收货地址) {
              this.$message({
                message:'导入表格中收货地址存在不一致,请重新导入',
                type: 'warning'
              })
              return;
            }
          }
        }
        for(var i=0;i<this.tableData.length;i++) {
          for(var y=0;y<this.tableData.length-1;y++) {
            if (this.tableData[i].收货仓库 !== this.tableData[y].收货仓库) {
              this.$message({
                message:'导入表格中收货仓库存在不一致,请重新导入',
                type: 'warning'
              })
              return;
            }
          }
        }
        if (this.tableData.length > 50) {
          this.$message({
            message:'导入表格数据最多五十条,请重新导入',
            type: 'warning'
          })
          return;
        }
      }
      this.list.columns.map(col => {
        objectKeys[col.label] = col.name;
      });
      results.forEach(col => {
        let obj = Object.keys(col).reduce((newData, key) => {
          let newKey = objectKeys[key] || key
          newData[newKey] = col[key]
          return newData
        }, {})
        rows.push(obj)
      })
      this.list.rows = rows;
      if (this.list.rows.length !== 0) {
        this.isLeadIn = true
      }
    }
  }
};
</script>

<style scoped lang="scss">
.el-form--inline > * {
  margin-right: 10px;
}

.el-form-item__label {
  line-height: inherit;
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
  content: "";
}

.el-form-item.is-required .el-form-item__label:after {
  content: "*";
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
  right: 80px;
}

.el-form-item--mini.el-form-item {
  margin: 7px;
}

.el-input--mini .el-input__inner {
  width: 80%;
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
  width: 90%;
}

.leftFloat .el-form--inline .el-form-item {
  margin-right: 10px;
}
.tbutton {
  margin: 3px 0;
  button {
    padding: 7px 15px;
    cursor: pointer;
  }
}
.fbutton {
  margin: 5px 0;
  button {
    padding: 7px 15px;
    cursor: pointer;
  }
}
.el-table .cell, .el-table th>div {
  padding-right: 10px;
}
</style>
