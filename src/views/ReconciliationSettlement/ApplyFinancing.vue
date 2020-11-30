/**
 * 销项发票交接单-申请融资
 */
<template>
    <div>
      <div class="hbutton">
          <el-button class="el-icon-document" @click="handleSubmit()" v-show="isShow" size="mini">提 交</el-button>
          <el-button plain class="el-icon-close" @click="backward()" size="mini">取 消</el-button>
      </div>
      <div class="finance">
        <div class="title">
          <span class="financeTitle">融资申请信息</span>
        </div>
        <el-form size="mini" :model="mateForm" :inline="mate.inline" label-position="right" ref="financeRule" :rules="financeRules" label-width="140px"> 
          <el-row>
            <el-col :span="8">
              <el-form-item :label="GObject.financeMethod.label" :prop="GObject.financeMethod.name">
                <dict-selected 
                  v-model="mateForm.financeMethod" 
                  dictType="financingWay"
                  :rowId="showDict"
                  :initValue="mateForm.financeMethod"
                  placeholder="请选择"
                  @input="_getCompanyName(mateForm.financeMethod)">
                </dict-selected>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="GObject.financeCompanyName.label" :prop="GObject.financeCompanyName.name">
                <el-select v-model="mateForm.financeCompanyName" placeholder="请选择" clearable :disabled="showCompanyName">
                  <el-option
                    v-for="item in financeCompanyNames"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="GObject.financeRate.label" :prop="GObject.financeRate.name">
                <el-select v-model="mateForm.financeRate" @change="changeFinanceRate(mateForm.financeRate)" placeholder="请选择" clearable :disabled="showDisabled">
                  <el-option
                    v-for="item in financeRates"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="GObject.amount.label" :prop="GObject.amount.name">
                <el-input readonly type= "text" v-model="mateForm.amount" :disabled="showDisabled"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="GObject.expectedPaymentDate.label" :prop="GObject.expectedPaymentDate.name">
                  <el-date-picker type="date" v-model="mateForm.expectedPaymentDate" :picker-options="pickerOptions0" @change="blurDate" value-format="yyyy-MM-dd" placeholder="预计付款日期" :disabled="showDisabled"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="GObject.endDate.label" :prop="GObject.endDate.name">
                  <el-date-picker type="date" v-model="mateForm.endDate" :picker-options="pickerOptions1"  @change="blurDate" value-format="yyyy-MM-dd" placeholder="到期日期" :disabled="showDisabled"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="GObject.expectedPaymentTerm.label" :prop="GObject.expectedPaymentTerm.name">
                <el-input readonly type= "text" v-model="mateForm.expectedPaymentTerm" :disabled="showDisabled"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="invoiceMain">
        <div class="title">
          <span class="invoiceTitle">发票信息</span>
        </div>
        <el-table :data="invoiceData" border fit highlight-current-row size="mini" style="width: 100%">
          <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
          <el-table-column align="center" prop="invoiceCode" label="发票代码" width="200"></el-table-column>
          <el-table-column align="center" prop="invoiceNo" label="发票号码" width="200"></el-table-column>
          <el-table-column align="center" prop="buyer" label="购买方" width="500"></el-table-column>
          <el-table-column align="center" prop="businessUnit" label="买方事业部" width="300"></el-table-column>
          <el-table-column align="center" prop="invoiceAmount" label="发票金额（元）"></el-table-column>
