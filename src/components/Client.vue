<template>
<div>
<el-row :gutter="24">
  <el-col :span="24">
    <Boxer :mate="mate.mateList1"  :mateSearch="mate.mateSearch" :hasSelected="hasSelected" :btnDisable="btnDisable" @action="handleButton" ref="Boxer">
    <div slot="main">
      <el-row>
        <el-table ref="table" :data="mate.mateList1.rows" border  @selection-change="handleSelectionChange" @sort-change="sortChange" @row-click="rowClick" style="width: 100%" >
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column v-for="col of mate.mateList1.columns" :label="col.label" :prop="col.name" :width="col.width" :key="col.name"></el-table-column>
          </el-table>
      </el-row>
    </div>
  </Boxer>
  </el-col>
</el-row>

<el-row :gutter="24" class="mateList">
  <el-col :span="24">
    <h4>客户信息</h4>
    <div class="mask">
      <el-form :model="mate.mateFormer.values" :rules="rules" ref="ruleForm" :label-width="labelWidth" class="elForm">
        <div class="clientAddMsg">
          <div v-for="field of mate.mateFormer.fields" class="clientAddMsgDiv" :key="field.name">
            <el-form-item class="el-form-item" :label="field.label" :prop="field.name" v-if="field.holder == 'text'">
              <el-input v-model="mate.mateFormer.values[field.name]"></el-input>
            </el-form-item>
            <el-form-item class="el-form-item" :label="field.label" :prop="field.name" v-if="field.holder == 'switch'">
              <el-switch :on-text="field.on" :off-text="field.off" v-model="mate.mateFormer.values[field.name]"></el-switch>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
  </el-col>
</el-row>

<!--  弹出框，用于新增客户 -->
<el-dialog title="新增客户信息" :visible.sync="addClientFalse" width="80%">
  <el-form :model="newForm" :rules="rules" ref="ruleForm" :label-width="labelWidth" class="elForm">
        <div class="clientAddMsg">
          <div v-for="field of mate.mateFormer.fields" class="clientAddMsgDiv" :key="field.name">
            <el-form-item class="el-form-item" :label="field.label" :prop="field.name" v-if="field.holder == 'text'">
              <el-input v-model="newForm[field.name]"></el-input>
            </el-form-item>
            <el-form-item class="el-form-item" :label="field.label" :prop="field.name" v-if="field.holder == 'switch'">
              <el-switch :on-text="field.on" :off-text="field.off" v-model="newForm[field.name]"></el-switch>
            </el-form-item>
          </div>
        </div>
        <el-form-item>
          <el-button  @click="handleSubmit();addClientFalse=false">提交</el-button>
          <el-button @click="backward" v-if="!mate.inline">取消</el-button>
        </el-form-item>
      </el-form>
</el-dialog>

<!-- 审批-->
<el-dialog title="审批状态" :visible.sync="dialogFormVisible">
  <el-select v-model="valueStatus">
    <el-option label="未审批" value="-1"></el-option>
    <el-option label="审批中" value="0"></el-option>
    <el-option label="已审批" value="1"></el-option>
  </el-select>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button @click="dialogFormVisible = false;DialogClickOK()">确 定</el-button>
  </div>
</el-dialog>


</div>
</template>

<script>

