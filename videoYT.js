/* calcule les dimensions des ecrans */
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
/* ec_video est la boite, li sont les liens avec data-idyt, data-ec */
const inst_vidYt = (ec_video, li) => {
  const dia_vid =
    li.classList[0] === "dia" || li.classList[0] === "diaf"
      ? "Diapo  "
      : "Video  ";
  /* 34 est la longueur des ID PlayList */
  const avant = li.dataset.idyt.length === 34 ? "videoseries?list=" : "";
  const apres = li.dataset.idyt.length === 34 ? "&amp;" : "?";
  ec_video.insertAdjacentHTML(
    "beforeend",
    `<span class="vidTitre" >${dia_vid}${li.textContent} </span>
      <iframe
      width= "${dimZoom(ec_video, li.dataset.ec)[0]}"
      height="${dimZoom(ec_video, li.dataset.ec)[1]}"
      class="lect"
      loading="lazy"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen=""
      sandbox="allow-forms allow-scripts allow-pointer-lock allow-same-origin allow-top-navigation"
      src="https://www.youtube-nocookie.com/embed/${avant}${
      li.dataset.idyt
    }${apres}rel=0&amp;modestbranding=1">
      </iframe>`
  );
};
export { inst_vidYt };
