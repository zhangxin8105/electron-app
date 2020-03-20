import { getTech as getTechDatas } from "./tech";

function getMill() {
  let total = Math.floor((new Date().getTime() % 86400000) + 28800000);
  let t9_30 = 34200000; //new Date("2020-01-01 09:30:00") - new Date("2020-01-01 00:00:00");
  let t11_30 = 41400000; // new Date("2020-01-01 11:30:00") - new Date("2020-01-01 00:00:00");
  let t13_00 = 46800000; //new Date("2020-01-01 13:00:00") - new Date("2020-01-01 00:00:00");
  let t15_00 = 54000000; // new Date("2020-01-01 15:00:00") - new Date("2020-01-01 00:00:00");
  if (total <= t9_30) return 0;
  if (total < t11_30) return total - t9_30;
  if (total <= t13_00) return t11_30 - t9_30;
  if (total <= t15_00) return total - t13_00 + t11_30 - t9_30;
  if (total > t15_00) return t15_00 - t13_00 + t11_30 - t9_30;
}
window.getMill = getMill;
let timeRatio = 0;
let turnover = 0;
setInterval(() => {
  timeRatio = getMill() / 1000;
  turnover = timeRatio * 0.000138;
}, 2000);
function isMacdGolden(techData) {
  return (
    techData.MACD.length > 3 &&
    techData.MACD[techData.MACD.length - 1].bar > 0 &&
    techData.MACD[techData.MACD.length - 1].bar >
      techData.MACD[techData.MACD.length - 2].bar &&
    techData.MACD[techData.MACD.length - 2].bar >
      techData.MACD[techData.MACD.length - 3].bar &&
    (techData.MACD[techData.MACD.length - 3].bar < 0 ||
      techData.MACD[techData.MACD.length - 4].bar < 0 ||
      techData.MACD[techData.MACD.length - 5].bar < 0)
  );
}
function isMacdDeath(techData) {
  let len = techData.MACD.length;
  return (
    len > 3 &&
    techData.MACD[len - 1].bar < 0 &&
    techData.MACD[len - 1].bar < techData.MACD[len - 2].bar &&
    techData.MACD[len - 2].bar < techData.MACD[len - 3].bar
  );
}
const techMap = {
  DU: function({ item, kd, kw, km }) {
    return (
      kd.MACD.length > 4 &&
      kd.MACD[kd.MACD.length - 1].bar > kd.MACD[kd.MACD.length - 2].bar &&
      item.now > item.open
    );
  },
  D: function({ item, kd, kw, km }) {
    return isMacdGolden(kd);
  } /*
  "0&D": function({ item, kd, kw, km }) {
    return isMacdGolden(kd) && Math.abs(kd.MACD[kd.MACD.length - 1].dif) < 0.1;
  },*/,

  WU: function({ item, kd, kw, km }) {
    return (
      km.MACD.length > 4 &&
      kw.MACD[kw.MACD.length - 1].bar > kw.MACD[kw.MACD.length - 2].bar &&
      kw.datas[kw.MACD.length - 1].close > kw.datas[kw.MACD.length - 1].open
    );
  },
  W2: function({ item, kd, kw, km }) {
    return (
      km.MACD.length > 4 &&
      kw.MACD[kw.MACD.length - 1].bar > kw.MACD[kw.MACD.length - 2].bar &&
      kw.MACD[kw.MACD.length - 2].bar >= kw.MACD[kw.MACD.length - 3].bar &&
      kw.MACD[kw.MACD.length - 3].bar >= kw.MACD[kw.MACD.length - 4].bar &&
      kw.MACD[kw.MACD.length - 3].bar <= 0 &&
      kw.MACD[kw.MACD.length - 1].bar > -0.05 &&
      kw.MACD[kw.MACD.length - 1].bar > kw.MACD[kw.MACD.length - 2].bar
    );
  },
  自动过滤: function({ item, kd, kw, km }) {
    return (
      kw.MACD.length > 4 &&
      !(
        kw.MACD[kw.MACD.length - 1].bar < 0 &&
        kw.MACD[kw.MACD.length - 2].bar < 0 &&
        kw.MACD[kw.MACD.length - 3].bar <= 0
      ) &&
      (kw.datas[kw.MACD.length - 2].close > kw.datas[kw.MACD.length - 2].open ||
        kw.datas[kw.MACD.length - 1].close >
          kw.datas[kw.MACD.length - 1].open) &&
      kw.MACD[kw.MACD.length - 1].bar > kw.MACD[kw.MACD.length - 2].bar
    );
  }
  /*,
  "D&B": function({ item, kd, kw, km }) {
    let boll = kd.BOLL;
    if (boll && boll.length > 5) {
      let arr = boll;
      let i = arr.length - 1;
      //连续下跌，MA20反转信号
      let nrValue = (arr[i].upper - arr[i].lower) / arr[i].boll;
      let kd5 = kd.datas.slice(-5);
      let boll5 = boll.slice(-5);
      if (
        (nrValue < 0.1 &&
          ((Math.min.apply(
            null,
            kd5.map(e => e.low)
          ) <=
            Math.max.apply(
              null,
              boll5.map(e => e.lower)
            ) &&
            Math.max.apply(
              null,
              kd5.map(e => e.high)
            ) >=
              Math.min.apply(
                null,
                boll5.map(e => e.boll)
              )) ||
            kd.datas[i].low > arr[i].upper)) ||
        kd.now >= arr[i].boll
      ) {
        return true;
      }
    }
    return false;
  } 
  B: function({ item, kd, kw, km }) {
    let boll = kd.BOLL;
    if (boll) {
      let arr = boll;
      let i = arr.length - 1;

      if (
        item.now >= arr[i].boll &&
        item.turnover > turnover &&
        item.now > item.open
      ) {
        return true;
      }
    }
    return false;
  },
  三小: function({ item, kd, kw, km }) {
    let datas = kd.datas;
    if (datas && datas.length > 3) {
      let len = datas.length;
      if (
        datas[len - 1].close - datas[len - 1].open > 0 &&
        datas[len - 2].close - datas[len - 2].open > 0 &&
        datas[len - 3].close - datas[len - 3].open > 0 &&
        datas[len - 1].percent >= 0 &&
        datas[len - 2].percent >= 0 &&
        datas[len - 3].percent >= 0 &&
        datas[len - 1].percent < 0.03 &&
        datas[len - 2].percent < 0.03 &&
        datas[len - 3].percent < 0.03 &&
        datas[len - 1].percent +
          datas[len - 2].percent +
          datas[len - 3].percent <
          0.05
      ) {
        return true;
      }
    }
    return false;
  },

  W: function({ item, kd, kw, km }) {
    return isMacdGolden(kw);
  }
  M: function({ item, kd, kw, km }) {
    return isMacdGolden(km);
  },*/

  /*粘多: function({ item, kd, kw, km }) {
    //5,10,20日三线粘合 {取1%振幅内粘合}
    let m = item.now;
    if (kd.MA.length < 30) return false;
    let ma = kd.MA[kd.MA.length - 1];
    let ma1 = kd.MA[kd.MA.length - 2];
    let m5 = ma.ma5;
    let m10 = ma.ma10;
    let m20 = ma.ma20;
    let x1 = m5 / m10 - 1 < 0.01;
    let x2 = m5 / m20 - 1 < 0.01;
    let x3 = m10 / m20 - 1 < 0.01;

    //AA:=MA(C,5)>REF(MA(C,5),1);BB:=MA(C,10)>REF(MA(C,10),1);CC:=MA(C,5)>MA(C,10);{均线勾头向上}
    let aa = m5 > ma1.ma5;
    let bb = m10 > ma1.ma10;
    let cc = m20 > ma1.ma20;

    return x1 && x2 && x3 && aa && bb && cc;
  },
  Deth: function({ item, kd, kw, km }) {
    return isMacdDeath(kd);
  }*/
};

export function buildFilters() {
  let filters = {};
  for (let name in techMap) {
    filters[name] = function(items) {
      return items.filter(e => e[`_${name}`]);
    };
  }
  return filters;
}
export async function callFun(item, chooseDate) {
  let techDatas = await getTechDatas(item);
  if (chooseDate) {
    let ntechDatas = {};
    for (let p of ["kd", "kw", "km"]) {
      let i = techDatas[p].datas.filter(d => d.day <= chooseDate).length;
      let nk = techDatas[p].datas.slice(0, i);
      ntechDatas[p] = {};
      for (let k in techDatas[p]) {
        if (k == "datas") ntechDatas[p][k] = nk;
        else {
          ntechDatas[p][k] = techDatas[p][k].slice(0, nk.length);
        }
      }
    }
    techDatas = ntechDatas;
    let citem = ntechDatas.kd.datas.slice(-1);
    item = Object.assign(item, { now: citem.close });
    item = Object.assign(item, citem);
    techDatas.item = item;
  }

  for (let name in techMap) {
    techDatas.item = item;
    item[`_${name}`] = techMap[name](techDatas);
  }
}
