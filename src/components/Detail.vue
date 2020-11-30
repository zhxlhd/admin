<template>
  <el-form  :model="mate.values"  label-position="right">
    <template v-for="field of mate.fields">
      <el-row>
        <el-col :span="18" :offset="2"> 
          <el-form-item :label="field.label">
            <el-input class="el-input" v-model="mate.values[field.name]" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </template>
      <el-row>
        <el-col :span="10" :offset="10">
          <el-form-item>
            <el-button @click="backward" v-if="!mate.inline">返回</el-button>
          </el-form-item>
        </el-col>
      </el-row>
  </el-form>
</template>
<script>

// import Thelect from './Thelect.vue'

export default {
  data () {
    return {
      defaultValues: {},
      labelPosition: 'right'
    }
  },
  props: {
    mate: Object
  },
  created () {
    if (this.mate.inline) {
      this.defaultValues = this.mate.values
    }
  },
  components: {
    'w-editor': function index (resolve) {
      require(['./WEditor.vue'], resolve)
    },
    KCascader: function index (resolve) {
      require(['./KCascader.vue'], resolve)
    }
    // 'u-editor': function index (resolve) {
    //   require(['./UEditor.vue'], resolve)
    // },
    // Thelect
  },
  computed: {
    // a computed getter
    labelWidth: function () {
      let width = ''
      if (this.mate.inline) {
        // width = undefined
        width = '100px'
      } else if (typeof (this.mate.labelWidth) === 'undefined') {
        width = '100px'
      } else {
        width = this.mate.labelWidth
      }
      return width
    }
  },
  methods: {
    backward () {
      this.$root.monitor({ url: this.mate.next })
    }
  }
}
</script>

<style scoped>
.el-form-item {
  width:480px
}
.el-form--inline>* {
  margin-right:10px
}
.el-form--inline .el-form-item {
  width:200px;
  display: inline-block;
  margin-right: 10px;
  vertical-align: top;
}
.el-form-item {
    margin: 15px 20px 2px 0px;
}
</style>