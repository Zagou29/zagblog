const videos = [...document.querySelectorAll("img")];
const jsonObj = {};
const jsonFile = [];

videos.forEach((vid, index) => {
  jsonObj.class = vid.classList[1];
  jsonObj.src = vid.getAttribute("src");
  if (vid.dataset.an) {
    jsonObj.an = vid.getAttribute("data-an")
  }
  jsonFile.push({
    class: jsonObj.class,
    an: jsonObj.an,
    src: jsonObj.src,
  });
});
console.log(JSON.stringify(jsonFile));
