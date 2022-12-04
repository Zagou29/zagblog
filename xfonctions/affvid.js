import { cloneTemplate } from "./dom.js";
/**
 * @typedef {object} boxes
 * @property {string} ec
 * @property {string} id
 * @property {string} class
 * @property {string} text
 */
export class Affvid {
  /**
   * @type {array}vidlist avec ec,id,class,text
   *  */
  #vidlist = [];
  #vidSelect = [];
  #listElement = [];
  #clas = "";
  #elMenu = [];
  /**
   * tableau des videos objets
   * @param {vidlist[]} vidlist
   */
  constructor(vidlist) {
    this.#vidlist = vidlist;
  }
  /**
   * @param {HTMLElement} element (ecVideos)
   * @param {string} clas (classes selectionné via le lien menu Li)
   */
  apVideos(element, clas) {
    this.#clas = clas;
    this.#vidSelect = this.#vidlist.filter((obj) =>
      obj.class.includes(this.#clas)
    );
    this.#listElement = element;
    this.#vidSelect.forEach((obj, index) => {
      const video = new VidItem(obj);
      video.retourItem
        .querySelector(".lect")
        .setAttribute("width", this.#setDim(element, obj)[0]);
      video.retourItem
        .querySelector(".lect")
        .setAttribute("height", this.#setDim(element, obj)[1]);
        video.retourItem.querySelector(".lect").dataset.num = index
      this.#listElement.append(video.retourItem);
    });
  }
  apBar(elMenu) {
    elMenu.append(cloneTemplate("barContainer"));
    this.#elMenu = elMenu.querySelector(".barBox");
    if(this.#vidSelect.length>1)
    {this.#vidSelect.forEach((obj, index) => {
      const barItem = new BarItem(obj);
      barItem.retourBarItem.dataset.num = index
      this.#elMenu.append(barItem.retourBarItem);
    });}
  }
  get retourVideo() {
    return this.#vidSelect;
  }

  #setDim(ecrans, item) {
    const wl = ecrans.clientWidth - 5;
    const wh = ecrans.clientHeight - 27;
    const ratioI = item.ec === "43" ? 4 / 3 : 16 / 9;
    const ratioW = wl / wh;
    /* si on compare les ratios,il faut inverser et definir d'abord la hauteur */
    return [
      ratioW > ratioI ? wh * ratioI : wl,
      ratioW > ratioI ? wh : wl / ratioI,
    ];
  }
}

class VidItem {
  #vidItem;
  #vidElement;
  constructor(vid) {
    this.#vidItem = vid;
    this.#vidElement = cloneTemplate("ytFrame");
    this.#vidElement.querySelector(".vidTitre").textContent = `${
      this.#vidItem.class.slice(0, 4) == ".vid" ? "Video " : "Diapo "
    }${this.#vidItem.text}`;
    const video = this.#vidElement.querySelector(".lect");
    // video.setAttribute("id",this.#vidItem.id)
    this.#vidItem.id.length !== 34
      ? video.setAttribute(
          "src",
          `https://www.youtube-nocookie.com/embed/${
            this.#vidItem.id
          }?rel=0&amp;modestbranding=1`
        )
      : video.setAttribute(
          "src",
          `https://www.youtube-nocookie.com/embed/videoseries?list=${
            this.#vidItem.id
          }&amp;rel=0&amp;modestbranding=1`
        );
  }
  get retourItem() {
    return this.#vidElement;
  }
}
class BarItem {
  #vidObj;
  #barElement;
  constructor(vid) {
    this.#vidObj = vid;
    this.#barElement = cloneTemplate("itemYT").firstElementChild;
    // this.#barElement.setAttribute("id", this.#vidObj.id);
    this.#barElement.textContent= this.#vidObj.text
  }

  get retourBarItem() {
    return this.#barElement;
  }
}
