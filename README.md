# BusinessManager — ERP & Facturation Conforme DGI pour PME

Application web SaaS de gestion commerciale, facturation électronique, suivi de trésorerie et gestion des stocks pour les entreprises et indépendants au Maroc.

## Présentation du Projet
BusinessManager est un progiciel de gestion intégrée (ERP) moderne développé spécifiquement pour le tissu entrepreneurial marocain. Il intègre un générateur interactif de factures et devis avec calcul automatique de la TVA (20%), conformité obligatoire aux mentions DGI (ICE, IF, RC, Patente), un tableau de bord des indicateurs de trésorerie, et une grille tarifaire claire avec simulateur d'abonnement.

### Fonctionnalités Clés
- **Simulateur de Facturation en Direct** : Édition interactive des lignes de prestations, modification des quantités, recalcul automatique du sous-total HT, du montant TVA et du total TTC avec mentions fiscales marocaines.
- **Tableau de Bord Financier Temps Réel** : Suivi des encaissements mensuels, factures en retard de paiement, TVA collectée à télédéclarer et pipeline de devis.
- **Modules Complets PME** : Facturation conforme, gestion multi-dépôts des stocks, rapprochement des relevés bancaires marocains et exports comptables.
- **Grille Tarifaire Interactive** : Sélecteur mensuel / annuel avec remise de 20%, 3 offres adaptées (Starter Freelance, PME Croissance, Entreprise Scale).

## Technologies Utilisées
- **Framework** : [Next.js](https://nextjs.org/) (App Router)
- **UI & Rendu** : [React](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Styles** : [Tailwind CSS](https://tailwindcss.com/)
- **Icônes** : [Lucide React](https://lucide.dev/)

---

## Installation & Démarrage Local

### Prérequis
- Node.js version 18.18+ ou 20+
- npm version 9+

### 1. Installation des Dépendances
```bash
npm install
```

### 2. Démarrer le Serveur Local
```bash
npm run dev
```
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### 3. Compiler pour la Production
```bash
npm run build
```

### 4. Lancer la Version Compilée
```bash
npm run start
```

---

## Déploiement Indépendant

### Option A : Dépôt GitHub Séparé (Recommandé)

1. Initialisez un nouveau dépôt Git dans ce dossier :
   ```bash
   cd business-manager
   git init
   git add .
   git commit -m "feat: initial commit of BusinessManager project"
   ```
2. Créez un nouveau dépôt public ou privé sur GitHub nommé `business-manager` :
   ```bash
   git remote add origin https://github.com/VOTRE_NOM_UTILISATEUR/business-manager.git
   git branch -M main
   git push -u origin main
   ```
3. Connectez-vous sur [Vercel](https://vercel.com/) :
   - Cliquez sur **Add New...** > **Project**
   - Importez le dépôt `business-manager`
   - Le framework Next.js est automatiquement détecté
   - Cliquez sur **Deploy**

### Option B : Déploiement Monorepo (depuis le dossier racine)
Si vous conservez tous les projets dans un seul dépôt :
- Sur Vercel, définissez **Root Directory** sur `business-manager`.
- Les scripts de build et d'installation fonctionneront automatiquement.

---

## Variables d'Environnement
Ce projet ne requiert aucune variable d'environnement obligatoire pour fonctionner en mode démonstration.

Variables optionnelles pour un déploiement en production :
- `DATABASE_URL` (Optionnel) : Chaîne de connexion PostgreSQL / Supabase pour la persistance des données.
- `NEXTAUTH_SECRET` (Optionnel) : Clé secrète d'authentification utilisateur.

---

## Auteur & Copyright
Développé par [**Tariq Abala**](https://tariqabala.com) — Web Development & Digital Solutions.
*Professional Websites • Business Applications • Custom Admin Panels*

© 2026 TARIQ ABALA. Tous droits réservés.
