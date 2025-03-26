const bookGridContainer = document.getElementById("bookGridContainer");
const bookListContainer = document.getElementById("bookListContainer");
const searchInput = document.getElementById("searchInput");
const mainDiv = document.getElementById("mainDiv");
const btnGrid = document.getElementById("btnGrid");
const btnList = document.getElementById("btnList");
const sortBySelect = document.getElementById("sortBySelect");

let books = [];
let currentPage = 1;
let totalPages = 0;
let currentView = "grid";
let searchedBook;

document.addEventListener("DOMContentLoaded", async () => {
  await fetchData(
    `https://api.freeapi.app/api/v1/public/books?page=${currentPage}&limit=10`
  );
});

//fetching data from url and adding to array
async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    totalPages = data.data.totalPages;

    data.data.data.map((book) => {
      const id = book.id;
      const title = book.volumeInfo.title;
      const authors = book.volumeInfo.authors?.join();
      const publisher = book.volumeInfo.publisher;
      const thumbnail = book.volumeInfo.imageLinks?.smallThumbnail || "";
      const publishedDate = book.volumeInfo.publishedDate;
      const infoLink = book.volumeInfo.infoLink;

      books.push({
        id,
        title,
        authors,
        publisher,
        thumbnail,
        publishedDate,
        infoLink,
      });
    });

    loadData(books);
  } catch (error) {
    const errorCard = ErrorCard(
      "Failed to fetch books. Please try again later"
    );
    bookListContainer.appendChild(errorCard);
    bookGridContainer.classList.add("hidden");
    bookListContainer.classList.add("text-center");
    bookListContainer.classList.remove("hidden");
  }
}

// loop through array and create card for each book
function loadData(arr) {
  bookGridContainer.innerHTML = "";
  bookListContainer.innerHTML = "";
  arr.map((book) => {
    if (currentView === "grid") {
      const card = createBookCardForGrid({ ...book });
      card.addEventListener("click", function () {
        window.open(book.infoLink);
      });
      bookGridContainer.appendChild(card);
      bookListContainer.classList.add("hidden");
      bookGridContainer.classList.remove("hidden");
    } else {
      const card = createBookCardForList({ ...book });
      card.addEventListener("click", function () {
        window.open(book.infoLink);
      });
      bookListContainer.appendChild(card);
      bookGridContainer.classList.add("hidden");
      bookListContainer.classList.remove("hidden");
    }
  });

  const loadMoreBtn = document.createElement("button");
}

searchInput.addEventListener("input", function () {
  searchedBook = [];
  const inputText = searchInput.value.toString().trim().toLowerCase();

  searchedBook = books.filter((book) => {
    const authors = book.authors ? book.authors.toLowerCase() : "";
    const title = book.title ? book.title.toLowerCase() : "";

    return authors.includes(inputText) || title.includes(inputText);
  });

  loadData(searchedBook);
});

btnGrid.addEventListener("click", () => displayBtnClick(btnGrid));
btnList.addEventListener("click", () => displayBtnClick(btnList));

function displayBtnClick(target) {
  if (target.id === "btnList") {
    btnGrid.classList = "cursor-pointer";
    btnList.classList =
      "bg-white px-4 py-2 rounded-lg shadow-xl cursor-pointer";
    currentView = "list";

    loadData(books);
    return;
  }

  btnList.classList = "cursor-pointer";
  currentView = "grid";
  loadData(books);

  btnGrid.classList = "bg-white px-4 py-2 rounded-lg shadow-xl cursor-pointer";
}

//debouncing to stop getting data again and again
function debounce(fn, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, ...args), delay);
  };
}

// to checking position and fetch data
async function checkScrollPoistion() {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
    if (currentPage <= totalPages) {
      currentPage = currentPage + 1;
      const url = `https://api.freeapi.app/api/v1/public/books?page=${currentPage}&limit=10`;

      const loadingCard = createLoadingBookCard();
      bookGridContainer.appendChild(loadingCard);

      await fetchData(url);
      loadingCard.remove();
      // bookGridContainer.removeChild(loadingCard);
    }
  }
}

const debouncedScrollHandler = debounce(checkScrollPoistion, 200);

window.addEventListener("scroll", debouncedScrollHandler);

function createLoadingBookCard() {
  // Create main div container with same base styling
  const mainDiv = document.createElement("div");
  mainDiv.className =
    "bg-white rounded-2xl shadow-xl flex w-fit flex-col relative w-fit h-fit max-w-62 cursor-pointer border-2 border-zinc-500 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105";

  // Create and configure loading label
  const loadingLabel = document.createElement("label");
  loadingLabel.className =
    "bg-gray-300 text-base text-zinc-900 absolute top-0 rounded-tr-2xl right-0 px-2 ";
  loadingLabel.textContent = "Loading...";

  // Create placeholder image area
  const imgPlaceholder = document.createElement("div");
  imgPlaceholder.className =
    "rounded-tl-2xl rounded-tr-2xl w-72 h-72  border-zinc-500 bg-gray-200 animate-pulse";

  // Create content container div
  const contentDiv = document.createElement("div");
  contentDiv.className =
    "bg-white px-4 flex flex-col py-2 rounded-bl-2xl rounded-br-2xl h-25 overflow-auto gap-1";

  // Create placeholder title
  const titlePlaceholder = document.createElement("div");
  titlePlaceholder.className = "h-4 bg-gray-200 rounded w-3/4 animate-pulse";

  // Create placeholder author
  const authorPlaceholder = document.createElement("div");
  authorPlaceholder.className = "h-4 bg-gray-200 rounded w-2/3 animate-pulse";

  // Create placeholder publisher
  const publisherPlaceholder = document.createElement("div");
  publisherPlaceholder.className =
    "h-4 bg-gray-200 rounded w-1/2 animate-pulse";

  // Assemble the structure
  contentDiv.appendChild(titlePlaceholder);
  contentDiv.appendChild(authorPlaceholder);
  contentDiv.appendChild(publisherPlaceholder);

  mainDiv.appendChild(loadingLabel);
  mainDiv.appendChild(imgPlaceholder);
  mainDiv.appendChild(contentDiv);

  // Return the complete loading element
  return mainDiv;
}

