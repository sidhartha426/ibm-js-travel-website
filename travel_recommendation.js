const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-btn");
const clearButton = document.getElementById("clear-btn");
const bookButton = document.getElementById("book-btn");
const contactForm = document.getElementById("contact-form");
const resultsContainer = document.getElementById("results-container");
const logoContainer = document.getElementById("logo");

const keywordMap = new Map();

keywordMap.set("country", "countries");
keywordMap.set("countries", "countries");

keywordMap.set("temple", "temples");
keywordMap.set("temples", "temples");

keywordMap.set("beach", "beaches");
keywordMap.set("beaches", "beaches");

const keywordSet = new Set(["country", "countries", "temple", "temples", "beach", "beaches"]);

const intervalIds = [];

function formatTimeInTimeZone(timezone) {
  const options = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: timezone
  };

  const date = new Date().toLocaleString('en-GB', options);

  // Modify the day format to add 'st', 'nd', 'rd', or 'th' suffix
  const day = new Date().toLocaleString('en-GB', { timeZone: timezone, day: 'numeric' });
  const suffix = (day == 1 || day == 21 || day == 31) ? 'st' :
    (day == 2 || day == 22) ? 'nd' :
      (day == 3 || day == 23) ? 'rd' : 'th';

  return date.replace(day, day + suffix);
}

function handleViewClick(event) {
  const name = event.target.parentNode.children[1].textContent;
  alert(`${name} is waiting for you! 😄🎉!`);
}
function handleTimeSpan(element) {
  element.textContent = formatTimeInTimeZone(element.dataset.timeZone);
}

function setHandlers() {
  const viewButtons = document.querySelectorAll(".result-card > .view-btn");

  for (const viewButton of viewButtons) {
    viewButton.addEventListener("click", handleViewClick);
  }

  const timeSpans = document.querySelectorAll(".time-container > span");

  for (const timeSpan of timeSpans) {
    const intervalId = setInterval(handleTimeSpan, 1000, timeSpan);
    intervalIds.push(intervalId);
  }

}

function removeHandlers() {
  const viewButtons = document.querySelectorAll(".result-card > .view-btn");

  for (const viewButton of viewButtons) {
    viewButton.removeEventListener("click", handleViewClick);
  }

  while (intervalIds.length > 0) {
    clearInterval(intervalIds.pop());
  }

}

function displayResults(results) {

  results.forEach(({ name, imageUrl, description, timeZone }, i) => {
    const resultCard = document.createElement("div");
    resultCard.classList.add("result-card");
    resultCard.innerHTML = `
                  <img src="${imageUrl}" alt="${name}">
                  <h2>${name}</h2>
                  <p>${description}</p>
                  <div class="time-container">
                    <span data-time-zone=${timeZone} id=${"current-time-" + i}>${formatTimeInTimeZone(timeZone)}</span>
                  </div>
                  <button class="view-btn">View</button>
              `;
    resultsContainer.appendChild(resultCard);
  });

  setHandlers();

  resultsContainer.classList.add("active");

  // Code to solve the issue of some cards not showing 

  const firstCard = document.querySelector(".results-overlay div:nth-child(1)");
  let tempOffset1 = 0, tempOffset2 = 0;
  while (firstCard.offsetTop < 0) {
    tempOffset1 = firstCard.offsetTop * -1;
    firstCard.style.marginTop = `${firstCard.offsetTop * -1 + tempOffset2}px`;
    tempOffset2 += tempOffset1;
  }
  if (tempOffset2 !== 0) {
    while (firstCard.offsetTop < 178) {
      firstCard.style.marginTop = `${tempOffset2}px`;
      tempOffset2 += 1;
    }
  }
}

searchButton.addEventListener("click", async function () {
  const query = searchInput.value.toLowerCase().trim();
  removeHandlers();
  resultsContainer.classList.remove("active");
  resultsContainer.innerHTML = "";


  if (query) {

    const res = await fetch("travel_recommendation_api.json");
    const data = await res.json();
    const countryData = [];
    for (let country of data["countries"]) {
      for (let city of country["cities"]) {
        countryData.push(city);
      }
    }

    const allData = countryData.slice();

    for (let beach of data["beaches"]) {
      allData.push(beach);
    }

    for (let temple of data["temples"]) {
      allData.push(temple);
    }

    if (keywordSet.has(query)) {
      if (keywordMap.get(query) === "countries") {

        displayResults(countryData);
      }
      else {
        displayResults(data[keywordMap.get(query)]);
      }
    }
    else {
      const filteredData = allData.filter((data) => data.name.toLowerCase().includes(query));
      if (filteredData.length > 0) {
        displayResults(filteredData);
      }
      else {
        alert("No destination found for your query.");
      }

    }

  }
});

clearButton.addEventListener("click", function () {
  searchInput.value = "";
  removeHandlers();
  resultsContainer.classList.remove("active");
  resultsContainer.innerHTML = "";
});

logoContainer.addEventListener("click", function (event) {
  window.location.href = "#home";
});

bookButton.addEventListener("click", function (event) {
  alert("Your Journey Begins Here - Let's Go! 🚀🌎");
});

contactForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent actual form submission

  // Get form values
  const name = document.getElementsByName("name")[0].value;
  const email = document.getElementsByName("email")[0].value;
  const message = document.getElementsByName("message")[0].value;

  // Construct mailto URL
  const mailtoLink = `mailto:contact@travelsmooth.com?subject=${encodeURIComponent("Mail from " + name)}&body=${encodeURIComponent("E-mail: " + email + "\n" + message)}`;
  console.log(mailtoLink);
  // Open email client
  alert(`Hello! ${name} \nGot It! Expect to Hear from Us Soon. 😉📩`);
  window.location.href = mailtoLink;

  document.getElementsByName("name")[0].value = "";
  document.getElementsByName("email")[0].value = "";
  document.getElementsByName("message")[0].value = "";
});

