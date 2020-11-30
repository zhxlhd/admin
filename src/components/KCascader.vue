<template>
  <el-cascader
    :options="optionsValue"
    :props="props"
    filterable
    change-on-select
    v-model="selectedOptions"
    @change="handleChange">
  </el-cascader>
</template>
<script>
  export default {
    props: {
      value: [String, Number],
      options: [String, Array]
    },
    data () {
      return {
        selectedOptions: [],
        optionsValue: [],
        props: {
          value: 'id',
          label: 'name'
        }
      }
    },
    created: function () {
      if ((typeof this.options) === 'string') {
        const vm = this
        this.getData(this.options, function (data) {
          vm.optionsValue = data
          vm.onValue(vm.value)
        })
      } else {
        this.optionsValue = this.options
        this.onValue(this.value)
      }
    },
    watch: {

    },
    methods: {
      getData (option, cb) {
        const vm = this
        this.$root.ajaxData(option, {}, function (data) {
          cb(data)
        })
      },
      handleChange (value) {
        this.$emit('input', value[value.length - 1])
      },
      findIndex (arr, value, o, level) {
        arr[level] = o.id
        if ((o.id + '') === (value + '')) {
          return true
        }
        if (o.children) {
          for (var i = 0; i < o.children.length; i++) {
            if (this.findIndex(arr, value, o.children[i], level + 1)) {
              return true
            } else {
              continue
            }
          }
        }
        return false
      },
      onValue (newValue) {
        if (newValue && newValue !== '' && newValue !== null && newValue !== 0) {
          var v = []
          for (var i = 0; i < this.optionsValue.length; i++) {
            v = []
            if (this.findIndex(v, newValue, this.optionsValue[i], 0)) {
              this.selectedOptions = v

              return
            }
          }
        }
      }
    }
  }
</script>

<style scoped>
  .demo-block {
    border:1px solid #eaeefb;
    border-radius:4px;
    transition:.2s
  }
  .demo-block.hover {
    box-shadow:0 0 8px 0 rgba(232,237,250,.6),0 2px 4px 0 rgba(232,237,250,.5)
  }
  .demo-cascader .block {
    padding: 30px 0;
    text-align: center;
    border-right: 1px solid #eff2f6;
    float: left;
    width: 50%;
    box-sizing: border-box;
  }
  .demo-cascader {
    overflow: hidden;
  }
</style>
