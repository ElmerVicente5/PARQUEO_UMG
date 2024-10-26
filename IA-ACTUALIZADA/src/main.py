import cv2
import numpy as np
import sys
import os
import requests
import json
import threading
from datetime import datetime

# Añade la ruta a la carpeta de YOLOv10
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'yolov10'))

from yolov10.ultralytics import YOLO
#from ultralytics import YOLO
from utils.sort import Sort
from utils.ReconocerPlaca import paddle_ocr
from utils import config as cfg
from utils.utils import is_plate_in_vehicle_box, si_vehiculo_esta_dentro_de_cuadro, crearCuadrosEnEstacionamiento,crearCuadros


# URL del servidor de la API (cambiar según la configuración)
API_URL = "http://localhost:8000/api/dashboard"


def notificar_estado_servidor(cuadro_id, estado):
    """ Notificar al servidor que un espacio ha cambiado de estado (ocupado/libre). """
    payload = {
        "id_espacio": cuadro_id,
        "estado": estado  # 'ocupado' o 'libre'
    }

    try:
        # Hacer una solicitud POST para actualizar el estado del espacio en el servidor
        response = requests.post(f"{API_URL}/estadoEspacio", json=payload)
        response.raise_for_status()  # Verificar si la solicitud fue exitosa
        print(f"Estado del espacio {cuadro_id} notificado al servidor: {estado}")
    except requests.RequestException as e:
        print(f"Error al notificar el estado al servidor: {e}")

def notificar_registro_vehiculo(placa, fechaEntrada, fechaSalida, cuadro_id):
    """Notificar al servidor el registro del vehículo."""
    # Formatear las fechas a 'YYYY-MM-DD HH:MM:SS'
    fechaEntrada_str = fechaEntrada.strftime("%Y-%m-%d %H:%M:%S")
    fechaSalida_str = fechaSalida.strftime("%Y-%m-%d %H:%M:%S")

    payload = {
        "placa": placa,
        "fechaEntrada": fechaEntrada_str,
        "fechaSalida": fechaSalida_str,
        "espacioOcupado": cuadro_id
    }

    try:
        # Hacer una solicitud POST para registrar el vehículo
        response = requests.post(f"{API_URL}/registrarVehiculo", json=payload)
        response.raise_for_status()  # Verificar si la solicitud fue exitosa
        print(f"Se notificó al servidor el registro del vehículo en el espacio: {cuadro_id}")
    except requests.RequestException as e:
        print(f"Error al notificar el estado al servidor: {e}")

