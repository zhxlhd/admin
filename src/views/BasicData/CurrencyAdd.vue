<!-- created by hezhiqiang on 2020/02/25-->
<!-- 币种管理新增 -->
<template>
  <div>
    <!-- 头部button Start-->
    <h-btn @click="handleBtns" :btns="['提交','取消','重置']"></h-btn>
    <!-- 头部button End-->
    <!-- 表单Form Start-->
    <dynamic-form
      ref="headForm"
      :mate="mate.mateFormerHeader"
      :rules="headerFormRules"
      :eventCfg="headerFormEventConfig"
      @events="handleEvents"
      @isDirty="dirtyChange"
    />
    <!-- 表单Form End-->
  </div>
</template>

<script>
import SERVICES from "@/services"
import { BASIC_DATA_API } from "@/services/apis"

export default {
  components: {
    HBtn: function index(resolve){
      require(["@/components/Button/HBtn.vue"], resolve);
    },
    DynamicForm: function index(resolve){
      require(["@/components/form/DynamicForm.vue"], resolve);
    }
  },
  props: {
    mate: Object
  },
  data() {
    return {
      headForm: {},              // 头部表单
      isEdit: false,             // 当前行是否在编辑
      isDirty: false,            // 是否修改了数据
      btnDisable: false,
      actDisable: false,
      headerFormRules: {
				// 代码
				currencyCode: [
					{required: true, trigger: "blur", message:"此项不能为空"}
				],
				// 名称
				name: [
					{required: true, trigger: "blur", message:"此项不能为空"}
				],
				// 所在地区
				minimumAccountable: [
					{required: true, trigger: 'blur', message:"此项不能为空"}
        ],
        // 符号
        symbol: [
					{required: true, trigger: 'blur', message:"此项不能为空"}
        ],
      },
      headerFormEventConfig: {
        startDateActive: {change: true},
        endDateActive: {change: true}
      }
    };
  },
  created() {
    let mate = this.mate;
    mate.mateFormerHeader.fields.map((item) => { this.headForm[item.name] = item; });
    // 修改
		let mateData = mate.mateData;
		if (mateData && mateData.id && mateData.id !== '') {
			mate.mateFormerHeader.values = mateData;
		}
  },
  mounted() {
  },
  methods: {
  /** 头部按钮事件
   * @param {String} name 按钮名称
   * @return {Function} 按钮事件
   */
  handleBtns(name) {
    const btnEvents = {
      // 提交按钮
      submit: () => this.handleSubmit(),
      // 提交按钮
      save: () => this.handleSave(),
      // 取消按钮
      cancel: () => this.backward(),
      // 重置按钮
      reset: () => this.handleReset(),
      // 默认
      default: () => { return }
    }
    return (btnEvents[name] || btnEvents.default)();
  },
  /**
   * 动态表单事件管理
   * @param {String} event 事件名称
   * @param {Any} val 控件的值
   * @param {String} name 控件的 name
   * @return void
   */
  handleEvents(event, val, name) {
    const eventControl = {
      change: (val, name) => this.handleChange(val, name),
      default: () => { return }
    }
    return (eventControl[event] || eventControl.default)(val, name);
  },
  /**
   * change 事件
   * @param {Any} val 控件的值
   * @param {String} name 控件的 name
   * @return void
   */
  handleChange(val, name) {
    this.isDirty = true;
    const changeControl = {
      startDateActive: (val) => this.startDateActiveChange(val),
      endDateActive: (val) => this.endDateActiveChange(val),
      default: () => { return }
    }
    return (changeControl[name] || changeControl.default)(val)
  },
  /** 有效日期从修改
     * @param {String} val 起始时间
     * @return void
     */
    startDateActiveChange(val, name) {
      console.log(val)
      if (val > this.mate.mateFormerHeader.values.endDateActive) {
        this.$message({
          type: 'warning',
          message: '有效日期从不能大于有效日期至，请重新选择'
        })
        this.$set(this.mate.mateFormerHeader.values, 'startDateActive', '')
      }
    },
    /** 有效日期至修改
     * @param {String} val 终止时间
     * @return void
     */
    endDateActiveChange(val, name) {
      if (val < this.mate.mateFormerHeader.values.startDateActive) {
        this.$message({
          type: 'warning',
          message: '有效日期至不能小于有效日期从，请重新选择'
        })
        this.$set(this.mate.mateFormerHeader.values, 'endDateActive', '')
      }
    },
    /**
     * 提交表单数据
     * @param void
     * @return void
     */
    handleSubmit() {
      let mate = {};
      let _this = this;
      let [url,next] = [this.mate.mateFormerHeader.url,this.mate.mateFormerHeader.next];
      this.$refs['headForm'].$refs['form'].validate(valid => {
        if (valid) {
          mate = this.mate.mateFormerHeader.values;
          SERVICES.BASE.handleSave(url, mate).then((res) =>{
          let status = res.status;
            if(status === 200){
              _this.$root.monitor({url: next});
            }else{
              _this.$message({
                  type: "warning",
                  message: this.$t("TIPS_WARNING.ADD_FAIL")
              });
            }
          }).catch(function (err) {
          });
        };
      });
    },
    /**
     * 取消返回 List页面
     * @param void
     * @return void
     */
    backward() {
      if(this.isEdit){
        this.$confirm("数据未提交,是否离开当前页面?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.backToList();
        }).catch(() => {
          this.$message({
            type: "info",
            message: "取消离开"
          });
        });
      }else{
        this.backToList();
      }
    },
    handleReset() {
      this.$refs['headForm'].$refs["form"].resetFields();
    },
    dirtyChange(bool) {
      this.isDirty = bool;
    },

    /**
     * 刷新tab页签
     * @param void
     * @return void
     */
    backToList () {
      this.$root.monitor({ url: BASIC_DATA_API.CURRENCY_MANAGEMENT_LIST });
    },
  }
};
</script>
