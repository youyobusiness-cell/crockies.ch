# Crockies — site web

Site statique (HTML5 / CSS3 / JavaScript natif) pour Crockies, compatible GitHub Pages. Aucun build, aucun serveur.

```
/
├── index.html              Accueil : histoire, saisons, comment commander, contact
├── commander.html          Demande de commande (formulaire)
├── mentions-legales.html   Mentions légales et confidentialité
├── css/style.css           Tout le design (variables dans :root)
├── js/config.js            Réglages : e-mail, adresse du service de formulaire
├── js/script.js            Menu mobile, en-tête, apparition au défilement
├── js/commander.js         Formulaire
├── assets/images/          cookie.svg, crockies-wordmark.webp, og-image.png, apple-touch-icon.png
├── favicon.svg / favicon.ico
├── robots.txt / sitemap.xml / .nojekyll
```

## 1. Remplacer l'adresse du site (obligatoire)

L'adresse publique n'est pas encore connue. Les fichiers contiennent `https://UTILISATEUR.github.io/crockies` (canonical, Open Graph, données structurées, sitemap, robots). Une fois le dépôt créé :

```bash
grep -rl "UTILISATEUR.github.io/crockies" . | xargs sed -i 's#https://UTILISATEUR.github.io/crockies#https://VOTRE-COMPTE.github.io/VOTRE-DEPOT#g'
```

Si vous achetez un domaine, remplacez par celui-ci. Les chemins internes sont relatifs : le site fonctionne dans un sous-dossier.

## 2. Publier sur GitHub Pages

1. Créez un dépôt GitHub (public pour le plan gratuit) et envoyez-y le contenu de ce dossier à la racine.
2. Dépôt → Settings → Pages → Source : « Deploy from a branch », branche `main`, dossier `/ (root)`.
3. Attendez 1 à 2 minutes : le site est en ligne.

## 3. Le formulaire et la vente : ce qui est réel, ce qui ne l'est pas

GitHub Pages n'exécute aucun code serveur. Donc :

| Fonction | État |
|---|---|
| Formulaire sans configuration | Ouvre l'application e-mail du visiteur avec un message pré-rempli ; le texte reste affiché pour le copier. **Rien n'est envoyé automatiquement.** |
| Envoi automatique | Créez un compte sur un service de formulaires (Formspree, Web3Forms…), puis collez son adresse dans `formEndpoint` (`js/config.js`). Ajoutez-le ensuite dans `mentions-legales.html`. Offre gratuite limitée, à vérifier. |
| Paiement en ligne | **Non disponible.** Les prix ne sont pas définis. Quand ils le seront : liens de paiement (Stripe Payment Links, TWINT via un prestataire) — frais par transaction. Un panier complet nécessite un service externe. |

## 4. Informations manquantes (rien n'a été inventé)

Téléphone, horaires, points forts vérifiés, prix, recettes/saveurs, photos réelles des cookies, nom de domaine, mode de livraison/remise. Dès que vous les avez, on les ajoute (téléphone et horaires dans le contact et le pied de page ; prix et saveurs dans une section « Collections »).

## 5. Points à valider

- Le parcours « demande → confirmation par Crockies » est une proposition : à confirmer avec l'équipe.
- Les dates Halloween / Saint-Nicolas / Noël sont celles des fêtes, pas des dates de sortie.
- Les textes légaux sont une base, non vérifiée juridiquement.
- Polices : Cormorant Garamond et Jost via Google Fonts (mentionné dans la page confidentialité). Pour s'en passer, les télécharger dans `assets/fonts/` et déclarer des `@font-face`.
- L'adresse est publiée telle que fournie : confirmez qu'elle peut l'être.

## 6. Après publication

- [ ] Ouvrir chaque page depuis l'adresse GitHub Pages, sur smartphone.
- [ ] Tester le formulaire jusqu'à réception du message.
- [ ] Vérifier les 3 liens de réseaux sociaux.
- [ ] Partager le lien : l'aperçu (Open Graph) doit afficher le logo.
- [ ] Soumettre `sitemap.xml` à Google Search Console (facultatif).
