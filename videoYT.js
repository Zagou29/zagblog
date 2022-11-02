/* calcule les dimensions des ecrans */
const dimZoom = (ecrans, ec) => {
  /* ratio de la fenetre ecrans - dimensions d l'ombre des iframes YT*/
  const reduct = 0.98;
  const wl = (ecrans.clientWidth - 5) * reduct;
  const wh = (ecrans.clientHeight - 20) * reduct;
  const ratioI = ec === "43" ? 4 / 3 : 16 / 9;
  const ratioW = wl / wh;
  /* si on compare les ratios,il faut inverser et definir d'abord la hauteur */
  const width = ratioW > ratioI ? wh * ratioI : wl;
  const height = ratioW > ratioI ? wh : wl / ratioI;
  return [width, height];
};
/* ec_video est la boite, li sont les liens avec data-idyt, data-ec */
const inst_vidYt = (ec_video,li) => {
  const dia_vid =
    li.classList[0] === "dia" || li.classList[0] === "diaf"
      ? "Diapo  "
      : "Video  ";
  /* avant et après selon la longueur de l'IDYT */
  const avant = li.dataset.idyt.length === 34 ? "videoseries?list=" : "";
  const apres = li.dataset.idyt.length === 34 ? "&amp;" : "?";
  ec_video.insertAdjacentHTML(
    "beforeend",
    `<div class="contYT">
      <span class="vidTitre" >${dia_vid}${li.textContent} </span>
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
      </iframe>
      </br>
      </div>`
  );
};
export {inst_vidYt};
