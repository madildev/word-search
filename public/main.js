// Information to reach API
const wordsurl = 'https://api.datamuse.com/words?';
const suggestionsUrl = 'https://api.datamuse.com/sug?';

// Selecting page elements
const inputField = document.querySelector('#input');
const topicField = document.querySelector('#topic');
const searchModeField = document.querySelector('#search-mode');
const leftContextField = document.querySelector('#left-context');
const rightContextField = document.querySelector('#right-context');
const resultCountField = document.querySelector('#result-count');
const resultCountValue = document.querySelector('#result-count-value');
const showDefinitions = document.querySelector('#show-definitions');
const showPos = document.querySelector('#show-pos');
const showSyllables = document.querySelector('#show-syllables');
const showPronunciation = document.querySelector('#show-pronunciation');
const showFrequency = document.querySelector('#show-frequency');
const spanishVocab = document.querySelector('#spanish-vocab');
const submit = document.querySelector('#submit');
const responseField = document.querySelector('#responseField');
const autocompleteList = document.querySelector('#autocomplete-list');

// Update result count display
resultCountField.addEventListener('input', () => {
  resultCountValue.textContent = resultCountField.value;
});

// Build metadata flags
const buildMetadataFlags = () => {
  let flags = '';
  if (showDefinitions.checked) flags += 'd';
  if (showPos.checked) flags += 'p';
  if (showSyllables.checked) flags += 's';
  if (showPronunciation.checked) flags += 'r';
  if (showFrequency.checked) flags += 'f';
  return flags;
};

// Build API endpoint dynamically
const buildEndpoint = () => {
  const wordQuery = encodeURIComponent(inputField.value.trim());
  const topicQuery = encodeURIComponent(topicField.value.trim());
  const leftContext = encodeURIComponent(leftContextField.value.trim());
  const rightContext = encodeURIComponent(rightContextField.value.trim());
  const searchMode = searchModeField.value;
  const maxResults = resultCountField.value;
  const metadata = buildMetadataFlags();
  const vocab = spanishVocab.checked ? 'es' : 'en';
  
  let params = '';
  
  // Handle different search modes
  if (searchMode === 'rhyme') {
    // Rhyme finder - use sp with pattern
    params = `sp=${wordQuery}*&max=${maxResults}`;
  } else if (searchMode === 'sl') {
    // Sounds like
    params = `sl=${wordQuery}&max=${maxResults}`;
  } else if (searchMode === 'sp') {
    // Spelled like (wildcards)
    params = `sp=${wordQuery}&max=${maxResults}`;
  } else if (searchMode === 'ml') {
    // Means like (reverse dictionary)
    params = `ml=${wordQuery}&max=${maxResults}`;
  } else {
    // All relation-based searches
    params = `${searchMode}=${wordQuery}&max=${maxResults}`;
  }
  
  // Add topic if provided
  if (topicQuery) {
    params += `&topics=${topicQuery}`;
  }
  
  // Add context hints if provided
  if (leftContext) {
    params += `&lc=${leftContext}`;
  }
  if (rightContext) {
    params += `&rc=${rightContext}`;
  }
  
  // Add metadata flags if any
  if (metadata) {
    params += `&md=${metadata}`;
  }
  
  // Add vocabulary parameter
  if (vocab === 'es') {
    params += '&v=es';
  }
  
  return `${wordsurl}${params}`;
};

// AJAX function
const getSuggestions = () => {
  const endpoint = buildEndpoint();
  
  const xhr = new XMLHttpRequest();
  xhr.responseType = 'json';

  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      renderResponse(xhr.response);
    }
  }
  
  xhr.open('GET', endpoint);
  xhr.send();
}

// Autocomplete function
const getAutocompleteSuggestions = (query) => {
  if (query.length < 2) {
    autocompleteList.classList.remove('active');
    autocompleteList.innerHTML = '';
    return;
  }
  
  const endpoint = `${suggestionsUrl}s=${encodeURIComponent(query)}&max=10`;
  
  const xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      displayAutocomplete(xhr.response);
    }
  };
  
  xhr.open('GET', endpoint);
  xhr.send();
};

// Display autocomplete suggestions
const displayAutocomplete = (suggestions) => {
  autocompleteList.innerHTML = '';
  
  if (!suggestions || suggestions.length === 0) {
    autocompleteList.classList.remove('active');
    return;
  }
  
  suggestions.forEach(suggestion => {
    const item = document.createElement('div');
    item.className = 'autocomplete-item';
    item.textContent = suggestion.word;
    item.addEventListener('click', () => {
      inputField.value = suggestion.word;
      autocompleteList.classList.remove('active');
      autocompleteList.innerHTML = '';
    });
    autocompleteList.appendChild(item);
  });
  
  autocompleteList.classList.add('active');
};

// Debounce function for autocomplete
let debounceTimer;
const debounceAutocomplete = (query) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    getAutocompleteSuggestions(query);
  }, 300);
};

// Add autocomplete event listener
inputField.addEventListener('input', () => {
  debounceAutocomplete(inputField.value);
});

// Close autocomplete when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.input-group')) {
    autocompleteList.classList.remove('active');
  }
});

// Clear previous results and display results to webpage
const displaySuggestions = (event) => {
  event.preventDefault();
  
  // Validation: Check if word input is empty
  if (!inputField.value.trim()) {
    responseField.innerHTML = '<p style="color: #ef6b68; font-weight: 600;">⚠️ Please enter a word to search!</p>';
    return;
  }
  
  while(responseField.firstChild){
    responseField.removeChild(responseField.firstChild);
  }
  getSuggestions();
}

// Handle example button clicks
const handleExampleClick = (event) => {
  const word = event.target.dataset.word;
  const topic = event.target.dataset.topic;
  
  if (word && topic) {
    inputField.value = word;
    topicField.value = topic;
    
    // Clear previous results
    while(responseField.firstChild){
      responseField.removeChild(responseField.firstChild);
    }
    
    getSuggestions();
  }
}

// Add event listeners
submit.addEventListener('click', displaySuggestions);

// Add event listeners to example buttons
document.querySelectorAll('.example-btn').forEach(btn => {
  btn.addEventListener('click', handleExampleClick);
});
