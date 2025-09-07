
function goToPage(pageNum) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.style.display = "none";
  });
  const nextPage = document.getElementById("page" + pageNum);
  nextPage.style.display = "block";
  setTimeout(() => nextPage.classList.add("active"), 10);
}

function goToHome() {
  const college = document.getElementById("college").value;
  if (college === "") {
    alert("Please select your college!");
  } else {
    document.getElementById("collegeName").innerText =
      "Welcome, " + document.getElementById("college").options[document.getElementById("college").selectedIndex].text;
    goToPage(3);
  }
}


const confettiCanvas = document.getElementById("confettiCanvas");
const confettiCtx = confettiCanvas.getContext("2d");
let confettiParticles = [];

function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function createConfetti() {
  for (let i = 0; i < 100; i++) {
    confettiParticles.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * 40 + 10,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      tilt: Math.random() * 10 - 10,
      tiltAngle: 0,
      tiltAngleIncrement: Math.random() * 0.07 + 0.05
    });
  }
}

function drawConfetti() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiParticles.forEach(p => {
    confettiCtx.beginPath();
    confettiCtx.lineWidth = p.r / 2;
    confettiCtx.strokeStyle = p.color;
    confettiCtx.moveTo(p.x + p.tilt + p.r / 4, p.y);
    confettiCtx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
    confettiCtx.stroke();
  });
  updateConfetti();
}

function updateConfetti() {
  confettiParticles.forEach(p => {
    p.tiltAngle += p.tiltAngleIncrement;
    p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
    p.tilt = Math.sin(p.tiltAngle) * 15;
    if (p.y > confettiCanvas.height) {
      p.x = Math.random() * confettiCanvas.width;
      p.y = -20;
      p.tilt = Math.random() * 10 - 10;
    }
  });
}

function launchConfetti() {
  createConfetti();
  const confettiInterval = setInterval(drawConfetti, 25);
  setTimeout(() => {
    clearInterval(confettiInterval);
    confettiParticles = [];
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }, 3000);
}


let lostItems = [];
let foundItems = [];
let reviewsLost = [];
let reviewsFound = [];


function getEmoji(mood) {
  switch (mood) {
    case "happy": return "😄";
    case "sad": return "😢";
    case "neutral": return "😐";
    default: return "😐";
  }
}


function renderLostItems() {
  const container = document.querySelector("#page6 .items-list");
  container.innerHTML = "";
  if (lostItems.length === 0) { container.innerHTML = "<p>No lost items posted yet.</p>"; return; }
  lostItems.forEach(item => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `<img src="${item.image}" alt="${item.itemName}">
                      <h4>${item.itemName}</h4>
                      <p>${item.description}</p>`;
    card.addEventListener("click", () => showModal(item));
    container.appendChild(card);
  });
}

function renderFoundItems() {
  const container = document.querySelector("#page7 .items-list");
  container.innerHTML = "";
  if (foundItems.length === 0) { container.innerHTML = "<p>No found items posted yet.</p>"; return; }
  foundItems.forEach(item => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `<img src="${item.image}" alt="${item.itemName}">
                      <h4>${item.itemName}</h4>
                      <p>${item.description}</p>`;
    card.addEventListener("click", () => showModal(item));
    container.appendChild(card);
  });
}


document.getElementById("lostSearch").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const container = document.querySelector("#page6 .items-list");
  container.innerHTML = "";
  lostItems.filter(item => item.itemName.toLowerCase().includes(query) || item.description.toLowerCase().includes(query))
    .forEach(item => {
      const card = document.createElement("div");
      card.className = "item-card";
      card.innerHTML = `<img src="${item.image}" alt="${item.itemName}">
                        <h4>${item.itemName}</h4>
                        <p>${item.description}</p>`;
      card.addEventListener("click", () => showModal(item));
      container.appendChild(card);
    });
});

document.getElementById("foundSearch").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const container = document.querySelector("#page7 .items-list");
  container.innerHTML = "";
  foundItems.filter(item => item.itemName.toLowerCase().includes(query) || item.description.toLowerCase().includes(query))
    .forEach(item => {
      const card = document.createElement("div");
      card.className = "item-card";
      card.innerHTML = `<img src="${item.image}" alt="${item.itemName}">
                        <h4>${item.itemName}</h4>
                        <p>${item.description}</p>`;
      card.addEventListener("click", () => showModal(item));
      container.appendChild(card);
    });
});


const modal = document.getElementById("itemModal");
const modalImage = document.getElementById("modalImage");
const modalName = document.getElementById("modalName");
const modalDescription = document.getElementById("modalDescription");
const modalContact = document.getElementById("modalContact");
const spanClose = document.querySelector(".close");

