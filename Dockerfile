# Etapa 1: Construir la aplicación Angular
FROM node:20.15.1-alpine as builder

WORKDIR /app

# Copia los archivos necesarios para instalar las dependencias
COPY package*.json ./

# Instala las dependencias
RUN yarn install --force

# Copia el resto del código fuente
COPY . .

# Construye la aplicación
RUN npx ng build --configuration=development

# Etapa 2: Configurar el servidor Nginx para servir la aplicación
FROM nginx:alpine-slim
RUN apk update && apk add --no-cache icu-libs
RUN apk upgrade busybox
RUN apk add --no-cache openssl

# Copiar la aplicación compilada desde la etapa 1
COPY --from=builder /app/dist/elite-admin-angular /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80
# Comando por defecto para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
