// Lógica de la web. La configuración (LinkedIn y vídeos) está en config.js.
// ---------------------------------------------------------------------
(function () {
  var html = document.documentElement;
  var boton = document.getElementById("idioma");
  var titulos = {
    es: "Carol de Oliveira · Salesforce Functional Lead",
    en: "Carol de Oliveira · Salesforce Functional Lead"
  };

  function aplicar(lang) {
    html.lang = lang;
    document.title = titulos[lang];
    boton.textContent = lang === "es" ? "EN" : "ES";
    boton.setAttribute("aria-label", lang === "es" ? "Switch to English" : "Cambiar a español");
    document.querySelectorAll("[data-alt-es]").forEach(function (el) {
      el.setAttribute("alt", el.getAttribute("data-alt-" + lang));
    });
    pintarVideos(lang);
  }

  var inicial = null;
  try { inicial = localStorage.getItem("idioma-elegido"); } catch (e) {}
  if (inicial !== "es") inicial = "en";
  var q = location.search.match(/[?&]lang=(es|en)/);
  if (q) inicial = q[1];
  boton.addEventListener("click", function () {
    var nuevo = html.lang === "es" ? "en" : "es";
    aplicar(nuevo);
    try { localStorage.setItem("idioma-elegido", nuevo); } catch (e) {}
  });

  // LinkedIn
  document.querySelectorAll("[data-linkedin]").forEach(function (a) {
    if (LINKEDIN_URL) a.href = LINKEDIN_URL; // si está vacío, queda el enlace escrito en el HTML
  });

  // Vídeos de YouTube: uno por idioma. Hasta que se pulsa solo hay un botón propio,
  // así que la página no pide nada a YouTube (tampoco la miniatura).
  function idYoutube(url) {
    var m = String(url).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : (/^[A-Za-z0-9_-]{11}$/.test(url) ? url : null);
  }
  function texto(etiqueta, clase, contenido) {
    var el = document.createElement(etiqueta);
    el.className = clase;
    el.textContent = contenido;
    return el;
  }
  function pintarVideos(lang) {
    document.querySelectorAll("[data-video]").forEach(function (caja) {
      var id = idYoutube((VIDEOS[caja.getAttribute("data-video")] || {})[lang] || "");
      caja.textContent = ""; // al cambiar de idioma se quita el reproductor del otro
      caja.hidden = !id;
      if (!id) return;
      var titulo = caja.getAttribute("data-titulo-" + lang);
      var b = document.createElement("button");
      b.type = "button";
      b.className = "video-boton";
      var icono = texto("span", "video-play", "");
      icono.setAttribute("aria-hidden", "true");
      b.appendChild(icono);
      b.appendChild(texto("span", "video-texto", (lang === "es" ? "Ver el vídeo · " : "Watch the video · ") + titulo));
      b.appendChild(texto("span", "video-nota", lang === "es" ? "Se carga desde YouTube al pulsar" : "Loads from YouTube when you click"));
      b.addEventListener("click", function () {
        var f = document.createElement("iframe");
        f.title = (lang === "es" ? "Vídeo de la " : "Video: ") + titulo;
        f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
        f.allowFullscreen = true;
        f.referrerPolicy = "strict-origin-when-cross-origin";
        f.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0&cc_load_policy=0&hl=" + lang;
        caja.replaceChild(f, b);
        f.focus();
      });
      caja.appendChild(b);
    });
  }

  aplicar(inicial);

  // Menú móvil
  var menu = document.getElementById("menu");
  var botonMenu = document.getElementById("boton-menu");
  botonMenu.addEventListener("click", function () {
    var abierto = menu.classList.toggle("abierto");
    botonMenu.setAttribute("aria-expanded", abierto ? "true" : "false");
  });
  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { menu.classList.remove("abierto"); botonMenu.setAttribute("aria-expanded", "false"); }
  });
})();
