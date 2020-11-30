<template>
  <div>
    <div>
      <el-button size="mini" :disabled="submitBtn" @click="submit">提交</el-button>
      <el-button size="mini" @click="back">取消</el-button>
    </div>
    <h1>结算单</h1>
    <ul>
      <li><span>购方公司：</span>&nbsp;&nbsp;  {{mate.mateFormerHeader.customerName}}</li>
      <li><span>购方业务实体：</span>&nbsp;&nbsp;  {{mate.mateFormerHeader.buyerOu}}</li>
      <li><span>采购员：</span>&nbsp;&nbsp;  {{mate.mateFormerHeader.buyer}}</li>
      <li><span>采购含税金额：</span>&nbsp;&nbsp;  {{mate.mateFormerHeader.moneyAmount}}</li>
      <li><span>付款条件：</span>&nbsp;&nbsp;  {{mate.mateFormerHeader.termName}}</li>
      <li><span>付款方法：</span>&nbsp;&nbsp;  {{mate.mateFormerHeader.payMethod}}</li>
      <li><span>税率：</span>&nbsp;&nbsp;  {{mate.mateFormerHeader.taxRate}}</li>
      <li><span>不含税金额：</span>&nbsp;&nbsp;  {{mate.mateFormerHeader.unTaxMoney}}</li>
      <li><span>税额：</span>&nbsp;&nbsp;  {{mate.mateFormerHeader.taxMoney}}</li>
    </ul>
    <ul>
      <li><span>销方公司：</span>&nbsp;&nbsp;  {{mate.mateFormerHeader.seller}}</li>
      <li><span>销方业务实体：</span>&nbsp;&nbsp;  {{mate.mateFormerHeader.salesOu}}</li>
      <li><span>销售员：</span>&nbsp;&nbsp;  {{mate.mateFormerHeader.salesPerson}}</li>
      <li><span>销售含税金额：</span>&nbsp;&nbsp;  {{mate.mateFormerHeader.sellerAmount}}</li>
    </ul>
    <div class="radioClass">
      <el-tabs type="border-card" size="mini">
            <el-tab-pane>
              <span slot="label">采购方对账明细</span>
              <ag-grid-vue style="height: 500px;"
                  class="ag-theme-balham"
                  :gridOptions="gridOptions"
                  :columnDefs="mate.mateList.columns"
                  :rowData="mate.mateList.rows"

                  :enableSorting="true"
                  :enableFilter="true"
                  >
              </ag-grid-vue>
            </el-tab-pane>
            <el-tab-pane v-if="mate.arMateList.rows !== undefined">
              <span slot="label">销售方对账明细</span>
              <ag-grid-vue style="height: 500px;"
                  class="ag-theme-balham"
                  :gridOptions="gridOptions"
                  :columnDefs="mate.arMateList.columns"
                  :rowData="mate.arMateList.rows"

                  :enableSorting="true"
                  :enableFilter="true"
                  >
              </ag-grid-vue>
            </el-tab-pane>
      </el-tabs>
    </div>
     <el-dialog center title="提示" width="30%" :visible.sync="dialogMessage" :close-on-click-modal="closeClickModal">
      <span style="font-size:15px;color:black">生成结算单:</span>{{sellementCode}}
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitCancel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import '../../../node_modules/ag-grid/dist/styles/ag-grid.css'
import '../../../node_modules/ag-grid/dist/styles/ag-theme-balham.css'
import { AgGridVue } from 'ag-grid-vue'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
export default {
  mixins: [ColumnFormatterMixin],
  data () {
    return {
      dialogFormVisible: false,
      hasSelected: [], // 选择的数据
      submitBtn: false,
      sellementCode: '',
      dialogMessage: false,
      showPurDetail: true,
      gridOptions: {
        enableColResize: true
      },
      sum: 0 // 采购总金额
    }
  },
  props: {
    mate: Object
  },
  created () {
    this.mate.mateList.columns.forEach(i => {
      i.headerName = i.label
      i.field = i.name
      if (i.name === 'lineType') {
        // 格式渲染
        i.cellRenderer = function (params) {
          if (params.value == 1) {
            return '杂项'
          } else if (params.value == 2) {
            return '运费'
          } else {
            return '项目'
          }
        }
      }
    })
    if (this.mate.arMateList.rows !== undefined) {
      this.mate.arMateList.columns.forEach(i => {
        i.headerName = i.label
        i.field = i.name
      })
    }
    this.formatterBefore(this.mate.mateList.columns)
    this.calc()
  },
  components: {
    AgGridVue
  },
  methods: {
    calc () {
      // var vm = this
      // vm.mate.mateFormerHeader.moneyAmount = 0
      // this.mate.mateList.rows.map(i => {
      //   vm.mate.mateFormerHeader.moneyAmount += Number(i.moneyAmount)
      // })
      // vm.mate.mateFormerHeader.moneyAmount = vm.mate.mateFormerHeader.moneyAmount.toFixed(2)
    },
    addLine () {
      this.dialogFormVisible = true
    },
    // 手动删除
    deleteLine () {
      var vm = this
      const copy = this.mate.mateList.rows
      const arrList = []
      this.hasSelected.map(i => {
        arrList[i.id] = true
      })
      this.mate.mateList.rows = []
      copy.map(i => {
        if (!arrList[i.id]) {
          vm.mate.mateList.rows.push(i)
        }
      })
      // 计算总金额
      this.calc()
    },
    submit () {
      // 点击提交，提交按钮就不能用了
      this.submitBtn = true
      var vm = this
      // if (this.mate.mateFormerHeader.sellerAmount != this.mate.mateFormerHeader.moneyAmount) {
      //   this.$message({
      //     message: '销售含税金额和采购含税金额不相等!',
      //     type: 'warning'
      //   })
      //   return
      // }
      // for (let i = 0; i < this.mate.mateList.rows.length; i++) {
      //   this.mate.mateList.rows[i].lineNum = i + 1
      // }
      const params = {
        mateList: this.mate.mateList.rows,
        mateFormerHeader: this.mate.mateFormerHeader
      }
      if (this.mate.arMateList.rows) {
        params.arMateList = this.mate.arMateList.rows
      } else {
        params.arMateList = []
      }
      var vm = this
      vm.$root.ajaxData('/purchase/settlement/batchSave', params, function (data) {
        if (data.statusCode === 11020) {
          return
        }else if (data.statusCode === 11021) {
          return
        } else if(data.statusCode === 10022){
          vm.$message({
            message: data.message,
            type: 'warning'
          })
          return
        } 
        else if (data.statusCode === 200) {
          vm.dialogMessage = true
          vm.sellementCode = data.data
          
        }
      }, 'POST')
    },
    // 提示确定
    submitCancel () {
      var vm = this
      vm.$root.monitor({ url: '/purchase/recon/pre/precast/list' })
      this.$root.monitor({ url: '/purchase/settlement/all/list' })
      this.$emit('isActive', '结算单')
      localStorage.removeItem('settlement')
    },
    back () {
      var vm = this
      vm.$root.monitor({ url: '/purchase/recon/pre/precast/list' })
    },
    changeType (val) {
      var vm = this
      if (val === '1') {
        this.showPurDetail = true
      } else {
        this.showPurDetail = false
      }
    }
  }
}
</script>

<style scoped>
  ul {
    display: inline-block;
    vertical-align: top;
    width: 350px;
    overflow: hidden;
  }
  ul li {
    list-style: none;
    margin: 5px 0;
  }
  ul li span {
    display: inline-block;
    width: 100px;
    text-align: right;
  }
  .el-form-item--mini.el-form-item {
    margin: 6px;
  }
  .tablePre {
    margin-top: 20px;
  }
  .radioClass {
    margin: 20px 0;
  }
</style>