<!--          <el-table-column v-if="showInvoice" prop="picPath" label="上传发票" min-width="140" align="center">-->
<!--            <template slot-scope="scope">-->
<!--              <el-upload-->
<!--                :action="fileuploadUrl"-->
<!--                :on-preview="handlePreview"-->
<!--                :on-success="invoiceHandleSuccess"-->
<!--                :on-remove="handleRemoveInvoice"-->
<!--                :headers="headers"-->
<!--                :file-list="fileList"-->
<!--                :limit="1"-->
<!--                :on-exceed="handleExceed"-->
<!--                :before-upload="beforeAvatarUpload">-->
<!--                <el-button style="margin-left: 10px" @click="uploadIndex(scope.$index,1)" type="primary" size="mini" :disabled="showDisabled">上传</el-button>-->
<!--              </el-upload>-->
<!--            </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column v-if="checkButton" prop="picPath" label="查看发票" min-width="140" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            <el-button style="margin-left: 10px" @click="checkInvoice(scope.row.picPath)" type="primary" size="mini">查看</el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column v-if="showInvoice" prop="billPath" label="发票清单" min-width="140" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            <el-upload-->
<!--              :action="fileuploadUrl"-->
<!--              :on-preview="handlePreview"-->
<!--              :on-success="invoiceBillHandleSuccess"-->
<!--              :on-remove="handleRemoveInvoiceBill"-->
<!--              :headers="headers"-->
<!--              :file-list="fileList"-->
<!--              :limit="1"-->
<!--              :on-exceed="handleExceed"-->
<!--              :before-upload="beforeAvatarUpload">-->
<!--              <el-button style="margin-left: 10px" @click="uploadIndex(scope.$index,1)" type="primary" size="mini" :disabled="showDisabled">上传</el-button>-->
<!--            </el-upload>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column v-if="checkButton" prop="billPath" label="查看发票清单" min-width="140" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            <el-button style="margin-left: 10px" @click="checkInvoice(scope.row.billPath)" type="primary" size="mini">查看</el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
        </el-table>
      </div>
      <div class="contractMain">
        <div class="title">
          <span class="contractTitle">合同信息</span>
        </div>
        <div class="aclass">
          <span @click="addContractInfo" style="padding-left: 10px;">添加</span>
        </div>
        <el-table :data="contractData" border fit highlight-current-row size="mini" style="width: 100%">
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column align="center" :label="GObject.contractCode.label" :prop="GObject.contractCode.name" width="300">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.contractCode" :disabled="showDisabled"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="GObject.contractAmount.label" :prop="GObject.contractAmount.name" width="300">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.contractAmount" @blur="handleClick(scope.row.contractAmount)" :disabled="showDisabled"></el-input>
            </template>
          </el-table-column>
          <el-table-column v-if="showContract" label="上传合同" :prop="GObject.picPath.name" min-width="140" align="center">
            <template slot-scope="scope">
              <el-upload
                  :action="fileuploadUrl"
                  :on-preview="handlePreview"
                  :on-success="contractHandleSuccess"
                  :on-remove="handleRemoveContract"
                  :headers="headers"
                  :file-list="fileList"
                  :limit="1"
                  :on-exceed="handleExceed"
                  :before-upload="beforeAvatarUpload">
                  <el-button style="margin-left: 10px" @click="uploadIndex(scope.$index,2)" size="mini" :disabled="showDisabled">上传</el-button>
              </el-upload>
            </template>
          </el-table-column>
          <el-table-column v-if="checkContract" prop="picPath" label="查看合同" min-width="140" align="center">
          <template slot-scope="scope">
            <el-button style="margin-left: 10px" @click="submitUpload(scope.row.picPath)" type="primary" size="mini">查看</el-button>
          </template>
        </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleDelete(scope.$index, scope.row)" :disabled="showDisabled">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="financingUser">
        <div class="title">
          <span class="userTitle">融资申请人资料</span>
        </div>
        <el-form size="mini" :model="userData" :inline="mate.inline" label-position="right" ref="userRule" :rules="userRules" :label-width="labelWidth">
          <el-row>
            <el-col :span="8">
              <el-form-item :label="GObject.businessPhoto.label" :prop="GObject.businessPhoto.name">
                <el-upload
                  v-if="showButton"
                  ref="upload"
                  :action="fileuploadUrl"
                  :on-preview="handlePreview"
                  :headers="headers"
                  :on-remove="handleRemoveBusinessPhoto"
                  :on-success="BusinessPhotoHandleSuccess"
                  :file-list="fileList"
                  :limit="1"
                  :on-exceed="handleExceed"
                  :before-upload="beforeAvatarUpload">
                  <el-button size="mini" :disabled="showDisabled">上传营业执照</el-button>  
                  <el-button type="primary" size="mini" @click="submitUpload(userData.businessPhoto)">查看</el-button>                
                </el-upload>
                <el-button v-if="showFlag2" type="primary" size="mini" @click="submitUpload(userData.businessPhoto)">查看</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="GObject.taxregPhoto.label" :prop="GObject.taxregPhoto.name">
                <el-upload
                  v-if="showButton"
                  ref="upload"
                  :action="fileuploadUrl"
                  :on-preview="handlePreview"
                  :headers="headers"
                  :on-remove="handleRemoveTaxregPhoto"
                  :on-success="taxregPhotoHandleSuccess"
                  :file-list="fileList"
                  :limit="1"
                  :on-exceed="handleExceed"
                  :before-upload="beforeAvatarUpload">
                  <el-button size="mini" :disabled="showDisabled">上传税务登记证</el-button>     
                  <el-button type="primary" size="mini" @click="submitUpload(userData.taxregPhoto)">查看</el-button>             
                </el-upload>
                <el-button v-if="showFlag2" type="primary" size="mini" @click="submitUpload(userData.taxregPhoto)">查看</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="GObject.orgofficePhoto.label" :prop="GObject.orgofficePhoto.name">
                <el-upload
                  v-if="showButton"
                  ref="upload"
                  :action="fileuploadUrl"
                  :on-preview="handlePreview"
                  :headers="headers"
                  :on-remove="handleRemoveOrgofficePhoto"
                  :on-success="orgofficePhotoHandleSuccess"
                  :file-list="fileList"
                  :limit="1"
                  :on-exceed="handleExceed"
                  :before-upload="beforeAvatarUpload">
                  <el-button size="mini" :disabled="showDisabled">上传企业征信报告</el-button>     
                  <el-button type="primary" size="mini" @click="submitUpload(userData.orgofficePhoto)">查看</el-button>             
                </el-upload>
                <el-button v-if="showFlag2" type="primary" size="mini" @click="submitUpload(userData.orgofficePhoto)">查看</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="GObject.officecreditPosPhoto.label" :prop="GObject.officecreditPosPhoto.name">
                <el-upload
                  v-if="showButton"
                  ref="upload"
                  :action="fileuploadUrl"
                  :on-preview="handlePreview"
                  :headers="headers"
                  :on-remove="handleRemoveOffice"
                  :on-success="officeHandleSuccess"
                  :file-list="fileList"
                  :limit="1"
                  :on-exceed="handleExceed"
                  :before-upload="beforeAvatarUpload">
                  <el-button size="mini" :disabled="showDisabled">上传机构信用代码</el-button>             
                  <el-button type="primary" size="mini" @click="submitUpload(userData.officecreditPosPhoto)">查看</el-button>     
                </el-upload>
                <el-button v-if="showFlag2" type="primary" size="mini" @click="submitUpload(userData.officecreditPosPhoto)">查看</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="GObject.openamountPhoto.label" :prop="GObject.openamountPhoto.name">
                <el-upload
                  v-if="showButton"
                  ref="upload"
                  :action="fileuploadUrl"
                  :on-preview="handlePreview"
                  :headers="headers"
                  :on-remove="handleRemoveOpenamount"
                  :on-success="openamountHandleSuccess"
                  :file-list="fileList"
                  :limit="1"
                  :on-exceed="handleExceed"
                  :before-upload="beforeAvatarUpload">
                  <el-button size="mini" :disabled="showDisabled">上传开户许可证</el-button>   
                  <el-button type="primary" size="mini" @click="submitUpload(userData.openamountPhoto)">查看</el-button>               
                </el-upload>
                <el-button v-if="showFlag2" type="primary" size="mini" @click="submitUpload(userData.openamountPhoto)">查看</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="GObject.legalcardPosPhoto.label" :prop="GObject.legalcardPosPhoto.name">
                <el-upload
                  v-if="showButton"
                  ref="upload"
                  :action="fileuploadUrl"
                  :on-preview="handlePreview"
                  :headers="headers"
                  :on-remove="handleRemoveLegalcardPos"
                  :on-success="legalcardPosHandleSuccess"
                  :file-list="fileList"
                  :limit="1"
                  :on-exceed="handleExceed"
                  :before-upload="beforeAvatarUpload">
                  <el-button size="mini" :disabled="showDisabled">上传身份证正面</el-button>  
                  <el-button type="primary" size="mini" @click="submitUpload(userData.legalcardPosPhoto)">查看</el-button>                
                </el-upload>
                <el-button v-if="showFlag2" type="primary" size="mini" @click="submitUpload(userData.legalcardPosPhoto)">查看</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="GObject.legalcardNegPhoto.label" :prop="GObject.legalcardNegPhoto.name">
                <el-upload
                  v-if="showButton"
                  ref="upload"
                  :action="fileuploadUrl"
                  :on-preview="handlePreview"
                  :headers="headers"
                  :on-remove="handleRemoveLegalcardNeg"
                  :on-success="legalcardNegHandleSuccess"
                  :file-list="fileList"
                  :limit="1"
                  :on-exceed="handleExceed"
                  :before-upload="beforeAvatarUpload">
                  <el-button size="mini" :disabled="showDisabled">上传身份证反面</el-button>    
                  <el-button type="primary" size="mini" @click="submitUpload(userData.legalcardNegPhoto)">查看</el-button>              
                </el-upload>
                <el-button v-if="showFlag2" type="primary" size="mini" @click="submitUpload(userData.legalcardNegPhoto)">查看</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="GObject.companyRule.label" :prop="GObject.companyRule.name">
                <el-upload
                  v-if="showButton"
                  ref="upload"
                  :action="fileuploadUrl"
                  :on-preview="handlePreview"
                  :headers="headers"
                  :on-remove="handleRemoveCompanyRule"
                  :on-success="companyRuleHandleSuccess"
                  :file-list="fileList"
                  :limit="1"
                  :on-exceed="handleExceed"
                  :before-upload="beforeAvatarUpload">
                  <el-button size="mini" :disabled="showDisabled">上传公司章程</el-button>          
                  <el-button type="primary" size="mini" @click="submitUpload(userData.companyRule)">查看</el-button>        
                </el-upload>
                <el-button v-if="showFlag2" type="primary" size="mini" @click="submitUpload(userData.companyRule)">查看</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="GObject.finanReport.label" :prop="GObject.finanReport.name">
                <el-upload
                  v-if="showButton"
                  ref="upload"
                  :action="fileuploadUrl"
                  :on-preview="handlePreview"
                  :headers="headers"
                  :on-remove="handleRemoveFinanReport"
                  :on-success="finanReportHandleSuccess"
                  :file-list="fileList"
                  :limit="1"
                  :on-exceed="handleExceed"
                  :before-upload="beforeAvatarUpload">
                  <el-button size="mini" :disabled="showDisabled">上传财务报表</el-button>
                  <el-button type="primary" size="mini" @click="submitUpload(userData.finanReport)">查看</el-button>
                </el-upload>
                <el-button v-if="showFlag2" type="primary" size="mini" @click="submitUpload(userData.finanReport)">查看</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="attachment">
        <div class="title">
          <span class="attachmentTitle">附件信息</span>
        </div>
        <el-form size="mini" :model="mateForm" :inline="mate.inline" label-position="right" ref="attachRule" :rules="attachRules" :label-width="labelWidth">
          <el-row>
            <el-col :span="8">
              <el-form-item :label="GObject.poBill.label" :prop="GObject.poBill.name">
                <el-upload
                  v-if="showButton"
                  ref="upload"
                  multiple
                  :action="fileuploadUrl"
                  :on-preview="handlePreview"
                  :headers="headers"
                  :on-remove="handleRemovePoBill"
                  :on-success="poBillHandleSuccess"
                  :file-list="fileList"
                  :before-upload="beforeAvatarUpload">
                  <el-button size="mini" slot="trigger" :disabled="showDisabled">上传采购订单</el-button>
                  <el-button type="primary" size="mini" @click="checkUpload(mateForm.poBill)">查看</el-button>
                </el-upload>
                <el-button v-if="showFlag" type="primary" size="mini" @click="checkUpload(mateForm.poBill)">查看</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="GObject.statementBill.label" :prop="GObject.statementBill.name">
                <el-upload
                  v-if="showButton"
                  ref="upload"
                  multiple
                  :action="fileuploadUrl"
                  :on-preview="handlePreview"
                  :headers="headers"
                  :on-remove="handleRemoveStatementBill"
                  :on-success="statementBillHandleSuccess"
                  :file-list="fileList"
                  :before-upload="beforeAvatarUpload">
                  <el-button size="mini" slot="trigger" :disabled="showDisabled">上传对账单</el-button>
                  <el-button type="primary" size="mini" @click="checkUpload(mateForm.statementBill)">查看</el-button>
                </el-upload>
                <el-button v-if="showFlag" type="primary" size="mini" @click="checkUpload(mateForm.statementBill)">查看</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="GObject.deliveryBill.label" :prop="GObject.deliveryBill.name">
                <el-upload
                  v-if="showButton"
                  ref="upload"
                  multiple
                  :action="fileuploadUrl"
                  :on-preview="handlePreview"
                  :headers="headers"
                  :on-remove="handleRemoveDeliveryBill"
                  :on-success="deliveryBillHandleSuccess"
                  :file-list="fileList"
                  :before-upload="beforeAvatarUpload">
                  <el-button size="mini" slot="trigger" :disabled="showDisabled">上传送货单</el-button>
                  <el-button type="primary" size="mini" @click="checkUpload(mateForm.deliveryBill)">查看</el-button>
                </el-upload>
                <el-button v-if="showFlag" type="primary" size="mini" @click="checkUpload(mateForm.deliveryBill)">查看</el-button>
              </el-form-item>
            </el-col>
          </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item :label="GObject.billPath.label" :prop="GObject.billPath.name">
                        <el-upload
                                v-if="showButton"
                                ref="upload"
                                multiple
                                :action="fileuploadUrl"
                                :on-preview="handlePreview"
                                :headers="headers"
                                :on-remove="handleRemoveBill"
                                :on-success="billHandleSuccess"
                                :file-list="fileList">
                            <el-button size="mini" slot="trigger" :disabled="showDisabled">上传发票清单</el-button>
                            <el-button type="primary" size="mini" @click="checkUpload(mateForm.billPath)">查看</el-button>
                        </el-upload>
                        <el-button v-if="showFlag" type="primary" size="mini" @click="checkUpload(mateForm.billPath)">查看</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label="GObject.picPath.label" :prop="GObject.picPath.name">
                        <el-upload
                                v-if="showButton"
                                ref="upload"
                                multiple
                                :action="fileuploadUrl"
                                :on-preview="handlePreview"
                                :headers="headers"
                                :on-remove="handleRemovePicPath"
                                :on-success="picPathHandleSuccess"
                                :file-list="fileList"
                                >
                            <el-button size="mini" slot="trigger" :disabled="showDisabled">上传发票</el-button>
                            <el-button type="primary" size="mini" @click="checkUpload(mateForm.picPath)">查看</el-button>
                        </el-upload>
                        <el-button v-if="showFlag" type="primary" size="mini" @click="checkUpload(mateForm.picPath)">查看</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
      </div>
      <div class="rejected" v-if="mateForm.rejected">
        <el-form size="mini" :model="mateForm" :inline="mate.inline" label-position="right" ref="financeRule" :rules="financeRules" label-width="140px">
          <el-row>
            <el-col :span="8">
              <el-form-item :label="GObject.rejected.label" :prop="GObject.rejected.name">
                <el-input style="resize:none"  type="textarea" :rows="3" :disabled="true" v-model="mateForm.rejected"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
      </div>
      <el-dialog title="" :before-close="handleClose" :visible.sync="dialogVisible" width="26%">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column  width="30">
          </el-table-column>
          <el-table-column type="index" label="序号" width="230">
          </el-table-column>
          <el-table-column label="发票列表">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="lookInvoice(scope.row.picPath)">查看发票</el-button>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialog" size="mini">取 消</el-button>
          <el-button type="primary" @click="closeDialog" size="mini">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog  title="查看附件" :visible.sync="showFile" width="22%">
        <template>
          <el-table :data="tableData" style="width: 100%" size="mini" center>
            <el-table-column  prop="lineNo" label="序号" width="180"></el-table-column>
            <el-table-column  label="文件" width="180">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="showFileDetail(scope.row.name)">查看文件</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-dialog>

    </div>
