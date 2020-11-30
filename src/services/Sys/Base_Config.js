import axios from '@/utils/http';
import { SYS_API } from '../apis';

export default{
  // 初始化列表
  initList: () => axios.get(`${SYS_API.BASE_CONFIG_MAIN_LIST}`),
  // 保存
  handleSave: (data) => axios.post(`${SYS_API.BASE_CONFIG_SAVE}`, data),
}
