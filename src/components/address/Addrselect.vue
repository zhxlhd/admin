<template>
  <el-select size="mini" :disabled="disabledFlag" v-model="value" placeholder="请选择" @change="handleChange" ref="elselect">
    <el-option v-for="item in options" :key="item.value" :label="item.text" :value="item.value" :disabled="item.disabled">
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'Addrselect',
  props: {
    disabledFlag: Boolean,
    addrs: Array,
    initselectedvalue: String
  },
  data () {
    return {
      options: [{ 'text': '请选择..', 'value': '0' }].concat(this.addrs),
      value: '0'
    }
  },
  methods: {
    handleChange (val) {
      this.$emit('change', val)
      this.$emit('input', val)
    }
  },
  created () {
    this.value = this.initselectedvalue
  },
  watch: {
    addrs: {
      handler: function (val, oldVal) {
        if (val !== oldVal) {
          this.options = [{ 'text': '请选择..', 'value': '0' }].concat(val)
          this.value = '0'
        }
      },
      deep: true
    },
    initselectedvalue(val) {
      this.value = val
    }
  }
}
</script>
