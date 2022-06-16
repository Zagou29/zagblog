import { desnap } from "./desnap-firefox.js";
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
  if (sens === "-") retour.classList.remove("show");
};
/* -------------------------------------- */
// affiche les videos YT et les gere via instersectionObserver
const afficheLiens = (param, vid_ou_pll) => {
  const lien = document.querySelectorAll(param);
  console.log(lien);
  let avant = "";
  let apres = "?";
  if (vid_ou_pll === "play") {
    avant = "videoseries?list=";
    apres = "&amp;";
  }
  //supprimer l'image de retour
  affEffRetour("-");
  //Pour chaque LI, crée un ecran ContYT qui contient le titre de la video et la video YT + br
  lien.forEach((vid) => {
    let typVid = "Video  ";
    if (vid.classList[0] === "dia" || vid.classList[0] === "diaf") {
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
    threshold: [0.2],
  };
  const guetteYT = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting)
        entry.target.src = entry.target.src.replace(
          entry.target.src,
          entry.target.src
        );
    });
  }, options);
  //observer tous les lecteurs ".lect"
  lect.forEach((ecr) => guetteYT.observe(ecr));
  return lien.length;
};
/* -------------------------------------- */
/* Afficher les videos YT à partir du lien cliqué sur le menu dropdown */
const litElements = (listEl, blocLink, typyt) => {
  listEl.forEach((el) => {
    el.addEventListener("click", () => {
      /* supprime des ecrans YT */
      ecVideos.innerHTML = "";
      /* Affiche les ecrans YT a partit du type video ("", .dia, .vid ou non), des dataset  et du type YT*/
      const aff = afficheLiens(
        typeVid(blocLink) + el.dataset.id + el.dataset.ville,
        typyt
      );
      titre.innerHTML = "";
      if (aff) {
        titre.innerHTML = el.innerHTML;
      }
    });
  });
};
/* Stocker "val" en local,puis aller à la page photo---------- */
const trans_page = (val) => {
  localStorage.setItem("data", val);
  window.location.href = "./photos.html";
};
/* transfert vers la page photo */
const passpage = (list) => {
  list.forEach((el) =>
    el.addEventListener("click", () => trans_page(el.dataset.ph))
  );
};

/* -----------operations---------------------------------------------- */
/* ========cliquer sur les menus ouvre les dropdown========= */
const ecVideos = document.querySelector(".ecranVideos");
const menus = document.querySelectorAll(".btn-top");
const titre = document.querySelector(".titre");
const blocs = document.querySelectorAll(".bloc-links");
const eff = document.querySelector(".efface");
/* enlever Scroll-snap pour Firefox */
desnap(ecVideos);
/* supprimer les iframes YT ,le titre  la fleche Retour et l'icone efface */
eff.addEventListener("click", (e) => {
  ecVideos.innerHTML = "";
  titre.innerHTML = "";
  eff.classList.remove("show");
  affEffRetour("-");
});
// }
/* tous les sous menu invisibles => hauteur O */
blocs.forEach((bl) => (bl.style.height = `0px`));
/* ecouter les clicks sur les menus btn-top */
menus.forEach((men) => {
  men.addEventListener("click", () => {
    /* on est dans un des menus princ */
    const dropCour = men.querySelector(".bloc-links");
    const liItems = dropCour.querySelectorAll("li");
    const liPhotos = dropCour.querySelectorAll(".pho .relat");
    //si on clique et que le menu est ferm" => Ouvrir
    if (dropCour.style.height === `0px`) {
      dropCour.style.height = dropCour.scrollHeight + "px";
      ecVideos.innerHTML = ""
    } else dropCour.style.height = `0px`;
  
    // aller cliquer sur les liens LI ou les spans, puis afficher les videos
    litElements(liItems, dropCour, dropCour.dataset.typeyt);
    /* transferer la selection des images et passer à la page photos */
    passpage(liPhotos);
    /* si on a choisi des diapos, afficher l'icone effacer */
    if (!(ecVideos.innerText === "")) {
      eff.classList.add("show");
    }
    /* effacer les menus dejà affichés hors dropCour */
    document.querySelectorAll(".bloc-links").forEach((links) => {
      if (links !== dropCour) {
        links.style.height = `0px`;
      }
    });
    /* effacer les menus si on clique sur le fond hors menus */
    document.addEventListener("click", (e) => {
      if (
        e.target === ecVideos ||
        e.target === titre ||
        e.target === eff ||
        e.target === document.querySelector(".menu")
      ) {
        dropCour.style.height = `0px`;
      }
    });
  });
});