def gestionar_espacios():

    #cap = cv2.VideoCapture("../Resources/pruebaCarro3.mp4")
    #cap = cv2.VideoCapture("../Resources/carLicence3.mp4")
    #url = 'http://192.168.1.82:8080/video'
    url = 'http://100.91.94.144:8080/video'

    # Inicia la captura de video
    cap = cv2.VideoCapture(url)

    model = YOLO("yolov10n.pt")
    tracker = Sort(max_age=5, min_hits=3, iou_threshold=0.3)

    while cap.isOpened():
        status, frame = cap.read()
        if not status:
            break

        height, width, _ = frame.shape
        results = model(frame, stream=True)

        # Paso 1 y 2: Identificar los vehículos en el frame y filtrar solo las clases permitidas
        for res in results:
            filtered_indices = np.where(res.boxes.conf.cpu().numpy() > 0.35)[0]
            boxes = res.boxes.xyxy.cpu().numpy()[filtered_indices].astype(int)
            class_ids = res.boxes.cls.cpu().numpy()[filtered_indices].astype(int)

            boxes_vehiculos = []
            for i, class_id in enumerate(class_ids):
                nombre_clase = model.names[class_id]
                if nombre_clase in cfg.clases_permitidas:  # Solo procesar clases de vehículos permitidas
                    boxes_vehiculos.append(boxes[i])

            # Convertir boxes_vehiculos a numpy array para compatibilidad con Sort
            boxes_vehiculos = np.array(boxes_vehiculos)

            if len(boxes_vehiculos) > 0:
                # Paso 3: Usar el tracker Sort para asignar ID a cada vehículo
                tracks = tracker.update(boxes_vehiculos)
                cfg.tracks = tracks.astype(int)

                for xmin, ymin, xmax, ymax, track_id in cfg.tracks:
                    vehicle_recortado = frame[ymin:ymax, xmin:xmax]

                    # Verificar que el vehículo recortado tenga tamaño válido
                    if vehicle_recortado.shape[0] > 0 and vehicle_recortado.shape[1] > 0:
                        placa = None

                        # Paso 4 y 5: Procesar placa si aún no ha sido obtenida para este track_id
                        if track_id not in cfg.placas_procesadas:
                            matriculas, _, _ = paddle_ocr(vehicle_recortado)
                            if matriculas:
                                placa = matriculas[0]
                                if len(placa) >= 7:  # Verificar longitud de la placa
                                    cfg.placas_procesadas[track_id] = placa

                        # Paso 6: Validar si la placa ya fue procesada previamente
                        if track_id in cfg.placas_procesadas:
                            placa = cfg.placas_procesadas[track_id]
                            cv2.rectangle(frame, (xmin, ymin), (xmax, ymax), (0, 255, 0), 2)
                            cv2.putText(frame, placa, (xmin, ymin - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

                        # Paso 7 y 8: Verificar si el vehículo está dentro de un cuadro de estacionamiento
                        print("espacios: ", cfg.espacios)
                        for cuadro_id, cuadro_box in cfg.cuadros_info.items():
                            if si_vehiculo_esta_dentro_de_cuadro([xmin, ymin, xmax, ymax], cuadro_box['coordenadas']):
                                # Validar estado del cuadro y ocupación por vehículo con placa
                                if cfg.estado_anterior[cuadro_id] == 'disponible' and placa:
                                    cfg.estado_anterior[cuadro_id] = 'ocupado'
                                    cfg.vehiculo_en_espacio[cuadro_id] = {
                                        'id': track_id,
                                        'matricula': placa,
                                        'hora_ocupacion': datetime.now()
                                    }
                                    notificar_estado_servidor(cuadro_id, 'ocupado')
                                    print(f"Espacio {cuadro_id} ocupado por {track_id} - {placa}")

                            # Detectar cuando el vehículo abandona el cuadro
                            elif cfg.estado_anterior[cuadro_id] == 'ocupado' and cfg.vehiculo_en_espacio[cuadro_id] and \
                                    cfg.vehiculo_en_espacio[cuadro_id]['id'] == track_id:

                                # Guardar la información de ocupación y desocupación antes de limpiar
                                info_vehiculo = cfg.vehiculo_en_espacio[cuadro_id]
                                hora_ocupacion = info_vehiculo['hora_ocupacion']
                                placa = info_vehiculo['matricula']
                                hora_desocupacion = datetime.now()

                                # Imprimir la información completa antes de liberar el espacio
                                print(
                                    f"Espacio {cuadro_id} desocupado.\n"
                                    f"  Matrícula: {info_vehiculo['matricula']}\n"
                                    f"  Hora ocupación: {hora_ocupacion}\n"
                                    f"  Hora desocupación: {hora_desocupacion}"
                                )

                                # Actualizar el estado y liberar el espacio
                                cfg.estado_anterior[cuadro_id] = 'disponible'
                                notificar_estado_servidor(cuadro_id, 'disponible')
                                notificar_registro_vehiculo(placa, hora_ocupacion, hora_desocupacion, cuadro_id)


                                # Limpiar el registro del vehículo
                                cfg.vehiculo_en_espacio[cuadro_id] = None
                                # notificar_estado_servidor(cuadro_id, 'libre')

        # Renderizar el marco con el estado de ocupación
        overlay = np.zeros((height, width, 4), dtype='uint8')
        combined = crearCuadros(frame, len(cfg.espacios), 1, (255, 0, 0, 255))
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 50]  # Ajustar calidad de imagen
        ret, buffer = cv2.imencode('.jpg', combined, encode_param)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    cap.release()

def detectar_vehiculos():
    cap = cv2.VideoCapture("../Resources/carLicence4.mp4")
    # Cargar el modelo YOLO v10
    model = YOLO("yolov10n.pt")

    # Inicializar el rastreador
    tracker = Sort(max_age=5, min_hits=3, iou_threshold=0.3)

    while cap.isOpened():
        status, frame = cap.read()

        if not status:
            break

        # Obtener las dimensiones del frame completo
        height, width, _ = frame.shape

        # Detección de vehículos en el frame original
        results = model(frame, stream=True)

        for res in results:
            filtered_indices = np.where(res.boxes.conf.cpu().numpy() > 0.35)[0]
            boxes = res.boxes.xyxy.cpu().numpy()[filtered_indices].astype(int)
            class_ids = res.boxes.cls.cpu().numpy()[filtered_indices].astype(int)

            boxes_vehiculos = []
            for i, class_id in enumerate(class_ids):
                nombre_clase = model.names[class_id]
                if nombre_clase in cfg.clases_permitidas:
                    boxes_vehiculos.append(boxes[i])

            boxes_vehiculos = np.array(boxes_vehiculos)

            if len(boxes_vehiculos) > 0:
                tracks = tracker.update(boxes_vehiculos)
                cfg.tracks = tracks.astype(int)

                # Almacenar los vehículos detectados y sus posiciones
                for xmin, ymin, xmax, ymax, track_id in cfg.tracks:
                    if track_id in cfg.placas_procesadas:
                        cv2.putText(frame, f"Id: {track_id} Matricula: {cfg.placas_procesadas[track_id]}",
                                    (xmin, ymin - 10), fontFace=cv2.FONT_HERSHEY_PLAIN,
                                    fontScale=1, color=(0, 255, 0), thickness=2)
                        cv2.rectangle(frame, (xmin, ymin), (xmax, ymax), (0, 255, 0), 2)
                    else:
                        #verifica si en el estacionamiento hay espacios disponibles
                        print("espacios_disponibles",cfg.espacios_disponibles)
                        print("espacios reservados", cfg.espacios_reservados)
                        if cfg.espacios_disponibles==0 or cfg.espacios_reservados==0:
                            # Verificar que el recorte tiene dimensiones válidas
                            frame_altura, frame_anchura = frame.shape[:2]
                            xmin = max(0, xmin)
                            ymin = max(0, ymin)
                            xmax = min(frame_anchura, xmax)
                            ymax = min(frame_altura, ymax)

                            if (xmax - xmin) > 0 and (ymax - ymin) > 0:
                                vehicle_recortado = frame[ymin:ymax, xmin:xmax]
                                # cv2.imshow("Frame Recortado", vehicle_recortado)

                                # Procesar el recorte del vehículo con paddle_ocr
                                matriculas, posiciones_Matricula, vehicle_recortado = paddle_ocr(vehicle_recortado)

                                if matriculas is None or posiciones_Matricula is None:
                                    continue

                                for i, (placa_texto, (pxmin, pymin, pxmax, pymax)) in enumerate(
                                        zip(matriculas, posiciones_Matricula)):
                                    placa_box = (pxmin, pymin, pxmax, pymax)

                                    if placa_texto in cfg.placas_procesadas.values():
                                        continue
                                    else:
                                        cfg.placas_procesadas[track_id] = placa_texto
                        else:
                            #muestra mensaje indicando que no hay espacios disponibles en el estacionamiento
                            print("lo sentimos nuestro  parqueo está lleno :(")

        # Mostrar el frame procesado
        #cv2.imshow("frame", frame)
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        # Genera los frames en formato adecuado para transmisión
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    cap.release()

