<!-- created by zhongxiaolong on 2019/02/11 -->
<!-- 组织架构 OrganizationalStructure -->
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
            @input="handleSearch">
          </el-input>
        </div>
        <div class="tree_box">
          <div class="title_btn">
            <el-button type="primary" @click="init" round>{{$t('LABEL_TEXT.ORGANIZATIONAL_STRUCTURE')}}<i class="el-icon-refresh el-icon--right org-refresh" style="float: right;"></i></el-button>
          </div>
          <el-tree
            id="orgTree"
            v-show="!depts.length && !emps.length"
            ref="tree"
            class="filter-tree"
            :data="treeData" 
            :props="defaultProps"
            @node-click="handleNodeClick"
            @node-expand="handleExpand"
            @node-collapse="handleNodeCollapse"
            :expand-on-click-node="expandOnClickNode"
            :render-content="renderContent"
            node-key="id"
            :highlight-current="highLight"
            :default-expanded-keys="defaultExpandedKeys"
            :load="loadNode"
            :lazy="lazy"
          ></el-tree>
          <el-collapse v-show="depts.length || emps.length" v-model="activeNames" @change="handleChange" class="search_list">
            <el-collapse-item v-show="depts.length" :title="$t('LABEL_TEXT.DEPT_LIST')" name="depts">
              <div v-for="(item, index) in depts" :key="index" @click="handledDeptClick(item.id)" style="position: relative;" class="search_item"><i class="el-icon-folder" style="color: #409EFF;"></i>&nbsp;&nbsp;{{item.name}}</div>
            </el-collapse-item>
            <el-collapse-item v-show="emps.length" :title="$t('LABEL_TEXT.MEMBER_LIST')" name="emps">
              <div v-for="(item, index) in emps" :key="index" @click="memberRowClick(item)" style="position: relative;" class="search_item"><i class="el-icon-s-custom" style="color: #409EFF;"></i>&nbsp;&nbsp;{{item.name}}</div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-aside>
      <el-main>
        <div class="main_org">
          <div class="_title _title_1">
            <span>{{this.curNodeData.name}}</span>
            <el-button @click="handleDept(true)" type="default" size="mini" round>{{$t('BUTTON_TEXT.SET_UP')}}</el-button>
          </div>
          <el-breadcrumb class="app-breadcrumb" separator=">">
            <transition-group name="breadcrumb">
              <el-breadcrumb-item v-for="(item,index) in chainList" :key="item.path">
                <span v-if="index==chainList.length-1" class="no-redirect" v-text="item.orgName"></span>
                <a v-else v-text="item.orgName" @click="handleLink(item)"></a>
              </el-breadcrumb-item>
            </transition-group>
          </el-breadcrumb>
          <div class="label">
            <div class="_title _title_2">
              <i class="el-icon-guide"></i>
              <span>{{$t('TITLE_TEXT.SUB_DEPT')}}</span>
            </div>
            <div class="btn_box">
              <el-button @click="handleDept(false)" type="default" size="mini" round>{{$t('BUTTON_TEXT.ADD_SUB_DEPT')}}</el-button>
            </div>
            <div class="nonSubDeptTips" v-show="!curNodeData.children">
              <span>{{$t('TIPS_WARNING.HAVE_NO_SUB_DEPT')}}</span>
              <el-button @click="handleDept(false)" type="text">{{$t('BUTTON_TEXT.ADD_SUB_DEPT')}}</el-button>
            </div>
            <el-table
              v-show="curNodeData.children"
              class="subDept_table"
              :data="curNodeData.children"
              style="width: 100%"
              @row-click="deptRowClick"
              highlight-current-row
              :show-header="false">
              <el-table-column
                prop="label"
                :label="$t('LABEL_TEXT.SUB_DEPT')">
                <template slot-scope="scope">
                  <span>{{scope.row['name']}}({{scope.row['memberCount']}}{{$t('LABEL_TEXT.PEOPLE')}})</span>
                  <i class="el-icon-arrow-right"></i>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="deptMembers">
            <div class="_title _title_2">
              <i class="el-icon-s-custom"></i>
              <span>{{$t('TITLE_TEXT.DEPT_MEMBERS')}}</span>
            </div>
            <div class="btn_box">
              <el-row >
                <k-btn v-for="(btn, index) of deptMembersBtns" 
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
            <div class="nonSubDeptTips" v-show="!deptMembersData.length">
              <span>{{$t('TIPS_WARNING.NO_MEMBERS_FOUND')}}</span>
              <el-button @click="dialogMembers = true" type="text">{{$t('BUTTON_TEXT.ADD_MEMBER')}}</el-button>
            </div>
            <el-table
              v-show="deptMembersData.length"
              :data="deptMembersData"
              @row-click="memberRowClick"
              @selection-change="handleSelectionChange"
              style="width: 100%">
              <el-table-column 
                fixed="left" 
                type="selection" 
                width="50"></el-table-column>
              <el-table-column
                prop="name"
                :label="$t('LABEL_TEXT.NAME')"
                width="160">
              </el-table-column>
              <el-table-column
                prop="position"
                :label="$t('LABEL_TEXT.POSITION')"
                width="220">
              </el-table-column>
              <el-table-column
                prop="jobNumber"
                :label="$t('LABEL_TEXT.EMP_NUM')"
                width="120">
              </el-table-column>
              <el-table-column
                prop="phone"
                :label="$t('LABEL_TEXT.MOBILE')"
                width="180">
              </el-table-column>
              <el-table-column
                prop="email"
                :label="$t('LABEL_TEXT.EMAIL')">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-main>
    </el-container>
    <!-- 新增部门 Start -->
    <el-drawer
      ref="drawer_dept"
      :title="deptDialogTitle"
      :show-close="showClose"
      :visible.sync="dialogDept"
      direction="rtl"
      custom-class="org-drawer"
      :modal="modal"
      :wrapperClosable="wrapperClosable"
      :before-close="handleClose"
      >
      <div class="drawer__content">
        <el-form :rules="deptRules" ref="deptForm" :model="deptData" :inline="false" :label-width="labelWidth">
          <el-row>
            <div class="content_title">{{$t('TITLE_TEXT.DEPT_INFO')}}</div>
          </el-row>
          <el-row >
            <el-form-item :label="$t('LABEL_TEXT.DEPT_NAME')" prop="orgName">
              <el-input v-model.trim="deptData['orgName']" :disabled="orgNameControl" maxlength="50" show-word-limit></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item :label="$t('LABEL_TEXT.PARENT_DEPT')" prop="parentId" v-if="showParent">
              <el-cascader
                v-model="deptData['parentId']"
                :options="deptEditTreeData"
                :props="{ checkStrictly: true, emitPath: false }"
                :show-all-levels="false"
                size="medium"
                @change="handleDeptEditchange"
                @focus="handleDeptEditFocus(deptEditTreeData)"
                clearable></el-cascader>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item :label="$t('LABEL_TEXT.DEPT_MANAGER')" prop="leader" v-show="isDeptEdit">
              <el-select v-model="deptData['leader']" filterable>
                <el-option v-for="(item, index) in deptMembersData" :key="index" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <div class="drawer__footer">
        <el-button type="primary" @click="handleSubmitDept" :loading="loading">{{ loading ? $t('BUTTON_TEXT.SAVING') : $t('BUTTON_TEXT.SAVE') }}</el-button>
        <el-button v-show="isDeptEdit" @click="deleteDept" type="danger">{{$t('BUTTON_TEXT.DELETE')}}</el-button>
        <el-button @click="handleDrawerClose('dept')">{{$t('BUTTON_TEXT.CANCEL')}}</el-button>
      </div>
    </el-drawer>
    <!-- 新增部门 End -->
    <!-- 添加成员 Start -->
    <el-drawer
      ref="drawer_members"
      :title="memberDialogTitle"
      :show-close="showClose"
      :visible.sync="dialogMembers"
      direction="rtl"
      custom-class="org-drawer"
      :modal="modal"
      :wrapperClosable="wrapperClosable"
      :before-close="handleClose"
      >
      <div class="drawer__content" ref="drawerContent">
        <el-form :rules="membersRules" ref="membersForm" :model="membersData" :inline="false" :label-width="labelWidth">
          <el-row>
            <div class="content_title">{{$t('TITLE_TEXT.MEMBERS_INFO')}}</div>
          </el-row>
          <el-row >
            <el-form-item :label="$t('LABEL_TEXT.NAME')" prop="name">
              <el-input v-model.trim="membersData['name']"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item :label="$t('LABEL_TEXT.MOBILE')" prop="phone">
              <el-input v-model.trim="membersData['phone']"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item :label="$t('LABEL_TEXT.DEPARTMENT')" prop="orgListArray">
              <el-cascader
                v-model="membersData['orgListArray']"
                :options="deptTreeData"
                :props="{ multiple: true, checkStrictly: true }"
                :show-all-levels="false"
                :placeholder="$t('TIPS_WARNING.SELECTED')"
                size="medium"
                @change="handleDeptChange"
                clearable></el-cascader>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item :label="$t('LABEL_TEXT.POSITION')" prop="position">
              <el-input v-model.trim="membersData['position']"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item :label="$t('LABEL_TEXT.EMAIL')" prop="email">
              <el-input v-model.trim="membersData['email']"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item :label="$t('LABEL_TEXT.ROLES')" prop="roleListArray">
              <el-cascader
                v-model="membersData['roleListArray']"
                :options="roleTreeData"
                :props="{ multiple: true, checkStrictly: true }"
                :show-all-levels="false"
                :placeholder="$t('TIPS_WARNING.SELECTED')"
                expandTrigger="hover"
                size="medium"
                @change="handleRoleChange"
                clearable></el-cascader>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item :label="$t('LABEL_TEXT.EMP_NUM')" prop="jobNumber">
              <el-input v-model.trim="membersData['jobNumber']"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item :label="$t('LABEL_TEXT.EXTENSION')" prop="ext">
              <el-input v-model.trim="membersData['ext']"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item :label="$t('LABEL_TEXT.OFFICE_LOCATION')" prop="office">
              <el-input v-model="membersData['office']"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item :label="$t('LABEL_TEXT.COMMENCEMENT_DATE')" prop="hiredate">
              <el-date-picker
                clearable
                type="date"
                v-model="membersData['hiredate']"
                :placeholder="$t('TIPS_WARNING.SELECT_DATE')"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                :editable="false"></el-date-picker>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item :label="$t('LABEL_TEXT.NOTE')" prop="remarks">
              <el-input v-model="membersData['remarks']" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" maxlength="200" show-word-limit></el-input>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <div class="drawer__footer">
        <el-button type="primary" @click="handleSubmitMember(0)" :loading="loading">{{ loading ? $t('BUTTON_TEXT.SAVING') : $t('BUTTON_TEXT.SAVE') }}</el-button>
        <el-button type="primary" v-show="!isMemberEdit" @click="handleSubmitMember(1)" :loading="loading2">{{ loading2 ? $t('BUTTON_TEXT.SAVING') : $t('BUTTON_TEXT.SAVE_AND_CONTINUE') }}</el-button>
        <el-button v-show="isMemberEdit" @click="delMember" type="danger">{{$t('BUTTON_TEXT.DELETE')}}</el-button>
        <el-button @click="handleDrawerClose('member')">{{$t('BUTTON_TEXT.CANCEL')}}</el-button>
      </div>
    </el-drawer>
    <!-- 添加成员 End -->
  </div>
