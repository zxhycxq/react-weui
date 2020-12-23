import dayjs from 'dayjs';
let isLeapYear = require('dayjs/plugin/isLeapYear');
dayjs.extend(isLeapYear);

const curYear = dayjs().format('YYYY');
const tmpArr = [];
// 产生月数
const generateMonthArr = (year, column) => {
    let tmpFillArr = Array(12).fill(0);
    let tmpMonthArr = [];
    let isYearMonthDay = column === 3;
    tmpFillArr.map((item, idx)=>{
        tmpMonthArr.push({
            'name': `${idx + 1}月`,
            'code': `${idx}`,
            'sub': isYearMonthDay ? generateDayArr(year, idx + 1, idx) : ''
        });
    });
    return tmpMonthArr;
};
// 月份
let is30days = [4, 6, 9, 11];
let is31days = [1, 3, 5, 7, 8, 10, 12];
// 产生天数
const generateDayArr = (year, month, i) => {
    let tmpFillArr = Array(31).fill(0);
    let isLeapYear = dayjs(`${year}`).isLeapYear();
    console.log('%c--isLeapYear, year-- ', 'color:blue;', isLeapYear, year);
    let tmpDayArr = [], finalDaysArr = [];
    if (is30days.includes(month)) {
        finalDaysArr = tmpFillArr.slice(0, 30);
    } else if (is31days.includes(month)) {
        finalDaysArr = tmpFillArr;
    } else {
        finalDaysArr = isLeapYear ? tmpFillArr.slice(0, 29) : tmpFillArr.slice(0, 28);
    }
    finalDaysArr.map((item, idx)=>{
        tmpDayArr.push({
            'name': `${idx + 1}日`,
            'code': `${idx}`
        });
    });
    return tmpDayArr;
};

// 以1946为基准（iOS 最低为这个时间）
let i = 1946;

const generateYearArr = (curYear, column) => {
    let yearGap = curYear - i + 1;
    let tmpFillArr = Array(yearGap).fill(0);
    let tmpMonthArr = [];
    tmpFillArr.map((item, idx)=>{
        let curYear = i + idx;
        tmpMonthArr.push({
            'name': `${curYear}年`,
            'code': `${curYear}`,
            'sub': generateMonthArr(curYear, column)
        });
    });
    return tmpMonthArr;
};
// *  yearAndMonth 出生日期
// *  yearMonthDay 年月日
const yearAndMonthData = generateYearArr(curYear, 2);
const yearMonthDay = generateYearArr(curYear, 3);

export default { yearMonthDay, yearAndMonthData };
