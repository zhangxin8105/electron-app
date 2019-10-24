import { timeout } from "./utils";
export async function getTechDatas(code) {
  if (window.techs && window.techs[code]) return window.techs[code];
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
      function(chart_) {}
    );
  });
  do {
    if (window["tech_" + code]) {
      document.body.remove(dom);
      return window["tech_" + code];
    }
    timeout(100);
  } while (true);
}