# Usa la imagen oficial de Node.js como base
FROM node:alpine

# Establece el directorio de trabajo en /app
WORKDIR /NodeApp

# Copia el archivo package.json y package-lock.json al directorio de trabajo
COPY ./resources/package.json /NodeApp/package.json

# Instala las dependencias
RUN npm install -g nodemon
RUN npm install

# Expone el puerto 3000
EXPOSE 3000

# Comando para ejecutar la aplicación cuando el contenedor se inicie
CMD ["npm", "run", "dev"]