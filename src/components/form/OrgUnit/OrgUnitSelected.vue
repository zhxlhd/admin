<!-- created by zhongxiaolong on 2019/10/10 -->
<!-- 库存组织 OrgUnitSelected -->
<template>
  <el-select v-model="value"
    :size="size"
    :disabled="disabled"
    :placeholder="placeholder"
    :filterable="filterable"
    :clearable="clearable"
    :multiple="multiple"
    @change="handleChange"
  >
    <el-option v-for="(item, index) in options" :key="index" :label="item.label" :value="item.value"></el-option>
  </el-select>
</template>

<script>
import SERVICES from '@/services'

export default {
  props: {
    mate: Object,
    initValue: [String, Number], // 默认值
    placeholder: {
      type: String,
      default: "请选择库存组织"
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    // 控件禁用
    disabled: {
      type: [Boolean],
      default: false
    },
    // 是否支持过滤
    filterable: Boolean,
    // 控件尺寸
    size: {
      type: String,
      default: 'mini'
    }
  },
  data() {
    return {
      value: "",
      options: []
    };
  },
  created() {
    this.init();
  },
  methods: {
    /** 控件数据初始化
     * 获取库存组织列表
     * @param void
     * @return void
     */
    init() {
      this.value = this.initValue;
      this.getOrgUnit();
    },
    /**
     * 获取库存组织 并保存到 options
     * @param void
     * @return void
     */
    getOrgUnit () {
      SERVICES.BASE.getOrgUnit().then((res) =>{
        let data = res.data;
        if (data.length){
          data.forEach(item => {
            this.options.push({
              label: item.name,
              value: item.id,
              id: item.id
            })
          });
        }else{
          this.$notify.info({
            title: '消息',
            message: '尚未配置库存组织，请联系管理员'
          });
        }
      }).catch({

      })
    },
    handleChange(val) {
      if (!val) return;
      let orgName = this.options.find(item => item.value == val).label;
      this.mate.values["orgName"] = orgName;
      this.$emit("events", "change", this.value, "orgId");
    }
  },
  // 这是将数据传到组件，在修改之时，将其显示在页面上
  watch: {
    initValue: function(val, oldVal) {
      this.value = val;
    }
  },
};
</script>
