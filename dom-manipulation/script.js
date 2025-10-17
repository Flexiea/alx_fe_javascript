// --- Quotes Array --- //
let quotes = [];

// --- Load Quotes from Local Storage --- //
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
      { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
      { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" }
    ];
    saveQuotes();
  }
}

// --- Save Quotes to Local Storage --- //
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// --- Display a Random Quote --- //
function displayRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");

  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <p><em>— ${quote.category}</em></p>
  `;

  // Store last viewed quote in session storage
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

// --- Create Add Quote Form (Required by ALX) --- //
function createAddQuoteForm() {
  const container = document.getElementById("quoteFormContainer");
  if (!container) return;

  const form = document.createElement("form");
  form.id = "addQuoteForm";

  // Input for quote text
  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.id = "newQuoteText";
  textInput.placeholder = "Enter a new quote";
  textInput.required = true;

  // Input for category
  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";
  categoryInput.required = true;

  // Submit button
  const addButton = document.createElement("button");
  addButton.type = "submit";
  addButton.textContent = "Add Quote";

  // Append inputs and button to form
  form.appendChild(textInput);
  form.appendChild(categoryInput);
  form.appendChild(addButton);

  // Append form to container
  container.appendChild(form);

  // Add submit handler
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const text = textInput.value.trim();
    const category = categoryInput.value.trim();

    if (text && category) {
      quotes.push({ text, category });
      saveQuotes();
      displayRandomQuote();
      textInput.value = "";
      categoryInput.value = "";
      alert("New quote added successfully!");
    }
  });
}

// --- Export Quotes to JSON File --- //
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// --- Import Quotes from JSON File --- //
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
        displayRandomQuote();
      } else {
        alert("Invalid JSON format.");
      }
    } catch (err) {
      alert("Error reading JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// --- Initialize on Page Load --- //
document.addEventListener("DOMContentLoaded", function () {
  loadQuotes();
  createAddQuoteForm();

  // Display last viewed quote if exists
  const lastViewed = sessionStorage.getItem("lastViewedQuote");
  if (lastViewed) {
    const quote = JSON.parse(lastViewed);
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `
      <p>"${quote.text}"</p>
      <p><em>— ${quote.category}</em></p>
    `;
  } else {
    displayRandomQuote();
  }
});
