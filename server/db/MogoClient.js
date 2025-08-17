const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

let db;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db(process.env.MONGO_BD); // 👈 tu base real
    console.log("✅ Mongo conectado");
  }
  return db;
}

module.exports = { connectDB };