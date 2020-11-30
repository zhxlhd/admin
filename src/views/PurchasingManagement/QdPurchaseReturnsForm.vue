<template>
  <div>
    <el-row>
      <el-form size="mini" :model="mateValues" :label-position="labelPosition" ref="ruleForm" :rules="rules" :label-width="labelWidth">
        <template>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['returnDate'].label" :prop="object['returnDate'].name">
              <el-date-picker clearable type="date" v-model="mateValues['returnDate']"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['officeId'].label" :prop="object['officeId'].name">
              <el-select  clearable @change="changeOffice" filterable v-model="mateValues['officeId']">
                <el-option :label="item.label" :value="item.value" v-for="item of officeIdOptions" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['orgId'].label" :prop="object['orgId'].name">
              <el-select  clearable filterable v-model="mateValues['orgId']" @change="changeOrgId" >
                <el-option :label="item.label" :value="item.value" v-for="item of orgIdOptions" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

            <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['warehouseId'].label" :prop="object['warehouseId'].name">
              <el-select  clearable filterable v-model="mateValues['warehouseId']">
                <el-option :label="item.label" :value="item.value" v-for="item of warehouseIdOptions" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['supplierId'].label" :prop="object['supplierId'].name">
              <el-select  clearable filterable v-model="mateValues['supplierId']">
                <el-option :label="item.label" :value="item.value" v-for="item of supplierIdOptions" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8" :lg="8">
            <el-form-item :label="object['handlerBy'].label" :prop="object['handlerBy'].name">
              <el-select  clearable filterable v-model="mateValues['handlerBy']">
                <el-option :label="item.label" :value="item.value" v-for="item of handlerByOptions" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </template>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import SERVICES from "@/services";

  export default {
    components: {
      'dict-selected': function index (resolve) {
        require(['../../components/DictSelected.vue'], resolve)
      }
    },
    data () {
      return {
        object: {},                 // 用来代替从父组件总获取到的数据 mate.filed
        supplierOptions: [],
        labelPosition: 'right',
        officeIdOptions: [],
        orgIdOptions: [],
        supplierIdOptions: [],
        warehouseIdOptions: [],
        handlerByOptions: [],
        rules: {
          supplierId: [
            { required: true, message: '该输入项为必输项', trigger: 'change' }
          ],
          // warehouseId: [
          //   { required: true, message: '该输入项为必输项', trigger: 'change' }
          // ],
          orgId: [
            { required: true, message: '该输入项为必输项', trigger: 'change' }
          ],
          officeId: [
            { required: true, message: '该输入项为必输项', trigger: 'change' }
          ]
        }
      }
    },
    props: {
      mate: Object
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
          width = '100px'
        } else {
          width = this.mate.labelWidth
        }
        return width
      }
    },
    created () {
      this.mate.fields.map((i) => { this.object[i.name] = i })
      this.mateValues = this.mate.values
      this.getSupplier()
      this.getUser()
      this.getOfficeId()
      this.getOrgId()
    },
    methods: {
      // 获取到供应商
      getSupplier () {
        var vm = this
        this.supplierIdOptions = []
        this.$root.ajaxData('/companys/companyInfo/3?status=1&auditStatus=1&nopaging=1&dataOnly=true', {}, function (data) {
          data.map((item) => {
            vm.supplierIdOptions.push({ 'label': item.name, 'value': item.id })
          })
        }, 'GET')
      },
      // 获取到审批人
      getUser () {
        var vm = this
        this.handlerByOptions = []
        this.$root.ajaxData('/users/getUserDropdownList', {}, function (data) {
          data.map((item) => {
            vm.handlerByOptions.push({ 'label': (item.firstname+item.lastname), 'value': item.id })
          })
        }, 'GET')
      },
      // 仓库
      getWarehouseId (val) {
        const vm = this
        this.warehouseIdOptions = []
        // 退货的仓库只能是不合格仓类型
        if (val) {
          this.$root.ajaxData('/dc/getWarehouseByOrg/' + val, {}, function (data) {
            data.forEach((i) => {
              vm.warehouseIdOptions.push({ 'label': i.name, 'value': i.id })
            })
            vm.mateValues['warehouseId'] = vm.warehouseIdOptions[0].value
          }, 'GET')
        }
      },
      // 机构
      getOfficeId () {
        const vm = this
        this.officeIdOptions = []
        this.$root.ajaxData('/users/office', {}, function (data) {
          data.forEach(i => {
            vm.officeIdOptions.push({ 'label': i.orgName, 'value': i.id })
            // 只有一个机构，就将机构放进去
            if (!vm.mate.values.id) {
              if (vm.officeIdOptions.length === 1) {
                vm.mateValues['officeId'] = vm.officeIdOptions[0].value
              }
            }
          })
        }, 'GET')
      },
      // 库存机构
      getOrgId () {
        const vm = this
        this.mateValues['orgId'] = ''
        vm.orgIdOptions = []
          // this.$root.ajaxData(`/org/inventory/all?path=`, {}, function (data) {
          //   data.mate.rows.forEach(i => {
          //     vm.orgIdOptions.push({ 'label': i.name, 'value': i.id })
          //     // 机构改变，获取库存组织，如库存组织只有一个，需要将这一个放进库存组织中的input框

          //   })
          //   vm.mateValues['orgId'] = vm.orgIdOptions[0].value
          //   vm.getWarehouseId(vm.orgIdOptions[0].value)
          // })
        // 获取库存组织 过滤无效的库存组织 2019-02-10
        let officeId = this.mateValues['officeId'] || '';
        SERVICES.BASE.getOrgByOfficeId(officeId).then(res =>{
          if (res.status === 200 && !! res.data){
            res.data.forEach(i => {
              vm.orgIdOptions.push({ 'label': i.name, 'value': i.id })
              // 机构改变，获取库存组织，如库存组织只有一个，需要将这一个放进库存组织中的input框
            })
            vm.mateValues['orgId'] = vm.orgIdOptions[0].value
            vm.getWarehouseId(vm.orgIdOptions[0].value)
          }
        })
      },
      changeOrgId (val) {
        const vm = this
        this.mateValues['warehouseId'] = ''
        vm.warehouseIdOptions = []
        if (val) {
          this.$root.ajaxData(`/dc/getWarehouseByOrg/${val}`, {}, function (data) {
            data.forEach(i => {
              vm.warehouseIdOptions.push({ 'label': i.name, 'value': i.id })
            })
            vm.mateValues['warehouseId'] = vm.warehouseIdOptions[0].value
          })
        }
      },
      changeOffice (val) {
        // const vm = this
        // this.mateValues['orgId'] = ''
        // vm.orgIdOptions = []
        // 
        // this.$root.ajaxData(`/org/inventory/all?officeId=${val}`, {}, function (data) {
        //   if (data.mate.rows !== []) {
        //     data.mate.rows.forEach(i => {
        //       vm.orgIdOptions.push({ 'label': i.name, 'value': i.officeId })
        //       // 机构改变，获取库存组织，如库存组织只有一个，需要将这一个放进库存组织中的input框
        //       if (vm.orgIdOptions.length === 1) {
        //         vm.mateValues['orgId'] = vm.orgIdOptions[0].value
        //       }
        //     })
        //   }
        // })
      }
      // 库存组织
    }
  }
</script>

<style  scoped lang="scss">
.el-form-item {
    margin: 15px 20px 2px 0px;
}
</style>
