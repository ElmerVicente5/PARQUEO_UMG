import numpy as np
import cv2
from . import config as cfg


# Función para verificar si la matrícula está dentro de los límites de un vehículo
def is_plate_in_vehicle_box(vehicle_box, plate_box):
    v_xmin, v_ymin, v_xmax, v_ymax = vehicle_box
    p_xmin, p_ymin, p_xmax, p_ymax = plate_box

    return (p_xmin >= v_xmin and p_ymin >= v_ymin and
            p_xmax <= v_xmax and p_ymax <= v_ymax)

# Función para verificar si un vehículo está dentro de un cuadro del estacionamiento
# Función para verificar si un vehículo está completamente dentro de un cuadro del estacionamiento
def si_vehiculo_esta_dentro_de_cuadro(vehicle_box, cuadro_box):
    v_xmin, v_ymin, v_xmax, v_ymax = vehicle_box
    c_xmin, c_ymin, c_xmax, c_ymax = cuadro_box

    # Comprueba que los límites del vehículo estén completamente dentro del cuadro
    return (v_xmin >= c_xmin and v_xmax <= c_xmax and
            v_ymin >= c_ymin and v_ymax <= c_ymax)



# Función para crear cuadros en el estacionamiento
def crearCuadros(frame, cuadros_x, cuadros_y, color_borde, alpha_overlay=0.6):
    height, width, _ = frame.shape
    overlay = np.zeros((height, width, 4), dtype='uint8')
    cuadro_ancho = width // cuadros_x
    cuadro_alto = height // cuadros_y
    cfg.cuadros_info = {}  # Reiniciar el diccionario para actualizar con los nuevos datos

    # Crear un diccionario para acceder a los espacios por su ID
    espacios_dict = {esp['id_espacio']: esp for esp in cfg.espacios}

    for idx, espacio in enumerate(cfg.espacios):
        fila = idx // cuadros_x
        col = idx % cuadros_x

        x1 = col * cuadro_ancho
        y1 = fila * cuadro_alto
        x2 = x1 + cuadro_ancho
        y2 = y1 + cuadro_alto

        cuadro_id = espacio['id_espacio']  # Usar id_espacio directamente
        espacio_info = espacios_dict.get(cuadro_id, None)
       # print(f"Fila: {fila}, Columna: {col}, cuadro_id: {cuadro_id}, espacio_info: {espacio_info}")  # Debugging

        if espacio_info:
            estado_espacio = espacio_info['estado']  # Obtener el estado del espacio
            placa_info = cfg.vehiculo_en_espacio.get(cuadro_id)
            placa = placa_info['matricula'] if placa_info and 'matricula' in placa_info else None
        else:
            estado_espacio = 'desconocido'
            placa = None

        # Dibujar el borde del cuadro
        cv2.rectangle(overlay, (x1, y1), (x2, y2), color_borde, thickness=3)

        # Ajustar tamaño y posición del cuadro de estado
        estado_cuadro_ancho = 100  # Ancho del cuadro de estado
        estado_cuadro_alto = 50  # Alto del cuadro de estado
        estado_x1 = x1 + 5
        estado_y1 = y1 + 5
        estado_x2 = estado_x1 + estado_cuadro_ancho
        estado_y2 = estado_y1 + estado_cuadro_alto

        # Color del cuadro de estado
        estado_color = (0, 0, 0)  # Negro
        #cv2.rectangle(overlay, (estado_x1, estado_y1), (estado_x2, estado_y2), estado_color, thickness=cv2.FILLED)

        # Determinar texto del estado
        if estado_espacio=='disponible':
            estado_texto='Disponible'
        elif estado_espacio == 'ocupado':
            estado_texto='Ocupado'
        elif estado_espacio == 'reservado':
            estado_texto='Reservado'
        elif estado_espacio == 'noDisponible':
            estado_texto='NoDisponible'


        color_texto = (255, 255, 255)  # Blanco
        cv2.putText(overlay, f'{estado_texto}', (estado_x1 + 10, estado_y1 + 30), cv2.FONT_HERSHEY_SIMPLEX, 1.5, color_texto, 2)

        if estado_espacio == 'ocupado':
            if placa is not None:
                cv2.putText(overlay, f'Placa: {placa}', (x1 + 10, y1 + cuadro_alto - 10), cv2.FONT_HERSHEY_SIMPLEX, 1.5, color_texto, 2)
            else:
                cv2.putText(overlay, 'Sin Placa', (x1 + 10, y1 + cuadro_alto - 10), cv2.FONT_HERSHEY_SIMPLEX, 1.5, color_texto, 2)

        # Guardar la información del cuadro en cfg.cuadros_info
        cfg.cuadros_info[cuadro_id] = {
            'coordenadas': (x1, y1, x2, y2),
            'estado': estado_espacio  # Guardar el estado en cuadros_info
        }

    # Combinar el overlay con el frame original
    frame_bgra = cv2.cvtColor(frame, cv2.COLOR_BGR2BGRA)
    combined = cv2.addWeighted(overlay, alpha_overlay, frame_bgra, 1.0, 0)

    if cfg.bandera_estado_Ant == False:
        cfg.estado_anterior = {cuadro_id: cuadro_info['estado'] for cuadro_id, cuadro_info in cfg.cuadros_info.items()}
        cfg.vehiculo_en_espacio = {cuadro_id: None for cuadro_id in cfg.cuadros_info}
        cfg.bandera_estado_Ant = True

    return combined



# Función para crear cuadros en el estacionamiento
def crearCuadrosEnEstacionamiento(frame, cuadros_x, cuadros_y, color_borde, alpha_overlay=0.6):


    height, width, _ = frame.shape
    overlay = np.zeros((height, width, 4), dtype='uint8')
    cuadro_ancho = width // cuadros_x
    cuadro_alto = height // cuadros_y
    cfg.cuadros_info = {}

    cuadro_id = 1
    for fila in range(cuadros_y):
        for col in range(cuadros_x):
            x1 = col * cuadro_ancho
            y1 = fila * cuadro_alto
            x2 = x1 + cuadro_ancho
            y2 = y1 + cuadro_alto
            cv2.rectangle(overlay, (x1, y1), (x2, y2), color_borde, thickness=3)
            cfg.cuadros_info[cuadro_id] = (x1, y1, x2, y2)
            cuadro_id += 1
            cfg.total_espacios+=1

    frame_bgra = cv2.cvtColor(frame, cv2.COLOR_BGR2BGRA)
    combined = cv2.addWeighted(overlay, alpha_overlay, frame_bgra, 1.0, 0)

    return combined

