import { cloneTemplate } from "./dom.js";

export class Affimg {
  #listimg;
  #opt;
  #el_image

  constructor(listimg, opt) {
    this.#listimg = listimg;
    this.#opt = opt;
  }

  creeimages (el_image){
    this.#el_image=el_image

  }
get retourList (){
    return this.#listimg
}

}
