<!-- created by hezhiqiang on 2020/05/14 -->
<!-- 库存台账 -->
<template>
  <div>
    <k-table-list ref="listTable" 
      :mate="mate" 
      :mateSearch="mate.mateSearch" 
      :isIndex="isIndex"
      :isIndexDialog="isIndexDialog"
      :isShowSearchBtn="isShowSearchBtn"
      :querySize="querySize"
      :isResetBtn="isHiddenResetBtn"
      @initQueryData="convertData"
    />
  </div>
</template>
<script>
import { DateFormat } from '../../utils/util.js'
import KTableList from '@/components/table/KTableList'
import SERVICES from '@/services'
import {JHW_INVENTORY_MANAGEMENT_API} from '@/services/apis'
import { dateFormatter } from "@/utils/DateUtils";
import axios from '@/utils/http';

export default {
  components: {
    KTableList
  },
  data(){
    return {
      isIndex: true,               // Table 是否渲染序号列
      isIndexDialog: true,         // 详情 Dialog Table 是否渲染序号列
      rowStatus: null,             // 列表订单行状态
      isShowSearchBtn: false,      // 是否显示搜索展开按钮
      multipleSelection: [],       // 勾选项数组
      querySize: 5,                // 查询每页 size
      isHiddenResetBtn: false,      // 是否隐藏搜索重置按钮
      hasSelected: false,
    }
  },
  props: {
    mate: Object
  },
  created (){
  },
  mounted (){
    
  },
  watch: {
    multipleSelection: function (newSelection) {
      this.hasSelected = (newSelection.length !== 0)
    },
    mate: {
      handler(newMate, oldMate) {
      　 this.init();
    　},
    　immediate: true
    }
  },
  methods: {
    init(){
      // 获取列表数据
      this.getListData()
    },
    /**
     * 获取列表数据
     */
    getListData () {
      let url = `${JHW_INVENTORY_MANAGEMENT_API.GET_INVEMTORY_ACCOUNT_DATA}`
      axios.post(url,{}).then(res => {
        if (res.data.list.length) {
          const data = res.data; // TODO 注意返回层级关系
          let { total, ...resData } = data;
          let rows = data.list;
          let page = data.pageNum;
          let size = data.pageSize;
          this.mate.mateList = { ...this.mate.mateList, size, page, total, rows };
        }
      })
    },
    /**
     * 数据转换
     * 后台返回数据结构不统一做数据转换处理
     * @param {Object} data 数据
     * @return void
     */
    convertData(data) {
      let { pageSize, total, pageNum, list, ...resData } = data
      let rows = list;
      let page = pageNum;
      let size = pageSize;
      this.mate.mateList = { ...this.mate.mateList, size, page, total, rows };
    },
  }
}
</script>
