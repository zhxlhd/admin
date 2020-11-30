<template>
  <div class="ChecksForm1">
    <el-row>
      <el-form size="mini" :model="form">
          <el-col :sm="6" :md="6" :lg="4">
            <el-form-item>
              <el-input readonly size="mini" @change="changeName" v-model="form['customerName']" placeholder="购方公司"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="6" :md="6" :lg="4">
            <el-form-item :rules="rulesOperation" :props="form['ouName']">
              <el-select clearable size="mini" @visible-change="visibleChange" @change="changeThree" v-model="form['ouName']" placeholder="购方业务实体">
                <el-option
                  v-for="item in ouNameOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="6" :md="6" :lg="4">
            <el-form-item :rules="rulesCurrencyCode" :props="form['address']">
              <el-select clearable size="mini" @change="changeThree" v-model="form['address']" placeholder="地点">
                <el-option
                  v-for="item in addressOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
           <el-col :sm="6" :md="6" :lg="4">
            <el-form-item  :props="form['supplierName']">
              <el-select clearable size="mini"  v-model="form['supplierName']" placeholder="销方公司" filterable >
                <el-option
                  v-for="item in supplierOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="6" :md="6" :lg="4">
            <el-form-item :props="form['qty']">
              <el-input size="mini" readonly disabled v-model="form['qty']" placeholder="采购数量合计"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="6" :md="6" :lg="4">
            <el-form-item :props="form['moneyAmount']">
              <el-input size="mini" readonly disabled v-model="form['moneyAmount']" placeholder="采购金额合计"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="4" :md="4" :lg="3" v-show="showFlag">
            <el-form-item>
              <el-button type="primary" plain size="mini" @click="clickCreate">生成结算单</el-button>
            </el-form-item>
          </el-col>
      </el-form>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showFalse: false,
      labelPosition: 'right',
      labelWidth: '130px',
      customerNameOptions: [],
      operationUnitOptions: {},
      ouNameOptions: [],
      currencyOptions: [
        {
          value: 'CNY'
        },
        {
          value: 'USD'
        }
      ],
      addressOptions: [
        {
          value: '材料采购'
        },
        {
          value: '费用采购'
        },
        {
          value: '资产采购'
        },
        {
          value: '材料采购1'
        },
        {
          value: 'CNY材料采购'
        },
        {
          value: 'USD材料采购'
        },
        {
          value: 'ATL材料采购'
        },
        {
          value: '材料采购01'
        }
      ],
      supplierOptions: [],
      rulesOperation: [
         { required: true, message: '请输入业务实体', trigger: 'blur' }
      ],
      rulesCustomerName: [
        { required: true, message: '请输入供应商名称', trigger: 'blur' }
      ],
      rulesCurrencyCode: [
        { required: true, message: '请输入币种', trigger: 'blur' }
      ]
    }
  },
  props: {
    form: Object,
    saleCheck: Boolean,
    showFlag: Boolean
  },
  mounted () {
    this._getCustomerName()
    this.getUserCompany()
    // this._getUnitOption()
  },
  watch:{
    form:function(newMate){
      this.getUserCompany()
    }
  },
  methods: {
    clickCreate() {
      this.$emit('clickCreate')
    },
    getUserCompany(){
      var vm = this
      var user = window.sessionStorage.getItem('user')
      if (user) {
        user = JSON.parse(user)
      }
      this.$root.ajaxData('/tenants/get/tenant?tenantId=' + user.tenantId, {}, function (data) {
        vm.form.customerName = data.name
      })
    },
    // 获取客户名称
    _getCustomerName () {
      var vm = this
      this.$root.ajaxData('/companys/companyInfo/3?auditStatus=1&nopaging=1&status=1&dataOnly=true&&onlyCompanyFlag=1', {}, function (data) {
        for (var i = 0; i < data.length; i++) {
          data[i].value = data[i].name
        }
        vm.supplierOptions = data
      })
    },
    visibleChange (val) {
      if (val === true) {
        if (this.form.customerName === '') {
          this.$message({
            message: '请先选择购方公司',
            type: 'warning'
          })
          return
        }
        this.changeName(this.form['customerName'])
      }
    },
    changeName (val) {
      var vm = this
      let option = {}
      this.ouNameOptions = []
      this.form['qty'] = 0
      this.form['moneyAmount'] = 0
      this.$parent.emptyOUName()
      this.$root.ajaxData(`/offices//pass/company/name?companyName=${val}`, {}, function (data) {
        for (var i = 0; i < data.length; i++) {
          option = {}
          option.value = data[i].orgName
          option.isMutiAddress = data[i].isMutiAddress
          vm.ouNameOptions.push(option)
        }
      })
      this.changeThree()
    },
    // 改变
    changeThree () {
      var isMutiAddress = ''
      this.ouNameOptions.forEach(element => {
        if(element.value === this.form.ouName){
          this.isMutiAddress = element.isMutiAddress
        }
      });
      this.$emit('changeThree',this.isMutiAddress)
    }
  }
}
</script>

<style lang="scss">
.ChecksForm1 {
  // .el-input__suffix {
  //   right:68px
  // }
  // .el-form-item--mini.el-form-item {
  //   margin: 6px;
  // }
  // .el-input--mini .el-input__inner{
  //   width:80%
  // }
  // .el-date-editor.el-input, .el-date-editor.el-input__inner {
  //   width: 100%;
  // }
  // .el-select {
  //   width: 100%;
  // }
  .page {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .searchForm{
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
  }
  .el-form-item--mini.el-form-item {
    margin: 6px;
  }
  .button{
    margin-top:10px;
  }
  .el-table .cell, .el-table th>div {
    padding-right: 0;
    padding-left: 0;
  }
  .top-button{
    margin: 20px 0 10px 0;
  }
  .el-dialog--center .el-dialog__body{
    text-align: center !important;
    font-size: 20px !important;
  }
  .upload {
    margin-bottom:5px
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
  }
  th {
    background-color: #e6e7eb;
    color: #303030;
    font-weight: 700;
  }
  .tableWraning {
    color: #e6a23c;
  }
  .tableSuccess {
    color: #67c23a;
  }
  .searchText {
    margin-left: 10px;
    font-size: 12px;
    color: #409eff;
    cursor: pointer;
    i {
      position: absolute;
      top: 9px;
      margin-left: 5px;
      height:0px;
      width:0px;
      border-top:solid 10px #409eff;
      border-left:solid 5px rgba(0,0,0,0); 
      border-right:solid 5px rgba(0,0,0,0);
    }
  }
  .searchText:hover {
    color: #e6a23c;
    i {
      border-top: solid 10px #e6a23c;
    }
  }
  .changeDirection {
    transform: rotate(180deg);
  }
}

</style>

