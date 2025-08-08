const encuestasStore = require('../utils/encuestasStore');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('🟢 Cliente conectado:', socket.id);

    // Variable para guardar el temporizador
    let timeoutDesconexion;

    socket.on('unirse-a-encuesta', ({ id, clave }) => {
      console.log({ id, clave });

      const encuesta = encuestasStore.obtenerEncuestaConVotos(id, clave);

      if (!encuesta) {
        console.log(`📡 Cliente ${socket.id} no se unió a la sala de encuesta ${id}, por no encontrarla o la clave....`);
        socket.emit('error-autenticacion', 'Encuesta no encontrada o clave incorrecta');
        socket.disconnect(true); // ❌ Matar la conexión inmediatamente
        return;
      }

      socket.join(id);
      console.log(`📡 Cliente ${socket.id} se unió a la sala de encuesta ${id}`);
      socket.emit('unido-a-encuesta', 'Conexión exitosa');

      // ✅ Programar desconexión forzada en 30 minutos
      timeoutDesconexion = setTimeout(() => {
        console.log(`⏱️ Cliente ${socket.id} fue desconectado tras 30 minutos`);
        socket.emit('desconexion-programada', 'Se cerró la sesión por límite de tiempo');
        socket.disconnect(true);
      }, 30 * 60 * 1000); // 30 minutos en ms
    });

    socket.on('disconnect', () => {
      console.log('🔴 Cliente desconectado:', socket.id);

      // ✅ Limpiar el temporizador si existe
      if (timeoutDesconexion) {
        clearTimeout(timeoutDesconexion);
      }
    });
  });
};
