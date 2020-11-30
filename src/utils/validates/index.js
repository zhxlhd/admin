/*created by zhongxiaolong on 2019/08/28*/
import * as Validates from './validates.js'

/**
 * 生成表格自定义校验函数
 * @param {(String|Array)} key 校验规则名称
 * @param {(String|Array)} msg 校验提示语
 *  @param {Object} rule 校验字段
 *  @param {Any} value 校验的值
 *  @param {Object} cb 校验回调
 */
export const formValidateGene = (key, msg) => (rule, value, cb) => {
  if (Validates[key](value)) {
    cb();
  } else {
    cb(new Error(msg));
  }
}
