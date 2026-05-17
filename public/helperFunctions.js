// Formats response to look presentable on webpage
const renderResponse = (res) => {
  // in case res comes back as a blank array
  if(!res || !res.length){
    responseField.innerHTML = "<p>Try again!</p><p>There were no suggestions found!</p>"
    return
  }

  // creating an array to contain the HTML strings
  let wordList = []
  // looping through the response
  for(let i = 0; i < res.length; i++){
    const word = res[i];
    let wordDetails = `<div class="word-item" data-word="${word.word}">`;
    wordDetails += `<div class="word-main">${word.word}</div>`;
    
    // Add definitions if available
    if (word.defs && word.defs.length > 0) {
      wordDetails += `<div class="word-definitions"><strong>Definitions:</strong><ul>`;
      word.defs.forEach(def => {
        wordDetails += `<li>${def}</li>`;
      });
      wordDetails += `</ul></div>`;
    }
    
    // Add part of speech if available
    if (word.tags) {
      const posTags = word.tags.filter(tag => ['n', 'v', 'adj', 'adv'].includes(tag));
      if (posTags.length > 0) {
        const posMap = { 'n': 'Noun', 'v': 'Verb', 'adj': 'Adjective', 'adv': 'Adverb' };
        wordDetails += `<div class="word-pos"><strong>Part of Speech:</strong> ${posTags.map(t => posMap[t]).join(', ')}</div>`;
      }
    }
    
    // Add syllable count if available
    if (word.numSyllables !== undefined) {
      wordDetails += `<div class="word-syllables"><strong>Syllables:</strong> ${word.numSyllables}</div>`;
    }
    
    // Add pronunciation if available
    if (word.tags) {
      const pronTags = word.tags.filter(tag => tag.startsWith('pron:'));
      if (pronTags.length > 0) {
        const pronunciation = pronTags[0].replace('pron:', '');
        wordDetails += `<div class="word-pronunciation"><strong>Pronunciation:</strong> ${pronunciation}</div>`;
      }
    }
    
    // Add frequency if available
    if (word.tags) {
      const freqTags = word.tags.filter(tag => tag.startsWith('f:'));
      if (freqTags.length > 0) {
        const frequency = freqTags[0].replace('f:', '');
        wordDetails += `<div class="word-frequency"><strong>Frequency:</strong> ${frequency} per million</div>`;
      }
    }
    
    wordDetails += `</div>`;
    wordList.push(`<li>${wordDetails}</li>`);
  }
 
  // joins the array of HTML strings into one string
  wordList = wordList.join("")

  // manipulates responseField to render the modified response
  responseField.innerHTML = `<p>You might be interested in:</p><ol>${wordList}</ol>`
  
  // Add click event listeners to word items for details panel
  document.querySelectorAll('.word-item').forEach(item => {
    item.addEventListener('click', () => {
      showWordDetails(item.dataset.word, res.find(w => w.word === item.dataset.word));
    });
  });
  
  return
}

// Show word details in a modal/panel
const showWordDetails = (word, wordData) => {
  const detailsPanel = document.createElement('div');
  detailsPanel.className = 'word-details-panel';
  detailsPanel.innerHTML = `
    <div class="details-content">
      <button class="close-details">&times;</button>
      <h3>${word}</h3>
      ${wordData.defs && wordData.defs.length > 0 ? `
        <div class="detail-section">
          <h4>Definitions</h4>
          <ul>${wordData.defs.map(d => `<li>${d}</li>`).join('')}</ul>
        </div>
      ` : ''}
      ${wordData.tags ? `
        <div class="detail-section">
          <h4>Details</h4>
          ${wordData.tags.filter(t => ['n', 'v', 'adj', 'adv'].includes(t)).length > 0 ? 
            `<p><strong>Part of Speech:</strong> ${wordData.tags.filter(t => ['n', 'v', 'adj', 'adv'].includes(t)).join(', ')}</p>` : ''}
          ${wordData.numSyllables !== undefined ? `<p><strong>Syllables:</strong> ${wordData.numSyllables}</p>` : ''}
          ${wordData.tags.filter(t => t.startsWith('pron:')).length > 0 ? 
            `<p><strong>Pronunciation:</strong> ${wordData.tags.filter(t => t.startsWith('pron:'))[0].replace('pron:', '')}</p>` : ''}
          ${wordData.tags.filter(t => t.startsWith('f:')).length > 0 ? 
            `<p><strong>Frequency:</strong> ${wordData.tags.filter(t => t.startsWith('f:'))[0].replace('f:', '')} per million</p>` : ''}
        </div>
      ` : ''}
    </div>
  `;
  
  responseField.appendChild(detailsPanel);
  
  // Close button functionality
  detailsPanel.querySelector('.close-details').addEventListener('click', () => {
    detailsPanel.remove();
  });
  
  // Close when clicking outside
  detailsPanel.addEventListener('click', (e) => {
    if (e.target === detailsPanel) {
      detailsPanel.remove();
    }
  });
};