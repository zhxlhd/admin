<template>
  <div>
    <!--新增明细行-->
    <el-dialog :before-close="closeHand" title="新增手工录入行" width="30%" :visible.sync="addDialogFormVisible" :close-on-click-modal="closeOnClickModal">
      <div class="dialog-div">
        <el-form :model="values" label-position="right" label-width="80px">
          <el-form-item :rules="rulesLineType" label="行类型" :props="values['lineType']">
            <el-select size="mini" v-model="values['lineType']" placeholder="请选择">
              <el-option
                v-for="item in Options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :rules="rulesMoneyAmount" label="含税金额" :props="values['moneyAmount']">
            <el-input size="mini" v-model="values['moneyAmount']" @change="changeMoney"></el-input>
          </el-form-item>
           <el-form-item :rules="rulesQty" label="数量" :props="values['qty']" v-show="showQty">
            <el-input size="mini" v-model="values['qty']"></el-input>
          </el-form-item>
          <el-form-item :rules="rulesRemark" label="摘要" :props="values['summary']">
            <el-input size="mini" v-model="values['summary']"></el-input>
          </el-form-item>
          <!-- <el-form-item label="物料编码" :props="values['itemCode']">
            <el-input  size="mini" v-model="values['itemCode']"></el-input>
          </el-form-item> -->
          <!-- <el-form-item label="PO编号" :props="values['poCode']">
            <el-input size="mini" v-model="values['poCode']"></el-input>
          </el-form-item>
          <el-form-item label="数量" :props="values['qty']">
            <el-input size="mini" v-model="values['qty']"></el-input>
          </el-form-item>
          <el-form-item label="单位" :props="values['itemUnit']">
            <el-input size="mini" v-model="values['itemUnit']"></el-input>
          </el-form-item>
          <el-form-item label="含税单价" :props="values['price']">
            <el-input size="mini" v-model="values['price']"></el-input>
          </el-form-item> -->
        </el-form>
      </div>
      <div class="dialog-button">
        <el-button size="mini" @click="confirmLine">确定</el-button>
        <el-button size="mini" @click="cancelLine">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        closeOnClickModal: false,
        showQty: false,
        values: {
          type: '',
          moneyAmount: 0,
          lineAttribute3: '',
          lineType:'0',
          poCode: '',
          qty: '',
          itemUnit: '',
          price: '',
          summary: ''
        },
        Options: [
          {
            label: '运费',
            value: '2'
          },
          {
            label: '项目',
            value: '0'
          }
        ],
        rulesMoneyAmount: [
          { required: true, message: '请输入含税金额', trigger: 'blur' }
        ],
        rulesLineType: [
          { required: true, message: '请输入行类型', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入含税单价', trigger: 'blur' }
        ],
        rulesRemark: [
          { required: true, message: '请输入摘要', trigger: 'blur' }
        ],
        rulesQty: []
      }
    },
    props: {
      addDialogFormVisible: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      confirmLine () {
        if (!this.values.lineType || !this.values.summary) {
          this.$message({
            message: '行类型、含税金额、摘要必填，且含税金额不能为0',
            type: 'warning'
          })
          return
        } else {
          if(this.values.moneyAmount > 0){
            if(!this.values.qty || this.values.qty <= 0){
              this.$message({
                message: '含税金额>0,数量必须填写准确',
                type: 'warning'
              })
              return
            }
          } else if(this.values.moneyAmount == 0 || !this.values.moneyAmount){
             this.$message({
            message: '行类型、含税金额、摘要必填，且含税金额不能为0',
            type: 'warning'
          })
          return
          }
        }
        this.$emit('confirmLine', this.values)
      },
      cancelLine () {
        this.closeHand()
        this.values = {
          lineType: '0',
          moneyAmount: 0,
          lineAttribute3: '',
          poCode: '',
          qty: '',
          unit: '',
          price: '',
          remark: ''
        }
        this.showQty = false
        this.rulesQty = {}
      },
      // 关闭前函数
      closeHand () {
        this.$emit('closeHand')
      },
      // 金额改变时 金额为正 则数量为必填项  金额为负 则数量不需填写
      changeMoney(val){
        if(val>0){
          this.showQty = true
          this.rulesQty =  { required: true, message: '请输入数量', trigger: 'blur' }
        } else {
          this.showQty = false
          this.rulesQty = {}
          this.values.qty = null
        }
      }
    }
  }
</script>