# 🛒 E-Commerce Frontend - Portfolio DevOps & SRE

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=nodedotjs&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI/CD-2088FF?logo=github&logoColor=white)
![GHCR](https://img.shields.io/badge/GHCR-registry-24292e?logo=github&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-K8s-326CE5?logo=kubernetes&logoColor=white)
![NGINX](https://img.shields.io/badge/NGINX-proxy-009639?logo=nginx&logoColor=white)
![License](https://img.shields.io/badge/license-Portfolio-blueviolet)

Frontend React (SPA) de la plateforme e-commerce **microservices**. NGINX sert le build statique et proxifie `/api/*` vers la couche microservices (4 services : auth, product, order, review). Conçu comme **support pédagogique DevOps/SRE**, il est **déployé sur AWS** (EKS + EC2/Beanstalk/ECS) et documente aussi un **déploiement on-premise** (Docker Compose → Swarm → Kubernetes).

> 💡 **Objectif Portfolio** : Démontrer la maîtrise du déploiement applicatif sur **cloud managé (AWS)** et **on-premise**, avec les trade-offs de chaque approche.

![Accueil](https://raw.githubusercontent.com/yaraportfolio/ecommerce-terraform-aws/main/img/shop-home.png)

---

## ☁️ Déploiement Cloud AWS - *production actuelle*

Ce frontend est **déployé sur AWS** dans une architecture cloud-native, servi de **3 façons différentes** derrière un même ALB pour illustrer la progression IaaS → PaaS → Serverless :

| Option A | Option B | Option C |
|----------|----------|----------|
| 🟠 **EC2** (NGINX natif) | 🟢 **Elastic Beanstalk** (Docker/ECR) | 🟣 **ECS Fargate** (serverless) |

Un **badge dynamique dans la navbar** (`VITE_DEPLOY_PLATFORM`) indique en temps réel sur quelle plateforme tourne l'instance servie. Les 4 microservices tournent sur **EKS Auto Mode + Helm**, la base sur **RDS MySQL**.

👉 **Infrastructure complète, guides pas-à-pas (console + CLI), Terraform et architecture détaillée :**
**[➜ ecommerce-terraform-aws](https://github.com/yaraportfolio/ecommerce-terraform-aws)**

![Architecture AWS](https://raw.githubusercontent.com/yaraportfolio/ecommerce-terraform-aws/main/img/architecture.png)

> ℹ️ La suite documente le **déploiement on-premise / self-hosted** des microservices. Les adresses `192.168.56.x` correspondent à cet environnement local.

---

## 🧩 Architecture microservices

Le frontend ne parle jamais directement aux services : il passe par une **couche d'entrée** (Ingress Kubernetes ou ALB) qui route `/api/*` vers le bon microservice.

```
                    Navigateur
                        │ HTTPS
            ┌───────────▼───────────┐
            │  Frontend (NGINX)     │  React build + proxy /api
            └───────────┬───────────┘
                        │ /api/*
            ┌───────────▼───────────┐
            │  Ingress / ALB        │  routing par préfixe de chemin
            └───┬───────┬───────┬───┴───┐
                ▼       ▼       ▼       ▼
            ┌───────┐┌───────┐┌───────┐┌───────┐
            │ auth  ││product││ order ││review │
            │ :3001 ││ :3002 ││ :3003 ││ :3004 │
            └───┬───┘└───┬───┘└───┬───┘└───┬───┘
                └────────┴────┬───┴────────┘
                             │ MySQL :3306
                    ┌────────▼────────┐
                    │  MariaDB / RDS  │
                    │  ecommerce_db   │
                    └─────────────────┘
```

| Route frontend | Microservice | Port |
|----------------|--------------|------|
| `/api/auth/*` | auth-service | 3001 |
| `/api/products/*` | product-service | 3002 |
| `/api/orders/*` | order-service | 3003 |
| `/api/reviews/*` | review-service | 3004 |

---

## ⚡ Quick Start (local)

```bash
git clone https://github.com/yaraportfolio/ecommerce-frontend.git
cd ecommerce-frontend

# Développement (Vite)
npm install
npm run dev          # http://localhost:5173

# Production (build statique)
npm run build        # génère dist/
```

> **Note Architecture** : le frontend (NGINX + React) reste **identique** quel que soit le mode de déploiement. Seule la cible du proxy `/api` change (Ingress K8s, ALB, ou gateway Swarm).

---

## 🚀 Déploiement on-premise

On distingue le déploiement du **frontend** (ce repo) de celui des **microservices** (repos dédiés). Le frontend proxifie `/api/*` vers la couche microservices, quelle que soit sa cible.

### A. Le frontend - *2 façons*

#### A1 - Directement sur un serveur (NGINX natif)

Build statique servi par un NGINX installé sur la VM, sans Docker.

```bash
npm install && npm run build
sudo cp -r dist/* /var/www/html/ecommerce/
# Config NGINX (voir bloc ci-dessous) → proxy /api vers la couche microservices
sudo nginx -t && sudo systemctl reload nginx
```

#### A2 - Docker / Docker Compose (conteneur NGINX)

Image multi-stage (Node → NGINX alpine). `BACKEND_URL` injecté par `envsubst` au démarrage - **changer de backend sans rebuild**.

```bash
cp .env.example .env
# Éditer BACKEND_URL → URL de la couche microservices (Ingress/Swarm)

docker compose up -d
docker compose restart frontend   # après modif de .env (~10s)
```

```
🔧 Substituting environment variables in NGINX config...
✅ NGINX configuration:
   BACKEND_URL: http://192.168.56.111:30080
   BACKEND_HOST: api.ecommerce.local
🚀 Starting NGINX...
```

### B. Les microservices - *Swarm ou Kubernetes*

Les 4 microservices se déploient **indépendamment du frontend** (chacun son repo + image GHCR), au choix sur :

| | Docker Swarm | Kubernetes + Helm |
|--|:------------:|:-----------------:|
| **Profil** | Prod simple | Prod avancée |
| **Haute dispo** | ✅ | ✅ |
| **Auto-scaling** | ✅ partiel | ✅ HPA |
| **Auto-healing** | ✅ | ✅ |
| **Rollback** | ✅ | ✅ `helm rollback` |

**Docker Swarm** (cluster Docker natif, réplication des services) :
```
Swarm Manager (192.168.56.111)
   ├── auth-service    (replicas: 2)
   ├── product-service (replicas: 2)
   ├── order-service   (replicas: 2)
   └── review-service  (replicas: 2)
        │ MySQL :3306
MariaDB (192.168.56.115, externe au cluster)
```

**Kubernetes + Helm** (orchestration, HPA, rollback déclaratif) - **même chart que sur AWS EKS**, voir [ecommerce-k8s-helm](https://github.com/yaraportfolio/ecommerce-k8s-helm) :
```
K8s Cluster (192.168.56.111)
   ├── Ingress Controller (NodePort 30080)
   ├── auth-service    Pod (HPA)
   ├── product-service Pod (HPA)
   ├── order-service   Pod (HPA)
   └── review-service  Pod (HPA)
        │ MySQL :3306
MariaDB (192.168.56.115, externe au cluster)
```

> Le frontend pointe son proxy `/api` vers la gateway Swarm ou l'Ingress K8s via `BACKEND_URL`.

<details>
  <summary><strong>Config NGINX du frontend (proxy /api)</strong></summary>

```nginx
server {
    listen 80;
    server_name ecommerce.local 192.168.56.114;
    root /var/www/html/ecommerce;        # ou /usr/share/nginx/html en conteneur
    index index.html;

    # SPA - toutes les routes vers index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy vers la couche microservices (Ingress K8s, ALB, ou gateway Swarm)
    location /api {
        proxy_pass ${BACKEND_URL};               # injecté par envsubst
        proxy_http_version 1.1;
        proxy_set_header Host ${BACKEND_HOST};    # requis pour l'Ingress K8s
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    gzip on;
    gzip_types text/css application/javascript application/json;
}
```
</details>

---

## ⚙️ Variables d'Environnement

| Variable | Description | Défaut | Requis |
|----------|-------------|--------|--------|
| `BACKEND_URL` | URL de la couche microservices (Ingress/ALB) ciblée par le proxy `/api` | - | ✅ (conteneur) |
| `BACKEND_HOST` | Header `Host` pour l'Ingress Kubernetes | `api.ecommerce.local` | ✅ (conteneur) |
| `FRONTEND_PORT` | Port d'exposition NGINX | `80` | ❌ |
| `VITE_DEPLOY_PLATFORM` | Badge plateforme navbar (`ec2`, `beanstalk`, `ecs`, `eks`) - **build-time** | *(vide)* | ❌ |

> 💡 `BACKEND_URL`/`BACKEND_HOST` sont des variables **runtime** (injectées par `envsubst` dans NGINX). `VITE_DEPLOY_PLATFORM` est **build-time** (intégrée au bundle React).

---

## 📁 Structure du Projet

```
ecommerce-frontend/
├── .img/                       # Screenshots documentation
├── docker/
│   ├── Dockerfile              # Multi-stage (Node → NGINX alpine)
│   ├── nginx.conf.template     # Template avec ${BACKEND_URL}
│   └── docker-entrypoint.sh    # envsubst au démarrage
├── src/
│   ├── components/             # Navbar (badge plateforme), ProductCard, routes protégées
│   ├── context/                # AuthContext (JWT), CartContext
│   ├── pages/                  # Home, Products, Cart, Checkout, Orders, Login, admin/
│   └── services/api.js         # Axios + gestion expiration JWT
├── docker-compose.yml
├── .env.example
├── vite.config.js
└── tailwind.config.js
```

> 💡 **Multi-stage build** : l'image finale ne contient que NGINX alpine (~48 MB). Node.js et `node_modules` ne servent qu'au build, jamais en production.

---

## 🎨 Technologies

| Catégorie | Techno | Rôle |
|-----------|--------|------|
| UI | React 18 | Interface SPA |
| Build | Vite 5 | Bundler |
| Routing | React Router 6 | Navigation |
| HTTP | Axios | Client API + intercepteurs JWT |
| Style | Tailwind CSS | Utility-first |
| State | Context API | Auth + Panier |
| Serveur | NGINX alpine | Static + reverse proxy |

---

## 🎯 Parcours Utilisateur

```
Accueil → Produits → "Ajouter au panier"
   ↓ (si non connecté)
Inscription → Connexion → JWT stocké (24h)
   ↓
Panier → Checkout → Commande
```

**Admin** : Dashboard → gérer produits / commandes / modérer avis.

---

## 🔐 Comptes de Test

| Rôle | Email | Password |
|------|-------|----------|
| Utilisateur | john.doe@example.com | password123 |
| Administrateur | admin@ecommerce.com | admin123 |

---

## 🔗 Projets Liés

| Composant | Repository |
|-----------|------------|
| ☁️ Infra AWS (EKS/RDS/ALB + Terraform) | [ecommerce-terraform-aws](https://github.com/yaraportfolio/ecommerce-terraform-aws) |
| ⎈ Helm Chart microservices | [ecommerce-k8s-helm](https://github.com/yaraportfolio/ecommerce-k8s-helm) |
| 🔐 Auth Service | [ecommerce-auth-service](https://github.com/yaraportfolio/ecommerce-auth-service) |
| 📦 Product Service | [ecommerce-product-service](https://github.com/yaraportfolio/ecommerce-product-service) |
| 🛒 Order Service | [ecommerce-order-service](https://github.com/yaraportfolio/ecommerce-order-service) |
| ⭐ Review Service | [ecommerce-review-service](https://github.com/yaraportfolio/ecommerce-review-service) |

---

## 👨‍💻 Auteur

**Yara Mahi Mohamed** - Portfolio DevOps & SRE · Architecture Microservices

*⭐ N'oubliez pas de star ce repo si vous le trouvez utile !*
