require('dotenv').config(); // para cargar las variables de entorno
const express = require('express'); // libreria a importar
const { Pool } = require('pg'); // importar cliente de postgres
const app = express();
const port = process.env.PORT || 3000; // el puerto sera asignado por el de render o sera 3000

const processor = require('./textProcessor'); // importar modulo que procesa texto

// configuracion de la base de datos
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // para conectar con Neon de forma segura
    },
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});

// conexion a la base de datos
pool.on('error', (err, client) => {
    console.error('Error inesperado en el clientes de PostgreSQL', err);
    // se deja que el pool lo maneje
})

app.use(express.static('public')); // indicar que existen archivos estaticos
app.use(express.json()); // Middleware: para entender JSON en el cuerpo de la petición

app.post('/analyze', async (req, res) => { // async para esperar a la db
    const text = req.body.text || ""; // obtener el texto del JSON
    
    // llamar al procesador de texto proveniente de textProcessor
    const result = processor.analyzeText(text);

    // guardar en la base de datos
    try {
        if (text.length > 0) {
            const insertQuery = `
                INSERT INTO analysis_history (original_text, word_count, most_common_char)
                VALUES ($1, $2, $3)
                `;
                // usar parametros ($1, $2) para evitar inyeccion SQL
            await pool.query(insertQuery, [text, result.wordCount, result.mostCommonLetter]);
            console.log(':) Analisis guardado en DB');
        }
    } catch (err) {
        console.error(":( Error guardando en DB:", err);
        // no se detiene la respuesta si falla la DB, solo se avisa por consola
    }

    // retornar los datos en json
    res.json(result);
});

// nuevo endpoint: ver historial (opcional, para probar)
app.get('/history', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM analysis_history ORDER BY created_at DESC LIMIT 10');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({error: "Error obteniendo historial"});
    }
});

// Arrancar el servidor
app.listen(port, () => {
    console.log(`API escuchando en http://localhost:${port}`);
});