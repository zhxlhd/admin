<!-- created by fengjing on 2020/07/03 -->
<!-- 嵌入帆软-->
<template>
  <div>
    <iframe  name="myframe"  frameborder="0" scrolling="auto" width="100%" :height="height"  :src="srcUrl" ></iframe>
  </div>
</template>
<script>
export default {
  data(){
    return{
      srcUrl: '',
      height: window.screen.height*0.6
    }
  },
  props: {
		mate: Object
  },
  computed: {
    height() {
      return document.body.clientHeight*0.6;
    }
  },
  mounted() {
    this.init();
  },
  created(){

  },
  methods:{
    // 根据元数据配置帆软地址
    init() {
      var tenantId = JSON.parse(window.sessionStorage.getItem('user')).tenantId;
      this.srcUrl = `${this.mate.mateList.dataApi}&tenantId=${tenantId}`;
    },
  },
  watch:{
    mate: function (val) {
      var tenantId = JSON.parse(window.sessionStorage.getItem('user')).tenantId;
      this.srcUrl = `${this.mate.mateList.dataApi}&tenantId=${tenantId}`;
    }
  }
}
</script>
<style scoped>
</style>