import KBtn from './KBtn.vue'
import Boxer from './Boxer.vue'
export default {
  name: 'organization',
  components: {
    KBtn,
    Boxer,
    Formor: function index (resolve) {
      require(['./Formor.vue'], resolve)
    }
  },
  props: {
    mate: Object
  },
  created () {
    this.demo = this.mate.mateFormer.values
  },
  data () {
    return {
      options: {
        showCheckbox: false,
        showSearch: false,
        search: {
          useInitial: true,
          useEnglish: false,
          customFilter: null
        }
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      btnDisable: false,
      actionSpan: 8,
      id: '',           // 传给MaterialForm的参数
      mateMethod: 'PUT', // 传给MaterialForm的参数
      multipleSelection: [],
      hasSelected: false,
      searchValues: {},
      page: 0,
      sortValues: {},
      action: null,
      Data: [],
      dialogFormVisible: false,
      valueStatus: '',                 // 弹出框中的值
      disableSelectedAudit: 'disableSelectedAudit',
      btn: Object,              // 审批按钮需要用到的
      row: Object,               // 审批按钮需要用到的
      addClientFalse: false,
      addClient: 'addClient',
      updateClient: 'updateClient',
      demo: {},
      newForm: {},
      updateId: ''
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
      } else {
        width = this.mate.labelWidth
      }
      return width
    },
    rules () {
      var rs = {}
      var vm = this
      var rls = this.mate.rules
      for (var index in rls) {
        var r = []
        var rule = rls[index]
        for (var i in rule) {
          var nv = rule[i]
          if (nv.validator) {
            nv.validator = vm[nv.validator]
          }
          r[i] = nv
        }
        rs[index] = r
      }
      return rs
    }
  },
  watch: {
    multipleSelection: function (newSelection) {
      this.hasSelected = (newSelection.length !== 0)
      // this.$emit('btnDisable',this.btnDisable);
    },
    mate: function (newMate) {
      this.$nextTick(function () {
        this.rowSelect()
      })
    }
  },
  mounted () {
  },
  methods: {
    handleClick () {

    },
    DialogClickOK () {
      this.disableSelectedAudit = 'disableSelected'
      this.handleButton(this.btn, this.row)
    },
    rowSelect () {
      this.mate.mateList1.rows.forEach(row => {
          /* eslint-disable */
          let select = (row.id && this.mate.mateList1.selected && this.mate.mateList1.selected.findIndex(id => id == row.id) !== -1)
          /* eslint-enable */
        this.$refs.table.toggleRowSelection(row, (select === true))
      })
      // this.mate.selected = [];
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    hanldeNodeClick (data) {
      const getListApi = this.mate.dataApi + '?dataOnly=true&pid=' + data.id
      const vm = this
      this.$root.ajaxData(getListApi, {}, function (data) {
        vm.mate.rows = data
      })
    },
    getData (action, row) {
      const vm = this
      this.$root.ajaxData(this.mate.dataApi, { 'dataOnly': true }, function (data) {
        vm.mate.mateList.rows = data
        if (action === 'delete') {
          vm.$root.ajaxData(vm.mate.dataApi.replace('list', 'refresh'), {}, function (treeData) {
            vm.mate.treeData = treeData
          })
        }
      })
    },
    handleButton (btn, row) {
      var vm = this
      if (btn.action === this.addClient) {
        this.addClientFalse = true
        this.newForm = {}
        return
      }

      if (btn.action === this.updateClient) {
        this.addClientFalse = true
        return
      }

      if (btn.action === this.disableSelectedAudit) {
        this.dialogFormVisible = true
        this.btn = btn
        this.row = row
        return
      }

      this.disableSelectedAudit = 'disableSelectedAudit'
      const rowt = (btn.isApi || btn.ajax) ? { id: this.multipleSelection.map((r) => r.id) } : {}
      rowt.valueStatus = this.valueStatus
      this.$root.handleAction(btn, rowt, function () {
        vm.$root.ajaxData('/companys/', rowt, function (data) {
          vm.mate.mateList1.rows = data.mate.mateList1.rows                   // 针对物料管理中，点击发布按钮，刷新页面，现在是客户管理里面，但是没有刷新
        })
      })
    },
    handleCurrentChange () {
    },
    sortChange: function (sort) {
      if (!sort || !sort.column || !sort.column.sortable) {
        return
      }
      this.sortValues = {
        order: sort.order,
        column: sort.prop
      }
      this.getData()
    },
    rowClick (row) {
      var vm = this
      this.id = row.id
      this.$root.ajaxData('/companys/' + row.id, {}, function (data) {
        vm.mate.mateFormer.values = data
        vm.updateId = data.id
        vm.newForm = data
        // vm.mate.mateFormer = Object.assign({}, vm.mate.mateFormer, data)
      })
    },
    // 提交表单的方法
    handleSubmit (ev) {
      var vm = this
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let url = '/companys'
          const values = vm.mate.values
          if (vm.mate.inline) {
            vm.$emit('search', values)
            vm.mate.values = vm.defaultValues
          } else {
            // PUT 请求URL带上ID
            if ((vm.mate.method) === 'PUT' && values.id) {
              url = url + '/' + values.id
            }
            let act = {}
            act = { url: url, ajax: true, method: 'POST' }
            if (this.newForm.id === this.updateId) {
              act = { url: url + '/' + this.updateId, ajax: true, method: 'PUT' }
            }

            act.next = this.mate.next || false
            this.$root.action(act, this.newForm)
          }
        } else {
          this.$notify.error({
            title: '消息',
            message: '数据验证未通过'
          })
          return false
        }
      })
    },
    // 取消表单的方法
    backward () {
      this.addClientFalse = false
    }
  }
}
</script>

<style scoped>
  .line-btn {
    margin-left: 0;
    position   : absolute;
    top        : 10px
  }
  .title {
    border-bottom: 1px solid #e0e6ed;
    border-right : 1px solid #e0e6ed; 
    white-space: nowrap;
    overflow: hidden;
    background-color: #EFF2F7;
    text-align: center;
    height: 40px;
    line-height: 40px;
    min-width: 0;
    text-overflow: ellipsis;
    box-sizing: border-box;
    
    font-size: 14px;
    color: #1f2d3d;
  }
  .tree-head-first {
    width:30%;
    position:absolute;
    left:0;
    top:0;
  }
  .line-row{
    position:absolute;
    left:30%;
    top:0;
    width: 70%;
  }
  .last {
    margin-left:30%;
  }

  .rltv{
    position:relative;
    border: 1px solid #dfe6ec;
    border-bottom: 0;
  }
  .col-tree{
    text-align: center;
  }

  .div-center{
    text-align: center;
  }

  .halo-tree{
    padding-left: 20px;
  }

  .material{
      margin-top:50px;
  }
  
  .btnblock{
      padding-top:0;
  }

  .mateList{
    margin-top:40px;
  }

  .clientAddMsg{
    display:flex;
    flex-wrap:wrap;
  }

  .clientAddMsgDiv{
    flex:0 0 25%;
  }
  .clientAddMsgDiv .el-form-item{
    width:90%;
  }
  .elForm{
    border:1px solid #ddd;
    padding:30px 0 10px 30px;
  }
  .mask{
    position:relative;
  }
  .mask:after{
    content:"";
    position:absolute;
    width:100%;
    height:100%;
    top:0;
    left:0;
  }
  .el-form-item {
    margin: 15px 20px 2px 0px;
}
</style>
