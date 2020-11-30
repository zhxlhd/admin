
/**
 * 智能跟单-跟单列表 服务
 * created by zhongxiaolong on 2019/08/30
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import { SMART_ORDER_API } from '../apis'; // 导入当前模板和公用 API

export default{
  // 返回列表页面
  goBack: () => axios.get(`${SMART_ORDER_API.RECEIVE_TASK_MAIN_LIST}`),
  // 取消任务
  cancelTask: (id) => axios.get(`${SMART_ORDER_API.RECEIVE_TASK_CANCEL}/${id}`),
  // 接收任务
  acceptlTask: (id) => axios.get(`${SMART_ORDER_API.RECEIVE_TASK_ACCEPT}/${id}`),
  // 分配任务
  distributeTask: (id, chargeId, chargeName) => axios.get(`${SMART_ORDER_API.RECEIVE_TASK_DISTRIBUTTION}/${id}?chargeId=${chargeId}&chargeName=${chargeName}`),
}