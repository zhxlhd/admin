<!-- 弹窗的 Table -->
<template>
  <div>
    <el-row>
      <template>
        <el-table  :row-class-name="tableRowClassName" size="mini" :data="mate.mateList.lineRows" border style="width: 100%;" class="detailTable" max-height="500" >
          <!-- 序号列 需要配置 isIndex 控制当前模块是否需要渲染 -->
          <el-table-column v-if="isIndex" type="index" width="auto" :label="$t('LABEL_TEXT.INDEX')">
            <template slot-scope="scope">
              <!-- 其中 mateList.page就是当前页数,mateList.size 就是每页行数 -->
              <span>{{scope.$index*indexNum + indexNum}}</span>
            </template>
          </el-table-column>
          <template v-for="col of mate.mateListLine.columns" >
            <el-table-column v-if="col.isShow && !col.isLighted" :formatter="col.formatter" :key="col.name" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip></el-table-column>
            <!-- 某些字段 高亮显示-->
            <el-table-column v-else-if="col.isShow && col.isLighted" :formatter="col.formatter" :key="col.name" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip>
                              <template slot-scope="{row}">
                               <span
                                :class="row.isRowEdit? 'editClass':'defaultClass'"
                               >
                               {{row[col.name]}}
                              </span>
                            </template>
              </el-table-column>
            <el-table-column v-if="col.status=='operation'" :formatter="col.formatter" :key="col.name" :label="col.label" :prop="col.name" :min-width="col.width" :sortable="col.sortable" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>
                  <el-button size="mini" v-if="col.name==='attachment'" @click="audit(scope.row,'checkAttachment')">查看附件</el-button>
                  <el-button size="mini" v-if="col.name==='schedule'" @click="audit(scope.row,'checkProgress')">查看进度</el-button>
                </span>
              </template>
            </el-table-column>
          </template>
        </el-table>
      </template>
    </el-row>
    <!-- 查看进度 的弹窗   -->
    <el-dialog :title="dialogTable.title" :visible.sync="dialogTable.visible" append-to-body custom-class="my-dialog">
      <el-table :data="mate.mateList.progressRows" border height="300" width="100%">
        <el-table-column type="index"  label="序号" min-width="50"></el-table-column>
        <el-table-column prop="type" label="类型" :formatter="typeFormatter" min-width="80"></el-table-column>
        <el-table-column prop="progressDesc" label="进度描述" min-width="180"></el-table-column>
        <el-table-column prop="createAt" label="时间" min-width="150"></el-table-column>
        <el-table-column prop="progress" label="进度" min-width="80" :formatter="progressFormatter"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- 查看附件 的弹窗   -->
    <el-dialog :title="attachmentDialogTable.title" :visible.sync="attachmentDialogTable.visible" append-to-body custom-class="my-dialog">
      <el-table :data="mate.mateList.attatchmentRows" border height="300" width="100%">
        <el-table-column type="index"  label="序号" min-width="50"></el-table-column>
        <el-table-column prop="fileName" label="附件名称" min-width="150">
          <template slot-scope="scope">
            <a target="_blank" :href="scope.row.attachmentUrl" :download="scope.row.fileName">{{scope.row.fileName}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="createAt" label="上传时间" min-width="100"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import ColumnFormatterMixin from "../mixins/ColumnFormatterMixin";
import FilterMixins from '../mixins/FilterMixins';
import KBtn from './KBtn.vue';

export default {
  mixins: [ColumnFormatterMixin, FilterMixins],
  components: {
    KBtn,
    'dict-selected': function index(resolve) {
      require(['./DictSelected.vue'], resolve)
    }
  },
  data() {
    return {
      isDisplay: true,
      dialogTable: { title: '', visible: false },
      attachmentDialogTable: { title: '', visible: false }
    }
  },
  props: {
    mate: Object,
    isIndex: { // Table 是否渲染序号列
      type: Boolean,
      default: false
    },
    indexNum: { // Dialog Table 序号列序号基数
      type: Number,
      default: 1
    }
  },
  created() {
    this.formatterBefore(this.mate.mateListLine.columns);
    this.filterValues(this.mate.mateListLine.columns);
  },
  mounted() {

  },
  computed: {},
  methods: {
    handleAction() {

    },
    /**
     * 设置行特殊样式
     * 根据行里 isRowEdit 判断
     */
    tableRowClassName({row, rowIndex}) {
      if (row.isRowEdit) {
        return 'warning-row';
      } else {
        return '';
      }
    },
    audit(row, type) {
      switch (type) {
        case 'checkAttachment':
          this.attachmentDialogTable.title = '查看附件';
          this.$parent.$parent.$parent.$parent.$parent.uploadAttachment(row.id);
          this.attachmentDialogTable.visible = true;
          break;
        case 'checkProgress':
          this.dialogTable.title = '查看进度';
          this.$parent.$parent.getProgressData(row.id);
          this.dialogTable.visible = true;
          break;
        default:
          break;
      }
    },
    typeFormatter(row, column) {
      let typeName = '';
      switch (row.type) {
        case '0': typeName = '系统';break;
        case '1': typeName = '手动';break;
        default:break;
      }
      return typeName;
    },
    progressFormatter(row, column) {
      return row.progress + '%';
    }
  }
}
</script>
<style lang="scss">
    .my-dialog .el-dialog__body { padding: 10px 15px!important; }
    .detailTable { 
      .warning-row {
        background: oldlace;
      }
    }
</style>
<style scoped lang="scss">
    .el-table td, .el-table th { height: 25px }
    .detailTable { 
      margin-top: 20px;
    }
    .editClass{
        cursor: pointer;
        color: red;
      }
      .defaultClass{
        cursor: pointer;
        color: #409EFF;
      }
</style>
