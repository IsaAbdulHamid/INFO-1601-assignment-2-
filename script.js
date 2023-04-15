let localprofile;

const bronzeRange = 60;
const silverRange = 74;

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

if (!localprofile.collectedcats[0]) {
  getcat(`https://api.pexels.com/v1/search?query=cat&per_page=80`);
}


function writecoins() {
  let target = document.querySelector("#cat-coins-count")
  target.innerHTML = localprofile.catcoins.toLocaleString();
}

function makecard(img, rarity) {
  /* Constants used to calculate stats.
  Setting higher values for these consts lowers the respective stat. reduce brings both down into a general range (e.g 0-20 vs 100-500) */
  const atkmod = 10
  const defmod = 13
  const reduce = 140

  const flatatk = img.height % rarity.value
  const flatdef = img.width % rarity.value

  // Using the image dimenstions, applies a basic formula to determine stats
  let atk = Math.floor(((img.height / atkmod) * rarity.value / reduce)) + flatatk
  let def = Math.floor(((img.width / defmod) * rarity.value / reduce)) + flatdef

  // Get name from alt text
  let alt = img.alt
  let photog = img.photographer
  let pname = photog.split(" ")
  let words = alt.split(" ")
  let name = `${pname[0]} ${words[0]}`

  return {
    "atk": atk,
    "def": def,
    "name": name
  }
}

function setcats(result) {
  if (!localprofile.collectedcats[0]) {
    console.log("making cats")
    let allcats = result.photos;
    for (let i = 0; i < 80; i++) {
      let rarity;
      if (i < bronzeRange) {
        rarity = {
          "tier": "Bronze",
          "value": 1
        }
      }
      else if (i < silverRange) {
        rarity = {
          "tier": "Silver",
          "value": 2
        }
      }
      else {
        rarity = {
          "tier": "Gold",
          "value": 3
        }
      }
      let card = makecard(allcats[i], rarity)
      if (!localprofile.collectedcats[i]) {
        localprofile.collectedcats[i] = {
          "url": allcats[i].url,
          "img": allcats[i].src.medium,
          "count": 0,
          "rarity": {
            "tier": rarity.tier,
            "value": rarity.value
          },
          "atk": card.atk,
          "def": card.def,
          "name": card.name
        }
      }
    }
  }
  else {
    console.log("already exists")
    return
  }
}


function pullcat() {
  if (localprofile.catcoins < 150) {
    window.alert("You do not have enough cat coins! :(")
    return
  }

  localprofile.catcoins -= 150;
  writecoins();

  // Randomly select an image from the list of search results
  let imgidx = Math.floor(Math.random() * 80);

  // Count cats
  if (localprofile.collectedcats[imgidx].count >= 1)
    localprofile.collectedcats[imgidx].count++;
  else
    localprofile.collectedcats[imgidx].count = 1;
  localprofile.numcards.total++;

  // Determine rarity based on location in the list of search results

  if (imgidx < bronzeRange) {
    localprofile.numcards.bronze++;
  }
  else if (imgidx < silverRange) {
    localprofile.numcards.silver++;
  }
  else {
    localprofile.numcards.gold++;
  }

  // Update html
  let target = document.querySelector("#card");
  target.removeAttribute("style");
  target.setAttribute("class", localprofile.collectedcats[imgidx].rarity.tier.toLowerCase());
  let html = `<p><b>${localprofile.collectedcats[imgidx].name}</b></p>
                <div id="cat-img" style="background-image: url('${localprofile.collectedcats[imgidx].img}');"></div>
                <p>Rarity: ${localprofile.collectedcats[imgidx].rarity.tier}<br>
                Attack: ${localprofile.collectedcats[imgidx].atk}<br>
                Defense: ${localprofile.collectedcats[imgidx].def}</p>`

  target.innerHTML = html
  drawloss();

  // Save collected cats locally
  localStorage.setItem("localprofile", JSON.stringify(localprofile));
}


//Counts the number of clicks for the clicker
function countClicks() {
  localprofile.countclicks++;
  localStorage.setItem("countclicks", JSON.stringify(localprofile.countclicks));
  console.log("Number of clicks: " + localprofile.countclicks);
}

async function getcat(url) {

  let options = {
    headers: {
      Authorization: 'fBaQo0TGLalQVFuZ43pfZHHUwbqE3T7D3kiMYPRPrpu2sae5xUHRcVuY' // It would be nice to hide this, but we can't really
    }
  }
  let response = await fetch(url, options)
  let result = await response.json() // Returns data for a page of search results (maximum results per page is 80, so this could be our entire collection)
  setcats(result);
}

function countmissing() {
  let missingcats = [];
  for (let i = 0; i < 80; i++) {
    if (!collectedcats[i]) {
      missingcats.push(i);
    }
  }
  if (missingcats.length === 0) {
    console.log("You have collected all cats!");
  } else {
    console.log(`You are missing cats ${missingcats.join(", ")}`);
  }
}

function deletecats() {
  localprofile = {
    "collectedcats": {},
    "catcoins": 1000,
    "countclicks": 0,
    "countcoins": 0,
    "numcards": {
      "total": 0,
      "bronze": 0,
      "silver": 0,
      "gold": 0
    }
  };
  writecoins()
  localStorage.clear();
  getcat(`https://api.pexels.com/v1/search?query=cat&per_page=80`);
}

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

//Sticky Header
let header = document.getElementById("menu");
let sticky = header.offsetTop;
let coin = document.querySelector("#cat-coins")

function myFunction() {

  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }

  if (window.pageYOffset > coin.offsetTop)
    coin.setAttribute("style", `position: fixed;`)
  else
    coin.removeAttribute("style")
}

let adoptButton = document.querySelector(".gimme");

function drawloss() {
  let mouseX = event.clientX;
  let mouseY = event.clientY;
  const number = document.createElement('div');
  number.style = `left: ${mouseX}px; top: ${mouseY}px`;
  number.classList.add('number');
  number.textContent = '-' + 150;
  console.log(number.getAttribute("style"));

  adoptButton.appendChild(number);

  setTimeout(() => {
    number.remove();
  }, 1000);
};