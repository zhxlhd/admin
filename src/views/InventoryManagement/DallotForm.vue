<template>
  <div>
    <el-row>
      <el-form size='mini' :model="mate.values" :label-position="labelPosition" ref="ruleForm" :rules="rules" :label-width="labelWidth">
        <template>
            <el-col :sm="12" :md="12" :lg="8">
              <el-form-item :label="object['billNo'].label" :prop="object['billNo'].name">
                <el-input  disabled readonly v-model="mate.values['billNo']"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="12" :lg="8">
                  <el-form-item :label="object['createAt'].label" :prop="object['createAt'].name" >
                    <el-date-picker disabled clearable v-model="mate.values[object['createAt'].name]" type="date" placeholder="选择日期">
                    </el-date-picker>
                  </el-form-item>
            </el-col>

            <el-col :sm="12" :md="12" :lg="8">
              <el-form-item :label="object['creator'].label" :prop="object['creator'].name">
                <el-input  disabled readonly v-model="mate.values['creator']"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="12" :lg="8">
              <el-form-item :label="object['transoutOrg'].label" :prop="object['transoutOrg'].name">
                <el-select   clearable   filterable v-model="mate.values[object['transoutOrg'].name]" @change="changeOutOrg"  @visible-change="getOutStock(mate.values[object['transoutOrg'].name])">
                  <el-option :label="item.label" :value="item.value" v-for="item of orgOutOptions" :key="item.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="12" :lg="8">
              <el-form-item :label="object['transoutStock'].label" :prop="object['transoutStock'].name">
                <el-select   clearable   filterable v-model="mate.values[object['transoutStock'].name]" @change="changeOutStock">
                  <el-option :label="item.label" :value="item.value" v-for="item of outstockOptions" :key="item.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="12" :lg="8">
              <el-form-item :label="object['transinOrg'].label" :prop="object['transinOrg'].name">
                <el-select   clearable   filterable v-model="mate.values[object['transinOrg'].name]" @change="changeInOrg"  @visible-change="getInStock(mate.values[object['transinOrg'].name])">
                  <el-option :label="item.label" :value="item.value" v-for="item of orgInOptions" :key="item.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="12" :lg="8">
              <el-form-item :label="object['transinStock'].label" :prop="object['transinStock'].name">
                <el-select   clearable   filterable v-model="mate.values[object['transinStock'].name]" @change="changeInStock">
                  <el-option :label="item.label" :value="item.value" v-for="item of instockOptions" :key="item.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            
            <el-col :sm="12" :md="12" :lg="8">
                  <el-form-item :label="object['applyDate'].label" :prop="object['applyDate'].name" >
                    <el-date-picker  clearable v-model="mate.values[object['applyDate'].name]" type="date" placeholder="选择日期">
                    </el-date-picker>
                  </el-form-item>
            </el-col>

              <el-col :sm="12" :md="12" :lg="8">
              <el-form-item :label="object['opinion'].label" :prop="object['opinion'].name">
                <el-input type="textarea" :maxlength="textareaInputMaxLength" v-model="mate.values['opinion']" :show-word-limit="showWordLimit" placeholder="请输入内容 长度不超过50个字"></el-input>
              </el-form-item>
            </el-col>

        </template>
      </el-form>
    </el-row>
  </div>  
