import _ from 'underscore'
/**
 * 数组比较
 */
export function difference (a1, a2) {
  var a2Set = new Set(a2)
  return a1.filter(function (x) { return !a2Set.has(x) })
}

export function symmetricDifference (a1, a2) {
  return difference(a1, a2).concat(difference(a2, a1))
}

export function shallowDiff (a, b) {
  var r = {}
  _.each(a, function (v, k) {
    if (b[k] === v) return
    // but what if it returns an empty object? still attach?
    r[k] = _.isObject(v) ? _.diff(v, b[k]) : v
  })
  return r
}

function deepDiff (a, b, r) {
  _.each(a, function (v, k) {
    // already checked this or equal...
    if (r.hasOwnProperty(k) || b[k] === v) return
    // but what if it returns an empty object? still attach?
    r[k] = _.isObject(v) ? _.diff(v, b[k]) : v
  })
}

  /* the function */
export function diff (a, b) {
  var r = {}
  deepDiff(a, b, r)
  deepDiff(b, a, r)
  return r
}

export function getLang () {
  return window.sessionStorage.getItem('prefer-lang') || navigator.language || navigator.browserLanguage || 'zh-CN'
}

export const indexOfArrayObject = function (arr, obj, prop) {
  let index = -1
  arr.some(function (val, ind) {
    if (val[prop] === obj[prop]) {
      index = ind
      return true
    }
  })
  return index
}

export function DateFormat (date, fmt) {
  try {
    var o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'H+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      'S': date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (var k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
    return fmt;
  } catch (e) {
    return date;
  }
}

/**
 * 日期时间补零 小于10前面补零
 */
export function dateFormatZero (s) {
  return s < 10 ? '0' + s : s;
}

export function trimSpace (str) {
  try {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
  } catch (e) {
    return str
  }
}

export function isPositiveinteger (val) {
  var reg = new RegExp('^[0-9]*[0-9][0-9]*$')
  return reg.test(val)
}

export function isPositivenumber (val) {
  var reg = new RegExp('^(([1-9]+[0-9]*.{1}[0-9]+)|([0].{1}[1-9]+[0-9]*)|([1-9][0-9]*)|([0][.][0-9]+[1-9]*))$')
  return reg.test(val)
}

export function isPositiveuser (val) {
  var reg = new RegExp('^[A-Za-z0-9]{3,16}$')
  return reg.test(val)
}
export function isPositiveEmail (val) {
  var reg = new RegExp('^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$')
  return reg.test(val)
}
export function isPositivePassword (val) {
  var reg = new RegExp('^(?![^A-Za-z]+$)(?![^0-9]+$)[\x21-\x7e]{8,16}$')
  return reg.test(val)
}
export function isZh (val) {
  var reg = new RegExp('^[\u4E00-\u9FA5]+$')
  return reg.test(val)
}
/**
 * downloadFile：base64数据导出文件，文件下载
 * 
 */
export function downloadFile(filename, data){
  let DownloadLink = document.createElement('a');

  if ( DownloadLink ){
    document.body.appendChild(DownloadLink);
    DownloadLink.style = 'display: none';
    DownloadLink.download = filename;
    DownloadLink.href = data;

    if ( document.createEvent ){
      let DownloadEvt = document.createEvent('MouseEvents');
      DownloadEvt.initEvent('click', true, false);
      DownloadLink.dispatchEvent(DownloadEvt);
    }else if ( document.createEventObject ){
      DownloadLink.fireEvent('onclick');
    }else if (typeof DownloadLink.onclick == 'function' ){
      DownloadLink.onclick();
    }
    document.body.removeChild(DownloadLink);
  }
}
/**
 * 筛选ids从数组里面
 *
 */
export function pickIdsFromList(list) {
  let idsList = [];
  for(let i=0;i<list.length;i++) {
    idsList.push(list[i].id)
  }
  return idsList;
}

/**
 * 生成随机UID
 * genUid() ;l`yCPc9A8IuK}?N6,%}
 */
export function genUid(){
  let length = 20;
  let soupLength = genUid.soup_.length;
  let id = [];
  for (var i = 0; i < length; i++) {
    id[i] = genUid.soup_.charAt(Math.random() * soupLength);
  }
  return id.join('');
}
genUid.soup_ = '!#$%()*+,-./:;=?@[]^_`{|}~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * 防抖
 * 执行 debounce 函数返回新函数
 * 防抖:当持续触发某事件时，一定时间间隔内没有再触发事件时，事件处理函数才会执行一次，如果设定的时间间隔到来之前，又一次触发了事件，就重新开始延时。
 * @param {Function} fn 执行函数
 * @param {Number} wait 防抖时间
 * @return 节流防抖函数
 * !用法
 * ?<el-input @input="handleDebounce($event)"> </el-input>
 * ?import { debounce } from '@/utils/util.js';
 * ?created() {
 * ?  this.$watch('query', debounce((newQuery) => {
 * ?    this.$emit('query', newQuery)
 * ?  }, 200))
 * ? }
 * ?methods: {
 * ?  handleDebounce(e){
 * ?    debounce(() => {
 * ?    console.log('search input')
 * ?    },1000)
 * ?  },
 * ?}
 */
