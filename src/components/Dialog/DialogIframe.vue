<template>
	<div>
		<el-dialog :visible.sync="recordDialogVisible" width="80%" :show-close="showClose" :close-on-click-modal="closeOnClickModal" :before-close="closeDialog">
			<iframe :src="iframeUrl" class="my-iframe"  width="100%"
			height="100%"  name="showHere" scrolling=auto></iframe>
			<el-button type="text" @click="openDetail">收费标准协议书</el-button>
			<span slot="footer" class="dialog-footer">
				<el-button @click="recordDialogVisible = false" size="mini" v-if="isHome">取 消</el-button>
				<el-button type="primary" @click="cancleDialog" size="mini" v-if="btnStatus==2">不同意</el-button>
				<el-button type="primary" @click="sureDialog" size="mini"  >确 定</el-button>
			</span>
		</el-dialog>
		<el-dialog :visible.sync="reasonDialogVisible" :close-on-click-modal="false">
			<el-input
				type="textarea"
				placeholder="请输入不同意原因"
				v-model="reasonDetail"
				>
			</el-input>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="sureReasonDialog" size="mini">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
export default {
  props: {
	  btnStatus:String,
		iframeUrl: String, // 引入路径
		agreementUrl: String, // 协议标准路径
		recordDialogVisible: {     
			type: Boolean,
      default: true
		},
		showClose: {  
			type: Boolean,
      default: true
		},
		closeOnClickModal: {  
			type: Boolean,
      default: true
		},
		isHome: {
			type: Boolean,
      default: false
		}
	},
	data(){
		return{
			reasonDialogVisible: false,
			reasonDetail: ''
		}
	},
	methods: {
		/** 
     * 关闭弹窗并发射事件和数据给父组件
     * @return void
     */
    closeDialog() {
      // this.$emit("handleConfirm");
		},
		/**
		 * 弹出框确认
		 */
		sureDialog(){
			this.$emit("handleConfirm");
		},
		/**
		 * 不同意协议
		 */
		cancleDialog(){
			this.reasonDialogVisible = true
			this.reasonDetail = ''
		},
		/**
		 * 不同意原因确认
		 */
		sureReasonDialog(){
		
			if(this.reasonDetail){
				if(this.reasonDetail.length > 40 ){
					this.$message({
						message: '不同意原因字数要少于40字',
						type: 'warning',
						duration: 5000
					})
				}else{
					this.$emit("handleCancle",this.reasonDetail);
					this.reasonDialogVisible = false
				}
				
			} else {
				this.$message({
					message: '请填写不同意协同原因',
					type: 'warning',
					duration: 5000
				})
			}
		},
		/**
		 * 收费协议
		 */
		openDetail(){
			window.open(this.agreementUrl)
		}
	}
}
</script>
<style scoped>
.my-iframe {
  width: 100%;
  height:600px;
 }
</style>