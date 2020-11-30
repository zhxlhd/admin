<template>
  <div>
      <el-button size="mini" @click="handleSubmit">提 交</el-button>
      <el-button size="mini" @click="backward" v-if="!mate.inline">取 消</el-button>
    <el-row>
      <el-form size="mini" :model="mate.values" :inline="mate.inline" label-position="right" ref="ruleForm" :rules="rules" :label-width="labelWidth">
        <template>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['categoryId'].label" :prop="object['categoryId'].name">
            <tree-select
            :removeUrl="object['categoryId'].removeUrl"
            :treeProps="object['categoryId'].treeProps"
            v-model="mate.values['categoryId']"
            :multiple="false"
            :placeholder="object['categoryId'].placeholder"
          ></tree-select>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['itemId'].label" :prop="object['itemId'].name">
            <el-select clearable  @change="changeCode(mate.values[object['itemId'].name])" v-model="mate.values[object['itemId'].name]" filterable placeholder="请选择">
              <el-option v-for="item in codeOptions" :key="item.key" :label="item.label" :value="item.value">
                  <span style="float: left;margin-right:30px">{{ item.label }}</span>
                  <span style="float: right; color:#212121; font-size: 13px">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['goodsName'].label" :prop="object['goodsName'].name">
            <el-input v-model="mate.values[object['goodsName'].name]" readonly></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['specifications'].label" :prop="object['specifications'].name">
            <el-input v-model="mate.values[object['specifications'].name]" readonly></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['brand'].label" :prop="object['brand'].name">
            <el-input v-model="mate.values[object['brand'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['miniQty'].label" :prop="object['miniQty'].name">
            <el-input v-model="mate.values[object['miniQty'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['indate'].label" :prop="object['indate'].name">
            <el-date-picker clearable type="date" v-model="mate.values[object['indate'].name]" :editable="false"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['site'].label" :prop="object['site'].name">
            <el-input v-model="mate.values[object['site'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['unit'].label" :prop="object['unit'].name">
            <el-input v-model="mate.values[object['unit'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['detail'].label" :prop="object['detail'].name">
            <el-input type="textarea" :rows="2" v-model="mate.values[object['detail'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="8">
          <el-form-item :label="object['picturePath'].label" :prop="object['picturePath'].name">
            <span style="display:none;">{{mate.values[object['picturePath'].name]}}</span>
            <el-upload style="clear:both;"
              :action="fileuploadUrl"
              :headers="headers"
              list-type="picture-card"
              :file-list="uplFileList"
              :on-success="handleSuccess"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </el-col>

        <el-dialog v-model="dialogVisible" width="30%">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>

        </template>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import treeSelect from '../../components/tree-select/tree.vue'
