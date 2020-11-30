<template>
  <div>
    <div class="tbutton">
      <el-button plain class="el-icon-document"  @click="handleSubmit">{{word}}</el-button>     <!--默认为提交，如果有需要可以将其设置为查询-->
      <el-button plain class="el-icon-close" @click="backward" v-if="!mate.inline">取 消</el-button>
      <el-button  plain class="el-icon-date"  @click="resetForm('ruleForm')">重 置</el-button>
    </div>
  <el-row>
  <el-form size="mini" :model="mate.values" :inline="mate.inline" :label-position="labelPosition" :rules="rules" ref="ruleForm" :label-width="labelWidth">
    <template v-for="field of mate.fields">

      <!--客户编码会用到-->
      <el-col :sm="12" :md="8" :lg="8">
        <el-form-item :label="field.label" :prop="field.name" v-if="field.holder == 'text' && !field.type && field.disabled !== 'disabled'">
          <el-input v-model="mate.values[field.name]" :placeholder="field.placeholder"></el-input>
        </el-form-item>
      </el-col>
      <el-col :sm="12" :md="8" :lg="8">
        <el-form-item :label="field.label" :prop="field.name" v-if="field.holder === 'text' && field.type === 'number'">
          <el-input-number v-model="mate.values[field.name]" :controls="false" :placeholder="field.placeholder"></el-input-number>
        </el-form-item>
      </el-col>
      
      <!--客户名称会用到-->
      <el-col :sm="12" :md="8" :lg="8">
        <el-form-item :rules="[
            { required: true, message: '客户名称不能为空'},
            { validator: validateNameCustomer, trigger: 'blur' }
          ]" 
        :label="field.label" :prop="field.name" v-if="field.holder == 'textCustomer' && field.disabled !== 'disabled'">
          <el-input v-model="mate.values[field.name]" :placeholder="field.placeholder"></el-input>
        </el-form-item>
      </el-col>

      <el-col :sm="12" :md="8" :lg="8">
        <el-form-item :label="field.label" :prop="field.name" v-if="field.holder == 'text' && field.disabled == 'disabled'">
          <el-input disabled v-model="mate.values[field.name]" :placeholder="field.placeholder"></el-input>
        </el-form-item>
      </el-col>

      <!--供应商名称会用到 远程校验-->
      <el-col :sm="12" :md="8" :lg="8">
        
        <el-form-item :rules="[
            { required: true, message: '供应商名称不能为空'},
            { validator: validateNameSupplier, trigger: 'blur' }
          ]" 
        :label="field.label" :prop="field.name" v-if="field.holder == 'textSupplier' && field.disabled !== 'disabled'">
          <el-input v-model="mate.values[field.name]" :placeholder="field.placeholder"></el-input>
        </el-form-item>
      </el-col>

       <el-col :sm="12" :md="8" :lg="8">
        
        <el-form-item :rules="[
            { required: true, message: '角色名称不能为空'},
            { validator: validateUserName, trigger: 'blur' }
          ]" 
        :label="field.label" :prop="field.name" v-if="field.holder == 'textUserName' && field.disabled !== 'disabled'">
          <el-input v-model="mate.values[field.name]" :placeholder="field.placeholder" ></el-input>
        </el-form-item>
      </el-col>
      
      <el-col :sm="12" :md="8" :lg="8">
        
        <el-form-item :rules="[
            { required: true, message: '机构名称不能为空'},
            { validator: validateOfficeName, trigger: 'blur' }
          ]" 
        :label="field.label" :prop="field.name" v-if="field.holder == 'textOfficeName' && field.disabled !== 'disabled'">
          <el-input v-model="mate.values[field.name]" :placeholder="field.placeholder" :disabled="showOffice"></el-input>
        </el-form-item>
      </el-col>


      <el-col :sm="12" :md="8" :lg="8">     
        <el-form-item :rules="[
            { required: true, message: '机构编码不能为空'},
            { validator: validateOfficeCode, trigger: 'blur' }
          ]" 
        :label="field.label" :prop="field.name" v-if="field.holder == 'textOfficeCode' && field.disabled !== 'disabled'">
          <el-input v-model="mate.values[field.name]" :placeholder="field.placeholder" :disabled="showOffice"></el-input>
        </el-form-item>
      </el-col>
      <!--仓库编码-->
      <el-col :sm="12" :md="8" :lg="8">  
      <el-form-item 
        :label="field.label" :prop="field.name" v-if="field.holder == 'textLocationCode' && field.disabled !== 'disabled'">
          <el-input v-model="mate.values[field.name]" :placeholder="field.placeholder" :disabled="showLocation"></el-input>
        </el-form-item>
      </el-col>
      <!--储位编码-->
      <el-col :sm="12" :md="8" :lg="8">
      <el-form-item
        :label="field.label" :prop="field.name" v-if="field.holder == 'textChuweiCode' && field.disabled !== 'disabled'">
          <el-input v-model="mate.values[field.name]" :placeholder="field.placeholder" :disabled="showChuwei"></el-input>
        </el-form-item>
      </el-col>
      <el-col :sm="12" :md="8" :lg="8">
        <el-form-item :rules="[
            { required: true, message: '组织机构代码不能为空'},
          ]"
        :label="field.label" :prop="field.name" v-if="field.holder == 'textOrganizingCode' && field.disabled !== 'disabled'">
          <el-input v-model="mate.values[field.name]" :placeholder="field.placeholder" ></el-input>
        </el-form-item>
      </el-col>
      <el-col :sm="12" :md="8" :lg="8">
        <el-form-item :rules="codeCreditRule"
        :label="field.label" :prop="field.name" v-if="field.holder == 'codeCredit' && field.disabled !== 'disabled'">
          <el-input v-model="mate.values[field.name]" :placeholder="field.placeholder" ></el-input>
        </el-form-item>
      </el-col>
      <!--用来判断是否需要输入的是数字 -->
      <el-col :sm="12" :md="8" :lg="8">
        <el-form-item :label="field.label" :prop="field.name" v-if="field.holder == 'textNum'">
          <el-input v-model.number="mate.values[field.name]" :placeholder="field.placeholder"></el-input>
        </el-form-item>
      </el-col>
      <el-col :sm="12" :md="8" :lg="8">
        <el-form-item :label="field.label" :prop="field.name" v-if="field.holder == 'password'">
          <el-input type="password" v-model="mate.values[field.name]" auto-complete="off"></el-input>
        </el-form-item>
      </el-col>
      <el-col :sm="12" :md="8" :lg="8">
        <el-form-item :label="field.label" :prop="field.name" v-if="field.holder == 'select' && !field.hide">
          <el-select clearable v-model="mate.values[field.name]" :placeholder="field.placeholder" :multiple="field.multiple">
            <el-option :label="item.label" :value="item.value" v-for="item of field.options" :key= "item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
        <!--区域类型-->
        <el-col :sm="12" :md="8" :lg="8">
        <el-form-item :label="field.label" :prop="field.name" v-if="field.holder == 'areaSelect' && !field.hide">
          <el-select :disabled="showArea" v-model="mate.values[field.name]" :placeholder="field.placeholder" :multiple="field.multiple">
            <el-option :label="item.label" :value="item.value" v-for="item of field.options" :key= "item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

        <!-- <el-col :sm="12" :md="8" :lg="8">
        <el-form-item :label="field.label" :prop="field.name" v-if="field.holder == 'select' && !field.hide">
          <el-select clearable v-model="mate.values[field.name]" :placeholder="field.placeholder" :multiple="field.multiple">
            <el-option :label="item.label" :value="item.value" v-for="item of field.options" :key= "item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-col> -->
      
      <el-col :sm="12" :md="8" :lg="8">
        <el-form-item :label="field.label" :prop="field.name" v-if="field.holder == 'iconselect'">
          <el-select clearable v-model="mate.values[field.name]" filterable :placeholder="field.placeholder">
            <el-option
              v-for="item in field.options"
              :label="item.label"
              :value="item.value"
              :key= "item.name">
              <i :class="item.value">{{ item.label }}</i>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :sm="12" :md="8" :lg="8">
        <el-form-item  :label="field.label" :prop="field.name" v-if="field.holder == 'date'">
          <el-date-picker clearable type="date" v-model="mate.values[field.name]" :placeholder="field.placeholder"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :sm="12" :md="8" :lg="8">
        <el-form-item :label="field.label" :prop="field.name" v-if="field.holder == 'time'">
          <el-time-picker clearable type="fixed-time" v-model="mate.values[field.name]" :placeholder="field.placeholder"></el-time-picker>
        </el-form-item>
      </el-col>
      <el-col :sm="12" :md="8" :lg="8">
        <el-form-item :label="field.label" v-if="field.holder == 'switch'">
          <el-switch  v-model="mate.values[field.name]" 
                :active-text="field.activeText"
                :active-value="field.activeValue"
                :inactive-text="field.inactiveText"
                :inactive-value="field.inactiveValue"></el-switch>
        </el-form-item>
      </el-col>
      <el-col :sm="12" :md="8" :lg="8">
        <el-form-item :label="field.label" :prop="field.name" v-if="field.holder == 'checkbox'">
          <el-checkbox-group v-model="mate.values[field.name]">
            <el-checkbox :label="item.label" :name="field.name" v-for="item of field.options" :key= "item.name"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
      <el-col :sm="12" :md="8" :lg="8">
        <el-form-item :label="field.label" :prop="field.name" v-if="field.holder == 'radio'" class="radio_label_height">
          <el-radio-group v-model="mate.values[field.name]">
            <el-radio :label="item.value" v-for="item of field.options" :key= "item.name">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :sm="12" :md="8" :lg="8">
        <el-form-item :label="field.label" :prop="field.name" v-if="field.holder == 'textarea'">
          <el-input type="textarea" v-model="mate.values[field.name]"></el-input>
        </el-form-item>
        </el-col>
      <el-col :sm="12" :md="8" :lg="8">
        <el-form-item :label="field.label" :prop="field.name" v-if="field.holder == 'upload'">
          <el-upload
            ref="upload"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :auto-upload="false">
            <el-button slot="trigger" size="mini">选取文件</el-button>
          </el-upload>
        </el-form-item>
      </el-col>
      <el-col :sm="12" :md="8" :lg="8">
        <el-form-item :label="field.label" :prop="field.name" v-if="field.holder == 'cascader'">
          <k-cascader
            :options="options"
            v-model="mate.values[field.name]"
            >
          </k-cascader>
        </el-form-item>
      </el-col>
      <el-col :sm="12" :md="8" :lg="8">
        <el-form-item  :label="field.label" :prop="field.name" v-if="field.holder === 'country'">
          <country-select v-model="mate.values[field.name]" @input="inputChange" ref="CountrySelect" :customerAdd="customerAdd"></country-select>
        </el-form-item>
      </el-col>

      <el-col :sm="12" :md="8" :lg="8">
        <el-form-item :label="field.label" v-if="field.holder === 'province'">
          <addrselect
              :disabledFlag="disabledFlag"
              :initselectedvalue="initprovselectedvalue"
              :addrs="provAddrs"
              v-model="mate.values[field.name]"
              @change="provChange"
              class="select-31"
              id="prov_select"
              name="prov" lazy>
          </addrselect>
        </el-form-item>
      </el-col>
      <el-col :sm="12" :md="8" :lg="8">
        <el-form-item :label="field.label" v-if="field.holder === 'city'">
        <addrselect
            :disabledFlag="disabledFlag"
            :initselectedvalue="initcityselectedvalue"
            :addrs="cityAddrs"
            v-model="mate.values[field.name]"
            @change="cityChange"
            class="select-31"
            id="city_select"
            name="city" lazy>
        </addrselect>
        </el-form-item>
      </el-col>
      <el-col :sm="12" :md="8" :lg="8">
        <el-form-item :label="field.label" v-if="field.holder === 'county'">
          <addrselect
              :disabledFlag="disabledFlag"
              :initselectedvalue="initregionselectedvalue"
              :addrs="regionAddrs"
              v-model="mate.values[field.name]"
              @change="regionChange"
              class="select-31"
              id="region_select"
              name="region" lazy>
            </addrselect>
        </el-form-item>
      </el-col>
      <el-col :sm="12" :md="8" :lg="8">
        <el-form-item :label="field.label" :prop="field.name" v-if="field.holder == 'treeSelect' && !field.hide">
          <tree-select
            :removeUrl="field.removeUrl"
            :treeProps="field.treeProps"
            v-model="mate.values[field.name]"
            :multiple="false"
            :placeholder="field.placeholder"
          >
          </tree-select>
        </el-form-item>
      </el-col>
      
      <el-col :sm="12" :md="8" :lg="8">
        <el-form-item v-if="field.holder == 'dict'" :prop="field.name" :label="field.label">
          <dict-selected :initValue="mate.values[field.name]"  v-model="mate.values[field.name]" :placeholder="field.placeholder" :multiple="field.multiple" :dictType="field.type"></dict-selected>
        </el-form-item>
      </el-col>

      <el-col :sm="12" :md="8" :lg="8">
        <el-form-item v-if="field.isRender && field.holder == 'otherDict'" :prop="field.name" :label="field.label">
          <dict-selected
          :initValue="mate.values[field.name]" 
          v-model="mate.values[field.name]"
          :placeholder="field.placeholder"
          :multiple="field.multiple"
          :dictType="field.type"
          @input="handleType(mate.values[field.name],field.name)"
          ></dict-selected>
        </el-form-item>
      </el-col>

      <el-col :sm="12" :md="8" :lg="8">
        <el-form-item v-if="field.holder == 'locationDict'" :prop="field.name" :label="field.label"  :rules="{ required: true, message: '储位类型不能为空'}" >
          <dict-selected :initValue="mate.values[field.name]"  v-model="mate.values[field.name]" :placeholder="field.placeholder" :multiple="field.multiple" :dictType="field.type"></dict-selected>
        </el-form-item>
      </el-col>

      <el-col :sm="12" :md="8" :lg="8">
        <!--机构管理类型-->
        <el-form-item v-if="field.holder == 'typeDict'" :prop="field.name" :label="field.label" :rules="[
            { required: true, message: '机构类型不能为空'},
            { validator: validateOfficeName, trigger: 'blur' }
          ]" >
        <el-select :disabled="showType" v-model="mate.values[field.name]" :placeholder="field.placeholder" :multiple="field.multiple">
            <el-option :label="item.label" :value="item.value" v-for="item of field.options" :key= "item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <!--仓库管理库存组织-->
      <el-col :sm="12" :md="8" :lg="8">
        <el-form-item :label="field.label" :prop="field.name" v-if="field.holder == 'orgIdSelect'">
          <el-select clearable v-model="mate.values[field.name]" :placeholder="field.placeholder" :multiple="field.multiple" :disabled="showLocation">
            <el-option :label="item.label" :value="item.value" v-for="item of orgIdOptions" :key= "item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :sm="12" :md="8" :lg="8">
        <el-form-item :label="field.label" :prop="field.name" v-if="field.holder == 'orgIdNameSelect'">
          <el-select clearable v-model="mate.values[field.name]" :placeholder="field.placeholder" :multiple="field.multiple" :disabled="showOrgIdNameSelect">
            <el-option :label="item.label" :value="item.value" v-for="item of orgOptions" :key= "item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :sm="12" :md="8" :lg="8">
        <el-form-item v-if="field.holder == 'cascaderC'" :label="field.label" :prop="field.name">
          <el-cascader :options="optionsValue" expand-trigger="hover" change-on-select v-model="mate.values[field.name]" @change="handleChange"></el-cascader>
        </el-form-item>    
      </el-col>

      <w-editor v-if="field.holder == 'editor'" v-model="mate.values[field.name]"></w-editor>
    </template>
  
  </el-form>
  </el-row>

  </div>
