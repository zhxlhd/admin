<!-- 收货管理新增页面头部表单 -->
<template>
  <div>
    <el-row>
      <el-form size="mini" :model="mate.values" :inline="mate.inline" :label-position="labelPosition" ref="ruleForm" :label-width="labelWidth">
        <el-row>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item label="入库单号查询">
              <el-input  v-model="input" prefix-icon="el-icon-search" @click="searchInput" @focus="searchInput"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['orgId'].label" :prop="object['orgId'].name">
                <el-select clearable v-model="mate.values[object['orgId'].name]">
                <el-option :label="item.label" :value="item.value" v-for="item of orgOption" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 接收人 -->
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['receiveUser'].label" :prop="object['receiveUser'].name">
              <el-select filterable clearable v-model="mate.values[object['receiveUser'].name]">
                <el-option :label="item.label" :value="item.value" v-for="(item,index) of object['receiveUser'].options" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 接受日期 -->
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item  :label="object['receiveDate'].label" :prop="object['receiveDate'].name">
              <el-date-picker clearable type="date" v-model="mate.values[object['receiveDate'].name]"></el-date-picker>
            </el-form-item>
          </el-col>
          <!--来货单位类型--> <!--  -->
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['prividerType'].label">
              <el-input disabled v-model="mate.values.prividerTypeName"></el-input>
            </el-form-item>
          </el-col>
          <!--来货单位-->
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['privider'].label" :prop="object['privider'].name">
              <el-input disabled v-model="mate.values.prividerName"></el-input>
            </el-form-item>
          </el-col>
          <!--来货地点-->
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['prividerSite'].label" :prop="object['prividerSite'].name">
              <el-input disabled v-model="mate.values[object['prividerSite'].name]"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['shipmentBoxQty'].label" :prop="object['shipmentBoxQty'].name">
              <el-input v-model="mate.values[object['shipmentBoxQty'].name]"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['billLadingNumber'].label" :prop="object['billLadingNumber'].name">
              <el-input v-model="mate.values[object['billLadingNumber'].name]"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['packingSlipNumber'].label" :prop="object['packingSlipNumber'].name">
              <el-input v-model="mate.values[object['packingSlipNumber'].name]"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['docRemark'].label" :prop="object['docRemark'].name">
              <el-input v-model="mate.values[object['docRemark'].name]"></el-input>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import treeSelect from '../../components/tree-select/tree.vue';
import SERVICES from '@/services';

export default{
  data () {
    return {
      object: {},
      orgOption: [],
      input: '',
      mateValuesId: 0,
      labelPosition: 'right'
    }
  },
  components: {
    'tree-selected': function index (resolve) {
      require(['../../components/TreeSelected.vue'], resolve)
    },
    treeSelect
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
  created () {
    const _this = this;
    this.mate.fields.map((i) => { this.object[i.name] = i })
    // 获取接收人列表
    SERVICES.BASE.getUserList().then(res =>{
      let userList = [];
      res.data.forEach(item =>{
        userList.push({ 
          'label': item.firstname && item.lastname &&`${item.firstname}${item.lastname}` || item.username, 
          'value': item.id 
          })
      })
      _this.object['receiveUser'].options = userList;
    })
    this.$root.ajaxData('/org/inventory/getOrgByOfficeId?ids=', {}, function (data) {
      data.map((i) => {
        _this.orgOption.push({ 'label': i.name, 'value': i.id })
        if (!_this.mate.values.id) {
          if (_this.orgOption.length !== 0) {
            _this.$set(_this.mate.values, 'orgId', _this.orgOption[0].value)
          }
        }
      })
    })
  },
  methods: {
    searchInput () {
      this.$emit('action')
    }
  }
}
</script>

<style scoped>
.el-form-item {
    margin: 15px 20px 2px 0px;
}
.el-input__suffix {
  right:80px
}
.el-form-item--mini.el-form-item {
  margin: 6px;
}
.el-input--mini .el-input__inner{
  width:80%
}
.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 100%;
}
.el-select{
  width: 100%;
}
</style>

