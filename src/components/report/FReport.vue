<template>
  <iframe ref="iframe" id="reportFrame" allowtransparency="true" style="background-color=transparent" title="report" frameborder="0" width="100%" scrolling="no" height="500" :src="reportUri"></iframe>
</template>
<script>
export default {
  name: 'FReport',
  props: {
    mate: Object
  },
  data () {
    return {}
  },
  mounted () {
    this.setFrameHeight()
  },
  computed: {
    reportUri () {
      const parts = this.mate.url.split('?')
      // 租户过滤
      const user = JSON.parse(window.sessionStorage.getItem('user')) || {}
      return parts[0] + '?tenantId=' + user.tenantId + '&' + this.cjkEncode(parts[1].replace('/', '%2'))
    }
  },
  methods: {
    cjkEncode (text) {
      if (text == null) {
        return ''
      }
      var newText = ''
      for (var i = 0; i < text.length; i++) {
        var code = text.charCodeAt(i)
        if (code >= 128 || code === 91 || code === 93) { // 91 is "[", 93 is "]".
          newText += '[' + code.toString(16) + ']'
        } else {
          newText += text.charAt(i)
        }
      }
      return newText
    },
    setFrameHeight () {
      let iframeHeight = 550
      const iframe = document.getElementById('reportFrame')
      if (iframe) {
        var iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow
        if (iframeWin.document.body) {
          iframeHeight = iframeWin.document.documentElement.scrollHeight || iframeWin.document.body.scrollHeight
        }
      }
      iframe.style.height = iframeHeight + 'px'
    }
  }
}
</script>
