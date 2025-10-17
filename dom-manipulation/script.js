// ===== Dynamic Quote Generator with Filtering and Web Storage =====

// Load saved quotes or defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Believe you can and you're halfway there.", category: "Motivation" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

// ===== FUNCTIONS =====

// Display a random quote (with filtering)
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const selectedCategory = document.getElementById("categoryFilter").value;

  // Filter quotes if not 'all'
  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available in this category.";
    return;
  }

  const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  quoteDisplay.textContent = `"${randomQuote.text}" — ${randomQuote.category}`;
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

// Create Add Quote form dynamically
function createAddQuoteForm() {
  const container = document.getElementById("addQuoteSection");
  container.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button id="addQuoteBtn">Add Quote</button>
  `;
  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    alert("Quote added successfully!");
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  } else {
    alert("Please enter both quote text and category.");
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate unique categories in dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const selectedValue = categoryFilter.value;

  // Get unique categories
  const categories = [...new Set(quotes.map(q => q.category))];

  // Reset dropdown
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.toLowerCase();
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore previously selected filter
  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    categoryFilter.value = savedFilter;
  }
}

// Filter quotes by selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);
  showRandomQuote();
}

// Export quotes as JSON
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// ===== EVENT LISTENERS =====
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("exportBtn").addEventListener("click", exportQuotes);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);

// ===== INITIALIZE =====
createAddQuoteForm();
populateCategories();
filterQuotes();
