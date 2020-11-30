<template>
  <div>
    <Formor :mate= "mate" ref="CustomerForm"></Formor>
    <div v-if="mateValuesId">
      <h4>客户地点信息</h4>
      <div>
        <el-button size="mini" @click="addMainMsgSub" class="add">新增</el-button>
      </div>
      <el-tabs type="card" >
        <el-tab-pane label="主要信息">
          <CTable @rowClick="rowClick" :mate="customerData.AddMainMsg" :tableData="tableData1" :show="show" @action="handleUpDataAddr" @actionDel="handleDelAddr">
          </CTable>
        </el-tab-pane>
        <el-tab-pane label="销售信息">
          <CTable @rowClick="rowClick" :mate="customerData.AddSellMsg" :tableData="tableData2" :show="!show" @action="handleUpDataAddr" @actionDel="handleDelAddr">
          </CTable>
        </el-tab-pane>
        <el-tab-pane label="财务信息">
          <CTable @rowClick="rowClick" :mate="customerData.AddFaniMsg" :tableData="tableData3" :show="!show" @action="handleUpDataAddr" @actionDel="handleDelAddr">
          </CTable>
        </el-tab-pane>
      </el-tabs>
      <CTable :mate= "customerData.BankMsg" :tableData="tableData4" :show="show" @action="handleUpDataBank" @actionDel="handleDelBank">
        <div slot="title">
          <h4>客户银行信息</h4>
        </div>
        <div slot= "button">
          <el-button size="mini" @click="addBankMsg" class="add">新增</el-button>
        </div>
      </CTable>
      <CTable :mate= "customerData.customerMsg" :tableData="tableData5" :show="show" @action="handleUpDataCustomer" @actionDel="handleDelCustomer">
        <div slot="title">
          <h4>客户联系人信息</h4>
        </div>
        <div slot= "button">
          <el-button size="mini" @click="addCustomerMsg" class="add">新增</el-button>
        </div>
      </CTable>
      <CTable :mate= "customerData.fileMsg" :tableData="tableData6" :show="show" @action="handleUpDataFile" @actionDel="handleDelFile" :load="load" @actionLoad="handleLoad">
        <div slot="title">
          <h4>客户附件信息</h4>
        </div>
        <div slot= "button">
          <el-button size="mini" @click="addFileMsg" class="add">新增</el-button>
        </div>
      </CTable>
    </div>
    
    <!--客户地点信息专用-->
    <el-dialog v-if="mateValuesId" :title="title" :visible.sync="dialogAddrMsg" width="80%">
      <el-row>
        <el-form size="mini" :model="addrSellerFani.newMainMsg" :rules="newMainMsg.rules" ref="ruleAddrForm" :label-width="labelWidth" label-position="right">
          <el-tabs v-model="activeName2" type="card">
            <el-tab-pane  label="主要信息" name="first">

              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="customerData.newMainMsg.fields[1].label" :prop="customerData.newMainMsg.fields[1].name">
                  <el-input disabled v-model="addrSellerFani.newMainMsg['code']"></el-input>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="customerData.newMainMsg.fields[2].label" :prop="customerData.newMainMsg.fields[2].name">
                    <el-select clearable v-model="addrSellerFani.newMainMsg.orgId" :disabled="showEdit">
                    <el-option :label="item.label" :value="item.value" v-for="item of officeIdOptions" :key="item.name"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="customerData.newMainMsg.fields[8].label" :prop="customerData.newMainMsg.fields[8].name">
                  <el-select clearable v-model="addrSellerFani.newMainMsg['status']">
                    <el-option :label="item.label" :value="item.value" v-for="(item, index) of customerData.newMainMsg.fields[8].options" :key="index" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item class="country"  :label="customerData.newMainMsg.fields[0].label" :prop="customerData.newMainMsg.fields[0].name">
                  <country-select @input="inputChangeAddr" v-model="addrSellerFani.newMainMsg['country']" :customerAdd="customerAdd" ref="CountrySelect"></country-select>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="customerData.newMainMsg.fields[4].label">
                  <addrselect
                      :disabledFlag="disabledFlagAddr"
                      :initselectedvalue="initprovselectedvalueAddr"
                      :addrs="provAddrs"
                      v-model="addrSellerFani.newMainMsg['province']"
                      @change="provChange"
                      class="select-31"
                      id="prov_select"
                      name="prov" lazy ref="Addrselect">
                  </addrselect>
                </el-form-item>
              </el-col>
              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="customerData.newMainMsg.fields[5].label">
                <addrselect
                    :disabledFlag="disabledFlagAddr"
                    :initselectedvalue="initcityselectedvalueAddr"
                    :addrs="cityAddrs"
                    v-model="addrSellerFani.newMainMsg['city']"
                    @change="cityChange"
                    class="select-31"
                    id="city_select"
                    name="city" lazy>
                </addrselect>
                </el-form-item>
              </el-col>
              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="customerData.newMainMsg.fields[6].label">
                  <addrselect
                      :disabledFlag="disabledFlagAddr"
                      :initselectedvalue="initregionselectedvalueAddr"
                      :addrs="regionAddrs"
                      v-model="addrSellerFani.newMainMsg['county']"
                      @change="regionChange"
                      class="select-31"
                      id="region_select"
                      name="region" lazy>
                    </addrselect>
                </el-form-item>
              </el-col>
              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item  :label="customerData.newMainMsg.fields[3].label" :prop="customerData.newMainMsg.fields[3].name" >
                  <el-input v-model="addrSellerFani.newMainMsg.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="customerData.newMainMsg.fields[7].label" :prop="customerData.newMainMsg.fields[7].name" >
                  <el-input v-model="addrSellerFani.newMainMsg.address"></el-input>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="customerData.newMainMsg.fields[9].label" :prop="customerData.newMainMsg.fields[9].name">
                  <el-select clearable v-model="addrSellerFani.newMainMsg['mainAddress']">
                    <el-option :label="item.label" :value="item.value" v-for="(item, index) of customerData.newMainMsg.fields[9].options" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="customerData.newMainMsg.fields[11].label" :prop="customerData.newMainMsg.fields[11].name">
                  <el-input v-model="addrSellerFani.newMainMsg['fileNumber']"></el-input>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item  :label="customerData.newMainMsg.fields[10].label" :prop="customerData.newMainMsg.fields[10].name">
                  <el-date-picker clearable type="date" v-model="addrSellerFani.newMainMsg['auditDate']"></el-date-picker>
                </el-form-item>
              </el-col>

              <!--去除经办人字段 -->
              <!-- <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="customerData.newMainMsg.fields[12].label" :prop="customerData.newMainMsg.fields[12].name">
                  <el-select clearable v-model="addrSellerFani.newMainMsg['userId']">
                    <el-option :label="item.label" :value="item.value" v-for="(item, index) of customerData.newMainMsg.fields[12].options" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col> -->

              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="customerData.newMainMsg.fields[13].label" :prop="customerData.newMainMsg.fields[13].name">
                  <el-input v-model="addrSellerFani.newMainMsg['orignalSystemCode']"></el-input>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="customerData.newMainMsg.fields[14].label" :prop="customerData.newMainMsg.fields[14].name">
                  <el-select clearable v-model="addrSellerFani.newMainMsg['acceptUnilateral']">
                    <el-option :label="item.label" :value="item.value" v-for="(item, index) of customerData.newMainMsg.fields[14].options" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
                            
            </el-tab-pane>
            <el-tab-pane label="销售信息" name="second">

              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="customerData.newSellMsg.fields[0].label" :prop="customerData.newSellMsg.fields[0].name">
                  <el-select clearable @visible-change="visibleChangeGoodReceiver" v-model="addrSellerFani.newSellMsg['goodsReceiver']" :disabled="showEdit">
                    <el-option :label="item.label" :value="item.value" v-for="(item, index) of customerData.newSellMsg.fields[0].options" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="customerData.newSellMsg.fields[1].label" :prop="customerData.newSellMsg.fields[1].name">
                  <el-select clearable v-model="addrSellerFani.newSellMsg['billReceiver']" :disabled="showEdit">
                    <el-option :label="item.label" :value="item.value" v-for="(item,index) of customerData.newSellMsg.fields[1].options" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="customerData.newSellMsg.fields[2].label" :prop="customerData.newSellMsg.fields[2].name">
                  <el-select clearable :disabled="relativeFlag" @visible-change="visibleChangeR" v-model="addrSellerFani.newSellMsg['relateBillReceiver']">
                    <el-option :label="item.label" :value="item.value" v-for="(item, index) of customerData.newSellMsg.fields[2].options" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="customerData.newSellMsg.fields[3].label" :prop="customerData.newSellMsg.fields[3].name">
                  <el-input v-model="addrSellerFani.newSellMsg['invoiceName']"></el-input>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="customerData.newSellMsg.fields[6].label" :prop="customerData.newSellMsg.fields[6].name">
                  <el-select clearable v-model="addrSellerFani.newSellMsg['orderReleaseLevel']">
                    <el-option :label="item.label" :value="item.value" v-for="(item, index) of customerData.newSellMsg.fields[6].options" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="customerData.newSellMsg.fields[7].label" :prop="customerData.newSellMsg.fields[7].name">
                  <el-select clearable v-model="addrSellerFani.newSellMsg['inBatches']">
                    <el-option :label="item.label" :value="item.value" v-for="(item, index) of customerData.newSellMsg.fields[7].options" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="customerData.newSellMsg.fields[8].label" :prop="customerData.newSellMsg.fields[8].name">
                  <el-select clearable v-model="addrSellerFani.newSellMsg['allowOdd']">
                    <el-option :label="item.label" :value="item.value" v-for="(item, index) of customerData.newSellMsg.fields[8].options" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="customerData.newSellMsg.fields[9].label" :prop="customerData.newSellMsg.fields[9].name">
                  <el-input v-model="addrSellerFani.newSellMsg['mileage']"></el-input>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="customerData.newSellMsg.fields[4].label" :prop="customerData.newSellMsg.fields[4].name">
                  <el-input v-model="addrSellerFani.newSellMsg['nearlyEffective']"></el-input>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="customerData.newSellMsg.fields[5].label" :prop="customerData.newSellMsg.fields[5].name">
                  <el-select clearable v-model="addrSellerFani.newSellMsg['shipmentTemplate']">
                    <el-option :label="item.label" :value="item.value" v-for="(item, index) of customerData.newSellMsg.fields[5].options" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-tab-pane>
            <el-tab-pane label="财务信息" name="third">
              <!-- 付款条件 -->
              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item  :label="customerData.newFaniMsg.fields[0].label">
                  <dict-selected v-model="addrSellerFani.newFaniMsg['payment']" :initValue="addrSellerFani.newFaniMsg['payment']" dictType="paymentMethod"></dict-selected>
                </el-form-item>
              </el-col>
              <!-- 币种 -->
              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item  :label="customerData.newFaniMsg.fields[1].label">
                  <dict-selected v-model="addrSellerFani.newFaniMsg['currency']" :initValue="addrSellerFani.newFaniMsg['currency']" dictType="currency"></dict-selected>
                </el-form-item>
              </el-col>
              <!-- 税种 -->
              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item  :label="customerData.newFaniMsg.fields[2].label">
                  <dict-selected v-model="addrSellerFani.newFaniMsg['taxCategory']" :initValue="addrSellerFani.newFaniMsg['taxCategory']" dictType="taxCategory"></dict-selected>
                </el-form-item>
              </el-col>
              <!-- 税率 -->
              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="customerData.newFaniMsg.fields[3].label" :prop="customerData.newFaniMsg.fields[3].name">
                  <dict-selected v-model="addrSellerFani.newFaniMsg['taxRate']" :initValue="addrSellerFani.newFaniMsg['taxRate']" dictType="tax"></dict-selected>
                </el-form-item>
              </el-col>
              <!-- 发票类型 -->
              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item  :label="customerData.newFaniMsg.fields[4].label">
                  <dict-selected v-model="addrSellerFani.newFaniMsg['invoiceType']" :initValue="addrSellerFani.newFaniMsg['invoiceType']"  dictType="invoiceType"></dict-selected>
                </el-form-item>
              </el-col>
              <!-- 账期起算标准 -->
              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item  :label="customerData.newFaniMsg.fields[5].label">
                  <dict-selected v-model="addrSellerFani.newFaniMsg['paymentSince']"  :initValue="addrSellerFani.newFaniMsg['paymentSince']" dictType="paymentSince"></dict-selected>
                </el-form-item>
              </el-col>
              <!-- 付款方式 -->
              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item  :label="customerData.newFaniMsg.fields[6].label">
                  <dict-selected v-model="addrSellerFani.newFaniMsg['paymentMode']" :initValue="addrSellerFani.newFaniMsg['paymentMode']" dictType="paymentMode"></dict-selected>
                </el-form-item>
              </el-col>
              
              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="customerData.newFaniMsg.fields[7].label" :prop="customerData.newFaniMsg.fields[7].name">
                  <el-input v-model="addrSellerFani.newFaniMsg['paymentDays']"></el-input>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="customerData.newFaniMsg.fields[8].label" :prop="customerData.newFaniMsg.fields[8].name">
                  <el-input v-model="addrSellerFani.newFaniMsg['creditLine']"></el-input>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="8" :lg="6">
                <el-form-item :label="customerData.newFaniMsg.fields[9].label" :prop="customerData.newFaniMsg.fields[9].name">
                  <el-input v-model="addrSellerFani.newFaniMsg['creditPaymentDays']"></el-input>
                </el-form-item>
              </el-col>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </el-row>
      
      <div class="submitCancel">
        <el-button size="mini" type="primary" @click="DialogClickOKAddress('ruleAddrForm')">提 交</el-button>
        <el-button size="mini" @click="backHandleAddress('ruleAddrForm')">取 消</el-button>
      </div>
    </el-dialog>

    <!--银行专用-->
    <el-dialog v-if="mateValuesId" :title="title" :visible.sync="dialogBankMsg" width="80%">
      <el-row>
      <el-form size="mini" :model="newBankMsg.values" :rules="newBankMsg.rules" ref="ruleBankForm" :label-width="labelWidth">

        <el-col :sm="12" :md="8" :lg="6">
            <el-form-item :label="customerData.newBankMsg.fields[0].label" :prop="customerData.newBankMsg.fields[0].name">
              <el-select clearable @visible-change="visibleChangeAddr" v-model="newBankMsg.values[customerData.newBankMsg.fields[0].name]">
                <el-option :label="item.label" :value="item.value" v-for="(item, index) of customerData.newBankMsg.fields[0].options" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="bankMsgObject['account'].label" :prop="bankMsgObject['account'].name">
            <el-input type="number" v-model="newBankMsg.values[bankMsgObject['account'].name]" @change="makeBankInfo()" @blur="makeBankInfo()"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="bankMsgObject['bankCode'].label" :prop="bankMsgObject['bankCode'].name">
            <el-input v-model="newBankMsg.values[bankMsgObject['bankCode'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="bankMsgObject['bankName'].label" :prop="bankMsgObject['bankName'].name">
            <el-input v-model="newBankMsg.values[bankMsgObject['bankName'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="bankMsgObject['lineNumber'].label" :prop="bankMsgObject['lineNumber'].name">
            <el-input v-model="newBankMsg.values[bankMsgObject['lineNumber'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="bankMsgObject['openingBank'].label" :prop="bankMsgObject['openingBank'].name">
            <el-input v-model="newBankMsg.values[bankMsgObject['openingBank'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="bankMsgObject['accountName'].label" :prop="bankMsgObject['accountName'].name">
            <el-input v-model="newBankMsg.values[bankMsgObject['accountName'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item  :label="bankMsgObject['currency'].label">
            <dict-selected v-model="newBankMsg.values[bankMsgObject['currency'].name]"  dictType="currency"></dict-selected>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item  :label="bankMsgObject['mature'].label">
            <dict-selected v-model="newBankMsg.values[bankMsgObject['mature'].name]"  dictType="mature"></dict-selected>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="bankMsgObject['areaCode'].label" :prop="bankMsgObject['areaCode'].name">
            <el-input v-model="newBankMsg.values[bankMsgObject['areaCode'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="bankMsgObject['status'].label">
            <el-select clearable v-model="newBankMsg.values[bankMsgObject['status'].name]">
              <el-option :label="item.label" :value="item.value" v-for="(item,index) of bankMsgObject['status'].options" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        
        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item class="country"  :label="bankMsgObject['country'].label" :prop="bankMsgObject['country'].name">
            <country-select @input="inputChangeBank" v-model="newBankMsg.values[bankMsgObject['country'].name]"  :customerAdd="bankAdd"></country-select>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="bankMsgObject['province'].label">
            <addrselect
                :disabledFlag="disabledFlagBank"
                :initselectedvalue="initprovselectedvalue"
                :addrs="provAddrs"
                v-model="newBankMsg.values[bankMsgObject['province'].name]"
                @change="provChange"
                class="select-31"
                id="prov_select"
                name="prov" lazy>
            </addrselect>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="bankMsgObject['city'].label">
          <addrselect
              :disabledFlag="disabledFlagBank"
              :initselectedvalue="initcityselectedvalue"
              :addrs="cityAddrs"
              v-model="newBankMsg.values[bankMsgObject['city'].name]"
              @change="cityChange"
              class="select-31"
              id="city_select"
              name="city" lazy>
          </addrselect>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="bankMsgObject['branchCode'].label" :prop="bankMsgObject['branchCode'].name">
            <el-input v-model="newBankMsg.values[bankMsgObject['branchCode'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="bankMsgObject['branchName'].label" :prop="bankMsgObject['branchName'].name">
            <el-input v-model="newBankMsg.values[bankMsgObject['branchName'].name]"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="bankMsgObject['flagVatUsed'].label">
            <el-select clearable v-model="newBankMsg.values[bankMsgObject['flagVatUsed'].name]">
              <el-option :label="item.label" :value="item.value" v-for="(item, index) of bankMsgObject['flagVatUsed'].options" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

      </el-form>
      </el-row>
      <div class="submitCancel">
        <el-button size="mini" type="primary" @click="DialogBankClickOK('ruleBankForm')">提 交</el-button>
        <el-button size="mini" @click="dialogBankMsg = false, backHandle('ruleBankForm')">取 消</el-button>
      </div>
    </el-dialog>

    <!--联系人专用-->
    <el-dialog v-if="mateValuesId" :title="title" :visible.sync="dialogCoutomer" width="80%">
      <el-row>
      <el-form size="mini" :model="newCoutomerMsg.values" :rules="newCoutomerMsg.rules" ref="ruleCoutomerForm" :label-width="labelWidth">

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="coutomerObject['addressId'].label">
            <el-select clearable @visible-change="visibleChangeAddr" v-model="newCoutomerMsg.values[coutomerObject['addressId'].name]">
              <el-option :label="item.label" :value="item.value" v-for="(item, index) of coutomerObject['addressId'].options" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="coutomerObject['sex'].label">
            <el-select clearable  v-model="newCoutomerMsg.values[coutomerObject['sex'].name]">
              <el-option :label="item.label" :value="item.value" v-for="(item,index) of coutomerObject['sex'].options" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="coutomerObject['name'].label" :prop="coutomerObject['name'].name">
            <el-input v-model="newCoutomerMsg.values['name']"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="coutomerObject['phoneNumber'].label" :prop="coutomerObject['phoneNumber'].name">
            <el-input v-model="newCoutomerMsg.values['phoneNumber']"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="coutomerObject['fax'].label" :prop="coutomerObject['fax'].name">
            <el-input v-model="newCoutomerMsg.values['fax']"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="coutomerObject['mobile'].label" :prop="coutomerObject['mobile'].name">
            <el-input v-model="newCoutomerMsg.values['mobile']"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="coutomerObject['email'].label" :prop="coutomerObject['email'].name">
            <el-input v-model="newCoutomerMsg.values['email']"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="coutomerObject['dept'].label" :prop="coutomerObject['dept'].name">
            <el-input v-model="newCoutomerMsg.values['dept']"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="coutomerObject['job'].label" :prop="coutomerObject['job'].name">
            <el-input v-model="newCoutomerMsg.values['job']"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="coutomerObject['address'].label" :prop="coutomerObject['address'].name">
            <el-input v-model="newCoutomerMsg.values['address']"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item  :label="coutomerObject['expireDate'].label">
            <el-date-picker clearable type="date" v-model="newCoutomerMsg.values['expireDate']"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="coutomerObject['sysAccountName'].label">
            <el-select clearable v-model="newCoutomerMsg.values['sysAccountName']">
              <el-option :label="item.label" :value="item.value" v-for="(item,index) of coutomerObject['sysAccountName'].options" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
      </el-row>
      <div class="submitCancel">
        <el-button size="mini" type="primary" @click="DialogCustomerClickOK('ruleCoutomerForm')">提 交</el-button>
        <el-button size="mini" @click="dialogCoutomer = false, backHandle('ruleCoutomerForm')">取 消</el-button>
      </div>
    </el-dialog>

    <!--附件专用-->
    <el-dialog v-if="mateValuesId" :title="title" :visible.sync="dialogFile" width="80%">
      <el-row>
      <el-form size="mini" :model="newFile.values" :rules="newFile.rules" ref="ruleFileForm" :label-width="labelWidth">
        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="newFile.fields[0].label" :prop="newFile.fields[0].name">
            <el-upload
              ref="upload"
              :action="fileuploadUrl"
              :on-preview="handlePreview"
              :headers="headers"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :file-list="fileList"
              :on-change="handleOnChange"
              :before-upload="beforeAvatarUpload">
              <el-button size="mini" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="newFile.fields[1].label">
            <el-input v-model="newFile.values['type']"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :md="8" :lg="6">
          <el-form-item :label="newFile.fields[2].label">
            <el-input v-model="newFile.values['remark']"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      </el-row>
      <div class="submitCancel">
        <el-button size="mini" type="primary" @click="dialogFile = false, DialogFileClickOK('ruleFileForm')">提 交</el-button>
        <el-button size="mini" @click="dialogFile = false, backHandle('ruleFileForm')">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { DateFormat } from '../../utils/util.js'
