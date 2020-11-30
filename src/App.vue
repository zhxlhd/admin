<template>
	<div id="app">
		<transition name="fade" mode="out-in">
				<router-view></router-view>
		</transition>
	</div>
</template>

<script>
export default {
  name: 'app',
  created () {
    // var CrossStorageClientFather = require('cross-storage')
    // var CrossStorageHub = CrossStorageClientFather.CrossStorageHub
    // CrossStorageHub.init([
		// 	{ origin: /.*/, allow: ['get', 'set', 'del', 'getKeys', 'clear'] }])
  }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss">
body {
	margin: 0px;
	padding: 0px;
	/*background: url(assets/bg1.jpg) center !important;
	background-size: cover;
	background: #1F2D3D;*/
	font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
	-webkit-font-smoothing: antialiased;
}
body{
  overflow: hidden;
}
#app {
	position: absolute;
	top: 0px;
	bottom: 0px;
  width: 100%;
  font-size: 12px;
  color: #333;
}

.el-submenu [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}

.el-menu-item [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}

.toolbar {
	background: #f2f2f2;
	padding: 10px;
	border:1px solid #dfe6ec;
	margin: 10px 0px;
	.el-form-item {
		margin-bottom: 10px;
	}
}

.fade-enter-active,
.fade-leave-active {
	transition: all .2s ease;
}

.fade-enter,
.fade-leave-active {
	opacity: 0;
}

/******* multiselect overwrite start ***********/
.multiselect__tags {
    padding: 0px 40px 0 5px;
    min-height: 25px;
    max-height: 36px;
    border: 1px solid #bfcbd9;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  }
  .multiselect__option {
    padding: 0 12px;
    min-height: 16px;
    max-height: 36px;
    line-height: 36px;
  }
  .multiselect__select {
    height: 36px;
  }
	.multiselect {
		min-height: 0;
	}
	.el-form-item {
    margin: 15px 20px 2px 0px;
}
	/******* multiselect overwrite end ***********/
</style>
