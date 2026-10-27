/* Crockies — formulaire de demande de commande.
   Deux modes, choisis par js/config.js :
   1. formEndpoint renseigné  -> envoi réel vers le service de formulaires configuré (fetch).
   2. formEndpoint vide       -> aucun envoi automatique : l'application e-mail du visiteur
      s'ouvre avec un message pré-rempli, et le texte reste affiché pour le copier.
   Le formulaire ne prétend jamais avoir envoyé un message qui n'est pas parti. */
(function () {
  "use strict";

  var form = document.getElementById("formulaire-commande");
  if (!form) return;

  var cfg = window.CROCKIES_CONFIG || {};
  var email = cfg.email || "contact.crockies@gmail.com";
  var endpoint = (cfg.formEndpoint || "").trim();

  var statut = document.getElementById("statut");
  var bouton = document.getElementById("envoyer");
  var modeEnvoi = document.getElementById("mode-envoi");

  if (!endpoint && modeEnvoi) {
    modeEnvoi.textContent =
      "Ce formulaire prépare un e-mail dans votre messagerie : rien n'est envoyé tant que vous ne l'avez pas validé là-bas. " +
      "Aucun paiement n'est demandé, et votre demande ne devient une vente qu'une fois confirmée par Crockies.";
  }

  function champ(id) { return document.getElementById(id); }

  function marquer(id, invalide) {
    var el = champ(id);
    var err = champ("err-" + id);
    if (el) {
      if (invalide) el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid");
    }
    if (err) err.classList.toggle("visible", invalide);
    return invalide;
  }

  function valider() {
    var nom = champ("nom").value.trim();
    var mail = champ("email").value.trim();
    var ok = champ("consentement").checked;
    var erreurs = [
      marquer("nom", nom.length < 2),
      marquer("email", !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)),
      marquer("consentement", !ok)
    ];
    var premiere = ["nom", "email", "consentement"].filter(function (_, i) { return erreurs[i]; })[0];
    if (premiere) { champ(premiere).focus(); return false; }
    return true;
  }

  function afficher(type, html) {
    statut.hidden = false;
    statut.className = "statut statut--" + type;
    statut.innerHTML = html;
    statut.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function echapper(t) {
    return t.replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function composer() {
    var q = champ("quantite").value.trim();
    var msg = champ("message").value.trim();
    var lignes = [
      "Bonjour Crockies,",
      "",
      "Je souhaite faire une demande de commande.",
      "",
      "Nom : " + champ("nom").value.trim(),
      "E-mail : " + champ("email").value.trim(),
      "Collection : " + champ("collection").value,
      "Quantité approximative : " + (q || "non précisée"),
      "Précisions : " + (msg || "aucune"),
      "",
      "Merci !"
    ];
    return lignes.join("\n");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (champ("site-web").value) return; // champ piège rempli : robot
    if (!valider()) return;

    var corps = composer();
    var objet = "Demande de commande – " + champ("collection").value;

    if (endpoint) {
      bouton.disabled = true;
      var donnees = new FormData(form);
      donnees.delete("site-web");
      donnees.append("_subject", objet);
      fetch(endpoint, { method: "POST", body: donnees, headers: { Accept: "application/json" } })
        .then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          form.reset();
          afficher("ok", "<strong>Merci, votre demande a bien été envoyée.</strong> Nous revenons vers vous par e-mail. Rien n'est débité et aucune vente n'est conclue à ce stade.");
        })
        .catch(function () {
          afficher("erreur",
            "<strong>L'envoi n'a pas abouti.</strong> Vous pouvez réessayer, ou nous écrire directement à " +
            '<a href="mailto:' + email + '">' + email + "</a>.");
        })
        .then(function () { bouton.disabled = false; });
      return;
    }

    var lien = "mailto:" + email + "?subject=" + encodeURIComponent(objet) + "&body=" + encodeURIComponent(corps);
    afficher("info",
      "<strong>Votre demande est prête, mais pas encore envoyée.</strong> Votre application e-mail devrait s'ouvrir : " +
      "validez l'envoi là-bas. Sinon, <a href=\"" + lien + '">cliquez ici</a> ou copiez ce texte dans un e-mail à ' +
      email + ' :<textarea readonly rows="9" aria-label="Texte de la demande à copier">' + echapper(corps) + "</textarea>");
    window.location.href = lien;
  });

  ["nom", "email"].forEach(function (id) {
    champ(id).addEventListener("input", function () { marquer(id, false); });
  });
  champ("consentement").addEventListener("change", function () { marquer("consentement", false); });
})();
