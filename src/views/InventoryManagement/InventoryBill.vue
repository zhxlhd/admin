<template>
  <div>
    <div class="tbutton">
      <el-button plain class="el-icon-document" @click="handleSubmit">提 交</el-button>
      <el-button plain class="el-icon-close" @click="backward" v-if="!mate.inline">取 消</el-button>
      <el-button plain class="el-icon-date"  @click="resetForm('InventoryBillForm')">重 置</el-button>
    </div>
    <InventoryBillForm :mate="form" ref="InventoryBillForm"></InventoryBillForm>

  
  </div>
</template>

<script>

import { DateFormat, trimSpace } from '../../utils/util.js'

export default {
  data () {
    return {
      form: {}
    }
  },
  components: {
    InventoryBillForm: function index (resolve) {
      require(['./InventoryBillForm.vue'], resolve)
    }
  },
  props: {
    mate: Object
  },
  methods: {
    handleSubmit (ev) {
      var mate = {}
      var vm = this

      var ruleRes = ''
      this.$refs.InventoryBillForm.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          ruleRes = 'no'
        }
      })

      if (ruleRes === 'no') {
        return
      }

      this.form.values.inventoryName = trimSpace(this.form.values.inventoryName)
      this.form.values.inventoryType = trimSpace(this.form.values.inventoryType)
      this.form.values.inventoryDate = DateFormat(this.form.values.inventoryDate, 'yyyy-MM-dd')
      this.form.values.touchStartDate = DateFormat(this.form.values.touchStartDate, 'yyyy-MM-dd')
      this.form.values.touchEndDate = DateFormat(this.form.values.touchEndDate, 'yyyy-MM-dd')
      this.form.values.snapshotTime = DateFormat(this.form.values.snapshotTime, 'yyyy-MM-dd')

      if (this.form.values.inventoryType === 2) {
        if ((this.form.values.touchStartDate === undefined) || (this.form.values.touchStartDate === '')) {
          vm.$message({
            message: '盘点类型为动碰盘点时动碰起始日期不能为空',
            type: 'warning'
          })
          return
        }

        if ((this.form.values.touchEndDate === undefined) || (this.form.values.touchEndDate === '')) {
          vm.$message({
            message: '盘点类型为动碰盘点时动碰终止日期不能为空',
            type: 'warning'
          })
          return
        }

        if (this.form.values.touchStartDate > this.form.values.touchEndDate) {
          vm.$message({
            message: '动碰起始日期不能大于动碰终止日期',
            type: 'warning'
          })
          return
        }

        if (this.form.values.touchEndDate > DateFormat(new Date(), 'yyyy-MM-dd')) {
          vm.$message({
            message: '动碰终止日期不能大于当前日期',
            type: 'warning'
          })
          return
        }
      }

      mate.mateFormerHeader = this.form.values

      if (this.mate.mateFormerHeader.method === 'POST') {
        this.$root.ajaxData('/inventory/physical/inventories/batchSave', mate, function () {
          vm.$root.monitor({ url: '/inventory/physical/inventories/all/list' })
        }, 'POST')
      } else {
        this.$root.ajaxData('/inventory/physical/inventories/batchUpdate' + '/' + mate.mateFormerHeader.id, mate, function () {
          vm.$root.monitor({ url: '/inventory/physical/inventories/all/list' })
        }, 'PUT')
      }
    },
    backward () {
      this.$root.monitor({ url: '/inventory/physical/inventories/all/list' })
    },
    resetForm (formName) {
      this.$refs.InventoryBillForm.$refs['ruleForm'].resetFields()
    }
  },
  created () {
    var vm = this
    this.form = this.mate.mateFormerHeader
  }
}
</script>

<style scoped lang="scss">
.sbutton{
  margin-top:50px;
}
.tbutton{
  margin: 3px 0;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}
</style>


