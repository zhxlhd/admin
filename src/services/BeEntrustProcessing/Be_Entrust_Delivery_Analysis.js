/**
 * 受托加工-交货数据统计服务 .BE_ENTRUST_DELIVERY_ANALYSIS
 * created by yxj on 2019/10/15
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import {BE_ENTRUST_PROCESSING_API, ENTRUST_PROCESSING_API} from '../apis'; // 导入当前模板和公用 API

export default {
  // 获取数据统计
  getList: (url) => axios.get(url),
}
