/**
 * 动态组件异步加载
 */
export default {
	YLGLCharts: function (resolve) {
		require(['../views/capacitySynergy/YLGLCharts.vue'], resolve)
	},
	YLGLForm: function (resolve) {
		require(['../views/capacitySynergy/YLGLForm.vue'], resolve)
	},
	YLPlan: function (resolve) {
		require(['../views/capacitySynergy/YLPlan.vue'], resolve)
	},
	Formor: function (resolve) {
		require(['../components/Formor.vue'], resolve)
	},
	InvoiceView: function (resolve) {
		require(['../components/InvoiceView.vue'], resolve)
	},
	KTableMateriel: function (resolve) {
		require(['../components/KTableMateriel.vue'], resolve)
	},
	SupplierOrderDetail: function (resolve) {
		require(['../views/SaleManagement/SupplierOrderDetail.vue'], resolve)
	},
	KTable: function (resolve) {
		require(['../components/KTable.vue'], resolve)
	},
	KTreer: function (resolve) {
		require(['../views/sys/KTreer.vue'], resolve)
	},
	TreeList: function (resolve) {
		require(['../components/TreeList.vue'], resolve)
	},
	TreeList2: function (resolve) {
		require(['../components/TreeList2.vue'], resolve)
	},
	FormDesign: function (resolve) {
		require(['../components/FormDesign.vue'], resolve)
	},
	RoleAssignUser: function (resolve) {
		require(['../views/sys/RoleAssignUser.vue'], resolve)
	},
	RoleMenuAuthority: function (resolve) {
		require(['../views/sys/RoleMenuAuthority.vue'], resolve)
	},
	Detail: function (resolve) {
		require(['../components/Detail.vue'], resolve)
	},
	CTable: function (resolve) {
		require(['../components/CTable.vue'], resolve)
	},
	FReport: function (resolve) {
		require(['../components/report/FReport.vue'], resolve)
	},
	DblTable: function (resolve) {
		require(['../components/DblTable.vue'], resolve)
	},
	SelectNum: function (resolve) {
		require(['../views/basedata/SelectNum.vue'], resolve)
	},
	OutboundNum: function (resolve) {
		require(['../views/OutBoundManagement/OutboundNum.vue'], resolve)
	},
	InventoryBill: function (resolve) {
		require(['../views/InventoryManagement/InventoryBill.vue'], resolve)
	},
	InventorySnapshots: function (resolve) {
		require(['../views/InventoryManagement/InventorySnapshots.vue'], resolve)
	},
	InventoryTags: function (resolve) {
		require(['../views/InventoryManagement/InventoryTags.vue'], resolve)
	},
	InventoryApprove: function (resolve) {
		require(['../views/InventoryManagement/InventoryApprove.vue'], resolve)
	},
	InventoryAdjust: function (resolve) {
		require(['../views/InventoryManagement/InventoryAdjust.vue'], resolve)
	},
	AddProducer: function (resolve) {
		require(['../views/BasicData/AddProducer.vue'], resolve)
	},
	InventoryWatch: function (resolve) {
		require(['../views/InventoryManagement/InventoryWatch.vue'], resolve)
	},
	PoDespatch: function (resolve) {
		require(['../views/PurchasingManagement/PoDespatch.vue'], resolve)
	},
	GoodsCategory: function (resolve) {
		require(['../views/ReleaseGoods/GoodsCategory.vue'], resolve)
	},
	GoodsRelease: function (resolve) {
		require(['../views/ReleaseGoods/GoodsRelease.vue'], resolve)
	},
	Asn: function (resolve) {
		require(['../views/SaleManagement/Asn.vue'], resolve)
	},
	// 供应商asn新增页面
	AsnEbs: function (resolve) {
		require(['../views/SaleManagement/AsnEbs.vue'], resolve)
	},
	DblTableQuotation: function (resolve) {
		require(['../views/SaleManagement/DblTableQuotation.vue'], resolve)
	},
	SmItemCross: function (resolve) {
		require(['../views/SaleManagement/SmItemCross.vue'], resolve)
	},
	SoReturn: function (resolve) {
		require(['../views/SaleManagement/SoReturn.vue'], resolve)
	},
	PurchaseOrderKtable: function (resolve) {
		require(['../views/PurchasingManagement/PurchaseOrderKtable.vue'], resolve)
	},
	ReceiveAsn: function (resolve) {
		require(['../views/InboundManagement/ReceiveAsn.vue'], resolve)
	},
	SoReturnKtable: function (resolve) {
		require(['../views/SaleManagement/SoReturnKtable.vue'], resolve)
	},
	PerfectInfo: function (resolve) {
		require(['../views/sys/PerfectInfo.vue'], resolve)
	},
	PerfectInfoApproval: function (resolve) {
		require(['../views/sys/PerfectInfoApproval.vue'], resolve)
	},
	HomePage: function (resolve) {
		require(['../views/sys/HomePage.vue'], resolve)
	},
	DialogForm: function (resolve) {
		require(['../components/DialogForm.vue'], resolve)
	},
	InvoiceReceiveForm: function (resolve) {
		require(['./ReconciliationSettlement/InvoiceReceiveForm.vue'], resolve)
	},
	InvoiceReceive: function (resolve) {
		require(['../views/ReconciliationSettlement/InvoiceReceive.vue'], resolve)
	},
	Recon: function (resolve) {
		require(['../views/ReconciliationSettlement/Recon.vue'], resolve)
	},
	ReconForm: function (resolve) {
		require(['../views/ReconciliationSettlement/ReconForm.vue'], resolve)
	},
	ReconKTable: function (resolve) {
		require(['../components/ReconciliationSettlement/ReconKTable.vue'], resolve)
	},
	MyInvoiceKTable: function (resolve) {
		require(['../views/ReconciliationSettlement/MyInvoiceKTable.vue'], resolve)
	},
	MyInvoiceKTable1: function (resolve) {
		require(['../views/ReconciliationSettlement/MyInvoiceKTable1.vue'], resolve)
	},
	MyInvoiceDetail: function (resolve) {
		require(['../views/ReconciliationSettlement/MyInvoiceDetail.vue'], resolve)
	},
	// SetDbTable: function (resolve) {
	//   require(['../views/ReconciliationSettlement/SetDbTable.vue'], resolve)
	// },
	SetDbTable1: function (resolve) {
		require(['../views/ReconciliationSettlement/SetDbTable1.vue'], resolve)
	},
	SettlementDetial: function (resolve) {
		require(['../views/ReconciliationSettlement/SettlementDetial.vue'], resolve)
	},
	InvoiceReceiptKTable: function (resolve) {
		require(['../views/ReconciliationSettlement/InvoiceReceiptKTable.vue'], resolve)
	},
	InvoiceReceiptEdit: function (resolve) {
		require(['../views/ReconciliationSettlement/InvoiceReceiptEdit.vue'], resolve)
	},
	InvoiceReceiptDetail: function (resolve) {
		require(['../views/ReconciliationSettlement/InvoiceReceiptDetail.vue'], resolve)
	},
	Process: function (resolve) {
		require(['../views/sys/Process.vue'], resolve)
	},
	// DblTableBase: function (resolve) {
	//   require(['../views/ReconciliationSettlement/DblTableBase.vue'], resolve)
	// },
	ReconDblTable: function (resolve) {
		require(['../components/ReconciliationSettlement/ReconDblTable.vue'], resolve)
	},
	Settlement: function (resolve) {
		require(['../views/ReconciliationSettlement/Settlement.vue'], resolve)
	},
	SettlementForm: function (resolve) {
		require(['../views/ReconciliationSettlement/SettlementForm.vue'], resolve)
	},
	CollectionDblTable: function (resolve) {
		require(['../views/ReconciliationSettlement/CollectionDblTable.vue'], resolve)
	},
	PaymentDblTable: function (resolve) {
		require(['../views/ReconciliationSettlement/PaymentDblTable.vue'], resolve)
	},
	InvoicePayForm: function (resolve) {
		require(['./ReconciliationSettlement/InvoicePayForm.vue'], resolve)
	},
	Collection: function (resolve) {
		require(['../views/ReconciliationSettlement/Collection.vue'], resolve)
	},
	Payment: function (resolve) {
		require(['../views/ReconciliationSettlement/Payment.vue'], resolve)
	},
	InvoivePayForm: function (resolve) {
		require(['./ReconciliationSettlement/InvoivePayForm.vue'], resolve)
	},
	Dallot: function (resolve) {
		require(['../views/InventoryManagement/Dallot.vue'], resolve)
	},
	InvoicePay: function (resolve) {
		require(['../views/ReconciliationSettlement/InvoicePay.vue'], resolve)
	},
	Sequence: function (resolve) {
		require(['../views/sys/Sequence.vue'], resolve)
	},
	dicDblTable: function (resolve) {
		require(['../views/sys/dicDblTable.vue'], resolve)
	},
	// 基础数据
	Materials: function (resolve) {
		require(['../views/BasicData/Materials.vue'], resolve)
	},
	MaterialForm: function (resolve) {
		require(['../views/BasicData/MaterialForm.vue'], resolve)
	},
	BomDetial: function (resolve) {
		require(['../views/BasicData/BomDetial.vue'], resolve)
	},
	TreeGrid: function (resolve) {
		require(['../views/BasicData/TreeGrid.vue'], resolve)
	},
	Customer: function (resolve) {
		require(['../views/BasicData/Customer.vue'], resolve)
	},
	AddCustomer: function (resolve) {
		require(['../views/BasicData/AddCustomer.vue'], resolve)
	},
	Supplier: function (resolve) {
		require(['../views/BasicData/Supplier.vue'], resolve)
	},
	AddSupplier: function (resolve) {
		require(['../views/BasicData/AddSupplier.vue'], resolve)
	},
	GridForm: function (resolve) {
		require(['../views/BasicData/GridForm.vue'], resolve)
	},
	GridView: function (resolve) {
		require(['../views/BasicData/GridView.vue'], resolve)
	},
	InvoiceRuleKTable: function (resolve) {
		require(['../views/BasicData/InvoiceRuleKTable.vue'], resolve)
	},
	InvoiceRuleAdd: function (resolve) {
		require(['../views/BasicData/InvoiceRuleAdd.vue'], resolve)
	},
	InvoiceRuleForm: function (resolve) {
		require(['./InvoiceRuleForm.vue'], resolve)
	},
	ClasscodeManage: function (resolve) {
		require(['../views/BasicData/ClasscodeManage.vue'], resolve)
	},
	// 入库管理模块
	InboundDblTable: function (resolve) {
		require(['../views/InboundManagement/InboundDblTable.vue'], resolve)
	},
	InboundKTable: function (resolve) {
		require(['../views/InboundManagement/InboundKTable.vue'], resolve)
	},
	InBill: function (resolve) {
		require(['../views/InboundManagement/InBill.vue'], resolve)
	},
	InBoundBill: function (resolve) {
		require(['../views/InboundManagement/InBoundBill.vue'], resolve)
	},
	ReceiveBillFormer: function (resolve) {
		require(['../views/InboundManagement/ReceiveBillFormer.vue'], resolve)
	},
	ReceiveBillList: function (resolve) {
		require(['../views/InboundManagement/ReceiveBillList.vue'], resolve)
	},
	ReceiveInspect: function (resolve) {
		require(['../views/InboundManagement/ReceiveInspect.vue'], resolve)
	},
	ReceiveInspectFormer: function (resolve) {
		require(['../views/InboundManagement/ReceiveInspectFormer.vue'], resolve)
	},
	ReceivePutaway: function (resolve) {
		require(['../views/InboundManagement/ReceivePutaway.vue'], resolve)
	},
	// 出库管理
	OutBoundDblTable: function (resolve) {
		require(['../views/OutBoundManagement/OutBoundDblTable.vue'], resolve)
	},
	OutBoundKTable: function (resolve) {
		require(['../views/OutBoundManagement/OutBoundKTable.vue'], resolve)
	},
	OutBill: function (resolve) {
		require(['../views/OutBoundManagement/OutBill.vue'], resolve)
	},
	OutBoundBill: function (resolve) {
		require(['../views/OutBoundManagement/OutBoundBill.vue'], resolve)
	},
	EncasementDblTable: function (resolve) {
		require(['../views/OutBoundManagement/EncasementDblTable.vue'], resolve)
	},
	WaveDbleTable: function (resolve) {
		require(['../views/OutBoundManagement/WaveDblTable.vue'], resolve)
	},
	Package: function (resolve) {
		require(['../views/OutBoundManagement/Package.vue'], resolve)
	},
	// 采购管理
	PurchaseDblTable: function (resolve) {
		require(['../views/PurchasingManagement/PurchaseDblTable.vue'], resolve)
	},
	InventoryKTable: function (resolve) {
		require(['../views/PurchasingManagement/InventoryKTable.vue'], resolve)
	},
	PriceKtable: function (resolve) {
		require(['../views/PurchasingManagement/PriceKtable'], resolve)
	},
	GoodsInfoKTable: function (resolve) {
		require(['../views/PurchasingManagement/GoodsInfoKTable'], resolve)
	},
	PriceDblTable: function (resolve) {
		require(['../views/PurchasingManagement/PriceDblTable.vue'], resolve)
	},
	OrderDblTable: function (resolve) {
		require(['../views/PurchasingManagement/OrderDblTable.vue'], resolve)
	},
	PurchaseRequisitions: function (resolve) {
		require(['../views/PurchasingManagement/PurchaseRequisitions.vue'], resolve)
	},
	GoodsPrice: function (resolve) {
		require(['../views/PurchasingManagement/GoodsPrice.vue'], resolve)
	},
	GoodsPriceForm: function (resolve) {
		require(['../views/PurchasingManagement/GoodsPriceForm.vue'], resolve)
	},
	QualifiedSupplier: function (resolve) {
		require(['../views/PurchasingManagement/QualifiedSupplier.vue'], resolve)
	},
	PurchaseOrder: function (resolve) {
		require(['../views/PurchasingManagement/PurchaseOrder.vue'], resolve)
	},
	PurchaseOrderForm: function (resolve) {
		require(['../views/PurchasingManagement/PurchaseOrderForm.vue'], resolve)
	},
	QdPurchaseReturns: function (resolve) {
		require(['../views/PurchasingManagement/QdPurchaseReturns.vue'], resolve)
	},
	QdPurchaseReturnsForm: function (resolve) {
		require(['../views/PurchasingManagement/QdPurchaseReturnsForm.vue'], resolve)
	},
	// 销售管理
	SmPriceHeader: function (resolve) {
		require(['../views/SaleManagement/SmPriceHeader.vue'], resolve)
	},
	DblTableOrder: function (resolve) {
		require(['../views/SaleManagement/DblTableOrder.vue'], resolve)
	},
	SaleDblTable: function (resolve) {
		require(['../views/SaleManagement/SaleDblTable.vue'], resolve)
	},
	QdQuotation: function (resolve) {
		require(['../views/SaleManagement/QdQuotation.vue'], resolve)
	},
	QdQuotationForm: function (resolve) {
		require(['../views/SaleManagement/QdQuotationForm.vue'], resolve)
	},
	SaleOrderForm: function (resolve) {
		require(['../views/SaleManagement/SaleOrderForm.vue'], resolve)
	},
	SaleOrder: function (resolve) {
		require(['../views/SaleManagement/SaleOrder.vue'], resolve)
	},
	InquirySheet: function (resolve) {
		require(['../views/SaleManagement/InquirySheet.vue'], resolve)
	},
	PoDblTable: function (resolve) {
		require(['../views/SaleManagement/PoDblTable.vue'], resolve)
	},
	//供应商退货接收
	SupplierPortalPoDblTable: function (resolve) {
		require(['../views/SupplierPortal/SupplierPortalPoDblTable.vue'], resolve)
	},
	// 供应商客户po详情(客户PO请求更改)
	SupplierPortalPoDetail: function (resolve) {
		require(['../views/SupplierPortal/SupplierPortalPoDetail.vue'], resolve)
	},
	//供应商报表系统
	SupplierReports: function (resolve) {
		require(['../views/SaleManagement/SupplierReports.vue'], resolve)
	},
	// 供应商门户：发运通知
	SupplierPortalAsnDblTable: function(resolve) {
		require(['../views/SupplierPortal/SupplierPortalAsnDblTable.vue'], resolve)
	},
//供应商门户：发运通知--详情
	SupplierPortalAsnDetail: function (resolve) {
		require(['../views/SupplierPortal/SupplierPortalAsnDetail.vue'], resolve)
	},
	//供应商门户：发运通知 -- 查询po订单
	SupplierPortalAsnChoosePoTable: function (resolve) {
		require(['../views/SupplierPortal/SupplierPortalAsnChoosePoTable.vue'], resolve)
	},
	//供应商门户：发运通知 -- po 头view
	SupplierPortalPoKtable: function (resolve) {
		require(['../views/SupplierPortal/SupplierPortalPoKtable.vue'], resolve)
	},	RequirementSchedule: function (resolve) {
		require(['../views/SaleManagement/RequirementSchedule.vue'], resolve)
	},
	// 系统管理
	RoleKTable: function (resolve) {
		require(['../views/sys/RoleKTable.vue'], resolve)
	},
	CompanyKTable: function (resolve) {
		require(['../views/sys/CompanyKTable.vue'], resolve)
	},
	UserForm: function (resolve) {
		require(['../views/sys/UserForm.vue'], resolve)
	},
	AdminUserForm: function (resolve) {
		require(['../views/sys/AdminUserForm.vue'], resolve)
	},
	RequisitionsDblTable: function (resolve) {
		require(['../views/PurchasingManagement/RequisitionsDblTable.vue'], resolve)
	},
	InventoryOrganization: function (resolve) {
		require(['../views/sys/InventoryOrganization.vue'], resolve)
	},
	ReleaseGoods: function (resolve) {
		require(['../views/ReleaseGoods/ReleaseGoods.vue'], resolve)
	},
	ReleaseKtable: function (resolve) {
		require(['../views/ReleaseGoods/ReleaseKtable.vue'], resolve)
	},
	PurchaseReqDbTable: function (resolve) {
		require(['../views/PurchasingManagement/PurchaseReqDbTable.vue'], resolve)
	},
	// 预制发票
	PreInvoice: function (resolve) {
		require(['../views/ReconciliationSettlement/PreInvoice.vue'], resolve)
	},
	// 对账管理
	CreateSettlement: function (resolve) {
		require(['../views/ReconciliationSettlement/CreateSettlement.vue'], resolve)
	},
	// 生成结算单(还没有生成)
	PreSettlement: function (resolve) {
		require(['../views/ReconciliationSettlement/PreSettlement.vue'], resolve)
	},
	// 销售对账单表报
	salesStatement: function (resolve) {
		require(['../views/ReconciliationSettlement/salesStatement.vue'], resolve)
	},
	SettlementConfirm: function (resolve) {
		require(['../views/ReconciliationSettlement/SettlementConfirm.vue'], resolve)
	},
	// 对账new
	CheckSettlement1: function (resolve) {
		require(['../views/ReconciliationSettlement/CheckSettlement1.vue'], resolve)
	},
	CheckSettlementPurch: function (resolve) {
		require(['../views/ReconciliationSettlement/CheckSettlementPurch.vue'], resolve)
	},
	PreSettlementPurchase: function (resolve) {
		require(['../views/ReconciliationSettlement/PreSettlementPurchase.vue'], resolve)
	},
	// 对账管理(对账)
	// CheckSettlement: function (resolve) {
	//   require(['../views/ReconciliationSettlement/CheckSettlement.vue'], resolve)
	// },

	// // 对账管理(对账)
	// CheckSettlement: function (resolve) {
	//   require(['../views/ReconciliationSettlement/CheckSettlement.vue'], resolve)
	// },
	// 应付发票功能
	InvoicePayment: function (resolve) {
		require(['../views/ReconciliationSettlement/InvoicePayment.vue'], resolve)
	},
	InvoiceResult: function (resolve) {
		require(['../views/sys/InvoiceResult.vue'], resolve)
	},
	// 查看进项发票
	CheckPaymentInvoice: function (resolve) {
		require(['../views/ReconciliationSettlement/CheckPaymentInvoice.vue'], resolve)
	},
	// 生成ebs应付发票
	GenEbsPaymentInvoice: function (resolve) {
		require(['../views/ReconciliationSettlement/GenEbsPaymentInvoice.vue'], resolve)
	},
	// 报表
	CompanyReport: function (resolve) {
		require(['../views/BlockchainReport/CompanyReport.vue'], resolve)
	},
	SettlementReport: function (resolve) {
		require(['../views/BlockchainReport/SettlementReport.vue'], resolve)
	},
	PreInvoiceReport: function (resolve) {
		require(['../views/BlockchainReport/PreInvoiceReport.vue'], resolve)
	},
	ConclusionChart: function (resolve) {
		require(['../views/BlockchainReport/ConclusionChart.vue'], resolve)
	},
	ExchangeForm: function (resolve) {
		require(['../components/ExchangeForm.vue'], resolve)
	},
	ClcpPage: function (resolve) {
		require(['../views/sys/ClcpPage.vue'], resolve)
	},
	// 生产管理 BOM
	BomMain(resolve) {
		require(['../views/ProductionManagement/BomMain.vue'], resolve)
	},
	// 生产管理 BOM新增
	BomAdd(resolve) {
		require(['../views/ProductionManagement/BomAdd.vue'], resolve)
  },
  	// 生产管理 BOM物料用量导出
	BomExport(resolve) {
		require(['../views/ProductionManagement/BomExport.vue'], resolve)
	},
	// 生产管理 ECN
	EcnMain(resolve) {
		require(['../views/ProductionManagement/EcnMain.vue'], resolve)
	},
	// 生产管理 ECN新增
	EcnAdd(resolve) {
		require(['../views/ProductionManagement/EcnAdd.vue'], resolve)
	},
	// 生产管理 生产工单
	ProductionWorkOrder(resolve) {
		require(['../views/ProductionManagement/ProductionWorkOrder.vue'], resolve)
	},
	// 生产管理 生产工单新增
	ProductionWorkOrderAdd(resolve) {
		require(['../views/ProductionManagement/ProductionWorkOrderAdd.vue'], resolve)
	},
	// 生产管理 工单发料
	WorkOrderIssue(resolve) {
		require(['../views/ProductionManagement/WorkOrderIssue.vue'], resolve)
	},
	// 生产管理 工单发料新增
	WorkOrderIssueAdd(resolve) {
		require(['../views/ProductionManagement/WorkOrderIssueAdd.vue'], resolve)
	},
	// 生产管理 产成品入库
	ProductsWarehousing(resolve) {
		require(['../views/ProductionManagement/ProductsWarehousing.vue'], resolve)
	},
	// 生产管理 产成品入库新增
	ProductsWarehousingAdd(resolve) {
		require(['../views/ProductionManagement/ProductsWarehousingAdd.vue'], resolve)
	},
	// 生产管理 日产日清
	ProductionDailySettlement(resolve) {
		require(['../views/ProductionManagement/ProductionDailySettlement.vue'], resolve)
	},
	// 生产管理 生产计划
	ProductionPlan(resolve) {
		require(['../views/ProductionManagement/ProductionPlan.vue'], resolve)
	},
	// 生产管理 生产计划新增
	ProductionPlanAdd(resolve) {
		require(['../views/ProductionManagement/ProductionPlanAdd.vue'], resolve)
	},
	// 智能跟单-跟单列表
	DocumentaryList(resolve) {
		require(['../views/SmartFollowUp/DocumentaryList.vue'], resolve)
	},
	// 智能跟单-跟单列表-新增
	DocumentaryListAdd(resolve) {
		require(['../views/SmartFollowUp/DocumentaryListAdd.vue'], resolve)
	},
	// 智能跟单-待接收任务
	ReceiveTask(resolve) {
		require(['../views/SmartFollowUp/ReceiveTask.vue'], resolve)
	},
	// 智能跟单-我的任务
	MyTask(resolve) {
		require(['../views/SmartFollowUp/MyTask.vue'], resolve)
	},
	// 智能跟单-任务进度
	OrderProgress(resolve) {
		require(['../views/SmartFollowUp/OrderProgress.vue'], resolve)
	},
	// 智能跟单-跟单数据统计
	FollowUpStatistics(resolve) {
		require(['../views/SmartFollowUp/FollowUpStatistics.vue'], resolve)
	},
	// 智能跟单-交货单
	SmartInvoice(resolve) {
		require(['../views/SmartFollowUp/SmartInvoice.vue'], resolve)
	},
	// 智能跟单-交货单-新增/修改
	SmartInvoiceAdd(resolve) {
		require(['../views/SmartFollowUp/SmartInvoiceAdd.vue'], resolve)
	},
	// 电镀行业：商品发布-需求发布
	DemandIssueMain(resolve) {
		require(['../views/GoodsRelease/DemandIssueMain.vue'], resolve)
	},
	// 电镀行业：商品发布-需求发布-新增
	DemandIssue(resolve) {
		require(['../views/GoodsRelease/DemandIssue.vue'], resolve)
	},
	// 电镀行业：商品发布-供应发布
	SupplyIssueMain(resolve) {
		require(['../views/GoodsRelease/SupplyIssueMain.vue'], resolve)
	},
	// 电镀行业：商品发布-供应发布-新增
	SupplyIssue(resolve) {
		require(['../views/GoodsRelease/SupplyIssue.vue'], resolve)
	},
	// 电镀行业：商品发布-行业合作
	TemCooperationMain(resolve) {
		require(['../views/GoodsRelease/TemCooperationMain.vue'], resolve)
	},
	// 电镀行业：商品发布-行业合作-新增
	TemCooperation(resolve) {
		require(['../views/GoodsRelease/TemCooperation.vue'], resolve)
	},
	// 电镀行业：商品发布-行业资讯
	TemInfoMain(resolve) {
		require(['../views/GoodsRelease/TemInfoMain.vue'], resolve)
	},
	// 电镀行业：商品发布-行业咨询-新增
	TemInfo(resolve) {
		require(['../views/GoodsRelease/TemInfo.vue'], resolve)
	},
	// 电镀行业：商品发布-园区服务
	ParkServiceMain(resolve) {
		require(['../views/GoodsRelease/ParkServiceMain.vue'], resolve)
	},
	// 电镀行业：商品发布-园区服务-新增
	ParkService(resolve) {
		require(['../views/GoodsRelease/ParkService.vue'], resolve)
	},
	// 电镀行业：商品发布-园区入驻
	ParkCheckMain(resolve) {
		require(['../views/GoodsRelease/ParkCheckMain.vue'], resolve)
	},
	// 报表管理：报表管理-采购报表
	PurchaseReport(resolve) {
		require(['../views/ReportFormsManage/purchaseReport.vue'], resolve)
	},
	// 报表管理：报表管理-销售报表
	SellReport(resolve) {
		require(['../views/ReportFormsManage/sellReport.vue'], resolve)
	},
	// 报表管理：报表管理-库存报表
	InventoryReport(resolve) {
		require(['../views/ReportFormsManage/inventoryReport.vue'], resolve)
	},
	// 基础数据：工单分类
	TicketClassification(resolve) {
		require(['../views/BasicData/TicketClassification.vue'], resolve)
	},
	// 基础数据：工单分类新增
	TicketClassificationAdd(resolve) {
		require(['../views/BasicData/TicketClassificationAdd.vue'], resolve)
	},
	// 受托加工：加工计划
	ProcessingPlanList(resolve) {
		require(['../views/BeEntrustProcessing/ProcessingPlan.vue'], resolve)
	},
	// 受托加工：加工计划新增
	ProcessingPlanAdd(resolve) {
		require(['../views/BeEntrustProcessing/ProcessingPlanAdd.vue'], resolve)
	},
	// 委托方：数据统计
	EntrustDeliveryAnalysisList(resolve) {
		require(['../views/EntrustProcessing/EntrustDeliveryAnalysis.vue'], resolve)
	},
	// 委托方：外协加工单
	OutsourcingProcessingOrder(resolve) {
		require(['../views/EntrustProcessing/OutsourcingProcessingOrder.vue'], resolve)
	},
	// 受托加工：加工单录入
	ProcessingOrderEntry(resolve) {
		require(['../views/BeEntrustProcessing/ProcessingOrderEntry.vue'], resolve)
	},
	// 受托加工：加工单录入新增
	ProcessingOrderEntryAdd(resolve) {
		require(['../views/BeEntrustProcessing/ProcessingOrderEntryAdd.vue'], resolve)
	},
	// 受托加工：收货检验
	ReceiptInspection(resolve) {
		require(['../views/BeEntrustProcessing/ReceiptInspection.vue'], resolve)
	},
	// 受托加工：收货检验新增
	ReceiptInspectionAdd(resolve) {
		require(['../views/BeEntrustProcessing/ReceiptInspectionAdd.vue'], resolve)
	},
	// 受托加工：加工入库单
	ProcessingReceipt(resolve) {
		require(['../views/BeEntrustProcessing/ProcessingReceipt.vue'], resolve)
	},
	// 受托加工：加工入库单新增
	ProcessingReceiptAdd(resolve) {
		require(['../views/BeEntrustProcessing/ProcessingReceiptAdd.vue'], resolve)
	},
	// 受托加工：交货单
	DeliveryOrder(resolve) {
		require(['../views/BeEntrustProcessing/DeliveryOrder.vue'], resolve)
	},
	// 受托加工：交货单新增
	DeliveryOrderAdd(resolve) {
		require(['../views/BeEntrustProcessing/DeliveryOrderAdd.vue'], resolve)
	},
	// 受托加工：退货单
	ReturnOrder(resolve) {
		require(['../views/BeEntrustProcessing/ReturnOrder.vue'], resolve)
	},
	// 受托加工：退货单新增
	ReturnOrderAdd(resolve) {
		require(['../views/BeEntrustProcessing/ReturnOrderAdd.vue'], resolve)
	},
	// 受托方：数据统计
	BeEntrustDeliveryAnalysisList(resolve) {
		require(['../views/BeEntrustProcessing/BeEntrustDeliveryAnalysis.vue'], resolve)
	},
	// 受托加工：技术方案管理
	TechnologyPlanManageList(resolve) {
		require(['../views/BeEntrustProcessing/TechnologyPlanManage.vue'], resolve)
	},
	// 受托加工：技术方案管理-新增
	TechnologyPlanManageAdd(resolve) {
		require(['../views/BeEntrustProcessing/TechnologyPlanManageAdd.vue'], resolve)
	},
	// 物流基础数据：仓库信息
	WareHouse(resolve) {
	    require(['../views/LogisticsBaseData/WareHouse.vue'], resolve)
	},
	// 物流基础数据：仓库信息-新增
	WareHouseAdd(resolve) {
		require(['../views/LogisticsBaseData/WareHouseAdd.vue'], resolve)
	},
	// 物流基础数据：物流站点
	Station(resolve) {
		require(['../views/LogisticsBaseData/Station.vue'], resolve)
	},
	// 物流基础数据：物流站点-新增
	StationAdd(resolve) {
		require(['../views/LogisticsBaseData/StationAdd.vue'], resolve)
	},
	// 对账开票：销项发票交接单-申请融资
	ApplyFinancing(resolve) {
		require(['../views/ReconciliationSettlement/ApplyFinancing.vue'], resolve)
	},
	// 对账开票：融资申请列表
	ApplyFinancingList(resolve) {
		require(['../views/ReconciliationSettlement/ApplyFinancingList.vue'], resolve)
	},
	// 对账开票：融资方-融资申请列表
	OtherApplyFinance(resolve) {
		require(['../views/ReconciliationSettlement/OtherApplyFinance.vue'], resolve)
	},
	// 物流商管理：物流商信息
	LogisticsProvidersInfo(resolve) {
		require(['../views/LogisticsProvidersManage/LogisticsProvidersInfo.vue'], resolve)
	},
	// 物流商管理：物流商信息-新增
	LogisticsProvidersInfoAdd(resolve) {
		require(['../views/LogisticsProvidersManage/LogisticsProvidersInfoAdd.vue'], resolve)
	},
	// 物流订单：提货单
	LogisticsDeliveryOrder(resolve) {
		require(['../views/LogisticsOrder/LogisticsDeliveryOrder.vue'], resolve)
	},
	// 物流订单：提货单-新增
	LogisticsDeliveryOrderAdd(resolve) {
		require(['../views/LogisticsOrder/LogisticsDeliveryOrderAdd.vue'], resolve)
	},
	// 物流商管理：物流供应商备案信息
	RegistrationInfo(resolve) {
		require(['../views/LogisticsProvidersManage/RegistrationInfo.vue'], resolve)
	},
	// 物流商管理：物流供应商备案信息-新增
	RegistrationInfoAdd(resolve) {
		require(['../views/LogisticsProvidersManage/RegistrationInfoAdd.vue'], resolve)
	},
	// 物流商管理：物流供应商备案信息-提货人备案
	RegistrationConsignee(resolve) {
		require(['../views/LogisticsProvidersManage/RegistrationConsignee.vue'], resolve)
	},
	// 物流商管理：物流供应商备案信息-提货人备案-新增
	RegistrationConsigneeAdd(resolve) {
		require(['../views/LogisticsProvidersManage/RegistrationConsigneeAdd.vue'], resolve)
	},
	// 物流商管理：物流供应商备案信息-车辆备案
	RegistrationVehicle(resolve) {
		require(['../views/LogisticsProvidersManage/RegistrationVehicle.vue'], resolve)
	},
	// 物流商管理：物流供应商备案信息-车辆备案-新增
	RegistrationVehicleAdd(resolve) {
		require(['../views/LogisticsProvidersManage/RegistrationVehicleAdd.vue'], resolve)
	},
	// 物流订单：司机资料维护
	DriverInfo(resolve) {
		require(['../views/LogisticsOrder/DriverInfo.vue'], resolve)
	},
	// 系统管理：参数设置
	BaseConfig(resolve) {
		require(['../views/sys/BaseConfig.vue'], resolve)
	},
	// 物流线路管理：物流线路维护
	LogisticsRoute(resolve) {
		require(['../views/LogisticsRouteManage/LogisticsRoute.vue'], resolve)
	},
	// 物流线路管理：物流线路维护-新增
	LogisticsRouteAdd(resolve) {
		require(['../views/LogisticsRouteManage/LogisticsRouteAdd.vue'], resolve)
	},
	// 物流线路管理：物流线路定价
	LogisticsRoutePrice(resolve) {
		require(['../views/LogisticsRouteManage/LogisticsRoutePrice.vue'], resolve)
	},
	// 物流线路管理：物流线路定价-新增
	LogisticsRoutePriceAdd(resolve) {
		require(['../views/LogisticsRouteManage/LogisticsRoutePriceAdd.vue'], resolve)
	},
	// 物流订单：货物追踪签到
	CargoTrackSign(resolve) {
		require(['../views/LogisticsOrder/CargoTrackSign.vue'], resolve)
	},
	// 物流订单：实报实销管理
	CompleteReimbursement(resolve) {
		require(['../views/LogisticsOrder/CompleteReimbursement.vue'], resolve)
	},
	// 物流订单：实报实销管理-新增
	CompleteReimbursementAdd(resolve) {
		require(['../views/LogisticsOrder/CompleteReimbursementAdd.vue'], resolve)
	},
	// 物流订单：物流费用报表
	LogisticsFees(resolve) {
		require(['../views/LogisticsOrder/LogisticsFees.vue'], resolve)
	},
	// 客户收货地址
	CustomerReceiceAddress(resolve) {
		require(['../views/LogisticsOrder/CustomerReceiceAddress.vue'], resolve)
	},
	// 客户收货地址-新增
	CustomerReceiceAddressAdd(resolve) {
		require(['../views/LogisticsOrder/CustomerReceiceAddressAdd.vue'], resolve)
	},
	// 提货人管理
	ConsigneeManagement(resolve) {
		require(['../views/LogisticsOrder/ConsigneeManagement.vue'], resolve)
	},
	// 提货人管理-新增
	ConsigneeManagementAdd(resolve) {
		require(['../views/LogisticsOrder/ConsigneeManagementAdd.vue'], resolve)
	},
	// 车辆管理
	VehicleManagement(resolve) {
		require(['../views/LogisticsOrder/VehicleManagement.vue'], resolve)
	},
	// 车辆管理-新增
	VehicleManagementAdd(resolve) {
		require(['../views/LogisticsOrder/VehicleManagementAdd.vue'], resolve)
	},
	// 基数数据-合同类型
	ContractType(resolve) {
		require(['../views/ContractManage/ContractType.vue'], resolve)
	},
	// 基数数据-合同类型-新增
	ContractTypeAdd(resolve) {
		require(['../views/ContractManage/ContractTypeAdd.vue'], resolve)
	},
	// 基数数据-项目管理
	ProjectManage(resolve) {
		require(['../views/ContractManage/ProjectManage.vue'], resolve)
	},
	// 基数数据-项目管理-新增
	ProjectManageAdd(resolve) {
		require(['../views/ContractManage/ProjectManageAdd.vue'], resolve)
	},
	// 合同管理-合同模板起草
	ContractTemplateDraft(resolve) {
		require(['../views/ContractManage/ContractTemplateDraft.vue'], resolve)
	},
	// 合同管理-合同模板起草-新增
	ContractTemplateDraftAdd(resolve) {
		require(['../views/ContractManage/ContractTemplateDraftAdd.vue'], resolve)
	},
	// 合同管理-合同模板审批
	ContractTemplateApproval(resolve) {
		require(['../views/ContractManage/ContractTemplateApproval.vue'], resolve)
	},
	// 合同管理-合同模板查询
	ContractTemplateQuery(resolve) {
		require(['../views/ContractManage/ContractTemplateQuery.vue'], resolve)
	},
	// 物流订单：货物追踪查询
	CargoTrackQuery(resolve) {
		require(['../views/LogisticsOrder/CargoTrackQuery.vue'], resolve)
	},
	// 合同管理-合同模板起草
	ContractDraft(resolve) {
		require(['../views/ContractManage/ContractDraft.vue'], resolve)
	},
	// 合同管理-合同模板起草-新增
	ContractDraftAdd(resolve) {
		require(['../views/ContractManage/ContractDraftAdd.vue'], resolve)
	},
	// 合同管理-合同审批
	ContractApproval(resolve) {
		require(['../views/ContractManage/ContractApproval.vue'], resolve)
	},
	// 合同管理-合同变更申请
	ContractChangeApply(resolve) {
		require(['../views/ContractManage/ContractChangeApply.vue'], resolve)
	},
	// 合同管理-合同变更申请-新增
	ContractChangeApplyAdd(resolve) {
		require(['../views/ContractManage/ContractChangeApplyAdd.vue'], resolve)
	},
	// 合同管理-合同变更申请
	ContractChangeApproval(resolve) {
		require(['../views/ContractManage/ContractChangeApproval.vue'], resolve)
	},
	// 合同管理-合同归档
	ContractArchived(resolve) {
		require(['../views/ContractManage/ContractArchived.vue'], resolve)
	},
	// 合同管理-合同签订
	ContractSign(resolve) {
		require(['../views/ContractManage/ContractSign.vue'], resolve)
	},
	// 调查问卷-企业调查问卷
	Question(resolve) {
		require(["../views/Question/Question.vue"], resolve)
	},
	// 调查问卷-社区调查问卷
	QuestionCommunity(resolve) {
		require(["../views/Question/QuestionCommunity.vue"], resolve)
	},
	// 调查问卷-各部门调查人员明细
	DepartmentDetails(resolve) {
		require(["../views/Question/DepartmentDetails.vue"], resolve)
	},
	// 调查问卷-各部门人员明细
	PersonnelStatistics(resolve) {
		require(["../views/Question/PersonnelStatistics.vue"], resolve)
	},
	// 调查问卷-疫情数据导入
	EpidemicData(resolve) {
		require(["../views/Question/EpidemicData.vue"], resolve)
	},
	// 调查问卷-行程信息
	TravelInformation(resolve) {
		require(["../views/Question/TravelInformation.vue"], resolve)
	},
	// 基础数据-组织架构
	OrganizationalStructure(resolve) {
		require(["../views/BasicData/OrganizationalStructure.vue"], resolve)
	},
	// 基础数据-架构角色
	MemberRole(resolve) {
		require(["../views/BasicData/MemberRole.vue"], resolve)
	},
	// 合同管理-合同台账
	ContractLedgerList(resolve) {
		require(['../views/ContractManage/ContractLedgerList.vue'], resolve)
	},
	// 合同管理-合同变更记录
	ContractChangeRecord(resolve) {
		require(['../views/ContractManage/ContractChangeRecord.vue'], resolve)
	},
	// 基础数据-销售订单分类
	SaleOrderCategory(resolve) {
		require(['../views/BasicData/SaleOrderCategory.vue'], resolve)
	},
	// 基础数据-销售订单分类-新增
	SaleOrderCategoryAdd(resolve) {
		require(['../views/BasicData/SaleOrderCategoryAdd.vue'], resolve)
	},
	// 基础数据-币种管理
	CurrencyManagement(resolve) {
		require(['../views/BasicData/CurrencyManagement.vue'], resolve)
	},
	// 基础数据-币种管理-新增
	CurrencyAdd(resolve) {
		require(['../views/BasicData/CurrencyAdd.vue'], resolve)
	},
	// 基础数据-汇率管理
	ExchangeRate(resolve) {
		require(['../views/BasicData/ExchangeRate.vue'], resolve)
	},
	// 基础数据-汇率管理-新增
	ExchangeRateAdd(resolve) {
		require(['../views/BasicData/ExchangeRateAdd.vue'], resolve)
	},
	// 调查问卷-光明区疫情问卷
	LightAreaQuestionCommunity(resolve) {
		require(["../views/Question/LightAreaQuestionCommunity.vue"], resolve)
	},
	// 调查问卷-光明区疫情数据
	LightAreaQuestionData(resolve) {
		require(["../views/Question/LightAreaQuestionData.vue"], resolve)
	},
	// 销售订单-套料物料需求
	NestingMaterialDemand(resolve) {
		require(['../views/SaleManagement/NestingMaterialDemand.vue'], resolve)
	},
	// 供应商门户- 可发运po列表
	CanShipmentPoList(resolve) {
		require(['../views/SupplierPortal/CanShipmentPoList.vue'], resolve)
	},
	// 基础数据：征信评级
	TenantCredit(resolve) {
		require(['../views/BasicData/TenantCredit.vue'], resolve)
	},
	// 供应商门户-报表导出记录
	ReportExportRecordList(resolve){
		require(['../views/SaleManagement/ReportExportRecordList.vue'], resolve)
	},
	// 系统管理： 数据字典
	DictList(resolve) {
		require(['../views/sys/DictList.vue'], resolve)
	},
	// 吉海湾对账结算： 对账单
	ReconciliationSlips(resolve) {
		require(['../views/JhwReconciliationSettlement/ReconciliationSlipsList.vue'], resolve)
	},
	// 吉海湾对账结算： 对账单编辑
	ReconciliationSlipsAdd(resolve) {
		require(['../views/JhwReconciliationSettlement/ReconciliationSlipsListAdd.vue'], resolve)
	},
	// 吉海湾对账结算： 开票
	ReconciliationSlipsBilling(resolve) {
		require(['../views/JhwReconciliationSettlement/ReconciliationSlipsBilling.vue'], resolve)
	},
	// 吉海湾对账结算： 付款单
	PaymentSlips(resolve) {
		require(['../views/JhwReconciliationSettlement/PaymentSlipsList.vue'], resolve)
	},
	// 吉海湾对账结算： 付款单新增
	PaymentSlipsAdd(resolve) {
		require(['../views/JhwReconciliationSettlement/PaymentSlipsListAdd.vue'], resolve)
	},
	// 吉海湾对账结算： 收款单
	CollectionSlips(resolve) {
		require(['../views/JhwReconciliationSettlement/CollectionSlipsList.vue'], resolve)
	},
	// 吉海湾库存管理： 入库
	StockInList(resolve) {
		require(['../views/JhwInventoryManagement/StockInList.vue'], resolve)
	},
	// 吉海湾库存管理： 入库新增
	StockInAdd(resolve) {
		require(['../views/JhwInventoryManagement/StockInListAdd.vue'], resolve)
	},
	// 吉海湾库存管理： 出库
	IssueList(resolve) {
		require(['../views/JhwInventoryManagement/IssueList.vue'], resolve)
	},
	// 吉海湾库存管理： 出库新增
	IssueAdd(resolve) {
		require(['../views/JhwInventoryManagement/IssueListAdd.vue'], resolve)
	},
	// 吉海湾库存管理： 库存台账
	InventoryAccount(resolve) {
		require(['../views/JhwInventoryManagement/InventoryAccount.vue'], resolve)
	},
	//吉海湾商品管理:商品列表 
	GoodsList(resolve) {
		require(['../views/JhwGoodsManagement/GoodsList.vue'], resolve)
	},
	// 吉海湾商品管理: 商品编码对照
	GoodsContrast(resolve) {
		require(['../views/JhwGoodsManagement/GoodsContrast.vue'], resolve)
	},
	// 吉海湾商品管理: 商品定价
	JHWGoodsPrice(resolve) {
		require(['../views/JhwGoodsManagement/GoodsPrice.vue'], resolve)
	},
	// 吉海湾商品管理: 商品定价表单
	JHWGoodsPriceForm(resolve) {
		require(['../views/JhwGoodsManagement/GoodsPriceForm.vue'], resolve)
	},
	// 吉海湾对账结算： 收款单新增
	CollectionSlipsAdd(resolve) {
		require(['../views/JhwReconciliationSettlement/CollectionSlipsListAdd.vue'], resolve)
	},
	// 吉海湾商品管理: 商品报价表单
	OfferPriceForm(resolve) {
		require(['../views/JhwGoodsManagement/OfferPriceForm.vue'], resolve)
	},
	// 吉海湾客户采购: 收货确认
	ReceiptConfirmation(resolve) {
		require(['../views/JhwCustomerProcurement/ReceiptConfirmationList.vue'], resolve)
	},
	// 吉海湾销售管理: 销售订单
	JhwSalesOrder(resolve) {
		require(['../views/JhwSalesManagement/JhwSalesOrderList.vue'], resolve)
	},
	// 吉海湾销售管理: 销售订单新增
	JhwSalesOrderAdd(resolve) {
		require(['../views/JhwSalesManagement/JhwSalesOrderListAdd.vue'], resolve)
	},
	// 吉海湾销售管理: 发货
	DeliverGoods(resolve) {
		require(['../views/JhwSalesManagement/DeliverGoods.vue'], resolve)
	},
	// 在线选购
	JhwBuyOnline(resolve){
		require(['../views/JhwCustomerPur/JhwBuyOnline.vue'], resolve)
	},
	// 在线选购详情
	JhwBuyOnlineDetail(resolve){
		require(['../views/JhwCustomerPur/JhwBuyOnlineDetail.vue'], resolve)
	},
	// 吉海湾购物车
	JhwBuyCar(resolve){
		require(['../views/JhwCustomerPur/JhwBuyCar.vue'], resolve)
	},
	// 吉海湾预订单
	JhwBookingSheet(resolve){
		require(['../views/JhwCustomerPur/JhwBookingSheet.vue'], resolve)
	},
	// 吉海湾预订单新增
	JhwBookingSheetForm(resolve){
		require(['../views/JhwCustomerPur/JhwBookingSheetForm.vue'], resolve)
	},
	// 吉海湾采购订单
	JhwPurchaseOrder(resolve){
		require(['../views/JhwCustomerPur/JhwPurchaseOrder.vue'], resolve)
	},
	// 吉海湾采购订单form
	JhwPurchaseOrderForm(resolve){
		require(['../views/JhwCustomerPur/JhwPurchaseOrderForm.vue'], resolve)
	},
	// 吉海湾请购单
	JhwPrePurchase(resolve){
		require(['../views/JhwCustomerPur/JhwPrePurchase.vue'], resolve)
	},
	// 吉海湾请购单Form
	JhwPrePurchaseForm(resolve){
		require(['../views/JhwCustomerPur/JhwPrePurchaseForm.vue'], resolve)
	},
	// 吉海湾商品定价（客户）
	JHWCustomerGoodsPrice(resolve){
		require(['../views/JhwGoodsManagement/CustomerGoodsPrice.vue'], resolve)
	},
	// 云平台 交款记录 (头像右上角下拉框进入)
	RecordCashier(resolve){
		require(['../views/sys/RecordCashierList.vue'], resolve)
	},
	// 云平台 登录时弹出交款协议
	DialogIframe(resolve){
		require(["@/components/Dialog/DialogIframe.vue"], resolve)
	},
	// 基础数据 --应付会计管理 主要由系统管理员操作
	ApInfoList(resolve){
		require(["../views/BasicData/ApInfoManage.vue"], resolve)
	},
	// 基础数据 --开票资料 （航信直连开票需要配置）
	SoftwareInfo(resolve){
		require(["../views/BasicData/SoftwareInfo.vue"], resolve)
	},
	// 吉海湾采购退货
	JhwPurchaseReturn(resolve){
		require(['../views/JhwCustomerProcurement/JhwPurchaseReturn.vue'], resolve)
	},
	// 吉海湾已收货单据
	JhwReceivedOrder(resolve){
		require(['../views/JhwCustomerProcurement/JhwReceivedOrder.vue'], resolve)
	},
	// 吉海湾送货
	JhwDeliverGoods(resolve){
		require(['../views/JhwInventoryManagement/JhwDeliverGoods.vue'], resolve)
	},
	// 基础数据 --收费特殊管理 主要由系统管理员操作
	SpecialCharge(resolve){
		require(["../views/BasicData/SpecialCharge.vue"], resolve)
	},
	// 吉海湾商品管理: 供货列表
	JhwSupplyList(resolve) {
		require(['../views/JhwGoodsManagement/JhwSupplyList.vue'], resolve)
	},
	// 吉海湾商品管理: 供货列表-新增
	JhwSupplyAdd(resolve) {
		require(['../views/JhwGoodsManagement/JhwSupplyListAdd.vue'], resolve)
	},
	// 吉海湾报表管理
	DetailReport(resolve) {
		require(['../components/DetailReport.vue'], resolve)
	},
	// 吉海湾收货确认（自采）
	SinceReceiptConfirmation(resolve) {
		require(['../views/JhwCustomerProcurement/SinceReceiptConfirmation.vue'], resolve)
	},
}

