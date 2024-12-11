"use client"; 
import React, { useState } from 'react';
import axios from 'axios';

function page() {
  const [oracion, setOracion] = useState('');
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sujeto, setSujeto] = useState(null);  // Para almacenar el sujeto

  // Manejo del cambio de texto en el campo de entrada
  const handleInputChange = (event) => {
    setOracion(event.target.value);
  };

  // Manejo del envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResultados([]);
    setSujeto(null);  // Limpiar el sujeto en cada nuevo análisis

    try {
      // Enviar la oración al backend
      const response = await axios.post('http://localhost:5000/analizar', { oracion });
      
      // Si la respuesta es un array, establecer los resultados
      if (Array.isArray(response.data)) {
        setResultados(response.data);

        // Buscar el primer verbo en los resultados y considerar el sujeto como todo lo que viene antes
        const verboIndex = response.data.findIndex(item => item.etiqueta === 'VERB'|| item.etiqueta === 'AUX');
        if (verboIndex !== -1) {
          // El sujeto será todo lo que está antes del verbo
          const sujetoEncontrado = response.data.slice(0, verboIndex).map(item => item.palabra).join(' ');
          setSujeto(sujetoEncontrado);  // Guardamos el sujeto encontrado
        }
      } else {
        setError('Respuesta no válida del backend.');
      }
    } catch (err) {
      setError('Error al obtener los datos del servidor.');
    } finally {
      setLoading(false);
    }
  };

  // Conversión según la etiqueta de la palabra
  const convertirEtiqueta = (etiqueta, palabra) => {
    switch (etiqueta) {
      case 'M': // Número
        return `${palabra} es un número.`;
      case 'PART': // Partícula
        return `${palabra} es una partícula.`;
      case 'PRON': // Pronombre
        return `${palabra} es un pronombre.`;
      case 'PROPN': // Nombre propio
        return `${palabra} es un nombre propio.`;
      case 'PUNCT': // Puntuación
        return `${palabra} es un signo de puntuación.`;
      case 'VERB': // Verbo
        return `${palabra} es un verbo.`;
      case 'ADJ': // Adjetivo
        return `${palabra} es un adjetivo.`;
      case 'ADP': // Preposición
        return `${palabra} es una preposición.`;
      case 'DET': // Determinante
        return `${palabra} es un determinante.`;
      case 'NOUN': // Sustantivo
        return `${palabra} es un sustantivo.`;
      case 'AUX': // Verbo auxiliar
        return `${palabra} es un verbo auxiliar.`;
      case 'ADV': // Adverbio
        return `${palabra} es un adverbio.`;
      case 'NUM': // Número (en caso de que sea diferente de "M")
        return `${palabra} es un número.`;
      case 'CCONJ': // Conjunción coordinante
        return `${palabra} es una conjunción coordinante.`;
      case 'SCONJ': // Conjunción subordinante
        return `${palabra} es una conjunción subordinante.`;
      case 'INTJ': // Interjección
        return `${palabra} es una interjección.`;
      case 'SYM': // Símbolo
        return `${palabra} es un símbolo.`;
      case 'X': // Otras palabras no clasificadas
        return `${palabra} es una palabra desconocida o no clasificada.`;
      case 'SUJ': // Sujeto, solo se utilizará para mostrar el análisis
        return `${palabra} es el sujeto de la oración.`;
      default:
        return `${palabra} tiene una etiqueta desconocida (${etiqueta}).`;
    }
  };

  return (
    <div>
      <h1>Analizador de Oraciones</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={oracion}
          onChange={handleInputChange}
          placeholder="Escribe una oración"
          required
        />
        <button type="submit">Analizar</button>
      </form>

      {loading && <div>Loading...</div>}

      {error && <div>Error: {error}</div>}

      {/* Mostrar el sujeto si se ha encontrado */}
      {sujeto && (
        <div>
          <h3>Sujeto de la oración:</h3>
          <p><strong>{sujeto}</strong></p>
        </div>
      )}

      <div>
        {resultados.length > 0 ? (
          <ul>
            {resultados.map((item, index) => (
              <li key={index}>
                <strong>{item.palabra}</strong> ({item.etiqueta}): {convertirEtiqueta(item.etiqueta, item.palabra)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No se encontraron resultados.</p>
        )}
      </div>
    </div>
  );
}

export default page;
