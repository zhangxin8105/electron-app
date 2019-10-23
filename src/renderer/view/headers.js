import { getLastReportDate } from "../lib/utils";
const reportDate = getLastReportDate();
const fmtPercent = value => {
  if (value) return parseFloat(value).toFixed(2) + "%";
  return value;
};
export const headers = [
  {
    label: "Now",
    prop: "now",
    type: "number",
    fmt: (e, item) => `${e}(${item.change})`
  },
  {
    label: "Vol",
    prop: "vol",
    type: "number",
    fmt: (e, item) => {
      return (item.vol = `${((item.volume - item.preVolume) / 100).toFixed(
        0
      )}/${item.bsVols && (item.bsVols[5] / 100).toFixed(0)}`);
    }
  },
  {
    label: "Turnover%",
    prop: "turnover2",
    type: "number",
    fmt: (ee, item) => {
      if (!item.currcapital) return "";
      if (!window[`${item.code}_turnover2`] && window[`${item.code}_240`]) {
        window[`item_${item.code}`] = item;
        window[`${item.code}_turnover2`] = true;
        item.turnover2 = window[`${item.code}_240`]
          .filter(e => e.day != item.date)

          .map(
            e => `${((e.volume / item.currcapital / 10000) * 100).toFixed(2)}`
          )
          .reverse()
          .slice(0, 2)
          .join(",");
      }
      if (item.turnover2) return `${item.turnover},${item.turnover2}`;
      else return item.turnover;
    }
  },
  {
    label: "Trend",
    prop: "trend",
    type: "string",
    fmt: (e, item) => {
      if (window[`${item.code}_240`]) {
        return (item.trend = window[`${item.code}_240`]
          .map((e, i, datas) => {
            if (i > 0) e.preClose = datas[i - 1].close;
            return e;
          })
          .map(e => `${(e.close - (e.preClose || e.close)).toFixed(2)}`)
          .reverse()
          .slice(0, 5)
          .join(","));
      } else {
        item.trend = "";
      }
      return item.trend;
    }
  },
  {
    label: "流值/总值",
    prop: "lz",
    type: "string",
    fmt: (e, item) => `${e}/${item.zsz}`
  },
  { label: "PE(TTM)", prop: "pe_ttm", type: "number" },
  {
    label: "PEG",
    prop: "PEG",
    type: "number",
    fmt: e => e && e.toFixed(2)
  },
  {
    label: "CAGR",
    prop: "zzl3",
    type: "number",
    fmt: (e, item) =>
      e && `${parseFloat(e).toFixed(2)}%,${parseFloat(item.zzl2).toFixed(2)}%`
  },
  {
    label: "同比",
    prop: "tbzz",
    type: "number",
    fmt: fmtPercent,
    class: item => {
      if (item.reportDate == reportDate)
        return {
          reportUpdate: true
        };
    }
  },
  { label: "收益", prop: "zzl", type: "string" },
  {
    label: "ROE",
    prop: "roe",
    type: "string",
    fmt: (e, item) => {
      let tb = window["tb_zycwzb" + item.code];
      if (tb && tb.reportDate) {
        tb.reportDate[1];
        let n = "净资产收益率加权(%)";
        return (item.roe = `${tb[n][tb.reportDate[1]]},${
          tb[n][tb.reportDate[5]]
        },${tb[n][tb.reportDate[9]]}`);
      }
    }
  }
];
