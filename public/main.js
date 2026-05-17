// Information to reach API
const url = 'https://api.datamuse.com/words?';

// Selecting page elements
const inputField = document.querySelector('#input');
const topicField = document.querySelector('#topic');
const submit = document.querySelector('#submit');
const responseField = document.querySelector('#responseField');

// AJAX function
const getSuggestions = () => {
  const wordQuery = encodeURIComponent(inputField.value);
  const topicQuery = encodeURIComponent(topicField.value);
  const endpoint =`${url}rel_jjb=${wordQuery}&topic=${topicQuery}`;
  
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
