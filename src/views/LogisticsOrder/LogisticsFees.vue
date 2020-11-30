<!-- created by hezhiqiang on 2019/12/18 -->
<!-- 物流费用报表 -->
<template>
  <div>
    <!-- listTable Start-->
    <KTableList
      :mate="mate"
      :mateSearch="mate.mateSearch"
      ref="listTable"
      :isIndex="isIndex"
      @checkButton="checkButton"
    />
    <!-- listTable End-->
    <!-- checkDialog Start-->
    <el-dialog title="运输费详情" width="30%" :visible.sync="checkDialogVisible">
     <table class="dialogStyle" border="1" cellspacing="0"> 
      <tr v-for="(item,index) in detailData" :key="index">
        <th>{{item.priceName}}：</th>
        <td>{{item.price}}</td>
      </tr>
     </table>
    </el-dialog>
    <!-- checkDialog End-->
  </div>
</template>
<script>
import KTableList from '@/components/table/KTableList'
import SERVICES from '@/services'
import { LOGISTICS_ORDER_API } from "@/services/apis"

export default {
  components: {
    KTableList
  },
  data(){
    return {
      isIndex: true,                // table是否渲染序号
      multipleSelection: [],        // 勾选列表数据
      checkDialogVisible: false,    // 运费详情弹出框
      detailData: [],               // 运费详情数据
    }
  },
  props: {
    mate: Object
  },
  created (){
  },
  mounted () {
    this._getProvider();    // 获取物流商名称
    this._getOffice();      // 获取业务实体
  },
  watch: {
    mate: function (newMate) {
      this._getProvider();    // 获取物流商名称
      this._getOffice();      // 获取业务实体
    }
  },
  methods: {
    /**
     * 获取物流商名称
     * @param void
     * @return void
     */
    _getProvider () {
      SERVICES.LOGISTICS_DELIVERY_ORDER.getLogisticsProvider().then(res => {
        if(res.data.length>0){
          let providerOptions = [];
          let data = res.data;
          if(data.length){
            data.forEach(item => {
              providerOptions.push({
                  label: item.providerName,
                  value: item.providerName,
                  id: item.id
              });
            });
            // 物流商名称保存到搜索表单配置中
            this.mate.mateSearch.fields.forEach(item =>{
              if (item.name === 'logisticsProviderName') {
                item.options = providerOptions
              }
            })
          }
        }
      });
    },
    /**
     * 获取业务实体
     * @param void
     * @return void
     */
    _getOffice () {
      SERVICES.LOGISTICS_DELIVERY_ORDER.getOffice().then(res => {
        let data = res.data;
        if (data.length) {
          let businessDivisions = []
          data.forEach(item => {
            if ((item.name == "") || (item.name == undefined) || (item.id == "")) return;
            businessDivisions.push({
              'label': item.name,
              'value': item.name,
              'key': item.id,
            })
            // 业务实体保存到搜索表单配置中
            this.mate.mateSearch.fields.forEach(item =>{
              if (item.name === 'officeName') {
                item.options = businessDivisions
              }
            })
          })
        }
      })
    },
    /**
     * 列表费用明细查看按钮
     * @param void
     * @return void
     */
    checkButton (row) {
      let rowId = row.id
      this.checkDialogVisible = true
      SERVICES.COMPLETE_REIMBURSEMENT.checkLogisticsFeesDetail(rowId).then(res => {
        this.detailData = res.data
      })
    },   
  }
}
</script>
<style lang="scss" scoped>
.dialogStyle {
  width: 300px;
  margin: 0 auto;
  tr,th,td {
    border: 1px solid #DDDDDD !important;
  }
}
</style>
