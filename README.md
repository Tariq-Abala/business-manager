# BusinessManager SaaS — Logiciel de Gestion Commerciale & Facturation PME

Application SaaS moderne en mode clair (Light Mode) conçue pour la gestion commerciale, la facturation, le chiffrage de devis, le suivi des stocks et le rapprochement des encaissements pour PME et indépendants au Maroc.

Dépôt GitHub : [https://github.com/Tariq-Abala/business-manager](https://github.com/Tariq-Abala/business-manager)

---

## Direction Artistique & Ergonomie SaaS (Light Mode)

Fidèle aux standards des solutions SaaS d'entreprise modernes :
- **Fonds & Surfaces Lumineuses** : Fonds de page gris très clair (`#F8FAFC`, `#F1F5F9`) et cartes immaculées en blanc pur (`#FFFFFF`).
- **Couleurs d'Action & Statuts** :
  - **Bleu Primaire** (`#2563EB`) pour les actions principales, liens et sélections actives.
  - **Vert Émeraude / Sarcelle** (`#059669`, `#0D9488`) pour les créances payées et devis acceptés.
  - **Ambre / Orange Doux** (`#D97706`) pour les créances en attente et alertes stock.
  - **Rouge / Corail** (`#DC2626`) pour les factures en retard et actions de suppression.
  - **Ardoise Neutre** (`#0F172A`, `#334155`, `#64748B`) pour un contraste textuel certifié WCAG AA/AAA.
- **Suppression du Thème Sombre** au profit d'une interface de travail diurne, propre et lisible.
- **Barre Latérale (Sidebar)** complète avec raccourcis, compteurs de badges en temps réel et navigation responsive pour mobile.

---

## Modules Développés & Fonctionnalités

1. **Tableau de Bord (`/`)** :
   - Cartes d'indicateurs financiers en MAD : Créances Totales (avec jauge de progression du taux d'encaissement), Factures Payées, En Attente et En Retard.
   - Onglets de filtrage rapide : Toutes, Payées, En attente, En retard.
   - Recherche en temps réel et filtre par client.
   - Tableau dynamique avec sélection multiple, statut interactif, actions directes et pagination.
   - Raccourcis vers les autres modules.
2. **Factures (`/factures`)** :
   - Liste complète des factures, export CSV en un clic.
   - Modal de création et d'édition avec calcul automatique HT, TVA (20%, 14%, 10%, 7%, 0%) et TTC en MAD.
   - Enregistrement immédiat d'un règlement.
3. **Détail & Impression Facture (`/factures/[id]`)** :
   - Mise en page professionnelle au format A4 avec en-tête émetteur complet (Raison sociale, ICE, IF, RC, CNSS, coordonnées bancaires avec RIB 24 chiffres).
   - Coordonnées client, tableau détaillé des prestations et ventilation de la TVA.
   - Impression papier / PDF optimisée via les règles `@media print` (`window.print()`).
4. **Devis & Chiffrages (`/devis`)** :
   - Gestion des propositions commerciales (Brouillon, Envoyé, Accepté, Refusé, Converti).
   - **Conversion 1-Clic en Facture** : Génère automatiquement la facture correspondante avec report des lignes et décrémentation des stocks physiques.
5. **Répertoire Clients (`/clients`)** :
   - Gestion CRM des entreprises clientes avec ICE, contact, coordonnées et ville.
   - Calcul dynamique du chiffre d'affaires facturé et du solde restant dû par client.
   - Ajout, modification et suppression sécurisée avec modal de confirmation.
6. **Catalogue Produits & Gestion des Stocks (`/produits`)** :
   - Catalogue mixte de prestations de services immatérielles et de matériels physiques.
   - Suivi en temps réel des quantités en stock avec boutons d'ajustement rapide (+1 / -1).
   - Détection et badge d'alerte de stock bas (`stock <= seuil`).
7. **Suivi des Encaissements (`/paiements`)** :
   - Journal des encaissements par virement, chèque, carte bancaire ou espèces.
   - Rapprochement automatique réduisant le solde restant dû de la facture concernée.
8. **Paramètres de l'Entreprise (`/parametres`)** :
   - Formulaire de configuration des identifiants administratifs de l'entreprise (ICE, IF, RC, CNSS, Patente, RIB, taux de TVA par défaut).
   - Bouton de **Réinitialisation des Données de Démonstration** vers l'état initial.
9. **Tarifs SaaS (`/tarifs`)** :
   - Grille tarifaire avec sélecteur mensuel / annuel (-20%).
   - Formules Starter (150 MAD/m), PME Croissance (360 MAD/m) et Scale (710 MAD/m).
   - Tableau comparatif complet des fonctionnalités.

---

## Cohérence des Calculs & Données

- **Source Unique de Vérité (`BusinessContext`)** :
  - Tous les indicateurs du tableau de bord, les factures, les devis, les clients, les stocks et les encaissements proviennent du même gestionnaire d'état réactif.
  - Les modifications effectuées dans un module (ex : enregistrement d'un règlement ou conversion d'un devis) se répercutent instantanément sur l'ensemble des écrans.
- **Calculs Mathématiques Rigoureux** :
  - `Total HT Ligne = Quantité × Prix Unitaire HT`
  - `Total TVA Ligne = Total HT × (Taux TVA / 100)`
  - `Total TTC Ligne = Total HT + Total TVA`
  - Les arrondis sont appliqués à 2 décimales.
- **Persistance Locale Sécurisée** :
  - Les données de démo modifiées sont enregistrées dans le `localStorage` du navigateur.
  - Aucune donnée sensible ou clé secrète n'est exposée côté client.

---

## Précision & Avertissement Déontologique

Ce projet est une **réalisation de démonstration technique de portfolio**.
- Il ne constitue pas un logiciel comptable certifié ou homologué par la Direction Générale des Impôts (DGI).
- Les numéros d'identification fiscale (ICE, IF, RC, CNSS, Patente) et les coordonnées bancaires (RIB) sont purement fictifs.
- Aucune donnée n'est transmise à une administration fiscale réelle sans l'implémentation d'un connecteur d'API certifié.

---

## Feuille de Route pour Déploiement en Production Réelle

Pour transformer cette démonstration en produit SaaS commercial :
1. **Base de Données Relationnelle & ORM** : Remplacement du `localStorage` par PostgreSQL avec Prisma / Drizzle ORM.
2. **Authentification Sécurisée & Multi-Tenant** : Authentification Auth.js / NextAuth avec isolation stricte des données par organisation (Row-Level Security).
3. **Génération PDF Côté Serveur** : Intégration de React-PDF ou Puppeteer pour la génération et l'archivage sécurisé des factures PDF signées numériquement.
4. **Passerelle de Télépaiement Marocaine** : Intégration du CMI (Centre Monétique Interbancaire) ou passerelles de paiement bancaire pour le règlement direct en ligne des factures.

---

## Installation & Lancement Local

```bash
# 1. Cloner le dépôt
git clone https://github.com/Tariq-Abala/business-manager.git
cd business-manager

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur local
npm run dev

# 4. Compiler pour la production
npm run build
npm run start
```

---

## Développé par

**Tariq Abala**  
Site web officiel : [https://tariqabala.com](https://tariqabala.com)  
*Web Development & Digital Solutions*  
*Professional Websites • Business Applications • Custom Admin Panels*  

© 2026 TARIQ ABALA. Tous droits réservés. • BusinessManager SaaS Maroc
