function __RepairData(e) {
  this.VERSION = "1.0.4";
  var t = e,
    r = t.market.toLowerCase(),
    i = -1,
    a = 0,
    n = {
      current: function(e) {
        var t;
        if (
          ((t =
            "Date" === __Utils.tp(e.hq.date)
              ? __Utils.ds(e.hq.date)
              : e.hq.date),
          0 === e.index)
        )
          switch (
            ((e.item.price = e.hq.prevclose),
            (e.item.prevclose = e.hq.prevclose),
            (e.item.date = t),
            r)
          ) {
            case "nf":
              (e.item.holdPosition = a), (e.item.avg_price = e.hq.prevclose);
              break;
            case "goods":
              e.item.avg_price = e.hq.prevclose;
              break;
            case "hf":
              (e.item.price = e.one.prevclose || e.hq.prevclose),
                (e.item.avg_price = i);
          }
        else
          switch (((e.item.price = e.datas[e.index - 1].price), r)) {
            case "nf":
              (e.item.holdPosition = e.datas[e.index - 1].holdPosition),
                (e.item.avg_price = e.datas[e.index - 1].avg_price);
              break;
            case "goods":
              e.item.avg_price = e.datas[e.index - 1].avg_price;
              break;
            case "hf":
              e.item.avg_price = i;
          }
        e.item.volume = a;
      },
      history: function(e, t) {
        if (0 === e.index)
          switch (
            ((e.item.prevclose = e.one.prevclose || e.one.price || 1),
            (e.item.price = e.one.prevclose),
            (e.item.date = e.one.date || "2019-01-03"),
            t.market)
          ) {
            case "nf":
              (e.item.holdPosition = t.zero),
                (e.item.avg_price = e.one.avg_price || e.one.pirce);
              break;
            case "hf":
              e.item.avg_price = t.forgePrice;
          }
        else
          switch (((e.item.price = e.datas[e.index - 1].price), r)) {
            case "nf":
              (e.item.holdPosition = e.datas[e.index - 1].holdPosition),
                (e.item.avg_price = e.datas[e.index - 1].avg_price);
              break;
            case "hf":
              e.item.avg_price = t.forgePrice;
          }
        e.item.volume = a;
      }
    },
    o = function(e, t) {
      if (e.length > 1) {
        for (var r = 0; r < e.length - 1; r++)
          if (e[r][1] > e[r + 1][0]) {
            if (t > e[r][1]) return e[r][1];
            if (t < e[r + 1][0]) return e[r][1];
          } else if (t > e[r][1] && t < e[r + 1][0]) return e[r][1];
        return e[e.length - 1][1];
      }
      return e[e.length - 1][1];
    },
    c = {
      handle: function(e) {
        if (e.history)
          n.history(e, {
            zero: a,
            market: r,
            forgePrice: i
          });
        else {
          var t = e.times.indexOf(e.hq.time);
          if (-1 !== t) e.index <= t && n.current(e);
          else {
            var c = e.times.indexOf(o(e.tRange, e.hq.time));
            c > e.index && n.current(e);
          }
        }
      }
    },
    s = {
      nf: function(e) {
        for (var r = [], i = 0, a = t.td5.length; a > i; i++) {
          var n = d[e]({
            hq: t.hq,
            td1: t.td5[i],
            market: t.market,
            history: 1,
            timeRange: t.timeRange
          });
          r.push(n);
        }
        for (; r.length < 5; ) {
          var o = r.length;
          if (o >= 1) {
            var c = r[0][0].date,
              s = __Utils.sd(c);
            for (
              s.setDate(s.getDate() - 1);
              0 === s.getDay() && 6 === s.getDay();

            )
              s.setDate(s.getDate() - 1);
            var m = __Utils.ds(s),
              l = __Utils.lf.makePerMarketData(t);
            r.unshift(__Utils.lf.makeNewData(1, r[0][0].prevclose, [m], l));
          }
        }
        return r;
      }
    },
    d = {
      xv: function(e, t, r) {
        (e.date = this.ty(t)),
          r ||
            ((e.price = t.price),
            (e.avg_price = t.price),
            (e.prevclose = t.prevclose),
            (e.volume = 0));
      },
      ty: function(e) {
        return "Date" === __Utils.tp(e.date) ? __Utils.ds(e.date) : e.date;
      },
      commonHandle: function(e, t) {
        var r,
          a = [],
          n = __Utils.lf.makePerMarketData(e);
        return (
          n.forEach(function(e, r) {
            var n = {
              price: i,
              avg_price: i,
              time: e,
              volume: i
            };
            "nf" === t.toLowerCase() && (n.holdPosition = i),
              0 === r && ((n.date = i), (n.prevclose = i)),
              a.push(n);
          }),
          e.hq ||
            (e.hq = {
              time: "09:00",
              price: 1,
              prevclose: 1,
              date: __Utils.ds(new Date())
            }),
          (r =
            (e.td1 && e.td1.length <= 0) || !e.td1
              ? this.noData(e)
              : this[t.toLowerCase() + "Parse"](e)),
          {
            times: n,
            datas: a,
            forge: i,
            one: r,
            hqIndex: n.indexOf(e.hq.time)
          }
        );
      },
      noData: function(e) {
        var t = {
          price: 1,
          prevclose: 1,
          avg_price: 1,
          date: new Date(),
          volume: 0,
          holdPosition: 0
        };
        return e.hq
          ? {
              price: e.hq.price,
              prevclose: e.hq.prevclose,
              avg_price: e.hq.price,
              date: e.hq.date,
              volume: e.hq.totalVolume || 0,
              holdPosition: 0
            }
          : t;
      },
      nfParse: function(e) {
        return {
          price: 1 * e.td1[0][1],
          prevclose: 1 * e.td1[0][5] || 1 * e.td1[0][1],
          avg_price: 1 * e.td1[0][2] || 1 * e.td1[0][1],
          date: e.td1[0][6],
          volume: 1 * e.td1[0][3],
          holdPosition: 1 * e.td1[0][4]
        };
      },
      hfParse: function(e) {
        return {
          price: 1 * e.td1[0][5],
          prevclose: 1 * e.td1[0][1] || 1 * e.td1[0][5],
          avg_price: i,
          date: e.td1[0][0],
          volume: 1 * e.td1[0][6]
        };
      },
      msciParse: function(e) {
        return {
          price: 1 * e.td1[0].price,
          prevclose: 1 * e.hq.prevclose,
          avg_price: i,
          date: e.hq.date,
          volume: i
        };
      },
      goodsParse: function(e) {
        return {
          price: 1 * e.td1[0][1],
          prevclose: 1 * e.td1[0][4] || 1 * e.td1[0][1],
          avg_price: 1 * e.td1[0][2] || 1 * e.td1[0][1],
          date: e.td1[0][5],
          volume: 1 * e.td1[0][3]
        };
      },
      commonSecond: function(e, t) {
        t.td1 || (t.td1 = []);
        for (var a, n = 0, s = 0; s < e.datas.length; s++) {
          if (((a = e.datas[s]), !t.history))
            if (-1 !== e.hqIndex) {
              if (s > e.hqIndex) break;
            } else if (
              ((e.hqIndex = e.times.indexOf(o(t.timeRange, t.hq.time))),
              s > e.hqIndex)
            )
              break;
          for (var d, m = n; m < t.td1.length; m++)
            if (((d = t.td1[m]), "msci" === r)) {
              if (d.m === a.time) {
                (a.price = Number(1 * d.p)),
                  (a.avg_price = i),
                  (a.volume = i),
                  n++;
                break;
              }
            } else if (d[0] === a.time) {
              (a.price = Number(d[1])),
                (a.avg_price = Number(d[2]) || Number(d[1])),
                (a.volume = Number(d[3])),
                "nf" === r && (a.holdPosition = Number(d[4])),
                0 === s &&
                  (0 === m
                    ? "goods" === r
                      ? ((a.date = d[5]),
                        (a.prevclose = Number(d[4]) || Number(d[1])))
                      : ((a.date = d[6]),
                        (a.prevclose = Number(d[5]) || Number(d[1])))
                    : "goods" === r
                    ? ((a.date = t.td1[0][5]),
                      (a.prevclose =
                        Number(t.td1[0][4]) || Number(t.td1[0][1])))
                    : ((a.date = t.td1[0][6]),
                      (a.prevclose =
                        Number(t.td1[0][5]) || Number(t.td1[0][1])))),
                n++;
              break;
            }
          a.price === i &&
            c.handle({
              history: t.history,
              one: e.one,
              hq: t.hq,
              datas: e.datas,
              item: a,
              times: e.times,
              index: s,
              tRange: t.timeRange
            });
        }
        return e.datas;
      },
      msci: function(e) {
        var t = this.commonHandle(e, r);
        return this.commonSecond(t, e);
      },
      goods: function(e) {
        var t = this.commonHandle(e, r);
        return this.commonSecond(t, e);
      },
      nf: function(e) {
        var t = this.commonHandle(e, r);
        return this.commonSecond(t, e);
      },
      hf: function(e) {
        var t = this.commonHandle(e, r);
        if (0 === t) return [];
        for (var n, s = this.ty(e.hq), d = 0, m = 0; m < t.datas.length; m++) {
          if (((n = t.datas[m]), -1 !== t.hqIndex)) {
            if (m > t.hqIndex) break;
          } else if (
            ((t.hqIndex = t.times.indexOf(o(e.timeRange, e.hq.time))),
            m > t.hqIndex)
          )
            break;
          for (var l, p = d; p < e.td1.length; p++) {
            var h = 0 === p ? 4 : 0;
            if (((l = e.td1[p]), l[h] === n.time)) {
              0 === m
                ? ((n.price = 1 * l[5] ? 1 * l[5] : 1 * l[1]),
                  (n.volume = 1 * l[6] || a),
                  (n.avg_price = i),
                  0 === p
                    ? ((n.date = l[0] || s),
                      (n.prevclose = e.hq.prevclose || 1 * l[1]))
                    : ((n.date = e.td1[0][0] || s),
                      (n.prevclose = e.hq.prevclose || 1 * l[1]),
                      (n.price = 1 * e.td1[0][5]),
                      (n.volume = 1 * e.td1[0][6])))
                : 0 === p
                ? n.price < 0 &&
                  ((n.price = 1 * l[5]),
                  (n.avg_price = i),
                  (n.volume = 1 * l[6]))
                : n.price < 0 &&
                  ((n.price = 1 * l[1]),
                  (n.avg_price = i),
                  (n.volume = 1 * l[2])),
                d++;
              break;
            }
          }
          n.price === i &&
            c.handle({
              one: t.one,
              hq: e.hq,
              datas: t.datas,
              item: n,
              times: t.times,
              index: m,
              tRange: e.timeRange
            });
        }
        return __Utils.produceAvg(t.datas), t.datas;
      }
    },
    m = {
      td1: [],
      td5: []
    },
    l = function() {
      var e = r;
      (m.td1 = d[e](t)),
        t.td5 &&
          ((m.td5 = []),
          (m.td5 = s[e](e)),
          t.td1 &&
            m.td1[0].date !== m.td5[4][0].date &&
            (m.td5.shift(), m.td5.push(m.td1)));
    };
  return l(), m;
}
// endRepair

var __Utils = {
  tp: function(e) {
    return toString.call(e).slice(8, -1);
  },
  mr: {
    cn: [["09:30", "11:29"], ["13:00", "15:00"]],
    hk: [["09:30", "11:59"], ["13:00", "16:00"]],
    us: [["9:30", "16:00"]],
    uk: [["8:00", "16:30"]],
    repo: [["9:30", "11:29"], ["13:00", "15:30"]],
    goods: [["20:00", "23:59"], ["00:00", "02:29"], ["09:00", "15:30"]],
    msci: [["07:00", "23:59"], ["00:00", "06:00"]],
    nf: void 0,
    hf: void 0,
    gb: void 0,
    custom: void 0
  },
  produceAvg: function(arr) {
    for (
      var t, r = 0, i = 0;
      i < arr.length && ((t = arr[i]), !(t.price <= 0));
      i++
    )
      (r += t.price), (t.avg_price = r / (i + 1));
  },
  lf: {
    split: function() {
      return String.prototype.split.call(arguments[0], arguments[1]);
    },
    makeNewData: function(e, t, r, i, a) {
      for (
        var n, o = [], c = i, s = c.length, d = "0", m = 0, l = 0, p = e * s;
        p > m;
        m++
      )
        (n = {
          time: c[m % s],
          price: d,
          avg_price: d,
          volume: d,
          holdPosition: d
        }),
          m % s == 0 && r && ((n.date = r[l]), l++),
          o.push(n),
          a || (o[m].price = o[m].avg_price = t);
      return (
        (o[0].price = o[0].avg_price = o[0].prevclose = t),
        (o[0].volume = d),
        (o[0].holdPosition = d),
        o
      );
    },
    fillZero: function(e) {
      return (
        (e = parseInt(Number(e))),
        0 > e ? "" : 10 > e ? "0" + String(e) : String(e)
      );
    },
    makeBunchArr: function(e, t) {
      for (var r = [], i = 60, a = e; t >= a; a++)
        r.push(this.fillZero(a / i) + ":" + this.fillZero(a % i));
      return r;
    },
    mixBunchArr: function(e) {
      for (var t, r, i, a, n, o, c, s = [], d = 0, m = e.length; m > d; d++)
        (t = e[d][0]),
          (r = e[d][1]),
          (n = t.split(":")),
          (o = r.split(":")),
          (i = 60 * Number(n[0]) + Number(n[1])),
          (a = 60 * Number(o[0]) + Number(o[1])),
          (c = this.makeBunchArr(i, a)),
          (s = s.concat(c));
      return s;
    },
    makePerMarketData: function(e) {
      return e.timeRange
        ? ((__Utils.mr.custom = e.timeRange), this.mixBunchArr(e.timeRange))
        : e.market
        ? this.mixBunchArr(__Utils.marketRange[e.market])
        : [];
    }
  },
  sd: function(e, t) {
    var r = e.split("-"),
      i = r[0],
      a = r[1] - 1 || 0,
      n = r[2] || 1,
      o = 0,
      c = 0,
      s = 0;
    return (
      t &&
        ((r = t.split(":")), (o = r[0] || 0), (c = r[1] || 0), (s = r[2] || 0)),
      new Date(i, a, n, o, c, s)
    );
  },
  ds: function(e, t, r, i, a, n) {
    "undefined" == typeof t && (t = "-");
    var o = [];
    if ((i || o.push(e[r ? "getUTCFullYear" : "getFullYear"]()), !a)) {
      var c = e[r ? "getUTCMonth" : "getMonth"]() + 1;
      o.push(10 > c ? "0" + c : c);
    }
    if (!n) {
      var s = e[r ? "getUTCDate" : "getDate"]();
      o.push(10 > s ? "0" + s : s);
    }
    return o.join(t);
  }
};
// end util