</template>

<script>
import { DateFormat } from '../../utils/util.js'
import { API_GATEWAY } from '@/config/index.js'
import {validateFloatTwo} from '../../utils/validates/validates.js'
//计算天数差的函数，通用 
function DateDiff(sDate1, sDate2) { //sDate1和sDate2的格式是2019-03-11
    var aDate, oDate1, oDate2, iDays
    aDate = sDate1.split("-")
    oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]) //转换为03-11-2019格式 
    aDate = sDate2.split("-")
    oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24) + 1 //把相差的毫秒数转换为天数
    return iDays
}
export default {
  components: {
    'dict-selected': function index (resolve) {
      require(['../../components/DictSelected.vue'], resolve)
    }
  },
  data() {
    return {
      mateForm: {            // 融资申请信息、附件信息
        status: '',
        financeMethod: '',
        financeCompanyName: '',
        financeRate: '',
        financeAmount: '',
        amount: '',
        expectedPaymentDate: '',
        endDate: '',
        expectedPaymentTerm: '',
        poBill: '',
        statementBill: '',
        deliveryBill: '',
        billPath: '',
        picPath: ''
      },
      invoiceData: [          // 发票信息
      ],        
      contractData: [         // 合同信息
        {
          contractCode: '',
          contractAmount: '',
        }
      ],
      contractList: [],
      userData: {            // 融资申请人资料
        businessPhoto: "",
        orgofficePhoto: "",
        taxregPhoto: "",
        officecreditPosPhoto: "",
        openamountPhoto: "",
        legalcardPosPhoto: "",
        legalcardNegPhoto: "",
        companyRule: "",
        finanReport: "",
      },
      showDict: '',
      GObject: {},         // 表单
      showDisabled: false,
      showCompanyName: false,
      fileuploadUrl: `${API_GATEWAY}/api/purchase/file`,
      fileList: [],
      picUrl: 'https://fdfs.sunwoda.com',
      headers: {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
        'Accept': 'application/json',
        'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId
      },
      financeCompanyNames: [],      // 融资方
      financeRates: [              // 融资比例
        {
          value: '1',
          label: '100%'
        },
        {
          value: '2',
          label: '90%'
        },
        {
          value: '3',
          label: '80%'
        },
        {
          value: '4',
          label: '70%'
        },
        {
          value: '5',
          label: '60%'
        },
        {
          value: '6',
          label: '50%'
        }
      ],  
      financeRules: {
        financeMethod: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        financeCompanyName: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        financeRate: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        financeAmount: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        expectedPaymentDate: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        endDate: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
      },
      userRules: {
        businessPhoto: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        taxregPhoto: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        orgofficePhoto: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        officecreditPosPhoto: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        openamountPhoto: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        legalcardPosPhoto: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        legalcardNegPhoto: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        companyRule: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        finanReport: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
      },
      attachRules: {
        poBill: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        statementBill: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        deliveryBill: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        billPath: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ],
        picPath: [
          { required: true, message: '该输入项为必输项', trigger: 'blur' }
        ]
      },
      invoiceFile: '',
      isShow: true,
      invoiceCount: 1,       // 发票图片上传计数变量
      invoiceIndex: 0,       //上传发票对应的角标
      contractIndex: 0,      // 上传合同对应的角标
      showFlag: false,       // 是否显示附件查看按钮
      showFlag2: false,       // 是否显示融资申请人信息查看按钮
      isEdit: '',            // 判断是编辑还是查看
      showInvoice: true,        // 显示发票信息上传
      checkButton: false,      // 显示发票信息查看
      showContract: true,      // 显示合同上传
      checkContract: false,     // 显示合同查看
      showButton: true,         // 显示融资申请人、附件信息上传
      tableData: [],
      dialogVisible: false,
      showFile: false,
      purchaseFile: '',
      reconcileFile: '',
      deliveryFile: '',
      billFile:'',
      picFile:'',
      money: '',
      contractAmountAll: 0,
      pickerOptions0: this.paymentDate(),
      pickerOptions1: this.expireDate(),
    }
  },
  props: {
    mate: Object
  },
  computed: {
    labelWidth: function () {
      let width = ''
      if (this.mate.inline) {
        width = '150px'
      } else if (typeof (this.mate.labelWidth) === 'undefined') {
        width = '150px'
      } else if (this.mate.labelWidth === null) {
        width = '150px'
      } else {
        width = this.mate.labelWidth
      }
      return width
    }
  },
  created () {
    this.mateForm = this.mate.mateFormerHeader.values.tenantFinanceApply
    this.mateForm.amount = this.mate.mateFormerHeader.values.tenantFinanceApply.financeAmount
    this.mate.mateFormerHeader.fields.map((i) => { this.GObject[i.name] = i })
    this.mate.mateList.columns.map((i) => { this.GObject[i.name] = i })
    this.contractData = this.mate.mateFormerHeader.values.clcpFinanceAppliedContract
    this.userData = this.mate.mateFormerHeader.values.tenantCompanyInfo
    this.invoiceData = this.mate.mateList.rows
    this.isEdit = this.mate.mateFormerHeader.values.isEdit
    if(!this.mateForm.id){
      this.invoiceData.forEach(item=>{
        item.picPath = ''
      })
      this.mateForm.poBill = ''
      this.mateForm.statementBill = ''
      this.mateForm.deliveryBill = ''
      this.mateForm.billPath = ''
      this.mateForm.picPath = ''
    }
    if (this.isEdit === '0') {
      this.isShow = false
      this.showDict = '0'
      this.showDisabled = true
      this.showCompanyName = true
      this.showInvoice = false
      this.checkButton = true
      this.showContract = false
      this.checkContract = true
      this.showButton = false
      this.showFlag = true
      this.showFlag2 = true
    } 
    if (this.isEdit === '1'){
      this.checkButton = true
      this.checkContract = true
    } 
    if (this.isEdit === '1' && this.mateForm.status === '3'){
      this.checkButton = true
      this.checkContract = true
      this.showDict = '0'
      this.showCompanyName = true
    }
  },
  mounted () {

  },
  watch: {
    contractData: {
      handler: function (val, old) {
        this.contractMoneyAll = 0
        this.contractList = []
        val.forEach(item=>{
          this.contractMoneyAll += parseFloat(item.contractAmount)
          this.contractList.push(item.contractCode)
        })
      },
      deep: true
    }
  },
  methods: {
  paymentDate () {
    let vm = this
    return {
      disabledDate (time) {
        if (vm.mateForm.endDate) {
          return time.getTime() >= new Date(vm.mateForm.endDate).getTime()
        } else {
          return time.getTime() < Date.now() - 8.64e7;
        }
      }
    }
  },
  expireDate () {
    let vm = this
    return {
      disabledDate (time) {
        if (vm.mateForm.expectedPaymentDate) {
          return time.getTime() <= new Date(vm.mateForm.expectedPaymentDate).getTime()  ;
        }
      }
    }
  },
  
  handleClick(val){
    if (!validateFloatTwo(val)) {
      this.$message({
        message: '请输入数字，最多2位小数',
        type: 'warning'
      })
    }
  },
  // 获取融资方Name
  _getCompanyName (val) {
    var vm = this
    if (val === '2'){
      this.mateForm.financeRate = '3'
      this.changeFinanceRate(this.mateForm.financeRate)
    }else {
      this.mateForm.financeRate = undefined
      this.mateForm.amount = this.mate.mateFormerHeader.values.tenantFinanceApply.invoiceAmount
    }
    if (val) {
      vm.mateForm.financeCompanyName = ''
      vm.financeCompanyNames = []
      this.$root.ajaxData(`/purchase/finance/tenantName/${val}`, {}, function (data) {
        for(let i = 0; i < data.length; i++) {
          vm.financeCompanyNames.push({ label: data[i].name, value: data[i].name, key: data[i].id })
        }
      }, 'GET')
    } else {
      vm.mateForm.financeCompanyName = ''
    }
  },
  // 获取融资金额
  changeFinanceRate (val) {
    this.money = this.mate.mateFormerHeader.values.tenantFinanceApply.invoiceAmount
    for (var i = 0; i <this.financeRates.length; i++) {
      if (val == this.financeRates[i].value) {
        var moneyAmount = (parseInt(this.financeRates[i].label)* 0.01 * this.money).toFixed(2)
        this.mateForm.amount = moneyAmount
      }
    }
  },
  // 获取融资期限
  blurDate () {
    if (this.mateForm.endDate != null && this.mateForm.expectedPaymentDate != null) {
      Vue.set(this.mateForm, 'expectedPaymentTerm', DateDiff(this.mateForm.endDate,this.mateForm.expectedPaymentDate))
    }
  },
  // 发票信息上传
  uploadIndex (index,val) {
    if (val == 1) {
      this.invoiceIndex = index
    } else {
      this.contractIndex = index
    }
  },
  // 合同新增
  addContractInfo () {
    if (this.isEdit === '0') {
      this.$message({
        type: 'warning',
        message: '查看模式不允许新增'
      })
    } else {
      this.contractData.push({
        "contractCode":"",
        "contractAmount":"",
      })
    }
  },
  // 合同删除
  handleDelete (index,row) {
    if (index === 0) {
      this.$message({
        type: 'warning',
        message: '请保留一条合同数据'
      })
    }else if (index != 0) {
      this.contractData.splice(index,1);
    }
  },
  lookInvoice(val) {
    window.open(val)
  },
  closeDialog() {
    this.tableData = []
    this.dialogVisible = false
  },
  // 查看发票、发票清单信息
  checkInvoice (val) {
    if (val) {
      if (val.indexOf('fdfs') === -1){
        val = this.picUrl + val
      }
      window.open(val)
    }else {
      this.$message({
        message: '未上传',
        type: 'warning'
      })
    return
    }
    // if (val) { 
      // if(index === 1){
      //   var invoicePicPath= new Array()
      //   invoicePicPath = val.split(",");
      //   if(invoicePicPath.length>1){
      //       this.dialogVisible = true
      //       for( var i = 0;i<invoicePicPath.length;i++){
      //         var invoicePicPathUrl = {}
      //         invoicePicPathUrl.picPath = invoicePicPath[i]
      //         this.tableData.push(invoicePicPathUrl)
      //       }
      //   }else {
      //     window.open(val)
      //   }
      // }else if (index === 2) {
      //   window.open(val)
      // }
    // }
  },
  // 查看融资申请人资料、合同信息
  submitUpload (val) {
    if (val) {
      if (val.indexOf('fdfs') === -1){
        val = this.picUrl + val
      }
      window.open(val)
    }else {
      this.$message({
        message: '未上传',
        type: 'warning'
      })
    return
    }
  },
  // 查看附件信息
  checkUpload (val) {
    this.tableData = []
    if(val){
      var strarr= new Array()
      strarr = val.split(",")
      if(strarr.length === 1){
        if (val.indexOf('fdfs') === -1){
          strarr[0] = this.picUrl + strarr[0]
        }
        window.open(strarr[0])
      } else {
        var i = 1
        this.showFile = true
        strarr.forEach(item=>{
          var tableApplyFinancingListLine = {
            lineNo: i++,
            name: item
          }
          this.tableData.push(tableLine)
        })
      }
    }else {
      this.$message({
        message: '未上传',
        type: 'warning'
      })
    return
    }
  },
  showFileDetail(val){
    if (val.indexOf('fdfs') === -1){
      val = this.picUrl + val
    }
    window.open(val)
  },
  closeDialog() {
    this.tableData = []
    this.dialogVisible = false
  },
  handleClose(done) {
    this.tableData = []
    done();
  },
  handleRemove(files, fileList){
  },
  contractHandleSuccess(response, file, fileList) {
    this.contractData[this.contractIndex].picPath = response
  },
  BusinessPhotoHandleSuccess(response, file, fileList) {
    this.userData.businessPhoto = response
  },
  taxregPhotoHandleSuccess(response, file, fileList) {
    this.userData.taxregPhoto = response
  },
  orgofficePhotoHandleSuccess(response, file, fileList) {
    this.userData.orgofficePhoto = response
  },
  officeHandleSuccess(response, file, fileList) {
    this.userData.officecreditPosPhoto = response
  },
  openamountHandleSuccess(response, file, fileList) {
    this.userData.openamountPhoto = response
  },
  legalcardPosHandleSuccess(response, file, fileList) {
    this.userData.legalcardPosPhoto = response
  },
  legalcardNegHandleSuccess(response, file, fileList) {
    this.userData.legalcardNegPhoto = response
  },
  companyRuleHandleSuccess(response, file, fileList) {
    this.userData.companyRule = response
  },
  finanReportHandleSuccess(response, file, fileList) {
    this.userData.finanReport = response
  },
  poBillHandleSuccess(response, file, fileList) {
    this.purchaseFile += response + ','
    this.mateForm.poBill = this.purchaseFile.slice(0,this.purchaseFile.length-1)
  },
  statementBillHandleSuccess(response, file, fileList) {
    this.reconcileFile += response + ','
    this.mateForm.statementBill = this.reconcileFile.slice(0,this.reconcileFile.length-1)
  },
  deliveryBillHandleSuccess(response, file, fileList) {
    this.deliveryFile += response + ','
    this.mateForm.deliveryBill = this.deliveryFile.slice(0,this.deliveryFile.length-1)
  },
   billHandleSuccess(response, file, fileList){
     this.billFile += response + ','
     this.mateForm.billPath = this.billFile.slice(0,this.billFile.length-1)
  },
  picPathHandleSuccess(response, file, fileList){
    this.picFile += response + ','
    this.mateForm.picPath = this.picFile.slice(0,this.picFile.length-1)
  },
  handleRemoveContract(file, fileList){
    this.contractData[this.contractIndex].picPath = ''
  },
  handleRemoveBusinessPhoto(file, fileList){
    this.userData.businessPhoto = ''
  },
  handleRemoveTaxregPhoto(file, fileList){
    this.userData.taxregPhoto = ''
  },
  handleRemoveOrgofficePhoto(file, fileList){
    this.userData.orgofficePhoto = ''
  },
  handleRemoveOffice(file, fileList){
    this.userData.officecreditPosPhoto = ''
  },
  handleRemoveOpenamount(file, fileList){
    this.userData.openamountPhoto = ''
  },
  handleRemoveLegalcardPos(file, fileList){
    this.userData.legalcardPosPhoto = ''
  },
  handleRemoveLegalcardNeg(file, fileList){
    this.userData.legalcardNegPhoto = ''
  },
  handleRemoveCompanyRule(file, fileList){
    this.userData.companyRule = ''
  },
  handleRemoveFinanReport(file, fileList){
    this.userData.finanReport = ''
  },
  handleRemovePoBill(file, fileList){
    this.purchaseFile = ''
    fileList.forEach(item => {
      this.purchaseFile += item.response + ','
    })
    this.mateForm.poBill = this.purchaseFile.slice(0,this.purchaseFile.length-1)
  },
  handleRemoveStatementBill(file, fileList){
    this.reconcileFile = ''
    fileList.forEach(item => {
      this.reconcileFile += item.response + ','
    })
    this.mateForm.statementBill = this.reconcileFile.slice(0,this.reconcileFile.length-1)
  },
  handleRemoveDeliveryBill(file, fileList){
    this.deliveryFile = ''
    fileList.forEach(item => {
      this.deliveryFile += item.response + ','
    })
    this.mateForm.deliveryBill = this.deliveryFile.slice(0,this.deliveryFile.length-1)
  },
  handleRemoveBill(file, fileList){
      this.billFile = ''
      fileList.forEach(item =>{
          this.billFile += item.response + ','
      })
      this.mateForm.billPath = this.billFile.slice(0,this.billFile.length-1)
  },
  handleRemovePicPath(file, fileList){
      this.picFile = ''
      fileList.forEach(item =>{
          this.picFile += item.response + ','
      })
      this.mateForm.picPath = this.picFile.slice(0,this.picFile.length-1)
  },
  handleExceed (files, fileList){
    this.$message.warning(`当前限制选择 1 个文件`);
  },
  beforeAvatarUpload (file) {
    let fileName = file.name;
    let index = fileName.lastIndexOf('.');
    let name = fileName.substring(index, fileName.length);
    if (!/\.(jpg|jpeg|png|bmp|gif|pdf|xls|xlsx|JPG|PNG|JPEG|BMP|GIF|PDF|XLS|XLSX)$/.test(name)) {
      this.$message({
        message: '请选择图片、pdf或excel表格',
        type: 'warning'
      })
      // 清空文件
      // this.fileList = [];
      return false;
    }
  },
  // 提交
  handleSubmit() {
      console.log(this.mateForm)
    let vm = this
    this.$refs['financeRule'].validate((valid) => {
      if (valid) {
        this.financeValid = true
      }
    });
    this.$refs['userRule'].validate((valid) => {
      if (valid) {
        this.userValid = true
      }
    });
    this.$refs['attachRule'].validate((valid) => {
      if (valid) {
        this.attachValid = true
      }
    });
    if (this.financeValid && this.userValid && this.attachValid) {
      // for (var i = 0; i<this.invoiceData.length;i++) {
      //   if (!this.invoiceData[i].picPath) {
      //     this.$message({
      //       type: 'warning',
      //       message: '请上传发票'
      //     })
      //     return
      //   } else if (!this.invoiceData[i].billPath) {
      //     this.$message({
      //       type: 'warning',
      //       message: '请上传发票清单'
      //     })
      //     return
      //   }
      // }
      for (var i = 0; i<this.contractData.length;i++) {
        if (!this.contractData[i].contractAmount || !this.contractData[i].contractCode || !this.contractData[i].picPath) {
          this.$message({
            type: 'warning',
            message: '请完善合同列表数据'
          })
          return
        }
      }
      if(this.contractMoneyAll < this.mateForm.amount){
        this.$message({
            message: '合同金额必须大于融资金额，请重新输入合同金额',
            type: 'warning',
        })
        return
      }
      this.mateForm.financeAmount = this.mateForm.amount
      this.mateForm.status = '0'
      const params = {
        'tenantFinanceApply' : this.mateForm,
        'tenantCompanyInfo' : this.userData,
        'clcpFinanceAppliedContract' : this.contractData,
        'clcpFinanceAppliedInvoice' : this.invoiceData
      }
      console.log(params)
      if (this.isEdit === '1') {
        this.$root.ajaxData('/purchase/finance/updateApply', params, function (data) {
          if (data.statusCode === 200) {
            vm.$root.monitor({ url:'/purchase/finance/applyList?isSupply=0', method: 'GET' })
          } else {
            this.$message({
              type: 'error',
              message: '操作失败'
            })
          }
        }, 'POST')
      } else {
        this.$root.ajaxData('/purchase/finance/addApply', params, function (data) {
          if (data.statusCode === 200) {
            vm.$root.monitor({ url:'/purchase/finance/applyList?isSupply=0', method: 'GET' })
          } else {
            this.$message({
              type: 'error',
              message: '操作失败'
            })
          }
        }, 'POST')
      }
    }
    else {
      this.$notify.error({
        title: '消息',
        message: '数据验证未通过'
      })
      return
    }
  },

  // 取消
  backward () {
    let vm = this
    if (this.mate.mateFormerHeader.values.isSupply === '0') {
      vm.$root.monitor({ url:'/purchase/finance/applyList?isSupply=0', method: 'GET' })
    } else if (this.mate.mateFormerHeader.values.isSupply === '1') {
      vm.$root.monitor({ url:'/purchase/finance/applyList?isSupply=1', method: 'GET' })
    }else {
       vm.$root.monitor({ url:'/purchase/finance/applyList?isSupply=0', method: 'GET' })
    }
  },
  }
}
</script>

