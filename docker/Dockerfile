# ================================
# Stage 1: Build
# ================================
FROM node:18-alpine AS build

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Variable de plateforme pour le badge navbar (ex: ec2, beanstalk, ecs, eks)
ARG VITE_DEPLOY_PLATFORM
ENV VITE_DEPLOY_PLATFORM=$VITE_DEPLOY_PLATFORM

# Build de l'application
RUN npm run build

# ================================
# Stage 2: Production avec NGINX
# ================================
FROM nginx:stable-alpine

LABEL maintainer="Yara Mahi"
LABEL description="E-Commerce Frontend Production"

# Installer gettext (pour envsubst)
RUN apk add --no-cache gettext

# Copier la configuration NGINX en tant que TEMPLATE
COPY docker/nginx.conf.template /etc/nginx/conf.d/default.conf.template

# Copier le script d'entrée
COPY docker/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Copier les fichiers build depuis l'étape précédente
COPY --from=build /app/dist /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Utiliser le script d'entrée personnalisé
ENTRYPOINT ["/docker-entrypoint.sh"]