</template>
<script>
export default {
  components: {
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
    },
    'tree-selected': function index (resolve) {
      require(['../../components/TreeSelected.vue'], resolve)
    }
  },
  created () {
    this.mate.fields.map((i) => { this.object[i.name] = i })
    this.getOutOrg()
    this.getInOrg()
    if (this.mate.values.transoutOrg) {
      this.getOutStock(this.mate.values.transoutOrg)
    }
    if (this.mate.values.transinOrg) {
      this.getInStock(this.mate.values.transinOrg)
    }
  },
  data () {
    return {
      textareaInputMaxLength: 50,
      showWordLimit: true,
      object: {},
      orgOptions: [],
      outstockOptions: [],
      outStock: '',
      outStockData: [],
      inStock: '',
      inStockData: [],
      instockOptions: [],
      orgInOptions: [],
      labelPosition: 'right',
      rules: {
        transoutOrg: [
            { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        transoutStock: [
            { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        transinOrg: [
            { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        transinStock: [
            { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    mate: Object
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
        width = '100px'
      } else {
        width = this.mate.labelWidth
      }
      return width
    }
  },
  methods: {
  // 获取调出库存组织
    getOutOrg () {
      var vm = this
      this.orgOutOptions = []
      this.$root.ajaxData('/org/inventory/getOrgByOfficeId?ids=', {}, function (data) {
        data.map((item) => {
          vm.orgOutOptions.push({ 'label': item.name, 'value': item.id })
        })
      }, 'GET')
    },
    // 获取调入库存组织
    getInOrg () {
      var vm = this
      this.orgInOptions = []
      this.$root.ajaxData('/org/inventory/all?dataOnly=true', {}, function (data) {
        data.map((item) => {
          vm.orgInOptions.push({ 'label': item.name, 'value': item.id })
        })
      }, 'GET')
    },
    changeOutOrg () {
      this.mate.values.transoutStock = ''
      this.stockOptions = []
    },
    changeInOrg () {
      this.mate.values.transinStock = ''
      this.stockOptions = []
    },
    changeOutStock (val) {
      for (var i = 0; i < this.outStockData.length; i++) {
        if (this.outStockData[i].id === val) {
          if (this.outStockData[i].locationControl === 1) {
            this.mate.values.outStock = true
          } else {
            this.mate.values.outStock = false
          }
        }
      }
    },
    changeInStock (val) {
      for (var i = 0; i < this.inStockData.length; i++) {
        if (this.inStockData[i].id === val) {
          if (this.inStockData[i].locationControl === 1) {
            this.mate.values.inStock = true
          } else {
            this.mate.values.inStock = false
          }
        }
      }
    },
    // 获取指定组织下的仓库
    getOutStock (val) {
      var vm = this
      this.outstockOptions = []
      vm.outStockData = []
      if (val) {
        this.$root.ajaxData('/dc/getWarehouseByOrg/' + val, {}, function (data) {
          vm.outStockData = data
          for (var i = 0; i < data.length; i++) {
            var name = data[i].name
            var id = data[i].id
            var options = { value: id, label: name }
            vm.outstockOptions.push(options)
          }
        }, 'GET')
      }
    },
    // 获取入库的仓库
    getInStock (val) {
      var vm = this
      this.instockOptions = []
      vm.inStockData = []
      if (val) {
        this.$root.ajaxData('/dc/getWarehouseByOrg/' + val, {}, function (data) {
          vm.inStockData = data
          for (var i = 0; i < data.length; i++) {
            var name = data[i].name
            var id = data[i].id
            var options = { value: id, label: name }
            vm.instockOptions.push(options)
          }
        }, 'GET')
      }
    }
  }
}
</script>
<style scoped>
.el-form--inline>* {
  margin-right:10px
}
.el-form-item{
  margin: 15px 20px 2px 0px;
}
.leftFloat .el-row{
  float:left;
  width:250px;
}
.leftFloat .el-row input{
  width:250px;
}
.leftFloat .el-form-item{
  margin:0;
}
.leftFloat .button{
  float:left;
}
.el-form--inline .el-form-item {
  width:200px;
  display: inline-block;
  margin-right: 10px;
  vertical-align: top;
}
.el-form-item.is-required .el-form-item__label:before{
  content:''
}
.el-form-item.is-required .el-form-item__label:after{
  content: '*';
  color: #ff4949;
  margin-right: 4px;
}
.el-cascader{
  width:100%;
}
.el-select{
  width:100%;
}
.hidden{
  display:none;
}
h4{
  margin-top:40px;
  margin-bottom:10px;
}
.el-select{
  width:100%;
}
/* .el-input__suffix {
  right:45px
} */
.el-form-item--mini.el-form-item {
  margin: 6px;
}
/* .el-input--mini .el-input__inner{
  width:80%
} */
.el-date-editor.el-input{
  width:100%;
}
.el-form--inline.el-form--label-top .el-form-item__content{
  width:90%
}
.el-button--mini {
  padding: 7px 9px;
}
.leftFloat .el-form--inline .el-form-item{
  margin-right:10px;
}
</style>