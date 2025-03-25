const bookContainer = document.getElementById("bookContainer");
const searchInput = document.getElementById("searchInput");
const mainDiv = document.getElementById("mainDiv");

let books = [];
let currentPage = 1;
let totalitems = 0;

async function fetchData(url) {
  books = [];
  // add try catch here
  const response = await fetch(url);
  const data = await response.json();

  totalitems = data.data.totalItems;

  data.data.data.map((book) => {
    const id = book.id;
    const title = book.volumeInfo.title;
    const authors = book.volumeInfo.authors.join();
    const publisher = book.volumeInfo.publisher;
    const thumbnail = book.volumeInfo.imageLinks.smallThumbnail;
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
}

document.addEventListener("DOMContentLoaded", async () => {
  await fetchData(
    `https://api.freeapi.app/api/v1/public/books?page=${currentPage}&limit=10`
  );

  //   const pagination = createPagination(totalitems, 1, 10);
  //   mainDiv.appendChild(pagination);
});

function loadData(arr) {
  //bookContainer.innerHTML = "";
  arr.map((book) => {
    const card = createBookCard({ ...book });
    card.addEventListener("click", function () {
      window.open(book.infoLink);
    });
    bookContainer.appendChild(card);
  });

  const loadMoreBtn = document.createElement("button");
}

function createBookCard({
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
  img.src = thumbnail;
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
  if (authorsString.length >= 25)
    authorsString = `${authorsString.substring(0, 25)}...`;
  authorLabel.title = authors;
  authorLabel.textContent = `${authorsString}`;

  // Create and configure publisher label
  const publisherLabel = document.createElement("label");
  publisherLabel.className = "text-sm text-slate-700";
  if (publisher.length >= 20) publisher = `${publisher.substring(0, 18)}...`;
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

searchInput.addEventListener("input", function () {
  let searchedBook = [];
  const inputText = searchInput.value.toString().trim().toLowerCase();
  console.log(inputText.toLowerCase());

  searchedBook = books.filter((book) => {
    const authors = book.authors ? book.authors.toLowerCase() : "";
    const title = book.title ? book.title.toLowerCase() : "";

    return authors.includes(inputText) || title.includes(inputText);
  });

  loadData(searchedBook);
});

function createPagination(totalEntries, currentPage = 1, itemsPerPage = 10) {
  // Calculate total pages and current range
  const totalPages = Math.ceil(totalEntries / itemsPerPage);

  const startEntry = (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, totalEntries);

  // Main container
  const container = document.createElement("div");
  container.className = "flex flex-col items-center";

  // Help text
  const helpText = document.createElement("span");
  helpText.className = "text-sm text-zinc-900 ";
  helpText.innerHTML = `Showing 
        <span class="font-semibold text-zinc-900 ">${startEntry}</span> to 
        <span class="font-semibold text-zinc-900 ">${endEntry}</span> of 
        <span class="font-semibold text-zinc-900 ">${totalEntries}</span> 
        Entries`;

  // Button container
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "inline-flex mt-2 xs:mt-0";

  // Previous button
  const prevButton = document.createElement("button");
  prevButton.className =
    "flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";
  prevButton.disabled = currentPage === 1;

  const prevSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  prevSvg.className = "w-3.5 h-3.5 me-2 rtl:rotate-180";
  prevSvg.setAttribute("aria-hidden", "true");
  prevSvg.setAttribute("fill", "none");
  prevSvg.setAttribute("viewBox", "0 0 14 10");

  const prevPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  prevPath.setAttribute("stroke", "currentColor");
  prevPath.setAttribute("stroke-linecap", "round");
  prevPath.setAttribute("stroke-linejoin", "round");
  prevPath.setAttribute("stroke-width", "2");
  prevPath.setAttribute("d", "M13 5H1m0 0 4 4M1 5l4-4");

  prevSvg.appendChild(prevPath);
  prevButton.appendChild(prevSvg);
  prevButton.appendChild(document.createTextNode("Prev"));

  // Next button
  const nextButton = document.createElement("button");
  nextButton.className =
    "flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";
  nextButton.disabled = currentPage === totalPages;

  const nextSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  nextSvg.className = "w-3.5 h-3.5 ms-2 rtl:rotate-180";
  nextSvg.setAttribute("aria-hidden", "true");
  nextSvg.setAttribute("fill", "none");
  nextSvg.setAttribute("viewBox", "0 0 14 10");

  const nextPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  nextPath.setAttribute("stroke", "currentColor");
  nextPath.setAttribute("stroke-linecap", "round");
  nextPath.setAttribute("stroke-linejoin", "round");
  nextPath.setAttribute("stroke-width", "2");
  nextPath.setAttribute("d", "M1 5h12m0 0L9 1m4 4L9 9");

  nextSvg.appendChild(nextPath);
  nextButton.appendChild(document.createTextNode("Next"));
  nextButton.appendChild(nextSvg);

  // Assemble the structure
  buttonContainer.appendChild(prevButton);
  buttonContainer.appendChild(nextButton);
  container.appendChild(helpText);
  container.appendChild(buttonContainer);

  // Add click handlers
  prevButton.onclick = () => {
    if (currentPage > 1) {
      updatePagination(currentPage - 1);
    }
  };

  nextButton.onclick = () => {
    if (currentPage < totalPages) {
      updatePagination(currentPage + 1);
    }
  };

  // Function to update pagination
  async function updatePagination(newPage) {
    const newPagination = createPagination(totalEntries, newPage, itemsPerPage);
    container.replaceWith(newPagination);
    // You could add a callback here to load new data

    console.log(newPage);

    currentPage = newPage;

    await fetchData(
      `https://api.freeapi.app/api/v1/public/books?page=${newPage}&limit=10`
    );
  }

  return container;
}
