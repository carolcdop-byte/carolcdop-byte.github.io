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
      el.setAttribute(el.tagName === "IFRAME" ? "title" : "alt", el.getAttribute("data-alt-" + lang));
    });
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
    if (LINKEDIN_URL) { a.href = LINKEDIN_URL; a.hidden = false; } else { a.hidden = true; }
  });
  document.querySelectorAll("[data-linkedin-pendiente]").forEach(function (p) { p.hidden = !!LINKEDIN_URL; });

  // Vídeos de YouTube (youtube-nocookie, solo si hay enlace)
  function idYoutube(url) {
    var m = String(url).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : (/^[A-Za-z0-9_-]{11}$/.test(url) ? url : null);
  }
  document.querySelectorAll("[data-video]").forEach(function (caja) {
    var id = idYoutube(VIDEOS[caja.getAttribute("data-video")] || "");
    if (!id) { caja.hidden = true; return; }
    var f = document.createElement("iframe");
    f.src = "https://www.youtube-nocookie.com/embed/" + id;
    f.loading = "lazy";
    f.allow = "accelerometer; encrypted-media; picture-in-picture";
    f.allowFullscreen = true;
    f.setAttribute("data-alt-es", "Vídeo de la " + caja.getAttribute("data-titulo-es"));
    f.setAttribute("data-alt-en", "Video: " + caja.getAttribute("data-titulo-en"));
    caja.appendChild(f);
    caja.hidden = false;
  });

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
