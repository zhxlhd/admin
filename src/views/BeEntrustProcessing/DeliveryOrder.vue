
<!-- created by zhongxiaolong on 2019/10/12 -->
<!-- 交货单 DeliveryOrder -->
<template>
  <div>
    <k-table-list ref="listTable" 
                  :mate="mate" 
                  :mateSearch="mate.mateSearch" 
                  :isIndex="isIndex" 
                  @btnClick="handleButtons" 
                  @rowClick="handleRowClick" 
                  @action="handleActions"></k-table-list>
     <!--  打印弹出全屏框 start-->
    <el-dialog title="打印送货标签" 
               :visible.sync="printDialogVisible" 
               fullscreen 
               class="my-dialog">
      <div style="padding: 20px">
        <div ref="print">
          <el-row v-for="(printTable,index) in printTableList" :key="index" style="margin: 20px auto; display: block; width: 740px; background: #fff;">
            <table border= "1" class="my-table" id="table" style="width: 100%;">
              <tr>
                <th style="width: 30%;overflow-x: hidden" rowspan="4">
                  <div v-if="printTable.attachmentUrl && printTable.attachmentUrl !== ''" style="width: 100%;height: 120px;display: table;">
                    <span style="display: table-cell; vertical-align: middle;">
                      <img :src="printTable.attachmentUrl" style="width: 100%;height: auto; display: inline-block;">
                    </span>
                  </div>
                  <div v-else>没有上传图片</div>
                </th>
                <th width= "15%"><div>单位</div></th>
                <td width= "55%" colspan="3"><div>{{printTable.customerName}}</div></td>
              </tr>
              <tr>
                <th width= "15%"><div>物料编码</div></th>
                <td width= "20%"><div>{{printTable.materialsCode}}</div></td>
                <th width= "15%"><div>品名</div></th>
                <td width= "20%"><div>{{printTable.materialsName}}</div></td>
              </tr>
              <tr>
                <th width= "15%"><div>规格</div></th>
                <td width= "20%"><div>{{printTable.specs}}</div></td>
                <th width= "15%"><div>加工要求</div></th>
                <td width= "20%"><div>{{printTable.processingRequire}}</div></td>
              </tr>
              <tr>
                <th width= "15%"><div>数量</div></th>
                <td width= "20%"><div>{{printTable.deliveryCount}}</div></td>
                <th width= "15%"><div>日期</div></th>
                <td width= "20%"><div>{{printTable.orderDate}}</div></td>
              </tr>
              <tr>
                <th width= "30%"><div>备注</div></th>
                <td width= "70%" colspan="4"><div>{{printTable.remarks}}</div></td>
              </tr>
            </table>
          </el-row>
        </div>
        <el-row type="flex" justify="center">
          <el-button @click="printDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="printOk">打 印</el-button>
        </el-row>
      </div>
    </el-dialog>
    <!--  打印弹出全屏框 end-->
  </div>
</template>
<script>
import SERVICES from '@/services';
import { BE_ENTRUST_PROCESSING_API } from "@/services/apis";

export default {
  components: {
    KTableList: function index(resolve) {
      require(["@/components/table/KTableList.vue"], resolve);
    }
  },
  props: {
    mate: Object
  },
  data(){
    return {
      isIndex: false,             // Table 是否渲染序号列
      multipleSelection: [],      // 勾选项数组
      printDialogVisible: false,  // 打印全屏弹框
      printTableList: [],             // 打印表格
    }
  },
  computed: {
		multipleSelectionLength: function () {
			return this.multipleSelection.length;
    },
  },
  created (){
    // this.init();
  },
  methods: {
    /**
     * 数据初始化
     * @param void
     * @return void
     */
    init () {},
    /**
     * 头部按钮控制
     * 点击按钮触发对应方法
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} rowId 勾选行 id数据  rowId.id
     * @param {Array} selection 勾选行数据
     * @return {Function} 执行操作的方法
     */
    handleButtons (btn, rowId, selection) {
      this.multipleSelection = selection;
      let action = btn.action;
      const rowIds = rowId.id ? rowId : { id: selection.map(r => r.id) };
      const btnEvents = {
        // update: (btn, rowIds) => this.handleUpdate(btn, rowIds), // 编辑/修改
        delete: (btn, rowIds) => this.handleDelete(btn, rowIds), // 删除
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(btn, rowIds);
    },
    /**
     * actions 操作
     * 点击 action 根据按钮配置的 action 做对应操作
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return {Function} 执行操作的方法
     */
    handleActions (act, row) {
      let action = act && act.action;
      const actions = {
        print: (act, row) => this.handlePrint(act, row),        // 打印送货单
        printTag: (act, row) => this.handlePrintTag(act, row),  // 打印标签
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
    },
    /** 修改按钮
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} ids 勾选行 id数据  ids.id
     * @return void
     */
    handleUpdate(btn, ids) {
      let status = this.multipleSelection[0].status;
      if (this.multipleSelectionLength != 1) {
        // 只能选择一行,不允许选择多行
        this.$message({
          message: this.$t("seladata"), // 请选择一行数据
          type: "warning"
        });
        return;
      }
      this.$root.handleAction(btn, ids, function() {});
    },
    /** 删除按钮
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} ids 勾选行 id数据  ids.id
     * @return void
     */
    handleDelete(btn, ids) {
      // 检查勾选项是否都是未启动状态 才能删除
      this.$root.handleAction(btn, ids, () => {
        this.reRenderList();
      });
    },
    /**
     * 打印订单
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
     */
    handlePrint(act, row) {
      // 打印接口请求地址和传参
      let url = `${act.url}?format=pdf&ID=${row.id}`;
      SERVICES.BASE.handlePrinter(url).then(ren =>{}).catch(err =>{});
    },
    /**
     * 打印标签
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
     */
    handlePrintTag(act, row) {
      this.printDialogVisible = true;
      SERVICES.DELIVERY_ORDER.print(row.id).then(res =>{
        if(res.status && res.data) {
          this.printTableList = res.data.lineList || [];
        }
      });
    },
    /** 确定打印
     * @param void
     * @return void
     */
    printOk() {
      this.$print(this.$refs.print);
    },
    /**
     * 请求当前操作行的查看详情中的列表行数据
     * 获取数据后渲染详情列表行
     * @param {Object} row 当前操作行的行数据
     * @param {Object} act 当前操作按钮的配置信息
     * @return void
     */
    handleRowClick (row, act) {
      let url = this.mate.mateList.url;
      SERVICES.BASE.getLines(url, row.id).then(res =>{
        let data = res.data.lineList || [];
        if (data.length){
          this.$set(this.mate.mateList, "lineRows", data);
        }
      })
    },
    /**
     * 重新渲染列表页
     * @param void
     * @return void
     */
    reRenderList() {
      this.$root.monitor({ url: BE_ENTRUST_PROCESSING_API.DELIVERY_ORDER_MAIN_LIST });
    },
  }
}
</script>
<style scoped lang="scss">
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  .my-dialog .my-table {
    width: 100%;
    margin: 20px 0;
  }
  .my-dialog .my-table td{
    text-align: center;
    vertical-align: middle;
    padding: 10px;
  }
  .my-dialog .my-table td div{
    text-align: left;
    display: inline-block
  }
  .main-article {
    padding: 20px;
    margin: 0 auto;
    display: block;
    width: 740px;
    background: #fff;
  }
</style>
