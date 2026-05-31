# 🐳 Guide de Déploiement Docker - E-Commerce Frontend

Guide complet pour containeriser et déployer le frontend React/Vite avec Docker.

---

## 🏗️ Architecture Docker

### Structure du Projet

**Organisation des fichiers :**
```
ecommerce-frontend/
├── docker-compose.yml          # Orchestration à la racine
├── docker/                     # Tous les fichiers Docker regroupés
│   ├── Dockerfile              # Build instructions
│   ├── nginx.conf              # Config serveur web
│   └── DOCKER-DEPLOYMENT.md    # Documentation
├── src/                        # Code source React
├── public/                     # Assets statiques
├── package.json                # Dépendances Node
├── .dockerignore               # Fichiers à ignorer
└── ...
```

**Avantages de cette structure :**
- ✅ Fichiers Docker isolés dans `docker/`
- ✅ `docker-compose.yml` accessible à la racine
- ✅ Build context = racine (accès à src/, package.json)
- ✅ Organisation claire et maintenable

### Dockerfile Multi-Stage

**Stage 1 - Build :**
- Base : `node:18-alpine` (léger)
- Installation dépendances : `npm ci`
- Build React : `npm run build`
- Output : `/app/dist`

**Stage 2 - Production :**
- Base : `nginx:alpine` (très léger)
- Copie du build depuis Stage 1
- Configuration NGINX personnalisée
- Exposition port 80

**Avantages :**
- ✅ Image finale < 50 MB
- ✅ Pas de Node.js en production
- ✅ Sécurité renforcée
- ✅ Performance optimale

---

## 🚀 Déploiement

### Option 1 : Docker Compose (Recommandé)

```bash
# 1. Build et démarrage
docker-compose up -d --build

# 2. Vérifier les logs
docker-compose logs -f frontend

# 3. Tester
curl http://localhost
```

### Option 2 : Docker Seul

```bash
# 1. Build l'image
docker build -f docker/Dockerfile -t ecommerce-frontend:latest .

# 2. Run le container
docker run -d \
  --name ecommerce-frontend \
  -p 80:80 \
  --restart unless-stopped \
  ecommerce-frontend:latest

# 3. Vérifier
docker ps
docker logs ecommerce-frontend
```

---

## 🧪 Tests

### Vérifier le Container

```bash
# Status
docker-compose ps

# Logs en temps réel
docker-compose logs -f

# Accès shell NGINX
docker exec -it ecommerce-frontend sh
```

### Tester l'Application

```bash
# Page d'accueil
curl http://localhost

# API Proxy (doit retourner données des microservices)
curl http://localhost/api/products

# Health check
curl http://localhost/api/auth/health
```

### Depuis le Navigateur

```
http://localhost            # Frontend React
http://localhost/api/products   # API via proxy
```

---

## 🔧 Configuration

### Variables d'Environnement

**Dans docker-compose.yml :**

```yaml
environment:
  - NODE_ENV=production
  - TZ=Africa/Abidjan  # Fuseau horaire (optionnel)
```

### Modifier le Proxy API

**Si votre API Kubernetes/Backend change :**

Éditez le fichier `.env`  et mettez à jour les variables :

```Env
BACKEND_URL=http://NOUVELLE_IP:NOUVEAU_PORT
BACKEND_HOST=NOUVEAU_HOST
```

Ensuite, relancez vos services pour appliquer les changements (pas besoin de rebuild si le Dockerfile n’a pas changé) :

```bash
docker-compose down
docker-compose up -d
```

---

## 📊 Monitoring

### Logs NGINX

```bash
# Logs d'accès
docker exec ecommerce-frontend tail -f /var/log/nginx/ecommerce-access.log

# Logs d'erreur
docker exec ecommerce-frontend tail -f /var/log/nginx/ecommerce-error.log
```

### Stats Container

```bash
# Utilisation ressources
docker stats ecommerce-frontend

# Détails
docker inspect ecommerce-frontend
```

---

## 🔄 Mise à Jour

### Déploiement Nouvelle Version

```bash
# 1. Arrêter l'ancien container
docker-compose down

# 2. Pull/modifier le code
git pull origin main

# 3. Rebuild et redémarrer
docker-compose up -d --build

# 4. Vérifier
docker-compose logs -f
```

---

## 🐛 Dépannage

### Container ne démarre pas

```bash
# Logs détaillés
docker logs ecommerce-frontend

# Vérifier la config NGINX
docker exec ecommerce-frontend nginx -t

# Accès shell pour debug
docker exec -it ecommerce-frontend sh
```

### API ne fonctionne pas

