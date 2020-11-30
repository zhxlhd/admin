<!-- 列表行按钮组件 -->
<template>
  <div style="display: inline-block;" class="btn_box">
    <!-- 一般按钮 -->
    <el-button size="mini"
      :disabled="btnDisable"
      :type="getSwitchValue('type')"
      @click.stop="handleAction"
      :icon="icon"
      :loading="loading"
      v-if="!act.popconfirm && !btnHidden"
      :plain="plain">
      <!-- word，判断是btn还是act -->
      <!-- 同时渲染 icon 和文字 -->
      <span class="picWord" v-if="act.icon && word" :class="act.icon">{{ getSwitchValue('i18n') || getSwitchValue('label') }}</span>
      <template v-else>
        <!-- 只渲染 icon -->
        <el-tooltip v-if="act.icon" class="item" effect="dark" :content="getSwitchValue('i18n') || getSwitchValue('label')" placement="top">
          <span :class="getSwitchValue('icon')"></span >
        </el-tooltip>
        <!-- 只渲染文字 -->
        <span v-else>{{ getSwitchValue('i18n') || getSwitchValue('label') }}</span>
      </template>
    </el-button>
    <!-- 有确认操作按钮 -->
    <el-popconfirm :title="`确定${act.label}吗？`" v-if="act.popconfirm" @onConfirm="handleAction">
      <el-button slot="reference" 
        size="mini"
        :disabled="btnDisable"
        :type="getSwitchValue('type')"
        :icon="icon"
        :loading="loading"
        :plain="plain">
        <span class="picWord" v-if="act.icon && word" :class="act.icon">{{ getSwitchValue('i18n') || getSwitchValue('label') }}</span>
        <template v-else>
          <el-tooltip v-if="act.icon" class="item" effect="dark" :content="getSwitchValue('i18n') || getSwitchValue('label')" placement="top">
            <span :class="getSwitchValue('icon')"></span >
          </el-tooltip>
          <span v-else>{{ getSwitchValue('i18n') || getSwitchValue('label') }}</span>
        </template>
      </el-button>
    </el-popconfirm>
  </div>
</template>

<script>
import { debounce, throttle } from '@/utils/util.js'; // 防抖和节流

export default {
  props: {
    act: Object,
    icon: {
      type: String,
      default: ''
    },
    loading: Boolean,
    row: {
      type: Object,
      default: function () { return {} }
    },
    hasSelected: {
      type: Boolean,
      default: false
    },
    plain: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: undefined
    },
    word: {
      type: Boolean,
      default: false
    },
    disabled: Boolean,
    hiddened: Boolean
  },
  computed: {
    btnDisable: function () {
      const { disabled, act, row } = this;
      return disabled || (act.switch && act.canDisable && Boolean(Number(row[act.disableKey])) && true) || (act.enableEditKey && !row[act.enableEditKey]);
    },
    btnHidden: function () {
      const { hiddened, act, row } = this;
      return hiddened || (act.hiddenedKey && !row[act.hiddenedKey]);
    }
  },
  methods: {
    handleAction () {
      debounce(() => {
        this.$emit('action', this.act, this.row)
      },500)
    },
    getSwitchValue (key) {
      const { act, row } = this;
      const action = act.action;
      if (act.switch) {
        if(key === 'i18n'){
          return act[key] && this.$t(act[key][Number(row[act.switchKey])]);
        }
        return act[key][Number(row[act.switchKey])];
      }else if(key === 'i18n'){
        return act[key] && this.$t(act[key]);
      }else if((key === 'type' && act.type !=='text') && action.includes('delete') || (key === 'type' && act.type !=='text') && action.includes('remove')){
        return 'danger';
      }
      return act[key] || 'primary';
    }
  }
}
</script>

<style scoped>
.el-icon-plus:before{
  margin-right:3px;
}
.btn_box+.btn_box{
  margin-left: 10px;
}
</style>
