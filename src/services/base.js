
import axios from '@/utils/http'; // 导入http中创建的axios实例
import { BASE_API } from './apis';
import { Message, MessageBox } from 'element-ui';

export default{
  // 获取列表页数据
  getMainList: (url,size=10,page=1) => axios.post(`${url}?pageSize=${size}&pageNum=${page}`),
  // 获取dict
  getDict: (dictType) => axios.get(`${BASE_API.GET_DICT}/${dictType}`),
  // 获取库存组织
  getOrgUnit: () => axios.get(`${BASE_API.ORG_UNIT}`),
  // 根据机构 id 获取库存组织 (状态有效)
  getOrgByOfficeId: (id='') => axios.get(`${BASE_API.GET_ORG_BY_OFFICE}${id}`),
  // 获取物料编码 id:库存组织 id; type = "" 成品、半成品和原材料;type = 1 成品和半成品;type = 2 半成品和原材料。
  getMaterialsCode: (id, type="") => axios.get(`${BASE_API.MATERIALS_CODE}/${id}?type=${type}`),
  // 获取BOM物料编码下的行 materialsCode:父物料编码、num:生产数量
  getSubMaterialsLines: (materialsCode, num) => axios.get(`${BASE_API.SUB_MATERIALS_LINES}/${materialsCode}?productCount=${num}`),
  // 获取物料编码
  checkMaterialsCode: () => axios.get(`${BASE_API.MATERIALS_CODE}`),
  // 物料搜索
  searchMaterials: (data) => axios.post(`${BASE_API.MATERIALS_SEARCH}`, data),
  // 物料分类
  getMaterialsCategory: () => axios.get(`${BASE_API.MATERIALS_CATEGORY}?dataOnly=true&nopaging=true`),
  // 检索物料编码是否存在并带出相关信息
  getMaterialsInfo: (val, orgId) => axios.get(`${BASE_API.MATERIALS_INFO_RETRIEVE}/${val}?orgId=${orgId}`),
  // 获取工单分类 orgId:库存组织 id; code: 工单类型
  getTicketClassificationList: (orgId, code) => axios.get(`${BASE_API.TICKET_CLASSIFICATION_LIST}/${orgId}/${code}`),
  // 获取采购人
  getUserList: () => axios.get(`${BASE_API.USERS_PURCHASING_LIST}`),
  // 新增保存
  handleSave: (url, data) => axios.post(`${BASE_API.SAVE}${url}`, data),
  // 查询 拼接 url 模块对应查询api接口
  query: (url, data) => axios.post(`${BASE_API.QUERY}${url}`, data),
  // query: (url, data) => axios.request({
  //   url: `${BASE_API.QUERY}${url}`,
  //   method: 'post',
  //   data: data,
  //   headers:{
  //     'Content-Type':'application/x-www-form-urlencoded'
  //   }
  // }),
  // 分页 拼接 url 模块对应查询api接口
  paging: (url, data) => axios.post(`${BASE_API.PAGING}${url}`, data),
  // 查看详情 获取行数据
  getLines: (url, id) => axios.get(`${BASE_API.LINES}${url}/${id}`),
  // 获取详情 头+行
  getSelectOne: (url, params) => axios({
    url: url,
    mothod: 'get',
    params: params
  }),
  // 查看详情
  getDetail: (url, id) => axios.get(`${BASE_API.DETAIL}${url}/${id}`),
  // 上传附件
  handleUpload: (url, data) => axios.post(`${BASE_API.UPLOAD_SUBMIT}${url}`, data),
  // 获取用户列表
  getUsersList: () => axios.get(`${BASE_API.USERS_LIST}`),
  // 获取客户列表
  getCustomerList: () => axios.get(`${BASE_API.CUSTOMER_LIST}`),
  // 获取已审批、有效的供应商 并且不分页的客户列表
  getCustomerListUsable: () => axios.get(`${BASE_API.CUSTOMER_LIST_USABLE}`),
  // 获取库存组织下仓库列表 id:库存组织 id
  getWarehouseList: (id) => axios.get(`${BASE_API.WAREHOUSE_LIST}/${id}`),
  // 获取仓库下货位列表 id: 仓库 id
  getLocationList: (id) => axios.get(`${BASE_API.LOCATION_LIST}/${id}/locals?cols=id,name&dataOnly=true`),
  // 获取供应商列表
  getSupplierList: () => axios.get(`${BASE_API.SUPPLIER_LIST}`),
  // 获取已审批、有效的供应商 并且不分页的供应商列表
  getSupplierListUsable: () => axios.get(`${BASE_API.SUPPLIER_LIST_USABLE}`),
  /** 下载/导出 Excel模板 /zip
   *  默认导出Excel // TODO 导出类型可扩展
   * url， method, fileName 为必传参数
   * type, data 为非必传参数 （要传 data 必须传 type, data 前面 type参数不能不传）
   * 如果需要导出zip 传参数 'zip' 即可
   * @param {String} url 接口 （必传）
   * @param {String} methods 请求方法（必传）
   * @param {String} fileName 导出文件名字（必传）
   * @param {String} type 导出文件后缀名称 如'zip'，不传默认导出xlsx （非必传）
   * @param {Any} data 请求体 （非必传）
   * @return {Function} 请求接口
   */
  downTemplateExcel: (url, methods = 'POST', fileName, type = 'xlsx', data = '') => {
    let fileType = type === 'zip' ? 'application/zip' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    return axios.request({
      url: url,
      method: methods,
      data: data,
      headers: {
        'Authorization': `Bearer ${window.sessionStorage.getItem('token')}`,
        'Accept': 'application/json',
        'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
        'Content-Type': 'application/json;charset=utf8'
      },
      responseType: 'arraybuffer'
    }).then(res =>{
      var blob = new Blob([res.data], {type: fileType})
      // blob(size,type) Blob构造函数，接受两个参数。第一个参数是一个包含实际数据的数组，第二个参数是数据的类型
      var objectUrl = URL.createObjectURL(blob)
      var a = document.createElement('a')
      a.setAttribute('style', 'display:none')
      a.setAttribute('href', objectUrl)
      a.setAttribute('download', fileName)
      a.setAttribute('id', 'download');
      // 防止反复添加
      if (document.getElementById('download')) {
        document.body.removeChild(document.getElementById('download'));
      }
      document.body.appendChild(a);
      a.click()
      URL.revokeObjectURL(objectUrl)
    })
  },
  /**
   * 导入 Excel
   * @param {String} url 导入api接口
   * @param {String} methods 方法
   * @param {Object} data 导入文件formData
   * @param {Function} callback 回调
   * @return axios.request
   */
  uploadTemplateExcel: (url, methods = 'POST', data, callback) => {
    let fileName = data.get('file').name || '所选文件';
    MessageBox.confirm(`是否确定导入<<${fileName}>>?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: "warning"
    }).then(() => {
      return axios.request({
        url: url,
        method: methods,
        data: data,
        responseType: 'arraybuffer'
      }).then(res =>{
        // 处理二进制数据
        let byteArray = new Uint8Array(res.data);
        let blob = new Blob([byteArray]);
        let reader = new FileReader();
        reader.readAsText(blob);
        reader.onload = function(e){
          // 把数据转化为对象
          let res = JSON.parse(reader.result);
          // 保存列表数据
          let data = res.data;
          // 如果数据异常 提示错误
          if(!data && res.statusCode === 500){
            Message({
              type:'error',
              message: res.message || '数据异常,请检查数据'
            })
            return;
          }
          callback(res);
        }
      })
    }).catch(() => {
      Message({
        type: 'info',
        message: '已取消操作'
      });
      _this.$refs.excelFile.value = '';
    });
  },
  /** 打印功能 PDF
   * @param {String} url 打印地址
   * @param {Object} act 按钮配置信息
   * @return {Function} 打印请求
   */
  handlePrinter: (url, act) => {
    return axios.request({
      url: url,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${window.sessionStorage.getItem('token')}`,
        'Accept': 'application/json',
        'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf8'
      },
      responseType: 'arraybuffer'
    }).then(function (response) {
      var blob = new Blob([response.data], {type: 'application/pdf'})
      var objectUrl = URL.createObjectURL(blob)
      var a = document.createElement('a')
      document.body.appendChild(a)
      a.setAttribute('style', 'display:none')
      a.setAttribute('href', objectUrl)
      var windowOpen = window.open(objectUrl)
      if (windowOpen == null || typeof (windowOpen) === 'undefined') {
        Message({
          message: `${act.modular}预览界面被拦截,请检查浏览器设置`,
          type: 'warning'
        })
      }
    })
  },
  // 获取技术方案编码
  getTechnicalCode: () => axios.get(`${BASE_API.TECHNICAL_CODE}`),
  // 获取省份下拉列表
  getProvinceList: () => axios.get(`${BASE_API.PROVINCE_API}`),
  // 通过省code获取市下拉列表
  getCityList: code => axios.get(`${BASE_API.CITY_API}/${code}`),
  // 通过市code获取区下拉列表
  getRegionList: code => axios.get(`${BASE_API.REGION_API}/${code}`),
  // 通过区code获取街道下拉列表
  getDistrictList: code => axios.get(`${BASE_API.DISTRICT_API}/${code}`),
}
