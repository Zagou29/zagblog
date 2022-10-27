import { navig, ordi_OS } from "./nav_os.js";
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
const reduct = 0.98;
const dimZoom = (el) => {
  let ratioI = 16 / 9;
  /* si ratio 43 dans la liste passer à 4/3*/
  if (el.dataset.ec === "43") ratioI = 4 / 3;
  /* ratio de la fenetre ecvideos - dimensions d l'ombre des iframes YT*/
  const wl = ecVideos.clientWidth - 5;
  const wh = ecVideos.clientHeight - 20;
  const ratioW = wl / wh;
  /* si on compare les ratios,il faut inverser et definir d'abord la hauteur */
  el.style.width = wl * reduct + "px";
  el.style.height = (wl * reduct) / ratioI + "px";
  if (ratioW > ratioI) {
    el.style.width = wh * reduct * ratioI + "px";
    el.style.height = wh * reduct + "px";
  }
};
// affiche ou efface le bouton retour--------------------
const affEffRetour = (sens) => {
  const retour = document.querySelector(".retour");
  if (sens === "+") {
    retour.classList.add("show");
    retour.addEventListener("click", toTop);
  }
  if (sens === "-") {
    retour.classList.remove("show");
    retour.removeEventListener("click", toTop);
  }
};
/* -------------------------------------- */
// affiche les videos YT et les gere via instersectionObserver
const afficheLiens = (param, vid_ou_pll) => {
  /* supprime des ecrans YT */
  ecVideos.innerHTML = "";

  /* selectionne les liens des videos dans Aside */
  const lien = [...document.querySelectorAll(param)];
  let avant = "";
  let apres = "?";
  if (vid_ou_pll === "play") {
    avant = "videoseries?list=";
    apres = "&amp;";
  }

  //Pour chaque LI, crée un ecran ContYT qui contient le titre de la video et la video YT + br
  lien.forEach((vid) => {
    let typVid = "Video  ";
    if (vid.classList[0] === "dia") {
      typVid = "Diapo  ";
    }
    ecVideos.insertAdjacentHTML(
      "beforeend",
      `<div class="contYT">
      <span class="vidTitre" >${typVid}${vid.innerText} </span>
      <div class="ecranYT" data-ec ="${vid.dataset.ec}">
      <iframe
      class="lect"
      loading="lazy"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen=""
      sandbox="allow-forms allow-scripts allow-pointer-lock allow-same-origin allow-top-navigation"
      src="https://www.youtube-nocookie.com/embed/${avant}${vid.dataset.id}${apres}rel=0&amp;modestbranding=1">
      </iframe>
      </div>
      </br>
      </div>`
    );
  });
  /* rajoute la fleche de retour Home  si plus d'une vidéo affichée */
  if (ecVideos.innerHTML && lien.length > 1) {
    affEffRetour("+");
  }
  //calcule les dimensions de chaque ecran YT et hec= mini des hauteurs des iframes
  ecVideos.querySelectorAll(".ecranYT").forEach((ecr) => dimZoom(ecr));
  const lect = ecVideos.querySelectorAll(".lect");

  //installe un intersection observer sur les Lecteurs ".lect"
  //qui remplace le SRC par lui même quand il sort du cadre ecVideos
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
  /* pas d'observer si safari */
  if (!navig().safari) {
    const guetteYT = new IntersectionObserver(ferme_videos, options);
    //observer tous les lecteurs ".lect"
    lect.forEach((ecr) => guetteYT.observe(ecr));
  }
  return lien.length;
};
/* -------------------------------------- */
/* Stocker "val" en local,puis aller à la page photo---------- */
const trans = (e) => {
  // e.stopPropagation();
  localStorage.setItem("data", e.currentTarget.dataset.ph);
  window.location.href = "./photos.html";
};

const affVideos = (e) => {
  /* e.stopPropagation();ne pas mettre :click active li + ferme le menu princ */
  /* supprimer les ecrans YT */
  ecVideos.innerHTML = "";
  // if (e.currentTarget.dataset.id + e.currentTarget.dataset.ville) {
  const checkDiaVid = typeVid(
    document.querySelector(".activeMenu").parentElement
  );
  /* afficher les videos */
  const aff = afficheLiens(
    checkDiaVid + e.currentTarget.dataset.id + e.currentTarget.dataset.ville,
    e.currentTarget.dataset.yt
  );
  titre.innerHTML = "";
  if (aff) {
    titre.innerHTML = titre.innerHTML = e.currentTarget.innerHTML;
  }
  // }
};
const dropclose = (e) => {
  if (
    (e.target === ecVideos ||
      e.target === titre ||
      e.target === document.querySelector(".menu")) &&
    !ecVideos.innerHTML
  ) {
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
const ecVideos = document.querySelector(".ecranVideos");
const menus = [...document.querySelectorAll(".btn-top")];
const titre = document.querySelector(".titre");
/* enlever Scroll-snap pour Firefox */
// if(navig().firefox > 0) {ecVideos.setAttribute("style", "scroll-snap-type: none")}
/* ecouter les clicks sur les menus btn-top */
let menuIndex = 0;
menus.forEach((men, index) => {
  men.addEventListener("click", () => {
    /* supprimer les écouteurs */
    ecVideos.removeEventListener("click", dropclose);
    /* stopper la suppression des ecouteurs de li */
    /* [...menus[menuIndex].querySelectorAll("li")].forEach((el) => {
      el.removeEventListener("click", affVideos);
    }); */
    /* [...menus[menuIndex].querySelectorAll(".pho .relat")].forEach((el) => {
      el.removeEventListener("click", trans);
    }); */

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
      titre.innerHTML = "";
      affEffRetour("-");
      /* lancer les ecouteurs */
      if (index < 3) {
        [...men.querySelectorAll("li")].forEach((el) => {
          el.addEventListener("click", affVideos);
          console.log(el);
        });
      }
      if (index === 3) {
        [...men.querySelectorAll(".pho .relat")].forEach((el) => {
          el.addEventListener("click", trans);
        });
      }
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
    /* effacer le dropbox et le soulignement si on clique sur le fond hors menus et si pas de video*/
    ecVideos.addEventListener("click", dropclose);
    /* remettre l'index courant */
    menuIndex = index;
  });
});
