import numpy as np
import cv2
from ultralytics import YOLO
from sort import Sort
from ReconocerPlaca import paddle_ocr
from yolov10.ia import posiciones

# Clases permitidas (vehículos)
clases_permitidas = ['car', 'motorcycle', 'bus', 'truck']

# Diccionario para almacenar los track_id cuyas placas ya fueron procesadas
placas_procesadas = {}
vehiculos_a_procesar = []
posiciones_Matricula = {}
cuadros_info = {}
tracks = []

# Diccionario para almacenar las posiciones de los cuadros
cuadros_estacionamiento = {}

def is_plate_in_vehicle_box(vehicle_box, plate_box):
    """
    Verifica si la posición de la matrícula está dentro de los límites de un vehículo.

    Args:
    vehicle_box: [xmin, ymin, xmax, ymax] del vehículo
    plate_box: [xmin, ymin, xmax, ymax] de la matrícula

    Returns:
    True si la matrícula está dentro del vehículo, False en caso contrario.
    """
    v_xmin, v_ymin, v_xmax, v_ymax = vehicle_box
    p_xmin, p_ymin, p_xmax, p_ymax = plate_box

    return (p_xmin >= v_xmin and p_ymin >= v_ymin and
            p_xmax <= v_xmax and p_ymax <= v_ymax)


def is_vehicle_in_parking_box(vehicle_box, cuadro_box):
    """
    Verifica si un vehículo está dentro de un cuadro del estacionamiento.

    Args:
    vehicle_box: [xmin, ymin, xmax, ymax] del vehículo
    cuadro_box: [xmin, ymin, xmax, ymax] del cuadro del estacionamiento

    Returns:
    True si el vehículo está dentro del cuadro, False en caso contrario.
    """
    v_xmin, v_ymin, v_xmax, v_ymax = vehicle_box
    c_xmin, c_ymin, c_xmax, c_ymax = cuadro_box

    # Verificar si hay intersección entre el vehículo y el cuadro
    overlap_x = max(0, min(v_xmax, c_xmax) - max(v_xmin, c_xmin))
    overlap_y = max(0, min(v_ymax, c_ymax) - max(v_ymin, c_ymin))
    overlap_area = overlap_x * overlap_y

    # Si hay suficiente superposición, consideramos que el vehículo está en el cuadro
    vehicle_area = (v_xmax - v_xmin) * (v_ymax - v_ymin)
    return overlap_area / vehicle_area > 0.5  # Ajusta el umbral según sea necesario


def crear_cuadros_con_bordes_azules(frame, cuadros_x=4, cuadros_y=1, color_borde=(255, 0, 0, 255), alpha_overlay=0.6):
    """
    Crea una imagen con cuadros y bordes azules sobre un frame original.

    Args:
    frame: El frame original sobre el que se dibujarán los cuadros.
    cuadros_x: Número de columnas de cuadros.
    cuadros_y: Número de filas de cuadros.
    color_borde: Color del borde de los cuadros (B, G, R, A).
    alpha_overlay: Nivel de transparencia del overlay.

    Returns:
    combined: El frame combinado con los cuadros dibujados.
    """
    global cuadros_info  # Referencia al diccionario global

    # Obtener las dimensiones del frame
    height, width, _ = frame.shape

    # Crear una imagen transparente (RGBA) del mismo tamaño que el frame
    overlay = np.zeros((height, width, 4), dtype='uint8')

    # Dividir el frame en cuadros
    cuadro_ancho = width // cuadros_x
    cuadro_alto = height // cuadros_y

    # Reiniciar el diccionario antes de crear los nuevos cuadros
    cuadros_info.clear()

    # Dibujar los cuadros con bordes azules y fondo transparente, asignar IDs y almacenar posiciones
    cuadro_id = 1
    for fila in range(cuadros_y):
        for col in range(cuadros_x):
            x1 = col * cuadro_ancho
            y1 = fila * cuadro_alto
            x2 = x1 + cuadro_ancho
            y2 = y1 + cuadro_alto

            # Dibujar el borde en la imagen overlay
            cv2.rectangle(overlay, (x1, y1), (x2, y2), color_borde, thickness=3)

            # Almacenar la posición del cuadro con su ID
            cuadros_info[cuadro_id] = (x1, y1, x2, y2)
            cuadro_id += 1

    # Convertir el frame original a BGRA para aplicar la transparencia
    frame_bgra = cv2.cvtColor(frame, cv2.COLOR_BGR2BGRA)

    # Mezclar el frame original y la imagen overlay (transparente)
    alpha_frame = 1.0  # Opacidad del frame original

    # Combinar las dos imágenes
    combined = cv2.addWeighted(overlay, alpha_overlay, frame_bgra, alpha_frame, 0)

    return combined


