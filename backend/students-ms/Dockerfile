# Usa la imagen base de Node.js
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install --omit=dev

# Copia el resto del código de la aplicación
COPY . .

# Genera el cliente de Prisma
RUN npx prisma generate

# Ejecuta migraciones en la base de datos
CMD npx prisma migrate deploy && npm run start:prod
