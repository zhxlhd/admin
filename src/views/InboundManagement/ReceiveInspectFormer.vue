<template>
  <div>
    <el-row>
      <el-form size="mini" :model="mate.values" :label-position="labelPosition" ref="ruleForm" :label-width="labelWidth">
        <el-row>
          <el-col :sm="12" :md="10" :lg="8">
            <el-form-item label="接收单号查询">
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

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['inspectUserId'].label" :prop="object['inspectUserId'].name">
              <el-select clearable @visible-change="visibleChange13" v-model="mate.values[object['inspectUserId'].name]" :placeholder="object['inspectUserId'].placeholder">
                <el-option :label="item.label" :value="item.value" v-for="(item,index) of object['inspectUserId'].options" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['prividerType'].label" :prop="object['prividerType'].name">
              <el-input disabled v-model="mate.values.prividerTypeName" readonly></el-input>
            </el-form-item>
          </el-col>

          <!--<el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="object['inspectDate'].label" :prop="object['inspectDate'].name">
              <el-date-picker type="date" v-model="mate.values[object['inspectDate'].name]"></el-date-picker>
            </el-form-item>
          </el-col>-->

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['inspectDate'].label" :prop="object['inspectDate'].name">
              <el-date-picker clearable v-model="mate.values[object['inspectDate'].name]" type="datetime" placeholder="选择日期时间" align="right"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['privider'].label" :prop="object['privider'].name">
              <el-input disabled v-model="mate.values.prividerName" readonly></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['prividerSite'].label" :prop="object['prividerSite'].name">
              <el-input disabled v-model="mate.values[object['prividerSite'].name]" readonly></el-input>
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
import Vue from 'vue'
import treeSelect from '../../components/tree-select/tree.vue'
export default{
  data () {
    return {
      object: {},
      input: '',
      labelPosition: 'right',
      orgOption: []
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
    this.mate.fields.map((i) => { this.object[i.name] = i })
    this.object['inspectUserId'].options.push({ value: this.mate.values.inspectUserId, label: this.mate.values.inspectUserName })
    var vm = this
    this.$root.ajaxData('/org/inventory/getOrgByOfficeId?ids=', {}, function (data) {
      data.map((i) => {
        vm.orgOption.push({ 'label': i.name, 'value': i.id })
        if (!vm.mate.values.id) {
          if (vm.orgOption.length !== 0) {
            Vue.set(vm.mate.values, 'orgId', vm.orgOption[0].value)
          }
        }
      })
    })
  },
  methods: {
    searchInput () {
      this.$emit('action')
    },
    visibleChange13 (flag) {
      var vm = this
      // 清空选项，不然每次点击都会push进去，会出现多条记录
      vm.object['inspectUserId'].options = []
      if (flag) {
        this.$root.ajaxData('/users/list?cols=id,username&dataOnly=true&all=1', {}, function (data) {
          for (var i = 0; i < data.length; i++) {
            var username = { value: data[i].id, label: data[i].username }
            vm.object['inspectUserId'].options.push(username)
          }
        }, 'GET')
      }
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
