// 此文件是处理.vue文件的配置文件
'use strict'
// 导入utils.js工具
const utils = require('./utils')
// 导入config文件夹下的index.js
const config = require('../config')
// 判断是不是生产环境
const isProduction = process.env.NODE_ENV === 'production'
// 根据环境来获取相应的productionSourceMap或者cssSourceMap
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap

// 导出
module.exports = {
  loaders: utils.cssLoaders({
    // 是否开始sourceMap 用来调试
    sourceMap: sourceMapEnabled,
    // 是否单独提取抽离css
    extract: isProduction
  }),
  // 记录压缩的代码，用来找到源码位置
  cssSourceMap: sourceMapEnabled,
  // 是否缓存破坏
  cacheBusting: config.dev.cacheBusting,
  // transformToRequire的作用是在模块编译的过程中，编译器可以将某些属性，比如src转换为require调用
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
