<template>
  <Boxer :mate="mate" :btnDisable="btnDisable" @action="handleButton">
    <div slot="main">
      <el-row>
        <el-col :span="24">
          <div class="rltv">
            <div class="title tree-head-first">{{mate.captions}}</div>
            <el-row class="last">
              <el-col v-for="col of mate.columns" :key="col.name" :span="col.span" class="title div-center" style="width: 20%;">{{col.label}}</el-col>
              <el-col :span="actionSpan" class="title div-center" style="width: 20%;">操作</el-col>
            </el-row>
          </div>
          <div>
            <el-tree :data="mateData"
              :props="defaultProps" 
              :default-expand-all="false"
              :expand-on-click-node="false"
              :render-content='renderContent'
              @node-click="handleNodeClick"
              >
            </el-tree>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" class="page"  v-if="mate.size > 0">
        <el-col :span="5">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="mate.page"
            layout="total,prev, pager, next,sizes"
            :total="mate.total"
            :page-sizes ="[10,15,20,30]"
            :page-size ="size">
          </el-pagination>
        </el-col>
      </el-row>
      <el-dialog title="分配子公司" :visible.sync="showTransfer"  width="800px" >
        <el-transfer  filterable  :titles="['所有子公司', '选中子公司']" v-model="value2" :data="data2"  class="dialogTransfer"> </el-transfer>
          <div class="dialogButton">
            <el-button size="mini" @click="confirm">提交</el-button>
            <el-button size="mini" @click="cancel">取消</el-button>
          </div>
      </el-dialog>
    </div>
  </Boxer>
</template>

<script>
/**
 * 组织机构页面
 **/
