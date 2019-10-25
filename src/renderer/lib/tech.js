import { timeout } from "./utils";
import { getTodayCacheData } from "./db";
export async function getTechDatas(code) {
  if (window.techs && window.techs[code]) return window.techs[code];

  return await getTodayCacheData("tech_" + code, async function() {
    let dom = document.createElement("DIV");
    document.body.appendChild(dom);
    dom.setAttribute("id", "h5Figure");
    dom.innerHTML = "";
    dom.style.display = "none";
    await new Promise((resolve, reject) => {
      KKE.api(
        "plugins.tchart.get",
        {
          symbol: code,
          mt: "cnlv1",
          dom_id: "h5Figure",
          type: "tech"
        },
        function(chart_) {
          resolve();
        }
      );
    });
    do {
      if (window["tech_" + code]) {
        document.body.remove(dom);

        return window["tech_" + code];
      }
      console.log(new Date());
      await timeout(100);
    } while (true);
  });
}
