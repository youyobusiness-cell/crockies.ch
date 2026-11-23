# Crockies

Site vitrine responsive de Crockies, mini-entreprise fribourgeoise créée dans le cadre du Company Programme de Young Enterprise Switzerland. Le projet utilise Vite, React, TypeScript et Tailwind CSS.

## Prérequis

- Node.js 20 ou plus récent
- npm

## Installation et démarrage local

Depuis le dossier du projet :

```sh
npm ci --legacy-peer-deps
npm run dev
```

Le site est disponible à l’adresse locale indiquée par Vite (par défaut `http://localhost:5173`). Pour construire et prévisualiser la version de production :

```sh
npm run build
npm run serve
```

Le site généré se trouve dans `dist/public`.

## Commandes utiles

- `npm run dev` : démarrer le serveur local.
- `npm run build` : construire le site pour la production.
- `npm run serve` : prévisualiser le dernier build.
- `npm run typecheck` : vérifier les types TypeScript.

Le chemin de base est `/` par défaut. Le workflow GitHub Pages fournit son propre `BASE_PATH` pour publier le site sous le nom du dépôt.

## Publication sur GitHub Pages

Le workflow `.github/workflows/deploy.yml` construit et publie le site à chaque envoi sur la branche `main`.

1. Importez le contenu de ce dossier dans un dépôt GitHub dont le nom correspond au chemin `BASE_PATH` configuré dans le workflow.
2. Dans le dépôt, ouvrez **Settings → Pages** et sélectionnez **GitHub Actions** comme source.
3. Envoyez un commit sur `main`, ou lancez le workflow depuis l’onglet **Actions**.
4. Attendez la réussite des étapes de construction et de publication. L’adresse du site apparaît dans **Settings → Pages**.

Si le dépôt change de nom, vérifiez le `BASE_PATH` dans le workflow avant la publication.

## Panier et commandes

Le panier est conservé dans le navigateur avec `localStorage`. Par défaut, le bouton de demande ouvre un brouillon d’e-mail à `contact.crockies@gmail.com`. Le visiteur doit envoyer le message lui-même. Le site ne confirme ni ne réserve de commande automatiquement.

Les pages légales sont servies depuis `public/legal/` et liées dans la colonne « Légal » du pied de page.

## Préparation Stripe

Le checkout Stripe n’est pas activé. Le parcours e-mail reste utilisé tant que `VITE_STRIPE_ENABLED` n’est pas défini à `true`. Le point d’entrée préparé appelle `/api/checkout/session`, mais cette API serveur doit encore être développée et déployée avant tout paiement.

Les variables de navigateur sont documentées dans `.env.example`. Pour un développement local, créez `.env.local` à partir de ce fichier. Les secrets Stripe (`sk_...` et `whsec_...`) doivent uniquement être configurés dans l’environnement du serveur et ne doivent jamais être ajoutés au dépôt ni à une variable `VITE_`.

## Sécurité des fichiers locaux

`.gitignore` exclut les dépendances installées, les fichiers générés et les fichiers `.env` locaux. Seul `.env.example` est destiné au dépôt; il ne contient aucune clé réelle.
