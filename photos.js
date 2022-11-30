import { Affimg } from "./xfonctions/affimg.js";
import { fetchJSON } from "./xfonctions/api.js";
import { createElement } from "./xfonctions/dom.js";
import { go_fullScreen, stop_fullScreen } from "./xfonctions/fullScreen.js";
import { navig, ordi_OS, mob } from "./xfonctions/nav_os.js";
/* Si l'OS est windows, supprimer les barres de defilement */
if (ordi_OS().win) document.querySelector(".image").classList.add("scrbar");
/*  prendre en charge les boites du html */
const val_trans = localStorage.getItem("data"); /* classList venant de Index */
const val = document.querySelector(".transval"); /* titre de l'ecran */
const fix_fond = document.querySelector(".envel"); /* enveloppe principale */
const boiteImg = fix_fond.querySelector(".image");
// const list_img = [...boiteImg.getElementsByClassName(`${val_trans}`)];
const full = fix_fond.querySelector(".fullscreen"); /* icone "f" en bas */
const ret_fl = document.querySelectorAll(".ret_fl"); /* icones fleches */
const fleches = fix_fond.querySelectorAll(".fleches");
const stop_prec = fix_fond.querySelector(".prec"); /*  fleche gauche*/
const stop_suiv = fix_fond.querySelector(".suiv"); /* fleche droite */
const aff_an = document.querySelector(".annee"); /* affichage annees */
const cont = document.querySelector(".box_annees"); /* pour les liens années */
const hamb = document.querySelector(".hamburger"); /* le bouton de menu droit */
const menu = document.querySelector(".menu");
const listeMenu = menu.querySelectorAll(".lien_menu");

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
  { id: "a1419", titre: "2014-2019 " },
  { id: "a1719", titre: "2017-2019 " },
  { id: "a2022", titre: "2020-2022 " },
  { id: "photo", titre: "1900-2022" },
]; /* tableau des titres des ecrans venant de Index */

//---------préparation des liens pour le timer de droite-------------
/* cherche l'ID venant de index et affecte le titre à */
const val_titre = tab_titre.find((val) => val.id === val_trans);
val.textContent = val_titre.titre;
/* afficher les images selon val_trans */
// list_img.forEach((img) => img.classList.add("show"));
/* insere un bouton pour safari + mobile dans photos.html */
if (navig().safari && ordi_OS().ios && !navig().chromeIos) {
  cont.insertAdjacentHTML(
    "beforebegin",
    `<button id="stopLiens" >
    <span class="material-symbols-outlined">cancel</span>
    </button>`
  );
}
try {
  /** va charger les menuboxes */

  const listImages = await fetchJSON("./xjson/photosImg.json");
  const listchoisie =
    val_trans !== "photo"
      ? listImages.filter((obj) => obj.class === val_trans)
      : listImages;

  const images = new Affimg(listchoisie, val_trans);
  images.creeimages(boiteImg);
  images.creedates(cont);
} catch (e) {
  const alertEl = createElement("div", {
    class: "alert alert-danger m-2",
    role: "alert",
  });
  alertEl.innerText = "impossible de charger les elements";
  document.body.prepend(alertEl);
  console.error(e);
}
const list_img = [...boiteImg.querySelectorAll(".show")];
const lien_an = [...cont.querySelectorAll(".liens")];
if (val_trans === "photo") {
  lien_an.map((dat, index) => {
    if (index % 4 !== 0) {
      dat.setAttribute("data-seuil", "----");
    }
  });
}
/* --------------------------------------------- */
/*  fonction pour placer l'image verticalement selon l'année*/
let pos = false;
const scrollImg = (e) => {
  window.scrollTo({
    top: list_img[e.currentTarget.dataset.num].offsetTop,
    behavior: "instant",
  });
  aff_an.textContent = list_img[e.currentTarget.dataset.num].dataset.an;
  pos = true;
};
const posit_annee = () => {
  lien_an.forEach((lien) => {
    lien.addEventListener("click", scrollImg);
  });
};

/* fonction qui ajoute ou enleve l'icone stop sur les fleches */
const toggleStop = (condition, el) => {
  condition ? el.classList.add("showfl") : el.classList.remove("showfl");
};
/* montre l'icone stop debut ou l'icone stop fin ou efface */
const showStop = () => {
  toggleStop(boiteImg.scrollLeft === 0, stop_prec);
  toggleStop(
    boiteImg.scrollLeft === boiteImg.scrollWidth - boiteImg.offsetWidth,
    stop_suiv
  );
};
/* deplacement relatif horiz ou vertical des images */

const dep_hor = (box, sens) => {
  box.scrollBy({
    left: list_img[0].getBoundingClientRect().width * sens,
    behavior: "instant",
  });
};
const dep_vert = (sens) => {
  window.scrollBy({
    top: list_img[0].getBoundingClientRect().height * sens,
    behavior: "instant",
  });
};

/* ---utilisation des icones fleches pour derouler les images*/

const av_ar = (image, fl) => {
  fl.forEach((el, index) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      switch (index) {
        /* retour*/
        case 0: {
          if (zoome) zoom(e);
          else {
            localStorage.clear();
            window.location = "./index.html";
          }
          break;
        }
        /* fleche gauche*/
        case 1: {
          dep_hor(image, -1);
          break;
        }
        /* fleche droite */
        case 2: {
          dep_hor(image, 1);
          // boiteImg.scrollTo({left: boiteImg.scrollLeft + boiteImg.offsetWidth,});
          break;
        }
      }
      // e.stopPropagation();
    });
  });
};
/* gestion des touches de direction, retour et "F"pour fullscreen */

