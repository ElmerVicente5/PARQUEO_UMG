# Usar una imagen base oficial de Python 3.10.11
FROM python:3.10.11-slim

# Crear y establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Instalar las dependencias necesarias para OpenCV
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copiar solo requirements.txt primero
COPY requirements.txt .

# Instalar las dependencias listadas en el requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto de los archivos del proyecto al contenedor
COPY src/ /app/src
COPY yolov10/ /app/yolov10
COPY Resources/ /app/Resources

# Establecer el PYTHONPATH
ENV PYTHONPATH=/app/yolov10
# Exponer el puerto en el que correrá la aplicación Flask
EXPOSE 5000

# Comando para ejecutar la aplicación Flask
CMD ["python", "/app/src/app.py"]
