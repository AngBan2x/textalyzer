// file that configures the setups the database tables for the cloud (neon/render)
require('dotenv').config(); // for environment variables
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {rejectUnauthorized: false}
});

async function createTable() {
  try {
    await client.connect();
    // Creamos una tabla simple: ID, Texto original, y fecha
    const query = `
      CREATE TABLE IF NOT EXISTS analysis_history (
        id SERIAL PRIMARY KEY,
        original_text TEXT,
        word_count INT,
        most_common_char CHAR(1),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await client.query(query);
    console.log("Tabla 'analysis_history' creada con éxito!");
  } catch (err) {
    console.error("Error creando tabla:", err);
  } finally {
    await client.end();
  }
}

createTable();