const express = require('express');
const repository = require('../repositories/EncuestaMejoradaRepository')


module.exports = (io) => {
  const router = express.Router();

  router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const encuesta = await repository.findById(id)

      if (!encuesta) {
        return res.status(404).json({ error: "Encuesta no encontrada" });
      }

      res.json(encuesta);
    } catch (error) {
      console.error("Error buscando encuesta:", error);
      res.status(500).json({ error: "Error en el servidor" });
    }
  });

  // Crear nueva encuesta
router.post('/', async (req, res) => {
  try {
    // lo que manda el cliente en el body
    const nuevaEncuesta = req.body;
    console.log("Body recibido:", nuevaEncuesta);

    // insertamos en el repo
    const encuestaCreada = await repository.insertRespuesta(nuevaEncuesta);

    res.status(201).json(encuestaCreada);
  } catch (error) {
    console.error("Error insertando encuesta:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

  return router;
};

 