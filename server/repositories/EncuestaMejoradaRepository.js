const { connectDB } = require("../db/MogoClient");

async function findById(id) {
  const db = await connectDB();
  return db.collection("Encuesta_mejorada").findOne({ id });
}

async function insertRespuesta(respuesta) {
  const db = await connectDB();
  const result = await db.collection("Respuesta_encuesta_mejorada")
    .insertOne(respuesta);
  // Devuelve el documento insertado con su _id generado
  return result.ops ? result.ops[0] : { ...respuesta, _id: result.insertedId };
}
module.exports = { findById ,insertRespuesta};