if __name__ == '__main__':
    # Cargar el video
    cap = cv2.VideoCapture("../Resources/DetectarMatricula2.mp4")

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
            filtered_indices = np.where(res.boxes.conf.cpu().numpy() > 0.40)[0]
            boxes = res.boxes.xyxy.cpu().numpy()[filtered_indices].astype(int)
            class_ids = res.boxes.cls.cpu().numpy()[filtered_indices].astype(int)

            boxes_vehiculos = []
            for i, class_id in enumerate(class_ids):
                nombre_clase = model.names[class_id]
                if nombre_clase in clases_permitidas:
                    boxes_vehiculos.append(boxes[i])
            print("cajas", boxes_vehiculos)

            boxes_vehiculos = np.array(boxes_vehiculos)

            if len(boxes_vehiculos) > 0:
                tracks = tracker.update(boxes_vehiculos)
                tracks = tracks.astype(int)

                # Almacenar los vehículos detectados y sus posiciones
                for xmin, ymin, xmax, ymax, track_id in tracks:
                    # Verificar si ya se procesó la placa de este vehículo
                    if track_id in placas_procesadas:
                        cv2.putText(frame, f"Id: {track_id} Matricula: {placas_procesadas[track_id]}", (xmin, ymin - 10),
                                    fontFace=cv2.FONT_HERSHEY_PLAIN, fontScale=1, color=(0, 255, 0), thickness=2)
                        cv2.rectangle(frame, (xmin, ymin), (xmax, ymax), (0, 255, 0), 2)
                    else:
                        vehiculos_a_procesar.append((track_id, (xmin, ymin, xmax, ymax)))
                        vehicle_roi = frame[ymin:ymax, xmin:xmax]

        if len(vehiculos_a_procesar) > 0:


            matriculas, posiciones_Matricula, frame = paddle_ocr(frame)

            if matriculas is None or posiciones_Matricula is None:
                print("No se detectaron matrículas, no se guardarán datos")
                vehiculos_a_procesar.clear()
                continue

            for (track_id, (xmin, ymin, xmax, ymax)) in vehiculos_a_procesar:
                vehiculo_box = (xmin, ymin, xmax, ymax)

                for i, (placa_texto, (pxmin, pymin, pxmax, pymax)) in enumerate(zip(matriculas, posiciones_Matricula)):
                    placa_box = (pxmin, pymin, pxmax, pymax)

                    if is_plate_in_vehicle_box(vehiculo_box, placa_box) and track_id not in placas_procesadas:
                        placas_procesadas[track_id] = placa_texto
                        cv2.putText(frame, f"Id: {track_id} Matricula: {placas_procesadas[track_id]}", (xmin, ymin - 10),
                                    fontFace=cv2.FONT_HERSHEY_PLAIN, fontScale=1, color=(0, 255, 0), thickness=2)
                        cv2.rectangle(frame, (xmin, ymin), (xmax, ymax), (0, 255, 0), 2)

            vehiculos_a_procesar.clear()

        #### 2. Crear una imagen de cuadros con bordes azules ####
        overlay = np.zeros((height, width, 4), dtype='uint8')
        color_borde = (255, 0, 0, 255)

        cuadros_x = 4
        cuadros_y = 1
        print("placas procesadas",placas_procesadas)
        # Llamar a la función para crear cuadros y obtener el frame combinado
        combined = crear_cuadros_con_bordes_azules(frame, cuadros_x, cuadros_y)

        #### 3. Dibujar los cuadros del estacionamiento y el texto correspondiente sobre el frame combinado ####
        for xmin, ymin, xmax, ymax, track_id in tracks:
            """
            cv2.putText(combined, f"Id: {track_id}", (xmin, ymin - 10),
                        fontFace=cv2.FONT_HERSHEY_PLAIN, fontScale=1, color=(0, 0, 255), thickness=2)
            cv2.rectangle(combined, (xmin, ymin), (xmax, ymax), (0, 255, 0), 2)
            """
            # Comprobar si el vehículo está en algún cuadro de estacionamiento
            for cuadro_id, cuadro_box in cuadros_info.items():
                if is_vehicle_in_parking_box([xmin, ymin, xmax, ymax], cuadro_box):

                    cv2.putText(frame, f"Espacio {cuadro_id} ocupado", (xmin, ymin - 50),
                                fontFace=cv2.FONT_HERSHEY_PLAIN, fontScale=1, color=(0, 255, 0), thickness=2)
                    cv2.rectangle(frame, (xmin, ymin), (xmax, ymax), (0, 255, 0), 2)

                    print(f"El vehículo {track_id} está en el cuadro {cuadro_id}")  # Depuración
                else:
                    cv2.putText(frame, f"Espacio {cuadro_id} libre",
                                (cuadro_box[0], cuadro_box[1] - 10),
                                fontFace=cv2.FONT_HERSHEY_PLAIN, fontScale=1.5,
                                color=(0, 255, 0), thickness=2)
                    #cv2.rectangle(frame, (xmin, ymin), (xmax, ymax), (0, 255, 0), 2)
                    print(f"El vehículo {track_id} no ocupa el espacio con id {cuadro_id}")

                #### 4. Mostrar el frame combinado con los cuadros dibujados y el texto ####
        cv2.imshow("Estacionamiento", frame)

        if cv2.waitKey(20) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