function createBookCardForGrid({
  publishedDate,
  thumbnail,
  title,
  authors,
  publisher,
}) {
  // Create main div container
  const mainDiv = document.createElement("div");
  mainDiv.className =
    "bg-white rounded-2xl shadow-xl flex w-fit flex-col relative w-fit h-fit max-w-62 cursor-pointer border-1 border-zinc-500  transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105";

  // Create and configure date label
  const dateLabel = document.createElement("label");
  dateLabel.className =
    "bg-yellow-300 text-base text-black absolute top-0 rounded-tr-2xl right-0 px-2";
  dateLabel.textContent = publishedDate;

  // Create and configure image
  const img = document.createElement("img");
  img.className =
    "rounded-tl-2xl rounded-tr-2xl w-72 h-72 border-b-1 border-zinc-500";
  img.src = thumbnail || "./assets/noprev.png";
  img.alt = "";

  // Create content container div
  const contentDiv = document.createElement("div");
  contentDiv.className =
    "bg-white px-4 flex flex-col py-2 rounded-bl-2xl rounded-br-2xl h-25  overflow-auto gap-1";

  // Create and configure title label
  const titleLabel = document.createElement("label");
  titleLabel.className = "text-sm font-semibold sm:text-base text-slate-900";
  if (title.length >= 20) title = `${title.substring(0, 22)}...`;
  titleLabel.textContent = title;

  // Create and configure author label
  const authorLabel = document.createElement("label");
  authorLabel.className = "text-sm text-slate-700";
  let authorsString = authors;
  if (authorsString && authorsString.length >= 25)
    authorsString = `${authorsString.substring(0, 25)}...`;
  authorLabel.title = authors;
  authorLabel.textContent = `${authorsString}`;

  // Create and configure publisher label
  const publisherLabel = document.createElement("label");
  publisherLabel.className = "text-sm text-slate-700";
  if (publisher && publisher.length >= 20)
    publisher = `${publisher.substring(0, 18)}...`;
  publisherLabel.textContent = `Publisher: ${publisher}`;

  // Assemble the structure
  contentDiv.appendChild(titleLabel);
  contentDiv.appendChild(authorLabel);
  contentDiv.appendChild(publisherLabel);

  mainDiv.appendChild(dateLabel);
  mainDiv.appendChild(img);
  mainDiv.appendChild(contentDiv);

  // Return the complete element
  return mainDiv;
}

function createBookCardForList({
  publishedDate,
  thumbnail,
  title,
  authors,
  publisher,
}) {
  // Create main container div
  const container = document.createElement("div");
  container.className =
    "flex flex-row w-full border-1 border-gray-300 rounded-lg cursor-pointer border-1 border-zinc-500  transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-101";

  // Create image element
  const img = document.createElement("img");
  img.className = "rounded-tl-lg rounded-bl-lg";
  img.width = 150;
  img.src = thumbnail;
  img.alt = name;

  // Create content container div
  const contentDiv = document.createElement("div");
  contentDiv.className =
    "px-4 flex flex-col py-2 rounded-bl-2xl rounded-br-2xl gap-0 sm:gap-1 md:gap-2";

  // Create title label
  const titleLabel = document.createElement("label");
  titleLabel.className =
    "font-semibold text-slate-900 sm:text-base sm:text-md md:text-lg lg:text-xl 2xl:text-2xl";
  titleLabel.textContent = title;

  // Create authors label
  const authorsLabel = document.createElement("label");
  authorsLabel.className = "text-gray-400";
  authorsLabel.textContent = authors;

  // Create publisher label
  const publisherLabel = document.createElement("label");
  publisherLabel.className = "text-gray-400";
  publisherLabel.textContent = `Publisher: ${publisher}`;

  // Create published date label
  const dateLabel = document.createElement("label");
  dateLabel.className = "text-gray-400";
  dateLabel.textContent = `Published Date: ${publishedDate}`;

  // Assemble the card
  contentDiv.appendChild(titleLabel);
  contentDiv.appendChild(authorsLabel);
  contentDiv.appendChild(publisherLabel);
  contentDiv.appendChild(dateLabel);

  container.appendChild(img);
  container.appendChild(contentDiv);

  return container;
}

sortBySelect.addEventListener("change", function () {
  console.log(sortBySelect.selectedIndex);
  switch (sortBySelect.selectedIndex) {
    case 0:
      return;
    case 1:
      loadData(books.sort((a, b) => a.title.localeCompare(b.title)));
      return;
    case 2:
      loadData(
        books.sort((a, b) => {
          const dateA = new Date(a.publishedDate);
          const dateB = new Date(b.publishedDate);
          return dateA - dateB;
        })
      );
  }
});

function ErrorCard(message) {
  const div = document.createElement("div");
  div.classList = "text-3xl text-red-500";
  div.textContent = message;
  return div;
}
