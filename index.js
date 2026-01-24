const express = require('express'); // Importamos la librería
const app = express();
const port = 3000;

// Middleware: Permite que nuestra API entienda JSON en el cuerpo de la petición
app.use(express.json());

// Endpoint POST: Recibe datos y procesa
app.post('/analyze', (req, res) => {
    const text = req.body.text || ""; // Obtenemos el texto del JSON
    
    // 1. Lógica DSA: Conteo de palabras
    // Split por espacios. Filter elimina strings vacíos por espacios dobles
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;

    // 2. Lógica DSA: Frecuencia de caracteres (Hash Map)
    // En C++: std::unordered_map<char, int> freq;
    const charFrequency = {};
    let maxCount = 0;
    let mostCommonChar = ' ';
    
    for (let char of text) {
        if (char.match(/[a-z]/i)) { // Solo letras, ignoramos signos
            const lowerChar = char.toLowerCase();
            // Si existe suma 1, si no, inicializa en 1
            charFrequency[lowerChar] = (charFrequency[lowerChar] || 0) + 1;
            
        }
    }

    for (let char in charFrequency) {
        // buscar el caracter mas repetido
        if (charFrequency[char] > maxCount) {
            maxCount = charFrequency[char];
            mostCommonChar = char;
        }
    }

    // Devolvemos la respuesta en JSON
    res.json({
        originalLength: text.length,
        wordCount: wordCount,
        mostFrequentChars: charFrequency,
        mostCommonLetter: mostCommonChar
    });
});

// Arrancar el servidor
app.listen(port, () => {
    console.log(`🚀 API escuchando en http://localhost:${port}`);
});