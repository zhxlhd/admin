<!--BOM物料用料导出-->

<template>
  <div>
    <div style="margin-bottom: 20px;">
      <el-form size="mini" ref="ruleForm" :model="mateInfo" :label-position="labelPosition" :rules="rules" :label-width="'100px'">
        <el-row>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="装配件编号" prop="code"> 
              <el-input v-model="mateInfo.code" @keyup.enter.native="getMateInfo" @change="getMateInfo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="装配件名称" prop="materialsName">
              <el-input v-model="mateInfo.materialsName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="规格" prop="specs">
              <el-input v-model="mateInfo.specs"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item  label="生产数量" prop="quantity">
              <el-input v-model="mateInfo.quantity"></el-input>
              </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item  label="展开层级" prop="level">
              <el-select clearable filterable v-model="mateInfo.level" placeholder="选择状态">
                <el-option v-for="item in levels" :key="item.label" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-button type="primary" size="mini" @click="mateSearch">计算</el-button>
          <el-button type="primary" size="mini" @click="bomExport">导出</el-button>
        </el-row>
      </el-form>
    </div>
    <main-table :mateList="mate.mateList" :checkType="'noCheck'"/>
  </div>

</template>

<script>

import { BOM_API } from "@/services/apis"
import {API_GATEWAY} from '@/config/index.js'

export default {
  name: "BomExport",
  components: {
    MainTable: function index(resolve) {
      require(["@/components/table/MainTable.vue"], resolve);
    },
  },
  props: {
    mate: Object
  },
  data(){
    return {
      mateInfo: {
        code: '',
        materialsName: '',
        specs: '',
        quantity: '',
        level: '',
        id: ''
      },
      levels: [
        {
          key: 1,
          value: 1
        },
        {
          key: 2,
          value: 2
        },
        {
          key: 3,
          value: 3
        },
        {
          key: 4,
          value: 4
        },
        {
          key: 5,
          value: 5
        },
      ],
      mateList: {

      },
      labelPosition: 'left',
      calculateFlag: false,
      rules: {
        code:[{ required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: "blur", disabled: false }],
        materialsName:[{ required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: "blur", disabled: false }],
        quantity:[{ required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: "blur", disabled: false }],
        level:[{ required: true, message: this.$t('FORM_VALIDATION_INFO.IS_REQUIRED'), trigger: "change", disabled: false, type: "number" }],
      }
    }
  },
  created(){
    this.mateList = this.mate.mateList
  },
  mounted(){
    
  },
  methods:{
    getMateInfo(){
      if(!this.mateInfo.code) {
        this.$message({
          message: '请输入装配件编号',
          type: 'warning'
        })
        return false;
      }
      this.$root.ajaxData(`${BOM_API.BOM_CONSUMPTION}/${this.mateInfo.code}`, {}, data => {
        if(!data.id){
          this.$message.warning('请输入正确的装配件编号');
          this.mateInfo.materialsName = '';
          this.mateInfo.id = '';
          return
        }
        let { materialsName, specs, id, ...rest} = data
        this.mateInfo = { ...this.mateInfo, materialsName, specs, id}
      }, 'GET');
    },

    bomExport(){
      if(!this.calculateFlag) {
        this.$message({
          message: '请先计算',
          type: 'warning'
        })
        return
      }
      this.$http({
        url: `${API_GATEWAY}/api${BOM_API.BOM_CONSUMPTION_EXPORT}?bomId=${this.mateInfo.id}&level=${this.mateInfo.level}&amount=${this.mateInfo.quantity}`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${window.sessionStorage.getItem('token')}`,
          'Accept': 'application/json',
          'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf8'
        },
        responseType: 'arraybuffer'
      }).then(function (res) {
        let blob = new Blob([res.data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"})
        let objectUrl = URL.createObjectURL(blob)
        let a = document.createElement('a')
        let filename = 'BOM物料用量.xlsx'
        a.setAttribute('style', 'display:none')
        a.setAttribute('id', 'download');
        a.setAttribute('href', objectUrl);
        a.setAttribute('download', filename);
        // 防止反复添加
        if (document.getElementById('download')) {
          document.body.removeChild(document.getElementById('download'));
        }
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(objectUrl);
      })
    },

    mateSearch(){
      // if( !this.mateInfo.quantity || !this.mateInfo.level ) {
      //   this.$message({
      //     message: '请选择生产数量和展开层级',
      //     type: 'warning'
      //   })
      //   return false
      // }
      const _this = this;
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          _this.$root.ajaxData(`${BOM_API.BOM_CONSUMPTION_CALCULATE}?bomId=${_this.mateInfo.id}&level=${_this.mateInfo.level}&amount=${_this.mateInfo.quantity}`,{}, data=>{
            let { rows } = data.mate;
            _this.mate.mateList = {..._this.mate.mateList, rows};
            _this.calculateFlag = true
          })
        }else{ 
          _this.$notify.error({
            title: "消息",
            message: "数据验证未通过"
          });
        }
      })
    },
  },

}
</script>

<style scoped lang="scss">
.el-table {
  margin-top: 20px

}
 .el-form-item, .el-button {
    margin: 15px 20px 2px 0px;
  }
  .el-select,.el-cascader{
    width: 100%;
  }
</style>
