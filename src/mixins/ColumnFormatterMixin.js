import DictStore from '../store/dict-store'

const ColumnFormatterMixin = {
  methods: {
    formatterBefore (columns = []) {
      if (columns !== null && columns.filter !== null) {
        columns.filter(col => col.dict !== undefined).forEach(function (col, i) {
          col.formatter = function (row, column) {
            return DictStore.formatDict(col.dict, row[column.property])
          }
        })
      }
    }
  }
}
export default ColumnFormatterMixin;
