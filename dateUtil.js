/**
 * Defination
 * Date扩展组件
 * Author: Sisiliu
 * Date: 2015/8/5.
 */

;(function (root, undefined) {

    var dateUtil = {

        StringToDate : StringToDate,
        StringToTime : StringToTime,
        DateToString : DateToString,
        StringToString : StringToString,

        isLeepYear : isLeepYear,
        daysBetween: daysBetween,

        addYears : addYears,
        addMonths : addMonths,
        addWeeks : addWeeks,
        addDays : addDays,
        addHours : addHours,
        addMinutes : addMinutes,
        addSeconds : addSeconds,
        addMilliseconds : addMilliseconds

    };

    /**********************FORMAT START*************************************************************/
    //转日期（+时间）
    function StringToDate(dateStr){

        //要支持 年开头，分隔，月，分隔，日
        var RE1 = /^(\d{4})[-:,/.\s"年"](\d{1,2})[-:,/.\s"月"](\d{1,2})\D*((\d{1,2})[:"时"](\d{1,2})[:"分"](\d{1,2})["秒"]?\s*([ap]m)?)?/;
        //20150312123056
        var RE2 = /^(\d{4})(\d{2})(\d{2})\D*((\d{2})(\d{2})(\d{2})?\s*([ap]m)?)?/;

        if(RE1.test(dateStr)){
            var Y = RegExp.$1;
            var M = RegExp.$2;
            var D = RegExp.$3;
            var t = new Date(Y,M-1,D);
            if(RegExp.$4){
                var h = RegExp.$5;
                var m = RegExp.$6;
                var s = RegExp.$7;
                var r = RegExp.$8;
                if(r=="pm"&&h<12){
                    t.setHours(parseInt(h)+12);
                }else{
                    t.setHours(h);
                }
                t.setMinutes(m);
                t.setSeconds(s);
            }
            return t;
        }else if(RE2.test(dateStr)) {
            var Y = RegExp.$1;
            var M = RegExp.$2;
            var D = RegExp.$3;
            var t = new Date(Y,M-1,D);
            if(RegExp.$4){
                var h = RegExp.$5;
                var m = RegExp.$6;
                var s = RegExp.$7;
                var r = RegExp.$8;
                if(r=="pm"&&h<12){
                    t.setHours(parseInt(h)+12);
                }else{
                    t.setHours(h);
                }
                t.setMinutes(m);
                t.setSeconds(s);
            }
            return t;
        }else{
            return false;
        }
    }

    //单纯的转时间
    function StringToTime(timeStr){

        //要支持 时，分，秒
        var RE = /^(\d{1,2})[:"时"](\d{1,2})[:"分"](\d{1,2})["秒"]?\s*([ap]m)?$/;
        if(RE.test(timeStr)){
            var h = RegExp.$1;
            var m = RegExp.$2;
            var s = RegExp.$3;
            var r = RegExp.$4;
            var t = new Date();
            if(r=="pm"&&h<12){
                t.setHours(parseInt(h)+12);
            }else{
                t.setHours(h);
            }
            t.setMinutes(m);
            t.setSeconds(s);
            return t;
        }else{
            return false;
        }
    }

    //从时间转成任意格式字符串,date为date对象
    //---------------------------------------------------
    // 日期格式化
    // 格式 YYYY/yyyy/YY/yy 表示年份
    // MM/M 月份
    // W/w 星期
    // dd/DD/d/D 日期
    // hh/HH/h/H 时间
    // mm/m 分钟
    // ss/SS/s/S 秒
    //---------------------------------------------------
    function DateToString(date,fmt){

        var str = fmt;

        var Week = ['日', '一', '二', '三', '四', '五', '六'];

        str = str.replace(/yyyy|YYYY/, date.getFullYear());
        str = str.replace(/yy|YY/, (date.getYear() % 100) > 9 ? (date.getYear() % 100).toString() : '0' + (date.getYear() % 100));

        str = str.replace(/MM/, date.getMonth() > 8 ? (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1));
        str = str.replace(/M/g, date.getMonth());

        str = str.replace(/w|W/g, Week[date.getDay()]);

        str = str.replace(/dd|DD/, date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate());
        str = str.replace(/d|D/g, date.getDate());

        str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours());
        str = str.replace(/h|H/g, date.getHours());
        str = str.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes().toString() : '0' + date.getMinutes());
        str = str.replace(/m/g, date.getMinutes());

        str = str.replace(/ss|SS/, date.getSeconds() > 9 ? date.getSeconds().toString() : '0' + date.getSeconds());
        str = str.replace(/s|S/g, date.getSeconds());

        return str;

    }

    //从时间字符串转成任意格式字符串
    function StringToString(dateStr,fmt){

        var t = StringToDate(dateStr);
        t = DateToString(t,fmt);
        return t;

    }
    /**********************FORMAT END*************************************************************/

    /**********************CALCULATE START*************************************************************/

    //判断是否是闰年，闰年返回1，非闰年返回0
    function isLeepYear (year){
        return (year%4 ==0 && year%100!=0);
    }

    //+---------------------------------------------------
    //| 求两个时间的天数差,第二天减第一天
    //+---------------------------------------------------
    function daysBetween(DateOne, DateTwo) {

        if(Object.prototype.toString.call(DateOne) === "[object String]"){
            DateOne = StringToDate(DateOne);
        }
        if(Object.prototype.toString.call(DateTwo) === "[object String]"){
            DateTwo = StringToDate(DateTwo);
        }
        DateOne.setHours(0);
        DateOne.setMinutes(0);
        DateOne.setSeconds(0);
        DateTwo.setHours(0);
        DateTwo.setMinutes(0);
        DateTwo.setSeconds(0);
        return (Date.parse(DateTwo) - Date.parse(DateOne)) / 86400000;
    }

    function addYears(date,num){

        if(Object.prototype.toString.call(date) === "[object String]"){
            date = StringToDate(date);
        }
        var y = date.getFullYear();
        var m = date.getMonth();
        var d = date.getDate();
        //如果是2月29，要确定那一年有没有2月29
        if(m==2&&d==29){
            if(!isLeepYear(y+num)){
                return false;
            }
        }
        date.setFullYear(y+num);
        return date

    }

    function addMonths(date,num){

        if(Object.prototype.toString.call(date) === "[object String]"){
            date = StringToDate(date);
        }
        var y = date.getFullYear();
        var m = date.getMonth();
        var d = date.getDate();
        var dm = num%12;
        var dy = (num-dm)/12;
        y=y+dy;
        m=m+dm;
        var date2 = new Date(y,m,1);
        var d_date2 = maxDayOfDate(date2);
        if(d_date2<d){
            return false;
        }
        date2.setDate(d);
        return date2;

    }

    function addWeeks(date,num){

        if(Object.prototype.toString.call(date) === "[object String]"){
            date = StringToDate(date);
        }
        return addDays(date,num*7);
    }

    function addDays(date,num){

        if(Object.prototype.toString.call(date) === "[object String]"){
            date = StringToDate(date);
        }
        var day = date.getDate();
        date.setDate(day + num);
        return date;

    }

    function addHours(date,num){

        if(Object.prototype.toString.call(date) === "[object String]"){
            date = StringToDate(date);
        }
        var hour = date.getHours();
        date.setHours(hour + num);
        return date;

    }

    function addMinutes(date,num){

        if(Object.prototype.toString.call(date) === "[object String]"){
            date = StringToDate(date);
        }
        var minute = date.getMinutes();
        date.setMinutes(minute + num);
        return date;

    }

    function addSeconds(date,num){

        if(Object.prototype.toString.call(date) === "[object String]"){
            date = StringToDate(date);
        }
        var second = date.getSeconds();
        date.setSeconds(second + num);
        return date;

    }

    function addMilliseconds(date,num){

        if(Object.prototype.toString.call(date) === "[object String]"){
            date = StringToDate(date);
        }
        var millisecond = date.getMilliseconds();
        date.setMilliseconds(millisecond + num);
        return date;

    }

    //+---------------------------------------------------
    //| 取得当前日期所在月的最大天数
    //+---------------------------------------------------
    function maxDayOfDate(date)
    {
        var date1 = date;
        date1.setDate(1);
        var y = date1.getFullYear();
        var m = date1.getMonth();
        var date2 = new Date(y,m+1,1);
        return daysBetween(date1,date2);
    }

