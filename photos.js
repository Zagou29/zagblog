import { go_fullScreen, stop_fullScreen } from "./fullScreen.js";
import { navig, ordi_OS, mob } from "./nav_os.js";
/* Si l'OS est windows, supprimer les barres de defilement */
if (ordi_OS().win) {
  document.querySelector(".image").classList.add("scrbar");
}
console.log(ordi_OS(), !navig().chrome, mob());

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
const ret_fl = document.querySelectorAll(".ret_fl"); /* icones fleches */
const fleches = fix_fond.querySelectorAll(".fleches");
const stop_prec = fix_fond.querySelector(".prec"); /*  fleche gauche*/
const stop_suiv = fix_fond.querySelector(".suiv"); /* fleche droite */
const aff_an = document.querySelector(".annee"); /* affichage annees */
const cont = document.querySelector(".container"); /* pour les liens années */
const p_bar = cont.querySelector(".progress_bar");
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
val.textContent = val_titre.titre;
/* afficher les images selon val_trans */
list_img.forEach((img) => img.classList.add("show"));
/*  crée un lien pour chaque image*/
const crée_liens = (li) => {
  cont.insertAdjacentHTML(
    "beforeend",
    `<li class= "liens" data-num=${li.dataset.num} data-seuil="${li.dataset.seuil}">${li.dataset.an}</li>`
  );
};
/* insere un bouton pour safari + mobile dans photos.html */
if (navig().safari && mob().mob && !navig().chrome) {
  cont.insertAdjacentHTML(
    "beforebegin",
    `<button id="stopLiens" >
    <span class="material-symbols-outlined">cancel</span>
</button>`
  );
}

/* liste des images taguées avec les dates dans data-an,n° du lien et seuil*/
list_img.forEach((dat, index) => {
  dat.setAttribute("data-num", index + 1);
  if (!dat.getAttribute("data-an")) {
    dat.setAttribute("data-an", list_img[index - 1].getAttribute("data-an"));
    dat.setAttribute("data-seuil", "----");
  } else {
    dat.setAttribute("data-seuil", dat.getAttribute("data-an"));
  }
  crée_liens(dat);
});
const lien_an = cont.querySelectorAll(".liens");
/* --------------------------------------------- */
/*  fonction pour placer l'image verticalement selon l'année*/
const posit_annee = () => {
  lien_an.forEach((lien) => {
    lien.addEventListener("click", (e) => {
      if (!zoome) {
        window.scrollTo({
          top: list_img[e.target.dataset.num - 1].offsetTop,
          behavior: "smooth",
        });
      }
    });
  });
};
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
        /* fleches*/
        case 0: {
          if (zoome) zoom(e);
          else window.location = "./index.html";
          break;
        }
        /* aller à position gauche de l'image- largeur de l'image*/
        case 1: {
          boiteImg.scrollTo({
            left: boiteImg.scrollLeft - boiteImg.offsetWidth,
          });
          break;
        }
        case 2: {
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
  document.addEventListener("keydown", (e) => {
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
  });
};
/* Zoom quand on clicke sur une image en changeant les classes */
let zoome = false;
const alert = () => full.classList.remove("show_grid");
/* quand on arrive sur l'ecran Photo, */
const zoom = (e) => {
  zoome = zoome === true ? false : true;
  /* revenir en mode normal si on est en fullscreen +retour images */
  stop_fullScreen();
  /* montrer les flèches */
  fleches.forEach((fl) => fl.classList.toggle("show_grid"));
  /* ramener toutes les images en plein ecran et defilement horizontal */
  boiteImg.classList.toggle("image_mod");
  /* ------ gestion du cas ou l'ecran est en class "".image_mod" */
  if (zoome) {
    /* aller sur l'image sur laquelle on a cliqué */
    boiteImg.scrollTo({ left: e.target.offsetLeft });
    /* montrer la fleche f pour fullscreen , puis effacer en 5s*/
    full.classList.add("show_grid");
    setTimeout(alert, 5000);
    /* rajouter le stop au debut et la la fin des images au depart, puis au scroll */
    showStop();
    boiteImg.addEventListener("scroll", () => showStop());
    /* met à jour l'année */
    aff_an.textContent = e.target.getAttribute("data-an");
  }
};

/* -----------programme------------------------------- */

/* crée un observateur de la page Image verticale  */
let options = {
  root: null,
  rootMargin: "0% 0% -95% -95%",
  threshold: 0,
};
/* affiche la date de debut, puis fonction qui affiche la date dans le titre gauche et avance l'indicateur de position */
aff_an.textContent = list_img[0].dataset.an;
const affiche_date = (entries) => {
  entries.forEach((ent) => {
    if (ent.isIntersecting) {
      aff_an.textContent = ent.target.dataset.an;
      p_bar.style.transform = `scaleY(${
        ent.target.offsetTop / boiteImg.clientHeight
      })`;
    }
  });
};
const guette = new IntersectionObserver(affiche_date, options);
list_img.forEach((img) => guette.observe(img));

/* Boucle entre .image et Image_mod pour afficher les images */
list_img.forEach((img) => img.addEventListener("click", (e) => zoom(e)));

/* ecoute les fleches de direction et les touches Retour et F */
av_ar(ret_fl);
drGa(boiteImg, "ArrowLeft", "ArrowRight", "Enter", "KeyF");
/* positionner à l'année choisie sur le coté droit */
posit_annee();
