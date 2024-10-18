# Utiliza una imagen oficial de Node.js como base
FROM node:16-alpine

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Construye la aplicación para producción
RUN npm run build

# Instala un servidor web estático como serve para servir los archivos construidos
RUN npm install -g serve

# Expon el puerto que utilizará el contenedor
EXPOSE 3000

# Comando para ejecutar la aplicación en el servidor estático
CMD ["serve", "-s", "build", "-l", "3000"]
