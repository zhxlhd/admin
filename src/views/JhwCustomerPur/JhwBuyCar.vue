<!-- created by fengjing on 2020/05/19 -->
<!-- 购物车 -->
<template>
    <div class="myCar">
      <el-row>
        <el-table max-height="300" border align="center" size="mini" ref="multipleTable" :data="tableData" show-overflow-tooltip  style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection"  width="55"></el-table-column>
          <el-table-column show-overflow-tooltip :label="list['supplierName'].label" :width="list['supplierName'].width" :prop="list['supplierName'].name"></el-table-column>
          <el-table-column show-overflow-tooltip :label="list['productCode'].label" :width="list['productCode'].width" :prop="list['productCode'].name"></el-table-column>
          <el-table-column show-overflow-tooltip :label="list['productName'].label" :width="list['productName'].width" :prop="list['productName'].name"></el-table-column>
          <el-table-column show-overflow-tooltip :label="list['specification'].label" :width="list['specification'].width" :prop="list['specification'].name"></el-table-column>
          <el-table-column show-overflow-tooltip :label="list['unitId'].label"  :formatter="list['unitId'].formatter" :width="list['unitId'].width" :prop="list['unitId'].name"></el-table-column>
          <el-table-column show-overflow-tooltip :label="list['count'].label" :width="list['count'].width" :prop="list['count'].name">
            <template slot-scope="scope">
              <el-input-number size="mini" v-model="scope.row.count" @change="handleChange(scope.row)" :min="1" ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip :label="list['priceWithTax'].label" :width="list['priceWithTax'].width" :prop="list['priceWithTax'].name"></el-table-column>
          <el-table-column show-overflow-tooltip :label="list['total'].label" :width="list['total'].width" :prop="list['total'].name"></el-table-column>
          <el-table-column show-overflow-tooltip :label="list['taxRate'].label" :width="list['taxRate'].width" :prop="list['taxRate'].name"></el-table-column>
          <el-table-column show-overflow-tooltip :label="list['tax'].label" :width="list['tax'].width" :prop="list['tax'].name"></el-table-column>
          <el-table-column show-overflow-tooltip :label="list['unTax'].label" :width="list['unTax'].width" :prop="list['unTax'].name"></el-table-column>
          <el-table-column label="操作" fixed="right" :min-width="150" v-if="mateList.actions">
            <template slot-scope="scope">
              <act-btn v-for="(act,index) in mateList.actions"
                    @action="handleActions"
                    size="mini"
                    :ref="act.action"
                    :act="act"
                    :row="scope.row"
                    :key="index"></act-btn>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="multipleSelection.length > 0" class="totalDetail">
          <span>总价：{{total}}</span>
          <span>税额：{{tax}}</span>
          <span>不含税总价：{{unTax}}</span>
          <el-button size="mini" type="primary" @click="goBookingSheet">确认</el-button>
        </div>
      </el-row>
      <el-row type="flex" justify="center">
        <el-pagination
          background
          :current-page.sync="currentPage"
          :total="pageTotal"
          :page-sizes.sync="pageSizes"
          :page-size.sync="pageSize"
          layout="prev, pager, next,sizes,total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          >
        </el-pagination>
      </el-row>
    </div>
