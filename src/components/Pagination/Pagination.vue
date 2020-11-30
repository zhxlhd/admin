<template>
  <div :class="{'hidden':hidden}" class="pagination-container">
    <el-row type="flex" justify="center" class="page" >
      <el-col>
        <el-pagination v-bind="$attrs"
          :background="background"
          :current-page.sync="currentPage"
          :layout="layoutInit"
          :total="total"
          :page-sizes.sync="pageSizes"
          :page-size.sync="pageSize"
          :hide-on-single-page="hideOnSinglePage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to';

export default {
  name: 'Pagination',
  props: {
    mate: Object,
    // 列表内所有数据的长度
    total: {
      type: Number
    },
    // 当前页码
    page: {
      type: Number,
      default: 1
    },
    // 每页显示数据条目个数
    size: {
      type: Number,
      default: 10
    },
    // 每页的列表内可更换的不同行数
    pageSizes: {
      type: Array,
      default() {
        return [5, 10, 15, 20, 30, 50]
      }
    },
    // 组件布局 sizes, prev, pager, next, jumper, ->, total, slot
    layout: {
      type: String,
      default: 'total, prev, pager, next, sizes'
    },
    // 是否为分页按钮添加背景色
    background: {
      type: Boolean,
      default: false
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    },
    // hideOnSinglePage: {
    //   type: Boolean,
    //   default: true
    // }
  },
  computed: {
    hideOnSinglePage(){
      let { total, size, pageSizes } = this;
      let min = Math.min(...pageSizes);
      if(size > min && total > min ){
        return false
      }else {
        return this.total/this.size < 1;
      }
    },
    // 当前页数
    currentPage: {
      get() {
        return this.page;
      },
      set(val) {
        this.$emit('update:page', val);
      }
    },
    // 当前页面内的列表行数
    pageSize: {
      get() {
        return this.size;
      },
      set(val) {
        this.$emit('update:size', val);
      }
    },
    layoutInit: function() {
      let jumper = Math.ceil(this.total / this.pageSize) > 10;
      let isJumper;
      return isJumper = jumper ? "total, prev, pager, next, sizes, jumper" : "total, prev, pager, next, sizes";
    }
  },
  methods: {
    // 更换每页列内不同的行数
    handleSizeChange(val) {
      this.$emit('pagination', { page: this.currentPage, size: val }, true);
      if (this.autoScroll) {
        scrollTo(0, 500)
      }
    },
    // 换页
    handleCurrentChange(val) {
      this.$emit('pagination', { page: val, size: this.pageSize }, true);
      if (this.autoScroll) {
        scrollTo(0, 500)
      }
    }
  }
}
</script>

<style scoped>
  .pagination-container {
    background: #fff;
    padding: 16px 16px;
  }
  .el-pagination{
    text-align: center;
  }
  .pagination-container.hidden {
    display: none;
  }
  .page{
    margin: 0;
  }
</style>
