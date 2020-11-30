<template>
  <div >
    <el-row>
      <div class="head">
        <h1>发票详情</h1>
      </div>
      <div class="detail">
        <ul class="ul">
          <li>发票号：{{list.invoiceNo}}</li>
          <li>发票代码：{{list.invoiceCode}}</li>
          <li>币种：{{list.currency}}</li>
          <li>收款人姓名：{{list.payee}}</li>
          <li>复核人姓名：{{list.checker}}</li>
          <li>开票人姓名：{{list.drawer}}</li>
          <li>备注：{{list.remark}}</li>
        </ul>
        <ul>
          <li>发票类型：{{list.type}}</li>
          <li>开票日期：{{list.makeInvoiceTime}}</li>
          <li>税率：{{list.taxRate}}</li>
          <li>税额：{{list.totalTax}}</li>
          <li>不含税金额：{{list.totalPrice}}</li>
          <li>含税金额：{{list.totalPriceTax}}</li>
        </ul>
      </div>
      <div>
        <el-tabs size="mini" type="card" v-model="radio3" @tab-click="changeType" >
          <el-tab-pane size="mini" label="发票明细" name="1"></el-tab-pane>
          <el-tab-pane size="mini" label="文件" name="2"></el-tab-pane>
        </el-tabs>
      </div>
      <div  v-show="showDetial" class="invoiceDetail">
        <el-table size="mini" :data="detailLine" border style="width: 100%" class="bottom">
          <el-table-column show-overflow-tooltip :label="objectColumns['lineNo'].label" :prop="objectColumns['lineNo'].name"></el-table-column>
          <el-table-column show-overflow-tooltip :label="objectColumns['itemName'].label" :prop="objectColumns['itemName'].name"></el-table-column>
          <el-table-column show-overflow-tooltip :label="objectColumns['modelName'].label" :prop="objectColumns['modelName'].name"></el-table-column>
          <el-table-column show-overflow-tooltip :label="objectColumns['unit'].label" :prop="objectColumns['unit'].name"></el-table-column>
          <el-table-column show-overflow-tooltip :label="objectColumns['totalPrice'].label" :prop="objectColumns['totalPrice'].name"></el-table-column>
          <el-table-column show-overflow-tooltip :label="objectColumns['taxRate'].label" :formatter="objectColumns['taxRate'].formatter" :prop="objectColumns['taxRate'].name" ></el-table-column>
          <el-table-column show-overflow-tooltip :label="objectColumns['totalTax'].label" :prop="objectColumns['totalTax'].name" ></el-table-column>
          <el-table-column show-overflow-tooltip :label="objectColumns['totalPriceTax'].label" :prop="objectColumns['totalPriceTax'].name"></el-table-column>
          <el-table-column show-overflow-tooltip :label="objectColumns['remark'].label" :prop="objectColumns['remark'].name"></el-table-column>
        </el-table>
      </div>
      <div v-show="showFileDetial" class="fileDetail">
        <div>
        <el-button @click="uploadFile" size="mini">上传</el-button>
        <span style="font-size:12px">（只能上传mp4/mpeg/ogg/mpg视频、jpeg/jpg/png/gif图片）</span>
        <input type="file" ref="excelFile"  style="display:none" @change="fileUpload"  >
      </div >
        <el-table :data="detailFile" border style="width: 100%" class="fileBottom">
          <el-table-column :label="objectFileColumns['fileName'].label" :prop="objectFileColumns['fileName'].name"></el-table-column>
          <el-table-column :label="objectFileColumns['uploadBy'].label" :prop="objectFileColumns['uploadBy'].name"></el-table-column>
          <el-table-column :label="objectFileColumns['createAt'].label" :prop="objectFileColumns['createAt'].name" ></el-table-column>
           <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button @click="deleteFile(scope.row.picPath)"  size="mini">删除</el-button>
                <el-button @click="showDetail(scope.row.picPath)"  size="mini">查看</el-button>
             </template>
           </el-table-column>
        </el-table>
         <el-row type="flex" justify="center" class="page" >
      <el-col :span="12">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="page"
            layout="total,prev, pager, next, sizes"
            :total="total"
            :page-sizes ="[5, 10, 15, 20, 50]"
            :page-size="pageSize">
        </el-pagination>
      </el-col>
      </el-row>
      </div>
      <el-dialog :visible.sync="dialogImageVisible" width="30%">
          <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </el-row>
  </div>