<style scoped lang="scss">
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
    margin: 5px 10px 5px 5px;
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
  .el-date-editor.el-input{
    width:100%;
  }
  .el-form--inline.el-form--label-top .el-form-item__content{
    width:90%
  }
  .leftFloat .el-form--inline .el-form-item{
    margin-right:10px;
  }
  .el-input__suffix {
    right:68px
  }
  .el-form-item--mini.el-form-item {
    margin: 6px;
  }
  .el-input--mini .el-input__inner{
    width:80%
  }
  .hbutton {
    margin-bottom: 20px;
  }
  .finance, .financingUser, .attachment {
    margin-bottom: 40px;
    .el-form {
      margin-top: 20px;
    }
  }
  .invoiceMain, .contractMain {
    margin-bottom: 40px;
    .aclass {
      float: right;
      font-size: 14px;
      margin-right: 35px;
      margin-bottom: 10px;
      span {
        cursor: pointer;
        color: rgba(42, 130, 228, 1);
      }
    }
    .el-table.el-table--fit.el-table--border.el-table--enable-row-hover {
      margin-top: 20px;
    }
  }
  .title {
    font-size: 20px;
    margin: 0 auto;
    width: 160px;
    height: 28px;
    color: #fff;
    border: 1px solid #fff;
    background-color: #6e86e3;
    .financeTitle {
      padding-left: 20px; 
    }
    .invoiceTitle, .contractTitle, .attachmentTitle {
      padding-left: 40px;
    }
    .userTitle {
      padding-left: 10px;
    }
  }
</style>
