// 配置测试
module.exports = {
  title: 'wms-admin',
  /**
   * API网关接口地址
   */
  API_GATEWAY: 'https://wmsapi.sunwoda.com',
  /**
   * SSE服务地址
   */
  SSE_SERVER: 'https://sse.sunwoda.com/',
  /**
   * 交易大厅地址
   */
  tradeHallUrl: 'https://th.sunwoda.com',
  /**
   * 直连开票本地服务地址
   */
  INVOICE_URL: 'http://localhost:8089/soap/Ifwkpjk_W',
  /**
   * OAuth2客户端回调地址
   */
  AUTH_CALLBACK_DOMAIN: 'https://wms.sunwoda.com',
  /**
   * 金票系统接口地址
   */
  CLCP_URL: 'http://172.30.7.18:8077?on=single',
  /**
   * 点金保理系统接口地址
   */
  DJ_URL:'http://172.30.7.20:8380/factor',
  /**
   * 航信开票本地服务地址
   */
  HX_INVOICE_URL: 'http://127.0.0.1:8888/InvSvr'
}