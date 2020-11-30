import router from '../router'
import env from '@/config/index.js'
export default {
	methods: {
		handleAction(act, row = {}, func) {
			if (act.confirm) {
					const self = this
				this.handleConfirm(act, row, function() {
					if (row.status !== 0) {
						if (act.action === 'disableSelected') {
							row.status = 1
						}
					}
					// if (row.status !== 0) {
					//   if (act.action === 'audit') {
					//     row.status = 1
					//   }
					// }
					self.action(act, row, func)
				})
			} else {
				this.action(act, row, func)
			}
		},
		action(act, row, func = null) {
			// 替换url中表达式{w+}
			if (act.switch) {
				act.url = act['urls'][Number(row[act.switchKey])]
			}
			let url = act.url
			const reg = /{(\w+)}/ig
			url.replace(reg, function(s, value) {
				url = url.replace(s, row[value])
			})

			const vm = this
					// 用于form提交
			if (act.ajax) {
				this.ajaxData(act.url, row, function(data) {
					const next = data.next || act.next || false
					if (next) { // 操作完成后跳转
						vm.$root.monitor({ url: next })
					}
				}, act.method)
				return
			}
			// 带id跳转
			if (act.useId !== -1) {
				// let path = act.key || 'id'
				// url = url + '/' + path + '/' + row.id
				if (url.indexOf('?') > -1) {
					url = url + row.id
				} else {
					url = url + '/' + row.id
				}
			}

			// 用于在线按钮
			if (act.isApi) {
				//  租户启用和禁用按钮
				if (act.action === 'disable') {
					if (row.status === 0) {
						this.ajaxData(url + '?status=1', {}, func, act.method)
						return
					} else if (row.status === 1) {
						this.ajaxData(url + '?status=0', {}, func, act.method)
						return
					}
				}

				// 租户审核按钮
				if (row.status === 0 || row.status === 1) {
					this.ajaxData(url + '?status=' + row.status, {}, func, act.method)
					return
				}
				this.ajaxData(url, {}, func, act.method)
				return
			}
			this.$root.monitor({ url: url, method: act.method })
		},
		handleConfirm(act, row, func) {
			this.$confirm(act.confirm.msg, this.$t('toast.prompt'), {
				confirmButtonText: act.confirm.confirmButtonText,
				cancelButtonText: act.confirm.cancelButtonText,
				type: 'warning'
		}).then(func).catch(() => {
				if (act.action === 'disableSelected') {
					row.status = 0
					this.action(act, row, func)
					return
				}
				if (act.action === 'audit') {
					row.status = 0
					this.action(act, row, func)
					return
				}
				this.$message({
					type: 'info',
					message: this.$t('toast.canceled')
				})
			})
		},
		// 仅仅是ajax动作
		ajaxData(url, param = {}, func = null, method) {
			method = method || 'GET'
			if (url.indexOf('http://') === -1 && url.indexOf('https://') === -1 || url.indexOf('fdfs')) {
					url = this.BASEAPI + url
			}
			const option = {
					method: method,
					url: url
			}
			if (method === 'POST' || method === 'PUT') {
					option.body = param
			} else {
					option.params = param
			}
			// var vm = this
			this.$http(option).then((response) => {
					try {
							var data = response.body || response
							if (data.status && Number(data.status) < 0) {
									this.$message({
													// title: '注意',
													type: 'warning',
													message: data.message || this.$t('toast.opfailed')
											})
											// 新加的，用于提交按钮致灰
							} else if (data.code === 500) {
									this.$message({
													//  title: '消息',
													type: 'warning',
													message: data.message
											})
											// 获取后处理信息
									if (func !== null) {
											func(data)
									}
							} else {
									if (method !== 'GET') {
											if (data.resultParam !== '1') {
													this.$message({
															//  title: '消息',
															type: 'success',
															duration: 3000,
															message: data.message || this.$t('toast.opcompleted')
													})
											}
									}
									// 获取后处理信息
									if (func !== null) {
											func(data)
									}
							}
					} catch (err) {
							console.log(err)
							console.log('数据解析失败')
					}
			}, (response) => {
				console.log(response)
				if (response.data.status === -999) { // 服务器繁忙
					var content = response.data.message
					this.$notify({
						title: '友情提示',
						message: content,
						duration: 10000,
						offset: 45,
						type: 'warning'
					})
				} else {
					let errStr = '系统错误，请稍后再试！'
					if (response.status === 401) {
						errStr = '会话已过期，请重新登录！'
						window.localStorage.removeItem('token')
						window.localStorage.removeItem('user')
						window.localStorage.setItem('unlogin', 'unlogin')
						sessionStorage.removeItem('token')
						sessionStorage.removeItem('user')
						localStorage.removeItem('settlement') // 缓存中的结算单都要清空
						window.location.href = `${env.API_GATEWAY}/uaa/oauth/exit`
					}
					this.$message({
						// title: '注意',
						type: 'warning',
						message: response.body.message || errStr
					})
				}
			}).catch(error => {
				console.log('error', error)
			})
		}
	}
}
