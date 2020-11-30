<template><!-- 物料管理 -->
<el-row>
  <el-form size="mini" class="materialsFormClass" :model="materialsForm" :rules="rules" ref="ruleForm" :label-width="labelWidth" :labelPosition="labelPosition">
    <el-tabs type="card" @tab-click="handleClick">
      <el-tab-pane :label="mate.tabs[0].name">
        <div class="wrap_div">
           <el-col :sm="12" :md="8" :lg="8">
            <el-form-item  :label="object['subcode'].label" :prop="object['subcode'].name">
              <el-input   :disabled="showSubcode" v-model="materialsForm.subcode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item label="库存组织" :prop="object['orgId'].name">
              <el-select size="mini" collapse-tags :disabled="showDisabled" filterable multiple v-model="materialsForm.orgId" >
                <el-option  :label="item.label" :value="item.value" v-for="item of orgOptions" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item  label="物料名称" :prop="object['name'].name">
              <el-input   :disabled="showDisabled" v-model="materialsForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item  label="物料类型" :prop="object['materialCategory'].name">
              <dict-selected  :rowId="showDict" :initValue="materialsForm.materialCategory" v-model="materialsForm.materialCategory" dictType="materialCategory"></dict-selected>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item  label="物料分类" :prop="object['materialCatgs'].name">
              <el-cascader
                clearable
                filterable
                change-on-select
                :options="cascateOption"
                :disabled="showDisabled"
                v-model="materialsForm.materialCatgs"
                separator="-">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
          <el-form-item  :label="object['commonName'].label">
            <el-input  :disabled="showDisabled" v-model="materialsForm.commonName"></el-input>
          </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item label="规格" :prop="object['basicSpec'].name"> 
              <el-input :disabled="showDisabled" v-model="materialsForm.basicSpec"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item  label="基本单位" :prop="object['basicUnit'].name">
              <dict-selected  :rowId="showDict" v-model="materialsForm.basicUnit " :initValue="materialsForm.basicUnit " dictType="packaging_uom" @input="changeUnit"></dict-selected>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
          <el-form-item  label="原系统编码">
            <el-input  :disabled="showDisabled" v-model="materialsForm.codeOrgin"></el-input>
          </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item label="版本" :prop="object['version'].name"> 
              <el-input  :disabled="showDisabled" v-model="materialsForm.version"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
           <el-form-item  label="物料状态" :prop="object['status'].name" >
            <el-radio-group v-model="materialsForm.status">
               <el-radio  :disabled="showDisabled" label="1" >生效</el-radio>
               <el-radio  :disabled="showDisabled" label="0" >失效</el-radio>
              </el-radio-group>
           </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
             <el-form-item  label="备注">
              <el-input  :disabled="showDisabled" v-model="materialsForm.remark"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
          <el-form-item  label="创建人">
            <el-input disabled v-model="materialsForm.createBy.username"></el-input>
          </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="12">
            <el-form-item label="上传图片"  :prop="object['imgPath'].name">
               <el-upload
                   :action="fileuploadUrlImgPath"
                   :headers="headers"
                   list-type="picture"
                   :file-list="uplFileListImgPath"
                   :on-change="handleChangeImgPath"
                   :before-upload="beforeUploadImgPath"
                   :on-success="handleSuccessImgPath"
                   :on-preview="handlePictureCardPreviewImgPath"
                   :on-remove="handleRemoveImgPath"
                   :disabled="showDisabled"
                   >
                 <el-button slot="trigger" class ='el-icon-plus' size="mini" :disabled="showDisabled" >选择图片</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-dialog v-model="dialogVisible" width="50%">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
        </div>
      </el-tab-pane>
      
      <el-tab-pane :label="mate.tabs[2].name">
        <div class="wrap_div" >
        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item  label="批次管控">
            <el-switch
             :disabled="showDisabled"
              v-model="materialsForm.batchCtrl"
              active-text="是"
              inactive-text="否">
            </el-switch>
          </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
          <el-form-item  label="批号管理">
            <el-switch
             :disabled="showDisabled"
              v-model="materialsForm.lotnumberCtrl"
              active-text="是"
              inactive-text="否">
            </el-switch>
          </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
          <el-form-item  label="有效期控制">
            <el-switch
            :disabled="showDisabled"
              v-model="materialsForm.shelfLifeCtrl"
              active-text="是"
              inactive-text="否">
            </el-switch>
          </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
          <el-form-item   label="冷链运输">
            <el-switch
            :disabled="showDisabled"
              v-model="materialsForm.transferCold"
              active-text="是"
              inactive-text="否">
            </el-switch>
          </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
          <el-form-item  label="储存条件">
            <dict-selected :rowId="showDict" v-model="materialsForm.storeEnv" :initValue="materialsForm.storeEnv"  dictType="material_storeEnv"></dict-selected>
          </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
          <el-form-item  label="储存期限(天)">
            <el-input :disabled="showDisabled"  v-model="materialsForm.storePeroid"></el-input>
          </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
          <el-form-item  label="储存期限类型">
            <dict-selected :rowId="showDict" v-model="materialsForm.storePeroidType" :initValue="materialsForm.storePeroidType" dictType="material_storePeroidType"></dict-selected>
          </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
          <el-form-item  label="运输条件">
            <dict-selected :rowId="showDict" v-model="materialsForm.transferCondition" :initValue="materialsForm.transferCondition" dictType="material_transferCondition"></dict-selected>
          </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
          <el-form-item  label="保质期(天)">
            <el-input  :disabled="showDisabled" v-model="materialsForm.shelfLife"></el-input>
          </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
          <el-form-item  label="复检周期(天)">
            <el-input  :disabled="showDisabled" v-model="materialsForm.reviewCycle"></el-input>
          </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
          <el-form-item  label="最大库存量">
            <el-input  :disabled="showDisabled" v-model="materialsForm.storeUpper"></el-input>
          </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
          <el-form-item  label="最小库存量">
            <el-input  :disabled="showDisabled" v-model="materialsForm.storeLow"></el-input>
          </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item  label="基本单位-长(mm)" >
              <el-input :disabled="showDisabled" type="number" v-model="materialsForm.length"></el-input>
            </el-form-item>
            </el-col>
            <el-col :sm="12" :md="8" :lg="8">
            <el-form-item  label="基本单位-宽(mm)" >
              <el-input :disabled="showDisabled" type="number" v-model="materialsForm.width"></el-input>
            </el-form-item>
            </el-col>
            <el-col :sm="12" :md="8" :lg="8">
            <el-form-item  label="基本单位-高(mm)" >
              <el-input :disabled="showDisabled" type="number" v-model="materialsForm.height"></el-input>
            </el-form-item>
            </el-col>
            <el-col :sm="12" :md="8" :lg="8">
            <el-form-item  label="毛重(g)" >
              <el-input :disabled="showDisabled" type="number" v-model="materialsForm.grossWeight"></el-input>
            </el-form-item>
            </el-col>
            <el-col :sm="12" :md="8" :lg="8">
            <el-form-item  label="净重(g)" >
            <el-input :disabled="showDisabled" type="number" v-model="materialsForm.netWeight"></el-input>
          </el-form-item>
          </el-col>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="mate.tabs[3].name">
         <el-col :sm="12" :md="8" :lg="8">
          <el-form-item  label="生产企业">
            <el-select :disabled="showDisabled" clearable @visible-change="visibleChangeMadeEnt" filterable v-model="materialsForm.madeEnt.id">
              <el-option :label="item.label" :value="item.value"  v-for="(item,index) of object3['madeEnt'].options" :key="index"></el-option>
            </el-select>
          </el-form-item>
          </el-col>
           <el-col :sm="12" :md="8" :lg="8">
          <el-form-item  label="分包装企业">
            <el-select :disabled="showDisabled" clearable @visible-change="visibleChangeMadeEnt" filterable v-model="materialsForm.madeEntSub.id">
              <el-option :label="item.label" :value="item.value"  v-for="(item,index) of object3['madeEntSub'].options" :key="index"></el-option>
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
          <el-form-item  label="原产国">
            <country-select :disabled="showDisabled" v-model="materialsForm.madeIn" @input="inputChange" ref="CountrySelect"></country-select>
          </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
          <el-form-item label="产地(省)">
            <addrselect
                :disabledFlag="disabledFlag"
                :initselectedvalue="initprovselectedvalue"
                :addrs="provAddrs"
                v-model="materialsForm.province"
                @change="provChange"
                class="select-31"
                id="prov_select"
                name="prov" lazy>
            </addrselect>
          </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item label="产地(市)">
            <addrselect
                :disabledFlag="disabledFlag"
                :initselectedvalue="initcityselectedvalue"
                :addrs="cityAddrs"
                v-model="materialsForm.city"
                @change="cityChange"
                class="select-31"
                id="city_select"
                name="city" lazy>
            </addrselect>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
          <el-form-item label="产地(区/县)">
            <addrselect
                :disabledFlag="disabledFlag"
                :initselectedvalue="initregionselectedvalue"
                :addrs="regionAddrs"
                v-model="materialsForm.county"
                @change="regionChange"
                class="select-31"
                id="region_select"
                name="region" lazy>
              </addrselect>
            </el-form-item>
          </el-col>
         
          <el-col :sm="12" :md="8" :lg="8">
          <el-form-item  label="生产企业(受托方)">
            <el-select :disabled="showDisabled" clearable @visible-change="visibleChangeMadeEnt" filterable v-model="materialsForm.madeEntDel.id">
              <el-option :label="item.label" :value="item.value" v-for="(item,index) of object3['madeEntDel'].options" :key="index"></el-option>
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
          <el-form-item  label="生产企业许可证号">
            <el-input :disabled="showDisabled"  v-model="materialsForm.madeEnt.cretif[0].name"></el-input>
          </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
          <el-form-item  label="生产企业备案凭证编号">
            <el-input  :disabled="showDisabled" v-model="materialsForm.madeEnt.cretif[0].approvalNumber"></el-input>
          </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
          <el-form-item  label="国产/进口">
              <el-radio :disabled="showDisabled" class="radio" v-model="materialsForm.enterPort" label="0">国产</el-radio>
              <el-radio :disabled="showDisabled" class="radio" v-model="materialsForm.enterPort" label="1">进口</el-radio>
          </el-form-item>
          </el-col>
      </el-tab-pane>
      <el-tab-pane :label="mate.tabs[4].name">
        <div class="wrap_div" >
        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item  label="可销售">
            <el-switch
            :disabled="showDisabled"
              v-model="materialsForm.salable"
              active-text="是"
              inactive-text="否">
            </el-switch>
          </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
          <el-form-item  label="可退回">
            <el-switch
            :disabled="showDisabled"
              v-model="materialsForm.returnable"
              active-text="是"
              inactive-text="否">
            </el-switch>
          </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
          <el-form-item  label="商品拼批要求">
            <el-select :disabled="showDisabled" clearable v-model="materialsForm.detachableParts">
              <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item of mate.tabs[4].fields[5].options"></el-option>
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
          <el-form-item  label="产品等级">
            <el-input  :disabled="showDisabled" v-model="materialsForm.grade"></el-input>
          </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
          <el-form-item  label="海关料号">
            <el-input  :disabled="showDisabled" v-model="materialsForm.customsPartnumber"></el-input>
          </el-form-item>
          </el-col>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="mate.tabs[5].name">
        <div class="wrap_div" >
        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item  label="可采购">
            <el-switch
            :disabled="showDisabled"
              v-model="materialsForm.canPurchase"
              active-text="是"
              inactive-text="否">
            </el-switch>
          </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
          <el-form-item  label="默认采购员">
            <el-select :disabled="showDisabled" clearable v-model="materialsForm.buyer">
              <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item of buyerOptions"></el-option>
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
          <el-form-item  label="默认仓库">
            <el-select :disabled="showDisabled" clearable @visible-change="visibleChange" v-model="materialsForm.warehouseId">
              <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item of warehouseOptions"></el-option>
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item  label="采购提前期(天)">
              <el-input :disabled="showDisabled" type="number" v-model="materialsForm.purchasingLeadTime"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item label="检验周期(天)">
              <el-input :disabled="showDisabled" type="number" v-model="materialsForm.checkCycle"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
          <el-form-item  label="使用批准供应商">
            <el-switch
            :disabled="showDisabled"
              v-model="materialsForm.mustApprovedVendor"
              active-text="是"
              inactive-text="否">
            </el-switch>
          </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item  label="最小采购量">
              <el-input :disabled="showDisabled" type="number" v-model="materialsForm.purchaseLimit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item  label="最小包装数量">
              <el-input :disabled="showDisabled" type="number" v-model="materialsForm.snp"></el-input>
            </el-form-item>
          </el-col>
          
        </div>
      </el-tab-pane>
      <el-tab-pane :label="mate.tabs[6].name">
        <div class="wrap_div" >
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item  label="批准文号/注册证号">
              <el-select :disabled="showDisabled" clearable @visible-change="visibleChangeEntApp" v-model="materialsForm.approLicense">
                <el-option :label="item.label" :key="item.value" :value="item.value" v-for="item of object6['approLicense'].options"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item  label="批准文号/注册证号批准日期">
              <el-date-picker clearable disabled type="date" v-model="materialsForm.approvalDate" placeholder="请选择批准日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item  label="批准文号/注册证号截止日期">
              <el-date-picker clearable disabled type="date" v-model="materialsForm.approvalCloseDate" placeholder="请选择截止日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item  label="分包装批准文号">
              <el-select :disabled="showDisabled" clearable @visible-change="visibleChangeSub" v-model="materialsForm.packageApproLicense">
                <el-option :label="item.label" :key="item.value" :value="item.value" v-for="item of object6['packageApproLicense'].options"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item  label="分包装批准文号批准日期">
              <el-date-picker clearable disabled type="date" v-model="materialsForm.subApproDate" placeholder="请选择批准日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item  label="分包装批准文号截止日期">
              <el-date-picker clearable disabled type="date" v-model="materialsForm.subApproCloseDate" placeholder="请选择截止日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item  label="生产许可证">
              <el-select :disabled="showDisabled" clearable @visible-change="visibleChangeEntPro" v-model="materialsForm.productionLicense">
                <el-option :label="item.label" :key="item.value" :value="item.value" v-for="item of object6['productionLicense'].options"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item  label="生产许可证批准日期">
              <el-date-picker clearable disabled type="date" v-model="materialsForm.productionApproDate" placeholder="请选择批准日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item  label="生产许可证截止日期">
              <el-date-picker clearable disabled type="date" v-model="materialsForm.productionCloseDate" placeholder="请选择截止日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-form-item>
      <div class="fbutton">
        <el-button @click="handleSubmit">提 交</el-button>
        <el-button @click="backward" v-if="!mate.inline">取 消</el-button>
      </div>
    </el-form-item>
  </el-form>
