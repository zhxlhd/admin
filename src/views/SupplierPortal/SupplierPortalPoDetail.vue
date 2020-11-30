<template>
  <div>
    <el-row>
      <el-button size="mini" @click="submitEBS">提 交</el-button>
      <el-button size="mini" @click="cancelBack">取 消</el-button>
      <div class="head">
        <h1>客户PO</h1>
      </div>
      <div class="detail">
        <ul class="ul">
          <li v-for="(item,index) in lableLeft" :key="index">{{item.label}}：{{mate.mateFormerHeader.data[item.name]}}</li>
        </ul>
        <ul class="ul">
          <li v-for="(item,index) in lableRight" :key="index">{{item.label}}：{{mate.mateFormerHeader.data[item.name]}}</li>
        </ul>
      </div>
      <div>
        <el-table :data="poDetail" style="width: 100%"  border size="mini"  show-overflow-tooltip @expand-change="expandSelect" type='index' max-height="400" :row-key="getRowKeys" :expand-row-keys="expands">
         <el-table-column type="expand" fixed="left">
            <template slot-scope="props">
              <p class="detailTitle">发运行</p>
              <el-table class="detailTable" size="mini" border  :data="props.row.dispatchList" style="width: 100%"  max-height="250" show-overflow-tooltip>
                <template v-for="(col,index) of dispatchColumns">
                  <el-table-column show-overflow-tooltip v-if="col.isShow && !col.editable " :formatter="col.formatter" :key="index" :label="col.label" :prop="col.name" :min-width="col.width">
                  </el-table-column>
                  <el-table-column v-if="col.isShow && col.editable && col.editType === 'datePicker'" :formatter="col.formatter" :key="index" :label="col.label" :prop="col.name" width="250">
                    <template slot-scope="scope">
                      <el-date-picker size="mini" v-model="scope.row.promiseDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
                    </template>
                  </el-table-column>
                  <el-table-column v-if="col.isShow && col.editable && col.editType ==='input'" :formatter="col.formatter" :key="index" :label="col.label" :prop="col.name" width="250">
                    <template slot-scope="scope">
                      <el-input size="mini" v-model="scope.row['requestReason']"></el-input>
                    </template>
                  </el-table-column>
                </template>
              </el-table>
            </template>
         </el-table-column>
         <el-table-column  show-overflow-tooltip v-for="(col,index) of mate.mateLineList.columns" :formatter="col.formatter" :key="index" :label="col.label" :prop="col.name" :min-width="col.width">
          </el-table-column>
       </el-table>
      </div>
    </el-row>
  </div>
</template>
<script>
import axios from '@/utils/http'; // 导入http中创建的axios实例

export default {
  props: {
    mate: Object
  },
  data(){
    return{
      poDetail: [],
      lableLeft: [],
      lableRight: [],
      despatchDetail: [],
      dispatchColumns: [],
      expands: [],
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      getRowKeys (row) {
        return row.lineId
      }
    }
  },
  created(){
    this.lableLeft = this.mate.mateFormerHeader.fields.slice(0,this.mate.mateFormerHeader.fields.length/2)
    this.lableRight = this.mate.mateFormerHeader.fields.slice(this.mate.mateFormerHeader.fields.length/2,this.mate.mateFormerHeader.fields.length)
    this.poDetail = this.mate.mateLineList.rows
    this.dispatchColumns = this.mate.dispatchList.mate.columns
  },
  methods:{
    // 折叠面板每次只能展开一行
    expandSelect (row, expandedRows) {
      this.expands = []
      if(expandedRows.length > 0){
        this.expands.push(row.lineId)
      } else {
        this.expands = []
      }
    },
    submitEBS() {
      let data = this.poDetail;
      let notEmpty = false;
      for (let r = 0; r < data.length; r++) {
        const itemList = data[r].dispatchList;
        let lineNum = data[r].lineNum;
        for (let i = 0; i < itemList.length; i++) {
          let promiseDate = itemList[i].promiseDate;
          let subLineNum = itemList[i].lineNum;
          if(promiseDate == '' || promiseDate == null || promiseDate == undefined){
            notEmpty = true;
            this.$notify({
              title: '提示',
              message: `${lineNum}-${subLineNum} 行的承诺日期为必填`,
            })
            return
          }
        }
      }
      axios.post('/supplier-portal/po/requestChange', data).then(res =>{
        this.$notify({
          title: '提示',
          message: '保存成功',
        })
        this.cancelBack();
      }).catch(err =>{});
    },
    cancelBack(){
      this.$root.monitor({ url: '/supplier-portal/po/head/list?state=7' })
      this.$emit('closeTab', this.mate.title);
    }
  }
}
</script>
<style scoped>
 ul {
    display: inline-block;
    vertical-align: top;
    width: 350px;
    overflow: hidden;
    font-size: 14px;
  }
  ul li {
    list-style: none;
    margin: 5px 0;
  }
  .detailTitle{
    font-size: 14px;
    font-weight: 600;
  }
  
</style>
<style >
.detailTable .el-table--scrollable-x .el-table__body-wrapper {
    padding: 0 0 5px 0;
    margin: 0 0 5px 0;
    overflow-x: auto;
  }
</style>
