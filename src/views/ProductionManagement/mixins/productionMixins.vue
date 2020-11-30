<script>
export default {
  props: {

  },
  data () {
    return {
      stateOptions:[
        {id: '0', label: '新建', value: 'SAVE'},
        {id: '1', label: '待审批', value: 'SUBMIT'},
        {id: '2', label: '已审批', value: 'PASS'},
        {id: '3', label: '已驳回', value: 'REJECT'},
        {id: '4', label: '已实施', value: 'DEPLOY'}
      ], // 配置查询状态选项
      oldMaterialsCode: '',
      dialogVisible: false
    }
  },
  computed: {
    
  },
  watch: {
  },
  methods: {
    /**
     * 查看详情关闭
     */
    closeDialog () {
      this.dialogVisible = false;
    },
  }
}
</script>