</el-row>
</template>

<script>
import treeSelect from '../../components/tree-select/tree.vue'
import { API_GATEWAY } from '@/config/index.js'
import Multiselect from 'vue-multiselect'
import CountrySelect from '../../components/CountrySelect'
import MaterialSelect from '../../components/MaterialSelect'
import SearchSelect from '../../components/SearchSelect'
import addrArr from '../../components/address/addr-arr.js'
import Addrselect from '../../components/address/Addrselect'
// 根据id获取市/区数据函数，动态，经常改变
function getAddrsArrayById (id = 0) {
  return addrArr[id].map(item => {
    return {
      'text': item[1],
      'value': item[0]
    }
  })
}
import { DateFormat, trimSpace, isPositiveinteger } from '../../utils/util.js'
export default {
  name: 'material-form',
  data () {
    var validateRequired = (rule, value, callback) => {
      if (value === undefined || trimSpace(value) === '') {
        callback(new Error('该输入项为必输项'))
      } else {
        callback()
      }
    }
    var validateVersionRequired = (rule, value, callback) => {
      if (value === undefined || trimSpace(value) === '') {
        callback(new Error('该输入项为必输项'))
      } else {
        if (!isPositiveinteger(trimSpace(value))) {
          callback(new Error('请输入正整数'))
        } else {
          callback()
        }
      }
    }
    var validateBlur = (rule, value, callback) => {
      var vm = this
      if (!this.rowId) {
        this.$root.ajaxData('/materials/validName?name=' + this.materialsForm.name.replace(/(^\s*)|(\s*$)/g, ""), {}, function (data) {
          if (data !== '') {
            if (data.body === false) {
              callback(new Error('您输入的物料已存在'))
            } else {
              callback()
            }
          }
        }, 'GET')
        // 双击修改时获取到initOrgId
      } else if (this.rowId) {
        this.$root.ajaxData('/materials/validName?name=' + this.materialsForm.name, {}, function (data) {
          if (data !== '') {
            if (data === false || data.body === false) {
              if (vm.initName === value) {
                callback()
              } else {
                callback(new Error('您输入的物料已存在'))
              }
            } else if (data === true || data.body === true) {
              callback()
            }
          }
        }, 'GET')
      }
    }
    // 物料编码
    var validateBlurCode = (rule, value, callback) => {
      var vm = this
      if (!this.rowId) {
        this.$root.ajaxData('/materials/validCode/' + this.materialsForm.subcode.replace(/(^\s*)|(\s*$)/g, ""), {}, function (data) {
          if (data !== '') {
            if (data.body === false) {
              callback(new Error('您输入的物料编码已存在'))
            } else {
              callback()
            }
          }
        }, 'GET')
        // 双击修改时获取到initOrgId
      } else if (this.rowId) {
        callback()
        // this.$root.ajaxData('/materials/validCode/' + this.materialsForm.subcode, {}, function (data) {
        //   if (data !== '') {
        //     if (data === false || data.body === false) {
        //       if (vm.initName === value) {
        //         callback()
        //       } else {
        //         callback(new Error('您输入的物料编码已存在'))
        //       }
        //     } else if (data === true || data.body === true) {
        //       callback()
        //     }
        //   }
        // }, 'GET')
      }
    }
    return {
      cascateOption: [],
      initOrgId: '',         // 修改之前，orgId
      initName: '',         // 修改之前，物料名称
      getData: {},
      disabledFlag: false,   // 用于判断省市县是否可以使用
      // restaurants: [],    // 物料分类
      // restaurants1: [],    // 物料二级分类
      // restaurants2: [],       // 物料三级分类
      madeEnt: [],     // 生产企业
      madeEntDel: [],  // 生产企业(受托方)
      madeEntSub: [],  // 分包装企业
      labelPosition: 'right',
      defaultValues: {},
      dialogVisible: false,
      isLoading: false,
      treeSelectModel: '',
      materialsForm: {},
      treeSelected: '',
      treeSelectArr: [],
      showHiddenDialog: false,
      initprovselectedvalue: '0',
      initcityselectedvalue: '0',
      initregionselectedvalue: '0',
      provSelected: '',
      citySelected: '',
      regionSelected: '',
      provAddrs: getAddrsArrayById(0),
      cityAddrs: (this.initprovselectedvalue !== '0' && this.initprovselectedvalue !== 0) ? getAddrsArrayById(this.initprovselectedvalue) : [],
      regionAddrs: (this.initcityselectedvalue !== '0' && this.initcityselectedvalue !== 0) ? getAddrsArrayById(this.initcityselectedvalue) : [],
      object: {},
      object1: {},
      object3: {},
      object6: {},
      treeDatas: [],
      lineId: '',
      warehouseOptions: [],
      options: [],
      buyerOptions: [],
      madeEntOptions: [],
      orgOptions: [],
      size: 1,
      uplFileListImgPath: [],
      fileuploadUrlImgPath: API_GATEWAY + '/api/companys/uploadDetail',
      dialogImageUrl: '',
      headers: {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
        'Accept': 'application/json',
        'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId
      },
      rules: {
        name: [
          { required: true, message: '该输入项为必输项' },
          { validator: validateRequired, trigger: 'change' },
          { validator: validateBlur, trigger: 'blur' }
        ],
        subcode:[
          { required: true, message: '该输入项为必输项' },
          { validator: validateBlurCode, trigger: 'blur' }
        ],
        // code: [
        //   { required: true, message: '该输入项为必输项' },
        //   { validator: validateRequired, trigger: 'change' },
        //   { validator: validateLength, trigger: 'change' },
        //   { validator: validateLength, trigger: 'blur' }
        // ],
        orgId: [
           { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        version:[
          { required: true, message: '该输入项为必输项' },
          { validator: validateVersionRequired, trigger: 'blur' }
        ],
        materialCategory: [
           { required: true, message: '该输入项为必输项' }
        ],
        materialCatgs: [
           { required: true, message: '该输入项为必输项' }
        ],
        basicUnit: [
           { required: true, message: '该输入项为必输项' }
        ],
        effectDate: [
           { required: true, message: '该输入项为必输项' }
        ]
      }
    }
  },
  props: {
    mate: Object,
    rowId: String,
    showDisabled: Boolean,
    showSubcode: Boolean,
    showDict: String,
    mateMethod: String
  },
  watch: {
    'rowId': function (val, oldVal) {
      const vm = this
      vm.uplFileListImgPath = []
      if (val) {
        this.createdRowId(val)
      }
    }
  },
  created () {
    const vm = this
    this.$root.ajaxData('/material/category/tree/list?dataOnly=true&nopaging=true', {}, function (data) {
      vm.materialChange(data)
      vm.cascateOption = data
    }, 'GET')
    this.mate.tabs[0].fields.map((i) => { this.object[i.name] = i })
    this.mate.tabs[1].fields.map((i) => { this.object1[i.name] = i })
    this.mate.tabs[3].fields.map((i) => { this.object3[i.name] = i })
    this.mate.tabs[6].fields.map((i) => { this.object6[i.name] = i })
    // 树结构
    if (this.mate.treeDataLoad) {
      const vm = this
      this.mate.treeDataLoad.map(i => {
        this.$root.ajaxData(i.url, {}, function (data) {
          vm.treeDatas = data
        })
      })
    }
    if (this.rowId) {
      this.createdRowId(this.rowId)
      this.disabledFlag = true
    }
    if (this.mate.inline) {
      this.defaultValues = this.mate.values
    }
    this.materialsForm = Object.assign({}, this.mate.values);
    // 版本默认值为1
    this.materialsForm['version'] = this.materialsForm['version'] || "1";
    this.$root.ajaxData('/dc/list?nopaging=1&dataOnly=true', {}, function (data) {
      for (var i = 0; i < data.length; i++) {
        var name = data[i].name
        var id = data[i].id
        var options = { value: id, label: name }
        vm.warehouseOptions.push(options)
      }
    }, 'GET')
    this.getOrg()
  },
  components: {
    Addrselect,
    CountrySelect,
    MaterialSelect,
    Multiselect,
    SearchSelect,
    treeSelect,
    KCascader: function index (resolve) {
      require(['../../components/KCascader.vue'], resolve)
    },
    'tree-selected': function index (resolve) {
      require(['../../components/TreeSelected.vue'], resolve)
    },
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
    }
  },
  computed: {
    // a computed getter
    labelWidth: function () {
      let width = ''
      if (this.mate.inline) {
        // width = undefined
        width = '300px'
      } else if (typeof (this.mate.labelWidth) === 'undefined') {
        width = '300px'
      } else {
        width = this.mate.labelWidth
      }
      return width
    }
  },
  methods: {
    createdRowId (val) {
      var vm = this
      this.$root.ajaxData('/materials/' + val, {}, function (data) {
        vm.initName = data.name
        vm.initOrgId = data.orgId
        // 仅更新materialsForm 或 mate.values 页面不刷新
        vm.mate.values = Object.assign(data)
        vm.materialsForm = Object.assign(data)
        if (vm.materialsForm.imgPath) {
          if (vm.materialsForm.imgPath !== undefined && vm.materialsForm.imgPath !== null && trimSpace(vm.materialsForm.imgPath) !== '') {
            var file = {}
            file.percentage = 100
            file.response = vm.materialsForm.imgPath
            file.status = 'success'
            file.url = vm.materialsForm.imgPath
            vm.uplFileListImgPath.push(file)
          }
        }
        if (vm.materialsForm.orgId) {
          var ss = vm.materialsForm.orgId.split(',')
          vm.materialsForm.orgId = ss
        }
        // 批准文号
        if (vm.materialsForm.madeEnt.id) {
          vm.$root.ajaxData('/certificates/all/' + vm.materialsForm.madeEnt.id, {}, function (data) {
            vm.dataCopy1 = data
            data.forEach((item) => {
              vm.object6['approLicense'].options.push({ label: item.name, value: item.id })
            })
          }, 'GET')
        }
        // 选择生产许可证，然后还要带出开始日期和截止日期
        if (vm.materialsForm.madeEnt.id) {
          vm.$root.ajaxData('/certificates/all/' + vm.materialsForm.madeEnt.id, {}, function (data) {
            vm.dataCopy2 = data
            data.forEach((item) => {
              vm.object6['productionLicense'].options.push({ label: item.name, value: item.id })
            })
          }, 'GET')
        }
        // 分包装批准文号
        if (vm.materialsForm.madeEntSub.id) {
          vm.$root.ajaxData('/certificates/all/' + vm.materialsForm.madeEntSub.id, {}, function (data) {
            vm.dataCopy = data
            data.forEach((item) => {
              vm.object6['packageApproLicense'].options.push({ label: item.name, value: item.id })
            })
          }, 'GET')
        }
        vm.initprovselectedvalue = data.province
        vm.initcityselectedvalue = data.city
        vm.initregionselectedvalue = data.county
        vm.provAddrs = getAddrsArrayById(0)
        vm.cityAddrs = (vm.initprovselectedvalue !== '0' && vm.initprovselectedvalue !== 0) ? getAddrsArrayById(vm.initprovselectedvalue) : []
        vm.regionAddrs = (vm.initcityselectedvalue !== '0' && vm.initcityselectedvalue !== 0) ? getAddrsArrayById(vm.initcityselectedvalue) : []
      })
      // 获取生产企业、分包装企业、生产企业(受托方)
      this.$root.ajaxData('/companys/companyInfo/0?nopaging=1&dataOnly=true', {}, function (data) {
        for (let i = 0; i < data.length; i++) {
          vm.object3['madeEnt'].options.push({ label: data[i].name, value: data[i].id })
          vm.object3['madeEntDel'].options.push({ label: data[i].name, value: data[i].id })
          vm.object3['madeEntSub'].options.push({ label: data[i].name, value: data[i].id })
        }
      }, 'GET')
    },
    beforeUploadImgPath (file) {
      var index1 = file.name.lastIndexOf('.')
      var name = file.name.substring(index1, file.name.length)
      if (!/\.(jpg|jpeg|png|JPG|PNG|JPEG)$/.test(name)) {
        this.$message({
          message: '请选择图片格式',
          type: 'warning'
        })
        this.uplFileListImgPath = []
        return false
      }
    },
    handleSuccessImgPath (response, file, fileList) {
      this.materialsForm.imgPath = response.data
    },
    handlePictureCardPreviewImgPath (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemoveImgPath (file, fileList) {
      this.materialsForm.imgPath = ''
    },
    handleChangeImgPath (file, fileList) {
    },
    submitUpload (val) {
      if (val.length !== 0) {
        this.dialogImageUrl = val[0].url
        this.dialogVisible = true
      }
    },
    // 获取有效的库存组织
    getOrg () {
      var vm = this
      this.orgOptions = []
      this.$root.ajaxData('/org/inventory/all?dataOnly=true&currentDateFlag=11', {}, function (data) {
        data.map((item) => {
          vm.orgOptions.push({ 'label': item.name, 'value': item.id })
        })
      }, 'GET')
    },
    materialChange (data) {
      for (const i of data) {
        i.label = i.name
        i.value = i.id
        if (i.children) {
          this.materialChange(i.children)
        }
      }
    },
    limitText (count) {
      return `and ${count} other codeOptions`
    },
    // 原产国，改变的数据在这里可以显示，在这里判断，如果选择的是中国，省市县就可以使用，或者就不能显示
    inputChange (val) {
      if (val === this.$t('China')) {
        this.disabledFlag = false
      } else {
        this.disabledFlag = true
      }
    },
    // 获取物料主码options
    visibleChangeCode (flag) {
      var vm = this
      vm.codeOptions = []
      if (flag) {
        this.$root.ajaxData('/materials/codes', {}, function (data) {
          for (let i = 0; i < data.length; i++) {
            vm.codeOptions.push({ 'label': data[i], 'value': data[i] })
          }
        }, 'GET')
      }
    },
    // 获取生产企业、分包装企业、生产企业(受托方)
    visibleChangeMadeEnt (flag) {
      var vm = this
      vm.object3['madeEnt'].options = []
      vm.object3['madeEntDel'].options = []
      vm.object3['madeEntSub'].options = []
      if (flag) {
        this.$root.ajaxData('/companys/companyInfo/0?nopaging=1&dataOnly=true', {}, function (data) {
          for (let i = 0; i < data.length; i++) {
            vm.object3['madeEnt'].options.push({ label: data[i].name, value: data[i].id })
            vm.object3['madeEntDel'].options.push({ label: data[i].name, value: data[i].id })
            vm.object3['madeEntSub'].options.push({ label: data[i].name, value: data[i].id })
          }
        }, 'GET')
      }
    },
    // 批准文号
    visibleChangeEntApp (flag) {
      var vm = this
      vm.object6['approLicense'].options = []
      if (flag) {
        if (this.materialsForm.madeEnt.id) {
          this.$root.ajaxData('/certificates/all/' + this.materialsForm.madeEnt.id, {}, function (data) {
            vm.dataCopy1 = data
            data.forEach((item) => {
              vm.object6['approLicense'].options.push({ label: item.name, value: item.id })
            })
          }, 'GET')
        }
      }
      if (!flag) {
        vm.dataCopy1.forEach((item) => {
          if (this.materialsForm.approLicense === item.id) {
            this.materialsForm.approvalDate = item.approvalDate
            this.materialsForm.approvalCloseDate = item.validityDate
          }
        })
      }
    },
    // 选择生产许可证，然后还要带出开始日期和截止日期
    visibleChangeEntPro (flag) {
      var vm = this
      vm.object6['productionLicense'].options = []
      if (flag) {
        if (this.materialsForm.madeEnt.id) {
          this.$root.ajaxData('/certificates/all/' + this.materialsForm.madeEnt.id, {}, function (data) {
            vm.dataCopy2 = data
            data.forEach((item) => {
              vm.object6['productionLicense'].options.push({ label: item.name, value: item.id })
            })
          }, 'GET')
        }
      }
      if (!flag) {
        vm.dataCopy2.forEach((item) => {
          if (this.materialsForm.productionLicense === item.id) {
            this.materialsForm.productionApproDate = item.approvalDate
            this.materialsForm.productionCloseDate = item.validityDate
          }
        })
      }
    },
    // 分包装批准文号
    visibleChangeSub (flag) {
      var vm = this
      // var dataCopy = []
      vm.object6['packageApproLicense'].options = []
      if (flag) {
        if (this.materialsForm.madeEntSub.id) {
          this.$root.ajaxData('/certificates/all/' + this.materialsForm.madeEntSub.id, {}, function (data) {
            vm.dataCopy = data
            data.forEach((item) => {
              vm.object6['packageApproLicense'].options.push({ label: item.name, value: item.id })
            })
          }, 'GET')
        }
      }
      if (!flag) {
        vm.dataCopy.forEach((item) => {
          if (this.materialsForm.packageApproLicense === item.id) {
            this.materialsForm.subApproDate = item.approvalDate
            this.materialsForm.subApproCloseDate = item.validityDate
          }
        })
      }
    },
    provChange (val) {
      const oldVal = this.provSelected
      if (val !== oldVal) {
        if (val !== '0' && val !== 0) {
          this.cityAddrs = getAddrsArrayById(val)
        } else {
          this.cityAddrs = []
        }
        this.citySelected = '0'
      }
      this.materialsForm.madeEnt.province = val
    },
    cityChange (val) {
      const oldVal = this.provSelected
      if (val !== oldVal) {
        if (val !== '0' && val !== 0) {
          this.regionAddrs = getAddrsArrayById(val)
        } else {
          this.regionAddrs = []
        }
        this.regionSelected = '0'
      }
      this.materialsForm.madeEnt.city = val
    },
    regionChange (val) {
      this.materialsForm.madeEnt.county = val
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.name.indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleClick (tab, event) {
      var vm = this
      if (tab.index === '5') {
        vm.buyerOptions = []
        this.$root.ajaxData('/users/list?cols=id,username&dataOnly=true&all=1', {}, function (data) {
          for (let i = 0; i < data.length; i++) {
            var username = { value: data[i].id, label: data[i].username }
            vm.buyerOptions.push(username)
          }
        }, 'GET')
      }
      if (tab.index === '3') {
      }
    },
    // 由于提交单位有为题
    changeUnit (val) {
      this.materialsForm.basicUnit = val
    },
    backward () {
      this.$root.monitor({ url: this.mate.next })
      this.$emit('action', this.showHiddenDialog)
    },
    handleSubmit (ev) {
      var vm = this
      var ruleRes = ''
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          var abc = this.materialsForm.orgId.toString()
          vm.materialsForm.orgId = abc
          let url = vm.mate.url
          var materialCatg = vm.materialsForm.materialCatgs[vm.materialsForm.materialCatgs.length - 1]
          const values = vm.mate.values
          vm.materialsForm.materialCatg = materialCatg
          vm.materialsForm.effectiveDate = DateFormat(vm.materialsForm.effectiveDate, 'yyyy-MM-dd')
          if (vm.materialsForm.invalidDate === undefined) {
            vm.materialsForm.invalidDate = null
          } else {
            vm.materialsForm.invalidDate = DateFormat(vm.materialsForm.invalidDate, 'yyyy-MM-dd')
          }
          vm.materialsForm.expiryDate = DateFormat(vm.materialsForm.expiryDate, 'yyyy-MM-dd')
          vm.materialsForm.approvalDate = DateFormat(vm.materialsForm.approvalDate, 'yyyy-MM-dd')
          vm.materialsForm.approvalCloseDate = DateFormat(vm.materialsForm.approvalCloseDate, 'yyyy-MM-dd')
          vm.materialsForm.subApproDate = DateFormat(vm.materialsForm.subApproDate, 'yyyy-MM-dd')
          vm.materialsForm.subApproCloseDate = DateFormat(vm.materialsForm.subApproCloseDate, 'yyyy-MM-dd')
          vm.materialsForm.productionApproDate = DateFormat(vm.materialsForm.productionApproDate, 'yyyy-MM-dd')
          vm.materialsForm.productionCloseDate = DateFormat(vm.materialsForm.productionCloseDate, 'yyyy-MM-dd')
          if (vm.mate.inline) {
            vm.$emit('search', values)
            vm.mate.values = vm.defaultValues
          } else {
            if (vm.mateMethod === 'PUT' && vm.rowId) {
              url = url + '/' + vm.rowId
            }
            const act = { url: url, ajax: true, method: vm.mateMethod || vm.mate.method }
            act.next = this.mate.next || false
            this.$root.action(act, this.materialsForm)
            this.lineId = ''
            this.changeRowId()
            // vm.$emit('action', act, values)
          }
        } else {
          this.$notify.error({
            title: '消息',
            message: '数据验证未通过'
          })
          ruleRes = 'no'
          return false
        }
      })
      if (ruleRes === 'no') {
        return
      }
      this.$emit('action', this.showHiddenDialog)
    },
    // 获取仓库
    visibleChange (flag) {
      var vm = this
      vm.warehouseOptions = []
      if (flag) {
        this.$root.ajaxData('/dc/list?nopaging=1&dataOnly=true', {}, function (data) {
          for (var i = 0; i < data.length; i++) {
            var name = data[i].name
            var id = data[i].id
            var options = { value: id, label: name }
            vm.warehouseOptions.push(options)
          }
        }, 'GET')
      }
    },
    changeRowId () {
      var vm = this
      this.$emit('rowIdChange', vm.lineId)
    }
  }
}
</script>

