<template>
  <div>
    <p class="p-title">采购报表</p>
    <el-form :model="formInline" :rules="rules" ref="formInline" class="form-inline" label-width="100px" :label-position="'right'">
      <el-form-item label="报表类型">
        <el-select v-model="formInline.purchaseReportValue" placeholder="请选择报表类型" clearable class="select-type" @change="changePurchaseReportValue">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <!-- 供应商名单报表  -->
      <div class="scope-area" v-if="formInline.purchaseReportValue == '0'">
        <el-form-item label="供应商分类">
          <dict-selected
              class="select-type"
              :size="'large'"
              v-model="formInline.supplier['type']"
              dictType="supplierCategory"
              :initValue="formInline.supplier['type']"
              :placeholder="'请输入供应商分类'"
              :rowId="showDict"
              :filterable="dictFilterable"
              :allowCreate="dicAllowCreate"
          ></dict-selected>
        </el-form-item>
        <el-form-item label="供应商状态">
          <el-select v-model="formInline.supplier['status']" placeholder="请选择供应商状态" class="select-type" clearable>
            <el-option label="有效" value="1"></el-option>
            <el-option label="无效" value="0"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <!-- 采购对账报表  -->
      <div class="scope-area" v-if="formInline.purchaseReportValue == '1'">
        <el-form-item label="供应商代码" prop="procurementReconciliation.code">
          <el-select v-model="formInline.procurementReconciliation.code" placeholder="请选择供应商代码" clearable class="select-type">
            <el-option v-for="(item, idx) in supplierCodeOptions" :key="idx" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间" prop="procurementReconciliation.endDate">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择起始日期" v-model="formInline.procurementReconciliation.startDate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择终止日期" v-model="formInline.procurementReconciliation.endDate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
      </div>
      <!-- 采购订单执行情况报表  -->
      <div class="scope-area" v-if="formInline.purchaseReportValue == '2'">
        <el-form-item label="供应商代码">
          <el-select v-model="formInline.procurementOrder.code" placeholder="请选择供应商代码" clearable class="select-type">
            <el-option v-for="(item, idx) in supplierCodeOptions" :key="idx" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称">
          <el-input type="text" v-model="formInline.procurementOrder.productName" placeholder="请输入产品名称" clearable class="select-type"></el-input>
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input type="text" v-model="formInline.procurementOrder.specificationModel" placeholder="请输入规格型号" clearable class="select-type"></el-input>
        </el-form-item>
        <el-form-item label="单据日期" prop="procurementOrder.endDate">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择起始日期" v-model="formInline.procurementOrder.startDate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择终止日期" v-model="formInline.procurementOrder.endDate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="单据编号">
          <el-input type="text" v-model="formInline.procurementOrder.documentNum" placeholder="请输入单据编号" clearable class="select-type"></el-input>
        </el-form-item>
      </div>
      <!-- 来货欠料查询报表 -->
      <div class="scope-area" v-if="formInline.purchaseReportValue == '3'">
        <el-form-item label="供应商代码">
          <el-select v-model="formInline.goodsShortage.code" placeholder="请选择供应商代码" clearable class="select-type">
            <el-option v-for="(item, idx) in supplierCodeOptions" :key="idx" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称">
          <el-input type="text" v-model="formInline.goodsShortage.productName" placeholder="请输入产品名称" clearable class="select-type"></el-input>
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input type="text" v-model="formInline.goodsShortage.specificationModel" placeholder="请输入规格型号" clearable class="select-type"></el-input>
        </el-form-item>
        <el-form-item label="采购订单号">
          <el-input type="text" v-model="formInline.goodsShortage.purchaseOrderNum" placeholder="请输入采购订单号" clearable class="select-type"></el-input>
        </el-form-item>
        <el-form-item label="采购申请单号">
          <el-input type="text" v-model="formInline.goodsShortage.purchaseApplyNum" placeholder="请输入采购申请单号" clearable class="select-type"></el-input>
        </el-form-item>
        <el-form-item label="采购申请日期" prop="goodsShortage.purchaseApplyEndDate">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择起始日期" v-model="formInline.goodsShortage.purchaseApplyStartDate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择终止日期" v-model="formInline.goodsShortage.purchaseApplyEndDate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="下单日期" prop="goodsShortage.placeOrderEndDate">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择起始日期" v-model="formInline.goodsShortage.placeOrderStartDate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择终止日期" v-model="formInline.goodsShortage.placeOrderEndDate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="需求日期" prop="goodsShortage.demandEndDate">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择起始日期" v-model="formInline.goodsShortage.demandStartDate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择终止日期" v-model="formInline.goodsShortage.demandEndDate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('formInline')" :disabled="formInline.purchaseReportValue == ''" :loading="loadBtn">导出报表</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import SERVICES from '../../services'
