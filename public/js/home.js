//typewriter functionality
// array of words to be typed by the typewriter effect
const words = ["nauseous", "light headed", "fatigued", "congested"];

//initialize indices for the current word and character being typed
let wordIndex = 0;
let charIndex = 0;

//created variable to track if the typewriter is currently deleting characters
let isDeleting = false;

//function for typewriter effect
function type() {
  //gets the current word from the array
  const word = words[wordIndex];

  //sets typing speed based on if characters are being deleted or added
  const speed = isDeleting ? 100 : 200;

  //checks if characters are still being added to the word
  if (!isDeleting && charIndex < word.length) {
    //appends the next character to the displayed text
    document.getElementById('typewriter').textContent += word.charAt(charIndex);
    charIndex++;
  } 
  //checks if characters are being deleted
  else if (isDeleting && charIndex > 0) {
    // Remove the last character from the displayed text
    document.getElementById('typewriter').textContent = word.substring(0, charIndex - 1);
    charIndex--;
  } 
  //when a word is fully typed or deleted, switch to the next word
  else {
    isDeleting = !isDeleting;

    //if characters are being deleted, move to the next word in the array
    if (isDeleting) {
      wordIndex = (wordIndex + 1) % words.length;
    }
  }

  //schedules the next iteration of the typing function
  setTimeout(type, speed);
}

//starts the typewriter effect
type();

//materialize carousel functionality
  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.carousel');
    var instances = M.Carousel.init(elems);

});