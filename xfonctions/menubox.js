import { cloneTemplate } from "./dom.js";

/**
 * @typedef {object} Todo
 * @property {number} id
 * @property {string} title
 * @property {boolean} completed
 *
 */
export class Menubox {
  /** @type {boxes[]} objet avec tous les todos (id,title,completed)*/
  #boxes = [];
  #photos = [];
  #dataMenu;

  /** @type {HTMLUListelement}li créée a partir des todos */
  #listElement = [];
  /**
   *construit une liste de todos
   * @param {Todo[]} boxes
   */
  constructor(boxes) {
    this.#boxes = boxes;
  }
  /**
   *methode pour afficher les todos daans le dom grace à des <li>
   * @param {HTMLelement} element
   */
  apBox_Ph(element, datamenu) {
    this.#dataMenu = datamenu;
    /** Array des objets box de PH*/
    this.#photos = this.#boxes.filter(
      (objbox) => objbox.menu === this.#dataMenu
    );
    console.log(this.#photos);
    /** definir l'emplacement d'insertion des boites */
    this.#listElement = element;
    console.log(this.#listElement);
    /**céer une boite par objet et l'inserer dans listElement */
    this.#photos.forEach((boite) => {
      const box = new BoxItem(boite);
      this.#listElement.append(box.returnBox);
    });
  }
  get returnBoxes() {
    return this.#boxes;
  }
}

class BoxItem {
  #boxElement;
  #boxItem;
  #menu;
  constructor(box) {
    this.#boxItem = box;
    /** créer une boite à partir du template */
    this.#boxItem.menu === "ph"
      ? (this.#menu = "photos")
      : (this.#menu = "blogs");
    console.log(this.#menu);
    this.#boxElement = cloneTemplate(this.#menu).firstElementChild;
    this.#boxElement
      .querySelector("img")
      .setAttribute("src", this.#boxItem.src);
    this.#boxElement
      .querySelector("img")
      .setAttribute("alt", this.#boxItem.spText);
    this.#boxElement.querySelector(".ti_blog").textContent =
      this.#boxItem.spText;
    if (this.#boxItem.menu === "ph") {
      this.#boxElement.dataset.ph = this.#boxItem.ph;
      this.#boxElement.querySelector(".texte").textContent =
        this.#boxItem.divText;
    } else {
      this.#boxElement
        .querySelector("a")
        .setAttribute("href", this.#boxItem.href);
    }
    console.log(this.#boxElement);
  }
  get returnBox() {
    return this.#boxElement;
  }
}
