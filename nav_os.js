/* OS? */

/* Win Mac Linux Android like Mac */
const ordiOS = {
  win: navigator.userAgent.indexOf("Win"),
  mac: navigator.userAgent.indexOf("Mac"),
  linux: navigator.userAgent.indexOf("Linux"),
  android: navigator.userAgent.indexOf("Android"),
  ios: navigator.userAgent.indexOf("like Mac"),
};
const navigateur = {
  edge: navigator.userAgent.toLowerCase().indexOf("edge"),
  opera: navigator.userAgent.toLowerCase().indexOf("opr"),
  chrome: navigator.userAgent.toLowerCase().indexOf("chrome"),
  ie: navigator.userAgent.toLowerCase().indexOf("trident"),
  firefox: navigator.userAgent.toLowerCase().indexOf("firefox"),
  safari: navigator.userAgent.toLowerCase().indexOf("safari"),
};
const ordi_OS = () => ordiOS;
const navig = () => navigateur;
console.log(navigator.userAgent.toLowerCase())
export { ordi_OS, navig };
