import axios from '@/utils/http';
import { BOM_API } from '../apis';

export default{
  bomDetail: (id) => axios.get(`${BOM_API.BOM_DETAIL}/${id}`), //  查询 bom 详情
  checkBom: (code) => axios.get(`${BOM_API.CHECK_MATERIALS}/${code}`), //  检查Bom是否存在
}
