from flask import Flask, request, jsonify
import stanza
from flask_cors import CORS

# Inicializar el modelo de Stanza para español
stanza.download('es')
nlp = stanza.Pipeline('es')

# Crear la aplicación Flask
app = Flask(__name__)

# Habilitar CORS para que el frontend pueda hacer solicitudes
CORS(app)

# Ruta para procesar el texto
@app.route('/analizar', methods=['POST'])
def analizar():
    # Obtener el texto desde el cuerpo de la solicitud
    data = request.get_json()
    text = data.get('oracion', '')  # Se asume que el JSON tiene la clave 'oracion'

    if not text:
        return jsonify({"error": "No se proporcionó texto"}), 400

    # Procesar el texto con Stanza
    doc = nlp(text)

    # Crear una lista de resultados con las palabras y sus etiquetas
    resultados = []
    for sentence in doc.sentences:
        for word in sentence.words:
            resultados.append({
                'palabra': word.text,
                'etiqueta': word.upos
            })

    # Devolver los resultados como JSON
    return jsonify(resultados)

# Iniciar la aplicación
if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Asegúrate de usar el puerto correcto