</template>
<script>
import SERVICES from '@/services';
import ActBtn from '@/components/Button/ActionBtn';
import ColumnFormatterMixin from '@/mixins/ColumnFormatterMixin';
import { mapGetters, mapActions } from "vuex";
export default {
  mixins: [ColumnFormatterMixin],
  props: {
    mate: Object
  },
  components: {
    ActBtn
  },
  computed: {
    total(){
      var total = 0
      this.multipleSelection.forEach(item=>{
        total += Number(item.total)
      })
      return total.toFixed(2)
    },
    tax(){
      var tax = 0
      this.multipleSelection.forEach(item=>{
        tax += Number(item.tax)
      })
      return tax.toFixed(2)
    },
    unTax(){
      var unTax = 0
      this.multipleSelection.forEach(item=>{
        unTax += Number(item.unTax)
      })
      return unTax.toFixed(2)
    }
  },
  data(){
    return{
      listUrl: '/common/toList', // 元数据接口
      params: '?listName=jhw_buy_car',  // 详情参数
      bookingSheetParams: '?lineList=jhw_pre_pruchase_list_line&listFormName=jhw_pre_purchase_form&lineForm=jhw_pre_purchase_line_form', //请购单新增
      tableData: [], // 购物车数据
      list: {},                      // 明细行获取的数据
      mateList: this.mate.mateList,
      multipleSelection: [], //勾选数据
      currentPage: 1,
      pageSizes:[5, 10, 15, 20, 50, 100],
      pageSize: 5,
      pageTotal: 0
    }
  },
  created(){
    this.formatterBefore(this.mate.mateList.columns);
    this.mate.mateList.columns.map((i) => { this.list[i.name] = i })
    this.getMyCar()
  },
  methods: {
    /**
     * size切换 分页
     */
    handleSizeChange(val){
      this.pageSize = val
      this.getMyCar()
    },
    handleCurrentChange(val){
      this.currentPage = val
      this.getMyCar()
    },
    /**
     * 列表行操作按钮点击事件
     * @param {Object} act 按钮配置信息
     * @param {Object} row 当前行数据
     * @return void
     */
    handleActions(act, row) {
      // 保存行数据
      this.row = row;
      let action = act.action;
      const actions = {
        // 删除
        deleteDetail: (act, row) => this.deleteDetail(act, row)
      }
      return (actions[action] || actions.default)(act, row);
    },
    /**
     * 删除购物车信息
     * @param {Object} row
     */
    deleteDetail(act,row){
      let _this = this
      SERVICES.JHW_GOOD_PRICE.deleteGood(row.id).then(res=>{
        if(res.data.code === 200){
          _this.$message.success("删除成功");
          _this.getMyCar()
        }
      })
    },
    /**
     * 表单勾选框切换
     * @param {Object} val 勾选数据
     */
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    /**
     * 获取购物车列表
     */
    getMyCar(){
      let param = {
        ifNeedPage: true,
        pageSize: this.pageSize,
        pageNum: this.currentPage
      }
      let _this = this
      SERVICES.JHW_GOOD_PRICE.toMyCar(param).then(res=>{
        if(res.data.code === 200){
          _this.tableData = res.data.data.list
          _this.pageSize = res.data.data.pageSize
          _this.pageTotal = res.data.data.total
          _this.currentPage = res.data.data.pageNum
        }
      })
    },
    /**
     * 数量修改时 存入数据
     * @param {Object} 修改的行
     */
    handleChange(val){
      let _this = this
      let param = {
        shoppingCarId: val.id,
        count: val.count
      }
      SERVICES.JHW_GOOD_PRICE.updateMyCar(param).then(res=>{})
    },
    /**
     * 购物车勾选点跳转预订单
     * @param {Object} rowId 购物车勾选的行ID
     */
    goBookingSheet(){
      // 检查勾选项是否都是 同一供应商
      let name = []
      this.multipleSelection.forEach(item=>{
        name.push(item.supplierName)
      })
      let arr = new Set(name)
      if(arr.size > 1){
        this.$message.warning("请选择相同供应商的商品进行购买");
        return
      } else {
        let rowIds = {id: this.multipleSelection.map((r) => r.id)}
        let rowId = rowIds.id.join(',')
        this.$store.commit("JHWShopping/setCarId", rowId)
        this.$store.commit("JHWShopping/setIsEdit", false)
        this.$root.monitor({ url: `${this.listUrl}${this.bookingSheetParams}` });
      }      
    }
  },
  watch: {
    // 计算每行 小计 税额 不含税金额
    tableData: {
      handler: function (val, oldVal) {
        val.forEach(item => {
          item.total = (Number(item.count) * Number(item.priceWithTax)).toFixed(2)
          item.unTax = (Number(item.total)/(1+Number(item.taxRate)/100)).toFixed(2)
          item.tax = (Number(item.total) - Number(item.unTax)).toFixed(2)
        });
      },
      deep: true
    },
    mate: function (newMate) {
			this.formatterBefore(this.mate.mateList.columns)
		}
  }
}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
.myCar{
  /deep/.el-input-number--mini .el-input-number__decrease, /deep/.el-input-number--mini .el-input-number__increase{
    width: 15px;
  }
}
.totalDetail{
  float: right;
  span{
    padding: 0px 20px;
  }
}

</style>
