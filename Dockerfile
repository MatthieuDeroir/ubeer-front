# Étape de construction
FROM node:14 AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de package et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier tout le code source
COPY . .

# Construire l'application React
RUN npm run build

# Étape de production
FROM nginx:alpine

# Copier le build de l'application React vers Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copier le fichier de configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les certificats SSL
COPY certs /etc/nginx/certs

# Exposer le port 443
EXPOSE 443

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]