</template>
<script>

import sha1 from 'node-sha1'
import treeSelect from './tree-select/tree.vue'
import CountrySelect from './CountrySelect.vue'
import addrArr from './address/addr-arr.js'
import Addrselect from './address/Addrselect'
// 根据id获取市/区数据函数，动态，经常改变
function getAddrsArrayById (id = 0) {
  return addrArr[id].map(item => {
    return {
      'text': item[1],
      'value': item[0]
    }
  })
}

export default {
  data () {
    return {
      initName: '',              // 客户，供应商修改之时的名字
      industryCategoryValue: '',        // 行业细分类的问题
      disabledFlag: false,
      fileList: [],
      defaultValues: {},
      showArea: false,
      dialogVisible: false,
      showLocation: false,
      showOrgIdNameSelect: false,
      showUser: false,
      showOffice: false,
      showChuwei: false,
      orgIdOptions: [],
      orgOptions: [],
      showType: false,
      treeSelectModel: '',
      customerAdd: {},
      codeCreditRule:  { required: true, message: '请填写信息'},
      labelPosition: 'right',
      treeSelectArr: [],
      treeSelected: '',
      initprovselectedvalue: '0',
      initcityselectedvalue: '0',
      initregionselectedvalue: '0',
      provSelected: '',
      citySelected: '',
      regionSelected: '',
      provAddrs: getAddrsArrayById(0),
      cityAddrs: [],
      regionAddrs: [],
      optionsValue: []
    }
  },
  props: {
    word: {
      default: '提 交'
    },
    mate: Object,
    warehouseId: String,
    formModel: {
      type: String,
      default: 'page' // page or dialog
    },
    rowId: String,
    option: {
      type: Object,
      default: () => {}
    },
    treeDatas: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    'rowId': function (val, oldVal) {
      var vm = this
      if (val !== '') {
        vm.orgIdOptions = []
        this.showLocation = true
        this.showChuwei = true
        this.$root.ajaxData('/org/inventory/getOrgByOfficeId?ids=', {}, function (data) {
          data.map((i) => {
            vm.orgIdOptions.push({ 'label': i.name, 'value': i.id })
          })
        })
      } else {
        vm.orgIdOptions = []
        this.showLocation = false
        this.showChuwei = false
        this.$root.ajaxData('/org/inventory/getOrgByOfficeId?ids=', {}, function (data) {
          data.map((i) => {
            vm.orgIdOptions.push({ 'label': i.name, 'value': i.id })
          })
        })
      }
    }
  },
  updated () {
    this.$nextTick(function () {
    })
  },
  created () {
    this.initName = this.mate.values.name
    var vm = this
    if (this.mate.inline) {
      this.defaultValues = this.mate.values
    }
    if (this.mate.values.country) {
      this.customerAdd = { 'nameZH': this.mate.values.country }
    }
    if ('industryCategory' in this.mate.values) {
      this.$root.ajaxData('/trees/type/all', {}, function (data) {
        vm.optionsValue = data
      }, 'GET')
      if (this.mate.values.industryCategory === '' && 'industryCategory' in this.mate.values) {
        this.mate.values.industryCategory = []
      } else if (this.mate.values.industryCategory !== '' && 'industryCategory' in this.mate.values) {
        if (this.mate.values.industryCategory) {
          if (this.mate.values.industryCategory.length) {
            this.mate.values.industryCategory = this.mate.values.industryCategory.split(',')
          }
        }
      }
    }
    this.$root.ajaxData('/org/inventory/getOrgByOfficeId?ids=', {}, function (data) {
      data.map((i) => {
        vm.orgOptions.push({ 'label': i.name, 'value': i.id })
      })
    })
    // 机构管理类型
    if ('deputyPerson' in this.mate.values) {
      if (this.mate.values.pid === '' || this.mate.values.pid === '0') {
        this.$set(this.mate.values, 'type', '0')
        this.showType = true
      } else {
        for (var i = 0; i < this.mate.fields.length; i++) {
          if (this.mate.fields[i].holder === 'typeDict') {
            this.mate.fields[i].options.splice(0, 1)
          }
        }
      }
    }
    // 区域类型
    if ('areaCode' in this.mate.values) {
      if (this.mate.values.pid === '' || this.mate.values.pid === '0') {
        this.$set(this.mate.values, 'type', '1')
        this.showArea = true
      } else {
        this.$root.ajaxData('/areas/getById/' + this.mate.values.pid, {}, function (data) {
          if (data.data.type === '2') {
            vm.$set(vm.mate.values, 'type', '3')
            vm.showArea = true
          } else if (data.data.type === '3') {
            vm.$set(vm.mate.values, 'type', '3')
            vm.showArea = true
          } else if (data.data.type === '1') {
            vm.$set(vm.mate.values, 'type', '2')
            vm.showArea = true
          }
        })
      }
    }
    if ('locationControl' in this.mate.values) {
      this.$root.ajaxData('/org/inventory/getOrgByOfficeId?ids=', {}, function (data) {
        data.map((i) => {
          vm.orgIdOptions.push({ 'label': i.name, 'value': i.id })
        })
      })
    }
    // 显示省市县的数据，在data里，调用的函数是为了找到text，这里是将value值
    if (this.mate.values.province !== '') {
      this.initprovselectedvalue = this.mate.values.province
    }
    if (this.mate.values.city !== '') {
      this.initcityselectedvalue = this.mate.values.city
      this.cityAddrs = getAddrsArrayById(this.mate.values.province)
    }
    if (this.mate.values.county !== '') {
      this.initregionselectedvalue = this.mate.values.county
      this.regionAddrs = getAddrsArrayById(this.mate.values.city)
    }
    if (this.mate.values.id) {
      this.showUser = true
      this.showOffice = true
      this.showOrgIdNameSelect = true
    } else {
      this.showUser = false
      this.showOffice = false
      this.showOrgIdNameSelect = false
    }
    if (this.rowId === undefined) {
      return
    }
    if (this.rowId !== '') {
      vm.orgIdOptions = []
      this.showLocation = true
      this.showChuwei = true
      this.$root.ajaxData('/org/inventory/getOrgByOfficeId?ids=', {}, function (data) {
        data.map((i) => {
          vm.orgIdOptions.push({ 'label': i.name, 'value': i.id })
        })
      })
    } else {
      vm.orgIdOptions = []
      this.showLocation = false
      this.showChuwei = false
      this.$root.ajaxData('/org/inventory/getOrgByOfficeId?ids=', {}, function (data) {
        data.map((i) => {
          vm.orgIdOptions.push({ 'label': i.name, 'value': i.id })
        })
      })
    }
  },
  components: {
    CountrySelect,
    Addrselect,
    treeSelect,
    'w-editor': function index (resolve) {
      require(['./WEditor.vue'], resolve)
    },
    KCascader: function index (resolve) {
      require(['./KCascader.vue'], resolve)
    },
    'dict-selected': function index (resolve) {
      require(['./DictSelected.vue'], resolve)
    }
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
      } else if (this.mate.labelWidth === null) {
        width = '120px'
      } else {
        width = this.mate.labelWidth
      }
      return width
    },
    rules () {
      var rs = {}
      var vm = this
      var rls = this.mate.rules
      for (var index in rls) {
        var r = []
        var rule = rls[index]
        for (var i in rule) {
          var nv = rule[i]
          if (nv.validator) {
            nv.validator = vm[nv.validator]
          }
          r[i] = nv
        }
        rs[index] = r
      }
      return rs
    }
  },
  methods: {
    /**
     * 监听字典修改
     */
    handleType (val,name) {
      this.$emit("typeChange",val,name)
    },
    handleChange (value) {
      this.industryCategoryValue = value.join(',')
    },
     // 校验客户名称不能相同
    validateNameCustomer (rule, value, callback) {
      var vm = this
      // if (this.mate.values.id)
      if (!this.mate.values.id) {
        this.$root.ajaxData('/companys/validName/4?name=' + value, {}, function (data) {
          if (data !== '') {
            if (data === false || data.body === false) {
              callback(new Error('您输入的客户已存在'))
            } else if (data === true || data.body === true) {
              callback()
            }
          }
        }, 'GET')
      } else if (this.mate.values.id) {
        this.$root.ajaxData('/companys/validName/4?name=' + value, {}, function (data) {
          if (data !== '') {
            if (data === false || data.body === false) {
              if (vm.initName === value) {
                callback()
              } else {
                callback(new Error('您输入的客户已存在'))
              }
            } else if (data === true || data.body === true) {
              callback()
            }
          }
        }, 'GET')
      }
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    // 校验供应商名称不能相同
    validateNameSupplier (rule, value, callback) {
      if (!this.mate.values.id) {
        this.$root.ajaxData('/companys/validName/3?name=' + value, {}, function (data) {
          if (data !== '') {
            if (data === false || data.body === false) {
              callback(new Error('您输入的供应商已存在'))
            } else if (data === true || data.body === true) {
              callback()
            }
          }
        }, 'GET')
      } else if (this.mate.values.id) {
        this.$root.ajaxData('/companys/validName/3?name=' + value, {}, function (data) {
          if (data !== '') {
            if (data === false || data.body === false) {
              callback()
            } else if (data === true || data.body === true) {
              callback()
            }
          }
        }, 'GET')
      }
    },
    validateUserName (rule, value, callback) {
      if (!this.mate.values.id) {
        this.$root.ajaxData('/roles/checkRoleName?roleName=' + value, {}, function (data) {
          if (data.statusCode === 40014) {
            callback(new Error('您输入的角色已存在'))
          } else {
            callback()
          }
        }, 'GET')
      } else if (this.mate.values.id) {
        callback()
      }
    },
    validaeUnique (rule, value, callback) {
      if (!this.mate.values.id) {
        this.$root.ajaxData('/dc/local/check/code?code=' + value + '&warehouseId=' + this.warehouseId, {}, function (data) {
          if (data === 1) {
            callback(new Error('您输入的储位编码已存在'))
          } else {
            callback()
          }
        }, 'GET')
      } else if (this.mate.values.id) {
        callback()
      }
    },
    validaeLocationUnique (rule, value, callback) {
      if (!this.mate.values.id) {
        this.$root.ajaxData('/dc/checkCode?code=' + value, {}, function (data) {
          if (data.statusCode === 40017) {
            callback(new Error('您输入的仓库编码已存在'))
          } else {
            callback()
          }
        }, 'GET')
      } else if (this.mate.values.id) {
        callback()
      }
    },
    validateOfficeName (rule, value, callback) {
      if (!this.mate.values.id) {
        this.$root.ajaxData('/offices/checkName?officeName=' + value, {}, function (data) {
          if (data.statusCode === 40015) {
            callback(new Error('您输入的机构已存在'))
          } else {
            callback()
          }
        }, 'GET')
      } else if (this.mate.values.id) {
        callback()
      }
    },
    validateOfficeCode (rule, value, callback) {
      if (!this.mate.values.id) {
        this.$root.ajaxData('/offices/checkCode?officeCode=' + value, {}, function (data) {
          if (data.statusCode === 40016) {
            callback(new Error('您输入的机构编码已存在'))
          } else {
            callback()
          }
        }, 'GET')
      } else if (this.mate.values.id) {
        callback()
      }
    },
    // 原产国，改变的数据在这里可以显示，在这里判断，如果选择的是中国，省市县就可以使用，或者就不能显示
    inputChange (val) {
      this.customerAdd = { 'nameZH': val }
      if (val === this.$t('China')) {
        this.disabledFlag = false
        this.codeCreditRule = { required: true, message: '请填写信息'}
      } else {
        this.codeCreditRule = {}
        this.disabledFlag = true
        this.initprovselectedvalue = ''
        this.initcityselectedvalue = ''
        this.initregionselectedvalue = ''
      }
    },
    provChange (val) {
      const oldVal = this.mate.values.province
      if (val !== '') {
        if (val !== oldVal) {
          if (val !== '0' && val !== 0) {
            this.cityAddrs = getAddrsArrayById(val)
          } else {
            this.cityAddrs = []
          }
          this.citySelected = '0'
        }
      } else {
        this.cityAddrs = []
      }
      this.mate.values.province = val
    },
    cityChange (val) {
      const oldVal = this.mate.values.city
      if (val !== '') {
        if (val !== oldVal) {
          if (val !== '0' && val !== 0) {
            this.regionAddrs = getAddrsArrayById(val)
          } else {
            this.regionAddrs = []
          }
          this.regionSelected = '0'
        }
      } else {
        this.regionAddrs = []
      }
      this.mate.values.city = val
    },
    regionChange (val) {
      this.mate.values.county = val
    },
    // upload start
    handleRemove (file, fileList) {
    },
    handlePreview (file) {
    },
    // upload end
    handleReset () {
      this.$refs.ruleForm.resetFields()
    },
    backward () {
      this.$emit('dialog-cancel')
      if (this.formModel === 'page') {
        this.$root.monitor({ url: this.mate.next })
      }
    },
    handleSubmit (ev) {
      var vm = this
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 新增,密码加密;修改不提供密码更改，请使用找回密码功能修改密码
          if (this.mate.values.password) {
            this.mate.values['password'] = sha1(this.mate.values.password)
          }
          let url = vm.mate.url
          if (vm.mate.values.country !== this.$t('China')) {
            vm.mate.values.province = ''
            vm.mate.values.city = ''
            vm.mate.values.county = ''
          } 
          vm.mate.values.industryCategory = this.industryCategoryValue
          vm.mate.values.warehouseId = this.warehouseId
          vm.mate.values.status = vm.mate.values.status || 1; // 修改选择无效时提交后认为有效 2019-11-08
          const values = vm.mate.values
          if (vm.mate.inline) {
            vm.$emit('search', values)
            vm.mate.values = vm.defaultValues
          } else {
            // PUT 请求URL带上ID
            if ((vm.mate.method) === 'PUT' && values.id) {
              url = url + '/' + values.id
            }
            if ( (vm.mate.method) === 'PUT' && vm.mate.updateUrl) {
              url = vm.mate.updateUrl + '/' + values.id
            }
            const act = { url: url, ajax: true, method: vm.mate.method }
            act.next = this.mate.next || false
            this.$root.action(act, values, function (data) {
              if (data && data.next) {
                act.next = data.next
              }
            })
            vm.$emit('submit', act, values)
          }
        } else {
          this.$notify.error({
            title: '消息',
            message: '数据验证未通过'
          })
          return false
        }
      })
    },
    validatePassword (rule, value, callback) {
      if (value !== this.mate.values[rule.name]) {
        callback(new Error(rule.message || '两次输入密码不一致!'))
      } else {
        callback()
      }
    },
    validateAsync (rule, value, callback) {
      this.$http.get(
        rule.url,
        value
      ).then(function (data) {
        if (data.status) {
          callback(null)
        } else {
          callback(new Error(data.error || rule.message || '请修改'))
        }
      }, function (error) {
        callback(new Error(error))
      })
    },
    validateCascader (rule, value, callback) {
      if (value.length < 1) {
        callback(new Error(rule.message || '请选择'))
      } else {
        callback()
      }
    },
    treeSelectedHandler (fieldName, value) {
      this.mate.values[fieldName] = value
    }
  }
}
</script>

<style scoped lang="scss">
.el-form-item {
    margin: 15px 20px 2px 0px;
}
.el-form-item__error{
  top: inherit;
  left: inherit;
}
.el-form-item__label{
  line-height:inherit
}
.tbutton {
  margin: 3px 0;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}
.el-form-item--mini.el-form-item {
  margin: 6px;
}
.radio_label_height /deep/ .el-form-item__label{
  height: 29px;
}
.el-input--mini .el-input__inner{
  width:80%
}
.el-input-number--mini {
  width: 100%;
}
.el-input-number.is-without-controls /deep/ .el-input__inner {
  text-align: left;
}
.el-textarea{
  width: 100%
}
.el-input__suffix {
  right:80px
}
.ats-tree .ats-input{
  width:80%
}
.el-dialog__header {
  padding: 10px 10px 0;
}
.el-dialog__body {
  padding: 10px 10px;
}
.el-button--mini {
  padding: 7px 9px;
}
.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 100%;
}
.el-cascader--mini{
  width: 100%
}
.el-select {
  width: 100%;
}
</style>