xh5_define("datas.t", ["utils.util"], function(utils_util) {
  var _utils_util = utils_util,
    a = utils_util.HQ_DOMAIN,
    load = _utils_util.load,
    dateUtil = _utils_util.dateUtil,
    tUtil = _utils_util.tUtil,
    isHttps = 0 == location.protocol.indexOf("https:"),
    o = {
      isBond: function(e) {
        return /^(sh204\d{3}|sz1318\d{2})$/.test(e)
          ? "bond"
          : /^sh020\d{3}$/.test(e)
          ? "bond"
          : /^sz108\d{3}$/.test(e)
          ? "bond"
          : /^sh(009|010|018)\d{3}$/.test(e)
          ? "bond"
          : /^sz10\d{4}$/.test(e)
          ? "bond"
          : /^sh(100|110|112|113)\d{3}$/.test(e)
          ? "bond"
          : /^sz12\d{4}$/.test(e)
          ? "bond"
          : /^sh(105|120|129|139)\d{3}$/.test(e)
          ? "bond"
          : /^sz11\d{4}$/.test(e)
          ? "bond"
          : !1;
      },
      us: function(e, t, a) {
        for (var r, i = e.split(";"), n = [], s = 0, o = i.length; o > s; s++) {
          var l,
            c,
            d,
            p,
            m,
            u = i[s].split(",");
          0 == s
            ? (a
                ? ((l = u[1].split(":")[0] + ":" + u[1].split(":")[1]),
                  (c = u[0]),
                  (d = Number(u[4])),
                  (p = Number(u[2])),
                  (m = Number(u[5]) || Number(u[4])))
                : ((m = t.prevclose),
                  (l = u[0].split(":")[0] + ":" + u[0].split(":")[1]),
                  (d = Number(u[3])),
                  (p = Number(u[1]))),
              (r = {
                prevclose: m,
                d: c,
                m: l,
                p: d,
                v: p,
                avp: d
              }))
            : ((l = u[0].split(":")[0] + ":" + u[0].split(":")[1]),
              (d = Number(u[3])),
              (p = Number(u[1])),
              (r = {
                m: l,
                p: d,
                v: p,
                avp: d
              })),
            n.push(r),
            a &&
              s == o - 1 &&
              "16:00" > l &&
              ((r = {
                m: "16:00",
                p: d,
                v: 0,
                avp: d
              }),
              n.push(r));
        }
        return n;
      },
      optionCn: function(e, t, a) {
        if (typeof e.length < 1) return [];
        for (
          var r, i, s, o, l = tUtil.gata(a), c = [], d = e.length, p = 0, m = 0;
          d > p;
          p++
        )
          (s = e[p]),
            l[l.length - 1] < s.m ||
              (0 == m && Number(s.p) <= 0 && (s.p = t.price || t.prevclose),
              m++,
              Number(s.p) > 0 && (r = Number(s.p)),
              Number(s.p) <= 0 && (s.p = r || 0),
              Number(s.a) > 0 && (i = Number(s.a)),
              Number(s.a) <= 0 && (s.a = i || r || 0),
              Number(s.v) < 0 && (s.v = 0),
              (o = {
                m: s.i,
                p: Number(s.p),
                avp: Number(s.a),
                v: Number(s.v),
                iy: Number(s.t)
              }),
              0 == p && (o.d = s.d),
              c.push(o));
        return c;
      },
      opm: function() {
        return [];
      },
      gbIndex: function(t, a, r, i, s) {
        if (typeof t.length < 1) return [];
        var o,
          l,
          c = tUtil.gata(r, s.time),
          d = [],
          p = t.length,
          m = 0;
        i && (p = c.length);
        for (
          var u, v, h = 0, b = 0;
          p > h &&
          ((l = t[h]),
          (u = 0),
          0 == h && (u = i ? 1 : 4),
          0 == b && Number(l[1 + u]) <= 0 && (l[1 + u] = a.price),
          !(a.index > 0 && !i && a.index <= utils_util.arrIndexOf(c, l[u])));
          h++
        )
          b++,
            l && Number(l[1 + u]) > 0 && (o = Number(l[1 + u])),
            l && Number(l[1 + u]) <= 0 && (l[1 + u] = o || 0),
            l
              ? ((m += Number(l[1 + u])),
                (v = {
                  m: l[u],
                  p: Number(l[1 + u]),
                  avp: m / (h + 1),
                  v: 0
                }),
                0 == h &&
                  ((v.d = l[0]),
                  (v.prevclose = i ? Number(l[u]) || v.p : a.prevclose),
                  i &&
                    (l[1 + u].split(":").length > 1 &&
                      (v.p = v.avp = Number(l[3])),
                    isNaN(m) && ((m = Number(l[3])), (v.avp = m)))))
              : i &&
                (v = {
                  m: c[h],
                  p: d[d.length - 1].p,
                  avp: d[d.length - 1].avp,
                  v: 0
                }),
            d.push(v);
        return d;
      },
      hf: function(e, a, r, n, s) {
        var o = __RepairData({
          hq: {
            price: a.price,
            prevclose: a.prevclose,
            date: dateUtil.ds(a.date),
            time: a.time
          },
          td1: e,
          market: r,
          timeRange: s.time
        }).td1;
        return (
          o.length > 1 &&
            ((o[0].today = o[0].date),
            (o[0].date = _utils_util.dateUtil.sd(o[0].date))),
          o
        );
      },
      msci: function(e, a, r) {
        var n = __RepairData({
          hq: {
            price: a.price,
            prevclose: a.prevclose,
            date: dateUtil.ds(a.date),
            time: a.time
          },
          td1: e,
          market: r,
          timeRange: [["07:00", "23:59"], ["00:00", "06:00"]]
        }).td1;
        return (
          n.length > 1 &&
            ((n[0].today = n[0].date),
            (n[0].date = _utils_util.dateUtil.sd(n[0].date))),
          n
        );
      },
      goods: function(e, a, r, n, s) {
        var o = __RepairData({
          hq: {
            price: a.price,
            prevclose: a.prevclose,
            date: dateUtil.ds(a.date),
            time: a.time
          },
          td1: e,
          market: r,
          timeRange: s
        }).td1;
        return (
          o.length > 1 &&
            ((o[0].today = o[0].date),
            (o[0].date = _utils_util.dateUtil.sd(o[0].date))),
          o
        );
      },
      hk: function(e, t, a) {
        if (typeof e.length < 1) return [];
        for (
          var r,
            i,
            s,
            o = tUtil.gata(a),
            l = [],
            c = e.length,
            d = 0,
            p = 0,
            m = 0,
            u = 0;
          c > m;
          m++
        )
          (i = e[m]),
            (p += Number(i.a)),
            (d += Number(i.v)),
            i.m && (i.m = i.m.split(":")[0] + ":" + i.m.split(":")[1]),
            o[o.length - 1] < i.m ||
              (0 == u && Number(i.p) <= 0 && (i.p = t.price || t.prevclose),
              u++,
              Number(i.p) > 0 && (r = Number(i.p)),
              Number(i.p) <= 0 && (i.p = r || 0),
              0 >= d && (d = 1),
              (s = {
                m: i.m,
                p: Number(i.p),
                avp: p / d,
                v: Number(i.v)
              }),
              l.push(s));
        return l;
      },
      otc: function(e, t, a) {
        if (typeof e.length < 1) return [];
        for (
          var r, i, s, o, l = tUtil.gata(a), c = [], d = e.length, p = 0, m = 0;
          d > p;
          p++
        ) {
          o = e[p];
          var u = o.m.split(":"),
            v = u[0] + ":" + u[1];
          l[l.length - 1] < v ||
            (0 == m && Number(o.p) <= 0 && (o.p = t.price || t.prevclose),
            m++,
            Number(o.p) > 0 && (r = Number(o.p)),
            Number(o.p) <= 0 && (o.p = r || 0),
            Number(o.avg) > 0 && (i = Number(o.avg)),
            Number(o.avg) <= 0 && (o.avg = i || r || 0),
            (s = {
              p: Number(o.p),
              m: v,
              avp: Number(o.avg),
              v: Number(o.v) / 1e3
            }),
            c.push(s));
        }
        return (
          c.length >= 0 &&
            t.time > "14:59" &&
            (c[0] = {
              m: "14:59",
              p: t.price,
              avp: t.price,
              v: 0
            }),
          c
        );
      },
      lse: function(e, t, a, r) {
        if (typeof e.length < 1) return [];
        for (
          var i, s, o = (tUtil.gtlse(), []), l = 0, c = e.length;
          c > l;
          l++
        ) {
          var d = e[l];
          r || ((i = t.today), (s = t.prevclose));
          var p = {
            d: i,
            m: d.m,
            p: Number(d.p),
            avp: Number(d.a),
            prevclose: s,
            v: Number(d.v)
          };
          o.push(p);
        }
        return o;
      },
      futures: function(e, a, r, n, s) {
        var o = __RepairData({
          hq: {
            price: a.price,
            prevclose: a.prevclose,
            date: dateUtil.ds(a.date),
            time: a.time
          },
          td1: e,
          market: r,
          timeRange: s.time
        }).td1;
        return (
          o.length > 1 &&
            ((o[0].prevclose = a.prevclose),
            (o[0].today = o[0].date),
            (o[0].date = _utils_util.dateUtil.sd(o[0].date))),
          o
        );
      },
      gdf: function(e, a, r) {
        if (!e || e.length < 9 || !a) return null;
        var i = r ? e : _utils_util.xh5_S_KLC_D(e),
          n = _utils_util.dateUtil.dd(a);
        6 == n.getDay() && n.setDate(n.getDate() - 1),
          0 == n.getDay() && n.setDate(n.getDate() - 2);
        for (
          var s,
            o = new Date(n.getFullYear() - 3, n.getMonth(), n.getDate()),
            l = 0,
            c = 0,
            d = 0,
            p = i.length;
          p > d;
          d++
        )
          (s = i[d]),
            s.getTime() <= o.getTime() &&
              i[d + 1].getTime() >= o.getTime() &&
              (l = d),
            _utils_util.dateUtil.stbd(s, n) && (c = d + 1);
        return i.slice(l, c);
      },
      c2b: function(e) {
        e = e.replace(" ", "+");
        var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(
          e
        );
        return t >= 0 ? t : 0;
      },
      db: function(e) {
        if (!e) return [];
        for (var t, a, r = [], i = 0, n = 0, s = 0, o = e.length; o > s; s++)
          (t = this.c2b(e.charAt(s))),
            (a = 6 & n ? (7 & n) ^ 7 : 5),
            (i |= (t >> (5 - a)) << ((7 ^ n) - a)),
            64767 == i && 63 == t && (i = 65535),
            n > 25 && ((n -= 32), (r[r.length] = i), (i = 0)),
            (i |= (t & ((1 << (5 - a)) - 1)) << ((7 | n) + 4 + a)),
            (n += 6);
        return r;
      },
      fB: function(t, a, r, i) {
        t.splice(360, 3);
        for (
          var s,
            o = [],
            l = tUtil.gata(r),
            c = 3 * l.length,
            d = 0,
            p = 0,
            m = 0;
          c > m;
          m += 3
        )
          (p = Math.floor(m / 3)),
            a
              ? (o[o.length] = {
                  time: l[p],
                  price: t[m + 1] / 1e3
                })
              : ((o[o.length] = {
                  time: l[p],
                  avg_price: t[m] / 1e3,
                  price: t[m + 1] / 1e3,
                  volume: t[m + 2] / 100
                }),
                utils_util.isRepos(i.symbol) &&
                  ((o[p].avg_price = o[p].price), (o[p].volume *= 10)),
                /^(hy|gn|dy)\d+/.test(i.symbol) && (o[p].volume *= 100),
                utils_util.isCNK(i.symbol) && (o[p].volume *= 100),
                o[p].volume > 0 && (d += o[p].volume),
                o[p] &&
                  0 == o[p].price &&
                  (0 == p
                    ? (o[p].price = o[p].avg_price = i.prevclose)
                    : ((o[p].price = o[p - 1].price),
                      (o[p].avg_price = o[p - 1].price))),
                o[p].avg_price > 0 && (s = o[p].avg_price));
        return (
          o[0].price < 0 && (o[0].price = o[0].avg_price = d = 0),
          a || ((o[0].totalVolume = d), (o[0].totalAmount = d * s)),
          (o[0].index = i.index),
          (o[0].prevclose = i.prevclose),
          (o[0].symbol = i.symbol),
          (o[0].name = i.name),
          (o[0].today = i.today),
          (o[0].date = i.date),
          (o[0].lastfive = i.lastfive),
          o
        );
      },
      ctdf: function(a, r, i, s) {
        for (var o, l, c, d, p = [], m = r, u = 0, v = a.length; v > u; u++) {
          p[p.length] =
            0 == u && "" == a[0]
              ? tUtil.gltbt(1, i.prevclose)
              : _utils_util.xh5_S_KLC_D(a[u]);
          var h,
            b = 0;
          p[u].splice(120, 1);
          var f;
          for (
            utils_util.isRepos(i.symbol)
              ? ((f = 271), p[u].splice(f, p[u].length - f))
              : (f = 241),
              l = 0,
              c = f;
            c > l;
            l++
          )
            p[u][l] &&
              0 == p[u][l].price &&
              (0 == l
                ? (p[u][l].price = p[u][l].avg_price = p[u][l].prevclose)
                : ((p[u][l].price = p[u][l - 1].price),
                  (p[u][l].avg_price = p[u][l - 1].avg_price))),
              utils_util.isRepos(i.symbol) &&
                (p[u][l]
                  ? ((p[u][l].avg_price = p[u][l].price),
                    (p[u][l].volume *= 10))
                  : (p[u][l] = {
                      price: -0.01,
                      avg_price: -0.01,
                      volume: -0.01
                    })),
              (h = p[u][l].volume *= 0.01),
              /^(hy|gn|dy)\d+/.test(i.symbol) && (p[u][l].volume *= 100),
              utils_util.isCNK(i.symbol) && (p[u][l].volume *= 100),
              (b += h);
          (p[u][0].totalVolume = b),
            (p[u][0].prevclose = p[u][0].prevclose || p[u][0].price);
        }
        var f = p.length;
        for (
          f > 5 && p.splice(0, f - 5), o = [m], f = s.length, u = f - 2;
          u > f - 6;
          u--
        )
          for (l = 0, d = p.length; d > l; l++) {
            if (_utils_util.dateUtil.stbd(p[l][0].date, s[u])) {
              o.unshift(
                tUtil.azft(p[l], utils_util.isRepos(i.symbol) ? "REPO" : "CN")
              );
              break;
            }
            if (l == p.length - 1) {
              var g = o[0][0].prevclose;
              o.unshift(tUtil.gltbt(1, g)),
                (o[0][0].date = _utils_util.dateUtil.dd(s[u])),
                (o[0][0].prevclose = g);
            }
          }
        return o;
      },
      ctdb: function(t, a, r, i, s, o) {
        for (var l = a, c = [l], d = i.length, p = d - 2; p > d - 6; p--)
          c.unshift(
            "HF" == utils_util.market(r.symbol)
              ? tUtil.gltbt(1, r.prevclose, !1, s, [i[p]], o.time)
              : "NF" == utils_util.market(r.symbol)
              ? tUtil.gltbt(1, r.prevclose, !1, s, [i[p]], o.time)
              : "global_index" == utils_util.market(r.symbol)
              ? tUtil.gltbt(1, r.prevclose, !1, s, [i[p]], o.time)
              : tUtil.gltbt(1, r.prevclose, !1, s, [i[p]])
          );
        return c;
      },
      fund: function(e) {
        var t = [];
        if (e)
          for (
            var a = e.detail.split(","), r = 0, i = 0, n = a.length;
            n > i;
            i += 2
          ) {
            r += Number(a[i + 1]);
            var s = {
              p: Number(a[i + 1]),
              avp: Number(r / (i / 2 + 1)),
              m: a[i]
            };
            0 == i &&
              (s.prevclose = Number("09:30" == a[i] ? e.yes : a[i + 1])),
              t.push(s);
          }
        return t;
      },
      pkt: function(e, a, r, i, s) {
        if (typeof e.length < 1) return [];
        var o,
          l = !1,
          c = e,
          d = tUtil.s0(a.date.getHours()) + ":" + tUtil.s0(a.date.getMinutes());
        switch (r) {
          case "HF":
            (o = tUtil.gata(r, s.time)),
              c.length <= 0 &&
                c.push({
                  d: a.today,
                  price: a.price,
                  prevclose: a.prevclose
                }),
              c[0].d < a.today &&
                d > s.time[0][0] &&
                (d = s.time[s.time.length - 1][1]);
            break;
          case "NF":
            o = tUtil.gata(r, s.time);
            break;
          case "global_index":
            o = tUtil.gata(r, s.time);
            break;
          default:
            o = tUtil.gata(r);
        }
        for (var p, m = [], u = 0, v = 0, h = o.length; h > v; v++) {
          if (
            ((p = {}),
            (m[m.length] = p),
            (p.time = o[v]),
            (p.volume = p.price = -1),
            (p.avg_price = -1),
            d)
          ) {
            if (l && !i) continue;
            d == p.time && (l = !0);
          }
          for (var b = o[0], f = u, g = c.length; g > f; f++) {
            var _ = c[f],
              y = String(_.m).substring(0, 5);
            if (y == o[v]) {
              y == b &&
                ((p.symbol = a.symbol),
                (p.name = a.name),
                i
                  ? ((p.prevclose = Number(e[0].prevclose) || Number(e[0].p)),
                    (p.date = _utils_util.dateUtil.sd(e[0].d)),
                    (p.today = e[0].d))
                  : ((p.prevclose = a.prevclose),
                    "HF" == r || "NF" == r
                      ? ((p.date = _utils_util.dateUtil.sd(e[0].d) || a.date),
                        (p.today = e[0].d || a.today))
                      : ((p.date = a.date), (p.today = a.today))),
                "fund" == r && (p.prevclose = e[0].prevclose)),
                (p.volume = _.v || 0),
                (p.avg_price = _.avp),
                (p.price = _.p),
                _.iy && (p.holdPosition = _.iy),
                c.splice(f, 1);
              break;
            }
            y > o[v] ||
            ("global_index" == r && "00:00" == y && y < o[v]) ||
            ("NF" == r && "21:00" == b && p.time > "21:00" && y < o[v])
              ? (0 == v
                  ? i
                    ? ((p.price = e[0].p),
                      (p.prevclose = e[0].prevclose || p.price),
                      (p.avg_price = e[0].avp),
                      (p.date = _utils_util.dateUtil.sd(e[0].d)),
                      (p.today = e[0].d))
                    : ((p.price =
                        "US" === r || "HK" === r
                          ? a.prevclose
                          : a.open || a.prevclose),
                      (p.prevclose = a.prevclose),
                      (p.avg_price = p.price),
                      (p.symbol = a.symbol),
                      (p.name = a.name),
                      "NF" === r
                        ? ((p.date = _utils_util.dateUtil.sd(e[0].d) || a.date),
                          (p.today = e[0].d || a.today))
                        : ((p.date = a.date), (p.today = a.today)))
                  : ((p.price = m[v - 1].price),
                    (p.avg_price = m[v - 1].avg_price),
                    ("option_cn" == r || "op_m" == r || "NF" == r) &&
                      (p.holdPosition = m[v - 1].holdPosition)),
                (p.volume = -0.01))
              : 0 != v ||
                i ||
                ((p.price =
                  "US" == r
                    ? e[f].p || a.prevclose
                    : e[f].p || a.open || a.prevclose),
                (p.prevclose = a.prevclose),
                (p.avg_price = e[f].avp || p.price),
                (p.symbol = a.symbol),
                (p.name = a.name),
                (p.volume = 0),
                "HF" == r || "NF" == r
                  ? ((p.date = _utils_util.dateUtil.sd(e[0].d) || a.date),
                    (p.today = e[0].d || a.today))
                  : ((p.date = a.date), (p.today = a.today)));
          }
        }
        return (m[0].index = h - 1), m;
      }
    };
  return new (function() {
    this.VER = "2.8.0";
    var l = "http://finance.sina.com.cn/realstock/company/klc_td_sh.txt",
      c = {
        REPO: {
          T_Head_STR: "hq_str_ml_",
          T_EMI_URL: "http://finance.sina.com.cn/finance/eqlweight/$symbol.js",
          T_URL: "http://" + a + ".sinajs.cn/?_=$rn&list=$symbol",
          T5_URL:
            "http://finance.sina.com.cn/realstock/company/$symbol/hisdata/klc_cm_nhg.js?day=$rn",
          TRADING_DATES_URL: l,
          HISTORY_DATA_URL:
            "http://finance.sina.com.cn/realstock/company/$symbol/hisdata/$y/$m.js?d=$date",
          LAST5_URL:
            "http://finance.sina.com.cn/realstock/lastfive/$symbol.js?_=$rn"
        },
        CN: {
          T_Head_STR: "hq_str_ml_",
          T_EMI_URL: "http://finance.sina.com.cn/finance/eqlweight/$symbol.js",
          T_URL: "http://" + a + ".sinajs.cn/?_=$rn&list=$symbol",
          T5_URL:
            "http://finance.sina.com.cn/realstock/company/$symbol/hisdata/klc_cm.js?day=$rn",
          TRADING_DATES_URL: l,
          HISTORY_DATA_URL:
            "http://finance.sina.com.cn/realstock/company/$symbol/hisdata/$y/$m.js?d=$date",
          LAST5_URL:
            "http://finance.sina.com.cn/realstock/lastfive/$symbol.js?_=$rn"
        },
        option_cn: {
          T_Head_STR: "t1",
          T_URL:
            "http://stock.finance.sina.com.cn/futures/api/openapi.php/StockOptionDaylineService.getOptionMinline?symbol=$symbol&random=$rn&callback=$cb=",
          T5_URL:
            "http://stock.finance.sina.com.cn/futures/api/openapi.php/StockOptionDaylineService.getFiveDayLine?symbol=$symbol&random=$rn&callback=$cb=",
          TRADING_DATES_URL: l
        },
        op_m: {
          T_Head_STR: "t1",
          T_URL:
            "http://stock.finance.sina.com.cn/futures/api/openapi.php/FutureOptionAllService.getOptionMinline?symbol=$symbol&random=$rn&callback=$cb=",
          TRADING_DATES_URL: l
        },
        US: {
          T_Head_STR: "t1",
          T_URL:
            "http://stock.finance.sina.com.cn/usstock/api/jsonp_v2.php/$cb=/US_MinlineNService.getMinline?symbol=$symbol&day=1&random=$rn",
          T5_URL:
            "http://stock.finance.sina.com.cn/usstock/api/jsonp_v2.php/$cb/US_MinlineNService.getMinline?symbol=$symbol&day=5&random=$rn",
          TRADING_DATES_URL:
            "http://stock.finance.sina.com.cn/usstock/api/openapi.php/US_MinKService.getTradeDays?&start_day=$start&end_day=$end&callback=$cb="
        },
        HK: {
          T_Head_STR: "t1",
          T_URL:
            "http://stock.finance.sina.com.cn/hkstock/api/openapi.php/HK_StockService.getHKMinline?symbol=$symbol&random=$rn&callback=$cb=",
          T5_URL:
            "http://quotes.sina.cn/hk/api/openapi.php/HK_MinlineService.getMinline?symbol=$symbol&day=5&callback=$cb=",
          LAST5_URL:
            "http://stock.finance.sina.com.cn/hkstock/api/jsonp_v2.php/$cb/HK_StockService.getStock5DayAvgVolume?symbol=$symbol",
          TRADING_DATES_URL: l
        },
        fund: {
          T_Head_STR: "t1",
          T_URL:
            "http://app.xincai.com/fund/api/jsonp.json/$cb=/XinCaiFundService.getFundYuCeNav?symbol=$symbol&___qn=3",
          TRADING_DATES_URL: l
        },
        global_index: {
          T_Head_STR: "t1",
          T_URL:
            "//stock.finance.sina.com.cn/usstock/api/jsonp.php/$cb=/Global_IndexService.getTimeLine?symbol=$symbol",
          TRADING_DATES_URL: l
        },
        CFF: {
          T_Head_STR: "t1",
          T_URL:
            "http://stock2.finance.sina.com.cn/futures/api/jsonp.php/$cb=/InnerFuturesNewService.getMinLine?symbol=$symbol",
          T5_URL:
            "http://stock2.finance.sina.com.cn/futures/api/jsonp.php/$cb=/InnerFuturesNewService.getFourDaysLine?symbol=$symbol",
          TRADING_DATES_URL: l
        },
        OTC: {
          T_Head_STR: "t1",
          T_URL:
            "http://stock.finance.sina.com.cn/thirdmarket/api/openapi.php/NQHQService.minline?symbol=$symbol&callback=$cb=",
          TRADING_DATES_URL: l
        },
        NF: {
          T_Head_STR: "t1",
          T_URL:
            "http://stock2.finance.sina.com.cn/futures/api/jsonp.php/$cb=/InnerFuturesNewService.getMinLine?symbol=$symbol",
          T5_URL:
            "http://stock2.finance.sina.com.cn/futures/api/jsonp.php/$cb=/InnerFuturesNewService.getFourDaysLine?symbol=$symbol",
          TRADING_DATES_URL: l
        },
        HF: {
          T_Head_STR: "t1",
          T_URL:
            "http://stock2.finance.sina.com.cn/futures/api/openapi.php/GlobalFuturesService.getGlobalFuturesMinLine?symbol=$symbol&callback=$cb=",
          T5_URL:
            "http://stock2.finance.sina.com.cn/futures/api/openapi.php/GlobalFuturesService.getGlobalFutures5MLine?symbol=$symbol&callback=$cb=",
          TRADING_DATES_URL: l
        },
        GOODS: {
          T_Head_STR: "t1",
          T_URL:
            "http://stock2.finance.sina.com.cn/futures/api/openapi.php/SpotService.getMinLine?symbol=$symbol&callback=$cb=",
          TRADING_DATES_URL: l
        },
        MSCI: {
          T_Head_STR: "t1",
          T_URL:
            "http://quotes.sina.cn/msci/api/openapi.php/MSCIService.getMinLine?symbol=$symbol&callback=$cb=",
          TRADING_DATES_URL: l
        },
        LSE: {
          T_Head_STR: "t1",
          T_URL:
            "http://quotes.sina.cn/lse/api/openapi.php/LSEService.minline?symbol=$symbol&type=1&callback=$cb=",
          TRADING_DATES_URL: l
        }
      },
      d = {},
      p = 0,
      m = function(t, a, r) {
        var i = utils_util.market(a),
          n = c[i][r];
        return (isHttps || t) && (n = utils_util.getSUrl(n)), n;
      },
      u = 0;
    this.get = function(config, callback) {
      var s,
        l,
        h,
        b = config.symbol,
        f = utils_util.market(b),
        g = config.date,
        _ = config.withT5,
        y = config.withI,
        k = config.ssl;
      u = config.dist5;
      var N = {
        msg: null,
        data: {
          td1: null,
          td5: null,
          hq: null
        }
      };
      switch (((h = s = b), f)) {
        case "HK":
          (b = "rt" == b.substring(0, 2) ? b.slice(3) : b),
            (s = b),
            (l = s.replace("hk", ""));
          break;
        case "US":
          (h +=
            1 === config.assisthq
              ? "," + b + ",gb_ixic,sys_time"
              : "," + b + ",sys_time"),
            (s = l = b.replace("gb_", "")),
            (l = l.replace("$", ".")),
            (s = s.replace(".", ""));
          break;
        case "OTC":
          l = b.replace("sb", "");
          break;
        case "fund":
          l = b.replace("fu_", "");
          break;
        case "CFF":
          l = b.replace("CFF_RE_", "");
          break;
        case "CN":
        case "REPO":
          l = "ml_" + b;
          break;
        case "global_index":
          l = b.replace("znb_", "");
          break;
        case "op_m":
          l = s = b.replace("P_OP_", "");
          break;
        case "HF":
          l = b.replace("hf_", "");
          break;
        case "GOODS":
          l = b.replace("gds_", "");
          break;
        case "MSCI":
          l = b.replace("msci_", "");
          break;
        case "NF":
          l = b.replace("nf_", "");
          break;
        case "LSE":
          (s = l = b.replace("lse_", "")),
            (l = l.replace("$", ".")),
            (s = s.replace(/\W/g, ""));
          break;
        default:
          l = b;
      }
      var R = function(e) {
          var t, a, r;
          return g
            ? ((r = g.split("-")[1] || "01"),
              (a = g.split("-")[0]),
              g.split("-")[1] &&
                Number(g.split("-")[1]) < 10 &&
                ((r = "0" + Number(g.split("-")[1])),
                (g = a + "-" + r + "-" + g.split("-")[2])),
              (t = "MLC_" + b + "_" + a + "_" + r),
              {
                lc: t,
                year: a,
                month: r
              })
            : ((g = e), null);
        },
        T = function(a) {
          load(
            m(k, b, "HISTORY_DATA_URL")
              .replace("$symbol", b)
              .replace("$y", a.year)
              .replace("$m", a.month)
              .replace("$date", g),
            function() {
              var s = String(window[a.lc]);
              if (((window[a.lc] = null), (N.msg = "history"), s)) {
                for (
                  var l,
                    c,
                    p,
                    u,
                    v = String(s).split(","),
                    h = [],
                    _ = v.length,
                    y = tUtil.gata(f),
                    R = 0;
                  _ > R;
                  R++
                ) {
                  (h[R] = _utils_util.xh5_S_KLC_D(v[R])),
                    (l = h[R].shift()),
                    (h[R][0].prevclose = l.prevclose),
                    (h[R][0].date = l.date),
                    h[R].splice(120, 1),
                    (c = 0);
                  for (var T = 0; 241 > T; T++)
                    (p = utils_util.isCNK(b)
                      ? h[R][T].volume
                      : (h[R][T].volume /= 100)),
                      (c += p),
                      (h[R][T].time = y[T]);
                  var U = _utils_util.dateUtil.ds(l.date);
                  U == g && (u = h[R]), (h[R][0].totalVolume = c);
                }
                if (h.length < 5)
                  return void load(
                    m(k, b, "TRADING_DATES_URL"),
                    function() {
                      for (
                        var e = window.datelist,
                          r = h.length,
                          s = o.gdf(e, _utils_util.dateUtil.sd(g)),
                          l = 5 - r;
                        l > 0;
                        l--
                      )
                        h.unshift(
                          tUtil.gltbt(1, h[0][0].price, !1, f, [
                            s[s.length - 5 + l]
                          ])
                        );
                      (N.data.td1 = u),
                        (N.data.td5 = h),
                        (d[b + a.year + a.month] = N),
                        _utils_util.isFunc(callback) && callback(N);
                    },
                    null,
                    {
                      symbol: b,
                      market: f,
                      type: "tradedate"
                    }
                  );
                (N.data.td1 = u),
                  (N.data.td5 = h),
                  (d[b + a.year + a.month] = N),
                  _utils_util.isFunc(callback) && callback(N);
              }
            },
            function() {
              (N.msg = "nohistory"),
                _utils_util.isFunc(callback) && callback(N);
            },
            {
              market: f,
              symbol: b,
              type: "historydata"
            }
          );
        },
        U = function(e) {
          return d[b + e.year + e.month]
            ? void (
                _utils_util.isFunc(callback) &&
                callback(d[b + e.year + e.month])
              )
            : void T(e);
        },
        S = function(e, t, a) {
          var r;
          switch (f) {
            case "OTC":
              r = o.otc(e.result.data, t, f);
              break;
            case "US":
              r = o.us(String(e), t);
              break;
            case "HK":
              r = o.hk(e.result.data, t, f);
              break;
            case "fund":
              r = o.fund(e);
              break;
            case "CFF":
              r = o.futures(e, t);
              break;
            case "global_index":
              r = o.gbIndex(e, t, f, !1, a);
              break;
            case "NF":
              r = o.futures(e, t, f, !1, a);
              break;
            case "GOODS":
              r = o.goods(e.result.data, t, f, !1, [
                ["20:00", "23:59"],
                ["00:00", "02:29"],
                ["09:00", "15:30"]
              ]);
              break;
            case "MSCI":
              r = o.msci(e.result.data, t, f, !1, [
                ["07:00", "23:59"],
                ["00:00", "06:00"]
              ]);
              break;
            case "option_cn":
              r = o.optionCn(e.result.data, t, "CN");
              break;
            case "op_m":
              r = o.opm(e.result.data, t, "CN");
              break;
            case "LSE":
              r = o.lse(e.result.data, t, f, !1);
              break;
            case "CN":
            case "REPO":
              r = o.db(e);
              break;
            case "HF":
              r = o.hf(e.result.data.minLine_1d, t, f, !1, a);
          }
          if ("CN" == f || "REPO" == f) r = o.fB(r, !1, f, t);
          else if ("NF" === f || "HF" === f || "GOODS" === f || "MSCI" === f);
          else {
            r = o.pkt(r, t, f, !1, a);
            var i = t.time;
            "HK" == f &&
              i > "15:59" &&
              (i > "16:09" && (i = "16:09"),
              (r[r.length - 1].price = t.price),
              (r[r.length - 1].avg_price = r[r.length - 2].avg_price),
              (r[r.length - 1].time = i),
              (r[r.length - 1].volume = 0),
              r[r.length - 1].avg_price < 0 &&
                (r[r.length - 1].avg_price = t.price));
          }
          return r;
        },
        $ = function(n, c, d) {
          var p,
            u = 3;
          if (p && p.length > 600)
            tradeDatesUrlcallback(
              n,
              b,
              c,
              p,
              callback,
              config.dataformatter,
              k
            );
          else if ((u--, u > 0))
            if ("US" == f) {
              var g = utils_util.dateUtil.ds(
                new Date(
                  n.date.getFullYear(),
                  n.date.getMonth() - 2,
                  n.date.getDate()
                ),
                "-"
              );
              load(
                m(k, h, "TRADING_DATES_URL")
                  .replace("$start", g)
                  .replace("$end", n.today)
                  .replace("$cb", "var usHistorydate"),
                function() {
                  for (
                    var r = window.usHistorydate.result.data, d = r.length;
                    d--;

                  )
                    r[d] = utils_util.dateUtil.sd(r[d]);
                  r.length > 0 &&
                    !_utils_util.dateUtil.stbd(r[r.length - 1], n.date) &&
                    r.push(n.date),
                    (p = o.gdf(r, n.date, !0)),
                    tradeDatesUrlcallback(
                      n,
                      b,
                      c,
                      p,
                      f,
                      callback,
                      config.dataformatter,
                      k,
                      s,
                      l
                    );
                },
                null,
                {
                  symbol: n.symbol,
                  market: f,
                  type: "tradedate"
                }
              );
            } else
              load(
                m(k, b, "TRADING_DATES_URL"),
                function() {
                  var datelist = window.datelist;
                  (p = o.gdf(datelist, n.date)),
                    tradeDatesUrlcallback(
                      n,
                      b,
                      c,
                      p,
                      f,
                      callback,
                      config.dataformatter,
                      k,
                      null,
                      null,
                      d
                    );
                },
                null,
                {
                  symbol: n.symbol,
                  market: f,
                  type: "tradedate"
                }
              );
          else null();
        },
        D = function(e, a) {
          load(
            e,
            function() {
              var e = window[c[f].T_Head_STR + s];
              window[c[f].T_Head_STR + s] = null;
              var r,
                o = window["kke_future_" + a.symbol] || {
                  time: [["06:00", "23:59"], ["00:00", "05:00"]]
                },
                l = window["kke_future_" + a.symbol] || {
                  time: [["09:30", "11:29"], ["13:00", "02:59"]]
                },
                d = window["kke_global_index_" + a.symbol] || {
                  time: [["09:30", "11:29"], ["13:00", "02:59"]]
                };
              if (
                "" == e ||
                null == e ||
                (e.result && null == e.result.data) ||
                (e.result && e.result.data && e.result.data.length <= 0) ||
                (e.result &&
                  e.result.data.minLine_1d &&
                  e.result.data.minLine_1d.length <= 0) ||
                e.__ERROR
              )
                switch (((N.msg = "empty"), f)) {
                  case "HF":
                    r = tUtil.gltbt(1, a.prevclose, !0, f, [a.date], o.time);
                    break;
                  case "NF":
                    r = tUtil.gltbt(1, a.prevclose, !0, f, [a.date], l.time);
                    break;
                  case "global_index":
                    r = tUtil.gltbt(1, a.prevclose, !0, f, [a.date], d.time);
                    break;
                  default:
                    r = tUtil.gltbt(1, a.prevclose, !0, f);
                }
              else
                switch (((N.msg = ""), f)) {
                  case "HF":
                    var m = a.today.split("-"),
                      u =
                        m[0] +
                        "-" +
                        (Number(m[1]) < 10 ? "0" + m[1] : m[1]) +
                        "-" +
                        (Number(m[2]) < 10 ? "0" + m[2] : m[2]);
                    (r =
                      u < e.result.data.minLine_1d[0][0]
                        ? tUtil.gltbt(1, a.prevclose, !0, f, null, o.time)
                        : S(e, a, o)),
                      "hf_ES" == a.symbol &&
                        a.time > o.time[0][0] &&
                        !_utils_util.dateUtil.stbd(r[0].date, a.date) &&
                        (r = tUtil.gltbt(
                          1,
                          a.prevclose,
                          !0,
                          f,
                          [a.date],
                          o.time
                        ));
                    break;
                  case "NF":
                    r = S(e, a, l);
                    break;
                  case "global_index":
                    r = S(e, a, d);
                    break;
                  default:
                    r = S(e, a);
                }
              if (
                (r && !r[0].date && (r[0].date = a.date), (N.data.td1 = r), !_)
              )
                return (
                  0 != p && (r[0].lastfive = p),
                  void (_utils_util.isFunc(callback) && callback(N))
                );
              switch (f) {
                case "HF":
                  $(a, r, o);
                  break;
                case "NF":
                  $(a, r, l);
                  break;
                case "global_index":
                  $(a, r, d);
                  break;
                default:
                  $(a, r);
              }
            },
            function() {},
            {
              market: f,
              symbol: a.symbol,
              type: "t1"
            }
          );
        },
        L = function() {
          "LSE" === f && (h = utils_util.strUtil.replaceStr(h)),
            KKE.api(
              "datas.hq.get",
              {
                symbol: h,
                withI: y,
                cancelEtag: !0,
                ssl: k
              },
              function(e) {
                var a = e.data[0];
                if (
                  ((N.data.hq = a),
                  a.name || (a.name = h),
                  !a.name && "CFF" != f)
                )
                  return (
                    (N.msg = "error"),
                    void (_utils_util.isFunc(callback) && callback(N))
                  );
                var r = m(k, b, "T_URL")
                    .replace("$rn", new Date().getTime())
                    .replace("$symbol", l)
                    .replace("$cb", "var t1" + s),
                  n = R(a.today);
                return "CN" != f ||
                  _utils_util.dateUtil.stbd(
                    _utils_util.dateUtil.sd(a.today),
                    _utils_util.dateUtil.sd(g)
                  )
                  ? void D(r, a)
                  : void U(n);
              }
            );
        };
      L();
    };
    var tradeDatesUrlcallback = function(
      hqObj,
      papercode,
      timeDatasArr,
      dateArr,
      marketCode,
      callback,
      dataformatter,
      h,
      b,
      f,
      g
    ) {
      var dataObj = {
        msg: null,
        data: {
          td1: null,
          td5: null,
          hq: null
        }
      };
      if (
        ((dataObj.data.hq = hqObj),
        (dataObj.data.td1 = timeDatasArr),
        hqObj.name || (hqObj.name = hqObj.symbol),
        !hqObj.name && "CFF" != marketCode)
      )
        return (
          (dataObj.msg = "error"),
          void (_utils_util.isFunc(callback) && callback(dataObj))
        );
      var y = function() {
          var u,
            v = papercode.replace("hk", "");
          load(
            m(h, papercode, "T5_URL")
              .replace("$symbol", v)
              .replace("$cb", "var __hkT5"),
            function() {
              var v = window.__hkT5,
                b = v.result.data;
              b && b.length > 0
                ? (b.forEach(function(e, t) {
                    var a = 0;
                    if (
                      (e.forEach(function(t, a) {
                        "12:00:00" == t.m && e.splice(a, 1);
                      }),
                      e.forEach(function(e, t) {
                        var r = e.m.split(":");
                        e.date &&
                          ((e.today = e.date), (e.date = dateUtil.sd(e.date))),
                          e.prevclose && (e.prevclose = Number(e.prevclose)),
                          (e.time = r[0] + ":" + r[1]),
                          (e.price = Number(e.price)),
                          (e.volume = Number(e.volume)),
                          (a += Number(e.price)),
                          (e.avg_price = Number(a) / (t + 1));
                      }),
                      4 > t && e.length < 331)
                    )
                      for (
                        var r = 0,
                          s = e.length,
                          o = tUtil.gthk(),
                          l = 0,
                          c = o.length;
                        c > l;
                        l++
                      ) {
                        for (var d = o[l], p = r; s > p; p++) {
                          var m = e[p].time.substring(0, 5);
                          if (d === m) {
                            r++;
                            break;
                          }
                          if (0 !== l) {
                            var u = {
                              avg_price: e[l].avg_price,
                              m: o[r] + ":00",
                              time: o[r],
                              price: e[l].price,
                              volume: 0
                            };
                            e.push(u);
                          }
                        }
                        if (c > r && r >= e.length) {
                          var v = {
                            avg_price: e[l].avg_price,
                            m: o[r] + ":00",
                            time: o[r],
                            price: e[l].price,
                            volume: 0
                          };
                          e.push(v), r++;
                        }
                      }
                  }),
                  b.length <= 4
                    ? ((u = o.ctdb(
                        5,
                        timeDatasArr,
                        hqObj,
                        dateArr,
                        marketCode
                      )),
                      u.forEach(function(e) {
                        b.forEach(function(t) {
                          e[0].date == t[0].date && (e = t);
                        });
                      }),
                      (dataObj.data.td5 = u))
                    : (dateUtil.stbd(
                        b[b.length - 2][0].date,
                        timeDatasArr[0].date
                      ) &&
                        ((timeDatasArr[0].today = b[b.length - 1][0].today),
                        (timeDatasArr[0].date = b[b.length - 1][0].date)),
                      (b[b.length - 1] = timeDatasArr),
                      (dataObj.data.td5 = b)))
                : ((u = o.ctdb(5, timeDatasArr, hqObj, dateArr, marketCode)),
                  (dataObj.data.td5 = u));
              var f = "lastfive" + papercode,
                g = papercode.substring(2);
              load(
                m(h, papercode, "LAST5_URL")
                  .replace("$rn", new Date().getHours())
                  .replace("$symbol", g)
                  .replace("$cb", "var " + f + "="),
                function() {
                  var e = window[f];
                  return e
                    ? ((dataObj.data.td5[4][0].lastfive = p = Number(e.volume)),
                      void (_utils_util.isFunc(callback) && callback(dataObj)))
                    : void (_utils_util.isFunc(callback) && callback(dataObj));
                },
                function() {
                  (dataObj.data.td5 = u),
                    _utils_util.isFunc(callback) && callback(dataObj);
                },
                {
                  symbol: hqObj.symbol,
                  market: marketCode,
                  type: "lastfive"
                }
              );
            }
          );
        },
        k = function() {
          load(
            m(h, papercode, "T5_URL")
              .replace("$rn", new Date().getTime())
              .replace("$symbol", f)
              .replace("$cb", "var t5" + b + "="),
            function() {
              var r = String(window["t5" + b]),
                i = [],
                p = r.split(" ");
              p.shift();
              for (var m = p.length; m--; ) {
                var u = o.us(p[m], hqObj, !0);
                p[m] = o.pkt(u, hqObj, marketCode, !0);
              }
              if (((window["t5" + papercode] = null), "" == r))
                dataObj.msg = "empty";
              else {
                dataObj.msg = "";
                var v = dateArr.length,
                  h = 0,
                  f = p.length,
                  g = [];
                for (m = v - 1; m > v - 6; m--)
                  g.unshift(
                    tUtil.gltbt(1, hqObj.prevclose, !1, "US", [dateArr[m]])
                  );
                for (m = v - 1; m > v - 6; m--) {
                  for (var y, k = 0, N = 0; f > N; N++)
                    _utils_util.dateUtil.stbd(dateArr[m], p[N][0].date) &&
                      ((y = p[N]), (k = 1), (h = N));
                  0 == k &&
                    (y = tUtil.gltbt(1, g[h][0].prevclose, !1, "US", [
                      dateArr[m]
                    ])),
                    i.unshift(y);
                }
              }
              (i[4] = timeDatasArr),
                (dataObj.data.td5 = i),
                _utils_util.isFunc(callback) && callback(dataObj);
            },
            null,
            {
              market: marketCode,
              symbol: hqObj.symbol,
              type: "t5"
            }
          );
        },
        N = function(i) {
          var n =
            "CFF_RE_" == papercode.substring(0, 7)
              ? papercode.slice(7)
              : papercode;
          load(
            m(h, papercode, "T5_URL")
              .replace("$rn", new Date().getTime())
              .replace("$symbol", n)
              .replace("$cb", "var t5" + papercode),
            function() {
              var r = window["t5" + papercode],
                n = [];
              if (((window["t5" + papercode] = null), "" == r))
                dataObj.msg = "empty";
              else {
                if (void 0 == r) return (dataObj.msg = "data error."), void R();
                dataObj.msg = "";
                for (var l = [], p = r.length, m = 0; p > m; m++) {
                  var u = o.futures(r[m], hqObj, marketCode, "his", i);
                  if (
                    !_utils_util.dateUtil.stbd(
                      _utils_util.dateUtil.sd(u[0].d),
                      hqObj.date
                    )
                  ) {
                    var v = o.pkt(u, hqObj, marketCode, !0);
                    l.push(v), n.push(v);
                  }
                }
              }
              (n[4] = timeDatasArr),
                (dataObj.data.td5 = n),
                _utils_util.isFunc(callback) && callback(dataObj);
            },
            null,
            {
              market: marketCode,
              symbol: hqObj.symbol,
              type: "t5"
            }
          );
        },
        R = function(a) {
          (dataObj.data.td5 = o.ctdb(
            5,
            timeDatasArr,
            hqObj,
            dateArr,
            marketCode,
            a
          )),
            _utils_util.isFunc(callback) && callback(dataObj);
        },
        T = function(i) {
          load(
            m(h, papercode, "T5_URL")
              .replace("$symbol", papercode.replace("nf_", ""))
              .replace("$cb", "var t5" + papercode),
            function() {
              var r = window["t5" + papercode],
                n = [];
              if (((window["t5" + papercode] = null), "" == r))
                return (dataObj.msg = "empty"), void R(i);
              if (void 0 == r) return (dataObj.msg = "data error."), void R(i);
              dataObj.msg = "";
              var o = __RepairData({
                hq: hqObj,
                market: marketCode,
                timeRange: i.time,
                td5: r
              });
              for (
                n = o.td5,
                  n.forEach(function(e) {
                    (e[0].today = e[0].date),
                      (e[0].date = _utils_util.dateUtil.sd(e[0].date));
                  });
                n.length > 5;

              )
                n.shift();
              timeDatasArr[0].today !== n[4][0].today
                ? (n.length >= 5 && n.shift(), n.push(timeDatasArr))
                : (n[4] = timeDatasArr),
                (dataObj.data.td5 = n),
                _utils_util.isFunc(callback) && callback(dataObj);
            },
            null,
            {
              market: marketCode,
              symbol: hqObj.symbol,
              type: "t5"
            }
          );
        },
        U = function(i) {
          load(
            m(h, papercode, "T5_URL")
              .replace("$symbol", papercode.replace("hf_", ""))
              .replace("$cb", "var t5" + papercode),
            function() {
              var r = window["t5" + papercode],
                l = [];
              if (((window["t5" + papercode] = null), "" == r))
                dataObj.msg = "empty";
              else {
                if (void 0 == r) return (dataObj.msg = "data error."), void R();
                dataObj.msg = "";
                for (
                  var p = [],
                    m = r.result.data[papercode.replace("hf_", "")].length,
                    u = 0;
                  m > u;
                  u++
                ) {
                  var v = o.hf(
                    r.result.data[papercode.replace("hf_", "")][u],
                    hqObj,
                    marketCode,
                    "his",
                    i
                  );
                  if (
                    !_utils_util.dateUtil.stbd(
                      _utils_util.dateUtil.sd(v[0].d),
                      hqObj.date
                    )
                  ) {
                    var h = o.pkt(v, hqObj, marketCode, !0, i);
                    p.push(h);
                  }
                }
                for (
                  var b = [], f = timeDatasArr[0].date || hqObj.date, g = 1;
                  b.length < 6;

                ) {
                  var y = new Date(f);
                  y.setDate(f.getDate() - g),
                    6 != y.getDay() && 0 != y.getDay() && b.push(y),
                    g++;
                }
                var k,
                  N = b.length,
                  T = 1;
                for (u = 0; N > u; u++) {
                  for (k = T; k <= p.length && !(l.length > 3); k++) {
                    if (
                      _utils_util.dateUtil.stbd(p[p.length - k][0].date, b[u])
                    ) {
                      l.unshift(p[p.length - k]), T++;
                      break;
                    }
                    if (k == p.length - 1) {
                      for (var U = 0, S = 1; S <= p.length; S++)
                        _utils_util.dateUtil.stbd(
                          p[p.length - S][0].date,
                          b[u]
                        ) && (U = 1);
                      0 == U &&
                        l.unshift(
                          tUtil.gltbt(
                            1,
                            p[p.length - 1][0].prevclose,
                            !1,
                            marketCode,
                            [b[u]],
                            i.time
                          )
                        );
                    }
                  }
                  T >= p.length &&
                    l.length <= 3 &&
                    !_utils_util.dateUtil.stbd(l[0][0].date, b[u]) &&
                    l.unshift(
                      tUtil.gltbt(
                        1,
                        p[p.length - 1][0].prevclose,
                        !1,
                        marketCode,
                        [b[u]],
                        i.time
                      )
                    );
                }
              }
              (l[4] = timeDatasArr),
                (dataObj.data.td5 = l),
                _utils_util.isFunc(callback) && callback(dataObj);
            },
            null,
            {
              market: marketCode,
              symbol: hqObj.symbol,
              type: "t5"
            }
          );
        },
        S = function() {
          load(
            m(h, papercode, "T5_URL")
              .replace("$rn", new Date().getTime())
              .replace("$symbol", papercode)
              .replace("$cb", "var t5" + papercode),
            function() {
              var r = window["t5" + papercode],
                i = dateArr.length,
                c = [];
              if (((window["t5" + papercode] = null), "" == r))
                dataObj.msg = "empty";
              else {
                dataObj.msg = "";
                for (var p = r.result.data.length, m = 0; p > m; m++) {
                  var u = o.optionCn(r.result.data[m], hqObj, "CN"),
                    v = o.pkt(u, hqObj, "CN", !0);
                  c.push(v);
                }
                var h = c[0] ? c[0][0].prevclose : hqObj.prevclose;
                for (m = i - 1 - p; m > i - 6; m--)
                  c.unshift(tUtil.gltbt(1, h, !1, "CN", [dateArr[m]]));
              }
              (c[4] = timeDatasArr),
                (dataObj.data.td5 = c),
                _utils_util.isFunc(callback) && callback(dataObj);
            },
            null,
            {
              market: marketCode,
              symbol: hqObj.symbol,
              type: "t5"
            }
          );
        },
        $ = function() {
          load(
            m(h, papercode, "T5_URL")
              .replace("$symbol", papercode)
              .replace("$rn", hqObj.today),
            function() {
              var i = "lastfive" + papercode,
                n = window["KLC_ML_" + papercode];
              window["KLC_ML_" + papercode] = null;
              var u, v;
              "" == n
                ? ((dataObj.msg = "empty"),
                  (u = o.ctdb(5, timeDatasArr, hqObj, dateArr, marketCode)))
                : ((dataObj.msg = ""),
                  (v = n.split(",")),
                  (u = o.ctdf(v, timeDatasArr, hqObj, dateArr))),
                o.isBond(papercode)
                  ? ((dataObj.data.td5 = u),
                    _utils_util.isFunc(callback) && callback(dataObj))
                  : load(
                      m(h, papercode, "LAST5_URL")
                        .replace("$rn", new Date().getHours())
                        .replace("$symbol", papercode),
                      function() {
                        var a = window[i];
                        if (!a || !a.lastfive)
                          return (
                            (dataObj.data.td5 = u),
                            void (
                              _utils_util.isFunc(callback) && callback(dataObj)
                            )
                          );
                        for (var r = a.lastfive.length; r--; )
                          for (var n = a.lastfive[r].d, s = u.length - 1; s--; )
                            if (
                              _utils_util.dateUtil.stbds(u[s][0].date, n, null)
                            ) {
                              u[s][0].lastfive = Number(a.lastfive[r].c);
                              break;
                            }
                        (p = hqObj.lastfive ? hqObj.lastfive : 0),
                          (dataObj.data.td5 = u),
                          _utils_util.isFunc(callback) && callback(dataObj);
                      },
                      function() {
                        (dataObj.data.td5 = u),
                          _utils_util.isFunc(callback) && callback(dataObj);
                      },
                      {
                        market: marketCode,
                        symbol: hqObj.symbol,
                        type: "lastfive"
                      }
                    );
            },
            function() {
              (dataObj.data.td5 = o.ctdb(
                5,
                timeDatasArr,
                hqObj,
                dateArr,
                marketCode
              )),
                (dataObj.msg = "error"),
                _utils_util.isFunc(callback) && callback(dataObj);
            },
            {
              market: marketCode,
              symbol: hqObj.symbol,
              type: "t5"
            }
          );
        };
      switch (marketCode) {
        case "HK":
          y();
          break;
        case "US":
          k();
          break;
        case "CFF":
          N(g);
          break;
        case "OTC":
        case "fund":
          R();
          break;
        case "LSE":
          R();
          break;
        case "NF":
          0 == u ? R(g) : T(g);
          break;
        case "option_cn":
          S();
          break;
        case "global_index":
          R(g);
          break;
        case "op_m":
        case "GOODS":
        case "MSCI":
          R();
          break;
        case "CN":
        case "REPO":
          $();
          break;
        case "HF":
          0 == u ? R(g) : U(g);
          break;
        case "":
      }
    };
  })();
});
// end data.t

