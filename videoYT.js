/**
 * calculer les dim du YT frame
 * @param {container} ecrans
 * @param {dataset} ec soit 43 soit rien
 * @returns [larg, hauteur]
 */
const dimZoom = (ecrans, ec) => {
  /* ratio de la fenetre ecrans - dimensions d l'ombre des iframes YT*/
  const wl = ecrans.clientWidth - 5;
  const wh = ecrans.clientHeight - 27;
  const ratioI = ec === "43" ? 4 / 3 : 16 / 9;
  const ratioW = wl / wh;
  /* si on compare les ratios,il faut inverser et definir d'abord la hauteur */
  return [
    ratioW > ratioI ? wh * ratioI : wl,
    ratioW > ratioI ? wh : wl / ratioI,
  ];
};

/**
 * Creation du span titre et d'une iframe YT
 * @param {container} ec_video container de defilement des frames
 * @param {liens} li (class choix des lignes, ID youtube, data-ec =43 ou rien)
 */
const inst_vidYt = (ec_video, li) => {
  const dia_vid = li.classList[0] === "dia" ? "Diapo  " : "Video  ";
  const frameYt = document.getElementById("ytFrame").content.cloneNode(true);
  const lecteur = frameYt.querySelector(".lect");
  frameYt.querySelector(
    ".vidTitre"
  ).textContent = `${dia_vid}${li.textContent}`;
  lecteur.setAttribute("width", dimZoom(ec_video, li.dataset.ec)[0]);
  lecteur.setAttribute("height", dimZoom(ec_video, li.dataset.ec)[1]);
  if (li.dataset.idyt.length !== 34) {
    lecteur.setAttribute(
      "src",
      `https://www.youtube-nocookie.com/embed/${li.dataset.idyt}?rel=0&amp;modestbranding=1`
    );
  } else {
    lecteur.setAttribute(
      "src",
      `https://www.youtube-nocookie.com/embed/videoseries?list=${li.dataset.idyt}&amp;rel=0&amp;modestbranding=1`
    );
  }
  ec_video.append(frameYt);
};
export { inst_vidYt };
