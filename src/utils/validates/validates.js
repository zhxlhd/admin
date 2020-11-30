/**
 * 表单校验
 * created by zhongxiaolong on 2019/08/28
 */

/**
 * 姓名校验 由2-10位汉子组成
 */
export function validateUsername(str) {
  const reg = /^[\u4e00-\u9fa5]{2,10}$/;
  return reg.test(str);
}

/**
 * 手机号校验(移动电话)
 * *13[0-9], 14[5,7], 15[0, 1, 2, 3, 5, 6, 7, 8, 9], 17[0, 1, 3, 6, 7, 8], 18[0-9],16[2567], 19[139]
 * *移动号段: 134,135,136,137,138,139,150,151,152,157,158,159,182,183,184,187,188,147,178,1705
 * *联通号段: 130,131,132,155,156,185,186,145,176,166,1709
 * *电信号段: 133,153,180,181,189,177,1700,191,198,199
 */
export function validateMobile(str) {
  const reg = /^(0|86|17951)?(13[0-9]|14[57]|15[012356789]|16[2567]|17[013678]|18[0-9]|19[189])[0-9]{8}$/;
  return reg.test(str);
}
/**
 * 电话号校验(座机)
 */
export function validatePhone(str) {
  const reg = /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/;
  return reg.test(str);
}

/**
 *  邮箱校验 
 */
export function validateEmail(str) {
  if(!String(str && str.trim() || '')) return true; // 邮箱为空不校验
  const reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  return reg.test(str);
}
/**
 *  原注册页面邮箱校验 
 */
export function validatePositiveEmail(str) {
  // if(!String(str.trim())) return true; // 邮箱为空不校验
  const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
  return reg.test(str);
}

/**
 *  身份证校验 
 */
export function validateID(str) {
  const reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
  return reg.test(str);
}

/**
 *  邮政编码校验 
 */
export function validateZipCode(str) {
  const reg = /^[1-9]\d{5}(?!\d)$/;
  return reg.test(str);
}

/**
 * 正整数校验
 */
export function validateInteger(str){
  const reg = /^[1-9]\d*$/;
  return reg.test(str);
  // return Number.isInteger(str);
}

/**
 * 两位小数校验
 */
  export function validateFloatTwo(str){
    // const reg = /^([0-9][0-9]*)+(.[0-9]{1,2})?$/;
    const reg = /^\d+(\.\d{1,2})?$/;
    return reg.test(str);
  }

/**
 * 数字校验
 */
  export function validateNaN(str){
    // const reg = /^\d*\.{0,1}\d{0,1}$/;
    // return reg.test(str);
    return !Number.isNaN(str);
  }

/**
 * 大于等于0整数数校验
 */
  export function validateNumber(str){
    const reg = /^\d+$/;
    return reg.test(str);
  }

/**
 * 校验税率超出异常
 */
  export function validateTax(num){
    // const reg = /^\d*\.{0,1}\d{0,1}$/;
    // return reg.test(str);
    return Number(num)<=17;
  }

/**
 * 1到100之间的整数校验
 */
export function validateIntegerRange(str){
  const reg = /^(1|([1-9]\d{0,1})|100)$/;
  return reg.test(str);
}

/**
 * 不能为空校验
 */
export function validateEmpty(str){
  const reg = /^\s*$/;
  return reg.test(str);
}

/**
 * 密码校验
 * 至少含一个大写字母,一个小写字母,一个数字,一个特殊字符的8-16位密码 中英文特殊字符
 */
export function validatePassword(str){
  // const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,16}$/;
  const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、])[A-Za-z\d`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]{8,16}$/;
  return reg.test(str);
}

/**
 * 匹配URL
 */
export function validateUrl(str){
  const reg = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;
  return reg.test(str);
} 
