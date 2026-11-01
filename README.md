# Crockies — cookies artisanaux

Site vitrine et boutique de demande de commande pour Crockies, mini-entreprise fribourgeoise créée dans le cadre du Company Programme de Young Enterprise Switzerland.

## Fonctionnement

- Site responsive en français, avec recettes, coffrets, présentation de Crockies et coordonnées.
- Le panier est conservé uniquement dans le navigateur, avec `localStorage`.
- Préparer une demande ouvre un brouillon adressé à `contact.crockies@gmail.com`. Le visiteur doit l'envoyer depuis son application e-mail.
- Il n'y a ni paiement en ligne, ni envoi de commande au serveur, ni confirmation automatique. Une commande n'est pas ferme avant une réponse de Crockies.

## Informations à confirmer avant publication

- Prix et disponibilité des cookies et coffrets.
- Horaires et éventuelle possibilité de retrait sur place.
- Numéro de téléphone, si Crockies souhaite en afficher un.
- Adresse publique du site, pour finaliser l'URL canonique et le partage social.

Les informations non confirmées ne sont pas présentées comme des faits sur le site.

## Publication sur GitHub Pages

Le dépôt contient un workflow GitHub Actions qui construit le site et le publie sur GitHub Pages. Il adapte automatiquement le chemin du site pour un dépôt de projet (`https://utilisateur.github.io/nom-du-depot/`) ou un dépôt de site utilisateur (`https://utilisateur.github.io/`).

1. Envoyez ce projet dans un dépôt GitHub et choisissez `main` ou `master` comme branche principale.
2. Dans le dépôt, ouvrez **Settings → Pages** et choisissez **GitHub Actions** comme source de publication.
3. Envoyez un commit sur la branche principale, ou lancez **Publish Crockies on GitHub Pages** depuis l'onglet **Actions**.
4. Attendez que les tâches **build** et **deploy** réussissent. GitHub affichera l'adresse publiée dans **Settings → Pages**.

Si vous utilisez un domaine personnalisé, configurez-le dans **Settings → Pages**, puis vérifiez les DNS et les informations canoniques avant d'annoncer le site.

## Vérifications locales

```sh
pnpm install --frozen-lockfile
PORT=4173 BASE_PATH=/ pnpm --filter @workspace/crockies-site run build
```

Les fichiers statiques produits sont dans `artifacts/crockies-site/dist/public`.

## Contenu et confidentialité

Les demandes sont préparées dans le navigateur et ouvertes dans le logiciel de messagerie du visiteur. Le site ne collecte pas de coordonnées sur un serveur. Le panier local peut être effacé depuis le navigateur. Les liens vers les réseaux sociaux ouvrent des services tiers.
