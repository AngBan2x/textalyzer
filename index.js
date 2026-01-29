require('dotenv').config(); // para cargar las variables de entorno
const express = require('express'); // libreria a importar
const { Client } = require('pg'); // importar cliente de postgres
const app = express();
const port = process.env.PORT || 3000; // el puerto sera asignado por el de render o sera 3000

const processor = require('./textProcessor'); // importar modulo que procesa texto

// configuracion de la base de datos
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // para conectar con Neon de forma segura
    }
});

// conexion a la base de datos
client.connect()
    .then(() => console.log('Conectado a PostgreSQL en la nube :)'))
    .catch(err => console.error('Error de conexion a DB:', err));

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
            await client.query(insertQuery, [text, result.wordCount, result.mostCommonLetter]);
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
        const result = await client.query('SELECT * FROM analysis_history ORDER BY created_at DESC LIMIT 10');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({error: "Error obteniendo historial"});
    }
});

// Arrancar el servidor
app.listen(port, () => {
    console.log(`API escuchando en http://localhost:${port}`);
});