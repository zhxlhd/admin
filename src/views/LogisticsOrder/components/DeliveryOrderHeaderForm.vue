
<!-- created by hezhiqiang on 2019/11/28 -->
<!-- 新增模块头部表单 -->
<template>
  <div>
    <div class="baseInfo">
      <span class="title">提货单基础信息</span>
      <el-row class="cuttingLine">
        <el-form size="mini" ref="baseInfoForm" :model="mate.mateFormerHeader.values" :inline="mate.inline" label-position="labelPosition" :rules="baseInfoRules" :label-width="labelWidth">
          <el-row>
            <!-- 提货单号 -->
            <el-col :sm="24" :md="12" :lg="8">
              <el-form-item :label="headForm.ladingBillCode.label" :prop="headForm.ladingBillCode.name">
                <el-input 
                  :disabled="Disabled" 
                  v-model="mate.mateFormerHeader.values['ladingBillCode']">
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 提货单状态 -->
            <el-col :sm="24" :md="12" :lg="8">
              <el-form-item :label="headForm.state.label" :prop="headForm.state.name">
                <dict-selected
                  v-model="mate.mateFormerHeader.values['state']"
                  dictType="ladingState"
                  :initValue="mate.mateFormerHeader.values['state']"
                  :rowId="showState">
                </dict-selected>
              </el-form-item>
            </el-col>
            <!-- 是否零担 -->
            <el-col :sm="24" :md="12" :lg="8">
              <el-form-item :label="headForm.isLessThanCarload.label" :prop="headForm.isLessThanCarload.name">
                <el-switch
                  :disabled="showDisabled"
                  v-model="mate.mateFormerHeader.values['isLessThanCarload']"                
                  active-text="是"
                  active-value="Y"
                  active-color="#5cb85c"
                  inactive-text="否"
                  inactive-value="N"
                  inactive-color="#5bc0de">
                </el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!-- 时效 -->
            <el-col :sm="24" :md="12" :lg="8">
              <el-form-item :label="headForm.effectiveTime.label" :prop="headForm.effectiveTime.name">
                <dict-selected
                  v-model="mate.mateFormerHeader.values['effectiveTime']"
                  dictType="aging"
                  :initValue="mate.mateFormerHeader.values['effectiveTime']"
                  :rowId="showDict">
                </dict-selected>
              </el-form-item>
            </el-col>
            <!-- 预计总板数 -->
            <el-col :sm="24" :md="12" :lg="8">
              <el-form-item :label="headForm.estimatePalletsQuantity.label" :prop="headForm.estimatePalletsQuantity.name">
                <el-input-number
                  :disabled="showDisabled" 
                  v-model.number="mate.mateFormerHeader.values['estimatePalletsQuantity']"
                  :controls="controls"
                  :precision="0"
                  :min="1">
                </el-input-number>
              </el-form-item>
            </el-col>
            <!-- 业务实体 -->
            <el-col :sm="24" :md="12" :lg="8">
              <el-form-item v-if="mate.mateFormerHeader.values.isEdit === 0" :label="headForm.officeName.label" :prop="headForm.officeName.name">
                <el-input
                  v-model="mate.mateFormerHeader.values['officeName']">
                </el-input>
              </el-form-item>
              <el-form-item v-else :label="headForm.officeId.label" :prop="headForm.officeId.name">
                <el-select
                  :disabled="showDisabled"
                  v-model="mate.mateFormerHeader.values['officeId']"
                  placeholder="请选择业务实体"
                  @change="changeValue(mate.mateFormerHeader.values['officeId'])">
                  <el-option
                    v-for="item in businessDivisions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="buttonStyle">
            <!-- 收货公司按钮 -->
            <span class="selectButton" @click="selectReceiveCompanyName()">选择收货公司信息</span>
          </el-row>
          <el-row>
            <!-- 收货公司 -->
            <el-col :sm="24" :md="12" :lg="8">
              <el-form-item :label="headForm.receivingCompanyName.label" :prop="headForm.receivingCompanyName.name">
                <el-input
                  :disabled="Disabled"
                  v-model="mate.mateFormerHeader.values['receivingCompanyName']">
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 联系方式 -->
            <el-col :sm="24" :md="12" :lg="8">
              <el-form-item :label="headForm.receivingCompanyContact.label" :prop="headForm.receivingCompanyContact.name">
                <el-input
                  :disabled="Disabled"
                  v-model="mate.mateFormerHeader.values['receivingCompanyContact']"
                  :maxlength="maxlengthContact">
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 收货地址 -->
            <el-col :sm="24" :md="12" :lg="8">
              <el-form-item :label="headForm.receivingCompanyAddress.label" :prop="headForm.receivingCompanyAddress.name">
                <el-input
                  :disabled="Disabled"
                  v-model="mate.mateFormerHeader.values['receivingCompanyAddress']">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 制单人 -->
          <el-col :sm="24" :md="12" :lg="8">
            <el-form-item :label="headForm.documentMaker.label" :prop="headForm.documentMaker.name">
              <el-input
                :disabled="Disabled"
                v-model="mate.mateFormerHeader.values['documentMaker']">
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 制单人Email -->
          <el-col :sm="24" :md="12" :lg="8">
            <el-form-item :label="headForm.documentMakerEmail.label" :prop="headForm.documentMakerEmail.name">
              <el-input
                :disabled="showDisabled"
                v-model="mate.mateFormerHeader.values['documentMakerEmail']">
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 制单人电话 -->
          <el-col :sm="24" :md="12" :lg="8">
            <el-form-item :label="headForm.documentMakerPhone.label" :prop="headForm.documentMakerPhone.name">
              <el-input
                :disabled="showDisabled"
                v-model="mate.mateFormerHeader.values['documentMakerPhone']">
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 制单日期 -->
          <el-col :sm="24" :md="12" :lg="8">
            <el-form-item :label="headForm.documentDate.label" :prop="headForm.documentDate.name">
              <el-date-picker
                :disabled="Disabled"
                v-model="mate.mateFormerHeader.values['documentDate']"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="请选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <!-- 所需车型 -->
          <el-col :sm="24" :md="12" :lg="8">
            <el-form-item :label="headForm.requiredVehicleType.label" :prop="headForm.requiredVehicleType.name">
              <el-input
                :disabled="showDisabled"
                v-model="mate.mateFormerHeader.values['requiredVehicleType']">
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 出货备注 -->
          <el-col :sm="24" :md="12" :lg="8">
            <el-form-item :label="headForm.deliveryRemark.label" :prop="headForm.deliveryRemark.name">
              <el-input
                :disabled="showDisabled"
                type="textarea"
                :rows="2"
                v-model="mate.mateFormerHeader.values['deliveryRemark']"
                placeholder="请输入出货备注">
              </el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <div class="deliveryDemand">
      <span class="title">出货需求信息</span>
      <el-row class="cuttingLine">
        <el-form size="mini" ref="deliveryDemandForm" :model="mate.mateFormerHeader.values" :inline="mate.inline" label-position="labelPosition" :rules="deliveryDemandRules" :label-width="labelWidth">
          <el-row>
            <!-- 实际总箱数 -->
            <el-col :sm="24" :md="12" :lg="8">
              <el-form-item :label="headForm.actualBoxesQuantity.label" :prop="headForm.actualBoxesQuantity.name">
                <el-input-number
                  :disabled="showDisabled" 
                  v-model.number="mate.mateFormerHeader.values['actualBoxesQuantity']"
                  :controls="controls"
                  :precision="0"
                  :min="1">
                </el-input-number>
              </el-form-item>
            </el-col>
            <!-- 实际总板数 -->
            <el-col :sm="24" :md="12" :lg="8">
              <el-form-item :label="headForm.actualPalletsQuantity.label" :prop="headForm.actualPalletsQuantity.name">
                <el-input-number
                  :disabled="showDisabled" 
                  v-model.number="mate.mateFormerHeader.values['actualPalletsQuantity']"
                  :controls="controls"
                  :precision="0"
                  :min="1">
                </el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!-- 预计到厂时间 -->
            <el-col :sm="24" :md="12" :lg="8">
              <el-form-item :label="headForm.requireArrivalTime.label" :prop="headForm.requireArrivalTime.name">
                <el-date-picker
                  :disabled="showDisabled"
                  v-model="mate.mateFormerHeader.values['requireArrivalTime']"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="请选择到厂时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <!-- 抵达日期 -->
            <el-col :sm="24" :md="12" :lg="8">
              <el-form-item :label="headForm.requireArrivalDate.label" :prop="headForm.requireArrivalDate.name">
                <el-date-picker
                  :disabled="showDisabled"
                  v-model="mate.mateFormerHeader.values['requireArrivalDate']"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="请选择抵达日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!-- 出货仓库 -->
            <el-col :sm="24" :md="12" :lg="8">
              <el-form-item v-if="mate.mateFormerHeader.values.isEdit === 0" :label="headForm.warehouseName.label" :prop="headForm.warehouseName.name">
                <el-input
                  v-model="mate.mateFormerHeader.values['warehouseName']">
                </el-input>
              </el-form-item>
              <el-form-item v-else :label="headForm.deliveryWarehouseId.label" :prop="headForm.deliveryWarehouseId.name">
                <el-select
                  :disabled="showDisabled"
                  v-model="mate.mateFormerHeader.values['deliveryWarehouseId']"
                  placeholder="请选择出货仓库"
                  @change="changeVal(mate.mateFormerHeader.values['deliveryWarehouseId'])"
                  @visible-change="deliveryDeliveryWarehouseId">
                  <el-option
                    v-for="item in warehouseNames"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- 出货地址 -->
            <el-col :sm="24" :md="12" :lg="8">
              <el-form-item :label="headForm.warehouseAddress.label" :prop="headForm.warehouseAddress.name">
                <el-input
                  :disabled="Disabled"
                  v-model="mate.mateFormerHeader.values['warehouseAddress']">
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 出货联系方式 -->
            <el-col :sm="24" :md="12" :lg="8">
              <el-form-item :label="headForm.deliveryContact.label" :prop="headForm.deliveryContact.name">
                <el-input
                  :disabled="Disabled"
                  v-model="mate.mateFormerHeader.values['deliveryContact']">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!-- 是否多点送货 -->
            <el-col :sm="24" :md="12" :lg="8">
              <el-form-item :label="headForm.isMultipoint.label" :prop="headForm.isMultipoint.name">
                <el-switch
                  :disabled="showDisabled"
                  v-model="mate.mateFormerHeader.values['isMultipoint']"                 
                  active-text="是"
                  active-value="Y"
                  active-color="#5cb85c"
                  inactive-text="否"
                  inactive-value="N"
                  inactive-color="#5bc0de">
                </el-switch>
              </el-form-item>
            </el-col>
            <!-- 是否跨厂区提货 -->
            <el-col :sm="24" :md="12" :lg="8">
              <el-form-item :label="headForm.isCrossRegion.label" :prop="headForm.isCrossRegion.name">
                <el-switch
                  :disabled="showDisabled"
                  v-model="mate.mateFormerHeader.values['isCrossRegion']"                 
                  active-text="是"
                  active-value="Y"
                  active-color="#5cb85c"
                  inactive-text="否"
                  inactive-value="N"
                  inactive-color="#5bc0de">
                </el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!-- 是否返程带货 -->
            <el-col :sm="24" :md="12" :lg="8">
              <el-form-item :label="headForm.isReturn.label" :prop="headForm.isReturn.name">
                <el-switch
                  :disabled="showDisabled"
                  v-model="mate.mateFormerHeader.values['isReturn']"                 
                  active-text="是"
                  active-value="Y"
                  active-color="#5cb85c"
                  inactive-text="否"
                  inactive-value="N"
                  inactive-color="#5bc0de">
                </el-switch>
              </el-form-item>
            </el-col>
            <!-- 是否急货 -->
            <el-col :sm="24" :md="12" :lg="8">
              <el-form-item :label="headForm.isUrgent.label" :prop="headForm.isUrgent.name">
                <el-switch
                  :disabled="showDisabled"
                  v-model="mate.mateFormerHeader.values['isUrgent']"                 
                  active-text="是"
                  active-value="Y"
                  active-color="#5cb85c"
                  inactive-text="否"
                  inactive-value="N"
                  inactive-color="#5bc0de">
                </el-switch>
              </el-form-item>
            </el-col>
            <!-- 是否拼车 -->
            <el-col :sm="24" :md="12" :lg="8">
              <el-form-item :label="headForm.isCarpool.label" :prop="headForm.isCarpool.name">
                <el-switch
                  :disabled="showDisabled"
                  v-model="mate.mateFormerHeader.values['isCarpool']"                
                  active-text="是"
                  active-value="Y"
                  active-color="#5cb85c"
                  inactive-text="否"
                  inactive-value="N"
                  inactive-color="#5bc0de">
                </el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!-- 提货要求/备注 -->
            <el-col :sm="24" :md="12" :lg="8">
              <el-form-item :label="headForm.ladingRemark.label" :prop="headForm.ladingRemark.name">
                <el-input
                  :disabled="showDisabled"
                  type="textarea"
                  :rows="2"
                  v-model="mate.mateFormerHeader.values['ladingRemark']"
                  placeholder="请输入出货备注">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!-- 物流商 -->
            <el-col :sm="24" :md="12" :lg="8">
              <el-form-item v-if="mate.mateFormerHeader.values.isEdit === 0" :label="headForm.logisticsProviderName.label" :prop="headForm.logisticsProviderName.name">
                <el-input
                  v-model="mate.mateFormerHeader.values['logisticsProviderName']">
                </el-input>
              </el-form-item>
              <el-form-item v-else :label="headForm.logisticsProviderId.label" :prop="headForm.logisticsProviderId.name">
                <el-select
                  :disabled="showDisabled"
                  v-model="mate.mateFormerHeader.values['logisticsProviderId']"
                  @change="changeLogisticsProvider(mate.mateFormerHeader.values['logisticsProviderId'])"
                  placeholder="请选择物流商">
                  <el-option
                    v-for="item in provider"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- 物流商电话 -->
            <el-col :sm="24" :md="12" :lg="8">
              <el-form-item :label="headForm.logisticsProviderPhone.label" :prop="headForm.logisticsProviderPhone.name">
                <el-input
                  :disabled="showDisabled" 
                  v-model="mate.mateFormerHeader.values['logisticsProviderPhone']"
                  v-on:input="importPhone">
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 物流商Email -->
            <el-col :sm="24" :md="12" :lg="8">
              <el-form-item :label="headForm.logisticsProviderEmail.label" :prop="headForm.logisticsProviderEmail.name">
                <el-input
                  :disabled="showDisabled" 
                  v-model="mate.mateFormerHeader.values['logisticsProviderEmail']"
                  v-on:input="importEmail">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
    </div>
    <!-- 选择公司信息弹框 -->
    <el-dialog title="选择收货公司信息" width="80%" :visible.sync="dialogVisible">
      <!-- 表单 -->
      <el-form size="mini" ref="form" :model="search" label-position="right" label-width="100px">
        <el-col :span="6">
          <el-form-item label="客户名">
            <el-input v-model="search.companyName" placeholder="请输入客户名"></el-input>
            <!-- <el-select v-model="search.companyName" placeholder="请选择客户名">
              <el-option
                v-for="item in companyNames"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select> -->
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="客户联系人">
            <el-input v-model="search.consignee" placeholder="请输入客户联系人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="详细地址">
            <el-input v-model="search.detailAddress" placeholder="请输入详细地址"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button size="mini" @click="formSearch()">查询</el-button>
          </el-form-item>
        </el-col>
      </el-form>
      <div class="submitButton">
        <el-button size="mini" @click="submitSelect()">确定</el-button>
      </div>
      <!-- 表格 -->
      <el-table size="mini" :data="tableData" border @select="handleSelected" @select-all="handleSelectedAll">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="companyName"
          label="客户名">
        </el-table-column>
        <el-table-column
          prop="consignee"
          label="收货联系人">
        </el-table-column>
        <el-table-column
          prop="detailAddress"
          label="收货地址">
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="center" class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        layout="total, prev, pager, next, sizes"
        :total="total"
        :page-sizes ="[5,10,15,20,30]"
        :page-size="size">
      </el-pagination>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import SERVICES from "@/services";
