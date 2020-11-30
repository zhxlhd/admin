<template>
  <div>
    
  </div>
</template>
<script>
import querystring from 'querystring'
import env from '@/config/index.js'
export default {
  data () {
    return {
      client_id: 'sbuSAHt01SbnftB4',
      client_secret: 'Az4tM5Uyo4dqc6rHdZVhGPgRDpSpxiMXFwaT+6pF54=',
      // client_id: 'clcpClient1',
      // client_secret: 'clcpsecret1',
      scope: ['all'], // Grants access to read a user's profile data.
      state: 'oauth2',
      authorizationUri: `${env.API_GATEWAY}/uaa/oauth/authorize`,
      accessTokenUri: `${env.API_GATEWAY}/uaa/oauth/token`,
      logoutUri: `${env.API_GATEWAY}/uaa/oauth/exit`,
      getUserURl: `${env.API_GATEWAY}/user`,
      redirectUri: `${env.AUTH_CALLBACK_DOMAIN}/login`,
      code: null,
      accessToken: null,
      signState: false
    }
  },
  mounted: function () {
    if(localStorage.getItem('user')){
      this.$router.push('/')
    }
    if(this.$route.hash.indexOf('exit=1') !== -1){
      this.logout()
    } else if(this.$route.hash.indexOf('access_token=') !== -1){
        let params = querystring.parse(this.$route.hash.substr(1))
        
        this.accessToken = params['access_token'];
        sessionStorage.setItem('token', this.accessToken)
        localStorage.setItem('token', this.accessToken)
        this.getUser();
    }
    if(!localStorage.getItem('token')){
      let ClientOAuth2 = require('client-oauth2')
      let sccpAuth = new ClientOAuth2({
        clientId: this.client_id,
        clientSecret: this.client_secret,
        accessTokenUri: this.accessTokenUri,
        authorizationUri: this.authorizationUri,
        redirectUri: this.redirectUri,
        scopes: this.scope,
        state: 'dianlian'
      })
      window.location.href = sccpAuth.token.getUri()
      localStorage.setItem('authUrl', sccpAuth.token.getUri())
      this.signState = true
    }
  },
  methods: {
    getUser: function () {
      this.$http.get(this.getUserURl)
        .then((response) => {
          this.signState = true
          localStorage.setItem('user', JSON.stringify(response.data))
          sessionStorage.setItem('user', JSON.stringify(response.data))
          this.$router.push('/')
        })
        // invaild accessToken
        .catch((error) => {
          console.log(error)
          this.$cookie.delete('accessToken')
      })
    },
    logout: function () {
      this.$http.get(this.logoutUri)
        .then((response) => {
          this.signState = false
          this.$cookie.delete('accessToken')
          this.signState = false
          //this.$emit('logoutEvent')
          window.location.href = localStorage.getItem('authUrl')
        })
        // invaild accessToken
        .catch((error) => {
          console.log(error)
          this.$cookie.delete('accessToken')
      })
    }
  }
}
</script>
