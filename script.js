// Fetch the coin data from the CoinGecko API
const apiUrl =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc";

const coinsPerPage = 12;
let currentPage = 1;
let coinsData = [];

async function fetchCoinData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    coinsData = data;

    displayCoins();
    renderPagination();
  } catch (error) {
    console.error(error);
  }
}

fetchCoinData();

function displayCoins() {
  const coinsContainer = document.getElementById("coinsContainer");
  coinsContainer.innerHTML = "";

  const startIndex = (currentPage - 1) * coinsPerPage;
  const endIndex = startIndex + coinsPerPage;
  const coinsToShow = coinsData.slice(startIndex, endIndex);

  coinsToShow.forEach((coin) => {
    const coinCard = createCoinCard(coin);
    coinsContainer.appendChild(coinCard);
  });
}

// Function to create a coin card
function createCoinCard(coin) {
  const card = document.createElement("div");
  card.className = "col-lg-4 col-md-6 mb-4";

  const innerHTML = `
    <div class="card h-100 shadow coin-card" data-aos="fade-up">
      <div class="card-body d-flex align-items-center justify-content-between">
        <img src="${coin.image}" alt="${coin.name}" class="rounded-circle">
        <div>
          <h5 class="card-title">${coin.name}</h5>
          <p class="card-text">${coin.symbol.toUpperCase()}</p>
        </div>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#coinModal"
          data-coin-id="${coin.id}">
          View Details
        </button>
      </div>
    </div>
  `;

  card.innerHTML = innerHTML;

  // Add event listener for showing coin details on button click
  const viewDetailsBtn = card.querySelector(".btn");
  viewDetailsBtn.addEventListener("click", function () {
    const coinId = this.getAttribute("data-coin-id");
    fetchCoinDetails(coinId)
      .then((details) => {
        showCoinDetails(details);
      })
      .catch((error) => console.error(error));
  });

  return card;
}

// Function to fetch coin details by coin ID
async function fetchCoinDetails(coinId) {
  const detailsUrl = `https://api.coingecko.com/api/v3/coins/${coinId}`;
  try {
    const response = await fetch(detailsUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    return console.error(error);
  }
}

// Function to show coin details in the modal
function showCoinDetails(details) {
  const coinModalLabel = document.getElementById("coinModalLabel");
  const coinDetails = document.getElementById("coinDetails");
  coinModalLabel.textContent = details.name;
console.log(details)
  const innerHTML = `
    <span>Symbol:</span> <img src=${details.image.thumb} /><span>${details.symbol.toUpperCase()}</span>

    
    <p>Current Price: $${details.market_data.current_price.usd}</p>
    <p>Market Cap Rank: ${details.market_cap_rank}</p>
    <a href="https://in.tradingview.com/markets/cryptocurrencies/prices-all/" target="_blank" > view coin</a>
  `;

  coinDetails.innerHTML = innerHTML;

  const coinModal = new bootstrap.Modal(document.getElementById("coinModal"));
  coinModal.show();
}

function renderPagination() {
  const totalCoins = coinsData.length;
  const totalPages = Math.ceil(totalCoins / coinsPerPage);

  const paginationContainer = document.getElementById("paginationContainer");
  paginationContainer.innerHTML = "";

  if (totalPages <= 1) {
    return;
  }

  const paginationList = document.createElement("ul");
  paginationList.className = "pagination";

  const prevButton = createPaginationButton(
    "Previous",
    currentPage - 1,
    currentPage === 1
  );
  paginationList.appendChild(prevButton);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = createPaginationButton(i, i, currentPage === i);
    paginationList.appendChild(pageButton);
  }

  const nextButton = createPaginationButton(
    "Next",
    currentPage + 1,
    currentPage === totalPages
  );
  paginationList.appendChild(nextButton);

  paginationContainer.appendChild(paginationList);
}

function createPaginationButton(label, page, isDisabled) {
  const listItem = document.createElement("li");
  listItem.className = "page-item";
  if (isDisabled) {
    listItem.classList.add("disabled");
  }

  const link = document.createElement("a");
  link.className = "page-link";
  link.href = "#";
  link.textContent = label;

  link.addEventListener("click", function (event) {
    event.preventDefault();
    if (!isDisabled) {
      currentPage = page;
      displayCoins();
      renderPagination();
    }
  });

  listItem.appendChild(link);

  return listItem;
}

// Add Search Functionality
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", function () {
  const searchTerm = this.value.trim().toLowerCase();
  const filteredCoins = coinsData.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchTerm) ||
      coin.symbol.toLowerCase().includes(searchTerm)
  );

  coinsData = filteredCoins;
  currentPage = 1;
  displayCoins();
  renderPagination();
});

// Add Sort Functionality
const sortSelect = document.getElementById("sortSelect");
sortSelect.addEventListener("change", function () {
  const sortValue = this.value;
  let sortedCoins = [];

  switch (sortValue) {
    case "price":
      sortedCoins = coinsData.sort((a, b) => a.current_price - b.current_price);
      break;
    case "market_cap":
      sortedCoins = coinsData.sort(
        (a, b) => a.market_cap_rank - b.market_cap_rank
      );
      break;
    case "name":
      sortedCoins = coinsData.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      sortedCoins = coinsData;
  }

  coinsData = sortedCoins;
  currentPage = 1;
  displayCoins();
  renderPagination();
});

coinsData = [];

// async function fetchCoinData() {
//   try {
//     const response = await fetch(apiUrl);
//     const data = await response.json();
//     coinsData = data;

//     displayCoins();
//     renderPagination();
//   } catch (error) {
//     console.error(error);
//   }
// }