import { dateFormatter } from "@/utils/DateUtils";
import TYPES from '@/store/mutations-types'
import { isPositiveEmail,trimSpace } from '@/utils/util.js';

export default {
  data() {
    var validatePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入手机号"));
      } else if (!this.isCellPhone(value)) {
        callback(new Error("请输入正确的手机号!"));
      } else {
        callback();
      }
    };
    var validateEmail = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入邮箱"));
      }else if (!isPositiveEmail(trimSpace(value))) {
        callback(new Error('请输入正确的邮箱!'));
      } else {
        callback();
      }
    };
    return {
      labelPosition: "right",  // label位置
      controls: false,         // input-number 是否禁用按钮
      maxlengthContact: 20,    // 控制输入长度
      headForm: {},            // 头部表单字段
      showDisabled: false,     // 表单字段显示隐藏
      Disabled: true,          // 自动带出或者选择带出的字段置灰
      showState: 1,            // 自动带出字段置灰
      showDict: 0,             // 数字词典是否禁用 1/0
      valuesClone: {},         // 头部数据克隆
      businessDivisions: [],   // 业务实体
      warehouseNames: [],      // 仓库下拉值
      warehouseData: [],       // 仓库数据
      dialogVisible: false,    // 收货公司弹出框
      companyName: [],         //客户名
      search: {                // 弹出框表单数据
        companyName: '',
        consignee: '',
        detailAddress: '',
      },
      page: 1,                 
      size: 5,             
      tableData: [],          // 弹出框列表数据
      selectedLines: [],      // 勾选行
      baseInfoRules: {
        // 业务实体
        officeId: [{required: true,message: "该输入项为必输项",trigger: ['blur','change']}],
        // 收货公司
        receivingCompanyName: [{required: true,message: "该选择收货公司信息"}],
      },
      deliveryDemandRules: {
        // 预计到厂时间
        requireArrivalTime: [{required: true,message: "该输入项为必输项",trigger: "blur"}],
        // 抵达日期
        requireArrivalDate: [{required: true,message: "该输入项为必输项",trigger: "blur"}],
        // 出货仓库
        deliveryWarehouseId:[{required: true,message: "该输入项为必选项",trigger: ['blur','change']}],
        // 物流商
        logisticsProviderId: [{required: true,message: "该输入项为必输项",trigger: ['blur','change']}],
        // 物流商电话
        logisticsProviderPhone: [{required: true,trigger: "blur",validator: validatePhone}],
        // 物流商邮箱
        logisticsProviderEmail: [{required: true,trigger: "blur",validator: validateEmail}],
      },
      pickerOptions: {
        // 日期禁用今天之前的
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      providerData: [],               // 物流商数据
      provider: [],                  // 物流商下拉值
      oldLogisticsProviderId: '',    // 修改提货单定义物流商
      oldLogisticsProviderPhone: '', // 修改提货单定义物流商电话
      oldLogisticsProviderEmail: '', // 修改提货单定义物流商邮箱
    };
  },
  components: {
    "dict-selected": function index(resolve) {
      require(["@/components/DictSelected.vue"], resolve);
    }
  },
  props: {
    mate: Object,
    labelWidth: String
  },
  created() {
    this.mate.mateFormerHeader.fields.map((item) => { this.headForm[item.name] = item; });
    // 获取业务实体
    this._getOffice();
    // 获取物流商
    this._getProvider();
    if (this.mate.mateFormerHeader.values['officeId']) {
      // 修改进来有业务实体id，直接调用获取出货仓库接口
      this._getWasehouse();
    };
    if (this.mate.mateFormerHeader.values.id) {
      this.oldLogisticsProviderId = this.mate.mateFormerHeader.values['logisticsProviderId']
      this.oldLogisticsProviderPhone = this.mate.mateFormerHeader.values['logisticsProviderPhone']
      this.oldLogisticsProviderEmail = this.mate.mateFormerHeader.values['logisticsProviderEmail']
    }
  },
  watch: {
    
  },
  computed: {

  },
  mounted() {
    // 创建日期默认值，默认为当天
    let date = this.mate.mateFormerHeader.values.documentDate  || '';
    this.mate.mateFormerHeader.values.documentDate  = date || dateFormatter("YYYY-MM-DD HH:mm:ss");
    // 创建人默认获取当前用户
    const localStorage = window.localStorage;
    var localuser = JSON.parse(localStorage.getItem('user'));
    this.mate.mateFormerHeader.values.documentMaker = (localuser.firstname + localuser.lastname)
  },
  methods: {
    //检查手机号
	  isCellPhone(val) {
      if (!/^1(3|4|5|6|7|8)\d{9}$/.test(val)) {
        return false;
      } else {
        return true;
      }
    },
    /**
     * 获取物流商
     * @param void
     * @return void
     */
    _getProvider () {
      SERVICES.LOGISTICS_DELIVERY_ORDER.getLogisticsProvider().then(res => {
        this.providerData = res.data;
        if (this.providerData.length) {
          this.providerData.forEach(item => {
            if ((item.providerName == "") || (item.providerName == undefined) || (item.id == "")) return;
            this.provider.push({
              'label': item.providerName,
              'value': item.id,
              'key': item.id,
            })
          })
        }
      })
    },
    /**
     * 选择物流商
     */
    changeLogisticsProvider (val) {
      if (val) {
        this.providerData.forEach(i => {
          if (i.id === val) {
            this.mate.mateFormerHeader.values['logisticsProviderName'] = i.providerName
          }
        })
        if (this.mate.mateList2.rows.length > 0 && this.oldLogisticsProviderId !== val) {
          this.mate.mateFormerHeader.values['logisticsProviderId'] = this.oldLogisticsProviderId
          this.$message({
            type: 'warning',
            message: '请先清空线路列表数据,再选择物流商'
          })
          return;
        } else {
          let params = {
            'logisticsProviderId' : this.mate.mateFormerHeader.values['logisticsProviderId']
          }
          this.$bus.emit('lodisticsProviderInfoId', params)
        }
      }
      // this.$store.dispatch(
      //   "LogisticsProviderInfo/setLogisticsProviderId", 
      //   this.mate.mateFormerHeader.values['logisticsProviderId']
      // )
    },
    /**
     * 输入物流商电话
     */
    importPhone (val) {
      if (val) {
        if (this.mate.mateList2.rows.length > 0 && this.oldLogisticsProviderPhone !== val) {
          this.mate.mateFormerHeader.values['logisticsProviderPhone'] = this.oldLogisticsProviderPhone
          this.$message({
            type: 'warning',
            message: '请先清空线路列表数据,再编辑物流商电话'
          })
          return;
        } else {
          let params = {
            'logisticsProviderPhone' : this.mate.mateFormerHeader.values['logisticsProviderPhone']
          }
          this.$bus.emit('lodisticsProviderInfoPhone', params)
        }
      }
      // if (val) {
      //   this.$store.commit(
      //     "LogisticsProviderInfo/setLogisticsProviderPhone", 
      //     this.mate.mateFormerHeader.values['logisticsProviderPhone']
      //   )
      // }
    },
    /**
     * 输入物流商邮箱
     */
    importEmail (val) {
      if (val) {
        if (this.mate.mateList2.rows.length > 0 && this.oldLogisticsProviderEmail !== val) {
          this.mate.mateFormerHeader.values['logisticsProviderEmail'] = this.oldLogisticsProviderEmail
          this.$message({
            type: 'warning',
            message: '请先清空线路列表数据,再编辑物流商邮箱'
          })
          return;
        } else {
          let params = {
            'logisticsProviderEmail' : this.mate.mateFormerHeader.values['logisticsProviderEmail']
          }
          this.$bus.emit('lodisticsProviderInfoEmail', params)
        }
      }
      // if (val) {
      //   this.$store.commit(
      //     "LogisticsProviderInfo/setLogisticsProviderEmail", 
      //     this.mate.mateFormerHeader.values['logisticsProviderEmail']
      //   )
      // }
    },
    /**
     * 获取业务实体
     * @param void
     * @return void
     */
    _getOffice () {
      SERVICES.LOGISTICS_DELIVERY_ORDER.getOffice().then(res => {
        let data = res.data;
        if (data.length) {
          data.forEach(item => {
            if ((item.name == "") || (item.name == undefined) || (item.id == "")) return;
            this.businessDivisions.push({
              'label': item.name,
              'value': item.id,
              'key': item.id,
            })
          })
        }
      })
    },
    /**
     * 修改业务实体
     */
    changeValue (val) {
      if(!val){
        this.mate.mateFormerHeader.values['deliveryWarehouseId'] = ''
      }else {
        this.mate.mateFormerHeader.values['deliveryWarehouseId'] = '' 
        this.mate.mateFormerHeader.values['receivingCompanyName'] = ''
        this.mate.mateFormerHeader.values['receivingCompanyContact']  = ''
        this.mate.mateFormerHeader.values['receivingCompanyAddress'] = ''
        this.mate.mateFormerHeader.values['warehouseAddress'] = ''
        this.mate.mateFormerHeader.values['deliveryContact'] = ''
        this._getWasehouse()
      }
    },
    /**
     * 获取出货仓库
     * @param void
     * @return void
     */
    _getWasehouse () {
      this.warehouseNames = []
      let officeId = this.mate.mateFormerHeader.values['officeId']
      SERVICES.LOGISTICS_DELIVERY_ORDER.getWarehouse(officeId).then(res => {
        this.warehouseData = res.data;
        if (this.warehouseData.length) {
          this.warehouseData.forEach(item => {
            if ((item.warehouseName == "") || (item.warehouseName == undefined) || (item.id == "")) return;
            this.warehouseNames.push({
              'label': item.warehouseName,
              'value': item.id,
              'key': item.id,
            })
            if (this.mate.mateFormerHeader.values.id) {
              if (this.mate.mateFormerHeader.values['deliveryWarehouseId'] === item.id) {
                this.mate.mateFormerHeader.values['warehouseAddress'] = item.warehouseAddress
                this.mate.mateFormerHeader.values['deliveryContact'] = item.contact
              }
            }       
          })
        }
      })
    },
    /**
     * 修改出货仓库
     * @param val
     */
    changeVal (val) {
      if (!val) {
        this.mate.mateFormerHeader.values['warehouseAddress'] = ''
        this.mate.mateFormerHeader.values['deliveryContact'] = ''
      } else {
        this.warehouseData.forEach(i => {
          if (i.id === val) {
            this.mate.mateFormerHeader.values['warehouseAddress'] = i.warehouseAddress
            this.mate.mateFormerHeader.values['deliveryContact'] = i.contact
          }
        })
      }
    },
    /**
     * 没选业务实体，选择出货仓库给出提示信息
     */
    deliveryDeliveryWarehouseId (flag) {
      if(flag){
        if(!this.mate.mateFormerHeader.values['officeId']){
          this.$message({
            message: '请选择业务实体',
            type: 'warning'
          })
          return
        }
      }
    },
    /**
     * checkbox 勾选计算 拿到勾选的数据
     * @return void
     */
    handleSelected(val) {
      this.selectedLines = val
    },
    /**
     * checkbox 全选 拿到勾选的数据
     * @return void
     */
    handleSelectedAll(val) {
      this.selectedLines = val
    },
    /**
     * 选择收货公司按钮
     */
    selectReceiveCompanyName () {
      if (!this.mate.mateFormerHeader.values['officeId']) {
        this.$message({
          message: "请选择业务实体",
          type: "warning"
        });
        this.dialogVisible = false
      } else {
        this.dialogVisible = true
        this.getSearchData('paging')
      }
    },
    /**
     * 点击收货公司弹出框查询按钮
     */
    formSearch () {
       this.getSearchData('paging')
     },
     handleSizeChange (val) {
      this.size = val
      this.getSearchData('paging')
    },
    handleCurrentChange (val) {
      this.page = val
      this.getSearchData('paging')
    },
     /**
      * 获取收货公司查询数据
      */
     getSearchData (flag) {
       const params = {
         'officeId' : this.mate.mateFormerHeader.values['officeId'],
         'companyName' : this.search.companyName,
         'consignee' : this.search.consignee,
         'detailAddress' : this.search.detailAddress,
         'pageNum' : this.page,
         "pageSize" : this.size
       }
       SERVICES.LOGISTICS_DELIVERY_ORDER.getReceiceCompany(params).then(res => {
          this.tableData = res.data.mate.rows
          this.total = res.data.mate.total
        })
     },
     /**
      * 点击收货公司弹出框确定按钮
      */
     submitSelect () {
       if (this.selectedLines.length !== 1) {
        this.$message({
          message: this.$t("seladata"),
          type: "warning"
        });
        return;
      }
      this.dialogVisible = false
      this.$set(this.mate.mateFormerHeader.values,'receivingCompanyName',this.selectedLines[0].companyName)
      this.$set(this.mate.mateFormerHeader.values,'receivingCompanyContact',this.selectedLines[0].consigneePhone)
      this.$set(this.mate.mateFormerHeader.values,'receivingCompanyAddress',this.selectedLines[0].detailAddress)
      this.$set(this.mate.mateFormerHeader.values,'receivingCompanyCode',this.selectedLines[0].companyCode)
     },
    /**
     * 重置弹窗表单
     * 数据清空，验证信息重置
     * @param {String} formName 需要重置的表单 ref 名称
     * @return void
     */
    resetForm(formName) {
      let name = formName || this.formName;
      this.$refs[name].resetFields();
    }
  }
};
</script>

