/**
 * 受托加工-技术方案管理 服务
 * created by yxj on 2019/11/13
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import { BE_ENTRUST_PROCESSING_API, BASE_API } from '../apis'; // 导入当前模板和公用 API

export default {
  // 删除
  delete: (ids) => axios.get(`${BE_ENTRUST_PROCESSING_API.TECHNOLOGY_PLAN_MANAGE_DELETE}?ids=${ids}`),
  // 校验技术方案编码是否唯一
  checkCode: code => axios.get(`${BE_ENTRUST_PROCESSING_API.TECHNOLOGY_PLAN_MANAGE_CODE_CHECK}/${code}`),
}
