# Usamos una imagen de Node.js
FROM node:18-alpine

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos los archivos de configuración del proyecto
COPY package.json package-lock.json ./
COPY vite.config.ts ./
COPY tsconfig.json ./

# Instalamos las dependencias
RUN npm install --include=dev

# Copiamos el resto de los archivos
COPY . .

# Construimos la aplicación
RUN npm run build

# Instalamos serve para servir la aplicación estática
RUN npm install -g serve

# Exponemos el puerto
EXPOSE 5000

# Comando para iniciar el servidor (ahora apuntando a dist)
CMD ["sh", "-c", "serve -s dist -l 5000"]