</template>
<script>
import KBtn from '@/components/KBtn.vue';
import SERVICES from '@/services';
import { getType, debounce } from '@/utils/util.js';
import * as Utils from '@/utils/validates/index';
import { getLang } from '@/utils/util';

export default {
  components: {
    KBtn
  },
  data () {
    return{
      user:{},                        // 当前用户信息
      hasQuery: true,                 // 是否支持查询
      lazy: false,                    // tree 懒加载
      timer: null,                    // 计时器
      filterText: '',                  // 过滤内容
      fullHeight: '',                 // 可视区域高度
      titleHeight: '',                // 标题高度
      footerHeight: '',               // footer高度
      newNodeId: '',                  // 新增节点id
      tabDefault: 'hierarchy',        // 默认显示的 tab 标签的 name
      modal: false,                   // drawer 是否需要遮罩层
      wrapperClosable: true,          // 点击遮罩层是否可以关闭 Drawer
      highLight: true,                // 节点高亮
      curNode: {},                    // 当前选中/点击节点
      curNodeData: {},                // 当前选中/点击节点数据对象
      isTreeUpdate: false,            // 组织架构树是否跟新
      isDeptEdit: false,              // 是否是部门编辑状态
      isMemberEdit: false,            // 是否是成员编辑状态
      orgNameControl: false,          // 编辑部门弹窗是否 disabled 部门名称
      chainList: [],                  // 面包屑导航
      activeNames: ['depts','emps'],  // 搜索列表默认展开列表
      depts: [],                      // 搜索部门列表
      emps: [],                       // 搜索人员列表
      expandOnClickNode: false,       // 左侧 tree 点击节点是否展开节点
      defaultExpandedKeys: [],        // 左侧 tree 默认展开
      defaultCheckedKeys: [],         // 左侧 tree 默认选中
      treeData: [],                   // 左侧 tree 节点数据
      deptTreeData: [],               // 部门 tree 新增成员 部门下拉选项
      deptEditTreeData: [],           // 部门 tree 编辑部门上级部门用
      returnDisabled: false,          // 控制部门 tree 当前部门不允许选择
      hasChangeParentId: false,       // 是否改变上级部门
      roleTreeData: [],               // 角色 tree
      defaultProps: {                 // 左侧 tree props
        children: 'children',         // 子级
        label: 'name',                // 名称
      },
      deptMembersData:[],             // 部门人员
      deptMembersBtns: [              // 部门人员交互按钮组
        { action: "add", url: "", label: this.$t('BUTTON_TEXT.ADD_MEMBER'), icon: "", type: "primary" },
        // { action: "import", url: "/menus/toadd", label: "批量导入", icon: "" },
        // { action: "export", url: "/menus/toadd", label: "批量导出/修改", icon: "" },
        // { action: "editDept", url: "/menus/toadd", label: "调整部门", icon: "" },
        // { action: "sort", url: "/menus/toadd", label: "调整排序", icon: "" },
        { action: "remove", url: "", label: this.$t('BUTTON_TEXT.BATCH_DELETE'), type: "danger",  icon: "", isSelector: true },
        // { action: "", url: "/menus/toadd", label: "邀请成员加入", icon: "", className: 'pull-right' },
      ],
      resolve: null,                  // 加载节点方法
      word: true,                     // 是否是文字按钮
      multipleSelection: [],          // 勾选项
      loading: false,                 // 保存按钮loading动画
      loading2: false,                // 保存并继续添加按钮loading动画
      dialogDept: false,              // 子部门弹窗
      dialogMembers: false,           // 成员弹窗
      hasSelected: false,             // 是否勾选
      showClose: false,               // 是否显示弹窗关闭按钮
      orgIds: [],                     // 渲染部门组件用id数据
      deptIds: {orgList:[]},                    // 需要刷新 tree 人数的部门id对象
      memberRow: null,                // 当前成员行数据
      deptRules: {                    // 部门 drawer 表单 rules
        orgName: [{ required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: 'blur'}],
        parentId: [{ required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: 'blur'}],
      },
      deptData: {                     // 部门 drawer 表单数据
        orgName: '',
        parentId: '',
        leader: '',
        leaderName: ''
      },
      membersRules: {                 // 成员 drawer 表单 rules
        name: [{ required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: 'blur'}],
        phone: [
          { required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: 'blur'},
          { validator: Utils.formValidateGene('validateMobile', this.$t('FORM_VALIDATION_INFO.ILLEGAL_PHONE')), trigger: 'blur' }],
        orgListArray: [{ required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: 'blur'}],
        email: [{validator: Utils.formValidateGene('validateEmail',this.$t('FORM_VALIDATION_INFO.ILLEGAL_EMAIL')), trigger: 'blur' }]
      },
      membersData: {                  // 成员 drawer 表单数据
        name: '',
        phone: '',
        orgListArray: [],
        orgList: [],
        position: '',
        email: '',
        roleList: [],
        roleListArray: [],
        jobNumber: '',
        ext: '',
        office: '',
        hiredate: '',
        remarks: ''
      },
    }
  },
  computed: {
    deptDialogTitle(){ // 部门 drawer 的标题 区分新增还是编辑状态
      return this.isDeptEdit ? this.$t('TITLE_TEXT.EDIT_DEPT') : this.$t('TITLE_TEXT.ADD_DEPT');
    },
    memberDialogTitle(){ // 成员 drawer 的标题 区分新增还是编辑状态
      return this.isMemberEdit ? this.memberRow ? this.memberRow.name : this.$t('TITLE_TEXT.EDIT_MEMBER') : this.$t('TITLE_TEXT.ADD_MEMBER');
    },
    showParent(){ // 是否显示上级部门拉下
      let showParent = false;
      if(this.dialogDept){ // 每次打开 drawer 重新渲染上级部门下拉
        showParent = true;
        // 根节点不渲染上级部门
        if(this.curNodeData.pid === '0' && this.isDeptEdit) showParent = false;
      }
      return showParent;
    },
    labelWidth(){ // 中文和英文的时候 drawer 表单 label 的宽度
      return getLang() === "en-US" ? "150px" : "110px";
    }
  },
  created() {
    this.init();
    this.user = JSON.parse(window.sessionStorage.getItem('user'));
  },
  mounted() {
    this.drawerInit();
  },
  methods: {
    /** 初始化
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    init() {
      // this.getTreeNode();
      // 获取左侧组织架构
      this.getTreeData();
    },
    /** 展开事件
     * @param {Object} data 当前点击节点对应数据对象
     * @param {Object} node 当前点击节点 node
     * @param {Object} e 当前点击节点
     * @return void
     ** Author: zhongxiaolong
     */
    handleExpand(data, node, e){
      // 保存当前展开的节点
      let flag = false;
      this.defaultExpandedKeys.some(item => {
        if (item === data.id) { // 判断当前节点是否存在， 存在不做处理
          flag = true;
          return true;
        }
      })
      if (!flag) { // 不存在则存到数组里
        this.defaultExpandedKeys.push(data.id);
      }
    },
    /** 收起事件
     * @param {Object} data 当前点击节点对应数据对象
     * @param {Object} node 当前点击节点 node
     * @param {Object} e 当前点击节点
     * @return void
     ** Author: zhongxiaolong
     */
    handleNodeCollapse(data, node, e){
      this.defaultExpandedKeys.some((item, i) => {
        if (item === data.id) {
          // 删除关闭节点
          this.defaultExpandedKeys.length = i;
        }
      })
    },
    /** 查询事件
     * 防抖 输入完成 500ms后执行事件
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    handleSearch(val){
      // debounce(() => {
        SERVICES.ORGANIZATIONAL_ROLE.queryOrgMember(val).then(res => {
          let data = res.data;
          this.depts = data.depts;
          this.emps = data.emps;
        })
      // },500)
    },
    handleChange(){

    },
    /** 面包屑导航点击事件
     * 设置当前点击部门节点高亮
     * 获取当前部门架构路径
     * 获取当前部门成员列表
     * 刷新视图
     * @param {Object} item 当前点击节点
     * @return void
     ** Author: zhongxiaolong
     */
    handleLink(item){
      let id = item.id;
      let tree = this.$refs['tree'];
      let node = tree.getNode(id);
      if(node.data.pid !== '0'){
        tree.treeItems[0].classList.remove("is-current");
      }
      tree.setCurrentKey(id);
      // 恢复所有节点 isCurrent 状态
      this.setCurrentNodeStatus(this.treeData);
      this.curNode = node;
      this.curNodeData = node.data;
      this.curNodeData.isCurrent = true;
      this.getChainList(id);
      this.getDeptMemberList(id);
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
    handleNodeClick(data, node, e) {
      // 移除根节点高亮
      // let tree = document.getElementById('orgTree');
      // tree.firstElementChild.classList.remove("is-current");
      let tree = this.$refs['tree'];
      if(data.pid !== '0') tree.treeItems[0].classList.remove("is-current");
      // 保存为当前节点
      this.curNode = node;
      this.curNodeData = node.data;
      // 如果当前点击节点不是当前节点 第一次点击当前节点 还不是高亮状态 请求节点信息
      if(!this.curNode.data.isCurrent) {
        let id = this.curNode.data.id;
        // 获取当前节点下的人员列表
        this.getDeptMemberList(id);
        // 获取当前节点的组织架构 path
        this.getChainList(id);
      }
      // 恢复所有节点 isCurrent 状态
      this.setCurrentNodeStatus(this.treeData);
      // 设置当前节点 isCurrent 为 true
      this.curNode.data.isCurrent = true;
    },
    /**
     * 左侧 tree 部门点击事件
     * 获取当前部门的成员列表
     * 获取当前部门的架构路径
     * 刷新右侧视图
     * @param {String} id 点前部门 id
     * @return void
     ** Author: zhongxiaolong
     */
    handledDeptClick(id){
      let tree = this.$refs['tree'];
      let node = tree.getNode(id);
      this.curNodeData = node ? node.data : {children: []};
      // 获取当前节点下的人员列表
      this.getDeptMemberList(id);
      // 获取当前节点的组织架构 path
      this.getChainList(id);
    },
    /** 设置当前点击节点状态
     * 递归循环 tree 设置（isCurrent）默认不是当前节点
     * 控制重复点击当前节点重复请求
     * @param {Object} data treeData
     * @return void
     ** Author: zhongxiaolong
     */
    setCurrentNodeStatus(data){
      data.forEach(item =>{
        item.isCurrent = false;
        // 如果当前节点有子级 则进入递归
        if(item.children && item.children.length){
          this.setCurrentNodeStatus(item.children);
        }
      })
    },
    /** 添加子部门 新增/编辑（修改、删除）
     * 重置表单
     * 获取表单部门选择列表
     * 改变表单状态 新增/编辑
     * 显示弹窗
     * @param {Boolean} bool 是否是部门编辑状态
     * @return void
     ** Author: zhongxiaolong
     */
    handleDept(bool){
      // 打开部门 drawer 先重置表单
      this.resetForm(this.deptData);
      // 获取部门选择列表
      this.getDeptSelect();
      // 设置上级部门 新增为当前部门id
      let data = this.curNodeData
      this.deptData.parentId = data.id
      // 是否是编辑状态
      if(bool) {
        // 设置编辑状态为 true
        this.isDeptEdit = true;
        // 根节点 disabled 部门名称
        if (data.pid === '0') this.orgNameControl = true;
        // 设置部门名称
        this.deptData.orgName = data.name;
        // 设置上级部门 编辑状态为父级 id
        this.deptData.parentId = data.pid;
        // 设置主管
        this.deptData.leader = data.leader; 
      }
      // 显示 drawer
      this.dialogDept = true;
      this.$nextTick(() =>{
        // 重置校验状态
        this.$refs['deptForm'].clearValidate();
      })
    },
    /** 
     * 加载节点事件 点击展开按钮触发
     * @param {Object} node 节点 node
     * @param {Function} resolve 渲染节点
     * @return resolve
     ** Author: zhongxiaolong
     */
    loadNode(node, resolve){
      // if (node.level === 0) // 本地的数据
      // this.curNode = node;
      // this.curNodeData = node.data;
      this.resolve = resolve;
      // if (node.level === 1) {
      //   if(node.data.children && node.data.children.length){
      //     return resolve(node.data.children);
      //   }else{
      //     return resolve([]);
      //   }
      // }
      if (node.level > 0) {
        if(node.data.children && node.data.children.length){
          return resolve(node.data.children);
        }else{
          return resolve([]);
        }
      }
    
    },
    /** 渲染 tree 节点
     * 自定义渲染 tree icon 内容等
     * @param {Function} h 自带渲染方你发
     * @param {Object} {node, data, store} 节点信息
     * @return Dom 渲染Dom
     ** Author: zhongxiaolong
     */
    renderContent(h, { node, data, store }){
      if(node.level === 1) node.isCurrent = true;
      return (
        <span class="custom-tree-node">
          <i class={node.level === 1 ? 'el-icon-s-home' : node.expanded ? 'el-icon-folder-opened' : 'el-icon-folder'}></i>
          <span style="margin-left:5px;">{`${node.label} (${node.data.memberCount}${this.$t('LABEL_TEXT.PEOPLE')})`}</span>
        </span>
        );
    },
    /**
     * 头部按钮控制
     * 点击按钮触发对应方法
     * @param {Object} btn 当前点击的按钮配置信息
     * @return {Function} 执行操作的方法
     ** Author: zhongxiaolong
     */
    handleButtons(btn) {
      // 当前操作
      let action = btn.action;
      const btnEvents = {
        add: (btn) => this.handleAdd(btn),               // 新增
        import: (btn) => this.handleExport(btn),         // 导入
        export: (btn) => this.handleExportEach(btn),     // 导出
        remove: (btn) => this.handleRemove(btn), // 删除部门人员
        default: () => {
          return;
        }
      };
      return (btnEvents[action] || btnEvents.default)(btn);
    },
    /** 新增人员
     * @param {Object} btn 按钮嘻嘻
     * @return void
     ** Author: zhongxiaolong
     */
    handleAdd(btn) {
      // 显示 drawer
      this.dialogMembers = true;
      // 获取部门菜单
      this.getDeptSelect();
      // 获取角色菜单
      this.getRoleSelect();
      // 重置表单字段
      this.resetForm(this.membersData);
      // 防止后台回传字段空值的时候为 null
      this.membersData.orgList = [];
      this.membersData.orgListArray = [];
      // 设置默认部门或者当前部门
      this.setDefaultDept();
      this.$nextTick(function(){
        this.getHeight();
        this.changeFixed(this.fullHeight);
        // 重置校验状态
        this.$refs['membersForm'].clearValidate();
      })
    },
    /** 批量删除部门下人员
     * 获取当前人员部门 id,拼接勾选行 id
     * @param {Object} btn 当前点击按钮信息
     * @return void
     ** Author: zhongxiaolong
     */
    handleRemove(btn){
      // 行 id 对象
      let rowIds = { id: this.multipleSelection.map(r => r.empOrgId) };
      let orgId = this.curNodeData.id;
      let ids = rowIds.id.join(',');
      this.$confirm(this.$t('TIPS_WARNING.DELETE_DEPT_MEMBERS_CONFIRM'),{
        confirmButtonText: this.$t("BUTTON_TEXT.OK"), // 确认
        cancelButtonText: this.$t("BUTTON_TEXT.CANCEL"), // 取消
        type: "warning"
      }).then(res => {
        SERVICES.ORGANIZATIONAL_ROLE.removeMembers(ids).then(res => {
          if(res.data && res.data.data){
            this.getDeptMemberList(orgId);
            // 移出成功后刷新 tree 人数
            this.getChainLists({orgList:[{id:orgId}]});
          }else if(res.data && !res.data.data){
            this.$message.warning(res.data.message);
          }
        })
      }).catch(err => {});
    },
    /** 设置默认部门
     * 如果左侧没有选怎 tree 节点 设置默认部门为根节点
     * 否则为当前选择节点
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    setDefaultDept(){
      let curDept = this.chainList[this.chainList.length - 1];
      if(curDept){
        let path = curDept.path.split('.');
        path.pop();
        this.membersData.orgListArray.push(path);
      }else{ // 如果没选左侧 tree node 部门默认显示根节点
        let node = this.curNode;
        this.orgIds = [[this.curNode.data.id]];
        this.getParentIds(node);
        this.membersData.orgListArray = this.orgIds;
      }
      this.handleDeptChange(this.membersData.orgListArray);
    },
    /**
     * 获取父级 id
     * 可用于 联级选择器 Cascader 回显
     * @param {Object} node 节点 node
     * @return void
     ** Author: zhongxiaolong
     */
    getParentIds(node){
      let nodeData = node.data;
      let parentId = nodeData.pid;
      if(parentId !== '0'){
        this.orgIds[0].unshift(parentId);
        let parentNode = node.parent
        this.getParentIds(parentNode);
      }
    },
    /** 人员列表点击行
     * 显示弹窗并重置表单
     * 获取成员详情
     * 获取表单部门列表、角色列表
     * 设置 drawer 高度
     * @param {Object} row 行信息
     * @return void
     ** Author: zhongxiaolong
     */
    memberRowClick(row){
      this.isMemberEdit = true;
      // 显示 drawer
      this.dialogMembers = true;
      this.memberRow = row;
      this.resetForm(this.membersData);
      this.getMemberDetail(row.id);
      this.getDeptSelect();
      this.getRoleSelect();
      this.$nextTick(() =>{
        this.getHeight();
        this.changeFixed(this.fullHeight);
        // 重置校验状态
        this.$refs['membersForm'].clearValidate();
      })
    },
    /** 部门列表点击行
     * 设置当前节点高亮
     * 获取部门成员列表
     * 获取部门架构路径
     * @param {Object} row 行信息
     * @return void
     ** Author: zhongxiaolong
     */
    deptRowClick(row){
      let tree = this.$refs['tree'];
      let id = row.id;
      tree.treeItems[0].classList.remove("is-current");
      tree.setCurrentKey(id);
      // tree.getNode(id).expanded = true; // 展开当前节点
      this.curNodeData = row;
      // 恢复所有节点 isCurrent 状态
      this.setCurrentNodeStatus(this.treeData);
      this.curNodeData.isCurrent = true;
      // 获取当前节点下的人员列表
      this.getDeptMemberList(id);
      // 获取当前节点的组织架构 path
      this.getChainList(id);
    },
    /** 
     * 部门 drawer 保存事件
     * 保存数据 校验表单必填项
     * 保存成功后刷新左侧 tree 节点
     * 
     * 新增 tree 节点
     * @param {Function} done confirm 默认事件
     * @return void
     ** Author: zhongxiaolong
     */
    handleSubmitDept() {
      const _this = this;
      this.$refs['deptForm'].validate(valid => {
        if(valid){
          this.loading = true;
          let id = '';
          let parentId = this.deptData.parentId;
          if(this.isDeptEdit) id = this.curNode.data.id;
          // 根节点没有 
          // if(this.curNode.pid === '0') parentId = '0';
          let node = this.$refs['tree'].getNode(this.deptData.parentId);
          let data = {
            id,
            orgName: this.deptData.orgName,
            parentId
          }
          let newNode = {...data}
          // 新增、编辑提交数据
          SERVICES.ORGANIZATIONAL_ROLE.setDeptInfo(data).then(res=> {
            let data = res.data;
            if(!this.isDeptEdit){ // 新增
              this.newNodeId = data.data; // 新增成功后保存新增节点的 id
              const newChild = { id: data.data, pid: parentId, name: newNode.orgName, memberCount: 0, value: data.data, label: newNode.orgName, children: []}
              // this.getTreeNode(parentId);
              let tree = _this.$refs['tree'];
              let curAddNodeParent = tree.getNode(parentId);
              if(!curAddNodeParent.data.children){
                this.$set(curAddNodeParent.data, 'children', [])
              }
              // 增加子节点
              curAddNodeParent.data.children.push(newChild);
              // if(!this.curNodeData.children){
              //   this.$set(this.curNodeData, 'children', [])
              // }
              // // 增加子节点
              // this.curNodeData.children.push(newChild);
            }else{ // 修改
              this.curNodeData.name = this.deptData.orgName;
              this.curNodeData.leader = this.deptData.leader;
              this.curNodeData.leaderName = this.deptData.leaderName;
              this.getChainList(id);
              if(this.hasChangeParentId) this.getTreeData();
            }
            // 展开父节点
            this.defaultExpandedKeys = [parentId];
            // 组织机构树跟新了
            this.isTreeUpdate = true;
            setTimeout(() => {
              this.loading = false;
              this.handleDrawerClose('dept');
              this.$message({
                message: this.$t('TIPS_WARNING.SAVE_SUCCESS'),
                type: "success"
              })
            }, 500);
          })
        }else{
          return
        }
      })
    },
    /** 
     * 删除部门 
     * 确认是否删除部门，成功删除部门后 刷新左侧 tree 节点
     * 设置其父级为当前节点高亮并刷新面包屑导航和部门成员列表
     * 关闭 drawer
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    deleteDept(){
      let id = this.curNode.data.id;
      const parent = this.curNode.parent;
      const children = parent.data.children || parent.data; 
      const childNodes = parent.childNodes;
      const index = children.findIndex(item => item.id === id) || childNodes.findIndex(item => item.id === id);
      this.$confirm(this.$t('TIPS_WARNING.DELETE_DEPT_CONFIRM'),{
        confirmButtonText: this.$t("BUTTON_TEXT.OK"), // 确认
        cancelButtonText: this.$t("BUTTON_TEXT.CANCEL"), // 取消
        type: "warning"
      }).then(res => {
        SERVICES.ORGANIZATIONAL_ROLE.delDeptInfo(id).then(res =>{
          if(res.data.statusCode === 200 && res.data.data){
            let tree = this.$refs['tree'];
            let parentId = parent.data.id;
            tree.setCurrentKey(id);
            children.splice(index, 1);
            childNodes.splice(index, 1);
            this.handleDrawerClose('dept');
            // 获取父级面包屑导航
            this.getChainList(parentId);
            // 获取当前节点下的人员列表
            this.getDeptMemberList(parentId);
            // 设置当前节点高亮
            tree.setCurrentKey(parentId);
            this.curNodeData = parent.data;
            this.$message({
              type: 'success',
              message: this.$t('TIPS_WARNING.DELETE_SUCCESS')
            })
          }else if(res.data.statusCode === 500){
            this.$message({
              type: 'error',
              message: this.$t('TIPS_WARNING.NEED_DELETE_MEMBERS')
            })
            this.handleDrawerClose('dept');
          }
        })
      }).catch(err => {});
    },
    /** 重置表单
     * @param {Object} obj 表单值
     * @return void
     ** Author: zhongxiaolong
     */
    resetForm(obj){
      Object.keys(obj).forEach(key => {
        // if(key === 'orgListArray') return;
        let type = getType(obj[key]);
        if(type === 'array'){
          obj[key] = [];
        }else if(type === 'string'){
          obj[key] = '';
        }
      })
    },
    /** 提交部门人员信息
     * @param {String} flag 新增/编辑 标识
     * @return void
     ** Author: zhongxiaolong
     */
    handleSubmitMember(flag){
      this.$refs['membersForm'].validate(valid => {
        if(valid){
          if(flag === 0){
            this.loading = true;
          }else if(flag === 1){
            this.loading2 = true;
          }
          let data = {
            ...this.membersData
          }
          // 新增、编辑提交数据
          SERVICES.ORGANIZATIONAL_ROLE.setMemberInfo(data).then(res=> {
            // let data = res.data;
            if(!this.isMemberEdit){ // 新增
              // TODO
            }else{ // 修改
              // TODO
            }
            // 获取人员列表
            this.getDeptMemberList();
            // 获取链 刷新 tree 人员数量
            this.getChainLists(this.deptIds);
            setTimeout(() => {
              if(flag === 0){ // 保存
                this.loading = false;
                // 关闭弹窗
                this.handleDrawerClose('member');
              }else if(flag === 1){ // 保存并继续
                this.loading2 = false;
                // 重置表单数据
                this.resetForm(this.membersData);
                // 设置默认部门或者当前部门
                this.setDefaultDept();
              }
              this.$message({
                message: this.$t('TIPS_WARNING.SAVE_SUCCESS'),
                type: "success"
              })
            }, 500);
          })
        }else{
          return
        }
      })
    },
    /** 删除部门人员
     * 获取部门成员列表
     * 刷新李列表
     * @param {String} id 部门人员id
     * @return void
     ** Author: zhongxiaolong
     */
    delMember(id){
      id = this.membersData.id || id;
      this.$confirm(this.$t('TIPS_WARNING.DELETE_EMP_CONFIRM'),this.$t('TITLE_TEXT.DELETE_EMP'),{
        confirmButtonText: this.$t("BUTTON_TEXT.OK"), // 确认
        cancelButtonText: this.$t("BUTTON_TEXT.CANCEL"), // 取消
        type: 'warning'
      }).then(res => {
        SERVICES.ORGANIZATIONAL_ROLE.delMemberInfo(id).then(res => {
          // 刷新部门下人员列表
          this.getDeptMemberList();
          // 关闭弹窗
          this.handleDrawerClose('member');
          this.getChainLists(this.membersData);
          this.$message({
            type: 'success',
            message: this.$t('TIPS_WARNING.DELETE_SUCCESS')
          })
        })
      }).catch(err => {});
    },
    /** 重置 drawer 状态
     * 恢复编辑状态为 false
     * 恢复部门名称可编辑
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    resetDrawerStatus(){
      this.isDeptEdit = false;
      this.isMemberEdit = false;
      this.orgNameControl = false;
    },
    /** 关闭 drawer 控制
     * 关闭drawer 并重置 drawer 状态
     * @param {String} flag 标识 部门或者人员drawer
     * @return void
     ** Author: zhongxiaolong
     */
    handleDrawerClose(flag){
      if(flag === 'dept'){ // 部门
        this.dialogDept = false;
        this.isDeptEdit = false;
        this.orgNameControl = false;
      }else if(flag === 'member'){ // 人员
        this.dialogMembers = false;
        this.isMemberEdit = false;
      }
    },
    /** 获取组织架构所有 tree 节点
     * @param {Function} callback 回调
     * @return void
     ** Author: zhongxiaolong
     */
    getTreeData(callback){
      const _this = this;
      SERVICES.ORGANIZATIONAL_ROLE.getOrgMenusTree().then(res =>{
        let data = res.data && res.data.data;
        if(data && data.length){
          // TODO
          this.setValue(data);
          // 组织架构 tree
          _this.treeData = data;
          // 当前节点数据对象
          _this.curNodeData = data[0];
          // 设置默认展开节点 根节点
          let rootId = data[0].id
          if(!this.defaultExpandedKeys.includes(rootId)){
            this.defaultExpandedKeys.push(rootId);
          }
          // 重置是否改变上级部门
          this.hasChangeParentId = false;
          // 获取当前节点下的人员列表
          this.getDeptMemberList(data[0].id);
        }
      }).then(()=> {
        if(this.treeData.length){
          // 获取跟节点 node
          let node = this.curNode = _this.$refs['tree'] && _this.$refs['tree'].getNode(_this.treeData[0].id);
          // 展开节点
          // node.expand();
        }
      }).then(()=> {
        if(callback) callback();
      })
    },
    /**  // TODO 后期后台提供接口
     * 递归给 tree node 设置 value
     ** Author: zhongxiaolong
     */
    setValue(data){
      data.forEach(item => {
        item.value = item.id;
        if(item.children && item.children.length){
          this.setValue(item.children)
        }
      });
    },
    /** 获取组织架构 node 节点
     * 
     * @param {String} id 当前部门
     * @return void
     ** Author: zhongxiaolong
     */
    getTreeNode(id = ''){
      const _this = this;
      SERVICES.ORGANIZATIONAL_ROLE.getOrgMenusTreeNode(id).then(res =>{
        let data = res.data && res.data.data;
        if(data && data.length){
          if(id){// 有 id 获取的是子级节点
            // let node = _this.$refs['tree'].getNode(id).data;
            // if(!node.children){
            //   _this.$set(node, 'children', []);
            // }
            // node.children.push(data[0]);
            
            this.resolve(data)
          }else{ // 没有 id 获取的是根节点
            this.treeData = data;
            this.curNodeData = data[0];
            this.getTreeNode(data[0].id);
            this.getDeptMemberList(data[0].id)
            this.defaultExpandedKeys.push(this.treeData[0].id); // 默认展开根节点
          }
        }
      })
    },
    /** 设置部门下级 tree
     * @param {Array} data 当前节点的 children
     * @param {String} id 当前节点的 ID
     * @return void
     ** Author: zhongxiaolong
     */
    setChildren(tree, id, data){
      tree.forEach(node =>{
        if(node.id === id){
          this.$set(node, 'children', data);
          return
        }
        if(node.children && node.children.length){
          this.setChildren(node.children, id, data);
        }
      })
    },
    /**
     * 获取部门下人员列表 
     * 渲染右侧人员列表
     * @param {String} id 部门 id
     * @return void
     ** Author: zhongxiaolong
     */
    getDeptMemberList(id){
      id = id || this.curNode.data.id;
      SERVICES.ORGANIZATIONAL_ROLE.getDeptMemberList(id).then(res =>{
        let data = res.data && res.data.data;
        this.deptMembersData = [];
        if(data.length){
          this.deptMembersData = data;
        }
      })
    },
    /**
     * 获取部门下人员详情
     * 编辑人员渲染数据用
     * @param {String} id 部门 id
     * @return void
     ** Author: zhongxiaolong
     */
    getMemberDetail(id){
      SERVICES.ORGANIZATIONAL_ROLE.getMemberInfo(id).then(res =>{
        let data = res.data && res.data.header;
        if(data != null){
          let { id, name, phone, orgListArray, roleListArray, roleList, orgList, position, email, roleId, jobNumber, ext, office, hiredate, remarks } = data;
          this.membersData = { id, name, phone, orgListArray, orgList, roleListArray, roleList, position, email, roleId, jobNumber, ext, office, hiredate, remarks };
          this.deptIds = {orgList};
          this.handleDeptChange(orgListArray);
          this.handleRoleChange(roleListArray);
        }
      })
    },
    /**
     * 获取面包屑导航节点（部门架构路径）
     * 点击左侧 tree 部门节点
     * 获取当前部门架构路径
     * @param {String} id 当前点击节点 id
     * @return void
     ** Author: zhongxiaolong
     */
    getChainList(id = this.curNode.data.id){
      SERVICES.ORGANIZATIONAL_ROLE.getDeptInfo(id).then(res =>{
        let deptDetail = res.data && res.data.header;
        let data = res.data && res.data.chainList || [];
        if(deptDetail != null){
          this.curNodeData.name = deptDetail.orgName;
          this.deptData.leader = deptDetail.leader;
          this.deptData.leaderName = deptDetail.leaderName;
        }
        if(data.length){
          this.chainList = data;
          this.setMemberCount(data);
        }
      })
    },
    /**
     * 获取更新的节点
     * 当修改部门成员所属部门的时候，同时需要刷新左侧 tree 的人数
     * 接口返回人数变化了的节点
     * @param {String} id 当前点击节点 id
     * @return void
     ** Author: zhongxiaolong
     */
    getChainLists(data){
      let orgIdList = data.orgList;
      let idsArray = [],ids;
      orgIdList.forEach(item => {
        idsArray.push(item.id);
      })
      ids = Array.from(new Set(idsArray)).join(',');
      SERVICES.ORGANIZATIONAL_ROLE.getChainLists(ids).then(res => {
        if(res.data.statusCode === 200 && res.data.data){
          this.setMemberCount(res.data.data);
        }
      })
    },
    /**
     * 刷新左侧 tree 人员数量
     * 新增部门人员后需要刷新 tree 的人员数量
     * @param {Object} data 链数据
     * @return void
     ** Author: zhongxiaolong
     */
    setMemberCount(data){
      const _this = this;
      data.forEach(item => {
        let tree = _this.$refs['tree'];
        let node = tree.getNode(item.id);
        node.data.memberCount = item.memberCount || 0;
      })
    },
    /**
     * 获取部门联级菜单显示drawer
     * 避免重复请求部门数据
     * 通过判断部门是否没有数据或者部门已有数据但是跟新了组织机构购
     * 通过条件就请求跟新部门数据
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    getDeptSelect(){
      if (!this.deptTreeData.length || (this.deptTreeData.length && this.isTreeUpdate)){
        SERVICES.ORGANIZATIONAL_ROLE.getDeptSelect().then(res =>{
          let data = res.data && res.data.data;
          if(data.length){
            // TODO 后台声称无法删除前端不需要字段 由于控件问题 前端需要递归处理二级节点 children 字段问题
            // 保存部门数据
            this.deptTreeData = data;
            this.deptEditTreeData = [];
            data.forEach(item => {
              this.deptEditTreeData.push(item);
            })
          }
          // 获取的部门已和组织架构同步 设置 组织架构树没有跟新
          this.isTreeUpdate = false;
          this.returnDisabled = false;
        })
      }
    },
    /**
     * 获取角色联级菜单显示drawer
     * 避免重复请求部门数据
     * 通过判断部门是否没有数据或者部门已有数据但是跟新了组织机构购
     * 通过条件就请求跟新部门数据
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    getRoleSelect(){
      SERVICES.ORGANIZATIONAL_ROLE.getRoleSelect().then(res =>{
        let data = res.data && res.data.data;
        if(data.length){ 
          data.forEach(item =>{
            item.disabled = true;
            if(item.children){ // 后台声称无法删除前端不需要字段 由于控件问题 前端处理二级节点 children 字段问题,待测大数据是否卡顿
              item.children.forEach(child =>{
                delete child.children
              })
            }
          })
          // 保存角色数据
          this.roleTreeData = data;
        }
      })
    },
    /**
     * drawer初始化
     * 获取可视区域高度
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    drawerInit() {
      this.fullHeight= document.documentElement.clientHeight;//默认值
      const _this = this;
      this.getHeight();
      window.onresize = () => {
        return (() => {
          window.fullHeight = document.documentElement.clientHeight;
          _this.fullHeight = window.fullHeight;
        })()
      }
    },
    /**
     * 获取 drawer 内容高度
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    getHeight() {
      let el = this.$refs['drawer_members'].$refs.drawer.children;
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
     * @return void
     ** Author: zhongxiaolong
     */
    changeFixed(fullHeight){
      this.$refs['drawerContent'].style.height = (fullHeight - this.titleHeight - this.footerHeight - 40)+'px';
    },
    /** table勾选事件 
     * @param {Array} 当前勾选行
     * @return void
     ** Author: zhongxiaolong
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /** 多选控制
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
    /** 部门改变事件 
     * 部门 id 数据转化 后台需要 [{id}]格式
     * @param {String} val
     * @return void
     ** Author: zhongxiaolong
     */
    handleDeptChange(val){
      if(val.length){
        let orgList = this.membersData.orgList = [];
        val.forEach(item => {
          let id = item[item.length - 1];
          // let id = item;
          let data = { id };
          orgList.push(data);
        })
        this.deptIds.orgList = [...this.deptIds.orgList,...orgList];
      }
    },
    /** 上级部门改变事件 
     * 部门 id 数据转化 后台需要 [{id}]格式
     * @param {String} val
     * @return void
     ** Author: zhongxiaolong
     */
    handleDeptEditchange(val){
      this.hasChangeParentId = true;
    },
    /** 上级部门改变事件 
     * 部门 id 数据转化 后台需要 [{id}]格式
     * @param {String} val
     * @return void
     ** Author: zhongxiaolong
     */
    handleDeptEditFocus(data){
      // 新增状态返回节点操作
      if(!this.isDeptEdit) return;
      const _this = this;
      data.forEach(item => {
        item.disabled = false;
        let id = this.curNodeData.id;
        if(id && item.value === id){
          item.disabled = true;
          item.children = null;
          this.returnDisabled = true;
          this.isTreeUpdate = true
          return
        }
        if(!this.returnDisabled && item.children && item.children.length){
          this.handleDeptEditFocus(item.children)
        }
        return
      })
    },
    /** 角色改变事件 
     *  角色 id 数据转化 后台需要 [{id}]格式
     * @param {String} val
     * @return void
     ** Author: zhongxiaolong
     */
    handleRoleChange(val){
      if(val.length){
        let roleList = this.membersData.roleList = [];
        val.forEach(item => {
          let id = item[item.length - 1];
          let data = { id };
          roleList.push(data);
        })
      }
    },
    /**
     * drawer 关闭前事件
     * 恢复 drawer 默认状态
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    handleClose(){
      this.dialogDept = false;
      this.dialogMembers = false;
      this.orgNameControl = false;
      this.isDeptEdit = false;
      this.isMemberEdit = false;
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
        if(this.dialogMembers) {
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
<style lang="scss" scoped>
  @import "@/assets/css/organizationalRole.scss";
  
  .search_list{
    /deep/ .el-collapse-item__header{
      background: transparent;
      padding: 0 10px;
    }
    /deep/ .el-collapse-item__content{
      padding-bottom: 0;
    }
  }
  .search_item{
    padding: 10px 15px;
    font-size: 12px;
    border: 1px solid transparent;
    border-bottom: 1px solid #ebebeb;
    position: relative;
    background: #fff;
    cursor: pointer;
    &:hover{
      background: rgb(244, 246, 248);
    }
  }
</style>
<style>
  .org-drawer .el-drawer__body {
    padding: 20px;
  }
</style>
