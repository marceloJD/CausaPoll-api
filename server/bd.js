require('dotenv').config();
const mongoose = require('mongoose');
console.log("🔎 process.env.MONGO_URI:", process.env.MONGO_URI);

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

module.exports = conectarDB;