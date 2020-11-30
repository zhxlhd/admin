<template>
  <div >
    <el-row>
      <div class="fileBottom">
        <el-button size="mini" @click="submit">提交</el-button>
        <el-button size="mini" @click="cancel">取消</el-button>
      </div>
      <div class="head">
        <h1>交接单编辑</h1>
      </div>
      <div class="detail">
        <ul class="ul">
          <li>业务实体：{{list.busiEntityName}}</li>
          <li>交接单号：{{list.transferNum}}</li>
          <li>创建人：{{list.transferCreator}}</li>
        </ul>
        <ul>
          <li>单据类型：{{list.showItemType}}</li>
          <li>创建时间：{{list.createAt}}</li>
          <li>备注：{{list.remark}}</li>
        </ul>
      </div>
      <div>
         <el-tabs size="mini" type="card" v-model="radio3" @tab-click="changeType" >
          <el-tab-pane size="mini" label="明细" name="1"></el-tab-pane>
          <el-tab-pane size="mini" label="文件" name="2"></el-tab-pane>
        </el-tabs>
      </div>
      <div  v-show="showDetial" class="invoiceDetail">
        <div class="fileDetail">
          <el-button @click="addInvoiceLine" size="mini">新增</el-button>
           <el-button @click="deleteDetial"  size="mini">删除</el-button>
        </div>
        <el-table size="mini" :data="detailLine" border style="width: 100%" class="fileBottom" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" id="tableSel"></el-table-column>
          <el-table-column show-overflow-tooltip :label="objectColumns['lineNo'].label" :prop="objectColumns['lineNo'].name"></el-table-column>
          <el-table-column show-overflow-tooltip :label="objectColumns['invoiceNo'].label" :prop="objectColumns['invoiceNo'].name"></el-table-column>
          <el-table-column show-overflow-tooltip :label="objectColumns['type'].label" :formatter="objectColumns['type'].formatter" :prop="objectColumns['type'].name" ></el-table-column>
          <el-table-column show-overflow-tooltip :label="objectColumns['seller'].label" :prop="objectColumns['seller'].name"></el-table-column>
          <el-table-column show-overflow-tooltip :label="objectColumns['buyer'].label" :prop="objectColumns['buyer'].name"></el-table-column>
          <el-table-column show-overflow-tooltip :label="objectColumns['makeInvoiceTime'].label" :prop="objectColumns['makeInvoiceTime'].name" ></el-table-column>
          <el-table-column show-overflow-tooltip :label="objectColumns['totalPrice'].label" :prop="objectColumns['totalPrice'].name" ></el-table-column>
          <el-table-column show-overflow-tooltip :label="objectColumns['taxRate'].label" :formatter="objectColumns['taxRate'].formatter" :prop="objectColumns['taxRate'].name"></el-table-column>
          <el-table-column show-overflow-tooltip :label="objectColumns['totalTax'].label" :prop="objectColumns['totalTax'].name"></el-table-column>
          <el-table-column show-overflow-tooltip :label="objectColumns['totalPriceTax'].label" :prop="objectColumns['totalPriceTax'].name"></el-table-column>
          <el-table-column show-overflow-tooltip :label="objectColumns['remark'].label" :prop="objectColumns['remark'].name"></el-table-column>
        </el-table>
      </div>
      <div v-show="showFileDetial" class="fileDetail">
        <div>
        <el-button @click="uploadFile" size="mini" >上传</el-button>
        <input type="file" ref="excelFile"  style="display:none" @change="fileUpload" >
       </div >
        <el-table size="mini" :data="detailFile" border style="width: 80%" class="fileBottom">
           <el-table-column :label="objectFileColumns['fileName'].label" :prop="objectFileColumns['fileName'].name" ></el-table-column>
          <el-table-column :label="objectFileColumns['uploadBy'].label" :prop="objectFileColumns['uploadBy'].name"></el-table-column>
          <el-table-column :label="objectFileColumns['createAt'].label" :prop="objectFileColumns['createAt'].name"></el-table-column>
           <el-table-column show-overflow-tooltip align="center" label="操作">
              <template min-width="100" slot-scope="scope">
                <el-button icon="el-icon-delete" @click="deleteFile(scope.row.picPath)" size="mini"></el-button>
                <el-button icon="el-icon-search" @click="showDetail(scope.row.picPath)"  size="mini"></el-button>
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
     <el-dialog title="选择相关交接人员" :visible.sync="dialogVisible"  class="dialogTransfer" width="40%" >
        <el-transfer filterable   :titles="['所有人员', '选中人员']" filter-placeholder="请输入姓名" v-model="value2" :data="data2">
        </el-transfer>
        <div class="dialogButton">
        <el-button size="mini" @click="confirmPerson">提交</el-button>
        <el-button size="mini" @click="cancelPerson">取消</el-button>
        </div>
    </el-dialog>
    <el-dialog title="提示" :show-close="false" :visible.sync="dialogVisibleSubmitMessage" style="font-size:15px" center width="30%" :close-on-click-modal="showVisible">
      <span style="font-size:15px;color:black">已生成交接单号：</span>{{invoiceReceiptNo}}<span style="font-size:15px;color:black"></span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitCancel">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog  title="选择发票" :visible.sync="dialogInvoiceVisible"  width="80%">
      <MyInvoiceAddKTable :transferType="transferType" show-overflow-tooltip :mate="dataKTable" @actionSelected="handleInvoiceSelection" ></MyInvoiceAddKTable>
      <el-button  size="mini" style="margin-top:10px;" type="primary" @click="confirmInvoice">提交</el-button>
      <el-button size="mini"  style="margin-top:10px;" @click="cancelInvoice">取消</el-button>
    </el-dialog>
     <el-dialog :visible.sync="detialPlayVideo" @close="closePlay">
      <player :video-url="videoUrl" :state="state"></player>
    </el-dialog>
      <el-dialog :visible.sync="dialogImageVisible" width="30%">
          <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </el-row>
    
  </div>
