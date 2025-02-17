const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-btn");
const clearButton = document.getElementById("clear-btn");
const resultsContainer = document.getElementById("results-container");

const keywordMap = new Map();

keywordMap.set("country", "countries");
keywordMap.set("countries", "countries");

keywordMap.set("temple", "temples");
keywordMap.set("temples", "temples");

keywordMap.set("beach", "beaches");
keywordMap.set("beaches", "beaches");

const keywordSet = new Set(["country", "countries", "temple", "temples", "beach", "beaches"]);


function displayResults(results) {
  resultsContainer.innerHTML = "";

  results.forEach(destination => {
    const resultCard = document.createElement("div");
    resultCard.classList.add("result-card");
    resultCard.innerHTML = `
                  <img src="${destination.imageUrl}" alt="${destination.name}">
                  <h2>${destination.name}</h2>
                  <p>${destination.description}</p>
                  <button class="view-btn">View</button>
              `;
    resultsContainer.appendChild(resultCard);
  });

  resultsContainer.classList.add("active");
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
  resultsContainer.innerHTML = "";
  resultsContainer.classList.remove("active");

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

    }

  }
});

clearButton.addEventListener("click", function () {
  searchInput.value = "";
  resultsContainer.classList.remove("active");
});

resultsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("close-btn")) {
    resultsContainer.classList.remove("active");
  }
});