function showModal(item) {
  modal.style.display = "block";
  modalImage.src = item.image;
  modalName.innerText = item.itemName;
  modalDescription.innerText = item.description;
  modalContact.innerText = "Contact: " + item.contact;
}

spanClose.onclick = function () { modal.style.display = "none"; }
window.onclick = function (e) { if (e.target == modal) { modal.style.display = "none"; } }


function handleFormSubmission(formPageId, itemsArray, renderFunction, reviewContainerId) {
  const form = document.querySelector(`#${formPageId} form`);
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const itemName = this.querySelector("input[placeholder='Item Name']").value;
    const description = this.querySelector("textarea").value;
    const contact = this.querySelector("input[placeholder='Contact Number']").value;
    const file = this.querySelector("input[type='file']").files[0];
    if (!file) { alert("Please upload an image"); return; }
    const reader = new FileReader();
    reader.onload = function (event) {
      itemsArray.push({ itemName, description, contact, image: event.target.result });
      renderFunction();
      alert("✅ Item posted successfully!");
      launchConfetti();

      
      const container = document.getElementById(reviewContainerId);
      container.innerHTML = `
        <div class="reviews-section">
          <h3>Leave a Review</h3>
          <div class="review-form">
            <input type="text" id="reviewName_${formPageId}" placeholder="Your Name" required>
            <textarea id="reviewText_${formPageId}" placeholder="Write your review..." rows="3" required></textarea>
            <label for="reviewMood_${formPageId}">Mood:</label>
            <select id="reviewMood_${formPageId}">
              <option value="happy">😄 Happy</option>
              <option value="sad">😢 Sad</option>
              <option value="neutral">😐 Neutral</option>
            </select>
            <button onclick="submitDynamicReview('${formPageId}')">Submit Review</button>
          </div>
          <div class="reviews-list" id="reviewsList_${formPageId}">
            <p>No reviews yet. Be the first to review! 😊</p>
          </div>
        </div>
      `;
      goToPage(formPageId === "page4" ? 6 : 7);
    };
    reader.readAsDataURL(file);
    form.reset();
  });
}


handleFormSubmission("page4", lostItems, renderLostItems, "reviewContainerLost");
handleFormSubmission("page5", foundItems, renderFoundItems, "reviewContainerFound");


function submitDynamicReview(formPageId) {
  const nameInput = document.getElementById(`reviewName_${formPageId}`);
  const textInput = document.getElementById(`reviewText_${formPageId}`);
  const moodInput = document.getElementById(`reviewMood_${formPageId}`);
  const listContainer = document.getElementById(`reviewsList_${formPageId}`);

  if (!nameInput.value.trim() || !textInput.value.trim()) {
    alert("Please enter both name and review!");
    return;
  }

  const review = { name: nameInput.value.trim(), text: textInput.value.trim(), mood: moodInput.value || "neutral" };

  if (formPageId === "page4") {
    reviewsLost.push(review);
    renderReviewsPage(reviewsLost, listContainer);
  } else {
    reviewsFound.push(review);
    renderReviewsPage(reviewsFound, listContainer);
  }

  nameInput.value = "";
  textInput.value = "";
  if (moodInput) moodInput.value = "happy";

  renderHomeReviews();
}


function renderReviewsPage(reviewsArray, container) {
  container.innerHTML = "";
  if (reviewsArray.length === 0) {
    container.innerHTML = `<p>No reviews yet. Be the first to review! 😊</p>`;
    return;
  }
  reviewsArray.slice().reverse().forEach(r => {
    const card = document.createElement("div");
    card.className = `review-card ${r.mood}`;
    card.innerHTML = `<h4>${r.name} <span class="review-emoji ${r.mood}">${getEmoji(r.mood)}</span></h4>
                      <p>${r.text}</p>`;
    container.appendChild(card);
  });
}


function renderHomeReviews() {
  const container = document.getElementById("homeReviewsList");
  const allReviews = [...reviewsLost, ...reviewsFound].slice().reverse();
  container.innerHTML = "";
  if (allReviews.length === 0) {
    container.innerHTML = `<p>No reviews yet. Be the first to review! 😊</p>`;
    return;
  }
  allReviews.forEach(r => {
    const card = document.createElement("div");
    card.className = `review-card ${r.mood}`;
    card.innerHTML = `<h4>${r.name} <span class="review-emoji ${r.mood}">${getEmoji(r.mood)}</span></h4>
                      <p>${r.text}</p>`;
    container.appendChild(card);
  });
}
