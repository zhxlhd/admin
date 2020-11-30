<template>
  <div>

    <el-table :data="list.rows" border fit highlight-current-row style="width: 100%">

        <el-table-column :label="objectColumns['orgName'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['orgName'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['inventoryName'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['inventoryName'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['tagNo'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['tagNo'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['inventoryQty'].label" width="100">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row[objectColumns['inventoryQty'].name]"></el-input>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['subcode'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['subcode'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['unit'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['unit'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['warehouseName'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['warehouseName'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['locationName'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['locationName'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['batchNo'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['batchNo'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['lotNo'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['lotNo'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['trayNo'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['trayNo'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['itemStatus'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['itemStatus'].name] == 0 ? '不合格' : '合格'}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['productDate'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['productDate'].name]}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="objectColumns['expireDate'].label" width="100">
          <template slot-scope="scope">
            <span>{{scope.row[objectColumns['expireDate'].name]}}</span>
          </template>
        </el-table-column>

    </el-table>

    <div class="sbutton">
      <el-button type="primary" @click="handleSubmit">提 交</el-button>
      <el-button @click="backward" v-if="!mate.inline">取 消</el-button>
    </div>
  </div>
</template>

<script>
function trimSpace (str) {
  try {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
  } catch (e) {
    return str
  }
}

function isPositiveinteger (val) {
  if (val == 0) {
    return true
  } else {
    var reg = new RegExp('^[1-9]*[1-9][0-9]*$')
    return reg.test(val)
  }
}

export default {
  data () {
    return {
      form: {},
      list: {},
      objectColumns: {}
    }
  },
  props: {
    mate: Object
  },
  methods: {
    handleSubmit (ev) {
      var vm = this
      if (this.list.rows.length == 0) {
        vm.$message({
          message: this.$t('Detailed data can not be empty'),
          type: 'warning'
        })
        return
      }

      var mate = {}
      mate.mateList = this.list.rows

      var chkmsg = ''
      for (var k = 0; k < this.list.rows.length; k++) {
        if ((this.list.rows[k].inventoryQty === undefined) || (trimSpace(this.list.rows[k].inventoryQty) === '')) {
          chkmsg = '明细数据第' + (k + 1) + '行的盘点数量不能为空'
          break
        }

        if (!isPositiveinteger(trimSpace(this.list.rows[k].inventoryQty))) {
          chkmsg = '明细数据第' + (k + 1) + '行的盘点数量必须为整数且不能小于0'
          break
        }
      }

      if (chkmsg != '') {
        vm.$message({
          message: chkmsg,
          type: 'warning'
        })
        return
      }

      this.$root.ajaxData('/inventory/physical/inventorytags/batchUpdate', mate, function () {
        vm.$root.monitor({ url: '/inventory/physical/inventories/all/list' })
      }, 'POST')
    },
    backward () {
      this.$root.monitor({ url: '/inventory/physical/inventories/all/list' })
    }
  },
  created () {
    var vm = this
    this.list = this.mate.mateList
    this.list.columns.map((i) => { this.objectColumns[i.name] = i })
  }
}
</script>

<style scoped>
.sbutton{
  margin-top:50px;
}
</style>