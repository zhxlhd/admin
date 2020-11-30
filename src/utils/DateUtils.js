
/**
 * 时间格式化
 * @param {String} formatter
 * @param {String} date
 * dateFormatter('YYYY-MM-DD HH:mm', '1995/02/15 13:55') // 1995-02-15 13:55
 */
export function dateFormatter(formatter, date){
  date = (date ? new Date(date) : new Date)
  const Y = date.getFullYear() + '',  // 年
        M = date.getMonth() + 1,      // 月
        D = date.getDate(),           // 日
        H = date.getHours(),          // 时
        m = date.getMinutes(),        // 分
        s = date.getSeconds();        // 秒
  return formatter.replace(/YYYY|yyyy/g, Y)
                  .replace(/YY|yy/g, Y.substr(2, 2))
                  .replace(/MM/g, (M < 10 ? '0' : '') + M)
                  .replace(/DD/g, (D < 10 ? '0' : '') + D)
                  .replace(/HH|hh/g, (H < 10 ? '0' : '') + H)
                  .replace(/mm/g, (m < 10 ? '0' : '') + m)
                  .replace(/ss/g, (s < 10 ? '0' : '') + s);
}