import KBtn from '../../components/KBtn.vue'
import DictStore from '../../store/dict-store.js'
import { debuglog } from 'util';
import axios from '@/utils/http'; // 导入http中创建的axios实例  
export default {
  name: 'organization',
  components: {
    KBtn,
    Boxer: function index (resolve) {
      require(['../../components/Boxer.vue'], resolve)
    }
  },
  props: {
    mate: Object
  },
  created () {
  },
  data () {
    return {
      mateData: [],
      page: 1,
      size: 10,
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
      actionSpan: 5,
      data2: [],
      value2: [],
      showTransfer: false
    }
  },
  created() {
    this.mateData = this.mate.rows
  },
  watch: {
    mateData: function (newMateData) {
      this.$nextTick(function () {
        this.renderContent
			})
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleNodeClick (data) {
    },
    renderContent: function (h, node) {
      var vm = this
      var domBtns = []
      var selfBtns = []
      var lineBtns = []
      var lineStatus = []
      var statusLine = []
      for (var btn of this.mate.actions) {
        if (btn.action !== 'toManyAddress') {
          domBtns.push(h(KBtn, {
            props: {
              act: btn,
              row: node.data,
              size: 'small'
            },
            on: {
              action: vm.handleButton
            }
          }))
        }
      }
      for (var i = 0; i < this.mate.actions.length; i++) {
        if (this.mate.actions[i].action !== 'addChild' && this.mate.actions[i].action !== 'enableInventory') {
          selfBtns.push(h(KBtn, {
            props: {
              act: this.mate.actions[i],
              row: node.data,
              size: 'small'
            },
            on: {
              action: vm.handleButton
            }
          }))
        }
      }
      var sum = 0
      var colSpan
      var cols = this.mate.columns.map((col) => {
        var value = '--'
        var value1
        if (node.data[col.name] && node.data[col.name] !== '') {
          value = node.data[col.name]
        }
        if (col.dict) {
          value = DictStore.formatDict(col.dict, node.data[col.name]) || value
        }
        if (col.name === 'status') {
          for (btn of col.actions) {
            lineBtns.push(h(KBtn, {
              props: {
                act: btn,
                row: node.data,
                size: 'small'
              },
              on: {
                action: vm.handleButton
              }
            }))
          }
          if (node.data['pid'] !== '0') {
            value1 = '--'
            lineBtns = []
          } else {
            if (node.data['status'] === 1) {
              lineBtns = []
            }
            if (col.dict) {
              value1 = DictStore.formatDict(col.dict, node.data['status'])
            }
          }
          lineStatus.push(h('el-col', { props: { span: 10 }, class: { 'col-tree': true, 'col-line': true }}, value1))
          statusLine.push(lineBtns, lineStatus)
          return h('el-col', { props: { span: 6 }, class: { 'col-tree': true, 'col-line': true }}, statusLine)
        }

        colSpan = Number(col.span)
        if (colSpan <= 0) colSpan = 4
        sum = sum + colSpan

        if (col.name === 'type') {
          if (node.data['type'] >= '1') {
            domBtns = selfBtns
          }
        }
        return h('el-col', { props: { span: colSpan }, class: { 'col-tree': true, 'col-line': true }}, value)
      })
      sum = 15 - sum
      

      cols.push(h('el-col', { props: { span: sum}, class: { 'col-tree': true, 'col-line': true }}, domBtns))
      vm.actionSpan = 5

      return h('span', [h('span', node.data.name), h('div', { class: { 'line-row': true }}, cols)])
    },
    getData (action, row) {
      const vm = this
      this.$root.ajaxData(this.mate.dataApi,{dataOnly:true}, function (data) {
        vm.mate.rows = data
        if (action === 'delete') {
          vm.$root.ajaxData(vm.mate.dataApi.replace('list', 'refresh'), {}, function (treeData) {
            vm.mateData = treeData
          })
        }
      })
    },
    handleButton (btn, row) {
      var vm = this
      if (btn.action === 'Certification') {
        this.$root.monitor({ url: '/companys/perfectInfo?name=' + row.name })
        return false
      }
      if (btn.action === 'distribution') {
        this.data2 = []
        this.value2 = []
        this.showTransfer = true
        vm.$root.ajaxData('/muti/list', {}, function (data) {
          data.uncheckedNameList.forEach((city, index) => {
            vm.data2.push({
              label: city,
              key: city
            })
          })
          vm.value2 = data.checkedNameList
        })
        return false
      }
      if(btn.action === 'toManyAddress'){
        var params = {}
        if(row.isMutiAddress === '1'){
          params.isMutiAddress = 0
            this.$root.ajaxData('/offices/' + row.id, params, function (data) {
            vm.$root.ajaxData(vm.mate.dataApi, {}, function (data) {
              vm.mate.rows = data.mate.rows
            }, 'GET')
          }, 'PUT')
          return
        } else {
          params.isMutiAddress = 1
          this.$root.ajaxData('/offices/' + row.id, params , function (data) {
            vm.$root.ajaxData(vm.mate.dataApi, {}, function (data) {
              vm.mate.rows = data.mate.rows
            }, 'GET')
          }, 'PUT')
        }
        return
      }
      if(btn.action === 'enableInventory'){
        var params = {}
        if(row.enableInventory === '1'){
          params = '0'
            this.$root.ajaxData('/offices/enable/' + row.id + '/' + params, {}, function (data) {
            vm.$root.ajaxData(vm.mate.dataApi, {}, function (data) {
              vm.mate.rows = data.mate.rows
            }, 'GET')
          }, 'PUT')
          return
        } else {
          params = '1'
          this.$root.ajaxData('/offices/enable/' + row.id + '/' + params, {}, function (data) {
            vm.$root.ajaxData(vm.mate.dataApi, {}, function (data) {
              vm.mate.rows = data.mate.rows
            }, 'GET')
          }, 'PUT')
        }
        return
      }
      this.$root.handleAction(btn, row, function () {
        vm.getData(btn.action, row)
      })
    },
    handleSizeChange (val) {
      this.changSize = true
      this.size = val
      this.$nextTick(function () {
				this.getSearch()
			})
    },
    handleCurrentChange (val) {
      this.changPage = true
      this.page = val
      this.$nextTick(function () {
				this.getSearch()
			})
    },
    /**
     * 分页
     * @param void
     * @return void
     */
    getSearch(flag) {
      let url = this.mate.dataApi
      if (this.changPage || this.changSize){  
        axios.get(url+'?pageSize=' + this.size + '&pageNum=' + this.page).then(res =>{
          this.mateData = res.data.mate.rows
        })
      }
    },
    confirm () {
      var vm = this
      // if(this.value2.length == 0) {
      //     this.$message({
      //       message: '请选择子公司',
      //       type: 'warning'
      //   })
      //   return
      // }
      this.$root.ajaxData('/muti/save', this.value2, function (data) {
        vm.showTransfer = false
      }, 'POST')
    },
    cancel () {
      this.showTransfer = false
    }
  }
}
</script>

<style lang="scss" rel="stylesheet">
  .el-tree-node__content {
    line-height: 33px;
    height: 33px;
    position: relative;
    border-bottom: 1px solid #e0e6ed;
  }
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
    height: 30px;
    line-height: 30px;
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
    text-align: center;
  }
  .last {
    margin-left:30%;
  }

  .rltv{
    position:relative;
    border: 1px solid #dfe6ec;
    border-bottom: 0;
  }
  .col-line {
    overflow: hidden; 
    white-space: nowrap; 
    text-overflow: clip;
    width: 20%;
    height:33px;
  }
  .el-table td, .el-table th {
    height: 30px;
  }
  .dialogButton{
    margin-top: 10px;
    margin-left: 38%
  }
  .dialogTransfer{
    .el-transfer-panel{
      width: 40%;
    }
  }
</style>
