// 配置生产
module.exports = {
    title: 'wms-admin',
    /**
     * API网关接口地址
     */
    API_GATEWAY: 'https://sccp-api.dianliantech.com',
    /**
     * SEE服务地址
     */
    SSE_SERVER: 'https://sccp-sse.dianliantech.com',
    /**
     * 交易大厅地址
     */
    tradeHallUrl: 'https://sccp-th.dianliantech.com',
    /**
     * 直连开票本地服务地址
     */
    INVOICE_URL: 'http://localhost:8089/soap/Ifwkpjk_W',
    /**
     * OAuth2客户端回调地址
     */
    AUTH_CALLBACK_DOMAIN: 'http://sccp.dianliantech.com',
    /**
     * 金票系统接口地址
     */
    CLCP_URL: 'https://jp.dianliantech.com?on=single',
    /**
     * 点金保理系统接口地址
     */
    DJ_URL:'https://dj.sunwoda.com',
    /**
     * 航信开票本地服务地址
     */
    HX_INVOICE_URL: 'http://127.0.0.1:8888/InvSvr'
  }