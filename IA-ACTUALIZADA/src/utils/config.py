from sympy import false

# Clases permitidas (vehículos)
clases_permitidas = ['car', 'motorcycle', 'bus', 'truck']
# config.py
placas_procesadas = {}
vehiculos_a_procesar = []
posiciones_Matricula = {}
cuadros_info = {}
tracks = []
# Diccionario para almacenar las posiciones de los cuadros
cuadros_estacionamiento = {}
espacios_disponibles=0
espacios_reservados=0
estado_anterior={}
vehiculo_en_espacio={}
espacios=[]

bandera_estado_Ant=False

