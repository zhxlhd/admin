<template>
  <div style="display: inline-block;" class="k_btn_box">
    <!-- 有确认操作按钮 -->
    <el-popconfirm :title="`确定${act.label}吗？`" v-if="act.popconfirm" @onConfirm="handleAction">
      <el-button slot="reference" 
        size="mini"
        :disabled="btnDisable"
        :type="getSwitchValue('type')"
        :icon="icon"
        :loading="loading">
        <span class="picWord" v-if="act.icon && word" :class="act.icon">{{ getSwitchValue('i18n') || getSwitchValue('label') }}</span>
        <template v-else>
          <el-tooltip v-if="act.icon" class="item" effect="dark" :content="getSwitchValue('i18n') || getSwitchValue('label')" placement="top">
            <span :class="getSwitchValue('icon')"></span >
          </el-tooltip>
          <span v-else>{{getSwitchValue('i18n') || getSwitchValue('label')}}</span>
        </template>
      </el-button>
    </el-popconfirm>
     <!-- 下拉选择 按钮-->
    <el-dropdown trigger="hover" v-else-if="act.selected">
      <span class="el-dropdown-link userinfo-inner">
        <el-button size="mini"
          :disabled="btnDisable"
          :type="getSwitchValue('type')" 
          :icon="icon"
          :loading="loading"
          :round="round"
          >
        <i :class="act.icon">{{ getSwitchValue('i18n') || getSwitchValue('label') }}</i>
        </el-button>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in act.children" :key="item" @click.native="handleActionDropdown(item)">{{item.label}}</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
    <!-- 一般按钮 -->
    <el-button size="mini" :disabled="btnDisable"
      :type="getSwitchValue('type')"
      @click="handleAction"
      :icon="icon"
      :loading="loading"
      :round="round"
      v-else>
      <!-- word，判断是btn还是act -->
      <span class="picWord" v-if="act.icon && word" :class="act.icon">{{ getSwitchValue('i18n') || getSwitchValue('label') }}</span>
      <template v-else>
        <span v-if="act.icon" :class="act.icon"></span >
        <span v-else>{{ getSwitchValue('i18n') || getSwitchValue('label') }}</span>
      </template>
    </el-button>
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
    round: {
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
    disabled: Boolean
  },
  computed: {
    btnDisable: function () {
      return this.disabled || (this.act.isSelector && !this.hasSelected && true ) || (this.act.canDisable && Boolean(this.row[this.act.disableKey]) && true);
    }
  },
  methods: {
    handleAction () {
      debounce(() => {
        this.$emit('action', this.act, this.row)
      },500)
    },
    handleActionDropdown (item) {
      debounce(() => {
        this.$emit('actionDropdown', item, this.row)
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
      }else if(key === "i18n"){
        return act[key] && this.$t(act[key]);
      // }else if((key === 'type' && action.includes('add')) || (key === 'type' && action.includes('edit')) || (key === 'type' && action.includes('update'))){
      //   return 'primary';
      }else if(key === 'type' && action.includes('delete') || key === 'type' && action.includes('remove')){
        return 'danger'
      }else if(key === 'type' && action.includes('refresh')){
        return 'success'
      }else if(key === 'type'){
        return 'primary'
      }
      return act[key];
    }
  }
}
</script>

<style scoped>
.el-icon-plus:before{
  margin-right:3px;
}
.k_btn_box+.k_btn_box{
  margin-left: 10px;
}
</style>
