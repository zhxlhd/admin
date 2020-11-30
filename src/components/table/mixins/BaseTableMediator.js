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
 * created by zhongxiaolong on 2020/04/26
 */
import ColumnFormatterMixin from '@/mixins/ColumnFormatterMixin';
import FilterMixins from '@/mixins/FilterMixins';

export default {
  mixins: [ColumnFormatterMixin, FilterMixins],
  props:{
    loading: { 
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      onlyHeaderWidth: false, // 是否只计算列头标题文字的宽度
      row: {},                // 行数据
      multipleSelection: [],  // 勾选项列表
      hasSelected: false,     // 是否勾选
      sortValues: {},         // 排序数据
    }
  },
  computed: {
    /** 计算列表操作列的宽度
     * 根据配置的 actions 的 label 长度来计算
     */
    actWidth: function() {
      // 保存 actions (按钮配置信息：按钮数据)
      let actions = this.mateList.actions || [];
      // length 是按钮的个数
      let length = actions.length;
      // 操作列默认宽度,如果按钮个数大于1就是30,否则20
      let width = length > 1 ? 30 : 20;
      // 如果配置了按钮计算宽度
      if(length) {
        // 遍历按钮数组
        actions.forEach(act =>{
          if(act.type === 'text'){
            width += (act.label.length) * 13;
            if(act.icon){
              width += 12;
            }
          }else if(act.icon && this.word){// 如果配置了按钮的 icon ,(如果列操作按钮配置了 icon, 只显示 icon, 不显示 label)
            // 计算 icon和文字 按钮的宽度
            width += ((act.label.length) * 12 + 32 + 12);
          }else if(act.icon){
            // 计算 icon 按钮的宽度
            width += (12 + 32);
          }else{
            // 计算文字按钮的宽度
            width += ((act.label.length) * 12 + 32);
          }
        })
        // 如果按钮数大于2
        if(length > 2){
          // 计算额外10宽度
          width += (length - 2) * 10;
        }
      }
      // 返回宽度 (this.actionWidth 是父组件传进来的 如果没有就返回自动计算的宽度)
      return width;
    }
  },
  methods: {
    /**
     * 数据初始化
     * @param void
     * @return void
     */
    init(mate) {
      if (Object.keys(this.mateList).length){
        this.columns = this.mateList.columns || [];
        this.formatterBefore(this.columns);
        this.filterValues(this.columns);
        this.setColWidth(mate);
      }
    },
    /** 
    * 列表行操作按钮点击事件
    * @param {Object} act 按钮配置信息
    * @param {Object} row 当前行数据
    * @return void
    */
   handleActions(act, row) {
     // 保存行数据
     this.row = row;
     let action = act.action;
     const actions = {
       // 默认
       default: (act, row) => this.$parent.handleActions(act, row)
     }
     return (actions[action] || actions.default)(act, row);
   },
    /**
     * 点击列表行触发事件 
     * 用于上下双 Table 的场景 上面是“列表” 下面是“明细行列表” 
     * 点击“列表”中的行请求明细行数据
     * mongodb 只有列表页数据配置字段 "rowClick" true/false 才有效果
     * mongodb 字段"url" 是请求明细行的接口配置 需要配置上
     * @param {Object} row 当前行数据
     * @return void
     */
    rowClick(row) {
      if (this.mateList.rowClick) this.$emit("rowClick", row);
      if (this.rowClickSelected){
        // 清空选择 
        this.$refs['table'].clearSelection();
        // 选中当前点击行 
        this.$refs['table'].toggleRowSelection(row);
      }
    },
    /**
     * 双击列表行触发事件 
     * @param {Object} row 当前行数据
     * @return void
     */
    rowDblclick(row) {
      this.$emit("rowDblclick", row);
    },
    /**
     * table表格中勾选的选项，val是勾选的对象
     * @param {Array} val 勾选行数据
     * @return void
     */
    handleSelectionChange(val) {
      // 把勾选行保存在 multipleSelection 中;
      this.multipleSelection = val;
    },
    /**
     * 排序
     * @param {Object} sort 需要排序的列的信息
     * @return void
     */
    sortChange(sort) {
      if (!this.toSort) {
        if (!sort || !sort.column || !sort.column.sortable) {
          return;
        }
        this.sortValues = {
          order: sort.order,
          column: sort.prop
        };
        // this.getData("sort");
        this.$emit("sort", this.sortValues);
      }
    },
    /**
     * 根据列的 label 或者内容设置列的宽度
     */
    setColWidth(mate){
      const _this = this;
      mate.columns = mate.columns.map((value) => {
        let sortBtnWidth = 0;
        if(value.sortable) sortBtnWidth = 20;
        let arr = [];
        if(!_this.onlyHeaderWidth && mate['rows']){
          arr = value.filter ? _this.convertLable(value.filter, mate['rows'].map(x => x[value.name])) : mate['rows'].map(x => x[value.name]); // 获取每一列的所有数据
        }
        let label = value.label;
        if(value.i18n){
          label = this.$t(value.i18n);
        }
        arr.push(label); // 把每列的表头也加进去算
        // 计算列表列头标题的宽度
        let headerLabelWidth = _this.getMaxLength([label]); 
        // 每列内容最大的宽度
        let maxLength = _this.getMaxLength(arr);
        // 如果列最大宽度大于列头文字宽度超过10,设置排序按钮宽度为0
        if(maxLength - headerLabelWidth > 20) sortBtnWidth = 0;
         // 每列内容最大的宽度 + 表格的内间距(依据实际情况而定)
        value.width = maxLength + 20 + sortBtnWidth;
        return value;
      })
    },
    /**
     * 遍历列的所有内容，获取最宽一列的宽度
     * @param {Array} arr
     */
    getMaxLength (arr) {
      return arr.reduce((acc, item) => {
        if (item) {
          let calcLen = this.getTextWidth(item);
          acc = acc < calcLen ? calcLen < 280 ? calcLen : 280 : acc;
        }
        return acc;
      }, 0)
    },
    /**
     * 使用span标签包裹内容，然后计算span的宽度 width： px
     * @param {Array} valArr
     * @return width 宽度
     */
    getTextWidth(str) {
      let width = 0;
      let html = document.createElement('span');
      html.innerText = str;
      html.className = 'getTextWidth';
      html.setAttribute('style', "font-size: 14px;");
      document.querySelector('body').appendChild(html);
      width = document.querySelector('.getTextWidth').offsetWidth;
      document.querySelector('.getTextWidth').remove();
      return width;
    },
    /**
     * label转换 配置了 filter 的列转换 label 为需要的值
     * @param {Array} arr 
     * @return arr
     */
    convertLable(filter, arr){
      const newArr = [];
      const _this = this;
      arr.forEach(item =>{
        let newItem = _this[filter]([],[],item);
        newArr.push(newItem);
      })
      return newArr
    },
    /**
     * 绑定是否有勾选事件
     * 事件：{String} isSelected
     * 是否有勾选：{Boolean} this.hasSelected 
     * 勾选项：{Array} this.multipleSelection
     * @param void
     * @return void
     */
    handleSelected() {
      this.$emit("isSelected", this.hasSelected, this.multipleSelection);
    },
    /**
     * 行勾选
     * 可以配置默认勾选行
     * @param void
     * @return void
     */
    rowSelect() {
      // 列表行数据
      let rows = this.mateList && this.mateList.rows;
      // 勾选行配置
      let selected = this.mateList && this.mateList.selected;
      if (rows && rows.length) {
        // 遍历行是否勾选
        rows.forEach(row => {
          let select = row.id && selected && selected.findIndex(id => id == row.id) !== -1;
          this.$refs.table.toggleRowSelection(row, select === true);
        });
      }
    },
  },
  watch: {
    /**
     * 监控表格的数据data，自动设置表格宽度
     * @param valArr
     */
    mateList: {
      handler(newMate, oldMate) {
        this.init(newMate);
        this.$nextTick(function() {
          this.rowSelect();
        });
      },
      immediate: true
    },
    loading(val) {
      this.listLoading = val;
    },
    multipleSelection(newSelection) {
      this.hasSelected = newSelection && newSelection.length !== 0;
      this.handleSelected();
    }
  },
}