<style scoped lang="scss">
.el-form-item__label{
  line-height:inherit
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
/** tree-select **/
*{
  padding:0;
  margin:0;
}

li{
  list-style:none;
}

.ats-tree{
  vertical-align: top;
}

.hidden{
  display:none;
}
h4{
  margin-top:40px;
  margin-bottom:10px;
}
.el-select{
  width:100%;
}
.el-date-editor.el-input{
  width:100%;
}
.el-form-item {
    margin: 15px 20px 2px 0px;
}
.el-form-item.is-required .el-form-item__label:before{
  content:''
}
.el-form-item.is-required .el-form-item__label:after{
  content: '*';
  color: #ff4949;
  margin-right: 4px;
}
.el-form-item--mini.el-form-item {
  margin: 6px;
}
// .el-select>.el-input {
//   position: relative;
//   width: 80%;
// }
.el-input--mini .el-input__inner{
  width:80%
}
.el-input__suffix {
  right:80px;
}
.el-dialog__header {
  padding: 10px 10px 0;
}
.el-dialog__body {
  padding: 10px 10px;
}
.fbutton {
  position: relative;
  margin: 5px 0;
  button {
    padding: 7px 15px;
    background-color: #fff;
    cursor: pointer;
  }
}
.el-cascader--mini{
  width: 100%
}
.el-button--mini {
  padding: 7px 9px;
}
.wrap_div /deep/ .el-tag--mini{
  height: 20px;
  line-height: 19px;
}
.wrap_div /deep/ .el-input--mini{
  height: 28px;
}
.wrap_div /deep/ .el-select-dropdown__list {
  padding: 6px 8px;
}
</style>
