// utils/encuestasStore.js

const MAX_ENCUESTAS = 100;
const encuestas = {};

// Agrega una nueva encuesta (si hay espacio disponible)
function agregarEncuesta(id, encuesta) {
  if (Object.keys(encuestas).length >= MAX_ENCUESTAS) {
    return false; // Límite alcanzado
  }

  encuestas[id] = encuesta;

  // Eliminar automáticamente cuando expire
  setTimeout(() => {
    eliminarEncuesta(id);
  }, encuesta.duracionSegundos * 1000);

  return true;
}

// Obtiene una encuesta sin exponer los votos (modo público)
function obtenerEncuestaPublica(id) {
  const encuesta = encuestas[id];
  if (!encuesta) return null;

  const tiempoRestante = Math.max(0, Math.floor((encuesta.expiraEn - Date.now()) / 1000));
  const expirada = tiempoRestante === 0;

  return {
    id: encuesta.id,
    titulo: encuesta.titulo,
    pregunta: encuesta.pregunta,
    opciones: encuesta.opciones.map(o => ({ texto: o.texto })), // Sin votos
    tiempoRestante,
    expirada
  };
}

// Obtiene una encuesta con los votos (modo administrador/resultados)
function obtenerEncuestaConVotos(id,key) {
  const encuesta = encuestas[id];
  if (!encuesta) return null;

  if(encuesta.key!=key) return null;

  const tiempoRestante = Math.max(0, Math.floor((encuesta.expiraEn - Date.now()) / 1000));
  const expirada = tiempoRestante === 0;

  return {
    id: encuesta.id,
    titulo: encuesta.titulo,
    pregunta: encuesta.pregunta,
    opciones: encuesta.opciones, // Con votos
    tiempoRestante,
    expirada
  };
}
function obtener(id) {
  const encuesta = encuestas[id];
  if (!encuesta) return null;


  const tiempoRestante = Math.max(0, Math.floor((encuesta.expiraEn - Date.now()) / 1000));
  const expirada = tiempoRestante === 0;

  return {
    id: encuesta.id,
    titulo: encuesta.titulo,
    pregunta: encuesta.pregunta,
    opciones: encuesta.opciones, // Con votos
    tiempoRestante,
    expirada
  };
}

// Suma un voto a una opción específica
function votar(id, opcionIndex) {
  const encuesta = encuestas[id];
  if (!encuesta || opcionIndex < 0 || opcionIndex >= encuesta.opciones.length) {
    return false;
  }

  encuesta.opciones[opcionIndex].votos += 1;
  return true;
}

// Elimina una encuesta manualmente
function eliminarEncuesta(id) {
  delete encuestas[id];
}

// ALL
function all() {
  return encuestas;
}

// Exportamos las funciones
module.exports = {
  agregarEncuesta,
  obtenerEncuestaPublica,
  obtener,
  obtenerEncuestaConVotos,
  votar,
  eliminarEncuesta,
  all
};