// 根据id获取市/区数据函数，动态，经常改变
function getAddrsArrayById (id = 0) {
  return addrArr[id].map(item => {
    return {
      'text': item[1],
      'value': item[0]
    }
  })
}

import customerData from '../../constant/customerData.json';
import { API_GATEWAY } from '@/config/index.js';
import treeSelect from '../../components/tree-select/tree.vue';
import CountrySelect from '../../components/CountrySelect.vue';
import addrArr from '../../components/address/addr-arr.js';
import Addrselect from '../../components/address/Addrselect';
import bankcode from '../../constant/bank_code.json';
import axios from 'axios';

export default {
  components: {
    treeSelect,
    CountrySelect,
    Addrselect,
    Formor: function index (resolve) {
      require(['../../components/Formor.vue'], resolve)
    },
    CTable: function index (resolve) {
      require(['../../components/CTable.vue'], resolve)
    },
    KTable: function index (resolve) {
      require(['../../components/KTable.vue'], resolve)
    },
    CustomerDialog: function index (resolve) {
      require(['./AddCustomer.vue'], resolve)
    },
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
    },
    'tree-selected': function index (resolve) {
      require(['../../components/TreeSelected.vue'], resolve)
    }
  },
  watch: {

  },
  props: {
    mate: Object
  },
  data () {
    return {
      title: '新增',
      disabledFlagAddr: false,
      disabledFlagBank: false,
      relativeFlag: true,
      dialogCoutomer: false,
      clickAddressId: '',        // 地址id
      orgIdRelative: '',            // 关联收单方需要的orgId
      addrSellerFani: { 'newMainMsg': {}, 'newSellMsg': {}, 'newFaniMsg': {}},
      newMainMsg: {},
      bankAdd: {},
      activeName2: 'first',
      dialogAddrMsg: false,
      showEdit: false,
      newBankMsg: {},
      newCoutomerMsg: {},
      ruleShow: { required: true, message: '该输入项为必输项', trigger: 'blur' },
      newFile: {},
      bankMsgObject: {},
      coutomerObject: {},
      dialogBankMsg: false,                // 点击银行新增开关
      customerData: customerData,
      treeDatas: [],
      fileuploadUrl: `${API_GATEWAY}/zuul/api/file`,
      headers: {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
        'Accept': 'application/json',
        'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId
      },
      responseName: '',
      load: true,
      copyPath: '',
      action: '',                         // upload
      show: true,                       // 判断table中要不要操作这个选项
      dialogFile: false,
      dialogFormVisible: false,
      tableData1: [],
      tableData2: [],
      tableData3: [],
      tableData4: [],
      customerAdd: {},
      tableData5: [],
      officeIdOptions: [],
      tableData6: [],
      mateValuesId: 0,                   // 判断是新增还是修改
      rowId: 0,                          // 判断点击提交时是新增还是修改
      judgeUrl: 0,
      judge: '',                         // 判断是哪个表
      row: {},
      fileList: [],
      initprovselectedvalueAddr: '0',
      initcityselectedvalueAddr: '0',
      initregionselectedvalueAddr: '0',
      initprovselectedvalue: '0',
      initcityselectedvalue: '0',
      provSelected: '',
      citySelected: '',
      regionSelected: '',
      provAddrs: getAddrsArrayById(0),
      cityAddrs: [],
      regionAddrs: [],
      fileName: ''
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
      } else {
        width = '120px'
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
  created () {
    var vm = this;
    this.newBankMsg = this.customerData.newBankMsg;
    this.newMainMsg = this.customerData.newMainMsg;
    this.addrSellerFani.newMainMsg = Object.assign({}, this.customerData.newMainMsg.values);
    this.addrSellerFani.newSellMsg = Object.assign({}, this.customerData.newSellMsg.values);
    this.addrSellerFani.newFaniMsg = Object.assign({}, this.customerData.newFaniMsg.values);
    // this.addrSellerFani = Object.assign({}, this.customerData.newMainMsg.values, this.customerData.newSellMsg.values, this.customerData.newFaniMsg.values)
    this.newBankMsg.fields.map((i) => { this.bankMsgObject[i.name] = i });
    this.newCoutomerMsg = customerData.newCoutomerMsg;
    this.newFile = customerData.newFile;
    this.newCoutomerMsg.fields.map((i) => { this.coutomerObject[i.name] = i });
    this.mateValuesId = this.mate.values.id;
    if (this.mateValuesId) {
      // 获取到地址的值
      // 获取到销售信息和财务信息
      this.getDataSells(vm)
      this.getDataFinances(vm)
      // 获取到地点信息的主要信息
      this.$root.ajaxData('/addresses/all/' + this.mateValuesId, {}, function (data) {
        vm.tableData1 = []
        vm.tableData1 = data
        // 获取到银行信息
        if (data[0]) {
          vm.clickAddressId = data[0].id
          vm.orgIdRelative = data[0].orgId
          vm.getDataAccounts(vm.clickAddressId)
          // 获取到联系人信息
          vm.getDataContacts(vm.clickAddressId)
        }
        var option = {}
        var options = []
        for (var i = 0; i < data.length; i++) {
          option = { 'label': data[i].name, 'value': data[i].id }
          options.push(option)
        }
        vm.bankMsgObject['addressId'].options = Object.assign({}, options)
        vm.coutomerObject['addressId'].options = Object.assign({}, options)
      }, 'GET')
      // 获取到附件信息
      this.getDataCertificates()
    }
    this.getOfficeId()
    this.$root.ajaxData('/users/list?cols=id,username&dataOnly=true&all=1', {}, function (data) {
      var option = {}
      var options = []
      for (var i = 0; i < data.length; i++) {
        option = { 'label': data[i].username, 'value': data[i].id }
        options.push(option)
      }
      vm.customerData.newMainMsg.fields[12].options = options
    }, 'GET')
  },
  methods: {
    /** 文件状态改变时的钩子 限制一次只上传一个文件 2019-11-07
     * 添加文件、上传成功和上传失败时都会被调用
     * @param {Object} file 上传文件
     * @param {Object} fileList 文件列表
     * @return void
     */
    handleOnChange (file, fileList) {
      this.fileList = fileList.slice(-1);
    },
    getOfficeId () {
      const vm = this
      this.$root.ajaxData('/users/office', {}, function (data) {
        data.forEach(i => {
          vm.officeIdOptions.push({ 'label': i.orgName, 'value': i.officeId })
        })
      }, 'GET')
    },
    beforeAvatarUpload (file) {
      this.fileName = file.name
    },
    inputChangeAddr (val) {
      this.customerAdd = { 'nameZH': val }
      if (val === this.$t('China')) {
        this.disabledFlagAddr = false
      } else {
        this.disabledFlagAddr = true
        this.initprovselectedvalueAddr = ''
        this.initcityselectedvalueAddr = ''
        this.initregionselectedvalueAddr = ''
      }
    },
    inputChangeBank (val) {
      this.bankAdd = { 'nameZH': val }
      if (val === this.$t('China')) {
        this.disabledFlagBank = false
      } else {
        this.disabledFlagBank = true
        this.initprovselectedvalue = ''
        this.initcityselectedvalue = ''
      }
    },
    getDataAddresses (vm) {
      vm.$root.ajaxData('/addresses/all/' + vm.mateValuesId, {}, function (data) {
        vm.tableData1 = []
        vm.tableData1 = data
      }, 'GET')
    },
    getDataSells (vm) {
      vm.$root.ajaxData('/sells/all/' + vm.mateValuesId, {}, function (data) {
        vm.tableData2 = data
      }, 'GET')
    },
    getDataFinances (vm) {
      this.$root.ajaxData('/finances/all/' + this.mateValuesId, {}, function (data) {
        vm.tableData3 = data
      }, 'GET')
    },
    getDataAccounts (id) {
      var vm = this
      this.$root.ajaxData('/accounts/all/' + id, {}, function (data) {
        vm.tableData4 = data
      }, 'GET')
    },
    getDataContacts (id) {
      var vm = this
      this.$root.ajaxData('/contacts/all/' + id, {}, function (data) {
        vm.tableData5 = data
      }, 'GET')
    },
    getDataCertificates () {
      var vm = this
      this.$root.ajaxData('/certificates/all/' + this.mateValuesId, {}, function (data) {
        data.name = vm.responseName
        vm.tableData6 = data
      }, 'GET')
    },
    // 点击地点修改功能
    handleUpDataAddr (row) {
      var vm = this
      this.title = '修改'
      var dataDemo = {}
      this.$root.ajaxData('/addresses/getAll/' + row.id, {}, function (data) {
        vm.showEdit = true
        vm.addrSellerFani = data
        // vm.newMainMsg = data
        dataDemo = data
        vm.customerAdd = { 'nameZH': data.newMainMsg.country }
        vm.addrSellerFani.newMainMsg['province'] = data.newMainMsg.province
        vm.initprovselectedvalueAddr = data.newMainMsg.province
        vm.initcityselectedvalueAddr = data.newMainMsg.city
        vm.initregionselectedvalueAddr = data.newMainMsg.county
        vm.provAddrs = getAddrsArrayById(0)
        vm.cityAddrs = getAddrsArrayById(vm.initprovselectedvalueAddr)
        vm.regionAddrs = getAddrsArrayById(vm.initcityselectedvalueAddr)
      }, 'GET')
      // 获取关联数值 要有orgId还要有关联收单方的值才能加载
      if (row.orgId && dataDemo.relateBillReceiver) {
        this.relativeFlag = false
        this.$root.ajaxData('/addresses/getReceivers/' + this.mateValuesId + '/' + row.orgId, {}, function (data) {
          var option = {}
          var options = []
          for (var i = 0; i < data.length; i++) {
            option = { 'label': data[i].address, 'value': data[i].id }
            options.push(option)
          }
          vm.customerData.newSellMsg.fields[2].options = options
        }, 'GET')
      }
      this.dialogAddrMsg = true
    },
    // 点击下载
    handleLoad (row) {
      this.$http({
        url: API_GATEWAY + '/api/files/download/' + row.id,
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
          'Accept': 'application/json',
          'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId
        }
      }).then(function (response) {
        var a = document.createElement('a')
        a.setAttribute('style', 'display:none')
        a.setAttribute('target', '_blank')
        a.setAttribute('href', response.bodyText)
        var filename = row.name
        a.setAttribute('download', filename)
        a.setAttribute('id', 'download');
        // 防止反复添加
        if (document.getElementById('download')) {
          document.body.removeChild(document.getElementById('download'));
        }
        document.body.appendChild(a);
        a.click()
      })
    },
    // 点击地点删除
    handleDelAddr (row) {
      this.$confirm('是否删除此条内容?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var vm = this
        this.$root.ajaxData('/addresses/delAll/' + row.id, {}, function () {
          vm.getDataAddresses(vm)
          vm.getDataSells(vm)
          vm.getDataFinances(vm)
        }, 'DELETE')
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 值级分类，需要调用的方法
    valueLevel (data, ele) {
      var vm = this
      var ratingArr = []
      var ratingLabel
      var ratingValue
      var rating
      for (var i = 0; i < data[ele].length; i++) {
        ratingLabel = data[ele][i].label
        ratingValue = data[ele][i].value
        rating = { 'label': ratingLabel, 'value': ratingValue }
        ratingArr.push(rating)
      }
      for (var j = 0; j < vm.mate.fields.length; j++) {
        if (vm.mate.fields[j].name === ele) {
          vm.mate.fields[j].options = ratingArr
        }
      }
      for (var l = 0; l < this.customerData.newFaniMsg.fields.length; l++) {
        if (this.customerData.newFaniMsg.fields[l].name === ele) {
          this.customerData.newFaniMsg.fields[l].options = ratingArr
        }
      }
      for (var k = 0; k < this.customerData.newBankMsg.fields.length; k++) {
        if (this.customerData.newBankMsg.fields[k].name === ele) {
          this.customerData.newBankMsg.fields[k].options = ratingArr
        }
      }
    },
    provChange (val) {
      const oldVal = this.newBankMsg.values.province
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
      this.newBankMsg.values.province = val
    },
    cityChange (val) {
      const oldVal = this.newBankMsg.values.city
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
        this.regionAddrs
      }
      this.newBankMsg.values.city = val
    },
    regionChange (val) {
      this.newBankMsg.values.county = val
    },
    handleRemove (file) {
      // 上传删除
      this.$root.ajaxData('/file?path=' + this.copyPath, {}, function () {}, 'DELETE')
      this.copyPath = ''
    },
    handleSuccess (response, file) {
      var responsePrev = response.substring(0, response.indexOf('-'))
      var responseNext = response.substring(response.indexOf('-') + 1)
      this.copyPath = responsePrev
      this.responseName = responseNext
    },
    handlePreview (file) {
    },
    addMainMsgSub () {
      this.addrSellerFani.newMainMsg.id = ''                // 将id删除，就可以新增
      this.dialogAddrMsg = true
      this.showEdit = false
      this.title = '新增'
      // 获取到关联收单方
      // this.getRelative()
    },
    addBankMsg () {
      var vm = this
      this.newBankMsg.values.id = ''                        // 将id删除，就可以新增
      this.dialogBankMsg = true
      this.$root.ajaxData('/dicts/type?types=currency', {}, function (data) {
        vm.valueLevel(data, 'currency')
      }, 'GET')
      this.title = '新增'
    },
    addCustomerMsg () {
      this.newCoutomerMsg.values.id = ''                   // 将id删除，就可以新增
      this.dialogCoutomer = true
      this.title = '新增'
    },
    addFileMsg () {
      this.newFile.values.id = ''                          // 将id删除，就可以新增
      this.dialogFile = true
      this.title = '新增'
    },
    rowClick (row) {
      this.clickAddressId = row.id
      this.orgIdRelative = row.orgId
      this.getDataAccounts(this.clickAddressId)
      this.getDataContacts(this.clickAddressId)
    },
    handleUpDataBank (row) {
      this.title = '修改'
      this.dialogBankMsg = true
      this.bankAdd = { 'nameZH': row.country }
      this.newBankMsg.values = Object.assign({}, row)
      this.initprovselectedvalue = this.newBankMsg.values.province
      this.initcityselectedvalue = this.newBankMsg.values.city
      this.initregionselectedvalue = this.newBankMsg.values.county
    },
    handleUpDataCustomer (row) {
      this.title = '修改'
      this.dialogCoutomer = true
      this.newCoutomerMsg.values = Object.assign({}, row)
    },
    handleUpDataFile (row) {
      this.title = '修改'
      this.dialogFile = true
      this.newFile.value = row
    },
    DialogClickOKAddress (formName) {
      var vm = this
      // this.mate.mateFormerHeader.values.documentDate = DateFormat(this.mate.mateFormerHeader.values.documentDate, 'yyyy-MM-dd')
      this.$refs.ruleAddrForm.validate((valid) => {
        if (valid) {
          this.addrSellerFani.newMainMsg['auditDate'] = DateFormat(this.addrSellerFani.newMainMsg['auditDate'], 'yyyy-MM-dd')
          if (this.addrSellerFani.newMainMsg.id) {
            this.$root.ajaxData('/addresses/updateAll/' + this.addrSellerFani.newMainMsg.id, this.addrSellerFani, function () {
              vm.getDataAddresses(vm)
              vm.getDataSells(vm)
              vm.getDataFinances(vm)
            }, 'PUT')
          } else {
            this.$root.ajaxData('/addresses/all/' + this.mateValuesId, this.addrSellerFani, function () {
              vm.getDataAddresses(vm)
              vm.getDataSells(vm)
              vm.getDataFinances(vm)
            }, 'POST')
          }
          this.dialogAddrMsg = false
        } else {
          vm.$notify.error({
            // 如果新增第一次没有通过则把this.addrSellerFani.newMainMsg.id继续置为null
            msg: '',
            title: '消息',
            message: '数据验证未通过'
          })
          this.addrSellerFani.newMainMsg.id = msg
          this.dialogAddrMsg = true
          return false
        }
      })

      this.$refs[formName].resetFields()
      this.addrSellerFani = { 'newMainMsg': {}, 'newSellMsg': {}, 'newFaniMsg': {}}
      this.initprovselectedvalueAddr = '0'
      this.initcityselectedvalueAddr = '0'
      this.initregionselectedvalueAddr = '0'
    },
    DialogBankClickOK (ruleForm) {
      var vm = this
      this.values = this.newBankMsg.values
      var idNow = this.newBankMsg.values.id
      var addressIdNow = this.newBankMsg.values.addressId
      var isValid = ''
      this.$refs.ruleBankForm.validate((valid) => {
        if (valid) {
          if (idNow) {
            // 银行修改
            vm.$root.ajaxData('/accounts/' + addressIdNow, this.values, function () {
              vm.getDataAccounts(addressIdNow)
              // vm.newBankMsg.values = {}
              for (var idx in vm.newBankMsg.values) {
                vm.newBankMsg.values[idx] = null
              }
            }, 'PUT')
          } else {
            vm.$root.ajaxData('/accounts/' + addressIdNow, this.values, function () {
              vm.getDataAccounts(addressIdNow)
              // vm.newBankMsg.values = {}
              for (var idx in vm.newBankMsg.values) {
                vm.newBankMsg.values[idx] = null
              }
            }, 'POST')
          }
          vm.dialogBankMsg = false
        } else {
          vm.$notify.error({
            title: '消息',
            message: '数据验证未通过'
          })
          vm.dialogBankMsg = true
          // vm.newBankMsg.values = {}
          isValid = 'no'
          return false
        }
      })
      if (isValid === 'no') {
        return
      }
      // this.dialogFormVisible = false
      this.$refs[ruleForm].resetFields()
    },
    DialogCustomerClickOK (ruleForm) {
      var vm = this
      this.values = this.newCoutomerMsg.values
      this.newCoutomerMsg.values['expireDate'] = DateFormat(this.newCoutomerMsg.values['expireDate'], 'yyyy-MM-dd')
      this.$refs.ruleCoutomerForm.validate((valid) => {
        if (valid) {
          if (this.values.id) {
            // 地点修改
            vm.$root.ajaxData('/contacts/' + this.newCoutomerMsg.values.addressId, this.values, function () {
              vm.getDataContacts(vm.newCoutomerMsg.values.addressId)
              vm.newCoutomerMsg.values = {}
            }, 'PUT')
          } else {
            vm.$root.ajaxData('/contacts/' + this.newCoutomerMsg.values.addressId, this.values, function () {
              vm.getDataContacts(vm.newCoutomerMsg.values.addressId)
              vm.newCoutomerMsg.values = {}
            }, 'POST')
          }
          vm.dialogCoutomer = false
        } else {
          this.$notify.error({
            title: '消息',
            message: '数据验证未通过'
          })
          vm.dialogFormVisible = true
          vm.newCoutomerMsg.values = {}
          return false
        }
      })
    },
    DialogFileClickOK (ruleForm) {
      var vm = this
      this.newFile.values.name = this.fileName
      this.newFile.values.copyPath = this.copyPath
      this.values = this.newFile.values
      if (this.values.id) {
        // 客户修改
        this.$root.ajaxData('/certificates/' + this.mateValuesId, this.values, function () {
          vm.getDataCertificates()
          vm.newFile.values = {}
          // 提交完成，将里面的upload里面的文件清空
          vm.$refs.upload.clearFiles()
        }, 'PUT')
      } else {
        this.$root.ajaxData('/certificates/' + this.mateValuesId, this.values, function () {
          vm.getDataCertificates()
          vm.newFile.values = {}
          // 提交完成，将里面的upload里面的文件清空
          vm.$refs.upload.clearFiles()
        }, 'POST')
      }
      this.dialogFormVisible = false
    },
    handleDelBank (row) {
      var vm = this
      this.$confirm('是否删除此条内容?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$root.ajaxData('/accounts/' + row.id, {}, function () {
          vm.getDataAccounts(vm.clickAddressId)
        }, 'DELETE')
      })
    },
    handleDelCustomer (row) {
      var vm = this
      this.$confirm('是否删除此条内容?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$root.ajaxData('/contacts/' + row.id, {}, function () {
          vm.getDataContacts(vm.clickAddressId)
        }, 'DELETE')
      })
    },
    handleDelFile (row) {
      var vm = this
      this.$confirm('是否删除此条内容?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$root.ajaxData('/certificates/' + row.id, {}, function () {
          vm.getDataCertificates()
        }, 'DELETE')
      })
    },
    backHandle (formName) {
      // this.addrSellerFani = {}
      // this.newBankMsg.values = {}

      for (var idx in this.newBankMsg.values) {
        this.newBankMsg.values[idx] = null
      }

      this.newCoutomerMsg.values = {}
      this.newFile.values = {}

      // this.newCoutomerMsg.values = Object.assign({}, this.customerData1.newCoutomerMsg.values)
    },
    backHandleBank (formName) {
      this.newBankMsg.values = this.customerData.newBankMsg.values
    },
    backHandleAddress (formName) {
      this.dialogAddrMsg = false
      this.$refs[formName].resetFields()
      this.addrSellerFani = { 'newMainMsg': {}, 'newSellMsg': {}, 'newFaniMsg': {}}
      this.initprovselectedvalueAddr = '0'
      this.initcityselectedvalueAddr = '0'
      this.initregionselectedvalueAddr = '0'
    },
    visibleChangeAddr (flag) {
      var vm = this
      if (flag) {
        this.$root.ajaxData('/addresses/all/' + this.mateValuesId, {}, function (data) {
          var option = {}
          var options = []
          for (var i = 0; i < data.length; i++) {
            option = { 'label': data[i].name, 'value': data[i].id }
            options.push(option)
          }
          vm.bankMsgObject['addressId'].options = Object.assign({}, options)
          vm.coutomerObject['addressId'].options = Object.assign({}, options)
        }, 'GET')
      }
    },
    visibleChangeGoodReceiver (flag) {
      if (!flag) {
        // 如果收单方为是，则将关联收单方的值设定为空
        if (this.addrSellerFani.newSellMsg['goodsReceiver'] === '1') {
          this.relativeFlag = true
          this.addrSellerFani.newSellMsg['relateBillReceiver'] = ''
        } else if (this.addrSellerFani.newSellMsg['goodsReceiver'] === '0') {
          this.relativeFlag = false
        }
      }
    },
    visibleChangeBillReceiver (flag) {

    },
    valChange (val, oldVal) {
      // 每次打开的时候都会清空
      this.addrSellerFani.newSellMsg['relateBillReceiver'] = ''
    },
    visibleChangeR (flag) {
      var vm = this
      if (flag) {
        vm.customerData.newSellMsg.fields[2].options = []
        this.$root.ajaxData('/addresses/getReceivers/' + this.mateValuesId + '/' + this.addrSellerFani.newMainMsg['orgId'], {}, function (data) {
          var option = {}
          var options = []
          for (var i = 0; i < data.length; i++) {
            option = { 'label': data[i].address, 'value': data[i].id }
            options.push(option)
          }
          vm.customerData.newSellMsg.fields[2].options = options
        }, 'GET')
      }
    },
    makeBankInfo () {
      var vm = this
      var cardNo = this.newBankMsg.values.account
      var url = 'https://ccdcapi.alipay.com/validateAndCacheCardInfo.json?_input_charset=utf-8&cardNo=' + cardNo + '&cardBinCheck=true&t=' + (new Date()).getTime().toString()
      var requrl = 'https://bird.ioliu.cn/v1?url=' + url
      axios({
        method: 'get',
        url: requrl,
        timeout: 1000
      })
      .then(function (response) {
        var data = response.data
        if (data && data.validated) {
          vm.newBankMsg.values.bankCode = data.bank
          vm.newBankMsg.values.bankName = bankcode[data.bank]
        } else {
          vm.newBankMsg.values.bankCode = ''
          vm.newBankMsg.values.bankName = ''
        }
      })
      .catch(function (response) {
      })
    }
  }
}
</script>

<style scoped>

.el-form-item {
  margin:22px 20px 22px 0;
}
.el-form-item__content{
  position: inherit;
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
.add{
  margin-bottom: 10px;
}
img{
  width:50px;
  height:80px;
}
.button{
  display:block;
  margin-top:20px;
}
.submitCancel{
  margin-top:20px;
}
.el-form-item {
  margin: 15px 20px 2px 0;
}
</style>

