/* Réglages modifiables sans toucher au reste du code.
   - formEndpoint : adresse d'un service d'envoi de formulaires (ex. Formspree, Web3Forms).
     Laisser vide tant que le service n'est pas créé : le formulaire ouvrira alors
     l'application e-mail du visiteur avec un message pré-rempli (aucun envoi automatique).
   - email : adresse qui reçoit les demandes. */
window.CROCKIES_CONFIG = {
  email: "contact.crockies@gmail.com",
  formEndpoint: ""
};
