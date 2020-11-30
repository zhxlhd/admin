
/**
 * 受托加工-交货单服务 .ORGANIZATIONAL_ROLE
 * created by zhongxiaolong on 2019/03/09
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import { BASIC_DATA_API } from '../apis'; // 导入当前模板和公用 API

export default{
  /** 
   * 组织架构 左侧 tree 导航 
   * @param {String} id 点前点击节点 id 根节点为空
  */
  getOrgMenusTreeNode: (id = '') => axios.get(`${BASIC_DATA_API.GET_ORG_MENU_NODE}?parentId=${id}`),
  /** 
   * 组织架构 搜索部门人员 
   * @param {String} key 搜索关键字
  */
  queryOrgMember: (key) => axios.get(`${BASIC_DATA_API.FILTER_ORG_MEMBER}?name=${key}`),
  /** 
   * 组织架构 左侧 tree 导航
  */
  getOrgMenusTree: () => axios.get(`${BASIC_DATA_API.GET_ORG_MENU}`),
  /** 
   * 组织架构 获取部门联级菜单
  */
  getDeptSelect: () => axios.get(`${BASIC_DATA_API.GET_DEPT_SELECT}`),
  /** 
   * 组织架构 获取部门下人员列表
   * @param {String} id 当前部门 id
  */
  getDeptMemberList: (id = '') => axios.get(`${BASIC_DATA_API.GET_MEMBER_LIST}/${id}`),
  /** 
   * 组织架构 批量移除部门人员
   * @param {String} id  人员id
   * @param {String} orgId  部门id
  */
  removeMembers: (id) => axios.get(`${BASIC_DATA_API.REMOVE_MEMBERS}?ids=${id}`),
  /** 
   * 组织架构 保存人员信息
   * @param {String} data 当前人员信息
  */
  setMemberInfo: (data) => axios.post(`${BASIC_DATA_API.SET_MEMBER_INFO}`, data),
  /** 
   * 组织架构 获取人员信息
   * @param {String} id 当前人员 id
  */
  getMemberInfo: (id = '') => axios.get(`${BASIC_DATA_API.GET_MEMBER_INFO}/${id}`),
  /** 
   * 组织架构 获取人数改变的 chainLists
   * @param {String} id 当前人员 id
  */
  getChainLists: (ids) => axios.get(`${BASIC_DATA_API.SET_MEMBER_COUNT}/?ids=${ids}`),
  /** 
   * 组织架构 删除人员
   * @param {String} id 当前人员 id
  */
  delMemberInfo: (id = '') => axios.get(`${BASIC_DATA_API.DEL_MEMBER_INFO}?ids=${id}`),
  /** 
   * 组织架构 获取部门详情
   * @param {String} id 当前部门 id
  */
  getDeptInfo: (id = '') => axios.get(`${BASIC_DATA_API.GET_DEPT_INFO}/${id}`),
  /** 
   * 组织架构 保存部门详情
   * @param {String} data 当前部门信息
  */
  setDeptInfo: (data) => axios.post(`${BASIC_DATA_API.UPDATE_DEPT_INFO}`, data),
  /** 
   * 组织架构 保存部门详情
   * @param {String} id 当前部门 id
  */
  delDeptInfo: (id) => axios.get(`${BASIC_DATA_API.DEL_DEPT_INFO}?ids=${id}`),
  /** 
   * 组织架构 保存部门详情
   * @param void
  */
  getRoleSelect: () => axios.get(`${BASIC_DATA_API.GET_ROLE_LIST}`),
  /** 
   * 架构角色 左侧 tree 导航 
  */
  getRoleTree: (id = '') => axios.get(`${BASIC_DATA_API.GET_ROLE_MENU}`),
  /** 
   * 架构角色 保存角色组（角色组编辑按钮-保存）
   * @param {String} data 当前角色组
  */
  setRoleGroup: (data) => axios.post(`${BASIC_DATA_API.SET_ROLE_GROUP}`, data),
  /** 
   * 架构角色 获取角色组列表（新增角色按钮）
   * @param {String} id 当前角色组 id
  */
  getRoleGroupList: () => axios.get(`${BASIC_DATA_API.GET_ROLE_GROUP_LIST}`),
  /** 
   * 架构角色 获取角色组信息（角色组编辑按钮）
   * @param {String} id 当前角色组 id
  */
  getRoleGroupInfo: (id) => axios.get(`${BASIC_DATA_API.GET_ROLE_GROUP_INFO}/${id}`),
  /** 
   * 架构角色 删除角色组（角色组编辑按钮-删除）
   * @param {String} id 当前角色组 id
  */
  delRoleGroup: (id) => axios.get(`${BASIC_DATA_API.DEL_ROLE_GROUP}/?ids=${id}`),
  /** 
   * 架构角色 保存角色（编辑-保存）
   * @param {String} data 当前角色
  */
  setRole: (data) => axios.post(`${BASIC_DATA_API.SET_ROLE}`, data),
  /** 
   * 架构角色 获取角色信息（）点击角色
   * @param {String} id 当前角色 id
  */
  getRoleInfo: (id) => axios.get(`${BASIC_DATA_API.GET_ROLE_INFO}/${id}`),
  /** 
   * 架构角色 删除角色（编辑-删除）
   * @param {String} id 当前角色 id
  */
  delRole: (id) => axios.get(`${BASIC_DATA_API.DEL_ROLE_INFO}/?ids=${id}`),
  /** 
   * 架构角色 获取角色下成员列表（点击角色）
   * @param {String} id 当前角色 id
  */
  getRoleMemberList: (id) => axios.get(`${BASIC_DATA_API.GET_ROLE_MEMBER_LIST}/${id}`),
  /** 
   * 架构角色 删除角色下成员 (批量删除按钮)
   * @param {String} id 当前角色组 id
  */
  removeRoleMember: (id) => axios.get(`${BASIC_DATA_API.REMOVE_ROLE_MEMBER}/?ids=${id}`),
  /** 
   * 架构角色 获取所有成员列表（添加成员按钮）
   * @param void
  */
  getMemberList: (data) => axios.post(`${BASIC_DATA_API.GET_ROLE_MEMBER}`, data),
  /** 
   * 架构角色 保存新增成员
   * @param void
  */
  setMemberList: (roleId,empIds) => axios.get(`${BASIC_DATA_API.SET_ROLE_MEMBER}?roleId=${roleId}&empIds=${empIds}`),
 /** 
  * 架构角色 树拖拽排序
  * @param {String} startId 被拖拽 id
  * @param {String} endId 拖拽到 id
  * @param {String} dropType 拖拽位置
  * @param {String} type 被拖拽类型
 */
  handleSort: (startId, endId, dropType, type) => axios.get(`${BASIC_DATA_API.TREE_SORT}/?startId=${startId}&endId=${endId}&dropType=${dropType}&type=${type}`),
 }
