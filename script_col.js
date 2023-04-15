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

//Draggagle element :
let dragcat = document.getElementById("catdiv")
dragElement(dragcat);

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// Periodically meow
let isMeowing = false;
setInterval(function() {
  const mews = ["meow.", "mew", "howdy", "mlem", "mrrp", "bleurgh", "salad", "--- -. .. --- -. ...", "zoo wee.", "yoinky", "spladoinky"]
  console.log(isMeowing);
  let meow = document.querySelector(".meow");
  console.log(mews)
  meow.innerHTML = mews[Math.floor(Math.random() * mews.length)];
  if (!isMeowing) {
    meow.setAttribute("style", "opacity: 1");
    isMeowing = true;
  }
}, 6000);
setInterval(function() {
  if (isMeowing) {
    let meow = document.querySelector(".meow");
    meow.removeAttribute("style");
    isMeowing = false;
  }

}, 4000);

/*Card grids*/
function filterSelection(c) {
  let x, i;
  x = document.getElementsByClassName("column");
  if (c === "all") c = "";
  for (i = 0; i < x.length; i++) {
    w3RemoveClass(x[i], "show");
    if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
  }
}


function w3AddClass(element, name) {
  let i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) { element.className += " " + arr2[i]; }
  }
}

function w3RemoveClass(element, name) {
  let i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);
    }
  }
  element.className = arr1.join(" ");
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

function myFunction() {

  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}
//Sticky Header END

// Add active class to the current button (highlight it)
let btnContainer = document.getElementById("filterBtnContainer");
let btns = btnContainer.getElementsByClassName("filterbtn");
for (let i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    let current = document.querySelector(".filterbtn.active");
    current.classList.remove("active");
    this.className += " active";
  });
}

function drawcollection() {
  let collectionEle = document.querySelector("#cat-collection");
  let html = ``;

  // Draw bronze cats
  html += `<div class="row bronzeRow">`
  for (let i = 0; i < 60; i++) {
    html += `<div class="column bronzeTier">`
    if (localprofile.collectedcats[i].count == 0)
      html += `<div id="card" class="not-collected"></div></div>`
    else {
      html += `<a href="${localprofile.collectedcats[i].url}" target="blank"><div id="card" class="bronze">
                <p><b>${localprofile.collectedcats[i].name}</b></p>
                    <div id="cat-img" style="background-image: url('${localprofile.collectedcats[i].img}');"></div>
                    <p>Rarity: Bronze<br>
                      Attack: ${localprofile.collectedcats[i].atk}<br>
                      Defense: ${localprofile.collectedcats[i].def}</p>
                      <p class="card-count">x${localprofile.collectedcats[i].count}</p>
                  </div></a>
                </div>`
    }
  }

  // Draw silver cats
  html += `</div><div class="row silverRow">`
  for (let i = 60; i < 74; i++) {
    html += `<div class="column silverTier">`
    if (localprofile.collectedcats[i].count == 0)
      html += `<div id="card" class="not-collected"></div></div>`
    else {
      html += `<a href="${localprofile.collectedcats[i].url}" target="blank"><div id="card" class="silver">
                <p><b>${localprofile.collectedcats[i].name}</b></p>
                    <div id="cat-img" style="background-image: url('${localprofile.collectedcats[i].img}');"></div>
                    <p>Rarity: Silver<br>
                      Attack: ${localprofile.collectedcats[i].atk}<br>
                      Defense: ${localprofile.collectedcats[i].def}</p>
                      <p class="card-count">x${localprofile.collectedcats[i].count}</p>
                  </div></a>
                </div>`
    }
  }

  // Draw gold cats
  html += `</div><div class="row goldRow">`
  for (let i = 74; i < 80; i++) {
    html += `<div class="column goldTier">`
    if (localprofile.collectedcats[i].count == 0)
      html += `<div id="card" class="not-collected-gold"></div></div>`
    else {
      html += `<a href="${localprofile.collectedcats[i].url}" target="blank"><div id="card" class="gold">
                <p><b>${localprofile.collectedcats[i].name}</b></p>
                    <div id="cat-img" style="background-image: url('${localprofile.collectedcats[i].img}');"></div>
                    <p>Rarity: Gold<br>
                      Attack: ${localprofile.collectedcats[i].atk}<br>
                      Defense: ${localprofile.collectedcats[i].def}</p>
                      <p class="card-count">x${localprofile.collectedcats[i].count}</p>
                  </div></a>
                </div>`
    }
  }
  html += `</div>`
  collectionEle.innerHTML = html;
  filterSelection('all');
}

async function init() {
  if (!localprofile.collectedcats[0]) {
    await getcat(`https://api.pexels.com/v1/search?query=cat&per_page=80`);
  }
  drawcollection();
}

init();

