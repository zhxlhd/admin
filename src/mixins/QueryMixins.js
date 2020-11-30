/**
 * 本地配置查询条件 引入文件
 */
const QueryMixin = {
  props: {
    mate: Object
  },
  data () {
    return {
      pageSize: 5,                      // 每页条数
      page: 1,                          // 第几页
      searchValues: {},                 // 查询字段数据
      allowSearch: false,               // 是否查询
      changePage: false,                // 是否分页
      showAdvancedSearchPopover: false, // 查询模块是否显示
      queryObject: {
        multipleConditions: false,      // 是否读取本地的多条件查询配置
        fields: [],                     // 本地查询字段配置
        values:{}                       // 本地查询字段的值配置
      }
    }
  },
  created () {
    this.__init();
  },
  computed: {
    
  },
  watch: {
    mate (newMate) {
      // 当tab已存在 再点击左侧导航 需要重新初始化查询字段
      this.__init();
    }
  },
  methods: {
    /**
     * 数据初始化
     * @param void
     * @return void 
     */
    __init() {
      if (this.mate.mateSearch && this.mate.mateSearch.multipleConditions != true) {
        this._queryInit();
      }
    },
    /**
     * 本地配置查询字段初始化
     */
    _queryInit () {
      // 是否读取本地的多条件查询配置
      if (this.queryObject.multipleConditions===true){
        // 初始化状态下拉
        this.queryObject.fields.forEach(item=>{
          if(item.name==='statusStr'){
            item.options = this.stateOptions;
          }
        })
        this.mate.mateSearch.fields = this.queryObject.fields;
        this.mate.mateSearch.multipleConditions = this.queryObject.multipleConditions;
        this.mate.mateSearch.values = this.queryObject.values;
      }else{
        this.titleOptions = this.mate.mateSearch.fields[0].options;
        this.operatorOptions = this.mate.mateSearch.fields[1].options;
      }
      this.mate.mateSearch.fields.map(item => {
        this.object[item.name] = item;
      });
    },
    /**
     * 查询字段数据 和 查询、分页状态
     * 如果父级需要处理查询字段 emit 发射给父级
     * 设置当前查询状态 是否是查询 是否是分页 是否是查询后分页
     * @param {Object} data 查询字段数据
     * @param {Object} obj 查询、分页状态
     * @return void
     */
    queryData (data, obj, loading) {
      // 是否loading动画
      if(loading) this.listLoading = true;
      // 查询字段和值
      this.searchValues = data;
      // 设置分页器 size, 查询 默认第一页10条数据
      this.pageSize = data.pageSize || this.mate.mateList.size || 10;
      // 如果有查询字段 发送事件保存查询字段和值
      if(Object.keys(this.searchValues).length) this.$emit('searchValues', this.searchValues);
      // 获取当前操作的值
      this.allowSearch = (obj && obj.has('this.allowSearch')) ? obj.get('this.allowSearch'):this.allowSearch;
      this.changePage = (obj && obj.has('this.changePage')) ? obj.get('this.changePage'):this.changePage;
    },
    /**
     * 控制查询组件的显示和隐藏
     */
    showSearchPopover() {
      this.showAdvancedSearchPopover = !this.showAdvancedSearchPopover;
    },
    /**
    * 分页器控制 每页行数、第几页
    * @param {Object} pager 分页信息 size:每页行数、page: 第几页
    * @param {Boolean} changePage 是否点击第几页
    * @return void
    */
    handlePagination (pager, change) {
      this.pageSize = pager.size;
      this.page = pager.page;
      this.changePage = change;
      this.getData('paging');
    },
  }
}
export default QueryMixin;
