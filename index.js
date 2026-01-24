const express = require('express'); // Importamos la librería
const app = express();
const port = 3000;

// impportar modulo que procesa texto
const processor = require('./textProcessor');

// Middleware: Permite que nuestra API entienda JSON en el cuerpo de la petición
app.use(express.json());

// Endpoint POST: Recibe datos y procesa
app.post('/analyze', (req, res) => {
    const text = req.body.text || ""; // Obtenemos el texto del JSON
    
    // llamar al procesador de texto proveniente de textProcessor
    const result = processor.analyzeText(text);

    // retornar los datos en json
    res.json(result);
    
});

// Arrancar el servidor
app.listen(port, () => {
    console.log(`🚀 API escuchando en http://localhost:${port}`);
});