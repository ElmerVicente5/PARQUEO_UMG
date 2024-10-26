import cv2

# Reemplaza con la URL que proporciona IP Webcam
#url = 'http://192.168.1.81:8080/video'

url = 'http://100.91.94.144:8080/video'

# Inicia la captura de video
cap = cv2.VideoCapture(url)

if not cap.isOpened():
    print("Error: No se pudo abrir la cámara.")
else:
    while True:
        # Captura cuadro a cuadro
        ret, frame = cap.read()

        if not ret:
            print("Error: No se pudo recibir el cuadro.")
            break

        # Muestra el cuadro en una ventana
        cv2.imshow('Camera Feed', frame)

        # Presiona 'q' para salir
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

# Libera la captura y cierra las ventanas
cap.release()
cv2.destroyAllWindows()
