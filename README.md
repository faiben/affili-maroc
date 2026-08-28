# AffiliMaroc 🇲🇦

Plateforme d'affiliation marketing indépendante pour le Maroc. Connecte les entreprises marocaines avec des affiliés (influenceurs, blogueurs, commerçants) pour promouvoir des produits et services contre des commissions en MAD.

## ✨ Fonctionnalités

- **Authentification** : comptes Entreprise / Affilié / Admin avec email + CIN + téléphone
- **Authentification** : inscription/login avec rôles Entreprise / Affilié / Admin
- **Dashboard Entreprise** : stats, ajout de produits, liens d'affiliation, gestion des affiliés
- **Dashboard Affilié** : catalogue, génération de liens, suivi des clics/conversions, retraits
- **Admin Panel** : modération, gestion des conversions, retraits, litiges, paramètres
- **Profil & Paramètres** : gestion du compte, préférences, mode sombre
- **Vérification SMS OTP** : simulation avec code démo `123456`
- **Bilingue FR / Darija** : toggle de langue avec support RTL
- **Design marocain** : vert (#2E7D32) + or (#F9A825), responsive, dark mode
- **Paiements marocains** : CIH, Attijariwafa, Bank Al-Maghrib, Cash Plus, Wafacash, Inwi Money, Orange Money
- **SEO** : sitemap.xml, robots.txt, meta tags, Open Graph

## 🛠 Stack technique

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma ORM + SQLite (démo)
- NextAuth.js v5 (Auth.js)
- Framer Motion

## 🚀 Démarrage rapide

```bash
# Installation des dépendances
npm install

# Génération du client Prisma
npx prisma generate

# Migration et seed de la base de données
npx prisma migrate dev
npx prisma db seed

# Lancement du serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## 🔑 Comptes de démo

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | `admin@affilimaroc.ma` | `demo1234` |
| Entreprise | `entreprise@demo.ma` | `demo1234` |
| Affilié | `affilie@demo.ma` | `demo1234` |

## 📁 Structure du projet

```
affili-maroc/
├── prisma/                 # Schéma et seed Prisma
├── src/
│   ├── app/               # Routes Next.js
│   ├── components/        # Composants React
│   │   └── ui/            # Composants shadcn/ui
│   ├── lib/               # Utilitaires, constants, traductions
│   ├── types/             # Déclarations TypeScript
│   └── auth.ts            # Configuration NextAuth
├── .env                   # Variables d'environnement
└── package.json
```

## ⚙️ Variables d'environnement

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="votre-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Pour la production avec PostgreSQL :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/affilimaroc"
```

## 🧪 Tests

```bash
# Build de production
npm run build

# Linter
npm run lint
```

## 📝 Notes

- La vérification SMS OTP est simulée en démo (les codes sont automatiquement validés).
- Les paiements sont gérés manuellement via l'admin panel pour les virements bancaires marocains.
- Les cookies d'affiliation durent 30 jours par défaut (configurable).

## 🌐 Déploiement

Le projet est prêt pour Vercel :

```bash
vercel
```

N'oubliez pas de configurer les variables d'environnement et la base de données PostgreSQL (Supabase/Neon) sur Vercel.

### 🐳 Docker

L'application est containerisée et expose le port **4000** par défaut (mappé sur le port 3000 du conteneur).

```bash
# Build et démarrage
docker-compose up -d --build

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down
```

Accédez à l'application sur [http://localhost:4000](http://localhost:4000).

La base SQLite est persistée dans le volume Docker `affili-maroc-data`.

Pour utiliser un autre port, modifiez le fichier `docker-compose.yml` :

```yaml
ports:
  - "5000:3000"
```
