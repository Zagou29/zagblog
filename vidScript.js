/* ---------fonction de retour vers haut de page------------- */
const toTop = () => ecVideos.scrollTo({ top: 0, behavior: "smooth" });
/* ------------------- */
// const eff = document.querySelector("#efface")
//   const titre = document.querySelector(".titre");

/* ------------------------- */
const typeVid = (el) => {
  /* chercher si Diapos et/ou Videos sont covchés dans voyages */
  const diapo = el.querySelector("#diapo");
  const video = el.querySelector("#video");
  let type;
  if (diapo && video) {
    /* si oui créer la future classe .vid ou .dia ou "" pour isoler diapos ou videos */
    if (video.checked) {
      type = ".vid";
      if (diapo.checked) {
        type = "";
      }
    } else {
      if (diapo.checked) {
        type = ".dia";
      } else {
        type = "non";
      }
    }
    return type;
  }
  type = "";

  return type;
};
/* Dans une liste de liens, on clique sur un lien, on referme le dropdown, on efface les videos précédentes et on affiche les nouvelles */
const litElements = (listEl, blocLink) => {
  listEl.forEach((el) => {
    el.addEventListener("click", () => {
      /* supprime des ecrans YT */
      ecVideos.innerHTML = "";
      /* prépare les classes à chercher à partir des dataset des menus */
      //aff affiche les videos YT et renvoie le nombre de videos
      const aff = afficheLiens(
        typeVid(blocLink) + el.dataset.id + el.dataset.ville
      );
      titre.innerHTML = "";
      if (aff) {
        titre.innerHTML = el.innerHTML;
      }
    });
  });
};
/* ===dimensions frames: compare le ratio aux dim de la fenetre et affiche en fonction du ratio 43 ou 169 des videos YT, indiqué via le dataset ec (passé via rat)*/

const reduct = 1;
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

// ====== lister les liens de 'video' dont la classe correspond au menu choisi
// ====== créer les boites et Iframe YT de l'ID du lien video et rajouter le dataset ecran du lien
const afficheLiens = (param) => {
  const lien = document.querySelectorAll(param);

  lien.forEach((vid) => {
    ecVideos.insertAdjacentHTML(
      "beforeend",
      ` <span class="vidTitre" >${vid.innerText} </span>
      <div class="ecranYT" data-ec ="${vid.dataset.ec}">
      <iframe
      class="lect"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen=""
      sandbox="allow-forms allow-scripts allow-pointer-lock allow-same-origin allow-top-navigation"
      src="https://www.youtube-nocookie.com/embed/${vid.dataset.id}?rel=0&amp;modestbranding=1">
      </iframe>
      </div>
      </br>`
    );
  });
  /* rajoute l'icone de retour Home en fin de page videos si plus d'une affichée */
  if (ecVideos.innerHTML && lien.length > 1) {
    ecVideos.insertAdjacentHTML(
      "beforeend",
      `<button onclick="toTop()" class="retour"><img
            src="./images/retour.png"
            alt="back to top"
          /></button>`
    );
  }
  // calcul et fournit les dimensions de tous les ecrans en fonction des dataset.ec
  const ecrans = ecVideos.querySelectorAll(".ecranYT");
  ecrans.forEach((ecr) => {
    dimZoom(ecr);
  });
  return lien.length;
};

/* ========cliquer sur les menus ouvre les dropdown========= */
// menus co
const ecVideos = document.querySelector(".ecranVideos");
const menus = document.querySelectorAll(".btn-top");
const titre = document.querySelector(".titre");
const eff = document.querySelector("#efface");
const blocs = document.querySelectorAll(".bloc-links");
/* supprimer les iframes YT et le titre */
eff.addEventListener("click", () => {
  ecVideos.innerHTML = "";
  titre.innerHTML = "";
});
/* tous les sous menu invisibles => hauteur O */
blocs.forEach((bl) => (bl.style.height = `0px`));
/* ecouter les clicks sur les menus btn-top */
menus.forEach((men) => {
  men.addEventListener("click", () => {
    /* on est dans un des menus princ */
    const dropCour = men.querySelector(".bloc-links");
    const liItems = dropCour.querySelectorAll("li");
    const spane = dropCour.querySelectorAll("span");
    //si on clique et que le menu est ferm" => Ouvrir
    if (dropCour.style.height === `0px`) {
      dropCour.style.height = dropCour.scrollHeight + "px";
    } else dropCour.style.height = `0px`;
    // aller cliquer sur les liens LI ou les spans, puis afficher les videos
    litElements(liItems, dropCour);
    litElements(spane, dropCour);
    /* effacer les menus dejà affichés hors dropCour */
    document.querySelectorAll(".bloc-links").forEach((links) => {
      if (links !== dropCour) {
        links.style.height = `0px`;  
      }
     
    });
    /* effacer les menus si on clique sur le fonc hors menus */
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
