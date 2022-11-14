import { ordi_OS } from "./nav_os.js";
import { inst_vidYt } from "./videoYT.js";
/* Si l'OS est windows, supprimer les barres de defilement */
if (ordi_OS().win) {
  const drop = [...document.querySelectorAll(".dropdown")];
  drop.forEach((dr) => dr.classList.add("scrbar"));
  document.querySelector(".ecranVideos").classList.add("scrbar");
}

/* ---------fonction de retour vers haut de page------------- */
const toTop = () => ecVideos.scrollTo({ top: 0, behavior: "smooth" });

/* -------------------------------------- */

/* fonction qui renvoie 'non' ou .dia ou .vid ou "" selon chechbox video/diapo */
const typeb = (box1, box2) => {
  switch (box1.checked + box2.checked) {
    case 0:
      return "non";
    case 1:
      if (box1.checked) return box1.value;
      else return box2.value;

    case 2:
      return "";
  }
};
/* -------------------------------------- */
/* renvoie non, .dia, .vid ou "" a partir de voyages ou playlists*/
const typeVid = (el) => {
  const diapo = el.querySelector("#diapo");
  const video = el.querySelector("#video");
  const pdiapo = el.querySelector("#pdiapo");
  const pvideo = el.querySelector("#pvideo");

  if (diapo) return typeb(diapo, video);
  if (pdiapo) return typeb(pdiapo, pvideo);
  return "";
};
/* -------------------------------------- */
// calcule les dimensions des ecrans YT

// affiche ou efface et supprime le listener du bouton retour--------------------
const affEffRetour = (sens) => {
  const retour = document.querySelector(".retour");
  if (sens === "+") {
    retour.classList.add("show");
    retour.addEventListener("click", toTop);
  } else {
    retour.classList.remove("show");
    retour.removeEventListener("click", toTop);
  }
};
/* -------------------------------------- */
// afficher les liens .param est la class choisie( ex "vid asie chine")
const afficheLiens = (param) => {
  /* supprime des ecrans YT */
  ecVideos.innerHTML = "";
  /* selectionne les liens des videos dans Aside */
  const lien = [...videoBox.querySelectorAll(param)];
  //Pour chaque LI, crée un ecran ContYT qui contient le titre de la video et la video YT + br
  lien.forEach((vid) => inst_vidYt(ecVideos, vid));
  /* rajoute la fleche de retour Home  si plus d'une vidéo affichée */
  if (ecVideos.innerHTML && lien.length > 1) affEffRetour("+");

  //installe un int. obs. sur les  ".lect"
  const lect = ecVideos.querySelectorAll(".lect");
  const options = {
    root: ecVideos,
    rootMargin: "0px",
    threshold: 1,
  };
  /* si la video sort de l'ecran et s'il y etait avant (Iratio<>0) => Remplace src*/
  const ferme_videos = (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting && entry.intersectionRatio)
        entry.target.src = entry.target.src.replace(
          entry.target.src,
          entry.target.src
        );
    });
  };
  const guetteYT = new IntersectionObserver(ferme_videos, options);
  //observer tous les lecteurs ".lect"
  lect.forEach((ecr) => guetteYT.observe(ecr));
  return lien.length;
};
/* -------------------------------------- */
/*  afficher les videos au declenchement des listeners li*/
const affVideos = (e) => {
  const checkDiaVid = typeVid(
    document.querySelector(".activeMenu").parentElement
  );
  /* afficher les videos */
  const aff = afficheLiens(
    checkDiaVid + e.currentTarget.dataset.id + e.currentTarget.dataset.ville
  );
  titre.textContent = aff ? e.currentTarget.textContent : "";
};
/* Stocker "val" en local,puis aller à la page photo---------- */
const trans = (e) => {
  localStorage.setItem("data", e.currentTarget.dataset.ph);
  window.location.href = "./photos.html";
};
/* ferme les menus au listener sur ecvideos */
const dropclose = (e) => {
  if (
    (e.target === ecVideos || e.target === document.querySelector(".menu")) &&
    !ecVideos.innerHTML &&
    document.querySelector(".activeMenu")
  ) {
    /* met height du menu à zero et supprime la barre activeMenu */
    document
      .querySelector(".activeMenu")
      .parentElement.querySelector(".bloc-links").style.height = `0px`;
    document
      .querySelector(".titMenu.activeMenu")
      .classList.remove("activeMenu");
  }
};
/* -----------operations---------------------------------------------- */
/* ========cliquer sur les menus ouvre les dropdown========= */
const menus = [...document.querySelectorAll(".btn-top")];
const titre = document.querySelector(".titre");
const videoBox = document.querySelector(".liens");
const ecVideos = document.querySelector(".ecranVideos");
/* ecouter les clicks sur les menus btn-top */
let menuIndex = 0;
menus.forEach((men, index) => {
  men.addEventListener("click", () => {
    /* supprimer la barre de menu active precedente et refermer le dropmenu*/
    menus[menuIndex].querySelector(".titMenu").classList.remove("activeMenu");
    /* activer le menu choisi */
    men.querySelector(".titMenu").classList.add("activeMenu");
    const dropCour = men.querySelector(".bloc-links");
    //si on clique et que le menu est fermé ou nul" => Ouvrir
    if (dropCour.style.height === `0px` || !dropCour.style.height) {
      dropCour.style.height = dropCour.scrollHeight + "px";
      /* effacer les videos, le titre global et la fleche retour */
      ecVideos.innerHTML = "";
      titre.textContent = "";
      affEffRetour("-");
      /* lancer les ecouteurs pour chaque li et relat*/
      [...men.querySelectorAll("li")].forEach((el) =>
        el.addEventListener("click", affVideos)
      );
      [...men.querySelectorAll(".pho .relat")].forEach((el) =>
        el.addEventListener("click", trans)
      );
      /* si index= 4, la page des blogs s'affiche */
    } else dropCour.style.height = `0px`;

    /* fermer le dropbox d'avant */
    if (menuIndex !== index) {
      menus[menuIndex].querySelector(".bloc-links").style.height = `0px`;
    }
    /* si on clique deux fois sur un menu sans choisir un sous menu, enlever le soulignement */
    if (
      menuIndex === index &&
      men.querySelector(".bloc-links").style.height === `0px` &&
      !ecVideos.innerHTML
    ) {
      men.querySelector(".titMenu").classList.remove("activeMenu");
    }
    /* remettre l'index courant */
    menuIndex = index;
  });
});
/* ecouter les clicks hors le menu principal et fermer le dropmenu */
document.querySelector("body").addEventListener("click", dropclose);
