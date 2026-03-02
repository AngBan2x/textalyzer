// Funcionalidad de JS para index.html y styles.css
// Función 1: Analizar texto
async function analyze() {
    const text = document.getElementById('inputText').value;
    const resultsDiv = document.getElementById('results');

    if (!text.trim()) {
        alert("Please enter some text!");
        return;
    }

    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text })
        });

        if (!response.ok) throw new Error('Network error');

        const data = await response.json();

        document.getElementById('charCount').textContent = data.originalLength;
        document.getElementById('wordCount').textContent = data.wordCount;
        document.getElementById('commonLetter').textContent = `"${data.mostCommonLetter}"`;
        
        resultsDiv.style.display = 'block';

    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong connecting to the server.');
    }
}

// Función 2: Cargar historial
async function loadHistory() {
    const historyDiv = document.getElementById('historySection');
    const historyList = document.getElementById('historyList');

    try {
        const response = await fetch('/history');
        const data = await response.json();

        historyList.innerHTML = '';

        if (data.length === 0) {
            historyList.innerHTML = '<p>No history found yet. Analyze some text first!</p>';
        } else {
            data.forEach(item => {
                const previewText = item.original_text.length > 60 
                    ? item.original_text.substring(0, 60) + '...' 
                    : item.original_text;

                const card = document.createElement('div');
                card.className = 'history-card';
                card.innerHTML = `
                    <div class="history-text">"${previewText}"</div>
                    <div class="history-stats">
                        <span><strong>Words:</strong> ${item.word_count}</span>
                        <span><strong>Top Char:</strong> '${item.most_common_char}'</span>
                    </div>
                `;
                historyList.appendChild(card);
            });
        }
        
        historyDiv.style.display = 'block';

    } catch (error) {
        console.error('Error loading history:', error);
        alert('Could not load history from the database.');
    }
}