xh5_define(
  "chart.h5t",
  ["cfgs.settinger", "utils.util", "utils.painter"],
  function(cfgs_settinger, utils_util, utils_painter) {
    "use strict";
    function ViewManger(viewManangerConfig) {
      function STData(stdDataOptions, isMain) {
        function onViewChange(e) {
          _stData_$_obj.setDataRange(e);
          
          _stData_tChartObj &&
            (_stData_tChartObj.linkData(e), _stData_tChartObj.setDataRange());
            
          _stDatak && (_stDatak.linkData(e), _stDatak.setDataRange());
          _stDataD && (_stDataD.linkData(e), _stDataD.setDataRange());
        }
        function funcBool() {
          if (isMain) _view_manager_whatJ = _stData_tDb;

          _stData_A_obj.update(null, !0);

          return (
            "CN" === marketCode &&
            !/^(sh0|sh1|sh5|sz1|sz399)\d+/i.test(stdDataOptions.symbol)
          );
        }

        stdDataOptions = copyProperties(
          {
            symbol: void 0,
            datas: {
              t1: {
                url: void 0,
                dataformatter: void 0
              },
              t5: {
                url: void 0,
                dataformatter: void 0
              }
            },
            linecolor: void 0,
            linetype: void 0
          },
          stdDataOptions || {}
        ); //stdDataOptions

        var _stData_minusArr;
        var _stDataMe = this;
        var marketCode = utils_util.market(stdDataOptions.symbol);
        var marketCodeToID = function(code) {
          switch (code) {
            case "CN":
              return 1;
            case "HK":
              return 2;
            case "US":
              return 3;
          }
          return 1;
        };

        //STDATA
        this.business = stdDataOptions.business;
        this.simple = stdDataOptions.simple;
        var _stDatay = !0;
        this.dp = stdDataOptions.dp;
        this.marketNum = marketCodeToID;
        this.isErr = !1;
        this.witht5 = !0;
        this.symbol = stdDataOptions.symbol;
        this.isMain = isMain;
        this.isCompare = !1;
        this.dAdd = 0;
        this.uid = stdDataOptions.symbol + Math.random();
        this.datas = null;
        this.dataLen = 0;
        this.dataLenOffset = 0;
        this.prevclose = void 0;
        this.labelMaxP = 0;
        this.maxPrice = 0;
        this.labelMinP = Number.MAX_VALUE;
        this.minPrice = Number.MAX_VALUE;
        this.labelMaxVol = 0;
        this.maxVolume = 0;
        this.minPercent = Number.MAX_VALUE;
        this.maxPercent = -Number.MAX_VALUE;
        this.labelPriceCount = void 0;
        this.isTotalRedraw = !0;
        this.realLen = 0;
        this.nfloat =
          0 === viewManangerConfig.nfloat
            ? viewManangerConfig.nfloat
            : viewManangerConfig.nfloat || 2;
        this.ennfloat = viewManangerConfig.ennfloat;
        this.market = marketCode;
        this.date = null;
        this.hq = null;
        this.futureTime = _nf_window_var || _hf_window_var || _gbi_window_var;
        this.gbiTime = _gbi_window_var;
        this.preData = {
          data: 0,
          vPos: null
        };
        this.needMarket = marketCode;
        //STDATA
        this.changeMarket = function(e) {
          var _arr,
            _arrB = [],
            r = e;
            tDataLen = _ViewManager_ObjectA.tcd(marketCode);
          if (
            
            marketCodeToID(_stDataMe.needMarket) != marketCodeToID(marketCode)
          ) {
            _arr = _stData_tDb.get();
            _stData_minusArr = utils_util.tUtil.gata(marketCode);
            for (var n = 0; n < _arr.length; n++)
              if (
                marketCodeToID(_stDataMe.needMarket) <
                marketCodeToID(marketCode)
              ) {
                _arrB.push(
                  _ViewManager_ObjectA.aduk(
                    _arr[n],
                    _stDataMe.market,
                    marketCode,
                    _stData_curDate,
                    _arr[n][0].date
                  )
                );

                _stDataMe.realLen = utils_util.arrIndexOf(
                  _stData_minusArr,
                  _stData_curDate.getHours() +
                    ":" +
                    utils_util.strUtil.zp(_stData_curDate.getMinutes())
                );

                _stDataMe.realLen < 0 && (_stDataMe.realLen = tDataLen);
              } else {
                _arrB.push(_ViewManager_ObjectA.rmuk(_arr[n], marketCode, r)),
                  (_stDataMe.realLen = utils_util.arrIndexOf(
                    _stData_minusArr,
                    _stData_curDate.getHours() +
                      ":" +
                      utils_util.strUtil.zp(_stData_curDate.getMinutes())
                  ));
              }

            (_stDataMe.needMarket = marketCode),
              _stData_tDb.initTState(_arrB),
              (_stDataMe.datas = _arrB[4]),
              _stData_$_obj.setDataRange(),
              _stData_$_obj.createPlayingData();
          }
        }; //
        //STDATA
        var _stData_tChartObj,
          _stDatak,
          _stDataD,
          name,
          _stData_curDate,
          stockUI = new StockUI(this, stdDataOptions);
        this.getName = function() {
          return name || "";
        };
        this.getStockType = function() {
          var e;
          return _stDataMe.hq && (e = _stDataMe.hq.type), e || "";
        };
        //STDATA
        this.viewState = viewState;

        var _stData_tDb = new (function() {
          var cacheData = {};
          var extraDataObj = {
            rsAmount: void 0
          };
          var initState = function(arr) {
            if (arr) {
              var r,
                len = arr.length,
                o = [];
              utils_util.clone(arr, o);
              if (o.length > 5) {
                if (viewManangerConfig.date) {
                  for (
                    var gdate,
                      dy = Number(viewManangerConfig.date.split("-")[2]),
                      diff = 0,
                      d = 0,
                      index = 0,
                      len = o.length;
                    len > index;
                    index++
                  ) {
                    gdate = o[index][0].date.getDate();
                    0 == index
                      ? (diff = Math.abs(gdate - dy))
                      : diff > Math.abs(gdate - dy) && ((diff = Math.abs(gdate - dy)), (d = index));
                      d >= 5
                      ? ((r = o.splice(d - 4, 5)),
                        (viewState.start = 4),
                        (viewState.end = 5))
                      : ((r = o.splice(0, 5)),
                        (viewState.start = d),
                        (viewState.end = d + 1)),
                      (cacheData.tv = viewState.start),
                      (cacheData.tb = viewState.end);
                    }


                }
              } else {
                r = o;
                cacheData.tv = viewManangerConfig.date ? 0 : 4;
                cacheData.tb = len;
              }
              cacheData.t = r;
            }
          };
          //
          this.get = function(key) {
            return key ? cacheData[key] : cacheData.t;
          };
          this.set = function(key, data) {
            "undefined" != typeof cacheData[key] && (cacheData[key] = data);
          };
          this.initState = initState;
          this.initTState = function(dataArr) {
            initState(dataArr);
          };
          this.extraDataObj = extraDataObj;
          this.initExtraData = function() {
            var http = viewManangerConfig.ssl ? "https" : "http",
              url =
                http +
                "://stock.finance.sina.com.cn/stock/api/jsonp.php/$cb/StockService.getAmountBySymbol?_=$rn&symbol=$symbol",
              window_var_key = "KKE_ShareAmount_" + stdDataOptions.symbol;
            utils_util.load(
              url
                .replace("$symbol", stdDataOptions.symbol)
                .replace("$rn", String(new Date().getDate()))
                .replace("$cb", "var%20" + window_var_key + "="),
              function() {
                var arr = window[window_var_key];
                if (arr) {
                  for (var t, a = [], i = arr.length; i--; ) {
                    t = arr[i];
                    a.push({
                      amount: Number(t.amount),
                      date: dateUtil.sd(t.date)
                    });
                  }

                  a.length && (extraDataObj.rsAmount = a);
                }
              }
            );
          };

          this.gc = function() {
            cacheData = null;
            extraDataObj = null;
          };
        })();

        var _stData_$_obj = new (function() {
          var _stData_$_obj_setDef = function() {
            (_stDataMe.minPrice = Number.MAX_VALUE),
              (_stDataMe.maxPrice = 0),
              (_stDataMe.minPercent = Number.MAX_VALUE),
              (_stDataMe.maxPercent = -Number.MAX_VALUE),
              (_stDataMe.minavgPrice = Number.MAX_VALUE),
              (_stDataMe.maxavgPrice = 0),
              (_stDataMe.maxVolume = 0);
          };

          var _stData_$_obj_fuca = function() {
            function setting(e) {
              var t = Math.max(
                Math.abs(e - _stDataMe.maxPrice),
                Math.abs(e - _stDataMe.minPrice)
              );
              var a = Math.max(
                Math.abs(e - _stDataMe.maxavgPrice),
                Math.abs(e - _stDataMe.minavgPrice)
              );

              switch (
                (t / e > 0.45 &&
                  "US" != marketCode &&
                  (_viem_manager_cfg.datas.scaleType = "price"),
                t / e > 0.1 &&
                  "newstock" == _viem_manager_cfg.datas.scaleType &&
                  (_viem_manager_cfg.datas.scaleType = "price"),
                _viem_manager_cfg.datas.scaleType)
              ) {
                case "newstock":
                  (_stDataMe.minPrice = Number(e) - 0.45 * e),
                    (_stDataMe.maxPrice = Number(e) + 0.45 * e);
                  break;
                case "tpct":
                  (_stDataMe.minPrice =
                    _stDataMe.minPrice < Number(e) - 0.1 * e
                      ? _stDataMe.minPrice
                      : Number(e) - 0.1 * e),
                    (_stDataMe.maxPrice =
                      _stDataMe.maxPrice > Number(e) + 0.1 * e
                        ? _stDataMe.maxPrice
                        : Number(e) + 0.1 * e);
                  break;
                case "pct":
                  var i = _stDataMe.maxPrice - _stDataMe.minPrice;
                  (_stDataMe.minPrice -= 0.05 * i),
                    (_stDataMe.maxPrice += 0.05 * i);
                  break;
                case "price":
                default:
                  (_stDataMe.minPrice = Number(e) - Number(t)),
                    (_stDataMe.maxPrice = Number(e) + Number(t)),
                    (_stDataMe.minavgPrice = Number(e) - Number(a)),
                    (_stDataMe.maxavgPrice = Number(e) + Number(a));
              }

              _stDataMe.maxPercent = Math.max((_stDataMe.maxPrice - e) / e, 0);
              _stDataMe.minPercent = Math.min((_stDataMe.minPrice - e) / e, 0);
              _stDataMe.maxavgPercent = Math.max(
                (_stDataMe.maxavgPrice - e) / e,
                0
              );
              _stDataMe.minavgPercent = Math.min(
                (_stDataMe.minavgPrice - e) / e,
                0
              );
            }
            //

            _stDataMe.isCompare = _view_manager_view.getAllStock().length > 1;
            _stDataMe.dAdd = _view_manager_view.dAdd;

            var t;
            _stDataMe.datas &&
              0 == _stDataMe.datas[0][0].volume &&
              _stDataMe.hq.time > "09:30" &&
              "CN" == _stDataMe.market &&
              (t = _stDataMe.datas[0][0].price);

            _stDataMe.preData.data = _stDataMe.hq.preopen
              ? t
                ? t
                : _stDataMe.hq.preopen
              : _stDataMe.preData.data;

            for (var a = 0, len = _stDataMe.datas.length; len > a; a++) {
              for (
                var n,
                  o = Number(_stDataMe.datas[0][0].prevclose),
                  s = 0,
                  l = _stDataMe.dataLen;
                l > s;
                s++
              ) {
                if (
                  ((n = _stDataMe.datas[a][s]),
                  "LSE" === _stDataMe.market || "MSCI" === _stDataMe.market)
                ) {
                  if (n.price <= 0) continue;
                } else if (n.price <= 0 || n.avg_price <= 0) continue;
                ("HK" == _stDataMe.market &&
                  _stDataMe.hq &&
                  "indx" == _stDataMe.hq.type) ||
                "LSE" == _stDataMe.market ||
                "MSCI" === _stDataMe.market
                  ? ((_stDataMe.maxPrice = Math.max(
                      _stDataMe.maxPrice,
                      n.price,
                      o
                    )),
                    (_stDataMe.minPrice = Math.min(
                      _stDataMe.minPrice,
                      n.price,
                      o
                    )))
                  : stbd(_stDataMe.datas[a][0].date, _stDataMe.hq.date) &&
                    "CN" == _stDataMe.market
                  ? ((_stDataMe.maxPrice = Math.max(
                      _stDataMe.maxPrice,
                      n.price,
                      n.avg_price,
                      o,
                      _stDataMe.preData.data
                    )),
                    (_stDataMe.minPrice = Math.min(
                      _stDataMe.minPrice,
                      n.price,
                      n.avg_price,
                      o,
                      _stDataMe.preData.data
                    )))
                  : ((_stDataMe.maxPrice = Math.max(
                      _stDataMe.maxPrice,
                      n.price,
                      n.avg_price,
                      o
                    )),
                    (_stDataMe.minPrice = Math.min(
                      _stDataMe.minPrice,
                      n.price,
                      n.avg_price,
                      o
                    ))),
                  stbd(_stDataMe.datas[a][0].date, _stDataMe.hq.date) &&
                  "CN" == _stDataMe.market
                    ? ((_stDataMe.maxavgPrice = Math.max(
                        _stDataMe.maxavgPrice,
                        n.price,
                        o,
                        _stDataMe.preData.data
                      )),
                      (_stDataMe.minavgPrice = Math.min(
                        _stDataMe.minavgPrice,
                        n.price,
                        o,
                        _stDataMe.preData.data
                      )))
                    : ((_stDataMe.maxavgPrice = Math.max(
                        _stDataMe.maxavgPrice,
                        n.price,
                        o
                      )),
                      (_stDataMe.minavgPrice = Math.min(
                        _stDataMe.minavgPrice,
                        n.price,
                        o
                      )));
                _stDataMe.labelMaxVol = _stDataMe.maxVolume = Math.max(
                  _stDataMe.maxVolume,
                  0,
                  n.volume
                );
              }
              setting(o);
            }

            (_stDataMe.minPrice < -1e8 ||
              _stDataMe.maxPrice - _stDataMe.minPrice < 1e-6) &&
              (dateUtil.stbd(_stDataMe.datas[0][0].date, _stDataMe.hq.date) &&
                ((_stDataMe.datas[0][0].price = _stDataMe.hq.price),
                (_stDataMe.datas[0][0].avg_price = _stDataMe.hq.price),
                (_stDataMe.datas[0][0].prevclose = _stDataMe.hq.prevclose),
                (_stDataMe.datas[0][0].volume = _stDataMe.hq.totalVolume)),
              (_stDataMe.minPrice = o - 0.01 * o),
              (_stDataMe.maxPrice = o + 0.01 * o),
              (_stDataMe.maxPercent = 0.01),
              (_stDataMe.minPercent = -0.01),
              _stDataMe.hq.totalVolume > 0 &&
                dateUtil.stbd(_stDataMe.datas[0][0].date, _stDataMe.hq.date) &&
                !isNaN(_stDataMe.hq.totalAmount) &&
                (_stDataMe.datas[0][0].volume =
                  _stDataMe.hq.totalAmount / _stDataMe.hq.totalVolume));

            var c = ht5_c(_stDataMe.maxVolume, 0, 0, !0);
            _stDataMe.labelMaxVol = c[0];
            var d = 0.005;

            _stDataMe.maxPercent < d &&
              ("US" !== _stDataMe.market || "LSE" !== _stDataMe.market) &&
              "pct" !== _viem_manager_cfg.datas.scaleType &&
              ((_stDataMe.minPrice = _stDataMe.maxavgPrice = o - o * d),
              (_stDataMe.maxPrice = _stDataMe.minavgPrice = o + o * d),
              (_stDataMe.maxPercent = _stDataMe.maxavgPercent = d),
              (_stDataMe.minPercent = _stDataMe.minavgPercent = -d));

            var p;
            /^s[hz]51\d{4}$/.test(viewManangerConfig.symbol) && (p = "fund"),
              p &&
                "fund" === p &&
                "pct" !== _viem_manager_cfg.datas.scaleType &&
                d > Math.abs(_stDataMe.minPercent) &&
                ((d = Math.abs(_stDataMe.minPercent)),
                (viewManangerConfig.nfloat = _stDataMe.nfloat = 3)),
              ("gb_brk$a" === _stDataMe.symbol ||
                "usr_brk$a" === _stDataMe.symbol) &&
                (viewManangerConfig.nfloat = _stDataMe.nfloat = 1);
          };
          // end funca

          var _stData_$_obj_createPlayingData = function() {
            var rowindex,
              t,
              a,
              i = _viem_manager_cfg.DIMENSION.h_t,
              r = i * _viem_manager_cfg.DIMENSION.P_HV,
              n = i * (1 - _viem_manager_cfg.DIMENSION.P_HV);
            t = _stDataMe.labelMinP;
            a = _stDataMe.labelMaxP;
            var prevclose,
              s = _stDataMe.labelMaxVol;
            if (_stDataMe.datas) {
              var datasLen = _stDataMe.datas.length;
              for (rowindex = 0; datasLen > rowindex; rowindex++) {
                prevclose = _stDataMe.datas[0][0].prevclose;
                for (
                  var data,
                    show_underlay_vol =
                      _viem_manager_cfg.custom.show_underlay_vol,
                    p2p3 = _stDataMe.isCompare ? "ppp" : "pp",
                    dataLen = _stDataMe.dataLen,
                    colIndex = 0;
                  dataLen > colIndex;
                  colIndex++
                ) {
                  data = _stDataMe.datas[rowindex][colIndex];
                  if (!data) return;

                  if (
                    data.price <= 0 &&
                    _stDataMe.realLen >= colIndex &&
                    colIndex > 0
                  ) {
                    data.price = _stDataMe.hq.price;
                    data.avg_price =
                      _stDataMe.datas[rowindex][colIndex - 1].avg_price;
                    data.volume = 0;

                    data.change = data.price - prevclose;
                    data.percent = data.change / prevclose;
                    data.py = xh5_PosUtil[p2p3](data.price, t, a, i, prevclose);
                    data.ay = xh5_PosUtil[p2p3](
                      data.avg_price,
                      t,
                      a,
                      i,
                      prevclose
                    );
                    show_underlay_vol &&
                      (data.vy = xh5_PosUtil.vp(data.volume, s, r) + n);
                  }
                }
              }

              _stDataMe.preData.vPos =
                "CN" == _stDataMe.market &&
                1 == datasLen &&
                stbd(_stDataMe.hq.date, _stDataMe.datas[0][0].date)
                  ? xh5_PosUtil[p2p3](
                      _stDataMe.preData.data,
                      t,
                      a,
                      i,
                      prevclose
                    )
                  : null;
            }
          };

          this.createPlayingData = _stData_$_obj_createPlayingData;

          this.extValues = function() {
            _stData_$_obj_setDef();
            _stData_$_obj_fuca();
          };

          this.setDataRange = function(a) {
            var arr = _stData_tDb.get();
            if (arr) {
              viewState.dataLength = arr.length;
              var start = viewState.start,
                end = viewState.end;

              isNaN(start) || isNaN(end)
                ? ((end = _stData_tDb.get("tb") || 5),
                  (start = _stData_tDb.get("tv") || 4),
                  (viewState.start = start),
                  (viewState.end = end))
                : (a &&
                    end + 1 > arr.length &&
                    (viewState.end = end = arr.length),
                  _stData_tDb.set("tv", start),
                  _stData_tDb.set("tb", end));

              var o = [],
                s = [];

              if (arr.length < 2) {
                s = arr;
                o.push(arr);
              } else
                for (var l = start; end > l; l++) {
                  s = s.concat(arr[l]);
                  o.push(arr[l]);
                }
              _stDataMe.datas = o;
              _stDataMe.lineDatas = s;
              _stDataMe.dataLen = o[0].length;
              _stData_$_obj_setDef();
              _stData_$_obj_fuca();
            }
          };
        })();
        //_stData_$_obj

        var K = {},
          B = !1,
          ae = !1,
          ie = {},
          curTime = new Date().getTime(),
          updateCurDate = function() {
            var e;
            _stData_curDate = new Date();
            e = 60 * _stData_curDate.getTimezoneOffset() * 1e3;
            _stData_curDate.setTime(_stData_curDate.getTime() + e);
            _stData_curDate.setHours(_stData_curDate.getHours() + 8);
          },
          ce = function(e) {
            updateCurDate();

            if (!_stData_minusArr)
              switch (marketCode) {
                case "HF":
                  _stData_minusArr = utils_util.tUtil.gata(
                    marketCode,
                    _hf_window_var.time
                  );
                  break;
                case "NF":
                  _stData_minusArr = utils_util.tUtil.gata(
                    marketCode,
                    _nf_window_var.time
                  );
                  break;
                case "global_index":
                  _stData_minusArr = utils_util.tUtil.gata(
                    marketCode,
                    _gbi_window_var.time
                  );
                  break;
                default:
                  _stData_minusArr = utils_util.tUtil.gata(marketCode);
              }

            e.index = utils_util.arrIndexOf(_stData_minusArr, e.time);
            var index = e.index;
            switch (_stDataMe.market) {
              case "CN":
              case "REPO":
              case "option_cn":
              case "fund":
              case "OTC":
              case "global_index":
              case "NF":
                e.index < 0 &&
                  (e.time >= "11:30" &&
                    e.time < "13:00" &&
                    (index = utils_util.arrIndexOf(_stData_minusArr, "11:29")),
                  "NF" == _stDataMe.market &&
                    ("21:00" == _nf_window_var.time[0][0]
                      ? e.time < "09:00" &&
                        e.time >= "02:30" &&
                        (index = utils_util.arrIndexOf(
                          _stData_minusArr,
                          "09:00"
                        ))
                      : e.time <= _nf_window_var.time[0][0] &&
                        (index = utils_util.arrIndexOf(
                          _stData_minusArr,
                          _nf_window_var.time[0][0]
                        ))));
                break;
              case "HK":
                e.time >= "12:00" && e.time < "13:00" && (index = 150),
                  e.time >= "16:00" &&
                    e.time < "16:10" &&
                    (index = _stData_minusArr.length - 1);
                break;
              case "HF":
                "hf_CHA50CFD" == _stDataMe.symbol &&
                  e.time > "16:35" &&
                  e.time < "17:00" &&
                  (index = 455);
            }
            e.index = index;
            _stDataMe.realLen = index;
            if (
              (_stDataMe.hq.open == _stDataMe.hq.prevclose &&
                _stDataMe.hq.high == _stDataMe.hq.prevclose &&
                _stDataMe.hq.low == _stDataMe.hq.prevclose &&
                0 > index) ||
              _stDataMe.hq.time < "09:30"
            )
              switch (_stDataMe.market) {
                case "CN":
                  _stDataMe.realLen =
                    _stDataMe.hq.time >= "15:00" ? tDataLen - 1 : 0;
                  break;
                case "REPO":
                  _stDataMe.realLen =
                    _stDataMe.hq.time >= "15:30" ? tDataLen - 1 : 0;
                  break;
                case "NF":
                case "HF":
                case "global_index":
                case "LSE":
                case "GOODS":
                case "MSCI":
                  break;
                default:
                  _stDataMe.realLen = 0;
              }
          };
        //
        var before5Days = function(d1, d2) {
          var t1 = d1.getTime(),
            t2 = d2.getTime();
          return Math.floor((t1 - t2) / 864e5) > 5;
        };
        var _stData_A_obj = new (function() {
          var a,
            n = !0,
            o = function(e) {
              var times;
              switch (marketCode) {
                case "HF":
                  times = _hf_window_var.time;
                  break;
                case "NF":
                  times = _nf_window_var.time;
                  break;
                case "global_index":
                  times = _gbi_window_var.time;
                  break;
                default:
                  times = [];
              }
              var i = utils_util.tUtil.gltbt(
                1,
                e.price,
                !0,
                _stDataMe.needMarket,
                [e.date],
                times
              );

              "NF" == marketCode && e.time >= "21:00"
                ? ((i[0].date = dateUtil.dd(e.date)),
                  i[0].date.setDate(e.date.getDate() + 1))
                : (i[0].date = dateUtil.dd(e.date)),
                (i[0].prevclose = e.price),
                (i[0].price = e.price),
                (i[0].volume = 0);
              for (
                var r = 0,
                  n = 0,
                  datas = _stData_tDb.get(),
                  index = 0,
                  len = datas.length;
                len > index;
                index++
              )
                datas[index][0].totalVolume &&
                  ((n += Number(datas[index][0].totalVolume)), r++);
              (i[0].lastfive = n / r / 390 || 0),
                stbd(datas[4][0].date, e.date)
                  ? "NF" == marketCode && e.time >= "21:00"
                    ? (datas.shift(), datas.push(i))
                    : (datas[4] = i)
                  : (datas.shift(), datas.push(i)),
                _stData_tDb.initTState(datas),
                (_stDataMe.datas = [datas[4]]),
                (_stDataMe.date = dateUtil.ds(e.date)),
                (_stDataMe.realLen = 0);
            };
          var s = 0,
            _stData_funL = function(e, a, l) {
              function c() {
                switch (
                  (o(_stDataMe.hq),
                  onViewChange(),
                  _stData_$_obj.createPlayingData(),
                  _stDataMe.market)
                ) {
                  case "US":
                    _stData_$_obj.extValues();
                    break;
                  case "NF":
                    _nf_window_var.inited = 1;
                }
                utils_util.isFunc(a) && a();
              }
              function p() {
                var e = new Date().getTime() - curTime;
                return !isNaN(_view_manager_t_rate) &&
                  _view_manager_t_rate > 0 &&
                  e >= 1e3 * Number(_view_manager_t_rate) &&
                  0 != _stDataMe.realLen &&
                  _stDataMe.hq.isUpdateTime
                  ? ((curTime = new Date().getTime()),
                    g(b, _stDataMe.hq, a),
                    !0)
                  : !1;
              }
              function h() {
                function i() {
                  stbd(_stDataMe.hq.date, y[4][0].date) &&
                    _stDataMe.hq.time > "16:00" &&
                    o.price < 0 &&
                    ((o.price = _stDataMe.hq.price),
                    (o.avg_price = y[4][y[4].length - 2].avg_price),
                    (o.volume = 0));
                }
                function n() {
                  stbd(_stDataMe.hq.date, y[4][0].date) &&
                    _stDataMe.hq.time > "16:00" &&
                    ((o.price = _stDataMe.hq.price),
                    (o.avg_price = y[4][y[4].length - 2].avg_price),
                    (o.volume = 0),
                    (o.time = _stDataMe.hq.time),
                    o.avg_price < 0 && (o.avg_price = _stDataMe.hq.price));
                }
                if (!_stDataMe.hq.isUpdateTime) {
                  var o = y[4][y[4].length - 1];
                  switch (_stDataMe.market) {
                    case "US":
                      i();
                      break;
                    case "HK":
                      n();
                  }
                  return (
                    ce(_stDataMe.hq),
                    onViewChange(!0),
                    _stData_$_obj.createPlayingData(),
                    utils_util.isFunc(a) && a(),
                    !0
                  );
                }
                return (
                  "HK" == _stDataMe.market && l && g(b, e, a),
                  (_stDataMe.date =
                    "NF" == _stDataMe.market && _stDataMe.hq.time >= "21:00"
                      ? dateUtil.ds(y[4][0].date)
                      : _stDataMe.hq.today),
                  !1
                );
              }
              var b,
                y = _stData_tDb.get();
              switch (_stDataMe.needMarket) {
                case "HF":
                  _stData_minusArr = utils_util.tUtil.gata(
                    _stDataMe.needMarket,
                    _hf_window_var.time
                  );
                  break;
                case "NF":
                  _stData_minusArr = utils_util.tUtil.gata(
                    _stDataMe.needMarket,
                    _nf_window_var.time
                  );
                  break;
                case "global_index":
                  _stData_minusArr = utils_util.tUtil.gata(
                    _stDataMe.needMarket,
                    _gbi_window_var.time
                  );
                  break;
                default:
                  _stData_minusArr = utils_util.tUtil.gata(
                    _stDataMe.needMarket
                  );
              }
              if (e && e.date && _stDataMe.datas && !viewManangerConfig.date) {
                if (((n = !1), (b = y[4]), _stDataMe.hq.isDateChange)) {
                  if (
                    ("NF" == _stDataMe.market &&
                      _nf_window_var &&
                      _nf_window_var.time[0][0] < "21:00") ||
                    "NF" != _stDataMe.market
                  )
                    return void c();
                } else if (
                  ("CN" == _stDataMe.market &&
                    !stbd(_stDataMe.hq.date, y[4][0].date) &&
                    _stDataMe.hq.time < "09:05") ||
                  ("NF" == _stDataMe.market &&
                    stbd(_stDataMe.hq.date, y[4][0].date) &&
                    _nf_window_var &&
                    "21:00" == _nf_window_var.time[0][0] &&
                    _stDataMe.hq.time >= _nf_window_var.time[0][0]) ||
                  ("HF" == _stDataMe.market &&
                    !stbd(_stDataMe.hq.date, y[4][0].date) &&
                    0 != _stDataMe.hq.date.getDay() &&
                    6 != _stDataMe.hq.date.getDay() &&
                    _stDataMe.hq.time >= _hf_window_var.time[0][0])
                )
                  return void c();
                if (!p() && !h()) {
                  if (
                    (_stDataMe.datas && (K = y[4][0]), before5Days(e.date, y[4][0].date))
                  )
                    return void (_stDataMe.realLen = tDataLen);
                  (name = e.name || ""), (_stDataMe.hq = e);
                  var _ =
                    e.date.getHours() < 10
                      ? "0" + e.date.getHours()
                      : e.date.getHours();
                  if (
                    ((_stDataMe.time =
                      _ + ":" + utils_util.strUtil.zp(e.date.getMinutes())),
                    0 == e.index && u(b, e),
                    utils_util.arrIndexOf(_stData_minusArr, _stDataMe.time) &&
                      e.index > 0 &&
                      (utils_util.arrIndexOf(_stData_minusArr, _stDataMe.time) -
                        _stDataMe.realLen <=
                      1
                        ? u(b, e)
                        : g(b, e, a),
                      1 == e.index && 0 == s))
                  )
                    return (s = 1), void g(b, e, a);
                  _ViewManager_funcA(_stDataMe.market) &&
                    ((_stDataMe.hq.open == _stDataMe.hq.prevclose &&
                      _stDataMe.hq.high == _stDataMe.hq.prevclose &&
                      _stDataMe.hq.low == _stDataMe.hq.prevclose &&
                      _stDataMe.hq.index < 0) ||
                      e.time < "09:30") &&
                    ("CN" == _stDataMe.market
                      ? ((b[0].avg_price = e.price),
                        (b[0].volume = e.totalVolume))
                      : "option_cn" == _stDataMe.market
                      ? ((b[0].inventory = e.position || e.holdingAmount),
                        (b[0].holdPosition = e.position || e.holdingAmount))
                      : "HK" == _stDataMe.market &&
                        (b[0].avg_price =
                          e.totalAmount / e.totalVolume || e.price)),
                    5 == viewState.end &&
                      (onViewChange(!0), _stData_$_obj.createPlayingData()),
                    utils_util.isFunc(a) && a();
                }
              }
            },
            c = -1,
            p = -1,
            h = -1,
            u = function(e, t) {
              var i = e;
              ce(t);
              var r = i[_stDataMe.realLen];
              r &&
                (K && !a
                  ? (B
                      ? ((t.volume = c = t.totalVolume - (K.totalVolume || 0)),
                        (t.amount = p = t.volume * t.price),
                        (t.totalAmount = t.amount + K.totalAmount),
                        (t.avg_price = h =
                          t.totalAmount / t.totalVolume || t.price))
                      : ((t.volume = 0),
                        (t.avg_price = h =
                          K.totalAmount / K.totalVolume || t.price),
                        (t.totalAmount = t.totalVolume * t.avg_price),
                        (B = !0)),
                    (K.totalVolume = t.totalVolume),
                    (K.totalAmount = t.totalAmount))
                  : (ae
                      ? (t.volume = t.totalVolume - ie.totalVolume || 0)
                      : ((t.volume = 0), (ae = !0)),
                    (ie.totalVolume = t.totalVolume)),
                ("option_cn" == _stDataMe.market || "NF" == _stDataMe.market) &&
                  ((r.inventory = t.position || t.holdingAmount),
                  (r.holdPosition = t.position || t.holdingAmount)),
                "CN" == _stDataMe.market
                  ? (r.avg_price = t.avg_price || r.price)
                  : (t.index > 1
                      ? (r.avg_price =
                          (r.avg_price > 0 && r.avg_price) ||
                          (i[t.index - 1].avg_price * t.index + t.price) /
                            (t.index + 1) ||
                          r.price)
                      : "fund" == _stDataMe.market ||
                        (r.avg_price = r.price || t.price),
                    0 == t.index &&
                      (r.avg_price = t.totalAmount / t.totalVolume || t.price),
                    (r.volume = r.volume || 0)),
                isNaN(t.volume) && (t.volume = 0),
                "HK" != _stDataMe.market &&
                  "NF" != _stDataMe.market &&
                  (r.volume += t.volume),
                (r.price = t.price),
                r.volume <= 0 && (r.volume = 0));
            },
            g = function(a, n, o) {
              var s = {
                symbol: n.symbol,
                date: n.today,
                withT5: 0,
                withI: !1,
                faker: "",
                dataformatter: stdDataOptions.datas.t1.dataformatter,
                ssl: viewManangerConfig.ssl,
                assisthq: viewManangerConfig.assisthq
              };
              (B = ae = !1),
                "LSE" == _stDataMe.market &&
                  (s.symbol = viewManangerConfig.rawsymbol),
                KKE.api("datas.t.get", s, function(e) {
                  (a = e.data.td1), ce(_stDataMe.hq);
                  var i = _stData_tDb.get();
                  ("NF" == _stDataMe.market &&
                    ("21:00" == _nf_window_var.time[0][0] &&
                      _stDataMe.hq.time >= _nf_window_var.time[0][0] &&
                      0 != _stDataMe.hq.date.getDay() &&
                      6 != _stDataMe.hq.date.getDay() &&
                      (a[0].date = i[4][0].date),
                    ("09:30" == _nf_window_var.time[0][0] ||
                      "09:15" == _nf_window_var.time[0][0]) &&
                      stbd(i[4][0].date, _stDataMe.hq.date) &&
                      _stDataMe.hq.time <= _nf_window_var.time[0][0])) ||
                    ("HF" == _stDataMe.market &&
                      _stDataMe.hq.time > _hf_window_var.time[0][0] &&
                      0 != _stDataMe.hq.date.getDay() &&
                      6 != _stDataMe.hq.date.getDay() &&
                      (a[0].date = _stDataMe.hq.date),
                    (i[4] = a),
                    _stData_tDb.initTState(i),
                    "CN" == _stDataMe.market &&
                      "HK" == _stDataMe.needMarket &&
                      ((_stDataMe.needMarket = "CN"),
                      _view_manager_view.changeData(_stDataMe)),
                    5 == viewState.end &&
                      (onViewChange(!0), _stData_$_obj.createPlayingData()),
                    utils_util.isFunc(o) && o());
                });
            },
            updateT5Data = function(a, r, n) {
              var o = {
                symbol: r.symbol,
                date: r.today,
                withT5: 1,
                dist5: 1,
                withI: !1,
                faker: "",
                dataformatter: stdDataOptions.datas.t1.dataformatter,
                ssl: viewManangerConfig.ssl
              };
              (B = ae = !1),
                "LSE" == _stDataMe.market &&
                  (o.symbol = viewManangerConfig.rawsymbol),
                KKE.api("datas.t.get", o, function(e) {
                  (a = e.data.td1),
                    _stData_tDb.initTState(e.data.td5),
                    ce(_stDataMe.hq),
                    utils_util.isFunc(n) && n(),
                    _view_manager_view.moving(
                      viewState.start,
                      viewState.end,
                      "T5"
                    ),
                    loading.hide();
                });
            };
          this.updateT5Data = updateT5Data;
          this.update = function(funca, r, o, marketCode, c) {
            var apiname,
              apiOptions,
              _market,
              h = "",
              u = "";

            _market = marketCode
              ? marketCode
              : utils_util.market(stdDataOptions.symbol);

            "US" === _market
              ? (h = 1 === viewManangerConfig.assisthq ? ",gb_ixic" : u)
              : "HK" === _market &&
                (h = 1 === viewManangerConfig.assisthq ? ",rt_hkHSI" : u);
            o
              ? ((apiname = "datas.hq.parse"),
                (apiOptions = {
                  symbol: stdDataOptions.symbol + h,
                  hqStr: o,
                  market: _market,
                  ssl: viewManangerConfig.ssl
                }))
              : ((apiname = "datas.hq.get"),
                (apiOptions = {
                  symbol: stdDataOptions.symbol + h,
                  delay: !0,
                  cancelEtag: n,
                  ssl: viewManangerConfig.ssl
                }));
            KKE.api(apiname, apiOptions, function(t) {
              _stData_funL(t.dataObj[stdDataOptions.symbol], funca, c);
            });
          };
        })();
        //_stData_me_obj

        var pe = new (function() {
          var r = void 0,
            o = 1,
            s = function(func) {
              o > 2 ||
                (_ViewManager_me.re(globalCfg.e.T_DATA_LOADED),
                utils_util.isFunc(func) && func(),
                o++);
            },
            l = function(e) {
              var t = e,
                a = !1;
              return (a =
                t.open == t.prevclose &&
                t.high == t.prevclose &&
                t.low == t.prevclose &&
                t.index < 0
                  ? !0
                  : t.time < "09:30");
            },
            c = function(a, i) {
              var r,
                n,
                o = a;
              switch (marketCode) {
                case "HF":
                  n = _hf_window_var.time;
                  break;
                case "NF":
                  n = _nf_window_var.time;
                  break;
                case "global_index":
                  n = _gbi_window_var.time;
                  break;
                default:
                  n = [];
              }
              var s = utils_util.tUtil.gltbt(
                1,
                o.hq.price,
                !0,
                _stDataMe.market,
                [o.hq.date],
                n
              );
              return (
                (s[0].name = o.hq.name),
                (s[0].symbol = stdDataOptions.symbol),
                (s[0].today = utils_util.dateUtil.ds(o.hq.date, "-")),
                (r = i),
                (r[4] = s),
                (_stDataMe.realLen = 0),
                r
              );
            };
          this.initData = function(onChangeView) {
            var viewId = viewState.viewId;
            if (r != viewId) {
              (r = viewId),
                null != _stDataMe.datas &&
                  _stData_tDb.initTState(viewId, _stDataMe.tDb.get());
              var h = {
                assisthq: viewManangerConfig.assisthq,
                ssl: viewManangerConfig.ssl,
                symbol: stdDataOptions.symbol,
                date: viewManangerConfig.date,
                withT5: 1,
                dist5: viewManangerConfig.dist5,
                withI: !0,
                faker: _stDataMe.needMarket,
                dataformatter: stdDataOptions.datas.t1.dataformatter
              };
              switch (_stDataMe.needMarket) {
                case "HF":
                  _stData_minusArr = utils_util.tUtil.gata(
                    _stDataMe.needMarket,
                    _hf_window_var.time
                  );
                  break;
                case "NF":
                  _stData_minusArr = utils_util.tUtil.gata(
                    _stDataMe.needMarket,
                    _nf_window_var.time
                  );
                  break;
                case "global_index":
                  _stData_minusArr = utils_util.tUtil.gata(
                    _stDataMe.needMarket,
                    _gbi_window_var.time
                  );
                  break;
                case "LSE":
                  h.symbol = viewManangerConfig.rawsymbol;
                default:
                  _stData_minusArr = utils_util.tUtil.gata(
                    _stDataMe.needMarket
                  );
              }
              loading.show();
              KKE.api("datas.t.get", h, function(e) {
                _view_manager_view.hasHistory &&
                  "history" == e.msg &&
                  _view_manager_view.hasHistory(M);

                var d = e.data.hq.status,
                  p = "",
                  u = Number(e.data.hq.state);

                if ("empty" == e.msg)
                  switch (_stDataMe.market) {
                    case "CN":
                      3 == d &&
                        ((p = globalCfg.delisted),
                        _viem_manager_tipObj.showTip({
                          txt: p,
                          parent: dom_elA,
                          noBtn: !0
                        }));
                  }
                if ("error" == e.msg || "nohistory" == e.msg) {
                  if (
                    (isMain &&
                      "nohistory" == e.msg &&
                      ((M = 0),
                      _view_manager_view.hasHistory &&
                        _view_manager_view.hasHistory(M),
                      _viem_manager_tipObj.showTip({
                        txt: globalCfg.nohistoryt,
                        parent: dom_elA,
                        noBtn: !0
                      })),
                    (_stDataMe.isErr = !0),
                    isMain && e.data && e.data.hq)
                  ) {
                    if (d)
                      switch (_stDataMe.market) {
                        case "CN":
                          switch (d) {
                            case 2:
                              p = globalCfg.notlisted;
                              break;
                            case 3:
                              p = globalCfg.delisted;
                              break;
                            case 0:
                              p = globalCfg.norecord;
                          }
                          break;
                        case "HK":
                          switch (d) {
                            case 5:
                              p = globalCfg.notlisted;
                              break;
                            case 0:
                              p = globalCfg.delisted;
                          }
                      }
                    else p = globalCfg.norecord;
                    if (p && 0 != u) {
                      var v,
                        g = {
                          txt: p,
                          parent: dom_elA,
                          noBtn: !0
                        };
                      if (!(_viem_manager_cfg.DIMENSION.getStageW() < 200))
                        return (
                          _viem_manager_tipObj.showTip({
                            txt: p,
                            parent: dom_elA,
                            noBtn: !0
                          }),
                          void loading.hide()
                        );
                      (g.bgStyle = {
                        padding: 0,
                        top: "0px"
                      }),
                        v ||
                          ((v = new utils_util.TipM(_viem_manager_cfg.COLOR)),
                          v.genTip(g));
                    }
                  }
                  if (0 != u && 7 != u) {
                    if ((_view_manager_view.onResize(), 1 != d))
                      return void _view_manager_view.removeCompare([h.symbol]);
                    _stDataMe.isErr = !1;
                  } else _stDataMe.isErr = !1;
                }

                _stDataMe.hq = e.data.hq;
                r = void 0;
                h.td1 = e.data.td1;
                var historyData;
                _stData_curDate = new Date();
                var y = 60 * _stData_curDate.getTimezoneOffset() * 1e3;
                _stData_curDate.setTime(_stData_curDate.getTime() + y);
                _stData_curDate.setHours(_stData_curDate.getHours() + 8);
                name = _stDataMe.hq.name || "";
                ce(_stDataMe.hq);
                if (
                  l(_stDataMe.hq, e.data.td5) &&
                  _ViewManager_funcA(_stDataMe.market)
                ) {
                  "history" == e.msg
                    ? ((historyData = e.data.td5),
                      historyData[4][0].date ||
                        (historyData[4][0].date = _stDataMe.hq.date))
                    : (historyData = c(_stDataMe, e.data.td5));
                } else {
                  historyData = e.data.td5;
                  "NF" != _stDataMe.market ||
                    !_nf_window_var ||
                    ("09:30" != _nf_window_var.time[0][0] &&
                      "09:15" != _nf_window_var.time[0][0]) ||
                    (stbd(historyData[4][0].date, _stDataMe.hq.date) &&
                      _stDataMe.hq.time <= _nf_window_var.time[0][0] &&
                      (historyData = c(_stDataMe, e.data.td5)));
                  historyData &&
                    !historyData[4][0].date &&
                    (historyData[4][0].date = _stDataMe.hq.date);
                }

                _view_manager_view.historyData = historyData;
                _stDataMe.date =
                  (e.data.td1 && e.data.td1[0].today) || _stDataMe.hq.date;

                _stData_tDb.initTState(historyData);
                s(onChangeView);
                if (1 == O) {
                  ht5_viewHelper.dateTo(
                    viewManangerConfig.historytime,
                    viewManangerConfig.historycb
                  );
                  O = 0;
                }

                loading.hide();

                if (viewManangerConfig.loadedChart) {
                  if (utils_util.isFunc(viewManangerConfig.loadedChart))
                    viewManangerConfig.loadedChart();
                  else if (window[viewManangerConfig.loadedChart])
                    window[viewManangerConfig.loadedChart]();
                  else
                    try {
                      window.h5chart.loadedChart();
                    } catch (_) {}
                }
              });
            }
          };
        })();
        //
        this.tDb = _stData_tDb;
        this.initData = pe.initData;
        this.initT5Data = _stData_A_obj.updateT5Data;
        this.doUpdate = _stData_A_obj.update;
        this.onViewChange = onViewChange;
        this.setPricePos = function(e, t) {
          (_stDataMe.labelMaxP = e[0]),
            (_stDataMe.labelMinP = e[1]),
            (_stDataMe.labelPriceCount = e[2]),
            (_stDataMe.isCompare = t),
            _stData_$_obj.createPlayingData(),
            _stDatak && _stDatak.setPricePos(e);
        };
        this.setRange = function() {
          _stData_$_obj.setDataRange(),
            _stData_tChartObj && _stData_tChartObj.setDataRange(),
            _stDatak && _stDatak.setDataRange(),
            _stDataD && _stDataD.setDataRange();
        };
        this.draw = function() {
          stockUI.draw(),
            _stData_tChartObj && _stData_tChartObj.allDraw(),
            _stDatak && _stDatak.allDraw();
        };
        this.resize = function(e) {
          _stData_$_obj.createPlayingData(),
            stockUI.resize(),
            _stData_tChartObj && _stData_tChartObj.onResize(e),
            _stDatak && _stDatak.onResize(),
            _stDataD && _stDataD.onResize();
        };
        this.clear = function() {
          stockUI.clear();
          _stData_tChartObj &&
            _stData_tChartObj.clear()((_stData_tChartObj = null));
          _stDatak && (_stDatak.clear(), (_stDatak = null));
          _stDataD && (_stDataD.clear(), (_stDataD = null));
          isMain && (_view_manager_Q = null);
        };
        this.getPriceTech = function() {
          return _stDatak || null;
        };
        this.removePt = function(arr) {
          if (arr) {
            !utils_util.isArr(arr) && (arr = [arr]);

            for (var index = arr.length; index--; )
              if (
                arr[index].name &&
                "VOLUME" === arr[index].name.toUpperCase()
              ) {
                arr.splice(index, 1);
                _viem_manager_cfg.custom.show_underlay_vol = !1;
                break;
              }
          } else _viem_manager_cfg.custom.show_underlay_vol = !1;

          _stDatak && _stDatak.removeChart(arr);
        };

        this.togglePt = function(e) {
          _stDatak && (_stDatay = _stDatak.showHide(e));
        };

        var he = function(isResize, options, chartlist) {
          isResize && _view_manager_initMgr_ojb.resizeAll(!0);
          _view_manager_view.onChangeView();
          options && utils_util.isFunc(options.callback) && options.callback();
          chartlist && _view_manager_ne.onTechChanged(chartlist[0]);
        };
        this.initPt = function(e, r) {
          if (e) {
            !utils_util.isArr(e) && (e = [e]);
            for (var n = e.length; n--; )
              if (e[n].name && "VOLUME" === e[n].name.toUpperCase()) {
                e.splice(n, 1),
                  (_viem_manager_cfg.custom.show_underlay_vol = !0);
                break;
              }

            if (!_stDatak) {
              _stDatak = new ht5_pChart({
                iMgr: _view_manager_iMgr_obj,
                stockData: _stDataMe,
                chartArea: G,
                titleArea: z,
                cb: he,
                type: "t",
                cfg: _viem_manager_cfg,
                usrObj: viewManangerConfig
              });
              isMain && (obj_Z = _stDatak);
            }

            _stDatak.createChart(e, r);
          }
        };
        this.initTc = function(chartlist, options) {
          if (!_stData_tChartObj) {
            _stData_tChartObj = new ht5_tChart({
              stockData: _stDataMe,
              iMgr: _view_manager_iMgr_obj,
              subArea: subArea,
              cb: he,
              cfg: _viem_manager_cfg,
              type: "option_cn" == marketCode ? "p" : "t",
              usrObj: viewManangerConfig,
              initMgr: _view_manager_initMgr_ojb
            });
            isMain && (Y = _stData_tChartObj);
          }

          _stData_tChartObj.createChart(chartlist, options);
        };
        this.removeTc = function(e) {
          _stData_tChartObj && _stData_tChartObj.removeChart(e);
        };
        this.initRs = function() {
          if (!_stDataD) {
            _stDataD = new ht5_o({
              stockData: _stDataMe,
              setting: _viem_manager_cfg,
              state: viewState,
              rc: _view_manager_view.moving,
              witht5: 1
            });
            _view_manager_Q = _stDataD;
          }

          _stDataD.linkData();
        };
        this.setTLineStyle = stockUI.setTLineStyle;
        funcBool();
      }

      //end STDATA

      function StockUI(stockData, options) {
        function n() {
          var r = stockData.isMain;
          if (r)
            (l = _viem_manager_cfg.COLOR.T_P),
              (c = _viem_manager_cfg.COLOR.T_AVG);
          else {
            2 != _view_manager_view.dAdd ||
              o.linecolor ||
              (o.linecolor = viewManangerConfig.overlaycolor);
            var n = o.linecolor || "#cccccc";
            l = n.K_N || n.T_N || "#" + utils_util.randomColor();
          }
          s = new utils_painter.xh5_ibPainter({
            setting: _viem_manager_cfg,
            sd: stockData,
            withHBg: r,
            ctn: mainareaDom,
            iMgr: _view_manager_iMgr_obj,
            reO: {
              mh: _viem_manager_cfg.DIMENSION.H_MA4K
            },
            iTo: function(t, a, i, r) {
              if (
                (!fCONTAINS(t, _view_manager_iMgr_obj.iHLineO.body) &&
                  t.appendChild(_view_manager_iMgr_obj.iHLineO.body),
                stockData && stockData.datas)
              ) {
                var n,
                  o,
                  s = stockData.datas[0][0].prevclose;
                2 == stockData.dAdd
                  ? (n =
                      stockData.labelMaxP * s +
                      s -
                      (i / _viem_manager_cfg.DIMENSION.h_t) *
                        (stockData.labelMaxP * s +
                          s -
                          (stockData.labelMinP * s + s)))
                  : ((n =
                      stockData.labelMaxP -
                      (i / _viem_manager_cfg.DIMENSION.h_t) *
                        (stockData.labelMaxP - stockData.labelMinP)),
                    (o = Number((100 * (n - s)) / s).toFixed(2) + "%")),
                  _view_manager_iMgr_obj.iToD(
                    {
                      mark: n,
                      rmark: o,
                      x: a,
                      y: i,
                      oy: _viem_manager_cfg.DIMENSION.H_MA4K,
                      ox: _viem_manager_cfg.DIMENSION.posX,
                      e: r
                    },
                    !0,
                    !1
                  );
              }
            }
          });
        }
        var o,
          s,
          l,
          c,
          d,
          h = {},
          v = 1,
          setTLineStyle = function(e) {
            o = copyProperties(
              {
                linetype: "line_" + v,
                linecolor: o ? o.linecolor || {} : {}
              },
              e || {}
            );
            var t = [];
            e &&
              e.linetype &&
              ((t = e.linetype.split("_")),
              t.length > 1 &&
                ("line" == t[0] || "mountain" == t[0]) &&
                (v = Number(t[1]) || 1)),
              (h = o.linecolor || {}),
              (l = h.K_N || h.T_N || _viem_manager_cfg.COLOR.T_P),
              (c = h.T_AVG || _viem_manager_cfg.COLOR.T_AVG),
              (d = h.T_PREV || _viem_manager_cfg.COLOR.T_PREV);
          },
          draw = function() {
            function a() {
              if (
                stockData.isMain &&
                _viem_manager_cfg.custom.show_underlay_vol
              ) {
                for (var t, a = _viem_manager_cfg.COLOR.V_SD, i = D; N > i; i++)
                  (S = y[i]),
                    (t = S.vy),
                    s.drawVStickC(M, t, I, _viem_manager_cfg.DIMENSION.h_t, a),
                    (M += T);
                s.stroke(), (s.getG().lineWidth = 1);
              }
            }
            function r() {
              if (
                (!stockData.isCompare ||
                  (2 == stockData.dAdd && stockData.isMain)) &&
                !(
                  ("HK" == stockData.market &&
                    stockData.hq &&
                    "indx" == stockData.hq.type) ||
                  "US" === stockData.market ||
                  "LSE" === stockData.market ||
                  "MSCI" === stockData.market
                )
              ) {
                for (
                  M = T * (0.5 + D), s.newStyle(c, !0, v), k = D;
                  N > k && ((S = y[k]), !(S.price <= 0));
                  k++
                ) {
                  if (5 == viewState.end && "CN" == stockData.market && obj_Z)
                    for (var t = obj_Z.getLog(), a = 0; a < t.length; a++)
                      if (
                        "EWI" == t[a].name &&
                        k > (N / tDataLen - 1) * tDataLen
                      )
                        return void s.stroke();
                  k == D || k % tDataLen == 0
                    ? s.moveTo(M, y[k].ay)
                    : s.lineTo(M, y[k].ay),
                    (M += T);
                }
                s.stroke();
              }
            }
            function n() {
              s.newStyle(l, !0, v),
                (M = T * (0.5 + D)),
                "CN" == stockData.market &&
                  stockData.preData.vPos &&
                  (0 == stockData.realLen && stockData.hq
                    ? stockData.hq.time > "09:29"
                      ? (s.moveTo(0, stockData.preData.vPos),
                        y[0].py || (y[0].py = stockData.preData.vPos),
                        s.lineTo(M, y[0].py))
                      : s.drawDot(M, stockData.preData.vPos, 1)
                    : (s.moveTo(0, stockData.preData.vPos),
                      y[0].py || (y[0].py = stockData.preData.vPos),
                      s.lineTo(M, y[0].py)),
                  s.stroke());
            }
            function m() {
              var e;
              for (k = D; N > k && ((S = y[k]), !(S.price <= 0)); k++)
                (e = S.py),
                  k == D || k % tDataLen == 0
                    ? s.moveTo(M, e)
                    : k % viewManangerConfig.modulo == 0 && s.lineTo(M, e),
                  (S.ix = M),
                  (M += T);
              (O = M),
                (L = e),
                s.stroke(),
                viewManangerConfig.business &&
                  h({
                    xPos: M,
                    yPos: e
                  });
            }
            function h(e) {
              s.newStyle(l, !0, 0.5),
                s.drawDot(e.xPos, e.yPos, 3, !0),
                s.newFillStyle_rgba(_viem_manager_cfg.COLOR.M_ARR, 3, 1),
                s.fill(),
                s.stroke();
            }
            function u() {
              function t() {
                s.lineTo(M, _viem_manager_cfg.DIMENSION.h_t),
                  s.lineTo(0.5 * T, _viem_manager_cfg.DIMENSION.h_t),
                  s.newFillStyle_rgba(
                    _viem_manager_cfg.COLOR.M_ARR,
                    _viem_manager_cfg.DIMENSION.h_t,
                    _viem_manager_cfg.COLOR.M_ARR_A
                  ),
                  s.fill();
              }
              if (w && !stockData.isCompare)
                if (stockData.datas.length < 2) (M -= T), t();
                else {
                  M = 0.5 * T;
                  var a;
                  for (
                    s.newStyle(l, !0, v), k = 0;
                    N > k && ((S = y[k]), !(S.price <= 0));
                    k++
                  )
                    (a = S.py),
                      0 == k ? s.moveTo(M, a) : s.lineTo(M, a),
                      (M += T);
                  t();
                }
            }
            function f() {
              (d = _viem_manager_cfg.COLOR.T_PREV), s.newStyle(d, !0, 1);
              var t,
                a = 0,
                r = 5;
              for (
                t =
                  stockData.isCompare &&
                  stockData.isMain &&
                  "pct" === _viem_manager_cfg.datas.scaleType
                    ? xh5_PosUtil.pp(
                        0,
                        stockData.labelMinP,
                        stockData.labelMaxP,
                        _viem_manager_cfg.DIMENSION.h_t
                      )
                    : xh5_PosUtil.pp(
                        stockData.datas[0][0].prevclose,
                        stockData.minPrice,
                        stockData.maxPrice,
                        _viem_manager_cfg.DIMENSION.h_t
                      ),
                  t = ~~(t + 0.5),
                  t -= 0.5;
                a < _viem_manager_cfg.DIMENSION.w_t;

              )
                s.moveTo(a, t), (a += r), s.lineTo(a, t), (a += r);
              if (
                (stockData.isMain && s.stroke(), viewManangerConfig.business)
              ) {
                var n = stockData.hq.price.toFixed(2),
                  o = s.getG(),
                  l = o.measureText(n).width,
                  c = _viem_manager_cfg.DIMENSION.w_t - l,
                  m = l + 10;
                O > c && (O = c),
                  10 > O && (O = 20),
                  30 > L && (L = 30),
                  (o.fillStyle = "#EB9A47");
                var h = g(O - 10, L - 25, m, 20);
                b(h, 5, o),
                  o.beginPath(),
                  (o.fillStyle = "#fff"),
                  o.fillText(n, O - 5, L - 10),
                  s.fill();
              }
            }
            function g(e, t, a, i) {
              return {
                x: e,
                y: t,
                width: a,
                height: i
              };
            }
            function b(e, t, a) {
              var i = C(e.x + t, e.y),
                r = C(e.x + e.width, e.y),
                n = C(e.x + e.width, e.y + e.height),
                o = C(e.x, e.y + e.height),
                s = C(e.x, e.y);
              a.beginPath(),
                a.moveTo(i.x, i.y),
                a.arcTo(r.x, r.y, n.x, n.y, t),
                a.arcTo(n.x, n.y, o.x, o.y, t),
                a.arcTo(o.x, o.y, s.x, s.y, t),
                a.arcTo(s.x, s.y, i.x, i.y, t),
                a.stroke(),
                a.fill();
            }
            if (!(_viem_manager_cfg.DIMENSION.getStageH() < 0)) {
              stockData.isMain && s.drawBg("T");
              var y = [];
              if (stockData.datas) {
                for (var _ = 0; _ < stockData.datas.length; _++)
                  y = y.concat(stockData.datas[_]);
                var N = y.length;
                if (y) {
                  var k,
                    S,
                    D,
                    w = o.linetype && 0 == o.linetype.indexOf("mountain"),
                    x = stockData.datas.length * tDataLen,
                    T =
                      _viem_manager_cfg.DIMENSION.w_t /
                      Math.max(x, _viem_manager_cfg.PARAM.minCandleNum),
                    I = 0.5 * T,
                    M = 0;
                  stockData.isTotalRedraw
                    ? ((D = 0), s.clear(!0, _viem_manager_cfg.PARAM.getHd()))
                    : ((D = x - 2),
                      0 > D && (D = 0),
                      (M += T * D),
                      s.clearLimit(M + I, T + I));
                  var O = 0,
                    L = 0,
                    C = function(e, t) {
                      return {
                        x: e,
                        y: t
                      };
                    };
                  a(),
                    "sh000012" != stockData.symbol &&
                      "sh000013" != stockData.symbol &&
                      (viewManangerConfig.business ||
                        viewManangerConfig.simple ||
                        utils_util.isRepos(stockData.symbol) ||
                        r()),
                    n(),
                    m(),
                    u(),
                    f();
                }
              }
            }
          };
        (this.draw = draw),
          (this.clear = function() {
            s.remove(), (s = null);
          }),
          (this.resize = function() {
            s.resize({
              mh: _viem_manager_cfg.DIMENSION.H_MA4K
            }),
              draw();
          }),
          (this.setTLineStyle = setTLineStyle),
          setTLineStyle(options),
          n();
      }
      // END STOCKUI
      function View() {
        var view_mainStock,
          view_Me = this,
          allStocks = [];
        this.getAllStock = function() {
          return allStocks;
        };
        this.getMainStock = function() {
          return view_mainStock;
        };
        this.getAllSymbols = function() {
          for (var e = [], t = 0, a = allStocks.length; a > t; t++)
            e.push(allStocks[t].symbol);
          return e;
        };
        var funcC = function() {
            var e,
              t = _viem_manager_cfg.DIMENSION.h_t;
            return viewManangerConfig.business
              ? (e = 0)
              : viewManangerConfig.appMode
              ? 2
              : (e = 100 > t ? 2 : 180 > t ? 4 : 300 > t ? 6 : 8);
          },
          funD = function() {
            for (
              var st,
                t,
                a,
                i = Number.MAX_VALUE,
                r = -Number.MAX_VALUE,
                len = allStocks.length,
                s = len > 1,
                l = s ? "avgPercent" : "Price",
                index = len;
              index--;

            ) {
              st = allStocks[index];
              a = st.getPriceTech();
              a &&
                !s &&
                a.getMaxMin()[0] &&
                ((r = a.getMaxMin()[0]), (i = a.getMaxMin()[1]));
              t = [r, i];
              i = Math.min(i, st["min" + l], t[1]);
              r = Math.max(r, st["max" + l], t[0]);
            }

            if (obj_Z) {
              var m = obj_Z.getLog(),
                p = m.length;
              for (index = 0; p > index; index++)
                if ("EWI" == m[index].name || "MA" == m[index].name) {
                  var h = allStocks[0].datas[0][0].prevclose,
                    u = Math.max(Math.abs(h - r), Math.abs(h - i));
                  r = h + u;
                  i = h - u;
                }
            }
            for (var v = funcC(), f = len; f--; ) {
              st = allStocks[f];
              st.setPricePos([r, i, v], s);
            }
          },
          funcM = function(e) {
            if (e) e.draw();
            else for (var t = allStocks.length; t--; ) allStocks[t].draw();
          },
          setViewData = function(t) {
            1 == viewState.viewId || 0 == viewState.viewId
              ? viewManangerConfig.date
                ? view_Me.moving(viewState.start, viewState.end)
                : view_Me.moving(4, 5, !1)
              : view_Me.moving(viewState.start, viewState.end, !1),
              t || _view_manager_ne.onRange(view_mainStock);
          },
          funcV = function(stdata) {
            if (stdata.isErr) {
              utils_util.trace.error("err symbol data");
              view_Me.removeCompare([stdata.symbol]);
              return !0;
            } else {
              return stdata.tDb.get()
                ? !0
                : (stdata.initData(onChangeView), !1);
            }
          },
          f = [],
          g = function(e) {
            if (e && utils_util.isFunc(e.callback)) {
              for (var a = !1, i = f.length; i--; )
                if (e.callback === f[i]) {
                  a = !0;
                  break;
                }
              !a && f.push(e.callback);
            }
          },
          onChangeView = function(a, i) {
            if ((g(i), funcV(view_mainStock))) {
              if (view_mainStock.isErr)
                return (
                  utils_util.trace.error("err main symbol"),
                  void (view_mainStock.isErr = !1)
                );
              _view_manager_iMgr_obj.patcher.switchFloater();
              for (var r, o = !0, s = allStocks.length; s--; )
                (r = allStocks[s]), r == view_mainStock || funcV(r) || (o = !1);
              if (o) {
                for (s = allStocks.length; s--; )
                  allStocks[s].marketNum(allStocks[s].needMarket) >
                    allStocks[s].marketNum(marketCode) &&
                    (marketCode = allStocks[s].needMarket);
                for (s = allStocks.length; s--; ) changeData(allStocks[s]);
                for (setViewData(a); f.length; ) {
                  var l = f.shift();
                  l();
                }
              }
              if ((_view_manager_ne.onViewChanged(), a)) return;
              _view_manager_ne.onViewPrice(), _view_manager_ne.onDataUpdate();
            }
          },
          func_ = function() {
            _view_manager_ne.onRange(view_mainStock);
          };
        this.getExtraData = function(a) {
          if (
            ((a = copyProperties(
              {
                symbol: view_mainStock.symbol,
                name: null,
                clone: !0
              },
              a || {}
            )),
            !a.name)
          )
            return null;
          for (var i, r, o = allStocks.length; o--; )
            if (allStocks[o].symbol === a.symbol) {
              i = allStocks[o];
              break;
            }
          if (i) {
            var s;
            "t1" == a.name || "t5" == a.name
              ? ((s = i.tDb.get()), (r = a.clone ? utils_util.clone(s) : s))
              : (r = null);
          }
          return r;
        };
        this.shareTo = function(e) {
          e = copyProperties(
            {
              type: "weibo",
              url: window.location.href,
              wbtext: "",
              qrwidth: 100,
              qrheight: 100,
              extra: void 0
            },
            e
          );
          var a = String(e.type).toLowerCase();
          switch (a) {
            case "qrcode":
              KKE.api(
                "utils.qrcode.createcanvas",
                {
                  text: e.url,
                  width: e.qrwidth,
                  height: e.qrheight
                },
                function(e) {
                  _viem_manager_tipObj.showTip({
                    content: e,
                    txt:
                      '<p style="margin:0 0 9px 0;">\u626b\u63cf\u4e8c\u7ef4\u7801</p>',
                    parent: dom_elA,
                    btnLb: "\u5173\u95ed"
                  });
                }
              );
              break;
            default:
              utils_util.grabM.shareTo({
                ctn: dom_elA,
                w: _viem_manager_cfg.DIMENSION.getStageW(),
                h:
                  _viem_manager_cfg.DIMENSION.getStageH() -
                  (domB.clientHeight || 0),
                ignoreZIdxArr: [_viem_manager_cfg.PARAM.I_Z_INDEX],
                ignoreIdArr: [_viem_manager_cfg.PARAM.LOGO_ID],
                priorZIdx: _viem_manager_cfg.PARAM.G_Z_INDEX,
                nologo: !1,
                top:
                  _viem_manager_cfg.DIMENSION.posY +
                  _viem_manager_cfg.DIMENSION.H_MA4K +
                  17,
                right:
                  _viem_manager_cfg.DIMENSION.RIGHT_W +
                  _viem_manager_cfg.DIMENSION.K_RIGHT_W,
                LOGO_W: _viem_manager_cfg.DIMENSION.LOGO_W,
                LOGO_H: _viem_manager_cfg.DIMENSION.LOGO_H,
                color: _viem_manager_cfg.COLOR.LOGO,
                bgColor: _viem_manager_cfg.COLOR.BG,
                txt: e.wbtext,
                url: e.url,
                extra: e.extra
              });
          }
        };
        var timerID,
          timerID_K,
          funcS = function() {
            _view_manager_iMgr_obj.update(),
              funD(),
              funcM(),
              func_(),
              _view_manager_iMgr_obj.isIng() || _view_manager_ne.onViewPrice();
          },
          funcD = function() {
            clearTimeout(timerID_K);
            !ae &&
              dom_elA.parentNode &&
              "none" != dom_elA.style.display &&
              (timerID_K = setTimeout(funcS, 200));
          },
          _view_updateDataAll = function(e) {
            clearInterval(timerID);
            if (!isNaN(viewManangerConfig.rate)) {
              var times = 1e3 * viewManangerConfig.rate;
              times > 0 && (timerID = setTimeout(_view_updateDataAll, times));
            }
            for (var a, r = allStocks.length; r--; ) {
              a = allStocks[r];
              a.doUpdate(funcD, null, null, null, e);
            }
          },
          _view_update5Data = function() {
            viewState.viewId = 2;
            for (var e, t = allStocks.length; t--; ) {
              e = allStocks[t];
              e.initT5Data(e.datas, e.hq, onChangeView);
            }
          };
        this.updateDataAll = _view_updateDataAll;
        this.update5Data = _view_update5Data;
        var _view_createStockData = function(options, isMain) {
            var stockData = new STData(options, isMain);
            isMain && (view_mainStock = stockData);
            allStocks[allStocks.length] = stockData;
            _view_toggleP();
            onChangeView();
          },
          _view_func_M = function(e) {
            for (var t, a, i = e, r = 0, o = 0; r < allStocks.length; r++)
              (a = allStocks[r]),
                a.marketNum(a.market) == a.marketNum(i)
                  ? o++
                  : (t = t
                      ? a.marketNum(a.market) > a.marketNum(t)
                        ? a.market
                        : t
                      : a.market),
                r == allStocks.length - 1 && 0 == o && (marketCode = t);
            for (r = allStocks.length; r--; ) changeData(allStocks[r], i);
          },
          changeData = function(e, t) {
            e.changeMarket(t);
          };
        this.changeData = changeData;
        var _view_toggleP = function() {
            if (allStocks.length > 1)
              view_Me.mM.togglePt({
                v: !1
              });
            else {
              if (allStocks.length <= 0) return;
              view_Me.mM.togglePt({
                v: !0
              });
            }
          },
          _view_func_R = function(e) {
            var t = viewState.start,
              a = viewState.end;

            t = Math.max(t + e, 0);
            0 == t && 5 >= a && 0 == viewState.start && a++;
            t >= a && (t = a - 1);
            a > 5 && (a = 5);
            return [t, a];
          };
        this.onWheel = function(e) {
          var t = -1 * e.detail || e.wheelDelta;
          if (0 != t) {
            t = t > 0 ? -1 : 1;
            var i = _view_func_R(t);
            view_Me.moving(i[0], i[1], "wheel");
          }
        };
        this.onKb = function(e) {
          var t = e.keyCode;
          switch (t) {
            case 38:
            case 40:
              var i = _view_func_R(38 == t ? 1 : -1);
              view_Me.moving(i[0], i[1], "Key");
              break;
            case 37:
            case 39:
              _view_manager_iMgr_obj.iToKb(37 == t ? -1 : 1);
              break;
            default:
              return;
          }
          xh5_EvtUtil.preventDefault(e);
        };
        this.zoomApi = function(e) {
          var t = _view_func_R(e ? 1 : -1);
          view_Me.moving(t[0], t[1], "zoom");
        };
        this.moveApi = function(e) {
          var t = viewState.start,
            i = viewState.end;
          (t += e),
            (i += e),
            i > 5 && ((t = 4), (i = 5)),
            0 > t && ((t = 0), (i = 1)),
            view_Me.moving(t, i, "move");
        };
        this.setViewData = setViewData;
        this.onChangeView = onChangeView;
        var valA = 1;
        this.moving = function(t, a, i, r) {
          (viewState.start = t),
            (viewState.end = a),
            ((4 != t && 5 != a) || (0 != t && 5 != a)) &&
              (viewState.viewId = 0),
            r && 4 != t && 1 == valA && ((i = "rs"), (valA = 2), (C = 0)),
            ("HF" == marketCode || "NF" == marketCode) &&
              0 == C &&
              i &&
              (loading.show(), _view_update5Data("t5"), (C = 1), (valA = 2));
          for (var o, s = allStocks.length; s--; )
            (o = allStocks[s]), o.setRange(), o.onViewChange();
          funD(), funcM(), _view_manager_ne.onRange(view_mainStock);
        };
        this.dAdd = 0;
        this.compare = function(e) {
          for (var t = allStocks.length; t--; )
            if (allStocks[t].symbol == e.symbol) return;
          _view_createStockData(e, !1);
        };
        this.removeCompare = function(e) {
          for (var t, a, i = "CN", r = e.length; r--; ) {
            a = e[r];
            for (var o = allStocks.length; o--; )
              if (a == allStocks[o].symbol) {
                (t = allStocks.splice(o, 1)[0]),
                  (i = t.market),
                  t.clear(),
                  (t = null);
                break;
              }
          }
          _view_func_M(i),
            _view_toggleP(),
            funD(),
            funcM(),
            _view_manager_ne.onRange(allStocks[0]);
        };
        this.onResize = function(e) {
          for (var t = allStocks.length; t--; ) allStocks[t].resize(e);
        };
        this.dcReset = function() {
          for (var e, len = allStocks.length; len--; ) {
            e = allStocks.splice(len, 1)[0];
            e.clear();
            e = null;
          }
        };
        this.setScale = function(scaleType) {
          _viem_manager_cfg.datas.scaleType = scaleType;
        };
        this.setTLineStyle = function(a) {
          if (a) {
            !utils_util.isArr(a) && (a = [a]);
            for (var i = a.length; i--; ) {
              var r = a[i];
              if (r.hasOwnProperty("symbol")) {
                for (var o = r.symbol, s = allStocks.length; s--; )
                  if (allStocks[s].symbol == o) {
                    allStocks[s].setTLineStyle(r), allStocks[s].draw();
                    break;
                  }
              } else view_mainStock.setTLineStyle(r), view_mainStock.draw();
            }
          } else view_mainStock.setTLineStyle(), view_mainStock.draw();
        };
        var _view_TimerID;
        var P = function(e) {
          e ? funcS() : _view_manager_iMgr_obj.update();
        };
        var H = !1;
        var F = 0;
        var $ = function() {
          clearTimeout(_view_TimerID);
          H = !1;
          F = 0;
        };
        var K = function() {
          _view_TimerID = setTimeout(function() {
            F > 0 && funcS();
            $();
          }, 500);
        };
        this.pushData = function(e, t) {
          var a = !1;
          switch (Number(t)) {
            case 1:
              $(), (a = !0);
              break;
            case 2:
              H || ((H = !0), K());
              break;
            case 0:
              $();
          }
          for (var i = e.length; i--; )
            for (var r = allStocks.length; r--; )
              if (allStocks[r].symbol == e[i].symbol && e[i].data) {
                F++;
                allStocks[r].doUpdate(
                  fBind(P, null, a),
                  !1,
                  e[i].data,
                  e[i].market
                );
                break;
              }
        };
        this.dcInit = function(config) {
          _view_createStockData(config, !0);
          _view_updateDataAll();
        };
        this.mM = new (function() {
          var newAC = function(chartlist, type, options) {
            var chart, method;
            switch (type) {
              case "price":
                chart = ht5_pChart;
                method = "initPt";
                break;
              case "tech":
                chart = ht5_tChart;
                method = "initTc";
            }

            if (method) {
              if (chart) view_mainStock[method](chartlist, options);
              else
                KKE.api(
                  "plugins.techcharts.get",
                  {
                    type: type
                  },
                  function(e) {
                    ht5_tChart = e.tChart;
                    ht5_pChart = e.pChart;
                    newAC(chartlist, type, options);
                  }
                );
            }
          };
          var removeAC = function(t, type) {
            var i;
            switch (type) {
              case "price":
                i = "removePt";
                break;
              case "tech":
                i = "removeTc";
            }
            i && view_mainStock && (view_mainStock[i](t), onChangeView());
          };
          var showRs = function(t) {
            return ht5_o
              ? (_view_manager_Q
                  ? _view_manager_Q.sh(t)
                  : (view_mainStock.initRs(),
                    showRs(t),
                    domB.appendChild(_view_manager_Q.getBody())),
                void _view_manager_initMgr_ojb.resizeAll(!0))
              : void KKE.api("plugins.rangeselector.get", null, function(e) {
                  (ht5_o = e), showRs(t);
                });
          };
          this.showRs = showRs;
          this.newAC = newAC;
          this.removeAC = removeAC;
          this.togglePt = function(t) {
            view_mainStock && (view_mainStock.togglePt(t), onChangeView());
          };
        })();
      }
      //END VIEW

      var _hf_window_var,
        _nf_window_var,
        _gbi_window_var,
        marketCode = "CN",
        M = 1,
        O = 0,
        unitShou = "\u624b",
        C = 0;
      _nf_window_var = viewManangerConfig._nf_window_var;
      _hf_window_var = viewManangerConfig._hf_window_var;
      _gbi_window_var = viewManangerConfig._gbi_window_var;
      var _ViewManager_funcA = function(e) {
          return (
            "CN" === e ||
            "US" === e ||
            "HK" === e ||
            "OTC" === e ||
            "REPO" === e ||
            "option_cn" === e
          );
        },
        _ViewManager_ObjectA = {
          tcd: function(e) {
            var a;
            switch (e) {
              case "HF":
                a = utils_util.tUtil.gtAll(_hf_window_var.time).length;
                break;
              case "REPO":
                (a = 271), (unitShou = "");
                break;
              case "LSE":
                (a = 511), (unitShou = "");
                break;
              case "GOODS":
                (a = 781), (unitShou = "");
                break;
              case "MSCI":
                (a = utils_util.tUtil.gtmsci().length), (unitShou = "");
                break;
              case "CN":
                (a = 241),
                  utils_util.isRepos(viewManangerConfig.symbol) &&
                    (unitShou = ""),
                  utils_util.isCNK(viewManangerConfig.symbol) &&
                    (unitShou = "\u80a1");
                break;
              case "option_cn":
              case "op_m":
                (a = 241), (unitShou = "");
                break;
              case "HK":
                (a = 331), (unitShou = "");
                break;
              case "US":
                (a = 391), (unitShou = "");
                break;
              case "NF":
                (a = utils_util.tUtil.gtAll(_nf_window_var.time).length),
                  (unitShou = "");
                break;
              case "global_index":
                a = utils_util.tUtil.gtAll(_gbi_window_var.time).length;
                break;
              default:
                a = 241;
            }
            return a;
          },
          rmuk: function(e, t, a) {
            var i,
              r,
              n = e;
            return (
              "HK" == a
                ? ((i = n.splice(0, 120)), (r = i.concat(n.splice(30, 121))))
                : "US" == a || (r = e),
              r
            );
          },
          aduk: function(e, a, i, r, n) {
            var o,
              s,
              l,
              c,
              d,
              m = e,
              p = a,
              h = i,
              u = [],
              f = [],
              g = r.getHours() + ":" + utils_util.strUtil.zp(r.getMinutes()),
              b = utils_util.tUtil.gata(i),
              y = dateUtil.stbd(r, n) ? utils_util.arrIndexOf(b, g) : 0;
            "HK" == p &&
              "US" == i &&
              ((s = [["12:01", "12:59"]]),
              (u = [1]),
              (l = m[150]),
              (c = m[m.length - 1])),
              ("CN" == p || "option_cn" == p) &&
                ("HK" == h
                  ? ((s = [["11:30", "11:59"], ["15:01", "16:00"]]),
                    (u = [0, 2]),
                    (l = m[119]),
                    (c = m[m.length - 1]))
                  : ((s = [
                      ["11:30", "11:59"],
                      ["12:00", "12:59"],
                      ["15:01", "16:00"]
                    ]),
                    (u = [0, 1, 2]),
                    (l = m[119]),
                    (c = m[m.length - 1])));
            for (var _ = 0, N = u.length; N > _; _++) {
              for (
                var k,
                  S,
                  D,
                  w = utils_util.tUtil.gtr([s[_]]),
                  x = [],
                  T = 0,
                  I = w.length;
                I > T;
                T++
              )
                u[_] < 2
                  ? (("CN" == p || "option_cn" == p) &&
                      (y > 120 && 150 > y
                        ? ((S = y - 120), (D = S > T ? l.price : -0.01))
                        : (D = l.price)),
                    "HK" == p && y > 150 && 180 > y && (S = y - 150),
                    (k = {
                      time: w[T],
                      price: D,
                      avg_price: D,
                      volume: 0,
                      fake: u[_]
                    }))
                  : (("CN" == p || "option_cn" == p) &&
                      (y > 272
                        ? ((S = y - 272), (D = S > T ? c.price : -0.01))
                        : (D = c.price)),
                    (k = {
                      time: w[T],
                      price: D,
                      avg_price: D,
                      volume: 0,
                      fake: u[_]
                    })),
                  x.push(k);
              f.push(x);
            }
            return (
              "HK" == a && ((d = m.splice(0, 151)), (o = d.concat(f[0], m))),
              ("CN" == a || "option_cn" == p) &&
                ("US" == h
                  ? ((d = m.splice(0, 120)),
                    (o = d.concat(f[0], f[1], m, f[2])))
                  : "HK" == h &&
                    ((d = m.splice(0, 120)), (o = d.concat(f[0], m, f[1])))),
              o
            );
          }
        };
      utils_util.xh5_EvtDispatcher.call(this);
      var _ViewManager_me = this;
      //copy properties
      viewManangerConfig = copyProperties(
        {
          symbol: "sh000001",
          ssl: !0,
          business: !1,
          simple: !1,
          datas: {
            t1: {
              url: void 0,
              dataformatter: void 0
            },
            t5: {
              url: void 0,
              dataformatter: void 0
            }
          },
          assisthq: 1,
          dim: null,
          theme: null,
          view: "ts",
          rate: 3,
          modulo: 1,
          t_rate: 0 / 0,
          fh5: !1,
          noh5: null,
          reorder: !0,
          reheight: !0,
          dist5: 0,
          w: void 0,
          h: void 0,
          mh: 0,
          date: null,
          dp: !1,
          onrange: void 0,
          onviewprice: void 0,
          ondataupdate: void 0,
          onviewchanged: void 0,
          ontechchanged: void 0,
          onshortclickmain: void 0,
          nfloat: 2,
          ennfloat: !1,
          trace: void 0,
          overlaycolor: void 0,
          nohtml5info: void 0,
          tchartobject: {
            t: void 0,
            k: void 0
          }
        },
        viewManangerConfig || {
          YANGWEN: "yangwen@staff.sina.com.cn",
          VER: "2.6.0"
        }
      );

      if (!viewManangerConfig.symbol) viewManangerConfig.symbol = "sh000001";

      viewManangerConfig.symbol = String(viewManangerConfig.symbol);

      viewManangerConfig.rawsymbol = String(viewManangerConfig.symbol);
      viewManangerConfig.symbol =
        "LSE" === utils_util.market(viewManangerConfig.symbol)
          ? utils_util.strUtil.replaceStr(viewManangerConfig.symbol)
          : viewManangerConfig.symbol.replace(".", "$");

      if (0 == location.protocol.indexOf("https:"))
        viewManangerConfig.ssl = true;
      var randomKey =
        "_" +
        viewManangerConfig.symbol +
        "_" +
        Math.floor(1234567890 * Math.random() + 1) +
        Math.floor(9876543210 * Math.random() + 1);

      var _viem_manager_cfg = cfgs_settinger.getSetting(randomKey);

      _viem_manager_cfg.datas.isT = !0;
      viewManangerConfig.reorder ||
        (_viem_manager_cfg.custom.indicator_reorder = !1);
      viewManangerConfig.reheight ||
        (_viem_manager_cfg.custom.indicator_reheight = !1);
      marketCode = utils_util.market(viewManangerConfig.symbol);
      _viem_manager_cfg.datas.tDataLen = _ViewManager_ObjectA.tcd(marketCode);
      var tDataLen = _viem_manager_cfg.datas.tDataLen;
      var _viem_manager_tipObj = new (function() {
        var e;
        this.showTip = function(a) {
          e || (e = new utils_util.TipM(_viem_manager_cfg.COLOR));
          e.genTip(a);
        };
        this.hideTip = function() {
          e && e.hide();
        };
      })();

      if (xh5_BrowserUtil.noH5) {
        if ("undefined" == typeof FlashCanvas || viewManangerConfig.fh5)
          return void (
            utils_util.isFunc(viewManangerConfig.noh5) &&
            viewManangerConfig.noh5(viewManangerConfig)
          );
        _viem_manager_cfg.PARAM.isFlash = !0;
      }
      if (
        (_viem_manager_cfg.PARAM.isFlash &&
          ((_viem_manager_cfg.COLOR.K_EXT_BG = "#fff"),
          (_viem_manager_cfg.COLOR.F_BG = "#fff")),
        viewManangerConfig.dim)
      )
        for (var F in viewManangerConfig.dim) {
          if (
            viewManangerConfig.dim.hasOwnProperty(F) &&
            utils_util.isNum(_viem_manager_cfg.DIMENSION[F])
          )
            _viem_manager_cfg.DIMENSION[F] = viewManangerConfig.dim[F];
        }

      var _view_manager_root_dom,
        dom_elA,
        mainareaDom,
        G,
        z,
        subArea,
        domB,
        _view_manager_view,
        _view_manager_whatJ,
        Y,
        obj_Z,
        _view_manager_Q,
        loading,
        viewState = {
          viewId: globalCfg.URLHASH.vi(viewManangerConfig.view || "ts"),
          dataLength: void 0,
          start: void 0,
          end: void 0,
          startDate: void 0,
          endDate: void 0
        },
        _view_manager_t_rate = isNaN(viewManangerConfig.t_rate)
          ? _viem_manager_cfg.PARAM.T_RATE
          : viewManangerConfig.t_rate,
        ae = !1,
        ie = 0;
      var _view_manager_initMgr_ojb = new (function() {
        var logoDom;
        var setSize = function(width, height, a) {
          var r = !1;
          isNaN(width) &&
            (width =
              viewManangerConfig.w || _view_manager_root_dom.offsetWidth);
          isNaN(height) &&
            (height =
              viewManangerConfig.h ||
              _view_manager_root_dom.offsetHeight - viewManangerConfig.mh);
          for (
            var n,
              o = domB.clientHeight || 0,
              s = subArea.clientHeight || 0,
              l = _viem_manager_cfg.DIMENSION.getOneWholeTH(),
              c = 0,
              childNodes = subArea.childNodes,
              len = childNodes.length,
              p = 0,
              h = childNodes.length;
            h--;

          ) {
            n = childNodes[h];
            n.id.indexOf("blankctn") >= 0
              ? ((c = n.offsetHeight), len--, (p += c))
              : (p += l);
          }

          return (
            !isNaN(a) && (s -= a),
            s / (height - o) > 1 && ((s = p), (r = !0)),
            _viem_manager_cfg.DIMENSION.setStageW(width),
            1 == ie
              ? len > 0 &&
                (_viem_manager_cfg.DIMENSION.setStageH(height, len * l + c + o),
                (r = !0),
                (ie = 0))
              : _viem_manager_cfg.DIMENSION.setStageH(height, s + o),
            0 > height &&
              ((_viem_manager_cfg.DIMENSION.H_T_G =
                _viem_manager_cfg.DIMENSION.H_T_G -
                _viem_manager_cfg.DIMENSION.H_T_T),
              (_viem_manager_cfg.DIMENSION.H_T_B =
                _viem_manager_cfg.DIMENSION.H_TIME_PART)),
            r
          );
        };
        var updateLoadingPosition = function() {
          loading.setPosition();
        };
        var setLogoStyle = function() {
          logoDom &&
            (logoDom.style.display = _viem_manager_cfg.custom.show_logo
              ? ""
              : "none");
        };
        var resizeAll = function(e, i, o) {
          var s = setSize(i, o, 0 / 0);
          if (e || (i && o)) {
            if (!_view_manager_view) return;
            _view_manager_view.onResize(s), _view_manager_iMgr_obj.onResize();
          }
          updateLoadingPosition(),
            setLogoStyle(),
            utils_util.stc("t_wh", [
              _viem_manager_cfg.DIMENSION.getStageW(),
              _viem_manager_cfg.DIMENSION.getStageH()
            ]);
        };
        var _view_manager_createDoms = function() {
          _view_manager_root_dom =
            f$DOM(viewManangerConfig.domid) || viewManangerConfig.dom;
          if (!_view_manager_root_dom) {
            _view_manager_root_dom = utils_util_$C("div");
            document.body.appendChild(_view_manager_root_dom);
            utils_util.trace.error("missing of dom id");
          }

          dom_elA = utils_util_$C("div");
          dom_elA.style.position = "relative";
          dom_elA.style.outlineStyle = "none";
          dom_elA.style.webkitUserSelect = dom_elA.style.userSelect = dom_elA.style.MozUserSelect =
            "none";
          mainareaDom = utils_util_$C(
            "div",
            "mainarea_" + _viem_manager_cfg.uid
          );
          G = utils_util_$C("div");
          mainareaDom.appendChild(G);
          z = utils_util_$C("div");
          z.style.position = "absolute";
          z.style.fontSize = _viem_manager_cfg.STYLE.FONT_SIZE + "px";
          mainareaDom.appendChild(z);
          dom_elA.appendChild(mainareaDom);
          subArea = utils_util_$C("div");
          dom_elA.appendChild(subArea);
          domB = utils_util_$C("div");
          dom_elA.appendChild(domB);
          _view_manager_root_dom.appendChild(dom_elA);
          loading = new utils_util.LoadingSign();
          loading.appendto(mainareaDom, _viem_manager_cfg);
        };
        var isInitTheme = function(a) {
          var i = !1;
          if (a) {
            _view_manager_Q && (i = _view_manager_Q.setTheme(a));
            for (var r in a)
              a.hasOwnProperty(r) &&
                _viem_manager_cfg.COLOR.hasOwnProperty(r) &&
                _viem_manager_cfg.COLOR[r] !== a[r] &&
                ((_viem_manager_cfg.COLOR[r] = a[r]), (i = !0));
            utils_util.stc("t_thm", a);
          }
          return (
            i &&
              logoM.styleLogo({
                logo: logoDom,
                color: _viem_manager_cfg.COLOR.LOGO
              }),
            i
          );
        };
        var onMouseWheel = function(e) {
          !_viem_manager_cfg.custom.mousewheel_zoom ||
            (document.activeElement !== dom_elA &&
              document.activeElement.parentNode !== dom_elA) ||
            (_view_manager_view && _view_manager_view.onWheel(e),
            xh5_EvtUtil.preventDefault(e),
            xh5_EvtUtil.stopPropagation(e));
        };
        var onKeyDown = function(e) {
          _viem_manager_cfg.custom.keyboard &&
            _view_manager_view &&
            _view_manager_view.onKb(e);
        };
        var setEventHandler = function() {
          if (!utils_util.xh5_deviceUtil.istd) {
            xh5_BrowserUtil.info.name.match(/firefox/i)
              ? xh5_EvtUtil.addHandler(dom_elA, "DOMMouseScroll", onMouseWheel)
              : xh5_EvtUtil.addHandler(dom_elA, "mousewheel", onMouseWheel);
            dom_elA.tabIndex = 0;
            xh5_EvtUtil.addHandler(dom_elA, "keydown", onKeyDown);
          }
        };
        var setLogoDom = function(dom) {
          logoDom = dom;
          dom_elA.appendChild(dom);
        };
        var render = function() {
          _view_manager_createDoms();
          isInitTheme(viewManangerConfig.theme);
          resizeAll();
          setEventHandler();
          _viem_manager_cfg.DIMENSION.h_t < 0 &&
            ((mainareaDom.style.display = "none"),
            (_viem_manager_cfg.custom.indicator_reorder = !1),
            (_viem_manager_cfg.custom.indicator_reheight = !1));
          logoM.getLogo({
            cb: setLogoDom,
            id: _viem_manager_cfg.PARAM.LOGO_ID,
            isShare: !1,
            top:
              _viem_manager_cfg.DIMENSION.posY +
              _viem_manager_cfg.DIMENSION.H_MA4K +
              17,
            right:
              _viem_manager_cfg.DIMENSION.RIGHT_W +
              _viem_manager_cfg.DIMENSION.K_RIGHT_W,
            LOGO_W: _viem_manager_cfg.DIMENSION.LOGO_W,
            LOGO_H: _viem_manager_cfg.DIMENSION.LOGO_H,
            color: _viem_manager_cfg.COLOR.LOGO
          });
          xh5_BrowserUtil.noH5 &&
            (_viem_manager_tipObj.showTip({
              txt: viewManangerConfig.nohtml5info || globalCfg.nohtml5info,
              parent: dom_elA
            }),
            utils_util.stc("t_nh5"));
        };

        render();
        this.resizeAll = resizeAll;
        this.innerResize = function(e) {
          _view_manager_view &&
            (setSize(0 / 0, 0 / 0, e),
            _view_manager_view.onResize(),
            _view_manager_iMgr_obj.onResize(),
            updateLoadingPosition(),
            _view_manager_ne.onInnerResize({
              height: _viem_manager_cfg.DIMENSION.h_t
            }));
        };
        this.initTheme = isInitTheme;
      })();
      var _view_manager_ne = new (function() {
        var e = 0,
          currentData = function(a, r) {
            var n = tDataLen - 1,
              o = _view_manager_view.getAllStock()[0];
            if (
              o &&
              o.datas &&
              (stbd(o.datas[o.datas.length - 1][0].date, o.hq.date)
                ? (r = o.realLen < 0 || o.realLen > n ? n : (n = o.realLen))
                : "NF" == marketCode &&
                  _nf_window_var &&
                  "21:00" == _nf_window_var.time[0][0]
                ? (r = n = o.realLen)
                : o.realLen < 0 || o.realLen > n
                ? (r = n)
                : ((r = n),
                  o.datas[o.datas.length - 1][r].price < 0 && (r = o.realLen)),
              (a = o.datas[o.datas.length - 1][r]),
              a && a.time)
            ) {
              var s, l;
              if (
                ("HF" == marketCode
                  ? ((s = _hf_window_var.time[0][0]),
                    s > a.time
                      ? ((s = o.datas[o.datas.length - 1][0].date),
                        (l = new Date(s)),
                        "hf_CHA50CFD" !== viewManangerConfig.symbol &&
                          l.setDate(l.getDate() + 1))
                      : (l = o.datas[o.datas.length - 1][0].date))
                  : "NF" == marketCode
                  ? ((s = _nf_window_var.time[0][0]),
                    s < a.time && "21:00" == s
                      ? ((s = o.datas[o.datas.length - 1][0].date),
                        (l = new Date(s)),
                        l.setDate(l.getDate() - 1))
                      : (l = o.datas[o.datas.length - 1][0].date))
                  : (l = o.datas[o.datas.length - 1][0].date),
                "US" == marketCode &&
                  o.hq &&
                  o.datas &&
                  o.datas.length > 0 &&
                  o.hq.today === o.datas[o.datas.length - 1][0].today)
              ) {
                var c = o.datas[o.datas.length - 1][r];
                -1 == c.price &&
                  ((c.price = c.avg_price = o.hq.price),
                  (c.change = o.hq.price - o.hq.prevclose),
                  (c.percent = (o.hq.price - o.hq.prevclose) / o.hq.prevclose));
              }
              a.day =
                utils_util.dateUtil.ds(l, "/", !1) +
                "/" +
                utils_util.dateUtil.nw(l.getDay()) +
                (a.time || "");
              e = r;

              return utils_util.clone(a);
            }
          };
        this.currentData = currentData;
        this.onDataUpdate = function() {
          if (utils_util.isFunc(viewManangerConfig.ondataupdate)) {
            var e = currentData();
            e &&
              viewManangerConfig.ondataupdate({
                data: utils_util.clone(e),
                idx: viewState.currentLength - 1,
                left: _viem_manager_cfg.DIMENSION.posX,
                top: _viem_manager_cfg.DIMENSION.H_MA4K
              });
          }
        };
        this.onInnerResize = function(e) {
          utils_util.isFunc(viewManangerConfig.oninnerresize) &&
            viewManangerConfig.oninnerresize(e);
        };
        this.onRange = function(e) {
          !ae &&
            utils_util.isFunc(viewManangerConfig.onrange) &&
            e &&
            viewManangerConfig.onrange({
              isCompare: e.isCompare,
              data: utils_util.clone(e.datas),
              width: _viem_manager_cfg.DIMENSION.w_t,
              height: _viem_manager_cfg.DIMENSION.h_t,
              viewRangeState: utils_util.clone(viewState),
              range: [e.labelMinP, e.labelMaxP, e.labelMaxVol],
              left: _viem_manager_cfg.DIMENSION.posX,
              top: _viem_manager_cfg.DIMENSION.H_MA4K
            });
        };
        this.onViewChanged = function() {
          utils_util.isFunc(viewManangerConfig.onviewchanged) &&
            viewManangerConfig.onviewchanged({
              viewRangeState: utils_util.clone(viewState)
            });
        };
        this.onViewPrice = function(r, n, o, s) {
          if (!ae && utils_util.isFunc(viewManangerConfig.onviewprice)) {
            if ((r || (r = currentData(r, n)), !r)) return;
            o || (o = _view_manager_view.getMainStock().getName());
            var l,
              c,
              d = utils_util.clone(r);
            viewManangerConfig.ennfloat
              ? ((l = viewManangerConfig.nfloat),
                (c = viewManangerConfig.nfloat))
              : ((l = utils_util.strUtil.nfloat(d.price)),
                (c = utils_util.strUtil.nfloat(d.avg_price))),
              (d.price = Number(d.price.toFixed(l))),
              (d.avg_price = Number(d.avg_price.toFixed(c)));
            var m = viewManangerConfig.symbol.length;
            "HK" == marketCode &&
              viewManangerConfig.symbol.substring(m - 1, m) >= "A" &&
              (d.avg_price = 0 / 0),
              d.volume && d.volume < 0 && (d.volume = 0),
              viewManangerConfig.onviewprice({
                curname: o || "",
                data_array: _view_manager_view.getAllStock().length,
                data: d,
                idx: e,
                left: _viem_manager_cfg.DIMENSION.posX,
                top: _viem_manager_cfg.DIMENSION.H_MA4K,
                interacting: !!s
              });
          }
        };
        this.onTechChanged = function(e) {
          utils_util.isFunc(viewManangerConfig.ontechchanged) &&
            viewManangerConfig.ontechchanged({
              Indicator: e
            });
        };
        this.shortClickHandler = function() {
          utils_util.isFunc(viewManangerConfig.onshortclickmain) &&
            viewManangerConfig.onshortclickmain();
        };
      })();
      var _view_manager_iMgr_obj = new (function() {
        var e,
          a,
          r,
          n,
          o,
          s = viewManangerConfig.nfloat,
          l = 137,
          c = new (function() {
            var t = function(t) {
              var a = e.body.style;
              t && _viem_manager_cfg.custom.show_floater
                ? ((a.backgroundColor = _viem_manager_cfg.COLOR.F_BG),
                  (a.color = _viem_manager_cfg.COLOR.F_T),
                  (a.border = "1px solid " + _viem_manager_cfg.COLOR.F_BR),
                  (a.display = ""))
                : (a.display = "none");
            };
            (this.pv = function(a) {
              var i = e.body.style,
                r = Math.max(_viem_manager_cfg.DIMENSION.posX, 55) + 9,
                n = _viem_manager_cfg.DIMENSION.posX < 55 ? 9 : 0,
                o =
                  _viem_manager_cfg.DIMENSION.getStageW() -
                  l -
                  9 -
                  _viem_manager_cfg.DIMENSION.RIGHT_W -
                  n;
              (i.left =
                (a.x >
                (_viem_manager_cfg.DIMENSION.getStageW() -
                  _viem_manager_cfg.DIMENSION.RIGHT_W) >>
                  1
                  ? r
                  : o) + "px"),
                (i.top = (a.y || 0) + "px"),
                t(!0);
            }),
              (this.showFloater = t);
          })(),
          p = function() {
            function r() {
              var e = _view_manager_view.getAllStock()[0];
              return (
                !("HK" != e.market || "indx" != e.hq.type) ||
                "LSE" === e.market ||
                "MSCI" === e.market
              );
            }
            function n() {
              var e,
                a,
                n,
                o =
                  "border:0;font-size:100%;font:inherit;vertical-align:baseline;margin:0;padding:0;border-collapse:collapse;border-spacing:0;text-align:center;",
                c =
                  "font-weight:normal;border:0;height:16px;text-align:center;",
                m = "text-align:left;font-weight:normal;border:0;height:16px;",
                p = "text-align:right;border:0;height:16px;",
                h = utils_util_$C("div");
              (h.style.position = "absolute"),
                (h.style.zIndex = _viem_manager_cfg.PARAM.I_Z_INDEX + 2),
                (h.style.padding = "2px"),
                (h.style.width = l + "px"),
                (h.style.lineHeight = "16px"),
                (h.style.display = "none"),
                (h.style.fontSize = "12px");
              var u,
                v,
                f,
                g,
                b = utils_util_$C("table"),
                y = utils_util_$C("thead"),
                N = utils_util_$C("tbody");
              (b.style.cssText = o),
                (u = utils_util_$C("tr")),
                (v = utils_util_$C("th")),
                v.setAttribute("colspan", "2"),
                (v.style.cssText = c);
              var k = utils_util_$C("span");
              v.appendChild(k),
                u.appendChild(v),
                y.appendChild(u),
                (u = utils_util_$C("tr")),
                (u.style.textAlign = "center"),
                (v = utils_util_$C("th")),
                v.setAttribute("colspan", "2"),
                (v.style.cssText = c);
              var S = utils_util_$C("span");
              v.appendChild(S),
                u.appendChild(v),
                N.appendChild(u),
                (u = utils_util_$C("tr")),
                (v = utils_util_$C("th")),
                (v.style.cssText = m),
                (f = utils_util_$C("td")),
                (v.style.fontWeight = "normal"),
                (g = utils_util_$C("span")),
                (g.innerHTML = "\u4ef7\u683c");
              var D = utils_util_$C("span");
              (f.style.cssText = p),
                v.appendChild(g),
                f.appendChild(D),
                (v.style.fontWeight = "normal"),
                u.appendChild(v),
                u.appendChild(f),
                N.appendChild(u),
                (u = utils_util_$C("tr")),
                (v = utils_util_$C("th")),
                (v.style.cssText = m),
                (v.style.fontWeight = "normal"),
                (f = utils_util_$C("td")),
                (g = utils_util_$C("span")),
                (g.innerHTML = "\u5747\u4ef7");
              var w = utils_util_$C("span");
              (f.style.cssText = p),
                v.appendChild(g),
                (v.style.fontWeight = "normal"),
                f.appendChild(w),
                u.appendChild(v),
                u.appendChild(f),
                N.appendChild(u),
                (u = utils_util_$C("tr")),
                (v = utils_util_$C("th")),
                (v.style.cssText = m),
                (f = utils_util_$C("td")),
                (v.style.fontWeight = "normal"),
                (g = utils_util_$C("span")),
                (g.innerHTML = "\u6da8\u8dcc");
              var x = utils_util_$C("span");
              (f.style.cssText = p),
                v.appendChild(g),
                f.appendChild(x),
                u.appendChild(v),
                u.appendChild(f),
                N.appendChild(u),
                (u = utils_util_$C("tr")),
                (v = utils_util_$C("th")),
                (v.style.cssText = m),
                (f = utils_util_$C("td")),
                (v.style.fontWeight = "normal"),
                (g = utils_util_$C("span")),
                (g.innerHTML = "\u6210\u4ea4");
              var T = utils_util_$C("span");
              (f.style.cssText = p),
                "HF" != marketCode &&
                  (v.appendChild(g),
                  f.appendChild(T),
                  u.appendChild(v),
                  u.appendChild(f),
                  N.appendChild(u)),
                b.appendChild(y),
                b.appendChild(N),
                (b.style.width = "100%"),
                h.appendChild(b);
              var M = function(e, t) {
                var a = _viem_manager_cfg.COLOR.F_N;
                return (
                  e > t
                    ? (a = _viem_manager_cfg.COLOR.F_RISE)
                    : t > e && (a = _viem_manager_cfg.COLOR.F_FALL),
                  a
                );
              };
              (this.setFloaterData = function(o) {
                if (
                  ((e = o.name || e || ""),
                  (k.innerHTML = e),
                  (n = o.time || n),
                  (a = o.data || a))
                ) {
                  S.innerHTML = n;
                  var l = a,
                    c = Number(l.percent),
                    d = Number(l.price),
                    m = Number(l.prevclose),
                    p = Number(l.avg_price),
                    h = l.change,
                    u = 1 > d || 1 > p ? 4 : s;
                  "HK" == marketCode || "US" == marketCode || "HF" == marketCode
                    ? (u = utils_util.strUtil.nfloat(d))
                    : "LSE" === marketCode && (u = 3),
                    viewManangerConfig.ennfloat &&
                      (u = viewManangerConfig.nfloat),
                    (c = isNaN(c) ? "--" : (100 * c).toFixed(2)),
                    (D.innerHTML = d.toFixed(u)),
                    (w.innerHTML = r() ? "--" : p.toFixed(u)),
                    (x.innerHTML = h.toFixed(u) + "(" + c + "%)");
                  var v = 2;
                  utils_util.isCNK(viewManangerConfig.symbol) && (v = 0),
                    (T.innerHTML =
                      strUtil_ps(l.volume < 0 ? 0 : l.volume, v) + unitShou),
                    (x.style.color = M(c, 0)),
                    (w.style.color = M(p - m, 0)),
                    (D.style.color = M(c, 0));
                }
              }),
                (this.body = h);
            }
            (a = new n()), (e = a);
          },
          h = function() {
            function e(e) {
              var t = utils_util_$C("div"),
                a = utils_util_$C("div"),
                i = utils_util_$C("span"),
                r = utils_util_$C("span"),
                n = e.isH,
                o = 12,
                s = function() {
                  if (
                    ((a.style.borderStyle = "dashed"),
                    (a.style.borderColor = _viem_manager_cfg.COLOR.IVH_LINE),
                    (i.style.backgroundColor = r.style.backgroundColor =
                      _viem_manager_cfg.COLOR[e.txtBgCN]),
                    (i.style.color = r.style.color =
                      _viem_manager_cfg.COLOR[e.txtCN]),
                    n)
                  )
                    (a.style.borderWidth = "1px 0 0 0"),
                      (t.style.width = a.style.width =
                        _viem_manager_cfg.DIMENSION.getStageW() -
                        _viem_manager_cfg.DIMENSION.RIGHT_W +
                        "px"),
                      (i.style.top =
                        -(0.6 * _viem_manager_cfg.STYLE.FONT_SIZE) + "px"),
                      (r.style.top =
                        -(0.6 * _viem_manager_cfg.STYLE.FONT_SIZE) + "px"),
                      (i.style.left = 0),
                      (r.style.left = _viem_manager_cfg.DIMENSION.extend_draw
                        ? ""
                        : _viem_manager_cfg.DIMENSION.getStageW() -
                          _viem_manager_cfg.DIMENSION.RIGHT_W +
                          "px"),
                      (r.style.right = 0),
                      (i.style.width = r.style.width = _viem_manager_cfg
                        .DIMENSION.extend_draw
                        ? ""
                        : _viem_manager_cfg.DIMENSION.posX + "px"),
                      (i.style.padding = "1px 0"),
                      (r.style.padding = "1px 0");
                  else {
                    a.style.borderWidth = "0 1px 0 0";
                    var o,
                      s,
                      l =
                        _viem_manager_cfg.DIMENSION.H_MA4K +
                        _viem_manager_cfg.DIMENSION.H_T_B;
                    _viem_manager_cfg.DIMENSION.getStageH() < 0
                      ? ((o = subArea.clientHeight), (s = o - l))
                      : ((o =
                          _viem_manager_cfg.DIMENSION.getStageH() -
                            domB.clientHeight || 0),
                        (s = _viem_manager_cfg.DIMENSION.h_t)),
                      (o -= l),
                      (o += _viem_manager_cfg.DIMENSION.I_V_O),
                      (t.style.height = a.style.height = o + "px"),
                      (i.style.top = s + "px"),
                      (i.style.padding = "2px 2px 1px");
                  }
                };
              (t.style.position = "absolute"),
                (t.style.zIndex = _viem_manager_cfg.PARAM.I_Z_INDEX - 2),
                (i.style.position = r.style.position = a.style.position =
                  "absolute"),
                (a.style.zIndex = 0),
                (i.style.zIndex = r.style.zIndex = 1),
                (i.style.font = r.style.font =
                  _viem_manager_cfg.STYLE.FONT_SIZE +
                  "px " +
                  _viem_manager_cfg.STYLE.FONT_FAMILY),
                (i.style.whiteSpace = r.style.whiteSpace = "nowrap"),
                (i.style.lineHeight = o + "px"),
                (r.style.lineHeight = o + "px"),
                e.txtA &&
                  (i.style.textAlign = e.txtA) &&
                  (r.style.textAlign = "left"),
                e.txtBgCN &&
                  (i.style.backgroundColor =
                    _viem_manager_cfg.COLOR[e.txtBgCN]) &&
                  (r.style.backgroundColor =
                    _viem_manager_cfg.COLOR[e.txtBgCN]),
                s(),
                t.appendChild(i),
                n && t.appendChild(r),
                t.appendChild(a);
              var l = function(e) {
                e
                  ? "" != t.style.display && (t.style.display = "")
                  : "none" != t.style.display && (t.style.display = "none");
              };
              (this.pv = function(e) {
                if (
                  (!isNaN(e.y) && (t.style.top = e.y + (e.oy || 0) + "px"),
                  (i.innerHTML = e.v || ""),
                  e.p
                    ? ((r.innerHTML = isNaN(Number(e.p.replace("%", "")))
                        ? "0.00%"
                        : e.p),
                      (r.style.display = ""))
                    : (r.style.display = "none"),
                  !isNaN(e.x))
                ) {
                  var a = e.x + (e.ox || 0),
                    n = _viem_manager_cfg.DIMENSION.getStageW();
                  t.style.left = a + "px";
                  var o = i.offsetWidth;
                  if ((0 >= o && (o = 112), o > 0)) {
                    var s = o >> 1;
                    e.x < s
                      ? (s = e.x)
                      : a + s > n - _viem_manager_cfg.DIMENSION.posX &&
                        (s = a + o - n + _viem_manager_cfg.DIMENSION.posX),
                      (i.style.left = -s + "px");
                  }
                }
                l(!0);
              }),
                (this.display = l),
                (this.body = t),
                (this.resize = s),
                l(!1);
            }
            (r = new e({
              isH: !0,
              txtCN: "P_TC",
              txtBgCN: "P_BG",
              txtA: "right"
            })),
              (n = new e({
                isH: !1,
                txtCN: "T_TC",
                txtBgCN: "T_BG",
                txtA: "center"
              })),
              dom_elA.appendChild(n.body);
          },
          u = function() {
            r.display(!1), n.display(!1), c.showFloater(!1);
          },
          g = function() {
            var e = _view_manager_view.getAllStock(),
              t = e[0].datas.length,
              a = 0;
            return (
              e[0].realLen >= 0 &&
                (a =
                  5 == viewState.end
                    ? e[0].realLen + _viem_manager_cfg.datas.tDataLen * (t - 1)
                    : _viem_manager_cfg.datas.tDataLen * (t - 1)),
              a
            );
          },
          b = function(e) {
            e > 2e3 && (e = g()),
              0 > e || (Y && Y.indirectI(e), obj_Z && obj_Z.indirectI(e));
          },
          y = function() {
            b(g()), Y && Y.allDraw();
          },
          k = !0,
          S = 0,
          D = 0,
          T = 0 / 0,
          M = 0 / 0;
        this.iToD = function(a, o, l) {
          var d = a.x,
            m = a.ox || 0,
            p = a.y,
            h = a.oy || 0,
            g = a.mark,
            y = a.rmark,
            _ = a.e ? a.e.target : null;
          if (!l) {
            if (T == d && M == p) return;
            (T = d), (M = p);
          }
          if (_) {
            var O = _.style.height.split("px")[0];
            (0 > p || p > Number(O)) && ((d = 0 / 0), (p = 0 / 0));
          }
          var L,
            C = _view_manager_view.getAllStock(),
            A = C.length,
            P = tDataLen,
            q = A > 1,
            F = C[0].datas.length,
            $ = P * F,
            V = Math.floor((d * $) / _viem_manager_cfg.DIMENSION.w_t);
          if (isNaN(d) && isNaN(p)) {
            if (
              ((k = !0), u(), stbd(C[0].datas[F - 1][0].date, C[0].hq.date))
            ) {
              var K;
              (K =
                C[0].realLen >= 0
                  ? (P - 1) * (F - 1) + C[0].realLen
                  : Number.MAX_VALUE),
                b(K);
            } else b(Number.MAX_VALUE);
            return void _view_manager_ne.onViewPrice();
          }
          (k = !1), (D = V);
          for (
            var G,
              z,
              W,
              B,
              j,
              Y,
              Z,
              Q,
              J,
              te = [],
              ae = Number.MAX_VALUE,
              ie = A;
            ie--;

          )
            if (((Z = C[ie].datas), (te = te.concat(Z)), Z)) {
              var re = Math.floor(V / P),
                oe = V % P;
              if (!Z[re]) return;
              if (
                ((Q = Z[re][oe]),
                (Q.date = Z[re][0].date),
                q && C[ie].dAdd <= 1)
              )
                (J = Math.abs(Q.py - p)),
                  ae > J &&
                    ((z = ie),
                    (ae = J),
                    (L = Q),
                    (W = C[ie]),
                    (B = C[ie].getName()),
                    (j = C[ie].getStockType())),
                  (y = G = o ? (100 * g).toFixed(2) + "%" : g.toFixed(s));
              else {
                switch (
                  ((z = ie),
                  (W = C[ie]),
                  (B = C[ie].getName()),
                  (j = C[ie].getStockType()),
                  marketCode)
                ) {
                  case "HK":
                  case "US":
                  case "HF":
                    (Y = viewManangerConfig.ennfloat
                      ? s
                      : utils_util.strUtil.nfloat(g)),
                      (G = g.toFixed(Y));
                    break;
                  case "LSE":
                    (Y = viewManangerConfig.ennfloat ? s : 3),
                      (G = g.toFixed(Y));
                    break;
                  default:
                    G = g.toFixed(
                      (1 > g && g > 0) || (g > -1 && 0 > g) ? 4 : s
                    );
                }
                (G = g > 99999 ? Math.floor(g) : g > 9999 ? g.toFixed(1) : G),
                  (L = Q);
              }
            }
          var se = Q && Q.date;
          S = 0 == C[0].realLen ? 0 : C[0].realLen - 1;
          var le =
            "string" != typeof C[0].date ? dateUtil.ds(C[0].date) : C[0].date;
          if (F > 1) {
            W.realLen < 0 && (W.realLen = tDataLen);
            var ce = $ - P + W.realLen;
            5 == viewState.end &&
              V >= ce &&
              ((V = ce), (L = te[re][V % tDataLen]));
          } else {
            if (dateUtil.stbd(se, dateUtil.sd(le)))
              -1 === W.realLen && (W.realLen = tDataLen),
                V >= W.realLen && (V = W.realLen);
            else
              switch (marketCode) {
                case "HF":
                case "NF":
                  V >= W.realLen && 4 == viewState.start && (V = W.realLen);
                  break;
                default:
                  S = tDataLen - 1;
              }
            _ViewManager_funcA(marketCode) &&
            dateUtil.stbd(se, dateUtil.sd(le)) &&
            W.hq &&
            W.hq.time >= "09:00" &&
            W.hq.time < "09:30"
              ? (L = {
                  price: W.hq.preopen,
                  avg_price: W.hq.preopen,
                  prevclose: W.hq.prevclose,
                  percent: (W.hq.open - W.hq.prevclose) / W.hq.prevclose,
                  change: W.hq.preopen - W.hq.price,
                  volume: W.hq.totalVolume,
                  ix: 0.1,
                  time: W.hq.time
                })
              : ((L = W.datas[0][V]), (L.prevclose = W.datas[0][0].prevclose));
          }
          if (L && (L.date || (L.date = se), !L || L.date)) {
            var de = d;
            _viem_manager_cfg.custom.stick && (d = L.ix || d);
            var me, pe;
            "HF" == marketCode
              ? ((me = _hf_window_var.time[0][0]),
                me > L.time
                  ? ((me = L.date),
                    (pe = new Date(me)),
                    pe.setDate(pe.getDate() + 1))
                  : (pe = L.date))
              : "NF" == marketCode
              ? ((me = _nf_window_var.time[0][0]),
                me <= L.time && "21:00" == me
                  ? ((me = L.date),
                    (pe = new Date(me)),
                    pe.setDate(pe.getDate() - 1),
                    0 == pe.getDay() && pe.setDate(pe.getDate() - 2))
                  : L.time < "03:00" && 1 == L.date.getDay()
                  ? ((pe = new Date(L.date)), pe.setDate(pe.getDate() - 2))
                  : (pe = L.date))
              : (pe = L.date);
            var he =
              utils_util.dateUtil.ds(pe, "/", !1) +
              "/" +
              utils_util.dateUtil.nw(pe.getDay()) +
              (L.time || "");
            ("GOODS" === marketCode ||
              "hf_CHA50CFD" === viewManangerConfig.symbol ||
              "HF" === marketCode) &&
              (he = L.time || "--"),
              (L.day = he),
              e &&
                (e.setFloaterData({
                  stocktype: j,
                  name: B,
                  time: he,
                  data: L
                }),
                c.pv({
                  x: de,
                  y: _viem_manager_cfg.DIMENSION.T_F_T
                })),
              r.pv({
                y: p,
                oy: h,
                v: G,
                p: y
              }),
              n.pv({
                v: he,
                x: d,
                ox: m,
                y: _viem_manager_cfg.DIMENSION.H_MA4K
              }),
              b(V),
              _view_manager_ne.onViewPrice(L, V, B, !k),
              _ViewManager_me.re(globalCfg.e.I_EVT, a.e);
          }
        };
        this.globalDragHandler = function(e, t, a, i, r) {
          isNaN(e) && isNaN(t) && _ViewManager_me.re(globalCfg.e.I_EVT, r);
        };
        this.shortClickHandler = function() {
          _view_manager_ne.shortClickHandler();
        };
        this.zoomView = function() {};
        p();
        h();
        this.onResize = function() {
          r.resize(), n.resize();
        };
        this.iHLineO = r;
        this.hideIUis = u;
        this.iToKb = function(e) {
          (D += e), (S = D);
          var t = _view_manager_view.getAllStock(),
            a = t[0].datas.length,
            i = t[0].datas[0][D],
            r = t.length,
            n = t[0].realLen,
            o =
              "string" != typeof t[0].date ? dateUtil.ds(t[0].date) : t[0].date;
          1 >= a
            ? dateUtil.stbd(t[0].datas[0][0].date, dateUtil.sd(o))
              ? 0 > n && (n = tDataLen)
              : (n = tDataLen)
            : dateUtil.stbd(t[0].datas[a - 1][0].date, dateUtil.sd(o)) ||
              (n = tDataLen);
          var s = tDataLen > n ? n + 1 : n;
          if (0 > D) {
            var l = tDataLen > n ? n : n - 1;
            (S = D = (a - 1) * tDataLen + l), (i = t[0].datas[a - 1][l]);
          } else if (D >= s + (a - 1) * tDataLen)
            if (
              dateUtil.stbd(t[0].datas[a - 1][0].date, dateUtil.sd(o)) &&
              0 > e
            ) {
              var c = 0;
              (c = a > 1 ? n - 1 + tDataLen * (a - 1) : n - 1),
                (S = D = c),
                (i = t[0].datas[0][S]);
            } else (S = D = 0), (i = t[0].datas[0][0]);
          !fCONTAINS(mainareaDom, _view_manager_iMgr_obj.iHLineO.body) &&
            mainareaDom.appendChild(_view_manager_iMgr_obj.iHLineO.body);
          var d = Math.floor(S / tDataLen);
          D >= tDataLen && (i = t[0].datas[d][S - d * tDataLen]),
            (i.date = t[0].datas[d][0].date);
          var p = r > 1 ? i.percent : i.price,
            h = {
              idx: D,
              name: t[0].getName(),
              mark: p,
              datas: t[0].datas,
              data: i,
              x: i.ix,
              y: i.py,
              oy: _viem_manager_cfg.DIMENSION.H_MA4K,
              ox: _viem_manager_cfg.DIMENSION.posX
            };
          this.iToD(h, !0, !0);
        };
        this.isIng = function() {
          return !k;
        };
        (this.isMoving = function() {
          return !1;
        }),
          (this.iReset = function() {});
        this.patcher = new (function() {
          var i,
            r = {},
            n = function() {
              if (i) {
                e.body.parentNode && e.body.parentNode.removeChild(e.body);
                var t = "vid_" + viewState.viewId;
                if (i[t]) {
                  var n;
                  (n = r[t] ? r[t] : (r[t] = new i[t]())), (e = n);
                } else e = a;
              } else e = a;
              !fCONTAINS(dom_elA, e.body) && dom_elA.appendChild(e.body);
            };
          (this.customFloater = function(e) {
            (i = e), n(), utils_util.stc("t_fl", e);
          }),
            (this.switchFloater = n);
        })();
        this.update = function() {
          var a = _view_manager_view.getAllStock();
          if (a) {
            var i,
              r = a[0],
              n = r.datas.length,
              s = 0;
            if (r) {
              if (
                (D > n * (tDataLen - 1) && (D = 0),
                (i = Math.floor(D / (tDataLen - 1))),
                n == i && (i -= 1),
                D > tDataLen - 1)
              ) {
                var l = D - tDataLen * i;
                s =
                  stbd(r.datas[i][0].date, r.hq.date) && l > S ? r.realLen : l;
              } else s = 1 == n && 0 == i && D > S ? r.realLen : D;
              if (
                ((i = 0 > i ? 0 : i), (s = 0 > s ? 0 : s), (o = r.datas[i][s]))
              )
                if (
                  ((o.day =
                    utils_util.dateUtil.ds(r.datas[i][0].date, "/", !1) +
                    "/" +
                    utils_util.dateUtil.nw(r.datas[i][0].date.getDay()) +
                    (o.time || "")),
                  e && e.setFloaterData({}),
                  k)
                )
                  if (stbd(r.datas[n - 1][0].date, r.hq.date))
                    (s = r.realLen >= 0 ? r.realLen : tDataLen - 1),
                      (s += (n - 1) * tDataLen),
                      (s = 0 > s ? Number.MAX_VALUE : s),
                      b(s);
                  else {
                    if ("NF" == marketCode && r.hq.time >= "21:00")
                      return (
                        r.realLen >= 0 && (s = r.realLen),
                        void (
                          4 == viewState.start &&
                          5 == viewState.end &&
                          _view_manager_ne.onViewPrice(o, s, void 0, !k)
                        )
                      );
                    y();
                  }
                else if ("HF" == marketCode)
                  4 == viewState.start &&
                    5 == viewState.end &&
                    _view_manager_ne.onViewPrice(o, s, void 0, !k);
                else if ("NF" == marketCode) {
                  var c = new Date(o.date);
                  o.date &&
                    o.time >= "21:00" &&
                    (c.setDate(
                      1 == o.date.getDay() ? c.getDate() - 3 : c.getDate() - 1
                    ),
                    (o.day =
                      utils_util.dateUtil.ds(c, "/", !1) +
                      "/" +
                      utils_util.dateUtil.nw(c.getDay()) +
                      (o.time || ""))),
                    _view_manager_ne.onViewPrice(o, s, void 0, !k);
                } else _view_manager_ne.onViewPrice(o, s, void 0, !k);
            }
          }
        };
      })();

      ht5_viewHelper = new (function() {
        var me = this,
          setCustom = function(a, i) {
            if (_viem_manager_cfg.hasOwnProperty(a)) {
              for (var r in i)
                if (i.hasOwnProperty(r) && utils_util.isFunc(i[r]))
                  return void utils_util.trace.error("illegal operation:", r);
              "DIMENSION" == a && (ie = 1),
                copyProperties(_viem_manager_cfg[a], i),
                utils_util.stc(a, i),
                me.resize();
            } else utils_util.trace.error("not exist param:", a);
          };
        var getDimension = function(e, a) {
          var i;
          if (_viem_manager_cfg.hasOwnProperty(e)) {
            i = utils_util.clone(_viem_manager_cfg[e]);
            for (var r in i)
              if (i.hasOwnProperty(r) && utils_util.isFunc(i[r]))
                (i[r] = null), delete i[r];
              else if (a)
                for (var n = a.length; n--; )
                  typeof i[r] === a[n] && ((i[r] = null), delete i[r]);
          }
          return i;
        };
       var removeorAddAC = function(chartList, techType, options) {
          options = copyProperties(
            {
              toremove: !1,
              isexclusive: !1,
              callback: void 0
            },
            options
          );
          if (options.toremove) {
            _view_manager_view.mM.removeAC(techType, chartList);
          } else {
            if (options.isexclusive) {
              _view_manager_view.mM.removeAC(null, chartList);
              _view_manager_view.mM.newAC(techType, chartList, options);
            } else {
              _view_manager_view.mM.newAC(techType, chartList, options);
            }
          }
        };
       var updateViewId = function(viewId) {
          (viewState.viewId = viewId),
            (viewState.start = 1 == viewId ? 4 : 0),
            (viewState.end = 5);
        };
        this.pushData = function(e, a) {
          !utils_util.isArr(e) && (e = [e]), _view_manager_view.pushData(e, a);
        };
        var s;
        this.pushTr = function(e) {
          e &&
            e.data &&
            (clearTimeout(s),
            (s = setTimeout(function() {
              var t = e.data.split(","),
                a = e.symbol,
                i = e.market,
                r = {
                  symbol: a,
                  data: t[t.length - 1],
                  market: i
                };
              _view_manager_view.pushData([r], 1);
            }, 20)));
        };
        this.setScale = function(e) {
          _view_manager_view.setScale(e), utils_util.stc("t_scale", e);
        };
        var l = !0;
        this.showView = function(e, a) {
          _view_manager_iMgr_obj.hideIUis(), l ? (l = !1) : loading.hide();
          var r = globalCfg.URLHASH.vi(e);
          if (viewManangerConfig.date)
            return (
              (viewManangerConfig.date = ""),
              updateViewId(r),
              void this.newSymbol(viewManangerConfig)
            );
          var n = _view_manager_view.getAllStock()[0];
          if (
            (_view_manager_ne.onRange(n),
            utils_util.stc("t_v", e),
            utils_util.suda("vw", e),
            viewState.viewId != r)
          ) {
            if (
              (updateViewId(r),
              ("HF" == marketCode || "NF" == marketCode) && "t5" == e && 0 == C)
            )
              return (
                loading.show(), (C = 1), void _view_manager_view.update5Data(e)
              );
            _view_manager_view.onChangeView(!1, a),
              _view_manager_ne && _view_manager_ne.onViewPrice();
          }
        };
        var d = function(e) {
            var a;
            return (a = utils_util.isStr(e.symbol)
              ? e.symbol.split(",")
              : [e.symbol]);
          },
          m = [];
        this.overlay = function(e, t) {
          if (_view_manager_view && 1 != _view_manager_view.dAdd)
            if (t) {
              _view_manager_view.removeCompare(d(e));
              for (var a = 0; a < m.length; a++)
                e.symbol == m[a] && m.splice(a, 1);
              _view_manager_view.getAllStock().length <= 1 &&
                (_view_manager_view.dAdd = 0);
            } else
              (viewManangerConfig.overlaycolor = e.linecolor || {
                K_N: "#cccccc"
              }),
                (_view_manager_view.dAdd = 2),
                _view_manager_view.compare(e),
                m.push(e.symbol);
        };
        this.compare = function(e, a) {
          if (_view_manager_view) {
            var i,
              r = 0;
            if (a) {
              if (
                ((i = utils_util.isStr(e) ? e.split(",") : [e.symbol]),
                1 == _view_manager_view.dAdd &&
                  _view_manager_view.removeCompare(i),
                _view_manager_view.getAllStock().length <= 1)
              ) {
                for (r = 0; r < m.length; r++)
                  (_view_manager_view.dAdd = 2),
                    _view_manager_view.compare({
                      symbol: m[r]
                    });
                m.length < 1 && (_view_manager_view.dAdd = 0);
              }
            } else
              2 == _view_manager_view.dAdd &&
                _view_manager_view.removeCompare(m),
                (_view_manager_view.dAdd = 1),
                _view_manager_view.compare(e),
                utils_util.suda("t_comp");
            utils_util.stc("t_comp", {
              rm: a,
              o: e
            });
          }
        };
        var p = 0;
        this.tCharts = function(e, a) {
          removeorAddAC("tech", e, a),
            a && !a.noLog && (0 == p ? (p = 1) : utils_util.sudaLog());
        };
        var h = 0;
        this.pCharts = function(e, a) {
          removeorAddAC("price", e, a),
            a && !a.noLog && (0 == h ? (h = 1) : utils_util.sudaLog());
        };
        this.showPCharts = function(e) {
          e && (_view_manager_view.mM.togglePt(e), utils_util.stc("t_sp", e));
        };
        this.getIndicators = function() {
          var e = Y ? Y.getLog() : null,
            t = obj_Z ? obj_Z.getLog() : null;
          return {
            tCharts: e,
            pCharts: t
          };
        };
        var f;
        this.showRangeSelector = function(e) {
          (f = copyProperties(
            {
              dispaly: !0,
              from: void 0,
              to: void 0
            },
            e
          )),
            _view_manager_view.mM.showRs(f),
            utils_util.stc("t_rs", e);
        };
        this.setLineStyle = function(e) {
          _view_manager_view && _view_manager_view.setTLineStyle(e),
            utils_util.stc("t_style", e);
        };
        this.setCustom = fBind(setCustom, this, "custom");
        this.setDimension = fBind(setCustom, this, "DIMENSION");
        this.getDimension = fBind(getDimension, null, "DIMENSION", ["boolean"]);
        this.setTheme = function(e) {
          var t = _view_manager_initMgr_ojb.initTheme(e);
          t &&
            (this.setLineStyle({
              linecolor: e
            }),
            this.resize());
        };
        this.newSymbol = function(e) {
          if (
            ((viewManangerConfig.symbol = e.symbol),
            (viewManangerConfig.date = e.date),
            _view_manager_iMgr_obj.hideIUis(),
            _view_manager_iMgr_obj.iReset(),
            _view_manager_view.dcReset(),
            _view_manager_view.dcInit(viewManangerConfig),
            _viem_manager_tipObj.hideTip(),
            Y)
          ) {
            var a = Y.getLog();
            (Y = null), a && this.tCharts(a);
          }
          if (obj_Z) {
            var r = obj_Z.getLog();
            (obj_Z = null), r && this.pCharts(r);
          }
          f &&
            ((f.from = void 0),
            (f.to = void 0),
            _view_manager_view.mM.showRs(f)),
            utils_util.stc("t_ns", e);
        };
        this.resize = function(e, t) {
          _view_manager_initMgr_ojb.resizeAll(!0, e, t);
        };
        this.hide = function(e) {
          (ae = !0),
            _view_manager_iMgr_obj.hideIUis(),
            utils_util.$CONTAINS(_view_manager_root_dom, dom_elA) &&
              _view_manager_root_dom.removeChild(dom_elA),
            e && _view_manager_view.dcReset();
        };
        this.show = function(e) {
          (ae = !1),
            e &&
              (utils_util.isStr(e) && (e = f$DOM(e)),
              (_view_manager_root_dom = e)),
            utils_util.$CONTAINS(_view_manager_root_dom, dom_elA) ||
              (_view_manager_root_dom.appendChild(dom_elA),
              _view_manager_initMgr_ojb.resizeAll(!0)),
            _view_manager_ne && _view_manager_ne.onViewPrice();
        };
        this.shareTo = function(e) {
          _view_manager_view.shareTo(e), utils_util.stc("t_share", e);
          var a = e && e.type ? e.type : "weibo";
          utils_util.suda("share", a);
        };
        this.getChartId = function() {
          return _viem_manager_cfg.uid;
        };
        this.dateTo = function(historytime, historycb) {
          viewManangerConfig.historytime = historytime;
          viewManangerConfig.historycb = historycb;
          var date = historytime;
          "object" == typeof historytime
            ? (date = dateUtil.ds(historytime, "-"))
            : (historytime = dateUtil.sd(historytime));
          var n = _view_manager_whatJ.get();
          if (null == n) return void (O = 1);
          for (var o = n.length, s = 0; o > s; s++)
            if (dateUtil.stbd(historytime, n[s][0].date))
              return void _view_manager_view.moving(s, s + 1, "dateTo");

          viewManangerConfig.date = date;
          _view_manager_view.hasHistory = historycb;
          utils_util.stc("t_ft", date);
          this.newSymbol(viewManangerConfig);
        };
        this.showScale = function(e) {
          _view_manager_view && _view_manager_view.setScale(e);
        };
        this.resize = function(e, t) {
          _view_manager_initMgr_ojb.resizeAll(!0, e, t);
        };
        this.showCompatibleTip = function(e) {
          _view_manager_initMgr_ojb.showCompatibleTip(e);
        };
        this.toggleExtend = function(e) {
          var t,
            i = _viem_manager_cfg.DIMENSION.posX;
          (t = e ? "on" == !e : _viem_manager_cfg.DIMENSION.extend_draw),
            setCustom.call(this, "DIMENSION", {
              extend_draw: !t,
              posX: i > 9 ? _viem_manager_cfg.DIMENSION.extend_padding : 55,
              RIGHT_W: i > 9 ? _viem_manager_cfg.DIMENSION.extend_padding : 55
            }),
            this.resize();
        };
        this.historyData = function() {
          return _view_manager_view.historyData;
        };
        this.getExtraData = function(e) {
          return _view_manager_view.getExtraData(e);
        };
        this.patcher = {
          iMgr: _view_manager_iMgr_obj.patcher
        };
        this.zoom = function(e) {
          _view_manager_view.zoomApi(e), utils_util.stc("t_zoom", e, 9e3);
        };
        this.move = function(e) {
          (e = parseInt(e)),
            isNaN(e) ||
              (_view_manager_view.moveApi(e), utils_util.stc("t_move", e, 9e3));
        };
        this.getSymbols = function() {
          return _view_manager_view.getAllSymbols();
        };
        this.update = function() {
          _view_manager_view.updateDataAll(1),
            utils_util.stc("t_up", "update", 9e3);
        };
        this.getCurrentData = function() {
          return _view_manager_ne.currentData();
        };
        this.viewState = viewState;
        this.me = _ViewManager_me;
        this.type = "h5t";
      })();
      _view_manager_view = new View();
      _view_manager_view.dcInit(viewManangerConfig);
      return ht5_viewHelper;
    }
    function entityFun() {
      function createViewMangerAndInvokeCallBack(config, callback) {
        var viewManager = new ViewManger(config);
        var n = function(e) {
          viewManager.me.rl(e, n);
        };
        viewManager.me.al(globalCfg.e.T_DATA_LOADED, n);
        utils_util.isFunc(callback) && callback(viewManager);
      }

      this.get = function(config, callback) {
        utils_util.stc("h5t_get");
        utils_util.suda("h5t_" + utils_util.market(config.symbol));
        var isHttps;
        0 == location.protocol.indexOf("https:") && (isHttps = true);
        var market = utils_util.market(config.symbol),
          url =
            "http://stock.finance.sina.com.cn/futures/api/jsonp.php/$cb=/InterfaceInfoService.getMarket?category=$market&symbol=$symbol",
          globalurl =
            "//stock.finance.sina.com.cn/usstock/api/jsonp.php/var $cb=/Global_IndexService.getTradeTime?symbol=$symbol&category=index";
        switch ((isHttps && (url = utils_util.getSUrl(url)), market)) {
          case "HF":
            var l = "kke_future_" + config.symbol;
            utils_util.load(
              url
                .replace("$symbol", config.symbol.replace("hf_", ""))
                .replace("$market", "hf")
                .replace("$cb", "var " + l),
              function() {
                (l = window[l] || {
                  time: [["06:00", "23:59"], ["00:00", "05:00"]]
                }),
                  (config._hf_window_var = l),
                  createViewMangerAndInvokeCallBack(config, callback);
              },
              null,
              {
                symbol: config.symbol,
                market: market,
                type: "init_hf"
              }
            );
            break;

          case "NF":
            var c = "kke_future_" + config.symbol,
              d = config.symbol.replace("nf_", "").replace(/[\d]+$/, "");
            utils_util.load(
              url
                .replace("$symbol", d)
                .replace("$market", "nf")
                .replace("$cb", "var " + c),
              function() {
                (c = window[c] || {
                  time: [["09:30", "11:29"], ["13:00", "02:59"]]
                }),
                  (c.inited = 0),
                  (config._nf_window_var = c),
                  createViewMangerAndInvokeCallBack(config, callback);
              },
              null,
              {
                symbol: config.symbol,
                market: market,
                type: "init_nf"
              }
            );
            break;
          case "global_index":
            var m = "kke_global_index_" + config.symbol;
            utils_util.load(
              globalurl
                .replace("$symbol", config.symbol.replace("znb_", ""))
                .replace("$cb", m),
              function() {
                (m = window[m] || {
                  time: [["06:00", "23:59"], ["00:00", "05:00"]]
                }),
                  (config._gbi_window_var = m),
                  createViewMangerAndInvokeCallBack(config, callback);
              },
              null,
              {
                symbol: config.symbol,
                market: market,
                type: "init_global"
              }
            );
            break;
          default:
            createViewMangerAndInvokeCallBack(config, callback);
        }
      };
    }
    var ht5_viewHelper,
      ht5_o,
      ht5_pChart,
      ht5_tChart,
      f$DOM = utils_util.$DOM,
      utils_util_$C = utils_util.$C,
      fCONTAINS = utils_util.$CONTAINS,
      xh5_PosUtil = utils_util.xh5_PosUtil,
      xh5_EvtUtil = utils_util.xh5_EvtUtil,
      copyProperties = utils_util.oc,
      dateUtil = utils_util.dateUtil,
      stbd = utils_util.dateUtil.stbd,
      ht5_c = utils_util.xh5_ADJUST_HIGH_LOW.c,
      xh5_BrowserUtil = utils_util.xh5_BrowserUtil,
      fBind = utils_util.fBind,
      strUtil_ps = utils_util.strUtil.ps,
      globalCfg = cfgs_settinger.globalCfg,
      logoM = utils_util.logoM;
    utils_util.fInherit(ViewManger, utils_util.xh5_EvtDispatcher);
    return entityFun;
  }
);