//+---------------------------------------------------
//| 取得当前日期所在周是一年中的第几周
//+---------------------------------------------------
    function WeekNumOfYear ()
    {
        var myDate = this;
        var ary = myDate.toArray();
        var year = ary[0];
        var month = ary[1]+1;
        var day = ary[2];
        document.write('< script language=VBScript\> \n');
        //document.write('myDate = DateValue(''+month+'-'+day+'-'+year+'') \n');
        //document.write('result = DatePart('ww', myDate) \n');
        document.write(' \n');
        return result;
    }

    /**********************CALCULATE END*************************************************************/

    //抛出模块
    /* --- Module Definition --- */

    // Export accounting for CommonJS. If being loaded as an AMD module, define it as such.
    // Otherwise, just add `accMath` to the global object
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = dateUtil;
        }
        exports.dateUtil = dateUtil;
    } else if (typeof define === 'function' && define.amd) {
        // Return the library as an AMD module:
        define([], function () {
            return dateUtil;
        });
    } else {
        // Use accounting.noConflict to restore `accMath` back to its original value.
        // Returns a reference to the library's `accMath` object;
        // e.g. `var numbers = accMath.noConflict();`
        dateUtil.noConflict = (function (oldAccounting) {
            return function () {
                // Reset the value of the root's `accMath` variable:
                root.dateUtil = oldAccounting;
                // Delete the noConflict method:
                dateUtil.noConflict = undefined;
                // Return reference to the library to re-assign it:
                return dateUtil;
            };
        })(root.dateUtil);

        // Declare `fx` on the root (global/window) object:
        root['dateUtil'] = dateUtil;
    }

})(this);