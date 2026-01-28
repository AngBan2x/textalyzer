// file that configures the setups the database tables for the cloud (neon/render)
const { Client } = require('pg');

// CONNECTION STRING DE NEON
const connectionString = 'postgresql://neondb_owner:npg_LqjhKPt7E6Oy@ep-ancient-bonus-ae014sko-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const client = new Client({
  connectionString: connectionString,
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