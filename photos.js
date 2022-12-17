import { Affimg } from "./xfonctions/affimg.js";
import { fetchJSON } from "./xfonctions/api.js";
import { createElement } from "./xfonctions/dom.js";
import { Menubox } from "./xfonctions/menubox.js";
import { go_fullScreen, stop_fullScreen } from "./xfonctions/fullScreen.js";
import { navig, ordi_OS, mob } from "./xfonctions/nav_os.js";
/* Si l'OS est windows, supprimer les barres de defilement */
if (ordi_OS().win) document.querySelector(".image").classList.add("scrbar");
/*  prendre en charge les boxes de VidCript et le sens des dates */
const val_trans = localStorage.getItem("data"); /* classList venant de Index */
let sens_date = localStorage.getItem("sens_dates"); /* sens dates */
const hamb = document.querySelector(".hamburger"); /* le bouton de menu droit */
const val = document.querySelector(".transval"); /* titre de l'ecran */
const aff_an = document.querySelector(".annee"); /* affichage annees */
const fix_fond = document.querySelector(".envel"); /* enveloppe principale */
const ret_fl = document.querySelectorAll(".ret_fl"); /* icones fleches */
const cont = document.querySelector(".box_annees"); /* pour les liens années */
const menu = document.querySelector(".menu"); /** menu boxes */
const boiteImg = fix_fond.querySelector(".image");
const full = fix_fond.querySelector(".fullscreen"); /* icone "f" en bas */
const fleches = fix_fond.querySelectorAll(".fleches"); /* fleches g & d */
const right = fix_fond.querySelector(".right"); /*  fleche droite*/
const left = fix_fond.querySelector(".left"); /*  fleche gauche*/
const stop_debut = fix_fond.querySelector(".debut"); /*  stop gauche*/
const stop_fin = fix_fond.querySelector(".fin"); /* stop droit */
let tab_titre = []
//---------préparation des liens pour le timer de droite-------------
/* cherche l'ID venant de index et affecte le titre à */
/* insere un bouton pour safari + mobile dans photos.html */
if (navig().safari && ordi_OS().ios && !navig().chromeIos) {
  cont.insertAdjacentHTML(
    "beforebegin",
    `<button id="stopLiens" >
    <span class="material-icons-outlined">cancel</span>
    </button>`
    );
  }
  /** switch du sens des fleches d'inversion dates */
  if (sens_date === "1") {
    boiteImg.querySelector(".up").classList.add("eff_fl");
    boiteImg.querySelector(".down").classList.remove("eff_fl");
  } else {
    boiteImg.querySelector(".up").classList.remove("eff_fl");
    boiteImg.querySelector(".down").classList.add("eff_fl");
  }
  
  try {
    /** creation des lien_menu et du tableau des ph/spText */
    const menuBoxes = await fetchJSON("./xjson/box.json");
    const boxes = new Menubox(menuBoxes);
    boxes.apLienMenu(menu, sens_date);
    tab_titre= boxes.returnBoxes
    /** va charger les objets img */
    const listImages = await fetchJSON("./xjson/photosImg.json");
    /** fonction de tri du json entre numb et an */
    const inverser = (sens) => {
      listImages.sort((a, b) =>
      a.numb > b.numb ? sens * -1 : a.numb < b.numb ? sens * 1 : 0
      );
      listImages.sort((a, b) =>
      a.an > b.an ? sens * -1 : a.an < b.an ? sens * 1 : 0
      );
    };
    /** 1 recent vers vieux, -1 le contraire */
    inverser(Math.floor(sens_date));
    /** si pas le json total, filtrer par val_trans */
    const listchoisie =
    val_trans !== "photo"
    ? listImages.filter((obj) => obj.class === val_trans)
    : listImages;
    /** charger dans la classe, créer les liens img et les liens dates */
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
  /** titre de la page vient du tableau des titres*/
 val.textContent = tab_titre.find((val) => val.ph === val_trans).spText;
/** charger les images choisies et les liens de boxAnnées */
  const list_img = [...boiteImg.querySelectorAll(".show")];
  const lien_an = [...cont.querySelectorAll(".liens")];
  /** ne faire apparaitre qu'une date sur 4 pour "photo" */
  if (val_trans === "photo") {
    lien_an.map((dat, index) => {
      if (index % 4 !== 0) dat.setAttribute("data-seuil", "----");
    });
  }
  /* --------------------------------------------- */
  /*  fonction pour placer l'image verticalement selon l'année*/
  let pos = false;
  const scrollImg = (e) => {
  window.scrollTo({
    top: list_img[e.target.dataset.num].offsetTop,
    behavior: "instant",
  });
  aff_an.textContent = list_img[e.target.dataset.num].dataset.an;
  pos = true;
};
const posit_annee = () => {
  cont.addEventListener("click", scrollImg);
};
/* fonction qui ajoute ou enleve l'icone stop sur les fleches */
const toggleStop = (condition, el_stop, el_fl) => {
  condition
    ? el_stop.classList.add("showfl")
    : el_stop.classList.remove("showfl");
  condition ? el_fl.classList.add("eff_fl") : el_fl.classList.remove("eff_fl");
};
/* montre l'icone stop debut ou l'icone stop fin ou efface */
const showStop = () => {
  toggleStop(boiteImg.scrollLeft === 0, stop_debut, left);
  toggleStop(
    boiteImg.scrollLeft === boiteImg.scrollWidth - boiteImg.offsetWidth,
    stop_fin,
    right
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
        /** hamburger boxes dates */
        case 0: {
          hamb.classList.toggle("open");
          menu.classList.toggle("open");
          break;
        }
        /* retour*/
        case 1: {
          localStorage.clear();
          window.location = "./index.html";
          break;
        }
        /** inverser le sens des images */
        case 2: {
          localStorage.setItem("sens_dates", sens_date === "1" ? "-1" : "1");
          window.location.href = "./photos.html";
          break;
        }
        /* fleche gauche*/
        case 3: {
          dep_hor(image, -1);
          break;
        }
        /* fleche droite */
        case 4: {
          dep_hor(image, 1);
          // boiteImg.scrollTo({left: boiteImg.scrollLeft + boiteImg.offsetWidth,});
          break;
        }
      }
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
  });
};
/* Zoom quand on clicke sur une image en changeant les classes */
let zoome = false;
let yimg = 0;
const alert = () => full.classList.remove("show_grid");
/* quand on arrive sur l'ecran Photo, */
const zoom = (e) => {
  /** si on clique sur une des icones fleches, sort de cet ecouteur */
  if (e.target.matches(".bloc")) return;
  zoome = zoome === true ? false : true;
  /* revenir en mode normal si on est en fullscreen +retour images */
  stop_fullScreen();
  clearTimeout(alert);
  alert; /* supprime le "f" si 'lon revient dans la galerie d'image immediatement*/
  /* montrer les flèches */
  fleches.forEach((fl) => fl.classList.toggle("show_grid"));
  /* capter la hauteur de l'image dans le viewport  avant de cliquer*/
  if (zoome) yimg = e.target.getBoundingClientRect().top;
  /* ramener toutes les images en plein ecran et defilement horizontal */
  boiteImg.classList.toggle("image_mod");
  fix_fond.classList.toggle("envel_mod");
  /* invisibiliser l'icone hamb et fermer le menu de gauche  et la timeline*/
  hamb.classList.toggle("invis");
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
      cont
        .querySelector(`[data-num = "${ent.target.dataset.num}"]`)
        .classList.add("show-an");
      aff_an.textContent = ent.target.dataset.an;
    } else {
      cont
        .querySelector(`[data-num = "${ent.target.dataset.num}"]`)
        ?.classList.remove("show-an");
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
window.addEventListener("scroll", (e) => {
  if (pos) {
    pos = false;
    return;
  }
  const currentscroll = window.pageYOffset;
  if (lastscroll - currentscroll > 1 || lastscroll - currentscroll < -1) {
    cont.classList.add("show_box");
    /* quand le curseur est tout en haut ou en bas*/
    if (
      currentscroll === 0 ||
      currentscroll >= boiteImg.clientHeight - window.innerHeight - 10 ||
      lastscroll === 0
    )
      cont.classList.remove("show_box");
  } else {
    cont.classList.remove("show_box");
  }
  lastscroll = currentscroll;
});
/* positionner à l'année choisie sur le coté droit */
posit_annee();
/* ecouter le menu principal de gauche */
menu.querySelector(`[data-idmenu="${val_trans}"`).classList.add("active");
menu.addEventListener("click", (e) => {
  if (!e.target.dataset.idmenu) return;
  localStorage.setItem("data", e.target.dataset.idmenu);
  window.location.href = "./photos.html";
});

/* cliquer sur les images pour les zoomer en horizontal et vice versa */
boiteImg.addEventListener("click", zoom);
/** ecouter le hamburger,retour, inverser(image) doite et gauche (image_mod)*/
av_ar(boiteImg, ret_fl);
const touche = {
  gauche: "ArrowLeft",
  droite: "ArrowRight",
  haut: "ArrowUp",
  bas: "ArrowDown",
  retour: "Enter",
  fullscreen: "KeyF",
};
/* ecoute les fleches de direction et les touches Retour et F */
drGa(boiteImg, touche);
/* afficher les icones de stop en fin ou debut de image_mod */
boiteImg.addEventListener("scroll", showStop);
