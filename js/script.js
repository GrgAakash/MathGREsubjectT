// Load js-yaml
const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js';
document.head.appendChild(script);

script.onload = function() {
    fetch('/_data/questions.yml')
        .then(response => response.text())
        .then(data => {
            const questionsData = jsyaml.load(data);
            const searchBar = document.querySelector('.search-bar');
            const searchContainer = document.querySelector('.search-container');
            const resultsContainer = document.createElement('div');
            resultsContainer.className = 'search-results';
            searchContainer.appendChild(resultsContainer);

            searchBar.addEventListener('input', function(e) {
                const searchValue = e.target.value.toLowerCase();
                const cards = document.querySelectorAll('.category-card');
                
                // Filter category cards
                cards.forEach(card => {
                    const title = card.querySelector('h3').textContent.toLowerCase();
                    const description = card.querySelector('p').textContent.toLowerCase();
                    card.style.display = (title.includes(searchValue) || description.includes(searchValue)) ? 'block' : 'none';
                });

                // Filter questions
                resultsContainer.innerHTML = '';
                let matchingQuestions = [];
                questionsData.forEach(category => {
                    category.questions.forEach(q => {
                        if (q.question.toLowerCase().includes(searchValue) || 
                            q.tags.some(tag => tag.toLowerCase().includes(searchValue))) {
                            matchingQuestions.push({ category: category.category, ...q });
                        }
                    });
                });

                if (matchingQuestions.length === 0) {
                    resultsContainer.innerHTML = '<p>No questions found.</p>';
                } else {
                    matchingQuestions.forEach(q => {
                        const result = document.createElement('div');
                        result.innerHTML = `<p><strong>${q.category}</strong>: ${q.question}</p><p><strong>Answer:</strong> ${q.answer}</p><p><strong>Explanation:</strong> ${q.explanation}</p>`;
                        resultsContainer.appendChild(result);
                    });
                }
            });
        });
};