const drGa = (image, touche) => {
  document.addEventListener("keydown", (e) => {
    e.preventDefault();
    /* image de droite ou image de gauche */
    switch (e.code) {
      /* aller à position gauche de l'image- largeur de l'image*/
      case touche.gauche: {
        dep_hor(image, -1);
        break;
      }
      case touche.droite: {
        dep_hor(image, 1);
        break;
      }
      case touche.haut: {
        dep_vert(-1);
        break;
      }
      case touche.bas: {
        dep_vert(1);
        break;
      }
      /* retour à Index.html ou au mur d'images*/
      case touche.retour: {
        if (zoome) zoom(e);
        else {
          localStorage.clear();
          window.location = "./index.html";
        }
        break;
      }
      /* Toggle Fullscreen */
      case touche.fullscreen: {
        go_fullScreen(document.querySelector(".envel_mod"));
        break;
      }
    }
    // e.stopPropagation();
  });
};
/* Zoom quand on clicke sur une image en changeant les classes */
let zoome = false;
let yimg = 0;
const alert = () => full.classList.remove("show_grid");
/* quand on arrive sur l'ecran Photo, */
const zoom = (e) => {
  zoome = zoome === true ? false : true;
  /* revenir en mode normal si on est en fullscreen +retour images */
  stop_fullScreen();
  clearTimeout(alert);
  alert; /* supprime le "f" si 'lon revient dans la galerie d'image immediatement*/
  /* montrer les flèches */
  fleches.forEach((fl) => fl.classList.toggle("show_grid"));
  /* capter la hauteur de l'image dans le viewport  avant de cliquer*/
  if (zoome) yimg = e.currentTarget.getBoundingClientRect().top;
  /* ramener toutes les images en plein ecran et defilement horizontal */
  boiteImg.classList.toggle("image_mod");
  fix_fond.classList.toggle("envel_mod");
  /* invisibiliser l'icone hamb et fermer le menu de gauche  et la timeline*/
  hamb.classList.toggle("invis");
  cont.classList.toggle("hide");
  full.classList.toggle("show_grid");
  /* ------ gestion du cas ou l'ecran est en class "".image_mod" */
  if (zoome) {
    /* aller sur l'image sur laquelle on a cliqué */
    boiteImg.scrollTo({ left: e.target.offsetLeft });
    hamb.classList.remove("open");
    menu.classList.remove("open");
    /* montrer la fleche f pour fullscreen , puis effacer en 5s*/
    full.classList.add("show_grid");
    setTimeout(alert, 4000);
    /* rajouter le stop au debut et la la fin des images au depart, puis au scroll */
    showStop();
  } else {
    window.scrollTo({
      top: e.target.offsetTop - yimg,
      behavior: "instant",
    });
  }
};
/* afficher les années dans box-années et dans le titre année */

const affiche_date = (entries) => {
  entries.forEach((ent) => {
    if (ent.isIntersecting) {
      {
        cont
          .querySelector(`[data-num = "${ent.target.dataset.num}"]`)
          .classList.add("show-an");
        aff_an.textContent = ent.target.dataset.an;
      }
    } else {
      cont
        .querySelector(`[data-num = "${ent.target.dataset.num}"]`)
        .classList.remove("show-an");
    }
  });
};

/* -----------programme------------------------------- */
aff_an.textContent = list_img[0].dataset.an;
/* un observer pour afficher les dates dans la timeline verticale */
let options = {
  root: null,
  rootMargin: "0% 0% -100% -98%",
  threshold: 0,
};
const guette = new IntersectionObserver(affiche_date, options);
list_img.forEach((img) => guette.observe(img));

/* affichage de la colonne timer au scroll */
let lastscroll = 0;
const fin = boiteImg.clientHeight - document.documentElement.clientHeight - 10;
window.addEventListener("scroll", (e) => {
  if (pos) {
    pos = false;
    return;
  }
  const currentscroll = window.pageYOffset;
  if (lastscroll - currentscroll > 1 || lastscroll - currentscroll < -1) {
    cont.classList.add("show_box_annees");
    /* quand le curseur est tout en haut ou en bas*/
    if (currentscroll === 0 || currentscroll >= fin)
      cont.classList.remove("show_box_annees");
  } else {
    cont.classList.remove("show_box_annees");
  }
  lastscroll = currentscroll;
});
/* positionner à l'année choisie sur le coté droit */
posit_annee();
/* ecouter le hamburger de menu */
hamb.addEventListener("click", (e) => {
  hamb.classList.toggle("open");
  menu.classList.toggle("open");
});
/* ecouter le menu principal de gauche */
menu.querySelector(`[data-idmenu="${val_trans}"`).classList.add("active");
listeMenu.forEach((li) => {
  li.addEventListener("click", (e) => {
    localStorage.setItem("data", e.target.dataset.idmenu);
    window.location.href = "./photos.html";
  });
});
/* cliquer sur les images pour les zoomer en horizontal */
list_img.forEach((img) => img.addEventListener("click", zoom));
/* ecoute les fleches de direction et les touches Retour et F */
av_ar(boiteImg, ret_fl);
const touche = {
  gauche: "ArrowLeft",
  droite: "ArrowRight",
  haut: "ArrowUp",
  bas: "ArrowDown",
  retour: "Enter",
  fullscreen: "KeyF",
};
drGa(boiteImg, touche);
/* afficher les icones de stop en fin ou debut de image_mod */
boiteImg.addEventListener("scroll", showStop);
