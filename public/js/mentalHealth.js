
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, options);

instances.open();
  });



  const adviceOutput = document.getElementById('resourceList')


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

// create drop down menu of feelings that narrows the list to match, displays no relsults in drop menu if none are in list
//takes selected feeling and returns matching value from object, get resources trigger modal
// when id.agree is clicked. use feelings.inner text to s
// 