let timeout = null;
export function debounce(fn, wait = 1000){
  if(timeout !== null) clearTimeout(timeout)
  timeout = setTimeout(fn, wait)
}
/**
 * 节流
 * 执行 throttle 函数返回新函数
 * 节流:当持续触发事件时，有规律的每隔一个时间间隔执行一次事件处理函数。
 * !防抖和节流都可以用于 mousemove、scroll、resize、input等事件，
 * !他们的区别在于防抖只会在连续的事件周期结束时执行一次，
 * !而节流会在事件周期内按间隔时间有规律的执行多次。
 * @param {Function} fn 执行函数
 * @param {Number} wait 防抖时间
 * @return 节流防抖函数
 * !用法
 * ?const betterFn = throttle(() => console.log('fn 节流执行了'), 1000) 每一秒才执行一次
 * ?window.addEventListener('scroll', betterFn)
 * 
 * ?created() {
 * ?  this.$watch('query', throttle((newQuery) => {
 * ?    this.$emit('query', newQuery)
 * ?  }, 200))
 * ? }
 */
let _prev = Date.now()
export function throttle(fn, delay = 1000){
  return function() {
    let _now = Date.now();
    if (_now - _prev > delay) {
      fn()
      _prev = Date.now()
    }
  }()
}
/** arr to obj  数组对象转化为对象 如下
 * [
 *  { key: 'CN', display_name: 'China' },
 *  { key: 'US', display_name: 'USA' },
 * ]
 *  to
 *  { CN : "China", US : "USA" }
 */
export function arrayToObject(arr){
  return arr.reduce((obj, cur) => {
    obj[cur.key] = cur.display_name;
    return obj;
  }, {})
}

/** 默认日期为当天
 * @param void
 * @return {String} detaultDate
 */
export function dateInit() { // 日期初始化 默认当前日期
  let date = new Date();
  let defaultDate = `${date.getFullYear()}-${dateFormatZero((date.getMonth() + 1))}-${dateFormatZero((date.getDate()))}`;
  return defaultDate;
}
/**
 * 正整数校验
 */
export function validateInteger(str){
  const reg = /^[1-9]\d*$/;
  return reg.test(str);
  // return Number.isInteger(str);
}
/** 通过 id/value 找 name
 * @param {String} id 选项的 value 
 * @param {Array} arr 选项列表
 * @return {String} label 选项的 label
 */
export function getNameById (id, arr){
  // 判断 arr 是不是数组
  if (Object.prototype.toString.call(arr)== '[object Array]'){
    // 拿到 id 对应的选项
    let item = arr.find(item => item.value == id);
    // 如果存在 id 对应的选项
    if (item) {
      // 返回选项的 label
      return item.label
    }
  }
}
/** 获取url参数
 * @param {String} name
 */
export function getUrlKey(name){
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
}

/** 数据类型判断 
 * @param {Any} data 需要判断类型的数据
 * @return {String} dataType 数据类型判断
 * ? getType("a") // string
 * ? getType(1) // number
 * ? getType(window) // window
 * ? getType(document.querySelector("h1")) // element
*/
export function getType(data){
  let toString = Object.prototype.toString;
  let dataType = data instanceof Element
      ? "element" // 为了统一DOM节点类型输出
      : toString
          .call(data)
          .replace(/\[object\s(.+)\]/, "$1")
          .toLowerCase()
  return dataType;
}

/**
 * 获取 get 请求 url 中 参数的值
 * @param {String} url 请求地址
 * @param {String} name 参数名称
 */
export function getQuery(url, name){
  const index = url.indexOf('?');
  if(index != -1){
    const queryStrArr = url.subStr(index + 1).split('&');
    for(let i = 0;i < queryStrArr.length; i++){
      const itemArr = queryStrArr[i].split('=');
      if(itemArr[0] === name){
        return itemArr[1];
      }
    }
  }
  return null
}
/**
 * 驼峰转下划线 lowerLine --> lower_line
 * @param {String} str 
 * @return {String} temp 下划线拼接
 */
export function toLowerLine(str) {
  var temp = str.replace(/[A-Z]/g, function (match) {
    return "_" + match.toLowerCase();
  });
  if(temp.slice(0,1) === '_'){ //如果首字母是大写，执行replace时会多一个_，这里需要去掉
    temp = temp.slice(1);
  }
  return temp;
};
/**
 * 下划线转驼峰 lower_line --> lowerLine
 * @param {String} str 
 * @return {String} str
 */
export function toCamel(str) {
  return str.replace(/([^_])(?:_+([^_]))/g, function ($0, $1, $2) {
    return $1 + $2.toUpperCase();
  });
}
/**
 * 通过遍历树获取级联选择器的级联对象
 * @param {Array，String} list 需要递归的数组，筛选条件id
 * @return {Object}
 */
export function getUnit(list,id) {
  for(let i = 0; i < list.length; i++){
    if (list[i].value == id) {
      return list[i];
    }
    if (list[i].children && list[i].children !== null) {
      if(getUnit(list[i].children,id) && getUnit(list[i].children,id) !== null){
        return getUnit(list[i].children,id);
      }
    }
  }
}


/**
 * 过滤对象中为空的属性
 * @param obj
 * @returns {*}
 */
export function filterObj(obj) {
  if (!(typeof obj == 'object')) {
    return;
  }

  for ( var key in obj) {
    if (obj.hasOwnProperty(key)
      && (obj[key] == null || obj[key] == undefined || obj[key] === '')) {
      delete obj[key];
    }
  }
  return obj;
}
