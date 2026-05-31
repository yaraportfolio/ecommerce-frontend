#!/bin/sh
# ================================================
# Docker Entrypoint - Substitution Variables NGINX
# ================================================

set -e

echo "🔧 Substituting environment variables in NGINX config..."

# Remplacer les variables dans le template
tenvsubs '${BACKEND_URL} ${BACKEND_HOST}' \
  < /etc/nginx/conf.d/default.conf.template \
  > /etc/nginx/conf.d/default.conf

echo "✅ NGINX configuration:"
echo "   FRONTEND_PORT: ${FRONTEND_PORT} ---> 80"
echo "   BACKEND_URL: ${BACKEND_URL}"
echo "   BACKEND_HOST: ${BACKEND_HOST}"

# Vérifier la syntaxe NGINX
echo "🔍 Testing NGINX configuration..."
nginx -t

# Démarrer NGINX
echo "🚀 Starting NGINX..."
exec nginx -g 'daemon off;'