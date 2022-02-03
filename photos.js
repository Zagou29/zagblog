import { desnap } from "./desnap-firefox.js";
import { go_fullScreen,  stop_fullScreen } from "./fullScreen.js";

/*  recuperer la valeur venant de index */
const val_trans = localStorage.getItem("data");
const val = document.querySelector(".transval");
const list_img = document.querySelectorAll(`.${val_trans}`);
const tab_titre = [
  { id: "avion", titre: "Avions 14-18" },
  { id: "guerre", titre: "Guerre 14-18" },
  { id: "fam17", titre: "Famille de 1917 à 1930" },
  { id: "marys", titre: "Les Mary's de 1917 à 1930" },
  { id: "gonz", titre: "Gonzague II en écosse" },
  { id: "us47", titre: "USA 1947" },
];
const val_titre = tab_titre.find((val) => val.id === val_trans);
localStorage.removeItem("data");
val.textContent = val_titre.titre;
/* selectionner les iamges selon val_trans */
list_img.forEach((list) => {
  list.classList.add("show");
});

/* -------------------------------- */
const fleches = document.querySelectorAll(".fleches");
const full = document.querySelector(".fullscreen");
const fix_fond = document.querySelector(".envel");
const boiteImg = document.querySelector(".image");
const stop_prec = document.querySelector(".prec");
const stop_suiv = document.querySelector(".suiv");
/* --------------------------------------------- */
/* Zoom quand on clicke sur une image en changeant les classes */
let zoome = false;
const zoom = (e) => {
  zoome = zoome === true ? false : true;
  /* revenir en mode normal si on est en fullscreen +retour images */
  stop_fullScreen();
  /* montrer les flèches */
  fleches.forEach((fl) => fl.classList.toggle("show_grid"));
  /* montrer les fleche f pour fullscreen */
  const alert = () => full.classList.remove("show_grid");
  if (zoome) {
    full.classList.add("show_grid");
    setTimeout(alert, 5000);
  }

  /* ramener toutes les images en plein ecran et definelemnt horizontal */
  boiteImg.classList.toggle("image_mod");
  fix_fond.classList.toggle("envel_mod");
  /* pointer sur l'image sur laquelle on a cliqué */
  boiteImg.scrollTo({
    left: e.target.offsetLeft,
  });
  // desnaper le defilement horizontal pour firefox
  desnap(boiteImg);

  /* rajouter le stop au debut et la la fin des images */
  boiteImg.addEventListener("scroll", () => {
    if (boiteImg.scrollLeft === 0) stop_prec.classList.add("show");
    else {
      stop_prec.classList.remove("show");
    }
    if (boiteImg.scrollLeft === boiteImg.scrollWidth - boiteImg.offsetWidth)
      stop_suiv.classList.add("show");
    else {
      stop_suiv.classList.remove("show");
    }
  });
};

/* --------------------------------------------- */
/* cliquer sur av et ar pour passer d'une image a une autre à la souris*/
const av_ar = () => {
  fleches.forEach((el) => {
    el.addEventListener("click", (e) => {
      if (el === fleches[0]) {
        /* aller à position gauche de l'image- largeur de l'image*/
        boiteImg.scrollTo({
          left: boiteImg.scrollLeft - boiteImg.offsetWidth,
        });
      } else {
        boiteImg.scrollTo({
          left: boiteImg.scrollLeft + boiteImg.offsetWidth,
        });
      }
      e.stopPropagation();
    });
  });
};
/* ------gestion du fullscreen qui doit recharger l'ecran envel_mod si on tape"f" */
const fulls = () => {
  document.addEventListener("keydown", (e) => {
    if (e.key === "f") go_fullScreen(document.querySelector(".envel_mod"));
    e.stopPropagation;
  });
};

/* ------------------------------------------ */
/*  quand on clique sur une image, zoomer , utiliser les fleches et fullscreen*/

list_img.forEach((img) => {
  img.addEventListener("click", (e) => {
    zoom(e);
  });
});
av_ar();
fulls();
