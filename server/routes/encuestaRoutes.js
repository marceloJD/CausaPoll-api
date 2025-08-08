
const express = require('express');
const generarCodigo = require('../utils/generarCodigo');
const encuestas = require('../utils/encuestasStore');

module.exports = (io) => {
  const router = express.Router();

  // Crear una nueva encuesta
  router.post('/', (req, res) => {
    console.log("/")
    console.log(req.body)
    const { titulo, pregunta, opciones, duracionSegundos } = req.body;

    if (!titulo || !pregunta || !Array.isArray(opciones) || opciones.length < 2) {
      return res.status(400).json({ error: 'Datos inválidos' });
    }

    const id = generarCodigo(20);
    const key = generarCodigo(20);

    const encuesta = {
      id,
      key,
      titulo,
      pregunta,
      opciones: opciones.map((texto) => ({ texto, votos: 0 })),
      creadaEn: Date.now(),
      expiraEn: Date.now() + (duracionSegundos * 1000),
      duracionSegundos
    };

    const ok = encuestas.agregarEncuesta(id, encuesta, duracionSegundos);

    if (!ok) {
      return res.status(429).json({ error: 'Se alcanzó el límite máximo de encuestas activas' });
    }

    res.json({ id, key, link: `/encuesta/${id}` });
  });

  // Obtener encuesta sin votos
  router.get('/:id', (req, res) => {
    console.log("/:id")
    console.log(req.params)
    console.log(req.query)
    const id = req.params.id;
    const encuesta = encuestas.obtenerEncuestaPublica(id);

    if (!encuesta) {
      return res.status(404).json({ error: 'Encuesta no encontrada o expirada' });
    }

    res.json(encuesta);
  });

  // Consultar encuesta con votos (requiere clave)
  router.get('/:id/avance', (req, res) => {
    console.log("/:id/avance")
    console.log(req.params)
    console.log(req.query)
    const id = req.params.id;
    const { key } = req.query;

    const encuesta = encuestas.obtenerEncuestaConVotos(id, key);

    if (!encuesta) {
      return res.status(403).json({ error: 'Clave inválida o encuesta no encontrada' });
    }

    res.json(encuesta);
  });

  // Participar en una encuesta , con salida por socket
  router.post('/:id/votar', (req, res) => {
    console.log("/:id/votar")
    console.log(req.params)
    console.log(req.query)
    console.log(req.body)

    const id = req.params.id;
    const { opcion } = req.body;
    
    const resultado = encuestas.votar(id, opcion); // booleano

    if (resultado) {
      const encuesta = encuestas.obtener(id);
      io.to(id).emit('voto', encuesta.opciones);

      return res.json({ mensaje: 'Voto registrado', exito: true });
    }

    res.status(400).json({ mensaje: 'Ocurrió un error al votar', exito: false });
  });

  // ALL
  router.get('/', (req, res) => {
    console.log("ALL")   
    const resultado = encuestas.all(); // booleano
    if (resultado) {
      return res.json({ mensaje: 'JAJAJAJAJA ya no esta disponible crack, sigue intentando....', exito: true });
    }

    res.status(400).json({ mensaje: 'ERROR', exito: false });
  });

  return router;
};
