// --- Quotes Array (Load from Local Storage if available) --- //
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
  { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" }
];

// --- DOM Elements --- //
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const exportBtn = document.getElementById("exportBtn");
const importFile = document.getElementById("importFile");

// --- Function to Display a Random Quote --- //
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  // Save last viewed quote in sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));

  // Clear and update display
  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <p class="category">— ${quote.category}</p>
  `;
}

// --- Function to Add a New Quote --- //
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text === "" || category === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();

  textInput.value = "";
  categoryInput.value = "";

  quoteDisplay.innerHTML = `<p style="color: green;">New quote added successfully!</p>`;
  setTimeout(showRandomQuote, 1500);
}

// --- Save Quotes to Local Storage --- //
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// --- Export Quotes to JSON File --- //
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();

  URL.revokeObjectURL(url);
}

// --- Import Quotes from JSON File --- //
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error("Invalid file format.");

      quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
      showRandomQuote();
    } catch (error) {
      alert("Error importing quotes: " + error.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// --- Event Listeners --- //
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
exportBtn.addEventListener("click", exportToJsonFile);
importFile.addEventListener("change", importFromJsonFile);

// --- Initialize on Page Load --- //
const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
if (lastQuote) {
  quoteDisplay.innerHTML = `"${lastQuote.text}" — ${lastQuote.category}`;
} else {
  showRandomQuote();
}
