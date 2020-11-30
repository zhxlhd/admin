
/**
 * 生产管理-生产工单服务 .PRODUCTION_DAILY_SETTLEMENT
 * created by zhongxiaolong on 2019/11/12
 */
import axios from '@/utils/http';                    // 导入http中创建的axios实例
import { PRODUCTION_MANAGEMENT_API } from '../apis'; // 导入当前模板和公用 API

export default{
  /** 获取领料记录
   * @param {String} id 工单行 id
   * @param {String} id 组件编码
   */
  getRecord: (id, code) => axios.get(`${PRODUCTION_MANAGEMENT_API.PRODUCTION_DAILY_SETTLEMENT_RECORD}?workOrderLineId=${id}&componentCode=${code}`),
}
