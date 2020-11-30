import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

const modulesFiles = require.context('./modules', true, /\.js$/);

const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {})
// 创建store对象
const store = new Vuex.Store({
  modules
})
// 导出
export default store