// fetchCoinData();

// function displayCoins() {
//   const coinsContainer = document.getElementById("coinsContainer");
//   coinsContainer.innerHTML = "";

//   const startIndex = (currentPage - 1) * coinsPerPage;
//   const endIndex = startIndex + coinsPerPage;
//   const coinsToShow = coinsData.slice(startIndex, endIndex);

//   coinsToShow.forEach((coin) => {
//     const coinCard = createCoinCard(coin);
//     coinsContainer.appendChild(coinCard);
//   });
// }

// // Function to create a coin card
// function createCoinCard(coin) {
//   const card = document.createElement("div");
//   card.className = "col-lg-4 col-md-6 mb-4";

//   const innerHTML = `
//     <div class="card h-100 shadow coin-card" data-aos="fade-up">
//       <div class="card-body d-flex align-items-center justify-content-between">
//         <img src="${coin.image}" alt="${coin.name}" class="rounded-circle">
//         <div>
//           <h5 class="card-title">${coin.name}</h5>
//           <p class="card-text">${coin.symbol.toUpperCase()}</p>
//         </div>
//         <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#coinModal"
//           data-coin-id="${coin.id}">
//           View Details
//         </button>
//       </div>
//     </div>
//   `;

//   card.innerHTML = innerHTML;

//   // Add event listener for showing coin details on button click
//   const viewDetailsBtn = card.querySelector(".btn");
//   viewDetailsBtn.addEventListener("click", function () {
//     const coinId = this.getAttribute("data-coin-id");
//     fetchCoinDetails(coinId)
//       .then((details) => {
//         showCoinDetails(details);
//       })
//       .catch((error) => console.error(error));
//   });

//   return card;
// }

// // Function to fetch coin details by coin ID
// async function fetchCoinDetails(coinId) {
//   const detailsUrl = `https://api.coingecko.com/api/v3/coins/${coinId}`;
//   try {
//     const response = await fetch(detailsUrl);
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     return console.error(error);
//   }
// }

// // Function to show coin details in the modal
// function showCoinDetails(details) {
//   const coinModalLabel = document.getElementById("coinModalLabel");
//   const coinDetails = document.getElementById("coinDetails");

//   coinModalLabel.textContent = details.name;
//   coinDetails.innerHTML = "";

//   const innerHTML = `
//     <p>Symbol: ${details.symbol.toUpperCase()}</p>
//     <p>Current Price: $${details.market_data.current_price.usd}</p>
//     <p>Market Cap Rank: ${details.market_cap_rank}</p>
//   `;

//   coinDetails.innerHTML = innerHTML;

//   const coinModal = new bootstrap.Modal(document.getElementById("coinModal"));
//   coinModal.show();
// }

// function renderPagination() {
//   const totalCoins = coinsData.length;
//   const totalPages = Math.ceil(totalCoins / coinsPerPage);

//   const paginationContainer = document.getElementById("paginationContainer");
//   paginationContainer.innerHTML = "";

//   if (totalPages <= 1) {
//     return;
//   }

//   const paginationList = document.createElement("ul");
//   paginationList.className = "pagination";

//   const prevButton = createPaginationButton(
//     "Previous",
//     currentPage - 1,
//     currentPage === 1
//   );
//   paginationList.appendChild(prevButton);

//   for (let i = 1; i <= totalPages; i++) {
//     const pageButton = createPaginationButton(i, i, currentPage === i);
//     paginationList.appendChild(pageButton);
//   }

//   const nextButton = createPaginationButton(
//     "Next",
//     currentPage + 1,
//     currentPage === totalPages
//   );
//   paginationList.appendChild(nextButton);

//   paginationContainer.appendChild(paginationList);
// }

// function createPaginationButton(label, page, isDisabled) {
//   const listItem = document.createElement("li");
//   listItem.className = "page-item";
//   if (isDisabled) {
//     listItem.classList.add("disabled");
//   }

//   const link = document.createElement("a");
//   link.className = "page-link";
//   link.href = "#";
//   link.textContent = label;

//   link.addEventListener("click", function (event) {
//     event.preventDefault();
//     if (!isDisabled) {
//       currentPage = page;
//       displayCoins();
//       renderPagination();
//     }
//   });

//   listItem.appendChild(link);

//   return listItem;
// }

// // Add Search Functionality
// const searchInput = document.getElementById("searchInput");
// searchInput.addEventListener("input", function () {
//   const searchTerm = this.value.trim().toLowerCase();
//   const filteredCoins = coinsData.filter(
//     (coin) =>
//       coin.name.toLowerCase().includes(searchTerm) ||
//       coin.symbol.toLowerCase().includes(searchTerm)
//   );

//   coinsData = filteredCoins;
//   currentPage = 1;
//   displayCoins();
//   renderPagination();
// });

// // Add Sort Functionality
// const sortSelect = document.getElementById("sortSelect");
// sortSelect.addEventListener("change", function () {
//   const sortValue = this.value;
//   let sortedCoins = [];

//   switch (sortValue) {
//     case "price":
//       sortedCoins = coinsData.sort((a, b) => a.current_price - b.current_price);
//       break;
//     case "market_cap":
//       sortedCoins = coinsData.sort(
//         (a, b) => a.market_cap_rank - b.market_cap_rank
//       );
//       break;
//     case "name":
//       sortedCoins = coinsData.sort((a, b) => a.name.localeCompare(b.name));
//       break;
//     default:
//       sortedCoins = coinsData;
//   }

//   coinsData = sortedCoins;
//   currentPage = 1;
//   displayCoins();
//   renderPagination();
// });
