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
  /**
   * tableau des videos objets
   * @param {vidlist[]} vidlist
   */
  constructor(vidlist) {
    this.#vidlist = vidlist;
  }
  /**
   *
   * @param {HTMLElement} element (ecVideos)
   * @param {string} clas (classes selectionné via le lien menu Li)
   */
  apVideos(element, clas) {
    this.#clas = clas;
    this.#vidSelect = this.#vidlist.filter((obj) =>
      obj.class.includes(this.#clas)
    );
    this.#listElement = element;
    this.#vidSelect.forEach((obj) => {
      const video = new VidItem(obj);
      console.log(video.retourItem);
      // this.#listElement.append(video.retourItem);
    });
  }
  get returnVids() {
    return this.#vidSelect;
  }
}

class VidItem {
  #vidItem;
  #vidElement;
  constructor(vid) {
    this.#vidItem = vid;
    this.#vidElement = cloneTemplate("ytFrame");
    this.#vidElement.querySelector(".vidTitre").textContent =
      this.#vidItem.text;
    this.#vidItem.id.length !== 34
      ? this.#vidElement
          .querySelector(".lect")
          .setAttribute(
            "src",
            `https://www.youtube-nocookie.com/embed/${
              this.#vidItem.id
            }?rel=0&amp;modestbranding=1`
          )
      : this.#vidElement
          .querySelector(".lect")
          .setAttribute(
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
