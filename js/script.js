/* Crockies — comportements communs : menu mobile, ombre de l'en-tête, apparition au défilement. */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var entete = document.querySelector(".entete");
  var bouton = document.querySelector(".nav-bouton");
  var nav = document.getElementById("nav-principale");

  function fermerMenu() {
    if (!bouton || !nav) return;
    nav.classList.remove("ouvert");
    bouton.setAttribute("aria-expanded", "false");
    bouton.setAttribute("aria-label", "Ouvrir le menu");
  }

  if (bouton && nav) {
    bouton.addEventListener("click", function () {
      var ouvert = nav.classList.toggle("ouvert");
      bouton.setAttribute("aria-expanded", String(ouvert));
      bouton.setAttribute("aria-label", ouvert ? "Fermer le menu" : "Ouvrir le menu");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) fermerMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("ouvert")) {
        fermerMenu();
        bouton.focus();
      }
    });
    window.matchMedia("(min-width: 64em)").addEventListener("change", fermerMenu);
  }

  if (entete) {
    var surveiller = function () {
      entete.classList.toggle("defile", window.scrollY > 8);
    };
    surveiller();
    window.addEventListener("scroll", surveiller, { passive: true });
  }

  var elements = document.querySelectorAll(".reveler");
  if ("IntersectionObserver" in window && elements.length) {
    var obs = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    elements.forEach(function (el) { obs.observe(el); });
  } else {
    elements.forEach(function (el) { el.classList.add("visible"); });
  }

  var an = document.querySelectorAll("[data-annee]");
  an.forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
