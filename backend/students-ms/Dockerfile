# Imagen base con Node.js y Alpine para un contenedor ligero
FROM node:18.18-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instalar dependencias (todas, incluyendo las de desarrollo)
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Compilar la aplicación (genera los archivos en `dist/`)
RUN npm run build

# Eliminar dependencias de desarrollo para reducir el tamaño del contenedor
RUN npm prune --omit=dev

# Exponer el puerto en el que se ejecutará el microservicio
EXPOSE 3001

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"]
