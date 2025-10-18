let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

/* -------------------------------
   🧩 TASK 0–1: Core Quote Generator
-------------------------------- */
function showRandomQuote() {
    if (quotes.length === 0) {
        alert("No quotes available!");
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteDisplay = document.getElementById("quoteDisplay");
    const categoryDisplay = document.getElementById("categoryDisplay");
    const selectedQuote = quotes[randomIndex];

    quoteDisplay.textContent = `"${selectedQuote.text}" — ${selectedQuote.author}`;
    categoryDisplay.textContent = `Category: ${selectedQuote.category || "Uncategorized"}`;
}

function addQuote(text, author, category) {
    const newQuote = {
        id: Date.now(),
        text,
        author,
        category: category || "Uncategorized",
        updatedAt: new Date().toISOString()
    };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories(); 
    postQuoteToServer(newQuote);
}

function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

/* -------------------------------
   🧩 TASK 2: Category Filtering System
-------------------------------- */
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    if (!categoryFilter) return;

    const categories = [...new Set(quotes.map(q => q.category || "Uncategorized"))];
    categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });

    const savedFilter = localStorage.getItem("selectedCategory");
    if (savedFilter) {
        categoryFilter.value = savedFilter;
        filterQuotes();
    }
}

function filterQuotes() {
    const categoryFilter = document.getElementById("categoryFilter");
    const selectedCategory = categoryFilter.value;
    localStorage.setItem("selectedCategory", selectedCategory);

    let filteredQuotes = quotes;
    if (selectedCategory !== "all") {
        filteredQuotes = quotes.filter(q => q.category === selectedCategory);
    }

    const quoteDisplay = document.getElementById("quoteDisplay");
    if (filteredQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        quoteDisplay.textContent = `"${filteredQuotes[randomIndex].text}" — ${filteredQuotes[randomIndex].author}`;
    } else {
        quoteDisplay.textContent = "No quotes available in this category.";
    }
}

/* -------------------------------
   🧩 TASK 3: Server Sync + Conflict Handling
-------------------------------- */
async function fetchQuotesFromServer() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        const serverData = await response.json();

        const serverQuotes = serverData.slice(0, 5).map(item => ({
            id: item.id,
            text: item.title,
            author: "Server",
            category: "Server Data",
            updatedAt: new Date().toISOString(),
        }));

        syncQuotes(serverQuotes);
    } catch (error) {
        console.error("Error fetching server quotes:", error);
    }
}

async function postQuoteToServer(quote) {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(quote)
        });
        const data = await response.json();
        console.log("Quote posted:", data);
    } catch (error) {
        console.error("Error posting quote:", error);
    }
}

function syncQuotes(serverQuotes) {
    let updated = false;

    serverQuotes.forEach(serverQuote => {
        const localQuote = quotes.find(q => q.id === serverQuote.id);
        if (!localQuote) {
            quotes.push(serverQuote);
            updated = true;
        } else if (new Date(serverQuote.updatedAt) > new Date(localQuote.updatedAt)) {
            Object.assign(localQuote, serverQuote);
            updated = true;
        }
    });

    if (updated) {
        alert("Quotes synced with server!");
        saveQuotes();
    }
}

/* -------------------------------
   🧩 FORM CREATION + EVENT LISTENERS
-------------------------------- */
function createAddQuoteForm() {
    const form = document.createElement("form");
    form.innerHTML = `
        <input type="text" id="quoteText" placeholder="Enter quote" required />
        <input type="text" id="quoteAuthor" placeholder="Author" required />
        <input type="text" id="quoteCategory" placeholder="Category" required />
        <button type="submit">Add Quote</button>
    `;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = document.getElementById("quoteText").value;
        const author = document.getElementById("quoteAuthor").value;
        const category = document.getElementById("quoteCategory").value;
        addQuote(text, author, category);
        alert("Quote added and synced with server!");
        form.reset();
    });

    document.body.appendChild(form);
}

/* -------------------------------
   🧩 TASK 1: Export Quotes as JSON (Uses Blob)
-------------------------------- */
function exportQuotes() {
    if (quotes.length === 0) {
        alert("No quotes available to export!");
        return;
    }

    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "quotes.json";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert("Quotes exported successfully!");
}

/* -------------------------------
   🧩 TASK 1: Import Quotes using FileReader
-------------------------------- */
function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) {
        alert("No file selected.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (!Array.isArray(importedQuotes)) {
                alert("Invalid JSON format.");
                return;
            }

            importedQuotes.forEach(q => {
                quotes.push({
                    text: q.text || q.title,
                    author: q.author || "Unknown",
                    category: q.category || "Imported"
                });
            });

            saveQuotes();
            populateCategories();
            alert("Quotes imported successfully!");
        } catch (err) {
            console.error("Import failed:", err);
            alert("Failed to import JSON file.");
        }
    };

    reader.readAsText(file);
}

/* -------------------------------
   🚀 INITIALIZE
-------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    createAddQuoteForm();
    populateCategories();

    document.getElementById("showQuoteBtn").addEventListener("click", showRandomQuote);
    document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
    document.getElementById("syncQuotesBtn").addEventListener("click", fetchQuotesFromServer);

    fetchQuotesFromServer();
    setInterval(fetchQuotesFromServer, 30000);
});
