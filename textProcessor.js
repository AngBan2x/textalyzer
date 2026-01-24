// a simple text analyzer that gives information on char count, word count, and the most common char

function analyzeText(text) {
    // word count
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;

    // char count (frequency) using hash maps
    const charFrequency = {};
    for (let char of text) {
        if (char.match(/[a-z]/i)) { // Solo letras, ignoramos signos
            const lowerChar = char.toLowerCase();
            // Si existe suma 1, si no, inicializa en 1
            charFrequency[lowerChar] = (charFrequency[lowerChar] || 0) + 1;
            
        }
    }

    // search for the most common char
    let maxCount = 0;
    let mostCommonChar = ' ';
    for (let char in charFrequency) {
        // buscar el caracter mas repetido
        if (charFrequency[char] > maxCount) {
            maxCount = charFrequency[char];
            mostCommonChar = char;
        }
    }

    // return information in hash map so it can be formatted in json
    return {
        originalLength: text.length,
        wordCount: wordCount,
        mostFrequentChars: charFrequency,
        mostCommonLetter: mostCommonChar
    }
}

// export the function so other programs/scripts can use it
module.exports = {analyzeText};