<!-- created by yxj on 2019/11/21 -->
<!-- 省市区街道 动态渲染Form -->
<template>
  <el-row>
    <template v-for="(field,idx) in fieldList">
      <el-col :sm="24" :md="12" :lg="6">
        <el-form-item :label="field.label" :prop="modelName[idx]">
          <el-select v-model="vModel[modelName[idx]]" filterable clearable :placeholder="field.placeholder" :disabled="disabled"
                     @change="handleSelectChange(modelName[idx],field.fieldFlag,vModel[modelName[idx]],idx)"
            >
            <el-option
                v-for="item in field.options"
                :key="item[field.itemOptionCode]"
                :label="item[field.itemOptionName]"
                :value="item[field.itemOptionCode]">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </template>
  </el-row>
</template>

<script scope>
import SERVICES from "@/services";
export default {
  components: {
  },
  data () {
    return {
      fieldList: [ { label:'省', placeholder:'请输入省份', options: [], itemOptionName:'provinceName', itemOptionCode:'provinceCode', fieldFlag:'getCityList' },
          { label:'市/州', placeholder:'请输入市/州', options: [], itemOptionName:'cityName', itemOptionCode:'cityCode', fieldFlag:'getRegionList' },
          { label:'区/县', placeholder:'请输入区/县', options: [], itemOptionName:'areaName', itemOptionCode:'areaCode', fieldFlag:'getDistrictList' },
          { label:'镇/街道', placeholder:'请输入镇/街道', options: [], itemOptionName:'streetName', itemOptionCode:'streetCode', fieldFlag:'' }],     // 省市区街道下拉配置

    }
  },
  props: {
    modelName: { // 接收mongdb配置的下拉名称(省市区街道对应的字段名称)
      type: Array,
      default: []
    },
    vModel: { // 为了保持与父级数据一致，传值回父级
      type: Object,
      default: {}
    },
    disabled: { // 组件是否禁用
      type: Boolean,
      default: false
    }
  },
  computed: {
    // 监听是否有省code，以便获取市下拉数据
    getProvince: function () {
      return this.vModel[this.modelName[0]]
    },
    // 监听是否有市code，以便获取区下拉数据
    getCity: function () {
      return this.vModel[this.modelName[1]]
    },
    // 监听是否有区code，以便获取街道下拉数据
    getArea: function () {
      return this.vModel[this.modelName[2]]
    }
  },
  created () {
    this.modelName.forEach((filed,idx) => {
     this.$set(this.fieldList[idx], filed, '');
    });
    // 数据初始化
    this.init();
  },
  mounted () {
  },
  methods: {
    /**
     * 数据初始化
     * @param void
     * @return void
     */
    init() {
      // 获取省份下拉列表
      SERVICES.BASE.getProvinceList().then(res => {
         this.fieldList[0].options = res.data;
      });
      // 物流站点修改时 初始化下拉数据
      this.modelName.forEach((model,idx) => {
        if(this.vModel[model] && this.vModel[model] !== '' && this.fieldList[idx].fieldFlag !== '') {
          SERVICES.BASE[this.fieldList[idx].fieldFlag](this.vModel[model]).then(res => {
            this.fieldList[idx+1].options = res.data;
          });
        }
      });
    },
    /**
     * 处理下拉 change时相应的下一级清除，重新选择，获取下一级数据列表不放在change里面，有专门的watch获取
     * @param void
     * @return void
     */
    handleSelectChange(modelName,fieldFlag, value,idx) {
      this.clearSelectWithIdx(idx);
      // if(fieldFlag !== '' && value !== '') {
      //   SERVICES.BASE[fieldFlag](value).then(res => {
      //     this.fieldList[idx+1].options = res.data;
      //   });
      // }
    },
    /**
     * 处理清除下拉时数据清空(通过下拉的idx)
     * @param idx 第几个下拉
     * @return void
     */
    clearSelectWithIdx(idx) {
      this.modelName.forEach((item,index) => {
        if((idx+1) <= index) {
          this.vModel[item] = '';
        }
      });
    }
  },
  watch: {
    getProvince: {  // 监听省code，拉取市list
      handler:function(val,oldval){
        this.$nextTick(()=>{
          if(val !== '') {
            SERVICES.BASE[this.fieldList[0].fieldFlag](val).then(res => {
              this.fieldList[1].options = res.data;
            });
          }
        });
      }
    },
    getCity: {   // 监听市code，拉取区list
      handler:function(val,oldval){
        this.$nextTick(()=>{
          if(val !== '') {
            SERVICES.BASE[this.fieldList[1].fieldFlag](val).then(res => {
              this.fieldList[2].options = res.data;
            });
          }
        });
      }
    },
    getArea: {   // 监听区code，拉取街道list
      handler:function(val,oldval){
        this.$nextTick(()=>{
          if(val !== '') {
            SERVICES.BASE[this.fieldList[2].fieldFlag](val).then(res => {
              this.fieldList[3].options = res.data;
            });
          }
        });
      }
    },
  }
}
</script>
