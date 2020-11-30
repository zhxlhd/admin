<template>
  <div :bordered="false">
    <!-- 抽屉 -->
    <el-drawer
      title="字典列表"
      :size="screenWidth"
      @close="onClose"
      :visible="visible">
      <!-- 抽屉内容的border -->
      <div :style="{ padding:'10px', border: '1px solid #e9e9e9', background: '#fff',}">
        <div>
          <k-table-list ref="listTable" 
            v-bind="$attrs" 
            :mate="tableData" 
            :isIndex="isIndex" 
            :formModel="formModel" 
            :word="word" 
            :mateSearch="tableData.mateSearch" 
            @initOperations="initOperations" 
            @btnClick="handleButtons" 
            @rowClick="handleRowClick" 
            @action="handleActions"
          ></k-table-list>
        </div>
      </div>
    </el-drawer>
    <!-- 字典数据 -->
    <!-- <dict-item-modal ref="modalForm" @ok="modalFormOk"></dict-item-modal>  -->
    
    <el-dialog :title="catgTitle" :visible.sync="catgDialog" width="30%" :show-close="false" :close-on-click-modal="false">
      <el-form size="mini" :model="catgForm" :inline="catgFormInline" label-position="right" ref="catgForm" :rules="rules" :label-width="labelWidth">
        <el-form-item :label="$t('LABEL_TEXT.C_NAME')" prop="label">
          <el-input v-model.trim="catgForm['label']" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item :label="$t('LABEL_TEXT.C_VALUE')" prop="value">
          <el-input v-model.trim="catgForm['value']" placeholder="请输入数据值"></el-input>
        </el-form-item>
        <el-form-item :label="$t('LABEL_TEXT.DICT_DESC')" prop="remark">
          <el-input v-model="catgForm['remark']"></el-input>
        </el-form-item>
        <el-form-item :label="$t('LABEL_TEXT.SORTING')" prop="sorting">
          <el-input-number v-model="catgForm['sorting']" controls-position="right" :min="1"></el-input-number><span style="margin-left: 5px;">值越小越靠前，支持小数</span>
        </el-form-item>
        <el-form-item :label="$t('LABEL_TEXT.EDITABLE')" prop="editable">
          <!-- <el-input v-model="catgForm['editable']"></el-input> -->
          <el-switch v-model="catgForm['editable']" active-color="#1890ff" inactive-color="rgba(0,0,0,.25)" active-value="1" inactive-value="0"></el-switch><span style="margin-left: 5px;">{{ catgForm['editable'] ==="1" ? "是" : "否"}}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-divider></el-divider>
        <el-button @click="back">{{ $t('BUTTON_TEXT.CANCEL') }}</el-button>
        <el-button type="primary" @click="submit">{{ $t('BUTTON_TEXT.OK') }}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import KTableList from '@/components/table/KTableList';
import axios from '@/utils/http';

