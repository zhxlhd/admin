<template>
  <div>
    <el-dialog title="自定义列" :visible.sync="dialogLineSelect" :before-close="closeDialogLineSelect">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange(checkAll)">全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="checkedLabel" @change="handlecheckedLabelChange(checkedLabel)">
          <el-checkbox class="checkboxClass" v-for="(col) of mate.columns" :label="col.label" :key="col.label">{{col.label}}</el-checkbox>
        </el-checkbox-group>
        <div class="select-button">
          <el-button @click="dialogSelect">确 定</el-button>
          <el-button @click="closeDialogLineSelect">取 消</el-button>
        </div>
      </el-dialog>

      <el-dialog title="自定义明细行的列" :visible.sync="dialogDetailLine" :before-close="closeDialogDetailLine">
        <el-checkbox :indeterminate="isIndeterminateDetail" v-model="checkAllDetail" @change="handleCheckAllChangeDetail(checkAllDetail)">全选</el-checkbox>
        <div style="margin: 15px 0"></div>
        <el-checkbox-group v-model="checkedLabelDetail" @change="handlecheckedLabelChangeDetail">
          <el-checkbox class="checkboxClass" v-for="(col) of mate.lineColumns" :label="col.label" :key="col.label">{{col.label}}</el-checkbox>
        </el-checkbox-group>
        <div class="select-button">
          <el-button @click="dialogSelectDetail">确 定</el-button>
          <el-button @click="closeDialogDetailLine">取 消</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
  export default {
    props: {
      mate: Object,
      dialogLineSelect: Boolean,
      dialogDetailLine: Boolean
    },
    data () {
      return {
        checkAll: false,
        checkedLabel: [],
        isIndeterminate: true,
        lineSelected: [],               // 存放全部的label
        lineSelectedDetail: [],         // 存放全部的明细行label
        msgBoxButton: true,
        isIndeterminateDetail: true,
        checkAllDetail: false,
        checkedLabelDetail: [],
        flagFalse: false
      }
    },
    created () {
      this.lineSelected = []
      this.lineSelectedDetail = []
      // 有的是this.mate.columns，有的是this.mate.mateList.columns
      if (this.mate.columns) {
        this.mate.columns.forEach(i => {
          this.lineSelected.push(i.label)
        })
      }
      if (this.mate.lineColumns) {
        this.mate.lineColumns.forEach(i => {
          this.lineSelectedDetail.push(i.label)
        })
        this.checkedLabelDetail = this.lineSelectedDetail
      }
      this.checkedLabel = this.lineSelected
    },
    watch: {
      mate: function () {
        this.lineSelected = []
        this.lineSelectedDetail = []
        // 有的是this.mate.columns，有的是this.mate.mateList.columns
        this.mate.columns.forEach(i => {
          this.lineSelected.push(i.label)
        })
        if (this.mate.lineColumns) {
          this.mate.lineColumns.forEach(i => {
            this.lineSelectedDetail.push(i.label)
          })
          this.checkedLabelDetail = this.lineSelectedDetail
        }
        this.checkedLabel = this.lineSelected
      },
      dialogLineSelect: function () {
        if (this.dialogLineSelect === true) {
          this.userDefineded()
        }
      },
      dialogDetailLine: function () {
        if (this.dialogDetailLine) {
          this.handleDetailLine()
        }
      }
    },
    methods: {
      closeDialogLineSelect () {
        this.$emit('dialogLineSelectFalse')
      },
      closeDialogDetailLine () {
        this.$emit('dialogDetailLineFalse')
      },
      userDefineded () {
        this.$emit('dialogLineSelectTrue')
        // localStorage.getItem('lineSelected')
        let data = localStorage.getItem('lineSelected')
        // 判断是否有值，有值就要显示出来，若没有值，则不显示
        if (data) {
          data = JSON.parse(data)
          if (data[this.mate.localName]) {
            this.checkedLabel = data[this.mate.localName]
          }
        }
      },
      handleDetailLine () {
        this.$emit('dialogDetailLineTrue')
        let data = localStorage.getItem('detailLineSelect')
        if (data) {
          data = JSON.parse(data)
          if (data[this.mate.localName]) {
            this.checkedLabelDetail = data[this.mate.localName]
          }
        }
      },
      // 点击自定义列的确定按钮
      dialogSelect () {
        this.$emit('dialogLineSelectFalse')
        const arrayTemp = []
        this.checkedLabel.forEach(i => {
          arrayTemp[i] = true
        })
        for (let i = 0; i < this.mate.columns.length; i++) {
          if (!arrayTemp[this.mate.columns[i].label]) {
            this.mate.columns[i].isShow = false
          } else {
            this.mate.columns[i].isShow = true
          }
        }
        const name = this.mate.localName
        let getLocalStorageData = localStorage.getItem('lineSelected')
        if (getLocalStorageData) {
          getLocalStorageData = JSON.parse(getLocalStorageData)
          getLocalStorageData[name] = this.checkedLabel
          getLocalStorageData = JSON.stringify(getLocalStorageData)
          localStorage.setItem('lineSelected', getLocalStorageData)
        } else {
          let localStorageData = {}
          localStorageData[name] = this.checkedLabel
          localStorageData = JSON.stringify(localStorageData)
          localStorage.setItem('lineSelected', localStorageData)
        }
      },
      dialogSelectDetail () {
        this.$emit('dialogDetailLineFalse')
        const arrayTemp = []
        this.checkedLabelDetail.forEach(i => {
          arrayTemp[i] = true
        })
        for (let i = 0; i < this.mate.lineColumns.length; i++) {
          if (!arrayTemp[this.mate.lineColumns[i].label]) {
            this.mate.lineColumns[i].isShow = false
          } else {
            this.mate.lineColumns[i].isShow = true
          }
        }
        const name = this.mate.localName
        let getDetailStorageData = localStorage.getItem('detailLineSelect')
        if (getDetailStorageData) {
          getDetailStorageData = JSON.parse(getDetailStorageData)
          getDetailStorageData[name] = this.checkedLabelDetail
          getDetailStorageData = JSON.stringify(getDetailStorageData)
          localStorage.setItem('detailLineSelect', getDetailStorageData)
        } else {
          let detailLocalStorageData = {}
          detailLocalStorageData[name] = this.checkedLabelDetail
          detailLocalStorageData = JSON.stringify(detailLocalStorageData)
          localStorage.setItem('detailLineSelect', detailLocalStorageData)
        }
      },
      handlecheckedLabelChange (value) {
        this.checkedLabel = value
        const checkedCount = value.length
        this.checkAll = checkedCount === this.lineSelected.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkedLabel.length
      },
      handlecheckedLabelChangeDetail (value) {
        this.checkedLabelDetail = value
        const checkedCount = value.length
        this.checkAllDetail = checkedCount === this.lineSelectedDetail.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkedLabel.length
      },
      // 这个函数和下面的函数都是自定义列的函数
      handleCheckAllChange (val) {
        this.checkedLabel = val ? this.lineSelected : []
        this.isIndeterminate = false
      },
      handleCheckAllChangeDetail (val) {
        this.checkedLabelDetail = val ? this.lineSelectedDetail : []
        this.isIndeterminateDetail = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-form-item {
    margin: 15px 20px 2px 0px;
  }
  .checkboxClass{
    width: 30%;
    padding-bottom: 10px;
    box-sizing: border-box;
    margin-left: 15px;
  }
  .el-dialog{
    /*background: #eee;*/
  }
  .select-button{
    margin: 5px 0;
    button {
      padding: 7px 15px;
      background-color: #fff;
      cursor: pointer;
    }
  }
  .detailLine{
    position: relative;
  }
  .definedLine{
    position: absolute;
    right: 0px;
  }
  .tableTop{
    position: absolute;
    top: 50px;
    margin-bottom: 50px;
  }
</style>
