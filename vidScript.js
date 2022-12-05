import { ordi_OS } from "./xfonctions/nav_os.js";
import { fetchJSON } from "./xfonctions/api.js";
import { createElement } from "./xfonctions/dom.js";
import { Menubox } from "./xfonctions/menubox.js";
import { Affvid } from "./xfonctions/affvid.js";
try {
  /** va charger les menuboxes */
  const menuBoxes = await fetchJSON("./xjson/box.json");
  const boxes = new Menubox(menuBoxes);
  /**crée les boxes de Photos puis Blogs */
  boxes.apBox_Ph(document.querySelector(".ePhotos"), "ph");
  boxes.apBox_Ph(document.querySelector(".eBlogs"), "bl");
} catch (e) {
  const alertEl = createElement("div", {
    class: "alert alert-danger m-2",
    role: "alert",
  });
  alertEl.innerText = "impossible de charger les elements";
  document.body.prepend(alertEl);
  console.error(e);
}
/* Si l'OS est windows, supprimer les barres de defilement */

const drop = [...document.querySelectorAll(".dropdown")];
drop.forEach((dr) => dr.classList.add("scrbar"));
document.querySelector(".ecranVideos").classList.add("scrbar");

/**creation de la liste globale des videos */
const vidList = await fetchJSON("./xjson/indexVid.json");
const vidClass = new Affvid(vidList);

/* ---------fonction de retour vers haut de page------------- */
const toTop = () => ecVideos.scrollTo({ top: 0, behavior: "smooth" });

/* -------------------------------------- */

/* fonction qui renvoie 'non' ou .dia ou .vid ou "" selon chechbox video/diapo */
/**
 * definir la class .dia, .vid, tout, ou rien
 * @param {element} box1
 * @param {element} box2
 * @returns {string} ['non','', .dia, .vid]
 */
const typeb = (box1, box2) => {
  switch (box1.checked + box2.checked) {
    case 0:
      return "non";
    case 1:
      return box1.checked ? box1.value : box2.value;
    case 2:
      return "";
  }
};
/* -------------------------------------- */
/**
 * choix des videos ou diapos ou rien de Voy et Pll
 * @param {element} el menu Voy ou Pll
 * @returns {fn} typeb(box1;box2)
 */
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
/**
 * Affiche le bouton Retour au debut de page des iframes
 * @param {string} sens (+ affiche, - efface)
 */
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
/**
 * Affiche les Iframes YT choisis par param
 * @param {string} param class des liens videos
 * @returns {number} le nombre de iframes
 */
const afficheLiens = (param) => {
  /* supprime des ecrans YT */
  ecVideos.innerHTML = "";
  /**selectionne les videos */
  vidClass.apVideos(ecVideos, param);
  vidClass.apBar(document.querySelector(".menu"));
  /* selectionne les liens des videos dans Aside */

  /* rajoute la fleche de retour Home  si plus d'une vidéo affichée */
  const nbVideos = vidClass.retourVideo.length;
  if (ecVideos.innerHTML && nbVideos > 1) affEffRetour("+");
  /**
   * selectionne les iframes
   */
  const lect = ecVideos.querySelectorAll(".lect");
  
  const options = {
    root: ecVideos,
    rootMargin: "0px",
    threshold: 1,
  };
  /**
   * quand un iframe sort de Ecvideos,arrete la video
   * @param {*} entries
   * @return stoppe la video
   */
  const ferme_videos = (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting && entry.intersectionRatio) {
        document
          .querySelector(
            `.barBox [data-num = "${entry.target.dataset.num}"]`
          )
          .classList.remove("peint");
        entry.target.src = entry.target.src.replace(
          entry.target.src,
          entry.target.src
        );
      } else {
        if (entry.isIntersecting) {
          document
            .querySelector(
              `.barBox [data-num = "${entry.target.dataset.num}"]`
            )
            .classList.add("peint");
          }
        }
    });
  };
  const guetteYT = new IntersectionObserver(ferme_videos, options);
  //observer tous les lecteurs ".lect"
  lect.forEach((ecr) => guetteYT.observe(ecr));
  return nbVideos;
};
/* -------------------------------------- */
/*  afficher les videos au declenchement des listeners li*/
/**
 * Obtenir les class de selection des videos pour les choisir dans "videos"
 * @param {element} e li cliqué dans la liste des videos
 * @return {fn} affiche iframes  et titres des videos
 */
const affVideos = (e) => {
  /**dataset.tv dans fam pour voir la type video en 1 */
  if (!e.target.dataset.tv) e.target.dataset.tv = "";
  if (!document.querySelector(".activeMenu")) return;
  const checkDiaVid = `${e.target.dataset.tv}${typeVid(
    document.querySelector(".activeMenu").parentElement
  )}.${[...document.querySelector(".activeMenu").parentElement.classList][1]}`;
  /* afficher les videos */
  const aff = afficheLiens(
    checkDiaVid + e.target.dataset.id + e.target.dataset.ville
  );
  titre.textContent = aff ? e.target.textContent : "";
};
/**
 *
 * @param {element} e li cliqué dans les menus blogs et photos
 */
const trans = (e) => {
  if (!e.target.parentElement.parentElement.dataset.ph) return;
  localStorage.setItem("data", e.target.parentElement.parentElement.dataset.ph);
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
      document.querySelector(".menu .barBox")?.remove();
      titre.textContent = "";
      affEffRetour("-");
      /* lancer les ecouteurs pour chaque li et relat*/
      if (index < 3) {
        men.querySelector(".bloc-links").addEventListener("click", affVideos);
      }
      if (index === 3) {
        men.querySelector(".bloc-links").addEventListener("click", trans);
      }
      /* si index= 4, la page des blogs s'affiche */
    } else dropCour.style.height = `0px`;

    /* fermer le dropbox d'avant */
    if (menuIndex !== index) {
      menus[menuIndex].querySelector(".bloc-links").style.height = `0px`;
      console.log(index);
      document.querySelector(".menu .barBox")?.remove();
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
