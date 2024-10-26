from flask import Flask, render_template, Response
import cv2
from main import gestionar_espacios, detectar_vehiculos
from utils.websocket_client import SocketClient
import threading

app = Flask(__name__)
"""

# Ruta para mostrar el streaming del video de detección de vehículos
@app.route('/video_feed')
def video_feed():
    return Response(detectar_vehiculos(), mimetype='multipart/x-mixed-replace; boundary=frame')

"""
# Ruta para mostrar el streaming del video sin detección (o con la otra función generate_frames)
@app.route('/video_normal_feed')
def video_normal_feed():
    return Response(gestionar_espacios(), mimetype='multipart/x-mixed-replace; boundary=frame')

"""
# Página principal para ver el video de detección de vehículos
@app.route('/vehiculos')
def vehiculos():
    return render_template('vehiculos.html')
"""

# Página para ver el video normal (sin detección o con otra funcionalidad)
@app.route('/')
def index():
    return render_template('index.html')


def start_socket_client():
    # Crear una instancia del cliente SocketClient
    client = SocketClient("http://localhost:8001")
    # Iniciar la conexión
    client.connect()


if __name__ == "__main__":
    # Iniciar el cliente SocketIO en un hilo separado
    socket_thread = threading.Thread(target=start_socket_client)
    socket_thread.start()

    # Iniciar el servidor Flask
    app.run(debug=True)
