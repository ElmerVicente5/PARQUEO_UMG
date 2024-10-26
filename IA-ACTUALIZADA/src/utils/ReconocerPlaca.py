from yolov10.ultralytics import YOLOv10
#from ultralytics import YOLO
from paddleocr import PaddleOCR
import numpy as np
import re

# Inicializar Paddle OCR
ocr = PaddleOCR(use_angle_cls=True, use_gpu=False)
model = YOLOv10("../weights/best.pt")

# Función para extraer texto de las matrículas
def extraer_texto_matricula(frame, x1, y1, x2, y2):
    frame = frame[y1:y2, x1:x2]  # Recortar la parte del frame con la matrícula
    result = ocr.ocr(frame, det=False, rec=True, cls=False)  # Obtener texto
    texto = ""
    for r in result:
        puntuaciones = r[0][1]
        if np.isnan(puntuaciones):
            puntuaciones = 0
        else:
            puntuaciones = int(puntuaciones * 100)
        if puntuaciones > 60:
            texto = r[0][0]
    patron = re.compile('[\W]')
    texto = patron.sub('', texto)
    texto = texto.replace("???", "")
    texto = texto.replace("O", "0")
    texto = texto.replace("粤", "")  # Limpiar caracteres chinos
    return str(texto)

# Función para procesar el OCR en las matrículas
def paddle_ocr(frame):
    print("frame recibido")
    # Detectar resultados de las predicciones con una confianza de 0.60
    resultados = model.predict(frame, conf=0.25)
    matriculas_detectadas = []
    posiciones_detectadas = []

    # Iterar sobre cada detección
    for resultado in resultados:
        cajas = resultado.boxes
        #print("resultados cajas placas", cajas)
        if len(cajas) == 0:
            continue  # Si no hay cajas, pasar al siguiente resultado

        for caja in cajas:
            x1, y1, x2, y2 = caja.xyxy[0]
            x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)

            # Obtener texto de la matrícula
            texto_matricula = extraer_texto_matricula(frame, x1, y1, x2, y2)
            #print("la matrícula es", texto_matricula)

            # Añadir la matrícula detectada y su posición a las listas
            matriculas_detectadas.append(texto_matricula)
            posiciones_detectadas.append((x1, y1, x2, y2))

    # Verificar si no se detectó ninguna matrícula ni posición
    if not matriculas_detectadas and not posiciones_detectadas:
        print("No se detectaron matrículas")
        return None, None, frame  # O puedes retornar algún otro valor que desees

    # Retornar solo si se detectaron matrículas
   # print("la matricula detectada: ",matriculas_detectadas)
    #print("posiciones detectadas: ", posiciones_detectadas)
    return matriculas_detectadas, posiciones_detectadas, frame
