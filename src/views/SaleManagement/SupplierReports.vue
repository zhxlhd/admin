<template>
  <div>
    <div style="width: 100%; height: 30px;">
      <span style="float: right">
        <el-button type="primary" size="mini" @click="getReportList">报表导出记录列表</el-button>
      </span>
    </div>
    <div style="margin-bottom: 20px;">
      <el-form :label-position="labelPosition" :label-width="labelWidth">
        <el-row type="flex" justify="center">
          <el-col :sm="16" :md="12" :lg="12">
            <el-form-item label="报表类型：" prop="reportSelected">
              <el-select
                v-model="reportSelected"
                placeholder="请选择"
                @change="getReportSelected">
                <el-option
                  v-for="item in reportOptions"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-row type="flex" justify="center">
      <el-col :sm="24" :md="18" :lg="12">
        <!-- CUX:委外盘点异常扣款报表(供应商) -->
        <el-form
          :model="form1"
          ref="form1"
          :rules="rules"
          :label-width="labelWidth"
          size="mini"
          :label-position="labelPosition"
          v-show="state==1"> 
          <el-row :sm="24" :md="24" :lg="24" >
            <el-form-item prop="buyerCompany" label="购方公司：">
              <el-select v-model="form1.buyerCompany" placeholder="请选择购方公司" :label-position="labelPosition" @change="changeName">
                <el-option :label=item.name :value=item.value v-for="item in customerNameOptions" :key=item.id></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row :sm="24" :md="24" :lg="24" >
            <el-form-item prop="buyerEntity" label="购方业务实体：">
              <el-select v-model="form1.buyerEntity" @focus="visibleChange(form1)" placeholder="请选择购方业务实体" :label-position="labelPosition">
                <el-option :label=item.name :value=item.value v-for="item in ouNameOptions" :key=item.id></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row :sm="24" :md="24" :lg="24">
            <el-form-item label="期间：" prop="periodName">
              <el-date-picker
                v-model="form1.periodName"
                type="month"
                :picker-options="pickerOptions"
                placeholder="请选择"
                value-format="yyyy-MM">
              </el-date-picker>
            </el-form-item>
          </el-row>
          <el-row :sm="24" :md="24" :lg="24">
            <el-form-item label="物料从：">
              <el-input v-model="form1.itemNoFrom" ></el-input>
            </el-form-item>
          </el-row>
          <el-row :sm="24" :md="24" :lg="24">
            <el-form-item label="物料至：">
              <el-input v-model="form1.itemNoTo" ></el-input>
            </el-form-item>
          </el-row>
          <el-row type="flex" justify="center">
            <el-button size="small " type="primary" @click="exportReports(form1, formApis.url1,'委外盘点异常扣款报表', 'form1')">提交</el-button>
          </el-row>
        </el-form>
        <!-- Asn未到货报表 -->
        <el-form
          :model="form2"
          ref="form2"
          :label-width="labelWidth"
          size="mini"
          :label-position="labelPosition"
          v-show="state==2">
          <el-row :sm="24" :md="24" :lg="24">
            <el-form-item label="ASN创建时间从:">
              <el-date-picker
                v-model="form2.dateFrom"
                type="date"
                placeholder="选择日期"
                
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-row>
          <el-row :sm="24" :md="24" :lg="24">
            <el-form-item label="ASN创建时间至：">
              <el-date-picker
                v-model="form2.dateTo"
                type="date"
                placeholder="选择日期"
                
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-row>
          <el-row type="flex" justify="center">
            <el-button size="small " type="primary" @click="exportReports(form2, formApis.url2,'提交到ASN未到货报表', 'form2')">提交</el-button>
          </el-row>
        </el-form>
        <!-- PO_退货未拉走明细报表 -->
        <el-form
          :model="form3"
          ref="form3"
          :label-width="labelWidth"
          size="mini"
          :label-position="labelPosition"
          v-show="state==3">
          <el-row :sm="24" :md="24" :lg="24">
            <el-form-item label="制单日期从：">
              <el-date-picker
                v-model="form3.dateFrom"
                type="date"
                name="dateFrom"
                placeholder="选择日期"
                
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-row>
          <el-row :sm="24" :md="24" :lg="24">
            <el-form-item label="制单日期至：">
              <el-date-picker
                v-model="form3.dateTo"
                type="date"
                name="dateFrom"
                placeholder="选择日期"
                
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-row>
          <el-row type="flex" justify="center">
            <el-button size="small " type="primary" @click="exportReports(form3,formApis.url3,'PO_退货未拉走明细报表', 'form3')">提交</el-button>
          </el-row>
        </el-form>
        <!-- 在途执行报表 -->
        <el-form
          :model="form4"
          ref="form4"
          :label-width="labelWidth"
          size="mini"
          :rules="rules"
          :label-position="labelPosition"
          v-show="state==4">
          <el-row :sm="24" :md="24" :lg="24" >
            <el-form-item prop="buyerCompany" label="购方公司：">
              <el-select v-model="form4.buyerCompany" placeholder="请选择活动区域" :label-position="labelPosition" @change="changeName">
                <el-option  :label=item.name :value=item.value v-for="item in customerNameOptions" :key=item.id></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row :sm="24" :md="24" :lg="24" >
            <el-form-item prop="buyerEntity" label="购方业务实体：">
              <el-select v-model="form4.buyerEntity"  @visible-change="visibleChange(form4)" placeholder="请选择活动区域">
                <el-option :label=item.name :value=item.value v-for="item in ouNameOptions" :key=item.id></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row :sm="24" :md="24" :lg="24" >
            <el-form-item prop="poNum" label="订单编号：">
              <el-input v-model="form4.poNum" placeholder="请选择订单编号"></el-input>
            </el-form-item>
          </el-row>
          <el-row :sm="24" :md="24" :lg="24" >
            <el-form-item label="到货日期从：">
              <el-date-picker
                v-model="form4.shippedFrom"
                type="date"
                placeholder="选择日期"
                value-format="yyyy/MM/dd 00:00:00"
              ></el-date-picker>
            </el-form-item>
          </el-row>
          <el-row :sm="24" :md="24" :lg="24" >
            <el-form-item label="到货日期至：">
              <el-date-picker
                v-model="form4.shippedTo"
                type="date"
                placeholder="选择日期"
                value-format="yyyy/MM/dd 23:59:59"
              ></el-date-picker>
            </el-form-item>
          </el-row>
          <el-row :sm="24" :md="24" :lg="24" >
            <el-form-item label="下单日期从：">
              <el-date-picker
                v-model="form4.dateFrom"
                type="date"
                placeholder="选择日期"
                value-format="yyyy/MM/dd 00:00:00"
              ></el-date-picker>
            </el-form-item>
          </el-row>
          <el-row :sm="24" :md="24" :lg="24" >
            <el-form-item label="下单日期至：">
              <el-date-picker
                v-model="form4.dateTo"
                type="date"
                placeholder="选择日期"
                value-format="yyyy/MM/dd 23:59:59"
              ></el-date-picker>
            </el-form-item>
          </el-row>
          <el-row type="flex" justify="center">
            <el-button size="small " type="primary" @click="exportReports(form4,formApis.url4,'在途执行报表', 'form4')">提交</el-button>
          </el-row>
        </el-form>
        <!-- 到货列表报表 -->
        <el-form
          :model="form5"
          ref="form5"
          :label-width="labelWidth"
          size="mini"
          :rules="rules"
          :label-position="labelPosition"
          v-show="state==5">
          <el-row :sm="24" :md="24" :lg="24" >
            <el-form-item prop="buyerCompany" label="购方公司：">
              <el-select v-model="form5.buyerCompany" placeholder="请选择购方公司" :label-position="labelPosition" @change="changeName">
                <el-option :label=item.name :value=item.value v-for="item in customerNameOptions" :key=item.id></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row :sm="24" :md="24" :lg="24" >
            <el-form-item prop="buyerEntity" label="购方业务实体：">
              <el-select v-model="form5.buyerEntity" @visible-change="visibleChange(form5)" placeholder="请选择购方业务实体" :label-position="labelPosition">
                <el-option :label=item.name :value=item.value v-for="item in ouNameOptions" :key=item.id></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row :sm="24" :md="24" :lg="24" >
            <el-form-item prop="poNum" label="订单编号：">
              <el-input  v-model="form5.poNum" placeholder="请选择订单编号" :label-position="labelPosition"></el-input>
            </el-form-item>
          </el-row>
          <el-row :sm="24" :md="24" :lg="24" >
            <el-form-item prop="itemNum" label="料号：">
              <el-input   v-model="form5.itemNum" placeholder="请选择料号"></el-input>
            </el-form-item>
          </el-row>
          <el-row :sm="24" :md="24" :lg="24" >
            <el-form-item prop="shippedFrom" label="到货日期从：">
              <el-date-picker
                v-model="form5.shippedFrom"
                type="date"
                placeholder="选择日期"
                
                value-format="yyyy/MM/dd 00:00:00"
              ></el-date-picker>
            </el-form-item>
          </el-row>
          <el-row :sm="24" :md="24" :lg="24" >
            <el-form-item prop="shippedTo" label="到货日期至：">
              <el-date-picker
                v-model="form5.shippedTo"
                type="date"
                placeholder="选择日期"
                
                value-format="yyyy/MM/dd 23:59:59"
              ></el-date-picker>
            </el-form-item>
          </el-row>
          <el-row :sm="24" :md="24" :lg="24" >
            <el-form-item prop="dateFrom" label="下单日期从：">
              <el-date-picker
                v-model="form5.dateFrom"
                type="date"
                placeholder="选择日期"
                
                value-format="yyyy/MM/dd  00:00:00"
              ></el-date-picker>
            </el-form-item>
          </el-row>
          <el-row :sm="24" :md="24" :lg="24" >
            <el-form-item prop="dateTo" label="下单日期至：">
              <el-date-picker
                v-model="form5.dateTo"
                type="date"
                placeholder="选择日期"
                
                value-format="yyyy/MM/dd  23:59:59"
              ></el-date-picker>
            </el-form-item>
          </el-row>
          <el-row type="flex" justify="center" style="text-align:center">
            <el-button size="small " type="primary" @click="exportReports(form5,formApis.url5,'采购报表-到货列表', 'form5')">提交</el-button>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { API_GATEWAY } from '@/config/index.js'
