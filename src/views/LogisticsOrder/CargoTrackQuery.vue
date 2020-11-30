<!-- created by hezhiqiang on 2019/1/10 -->
<!-- 货物追踪查询 -->
<template>
  <div>
    <!-- headTable Start -->
    <KTableList
      :mate="mate"
      :mateSearch="mate.mateSearch"
      ref="listTable"
      :isIndex="isIndex"
      @rowClick="rowClick"
      @resetLineTable="showDetailTable=false"
    />
    <!-- headTable END -->
    <!-- detailTable Start -->
    <el-table size="mini" v-if="showDetailTable" :data="mate.mateListLine.rows" border id="main_table">
			<template v-for="(col,idx) of mate.mateListLine.columns">
				<el-table-column 
          show-overflow-tooltip 
          v-if="col.isShow && !col.isJoint"
            :formatter="col.formatter"
            :key="idx"
            :label="col.label"
            :prop="col.name"
            :min-width="col.width"
            :sortable="col.sortable">
        </el-table-column>
        <!-- 单元格有多个字段拼接 -->
        <el-table-column v-if="col.isShow && col.isJoint"
            :formatter="col.formatter"
            :key="idx"
            :label="col.label"
            :prop="col.name"
            :min-width="col.width"
            :sortable="col.sortable"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="jointContent">
                <span v-if="scope.row.isSign === 'Y'" style="background-color: #468847;">已签到</span>
                <span v-if="scope.row.delayTag === 'Y'" style="background-color: #999999;">有延迟</span>
                <span v-if="scope.row.fistTag === 'Y'">起始站点</span>
                <span v-if="scope.row.endTag === 'Y'">终点站</span>
              </div>
            </template>
        </el-table-column>
			</template>
    </el-table>
    <!-- detailTable End -->
  </div>
</template>
<script>
import KTableList from '@/components/table/KTableList'
import ActBtn from '@/components/Button/ActionBtn';
import SERVICES from '@/services'
import { LOGISTICS_ORDER_API } from "@/services/apis"
import { API_GATEWAY } from '@/config/index.js'

export default {
  components: {
    KTableList,
    ActBtn
  },
  data(){
    return {
      isIndex: true,                // table是否渲染序号
      showDetailTable: false,       // 是否渲染明细行表格
    }
  },
  props: {
    mate: Object
  },
  created (){
    this.init();
  },
  mounted () {
  },
  watch: {
    mate: function (newMate) {
      this.init();
    },
  },
  methods: {
    /**
     * 数据初始化
     * @param void
     * @return void
     */
    init () {
      this.showDetailTable = false;
      this.mate.mateList.rowClick = true; // 允许单击列表行请求行数据
    },
    /**
     * 展开明细行列表，并获取对应明细行数据
     * @param {Object} 当前点击行 id
     * @return void
     */
    rowClick (row) {
      this.headRowId = row.id
      // 渲染明细行表格
      this.showDetailTable = true
      // 获取明细行数据
      this.getDetailList()
    },
    /**
     * 获取明细行数据
     * @param {object} 点击行的 id数据
     * @return void
     */
    getDetailList () {
      SERVICES.CARGO_TRACKING.getDetailList(this.headRowId).then((res) => {
        let data = res.data
        this.mate.mateListLine.rows = data
      })
    },
    /**
     * 重新渲染列表页
     * @param void
     * @return void
     */
    reRenderList() {
      this.$root.monitor({ url: LOGISTICS_ORDER_API.CARGO_TRACKING_QUERY_LIST });
    },
  }
}
</script>
<style scoped lang="scss">
#main_table{
  table{
    td{
      position: relative;
    }
    .jointContent {
      span {
        color: #ffffff;
        padding: 3px;
        border-radius: 3px;
        background-color: #3a87ad;
      }
    }
  }
}
</style>
