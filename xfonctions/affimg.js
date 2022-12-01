import { cloneTemplate } from "./dom.js";

export class Affimg {
  #listimg; //liste des objets img venat de JSON
  #opt; // option 'photo' ou non
  #elt_image; //element où charger les img
  #elt_dates; //element ou charger les liensdates

  constructor(listimg, opt) {
    this.#listimg = listimg;
    this.#opt = opt;
  }
  creeimages(elt_image) {
    this.#elt_image = elt_image;
    if (this.#opt === "photo") {
      let n;
      this.#listimg.forEach((obj) => {
        obj.num = obj.seuil !== "" ? (n = obj.num) : (obj.num = n);
        const image = new AffItem(obj);
        this.#elt_image.append(image.retourImage);
      });
    } else {
      const zero = this.#listimg[0].num;
      this.#listimg.forEach((obj,index) => {
      obj.num= index

        const image = new AffItem(obj);
        this.#elt_image.append(image.retourImage);
      });
    }
  }

  creedates(elt_dates) {
    this.#elt_dates = elt_dates;
    if (this.#opt === "photo") {
      this.#listimg.forEach((obj) => {
        const liendate = new DateItem(obj);
        if (obj.seuil !== "") this.#elt_dates.append(liendate.retourDateItem);
      });
    } else {
      this.#listimg.forEach((obj) => {
        const liendate = new DateItem(obj);
        this.#elt_dates.append(liendate.retourDateItem);
      });
    }
  }

  get retourList() {
    return this.#listimg;
  }
}

class AffItem {
  #imgobj;
  #el_image;
  constructor(imgobj) {
    this.#imgobj = imgobj;
    this.#el_image = cloneTemplate("photos").firstElementChild;
    this.#el_image.setAttribute("src", this.#imgobj.src);
    this.#el_image.setAttribute("alt", this.#imgobj.an);
    this.#el_image.setAttribute("class", "show");
    this.#el_image.dataset.an = this.#imgobj.an;
    this.#el_image.dataset.num = this.#imgobj.num;
    if (this.#imgobj.seuil !== "")
      this.#el_image.dataset.seuil = this.#imgobj.seuil;
  }

  get retourImage() {
    return this.#el_image;
  }
}

class DateItem {
  #dateObj;
  #dateElt;
  constructor(dateObj) {
    this.#dateObj = dateObj;
    this.#dateElt = cloneTemplate("liendate").firstElementChild;
    this.#dateElt.dataset.an = this.#dateObj.an;
    this.#dateElt.dataset.num = this.#dateObj.num;
    this.#dateElt.textContent = this.#dateObj.an;
    this.#dateElt.dataset.seuil =
      this.#dateObj.seuil !== "" ? this.#dateObj.an : "----";
  }

  get retourDateItem() {
    return this.#dateElt;
  }
}
