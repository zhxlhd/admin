<!-- created by yxj on 2020/04/27 -->
<!-- 征信评级 -->
<template>
  <div>
    <k-table-list ref="listTable"
        :mate="mate"
        :mateSearch="mate.mateSearch"
        @initOperations="initOperations"
        @btnClick="handleButtons"></k-table-list>

    <!--  修改的征信评级弹窗  -->
    <el-dialog title="征信评级管理" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="企业名称:" :label-width="formLabelWidth">
          <span>{{form.name}}</span>
        </el-form-item>
        <el-form-item label="行业:" :label-width="formLabelWidth">
          <el-select v-model="form.industry" disabled>
            <el-option v-for="item in industryOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户类型:" :label-width="formLabelWidth">
          <el-select v-model="form.infoType" disabled>
            <el-option v-for="item in infoTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电镀园区/片区:" :label-width="formLabelWidth">
          <el-select v-model="form.parkId" disabled>
            <el-option v-for="item in parkList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="征信评级:" :label-width="formLabelWidth">
          <el-rate v-model="form.creditRating" :colors="colors" class="credit-rate"></el-rate>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { LOGISTIC_BASIC_DATA_API } from "@/services/apis"
import KTableList from '@/components/table/KTableList'
import SERVICES from "@/services"
import { BaseConstant } from '@/constant/BaseConstant'

export default {
  components: {
    KTableList
  },
  data(){
    return {
      infoTypeOptions: BaseConstant.SELECT_OPTIONS.INFO_TYPE, // 客户类型 下拉
      industryOptions: BaseConstant.SELECT_OPTIONS.INDUSTRY_OPTIONS, // 客户 下拉
      dialogFormVisible: false, //修改弹窗显示与否
      form: {
        name: '',
        industry: '',
        infoType: '',
        parkId: '',
        creditRating: ''
      },
      formLabelWidth: '120px',
      parkList: [], // 园区下拉
      multipleSelection: [],
      colors: ['#99A9BF', '#409eff', '#31b0ff'] //征信评级颜色
    }
  },
  props: {
    mate: Object
  },
  mounted() {
    this.initOperations();
    this.initOptions();
    this.getParkList();
  },
  methods: {
    /**
     * 重新渲染列表页
     * @param void
     * @return void
     */
    reRenderList() {
      this.$refs.listTable.$refs.multipleQueryForm.query();
    },
    /**
     * 头部按钮控制
     * 点击按钮触发对应方法
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @param {Array} selection 勾选行数据
     * @return void
     */
    handleButtons (btn, row, selection) {
      this.multipleSelection = selection;
      let action = btn.action;
      const btnEvents = {
        updateRate: () => this.updateRate(btn, row),
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(btn, row);
    },
    /**
     * 修改
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    updateRate (btn, row) {
      let multipleSelection = this.multipleSelection;
      if (multipleSelection.length !== 1) {
        // 只能选择一行,不允许选择多行
        this.$message({
          message: this.$t("seladata"), // 请选择一行数据
          type: "warning"
        });
        return;
      }
      for(let form in this.form) {
        this.form[form] = this.multipleSelection[0][form] || '';
      }
      this.dialogFormVisible = true;
    },
    /** 初始化行操作列按钮的状态
     * 只允许修改录入状态和驳回状态的加工单
     * enableEdit 是否允许编辑
     * ......可以对相关按钮进行初始化
     * @param void
     * @return void
     */
    initOperations() {
      let rows = this.mate.mateList.rows;
      // 如果没有行返回
      if (!rows.length) {
        return
      }else {
        rows.forEach(item => {
          item.enableEdit = true;
        });
      }
      rows.forEach(item => {
        let status = item.approvalStatus;
        if(status !== 1 && status !== 4){
          item.enableEdit = false;
        }
      });
    },
    /** 初始化本地数据下拉
     * @param void
     * @return void
     */
    initOptions() {
      let mate = this.mate;
      mate.mateSearch.fields.map((item) => {
        switch (item.name) {
          case 'industry':item.options = this.industryOptions;break;
          case 'infoType':item.options = this.infoTypeOptions;break;
          default:break;
        }
      });
    },
    /** 获取园区/片区下拉
     * @param void
     * @return void
     */
    getParkList() {
      SERVICES.ELECTROPLATING_PORTAL.getParkList().then(res => {
        if(res.data) {
          this.parkList = res.data;
        }
      });
    },
    /** 确认表单提交
     * @param void
     * @return void
     */
    confirmForm() {
      SERVICES.ELECTROPLATING_PORTAL.updateRate(this.multipleSelection[0].id,this.form.creditRating).then(res => {
        if(res.data && res.data.code == 200) {
          this.$message({
            message: '修改征信评级成功',
            type: "success"
          });
          this.dialogFormVisible = false;
          this.reRenderList();
        }else{
          this.$message({
            message: '修改征信评级失败',
            type: "warning"
          });
        }
      });
    }
  },
  watch: {
    mate: function (newMate) {
      this.initOperations();
      this.initOptions();
    }
  }
}
</script>
<style scoped>
  .credit-rate { position: relative;top: 10px }
</style>
