const { connectDB } = require("../db/MogoClient");

async function findById(id) {
  const db = await connectDB();
  return db.collection("Encuesta_mejorada").findOne({ id });
}

module.exports = { findById };