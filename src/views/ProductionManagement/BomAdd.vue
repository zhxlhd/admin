/**
 * BOM模块下新增模块
 */
<template>
  <div>
    <!-- 头部button Start-->
    <h-btn :btns="['提交', '保存', '取消']" @click="handleBtns"></h-btn>
    <!-- 头部button End-->
    <!-- 头部Form Start-->
    <header-form 
      ref="BomAddHeaderForm"
      :mate="mate.mateFormerHeader"></header-form>
    <!-- 头部Form End-->
    <!-- 底部 lineList Start-->
    <k-table :mate="mate.mateListLine" :height="maxHeight" @actionSelected="handleSelected" @action="handleKtable" @replacementMaterialAction="replacementMaterialAction"></k-table>
    <!-- 底部 lineList End-->
    <!-- 新增行弹窗 Start -->
    <el-dialog title="填写物料明细单" width="80%" :visible.sync="dialogFormVisible">
      <el-row>
        <el-form size="mini" :model="dialogForm.values" label-position="right" ref="LineForm"  :rules="rules" :label-width="labelWidth">
          <!-- 工序 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['procedures'].label" :prop="dialogObject['procedures'].name">
              <el-input v-model="dialogForm.values['procedures']"></el-input>
            </el-form-item>
          </el-col>
          <!-- 组件 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['componentCode'].label" :prop="dialogObject['componentCode'].name">
              <el-input v-model="dialogForm.values['componentCode']">
                <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 物料说明 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['componentName'].label" :prop="dialogObject['componentName'].name">
              <el-input disabled readonly v-model="dialogForm.values['componentName']"></el-input>
            </el-form-item>
          </el-col>
          <!-- 物料类型 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['materialsType'].label" :prop="dialogObject['materialsType'].name">
              <el-input disabled readonly v-model="dialogForm.values['materialsType']"></el-input>
            </el-form-item>
          </el-col>
          <!-- 版本 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['version'].label" :prop="dialogObject['version'].name">
              <el-input disabled readonly v-model="dialogForm.values['version']"></el-input>
            </el-form-item>
          </el-col>
            <!-- 单位 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['unit'].label" :prop="dialogObject['unit'].name">
              <el-input disabled readonly v-model="dialogForm.values['unit']"></el-input>
            </el-form-item>
          </el-col>
          <!-- 用量 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['used'].label" :prop="dialogObject['used'].name">
              <el-input v-model.lazy="dialogForm.values['used']" oninput = "value=value.replace(/[^\d.]/g,'')" @change="usedChange" ref="used"></el-input>
            </el-form-item>
          </el-col>
          <!-- 用量的倒数 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['usageReciprocal'].label" :prop="dialogObject['usageReciprocal'].name">
              <el-input v-model.lazy="dialogForm.values['usageReciprocal']" oninput = "value=value.replace(/[^\d.]/g,'')" @change="usageReciprocalChange" ref="usageReciprocal"></el-input>
            </el-form-item>
          </el-col>
          <!-- 良率 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['yieldRate'].label" :prop="dialogObject['yieldRate'].name">
              <el-input v-model="dialogForm.values['yieldRate']" oninput = "value=value.replace(/[^\d.]/g,'')"></el-input>
            </el-form-item>
          </el-col>
          <!-- 有效日期-开始 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['fromDateStr'].label" :prop="dialogObject['fromDateStr'].name">
              <el-date-picker :picker-options="pickerOptions" clearable v-model="dialogForm.values['fromDateStr']" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" @change="getFromDate"></el-date-picker>
            </el-form-item>
          </el-col>
          <!-- 有效日期-结束 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['toDateStr'].label" :prop="dialogObject['toDateStr'].name">
              <el-date-picker disabled v-model="dialogForm.values['toDateStr']" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" @change="getToDate"></el-date-picker>
            </el-form-item>
          </el-col>
          <!-- ECN单号 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['ecnCode'].label" :prop="dialogObject['ecnCode'].name">
              <el-input disabled readonly v-model="dialogForm.values['ecnCode']"></el-input>
            </el-form-item>
          </el-col>
          <!-- 已实施 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['deployFlag'].label" :prop="dialogObject['deployFlag'].name">
              <el-checkbox disabled v-model="dialogForm.values['deployFlag']"></el-checkbox>
            </el-form-item>
          </el-col>
          <!-- 位号 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['fileds'].label" :prop="dialogObject['fileds'].name">
              <el-input v-model="dialogForm.values['fileds']"></el-input>
            </el-form-item>
          </el-col>
          <!-- 批次损耗 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['batchLoss'].label" :prop="dialogObject['batchLoss'].name">
              <el-input-number class="input_number" v-model="dialogForm.values['batchLoss']" :controls="controls" :precision="0"></el-input-number>
            </el-form-item>
          </el-col>
          <!-- 阶梯数量 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['segmentedQuantity'].label" :prop="dialogObject['segmentedQuantity'].name">
              <el-input-number class="input_number" v-model="dialogForm.values['segmentedQuantity']" :controls="controls" :precision="0"></el-input-number>
            </el-form-item>
          </el-col>
          <!-- 阶梯下损耗 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['lowerLoss'].label" :prop="dialogObject['lowerLoss'].name">
              <el-input-number class="input_number" v-model="dialogForm.values['lowerLoss']" :controls="controls" :precision="2"></el-input-number>
            </el-form-item>
          </el-col>
          <!-- 阶梯上损耗 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['upperLoss'].label" :prop="dialogObject['upperLoss'].name">
              <el-input-number class="input_number" v-model="dialogForm.values['upperLoss']" :controls="controls" :precision="2"></el-input-number>
            </el-form-item>
          </el-col>
          <!-- 备注 -->
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="dialogObject['remarks'].label" :prop="dialogObject['remarks'].name">
              <el-input v-model="dialogForm.values['remarks']" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-button size="mini" @click="materielConfirm" type="primary">确 定</el-button>
      <el-button size="mini" @click="materielCancel">取 消</el-button>
    </el-dialog>
    <!-- 新增行弹窗 End -->
    <el-dialog title="替换料" width="80%" v-if="replaceMaterialsShow" :visible.sync="dialogReplacementMaterialVisible" :before-close="closeReplaceMaterials">
      <replacement-dialog 
        :mate="replacementMaterialObj" 
        @replaceShow="replaceShow" 
        @replaceHide="replaceCancel" 
        :modal-append-to-body="false" 
        @replaceConfirm="replaceConfirm" 
        @replaceCancel="replaceCancel" />
    </el-dialog>
     <!-- 物料搜索框-->
    <material-search 
      v-if="searchDialogVisible"  
      :isRepeat="isRepeat" 
      :materialsType="materialsType" 
      :orgId="mate.mateFormerHeader.values['orgUnit']" 
      :visible.sync="searchDialogVisible" 
      @getMateInfo="getMateInfo" 
      @checkRepeat="checkRepeat"></material-search>
    <!--复制自弹出框-->
    <el-dialog title="复制自" width="30%" :visible.sync="dialogCopyDetailVisible" >
      <el-row>
        <el-form label-position="right" ref="DetailForm" :label-width="labelWidthDetail" :model="copyDetailForm" :rules="dialogRules">
          <el-col >
            <el-form-item label="选择要复制的物料" prop="materialsCode">
               <el-input size="mini" v-model="copyDetailForm.materialsCode">
                <el-button size="mini" slot="append" icon="el-icon-search" @click="handleSearchCopyInfo"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-button size="mini" @click="copyDetailConfirm" type="primary">确 定</el-button>
      <el-button size="mini" @click="copyDetailCancel">取 消</el-button>
    </el-dialog>

     <material-search 
      v-if="searchCopyMaterial"
      :orgId="mate.mateFormerHeader.values['orgUnit']" 
      :visible.sync="searchCopyMaterial" 
      @getMateInfo="getMateCopyDetailInfo"></material-search>
    <!-- form组 End-->
  </div>
