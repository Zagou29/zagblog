import { cloneTemplate } from "./dom.js";

export class Affimg {
  #listimg; //liste des objets img venat de JSON
  #opt; // option 'photo' ou non
  #elt_image; //fragment où charger les img
  #elt_dates; //element ou charger les liensdates
  #list_image; //Boite de chargement des images
  #list_dates; //boite ou charger les Li dates
  constructor(listimg, opt) {
    this.#listimg = listimg;
    this.#opt = opt;
  }
  creeimages(list_image) {
    this.#list_image = list_image;
    this.#elt_image = new DocumentFragment();
    let n = 0;
    let seuil = "";
    this.#listimg[0].seuil = seuil;
    if (this.#opt === "photo") {
      this.#listimg.forEach((obj, index) => {
        if (obj.an !== seuil) {
          obj.seuil = obj.an;
          obj.num = index;
          n = index;
        } else {
          obj.num = n;
          obj.seuil = "";
        }
        const image = new AffItem(obj);
        this.#elt_image.append(image.retourImage);
        seuil = obj.an;
      });
    } else {
      this.#listimg.forEach((obj, index) => {
        obj.an !== seuil ? (obj.seuil = obj.an) : (obj.seuil = "");
        obj.num = index;
        const image = new AffItem(obj);
        this.#elt_image.append(image.retourImage);
        seuil = obj.an;
      });
    }
    this.#list_image.append(this.#elt_image);
  }

  creedates(list_dates) {
    this.#list_dates = list_dates;
    this.#elt_dates = new DocumentFragment();
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
    this.#list_dates.append(this.#elt_dates);
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
