
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, options);

instances.open();
  });



let i = 0;
let placeholder = "";
const words = ["Depressed...", "Overwhelmed...", "Anxious...", "Frustrated...", "Manic...", "Alone...", "Guilty..."];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
  const word = words[wordIndex];
  const speed = isDeleting ? 120 : 200;

  if (!isDeleting && charIndex < word.length) {
    placeholder += word.charAt(charIndex);
    charIndex++;
  } else if (isDeleting && charIndex > 0) {
    placeholder = placeholder.slice(0, -1);
    charIndex--;
  } else {
    isDeleting = !isDeleting;

    if (isDeleting) {
      wordIndex = (wordIndex + 1) % words.length;
    }
  }

  document.getElementById("feeling").setAttribute("placeholder", placeholder);

  setTimeout(type, speed);
}

type();