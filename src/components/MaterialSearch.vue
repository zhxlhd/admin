<!--物料编码搜索-->

<template>
  <div>
    <el-dialog 
      v-bind="$attrs" 
      v-on="$listeners" 
      :before-close="handleClose" 
      title="物料搜索" 
      width="80%" 
      append-to-body 
      :close-on-click-modal=false 
      :show-close=false>
      <el-form  size="mini" :label-position="labelPosition" :label-width="'100px'">
        <el-row>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="物料编码"> 
              <el-input v-model="materialsInfo.subcode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item label="物料名称">
              <el-input v-model="materialsInfo.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item>
              <el-button type="primary" size="mini" @click="materialSearch">查询</el-button>
              <el-button type="primary" size="mini" @click="handleClose">关闭</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item  label="物料类型">
                <dict-selected v-model="materialsInfo.materialCategory" dictType="materialCategory"></dict-selected>
              </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-form-item  label="物料分类">
                <el-cascader
                  clearable
                  filterable
                  change-on-select
                  :options="category"
                  v-model="materialsInfo.materialCatg"
                  separator="-">
                </el-cascader>
              </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <k-table-list ref="listTable" 
                    :height="height" 
                    :mate="mate" 
                    :queryValues="materialsInfo" 
                    @btnClick="handleOperate" 
                    @action="handleOperate" 
                    @rowClick="handleOperate" 
                    :checkType="'noCheck'"></k-table-list>
    </el-dialog>
  </div>
</template>

<script>
import SERVICES from '@/services';
// 定义列表头
const COLUMNS = [
        {name: "subcode", label: "物料编码", width: 100, isShow: true, sortable: true},
        {name: "name", label: "物料名称", width: 100, isShow: true, sortable: false},
        {name: "basicSpec", label: "物料规格", width: 100, isShow: true, sortable: false},
        {name: "materialCategory", label: "物料类型", width: 100, isShow: true, sortable: false},
        {name: "materialCatgsName", label: "物料分类", width: 100, isShow: true, sortable: false},
      ];
// 定义操作行按钮
const ACTIONS = [
        {
          action: "choose",
          url: "",
          label: "选择",
          useId: 0,
          type: "",
          canDisable: false,
          disableKey:"closeFlag"
        },
      ];
// 定义查询接口
const DATA_API = '/materials/subCode/search'

export default {
    name: "MaterialSearch",
    components: {
      'dict-selected': function index (resolve) {
        require(['@/components/DictSelected.vue'], resolve)
      },
      KTableList: function index(resolve) {
        require(["@/components/table/KTableList.vue"], resolve);
      },
    },
    props:{
      orgId: {
        type: String,
        default: ""
      },
      isRepeat: {
        type: Boolean,
        default: false
      },
      materialsType: String
    },
    data(){
      return {
        height: 400, // 列表最大高度
        materialsInfo: {
          subcode: '',
          name: '',
          materialCategory: '',
          materialCatg: ''
        },
        mate: {
          mateList: {},
          mateListLine: {},
        },
        category: [],
        labelPosition: 'left',
      }
    },
    created() {
      // 默认请求列表
      // this.materialSearch();
    },
    mounted(){
      this.getCategory()
    },
    methods:{
      handleClose(){
        this.$emit('update:visible',false)
      },
      async handleOperate(act,row){
        if(this.materialsType == '1'){
          if(row.materialCategory == "成品"){
            SERVICES.BOM.checkBom(row.subcode).then(res =>{
              let exist = res.data && res.data.data;
              if(!exist){
                this.$emit('getMateInfo', row);
                this.handleClose();
              }else {
                this.$message({
                  message: 'Bom已存在',
                  type: 'warning'
                });
              }
            })
            return;
          }else{
            this.$message({
              message: '请选择成品物料',
              type: 'warning'
            });
            return;
          }
        }else if(this.materialsType == '2'){
          if(row.materialCategory == "成品"){
            this.$message({
              message: '请选择装配件或原材料物料',
              type: 'warning'
            });
            return;
          }else{
            await this.$emit('checkRepeat', row.subcode);
            if(this.isRepeat){
               this.$message({
                  message: '此物料已存在,请重新选择',
                  type: 'warning'
                });
                return;
            }
          }
        }
        this.$emit('getMateInfo', row) 
        this.handleClose()
      },
      materialSearch(){
        let _this = this;
        let { materialCatg, ...mate} = this.materialsInfo;
        SERVICES.BASE.searchMaterials({
          materialCatg: materialCatg.length?materialCatg[materialCatg.length-1]:'', // 用分类的第三级 id
          orgId: this.orgId ? this.orgId : "",
          ...mate
        }).then(
          res => {
            _this.initMate()
            let { size, page, total, rows, ...resData } = res.data.mate;
            _this.mate.mateList = { ..._this.mate.mateList, size, page, total, rows };
          }
        )
      },

      materialChange (data) {
        for (const i of data) {
          i.label = i.name
          i.value = i.id
          if (i.children) {
            this.materialChange(i.children)
          }
        }
        return data
       },

      getCategory(){
        SERVICES.BASE.getMaterialsCategory().then(
          res => {
            this.category =  this.materialChange(res.data)
          }
        )
      },
      initMate(){
        this.mate.mateList = {
          columns: COLUMNS,
          actions: ACTIONS,
          dataApi: DATA_API,
        }
      },
      // 清空搜索条件
      emptyMate(){
        this.materialsInfo = {
          subcode: '',
          name: '',
          materialCategory: '',
          materialCatg: ""
        }
        this.mate = {
          mateList: {},
          mateListLine: {}
        }
      }
    },

}
</script>

<style scoped lang="scss">
.search-result-list{
  margin-top: 20px
}
.el-select,.el-cascader{
  width: 100%;
}
.el-form-item {
  margin: 0px 0px 12px 0;
}
</style>
