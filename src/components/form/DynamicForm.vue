<!-- created by zhongxiaolong on 2019/09/18 -->
<!-- 动态表单 -->
<!-- 
  "fields":[
    {
      "isRender": true, [true,false] 必填,是否渲染
      "holder": textc,[textc,textarea,select,radio,radioButton,checkbox,switch,date,datetime,time,dict] 必填,控件类型
      "label": "标签名字" 必填
      "type": number/input 区分input输入框是文本还是数字输入框 默认 input
      "disabled": false 选填,是否禁用;会被本地配置rules覆盖
      "readonly": false 选填,是否只读
      "placeholder": 控件描述 选填
      "isHide": 可以通过改变某个控件值 如 radio 控制对应配置的控件显示和隐藏
      "maxlength": 设置textarea可以输入的最大限度 选填
      "i18n": 国际化必填 国际化label 渲染 $t(`LABEL_TEXT.${配置路径名称}`) 需要在 i18n 文件中配置
      "suffix": 选填 复合输入框 后缀显示 比如 税率的 %
    }
  ]
  其他属性看以下封装属性
  -->
<!-- 动态表单 动态渲染Form -->
<template>
  <div id="dynamic-form">
    <!-- 表单布局渲染 根据传入 formLayout 进行渲染 -->
    <!-- 例子 二维数组
      ：formLayout = headerFormLayout;
      
        headerFormLayout: [
          ['orgId'],
          ['planCode','planName'],
          ['startDateStr','endDateStr'],
          ['remarks']
        ]
    -->
    <el-row v-if="formLayout.length">
      <el-form :ref="formName" 
               :size="size" 
               :model="mate.values" 
               :inline="mate.inline" 
               :label-position="labelPosition" 
               :rules="rules" 
               :label-width="labelWidth">
        <slot></slot>
        <el-row v-for="(items, index) of formLayout" :key="index">
          <div v-for="(field, idx) of items" :key="idx">
            <!-- 1.数字输入框 -->
            <el-col :sm="form[field].sm || 24" :md="form[field].md || 12" :lg="form[field].lg || 8" v-if="form[field] && form[field].isRender && form[field].holder === 'textc' && form[field].type === 'number'" >
              <el-form-item :label="(form[field].i18n && $t(`LABEL_TEXT.${form[field].i18n}`)) || form[field].label" :prop="form[field].name">
                <el-input-number v-model="mate.values[form[field].name]" 
                  type="text"
                  v-bind="$attrs" 
                  @input="eventCfg[field] && eventCfg[field].input && handleInput(mate.values[field], field)"
                  @change="eventCfg[field] && eventCfg[field].change && handleChange(mate.values[field], field)"
                  @blur="eventCfg[field] && eventCfg[field].blur && handleBlur(mate.values[field], field)"
                  @focus="eventCfg[field] && eventCfg[field].focus && handleFocus(mate.values[field], field)"
                  :disabled="rules && rules[field] && rules[field][0].disabled || form[field].disabled"
                  :readonly="formReadOnly || form[field].readonly"
                  :clearable="rules && rules[field] && !rules[field][0].required"
                  :controls="numBtnControls" 
                  :precision="form[field].precision" 
                  :min="form[field].min"
                  :max="form[field].max"
                  :placeholder="(rules && rules[field] && rules[field][0].required) ? (form[field].placeholder || `请输入${form[field].label}`) : ''"></el-input-number>
              </el-form-item>
            </el-col>
            <!-- 2.输入框 -->
            <el-col :sm="form[field].sm || 24" :md="form[field].md || 12" :lg="form[field].lg || 8" v-if="form[field] && form[field].isRender && form[field].holder === 'textc' && form[field].type != 'number'" >
              <el-form-item :label="(form[field].i18n && $t(`LABEL_TEXT.${form[field].i18n}`)) || form[field].label" :prop="form[field].name" class="my-form-item">
                <el-input v-model.trim="mate.values[form[field].name]" 
                  type="text"
                  v-bind="$attrs" 
                  @input="eventCfg[field] && eventCfg[field].input && handleInput(mate.values[field], field)"
                  @change="eventCfg[field] && eventCfg[field].change && handleChange(mate.values[field], field)"
                  @blur="eventCfg[field] && eventCfg[field].blur && handleBlur(mate.values[field], field)"
                  @focus="eventCfg[field] && eventCfg[field].focus && handleFocus(mate.values[field], field)"
                  :disabled="rules && rules[field] && rules[field][0].disabled || form[field].disabled"
                  :readonly="formReadOnly || form[field].readonly"
                  :clearable="rules && rules[field] && !rules[field][0].required"
                  :maxlength="rules && rules[field] && rules[field][0].maxlength || form[field].maxlength"
                  :placeholder="(rules && rules[field] && rules[field][0].required) ? (form[field].placeholder || `请输入${form[field].label}`) : ''">
                    <template v-if="form[field].suffix" slot="append">{{form[field].suffix}}</template>
                </el-input>
                  <span class="span-length-text" v-if="form[field].maxlength">{{mate.values[field] && mate.values[field].length || '0'}} / {{form[field].maxlength}}</span>
              </el-form-item>
            </el-col>
            <!-- 3.文本域 -->
            <el-col :sm="form[field].sm || 24" :md="form[field].md || 12" :lg="form[field].lg || 8" v-if="form[field] && form[field].isRender && form[field].holder === 'textarea'" >
              <el-form-item :label="(form[field].i18n && $t(`LABEL_TEXT.${form[field].i18n}`)) || form[field].label" :prop="form[field].name" class="my-form-item">
                <el-input v-model="mate.values[form[field].name]" 
                  type="textarea"
                  v-bind="$attrs"
                  :maxlength="rules && rules[field] && rules[field][0].maxlength || form[field].maxlength"
                  @input="eventCfg[field] && eventCfg[field].input && handleInput(mate.values[field], field)"
                  @change="eventCfg[field] && eventCfg[field].change && handleChange(mate.values[field], field)"
                  @blur="eventCfg[field] && eventCfg[field].blur && handleBlur(mate.values[field], field)"
                  @focus="eventCfg[field] && eventCfg[field].focus && handleFocus(mate.values[field], field)"
                  :disabled="rules && rules[field] && rules[field][0].disabled || form[field].disabled"
                  :readonly="formReadOnly || form[field].readonly"
                  :autosize="{ minRows: 4, maxRows: 6}"
                  :placeholder="(rules && rules[field] && rules[field][0].required) ? (form[field].placeholder || `请输入${form[field].label}`) : ''"></el-input>
                  <span class="span-length" v-if="form[field].maxlength">{{mate.values[field] && mate.values[field].length || '0'}} / {{form[field].maxlength}}</span>
              </el-form-item>
            </el-col>
            <!-- 4.下拉框 -->
            <el-col :sm="form[field].sm || 24" :md="form[field].md || 12" :lg="form[field].lg || 8" v-if="form[field] && form[field].isRender && form[field].holder === 'select'" v-show="!field.isHide">
              <el-form-item :label="(form[field].i18n && $t(`LABEL_TEXT.${form[field].i18n}`)) || form[field].label" :prop="form[field].name">
                <el-select v-model="mate.values[form[field].name]"
                @change="eventCfg[field] && eventCfg[field].change && handleChange(mate.values[field], field)"
                :disabled="rules && rules[field] && rules[field][0].disabled || form[field].disabled"
                :readonly="formReadOnly || form[field].readonly"
                :clearable="rules && rules[field] && !rules[field][0].required"
                :filterable="form[field].filterable"
                :allow-create="form[field].allowCreate"
                :multiple="form[field].multiple"
                :placeholder="(rules && rules[field] && rules[field][0].required) ? (form[field].placeholder || `请选择${form[field].label}`) : ''" 
                ><el-option :label="item.label" :value="item.value" v-for="(item,index) of form[field].options" :disabled="item.disabled" :key="index">
                  <span v-if="form[field].custom" style="float: left; margin-right:30px">{{ item.label }}</span>
                  <span v-if="form[field].custom" style="float: right; color: #212121; font-size: 13px">{{ item.name }}</span>
                </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- 4.1下拉框 -->
            <el-col :sm="form[field].sm || 24" :md="form[field].md || 12" :lg="form[field].lg || 8" v-if="form[field] && form[field].isRender && form[field].holder === 'customSelect'" v-show="!field.isHide">
              <el-form-item :label="(form[field].i18n && $t(`LABEL_TEXT.${form[field].i18n}`)) || form[field].label" :prop="form[field].name">
                <el-select v-model="mate.values[form[field].name]"
                @change="eventCfg[field] && eventCfg[field].change && handleChange(mate.values[field], field)"
                :disabled="rules && rules[field] && rules[field][0].disabled || form[field].disabled"
                :readonly="formReadOnly || form[field].readonly"
                :clearable="rules && rules[field] && !rules[field][0].required"
                :filterable="form[field].filterable"
                :allow-create="form[field].allowCreate"
                :multiple="form[field].multiple"
                :placeholder="(rules && rules[field] && rules[field][0].required) ? (form[field].placeholder || `请选择${form[field].label}`) : ''" 
                ><el-option :label="item.name" :value="item.value" v-for="(item,index) of form[field].options" :key="index">
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- 4.2 联级下拉框 -->
            <el-col :sm="form[field].sm || 24" :md="form[field].md || 12" :lg="form[field].lg || 8" v-if="form[field] && form[field].isRender && form[field].holder === 'cascader'" v-show="!field.isHide">
              <el-form-item :label="(form[field].i18n && $t(`LABEL_TEXT.${form[field].i18n}`)) || form[field].label" :prop="form[field].name">
                <el-cascader v-model="mate.values[form[field].name]"
                ref="cascader"
                @change="eventCfg[field] && eventCfg[field].change && handleChange(mate.values[field], field)"
                :disabled="rules && rules[field] && rules[field][0].disabled || form[field].disabled"
                :readonly="formReadOnly || form[field].readonly"
                :filterable="form[field].filterable"
                :clearable="rules && rules[field] && !rules[field][0].required"
                :allow-create="form[field].allowCreate"
                :show-all-levels="form[field].showAllLevels"
                :options="form[field].options"
                :props="form[field].configure"
                :placeholder="(rules && rules[field] && rules[field][0].required) ? (form[field].placeholder || `请选择${form[field].label}`) : ''" 
                ></el-cascader>
              </el-form-item>
            </el-col>
            <!-- 5.单选 -->
            <el-col :sm="form[field].sm || 24" :md="form[field].md || 12" :lg="form[field].lg || 8" v-if="form[field] && form[field].isRender && form[field].holder === 'radio'" >
              <el-form-item :label="(form[field].i18n && $t(`LABEL_TEXT.${form[field].i18n}`)) || form[field].label" :prop="form[field].name" class="radioStyle">
                <el-radio-group v-model="mate.values[form[field].name]"
                  @change="eventCfg[field] && eventCfg[field].change && handleChange(mate.values[field], field)"
                  :disabled="rules && rules[field] && rules[field][0].disabled || form[field].disabled">
                  <el-radio v-for="ra in field.radios" :label="ra.value" :key="ra.value">{{ra.label}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <!-- 6.单选按钮 -->
            <el-col :sm="form[field].sm || 24" :md="form[field].md || 12" :lg="form[field].lg || 8" v-if="form[field] && form[field].isRender && form[field].holder === 'radioButton'" >
              <el-form-item :label="(form[field].i18n && $t(`LABEL_TEXT.${form[field].i18n}`)) || form[field].label" :prop="form[field].name">
                <el-radio-group v-model="mate.values[form[field].name]" 
                  @change="eventCfg[field] && eventCfg[field].change && handleChange(mate.values[field], field)"
                  :disabled="rules && rules[field] && rules[field][0].disabled || form[field].disabled">
                  <el-radio-button v-for="ra in item.radios" :label="ra.value" :key="ra.value">{{ra.label}}</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <!-- 7.复选框组 -->
            <el-col :sm="form[field].sm || 24" :md="form[field].md || 12" :lg="form[field].lg || 8" v-if="form[field] && form[field].isRender && form[field].holder === 'checkboxGroup'" >
              <el-form-item :label="(form[field].i18n && $t(`LABEL_TEXT.${form[field].i18n}`)) || form[field].label" :prop="form[field].name">
                <el-checkbox-group v-model="mate.values[form[field].name]" 
                  @change="eventCfg[field] && eventCfg[field].change && handleChange(mate.values[field], field)"
                  :disabled="rules && rules[field] && rules[field][0].disabled || form[field].disabled">
                  <el-checkbox span=8 v-for="(item,index) in field.checkbox" :label="item.value" :key='index' :name="field">{{item.label}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <!-- 7.1复选框组 Boolean -->
            <el-col :sm="form[field].sm || 24" :md="form[field].md || 12" :lg="form[field].lg || 8" v-if="form[field] && form[field].isRender && form[field].holder === 'checkbox'" >
              <el-form-item :label="(form[field].i18n && $t(`LABEL_TEXT.${form[field].i18n}`)) || form[field].label" :prop="form[field].name">
                <el-checkbox  v-model="mate.values[form[field].name]" 
                  @change="eventCfg[field] && eventCfg[field].change && handleChange(mate.values[field], field)"
                  :disabled="rules && rules[field] && rules[field][0].disabled || form[field].disabled"
                  ></el-checkbox>
              </el-form-item>
            </el-col>
            <!-- 8.开关 -->
            <el-col :sm="form[field].sm || 24" :md="form[field].md || 12" :lg="form[field].lg || 8" v-if="form[field] && form[field].isRender && form[field].holder === 'switch'" >
              <el-form-item :label="(form[field].i18n && $t(`LABEL_TEXT.${form[field].i18n}`)) || form[field].label" :prop="form[field].name">
                <el-switch v-model="mate.values[form[field].name]" 
                  @change="eventCfg[field] && eventCfg[field].change && handleChange(mate.values[field], field)"
                  :disabled="rules && rules[field] && rules[field][0].disabled || form[field].disabled"
                  :active-text="form[field].activeText"
                  :active-value="form[field].activeValue"
                  :active-color="form[field].activeColor"
                  :inactive-text="form[field].inactiveText"
                  :inactive-value="form[field].inactiveValue"
                  :inactive-color="form[field].inactiveColor"></el-switch>
              </el-form-item>
            </el-col>
            <!-- 9.日期 -->
            <el-col :sm="form[field].sm || 24" :md="form[field].md || 12" :lg="form[field].lg || 8" v-if="form[field] && form[field].isRender && form[field].holder === 'date'" >
              <el-form-item :label="(form[field].i18n && $t(`LABEL_TEXT.${form[field].i18n}`)) || form[field].label" :prop="form[field].name">
                <el-date-picker v-model="mate.values[form[field].name]" 
                  type="date"
                  :clearable="rules && rules[field] && !rules[field][0].required"
                  @change="eventCfg[field] && eventCfg[field].change && handleChange(mate.values[field], field)"
                  @clear="eventCfg[field] && eventCfg[field].change && handleClear(mate.values[form[field].name], field)"
                  :disabled="rules && rules[field] && rules[field][0].disabled || form[field].disabled" 
                  :readonly="formReadOnly || form[field].readonly" 
                  :picker-options="form[field].pickerOptions"
                  :value-format="form[field].format || 'yyyy-MM-dd'"
                  :placeholder="(rules && rules[field] && rules[field][0].required) ? (form[field].placeholder || '请选择日期') : ''"
                  ></el-date-picker>
              </el-form-item>
            </el-col>
            <!-- 10.日期时间 -->
            <el-col :sm="form[field].sm || 24" :md="form[field].md || 12" :lg="form[field].lg || 8" v-if="form[field] && form[field].isRender && form[field].holder === 'datetime'" >
              <el-form-item :label="(form[field].i18n && $t(`LABEL_TEXT.${form[field].i18n}`)) || form[field].label" :prop="form[field].name">
                <el-date-picker v-model="mate.values[form[field].name]"
                  type="datetime"
                  :clearable="rules && rules[field] && !rules[field][0].required"
                  @change="eventCfg[field] && eventCfg[field].change && handleChange(mate.values[field], field)"
                  @clear="eventCfg[field] && eventCfg[field].change && handleClear(mate.values[form[field].name], field)"
                  :disabled="rules && rules[field] && rules[field][0].disabled || form[field].disabled" 
                  :readonly="formReadOnly || form[field].readonly"
                  :picker-options="form[field].pickerOptions"
                  :value-format="form[field].format || 'yyyy-MM-dd HH:mm:ss'" 
                  :placeholder="(rules && rules[field] && rules[field][0].required) ? (form[field].placeholder || '请选择日期时间') : ''"
                  ></el-date-picker>
              </el-form-item>
            </el-col>
            <!-- 11.时间 -->
            <el-col :sm="form[field].sm || 24" :md="form[field].md || 12" :lg="form[field].lg || 8" v-if="form[field] && form[field].isRender && form[field].holder === 'time'" >
              <el-form-item :label="(form[field].i18n && $t(`LABEL_TEXT.${form[field].i18n}`)) || form[field].label" :prop="form[field].name">
                <el-time-picker v-model="mate.values[form[field].name]" 
                  type="date"
                  clearable 
                  @change="eventCfg[field] && eventCfg[field].change && handleChange(mate.values[field], field)"
                  @clear="eventCfg[field] && eventCfg[field].change && handleClear(mate.values[form[field].name], field)"
                  :disabled="rules && rules[field] && rules[field][0].disabled || form[field].disabled" 
                  :readonly="formReadOnly || form[field].readonly" 
                  :picker-options="form[field].pickerOptions"
                  :value-format="form[field].format || 'HH:mm:ss'" 
                  :placeholder="(rules && rules[field] && rules[field][0].required) ? (form[field].placeholder || '请选择时间') : ''"
                ></el-time-picker>
              </el-form-item>
            </el-col>
            <!-- 12.数字词典 -->
            <el-col :sm="form[field].sm || 24" :md="form[field].md || 12" :lg="form[field].lg || 8" v-if="form[field] && form[field].isRender && form[field].holder === 'dict'" >
              <el-form-item :label="(form[field].i18n && $t(`LABEL_TEXT.${form[field].i18n}`)) || form[field].label" :prop="form[field].name">
                <dict-selected v-model="mate.values[form[field].name]" 
                  :rowId="rules && rules[field] && rules[field][0].rowId || field.rowId"
                  :initValue="mate.values[form[field].name]" 
                  :filterable="form[field].filterable"
                  :allow-create="form[field].allowCreate"
                  :multiple="form[field].multiple" 
                  :clearable="rules && rules[field] && !rules[field][0].required"
                  :dictType="form[field].dict"
                  :placeholder="(rules && rules[field] && rules[field][0].required) ? (form[field].placeholder || `请选择${form[field].label}`) : ''" 
                  ></dict-selected>
              </el-form-item>
            </el-col>
            <!-- 13.库存组织 -->
            <el-col :sm="form[field].sm || 24" :md="form[field].md || 12" :lg="form[field].lg || 8" v-if="form[field] && form[field].isRender && form[field].holder === 'orgUnit'" >
              <el-form-item :label="(form[field].i18n && $t(`LABEL_TEXT.${form[field].i18n}`)) || form[field].label" :prop="form[field].name">
                <org-selected v-model="mate.values[form[field].name]" :mate="mate"
                  v-bind="$attrs" 
                  v-on="$listeners" 
                  :disabled="rules && rules[field] && rules[field][0].disabled || form[field].disabled"
                  :initValue="mate.values[form[field].name]"
                  :filterable="form[field].filterable"
                  :clearable="rules && rules[field] && !rules[field][0].required"
                  :multiple="form[field].multiple"
                  :placeholder="(rules && rules[field] && rules[field][0].required) ? (form[field].placeholder || `请选择${form[field].label}`) : ''" 
                  ></org-selected>
              </el-form-item>
            </el-col>
            <!-- 14.物料编码 -->
            <el-col :sm="form[field].sm || 24" :md="form[field].md || 12" :lg="form[field].lg || 8" v-if="form[field] && form[field].isRender && form[field].holder === 'materials'" >
              <el-form-item :label="(form[field].i18n && $t(`LABEL_TEXT.${form[field].i18n}`)) || form[field].label" :prop="form[field].name">
                <el-input v-model="mate.values[form[field].name]"
                  @focus="eventCfg[field] && eventCfg[field].focus && handleFocus(mate.values[field], field)"
                  :disabled="rules && rules[field] && rules[field][0].disabled || form[field].disabled"
                  :readonly="formReadOnly || form[field].readonly"
                  :placeholder="(rules && rules[field] && rules[field][0].required) ? (form[field].placeholder || `请选择${form[field].label}`) : ''" 
                  ><el-button slot="append" icon="el-icon-search" 
                    :disabled="rules && rules[field] && rules[field][0].disabled || form[field].disabled"
                    @click="handleSearch"></el-button>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 15.省市区街道下拉 -->
            <el-col :sm="24" :md="24" :lg="24" v-if="form[field] && form[field].isRender && form[field].holder === 'addressSelect'" >
              <address-selected :modelName="field.modelName" :vModel="mate.values"></address-selected>
            </el-col>
            <!-- 16.分区标题 -->
            <el-col :sm="24" :md="24" :lg="24" v-if="form[field] && form[field].isRender && form[field].holder === 'title'" >
              <h2 style="border-bottom: 1px solid #DDD;padding-bottom: 10px;">{{form[field].label}}</h2>
            </el-col>
            <!-- 17.按钮 -->
            <el-col :sm="24" :md="12" :lg="8" v-if="form[field] && form[field].isRender && form[field].holder === 'button'" >
              <el-form-item :prop="form[field].name">
                <el-button :size="form[field].size || 'mini'" :type="form[field].type || 'primary'" @click.prevent.stop="handleClick(form[field].name)">{{form[field].label}}</el-button>
              </el-form-item>
            </el-col>
          </div>
        </el-row>
      </el-form>
    </el-row>
    
    <!-- 表单渲染 根据mongodb配置字段顺序渲染 -->
    <el-row v-else>
      <el-form :ref="formName" 
               :size="size" 
               :model="mate.values" 
               :inline="mate.inline" 
               :label-position="labelPosition" 
               :rules="rules" 
               :label-width="labelWidth">
        <slot></slot>
        <template v-for="(field, index) of mate.fields">
          <!-- 1.数字输入框 -->
          <el-col :sm="field.sm || 24" :md="field.md || 12" :lg="field.lg || 8" v-if="field.isRender && field.holder === 'textc' && field.type === 'number'" :key="index">
            <el-form-item :label="(field.i18n && $t(`LABEL_TEXT.${field.i18n}`)) || field.label" :prop="field.name">
              <el-input-number v-model="mate.values[field.name]" 
                type="text"
                v-bind="$attrs" 
                @input="eventCfg[field.name] && eventCfg[field.name].input && handleInput(mate.values[field.name], field.name)"
                @change="eventCfg[field.name] && eventCfg[field.name].change && handleChange(mate.values[field.name], field.name)"
                @blur="eventCfg[field.name] && eventCfg[field.name].blur && handleBlur(mate.values[field.name], field.name)"
                @focus="eventCfg[field.name] && eventCfg[field.name].focus && handleFocus(mate.values[field.name], field.name)"
                :disabled="rules && rules[field.name] && rules[field.name][0].disabled || field.disabled"
                :readonly="formReadOnly || field.readonly"
                :clearable="rules && rules[field.name] && !rules[field.name][0].required"
                :controls="numBtnControls" 
                :precision="field.precision" 
                :min="field.min"
                :max="field.max"
                :placeholder="(rules && rules[field.name] && rules[field.name][0].required) ? (field.placeholder || `请输入${field.label}`) : ''"></el-input-number>
            </el-form-item>
          </el-col>
          <!-- 2.输入框 -->
          <el-col :sm="field.sm || 24" :md="field.md || 12" :lg="field.lg || 8" v-if="field.isRender && field.holder === 'textc' && field.type != 'number'" :key="index">
            <el-form-item :label="(field.i18n && $t(`LABEL_TEXT.${field.i18n}`)) || field.label" :prop="field.name" class="my-form-item">
              <el-input v-model.trim="mate.values[field.name]" :class="(field.maxlength > 0) ? 'btn_close_fixed' :''"
                type="text"
                v-bind="$attrs" 
                @input="eventCfg[field.name] && eventCfg[field.name].input && handleInput(mate.values[field.name], field.name)"
                @change="eventCfg[field.name] && eventCfg[field.name].change && handleChange(mate.values[field.name], field.name)"
                @blur="eventCfg[field.name] && eventCfg[field.name].blur && handleBlur(mate.values[field.name], field.name)"
                @focus="eventCfg[field.name] && eventCfg[field.name].focus && handleFocus(mate.values[field.name], field.name)"
                :disabled="rules && rules[field.name] && rules[field.name][0].disabled || field.disabled"
                :clearable="rules && rules[field.name] && !rules[field.name][0].required"
                :maxlength="rules && rules[field.name] && rules[field.name][0].maxlength || field.maxlength"
                :placeholder="(rules && rules[field.name] && rules[field.name][0].required) ? (field.placeholder || `请输入${field.label}`) : ''">
                <template v-if="field.suffix" slot="append">{{field.suffix}}</template>
              </el-input>
                <span class="span-length-text" v-if="field.maxlength">{{mate.values[field.name] && mate.values[field.name].length || '0'}} / {{field.maxlength}}</span>
            </el-form-item>
          </el-col>
          <!-- 3.文本域 -->
          <el-col :sm="field.sm || 24" :md="field.md || 12" :lg="field.lg || 8" v-if="field.isRender && field.holder === 'textarea'" :key="index">
            <el-form-item :label="(field.i18n && $t(`LABEL_TEXT.${field.i18n}`)) || field.label" :prop="field.name" class="my-form-item">
              <el-input v-model="mate.values[field.name]" 
                type="textarea"
                v-bind="$attrs" 
                :maxlength="rules && rules[field.name] && rules[field.name][0].maxlength || field.maxlength"
                @input="eventCfg[field.name] && eventCfg[field.name].input && handleInput(mate.values[field.name], field.name)"
                @change="eventCfg[field.name] && eventCfg[field.name].change && handleChange(mate.values[field.name], field.name)"
                @blur="eventCfg[field.name] && eventCfg[field.name].blur && handleBlur(mate.values[field.name], field.name)"
                @focus="eventCfg[field.name] && eventCfg[field.name].focus && handleFocus(mate.values[field.name], field.name)"
                :disabled="rules && rules[field.name] && rules[field.name][0].disabled || field.disabled"
                :readonly="formReadOnly || field.readonly"
                :autosize="{ minRows: 4, maxRows: 6}"
                :placeholder="(rules && rules[field.name] && rules[field.name][0].required) ? (field.placeholder || `请输入${field.label}`) : ''"></el-input>
                <span class="span-length" v-if="field.maxlength">{{mate.values[field.name] && mate.values[field.name].length || '0'}} / {{field.maxlength}}</span>
                <!-- <span class="span-err" v-if="field.maxlength && mate.values[field.name].length == field.maxlength">最多可以填入{{field.maxlength}}个字符</span> -->
            </el-form-item>
          </el-col>
          <!-- 4.下拉框 -->
          <el-col :sm="field.sm || 24" :md="field.md || 12" :lg="field.lg || 8" v-if="field.isRender && field.holder === 'select'" :key="index" v-show="!field.isHide">
            <el-form-item :label="(field.i18n && $t(`LABEL_TEXT.${field.i18n}`)) || field.label" :prop="field.name">
              <el-select v-model="mate.values[field.name]"
              @change="eventCfg[field.name] && eventCfg[field.name].change && handleChange(mate.values[field.name], field.name)"
              @clear="eventCfg[field.name] && eventCfg[field.name].change && handleClear(mate.values[field.name], field.name)"
              :disabled="rules && rules[field.name] && rules[field.name][0].disabled || field.disabled"
              :readonly="formReadOnly || field.readonly"
              :clearable="rules && rules[field.name] && !rules[field.name][0].required"
              :filterable="field.filterable"
              :allow-create="field.allowCreate"
              :multiple="field.multiple"
              :placeholder="(rules && rules[field.name] && rules[field.name][0].required) ? (field.placeholder || `请选择${field.label}`) : ''" 
              ><el-option :label="item.label" :value="item.value" v-for="(item,index) of field.options" :disabled="item.disabled" :key="index">
                <span v-if="field.custom" style="float: left; margin-right:30px">{{ item.label }}</span>
                <span v-if="field.custom" style="float: right; color: #212121; font-size: 13px">{{ item.name }}</span>
              </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 4.1下拉框 -->
          <el-col :sm="field.sm || 24" :md="field.md || 12" :lg="field.lg || 8" v-if="field.isRender && field.holder === 'customSelect'" :key="index" v-show="!field.isHide">
            <el-form-item :label="(field.i18n && $t(`LABEL_TEXT.${field.i18n}`)) || field.label" :prop="field.name">
              <el-select v-model="mate.values[field.name]"
              @change="eventCfg[field.name] && eventCfg[field.name].change && handleChange(mate.values[field.name], field.name)"
              @clear="eventCfg[field.name] && eventCfg[field.name].change && handleClear(mate.values[field.name], field.name)"
              :disabled="rules && rules[field.name] && rules[field.name][0].disabled || field.disabled"
              :readonly="formReadOnly || field.readonly"
              :clearable="rules && rules[field.name] && !rules[field.name][0].required"
              :filterable="field.filterable"
              :allow-create="field.allowCreate"
              :multiple="field.multiple"
              :placeholder="(rules && rules[field.name] && rules[field.name][0].required) ? (field.placeholder || `请选择${field.label}`) : ''" 
              ><el-option :label="item.label" :value="item.name" v-for="(item,index) of field.options" :key="index">
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
              </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 4.2 联级下拉框 -->
          <el-col :sm="field.sm || 24" :md="field.md || 12" :lg="field.lg || 8" v-if="field.isRender && field.holder === 'cascader'" :key="index" v-show="!field.isHide" >
            <el-form-item :label="(field.i18n && $t(`LABEL_TEXT.${field.i18n}`)) || field.label" :prop="field.name" >
              <el-cascader v-model="mate.values[field.name]"
              ref="cascader"
              @change="eventCfg[field.name] && eventCfg[field.name].change && handleChange(mate.values[field.name], field.name)"
              @clear="eventCfg[field.name] && eventCfg[field.name].change && handleClear(mate.values[field.name], field.name)"
              :disabled="rules && rules[field.name] && rules[field.name][0].disabled || field.disabled"
              :readonly="formReadOnly || field.readonly"
              :filterable="field.filterable"
              :clearable="field.clearable"
              :allow-create="field.allowCreate"
              :show-all-levels="field.showAllLevels"
              :options="field.options"
              :props="field.configure"
              :placeholder="(rules && rules[field.name] && rules[field.name][0].required) ? (field.placeholder || `请选择${field.label}`) : ''" 
              ></el-cascader>
            </el-form-item>
          </el-col>
          <!-- 5.单选 -->
          <el-col :sm="field.sm || 24" :md="field.md || 12" :lg="field.lg || 8" v-if="field.isRender && field.holder === 'radio'" :key="index">
            <el-form-item :label="(field.i18n && $t(`LABEL_TEXT.${field.i18n}`)) || field.label" :prop="field.name" class="radioStyle">
              <el-radio-group v-model="mate.values[field.name]"
                @change="eventCfg[field.name] && eventCfg[field.name].change && handleChange(mate.values[field.name], field.name)"
                :disabled="rules && rules[field.name] && rules[field.name][0].disabled || field.disabled">
                <el-radio v-for="ra in field.radios" :label="ra.value" :key="ra.value">{{ra.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!-- 6.单选按钮 -->
          <el-col :sm="field.sm || 24" :md="field.md || 12" :lg="field.lg || 8" v-if="field.isRender && field.holder === 'radioButton'" :key="index">
            <el-form-item :label="(field.i18n && $t(`LABEL_TEXT.${field.i18n}`)) || field.label" :prop="field.name">
              <el-radio-group v-model="mate.values[field.name]" 
                @change="eventCfg[field.name] && eventCfg[field.name].change && handleChange(mate.values[field.name], field.name)"
                :disabled="rules && rules[field.name] && rules[field.name][0].disabled || field.disabled">
                <el-radio-button v-for="ra in item.radios" :label="ra.value" :key="ra.value">{{ra.label}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!-- 7.复选框组 -->
          <el-col :sm="field.sm || 24" :md="field.md || 12" :lg="field.lg || 8" v-if="field.isRender && field.holder === 'checkboxGroup'" :key="index">
            <el-form-item :label="(field.i18n && $t(`LABEL_TEXT.${field.i18n}`)) || field.label" :prop="field.name">
              <el-checkbox-group v-model="mate.values[field.name]" 
                @change="eventCfg[field.name] && eventCfg[field.name].change && handleChange(mate.values[field.name], field.name)"
                :disabled="rules && rules[field.name] && rules[field.name][0].disabled || field.disabled">
                <el-checkbox v-for="(item,index) in field.checkbox" :label="item.value" :key='index' :name="field.name">{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <!-- 7.1复选框组 Boolean -->
          <el-col :sm="field.sm || 24" :md="field.md || 12" :lg="field.lg || 8" v-if="field.isRender && field.holder === 'checkbox'" :key="index">
            <el-form-item :label="(field.i18n && $t(`LABEL_TEXT.${field.i18n}`)) || field.label" :prop="field.name">
              <el-checkbox  v-model="mate.values[field.name]" 
                @change="eventCfg[field.name] && eventCfg[field.name].change && handleChange(mate.values[field.name], field.name)"
                :disabled="rules && rules[field.name] && rules[field.name][0].disabled || field.disabled"
                ></el-checkbox>
            </el-form-item>
          </el-col>
          <!-- 8.开关 -->
          <el-col :sm="field.sm || 24" :md="field.md || 12" :lg="field.lg || 8" v-if="field.isRender && field.holder === 'switch'" :key="index">
            <el-form-item :label="(field.i18n && $t(`LABEL_TEXT.${field.i18n}`)) || field.label" :prop="field.name">
              <el-switch v-model="mate.values[field.name]" 
                @change="eventCfg[field.name] && eventCfg[field.name].change && handleChange(mate.values[field.name], field.name)"
                :disabled="rules && rules[field.name] && rules[field.name][0].disabled || field.disabled"
                :active-text="field.activeText"
                :active-value="field.activeValue"
                :active-color="field.activeColor"
                :inactive-text="field.inactiveText"
                :inactive-value="field.inactiveValue"
                :inactive-color="field.inactiveColor"></el-switch>
            </el-form-item>
          </el-col>
          <!-- 9.日期 -->
          <el-col :sm="field.sm || 24" :md="field.md || 12" :lg="field.lg || 8" v-if="field.isRender && field.holder === 'date'" :key="index">
            <el-form-item :label="(field.i18n && $t(`LABEL_TEXT.${field.i18n}`)) || field.label" :prop="field.name">
              <el-date-picker v-model="mate.values[field.name]" 
                type="date"
                :clearable="rules && rules[field.name] && !rules[field.name][0].required"
                @change="eventCfg[field.name] && eventCfg[field.name].change && handleChange(mate.values[field.name], field.name)"
                @clear="eventCfg[field.name] && eventCfg[field.name].change && handleClear(mate.values[field.name], field.name)"
                :disabled="rules && rules[field.name] && rules[field.name][0].disabled || field.disabled" 
                :readonly="formReadOnly || field.readonly" 
                :picker-options="field.pickerOptions"
                :value-format="field.format || 'yyyy-MM-dd'"
                :placeholder="(rules && rules[field.name] && rules[field.name][0].required) ? (field.placeholder || '请选择日期') : ''"
                ></el-date-picker>
            </el-form-item>
          </el-col>
          <!-- 10.日期时间 -->
          <el-col :sm="field.sm || 24" :md="field.md || 12" :lg="field.lg || 8" v-if="field.isRender && field.holder === 'datetime'" :key="index">
            <el-form-item :label="(field.i18n && $t(`LABEL_TEXT.${field.i18n}`)) || field.label" :prop="field.name">
              <el-date-picker v-model="mate.values[field.name]"
                type="datetime"
                :clearable="rules && rules[field.name] && !rules[field.name][0].required"
                @change="eventCfg[field.name] && eventCfg[field.name].change && handleChange(mate.values[field.name], field.name)"
                @clear="eventCfg[field.name] && eventCfg[field.name].change && handleClear(mate.values[field.name], field.name)"
                :disabled="rules && rules[field.name] && rules[field.name][0].disabled || field.disabled" 
                :readonly="formReadOnly || field.readonly"
                :picker-options="field.pickerOptions"
                :value-format="field.format || 'yyyy-MM-dd HH:mm:ss'" 
                :placeholder="(rules && rules[field.name] && rules[field.name][0].required) ? (field.placeholder || '请选择日期时间') : ''"
                ></el-date-picker>
            </el-form-item>
          </el-col>
          <!-- 11.时间 -->
          <el-col :sm="field.sm || 24" :md="field.md || 12" :lg="field.lg || 8" v-if="field.isRender && field.holder === 'time'" :key="index">
            <el-form-item :label="(field.i18n && $t(`LABEL_TEXT.${field.i18n}`)) || field.label" :prop="field.name">
              <el-time-picker v-model="mate.values[field.name]" 
                type="date"
                clearable 
                @change="eventCfg[field.name] && eventCfg[field.name].change && handleChange(mate.values[field.name], field.name)"
                @clear="eventCfg[field.name] && eventCfg[field.name].change && handleClear(mate.values[field.name], field.name)"
                :disabled="rules && rules[field.name] && rules[field.name][0].disabled || field.disabled" 
                :readonly="formReadOnly || field.readonly" 
                :picker-options="field.pickerOptions"
                :value-format="field.format || 'HH:mm:ss'" 
                :placeholder="(rules && rules[field.name] && rules[field.name][0].required) ? (field.placeholder || '请选择时间') : ''"
              ></el-time-picker>
            </el-form-item>
          </el-col>
          <!-- 12.数字词典 -->
          <el-col :sm="field.sm || 24" :md="field.md || 12" :lg="field.lg || 8" v-if="field.isRender && field.holder === 'dict'" :key="index">
            <el-form-item :label="(field.i18n && $t(`LABEL_TEXT.${field.i18n}`)) || field.label" :prop="field.name">
              <dict-selected v-model="mate.values[field.name]" 
                @input="handleType(mate.values[field.name],field.name)"
                :rowId="rules && rules[field.name] && rules[field.name][0].rowId || field.rowId"
                :initValue="mate.values[field.name]" 
                :filterable="field.filterable"
                :allow-create="field.allowCreate"
                :multiple="field.multiple" 
                :clearable="rules && rules[field.name] && !rules[field.name][0].required"
                :dictType="field.dict"
                :placeholder="(rules && rules[field.name] && rules[field.name][0].required) ? (field.placeholder || `请选择${field.label}`) : ''" 
                ></dict-selected>
            </el-form-item>
          </el-col>
          <!-- 13.库存组织 -->
          <el-col :sm="field.sm || 24" :md="field.md || 12" :lg="field.lg || 8" v-if="field.isRender && field.holder === 'orgUnit'" :key="index">
            <el-form-item :label="(field.i18n && $t(`LABEL_TEXT.${field.i18n}`)) || field.label" :prop="field.name">
              <org-selected v-model="mate.values[field.name]" :mate="mate"
                v-bind="$attrs" 
                v-on="$listeners" 
                :disabled="rules && rules[field.name] && rules[field.name][0].disabled || field.disabled"
                :initValue="mate.values[field.name]"
                :filterable="field.filterable"
                :clearable="rules && rules[field.name] && !rules[field.name][0].required"
                :multiple="field.multiple"
                :placeholder="(rules && rules[field.name] && rules[field.name][0].required) ? (field.placeholder || `请选择${field.label}`) : ''" 
                ></org-selected>
            </el-form-item>
          </el-col>
          <!-- 14.物料编码 -->
          <el-col :sm="field.sm || 24" :md="field.md || 12" :lg="field.lg || 8" v-if="field.isRender && field.holder === 'materials'" :key="index">
            <el-form-item :label="(field.i18n && $t(`LABEL_TEXT.${field.i18n}`)) || field.label" :prop="field.name">
              <el-input v-model="mate.values[field.name]"
                @change="eventCfg[field.name] && eventCfg[field.name].focus && handleChange(mate.values[field.name], field.name)"
                :disabled="rules && rules[field.name] && rules[field.name][0].disabled || field.disabled"
                :readonly="formReadOnly || field.readonly"
                :placeholder="(rules && rules[field.name] && rules[field.name][0].required) ? (field.placeholder || `请选择${field.label}`) : ''" 
                ><el-button slot="append" icon="el-icon-search" 
                  :disabled="rules && rules[field.name] && rules[field.name][0].disabled || field.disabled"
                  @click="handleSearch"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 15.省市区街道下拉 -->
          <el-col :sm="24" :md="24" :lg="24" v-if="field.isRender && field.holder === 'addressSelect'" :key="index">
            <address-selected :modelName="field.modelName" :vModel="mate.values" :disabled="field.disabled"></address-selected>
          </el-col>
          <!-- 16.分区标题 -->
          <el-col :sm="24" :md="24" :lg="24" v-if="field.isRender && field.holder === 'title'" :key="index">
            <h2 style="border-bottom: 1px solid #DDD;padding-bottom: 10px;">{{field.label}}</h2>
          </el-col>
          <!-- 17.按钮 -->
          <el-col :sm="24" :md="12" :lg="8" v-if="field.isRender && field.holder === 'button'" :key="index">
            <el-form-item :prop="field.name">
              <el-button :size="field.size || 'mini'" :type="field.type || 'primary'" @click.prevent.stop="handleClick(field.name)">{{field.label}}</el-button>
            </el-form-item>
          </el-col>
          <!-- 18.上传 -->
          <el-col :sm="field.sm || 24" :md="field.md || 24" :lg="field.lg || 12" v-if="field.isRender && field.holder === 'upload'" :key="index">
            <el-form-item :prop="field.name">
              <el-upload ref="upload"
                :accept="field.accept || uploadType"
                :action="`${uploadApiGateway}${field.action}`"
                :headers="headers"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-change="handleAttachmentChang"
                :file-list="fileList"
                :drag="field.drag"
                :list-type="field.listType || 'text'">
                <el-button size="mini" type="primary">上传附件</el-button>
                <!-- <el-button slot="trigger" size="mini" type="primary">选取附件</el-button>
                <el-button style="margin-left: 10px;" :size="field.size || 'mini'" :type="field.type || 'success'" @click="submitUpload">{{field.label}}</el-button> -->
                <div slot="tip" class="el-upload__tip">{{field.tip}}</div>
              </el-upload>
              </el-form-item>
          </el-col>
        </template>
      </el-form>
    </el-row>
    <!-- 物料搜索框-->
    <material-search v-if="searchDialogVisible" :orgId="orgId" :visible.sync="searchDialogVisible" @getMateInfo="getMaterialInfos"/>
  </div>
</template>

<script>
import { API_GATEWAY } from '@/config/index.js';

export default {
  components: {
    // 数字词典组件
    DictSelected: function index (resolve) {
      require(['../DictSelected.vue'], resolve)
    },
    //库存组织组件
    OrgSelected: function index (resolve) {
      require(['./OrgUnit/OrgUnitSelected.vue'], resolve)
    },
    // 物料编码搜索弹窗
    MaterialSearch: function index (resolve) {
      require(['../MaterialSearch.vue'], resolve)
    },
    // 省市区街道地址
    AddressSelected: function index (resolve) {
      require(['./AddressForm/AddressForm.vue'], resolve)
    },
  },
  props: {
    // 表单数据和字段配置
    mate: Object,
    //表单布局
    formLayout: {
      type: Array,
      default: () => { return [] }
    },
    formModel: {
      type: String,
      default: 'page'
    },
    // input-number按钮控件是否显示
    numBtnControls:{
      type: Boolean,
      default: false
    },
    // 表单尺寸：medium / small / mini 默认值mini
    size:{
      type: String,
      default: 'mini'
    },
    // 表单验证规则
    rules: {
      type: Object,
      default: null
    },
    // 控件事件配置
    eventCfg:{
      type: Object,
      default: () => { return {} }
    },
    filedReadOnly:{
      type: Boolean,
      default: false
    },
    orgId: {
      type: String,
      default: ""
    }
  },
  data () {
    return {
      formName: 'form',       // 表单 ref 名称
      form: {},
      labelPosition: 'right',
      searchDialogVisible: false,
      timeout: null,
      pickerOptions: {
        // 日期禁用今天之前的
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      headers: {
        'Authorization': `Bearer ${window.sessionStorage.getItem('token')}`,
        'Accept': 'application/json',
        'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId
      },
      fileList: [],
      uploadType: ".xlsx, .xls, .docx, .doc, .pdf",
      uploadApiGateway: API_GATEWAY
    }
  },
  computed: {
    formReadOnly(){
      return this.filedReadOnly || false;
    },
    // 计算宽度
    labelWidth: function() {
      // 字段 label 宽度
      let width = "";
      // 声明保存每个字段宽度数组,默认 120 和 mongodb配置的 labelWidth
      let labelLengthArr = [120, this.mate.labelWidth];
      // 遍历字段,计算每个字段的宽度并 push 到数组里
      this.mate.fields.forEach(field =>{
        let len = field.label.length*14 + 6;
        labelLengthArr.push(len);
      })
      // 先数组去重,再获取最大值作为字段 label 的宽度
      width = `${Math.max(...[...new Set(labelLengthArr)])}px`;
      return width;
    }
  },
  created () {
    // 数据初始化
    this.init();
  },
  mounted () {
  },
  methods: {
    /**
     * 监听字典修改
     */
    handleType (val,name) {
      this.$emit("typeChange",val,name)
    },
    /**
     * 数据初始化
     * @param void
     * @return void
     */
    init() {
      this.mate.fields.map((item) => { this.form[item.name] = item; });
      // 日期 pickerOptions 初始化
      this.mate.fields.forEach(item => {
        if (item.pickerOptions && typeof item.pickerOptions !='object') item.pickerOptions = this[item.pickerOptions];
      });
    },
    /**
     * input事件
     * 监听到事件发生
     * 防抖 输入完成后1秒 执行函数
     * @param {String} val 控件的值
     * @param {String} name 控件的name属性值
     * @return void
     */
    handleInput (val, name) {
      // val 去掉头尾空格
      val = this._trim(val);
      if(this.timeout !== null) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.$emit('events', 'input', val, name);
      }, 1000)
    },
    /**
     * 获取焦点事件
     * 监听到事件发生
     * @param {String} val 控件的值
     * @param {String} name 控件的name属性值
     * @return void
     */
    handleFocus (val, name) {
      // val 去掉头尾空格
      val = this._trim(val);
      this.$emit('events', 'focus', val, name);
    },
    /**
     * 失去焦点事件
     * 监听到事件发生
     * @param {String} val 控件的值
     * @param {String} name 控件的name属性值
     * @return void
     */
    handleBlur (val, name) {
      // val 去掉头尾空格
      val = this._trim(val);
      this.$emit('events', 'blur', val, name);
    },
    /**
     * change事件
     * 监听到事件发生
     * @param {String} val 控件的值
     * @param {String} name 控件的name属性值
     * @return void
     */
    handleChange (val, name) {
      // val 去掉头尾空格
      val = this._trim(val);
      this.$emit('events', 'change', val, name);
    },
    /**
     * 清空事件
     * 监听到事件发生
     * @param {String} val 控件的值
     * @param {String} name 控件的name属性值
     * @return void
     */
    handleClear (val, name) {
      // val 去掉头尾空格
      val = this._trim(val);
      this.$emit('events', 'clear', val, name);      
    },
    /**
     * 下拉框显示事
     * 监听到事件发生
     * @param {String} val 控件的值
     * @param {String} name 控件的name属性值
     * @return void
     */
    handleVisibleChange (val, name) {
      // val 去掉头尾空格
      val = this._trim(val);
      this.$emit('events', 'visibleChange', val, name);
    },
    /**
     * 移除tag事件
     * 监听到事件发生
     * @param {String} val 控件的值
     * @param {String} name 控件的name属性值
     * @return void
     */
    handleRemoveTag (val, name) {
      // val 去掉头尾空格
      val = this._trim(val);
      this.$emit('events', 'removeTag', val, name);
    },
    /** 去空格
     * @param {Any} val 控件的值
     * @return val 控件的值
     */
    _trim (val){
      return val = (typeof(val) != "number" && typeof(val) != "object") ? val.trim() : val;
    },
    /**
     * 重置弹窗表单
     * 数据清空，验证信息重置
     * @param {String} formName 需要重置的表单 ref 名称
     * @return void
     */
    resetForm (formName) {
      let name = formName || this.formName;
      this.$refs[name].resetFields();
    },
    /**
     * 重置弹窗表单
     * 验证信息重置
     * @param {String} formName 需要重置的表单 ref 名称
     * @return void
     */
    clearForm (formName) {
      let name = formName || this.formName;
      this.$refs[name].clearValidate();
    },
    /** 无聊弹窗显示
     * @param void
     * @return void
     */
    handleSearch(){
      this.searchDialogVisible = true;
    },
    /** 无聊弹窗显示
     * @param void
     * @return void
     */
    handleClick(name){
      this.$emit('formBtnClick', name);
    },
    /** 获取物料信息
     * 把物料信息合并到 meta form值里
     * @param {Object} 物料信息
     * @return void
     */
    getMaterialInfos({subcode, id, name, materialCategory, basicUnit, snp, ...data}){
      this.mate.values = {
        ...this.mate.values,
        'materialId' : id,
        'materialsCode': subcode,
        'materialsName': name,
        'specs': materialCategory,
        'unit': basicUnit,
        'snp' : snp
      }
      let params = this.mate.values
      this.$bus.emit('getMaterialData', params)
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      let files = this.handleFiles(fileList);
      this.$emit('events','change', files, 'files')
    },
    handlePreview(file) {
      
    },
    handleAttachmentChang(file, fileList){
      if(!file.response) return;
      let files = this.handleFiles(fileList);
      this.$emit('events','change', files, 'files')
    },
    handleFiles(fileList){
      return fileList.map(item =>{
        let data;
        let { name, response } = item;
        return data = {
          fileName: name,
          fileUrl: response,
          name,
          response
        }
      })
    },
  },
  watch: {
    'mate.values.files': {
      handler(curVal, oldVal) {
        if(curVal){
          if(typeof curVal == 'string'){
            this.fileList = JSON.parse(curVal);
          }else{
            this.fileList = curVal;
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
  @import "@/assets/css/baseForm.scss"
</style>
