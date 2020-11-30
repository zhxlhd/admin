<template>
  <el-select
    :size="size"
    :clearable="clearable"
    :disabled="Boolean(rowId)"
    v-model="value"
    :placeholder="placeholder"
    :multiple="multiple"
    @change="handlerChange"
    :filterable="filterable"
    :allow-create="allowCreate"
  >
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" :disabled="!Boolean(Number(item.editable))"></el-option>
  </el-select>
</template>

<script>
import DictStore from '@/store/dict-store';
import SERVICES from '@/services'

export default {
  props: {
    initValue: [String, Number], // 默认值：取是数字词典配置的 value值，可以在mongodb配置，也可以在本地配置
    dictType: [String],
    placeholder: {
      type: String,
      default: "请选择"
    },
    multiple: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    rowId: {
      type: [String, Number,Boolean]
    },
    filterable: Boolean,
    allowCreate: Boolean,
    size: {
      type: String,
      default: 'mini'
    }
  },
  data() {
    return {
      value: "",
      // apiBase: '/dicts/q?cols=label,value&params=type:',
      apiBase: "/dic/cg/",
      options: []
    };
  },
  // 这是将数据传到组件，在修改之时，将其显示在页面上
  watch: {
    initValue: function(val, oldVal) {
      this.value = val;
    }
  },
  created() {
    this.init();
  },
  methods: {
    /** 数字词典初始化
     * 根据 dicType 获取数字词典列表
     * @param void
     * @return void
     */
    init() {
      this.value = this.initValue;
      // 取本地数字词典
      const dicts = DictStore.state.dict || {};
      let options = dicts && dicts[this.dictType] || [];
      // 如果本地数字词典没有请求接口获取对应的数字词典
      // if((dicts && !Object.keys(dicts).length) || !options.length){ // 修改取本地数据字典 当数据词典借口报错取本地数据字典 2020-05-09
        // this.$root.ajaxData(this.apiBase + this.dictType, {}, (data)=> {
        //   this.options = data;
        // });
        SERVICES.BASE.getDict(this.dictType).then((res) => {
          this.options = res.data;
        }).catch(() =>{
          this.options = options;
        })
      // }
    },
    handlerChange() {
      this.$emit("input", this.value);
    }
  }
};
</script>
