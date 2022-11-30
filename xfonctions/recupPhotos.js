const videos = [...document.querySelectorAll("img")];
const jsonObj = {};
const jsonFile = [];

videos.forEach((vid, index) => {
  jsonObj.class = vid.classList[1];
  jsonObj.src = vid.getAttribute("src");
  if (vid.dataset.an) {
    jsonObj.an = vid.getAttribute("data-an");
    jsonObj.seuil = vid.getAttribute("data-an");
  } 
  jsonObj.num = index;
  jsonFile.push({
    class: jsonObj.class,
    src: jsonObj.src,
    an: jsonObj.an,
    num: jsonObj.num,
    seuil: jsonObj.seuil,
  });
});
console.log(JSON.stringify(jsonFile));
