# Etapa 1: Construir la aplicación Angular
FROM node:18 as builder

WORKDIR /app

# Copia los archivos necesarios para instalar las dependencias
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install --force

# Copia el resto del código fuente
COPY . .

# Construye la aplicación
#RUN npm run build #--prod #--project=saff
RUN npx ng build --configuration=development
RUN echo "esto es desa"

# Etapa 2: Configurar el servidor Nginx para servir la aplicación
FROM nginx:latest

# Copiar la aplicación compilada desde la etapa 1
COPY --from=builder /app/dist/Portal /usr/share/nginx/html

# Copiar la configuración personalizada de Nginx
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Comando por defecto para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