</template>

<script>
import { BOM_API } from "@/services/apis";
import ColumnFormatterMixin from '@/mixins/ColumnFormatterMixin';
import { dateInit } from "@/utils/util";

export default {
  mixins: [ColumnFormatterMixin],
  components: {
    HBtn: function index(resolve){
      require(["@/components/Button/HBtn.vue"], resolve);
    },
    KTable: function index (resolve) {
      require(['@/components/KTable.vue'], resolve)
    },
    HeaderForm: function index(resolve){
      require(['./components/BomAddHeaderForm'], resolve);
    },
    ReplacementDialog: function index(resolve){
      require(['./components/ReplacementMaterialDialog'], resolve);
    },
    MaterialSearch: function index (resolve) {
      require(['@/components/MaterialSearch.vue'], resolve)
    }
  },
  props: {
    mate: Object
  },
  data(){
    return {
      maxHeight: 380,
      controls: false,            // input-number 是否禁用按钮
      saveBtnDisabled: false,     // 新增保存按钮是否禁用
      dialogFormVisible: false,   // 新增行弹窗是否显示
      dialogReplacementMaterialVisible: false, // 替换料弹窗是否显示
      saveBtnLabel: "保 存",      // 保存按钮 label
      totalTime: 3,               // 保存按钮冷却时间
      replacementMaterialObj: {}, // 替换料
      dialogForm: {},             // 新增行弹窗表单
      cloneDialogFormValue: {},   // 保存行弹窗表单初始值
      bomHeaderForm: {},          // 新建Bom头部表单
      lineList: {},               // 新建Bom底部行
      dialogObject: {},           // 新增行弹窗表单信息
      componentOptions: [],       // 组件options选项列表
      objectColumns: {},
      dialogVisible: false,
      applicantOptions: [],
      bomId: '',
      materialsCodeOptions: [],   // 物料编码选项列表
      componentCodeOptions: [],   // 组件选项列表
      rules: {
        materialsType:[{ required: false, message: '该输入项为必输项'}], // 物料类型
        unit:[{ required: false, message: '该输入项为必输项'}], // 单位
        version:[{ required: false, message: '该输入项为必输项'}], // 版本
        fromDateStr:[{ required: true, message: '该输入项为必输项', trigger: 'blur'}], // 日期 有效日期-开始
        serialNumber:[{ required: false, message: '该输入项为必输项', trigger: 'blur'}], // 物料序号
        procedures:[{ required: false, message: '该输入项为必输项', trigger: 'blur'}], // 工序
        componentCode:[{ required: true, message: '该输入项为必输项', trigger: 'blur'}], // 组件
        componentName:[{ required: false, message: '该输入项为必输项', trigger: 'blur'}], // 物料说明
        used:[{ required: true, message: '该输入项为必输项', trigger: 'blur'}], // 用量
        usageReciprocal:[{ required: true, message: '该输入项为必输项', trigger: 'blur'}], // 用量的倒数
        yieldRate:[{ required: false, message: '该输入项为必输项', trigger: 'blur'}], // 良率
        toDateStr:[{ required: false, message: '该输入项为必输项', trigger: 'blur'}], // 有效日期-结束
        ecnCode:[{ required: false, message: '该输入项为必输项', trigger: 'blur'}], // ECN单号
        moneyAmount:[{ required: false, message: '该输入项为必输项', trigger: 'blur'}], // 已实施
        fileds:[{ required: false, message: '该输入项为必输项', trigger: 'blur'}], // 位号
        remarks:[{ required: false, message: '该输入项为必输项', trigger: 'blur'}] // 备注
      },
      dialogRules:{
        materialsCode:[{ required: true, message: '物料编码不能为空'}]
      },
      selectedLines: [],
      serialNumber: null,  // 物料序号
      itemId: null,
      orgUnit: '', // 组织机构
      pickerOptions: { // 日期禁用今天之前的
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      isEdit: false, // 当前行是否在编辑
      replacementMaterialObjBackup: {}, // 替换料暂存
      replaceMaterialsShow: true, // 用作强制重新渲染替换料弹窗
      searchDialogVisible: false,
      copyDetailForm: {
        materialsCode:""
      }, // 复制自form
      dialogCopyDetailVisible: false, // 复制自弹框
      labelWidthDetail: '150px',
      searchCopyMaterial: false,
      materialsType: '2',    // 新增bom行用
      isRepeat: false        // 新增bom行用
    }
  },
  computed: {
    labelWidth: function () {
      let width = ''
      if (this.mate.inline) {
        // width = undefined
        width = '100px'
      } else if (typeof (this.mate.labelWidth) === 'undefined') {
        width = '100px'
      } else {
        width = this.mate.labelWidth
      }
      return width
    },
    actionWidth () {
      // return this.mate.mateListLine.actions.length * 60 + 30
    }
  },
  created () {
    let mate = this.mate;
    this.formatterBefore(mate.mateListLine.columns);
    // Form Header 新建Bom 头部表单
    mate.mateFormerHeader.fields.map((i) => { this.bomHeaderForm[i.name] = i });
    // Form Line 新建Bom 底部行
    this.lineList = mate.mateListLine;
    this.lineList.columns.map((i) => { this.objectColumns[i.name] = i });
    // Form Line DialogList 新建Bom 新增底部行弹窗表单
    this.dialogForm = mate.mateFormerLine;
    this.dialogForm.fields.map((i) => { this.dialogObject[i.name] = i });
    this.cloneDialogFormValue = mate.mateFormerLine.values;
    // Bom编辑
    let bomDetail = mate.bomDetail;
    let listLineRows = bomDetail ? bomDetail.bomLineList:[];
    let mateFormerHeaderValues = bomDetail ? bomDetail.bomHeader:{};
    if(bomDetail){
      this.bomId = bomDetail.bomHeader.id;
      this.orgUnitId = mateFormerHeaderValues.orgUnit;
      listLineRows = this.initLineData(listLineRows);
      mate.mateListLine.rows = listLineRows;
      mate.mateFormerHeader.values = mateFormerHeaderValues;
    }
  },
  mounted() {
    // 初始化日期，默认为当天
    let date = this.mate.mateFormerLine.values['fromDateStr'] || '';
    this.mate.mateFormerLine.values['fromDateStr'] = date || dateInit();
  },
  methods:{
    /** 头部按钮事件
     * @param {String} name 按钮名称
     * @return {Function} 按钮事件
     */
    handleBtns(name) {
      const btnEvents = {
        // 提交按钮
        submit: () => this.handleSubmit(),
        // 提交按钮
        save: () => this.saveBom(),
        // 取消按钮
        cancel: () => this.backward(),
        // 重置按钮
        reset: () => this.handleReset(),
        // 默认
        default: () => { return }
      }
      return (btnEvents[name] || btnEvents.default)();
    },
    /**
     * 计算用量的倒数
     * @param {String} value 默认传参
     * @return void
     */
    usedChange (value) {
      let curValue = Number(value);
      if(curValue==0) {
        this.$set(this.mate.mateFormerLine.values, 'usageReciprocal', value);
      }else{
        let num = (1/curValue).toFixed(5); // 保留五位小数
        // this.mate.mateFormerLine.values.used = curValue.toFixed(5); // 保留五位小数
        // this.mate.mateFormerLine.values.usageReciprocal = num;
        this.$set(this.mate.mateFormerLine.values, 'used', curValue.toFixed(5));
        this.$set(this.mate.mateFormerLine.values, 'usageReciprocal', num);
      }
    },
    /**
     * 计算用量
     * @param {String} value 默认传参
     * @return void
     */
    usageReciprocalChange (value) {
      let curValue = Number(value);
      if(curValue==0) {
        this.$set(this.mate.mateFormerLine.values, 'used', value);
      }else{
        let num = (1/curValue).toFixed(5); // 保留五位小数
        // this.mate.mateFormerLine.values.usageReciprocal = curValue.toFixed(5); // 保留五位小数
        // this.mate.mateFormerLine.values.used = num;
        this.$set(this.mate.mateFormerLine.values, 'usageReciprocal', curValue.toFixed(5));
        this.$set(this.mate.mateFormerLine.values, 'used', num);
      }
    },
    /**
     * 有效日期-开始 选择日期的时候,把日期保存到mateFormerLine的values中去
     * @param {String} value 默认传参
     * @return void
     */
    getFromDate (value) {
      this.mate.mateFormerLine.values['fromDateStr'] = value;
    },
    /**
     * 有效日期-结束 选择日期的时候,把日期保存到mateFormerLine的values中去
     * @param value 默认传参
     * @return void
     */
    getToDate (value) {
      this.mate.mateFormerLine.values['toDateStr'] = value;
    },
    /**
     * 数据转换 已实施
     */
    initLineData (data) {
      data.forEach(item => {
        // 已实施的组状态
        item.checkState = item.deployFlag === 1 ? true : false;
      })
      return data;
    },
    /**
     * 提交表单数据
     * @param void
     * @return void
     */
    handleSubmit () {
      let path = BOM_API.BOM_SAVE;
      let mate = {};
      let _this = this;
      _this.$refs.BomAddHeaderForm.$refs['headerForm'].validate((valid) => {
        if (valid) {
          let values = _this.mate.mateFormerHeader.values;
          values.status = "SAVE";
          mate.bomHeader = values;
          mate.bomLineList = _this.mate.mateListLine.rows;
          if(mate.bomLineList.length<1){ // 提交的时候明细行不能为空
            _this.$message({
              type: 'warning',
              message: '明细行不能为空'
            });
            return;
          }
          _this.$root.ajaxData(BOM_API.BOM_SAVE, mate, data => {
            let status = data.statusCode;
            if(status === 200){
              _this.$root.monitor({ url: BOM_API.BOM_LIST });
            }
          }, 'POST')
        }
      });
    },
    /**
     * 保存Bom
     * @param void
     * @return void
     */
    saveBom () {
      let path = BOM_API.BOM_SAVE;
      let mate = {};
      let _this = this;
      _this.$refs.BomAddHeaderForm.$refs['headerForm'].validate((valid) => {
        if (valid) {
          let values = _this.mate.mateFormerHeader.values;
          values.status = "SAVE";
          mate.bomHeader = values;
          mate.bomLineList = _this.mate.mateListLine.rows;
          if(mate.bomLineList.length<1){ // 保存的时候明细行不能为空
            _this.$message({
              type: 'warning',
              message: '明细行不能为空'
            });
            return;
          }
          _this.countDown();
          _this.$root.ajaxData(BOM_API.BOM_SAVE, mate, data => {
            let bomId = data.data;
            if(bomId){
              _this.$root.ajaxData(BOM_API.BOM_EDIT + '/' + bomId,{}, res =>{
                if(res.mate) _this.updateDate(res.mate);
              })
              _this.isEdit = false;
            }
          }, 'POST')
        }
      });
    },
    /**
     * 取消返回Bom List页面
     * @param void
     * @return void
     */
    backward () {
      this.$root.monitor({ url: BOM_API.BOM_LIST });
    },
    clearCode () {
      let values = this.mate.mateFormerHeader.values;
      values.materials_name = '';
      values.materialsType = '';
      values.unit = '';
    },
    lineSelected (val) {
      this.selectedLines = val
    },
    /**
     * checkbox 勾选计算 拿到勾选的序号数组
     */
    handleSelected (val) {
      this.lineSelected(val);
      // 第一步就是要清空selectedIDS里面的数据
      this.selectedIds = [];
      // map方法也可以
      val.map((i) => this.selectedIds.push(i.serialNumber))
      // 每次点击都会执行这个函数，要点击两下的时候，this.selectedIds里面包括了前面一次的数据，所以会有重复，要去重
      var arr = []
      var json = {}
      for (var i = 0; i < this.selectedIds.length; i++) {
        if (!json[this.selectedIds[i]]) {
          json[this.selectedIds[i]] = 1
          arr.push(this.selectedIds[i])
        }
      }
      this.selectedIds = arr;
    },
    /**
     * 公共模块 KTable 按钮事件
     * @param {Object} btn 当前按钮信息
     * @param {Object} row 当前行信息
     * @return void
     */
    handleKtable (btn, row) {
      this.row = row;
      this.btn = btn;
      this.orgUnit = this.mate.mateFormerHeader.values.orgUnit;
      let orgUnit = this.orgUnit;
      let bomId = this.bomId;
      let _this = this;
      if (this.btn.action === 'addLine') { // 新增行
        let values = this.mate.mateFormerHeader.values;
        if (values.materialsCode === null || values.materialsCode === '' || values.fromDateStr === null || values.fromDateStr === '' || !values.orgUnit) {
          this.$message({
            type: 'warning',
            message: '请选择库存组织、物料编码和日期'
          })
          return;
        };
        this.componentCodeOptions = []; // 组件列表
        this.materialData = [];
        this.dialogFormVisible = true;  // 显示弹窗
        this.mate.mateFormerLine.values = this.cloneDialogFormValue;
        this.isRepeat = false; // 判断是否重复物料值初始化
        // this.mate.mateFormerLine.values.procedures = (this.mate.mateListLine.rows.length)*1 + 1;
        // 根据组织机构代码请求物料代码列表
        // this.$root.ajaxData(`${BOM_API.MATERIALS_CODE}/${orgUnit}?type=2`, {}, data => {
        //   if (data.length > 0 ){
        //     data.forEach(item => {
        //       _this.componentCodeOptions.push({
        //         label: item.subcode,
        //         value: item.id,
        //         name: item.name,
        //         specification: item.specification,
        //         unit: item.basicUnit,
        //         category: item.materialCategory,
        //         disabled: false
        //       })
        //     });
        //     // 过滤父组件
        //     let parentComponent = _this.mate.mateFormerHeader.values.materialsCode;
        //     _this.componentCodeOptions = _this.componentCodeOptions.filter(item =>{
        //       return item.label != parentComponent;
        //     });
        //   }else{
        //     return;
        //   }
        // }, 'GET')
        return;
      } else if (this.btn.action === 'editLine') { // 编辑行
        if (this.selectedLines.length !== 1) {
          _this.$message({
            message: this.$t('seladata'),
            type: 'warning'
          })
          return
        } ;
        // 如果物料编码列表没有缓存 请求当前组织机构下的物料编码列表
        if(this.componentCodeOptions.length < 1){
          this.$root.ajaxData(`${BOM_API.MATERIALS_CODE}/${orgUnit}?type=2`, {}, data => {
            if (data.length > 0 ){
              data.forEach(item => {
                _this.componentCodeOptions.push({
                  label: item.subcode,
                  value: item.id,
                  name: item.name,
                  specification: item.specification,
                  unit: item.basicUnit,
                  category: item.materialCategory,
                  disabled: false
                })
              });
              _this.dialogFormVisible = true;
              _this.mate.mateFormerLine.values = Object.assign({}, _this.selectedLines[0]);
              
              // 过滤父组件
              let parentComponent = _this.mate.mateFormerHeader.values.materialsCode;
              _this.componentCodeOptions = _this.componentCodeOptions.filter(item =>{
                return item.label != parentComponent;
              });

            }else{
              return;
            }
          }, 'GET')
        }else{
          // 过滤父组件
          let parentComponent = _this.mate.mateFormerHeader.values.materialsId;
          _this.componentCodeOptions = _this.componentCodeOptions.filter(item =>{
            return item.value != parentComponent;
          });
          this.dialogFormVisible = true;
          this.mate.mateFormerLine.values = Object.assign({}, _this.selectedLines[0]);
          // this.mate.mateFormerLine.values = _this.selectedLines[0];
        }
      }else if (this.btn.action === 'deleteLine') { // 删除行
        // 限制批量删除
        // if (this.selectedLines.length !== 1) {
        //   _this.$message({
        //     message: this.$t('seladata'),
        //     type: 'warning'
        //   })
        //   return;
        // }else{
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let selectedLines =  _this.selectedLines;
            let selectedIds = _this.selectedIds;
            // 行数据
            let listLineRows = _this.mate.mateListLine.rows;
            // 先过滤删除没有行id的数据
            selectedLines = selectedLines.filter(item=> !!item.id );
            // 过滤删除的行 剩下没有删除的
            selectedIds.forEach(item =>{
              listLineRows = listLineRows.filter((line) =>{
                return line.serialNumber != item;
              });
            });
            // 需要删除的行的id数组
            let rowId = { id: selectedLines.map((item) => item.id) };
            // 删除行的接口
            let url = BOM_API.BOM_DELETE_LINE;
            // 删除之后，就将剩余从新排序
            for (let l = 0; l < listLineRows.length; l++) {
              listLineRows[l].serialNumber = 10*l + 10;
            }
            // 如果删除行有行id就向后台请求删除
            if(rowId.id.length>0){
              _this.$root.ajaxData(url + rowId.id,{},function(){
                //重新渲染删除后的行列表
                _this.mate.mateListLine.rows = listLineRows;
                // 保存数据 重新排序后的
                _this.saveBom();
              },'GET');
            }else{
              _this.mate.mateListLine.rows = listLineRows;
              _this.saveBom();
            }
          }).catch(() => {
            _this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        // }
      } else if(this.btn.action === 'copyTo') {// 复制自
        let values = this.mate.mateFormerHeader.values
        if (!values.materialsCode || !values.fromDateStr) {
          this.$message({
            type: 'warning',
            message: '请选择物料编码和日期'
          })
          return
        }
        this.dialogCopyDetailVisible = true
        this.copyDetailForm['materialsCode'] = ""
        return
      }
    },
    /**
     * 刷新数据
     */
    updateDate (data) {
      let detail = data.bomDetail;
      this.mate.mateFormerHeader.values = detail.bomHeader;
      this.mate.mateListLine.rows = detail.bomLineList;
    },
    /**
     * 增加替换料
     * @param {Object} btn 替换料按钮信息
     * @param {Object} row 当前行信息
     */
    replacementMaterialAction (btn, row) {
      let curId = row.id;
      let _this = this;
      if (!curId || this.isEdit){
        this.$message({
          type: 'warning',
          message: '请先保存之后再添加替换料'
        })
        return;
      }
      this.$root.ajaxData(BOM_API.REPLACE_MATERIALS + '/' + curId, {}, data => {
        if (data){
          // 库存组织id
          let orgUnit = _this.mate.mateFormerHeader.values.orgUnit;
          // 组件行id
          let lineId = curId;
          let lineData = row;
          _this.replacementMaterialObj = data.mate;
          _this.replacementMaterialObj.orgUnit = orgUnit;
          _this.replacementMaterialObj.lineId = lineId;
          _this.replacementMaterialObj.lineData = lineData;
          _this.replacementMaterialObjBackup = Object.assign({},_this.replacementMaterialObj); // 备份替换料
          // 显示替换料弹窗
          _this.replaceShow();
        }else{
          return;
        }
      }, 'GET');
    },
    /**
     * 选择 组件 带出 物料说明 物料类型 版本 单位
     * param {String} 点击的value值
     * return void
     */
    changeComponentCode (value) {
      // 先验证组件是否已被占用 不能重复选择
      let values = this.mate.mateFormerLine.values;
      // 如果没有被占用 就把相关信息带出来
      if(value){ // 选中组件操作
        let obj = this.componentCodeOptions.find(item => {
          return item.value === value;
        });
        let lineRowsExist = this.mate.mateListLine.rows.filter(item =>{
          return item.componentCode === obj.label;
        });
        if (lineRowsExist.length>0) {
          this.$message({
            type: 'warning',
            message: '请不要选择相同组件！'
          });
          // 清除组件数据
          values.componentCode = '';
          values.componentExplain =''; 
          values.componentName = ''; // 物料说明
          values.materialsType = ''; // 物料类型
          values.version = '';
          values.unit = ''; // 单位
          return;
        }
        values.componentCode = obj.label; // 组件
        values.componentExplain = obj.label; 
        values.componentName =  obj.name; // 物料说明
        values.materialsType = obj.category; // 物料类型
        values.unit = obj.unit; // 单位
        values.version = obj.version || '0'; //版本 默认为 0
      }else{ // 清空组件操作
        values.componentCode = '';
        values.componentExplain = '';
        values.componentName =  '';
        values.materialsType = '';
        values.version = '';
        values.unit = '';
      }
    },
    /**
     * 新建行弹窗确认
     */
    materielConfirm (val) {
      let _this = this;
      let mate = this.mate;
      _this.$refs.LineForm.validate((valid) => {
        if (valid) {
          _this.isEdit = true;
          
          // location.reload();
          // _this.replacementMaterialObj = null;
          if(!_this.dialogForm.values['serialNumber']){
            mate.mateFormerLine.values.serialNumber = ((mate.mateListLine.rows.length)*10 + 10);
            let mateFormerValues = Object.assign({}, mate.mateFormerLine.values);
            // 添加disableFlag 新增line后台需要前端传标识
            mateFormerValues.disableFlag = '1';
            mate.mateListLine.rows.push(mateFormerValues);
            _this.materielCancel();
            // 清空数据
            mate.mateFormerLine.values = {}
          }else{
            mate.mateListLine.rows.map((item,index) =>{
              if(mate.mateFormerLine.values.serialNumber === item.serialNumber){
                const mateFormerValues1 = Object.assign({}, mate.mateFormerLine.values)
                _this.$refs.LineForm.validate((valid) => {
                  if (valid) {
                // splice将i行数据删除，并将mateFormerValues1填充进
                    if (mate.mateFormerLine.values.id === item.id) {
                      mate.mateListLine.rows.splice(index, 1, mateFormerValues1)
                    }
                    _this.materielCancel();
                    mate.mateFormerLine.values = {}
                  } else {
                    _this.$notify.error({
                      title: '消息',
                      message: '数据验证未通过'
                    })
                    _this.dialogFormVisible = true
                  }
                })
              }
            })
          }
        } else {
          _this.$notify.error({
            title: '消息',
            message: '数据验证未通过'
          })
        }
      })
    },
    /**
     * 新建行弹窗取消
     */
    materielCancel () {
      this.dialogFormVisible = false;
    },
    /**
     * 替换料弹窗确认
     */
    replaceConfirm () {
      this.replaceHide();
      this.reRenderReplaceMaterials();
    },
    /**
     * 替换料弹窗取消
     */
    replaceCancel () {
      this.replaceHide();
      this.reRenderReplaceMaterials();
    },
    replaceShow () {
      this.dialogReplacementMaterialVisible = true;
    },
    replaceHide () {
      this.dialogReplacementMaterialVisible = false;
    },
    reRenderReplaceMaterials () {
      this.replaceMaterialsShow = false;
      this.$nextTick(()=>{
        this.replaceMaterialsShow = true;
      })
    },
    closeReplaceMaterials () {
      this.$confirm(this.$t('TIPS_WARNING.UN_SAVE_TIPS'), this.$t('TITLE_TEXT.TIPS'), {
        confirmButtonText: this.$t('BUTTON_TEXT.CONFIRM'), // 确认
        cancelButtonText: this.$t('BUTTON_TEXT.CANCEL'), // 取消
        type: 'warning'
      }).then(() => {
        // done();
        this.replaceHide();
        this.reRenderReplaceMaterials();
      }).catch(() => {});
    },
    /** 按钮防抖
     * 点击后按钮冷却至倒计时结束
     * @param void
     * @return void
     */
    countDown() {
      this.saveBtnDisabled = true;
      this.saveBtnLabel = `${this.totalTime}s后再保存`;
      let clock = window.setInterval(() => {
        this.totalTime--;
        this.saveBtnLabel = `${this.totalTime}s后再保存`;
        if (this.totalTime < 0) {     //当倒计时小于0时清除定时器
          window.clearInterval(clock)
          this.saveBtnLabel = "保 存";
          this.totalTime = 5;
          this.saveBtnDisabled = false;
        }
      }, 1000)
    },
    // 弹出物料搜索框
    handleSearch () {
      this.searchDialogVisible = true
    },
    handleSearchCopyInfo (){
      this.searchCopyMaterial = true
    },
    // 接收物料信息
    getMateInfo({ subcode, name, materialCategory, basicUnit, ...data }){
      this.dialogForm.values = { 
        ...this.mate.mateFormerLine.values, 
        'componentCode': subcode,
        'componentName': name,
        'materialsType': materialCategory,
        'unit': basicUnit
      }
    },
    // 复制自弹出框接收物料信息
    getMateCopyDetailInfo({ subcode, name, materialCategory, basicUnit, ...data }){
      this.copyDetailForm = {
        'materialsCode': subcode
      }
    },
    // 复制自弹出框关闭
    copyDetailCancel(){
      this.dialogCopyDetailVisible = false
    },
    // 复制自弹出框确认
    copyDetailConfirm(){
      this.$refs['DetailForm'].validate((valid) => {
        if(valid){
          let _this = this
          _this.$root.ajaxData(BOM_API.GET_BOM_DETAIL, _this.copyDetailForm, data => {
            let status = data.statusCode
            if(status === 40026){
              _this.$message({
                message: '该物料没有BOM信息，无法进行复制',
                type: 'warning'
              })
              return
            }else if(status === 200){
              let rows = data.data.mate.rows
              if(rows){
                rows.forEach(item=>{
                  // 将负责的BOM id、BOMId 置为空
                  item.fromDateStr = item.fromDate
                  item.fromDate = ''
                  item.id = ''
                  item.bomId = ''
                  // 添加disableFlag 新增line后台需要前端传标识
                  item.disableFlag = '1'
                })
                _this.mate.mateListLine.rows.push(...rows)
                _this.dialogCopyDetailVisible = false
              }
            }
          }, 'GET')
        }else {
          return
        }
      })
    },
    /** 新增行物料检查是否重复
     * @param {String} code 物料编码
     * @return void
     */
    checkRepeat (code){
      let rows = this.mate.mateListLine.rows;
      if (!rows.length) return;
      let item = rows.filter(item => {
        return item.componentCode == code
      });
      if (item.length) {
        this.isRepeat = true;
      }else {
        this.isRepeat = false;
      }
    },
  },
  watch: {}
}
</script>

<style scoped lang="scss">
  .el-form-item__label{
    line-height:inherit
  }
  .el-form--inline>* {
    margin-right:10px
  }
  .el-form-item{
    margin: 15px 20px 2px 0px;
  }
  .leftFloat .el-row{
    float:left;
    width:250px;
  }
  .leftFloat .el-row input{
    width:250px;
  }
  .leftFloat .el-form-item{
    margin:0;
  }
  .leftFloat .button{
    float:left;
  }
  .el-form--inline .el-form-item {
    width:200px;
    display: inline-block;
    margin-right: 10px;
    vertical-align: top;
  }
  .el-form-item.is-required .el-form-item__label:before{
    content:''
  }
  .el-form-item.is-required .el-form-item__label:after{
    content: '*';
    color: #ff4949;
    margin-right: 4px;
  }
  .el-cascader{
    width:100%;
  }
  .hidden{
    display:none;
  }
  h4{
    margin-top:40px;
    margin-bottom:10px;
  }
  .el-select,.el-form-item__content .el-input-number{
    width:100%;
  }
  .el-date-editor.el-input{
    width:100%;
  }
  .el-form--inline.el-form--label-top .el-form-item__content{
    width:90%
  }
  .leftFloat .el-form--inline .el-form-item{
    margin-right:10px;
  }
  .tbutton{
    margin: 3px 0;
    button {
      padding: 7px 15px;
      background-color: #fff;
      cursor: pointer;
    }
  }
  .fbutton{
    margin: 5px 0;
    button {
      padding: 7px 15px;
      background-color: #fff;
      cursor: pointer;
    }
  }
  .el-input__suffix {
    right:80px
  }
  .el-form-item--mini.el-form-item {
    margin: 6px;
  }
  .el-input--mini .el-input__inner{
    width:80%
  }
  .el-dialog__header {
    padding: 10px 10px 0;
  }
  .el-dialog__body {
    padding: 10px 10px;
  }
  .el-button--mini {
    padding: 7px 9px;
  }
  .pbutton {
    margin: 3px 0;
    button {
      padding: 7px 15px;
      background-color: #fff;
      cursor: pointer;
    }
  }
  .el-input__inner .el-input__inner{
    height: 30px;
  }
  .input_number /deep/ .el-input__inner {
    text-align: left;
  }
</style>
