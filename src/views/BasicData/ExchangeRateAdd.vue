<!-- created by hezhiqiang on 2020/02/26-->
<!-- 汇率管理新增 -->
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
import { dateFormatter } from "@/utils/DateUtils"
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
    var validExchangeRate = (rule, value, callback) => {
      if (!value) {
        callback(new Error("此项不能为空"));
      } else if (!this.isInputTrue(value)) {
				callback(new Error("请输入正确的汇率"));
			} else {
				callback();
			}
    };
    return {
      headForm: {},              // 头部表单
      isEdit: false,             // 当前行是否在编辑
      isDirty: false,            // 是否修改了数据
      btnDisable: false,
      actDisable: false,
      headerFormRules: {
				// 本币
				localCurrency: [
					{required: true, trigger: ['blur','change'], message:"此项不能为空"}
				],
				// 外币
				foreignCurrency: [
					{required: true, trigger: ['blur','change'], message:"此项不能为空"}
				],
				// 汇率
				exchangeRate: [
					{required: true, trigger: "blur", validator: validExchangeRate}
				]
      },
      headerFormEventConfig: {
				startDate: { change : true },
        endDate: { change: true },
        localCurrency: { change: true }
      },
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
		// 起始、终止日期默认当天
		let date1 = this.mate.mateFormerHeader.values.startDate  || '';
    this.mate.mateFormerHeader.values.startDate  = date1 || dateFormatter("YYYY-MM-DD HH:mm:ss");
		let date2 = this.mate.mateFormerHeader.values.endDate  || '';
    this.mate.mateFormerHeader.values.endDate  = date2 || dateFormatter("YYYY-MM-DD HH:mm:ss");
    this.getCurrencyData();          // 获取本币
    this.getForeignCurrency();       // 获取外币
  },
  computed: {
    
  },
  methods: {
    /**
     * 校验六位小数点
     */
		isInputTrue(val) {
			if(!/^\d+(\.\d{1,6})?$/.test(val)) {
				return false;
			} else {
				return true;
			}
		},
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
		/** 动态表单事件管理
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
    /** change 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     */
    handleChange(val, name) {
      this.isDirty = true;
      const changeControl = {
        startDate: (val) =>  this.handleStartDateChange(val),
        endDate: (val) => this.handleEndDateChange(val),
        localCurrency: (val) => this.localCurrencyChange(val),
        default: () => { return }
      }
      return (changeControl[name] || changeControl.default)(val);
    },
    /** 起始时间修改
     * @param {String} val 起始时间
     * @return void
     */
    handleStartDateChange(val, name) {
      if (val > this.mate.mateFormerHeader.values.endDate) {
        this.$message({
          type: 'warning',
          message: '起始日期不能大于终止日期，请重新选择'
        })
      }
    },
    /** 终止时间修改
     * @param {String} val 终止时间
     * @return void
     */
    handleEndDateChange(val, name) {
      if (val < this.mate.mateFormerHeader.values.startDate) {
        this.$message({
          type: 'warning',
          message: '终止日期不能小于起始日期，请重新选择'
        })
      } else {
        var startDate = Date.parse(this.mate.mateFormerHeader.values.startDate);
        var endDate = Date.parse(val);
        if ((endDate - startDate)/(1*24*60*60*1000) >= 7) {
          this.$message({
            type: 'warning',
            message: '间隔时间太长，请控制在一星期以内'
          })
        }
      }
    },
    /**
     * 获取本币数据
     * @param void
		 * @return void
     */
    getCurrencyData () {
      SERVICES.RELATED_BASIC.getCurrencyData().then(res => {
        let data = res.data
        if (data.length) {
          let localCurrencyData = []
          data.forEach(item => {
            if ((item.symbol == "")) return;
            localCurrencyData.push({
              'label': item.symbol,
              'value': item.symbol,
              'key': item.id,
            })
          })
          // 本币数据保存到表单配置中
          this.mate.mateFormerHeader.fields.forEach(item =>{
            if (item.name === 'localCurrency') {
              item.options = localCurrencyData
            }
          })
        }
      })
    },
    /**
     * 根据本币数据过滤查询外币数据
     * @param void
		 * @return void
     */
    localCurrencyChange (val) {
      if (val) {
        SERVICES.RELATED_BASIC.getForeignCurrency(val).then(res => {
        let data = res.data
        if (data.length) {
          let foreignCurrencyData = []
          data.forEach(item => {
            if ((item.symbol == "")) return;
            foreignCurrencyData.push({
              'label': item.symbol,
              'value': item.symbol,
              'key': item.id,
            })
          })
          // 本币数据保存到表单配置中
          this.mate.mateFormerHeader.fields.forEach(item =>{
            if (item.name === 'foreignCurrency') {
              item.options = foreignCurrencyData
            }
          })
        }
      })
      }
    },
     /**
     * 获取外币数据
     * @param void
		 * @return void
     */
    getForeignCurrency () {
      SERVICES.RELATED_BASIC.getForeignCurrency(this.mate.mateFormerHeader.values.localCurrency).then(res => {
        let data = res.data
        if (data.length) {
          let foreignCurrencyData = []
          data.forEach(item => {
            if ((item.symbol == "")) return;
            foreignCurrencyData.push({
              'label': item.symbol,
              'value': item.symbol,
              'key': item.id,
            })
          })
          // 本币数据保存到表单配置中
          this.mate.mateFormerHeader.fields.forEach(item =>{
            if (item.name === 'foreignCurrency') {
              item.options = foreignCurrencyData
            }
          })
        }
      })
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
          if (mate.startDate > mate.endDate) {
            this.$message({
              type: 'warning',
              message: '起始日期不能大于终止日期，请重新选择'
            })
            return
          };
          if (mate.endDate >= mate.startDate) {
            var startDate = Date.parse(this.mate.mateFormerHeader.values.startDate);
            var endDate = Date.parse(this.mate.mateFormerHeader.values.endDate);
            if ((endDate - startDate)/(1*24*60*60*1000) >= 7) {
              this.$message({
                type: 'warning',
                message: '间隔时间太长，请控制在一星期以内'
              })
              return;
            }
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
			this.$root.monitor({ url: BASIC_DATA_API.EXCHANGE_RATE_LIST });
		},
	}
};
</script>
