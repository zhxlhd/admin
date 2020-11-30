/***
 * ░░░░░░░░░░░░░░░░░░░░░░░░▄░░
 * ░░░░░░░░░▐█░░░░░░░░░░░▄▀▒▌░
 * ░░░░░░░░▐▀▒█░░░░░░░░▄▀▒▒▒▐
 * ░░░░░░░▐▄▀▒▒▀▀▀▀▄▄▄▀▒▒▒▒▒▐
 * ░░░░░▄▄▀▒░▒▒▒▒▒▒▒▒▒█▒▒▄█▒▐
 * ░░░▄▀▒▒▒░░░▒▒▒░░░▒▒▒▀██▀▒▌
 * ░░▐▒▒▒▄▄▒▒▒▒░░░▒▒▒▒▒▒▒▀▄▒▒
 * ░░▌░░▌█▀▒▒▒▒▒▄▀█▄▒▒▒▒▒▒▒█▒▐
 * ░▐░░░▒▒▒▒▒▒▒▒▌██▀▒▒░░░▒▒▒▀▄
 * ░▌░▒▄██▄▒▒▒▒▒▒▒▒▒░░░░░░▒▒▒▒
 * ▀▒▀▐▄█▄█▌▄░▀▒▒░░░░░░░░░░▒▒▒
 * created by zhongxiaolong on 2020/05/20
 */
import SERVICES from '@/services';

const ListMixin = {
  data () {
    return {
      isNeedPage: true,       // 请求列表数据是否需要分页
      pageNum: 1,             // 默认第几页
      pageSize: 10,           // 默认每页条数/查询默认每页条数
      pid: '',                // 父级 id
      formRules: {},          // 列表弹窗新增配置表单控件规则
      fromEventConfig: {},    // 列表弹窗新增配置表单控件事件
      formLayout: [],         // 列表弹窗新增配置表单控件布局
    }
  },
  created () {},
  computed: {
    
  },
  watch: {},
  methods: {
    /** 获取列表数据
     * @param void
     * @return void
     ** Author: zhongxiaolong
     */
    loadData() {
      const { url, mate, pageNum, pageSize, isNeedPage } = this;
      postAction(url.list, { isNeedPage, pageNum, pageSize }).then( res =>{
        if (res.status === 200 && !!res.data) {
          const data = res.data.data; //! TODO 注意返回层级关系
          let { total, ...resData } = data;
          let rows = data.list;
          let page = data.pageNum;
          let size = data.size;
          mate.mateList = { ...mate.mateList, size, page, total, rows };
        }
      })
    },
  },
  /**
   * 数据转换
   * 后台返回数据结构不统一做数据转换处理
   * @param {Object} data 数据
   * @return void
   ** Author: zhongxiaolong
   */
  convertData(data) {
    let { pageSize, total, pageNum, list, ...resData } = data.data
    let rows = list;
    let page = pageNum;
    let size = pageSize;
    this.mate.mateList = { ...this.mate.mateList, size, page, total, rows };
  },
  /**
   * 请求当前操作行的查看详情中的列表行数据
   * 获取数据后渲染详情列表行
   * @param {Object} row 当前操作行的行数据
   * @param {Object} act 按钮配置信息
   * @return void
   */
  handleRowClick (row, act) {
    this.rowStatus = row.status;
    let id = row.id;
    // 获取行数据
    this.getLines(id);
    // this.lineTableFlag = true;
  },
  /** 获取行数据 
   * @param {String} id 列表行 id
   * @return void
   */
  getLines (id) {
    let url = this.mate.mateList.url;
    this.pid = id;
    SERVICES.BASE.getSelectOne(url, {id}).then(res =>{
      let data = res.data.lineList;
      if (data && data.length){
        this.$set(this.mate.mateList, "lineRows", data);
        if (this.mate.mateList.rowClick) {
          // 显示 行Table
          this.lineTableFlag = true;
          // 刷新数据
          this.mate.mateListLine.rows = data;
        }
      }
    })
  },
};
export default ListMixin;
