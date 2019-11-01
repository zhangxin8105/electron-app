import { loadScripts } from "./utils";
import { getTechDatas } from "./tech";
import { getTables, attachData } from "./getTable";

let queue = Promise.resolve();
export function isNotTradeTime() {
  let d = new Date();
  let h = d.getHours();
  let m = d.getMinutes();
  if (h < 9 || h > 15) return true;
  if (h == 9 && m < 30) return true;
  if (h == 11 && m > 30) return true;
  if (h > 11 && h < 13) return true;
  if (h > 15) return true;
  return false;
}
let loadscript = loadScripts(["/static/js/sf_sdk.js"]);
export async function monitor(items) {
  await loadscript;
  for (let i = 0; i < items.length; i++) {
    let item = items[i];

    attachData(item);

    queue = queue.then(() => {
      return getTechDatas(item);
    });

    let name = "tdatas" + item.code;
    if (!window[name]) {
      window[name] = [];
      let resp = await new Promise((resolve, reject) => {
        KKE.api(
          "datas.t.get",
          {
            symbol: item.code
          },
          function(resp) {
            resolve(resp);
          }
        );
      });

      item.avgzs = item.upArgCount = 0;

      let datas = (window[name] = resp.data.td1.filter(e => e.volume > 0));
      let stop1 = false;
      item.preDirPrice = item.open;
      for (let k = 0; k < datas.length; k++) {
        let t = datas[k];
        if (t.avg_price > t.price) {
          stop1 = true;
        } else {
          if (!stop1) item.avgzs += 1;

          item.upArgCount += 1;
        }
        if (k > 0) {
          if (t.price > item.preDirPrice) {
            item.contDir = (item.contDir > 0 ? item.contDir : 0) + 1;
          } else if (t.price < item.preDirPrice) {
            item.contDir = (item.contDir < 0 ? item.contDir : 0) - 1;
          }
          item.preDirPrice = t.price;
        }
        item.preDirPrice = t.price;

        item.preAvg = t.avg_price;
      }
      console.log(item);
    }
  }

  await getTables(items);

  if (isNotTradeTime()) return;
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    let avg = (item.amount / item.volume).toFixed(2);

    if (item.now > item.preDirPrice) {
      item.dir = "up";
    } else if (item.now < item.preDirPrice) {
      item.dir = "down";
    }
    if (avg < item.preAvg || item.now < avg) {
      item.avgzs = 0;
    } else {
      item.upArgCount += 1;
      item.avgzs += 1;
    }
    item.preAvg = avg;
  }
}