import { API_GATEWAY } from '@/config/index.js'
import { DateFormat, trimSpace, isPositivenumber } from '../../utils/util.js'
export default{
  data () {
    var validatePositivenumber = (rule, value, callback) => {
      if (value === undefined || value === null || trimSpace(value) === '') {
        callback(new Error('该输入项为必输项'))
      } else {
        if (!isPositivenumber(trimSpace(value))) {
          callback(new Error('请输入正数'))
        } else {
          callback()
        }
      }
    }

    return {
      form: {},
      object: {},
      codeOptions: [],
      goodsCode: '',
      dialogImageUrl: '',
      dialogVisible: false,
      supplierOptions: [],
      fileuploadUrl: API_GATEWAY + '/zuul/api/purchase/goods/release/upload',
      headers: {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
        'Accept': 'application/json',
        'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId
      },
      uplFileList: [],
      rules: {
        categoryId: [
            { required: true, message: '该输入项为必输项' }
            // { validator: validateRequired, trigger: 'change' }
        ],
        miniQty: [
            { required: true, message: '该输入项为必输项' },
            { validator: validatePositivenumber, trigger: 'change' },
            { validator: validatePositivenumber, trigger: 'blur' }
        ],
        indate: [
            { required: true, message: '该输入项为必输项' }
            // { validator: validateRequired, trigger: 'change' }
        ],
        site: [
            { required: true, message: '该输入项为必输项' }
            // { validator: validateRequired, trigger: 'change' }
        ],
        unit: [
            { required: true, message: '该输入项为必输项' }
            // { validator: validateRequired, trigger: 'change' }
        ]
      }
    }
  },
  components: {
    'tree-selected': function index (resolve) {
      require(['../../components/TreeSelected.vue'], resolve)
    },
    treeSelect
  },
  computed: {
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
  props: {
    mate: Object
  },
  created () {
    this.mate.fields.map((i) => { this.object[i.name] = i })
    this.form = this.mate
    this.goodsCode = this.mate.values.goodsCode
    if (this.mate.values.absolutePath) {
      if (this.mate.values.picturePath !== undefined && this.mate.values.picturePath !== null && trimSpace(this.mate.values.picturePath) !== '') {
        var file = {}
        file.percentage = 100
        file.response = this.mate.values.picturePath
        file.status = 'success'
        file.url = this.mate.values.picturePath
        this.uplFileList.push(file)
      }
    }
    this.getMaterial()// 获取物料
    // this.getSupplier()// 获取供应商
  },
  methods: {
    handleSubmit () {
      var mate = {}
      var vm = this

      var ruleRes = ''
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          ruleRes = 'no'
        }
      })

      if (ruleRes === 'no') {
        vm.$message({
          message: this.$t('Data Check No Pass'),
          type: 'warning'
        })
        return
      }

      this.form.values.indate = DateFormat(this.form.values.indate, 'yyyy-MM-dd')

      mate = this.form.values
      mate.goodsCode = this.goodsCode
      if (this.mate.method === 'POST') {
        this.$root.ajaxData('/purchase/goods/release/batchSave', mate, function () {
          vm.$root.monitor({ url: '/purchase/goods/release/all/list/3' })
        }, 'POST')
      } else {
        this.$root.ajaxData('/purchase/goods/release/batchUpdate' + '/' + mate.id, mate, function () {
          vm.$root.monitor({ url: '/purchase/goods/release/all/list/3' })
        }, 'PUT')
      }
    },
    backward () {
      this.$root.monitor({ url: '/purchase/goods/release/all/list/3' })
    },
    changeCode (value) {
      try {
        var obj = this.codeOptions.find((item) => {
          return item.value === value
        })
        this.goodsCode = obj.label
        var arr = obj.key.split('卍')
        this.form.values.goodsName = arr[0]
        this.form.values.unit = arr[2]
        this.form.values.specifications = arr[1]
      } catch (e) {
      }
    },
    // getSupplier () {
    //   var vm = this
    //   this.$root.ajaxData('/purchase/reqPurchase/getCompanys', {}, function (data) {
    //     for (let i = 0; i < data.length; i++) {
    //       vm.supplierOptions.push({ label: data[i].name, value: data[i].id, key: data[i].id })
    //     }
    //   }, 'GET')
    // },
    getMaterial () {
      var vm = this
      this.$root.ajaxData('/purchase/goods/release/getGoodsList', {}, function (data) {
        for (let i = 0; i < data.length; i++) {
          vm.codeOptions.push({ label: data[i].subcode, value: data[i].id, key: data[i].name + '卍' + data[i].basicSpec + '卍' + data[i].basicUnit, name: data[i].name })
        }
      }, 'GET')
    },
    handleRemove (file, fileList) {
      this.form.values.picturePath = ''
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleSuccess (response, file, fileList) {
      this.form.values.picturePath = response
    }
  }
}

</script>

<style scoped>
.el-form--inline>* {
  margin-right:10px
}
.el-form-item{
  margin: 15px 20px 2px 0px;
}
.leftFloat .el-row{
  float:left;
  width:250px;
}
.leftFloat .el-row input{
  width:250px;
}
.leftFloat .el-form-item{
  margin:0;
}
.leftFloat .button{
  float:left;
}
.el-form--inline .el-form-item {
  width:200px;
  display: inline-block;
  margin-right: 10px;
  vertical-align: top;
}
.el-form-item.is-required .el-form-item__label:before{
  content:''
}
.el-form-item.is-required .el-form-item__label:after{
  content: '*';
  color: #ff4949;
  margin-right: 4px;
}
.el-cascader{
  width:100%;
}
.el-select{
  width:100%;
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
.el-input__suffix {
  right:80px
}
.el-form-item--mini.el-form-item {
  margin: 6px;
}
.ats-tree .ats-input{
  width: 80%
}
.el-input--mini .el-input__inner{
  width:80%
}
.el-date-editor.el-input{
  width:100%;
}
.el-form--inline.el-form--label-top .el-form-item__content{
  width:90%
}
.leftFloat .el-form--inline .el-form-item{
  margin-right:10px;
}
.sbutton{
  margin-top:50px;
}
</style>
