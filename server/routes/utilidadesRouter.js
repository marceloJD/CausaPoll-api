const express = require('express');
const router = express.Router();

// Ruta de utilidad para verificar si el servidor responde
router.get('/ping', (req, res) => {
    res.status(200).json({ message: 'pong' });
});

module.exports = router;
