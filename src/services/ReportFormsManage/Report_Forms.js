
/**
 * 报表管理-采购报表、销售报表、库存报表 服务
 * created by yxj on 2019/10/09
 */
import axios from '@/utils/http'; // 导入http中创建的axios实例
import {REPORT_FORMS_MANAGE_API} from '../apis'; // 导入当前模板和公用 API

export default{
  // 导出报表
  downReportExcel: (url, methods,params) => {
    return axios.request({
      url: url,
      data:params,
      method: methods,
      headers: {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
        'Accept': 'application/json',
        'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
        'Content-Type': 'application/json;charset=utf8'
      },
      responseType: 'arraybuffer'
    });
  },
  // 供应商代码
  getSupplierCode: () => axios.get(`${REPORT_FORMS_MANAGE_API.SUPPLIER_CODE}`),
}