export default {
  data () {
    var checkDate = (rule, value, callback) => {
      let field = rule.field.split('.')[0];
      clearTimeout(this.timerOut);
      this.timerOut = setTimeout(() => {
        if(new Date(this.formInline[field].startDate) > new Date(this.formInline[field].endDate)){
          callback(new Error('终止日期不能小于起始日期'));
        }else{
          callback();
        }
      }, 500);
    };
    var checkDate2 = (rule, value, callback) => {
      let field = rule.field.split('.')[1];
      let startDate = '';
      switch (field) {
        case 'purchaseApplyEndDate': startDate = 'purchaseApplyStartDate'; break;
        case 'placeOrderEndDate': startDate = 'placeOrderStartDate'; break;
        case 'demandEndDate': startDate = 'demandStartDate'; break;
        default:break;
      }
      if((this.formInline['goodsShortage'][startDate] == '' || this.formInline['goodsShortage'][startDate] == null ) || (this.formInline['goodsShortage'][field] == '' || this.formInline['goodsShortage'][field] == null)){
          callback();
      }
      clearTimeout(this.timerOut);
      this.timerOut = setTimeout(() => {
        if(new Date(this.formInline['goodsShortage'][startDate]) > new Date(this.formInline['goodsShortage'][field])){
           callback(new Error('终止日期不能小于起始日期'));
        }else{
          callback();
        }
      }, 500);
    };
    return {
      showDict: 0,
      dicAllowCreate: true,   // 数字词典是否允许新建
      dictFilterable: true,   // 数字词典是否支持过滤
      formInline: {
        purchaseReportValue:'',
        supplier:{ type:'', status:'' }, // 供应商名单报表
        procurementReconciliation:{ code:'', startDate:'', endDate:'' }, // 采购对账报表
        procurementOrder:{ code:'', productName:'', specificationModel:'', startDate:'', endDate:'', documentNum:'' },  // 采购订单执行情况报表
        goodsShortage:{ code:'',productName:'',specificationModel:'',purchaseOrderNum:'',purchaseApplyNum:'',
            purchaseApplyStartDate:'',purchaseApplyEndDate:'',placeOrderStartDate:'',placeOrderEndDate:'',demandStartDate:'',demandEndDate:'' }  // 来货欠料查询
      },
      rules: {
        procurementReconciliation: {
          code:[{required: true, message: '请选择供应商代码', trigger: 'change'}],
          endDate:[{  type: 'date', validator: checkDate, trigger: 'change' }]
        },
        procurementOrder: {
          endDate:[{  type: 'date', validator: checkDate, trigger: 'change' }]
        },
        goodsShortage:{
          purchaseApplyEndDate:[{  type: 'date', validator: checkDate2, trigger: 'change' }],
          placeOrderEndDate:[{  type: 'date', validator: checkDate2, trigger: 'change' }],
          demandEndDate:[{  type: 'date', validator: checkDate2, trigger: 'change' }]
        }
      },
      options: [{value: '0', label: '供应商名单报表'}, {value: '1', label: '采购对账报表'},{value:'2',label:'采购订单执行情况报表'},{value:'3',label:'来货欠料查询'}],
      supplierCodeOptions: [],
      loadBtn: false,
      timerOut: null
    }
  },
  created () {
  },
  components: {
    'dict-selected': function index (resolve) {
        require(['../../components/DictSelected.vue'], resolve)
    }
  },
  methods: {
    changePurchaseReportValue(val) {
      this.resetForm();
      this.$refs['formInline'].resetFields();
      if(val !== '0') {
          SERVICES.REPORT_FORMS.getSupplierCode().then(res => this.supplierCodeOptions = res.data);
      }
    },
    onSubmit(formName) {
      switch (this.formInline.purchaseReportValue) {
        case '0': // 供应商名单报表
          this.serviceData(`/companys/export?type=${this.formInline.supplier.type}&status=${this.formInline.supplier.status}`,'downReportExcel', 'GET','供应商名单报表','excel');
          break;
        case '1': // 采购对账报表
          this.$refs[formName].validate((valid) => {
            if(valid){
              // 传值为空后端不接收
              if(this.formInline.procurementReconciliation.startDate == null || this.formInline.procurementReconciliation.startDate == ''){ this.formInline.procurementReconciliation.startDate = '1970-01-01'; }
              if(this.formInline.procurementReconciliation.endDate == null || this.formInline.procurementReconciliation.endDate == ''){ this.formInline.procurementReconciliation.endDate = '2222-12-30'; }
              this.serviceData(`/purchase/report/reconciliation?orgCode=${this.formInline.procurementReconciliation.code}
              &startDate=${this.formInline.procurementReconciliation.startDate}&endDate=${this.formInline.procurementReconciliation.endDate}`,'downReportExcel', 'GET','采购对账报表','pdf');
            }
          });
          break;
        case '2': // 采购订单执行情况报表
          let params = { orgCode:this.formInline.procurementOrder.code,productName:this.formInline.procurementOrder.productName,
             productSpec:this.formInline.procurementOrder.specificationModel,orderCode:this.formInline.procurementOrder.documentNum,
             orderDateStart:this.formInline.procurementOrder.startDate,orderDateEnd:this.formInline.procurementOrder.endDate};
            this.serviceData(`/purchase/new/report/execute/export`,'downReportExcel', 'POST','采购订单执行情况报表','excel',params);
          break;
        case '3':
            // goodsShortage:{ code:'',productName:'',specificationModel:'',purchaseOrderNum:'',purchaseApplyNum:'',
            //     purchaseApplyStartDate:'',purchaseApplyEndDate:'',placeOrderStartDate:'',placeOrderEndDate:'',demandStartDate:'',demandEndDate:'' }
            //  todo 2019-10-10未完
          this.$refs[formName].validate((valid) => {
            if(valid){
              this.serviceData(`/purchase/new/report/incoming/export`,'downReportExcel', 'POST','来货欠料查询报表','excel',{});
            }
          });
          break;
        default:break;
      }
    },
    // 导出报表调用接口
    serviceData(url, serviceFun, serviceMethods,exportName,reportType,params) {
      this.loadBtn = true;
      if(!params){
          params = {};
      }
      SERVICES.REPORT_FORMS[serviceFun](url, serviceMethods,params).then(response => {
        this.loadBtn = false;
        switch (reportType) {
          case 'excel':
            var blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
            // blob(size,type) Blob构造函数，接受两个参数。第一个参数是一个包含实际数据的数组，第二个参数是数据的类型
            var objectUrl = URL.createObjectURL(blob);
            var a = document.createElement('a');
            document.body.appendChild(a);
            a.setAttribute('style', 'display:none');
            a.setAttribute('href', objectUrl);
            a.setAttribute('download', exportName);
            a.click();
            URL.revokeObjectURL(objectUrl);
            break;
          case 'pdf':
            var blob = new Blob([response.data], { type: 'application/pdf' });
            var objectUrl = URL.createObjectURL(blob);
            var a = document.createElement('a');
            document.body.appendChild(a);
            a.setAttribute('style', 'display:none');
            a.setAttribute('href', objectUrl);
            a.setAttribute('download', exportName);
            var windowOpen = window.open(objectUrl);
            if (windowOpen == null || typeof (windowOpen) === 'undefined') {
                this.$message({
                    message: '采购订单被拦截,请检查浏览器设置',
                    type: 'warning'
                });
            }
            break;
          default:break;
        }
      });
    },
    // 重置数据
    resetForm() {
     this.formInline.supplier = { type:'', status:'' };
     this.formInline.procurementReconciliation = { code:'', startDate:'', endDate:'' };
     this.formInline.procurementOrder = { code:'', productName:'', specificationModel:'', startDate:'', endDate:'', documentNum:'' };
     this.formInline.goodsShortage = { code:'',productName:'',specificationModel:'',purchaseOrderNum:'',purchaseApplyNum:'',
            purchaseApplyStartDate:'',purchaseApplyEndDate:'',placeOrderStartDate:'',placeOrderEndDate:'',demandStartDate:'',demandEndDate:'' };
    }
  }
}
</script>
<style scoped lang="scss">
  p.p-title { font-size: 16px;text-align: center; }
  .form-inline {
    width: 500px;margin: 0 auto;
    .select-type { width: 100% }
    .line { text-align: center }
  }
</style>
