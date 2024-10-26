import socketio
from . import config as cfg
class SocketClient:
    def __init__(self, url):
        self.sio = socketio.Client()
        self.url = url

        # Vincular los eventos
        self.sio.on('connect', self.on_connect)
        self.sio.on('disconnect', self.on_disconnect)
        self.sio.on('estadoParqueo', self.on_estado_parqueo)

    def on_connect(self):
        print("Conexión establecida")

    def on_disconnect(self):
        print("Desconectado del servidor")

    def on_estado_parqueo(self, data):
        print("Estado de parqueo recibido:", data)
        espacios = data
        cfg.espacios= espacios
        #print("espacios en cfg: ", cfg.espacios)
        cfg.total_espacios= len(espacios)


    def connect(self):
        self.sio.connect(self.url)
        self.sio.wait()

    def disconnect(self):
        self.sio.disconnect()

# Si quieres probar la clase directamente en este archivo:
if __name__ == "__main__":
    client = SocketClient("http://localhost:8001")
    client.connect()
