/**
 * 合同管理 服务
 * created by yxj on 2020/01/06
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import {CONTRACT_MANAGE_API} from '../apis'; // 导入当前模板和公用 API

export default {
  // 附件弹窗 上传附件
  uploadAttachMent: (data) => axios.post(`${CONTRACT_MANAGE_API.CONTRACT_MANAGE_ATTACHMENT_UPLOAD}`,data),
  // 附件弹窗 删除附件
  deleteAttachMent: (id) => axios.get(`${CONTRACT_MANAGE_API.CONTRACT_MANAGE_ATTACHMENT_DELETE}/${id}`),

  /*
    基础数据-合同类型
   */
  // 校验合同类型编码是否唯一
  checkContractTypeCode: code => axios.get(`${CONTRACT_MANAGE_API.CONTRACT_TYPE_CHECK_CODE}/${code}`),
  // 删除合同类型编码（单个删除）
  deleteContractType: (id) => axios.get(`${CONTRACT_MANAGE_API.CONTRACT_TYPE_DELETE}/${id}`),
  // 失效合同（单个失效）
  loseContractEfficacy: (id) => axios.get(`${CONTRACT_MANAGE_API.CONTRACT_TYPE_LOSE_EFFICACY}/${id}/0`),

  /**
   * 基础数据-项目管理
   */
  // 校验项目编码是否唯一
  checkProjectCode: code => axios.get(`${CONTRACT_MANAGE_API.PROJECT_MANAGE_CHECK_CODE}/${code}`),
  //删除项目（单个删除）
  deleteProject: (id) => axios.get(`${CONTRACT_MANAGE_API.PROJECT_MANAGE_DELETE}/${id}`),

  /**
   * 合同管理-合同模板起草
   */
  // 获取合同类型下拉
  getContractTypeList: code => axios.get(`${CONTRACT_MANAGE_API.CONTRACT_TEMPLATE_DRAFT_TYPE_LIST}`),
  // 校验合同模板编码是否唯一
  checkContractTemplateCode: code => axios.get(`${CONTRACT_MANAGE_API.CONTRACT_TEMPLATE_DRAFT_CHECK_CODE}/${code}`),
  // 附件弹窗 获取附件列表list
  getAttachMentListWithContractTemplateDraft: (id) => axios.get(`${CONTRACT_MANAGE_API.CONTRACT_TEMPLATE_DRAFT_ATTACHMENT_LIST}/${id}`),
  //删除（单个删除）
  deleteContractTemplate: (id) => axios.get(`${CONTRACT_MANAGE_API.CONTRACT_TEMPLATE_DRAFT_DELETE}/${id}`),
  //提交审批
  approveWithContractTemplate: (data) => axios.post(`${CONTRACT_MANAGE_API.CONTRACT_TEMPLATE_DRAFT_APPROVE}`,data),

  /**
   * 合同管理-合同模板审批
   */
  // 获取行的审批记录
  getLines: (busId, busType) => axios.get(`${CONTRACT_MANAGE_API.CONTRACT_TEMPLATE_RECORD_LIST}/${busType}/${busId}`),

  /**
   * 合同管理-合同起草
   */
  // 校验合同模板编码是否唯一
  checkContractCode: code => axios.get(`${CONTRACT_MANAGE_API.CONTRACT_DRAFT_CHECK_CODE}/${code}`),
  // 获取项目下拉列表
  getProjectList: () => axios.get(`${CONTRACT_MANAGE_API.CONTRACT_DRAFT_PROJECT_LIST}`),
  //删除（单个删除）
  deleteContract: (id) => axios.get(`${CONTRACT_MANAGE_API.CONTRACT_DRAFT_DELETE}/${id}`),
  //提交审批
  approveWithContract: (data) => axios.post(`${CONTRACT_MANAGE_API.CONTRACT_DRAFT_APPROVE}`,data),
  // 附件弹窗 获取附件列表list
  getAttachMentListWithContractDraft: (id) => axios.get(`${CONTRACT_MANAGE_API.CONTRACT_DRAFT_ATTACHMENT_LIST}/${id}`),

  /**
   * 合同管理-合同变更申请
   */
   // 批量删除
   deleteContractChange: (ids) => axios.get(`${CONTRACT_MANAGE_API.CONTRACT_CHANGE_APPLY_DELETE}?ids=${ids}`),
   // 附件弹窗 获取附件列表list
  getContractChangeAttachMentList: (id) => axios.get(`${CONTRACT_MANAGE_API.CONTRACT_CHANGE_APPLY_ATTACHMENT_LIST}/${id}`),
  // 根据合同编号获取合同数据
  fetchContractData: (code)=> axios.get(`${CONTRACT_MANAGE_API.FETCH_CONTRACT_DATA}?code=${code}`),
  // 提交审批
  submitApproval: (id) => axios.put(`${CONTRACT_MANAGE_API.CONTRACT_CHANGE_SUBMIT_APPROVAL}/${id}`),

  /**
   * 合同管理-合同变更审批
   */
  // 合同变更审批
  contractChangeApproval: (data) => axios.post(`${CONTRACT_MANAGE_API.CONTRACT_CHANGE_APPROVAL}`,data),

  /**
   * 合同管理-合同签订
   */
  // 合同 归档/取消归档
  archivedContract: (id, isArchived) => axios.get(`${CONTRACT_MANAGE_API.CONTRACT_ARCHIVED_ARCHIVED}/${id}/${isArchived}`),
}
