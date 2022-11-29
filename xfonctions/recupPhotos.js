const videos = [...document.querySelectorAll("img")];
const jsonObj = {};
const jsonFile = [];

videos.forEach((vid, index) => {
  jsonObj.class = vid.classList[1];
  jsonObj.src = vid.getAttribute("src");
  if (vid.dataset.an) {
    jsonObj.an = vid.getAttribute("data-an");
    jsonObj.seuil = vid.getAttribute("data-an");
  } else jsonObj.seuil = "";
  jsonObj.num = index;
  jsonFile.push({
    class: jsonObj.class,
    an: jsonObj.an,
    src: jsonObj.src,
    num: jsonObj.num,
    seuil: jsonObj.seuil,
  });
});
console.log(jsonFile);
