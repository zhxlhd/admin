<!-- created by hezhiqiang on 2020/03/16 -->
<!-- 套料物料需求 -->
<template>
  <div>
    <!-- headTable Start -->
    <KTableList
      :mate="mate"
      :mateSearch="mate.mateSearch"
      ref="listTable"
      @btnClick="handleButtons"
      @rowClick="rowClick"
      @isSelected="handleSelected"
      @resetLineTable="showDetailTable=false"
    />
    <!-- headTable END -->
    <!-- detailTable Start -->
    <KTableLine
      v-if="showDetailTable"
      :mate="mate.mateListLine"
      ref="lineTable"
      @btnClick="handleButtons"
      @actionSelected="lineRowSelected"
      :btnDisable="btnDisable"
      :actDisable="actDisable"
    />
    <!-- detail End -->
    <!-- orderLine Start -->
    <el-dialog title="订单行信息" width="80%" :visible.sync="tableDialogVisible" :before-close="DialogClose" >
      <el-button size="mini" style="margin-top: 10px;" @click="DialogClose">关闭</el-button>
      <KTableLine
        :mate="orderLine.mateList"
        @action="handleActions"
      />
    </el-dialog>
    <!-- orderLine End -->
    <!--materialForm Start-->
    <el-dialog title="物料信息" width="70%" :visible.sync="formDialogVisible" append-to-body :before-close="formDialogClose" >
      <dynamic-form
        ref="headForm"
        :mate="mate.mateFormerHeader" 
        :rules="headerFormRules"
        :eventCfg="headerFormEventConfig" 
        @events="handleEvents"
        :orgId="lineOrgId"
      />
      <el-row type="flex" justify="start">
        <el-button size="mini" @click="submitForm">{{$t('BUTTON_TEXT.CONFIRM')}}</el-button>
        <el-button size="mini" @click="formDialogClose">{{$t('BUTTON_TEXT.CANCEL')}}</el-button>
      </el-row>
    </el-dialog>
    <!--materialForm End-->
  </div>
</template>
<script>
import KTableList from '@/components/table/KTableList'
import KTableLine from '@/components/table/KTableLine'
import SERVICES from '@/services'
import { SALE_MANAGE_API } from "@/services/apis"

