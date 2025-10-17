// --- Quotes Array --- //
const quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
  { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" }
];

// --- DOM Elements --- //
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const formContainer = document.getElementById("formContainer");

// --- Function to Display a Random Quote --- //
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.innerHTML = "";

  const quoteText = document.createElement("p");
  quoteText.textContent = `"${quote.text}"`;

  const quoteCategory = document.createElement("p");
  quoteCategory.textContent = `— ${quote.category}`;
  quoteCategory.classList.add("category");

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

// --- Function to Add a New Quote --- //
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text === "" || category === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  quoteDisplay.innerHTML = `<p style="color: green;">New quote added successfully!</p>`;
  setTimeout(showRandomQuote, 1500);
}

// --- Function to Dynamically Create the Add Quote Form --- //
function createAddQuoteForm() {
  const formSection = document.createElement("div");
  formSection.classList.add("form-section");

  const inputText = document.createElement("input");
  inputText.id = "newQuoteText";
  inputText.type = "text";
  inputText.placeholder = "Enter a new quote";

  const inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.type = "text";
  inputCategory.placeholder = "Enter quote category";

  const addBtn = document.createElement("button");
  addBtn.id = "addQuoteBtn";
  addBtn.textContent = "Add Quote";

  // Event listener
  addBtn.addEventListener("click", addQuote);

  // Append all elements
  formSection.appendChild(inputText);
  formSection.appendChild(inputCategory);
  formSection.appendChild(addBtn);

  formContainer.appendChild(formSection);
}

// --- Event Listeners --- //
newQuoteBtn.addEventListener("click", showRandomQuote);

// --- Initialize Form on Page Load --- //
createAddQuoteForm();
