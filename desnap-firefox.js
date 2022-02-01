//desactiver snap pour firefox
function desnap(elem) {
  const browserName = (agent) => {
    switch (true) {
      case agent.indexOf("edge") > -1:
        return "MS Edge";
      case agent.indexOf("edg/") > -1:
        return "Edge ( chromium based)";
      case agent.indexOf("opr") > -1 && !!window.opr:
        return "Opera";
      case agent.indexOf("chrome") > -1 && !!window.chrome:
        return "Chrome";
      case agent.indexOf("trident") > -1:
        return "MS IE";
      case agent.indexOf("firefox") > -1:
        return "Firefox";
      case agent.indexOf("safari") > -1:
        return "Safari";
      default:
        return "other";
    }
  };
  const nav = browserName(window.navigator.userAgent.toLowerCase());
  if (nav === "Firefox") {
    elem.setAttribute("style", "scroll-snap-type: none");
  }
}
export { desnap };
