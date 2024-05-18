# MultiLingQuiz is part of Segimundo Ferrairó García.

# Segimundo Ferrairó García is free software: you can redistribute it and/or modify it under the terms 
# of the GNU General Public License as published by the Free Software Foundation, 
# either version 3 of the License, or (at your option) any later version.

# Segimundo Ferrairó García is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; 
# without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
# See the GNU General Public License for more details.

# You should have received a copy of the GNU General Public License along with Segimundo Ferrairó García. 
# If not, see <https://www.gnu.org/licenses/>.


# Usa la imagen oficial de Node.js como base
FROM node:alpine

# Establece el directorio de trabajo en /app
WORKDIR /NodeApp

# Copia el archivo package.json y package-lock.json al directorio de trabajo
COPY ./resources/package*.json /NodeApp/

# Instala las dependencias
RUN npm install -g nodemon
RUN npm install --save @iamtraction/google-translate

RUN npm install

# Expone el puerto 3000
EXPOSE 3000

# Comando para ejecutar la aplicación cuando el contenedor se inicie
CMD ["npm", "run", "start"]