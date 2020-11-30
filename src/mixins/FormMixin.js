
const FormMixin = {
  data () {
    return {
      formRules: {},
      fromEventConfig: {},
      formLayout: []
    }
  },
  created () {},
  computed: {
    
  },
  watch: {},
  methods: {
    
    /** 动态表单事件管理
     * @param {String} event 事件名称
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return {Function} 执行事件函数
     ** Author: zhongxiaolong
     */
    handleEvents(event, val, name) {
      const eventControl = {
        input: (val, name) => this.handleInput(val, name),
        change: (val, name) => this.handleChange(val, name),
        blur: (val, name) => this.handleBlur(val, name),
        focus: (val, name) => this.handleFocus(val, name),
        clear: (val, name) => this.handleClear(val, name),
        visibleChange: (val, name) => this.handleVisibleChange(val, name),
        removeTag: (val, name) => this.handleRemoveTag(val, name),
        default: () => { return }
      }
      return (eventControl[event] || eventControl.default)(val, name);
    },
    /** input事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     ** Author: zhongxiaolong
     */
    handleInput(val, name) {
      const inputControl = {

        default: () => { return }
      }
      return (inputControl[name] || inputControl.default)(val);
    },
    /** change 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return {Function} change事件执行函数
     ** Author: zhongxiaolong
     */
    handleChange(val, name) {
      this.isDirty = true;
      const changeControl = {
        processingOrderCode: (val) => this.handleCode(val),
        customerCode: (val) => this.handleCustomerAddress(val),
        default: () => { return }
      }
      return (changeControl[name] || changeControl.default)(val);
    },
    /** blur 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return {Function} blur事件执行函数
     ** Author: zhongxiaolong
     */
    handleBlur(val, name) {
      const blurControl = {
        default: () => { return }
      }
      return (blurControl[name] || blurControl.default)(val);
    },
    /** focus 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     ** Author: zhongxiaolong
     */
    handleFocus(val, name) {
      const focusControl = {

        default: () => { return }
      }
      return (focusControl[name] || focusControl.default)(val);
    },
    /** clear 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     ** Author: zhongxiaolong
     */
    handleClear(val, name) {
      const clearControl = {

        default: () => { return }
      }
      return (clearControl[name] || clearControl.default)(val);
    },
    /** visibleChange 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     ** Author: zhongxiaolong
     */
    handleVisibleChange(val, name) {
      const visibleChangeControl = {

        default: () => { return }
      }
      return (visibleChangeControl[name] || visibleChangeControl.default)(val);
    },
    /** removeTag 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     ** Author: zhongxiaolong
     */
    handleRemoveTag(val, name) {
      const removeTagControl = {

        default: () => { return }
      }
      return (removeTagControl[name] || removeTagControl.default)(val);
    },
    /**
     * 初始化行数据
     * 添加索引 从 1 开始
     * 已实施状态赋值
     * @params {Object} data 行数据
     * @return {Object} data 行数据
     ** Author: zhongxiaolong
     */
    initLineData (data) {
      data.forEach((item,index) =>{
        // 设置索引 从 1 开始
        item.index = index + 1;
        this.$set(item, 'edit', false);
      })
      return data;
    },
    /**
     * 递归自动生成序号 10/20/30....
     * 默认为 10 如果当前行序号有10了 则递增10
     * @param {Number} num 序号
     * @return {Number} number 序号
     ** Author: zhongxiaolong
     */
    createNum (num, step) {;
      let number = num || 1;
      let lineLen = this.mate.mateListLine.rows.length;
      if (this.checkNum(number)){
        number += step || 1;
        number = this.createNum(number, step);
      }
      return number;
    },
    /**
     * 序号检验 
     * 校验是否已经存在当前序号
     * @param {Number} num 序号
     * @param {Number} id 行 id
     * @return {Boolean}  num是否已存在
     ** Author: zhongxiaolong
     */
    checkNum (num, index, id) {
      let serialNumberArr = [];
      let lineListRows = [...this.mate.mateListLine.rows];
      if (index) {
        lineListRows = lineListRows.filter(item => item.index != index);
      }
      if (id) {
        lineListRows = lineListRows.filter(item => item.id != id);
      }
      lineListRows.forEach(item => serialNumberArr.push(item.index));
      return serialNumberArr.indexOf(num) != -1;
    },
  }
}
export default FormMixin;
