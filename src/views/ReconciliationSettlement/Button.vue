<template>
  <div class="button1">
    <el-button @click="click" size="mini" :type="primary" :disabled="disable">{{name}}</el-button>
  </div>
</template>

<script>
  export default {
    props: {
      name: {
        type: String,
        default: '查询'
      },
      disable: {
        type: Boolean,
        default: true
      },
      primary: {
        type: String,
        default: ''
      }
    },
    methods: {
      click () {
        this.$emit('clicked')
      }
    }
  }
</script>

<style scoped>
  .button1 {
    display: inline-block;
  }
</style>