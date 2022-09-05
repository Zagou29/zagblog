import { go_fullScreen, stop_fullScreen } from "./fullScreen.js";
import { ordi_OS } from "./nav_os.js";
/* Si l'OS est windows, supprimer les barres de defilement */
if (ordi_OS().win > 0) {
  document.querySelector(".image").classList.add("scrbar");
}

/*  prendre en charge les boites du html */
const val_trans = localStorage.getItem("data"); /* classList venant de Index */
const val = document.querySelector(".transval"); /* titre de l'ecran */
const fix_fond = document.querySelector(".envel"); /* enveloppe principale */
const boiteImg =
  fix_fond.querySelector(".image"); /* boite image dans envelop */
const list_img = [
  ...boiteImg.getElementsByClassName(`${val_trans}`),
]; /* toutes les images choisies */
const full =
  fix_fond.querySelector(".fullscreen"); /* icone FullScreen en bas */
const fleches = fix_fond.querySelectorAll(".fleches"); /* icones fleches */
const stop_prec = fix_fond.querySelector(".prec"); /*  fleche gauche*/
const stop_suiv = fix_fond.querySelector(".suiv"); /* fleche droite */
const aff_an = document.querySelector(".annee"); /* affichage annees */
const tab_titre = [
  { id: "avion", titre: "Avions 14-18" },
  { id: "guerre", titre: "Guerre 14-18" },
  { id: "fam17", titre: "Famille GdP" },
  { id: "marys", titre: "Les Mary's" },
  { id: "gonz", titre: "Gonzague II en écosse" },
  { id: "cous", titre: "Cousins américains" },
  { id: "lasc", titre: "Lascamps" },
  { id: "mimo", titre: "Mimosa" },
  { id: "a708", titre: "Années 70" },
  { id: "a80", titre: "Années 80" },
  { id: "a90", titre: "Années 90" },
  { id: "chgv", titre: "2000-2007 " },
  { id: "a0813", titre: "2008-2013 " },
  { id: "a1416", titre: "2014-2016 " },
  { id: "a1719", titre: "2017-2019 " },
  { id: "a2022", titre: "2020-2022 " },
]; /* tableau des tires des ecrans venant de Index */

/* cherche l'ID venant de index et affecte le titre à */
const val_titre = tab_titre.find((val) => val.id === val_trans);
localStorage.removeItem("data");
val.textContent = val_titre.titre;
/* afficher les images selon val_trans */
list_img.forEach((img) => img.classList.add("show"));
/* liste des images taguées avec les dates dans data-an */
list_img.forEach((dat, index) => {
  if (!dat.getAttribute("data-an")) {
    dat.setAttribute("data-an", list_img[index - 1].getAttribute("data-an"));
  } else {
    dat.setAttribute("data-seuil", dat.getAttribute("data-an"));
  }
});

/* --------------------------------------------- */
/* fonction qui ajoute ou enleve l'icone stop sur les fleches */
const toggleStop = (condition, el) => {
  if (condition) el.classList.add("show");
  else {
    el.classList.remove("show");
  }
};
/* montre l'icone stop debut ou l'icone stop fin ou efface */
const showStop = () => {
  toggleStop(boiteImg.scrollLeft === 0, stop_prec);
  toggleStop(
    boiteImg.scrollLeft === boiteImg.scrollWidth - boiteImg.offsetWidth,
    stop_suiv
  );
};
/* ---utilisation des icones fleches pour derouler les images*/

const av_ar = (fl) => {
  fl.forEach((el, index) => {
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
/* gestion des touches de direction, retour et "F"pour fullscreen */

const drGa = (image, gauche, droite, retour, fs) => {
  document.addEventListener(
    "keydown",
    (e) => {
      if (e.preventDefault()) return;
      /* image de droite ou image de gauche */
      switch (e.code) {
        /* aller à position gauche de l'image- largeur de l'image*/
        case gauche: {
          image.scrollTo({ left: image.scrollLeft - image.offsetWidth });
          break;
        }
        case droite: {
          image.scrollTo({ left: image.scrollLeft + image.offsetWidth });
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
    }

  );
};
/* Zoom quand on clicke sur une image en changeant les classes */
let zoome = false;
let bloc_tab = true;
const alert = () => full.classList.remove("show_grid");
/* quand on arrive sur l'ecran Photo, */
const zoom = (e) => {
  zoome = zoome === true ? false : true;
  /* revenir en mode normal si on est en fullscreen +retour images */
  stop_fullScreen();
  /* montrer les flèches */
  fleches.forEach((fl) => fl.classList.toggle("show_grid"));
  /* ramener toutes les images en plein ecran et defilement horizontal */
  fix_fond.classList.toggle("envel_mod");
  boiteImg.classList.toggle("image_mod");
  /* ------ gestion du cas ou l'ecran est en class "".image_mod" */
  /* observe les années en vertical */

  /* arrete d'oberver en horizontal */
  if (zoome) {
    /* pointer sur l'image sur laquelle on a cliqué */
    boiteImg.scrollTo({ left: e.target.offsetLeft });
    /* montrer la fleche f pour fullscreen , puis effacer en 5s*/
    full.classList.add("show_grid");
    setTimeout(alert, 5000);
    /* rajouter le stop au debut et la la fin des images au depart, puis au scroll */
    showStop();
    boiteImg.addEventListener("scroll", () => showStop());
    /* arret d'observe en vertical */
    
    /* met Années a blanc */
    aff_an.textContent = e.target.getAttribute("data-an");
    /* crée le tableau des dates horizontales une seule fois */
  }
};

/* -----------programme------------------------------- */

/* crée un observateur de la page Image verticale  */
let options = {
  root: null,
  rootMargin: "0% 0% -95% -95%",
  threshold: 0,
};

aff_an.textContent = list_img[0].dataset.an;
const affiche_date = (entries) => {
  entries.forEach((ent) => {
    if (ent.isIntersecting) aff_an.textContent = ent.target.dataset.an;
  });
};
const guette = new IntersectionObserver(affiche_date, options);
list_img.forEach((img) => guette.observe(img));

/* Boucle entre .image et Image_mod pour afficher les images */
list_img.forEach((img) => img.addEventListener("click", (e) => zoom(e)));

/* ecoute les fleches de direction et les touches Retour et F */

av_ar(fleches);
drGa(boiteImg, "ArrowLeft", "ArrowRight", "Enter", "KeyF");