```bash
# Tester depuis le container
docker exec ecommerce-frontend curl http://192.168.56.111:30080/api/products

# Vérifier DNS/réseau
docker exec ecommerce-frontend ping 192.168.56.111

# Logs proxy
docker exec ecommerce-frontend tail -f /var/log/nginx/error.log
```

### Port 80 déjà utilisé

```bash
# Voir qui utilise le port
sudo lsof -i :80
# ou
sudo netstat -tulpn | grep :80

# Option 1 : Arrêter le service
sudo systemctl stop nginx  # Si NGINX local

# Option 2 : Changer le port dans docker-compose.yml
ports:
  - "8080:80"  # Accès via localhost:8080
```

---

## 🔒 Sécurité

### Best Practices Appliquées

✅ **Multi-stage build** - Pas de code source en prod
✅ **Alpine Linux** - Surface d'attaque réduite
✅ **Non-root user** - NGINX tourne en utilisateur limité
✅ **Security headers** - X-Frame-Options, CSP, etc.
✅ **Gzip** - Compression données
✅ **Health checks** - Monitoring intégré

### Durcissement Additionnel

```yaml
# Dans docker-compose.yml
security_opt:
  - no-new-privileges:true
read_only: true
tmpfs:
  - /tmp
  - /var/cache/nginx
  - /var/run
```

---

## 📈 Performance

### Optimisations Appliquées

- ✅ Gzip compression
- ✅ Cache assets statiques (1 an)
- ✅ Buffer proxy optimisé
- ✅ Image Alpine (légère)

### Benchmarks

```bash
# Test de charge avec Apache Bench
ab -n 1000 -c 10 http://localhost/

# Temps de réponse
curl -o /dev/null -s -w "Time: %{time_total}s\n" http://localhost/
```

---

## 🌐 Production

### Reverse Proxy Externe (Recommandé)

Pour production, ajoutez NGINX/Traefik devant :

```nginx
# /etc/nginx/sites-available/ecommerce-prod
upstream frontend {
    server localhost:80;
}

server {
    listen 80;
    server_name ecommerce.votredomaine.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ecommerce.votredomaine.com;
    
    ssl_certificate /etc/letsencrypt/live/votredomaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votredomaine.com/privkey.pem;
    
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Docker Swarm / Kubernetes

Pour orchestration avancée, voir les repos :
- Backend microservices : déjà sur K8s
- Frontend : peut aussi être déployé sur K8s

---

## 📦 Registry Docker

### Push vers Registry

```bash
# Docker Hub
docker tag ecommerce-frontend:latest votreusername/ecommerce-frontend:latest
docker push votreusername/ecommerce-frontend:latest

# GitLab Registry
docker tag ecommerce-frontend:latest registry.gitlab.com/username/ecommerce-frontend:latest
docker push registry.gitlab.com/username/ecommerce-frontend:latest
```

### Pull et Run

```bash
docker pull votreusername/ecommerce-frontend:latest
docker run -d -p 80:80 votreusername/ecommerce-frontend:latest
```

---

## 🎯 Checklist Déploiement

**Avant de déployer :**

- [ ] Code buildé sans erreur (`npm run build`)
- [ ] Tests passent (`npm test`)
- [ ] API backend accessible
- [ ] Fichier `docker/nginx.conf` configuré avec bonne IP/port API
- [ ] Fichier `docker/.dockerignore` optimisé
- [ ] Variables d'environnement définies
- [ ] Structure de dossiers correcte (docker/ créé)

**Après déploiement :**

- [ ] Container tourne (`docker ps`)
- [ ] Logs sans erreur (`docker logs`)
- [ ] Health check OK (`curl localhost/api/health`)
- [ ] Frontend accessible dans navigateur
- [ ] API proxy fonctionne
- [ ] Assets chargent correctement

---

## 📚 Ressources

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [NGINX Optimization](https://www.nginx.com/blog/tuning-nginx/)
- [Docker Security](https://docs.docker.com/engine/security/)

---

## 💡 Conseils

### Développement vs Production

**Dev (npm run dev) :**
- Hot reload ✅
- Source maps ✅
- Dev tools ✅

**Docker (production) :**
- Build optimisé ✅
- NGINX performant ✅
- Portable ✅

**Best of both worlds :**
```bash
# Dev local
npm run dev

# Test build Docker avant push
docker-compose up --build

# Production
docker-compose up -d
```

---

## 🆘 Support

Problèmes ? Vérifiez dans l'ordre :

1. **Logs container** : `docker logs ecommerce-frontend`
2. **Config NGINX** : `docker exec ecommerce-frontend nginx -t`
3. **Réseau** : `docker network inspect ecommerce-network`
4. **API backend** : `curl http://192.168.56.111:30080/api/health`

---

**Version:** 1.0  
**Dernière mise à jour:** Février 2026  
**Auteur:** Yara Mahi
