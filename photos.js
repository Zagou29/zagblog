import { desnap } from "./desnap-firefox.js";
import { go_fullScreen, stop_fullScreen } from "./fullScreen.js";

/*  recuperer la valeur venant de index */
const val_trans = localStorage.getItem("data");
const val = document.querySelector(".transval");
const fix_fond = document.querySelector(".envel");
const full = fix_fond.querySelector(".fullscreen");
const fleches = fix_fond.querySelectorAll(".fleches");
const boiteImg = fix_fond.querySelector(".image");
const stop_prec = fix_fond.querySelector(".prec");
const stop_suiv = fix_fond.querySelector(".suiv");
const list_img = [...boiteImg.getElementsByClassName(`${val_trans}`)];
const tab_titre = [
  { id: "avion", titre: "Avions 14-18" },
  { id: "guerre", titre: "Guerre 14-18" },
  { id: "fam17", titre: "Famille de 1917 à 1944" },
  { id: "marys", titre: "Les Mary's de 1917 à 1930" },
  { id: "gonz", titre: "Gonzague II en écosse" },
  { id: "cous", titre: "Cousins américains" },
  { id: "lasc", titre: "Lascamps 1947 1955" },
  { id: "mimo", titre: "Mimosa 1956 1970 " },
  { id: "a708", titre: "Les années 70" },
  { id: "a80", titre: "Les années 80" },
  { id: "a90", titre: "Les années 90" },
  { id: "chgv", titre: "2000 à 2007 " },
  { id: "a0813", titre: "2008 à 2013 " },
  { id: "a1416", titre: "2014 à 2016 " },
  { id: "a1719", titre: "2017 à 2019 " },
  { id: "a2022", titre: "2020 à 2022 " },
];
const val_titre = tab_titre.find((val) => val.id === val_trans);
localStorage.removeItem("data");
val.textContent = val_titre.titre;
/* afficher les images selon val_trans */
list_img.forEach((list) => list.classList.add("show"));
/* --------------------------------------------- */
/* fonction qui ajoute ou enleve l'icone stop sur les fleches */
const montreStop = (condition, el) => {
  if (condition) el.classList.add("show");
  else {
    el.classList.remove("show");
  }
};
/* montre l'icone stop debut ou l'icone stop fin ou efface */
const stopFleches = () => {
  montreStop(boiteImg.scrollLeft === 0, stop_prec);
  montreStop(
    boiteImg.scrollLeft === boiteImg.scrollWidth - boiteImg.offsetWidth,
    stop_suiv
  );
};
/* ---utilisation des icones fleches pour derouler les images*/
const av_ar = () => {
  fleches.forEach((el, index) => {
    el.addEventListener("click", (e) => {
      switch (index) {
        /* aller à position gauche de l'image- largeur de l'image*/
        case 0: {
          boiteImg.scrollTo({
            left: boiteImg.scrollLeft - boiteImg.offsetWidth,
          });
          break;
        }
        case 1: {
          boiteImg.scrollTo({
            left: boiteImg.scrollLeft + boiteImg.offsetWidth,
          });
          break;
        }
      }
      e.stopPropagation();
    });
  });
};
/* Zoom quand on clicke sur une image en changeant les classes */
let zoome = false;
const alert = () => full.classList.remove("show_grid");
const zoom = (e) => {
  zoome = zoome === true ? false : true;
  /* revenir en mode normal si on est en fullscreen +retour images */
  stop_fullScreen();
  /* montrer les flèches */
  fleches.forEach((fl) => fl.classList.toggle("show_grid"));
  /* ramener toutes les images en plein ecran et definelemnt horizontal */
  boiteImg.classList.toggle("image_mod");
  fix_fond.classList.toggle("envel_mod");
  if (zoome) {
    /* pointer sur l'image sur laquelle on a cliqué */
    boiteImg.scrollTo({ left: e.target.offsetLeft });
    /* montrer les fleche f pour fullscreen , puis effacer en 5s*/
    full.classList.add("show_grid");
    setTimeout(alert, 5000);
    /* rajouter le stop au debut et la la fin des images au depart, puis au scroll */
    stopFleches();
    boiteImg.addEventListener("scroll", () => stopFleches());
    /* gestion des fleches pour derouler les images horizontalement */
    av_ar();
  }
};

/* ----utilisation des touches clavier */
const drGa = (gauche, droite, retour, fs) => {
  document.addEventListener("keydown", (e) => {
    if (e.preventDefault()) return;
    /* image de droite ou image de gauche */
    switch (e.code) {
      /* aller à position gauche de l'image- largeur de l'image*/
      case gauche: {
        boiteImg.scrollTo({ left: boiteImg.scrollLeft - boiteImg.offsetWidth });
        break;
      }
      case droite: {
        boiteImg.scrollTo({ left: boiteImg.scrollLeft + boiteImg.offsetWidth });
        break;
      }
      /* retour à Index.html ou au mur d'images*/
      case retour: {
        if (zoome) zoom(e);
        else window.location = "./index.html";
        break;
      }
      /* Toggle Fullscreen */
      case fs: {
        go_fullScreen(document.querySelector(".envel_mod"));
        break;
      }
    }
    e.stopPropagation();
  });
};
/* -----------programme------------------------------- */
/* zoom quand on clique sur une image */
list_img.forEach((img) => img.addEventListener("click", (e) => zoom(e)));
drGa("ArrowLeft", "ArrowRight", "Enter", "KeyF");