import { getAction, postAction, metaAction } from '@/services/manage.js';

import QS from "qs"
export default {
  data() {
    return {
      labelWidth: "130px",
      labelPosition: "right",
      reportOptions: [
        {
          id: 1,
          value: "report-1",
          label: "CUX:委外盘点异常扣款报表(供应商)"
        },
        {
          id: 2,
          value: "report-2",
          label: "CUX_ASN报表--提交ASN未到货(供应商)"
        },
        {
          id: 3,
          value: "report-3",
          label: "CUX_PO_退货未拉走明细报表(供应商)"
        },
        {
          id: 4,
          value: "report-4",
          label: "CUX_采购PO-在途执行报表(供应商)"
        },
        {
          id: 5,
          value: "report-5",
          label: "CUX_采购报表-到货列表(供应商)"
        }
      ],
      formApis: {
        url1: "/purchase/supplierReports/outReduction",
        url2: "/purchase/supplierReports/asnUnArrival",
        url3: '/purchase/supplierReports/returnUnTaken',
        url4: "/purchase/supplierReports/poOnline",
        url5: "/purchase/supplierReports/poArrival"
        // url1: "/supplier-portal/reports/outReduction", // 委外盘点异常扣款报表
        // url2: "/supplier-portal/reports/asnUnArrival", // Asn未到货报表
        // url3: '/supplier-portal/reports/returnUnTaken', // PO_退货未拉走明细报表
        // url4: "/supplier-portal/reports/poOnline", // 在途执行报表
        // url5: "/supplier-portal/reports/poArrival" // 到货列表报表
      },
      form1:{
        itemNoFrom: "",
        itemNoTo: "",
        buyerEntity:"",
        periodName: "",
        buyerCompany:""
      },
      rules:{
        buyerCompany:[
          { required: true, message: '请选择购方公司', trigger: 'blur' }
        ],
        periodName:[
          { required: true, message: '请选择期间值', trigger: 'blur' }
        ],
        buyerEntity:[
          { required: true, message: '请输入业务实体', trigger: 'blur' }
        ]
      },
      form2:{
        dateFrom: "",
        dateTo: ""
      },
      form3:{
        dateFrom: "",
        dateTo: ""
      },
      form4:{
        buyerCompany:"",
        buyerEntity:"",
        poNum:"",
        shippedFrom:"",
        shippedTo:"",
        dateFrom: "",
        dateTo: ""
      },
      form5:{
        buyerCompany:"",
        buyerEntity:"",
        poNum:"",
        itemNum:"",
        shippedFrom:"",
        shippedTo:"",
        dateFrom: "",
        dateTo: ""
      },
      reportSelected: "",
      state: 1,
      sysUser: {},
      customerNameOptions: [],
      ouNameOptions: [],
      pickerOptions: { //大于当前月的月份不可选
                    disabledDate: (time) => {
                        var date = new Date();
                        var year = date.getFullYear();
                        var month = date.getMonth() + 1;
                        if (month >= 1 && month <= 9) {
                            month = "0" + month;
                        }
                        var currentDate = year.toString()  + month.toString();
                        var timeYear = time.getFullYear();
                        var timeMonth = time.getMonth() + 1;
                        if (timeMonth >= 1 && timeMonth <= 9) {
                            timeMonth = "0" + timeMonth;
                        }
                        var timeDate = timeYear.toString() + timeMonth.toString();
                        return currentDate < timeDate;
                    }
                }
    };
  },
  computed: {
  },
  created() {
    this.getCustomerName();
    this.reportSelected = this.reportOptions[0].label;
    this.sysUser = JSON.parse(localStorage.getItem('user'));
  },
  methods: {
    getReportList(){
      let params = {
        isApi: false,
        useId: -1,
        url: '/common/toList?listName=report_export_record'
      }
      this.$root.handleAction(params);
    },
    getReportSelected(val) {
      this.state = this.reportSelected;
      switch (val) {
        case 4:
          break;
        case 5:
          break;
        case 1:
          break;
      }
    },
    getCustomerName () {
      var vm = this
      this.$root.ajaxData('/companys/companyInfo/4?status=1&auditStatus=1&nopaging=1&dataOnly=true', {}, function (data) {
        for (var i = 0; i < data.length; i++) {
          data[i].value = data[i].name
        }
        vm.customerNameOptions = data;
      })
    },
    changeName (val) {
      var vm = this
      this.$root.ajaxData(`/offices//pass/company/name?companyName=${val}`, {}, function (data) {
        let arr =[];
        for (let i = 0; i < data.length; i++) {
          let option = {};
          option.value = data[i].name;
          option.name = data[i].name;
          option.id = data[i].id;
          arr.push(option)
        }
        vm.ouNameOptions = arr;
      })
      // this.changeThree()
    },
    visibleChange (form) {
      if (form.buyerCompany === '') {
        this.$message({
          message: '请先选择购方公司',
          type: 'warning'
        })
        this.ouNameOptions = [];
        return
      }
    },
    /** 导出报表
     * 
     */
    exportReports(data,url,name,formName){
      const _this = this;
      this.$refs[formName].validate((valid) => {
          if (valid){
            getAction(url, data).then(res => {
              if(res.data.status){
                _this.$message.success(res.data.msg);
                _this.$alert(_this.$t('是否查看报表导出记录列表'), {
                  showCancelButton: true,
                  showClose: false,
                  confirmButtonText: _this.$t('yes'),
                  cancelButtonText: _this.$t('no'),
                  callback: action => {
                    if(action === 'confirm'){
                      _this.getReportList();
                    }
                  }
                });

              }else{
                _this.$message.warning('操作失败')
              }
            })
          }
        });
    }
  }
};
</script>
<style scoped lang="scss">
.el-select {
  width: 80%;
  text-align: left;
}
.el-input.el-input {
  width: 100%;
}
.el-form-item__label {
  line-height: inherit;
}
.el-form--inline > * {
  margin-right: 10px;
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
.hidden {
  display: none;
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
.el-input__suffix {
  right: 80px;
}
.el-form-item--mini.el-form-item {
  margin: 6px;
}
.el-input--mini .el-input__inner {
  width: 80%;
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
.pbutton {
  margin: 3px 0;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}
</style>