export default {
  components: {
    KTableList,
    KTableLine,
    MainTable: function index(resolve) {
      require(["@/components/table/MainTable.vue"], resolve);
    },
    DynamicForm: function index(resolve){
      require(["@/components/form/DynamicForm.vue"], resolve);
    },
    MaterialSearch: function index (resolve) {
      require(['@/components/MaterialSearch.vue'], resolve)
    }
  },
  data(){
    return {
      showDetailTable: false,     // 是否渲染明细行表格
      headRowId: '',              // 头行id
      multipleSelection: [],      // 多选
      hasSelected: false,
      btnDisable: false,
      actDisable: false,
      tableDialogVisible: false,  // 获取订单行信息 弹框
      orderLine: {                // 订单行数据
      },              
      formDialogVisible: false,   // 物料信息表单 弹框
      lineOrgId: '',              // 组织 id
      agoMaterialCode: '',        // 保存选择的物料编码
      headerFormEventConfig: {
        materialCode: {blur: true}
      },
      headerFormRules: {
        // 物料编码
        materialCode: [
					{required: true, trigger: ['blur','change'], message:"此项不能为空"}
				],
      },
      selectedLines: [],         // 勾选明细行
      hasMaterialDemand: false,  // 料需求是否已存在
    }
  },
  props: {
    mate: Object
  },
  created (){
    this.init();
  },
  mounted () {
    let _this = this
    this.$bus.on('getMaterialData', function (params) {
      _this.agoMaterialCode = params.materialsCode
      this.$set(_this.mate.mateFormerHeader.values,'materialCode',_this.agoMaterialCode)
      this.$set(_this.mate.mateFormerHeader.values,'materialName',params.materialsName)
      this.$set(_this.mate.mateFormerHeader.values,'materialSpecs',params.specs)
      this.$set(_this.mate.mateFormerHeader.values,'materialUnit',params.unit)
      this.$set(_this.mate.mateFormerHeader.values,'minPackageQty',params.snp)
      this.$set(_this.mate.mateFormerHeader.values,'materialId',params.materialId)
    })
  },
  beforeDestroy  () {
    this.$bus.off('getMaterialData', {})
  },
  watch: {
    mate: function (newMate) {
      this.init();
    }
  },
  methods: {
    /**
     * 数据初始化
     * @param void
     * @return void
     */
    init () {
      this.showDetailTable = false;
      this.mate.mateList.rowClick = true; // 允许单击列表行请求行数据
    },
    /**
     * 展开明细行列表，并获取对应明细行数据
     * @param {Object} 当前点击行 id
     * @return void
     */
    rowClick (row) {
      this.headRowId = row.id
      // 渲染明细行表格
      this.showDetailTable = true
      // 获取明细行数据
      this.getDetailList()
    },
    /**
     * 多选控制
     * @param {Boolean} bool 是否有勾选
     * @param {Array} selectedArr 勾选行数据数组
     * @return void
     */
    handleSelected (bool, selectedArr) {
      this.hasSelected = bool;
      this.multipleSelection = selectedArr;
      if (this.hasSelected) {
        this.checkMaterialDemand();     // 判断物料需求是否已存在
      }
    },
    /**
     * checkbox 勾选计算 拿到勾选的序号数组
     * param {Boolean} hasSelected 是否有勾选
     * param {Array} multipleSelection 勾选数组 
     * @return void
     */
    lineRowSelected(hasSelect, multipleSelection) {
      this.selectedLines = multipleSelection
    },
    /**
     * 获取明细行数据
     * @param {object} 点击行的 id数据
     * @return void
     */
    getDetailList () {
      SERVICES.NESTING_MATERIAL.getDetailList(this.headRowId).then(res => {
        if (res.data == null) {
          this.$set(this.mate.mateListLine, 'rows', []) 
        }else {
          this.$set(this.mate.mateListLine, 'rows', res.data)
        }
      })
    },
    /**
     * 头部按钮控制
     * 点击按钮触发对应方法
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @param {Array} selection 勾选行数据
     * @return void
     */
    handleButtons (btn, row, selection) {
      this.multipleSelection = selection;
      let action = btn.action;
      const btnEvents = {
        getOrderLine: () => this.getOrderLine(btn, row),          // 新增
        generate: () => this.generate(btn, row),                  // 生成物料需求
        deleteDemand: () => this.deleteDemand(btn, row),          // 删除物料需求
        checkStock: () => this.checkStock(btn, row),              // 检查物料库存
        editOrderLine: () => this.editOrderLine(btn, row),        // 修改
        deleteOrderLine: () => this.deleteOrderLine(btn, row),    // 删除
        exportData: (btn, rowId) => this.handleExport(btn),       // 导出
        default: () => { return }
      }
      return (btnEvents[action] || btnEvents.default)(btn, row);
    },
    /**
     * actions 操作
     * 点击 action 根据按钮配置的 action 做对应操作
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
     */
    handleActions (act, row) {
      let action = act && act.action;
      const actions = {
        selectOrder: (act, row) => this.selectOrder(act, row),
        default: () => { return }
      }
      return (actions[action] || actions.default)(act, row);
    },
    /**
     * /** 动态表单事件管理
     * @param {String} event 事件名称
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return void
     */
    handleEvents(event, val, name) {
      const eventControl = {
        blur: (val, name) => this.handleBlur(val, name),
        default: () => { return }
      }
      return (eventControl[event] || eventControl.default)(val, name);
    },
     /** change 事件
     * @param {Any} val 控件的值
     * @param {String} name 控件的 name
     * @return {Function} change事件执行函数
     */
    handleChange(val, name) {
      this.isDirty = true;
      const changeControl = {
        materialCode: (val) => this.materialCodeBlur(val),
        default: () => { return }
      }
      return (changeControl[name] || changeControl.default)(val);
    },
    /**
     * 新增 获取订单行数据
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    getOrderLine (btn, row) {
      let multipleSelection = this.multipleSelection;
      // 只能勾选一条数据
      if (multipleSelection.length !== 1) {
        this.$message({
          message: this.$t("seladata"),
          type: "warning"
        });
        return;
      }
      // 获取订单行弹框列表数据
      SERVICES.NESTING_MATERIAL.getOrderLineData(multipleSelection[0].id).then(res => {
        if(res.status === 200) {
          this.orderLine = res.data.mate
        }
        // 拿到数据后再渲染组件 避免报错 2020-05-28
        this.tableDialogVisible = true
      })
    },
    /**
     * 生成物料需求
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    generate (btn, row) {
      let multipleSelection = this.multipleSelection;
      // 只能勾选一条数据
      if (multipleSelection.length !== 1) {
        this.$message({
          message: this.$t("seladata"),
          type: "warning"
        });
        return;
      }
      SERVICES.NESTING_MATERIAL.generateMaterialDemand(multipleSelection[0].id).then(res => {
        if (res.status === 200) {
          if (res.data.statusCode === 40061) {
            this.$message({
              type: 'warning',
              message: '订单已生成套料，请勿重复提交'
            })
          } else if (res.data.statusCode === 40062) {
            this.$message({
              type: 'warning',
              message: '订单行无套料'
            })
          } else if (res.data.statusCode === 200) {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
          }
        }
      })
    },
    /**
     * 判断物料需求是否已存在
     */
    checkMaterialDemand () {
      SERVICES.NESTING_MATERIAL.checkMaterialDemand(this.multipleSelection[0].id).then(res => {
        this.hasMaterialDemand = res.data
      })
    },
    /**
     * 删除物料需求
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    deleteDemand (btn, row) {
      let multipleSelection = this.multipleSelection;
      // 只能勾选一条数据
      if (multipleSelection.length !== 1) {
        this.$message({
          message: this.$t("seladata"),
          type: "warning"
        });
        return;
      }
      if (this.hasMaterialDemand == false) {
        this.$message({
          type: 'warning',
          message: '订单行无套料'
        })
        return
      }
      this.$confirm(
        this.$t("TIPS_WARNING.IRREVERSIBLE_DELETION"),
        this.$t("TITLE_TEXT.TIPS"),
        {
          confirmButtonText: this.$t("BUTTON_TEXT.CONFIRM"), // 确认
          cancelButtonText: this.$t("BUTTON_TEXT.CANCEL"), // 取消
          type: "warning"
        }
      ).then(() => {
        SERVICES.NESTING_MATERIAL.deleteMaterialDemand(multipleSelection[0].id).then(res => {
          let status = res.data.statusCode
          if (status === 200) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.reRenderList()
          }
        })
      }).catch(() => {
        this.$message({
          type: "info",
          message: this.$t("TIPS_WARNING.CANCEL_DELETION") // 已取消删除
        });
      });
    },
    /**
     * 检查物料库存
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    checkStock (btn, row) {
      let multipleSelection = this.multipleSelection;
      // 只能勾选一条数据
      if (multipleSelection.length !== 1) {
        this.$message({
          message: this.$t("seladata"),
          type: "warning"
        });
        return;
      }
      SERVICES.NESTING_MATERIAL.checkMaterialStock(multipleSelection[0].id).then(res => {
        if (res.status == 200) {
          const h = this.$createElement;
          this.$message({
            type: 'success',
            message: h('p', null, [
              h('span', null, '更新库存物料行数： '),
              h('i', { style: 'color: green ' }, res.data.data)
            ])
          })
          this.reRenderList()
        }
      })
    },
    /**
     * 修改订单明细行
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    editOrderLine (btn, row) {
      let selectedLines = this.selectedLines;      
      if (selectedLines.length !== 1) {
        this.$message({
          message: this.$t("seladata"),
          type: "warning"
        });
        return;
      }
      this.formDialogVisible = true
      SERVICES.NESTING_MATERIAL.orderLineEdit(selectedLines[0].id).then(res => {
        this.mate.mateFormerHeader.values = res.data
      })
    },
    /**
     * 删除订单明细行
     * @param {Object} btn 当前点击的按钮配置信息
     * @param {Object} row 勾选行 id数据  row.id
     * @return void
     */
    deleteOrderLine (btn, row) {
      let selectedLines = this.selectedLines
      // ids 存放勾选多行的id
      let ids = []
      selectedLines.forEach(item => {
        ids.push(item.id)
      })
      if (ids.length > 0) {
      this.$confirm(
        this.$t("TIPS_WARNING.IRREVERSIBLE_DELETION"),
        this.$t("TITLE_TEXT.TIPS"),
        {
          confirmButtonText: this.$t("BUTTON_TEXT.CONFIRM"), // 确认
          cancelButtonText: this.$t("BUTTON_TEXT.CANCEL"), // 取消
          type: "warning"
        }
      ).then(() => {
        SERVICES.NESTING_MATERIAL.orderLineDelete(ids).then(res => {
          if (res.status === 200) {
            this.$message({
              type: "success",
              message: this.$t("TIPS_WARNING.DELETE_SUCCESS")
            });
            this.getDetailList();
          }else{
            this.$message({
                type: "warning",
                message: this.$t("TIPS_WARNING.DELETE_FAIL")
            });
          }
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: this.$t("TIPS_WARNING.CANCEL_DELETION") // 已取消删除
        });
        });
      }else {
        this.$message({
          type: "warning",
          message: this.$t("TIPS_WARNING.CANNOT_BE_DELETED") // 不能删除
        });
      }
    },
    /**
     * 导出整个列表 
     * 导出列表 可根据查询条件导出列表
     * @param {Object} btn 当前点击的按钮配置信息
     * @return void
     */
    handleExport (btn) {
      let geteway = this.BASEAPI;
      let url = btn.url;
      let param = {
        'id' : this.headRowId
      };
      if (!url) {
        alert('导出功能尚未完成,请稍后再试。');
        return;
      }
      this.$http({
        url: `${geteway}${url}`,
        method: btn.method,
        headers: {
          'Authorization': `Bearer +${window.sessionStorage.getItem('token')}`,
          'Accept': 'application/json',
          'X-TenantId': JSON.parse(window.sessionStorage.getItem('user')).tenantId,
          'Content-Type': 'application/json;charset=utf8'
        },
        responseType: 'arraybuffer',
        body: param
      }).then(function(response) {
        let blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
        // new Blob(size,type) Blob构造函数，接受两个参数。第一个参数是一个包含实际数据的数组，第二个参数是数据的类型
        let objectUrl = URL.createObjectURL(blob)
        let a = document.createElement('a')
        document.body.appendChild(a)
        a.setAttribute('style', 'display:none')
        a.setAttribute('href', objectUrl)
        a.setAttribute('download', btn.fileName)
        a.click()
        URL.revokeObjectURL(objectUrl)
      },function (response){
        this.$message({
          message: "导出失败，请联系管理员。",
          type: "error"
        });
      })
    },
    /**
     * 订单行弹框 关闭
     * @param void
     * @return void
     */
    DialogClose() {
      this.tableDialogVisible = false
    },
    /**
     * 订单行弹框列表 选择
     * @param {Object} act 当前操作按钮配置信息
     * @param {Object} row 当前操作行数据
     * @return void
     */
    selectOrder(act, row) {
      this.formDialogVisible = true
      this.mate.mateFormerHeader.values = {}
      this.$set(this.mate.mateFormerHeader.values,'soLineId',row.id)
      this.$set(this.mate.mateFormerHeader.values,'soHeaderId',row.soHeaderId)
      this.$set(this.mate.mateFormerHeader.values,'soNum',row.soNum)
      this.$set(this.mate.mateFormerHeader.values,'soLineNum',row.lineno)
      this.$set(this.mate.mateFormerHeader.values,'isJacking',row.isJacking)
      this.$set(this.mate.mateFormerHeader.values,'isSpareParts',row.isSpareParts)
      this.$set(this.mate.mateFormerHeader.values,'itemCode',row.itemCode)
      this.$set(this.mate.mateFormerHeader.values,'itemName',row.itemName)
      this.$set(this.mate.mateFormerHeader.values,'orderQty',row.qty)
      this.$set(this.mate.mateFormerHeader.values,'itemUnit',row.unit)
      this.$set(this,'lineOrgId',row.orgId)
    },
    /** 
     * 物料编码修改
     * @param {String} val 起始时间
     * @return void
     */
    materialCodeBlur(val, name) {
      if (val.materialCode !== this.agoMaterialCode) {
        this.$set(_this.mate.mateFormerHeader.values,'materialName',{})
        this.$set(_this.mate.mateFormerHeader.values,'materialSpecs',{})
        this.$set(_this.mate.mateFormerHeader.values,'materialUnit',{})
      }
    },
    /**
		 * 提交表单数据
		 * @param void
		 * @return void
		 */
    submitForm () {
      let mate = {};
			let _this = this;
			this.$refs['headForm'].$refs['form'].validate(valid => {
				if (valid) {
          mate = this.mate.mateFormerHeader.values;
          let OrderId = mate.id
          /**
           * 新增保存
           */
          if (!OrderId) {
            SERVICES.NESTING_MATERIAL.formSave(mate).then((res) =>{
              let status = res.status;
              if(status === 200){
                if (res.data.statusCode === 40063) {
                  _this.$message({
                    message: '物料不能为成品',
                    type: 'warning'
                  })
                } else if (res.data.statusCode === 200){
                  _this.$message({
                    message: '操作成功',
                    type: 'success'
                  })
                  this.formDialogVisible = false
                }
              }else{
                _this.$message({
                    type: "warning",
                    message: this.$t("TIPS_WARNING.ADD_FAIL")
                });
              }
            }).catch(function (err) {
            });
          } 
          /**
           * 修改保存
           */
          else {
            SERVICES.NESTING_MATERIAL.formSave(mate).then((res) =>{
            let status = res.status;
              if(status === 200){
                if (res.data.statusCode === 40063) {
                  _this.$message({
                    message: '物料不能为成品',
                    type: 'warning'
                  })
                } else if (res.data.statusCode === 200){
                  _this.$message({
                    message: '操作成功',
                    type: 'success'
                  })
                  this.formDialogVisible = false
                  this.getDetailList()
                }
              }else{
                _this.$message({
                    type: "warning",
                    message: this.$t("TIPS_WARNING.ADD_FAIL")
                });
              }
          }).catch(function (err) {
          });
          }
				};
			});
    },
    /**
		 * 表单界面 取消
		 * @param void
		 * @return void
		 */
    formDialogClose () {
      this.formDialogVisible = false
    },
    /**
     * 重新渲染列表页
     * @param void
     * @return void
     */
    reRenderList() {
      this.$root.monitor({ url: SALE_MANAGE_API.NESTING_MATERIAL_DEMAND_LIST});
    },
  }
}
</script>

