import { loadScripts, timeout } from "./utils";
import { getTechDatas } from "./tech";
import { getTables } from "./getTable";
import { format } from "path";
import { filters } from "./filters";
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
let issdkloaded = false;
export async function monitor(items) {
  if (!issdkloaded) await loadScripts(["/static/js/sf_sdk.js"]);
  issdkloaded = true;
  window.items = items;
  for (let i = 0; i < items.length; i++) {
    let item = items[i];

    if (!window["tech_" + item.code]) {
      // await getTechDatas(item.code);
    }
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
      for (let i = datas.length - 1; i > 0; i--) {
        if (
          datas[i].avg_price >
          datas[i]
            .price /*||
                  Math.floor(datas[i].avg_price * 100) / 100 <
                    Math.floor(datas[i - 1].avg_price * 100) / 100*/
        ) {
          stop1 = true;
          // break;
        } else {
          if (!stop1) item.avgzs += 1;

          item.upArgCount += 1;
        }
      }
    }
  }

  await getTables(items);

  if (isNotTradeTime()) return;
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    let name = "tdatas" + item.code;
    let datas = window[name];
    let avg = (item.amount / item.volume).toFixed(2);
    datas.push({
      price: item.now,
      volume: item.volume,
      amount: item.amount,
      avg_price: avg
    });

    if (avg < datas[datas.length - 2].avg || item.now < avg) {
      item.avgzs = 0;
      continue;
    } else {
      item.upArgCount += 1;
      item.avgzs += 1;
    }
  }
}