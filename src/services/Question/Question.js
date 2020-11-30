
/**
 * 调查问卷 .QUESTION
 * created by zhongxiaolong on 2020/02/02
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import { BASIC_DATA_API } from '../apis'; // 导入当前模板和公用 API

export default{
  // 获取二维码
  getQRCode: () => axios.get('/getQRCode', { responseType: "arraybuffer", }),
  // 获取企业调查问卷列表
  getQuestionList: () => axios.get(''),
  // 获取社区调查问卷列表
  getQuestionCommunityList: () => axios.get(''),
  
 }
