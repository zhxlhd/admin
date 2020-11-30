<!-- created by hezhiqiang on 2020/02/24-->
<!-- 销售订单分类新增 -->
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
				// 订单分类编码
				// categoryCode: [
				// 	{required: true, trigger: "blur", message:"此项不能为空"}
				// ],
				// 订单分类名称
				categoryName: [
					{required: true, trigger: "blur", message:"此项不能为空"}
				],
				// 是否有效
				enabledFlag: [
					{required: true, trigger: ['blur','change'], message:"此项不能为空"}
				]
      },
      headerFormEventConfig: {
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
   * 取消返回Ecn List页面
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
    this.$root.monitor({ url: BASIC_DATA_API.SALE_ORDER_CATEGORY_LIST });
  },
}
};
</script>
