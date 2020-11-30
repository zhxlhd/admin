<template>
  <div>
    <slot name="title"></slot>
    <slot name="button"></slot>
    <el-table show-overflow-tooltip size="mini" ref="table"  border :data="tableData" max-height="250" @row-click="rowClick">
      <el-table-column v-for="col of mate.columns" :formatter="col.formatter || formatterAll"
                      :label="col.label"
                      :prop="col.name"
                      :width="col.width"
                      :sortable="col.sortable"
                      :key="col.name"
                      show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" class="optionHidden" v-if="show" :width="colWidth" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" @click="handleAction(scope.row)" :row="scope.row" v-if="!load"></el-button>
          <el-button size="mini" icon="" @click="handleLoad(scope.row)" :row="scope.row" v-if="load">下载</el-button>
          <el-button size="mini" icon="el-icon-delete" @click="handle(scope.row)" :row="scope.row"  v-if="load"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import addrArr from './address/addr-arr.js';
import ColumnFormatterMixin from '../mixins/ColumnFormatterMixin';

export default {
  mixins: [ColumnFormatterMixin],
  props: {
    mate: Object,
    me: Array,
    show: Boolean,
    tableData: Array,
    load: false,
    row: {
      type: Object,
      default: function () { return {} }
    }
  },
  created () {
    this.formatterBefore(this.mate.columns);
  },
  data () {
    return {
      colWidth: '150px'
    }
  },
  methods: {
    rowClick (row) {
      this.$emit('rowClick', row)
    },
    handleAction (row) {
      this.$emit('action', row)
    },
    handle (row) {
      this.$emit('actionDel', row)
    },
    handleLoad (row) {
      this.$emit('actionLoad', row)
    },
    formatterAll (row, col) {
      if (col.property === 'orgId') {
        return row.orgName
        // 地点状态和银行状态
      } else if (col.property === 'status') {
        return row.status === '1' ? this.$t('valid') : (row.status === '0' ? this.$t('invalid') : row.status)
        // 是否主要地点
      } else if (col.property === 'mainAddress') {
        return row.mainAddress === '1' ? this.$t('yes') : (row.mainAddress === '0' ? this.$t('no') : row.mainAddress)
        // shipmentTemplate 客户指定票货通行模板
      } else if (col.property === 'shipmentTemplate') {
        return row.shipmentTemplate === '1' ? this.$t('yes') : (row.shipmentTemplate === '0' ? this.$t('no') : row.shipmentTemplate)
        // 整零要求
      } else if (col.property === 'allowOdd') {
        return row.allowOdd === '1' ? this.$t('yes') : (row.allowOdd === '0' ? this.$t('no') : row.allowOdd)
        // 支付方式
      } else if (col.property === 'paymentMethod') {
        if (row.paymentMode === '1') {
          return this.$t('bankCardPayment')
        } else if (row.paymentMode === '2') {
          return this.$t('alipay')
        } else if (row.paymentMode === '3') {
          return this.$t('pos')
        } else if (row.paymentMode === '4') {
          return this.$t('cashPayment')
        }
        // 发票类型
      } else if (col.property === 'invoiceType') {
        if (row.invoiceType === '0') {
          return this.$t('fraudulentInvoicing')
        } else if (row.paymentMode === '1') {
          return this.$t('ValueAdded')
        } else if (row.paymentMode === '2') {
          return this.$t('invoice')
        } else if (row.paymentMode === '3') {
          return this.$t('receipt')
        }
      } else if (col.property === 'flagVatUsed') {
        return row.flagVatUsed === '1' ? this.$t('yes') : (row.flagVatUsed === '0' ? this.$t('no') : row.flagVatUsed)
      } else if (col.property === 'province') {
        if (row.province) {
          if (row.province) { // 修复北京不显示 北京值为 1
            if (addrArr[0][row.province - 1]) {
              return addrArr[0][row.province - 1][1]
            } else {
              return ''
            }
          }
        } else {
          return row.province
        }
      } else if (col.property === 'city') {
        if (row.province >= 0) {
          if (row.city > 0) {
            for (var i = 0; i < addrArr[row.province].length; i++) {
              if (addrArr[row.province][i][0] === row.city) {
                if (addrArr[row.province][i]) {
                  return addrArr[row.province][i][1]
                } else {
                  return ''
                }
              }
            }
          } else {
            return row.city
          }
        } else {
          return row.city
        }
        // 省
      } else if (col.property === 'county') {
        if (row.city > 0) {
          if (row.county > 0) {
            for (var j = 0; j < addrArr[row.city].length; j++) {
              if (addrArr[row.city][j][0] === row.county) {
                return addrArr[row.city][j][1]
              }
            }
          }
        }
        //
      } else if (col.property === 'goodsReceiver') {
        if (row.goodsReceiver === '1') {
          return this.$t('yes')
        } else if (row.goodsReceiver === '0') {
          return this.$t('no')
        }
      } else if (col.property === 'billReceiver') {
        if (row.billReceiver === '1') {
          return this.$t('yes')
        } else if (row.billReceiver) {
          return this.$t('no')
        }
        // 可采购   可采购、可付款、询价都在同一个表里面，所以不能放在一起判断
      } else if (col.property === 'canPurchase') {
        if (row.canPurchase === '1') {
          return this.$t('yes')
        } else if (row.canPurchase === '0') {
          return this.$t('no')
        }
        // 可付款
      } else if (col.property === 'canPayment') {
        if (row.canPayment === '1') {
          return this.$t('yes')
        } else if (row.canPayment === '0') {
          return this.$t('no')
        }
        // 询价
      } else if (col.property === 'enquiry') {
        if (row.enquiry) {
          return this.$t('yes')
        } else if (row.enquiry) {
          return this.$t('no')
        }
        // 关联收单方
      } else if (col.property === 'relateBillReceiver') {
        return row.relateBillReceiverName
        // 经办人
      } else if (col.property === 'userId') {
        return row.userName
      }
      // 上传人
      else if (col.property === 'createBy') {
        return row.updateByName
      } else if (col.property === 'acceptUnilateral') {
        return row.acceptUnilateral === '1' ? this.$t('yes') : (row.acceptUnilateral === '0' ? this.$t('no') : row.acceptUnilateral);
      } else {
        return row[col.property]
      }
    }

  }
}
</script>

<style scoped>

</style>