</template>
<script>
import { API_GATEWAY } from '@/config/index.js'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
export default {
  mixins: [ColumnFormatterMixin],
  props: {
    mate: Object
  },
  components: {
  },
  data () {
    return {
      list: {},
      fileList: [],
      objectColumns: {},
      page: 0,
      pageSize: 5,
      radio3: '1',
      total: 10,
      objectFileColumns: {},
      dialogImageVisible: false,
      dialogImageUrl: '',
      showDetial: true,
      showFileDetial: false,
      detailLine: [],
      detailFile: []
    }
  },
  created () {
    let lineList = this.mate.LineList
    let fileList = this.mate.FileList
    this.formatterBefore(lineList.columns)
    lineList.columns.map((i) => { this.objectColumns[i.name] = i })
    fileList.columns.map((i) => { this.objectFileColumns[i.name] = i })
    this.detailLine = lineList.rows
    this.detailFile = fileList.rows
    this.list = this.mate.HeaderList.rows
    if (this.list.type === 0) {
      this.list.type = '增值税专用发票'
    } else {
      this.list.type = '增值税普通发票'
    }
    if (this.list.taxRate === 7) {
      this.list.taxRate = '7%'
    } else if (this.list.taxRate === 13) {
      this.list.taxRate = '13%'
    } else {
      this.list.taxRate = '17%'
    }
  },
  methods: {
    changeType (val) {
      if (val.name === '1') {
        this.showDetial = true
        this.showFileDetial = false
      } else if (val.name === '2') {
        var vm = this
        this.showDetial = false
        this.showFileDetial = true
        this.$root.ajaxData('/purchase/files/all/list?sourceId=' + this.list.id, {}, function (data) {
          vm.detailFile = data.data
          vm.total = data.total
        })
      }
    },
    handleChange () {

    },
    uploadFile () {
      this.$refs.excelFile.click()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getData('paging')
    },
    handleCurrentChange (val) {
      this.page = val
      this.getData('paging')
    },
    getData (flag) {
      let url = ''
      var vm = this
      url = '/purchase/files/all/list?sourceId=' + this.list.id + '&pageSize=' + this.pageSize + '&pageNum=' + this.page
      this.$root.ajaxData(url, {}, function (data) {
        vm.updateData(data)
      })
    },
    updateData (data) {
      this.detailLine = data.data
      if (data.total) {
        this.total = data.total
      } else {
        this.total = 0
      }
      if (data.selected) {
        this.mate.mateList.selected = data.mate.mateList.selected
      }
    },
    fileUpload (file) {
      var vm = this
      var formdata = new FormData()
      formdata.append('file', file.target.files[0])
      this.$http({
        url: API_GATEWAY + '/zuul/api/purchase/tms/invoice/upload?sourceId=' + this.list.id,
        method: 'POST',
        body: formdata,
        responseType: 'arraybuffer'
      }).then(function (response) {
        vm.$refs.excelFile.value = ''
        setTimeout(function () {
          vm.$root.ajaxData('/purchase/files/all/list?sourceId=' + vm.list.id, {}, function (data) {
            vm.detailFile = data.data
            vm.total = data.total
          })
        }, 1000)
      })
    },
    deleteFile (picPath, id) {
      var vm = this
      this.$root.ajaxData('/purchase/files/del?url=' + picPath, {}, function (data) {
        vm.$root.ajaxData('/purchase/files/all/list?sourceId=' + vm.list.id, {}, function (data) {
          vm.detailFile = data.data
          vm.total = data.total
        })
      }, 'DELETE')
    },
    showDetail (id) {
      var fileType = id.substr(id.lastIndexOf('.')).toLowerCase()
      if (fileType === '.jpg' || fileType === '.jpeg' || fileType === '.png') {
        this.dialogImageVisible = true
        this.dialogImageUrl = id
      } else {
        var a = document.createElement('a')
        document.body.appendChild(a)
        a.setAttribute('style', 'display:none')
        a.setAttribute('href', id)
        a.click()
      }
    }
  }
}
</script>
<style lang="scss" rel="stylesheet" scoped>
ul {
  display: inline-block;
  vertical-align: top;
  width: 350px;
  overflow: hidden;
}
ul li {
  list-style: none;
  margin: 5px 0;
}
ul li span {
  display: inline-block;
  width: 100px;
  text-align: right;
}
.fileDetail{
  margin-top:20px
}
.fileBottom{
   margin-top:5px
}
.main{
  margin-left:20px
}
</style>
