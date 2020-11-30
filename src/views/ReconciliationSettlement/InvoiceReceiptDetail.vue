<template>
  <div>
    <el-row>
      <div class="head">
        <h1>交接单详情</h1>
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
        <el-table size="mini" :data="detailLine" border style="width: 100%" class="bottom">
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
        <el-table size="mini" :data="detailFile" border style="width: 100%" class="fileBottom">
          <el-table-column :label="objectFileColumns['fileName'].label" :prop="objectFileColumns['fileName'].name" ></el-table-column>
          <el-table-column :label="objectFileColumns['uploadBy'].label" :prop="objectFileColumns['uploadBy'].name"></el-table-column>
          <el-table-column :label="objectFileColumns['createAt'].label" :prop="objectFileColumns['createAt'].name"></el-table-column>
           <el-table-column align="center" label="操作">
              <template slot-scope="scope">
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
      <el-dialog :visible.sync="dialogImageVisible" width="30%">
          <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
      <el-dialog :visible.sync="detialPlayVideo" @close="closePlay">
      <player :video-url="videoUrl" :state="state"></player>
    </el-dialog>
    </el-row>
  </div>
</template>
<script>
import ColumnFormatterMixin from '../../mixins/ColumnFormatterMixin'
import Player from '../../components/Player.vue'
export default {
  mixins: [ColumnFormatterMixin],
  props: {
    mate: Object
  },
  components: {
    Player
  },
  data () {
    return {
      list: {},
      page: 0,
      pageSize: 5,
      total: 10,
      radio3: '1',
      fileList: [],
      showDetial: true,
      detialPlayVideo: false,
      videoUrl: '',
      state: '',
      objectColumns: {},
      objectFileColumns: {},
      dialogImageVisible: false,
      dialogImageUrl: '',
      showFileDetial: false,
      detailLine: [],
      detailFile: []
    }
  },
  created () {
    let detailDtoC = this.mate.headerDetailLineDto.columns
    let detailDtoR = this.mate.headerDetailLineDto.rows
    this.formatterBefore(detailDtoC)
    detailDtoC.map((i) => { this.objectColumns[i.name] = i })
    this.mate.fileListDto.columns.map((i) => { this.objectFileColumns[i.name] = i })
    this.detailLine = detailDtoR
    this.list = detailDtoR[0]
    if (this.list.itemType === '0') {
      this.list.showItemType = 'AP发票'
    } else {
      this.list.showItemType = 'AR发票'
    }
  },
  methods: {
    invoiceDetail () {
      this.showDetial = true
      this.showFileDetial = false
      this.detailLine = this.mate.headerDetailLineDto.rows
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
        this.$root.ajaxData('/purchase/files/all/list?sourceId=' + this.list.transferId, {}, function (data) {
          vm.detailFile = data.data
          vm.total = data.total
        })
      }
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
    closePlay () {
      this.state = true
      this.videoUrl = ''
    },
    fileDetail () {
      var vm = this
      this.showDetial = false
      this.showFileDetial = true
      this.$root.ajaxData('/purchase/files/all/list?sourceId=' + this.list.transferId, {}, function (data) {
        vm.detailFile = data.data
        vm.total = data.total
      })
    },
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
</style>
