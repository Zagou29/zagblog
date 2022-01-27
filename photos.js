/*  recuperer la valeur venant de index */
const val_trans = localStorage.getItem("data");
const val = document.querySelector(".transval");
const list_img = document.querySelectorAll(`.${val_trans}`);
const tab_titre = [
  { id: "avion", titre: "Avions 14-18" },
  { id: "guerre", titre: "Guerre 14-18" },
  { id: "fam17", titre: "Famille de 1917 à 1920" },
];
const val_titre = tab_titre.find((val) => val.id === val_trans);
localStorage.removeItem("data");
val.textContent = val_titre.titre;

list_img.forEach((list) => {
  list.classList.add("show");
});

/* -------------------------------- */
const fleches = document.querySelectorAll(".fleches");
const full = document.querySelector(".fullscreen");
const fix_fond = document.querySelector(".envel");
const boiteImg = document.querySelector(".image");
const stop_prec = document.querySelector(".prec");
const stop_suiv = document.querySelector(".suiv");
/* --------------------------------------------- */
/* Zoom quand on clicke sur une image en changeant les classes */
let zoome = false;
const zoom = (e) => {
  zoome = zoome === true ? false : true;
  /* revenir en mode normal si on est en fullscreen +retour iamges */
  stop_fullScreen();
  /* passer les bandeaux entete, menu et footer en dessous */
  fleches.forEach((fl) => fl.classList.toggle("show_grid"));
  /* montrer les fleche f pour fullscreen */
  const alert = () => full.classList.remove("show_grid");
  if (zoome) {
    full.classList.add("show_grid");
    setTimeout(alert, 5000);
  }

  /* ramener toutes les images en plein ecran et definelemnt horizontal */
  boiteImg.classList.toggle("image_mod");
  fix_fond.classList.toggle("envel_mod");
  /* pointer sur l'image sur laquelle on a cliqué */
  boiteImg.scrollTo({
    left: e.target.x,
  });
  /* rajouter le stop au debut et la la fin des images */
  boiteImg.addEventListener("scroll", () => {
    if (boiteImg.scrollLeft === 0) stop_prec.classList.add("show");
    else {
      stop_prec.classList.remove("show");
    }
    if (boiteImg.scrollLeft === boiteImg.scrollWidth - boiteImg.offsetWidth)
      stop_suiv.classList.add("show");
    else {
      stop_suiv.classList.remove("show");
    }
  });
};

/* --------------------------------------------- */
/* cliquer sur av et ar pour passer d'une image a une autre à la souris*/
const av_ar = () => {
  fleches.forEach((el) => {
    el.addEventListener("click", (e) => {
      if (el === fleches[0]) {
        /* aller à position gauche de l'image- largeur de l'image*/
        boiteImg.scrollTo({
          left: boiteImg.scrollLeft - boiteImg.offsetWidth,
        });
      } else {
        boiteImg.scrollTo({
          left: boiteImg.scrollLeft + boiteImg.offsetWidth,
        });
      }
      e.stopPropagation();
    });
  });
};

/* ------------------------------------------ */
const go_fullScreen = (elem) => {
  let not_fs =
    !document.fullscreenElement &&
    !document.mozFullScreen &&
    !document.webkitIsFullScreen &&
    !document.msFullscreenElement;
  if (not_fs) {
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
  } else stop_fullScreen();
};

const stop_fullScreen = () => {
  let fs =
    document.fullscreenElement ||
    document.mozFullScreen ||
    document.webkitIsFullScreen ||
    document.msFullscreenElement;
  if (fs) {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
  }
};

const fulls = () => {
  document.addEventListener("keydown", (e) => {
    if (e.key === "f") go_fullScreen(fix_fond);
    e.stopPropagation;
  });
};

/* ------------------------------------------ */
/*  quand on clique sur une image, zoomer , utiliser les fleches et fullscreen*/

list_img.forEach((img) => {
  img.addEventListener("click", (e) => {
    zoom(e);
  });
});
av_ar();
fulls();