</template>
<script>
import { API_GATEWAY } from '@/config/index.js'
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
import Player from '../../components/Player.vue'
export default {
  mixins: [ColumnFormatterMixin],
  props: {
    mate: Object
  },
  components: {
    MyInvoiceAddKTable: function index (resolve) {
      require(['../../components/ReconciliationSettlement/MyInvoiceAddKTable.vue'], resolve)
    },
    Player
  },
  data () {
    return {
      list: {},
      fileList: [],
      invoiceSelection: [],
      showDetial: true,
      radio3: '1',
      transferType: '',
      videoUrl: '',
      state: '',
      detialPlayVideo: false,
      showFileDetial: false,
      dialogVisibleSubmitMessage: false,
      detailLine: [],
      tmpRows: [],
      dataKTable: {},
      titleTransferId: false,
      showVisible: false,
      MyInvoiceAddKTable: {},
      dialogInvoiceVisible: false,
      dialogVisible: false,
      dialogImageVisible: false,
      dialogImageUrl: '',
      invoiceReceiptNo: '',
      detailFile: [],
      data2: [],
      pageSize: 5,
      page: 0,
      total: 10,
      value2: [],
      multipleSelection: [],
      objectColumns: {},
      objectFileColumns: {}
    }
  },
  created () {
    this.getPerson()
    let detailC = this.mate.headerDetailLineDto.columns
    let detailR = this.mate.headerDetailLineDto.rows
    this.formatterBefore(detailC)
    detailC.map((i) => { this.objectColumns[i.name] = i })
    this.mate.fileListDto.columns.map((i) => { this.objectFileColumns[i.name] = i })
    this.detailLine = detailR
    this.transferType = this.mate.headerDetailDto.rows.transferType
    this.list = detailR[0]
    if (this.list.itemType === '0') {
      this.list.showItemType = 'AP发票'
    } else {
      this.list.showItemType = 'AR发票'
    }
    if (detailR[0].transferId) {
      this.titleTransferId = true
    } else {
      this.titleTransferId = false
    }
  },
  methods: {
    handleInvoiceSelection (val) {
      this.invoiceSelection = val
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    changeType (val) {
      if (val.name === '1') {
        this.showDetial = true
        this.showFileDetial = false
        this.detailLine = this.mate.headerDetailLineDto.rows
      } else if (val.name === '2') {
        var vm = this
        this.showDetial = false
        this.showFileDetial = true
        if (this.mate.headerDetailDto.rows.id) {
          this.httpMethods('/purchase/files/all/list?sourceId=', this.mate.headerDetailDto.rows.id)
        } else {
          this.httpMethods('/purchase/files/all/list?sourceId=', this.list.transferId)
        }
      }
    },
    httpMethods (url, id) {
      var vm = this
      this.$root.ajaxData(url + id, {}, function (data) {
        vm.detailFile = data.data
        vm.total = data.total
      })
    },
    closePlay () {
      this.state = true
      this.videoUrl = ''
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
      url = '/purchase/files/all/list?sourceId=' + this.list.transferId + '&pageSize=' + this.pageSize + '&pageNum=' + this.page
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
    getPerson () {
      var vm = this
      var data = []
      var personData = []
      this.$root.ajaxData('/purchase/reqPurchase/getUsers', {}, function (response) {
        personData = response
        personData.forEach((person, index) => {
          data.push({
            label: person.username,
            key: person.id
          })
        })
        vm.data2 = data
      }, 'GET')
    },
    submitCancel () {
      this.dialogVisibleSubmitMessage = false
      if (this.transferType === '0') {
        this.$root.monitor({ url: '/purchase/invoiceReceipt/all/list?transferType=0' })
      } else {
        this.$root.monitor({ url: '/purchase/invoiceReceipt/all/list?transferType=1' })
      }
    },
    // 新增明细
    addInvoiceLine () {
      var vm = this
      if (this.transferType === '0') {
        this.$root.ajaxData('/purchase/tms/invoice/all/list?transferFlag=0&itemType=0&nopage=true', {}, function (data) {
          delete data.mate.mateList.btns
          vm.dataKTable = data.mate.mateList
          let temp = []
          let tempData = vm.detailLine
          let dataKTableRows = vm.dataKTable.rows
          vm.dataKTable.rows = []
          dataKTableRows.forEach(i => {
            temp[i.id] = true
          })
          dataKTableRows.forEach(i => {
            if (!temp[i.id]) {
              vm.dataKTable.rows.push(i)
            }
          })
        }, 'GET')
      } else {
        this.$root.ajaxData('/purchase/tms/invoice/all/list?transferFlag=0&itemType=1&nopage=true', {}, function (data) {
          delete data.mate.mateList.btns
          vm.dataKTable = data.mate.mateList
          let temp = []
          let tempData = vm.detailLine
          let dataKTableRows = vm.dataKTable.rows
          vm.dataKTable.rows = []
          dataKTableRows.forEach(i => {
            temp[i.id] = true
          })
          dataKTableRows.forEach(i => {
            if (!temp[i.id]) {
              vm.dataKTable.rows.push(i)
            }
          })
        }, 'GET')
      }
      this.dialogInvoiceVisible = true
    },
    // 明细行确定
    confirmInvoice () {
      this.tmpRows = this.detailLine
      this.dialogInvoiceVisible = false
      this.tmpRows.push(...this.invoiceSelection)
      for (let i = 0; i < this.tmpRows.length; i++) {
        this.tmpRows[i].lineNo = i + 1
      }
      this.detailLine = this.tmpRows
    },
    // 明细行取消
    cancelInvoice () {
      this.dialogInvoiceVisible = false
    },
    // 保存
    submit () {
      for (let i = 0; i <= this.detailLine.length - 2; i++) {
        if (this.detailLine[i].buyerOu !== this.detailLine[ i + 1].buyerOu) {
          this.$message({
            message: '请选择相同业务实体的发票',
            type: 'warning'
          })
          return
        }
      }
      this.dialogVisible = true
    },
    // 取消
    cancel () {
      if (this.transferType === '0') {
        this.$root.monitor({ url: '/purchase/invoiceReceipt/all/list?transferType=0' })
      } else {
        this.$root.monitor({ url: '/purchase/invoiceReceipt/all/list?transferType=1' })
      }
    },
    // 明细行
    invoiceDetail () {
      this.showDetial = true
      this.showFileDetial = false
      this.detailLine = this.mate.headerDetailLineDto.rows
    },
    // 文件上传
    uploadFile () {
      this.$refs.excelFile.click()
    },
    // 文件上传
    fileUpload (file) {
      var vm = this
      var formdata = new FormData()
      formdata.append('file', file.target.files[0])
      if (this.mate.headerDetailDto.rows.id) {
        this.$http({
          url: API_GATEWAY + '/zuul/api/purchase/tms/invoice/upload?sourceId=' + this.mate.headerDetailDto.rows.id,
          method: 'POST',
          body: formdata,
          responseType: 'arraybuffer'
        }).then(function (response) {
          if (response.status === 40041) {
            this.$message({
              message: '上传错误',
              type: 'warning'
            })
          }
          vm.$refs.excelFile.value = ''
          setTimeout(function () {
            vm.$root.ajaxData('/purchase/files/all/list?sourceId=' + vm.mate.headerDetailDto.rows.id, {}, function (data) {
              vm.detailFile = data.data
              vm.total = data.total
            })
          }, 1000)
        })
      } else {
        this.$http({
          url: API_GATEWAY + '/zuul/api/purchase/tms/invoice/upload?sourceId=' + this.list.transferId,
          method: 'POST',
          body: formdata,
          responseType: 'arraybuffer'
        }).then(function (response) {
          if (response.status === 40041) {
            this.$message({
              message: '上传错误',
              type: 'warning'
            })
          }
          file.target.value = ''
          setTimeout(function () {
            vm.$root.ajaxData('/purchase/files/all/list?sourceId=' + vm.list.transferId, {}, function (data) {
              vm.detailFile = data.data
              vm.total = data.total
            })
          }, 1000)
        })
      }
    },
    // 获取文件列表
    fileDetail () {
      var vm = this
      this.showDetial = false
      this.showFileDetial = true
      let rowsId = this.mate.headerDetailDto.rows.id
      if (rowsId) {
        this.$root.ajaxData('/purchase/files/all/list?sourceId=' + rowsId, {}, function (data) {
          vm.detailFile = data.data
          vm.total = data.total
        })
      } else {
        this.$root.ajaxData('/purchase/files/all/list?sourceId=' + this.list.transferId, {}, function (data) {
          vm.detailFile = data.data
          vm.total = data.total
        })
      }
    },
    // 明细行删除
    deleteDetial () {
      let temp = []
      let tempData = this.detailLine
      this.detailLine = []
      this.multipleSelection.forEach(i => {
        temp[i.id] = true
      })
      tempData.forEach(i => {
        if (!temp[i.id]) {
          this.detailLine.push(i)
        }
      })
      for (let i = 0; i < this.detailLine.length; i++) {
        this.detailLine[i].lineNo = i + 1
      }
    },
    // 文件删除
    deleteFile (picPath, id) {
      var vm = this
      vm.$root.ajaxData('/purchase/files/del?url=' + picPath, {}, function (data) {
        let rowsId = vm.mate.headerDetailDto.rows.id
        if (rowsId) {
          vm.$root.ajaxData('/purchase/files/all/list?sourceId=' + rowsId, {}, function (data) {
            vm.detailFile = data.data
            vm.total = data.total
          })
        } else {
          vm.$root.ajaxData('/purchase/files/all/list?sourceId=' + vm.list.transferId, {}, function (data) {
            vm.detailFile = data.data
            vm.total = data.total
          })
        }
      }, 'DELETE')
    },
    // 文件查看
    showDetail (id) {
      var fileType = id.substr(id.lastIndexOf('.')).toLowerCase()
      if (fileType === '.jpg' || fileType === '.jpeg' || fileType === '.png' || fileType === '.gif') {
        this.dialogImageVisible = true
        this.dialogImageUrl = id
      } else {
        var a = document.createElement('a')
        document.body.appendChild(a)
        a.setAttribute('style', 'display:none')
        a.setAttribute('href', id)
        a.click()
      }
    },
    // 交接人员选择确认
    confirmPerson () {
      var vm = this
      if (this.value2.length === 0) {
        this.$message({
          message: '请选择交接人员',
          type: 'warning'
        })
        return
      }
      const rowt = { id: this.detailLine.map((r) => r.id) }
      const rowtLine = { id: this.detailLine.map((r) => r.id) }
      const params = {
        id: this.mate.headerDetailDto.rows.id,
        itemType: this.list.itemType,
        busiEntity: this.list.busiEntity,
        makeInvoiceTime: this.list.makeInvoiceTime,
        operatePerson: this.value2
      }
      if (this.list.transferId) {
        this.$root.ajaxData('/purchase/invoiceReceipt/updateTransfer?ids=' + rowtLine.id + '&transferId=' + this.list.transferId, params, function (data) {
          vm.dialogVisible = false
          if (vm.transferType === '0') {
            vm.$root.monitor({ url: '/purchase/invoiceReceipt/all/list?transferType=0' })
          } else {
            vm.$root.monitor({ url: '/purchase/invoiceReceipt/all/list?transferType=1' })
          }
        }, 'PUT')
      } else {
        this.$root.ajaxData('/purchase/invoiceReceipt/add?ids=' + rowt.id, params, function (data) {
          vm.dialogVisible = false
          if (data.statusCode === 40045) {
            vm.$message({
              message: '已生成交接单',
              type: 'warning'
            })
            return
          } else {
            vm.dialogVisibleSubmitMessage = true
            vm.invoiceReceiptNo = data.data
          }
        }, 'POST')
      }
    },
    // 交接人员取消
    cancelPerson () {
      this.dialogVisible = false
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
.fileBottom{
   margin-top:5px
}
.main{
  margin-left:20px
}
.el-transfer-panel__item.el-checkbox .el-checkbox__label{
 display: inline;
}
</style>
