<!-- 模块列表组件 -->
<!-- MainTable 公共组件 
  用于页面的 Table-Grid/Table-tree 渲染 
  传参： 
     mateList 用于渲染列表字段和数据 
 -->
<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-table
          size="mini"
          ref="table"
          :row-class-name="tableRowClassName"
          v-loading="listLoading"
          :max-height="maxHeight"
          :data="mateList && mateList.rows"
          @row-click="rowClick"
          @row-dblclick="rowDblclick"
          border
          @selection-change="handleSelectionChange"
          @sort-change="sortChange"
          style="width: 100%;"
          highlight-current-row
          :stripe="stripe"
          @select-all="selectAll" 
          id="main_table"
        >
          <!--  checkType的值： 配置'radio' 渲染radio,配置 'noCheck' 不渲染勾选列,不配置 渲染checkbox -->
          <!-- radio 单选 配置 checkType 为 'radio' 渲染 -->
          <el-table-column v-if="checkType && checkType == 'radio'" 
                           fixed="left" 
                           width="50">
            <template slot-scope="scope">
              <el-radio
                :label="scope.$index"
                v-model="radio"
                @change.native="getCurrentRow(scope)"
              >&nbsp;</el-radio>
            </template>
          </el-table-column>
          <!-- checkbox 多选 不配置 checkType 渲染 -->
          <el-table-column v-if="!checkType" 
                           fixed="left" 
                           type="selection" 
                           width="50"></el-table-column>
          <!-- 序号列 需要配置 isIndex 控制当前模块是否需要渲染 -->
          <el-table-column v-if="isIndex" 
                           type="index" 
                           :label="$t('LABEL_TEXT.INDEX')"
                           width="auto">
            <template slot-scope="scope">
              <!-- 其中 mateList.page就是当前页数,mateList.size 就是每页行数 -->
              <span>{{(mateList.page - 1) * mateList.size + scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <!-- 区块链 -->
          <template v-for="(col,index) in columns">
            <el-table-column
              v-if="col.blockHash"
              :formatter="col.formatter"
              :key="index"
              :label=" $t(col.i18n) || col.label"
              :prop="col.name"
              :min-width="col.width"
              :sortable="col.sortable"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="top" v-show="scope.row.blockHash">
                  <p>区块哈希: {{ scope.row.blockHash }}</p>
                  <p>上链时间: {{ scope.row.updateAt }}</p>
                  <div slot="reference" class="name-wrapper">
                    <!-- <el-tag ><img src="../assets/imgs/ztree/ic_chain.png" style="width:13px; height:13px;margin:-2px 2px">{{ scope.row.name }}</el-tag> -->
                    <el-tag>
                      <img src="../../assets/imgs/ztree/ic_chain.png" style="width:13px; height:13px;margin:-2px 2px"/>
                      {{ scope.row[col.name] }}
                    </el-tag>
                  </div>
                </el-popover>
                <!-- <span v-show="!scope.row.blockHash" >{{ scope.row.name }} </span> -->
                <span v-show="!scope.row.blockHash">{{ scope.row[col.name] }}</span>
              </template>
            </el-table-column>
          </template>
          <!-- 一般列 -->
          <template v-for="(col,index) in columns">
            <!-- 一般列 -->
            <el-table-column v-if="col.isShow && !col.isCopy && !col.ischeck && !col.isEdit && !col.isUrl && !col.isLighted"
                             :formatter="col.formatter"
                             :key="index"
                             :label=" $t(col.i18n) || col.label"
                             :prop="col.name"
                             :min-width="col.width"
                             :sortable="col.sortable"
                             show-overflow-tooltip>
            </el-table-column>
            <!-- 单元格有复制按钮 复制单元格内容 mongodb 配置 isCopy 即可渲染 -->
            <el-table-column v-else-if="col.isShow && col.isCopy"
                             :formatter="col.formatter"
                             :key="index"
                             :label=" $t(col.i18n) || col.label"
                             :prop="col.name"
                             :min-width="col.width"
                             :sortable="col.sortable"
                             show-overflow-tooltip>
                <template slot-scope="scope">
                  <span class="cell_content">{{ scope.row[col.name] }}</span>
                  <el-tooltip class="item" effect="dark" placement="right">
                    <div slot="content">复制{{ $t(col.i18n) || col.label}}</div>
                    <el-button size="mini" 
                              class="el-icon-copy-document" 
                              style="position: absolute; top: 50%;right: 5px;transform: translateY(-50%);; cursor: pointer; padding: 0px; border: none;" 
                              v-clipboard:copy="scope.row[col.name]"
                              v-clipboard:success="clipboardSuccess">
                    </el-button>
                  </el-tooltip>
                </template>
            </el-table-column>
            <!--单元格有查看按钮-->
            <el-table-column v-else-if="col.isShow && col.ischeck"
              :formatter="col.formatter"
              :key="index"
              :label=" $t(col.i18n) || col.label"
              :prop="col.name"
              :min-width="col.width"
              :sortable="col.sortable"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <span
                  style="cursor: pointer;
                  padding: 8px 15px;
                  color: #ffffff;
                  background-color: #49afcd;" 
                  @click="checkButton(scope.row)">
                  查看
                </span>
              </template>
            </el-table-column>
            <!-- 行内编辑 -->
            <el-table-column v-else-if="col.isShow && col.isEdit"
                             :key="index"
                             :label=" $t(col.i18n) || col.label"
                             :prop="col.name"
                             :sortable="col.sortable"
                             show-overflow-tooltip>
                <template slot-scope="{row}">
                  <template v-if="row.edit">
                    <el-input-number v-if="col.editType === 'number'" :controls="false" v-model="row[col.name]" placeholder="" class="edit-input" size="mini"></el-input-number>
                    <el-input v-if="col.editType === 'input'" v-model="row[col.name]" placeholder="" class="edit-input" size="mini"></el-input>
                    <el-date-picker v-if="col.editType === 'datePicker'" v-model="row[col.name]" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" class="edit-input" size="mini"></el-date-picker>
                    <el-select v-if="col.editType === 'select'" v-model="row[col.name]" placeholder="请选择" class="edit-input" size="mini">
                      <el-option v-for="(item,idx) in col.options" :key="idx" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <dict-selected v-if="col.editType === 'dict'" v-model="row[col.name]"
                      :dictType="col.dict"
                      ></dict-selected>
                  </template>
                  <span v-else>{{ row[col.name] }}</span>
                </template>
            </el-table-column>
            <!--单元格有查看按钮-->
            <el-table-column v-else-if="col.isShow && col.isUrl"
              :formatter="col.formatter"
              :key="index"
              :label=" $t(col.i18n) || col.label"
              :prop="col.name"
              :min-width="col.width"
              :sortable="col.sortable"
              show-overflow-tooltip>
              <template slot-scope="{row}">
                <el-link v-if="row[col.name]" type="primary" @click="download(row, col)" icon="el-icon-download">{{ $t('BUTTON_TEXT.DOWNLOAD') }}</el-link>
              </template>
            </el-table-column>
             <!-- 某些字段 高亮显示-->
            <el-table-column v-else-if="col.isShow && col.isLighted"
                              :formatter="col.formatter"
                              :key="index"
                              :label=" $t(col.i18n) || col.label"
                              :prop="col.name"
                              :min-width="col.width"
                              :sortable="col.sortable"
                              show-overflow-tooltip>
                              <template slot-scope="{row}">
                              <span
                                :class="row.isRowEdit? 'editClass':'defaultClass'"
                               >
                               {{row[col.name]}}
                              </span>
                            </template>
              </el-table-column>
          </template>
          <!-- 操作列 按钮渲染 -->
          <el-table-column v-if="mateList && mateList.actions && mateList.actions.length && mateList.rows && mateList.rows.length && !inLineEdit"
            label="操作"
            fixed="right"
            :width="actWidth">
            <template slot-scope="scope">
                <act-btn v-for="(act,index) in mateList.actions"
                  @action="handleActions"
                  size="mini"
                  :ref="act.action"
                  :act="act"
                  :row="scope.row"
                  :key="index"
                  :word="word"
                  :disabled="btnDisable"></act-btn>
            </template>
          </el-table-column>
          <el-table-column v-if="inLineEdit"
                           label="操作"
                           fixed="right" 
                           :width="mateList.actions.length * 70 || 75">
            <template slot-scope="{row}">
              <el-button v-if="row.edit" type="success" size="mini" @click="submit(row)">Ok</el-button>
              <el-button v-else type="primary" size="mini" @click="edit(row)" >编辑</el-button>
              <el-popconfirm v-if="row._del" :title="`确定删除吗？`" @onConfirm="del(row)" style="margin-left:5px;">
                <el-button slot="reference" type="danger" size="mini">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
          </el-table>
      </el-col>
      <!-- 导入 -->
      <input ref="excelFile"
             type="file" 
             style="display:none" 
             @change="fileUpload" 
             :accept="uploadType">
    </el-row>
    <!-- 上传文件弹窗 Start -->
    <el-dialog title="上传文件" 
               :visible.sync="dialogVisible" 
               width="50%">
      <el-dialog :visible.sync="imgVisible" 
                 width="50%" 
                 append-to-body>
        <img width="100%" 
             :src="dialogImageUrl" 
             alt="">
      </el-dialog>
      <el-upload
        :action="uploadUrl"
        :accept="uploadType"
        :headers="uploadHeaders"
        :list-type="listType"
        :file-list="uploadFileList"
        :on-change="handleOnChange"
        :before-upload="handleBeforeUpload"
        :on-success="handleOnSuccess"
        :on-preview="handleOnPreview"
        :on-remove="handleOnRemove">
        <div slot="tip" 
             class="el-upload__tip" 
             style="font-size: 12px; color: red; margin-bottom: 10px;">
             注：只允许上传1张图片。
        </div>
        <div>
          <el-button slot="trigger" 
                     class ='el-icon-plus' 
                     size="mini" >
                     点击上传
          </el-button>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" 
                   @click="handleSubmit()">
                   {{$t('BUTTON_TEXT.SUBMIT')}}
        </el-button>
      </div>
    </el-dialog>
    <!-- 上传文件弹窗 End -->
    
    <!-- 查看详情弹窗 Start -->
    <dialog-details v-bind="$attrs"
                    v-if="mate"
                    :mate="mate"
                    :dialogVisible="detailsVisible" 
                    @closeDialog="detailsVisible = false"><div slot slot-scope="action"><slot name="detailsHeader" :action="action"></slot></div></dialog-details>
    <!-- 查看详情弹窗 End -->
  </div>
</template>

<script scope>
import { API_GATEWAY } from '@/config/index.js';
import SERVICES from '@/services';
import BaseTableMediator from './mixins/BaseTableMediator';
import ActBtn from '../Button/ActionBtn';
import clipboard from '@/directives/clipboard/index.js';
import { getNameById } from '@/utils/util';
import axios from '@/utils/http';
import { downFile } from '@/services/manage.js';
import { BaseConstant } from '@/constant/BaseConstant';

export default {
  //*   列表显示数字词典格式化和特殊字段格式化
  name: 'MainTable',
  mixins: [BaseTableMediator],
  directives: {
    clipboard
  },
  components: {
    ActBtn,
    DialogDetails: function index (resolve) {
      require(['../Dialog/DialogDetails.vue'], resolve)
    },
    // 数字词典组件
    DictSelected: function index (resolve) {
      require(['../DictSelected.vue'], resolve)
    },
  },
  props: {
    mate: Object,
    mateList: Object,
    toSort: Boolean,
    btnDisable: Boolean,
    maxHeight: {
      type: Number,
      default: 500
    },
    checkType: {
      type: String,
      default: ""
    },
    isIndex: { // Table 是否渲染序号列
      type: Boolean,
      default: false
    },
    stripe: {
      type: Boolean,
      default: true
    },
    // 操作行按钮渲染方式
    word: {
      type: Boolean,
      default: false
    },
    formModel: {
      type: String,
      default: "page" // page or dialog
    },
    inLineEdit: {
      type: Boolean,
      default: false
    },
    inlineEditSubmit: {
      type: Boolean,
      default: false
    },
    rowClickSelected: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      mimeType: BaseConstant.MIME_TYPE || {},
      enableClick: true,    // 按钮可以点击 默认 true
      cellStates: [],       // 列表单元格状态
      columns: [],          // 列配置参数
      attachmentUrl: "",    // 图片上传成功后的 url
      uploadType: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
      uploadUrl: "",        // 上传/导入 地址
      uploadPath: "",       // 上传/导入 提交地址
      uploadMethod: "POST", // 上传/导入 方法
      uploadData: {},       // 上传/导入 需要的数据
      dialogVisible: false, // 文件上传弹窗是否显示
      detailsVisible: false,// 查看详情弹窗是否显示
      imgVisible: false,    // 查看图片弹窗是否显示
      dialogImageUrl: "",   // 查看图片的 url
      //* el-upload 控件参数
      uploadPath: "",        // action 必选参数，上传的地址
      listType: "picture",   // 文件列表的类型 {string} text/picture/picture-card 默认text
      uploadHeaders: {       // 请求头部
        'Authorization': `Bearer ${window.sessionStorage.getItem('token')}`,
        'Accept': 'application/json',
        'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId
      },
      uploadFileList: [],    // 上传的文件列表
      radio: "",             // 单选的值
      listLoading: this.loading // loading 动画
    };
  },
  computed: {
  },
  created() {
  },
  mounted() {
    const _this = this;
    this.rowSelect();
    // EventBus 监听事件
    this.$bus.$on("refreshRadio", () => {
      _this.refreshRadio()
    })
  },
  methods: {
    /** 行内编辑按钮事件
     * 点击 ok 时若要请求接口保存行数据需配置 inlineEditSubmit 为true
     * 使用配置场景"列表页 有"行列表"(上下两个列表的需求)且支持行内编辑
     * @param {Object} row 行数据
     * @return void
     */
    edit(row){
      if(this.inlineEditSubmit){
        this.$emit('inlineEdit', row)
      }else{
        row.edit = !row.edit;
      }
    },
    /** 行内编辑删除事件
     * 点击 ok 时若要请求接口保存行数据需配置 inlineEditSubmit 为true
     * 使用配置场景"列表页 有"行列表"(上下两个列表的需求)且支持行内编辑
     * @param {Object} row 行数据
     * @return void
     */
    del(row){
      this.$emit('inlineDel', row)
      row.edit = false;
    },
    /** 行内编辑确定事件
     * 点击 ok 时若要请求接口保存行数据需配置 inlineEditSubmit 为true
     * 使用配置场景"列表页 有"行列表"(上下两个列表的需求)且支持行内编辑
     * @param {Object} row 行数据
     * @return void
     */
    submit(row){
      row.edit = false;
      if(this.inlineEditSubmit){
        this.$emit('editSubmit', row)
      }
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
        // 查看详情
        details: (act, row) => this.seeDetails(act, row),
        // 编辑/修改
        update: (act, row) => this.handleUpdate(act, row),
        // 上传
        upload: (act, row) => this.handleUpload(act, row),
        // 默认
        default: (act, row) => this.$parent.handleActions(act, row)
      }
      return (actions[action] || actions.default)(act, row);
    },
    /**
     * 查询详情
     * 如果有行请求行数据
     * 头表单数据取列表页行数据
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
     */
    seeDetails (act, row) {
      // 如果有 mateListLine 
      if (this.mate && this.mate.mateListLine) {
        this.$emit('rowClick', row, act);
      }
      // 查看详情 把列表页查看行行数据赋值到详情弹窗的 头部表格展示
      
      // this.$store.dispatch('setDetailValues', row);
      if (this.mate && this.mate.mateFormerHeader) {
        this.convertValues(row);
        this.mate.mateFormerHeader.values = row;
      }
      // 查看详情弹窗显示
      this.detailsVisible = true;
    },
    /** 转换下拉控件的值 
     * 如果是 mongodb 配置的 select(下拉控件) 并且配置了 options(下拉选项) 
     * 就会转化成前端展示的 label
     * 不再需要在 mongodb 另外配置下拉对应的 textc
     * 只真对 mongodb 配置的下拉控件
     * @param {Object} row 当前行
     * @return void
    */
    convertValues(row){
      // 保存实例
      let _this = this;
      // 遍历头部表单字段
      this.mate.mateFormerHeader.fields.forEach((item,index) =>{
        // 如果是 select 和 options 的长度不为 0
        if(item.holder==='select' && item.options.length){
          // 在行数据中添加新字段(当前下拉控件的name属性拼接"Name"),通过公共方法getNameById()拿到label保存到新字段中
          row[`${item.name}Name`] = getNameById(row[item.name], item.options,);
          // 如果在字段配置中没有找到新字段的配置
          if(!_this.mate.mateFormerHeader.fields.find(field => field.name === `${item.name}Name`)){
            // 就把新字段配置拼接到当前控件的位置
            _this.mate.mateFormerHeader.fields.splice(index+1, 0, {
              holder: 'textc',
              name: `${item.name}Name`,
              label: item.label
            })
          }
        }
      })
    },
    /** 修改按钮(操作列) 
     * 列表行的操作列修改按钮 
     * 从头部修改转移到操作列修改 免除勾选一条的判断 
     * enableEdit 控制当前行是否允许修改,在父级拿到数据的时候根据每行数据的状态进行赋值 initOperations()
     * @param {Object} act 当前点击的按钮配置信息
     * @param {Object} row 行数据
     * @return void
     */
    handleUpdate(act, row) {
      if (this.formModel === "page" && act.formModel != "dialog") {
        // 是否允许编辑 此状态在列表拿到数据时根据行状态做初始化处理 initOperations()
        let [enableEdit, rowEnableEdit] = ["",row.enableEdit];
        // 如果当前模块配置了 enableEditKey
        if (rowEnableEdit != null && rowEnableEdit != undefined && rowEnableEdit != ''){
          enableEdit = rowEnableEdit;
        }else {
          enableEdit = this.enableClick;
        }
        if (enableEdit) {
          this.$store.dispatch('Common/setRowId', row.id);
          this.$root.handleAction(act, row, function() {});
        }else {
          this.$message({
            type: "warning",
            message: "当前状态不允许修改"
          })
        }
      }else {
        this.$parent.handleActions(act, row)
      }
    },
    getCurrentRow(val) {
      this.radio = val.$index;
      this.hasSelected = true;
      this.multipleSelection = [];
      this.multipleSelection.push(val.row);
      this.handleSelected();
    },
    /** 单元各状态切换
     * @param {String} index 索引
     * @param {String} key 列的字段配置的 name 值,即猎德 prop值
     * @return void 
     */
    toggleState (index, key) {
      const state = this.cellStates[index][key]
      if (state === 'read') {
        this.cellStates[index][key] = 'write'
      } else {
        this.cellStates[index][key] = 'read'
      }
    },
    /**
     * 默认radio选项第一个，父级调用子级方法
     * @param void
     * @return void
     */
    refreshRadio() {
      this.radio = 0;
      this.hasSelected = true;
      this.multipleSelection = [];
      if(this.mateList.rows[0]) this.multipleSelection.push(this.mateList.rows[0]); // 修复没有数据时,点击查询后列表头部按钮可点击 2020-05-06
      this.handleSelected();
    },
    /**
     * 清除radio选项，父级调用子级方法
     * @param void
     * @return void
     */
    cancelCurrentRow() {
      this.radio = "";
      this.hasSelected = false;
      this.multipleSelection = [];
      this.handleSelected();
    },
    /**
     * 上传文件/导入模板excel 新增/编辑页面 导入行列表数据
     * 获取文件名称和后台所需参数 保存在 formData 中
     * 询问用户是否确认导入文件
     * 确认：调上传方法 uploadFile()
     * 取消：取消上传
     * @param {Object} file 上传文件参数
     * @return void
     */
    fileUpload(file) {
      let _this = this;
      let formData = new FormData();
      let fileData = file.target.files[0];
      let fileName = fileData.name || "所选文件";
      let tips = "";
      formData.append('file', fileData);
      if(Object.keys(this.uploadData).length){
        tips = "此操作会覆盖已有数据，";
        Object.keys(this.uploadData).forEach((item)=>{
          formData.append(item,this.uploadData[item]);
        })
      } 
      this.$confirm(`${tips}是否确定导入<<${fileName}>>?`, this.$t("TITLE_TEXT.TIPS"), {
        confirmButtonText: this.$t("BUTTON_TEXT.CONFIRM"),
        cancelButtonText: this.$t("BUTTON_TEXT.CANCEL"),
        type: "warning"
      }).then(() => {
        // 确认调上传方法
        this.uploadFile(formData);
      }).catch(() => {
        _this.$message({
          type: "info",
          message: this.$t("TIPS_WARNING.CANCEL_OPERATION")
        });
        _this.$refs.excelFile.value = '';
      });
    },
    /**
     * 请求上传/导入接口
     * 成功后把二进制流数据转成前端数据格式
     * @param {Object} data FormData数据
     * @return void
     */
    uploadFile(data) {
      let _this = this;
      axios.request({
        url: `${this.BASEAPI}${this.uploadUrl}`,
        method: this.uploadMethod,
        data: data,
        responseType: 'arraybuffer'
      }).then((res) => {
        _this.$refs.excelFile.value = '';
        // 处理二进制数据
        let byteArray = new Uint8Array(res.data);
        let blob = new Blob([byteArray]);
        let reader = new FileReader();
        reader.readAsText(blob);
        reader.onload = function(e){
          // 把数据转化为对象
          let res = JSON.parse(reader.result);
          // 保存列表数据
          let data = res.data;
          // 如果数据异常 提示错误
          if(!data && (res.statusCode === 500 || (res.code !== 200 && res.statusCode != 200))){
            _this.$message({
              type:'error', 
              message: res.message || '数据异常,请检查数据'
            })
            return;
          }
          // 导入成功 刷新当前列表的数据 跨级 祖级事件
          _this.$emit('uploadSuccess', data);
        }
      },(res) => {
        _this.$refs.excelFile.value = '';
        if(res.status === 500) {
          _this.$message({
            type:'error', 
            message: '导入失败，请联系管理员'
          })
        }
      })
    },
    /**
     * 触发上传按钮点击事件 fileUpload()
     * 把数据保存到本地 新增/编辑页面行列表事件 KTableLine
     * @param {String} url 上传服务的 api 接口地址
     * @param {String} method 上传的方法
     * @param {Object} data 传给后台的数据
     * @return void
     */
    uploadBtnClick(url, method, data) {
      this.uploadUrl = url;
      this.uploadMethod = method || "POST";
      this.uploadData = data || {};
      this.$refs['excelFile'].click();
    },
    /** 上传文件 图片等
     * 上传文件弹窗 选择文件 支持预览
     * @param {Object} act 按钮配置信息
     * @param {Object} row 当前行数据
     * @return void
     */
    handleUpload(act, row) {
      // 清空文件列表
      this.uploadFileList = [];
      this.uploadUrl = `${API_GATEWAY}${act.url}`; 
      this.uploadPath = act.path; // 提交地址
      this.uploadType = act.uploadType || this.uploadType;
      if (row.attachmentUrl) {
        if (row.attachmentUrl !== undefined && row.attachmentUrl !== null && row.attachmentUrl !== '') {
          let file = {
            percentage: 100,
            response: row.attachmentUrl,
            status: 'success',
            url: row.attachmentUrl,
            name: "点我查看"
          };
          this.uploadFileList.push(file);
        }
      }
      this.dialogVisible = true;
    },
    /** 提交上传文件
     * @param void
     * @return void
     */
    handleSubmit() {
      let params = {
        attachmentUrl: this.attachmentUrl,  // 文件上传成功后返回的路径
	      id: this.row.id                     // 加工单行ID
      };
      SERVICES.BASE.handleUpload(this.uploadPath, params).then(res =>{
        // 提交成功后关闭弹窗
        this.dialogVisible = false;
        // 请求行数据刷新页面行数据
        this.$emit("refreshLine", this.row);
      }).catch(() =>{console.log('操作失败')})
    },
    /** 文件上传成功时的钩子
     * @param {Object} response 后台返回数据
     * @param {Object} file 上传文件
     * @param {Object} fileList 文件列表
     * @return void
     * 
     */
    handleOnSuccess (response, file, fileList) {
      this.attachmentUrl = response.data;
    },
    /** 点击文件列表中已上传的文件时的钩子
     * @param {Object} file 上传文件
     * @return void
     * 
     */
    handleOnPreview (file) {
      this.dialogImageUrl = file.url;
      this.imgVisible = true;
    },
    /** 删除文件之前的钩子
     * 参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止删除
     * @param {Object} file 上传文件
     * @param {Object} fileList 文件列表
     * @return void
     */
    handleOnRemove (file, fileList) {
      this.attachmentUrl = '';
    },
    /** 文件状态改变时的钩子
     * 添加文件、上传成功和上传失败时都会被调用
     * 只允许上传一个的时候 slice(-1) 返回最后上传的文件的数组
     * @param {Object} file 上传文件
     * @param {Object} fileList 文件列表
     * @return void
     */
    handleOnChange (file, fileList) {
      this.uploadFileList = fileList.slice(-1);
    },
    /** 上传文件之前的钩子
     * 参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
     * @param {Object} file 上传文件
     * @return void
     */
    handleBeforeUpload (file) {
      let fileName = file.name;;
      let index = fileName.lastIndexOf('.');
      let name = fileName.substring(index, fileName.length);
      if (!/\.(jpg|jpeg|png|bmp|gif|JPG|PNG|JPEG|BMP|GIF)$/.test(name)) {
        this.$message({
          message: '请选择图片格式',
          type: 'warning'
        })
        // 清空文件
        this.uploadFileList = [];
        return false;
      }
    },
    /** 单元格复制成功提示
     * @param void
     * @return void
     */
    clipboardSuccess() {
      this.$message({
        message: this.$t('TIPS_WARNING.COPY_SUCCESSFULLY'),
        type: 'success',
        duration: 1500
      })
    },
    /**
     * 单元格带查看按钮
     * @param void
     * @return void
     */
    checkButton (row) {
      this.$emit('checkButton', row);
    },
    /**
     * 审计 暂时废弃此方法
     */
    audit(row) {
      var vm = this;
      // this.$root.ajaxData('/companys/perfectInfo?audit=true' + '&tenantId=' + row.tenantId + '&name=' + row.name, {}, function (data) {
      // }, 'GET')
      this.$root.monitor({url: `/companys/perfectInfo?audit=true&tenantId=${row.tenantId}&name=${row.name}`});
    },
    /** 清空 table 勾选 
     * @param void
     * @return void
    */
    clearSelection(){
      this.$refs['table'].clearSelection();
    },
    selectAll(val){
      this.$emit('selectAll',val)
    },
    download(row,col){
      // 默认 xls
      let type = this.mimeType[col.mimeType] || this.mimeType.xls || 'application/vnd.ms-excel';
      let url = '/download/file';
      let fileName = `${row[col.fileName]}`;
      let params = {
        fileUrl: row[col.name]
      }
      downFile(url, params).then(res =>{
        let blob = new Blob([res.data], {type: type})
        let objectUrl = URL.createObjectURL(blob)
        let a = document.createElement('a')
        a.setAttribute('style', 'display:none')
        a.setAttribute('id', 'download');
        a.setAttribute('href', objectUrl);
        a.setAttribute('download', fileName);
        // 防止反复添加
        if (document.getElementById('download')) {
          document.body.removeChild(document.getElementById('download'));
        }
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(objectUrl);
      })
    },
    /**
     * 设置行特殊样式
     * 根据行里 isRowEdit 判断
     */
    tableRowClassName({row, rowIndex}) {
      if (row.isRowEdit) {
        return 'warning-row';
      } else if (row.isRowChange) {    // 修改行整行高亮显示
        return 'success-row';
      } else if (row.defaultBacColor) {
        return 'row-color';
      } else {
        return '';
      }
    }
  },
  watch: {
  }
};
</script>

<style lang="scss">
  @import "@/assets/css/baseList.scss";

  #main_table{
    table{
      td{
        position: relative;
      }
      .cell_content{
        float: left;
        min-width: 50px;
        white-space: nowrap;
        overflow: hidden;
        word-break: break-all;
        -o-text-overflow: ellipsis;
        text-overflow: ellipsis;
      }
      .editClass{
        cursor: pointer;
        color: red;
      }
      .defaultClass{
        cursor: pointer;
        color: #409EFF;
      }
      .warning-row {
        background: oldlace;
      }
      .success-row {
        background: #9edaa0;
      }
      .row-color {
        background: oldlace;;
      }
    }
    /deep/ .el-input-number--mini{
      width: 100%;
    }
  }
</style>
