const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
//require('dotenv').config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Sockets
const encuestaRoutes = require('./routes/encuestaRoutes')(io);
const encuestaMejoradaRouter = require("./routes/encuestaMejoradasRoutes")(io)
const utilidadesRoutes = require('./routes/utilidadesRouter');
const configurarSockets = require('./sockets/encuestaSocket');

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/encuestas', encuestaRoutes);
app.use('/api/utilidades', utilidadesRoutes);
app.use('/api/encuestaMejorada',encuestaMejoradaRouter)

// Sockets
configurarSockets(io);

// Arrancar servidor
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando ya :${PORT}`);
});
