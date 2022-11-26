const videos = [...document.querySelector(".videos").querySelectorAll("li")];
const jsonObj = {};
const jsonFile = [];
videos.forEach((vid) => {
  jsonObj.ec = vid?.dataset.ec ? vid?.dataset.ec : "16";
  jsonObj.class= vid.classList.value
  jsonObj.text = vid.textContent.trim();

  jsonFile.push({
    ec: jsonObj.ec,
    class: jsonObj.class,
    text: jsonObj.text,
  });
});
console.log(videos.length,JSON.stringify(jsonFile));
