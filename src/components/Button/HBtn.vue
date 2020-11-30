<template>
  <div class="tbutton" style="display: inline-block;">
    <el-button v-if="renderSubmitBtn" :size="size" type="primary" class="el-icon-document" :disabled="submit.btnDisabled" @click="handleBtns('submit')" >{{submit.label}}</el-button>
    <el-button v-if="renderSaveBtn" :size="size" type="primary" class="el-icon-upload" :disabled="save.btnDisabled" @click="handleBtns('save')">{{save.label}}</el-button>
    <el-button v-if="renderCancelBtn" :size="size" type="danger" class="el-icon-close" @click="handleBtns('cancel')">{{cancel.label}}</el-button>
    <el-button v-if="renderResetBtn" :size="size" class="el-icon-refresh"  @click="handleBtns('reset')">{{reset.label}}</el-button>
    <slot name="moreButtons"></slot>
  </div>
</template>


<script>
export default {
  props: {
    countTime: { // 按钮防抖时间 默认为5秒
      type: Number,
      default: () => 3
    },
    btns: { // 按钮渲染 默认渲染 提交、取消 按钮
      type: Array,
      default: () => ['提交','取消']
    },
    type: {
      type: String,
      default: 'primary'
    },
    size: {
      type: String,
      default: 'mini'
    }
  },
  data(){
    return {
      totalTime: this.countTime, // 防抖时间
      submit: {
        btnDisabled: false,      // 按钮是否禁用
        label: "提 交",          // 提交按钮文字
      },
      save: {
        btnDisabled: false,      // 按钮是否禁用
        label: "保 存",          // 保存按钮文字
      },
      cancel: {
        label: "取 消",          // 取消按钮文字
      },
      reset: {
        label: "重 置",          // 取消按钮文字
      },
      disabledBtn: false         // 防抖是否开启
    }
  },
  computed: {
    // 按钮渲染
    renderSubmitBtn: function () {
      return this.btns.find((item) => item === "提交")? true : false;
    },
    renderSaveBtn: function () {
      return this.btns.find((item) => item === "保存")? true : false;
    },
    renderCancelBtn: function () {
      return this.btns.find((item) => item === "取消")? true : false;
    },
    renderResetBtn: function () {
      return this.btns.find((item) => item === "重置")? true : false;
    }
  },
  methods: {
    handleBtns (operation) {
      // 按钮是否是提交按钮或者保存按钮 是的话按钮开启防抖
      if(operation === "submit" || operation === "save") {
        this.disabledBtn = true;
      }else {// 否则按钮不开启防抖
        this.disabledBtn = false;
      }
      this.$emit('click', operation);
      // 按钮开启防抖功能
      if(this.disabledBtn) this.btnCountDown(operation);
    },
    /** 按钮防抖
     * 点击后按钮冷却至倒计时结束
     * @param {String} name 按钮名称 如：submit/save/cancel/reset
     * @return void
     */
    btnCountDown(name) {
      // 保存按钮名称文字
      let label = this[name].label;
      // 设置按钮禁用
      this[name].btnDisabled = true;
      // 倒数时间
      let countTime = this.totalTime;
      // 设置按钮倒计时文字
      this[name].label = `${label}(${countTime}s)`;
      let clock = window.setInterval(() => {
        countTime--;
        this[name].label = `${label}(${countTime}s)`;
        if (countTime < 0) {     //当倒计时小于0时清除定时器
          window.clearInterval(clock)
          // 重置按钮名称文字
          this[name].label = label;
          // 取消按钮禁用
          this[name].btnDisabled = false;
        }
      }, 1000)
    }
  }
}
</script>

<style scoped>
.el-icon-plus:before{
  margin-right:3px;
}
</style>
