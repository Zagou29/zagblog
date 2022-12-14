import { cloneTemplate } from "./dom.js";

/**
 * @typedef {object} boxes
 * @property {string} menu
 * @property {string} ph id
 * @property {string} href
 * @property {string} src
 * @property {string} spText texte
 * @property {string} divText
 */
export class Menubox {
  /** @type {boxes[]} objet avec tous les boxes (id,title,completed)*/
  #boxes = [];
  #boxSelect = [];
  #dataMenu;
  #boxElement;

  /** @type {HTMLUListelement}li créée a partir des todos */
  #listElement = [];
  /**
   *construit une liste de todos
   * @param {boxes[]} boxes
   */
  constructor(boxes) {
    this.#boxes = boxes;
  }
  /**
   *methode pour afficher les todos daans le dom grace à des <li>
   * @param {HTMLelement} element
   */
  apBox_Ph(element, datamenu, sens) {
    this.#boxElement = element;
    this.#dataMenu = datamenu;
    /** Array des objets box de PH*/
    this.#boxSelect = this.#boxes.filter(
      (objbox) => objbox.menu === this.#dataMenu
    );
    /** definir l'emplacement d'insertion des boites */
    this.#listElement = new DocumentFragment();
    /**céer une boite par objet et l'inserer dans listElement */
    if (sens === "1") {
      this.#boxSelect.forEach((boite) => {
        const box = new BoxItem(boite);
        this.#listElement.append(box.returnBox);
      });
    } else {
      this.#boxSelect.forEach((boite) => {
        const box = new BoxItem(boite);
        this.#listElement.prepend(box.returnBox);
      });
    }
    this.#boxElement.append(this.#listElement);
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
  }
  get returnBox() {
    return this.#boxElement;
  }
}
