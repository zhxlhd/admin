<template>
  <div>
    <el-dialog title="请选择分配用户" :visible.sync="responsibleDialogVisible" width="30%" :before-close="closeResponsibleDialog">
      <el-form v-if="reRenderResponsible" :rules="responsibleRules" ref="responsibleForm" :model="responsibleData">
        <el-form-item label="分配给" prop="chargeId">
          <el-select
            v-model="responsibleData['chargeId']"
            @change="changeHandle(responsibleData['chargeId'])"
            ><el-option :label="item.label" :value="item.value" v-for="item of usersList" :key="item.name"></el-option>
            </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="DialogClickOK()">{{$t('BUTTON_TEXT.CONFIRM')}}</el-button>
        <el-button type="primary" @click="closeResponsibleDialog()">{{$t('BUTTON_TEXT.CANCEL')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data(){
    return{}
  },
  props:{

  }
}
</script>