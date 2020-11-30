<template>
  <div>
    <div class="searchForm">
      <el-row>
        <el-form 
          :model="searchForm" 
          ref="searchForm" 
          label-width="200px" 
          size="mini"
        >
          <el-col :sm="24" :md="24" :lg="12">
            <el-form-item label="组织" prop="region">
              <el-select clearable v-model="searchForm.region" placeholder="库存组织" style="width:300px">
                <el-option label="组织一" value="shanghai"></el-option>
                <el-option label="组织二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="24" :lg="12">
            <el-form-item label="PO编号" prop="goodsname">
              <el-input clearable size="mini" placeholder="PO编号" style="width:300px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="24" :lg="12">
            <el-form-item label="料号编号" prop="goodsname">
              <el-input clearable size="mini" placeholder="物料编号" style="width:300px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="24" :lg="12">
            <el-form-item label="接收单号" prop="goodsname">
              <el-input clearable size="mini" placeholder="接收单号" style="width:300px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="24" :lg="12">
            <el-form-item label="RMA单号" prop="goodsname">
              <el-input clearable size="mini" placeholder="RMA单号" style="width:300px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="24" :lg="12">
            <el-form-item label="发货日期" required>
              <el-date-picker type="daterange" style="width:300px" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item ></el-form-item>
          </el-col>
          <el-col :sm="24" :md="24" :lg="12">
            <el-form-item label="接收日期" required>
              <el-date-picker
              type="daterange"
              style="width:300px"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="24" :lg="12">
            <el-form-item label="退货日期" required>
              <el-date-picker
              type="daterange"
              style="width:300px"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col> 
          
          <el-col :sm="24" :md="24" :lg="24">
            <el-form-item label-width="600px">
              <el-button type="primary" size="mini" @click="clickQuery">查询</el-button>
              <el-button size="mini" @click="reset">重置</el-button>
            </el-form-item>
          </el-col> 
        </el-form>
      </el-row>
    </div>
    
    <Boxer
      :mate="mate.mateList"
      :hasSelected="hasSelected"
      @action="handleButton"
      ref="Boxer"
      :msgBoxButton="msgBoxButton"
    >
      <div slot="main">
        <div>
          <el-row>
            <el-col :span="24">
              <el-table
                size="mini"
                highlight-current-row
                ref="table"
                stripe
                :data="mate.mateList.rows"
                @selection-change="handleSelectionChange"
              >
                <el-table-column align="center" type="selection" width="30"></el-table-column>
                <!-- <el-table-column
                  align="center"
                  v-if="col.blockHash"
                  :formatter="col.formatter"
                  v-for="col of mate.mateList.columns"
                  v-bind:key="col.name"
                  :label="col.label"
                  :prop="col.name"
                  :min-width="col.width"
                  :sortable="col.sortable"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="mini"
                      v-show="scope.row.blockHash"
                      @click="clickBlockHash(scope.row,scope.row.blockHash)"
                    >
                      <img
                        src="../../assets/imgs/ztree/ic_chain.png"
                        style="width:13px; margin:-2px 2px"
                      />
                      {{ scope.row.settleCode }}
                    </el-button>
                    <span v-show="!scope.row.blockHash">{{ scope.row.settleCode }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  v-if="col.isShow"
                  v-for="(col,index) of mate.mateList.columns"
                  v-bind:key="col.name+index"
                  :formatter="col.formatter"
                  :label="col.label"
                  :prop="col.name"
                  :min-width="col.width"
                  :sortable="col.sortable"
                  show-overflow-tooltip
                ></el-table-column> -->
                <el-table-column
                  align="center"
                  fixed="right"
                  label="操作"
                  :width="actionWidth"
                  v-if="mate.mateList.actions"
                >
                  <template slot-scope="scope">
                    <k-btn
                      v-for="act of mate.mateList.actions"
                      v-bind:key="act.action"
                      size="mini"
                      :act="act"
                      :icon="act.icon"
                      :row="scope.row"
                      @action="handleAction"
                    ></k-btn>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center" class="page">
            <el-col :span="12">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="mate.mateList.page"
                layout="total, prev, pager, next, sizes"
                :total="mate.mateList.total"
                :page-sizes="[5,10,15,20,30]"
                :page-size="pageSize"
              ></el-pagination>
            </el-col>
          </el-row>
        </div>
      </div>
    </Boxer>
  </div>
</template>

<script>
import Vue from "vue";
import { API_GATEWAY } from "@/config/index.js";
import SearchForm from "../../components/SearchForm";
import KBtn from "../../components/KBtn.vue";
import Boxer from "../../components/Boxer.vue";
import BlockHash from "../../components/BlockHash";
import ColumnFormatterMixin from "../../mixins/ColumnFormatterMixin";
import { DateFormat } from "../../utils/util";

export default {
  mixins: [ColumnFormatterMixin],
  components: {
    KBtn,
    Boxer,
    BlockHash,
    Formor: function index(resolve) {
      require(["../../components/Formor.vue"], resolve);
    },
    DialogForm: function index(resolve) {
      require(["../../components/DialogForm.vue"], resolve);
    },
    "dict-selected": function index(resolve) {
      require(["../../components/DictSelected.vue"], resolve);
    }
  },
  props: {
    mate: Object,
    mateFormerHeaderId: String
  },
  data() {
    return {
      searchForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      }
    };
  },
  created() {
    let mateList = this.mate.mateList;
    this.formatterBefore(mateList.columns);
    this.formatterBefore(mateList.lineColumns);
    this.rowsContent = mateList.rows;
    mateList.localName = this.mate.localName;
    var user = window.sessionStorage.getItem("user");
    if (user) {
      user = JSON.parse(user);
    }
    this.user = user;
    if (this.mate.mateSearch) {
      this.titleOptions = this.mate.mateSearch.fields[0].options;
      this.operatorOptions = this.mate.mateSearch.fields[1].options;
      this.andOrSymbolOptions = this.mate.mateSearch.fields[3].options;
    }
    this._getCustomerName();
  },
  methods: {
    // 查询重置
    reset() {
      this.searchForm.status = "";
      this.searchForm.customerName = "";
      this.searchForm.ouName = "";
      this.searchForm.settleCode = "";
      this.searchForm.beginDate = "";
      this.searchForm.toDate = "";
      this.queryPage = false;
    },
    // 查询接口
    clickQuery() {
      let vm = this;
      this.searchForm.beginDate = DateFormat(
        this.searchForm.beginDate,
        "yyyy-MM-dd"
      );
      this.searchForm.toDate = DateFormat(this.searchForm.toDate, "yyyy-MM-dd");
      this.$root.ajaxData(
        "/purchase//so/detail/simple/search-n?isCopy=0",
        this.searchForm,
        function(data) {
          vm.mate.mateList.rows = data.mate.rows;
          vm.mate.mateList.total = data.mate.total;
          vm.queryPage = true;
        },
        "POST"
      );
    },
    clearCondition() {
      this.mate.mateSearch.values = [
        {
          name: "",
          operator: "",
          value: "",
          andOrSymbol: "null"
        }
      ];
    },
    // 点击添加查询条件
    addCondition() {
      let len = this.mate.mateSearch.values.length;
      if (this.mate.mateSearch.values.length >= 1) {
        this.mate.mateSearch.values[len - 1]["andOrSymbol"] = "";
      }
      this.mate.mateSearch.values.push({
        name: "",
        operator: "",
        value: "",
        andOrSymbol: "null"
      });
    },
    // 查询按钮
    query() {
      this.mate.mateList.lineRows = null;
      let len = this.mate.mateSearch.values.length;
      let data = this.mate.mateSearch.values;
      for (let i = 0; i < len; i++) {
        if (data[i]["name"] === "sl.create_at") {
          data[i]["value"] = DateFormat(data[i]["value"], "yyyy-MM-dd");
        }
        if (data[i]["andOrSymbol"] === "") {
          this.message("请选择并列条件", "warning");
          return;
        }
      }
      const mate = this.mate.mateSearch.values;
      const vm = this;
      const url = this.mate.mateSearch.url;
      this.$root.ajaxData(
        url,
        mate,
        function(data) {
          vm.mate.mateList.rows = data.mate.rows;
          vm.mate.mateList.total = data.mate.total;
        },
        "POST"
      );
    },
    handleButton(btn) {
      var vm = this;
      let row =
        btn.isApi || btn.ajax
          ? { id: this.multipleSelection.map(r => r.id) }
          : {};
      this.rowId = row;
      // 新增的时候不需要带上row，也不需要带上select前面的id
      if (btn.action === "addDetailBill") {
        this.$emit("action", btn);
        return;
      }
      // 结算单导出
      if (btn.action === "exportSettlement") {
        if (this.multipleSelection.length > 1) {
          this.message("请选择一条数据", "warning");
          return;
        }
        const rowt = {
          id: this.multipleSelection.map(r => r.id),
          customerName: this.multipleSelection.map(r => r.customerName)
        };
        let exportUrl = "";

        //判断客户是否是欣旺达电动汽车电池有限公司
        if (rowt.customerName == "欣旺达电动汽车电池有限公司") {
          exportUrl =
            API_GATEWAY + "/api" + btn.url + "_dq?format=xlsx&&ID=" + rowt.id;
        } else {
          exportUrl =
            API_GATEWAY + "/api" + btn.url + "?format=xlsx&&ID=" + rowt.id;
        }

        this.$http({
          url: exportUrl,
          method: "GET",
          headers: {
            Authorization: "Bearer " + window.sessionStorage.getItem("token"),
            Accept: "application/json",
            "X-TenantId": JSON.parse(window.sessionStorage.getItem("user")).tenantId
            // 'Content-Type': 'application/x-www-form-urlencoded;charset=utf8'
          },
          responseType: "arraybuffer"
        }).then(function(response) {
          var blob = new Blob([response.data], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          });
          var objectUrl = URL.createObjectURL(blob);
          var a = document.createElement("a");
          document.body.appendChild(a);
          a.setAttribute("style", "display:none");
          a.setAttribute("href", objectUrl);
          a.setAttribute("download", "结算单.xlsx");
          a.click();
          URL.revokeObjectURL(objectUrl);
        });
        return;
      }
    }
  }
};
</script>

<style lang="scss">
.searchForm {
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}
</style>
