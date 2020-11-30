const modulesFiles = require.context('../services', true, /\.js$/);

const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const modulePathArr = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1').split("/");
  const moduleName = modulePathArr[modulePathArr.length - 1].toUpperCase();
  const value = modulesFiles(modulePath);
  if(modules[moduleName] == undefined){
    modules[moduleName] = value.default;
  }else {
    alert(`${moduleName}已存在,请重新命名服务!`)
  }
  return modules;
}, {})

export default modules;
