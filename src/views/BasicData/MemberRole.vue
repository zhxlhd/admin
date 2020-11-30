<!-- created by zhongxiaolong on 2019/02/18 -->
<!-- 架构成员角色 MemberRole -->
<template>
  <div>
    <el-container class="organizational-role">
      <el-aside width="300px" style="background: #f4f6f8;">
        <div class="searchbox">
          <el-input
            v-if="hasQuery"
            size="medium"
            :placeholder="$t('LABEL_TEXT.SEARCH')"
            clearable
            suffix-icon="el-icon-search"
            @blur="handleSearch"
            v-model="filterText">
          </el-input>
        </div>
        <div class="tree_box">
          <div class="title_btn">
            <el-button type="primary" @click="init(1)" round>{{$t('LABEL_TEXT.ROLE')}}<i class="el-icon-refresh el-icon--right org-refresh" style="float: right;"></i></el-button>
          </div>
          <el-row style="text-align: center;padding: 10px 0;">
            <el-button @click="addRoleGroup" type="default" size="mini" round>{{$t('BUTTON_TEXT.ADD_ROLE_GROUP')}}</el-button>
            <el-button @click="addRole" type="default" size="mini" round>{{$t('BUTTON_TEXT.ADD_ROLE')}}</el-button>
          </el-row>
          <el-tree 
            ref="tree"
            class="filter-tree"
            :data="treeData" 
            :props="defaultProps"
            @node-click="handleNodeClick"
            :expand-on-click-node="expandOnClickNode"
            :filter-node-method="filterNode"
            :render-content="renderContent"
            :highlight-current="highLight"
            node-key="id"
            :default-expand-all="false"
            :default-expanded-keys="defaultExpandedKeys"
            @node-drag-start="handleDragStart"
            @node-drag-end="handleDragEnd"
            @node-drop="handleDrop"
            draggable
            :allow-drop="allowDrop"
          ></el-tree>
        </div>
      </el-aside>
      <el-main>
        <div class="main_role">
          <div class="add_role_container" v-if="!this.curChildNode.data">
            <el-button @click="addRole" type="primary" size="mini" round>{{$t('BUTTON_TEXT.ADD_ROLE')}}</el-button>
          </div>
          <div class="deptMembers" v-else>
            <div class="_title _title_2">
              <i class="el-icon-s-custom" style="color: #409EFF;"></i>
              <span>{{this.curChildNode.data.name}} </span>({{ this.roleMemberList.length }}{{$t('LABEL_TEXT.PEOPLE')}})
              <el-button type="default" @click="editRole" size="mini" round>{{$t('BUTTON_TEXT.UPDATE')}}</el-button>
            </div>
            <div class="btn_box">
              <el-row>
                <k-btn v-for="(btn, index) of roleBtns" 
                  :word="word" 
                  :act="btn" 
                  :hasSelected="hasSelected" 
                  :plain="false" 
                  :round="true"
                  :loading="btn.loading" 
                  @action="handleButtons" 
                  :key="index"></k-btn>
              </el-row>
            </div>
            <el-table
              ref="table"
              :data="roleMemberList"
              @selection-change="handleSelectionChange"
              @row-click="rowClick"
              style="width: 100%">
              <el-table-column 
                fixed="left" 
                type="selection" 
                width="50"></el-table-column>
              <el-table-column
                prop="name"
                :label="$t('LABEL_TEXT.NAME')"
                width="220">
              </el-table-column>
              <el-table-column
                prop="orgName"
                :label="$t('LABEL_TEXT.DEPARTMENT')"
                width="280">
              </el-table-column>
              <el-table-column
                prop="jobNumber"
                :label="$t('LABEL_TEXT.EMP_NUM')">
              </el-table-column>
              <!-- <el-table-column
                prop="range"
                label="管理范围"
                width="180">
              </el-table-column> -->
            </el-table>
          </div>
        </div>
      </el-main>
    </el-container>

    <el-dialog
      ref="role_group"
      :title="roleGroupTitle"
      :show-close="showClose"
      :visible.sync="dialogRoleGroup"
      direction="rtl"
      :modal="modal"
      custom-class="org-drawer"
      :wrapperClosable="wrapperClosable"
      width="550px"
      :before-close="handleClose">
      <div class="drawer__content">
        <el-form :rules="roleGroupRules" ref="roleGroupForm" :model="roleGroupData" :inline="false" :label-width="labelWidth">
          <el-row>
            <div class="content_title">{{$t('TITLE_TEXT.ROLE_GROUP_INFO')}}</div>
          </el-row>
          <el-row>
            <el-form-item :label="$t('LABEL_TEXT.ROLE_GROUP_NAME')" prop="groupName">
              <el-input v-model.trim="roleGroupData['groupName']" maxlength="25" show-word-limit></el-input>
            </el-form-item>
            <!-- <el-form-item :label="$t('LABEL_TEXT.ROLE_GROUP_SORT')" prop="sort">
              <el-input-number v-model="roleGroupData['sort']" :controls="false"></el-input-number>
            </el-form-item> -->
          </el-row>
        </el-form>
      </div>
      <div class="drawer__footer">
        <el-button type="primary" @click="handleRoleGroup">{{$t('BUTTON_TEXT.SAVE')}}</el-button>
        <el-button v-show="isRoleGroupEdit" @click="removeRoleGroup" type="danger">{{$t('BUTTON_TEXT.DELETE')}}</el-button>
        <el-button @click="dialogRoleGroup = false;isRoleGroupEdit = false;">{{$t('BUTTON_TEXT.CANCEL')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      ref="drawer_role"
      :title="roleTitle"
      :show-close="showClose"
      :visible.sync="dialogRole"
      direction="rtl"
      :modal="modal"
      custom-class="org-drawer"
      :wrapperClosable="wrapperClosable"
      width="550px"
      :before-close="handleClose">
      <div class="drawer__content" ref="drawerContent">
        <el-form :rules="roleRules" ref="roleForm" :model="roleData" :inline="false" :label-width="labelWidth">
          <el-row>
            <div class="content_title">{{$t('TITLE_TEXT.ROLE_INFO')}}</div>
          </el-row>
          <el-row >
            <el-form-item :label="$t('LABEL_TEXT.ROLE_NAME')" prop="roleName">
              <el-input v-model.trim="roleData['roleName']" maxlength="25" show-word-limit></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item :label="$t('LABEL_TEXT.GROUP_TO')" prop="roleGroupId">
              <el-select v-model="roleData['roleGroupId']" :placeholder="$t('TIPS_WARNING.SELECT_ROLE_GROUP')" :disabled="roleRules['roleGroupId'][0].disabled">
                <el-option v-for="(item, index) in roleGroupList" :key="index" :value="item.id" :label="item.groupName"></el-option>
              </el-select>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <div class="drawer__footer">
        <el-button type="primary" @click="handleRole">{{$t('BUTTON_TEXT.SAVE')}}</el-button>
        <el-button v-show="isRoleEdit" @click="deleteRole" type="danger">{{$t('BUTTON_TEXT.DELETE')}}</el-button>
        <el-button @click="dialogRole = false">{{$t('BUTTON_TEXT.CANCEL')}}</el-button>
      </div>
    </el-dialog>
     <!-- 添加成员 Start -->
    <dialog-table :mate="membersMate" 
      :target="roleMemberList"
      :dialogVisible="dialogVisible" 
      :tableTitle="$t('LABEL_TEXT.SELECT_MEMBER')"
      :maxHeight="maxHeight"
      @handleConfirm="handleConfirm"></dialog-table>
     <!-- 添加成员 End -->
  </div>
</template>
<script>
import KBtn from '@/components/KBtn.vue';
import SERVICES from '@/services';
import { getType, debounce } from '@/utils/util.js';
import { BASIC_DATA_API } from '@/services/apis.js';
import { getLang } from '@/utils/util';

export default {
  components: {
    KBtn,
    DialogTable: function index(resolve){
      require(["@/components/Dialog/DialogTable.vue"], resolve)
    }
  },
  data () {
    return{
      hasQuery: false,          // 是否支持查询
      isRoleGroupEdit: false,   // 是否编辑角色组
      isRoleEdit: false,        // 是否编辑角色
      dialogVisible: false,     // 添加成员弹窗是否显示
      maxHeight: 300,           // 添加成员弹窗 table 的最大高度
      curParentNode: {},        // 当前角色组节点
      curChildNode: {},         // 当前角色节点
      curParentData: {},        // 当前角色组节点数据
      curChildData: {},         // 当前角色节点数据
      membersData: {},          // 添加人员列表 data
      timer: null,              // 计时器
      filterText: '',            // 过滤内容
      fullHeight: '',           // 可视区域高度
      titleHeight: '',          // 标题高度
      footerHeight: '',         // footer高度
      tabDefault: 'roles',      // 默认显示的 tab 标签的 name
      expandOnClickNode: false, // 左侧 tree 点击节点是否展开节点 
      defaultExpandedKeys: [],  // 左侧 tree 默认展开
      highLight: true,          // 左侧 tree 节点高亮
      treeData: [],             // 左侧 tree 节点数据
      defaultProps: {           // 左侧 tree props
        children: 'children',   // 子级
        label: 'name',          // 名称
      },
      roleMemberList:[],        // 角色成员列表
      roleBtns: [               // 角色右侧按钮组
        { action: "add", url: "", label: this.$t('BUTTON_TEXT.ADD_MEMBER'), icon: "" },
        { action: "remove", url: "", label: this.$t('BUTTON_TEXT.BATCH_DELETE'), icon: "", type: "danger", isSelector: true  }
      ],
      first: 1,                // 记录第一次点击节点
      word: true,              // 是否是文字按钮
      multipleSelection: [],   // 勾选项
      loading: false,          // 按钮 loading 动效
      dialogRoleGroup: false,  // 子部门弹窗
      dialogRole: false,       // 成员弹窗
      hasSelected: false,      // 是否勾选
      showClose: false,        // 是否显示弹窗关闭按钮
      modal: false,            // drawer 是否需要遮罩层
      wrapperClosable: true,   // 点击遮罩层是否可以关闭 Drawer
      roleGroupRules: {        // 角色组表单 rules
        groupName: [{ required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: 'blur'}]
      },
      roleGroupData: {        // 角色组表单数据
        groupName: '',
        // sort: undefined,
      },
      roleRules: {            // 角色表单 rules
        roleName: [{ required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: 'blur'}],
        roleGroupId: [{ required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: 'blur', disable: false}]
      },
      roleData: {             // 角色表单数据
        roleName: '',
        roleGroupId: ''
      },
      roleGroupList: [],     // 角色组列表（新增角色里角色组下拉列表）
      membersMate: {        // 角色新增成员弹窗列表配置
        mateList:{           // table 渲染配置
          columns: [
            {name: "name", label: this.$t('LABEL_TEXT.NAME'), width: 220, isShow: true, sortable: false},
            {name: "orgName", label: this.$t('LABEL_TEXT.DEPARTMENT'), width: 280, isShow: true, sortable: false},
            {name: "jobNumber", label: this.$t('LABEL_TEXT.EMP_NUM'), width: '', isShow: true, sortable: false}
          ],
          size: '', 
          page: '',
          total: '',
          rows: [],
          dataApi: BASIC_DATA_API.GET_ROLE_MEMBER
        },
        mateSearch:{         // 搜索 渲染配置
          multipleConditions: true,
          values: {
            name: "",
            orgName: ""
          },
          fields: [
            {
              holder: "text",
              name: "name",
              label: this.$t('LABEL_TEXT.NAME'),
              lg: 4,
              placeholder: this.$t('LABEL_TEXT.NAME'),
            },{
              holder: "text",
              name: "orgName",
              label: this.$t('LABEL_TEXT.DEPARTMENT'),
              lg: 4,
              placeholder: this.$t('LABEL_TEXT.DEPARTMENT')
            },
          ],
          url: BASIC_DATA_API.GET_ROLE_MEMBER
        }
      },
      dragData:{            // 左侧树拖拽 参数
        startId: '',        // 开始节点的 id
        endId: '',          // 拖拽至结束节点的 id
        dropType: '',       // "before"、"after"、"inner"
        type: ''            // 拖拽的是角色组还是角色 "GROUP"、"ROLE"
      }
    }
  },
  computed: {
    labelWidth(){ // 中文和英文的时候 drawer 表单 label 的宽度
      return getLang() === "en-US" ? "150px" : "110px";
    },
    roleGroupTitle(){ // 角色组 drawer 的标题 区分新增还是编辑状态
      return this.isRoleGroupEdit ? this.$t('TITLE_TEXT.EDIT_ROLE_GROUP') : this.$t('TITLE_TEXT.ADD_ROLE_GROUP');
    },
    roleTitle(){ // 角色 drawer 的标题 区分新增还是编辑状态
      return this.isRoleEdit ? this.$t('TITLE_TEXT.EDIT_ROLE') : this.$t('TITLE_TEXT.ADD_ROLE');
    },
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    /** 初始化
     * @param {Number} flag 识别是否是刷新当前页面
     * @return void
     ** Author: zhongxiaolong
     */
    init(flag){
      this.getTreeData();
      // 获取角色组列表 新增角色的角色组下拉
      this.getRoleGroupList();
      // 获取新增成员全部成员列表
      this.getMemberList();
      if(flag){
        this.curChildNode = {};
      }
    },
    /** 
     * 点击节点事件
     * 保存当前节点
     * 并获取当前点击节点的相关信息
     * 设置 tree 节点状态
     * @param {Object} data 当前点击节点对应的数据对象
     * @param {Object} node 当前点击节点对应的 node
     * @param {Object} e 当前节点组件本身
     * @return void
     ** Author: zhongxiaolong
     */
    handleNodeClick(data, node, ele) {
      let { id } = data;
      if(this.curChildNode && this.curChildNode.data && id != this.curChildNode.data.id){
        this.curChildNode.isCurrent = false;
        this.curParentNode.isCurrent = false;
      }
      if(node.level === 1) {
        node.isCurrent = false;
        this.curParentData = data;
        this.curParentNode.isCurrent = false;
        this.curChildNode.isCurrent = true;
        // this.getRoleGroupInfo(id);
        this.curParentNode = node;
        return;
      }else{
        if(this.first === 1){
          this.getRoleMemberList(data.id);
          this.first++
        }
        // 点击同一节点不重复请求
        if(this.curChildNode && this.curChildNode.data && id != this.curChildNode.data.id){
          // 获取角色加人员列表
          this.getRoleMemberList(data.id);
        }
        this.curChildData = data;
        this.curChildNode = node;
      }
    },
    /**
     * 节点过滤
     * @param {String} value 过滤的 key
     * @param {Object} node 当前点击节点对应的 node
     * @return void
     ** Author: zhongxiaolong
     */
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    /** 渲染 tree 节点
     * 自定义渲染 tree icon 内容等
     * @param {Function} h 自带渲染方你发
     * @param {Object} {node, data, store} 节点信息
     * @return Dom 渲染Dom
     ** Author: zhongxiaolong
     */
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node" style="display: inline-block; width: 100%; line-height: 40px;">
          <i  style="color: #409EFF;" class={node.level === 1 ? node.expanded ? 'el-icon-folder-opened' : 'el-icon-folder' : 'el-icon-s-custom'}></i>
          <span style="margin-left:5px;">{node.label}</span>
          {
            node.level === 1 ? <span class="btn" style="float: right; margin-right: 15px;"><el-button size="mini" type="default" class="editBtn" icon="el-icon-edit-outline" circle on-click={ () => this.editRoleGroup(node, data) }></el-button></span> : <span></span>
          }
        </span>
      );
    },
    /**
     * 新增角色
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    addRole() {
      this.dialogRole = true;
      this.roleData['roleName'] = '';
      this.roleData['roleGroupId'] = '';
      this.roleRules['roleGroupId'][0].disabled = false;
      this.$nextTick(() =>{
        // 重置校验状态
        this.$refs['roleForm'].clearValidate();
      })
    },
    /**
     * 保存角色
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    handleRole(){
      this.$refs['roleForm'].validate(valid => {
        if(valid){
          let { roleName, roleGroupId } = this.roleData;
          let id = this.isRoleEdit ? this.curChildData.id : '';
          let data = {
            roleName,
            roleGroupId,
            id
          }
          SERVICES.ORGANIZATIONAL_ROLE.setRole(data).then(res => {
            let data = res.data;
            if(!this.isRoleEdit){
              let newChild = { id: data.data, value: data.data, name: roleName, roleGroupId: roleGroupId, memberCount: 0 };
              let parent = this.$refs['tree'].getNode(roleGroupId);
              // 把新增节点插入到角色组中 1.有子节点 2.没有子节点
              // 如果角色有子节点
              if(parent.data.children != undefined){
                parent.data.children.push(newChild);
              }else{ // 没有子节点
                let children = [];
                children.push(newChild);
                this.$set(parent.data, 'children', children)
              }
            }else{
              this.curChildNode.data['name'] = roleName;
            }
            this.dialogRole = false;
            this.isRoleEdit = false;
            this.$message({
              type: 'success',
              message: this.$t('TIPS_WARNING.SAVE_SUCCESS')
            })
          })
        }else{
          return
        }
      })
    },
    /**
     * 删除角色
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    deleteRole() {
      let data = this.curChildData;
      let node = this.$refs['tree'].getNode(data.id);
      this.$confirm(this.$t('TIPS_WARNING.ROLE_DELETE'),{
        confirmButtonText: this.$t("BUTTON_TEXT.OK"), // 确认
        cancelButtonText: this.$t("BUTTON_TEXT.CANCEL"), // 取消
        type: 'warning'
      }).then(res => {
        SERVICES.ORGANIZATIONAL_ROLE.delRole(data.id).then(res =>{
          if(res.data.statusCode === 200 && res.data.data){
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.id === data.id);
            children.splice(index, 1);
            // let parentSibling = parent.previousSibling || parent.nextSibling;
            // this.curChildNode = node.previousSibling || node.nextSibling;
            // this.$refs['tree'].setCurrentKey(this.curChildNode.data.id);
            // this.getRoleInfo(this.curChildNode.data.id);
            this.curChildNode = {};
            this.curChildData = {};
            this.isRoleEdit = false;
            this.dialogRole = false;
            this.$message({
              type: 'success',
              message: this.$t('TIPS_WARNING.DELETE_SUCCESS')
            })
          }else if(res.data.statusCode === 500){
            this.$message({
              type: 'error',
              message: this.$t('TIPS_WARNING.CANNOT_DELETE')
            })
          }
        })
      }).catch(err => {});
    },
    /**
     * 编辑/修改角色
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    async editRole() {
      let id = this.curChildData.id || '';
      await this.getRoleInfo(id);
      this.isRoleEdit = true;
      this.dialogRole = true;
      this.roleRules['roleGroupId'][0].disabled = true;
    },
    /**
     * 新增角色组
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    addRoleGroup() {
      this.dialogRoleGroup = true;
      this.roleGroupData['groupName'] = '';
      // this.roleGroupData['sort'] = undefined;
      this.$nextTick(() =>{
        // 重置校验状态
        this.$refs['roleGroupForm'].clearValidate();
      })
    },
    /**
     * 保存角色组
     ** Author: zhongxiaolong
     */
    handleRoleGroup(){
      this.$refs['roleGroupForm'].validate(valid => {
        if(valid){
          const _this = this;
          let { groupName } = this.roleGroupData;
          let id = "";
          // if(sort == '' || sort == undefined){
          //   // 如果没有 sort 获取角色组末尾节点 sort ，排序在其后 sort 默认为10
          //   sort = this.roleGroupList.length && this.roleGroupList[this.roleGroupList.length - 1]['sort'] + 10 || 10;
          // }
          if(this.isRoleGroupEdit){ // 编辑状态保存 id
            id = this.curParentData.id;
          }
          let data = {
            groupName,
            // sort,
            id
          }
          SERVICES.ORGANIZATIONAL_ROLE.setRoleGroup(data).then(res => {
            let data = res.data;
            if(!this.isRoleGroupEdit){ // 新增
              let newChild = { id: data.data, value: data.data, pid: "0", name: groupName, }
              let root = this.$refs['tree'].root;
              root.data.push(newChild);
            }else{
              _this.curParentNode.data['name'] = groupName;
            }
            this.isRoleGroupEdit = false;
            this.dialogRoleGroup = false;
            // 重新获取角色组列表
            this.getRoleGroupList();
            this.$message({
              type: 'success',
              message: this.$t('TIPS_WARNING.SAVE_SUCCESS')
            })
          })
        }else{
          return
        }
      })
    },
    /**
     * 删除角色组
     * @param void
     ** Author: zhongxiaolong
     */
    removeRoleGroup() {
      let data = this.curParentData;
      let node = this.curParentNode;
      this.$confirm(this.$t('TIPS_WARNING.ROLE_GROUP_DELETE'),{
        confirmButtonText: this.$t("BUTTON_TEXT.OK"), // 确认
        cancelButtonText: this.$t("BUTTON_TEXT.CANCEL"), // 取消
        type: 'warning'
      }).then(res => {
        SERVICES.ORGANIZATIONAL_ROLE.delRoleGroup(data.id).then(res =>{
          if(res.data.statusCode === 200 && res.data.data){
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.id === data.id);
            children.splice(index, 1);
            this.isRoleGroupEdit = false;
            this.dialogRoleGroup = false;
            // 重新获取角色组列表
            this.getRoleGroupList();
            this.$message({
              type: 'success',
              message: this.$t('TIPS_WARNING.DELETE_SUCCESS')
            })
          }else if(res.data.statusCode === 500){
            this.$message({
              type: 'error',
              message: this.$t('TIPS_WARNING.CANNOT_DELETE')
            })
          }
        })
      }).catch(err => {});
    },
    /** 
     * 编辑角色组
     * @param {Object} node 当前节点 node
     * @param {Object} data 当前节点 数据
     * @return void
     ** Author: zhongxiaolong
     */
    async editRoleGroup(node, data) {
      await this.getRoleGroupInfo(data.id);
      this.isRoleGroupEdit = true;
      this.dialogRoleGroup = true;
      this.curParentNode = node;
      this.curParentData = data;
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
    handleButtons(btn, rowId) {
      // 当前操作
      let action = btn.action;
      const btnEvents = {
        add: (btn) => this.handleAdd(btn), // 新增
        remove: (btn) => this.handleRemove(btn), // 移除人员
        default: () => {
          return;
        }
      };
      return (btnEvents[action] || btnEvents.default)(btn);
    },
    handleAdd(btn) {
      this.dialogVisible = true;
    },
    handleRemove(btn) {
      // 勾选行 id 对象
      const rowIds = this.multipleSelection.map(r => r.empRoleId);
      this.removeRoleMember(rowIds);
    },
    rowClick(row){
      this.$refs['table'].toggleRowSelection(row)
    },
    drawerInit() {
      this.fullHeight= `${document.documentElement.clientHeight}`;//默认值
      const _this = this;
      this.getHeight();
      window.onresize = () => {
        return (() => {
          window.fullHeight = document.documentElement.clientHeight;
          _this.fullHeight = window.fullHeight;
        })()
      }
    },
    getHeight() {
      let el = this.$refs['drawer_role'].$refs.drawer.children;
      let content;
      if(el.length) {
        if(el[0].className === 'el-drawer__header'){
          this.titleHeight = el[0].offsetHeight || 67;
        }
        if(el[1] && el[1].children[1] && el[1].children[1].className === 'drawer__footer'){
          this.footerHeight = el[1].children[1].offsetHeight || 40;
        }
      }
    },
    /** 动态修改样式
     * @param {Number} fullHeight 当前可视区域高度
     ** Author: zhongxiaolong
     */
     changeFixed(fullHeight){
      this.$refs['drawerContent'].style.height = (fullHeight - this.titleHeight - this.footerHeight - 40)+'px';
     },
    /**
     * 多选控制
     * @param {Boolean} bool 是否有勾选
     * @param {Array} selectedArr 勾选行数据数组
     * @return void
     ** Author: zhongxiaolong
     */
    handleSelected (bool,selectedArr) {
      this.hasSelected = bool;
      this.multipleSelection = selectedArr;
      this.$emit('handleSelected',this.hasSelected,this.multipleSelection);
    },
    /** table勾选事件 
     * @param {Array} 当前勾选行
     * @return void
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /** 新增成员保存到后台并关闭弹窗 
     * @param {String} ids 所选行 id
     * @return void
     */
    handleConfirm(ids) {
      if(ids){
        let roleId = this.curChildNode.data.id;
        SERVICES.ORGANIZATIONAL_ROLE.setMemberList(roleId, ids).then(res => {
          this.getRoleMemberList(roleId);
          this.dialogVisible = false;
        })
      }else{
        this.dialogVisible = false;
      }
    },
    /**
     * 移除角色下成员
     * @param {Array} rowIds 勾选项 id 
     * @return void
     */
    removeRoleMember(rowIds){
      let ids = rowIds.join(',');
      let roleId = this.curChildNode.data.id;
      this.$confirm(this.$t('TIPS_WARNING.REMOVE_EMP_FORM_THE_ROLE'),{
        confirmButtonText: this.$t("BUTTON_TEXT.OK"), // 确认
        cancelButtonText: this.$t("BUTTON_TEXT.CANCEL"), // 取消
        type: 'warning'
      }).then(res => {
        SERVICES.ORGANIZATIONAL_ROLE.removeRoleMember(ids).then(res => {
          this.getRoleMemberList(roleId);
          this.$message({
            type: 'success',
            message: this.$t('TIPS_WARNING.REMOVE_SUCCESS')
          })
        })
      }).catch(err => {});
    },
    /**
     * 获取左侧 tree 
     * 获取角色树,并设置默认显示角色和当前角色高亮
     ** Author: zhongxiaolong
     */
     getTreeData(){
      const _this = this;
      SERVICES.ORGANIZATIONAL_ROLE.getRoleTree().then(res => {
        if(res.data && res.data.statusCode === 200 && res.data.data.length){
          this.treeData = res.data.data;
          let firstChildren = res.data.data[0].children;
          res.data.data.forEach(item => {
            if(item.children && item.children.length){
              this.defaultExpandedKeys.push(item.id);
            }
          })
          // this.$nextTick(() => {
            // if( firstChildren.length){
            //   let tree = this.$refs['tree'],
            //       firstChildrenId = firstChildren[0].id;
              // 保存第一个子节点用作右侧默认显示
              // this.curChildNode = tree.getNode(firstChildrenId);
              // this.curChildData = firstChildren[0]
              // 设置当前节点高亮
              // tree.setCurrentKey(firstChildrenId) 
            // }
          // })
        }
      })
    },
    /**
     * 获取角色组列表  
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    getRoleGroupList(){
      const _this = this;
      SERVICES.ORGANIZATIONAL_ROLE.getRoleGroupList().then(res => {
        let data = res.data && res.data.data || [];
        if(data.length){
          _this.roleGroupList = data;
        }
      })
    },
    /**
     * 获取角色组信息  
     * @param {String} id 角色组 id
     * @return void
     ** Author: zhongxiaolong
     */
    getRoleGroupInfo(id){
      const _this = this;
      SERVICES.ORGANIZATIONAL_ROLE.getRoleGroupInfo(id).then(res => {
        if(res.data && res.data.header !== null ){
          _this.curParentData = res.data.header;
          // this.roleGroupData['sort'] = res.data.header.sort || '';
          this.roleGroupData['groupName'] = res.data.header.groupName;
        }
      })
    },
    /**
     * 获取角色下成员列表  
     * @param {String} id 角色 id
     * @return void
     ** Author: zhongxiaolong
     */
    getRoleMemberList(id){
      const _this = this;
      SERVICES.ORGANIZATIONAL_ROLE.getRoleMemberList(id).then(res => {
        let data = res.data && res.data.data || [];
        _this.roleMemberList = data;
      })
    },
    /**
     * 获取角色信息  
     * @param {String} id 角色 id
     * @return void
     ** Author: zhongxiaolong
     */
    getRoleInfo(id){
      const _this = this;
      SERVICES.ORGANIZATIONAL_ROLE.getRoleInfo(id).then(res => {
        if(res.data && res.data.header !== null ){
          let { roleName, roleGroupId, id } = res.data.header;
          _this.roleData = { roleName, roleGroupId, id };
        }
      })
    },
    /**
     * 获取新增成员全部成员列表  
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    getMemberList(){
      const _this = this;
      SERVICES.ORGANIZATIONAL_ROLE.getMemberList({}).then(res => {
        let data = res.data;
        if(res.status === 200 && !!data){
          let { total, ...resData } = data;
          let rows = data.list;
          let page = data.pageNum;
          let size = data.pageSize;
          _this.membersMate.mateList = { ..._this.membersMate.mateList, size, page, total, rows };
        }
      })
    },
    /**
     * drawer 关闭前事件
     */
    handleClose(){;
      this.dialogRoleGroup = false;
      this.dialogRole = false;
      this.isRoleGroupEdit = false
      this.isRoleEdit = false;
    },
    /**
     * tree 节点拖拽逻辑
     * @handleDragStart 节点开始拖拽时触发的事件 共两个参数，依次为：被拖拽节点对应的 Node、event
     * @handleDragEnd 拖拽结束时（可能未成功）触发的事件 共四个参数，依次为：被拖拽节点对应的 Node、结束拖拽时最后进入的节点（可能为空）、被拖拽节点的放置位置（before、after、inner）、event
     * @handleDrop 拖拽成功完成时触发的事件 共四个参数，依次为：被拖拽节点对应的 Node、结束拖拽时最后进入的节点、被拖拽节点的放置位置（before、after、inner）、event
     * @allowDrop 拖拽时判定目标节点能否被放置。type 参数有三种情况：'prev'、'inner' 和 'next'，分别表示放置在目标节点前、插入至目标节点和放置在目标节点后
     ** Author: zhongxiaolong
     */
    handleDragStart(node, ev) {
      this.dragData['startId'] = node && node.data.id;
      this.dragData['type'] = node && node.data.type;
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      this.dragData['endId'] = dropNode && dropNode.data.id;
      this.dragData['dropType'] = dropType;
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      this.handleSort(this.dragData);
    },
    allowDrop(draggingNode, dropNode, type) {
      if (draggingNode.level === dropNode.level) { // 同级
        if (draggingNode.parent.id === dropNode.parent.id) { // 同一父节点
          // 向上拖拽 || 向下拖拽
          return type === "prev" || type === "next";
        }
      } else {
        // 不同级进行处理
        return false;
      }
    },
    /**
     * 拖拽成功后请求接口保存拖拽数据
     * @param {Object} data 拖拽数据
     * @return void
     */
    handleSort({startId, endId, dropType, type}){
      SERVICES.ORGANIZATIONAL_ROLE.handleSort(startId, endId, dropType, type);
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    multipleSelection(newSelection) {
      this.hasSelected = newSelection && newSelection.length !== 0;
    }, 
    fullHeight(val) {
      if(!this.timer) {
        this.fullHeight = val;
        if(this.dialogRole) {
          this.changeFixed(this.fullHeight);
        }
        this.timer = true;
        let _this = this;
        setTimeout(function (){//频繁触发 resize 函数，会导致页面很卡
          _this.timer = false;
        }, 100)
      }
    }
  },
}
</script>
<style lang="scss">
  @import "@/assets/css/organizationalRole.scss";

  .el-tree-node__content:hover{
    .editBtn{
      display: inline-block;
    }
  }
  .editBtn{
    display: none;
  }
</style>
