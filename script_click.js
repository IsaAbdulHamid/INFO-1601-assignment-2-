let localprofile;

function loaddata() {
  if (localStorage.getItem("localprofile"))
    localprofile = JSON.parse(localStorage.getItem("localprofile"));
  else {
    localprofile = {
      "collectedcats": {},
      "numcards": {
        "total": 0,
        "bronze": 0,
        "silver": 0,
        "gold": 0
      },
      "catcoins": 1000,
      "countclicks": 0,
      "countcoins": 0
    };
    localStorage.setItem("localprofile", JSON.stringify(localprofile));
  }
}

loaddata();

const meowButton = document.querySelector('.click-button');

function writecoins() {
  let target = document.querySelector("#cat-coins-count");
  target.innerHTML = localprofile.catcoins.toLocaleString();;
}

//Counts the number of clicks for the clicker
function countClicks() {
  localprofile.countclicks++;
  localStorage.setItem("countclicks", JSON.stringify(localprofile.countclicks));
  console.log("Number of clicks: " + localprofile.countclicks);
}

const numberContainer = document.querySelector('.number-container');

const bronzeMul = 0.8;
const silverMul = 1.2;
const goldMul = 2.4;
let gain = Math.floor(1 + (localprofile.numcards.bronze * bronzeMul) + (localprofile.numcards.silver * silverMul) + (localprofile.numcards.gold * goldMul));

function writeinfo() {
  let target = document.querySelector("#clicker-info");
  target.innerHTML = `Total Cat Coins per click: ${gain}<br>
                      You have:<br> 
                      ${Math.floor(localprofile.numcards.bronze)} Bronze cats contributing ${Math.floor((localprofile.numcards.bronze * bronzeMul))} cat coins <br>
                      ${Math.floor(localprofile.numcards.silver)} Silver cats contributing ${Math.floor((localprofile.numcards.silver * silverMul))} cat coins <br>
                      ${Math.floor(localprofile.numcards.gold)} Gold cats contributing ${Math.floor((localprofile.numcards.gold * goldMul))} cat coins`
}

writeinfo();

meowButton.addEventListener('click', (event) => {
  let mouseX = event.clientX;
  let mouseY = event.clientY;
  const number = document.createElement('div');
  number.style = `left: ${mouseX}px; top: ${mouseY}px`;
  number.classList.add('number');
  let gain = Math.floor(1 + (localprofile.numcards.bronze * bronzeMul) + (localprofile.numcards.silver * silverMul) + (localprofile.numcards.gold * goldMul));
  number.textContent = '+' + gain.toLocaleString();
  localprofile.catcoins += gain;
  writecoins();
  localStorage.setItem("localprofile", JSON.stringify(localprofile));



  numberContainer.appendChild(number);

  setTimeout(() => {
    number.remove();
  }, 1000);
});

// top button
let mybutton = document.getElementById("topBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {
  scrollFunction()
  myFunction()
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}