<style scoped lang="scss">
.el-form-item__label {
  line-height: inherit;
}
.el-form--inline > * {
  margin-right: 10px;
}
.el-form-item {
  margin: 15px 20px 2px 0px;
}
.leftFloat .el-row {
  float: left;
  width: 250px;
}
.leftFloat .el-row input {
  width: 250px;
}
.leftFloat .el-form-item {
  margin: 0;
}
.leftFloat .button {
  float: left;
}
.el-form--inline .el-form-item {
  width: 200px;
  display: inline-block;
  margin-right: 10px;
  vertical-align: top;
}
.el-form-item.is-required .el-form-item__label:before {
  content: "";
}
.el-form-item.is-required .el-form-item__label:after {
  content: "*";
  color: #ff4949;
  margin-right: 4px;
}
.el-cascader {
  width: 100%;
}
.hidden {
  display: none;
}
h4 {
  margin-top: 40px;
  margin-bottom: 10px;
}
.el-select {
  width: 100%;
}
.el-date-editor.el-input {
  width: 100%;
}
.el-form--inline.el-form--label-top .el-form-item__content {
  width: 90%;
}
.leftFloat .el-form--inline .el-form-item {
  margin-right: 10px;
}
.el-input__suffix {
  right: 80px;
}
.el-form-item--mini.el-form-item {
  margin: 6px;
}
.el-input--mini .el-input__inner {
  width: 80%;
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
.baseInfo {
  margin: 10px 0 20px 0;
}
.title {
  width: 100%;
  font-size: 18px;
  font-weight: 550;
  color: #0088cc;
  margin-bottom: 10px;
}
.cuttingLine {
  margin-top: 10px;
  border-top: 1px solid #DDDDDD;
}
.buttonStyle {
  margin: 10px 0;
  .selectButton {
    cursor: pointer;
    margin-left: 125px;
    padding: 8px 15px;
    color: #ffffff;
    border-radius: 4px;
    background-color: #49afcd;
  }
}
.submitButton {
  margin-bottom: 10px;
}
</style>
<style>
.el-form-item__content .el-input-number {
  width: 100%;
}
.el-form-item__content .el-input-number .el-input__inner {
  text-align: left;
}
.el-switch__label {
  position: absolute;
  display: none;
  color: #ffffff;
}
/*打开时文字位置设置 */
.el-switch__label--right {
  z-index: 1;
  right: -4px;
}
/*关闭时文字位置设置 */
.el-switch__label--left {
  z-index: 1;
  left: 30px;
}
/*显示文字 */
.el-switch__label.is-active {
  display: block;
  color: #ffffff;
}
.el-switch .el-switch__core,
.el-switch .el-switch__label {
  width: 50px !important;
}
</style>
