const express = require('express'); // libreria a importar
const app = express();
const port = 3000;

const processor = require('./textProcessor'); // importar modulo que procesa texto
app.use(express.static('public')); // indicar que existen archivos estaticos
app.use(express.json()); // Middleware: para entender JSON en el cuerpo de la petición

// Endpoint POST: Recibe datos y procesa
app.post('/analyze', (req, res) => {
    const text = req.body.text || ""; // obtener el texto del JSON
    
    // llamar al procesador de texto proveniente de textProcessor
    const result = processor.analyzeText(text);

    // retornar los datos en json
    res.json(result);
});

// Arrancar el servidor
app.listen(port, () => {
    console.log(`🚀 API escuchando en http://localhost:${port}`);
});