export default {
  name: "DictItemList",
  // mixins: [ListMixin],
  components: {
    KTableList
  },
  props: {
    mate: Object
  },
  data() {
    return {
      isIndex: false,                    // Table 是否渲染序号列
      multipleSelection: [],             // 勾选项数组
      word: true,                        // 按钮是否显示文字
      formModel: "dialog",               // 表单模式 弹窗
      columns: this.mate.mateList.lineColumns, // 列表列
      tableData: {
        mateList:{
          columns: [],
          actions: [
            {
              action: "update",
              label: "编辑",
              i18n: "BUTTON_TEXT.UPDATE",
              isApi: false,
              useId: 1,
              url: "",
              method: "PUT",
              type: "text",
              icon: ""
            },
            {
              action: "delete",
              label: "删除",
              popconfirm: true,
              i18n: "BUTTON_TEXT.DELETE",
              isApi: true,
              useId: 0,
              url: "/dic/delete?ids=",
              type: "text",
              method: "DELETE"
            }
          ],
          btns: [
            {
              action: "add",
              label: "新增",
              i18n: "BUTTON_TEXT.ADD",
              isApi: false,
              useId: -1,
              url: "",
              icon: "el-icon-plus",
              method: "POST"
            },
            {
              action: "delete",
              label: "批量删除",
              popconfirm: true,
              i18n: "BUTTON_TEXT.BATCH_DELETE",
              isApi: true,
              useId: 0,
              url: "/dic/delete?ids=",
              type: "text",
              isSelector: true,
              icon: "el-icon-delete",
              method: "DELETE"
            }
          ],
          rows: []
        },
        mateSearch: null,
      },
      catgDialog: false,                 // 表单是否显示
      catgTitle: '',                     // 表单标题
      labelWidth: '120px',               // 表单字段宽度
      catgFormInline: false,             // 表单是否行内显示
      catgFormReadOnly: false,           // 是否只读
      catgForm:{                         // 表单值
        label: '',
        value: '',
        sorting: 1,
        remark: '',
        editable: '0',
        id: ''
      },
      isEdit: false,                     // 是否是编辑状态
      rules: {                           // 表单规则
        label: [
          { required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED') }
        ],
        value: [
          { required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED') }
        ],
        sorting: [
          { required: false, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED') }
        ],
        remark: [
          { required: false, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED') }
        ],
        editable: []
      },
      url: {                            // 接口地址
        list: "dic/cg",                 // 列表数据接口
        save: "/dic/save",              // 按钮保存
        edit: "/dic",                   // 按钮修改
        delete: "",                     // 按钮删除 在MongoDB配置 属于 isApi按钮（isApi: true） 点击就请求接口没有弹窗或者跳转 不同于新增修改按钮
        deleteBatch: "",                // 按钮批量删除 在MongoDB配置
      },
      visible: false,                   // 抽屉弹窗是否显示
      screenWidth: '800px',             // 抽屉弹窗宽度
      dictId: "",                       // 数据字典父级 id

    }
  },
  created() {
    // 当页面初始化时,根据屏幕大小来给抽屉设置宽度
    this.resetScreenSize();
    this.tableData.mateList.columns = this.mate.mateList.lineColumns || [];
    // this.tableData.mateList.btns = this.mate.mateList.lineBtns || this.tableData.mateList.btnss || [];
    // this.tableData.mateList.actions = this.mate.mateList.lineActions || this.tableData.mateList.actions || [];
  },
  methods: {
    /**
     * 字典配置编辑
     * @param {Object} record 行数据
     * @return void
     ** Author: zhongxiaolong
     */ 
    edit(record) {
      if (record.id) {
        this.dictId = record.id;
      }
      this.dicCatgCode = record.code;
      this.showDrawer();
      // 当其它模块调用该模块时,调用此方法加载字典数据
      this.loadData(record.code);
    },
    /**
     * 获取列表数据
     * @param {String} code 字典编码
     * @return void
     ** Author: zhongxiaolong
     */
    loadData(code){
      axios.get(`${this.url.list}/${code}`).then(res =>{
        if(res.status === 200 && res.data){
          this.tableData.mateList.rows = res.data;
        }
      })
    },
    /**
     * 新增/编辑 确认
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    submit () {
      let dicCatgCode = this.dicCatgCode;
      const _this = this;
      const mate = {...this.catgForm, dicCatgCode};
      this.$refs['catgForm'].validate((valid) => {
        if (valid) {
          this.catgDialog = false
          if (!this.isEdit) {
            this.$root.ajaxData(this.url.save, mate, () => _this.loadData(dicCatgCode), 'POST')
          } else {
            this.$root.ajaxData(`${this.url.edit}${this.catgForm.id}`, mate,() => _this.loadData(dicCatgCode), 'PUT')
          }
        } else {
          this.catgDialog = true
          this.$notify.error({
            title: '消息',
            message: '数据验证未通过'
          })
          return
        }
      })
    },
    /**
     * 关闭新增/编辑 弹窗
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    back () {
      this.catgDialog = false;
    },
    /**
     * 显示抽屉弹窗
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    showDrawer() {
      this.visible = true;
    },
    /**
     * 隐藏抽屉弹窗
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    onClose() {
      this.visible = false;
    },
    /**
     * 抽屉的宽度随着屏幕大小来改变
     * @param void
     * @return void
     ** Author: zhongxiaolong
     ** Author: zhongxiaolong
     */
    resetScreenSize() {
      let screenWidth = document.body.clientWidth;
      if(screenWidth > 1400){
        this.screenWidth = '800px'
      } else if (screenWidth < 600) {
        this.screenWidth = screenWidth + 'px';
      } else {
        this.screenWidth = '600px';
      }
    },
    /**
     * 头部按钮控制
     * 点击按钮触发对应方法
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} rowId 勾选行 id数据  rowId.id
     * @param {Array} selection 勾选行数据
     * @return {Function} 执行操作的方法
     ** Author: zhongxiaolong
    */
    handleButtons (btn, rowId, selection) {
      this.multipleSelection = selection;
      let action = btn.action;
      const rowIds = (rowId && rowId.id) ? rowId : { id: selection && selection.map(r => r.id) };
      const btnEvents = {
        add: (btn) => this.handleCreate(btn),    // 弹窗新增
        delete: (brn, rowIds) => this.handleDelete(btn, rowIds), // 批量删除
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
     ** Author: zhongxiaolong
    */
    handleActions (act, row) {
      let action = act && act.action;
      let rowId = { id: [row.id] };
      const actions = {
        update: (act, row) => this.handleUpdate(act, row), // 编辑
        delete: (act, row) => this.handleDelete(act, rowId), // 删除
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
    },
    /**
     * 新增
     * @param {Object} btn 按钮配置信息
     * @return void
     ** Author: zhongxiaolong
    */
    handleCreate(btn) {
      this.catgDialog = true;
      // 当前新增 设置编辑状态为 false
      this.isEdit = false;
      this.catgTitle = this.$t('TITLE_TEXT.ADD');
      // 重置表单
      this.catgForm['label'] = "";
      this.catgForm['value'] = "";
      this.catgForm['sorting'] = 1;
      this.catgForm['remark'] = "";
      this.catgForm['editable'] = "0";
      this.catgForm['id'] = "";
      this.$nextTick(() => {
        this.$refs['catgForm'].clearValidate();
      })
    },
    /**
     * 编辑
     * @param {Object} btn 按钮配置信息
     * @param {Object} row 当前行数据
     * @return void
     ** Author: zhongxiaolong
    */
    handleUpdate(btn, row) {
      this.catgDialog = true;
      // 当前编辑 设置编辑状态为 true
      this.isEdit = true;
      this.catgTitle = this.$t('TITLE_TEXT.MODIFY');
      this.catgForm = {...row};
    },
    /**
     * 编辑
     * @param {Object} btn 按钮配置
     * @param {Array} rowIds 当按钮为行数据/头部按钮为勾选行 id 数组
     * @return void
     ** Author: zhongxiaolong
    */
    handleDelete(btn, rowIds) {
      // obj.id 为行删除 || rowIds.id 为批量删除
      const _this = this;
      const ids = rowIds;
      this.$root.handleAction(btn, ids, () => _this.loadData(this.dicCatgCode), btn.method);
    },
    /**
     * 请求当前操作行的查看详情中的列表行数据
     * 获取数据后渲染详情列表行
     * @param {Object} row 当前操作行的行数据
     * @param {Object} act 按钮配置信息
     * @return void
     ** Author: zhongxiaolong
    */
    handleRowClick (row, act) {
      this.rowStatus = row.status;
      let id = row.id;
      // 获取行数据
      this.getLines(id);
    },
    /** 获取行数据 
     * @param {String} id 列表行 id
     * @return void
     ** Author: zhongxiaolong
    */
    getLines (id) {
      let url = this.mate.mateList.url;
      SERVICES.BASE.getLines(url, id).then(res =>{
        let data = res.data.lineList;
        if (data && data.length){
          this.$set(this.mate.mateList, "lineRows", data);
          if (this.mate.mateList.rowClick) {
            // 显示 行Table
            // this.lineTableFlag = true;
            // 刷新数据
            this.mate.mateListLine.rows = data;
          }
        }
      })
    },
    /** 初始化行操作列按钮的状态配置启用按钮 disabled 的状态
     * ......可以对相关按钮进行初始化
     * enableEdit 是否启用编辑
     * 默认启用编辑 通做行状态再修改启用状态
     * @param void
     * @return void
     ** Author: zhongxiaolong
    */
    initOperations() {
      let rows = this.mate.mateList.rows;
      // 如果没有行返回
      if (!rows.length) {
        return
      }else {
        // 默认启用编辑/修改
        rows.forEach(item => {
          item.enableEdit = true;
        });
      }
      rows.forEach(item => {
        let status = item.status;
        // 当状态不是是新建和驳回的时候 不启用编辑/修改
        if(status !== "SAVE" && status !== "REJECT"){ 
          item.enableEdit = false;
        }
      });
    }
  }
}
</script>
<style scoped>
</style>
